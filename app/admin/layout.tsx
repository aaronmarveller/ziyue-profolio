// app/admin/layout.tsx
import { AdminSidebar } from '@/components/admin/AdminSidebar'

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen bg-white flex">
      <AdminSidebar />
      <main className="flex-1 p-8 max-w-3xl">{children}</main>
    </div>
  )
}
