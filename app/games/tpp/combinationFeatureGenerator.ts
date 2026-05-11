// /* eslint-disable @typescript-eslint/no-explicit-any */

// // ─── Feature keys ─────────────────────────────────────────────────────────────
// export type FeatureKey = "zone" | "wheel" | "tower";

// // ─── Grid sizing ──────────────────────────────────────────────────────────────
// // Non-tower combos: 4 rows × 5 cols = 20 positions
// export const STD_ROWS  = 4;
// export const STD_COLS  = 5;
// export const STD_TOTAL = 20;

// // Tower combos: 12 rows × 5 cols = 60 positions
// export const TWR_ROWS       = 12;
// export const TWR_COLS       = 5;
// export const TWR_TOTAL      = 60;
// export const TWR_LOCKED     = 8;   // top 8 rows locked initially
// export const TWR_INIT       = 4;   // bottom 4 rows always unlocked
// export const TWR_COINS_ROW  = 6;   // coins per row unlock

// export function hasTower(features: FeatureKey[]): boolean {
//   return features.includes("tower");
// }

// export function gridRows(features: FeatureKey[]): number {
//   return hasTower(features) ? TWR_ROWS : STD_ROWS;
// }
// export function gridCols(features: FeatureKey[]): number {
//   return hasTower(features) ? TWR_COLS : STD_COLS;
// }
// export function gridTotal(features: FeatureKey[]): number {
//   return hasTower(features) ? TWR_TOTAL : STD_TOTAL;
// }

// // ─── Cell type ────────────────────────────────────────────────────────────────
// export type ComboCell =
//   | { type: "EMPTY" }
//   | { type: "GOLD";    value: string }
//   | { type: "RED";     value: string; multiplier: string }   // WHEEL
//   | { type: "BLUE";    value: string }                        // TOWER
//   | { type: "PURPLE";  value: string };                       // ZONE

// // ─── Options ─────────────────────────────────────────────────────────────────
// export const COIN_VALUES  = ["1", "2", "5", "10", "25", "50", "100", "Minor", "Major"];
// export const MULTI_VALUES = ["2", "3", "4", "5", "6", "7", "8", "9", "10", "12", "MAJOR", "GRAND"];
// export const MAX_SPINS     = 3;
// export const MAX_RED       = 12;
// export const MAX_BLUE      = 8;

// // ─── Flat position index ─────────────────────────────────────────────────────
// /**
//  * Column-major flat index.
//  * STD:  index = col * 4  + row   (for reelStopPositions[20])
//  * TWR:  index = col * 12 + row   (for reelStopPositions[60])
//  */
// export function posIdx(row: number, col: number, rows: number): number {
//   return col * rows + row;
// }

// // ─── Grid factory ─────────────────────────────────────────────────────────────
// export function emptyGrid(rows: number, cols: number): ComboCell[][] {
//   return Array.from({ length: rows }, () =>
//     Array.from({ length: cols }, (): ComboCell => ({ type: "EMPTY" }))
//   );
// }

// /**
//  * Seed initial grid from base-game SCaT coins for all active features.
//  * All SCaTs (regardless of colour) become GOLD coins at their grid position.
//  * For tower combos the base 4-row positions map into tower rows 8-11.
//  */
// export function seedCombinedGrid(
//   baseCoins: Array<{ position: number; value: string; featureKey: string }>,
//   features:  FeatureKey[]
// ): ComboCell[][] {
//   const rows = gridRows(features);
//   const cols = gridCols(features);
//   const g    = emptyGrid(rows, cols);
//   const isTwr = hasTower(features);

//   baseCoins.forEach(({ position, value }) => {
//     // position is col*4+row in the base 4×5 grid
//     const col     = Math.floor(position / STD_ROWS);
//     const baseRow = position % STD_ROWS;
//     // For tower, shift base rows into the unlocked section (rows 8-11)
//     const row     = isTwr ? baseRow + TWR_INIT : baseRow;

//     if (row < rows && col < cols) {
//       g[row][col] = { type: "GOLD", value };
//     }
//   });
//   return g;
// }

