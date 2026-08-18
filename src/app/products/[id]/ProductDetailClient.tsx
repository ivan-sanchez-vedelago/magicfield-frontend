'use client';

import { useCart } from '../../../context/cartContext';
import LoadingLink from '@/src/components/navigation/LoadingLink';
import { formatPrice } from '@/src/utils/formatPrice';
import { groupProductVariants } from '@/src/utils/groupSingles';
import { Fragment, useEffect, useMemo, useState } from "react";
import { useProducts } from '../../../context/productContext';
import { useCategories } from '../../../context/categoryContext';
import { getBreadcrumbPath } from '@/src/utils/breadcrumb';
import ProductImageGallery from '@/src/components/product/ProductImageGallery';
import RelatedProductsCarousel from '@/src/components/product/RelatedProductsCarousel';
import type { Product } from '@/src/types';
import { ChevronDown, ChevronUp } from 'lucide-react';

export default function ProductDetailClient({
  product,
  variants,
}: {
  product: Product;
  variants: Product[];
}) {

  const { products: allProducts, loading: productsLoading } = useProducts();
  const { categories } = useCategories();

  const [showDetails, setShowDetails] = useState(false);

  const relatedProducts = useMemo(() => {
    if (!allProducts.length) return [];

    const MAX_RELATED = 20;
    const seen = new Set<string>();
    const result: Product[] = [];

    const add = (candidates: Product[]) => {
      for (const p of candidates) {
        if (!seen.has(p.id) && result.length < MAX_RELATED) {
          seen.add(p.id);
          result.push(p);
        }
      }
    };

    // Excluye también las otras variantes (condición/idioma) de esta misma carta+finish (o
    // nombre+set para sellados): ya se ven en el selector de arriba, no tiene sentido
    // repetirlas como "relacionados".
    const variantIds = new Set(variants.map(v => v.id));
    const others = groupProductVariants(allProducts.filter(p => !variantIds.has(p.id)));

    // 1. Coincidencia por nombre
    const words = product.name.toLowerCase().split(" ");
    add(others.filter(p => words.some(w => p.name.toLowerCase().includes(w))));

    // 2. Mismo set (presence-based: aplica a singles y sellados por igual)
    if (product.set) {
      add(others.filter(p => p.set === product.set));
    }

    // 3. Misma categoría
    if (product.categoryId) {
      add(others.filter(p => p.categoryId === product.categoryId));
    }

    // 4. Relleno con cualquier otro producto
    add(others);

    return result;
  }, [allProducts, product, variants]);

  const breadcrumbPath = useMemo(() => {
    return getBreadcrumbPath(product.categoryId, categories);
  }, [product.categoryId, categories]);

  const detailFields = [
    { label: 'Nombre', value: product.displayName ?? product.name },
    { label: 'Finish', value: product.finishName },
    { label: 'Set', value: product.set },
    { label: 'N° de coleccionista', value: product.collectorNumber ? `#${product.collectorNumber}` : undefined },
  ].filter(field => field.value);

  // Símbolo del set (SVG crudo, ya normalizado a currentColor del lado del backend) para
  // mostrar junto a la fila "Set:" -- inline (no <img>) justamente para que herede el color
  // del texto circundante en modo claro/oscuro en vez de quedar pegado al color del archivo.
  const [setIconSvg, setSetIconSvg] = useState<string | null>(null);

  useEffect(() => {
    if (!product.set) {
      setSetIconSvg(null);
      return;
    }
    let cancelled = false;

    fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/scryfall/sets`)
      .then(r => r.json())
      .then((sets: { code: string; name: string }[]) => {
        if (cancelled) return null;
        const match = sets.find(s => s.name === product.set);
        if (!match) return null;
        return fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/scryfall/sets/${match.code}/icon`)
          .then(r => (r.ok ? r.json() : null));
      })
      .then((data: { svg: string } | null) => {
        if (!cancelled && data) setSetIconSvg(data.svg);
      })
      .catch(() => {});

    return () => { cancelled = true; };
  }, [product.set]);

  return (
    <main className="mx-auto px-6 py-8 space-y-10">

      <div className="normal_text box_border">
        {breadcrumbPath.length > 0 ? (
          <>
            {breadcrumbPath.map((item, index) => (
              <span key={item.id}>
                {index > 0 && <span> / </span>}
                <LoadingLink className="underline" href={`/products?category=${item.shortName}`}>
                  {item.name}
                </LoadingLink>
              </span>
            ))}
            <span> / </span>
            <span className="">{product.displayName ?? product.name}</span>
          </>
        ) : (
          <>
            <LoadingLink className="underline" href="/">Home</LoadingLink>
            <span> / </span>
            <span className="">{product.displayName ?? product.name}</span>
          </>
        )}
      </div>

      <section className="detail_page_container">
        <div className="detail_image_box box_border">
          <ProductImageGallery
            images={product.imageUrls || []}
            name={product.displayName ?? product.name}
          />
        </div>

        <div className="detail_page_info">
          <h1 className="product_detail_title_text">{product.displayName ?? product.name}</h1>

          <div className="box_border">
            <VariantsTable variants={variants} />
          </div>

          <div className="box_border mt-6">
            <button
              className="subtitle_text text-left w-full flex items-center justify-between"
              onClick={() => setShowDetails(v => !v)}
            >
              Detalles del producto
              {showDetails ? (
                <ChevronUp className="w-5 h-5 flex-shrink-0" />
              ) : (
                <ChevronDown className="w-5 h-5 flex-shrink-0" />
              )}
            </button>

            {showDetails && (
              <div className="normal_text secondary_text_color">
                <hr className="my-2" />
                <div className="p-4 grid grid-cols-2 gap-6">
                  {detailFields.map(field => (
                    <Fragment key={field.label}>
                      <b>{field.label}:</b>
                      <span className="relative">
                        {field.label === 'Set' && setIconSvg && (
                          <span
                            className="absolute right-full mr-1.5 inline-block h-5 w-5 flex-shrink-0 [&_svg]:w-full [&_svg]:h-full"
                            dangerouslySetInnerHTML={{ __html: setIconSvg }}
                          />
                        )}
                        {field.value}
                      </span>
                    </Fragment>
                  ))}
                </div>
                {product.description && (
                  <p className="normal_text" style={{fontStyle: 'italic', paddingTop: '0.5rem'}}>
                    {product.description}
                  </p>
                )}
              </div>
            )}
          </div>
        </div>
      </section>

      <section className="px-6">
        <h2 className="normal_text mb-2">
          Productos relacionados
        </h2>

        <RelatedProductsCarousel products={relatedProducts} loading={productsLoading} />
      </section>
    </main>
  );
}

