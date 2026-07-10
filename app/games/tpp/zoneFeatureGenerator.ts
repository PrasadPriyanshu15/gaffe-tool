



// /* eslint-disable @typescript-eslint/no-explicit-any */

// // ─── Grid constants ───────────────────────────────────────────────────────────
// export const ROWS      = 4;
// export const COLS      = 5;
// export const TOTAL     = ROWS * COLS; // 20
// export const MAX_SPINS = 3;

// export const COIN_VALUES = ["1", "2", "5", "10", "25", "50", "100", "Minor", "Major"];

// // ─── Types ────────────────────────────────────────────────────────────────────
// export type ZoneCell =
//   | { type: "EMPTY" }
//   | { type: "GOLD";   value: string }
//   | { type: "PURPLE"; value: string };   // charges tracked in Zone[] not in cell

// export type Zone = {
//   id:      string;
//   anchors: [number, number][]; // [row, col]
//   cells:   [number, number][]; // all 3×3 union cells [row, col]
//   charges: number;
// };

// // ─── Position helpers ─────────────────────────────────────────────────────────
// /**
//  * Column-major flat index for reelStopPositions array.
//  * index = col * ROWS + row   (matches the grid_structure diagram)
//  */
// export function posIdx(row: number, col: number): number {
//   return col * ROWS + row;
// }

// // ─── Grid factory ─────────────────────────────────────────────────────────────
// export function emptyGrid(): ZoneCell[][] {
//   return Array.from({ length: ROWS }, () =>
//     Array.from({ length: COLS }, (): ZoneCell => ({ type: "EMPTY" }))
//   );
// }

// /**
//  * All base-game purple SCaT coins come into this feature as GOLD coins.
//  * BaseCoin.position = col*4+row (column-major, 4-row base grid).
//  */
// export function seedFromBase(baseCoins: { position: number; value: string }[]): ZoneCell[][] {
//   const g = emptyGrid();
//   baseCoins.forEach(({ position, value }) => {
//     const col = Math.floor(position / ROWS);
//     const row = position % ROWS;
//     if (row < ROWS && col < COLS) {
//       g[row][col] = { type: "GOLD", value };
//     }
//   });
//   return g;
// }

// // ─── Zone geometry ────────────────────────────────────────────────────────────
// /** All valid cells in the 3×3 area centred on (r, c). Returns [row, col] pairs. */
// export function getSingleZoneCells(r: number, c: number): [number, number][] {
//   const cells: [number, number][] = [];
//   for (let i = r - 1; i <= r + 1; i++)
//     for (let j = c - 1; j <= c + 1; j++)
//       if (i >= 0 && i < ROWS && j >= 0 && j < COLS)
//         cells.push([i, j]);
//   return cells;
// }

// /** Union of 3×3 areas for every anchor. */
// export function getUnionCells(anchors: [number, number][]): [number, number][] {
//   const set = new Set<string>();
//   anchors.forEach(([r, c]) =>
//     getSingleZoneCells(r, c).forEach(([ri, ci]) => set.add(`${ri},${ci}`))
//   );
//   return Array.from(set).map(s => s.split(",").map(Number) as [number, number]);
// }

// // ─── Merge logic ──────────────────────────────────────────────────────────────
// /** Edge-adjacency only — diagonal corners do NOT trigger merge. */
// export function zonesTouch(cells1: [number, number][], cells2: [number, number][]): boolean {
//   for (const [r1, c1] of cells1)
//     for (const [r2, c2] of cells2)
//       if (Math.abs(r1 - r2) + Math.abs(c1 - c2) <= 1) return true;
//   return false;
// }

// export function mergeAllTouchingZones(zones: Zone[]): Zone[] {
//   const merged = new Array(zones.length).fill(false);
//   const result: Zone[] = [];
//   for (let i = 0; i < zones.length; i++) {
//     if (merged[i]) continue;
//     let cur = zones[i];
//     let changed = true;
//     while (changed) {
//       changed = false;
//       for (let j = 0; j < zones.length; j++) {
//         if (i === j || merged[j]) continue;
//         if (zonesTouch(cur.cells, zones[j].cells)) {
//           const newAnchors = [...cur.anchors, ...zones[j].anchors];
//           cur = { id: cur.id, anchors: newAnchors, cells: getUnionCells(newAnchors), charges: MAX_SPINS };
//           merged[j] = true;
//           changed    = true;
//         }
//       }
//     }
//     result.push(cur);
//   }
//   return result;
// }

