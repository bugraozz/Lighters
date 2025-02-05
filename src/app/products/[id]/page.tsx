'use client';

import { useParams, useRouter } from 'next/navigation';
import { useState, useEffect } from 'react';
import Image from 'next/image';
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { ChevronLeft } from 'lucide-react';

interface ProductSize {
  size: string;
  stock: number;
}

interface Product {
  id: number;
  name: string;
  price: number;
  description: string;
  images: string[];
  category: string;
  type: string;
  link: string;
  sizes: ProductSize[];
}

const getImageSrc = (image: string | undefined) => {
  if (!image) return '/placeholder.svg';
  if (image.startsWith('http')) return image;
  const finalPath = `/api/uploads/${image.replace(/^\/+/, '')}`;
  console.log("Resim yolu:", finalPath);
  return finalPath;
};


export default function ProductPage() {
  const params = useParams();
  const router = useRouter();
  const id = params?.id as string | undefined;
  const [product, setProduct] = useState<Product | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  useEffect(() => {
    if (id) {
      fetchProduct(id);
    }
  }, [id]);

  const fetchProduct = async (productId: string) => {
    try {
      const response = await fetch(`/api/products/${productId}`);
      if (!response.ok) {
        throw new Error('Ürün yüklenirken bir hata oluştu.');
      }
      const data = await response.json();
      setProduct(data);
    } catch (error) {
      setError((error as Error).message);
    } finally {
      setIsLoading(false);
    }
  };

  const nextImage = () => {
    if (product) {
      setCurrentImageIndex((prevIndex) => (prevIndex + 1) % product.images.length);
    }
  };

  const prevImage = () => {
    if (product) {
      setCurrentImageIndex((prevIndex) => (prevIndex - 1 + product.images.length) % product.images.length);
    }
  };

  if (isLoading) return <div className="container mx-auto px-4 py-8">Yükleniyor...</div>;
  if (error) return <div className="container mx-auto px-4 py-8 text-red-500">{error}</div>;
  if (!product) return <div className="container mx-auto px-4 py-8">Ürün bulunamadı.</div>;

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Add the back button */}
      <Button variant="ghost" onClick={() => router.back()} className="absolute top-4 left-4">
        <ChevronLeft className="mr-2 h-4 w-4" />
        Geri
      </Button>
      <div className="md:hidden mb-4">
        <Button variant="ghost" onClick={() => router.back()}>
          <ChevronLeft className="mr-2 h-4 w-4" />
          Geri
        </Button>
      </div>
      <Card>
        <CardContent className="p-6">
          <div className="grid md:grid-cols-2 gap-8">
            <div>
              <div className="relative aspect-square mb-2">
              <img
  src={getImageSrc(product.images[currentImageIndex])}
  alt={product.name}
  className="w-full h-auto rounded-lg"
/>

                <Button className="absolute left-2 top-1/2 transform -translate-y-1/2" onClick={prevImage}>
                  &#8592;
                </Button>
                <Button className="absolute right-2 top-1/2 transform -translate-y-1/2 " onClick={nextImage}>
                  &#8594;
                </Button>
              </div>
              <div className="flex flex-wrap space-x-2 overflow-x-auto pb-2 md:overflow-x-hidden">
                {product.images.map((image, index) => (
                  <button
                    key={index}
                    onClick={() => setCurrentImageIndex(index)}
                    className={`relative w-20 h-20 flex-shrink-0 ${
                      index === currentImageIndex ? 'ring-2 ring-primary' : ''
                    }`}
                  >
                    <Image
                      src={getImageSrc(image)}
                      alt={`${product.name} - Görsel ${index + 1}`}
                      fill
                      className="object-cover rounded"
                    />
                  </button>
                ))}
              </div>
            </div>
            <div>
              <h1 className="text-3xl font-bold mb-4">{product.name}</h1>
              <p className="text-2xl font-semibold mb-4">{product.price} TL</p>
              <p className="mb-4">{product.description || 'Ürün açıklaması bulunmamaktadır.'}</p>
              <div className="mb-4">
                <strong>Kategori:</strong> {product.category}
              </div>
              <div className="mb-4">
                <strong>Tür:</strong> {product.type}
              </div>
              <a href={product.link} target="_blank" rel="noopener noreferrer">
                <Button>
                  Satın Al
                </Button>
              </a>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

