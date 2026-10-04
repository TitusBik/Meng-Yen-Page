<?php
$formStatus = '';
$formStatusType = '';
$formValues = [
  'title' => '',
  'name' => '',
  'contact_no' => '',
  'email' => '',
  'subject' => '',
  'message' => '',
];

if ($_SERVER['REQUEST_METHOD'] === 'POST') {
  foreach ($formValues as $field => $value) {
    $formValues[$field] = trim((string) ($_POST[$field] ?? ''));
  }

  $errors = [];
  if (!in_array($formValues['title'], ['Mr', 'Ms', 'Mrs'], true)) {
    $errors[] = 'Please select a title.';
  }
  if ($formValues['name'] === '') {
    $errors[] = 'Please enter your name.';
  }
  if ($formValues['contact_no'] === '') {
    $errors[] = 'Please enter your contact number.';
  }
  if (!filter_var($formValues['email'], FILTER_VALIDATE_EMAIL)) {
    $errors[] = 'Please enter a valid email address.';
  }
  if ($formValues['subject'] === '') {
    $errors[] = 'Please enter a subject.';
  }
  if ($formValues['message'] === '') {
    $errors[] = 'Please enter your message.';
  }

  if ($errors !== []) {
    $formStatus = implode(' ', $errors);
    $formStatusType = 'error';
  } else {
    $recipient = 'cmyen.property@gmail.com';
    $safeSubject = str_replace(["\r", "\n"], ' ', $formValues['subject']);
    $mailSubject = 'Website enquiry: ' . $safeSubject;
    $mailBody = implode("\n", [
      'Title: ' . $formValues['title'],
      'Name: ' . $formValues['name'],
      'Contact No: ' . $formValues['contact_no'],
      'Email: ' . $formValues['email'],
      '',
      'Message:',
      $formValues['message'],
    ]);
    $mailHeaders = [
      'From: Website Enquiry <cmyen.property@gmail.com>',
      'Reply-To: ' . $formValues['email'],
      'Content-Type: text/plain; charset=UTF-8',
    ];

    if (mail($recipient, $mailSubject, $mailBody, implode("\r\n", $mailHeaders))) {
      $formStatus = 'Thank you. Your enquiry has been sent successfully.';
      $formStatusType = 'success';
      foreach ($formValues as $field => $value) {
        $formValues[$field] = '';
      }
    } else {
      $formStatus = 'We could not send your enquiry right now. Please contact us by email or phone.';
      $formStatusType = 'error';
    }
  }
}

function escapeContactValue(string $value): string
{
  return htmlspecialchars($value, ENT_QUOTES, 'UTF-8');
}
?>
<!doctype html>
<html lang="en">

<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <meta name="description" content="Meng-Yen — Contact Me" />
  <title>Contact Me — Meng-Yen</title>
  <link rel="stylesheet" href="../public/css/styles.css" />
  <link rel="preconnect" href="https://fonts.googleapis.com" />
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin />
  <link
    href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600&family=Manrope:wght@600;700;800&display=swap"
    rel="stylesheet" />
</head>