// export function addZoneForAnchor(zones: Zone[], r: number, c: number, nextId: () => string): Zone[] {
//   const nz: Zone = { id: nextId(), anchors: [[r, c]], cells: getSingleZoneCells(r, c), charges: MAX_SPINS };
//   return mergeAllTouchingZones([...zones, nz]);
// }

// /** Remove an anchor from zones, rebuild cells, re-merge. */
// export function removeAnchorFromZones(zones: Zone[], r: number, c: number): Zone[] {
//   const updated = zones
//     .map(z => ({ ...z, anchors: z.anchors.filter(([ar, ac]) => !(ar === r && ac === c)) }))
//     .filter(z => z.anchors.length > 0)
//     .map(z => ({ ...z, cells: getUnionCells(z.anchors) }));
//   return mergeAllTouchingZones(updated);
// }

// // ─── Spin processing ──────────────────────────────────────────────────────────
// /**
//  * Called when SPIN is pressed.
//  * Absorbs every non-anchor non-EMPTY cell inside each zone.
//  * Charges always decrement by 1 (absorption does NOT reset charges).
//  * Zones reaching 0 are removed; their PURPLE anchor coins stay on the grid.
//  */
// export function processZoneOnSpin(
//   grid: ZoneCell[][], zones: Zone[]
// ): { grid: ZoneCell[][]; zones: Zone[] } {
//   const ng: ZoneCell[][] = grid.map(row => row.map(cell => ({ ...cell })));

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

// // ─── Output formatter ─────────────────────────────────────────────────────────
// /**
//  * reelStopPositions: 20 elements, index = col*ROWS+row, value 1 or 0.
//  * landedCoinsInBonusBoost: [[col, row, value], ...]
//  */
// export function generateZoneGaffe(grid: ZoneCell[][]): string {
//   const rsp: number[]              = Array(TOTAL).fill(0);
//   const lc:  (string | number)[][] = [];

//   grid.forEach((rowArr, r) => {
//     rowArr.forEach((cell, c) => {
//       if (cell.type === "EMPTY") return;
//       rsp[posIdx(r, c)] = 1;
//       lc.push([c, r, cell.value]);   // [col, row, value]
//     });
//   });

//   const parts: string[] = [`reelStopPositions: [${rsp.join(",")}]`];
//   if (lc.length > 0)
//     parts.push(`landedCoinsInBonusBoost: [${lc.map(e => `[${e.join(",")}]`).join(",")}]`);
//   return `[${parts.join(", ")}]`;
// }





/* eslint-disable @typescript-eslint/no-explicit-any */
 
// ─── Grid constants ────────────────────────────────────────────────────────────
export const TOTAL_ROWS       = 12;          // Full reel strip: rows 0–11
export const COLS             = 5;
export const UNLOCK_START     = 8;           // Unlocked rows start at 8
export const GRID_ROWS        = 4;           // Interactive rows: 8, 9, 10, 11
export const GRID_COLS        = COLS;
export const MAX_PURPLE_COINS = 12;
export const MAX_SPINS        = 3;
 
// ─── Position helpers ──────────────────────────────────────────────────────────
 
/** Global flat position from internal grid coords: col * 12 + (8 + row) */
export function gridToPos(row: number, col: number): number {
  return col * TOTAL_ROWS + UNLOCK_START + row;
}
 
/** Column from global flat position */
export function posToCol(pos: number): number {
  return Math.floor(pos / TOTAL_ROWS);
}
 
/**
 * Unlocked positions in scan order: top-to-bottom then left-to-right.
 * [8,9,10,11, 20,21,22,23, 32,33,34,35, 44,45,46,47, 56,57,58,59]
 */
export const UNLOCKED_POSITIONS: number[] = (() => {
  const arr: number[] = [];
  for (let col = 0; col < COLS; col++)
    for (let row = 0; row < GRID_ROWS; row++)
      arr.push(gridToPos(row, col));
  return arr;
})();
 
// ─── PURPLE coin sequence (12 values, used one per spin in order) ────────────
export const PURPLE_COIN_SEQUENCE: string[] = [
  "PURPLE_COIN 800000", "PURPLE_COIN 10000", "PURPLE_COIN 1000", "PURPLE_COIN 650",
  "PURPLE_COIN 100",    "PURPLE_COIN 10",    "PURPLE_COIN 10",   "PURPLE_COIN 10",
  "PURPLE_COIN 1",      "PURPLE_COIN 1",     "PURPLE_COIN 1",    "PURPLE_COIN 1",
];
 
// ─── Coin value options ────────────────────────────────────────────────────────
export const COIN_VALUES: string[] = [
  "MINOR", "MINI", "750", "500", "400", "300", "250",
  "200",   "150",  "100",  "80",  "50",  "30",  "20",
];
 
