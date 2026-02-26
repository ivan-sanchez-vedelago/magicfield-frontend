# Instrucciones de Instalación - Frontend

## Requisitos previos

- **Node.js**: v18 o superior ([Descargar](https://nodejs.org/))
- **npm**: Viene incluido con Node.js (versión 8+)

## Pasos de instalación

### 1. Verificar instalación de Node.js

```powershell
node --version
npm --version
```

Deberías ver versiones similares a:
- v18.0.0+ (Node.js)
- 8.0.0+ (npm)

### 2. Instalar dependencias

```powershell
cd c:\MagicField\front
npm install
```

Este proceso descargará e instalará:
- Next.js 15
- React 19
- TypeScript
- Tailwind CSS
- Firebase SDK
- Y otras dependencias necesarias

Tiempo aproximado: 3-5 minutos (depende de conexión)

### 3. Configurar variables de entorno

Crear archivo `.env.local` en `c:\MagicField\front\`:

```
NEXT_PUBLIC_FIREBASE_API_KEY=YOUR_API_KEY
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=YOUR_AUTH_DOMAIN
NEXT_PUBLIC_FIREBASE_PROJECT_ID=YOUR_PROJECT_ID
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=YOUR_STORAGE_BUCKET
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=YOUR_MESSAGING_SENDER_ID
NEXT_PUBLIC_FIREBASE_APP_ID=YOUR_APP_ID
```

> Obtener estos valores en: https://console.firebase.google.com

### 4. Iniciar el servidor de desarrollo

```powershell
npm run dev
```

El frontend estará disponible en: **http://localhost:3000**

## Otros comandos

```powershell
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

```powershell
# Limpiar caché y reinstalar
npm cache clean --force
rm -r node_modules
npm install
```

### Puerto 3000 ya está en uso

```powershell
npm run dev -- -p 3001
```

## Estructura del proyecto

Ver `README.md` en la raíz de este directorio para la estructura completa.

## Próximos pasos

1. ✅ Estructura base creada
2. ⏳ Instalar dependencias (`npm install`)
3. ⏳ Configurar Firebase
4. ⏳ Implementar servicios
5. ⏳ Conectar con Backend (API REST)
