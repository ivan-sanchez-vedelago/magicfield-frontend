import type { Metadata } from 'next';
import { ProductProvider } from '../context/productContext';
import { CartProvider } from '../context/cartContext';
import CartToast from '../toast/cartToast';
import { Inter } from 'next/font/google';
import '../globals.css';
import Header from '../components/Header';
import Footer from '../components/Footer';
import { NavigationProvider } from '@/src/components/navigation/NavigationContext';
import TopProgressBar from '@/src/components/navigation/TopProgressBar';

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
      <body className={inter.className}>
        <CartProvider>
          <ProductProvider>
            <NavigationProvider>
              <TopProgressBar  />
              <Header />
              <CartToast/>
              {children}
              <Footer />
            </NavigationProvider>
          </ProductProvider>
        </CartProvider>
      </body>
    </html>
  );
}
