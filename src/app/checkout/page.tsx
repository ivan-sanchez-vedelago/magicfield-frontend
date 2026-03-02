'use client';

import { useNavigation } from '@/src/components/navigation/NavigationContext';
import { useCart } from '@/src/context/cartContext';
import { useRouter } from 'next/navigation';
import { useState } from 'react';

export default function CheckoutPage() {

  const { items, total, clearCart } = useCart();
  const router = useRouter();

  const [name, setName] = useState('');
  const [lastName, setLastName] = useState('');
  const [phone, setPhone] = useState('');
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const { startNavigation } = useNavigation();

  async function submitOrder() {

    setLoading(true);

    const body = {
      customerName: name,
      customerLastName: lastName,
      customerPhone: phone,
      customerEmail: email,
      items: items.map(i => ({
        productId: i.productId,
        quantity: i.quantity
      }))
    };

    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/orders/checkout`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body)
      });

      if (!res.ok) throw new Error('Error en checkout');

      clearCart();
      startNavigation();
      router.push('/checkout/success');

    } catch (e) {
      alert('Error al procesar compra');
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="max-w-xl mx-auto p-6 space-y-4">

      <h1 className="text-3xl font-bold">Datos del comprador</h1>

      <input
        placeholder="Nombre"
        className="border p-2 w-full"
        value={name}
        onChange={e => setName(e.target.value)}
      />

      <input
        placeholder="Apellido"
        className="border p-2 w-full"
        value={lastName}
        onChange={e => setLastName(e.target.value)}
      />

      <input
        placeholder="Teléfono"
        className="border p-2 w-full"
        value={phone}
        onChange={e => setPhone(e.target.value)}
      />

      <input
        placeholder="Email"
        className="border p-2 w-full"
        value={email}
        onChange={e => setEmail(e.target.value)}
      />

      <div className="text-xl font-bold">
        Total: ${total.toFixed(2)}
      </div>

      <button
        onClick={submitOrder}
        disabled={loading}
        className="bg-black text-white px-6 py-3 w-full"
      >
        {loading ? 'Procesando...' : 'Confirmar compra'}
      </button>

    </div>
  );
}
