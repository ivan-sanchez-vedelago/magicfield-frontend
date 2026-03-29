// TODO: Tipos para usuario autenticado
export interface AuthUser {
  uid: string;
  email: string | null;
  displayName: string | null;
  role: 'ADMIN' | 'USER';
}

// Tipo para producto
export type Product = {
  id: string;
  name: string;
  description?: string;
  price: number;
  stock: number;
  type?: 'SINGLE' | 'SEALED' | 'OTHER';
  scryfallId?: string;
  isFoil?: boolean;
  set?: string;
  collectorNumber?: string;
  condition?: string;
  language?: string;
  imageUrls?: string[];
};

// TODO: Tipos para carrito
export interface CartItem {
  productId: string;
  name: string;
  price: number;
  quantity: number;
  imageUrl?: string;
}

// TODO: Tipos para orden
export interface Order {
  id: string;
  userId: string;
  items: CartItem[];
  total: number;
  status: 'PENDING' | 'PAID' | 'SHIPPED' | 'DELIVERED' | 'CANCELLED';
  createdAt: Date;
  updatedAt: Date;
}
