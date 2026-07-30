import * as Sentry from '@sentry/nextjs';

Sentry.init({
  dsn: process.env.NEXT_PUBLIC_SENTRY_DSN,
  tracesSampleRate: 0.3,
  replaysSessionSampleRate: 0,
  replaysOnErrorSampleRate: 0,
  environment: process.env.NODE_ENV,
  integrations: [
    Sentry.browserTracingIntegration(),
  ],
  ignoreErrors: [
    // Ruido de in-app browsers de terceros (Facebook/Instagram, etc.) que
    // inyectan su propio puente JS y fallan al asumir un WKWebView de iOS.
    // No es código nuestro, no es accionable.
    "undefined is not an object (evaluating 'window.webkit.messageHandlers')",
    /window\.webkit\.messageHandlers/,
    // Mismo tipo de ruido en Android: el puente nativo del in-app browser de
    // Facebook se destruye mientras una llamada JS sigue en curso.
    /enableDidUserTypeOnKeyboardLogging/,
    "Java object is gone",
    // Cancelaciones intencionales de fetch (AbortController) cuando el usuario
    // cambia de filtro/búsqueda/página antes de que responda la request
    // anterior (ver ProductsContent.tsx). Nuestro propio código ya ignora
    // AbortError; esto lo reporta la instrumentación automática de fetch del
    // SDK de Sentry, no es un error real.
    "signal is aborted without reason",
    "AbortError",
    // Extensiones de wallet cripto (MetaMask, etc.) que se auto-inyectan en
    // cualquier página del navegador e intentan conectarse solas. No tenemos
    // ningún código web3 en el sitio, así que esto nunca viene de nosotros.
    "Failed to connect to MetaMask",
  ],
});
