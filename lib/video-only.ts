// lib/video-only.ts
// Video-only mode decision logic — a pure function so the redirect rules are
// unit-testable without constructing NextRequest/NextResponse objects.
// "Video-only mode" per CONTEXT.md: every public route narrows to the single
// demo page; /admin and /api are unaffected; flipping the env var off restores
// the full portfolio with no code change.

/** The one demo page that video-only mode narrows the site down to. */
export const VIDEO_ONLY_REDIRECT_TARGET = '/video/ai-english-learning'

/**
 * Decide whether video-only mode should redirect `pathname`.
 *
 * Returns the redirect target when the request should be redirected, or
 * `null` when it should pass through untouched. `enabled` carries the mode's
 * on/off state so this stays free of `process.env` reads (proxy.ts supplies
 * it from the environment variable).
 *
 * Passthrough in both modes: the demo page itself, every `/admin/*` and
 * `/api/*` path, and anything that is not a public portfolio route.
 */
export function videoOnlyRedirect(
  pathname: string,
  enabled: boolean
): string | null {
  if (!enabled) return null

  // Never redirect the demo page or the routes content management depends on.
  if (
    pathname === VIDEO_ONLY_REDIRECT_TARGET ||
    pathname === '/admin' ||
    pathname.startsWith('/admin/') ||
    pathname === '/api' ||
    pathname.startsWith('/api/')
  ) {
    return null
  }

  const isPublicRoute =
    pathname === '/' ||
    pathname === '/projects' ||
    pathname.startsWith('/projects/') ||
    pathname === '/publications' ||
    pathname === '/contact' ||
    pathname === '/video'

  return isPublicRoute ? VIDEO_ONLY_REDIRECT_TARGET : null
}

/**
 * Whether video-only mode is on. `VIDEO_ONLY_MODE=true` turns it on; unset
 * or any other value leaves the full portfolio visible (the default).
 */
export function isVideoOnlyModeEnabled(): boolean {
  return process.env.VIDEO_ONLY_MODE === 'true'
}
