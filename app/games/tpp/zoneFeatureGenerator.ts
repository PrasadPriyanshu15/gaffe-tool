// /* eslint-disable @typescript-eslint/no-explicit-any */

// // ─── Grid constants ───────────────────────────────────────────────────────────
// export const ROWS  = 4;
// export const COLS  = 5;
// export const TOTAL = ROWS * COLS; // 20

// export const CODE_GOLD   = 9;
// export const CODE_PURPLE = 14;

// // ─── Cell types ───────────────────────────────────────────────────────────────
// export type ZoneCell =
//   | { type: "EMPTY" }
//   | { type: "GOLD";   value: string }
//   | { type: "PURPLE"; value: string; charges?: number };

// export type Zone = {
//   id: string;
//   /** Purple coin positions (row, col) that anchor this zone */
//   anchors: [number, number][];
//   /** Union of all 3×3 cells around each anchor */
//   cells: [number, number][];
//   /** Spins remaining; resets to 3 only when a new purple coin lands here */
//   charges: number;
// };

// export const COIN_VALUES   = ["1", "2", "5", "10", "25", "50", "100", "Minor", "Major"];
// export const MAX_SPINS     = 3;

// // ─── Position helper ─────────────────────────────────────────────────────────
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
//  * Seed initial grid from base-game purple SCaT coins → PURPLE anchors.
//  */
// export function seedFromBase(baseCoins: { position: number; value: string }[]): ZoneCell[][] {
//   const g = emptyGrid();
//   baseCoins.forEach(({ position, value }) => {
//     const col = Math.floor(position / ROWS);
//     const row = position % ROWS;
//     if (row < ROWS && col < COLS) {
//       g[row][col] = { type: "PURPLE", value, charges: MAX_SPINS };
//     }
//   });
//   return g;
// }

// // ─── Zone geometry helpers ────────────────────────────────────────────────────

// /** All valid cells in the 3×3 area centred on (r, c). */
// export function getSingleZoneCells(r: number, c: number): [number, number][] {
//   const cells: [number, number][] = [];
//   for (let i = r - 1; i <= r + 1; i++)
//     for (let j = c - 1; j <= c + 1; j++)
//       if (i >= 0 && i < ROWS && j >= 0 && j < COLS)
//         cells.push([i, j]);
//   return cells;
// }

// /** Union of 3×3 areas for every anchor in a merged zone. */
// export function getUnionCells(anchors: [number, number][]): [number, number][] {
//   const set = new Set<string>();
//   anchors.forEach(([r, c]) =>
//     getSingleZoneCells(r, c).forEach(([ri, ci]) => set.add(`${ri},${ci}`))
//   );
//   return Array.from(set).map(s => s.split(",").map(Number) as [number, number]);
// }

// // ─── Merge logic ──────────────────────────────────────────────────────────────

// /**
//  * Two zones touch (edge-adjacency or overlap; excludes diagonal-only contact).
//  */
// export function zonesTouch(cells1: [number, number][], cells2: [number, number][]): boolean {
//   for (const [r1, c1] of cells1)
//     for (const [r2, c2] of cells2)
//       if (Math.abs(r1 - r2) + Math.abs(c1 - c2) <= 1) return true;
//   return false;
// }

// /**
//  * Union-find merge: merge any zones that overlap or edge-touch.
//  * Charges reset to MAX_SPINS on merge (new purple coin caused it).
//  */
// export function mergeAllTouchingZones(zones: Zone[]): Zone[] {
//   const merged = new Array(zones.length).fill(false);
//   const result: Zone[] = [];

//   for (let i = 0; i < zones.length; i++) {
//     if (merged[i]) continue;
//     let current = zones[i];
//     let changed  = true;

