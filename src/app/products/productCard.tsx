'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';
import type { Product } from '@/src/types';
import { formatPrice } from '@/src/utils/formatPrice';

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
  const [imageLoaded, setImageLoaded] = useState(false);

  const isNew = isNewProduct(product);
  const isFoil = product.type === 'SIN' && product.isFoil === true;

  useEffect(() => {
    setImageLoaded(false);
  }, [current]);

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
        {isFoil && <span className="ribbon ribbon_foil">FOIL</span>}
        {isNew && <span className="ribbon ribbon_new">NEW</span>}
        {images.length > 0 ? (
          <>
            {!imageLoaded && (
              <div className="absolute inset-0 bg-gray-700/50 animate-pulse rounded" />
            )}
            <Image
              fill
              src={images[current]}
              alt={product.name}
              className="object-contain"
              onLoad={() => setImageLoaded(true)}
            />

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
        {product.name}
      </h2>

      <p className="small_text secondary_text_color limit_two_lines" style={{fontStyle: 'italic'}}>
        {product.description}
      </p>

      <div className="product_price_small_text text-center" style={{alignSelf: 'center'}}>
          ARS$ {formatPrice(product.price)}
      </div>
      <div className='small_text text-center' style={{alignSelf: 'center'}}>
        {product.stock} en stock
      </div>
    </article>
  );
}
