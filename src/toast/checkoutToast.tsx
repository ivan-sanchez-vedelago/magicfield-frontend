'use client';

import { useCheckout } from '@/src/context/checkoutContext';
import { ShoppingCart } from 'lucide-react';
import LoadingLink from '../components/navigation/LoadingLink';

export default function CheckoutToast() {
  const { successMessage } = useCheckout();

  if (!successMessage) return null;

  return (
    <div className="dialog_bubble dialog_bubble_user">
      <div className="flex items-center gap-4">
        <ShoppingCart className="w-5 h-5 flex-shrink-0" />
        <div className="flex flex-col">
          <span className="normal_text">{successMessage}</span>
          <LoadingLink href="/perfil?tab=orders" className="small_text link_text_color text_clickable">
            Mis pedidos
          </LoadingLink>
        </div>
      </div>
    </div>
  );
}
