'use client';

import * as Sentry from '@sentry/nextjs';
import { ReactNode } from 'react';

export function RootLayoutWrapper({ children }: { children: ReactNode }) {
  return (
    <Sentry.ErrorBoundary fallback={<ErrorFallback />}>
      {children}
    </Sentry.ErrorBoundary>
  );
}

function ErrorFallback() {
  return (
    <div style={{ padding: '2rem', textAlign: 'center' }}>
      <h2>Algo salió mal</h2>
      <p style={{ color: '#6b7280', margin: '1rem 0' }}>
        Ocurrió un error inesperado. Ya fue reportado automáticamente.
      </p>
    </div>
  );
}
