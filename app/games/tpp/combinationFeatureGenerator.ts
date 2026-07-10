/* eslint-disable @typescript-eslint/no-explicit-any */

export type FeatureKey = "piggyZone" | "piggyWheel" | "piggyTower";

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

export function hasTower(features: FeatureKey[]): boolean { return features.includes("piggyTower"); }
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
  if (features.includes("piggyWheel") && counts.red  < MAX_RED)  seq.push("RED");
  if (features.includes("piggyTower") && counts.blue < MAX_BLUE) seq.push("BLUE");
  if (features.includes("piggyZone"))                             seq.push("PURPLE");

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