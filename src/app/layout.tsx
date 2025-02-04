'use client';

import './globals.css'
import { Roboto } from 'next/font/google'
import { AuthProvider } from '@/contexts/AuthContext'
import { ThemeProvider } from "@/components/theme-provider"
import { FavoritesProvider } from '@/contexts/FavoritesContext'
import { SessionProvider } from 'next-auth/react'

const roboto = Roboto({ subsets: ['latin'], weight: ['400', '700'] })

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <SessionProvider>
      <AuthProvider>
        <html lang="en" suppressHydrationWarning>
          <body className={roboto.className} suppressHydrationWarning>
            <ThemeProvider>
              <FavoritesProvider>
                {children}
              </FavoritesProvider>
            </ThemeProvider>
          </body>
        </html>
      </AuthProvider>
    </SessionProvider>
  )
}