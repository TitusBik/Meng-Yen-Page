import { api } from "./api.js";

const form = document.querySelector("[data-commercial-filter]");
const listings = document.querySelector("[data-commercial-listings]");
const emptyState = document.querySelector("[data-commercial-empty]");
const resultCount = document.querySelector("[data-commercial-count]");
const citySelect = form.elements.city_id;

const formatPrice = (price) =>
  new Intl.NumberFormat("en-MY", {
    style: "currency",
    currency: "MYR",
    maximumFractionDigits: 0,
  }).format(Number(price));

const getImage = (media) => {
  const first = Array.isArray(media) ? media[0] : null;
  if (!first) return null;
  if (typeof first === "string") return first;
  return first.data || first.path || null;
};

const renderListings = (properties) => {
  listings.replaceChildren();
  resultCount.textContent = `${properties.length} ${properties.length === 1 ? "listing" : "listings"}`;
  emptyState.classList.toggle("hidden", properties.length !== 0);
  listings.classList.toggle("hidden", properties.length === 0);

  properties.forEach((property) => {
    const card = document.createElement("article");
    card.className = "overflow-hidden rounded-2xl border border-ink/10 bg-white shadow-sm";
    card.addEventListener("click", () => {
      window.location.href = `listing.php?id=${encodeURIComponent(property.id)}`;
    });
    card.classList.add("cursor-pointer", "transition", "hover:-translate-y-1", "hover:shadow-lg");
    card.setAttribute("tabindex", "0");
    card.setAttribute("role", "link");
    card.addEventListener("keydown", (event) => {
      if (event.key === "Enter" || event.key === " ") {
        event.preventDefault();
        card.click();
      }
    });
    const imageUrl = getImage(property.media);
    if (imageUrl) {
      const image = document.createElement("img");
      image.src = imageUrl.startsWith("assets/") ? `../${imageUrl}` : imageUrl;
      image.alt = property.title;
      image.className = "h-56 w-full object-cover";
      card.append(image);
    } else {
      const placeholder = document.createElement("div");
      placeholder.className = "flex h-56 items-center justify-center bg-ink text-sm font-semibold uppercase tracking-[0.18em] text-lime";
      placeholder.textContent = "Commercial property";
      card.append(placeholder);
    }
    const content = document.createElement("div");
    content.className = "p-6";
    const title = document.createElement("h2");
    title.className = "font-display text-xl font-extrabold";
    title.textContent = property.title;
    const location = document.createElement("p");
    location.className = "mt-2 text-sm text-muted";
    location.textContent = [property.address, property.area, property.city_name].filter(Boolean).join(" · ");
    const price = document.createElement("p");
    price.className = "mt-5 font-display text-2xl font-extrabold";
    price.textContent = formatPrice(property.price);
    if (property.price_type) price.textContent += ` / ${property.price_type}`;
    const details = document.createElement("p");
    details.className = "mt-2 text-sm text-muted";
    details.textContent = [
      property.bedrooms ? `${property.bedrooms} beds` : "",
      property.bathrooms ? `${property.bathrooms} baths` : "",
      property.car_parks ? `${property.car_parks} car parks` : "",
    ].filter(Boolean).join(" · ");
    content.append(title, location, price, details);
    card.append(content);
    listings.append(card);
  });
};

const loadListings = async () => {
  const params = new URLSearchParams(new FormData(form));
  const query = params.toString();
  const response = await fetch(`../api.php?action=commercial-listings&${query}`, {
    credentials: "same-origin",
  });
  const payload = await response.json();
  if (!response.ok) throw new Error(payload.error || "Unable to load commercial listings.");
  const { properties, cities } = payload;
  if (citySelect.options.length === 1) {
    cities.forEach((city) => citySelect.add(new Option(`${city.name}, ${city.state}`, city.id)));
  }
  renderListings(properties);
};

form.addEventListener("submit", (event) => {
  event.preventDefault();
  loadListings().catch((error) => {
    resultCount.textContent = error.message;
    listings.replaceChildren();
    listings.classList.add("hidden");
    emptyState.classList.remove("hidden");
  });
});

loadListings().catch((error) => {
  resultCount.textContent = error.message;
  emptyState.classList.remove("hidden");
});
