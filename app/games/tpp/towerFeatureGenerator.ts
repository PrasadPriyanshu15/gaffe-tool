
// //! new try for diff options for gold and blue coins values

// /* eslint-disable @typescript-eslint/no-explicit-any */

// // ─── Grid constants ────────────────────────────────────────────────────────────
// export const ROWS_TOTAL  = 12;
// export const COLS        = 5;
// export const ROWS_LOCKED = 8;    // rows 0-7 start locked (top)
// export const ROWS_INIT   = 4;    // rows 8-11 always unlocked (bottom, base game section)
// export const TOTAL       = ROWS_TOTAL * COLS;  // 60

// export const MAX_BLUE      = 8;
// export const COINS_PER_ROW = 6;  // every 6 unlocked-row coins unlocks 1 more row upward
// export const MAX_SPINS     = 3;

// // ─── Blue coin sequence (used one per spin in order, like RED_COIN_SEQUENCE in wheel) ──
// export const BLUE_COIN_SEQUENCE: string[] = [
//   "1000000", "10000", "1000", "650", "100", "1", "1", "1",
// ];

// // ─── Types ────────────────────────────────────────────────────────────────────
// export type TowerCell =
//   | { type: "EMPTY" }
//   | { type: "GOLD"; value: string }
//   | { type: "BLUE"; value: string };  // value = prize (MINI, MINOR, etc.)

// export const GOLD_COIN_VALUES = ["MINOR", "MINI", "150", "125", "100", "70", "60", "50", "40", "25", "15", "10", "5", "4"];
// export const BLUE_COIN_VALUES = ["MINOR", "MINI", "150", "125", "100", "70", "60", "50"];

// // Default value used when placing a new gold coin
// export const DEFAULT_GOLD_VALUE = GOLD_COIN_VALUES[0];

// // ─── Position helper ──────────────────────────────────────────────────────────
// /** Column-major flat index: col × ROWS_TOTAL + row (matches spec image) */
// export function posIdx(row: number, col: number): number {
//   return col * ROWS_TOTAL + row;
// }

// // ─── typeEReelPosition helpers (unlocked rows only) ───────────────────────────
// export type EReelSetting = { pos: number; value: string };

// /** Options depend on column: col 0 = Reel1_x, rest = ReelRest_x */
// export function eReelOptions(pos: number): string[] {
//   const col = Math.floor(pos / ROWS_TOTAL);
//   return col === 0
//     ? ["Reel1_0", "Reel1_1"]
//     : ["ReelRest_0", "ReelRest_1"];
// }

// /** All 60 positions in column-major scan order (rows 0-11, cols 0-4) */
// export const ALL_POSITIONS: number[] = (() => {
//   const arr: number[] = [];
//   for (let col = 0; col < COLS; col++)
//     for (let row = 0; row < ROWS_TOTAL; row++)
//       arr.push(posIdx(row, col));
//   return arr;
// })();

// /** The 20 unlocked positions in column-major scan order (rows 8-11, cols 0-4) */
// export const UNLOCKED_POSITIONS: number[] = (() => {
//   const arr: number[] = [];
//   for (let col = 0; col < COLS; col++)
//     for (let row = ROWS_LOCKED; row < ROWS_TOTAL; row++)
//       arr.push(posIdx(row, col));
//   return arr;
// })();

// // ─── Unlock helpers ───────────────────────────────────────────────────────────
// export function extraUnlockedRows(unlockedCoinCount: number): number {
//   return Math.min(ROWS_LOCKED, Math.floor(unlockedCoinCount / COINS_PER_ROW));
// }

// /** 0-based index of the topmost currently-unlocked row. */
// export function firstUnlockedRow(unlockedCoinCount: number): number {
//   return ROWS_LOCKED - extraUnlockedRows(unlockedCoinCount);
// }

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
//  * Seed initial grid from base-game coins → GOLD coins in unlocked rows 8-11.
//  * BaseCoin.position = col * 4 + row (column-major, 4-row base grid).
//  */
// export function seedFromBase(baseCoins: { position: number; value: string }[]): TowerCell[][] {
//   const g = emptyGrid();
//   baseCoins.forEach(({ position, value }) => {
//     const col      = Math.floor(position / ROWS_INIT);
//     const baseRow  = position % ROWS_INIT;
//     const towerRow = baseRow + ROWS_LOCKED;   // 0-3 → rows 8-11
//     if (col < COLS && towerRow < ROWS_TOTAL) {
//       g[towerRow][col] = { type: "GOLD", value: value || GOLD_COIN_VALUES[0] };
//     }
//   });
//   return g;
// }

