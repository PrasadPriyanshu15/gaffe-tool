// /* eslint-disable @typescript-eslint/no-explicit-any */

// // ─── Grid constants ───────────────────────────────────────────────────────────
// export const ROWS_TOTAL    = 12;   // full tower height
// export const COLS          = 5;
// export const ROWS_LOCKED   = 8;    // top 8 rows start locked (indices 0–7)
// export const ROWS_INIT     = 4;    // bottom 4 rows always unlocked (indices 8–11)
// export const TOTAL         = ROWS_TOTAL * COLS;  // 60

// export const MAX_BLUE      = 8;
// export const COINS_PER_ROW = 6;    // every 6 total coins on grid unlocks 1 more row upward

// export const CODE_GOLD     = 9;
// export const CODE_BLUE     = 19;

// // ─── Cell types ───────────────────────────────────────────────────────────────
// export type TowerCell =
//   | { type: "EMPTY" }
//   | { type: "GOLD"; value: string }
//   | { type: "BLUE"; value: string };

// // ─── Option lists ─────────────────────────────────────────────────────────────
// export const COIN_VALUES = ["1", "2", "5", "10", "25", "50", "100", "Minor", "Major"];

// // ─── Position helpers ─────────────────────────────────────────────────────────
// /**
//  * Column-major flat index: col × ROWS_TOTAL + row  (0-based).
//  * Matches the position table in the spec image.
//  * pos=0 → top-left (row 0, col 0), pos=11 → bottom of col 0, pos=12 → top of col 1.
//  */
// export function posIdx(row: number, col: number): number {
//   return col * ROWS_TOTAL + row;
// }

// // ─── Unlock helpers ───────────────────────────────────────────────────────────
// /**
//  * Given the number of coins currently on the grid, how many extra rows
//  * (beyond the initial 4) have been unlocked.
//  */
// export function extraUnlockedRows(totalCoins: number): number {
//   return Math.min(ROWS_LOCKED, Math.floor(totalCoins / COINS_PER_ROW));
// }

// /** The 0-based row index of the topmost unlocked row. */
// export function firstUnlockedRow(totalCoins: number): number {
//   return ROWS_LOCKED - extraUnlockedRows(totalCoins);
// }

// /**
//  * Hint object for the UI:
//  *   coinsToNext  = how many more coins are needed to unlock the next row
//  *   nextRowLabel = "row N" label from the bottom (as shown in the image)
//  */
// export function unlockHint(totalCoins: number): { coinsToNext: number; nextRowLabel: string } | null {
//   const extra = extraUnlockedRows(totalCoins);
//   if (extra >= ROWS_LOCKED) return null; // all rows unlocked
//   const nextThreshold = (extra + 1) * COINS_PER_ROW;
//   const coinsToNext   = nextThreshold - totalCoins;
//   // "row N from the bottom" — bottom row is row 1; row 5 = 1st locked row initially
//   const nextRowLabel  = `row ${ROWS_INIT + extra + 1}`;
//   return { coinsToNext, nextRowLabel };
// }

// // ─── Grid factory ─────────────────────────────────────────────────────────────
// export function emptyGrid(): TowerCell[][] {
//   return Array.from({ length: ROWS_TOTAL }, () =>
//     Array.from({ length: COLS }, (): TowerCell => ({ type: "EMPTY" }))
//   );
// }

// /**
//  * Seed initial grid from base-game blue-SCAT coins → GOLD coins.
//  *
//  * BaseCoin positions are in the 4-row base grid (col×4+row).
//  * These map into the tower's initial 4×5 section (rows 8–11):
//  *   base_col = floor(pos / 4),  base_row = pos % 4
//  *   tower_row = base_row + ROWS_INIT_OFFSET = base_row + 8
//  */
// export function seedFromBase(baseCoins: { position: number; value: string }[]): TowerCell[][] {
//   const g = emptyGrid();
//   baseCoins.forEach(({ position, value }) => {
//     const col         = Math.floor(position / 4);   // base grid is 4 rows
//     const baseRow     = position % 4;
//     const towerRow    = baseRow + ROWS_INIT;        // offset into tower rows 8–11
//     if (col < COLS && towerRow < ROWS_TOTAL) {
//       g[towerRow][col] = { type: "GOLD", value };
//     }
//   });
//   return g;
// }

