/**
 * @jest-environment node
 */
// __tests__/lib/video-only.test.ts
import {
  videoOnlyRedirect,
  isVideoOnlyModeEnabled,
  VIDEO_ONLY_REDIRECT_TARGET,
} from '@/lib/video-only'

// Every public route that video-only mode narrows to the demo page.
const redirectSources = [
  '/',
  '/projects',
  '/projects/ai-voice-assistant-ux',
  '/publications',
  '/contact',
  '/video',
]

// Routes that must never be redirected, in either mode.
const passthroughs = [
  '/video/ai-english-learning',
  '/admin',
  '/admin/login',
  '/admin/dashboard/about',
  '/api',
  '/api/content',
]

describe('videoOnlyRedirect', () => {
  describe('when the mode is on', () => {
    it.each(redirectSources)('redirects %s to the demo page', pathname => {
      expect(videoOnlyRedirect(pathname, true)).toBe(VIDEO_ONLY_REDIRECT_TARGET)
    })

    it.each(passthroughs)('passes %s through untouched', pathname => {
      expect(videoOnlyRedirect(pathname, true)).toBeNull()
    })

    it('leaves unrelated paths alone', () => {
      expect(videoOnlyRedirect('/nonexistent-page', true)).toBeNull()
    })
  })

  describe('when the mode is off', () => {
    it.each(redirectSources)('leaves %s alone', pathname => {
      expect(videoOnlyRedirect(pathname, false)).toBeNull()
    })

    it.each(passthroughs)('passes %s through untouched', pathname => {
      expect(videoOnlyRedirect(pathname, false)).toBeNull()
    })
  })
})

describe('isVideoOnlyModeEnabled', () => {
  const original = process.env.VIDEO_ONLY_MODE

  afterEach(() => {
    if (original === undefined) {
      delete process.env.VIDEO_ONLY_MODE
    } else {
      process.env.VIDEO_ONLY_MODE = original
    }
  })

  it('is on only for the exact value `true`', () => {
    process.env.VIDEO_ONLY_MODE = 'true'
    expect(isVideoOnlyModeEnabled()).toBe(true)

    process.env.VIDEO_ONLY_MODE = '1'
    expect(isVideoOnlyModeEnabled()).toBe(false)

    process.env.VIDEO_ONLY_MODE = 'TRUE'
    expect(isVideoOnlyModeEnabled()).toBe(false)

    delete process.env.VIDEO_ONLY_MODE
    expect(isVideoOnlyModeEnabled()).toBe(false)
  })
})
