'use client';

import React, { createContext, useContext, useEffect, useState } from 'react';
import type { Category } from '@/src/types';

type CategoryContextType = {
  categories: Category[];
  // Mismas categorías, pero solo las que tienen al menos un producto en stock en todo su
  // subárbol (recursivo) -- para paneles de navegación/filtro; `categories` sigue completa
  // para lo demás (breadcrumbs, resolver nombre por id, etc).
  browsableCategories: Category[];
  loading: boolean;
  error: boolean;
};

const CategoryContext = createContext<CategoryContextType | null>(null);

export function CategoryProvider({ children }: { children: React.ReactNode }) {
  const [categories, setCategories] = useState<Category[]>([]);
  const [browsableCategories, setBrowsableCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  useEffect(() => {
    Promise.all([
      fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/categories`).then(r => r.json()),
      fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/categories?onlyWithProducts=true`).then(r => r.json()),
    ])
      .then(([all, browsable]) => {
        setCategories(all);
        setBrowsableCategories(browsable);
      })
      .catch(err => {
        console.error(err);
        setError(true);
      })
      .finally(() => setLoading(false));
  }, []);

  return (
    <CategoryContext.Provider
      value={{
        categories: categories.filter(c => c.id !== 0),
        browsableCategories: browsableCategories.filter(c => c.id !== 0),
        loading,
        error,
      }}
    >
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
