'use client';

import { useEffect, useRef, useState } from 'react';
import LoadingLink from '@/src/components/navigation/LoadingLink';
import { formatPrice } from '@/src/utils/formatPrice';
import { getThumbnailUrl } from '@/src/utils/getThumbnailUrl';
import type { Product } from '@/src/types';

export default function NewProductsSection() {
  const [newProducts, setNewProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

  // Endpoint dedicado y acotado (en vez de useProducts(), que trae el catálogo completo):
  // con miles de productos, cargar todo solo para mostrar 20 en este slider era el cuello
  // de botella real de esta pantalla.
  useEffect(() => {
    const controller = new AbortController();
    setLoading(true);
    fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/products/newest?limit=20`, {
      signal: controller.signal,
    })
      .then(r => r.json())
      .then((data: Product[]) => setNewProducts(data))
      .catch(err => {
        if (err.name !== 'AbortError') console.error('Error al cargar novedades:', err);
      })
      .finally(() => setLoading(false));
    return () => controller.abort();
  }, []);

  const containerRef = useRef<HTMLDivElement>(null);
  const trackRef = useRef<HTMLDivElement>(null);

  const [scrollX, setScrollX] = useState(0);
  const [maxScroll, setMaxScroll] = useState(0);
  const [isDragging, setIsDragging] = useState(false);

  const startXRef = useRef(0);
  const startScrollRef = useRef(0);

  const clamp = (value: number) => Math.max(0, Math.min(value, maxScroll));

  useEffect(() => {
    const updateScroll = () => {
      if (!containerRef.current || !trackRef.current) return;
      const containerWidth = containerRef.current.offsetWidth;
      const trackWidth = trackRef.current.scrollWidth + 96;
      setMaxScroll(Math.max(0, trackWidth - containerWidth));
      setScrollX(prev => clamp(prev));
    };
    updateScroll();
    window.addEventListener('resize', updateScroll);
    return () => window.removeEventListener('resize', updateScroll);
  }, [newProducts]);

  useEffect(() => {
    const handleMove = (e: PointerEvent) => {
      if (!isDragging) return;
      const dx = e.clientX - startXRef.current;
      setScrollX(clamp(startScrollRef.current - dx));
    };
    const handleUp = () => { if (isDragging) setIsDragging(false); };

    window.addEventListener('pointermove', handleMove);
    window.addEventListener('pointerup', handleUp);
    window.addEventListener('pointercancel', handleUp);
    return () => {
      window.removeEventListener('pointermove', handleMove);
      window.removeEventListener('pointerup', handleUp);
      window.removeEventListener('pointercancel', handleUp);
    };
  }, [isDragging, maxScroll]);

  const getStep = () => containerRef.current?.offsetWidth ?? 300;
  const goNext = () => { setIsDragging(false); setScrollX(prev => Math.min(prev + getStep(), maxScroll)); };
  const goPrev = () => { setIsDragging(false); setScrollX(prev => Math.max(prev - getStep(), 0)); };

  const handlePointerDown = (e: React.PointerEvent<HTMLDivElement>) => {
    if (e.button !== 0) return;
    setIsDragging(true);
    startXRef.current = e.clientX;
    startScrollRef.current = scrollX;
  };

  if (!loading && newProducts.length === 0) return null;

  return (
    <section className="new_products_section">
      <div className="px-10">
        <div className="flex flex-col">
          <div>
            <p className="main_title_text text-white drop-shadow-lg">✦ Novedades</p>
          </div>
          <div className='flex justify-end justify-between'>
            <p className="normal_text text-gray-200 mt-1 drop-shadow">Revisa los últimos productos</p>
            <LoadingLink href="/products" className="small_text text-gray-200 text_clickable flex items-center min-w-[60px]">
              Ver todo →
            </LoadingLink>
          </div>
        </div>
        <div className="new_products_divider" />
      </div>

      <div
        ref={containerRef}
        className="new_products_track_container"
        style={{ touchAction: 'pan-y' }}
      >
        {loading ? (
          <div className="flex gap-4">
            {Array.from({ length: 6 }).map((_, i) => (
              <div key={i} className="new_products_card_skeleton" />
            ))}
          </div>
        ) : (
          <div
            ref={trackRef}
            className={`flex gap-4 ${isDragging ? '' : 'transition-transform duration-300'}`}
            style={{
              transform: `translateX(-${scrollX}px)`,
              cursor: isDragging ? 'grabbing' : 'grab',
              userSelect: 'none',
            }}
            onPointerDown={handlePointerDown}
          >
            {newProducts.map(p => (
              <NewProductCard key={p.id} product={p} />
            ))}
          </div>
        )}

        <button
          onClick={goPrev}
          disabled={scrollX === 0}
          className="image_slideshow_arrow left-2"
        >
          ‹
        </button>
        <button
          onClick={goNext}
          disabled={scrollX >= maxScroll}
          className="image_slideshow_arrow right-2"
        >
          ›
        </button>
      </div>
    </section>
  );
}

function NewProductCard({ product }: { product: Product }) {
  const [imageLoaded, setImageLoaded] = useState(false);
  const img = getThumbnailUrl(product.imageUrls?.[0]);

  return (
    <LoadingLink href={`/products/${product.id}`} className="new_products_card">
      <div className="new_products_card_img_wrapper">
        {!imageLoaded && img && (
          <div className="absolute inset-0 bg-gray-200 animate-pulse rounded-md" />
        )}
        {img ? (
          <img
            src={img}
            alt={product.displayName ?? product.name}
            className="new_products_card_img"
            loading="lazy"
            onLoad={() => setImageLoaded(true)}
          />
        ) : (
          <div className="new_products_card_img_placeholder">Sin imagen</div>
        )}
      </div>
      <p className="product_title_text primary_text_color limit_two_lines">{product.displayName ?? product.name}</p>
      <p className="small_text secondary_text_color truncate" style={{ fontStyle: 'italic' }}>
        {product.type === 'SIN'
          ? `${product.set ?? ''}${product.collectorNumber ? ` · #${product.collectorNumber}` : ''}`
          : product.description}
      </p>
      <p className="product_price_small_text mt-auto">
        {product.variantCount && product.variantCount > 1 ? 'Desde ' : ''}
        ARS$ {formatPrice(product.price)}
      </p>
    </LoadingLink>
  );
}
