import type { Metadata } from 'next';
import { ProductProvider } from '../context/productContext';
import { CartProvider } from '../context/cartContext';
import { AuthProvider } from '../context/authContext';
import { CheckoutProvider } from '../context/checkoutContext';
import { CategoryProvider } from '../context/categoryContext';
import CartToast from '../toast/cartToast';
import AuthToast from '../toast/authToast';
import CheckoutToast from '../toast/checkoutToast';
import { Inter } from 'next/font/google';
import '@/src/globals.css';
import Header from '../components/Header';
import Footer from '../components/Footer';
import { NavigationProvider } from '@/src/components/navigation/NavigationContext';
import TopProgressBar from '@/src/components/navigation/TopProgressBar';
import { Analytics } from '@vercel/analytics/react';
import { SpeedInsights } from '@vercel/speed-insights/next';
import { RootLayoutWrapper } from './RootLayoutWrapper';

const inter = Inter({
  subsets: ['latin'],
  weight: ['400', '500', '600', '700'], // los que vamos a usar
});

export const metadata: Metadata = {
  title: 'Magic Field',
  description: 'Magic Field - Tienda online para podructos TCG y otros relacionados',
  icons: {
    icon: '/images/favicon.ico',
  },
};

export default function RootLayout({ children }: {
  children: React.ReactNode;
}) {
  return (
    <html lang="es">
      <body className={`${inter.className} min-h-[100dvh] flex flex-col`}>
        <RootLayoutWrapper>
          <AuthProvider>
            <CartProvider>
              <CheckoutProvider>
                <ProductProvider>
                  <CategoryProvider>
                  <NavigationProvider>
                    <TopProgressBar  />
                    <Header />
                    <CartToast/>
                    <AuthToast/>
                    <CheckoutToast/>
                    {children}
                    <Footer />
                    <Analytics />
                    <SpeedInsights />
                  </NavigationProvider>
                  </CategoryProvider>
                </ProductProvider>
              </CheckoutProvider>
            </CartProvider>
          </AuthProvider>
        </RootLayoutWrapper>
      </body>
    </html>
  );
}
