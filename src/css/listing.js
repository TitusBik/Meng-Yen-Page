import Quill from "quill";
import QuillBetterTable from "quill-table-better";
import "quill/dist/quill.snow.css";
import "quill-table-better/dist/quill-table-better.css";
import { supabase } from "./supabase.js";

const form = document.querySelector("[data-listing-form]");
const message = document.querySelector("[data-listing-message]");
const editId = new URLSearchParams(window.location.search).get("id");
const citySelect = form.elements.city_id;
const customCityField = form.elements.other_city.closest("[data-custom-city-field]");
const customCityInput = form.elements.other_city;
const imageInput = form.elements.image;
const imagePreview = document.querySelector("[data-image-preview]");
let imageItems = [];
Quill.register({ "modules/better-table": QuillBetterTable }, true);
const editor = new Quill("[data-description-editor]", {
  theme: "snow",
  placeholder: "Describe the property, features, access, and availability.",
  modules: {
    toolbar: [
      [{ header: [1, 2, 3, false] }],
      ["bold", "italic", "underline", "strike"],
      [{ list: "ordered" }, { list: "bullet" }],
      [{ align: [] }, { color: [] }, { background: [] }],
      ["link", "blockquote", "image", "clean"],
      ["table-better"],
    ],
    "better-table": {
      operationMenu: {
        items: {
          unmergeCells: { text: "Unmerge cells" },
        },
      },
    },
    keyboard: {
      bindings: QuillBetterTable.keyboardBindings,
    },
  },
});

const setMessage = (text, isError = false) => {
  message.textContent = text;
  message.className = `mt-4 text-sm font-medium ${isError ? "text-red-700" : "text-green-700"}`;
  message.classList.remove("hidden");
};

const toNumberOrNull = (value) => (value === "" ? null : Number(value));
const toTextOrNull = (value) => (value === "" ? null : value);

const slugify = (value) =>
  value.toLowerCase().trim().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "");

const readImages = async (files) =>
  Promise.all(
    [...files].map(
      (file) =>
        new Promise((resolve, reject) => {
          if (file.size > 3 * 1024 * 1024) {
            reject(new Error("Each image must be smaller than 3 MB."));
            return;
          }
          const reader = new FileReader();
          reader.onload = () => resolve({ name: file.name, type: file.type, data: reader.result });
          reader.onerror = () => reject(new Error(`Unable to read ${file.name}.`));
          reader.readAsDataURL(file);
        }),
    ),
  );

const renderImagePreview = () => {
  imagePreview.replaceChildren();
  imageItems.forEach((item, index) => {
    const card = document.createElement("div");
    card.className = "listing-photo-card rounded-xl border border-ink/10 bg-paper";
    card.draggable = true;
    card.dataset.imageIndex = String(index);
    const image = document.createElement("img");
    image.className = "h-full w-full object-cover";
    image.src = item.preview;
    image.alt = `Property photo ${index + 1}`;
    const badge = document.createElement("span");
    badge.className = "absolute bottom-2 left-2 rounded-full bg-ink/80 px-2 py-1 text-xs font-semibold text-paper";
    badge.textContent = index === 0 ? "Cover" : String(index + 1);
    const removeButton = document.createElement("button");
    removeButton.type = "button";
    removeButton.className = "absolute right-2 top-2 rounded-full bg-ink/80 px-2 py-1 text-xs font-semibold text-paper";
    removeButton.textContent = "×";
    removeButton.setAttribute("aria-label", `Remove property photo ${index + 1}`);
    removeButton.addEventListener("click", (event) => {
      event.stopPropagation();
      const [removed] = imageItems.splice(index, 1);
      if (removed.objectUrl) URL.revokeObjectURL(removed.objectUrl);
      renderImagePreview();
    });
    card.append(image, badge, removeButton);
    card.addEventListener("dragstart", () => {
      card.classList.add("is-dragging");
    });
    card.addEventListener("dragend", () => {
      card.classList.remove("is-dragging");
    });
    card.addEventListener("dragover", (event) => {
      event.preventDefault();
      const dragging = imagePreview.querySelector(".is-dragging");
      if (!dragging || dragging === card) return;
      const fromIndex = Number(dragging.dataset.imageIndex);
      const toIndex = Number(card.dataset.imageIndex);
      const [moved] = imageItems.splice(fromIndex, 1);
      imageItems.splice(toIndex, 0, moved);
      renderImagePreview();
    });
    imagePreview.append(card);
  });
};

const checkSession = async () => {
  const { data, error } = await supabase.auth.getUser();
  if (error || !data.user) {
    window.location.href = "../../index.html";
    return null;
  }
  return data.user;
};

const propertyFields = [
  "title", "listing_type", "price", "price_type", "built_up_size",
  "built_up_unit", "land_size", "land_unit", "bedrooms", "bathrooms",
  "car_parks", "floors", "furnishing", "tenure", "expiry_year", "year_built",
  "ceiling_height", "floor_loading", "power_supply", "direction", "bumi_status",
  "maintenance_fee", "address", "area", "postcode", "category_id", "city_id",
  "other_city",
];

const populateSelect = (select, rows, placeholder) => {
  select.replaceChildren(new Option(placeholder, ""));
  rows.forEach((row) => {
    select.add(new Option(row.name, row.id));
  });
};

const loadReferenceData = async () => {
  const [categoriesResponse, citiesResponse] = await Promise.all([
    supabase.from("property_categories").select("id, name").order("name"),
    supabase.from("cities").select("id, name, state").order("name"),
  ]);
  if (categoriesResponse.error) {
    throw new Error(`Unable to load property categories: ${categoriesResponse.error.message}`);
  }
  if (citiesResponse.error) {
    throw new Error(`Unable to load cities: ${citiesResponse.error.message}`);
  }
  populateSelect(form.elements.category_id, categoriesResponse.data || [], "Select a category");
  populateSelect(
    form.elements.city_id,
    citiesResponse.data || [],
    "Select a city",
  );
};

