// app/(portfolio)/page.tsx
// Research-led home journey: introduction → featured research →
// selected publications → collaboration/contact invitation.
// Featured research cards are rendered inline (the shared ProjectCard is
// owned by another change) and lead to their existing /projects/<slug>
// destinations. Publications have no per-item route, so they stay readable
// entries with a single "View all publications" onward link. Unusable CV and
// placeholder-email actions are absent, not broken.
import { getAbout, getProjects, getPublications } from '@/lib/content'
import { Hero } from '@/components/portfolio/Hero'
import Link from 'next/link'

const focusRing =
  'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent-500 dark:focus-visible:ring-accent-400 focus-visible:ring-offset-2 focus-visible:ring-offset-white dark:focus-visible:ring-offset-gray-900'

export default async function HomePage() {
  const [about, projects, publications] = await Promise.all([
    getAbout(),
    getProjects(),
    getPublications(),
  ])
  const featured = projects.filter(p => p.featured)

  return (
    <>
      <Hero about={about} />

      {/* Featured research */}
      <section className="page-container py-14 sm:py-20" aria-labelledby="featured-research">
        <div className="flex flex-wrap items-baseline justify-between gap-x-6 gap-y-2">
          <h2 id="featured-research" className="heading-2 text-gray-900 dark:text-gray-100">
            Featured Research
          </h2>
          <Link
            href="/projects"
            className={`text-sm font-medium text-accent-600 hover:text-accent-700 dark:text-accent-400 dark:hover:text-accent-300 ${focusRing}`}
          >
            View all research
            <span aria-hidden="true"> →</span>
          </Link>
        </div>
        <div className="mt-8 grid grid-cols-1 gap-4 md:grid-cols-2">
          {featured.map(project => (
            <Link
              key={project.slug}
              href={`/projects/${project.slug}`}
              className={`group block rounded-2xl border border-gray-100 bg-white p-6 transition hover:border-accent-400 active:scale-[0.99] dark:border-gray-800 dark:bg-gray-900 dark:hover:border-accent-500 ${focusRing}`}
            >
              <div className="flex flex-wrap gap-2">
                {project.tags.map(tag => (
                  <span
                    key={tag}
                    className="rounded-full bg-accent-500/10 px-2.5 py-1 text-xs font-medium text-accent-700 dark:bg-accent-400/15 dark:text-accent-300"
                  >
                    {tag}
                  </span>
                ))}
              </div>
              <h3 className="mt-4 text-base font-semibold text-gray-900 transition-colors group-hover:text-accent-600 dark:text-gray-100 dark:group-hover:text-accent-400">
                {project.title}
              </h3>
              <p className="mt-2 text-sm leading-relaxed text-gray-600 dark:text-gray-300">
                {project.summary}
              </p>
              <p className="mt-4 text-xs text-gray-500 dark:text-gray-400">{project.date}</p>
            </Link>
          ))}
        </div>
      </section>

      {/* Selected publications */}
      <section className="page-container py-14 sm:py-20" aria-labelledby="selected-publications">
        <div className="flex flex-wrap items-baseline justify-between gap-x-6 gap-y-2">
          <h2 id="selected-publications" className="heading-2 text-gray-900 dark:text-gray-100">
            Selected Publications
          </h2>
          <Link
            href="/publications"
            className={`text-sm font-medium text-accent-600 hover:text-accent-700 dark:text-accent-400 dark:hover:text-accent-300 ${focusRing}`}
          >
            View all publications
            <span aria-hidden="true"> →</span>
          </Link>
        </div>
        <ul className="mt-8 divide-y divide-gray-100 dark:divide-gray-800">
          {publications.map(pub => (
            <li key={pub.slug} className="py-8 first:pt-0 last:pb-0">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100">{pub.title}</h3>
              <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
                <span className="italic">{pub.journal}</span> · {pub.year}
              </p>
              <p className="mt-3 max-w-2xl text-sm leading-relaxed text-gray-600 dark:text-gray-300">
                {pub.content}
              </p>
              {pub.doi && (
                <a
                  href={`https://doi.org/${pub.doi}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className={`mt-3 inline-flex text-sm font-medium text-accent-600 hover:text-accent-700 dark:text-accent-400 dark:hover:text-accent-300 ${focusRing}`}
                >
                  DOI
                  <span aria-hidden="true"> →</span>
                </a>
              )}
            </li>
          ))}
        </ul>
      </section>

      {/* Collaboration / contact invitation */}
      <section className="page-container pb-24 pt-6 sm:pt-10" aria-labelledby="collaboration">
        <div className="rounded-3xl border border-gray-100 bg-white px-6 py-12 sm:px-12 sm:py-16 dark:border-gray-800 dark:bg-gray-900">
          <div className="mx-auto max-w-2xl text-center">
            <h2 id="collaboration" className="heading-2 text-gray-900 dark:text-gray-100">
              Open to collaboration
            </h2>
            <p className="body-lead mt-4 text-gray-600 dark:text-gray-300">
              My research sits at the intersection of language, cognition, and human-AI
              interaction — how people communicate with AI systems and what that means for
              designing with clarity, trust, and inclusion. If your team works on
              conversational AI, chatbot design, or NLP evaluation, I would welcome a
              conversation.
            </p>
            <div className="mt-8">
              <Link
                href="/contact"
                className={`inline-flex items-center rounded-full bg-accent-600 px-6 py-3 text-sm font-medium text-white transition hover:bg-accent-700 active:scale-[0.98] dark:bg-accent-400 dark:text-gray-950 dark:hover:bg-accent-300 ${focusRing}`}
              >
                Get in touch
                <span aria-hidden="true" className="ml-2">→</span>
              </Link>
            </div>
          </div>
        </div>
      </section>
    </>
  )
}
