// components/portfolio/Transcript.tsx
// The signature moment: a self-typing "field recording" of the trust-repair
// exchange at the heart of the featured research — a non-native speaker asks
// the assistant to repeat itself, and the assistant answers with the study's
// headline finding. Pure CSS (clip-path + steps()); no JavaScript, so it is
// jsdom-safe and readable by assistive technology (the text is real DOM
// content, only visually clipped while "typing"). The prefers-reduced-motion
// override neutralizes it to a static, fully visible exchange.
import type { CSSProperties } from 'react'

/** Inline custom properties consumed by the CSS typing animation. */
function turnStyle(chars: number, duration: string, delay: string): CSSProperties {
  return {
    '--type-chars': chars,
    '--type-dur': duration,
    '--type-delay': delay,
  } as CSSProperties
}

export function Transcript() {
  return (
    <figure
      aria-label="Field recording: a user asks a voice assistant to repeat itself, and the assistant answers with the study's finding"
      className="overflow-hidden rounded-2xl border border-black/[0.08] bg-white/90 shadow-sm shadow-gray-900/[0.04] dark:border-white/10 dark:bg-[#111826]/90"
    >
      {/* Recording header */}
      <figcaption className="flex items-center justify-between border-b border-black/[0.06] px-5 py-3 dark:border-white/10">
        <span className="label-mono flex items-center gap-2 text-accent-700 dark:text-accent-300">
          <span aria-hidden="true" className="rec-dot inline-block h-2 w-2 rounded-full bg-voice-500 dark:bg-voice-400" />
          Field Recording
        </span>
        <span aria-hidden="true" className="label-mono text-gray-400 dark:text-gray-500">
          00:00 / 00:08
        </span>
      </figcaption>

      {/* The exchange — two turns, typed left to right. */}
      <div className="px-5 py-5">
        <ol className="space-y-5">
          <li>
            <span className="label-mono text-voice-600 dark:text-voice-400">
              User · 0:04
            </span>
            <p
              className="turn-line font-mono-ui mt-1.5 text-[0.8125rem] leading-relaxed text-gray-700 dark:text-gray-200"
              style={turnStyle(41, '2.3s', '1.2s')}
            >
              Sorry — can you say that again, slower?
              <span aria-hidden="true" className="turn-caret" />
            </p>
          </li>
          <li>
            <span className="label-mono text-accent-600 dark:text-accent-400">
              Voice Assistant · 0:07
            </span>
            <p
              className="turn-line font-mono-ui mt-1.5 text-[0.8125rem] leading-relaxed text-gray-700 dark:text-gray-200"
              style={turnStyle(46, '2.6s', '4s')}
            >
              Of course. 3× more errors for accented voices.
              <span aria-hidden="true" className="turn-caret" />
            </p>
          </li>
        </ol>

        {/* "Listening" end state — the assistant (and the site) is still open. */}
        <div
          aria-hidden="true"
          className="waveform mt-6 flex items-center gap-1.5"
          style={{ '--wave-delay': '7s' } as CSSProperties}
        >
          <span className="label-mono mr-2 text-accent-600 dark:text-accent-400">
            Listening
          </span>
          {[0, 1, 2, 3, 4, 5].map(i => (
            <span
              key={i}
              className="wave-bar h-5 w-1 rounded-full bg-accent-500/70 dark:bg-accent-400/70"
              style={{ animationDelay: `${i * 0.12}s` }}
            />
          ))}
        </div>
      </div>
    </figure>
  )
}