// // ─── Counters ─────────────────────────────────────────────────────────────────
// /** Coins in unlocked rows only — used for row-unlock progress. */
// export function countUnlockedCoins(grid: TowerCell[][], fUnlocked: number): number {
//   let n = 0;
//   grid.forEach((rowArr, r) => {
//     if (r >= fUnlocked) rowArr.forEach(cell => { if (cell.type !== "EMPTY") n++; });
//   });
//   return n;
// }

// export function countBlue(grid: TowerCell[][]): number {
//   return grid.flat().filter(c => c.type === "BLUE").length;
// }

// // ─── Output formatter ─────────────────────────────────────────────────────────
// /**
//  * Builds one spin output line for the TOWER feature.
//  *
//  * typeEReelPosition:[pos,value]
//  *   — only when set; unlocked rows only (same as Wheel)
//  *
//  * reelstripCOR_{pos}:[PRIZE]
//  *   — for each NEW gold coin this spin; e.g. reelstripCOR_9:[MINOR]
//  *
//  * reelstripCOR_{pos}:[BLUE_COIN {seqVal},{prize}]
//  *   — for each NEW blue coin this spin; seqVal consumed in order from BLUE_COIN_SEQUENCE
//  *   — e.g. reelstripCOR_0:[BLUE_COIN 10000,MINI]
//  *
//  * lockedBlueCoinsReelPosition:[[row,reelPos],...]
//  *   — all blue coins (accumulated, not just new); row 0 = top locked row, row 7 = 8th locked row
//  *
//  * reelStops:[...]
//  *   — ALL 60 positions in column-major order (col 0 top→bottom, then col 1, …)
//  *   — positions already occupied at start of spin (prevSnap) are SKIPPED entirely
//  *   — remaining positions: 0 = new coin placed there this spin, 1 = still empty
//  *
//  * @param grid          current grid state
//  * @param prevSnap      set of flat positions occupied BEFORE this spin
//  * @param eReelPos      typeEReelPosition setting, or null
//  * @param blueCoinIdx   next index into BLUE_COIN_SEQUENCE for new blue coins
//  */
// export function generateTowerGaffe(
//   grid:        TowerCell[][],
//   prevSnap:    Set<number>,
//   eReelPos:    EReelSetting | null,
//   blueCoinIdx: number,
// ): string {
//   const parts: string[] = [];

//   // 1 ── typeEReelPosition ──────────────────────────────────────────────────
//   if (eReelPos) {
//     parts.push(`typeEReelPosition:[${eReelPos.pos},${eReelPos.value}]`);
//   }

//   // 2 ── reelstripCOR for each NEW coin (gold or blue) ──────────────────────
//   let bIdx = blueCoinIdx;
//   grid.forEach((rowArr, r) => rowArr.forEach((cell, c) => {
//     if (cell.type === "EMPTY") return;
//     const pos = posIdx(r, c);
//     if (prevSnap.has(pos)) return;          // not new this spin

//     if (cell.type === "GOLD") {
//       parts.push(`reelstripCOR_${pos}:[${cell.value}]`);
//     } else if (cell.type === "BLUE") {
//       const seqVal = BLUE_COIN_SEQUENCE[bIdx] ?? BLUE_COIN_SEQUENCE[BLUE_COIN_SEQUENCE.length - 1];
//       parts.push(`reelstripCOR_${pos}:[BLUE_COIN ${seqVal},${cell.value}]`);
//       bIdx++;
//     }
//   }));

//   // 3 ── lockedBlueCoinsReelPosition (all blue coins present) ───────────────
//   const blueEntries: string[] = [];
//   grid.forEach((rowArr, r) => rowArr.forEach((cell, c) => {
//     if (cell.type !== "BLUE") return;
//     if (r >= ROWS_LOCKED) return;           // blue only in locked rows 0-7
//     blueEntries.push(`[${r},${posIdx(r, c)}]`);
//   }));
//   if (blueEntries.length > 0) {
//     parts.push(`lockedBlueCoinsReelPosition:[${blueEntries.join(",")}]`);
//   }

//   // 4 ── reelStops: ALL 60 positions, skip prevSnap, 0=new coin, 1=empty ────
//   const newlyFilled = new Set<number>();
//   grid.forEach((rowArr, r) => rowArr.forEach((cell, c) => {
//     const pos = posIdx(r, c);
//     if (cell.type !== "EMPTY" && !prevSnap.has(pos)) newlyFilled.add(pos);
//   }));

//   const stops: number[] = [];
//   ALL_POSITIONS.forEach(pos => {
//     if (prevSnap.has(pos)) return;          // already occupied → skip
//     stops.push(newlyFilled.has(pos) ? 0 : 1);
//   });

//   parts.push(`reelStops:[${stops.join(",")}]`);

//   return `[${parts.join(", ")}]`;
// }


