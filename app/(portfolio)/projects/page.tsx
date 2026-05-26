// app/(portfolio)/projects/page.tsx
import { getProjects } from '@/lib/content'
import { ProjectCard } from '@/components/portfolio/ProjectCard'

export const metadata = { title: 'Research — Ziyue Guo' }

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
