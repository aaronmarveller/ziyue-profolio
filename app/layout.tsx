// app/layout.tsx
import type { Metadata, Viewport } from 'next'
import './globals.css'

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
    <html lang="en">
      <body>{children}</body>
    </html>
  )
}
