# Meng-Yen Page

## Development

Install dependencies:

```bash
npm install
```

Available commands:

```bash
# Starts the Vite development server
npm run dev

# Builds minified files into dist/
npm run build

# Serves the built dist/ folder locally
npm run preview

# Builds and publishes dist/ to the gh-pages branch
npm run deploy
```

The source stylesheet is [src/css/input.css](src/css/input.css), and the generated file is `public/css/styles.css`. Tailwind scans the root HTML files, `pages/**/*.html`, and `src/**/*.html`, so future pages can be added without changing the build command. Link them from the existing navigation with a relative URL such as `pages/about.html`.