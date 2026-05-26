// app/(portfolio)/layout.tsx
import { Nav } from '@/components/portfolio/Nav'

export default function PortfolioLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen bg-white text-gray-900">
      <Nav />
      <main>{children}</main>
      <footer className="border-t border-gray-100 mt-24">
        <div className="max-w-5xl mx-auto px-6 py-8 text-sm text-gray-400">
          © {new Date().getFullYear()} Ziyue Guo
        </div>
      </footer>
    </div>
  )
}