// ─── Cell types ────────────────────────────────────────────────────────────────
export type ZoneCell =
  | { type: "EMPTY"  }
  | { type: "GOLD";   value: string }
  | { type: "PURPLE"; value: string };   // charges tracked in Zone[] not in cell
 
export type Zone = {
  id:      string;
  anchors: [number, number][]; // [row, col] local grid coords
  cells:   [number, number][]; // all 3×3 union cells [row, col] local grid coords
  charges: number;
};
 
// ─── Grid factory ──────────────────────────────────────────────────────────────
export function emptyGrid(): ZoneCell[][] {
  return Array.from({ length: GRID_ROWS }, () =>
    Array.from({ length: GRID_COLS }, (): ZoneCell => ({ type: "EMPTY" }))
  );
}
 
/**
 * Seed base-game coins into the unlocked grid.
 * BaseCoin.position = col * 4 + row (old 4-row base-game coords).
 */
export function seedFromBase(baseCoins: { position: number; value: string }[]): ZoneCell[][] {
  const g = emptyGrid();
  baseCoins.forEach(({ position, value }) => {
    const col = Math.floor(position / 4);
    const row = position % 4;
    if (row < GRID_ROWS && col < GRID_COLS)
      g[row][col] = { type: "GOLD", value };
  });
  return g;
}
 
// ─── typeEReelPosition helper ─────────────────────────────────────────────────
export type EReelSetting = { pos: number; value: string };
 
export function eReelOptions(pos: number): string[] {
  return posToCol(pos) === 0
    ? ["Reel1_0", "Reel1_1"]
    : ["ReelRest_0", "ReelRest_1"];
}
 
// ─── Zone geometry (operates on local grid coords, unchanged logic) ──────────
/** All valid cells in the 3×3 area centred on (r, c). Returns [row, col] pairs. */
export function getSingleZoneCells(r: number, c: number): [number, number][] {
  const cells: [number, number][] = [];
  for (let i = r - 1; i <= r + 1; i++)
    for (let j = c - 1; j <= c + 1; j++)
      if (i >= 0 && i < GRID_ROWS && j >= 0 && j < GRID_COLS)
        cells.push([i, j]);
  return cells;
}
 
/** Union of 3×3 areas for every anchor. */
export function getUnionCells(anchors: [number, number][]): [number, number][] {
  const set = new Set<string>();
  anchors.forEach(([r, c]) =>
    getSingleZoneCells(r, c).forEach(([ri, ci]) => set.add(`${ri},${ci}`))
  );
  return Array.from(set).map(s => s.split(",").map(Number) as [number, number]);
}
 
// ─── Merge logic ──────────────────────────────────────────────────────────────
/** Edge-adjacency only — diagonal corners do NOT trigger merge. */
export function zonesTouch(cells1: [number, number][], cells2: [number, number][]): boolean {
  for (const [r1, c1] of cells1)
    for (const [r2, c2] of cells2)
      if (Math.abs(r1 - r2) + Math.abs(c1 - c2) <= 1) return true;
  return false;
}
 
export function mergeAllTouchingZones(zones: Zone[]): Zone[] {
  const merged = new Array(zones.length).fill(false);
  const result: Zone[] = [];
  for (let i = 0; i < zones.length; i++) {
    if (merged[i]) continue;
    let cur = zones[i];
    let changed = true;
    while (changed) {
      changed = false;
      for (let j = 0; j < zones.length; j++) {
        if (i === j || merged[j]) continue;
        if (zonesTouch(cur.cells, zones[j].cells)) {
          const newAnchors = [...cur.anchors, ...zones[j].anchors];
          cur = { id: cur.id, anchors: newAnchors, cells: getUnionCells(newAnchors), charges: MAX_SPINS };
          merged[j] = true;
          changed    = true;
        }
      }
    }
    result.push(cur);
  }
  return result;
}
 
export function addZoneForAnchor(zones: Zone[], r: number, c: number, nextId: () => string): Zone[] {
  const nz: Zone = { id: nextId(), anchors: [[r, c]], cells: getSingleZoneCells(r, c), charges: MAX_SPINS };
  return mergeAllTouchingZones([...zones, nz]);
}
 
/** Remove an anchor from zones, rebuild cells, re-merge. */
export function removeAnchorFromZones(zones: Zone[], r: number, c: number): Zone[] {
  const updated = zones
    .map(z => ({ ...z, anchors: z.anchors.filter(([ar, ac]) => !(ar === r && ac === c)) }))
    .filter(z => z.anchors.length > 0)
    .map(z => ({ ...z, cells: getUnionCells(z.anchors) }));
  return mergeAllTouchingZones(updated);
}
 
