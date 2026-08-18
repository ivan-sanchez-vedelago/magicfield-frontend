import type { Product } from '@/src/types';

// Antes duplicado en productCard.tsx, Header.tsx, RelatedProductsCarousel.tsx y
// NewProductsSection.tsx: singles muestran set + N° de coleccionista, sellados muestran solo
// el set, el resto muestra la descripción. Presence-based (scryfallId identifica singles
// específicamente, ya que sellados también puede tener `set`).
export function getProductSubtitle(product: Product): string {
  if (product.scryfallId && product.set) {
    return `${product.set}${product.collectorNumber ? ` · #${product.collectorNumber}` : ''}`;
  }
  if (product.set) {
    return product.set;
  }
  return product.description ?? '';
}
