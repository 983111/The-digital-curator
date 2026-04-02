# The Digital Curator

The project is now split into two websites:

- **Public blog app** at the repository root (`/` routes).
- **Admin app** in `./admin` (`/login`, `/`, `/editor`, `/editor/:id` inside the admin app).

Both apps use the same Supabase backend configuration and continue to work with the same `posts` table and `blog-images` storage bucket.

## Run apps locally

```bash
# public site
npm install
npm run dev

# admin site (separate app)
npm --prefix admin install
npm run dev:admin
```

## Build

```bash
npm run build
npm run build:admin
```
