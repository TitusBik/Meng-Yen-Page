import { supabase } from "./supabase.js";

const userName = document.querySelector("[data-user-name]");
const userCardName = document.querySelector("[data-user-card-name]");
const userCardEmail = document.querySelector("[data-user-card-email]");
const userEmail = document.querySelector("[data-user-email]");
const userPhone = document.querySelector("[data-user-phone]");
const userBio = document.querySelector("[data-user-bio]");
const userInitials = document.querySelector("[data-user-initials]");
const userAvatar = document.querySelector("[data-user-avatar]");
const listingCount = document.querySelector("[data-listing-count]");
const listings = document.querySelector("[data-listings]");
const listingsEmpty = document.querySelector("[data-listings-empty]");
const editProfileButton = document.querySelector("[data-edit-profile]");
const profileForm = document.querySelector("[data-profile-form]");
const cancelProfileButton = document.querySelector("[data-cancel-profile]");
const profileMessage = document.querySelector("[data-profile-message]");
const profilePreview = document.querySelector("[data-profile-preview]");
const profilePreviewLabel = document.querySelector("[data-profile-preview-label]");
const errorMessage = document.querySelector("[data-dashboard-error]");
const logoutButton = document.querySelector("[data-dashboard-action]");
let currentUser;
let previewObjectUrl;

const getInitials = (name) =>
  name
    .split(/\s+/)
    .filter(Boolean)
    .map((part) => part[0])
    .join("")
    .slice(0, 2)
    .toUpperCase() || "ME";

const setAvatar = (avatarUrl, displayName) => {
  userInitials.textContent = getInitials(displayName);
  if (avatarUrl) {
    userAvatar.src = avatarUrl;
    userAvatar.classList.remove("hidden");
    userInitials.classList.add("hidden");
  } else {
    userAvatar.removeAttribute("src");
    userAvatar.classList.add("hidden");
    userInitials.classList.remove("hidden");
  }
};

const setFormPreview = (source, label) => {
  if (previewObjectUrl) {
    URL.revokeObjectURL(previewObjectUrl);
    previewObjectUrl = undefined;
  }
  if (!source) {
    profilePreview.removeAttribute("src");
    profilePreview.classList.add("hidden");
    profilePreviewLabel.textContent = "Choose a photo to preview it here.";
    return;
  }
  if (source instanceof File) {
    previewObjectUrl = URL.createObjectURL(source);
    profilePreview.src = previewObjectUrl;
  } else {
    profilePreview.src = source;
  }
  profilePreview.alt = `${label} profile picture preview`;
  profilePreview.classList.remove("hidden");
  profilePreviewLabel.textContent = "This is how your profile picture will look.";
};

const getProfile = async (user) => {
  const metadataProfile = {
    full_name: user.user_metadata?.full_name || "",
    phone: user.user_metadata?.phone || "",
    bio: user.user_metadata?.bio || "",
    avatar_url: user.user_metadata?.avatar_url || "",
  };
  const { data, error } = await supabase
    .from("profiles")
    .select("name, email, phone, bio, avatar_url")
    .eq("id", user.id)
    .maybeSingle();

  if (error) {
    console.error("Unable to load profile from database:", error);
    return {
      profile: metadataProfile,
      warning: `Profile database sync is unavailable: ${error.message}`,
    };
  }

  if (data) {
    return {
      profile: {
        full_name: data.name || "",
        email: data.email || user.email || "",
        phone: data.phone || "",
        bio: data.bio || "",
        avatar_url: data.avatar_url || "",
      },
    };
  }

  const { error: insertError } = await supabase
    .from("profiles")
    .insert({
      id: user.id,
      email: user.email || "",
      name: metadataProfile.full_name,
      phone: metadataProfile.phone,
      bio: metadataProfile.bio,
      avatar_url: metadataProfile.avatar_url,
    });

  if (insertError) {
    console.error("Unable to create profile in database:", insertError);
    return {
      profile: metadataProfile,
      warning: `Profile database sync is unavailable: ${insertError.message}`,
    };
  }

  return { profile: metadataProfile };
};

const saveProfile = async (user, profile) => {
  const { error: profileError } = await supabase
    .from("profiles")
    .upsert(
      {
        id: user.id,
        email: user.email || "",
        name: profile.full_name,
        phone: profile.phone,
        bio: profile.bio,
        avatar_url: profile.avatar_url,
      },
      { onConflict: "id" },
    );

  if (profileError) {
    throw new Error(`Unable to save profile to database: ${profileError.message}`);
  }

  const { data, error: authError } = await supabase.auth.updateUser({
    data: {
      ...user.user_metadata,
      ...profile,
    },
  });

  if (authError) {
    throw new Error(`Profile database saved, but Auth metadata failed: ${authError.message}`);
  }

  return data.user;
};

