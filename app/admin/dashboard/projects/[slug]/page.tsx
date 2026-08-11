// app/admin/dashboard/projects/[slug]/page.tsx
import { readFile } from '@/lib/github'
import { ProjectForm } from '@/components/admin/ProjectForm'
import matter from 'gray-matter'

// This page fetches live GitHub content per request via lib/github.ts.
// Static prerender at build was accidental and required a real GITHUB_TOKEN;
// render per request instead (behavior is otherwise unchanged).
export const dynamic = 'force-dynamic'

export default async function EditProjectPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params
  const { content: raw, sha } = await readFile(`content/projects/${slug}.md`)
  const { data, content } = matter(raw)

  return (
    <div>
      <h1 className="text-2xl font-bold text-gray-900 mb-8">Edit Project</h1>
      <ProjectForm
        slug={slug}
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
