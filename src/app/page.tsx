'use client';

import Link from 'next/link';
import Header from '@/src/components/Header';

export default function Home() {
  return (
    <div className="min-h-screen flex flex-col">
      <main className="flex-1 max-w-7xl mx-auto w-full py-12 px-6">
        <section className="text-center mb-12">
          <h1 className="text-4xl font-bold mb-4">Bienvenido a Magic Field</h1>
          <p className="text-xl text-gray-600 mb-8">
            Encuentra los mejores productos con facilidad
          </p>
          <Link
            href="/products"
            className="button_primary big_button"
          >
            Ver Catálogo
          </Link>
        </section>

        {/* TODO: Agregar sección de productos destacados */}
      </main>
    </div>
  );
}
