// __tests__/portfolio/home.test.tsx
// Home-page journey tests. External behavior only: what is rendered and where
// it leads. Content seams are mocked at @/lib/content; next/link is replaced
// with a plain anchor (copied from nav.test.tsx); the server-only MDXRemote is
// replaced with a simple element.
import { render, screen } from '@testing-library/react'
import HomePage from '@/app/(portfolio)/page'
import type { About, Project, Publication } from '@/types/content'

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

// The Hero renders the markdown bio through the server-only MDXRemote.
// Replace it with a plain element so the rendered test stays jsdom-safe.
jest.mock('next-mdx-remote/rsc', () => {
  const React = jest.requireActual('react') as typeof import('react')
  return {
    MDXRemote: ({ source }: { source: string }) => React.createElement('p', null, source),
  }
})

jest.mock('@/lib/content', () => ({
  getAbout: jest.fn(),
  getProjects: jest.fn(),
  getPublications: jest.fn(),
}))

import { getAbout, getProjects, getPublications } from '@/lib/content'

const mockedGetAbout = jest.mocked(getAbout)
const mockedGetProjects = jest.mocked(getProjects)
const mockedGetPublications = jest.mocked(getPublications)

// Fixtures mirror types/content.ts. The About uses the known placeholder email
// and a cv_url with no backing file, so the page must withhold both actions.
const aboutFixture: About = {
  name: 'Ziyue Guo',
  title: 'AI UX Researcher',
  tagline: 'Bridging language, cognition, and human-AI interaction',
  email: 'your@email.com',
  cv_url: '/files/cv.pdf',
  content: 'I am a UX researcher specializing in human-AI interaction.',
}

const projectsFixture: Project[] = [
  {
    slug: 'ai-voice-assistant-ux',
    title: 'Voice Assistant Usability for Non-Native English Speakers',
    date: '2024-06',
    tags: ['voice UX', 'accessibility'],
    summary: 'Evaluated accent variation across five dialect groups.',
    featured: true,
    content: 'body',
  },
  {
    slug: 'a-non-featured-project',
    title: 'A Non-Featured Project',
    date: '2023-01',
    tags: ['NLP'],
    summary: 'This project is not featured.',
    featured: false,
    content: 'body',
  },
]

const publicationsFixture: Publication[] = [
  {
    slug: 'pragmatic-competence-llms',
    title: 'Pragmatic Competence in LLM Interactions',
    journal: 'Journal of Applied Linguistics and Professional Practice',
    year: 2024,
    doi: '10.1558/jalpp.12345',
    pdf_url: '/files/papers/pragmatic-competence-llms.pdf',
    content: 'This study examines pragmatic strategies in LLM interactions.',
  },
]

describe('Home page', () => {
  beforeEach(() => {
    mockedGetAbout.mockResolvedValue(aboutFixture)
    mockedGetProjects.mockResolvedValue(projectsFixture)
    mockedGetPublications.mockResolvedValue(publicationsFixture)
  })

  it('introduces the researcher with eyebrow, name, tagline, and bio', async () => {
    render(await HomePage())
    expect(screen.getByText('AI UX Researcher')).toBeInTheDocument()
    expect(screen.getByRole('heading', { level: 1, name: 'Ziyue Guo' })).toBeInTheDocument()
    expect(screen.getByText('Bridging language, cognition, and human-AI interaction')).toBeInTheDocument()
    expect(screen.getByText('I am a UX researcher specializing in human-AI interaction.')).toBeInTheDocument()
  })

  it('shows only featured projects in the featured research section', async () => {
    render(await HomePage())
    expect(screen.getByRole('heading', { name: 'Featured Research' })).toBeInTheDocument()
    expect(screen.getByText('Voice Assistant Usability for Non-Native English Speakers')).toBeInTheDocument()
    expect(screen.queryByText('A Non-Featured Project')).not.toBeInTheDocument()
  })

  it('renders each featured card as a single link to its project destination', async () => {
    render(await HomePage())
    const links = screen.getAllByRole('link', {
      name: /Voice Assistant Usability for Non-Native English Speakers/,
    })
    expect(links).toHaveLength(1)
    expect(links[0]).toHaveAttribute('href', '/projects/ai-voice-assistant-ux')
  })

  it('offers a "View all research" link to /projects', async () => {
    render(await HomePage())
    expect(screen.getByRole('link', { name: 'View all research' })).toHaveAttribute('href', '/projects')
  })

  it('lists selected publications with journal · year and an onward link', async () => {
    render(await HomePage())
    expect(screen.getByRole('heading', { name: 'Selected Publications' })).toBeInTheDocument()

    const entry = screen.getByText('Pragmatic Competence in LLM Interactions').closest('li')
    expect(entry).toHaveTextContent('Journal of Applied Linguistics and Professional Practice · 2024')

    expect(screen.getByRole('link', { name: 'View all publications' })).toHaveAttribute('href', '/publications')
  })

  it('points a publication at its existing DOI destination', async () => {
    render(await HomePage())
    expect(screen.getByRole('link', { name: 'DOI' })).toHaveAttribute(
      'href',
      'https://doi.org/10.1558/jalpp.12345'
    )
  })

  it('closes with a collaboration invitation that links to /contact', async () => {
    render(await HomePage())
    expect(screen.getByRole('heading', { name: 'Open to collaboration' })).toBeInTheDocument()
    expect(screen.getByRole('link', { name: 'Get in touch' })).toHaveAttribute('href', '/contact')
  })

  it('withholds the unusable Download CV action', async () => {
    render(await HomePage())
    expect(screen.queryByRole('link', { name: /Download CV/i })).not.toBeInTheDocument()
    expect(screen.queryByRole('button', { name: /Download CV/i })).not.toBeInTheDocument()
  })

  it('shows the Download CV action only when the file is usable', async () => {
    mockedGetAbout.mockResolvedValue({
      ...aboutFixture,
      cv_url: 'https://example.com/cv.pdf',
    })
    render(await HomePage())
    expect(screen.getByRole('link', { name: 'Download CV' })).toHaveAttribute(
      'href',
      'https://example.com/cv.pdf'
    )
  })

  it('does not display the placeholder email', async () => {
    render(await HomePage())
    expect(screen.queryByText('your@email.com')).not.toBeInTheDocument()
  })
})
