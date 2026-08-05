'use client';

import { createContext, useContext, useState, useEffect } from 'react';
import { usePathname } from 'next/navigation';

type NavigationContextType = {
  loading: boolean;
  startNavigation: () => void;
  stopNavigation: () => void;
};

const NavigationContext = createContext<NavigationContextType | null>(null);

export function NavigationProvider({ children }: { children: React.ReactNode }) {
  const [loading, setLoading] = useState(false);
  const pathname = usePathname();

  const startNavigation = () => setLoading(true);
  const stopNavigation = () => setLoading(false);

  // La ruta de destino ya se montó: la navegación terminó de verdad.
  useEffect(() => {
    stopNavigation();
  }, [pathname]);

  return (
    <NavigationContext.Provider value={{ loading, startNavigation, stopNavigation }}>
      {children}
    </NavigationContext.Provider>
  );
}

export function useNavigation() {
  const ctx = useContext(NavigationContext);
  if (!ctx) throw new Error('useNavigation must be used inside NavigationProvider');
  return ctx;
}