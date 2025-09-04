
# Blog App (React + Vite + Redux + Appwrite)

A modern blog application built with React + Vite, Redux for auth state, and Appwrite for Authentication, Database, and Storage. It supports creating, editing, and managing posts with cover images and a rich text editor (TinyMCE).

## Features

- Browse all published posts on `Home`.
- View only your posts on `All Posts` when logged in.
- Authentication (signup/login) with protected routes.
- Create, edit, delete posts with cover image upload to Appwrite Storage.
- Rich text editor (TinyMCE) with quickbars, autosave, code samples, emoticons, and image paste/drag upload.
- Drafts support via `status` field (`active`/`inactive`).
- Responsive UI.

## Tech Stack

- React + Vite
- Redux Toolkit (auth slice)
- Appwrite (Auth, Database, Storage)
- TinyMCE (via `@tinymce/tinymce-react`)
- Tailwind-style utility classes (via PostCSS setup from Vite template)

## Getting Started

1) Clone and install

```bash
git clone https://github.com/AdityasinhJadav/blog.git
cd blog
npm install
```

2) Configure environment variables

Create a `.env` file in the project root with the following keys (see `src/conf/conf.js`):

```bash
VITE_APPWRITE_URL=YOUR_APPWRITE_ENDPOINT
VITE_APPWRITE_PROJECT_ID=YOUR_PROJECT_ID
VITE_APPWRITE_DATABASE_ID=YOUR_DATABASE_ID
VITE_APPWRITE_COLLECTION_ID=YOUR_COLLECTION_ID
VITE_APPWRITE_BUCKET_ID=YOUR_BUCKET_ID
```

3) Run the dev server

```bash
npm run dev
```

## Appwrite Setup (Quick Outline)

- Create a Project in Appwrite and note the Project ID.
- Create a Database and a Collection for posts.
  - Recommended attributes: `title` (string), `content` (string), `status` (string), `userId` (string), and optionally `featuredImage` (string) or `image` (string) depending on your collection schema.
- Create a Storage Bucket for images and note the Bucket ID.
- Configure Web App platform with your dev origin (e.g., `http://localhost:5173`).
- Ensure appropriate permissions for creating/listing documents and files for authenticated users.

## Scripts

- `npm run dev` – Start development server
- `npm run build` – Build for production
- `npm run preview` – Preview the production build

## Editor (TinyMCE)

- TinyMCE is integrated via `src/components/RTX.jsx` with:
  - Plugins: quickbars, autosave, emoticons, codesample, media, tables, wordcount, preview, fullscreen, code, etc.
  - Image uploads are handled by `images_upload_handler`, which uploads pasted/dropped images to Appwrite Storage and inserts their direct URLs.
- The API key is currently set in code for convenience. For production, consider moving it to an environment variable.

## Post Visibility Rules

- `Home` shows all posts (optionally filtered by `status = active`).
- `All Posts` shows only the currently authenticated user's posts (filtered by `userId`).

## Folder Structure (partial)

```
src/
  appwrite/
    config.js        # Appwrite service wrapper
  components/
    post-form/
      PostForm.jsx   # Create/Edit post form
    RTX.jsx          # TinyMCE wrapper component
    Header/, Footer/ # Layout components
  pages/
    Home.jsx, AllPosts.jsx, Post.jsx, Login.jsx, Signup.jsx
  conf/
    conf.js          # Loads env vars used by Appwrite services
```

## Notes

- This project normalizes the image field: the service will map `image` or `featuredImage` to `featuredImage` in the client to accommodate different collection schemas.
- Drafts are represented using `status = inactive`.

## License

MIT – feel free to use and modify.

