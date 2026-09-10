/* eslint-disable @typescript-eslint/no-explicit-any */

import { UpgradeCoin, upgradeValueFor } from "./combinationFeatureGenerator";

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
export const COIN_VALUES: string[] =["MINOR", "MINI", "150", "125", "100", "70", "60", "50", "40", "25", "15", "10", "5", "4"];

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
  grid:        WheelCell[][],
  prevSnap:    Set<number>,
  eReelPos:    EReelSetting | null,
  redCoinIdx:  number,
  features:    string[],
  upgradeCoin: UpgradeCoin | null = null,
): string {
  const parts: string[] = [];

  // 1 ── typeEReelPosition ────────────────────────────────────────────────────
  if (eReelPos) {
    parts.push(`typeEReelPosition:[${eReelPos.pos},${eReelPos.value}]`);
  }

  // 1b ── upgrade coin (no reelstripCOR; only these two lines describe it) ─────
  if (upgradeCoin) {
    parts.push(`upgradeSymbolReelPosition:${upgradeCoin.pos}`);
    parts.push(`upgradeSymbolValue:${upgradeValueFor(upgradeCoin.color)}`);
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
  // GOLD keeps the array form [value]; colored coins are now plain value
  // (no seq, no brackets) — their symbols move into unlockedColorCoinsSymbol
  // below, in the same [blue, purple, red] slot order.
  let rIdx = redCoinIdx;
  let multLine: string | undefined;
  let redSym:    string | undefined;
  let blueSym:   string | undefined;
  let purpleSym: string | undefined;

  grid.forEach((rowArr, r) => rowArr.forEach((cell, c) => {
    if (cell.type === "EMPTY") return;
    const pos = gridToPos(r, c);
    if (prevSnap.has(pos)) return;                          // not new this spin

    if (cell.type === "GOLD") {
      parts.push(`reelstripCOR_${pos}:[${cell.value}]`);
    } else if (cell.type === "RED") {
      const seqVal = RED_COIN_SEQUENCE[rIdx] ?? RED_COIN_SEQUENCE[RED_COIN_SEQUENCE.length - 1];
      parts.push(`reelstripCOR_${pos}:${cell.value}`);
      redSym = seqVal;
      rIdx++;
      if (cell.multiplier) multLine = `multiplierLadderPrize_${pos}:${cell.multiplier}`;
    } else if (cell.type === "BLUE") {
      parts.push(`reelstripCOR_${pos}:${cell.value}`);
      blueSym = "BLUE_COIN";
    } else if (cell.type === "PURPLE") {
      parts.push(`reelstripCOR_${pos}:${cell.value}`);
      purpleSym = "PURPLE_COIN";
    }
  }));

  if (redSym !== undefined || blueSym !== undefined || purpleSym !== undefined) {
    const b = blueSym   ?? "";
    const p = purpleSym ?? "";
    const r = redSym    ?? "";
    parts.push(`unlockedColorCoinsSymbol:[${b},${p},${r}]`);
  }

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
  if (upgradeCoin && !prevSnap.has(upgradeCoin.pos)) newlyFilled.add(upgradeCoin.pos);

  const stops: number[] = [];
  UNLOCKED_POSITIONS.forEach(pos => {
    if (prevSnap.has(pos)) return;                          // already occupied → skip
    stops.push(newlyFilled.has(pos) ? 0 : 1);
  });

  parts.push(`reelStops:[${stops.join(",")}]`);

  return `[${parts.join(", ")}]`;
}