// // ─── Total coins helper ───────────────────────────────────────────────────────
// export function countCoins(grid: TowerCell[][]): number {
//   return grid.flat().filter(c => c.type !== "EMPTY").length;
// }

// export function countBlue(grid: TowerCell[][]): number {
//   return grid.flat().filter(c => c.type === "BLUE").length;
// }

// // ─── Gaffe generator ─────────────────────────────────────────────────────────
// /**
//  * One output line for a TOWER spin.
//  *
//  * reelStopPositions        : 60-element array — colorCode or 0
//  * landedCoinsInBonusBoost  : [[flatPos, colorCode, value], ...]
//  */
// export function generateTowerGaffe(grid: TowerCell[][]): string {
//   const rsp: number[]               = Array(TOTAL).fill(0);
//   const lc:  (string | number)[][]  = [];

//   grid.forEach((rowArr, r) => {
//     rowArr.forEach((cell, c) => {
//       if (cell.type === "EMPTY") return;
//       const idx = posIdx(r, c);
//       if (cell.type === "GOLD") {
//         rsp[idx] = CODE_GOLD;
//         lc.push([idx, CODE_GOLD, cell.value]);
//       }
//       if (cell.type === "BLUE") {
//         rsp[idx] = CODE_BLUE;
//         lc.push([idx, CODE_BLUE, cell.value]);
//       }
//     });
//   });

//   const parts: string[] = [`reelStopPositions: [${rsp.join(",")}]`];
//   if (lc.length > 0) {
//     parts.push(`landedCoinsInBonusBoost: [${lc.map(c => `[${c.join(",")}]`).join(",")}]`);
//   }
//   return `[${parts.join(", ")}]`;
// }



//! working but position error and loked position no colored scat
/* eslint-disable @typescript-eslint/no-explicit-any */

// // ─── Grid constants ───────────────────────────────────────────────────────────
// export const ROWS_TOTAL  = 12;    // full tower height
// export const COLS        = 5;
// export const ROWS_LOCKED = 8;     // rows 0-7 start locked
// export const ROWS_INIT   = 4;     // rows 8-11 always unlocked (initial 4×5)
// export const TOTAL       = ROWS_TOTAL * COLS;  // 60

// export const MAX_BLUE      = 8;
// export const COINS_PER_ROW = 6;   // every 6 unlocked-row coins unlocks 1 more row upward
// export const MAX_SPINS     = 3;

// // ─── Types ────────────────────────────────────────────────────────────────────
// export type TowerCell =
//   | { type: "EMPTY" }
//   | { type: "GOLD";    value: string }
//   | { type: "BLUE";    value: string }
//   | { type: "UPGRADE"; featureColor: "red" | "purple" };

// // ─── Option lists ─────────────────────────────────────────────────────────────
// export const COIN_VALUES = ["1", "2", "5", "10", "25", "50", "100", "Minor", "Major"];

// // ─── Position helpers ─────────────────────────────────────────────────────────
// /**
//  * Column-major flat index for 60-element reelStopPositions array.
//  * index = col * ROWS_TOTAL + row  (row 0 = top-locked, row 11 = bottom-unlocked)
//  */
// export function posIdx(row: number, col: number): number {
//   return col * ROWS_TOTAL + row;
// }

// // ─── Unlock helpers ───────────────────────────────────────────────────────────
// /** How many extra locked rows have been unlocked upward. */
// export function extraUnlockedRows(unlockedCoinCount: number): number {
//   return Math.min(ROWS_LOCKED, Math.floor(unlockedCoinCount / COINS_PER_ROW));
// }

