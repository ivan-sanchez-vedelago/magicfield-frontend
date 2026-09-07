export interface BulkListLine {
  quantity: number;
  name: string;
}

// Cada renglón matchea "<cantidad> <nombre>" (ej. "4 Lightning Bolt"), tolerando el formato
// "4x Lightning Bolt" / "4X Lightning Bolt" que también se usa en decklists (el "x" -- en
// cualquier capitalización, por el flag /i -- es opcional y va pegado o separado del número).
// Si un renglón no arranca con un número, se toma cantidad 1 y el renglón entero como nombre
// -- mejor eso que descartarlo, así una lista de solo nombres (sin cantidad) también funciona.
const QUANTITY_PREFIX = /^\s*(\d+)\s*x?\s+(.+)$/i;

export function parseBulkList(text: string): BulkListLine[] {
  return text
    // "." es un separador de renglón alternativo (ej. pegar todo en una sola línea como
    // "Lightning Bolt.Sol Ring.Black Lotus"), tratado igual que un salto de línea antes de
    // partir -- así ambos formatos comparten el mismo parseo de acá para abajo.
    .split(/[\n.]+/)
    .map(line => line.trim())
    .filter(line => line.length > 0)
    .map(line => {
      const match = line.match(QUANTITY_PREFIX);
      if (match) {
        return { quantity: parseInt(match[1], 10), name: match[2].trim() };
      }
      return { quantity: 1, name: line };
    });
}
