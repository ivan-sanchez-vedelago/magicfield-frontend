# TODOs - Frontend

## Configuración inicial
- [ ] Instalar dependencias: `npm install`
- [ ] Configurar variables de entorno en `.env.local`
- [ ] Obtener credenciales Firebase de https://console.firebase.google.com

## Autenticación (Firebase)
- [ ] Implementar `authService.ts`:
  - `login(email, password)`
  - `register(email, password)`
  - `logout()`
  - `getCurrentUser()`
  - `verifyFirebaseIdToken(token)`

- [ ] Crear componentes de autenticación:
  - LoginPage (casi completo)
  - RegisterPage (casi completo)
  - Proteger rutas autenticadas

## Productos (Catálogo)
- [ ] Conectar con API Backend `GET /api/products`
- [ ] Implementar `productService.ts`:
  - `getAll()`
  - `getById(id)`
  - `search(query)`
  - `filter(filters)` - Por categoría, rango de precio, stock

- [ ] Componentes:
  - `ProductCard` - Tarjeta individual
  - `ProductGrid` - Grid de productos
  - `ProductDetail` - Detalle de producto
  - Filtros y búsqueda

## Carrito
- [ ] Implementar `cartService.ts`:
  - `addItem(productId, quantity)`
  - `removeItem(productId)`
  - `updateQuantity(productId, quantity)`
  - `clear()`
  - `getCart()`
  - Persistencia en localStorage

- [ ] Componentes:
  - `CartItem` - Línea de item
  - `CartSummary` - Total, impuestos, envío
  - Página de carrito mejorada

## Órdenes
- [ ] Conectar con API Backend `POST /api/orders`
- [ ] Implementar `orderService.ts`:
  - `create(cartItems)`
  - `getAll()`
  - `getById(orderId)`
  - `getByUserId(userId)`
  - `updateStatus(orderId, status)`

- [ ] Componentes:
  - `OrderList` - Historial de órdenes
  - `OrderDetail` - Detalle de orden

## Pagos
- [ ] Integrar proveedor de pagos (sandbox):
  - Stripe / Mercado Pago / Similar
  - Webhook para confirmación

- [ ] Implementar `paymentService.ts`:
  - `createPaymentIntent(orderId, amount)`
  - `confirmPayment(token)`
  - `handleWebhook(payload)`

## Autorización y Seguridad
- [ ] Middleware para verificar Firebase ID Token
- [ ] Proteger rutas según rol:
  - ADMIN: `/admin/*`
  - USER: `/profile/*`, `/orders/*`

- [ ] Validaciones en cliente:
  - Campos requeridos
  - Formato de email
  - Rango de valores

## Componentes reutilizables
- [ ] `Header` - Navegación principal
- [ ] `Footer` - Pie de página
- [ ] `Button` - Botón personalizado
- [ ] `Card` - Componente base
- [ ] `Modal` - Modales
- [ ] `LoadingSpinner` - Indicador de carga
- [ ] `Toast/Alert` - Notificaciones

## Optimización y Testing
- [ ] Tests unitarios para servicios
- [ ] Tests de componentes
- [ ] Optimizar imágenes
- [ ] Code splitting
- [ ] Error boundaries

## Documentación
- [ ] Documentar API de servicios
- [ ] Guía de contribución
- [ ] Ejemplos de uso de componentes

## Prioridad: ALTA
1. Autenticación Firebase ✓ (páginas creadas, lógica pendiente)
2. Listado de productos
3. Carrito y órdenes
4. Integración de pagos

## Prioridad: MEDIA
5. Componentes reutilizables
6. Optimización de UI/UX
7. Tests

## Prioridad: BAJA
8. Documentación avanzada
9. Performance optimization
10. Analytics
