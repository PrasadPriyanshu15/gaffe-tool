/* eslint-disable @typescript-eslint/no-explicit-any */
// /* eslint-disable @typescript-eslint/no-explicit-any */
// // handlers/towerHandlers.ts
// // Pure functions for TOWER feature click logic, position indexing, and result output.
// // No React imports — all functions are stateless and fully reusable.

// import type { Cell, Grid } from "../featureTypes";
// import {
//   TOWER_TOTAL_ROWS,
//   TOWER_BASE_ROWS,
//   MAX_BLUE_COINS,
//   isRowUnlocked,
//   getBlueInRow,
//   getTotalBlue,
// } from "../tower/towerLogic";

// // ─── Position indexing ────────────────────────────────────────────────────────

// /**
//  * Converts (gridRow, col) to the flat reelStopPositions index for TOWER mode.
//  *
//  * Position spec: (col, posRow) → position = col * ROWS + posRow + 1
//  *   where posRow goes 0 → ROWS-1 within each column.
//  *
//  * Grid storage layout:
//  *   grid rows 0–3    = base game rows (unlocked, displayed at bottom of screen)
//  *   grid rows 4–11   = locked tower rows (displayed above base game)
//  *
//  * Mapping base game (last position = position 60 = col4, posRow 11):
//  *   grid row 0 → posRow 8      (formula: (i + ROWS - BASE) % ROWS = (i+8)%12)
//  *   grid row 3 → posRow 11     → col 4, posRow 11 → position 60 ✓
//  *   grid row 4 → posRow 0      (first locked row just above separator → pos 1)
//  *   grid row 11→ posRow 7      (top locked row → pos 8 in col 0)
//  */
// export function towerReelIdx(gridRow: number, col: number, ROWS: number): number {
//   const posRow = (gridRow + ROWS - TOWER_BASE_ROWS) % ROWS;
//   return col * ROWS + posRow;
// }

// // ─── Click transitions ────────────────────────────────────────────────────────

// type TowerGoldParams = {
//   row:          number;
//   grid:         Grid;
//   unlockedRows: boolean[];
//   isWheel:      boolean;
//   isZone:       boolean;
//   redCount:     number;
//   triggerExists:boolean;
//   maxRed:       number;
// };

// /**
//  * GOLD → BLUE | RED | PURPLE | TRIGGER | EMPTY transition for TOWER.
//  * Returns:
//  *   - cell:        the new cell value
//  *   - addZone:     true if a zone should be created at (row, col)
//  */
// export function towerGoldNext(p: TowerGoldParams): { cell: Cell; addZone: boolean } {
//   const rowLocked  = !isRowUnlocked(p.unlockedRows, p.row);
//   const blueInRow  = getBlueInRow(p.grid, p.row);
//   const totalBlue  = getTotalBlue(p.grid);
//   const canAddBlue = totalBlue < MAX_BLUE_COINS && (rowLocked ? blueInRow === 0 : true);

//   if (canAddBlue) {
//     return { cell: { type: "BLUE", value: 100 }, addZone: false };
//   }
//   if (!rowLocked && p.isWheel && p.redCount < p.maxRed) {
//     return { cell: { type: "RED" }, addZone: false };
//   }
//   if (!rowLocked && p.isZone) {
//     return { cell: { type: "PURPLE", value: 100 }, addZone: true };
//   }
//   if (!rowLocked && !p.triggerExists) {
//     return { cell: { type: "TRIGGER", triggerColor: "BLUE" }, addZone: false };
//   }
//   return { cell: { type: "EMPTY" }, addZone: false };
// }

// type TowerBlueParams = {
//   row:          number;
//   unlockedRows: boolean[];
//   isWheel:      boolean;
//   isZone:       boolean;
//   redCount:     number;
//   triggerExists:boolean;
//   maxRed:       number;
// };

// /**
//  * BLUE → RED | PURPLE | TRIGGER | EMPTY transition for TOWER.
//  */
// export function towerBlueNext(p: TowerBlueParams): { cell: Cell; addZone: boolean } {
//   const rowLocked = !isRowUnlocked(p.unlockedRows, p.row);

