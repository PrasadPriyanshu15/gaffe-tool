// /* eslint-disable @typescript-eslint/no-explicit-any */

// export type FeatureKey = "piggyZone" | "piggyWheel" | "piggyTower";

// // ─── Grid sizing ──────────────────────────────────────────────────────────────
// export const STD_ROWS  = 4;
// export const STD_COLS  = 5;
// export const STD_TOTAL = 20;

// export const TWR_ROWS      = 12;
// export const TWR_COLS      = 5;
// export const TWR_TOTAL     = 60;
// export const TWR_LOCKED    = 8;   // top 8 rows locked initially
// export const TWR_INIT      = 4;   // bottom 4 rows always unlocked
// export const TWR_COINS_ROW = 6;   // coins per row unlock

// export function hasTower(features: FeatureKey[]): boolean { return features.includes("piggyTower"); }
// export function gridRows(f: FeatureKey[]): number  { return hasTower(f) ? TWR_ROWS  : STD_ROWS;  }
// export function gridCols(f: FeatureKey[]): number  { return hasTower(f) ? TWR_COLS  : STD_COLS;  }
// export function gridTotal(f: FeatureKey[]): number { return hasTower(f) ? TWR_TOTAL : STD_TOTAL; }

// // ─── Cell type ────────────────────────────────────────────────────────────────
// export type ComboCell =
//   | { type: "EMPTY" }
//   | { type: "GOLD";    value: string }
//   | { type: "RED";     value: string; multiplier: string }
//   | { type: "BLUE";    value: string }
//   | { type: "PURPLE";  value: string };

// export const COIN_VALUES  = ["1", "2", "5", "10", "25", "50", "100", "Minor", "Major"];
// export const MULTI_VALUES = ["2", "3", "4", "5", "6", "7", "8", "9", "10", "12", "MAJOR", "GRAND"];
// export const MAX_SPINS    = 3;
// export const MAX_RED      = 12;
// export const MAX_BLUE     = 8;

// // ─── Flat position index ──────────────────────────────────────────────────────
// /** Column-major: col × rows + row */
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
//  * Seed combined grid from base-game SCaT coins.
//  * All SCaTs become GOLD coins at their grid position.
//  *
//  * FIXED: Tower path now uses baseRow + TWR_LOCKED (= +8) so base positions
//  * 0-3 map to tower rows 8-11 (the unlocked section at the bottom).
//  * Previous bug used + TWR_INIT (= +4) placing coins in rows 4-7 (locked).
//  *
//  * Example: base position 19 → col=4, baseRow=3 → towerRow = 3+8 = 11 ✓
//  */
// export function seedCombinedGrid(
//   baseCoins: Array<{ position: number; value: string; featureKey: string }>,
//   features:  FeatureKey[]
// ): ComboCell[][] {
//   const rows  = gridRows(features);
//   const cols  = gridCols(features);
//   const g     = emptyGrid(rows, cols);
//   const isTwr = hasTower(features);

//   baseCoins.forEach(({ position, value }) => {
//     const col     = Math.floor(position / STD_ROWS);
//     const baseRow = position % STD_ROWS;
//     // FIXED: tower offset is TWR_LOCKED (8), not TWR_INIT (4)
//     const row     = isTwr ? baseRow + TWR_LOCKED : baseRow;

//     if (row < rows && col < cols) {
//       g[row][col] = { type: "GOLD", value };
//     }
//   });
//   return g;
// }

// // ─── Click cycle ──────────────────────────────────────────────────────────────
// export function nextCellType(
//   current:  ComboCell["type"],
//   features: FeatureKey[],
//   counts:   { red: number; blue: number }
// ): ComboCell["type"] {
//   const seq: ComboCell["type"][] = ["GOLD"];
//   if (features.includes("piggyWheel") && counts.red  < MAX_RED)  seq.push("RED");
//   if (features.includes("piggyTower") && counts.blue < MAX_BLUE) seq.push("BLUE");
//   if (features.includes("piggyZone"))                             seq.push("PURPLE");

