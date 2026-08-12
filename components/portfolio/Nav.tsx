'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { MobileMenu } from './MobileMenu'

export type NavLink = { href: string; label: string }

/** Public navigation vocabulary — research terminology, not generic labels. */
export const navLinks: NavLink[] = [
  { href: '/projects', label: 'Research' },
  { href: '/publications', label: 'Publications' },
  { href: '/contact', label: 'Contact' },
]

function isCurrent(href: string, pathname: string): boolean {
  if (href === '/') return pathname === '/'
  // Detail routes (e.g. /projects/[slug]) keep their section current.
  return pathname === href || pathname.startsWith(`${href}/`)
}

const linkBase =
  'nav-link inline-flex items-center rounded-md px-3 py-1.5 font-mono-ui text-[0.8125rem] uppercase tracking-[0.08em] transition-colors duration-150 ' +
  'active:bg-gray-900/5 dark:active:bg-white/10 ' +
  'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent-500 ' +
  'dark:focus-visible:ring-accent-400 focus-visible:ring-offset-2 ' +
  'focus-visible:ring-offset-white dark:focus-visible:ring-offset-gray-900'

const linkIdle =
  'text-gray-500 hover:text-gray-900 dark:text-gray-400 dark:hover:text-gray-100'

const linkCurrent =
  'text-accent-700 bg-accent-500/10 dark:text-accent-300 dark:bg-accent-400/15'

const brandRing =
  'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent-500 ' +
  'dark:focus-visible:ring-accent-400 focus-visible:ring-offset-2 ' +
  'focus-visible:ring-offset-white dark:focus-visible:ring-offset-gray-900'

/**
 * Nav — the floating translucent public header.
 *
 * Presentational and testable: the current route is passed in as
 * `currentPath`. `PortfolioNav` (exported below) supplies it from the
 * router via `usePathname`; tests render `Nav` directly with an explicit
 * `currentPath` and never touch the router.
 */
export function Nav({ currentPath }: { currentPath: string }) {
  return (
    <header className="glass-surface fixed inset-x-0 top-0 z-40 border-b border-black/[0.06] dark:border-white/10">
      <div className="page-container">
        <div className="flex h-16 items-center justify-between">
          {/* Serif wordmark with a pulsing "listening" dot (the site, like the
              assistant in the hero, is always open to a conversation). */}
          <Link
            href="/"
            aria-current={currentPath === '/' ? 'page' : undefined}
            className={`${brandRing} -mx-1 flex items-center gap-2 rounded-md px-1 font-display text-[17px] font-semibold tracking-tight text-gray-900 hover:text-gray-600 dark:text-gray-100 dark:hover:text-gray-300`}
          >
            <span
              aria-hidden="true"
              className="rec-dot inline-block h-2.5 w-2.5 rounded-full bg-voice-500 dark:bg-voice-400"
            />
            Ziyue Guo
          </Link>

          {/* Desktop inline links — hidden below `md`, shown on md+. */}
          <ul className="hidden items-center gap-1 md:flex">
            {navLinks.map(({ href, label }) => {
              const current = isCurrent(href, currentPath)
              return (
                <li key={href}>
                  <Link
                    href={href}
                    aria-current={current ? 'page' : undefined}
                    className={`${linkBase} ${current ? linkCurrent : linkIdle}`}
                  >
                    {label}
                  </Link>
                </li>
              )
            })}
          </ul>

          {/* Small-screen disclosure menu — hidden on md+. */}
          <MobileMenu links={navLinks} currentPath={currentPath} />
        </div>
      </div>
    </header>
  )
}

/** Client wrapper that reads the current route and renders `<Nav>`. */
export function PortfolioNav() {
  const pathname = usePathname()
  return <Nav currentPath={pathname} />
}
