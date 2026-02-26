'use client';

import React, { createContext, useContext, useReducer, useState } from 'react';

export interface CartItem {
  productId: number;
  name: string;
  price: number;
  quantity: number;
  stock: number;
  imageUrl?: string;
}

type CartState = {
  items: CartItem[];
};

type CartAction =
  | { type: 'ADD_ITEM'; item: CartItem }
  | { type: 'INCREASE'; productId: number }
  | { type: 'DECREASE'; productId: number }
  | { type: 'REMOVE_ITEM'; productId: number }
  | { type: 'CLEAR_CART' };

type CartContextType = {
  items: CartItem[];
  total: number;
  dispatch: React.Dispatch<CartAction>;
  clearCart: () => void;
  setProductQuantity: (product: any, qty: number) => void;
  removeProduct: (productId: number) => void;
  toastMessage: string | null;
};

const CartContext = createContext<CartContextType | null>(null);

const initialState: CartState = {
  items: [],
};

function cartReducer(state: CartState, action: CartAction): CartState {
  switch (action.type) {
    case 'ADD_ITEM': {
      const existing = state.items.find(
        (i) => i.productId === action.item.productId
      );

      if (existing) {
        return {
          items: state.items.map((i) =>
            i.productId === action.item.productId
              ? { ...i, quantity: i.quantity + action.item.quantity }
              : i
          ),
        };
      }

      return { items: [...state.items, action.item] };
    }

    case 'INCREASE':
      return {
        items: state.items.map((i) =>
          i.productId === action.productId
            ? { ...i, quantity: i.quantity + 1 }
            : i
        ),
      };

    case 'DECREASE':
      return {
        items: state.items
          .map((i) =>
            i.productId === action.productId
              ? { ...i, quantity: i.quantity - 1 }
              : i
          )
          .filter((i) => i.quantity > 0),
      };

    case 'REMOVE_ITEM':
      return {
        items: state.items.filter(
          (i) => i.productId !== action.productId
        ),
      };

    case 'CLEAR_CART':
      return { ...state, items: [] };

    default:
      return state;
  }
}

export function CartProvider({ children }: { children: React.ReactNode }) {
  const [state, dispatch] = useReducer(cartReducer, initialState);

  /* FEEDBACK GLOBAL */
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const showFeedback = (message: string) => {
    setToastMessage(message);
    setTimeout(() => setToastMessage(null), 2000);
  };

  /* HELPERS DE ALTO NIVEL */

  const setProductQuantity = (product: any, desiredQty: number) => {
    const existing = state.items.find(i => i.productId === product.id);
    const currentQty = existing?.quantity ?? 0;

    // eliminar si queda en 0
    if (desiredQty === 0 && currentQty > 0) {
      dispatch({ type: 'REMOVE_ITEM', productId: product.id });
      showFeedback('Producto eliminado del carrito');
      return;
    }

    // si no existe y qty > 0 → agregar
    if (!existing && desiredQty > 0) {
      dispatch({
        type: 'ADD_ITEM',
        item: {
          productId: product.id,
          name: product.name,
          price: product.price,
          quantity: desiredQty,
          stock: product.stock,
          imageUrl: product.imageUrls?.[0],
        },
      });
      showFeedback('Producto añadido al carrito');
      return;
    }

    // si existe → ajustar diferencia
    const diff = desiredQty - currentQty;

    if (diff > 0) {
      for (let i = 0; i < diff; i++) {
        dispatch({ type: 'INCREASE', productId: product.id });
      }
      showFeedback('Cantidad actualizada');
    }

    if (diff < 0) {
      for (let i = 0; i < Math.abs(diff); i++) {
        dispatch({ type: 'DECREASE', productId: product.id });
      }
      showFeedback('Cantidad actualizada');
    }
  };

  const removeProduct = (productId: number) => {
    dispatch({ type: 'REMOVE_ITEM', productId });
    showFeedback('Producto eliminado del carrito');
  };

  function clearCart() {
    dispatch({ type: 'CLEAR_CART' });
    showFeedback('Carrito vaciado');
  }

  const total = state.items.reduce(
    (sum, item) => sum + item.price * item.quantity,
    0
  );

  return (
    <CartContext.Provider
      value={{
        items: state.items,
        total,
        dispatch,
        clearCart,

        /* ⭐ NUEVO */
        setProductQuantity,
        removeProduct,
        toastMessage,
      }}
    >
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  const context = useContext(CartContext);

  if (!context) {
    throw new Error('useCart must be used within CartProvider');
  }

  return context;
}