//     while (changed) {
//       changed = false;
//       for (let j = 0; j < zones.length; j++) {
//         if (i === j || merged[j]) continue;
//         if (zonesTouch(current.cells, zones[j].cells)) {
//           const newAnchors = [...current.anchors, ...zones[j].anchors];
//           current = {
//             id:      current.id,
//             anchors: newAnchors,
//             cells:   getUnionCells(newAnchors),
//             charges: MAX_SPINS,
//           };
//           merged[j] = true;
//           changed    = true;
//         }
//       }
//     }
//     result.push(current);
//   }
//   return result;
// }

// // ─── Spin processing ──────────────────────────────────────────────────────────

// /**
//  * Called when SPIN is pressed.
//  * - Every non-anchor non-EMPTY cell inside a zone is absorbed (set to EMPTY).
//  * - Charges always decrement by 1 (absorption does NOT reset them).
//  * - Zones reaching 0 charges are removed; purple anchor coins stay on grid.
//  */
// export function processZoneOnSpin(
//   grid: ZoneCell[][], zones: Zone[]
// ): { grid: ZoneCell[][]; zones: Zone[] } {
//   const newGrid: ZoneCell[][] = grid.map(row => row.map(cell => ({ ...cell })));

//   const updatedZones = zones
//     .map(zone => {
//       zone.cells.forEach(([r, c]) => {
//         const isAnchor = zone.anchors.some(([ar, ac]) => ar === r && ac === c);
//         if (!isAnchor && newGrid[r][c].type !== "EMPTY") {
//           newGrid[r][c] = { type: "EMPTY" };
//         }
//       });
//       return { ...zone, charges: zone.charges - 1 };
//     })
//     .filter(z => z.charges > 0);

//   return { grid: newGrid, zones: updatedZones };
// }

// /**
//  * Build or update zones when a new purple coin is placed at (r, c).
//  * Either creates a new zone or merges into an existing one.
//  */
// export function addZoneForAnchor(
//   zones: Zone[], r: number, c: number, nextId: () => string
// ): Zone[] {
//   const newZone: Zone = {
//     id:      nextId(),
//     anchors: [[r, c]],
//     cells:   getSingleZoneCells(r, c),
//     charges: MAX_SPINS,
//   };
//   return mergeAllTouchingZones([...zones, newZone]);
// }

// /**
//  * Rebuild all zones from the current set of purple anchor coins in the grid.
//  * Used after manual edits.
//  */
// export function rebuildZones(grid: ZoneCell[]): Zone[] {
//   // grid is the flat row-major version — but we work with the 2D grid
//   return [];
// }

// export function rebuildZonesFromGrid(grid: ZoneCell[][]): Zone[] {
//   let zones: Zone[] = [];
//   let counter = 0;
//   grid.forEach((rowArr, r) => {
//     rowArr.forEach((cell, c) => {
//       if (cell.type === "PURPLE") {
//         const charges = cell.charges ?? MAX_SPINS;
//         const newZone: Zone = {
//           id:      `z${++counter}`,
//           anchors: [[r, c]],
//           cells:   getSingleZoneCells(r, c),
//           charges,
//         };
//         zones.push(newZone);
//       }
//     });
//   });
//   return mergeAllTouchingZones(zones);
// }

// // ─── Gaffe generator ─────────────────────────────────────────────────────────
// /**
//  * Builds one output line for a ZONE spin.
//  *
//  * reelStopPositions: 20 elements — colorCode (9=gold, 14=purple) or 0
//  * landedCoinsInBonusBoost: [[flatPos, colorCode, value], ...]
//  */
// export function generateZoneGaffe(grid: ZoneCell[][]): string {
//   const rsp: number[]            = Array(TOTAL).fill(0);
//   const lc:  (string | number)[][] = [];

//   grid.forEach((rowArr, r) => {
//     rowArr.forEach((cell, c) => {
//       if (cell.type === "EMPTY") return;
//       const idx = posIdx(r, c);
//       if (cell.type === "GOLD") {
//         rsp[idx] = CODE_GOLD;
//         lc.push([idx, CODE_GOLD, cell.value]);
//       }
//       if (cell.type === "PURPLE") {
//         rsp[idx] = CODE_PURPLE;
//         lc.push([idx, CODE_PURPLE, cell.value]);
//       }
//     });
//   });

