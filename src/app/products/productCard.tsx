'use client';

import { useState } from 'react';
import Image from 'next/image';
import type { Product } from '@/src/types';
import { formatPrice } from '@/src/utils/formatPrice';
import { getThumbnailUrl } from '@/src/utils/getThumbnailUrl';
import { getProductSubtitle } from '@/src/utils/productSubtitle';

type Props = {
  product: Product;
  onClick: () => void;
};

function isNewProduct(product: Product): boolean {
  if (!product.createdAt) return false;
  const created = new Date(product.createdAt);
  const oneWeekAgo = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000);
  return created >= oneWeekAgo;
}

export default function ProductCard({ product, onClick }: Props) {
  const images = product.imageUrls ?? [];
  const [current, setCurrent] = useState(0);
  // Qué índices ya reportaron onLoad -- a diferencia de antes, todas las imágenes se montan
  // de una así el navegador ya las tiene pedidas/cacheadas cuando se hace click en la flecha
  // (si no, cada click disparaba una fetch nueva y recién ahí se veía la imagen siguiente).
  const [loadedIndices, setLoadedIndices] = useState<Set<number>>(new Set());

  const isNew = isNewProduct(product);
  const finishLabel = product.finishShortName && product.finishShortName !== 'NONFOIL'
    ? (product.finishName ?? product.finishShortName)
    : null;

  const markLoaded = (index: number) => {
    setLoadedIndices(prev => (prev.has(index) ? prev : new Set(prev).add(index)));
  };

  const prev = () => {
    setCurrent((c) =>
      c === 0 ? images.length - 1 : c - 1
    );
  };

  const next = () => {
    setCurrent((c) =>
      c === images.length - 1 ? 0 : c + 1
    );
  };

  return (
    <article onClick={onClick} className="product_box box_border">
      <div className="product_image">
        {finishLabel && <span className="ribbon ribbon_foil">{finishLabel.toUpperCase()}</span>}
        {isNew && <span className="ribbon ribbon_new">NEW</span>}
        {images.length > 0 ? (
          <>
            {!loadedIndices.has(current) && (
              <div className="absolute inset-0 bg-gray-700/50 animate-pulse rounded" />
            )}

            {/* Mismo mecanismo que BannerSlider: todas las imágenes montadas de una en una
                fila, desplazada con translateX -- así el slide entrante/saliente se ven
                animados a la vez y ya están pedidas desde el primer render, no recién al
                cambiar de índice. */}
            <div
              className="absolute inset-0 flex transition-transform duration-500 ease-in-out"
              style={{ transform: `translateX(-${current * 100}%)` }}
            >
              {images.map((src, index) => (
                <div key={src} className="relative w-full h-full flex-shrink-0">
                  <Image
                    fill
                    src={getThumbnailUrl(src) ?? src}
                    alt={product.displayName ?? product.name}
                    unoptimized
                    className="object-contain"
                    onLoad={() => markLoaded(index)}
                  />
                </div>
              ))}
            </div>

            {images.length > 1 && (
              <>
                <button
                  onClick={ (e) => {
                    e.stopPropagation();
                    prev();
                  }}
                  className="image_slideshow_arrow left-2"
                >
                  ‹
                </button>
                <button
                  onClick={ (e) => {
                    e.stopPropagation();
                    next();
                  }}
                  className="image_slideshow_arrow right-2"
                >
                  ›
                </button>
              </>
            )}
          </>
        ) : (
          <div className="text-gray-400">Sin imagen</div>
        )}
      </div>

      <h2 onClick={onClick} className="product_title_text primary_text_color limit_two_lines">
        {product.displayName ?? product.name}
      </h2>

      <p className="small_text secondary_text_color limit_two_lines" style={{fontStyle: 'italic'}}>
        {getProductSubtitle(product)}
      </p>

      <div className="product_price_small_text text-center" style={{alignSelf: 'center'}}>
          {product.variantCount && product.variantCount > 1 ? 'Desde ' : ''}
          ARS$ {formatPrice(product.price)}
      </div>
      <div className='small_text text-center' style={{alignSelf: 'center'}}>
        {product.stock} en stock
      </div>
    </article>
  );
}
