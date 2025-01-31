'use client';
import './globals.css'
import type { Metadata } from 'next'
import { Roboto } from 'next/font/google' // Change this line to import a different font
import { CartProvider } from '@/contexts/CartContext'
import { ShoppingCard } from '@/components/ShoppingCard'
import { usePathname } from 'next/navigation'
import { AuthProvider } from '@/contexts/AuthContext';
import { ThemeProvider } from "@/components/theme-provider"
import { FavoritesProvider } from '@/contexts/FavoritesContext';
import { SessionProvider } from 'next-auth/react';

const roboto = Roboto({ subsets: ['latin'], weight: ['400', '700'] }) // Update this line to use the new font

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {

    const pathname = usePathname()
    const isHomePage = pathname === '/'
    const isAdminPage = pathname ? pathname.startsWith('/admin') : true

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
              <CartProvider>     
                <FavoritesProvider>
                  {children}
                 
                </FavoritesProvider>
              </CartProvider>
            </ThemeProvider>
          </body>
        </html>
      </AuthProvider>
    </SessionProvider>
  )
}