//   const parts: string[] = [`reelStopPositions: [${rsp.join(",")}]`];
//   if (lc.length > 0) {
//     parts.push(`landedCoinsInBonusBoost: [${lc.map(c => `[${c.join(",")}]`).join(",")}]`);
//   }
//   return `[${parts.join(", ")}]`;
// }



/* eslint-disable @typescript-eslint/no-explicit-any */

// ─── Grid constants ───────────────────────────────────────────────────────────
export const ROWS      = 4;
export const COLS      = 5;
export const TOTAL     = ROWS * COLS; // 20
export const MAX_SPINS = 3;

export const COIN_VALUES = ["1", "2", "5", "10", "25", "50", "100", "Minor", "Major"];

// ─── Types ────────────────────────────────────────────────────────────────────
export type ZoneCell =
  | { type: "EMPTY" }
  | { type: "GOLD";   value: string }
  | { type: "PURPLE"; value: string };   // charges tracked in Zone[] not in cell

export type Zone = {
  id:      string;
  anchors: [number, number][]; // [row, col]
  cells:   [number, number][]; // all 3×3 union cells [row, col]
  charges: number;
};

// ─── Position helpers ─────────────────────────────────────────────────────────
/**
 * Column-major flat index for reelStopPositions array.
 * index = col * ROWS + row   (matches the grid_structure diagram)
 */
export function posIdx(row: number, col: number): number {
  return col * ROWS + row;
}

// ─── Grid factory ─────────────────────────────────────────────────────────────
export function emptyGrid(): ZoneCell[][] {
  return Array.from({ length: ROWS }, () =>
    Array.from({ length: COLS }, (): ZoneCell => ({ type: "EMPTY" }))
  );
}

/**
 * All base-game purple SCaT coins come into this feature as GOLD coins.
 * BaseCoin.position = col*4+row (column-major, 4-row base grid).
 */
export function seedFromBase(baseCoins: { position: number; value: string }[]): ZoneCell[][] {
  const g = emptyGrid();
  baseCoins.forEach(({ position, value }) => {
    const col = Math.floor(position / ROWS);
    const row = position % ROWS;
    if (row < ROWS && col < COLS) {
      g[row][col] = { type: "GOLD", value };
    }
  });
  return g;
}

// ─── Zone geometry ────────────────────────────────────────────────────────────
/** All valid cells in the 3×3 area centred on (r, c). Returns [row, col] pairs. */
export function getSingleZoneCells(r: number, c: number): [number, number][] {
  const cells: [number, number][] = [];
  for (let i = r - 1; i <= r + 1; i++)
    for (let j = c - 1; j <= c + 1; j++)
      if (i >= 0 && i < ROWS && j >= 0 && j < COLS)
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

// ─── Output formatter ─────────────────────────────────────────────────────────
/**
 * reelStopPositions: 20 elements, index = col*ROWS+row, value 1 or 0.
 * landedCoinsInBonusBoost: [[col, row, value], ...]
 */
export function generateZoneGaffe(grid: ZoneCell[][]): string {
  const rsp: number[]              = Array(TOTAL).fill(0);
  const lc:  (string | number)[][] = [];

  grid.forEach((rowArr, r) => {
    rowArr.forEach((cell, c) => {
      if (cell.type === "EMPTY") return;
      rsp[posIdx(r, c)] = 1;
      lc.push([c, r, cell.value]);   // [col, row, value]
    });
  });

  const parts: string[] = [`reelStopPositions: [${rsp.join(",")}]`];
  if (lc.length > 0)
    parts.push(`landedCoinsInBonusBoost: [${lc.map(e => `[${e.join(",")}]`).join(",")}]`);
  return `[${parts.join(", ")}]`;
}