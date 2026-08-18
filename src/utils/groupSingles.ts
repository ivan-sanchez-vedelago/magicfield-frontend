import type { Product } from '@/src/types';

// Antes "groupSinglesByFinish" (solo singles). Agrupa en un solo pase tanto singles
// (scryfallId+finish) como sellados (nombre+set) -- mismo criterio que
// ProductServiceImpl.listCatalogPaged()/listNewest() del backend para ambos casos. Para
// listas que ya se cargaron sin agrupar en el cliente (ver ProductDetailClient, "productos
// relacionados"). Accesorios (sin ninguna de las dos claves) pasan sin tocar.
export function groupProductVariants(products: Product[]): Product[] {
  const groups = new Map<string, Product[]>();
  const result: Product[] = [];

  for (const p of products) {
    let key: string | null = null;
    if (p.scryfallId && p.finishId != null) key = `SIN:${p.scryfallId}:${p.finishId}`;
    else if (p.set) key = `PSL:${p.name}:${p.set}`;

    if (key === null) {
      result.push(p);
      continue;
    }
    const group = groups.get(key);
    if (group) group.push(p);
    else groups.set(key, [p]);
  }

  for (const group of groups.values()) {
    const representative = group[0];
    const totalStock = group.reduce((sum, p) => sum + p.stock, 0);
    const minPrice = Math.min(...group.map(p => p.price));
    result.push({
      ...representative,
      stock: totalStock,
      price: minPrice,
      variantCount: group.length,
    });
  }

  return result;
}
