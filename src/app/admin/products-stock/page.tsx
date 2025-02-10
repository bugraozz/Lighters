'use client';

import React, { useState, useEffect, useCallback } from 'react';
import { Loader2, ArrowUpDown} from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { toast } from "@/hooks/use-toast";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";

const formatPrice = (price: number | string): string => {
    if (typeof price === 'number') {
        return price.toFixed(2);
    } else if (typeof price === 'string') {
        const numPrice = parseFloat(price);
        return isNaN(numPrice) ? '0.00' : numPrice.toFixed(2);
    }
    return '0.00';
}

interface Size {
    size: string;
    stock: number;
}

interface Product {
    id: number;
    name: string;
    price: number | string | null;
    category: string;
    type: string;
    sizes: Size[];
}

export default function AdminProductsStockPage() {
    const { getToken } = useAuth();
    const [products, setProducts] = useState<Product[]>([]);
    const [loading, setLoading] = useState(true);
    const [sortColumn, setSortColumn] = useState<keyof Product>('name');
    const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('asc');
    const [searchTerm, setSearchTerm] = useState('');
    const [typeFilter, setTypeFilter] = useState<string>('all');

    const fetchProducts = useCallback(async () => {
        try {
            const token = getToken();
            const response = await fetch('/api/products', {
                method: 'GET',
                headers: { 
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
            });
            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.error || 'Ürünler yüklenirken bir hata oluştu.');
            }
            const data = await response.json();
           
            setProducts(data);
            setLoading(false);
        } catch (error) {
            console.error('Error fetching products:', error);
            setProducts([]);
            setLoading(false);
            toast({
                title: "Hata",
                description: (error as Error).message || "Ürünler yüklenirken bir hata oluştu.",
                variant: "destructive",
            });
        }
    }, [getToken]);

    useEffect(() => {
        fetchProducts();
    }, [fetchProducts]);

    const sortProducts = (a: Product, b: Product) => {
        if (a[sortColumn] == null || b[sortColumn] == null) return 0;
        if (a[sortColumn] < b[sortColumn]) return sortDirection === 'asc' ? -1 : 1;
        if (a[sortColumn] > b[sortColumn]) return sortDirection === 'asc' ? 1 : -1;
        return 0;
    }

    const handleSort = (column: keyof Product) => {
        if (column === sortColumn) {
            setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
        } else {
            setSortColumn(column);
            setSortDirection('asc');
        }
    }


    const filteredProducts = products
        .filter(product => {
            const matchesSearch = 
                product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                product.category.toLowerCase().includes(searchTerm.toLowerCase()) ||
                product.type.toLowerCase().includes(searchTerm.toLowerCase());
            
            const matchesType = 
                typeFilter === 'all' || 
                (typeFilter === 'kilif' && product.type.toLowerCase() === 'kilif') ||
                (typeFilter === 'cakmak' && product.type.toLowerCase() === 'cakmak');

            return matchesSearch && matchesType;
        })
        .sort(sortProducts);

    return (
        <div className="container mx-auto py-10">
            <h1 className="text-3xl font-bold mb-6">Ürünler</h1>
            <div className="flex items-center space-x-4 mb-4">
                <Input
                    type="text"
                    placeholder="Ürün ara..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="max-w-sm"
                />
                <Select value={typeFilter} onValueChange={setTypeFilter}>
                    <SelectTrigger className="w-[180px]">
                        <SelectValue placeholder="Cinsiyet Seç" />
                    </SelectTrigger>
                    <SelectContent>
                        <SelectItem value="all">Tümü</SelectItem>
                        <SelectItem value="kilif">Kılıf</SelectItem>
                        <SelectItem value="cakmak">Çakmak</SelectItem>
                    </SelectContent>
                </Select>
            </div>
            {loading ? (
                <div className="flex items-center justify-center h-64">
                    <Loader2 className="h-16 w-16 animate-spin text-primary" />
                </div>
            ) : (
                <div className="rounded-md border">
                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead className="w-[250px] text-center">
                                    <Button variant="ghost" onClick={() => handleSort('name')}>
                                        Ürün Adı
                                        <ArrowUpDown className="ml-2 h-4 w-4" />
                                    </Button>
                                </TableHead>
                                <TableHead className="text-center">
                                    <Button variant="ghost" onClick={() => handleSort('category')}>
                                        Kategori
                                        <ArrowUpDown className="ml-2 h-4 w-4" />
                                    </Button>
                                </TableHead>
                                <TableHead className="text-center">
                                    <Button variant="ghost" onClick={() => handleSort('type')}>
                                        Tür
                                        <ArrowUpDown className="ml-2 h-4 w-4" />
                                    </Button>
                                </TableHead>
                                <TableHead className="text-center">
                                    <Button variant="ghost" onClick={() => handleSort('price')}>
                                        Fiyat
                                        <ArrowUpDown className="ml-2 h-4 w-4" />
                                    </Button>
                                </TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {filteredProducts.map((product) => (
                                <TableRow key={product.id}>
                                    <TableCell className="font-medium text-center">{product.name}</TableCell>
                                    <TableCell  className="font-medium text-center">{product.category}</TableCell>
                                    <TableCell  className="font-medium text-center">{product.type}</TableCell>
                                    <TableCell className="text-center">
                                        {product.price !== undefined && product.price !== null
                                            ? `${formatPrice(product.price)} TL`
                                            : "Fiyat Yok"}
                                    </TableCell>
                                  
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </div>
            )}
        </div>
    );
}


