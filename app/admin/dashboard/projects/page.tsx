// app/admin/dashboard/projects/page.tsx
import { listFiles, readFile } from '@/lib/github'
import Link from 'next/link'
import matter from 'gray-matter'

export default async function AdminProjectsPage() {
  const files = await listFiles('content/projects')
  const mdFiles = files.filter(f => f.endsWith('.md'))
  const projects = await Promise.all(
    mdFiles.map(async f => {
      const slug = f.replace('.md', '')
      const { content } = await readFile(`content/projects/${f}`)
      const { data } = matter(content)
      return { slug, title: data.title as string, date: data.date as string }
    })
  )
  projects.sort((a, b) => b.date.localeCompare(a.date))

  return (
    <div>
      <div className="flex items-center justify-between mb-8">
        <h1 className="text-2xl font-bold text-gray-900">Projects</h1>
        <Link href="/admin/dashboard/projects/new"
          className="px-4 py-2 bg-gray-900 text-white text-sm font-medium rounded-lg hover:bg-gray-700 transition-colors">
          + New Project
        </Link>
      </div>
      <ul className="space-y-2">
        {projects.map(({ slug, title, date }) => (
          <li key={slug} className="flex items-center justify-between border border-gray-100 rounded-lg px-4 py-3">
            <div>
              <p className="text-sm font-medium text-gray-900">{title}</p>
              <p className="text-xs text-gray-400">{date}</p>
            </div>
            <Link href={`/admin/dashboard/projects/${slug}`}
              className="text-sm text-indigo-600 hover:underline">Edit</Link>
          </li>
        ))}
      </ul>
    </div>
  )
}
