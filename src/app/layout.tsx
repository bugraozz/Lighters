'use client';
import './globals.css'
import { Roboto } from 'next/font/google' // Change this line to import a different font
import { AuthProvider } from '@/contexts/AuthContext';
import { ThemeProvider } from "@/components/theme-provider"
import { FavoritesProvider } from '@/contexts/FavoritesContext';
import { SessionProvider } from 'next-auth/react';
import { useEffect } from 'react';

const roboto = Roboto({ subsets: ['latin'], weight: ['400', '700'] }) // Update this line to use the new font

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {

  useEffect(() => {
    const trackVisit = async () => {
      try {
        await fetch("/api/admin/admin-dashboard/admin-track", { method: "POST" })
      } catch (error) {
        console.error("Error tracking visit:", error)
      }
    }

    trackVisit()
  }, [])

    

  return (
    <SessionProvider>
      <AuthProvider>
        <html lang="en">
          <body className={roboto.className}> {/* Update this line to use the new font */}
            <ThemeProvider
              attribute="class"
              defaultTheme="system"
              enableSystem
              disableTransitionOnChange
            >
                  
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