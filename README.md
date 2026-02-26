# Magic Field Frontend

Frontend de Magic Field desarrollado con Next.js 15, TypeScript y Tailwind CSS.

## Stack

- **Framework**: Next.js 15 (App Router)
- **Lenguaje**: TypeScript
- **Estilos**: Tailwind CSS
- **Autenticación**: Firebase Auth
- **Base de datos**: Firestore (lecturas básicas)
- **Node**: 18+

## Estructura de carpetas

```
src/
├── app/                    # App Router pages
│   ├── layout.tsx
│   ├── page.tsx           # Home
│   ├── products/          # Catálogo de productos
│   ├── cart/              # Carrito
│   └── auth/              # Autenticación
│       ├── login/
│       └── register/
├── components/            # Componentes reutilizables (TODO)
├── lib/                   # Funciones y utilidades
│   └── firebase.ts
├── config/                # Configuración
│   └── firebase.ts
├── types/                 # Tipos TypeScript
│   └── index.ts
├── services/              # Servicios API y lógica (TODO)
└── globals.css
```

## Instalación

```bash
npm install
```

## Variables de entorno

Crear `.env.local`:

```
NEXT_PUBLIC_FIREBASE_API_KEY=
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=
NEXT_PUBLIC_FIREBASE_PROJECT_ID=
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=
NEXT_PUBLIC_FIREBASE_APP_ID=
```

## Desarrollo

```bash
npm run dev
# http://localhost:3000
```

## Build

```bash
npm run build
npm start
```

## Próximos pasos

- [ ] Implementar autenticación Firebase
- [ ] Conectar con API Backend (Java/Spring Boot)
- [ ] Cargar productos desde base de datos
- [ ] Implementar carrito con localStorage/context
- [ ] Integración de pagos
- [ ] Autorización por roles (ADMIN/USER)
- [ ] Tests básicos