//   const idx = seq.indexOf(current);
//   if (idx === -1 || idx === seq.length - 1) return "GOLD";
//   return seq[idx + 1];
// }

// // ─── Zone geometry ────────────────────────────────────────────────────────────
// export type Zone = {
//   id:      string;
//   anchors: [number, number][];
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

// export function addZoneForAnchor(
//   zones: Zone[], r: number, c: number,
//   rows: number, cols: number, nextId: () => string
// ): Zone[] {
//   const nz: Zone = {
//     id:      nextId(),
//     anchors: [[r, c]],
//     cells:   getSingleZoneCells(r, c, rows, cols),
//     charges: MAX_SPINS,
//   };
//   return mergeAllTouchingZones([...zones, nz], rows, cols);
// }

// export function removeAnchorFromZones(
//   zones: Zone[], r: number, c: number, rows: number, cols: number
// ): Zone[] {
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
// export function generateComboGaffe(grid: ComboCell[][], features: FeatureKey[]): string {
//   const rows  = gridRows(features);
//   const total = gridTotal(features);
//   const rsp:  number[]              = Array(total).fill(0);
//   const lc:   (string | number)[][] = [];
//   const mult: (number | string)[]   = Array(total).fill(0);
//   let   hasRed = false;

//   grid.forEach((rowArr, r) => {
//     rowArr.forEach((cell, c) => {
//       if (cell.type === "EMPTY") return;
//       const idx = posIdx(r, c, rows);
//       rsp[idx]  = 1;
//       if (cell.type === "GOLD")   lc.push([c, r, cell.value]);
//       if (cell.type === "BLUE")   lc.push([c, r, cell.value]);
//       if (cell.type === "PURPLE") lc.push([c, r, cell.value]);
//       if (cell.type === "RED") {
//         lc.push([c, r, cell.value]);
//         hasRed = true;
//         if (cell.multiplier)
//           mult[idx] = isNaN(Number(cell.multiplier)) ? cell.multiplier : Number(cell.multiplier);
//       }
//     });
//   });

//   const parts: string[] = [`reelStopPositions: [${rsp.join(",")}]`];
//   if (lc.length > 0)
//     parts.push(`landedCoinsInBonusBoost: [${lc.map(e => `[${e.join(",")}]`).join(",")}]`);
//   if (hasRed && mult.some(m => m !== 0))
//     parts.push(`multipliers: [${mult.join(",")}]`);
//   return `[${parts.join(", ")}]`;
// }


/* eslint-disable @typescript-eslint/no-explicit-any */

export type FeatureKey = "piggyZone" | "piggyWheel" | "piggyTower";

// ─── Grid sizing ──────────────────────────────────────────────────────────────
// The combination grid is ALWAYS addressed using Tower's full 12-row scheme,
// so that positions line up with the standalone Wheel / Zone / Tower features
// (which all number reel positions the same way: col * 12 + row).
//
//  - When piggyTower IS selected: the full 12 rows are usable, rows 0-7 start
//    locked and unlock progressively exactly like the standalone Tower.
//  - When piggyTower is NOT selected: only the bottom 4 rows are usable (same
//    as standalone Wheel / Zone), but they are still numbered as rows 8-11 of
//    the 12-row reel strip — NOT as rows 0-3 — so the flat positions match.
export const ROWS_TOTAL  = 12;
export const COLS        = 5;
export const ROWS_LOCKED = 8;   // rows 0-7 = locked section (only relevant with piggyTower)
export const ROWS_INIT   = 4;   // rows 8-11 = always-unlocked base-game section
export const TOTAL       = ROWS_TOTAL * COLS;  // 60

export const COINS_PER_ROW = 6;  // tower unlock progress: coins per row unlock
export const MAX_SPINS     = 3;
export const MAX_RED       = 12;
export const MAX_BLUE      = 8;
export const MAX_PURPLE    = 12;

export function hasTower(features: FeatureKey[]): boolean { return features.includes("piggyTower"); }
export function hasWheel(features: FeatureKey[]): boolean { return features.includes("piggyWheel"); }
export function hasZone(features: FeatureKey[]):  boolean { return features.includes("piggyZone");  }

