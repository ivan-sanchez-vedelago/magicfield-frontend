# Magic Field Frontend

Frontend de Magic Field desarrollado con Next.js 15, TypeScript y Tailwind CSS.

## Descripción

Aplicación web completa para e-commerce de productos Magic: The Gathering. Incluye catálogo de productos, autenticación con Firebase, carrito de compras, checkout y administración de productos.

## Stack Tecnológico

- **Framework**: Next.js 15 (App Router)
- **Lenguaje**: TypeScript
- **Estilos**: Tailwind CSS 3.4
- **Autenticación**: Firebase Auth
- **Base de Datos**: Firestore (lecturas)
- **Estado**: React Context API + localStorage
- **Node**: 18+

## Arquitectura

```
┌─────────────────────────────────────────────────────────────────┐
│                     FRONTEND (Next.js 15)                        │
├─────────────────────────────────────────────────────────────────┤
│                                                                   │
│  src/app/                                                        │
│  ├── /                  (Home)                                   │
│  ├── /products          (Catálogo)                              │
│  ├── /cart              (Carrito)                               │
│  ├── /auth/login        (Ingreso)                               │
│  └── /auth/register     (Registro)                              │
│                                                                   │
│  src/services/          (Lógica de negocio)                     │
│  ├── authService        → Firebase Auth                         │
│  ├── productService     → GET /api/products                     │
│  ├── cartService        → localStorage                          │
│  ├── orderService       → POST /api/orders                      │
│  └── paymentService     → POST /api/payments                    │
│                                                                   │
│  src/lib/               (Configuración)                          │
│  └── firebase.ts        (Init Firebase)                         │
│                                                                   │
└─────────────────────────────────────────────────────────────────┘
                              │
                    ┌─────────┴─────────┐
                    │                   │
                    ▼                   ▼
        ┌───────────────────┐  ┌──────────────────┐
        │  Firebase Cloud   │  │  Backend API     │
        │  (Auth+Firestore) │  │  (Spring Boot)   │
        └───────────────────┘  └──────────────────┘
                │                      │
                │                      │ REST API
                │                      │ (JSON)
                │              ┌───────┴────────┐
                │              │                │
                │              ▼                ▼
                │         ┌──────────┐   ┌──────────────┐
                │         │Products  │   │Orders/Users  │
                │         │(JPA)     │   │(JPA)         │
                │         └──────────┘   └──────────────┘
                │              │                │
                └──────┬───────┴────────┬───────┘
                       │                │
                       ▼                ▼
            ┌────────────────────────────────┐
            │   PostgreSQL Database          │
            │ - products                     │
            │ - users                        │
            │ - orders                       │
            │ - order_items                  │
            │ - payments                     │
            └────────────────────────────────┘
```

## Flujo de Autenticación

```
Usuario
   │
   ├─ (1) Ingresa email/contraseña
   │
   ▼
┌──────────────────────┐
│ Login Page           │ ← authService.login()
│ /auth/login          │
└──────────────────────┘
   │
   ├─ (2) Firebase Auth
   │   signInWithEmailAndPassword()
   │
   ▼
┌──────────────────────┐
│ Firebase Auth        │ → Verifica credenciales
│                      │ → Genera ID Token
└──────────────────────┘
   │
   ├─ (3) ID Token
   │   Guardado en cliente (sesión)
   │
   ▼
┌──────────────────────┐
│ Redirect a           │ ✓ Autenticado
│ /products            │
└──────────────────────┘
```

## Flujo de Compra

```
┌─────────────────┐
│ Home / Productos │ → Navega catálogo
└─────────────────┘
        │
        ▼
┌─────────────────────┐
│ ProductCard         │ → productService.getAll()
│ /products           │ ← Obtiene lista del Backend
└─────────────────────┘
        │
        ▼
┌─────────────────────┐
│ Agregar al carrito  │ → cartService.addItem()
│                     │ → localStorage
└─────────────────────┘
        │
        ▼
┌─────────────────────┐
│ Carrito (/cart)     │ → Revisar items
│                     │ → Calcular total
└─────────────────────┘
        │
        ▼
┌─────────────────────┐
│ Checkout            │ → orderService.create()
│ /checkout           │ → POST /api/orders/checkout
└─────────────────────┘
        │
        ▼
┌─────────────────────┐
│ Success Page        │ → Limpiar carrito
│ /checkout/success   │ → Mostrar confirmación
└─────────────────────┘
```

