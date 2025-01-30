'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'

interface ContentPage {
  id: number
  slug: string
  title: string
}

export function Footer() {
  const [contentPages, setContentPages] = useState<ContentPage[]>([])

  useEffect(() => {
   
  }, [])

  return (
    <footer className="bg-gray-100 dark:bg-black py-8"> {/* dark:bg-black sınıfı eklendi */}
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div>
            <h3 className="text-lg font-semibold mb-4">Hakkımızda</h3>
            <ul className="space-y-2">
              <li><Link href="/hakkimizda" className="hover:underline">Şirketimiz</Link></li>
              <li><Link href="/kariyer" className="hover:underline">Kariyer</Link></li>
              <li><Link href="/iletisim" className="hover:underline">İletişim</Link></li>
            </ul>
          </div>
          <div>
            <h3 className="text-lg font-semibold mb-4">Yardım</h3>
            <ul className="space-y-2">
              <li><Link href="/sss" className="hover:underline">Sıkça Sorulan Sorular</Link></li>
              <li><Link href="/iade-politikasi" className="hover:underline">İade Politikası</Link></li>
              <li><Link href="/gizlilik-politikasi" className="hover:underline">Gizlilik Politikası</Link></li>
            </ul>
          </div>
          <div>
            <h3 className="text-lg font-semibold mb-4">Sosyal Medya</h3>
            <ul className="space-y-2">
              <li><a href="https://facebook.com" target="_blank" rel="noopener noreferrer" className="hover:underline">Facebook</a></li>
              <li><a href="https://twitter.com" target="_blank" rel="noopener noreferrer" className="hover:underline">Twitter</a></li>
              <li><a href="https://instagram.com" target="_blank" rel="noopener noreferrer" className="hover:underline">Instagram</a></li>
            </ul>
          </div>
      
        </div>
        <div className="mt-8 text-center text-sm text-gray-500">
          &copy; {new Date().getFullYear()} Your Company Name. Tüm hakları saklıdır.
        </div>
      </div>
    </footer>
  )
}



