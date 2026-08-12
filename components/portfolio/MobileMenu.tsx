'use client'

import { useId, useRef, useState } from 'react'
import type { KeyboardEvent } from 'react'
import Link from 'next/link'
import type { NavLink } from './Nav'

function isCurrent(href: string, pathname: string): boolean {
  if (href === '/') return pathname === '/'
  return pathname === href || pathname.startsWith(`${href}/`)
}

/**
 * MobileMenu — small-screen navigation as an accessible disclosure widget.
 *
 * - Visibility is pure CSS (`md:hidden` wrapper hides it on desktop; the
 *   header's inline links use `hidden md:flex`). No matchMedia/JS detection.
 * - The disclosure button exposes `aria-expanded` + `aria-controls`, and the
 *   icon switches between a hamburger and a close glyph so the open/closed
 *   state is visually obvious.
 * - Keyboard: Enter/Space activate the native button; Escape closes and
 *   returns focus to the toggle; Tab moves through the panel links (links are
 *   only in the DOM while open, so they cannot be reached when closed).
 * - Focus stays on the toggle when opening (ARIA disclosure pattern) and is
 *   returned to the toggle when the menu closes (Escape or link activation).
 * - Activating a link closes the menu; entry and exit use the same vertical
 *   fade/slide path from the toggle (mirrored path, apple-design §7).
 */
export function MobileMenu({
  links,
  currentPath,
}: {
  links: NavLink[]
  currentPath: string
}) {
  const [open, setOpen] = useState(false)
  const buttonRef = useRef<HTMLButtonElement>(null)
  const panelId = useId()

  const closeAndReturnFocus = () => {
    setOpen(false)
    buttonRef.current?.focus()
  }

  const handleToggle = () => {
    if (open) closeAndReturnFocus()
    else setOpen(true)
  }

  // Escape from anywhere inside the widget closes and returns focus.
  const handleKeyDown = (event: KeyboardEvent<HTMLDivElement>) => {
    if (event.key === 'Escape' && open) {
      event.preventDefault()
      closeAndReturnFocus()
    }
  }

  const focusRing =
    'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent-500 dark:focus-visible:ring-accent-400 focus-visible:ring-offset-2 focus-visible:ring-offset-white dark:focus-visible:ring-offset-gray-900'

  return (
    <div className="relative md:hidden" onKeyDown={handleKeyDown}>
      <button
        ref={buttonRef}
        type="button"
        aria-expanded={open}
        aria-controls={panelId}
        onClick={handleToggle}
        className={`inline-flex h-10 w-10 items-center justify-center rounded-md text-gray-700 transition duration-150 hover:bg-black/[0.04] active:scale-[0.97] active:bg-black/[0.06] dark:text-gray-200 dark:hover:bg-white/10 dark:active:bg-white/15 ${focusRing}`}
      >
        <span className="sr-only">{open ? 'Close menu' : 'Open menu'}</span>
        {open ? (
          <svg
            aria-hidden="true"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            className="h-5 w-5"
          >
            <path d="M6 6l12 12M18 6L6 18" />
          </svg>
        ) : (
          <svg
            aria-hidden="true"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            className="h-5 w-5"
          >
            <path d="M4 7h16M4 12h16M4 17h16" />
          </svg>
        )}
      </button>

      <div
        id={panelId}
        className={`glass-surface absolute right-0 top-full mt-2 w-72 max-w-[calc(100vw-3rem)] origin-top-right overflow-hidden rounded-2xl border border-black/[0.06] shadow-xl shadow-gray-900/10 transition duration-200 ease-out dark:border-white/10 dark:shadow-black/40 ${
          open
            ? 'translate-y-0 opacity-100'
            : 'pointer-events-none -translate-y-2 opacity-0'
        }`}
      >
        {open && (
          <ul className="p-2">
            {links.map(({ href, label }) => {
              const current = isCurrent(href, currentPath)
              return (
                <li key={href}>
                  <Link
                    href={href}
                    aria-current={current ? 'page' : undefined}
                    onClick={closeAndReturnFocus}
                    className={`flex items-center rounded-lg px-4 py-3 font-mono-ui text-[0.875rem] uppercase tracking-[0.08em] transition-colors duration-150 active:bg-gray-900/5 dark:active:bg-white/10 ${focusRing} ${
                      current
                        ? 'bg-accent-500/10 text-accent-700 dark:bg-accent-400/15 dark:text-accent-300'
                        : 'text-gray-700 hover:text-gray-900 dark:text-gray-200 dark:hover:text-white'
                    }`}
                  >
                    {label}
                  </Link>
                </li>
              )
            })}
          </ul>
        )}
      </div>
    </div>
  )
}
