// __tests__/portfolio/project-detail.test.tsx
import { render, screen } from '@testing-library/react'
import { getProject } from '@/lib/content'
import ProjectDetailPage from '@/app/(portfolio)/projects/[slug]/page'
import { notFound } from 'next/navigation'
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
  getProject: jest.fn(),
  getProjects: jest.fn(),
}))

// Render markdown through the same seam the page uses, but as a simple
// element so the test stays fast and deterministic in jsdom.
jest.mock('next-mdx-remote/rsc', () => ({
  MDXRemote: ({ source }: { source: string }) => (
    <div data-testid="mdx-body">{source}</div>
  ),
}))

jest.mock('next/navigation', () => ({
  notFound: jest.fn(() => {
    const error = new Error('NEXT_NOT_FOUND') as Error & { digest?: string }
    error.digest = 'NEXT_NOT_FOUND'
    throw error
  }),
}))

const mockGetProject = getProject as jest.MockedFunction<typeof getProject>
const mockNotFound = notFound as jest.MockedFunction<typeof notFound>

const project: Project = {
  slug: 'ai-voice-assistant-ux',
  title: 'Voice Assistant Usability',
  date: '2024-06',
  tags: ['voice UX', 'NLP'],
  summary: 'Evaluated accent variation across dialect groups.',
  featured: true,
  content: '## Background\nVoice assistants fail non-native speakers.',
}

describe('ProjectDetailPage (case study)', () => {
  beforeEach(() => {
    mockGetProject.mockReset()
    mockNotFound.mockClear()
  })

  it('awaits params and renders the case study instead of the not-found page', async () => {
    mockGetProject.mockResolvedValue(project)

    // params is a Promise in Next 16 — the page must await it.
    render(await ProjectDetailPage({ params: Promise.resolve({ slug: 'ai-voice-assistant-ux' }) }))

    expect(screen.getByRole('heading', { name: project.title })).toBeInTheDocument()
    expect(screen.getByText(project.date)).toBeInTheDocument()
    for (const tag of project.tags) {
      expect(screen.getByText(tag)).toBeInTheDocument()
    }
    expect(screen.getByTestId('mdx-body')).toHaveTextContent('## Background')
    expect(screen.queryByText(/This page could not be found/i)).not.toBeInTheDocument()
    expect(mockNotFound).not.toHaveBeenCalled()
  })

  it('calls notFound() when the project does not exist', async () => {
    mockGetProject.mockResolvedValue(null)

    await expect(
      ProjectDetailPage({ params: Promise.resolve({ slug: 'missing-project' }) })
    ).rejects.toThrow('NEXT_NOT_FOUND')
    expect(mockNotFound).toHaveBeenCalledTimes(1)
  })

  it('links back to the research listing', async () => {
    mockGetProject.mockResolvedValue(project)
    render(await ProjectDetailPage({ params: Promise.resolve({ slug: 'ai-voice-assistant-ux' }) }))

    expect(screen.getByRole('link', { name: /back to research/i })).toHaveAttribute(
      'href',
      '/projects'
    )
  })
})
