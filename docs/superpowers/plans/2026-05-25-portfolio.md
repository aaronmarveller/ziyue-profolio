# Portfolio Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Build a full-stack portfolio for Ziyue Liu (AI UX researcher, Ph.D Applied Linguistics) with a public static client portal and a password-protected admin portal that edits markdown content via GitHub API and auto-deploys on Vercel.

**Architecture:** Single Next.js 14 (App Router) monorepo. Client portal is SSG-generated from `/content/*.md` files at build time. Admin portal at `/admin` commits edits to GitHub via REST API, triggering automatic Vercel redeploy (~1 min). JWT in HttpOnly cookie protects admin routes via edge middleware. Admin always reads content from GitHub API (not filesystem) to stay current between redeploys.

**Tech Stack:** Next.js 14, TypeScript, Tailwind CSS, gray-matter, next-mdx-remote/rsc, jose (JWT, edge-safe), bcryptjs (password hashing, Node.js), @uiw/react-md-editor (markdown editor), Resend (contact email), Vercel (deploy), Jest + @testing-library/react (tests)

---

## File Map

```
ziyue-profolio/
├── app/
│   ├── (portfolio)/
│   │   ├── layout.tsx              # Nav + footer wrapper
│   │   ├── page.tsx                # Hero + featured projects grid
│   │   ├── projects/
│   │   │   ├── page.tsx            # All projects grid
│   │   │   └── [slug]/page.tsx     # Case study detail
│   │   ├── publications/
│   │   │   └── page.tsx            # Publications list
│   │   └── contact/
│   │       └── page.tsx            # Contact form + CV download
│   ├── admin/
│   │   ├── layout.tsx              # Admin sidebar wrapper
│   │   ├── page.tsx                # Redirect to /admin/dashboard/about
│   │   ├── login/page.tsx          # Login form (client component)
│   │   └── dashboard/
│   │       ├── about/page.tsx      # About + skills editor
│   │       ├── projects/
│   │       │   ├── page.tsx        # Project list
│   │       │   ├── new/page.tsx    # New project editor
│   │       │   └── [slug]/page.tsx # Edit project
│   │       └── publications/
│   │           ├── page.tsx        # Publication list
│   │           ├── new/page.tsx    # New publication editor
│   │           └── [slug]/page.tsx # Edit publication
│   └── api/
│       ├── auth/
│       │   ├── login/route.ts      # POST: verify password, set cookie
│       │   └── logout/route.ts     # POST: clear cookie
│       ├── contact/route.ts        # POST: send email via Resend
│       └── content/route.ts        # POST: commit file to GitHub
├── components/
│   ├── portfolio/
│   │   ├── Nav.tsx
│   │   ├── Hero.tsx
│   │   ├── ProjectCard.tsx
│   │   └── ContactForm.tsx         # Client component
│   └── admin/
│       ├── AdminSidebar.tsx
│       ├── ContentEditor.tsx        # react-md-editor (dynamic import, no SSR)
│       ├── ProjectForm.tsx          # Client component: frontmatter + body
│       └── PublicationForm.tsx      # Client component: structured fields + abstract
├── lib/
│   ├── content.ts                  # Read markdown from filesystem (SSG only)
│   ├── auth.ts                     # signToken / verifyToken with jose
│   └── github.ts                   # readFile / commitFile / listFiles via GitHub REST
├── content/
│   ├── about.md
│   ├── skills.md
│   ├── projects/
│   │   └── ai-voice-assistant-ux.md
│   └── publications/
│       └── pragmatic-competence-llms.md
├── public/files/                   # CV PDF, paper PDFs (committed to repo)
├── __tests__/
│   └── lib/
│       ├── content.test.ts
│       ├── auth.test.ts
│       └── github.test.ts
├── middleware.ts                   # Protect /admin/* at the edge
├── jest.config.ts
├── jest.setup.ts
├── .env.local.example
└── .gitignore
```

---

## Task 1: Project Scaffolding + Test Setup

**Files:**
- Create: `ziyue-profolio/` (entire project root via create-next-app)
- Create: `jest.config.ts`
- Create: `jest.setup.ts`
- Create: `.env.local.example`
- Create: `.gitignore`

- [ ] **Step 1: Bootstrap Next.js app**

```bash
cd /Users/pliu/Documents/ai_project
npx create-next-app@latest ziyue-profolio \
  --typescript --tailwind --eslint --app \
  --no-src-dir --import-alias "@/*" \
  --no-git
cd ziyue-profolio
```

- [ ] **Step 2: Install dependencies**

```bash
npm install gray-matter next-mdx-remote jose bcryptjs resend
npm install -D @types/bcryptjs jest jest-environment-jsdom \
  @testing-library/react @testing-library/jest-dom \
  @testing-library/user-event
npm install @uiw/react-md-editor
```

- [ ] **Step 3: Write jest.config.ts**

```typescript
// jest.config.ts
import type { Config } from 'jest'
import nextJest from 'next/jest.js'

const createJestConfig = nextJest({ dir: './' })

const config: Config = {
  testEnvironment: 'jsdom',
  setupFilesAfterEnv: ['<rootDir>/jest.setup.ts'],
  moduleNameMapper: { '^@/(.*)$': '<rootDir>/$1' },
}

export default createJestConfig(config)
```

- [ ] **Step 4: Write jest.setup.ts**

```typescript
// jest.setup.ts
import '@testing-library/jest-dom'
```

- [ ] **Step 5: Write .env.local.example**

```bash
# .env.local.example
ADMIN_PASSWORD_HASH=   # bcrypt hash — generate with: node scripts/hash-password.js
JWT_SECRET=            # random 32-char string
GITHUB_TOKEN=          # fine-grained PAT: contents read+write on this repo
GITHUB_REPO=           # e.g. yourusername/ziyue-profolio
RESEND_API_KEY=        # from resend.com
```

- [ ] **Step 6: Update .gitignore**

Append to the generated `.gitignore`:

```
.env.local
public/files/*.pdf
```

- [ ] **Step 7: Remove boilerplate**

Delete `app/page.tsx` content and `app/globals.css` beyond the Tailwind directives. Replace `app/globals.css` with:

```css
@tailwind base;
@tailwind components;
@tailwind utilities;
```

- [ ] **Step 8: Run tests to confirm setup**

```bash
npm test -- --passWithNoTests
```

Expected: Test suite passes with 0 tests.

- [ ] **Step 9: Initialize git and commit**

```bash
git init
git add -A
git commit -m "feat: scaffold Next.js 14 project with test setup"
```

---

## Task 2: Content Types + Sample Markdown Files

**Files:**
- Create: `types/content.ts`
- Create: `content/about.md`
- Create: `content/skills.md`
- Create: `content/projects/ai-voice-assistant-ux.md`
- Create: `content/publications/pragmatic-competence-llms.md`
- Create: `public/files/.gitkeep`

- [ ] **Step 1: Create types/content.ts**

```typescript
// types/content.ts
export interface Project {
  slug: string
  title: string
  date: string       // "YYYY-MM"
  tags: string[]
  summary: string
  featured: boolean
  content: string    // markdown body
}

export interface Publication {
  slug: string
  title: string
  journal: string
  year: number
  doi: string
  pdf_url: string
  content: string    // abstract in markdown
}

export interface About {
  name: string
  title: string
  tagline: string
  email: string
  cv_url: string
  content: string    // bio in markdown
}

export interface Skills {
  content: string    // freeform markdown
}
```

- [ ] **Step 2: Create content/about.md**

```markdown
---
name: Ziyue Liu
title: AI UX Researcher
tagline: Bridging language, cognition, and human-AI interaction
email: your@email.com
cv_url: /files/cv.pdf
---

I am a UX researcher specializing in human-AI interaction, with a Ph.D in Applied Linguistics. My work investigates how people communicate with AI systems—what breaks down, what works, and how to design for clarity, trust, and inclusion.

Before pivoting to UX research, I spent years studying pragmatics and discourse analysis, which gives me a unique lens on conversational AI, chatbot design, and NLP evaluation.
```

- [ ] **Step 3: Create content/skills.md**

```markdown
---
---

## Research Methods
Usability testing, think-aloud protocol, semi-structured interviews, diary studies, survey design, thematic analysis, discourse analysis

## AI & NLP
Prompt evaluation, LLM output assessment, conversational AI auditing, AI literacy research, human-AI teaming studies

## Tools
Figma, Dovetail, Maze, Qualtrics, MAXQDA, Python (basic), R (intermediate)

## Domain Expertise
Applied linguistics, pragmatics, second language acquisition, AI ethics, inclusive design
```

