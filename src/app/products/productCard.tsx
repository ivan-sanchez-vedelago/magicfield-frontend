'use client';

import { useState } from 'react';

type Product = {
  id: number;
  name: string;
  description?: string;
  price: number;
  stock: number;
  imageUrls?: string[];
};

type Props = {
  product: Product;
  onClick: () => void;
};

export default function ProductCard({ product, onClick }: Props) {
  const images = product.imageUrls ?? [];
  const [current, setCurrent] = useState(0);

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
        {images.length > 0 ? (
          <>
            <img
              src={images[current]}
              alt={product.name}
              className="object-contain w-full h-full"
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

      <h2 onClick={onClick} className="product_title_text primary_text_color">
        {product.name}
      </h2>

      <p className="normal_text secondary_text_color">
        {product.description}
      </p>

      <div className="flex items-center justify-between">
        <div className="product_price_text primary_text_color">
          ${product.price.toFixed(2)}
        </div>
        <div className="normal_text secondary_text_color">
          Stock: {product.stock}
        </div>
      </div>
    </article>
  );
}
