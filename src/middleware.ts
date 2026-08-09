import { NextRequest, NextResponse, NextFetchEvent } from 'next/server';

const CLIENT_ID_COOKIE = 'mf_cid';
const CLIENT_ID_MAX_AGE = 60 * 60 * 24 * 400; // ~400 días (tope máximo que permiten los navegadores)

// Primer segmento de cada ruta real de la app (ver src/app/*/page.tsx). El middleware corre
// antes de que Next.js resuelva 404s, así que sin esta lista se trackearía cualquier URL
// (typos, links rotos, pruebas manuales tipo /test-manual) como si fuera una página real.
// Importante: agregar acá cualquier sección nueva de nivel superior que se cree a futuro.
const KNOWN_TOP_LEVEL_SEGMENTS = ['auth', 'cart', 'checkout', 'perfil', 'products'];

function isKnownRoute(pathname: string): boolean {
  if (pathname === '/') return true;
  const firstSegment = pathname.split('/')[1];
  return KNOWN_TOP_LEVEL_SEGMENTS.includes(firstSegment);
}

function isTrackablePageRequest(request: NextRequest): boolean {
  if (request.method !== 'GET') return false;

  const pathname = request.nextUrl.pathname;
  if (pathname.startsWith('/api/')) return false;
  if (/\.[a-zA-Z0-9]+$/.test(pathname)) return false; // archivos estáticos (.png, .css, etc.)
  if (!isKnownRoute(pathname)) return false; // ruta inexistente (404) o de prueba

  // Prefetches automáticos (hover sobre un link, etc.) no son visitas reales.
  if (request.headers.get('purpose') === 'prefetch') return false;
  if (request.headers.get('next-router-prefetch')) return false;

  return true;
}

// Params internos de Next.js (no representan la página en sí, ensucian el agrupado de analytics).
const INTERNAL_QUERY_PARAMS = ['_rsc'];

function cleanPath(request: NextRequest): string {
  const params = new URLSearchParams(request.nextUrl.search);
  INTERNAL_QUERY_PARAMS.forEach((p) => params.delete(p));
  const search = params.toString();
  return request.nextUrl.pathname + (search ? `?${search}` : '');
}

function trackPageView(request: NextRequest, event: NextFetchEvent, clientId: string) {
  const backendUrl = process.env.NEXT_PUBLIC_API_URL;
  if (!backendUrl) return;

  const payload = {
    clientId,
    path: cleanPath(request),
    referrer: request.headers.get('referer') ?? '',
    country: request.headers.get('x-vercel-ip-country') ?? '',
    userAgent: request.headers.get('user-agent') ?? '',
  };

  event.waitUntil(
    fetch(`${backendUrl}/api/analytics/collect`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    }).catch(() => {
      // Analítica best-effort: si falla, no debe afectar la navegación del usuario.
    })
  );
}

export function middleware(request: NextRequest, event: NextFetchEvent) {
  // Nota: la cookie `authToken` la emite el backend (dominio distinto al del frontend
  // en producción, ej. *.up.railway.app vs. magicfield.com.ar), así que este middleware
  // -que corre en el servidor del frontend- nunca la ve en request.cookies: por eso antes
  // redirigía SIEMPRE a /auth/login al entrar a /perfil, sin importar si el usuario estaba
  // logueado. El gate real de auth ya lo hacen los propios componentes cliente
  // (profileContext.tsx, auth/login/page.tsx, auth/register/page.tsx) usando
  // isAuthenticated de authContext, que sí resuelve el estado real vía fetch con
  // credentials:'include' al backend.
  const response = NextResponse.next();

  if (isTrackablePageRequest(request)) {
    let clientId = request.cookies.get(CLIENT_ID_COOKIE)?.value;
    if (!clientId) {
      clientId = crypto.randomUUID();
      response.cookies.set(CLIENT_ID_COOKIE, clientId, {
        maxAge: CLIENT_ID_MAX_AGE,
        httpOnly: true,
        sameSite: 'lax',
        secure: process.env.NODE_ENV === 'production',
      });
    }
    trackPageView(request, event, clientId);
  }

  return response;
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - public folder
     */
    '/((?!_next/static|_next/image|favicon.ico|public).*)',
  ],
};
