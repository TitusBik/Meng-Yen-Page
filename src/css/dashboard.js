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

const createImagePlaceholder = () => {
  const placeholder = document.createElement("div");
  placeholder.className = "flex aspect-[4/3] items-center justify-center rounded-lg bg-black text-sm text-white/70";
  placeholder.textContent = "No image";
  placeholder.setAttribute("aria-label", "No property image available");
  return placeholder;
};

const createImageThumbnail = (property) => {
  const imageUrl = getImageUrl(property.media);
  if (!imageUrl) return createImagePlaceholder();

  const image = document.createElement("img");
  image.src = imageUrl;
  image.alt = property.title;
  image.className = "aspect-[4/3] w-full rounded-lg object-cover";
  image.addEventListener("error", () => {
    image.replaceWith(createImagePlaceholder());
  }, { once: true });
  return image;
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
    card.className = "relative min-w-0 rounded-xl border border-ink/10 bg-white p-4 shadow-sm transition hover:shadow-md";

    const deleteButton = document.createElement("button");
    deleteButton.type = "button";
    deleteButton.className = "absolute right-2.5 top-2.5 z-10 flex h-8 w-8 items-center justify-center rounded-full bg-black/60 text-sm text-white transition hover:bg-black/80 disabled:cursor-not-allowed disabled:opacity-60";
    deleteButton.textContent = "✕";
    deleteButton.setAttribute("aria-label", `Delete ${property.title}`);
    deleteButton.addEventListener("click", async () => {
      if (!window.confirm(`Delete "${property.title}"? This cannot be undone.`)) return;
      deleteButton.disabled = true;
      try {
        await api.deleteProperty(property.id);
        await loadDashboard();
      } catch (error) {
        deleteButton.disabled = false;
        showError(`Unable to delete listing: ${error.message}`);
      }
    });

    card.append(createImageThumbnail(property));

    const content = document.createElement("div");
    content.className = "mt-4 min-w-0";
    const header = document.createElement("div");
    header.className = "flex min-w-0 items-center justify-between gap-3";
    const title = document.createElement("h3");
    title.className = "min-w-0 flex-1 truncate font-display text-lg font-bold";
    title.title = property.title;
    title.textContent = property.title;
    const editLink = document.createElement("a");
    editLink.className = "shrink-0 rounded-full border border-ink/20 px-3 py-1.5 text-xs font-semibold transition hover:border-ink hover:bg-white";
    editLink.href = `add-listing/?id=${encodeURIComponent(property.id)}`;
    editLink.textContent = "Edit";
    const details = document.createElement("p");
    details.className = "mt-1 truncate text-sm text-muted";
    details.title = `${property.address} · ${property.listing_type} · ${property.price}`;
    details.textContent = `${property.address} · ${property.listing_type} · ${property.price}`;
    header.append(title, editLink);
    content.append(header, details);
    card.append(content, deleteButton);
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
