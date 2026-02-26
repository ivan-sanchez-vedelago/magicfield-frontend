import type { Metadata } from 'next';
import { ProductProvider } from '../context/productContext';
import { CartProvider } from '../context/cartContext';
import CartToast from '../toast/cartToast';
import { Inter } from 'next/font/google';
import '../globals.css';
import Header from '../components/Header';
import Footer from '../components/Footer';

const inter = Inter({
  subsets: ['latin'],
  weight: ['400', '500', '600', '700'], // los que vamos a usar
});

export const metadata: Metadata = {
  title: 'Magic Field',
  description: 'Magic Field - pequeño e-commerce para portfolio profesional',
};

export default function RootLayout({ children }: {
  children: React.ReactNode;
}) {
  return (
    <html lang="es">
      <body className={inter.className}>
        <CartProvider>
          <ProductProvider>
            <Header />
            <CartToast/>
            {children}
            <Footer />
          </ProductProvider>
        </CartProvider>
      </body>
    </html>
  );
}
