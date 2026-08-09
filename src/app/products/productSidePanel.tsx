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
  const [isOpen, setIsOpen] = useState(false);
  const router = useRouter();
  const { startNavigation } = useNavigation();

  const isSingle = product.type === 'SIN';
  const [variants, setVariants] = useState<Product[]>(isSingle ? [] : [product]);
  const [variantsLoading, setVariantsLoading] = useState(isSingle);

  useEffect(() => {
    if (!isSingle) {
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
      .then((data: Product[]) => {
        setVariants(data);
        setVariantsLoading(false);
      })
      .catch(err => {
        if (err.name !== 'AbortError') {
          setVariants([product]);
          setVariantsLoading(false);
        }
      });

    return () => controller.abort();
  }, [product.id, isSingle]);

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
          <h2 className="product_title_text">{product.name}</h2>
          <button onClick={closeDrawer}>✕</button>
        </div>

        <div className="sidePanel_main">
          <img
            src={product.imageUrls?.[0]}
            className="w-full h-64 object-contain"
          />

          {!isSingle && (
            <p className="normal_text secondary_text_color" style={{fontStyle: 'italic'}}>{product.description}</p>
          )}

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
          ) : (
            variants.map(variant => (
              <SidePanelVariantRow key={variant.id} variant={variant} showConditionLanguage={isSingle} />
            ))
          )}
        </div>
      </aside>
    </>
  );
}

// Una fila por variante (condición/idioma), análogo a VariantRow en ProductDetailClient.tsx.
// Para no-singles hay una única "variante" (el producto mismo) y no se muestran esas columnas.
function SidePanelVariantRow({ variant, showConditionLanguage }: { variant: Product; showConditionLanguage: boolean }) {
  const { items, setProductQuantity, removeProduct } = useCart();
  const cartItem = items.find(i => i.productId === variant.id);
  const quantityInCart = cartItem?.quantity ?? 0;

  const [qty, setQty] = useState(quantityInCart);

  useEffect(() => {
    setQty(quantityInCart);
  }, [quantityInCart, variant.id]);

  const increase = () => setQty(q => Math.min(variant.stock, q + 1));
  const decrease = () => setQty(q => Math.max(0, q - 1));

  const handleConfirm = () => {
    if (qty === 0) {
      removeProduct(variant.id);
    } else {
      setProductQuantity(variant, qty);
    }
  };

  return (
    <div className="border-b border-gray-200 last:border-b-0 py-2">
      {showConditionLanguage && (
        <div className="flex justify-between text-sm text-gray-600 mb-1">
          <span>{variant.conditionName || '-'}</span>
          <span>{variant.languageName || '-'}</span>
        </div>
      )}

      <p className="product_price_small_text">ARS$ {formatPrice(variant.price)}</p>

      <div className="flex items-center gap-4" style={{alignSelf: 'center'}}>
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

      <p className="normal_text secondary_text_color" style={{alignSelf: 'center'}}>
        {variant.stock} en stock
      </p>

      <button
        onClick={handleConfirm}
        className="w-full button_primary medium_button mt-2"
        disabled={qty === quantityInCart}
      >
        {qty === 0 && quantityInCart > 0 ? 'Remover del carrito' : quantityInCart > 0 ? 'Actualizar carrito' : 'Agregar al carrito'}
      </button>
    </div>
  );
}
