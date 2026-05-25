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
