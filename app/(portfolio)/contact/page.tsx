// app/(portfolio)/contact/page.tsx
import { getAbout } from '@/lib/content'
import { isUsableEmail, isUsableFileUrl } from '@/lib/content-utils'
import { ContactForm } from '@/components/portfolio/ContactForm'
import { Reveal } from '@/components/portfolio/Reveal'

export const metadata = { title: 'Contact — Ziyue Guo' }

export default async function ContactPage() {
  const about = await getAbout()
  const hasEmail = isUsableEmail(about.email)
  const hasCv = isUsableFileUrl(about.cv_url)
  const hasDirectActions = hasEmail || hasCv

  return (
    <div className="page-container py-16 pb-24">
      <header className="mb-12 max-w-3xl">
        <p className="label-mono text-accent-600 dark:text-accent-400">Field contact</p>
        <h1 className="heading-1 mt-2 text-gray-900 dark:text-gray-100">Get in Touch</h1>
        <p className="body-lead mt-4 text-gray-600 dark:text-gray-300">
          Interested in collaborating or have questions about my research?
        </p>
      </header>

      {hasDirectActions ? (
        <div className="grid grid-cols-1 gap-12 md:grid-cols-2">
          <Reveal>
            <div className="rounded-2xl border border-black/[0.07] bg-white p-6 sm:p-8 dark:border-white/10 dark:bg-[#111826]">
              <ContactForm />
            </div>
          </Reveal>
          <Reveal delay={100}>
            <aside className="space-y-10 md:border-l md:border-black/[0.06] md:pl-10 md:dark:border-white/10">
              {hasEmail && (
                <div>
                  <h2 className="label-mono mb-2 text-gray-500 dark:text-gray-400">
                    Direct line
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
                  <h2 className="label-mono mb-2 text-gray-500 dark:text-gray-400">
                    Curriculum vitae
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
          </Reveal>
        </div>
      ) : (
        <div className="max-w-3xl">
          <ContactForm />
        </div>
      )}
    </div>
  )
}
