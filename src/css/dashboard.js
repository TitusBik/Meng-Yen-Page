import { supabase } from "./supabase.js";

const userName = document.querySelector("[data-user-name]");
const userEmail = document.querySelector("[data-user-email]");
const userId = document.querySelector("[data-user-id]");
const createdAt = document.querySelector("[data-created-at]");
const lastSignIn = document.querySelector("[data-last-sign-in]");
const errorMessage = document.querySelector("[data-dashboard-error]");
const logoutButton = document.querySelector("[data-logout]");

const showError = (message) => {
  errorMessage.textContent = message;
  errorMessage.classList.remove("hidden");
};

const loadDashboard = async () => {
  const { data, error } = await supabase.auth.getUser();

  if (error || !data.user) {
    window.location.href = "../index.html";
    return;
  }

  const user = data.user;
  const displayName = user.user_metadata?.full_name || user.email?.split("@")[0] || "there";

  userName.textContent = displayName;
  userEmail.textContent = user.email || "Not provided";
  userId.textContent = user.id;
  createdAt.textContent = new Date(user.created_at).toLocaleDateString();
  lastSignIn.textContent = user.last_sign_in_at
    ? new Date(user.last_sign_in_at).toLocaleDateString()
    : "First sign-in";
};

logoutButton.addEventListener("click", async () => {
  logoutButton.disabled = true;
  const { error } = await supabase.auth.signOut();

  if (error) {
    logoutButton.disabled = false;
    showError("Unable to log out. Please try again.");
    return;
  }

  window.location.href = "../index.html";
});

loadDashboard().catch(() => {
  showError("Unable to load your account information.");
});
