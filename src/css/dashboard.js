import { api } from "./api.js";

const listingCount = document.querySelector("[data-listing-count]");
const totalListingCount = document.querySelector("[data-total-listing-count]");
const listings = document.querySelector("[data-listings]");
const listingsEmpty = document.querySelector("[data-listings-empty]");
const errorMessage = document.querySelector("[data-dashboard-error]");
const logoutButton = document.querySelector("[data-dashboard-action]");

const showError = (message) => {
  errorMessage.textContent = message;
  errorMessage.classList.remove("hidden");
};

const getImageUrl = (media) => {
  const first = Array.isArray(media) ? media[0] : null;
  if (!first) return null;
  const imageUrl = typeof first === "string" ? first : first.data || first.path;
  return imageUrl?.startsWith("assets/") ? `../${imageUrl}` : imageUrl;
};

const renderListings = (properties) => {
  listings.replaceChildren();
  if (properties.length === 0) {
    listings.classList.add("hidden");
    listingsEmpty.classList.remove("hidden");
    return;
  }

  listingsEmpty.classList.add("hidden");
  listings.classList.remove("hidden");
  properties.forEach((property) => {
    const card = document.createElement("article");
    card.className = "overflow-hidden rounded-xl border border-ink/10 bg-paper";
    const imageUrl = getImageUrl(property.media);
    if (imageUrl) {
      const image = document.createElement("img");
      image.src = imageUrl;
      image.alt = property.title;
      image.className = "h-48 w-full object-cover";
      card.append(image);
    } else {
      const placeholder = document.createElement("div");
      placeholder.className = "h-48 w-full bg-black";
      placeholder.setAttribute("aria-label", "No property image available");
      card.append(placeholder);
    }

    const content = document.createElement("div");
    content.className = "p-5";
    const header = document.createElement("div");
    header.className = "flex items-start justify-between gap-4";
    const title = document.createElement("h3");
    title.className = "font-display text-lg font-bold";
    title.textContent = property.title;
    const editLink = document.createElement("a");
    editLink.className = "shrink-0 rounded-full border border-ink/20 px-3 py-1.5 text-xs font-semibold transition hover:border-ink hover:bg-white";
    editLink.href = `add-listing/?id=${encodeURIComponent(property.id)}`;
    editLink.textContent = "Edit";
    const details = document.createElement("p");
    details.className = "mt-2 text-sm text-muted";
    details.textContent = `${property.address} · ${property.listing_type} · ${property.price}`;
    header.append(title, editLink);
    content.append(header, details);
    card.append(content);
    listings.append(card);
  });
};

const loadDashboard = async () => {
  const { user } = await api.session();
  if (!user) {
    window.location.href = "../index.php";
    return;
  }

  const { count, featured_count: featuredCount, properties } = await api.properties();
  const total = count ?? 0;
  listingCount.textContent = featuredCount ?? 0;
  totalListingCount.textContent = total;
  renderListings(properties || []);
};

logoutButton.addEventListener("click", async () => {
  logoutButton.disabled = true;
  try {
    await api.logout();
  } catch {
    logoutButton.disabled = false;
    showError("Unable to log out. Please try again.");
    return;
  }

  window.location.href = "../index.php";
});

loadDashboard().catch((error) => {
  console.error("Unable to load dashboard:", error);
  showError(`Unable to load your account information: ${error.message}`);
});
