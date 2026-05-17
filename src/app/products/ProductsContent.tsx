"use client";

import { useState, useMemo, useEffect } from 'react';
import { useSearchParams } from 'next/navigation';
import ProductCard from './productCard';
import ProductSidePanel from './productSidePanel';
import { useCategories, getAllDescendants } from '@/src/context/categoryContext';
import type { Product } from '@/src/types';

interface PagedProducts {
  content: Product[];
  totalElements: number;
  totalPages: number;
  currentPage: number;
}

const PAGE_SIZE_OPTIONS = [10, 20, 30];

export default function ProductsContent() {
  const searchParams = useSearchParams();
  const searchQuery = searchParams.get('search')?.toLowerCase() || '';
  const category = searchParams.get('category') || '';

  const { categories } = useCategories();
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(false);
  const [totalPages, setTotalPages] = useState(0);
  const [totalElements, setTotalElements] = useState(0);
  const [currentPage, setCurrentPage] = useState(0);
  const [pageSize, setPageSize] = useState(20);

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

  // Reset to page 0 when filters change
  useEffect(() => {
    setCurrentPage(0);
  }, [searchQuery, category]);

  const categoriesParam = descendantShortNames.join(',');

  useEffect(() => {
    const controller = new AbortController();
    const params = new URLSearchParams();
    params.set('page', String(currentPage));
    params.set('size', String(pageSize));
    if (searchQuery) params.set('search', searchQuery);
    if (categoriesParam) params.set('categories', categoriesParam);

    setLoading(true);
    fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/products/paged?${params}`, {
      signal: controller.signal,
    })
      .then(r => r.json())
      .then((data: PagedProducts) => {
        setProducts(data.content);
        setTotalPages(data.totalPages);
        setTotalElements(data.totalElements);
      })
      .catch(err => { if (err.name !== 'AbortError') console.error(err); })
      .finally(() => setLoading(false));

    return () => controller.abort();
  }, [currentPage, pageSize, searchQuery, categoriesParam]);

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

        {/* Page size selector */}
        <div className="flex items-center gap-2 mb-6">
          <span className="small_text text-gray-500">Mostrar:</span>
          {PAGE_SIZE_OPTIONS.map(size => (
            <button
              key={size}
              onClick={() => { setPageSize(size); setCurrentPage(0); }}
              className={`px-3 py-1 rounded text-sm font-medium border transition-colors ${
                pageSize === size
                  ? 'bg-gray-800 text-white border-gray-800'
                  : 'bg-white text-gray-600 border-gray-300 hover:border-gray-500'
              }`}
            >
              {size}
            </button>
          ))}
        </div>

        {loading ? (
          <p>Cargando productos...</p>
        ) : products.length === 0 ? (
          <p className="text-gray-500">
            No se encontraron productos.
          </p>
        ) : (
          <>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-6">
              {products.map((product) => (
                <ProductCard
                  key={product.id}
                  product={product}
                  onClick={() => setSelectedProduct(product)}
                />
              ))}
            </div>

            {/* Pagination controls */}
            {totalPages > 1 && (
              <div className="flex items-center justify-center gap-4 mt-8">
                <button
                  onClick={() => setCurrentPage(p => Math.max(0, p - 1))}
                  disabled={currentPage === 0}
                  className="px-4 py-2 rounded border border-gray-300 text-sm font-medium disabled:opacity-40 disabled:cursor-not-allowed hover:bg-gray-50 transition-colors"
                >
                  Anterior
                </button>
                <span className="small_text text-gray-600">
                  Página {currentPage + 1} de {totalPages} · {totalElements} productos
                </span>
                <button
                  onClick={() => setCurrentPage(p => Math.min(totalPages - 1, p + 1))}
                  disabled={currentPage >= totalPages - 1}
                  className="px-4 py-2 rounded border border-gray-300 text-sm font-medium disabled:opacity-40 disabled:cursor-not-allowed hover:bg-gray-50 transition-colors"
                >
                  Siguiente
                </button>
              </div>
            )}
          </>
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