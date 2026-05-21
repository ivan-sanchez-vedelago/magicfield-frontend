'use client';

import LoadingLink from '@/src/components/navigation/LoadingLink';
import BannerSlider from '@/src/components/BannerSlider';
import NewProductsSection from '@/src/components/product/NewProductsSection';

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

        <section className="mx-auto w-full py-8 px-6 text-center mb-8">

        </section>
      </main>
    </div>
  );
}
