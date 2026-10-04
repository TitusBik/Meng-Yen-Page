const root = document.querySelector("[data-property-detail]");
const category = document.body.dataset.propertyCategory;
const message = document.querySelector("[data-property-message]");
const formatPrice = (price) => new Intl.NumberFormat("en-MY", {
  style: "currency", currency: "MYR", maximumFractionDigits: 0,
}).format(Number(price));
const imageUrl = (item) => {
  const value = typeof item === "string" ? item : item?.data || item?.path;
  return value?.startsWith("assets/") ? `../${value}` : value;
};
const addDetail = (container, label, value) => {
  if (value === null || value === undefined || value === "") return;
  const wrapper = document.createElement("div");
  wrapper.className = "border-t border-ink/10 pt-4";
  wrapper.innerHTML = `<dt class="text-sm text-muted"></dt><dd class="mt-1 font-medium"></dd>`;
  wrapper.querySelector("dt").textContent = label;
  wrapper.querySelector("dd").textContent = value;
  container.append(wrapper);
};
const render = (property) => {
  document.title = `${property.title} — Meng-Yen`;
  document.querySelector("[data-detail-title]").textContent = property.title;
  document.querySelector("[data-detail-location]").textContent =
    [property.address, property.area, property.city_name, property.state].filter(Boolean).join(" · ");
  const price = document.querySelector("[data-detail-price]");
  price.textContent = formatPrice(property.price);
  if (property.price_type) price.textContent += ` / ${property.price_type}`;
  document.querySelector("[data-detail-description]").innerHTML =
    property.description || "<p>No description was provided for this listing.</p>";
  const details = document.querySelector("[data-detail-fields]");
  [["Listing type", property.listing_type], ["Property code", property.property_code],
    ["Category", property.category_name], ["Price type", property.price_type],
    ["Built-up size", property.built_up_size ? `${property.built_up_size} ${property.built_up_unit || ""}` : ""],
    ["Built-up dimensions", property.built_up_length && property.built_up_width ? `${property.built_up_length} × ${property.built_up_width} ${property.built_up_unit || ""}` : ""],
    ["Land size", property.land_size ? `${property.land_size} ${property.land_unit || ""}` : ""],
    ["Land dimensions", property.land_length && property.land_width ? `${property.land_length} × ${property.land_width} ${property.land_unit || ""}` : ""],
    ["Bedrooms", property.bedrooms], ["Bathrooms", property.bathrooms], ["Car parks", property.car_parks],
    ["Floors", property.floors], ["Furnishing", property.furnishing], ["Tenure", property.tenure],
    ["Year built", property.year_built], ["Maintenance fee", property.maintenance_fee ? formatPrice(property.maintenance_fee) : ""],
    ["Postcode", property.postcode]].forEach(([label, value]) => addDetail(details, label, value));
  const gallery = document.querySelector("[data-detail-gallery]");
  const media = Array.isArray(property.media) ? property.media.map(imageUrl).filter(Boolean) : [];
  if (!media.length) {
    gallery.innerHTML = `<div class="flex min-h-80 items-center justify-center rounded-2xl bg-ink text-sm font-semibold uppercase tracking-[0.18em] text-lime">${category}</div>`;
    return;
  }
  media.forEach((source, index) => {
    const image = document.createElement("img");
    image.src = source; image.alt = `${property.title} photo ${index + 1}`;
    image.className = index === 0 ? "col-span-2 h-96 w-full rounded-2xl object-cover" : "h-32 w-full rounded-xl object-cover";
    gallery.append(image);
  });
};
const load = async () => {
  const id = new URLSearchParams(window.location.search).get("id");
  const response = await fetch(`../api.php?action=property-detail&category=${encodeURIComponent(category)}&id=${encodeURIComponent(id)}`);
  const payload = await response.json();
  if (!response.ok) throw new Error(payload.error || "Unable to load listing.");
  render(payload.property);
};
load().catch((error) => { message.textContent = error.message; message.classList.remove("hidden"); });
