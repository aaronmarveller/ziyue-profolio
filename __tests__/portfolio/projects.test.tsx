// __tests__/portfolio/projects.test.tsx
import { render, screen } from '@testing-library/react'
import { getProjects } from '@/lib/content'
import ProjectsPage from '@/app/(portfolio)/projects/page'
import type { Project } from '@/types/content'

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
  getProjects: jest.fn(),
}))

const mockGetProjects = getProjects as jest.MockedFunction<typeof getProjects>

const projects: Project[] = [
  {
    slug: 'ai-voice-assistant-ux',
    title: 'Voice Assistant Usability',
    date: '2024-06',
    tags: ['voice UX', 'NLP'],
    summary: 'Evaluated accent variation across dialect groups.',
    featured: true,
    content: '## Background\nBody',
  },
  {
    slug: 'conversational-design-system',
    title: 'Conversational Design System',
    date: '2023-11',
    tags: ['HCI', 'design systems'],
    summary: 'A second project summary about design systems.',
    featured: false,
    content: '## Methods\nBody',
  },
]

describe('ProjectsPage (research listing)', () => {
  beforeEach(() => {
    mockGetProjects.mockReset()
  })

  it('renders the Research page heading', async () => {
    mockGetProjects.mockResolvedValue([])
    render(await ProjectsPage())
    expect(screen.getByRole('heading', { name: 'Research' })).toBeInTheDocument()
  })

  it('renders every mocked project with title, summary, date, and tags', async () => {
    mockGetProjects.mockResolvedValue(projects)
    render(await ProjectsPage())

    for (const project of projects) {
      expect(screen.getByRole('heading', { name: project.title })).toBeInTheDocument()
      expect(screen.getByText(project.summary)).toBeInTheDocument()
      expect(screen.getByText(project.date)).toBeInTheDocument()
      for (const tag of project.tags) {
        expect(screen.getByText(tag)).toBeInTheDocument()
      }
    }
  })

  it('renders one card per mocked project', async () => {
    mockGetProjects.mockResolvedValue(projects)
    render(await ProjectsPage())

    const cardLinks = screen.getAllByRole('link')
    expect(cardLinks).toHaveLength(projects.length)
  })

  it('wraps each card in a single link to its case study route', async () => {
    mockGetProjects.mockResolvedValue(projects)
    render(await ProjectsPage())

    for (const project of projects) {
      expect(screen.getByRole('link', { name: new RegExp(project.title) })).toHaveAttribute(
        'href',
        `/projects/${project.slug}`
      )
    }
  })
})