- [ ] **Step 4: Create content/projects/ai-voice-assistant-ux.md**

```markdown
---
title: Voice Assistant Usability for Non-Native English Speakers
date: "2024-06"
tags: ["voice UX", "accessibility", "NLP", "usability testing"]
summary: Evaluated how accent variation affects voice assistant recognition accuracy and user trust across 5 English dialect groups.
featured: true
---

## Background
Major voice assistants perform significantly worse for non-native English speakers, yet this disparity receives little attention in mainstream UX practice.

## Methods
- 40 participants across 5 English dialect backgrounds
- Task-based usability sessions with think-aloud protocol
- Error log analysis from assistant API responses
- Post-session semi-structured interviews

## Key Findings
Recognition error rates were 3x higher for participants with South/Southeast Asian English accents. Users with higher error rates developed trust-repair strategies (repeating, simplifying syntax) that increased cognitive load.

## Impact
Findings contributed to revised evaluation criteria for a client's voice product roadmap, with accent-diverse testing panels now part of standard QA.
```

- [ ] **Step 5: Create content/publications/pragmatic-competence-llms.md**

```markdown
---
title: "Pragmatic Competence in LLM Interactions: How Users Navigate Indirect Speech Acts"
journal: Journal of Applied Linguistics and Professional Practice
year: 2024
doi: 10.1558/jalpp.12345
pdf_url: /files/papers/pragmatic-competence-llms.pdf
---

This study examines how users deploy pragmatic strategies—implicature, politeness, indirect requests—when interacting with large language models, and how LLM responses succeed or fail at pragmatic alignment. Drawing on conversation analysis and 120 logged interaction sessions, we identify three failure modes in LLM pragmatic processing and propose evaluation criteria grounded in applied linguistics theory.
```

- [ ] **Step 6: Create public/files/.gitkeep**

```bash
mkdir -p public/files
touch public/files/.gitkeep
```

- [ ] **Step 7: Commit**

```bash
git add -A
git commit -m "feat: add content types and sample markdown files"
```

---

## Task 3: Content Library (lib/content.ts)

**Files:**
- Create: `lib/content.ts`
- Create: `__tests__/lib/content.test.ts`

- [ ] **Step 1: Write failing tests**

```typescript
// __tests__/lib/content.test.ts
import { getProjects, getProject, getPublications, getAbout, getSkills } from '@/lib/content'

jest.mock('fs/promises')
import * as fs from 'fs/promises'
const mockFs = fs as jest.Mocked<typeof fs>

const PROJECT_MD = `---
title: Test Project
date: "2024-06"
tags: ["NLP", "usability"]
summary: A test project
featured: true
---
Project body here`

const PUB_MD = `---
title: Test Paper
journal: Test Journal
year: 2024
doi: 10.test/123
pdf_url: /files/test.pdf
---
Abstract here`

const ABOUT_MD = `---
name: Test User
title: Researcher
tagline: Testing things
email: test@test.com
cv_url: /files/cv.pdf
---
Bio here`

const SKILLS_MD = `---
---
## Skills
Some skills`

describe('getProjects', () => {
  it('returns parsed projects sorted by date descending', async () => {
    const olderMd = PROJECT_MD.replace('2024-06', '2023-01').replace('Test Project', 'Older Project')
    mockFs.readdir.mockResolvedValue(['test-project.md', 'older-project.md'] as any)
    mockFs.readFile
      .mockResolvedValueOnce(PROJECT_MD)
      .mockResolvedValueOnce(olderMd)

    const projects = await getProjects()
    expect(projects).toHaveLength(2)
    expect(projects[0].slug).toBe('test-project')
    expect(projects[0].title).toBe('Test Project')
    expect(projects[0].featured).toBe(true)
    expect(projects[1].slug).toBe('older-project')
  })
})

describe('getProject', () => {
  it('returns a single project by slug', async () => {
    mockFs.readFile.mockResolvedValue(PROJECT_MD)
    const project = await getProject('test-project')
    expect(project?.slug).toBe('test-project')
    expect(project?.content).toContain('Project body here')
  })

  it('returns null for missing slug', async () => {
    mockFs.readFile.mockRejectedValue(new Error('ENOENT'))
    const project = await getProject('nonexistent')
    expect(project).toBeNull()
  })
})

describe('getPublications', () => {
  it('returns publications sorted by year descending', async () => {
    const older = PUB_MD.replace('2024', '2022')
    mockFs.readdir.mockResolvedValue(['test-paper.md', 'older-paper.md'] as any)
    mockFs.readFile.mockResolvedValueOnce(PUB_MD).mockResolvedValueOnce(older)

    const pubs = await getPublications()
    expect(pubs[0].year).toBe(2024)
    expect(pubs[1].year).toBe(2022)
  })
})

describe('getAbout', () => {
  it('returns parsed about data', async () => {
    mockFs.readFile.mockResolvedValue(ABOUT_MD)
    const about = await getAbout()
    expect(about.name).toBe('Test User')
    expect(about.content).toContain('Bio here')
  })
})

describe('getSkills', () => {
  it('returns skills content', async () => {
    mockFs.readFile.mockResolvedValue(SKILLS_MD)
    const skills = await getSkills()
    expect(skills.content).toContain('## Skills')
  })
})
```

- [ ] **Step 2: Run tests to confirm they fail**

```bash
npm test -- content.test --no-coverage
```

Expected: FAIL — `Cannot find module '@/lib/content'`

- [ ] **Step 3: Implement lib/content.ts**

```typescript
// lib/content.ts
import fs from 'fs/promises'
import path from 'path'
import matter from 'gray-matter'
import type { Project, Publication, About, Skills } from '@/types/content'

const CONTENT_DIR = path.join(process.cwd(), 'content')

export async function getProjects(): Promise<Project[]> {
  const dir = path.join(CONTENT_DIR, 'projects')
  const files = await fs.readdir(dir)
  const projects = await Promise.all(
    files.filter(f => f.endsWith('.md')).map(async f => {
      const raw = await fs.readFile(path.join(dir, f), 'utf-8')
      const { data, content } = matter(raw)
      return { slug: f.replace('.md', ''), ...data, content } as Project
    })
  )
  return projects.sort((a, b) => b.date.localeCompare(a.date))
}

export async function getProject(slug: string): Promise<Project | null> {
  try {
    const raw = await fs.readFile(
      path.join(CONTENT_DIR, 'projects', `${slug}.md`), 'utf-8'
    )
    const { data, content } = matter(raw)
    return { slug, ...data, content } as Project
  } catch {
    return null
  }
}

export async function getPublications(): Promise<Publication[]> {
  const dir = path.join(CONTENT_DIR, 'publications')
  const files = await fs.readdir(dir)
  const pubs = await Promise.all(
    files.filter(f => f.endsWith('.md')).map(async f => {
      const raw = await fs.readFile(path.join(dir, f), 'utf-8')
      const { data, content } = matter(raw)
      return { slug: f.replace('.md', ''), ...data, content } as Publication
    })
  )
  return pubs.sort((a, b) => b.year - a.year)
}

export async function getAbout(): Promise<About> {
  const raw = await fs.readFile(path.join(CONTENT_DIR, 'about.md'), 'utf-8')
  const { data, content } = matter(raw)
  return { ...data, content } as About
}

export async function getSkills(): Promise<Skills> {
  const raw = await fs.readFile(path.join(CONTENT_DIR, 'skills.md'), 'utf-8')
  const { content } = matter(raw)
  return { content }
}
```

- [ ] **Step 4: Run tests to confirm they pass**

```bash
npm test -- content.test --no-coverage
```

Expected: PASS — 6 tests pass.

- [ ] **Step 5: Commit**

```bash
git add lib/content.ts __tests__/lib/content.test.ts
git commit -m "feat: add content library with fs-based markdown parsing"
```

---

## Task 4: Portfolio Layout + Navigation

**Files:**
- Create: `app/(portfolio)/layout.tsx`
- Create: `components/portfolio/Nav.tsx`

- [ ] **Step 1: Create components/portfolio/Nav.tsx**

```typescript
// components/portfolio/Nav.tsx
import Link from 'next/link'

const links = [
  { href: '/', label: 'Home' },
  { href: '/projects', label: 'Research' },
  { href: '/publications', label: 'Publications' },
  { href: '/contact', label: 'Contact' },
]

export function Nav() {
  return (
    <header className="border-b border-gray-100">
      <nav className="max-w-5xl mx-auto px-6 py-4 flex items-center justify-between">
        <Link href="/" className="text-sm font-semibold text-gray-900 tracking-tight">
          Ziyue Liu
        </Link>
        <ul className="flex gap-6">
          {links.map(({ href, label }) => (
            <li key={href}>
              <Link
                href={href}
                className="text-sm text-gray-500 hover:text-gray-900 transition-colors"
              >
                {label}
              </Link>
            </li>
          ))}
        </ul>
      </nav>
    </header>
  )
}
```