const showError = (message) => {
  errorMessage.textContent = message;
  errorMessage.classList.remove("hidden");
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
    card.className = "rounded-xl border border-ink/10 bg-paper p-5";
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
    card.append(header, details);
    listings.append(card);
  });
};

const loadDashboard = async () => {
  const { data, error } = await supabase.auth.getUser();

  if (error || !data.user) {
    window.location.href = "../index.html";
    return;
  }

  const user = data.user;
  const { profile, warning } = await getProfile(user);
  if (warning) {
    showError(warning);
  }
  currentUser = { ...user, user_metadata: { ...user.user_metadata, ...profile } };
  const displayName = profile.full_name || user.email?.split("@")[0] || "there";

  userName.textContent = displayName;
  userCardName.textContent = displayName;
  userCardEmail.textContent = user.email || "Not provided";
  userEmail.textContent = user.email || "Not provided";
  userPhone.textContent = profile.phone || "Not provided";
  userBio.textContent = profile.bio || "Tell people about yourself.";
  profileForm.elements.name.value = profile.full_name;
  profileForm.elements.phone.value = profile.phone;
  profileForm.elements.bio.value = profile.bio;
  const { count, error: listingsError } = await supabase
    .from("properties")
    .select("id", { count: "exact", head: true });
  if (listingsError) {
    throw new Error(`Unable to load properties: ${listingsError.message}`);
  }
  listingCount.textContent = count ?? 0;
  const { data: propertyRows, error: propertiesError } = await supabase
    .from("properties")
    .select("id, title, address, listing_type, price")
    .order("created_at", { ascending: false })
    .limit(5);
  if (propertiesError) {
    throw new Error(`Unable to load property listings: ${propertiesError.message}`);
  }
  renderListings(propertyRows || []);
  setAvatar(profile.avatar_url, displayName);
  setFormPreview(profile.avatar_url, displayName);
};

editProfileButton.addEventListener("click", () => {
  profileMessage.classList.add("hidden");
  profileForm.classList.remove("hidden");
  profileForm.elements.name.focus();
});

cancelProfileButton.addEventListener("click", () => {
  profileForm.classList.add("hidden");
});

profileForm.elements.picture.addEventListener("change", () => {
  const file = profileForm.elements.picture.files[0];
  if (!file) {
    setFormPreview(currentUser.user_metadata?.avatar_url, userName.textContent);
    return;
  }
  if (file.size > 2 * 1024 * 1024) {
    profileMessage.textContent = "Please choose an image smaller than 2 MB.";
    profileMessage.className = "text-sm font-medium text-red-700";
    profileMessage.classList.remove("hidden");
    return;
  }
  profileMessage.classList.add("hidden");
  setFormPreview(file, userName.textContent);
});

profileForm.addEventListener("submit", async (event) => {
  event.preventDefault();
  const submitButton = profileForm.querySelector("button[type='submit']");
  const picture = profileForm.elements.picture.files[0];
  let avatarUrl = currentUser.user_metadata?.avatar_url || "";

  if (picture) {
    avatarUrl = await new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = () => resolve(reader.result);
      reader.onerror = () => reject(new Error("Unable to read profile picture."));
      reader.readAsDataURL(picture);
    });
  }

  submitButton.disabled = true;
  const profile = {
    full_name: profileForm.elements.name.value.trim(),
    phone: profileForm.elements.phone.value.trim(),
    bio: profileForm.elements.bio.value.trim(),
    avatar_url: avatarUrl,
  };
  let updatedUser;
  try {
    updatedUser = await saveProfile(currentUser, profile);
  } catch (error) {
    submitButton.disabled = false;
    profileMessage.textContent = error.message;
    profileMessage.className = "text-sm font-medium text-red-700";
    profileMessage.classList.remove("hidden");
    return;
  }
  submitButton.disabled = false;
  currentUser = { ...updatedUser, user_metadata: { ...updatedUser.user_metadata, ...profile } };
  const displayName = profileForm.elements.name.value.trim() || "there";
  userName.textContent = displayName;
  userCardName.textContent = displayName;
  userCardEmail.textContent = currentUser.email || "Not provided";
  userPhone.textContent = profileForm.elements.phone.value.trim() || "Not provided";
  userBio.textContent = profileForm.elements.bio.value.trim() || "Tell people about yourself.";
  setAvatar(avatarUrl, displayName);
  setFormPreview(avatarUrl, displayName);
  profileMessage.textContent = "Profile updated.";
  profileMessage.className = "text-sm font-medium text-green-700";
  profileMessage.classList.remove("hidden");
  profileForm.classList.add("hidden");
});

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

loadDashboard().catch((error) => {
  console.error("Unable to load dashboard:", error);
  showError(`Unable to load your account information: ${error.message}`);
});
