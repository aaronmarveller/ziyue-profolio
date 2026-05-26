// components/admin/PublicationForm.tsx
'use client'
import { useState } from 'react'
import { useRouter } from 'next/navigation'

interface Props {
  slug?: string
  sha?: string
  initialData?: {
    title: string; journal: string; year: string; doi: string; pdf_url: string; content: string
  }
}

const DEFAULTS = { title: '', journal: '', year: '', doi: '', pdf_url: '', content: '' }

export function PublicationForm({ slug, sha, initialData }: Props) {
  const router = useRouter()
  const [fields, setFields] = useState(initialData ?? DEFAULTS)
  const [status, setStatus] = useState<'idle' | 'saving' | 'saved' | 'error'>('idle')

  function set(key: keyof typeof DEFAULTS, value: string) {
    setFields(prev => ({ ...prev, [key]: value }))
  }

  function slugify(title: string) {
    return title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '')
  }

  function buildMarkdown() {
    return `---\ntitle: "${fields.title}"\njournal: "${fields.journal}"\nyear: ${fields.year}\ndoi: ${fields.doi}\npdf_url: ${fields.pdf_url}\n---\n${fields.content}`
  }

  async function handleSave() {
    setStatus('saving')
    const finalSlug = slug ?? slugify(fields.title)
    const res = await fetch('/api/content', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        filePath: `content/publications/${finalSlug}.md`,
        content: buildMarkdown(),
        sha: sha ?? '',
        message: `content: ${slug ? 'update' : 'add'} publication ${finalSlug}`,
      }),
    })
    if (res.ok) {
      setStatus('saved')
      setTimeout(() => router.push('/admin/dashboard/publications'), 1500)
    } else {
      setStatus('error')
    }
  }

  return (
    <div className="space-y-5">
      <div>
        <label htmlFor="pub-title" className="block text-xs font-medium text-gray-500 mb-1">Title</label>
        <input id="pub-title" value={fields.title} onChange={e => set('title', e.target.value)}
          className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500" />
      </div>
      <div className="grid grid-cols-2 gap-4">
        <div>
          <label htmlFor="pub-journal" className="block text-xs font-medium text-gray-500 mb-1">Journal / Venue</label>
          <input id="pub-journal" value={fields.journal} onChange={e => set('journal', e.target.value)}
            className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500" />
        </div>
        <div>
          <label htmlFor="pub-year" className="block text-xs font-medium text-gray-500 mb-1">Year</label>
          <input id="pub-year" value={fields.year} onChange={e => set('year', e.target.value)} placeholder="2024"
            className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500" />
        </div>
      </div>
      <div className="grid grid-cols-2 gap-4">
        <div>
          <label htmlFor="pub-doi" className="block text-xs font-medium text-gray-500 mb-1">DOI</label>
          <input id="pub-doi" value={fields.doi} onChange={e => set('doi', e.target.value)} placeholder="10.xxxx/..."
            className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500" />
        </div>
        <div>
          <label htmlFor="pub-pdf" className="block text-xs font-medium text-gray-500 mb-1">PDF URL</label>
          <input id="pub-pdf" value={fields.pdf_url} onChange={e => set('pdf_url', e.target.value)} placeholder="/files/papers/..."
            className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500" />
        </div>
      </div>
      <div>
        <label htmlFor="pub-abstract" className="block text-xs font-medium text-gray-500 mb-1">Abstract</label>
        <textarea id="pub-abstract" value={fields.content} onChange={e => set('content', e.target.value)} rows={6}
          className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500" />
      </div>
      <div className="flex items-center gap-4">
        <button type="button" onClick={handleSave} disabled={status === 'saving'}
          className="px-4 py-2 bg-gray-900 text-white text-sm font-medium rounded-lg hover:bg-gray-700 disabled:opacity-50 transition-colors">
          {status === 'saving' ? 'Saving...' : 'Save & Publish'}
        </button>
        {status === 'saved' && <span className="text-sm text-green-600">Saved! Redirecting...</span>}
        {status === 'error' && <span className="text-sm text-red-600">Save failed</span>}
      </div>
    </div>
  )
}
