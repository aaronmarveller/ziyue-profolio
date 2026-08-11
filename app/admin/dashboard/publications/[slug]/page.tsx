// app/admin/dashboard/publications/[slug]/page.tsx
import { readFile } from '@/lib/github'
import { PublicationForm } from '@/components/admin/PublicationForm'
import matter from 'gray-matter'

// This page fetches live GitHub content per request via lib/github.ts.
// Static prerender at build was accidental and required a real GITHUB_TOKEN;
// render per request instead (behavior is otherwise unchanged).
export const dynamic = 'force-dynamic'

export default async function EditPublicationPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params
  const { content: raw, sha } = await readFile(`content/publications/${slug}.md`)
  const { data, content } = matter(raw)

  return (
    <div>
      <h1 className="text-2xl font-bold text-gray-900 mb-8">Edit Publication</h1>
      <PublicationForm
        slug={slug}
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