- [ ] **Step 2: Create app/(portfolio)/layout.tsx**

```typescript
// app/(portfolio)/layout.tsx
import { Nav } from '@/components/portfolio/Nav'

export default function PortfolioLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen bg-white text-gray-900">
      <Nav />
      <main>{children}</main>
      <footer className="border-t border-gray-100 mt-24">
        <div className="max-w-5xl mx-auto px-6 py-8 text-sm text-gray-400">
          © {new Date().getFullYear()} Ziyue Liu
        </div>
      </footer>
    </div>
  )
}
```

- [ ] **Step 3: Update tailwind.config.ts to use Inter font**

Replace the default `tailwind.config.ts` content with:

```typescript
import type { Config } from 'tailwindcss'

const config: Config = {
  content: [
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: ['Inter', 'ui-sans-serif', 'system-ui'],
      },
      colors: {
        accent: '#4F46E5',
      },
    },
  },
}
export default config
```

- [ ] **Step 4: Add Inter font to app/layout.tsx**

```typescript
// app/layout.tsx
import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'Ziyue Liu — AI UX Researcher',
  description: 'Portfolio of Ziyue Liu, AI UX Researcher with a Ph.D in Applied Linguistics.',
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className={inter.className}>{children}</body>
    </html>
  )
}
```

- [ ] **Step 5: Commit**

```bash
git add -A
git commit -m "feat: add portfolio layout and navigation"
```

---

## Task 5: Homepage (Hero + Featured Projects)

**Files:**
- Create: `app/(portfolio)/page.tsx`
- Create: `components/portfolio/Hero.tsx`
- Create: `components/portfolio/ProjectCard.tsx`

- [ ] **Step 1: Create components/portfolio/Hero.tsx**

```typescript
// components/portfolio/Hero.tsx
import type { About } from '@/types/content'
import Link from 'next/link'

export function Hero({ about }: { about: About }) {
  return (
    <section className="max-w-3xl mx-auto px-6 pt-20 pb-16">
      <p className="text-sm text-indigo-600 font-medium mb-3 tracking-wide uppercase">
        {about.title}
      </p>
      <h1 className="text-4xl font-bold text-gray-900 mb-4">{about.name}</h1>
      <p className="text-xl text-gray-500 mb-8 leading-relaxed">{about.tagline}</p>
      <div className="flex gap-4">
        <Link
          href="/projects"
          className="px-5 py-2.5 bg-gray-900 text-white text-sm font-medium rounded-lg hover:bg-gray-700 transition-colors"
        >
          View Research
        </Link>
        <Link
          href={about.cv_url}
          className="px-5 py-2.5 border border-gray-200 text-gray-700 text-sm font-medium rounded-lg hover:border-gray-400 transition-colors"
        >
          Download CV
        </Link>
      </div>
    </section>
  )
}
```

- [ ] **Step 2: Create components/portfolio/ProjectCard.tsx**

```typescript
// components/portfolio/ProjectCard.tsx
import type { Project } from '@/types/content'
import Link from 'next/link'

export function ProjectCard({ project }: { project: Project }) {
  return (
    <Link href={`/projects/${project.slug}`} className="group block">
      <article className="border border-gray-100 rounded-xl p-6 hover:border-gray-300 transition-colors">
        <div className="flex flex-wrap gap-2 mb-3">
          {project.tags.map(tag => (
            <span
              key={tag}
              className="text-xs text-indigo-600 bg-indigo-50 px-2.5 py-1 rounded-full"
            >
              {tag}
            </span>
          ))}
        </div>
        <h3 className="text-base font-semibold text-gray-900 mb-2 group-hover:text-indigo-600 transition-colors">
          {project.title}
        </h3>
        <p className="text-sm text-gray-500 leading-relaxed">{project.summary}</p>
        <p className="text-xs text-gray-400 mt-4">{project.date}</p>
      </article>
    </Link>
  )
}
```

- [ ] **Step 3: Create app/(portfolio)/page.tsx**

```typescript
// app/(portfolio)/page.tsx
import { getAbout, getProjects } from '@/lib/content'
import { Hero } from '@/components/portfolio/Hero'
import { ProjectCard } from '@/components/portfolio/ProjectCard'
import Link from 'next/link'

export default async function HomePage() {
  const [about, projects] = await Promise.all([getAbout(), getProjects()])
  const featured = projects.filter(p => p.featured)

  return (
    <>
      <Hero about={about} />
      <section className="max-w-5xl mx-auto px-6 pb-24">
        <div className="flex items-baseline justify-between mb-8">
          <h2 className="text-lg font-semibold text-gray-900">Featured Research</h2>
          <Link href="/projects" className="text-sm text-indigo-600 hover:underline">
            View all →
          </Link>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {featured.map(project => (
            <ProjectCard key={project.slug} project={project} />
          ))}
        </div>
      </section>
    </>
  )
}
```

- [ ] **Step 4: Start dev server and verify homepage renders**

```bash
cp .env.local.example .env.local
npm run dev
```

Open http://localhost:3000. Confirm: hero text visible, featured project card shows, no console errors.

- [ ] **Step 5: Commit**

```bash
git add -A
git commit -m "feat: add homepage with hero and featured projects"
```

---

## Task 6: Projects Pages (Grid + Detail)

**Files:**
- Create: `app/(portfolio)/projects/page.tsx`
- Create: `app/(portfolio)/projects/[slug]/page.tsx`

- [ ] **Step 1: Create app/(portfolio)/projects/page.tsx**

```typescript
// app/(portfolio)/projects/page.tsx
import { getProjects } from '@/lib/content'
import { ProjectCard } from '@/components/portfolio/ProjectCard'

export const metadata = { title: 'Research — Ziyue Liu' }

export default async function ProjectsPage() {
  const projects = await getProjects()
  return (
    <div className="max-w-5xl mx-auto px-6 py-16">
      <h1 className="text-3xl font-bold text-gray-900 mb-3">Research</h1>
      <p className="text-gray-500 mb-12">UX research projects at the intersection of AI and human communication.</p>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {projects.map(project => (
          <ProjectCard key={project.slug} project={project} />
        ))}
      </div>
    </div>
  )
}
```

- [ ] **Step 2: Create app/(portfolio)/projects/[slug]/page.tsx**

```typescript
// app/(portfolio)/projects/[slug]/page.tsx
import { getProject, getProjects } from '@/lib/content'
import { MDXRemote } from 'next-mdx-remote/rsc'
import { notFound } from 'next/navigation'

export async function generateStaticParams() {
  const projects = await getProjects()
  return projects.map(p => ({ slug: p.slug }))
}

export async function generateMetadata({ params }: { params: { slug: string } }) {
  const project = await getProject(params.slug)
  return { title: project ? `${project.title} — Ziyue Liu` : 'Not Found' }
}

export default async function ProjectDetailPage({ params }: { params: { slug: string } }) {
  const project = await getProject(params.slug)
  if (!project) notFound()

  return (
    <article className="max-w-3xl mx-auto px-6 py-16">
      <div className="flex flex-wrap gap-2 mb-4">
        {project.tags.map(tag => (
          <span key={tag} className="text-xs text-indigo-600 bg-indigo-50 px-2.5 py-1 rounded-full">
            {tag}
          </span>
        ))}
      </div>
      <h1 className="text-3xl font-bold text-gray-900 mb-2">{project.title}</h1>
      <p className="text-sm text-gray-400 mb-10">{project.date}</p>
      <div className="prose prose-gray max-w-none">
        <MDXRemote source={project.content} />
      </div>
    </article>
  )
}
```

- [ ] **Step 3: Install Tailwind Typography for prose styles**

```bash
npm install -D @tailwindcss/typography
```

Add to `tailwind.config.ts` plugins:

```typescript
plugins: [require('@tailwindcss/typography')],
```

- [ ] **Step 4: Verify in browser**

Navigate to http://localhost:3000/projects — confirm project card appears.
Navigate to http://localhost:3000/projects/ai-voice-assistant-ux — confirm full case study renders with headers.

- [ ] **Step 5: Commit**

```bash
git add -A
git commit -m "feat: add projects grid and case study detail pages"
```

---

## Task 7: Publications Page

**Files:**
- Create: `app/(portfolio)/publications/page.tsx`

