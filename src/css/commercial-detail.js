const listing = document.querySelector("[data-commercial-detail]");
const message = document.querySelector("[data-commercial-detail-message]");
const category = document.body.dataset.propertyCategory || "Commercial";

const formatPrice = (price) =>
  new Intl.NumberFormat("en-MY", {
    style: "currency",
    currency: "MYR",
    maximumFractionDigits: 0,
  }).format(Number(price));

const imageUrl = (mediaItem) => {
  if (!mediaItem) return null;
  const value = typeof mediaItem === "string" ? mediaItem : mediaItem.data || mediaItem.path;
  return value?.startsWith("assets/") ? `../${value}` : value;
};

const addDetail = (container, label, value) => {
  if (value === null || value === undefined || value === "") return;
  const wrapper = document.createElement("div");
  wrapper.className = "border-t border-ink/10 pt-4";
  const heading = document.createElement("dt");
  heading.className = "text-sm text-muted";
  heading.textContent = label;
  const content = document.createElement("dd");
  content.className = "mt-1 font-medium";
  content.textContent = value;
  wrapper.append(heading, content);
  container.append(wrapper);
};

const setupTabs = () => {
  document.querySelectorAll("[data-detail-tab]").forEach((button) => {
    button.addEventListener("click", () => {
      const target = button.dataset.detailTab;
      document.querySelectorAll("[data-detail-tab]").forEach((tab) => {
        const active = tab === button;
        tab.classList.toggle("is-active", active);
        tab.setAttribute("aria-selected", String(active));
      });
      document.querySelectorAll("[data-detail-panel]").forEach((panel) => {
        panel.classList.toggle("hidden", panel.dataset.detailPanel !== target);
      });
    });
  });
};

const render = (property) => {
  document.title = `${property.title} — Meng-Yen`;
  document.querySelector("[data-detail-title]").textContent = property.title;
  document.querySelector("[data-detail-breadcrumb]").textContent = property.title;
  document.querySelector("[data-detail-location]").textContent =
    [property.address, property.area, property.city_name, property.state].filter(Boolean).join(" · ");
  const listingType = document.querySelector("[data-detail-listing-type]");
  if (property.listing_type) {
    listingType.textContent = property.listing_type;
    listingType.classList.remove("hidden");
  }
  const price = document.querySelector("[data-detail-price]");
  price.textContent = formatPrice(property.price);
  if (property.price_type) price.textContent += ` / ${property.price_type}`;
  const description = document.querySelector("[data-detail-description]");
  description.innerHTML = property.description || "<p>No description was provided for this listing.</p>";
  const address = [property.address, property.area, property.city_name, property.state, property.postcode]
    .filter(Boolean)
    .join(", ");
  document.querySelector("[data-detail-address]").textContent = address || "Address available on request.";
  document.querySelector("[data-detail-map]").href =
    `https://maps.google.com/?q=${encodeURIComponent(address || property.title)}`;
  const details = document.querySelector("[data-detail-fields]");
  [
    ["Listing type", property.listing_type],
    ["Property code", property.property_code],
    ["Category", property.category_name],
    ["Price type", property.price_type],
    ["Built-up size", property.built_up_size ? `${property.built_up_size} ${property.built_up_unit || ""}` : ""],
    ["Land size", property.land_size ? `${property.land_size} ${property.land_unit || ""}` : ""],
    ["Bedrooms", property.bedrooms],
    ["Bathrooms", property.bathrooms],
    ["Car parks", property.car_parks],
    ["Floors", property.floors],
    ["Furnishing", property.furnishing],
    ["Tenure", property.tenure],
    ["Year built", property.year_built],
    ["Maintenance fee", property.maintenance_fee ? formatPrice(property.maintenance_fee) : ""],
    ["Postcode", property.postcode],
  ].forEach(([label, value]) => addDetail(details, label, value));

  const gallery = document.querySelector("[data-detail-gallery]");
  const media = Array.isArray(property.media) ? property.media.map(imageUrl).filter(Boolean) : [];
  if (media.length === 0) {
    gallery.innerHTML = `<div class="flex min-h-80 items-center justify-center rounded-2xl bg-ink text-sm font-semibold uppercase tracking-[0.18em] text-lime">${category} property</div>`;
    return;
  }
  gallery.replaceChildren();
  media.forEach((source, index) => {
    const image = document.createElement("img");
    image.src = source;
    image.alt = `${property.title} photo ${index + 1}`;
    image.className = index === 0
      ? "h-full min-h-80 w-full rounded-2xl object-cover"
      : "h-32 w-full rounded-xl object-cover";
    gallery.append(image);
  });
};

const setupShare = () => {
  document.querySelector("[data-share-property]").addEventListener("click", async () => {
    try {
      await navigator.clipboard.writeText(window.location.href);
      const button = document.querySelector("[data-share-property]");
      const originalLabel = button.textContent;
      button.textContent = "Link copied";
      window.setTimeout(() => {
        button.textContent = originalLabel;
      }, 1800);
    } catch {
      window.prompt("Copy this listing link:", window.location.href);
    }
  });
};

const load = async () => {
  const id = new URLSearchParams(window.location.search).get("id");
  if (!id) throw new Error("This listing link is missing its id.");
  const response = await fetch(`../api.php?action=property-detail&category=${encodeURIComponent(category)}&id=${encodeURIComponent(id)}`);
  const payload = await response.json();
  if (!response.ok) throw new Error(payload.error || "Unable to load listing.");
  render(payload.property);
  setupTabs();
  setupShare();
};

load().catch((error) => {
  message.textContent = error.message;
  message.classList.remove("hidden");
  document.querySelector("[data-detail-breadcrumb]").textContent = "Unavailable";
  document.querySelector("[data-detail-title]").textContent = "Listing unavailable";
  document.querySelector("[data-detail-gallery]").replaceChildren();
  document.querySelector("[data-detail-description]").textContent = "This property could not be loaded.";
});