const updateCustomCityVisibility = () => {
  const selectedOption = citySelect.selectedOptions[0];
  const isOtherCity =
    selectedOption?.value === "21" ||
    selectedOption?.textContent.trim().toLowerCase() === "other";
  customCityField.classList.toggle("hidden", !isOtherCity);
  customCityInput.required = isOtherCity;
  if (!isOtherCity) {
    customCityInput.value = "";
  }
};

citySelect.addEventListener("change", updateCustomCityVisibility);

const loadProperty = async () => {
  if (!editId) return;
  const { data, error } = await supabase
    .from("properties")
    .select([...propertyFields, "description", "media"].join(", "))
    .eq("id", editId)
    .single();
  if (error) throw new Error(`Unable to load listing: ${error.message}`);
  propertyFields.forEach((field) => {
    if (data[field] !== null && data[field] !== undefined && form.elements[field]) {
      form.elements[field].value = data[field];
    }
  });
  if (data.description) {
    editor.clipboard.dangerouslyPasteHTML(data.description);
  }
  imageItems = Array.isArray(data.media)
    ? data.media.map((item) => ({
        preview: typeof item === "string" ? item : item.data,
        existing: item,
      })).filter((item) => item.preview)
    : [];
  renderImagePreview();
  updateCustomCityVisibility();
  setMessage("Editing this saved listing.");
};

form.addEventListener("submit", async (event) => {
  event.preventDefault();
  const submitButton = form.querySelector("button[type='submit']");
  submitButton.disabled = true;
  setMessage("Saving your listing...");

  try {
    const user = await checkSession();
    if (!user) return;
    const values = Object.fromEntries(new FormData(form));
    const newImageItems = imageItems.filter((item) => item.file);
    const newImages = await readImages(newImageItems.map((item) => item.file));
    const title = values.title.trim();
    const timestamp = Date.now().toString(36);
    const cityId = Number(values.city_id);
    const selectedCity = citySelect.selectedOptions[0];
    const isOtherCity =
      selectedCity?.value === "21" ||
      selectedCity?.textContent.trim().toLowerCase() === "other";
    const otherCity = values.other_city?.trim() || "";
    if (isOtherCity && !otherCity) {
      throw new Error("Please enter the other city name.");
    }
    const property = {
      title,
      description: editor.root.innerHTML === "<p><br></p>" ? null : editor.root.innerHTML,
      listing_type: values.listing_type,
      price: Number(values.price),
      category_id: Number(values.category_id),
      city_id: cityId,
      other_city: isOtherCity ? otherCity : null,
      price_type: values.price_type,
      built_up_size: toNumberOrNull(values.built_up_size),
      built_up_unit: toTextOrNull(values.built_up_unit),
      land_size: toNumberOrNull(values.land_size),
      land_unit: toTextOrNull(values.land_unit),
      bedrooms: toNumberOrNull(values.bedrooms),
      bathrooms: toNumberOrNull(values.bathrooms),
      car_parks: toNumberOrNull(values.car_parks),
      floors: toTextOrNull(values.floors),
      furnishing: toTextOrNull(values.furnishing),
      tenure: toTextOrNull(values.tenure),
      expiry_year: toNumberOrNull(values.expiry_year),
      year_built: toNumberOrNull(values.year_built),
      ceiling_height: toNumberOrNull(values.ceiling_height),
      floor_loading: toNumberOrNull(values.floor_loading),
      power_supply: toTextOrNull(values.power_supply?.trim()),
      direction: toTextOrNull(values.direction),
      bumi_status: toTextOrNull(values.bumi_status),
      maintenance_fee: toNumberOrNull(values.maintenance_fee),
      address: values.address.trim(),
      area: toTextOrNull(values.area.trim()),
      postcode: toTextOrNull(values.postcode.trim()),
      is_published: false,
    };
    newImages.forEach((image, index) => {
      const item = newImageItems[index];
      item.existing = image;
    });
    const media = imageItems
      .map((item) => item.existing)
      .filter(Boolean);
    property.media = media.length > 0 ? media : null;
    let response;
    if (editId) {
      response = await supabase
        .from("properties")
        .update(property)
        .eq("id", editId);
    } else {
      response = await supabase.from("properties").insert({
        property_code: `MY-${timestamp.toUpperCase()}`,
        slug: `${slugify(title)}-${timestamp}`,
        ...property,
        media: images.length > 0 ? images : null,
      });
    }

    if (response.error) throw new Error(response.error.message);
    if (!editId) {
      form.reset();
      editor.setContents([]);
      imageItems = [];
      renderImagePreview();
    }
    window.location.href = "../";
  } catch (error) {
    console.error("Unable to save listing:", error);
    setMessage(`Unable to save listing: ${error.message}`, true);
  } finally {
    submitButton.disabled = false;
  }
});

imageInput.addEventListener("change", () => {
  const selectedFiles = [...imageInput.files];
  const newItems = selectedFiles.map((file) => {
    const objectUrl = URL.createObjectURL(file);
    return { file, preview: objectUrl, objectUrl };
  });
  imageItems.push(...newItems);
  imageInput.value = "";
  renderImagePreview();
});

checkSession()
  .then(async (user) => {
    if (!user) return;
    await loadReferenceData();
    await loadProperty();
  })
  .catch((error) => {
    console.error("Unable to initialize listing:", error);
    setMessage(`Unable to load listing: ${error.message}`, true);
  });
