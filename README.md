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

## Supabase profile data

Personal details are stored in both Supabase Auth metadata and the `public.profiles`
table. Run [supabase/migrations/001_profiles.sql](supabase/migrations/001_profiles.sql)
in the Supabase SQL Editor before using the dashboard. The table is protected with
row-level security so users can only read and update their own profile.

The add-listing page reads the listing count from `public.properties` and inserts
new records there. Run [supabase/migrations/002_properties_access.sql](supabase/migrations/002_properties_access.sql)
to grant authenticated users access. The current schema does not include an
owner column, so property records are shared; add an `owner_id uuid` column and
owner policies before requiring per-user listing privacy.

If inserts fail with `new row violates row-level security policy for table
"properties"`, also run
[supabase/migrations/003_properties_rls.sql](supabase/migrations/003_properties_rls.sql).
It adds the authenticated read and insert policies required by the current
shared-properties schema.