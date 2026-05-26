// middleware.ts
import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'
import { jwtVerify } from 'jose'

const secret = () => new TextEncoder().encode(process.env.JWT_SECRET!)

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl

  // Allow login page through
  if (pathname === '/admin/login') return NextResponse.next()

  const token = request.cookies.get('admin-session')?.value
  if (!token) {
    return NextResponse.redirect(new URL('/admin/login', request.url))
  }

  try {
    await jwtVerify(token, secret())
    return NextResponse.next()
  } catch {
    const res = NextResponse.redirect(new URL('/admin/login', request.url))
    res.cookies.set('admin-session', '', { maxAge: 0 })
    return res
  }
}

export const config = {
  matcher: ['/admin/:path*'],
}
