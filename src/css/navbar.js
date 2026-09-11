import navbarMarkup from "./components/navbar.html?raw";
import { supabase } from "./supabase.js";

const navbarTargets = document.querySelectorAll("[data-navbar]");

if (navbarTargets.length === 0) {
  throw new Error("Navbar mount point not found.");
}

const pathSegments = window.location.pathname.split("/").filter(Boolean);
const currentFile = pathSegments.at(-1);
if (currentFile === "index.html" || currentFile === "index.php") {
  pathSegments.pop();
}
const siteRoot = "../".repeat(pathSegments.length);

navbarTargets.forEach((target) => {
  target.innerHTML = navbarMarkup;

  const homeLinks = target.querySelectorAll("[data-navbar-home]");
  const commercialLink = target.querySelector("[data-navbar-commercial]");
  const residentialLink = target.querySelector("[data-navbar-residential]");
  const newLaunchLink = target.querySelector("[data-navbar-new-launch-project]");
  const aboutLink = target.querySelector("[data-navbar-about]");
  const contactLink = target.querySelector("[data-navbar-contact]");

  homeLinks.forEach((homeLink) => {
    homeLink.href = `${siteRoot}index.html`;
  });
  commercialLink.href = `${siteRoot}commercial/index.html`;
  residentialLink.href = `${siteRoot}residential/index.html`;
  newLaunchLink.href = `${siteRoot}new_launch_project/index.html`;
  aboutLink.href = `${siteRoot}about/index.html`;
  contactLink.href = `${siteRoot}contact/index.html`;

  const loginDialog = target.querySelector("[data-login-dialog]");
  const loginOpenButton = target.querySelector("[data-login-open]");
  const loginCloseButton = target.querySelector("[data-login-close]");
  const loginForm = target.querySelector("[data-login-form]");

  const closeLoginDialog = () => {
    loginDialog.classList.add("hidden");
    loginDialog.classList.remove("flex");
    loginDialog.setAttribute("aria-hidden", "true");
    loginOpenButton.focus();
  };

  const openLoginDialog = () => {
    loginDialog.classList.remove("hidden");
    loginDialog.classList.add("flex");
    loginDialog.setAttribute("aria-hidden", "false");
    loginDialog.querySelector("input").focus();
  };

  loginOpenButton.addEventListener("click", openLoginDialog);
  loginCloseButton.addEventListener("click", closeLoginDialog);
  loginDialog.addEventListener("click", (event) => {
    if (event.target === loginDialog) {
      closeLoginDialog();
    }
  });
  document.addEventListener("keydown", (event) => {
    if (
      event.key === "Escape" &&
      loginDialog.getAttribute("aria-hidden") === "false"
    ) {
      closeLoginDialog();
    }
  });

  loginForm.addEventListener("submit", async (event) => {
    event.preventDefault();

    const email = loginForm.elements.email.value.trim();
    const password = loginForm.elements.password.value;
    const submitButton = loginForm.querySelector("button[type='submit']");

    if (!email || !password) {
      return;
    }

    submitButton.disabled = true;
    submitButton.textContent = "Logging in...";

    const { error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) {
      alert("Invalid username or password.");
      submitButton.disabled = false;
      submitButton.textContent = "Login";
      return;
    }

    window.location.href = `${siteRoot}dashboard/`;
  });
});
