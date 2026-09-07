'use client';

import { useState } from 'react';
import ProductCard from '@/src/app/products/productCard';
import ProductSidePanel from '@/src/app/products/productSidePanel';
import { parseBulkList, type BulkListLine } from '@/src/utils/parseBulkList';
import type { Product } from '@/src/types';

const EXAMPLE_LIST = '4 Lightning Bolt\n2 Sol Ring\n1 Black Lotus';

interface BulkResultRow extends BulkListLine {
  products: Product[];
}

function ResultsSkeleton() {
  return (
    <div className="space-y-6">
      {Array.from({ length: 3 }).map((_, i) => (
        <div key={i} className="animate-pulse">
          <div className="h-4 w-40 bg-gray-700/50 rounded mb-3" />
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-6">
            <div className="product_box box_border">
              <div className="product_image bg-gray-700/50 rounded" />
              <div className="h-4 bg-gray-700/50 rounded mt-2 mx-2" />
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}

export default function BulkFilterPage() {
  const [text, setText] = useState('');
  const [results, setResults] = useState<BulkResultRow[] | null>(null);
  const [loading, setLoading] = useState(false);
  const [fetchError, setFetchError] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);

  const handleSearch = async () => {
    const parsed = parseBulkList(text);
    if (parsed.length === 0) return;

    setLoading(true);
    setFetchError(false);
    setResults(null);

    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/products/catalog/bulk-search`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ queries: parsed.map(p => p.name) }),
      });
      if (!response.ok) throw new Error('Bulk search failed');
      const data: { query: string; products: Product[] }[] = await response.json();

      // La respuesta viene en el mismo orden/índice que "parsed" -- se zipea acá para juntar
      // la cantidad (que es puramente de UI, el backend no la conoce) con los productos.
      setResults(parsed.map((line, i) => ({ ...line, products: data[i]?.products ?? [] })));
    } catch (err) {
      console.error('Error al filtrar en bulk:', err);
      setFetchError(true);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex-1">
      <main className="mx-auto py-12 px-6">
        <div className="max-w-4xl">
          <h1 className="main_title_text mb-6">Filtrar en bulk</h1>

          <p className="normal_text secondary_text_color mb-4">
            Pegá tu lista de cartas, una por línea, con el formato <strong>cantidad nombre</strong> (ej. &quot;4 Lightning Bolt&quot;).
            Vamos a buscar todos los productos del catálogo cuyo nombre coincida total o parcialmente con cada línea.
          </p>

          <div className="box_border mb-6">
            <p className="small_text secondary_text_color mb-2">Ejemplo:</p>
            <pre className="normal_text mb-3 whitespace-pre-wrap">{EXAMPLE_LIST}</pre>
            <button
              type="button"
              className="button_secondary small_button"
              onClick={() => setText(EXAMPLE_LIST)}
            >
              Usar este ejemplo
            </button>
          </div>

          <textarea
            className="input_field mb-4"
            rows={8}
            placeholder={EXAMPLE_LIST}
            value={text}
            onChange={e => setText(e.target.value)}
          />

          <button
            type="button"
            className="button_primary medium_button mb-8"
            onClick={handleSearch}
            disabled={loading || parseBulkList(text).length === 0}
          >
            {loading ? 'Buscando...' : 'Buscar'}
          </button>
        </div>

        {loading && <ResultsSkeleton />}

        {!loading && fetchError && (
          <p className="text-red-500">No se pudo completar la búsqueda. Intenta nuevamente.</p>
        )}

        {!loading && !fetchError && results && (
          <div className="space-y-8">
            {results.map((row, i) => (
              <div key={i}>
                <h2 className="subtitle_text mb-3">
                  {row.quantity}x {row.name}
                </h2>
                {row.products.length === 0 ? (
                  <p className="normal_text secondary_text_color">Sin resultados para esta carta.</p>
                ) : (
                  <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-6">
                    {row.products.map(product => (
                      <ProductCard
                        key={product.id}
                        product={product}
                        onClick={() => setSelectedProduct(product)}
                      />
                    ))}
                  </div>
                )}
              </div>
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
