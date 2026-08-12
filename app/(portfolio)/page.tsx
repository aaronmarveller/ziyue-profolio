// app/(portfolio)/page.tsx
// Research-led home journey: introduction → featured research →
// selected publications → collaboration/contact invitation.
// Featured research uses the shared ProjectCard (one link per case study)
// and leads to the /projects/<slug> destinations. Publications have no
// per-item route, so they stay readable entries with a single "View all
// publications" onward link. Unusable CV and placeholder-email actions are
// absent, not broken.
import { getAbout, getProjects, getPublications } from '@/lib/content'
import { Hero } from '@/components/portfolio/Hero'
import { ProjectCard } from '@/components/portfolio/ProjectCard'
import { Reveal } from '@/components/portfolio/Reveal'
import Link from 'next/link'

const focusRing =
  'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent-500 dark:focus-visible:ring-accent-400 focus-visible:ring-offset-2 focus-visible:ring-offset-white dark:focus-visible:ring-offset-gray-900'

const onwardLink =
  `group inline-flex items-center gap-1 font-mono-ui text-xs font-medium text-accent-600 transition-colors duration-150 hover:text-accent-700 dark:text-accent-400 dark:hover:text-accent-300 ${focusRing}`

/** Small mono label above a section heading — a field-note section marker. */
function SectionLabel({ children }: { children: React.ReactNode }) {
  return (
    <p className="label-mono text-accent-600 dark:text-accent-400">{children}</p>
  )
}

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

      {/* Featured research — "case files" */}
      <section className="page-container py-14 sm:py-20" aria-labelledby="featured-research">
        <Reveal>
          <div className="flex flex-wrap items-end justify-between gap-x-6 gap-y-2 border-b border-black/[0.06] pb-4 dark:border-white/10">
            <div>
              <SectionLabel>
                {featured.length} {featured.length === 1 ? 'case file' : 'case files'}
              </SectionLabel>
              <h2 id="featured-research" className="heading-2 mt-1.5 text-gray-900 dark:text-gray-100">
                Featured Research
              </h2>
            </div>
            <Link
              href="/projects"
              className={onwardLink}
            >
              View all research
              <span aria-hidden="true" className="transition-transform duration-200 group-hover:translate-x-0.5">
                →
              </span>
            </Link>
          </div>
        </Reveal>
        <div className="mt-8 grid grid-cols-1 gap-5 md:grid-cols-2">
          {featured.map((project, i) => (
            <Reveal key={project.slug} delay={i * 70} className="h-full">
              <ProjectCard project={project} />
            </Reveal>
          ))}
        </div>
      </section>

      {/* Selected publications — reading log */}
      <section className="page-container py-14 sm:py-20" aria-labelledby="selected-publications">
        <Reveal>
          <div className="flex flex-wrap items-end justify-between gap-x-6 gap-y-2 border-b border-black/[0.06] pb-4 dark:border-white/10">
            <div>
              <SectionLabel>
                {publications.length} {publications.length === 1 ? 'paper' : 'papers'}
              </SectionLabel>
              <h2 id="selected-publications" className="heading-2 mt-1.5 text-gray-900 dark:text-gray-100">
                Selected Publications
              </h2>
            </div>
            <Link
              href="/publications"
              className={onwardLink}
            >
              View all publications
              <span aria-hidden="true" className="transition-transform duration-200 group-hover:translate-x-0.5">
                →
              </span>
            </Link>
          </div>
        </Reveal>
        <Reveal>
          <ul className="mt-2 divide-y divide-black/[0.06] dark:divide-white/10">
            {publications.map(pub => (
              <li key={pub.slug} className="py-8 first:pt-8 last:pb-0">
                <h3 className="heading-2 text-gray-900 dark:text-gray-100">{pub.title}</h3>
                <p className="mt-1.5 font-mono-ui text-xs text-gray-500 dark:text-gray-400">
                  <span className="italic">{pub.journal}</span>
                  <span aria-hidden="true"> · </span>
                  {pub.year}
                </p>
                <p className="mt-3 max-w-2xl text-sm leading-relaxed text-gray-600 dark:text-gray-300">
                  {pub.content}
                </p>
                {pub.doi && (
                  <a
                    href={`https://doi.org/${pub.doi}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className={`group mt-3 inline-flex items-center gap-1 font-mono-ui text-xs font-medium text-accent-600 hover:text-accent-700 dark:text-accent-400 dark:hover:text-accent-300 ${focusRing}`}
                  >
                    DOI
                    <span aria-hidden="true" className="transition-transform duration-200 group-hover:translate-x-0.5">
                      →
                    </span>
                  </a>
                )}
              </li>
            ))}
          </ul>
        </Reveal>
      </section>

      {/* Collaboration / contact invitation */}
      <section className="page-container pb-24 pt-6 sm:pt-10" aria-labelledby="collaboration">
        <Reveal>
          <div className="rounded-3xl border border-black/[0.07] bg-white px-6 py-12 text-center sm:px-12 sm:py-16 dark:border-white/10 dark:bg-[#111826]">
            <div className="mx-auto max-w-2xl">
              <SectionLabel>Open channel</SectionLabel>
              <h2 id="collaboration" className="heading-2 mt-3 text-gray-900 dark:text-gray-100">
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
                  className={`group inline-flex items-center rounded-full bg-accent-600 px-6 py-3 text-sm font-medium text-white transition hover:bg-accent-700 active:scale-[0.98] dark:bg-accent-400 dark:text-gray-950 dark:hover:bg-accent-300 ${focusRing}`}
                >
                  Get in touch
                  <span aria-hidden="true" className="ml-2 inline-block transition-transform duration-200 group-hover:translate-x-0.5">
                    →
                  </span>
                </Link>
              </div>
            </div>
          </div>
        </Reveal>
      </section>
    </>
  )
}
