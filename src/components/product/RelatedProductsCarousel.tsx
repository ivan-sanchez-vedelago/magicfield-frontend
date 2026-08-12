'use client';

import { useEffect, useRef, useState } from 'react';
import LoadingLink from '@/src/components/navigation/LoadingLink';
import { formatPrice } from '@/src/utils/formatPrice';
import type { Product } from '@/src/types';

export default function RelatedProductsCarousel({
  products
}: {
  products: Product[];
}) {
    const containerRef = useRef<HTMLDivElement>(null);
    const trackRef = useRef<HTMLDivElement>(null);

    const [scrollX, setScrollX] = useState(0);
    const [maxScroll, setMaxScroll] = useState(0);
    const [isDragging, setIsDragging] = useState(false);

    const startXRef = useRef(0);
    const startScrollRef = useRef(0);
    const lastXRef = useRef(0);
    const lastTimeRef = useRef(0);

    const clamp = (value: number) =>
        Math.max(0, Math.min(value, maxScroll));

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
    }, [products]);

    useEffect(() => {
        const handleMove = (e: PointerEvent) => {
            if (!isDragging) return;

            const dx = e.clientX - startXRef.current;
            const newScroll = startScrollRef.current - dx;

            const now = performance.now();

            lastXRef.current = e.clientX;
            lastTimeRef.current = now;

            setScrollX(clamp(newScroll));
        };

        const handleUp = () => {
            if (!isDragging) return;
            setIsDragging(false);
        };

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

    const goNext = () => {
        setIsDragging(false);
        setScrollX(prev => Math.min(prev + getStep(), maxScroll));
    };

    const goPrev = () => {
        setIsDragging(false);
        setScrollX(prev => Math.max(prev - getStep(), 0));
    };

    const handlePointerDown = (e: React.PointerEvent<HTMLDivElement>) => {
        if (e.button !== 0) return;

        setIsDragging(true);

        startXRef.current = e.clientX;
        startScrollRef.current = scrollX;

        lastXRef.current = e.clientX;
        lastTimeRef.current = performance.now();
    };

    if (!products.length) return null;

    return (
        <div className="relative">
            <div
                ref={containerRef}
                className="related_products overflow-hidden relative"
                style={{ touchAction: 'pan-y' }}
            >
                <div
                ref={trackRef}
                className={`flex gap-4 ${
                    isDragging ? '' : 'transition-transform duration-300'
                }`}
                style={{
                    transform: `translateX(-${scrollX}px)`,
                    cursor: isDragging ? 'grabbing' : 'grab',
                    userSelect: 'none'
                }}
                onPointerDown={handlePointerDown}
                >
                {products.map(p => {
                    const finishLabel = p.type === 'SIN' && p.finishShortName && p.finishShortName !== 'NONFOIL'
                        ? (p.finishName ?? p.finishShortName)
                        : null;

                    return (
                    <LoadingLink
                    key={p.id}
                    href={`/products/${p.id}`}
                    className="product_box box_border flex-shrink-0 w-[154px]"
                    >
                    <div className="product_image_small">
                        {finishLabel && <span className="ribbon ribbon_foil">{finishLabel.toUpperCase()}</span>}
                        {p.imageUrls?.[0] ? (
                            <img
                                src={p.imageUrls[0]}
                                alt={p.displayName ?? p.name}
                                className="w-full h-full object-contain"
                            />
                        ) : (
                            <div className="text-gray-400">Sin imagen</div>
                        )}
                    </div>
                    <h2 className="product_title_text primary_text_color truncate">
                        {p.displayName ?? p.name}
                    </h2>
                    <p className="small_text secondary_text_color truncate" style={{ fontStyle: 'italic' }}>
                        {p.type === 'SIN'
                            ? `${p.set ?? ''}${p.collectorNumber ? ` · #${p.collectorNumber}` : ''}`
                            : p.description}
                    </p>
                    <p className="product_price_small_text text-center" style={{ alignSelf: 'center' }}>
                        {p.variantCount && p.variantCount > 1 ? 'Desde ' : ''}
                        ARS$ {formatPrice(p.price)}
                    </p>
                    </LoadingLink>
                    );
                })}
                </div>

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
        </div>
    );
}