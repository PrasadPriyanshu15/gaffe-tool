// /* eslint-disable @typescript-eslint/no-explicit-any */

// // ─── Grid constants ───────────────────────────────────────────────────────────
// export const ROWS  = 4;
// export const COLS  = 5;
// export const TOTAL = ROWS * COLS; // 20
// export const MAX_RED_COINS = 12;

// // ─── Color codes (match game engine) ─────────────────────────────────────────
// export const CODE_GOLD    = 9;
// export const CODE_RED     = 4;
// export const CODE_PURPLE  = 14;
// export const CODE_BLUE    = 19;

// // ─── Cell types ───────────────────────────────────────────────────────────────
// export type WheelCell =
//   | { type: "EMPTY" }
//   | { type: "GOLD";    value: string }
//   | { type: "RED";     value: string; multiplier: string }
//   | { type: "UPGRADE"; featureColor: "blue" | "purple" };

// // ─── Option lists ─────────────────────────────────────────────────────────────
// export const COIN_VALUES  = ["1", "2", "5", "10", "25", "50", "100", "Minor", "Major"];
// export const MULTI_VALUES = ["2", "3", "4", "5", "6", "7", "8", "9", "10", "12", "MAJOR", "GRAND"];

// // ─── Position helpers ─────────────────────────────────────────────────────────
// /** Column-major flat index: col × ROWS + row (0-based) */
// export function posIdx(row: number, col: number): number {
//   return col * ROWS + row;
// }

// // ─── Grid factory ─────────────────────────────────────────────────────────────
// export function emptyGrid(): WheelCell[][] {
//   return Array.from({ length: ROWS }, () =>
//     Array.from({ length: COLS }, (): WheelCell => ({ type: "EMPTY" }))
//   );
// }

// /**
//  * Seed initial grid from base-game red SCaT coins.
//  * BaseCoin.position is column-major in the 4×5 base grid.
//  */
// export function seedFromBase(baseCoins: { position: number; value: string }[]): WheelCell[][] {
//   const g = emptyGrid();
//   baseCoins.forEach(({ position, value }) => {
//     const col = Math.floor(position / ROWS);
//     const row = position % ROWS;
//     if (row < ROWS && col < COLS) {
//       g[row][col] = { type: "RED", value, multiplier: "" };
//     }
//   });
//   return g;
// }

// // ─── Gaffe generator ─────────────────────────────────────────────────────────
// /**
//  * Builds one output line for a WHEEL spin.
//  *
//  * reelStopPositions : 20-element array — colorCode at occupied cell, 0 elsewhere
//  * landedCoinsInBonusBoost : [[flatPos, colorCode, value], ...]
//  * multipliers              : 20-element array — multiplier value or 0
//  */
// export function generateWheelGaffe(grid: WheelCell[][]): string {
//   const rsp:  number[]             = Array(TOTAL).fill(0);
//   const lc:   (string | number)[][] = [];
//   const mult: (number | string)[]  = Array(TOTAL).fill(0);

//   grid.forEach((rowArr, r) => {
//     rowArr.forEach((cell, c) => {
//       if (cell.type === "EMPTY" || cell.type === "UPGRADE") return;
//       const idx = posIdx(r, c);

//       if (cell.type === "GOLD") {
//         rsp[idx] = CODE_GOLD;
//         lc.push([idx, CODE_GOLD, cell.value]);
//       }
//       if (cell.type === "RED") {
//         rsp[idx] = CODE_RED;
//         lc.push([idx, CODE_RED, cell.value]);
//         if (cell.multiplier) {
//           mult[idx] = isNaN(Number(cell.multiplier))
//             ? cell.multiplier
//             : Number(cell.multiplier);
//         }
//       }
//     });
//   });

//   const parts: string[] = [`reelStopPositions: [${rsp.join(",")}]`];
//   if (lc.length > 0) {
//     parts.push(`landedCoinsInBonusBoost: [${lc.map(c => `[${c.join(",")}]`).join(",")}]`);
//   }
//   if (mult.some(m => m !== 0)) {
//     parts.push(`multipliers: [${mult.join(",")}]`);
//   }
//   return `[${parts.join(", ")}]`;
// }



/* eslint-disable @typescript-eslint/no-explicit-any */

// ─── Grid constants ───────────────────────────────────────────────────────────
export const ROWS          = 4;
export const COLS          = 5;
export const TOTAL         = ROWS * COLS;   // 20
export const MAX_RED_COINS = 12;
export const MAX_SPINS     = 3;

// ─── Types ────────────────────────────────────────────────────────────────────
export type WheelCell =
  | { type: "EMPTY" }
  | { type: "GOLD";    value: string }
  | { type: "RED";     value: string; multiplier: string }
  | { type: "UPGRADE"; featureColor: "blue" | "purple" };

// ─── Option lists ─────────────────────────────────────────────────────────────
export const COIN_VALUES  = ["1", "2", "5", "10", "25", "50", "100", "Minor", "Major"];
export const MULTI_VALUES = ["2", "3", "4", "5", "6", "7", "8", "9", "10", "12", "MAJOR", "GRAND"];

// ─── Position helpers ─────────────────────────────────────────────────────────
/** Column-major flat index: col*ROWS+row — used for reelStopPositions array. */
export function posIdx(row: number, col: number): number {
  return col * ROWS + row;
}

// ─── Grid factory ─────────────────────────────────────────────────────────────
export function emptyGrid(): WheelCell[][] {
  return Array.from({ length: ROWS }, () =>
    Array.from({ length: COLS }, (): WheelCell => ({ type: "EMPTY" }))
  );
}

/**
 * All base-game red SCaT coins come into this feature as GOLD coins.
 * BaseCoin.position = col*4+row (column-major, 4-row base grid).
 */
export function seedFromBase(baseCoins: { position: number; value: string }[]): WheelCell[][] {
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

// ─── Output formatter ─────────────────────────────────────────────────────────
/**
 * reelStopPositions : 20 elements, index=col*ROWS+row, value 1 or 0.
 * landedCoinsInBonusBoost : [[col, row, value], ...]
 * multipliers             : 20 elements, multiplier value or 0.
 */
export function generateWheelGaffe(grid: WheelCell[][]): string {
  const rsp:  number[]              = Array(TOTAL).fill(0);
  const lc:   (string | number)[][] = [];
  const mult: (number | string)[]   = Array(TOTAL).fill(0);

  grid.forEach((rowArr, r) => {
    rowArr.forEach((cell, c) => {
      if (cell.type === "EMPTY" || cell.type === "UPGRADE") return;
      const idx = posIdx(r, c);
      rsp[idx] = 1;

      if (cell.type === "GOLD") {
        lc.push([c, r, cell.value]);
      }
      if (cell.type === "RED") {
        lc.push([c, r, cell.value]);
        if (cell.multiplier) {
          mult[idx] = isNaN(Number(cell.multiplier)) ? cell.multiplier : Number(cell.multiplier);
        }
      }
    });
  });

  const parts: string[] = [`reelStopPositions: [${rsp.join(",")}]`];
  if (lc.length > 0)
    parts.push(`landedCoinsInBonusBoost: [${lc.map(e => `[${e.join(",")}]`).join(",")}]`);
  if (mult.some(m => m !== 0))
    parts.push(`multipliers: [${mult.join(",")}]`);
  return `[${parts.join(", ")}]`;
}