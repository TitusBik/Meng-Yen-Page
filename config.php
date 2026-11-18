<?php

declare(strict_types=1);

$isLocalhost = in_array($_SERVER['SERVER_NAME'] ?? 'localhost', ['localhost', '127.0.0.1'], true);

if ($isLocalhost) {
    // XAMPP on your computer
    define('DB_HOST', 'localhost');
    define('DB_NAME', 'meng_yen');
    define('DB_USER', 'root');
    define('DB_PASSWORD', '');
} else {
    // Live hosting
    define('DB_HOST', 'localhost');
    define('DB_NAME', 'johorcom_');
    define('DB_USER', 'mengyen');
    define('DB_PASSWORD', 'AdminMengYen');
}

function database(): PDO
{
    static $pdo;
    if ($pdo instanceof PDO) {
        return $pdo;
    }

    $pdo = new PDO(
        'mysql:host=' . DB_HOST . ';dbname=' . DB_NAME . ';charset=utf8mb4',
        DB_USER,
        DB_PASSWORD,
        [
            PDO::ATTR_ERRMODE => PDO::ERRMODE_EXCEPTION,
            PDO::ATTR_DEFAULT_FETCH_MODE => PDO::FETCH_ASSOC,
            PDO::ATTR_EMULATE_PREPARES => false,
        ],
    );

    return $pdo;
}

function jsonResponse(array $payload, int $status = 200): never
{
    http_response_code($status);
    header('Content-Type: application/json; charset=utf-8');
    echo json_encode($payload, JSON_UNESCAPED_SLASHES);
    exit;
}

function requestBody(): array
{
    $body = json_decode(file_get_contents('php://input'), true);
    return is_array($body) ? $body : [];
}

function requireUser(): int
{
    if (empty($_SESSION['user_id'])) {
        jsonResponse(['error' => 'Authentication required.'], 401);
    }
    return (int) $_SESSION['user_id'];
}

function nullableNumber(mixed $value): ?float
{
    return $value === null || $value === '' ? null : (float) $value;
}

function nullableText(mixed $value): ?string
{
    return $value === null || $value === '' ? null : trim((string) $value);
}
