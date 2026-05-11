

// // zoneLogic.ts — Pure utility functions for ZONE feature

// type MultiplierType = number | "MAJOR" | "GRAND";

// export type Cell =
//   | { type: "EMPTY" }
//   | { type: "GOLD"; value?: number; locked?: boolean }
//   | { type: "RED"; value?: number; multiplier?: MultiplierType }
//   | { type: "PURPLE" }
//   | { type: "TRIGGER"; triggerColor?: "BLUE" | "PURPLE" };

// export type Zone = {
//   id: string;
//   /** All purple coin positions that anchor this zone */
//   anchors: [number, number][];
//   /** All cells covered by this zone (union of 3x3s around each anchor) */
//   cells: [number, number][];
//   /** Remaining spins before zone disappears (resets to 3 on absorption) */
//   charges: number;
// };

// // ─── Cell helpers ────────────────────────────────────────────────────────────

// /** Returns all valid grid cells in the 3x3 area around (r, c) */
// export function getSingleZoneCells(
//   r: number,
//   c: number,
//   rows: number,
//   cols: number
// ): [number, number][] {
//   const cells: [number, number][] = [];
//   for (let i = r - 1; i <= r + 1; i++) {
//     for (let j = c - 1; j <= c + 1; j++) {
//       if (i >= 0 && i < rows && j >= 0 && j < cols) {
//         cells.push([i, j]);
//       }
//     }
//   }
//   return cells;
// }

// /** Returns union of 3x3 cells for all anchors */
// export function getUnionCells(
//   anchors: [number, number][],
//   rows: number,
//   cols: number
// ): [number, number][] {
//   const cellSet = new Set<string>();
//   anchors.forEach(([r, c]) => {
//     getSingleZoneCells(r, c, rows, cols).forEach(([ri, ci]) =>
//       cellSet.add(`${ri},${ci}`)
//     );
//   });
//   return Array.from(cellSet).map((s) => s.split(",").map(Number) as [number, number]);
// }

// // ─── Merge logic ─────────────────────────────────────────────────────────────

// /**
//  * Returns true if any two cells (one from each set) are the SAME cell (overlap)
//  * or edge-adjacent (Manhattan distance == 1).
//  * Corner-touch (diagonal, Manhattan distance == 2 with |dr|=|dc|=1) is excluded.
//  */
// export function zonesTouch(
//   cells1: [number, number][],
//   cells2: [number, number][]
// ): boolean {
//   for (const [r1, c1] of cells1) {
//     for (const [r2, c2] of cells2) {
//       const manhattan = Math.abs(r1 - r2) + Math.abs(c1 - c2);
//       if (manhattan <= 1) return true; // 0 = same cell, 1 = edge-adjacent
//     }
//   }
//   return false;
// }

// /**
//  * Union-find style merge: repeatedly merges any zones that overlap or edge-touch
//  * until no further merges are possible. Charges reset to 3 on any merge.
//  */
// export function mergeAllTouchingZones(
//   zones: Zone[],
//   rows: number,
//   cols: number
// ): Zone[] {
//   const merged = new Array(zones.length).fill(false);
//   const result: Zone[] = [];

//   for (let i = 0; i < zones.length; i++) {
//     if (merged[i]) continue;

//     let current = zones[i];
//     let changed = true;

//     while (changed) {
//       changed = false;
//       for (let j = 0; j < zones.length; j++) {
//         if (i === j || merged[j]) continue;
//         if (zonesTouch(current.cells, zones[j].cells)) {
//           const newAnchors = [...current.anchors, ...zones[j].anchors];
//           current = {
//             id: current.id,
//             anchors: newAnchors,
//             cells: getUnionCells(newAnchors, rows, cols),
//             charges: 3, // reset charges when zones merge
//           };
//           merged[j] = true;
//           changed = true;
//         }
//       }
//     }

//     result.push(current);
//   }

//   return result;
// }

// // ─── Spin processing ─────────────────────────────────────────────────────────

// /**
//  * Called on each Spin press.
//  * - Any non-anchor, non-EMPTY cell inside a zone is absorbed (set to EMPTY).
//  * - If something was absorbed → charges reset to 3.
//  * - If nothing absorbed → charges decrement by 1.
//  * - Zones that reach 0 charges are removed (their purple anchor coins stay on grid).
//  */
// export function processZoneOnSpin(
//   grid: Cell[][],
//   zones: Zone[]
// ): { grid: Cell[][]; zones: Zone[] } {
//   // Deep copy grid to avoid mutating state
//   const newGrid: Cell[][] = grid.map((row) => row.map((cell) => ({ ...cell })));

//   const updatedZones: Zone[] = zones
//     .map((zone) => {
//       let absorbed = false;

//       zone.cells.forEach(([r, c]) => {
//         const cell = newGrid[r][c];
//         const isAnchor = zone.anchors.some(([ar, ac]) => ar === r && ac === c);

//         // Absorb anything that is NOT the purple anchor and NOT empty
//         if (!isAnchor && cell.type !== "EMPTY") {
//           newGrid[r][c] = { type: "EMPTY" };
//           absorbed = true;
//         }
//       });

