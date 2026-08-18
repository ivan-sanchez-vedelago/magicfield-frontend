'use client';

import { useEffect, useState } from 'react';
import { useCart } from '../../context/cartContext';
import { formatPrice } from '@/src/utils/formatPrice';
import { useRouter } from 'next/navigation';
import { useNavigation } from '@/src/components/navigation/NavigationContext';
import type { Product } from '@/src/types';

interface Props {
  product: Product;
  onClose: () => void;
}

export default function ProductSidePanel({ product, onClose }: Props) {
  const { items, setProductQuantity, removeProduct } = useCart();
  const [isOpen, setIsOpen] = useState(false);
  const router = useRouter();
  const { startNavigation } = useNavigation();

  // Presence-based, no por categoría: singles (scryfallId) y sellados (set) traen variantes
  // de condición/idioma, el resto de tipos no tiene ese concepto.
  const hasVariantData = !!(product.scryfallId || product.set);
  const [variants, setVariants] = useState<Product[]>(hasVariantData ? [] : [product]);
  const [variantsLoading, setVariantsLoading] = useState(hasVariantData);

  useEffect(() => {
    if (!hasVariantData) {
      setVariants([product]);
      setVariantsLoading(false);
      return;
    }

    setVariantsLoading(true);
    const controller = new AbortController();
    fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/products/${product.id}/variants`, {
      signal: controller.signal,
    })
      .then(r => r.json())
      .then((data: Product[]) => setVariants(data.length > 0 ? data : [product]))
      .catch(err => {
        if (err.name !== 'AbortError') setVariants([product]);
      })
      .finally(() => setVariantsLoading(false));

    return () => controller.abort();
  }, [product.id, hasVariantData]);

  // Con una sola variante (el caso común, singles o no) el panel se comporta exactamente
  // como antes: un solo stepper acá arriba, sincronizado con el carrito.
  const hasMultipleVariants = variants.length > 1;
  const singleVariant = variants[0] ?? product;

  const cartItem = items.find(i => i.productId === singleVariant.id);
  const quantityInCart = cartItem?.quantity ?? 0;
  const [qty, setQty] = useState(quantityInCart);

  useEffect(() => {
    setQty(quantityInCart);
  }, [quantityInCart, singleVariant.id]);

  // Con 2+ variantes cada fila tiene su propio stepper, pero las cantidades elegidas se
  // acumulan acá y se aplican todas juntas con un único botón "Agregar al carrito" fijo
  // en el mismo lugar de siempre -- no un botón por fila.
  const [quantities, setQuantities] = useState<Record<string, number>>({});

  useEffect(() => {
    if (!hasMultipleVariants) return;
    const initial: Record<string, number> = {};
    variants.forEach(v => {
      const existing = items.find(i => i.productId === v.id);
      initial[v.id] = existing?.quantity ?? 0;
    });
    setQuantities(initial);
  }, [variants, hasMultipleVariants]);

  const setVariantQty = (variantId: string, value: number) => {
    setQuantities(prev => ({ ...prev, [variantId]: value }));
  };

  // Clasifica cada variante con cambios pendientes en alta (0 -> N), baja (N -> 0) o
  // actualización (N -> M), para poder elegir la misma etiqueta que usaría el caso de una
  // sola variante -- en vez de un "Agregar al carrito" fijo sin importar qué se esté haciendo.
  const pendingChanges = variants
    .map(v => {
      const current = items.find(i => i.productId === v.id)?.quantity ?? 0;
      const desired = quantities[v.id] ?? 0;
      if (desired === current) return null;
      if (current === 0) return 'add' as const;
      if (desired === 0) return 'remove' as const;
      return 'update' as const;
    })
    .filter((c): c is 'add' | 'remove' | 'update' => c !== null);

  const hasPendingChanges = pendingChanges.length > 0;

  const multiVariantLabel = !hasPendingChanges
    ? 'Agregar al carrito'
    : pendingChanges.every(c => c === 'remove')
      ? 'Remover del carrito'
      : pendingChanges.every(c => c === 'add')
        ? 'Agregar al carrito'
        : 'Actualizar carrito';

  const handleConfirm = () => {
    if (hasMultipleVariants) {
      variants.forEach(v => {
        const desired = quantities[v.id] ?? 0;
        const current = items.find(i => i.productId === v.id)?.quantity ?? 0;
        if (desired === current) return;
        if (desired === 0) removeProduct(v.id);
        else setProductQuantity(v, desired);
      });
    } else if (qty === 0) {
      removeProduct(singleVariant.id);
    } else {
      setProductQuantity(singleVariant, qty);
    }
    closeDrawer();
  };

  useEffect(() => {
    setIsOpen(true);
    router.prefetch(`/products/${product.id}`);
    document.body.style.overflow = 'hidden';
    return () => {
      document.body.style.overflow = '';
    };
  }, []);

  const closeDrawer = () => {
    setIsOpen(false);
    setTimeout(onClose, 300);
  };

  return (
    <>
      <div
        onClick={closeDrawer}
        className={`fixed inset-0 bg-black/60 z-40 transition-opacity duration-300
          ${isOpen ? 'opacity-100' : 'opacity-0'}
        `}
      />

      <aside
        className={`bg-white transform transition-transform duration-300 ease-in-out
          ${isOpen ? 'translate-x-0' : 'translate-x-full'}
        `}
        onClick={(e) => e.stopPropagation()}
      >
        <div className="p-4 border-b flex justify-between items-center">
          <h2 className="product_title_text">{product.displayName ?? product.name}</h2>
          <button onClick={closeDrawer}>✕</button>
        </div>

        <div className="sidePanel_main">
          <img
            src={product.imageUrls?.[0]}
            className="w-full h-64 object-contain"
          />

          <p className="normal_text secondary_text_color" style={{fontStyle: 'italic'}}>{product.description}</p>

          <button
            onClick={() => {
              closeDrawer();
              startNavigation();
              router.push(`/products/${product.id}`);
            }}
            className="w-full button_secondary medium_button"
          >
            Ver detalles
          </button>

          {variantsLoading ? (
            <p className="normal_text secondary_text_color" style={{alignSelf: 'center'}}>Cargando variantes...</p>
          ) : hasMultipleVariants ? (
            variants.map(variant => (
              <VariantRow
                key={variant.id}
                variant={variant}
                qty={quantities[variant.id] ?? 0}
                onChange={(value) => setVariantQty(variant.id, value)}
              />
            ))
          ) : (
            <VariantRow variant={singleVariant} qty={qty} onChange={setQty} />
          )}
        </div>

        {!variantsLoading && (
          <div className="p-4 border-t">
            <button
              onClick={handleConfirm}
              className="w-full button_primary medium_button"
              disabled={hasMultipleVariants ? !hasPendingChanges : qty === quantityInCart}
            >
              {hasMultipleVariants
                ? multiVariantLabel
                : (qty === 0 && quantityInCart > 0 ? 'Remover del carrito' : quantityInCart > 0 ? 'Actualizar carrito' : 'Agregar al carrito')}
            </button>
          </div>
        )}
      </aside>
    </>
  );
}

// Fila de condición/idioma + precio + stepper de una variante -- se usa tanto para el caso
// de una sola variante como para cada fila cuando hay 2+, así comparten exactamente el mismo
// estilo. La cantidad elegida vive en ProductSidePanel (no acá), para que el único botón
// "Agregar al carrito" del footer pueda aplicar los cambios de todas las filas juntas.
function VariantRow({
  variant,
  qty,
  onChange,
}: {
  variant: Product;
  qty: number;
  onChange: (value: number) => void;
}) {
  const increase = () => onChange(Math.min(variant.stock, qty + 1));
  const decrease = () => onChange(Math.max(0, qty - 1));

  return (
    <div className="w-full border-t pt-3 flex flex-col gap-2" style={{alignItems: 'center'}}>
      {(variant.conditionName || variant.languageName) && (
        <span>{[variant.conditionName, variant.languageName].filter(Boolean).join(' - ')}</span>
      )}

      <p className="product_price_small_text">ARS$ {formatPrice(variant.price)}</p>

      <div className="flex items-center gap-4">
        <button
          onClick={decrease}
          className="px-3 py-1 border disabled:opacity-50"
          disabled={qty <= 0}
        >
          -
        </button>

        <span className="cantidad_stock_input">
          {qty}
        </span>

        <button
          onClick={increase}
          className="px-3 py-1 border disabled:opacity-50"
          disabled={qty >= variant.stock}
        >
          +
        </button>
      </div>

      <p className="normal_text secondary_text_color">
        {variant.stock} en stock
      </p>
    </div>
  );
}
