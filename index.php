<!doctype html>
<html lang="en">

<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <meta name="description" content="Meng-Yen — Landing Page" />
  <title>Meng-Yen — Landing Page</title>
  <link rel="stylesheet" href="./public/css/styles.css" />
  <link rel="preconnect" href="https://fonts.googleapis.com" />
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin />
  <link
    href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600&family=Manrope:wght@600;700;800&display=swap"
    rel="stylesheet" />
</head>

<body class="bg-paper text-ink antialiased">
  <div data-navbar></div>

  <main class="homepage-main">
    <section class="homepage-hero" aria-label="Featured images">
      <div class="homepage-carousel" data-carousel tabindex="0">
        <div class="homepage-carousel-track" data-carousel-track>
          <div class="homepage-slide" data-carousel-slide style="--slide-image: url('/Meng-Yen-Page/assets/image/1.jpg')">
            <img class="homepage-slide-background" src="./assets/image/1.jpg" alt="" aria-hidden="true" draggable="false" />
            <img src="./assets/image/1.jpg" alt="Featured image 1" draggable="false" />
          </div>
          <div class="homepage-slide" data-carousel-slide style="--slide-image: url('/Meng-Yen-Page/assets/image/2.jpg')">
            <img class="homepage-slide-background" src="./assets/image/2.jpg" alt="" aria-hidden="true" draggable="false" />
            <img src="./assets/image/2.jpg" alt="Featured image 2" draggable="false" />
          </div>
          <div class="homepage-slide" data-carousel-slide style="--slide-image: url('/Meng-Yen-Page/assets/image/3.jpg')">
            <img class="homepage-slide-background" src="./assets/image/3.jpg" alt="" aria-hidden="true" draggable="false" />
            <img src="./assets/image/3.jpg" alt="Featured image 3" draggable="false" />
          </div>
        </div>
      </div>
      <div class="homepage-carousel-dots" data-carousel-dots aria-label="Choose a slide"></div>
    </section>

    <section class="detail-1 py-3">
      <h2 class="detail-1-title">JB Commercial Sale & Rental Experts</h2>
      <div class="detail-1-inner">
        <div class="detail-1-content">
          <div class="detail-1-copy">
            <h3>Your Trusted Partner in Johor Property Solutions</h3>
            <p>Johor Bahru’s commercial property market is thriving, and navigating it requires trusted expertise. We specialize in connecting investors, business owners, and developers with the right opportunities — whether it’s prime shoplots, modern office spaces, or high-traffic retail units.</p>
            <p>With deep knowledge of Johor’s economic trends and strong ties to the Singapore market, our team provides tailored advice on maximizing returns, securing strategic locations, and negotiating favorable terms. From sale transactions to rental management, we deliver end-to-end solutions that ensure every client achieves their business goals.</p>
            <p>Our commitment is simple: professional guidance, transparent processes, and results-driven strategies. Whether you’re expanding your business footprint or seeking high-yield investments, JB Commercial Sale & Rental Experts is your trusted partner in Johor’s dynamic property landscape.</p>
          </div>
        </div>
        <div class="detail-1-image">
          <img src="./assets/image/Home Page 2.jpg" alt="Johor commercial property" />
        </div>
      </div>
    </section>

    <section class="regions-section">
      <div class="regions-section-inner">
        <h2>We support these regions for Commercial Hub, Retail Space & Office Space</h2>
        <div class="regions-list" aria-label="Supported regions">
          <span>JBCC</span>
          <span>Pelangi</span>
          <span>Sentosa</span>
          <span>Permas Jaya</span>
          <span>Pasir Gudang</span>
          <span>Masai</span>
          <span>Tebrau</span>
          <span>Mt Austin</span>
          <span>Setia Indah</span>
          <span>Plentong</span>
          <span>Senai</span>
          <span>Kempas</span>
          <span>Tampoi</span>
          <span>Bukit Indah</span>
          <span>Perling</span>
          <span>Eco Botanic</span>
          <span>Kulai</span>
        </div>
      </div>
    </section>

    <section class="featured-listing">
      <div class="mx-auto max-w-7xl px-6 py-16 lg:px-10">
        <div class="flex items-end justify-between gap-4">
          <div>
            <p class="text-sm font-semibold uppercase tracking-[0.16em] text-muted">Featured properties</p>
            <h2 class="mt-2 font-display text-3xl font-extrabold tracking-tight sm:text-4xl">
              Find your next property
            </h2>
          </div>
          <button
            type="button"
            data-featured-next
            class="hidden shrink-0 rounded-full bg-ink px-5 py-3 text-sm font-semibold text-paper transition hover:bg-muted">
            Next
          </button>
        </div>
        <p data-featured-message class="mt-6 text-muted">Loading featured listings...</p>
        <div data-featured-listings class="mt-8 grid gap-5 sm:grid-cols-2 lg:grid-cols-4"></div>
      </div>
    </section>

    <section class="award-banner" aria-labelledby="award-banner-title" style="--award-banner-image: url('/Meng-Yen-Page/assets/image/Single Banner.jpg')">
      <img class="award-banner-image" src="./assets/image/Single Banner.jpg" alt="" aria-hidden="true" />
      <div class="award-banner-content">
        <h3>Award-Winning Expertise in Real Estate Career</h3>
        <h1 id="award-banner-title">Your Trusted Partner in Johor Property Solutions</h1>
        <a href="./about/index.php" class="detail-1-button">About Me</a>
      </div>
    </section>

    <section>

    </section>
  </main>

  <div data-footer></div>
  <script type="module" src="./dist/assets/navbar.js"></script>
  <script type="module" src="./dist/assets/homepage.js"></script>
  <script type="module" src="./dist/assets/footer.js"></script>
</body>

</html>