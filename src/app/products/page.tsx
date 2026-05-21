import { Suspense } from "react";
import ProductsContent from "./ProductsContent";

function ProductsPageSkeleton() {
  return (
    <div className="flex-1">
      <main className="mx-auto py-12 px-6">
        <div className="h-8 w-64 bg-gray-700/50 rounded animate-pulse mb-6" />
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-6">
          {Array.from({ length: 20 }).map((_, i) => (
            <div key={i} className="product_box box_border animate-pulse">
              <div className="product_image bg-gray-700/50 rounded" />
              <div className="h-4 bg-gray-700/50 rounded mt-2 mx-2" />
              <div className="h-3 bg-gray-700/40 rounded mt-1 mx-2" />
              <div className="h-3 bg-gray-700/40 rounded mt-1 mx-4" />
              <div className="h-5 bg-gray-700/50 rounded mt-2 mx-6" />
              <div className="h-3 bg-gray-700/30 rounded mt-1 mx-8 mb-2" />
            </div>
          ))}
        </div>
      </main>
    </div>
  );
}

export default function ProductsPage() {
  return (
    <Suspense fallback={<ProductsPageSkeleton />}>
      <ProductsContent />
    </Suspense>
  );
}