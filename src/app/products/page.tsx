import { Suspense } from "react";
import ProductsContent from "./ProductsContent";

export default function ProductsPage() {
  return (
    <Suspense fallback={<div className="p-6">Cargando productos...</div>}>
      <ProductsContent />
    </Suspense>
  );
}