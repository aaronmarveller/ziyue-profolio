// components/admin/AdminSidebar.tsx
'use client'
import Link from 'next/link'
import { usePathname, useRouter } from 'next/navigation'

const navItems = [
  { href: '/admin/dashboard/about', label: 'About & Skills' },
  { href: '/admin/dashboard/projects', label: 'Projects' },
  { href: '/admin/dashboard/publications', label: 'Publications' },
]

export function AdminSidebar() {
  const pathname = usePathname()
  const router = useRouter()

  async function handleLogout() {
    await fetch('/api/auth/logout', { method: 'POST' })
    router.push('/admin/login')
  }

  return (
    <aside className="w-52 shrink-0 border-r border-gray-100 min-h-screen pt-8 px-4 flex flex-col">
      <p className="text-xs font-semibold text-gray-400 uppercase tracking-wide mb-6 px-2">Admin</p>
      <nav className="flex-1 space-y-1">
        {navItems.map(({ href, label }) => (
          <Link
            key={href}
            href={href}
            className={`block px-3 py-2 rounded-lg text-sm transition-colors ${
              pathname.startsWith(href)
                ? 'bg-indigo-50 text-indigo-700 font-medium'
                : 'text-gray-600 hover:bg-gray-50'
            }`}
          >
            {label}
          </Link>
        ))}
      </nav>
      <button
        onClick={handleLogout}
        className="mb-6 px-3 py-2 text-sm text-gray-400 hover:text-gray-700 text-left"
      >
        Sign out
      </button>
    </aside>
  )
}
