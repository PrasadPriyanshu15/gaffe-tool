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




//! working 
// /* eslint-disable @typescript-eslint/no-explicit-any */

// // ─── Grid constants ───────────────────────────────────────────────────────────
// export const ROWS          = 4;
// export const COLS          = 5;
// export const TOTAL         = ROWS * COLS;   // 20
// export const MAX_RED_COINS = 12;
// export const MAX_SPINS     = 3;

// // ─── Types ────────────────────────────────────────────────────────────────────
// export type WheelCell =
//   | { type: "EMPTY" }
//   | { type: "GOLD";    value: string }
//   | { type: "RED";     value: string; multiplier: string }
//   | { type: "UPGRADE"; featureColor: "blue" | "purple" };

// // ─── Option lists ─────────────────────────────────────────────────────────────
// export const COIN_VALUES  = ["1", "2", "5", "10", "25", "50", "100", "Minor", "Major"];
// export const MULTI_VALUES = ["2", "3", "4", "5", "6", "7", "8", "9", "10", "12", "MAJOR", "GRAND"];

// // ─── Position helpers ─────────────────────────────────────────────────────────
// /** Column-major flat index: col*ROWS+row — used for reelStopPositions array. */
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
//  * All base-game red SCaT coins come into this feature as GOLD coins.
//  * BaseCoin.position = col*4+row (column-major, 4-row base grid).
//  */
// export function seedFromBase(baseCoins: { position: number; value: string }[]): WheelCell[][] {
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

// // ─── Output formatter ─────────────────────────────────────────────────────────
// /**
//  * reelStopPositions : 20 elements, index=col*ROWS+row, value 1 or 0.
//  * landedCoinsInBonusBoost : [[col, row, value], ...]
//  * multipliers             : 20 elements, multiplier value or 0.
//  */
// export function generateWheelGaffe(grid: WheelCell[][]): string {
//   const rsp:  number[]              = Array(TOTAL).fill(0);
//   const lc:   (string | number)[][] = [];
//   const mult: (number | string)[]   = Array(TOTAL).fill(0);

//   grid.forEach((rowArr, r) => {
//     rowArr.forEach((cell, c) => {
//       if (cell.type === "EMPTY" || cell.type === "UPGRADE") return;
//       const idx = posIdx(r, c);
//       rsp[idx] = 1;

//       if (cell.type === "GOLD") {
//         lc.push([c, r, cell.value]);
//       }
//       if (cell.type === "RED") {
//         lc.push([c, r, cell.value]);
//         if (cell.multiplier) {
//           mult[idx] = isNaN(Number(cell.multiplier)) ? cell.multiplier : Number(cell.multiplier);
//         }
//       }
//     });
//   });

//   const parts: string[] = [`reelStopPositions: [${rsp.join(",")}]`];
//   if (lc.length > 0)
//     parts.push(`landedCoinsInBonusBoost: [${lc.map(e => `[${e.join(",")}]`).join(",")}]`);
//   if (mult.some(m => m !== 0))
//     parts.push(`multipliers: [${mult.join(",")}]`);
//   return `[${parts.join(", ")}]`;
// }


//! latest working 
// /* eslint-disable @typescript-eslint/no-explicit-any */

// // ─── Grid constants ────────────────────────────────────────────────────────────
// export const ROWS          = 4;
// export const COLS          = 5;
// export const TOTAL         = ROWS * COLS;   // 20
// export const MAX_RED_COINS = 12;
// export const MAX_SPINS     = 3;

// // ─── Multiplier ladder (fixed order, index 0–11) ──────────────────────────────
// /**
//  * The full ordered ladder of multiplier prizes.
//  * Index 0 = GRAND, Index 11 = 18.
//  * As prizes are used in each spin they are removed from the FRONT
//  * of the remaining ladder, so indices shift.
//  */
// export const MULTIPLIER_LADDER: string[] = [
//   "GRAND", "5", "10", "38", "3", "88", "MAJOR", "2", "28", "8", "68", "18",
// ];

// // ─── Cell types ────────────────────────────────────────────────────────────────
// export type WheelCell =
//   | { type: "EMPTY" }
//   | { type: "GOLD";    value: string }
//   | { type: "RED";     value: string; multiplier: string }   // multiplier = ladder prize value
//   | { type: "UPGRADE"; featureColor: "blue" | "purple" };

