'use client';

import { useEffect, useRef, useState } from 'react';
import LoadingLink from '@/src/components/navigation/LoadingLink';

type Product = {
  id: string;
  name: string;
  price: number;
  imageUrls?: string[];
};

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
                {products.map(p => (
                    <LoadingLink
                    key={p.id}
                    href={`/products/${p.id}`}
                    className="border rounded p-3 w-48 flex-shrink-0"
                    >
                    <img
                        src={p.imageUrls?.[0]}
                        alt={p.name}
                        className="w-full h-32 object-contain"
                    />
                    <p className="text-sm mt-2">{p.name}</p>
                    <p className="font-semibold">${p.price}</p>
                    </LoadingLink>
                ))}
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