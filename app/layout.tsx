// app/layout.tsx
import type { Metadata, Viewport } from 'next'
import { Fraunces, IBM_Plex_Mono, Instrument_Sans } from 'next/font/google'
import './globals.css'

// Three-face type system ("field notes" identity):
// - Fraunces (variable serif) — display headings, names, titles.
// - Instrument Sans — body copy and UI.
// - IBM Plex Mono — labels, timestamps, indices.
// Each is self-hosted by next/font (no requests to Google at runtime).
const display = Fraunces({
  subsets: ['latin'],
  axes: ['opsz'],
  variable: '--font-display',
  display: 'swap',
})

const body = Instrument_Sans({
  subsets: ['latin'],
  variable: '--font-body',
  display: 'swap',
})

const mono = IBM_Plex_Mono({
  subsets: ['latin'],
  weight: ['400', '500'],
  variable: '--font-mono',
  display: 'swap',
})

export const metadata: Metadata = {
  title: 'Ziyue Guo — AI UX Researcher',
  description: 'Portfolio of Ziyue Guo, AI UX Researcher with a Ph.D in Applied Linguistics.',
}

/**
 * `themeColor`/`colorScheme` in `metadata` are deprecated in Next 16.
 * Viewport is exported here (Server Component) so both light and dark
 * color schemes are allowed and the browser applies native dark form
 * controls/scrollbars automatically.
 */
export const viewport: Viewport = {
  colorScheme: 'light dark',
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`${display.variable} ${body.variable} ${mono.variable}`}>
      <body>{children}</body>
    </html>
  )
}