- [ ] **Step 1: Create app/(portfolio)/publications/page.tsx**

```typescript
// app/(portfolio)/publications/page.tsx
import { getPublications } from '@/lib/content'

export const metadata = { title: 'Publications — Ziyue Liu' }

export default async function PublicationsPage() {
  const publications = await getPublications()

  return (
    <div className="max-w-3xl mx-auto px-6 py-16">
      <h1 className="text-3xl font-bold text-gray-900 mb-3">Publications</h1>
      <p className="text-gray-500 mb-12">Academic research at the intersection of applied linguistics and AI.</p>
      <ul className="space-y-8">
        {publications.map(pub => (
          <li key={pub.slug} className="border-b border-gray-100 pb-8 last:border-0">
            <h2 className="text-base font-semibold text-gray-900 mb-1">{pub.title}</h2>
            <p className="text-sm text-gray-500 mb-3">
              <span className="italic">{pub.journal}</span> · {pub.year}
            </p>
            <p className="text-sm text-gray-600 mb-4 leading-relaxed">{pub.content}</p>
            <div className="flex gap-4">
              {pub.doi && (
                <a
                  href={`https://doi.org/${pub.doi}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-xs text-indigo-600 hover:underline"
                >
                  DOI →
                </a>
              )}
              {pub.pdf_url && (
                <a
                  href={pub.pdf_url}
                  className="text-xs text-gray-500 hover:text-gray-900"
                >
                  PDF ↓
                </a>
              )}
            </div>
          </li>
        ))}
      </ul>
    </div>
  )
}
```

- [ ] **Step 2: Verify in browser**

Navigate to http://localhost:3000/publications. Confirm publication title, journal, DOI link, and abstract render correctly.

- [ ] **Step 3: Commit**

```bash
git add -A
git commit -m "feat: add publications page"
```

---

## Task 8: Contact Page + Email API

**Files:**
- Create: `app/(portfolio)/contact/page.tsx`
- Create: `components/portfolio/ContactForm.tsx`
- Create: `app/api/contact/route.ts`

- [ ] **Step 1: Create components/portfolio/ContactForm.tsx**

```typescript
// components/portfolio/ContactForm.tsx
'use client'
import { useState } from 'react'

export function ContactForm() {
  const [status, setStatus] = useState<'idle' | 'sending' | 'sent' | 'error'>('idle')

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    setStatus('sending')
    const form = e.currentTarget
    const data = {
      name: (form.elements.namedItem('name') as HTMLInputElement).value,
      email: (form.elements.namedItem('email') as HTMLInputElement).value,
      message: (form.elements.namedItem('message') as HTMLTextAreaElement).value,
    }
    const res = await fetch('/api/contact', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    })
    setStatus(res.ok ? 'sent' : 'error')
  }

  if (status === 'sent') {
    return (
      <p className="text-green-700 bg-green-50 rounded-lg px-4 py-3 text-sm">
        Message sent! I'll get back to you soon.
      </p>
    )
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-5">
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">Name</label>
        <input name="name" required className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500" />
      </div>
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
        <input name="email" type="email" required className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500" />
      </div>
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">Message</label>
        <textarea name="message" required rows={5} className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500" />
      </div>
      {status === 'error' && (
        <p className="text-red-600 text-sm">Something went wrong. Please try again.</p>
      )}
      <button
        type="submit"
        disabled={status === 'sending'}
        className="px-5 py-2.5 bg-gray-900 text-white text-sm font-medium rounded-lg hover:bg-gray-700 disabled:opacity-50 transition-colors"
      >
        {status === 'sending' ? 'Sending...' : 'Send Message'}
      </button>
    </form>
  )
}
```

- [ ] **Step 2: Create app/(portfolio)/contact/page.tsx**

```typescript
// app/(portfolio)/contact/page.tsx
import { getAbout } from '@/lib/content'
import { ContactForm } from '@/components/portfolio/ContactForm'

export const metadata = { title: 'Contact — Ziyue Liu' }

export default async function ContactPage() {
  const about = await getAbout()
  return (
    <div className="max-w-3xl mx-auto px-6 py-16">
      <h1 className="text-3xl font-bold text-gray-900 mb-3">Get in Touch</h1>
      <p className="text-gray-500 mb-10">
        Interested in collaborating or have questions about my research?
      </p>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
        <ContactForm />
        <div className="space-y-4">
          <div>
            <p className="text-xs text-gray-400 uppercase tracking-wide mb-1">Email</p>
            <a href={`mailto:${about.email}`} className="text-sm text-indigo-600 hover:underline">
              {about.email}
            </a>
          </div>
          <div>
            <p className="text-xs text-gray-400 uppercase tracking-wide mb-1">CV</p>
            <a href={about.cv_url} className="text-sm text-gray-700 hover:text-gray-900">
              Download CV (PDF) ↓
            </a>
          </div>
        </div>
      </div>
    </div>
  )
}
```

- [ ] **Step 3: Create app/api/contact/route.ts**

```typescript
// app/api/contact/route.ts
import { NextRequest, NextResponse } from 'next/server'
import { Resend } from 'resend'

const resend = new Resend(process.env.RESEND_API_KEY)

export async function POST(req: NextRequest) {
  const { name, email, message } = await req.json()

  if (!name || !email || !message) {
    return NextResponse.json({ error: 'Missing fields' }, { status: 400 })
  }

  await resend.emails.send({
    from: 'portfolio@resend.dev',
    to: process.env.CONTACT_EMAIL ?? '',
    subject: `Portfolio contact from ${name}`,
    text: `From: ${name} <${email}>\n\n${message}`,
  })

  return NextResponse.json({ ok: true })
}
```

- [ ] **Step 4: Add CONTACT_EMAIL to .env.local.example**

Append to `.env.local.example`:

```
CONTACT_EMAIL=your@email.com
```

- [ ] **Step 5: Commit**

```bash
git add -A
git commit -m "feat: add contact page with form and Resend email API"
```

---

## Task 9: Auth Library (lib/auth.ts)

**Files:**
- Create: `lib/auth.ts`
- Create: `__tests__/lib/auth.test.ts`

- [ ] **Step 1: Write failing tests**

```typescript
// __tests__/lib/auth.test.ts
process.env.JWT_SECRET = 'test-secret-key-exactly-32-chars!!'

import { signToken, verifyToken } from '@/lib/auth'

describe('signToken / verifyToken', () => {
  it('signs a token and verifies it successfully', async () => {
    const token = await signToken({ admin: true })
    const payload = await verifyToken(token)
    expect(payload.admin).toBe(true)
  })

  it('throws on a tampered token', async () => {
    const token = await signToken({ admin: true })
    await expect(verifyToken(token + 'x')).rejects.toThrow()
  })

  it('throws on an expired token', async () => {
    // Sign with -1s expiry so it's immediately expired
    const token = await signToken({ admin: true }, '-1s')
    await expect(verifyToken(token)).rejects.toThrow()
  })
})
```

- [ ] **Step 2: Run tests to confirm they fail**

```bash
npm test -- auth.test --no-coverage
```

Expected: FAIL — `Cannot find module '@/lib/auth'`

- [ ] **Step 3: Implement lib/auth.ts**

```typescript
// lib/auth.ts
import { SignJWT, jwtVerify, type JWTPayload } from 'jose'

const secret = () => new TextEncoder().encode(process.env.JWT_SECRET!)

export const COOKIE_NAME = 'admin-session'

export async function signToken(
  payload: Record<string, unknown>,
  expiresIn = '7d'
): Promise<string> {
  return new SignJWT(payload)
    .setProtectedHeader({ alg: 'HS256' })
    .setIssuedAt()
    .setExpirationTime(expiresIn)
    .sign(secret())
}

export async function verifyToken(token: string): Promise<JWTPayload> {
  const { payload } = await jwtVerify(token, secret())
  return payload
}
```

- [ ] **Step 4: Run tests to confirm they pass**

```bash
npm test -- auth.test --no-coverage
```

Expected: PASS — 3 tests pass.

- [ ] **Step 5: Commit**

```bash
git add lib/auth.ts __tests__/lib/auth.test.ts
git commit -m "feat: add JWT auth library using jose"
```

---

## Task 10: Login/Logout API + Middleware

**Files:**
- Create: `app/api/auth/login/route.ts`
- Create: `app/api/auth/logout/route.ts`
- Create: `middleware.ts`

- [ ] **Step 1: Create app/api/auth/login/route.ts**

```typescript
// app/api/auth/login/route.ts
import { NextRequest, NextResponse } from 'next/server'
import bcrypt from 'bcryptjs'
import { signToken, COOKIE_NAME } from '@/lib/auth'

