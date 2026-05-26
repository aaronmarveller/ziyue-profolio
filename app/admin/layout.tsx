// app/admin/layout.tsx
import type { ReactNode } from 'react'
import { AdminSidebar } from '@/components/admin/AdminSidebar'

export default function AdminLayout({ children }: { children: ReactNode }) {
  return (
    <div className="min-h-screen bg-white flex">
      <AdminSidebar />
      <main className="flex-1 p-8 max-w-3xl">{children}</main>
    </div>
  )
}
