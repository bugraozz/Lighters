'use client'

import React, { createContext, useState, useContext, useEffect, useCallback } from 'react'
import { useAuth } from './AuthContext'
import { toast } from "@/hooks/use-toast"

interface FavoriteItem {
  id: number
  name: string
  price: number | string
  category: string
  type: string
  images: string[]
}

interface FavoritesContextType {
  favorites: FavoriteItem[]
  addToFavorites: (item: FavoriteItem) => Promise<void>
  removeFromFavorites: (id: number) => Promise<void>
  isFavorite: (id: number) => boolean
  isLoading: boolean
}

const FavoritesContext = createContext<FavoritesContextType | undefined>(undefined)

export const useFavorites = () => {
  const context = useContext(FavoritesContext)
  if (context === undefined) {
    throw new Error('useFavorites must be used within a FavoritesProvider')
  }
  return context
}

export const FavoritesProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [favorites, setFavorites] = useState<FavoriteItem[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const { user } = useAuth()

 

  const fetchFavorites = useCallback(async () => {
    if (!user?.token) return

    setIsLoading(true)
    try {
      const response = await fetch('/api/favorites', {
        headers: {
          'Authorization': `Bearer ${user.token}`
        }
      })

      if (!response.ok) {
        throw new Error(`Failed to fetch favorites: ${response.status} ${response.statusText}`)
      }

      const data = await response.json()
      
      setFavorites(data)
    } catch (error) {
      console.error('Error fetching favorites:', error)
      toast({
        title: "Hata",
        description: "Favoriler yüklenirken bir hata oluştu",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }, [user?.token])

  useEffect(() => {
    if (user) {
     
      fetchFavorites()
    } else {
      
      setFavorites([])
      setIsLoading(false)
    }
  }, [user, fetchFavorites])

  const addToFavorites = async (item: FavoriteItem) => {
   
    if (!user?.token) {
      
      toast({
        title: "Giriş Gerekli",
        description: "Favorilere eklemek için lütfen giriş yapın",
        variant: "destructive",
      })
      return
    }

    try {
      const response = await fetch('/api/favorites', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${user.token}`
        },
        body: JSON.stringify({ id: item.id }),
      })

      if (!response.ok) {
        throw new Error(`Failed to add to favorites: ${response.status} ${response.statusText}`)
      }

      const result = await response.json()
      

      if (result.favorite) {
        setFavorites(prev => {
        
          const newFavorites = [...prev, result.favorite]
         
          return newFavorites
        })
        toast({
          title: "Başarılı",
          description: "Favorilere eklendi",
        })
      } else {
        toast({
          title: "Bilgi",
          description: "Bu ürün zaten favorilerinizde",
        })
      }
    } catch (error) {
      console.error('Error adding to favorites:', error)
      toast({
        title: "Hata",
        description: "Favorilere eklenirken bir hata oluştu",
        variant: "destructive",
      })
    }
  }

  const removeFromFavorites = async (id: number) => {
    if (!user?.token) return

    try {
      const response = await fetch(`/api/favorites/${id}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${user.token}`
        }
      })

      if (!response.ok) {
        throw new Error(`Failed to remove from favorites: ${response.status} ${response.statusText}`)
      }

      setFavorites(prev => {
       
        const newFavorites = prev.filter(item => item.id !== id)
       
        return newFavorites
      })
      toast({
        title: "Başarılı",
        description: "Favorilerden kaldırıldı",
      })
    } catch (error) {
      console.error('Error removing from favorites:', error)
      toast({
        title: "Hata",
        description: "Favorilerden kaldırılırken bir hata oluştu",
        variant: "destructive",
      })
    }
  }

  const isFavorite = (id: number) => {
    const result = favorites.some((item) => item.id === id)
    
    return result
  }

  return (
    <FavoritesContext.Provider value={{ favorites, addToFavorites, removeFromFavorites, isFavorite, isLoading }}>
      {children}
    </FavoritesContext.Provider>
  )
}

