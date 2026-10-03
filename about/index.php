<!doctype html>
<html lang="en">

<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <meta name="description" content="Meng-Yen — About Me" />
  <title>About Me — Meng-Yen</title>
  <link rel="stylesheet" href="../public/css/styles.css" />
  <link rel="preconnect" href="https://fonts.googleapis.com" />
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin />
  <link
    href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600&family=Manrope:wght@600;700;800&display=swap"
    rel="stylesheet" />
</head>

<body class="bg-paper text-ink antialiased">
  <div data-navbar></div>
  <main class="about-page">
    <section class="about-intro">
      <p class="about-eyebrow">About Me</p>
      <div class="about-copy">
        <p>
          With years of hands-on experience in Johor’s dynamic real estate
          market, I have built a reputation as a trusted property agent who
          consistently delivers results. My deep understanding of local
          trends, developer reputations, and cross-border investment
          opportunities allows me to provide clients with clear, strategic
          advice that maximizes value.
        </p>
        <p>
          Year after year, I have been recognized with multiple industry
          awards — a testament to my commitment, professionalism, and
          client-first approach. Whether it’s residential, commercial, or
          investment properties, I pride myself on offering bilingual
          communication, transparent guidance, and tailored solutions that
          meet every client’s unique needs.
        </p>
        <p>
          Driven by passion and results, I continue to help investors,
          homeowners, and business owners achieve their property goals in
          Johor and beyond.
        </p>
      </div>
      <p class="about-signature">C.M.Yen - Your One Stop Property Solution</p>
    </section>

    <section class="awards-section" aria-labelledby="awards-title">
      <div class="section-heading">
        <p class="about-eyebrow">Recognition</p>
        <h2 id="awards-title">Award-Winning Track Record</h2>
      </div>
      <div class="awards-list">
        <article class="award-card">
          <div class="award-card-icon" aria-hidden="true">🏆</div>
          <h3>EdgeProp</h3>
          <p>Member Award - 2026 REALTORS’ ROUNDTABLE!</p>
        </article>
        <article class="award-card">
          <div class="award-card-icon" aria-hidden="true">🏆</div>
          <h3>ESP Global</h3>
          <ul>
            <li>Top 30 Project Achievers of the Year</li>
            <li>Top 100 Performance of the Year</li>
          </ul>
        </article>
        <article class="award-card">
          <div class="award-card-icon" aria-hidden="true">🏆</div>
          <h3>CBD Properties</h3>
          <ul>
            <li>Silver Award</li>
            <li>Champion Commission Achiever Record 2025</li>
            <li>Top Project Sales Award</li>
          </ul>
        </article>
        <article class="award-card">
          <div class="award-card-icon" aria-hidden="true">🏆</div>
          <h3>Top Performer</h3>
          <p>2024 Award (Project)</p>
        </article>
      </div>
      <div class="awards-layout">
        <figure class="awards-feature">
          <img
            data-award-image
            src="../assets/image/Award%20Winning%201.jpg"
            alt="C.M. Yen receiving an award" />
        </figure>
        <div class="awards-previews">
          <?php for ($award = 2; $award <= 4; $award++): ?>
            <figure>
              <img
                data-award-image
                src="../assets/image/Award%20Winning%20<?= $award ?>.jpg"
                alt="Award recognition photo <?= $award ?>"
                loading="lazy" />
            </figure>
          <?php endfor; ?>
        </div>
      </div>
    </section>

    <section class="why-me-section" aria-labelledby="why-me-title">
      <div class="why-me-content">
        <p class="about-eyebrow">Why Choose Me</p>
        <h2 id="why-me-title">Why <span>Choose Me</span></h2>
        <ul>
          <li><span class="why-me-icon" aria-hidden="true">🏆</span><strong>Award-Winning Track Record</strong></li>
          <li><span class="why-me-icon" aria-hidden="true">📍</span><strong>Deep Johor Market Knowledge</strong></li>
          <li><span class="why-me-icon" aria-hidden="true">🤝</span><strong>Trusted by Clients</strong></li>
          <li><span class="why-me-icon" aria-hidden="true">🌐</span><strong>Bilingual Communication</strong></li>
          <li><span class="why-me-icon" aria-hidden="true">💼</span><strong>Residential &amp; Commercial Expertise</strong></li>
          <li><span class="why-me-icon" aria-hidden="true">🚀</span><strong>Proven Results</strong></li>
        </ul>
      </div>
      <div class="why-me-image">
        <img src="../assets/image/Why%20me.jpg" alt="C.M. Yen at work in the Johor property market" loading="lazy" />
      </div>
    </section>
  </main>
  <div data-footer></div>
  <script type="module" src="../dist/assets/navbar.js"></script>
  <script type="module" src="../dist/assets/awards.js"></script>
  <script type="module" src="../dist/assets/footer.js"></script>
</body>

</html>