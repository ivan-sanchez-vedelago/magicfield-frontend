'use client';

import Header from '@/src/components/Header';
import Link from 'next/link';
import { useEffect, useState, useMemo } from 'react';
import { useSearchParams } from 'next/navigation';
import ProductCard from './productCard';
import ProductSidePanel from './productSidePanel';
import { useProducts } from '@/src/context/productContext';

type Product = {
  id: number;
  name: string;
  description?: string;
  price: number;
  stock: number;
  imageUrls?: string[];
};

export default function ProductsPage() {
  const searchParams = useSearchParams();
  const searchQuery = searchParams.get('search')?.toLowerCase() || '';

  const { products, loading } = useProducts();
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);

  const filteredProducts = useMemo(() => {
    if (!searchQuery) return products;

    return products.filter(product =>
      product.name.toLowerCase().includes(searchQuery) ||
      product.description?.toLowerCase().includes(searchQuery)
    );
  }, [products, searchQuery]);

  return (
    <div className="min-h-screen">
      <main className="max-w-7xl mx-auto py-12 px-6">
        <h1 className="main_title_text mb-6">
          Catálogo de Productos
        </h1>

        {/* 🔎 Indicador de búsqueda activa */}
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
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
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
