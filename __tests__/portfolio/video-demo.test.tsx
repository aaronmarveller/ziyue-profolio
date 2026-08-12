// __tests__/portfolio/video-demo.test.tsx
// Rendered test for the standalone /video/ai-english-learning demo page:
// a native <video> with controls (no autoplay/loop), fixed caption copy, and
// none of the shared portfolio nav/footer chrome.
import { render, screen } from '@testing-library/react'
import AiEnglishLearningDemoPage from '@/app/video/ai-english-learning/page'

describe('AiEnglishLearningDemoPage (/video/ai-english-learning)', () => {
  it('renders a native video pointing at the placeholder asset with controls, and no autoplay or loop', () => {
    const { container } = render(<AiEnglishLearningDemoPage />)
    const video = container.querySelector('video')

    expect(video).toBeInTheDocument()
    expect(video).toHaveAttribute('src', '/videos/ai-english-learning-demo.mp4')
    expect(video).toHaveAttribute('controls')
    expect(video).not.toHaveAttribute('autoplay')
    expect(video).not.toHaveAttribute('loop')
  })

  it('identifies the demo with a title and caption describing the AI English-learning app', () => {
    render(<AiEnglishLearningDemoPage />)
    expect(screen.getByRole('heading', { level: 1, name: 'AI English Learning App' })).toBeInTheDocument()
    expect(screen.getByText(/screen recording/i)).toBeInTheDocument()
    expect(screen.getByText(/demo of the AI English-learning app/i)).toBeInTheDocument()
  })

  it('renders none of the shared portfolio nav/footer links', () => {
    render(<AiEnglishLearningDemoPage />)
    expect(screen.queryByRole('link', { name: 'Research' })).not.toBeInTheDocument()
    expect(screen.queryByRole('link', { name: 'Publications' })).not.toBeInTheDocument()
    expect(screen.queryByRole('link', { name: 'Contact' })).not.toBeInTheDocument()
    expect(screen.queryByRole('link', { name: 'Ziyue Guo' })).not.toBeInTheDocument()
  })
})