// // ─── Option lists ──────────────────────────────────────────────────────────────
// export const COIN_VALUES = ["1", "2", "5", "10", "25", "50", "100", "Minor", "Major"];

// // ─── Position helper ───────────────────────────────────────────────────────────
// /** Column-major flat index: col*ROWS+row */
// export function posIdx(row: number, col: number): number {
//   return col * ROWS + row;
// }

// // ─── Grid factory ──────────────────────────────────────────────────────────────
// export function emptyGrid(): WheelCell[][] {
//   return Array.from({ length: ROWS }, () =>
//     Array.from({ length: COLS }, (): WheelCell => ({ type: "EMPTY" }))
//   );
// }

// /**
//  * All base-game red SCaT coins come into this feature as GOLD coins.
//  * BaseCoin.position = col*4+row (column-major, 4-row base grid).
//  */
// export function seedFromBase(baseCoins: { position: number; value: string }[]): WheelCell[][] {
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

// // ─── Output formatter ──────────────────────────────────────────────────────────
// /**
//  * NEW FORMAT:
//  *
//  * reelStopPositions : ["3_RED_50", "4_GOLD_250", ...]
//  *   — each element = "{flatPos}_{COLOR}_{coinValue}"
//  *   — one entry per coin present on the grid (GOLD + RED only, not UPGRADE)
//  *   — NO separate landedCoinsInBonusBoost array
//  *
//  * multiplierLadderPrize : [index]
//  *   — only included when a RED coin has a multiplier set
//  *   — index = position of that multiplier value in the CURRENT remaining ladder
//  *     (items used in previous spins have been removed, so indices shift)
//  *   — always exactly 1 element (max 1 red coin per spin)
//  *
//  * @param grid            current grid state
//  * @param ladderIndex     index in the remaining ladder of the RED coin's
//  *                        multiplier (pass undefined if no multiplier selected)
//  */
// export function generateWheelGaffe(
//   grid:        WheelCell[][],
//   ladderIndex: number | undefined
// ): string {
//   const coinStrings: string[] = [];

//   grid.forEach((rowArr, r) => {
//     rowArr.forEach((cell, c) => {
//       if (cell.type === "EMPTY" || cell.type === "UPGRADE") return;
//       const pos   = posIdx(r, c);
//       const color = cell.type.toUpperCase();   // "GOLD" or "RED"
//       const val   = cell.value;
//       coinStrings.push(`${pos}_${color}_${val}`);
//     });
//   });

//   const parts: string[] = [];

//   if (coinStrings.length > 0) {
//     parts.push(`reelStopPositions: [${coinStrings.join(",")}]`);
//   }

//   // multiplierLadderPrize only when RED coin has a multiplier
//   if (ladderIndex !== undefined && ladderIndex >= 0) {
//     parts.push(`multiplierLadderPrize: [${ladderIndex}]`);
//   }

//   return parts.length > 0 ? `[${parts.join(", ")}]` : `[]`;
// }


/* eslint-disable @typescript-eslint/no-explicit-any */

// ─── Grid constants ────────────────────────────────────────────────────────────
export const TOTAL_ROWS   = 12;          // Full reel strip: rows 0–11
export const COLS         = 5;
export const UNLOCK_START = 8;           // Unlocked rows start at 8
export const GRID_ROWS    = 4;           // Interactive rows: 8, 9, 10, 11
export const GRID_COLS    = COLS;
export const MAX_RED_COINS = 12;
export const MAX_SPINS     = 3;

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

// ─── RED coin sequence (12 values, used one per spin in order) ────────────────
export const RED_COIN_SEQUENCE: string[] = [
  "RED_COIN 100000", "RED_COIN 50000", "RED_COIN 1000", "RED_COIN 100",
  "RED_COIN 50",     "RED_COIN 10",    "RED_COIN 10",   "RED_COIN 1",
  "RED_COIN 1",      "RED_COIN 1",     "RED_COIN 1",    "RED_COIN 1",
];

export const MULTIPLIER_VALUES: string[] = [
  "GRAND", "5", "10", "38", "3", "88", "MAJOR", "2", "28", "8", "68", "18",
];

