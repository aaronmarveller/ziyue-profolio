// app/(portfolio)/layout.tsx
import { PortfolioNav } from '@/components/portfolio/Nav'
import { Footer } from '@/components/portfolio/Footer'

/**
 * Public portfolio shell — the shared visual frame for every public route.
 * Background/text are set here once; pages stay transparent and only
 * consume the documented text/color tokens (see globals.css @theme).
 */
export default function PortfolioLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex min-h-screen flex-col bg-white text-gray-900 antialiased dark:bg-[#0b0f14] dark:text-gray-200">
      {/* Floating translucent header; content scrolls beneath it. */}
      <PortfolioNav />
      {/* pt-16 reserves the 64px floating header height. */}
      <main className="flex-1 pt-16">{children}</main>
      <Footer />
    </div>
  )
}
