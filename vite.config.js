const { defineConfig } = require("vite");
const { resolve } = require("node:path");

module.exports = defineConfig({
  build: {
    rollupOptions: {
      input: {
        main: resolve(__dirname, "index.html"),
        commercial: resolve(__dirname, "commercial/index.html"),
        dashboard: resolve(__dirname, "dashboard/index.html"),
        addListing: resolve(__dirname, "dashboard/add-listing/index.html"),
      },
    },
  },
});
