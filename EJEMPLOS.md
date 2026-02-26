// Ejemplo de servicio de autenticación
// src/services/authService.ts (Por implementar)

/*
import { auth } from '@/lib/firebase';
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
  onAuthStateChanged,
  getIdToken,
} from 'firebase/auth';

export const authService = {
  async register(email: string, password: string) {
    try {
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      return userCredential.user;
    } catch (error) {
      throw new Error('Error en el registro');
    }
  },

  async login(email: string, password: string) {
    try {
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      return userCredential.user;
    } catch (error) {
      throw new Error('Email o contraseña incorrectos');
    }
  },

  async logout() {
    await signOut(auth);
  },

  async getCurrentUser() {
    return new Promise((resolve) => {
      const unsubscribe = onAuthStateChanged(auth, (user) => {
        resolve(user);
        unsubscribe();
      });
    });
  },

  async getIdToken(user: any) {
    return await getIdToken(user);
  },
};
*/

// Ejemplo de servicio de productos
// src/services/productService.ts (Por implementar)

/*
const API_BASE = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8080/api';

export const productService = {
  async getAll(limit = 20, offset = 0) {
    const response = await fetch(`${API_BASE}/products?limit=${limit}&offset=${offset}`);
    if (!response.ok) throw new Error('Error fetching products');
    return response.json();
  },

  async getById(id: string) {
    const response = await fetch(`${API_BASE}/products/${id}`);
    if (!response.ok) throw new Error('Product not found');
    return response.json();
  },

  async search(query: string) {
    const response = await fetch(`${API_BASE}/products/search?q=${encodeURIComponent(query)}`);
    if (!response.ok) throw new Error('Search error');
    return response.json();
  },

  async filter(filters: { category?: string; minPrice?: number; maxPrice?: number }) {
    const params = new URLSearchParams();
    Object.entries(filters).forEach(([key, value]) => {
      if (value !== undefined) params.append(key, value.toString());
    });
    const response = await fetch(`${API_BASE}/products/filter?${params}`);
    if (!response.ok) throw new Error('Filter error');
    return response.json();
  },
};
*/

// Ejemplo de servicio de carrito
// src/services/cartService.ts (Por implementar)

/*
const STORAGE_KEY = 'ecommerce-cart';

export const cartService = {
  getCart() {
    if (typeof window === 'undefined') return [];
    const cart = localStorage.getItem(STORAGE_KEY);
    return cart ? JSON.parse(cart) : [];
  },

  addItem(productId: string, quantity: number, price: number) {
    const cart = this.getCart();
    const existingItem = cart.find((item: any) => item.productId === productId);
    
    if (existingItem) {
      existingItem.quantity += quantity;
    } else {
      cart.push({ productId, quantity, price });
    }
    
    localStorage.setItem(STORAGE_KEY, JSON.stringify(cart));
    return cart;
  },

  removeItem(productId: string) {
    const cart = this.getCart();
    const filtered = cart.filter((item: any) => item.productId !== productId);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(filtered));
    return filtered;
  },

  updateQuantity(productId: string, quantity: number) {
    const cart = this.getCart();
    const item = cart.find((item: any) => item.productId === productId);
    if (item) item.quantity = quantity;
    localStorage.setItem(STORAGE_KEY, JSON.stringify(cart));
    return cart;
  },

  clear() {
    localStorage.removeItem(STORAGE_KEY);
    return [];
  },

  getTotal() {
    return this.getCart().reduce((total: number, item: any) => 
      total + (item.price * item.quantity), 0
    );
  },
};
*/

// Ejemplo de uso en componente
// src/app/auth/login/page.tsx

/*
'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { authService } from '@/services/authService';

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    try {
      const user = await authService.login(email, password);
      console.log('Logged in:', user);
      router.push('/products');
    } catch (err: any) {
      setError(err.message || 'Error al ingresar');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    // ... JSX
  );
}
*/

export {};
