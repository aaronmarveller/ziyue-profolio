// app/api/content/route.ts
import { NextRequest, NextResponse } from 'next/server'
import { cookies } from 'next/headers'
import { verifyToken } from '@/lib/auth'
import { commitFile } from '@/lib/github'

export async function POST(req: NextRequest) {
  // Verify admin session
  const cookieStore = await cookies()
  const token = cookieStore.get('admin-session')?.value
  if (!token) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  try {
    await verifyToken(token)
  } catch {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const { filePath, content, sha, message } = await req.json()

  if (!filePath || !content) {
    return NextResponse.json({ error: 'Missing required fields' }, { status: 400 })
  }

  const ALLOWED_PATH = /^content\/(about|skills|projects\/[a-zA-Z0-9_-]+|publications\/[a-zA-Z0-9_-]+)\.md$/
  if (!ALLOWED_PATH.test(filePath)) {
    return NextResponse.json({ error: 'Invalid file path' }, { status: 400 })
  }
  // sha is empty string for new files — commitFile handles that correctly

  const newSha = await commitFile(filePath, content, sha ?? '', message ?? `content: update ${filePath}`)

  return NextResponse.json({ ok: true, sha: newSha })
}
