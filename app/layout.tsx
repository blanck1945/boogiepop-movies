import type { Metadata } from 'next'
import './globals.css'
import { ParentTitleSync } from './components/ParentTitleSync'

export const metadata: Metadata = {
  title: 'Movie Rating',
  description: 'Calificá tus películas favoritas',
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="es">
      <body className="min-h-screen bg-gray-950 text-white antialiased">
        <ParentTitleSync title="Movie Rating · Boogiepop" />
        {children}
      </body>
    </html>
  )
}
