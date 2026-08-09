import ProductDetailClient from './ProductDetailClient';
import type { Product } from '@/src/types';

export default async function ProductDetailPage({
  params,
}: {
  params: Promise<{ id: string }>
}) {

  const { id } = await params
  const res = await fetch(
    `${process.env.NEXT_PUBLIC_API_URL}/api/products/${id}`,
    {
      cache: "no-store", // opcional → evita cache si querés datos en tiempo real
    }
  );

  if (!res.ok) {
    return <div className="p-6">Producto no encontrado</div>;
  }

  const product: Product = await res.json();

  // Para singles, trae todas las variantes (condición/idioma) en stock de esta misma
  // carta+finish -- alimenta el selector de variantes de la pantalla de detalle.
  let variants: Product[] = [product];
  if (product.type === 'SIN') {
    const variantsRes = await fetch(
      `${process.env.NEXT_PUBLIC_API_URL}/api/products/${id}/variants`,
      { cache: "no-store" }
    );
    if (variantsRes.ok) {
      variants = await variantsRes.json();
    }
  }

  return (
    <div className="flex-1">
      <ProductDetailClient product={product} variants={variants} />
    </div>
  );
}