// /** 0-based index of the topmost currently-unlocked row. */
// export function firstUnlockedRow(unlockedCoinCount: number): number {
//   return ROWS_LOCKED - extraUnlockedRows(unlockedCoinCount);
// }

// /** Hint: coins needed to unlock the next row, and which row that is. */
// export function unlockHint(unlockedCoinCount: number): { coinsToNext: number; label: string } | null {
//   const extra = extraUnlockedRows(unlockedCoinCount);
//   if (extra >= ROWS_LOCKED) return null;
//   const coinsToNext = (extra + 1) * COINS_PER_ROW - unlockedCoinCount;
//   return { coinsToNext, label: `row ${ROWS_INIT + extra + 1}` };
// }

// // ─── Grid factory ─────────────────────────────────────────────────────────────
// export function emptyGrid(): TowerCell[][] {
//   return Array.from({ length: ROWS_TOTAL }, () =>
//     Array.from({ length: COLS }, (): TowerCell => ({ type: "EMPTY" }))
//   );
// }

// /**
//  * All base-game blue SCaT coins come into this feature as GOLD coins,
//  * placed in the initial (bottom) 4-row section (rows 8–11).
//  * BaseCoin.position = col*4+row (column-major, 4-row base grid).
//  */
// export function seedFromBase(baseCoins: { position: number; value: string }[]): TowerCell[][] {
//   const g = emptyGrid();
//   baseCoins.forEach(({ position, value }) => {
//     const col       = Math.floor(position / 4);
//     const baseRow   = position % 4;
//     const towerRow  = baseRow + ROWS_INIT;   // 0-3 → 8-11
//     if (col < COLS && towerRow < ROWS_TOTAL) {
//       g[towerRow][col] = { type: "GOLD", value };
//     }
//   });
//   return g;
// }

// // ─── Coin counters ────────────────────────────────────────────────────────────
// /** Count coins in unlocked rows only (used for row-unlock progress). */
// export function countUnlockedCoins(grid: TowerCell[][], firstUnlocked: number): number {
//   let n = 0;
//   grid.forEach((rowArr, r) => {
//     if (r >= firstUnlocked) rowArr.forEach(cell => { if (cell.type !== "EMPTY") n++; });
//   });
//   return n;
// }

// export function countBlue(grid: TowerCell[][]): number {
//   return grid.flat().filter(c => c.type === "BLUE").length;
// }

// // ─── Output formatter ─────────────────────────────────────────────────────────
// /**
//  * reelStopPositions        : 60 elements, index=col*12+row, value 1 or 0.
//  * landedCoinsInBonusBoost  : [[col, row, value], ...] — all coin types incl. locked rows.
//  */
// export function generateTowerGaffe(grid: TowerCell[][]): string {
//   const rsp: number[]               = Array(TOTAL).fill(0);
//   const lc:  (string | number)[][]  = [];

//   grid.forEach((rowArr, r) => {
//     rowArr.forEach((cell, c) => {
//       if (cell.type === "EMPTY" || cell.type === "UPGRADE") return;
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

export const ROWS_TOTAL  = 12;
export const COLS        = 5;
export const ROWS_LOCKED = 8;    // rows 0-7 start locked (top)
export const ROWS_INIT   = 4;    // rows 8-11 always unlocked (bottom, base game section)
export const TOTAL       = ROWS_TOTAL * COLS;  // 60

export const MAX_BLUE      = 8;
export const COINS_PER_ROW = 6;  // every 6 unlocked-row coins unlocks 1 more row upward
export const MAX_SPINS     = 3;

// ─── Types ────────────────────────────────────────────────────────────────────
export type TowerCell =
  | { type: "EMPTY" }
  | { type: "GOLD";    value: string }
  | { type: "BLUE";    value: string }
  | { type: "UPGRADE"; featureColor: "red" | "purple" };

export const COIN_VALUES = ["1", "2", "5", "10", "25", "50", "100", "Minor", "Major"];