//       const newCharges = absorbed ? 3 : zone.charges - 1;
//       return { ...zone, charges: newCharges };
//     })
//     .filter((zone) => zone.charges > 0);
//   // Zones with 0 charges disappear; their PURPLE cells remain on the grid untouched.

//   return { grid: newGrid, zones: updatedZones };
// }





// zoneLogic.ts — Pure utility functions for the ZONE feature.
// No React imports — fully portable to any game that needs a zone mechanic.

type MultiplierType = number | "MAJOR" | "GRAND";

export type Cell =
  | { type: "EMPTY" }
  | { type: "GOLD";    value?: number; locked?: boolean }
  | { type: "RED";     value?: number; multiplier?: MultiplierType }
  | { type: "BLUE";    value?: number }
  | { type: "PURPLE";  value?: number }
  | { type: "TRIGGER"; triggerColor?: "BLUE" | "PURPLE" };

export type Zone = {
  id: string;
  /** Purple coin positions that anchor this zone */
  anchors: [number, number][];
  /** Union of all 3×3 areas around each anchor */
  cells: [number, number][];
  /**
   * Spins remaining before this zone expires.
   * Resets to 3 ONLY when a new purple coin is placed (creating or merging zones).
   * Absorption of other coins does NOT reset charges.
   */
  charges: number;
};

// ─── Cell helpers ─────────────────────────────────────────────────────────────

/** All valid cells in the 3×3 area centred on (r, c). */
export function getSingleZoneCells(
  r: number, c: number, rows: number, cols: number
): [number, number][] {
  const cells: [number, number][] = [];
  for (let i = r - 1; i <= r + 1; i++)
    for (let j = c - 1; j <= c + 1; j++)
      if (i >= 0 && i < rows && j >= 0 && j < cols)
        cells.push([i, j]);
  return cells;
}

/** Union of 3×3 areas for every anchor in a merged zone. */
export function getUnionCells(
  anchors: [number, number][], rows: number, cols: number
): [number, number][] {
  const set = new Set<string>();
  anchors.forEach(([r, c]) =>
    getSingleZoneCells(r, c, rows, cols).forEach(([ri, ci]) => set.add(`${ri},${ci}`))
  );
  return Array.from(set).map(s => s.split(",").map(Number) as [number, number]);
}

// ─── Merge logic ──────────────────────────────────────────────────────────────

/**
 * Two zones touch if any cell from one is identical to or edge-adjacent
 * (Manhattan ≤ 1) to any cell from the other.
 * Diagonal/corner adjacency (Manhattan == 2, |dr|==|dc|==1) is excluded.
 */
export function zonesTouch(
  cells1: [number, number][], cells2: [number, number][]
): boolean {
  for (const [r1, c1] of cells1)
    for (const [r2, c2] of cells2)
      if (Math.abs(r1 - r2) + Math.abs(c1 - c2) <= 1) return true;
  return false;
}

/**
 * Union-find merge: repeatedly merges any zones that overlap or edge-touch
 * until stable. Charges reset to 3 on merge because a new purple coin caused it.
 */
export function mergeAllTouchingZones(zones: Zone[], rows: number, cols: number): Zone[] {
  const merged = new Array(zones.length).fill(false);
  const result: Zone[] = [];

  for (let i = 0; i < zones.length; i++) {
    if (merged[i]) continue;
    let current = zones[i];
    let changed = true;

    while (changed) {
      changed = false;
      for (let j = 0; j < zones.length; j++) {
        if (i === j || merged[j]) continue;
        if (zonesTouch(current.cells, zones[j].cells)) {
          const newAnchors = [...current.anchors, ...zones[j].anchors];
          current = {
            id: current.id,
            anchors: newAnchors,
            cells: getUnionCells(newAnchors, rows, cols),
            charges: 3,
          };
          merged[j] = true;
          changed = true;
        }
      }
    }
    result.push(current);
  }
  return result;
}

// ─── Spin processing ──────────────────────────────────────────────────────────

/**
 * Called on every Spin press.
 * - Absorbs (removes) every non-anchor, non-EMPTY cell inside each zone.
 * - Charges ALWAYS decrement by 1 — absorption does NOT reset them.
 * - Zones reaching 0 are removed; their purple anchor coins stay on the grid.
 */
export function processZoneOnSpin(
  grid: Cell[][], zones: Zone[]
): { grid: Cell[][]; zones: Zone[] } {
  const newGrid: Cell[][] = grid.map(row => row.map(cell => ({ ...cell })));

  const updatedZones = zones
    .map(zone => {
      zone.cells.forEach(([r, c]) => {
        const isAnchor = zone.anchors.some(([ar, ac]) => ar === r && ac === c);
        if (!isAnchor && newGrid[r][c].type !== "EMPTY") {
          newGrid[r][c] = { type: "EMPTY" };
        }
      });
      return { ...zone, charges: zone.charges - 1 }; // always decrement
    })
    .filter(z => z.charges > 0);

  return { grid: newGrid, zones: updatedZones };
}