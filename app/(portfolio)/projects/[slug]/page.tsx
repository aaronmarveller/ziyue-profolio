// app/(portfolio)/projects/[slug]/page.tsx
import { getProject, getProjects } from '@/lib/content'
import { MDXRemote } from 'next-mdx-remote/rsc'
import { notFound } from 'next/navigation'
import Link from 'next/link'
import type { CSSProperties } from 'react'
import type { Metadata } from 'next'

// Shared focus-visible ring contract (see globals.css design tokens).
const FOCUS_RING =
  'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent-500 dark:focus-visible:ring-accent-400 focus-visible:ring-offset-2 focus-visible:ring-offset-white dark:focus-visible:ring-offset-gray-900'

export async function generateStaticParams() {
  const projects = await getProjects()
  return projects.map(p => ({ slug: p.slug }))
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>
}): Promise<Metadata> {
  const { slug } = await params
  const project = await getProject(slug)
  return { title: project ? `${project.title} — Ziyue Guo` : 'Not Found' }
}

export default async function ProjectDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>
}) {
  const { slug } = await params
  const project = await getProject(slug)
  if (!project) notFound()

  return (
    <div className="mx-auto max-w-3xl px-6 py-16 md:py-20">
      <Link
        href="/projects"
        className={`hero-reveal inline-flex items-center gap-1.5 font-mono-ui text-xs font-medium text-accent-600 transition-colors duration-150 hover:text-accent-700 dark:text-accent-400 dark:hover:text-accent-300 ${FOCUS_RING}`}
        style={{ '--reveal-delay': '0.05s' } as CSSProperties}
      >
        <svg
          aria-hidden="true"
          viewBox="0 0 20 20"
          fill="currentColor"
          className="h-4 w-4"
        >
          <path
            fillRule="evenodd"
            d="M17 10a.75.75 0 0 1-.75.75H5.612l4.158 3.96a.75.75 0 1 1-1.04 1.08l-5.5-5.25a.75.75 0 0 1 0-1.08l5.5-5.25a.75.75 0 1 1 1.04 1.08L5.612 9.25H16.25A.75.75 0 0 1 17 10Z"
            clipRule="evenodd"
          />
        </svg>
        Back to Research
      </Link>

      <article className="mt-10">
        <p
          className="hero-reveal label-mono text-accent-600 dark:text-accent-400"
          style={{ '--reveal-delay': '0.12s' } as CSSProperties}
        >
          Case file
        </p>
        <h1
          className="hero-reveal heading-1 mt-2 text-gray-900 dark:text-gray-100"
          style={{ '--reveal-delay': '0.2s' } as CSSProperties}
        >
          {project.title}
        </h1>
        <div
          className="hero-reveal mt-4 flex flex-wrap items-center gap-x-4 gap-y-2"
          style={{ '--reveal-delay': '0.3s' } as CSSProperties}
        >
          <p className="font-mono-ui text-xs text-gray-500 dark:text-gray-400">{project.date}</p>
          <ul className="flex flex-wrap gap-2">
            {project.tags.map(tag => (
              <li key={tag}>
                <span className="label-mono rounded-full border border-black/[0.08] px-2.5 py-1 text-accent-700 dark:border-white/15 dark:text-accent-300">
                  {tag}
                </span>
              </li>
            ))}
          </ul>
        </div>

        <div
          className="hero-reveal prose prose-gray mt-8 dark:prose-invert"
          style={{ '--reveal-delay': '0.4s' } as CSSProperties}
        >
          <MDXRemote source={project.content} />
        </div>
      </article>
    </div>
  )
}
