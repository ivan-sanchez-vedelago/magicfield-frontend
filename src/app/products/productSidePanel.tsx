'use client';

import { useEffect, useState } from 'react';
import { useCart } from '../../context/cartContext';
import { useRouter } from 'next/navigation';
import { useNavigation } from '@/src/components/navigation/NavigationContext';

type Product = {
  id: number;
  name: string;
  description?: string;
  price: number;
  stock: number;
  imageUrls?: string[];
};

interface Props {
  product: Product;
  onClose: () => void;
}

export default function ProductSidePanel({ product, onClose }: Props) {
  const { items, setProductQuantity, removeProduct } = useCart();
  const [isOpen, setIsOpen] = useState(false);
  const router = useRouter();

  const cartItem = items.find(i => i.productId === product.id);
  const quantityInCart = cartItem?.quantity ?? 0;

  const [qty, setQty] = useState(quantityInCart);
  const [showDetails, setShowDetails] = useState(false);
  const { startNavigation } = useNavigation();

  useEffect(() => {
    setQty(quantityInCart);
  }, [quantityInCart, product.id]);

  const increase = () => {
    setQty(q => Math.min(product.stock, q + 1));
  };

  const decrease = () => {
    setQty(q => Math.max(0, q - 1));
  };

  const addToCart = () => {
    setProductQuantity(product, qty);
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
          <h2 className="product_title_text">Producto</h2>
          <button onClick={closeDrawer}>✕</button>
        </div>

        <div className="sidePanel_main">
          <img
            src={product.imageUrls?.[0]}
            className="w-full h-64 object-contain"
          />

          <h3 className="product_title_text primary_text_color">{product.name}</h3>
          <p className="normal_text secondary_text_color">{product.description}</p>
          <p className="product_price_text primary_text_color">${product.price}</p>

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
              disabled={qty >= product.stock}
            >
              +
            </button>
          </div>

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

          <p className="normal_text secondary_text_color">
            Stock disponible: {product.stock}
          </p>
        </div>

        <div className="p-4 border-t">
          <button
            onClick={() => {
              addToCart();
              closeDrawer();
            }}
            className="w-full button_primary medium_button"
          >
            Confirmar
          </button>
        </div>
      </aside>
    </>
  );
}
