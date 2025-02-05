'use client';

import React, { useEffect } from 'react';
import Header from '@/components/Header';
import ImageCarousel from '@/components/ImageCorousel';
import { Footer } from '@/components/Footer';
import FeaturedProducts from './featured-products/page';

const womenImages = [
  '/uploads/1738544676014-IMG-20250129-WA0023.jpg',
  '/uploads/1738524411766-IMG-20250129-WA0016.jpg',
  '/uploads/1738544160769-IMG-20250129-WA0027.jpg',
  '/uploads/IMG-20250129-WA0005.jpg',
];

const menImages = [
  '/uploads/IMG-20250131-WA0004.jpg',
  '/uploads/IMG-20250131-WA0002.jpg',
  '/uploads/IMG-20250131-WA0003.jpg',
  '/uploads/IMG-20250131-WA0005.jpg',
];

export default function HomePage() {
  useEffect(() => {
    async function trackVisitor() {
      await fetch("/api/admin/admin-dashboard/admin-track", { method: "POST" });
    }

    trackVisitor();
  }, []);

  return (
    <div className="min-h-screen bg-background text-foreground mt-0">
      <Header />
      <main className="container mx-auto px-4 py-12 mt-0">
        <section className="py-12 md:py-20 px-4 md:px-6 text-center bg-gradient-to-r from-purple-400 via-orange-500 to-red-500 text-white">
          <h1 className="text-3xl md:text-4xl lg:text-6xl font-bold mb-4 md:mb-6">Şık Aksesuarlar, Pratik Çözümler</h1>
          <p className="text-lg md:text-xl lg:text-2xl mb-6 md:mb-8">Çakmaklar ve Telefon Kılıfları</p>
        </section>
        <div className="flex w-full h-[70vh] mb-8">
          <div className="w-1/2 h-full relative cursor-pointer">
            <ImageCarousel
              images={womenImages}
              alt="Kadın Bölümü"
              linkHref="/cakmak"
              buttonText="Çakmak Koleksiyonu"
            />
          </div>
          <div className="w-1/2 h-full relative cursor-pointer">
            <ImageCarousel
              images={menImages}
              alt="Erkek Bölümü"
              linkHref="/kilif"
              buttonText="Kılıf Koleksiyonu"
            />
          </div>
        </div>
        <FeaturedProducts />
      </main>
      <Footer />
    </div>
  );
}


