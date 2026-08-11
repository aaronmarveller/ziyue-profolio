// app/admin/dashboard/publications/page.tsx
import { listFiles, readFile } from '@/lib/github'
import Link from 'next/link'
import matter from 'gray-matter'

// This page fetches live GitHub content per request via lib/github.ts.
// Static prerender at build was accidental and required a real GITHUB_TOKEN;
// render per request instead (behavior is otherwise unchanged).
export const dynamic = 'force-dynamic'

export default async function AdminPublicationsPage() {
  const files = await listFiles('content/publications')
  const mdFiles = files.filter(f => f.endsWith('.md'))
  const pubs = await Promise.all(
    mdFiles.map(async f => {
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
