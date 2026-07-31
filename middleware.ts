import { NextRequest, NextResponse, NextFetchEvent } from 'next/server';

// Protected routes that require authentication
const protectedRoutes = ['/perfil'];

// Auth routes (redirect to home if already authenticated)
const authRoutes = ['/auth', '/auth/login', '/auth/register'];

const CLIENT_ID_COOKIE = 'mf_cid';
const CLIENT_ID_MAX_AGE = 60 * 60 * 24 * 400; // ~400 días (tope máximo que permiten los navegadores)

function isTrackablePageRequest(request: NextRequest): boolean {
  if (request.method !== 'GET') return false;

  const pathname = request.nextUrl.pathname;
  if (pathname.startsWith('/api/')) return false;
  if (/\.[a-zA-Z0-9]+$/.test(pathname)) return false; // archivos estáticos (.png, .css, etc.)

  // Prefetches automáticos (hover sobre un link, etc.) no son visitas reales.
  if (request.headers.get('purpose') === 'prefetch') return false;
  if (request.headers.get('next-router-prefetch')) return false;

  return true;
}

function trackPageView(request: NextRequest, event: NextFetchEvent, clientId: string) {
  const backendUrl = process.env.NEXT_PUBLIC_API_URL;
  console.log('[analytics-debug] trackPageView', { backendUrl, path: request.nextUrl.pathname });
  if (!backendUrl) {
    console.log('[analytics-debug] sin NEXT_PUBLIC_API_URL, no se manda nada');
    return;
  }

  const payload = {
    clientId,
    path: request.nextUrl.pathname + request.nextUrl.search,
    referrer: request.headers.get('referer') ?? '',
    country: request.headers.get('x-vercel-ip-country') ?? '',
    userAgent: request.headers.get('user-agent') ?? '',
  };

  event.waitUntil(
    fetch(`${backendUrl}/api/analytics/collect`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    })
      .then((res) => {
        console.log('[analytics-debug] respuesta del backend:', res.status);
      })
      .catch((err) => {
        console.log('[analytics-debug] fetch falló:', err);
      })
  );
}

export function middleware(request: NextRequest, event: NextFetchEvent) {
  const pathname = request.nextUrl.pathname;

  // Check if user has a valid token in cookies
  const token = request.cookies.get('authToken')?.value;

  // Check if route is protected
  const isProtectedRoute = protectedRoutes.some((route) =>
    pathname.startsWith(route)
  );

  // Check if route is an auth route
  const isAuthRoute = authRoutes.some((route) => pathname.startsWith(route));

  // If no token and trying to access protected route, redirect to login
  if (isProtectedRoute && !token) {
    const loginUrl = new URL('/auth/login', request.url);
    loginUrl.searchParams.set('redirect', pathname);
    return NextResponse.redirect(loginUrl);
  }

  // If token exists and trying to access auth routes, redirect to home
  if (isAuthRoute && token) {
    return NextResponse.redirect(new URL('/', request.url));
  }

  const response = NextResponse.next();

  console.log('[analytics-debug] request', {
    pathname,
    method: request.method,
    trackable: isTrackablePageRequest(request),
    prefetchHeader: request.headers.get('next-router-prefetch'),
    purposeHeader: request.headers.get('purpose'),
  });

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