/** Local grid rows actually rendered: full 12 with Tower, else just the 4 always-unlocked rows. */
export function gridRows(features: FeatureKey[]): number { return hasTower(features) ? ROWS_TOTAL : ROWS_INIT; }
export function gridCols(_features: FeatureKey[]): number { return COLS; }
export function gridTotal(features: FeatureKey[]): number { return gridRows(features) * COLS; }

// ─── Cell type ────────────────────────────────────────────────────────────────
export type ComboCell =
  | { type: "EMPTY" }
  | { type: "GOLD";    value: string }
  | { type: "RED";     value: string; multiplier: string }
  | { type: "BLUE";    value: string }
  | { type: "PURPLE";  value: string };

// ─── Coin value option lists (reused verbatim from each standalone feature) ──
export const GOLD_COIN_VALUES: string[] = [
  "MINOR", "MINI", "150", "125", "100", "70", "60", "50", "40", "25", "15", "10", "5", "4",
];
export const RED_COIN_VALUES: string[] = [
  "MINOR", "MINI", "750", "500", "400", "300", "250", "200", "150", "100", "80", "50", "30", "20",
];
export const BLUE_COIN_VALUES: string[] = [
  "MINOR", "MINI", "150", "125", "100", "70", "60", "50",
];
export const PURPLE_COIN_VALUES: string[] = [
  "MINOR", "MINI", "750", "500", "400", "300", "250", "200", "150", "100", "80", "50", "30", "20",
];

// Generic alias kept for backwards compatibility with any existing callers.
export const COIN_VALUES = GOLD_COIN_VALUES;

export const MULTIPLIER_VALUES: string[] = [
  "GRAND", "5", "10", "38", "3", "88", "MAJOR", "2", "28", "8", "68", "18",
];

// ─── Coin sequences (identical to each standalone feature, one used per spin) ─
export const RED_COIN_SEQUENCE: string[] = [
  "RED_COIN 100000", "RED_COIN 50000", "RED_COIN 1000", "RED_COIN 100",
  "RED_COIN 50",     "RED_COIN 10",    "RED_COIN 10",   "RED_COIN 1",
  "RED_COIN 1",      "RED_COIN 1",     "RED_COIN 1",    "RED_COIN 1",
];
export const BLUE_COIN_SEQUENCE: string[] = [
  "1000000", "10000", "1000", "650", "100", "1", "1", "1",
];
export const PURPLE_COIN_SEQUENCE: string[] = [
  "PURPLE_COIN 800000", "PURPLE_COIN 10000", "PURPLE_COIN 1000", "PURPLE_COIN 650",
  "PURPLE_COIN 100",    "PURPLE_COIN 10",    "PURPLE_COIN 10",   "PURPLE_COIN 10",
  "PURPLE_COIN 1",      "PURPLE_COIN 1",     "PURPLE_COIN 1",    "PURPLE_COIN 1",
];

// ─── Position helpers — ALWAYS numbered per Tower's 12-row scheme ────────────
/**
 * Global flat position for a LOCAL grid cell (row, col).
 *  - With piggyTower: local rows 0-11 map 1:1 onto global rows 0-11.
 *  - Without piggyTower: the grid only has 4 local rows, representing the
 *    always-unlocked bottom section, so they're offset by ROWS_LOCKED (8) —
 *    exactly matching Wheel / Zone's own gridToPos addressing.
 */
export function gridToPos(row: number, col: number, features: FeatureKey[]): number {
  const globalRow = hasTower(features) ? row : row + ROWS_LOCKED;
  return col * ROWS_TOTAL + globalRow;
}

/** Column from a global flat position. */
export function posToCol(pos: number): number {
  return Math.floor(pos / ROWS_TOTAL);
}

/** Whether a global flat position falls in the locked section (rows 0-7). */
export function isPosLocked(pos: number): boolean {
  return (pos % ROWS_TOTAL) < ROWS_LOCKED;
}