// // ─── Click cycle ──────────────────────────────────────────────────────────────
// /**
//  * Returns the next cell type in the click cycle for the given feature combination.
//  * Cycle: EMPTY → GOLD → [feature coin types in order] → back to GOLD
//  * The "order" of special types: RED (wheel) → BLUE (tower) → PURPLE (zone)
//  *
//  * On ✕ the cell is removed (EMPTY) — not part of this cycle.
//  */
// export function nextCellType(
//   current:  ComboCell["type"],
//   features: FeatureKey[],
//   counts:   { red: number; blue: number }
// ): ComboCell["type"] {
//   const hasZone  = features.includes("zone");
//   const hasWheel = features.includes("wheel");
//   const hasTwr   = features.includes("tower");

//   // Build ordered sequence of special types available
//   const seq: ComboCell["type"][] = ["GOLD"];
//   if (hasWheel && counts.red < MAX_RED)    seq.push("RED");
//   if (hasTwr   && counts.blue < MAX_BLUE)  seq.push("BLUE");
//   if (hasZone)                              seq.push("PURPLE");

//   const idx = seq.indexOf(current);
//   if (idx === -1 || idx === seq.length - 1) return "GOLD";
//   return seq[idx + 1];
// }

// // ─── Zone geometry ────────────────────────────────────────────────────────────
// export type Zone = {
//   id:      string;
//   anchors: [number, number][];  // [row, col]
//   cells:   [number, number][];
//   charges: number;
// };

// export function getSingleZoneCells(r: number, c: number, rows: number, cols: number): [number, number][] {
//   const out: [number, number][] = [];
//   for (let i = r - 1; i <= r + 1; i++)
//     for (let j = c - 1; j <= c + 1; j++)
//       if (i >= 0 && i < rows && j >= 0 && j < cols) out.push([i, j]);
//   return out;
// }

// export function getUnionCells(anchors: [number, number][], rows: number, cols: number): [number, number][] {
//   const set = new Set<string>();
//   anchors.forEach(([r, c]) =>
//     getSingleZoneCells(r, c, rows, cols).forEach(([ri, ci]) => set.add(`${ri},${ci}`))
//   );
//   return Array.from(set).map(s => s.split(",").map(Number) as [number, number]);
// }

// export function zonesTouch(a: [number, number][], b: [number, number][]): boolean {
//   for (const [r1, c1] of a)
//     for (const [r2, c2] of b)
//       if (Math.abs(r1 - r2) + Math.abs(c1 - c2) <= 1) return true;
//   return false;
// }

// export function mergeAllTouchingZones(zones: Zone[], rows: number, cols: number): Zone[] {
//   const merged = new Array(zones.length).fill(false);
//   const result: Zone[] = [];
//   for (let i = 0; i < zones.length; i++) {
//     if (merged[i]) continue;
//     let cur = zones[i]; let changed = true;
//     while (changed) {
//       changed = false;
//       for (let j = 0; j < zones.length; j++) {
//         if (i === j || merged[j]) continue;
//         if (zonesTouch(cur.cells, zones[j].cells)) {
//           const na = [...cur.anchors, ...zones[j].anchors];
//           cur = { id: cur.id, anchors: na, cells: getUnionCells(na, rows, cols), charges: MAX_SPINS };
//           merged[j] = true; changed = true;
//         }
//       }
//     }
//     result.push(cur);
//   }
//   return result;
// }

// export function addZoneForAnchor(zones: Zone[], r: number, c: number, rows: number, cols: number, nextId: () => string): Zone[] {
//   const nz: Zone = { id: nextId(), anchors: [[r, c]], cells: getSingleZoneCells(r, c, rows, cols), charges: MAX_SPINS };
//   return mergeAllTouchingZones([...zones, nz], rows, cols);
// }

// export function removeAnchorFromZones(zones: Zone[], r: number, c: number, rows: number, cols: number): Zone[] {
//   const updated = zones
//     .map(z => ({ ...z, anchors: z.anchors.filter(([ar, ac]) => !(ar === r && ac === c)) }))
//     .filter(z => z.anchors.length > 0)
//     .map(z => ({ ...z, cells: getUnionCells(z.anchors, rows, cols) }));
//   return mergeAllTouchingZones(updated, rows, cols);
// }

// export function processZoneOnSpin(
//   grid: ComboCell[][], zones: Zone[]
// ): { grid: ComboCell[][]; zones: Zone[] } {
//   const ng = grid.map(row => row.map(c => ({ ...c })));
//   const updated = zones
//     .map(zone => {
//       zone.cells.forEach(([r, c]) => {
//         const isAnchor = zone.anchors.some(([ar, ac]) => ar === r && ac === c);
//         if (!isAnchor && ng[r][c].type !== "EMPTY") ng[r][c] = { type: "EMPTY" };
//       });
//       return { ...zone, charges: zone.charges - 1 };
//     })
//     .filter(z => z.charges > 0);
//   return { grid: ng, zones: updated };
// }

