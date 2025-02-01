'use client'

import React, { useState, useEffect } from 'react'
import { useAuth } from '@/contexts/AuthContext'
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardHeader, CardTitle, CardContent, CardFooter } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

interface UserInfo {
  id: string
  Username: string
  email: string
  adress: string
  phone: string
  gender: string
  city: string
  country: string
  zipcode: string
}

export default function UserProfile() {
  const [user, setUser] = useState<UserInfo | null>(null)
  const [isEditing, setIsEditing] = useState(false)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmNewPassword, setConfirmNewPassword] = useState('');
  const { user: authUser } = useAuth()

  useEffect(() => {
    const fetchUserData = async () => {
      if (!authUser) 
          
        return;
      try {
        const response = await fetch('/api/usersinfo');
        if (!response.ok) {
          throw new Error('Failed to fetch user data');
        }
        const data = await response.json();
  
        console.log('Fetched data:', data); // Debug için
        const loggedInUser = data.find((u) => u.email === authUser?.email);
  
        if (loggedInUser) {
          setUser(loggedInUser);
        } else {
          setError('User data not found for the logged-in user.');
        }
      } catch {
        setError('An error occurred while fetching user data');
      } finally {
        setIsLoading(false);
      }
    };
    console.log('authUser:', authUser);
  
    fetchUserData();
  }, [authUser]);
  

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (user) {
      setUser({ ...user, [e.target.name]: e.target.value })
    }
  }

  const handleGenderChange = (value: string) => {
    if (user) {
      setUser({ ...user, gender: value })
    }
  }

  const handleSubmit = async (event) => {
    event.preventDefault();
    if (!user) return;

    if (newPassword && newPassword !== confirmNewPassword) {
      setError('New passwords do not match');
      return;
    }

    const payload = {
      ...user,
      currentPassword: currentPassword || undefined,
      newPassword: newPassword || undefined
    };

    console.log('Payload being sent:', payload);

    try {
      const response = await fetch('/api/usersinfo', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      console.log('Response:', response);
      const data = await response.json();
      console.log('Response Data:', data);

      if (!response.ok) throw new Error(data.message || 'Failed to update profile');
    } catch (error) {
      console.error('Error:', error);
    }
  };

  if (isLoading) {
    return <div>Loading...</div>
  }

  if (error) {
    return <div>Error: {error}</div>
  }

  if (!user) {
    return <div>No user data found</div>
  }

  if (!authUser) {
    return <div>Loading user information...</div>;
  }
  

  return (
    <div className="container mx-auto px-4 py-8">
      <Card className="w-full max-w-2xl mx-auto">
        <CardHeader>
          <CardTitle className="text-2xl font-bold">Kullanıcı Profili</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit}>
            <div className="grid gap-4">
              <div className="grid gap-2">
                <Label htmlFor="Username">Kullanıcı Adı</Label>
                <Input
                  id="Username"
                  name="Username"
                  value={user.Username}
                  onChange={handleInputChange}
                  disabled={!isEditing}
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  name="email"
                  type="email"
                  value={user.email}
                  onChange={handleInputChange}
                  disabled={!isEditing}
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="adress">Adres</Label>
                <Input
                  id="adress"
                  name="adress"
                  value={user.adress}
                  onChange={handleInputChange}
                  disabled={!isEditing}
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="phone">Telefon</Label>
                <Input
                  id="phone"
                  name="phone"
                  value={user.phone}
                  onChange={handleInputChange}
                  disabled={!isEditing}
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="city">Şehir</Label>
                <Input
                  id="city"
                  name="city"
                  value={user.city}
                  onChange={handleInputChange}
                  disabled={!isEditing}
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="country">Ülke</Label>
                <Input
                  id="country"
                  name="country"
                  value={user.country}
                  onChange={handleInputChange}
                  disabled={!isEditing}
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="zipcode">Posta Kodu</Label>
                <Input
                  id="zipcode"
                  name="zipcode"
                  value={user.zipcode}
                  onChange={handleInputChange}
                  disabled={!isEditing}
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="gender">Cinsiyet</Label>
                <Select
                  disabled={!isEditing}
                  value={user.gender}
                  onValueChange={handleGenderChange}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select gender" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="erkek">Erkek</SelectItem>
                    <SelectItem value="kadın">Kadın</SelectItem>
                    <SelectItem value="diger">Diğer</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="grid gap-2">
                <Label htmlFor="currentPassword">Mevcut Şifre</Label>
                <Input
                  id="currentPassword"
                  name="currentPassword"
                  type="password"
                  value={currentPassword}
                  onChange={(e) => setCurrentPassword(e.target.value)}
                  disabled={!isEditing}
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="newPassword">Yeni Şifre</Label>
                <Input
                  id="newPassword"
                  name="newPassword"
                  type="password"
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  disabled={!isEditing}
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="confirmNewPassword">Yeni Şifreyi Onayla</Label>
                <Input
                  id="confirmNewPassword"
                  name="confirmNewPassword"
                  type="password"
                  value={confirmNewPassword}
                  onChange={(e) => setConfirmNewPassword(e.target.value)}
                  disabled={!isEditing}
                />
              </div>
            </div>
            {error && <p className="text-red-500 mt-2">{error}</p>}
            <CardFooter className="flex justify-between mt-4">
              {isEditing ? (
                <>
                  <Button type="submit">Değişiklikleri Kaydet</Button>
                  <Button variant="outline" onClick={() => setIsEditing(false)}>Geri</Button>
                </>
              ) : (
                <Button onClick={() => setIsEditing(true)}>Profili Düzenle</Button>
              )}
            </CardFooter>
          </form>
        </CardContent>
      </Card>
    </div>
  )
}