// Tipo para usuario autenticado
export interface AuthUser {
  id: string;
  email: string;
  name: string;
}


// Tipo para producto
export type Product = {
  id: string;
  name: string;
  description?: string;
  price: number;
  stock: number;
  type?: 'SIN' | 'PSL' | 'ACC';
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
