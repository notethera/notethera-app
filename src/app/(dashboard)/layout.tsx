import { Sidebar } from '@/components/dashboard/sidebar'

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex h-full">
      <Sidebar />
      <main className="flex flex-1 flex-col overflow-auto bg-gray-50 pt-14 md:pt-0">
        {children}
      </main>
    </div>
  )
}
