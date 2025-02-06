'use client';

import { useState, useEffect, useCallback } from 'react';
import { Checkbox } from '@/components/ui/checkbox';
import { Slider } from '@/components/ui/slider';

interface Category {
  id: number;
  name: string;
  type: string;
}

interface ProductFiltersProps {
  type: string;
  onFilterChange: (filters: FilterState) => void;
}

interface FilterState {
  selectedCategories: string[];
  priceRange: [number, number];
}

async function fetchCategories(type: string): Promise<Category[]> {
  const response = await fetch(`/api/categories?type=${type}`);
  if (!response.ok) throw new Error('Kategoriler yüklenirken bir hata oluştu.');
  return response.json();
}

export default function ProductFilters({ type, onFilterChange }: ProductFiltersProps) {
  const [categories, setCategories] = useState<Category[]>([]);
  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);
  const [priceRange, setPriceRange] = useState<[number, number]>([0, 10000]);

  useEffect(() => {
    const loadData = async () => {
      try {
        const categoriesData = await fetchCategories(type);
        setCategories(categoriesData);
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };
    loadData();
  }, [type]);

  const updateFilters = useCallback(() => {
    onFilterChange({ selectedCategories, priceRange });
  }, [selectedCategories, priceRange, onFilterChange]);

  useEffect(() => {
    updateFilters();
  }, [updateFilters]);

  const handleCategoryChange = (category: string) => {
    setSelectedCategories((prev) =>
      prev.includes(category) ? prev.filter((c) => c !== category) : [...prev, category]
    );
  };

  return (
    <div className="space-y-6">
      {/* Kategoriler */}
      <div>
        <h2 className="text-lg font-semibold mb-2">Kategoriler</h2>
        {categories.map((category) => (
          <div key={category.id} className="flex items-center mb-2">
            <Checkbox
              id={`category-${category.id}`}
              checked={selectedCategories.includes(category.name)}
              onCheckedChange={() => handleCategoryChange(category.name)}
            />
            <label
              htmlFor={`category-${category.id}`}
              className="ml-2 text-sm font-medium leading-none"
            >
              {category.name}
            </label>
          </div>
        ))}
      </div>

      {/* Fiyat Aralığı */}
      <div>
        <h2 className="text-md font-semibold mb-2">Fiyat Aralığı</h2>
        <Slider
          min={0}
          max={10000}
          step={10}
          value={priceRange}
          onValueChange={(value) => setPriceRange([value[0], value[1]])}
        />
        <div className="flex justify-between mt-2">
          <span>{priceRange[0]} TL</span>
          <span>{priceRange[1]} TL</span>
        </div>
      </div>
    </div>
  );
}
