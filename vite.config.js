const { defineConfig } = require("vite");
const { resolve } = require("node:path");

module.exports = defineConfig({
  base: process.env.NODE_ENV === "production" ? "/Meng-Yen-Page/" : "/",
  build: {
    rollupOptions: {
      output: {
        entryFileNames: "assets/[name].js",
        assetFileNames: ({ name }) =>
          name?.endsWith(".css") ? "assets/[name][extname]" : "assets/[name]-[hash][extname]",
      },
      input: {
      footer: resolve(__dirname, "src/css/footer.js"),
      navbar: resolve(__dirname, "src/css/navbar.js"),
        dashboard: resolve(__dirname, "src/css/dashboard.js"),
        listing: resolve(__dirname, "src/css/listing.js"),
        commercial: resolve(__dirname, "src/css/commercial.js"),
        commercialDetail: resolve(__dirname, "src/css/commercial-detail.js"),
        propertyListings: resolve(__dirname, "src/css/property-listings.js"),
        propertyDetail: resolve(__dirname, "src/css/property-detail.js"),
        homepage: resolve(__dirname, "src/css/homepage.js"),
        awards: resolve(__dirname, "src/css/awards.js"),
      },
    },
  },
});
