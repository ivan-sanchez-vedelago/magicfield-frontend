'use client';

import React, { createContext, useContext, useEffect, useState } from 'react';

export type Product = {
  id: number;
  name: string;
  description?: string;
  price: number;
  stock: number;
  imageUrls?: string[];
};

type ProductContextType = {
  products: Product[];
  loading: boolean;
  reloadProducts: () => void;
};

const ProductContext = createContext<ProductContextType | null>(null);

export function ProductProvider({ children }: { children: React.ReactNode }) {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

  const loadProducts = () => {
    setLoading(true);

    fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/products`)
      .then(r => r.json())
      .then(setProducts)
      .catch(console.error)
      .finally(() => setLoading(false));
  };

  useEffect(loadProducts, []);

  return (
    <ProductContext.Provider
      value={{
        products,
        loading,
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