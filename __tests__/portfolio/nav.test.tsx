// __tests__/portfolio/nav.test.tsx
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { Nav } from '@/components/portfolio/Nav'
import { MobileMenu } from '@/components/portfolio/MobileMenu'
import type { NavLink } from '@/components/portfolio/Nav'

// next/link renders an anchor and expects an app-router context on click.
// Mock it to a plain <a> so navigation behavior can be tested in isolation.
jest.mock('next/link', () => {
  const React = jest.requireActual('react') as typeof import('react')
  type LinkProps = { href: string; children?: React.ReactNode }
  const MockLink = (props: LinkProps & Record<string, unknown>) => {
    const { href, children, onClick, ...rest } = props
    const handleClick = (event: React.MouseEvent<HTMLAnchorElement>) => {
      // Suppress jsdom's "navigation not implemented" noise; the real
      // next/link prevents default and navigates client-side.
      event.preventDefault()
      if (typeof onClick === 'function') onClick(event)
    }
    return React.createElement(
      'a',
      { href, onClick: handleClick, ...rest } as React.HTMLAttributes<HTMLAnchorElement>,
      children
    )
  }
  MockLink.displayName = 'MockLink'
  return { __esModule: true, default: MockLink }
})

const links: NavLink[] = [
  { href: '/projects', label: 'Research' },
  { href: '/publications', label: 'Publications' },
  { href: '/contact', label: 'Contact' },
]

describe('Nav (public header)', () => {
  it('renders the brand link and the research-vocabulary links with the right destinations', () => {
    render(<Nav currentPath="/" />)
    expect(screen.getByRole('link', { name: 'Ziyue Guo' })).toHaveAttribute('href', '/')
    expect(screen.getByRole('link', { name: 'Research' })).toHaveAttribute('href', '/projects')
    expect(screen.getByRole('link', { name: 'Publications' })).toHaveAttribute('href', '/publications')
    expect(screen.getByRole('link', { name: 'Contact' })).toHaveAttribute('href', '/contact')
  })

  it('does not use a generic "Home" label', () => {
    render(<Nav currentPath="/" />)
    expect(screen.queryByRole('link', { name: 'Home' })).not.toBeInTheDocument()
  })

  it('marks the current section with aria-current="page"', () => {
    const { rerender } = render(<Nav currentPath="/projects" />)
    expect(screen.getByRole('link', { name: 'Research' })).toHaveAttribute('aria-current', 'page')
    expect(screen.getByRole('link', { name: 'Publications' })).not.toHaveAttribute('aria-current')
    expect(screen.getByRole('link', { name: 'Contact' })).not.toHaveAttribute('aria-current')

    // Detail routes (e.g. /projects/[slug]) keep their section current.
    rerender(<Nav currentPath="/projects/a-project-slug" />)
    expect(screen.getByRole('link', { name: 'Research' })).toHaveAttribute('aria-current', 'page')

    rerender(<Nav currentPath="/publications" />)
    expect(screen.getByRole('link', { name: 'Research' })).not.toHaveAttribute('aria-current')
    expect(screen.getByRole('link', { name: 'Publications' })).toHaveAttribute('aria-current', 'page')
  })

  it('marks the brand link as current on the home route', () => {
    render(<Nav currentPath="/" />)
    expect(screen.getByRole('link', { name: 'Ziyue Guo' })).toHaveAttribute('aria-current', 'page')
  })

  it('keeps every link reachable by keyboard in document order', async () => {
    const user = userEvent.setup()
    render(<Nav currentPath="/" />)
    await user.tab()
    expect(screen.getByRole('link', { name: 'Ziyue Guo' })).toHaveFocus()
    await user.tab()
    expect(screen.getByRole('link', { name: 'Research' })).toHaveFocus()
    await user.tab()
    expect(screen.getByRole('link', { name: 'Publications' })).toHaveFocus()
  })
})

describe('MobileMenu (small-screen disclosure)', () => {
  it('starts closed: toggle is not expanded and no menu links are shown', () => {
    render(<MobileMenu links={links} currentPath="/projects" />)
    const toggle = screen.getByRole('button', { name: 'Open menu' })
    expect(toggle).toHaveAttribute('aria-expanded', 'false')
    expect(toggle).toHaveAttribute('aria-controls')
    expect(screen.queryByRole('link', { name: 'Research' })).not.toBeInTheDocument()
    expect(screen.queryByRole('link', { name: 'Publications' })).not.toBeInTheDocument()
    expect(screen.queryByRole('link', { name: 'Contact' })).not.toBeInTheDocument()
  })

  it('opens on activation and shows the links with their destinations and current marker', async () => {
    const user = userEvent.setup()
    render(<MobileMenu links={links} currentPath="/publications" />)
    const toggle = screen.getByRole('button', { name: 'Open menu' })
    await user.click(toggle)
    expect(toggle).toHaveAttribute('aria-expanded', 'true')
    expect(screen.getByRole('link', { name: 'Research' })).toHaveAttribute('href', '/projects')
    expect(screen.getByRole('link', { name: 'Publications' })).toHaveAttribute('href', '/publications')
    expect(screen.getByRole('link', { name: 'Contact' })).toHaveAttribute('href', '/contact')
    expect(screen.getByRole('link', { name: 'Publications' })).toHaveAttribute('aria-current', 'page')
  })

  it('closes with Escape and returns focus to the toggle button', async () => {
    const user = userEvent.setup()
    render(<MobileMenu links={links} currentPath="/" />)
    const toggle = screen.getByRole('button', { name: 'Open menu' })
    await user.click(toggle)
    expect(toggle).toHaveAttribute('aria-expanded', 'true')

    const researchLink = screen.getByRole('link', { name: 'Research' })
    researchLink.focus()
    await user.keyboard('{Escape}')

    expect(toggle).toHaveAttribute('aria-expanded', 'false')
    expect(screen.queryByRole('link', { name: 'Research' })).not.toBeInTheDocument()
    expect(screen.queryByRole('link', { name: 'Contact' })).not.toBeInTheDocument()
    expect(toggle).toHaveFocus()
  })

  it('closes when a link is activated and returns focus to the toggle', async () => {
    const user = userEvent.setup()
    render(<MobileMenu links={links} currentPath="/" />)
    const toggle = screen.getByRole('button', { name: 'Open menu' })
    await user.click(toggle)
    await user.click(screen.getByRole('link', { name: 'Research' }))
    expect(toggle).toHaveAttribute('aria-expanded', 'false')
    expect(screen.queryByRole('link', { name: 'Research' })).not.toBeInTheDocument()
    expect(toggle).toHaveFocus()
  })
})
