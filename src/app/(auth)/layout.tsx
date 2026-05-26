import { FileText } from 'lucide-react'
import Link from 'next/link'

export default function AuthLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex min-h-full flex-col items-center justify-center bg-gray-50 px-4 py-12">
      <Link href="/" className="mb-8 flex items-center gap-2">
        <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-teal-600">
          <FileText className="h-5 w-5 text-white" />
        </div>
        <span className="text-xl font-semibold text-gray-900">NoteThéra</span>
      </Link>
      {children}
    </div>
  )
}
