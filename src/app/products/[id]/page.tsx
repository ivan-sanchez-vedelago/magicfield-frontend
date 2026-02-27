import Header from '@/src/components/Header';
import ProductDetailClient from './ProductDetailClient';

type Product = {
  id: number;
  name: string;
  description?: string;
  price: number;
  stock: number;
  imageUrls?: string[];
};

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

  return (
    <div className="min-h-screen">
      <ProductDetailClient product={product} />
    </div>
  );
}