// Tabla de variantes (condición/idioma): cada una es su propio Product.id en la base, así
// que agregar dos variantes distintas al carrito genera dos líneas independientes, igual
// que con productos no relacionados -- no requiere tocar cartContext. Las cantidades se
// manejan acá (no por fila) para que "Limpiar" y "Añadir/Quitar del carrito" apliquen de
// una sola vez a todas las variantes del panel, en vez de un par de botones por fila.
function VariantsTable({ variants }: { variants: Product[] }) {
  const { items, setProductQuantity, removeProduct } = useCart();

  const quantitiesInCart = useMemo(
    () => Object.fromEntries(
      variants.map(v => [v.id, items.find(i => i.productId === v.id)?.quantity ?? 0])
    ),
    [items, variants]
  );

  const [quantities, setQuantities] = useState<Record<string, number>>(quantitiesInCart);

  useEffect(() => {
    setQuantities(quantitiesInCart);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [JSON.stringify(quantitiesInCart)]);

  const updateQty = (variantId: string, updater: (q: number) => number) => {
    setQuantities(prev => ({ ...prev, [variantId]: updater(prev[variantId] ?? 0) }));
  };

  // Clasifica cada variante con cambios pendientes en alta (0 -> N), baja (N -> 0) o
  // actualización (N -> M), para elegir la misma etiqueta que usa el aside de la pantalla
  // general de productos -- en vez de un "Añadir al carrito" fijo sin importar qué se esté
  // haciendo.
  const pendingChanges = variants
    .map(variant => {
      const current = quantitiesInCart[variant.id] ?? 0;
      const desired = quantities[variant.id] ?? 0;
      if (desired === current) return null;
      if (current === 0) return 'add' as const;
      if (desired === 0) return 'remove' as const;
      return 'update' as const;
    })
    .filter((c): c is 'add' | 'remove' | 'update' => c !== null);

  const hasChanges = pendingChanges.length > 0;

  const buttonLabel = !hasChanges
    ? 'Agregar al carrito'
    : pendingChanges.every(c => c === 'remove')
      ? 'Remover del carrito'
      : pendingChanges.every(c => c === 'add')
        ? 'Agregar al carrito'
        : 'Actualizar carrito';

  const handleAddOrRemoveAll = () => {
    for (const variant of variants) {
      const qty = quantities[variant.id] ?? 0;
      if (qty !== quantitiesInCart[variant.id]) {
        setProductQuantity(variant, qty);
      }
    }
  };

  const handleClearAll = () => {
    for (const variant of variants) {
      if ((quantitiesInCart[variant.id] ?? 0) > 0) {
        removeProduct(variant.id);
      }
    }
    setQuantities(Object.fromEntries(variants.map(v => [v.id, 0])));
  };

  return (
    <>
      <div className="grid grid-cols-4 text-sm font-medium text-gray-600">
        <div className="text-center">Estado</div>
        <div className="text-center">Idioma</div>
        <div className="text-center">Precio</div>
        <div className="text-center">Cantidad</div>
      </div>

      <hr className="my-2" />

      {variants.map(variant => (
        <VariantRow
          key={variant.id}
          variant={variant}
          qty={quantities[variant.id] ?? 0}
          onChange={updater => updateQty(variant.id, updater)}
        />
      ))}

      <div className="flex gap-4 justify-end mt-4">
        <button onClick={handleClearAll} className="small_button button_secondary">
          Limpiar
        </button>

        <button
          onClick={handleAddOrRemoveAll}
          className="small_button button_primary"
          disabled={!hasChanges}
        >
          {buttonLabel}
        </button>
      </div>
    </>
  );
}

function VariantRow({
  variant,
  qty,
  onChange,
}: {
  variant: Product;
  qty: number;
  onChange: (updater: (q: number) => number) => void;
}) {
  const increase = () => onChange(q => Math.min(variant.stock, q + 1));
  const decrease = () => onChange(q => Math.max(0, q - 1));

  return (
    <div className="border-b border-gray-200 last:border-b-0 py-2">
      <div className="grid grid-cols-4 items-center">
        <p className="text-center">{variant.conditionName || '-'}</p>
        <p className="text-center">{variant.languageName || '-'}</p>
        <p className="product_price_small_text text-center">
          ARS$ {formatPrice(variant.price)}
        </p>

        <div className="text-center">
          <div className="flex justify-center items-center gap-2">
            <button onClick={decrease} disabled={qty <= 0} className="px-2 py-1 border disabled:opacity-50">-</button>
            <span className="cantidad_stock_input">{qty}</span>
            <button onClick={increase} disabled={qty >= variant.stock} className="px-2 py-1 border disabled:opacity-50">+</button>
          </div>

          <p className="small_text secondary_text_color mt-1">
            Disponible{variant.stock > 1 && 's'}: {variant.stock}
          </p>
        </div>
      </div>
    </div>
  );
}