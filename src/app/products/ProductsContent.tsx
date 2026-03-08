"use client";

import { useState, useMemo } from 'react';
import { useSearchParams } from 'next/navigation';
import ProductCard from './productCard';
import ProductSidePanel from './productSidePanel';
import { useProducts } from '@/src/context/productContext';

type Product = {
  id: string;
  name: string;
  description?: string;
  price: number;
  stock: number;
  type?: string;
  imageUrls?: string[];
};

export default function ProductsContent() {
  const searchParams = useSearchParams();
  const searchQuery = searchParams.get('search')?.toLowerCase() || '';
  const category = searchParams.get('category') || '';

  const { products, loading } = useProducts();
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  console.log("RENDER products:", products);

  const categoryTitles: { [key: string]: string } = {
    'all': 'Catálogo de Productos',
    'single': 'Singles',
    'sealed': 'Producto Sellado',
    'other': 'Accesorios'
  };

  const filteredProducts = useMemo(() => {
    let result = products;

    // Filter by category
    if (category && category !== 'all') {
      const typeMap: { [key: string]: string } = {
        'single': 'SINGLE',
        'sealed': 'SEALED',
        'other': 'OTHER'
      };
      const typeFilter = typeMap[category];
      if (typeFilter) {
        result = result.filter(product => product.type === typeFilter);
      }
    }

    // Filter by search query
    if (searchQuery) {
      result = result.filter(product =>
        product.name.toLowerCase().includes(searchQuery) ||
        product.description?.toLowerCase().includes(searchQuery)
      );
    }

    return result;
  }, [products, searchQuery, category]);

  const title = categoryTitles[category] || 'Catálogo de Productos';

  return (
    <div className="flex-1">
      <main className="mx-auto py-12 px-6">
        <h1 className="main_title_text mb-6">
          {title}
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