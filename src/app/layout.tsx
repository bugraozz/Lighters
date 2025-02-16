'use client';
import './globals.css'
import { Roboto } from 'next/font/google' // Change this line to import a different font
import { AuthProvider } from '@/contexts/AuthContext';
import { ThemeProvider } from "@/components/theme-provider"
import { FavoritesProvider } from '@/contexts/FavoritesContext';
import { SessionProvider } from 'next-auth/react';
import VisitorTracker from './admin/VisitorTracker/page';

const roboto = Roboto({ subsets: ['latin'], weight: ['400', '700'] }) // Update this line to use the new font

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <SessionProvider>
      <AuthProvider>
        <html lang="en">
          <body className={roboto.className}> 
            <ThemeProvider
              attribute="class"
              defaultTheme="system"
              enableSystem
              disableTransitionOnChange
            >
                <FavoritesProvider>
                  {children}
                  <VisitorTracker /> {/* Move VisitorTracker here */}
                </FavoritesProvider>
            </ThemeProvider>
          </body>
        </html>
      </AuthProvider>
    </SessionProvider>
  )
}