'use client';

import { useNavigation } from '@/src/components/navigation/NavigationContext';
import { useCart } from '@/src/context/cartContext';
import { useAuth } from '@/src/context/authContext';
import { useCheckout } from '@/src/context/checkoutContext';
import { formatPrice } from '@/src/utils/formatPrice';
import { useRouter } from 'next/navigation';
import { useState, useEffect } from 'react';

type DeliveryOption = '' | 'RETIRO_RAMOS' | 'RETIRO_FRANCISCO' | 'ENVIO_DOMICILIO' | 'ENVIO_ANDREANI';

export default function CheckoutPage() {

  const { items, total, clearCart } = useCart();
  const { user } = useAuth();
  const { showCheckoutSuccess } = useCheckout();
  const router = useRouter();
  const { startNavigation } = useNavigation();

  const [name, setName] = useState('');
  const [lastName, setLastName] = useState('');
  const [phone, setPhone] = useState('');
  const [email, setEmail] = useState('');

  const [deliveryOption, setDeliveryOption] = useState<DeliveryOption>('');
  const [dni, setDni] = useState('');
  const [street, setStreet] = useState('');
  const [streetNumber, setStreetNumber] = useState('');
  const [city, setCity] = useState('');
  const [province, setProvince] = useState('');
  const [postalCode, setPostalCode] = useState('');

  const isShipping = deliveryOption === 'ENVIO_DOMICILIO' || deliveryOption === 'ENVIO_ANDREANI';

  const [errors, setErrors] = useState({
    name: '', lastName: '', phone: '', email: '',
    dni: '', street: '', streetNumber: '', city: '', province: '', postalCode: ''
  });

  const [touched, setTouched] = useState({
    name: false, lastName: false, phone: false, email: false,
    dni: false, street: false, streetNumber: false, city: false, province: false, postalCode: false
  });

  const [formValid, setFormValid] = useState(false);
  const [loading, setLoading] = useState(false);

  const nameRegex = /^[A-Za-zÁÉÍÓÚáéíóúñÑ\s]+$/;
  const phoneRegex = /^[0-9]+$/;
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

  function validate() {
    const newErrors = {
      name: '', lastName: '', phone: '', email: '',
      dni: '', street: '', streetNumber: '', city: '', province: '', postalCode: ''
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

    if (isShipping) {
      if (dni.trim() === '') newErrors.dni = 'Este campo es requerido';
      else if (!phoneRegex.test(dni)) newErrors.dni = 'DNI invalido';

      if (street.trim() === '') newErrors.street = 'Este campo es requerido';
      if (streetNumber.trim() === '') newErrors.streetNumber = 'Este campo es requerido';
      if (city.trim() === '') newErrors.city = 'Este campo es requerido';
      if (province.trim() === '') newErrors.province = 'Este campo es requerido';

      if (postalCode.trim() === '') newErrors.postalCode = 'Este campo es requerido';
      else if (!phoneRegex.test(postalCode)) newErrors.postalCode = 'Código postal invalido';
    }

    setErrors(newErrors);

    const basicValid = !Object.values(newErrors).some(e => e !== '');
    setFormValid(basicValid && deliveryOption !== '');
  }

  useEffect(() => {
    validate();
  }, [name, lastName, phone, email, deliveryOption, dni, street, streetNumber, city, province, postalCode]);

  useEffect(() => {
    if (user) {
      setName(user.name || '');
      setLastName(user.lastName || '');
      setEmail(user.email || '');
      setPhone(user.phone ? user.phone.toString() : '');
    }
  }, [user]);

  async function submitOrder() {
    if (!formValid) return;
    setLoading(true);

    const body = {
      customerName: name,
      customerLastName: lastName,
      customerPhone: phone,
      customerEmail: email,
      userId: user ? user.id : null,
      deliveryType: deliveryOption,
      customerDni: dni || null,
      shippingStreet: street || null,
      shippingStreetNumber: streetNumber || null,
      shippingCity: city || null,
      shippingProvince: province || null,
      shippingPostalCode: postalCode || null,
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
      showCheckoutSuccess('¡Compra completada! Podes ver tus pedidos en tu perfil');
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

        {/* Campos básicos — 1 col en móvil, 2 col en sm+ */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-6">

          <div>
            <input
              placeholder="Nombre"
              className={`input_field ${errors.name && touched.name ? 'border-red-500' : ''}`}
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
              onChange={e => setPhone(e.target.value.replace(/\D/g, ''))}
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

        {/* Método de envío */}
        <div className="mb-6">
          <p className="subtitle_text mb-3">Método de envío</p>
          <div className="input_field grid grid-cols-1 sm:grid-cols-2 gap-2" style={{ backgroundColor: '#ffffff' }}>
            {(
              [
                { value: 'RETIRO_RAMOS', label: 'Retiro en Ramos Mejia' },
                { value: 'RETIRO_FRANCISCO', label: 'Retiro en Francisco Alvarez' },
                { value: 'ENVIO_DOMICILIO', label: 'Envío a domicilio' },
                { value: 'ENVIO_ANDREANI', label: 'Envío a sucursal de Andreani' },
              ] as { value: DeliveryOption; label: string }[]
            ).map(opt => (
              <label key={opt.value} className="flex items-center gap-2 normal_text cursor-pointer">
                <input
                  type="radio"
                  name="deliveryOption"
                  value={opt.value}
                  checked={deliveryOption === opt.value}
                  onChange={() => setDeliveryOption(opt.value)}
                  className="accent-green-700 w-4 h-4"
                />
                {opt.label}
              </label>
            ))}
          </div>
          <p className="small_text text-gray-400 mt-2 pl-1">
            Los envios a sucursales de Andreani suelen ser mas baratos
          </p>
        </div>

        {/* Campos de envío — solo si es envío a domicilio o Andreani */}
        {isShipping && (
          <div className="mb-6">
            <p className="subtitle_text mb-3">Datos de envío</p>
            <div className="flex flex-col gap-4">

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <input
                    placeholder="DNI"
                    className={`input_field ${errors.dni && touched.dni ? 'border-red-500' : ''}`}
                    value={dni}
                    inputMode="numeric"
                    pattern="[0-9]+"
                    onChange={e => setDni(e.target.value.replace(/\D/g, ''))}
                    onBlur={() => setTouched(prev => ({ ...prev, dni: true }))}
                  />
                  {errors.dni && touched.dni && (
                    <p className="small_text text-red-500 pl-2 mt-1">{errors.dni}</p>
                  )}
                </div>

                <div>
                  <input
                    placeholder="Calle"
                    className={`input_field ${errors.street && touched.street ? 'border-red-500' : ''}`}
                    value={street}
                    onChange={e => setStreet(e.target.value)}
                    onBlur={() => setTouched(prev => ({ ...prev, street: true }))}
                  />
                  {errors.street && touched.street && (
                    <p className="small_text text-red-500 pl-2 mt-1">{errors.street}</p>
                  )}
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <input
                    placeholder="Altura"
                    className={`input_field ${errors.streetNumber && touched.streetNumber ? 'border-red-500' : ''}`}
                    value={streetNumber}
                    onChange={e => setStreetNumber(e.target.value)}
                    onBlur={() => setTouched(prev => ({ ...prev, streetNumber: true }))}
                  />
                  {errors.streetNumber && touched.streetNumber && (
                    <p className="small_text text-red-500 pl-2 mt-1">{errors.streetNumber}</p>
                  )}
                </div>

                <div>
                  <input
                    placeholder="Localidad"
                    className={`input_field ${errors.city && touched.city ? 'border-red-500' : ''}`}
                    value={city}
                    onChange={e => setCity(e.target.value)}
                    onBlur={() => setTouched(prev => ({ ...prev, city: true }))}
                  />
                  {errors.city && touched.city && (
                    <p className="small_text text-red-500 pl-2 mt-1">{errors.city}</p>
                  )}
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <input
                    placeholder="Provincia"
                    className={`input_field ${errors.province && touched.province ? 'border-red-500' : ''}`}
                    value={province}
                    onChange={e => setProvince(e.target.value)}
                    onBlur={() => setTouched(prev => ({ ...prev, province: true }))}
                  />
                  {errors.province && touched.province && (
                    <p className="small_text text-red-500 pl-2 mt-1">{errors.province}</p>
                  )}
                </div>
                <div>
                  <input
                    placeholder="Código Postal"
                    className={`input_field ${errors.postalCode && touched.postalCode ? 'border-red-500' : ''}`}
                    value={postalCode}
                    inputMode="numeric"
                    pattern="[0-9]+"
                    onChange={e => setPostalCode(e.target.value.replace(/\D/g, ''))}
                    onBlur={() => setTouched(prev => ({ ...prev, postalCode: true }))}
                  />
                  {errors.postalCode && touched.postalCode && (
                    <p className="small_text text-red-500 pl-2 mt-1">{errors.postalCode}</p>
                  )}
                </div>
              </div>
            </div>
          </div>
        )}

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