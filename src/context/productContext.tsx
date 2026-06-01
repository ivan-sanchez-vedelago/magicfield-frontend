'use client';

import React, { createContext, useContext, useEffect, useState } from 'react';
import type { Product } from '@/src/types';

export type { Product };

type ProductContextType = {
  products: Product[];
  loading: boolean;
  error: boolean;
  reloadProducts: () => void;
};

const ProductContext = createContext<ProductContextType | null>(null);

export function ProductProvider({ children }: { children: React.ReactNode }) {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  const loadProducts = () => {
    setLoading(true);
    setError(false);

    fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/products`)
      .then(r => r.json())
      .then(data => {
        setProducts(data);
      })
      .catch(err => {
        console.error(err);
        setError(true);
      })
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    loadProducts();
  }, []);

  useEffect(() => {
  }, [products]);

  return (
    <ProductContext.Provider
      value={{
        products,
        loading,
        error,
        reloadProducts: loadProducts
      }}
    >
      {children}
    </ProductContext.Provider>
  );
}

export function useProducts() {
  const ctx = useContext(ProductContext);

  if (!ctx) {
    throw new Error('useProducts must be used inside ProductProvider');
  }

  return ctx;
}