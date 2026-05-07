'use client';

import React, { createContext, useContext, useEffect, useState } from 'react';
import type { Category } from '@/src/types';

type CategoryContextType = {
  categories: Category[];
  loading: boolean;
};

const CategoryContext = createContext<CategoryContextType | null>(null);

export function CategoryProvider({ children }: { children: React.ReactNode }) {
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/categories`)
      .then(r => r.json())
      .then(data => setCategories(data))
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  return (
    <CategoryContext.Provider value={{ categories: categories.filter(c => c.id !== 0), loading }}>
      {children}
    </CategoryContext.Provider>
  );
}

export function useCategories() {
  const ctx = useContext(CategoryContext);
  if (!ctx) throw new Error('useCategories must be used within a CategoryProvider');
  return ctx;
}

export function getAllDescendants(
  categoryId: number,
  categories: Category[]
): Category[] {
  const children = categories.filter(c => c.parentId === categoryId);
  if (children.length === 0) return [];
  return [
    ...children,
    ...children.flatMap(child => getAllDescendants(child.id, categories))
  ];
}
