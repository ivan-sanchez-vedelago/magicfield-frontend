'use client';

import { useEffect, useMemo, useRef, useState } from 'react';
import LoadingLink from '@/src/components/navigation/LoadingLink';
import { formatPrice } from '@/src/utils/formatPrice';
import { useProducts } from '@/src/context/productContext';
import type { Product } from '@/src/types';

export default function NewProductsSection() {
  const { products, loading } = useProducts();

  const newProducts = useMemo(() => {
    return [...products]
      .filter(p => p.createdAt)
      .sort((a, b) => new Date(b.createdAt!).getTime() - new Date(a.createdAt!).getTime())
      .slice(0, 20);
  }, [products]);

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
      <div className="new_products_header">
        <div className="new_products_header_row">
          <div>
            <p className="new_products_label">✦ Novedades</p>
            <p className="new_products_subtitle">Los últimos productos en nuestro catálogo</p>
          </div>
          <LoadingLink href="/products" className="new_products_link">
            Ver todo →
          </LoadingLink>
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
          className="new_products_arrow left-2"
        >
          ‹
        </button>
        <button
          onClick={goNext}
          disabled={scrollX >= maxScroll}
          className="new_products_arrow right-2"
        >
          ›
        </button>
      </div>
    </section>
  );
}

function NewProductCard({ product }: { product: Product }) {
  const [imageLoaded, setImageLoaded] = useState(false);
  const img = product.imageUrls?.[0];

  return (
    <LoadingLink href={`/products/${product.id}`} className="new_products_card">
      <div className="new_products_card_img_wrapper">
        {!imageLoaded && img && (
          <div className="absolute inset-0 bg-gray-200 animate-pulse rounded-md" />
        )}
        {img ? (
          <img
            src={img}
            alt={product.name}
            className="new_products_card_img"
            onLoad={() => setImageLoaded(true)}
          />
        ) : (
          <div className="new_products_card_img_placeholder">Sin imagen</div>
        )}
      </div>
      <p className="new_products_card_name">{product.name}</p>
      <p className="new_products_card_price">ARS$ {formatPrice(product.price)}</p>
    </LoadingLink>
  );
}
