// components/portfolio/Hero.tsx
// Home-page introduction. Presents only authentic supplied content and
// withholds unavailable actions (placeholder email, missing CV file) rather
// than rendering broken or misleading links. The CV action is derived from
// content usability so valid future files appear without code changes.
import type { About } from '@/types/content'
import { isUsableFileUrl } from '@/lib/content-utils'
import { MDXRemote } from 'next-mdx-remote/rsc'
import Link from 'next/link'

const focusRing =
  'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent-500 dark:focus-visible:ring-accent-400 focus-visible:ring-offset-2 focus-visible:ring-offset-white dark:focus-visible:ring-offset-gray-900'

export function Hero({ about }: { about: About }) {
  const cvUsable = isUsableFileUrl(about.cv_url)
  return (
    <section className="page-container pt-16 pb-14 sm:pt-20 sm:pb-16">
      <div className="max-w-3xl">
        <p className="mb-4 text-sm font-medium uppercase tracking-[0.12em] text-accent-600 dark:text-accent-400">
          {about.title}
        </p>
        <h1 className="display-1 text-gray-900 dark:text-gray-100">{about.name}</h1>
        <p className="body-lead mt-5 max-w-2xl text-gray-600 dark:text-gray-300">
          {about.tagline}
        </p>
        <div className="prose prose-gray mt-6 max-w-2xl dark:prose-invert">
          <MDXRemote source={about.content} />
        </div>
        <div className="mt-8 flex flex-wrap items-center gap-4">
          <Link
            href="/projects"
            className={`inline-flex items-center rounded-full bg-accent-600 px-6 py-3 text-sm font-medium text-white transition hover:bg-accent-700 active:scale-[0.98] dark:bg-accent-400 dark:text-gray-950 dark:hover:bg-accent-300 ${focusRing}`}
          >
            View Research
            <span aria-hidden="true" className="ml-2">→</span>
          </Link>
          {cvUsable && (
            <Link
              href={about.cv_url}
              className={`inline-flex items-center rounded-full border border-gray-200 px-6 py-3 text-sm font-medium text-gray-700 transition hover:border-gray-300 active:scale-[0.98] dark:border-gray-700 dark:text-gray-300 dark:hover:border-gray-500 ${focusRing}`}
            >
              Download CV
              <span aria-hidden="true" className="ml-2">↓</span>
            </Link>
          )}
        </div>
      </div>
    </section>
  )
}
