# The Digital Curator — Setup Guide

Your Supabase project is already configured at:
- **Project URL:** `https://wjzlxdfgppoopylxawcw.supabase.co`
- **Project ID:** `wjzlxdfgppoopylxawcw` (ap-south-1 region)

The database schema (posts table, RLS policies, image storage bucket) is already applied.

---

## 1. Create your admin account in Supabase

Go to your Supabase dashboard → **Authentication → Users → Add User**

- Set your email and password
- This is the only account that can access `/admin`

> **Only authenticated users** can create/edit/delete posts. The public blog can only *read* published posts.

---

## 2. Copy the updated files into your project

Replace the following files in your existing project with the ones provided:

| File | What changed |
|------|-------------|
| `src/App.tsx` | Added `AuthProvider`, `ProtectedRoute`, `Login` route |
| `src/lib/supabase.ts` | Hardcoded project URL+key, full CRUD helpers, image upload |
| `src/contexts/AuthContext.tsx` | **NEW** — session state across the app |
| `src/components/ProtectedRoute.tsx` | **NEW** — redirects to `/admin/login` if not signed in |
| `src/pages/admin/Login.tsx` | **NEW** — email/password login page |
| `src/pages/admin/Dashboard.tsx` | Reads real data from Supabase, delete works |
| `src/pages/admin/Editor.tsx` | Saves to Supabase, image upload to Storage |
| `src/pages/public/Home.tsx` | Reads published posts from Supabase, no mock data |
| `src/pages/public/PostView.tsx` | Reads from Supabase, increments view count |
| `src/layouts/AdminLayout.tsx` | Sign Out button now actually signs you out |

You can also **delete** `src/lib/mockData.ts` — it's no longer used.

---

## 3. How it works end-to-end

```
You → /admin/login  →  Sign in with your email/password
                    →  /admin (Dashboard)
                    →  /admin/editor  (write post)
                    →  Click "Publish Post"
                    →  Post saved to Supabase with status='published'

Readers → /  →  See all published posts (fetched from Supabase)
         → /post/your-slug  →  Read the full post
```

### Admin routes
| Route | Description |
|-------|-------------|
| `/admin/login` | Login page — public |
| `/admin` | Dashboard with stats & post list |
| `/admin/editor` | Create new post |
| `/admin/editor/:id` | Edit existing post |

### Public routes
| Route | Description |
|-------|-------------|
| `/` | Homepage with featured + recent posts |
| `/post/:slug` | Full post view |

---

## 4. Image uploads

Images are stored in Supabase Storage bucket `blog-images` (already created, set to public). When you upload an image in the editor, it goes straight to your Supabase storage and the public URL is saved with the post. No third-party CDN needed.

---

## 5. No environment variables needed

The Supabase URL and anon key are hardcoded in `src/lib/supabase.ts`. The anon key is safe to expose in the frontend — RLS policies ensure only authenticated users can write data.
