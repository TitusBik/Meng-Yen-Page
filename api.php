<?php
declare(strict_types=1);

session_start();
require __DIR__ . '/config.php';

$action = $_GET['action'] ?? '';
$body = requestBody();

try {
    $pdo = database();

    if ($action === 'login') {
        $email = trim((string) ($body['email'] ?? ''));
        $password = (string) ($body['password'] ?? '');
        $statement = $pdo->prepare('SELECT id, email, password_hash, name, phone, bio, avatar_url FROM users WHERE email = ? LIMIT 1');
        $statement->execute([$email]);
        $user = $statement->fetch();
        if (!$user || !password_verify($password, $user['password_hash'])) {
            jsonResponse(['error' => 'Invalid username or password.'], 401);
        }
        unset($user['password_hash']);
        $_SESSION['user_id'] = (int) $user['id'];
        jsonResponse(['user' => $user]);
    }

    if ($action === 'session') {
        if (empty($_SESSION['user_id'])) {
            jsonResponse(['user' => null]);
        }
        $statement = $pdo->prepare('SELECT id, email, name, phone, bio, avatar_url FROM users WHERE id = ?');
        $statement->execute([(int) $_SESSION['user_id']]);
        jsonResponse(['user' => $statement->fetch() ?: null]);
    }

    if ($action === 'logout') {
        $_SESSION = [];
        session_destroy();
        jsonResponse(['ok' => true]);
    }

    if ($action === 'profile') {
        $userId = requireUser();
        if ($_SERVER['REQUEST_METHOD'] === 'GET') {
            $statement = $pdo->prepare('SELECT id, email, name, phone, bio, avatar_url FROM users WHERE id = ?');
            $statement->execute([$userId]);
            jsonResponse(['profile' => $statement->fetch()]);
        }
        $statement = $pdo->prepare('UPDATE users SET name = ?, phone = ?, bio = ?, avatar_url = ? WHERE id = ?');
        $statement->execute([
            trim((string) ($body['full_name'] ?? '')),
            nullableText($body['phone'] ?? null),
            nullableText($body['bio'] ?? null),
            nullableText($body['avatar_url'] ?? null),
            $userId,
        ]);
        $statement = $pdo->prepare('SELECT id, email, name, phone, bio, avatar_url FROM users WHERE id = ?');
        $statement->execute([$userId]);
        jsonResponse(['user' => $statement->fetch()]);
    }

    if ($action === 'reference') {
        $categories = $pdo->query('SELECT id, name FROM property_categories ORDER BY name')->fetchAll();
        $cities = $pdo->query('SELECT id, name, state FROM cities ORDER BY name')->fetchAll();
        jsonResponse(['categories' => $categories, 'cities' => $cities]);
    }

    if ($action === 'schedule-tour') {
        $requiredFields = [
            'property_title', 'category', 'selected_date', 'tour_time',
            'tour_type', 'contact_name', 'contact_email', 'contact_phone',
            'contact_message',
        ];
        foreach ($requiredFields as $field) {
            if (trim((string) ($body[$field] ?? '')) === '') {
                jsonResponse(['error' => 'Please complete all tour request fields.'], 422);
            }
        }
        $email = trim((string) $body['contact_email']);
        if (!filter_var($email, FILTER_VALIDATE_EMAIL)) {
            jsonResponse(['error' => 'Please enter a valid email address.'], 422);
        }
        if (!in_array($body['tour_type'], ['in_person', 'video_chat'], true)) {
            jsonResponse(['error' => 'Please choose a valid tour type.'], 422);
        }
        $allowedTimes = [
            '10:00 am', '10:30 am', '11:00 am', '11:30 am', '12:00 pm',
            '12:30 pm', '1:00 pm', '1:30 pm', '2:00 pm', '2:30 pm',
            '3:00 pm', '3:30 pm', '4:00 pm', '4:30 pm', '5:00 pm',
        ];
        if (!in_array(strtolower((string) $body['tour_time']), $allowedTimes, true)) {
            jsonResponse(['error' => 'Please choose a valid tour time.'], 422);
        }
        $subject = 'Property tour request: ' . str_replace(["\r", "\n"], ' ', (string) $body['property_title']);
        $tourType = $body['tour_type'] === 'video_chat' ? 'Video Chat' : 'In Person';
        $mailBody = implode("\n", [
            'Property: ' . $body['property_title'],
            'Category: ' . $body['category'],
            'Date: ' . $body['selected_date'],
            'Time: ' . $body['tour_time'],
            'Tour type: ' . $tourType,
            'Name: ' . $body['contact_name'],
            'Email: ' . $email,
            'Phone: ' . $body['contact_phone'],
            '',
            'Message:',
            $body['contact_message'],
        ]);
        $headers = implode("\r\n", [
            'From: Website Tour Request <cmyen.property@gmail.com>',
            'Reply-To: ' . $email,
            'Content-Type: text/plain; charset=UTF-8',
        ]);
        if (!mail('cmyen.property@gmail.com', $subject, $mailBody, $headers)) {
            jsonResponse(['error' => 'We could not send your tour request right now. Please contact us by phone.'], 500);
        }
        jsonResponse(['ok' => true]);
    }

    if ($action === 'featured-listings') {
        $statement = $pdo->query(
            "SELECT p.id, p.title, p.price, p.price_type, p.address, p.area, p.media,
                    pc.name AS category_name, c.name AS city_name
             FROM properties p
             LEFT JOIN property_categories pc ON pc.id = p.category_id
             LEFT JOIN cities c ON c.id = p.city_id
             WHERE p.is_featured = 1
             ORDER BY p.created_at DESC
             LIMIT 12",
        );
        $properties = $statement->fetchAll();
        foreach ($properties as &$property) {
            $property['media'] = is_string($property['media'])
                ? (json_decode($property['media'], true) ?: [])
                : [];
        }
        unset($property);
        jsonResponse(['properties' => $properties]);
    }

    if ($action === 'commercial-listings') {
        $conditions = ["pc.name = 'Commercial'"];
        $parameters = [];
        $from = trim((string) ($_GET['from'] ?? ''));
        $to = trim((string) ($_GET['to'] ?? ''));
        $cityId = (int) ($_GET['city_id'] ?? 0);
        if ($from !== '' && is_numeric($from)) {
            $conditions[] = 'p.price >= ?';
            $parameters[] = (float) $from;
        }
        if ($to !== '' && is_numeric($to)) {
            $conditions[] = 'p.price <= ?';
            $parameters[] = (float) $to;
        }
        if ($cityId > 0) {
            $conditions[] = 'p.city_id = ?';
            $parameters[] = $cityId;
        }
        $statement = $pdo->prepare(
            'SELECT p.id, p.title, p.description, p.price, p.price_type, p.address, p.area,
                    p.postcode, p.bedrooms, p.bathrooms, p.car_parks, p.media,
                    c.name AS city_name, c.state
             FROM properties p
             LEFT JOIN property_categories pc ON pc.id = p.category_id
             LEFT JOIN cities c ON c.id = p.city_id
             WHERE ' . implode(' AND ', $conditions) . '
             ORDER BY p.created_at DESC',
        );
        $statement->execute($parameters);
        $properties = $statement->fetchAll();
        foreach ($properties as &$property) {
            $property['media'] = is_string($property['media'])
                ? (json_decode($property['media'], true) ?: [])
                : [];
        }
        unset($property);
        $cities = $pdo->query('SELECT id, name, state FROM cities ORDER BY name')->fetchAll();
        jsonResponse(['properties' => $properties, 'cities' => $cities]);
    }

    if ($action === 'property-listings') {
        $category = trim((string) ($_GET['category'] ?? ''));
        if ($category === '') {
            jsonResponse(['error' => 'A property category is required.'], 422);
        }
        $conditions = ['pc.name = ?'];
        $parameters = [$category];
        $from = trim((string) ($_GET['from'] ?? ''));
        $to = trim((string) ($_GET['to'] ?? ''));
        $cityId = (int) ($_GET['city_id'] ?? 0);
        if ($from !== '' && is_numeric($from)) {
            $conditions[] = 'p.price >= ?';
            $parameters[] = (float) $from;
        }
        if ($to !== '' && is_numeric($to)) {
            $conditions[] = 'p.price <= ?';
            $parameters[] = (float) $to;
        }
        if ($cityId > 0) {
            $conditions[] = 'p.city_id = ?';
            $parameters[] = $cityId;
        }
        $statement = $pdo->prepare(
            'SELECT p.id, p.title, p.description, p.price, p.price_type, p.address, p.area,
                    p.postcode, p.bedrooms, p.bathrooms, p.car_parks, p.media,
                    c.name AS city_name, c.state
             FROM properties p
             LEFT JOIN property_categories pc ON pc.id = p.category_id
             LEFT JOIN cities c ON c.id = p.city_id
             WHERE ' . implode(' AND ', $conditions) . '
             ORDER BY p.created_at DESC',
        );
        $statement->execute($parameters);
        $properties = $statement->fetchAll();
        foreach ($properties as &$property) {
            $property['media'] = is_string($property['media'])
                ? (json_decode($property['media'], true) ?: [])
                : [];
        }
        unset($property);
        jsonResponse([
            'properties' => $properties,
            'cities' => $pdo->query('SELECT id, name, state FROM cities ORDER BY name')->fetchAll(),
        ]);
    }

    if ($action === 'commercial-listing') {
        $listingId = (int) ($_GET['id'] ?? 0);
        if ($listingId < 1) {
            jsonResponse(['error' => 'A listing id is required.'], 422);
        }
        $statement = $pdo->prepare(
            "SELECT p.*, pc.name AS category_name, c.name AS city_name, c.state
             FROM properties p
             LEFT JOIN property_categories pc ON pc.id = p.category_id
             LEFT JOIN cities c ON c.id = p.city_id
             WHERE p.id = ? AND pc.name = 'Commercial'
             LIMIT 1",
        );
        $statement->execute([$listingId]);
        $property = $statement->fetch();
        if (!$property) {
            jsonResponse(['error' => 'Commercial listing not found.'], 404);
        }
        $property['media'] = is_string($property['media'])
            ? (json_decode($property['media'], true) ?: [])
            : [];
        jsonResponse(['property' => $property]);
    }

    if ($action === 'property-detail') {
        $listingId = (int) ($_GET['id'] ?? 0);
        $category = trim((string) ($_GET['category'] ?? ''));
        if ($listingId < 1 || $category === '') {
            jsonResponse(['error' => 'A listing and category are required.'], 422);
        }
        $statement = $pdo->prepare(
            'SELECT p.*, pc.name AS category_name, c.name AS city_name, c.state
             FROM properties p
             LEFT JOIN property_categories pc ON pc.id = p.category_id
             LEFT JOIN cities c ON c.id = p.city_id
             WHERE p.id = ? AND pc.name = ? LIMIT 1',
        );
        $statement->execute([$listingId, $category]);
        $property = $statement->fetch();
        if (!$property) {
            jsonResponse(['error' => 'Listing not found.'], 404);
        }
        $property['media'] = is_string($property['media'])
            ? (json_decode($property['media'], true) ?: [])
            : [];
        jsonResponse(['property' => $property]);
    }

    $userId = requireUser();

    if ($action === 'upload-images') {
        $propertyId = (int) ($_POST['property_id'] ?? 0);
        if ($propertyId < 1) {
            jsonResponse(['error' => 'A saved property is required before uploading photos.'], 422);
        }
        $statement = $pdo->prepare('SELECT id FROM properties WHERE id = ? AND user_id = ?');
        $statement->execute([$propertyId, $userId]);
        if (!$statement->fetch()) {
            jsonResponse(['error' => 'Property not found.'], 404);
        }
        if (empty($_FILES['images']) || !is_array($_FILES['images']['tmp_name'])) {
            jsonResponse(['error' => 'No property photos were uploaded.'], 422);
        }

        $directory = __DIR__ . DIRECTORY_SEPARATOR . 'assets' . DIRECTORY_SEPARATOR . 'image' . DIRECTORY_SEPARATOR . 'properties';
        if (!is_dir($directory) && !mkdir($directory, 0755, true) && !is_dir($directory)) {
            throw new RuntimeException('Unable to create the property photo directory.');
        }
        $allowedTypes = ['image/jpeg' => 'jpg', 'image/png' => 'png', 'image/webp' => 'webp'];
        $paths = [];
        $fileInfo = new finfo(FILEINFO_MIME_TYPE);
        foreach ($_FILES['images']['tmp_name'] as $index => $temporaryPath) {
            if ($_FILES['images']['error'][$index] !== UPLOAD_ERR_OK || $_FILES['images']['size'][$index] > 3 * 1024 * 1024) {
                jsonResponse(['error' => 'Each property photo must be a valid image smaller than 3 MB.'], 422);
            }
            $mimeType = $fileInfo->file($temporaryPath);
            if (!isset($allowedTypes[$mimeType])) {
                jsonResponse(['error' => 'Only JPG, PNG, and WebP property photos are allowed.'], 422);
            }
            $filename = bin2hex(random_bytes(16)) . '.' . $allowedTypes[$mimeType];
            if (!move_uploaded_file($temporaryPath, $directory . DIRECTORY_SEPARATOR . $filename)) {
                throw new RuntimeException('Unable to save a property photo.');
            }
            $paths[] = 'assets/image/properties/' . $filename;
        }
        jsonResponse(['paths' => $paths]);
    }

    if ($action === 'properties') {
        if ($_SERVER['REQUEST_METHOD'] === 'GET') {
            $id = $_GET['id'] ?? null;
            if ($id !== null) {
                $statement = $pdo->prepare('SELECT * FROM properties WHERE id = ? AND user_id = ?');
                $statement->execute([(int) $id, $userId]);
                $property = $statement->fetch() ?: null;
                if ($property && is_string($property['media'])) {
                    $property['media'] = json_decode($property['media'], true);
                }
                jsonResponse(['property' => $property]);
            }
            $countStatement = $pdo->prepare('SELECT COUNT(*) FROM properties WHERE user_id = ?');
            $countStatement->execute([$userId]);
            $count = (int) $countStatement->fetchColumn();
            $featuredCountStatement = $pdo->prepare('SELECT COUNT(*) FROM properties WHERE user_id = ? AND is_featured = 1');
            $featuredCountStatement->execute([$userId]);
            $featuredCount = (int) $featuredCountStatement->fetchColumn();
            $statement = $pdo->prepare('SELECT id, title, address, listing_type, price, media FROM properties WHERE user_id = ? ORDER BY created_at DESC LIMIT 5');
            $statement->execute([$userId]);
            $properties = $statement->fetchAll();
            foreach ($properties as &$property) {
                $property['media'] = is_string($property['media'])
                    ? (json_decode($property['media'], true) ?: [])
                    : [];
            }
            unset($property);
            jsonResponse(['count' => $count, 'featured_count' => $featuredCount, 'properties' => $properties]);
        }

        $fields = [
            'title', 'description', 'listing_type', 'price', 'is_featured', 'category_id', 'city_id', 'other_city',
            'price_type', 'built_up_size', 'built_up_length', 'built_up_width', 'built_up_unit', 'land_size',
            'land_length', 'land_width', 'land_unit', 'bedrooms',
            'bathrooms', 'car_parks', 'floors', 'furnishing', 'tenure', 'expiry_year', 'year_built',
            'ceiling_height', 'floor_loading', 'power_supply', 'direction', 'bumi_status',
            'maintenance_fee', 'address', 'area', 'postcode', 'media',
        ];
        $values = [];
        foreach ($fields as $field) {
            $values[$field] = in_array($field, ['media'], true)
                ? json_encode($body[$field] ?? null, JSON_UNESCAPED_SLASHES)
                : (in_array($field, ['price', 'built_up_size', 'built_up_length', 'built_up_width', 'land_size', 'land_length', 'land_width', 'bedrooms', 'bathrooms', 'car_parks', 'expiry_year', 'year_built', 'ceiling_height', 'floor_loading', 'maintenance_fee', 'category_id', 'city_id'], true)
                    ? nullableNumber($body[$field] ?? null)
                    : ($field === 'is_featured'
                        ? (!empty($body[$field]) ? 1 : 0)
                        : nullableText($body[$field] ?? null)));
        }

        if (!empty($body['id'])) {
            $assignments = implode(', ', array_map(static fn ($field) => "$field = ?", $fields));
            $statement = $pdo->prepare("UPDATE properties SET $assignments WHERE id = ? AND user_id = ?");
            $statement->execute([...array_values($values), (int) $body['id'], $userId]);
        } else {
            $values['user_id'] = $userId;
            $values['property_code'] = 'MY-' . strtoupper(base_convert((string) time(), 10, 36));
            $values['slug'] = strtolower(preg_replace('/[^a-z0-9]+/i', '-', trim((string) $values['title']))) . '-' . time();
            $columns = array_keys($values);
            $statement = $pdo->prepare(
                'INSERT INTO properties (' . implode(', ', $columns) . ') VALUES (' . implode(', ', array_fill(0, count($columns), '?')) . ')',
            );
            $statement->execute(array_values($values));
        }
        jsonResponse(['ok' => true, 'id' => (int) ($body['id'] ?? $pdo->lastInsertId())]);
    }

    jsonResponse(['error' => 'Unknown API action.'], 404);
} catch (Throwable $error) {
    error_log($error->getMessage());
    jsonResponse(['error' => 'The server could not complete that request.'], 500);
}