## Estructura del Proyecto

```
front/
├── src/
│   ├── app/
│   │   ├── layout.tsx              # Layout raíz
│   │   ├── page.tsx                # Home
│   │   ├── globals.css             # Estilos globales
│   │   ├── auth/
│   │   │   ├── login/
│   │   │   │   └── page.tsx        # Login
│   │   │   └── register/
│   │   │       └── page.tsx        # Registro
│   │   ├── products/
│   │   │   └── page.tsx            # Catálogo
│   │   ├── cart/
│   │   │   └── page.tsx            # Carrito
│   │   └── checkout/
│   │       ├── page.tsx            # Checkout
│   │       └── success/
│   │           └── page.tsx        # Éxito
│   ├── components/
│   │   ├── Footer.tsx
│   │   ├── Header.tsx
│   │   └── navigation/
│   │       └── NavigationContext.tsx
│   ├── config/
│   │   └── firebase.ts             # Config Firebase
│   ├── context/
│   │   ├── cartContext.tsx
│   │   └── productContext.tsx
│   ├── lib/
│   │   └── firebase.ts             # Init Firebase
│   ├── services/
│   │   └── README.md               # Servicios (TODO)
│   ├── types/
│   │   └── index.ts                # Tipos TS
│   └── utils/
│       └── formatPrice.ts
├── public/
│   └── images/
├── .eslintrc.json                  # ESLint
├── .gitignore
├── package.json                    # Dependencias
├── tsconfig.json                   # TypeScript
├── tailwind.config.ts              # Tailwind
├── postcss.config.js               # PostCSS
├── next.config.js                  # Next.js
└── README.md                       # Este archivo
```

## Instalación

### Requisitos previos

