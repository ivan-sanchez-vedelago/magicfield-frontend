'use client';

import LoadingLink from '@/src/components/navigation/LoadingLink';
import BannerSlider from '@/src/components/BannerSlider';

export default function Home() {
  return (
    <div className="flex-1 flex flex-col">
      <main className="mx-auto w-full py-12 px-6">
        <section className="text-center mb-12">
          <h1 className="main_title_text">Bienvenido a Magic Field</h1>
          <p className="normal_text text-gray-400 mt-2 mb-8">
            Encuentra los mejores productos con facilidad
          </p>
          <LoadingLink
            href="/products"
            className="button_primary big_button"
          >
            Ver Catálogo
          </LoadingLink>
        </section>

        {/* Banner slider de novedades y promociones */}
        <section className="mb-12">
          <BannerSlider />
        </section>

        {/* TODO: Agregar sección de productos destacados */}
      </main>
    </div>
  );
}
