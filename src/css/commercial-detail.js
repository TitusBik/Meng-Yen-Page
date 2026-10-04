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
    ["Built-up dimensions", property.built_up_length && property.built_up_width ? `${property.built_up_length} × ${property.built_up_width} ${property.built_up_unit || ""}` : ""],
    ["Land size", property.land_size ? `${property.land_size} ${property.land_unit || ""}` : ""],
    ["Land dimensions", property.land_length && property.land_width ? `${property.land_length} × ${property.land_width} ${property.land_unit || ""}` : ""],
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

const setupLeadSidebar = (property) => {
  const tabs = [...document.querySelectorAll("[data-lead-tab]")];
  const panels = [...document.querySelectorAll("[data-lead-panel]")];
  const message = document.querySelector("[data-lead-message]");
  const dateInput = document.querySelector("[data-lead-panel='tour'] input[type='date']");
  const amountInput = document.querySelector("[data-mortgage-amount]");
  const rateInput = document.querySelector("[data-mortgage-rate]");
  const yearsInput = document.querySelector("[data-mortgage-years]");
  const result = document.querySelector("[data-mortgage-result]");
  const tourForm = document.querySelector("[data-lead-panel='tour']");
  const tourTypeInput = tourForm?.querySelector("[data-tour-type]");
  const tourTypeButtons = [...(tourForm?.querySelectorAll("[data-tour-type-button]") || [])];
  const tourMessage = tourForm?.querySelector("[data-tour-message]");
  if (!tabs.length || !message || !amountInput || !rateInput || !yearsInput || !result) return;

  const today = new Date();
  dateInput.min = today.toISOString().split("T")[0];
  amountInput.value = Math.round(Number(property.price) || 0);
  if (tourForm) {
    tourForm.querySelector("[data-tour-property-title]").value = property.title;
    tourForm.querySelector("[data-tour-category]").value = property.category_name || category;
    tourMessage.value = `I would like to schedule a tour for ${property.title}.`;
  }
  tourTypeButtons.forEach((button) => {
    button.addEventListener("click", () => {
      const active = button.dataset.tourTypeButton;
      tourTypeInput.value = active;
      tourTypeButtons.forEach((item) => {
        const selected = item === button;
        item.classList.toggle("border-ink", selected);
        item.classList.toggle("bg-ink", selected);
        item.classList.toggle("text-paper", selected);
        item.classList.toggle("border-muted/30", !selected);
        item.classList.toggle("bg-paper", !selected);
        item.classList.toggle("text-muted", !selected);
      });
    });
  });

  const updateMortgage = () => {
    const principal = Number(amountInput.value) || 0;
    const monthlyRate = (Number(rateInput.value) || 0) / 100 / 12;
    const months = (Number(yearsInput.value) || 0) * 12;
    const payment = monthlyRate && months
      ? principal * monthlyRate * ((1 + monthlyRate) ** months) / (((1 + monthlyRate) ** months) - 1)
      : months ? principal / months : 0;
    result.textContent = `RM ${Math.round(payment).toLocaleString("en-MY")}`;
  };
  [amountInput, rateInput, yearsInput].forEach((input) => input.addEventListener("input", updateMortgage));
  updateMortgage();

  tabs.forEach((tab) => {
    tab.addEventListener("click", () => {
      const target = tab.dataset.leadTab;
      const targetPanel = panels.find((panel) => panel.dataset.leadPanel === target);
      const shouldOpen = targetPanel?.classList.contains("hidden");
      tabs.forEach((item) => {
        const active = shouldOpen && item === tab;
        item.classList.toggle("is-active", active);
        item.classList.toggle("border-ink", active);
        item.classList.toggle("text-ink", active);
        item.classList.toggle("border-transparent", !active);
        item.classList.toggle("text-muted", !active);
        item.setAttribute("aria-selected", String(active));
        item.setAttribute("aria-expanded", String(active));
      });
      panels.forEach((panel) => {
        panel.classList.toggle("hidden", !shouldOpen || panel !== targetPanel);
      });
      message.classList.add("hidden");
    });
  });

  panels.forEach((form) => {
    form.addEventListener("submit", (event) => {
      event.preventDefault();
      const values = Object.fromEntries(new FormData(form));
      if (form === tourForm) {
        submitScheduleTour(values, message, form);
        return;
      }
      const subject = `${values.enquiry_type}: ${property.title}`;
      const body = Object.entries(values)
        .filter(([key]) => key !== "enquiry_type")
        .map(([key, value]) => `${key}: ${value}`)
        .join("\n");
      window.location.href = `mailto:cmyen.property@gmail.com?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
      message.textContent = "Your email app is opening with the enquiry details.";
      message.classList.remove("hidden");
    });
  });
};

const submitScheduleTour = async (values, message, form) => {
  const button = form.querySelector("button[type='submit']");
  button.disabled = true;
  message.className = "mt-4 rounded-lg bg-paper p-3 text-sm font-semibold text-muted";
  message.textContent = "Sending your tour request...";
  message.classList.remove("hidden");
  try {
    const response = await fetch("../api.php?action=schedule-tour", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      credentials: "same-origin",
      body: JSON.stringify(values),
    });
    const payload = await response.json();
    if (!response.ok) throw new Error(payload.error || "Unable to send tour request.");
    message.className = "mt-4 rounded-lg bg-green-50 p-3 text-sm font-semibold text-green-800";
    message.textContent = "Your tour request has been sent successfully.";
    form.reset();
    form.querySelector("[data-tour-type]").value = "in_person";
    form.querySelector("[data-tour-message]").value = `I would like to schedule a tour for ${values.property_title}.`;
  } catch (error) {
    message.className = "mt-4 rounded-lg bg-red-50 p-3 text-sm font-semibold text-red-800";
    message.textContent = error.message;
  } finally {
    button.disabled = false;
  }
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
  setupLeadSidebar(payload.property);
};

load().catch((error) => {
  message.textContent = error.message;
  message.classList.remove("hidden");
  document.querySelector("[data-detail-breadcrumb]").textContent = "Unavailable";
  document.querySelector("[data-detail-title]").textContent = "Listing unavailable";
  document.querySelector("[data-detail-gallery]").replaceChildren();
  document.querySelector("[data-detail-description]").textContent = "This property could not be loaded.";
});
