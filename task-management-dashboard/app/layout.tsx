import React from "react"
import type { Metadata, Viewport } from 'next'
import { Geist, Geist_Mono } from 'next/font/google'

import './globals.css'
import { Toaster } from '@/components/ui/sonner'

const _geist = Geist({ subsets: ['latin'] })
const _geistMono = Geist_Mono({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'TaskFlow - AI-Powered Task Management',
  description: 'Manage your tasks with AI assistance, kanban board, calendar scheduling, and real-time notifications',
  generator: 'v0.app',
}

export const viewport: Viewport = {
  themeColor: '#0f172a',
  userScalable: false,
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className="font-sans antialiased bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950">
        {children}
        <Toaster />
      </body>
    </html>
  )
}
