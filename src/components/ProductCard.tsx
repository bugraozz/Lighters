import Image from 'next/image'
import Link from 'next/link'
import { useState } from 'react'
import { useFavorites } from '@/contexts/FavoritesContext'
import { useAuth } from '@/contexts/AuthContext'
import { Heart } from 'lucide-react'
import { toast } from "@/hooks/use-toast"

interface ProductSize {
  size: string
  stock: number
}

interface Product {
  id: number
  name: string
  price: number | string
  image: string
  category: string
  gender: string
  sizes?: ProductSize[]
  images?: string[]
}

const getImageSrc = (image: string | undefined) => {
  if (!image) return '/placeholder.svg'
  if (image.startsWith('http')) return image
  return image.startsWith('/') ? image : `/${image}`
}

const formatPrice = (price: number | string): string => {
  if (typeof price === 'number') {
    return price.toFixed(2)
  }
  if (typeof price === 'string') {
    const numPrice = parseFloat(price)
    return isNaN(numPrice) ? '0.00' : numPrice.toFixed(2)
  }
  return '0.00'
}

export function ProductCard({ product }: { product: Product }) {
  
  const { addToFavorites, removeFromFavorites, isFavorite } = useFavorites()
  const { user } = useAuth()
  const [currentImageIndex, setCurrentImageIndex] = useState(0)

  const handleToggleFavorite = async (e: React.MouseEvent) => {
    e.preventDefault()
    e.stopPropagation()

    if (!user) {
      toast({
        title: "Giriş Gerekli",
        description: "Favorilere eklemek için lütfen giriş yapın",
        variant: "destructive",
      })
      return
    }

    try {
      if (isFavorite(product.id)) {
        await removeFromFavorites(product.id)
      } else {
        await addToFavorites({
          id: product.id,
          name: product.name,
          price: parseFloat(formatPrice(product.price)),
          image: product.image
        })
      }
    } catch {
      toast({
        title: "Hata",
        description: "Favoriler güncellenirken bir hata oluştu",
        variant: "destructive",
      })
    }
  }

  const handleMouseMove = (e: React.MouseEvent) => {
    if (product.images && product.images.length > 1) {
      const { width, left } = e.currentTarget.getBoundingClientRect()
      const x = e.clientX - left
      const index = Math.min(
        Math.max(Math.floor((x / width) * product.images.length), 0),
        product.images.length - 1
      )
      setCurrentImageIndex(index)
    }
  }

  const imageSrc = product.images && product.images.length > 0
    ? getImageSrc(product.images[currentImageIndex])
    : getImageSrc(product.image)

  const availableSizes = product.sizes
    ? product.sizes.filter(size => size.stock > 0).map(size => size.size)
    : []

  return (
    <div className="border rounded-lg overflow-hidden shadow-md">
      <Link href={`/products/${product.id}`}>
        <div className="relative aspect-square" onMouseMove={handleMouseMove}>
          <Image
            src={imageSrc}
            alt={product.name}
            fill
            className="object-cover"
          />
          <Heart
            className={`absolute top-2 right-2 cursor-pointer ${
              isFavorite(product.id) ? "fill-red-500 text-red-500" : "text-gray-500"
            }`}
            onClick={handleToggleFavorite}
          />
        </div>
        <div className="p-4">
          <h2 className="text-lg font-bold">{product.name}</h2>
          {availableSizes.length > 0 && (
            <p className="text-sm text-gray-500">Bedenler: {availableSizes.join(', ')}</p>
          )}
          <p className="text-sm text-gray-500">{formatPrice(product.price)} TL</p>
          <p className="text-xs text-gray-400">{product.category} - {product.gender}</p>
        </div>
      </Link>
    </div>
  )
}
