'use client';

import { useCart } from '../../../context/cartContext';
import LoadingLink from '@/src/components/navigation/LoadingLink';
import { formatPrice } from '@/src/utils/formatPrice';
import { useEffect, useMemo, useState } from "react";
import { useProducts } from '../../../context/productContext';
import ProductImageGallery from '@/src/components/product/ProductImageGallery';
import RelatedProductsCarousel from '@/src/components/product/RelatedProductsCarousel';
import type { Product } from '@/src/types';

export default function ProductDetailClient({ product } : { product: Product }) {

  console.log("ProductDetailClient render, product:", product);
  const { items, setProductQuantity, removeProduct } = useCart();
  const { products: allProducts } = useProducts();

  const cartItem = items.find(i => i.productId === product.id);
  const quantityInCart = cartItem?.quantity ?? 0;

  const [qty, setQty] = useState(quantityInCart);
  const [showDetails, setShowDetails] = useState(false);

  useEffect(() => {
    setQty(quantityInCart);
  }, [quantityInCart, product.id]);

  const increase = () => setQty(q => Math.min(product.stock, q + 1));
  const decrease = () => setQty(q => Math.max(0, q - 1));

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
      ).slice(0, 10);
  }, [allProducts, product]);

  return (
    <main className="mx-auto px-6 py-8 space-y-10">

      <div className="normal_text box_border">
        <LoadingLink className="underline" href="/">Home</LoadingLink>
        <span> / </span>
        <LoadingLink className="underline" href="/products">Productos</LoadingLink>
        <span> / </span>
        <span className="">{product.name}</span>
      </div>

      <section className="detail_page_container">
        <div className="detail_image_box box_border">
          <ProductImageGallery
            images={product.imageUrls || []}
            name={product.name}
          />
        </div>

        <div className="detail_page_info">
          <h1 className="product_detail_title_text">{product.name}</h1>

          <div className="box_border">

            <div className="grid grid-cols-4 text-sm font-medium text-gray-600">
              <div className="text-center">Estado</div>
              <div className="text-center">Idioma</div>
              <div className="text-center">Precio</div>
              <div className="text-center">Cantidad</div>
            </div>

            <hr className="my-2" />

            <div className="grid grid-cols-4 items-center">
              <p className="text-center">
                {product.condition || '-'}
              </p>

              <p className="text-center">
                {product.language || '-'}
              </p>

              <p className="product_price_small_text text-center">
                ARS$ {formatPrice(product.price)}
              </p>

              <div className="text-center">
                <div className="flex justify-center items-center gap-2">
                  <button onClick={decrease} disabled={qty <= 0} className="px-2 py-1 border disabled:opacity-50">-</button>
                  <span className="cantidad_stock_input">{qty}</span>
                  <button onClick={increase} disabled={qty >= product.stock} className="px-2 py-1 border disabled:opacity-50">+</button>
                </div>

                <p className="small_text secondary_text_color mt-1">
                  Disponible{product.stock > 1 && 's'}: {product.stock}
                </p>
              </div>
            </div>

            <div className="flex gap-4 justify-end mt-2">
              <button onClick={handleRemoveItem} className="small_button button_secondary">
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
              <div className="normal_text secondary_text_color">
                <hr className="my-2" />
                <div className="p-4 grid grid-cols-2 gap-6">
                    <b>Nombre:</b> {product.name ? product.name : '-'}
                    <b>Es foil:</b> {product.isFoil ? 'Sí' : 'No'}
                    <b>Set:</b> {product.set ? product.set : '-'}
                    <b>N° de coleccionista:</b> {product.collectorNumber ? `#${product.collectorNumber}` : '-'}
                </div>
                <p className="normal_text" style={{fontStyle: 'italic', paddingTop: '0.5rem'}}>
                  {product.description}
                </p>
              </div>
            )}
          </div>
        </div>
      </section>

      <section className="px-6">
        <h2 className="normal_text mb-2">
          Productos relacionados
        </h2>

        <RelatedProductsCarousel products={relatedProducts} />
      </section>
    </main>
  );
}