/** All 60 positions, column-major scan order (col 0 top→bottom, then col 1, …). */
export const ALL_POSITIONS: number[] = (() => {
  const arr: number[] = [];
  for (let col = 0; col < COLS; col++)
    for (let row = 0; row < ROWS_TOTAL; row++)
      arr.push(col * ROWS_TOTAL + row);
  return arr;
})();

/** The 20 always-unlocked positions (rows 8-11), column-major. */
export const UNLOCKED_POSITIONS: number[] = (() => {
  const arr: number[] = [];
  for (let col = 0; col < COLS; col++)
    for (let row = ROWS_LOCKED; row < ROWS_TOTAL; row++)
      arr.push(col * ROWS_TOTAL + row);
  return arr;
})();

// ─── typeEReelPosition helper ─────────────────────────────────────────────────
export type EReelSetting = { pos: number; value: string };

export function eReelOptions(pos: number): string[] {
  return posToCol(pos) === 0
    ? ["Reel1_0", "Reel1_1"]
    : ["ReelRest_0", "ReelRest_1"];
}

// ─── Grid factory ─────────────────────────────────────────────────────────────
export function emptyGrid(rows: number, cols: number): ComboCell[][] {
  return Array.from({ length: rows }, () =>
    Array.from({ length: cols }, (): ComboCell => ({ type: "EMPTY" }))
  );
}

/**
 * Seed combined grid from base-game SCaT coins. All SCaTs become GOLD coins
 * at their grid position.
 *
 * With piggyTower: base positions 0-3 map to local rows 8-11 (bottom, unlocked).
 * Without piggyTower: base positions 0-3 map to local rows 0-3 directly
 * (the grid only has 4 rows), which gridToPos() then offsets to global rows 8-11.
 */
export function seedCombinedGrid(
  baseCoins: Array<{ position: number; value: string; featureKey: string }>,
  features:  FeatureKey[]
): ComboCell[][] {
  const rows  = gridRows(features);
  const cols  = COLS;
  const g     = emptyGrid(rows, cols);
  const isTwr = hasTower(features);

  baseCoins.forEach(({ position, value }) => {
    const col     = Math.floor(position / ROWS_INIT);
    const baseRow = position % ROWS_INIT;
    const row     = isTwr ? baseRow + ROWS_LOCKED : baseRow;

    if (row < rows && col < cols) {
      g[row][col] = { type: "GOLD", value };
    }
  });
  return g;
}

// ─── Click cycle ──────────────────────────────────────────────────────────────
/**
 * Click cycle for a cell, gated by which features are active and the current
 * coin counts. `locked` reflects whether THIS row is currently in the locked
 * section (only meaningful with piggyTower) — BLUE can only ever be placed
 * while the row is locked; RED and PURPLE can land in any row (locked or
 * unlocked) whenever their feature is active.
 */
export function nextCellType(
  current:  ComboCell["type"],
  features: FeatureKey[],
  counts:   { red: number; blue: number; purple: number },
  locked:   boolean
): ComboCell["type"] {
  const seq: ComboCell["type"][] = ["GOLD"];
  if (hasWheel(features) && counts.red    < MAX_RED)    seq.push("RED");
  if (hasTower(features) && locked && counts.blue < MAX_BLUE)   seq.push("BLUE");
  if (hasZone(features)  && counts.purple < MAX_PURPLE) seq.push("PURPLE");

  const idx = seq.indexOf(current);
  if (idx === -1 || idx === seq.length - 1) return "GOLD";
  return seq[idx + 1];
}

// ─── Zone geometry (piggyZone) ────────────────────────────────────────────────
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

// ─── Tower unlock (piggyTower) ────────────────────────────────────────────────
export function firstUnlockedRow(unlockedCoinCount: number): number {
  const extra = Math.min(ROWS_LOCKED, Math.floor(unlockedCoinCount / COINS_PER_ROW));
  return ROWS_LOCKED - extra;
}

