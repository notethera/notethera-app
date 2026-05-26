import type { Metadata } from 'next'
import { Geist } from 'next/font/google'
import './globals.css'

const geist = Geist({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'NoteThéra – Notes cliniques pour thérapeutes',
  description: 'Transcription et génération automatique de notes cliniques pour les psychothérapeutes francophones.',
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="fr" className="h-full">
      <body className={`${geist.className} h-full antialiased`}>{children}</body>
    </html>
  )
}
