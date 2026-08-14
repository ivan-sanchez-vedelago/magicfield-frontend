// Las URLs de Scryfall codifican el tamaño de la imagen como segmento de la propia ruta
// (ej. https://cards.scryfall.io/normal/front/.../abcd.jpg) -- pedir la variante "small"
// (~146x204, mucho más liviana) alcanza y sobra para thumbnails de listados/carruseles, sin
// necesidad de otro viaje al backend. No es una URL de Scryfall (ej. imágenes propias de
// productos sellados/accesorios, subidas a Firebase): se devuelve sin tocar.
export function getThumbnailUrl(url: string | undefined): string | undefined {
  if (!url) return url;
  return url.replace('/normal/', '/small/');
}
