// __tests__/portfolio/contact.test.tsx
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import ContactPage from '@/app/(portfolio)/contact/page'
import { getAbout } from '@/lib/content'
import type { About } from '@/types/content'

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

jest.mock('@/lib/content', () => ({
  getAbout: jest.fn(),
}))

const mockGetAbout = getAbout as jest.MockedFunction<typeof getAbout>

const aboutFixture = (overrides: Partial<About> = {}): About => ({
  name: 'Ziyue Guo',
  title: 'AI UX Researcher',
  tagline: 'Bridging language, cognition, and human-AI interaction',
  email: 'your@email.com',
  cv_url: '/files/cv.pdf',
  content: 'I am a UX researcher specializing in human-AI interaction.',
  ...overrides,
})

const originalFetch = globalThis.fetch

afterEach(() => {
  globalThis.fetch = originalFetch
  jest.clearAllMocks()
})

async function fillAndSubmitForm() {
  const user = userEvent.setup()
  await user.type(screen.getByRole('textbox', { name: 'Name' }), 'Alice')
  await user.type(screen.getByRole('textbox', { name: 'Email' }), 'alice@example.com')
  await user.type(screen.getByRole('textbox', { name: 'Message' }), 'Hello there')
  await user.click(screen.getByRole('button', { name: 'Send Message' }))
  return user
}

describe('Contact page', () => {
  it('renders the page heading, intro, and form fields with accessible labels', async () => {
    mockGetAbout.mockResolvedValue(aboutFixture())

    render(await ContactPage())

    expect(screen.getByRole('heading', { level: 1, name: 'Get in Touch' })).toBeInTheDocument()
    expect(
      screen.getByText('Interested in collaborating or have questions about my research?')
    ).toBeInTheDocument()
    expect(screen.getByRole('textbox', { name: 'Name' })).toBeInTheDocument()
    expect(screen.getByRole('textbox', { name: 'Email' })).toBeInTheDocument()
    expect(screen.getByRole('textbox', { name: 'Message' })).toBeInTheDocument()
    expect(screen.getByRole('button', { name: 'Send Message' })).toBeInTheDocument()
  })

  it('does not render a mailto link for the placeholder email or a CV link for the missing CV file', async () => {
    mockGetAbout.mockResolvedValue(aboutFixture())

    render(await ContactPage())

    expect(screen.queryByRole('link', { name: /your@email\.com/ })).not.toBeInTheDocument()
    expect(screen.queryByRole('link', { name: /CV/ })).not.toBeInTheDocument()
    expect(document.querySelector('a[href^="mailto:"]')).toBeNull()
    expect(document.querySelector('a[href$=".pdf"]')).toBeNull()
  })

  it('shows email and CV actions when usable contact details exist', async () => {
    mockGetAbout.mockResolvedValue(
      aboutFixture({ email: 'research@example.com', cv_url: 'https://files.example.com/cv.pdf' })
    )

    render(await ContactPage())

    const emailLink = screen.getByRole('link', { name: 'research@example.com' })
    expect(emailLink).toHaveAttribute('href', 'mailto:research@example.com')

    const cvLink = screen.getByRole('link', { name: /Download CV/ })
    expect(cvLink).toHaveAttribute('href', 'https://files.example.com/cv.pdf')
  })

  it('disables the button with "Sending..." while the request is in flight and posts the form data', async () => {
    mockGetAbout.mockResolvedValue(aboutFixture())
    let resolveRequest: ((value: Response) => void) | undefined
    const pending = new Promise<Response>(resolve => {
      resolveRequest = resolve
    })
    const fetchMock = jest.fn(() => pending)
    globalThis.fetch = fetchMock as unknown as typeof fetch

    render(await ContactPage())

    await fillAndSubmitForm()

    const sendingButton = screen.getByRole('button', { name: 'Sending...' })
    expect(sendingButton).toBeDisabled()
    expect(sendingButton).toHaveAttribute('aria-busy', 'true')
    expect(fetchMock).toHaveBeenCalledWith(
      '/api/contact',
      expect.objectContaining({
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name: 'Alice', email: 'alice@example.com', message: 'Hello there' }),
      })
    )

    resolveRequest!({ ok: true, status: 200 } as Response)
    expect(await screen.findByText(/Message sent/)).toBeInTheDocument()
  })

  it('shows a success message when the request resolves ok', async () => {
    mockGetAbout.mockResolvedValue(aboutFixture())
    globalThis.fetch = jest.fn(() =>
      Promise.resolve({ ok: true, status: 200 } as Response)
    ) as unknown as typeof fetch

    render(await ContactPage())

    await fillAndSubmitForm()

    expect(await screen.findByText(/Message sent/)).toBeInTheDocument()
  })

  it('shows an error message when the request fails with a non-ok response', async () => {
    mockGetAbout.mockResolvedValue(aboutFixture())
    globalThis.fetch = jest.fn(() =>
      Promise.resolve({ ok: false, status: 500 } as Response)
    ) as unknown as typeof fetch

    render(await ContactPage())

    await fillAndSubmitForm()

    expect(await screen.findByText(/Something went wrong/)).toBeInTheDocument()
  })

  it('shows an error message when the request rejects', async () => {
    mockGetAbout.mockResolvedValue(aboutFixture())
    globalThis.fetch = jest.fn(() =>
      Promise.reject(new Error('network down'))
    ) as unknown as typeof fetch

    render(await ContactPage())

    await fillAndSubmitForm()

    expect(await screen.findByText(/Something went wrong/)).toBeInTheDocument()
  })
})
