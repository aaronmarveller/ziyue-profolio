// components/portfolio/Hero.tsx
import type { About } from '@/types/content'
import Link from 'next/link'

export function Hero({ about }: { about: About }) {
  return (
    <section className="max-w-3xl mx-auto px-6 pt-20 pb-16">
      <p className="text-sm text-indigo-600 font-medium mb-3 tracking-wide uppercase">
        {about.title}
      </p>
      <h1 className="text-4xl font-bold text-gray-900 mb-4">{about.name}</h1>
      <p className="text-xl text-gray-500 mb-8 leading-relaxed">{about.tagline}</p>
      <div className="flex gap-4">
        <Link
          href="/projects"
          className="px-5 py-2.5 bg-gray-900 text-white text-sm font-medium rounded-lg hover:bg-gray-700 transition-colors"
        >
          View Research
        </Link>
        <Link
          href={about.cv_url}
          className="px-5 py-2.5 border border-gray-200 text-gray-700 text-sm font-medium rounded-lg hover:border-gray-400 transition-colors"
        >
          Download CV
        </Link>
      </div>
    </section>
  )
}
