'use client';

import { useCart } from '@/src/context/cartContext';

export default function CartToast() {
  const { toastMessage } = useCart();

  if (!toastMessage) return null;

  return (
    <div className="fixed bottom-6 right-6 bg-black text-white px-4 py-2 rounded shadow-lg z-50">
      {toastMessage}
    </div>
  );
}