const request = async (action, options = {}) => {
  const response = await fetch(`/Meng-Yen-Page/api.php?action=${action}${options.query || ""}`, {
    method: options.method || "GET",
    headers: options.body ? { "Content-Type": "application/json" } : {},
    body: options.body ? JSON.stringify(options.body) : undefined,
    credentials: "same-origin",
  });
  const payload = await response.json();
  if (!response.ok) {
    throw new Error(payload.error || "The server could not complete that request.");
  }
  return payload;
};

export const api = {
  login: (email, password) => request("login", { method: "POST", body: { email, password } }),
  session: () => request("session"),
  logout: () => request("logout", { method: "POST" }),
  profile: () => request("profile"),
  saveProfile: (profile) => request("profile", { method: "PUT", body: profile }),
  reference: () => request("reference"),
  properties: () => request("properties"),
  property: (id) => request("properties", { query: `&id=${encodeURIComponent(id)}` }),
  saveProperty: (property) => request("properties", { method: "POST", body: property }),
  uploadImages: async (propertyId, files) => {
    const formData = new FormData();
    formData.append("property_id", propertyId);
    files.forEach((file) => formData.append("images[]", file));
    const response = await fetch("/Meng-Yen-Page/api.php?action=upload-images", {
      method: "POST",
      body: formData,
      credentials: "same-origin",
    });
    const payload = await response.json();
    if (!response.ok) {
      throw new Error(payload.error || "Unable to upload property photos.");
    }
    return payload;
  },
};
