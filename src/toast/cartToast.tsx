'use client';

import LoadingLink from '@/src/components/navigation/LoadingLink';
import { useCart } from '@/src/context/cartContext';
import { ShoppingCart } from 'lucide-react';

export default function CartToast() {
  const { toastMessage } = useCart();

  if (!toastMessage) return null;

  return (
    <div className="cart_overlay dialog_bubble">
      <div className="flex items-center gap-4">
        <ShoppingCart className="w-5 h-5 flex-shrink-0" />
        <div className="flex flex-col">
          <span className="normal_text">{toastMessage}</span>
          <LoadingLink href="/cart" className="small_text link_text_color text_clickable">
            Ver carrito
          </LoadingLink>
        </div>
      </div>
    </div>
  );
}