// // ─── Tower unlock ─────────────────────────────────────────────────────────────
// export function firstUnlockedRow(unlockedCoinCount: number): number {
//   const extra = Math.min(TWR_LOCKED, Math.floor(unlockedCoinCount / TWR_COINS_ROW));
//   return TWR_LOCKED - extra;
// }

// export function unlockHint(unlockedCoinCount: number): { coinsToNext: number; label: string } | null {
//   const extra = Math.min(TWR_LOCKED, Math.floor(unlockedCoinCount / TWR_COINS_ROW));
//   if (extra >= TWR_LOCKED) return null;
//   return {
//     coinsToNext: (extra + 1) * TWR_COINS_ROW - unlockedCoinCount,
//     label: `row ${TWR_INIT + extra + 1}`,
//   };
// }

// // ─── Output formatter ─────────────────────────────────────────────────────────
// /**
//  * Single combined output line.
//  *
//  * reelStopPositions : 20 or 60 elements — 1 where any coin, else 0
//  * landedCoinsInBonusBoost : [[col, row, value], ...] — all non-empty cells
//  * multipliers : only included if any RED coin has a multiplier set
//  */
// export function generateComboGaffe(
//   grid:     ComboCell[][],
//   features: FeatureKey[]
// ): string {
//   const rows   = gridRows(features);
//   const total  = gridTotal(features);
//   const rsp:   number[]               = Array(total).fill(0);
//   const lc:    (string | number)[][]  = [];
//   const mult:  (number | string)[]    = Array(total).fill(0);
//   let   hasRed = false;

//   grid.forEach((rowArr, r) => {
//     rowArr.forEach((cell, c) => {
//       if (cell.type === "EMPTY") return;
//       const idx      = posIdx(r, c, rows);
//       rsp[idx]       = 1;

//       if (cell.type === "GOLD")   lc.push([c, r, cell.value]);
//       if (cell.type === "BLUE")   lc.push([c, r, cell.value]);
//       if (cell.type === "PURPLE") lc.push([c, r, cell.value]);
//       if (cell.type === "RED") {
//         lc.push([c, r, cell.value]);
//         hasRed = true;
//         if (cell.multiplier) {
//           mult[idx] = isNaN(Number(cell.multiplier)) ? cell.multiplier : Number(cell.multiplier);
//         }
//       }
//     });
//   });

//   const parts: string[] = [`reelStopPositions: [${rsp.join(",")}]`];
//   if (lc.length > 0)
//     parts.push(`landedCoinsInBonusBoost: [${lc.map(e => `[${e.join(",")}]`).join(",")}]`);
//   // Only include multipliers when RED coins are present and at least one has a value
//   if (hasRed && mult.some(m => m !== 0))
//     parts.push(`multipliers: [${mult.join(",")}]`);

//   return `[${parts.join(", ")}]`;
// }




/* eslint-disable @typescript-eslint/no-explicit-any */

export type FeatureKey = "zone" | "wheel" | "tower";

// ─── Grid sizing ──────────────────────────────────────────────────────────────
export const STD_ROWS  = 4;
export const STD_COLS  = 5;
export const STD_TOTAL = 20;

export const TWR_ROWS      = 12;
export const TWR_COLS      = 5;
export const TWR_TOTAL     = 60;
export const TWR_LOCKED    = 8;   // top 8 rows locked initially
export const TWR_INIT      = 4;   // bottom 4 rows always unlocked
export const TWR_COINS_ROW = 6;   // coins per row unlock

export function hasTower(features: FeatureKey[]): boolean { return features.includes("tower"); }
export function gridRows(f: FeatureKey[]): number  { return hasTower(f) ? TWR_ROWS  : STD_ROWS;  }
export function gridCols(f: FeatureKey[]): number  { return hasTower(f) ? TWR_COLS  : STD_COLS;  }
export function gridTotal(f: FeatureKey[]): number { return hasTower(f) ? TWR_TOTAL : STD_TOTAL; }

// ─── Cell type ────────────────────────────────────────────────────────────────
export type ComboCell =
  | { type: "EMPTY" }
  | { type: "GOLD";    value: string }
  | { type: "RED";     value: string; multiplier: string }
  | { type: "BLUE";    value: string }
  | { type: "PURPLE";  value: string };

