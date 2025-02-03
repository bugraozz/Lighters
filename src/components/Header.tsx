import React from "react";
import Link from 'next/link';
import { Button } from "@/components/ui/button";
import { Search, Heart, Gift } from 'lucide-react';
import { ModeToggle } from '@/components/ModeToggle';
import { UserMenu } from '@/components/UserMenu';

export default function Header() {
    return (
        <header className="bg-background border-b">
          <nav className="bg-background border-b">
            <div className="container mx-auto px-4 py-3 flex items-center justify-between">
              <div className="flex items-center space-x-0 md:space-x-4">
                <Link href="/cakmak">
                  <Button variant="ghost" className="pl-0">Çakmaklar</Button>
                </Link>
                <Link href="/kilif">
                  <Button variant="ghost" className="pl-0">Kılıflar</Button>
                </Link>
              </div>
              <div className="text-2xl font-italic">
                <Link href="/">
                    <p><Gift color="red" size={30}/></p>
                </Link>
              </div>
              <div className="flex items-center space-x-3">
                <Link href="/search">
                <Search className="h-5 w-5" />
                </Link>
                <UserMenu />                
                <Link href="/wishlist">
                  <Heart className="h-5 w-5" />
                </Link>
                <ModeToggle  />
              </div>
            </div>
          </nav>
        </header>
    );
}
