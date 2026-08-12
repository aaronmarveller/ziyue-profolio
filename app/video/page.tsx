// app/video/page.tsx
// The bare /video path (no app slug) is the reserved namespace entry point —
// it lands on the one demo page that exists today.
import { redirect } from 'next/navigation'

export default function VideoIndexPage() {
  redirect('/video/ai-english-learning')
}
