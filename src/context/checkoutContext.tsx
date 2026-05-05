'use client';

import React, { createContext, useContext, useState, ReactNode } from 'react';

export interface CheckoutContextType {
  successMessage: string | null;
  showCheckoutSuccess: (message: string) => void;
}

const CheckoutContext = createContext<CheckoutContextType | undefined>(undefined);

export function CheckoutProvider({ children }: { children: ReactNode }) {
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  const showCheckoutSuccess = (message: string) => {
    setSuccessMessage(message);
    setTimeout(() => setSuccessMessage(null), 7000);
  };

  const value: CheckoutContextType = {
    successMessage,
    showCheckoutSuccess,
  };

  return (
    <CheckoutContext.Provider value={value}>
      {children}
    </CheckoutContext.Provider>
  );
}

export const useCheckout = (): CheckoutContextType => {
  const context = useContext(CheckoutContext);
  if (context === undefined) {
    throw new Error('useCheckout must be used within CheckoutProvider');
  }
  return context;
};
