import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'
import AuthInitializer from '@/components/AuthInitializer'
import Footer from '@/components/Footer'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'AI Content Generator',
  description: 'Generate and manage AI-powered content',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" className="h-full">
      <body className={`${inter.className} h-full flex flex-col`}>
        <AuthInitializer>
          <div className="flex-1 flex flex-col min-h-screen">
            <div className="flex-1 pb-20 sm:pb-0">
              {children}
            </div>
            <Footer />
          </div>
        </AuthInitializer>
      </body>
    </html>
  )
}