<body class="bg-paper text-ink antialiased">
  <div data-navbar></div>
  <main class="mx-auto max-w-7xl px-6 py-16 lg:px-10">
    <h1 class="font-display text-5xl font-extrabold tracking-tight">
      Contact Me
    </h1>
    <div class="mt-12 grid gap-10 lg:grid-cols-2 lg:items-start">
      <section aria-labelledby="contact-details-title">
        <h2
          id="contact-details-title"
          class="font-display text-3xl font-extrabold tracking-tight">
          CBD Properties Permas Jaya
        </h2>
        <address class="mt-6 text-lg not-italic leading-8 text-muted">
          <p>
            <span class="font-semibold text-ink">Address</span><br />
            10, Jalan Permas 10/7, Bandar Baru Permas Jaya,<br />
            81750 Masai, Johor Darul Ta'zim
          </p>
          <dl class="mt-6 grid gap-3">
            <div>
              <dt class="font-semibold text-ink">Email</dt>
              <dd>
                <a
                  class="underline decoration-muted/40 underline-offset-4 hover:text-ink"
                  href="mailto:cmyen.property@gmail.com">
                  cmyen.property@gmail.com
                </a>
              </dd>
            </div>
            <div>
              <dt class="font-semibold text-ink">Mobile No</dt>
              <dd>
                <a
                  class="underline decoration-muted/40 underline-offset-4 hover:text-ink"
                  href="tel:01116457701">
                  011-16457701
                </a>
              </dd>
            </div>
            <div>
              <dt class="font-semibold text-ink">Office No</dt>
              <dd>
                <a
                  class="underline decoration-muted/40 underline-offset-4 hover:text-ink"
                  href="tel:073822372">
                  07 382 2372
                </a>
              </dd>
            </div>
          </dl>
        </address>

        <div class="mt-8">
          <h3 class="font-display text-2xl font-extrabold">Follow Me</h3>
          <nav class="mt-4 flex flex-wrap gap-3" aria-label="Social media">
            <a
              class="rounded-full bg-[#1877f2] px-5 py-3 text-base font-semibold text-white transition hover:bg-[#0d65d9]"
              href="https://www.facebook.com/CMYenProperty"
              target="_blank"
              rel="noopener noreferrer">
              Facebook
            </a>
            <a
              class="rounded-full bg-gradient-to-r from-[#833ab4] via-[#fd1d1d] to-[#fcb045] px-5 py-3 text-base font-semibold text-white transition hover:brightness-110"
              href="https://www.instagram.com/cmyen_property?stkn=M2ZmYThmM2kzajF6"
              target="_blank"
              rel="noopener noreferrer">
              Instagram
            </a>
            <a
              class="rounded-full bg-black px-5 py-3 text-base font-semibold text-white transition hover:bg-zinc-800"
              href="https://www.tiktok.com/@cmyen.property?_r=1&_t=ZS-99zNEcbc9EW"
              target="_blank"
              rel="noopener noreferrer">
              TikTok
            </a>
            <a
              class="rounded-full bg-[#ff2442] px-5 py-3 text-base font-semibold text-white transition hover:bg-[#dc1733]"
              href="https://xhslink.cn/m/x8zmsBjxKG"
              target="_blank"
              rel="noopener noreferrer">
              XiaoHongShu
            </a>
          </nav>
        </div>
      </section>

      <section aria-labelledby="map-title">
        <h2 id="map-title" class="font-display text-3xl font-extrabold tracking-tight">
          Find Us
        </h2>
        <div class="mt-6 overflow-hidden rounded-2xl">
          <iframe
            src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d1994.228903028714!2d103.8139468046733!3d1.4963216688046626!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x31da6d004d66f1bd%3A0xfabb68ac559c9e0e!2sCBD%20PROPERTIES%20SDN%20BHD!5e0!3m2!1sen!2smy!4v1791092184157!5m2!1sen!2smy"
            class="h-[450px] w-full border-0"
            title="CBD Properties Sdn Bhd location map"
            allowfullscreen
            loading="lazy"
            referrerpolicy="strict-origin-when-cross-origin"></iframe>
        </div>
      </section>
    </div>
  </main>
  <section class="mx-auto max-w-7xl px-6 pb-16 lg:px-10" aria-labelledby="enquiry-title">
    <div class="rounded-3xl bg-white p-6 shadow-sm ring-1 ring-ink/10 sm:p-10">
      <div class="max-w-2xl">
        <p class="text-sm font-bold uppercase tracking-[0.16em] text-muted">Get in touch</p>
        <h2 id="enquiry-title" class="mt-3 font-display text-3xl font-extrabold tracking-tight sm:text-4xl">
          Send an Enquiry
        </h2>
        <p class="mt-4 text-lg leading-8 text-muted">
          Tell us how we can help, and our team will get back to you soon.
        </p>
      </div>

      <?php if ($formStatus !== ''): ?>
        <p
          class="mt-8 rounded-xl px-4 py-3 text-base font-semibold <?= $formStatusType === 'success' ? 'bg-green-50 text-green-800' : 'bg-red-50 text-red-800' ?>"
          role="alert">
          <?= escapeContactValue($formStatus) ?>
        </p>
      <?php endif; ?>

      <form class="mt-8 grid gap-6" method="post" action="index.php">
        <div class="grid gap-6 sm:grid-cols-[10rem_minmax(0,1fr)]">
          <label class="text-base font-semibold">
            Title
            <select
              name="title"
              required
              class="mt-2 w-full rounded-xl border border-muted/30 bg-paper px-4 py-3 font-normal outline-none transition focus:border-ink">
              <option value="" disabled <?= $formValues['title'] === '' ? 'selected' : '' ?>>Select one</option>
              <?php foreach (['Mr', 'Ms', 'Mrs'] as $title): ?>
                <option value="<?= $title ?>" <?= $formValues['title'] === $title ? 'selected' : '' ?>><?= $title ?></option>
              <?php endforeach; ?>
            </select>
          </label>
          <label class="text-base font-semibold">
            Name
            <input
              name="name"
              type="text"
              value="<?= escapeContactValue($formValues['name']) ?>"
              required
              autocomplete="name"
              class="mt-2 w-full rounded-xl border border-muted/30 bg-paper px-4 py-3 font-normal outline-none transition focus:border-ink" />
          </label>
        </div>

        <div class="grid gap-6 md:grid-cols-2">
          <label class="text-base font-semibold">
            Contact No
            <input
              name="contact_no"
              type="tel"
              value="<?= escapeContactValue($formValues['contact_no']) ?>"
              required
              autocomplete="tel"
              class="mt-2 w-full rounded-xl border border-muted/30 bg-paper px-4 py-3 font-normal outline-none transition focus:border-ink" />
          </label>
          <label class="text-base font-semibold">
            Email
            <input
              name="email"
              type="email"
              value="<?= escapeContactValue($formValues['email']) ?>"
              required
              autocomplete="email"
              class="mt-2 w-full rounded-xl border border-muted/30 bg-paper px-4 py-3 font-normal outline-none transition focus:border-ink" />
          </label>
        </div>

        <label class="text-base font-semibold">
          Subject
          <input
            name="subject"
            type="text"
            value="<?= escapeContactValue($formValues['subject']) ?>"
            required
            class="mt-2 w-full rounded-xl border border-muted/30 bg-paper px-4 py-3 font-normal outline-none transition focus:border-ink" />
        </label>

        <label class="text-base font-semibold">
          Message
          <textarea
            name="message"
            rows="6"
            required
            class="mt-2 w-full resize-y rounded-xl border border-muted/30 bg-paper px-4 py-3 font-normal leading-7 outline-none transition focus:border-ink"><?= escapeContactValue($formValues['message']) ?></textarea>
        </label>

        <button
          type="submit"
          class="w-fit rounded-full bg-ink px-7 py-3 text-base font-bold text-paper transition hover:bg-[#2b3c37]">
          Submit Enquiry
        </button>
      </form>
    </div>
  </section>
  <div data-footer></div>
  <script type="module" src="../dist/assets/navbar.js"></script>
  <script type="module" src="../dist/assets/footer.js"></script>
</body>

</html>