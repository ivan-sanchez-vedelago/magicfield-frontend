// TODO: Tipos para usuario autenticado
export interface AuthUser {
  uid: string;
  email: string | null;
  displayName: string | null;
  role: 'ADMIN' | 'USER';
}

// TODO: Tipos para producto
export interface Product {
  id: string;
  name: string;
  description: string;
  price: number;
  stock: number;
  imageUrl: string;
  createdAt: Date;
}

// TODO: Tipos para carrito
export interface CartItem {
  productId: number;
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
