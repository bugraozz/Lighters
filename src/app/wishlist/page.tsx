'use client'

import { useEffect } from 'react'
import { useFavorites } from '@/contexts/FavoritesContext'
import { useAuth } from '@/contexts/AuthContext'
import { ProductCard } from '@/components/ProductCard'

interface Product {
  id: number
  name: string
  price: number | string
  category: string
  type: string
  images: string[]
}

const getImageSrc = (images: string[]) => {
  if (images && images.length > 0) {
    const image = images[0]
    if (image.startsWith('http') || image.startsWith('https')) return image
    return image.startsWith('/') ? image : `/${image}`
  }
  return '/placeholder.svg?height=300&width=300'
}

export default function FavoritesPage() {
  const { favorites, isLoading } = useFavorites()
  const { user } = useAuth()

  useEffect(() => {
    if (!user) {
      window.location.href = '/'
    }
  }, [user])

  console.log('Favorites:', favorites)

  if (isLoading) {
    return <div className="flex justify-center items-center h-screen">Yükleniyor...</div>
  }

  if (!user) {
    return null
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Favorilerim</h1>
        <button
          className="block md:hidden bg-gray-200 text-gray-800 px-4 py-2 rounded"
          onClick={() => window.history.back()}
        >
          Geri
        </button>
      </div>
      {favorites.length === 0 ? (
        <p>Henüz favori ürününüz bulunmamaktadır.</p>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {favorites.map((product: Product) => (
            <ProductCard
              key={product.id}
              product={{
                ...product,
                image: getImageSrc(product.images),
              }}
             
            />
          ))}
        </div>
      )}
    </div>
  )
}





