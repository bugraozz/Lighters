import Image from 'next/image'
import Link from 'next/link'
import { useState } from 'react'
import { useFavorites } from '@/contexts/FavoritesContext'
import { useAuth } from '@/contexts/AuthContext'
import { Heart } from 'lucide-react'
import { toast } from "@/hooks/use-toast"



interface Product {
  id: number
  name: string
  price: number | string
  image: string
  category: string
  images?: string[]
}



const getImageSrc = (image: string | undefined) => {
  if (!image) return '/placeholder.svg';
  if (image.startsWith('http')) return image;
  return image.startsWith('/') ? `/api${image}` : `/api/${image}`;
};

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

interface ProductCardProps {
  product: Product
}
export function ProductCard({ product }: ProductCardProps) {
  const { addToFavorites, removeFromFavorites, isFavorite } = useFavorites()
  const { user } = useAuth()
  const [currentImageIndex, setCurrentImageIndex] = useState(0)
  const [touchStartX, setTouchStartX] = useState<number | null>(null)

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
          images: product.images || [],
          category: product.category,
          type: 'product' 
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

  const handleTouchStart = (e: React.TouchEvent) => {
    setTouchStartX(e.touches[0].clientX)
  }

  const handleTouchMove = (e: React.TouchEvent) => {
    if (touchStartX === null) return

    const touchEndX = e.touches[0].clientX
    const touchDiff = touchStartX - touchEndX

    if (Math.abs(touchDiff) > 50) {
      if (touchDiff > 0) {
        // Swipe left
        setCurrentImageIndex((prevIndex) =>
          Math.min(prevIndex + 1, (product.images?.length || 1) - 1)
        )
      } else {
        // Swipe right
        setCurrentImageIndex((prevIndex) =>
          Math.max(prevIndex - 1, 0)
        )
      }
      setTouchStartX(null)
    }
  }

  const imageSrc = product.images && product.images.length > 0
    ? getImageSrc(product.images[currentImageIndex])
    : getImageSrc(product.image);

  

  return (
    <div className="border rounded-lg overflow-hidden shadow-md">
      <Link href={`/products/${product.id}`}>
        <div
          className="relative aspect-square"
          onMouseMove={handleMouseMove}
          onTouchStart={handleTouchStart}
          onTouchMove={handleTouchMove}
        >
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
        {product.images && product.images.length > 1 && (
          <div className="flex justify-center space-x-1 my-2">
            {product.images.map((_, index) => (
              <span
                key={index}
                className={`block w-2 h-2 rounded-full ${
                  index === currentImageIndex ? 'bg-gray-800' : 'bg-gray-400'
                }`}
                style={{ transition: 'background-color 0.3s', zIndex: 10 }}
              />
            ))}
          </div>
        )}
        <div className="p-4">
          <h2 className="text-lg font-bold">{product.name}</h2>
          
          <p className="text-sm text-gray-500">{formatPrice(product.price)} TL</p>
          <p className="text-xs text-gray-400">{product.category}</p>
        </div>
      </Link>
    </div>
  )
}
