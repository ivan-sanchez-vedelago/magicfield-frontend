'use client';

import { useMemo, useState } from 'react';
import ProductCard from '@/src/app/products/productCard';
import ProductSidePanel from '@/src/app/products/productSidePanel';
import { parseBulkList, type BulkListLine } from '@/src/utils/parseBulkList';
import { useCart } from '@/src/context/cartContext';
import type { Product } from '@/src/types';

const EXAMPLE_LIST = '4 Lightning Bolt\n2 Sol Ring\n1 Black Lotus';

interface BulkResultRow extends BulkListLine {
  products: Product[];
}

interface BulkCardGroup {
  name: string;
  quantity: number;
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

function BulkCardSlider({
  group,
  onProductClick,
}: {
  group: BulkCardGroup;
  onProductClick: (product: Product) => void;
}) {
  const [current, setCurrent] = useState(0);
  const [isChangingVersion, setIsChangingVersion] = useState(false);
  const product = group.products[current];

  const changeVersion = (getNext: (index: number) => number) => {
    if (isChangingVersion) return;
    setIsChangingVersion(true);
    window.setTimeout(() => {
      setCurrent(getNext);
      setIsChangingVersion(false);
    }, 150);
  };

  const previous = () => {
    changeVersion(index => index === 0 ? group.products.length - 1 : index - 1);
  };

  const next = () => {
    changeVersion(index => index === group.products.length - 1 ? 0 : index + 1);
  };

  return (
    <div className={`min-w-0 h-full transition-opacity duration-300 ease-in-out ${
      isChangingVersion ? 'opacity-0' : 'opacity-100'
    }`}>
      <ProductCard key={product.id} product={product} onClick={() => onProductClick(product)}>
        {group.products.length > 1 && (
          <div className="flex items-center justify-center gap-3 mt-2">
            <button
              type="button"
              className="button_secondary px-3 py-1"
              onClick={(event) => {
                event.stopPropagation();
                previous();
              }}
              aria-label={`Versión anterior de ${group.name}`}
            >
              ‹
            </button>
            <span className="small_text secondary_text_color">
              Versión {current + 1}/{group.products.length}
            </span>
            <button
              type="button"
              className="button_secondary px-3 py-1"
              onClick={(event) => {
                event.stopPropagation();
                next();
              }}
              aria-label={`Siguiente versión de ${group.name}`}
            >
              ›
            </button>
          </div>
        )}
      </ProductCard>
    </div>
  );
}

export default function BulkFilterPage() {
  const [text, setText] = useState('');
  const [results, setResults] = useState<BulkResultRow[] | null>(null);
  const [loading, setLoading] = useState(false);
  const [fetchError, setFetchError] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [outOfStockOpen, setOutOfStockOpen] = useState(false);
  const [bulkCartMode, setBulkCartMode] = useState<'cheapest' | 'most-expensive' | null>(null);
  const [bulkCartProductIds, setBulkCartProductIds] = useState<string[]>([]);
  const [hasPastedList, setHasPastedList] = useState(false);
  const { setProductQuantity, removeProduct, showFeedback, dispatch } = useCart();

  const cardGroups = useMemo<BulkCardGroup[]>(() => {
    if (!results) return [];

    const groups = new Map<string, BulkCardGroup>();
    results.forEach(row => {
      row.products.forEach(product => {
        const key = product.name.toLocaleLowerCase();
        const group = groups.get(key);
        if (group) {
          if (!group.products.some(existing => existing.id === product.id)) {
            group.products.push(product);
          }
          group.quantity += row.quantity;
        } else {
          groups.set(key, {
            name: product.name,
            quantity: row.quantity,
            products: [product],
          });
        }
      });
    });

    return Array.from(groups.values()).map(group => ({
      ...group,
      products: [...group.products].sort((a, b) => a.price - b.price),
    }));
  }, [results]);

  const outOfStockRows = results?.filter(row => row.products.length === 0) ?? [];
  const searchedCardsCount = results?.length ?? 0;
  const inStockCardsCount = cardGroups.length;

  const handleSearch = async (inputText = text) => {
    const parsed = parseBulkList(inputText);
    if (parsed.length === 0) return;

    setLoading(true);
    setFetchError(false);
    setResults(null);
    setBulkCartMode(null);
    setBulkCartProductIds([]);
    setHasPastedList(false);

    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/products/catalog/bulk-search`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ queries: parsed.map(p => p.name) }),
      });
      if (!response.ok) throw new Error('Bulk search failed');
      const data: { query: string; products: Product[] }[] = await response.json();

      setResults(parsed.map((line, i) => ({ ...line, products: data[i]?.products ?? [] })));
    } catch (err) {
      console.error('Error al filtrar en bulk:', err);
      setFetchError(true);
    } finally {
      setLoading(false);
    }
  };

  const addBulkSelection = (mode: 'cheapest' | 'most-expensive') => {
    if (bulkCartMode === mode) return;

    const replacingSelection = bulkCartMode !== null;
    bulkCartProductIds.forEach(productId => removeProduct(productId, false));

    const selected = cardGroups.map(group => {
      const product = mode === 'cheapest'
        ? group.products[0]
        : group.products[group.products.length - 1];
      const quantity = Math.min(group.quantity, product.stock);
      if (quantity > 0) {
        if (replacingSelection) {
          dispatch({
            type: 'ADD_ITEM',
            item: {
              productId: product.id,
              name: product.name,
              displayName: product.displayName,
              price: product.price,
              quantity,
              stock: product.stock,
              imageUrl: product.imageUrls?.[0],
              set: product.set,
              collectorNumber: product.collectorNumber,
              conditionName: product.conditionName,
              languageName: product.languageName,
              finishName: product.finishName,
            },
          });
        } else {
          setProductQuantity(product, quantity, false);
        }
      }
      return product.id;
    });

    setBulkCartMode(mode);
    setBulkCartProductIds(selected);
    showFeedback(replacingSelection ? 'Carrito actualizado' : 'Productos añadidos al carrito');
  };

  return (
    <div className="flex-1">
      <main className="mx-auto py-12 px-6">
        <div className="max-w-4xl">
          <h1 className="main_title_text mb-6">Filtrar en bulk</h1>

          <p className="normal_text secondary_text_color mb-4">
            Pegá tu lista de cartas, una por línea, con el formato <strong>&lt;cantidad&gt; &lt;nombre&gt;</strong> (ej. &quot;4 Lightning Bolt&quot; o &quot;4x Lightning Bolt&quot;).
            La cantidad es opcional, podés pegar solo los nombres, uno por línea o separados por &quot;.&quot;.
            Vamos a buscar todos los productos del catálogo cuyo nombre coincida total o parcialmente con cada uno.
          </p>
        </div>

        <form
          className="max-w-4xl mx-auto"
          onSubmit={event => {
            event.preventDefault();
            void handleSearch();
          }}
        >
            <div className="grid md:grid-cols-2 gap-6 mb-4">
              <textarea
                className="input_field"
                rows={8}
                placeholder={EXAMPLE_LIST}
                value={text}
                onChange={e => setText(e.target.value)}
                onPaste={() => setHasPastedList(true)}
                onKeyDown={event => {
                  if (event.key !== 'Enter' || event.shiftKey || !hasPastedList) return;
                  event.preventDefault();
                  setHasPastedList(false);
                  void handleSearch();
                }}
              />

              <div className="box_border">
                <p className="small_text secondary_text_color mb-2">Ejemplo:</p>
                <pre className="normal_text mb-3 whitespace-pre-wrap">{EXAMPLE_LIST}</pre>
                <button
                  type="button"
                  className="button_secondary small_button"
                  onClick={() => {
                    setText(EXAMPLE_LIST);
                    void handleSearch(EXAMPLE_LIST);
                  }}
                >
                  Usar este ejemplo
                </button>
              </div>
            </div>

            <div className="flex justify-center">
              <button
                type="submit"
                className="button_primary medium_button mb-8"
                disabled={loading || parseBulkList(text).length === 0}
              >
                {loading ? 'Buscando...' : 'Buscar'}
              </button>
            </div>
        </form>

        {loading && <ResultsSkeleton />}

        {!loading && fetchError && (
          <p className="text-red-500">No se pudo completar la búsqueda. Intenta nuevamente.</p>
        )}

        {!loading && !fetchError && results && (
          <div>
            <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4 mb-6">
              <p className="normal_text">
                <strong>{inStockCardsCount} con stock</strong> de <strong>{searchedCardsCount} cartas buscadas.</strong>
              </p>

              <div className="normal_text flex flex-wrap items-center gap-2">
                <span>¿Deseas agregar las versiones</span>
                <button
                  type="button"
                  className="button_secondary small_button"
                  onClick={() => addBulkSelection('cheapest')}
                  disabled={cardGroups.length === 0}
                >
                  Más baratas
                </button>
                <span>o las</span>
                <button
                  type="button"
                  className="button_secondary small_button"
                  onClick={() => addBulkSelection('most-expensive')}
                  disabled={cardGroups.length === 0}
                >
                  Más caras
                </button>
                <span>a tu carrito?</span>
              </div>
            </div>

            {outOfStockRows.length > 0 && (
              <div className="box_border mb-8">
                <button
                  type="button"
                  className="w-full flex items-center justify-between normal_text text-left"
                  onClick={() => setOutOfStockOpen(open => !open)}
                  aria-expanded={outOfStockOpen}
                >
                  <strong>Sin stock por el momento ({outOfStockRows.length})</strong>
                  <span
                    className={`chevron transition-transform duration-300 ${
                      outOfStockOpen ? 'rotate-[225deg]' : 'rotate-[45deg]'
                    }`}
                    aria-hidden="true"
                  />
                </button>
                {outOfStockOpen && (
                  <ul className="mt-4 border-t pt-3 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-x-3 gap-y-1 normal_text secondary_text_color">
                    {outOfStockRows.map((row, index) => (
                      <li key={`${row.name}-${index}`} className="flex min-w-0 items-start gap-1">
                        <span aria-hidden="true" className="flex-shrink-0">•</span>
                        <span className="min-w-0 break-words">{row.name}</span>
                      </li>
                    ))}
                  </ul>
                )}
              </div>
            )}

            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-6">
              {cardGroups.map(group => (
                <BulkCardSlider
                  key={group.name}
                  group={group}
                  onProductClick={setSelectedProduct}
                />
              ))}
            </div>
          </div>
        )}

        {selectedProduct && (
          <ProductSidePanel product={selectedProduct} onClose={() => setSelectedProduct(null)} />
        )}
      </main>
    </div>
  );
}
