const form = document.querySelector("[data-property-filter]");
const listings = document.querySelector("[data-property-listings]");
const emptyState = document.querySelector("[data-property-empty]");
const resultCount = document.querySelector("[data-property-count]");
const citySelect = form.elements.city_id;
const category = document.body.dataset.propertyCategory;
const detailPath = document.body.dataset.detailPath;

const formatPrice = (price) => new Intl.NumberFormat("en-MY", {
  style: "currency", currency: "MYR", maximumFractionDigits: 0,
}).format(Number(price));

const getImage = (media) => {
  const first = Array.isArray(media) ? media[0] : null;
  if (!first) return null;
  return typeof first === "string" ? first : first.data || first.path || null;
};

const renderListings = (properties) => {
  listings.replaceChildren();
  resultCount.textContent = `${properties.length} ${properties.length === 1 ? "listing" : "listings"}`;
  emptyState.classList.toggle("hidden", properties.length !== 0);
  listings.classList.toggle("hidden", properties.length === 0);
  properties.forEach((property) => {
    const card = document.createElement("article");
    card.className = "cursor-pointer overflow-hidden rounded-2xl border border-ink/10 bg-white shadow-sm transition hover:-translate-y-1 hover:shadow-lg";
    card.tabIndex = 0;
    const open = () => { window.location.href = `${detailPath}?id=${encodeURIComponent(property.id)}`; };
    card.addEventListener("click", open);
    card.addEventListener("keydown", (event) => {
      if (event.key === "Enter" || event.key === " ") { event.preventDefault(); open(); }
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
      placeholder.textContent = category;
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
    content.append(title, location, price);
    listings.append(card);
    card.append(content);
  });
};

const loadListings = async () => {
  const params = new URLSearchParams(new FormData(form));
  params.set("category", category);
  const response = await fetch(`../api.php?action=property-listings&${params}`, { credentials: "same-origin" });
  const payload = await response.json();
  if (!response.ok) throw new Error(payload.error || "Unable to load listings.");
  if (citySelect.options.length === 1) {
    payload.cities.forEach((city) => citySelect.add(new Option(`${city.name}, ${city.state}`, city.id)));
  }
  renderListings(payload.properties);
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
