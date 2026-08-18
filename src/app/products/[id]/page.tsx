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

  // Para singles (scryfallId+finish) y sellados (set), trae todas las variantes
  // (condición/idioma) en stock del mismo producto -- alimenta el selector de variantes de
  // la pantalla de detalle. Presence-based, no por categoría: el shortName de la subcategoría
  // hoja de un producto real nunca es literalmente "SIN"/"PSL".
  let variants: Product[] = [product];
  if (product.scryfallId || product.set) {
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