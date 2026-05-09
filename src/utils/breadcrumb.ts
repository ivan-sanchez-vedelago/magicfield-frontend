import type { Category } from '@/src/types';

export interface BreadcrumbItem {
  id: number;
  name: string;
  shortName: string;
}

/**
 * Construye la ruta de categorías desde root hasta una categoría específica.
 * Por ejemplo, si categoryId = 5 y el árbol es:
 *   0 (root) > 1 > 2 > 5
 * Retorna: [{ id: 0, name: 'root', shortName: 'ROOT' }, { id: 1, name: '...', shortName: '...' }, ...]
 *
 * @param categoryId - ID de la categoría terminal
 * @param categories - Array de todas las categorías disponibles
 * @returns Array ordenado desde root hasta la categoría especificada (incluyendo root)
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
      name: current.name,
      shortName: current.shortName
    });

    // Buscar la categoría padre
    if (current.parentId === null || current.parentId === 0) {
      break;
    }

    current = categories.find(c => c.id === current.parentId) ?? null;
  }

  // Agregar la categoría root (id=0) si no está ya en el path
  const hasRoot = path.some(p => p.id === 0);
  if (!hasRoot && path.length > 0) {
    // Buscar categoría root en la lista (aunque normalmente se filtra)
    const rootCategory = categories.find(c => c.id === 0);
    if (rootCategory) {
      path.unshift({
        id: 0,
        name: rootCategory.name,
        shortName: rootCategory.shortName
      });
    } else {
      // Si no existe, crear una categoría root por defecto
      path.unshift({
        id: 0,
        name: 'Inicio',
        shortName: 'HOME'
      });
    }
  }

  return path;
}
