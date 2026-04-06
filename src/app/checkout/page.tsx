'use client';

import { useNavigation } from '@/src/components/navigation/NavigationContext';
import { useCart } from '@/src/context/cartContext';
import { formatPrice } from '@/src/utils/formatPrice';
import { useRouter } from 'next/navigation';
import { useState, useEffect } from 'react';

export default function CheckoutPage() {

  const { items, total, clearCart } = useCart();
  const router = useRouter();
  const { startNavigation } = useNavigation();

  const [name, setName] = useState('');
  const [lastName, setLastName] = useState('');
  const [phone, setPhone] = useState('');
  const [email, setEmail] = useState('');

  const [errors, setErrors] = useState({
    name: '',
    lastName: '',
    phone: '',
    email: ''
  });

  const [touched, setTouched] = useState({
    name: false,
    lastName: false,
    phone: false,
    email: false
  });

  const [formValid, setFormValid] = useState(false);
  const [loading, setLoading] = useState(false);

  const nameRegex = /^[A-Za-zÁÉÍÓÚáéíóúñÑ\s]+$/;
  const phoneRegex = /^[0-9]+$/;
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

  function validate() {

    const newErrors = {
      name: '',
      lastName: '',
      phone: '',
      email: ''
    };

    if (name.trim() === '') {
      newErrors.name = 'Este campo es requerido';
    } else if (!nameRegex.test(name)) {
      newErrors.name = 'Nombre invalido';
    }

    if (lastName.trim() === '') {
      newErrors.lastName = 'Este campo es requerido';
    } else if (!nameRegex.test(lastName)) {
      newErrors.lastName = 'Apellido invalido';
    }

    if (phone.trim() === '') {
      newErrors.phone = 'Este campo es requerido';
    } else if (!phoneRegex.test(phone)) {
      newErrors.phone = 'Teléfono invalido';
    }

    if (email.trim() === '') {
      newErrors.email = 'Este campo es requerido';
    } else if (!emailRegex.test(email)) {
      newErrors.email = 'Email invalido';
    }

    setErrors(newErrors);

    const valid = !Object.values(newErrors).some(e => e !== '');
    setFormValid(valid);
  }

  useEffect(() => {
    validate();
  }, [name, lastName, phone, email]);

  async function submitOrder() {

    if (!formValid) return;

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
    <div className="flex-1 flex flex-col">
      <div className="max-w-xl mx-auto p-6">

        <h1 className="main_title_text mb-2">Datos del comprador</h1>
        <p className="normal_text text-gray-400 mb-6">
          Ingresá tus datos y nos comunicaremos contigo para coordinar la entrega al corto plazo.
        </p>

        <div className="flex flex-col gap-4 mb-6">

          <div>
            <input
              placeholder="Nombre"
              className={`input_field ${errors.name && touched.name? 'border-red-500' : ''}`}
              value={name}
              required
              pattern="[A-Za-zÁÉÍÓÚáéíóúñÑ\s]+"
              onChange={e => setName(e.target.value)}
              onBlur={() => setTouched(prev => ({ ...prev, name: true }))}
            />
            {errors.name && touched.name && (
              <p className="small_text text-red-500 pl-2 mt-1">{errors.name}</p>
            )}
          </div>

          <div>
            <input
              placeholder="Apellido"
              className={`input_field ${errors.lastName && touched.lastName ? 'border-red-500' : ''}`}
              value={lastName}
              required
              pattern="[A-Za-zÁÉÍÓÚáéíóúñÑ\s]+"
              onChange={e => setLastName(e.target.value)}
              onBlur={() => setTouched(prev => ({ ...prev, lastName: true }))}
            />
            {errors.lastName && touched.lastName && (
              <p className="small_text text-red-500 pl-2 mt-1">{errors.lastName}</p>
            )}
          </div>

          <div>
            <input
              placeholder="Teléfono"
              className={`input_field ${errors.phone && touched.phone ? 'border-red-500' : ''}`}
              value={phone}
              required
              inputMode="numeric"
              pattern="[0-9]+"
              onChange={e => {
                const value = e.target.value.replace(/\D/g, '');
                setPhone(value);
              }}
              onBlur={() => setTouched(prev => ({ ...prev, phone: true }))}
            />
            {errors.phone && touched.phone && (
              <p className="small_text text-red-500 pl-2 mt-1">{errors.phone}</p>
            )}
          </div>

          <div>
            <input
              placeholder="Email"
              type="email"
              className={`input_field ${errors.email && touched.email ? 'border-red-500' : ''}`}
              value={email}
              required
              onChange={e => setEmail(e.target.value)}
              onBlur={() => setTouched(prev => ({ ...prev, email: true }))}
            />
            {errors.email && touched.email && (
              <p className="small_text text-red-500 pl-2 mt-1">{errors.email}</p>
            )}
          </div>

        </div>

        <div className="subtitle_text flex items-center mb-2">
          Total:<p className="product_price_big_text px-2">ARS$ {formatPrice(total)}</p>
        </div>

        <div className="text-center">
          <button
            onClick={submitOrder}
            disabled={!formValid || loading}
            className={`button_primary medium_button ${
              (!formValid || loading) ? 'opacity-50 cursor-not-allowed' : ''
            }`}
          >
            {loading ? 'Procesando...' : 'Confirmar compra'}
          </button>
        </div>

      </div>
    </div>
  );
}