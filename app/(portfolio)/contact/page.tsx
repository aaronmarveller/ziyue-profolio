// app/(portfolio)/contact/page.tsx
import { getAbout } from '@/lib/content'
import { ContactForm } from '@/components/portfolio/ContactForm'

export const metadata = { title: 'Contact — Ziyue Liu' }

export default async function ContactPage() {
  const about = await getAbout()
  return (
    <div className="max-w-3xl mx-auto px-6 py-16">
      <h1 className="text-3xl font-bold text-gray-900 mb-3">Get in Touch</h1>
      <p className="text-gray-500 mb-10">
        Interested in collaborating or have questions about my research?
      </p>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
        <ContactForm />
        <div className="space-y-4">
          <div>
            <p className="text-xs text-gray-400 uppercase tracking-wide mb-1">Email</p>
            <a href={`mailto:${about.email}`} className="text-sm text-indigo-600 hover:underline">
              {about.email}
            </a>
          </div>
          <div>
            <p className="text-xs text-gray-400 uppercase tracking-wide mb-1">CV</p>
            <a href={about.cv_url} className="text-sm text-gray-700 hover:text-gray-900">
              Download CV (PDF) ↓
            </a>
          </div>
        </div>
      </div>
    </div>
  )
}
