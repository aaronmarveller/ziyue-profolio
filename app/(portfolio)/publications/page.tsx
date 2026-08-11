// app/(portfolio)/publications/page.tsx
import { getPublications } from '@/lib/content'
import { isUsableFileUrl } from '@/lib/content-utils'

export const metadata = { title: 'Publications — Ziyue Guo' }

export default async function PublicationsPage() {
  const publications = await getPublications()

  return (
    <div className="page-container py-16 pb-24">
      <header className="mb-14 max-w-3xl">
        <h1 className="heading-1 text-gray-900 dark:text-gray-100">Publications</h1>
        <p className="body-lead mt-4 text-gray-600 dark:text-gray-300">
          Academic research at the intersection of applied linguistics and AI.
        </p>
      </header>

      <ul className="max-w-3xl divide-y divide-gray-100 dark:divide-gray-800">
        {publications.map(pub => (
          <li key={pub.slug} className="py-10 first:pt-0">
            <h2 className="heading-2 mb-2 text-gray-900 dark:text-gray-100">{pub.title}</h2>
            <p className="mb-4 text-sm text-gray-500 dark:text-gray-400">
              <span className="italic">{pub.journal}</span>
              <span aria-hidden="true" className="mx-2">·</span>
              <span>{pub.year}</span>
            </p>
            <p className="mb-6 text-base leading-7 text-gray-600 dark:text-gray-300">{pub.content}</p>
            <div className="flex flex-wrap items-center gap-x-6 gap-y-3">
              {pub.doi && (
                <a
                  href={`https://doi.org/${pub.doi}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="rounded text-sm font-medium text-accent-600 hover:text-accent-700 hover:underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent-500 focus-visible:ring-offset-2 focus-visible:ring-offset-white dark:text-accent-400 dark:hover:text-accent-300 dark:focus-visible:ring-accent-400 dark:focus-visible:ring-offset-gray-900"
                >
                  DOI →
                </a>
              )}
              {isUsableFileUrl(pub.pdf_url) && (
                <a
                  href={pub.pdf_url}
                  className="rounded text-sm font-medium text-accent-600 hover:text-accent-700 hover:underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent-500 focus-visible:ring-offset-2 focus-visible:ring-offset-white dark:text-accent-400 dark:hover:text-accent-300 dark:focus-visible:ring-accent-400 dark:focus-visible:ring-offset-gray-900"
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
