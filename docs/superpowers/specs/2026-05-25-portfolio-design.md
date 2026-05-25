# Portfolio Design Spec
**Date:** 2026-05-25
**Owner:** Ziyue Liu — AI UX Researcher, Ph.D Applied Linguistics

---

## Context

Ziyue needs a professional portfolio targeting AI UX researcher roles. The portfolio must present research projects, publications, skills, and a bio in a polished, minimal style. A private admin portal lets Ziyue edit all content from any browser without touching code. Content is stored as markdown files in the git repo (version-controlled, portable). The public client portal is fully static for speed and SEO.

---

## Architecture

Single Next.js 14 (App Router) monorepo deployed on Vercel. Two zones share one codebase:

- **Client portal** — public, statically generated at build time from markdown files
- **Admin portal** — password-protected, server-rendered, commits edits to GitHub via API which triggers an automatic Vercel redeploy (~1 min publish delay)

```
ziyue-profolio/
├── app/
│   ├── (portfolio)/        ← public client portal (SSG)
│   │   ├── page.tsx        ← homepage / hero
│   │   ├── projects/
│   │   │   ├── page.tsx    ← project grid
│   │   │   └── [slug]/     ← individual case study
│   │   ├── publications/
│   │   └── contact/
│   ├── admin/              ← password-protected admin portal
│   │   ├── login/
│   │   └── dashboard/
│   └── api/
│       ├── auth/           ← login / logout
│       └── content/        ← GitHub commit API
├── content/                ← markdown source of truth
│   ├── about.md
│   ├── skills.md
│   ├── projects/
│   └── publications/
├── public/
│   └── files/              ← CV PDF, paper PDFs
└── middleware.ts           ← protects /admin/* at the edge
```

---

## Content Structure

All content lives in `/content/` as markdown with YAML frontmatter.

### `content/about.md`
```yaml
---
name: Ziyue Liu
title: AI UX Researcher
tagline: Bridging language, cognition, and human-AI interaction
email: ...
cv_url: /files/cv.pdf
---
Bio text...
```

### `content/projects/<slug>.md`
```yaml
---
title: Conversational AI Usability Study
date: 2024-03
tags: [NLP, usability testing, think-aloud protocol]
summary: One-line description for grid card
featured: true
---
Full case study: background, methods, findings, impact...
```

### `content/publications/<slug>.md`
```yaml
---
title: "Pragmatic Competence in LLM Interactions"
journal: Journal of Applied Linguistics
year: 2024
doi: 10.xxxx/...
pdf_url: /files/papers/paper.pdf
---
Abstract...
```

### `content/skills.md`
Freeform markdown listing expertise areas, research methods, and tools.

**Parsing libraries:** `gray-matter` (frontmatter) + `next-mdx-remote` (rendering).

---

## Client Portal

Fully static (SSG). Pages:

| Route | Content |
|---|---|
| `/` | Hero (name, title, tagline) + featured projects grid |
| `/projects` | All research case studies as cards |
| `/projects/[slug]` | Full case study: methodology, findings, impact |
| `/publications` | Chronological list with DOI badges + PDF downloads |
| `/contact` | Contact form + CV download |

**Visual style — Minimal Clean:**
- Font: Inter (sans-serif)
- Colors: `#ffffff` bg, `#111` primary, `#666` secondary, `#4F46E5` accent (indigo)
- Layout: 768px text / 1024px grid max-width, generous white space
- Nav: simple top bar, no hamburger
- Mobile-responsive throughout

**Contact form:** sends email via Resend API (free tier). CV download serves `/public/files/cv.pdf`.

---

## Admin Portal

Accessible at `/admin`, private.

**Login:** Password entered at `/admin/login` → API checks against `ADMIN_PASSWORD_HASH` env var using bcrypt → sets signed JWT in HttpOnly cookie → redirect to dashboard.

**Dashboard:**
- Sidebar: About, Projects, Publications, Skills, Settings
- Main area: content editor for selected section

**Editing experience:**
- About / Skills: single-file markdown editor with live split-pane preview
- Projects: list + "New Project" → frontmatter form fields + body editor
- Publications: list + "New Publication" → structured fields + abstract editor
- Save: API route commits updated markdown to GitHub → "Publishing (~1 min)" toast

**Editor component:** `@uiw/react-md-editor`

**File uploads:** PDFs committed to `/public/files/` via GitHub API alongside markdown.

---

## Auth & Security

- Password stored as bcrypt hash in `ADMIN_PASSWORD_HASH` env var
- Login API route (`/api/auth/login`) runs in Node.js runtime: verifies password with `bcryptjs`, issues JWT signed with `jose`
- JWT stored as `HttpOnly; Secure; SameSite=Strict` cookie (7-day expiry)
- `middleware.ts` runs on Vercel's edge runtime: verifies JWT signature with `jose` (edge-compatible) on every `/admin/*` request; invalid token → redirect to login
- GitHub API calls happen only in Node.js API routes; `GITHUB_TOKEN` never exposed to browser
- GitHub PAT is fine-grained, scoped to this repo only (contents: read + write)

**Required environment variables:**
```
ADMIN_PASSWORD_HASH=   # bcrypt hash of your chosen password
JWT_SECRET=            # random 32-char secret
GITHUB_TOKEN=          # fine-grained GitHub PAT
GITHUB_REPO=           # username/ziyue-profolio
RESEND_API_KEY=        # for contact form emails
```

---

## Deployment

1. Push repo to GitHub
2. Connect to Vercel (auto-detects Next.js, zero config)
3. Add env vars in Vercel dashboard
4. Every push to `main` redeploys; admin saves also trigger redeploy via GitHub commit

Local dev: `npm run dev` — full app at `localhost:3000` using `.env.local`.

---

## Verification

- [ ] All client pages render and are mobile-responsive
- [ ] Project slugs resolve to correct case studies
- [ ] CV download and paper PDF links work
- [ ] Contact form sends email via Resend
- [ ] Admin login/logout works; session persists 7 days
- [ ] Create, edit, delete a project → GitHub commit appears → Vercel redeploys
- [ ] PDF upload appears in `/public/files/` after save
- [ ] `/admin/*` without valid cookie redirects to login
- [ ] `GITHUB_TOKEN` absent from browser network tab

---

## Out of Scope

- Analytics
- Internationalisation
- Dark mode
- Comments / social features
