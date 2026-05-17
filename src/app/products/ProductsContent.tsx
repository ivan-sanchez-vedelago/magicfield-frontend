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

function getPageNumbers(currentPage: number, totalPages: number): (number | '...')[] {
  if (totalPages <= 7) return Array.from({ length: totalPages }, (_, i) => i);
  const items: (number | '...')[] = [];
  const windowStart = Math.max(0, currentPage - 1);
  const windowEnd   = Math.min(totalPages - 1, currentPage + 1);
  const leftEdge    = Math.max(0, Math.min(windowStart, totalPages - 3));
  const rightEdge   = Math.min(totalPages - 1, Math.max(windowEnd, 2));
  items.push(0);
  if (leftEdge > 1) items.push('...');
  for (let i = Math.max(1, leftEdge); i <= Math.min(totalPages - 2, rightEdge); i++) items.push(i);
  if (rightEdge < totalPages - 2) items.push('...');
  items.push(totalPages - 1);
  return items;
}

function PaginationBar({
  currentPage, totalPages, onPageChange,
}: {
  currentPage: number; totalPages: number;
  onPageChange: (p: number) => void;
}) {
  const pages = getPageNumbers(currentPage, totalPages);
  return (
    <div className="flex items-center justify-end gap-2 flex-wrap">
      <div className="flex items-center gap-1">
        <button
          onClick={() => onPageChange(Math.max(0, currentPage - 1))}
          disabled={currentPage === 0}
          className="pagination_btn disabled:opacity-30 disabled:cursor-not-allowed"
        >
          &#8249;
        </button>
        {pages.map((page, i) =>
          page === '...' ? (
            <span key={`d${i}`} className="pagination_ellipsis">&#8230;</span>
          ) : (
            <button
              key={page}
              onClick={() => onPageChange(page as number)}
              className={page === currentPage ? 'pagination_btn_active' : 'pagination_btn'}
            >
              {(page as number) + 1}
            </button>
          )
        )}
        <button
          onClick={() => onPageChange(Math.min(totalPages - 1, currentPage + 1))}
          disabled={currentPage >= totalPages - 1}
          className="pagination_btn disabled:opacity-30 disabled:cursor-not-allowed"
        >
          &#8250;
        </button>
      </div>
    </div>
  );
}

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
          <p className="text-gray-500 mb-4">
            Resultados para: <span className="font-semibold">{`"${searchQuery}"`}</span>
          </p>
        )}

        {/* Pagination bar — top */}
        {products.length > 0 && (
          <div className="mb-4">
            <PaginationBar
              currentPage={currentPage}
              totalPages={totalPages}
              onPageChange={setCurrentPage}
            />
          </div>
        )}

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

            {/* Pagination bar — bottom */}
            <div className="mt-6">
              <PaginationBar
                currentPage={currentPage}
                totalPages={totalPages}
                onPageChange={setCurrentPage}
              />
            </div>
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