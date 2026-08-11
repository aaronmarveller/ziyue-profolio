// app/(portfolio)/projects/page.tsx
import { getProjects } from '@/lib/content'
import { ProjectCard } from '@/components/portfolio/ProjectCard'

export const metadata = { title: 'Research — Ziyue Guo' }

export default async function ProjectsPage() {
  const projects = await getProjects()

  return (
    <div className="page-container py-16 md:py-20">
      <header className="max-w-2xl">
        <h1 className="heading-1 text-gray-900 dark:text-gray-100">Research</h1>
        <p className="body-lead mt-4 text-gray-600 dark:text-gray-300">
          UX research projects at the intersection of AI and human communication.
        </p>
      </header>
      <div className="mt-12 grid grid-cols-1 gap-5 md:grid-cols-2">
        {projects.map(project => (
          <ProjectCard key={project.slug} project={project} />
        ))}
      </div>
    </div>
  )
}
