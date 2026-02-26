front/
├── src/
│   ├── app/
│   │   ├── layout.tsx              # Layout raíz
│   │   ├── page.tsx                # Home
│   │   ├── globals.css             # Estilos globales
│   │   ├── auth/
│   │   │   ├── login/
│   │   │   │   └── page.tsx        # Página de login
│   │   │   └── register/
│   │   │       └── page.tsx        # Página de registro
│   │   ├── products/
│   │   │   └── page.tsx            # Catálogo de productos
│   │   └── cart/
│   │       └── page.tsx            # Página de carrito
│   ├── components/                 # TODO: Componentes reutilizables
│   │   └── .gitkeep
│   ├── lib/
│   │   └── firebase.ts             # Inicialización de Firebase
│   ├── config/
│   │   └── firebase.ts             # Configuración de Firebase
│   ├── types/
│   │   └── index.ts                # Tipos TypeScript
│   └── services/                   # TODO: Servicios y lógica
│       └── README.md
├── public/                         # Archivos estáticos
├── .eslintrc.json                  # Configuración ESLint
├── .gitignore
├── package.json                    # Dependencias
├── tsconfig.json                   # Configuración TypeScript
├── tailwind.config.ts              # Configuración Tailwind CSS
├── postcss.config.js               # Configuración PostCSS
├── next.config.js                  # Configuración Next.js
├── README.md                       # Documentación principal
├── INSTALACION.md                  # Guía de instalación
└── ESTRUCTURA.md                   # Este archivo