/* eslint-disable @typescript-eslint/no-explicit-any */
 
// ─── Grid constants ────────────────────────────────────────────────────────────
export const ROWS_TOTAL  = 12;
export const COLS        = 5;
export const ROWS_LOCKED = 8;    // rows 0-7 start locked (top)
export const ROWS_INIT   = 4;    // rows 8-11 always unlocked (bottom, base game section)
export const TOTAL       = ROWS_TOTAL * COLS;  // 60
 
export const MAX_BLUE      = 8;
export const COINS_PER_ROW = 6;  // every 6 unlocked-row coins unlocks 1 more row upward
export const MAX_SPINS     = 3;
 
// ─── Blue coin sequence (used one per spin in order, like RED_COIN_SEQUENCE in wheel) ──
export const BLUE_COIN_SEQUENCE: string[] = [
  "1000000", "10000", "1000", "650", "100", "1", "1", "1",
];
 
// ─── Types ────────────────────────────────────────────────────────────────────
export type TowerCell =
  | { type: "EMPTY" }
  | { type: "GOLD"; value: string }
  | { type: "BLUE"; value: string };  // value = prize (MINI, MINOR, etc.)
 
export const GOLD_COIN_VALUES = ["MINOR", "MINI", "150", "125", "100", "70", "60", "50", "40", "25", "15", "10", "5", "4"];
export const BLUE_COIN_VALUES = ["MINOR", "MINI", "150", "125", "100", "70", "60", "50"];
 
// Default value used when placing a new gold coin
export const DEFAULT_GOLD_VALUE = GOLD_COIN_VALUES[0];
 
// ─── Position helper ──────────────────────────────────────────────────────────
/** Column-major flat index: col × ROWS_TOTAL + row (matches spec image) */
export function posIdx(row: number, col: number): number {
  return col * ROWS_TOTAL + row;
}
 
// ─── typeEReelPosition helpers (unlocked rows only) ───────────────────────────
export type EReelSetting = { pos: number; value: string };
 
/** Options depend on column: col 0 = Reel1_x, rest = ReelRest_x */
export function eReelOptions(pos: number): string[] {
  const col = Math.floor(pos / ROWS_TOTAL);
  return col === 0
    ? ["Reel1_0", "Reel1_1"]
    : ["ReelRest_0", "ReelRest_1"];
}
 
/** All 60 positions in column-major scan order (rows 0-11, cols 0-4) */
export const ALL_POSITIONS: number[] = (() => {
  const arr: number[] = [];
  for (let col = 0; col < COLS; col++)
    for (let row = 0; row < ROWS_TOTAL; row++)
      arr.push(posIdx(row, col));
  return arr;
})();
 
/** The 20 unlocked positions in column-major scan order (rows 8-11, cols 0-4) */
export const UNLOCKED_POSITIONS: number[] = (() => {
  const arr: number[] = [];
  for (let col = 0; col < COLS; col++)
    for (let row = ROWS_LOCKED; row < ROWS_TOTAL; row++)
      arr.push(posIdx(row, col));
  return arr;
})();
 
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
 * Seed initial grid from base-game coins → GOLD coins in unlocked rows 8-11.
 * BaseCoin.position = col * 4 + row (column-major, 4-row base grid).
 */
