// components/portfolio/ContactForm.tsx
'use client'
import { useState } from 'react'

const focusRing =
  'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent-500 focus-visible:ring-offset-2 focus-visible:ring-offset-white dark:focus-visible:ring-accent-400 dark:focus-visible:ring-offset-gray-900'

const inputClasses =
  'w-full rounded-lg border border-black/[0.08] bg-white px-3.5 py-2.5 text-sm text-gray-900 placeholder:text-gray-400 transition-colors hover:border-gray-300 focus:border-accent-500 focus:outline-none focus:ring-2 focus:ring-accent-500/60 dark:border-white/15 dark:bg-[#0d1219] dark:text-gray-100 dark:placeholder:text-gray-500 dark:hover:border-gray-600 dark:focus:border-accent-400 dark:focus:ring-accent-400/60'

const fieldLabel =
  'label-mono mb-2 block text-gray-500 dark:text-gray-400'

export function ContactForm() {
  const [status, setStatus] = useState<'idle' | 'sending' | 'sent' | 'error'>('idle')

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault()
    if (status === 'sending') return
    setStatus('sending')

    const form = event.currentTarget
    const data = {
      name: (form.elements.namedItem('name') as HTMLInputElement).value,
      email: (form.elements.namedItem('email') as HTMLInputElement).value,
      message: (form.elements.namedItem('message') as HTMLTextAreaElement).value,
    }

    try {
      const res = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      })
      setStatus(res.ok ? 'sent' : 'error')
    } catch {
      setStatus('error')
    }
  }

  if (status === 'sent') {
    return (
      <p
        role="status"
        className="hero-reveal rounded-xl border border-green-200 bg-green-50 px-5 py-4 text-sm leading-relaxed text-green-800 dark:border-green-800 dark:bg-green-900/40 dark:text-green-200"
      >
        Message sent! I&apos;ll get back to you soon.
      </p>
    )
  }

  const sending = status === 'sending'

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div>
        <label htmlFor="contact-name" className={fieldLabel}>
          Name
        </label>
        <input
          id="contact-name"
          name="name"
          type="text"
          autoComplete="name"
          required
          className={inputClasses}
        />
      </div>
      <div>
        <label htmlFor="contact-email" className={fieldLabel}>
          Email
        </label>
        <input
          id="contact-email"
          name="email"
          type="email"
          autoComplete="email"
          required
          className={inputClasses}
        />
      </div>
      <div>
        <label htmlFor="contact-message" className={fieldLabel}>
          Message
        </label>
        <textarea
          id="contact-message"
          name="message"
          rows={5}
          required
          className={inputClasses}
        />
      </div>

      {status === 'error' && (
        <p
          role="alert"
          className="rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm leading-relaxed text-red-700 dark:border-red-800 dark:bg-red-900/40 dark:text-red-300"
        >
          Something went wrong. Please try again.
        </p>
      )}

      <button
        type="submit"
        disabled={sending}
        aria-busy={sending}
        className={`group inline-flex items-center justify-center rounded-full bg-accent-600 px-6 py-3 text-sm font-medium text-white transition duration-150 hover:bg-accent-700 active:scale-[0.98] active:bg-accent-700 disabled:cursor-not-allowed disabled:opacity-60 disabled:active:scale-100 dark:bg-accent-400 dark:text-gray-950 dark:hover:bg-accent-300 dark:active:bg-accent-300 ${focusRing}`}
      >
        {sending ? 'Sending...' : 'Send Message'}
        {!sending && (
          <span
            aria-hidden="true"
            className="ml-2 inline-block transition-transform duration-200 group-hover:translate-x-0.5"
          >
            →
          </span>
        )}
      </button>
    </form>
  )
}