export function unlockHint(unlockedCoinCount: number): { coinsToNext: number; label: string } | null {
  const extra = Math.min(ROWS_LOCKED, Math.floor(unlockedCoinCount / COINS_PER_ROW));
  if (extra >= ROWS_LOCKED) return null;
  return {
    coinsToNext: (extra + 1) * COINS_PER_ROW - unlockedCoinCount,
    label: `row ${ROWS_INIT + extra + 1}`,
  };
}

// ─── Gaffe generator ──────────────────────────────────────────────────────────
/**
 * Builds one spin output line for the combined (2- or 3-feature) grid.
 * Positions are always the global 0-59 Tower-style flat index (see
 * gridToPos above), so they line up 1:1 with the standalone Wheel / Zone /
 * Tower features.
 *
 * 1. typeEReelPosition:[pos,value] — same as every standalone feature.
 *
 * 2. unlockedColorCoinsReelPosition:[blue,purple,red] — only the NEW colored
 *    coin(s) that landed in an UNLOCKED position (rows 8-11) this spin.
 *    Blue effectively never appears here since blue can only land in locked
 *    rows, but the slot is kept for format consistency / future combos.
 *
 * 3. lockedBlueCoinsReelPosition / lockedRedCoinsReelPosition /
 *    lockedPurpleCoinsReelPosition:[[row,pos],...] — ALL coins of that color
 *    currently sitting in the LOCKED section (rows 0-7), accumulated across
 *    spins (mirrors Tower's own lockedBlueCoinsReelPosition format).
 *
 * 4. reelstripCOR_{pos}:[...] for every NEW coin this spin:
 *      GOLD   → [value]
 *      RED    → [RED_COIN {seq},value]      (+ multiplierLadderPrize_{pos} if set)
 *      BLUE   → [BLUE_COIN {seq},value]
 *      PURPLE → [PURPLE_COIN {seq},value]
 *
 * 5. reelStops — follows the same concept as the relevant standalone feature:
 *    all 60 positions when piggyTower is active (like Tower), otherwise just
 *    the 20 always-unlocked positions (like Wheel / Zone). Positions already
 *    occupied before this spin (prevSnap) are skipped entirely.
 *
 * @param grid           current grid state (local rows/cols)
 * @param features       active features for this combo
 * @param prevSnap       global positions occupied BEFORE this spin
 * @param eReelPos       typeEReelPosition setting, or null
 * @param redCoinIdx     next index into RED_COIN_SEQUENCE
 * @param blueCoinIdx    next index into BLUE_COIN_SEQUENCE
 * @param purpleCoinIdx  next index into PURPLE_COIN_SEQUENCE
 */
