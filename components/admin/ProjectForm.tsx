// components/admin/ProjectForm.tsx
'use client'
import dynamic from 'next/dynamic'
import { useState } from 'react'
import { useRouter } from 'next/navigation'

const MDEditor = dynamic(() => import('@uiw/react-md-editor'), { ssr: false })

interface Props {
  slug?: string
  sha?: string
  initialData?: {
    title: string; date: string; tags: string; summary: string; featured: boolean; content: string
  }
}

const DEFAULTS = { title: '', date: '', tags: '', summary: '', featured: false, content: '' }

export function ProjectForm({ slug, sha, initialData }: Props) {
  const router = useRouter()
  const [fields, setFields] = useState(initialData ?? DEFAULTS)
  const [status, setStatus] = useState<'idle' | 'saving' | 'saved' | 'error'>('idle')

  function set(key: string, value: string | boolean) {
    setFields(prev => ({ ...prev, [key]: value }))
  }

  function buildMarkdown() {
    const tagsArray = fields.tags.split(',').map(t => `"${t.trim()}"`).join(', ')
    return `---\ntitle: "${fields.title}"\ndate: "${fields.date}"\ntags: [${tagsArray}]\nsummary: ${fields.summary}\nfeatured: ${fields.featured}\n---\n${fields.content}`
  }

  function slugify(title: string) {
    return title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '')
  }

  async function handleSave() {
    setStatus('saving')
    const finalSlug = slug ?? slugify(fields.title)
    const res = await fetch('/api/content', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        filePath: `content/projects/${finalSlug}.md`,
        content: buildMarkdown(),
        sha: sha ?? '',
        message: `content: ${slug ? 'update' : 'add'} project ${finalSlug}`,
      }),
    })
    if (res.ok) {
      setStatus('saved')
      setTimeout(() => router.push('/admin/dashboard/projects'), 1500)
    } else {
      setStatus('error')
    }
  }

  return (
    <div className="space-y-5">
      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-xs font-medium text-gray-500 mb-1">Title</label>
          <input value={fields.title} onChange={e => set('title', e.target.value)}
            className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500" />
        </div>
        <div>
          <label className="block text-xs font-medium text-gray-500 mb-1">Date (YYYY-MM)</label>
          <input value={fields.date} onChange={e => set('date', e.target.value)} placeholder="2024-06"
            className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500" />
        </div>
      </div>
      <div>
        <label className="block text-xs font-medium text-gray-500 mb-1">Tags (comma-separated)</label>
        <input value={fields.tags} onChange={e => set('tags', e.target.value)} placeholder="NLP, usability"
          className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500" />
      </div>
      <div>
        <label className="block text-xs font-medium text-gray-500 mb-1">One-line Summary</label>
        <input value={fields.summary} onChange={e => set('summary', e.target.value)}
          className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500" />
      </div>
      <label className="flex items-center gap-2 text-sm text-gray-700">
        <input type="checkbox" checked={fields.featured} onChange={e => set('featured', e.target.checked)} />
        Featured on homepage
      </label>
      <div>
        <label className="block text-xs font-medium text-gray-500 mb-1">Case Study Content (Markdown)</label>
        <div data-color-mode="light">
          <MDEditor value={fields.content} onChange={v => set('content', v ?? '')} height={400} />
        </div>
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
