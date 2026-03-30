/**
 * Formatea un número como precio en formato argentino (1.000,00)
 * @param price - El precio a formatear
 * @returns String formateado como "1.000,00"
 */
export const formatPrice = (price: number): string => {
  return new Intl.NumberFormat('es-AR', {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(price);
};