export function seedFromBase(baseCoins: { position: number; value: string }[]): TowerCell[][] {
  const g = emptyGrid();
  baseCoins.forEach(({ position, value }) => {
    const col      = Math.floor(position / ROWS_INIT);
    const baseRow  = position % ROWS_INIT;
    const towerRow = baseRow + ROWS_LOCKED;   // 0-3 → rows 8-11
    if (col < COLS && towerRow < ROWS_TOTAL) {
      g[towerRow][col] = { type: "GOLD", value: value || GOLD_COIN_VALUES[0] };
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
 
/**
 * Resolves the unlock state for the current grid.
 *
 * "Coins in unlocked rows" and "which rows are unlocked" are circular —
 * the unlocked boundary depends on the coin count, and the coin count
 * (for unlock purposes) depends on which rows currently count as unlocked.
 * Passing a fixed ROWS_LOCKED into countUnlockedCoins() breaks this: coins
 * placed into a row right after it unlocks (e.g. row 7) never get counted,
 * since the count window never moves past the original 4 rows — progress
 * stalls right after the first new row unlocks.
 *
 * This resolves it with a tiny fixed-point loop (monotonic, converges in
 * at most ROWS_LOCKED steps): start from the initial boundary, count coins
 * in that window, see if that count unlocks a wider window, and repeat
 * until the window stops growing.
 */
export function computeUnlockState(grid: TowerCell[][]): {
  fUnlocked: number;
  totalUnlockedCoins: number;
  extra: number;
} {
  let fUnlocked = ROWS_LOCKED;
  for (let i = 0; i < ROWS_LOCKED; i++) {
    const count = countUnlockedCoins(grid, fUnlocked);
    const extra = extraUnlockedRows(count);
    const next  = ROWS_LOCKED - extra;
    if (next === fUnlocked) {
      return { fUnlocked, totalUnlockedCoins: count, extra };
    }
    fUnlocked = next;
  }
  const count = countUnlockedCoins(grid, fUnlocked);
  return { fUnlocked, totalUnlockedCoins: count, extra: extraUnlockedRows(count) };
}
 
// ─── Output formatter ─────────────────────────────────────────────────────────
/**
 * Builds one spin output line for the TOWER feature.
 *
 * typeEReelPosition:[pos,value]
 *   — only when set; unlocked rows only (same as Wheel)
 *
 * reelstripCOR_{pos}:[PRIZE]
 *   — for each NEW gold coin this spin; e.g. reelstripCOR_9:[MINOR]
 *
 * reelstripCOR_{pos}:[BLUE_COIN {seqVal},{prize}]
 *   — for each NEW blue coin this spin; seqVal consumed in order from BLUE_COIN_SEQUENCE
 *   — e.g. reelstripCOR_0:[BLUE_COIN 10000,MINI]
 *
 * lockedBlueCoinsReelPosition:[[row,reelPos],...]
 *   — all blue coins (accumulated, not just new); row 0 = top locked row, row 7 = 8th locked row
 *
 * reelStops:[...]
 *   — ALL 60 positions in column-major order (col 0 top→bottom, then col 1, …)
 *   — positions already occupied at start of spin (prevSnap) are SKIPPED entirely
 *   — remaining positions: 0 = new coin placed there this spin, 1 = still empty
 *
 * @param grid          current grid state
 * @param prevSnap      set of flat positions occupied BEFORE this spin
 * @param eReelPos      typeEReelPosition setting, or null
 * @param blueCoinIdx   next index into BLUE_COIN_SEQUENCE for new blue coins
 */
export function generateTowerGaffe(
  grid:        TowerCell[][],
  prevSnap:    Set<number>,
  eReelPos:    EReelSetting | null,
  blueCoinIdx: number,
): string {
  const parts: string[] = [];
 
  // 1 ── typeEReelPosition ──────────────────────────────────────────────────
  if (eReelPos) {
    parts.push(`typeEReelPosition:[${eReelPos.pos},${eReelPos.value}]`);
  }
 
  // 2 ── reelstripCOR for each NEW coin (gold or blue) ──────────────────────
  let bIdx = blueCoinIdx;
  grid.forEach((rowArr, r) => rowArr.forEach((cell, c) => {
    if (cell.type === "EMPTY") return;
    const pos = posIdx(r, c);
    if (prevSnap.has(pos)) return;          // not new this spin
 
    if (cell.type === "GOLD") {
      parts.push(`reelstripCOR_${pos}:[${cell.value}]`);
    } else if (cell.type === "BLUE") {
      const seqVal = BLUE_COIN_SEQUENCE[bIdx] ?? BLUE_COIN_SEQUENCE[BLUE_COIN_SEQUENCE.length - 1];
      parts.push(`reelstripCOR_${pos}:[BLUE_COIN ${seqVal},${cell.value}]`);
      bIdx++;
    }
  }));
 
  // 3 ── lockedBlueCoinsReelPosition (all blue coins present) ───────────────
  const blueEntries: string[] = [];
  grid.forEach((rowArr, r) => rowArr.forEach((cell, c) => {
    if (cell.type !== "BLUE") return;
    if (r >= ROWS_LOCKED) return;           // blue only in locked rows 0-7
    blueEntries.push(`[${r},${posIdx(r, c)}]`);
  }));
  if (blueEntries.length > 0) {
    parts.push(`lockedBlueCoinsReelPosition:[${blueEntries.join(",")}]`);
  }
 
  // 4 ── reelStops: ALL 60 positions, skip prevSnap, 0=new coin, 1=empty ────
  const newlyFilled = new Set<number>();
  grid.forEach((rowArr, r) => rowArr.forEach((cell, c) => {
    const pos = posIdx(r, c);
    if (cell.type !== "EMPTY" && !prevSnap.has(pos)) newlyFilled.add(pos);
  }));
 
  const stops: number[] = [];
  ALL_POSITIONS.forEach(pos => {
    if (prevSnap.has(pos)) return;          // already occupied → skip
    stops.push(newlyFilled.has(pos) ? 0 : 1);
  });
 
  parts.push(`reelStops:[${stops.join(",")}]`);
 
  return `[${parts.join(", ")}]`;
}