// ─── Position helper ──────────────────────────────────────────────────────────
/** Column-major flat index: col × ROWS_TOTAL + row */
export function posIdx(row: number, col: number): number {
  return col * ROWS_TOTAL + row;
}

// ─── Unlock helpers ───────────────────────────────────────────────────────────
export function extraUnlockedRows(unlockedCoinCount: number): number {
  return Math.min(ROWS_LOCKED, Math.floor(unlockedCoinCount / COINS_PER_ROW));
}

/** 0-based index of the topmost currently-unlocked row. */
export function firstUnlockedRow(unlockedCoinCount: number): number {
  return ROWS_LOCKED - extraUnlockedRows(unlockedCoinCount);
}

export function unlockHint(unlockedCoinCount: number): { coinsToNext: number; label: string } | null {
  const extra = extraUnlockedRows(unlockedCoinCount);
  if (extra >= ROWS_LOCKED) return null;
  const coinsToNext = (extra + 1) * COINS_PER_ROW - unlockedCoinCount;
  return { coinsToNext, label: `row ${ROWS_INIT + extra + 1}` };
}

// ─── Grid factory ─────────────────────────────────────────────────────────────
export function emptyGrid(): TowerCell[][] {
  return Array.from({ length: ROWS_TOTAL }, () =>
    Array.from({ length: COLS }, (): TowerCell => ({ type: "EMPTY" }))
  );
}

/**
 * FIXED: base row 0-3 maps to tower row ROWS_LOCKED+0 .. ROWS_LOCKED+3 (rows 8-11).
 *
 * Previous bug: used `baseRow + ROWS_INIT` (= +4) which placed coins at rows 4-7
 * (locked section). Correct offset is `baseRow + ROWS_LOCKED` (= +8).
 *
 * Example: base position 19 → col=4, baseRow=3 → towerRow = 3+8 = 11 (bottom row) ✓
 */
export function seedFromBase(baseCoins: { position: number; value: string }[]): TowerCell[][] {
  const g = emptyGrid();
  baseCoins.forEach(({ position, value }) => {
    const col      = Math.floor(position / ROWS_INIT);   // base grid has ROWS_INIT=4 rows
    const baseRow  = position % ROWS_INIT;
    const towerRow = baseRow + ROWS_LOCKED;              // ← FIXED: was + ROWS_INIT
    if (col < COLS && towerRow < ROWS_TOTAL) {
      g[towerRow][col] = { type: "GOLD", value };
    }
  });
  return g;
}

// ─── Counters ─────────────────────────────────────────────────────────────────
/** Coins in unlocked rows only — used for row-unlock progress. */
export function countUnlockedCoins(grid: TowerCell[][], fUnlocked: number): number {
  let n = 0;
  grid.forEach((rowArr, r) => {
    if (r >= fUnlocked) rowArr.forEach(cell => { if (cell.type !== "EMPTY") n++; });
  });
  return n;
}

export function countBlue(grid: TowerCell[][]): number {
  return grid.flat().filter(c => c.type === "BLUE").length;
}

// ─── Output formatter ─────────────────────────────────────────────────────────
/**
 * reelStopPositions       : 60 elements (1 where coin, 0 elsewhere)
 * landedCoinsInBonusBoost : [[col, row, value], ...] — ALL coins including locked rows
 */
export function generateTowerGaffe(grid: TowerCell[][]): string {
  const rsp: number[]              = Array(TOTAL).fill(0);
  const lc:  (string | number)[][] = [];

  grid.forEach((rowArr, r) => {
    rowArr.forEach((cell, c) => {
      if (cell.type === "EMPTY" || cell.type === "UPGRADE") return;
      rsp[posIdx(r, c)] = 1;
      lc.push([c, r, cell.value]);
    });
  });

  const parts: string[] = [`reelStopPositions: [${rsp.join(",")}]`];
  if (lc.length > 0)
    parts.push(`landedCoinsInBonusBoost: [${lc.map(e => `[${e.join(",")}]`).join(",")}]`);
  return `[${parts.join(", ")}]`;
}