// ─── Coin value options ────────────────────────────────────────────────────────
export const COIN_VALUES: string[] = [
  "MINOR", "MINI", "750", "500", "400", "300", "250",
  "200",   "150",  "100",  "80",  "50",  "30",  "20",
];

// ─── Cell types ────────────────────────────────────────────────────────────────
export type WheelCell =
  | { type: "EMPTY"  }
  | { type: "GOLD";   value: string }
  | { type: "RED";    value: string; multiplier: string }
  | { type: "BLUE";   value: string }
  | { type: "PURPLE"; value: string };

// ─── Grid factory ──────────────────────────────────────────────────────────────
export function emptyGrid(): WheelCell[][] {
  return Array.from({ length: GRID_ROWS }, () =>
    Array.from({ length: GRID_COLS }, (): WheelCell => ({ type: "EMPTY" }))
  );
}

/**
 * Seed base-game coins into the unlocked grid.
 * BaseCoin.position = col * 4 + row (old 4-row base-game coords).
 */
export function seedFromBase(baseCoins: { position: number; value: string }[]): WheelCell[][] {
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

// ─── Gaffe generator ──────────────────────────────────────────────────────────
/**
 * Build one spin output line.
 *
 * @param grid        current grid state (4 × 5)
 * @param prevSnap    global positions that were occupied BEFORE this spin
 * @param eReelPos    typeEReelPosition setting, or null
 * @param redCoinIdx  next index into RED_COIN_SEQUENCE for new red coins
 * @param features    active features, e.g. ["piggyWheel"] or ["piggyWheel","piggyZone"]
 */
export function generateWheelGaffe(
  grid:       WheelCell[][],
  prevSnap:   Set<number>,
  eReelPos:   EReelSetting | null,
  redCoinIdx: number,
  features:   string[],
): string {
  const parts: string[] = [];

  // 1 ── typeEReelPosition ────────────────────────────────────────────────────
  if (eReelPos) {
    parts.push(`typeEReelPosition:[${eReelPos.pos},${eReelPos.value}]`);
  }

  // 2 ── Find NEW colored-coin positions ──────────────────────────────────────
  let redPos:    number | null = null;
  let bluePos:   number | null = null;
  let purplePos: number | null = null;

  grid.forEach((rowArr, r) => rowArr.forEach((cell, c) => {
    const pos = gridToPos(r, c);
    if (prevSnap.has(pos)) return;
    if (cell.type === "RED")    redPos    = pos;
    if (cell.type === "BLUE")   bluePos   = pos;
    if (cell.type === "PURPLE") purplePos = pos;
  }));

  if (redPos !== null || bluePos !== null || purplePos !== null) {
    const b = bluePos   !== null ? String(bluePos)   : "";
    const p = purplePos !== null ? String(purplePos) : "";
    const r = redPos    !== null ? String(redPos)    : "";
    parts.push(`unlockedColorCoinsReelPosition:[${b},${p},${r}]`);
  }

  // 3 ── reelstripCOR_{pos} for each NEW coin + multiplierLadderPrize ─────────
  let rIdx = redCoinIdx;
  let multLine: string | undefined;

  grid.forEach((rowArr, r) => rowArr.forEach((cell, c) => {
    if (cell.type === "EMPTY") return;
    const pos = gridToPos(r, c);
    if (prevSnap.has(pos)) return;                          // not new this spin

    if (cell.type === "GOLD") {
      parts.push(`reelstripCOR_${pos}:[,${cell.value}]`);
    } else if (cell.type === "RED") {
      const seqVal = RED_COIN_SEQUENCE[rIdx] ?? RED_COIN_SEQUENCE[RED_COIN_SEQUENCE.length - 1];
      parts.push(`reelstripCOR_${pos}:[${seqVal},${cell.value}]`);
      rIdx++;
      if (cell.multiplier) multLine = `multiplierLadderPrize_${pos}:${cell.multiplier}`;
    } else if (cell.type === "BLUE") {
      parts.push(`reelstripCOR_${pos}:[BLUE_COIN,${cell.value}]`);
    } else if (cell.type === "PURPLE") {
      parts.push(`reelstripCOR_${pos}:[PURPLE_COIN,${cell.value}]`);
    }
  }));

  if (multLine) parts.push(multLine);

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