export async function POST(req: NextRequest) {
  const { password } = await req.json()

  if (!password) {
    return NextResponse.json({ error: 'Password required' }, { status: 400 })
  }

  const hash = process.env.ADMIN_PASSWORD_HASH ?? ''
  const valid = await bcrypt.compare(password, hash)

  if (!valid) {
    return NextResponse.json({ error: 'Invalid password' }, { status: 401 })
  }

  const token = await signToken({ admin: true })

  const res = NextResponse.json({ ok: true })
  res.cookies.set(COOKIE_NAME, token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'strict',
    maxAge: 60 * 60 * 24 * 7, // 7 days
    path: '/',
  })
  return res
}
```

- [ ] **Step 2: Create app/api/auth/logout/route.ts**

```typescript
// app/api/auth/logout/route.ts
import { NextResponse } from 'next/server'
import { COOKIE_NAME } from '@/lib/auth'

export async function POST() {
  const res = NextResponse.json({ ok: true })
  res.cookies.set(COOKIE_NAME, '', { maxAge: 0, path: '/' })
  return res
}
```

- [ ] **Step 3: Create middleware.ts**

```typescript
// middleware.ts
import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'
import { jwtVerify } from 'jose'

const secret = () => new TextEncoder().encode(process.env.JWT_SECRET!)

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl

  // Allow login page through
  if (pathname === '/admin/login') return NextResponse.next()

  const token = request.cookies.get('admin-session')?.value
  if (!token) {
    return NextResponse.redirect(new URL('/admin/login', request.url))
  }

  try {
    await jwtVerify(token, secret())
    return NextResponse.next()
  } catch {
    const res = NextResponse.redirect(new URL('/admin/login', request.url))
    res.cookies.set('admin-session', '', { maxAge: 0 })
    return res
  }
}

export const config = {
  matcher: ['/admin/:path*'],
}
```

- [ ] **Step 4: Verify middleware protection in browser**

In `.env.local`, set a temporary `ADMIN_PASSWORD_HASH` (generate one):

```bash
node -e "const b = require('bcryptjs'); b.hash('test123', 12).then(console.log)"
```

Copy the hash into `.env.local` as `ADMIN_PASSWORD_HASH=<hash>`.
Also set `JWT_SECRET=any-32-char-string-for-local-dev!!`.

Visit http://localhost:3000/admin — confirm redirect to `/admin/login`.

- [ ] **Step 5: Commit**

```bash
git add app/api/auth/ middleware.ts
git commit -m "feat: add login/logout API routes and edge middleware for admin auth"
```

---

## Task 11: Admin Login Page

**Files:**
- Create: `app/admin/login/page.tsx`
- Create: `app/admin/page.tsx`

- [ ] **Step 1: Create app/admin/login/page.tsx**

```typescript
// app/admin/login/page.tsx
'use client'
import { useState } from 'react'
import { useRouter } from 'next/navigation'

export default function AdminLoginPage() {
  const router = useRouter()
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setLoading(true)
    setError('')
    const res = await fetch('/api/auth/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ password }),
    })
    if (res.ok) {
      router.push('/admin/dashboard/about')
    } else {
      setError('Incorrect password')
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center">
      <div className="bg-white rounded-xl border border-gray-200 p-8 w-full max-w-sm">
        <h1 className="text-lg font-semibold text-gray-900 mb-6">Admin Login</h1>
        <form onSubmit={handleSubmit} className="space-y-4">
          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={e => setPassword(e.target.value)}
            required
            className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
          />
          {error && <p className="text-red-600 text-sm">{error}</p>}
          <button
            type="submit"
            disabled={loading}
            className="w-full py-2.5 bg-gray-900 text-white text-sm font-medium rounded-lg hover:bg-gray-700 disabled:opacity-50 transition-colors"
          >
            {loading ? 'Signing in...' : 'Sign In'}
          </button>
        </form>
      </div>
    </div>
  )
}
```

- [ ] **Step 2: Create app/admin/page.tsx (redirect)**

```typescript
// app/admin/page.tsx
import { redirect } from 'next/navigation'

export default function AdminPage() {
  redirect('/admin/dashboard/about')
}
```

- [ ] **Step 3: Verify login works in browser**

Visit http://localhost:3000/admin/login. Enter `test123` (the password you hashed). Confirm redirect to `/admin/dashboard/about` (404 is fine at this stage — the page doesn't exist yet).

- [ ] **Step 4: Commit**

```bash
git add app/admin/
git commit -m "feat: add admin login page and root redirect"
```

---

## Task 12: GitHub API Library (lib/github.ts)

**Files:**
- Create: `lib/github.ts`
- Create: `__tests__/lib/github.test.ts`

- [ ] **Step 1: Write failing tests**

```typescript
// __tests__/lib/github.test.ts
process.env.GITHUB_TOKEN = 'test-token'
process.env.GITHUB_REPO = 'testuser/testrepo'

import { readFile, commitFile, listFiles } from '@/lib/github'

global.fetch = jest.fn()
const mockFetch = fetch as jest.Mock

beforeEach(() => mockFetch.mockReset())

describe('readFile', () => {
  it('returns decoded content and sha', async () => {
    mockFetch.mockResolvedValueOnce({
      ok: true,
      json: async () => ({
        content: Buffer.from('hello world').toString('base64') + '\n',
        sha: 'abc123',
      }),
    })
    const result = await readFile('content/about.md')
    expect(result.content).toBe('hello world')
    expect(result.sha).toBe('abc123')
    expect(mockFetch).toHaveBeenCalledWith(
      'https://api.github.com/repos/testuser/testrepo/contents/content/about.md',
      expect.objectContaining({ headers: expect.objectContaining({ Authorization: 'Bearer test-token' }) })
    )
  })

  it('throws when file not found', async () => {
    mockFetch.mockResolvedValueOnce({ ok: false, status: 404, json: async () => ({ message: 'Not Found' }) })
    await expect(readFile('nonexistent.md')).rejects.toThrow('GitHub API error: 404')
  })
})

describe('commitFile', () => {
  it('PUTs to GitHub API with correct payload', async () => {
    mockFetch.mockResolvedValueOnce({ ok: true, json: async () => ({}) })
    await commitFile('content/about.md', 'new content', 'abc123', 'update about')
    const call = mockFetch.mock.calls[0]
    expect(call[0]).toBe('https://api.github.com/repos/testuser/testrepo/contents/content/about.md')
    const body = JSON.parse(call[1].body)
    expect(body.sha).toBe('abc123')
    expect(body.message).toBe('update about')
    expect(Buffer.from(body.content, 'base64').toString()).toBe('new content')
  })
})

describe('listFiles', () => {
  it('returns array of file names', async () => {
    mockFetch.mockResolvedValueOnce({
      ok: true,
      json: async () => [
        { name: 'project-a.md', type: 'file' },
        { name: 'project-b.md', type: 'file' },
      ],
    })
    const files = await listFiles('content/projects')
    expect(files).toEqual(['project-a.md', 'project-b.md'])
  })
})
```

- [ ] **Step 2: Run tests to confirm they fail**

```bash
npm test -- github.test --no-coverage
```

Expected: FAIL — `Cannot find module '@/lib/github'`

- [ ] **Step 3: Implement lib/github.ts**

```typescript
// lib/github.ts
const BASE = 'https://api.github.com'

function headers() {
  return {
    Authorization: `Bearer ${process.env.GITHUB_TOKEN}`,
    Accept: 'application/vnd.github.v3+json',
    'Content-Type': 'application/json',
  }
}

function repo() {
  return process.env.GITHUB_REPO!
}

export async function readFile(filePath: string): Promise<{ content: string; sha: string }> {
  const res = await fetch(`${BASE}/repos/${repo()}/contents/${filePath}`, { headers: headers() })
  if (!res.ok) throw new Error(`GitHub API error: ${res.status}`)
  const data = await res.json()
  return {
    content: Buffer.from(data.content.replace(/\n/g, ''), 'base64').toString('utf-8'),
    sha: data.sha,
  }
}

export async function commitFile(
  filePath: string,
  content: string,
  sha: string,   // empty string '' for new files, existing SHA for updates
  message: string
): Promise<void> {
  const body: Record<string, unknown> = {
    message,
    content: Buffer.from(content).toString('base64'),
  }
  if (sha) body.sha = sha  // omit sha for new file creation

  const res = await fetch(`${BASE}/repos/${repo()}/contents/${filePath}`, {
    method: 'PUT',
    headers: headers(),
    body: JSON.stringify(body),
  })
  if (!res.ok) throw new Error(`GitHub commit error: ${res.status}`)
}