//   if (!rowLocked && p.isWheel && p.redCount < p.maxRed) {
//     return { cell: { type: "RED" }, addZone: false };
//   }
//   if (!rowLocked && p.isZone) {
//     return { cell: { type: "PURPLE", value: 100 }, addZone: true };
//   }
//   if (!p.triggerExists) {
//     return { cell: { type: "TRIGGER", triggerColor: "BLUE" }, addZone: false };
//   }
//   return { cell: { type: "EMPTY" }, addZone: false };
// }

// // ─── Result builder ───────────────────────────────────────────────────────────

// /**
//  * Builds the TOWER-specific result lines: reelStopPositions (60-slot array)
//  * and blueCoins. Also returns goldCoin entries using tower position coordinates.
//  *
//  * Note: coin coordinates [col, posRow, value] use the tower position row
//  * (same mapping as towerReelIdx) so they match the position numbering.
//  */
// export function buildTowerResultLines(
//   grid: Grid,
//   ROWS: number,
//   COLS: number
// ): { reelStopLine: string; goldCoinLine: string; blueCoinsLine: string } {
//   const reelStop  = Array(ROWS * COLS).fill(0);
//   const goldCoin: any[] = [];
//   const blueCoin: any[] = [];

//   grid.forEach((row, i) => {
//     row.forEach((cell, j) => {
//       const posRow = (i + ROWS - TOWER_BASE_ROWS) % ROWS;
//       const idx    = towerReelIdx(i, j, ROWS);

//       if (cell.type !== "EMPTY") reelStop[idx] = 1;
//       if (cell.type === "GOLD")  goldCoin.push([j, posRow, cell.value ?? 0]);
//       if (cell.type === "BLUE")  blueCoin.push([j, posRow, cell.value ?? 0]);
//     });
//   });

//   const fmt = (arr: any[][]) => arr.map(c => `[${c.join(",")}]`).join(",");
//   return {
//     reelStopLine:  `reelStopPositions:[${reelStop.join(",")}]`,
//     goldCoinLine:  `goldCoin:[${fmt(goldCoin)}]`,
//     blueCoinsLine: `blueCoins:[${fmt(blueCoin)}]`,
//   };
// }



// handlers/towerHandlers.ts
// Pure functions for TOWER feature click logic, position indexing, and result output.
// No React imports — all functions are stateless and fully reusable.

import type { Cell, Grid } from "../featureTypes";
import {
  TOWER_TOTAL_ROWS,
  TOWER_BASE_ROWS,
  MAX_BLUE_COINS,
  isRowUnlocked,
  getBlueInRow,
  getTotalBlue,
} from "../../features/tower/towerLogic";

// ─── Position indexing ────────────────────────────────────────────────────────

/**
 * Converts (gridRow, col) to the flat reelStopPositions index for TOWER mode.
 *
 * Position spec: (col, posRow) → position = col * ROWS + posRow + 1
 *   where posRow goes 0 → ROWS-1 within each column.
 *
 * Grid storage layout:
 *   grid rows 0–3    = base game rows (unlocked, displayed at bottom of screen)
 *   grid rows 4–11   = locked tower rows (displayed above base game)
 *
 * Mapping base game (last position = position 60 = col4, posRow 11):
 *   grid row 0 → posRow 8      (formula: (i + ROWS - BASE) % ROWS = (i+8)%12)
 *   grid row 3 → posRow 11     → col 4, posRow 11 → position 60 ✓
 *   grid row 4 → posRow 0      (first locked row just above separator → pos 1)
 *   grid row 11→ posRow 7      (top locked row → pos 8 in col 0)
 */
/**
 * posRow mapping (positions count top-to-bottom, position 1 = top):
 *
 *   Locked rows  (gridRow 4–11, displayed at top of screen):
 *     gridRow 11 → posRow 0   (topmost → position 1 in col 0)
 *     gridRow 4  → posRow 7
 *     formula: posRow = ROWS - 1 - gridRow
 *
 *   Base rows  (gridRow 0–3, displayed at bottom of screen):
 *     gridRow 0  → posRow 8
 *     gridRow 3  → posRow 11  (bottommost → position 60 in col 4)
 *     formula: posRow = gridRow + (ROWS - TOWER_BASE_ROWS)
 */
export function towerReelIdx(gridRow: number, col: number, ROWS: number): number {
  const posRow = gridRow < TOWER_BASE_ROWS
    ? gridRow + (ROWS - TOWER_BASE_ROWS)   // base rows:   0→8, 1→9, 2→10, 3→11
    : ROWS - 1 - gridRow;                  // locked rows: 11→0, 10→1, …, 4→7
  return col * ROWS + posRow;
}

