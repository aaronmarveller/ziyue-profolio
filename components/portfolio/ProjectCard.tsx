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
