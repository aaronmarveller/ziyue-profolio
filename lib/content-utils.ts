// lib/content-utils.ts
// Server-side helpers for deciding whether contact/download actions are
// usable. The portfolio must not present actions that lead to broken or
// misleading destinations (placeholder email, CV/PDF files that do not exist).
import fs from 'fs'
import path from 'path'

const PLACEHOLDER_EMAIL = 'your@email.com'

/** True when the email is a real contact address, not the known placeholder. */
export function isUsableEmail(email: unknown): email is string {
  if (typeof email !== 'string') return false
  const trimmed = email.trim()
  return trimmed !== '' && trimmed !== PLACEHOLDER_EMAIL
}

/** True when the file URL points to a real file: an absolute http(s) URL, or a
 *  local `/...` path under `public/` that actually exists on disk. */
export function isUsableFileUrl(url: unknown): boolean {
  if (typeof url !== 'string') return false
  const trimmed = url.trim()
  if (trimmed === '') return false
  if (/^https?:\/\//i.test(trimmed)) return true
  if (trimmed.startsWith('/')) {
    try {
      const filePath = path.join(process.cwd(), 'public', trimmed)
      return fs.statSync(filePath).isFile()
    } catch {
      return false
    }
  }
  return false
}
