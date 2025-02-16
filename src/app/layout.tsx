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
        console.log("Ziyaret takibi başlatılıyor...");
        const response = await fetch("/api/admin/admin-dashboard/admin-track", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
        });
        const data = await response.json();
        // console.log("Ziyaret takibi sonucu:", data);
        if (data.isNewVisitor) {
          // console.log(`Yeni ziyaretçi kaydedildi! IP: ${data.ip}`);
        } else {
          // console.log(`Mevcut ziyaretçinin ziyaret zamanı güncellendi. IP: ${data.ip}`);
        }
      } catch (error) {
        console.error("Ziyaret takibi hatası:", error);
      }
    };
  
    trackVisit(); // Burada trackVisit fonksiyonunu çağırıyoruz
  }, []);
  

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
                 
                </FavoritesProvider>
              
            </ThemeProvider>
          </body>
        </html>
      </AuthProvider>
    </SessionProvider>
  )
}