export function generateComboGaffe(
  grid:          ComboCell[][],
  features:      FeatureKey[],
  prevSnap:      Set<number>,
  eReelPos:      EReelSetting | null,
  redCoinIdx:    number,
  blueCoinIdx:   number,
  purpleCoinIdx: number,
): string {
  const parts: string[] = [];
  const isTwr = hasTower(features);

  // 1 ── typeEReelPosition ────────────────────────────────────────────────────
  if (eReelPos) {
    parts.push(`typeEReelPosition:[${eReelPos.pos},${eReelPos.value}]`);
  }

  // 2 ── unlockedColorCoinsReelPosition: [blue, purple, red] — NEW & unlocked ─
  let newBluePos:   number | null = null;
  let newPurplePos: number | null = null;
  let newRedPos:    number | null = null;

  grid.forEach((rowArr, r) => rowArr.forEach((cell, c) => {
    const pos = gridToPos(r, c, features);
    if (prevSnap.has(pos)) return;
    if (isPosLocked(pos)) return;                 // this line is unlocked-only
    if (cell.type === "BLUE")   newBluePos   = pos;
    if (cell.type === "PURPLE") newPurplePos = pos;
    if (cell.type === "RED")    newRedPos    = pos;
  }));

  if (newBluePos !== null || newPurplePos !== null || newRedPos !== null) {
    const b = newBluePos   !== null ? String(newBluePos)   : "";
    const p = newPurplePos !== null ? String(newPurplePos) : "";
    const r = newRedPos    !== null ? String(newRedPos)    : "";
    parts.push(`unlockedColorCoinsReelPosition:[${b},${p},${r}]`);
  }

  // 3 ── locked-row accumulators (ALL coins of that color currently locked) ──
  const lockedBlue:   string[] = [];
  const lockedRed:    string[] = [];
  const lockedPurple: string[] = [];

  grid.forEach((rowArr, r) => rowArr.forEach((cell, c) => {
    const pos = gridToPos(r, c, features);
    if (!isPosLocked(pos)) return;
    const globalRow = pos % ROWS_TOTAL;
    if (cell.type === "BLUE")   lockedBlue.push(`[${globalRow},${pos}]`);
    if (cell.type === "RED")    lockedRed.push(`[${globalRow},${pos}]`);
    if (cell.type === "PURPLE") lockedPurple.push(`[${globalRow},${pos}]`);
  }));

  if (lockedBlue.length   > 0) parts.push(`lockedBlueCoinsReelPosition:[${lockedBlue.join(",")}]`);
  if (lockedRed.length    > 0) parts.push(`lockedRedCoinsReelPosition:[${lockedRed.join(",")}]`);
  if (lockedPurple.length > 0) parts.push(`lockedPurpleCoinsReelPosition:[${lockedPurple.join(",")}]`);

  // 4 ── reelstripCOR for every NEW coin this spin + multiplierLadderPrize ───
  let rIdx = redCoinIdx;
  let bIdx = blueCoinIdx;
  let pIdx = purpleCoinIdx;
  let multLine: string | undefined;

  grid.forEach((rowArr, r) => rowArr.forEach((cell, c) => {
    if (cell.type === "EMPTY") return;
    const pos = gridToPos(r, c, features);
    if (prevSnap.has(pos)) return;                          // not new this spin

    if (cell.type === "GOLD") {
      parts.push(`reelstripCOR_${pos}:[${cell.value}]`);
    } else if (cell.type === "RED") {
      const seqVal = RED_COIN_SEQUENCE[rIdx] ?? RED_COIN_SEQUENCE[RED_COIN_SEQUENCE.length - 1];
      parts.push(`reelstripCOR_${pos}:[${seqVal},${cell.value}]`);
      rIdx++;
      if (cell.multiplier) multLine = `multiplierLadderPrize_${pos}:${cell.multiplier}`;
    } else if (cell.type === "BLUE") {
      const seqVal = BLUE_COIN_SEQUENCE[bIdx] ?? BLUE_COIN_SEQUENCE[BLUE_COIN_SEQUENCE.length - 1];
      parts.push(`reelstripCOR_${pos}:[BLUE_COIN ${seqVal},${cell.value}]`);
      bIdx++;
    } else if (cell.type === "PURPLE") {
      const seqVal = PURPLE_COIN_SEQUENCE[pIdx] ?? PURPLE_COIN_SEQUENCE[PURPLE_COIN_SEQUENCE.length - 1];
      parts.push(`reelstripCOR_${pos}:[${seqVal},${cell.value}]`);
      pIdx++;
    }
  }));

  if (multLine) parts.push(multLine);

  // 5 ── reelStops: scan the relevant position set, skip prevSnap, 0/1 ───────
  const scanPositions = isTwr ? ALL_POSITIONS : UNLOCKED_POSITIONS;

  const newlyFilled = new Set<number>();
  grid.forEach((rowArr, r) => rowArr.forEach((cell, c) => {
    const pos = gridToPos(r, c, features);
    if (cell.type !== "EMPTY" && !prevSnap.has(pos)) newlyFilled.add(pos);
  }));

  const stops: number[] = [];
  scanPositions.forEach(pos => {
    if (prevSnap.has(pos)) return;                          // already occupied → skip
    stops.push(newlyFilled.has(pos) ? 0 : 1);
  });

  parts.push(`reelStops:[${stops.join(",")}]`);

  return `[${parts.join(", ")}]`;
}