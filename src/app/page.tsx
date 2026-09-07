'use client';

import LoadingLink from '@/src/components/navigation/LoadingLink';
import BannerSlider from '@/src/components/BannerSlider';
import NewProductsSection from '@/src/components/product/NewProductsSection';
import BulkFilterBanner from '@/src/components/BulkFilterBanner';

export default function Home() {
  return (
    <div className="flex-1 flex flex-col">
      <main className="">
        {/* Banner slider de novedades y promociones */}
        <section className="mx-auto w-full py-8 px-6 mb-4">
          <BannerSlider />
        </section>

        {/* Sección de productos nuevos */}
        <section className="">
          <NewProductsSection />
        </section>

        {/* Promociona "Filtrar en bulk" -- debajo de Novedades, para que el usuario la note */}
        <section className="mx-auto w-full py-8 px-6">
          <BulkFilterBanner />
        </section>
      </main>
    </div>
  );
}
