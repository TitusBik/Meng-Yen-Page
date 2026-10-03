import footerMarkup from "./components/footer.html?raw";

const footerTargets = document.querySelectorAll("[data-footer]");

if (footerTargets.length === 0) {
  throw new Error("Footer mount point not found.");
}

const projectMarker = "/Meng-Yen-Page/";
const projectRoot = window.location.pathname.includes(projectMarker)
  ? projectMarker
  : new URL(import.meta.env.BASE_URL, window.location.origin).pathname;

footerTargets.forEach((target) => {
  target.innerHTML = footerMarkup;
  target.querySelector("[data-footer-logo]").src =
    `${projectRoot}assets/image/CBD-logo-powered-by-ESP.png`;
  const socialImages = {
    facebook: "Facebook_Logo_Primary.png",
    instagram: "Instagram_Glyph_Gradient.svg",
    tiktok: "TIKTOK_SIMPLIFIED_NOTE_WHITE.svg",
    xiaohongshu: "xiaohongshu-seeklogo.svg",
  };
  target.querySelectorAll("[data-footer-social]").forEach((image) => {
    image.src = `${projectRoot}assets/image/${socialImages[image.dataset.footerSocial]}`;
  });
  target.querySelector("[data-footer-home]").href = `${projectRoot}index.php`;
  target.querySelector("[data-footer-commercial]").href =
    `${projectRoot}commercial/index.php`;
  target.querySelector("[data-footer-residential]").href =
    `${projectRoot}residential/index.php`;
  target.querySelector("[data-footer-new-launch-project]").href =
    `${projectRoot}new_launch_project/index.php`;
  target.querySelector("[data-footer-about]").href =
    `${projectRoot}about/index.php`;
  target.querySelector("[data-footer-contact]").href =
    `${projectRoot}contact/index.php`;
});
