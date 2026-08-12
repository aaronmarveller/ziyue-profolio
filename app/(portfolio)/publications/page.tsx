// app/(portfolio)/publications/page.tsx
import { getPublications } from '@/lib/content'
import { isUsableFileUrl } from '@/lib/content-utils'
import { Reveal } from '@/components/portfolio/Reveal'

export const metadata = { title: 'Publications — Ziyue Guo' }

export default async function PublicationsPage() {
  const publications = await getPublications()

  return (
    <div className="page-container py-16 pb-24">
      <header className="mb-14 max-w-3xl">
        <p className="label-mono text-accent-600 dark:text-accent-400">Reference log</p>
        <h1 className="heading-1 mt-2 text-gray-900 dark:text-gray-100">Publications</h1>
        <p className="body-lead mt-4 text-gray-600 dark:text-gray-300">
          Academic research at the intersection of applied linguistics and AI.
        </p>
      </header>

      {/* Numbered bibliography — the ordering is real (a reference list),
          so the indices encode position, not decoration. */}
      <ol className="max-w-3xl divide-y divide-black/[0.06] dark:divide-white/10">
        {publications.map((pub, i) => (
          <li key={pub.slug} className="py-10 first:pt-0">
            <Reveal delay={i * 60}>
              <div className="flex gap-4 sm:gap-5">
                <span
                  aria-hidden="true"
                  className="pt-1 font-mono-ui text-xs text-gray-400 dark:text-gray-500"
                >
                  {String(i + 1).padStart(2, '0')}
                </span>
                <div className="min-w-0">
                  <h2 className="heading-2 mb-2 text-gray-900 dark:text-gray-100">{pub.title}</h2>
                  <p className="mb-4 font-mono-ui text-xs text-gray-500 dark:text-gray-400">
                    <span className="italic">{pub.journal}</span>
                    <span aria-hidden="true" className="mx-2">·</span>
                    <span>{pub.year}</span>
                  </p>
                  <p className="mb-6 text-base leading-7 text-gray-600 dark:text-gray-300">
                    {pub.content}
                  </p>
                  <div className="flex flex-wrap items-center gap-x-6 gap-y-3">
                    {pub.doi && (
                      <a
                        href={`https://doi.org/${pub.doi}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="group inline-flex items-center gap-1 rounded font-mono-ui text-xs font-medium text-accent-600 transition-colors duration-150 hover:text-accent-700 dark:text-accent-400 dark:hover:text-accent-300 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent-500 focus-visible:ring-offset-2 focus-visible:ring-offset-white dark:focus-visible:ring-accent-400 dark:focus-visible:ring-offset-gray-900"
                      >
                        DOI →
                      </a>
                    )}
                    {isUsableFileUrl(pub.pdf_url) && (
                      <a
                        href={pub.pdf_url}
                        className="group inline-flex items-center gap-1 rounded font-mono-ui text-xs font-medium text-accent-600 transition-colors duration-150 hover:text-accent-700 dark:text-accent-400 dark:hover:text-accent-300 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent-500 focus-visible:ring-offset-2 focus-visible:ring-offset-white dark:focus-visible:ring-accent-400 dark:focus-visible:ring-offset-gray-900"
                      >
                        PDF ↓
                      </a>
                    )}
                  </div>
                </div>
              </div>
            </Reveal>
          </li>
        ))}
      </ol>
    </div>
  )
}
