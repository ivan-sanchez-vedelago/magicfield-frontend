'use client';

import { useEffect, useRef, useState } from 'react';
import Image from 'next/image';

export interface Banner {
  id: number;
  title: string;
  subtitle?: string;
  imageUrl?: string;
  bgColor?: string;
}

const FALLBACK_BANNERS: Banner[] = [
  {
    id: 1,
    title: 'Novedades de la semana',
    subtitle: 'Descubrí las últimas cartas y sets disponibles',
    bgColor: 'linear-gradient(135deg, #0F2F1F 0%, #1B5E20 60%, #2E7D32 100%)',
  },
  {
    id: 2,
    title: 'Promociones especiales',
    subtitle: 'Hasta 30% de descuento en cartas seleccionadas',
    bgColor: 'linear-gradient(135deg, #1a237e 0%, #283593 60%, #3949ab 100%)',
  },
  {
    id: 3,
    title: 'Sets recientes',
    subtitle: 'Explorá todas las expansiones recién llegadas',
    bgColor: 'linear-gradient(135deg, #4a148c 0%, #6a1b9a 60%, #7b1fa2 100%)',
  },
];

interface BannerSliderProps {
  intervalMs?: number;
}

export default function BannerSlider({ intervalMs = 5000 }: BannerSliderProps) {
  const [banners, setBanners] = useState<Banner[]>([]);
  const [current, setCurrent] = useState(0);
  const [paused, setPaused] = useState(false);
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const touchStartX = useRef<number>(0);
  const touchEndX = useRef<number>(0);

  useEffect(() => {
    fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/banners`)
      .then(r => r.json())
      .then((data: Banner[]) => {
        if (Array.isArray(data) && data.length > 0) {
          setBanners(data);
        } else {
          setBanners(FALLBACK_BANNERS);
        }
      })
      .catch(() => setBanners(FALLBACK_BANNERS));
  }, []);

  const goTo = (index: number) => {
    if (banners.length === 0) return;
    setCurrent((index + banners.length) % banners.length);
  };

  const prev = () => goTo(current - 1);
  const next = () => goTo(current + 1);

  const handleSwipe = (startX: number, endX: number) => {
    const diff = startX - endX;
    const threshold = 50; // Mínimo de píxeles para considerar un swipe

    if (Math.abs(diff) > threshold) {
      if (diff > 0) {
        next(); // Deslizar hacia la izquierda = siguiente
      } else {
        prev(); // Deslizar hacia la derecha = anterior
      }
    }
  };

  const handleTouchStart = (e: React.TouchEvent) => {
    touchStartX.current = e.touches[0].clientX;
  };

  const handleTouchEnd = (e: React.TouchEvent) => {
    touchEndX.current = e.changedTouches[0].clientX;
    handleSwipe(touchStartX.current, touchEndX.current);
  };

  const handleMouseDown = (e: React.MouseEvent) => {
    touchStartX.current = e.clientX;
  };

  const handleMouseUp = (e: React.MouseEvent) => {
    touchEndX.current = e.clientX;
    handleSwipe(touchStartX.current, touchEndX.current);
  };

  useEffect(() => {
    if (paused || banners.length === 0) return;
    timerRef.current = setInterval(() => {
      setCurrent(c => (c + 1) % banners.length);
    }, intervalMs);
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [paused, banners.length, intervalMs]);

  if (banners.length === 0) {
    return (
      <div className="w-full rounded-2xl bg-gray-100 animate-pulse" style={{ minHeight: '300px' }} />
    );
  }

  return (
    <div
      className="relative w-full overflow-hidden rounded-2xl shadow-2xl select-none"
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
      onTouchStart={handleTouchStart}
      onTouchEnd={handleTouchEnd}
      onMouseDown={handleMouseDown}
      onMouseUp={handleMouseUp}
    >
      {/* Slides */}
      {banners.map((b, i) => (
        <div
          key={b.id}
          className={`transition-transform duration-500 ${i === current ? 'block' : 'hidden'}`}
          style={{
            transform: i === current ? 'translateX(0)' : i > current ? 'translateX(100%)' : 'translateX(-100%)',
          }}
        >
          {b.imageUrl ? (
            <img
              src={b.imageUrl}
              alt={b.title}
              className="w-full h-auto object-contain"
              style={{ borderRadius: '1rem' }}
            />
          ) : (
            <div
              className="w-full h-full"
              style={{ background: b.bgColor ?? '#0F2F1F', borderRadius: '1rem' }}
            />
          )}

          {/* Text overlay */}
          <div
            className="absolute bottom-0 left-0 right-0 flex flex-col justify-end pb-10 px-10"
            style={{ background: 'linear-gradient(to top, rgba(0,0,0,0.55) 0%, transparent 60%)' }}
          >
            <h2 className="text-white font-bold text-2xl md:text-3xl drop-shadow-lg">
              {b.title}
            </h2>
            {b.subtitle && (
              <p className="text-gray-200 normal_text mt-1 drop-shadow">
                {b.subtitle}
              </p>
            )}
          </div>
        </div>
      ))}

      {/* Prev arrow */}
      <button
        onClick={prev}
        aria-label="Banner anterior"
        className="absolute left-3 top-1/2 -translate-y-1/2 z-10 flex items-center justify-center w-9 h-9 rounded-full bg-black/40 hover:bg-black/60 text-white transition-colors"
      >
        ‹
      </button>

      {/* Next arrow */}
      <button
        onClick={next}
        aria-label="Banner siguiente"
        className="absolute right-3 top-1/2 -translate-y-1/2 z-10 flex items-center justify-center w-9 h-9 rounded-full bg-black/40 hover:bg-black/60 text-white transition-colors"
      >
        ›
      </button>

      {/* Dots */}
      <div className="absolute bottom-3 left-1/2 -translate-x-1/2 flex gap-2 z-10">
        {banners.map((_, i) => (
          <button
            key={i}
            onClick={() => goTo(i)}
            aria-label={`Ir al banner ${i + 1}`}
            className="transition-all duration-300 rounded-full"
            style={{
              width: i === current ? '1.5rem' : '0.5rem',
              height: '0.5rem',
              backgroundColor: i === current ? '#66BB6A' : 'rgba(255,255,255,0.5)',
            }}
          />
        ))}
      </div>
    </div>
  );
}
