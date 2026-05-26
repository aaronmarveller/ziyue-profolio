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
  return { title: project ? `${project.title} — Ziyue Guo` : 'Not Found' }
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