export const COIN_VALUES  = ["1", "2", "5", "10", "25", "50", "100", "Minor", "Major"];
export const MULTI_VALUES = ["2", "3", "4", "5", "6", "7", "8", "9", "10", "12", "MAJOR", "GRAND"];
export const MAX_SPINS    = 3;
export const MAX_RED      = 12;
export const MAX_BLUE     = 8;

// ─── Flat position index ──────────────────────────────────────────────────────
/** Column-major: col × rows + row */
export function posIdx(row: number, col: number, rows: number): number {
  return col * rows + row;
}

// ─── Grid factory ─────────────────────────────────────────────────────────────
export function emptyGrid(rows: number, cols: number): ComboCell[][] {
  return Array.from({ length: rows }, () =>
    Array.from({ length: cols }, (): ComboCell => ({ type: "EMPTY" }))
  );
}

/**
 * Seed combined grid from base-game SCaT coins.
 * All SCaTs become GOLD coins at their grid position.
 *
 * FIXED: Tower path now uses baseRow + TWR_LOCKED (= +8) so base positions
 * 0-3 map to tower rows 8-11 (the unlocked section at the bottom).
 * Previous bug used + TWR_INIT (= +4) placing coins in rows 4-7 (locked).
 *
 * Example: base position 19 → col=4, baseRow=3 → towerRow = 3+8 = 11 ✓
 */
export function seedCombinedGrid(
  baseCoins: Array<{ position: number; value: string; featureKey: string }>,
  features:  FeatureKey[]
): ComboCell[][] {
  const rows  = gridRows(features);
  const cols  = gridCols(features);
  const g     = emptyGrid(rows, cols);
  const isTwr = hasTower(features);

  baseCoins.forEach(({ position, value }) => {
    const col     = Math.floor(position / STD_ROWS);
    const baseRow = position % STD_ROWS;
    // FIXED: tower offset is TWR_LOCKED (8), not TWR_INIT (4)
    const row     = isTwr ? baseRow + TWR_LOCKED : baseRow;

    if (row < rows && col < cols) {
      g[row][col] = { type: "GOLD", value };
    }
  });
  return g;
}

// ─── Click cycle ──────────────────────────────────────────────────────────────
export function nextCellType(
  current:  ComboCell["type"],
  features: FeatureKey[],
  counts:   { red: number; blue: number }
): ComboCell["type"] {
  const seq: ComboCell["type"][] = ["GOLD"];
  if (features.includes("wheel") && counts.red  < MAX_RED)  seq.push("RED");
  if (features.includes("tower") && counts.blue < MAX_BLUE) seq.push("BLUE");
  if (features.includes("zone"))                             seq.push("PURPLE");

  const idx = seq.indexOf(current);
  if (idx === -1 || idx === seq.length - 1) return "GOLD";
  return seq[idx + 1];
}

// ─── Zone geometry ────────────────────────────────────────────────────────────
export type Zone = {
  id:      string;
  anchors: [number, number][];
  cells:   [number, number][];
  charges: number;
};

export function getSingleZoneCells(r: number, c: number, rows: number, cols: number): [number, number][] {
  const out: [number, number][] = [];
  for (let i = r - 1; i <= r + 1; i++)
    for (let j = c - 1; j <= c + 1; j++)
      if (i >= 0 && i < rows && j >= 0 && j < cols) out.push([i, j]);
  return out;
}

export function getUnionCells(anchors: [number, number][], rows: number, cols: number): [number, number][] {
  const set = new Set<string>();
  anchors.forEach(([r, c]) =>
    getSingleZoneCells(r, c, rows, cols).forEach(([ri, ci]) => set.add(`${ri},${ci}`))
  );
  return Array.from(set).map(s => s.split(",").map(Number) as [number, number]);
}

export function zonesTouch(a: [number, number][], b: [number, number][]): boolean {
  for (const [r1, c1] of a)
    for (const [r2, c2] of b)
      if (Math.abs(r1 - r2) + Math.abs(c1 - c2) <= 1) return true;
  return false;
}

