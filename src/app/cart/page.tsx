'use client';

import { useEffect } from 'react';
import LoadingLink from '@/src/components/navigation/LoadingLink';
import { useCart } from '../../context/cartContext';
import { formatPrice } from '@/src/utils/formatPrice';
import { useRouter } from 'next/navigation';
import { useNavigation } from '@/src/components/navigation/NavigationContext';

export default function CartPage() {
  const { items, dispatch, total } = useCart();
  const router = useRouter();
  const { startNavigation } = useNavigation();

  useEffect(() => {
    router.prefetch(`/checkout`);
  }, []);

  return (
    <div className="flex-1">
      <main className="mx-auto py-12 px-6">
        <h1 className="main_title_text mb-6">Mi Carrito</h1>

        {/* CARRITO VACÍO */}
        {items.length === 0 ? (
          <div className="box_border mb-8 bg-gray-100">
            <p className="normal_text secondary_text_color">Carrito vacío</p>
          </div>
        ) : (
          <div className="mb-8">
            {items.map((item) => (
              <div
                key={item.productId}
                className="box_border flex flex-wrap items-center gap-4"
              >
                <div 
                  className="w-24 h-24 bg-gray-100 rounded overflow-hidden flex items-center justify-center div_clickable"
                  onClick={() => {
                      startNavigation();
                      router.push(`/products/${item.productId}`);
                  }}>
                  {item.imageUrl ? (
                    <img
                      src={item.imageUrl}
                      alt={item.name}
                      className="object-contain w-full h-full"
                    />
                  ) : (
                    <span className="text-gray-400 text-sm">Sin imagen</span>
                  )}
                </div>

                <div className="flex-grow">
                  <h2 
                    className="product_title_text text_clickable"
                    onClick={() => {
                      startNavigation();
                      router.push(`/products/${item.productId}`);
                    }}>{item.name}</h2>
                  <p className="product_price_big_text">ARS$ {formatPrice(item.price)}</p>
                </div>

                <div className="text-center">
                  <div className="flex justify-center items-center gap-2">
                    <button
                      onClick={() =>
                        dispatch({ type: 'DECREASE', productId: item.productId })
                      }
                      className="px-3 py-1 border"
                    >
                      -
                    </button>

                    <span className="cantidad_stock_input">
                      {item.quantity}
                    </span>

                    <button
                      onClick={() =>
                        dispatch({ type: 'INCREASE', productId: item.productId })
                      }
                      className="px-3 py-1 border disabled:opacity-50"
                      disabled={item.quantity >= item.stock}
                    >
                      +
                    </button>
                  </div>
                  <p className="text-sm text-gray-500 mt-1">
                    Disponible {item.stock}
                  </p>
                </div>

                <button
                  onClick={() =>
                    dispatch({
                      type: 'REMOVE_ITEM',
                      productId: item.productId,
                    })
                  }
                  className="text-red-600 hover:underline"
                >
                  Eliminar
                </button>
              </div>
            ))}
          </div>
        )}

        <hr className="my-6"/>

        {/* RESUMEN */}
        <div className="flex flex-wrap justify-between items-center gap-4">
          <div className="subtitle_text flex items-center">
            Total:<p className="product_price_big_text px-2">ARS$ {formatPrice(total)}</p>
          </div>

          <div className="flex flex-wrap justify-around gap-4">
            <LoadingLink
              href="/products"
              className="button_secondary medium_button"
            >
              Continuar Comprando
            </LoadingLink>

            <button
              onClick={() => {
                startNavigation();
                router.push("/checkout");
              }}
              className="button_primary medium_button"
              disabled={items.length === 0}
            >
              Proceder al Pago
            </button>
          </div>
        </div>
      </main>
    </div>
  );
}
