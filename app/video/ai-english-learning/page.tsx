// app/video/ai-english-learning/page.tsx
// Standalone demo page — no PortfolioNav/Footer chrome (it lives outside the
// (portfolio) route group on purpose). Plays a single iPhone screen-recording
// demo of the AI English-learning app. Copy is hardcoded here, not read from
// content/ or the admin CMS. Marked noindex so it never shows up in search.
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'AI English Learning App — Demo',
  robots: { index: false, follow: false },
}

export default function AiEnglishLearningDemoPage() {
  return (
    <main className="flex min-h-screen items-center justify-center bg-paper px-6 py-16 text-ink antialiased dark:bg-canvas dark:text-ink-soft">
      <div className="mx-auto w-full max-w-md">
        {/* Field-note label — the demo is an annotated sample, not a page. */}
        <p className="label-mono text-accent-600 dark:text-accent-400">
          Demo · screen recording
        </p>
        <h1 className="heading-1 mt-2.5 text-gray-900 dark:text-gray-100">
          AI English Learning App
        </h1>
        <p className="body-lead mt-3 text-gray-600 dark:text-gray-300">
          A short demo of the AI English-learning app — a conversation practice
          session, recorded on iPhone.
        </p>

        {/* Click-to-play, standard controls. The placeholder asset ships in
            public/videos and gets swapped for the real recording later. */}
        <video
          className="mt-8 aspect-[9/16] w-full rounded-2xl border border-black/[0.06] bg-black object-contain dark:border-white/10"
          src="/videos/ai-english-learning-demo.mp4"
          aria-label="Screen recording demo of the AI English-learning app"
          controls
          playsInline
          preload="metadata"
        />
      </div>
    </main>
  )
}
