// components/portfolio/ProjectCard.tsx
import type { Project } from '@/types/content'
import Link from 'next/link'

// Shared focus-visible ring contract (see globals.css design tokens).
const FOCUS_RING =
  'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent-500 dark:focus-visible:ring-accent-400 focus-visible:ring-offset-2 focus-visible:ring-offset-white dark:focus-visible:ring-offset-gray-900'

export function ProjectCard({ project }: { project: Project }) {
  return (
    <Link
      href={`/projects/${project.slug}`}
      className={`group block rounded-2xl border border-gray-100 bg-white p-6 transition duration-150 ease-out hover:-translate-y-0.5 hover:border-accent-200 hover:shadow-sm active:scale-[0.98] dark:border-gray-800 dark:bg-gray-900 dark:hover:border-accent-800 ${FOCUS_RING}`}
    >
      <div className="flex flex-wrap gap-2">
        {project.tags.map(tag => (
          <span
            key={tag}
            className="rounded-full bg-accent-500/10 px-2.5 py-1 text-xs font-medium text-accent-700 dark:bg-accent-400/15 dark:text-accent-300"
          >
            {tag}
          </span>
        ))}
      </div>

      <div className="mt-4 flex items-start justify-between gap-3">
        <h3 className="heading-2 text-gray-900 transition-colors duration-150 group-hover:text-accent-700 dark:text-gray-100 dark:group-hover:text-accent-300">
          {project.title}
        </h3>
        <svg
          aria-hidden="true"
          viewBox="0 0 20 20"
          fill="currentColor"
          className="mt-1.5 h-5 w-5 shrink-0 text-gray-400 transition-transform duration-150 group-hover:translate-x-0.5 group-hover:text-accent-600 dark:text-gray-500 dark:group-hover:text-accent-400"
        >
          <path
            fillRule="evenodd"
            d="M3 10a.75.75 0 0 1 .75-.75h10.638L10.23 5.29a.75.75 0 1 1 1.04-1.08l5.5 5.25a.75.75 0 0 1 0 1.08l-5.5 5.25a.75.75 0 1 1-1.04-1.08l4.158-3.96H3.75A.75.75 0 0 1 3 10Z"
            clipRule="evenodd"
          />
        </svg>
      </div>

      <p className="mt-3 text-sm leading-relaxed text-gray-600 dark:text-gray-300">
        {project.summary}
      </p>

      <div className="mt-5 flex items-center justify-between">
        <p className="text-xs text-gray-500 dark:text-gray-400">{project.date}</p>
        <span className="text-xs font-medium text-accent-600 transition-colors duration-150 group-hover:text-accent-700 dark:text-accent-400 dark:group-hover:text-accent-300">
          View case study
        </span>
      </div>
    </Link>
  )
}
