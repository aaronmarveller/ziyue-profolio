// components/portfolio/Hero.tsx
// Home-page introduction. Presents only authentic supplied content and
// withholds unavailable actions (placeholder email, missing CV file) rather
// than rendering broken or misleading links. The CV action is derived from
// content usability so valid future files appear without code changes.
//
// Layout: the researcher's introduction reads like a field note (mono label,
// serif name), with the signature self-typing transcript alongside — the
// thesis, demonstrated: "how people talk to machines." Elements enter on a
// staggered load sequence (`.hero-reveal` + `--reveal-delay`).
import type { About } from '@/types/content'
import { isUsableFileUrl } from '@/lib/content-utils'
import { MDXRemote } from 'next-mdx-remote/rsc'
import Link from 'next/link'
import type { CSSProperties } from 'react'
import { Transcript } from './Transcript'

const focusRing =
  'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent-500 dark:focus-visible:ring-accent-400 focus-visible:ring-offset-2 focus-visible:ring-offset-white dark:focus-visible:ring-offset-gray-900'

export function Hero({ about }: { about: About }) {
  const cvUsable = isUsableFileUrl(about.cv_url)
  return (
    <section className="page-container relative pt-16 pb-14 sm:pt-20 sm:pb-16">
      {/* Ambient "listening" orb — the single ambient motion on the page. */}
      <div
        aria-hidden="true"
        className="hero-orb right-[-6rem] top-2 h-80 w-80 opacity-70 dark:opacity-40 sm:right-[-4rem] sm:h-96 sm:w-96 lg:right-0"
      />

      <div className="relative grid gap-12 lg:grid-cols-[minmax(0,1fr)_24rem] lg:items-start">
        <div className="max-w-2xl">
          <p
            className="hero-reveal label-mono text-accent-600 dark:text-accent-400"
            style={{ '--reveal-delay': '0.05s' } as CSSProperties}
          >
            {about.title}
          </p>
          <h1
            className="hero-reveal display-1 mt-4 text-gray-900 dark:text-gray-100"
            style={{ '--reveal-delay': '0.15s' } as CSSProperties}
          >
            {about.name}
          </h1>
          <p
            className="hero-reveal body-lead mt-5 text-gray-600 dark:text-gray-300"
            style={{ '--reveal-delay': '0.25s' } as CSSProperties}
          >
            {about.tagline}
          </p>
          <div
            className="hero-reveal prose prose-gray mt-6 max-w-2xl dark:prose-invert"
            style={{ '--reveal-delay': '0.35s' } as CSSProperties}
          >
            <MDXRemote source={about.content} />
          </div>
          <div
            className="hero-reveal mt-8 flex flex-wrap items-center gap-4"
            style={{ '--reveal-delay': '0.45s' } as CSSProperties}
          >
            <Link
              href="/projects"
              className={`group inline-flex items-center rounded-full bg-accent-600 px-6 py-3 text-sm font-medium text-white transition hover:bg-accent-700 active:scale-[0.98] dark:bg-accent-400 dark:text-gray-950 dark:hover:bg-accent-300 ${focusRing}`}
            >
              View Research
              <span
                aria-hidden="true"
                className="ml-2 inline-block transition-transform duration-200 group-hover:translate-x-0.5"
              >
                →
              </span>
            </Link>
            {cvUsable && (
              <Link
                href={about.cv_url}
                className={`group inline-flex items-center rounded-full border border-gray-200 px-6 py-3 text-sm font-medium text-gray-700 transition hover:border-gray-300 active:scale-[0.98] dark:border-gray-700 dark:text-gray-300 dark:hover:border-gray-500 ${focusRing}`}
              >
                Download CV
                <span
                  aria-hidden="true"
                  className="ml-2 inline-block transition-transform duration-200 group-hover:translate-y-0.5"
                >
                  ↓
                </span>
              </Link>
            )}
          </div>
        </div>

        {/* Signature: the self-typing field recording. */}
        <div
          className="hero-reveal lg:pt-8"
          style={{ '--reveal-delay': '0.6s' } as CSSProperties}
        >
          <Transcript />
        </div>
      </div>
    </section>
  )
}
