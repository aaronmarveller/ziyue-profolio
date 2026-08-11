// __tests__/portfolio/publications.test.tsx
import { render, screen } from '@testing-library/react'
import PublicationsPage from '@/app/(portfolio)/publications/page'
import { getPublications } from '@/lib/content'
import type { Publication } from '@/types/content'

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
  getPublications: jest.fn(),
}))

const mockGetPublications = getPublications as jest.MockedFunction<typeof getPublications>

const publicationFixture = (overrides: Partial<Publication> = {}): Publication => ({
  slug: 'pragmatic-competence-llms',
  title: 'Pragmatic Competence in LLM Interactions',
  journal: 'Journal of Applied Linguistics and Professional Practice',
  year: 2024,
  doi: '10.1558/jalpp.12345',
  pdf_url: '/files/papers/pragmatic-competence-llms.pdf',
  content:
    'This study examines how users deploy pragmatic strategies when interacting with large language models.',
  ...overrides,
})

describe('Publications page', () => {
  it('renders the page heading and each publication title, journal, year, and abstract', async () => {
    mockGetPublications.mockResolvedValue([
      publicationFixture(),
      publicationFixture({
        slug: 'second-paper',
        title: 'Second Paper on Interaction Design',
        journal: 'Another Journal',
        year: 2022,
        doi: '',
        pdf_url: '',
        content: 'A second abstract about conversational agents.',
      }),
    ])

    render(await PublicationsPage())

    expect(screen.getByRole('heading', { level: 1, name: 'Publications' })).toBeInTheDocument()
    expect(
      screen.getByText('Academic research at the intersection of applied linguistics and AI.')
    ).toBeInTheDocument()
    expect(
      screen.getByRole('heading', { level: 2, name: 'Pragmatic Competence in LLM Interactions' })
    ).toBeInTheDocument()
    expect(
      screen.getByRole('heading', { level: 2, name: 'Second Paper on Interaction Design' })
    ).toBeInTheDocument()
    expect(
      screen.getByText('Journal of Applied Linguistics and Professional Practice')
    ).toBeInTheDocument()
    expect(screen.getByText('Another Journal')).toBeInTheDocument()
    expect(screen.getByText('2024')).toBeInTheDocument()
    expect(screen.getByText('2022')).toBeInTheDocument()
    expect(
      screen.getByText(
        'This study examines how users deploy pragmatic strategies when interacting with large language models.'
      )
    ).toBeInTheDocument()
    expect(
      screen.getByText('A second abstract about conversational agents.')
    ).toBeInTheDocument()
  })

  it('links the DOI to the doi.org URL with the current external-link attributes when set', async () => {
    mockGetPublications.mockResolvedValue([publicationFixture()])

    render(await PublicationsPage())

    const doiLink = screen.getByRole('link', { name: 'DOI →' })
    expect(doiLink).toHaveAttribute('href', 'https://doi.org/10.1558/jalpp.12345')
    expect(doiLink).toHaveAttribute('target', '_blank')
    expect(doiLink).toHaveAttribute('rel', 'noopener noreferrer')
  })

  it('omits the DOI link when no DOI is set', async () => {
    mockGetPublications.mockResolvedValue([publicationFixture({ doi: '' })])

    render(await PublicationsPage())

    expect(screen.queryByRole('link', { name: 'DOI →' })).not.toBeInTheDocument()
  })

  it('hides the PDF link when the pdf_url points to a missing local file', async () => {
    mockGetPublications.mockResolvedValue([
      publicationFixture({ pdf_url: '/files/papers/pragmatic-competence-llms.pdf' }),
    ])

    render(await PublicationsPage())

    expect(screen.queryByRole('link', { name: 'PDF ↓' })).not.toBeInTheDocument()
  })

  it('shows the PDF link when the pdf_url is a usable absolute http(s) URL', async () => {
    mockGetPublications.mockResolvedValue([
      publicationFixture({ pdf_url: 'https://papers.example.org/pragmatic-competence.pdf' }),
    ])

    render(await PublicationsPage())

    const pdfLink = screen.getByRole('link', { name: 'PDF ↓' })
    expect(pdfLink).toHaveAttribute('href', 'https://papers.example.org/pragmatic-competence.pdf')
  })
})