export async function listFiles(dirPath: string): Promise<string[]> {
  const res = await fetch(`${BASE}/repos/${repo()}/contents/${dirPath}`, { headers: headers() })
  if (!res.ok) throw new Error(`GitHub API error: ${res.status}`)
  const data = await res.json()
  return (data as Array<{ name: string; type: string }>)
    .filter(f => f.type === 'file' && f.name.endsWith('.md'))
    .map(f => f.name)
}
```

- [ ] **Step 4: Run tests to confirm they pass**

```bash
npm test -- github.test --no-coverage
```

Expected: PASS — 4 tests pass.

- [ ] **Step 5: Commit**

```bash
git add lib/github.ts __tests__/lib/github.test.ts
git commit -m "feat: add GitHub API library for reading and committing markdown files"
```

---

## Task 13: Content Commit API Route

**Files:**
- Create: `app/api/content/route.ts`

- [ ] **Step 1: Create app/api/content/route.ts**

This route is called by admin editor Save buttons. It receives the file path, new content, and current SHA, then commits to GitHub.

```typescript
// app/api/content/route.ts
import { NextRequest, NextResponse } from 'next/server'
import { cookies } from 'next/headers'
import { verifyToken } from '@/lib/auth'
import { commitFile } from '@/lib/github'

export async function POST(req: NextRequest) {
  // Verify admin session
  const token = cookies().get('admin-session')?.value
  if (!token) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  try {
    await verifyToken(token)
  } catch {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const { filePath, content, sha, message } = await req.json()

  if (!filePath || !content) {
    return NextResponse.json({ error: 'Missing required fields' }, { status: 400 })
  }
  // sha is empty string for new files — commitFile handles that correctly

  await commitFile(filePath, content, sha, message ?? `content: update ${filePath}`)

  return NextResponse.json({ ok: true })
}
```

- [ ] **Step 2: Commit**

```bash
git add app/api/content/route.ts
git commit -m "feat: add content commit API route (auth-guarded GitHub write)"
```

---

## Task 14: Admin Layout + Sidebar

**Files:**
- Create: `app/admin/layout.tsx`
- Create: `components/admin/AdminSidebar.tsx`

- [ ] **Step 1: Create components/admin/AdminSidebar.tsx**

```typescript
// components/admin/AdminSidebar.tsx
'use client'
import Link from 'next/link'
import { usePathname, useRouter } from 'next/navigation'

const navItems = [
  { href: '/admin/dashboard/about', label: 'About & Skills' },
  { href: '/admin/dashboard/projects', label: 'Projects' },
  { href: '/admin/dashboard/publications', label: 'Publications' },
]

export function AdminSidebar() {
  const pathname = usePathname()
  const router = useRouter()

  async function handleLogout() {
    await fetch('/api/auth/logout', { method: 'POST' })
    router.push('/admin/login')
  }

  return (
    <aside className="w-52 shrink-0 border-r border-gray-100 min-h-screen pt-8 px-4 flex flex-col">
      <p className="text-xs font-semibold text-gray-400 uppercase tracking-wide mb-6 px-2">Admin</p>
      <nav className="flex-1 space-y-1">
        {navItems.map(({ href, label }) => (
          <Link
            key={href}
            href={href}
            className={`block px-3 py-2 rounded-lg text-sm transition-colors ${
              pathname.startsWith(href)
                ? 'bg-indigo-50 text-indigo-700 font-medium'
                : 'text-gray-600 hover:bg-gray-50'
            }`}
          >
            {label}
          </Link>
        ))}
      </nav>
      <button
        onClick={handleLogout}
        className="mb-6 px-3 py-2 text-sm text-gray-400 hover:text-gray-700 text-left"
      >
        Sign out
      </button>
    </aside>
  )
}
```

- [ ] **Step 2: Create app/admin/layout.tsx**

```typescript
// app/admin/layout.tsx
import { AdminSidebar } from '@/components/admin/AdminSidebar'

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen bg-white flex">
      <AdminSidebar />
      <main className="flex-1 p-8 max-w-3xl">{children}</main>
    </div>
  )
}
```

- [ ] **Step 3: Commit**

```bash
git add app/admin/layout.tsx components/admin/AdminSidebar.tsx
git commit -m "feat: add admin layout with sidebar navigation"
```

---

## Task 15: Admin About + Skills Editor

**Files:**
- Create: `components/admin/ContentEditor.tsx`
- Create: `app/admin/dashboard/about/page.tsx`

- [ ] **Step 1: Create components/admin/ContentEditor.tsx**

`@uiw/react-md-editor` uses browser APIs so it must be loaded with `dynamic` import (no SSR).

```typescript
// components/admin/ContentEditor.tsx
'use client'
import dynamic from 'next/dynamic'
import { useState } from 'react'

const MDEditor = dynamic(() => import('@uiw/react-md-editor'), { ssr: false })

interface Props {
  filePath: string
  initialContent: string
  sha: string
  label: string
}

export function ContentEditor({ filePath, initialContent, sha, label }: Props) {
  const [content, setContent] = useState(initialContent)
  const [currentSha, setCurrentSha] = useState(sha)
  const [status, setStatus] = useState<'idle' | 'saving' | 'saved' | 'error'>('idle')

  async function handleSave() {
    setStatus('saving')
    const res = await fetch('/api/content', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ filePath, content, sha: currentSha }),
    })
    if (res.ok) {
      setStatus('saved')
      // GitHub API returns new SHA in commit response — re-fetch to get it
      // For simplicity, we reload the page after save to get fresh SHA
      setTimeout(() => window.location.reload(), 1500)
    } else {
      setStatus('error')
    }
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="text-lg font-semibold text-gray-900">{label}</h2>
        <div className="flex items-center gap-3">
          {status === 'saved' && <span className="text-sm text-green-600">Saved! Redeploying...</span>}
          {status === 'error' && <span className="text-sm text-red-600">Save failed</span>}
          <button
            onClick={handleSave}
            disabled={status === 'saving'}
            className="px-4 py-2 bg-gray-900 text-white text-sm font-medium rounded-lg hover:bg-gray-700 disabled:opacity-50 transition-colors"
          >
            {status === 'saving' ? 'Saving...' : 'Save & Publish'}
          </button>
        </div>
      </div>
      <div data-color-mode="light">
        <MDEditor value={content} onChange={v => setContent(v ?? '')} height={500} />
      </div>
    </div>
  )
}
```

- [ ] **Step 2: Create app/admin/dashboard/about/page.tsx**

```typescript
// app/admin/dashboard/about/page.tsx
import { readFile } from '@/lib/github'
import { ContentEditor } from '@/components/admin/ContentEditor'

export default async function AdminAboutPage() {
  const [about, skills] = await Promise.all([
    readFile('content/about.md'),
    readFile('content/skills.md'),
  ])

  return (
    <div className="space-y-12">
      <ContentEditor
        filePath="content/about.md"
        initialContent={about.content}
        sha={about.sha}
        label="About Me"
      />
      <ContentEditor
        filePath="content/skills.md"
        initialContent={skills.content}
        sha={skills.sha}
        label="Skills"
      />
    </div>
  )
}
```

- [ ] **Step 3: Verify in browser**

Add `GITHUB_TOKEN` and `GITHUB_REPO` to `.env.local`. Log in at `/admin/login`, navigate to About & Skills. Confirm editors load with current content. (Save button will commit to GitHub — only test with a real token.)

- [ ] **Step 4: Commit**

```bash
git add components/admin/ContentEditor.tsx app/admin/dashboard/about/
git commit -m "feat: add admin about and skills markdown editors"
```

---

## Task 16: Admin Projects Editor

**Files:**
- Create: `components/admin/ProjectForm.tsx`
- Create: `app/admin/dashboard/projects/page.tsx`
- Create: `app/admin/dashboard/projects/new/page.tsx`
- Create: `app/admin/dashboard/projects/[slug]/page.tsx`

- [ ] **Step 1: Create components/admin/ProjectForm.tsx**

```typescript
// components/admin/ProjectForm.tsx
'use client'
import dynamic from 'next/dynamic'
import { useState } from 'react'
import { useRouter } from 'next/navigation'

const MDEditor = dynamic(() => import('@uiw/react-md-editor'), { ssr: false })

interface Props {
  slug?: string
  sha?: string
  initialData?: {
    title: string; date: string; tags: string; summary: string; featured: boolean; content: string
  }
}

