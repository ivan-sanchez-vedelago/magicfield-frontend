import type { Category } from '@/src/types';

export interface BreadcrumbItem {
  id: number;
  name: string;
}

/**
 * Construye la ruta de categorías desde root hasta una categoría específica.
 * Por ejemplo, si categoryId = 5 y el árbol es:
 *   1 (root) > 2 > 5
 * Retorna: [{ id: 1, name: 'root' }, { id: 2, name: '...' }, { id: 5, name: '...' }]
 *
 * @param categoryId - ID de la categoría terminal
 * @param categories - Array de todas las categorías disponibles
 * @returns Array ordenado desde root hasta la categoría especificada
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
  let current: Category | null = targetCategory;

  while (current) {
    path.unshift({
      id: current.id,
      name: current.name
    });

    // Buscar la categoría padre
    if (current.parentId === null || current.parentId === 0) {
      break;
    }

    current = categories.find(c => c.id === current.parentId) ?? null;
  }

  return path;
}
