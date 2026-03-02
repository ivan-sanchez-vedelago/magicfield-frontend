'use client';

import { createContext, useContext, useState } from 'react';

type NavigationContextType = {
  loading: boolean;
  startNavigation: () => void;
  stopNavigation: () => void;
};

const NavigationContext = createContext<NavigationContextType | null>(null);

export function NavigationProvider({ children }: { children: React.ReactNode }) {
  const [loading, setLoading] = useState(false);

  const startNavigation = () => setLoading(true);
  const stopNavigation = () => setLoading(false);

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