const DEFAULTS = { title: '', date: '', tags: '', summary: '', featured: false, content: '' }

export function ProjectForm({ slug, sha, initialData }: Props) {
  const router = useRouter()
  const [fields, setFields] = useState(initialData ?? DEFAULTS)
  const [status, setStatus] = useState<'idle' | 'saving' | 'saved' | 'error'>('idle')

  function set(key: string, value: string | boolean) {
    setFields(prev => ({ ...prev, [key]: value }))
  }

  function buildMarkdown() {
    const tagsArray = fields.tags.split(',').map(t => `"${t.trim()}"`).join(', ')
    return `---\ntitle: "${fields.title}"\ndate: "${fields.date}"\ntags: [${tagsArray}]\nsummary: ${fields.summary}\nfeatured: ${fields.featured}\n---\n${fields.content}`
  }

  function slugify(title: string) {
    return title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '')
  }

  async function handleSave() {
    setStatus('saving')
    const finalSlug = slug ?? slugify(fields.title)
    const res = await fetch('/api/content', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        filePath: `content/projects/${finalSlug}.md`,
        content: buildMarkdown(),
        sha: sha ?? '',
        message: `content: ${slug ? 'update' : 'add'} project ${finalSlug}`,
      }),
    })
    if (res.ok) {
      setStatus('saved')
      setTimeout(() => router.push('/admin/dashboard/projects'), 1500)
    } else {
      setStatus('error')
    }
  }

  return (
    <div className="space-y-5">
      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-xs font-medium text-gray-500 mb-1">Title</label>
          <input value={fields.title} onChange={e => set('title', e.target.value)}
            className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500" />
        </div>
        <div>
          <label className="block text-xs font-medium text-gray-500 mb-1">Date (YYYY-MM)</label>
          <input value={fields.date} onChange={e => set('date', e.target.value)} placeholder="2024-06"
            className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500" />
        </div>
      </div>
      <div>
        <label className="block text-xs font-medium text-gray-500 mb-1">Tags (comma-separated)</label>
        <input value={fields.tags} onChange={e => set('tags', e.target.value)} placeholder="NLP, usability"
          className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500" />
      </div>
      <div>
        <label className="block text-xs font-medium text-gray-500 mb-1">One-line Summary</label>
        <input value={fields.summary} onChange={e => set('summary', e.target.value)}
          className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500" />
      </div>
      <label className="flex items-center gap-2 text-sm text-gray-700">
        <input type="checkbox" checked={fields.featured} onChange={e => set('featured', e.target.checked)} />
        Featured on homepage
      </label>
      <div>
        <label className="block text-xs font-medium text-gray-500 mb-1">Case Study Content (Markdown)</label>
        <div data-color-mode="light">
          <MDEditor value={fields.content} onChange={v => set('content', v ?? '')} height={400} />
        </div>
      </div>
      <div className="flex items-center gap-4">
        <button onClick={handleSave} disabled={status === 'saving'}
          className="px-4 py-2 bg-gray-900 text-white text-sm font-medium rounded-lg hover:bg-gray-700 disabled:opacity-50 transition-colors">
          {status === 'saving' ? 'Saving...' : 'Save & Publish'}
        </button>
        {status === 'saved' && <span className="text-sm text-green-600">Saved! Redirecting...</span>}
        {status === 'error' && <span className="text-sm text-red-600">Save failed</span>}
      </div>
    </div>
  )
}
```

- [ ] **Step 2: Create app/admin/dashboard/projects/page.tsx**

```typescript
// app/admin/dashboard/projects/page.tsx
import { listFiles, readFile } from '@/lib/github'
import Link from 'next/link'
import matter from 'gray-matter'

export default async function AdminProjectsPage() {
  const files = await listFiles('content/projects')
  const projects = await Promise.all(
    files.map(async f => {
      const slug = f.replace('.md', '')
      const { content } = await readFile(`content/projects/${f}`)
      const { data } = matter(content)
      return { slug, title: data.title as string, date: data.date as string }
    })
  )
  projects.sort((a, b) => b.date.localeCompare(a.date))

  return (
    <div>
      <div className="flex items-center justify-between mb-8">
        <h1 className="text-2xl font-bold text-gray-900">Projects</h1>
        <Link href="/admin/dashboard/projects/new"
          className="px-4 py-2 bg-gray-900 text-white text-sm font-medium rounded-lg hover:bg-gray-700 transition-colors">
          + New Project
        </Link>
      </div>
      <ul className="space-y-2">
        {projects.map(({ slug, title, date }) => (
          <li key={slug} className="flex items-center justify-between border border-gray-100 rounded-lg px-4 py-3">
            <div>
              <p className="text-sm font-medium text-gray-900">{title}</p>
              <p className="text-xs text-gray-400">{date}</p>
            </div>
            <Link href={`/admin/dashboard/projects/${slug}`}
              className="text-sm text-indigo-600 hover:underline">Edit</Link>
          </li>
        ))}
      </ul>
    </div>
  )
}
```

- [ ] **Step 3: Create app/admin/dashboard/projects/new/page.tsx**

```typescript
// app/admin/dashboard/projects/new/page.tsx
import { ProjectForm } from '@/components/admin/ProjectForm'

export default function NewProjectPage() {
  return (
    <div>
      <h1 className="text-2xl font-bold text-gray-900 mb-8">New Project</h1>
      <ProjectForm />
    </div>
  )
}
```

- [ ] **Step 4: Create app/admin/dashboard/projects/[slug]/page.tsx**

```typescript
// app/admin/dashboard/projects/[slug]/page.tsx
import { readFile } from '@/lib/github'
import { ProjectForm } from '@/components/admin/ProjectForm'
import matter from 'gray-matter'

export default async function EditProjectPage({ params }: { params: { slug: string } }) {
  const { content: raw, sha } = await readFile(`content/projects/${params.slug}.md`)
  const { data, content } = matter(raw)

  return (
    <div>
      <h1 className="text-2xl font-bold text-gray-900 mb-8">Edit Project</h1>
      <ProjectForm
        slug={params.slug}
        sha={sha}
        initialData={{
          title: data.title ?? '',
          date: data.date ?? '',
          tags: (data.tags as string[])?.join(', ') ?? '',
          summary: data.summary ?? '',
          featured: data.featured ?? false,
          content,
        }}
      />
    </div>
  )
}
```

- [ ] **Step 5: Commit**

```bash
git add components/admin/ProjectForm.tsx app/admin/dashboard/projects/
git commit -m "feat: add admin projects editor (list, create, edit)"
```

---

## Task 17: Admin Publications Editor

**Files:**
- Create: `components/admin/PublicationForm.tsx`
- Create: `app/admin/dashboard/publications/page.tsx`
- Create: `app/admin/dashboard/publications/new/page.tsx`
- Create: `app/admin/dashboard/publications/[slug]/page.tsx`

- [ ] **Step 1: Create components/admin/PublicationForm.tsx**

```typescript
// components/admin/PublicationForm.tsx
'use client'
import { useState } from 'react'
import { useRouter } from 'next/navigation'

interface Props {
  slug?: string
  sha?: string
  initialData?: {
    title: string; journal: string; year: string; doi: string; pdf_url: string; content: string
  }
}

const DEFAULTS = { title: '', journal: '', year: '', doi: '', pdf_url: '', content: '' }