// ─── Spin processing ──────────────────────────────────────────────────────────
/**
 * Called when SPIN is pressed.
 * Absorbs every non-anchor non-EMPTY cell inside each zone.
 * Charges always decrement by 1 (absorption does NOT reset charges).
 * Zones reaching 0 are removed; their PURPLE anchor coins stay on the grid.
 */
export function processZoneOnSpin(
  grid: ZoneCell[][], zones: Zone[]
): { grid: ZoneCell[][]; zones: Zone[] } {
  const ng: ZoneCell[][] = grid.map(row => row.map(cell => ({ ...cell })));
 
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
 
// ─── Gaffe generator ──────────────────────────────────────────────────────────
/**
 * Build one spin output line. Mirrors the Wheel feature's gaffe format,
 * with these Zone-specific differences:
 *
 *  - PURPLE takes the role Wheel gives to RED (color-coin type / reelstripCOR label).
 *  - There is no multiplier ladder in Zone — multiplierLadderPrize is never emitted.
 *  - unlockedColorCoinsReelPosition still has 3 slots, but Zone only ever
 *    populates the 2nd slot (Wheel populates the 3rd slot for its red coin).
 *
 * @param grid           current grid state (4 × 5)
 * @param prevSnap       global positions that were occupied BEFORE this spin
 * @param eReelPos       typeEReelPosition setting, or null
 * @param purpleCoinIdx  next index into PURPLE_COIN_SEQUENCE for new purple coins
 * @param features       active features, e.g. ["piggyZone"] or ["piggyWheel","piggyZone"]
 */
export function generateZoneGaffe(
  grid:          ZoneCell[][],
  prevSnap:      Set<number>,
  eReelPos:      EReelSetting | null,
  purpleCoinIdx: number,
  features:      string[],
): string {
  const parts: string[] = [];
 
  // 1 ── typeEReelPosition ────────────────────────────────────────────────────
  if (eReelPos) {
    parts.push(`typeEReelPosition:[${eReelPos.pos},${eReelPos.value}]`);
  }
 
  // 2 ── Find the NEW purple-coin position ────────────────────────────────────
  // Zone only tracks purple (no blue/red), and places it in the 2nd slot.
  let purplePos: number | null = null;
 
  grid.forEach((rowArr, r) => rowArr.forEach((cell, c) => {
    const pos = gridToPos(r, c);
    if (prevSnap.has(pos)) return;
    if (cell.type === "PURPLE") purplePos = pos;
  }));
 
  if (purplePos !== null) {
    parts.push(`unlockedColorCoinsReelPosition:[,${purplePos},]`);
  }
 
  // 3 ── reelstripCOR_{pos} for each NEW coin ─────────────────────────────────
  // No multiplierLadderPrize in Zone.
  let pIdx = purpleCoinIdx;
 
  grid.forEach((rowArr, r) => rowArr.forEach((cell, c) => {
    if (cell.type === "EMPTY") return;
    const pos = gridToPos(r, c);
    if (prevSnap.has(pos)) return;                          // not new this spin
 
    if (cell.type === "GOLD") {
      parts.push(`reelstripCOR_${pos}:[${cell.value}]`);
    } else if (cell.type === "PURPLE") {
      const seqVal = PURPLE_COIN_SEQUENCE[pIdx] ?? PURPLE_COIN_SEQUENCE[PURPLE_COIN_SEQUENCE.length - 1];
      parts.push(`reelstripCOR_${pos}:[${seqVal},${cell.value}]`);
      pIdx++;
    }
  }));
 
  // 4 ── reelStops ────────────────────────────────────────────────────────────
  // For every unlocked position that was EMPTY at the start of this spin:
  //   0  → a new coin was placed there
  //   1  → still empty
  // Positions that were already occupied (prevSnap) are skipped entirely.
  const newlyFilled = new Set<number>();
  grid.forEach((rowArr, r) => rowArr.forEach((cell, c) => {
    const pos = gridToPos(r, c);
    if (cell.type !== "EMPTY" && !prevSnap.has(pos)) newlyFilled.add(pos);
  }));
 
  const stops: number[] = [];
  UNLOCKED_POSITIONS.forEach(pos => {
    if (prevSnap.has(pos)) return;                          // already occupied → skip
    stops.push(newlyFilled.has(pos) ? 0 : 1);
  });
 
  parts.push(`reelStops:[${stops.join(",")}]`);
 
  return `[${parts.join(", ")}]`;
}