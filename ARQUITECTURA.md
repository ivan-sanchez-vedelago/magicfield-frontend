## Arquitectura de Magic Field

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
        │ Click "Agregar al carrito"
        ▼
┌─────────────────────┐
│ cartService.addItem │ → Almacena en localStorage
└─────────────────────┘
        │
        ▼
┌─────────────────┐
│ /cart           │ → Muestra items del carrito
└─────────────────┘
        │ Click "Proceder al Pago"
        ▼
┌─────────────────────┐
│ orderService.create │ → POST /api/orders
│                     │ ← Crea orden en Backend
└─────────────────────┘
        │
        ▼
┌─────────────────────┐
│ paymentService      │ → POST /api/payments
│ (Proveedor Externo) │ ← Redirige a pago
└─────────────────────┘
        │ ✓ Pago exitoso
        ▼
┌─────────────────────┐
│ Webhook Backend     │ → Actualiza estado orden
└─────────────────────┘
        │
        ▼
┌─────────────────────┐
│ Página Confirmación │ ✓ Compra completada
└─────────────────────┘
```

## Componentes de UI

```
App Root
├── Header
│   ├── Logo (Link /)
│   ├── Nav
│   │   ├── Productos (Link /products)
│   │   ├── Carrito (Link /cart)
│   │   └── Ingresar (Link /auth/login)
│   └── User Menu (si autenticado)
│
├── Main Content
│   ├── Home (/page.tsx)
│   ├── Products (/products/page.tsx)
│   │   ├── SearchBar
│   │   ├── Filters
│   │   └── ProductGrid
│   │       └── ProductCard (repetido)
│   ├── Cart (/cart/page.tsx)
│   │   ├── CartItems
│   │   └── CartSummary
│   ├── Login (/auth/login/page.tsx)
│   └── Register (/auth/register/page.tsx)
│
└── Footer
    ├── Copyright
    └── Links
```

## Servicios y sus Responsabilidades

### authService
- `login()` → Firebase Auth
- `register()` → Firebase Auth
- `logout()` → Firebase Auth
- `getCurrentUser()` → Firebase Auth
- `getIdToken()` → Obtener token para Backend

### productService
- `getAll()` → Backend /api/products
- `getById()` → Backend /api/products/:id
- `search()` → Backend /api/products/search
- `filter()` → Backend /api/products/filter

### cartService
- `getCart()` → localStorage
- `addItem()` → localStorage
- `removeItem()` → localStorage
- `updateQuantity()` → localStorage
- `clear()` → localStorage

### orderService
- `create()` → Backend POST /api/orders
- `getAll()` → Backend /api/orders
- `getById()` → Backend /api/orders/:id
- `updateStatus()` → Backend PATCH /api/orders/:id

### paymentService
- `createPaymentIntent()` → Backend POST /api/payments
- `confirmPayment()` → Proveedor externo
- `handleWebhook()` → Backend webhook

## Seguridad

```
Cliente                          Backend
  │                                 │
  ├─ (1) Login                     │
  │       ▼                         │
  │    Firebase Auth ───────────► ✓
  │       ◄─── ID Token ◄─────────
  │                                 │
  ├─ (2) API Request               │
  │   + ID Token (header)           │
  │       ─────────────────────────►
  │                                 │ Verifica Token
  │                                 │ (Spring Security)
  │                                 │ ✓ Token válido
  │                                 │ ✓ Usuario autorizado
  │       ◄───── Respuesta ────────
  │
```

---

**Notas:**
- No hay estado global (useState + localStorage)
- Validaciones en cliente y servidor
- Firebase para autenticación (simple y segura)
- PostgreSQL para datos persistentes
- API REST para comunicación Frontend-Backend