- **Node.js**: v18 o superior ([Descargar](https://nodejs.org/))
- **npm**: Viene incluido con Node.js (versión 8+)

### Pasos de instalación

1. **Verificar instalación de Node.js**
   ```powershell
   node --version
   npm --version
   ```

   Deberías ver versiones similares a:
   - v18.0.0+ (Node.js)
   - 8.0.0+ (npm)

2. **Instalar dependencias**
   ```powershell
   cd c:\MagicField\front
   npm install
   ```

   Tiempo aproximado: 3-5 minutos

3. **Configurar variables de entorno**

   Crear `.env.local` en `c:\MagicField\front\`:
   ```
   NEXT_PUBLIC_FIREBASE_API_KEY=YOUR_API_KEY
   NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=YOUR_AUTH_DOMAIN
   NEXT_PUBLIC_FIREBASE_PROJECT_ID=YOUR_PROJECT_ID
   NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=YOUR_STORAGE_BUCKET
   NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=YOUR_MESSAGING_SENDER_ID
   NEXT_PUBLIC_FIREBASE_APP_ID=YOUR_APP_ID

   NEXT_PUBLIC_API_URL=http://localhost:8080
   ```

   > Obtener credenciales Firebase en: https://console.firebase.google.com

4. **Iniciar el servidor de desarrollo**
   ```powershell
   npm run dev
   ```

   El frontend estará disponible en: **http://localhost:3000**

   > **Nota**: Asegúrate de que el backend esté corriendo en `http://localhost:8080` antes de iniciar el frontend

## Otros comandos

```bash
# Build para producción
npm run build

# Iniciar servidor de producción
npm start

# Linting
npm run lint
```

## Solución de problemas

### Error: "npm no se reconoce"
- Instala Node.js desde https://nodejs.org/
- Reinicia la terminal/PowerShell después de instalar
- Verifica: `node --version` y `npm --version`

### Error: "Cannot find module"
```bash
# Limpiar caché y reinstalar
npm cache clean --force
rm -r node_modules
npm install
```

### Puerto 3000 ya está en uso
```bash
npm run dev -- -p 3001
```

## Checklist de Implementación Completada

### ✅ Configuración (13 archivos)
- [x] `package.json` - Dependencias correctas
- [x] `tsconfig.json` - TypeScript configurado
- [x] `tailwind.config.ts` - Tailwind CSS
- [x] `postcss.config.js` - PostCSS
- [x] `next.config.js` - Next.js
- [x] `.eslintrc.json` - ESLint
- [x] `.gitignore` - Git ignore

### ✅ Documentación (9 archivos)
- [x] `README.md` - Documentación principal
- [x] `INSTALACION.md` - Guía paso a paso
- [x] `ESTRUCTURA.md` - Diagrama de carpetas
- [x] `ARQUITECTURA.md` - Diagramas de flujo
- [x] `EJEMPLOS.md` - Ejemplos de código
- [x] `TODOS.md` - Lista de tareas
- [x] `CHECKLIST.md` - Verificación del proyecto
- [x] `ROADMAP.md` - Próximos pasos
- [x] `RESUMEN_GENERACION.md` - Resumen de generación

### ✅ Estructura de Carpetas (8 carpetas)
- [x] `src/app/` - Páginas (App Router)
- [x] `src/app/auth/` - Autenticación
- [x] `src/app/auth/login/` - Login
- [x] `src/app/auth/register/` - Registro
- [x] `src/app/products/` - Productos
- [x] `src/app/cart/` - Carrito
- [x] `src/components/` - Componentes
- [x] `src/config/` - Configuración
- [x] `src/lib/` - Librerías
- [x] `src/types/` - Tipos TypeScript
- [x] `src/services/` - Servicios
- [x] `src/context/` - Context API
- [x] `src/utils/` - Utilidades

### ✅ Archivos TypeScript/TSX (15+ archivos)
- [x] `src/app/layout.tsx` - Layout raíz
- [x] `src/app/page.tsx` - Home page
- [x] `src/app/products/page.tsx` - Catálogo
- [x] `src/app/cart/page.tsx` - Carrito
- [x] `src/app/checkout/page.tsx` - Checkout
- [x] `src/app/checkout/success/page.tsx` - Éxito
- [x] `src/app/auth/login/page.tsx` - Login
- [x] `src/app/auth/register/page.tsx` - Registro
- [x] `src/config/firebase.ts` - Config Firebase
- [x] `src/lib/firebase.ts` - Init Firebase
- [x] `src/types/index.ts` - Tipos TypeScript
- [x] `src/globals.css` - Estilos globales
- [x] `src/context/cartContext.tsx` - Carrito
- [x] `src/context/productContext.tsx` - Productos
- [x] `src/components/Footer.tsx` - Footer
- [x] `src/components/Header.tsx` - Header
- [x] `src/utils/formatPrice.ts` - Utilidad

### ✅ Features Implementados
- [x] Autenticación Firebase (login/register)
- [x] Páginas funcionales (Home, Products, Cart, Auth)
- [x] Carrito con localStorage
- [x] Checkout con validación
- [x] Context API para estado global
- [x] Diseño responsive con Tailwind
- [x] Tipos TypeScript completos

## Roadmap de Implementación

### ✅ Fase 1: Setup Inicial (Completada)
- [x] Instalar dependencias
- [x] Configurar variables de entorno
- [x] Verificar que compila
- [x] Abrir en navegador

### 🔄 Fase 2: Autenticación (En progreso)
- [x] Crear proyecto en Firebase Console
- [x] Habilitar autenticación por email/password
- [ ] Implementar `src/services/authService.ts`
- [ ] Conectar formularios de login/register
- [ ] Implementar protección de rutas
- [ ] Agregar estado de usuario global

### 📋 Fase 3: Backend - Productos
- [ ] Crear estructura base Spring Boot
- [ ] Endpoint GET `/api/products`
- [ ] Conectar con backend
- [ ] Crear componente `ProductCard`
- [ ] Implementar búsqueda básica

### 🛒 Fase 4: Carrito y Órdenes
- [x] Carrito con localStorage (implementado)
- [ ] Conectar con API Backend `POST /api/orders`
- [ ] Implementar `orderService.ts`
- [ ] Componentes de órdenes

### 💳 Fase 5: Pagos
- [ ] Integrar proveedor de pagos (Stripe/Mercado Pago)
- [ ] Implementar `paymentService.ts`

## Ejemplos de Servicios

### Servicio de Autenticación
```typescript
// src/services/authService.ts
import { auth } from '@/lib/firebase';
import { signInWithEmailAndPassword, signOut, onAuthStateChanged } from 'firebase/auth';

export const authService = {
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
};
```

### Servicio de Productos
```typescript
// src/services/productService.ts
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
};
```

### Servicio de Carrito
```typescript
// src/services/cartService.ts
const STORAGE_KEY = 'ecommerce-cart';

export const cartService = {
  getCart() {
    if (typeof window === 'undefined') return [];
    const cart = localStorage.getItem(STORAGE_KEY);
    return cart ? JSON.parse(cart) : [];
  },

  addItem(productId: string, quantity: number) {
    const cart = this.getCart();
    const existing = cart.find(item => item.productId === productId);
    if (existing) {
      existing.quantity += quantity;
    } else {
      cart.push({ productId, quantity });
    }
    localStorage.setItem(STORAGE_KEY, JSON.stringify(cart));
  },
};
```

## Próximos Pasos (TODOs)

### Configuración inicial
- [x] Instalar dependencias: `npm install`
- [x] Configurar variables de entorno en `.env.local`
- [x] Obtener credenciales Firebase

### Autenticación (Firebase)
- [ ] Implementar `authService.ts`
- [ ] Crear componentes de autenticación
- [ ] Proteger rutas autenticadas

### Productos (Catálogo)
- [ ] Conectar con API Backend `GET /api/products`
- [ ] Implementar `productService.ts`
- [ ] Componentes: `ProductCard`, `ProductGrid`
- [ ] Filtros y búsqueda

### Carrito
- [x] Implementar `cartService.ts` (localStorage)
- [ ] Componentes: `CartItem`, `CartSummary`
- [ ] Conectar "Agregar al carrito"

### Órdenes
- [ ] Conectar con API Backend `POST /api/orders`
- [ ] Implementar `orderService.ts`
- [ ] Componentes: `OrderList`, `OrderDetail`

### Pagos
- [ ] Integrar proveedor de pagos
- [ ] Implementar `paymentService.ts`

### Componentes reutilizables
- [ ] `Header` - Navegación principal
- [ ] `Footer` - Pie de página
- [ ] `Button` - Botón personalizado
- [ ] `Card` - Componente base
- [ ] `Modal` - Modales
- [ ] `LoadingSpinner` - Indicador de carga
- [ ] `Toast/Alert` - Notificaciones

### Optimización
- [ ] Tests unitarios
- [ ] Code splitting
- [ ] Error boundaries

## Tipos TypeScript

```typescript
// src/types/index.ts
export interface AuthUser {
  uid: string;
  email: string;
  displayName?: string;
}

export interface Product {
  id: string;
  name: string;
  description: string;
  price: number;
  stock: number;
  images?: string[];
  category?: string;
}

export interface CartItem {
  productId: string;
  quantity: number;
  product?: Product;
}

export interface Order {
  id: string;
  customerName: string;
  customerEmail: string;
  items: CartItem[];
  total: number;
  status: 'pending' | 'confirmed' | 'shipped' | 'delivered';
  createdAt: Date;
}
```

## Despliegue

### Vercel (Recomendado)
1. Conectar repositorio a Vercel
2. Configurar variables de entorno
3. Deploy automático

### Build Manual
```bash
npm run build
npm start
```

## Contribución

1. Fork el proyecto
2. Crear rama feature (`git checkout -b feature/nueva-funcionalidad`)
3. Commit cambios (`git commit -am 'Agrega nueva funcionalidad'`)
4. Push a la rama (`git push origin feature/nueva-funcionalidad`)
5. Crear Pull Request

## Licencia

Este proyecto es privado y propiedad de Magic Field.
