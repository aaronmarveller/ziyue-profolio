// app/admin/dashboard/publications/new/page.tsx
import { PublicationForm } from '@/components/admin/PublicationForm'

export default function NewPublicationPage() {
  return (
    <div>
      <h1 className="text-2xl font-bold text-gray-900 mb-8">New Publication</h1>
      <PublicationForm />
    </div>
  )
}
