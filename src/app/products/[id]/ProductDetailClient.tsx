'use client';

import { useCart } from '../../../context/cartContext';
import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import { useProducts } from '../../../context/productContext';

type Product = {
  id: number;
  name: string;
  description?: string;
  price: number;
  stock: number;
  imageUrls?: string[];
};

export default function ProductDetailClient({ product } : { product: Product }) {

  const { items, setProductQuantity, removeProduct } = useCart();
  const { products: allProducts } = useProducts();

  const cartItem = items.find(i => i.productId === product.id);
  const quantityInCart = cartItem?.quantity ?? 0;

  const [qty, setQty] = useState(quantityInCart);
  const [showDetails, setShowDetails] = useState(false);

  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    setQty(quantityInCart);
  }, [quantityInCart, product.id]);

  const increase = () => {
    setQty(q => Math.min(product.stock, q + 1));
  };

  const decrease = () => {
    setQty(q => Math.max(0, q - 1));
  };

  const addToCart = () => {
    setProductQuantity(product, qty);
  };

  const handleRemoveItem = () => {
    setQty(0);
    removeProduct(product.id);
  };

  const relatedProducts = useMemo(() => {
    if (!allProducts.length) return [];

    const words = product.name.toLowerCase().split(" ");

    return allProducts
      .filter(p => p.id !== product.id)
      .filter(p =>
        words.some(w => p.name.toLowerCase().includes(w))
      )
      .slice(0, 10);
  }, [allProducts, product]);

    const ITEM_WIDTH = 192;
    const GAP = 16;
    const STEP = ITEM_WIDTH + GAP;

    const maxIndex = Math.max(0, relatedProducts.length - 1); 

    const goNext = () => {
      setCurrentIndex(i => Math.min(i + 1, maxIndex));
    };

    const goPrev = () => {
      setCurrentIndex(i => Math.max(i - 1, 0));
    };

  return (
    <main className="max-w-7xl mx-auto px-6 py-8 space-y-10">

      <div className="normal_text box_border">
        <Link className="underline" href="/">Home</Link>
        <span> / </span>
        <Link className="underline" href="/products">Productos</Link>
        <span> / </span>
        <span className="">{product.name}</span>
      </div>

      <section className="detail_page_container">

        <img
          src={product.imageUrls?.[0]}
          alt={product.name}
          className="detail_image"
          style={{ height: "380px" }}
        />

        <div className="detail_page_info">
          <h1 className="text-3xl font-bold">{product.name}</h1>

          <div className="box_border">

            <div className="grid grid-cols-3 text-sm font-medium text-gray-600">
              <div className="text-center">Estado</div>
              <div className="text-center">Precio</div>
              <div className="text-center">Cantidad</div>
            </div>

            <hr className="my-2" />

            <div className="grid grid-cols-3 items-center">
              <p className="text-center">-</p>

              <p className="text-center">
                ARS ${product.price}
              </p>

              <div className="text-center">
                <div className="flex justify-center items-center gap-2">
                  <button
                    onClick={decrease}
                    className="px-3 py-1 border disabled:opacity-50"
                    disabled={qty <= 0}
                  >
                    -
                  </button>

                  <span className="cantidad_stock_input">
                    {qty}
                  </span>

                  <button
                    onClick={increase}
                    className="px-3 py-1 border disabled:opacity-50"
                    disabled={qty >= product.stock}
                  >
                    +
                  </button>
                </div>

                <p className="text-sm text-gray-500 mt-1">
                  Disponible {product.stock}
                </p>
              </div>
            </div>

            <div className="flex gap-4 justify-end mt-2">
              <button
                onClick={handleRemoveItem}
                className="small_button button_secondary"
              >
                Limpiar
              </button>

              <button
                onClick={addToCart}
                className="small_button button_primary"
                disabled={qty === quantityInCart}
              >
                Añadir al carrito
              </button>
            </div>
          </div>

          <div className="box_border mt-6">
            <button
              className="subtitle_text text-left w-full"
              onClick={() => setShowDetails(v => !v)}
            >
              Detalles del producto
            </button>

            {showDetails && (
              <div>
                <hr className="my-2" />
                <div className="secondary_text_color p-4">
                  <p className="normal_text">
                    <b>Nombre:</b> {product.name}
                  </p>
                  <p className="normal_text">
                    <b>Descripcion:</b> {product.description}
                  </p>
                </div>
              </div>
            )}
          </div>
        </div>
      </section>

      <section className="px-6">
        <h2 className="product_price_text mb-2">
          Productos relacionados
        </h2>

        <div className="relative">
          <div className="related_products">
            <div className="flex gap-4 transition-transform duration-300"
              style={{
                transform: `translateX(-${currentIndex * STEP}px)`
              }}>
              {relatedProducts.map(p => (
                <Link
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
                </Link>
              ))}
            </div>
            <button
              onClick={(e) => {
                      e.stopPropagation();
                      goPrev();
                    }}
              disabled={currentIndex === 0}
              className="image_slideshow_arrow left-2">
              ‹
            </button>

            <button
              onClick={(e) => {
                      e.stopPropagation();
                      goNext();
                    }}
              disabled={currentIndex === maxIndex}
              className="image_slideshow_arrow right-2">
              ›
            </button>
          </div>
        </div>
      </section>
    </main>
  );
}