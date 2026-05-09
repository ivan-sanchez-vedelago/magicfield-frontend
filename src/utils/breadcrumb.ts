import type { Category } from '@/src/types';

export interface BreadcrumbItem {
  id: number;
  name: string;
  shortName: string;
}

/**
 * Construye la ruta de categorías desde el nivel más alto disponible hasta una categoría específica.
 * Nota: La categoría root (id=0) se filtra en el contexto, así que el path comienza
 * desde la categoría de primer nivel (parentId=0) hacia abajo.
 *
 * Ejemplo: Si categoryId = 5 y el árbol es:
 *   0 (root "catalogo", filtrada) > 1 (name='Cartas', parentId=0) > 2 (name='Magic', parentId=1) > 5
 * Retorna: [{ id: 1, name: 'Cartas', shortName: 'CARTAS' }, { id: 2, name: 'Magic', ... }, { id: 5, ... }]
 *
 * @param categoryId - ID de la categoría terminal
 * @param categories - Array de categorías disponibles (sin id=0)
 * @returns Array ordenado desde la categoría raíz disponible hasta la especificada
 */
export function getBreadcrumbPath(
  categoryId: number | undefined | null,
  categories: Category[]
): BreadcrumbItem[] {
  if (!categoryId) return [];

  // Encontrar la categoría
  const targetCategory = categories.find(c => c.id === categoryId);
  if (!targetCategory) return [];

  // Construir la ruta subiendo hacia root
  const path: BreadcrumbItem[] = [];
  let current: Category = targetCategory;

  while (current) {
    path.unshift({
      id: current.id,
      name: current.name,
      shortName: current.shortName
    });

    // Buscar la categoría padre
    if (current.parentId === null || current.parentId === 0) {
      break;
    }

    const parent = categories.find(c => c.id === current.parentId);
    if (!parent) {
      break;
    }
    current = parent;
  }

  return path;
}