// ─── Click transitions ────────────────────────────────────────────────────────

type TowerGoldParams = {
  row:          number;
  grid:         Grid;
  unlockedRows: boolean[];
  isWheel:      boolean;
  isZone:       boolean;
  redCount:     number;
  triggerExists:boolean;
  maxRed:       number;
};

/**
 * GOLD → BLUE | RED | PURPLE | TRIGGER | EMPTY transition for TOWER.
 * Returns:
 *   - cell:        the new cell value
 *   - addZone:     true if a zone should be created at (row, col)
 */
export function towerGoldNext(p: TowerGoldParams): { cell: Cell; addZone: boolean } {
  const rowLocked  = !isRowUnlocked(p.unlockedRows, p.row);
  const blueInRow  = getBlueInRow(p.grid, p.row);
  const totalBlue  = getTotalBlue(p.grid);
  const canAddBlue = totalBlue < MAX_BLUE_COINS && (rowLocked ? blueInRow === 0 : true);

  if (canAddBlue) {
    return { cell: { type: "BLUE", value: 100 }, addZone: false };
  }
  if (!rowLocked && p.isWheel && p.redCount < p.maxRed) {
    return { cell: { type: "RED" }, addZone: false };
  }
  if (!rowLocked && p.isZone) {
    return { cell: { type: "PURPLE", value: 100 }, addZone: true };
  }
  if (!rowLocked && !p.triggerExists) {
    return { cell: { type: "TRIGGER", triggerColor: "BLUE" }, addZone: false };
  }
  return { cell: { type: "EMPTY" }, addZone: false };
}

type TowerBlueParams = {
  row:          number;
  unlockedRows: boolean[];
  isWheel:      boolean;
  isZone:       boolean;
  redCount:     number;
  triggerExists:boolean;
  maxRed:       number;
};

/**
 * BLUE → RED | PURPLE | TRIGGER | EMPTY transition for TOWER.
 */
export function towerBlueNext(p: TowerBlueParams): { cell: Cell; addZone: boolean } {
  const rowLocked = !isRowUnlocked(p.unlockedRows, p.row);

  if (!rowLocked && p.isWheel && p.redCount < p.maxRed) {
    return { cell: { type: "RED" }, addZone: false };
  }
  if (!rowLocked && p.isZone) {
    return { cell: { type: "PURPLE", value: 100 }, addZone: true };
  }
  if (!p.triggerExists) {
    return { cell: { type: "TRIGGER", triggerColor: "BLUE" }, addZone: false };
  }
  return { cell: { type: "EMPTY" }, addZone: false };
}

// ─── Result builder ───────────────────────────────────────────────────────────

/**
 * Builds the TOWER-specific result lines: reelStopPositions (60-slot array)
 * and blueCoins. Also returns goldCoin entries using tower position coordinates.
 *
 * Note: coin coordinates [col, posRow, value] use the tower position row
 * (same mapping as towerReelIdx) so they match the position numbering.
 */
export function buildTowerResultLines(
  grid: Grid,
  ROWS: number,
  COLS: number
): { reelStopLine: string; goldCoinLine: string; blueCoinsLine: string } {
  const reelStop  = Array(ROWS * COLS).fill(0);
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const goldCoin: any[] = [];
  const blueCoin: any[] = [];

  grid.forEach((row, i) => {
    row.forEach((cell, j) => {
      const posRow = (i + ROWS - TOWER_BASE_ROWS) % ROWS;
      const idx    = towerReelIdx(i, j, ROWS);

      if (cell.type !== "EMPTY") reelStop[idx] = 1;
      if (cell.type === "GOLD")  goldCoin.push([j, posRow, cell.value ?? 0]);
      if (cell.type === "BLUE")  blueCoin.push([j, posRow, cell.value ?? 0]);
    });
  });

  const fmt = (arr: any[][]) => arr.map(c => `[${c.join(",")}]`).join(",");
  return {
    reelStopLine:  `reelStopPositions:[${reelStop.join(",")}]`,
    goldCoinLine:  `goldCoin:[${fmt(goldCoin)}]`,
    blueCoinsLine: `blueCoins:[${fmt(blueCoin)}]`,
  };
}