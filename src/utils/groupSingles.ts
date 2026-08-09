import type { Product } from '@/src/types';

// Mismo criterio que ProductServiceImpl.listCatalogPaged() en el backend, pero para listas
// que ya se cargaron sin agrupar en el cliente (GET /api/products, usado por el buscador
// global y por "productos relacionados"): agrupa singles por (scryfallId, finish),
// sumando stock entre condiciones/idiomas y quedándose con el precio mínimo del grupo.
// Sellados/accesorios pasan sin tocar.
export function groupSinglesByFinish(products: Product[]): Product[] {
  const singleGroups = new Map<string, Product[]>();
  const result: Product[] = [];

  for (const p of products) {
    const isSingle = p.type === 'SIN' && !!p.scryfallId && p.finishId != null;
    if (!isSingle) {
      result.push(p);
      continue;
    }
    const key = `${p.scryfallId}:${p.finishId}`;
    const group = singleGroups.get(key);
    if (group) group.push(p);
    else singleGroups.set(key, [p]);
  }

  for (const group of singleGroups.values()) {
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
