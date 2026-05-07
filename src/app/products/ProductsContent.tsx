"use client";

import { useState, useMemo } from 'react';
import { useSearchParams } from 'next/navigation';
import ProductCard from './productCard';
import ProductSidePanel from './productSidePanel';
import { useProducts } from '@/src/context/productContext';
import { useCategories, getAllDescendants } from '@/src/context/categoryContext';
import type { Product } from '@/src/types';

export default function ProductsContent() {
  const searchParams = useSearchParams();
  const searchQuery = searchParams.get('search')?.toLowerCase() || '';
  const category = searchParams.get('category') || '';

  const { products, loading } = useProducts();
  const { categories } = useCategories();
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);

  const descendantShortNames = useMemo(() => {
    if (!category) return [];
    const root = categories.find(c => c.shortName === category);
    if (!root) return [category];
    const descendants = getAllDescendants(root.id, categories);
    if (descendants.length === 0) return [category];
    return [category, ...descendants.map(d => d.shortName)];
  }, [categories, category]);

  const categoryTitle = useMemo(() => {
    if (!category) return 'Catálogo de Productos';
    const cat = categories.find(c => c.shortName === category);
    return cat ? cat.name : 'Catálogo de Productos';
  }, [categories, category]);

  const filteredProducts = useMemo(() => {
    let result = products;

    if (category && descendantShortNames.length > 0) {
      result = result.filter(product => descendantShortNames.includes(product.type ?? ''));
    }

    if (searchQuery) {
      result = result.filter(product =>
        product.name.toLowerCase().includes(searchQuery) ||
        product.description?.toLowerCase().includes(searchQuery)
      );
    }

    return result;
  }, [products, searchQuery, category, descendantShortNames]);

  return (
    <div className="flex-1">
      <main className="mx-auto py-12 px-6">
        <h1 className="main_title_text mb-6">
          {categoryTitle}
        </h1>

        {searchQuery && (
          <p className="text-gray-500 mb-6">
            Resultados para: <span className="font-semibold">{`"${searchQuery}"`}</span>
          </p>
        )}

        {loading ? (
          <p>Cargando productos...</p>
        ) : filteredProducts.length === 0 ? (
          <p className="text-gray-500">
            No se encontraron productos.
          </p>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-6">
            {filteredProducts.map((product) => (
              <ProductCard
                key={product.id}
                product={product}
                onClick={() => setSelectedProduct(product)}
              />
            ))}
          </div>
        )}

        {selectedProduct && (
          <ProductSidePanel
            product={selectedProduct}
            onClose={() => setSelectedProduct(null)}
          />
        )}
      </main>
    </div>
  );
}