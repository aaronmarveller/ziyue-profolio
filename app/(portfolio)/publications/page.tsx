// app/(portfolio)/publications/page.tsx
import { getPublications } from '@/lib/content'

export const metadata = { title: 'Publications — Ziyue Liu' }

export default async function PublicationsPage() {
  const publications = await getPublications()

  return (
    <div className="max-w-3xl mx-auto px-6 py-16">
      <h1 className="text-3xl font-bold text-gray-900 mb-3">Publications</h1>
      <p className="text-gray-500 mb-12">Academic research at the intersection of applied linguistics and AI.</p>
      <ul className="space-y-8">
        {publications.map(pub => (
          <li key={pub.slug} className="border-b border-gray-100 pb-8 last:border-0">
            <h2 className="text-base font-semibold text-gray-900 mb-1">{pub.title}</h2>
            <p className="text-sm text-gray-500 mb-3">
              <span className="italic">{pub.journal}</span> · {pub.year}
            </p>
            <p className="text-sm text-gray-600 mb-4 leading-relaxed">{pub.content}</p>
            <div className="flex gap-4">
              {pub.doi && (
                <a
                  href={`https://doi.org/${pub.doi}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-xs text-indigo-600 hover:underline"
                >
                  DOI →
                </a>
              )}
              {pub.pdf_url && (
                <a
                  href={pub.pdf_url}
                  className="text-xs text-gray-500 hover:text-gray-900"
                >
                  PDF ↓
                </a>
              )}
            </div>
          </li>
        ))}
      </ul>
    </div>
  )
}
