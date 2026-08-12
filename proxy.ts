// proxy.ts
// Request gateway — the project's Next.js version deprecated the
// `middleware` file convention in favor of `proxy` (see
// node_modules/next/dist/docs/01-app/03-api-reference/03-file-conventions/proxy.md).
// Keeps the /admin session-cookie check, and adds the video-only-mode gate
// (every public route narrows to the demo page when VIDEO_ONLY_MODE=true).
import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'
import { verifyToken, COOKIE_NAME } from '@/lib/auth'
import {
  videoOnlyRedirect,
  isVideoOnlyModeEnabled,
} from '@/lib/video-only'

/** Admin session gate — behavior carried over unchanged from middleware.ts. */
async function adminGate(request: NextRequest) {
  const { pathname } = request.nextUrl

  // Allow login page through
  if (pathname === '/admin/login') return NextResponse.next()

  const token = request.cookies.get(COOKIE_NAME)?.value
  if (!token) {
    return NextResponse.redirect(new URL('/admin/login', request.url))
  }

  try {
    await verifyToken(token)
    return NextResponse.next()
  } catch {
    const res = NextResponse.redirect(new URL('/admin/login', request.url))
    res.cookies.set(COOKIE_NAME, '', { maxAge: 0 })
    return res
  }
}

export async function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl

  // Video-only mode: public routes redirect to the demo page, /admin and
  // /api pass through untouched so content management keeps working.
  const target = videoOnlyRedirect(pathname, isVideoOnlyModeEnabled())
  if (target) {
    return NextResponse.redirect(new URL(target, request.url))
  }

  // Everything except /admin passes through; admin keeps its session gate.
  // The predicate mirrors the video-only passthrough set (videoOnlyRedirect).
  if (pathname !== '/admin' && !pathname.startsWith('/admin/')) {
    return NextResponse.next()
  }
  return adminGate(request)
}

export const config = {
  matcher: [
    // All routes except API routes and framework/static paths — the admin
    // gate and the video-only gate both live in this one gateway file.
    '/((?!api|_next/static|_next/image|favicon.ico|sitemap.xml|robots.txt).*)',
  ],
}
