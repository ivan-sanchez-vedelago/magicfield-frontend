export interface BulkListLine {
  quantity: number;
  name: string;
}

// Cada línea no vacía matchea "<cantidad> <nombre>" (ej. "4 Lightning Bolt"), tolerando el
// formato "4x Lightning Bolt" que también se usa en decklists. Si una línea no arranca con un
// número, se toma cantidad 1 y la línea entera como nombre -- mejor eso que descartarla.
const QUANTITY_PREFIX = /^\s*(\d+)\s*x?\s+(.+)$/i;

export function parseBulkList(text: string): BulkListLine[] {
  return text
    .split('\n')
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
