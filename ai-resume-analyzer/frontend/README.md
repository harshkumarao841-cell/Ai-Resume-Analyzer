# Frontend README

This folder contains the React frontend for AI Resume Analyzer. It lets users upload a resume, paste a job description, submit the analysis request, and view results in a dashboard.

## Main Files

- `src/main.jsx`: React app entry point
- `src/App.jsx`: route setup, layout, navbar, and animated page transitions
- `src/pages/Home.jsx`: landing page and feature overview
- `src/pages/Upload.jsx`: resume upload form, job description input, backend health check, and submit flow
- `src/pages/Dashboard.jsx`: analysis results dashboard
- `src/services/api.js`: Axios client and API helpers
- `src/components/ScoreCard.jsx`: animated match score component
- `src/components/SkillTags.jsx`: skill badge lists
- `src/components/Navbar.jsx`: top navigation
- `src/index.css`: Tailwind base styles and reusable component classes
- `vite.config.js`: Vite config and development proxy
- `wrangler.toml`: Cloudflare Pages config

## Requirements

- Node.js 18 or newer
- npm
- Running backend API, local or deployed

## Local Setup

Install dependencies:

```bash
npm install
```

Run the development server:

```bash
npm run dev
```

Open:

```text
http://127.0.0.1:5173
```

## Scripts

```bash
npm run dev
```

Starts the Vite development server.

```bash
npm run build
```

Creates a production build in `dist/`.

```bash
npm run preview
```

Previews the production build locally.

## Backend URL

The frontend currently points to:

```text
https://resume-backend-gigu.onrender.com
```

This URL is used in:

- `src/services/api.js`
- `src/pages/Upload.jsx`
- `vite.config.js`

For local backend development, change it to:

```text
http://127.0.0.1:8000
```

## User Flow

1. User opens the app and clicks "Get Started".
2. User uploads a PDF or DOCX resume.
3. User pastes a job description.
4. Upload page checks whether the backend is online.
5. User submits the form.
6. The app sends `resume` and `job_description` to `POST /api/analyze`.
7. The dashboard displays the returned score, skills, missing skills, charts, and suggestions.

## Styling

The frontend uses Tailwind CSS with reusable classes in `src/index.css`, including:

- `.glass`
- `.btn`
- `.btn-ghost`
- `.badge`
- `.eyebrow`

Theme colors are configured in `tailwind.config.js`.

## Deployment

Build the app:

```bash
npm run build
```

Deploy the generated `dist/` folder to a static host such as Cloudflare Pages, Vercel, Netlify, or GitHub Pages.

This project includes `wrangler.toml` for Cloudflare Pages:

```toml
name = "ai-resume-analyzer"
compatibility_date = "2026-05-01"
pages_build_output_dir = "./dist"
```

After deployment, add the deployed frontend domain to the backend CORS list in `backend/main.py`.

