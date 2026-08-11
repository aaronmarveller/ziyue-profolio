// app/(portfolio)/contact/page.tsx
import { getAbout } from '@/lib/content'
import { isUsableEmail, isUsableFileUrl } from '@/lib/content-utils'
import { ContactForm } from '@/components/portfolio/ContactForm'

export const metadata = { title: 'Contact — Ziyue Guo' }

export default async function ContactPage() {
  const about = await getAbout()
  const hasEmail = isUsableEmail(about.email)
  const hasCv = isUsableFileUrl(about.cv_url)
  const hasDirectActions = hasEmail || hasCv

  return (
    <div className="page-container py-16 pb-24">
      <header className="mb-12 max-w-3xl">
        <h1 className="heading-1 text-gray-900 dark:text-gray-100">Get in Touch</h1>
        <p className="body-lead mt-4 text-gray-600 dark:text-gray-300">
          Interested in collaborating or have questions about my research?
        </p>
      </header>

      {hasDirectActions ? (
        <div className="grid grid-cols-1 gap-12 md:grid-cols-2">
          <ContactForm />
          <aside className="space-y-10 md:border-l md:border-gray-100 md:pl-10 md:dark:border-gray-800">
            {hasEmail && (
              <div>
                <h2 className="mb-2 text-xs font-semibold uppercase tracking-widest text-gray-500 dark:text-gray-400">
                  Email
                </h2>
                <a
                  href={`mailto:${about.email}`}
                  className="rounded text-base font-medium text-accent-600 hover:text-accent-700 hover:underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent-500 focus-visible:ring-offset-2 focus-visible:ring-offset-white dark:text-accent-400 dark:hover:text-accent-300 dark:focus-visible:ring-accent-400 dark:focus-visible:ring-offset-gray-900"
                >
                  {about.email}
                </a>
              </div>
            )}
            {hasCv && (
              <div>
                <h2 className="mb-2 text-xs font-semibold uppercase tracking-widest text-gray-500 dark:text-gray-400">
                  CV
                </h2>
                <a
                  href={about.cv_url}
                  className="rounded text-base font-medium text-accent-600 hover:text-accent-700 hover:underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent-500 focus-visible:ring-offset-2 focus-visible:ring-offset-white dark:text-accent-400 dark:hover:text-accent-300 dark:focus-visible:ring-accent-400 dark:focus-visible:ring-offset-gray-900"
                >
                  Download CV (PDF) ↓
                </a>
              </div>
            )}
          </aside>
        </div>
      ) : (
        <div className="max-w-3xl">
          <ContactForm />
        </div>
      )}
    </div>
  )
}
