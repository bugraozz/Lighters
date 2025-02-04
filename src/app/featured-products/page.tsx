'use client';

import { useEffect, useState } from 'react';
import { ProductCard } from '@/components/ProductCard';

export default function FeaturedProducts() {
  interface Product {
    id: number;
    name: string;
    price: number;
    image: string;
    category: string;
    gender: string;
  }

  const [products, setProducts] = useState<Product[]>([]);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function getProducts() {
      try {
        const response = await fetch('/api/featured-products');
        if (!response.ok) throw new Error('Ürünler yüklenirken bir hata oluştu.');
        const data = await response.json();
        setProducts(data);
      } catch (error) {
        setError((error instanceof Error) ? error.message : 'Bilinmeyen bir hata oluştu.');
      }
    }

    getProducts();
  }, []);

  if (error) {
    return <div className="container mx-auto p-4">Hata: {error}</div>;
  }

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Öne Çıkan Ürünler</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {products.map(product => (
          <ProductCard key={product.id} product={product} />
        ))}
      </div>
    </div>
  );
}