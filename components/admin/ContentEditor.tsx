'use client'
import dynamic from 'next/dynamic'
import { useState } from 'react'

const MDEditor = dynamic(() => import('@uiw/react-md-editor'), { ssr: false })

interface Props {
  filePath: string
  initialContent: string
  sha: string
  label: string
}

export function ContentEditor({ filePath, initialContent, sha, label }: Props) {
  const [content, setContent] = useState(initialContent)
  const [currentSha, setCurrentSha] = useState(sha)
  const [status, setStatus] = useState<'idle' | 'saving' | 'saved' | 'error'>('idle')

  async function handleSave() {
    setStatus('saving')
    const res = await fetch('/api/content', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ filePath, content, sha: currentSha }),
    })
    if (res.ok) {
      setStatus('saved')
      setTimeout(() => window.location.reload(), 1500)
    } else {
      setStatus('error')
    }
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="text-lg font-semibold text-gray-900">{label}</h2>
        <div className="flex items-center gap-3">
          {status === 'saved' && <span className="text-sm text-green-600">Saved! Redeploying...</span>}
          {status === 'error' && <span className="text-sm text-red-600">Save failed</span>}
          <button
            type="button"
            onClick={handleSave}
            disabled={status === 'saving'}
            className="px-4 py-2 bg-gray-900 text-white text-sm font-medium rounded-lg hover:bg-gray-700 disabled:opacity-50 transition-colors"
          >
            {status === 'saving' ? 'Saving...' : 'Save & Publish'}
          </button>
        </div>
      </div>
      <div data-color-mode="light">
        <MDEditor value={content} onChange={v => setContent(v ?? '')} height={500} />
      </div>
    </div>
  )
}
