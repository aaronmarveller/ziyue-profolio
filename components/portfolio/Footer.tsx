import Link from 'next/link'

/** Footer navigation uses the same research vocabulary as the header. */
const links = [
  { href: '/projects', label: 'Research' },
  { href: '/publications', label: 'Publications' },
  { href: '/contact', label: 'Contact' },
]

export function Footer() {
  return (
    <footer className="mt-24 border-t border-black/[0.06] dark:border-white/10">
      <div className="page-container py-12">
        <nav aria-label="Footer">
          <ul className="flex flex-wrap items-center gap-x-6 gap-y-3 font-mono-ui text-[0.8125rem] tracking-[0.06em]">
            {links.map(({ href, label }) => (
              <li key={href}>
                <Link
                  href={href}
                  className="rounded-md px-1 py-0.5 text-gray-500 transition-colors duration-150 hover:text-gray-900 dark:text-gray-400 dark:hover:text-gray-100 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent-500 dark:focus-visible:ring-accent-400 focus-visible:ring-offset-2 focus-visible:ring-offset-white dark:focus-visible:ring-offset-gray-900"
                >
                  {label}
                </Link>
              </li>
            ))}
          </ul>
        </nav>
        <div className="mt-8 flex flex-wrap items-center justify-between gap-x-6 gap-y-3">
          <p className="text-sm text-gray-400 dark:text-gray-500">
            © {new Date().getFullYear()} Ziyue Guo
          </p>
          <p className="label-mono flex items-center gap-2 text-gray-400 dark:text-gray-500">
            <span
              aria-hidden="true"
              className="rec-dot inline-block h-1.5 w-1.5 rounded-full bg-voice-500 dark:bg-voice-400"
            />
            Bridging language, cognition, and human-AI interaction
          </p>
        </div>
      </div>
    </footer>
  )
}
