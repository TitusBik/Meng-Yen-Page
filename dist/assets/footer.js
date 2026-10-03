import{n as e,t}from"./rolldown-runtime-B0Z9INg1.js";var n,r=e((()=>{n=`<footer class="site-footer">\r
  <div class="site-footer-inner">\r
    <div class="site-footer-brand">\r
      <img class="site-footer-logo" data-footer-logo alt="CBD Properties logo" />\r
      <p class="site-footer-name">CBD Properties Permas Jaya.</p>\r
      <address>\r
        Address: 10, Jalan Permas 10/7, Bandar Baru Permas Jaya, 81750 Masai,\r
        Johor Darul Ta'zim<br />\r
        Email:\r
        <a href="mailto:cmyen.property@gmail.com">cmyen.property@gmail.com</a>\r
        <span aria-hidden="true"> / </span>\r
        Mobile: <a href="tel:01116457701">011-16457701</a>\r
        <span aria-hidden="true"> / </span>\r
        Office Contact: <a href="tel:073822372">07 382 2372</a>\r
      </address>\r
      <div class="site-footer-socials" aria-label="Social media links">\r
        <a href="https://www.facebook.com/CMYenProperty" target="_blank" rel="noopener noreferrer" aria-label="Facebook">\r
          <img data-footer-social="facebook" alt="" />\r
        </a>\r
        <a href="https://www.instagram.com/cmyen_property?stkn=M2ZmYThmM2kzajF6" target="_blank" rel="noopener noreferrer" aria-label="Instagram">\r
          <img data-footer-social="instagram" alt="" />\r
        </a>\r
        <a href="https://www.tiktok.com/@cmyen.property?_r=1&_t=ZS-99zNEcbc9EW" target="_blank" rel="noopener noreferrer" aria-label="TikTok">\r
          <img data-footer-social="tiktok" alt="" />\r
        </a>\r
        <a href="https://xhslink.cn/m/x8zmsBjxKG" target="_blank" rel="noopener noreferrer" aria-label="XiaoHongShu">\r
          <img data-footer-social="xiaohongshu" alt="" />\r
        </a>\r
      </div>\r
    </div>\r
    <nav class="site-footer-nav" aria-label="Footer navigation">\r
      <a data-footer-home>Home</a>\r
      <a data-footer-commercial>Commercial</a>\r
      <a data-footer-residential>Residential</a>\r
      <a data-footer-new-launch-project>New Launch Project</a>\r
      <a data-footer-about>About Me</a>\r
      <a data-footer-contact>Contact Me</a>\r
    </nav>\r
  </div>\r
  <p class="site-footer-copyright">© 2026 Meng-Yen. Built with care.</p>\r
</footer>\r
`})),i=t((()=>{r();var e=document.querySelectorAll(`[data-footer]`);if(e.length===0)throw Error(`Footer mount point not found.`);var t=`/Meng-Yen-Page/`,i=window.location.pathname.includes(t)?t:new URL(`/Meng-Yen-Page/`,window.location.origin).pathname;e.forEach(e=>{e.innerHTML=n,e.querySelector(`[data-footer-logo]`).src=`${i}assets/image/CBD-logo-powered-by-ESP.png`;let t={facebook:`Facebook_Logo_Primary.png`,instagram:`Instagram_Glyph_Gradient.svg`,tiktok:`TIKTOK_SIMPLIFIED_NOTE_WHITE.svg`,xiaohongshu:`xiaohongshu-seeklogo.svg`};e.querySelectorAll(`[data-footer-social]`).forEach(e=>{e.src=`${i}assets/image/${t[e.dataset.footerSocial]}`}),e.querySelector(`[data-footer-home]`).href=`${i}index.php`,e.querySelector(`[data-footer-commercial]`).href=`${i}commercial/index.php`,e.querySelector(`[data-footer-residential]`).href=`${i}residential/index.php`,e.querySelector(`[data-footer-new-launch-project]`).href=`${i}new_launch_project/index.php`,e.querySelector(`[data-footer-about]`).href=`${i}about/index.php`,e.querySelector(`[data-footer-contact]`).href=`${i}contact/index.php`})}));export default i();