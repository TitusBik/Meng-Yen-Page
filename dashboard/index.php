<!doctype html>
<html lang="en">

<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <meta
    name="description"
    content="Meng-Yen personal property management dashboard" />
  <title>Dashboard — Meng-Yen</title>
  <link rel="stylesheet" href="../public/css/styles.css" />
  <link rel="preconnect" href="https://fonts.googleapis.com" />
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin />
  <link
    href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600&family=Manrope:wght@600;700;800&display=swap"
    rel="stylesheet" />
</head>

<body class="min-h-screen bg-paper text-ink antialiased">
  <div data-navbar></div>

  <main class="mx-auto max-w-7xl px-6 pb-16 pt-8 lg:px-10 lg:pb-24 lg:pt-12">
    <section class="mt-6 grid gap-4 sm:grid-cols-3" aria-label="Dashboard summary">
      <article class="rounded-2xl border border-ink/10 bg-white p-5">
        <div class="flex items-center justify-between">
          <p class="text-sm font-medium text-muted">Featured listings</p>
          <span class="rounded-full bg-lime px-2.5 py-1 text-xs font-bold text-ink">LIVE</span>
        </div>
        <p data-listing-count class="mt-5 font-display text-4xl font-extrabold">0</p>
      </article>
      <article class="rounded-2xl border border-ink/10 bg-white p-5">
        <p class="text-sm font-medium text-muted">Total listings</p>
        <p data-total-listing-count class="mt-5 font-display text-4xl font-extrabold">0</p>
        <p class="mt-1 text-sm text-muted">All your property listings</p>
      </article>
      <a href="add-listing/" class="group rounded-2xl bg-lime p-5 transition hover:brightness-95">
        <p class="text-sm font-semibold text-ink/70">Ready for the next move?</p>
        <p class="mt-5 font-display text-2xl font-extrabold">Add a property <span class="inline-block transition group-hover:translate-x-1">→</span></p>
        <p class="mt-1 text-sm text-ink/70">Create your listing</p>
      </a>
    </section>

    <section class="mt-8 grid gap-6 lg:grid-cols-[1.1fr_0.9fr]">
      <article class="rounded-2xl border border-ink/10 bg-white p-6 sm:col-span-3 sm:p-8">
        <div
          class="flex flex-col justify-between gap-5 sm:flex-row sm:items-start">
          <div>
            <p
              class="text-sm font-semibold uppercase tracking-[0.16em] text-muted">
              Property management
            </p>
            <h2 class="mt-2 font-display text-2xl font-extrabold">
              Your property listings
            </h2>
            <p class="mt-3 max-w-xl text-muted">
              Keep your property activity in one focused place.
            </p>
          </div>
        </div>
        <div data-listings class="mt-8 hidden grid gap-4 sm:grid-cols-2 xl:grid-cols-4"></div>
        <div data-listings-empty class="mt-8 rounded-xl bg-paper p-6 sm:p-8">
          <div class="flex h-12 w-12 items-center justify-center rounded-full bg-white text-xl">⌂</div>
          <p class="mt-5 font-display text-xl font-bold">No properties yet</p>
          <p class="mt-2 max-w-sm text-sm leading-6 text-muted">
            Add a property to start building your portfolio. Your photos,
            prices, locations, and availability will appear here.
          </p>
          <a href="add-listing/" class="mt-6 inline-flex rounded-full bg-ink px-5 py-3 text-sm font-semibold text-paper transition hover:bg-muted">
            Create your first listing
          </a>
        </div>
      </article>
    </section>

    <p
      data-dashboard-error
      class="mt-8 hidden text-sm font-medium text-red-700"></p>
  </main>
  <script type="module" src="../dist/assets/navbar.js"></script>
  <script type="module" src="../dist/assets/dashboard.js"></script>
</body>

</html>