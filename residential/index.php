<!doctype html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <meta name="description" content="Meng-Yen — Residential properties" />
    <title>Residential — Meng-Yen</title>
    <link rel="stylesheet" href="../public/css/styles.css" />
    <link rel="preconnect" href="https://fonts.googleapis.com" />
    <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin />
    <link
      href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600&family=Manrope:wght@600;700;800&display=swap"
      rel="stylesheet"
    />
  </head>
  <body class="bg-paper text-ink antialiased" data-property-category="Residential" data-detail-path="listing.php">
    <div data-navbar></div>
    <main class="mx-auto max-w-7xl px-6 pb-20 pt-10 lg:px-10 lg:pb-28 lg:pt-16">
      <section class="rounded-[2rem] bg-ink px-6 py-10 text-paper sm:px-10 sm:py-14">
        <p class="text-sm font-semibold uppercase tracking-[0.2em] text-lime">Residential portfolio</p>
        <h1 class="mt-4 max-w-3xl font-display text-4xl font-extrabold tracking-tight sm:text-6xl">A better place to call home.</h1>
        <p class="mt-5 max-w-2xl text-lg leading-8 text-paper/70">Explore residential properties selected for the way you want to live.</p>
      </section>
      <section class="mt-6 rounded-2xl border border-ink/10 bg-white p-5 sm:p-6">
        <form data-property-filter class="grid gap-4 md:grid-cols-[1fr_1fr_1.3fr_auto] md:items-end">
          <label class="text-sm font-semibold">Price from<input name="from" type="number" min="0" step="1000" placeholder="RM 0" class="mt-2 w-full rounded-lg border border-muted/30 px-4 py-3 outline-none focus:border-ink" /></label>
          <label class="text-sm font-semibold">Price to<input name="to" type="number" min="0" step="1000" placeholder="No maximum" class="mt-2 w-full rounded-lg border border-muted/30 px-4 py-3 outline-none focus:border-ink" /></label>
          <label class="text-sm font-semibold">City<select name="city_id" class="mt-2 w-full rounded-lg border border-muted/30 bg-white px-4 py-3 outline-none focus:border-ink"><option value="">All cities</option></select></label>
          <button type="submit" class="rounded-lg bg-ink px-6 py-3 font-semibold text-paper hover:bg-muted">Filter</button>
        </form>
      </section>
      <div class="mt-10 flex items-end justify-between"><div><p class="text-sm font-semibold uppercase tracking-[0.16em] text-muted">Available now</p><h2 class="mt-2 font-display text-3xl font-extrabold">Residential listings</h2></div><p data-property-count class="text-sm font-medium text-muted">Loading listings...</p></div>
      <div data-property-listings class="mt-6 grid gap-6 md:grid-cols-2 lg:grid-cols-3"></div>
      <div data-property-empty class="mt-6 hidden rounded-2xl border border-dashed border-ink/20 bg-white p-10 text-center"><p class="font-display text-xl font-bold">No residential listings found.</p><p class="mt-2 text-muted">Try widening your price range or choosing another city.</p></div>
    </main>
    <div data-footer></div>
    <script type="module" src="../dist/assets/navbar.js"></script>
    <script type="module" src="../dist/assets/propertyListings.js"></script>
    <script type="module" src="../dist/assets/footer.js"></script>
  </body>
</html>
