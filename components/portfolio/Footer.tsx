import Link from 'next/link'

/** Footer navigation uses the same research vocabulary as the header. */
const links = [
  { href: '/projects', label: 'Research' },
  { href: '/publications', label: 'Publications' },
  { href: '/contact', label: 'Contact' },
]

export function Footer() {
  return (
    <footer className="mt-24 border-t border-gray-100 dark:border-gray-800/80">
      <div className="page-container py-12">
        <nav aria-label="Footer">
          <ul className="flex flex-wrap items-center gap-x-6 gap-y-3 text-sm">
            {links.map(({ href, label }) => (
              <li key={href}>
                <Link
                  href={href}
                  className="rounded-md px-1 py-0.5 font-medium text-gray-500 transition-colors duration-150 hover:text-gray-900 dark:text-gray-400 dark:hover:text-gray-100 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent-500 dark:focus-visible:ring-accent-400 focus-visible:ring-offset-2 focus-visible:ring-offset-white dark:focus-visible:ring-offset-gray-900"
                >
                  {label}
                </Link>
              </li>
            ))}
          </ul>
        </nav>
        <p className="mt-8 text-sm text-gray-400 dark:text-gray-500">
          © {new Date().getFullYear()} Ziyue Guo
        </p>
      </div>
    </footer>
  )
}
