<?php
$propertyCategory = $propertyCategory ?? 'Commercial';
$listingBackPath = $listingBackPath ?? './index.php';
$listingId = filter_input(INPUT_GET, 'id', FILTER_VALIDATE_INT);
if (!$listingId || $listingId < 1) {
    header('Location: ' . $listingBackPath);
    exit;
}
$listingCategoryLabel = htmlspecialchars($propertyCategory, ENT_QUOTES, 'UTF-8');
?>
<!doctype html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <meta name="description" content="<?= $listingCategoryLabel ?> property details — Meng-Yen" />
    <title><?= $listingCategoryLabel ?> listing — Meng-Yen</title>
    <link rel="stylesheet" href="../public/css/styles.css" />
    <link rel="preconnect" href="https://fonts.googleapis.com" />
    <link rel="preconnect" href="https://fonts.googleapis.com" crossorigin />
    <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600&family=Manrope:wght@600;700;800&display=swap" rel="stylesheet" />
  </head>
  <body class="bg-paper text-ink antialiased" data-property-category="<?= $listingCategoryLabel ?>" data-commercial-detail>
    <div data-navbar></div>
    <main data-commercial-detail class="mx-auto max-w-7xl px-6 pb-20 pt-8 lg:px-10 lg:pb-28 lg:pt-12">
      <nav class="flex flex-wrap items-center gap-2 text-sm text-muted" aria-label="Breadcrumb">
        <a href="<?= htmlspecialchars($listingBackPath, ENT_QUOTES, 'UTF-8') ?>" class="font-semibold transition hover:text-ink">Listings</a>
        <span aria-hidden="true">/</span>
        <span><?= $listingCategoryLabel ?></span>
        <span aria-hidden="true">/</span>
        <span data-detail-breadcrumb class="truncate font-medium text-ink">Loading listing...</span>
      </nav>
      <p data-commercial-detail-message class="mt-8 hidden rounded-xl bg-red-50 p-4 text-sm font-medium text-red-700"></p>

      <header class="mt-8 flex flex-col gap-5 border-b border-ink/10 pb-8 lg:flex-row lg:items-end lg:justify-between">
        <div>
          <div class="flex flex-wrap gap-2">
            <span class="rounded-full bg-lime px-3 py-1 text-xs font-bold uppercase tracking-[0.14em]"><?= $listingCategoryLabel ?></span>
            <span data-detail-listing-type class="hidden rounded-full border border-ink/15 px-3 py-1 text-xs font-bold uppercase tracking-[0.14em] text-muted"></span>
          </div>
          <h1 data-detail-title class="mt-4 max-w-4xl font-display text-4xl font-extrabold tracking-tight sm:text-5xl">Loading listing...</h1>
          <p data-detail-location class="mt-3 text-muted"></p>
        </div>
        <div class="flex flex-col items-start gap-3 lg:items-end">
          <p data-detail-price class="font-display text-3xl font-extrabold"></p>
          <div class="flex gap-2">
            <button type="button" data-share-property data-print-hide class="rounded-lg border border-ink/15 px-4 py-2 text-sm font-semibold transition hover:bg-white">Share</button>
            <button type="button" data-print-hide onclick="window.print()" class="rounded-lg border border-ink/15 px-4 py-2 text-sm font-semibold transition hover:bg-white">Print</button>
          </div>
        </div>
      </header>

      <section class="mt-8 grid gap-8 lg:grid-cols-[minmax(0,1.65fr)_minmax(18rem,0.75fr)]">
        <div>
          <div data-detail-gallery class="grid min-h-80 grid-cols-2 gap-3"></div>
          <section class="mt-8 overflow-hidden rounded-2xl border border-ink/10 bg-white">
            <div class="flex overflow-x-auto border-b border-ink/10" role="tablist" aria-label="Property information">
              <button type="button" class="detail-tab is-active" data-detail-tab="description" role="tab" aria-selected="true">Description</button>
              <button type="button" class="detail-tab" data-detail-tab="address" role="tab" aria-selected="false">Address</button>
              <button type="button" class="detail-tab" data-detail-tab="details" role="tab" aria-selected="false">Details</button>
            </div>
            <div class="p-6 sm:p-8">
              <div data-detail-panel="description">
                <h2 class="font-display text-xl font-extrabold">Property description</h2>
                <div data-detail-description class="prose mt-5 max-w-none leading-8 text-muted"></div>
              </div>
              <div data-detail-panel="address" class="hidden">
                <h2 class="font-display text-xl font-extrabold">Property address</h2>
                <p data-detail-address class="mt-5 leading-8 text-muted"></p>
                <a data-detail-map href="#" target="_blank" rel="noopener" class="mt-5 inline-flex rounded-lg bg-ink px-4 py-3 text-sm font-semibold text-paper transition hover:bg-muted">Open in Google Maps</a>
              </div>
              <div data-detail-panel="details" class="hidden">
                <h2 class="font-display text-xl font-extrabold">Property details</h2>
                <dl data-detail-fields class="mt-5 grid gap-x-8 gap-y-4 sm:grid-cols-2"></dl>
              </div>
            </div>
          </section>
        </div>

        <aside data-print-hide class="h-fit rounded-2xl border border-ink/10 bg-white p-6 shadow-sm lg:sticky lg:top-28">
          <p class="text-sm font-semibold uppercase tracking-[0.16em] text-muted">Interested in this property?</p>
          <h2 class="mt-3 font-display text-2xl font-extrabold">Let’s make your next move.</h2>
          <p class="mt-3 leading-7 text-muted">Get tailored information, arrange a viewing, or ask about similar properties.</p>
          <a href="../contact/index.php" class="mt-6 inline-flex w-full items-center justify-center rounded-lg bg-ink px-5 py-3 font-semibold text-paper transition hover:bg-muted">Request information</a>
          <a href="../contact/index.php" class="mt-3 inline-flex w-full items-center justify-center rounded-lg border border-ink/15 px-5 py-3 font-semibold transition hover:bg-paper">Schedule a viewing</a>
        </aside>
      </section>
    </main>
    <div data-footer></div>
    <script type="module" src="../dist/assets/navbar.js"></script>
    <script type="module" src="../dist/assets/commercialDetail.js"></script>
    <script type="module" src="../dist/assets/footer.js"></script>
  </body>
</html>