export function PublicationForm({ slug, sha, initialData }: Props) {
  const router = useRouter()
  const [fields, setFields] = useState(initialData ?? DEFAULTS)
  const [status, setStatus] = useState<'idle' | 'saving' | 'saved' | 'error'>('idle')

  function set(key: string, value: string) {
    setFields(prev => ({ ...prev, [key]: value }))
  }

  function slugify(title: string) {
    return title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '')
  }

  function buildMarkdown() {
    return `---\ntitle: "${fields.title}"\njournal: ${fields.journal}\nyear: ${fields.year}\ndoi: ${fields.doi}\npdf_url: ${fields.pdf_url}\n---\n${fields.content}`
  }

  async function handleSave() {
    setStatus('saving')
    const finalSlug = slug ?? slugify(fields.title)
    const res = await fetch('/api/content', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        filePath: `content/publications/${finalSlug}.md`,
        content: buildMarkdown(),
        sha: sha ?? '',
        message: `content: ${slug ? 'update' : 'add'} publication ${finalSlug}`,
      }),
    })
    if (res.ok) {
      setStatus('saved')
      setTimeout(() => router.push('/admin/dashboard/publications'), 1500)
    } else {
      setStatus('error')
    }
  }

  return (
    <div className="space-y-5">
      <div>
        <label className="block text-xs font-medium text-gray-500 mb-1">Title</label>
        <input value={fields.title} onChange={e => set('title', e.target.value)}
          className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500" />
      </div>
      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-xs font-medium text-gray-500 mb-1">Journal / Venue</label>
          <input value={fields.journal} onChange={e => set('journal', e.target.value)}
            className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500" />
        </div>
        <div>
          <label className="block text-xs font-medium text-gray-500 mb-1">Year</label>
          <input value={fields.year} onChange={e => set('year', e.target.value)} placeholder="2024"
            className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500" />
        </div>
      </div>
      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-xs font-medium text-gray-500 mb-1">DOI</label>
          <input value={fields.doi} onChange={e => set('doi', e.target.value)} placeholder="10.xxxx/..."
            className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500" />
        </div>
        <div>
          <label className="block text-xs font-medium text-gray-500 mb-1">PDF URL</label>
          <input value={fields.pdf_url} onChange={e => set('pdf_url', e.target.value)} placeholder="/files/papers/..."
            className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500" />
        </div>
      </div>
      <div>
        <label className="block text-xs font-medium text-gray-500 mb-1">Abstract</label>
        <textarea value={fields.content} onChange={e => set('content', e.target.value)} rows={6}
          className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500" />
      </div>
      <div className="flex items-center gap-4">
        <button onClick={handleSave} disabled={status === 'saving'}
          className="px-4 py-2 bg-gray-900 text-white text-sm font-medium rounded-lg hover:bg-gray-700 disabled:opacity-50 transition-colors">
          {status === 'saving' ? 'Saving...' : 'Save & Publish'}
        </button>
        {status === 'saved' && <span className="text-sm text-green-600">Saved! Redirecting...</span>}
        {status === 'error' && <span className="text-sm text-red-600">Save failed</span>}
      </div>
    </div>
  )
}
```

- [ ] **Step 2: Create app/admin/dashboard/publications/page.tsx**

```typescript
// app/admin/dashboard/publications/page.tsx
import { listFiles, readFile } from '@/lib/github'
import Link from 'next/link'
import matter from 'gray-matter'

export default async function AdminPublicationsPage() {
  const files = await listFiles('content/publications')
  const pubs = await Promise.all(
    files.map(async f => {
      const slug = f.replace('.md', '')
      const { content } = await readFile(`content/publications/${f}`)
      const { data } = matter(content)
      return { slug, title: data.title as string, year: data.year as number }
    })
  )
  pubs.sort((a, b) => b.year - a.year)

  return (
    <div>
      <div className="flex items-center justify-between mb-8">
        <h1 className="text-2xl font-bold text-gray-900">Publications</h1>
        <Link href="/admin/dashboard/publications/new"
          className="px-4 py-2 bg-gray-900 text-white text-sm font-medium rounded-lg hover:bg-gray-700 transition-colors">
          + New Publication
        </Link>
      </div>
      <ul className="space-y-2">
        {pubs.map(({ slug, title, year }) => (
          <li key={slug} className="flex items-center justify-between border border-gray-100 rounded-lg px-4 py-3">
            <div>
              <p className="text-sm font-medium text-gray-900">{title}</p>
              <p className="text-xs text-gray-400">{year}</p>
            </div>
            <Link href={`/admin/dashboard/publications/${slug}`}
              className="text-sm text-indigo-600 hover:underline">Edit</Link>
          </li>
        ))}
      </ul>
    </div>
  )
}
```

- [ ] **Step 3: Create app/admin/dashboard/publications/new/page.tsx**

```typescript
// app/admin/dashboard/publications/new/page.tsx
import { PublicationForm } from '@/components/admin/PublicationForm'

export default function NewPublicationPage() {
  return (
    <div>
      <h1 className="text-2xl font-bold text-gray-900 mb-8">New Publication</h1>
      <PublicationForm />
    </div>
  )
}
```

- [ ] **Step 4: Create app/admin/dashboard/publications/[slug]/page.tsx**

```typescript
// app/admin/dashboard/publications/[slug]/page.tsx
import { readFile } from '@/lib/github'
import { PublicationForm } from '@/components/admin/PublicationForm'
import matter from 'gray-matter'

export default async function EditPublicationPage({ params }: { params: { slug: string } }) {
  const { content: raw, sha } = await readFile(`content/publications/${params.slug}.md`)
  const { data, content } = matter(raw)

  return (
    <div>
      <h1 className="text-2xl font-bold text-gray-900 mb-8">Edit Publication</h1>
      <PublicationForm
        slug={params.slug}
        sha={sha}
        initialData={{
          title: data.title ?? '',
          journal: data.journal ?? '',
          year: String(data.year ?? ''),
          doi: data.doi ?? '',
          pdf_url: data.pdf_url ?? '',
          content,
        }}
      />
    </div>
  )
}
```

- [ ] **Step 5: Commit**

```bash
git add components/admin/PublicationForm.tsx app/admin/dashboard/publications/
git commit -m "feat: add admin publications editor (list, create, edit)"
```

---

## Task 18: Deployment Setup

**Files:**
- Create: `scripts/hash-password.js`
- Create: `.gitignore` additions

- [ ] **Step 1: Create scripts/hash-password.js**

```javascript
// scripts/hash-password.js
// Usage: node scripts/hash-password.js yourpassword
const bcrypt = require('bcryptjs')
const password = process.argv[2]
if (!password) { console.error('Usage: node scripts/hash-password.js <password>'); process.exit(1) }
bcrypt.hash(password, 12).then(hash => {
  console.log('\nADMIN_PASSWORD_HASH=' + hash)
  console.log('\nPaste this into your Vercel environment variables.')
})
```

- [ ] **Step 2: Generate your admin password hash**

```bash
node scripts/hash-password.js 'your-chosen-password'
```

Copy the output hash. You'll paste it into Vercel.

- [ ] **Step 3: Generate JWT_SECRET**

```bash
node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
```

Copy the output. You'll paste it into Vercel.

- [ ] **Step 4: Create GitHub repository and push**

Go to github.com → New repository → name it `ziyue-profolio` → public or private.

```bash
git remote add origin https://github.com/YOUR_USERNAME/ziyue-profolio.git
git push -u origin main
```

- [ ] **Step 5: Create GitHub fine-grained PAT**

Go to github.com → Settings → Developer settings → Fine-grained tokens → Generate new token:
- Name: `ziyue-profolio-admin`
- Repository access: Only select repositories → `ziyue-profolio`
- Permissions → Repository permissions → Contents: **Read and write**
- Click Generate

Copy the token.

- [ ] **Step 6: Set up Resend**

Sign up at resend.com (free tier). Go to API Keys → Create API Key. Copy the key.

- [ ] **Step 7: Deploy to Vercel**

Go to vercel.com → Add New Project → Import `ziyue-profolio` from GitHub → Framework: Next.js (auto-detected).

Add Environment Variables:
```
ADMIN_PASSWORD_HASH   = <hash from Step 2>
JWT_SECRET            = <secret from Step 3>
GITHUB_TOKEN          = <PAT from Step 5>
GITHUB_REPO           = YOUR_USERNAME/ziyue-profolio
RESEND_API_KEY        = <key from Step 6>
CONTACT_EMAIL         = your@email.com
```

Click Deploy.

- [ ] **Step 8: Run full test suite**

```bash
npm test
```

Expected: All tests pass.

- [ ] **Step 9: Verify live deployment**

- [ ] Visit your Vercel URL — homepage, projects, publications, contact all render
- [ ] `/admin` redirects to `/admin/login`
- [ ] Log in with your chosen password
- [ ] Edit the About section, save — GitHub commit appears in repo, Vercel redeploys within ~1 min
- [ ] Verify updated content appears on the public site

- [ ] **Step 10: Final commit**

```bash
git add scripts/hash-password.js
git commit -m "feat: add deployment scripts and finalize setup"
git push
```

---

## Verification Checklist

- [ ] All client pages render and are mobile-responsive (375px viewport)
- [ ] `/projects/ai-voice-assistant-ux` resolves and renders markdown with prose styles
- [ ] CV download link works (`/files/cv.pdf` — upload your PDF to `public/files/` and commit)
- [ ] Contact form sends email to your address via Resend
- [ ] Admin login/logout cycle works; cookie persists across page refreshes
- [ ] Create a new project in admin → GitHub commit visible → Vercel redeploys → appears on site
- [ ] Edit existing project → same redeploy flow
- [ ] `/admin/dashboard/projects` redirects to `/admin/login` when cookie is absent
- [ ] `GITHUB_TOKEN` not visible in browser Network tab on any admin page
