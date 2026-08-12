// app/(portfolio)/layout.tsx
import { PortfolioNav } from '@/components/portfolio/Nav'
import { Footer } from '@/components/portfolio/Footer'

/**
 * Public portfolio shell — the shared visual frame for every public route.
 * Background/text are set here once (cool "transcript paper" light / dark
 * research-canvas); pages stay transparent and only consume the documented
 * text/color tokens (see globals.css @theme).
 */
export default function PortfolioLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex min-h-screen flex-col bg-paper text-ink antialiased dark:bg-canvas dark:text-ink-soft">
      {/* Floating translucent header; content scrolls beneath it. */}
      <PortfolioNav />
      {/* pt-16 reserves the 64px floating header height. */}
      <main className="flex-1 pt-16">{children}</main>
      <Footer />
    </div>
  )
}