export function mergeAllTouchingZones(zones: Zone[], rows: number, cols: number): Zone[] {
  const merged = new Array(zones.length).fill(false);
  const result: Zone[] = [];
  for (let i = 0; i < zones.length; i++) {
    if (merged[i]) continue;
    let cur = zones[i]; let changed = true;
    while (changed) {
      changed = false;
      for (let j = 0; j < zones.length; j++) {
        if (i === j || merged[j]) continue;
        if (zonesTouch(cur.cells, zones[j].cells)) {
          const na = [...cur.anchors, ...zones[j].anchors];
          cur = { id: cur.id, anchors: na, cells: getUnionCells(na, rows, cols), charges: MAX_SPINS };
          merged[j] = true; changed = true;
        }
      }
    }
    result.push(cur);
  }
  return result;
}

export function addZoneForAnchor(
  zones: Zone[], r: number, c: number,
  rows: number, cols: number, nextId: () => string
): Zone[] {
  const nz: Zone = {
    id:      nextId(),
    anchors: [[r, c]],
    cells:   getSingleZoneCells(r, c, rows, cols),
    charges: MAX_SPINS,
  };
  return mergeAllTouchingZones([...zones, nz], rows, cols);
}

export function removeAnchorFromZones(
  zones: Zone[], r: number, c: number, rows: number, cols: number
): Zone[] {
  const updated = zones
    .map(z => ({ ...z, anchors: z.anchors.filter(([ar, ac]) => !(ar === r && ac === c)) }))
    .filter(z => z.anchors.length > 0)
    .map(z => ({ ...z, cells: getUnionCells(z.anchors, rows, cols) }));
  return mergeAllTouchingZones(updated, rows, cols);
}

export function processZoneOnSpin(
  grid: ComboCell[][], zones: Zone[]
): { grid: ComboCell[][]; zones: Zone[] } {
  const ng = grid.map(row => row.map(c => ({ ...c })));
  const updated = zones
    .map(zone => {
      zone.cells.forEach(([r, c]) => {
        const isAnchor = zone.anchors.some(([ar, ac]) => ar === r && ac === c);
        if (!isAnchor && ng[r][c].type !== "EMPTY") ng[r][c] = { type: "EMPTY" };
      });
      return { ...zone, charges: zone.charges - 1 };
    })
    .filter(z => z.charges > 0);
  return { grid: ng, zones: updated };
}

// ─── Tower unlock ─────────────────────────────────────────────────────────────
export function firstUnlockedRow(unlockedCoinCount: number): number {
  const extra = Math.min(TWR_LOCKED, Math.floor(unlockedCoinCount / TWR_COINS_ROW));
  return TWR_LOCKED - extra;
}

export function unlockHint(unlockedCoinCount: number): { coinsToNext: number; label: string } | null {
  const extra = Math.min(TWR_LOCKED, Math.floor(unlockedCoinCount / TWR_COINS_ROW));
  if (extra >= TWR_LOCKED) return null;
  return {
    coinsToNext: (extra + 1) * TWR_COINS_ROW - unlockedCoinCount,
    label: `row ${TWR_INIT + extra + 1}`,
  };
}

// ─── Output formatter ─────────────────────────────────────────────────────────
export function generateComboGaffe(grid: ComboCell[][], features: FeatureKey[]): string {
  const rows  = gridRows(features);
  const total = gridTotal(features);
  const rsp:  number[]              = Array(total).fill(0);
  const lc:   (string | number)[][] = [];
  const mult: (number | string)[]   = Array(total).fill(0);
  let   hasRed = false;

  grid.forEach((rowArr, r) => {
    rowArr.forEach((cell, c) => {
      if (cell.type === "EMPTY") return;
      const idx = posIdx(r, c, rows);
      rsp[idx]  = 1;
      if (cell.type === "GOLD")   lc.push([c, r, cell.value]);
      if (cell.type === "BLUE")   lc.push([c, r, cell.value]);
      if (cell.type === "PURPLE") lc.push([c, r, cell.value]);
      if (cell.type === "RED") {
        lc.push([c, r, cell.value]);
        hasRed = true;
        if (cell.multiplier)
          mult[idx] = isNaN(Number(cell.multiplier)) ? cell.multiplier : Number(cell.multiplier);
      }
    });
  });

  const parts: string[] = [`reelStopPositions: [${rsp.join(",")}]`];
  if (lc.length > 0)
    parts.push(`landedCoinsInBonusBoost: [${lc.map(e => `[${e.join(",")}]`).join(",")}]`);
  if (hasRed && mult.some(m => m !== 0))
    parts.push(`multipliers: [${mult.join(",")}]`);
  return `[${parts.join(", ")}]`;
}