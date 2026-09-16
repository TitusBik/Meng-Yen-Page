const { defineConfig } = require("vite");
const { resolve } = require("node:path");

module.exports = defineConfig({
  base: process.env.NODE_ENV === "production" ? "/Meng-Yen-Page/" : "/",
  build: {
    rollupOptions: {
      input: {
        main: resolve(__dirname, "index.html"),
        commercial: resolve(__dirname, "commercial/index.html"),
        residential: resolve(__dirname, "residential/index.html"),
        newLaunchProject: resolve(__dirname, "new_launch_project/index.html"),
        about: resolve(__dirname, "about/index.html"),
        contact: resolve(__dirname, "contact/index.html"),
        dashboard: resolve(__dirname, "dashboard/index.html"),
        addListing: resolve(__dirname, "dashboard/add-listing/index.html"),
      },
    },
  },
});
