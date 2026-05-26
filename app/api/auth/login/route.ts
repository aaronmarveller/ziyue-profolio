// app/api/auth/login/route.ts
import { NextRequest, NextResponse } from 'next/server'
import bcrypt from 'bcryptjs'
import { signToken, COOKIE_NAME } from '@/lib/auth'

export async function POST(req: NextRequest) {
  const { password } = await req.json()

  if (!password) {
    return NextResponse.json({ error: 'Password required' }, { status: 400 })
  }

  const hash = process.env.ADMIN_PASSWORD_HASH ?? ''
  const valid = await bcrypt.compare(password, hash)

  if (!valid) {
    return NextResponse.json({ error: 'Invalid password' }, { status: 401 })
  }

  const token = await signToken({ admin: true })

  const res = NextResponse.json({ ok: true })
  res.cookies.set(COOKIE_NAME, token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'strict',
    maxAge: 60 * 60 * 24 * 7, // 7 days
    path: '/',
  })
  return res
}
