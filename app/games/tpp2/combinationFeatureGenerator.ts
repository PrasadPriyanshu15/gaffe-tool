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

// ─── Feature upgrading ─────────────────────────────────────────────────────────
// A special "upgrade coin" (colored, no prize value) can land in a feature and
// upgrade it into a combination that ADDS the feature matching the coin's color.
export type UpgradeColor = "RED" | "BLUE" | "PURPLE";

/** Upgrade-coin color → the feature it adds. */
export const UPGRADE_COLOR_TO_FEATURE: Record<UpgradeColor, FeatureKey> = {
  RED:    "piggyWheel",
  BLUE:   "piggyTower",
  PURPLE: "piggyZone",
};

/** The feature a coin adds → its upgrade-coin color. */
export const FEATURE_TO_UPGRADE_COLOR: Record<FeatureKey, UpgradeColor> = {
  piggyWheel: "RED",
  piggyTower: "BLUE",
  piggyZone:  "PURPLE",
};

/** upgradeSymbolValue emitted for an upgrade coin of the given color. */
export function upgradeValueFor(color: UpgradeColor): string {
  return `${color}_COIN_UPGRADE`;
}

/** Features that can still be added via an upgrade coin (the 3 minus active). */
export function availableUpgradeTargets(features: FeatureKey[]): FeatureKey[] {
  const all: FeatureKey[] = ["piggyWheel", "piggyZone", "piggyTower"];
  return all.filter(f => !features.includes(f));
}

/** An upgrade coin currently placed on the grid. `pos` is the GLOBAL flat index. */
export type UpgradeCoin = { pos: number; color: UpgradeColor };

/** A coin carried forward into an upgraded feature. `pos` is the GLOBAL flat index. */
export type CarriedCoin = {
  pos:         number;
  type:        "GOLD" | "RED" | "BLUE" | "PURPLE";
  value:       string;
  multiplier?: string;
};
 
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

/**
 * Seed the combined grid from coins carried forward by an upgrade.
 * Each carried coin is at a GLOBAL flat position (col * 12 + globalRow); we map
 * it back to a LOCAL (row, col) for the target feature set. Without piggyTower
 * the grid only has the 4 always-unlocked rows, so global rows 8-11 map to local
 * rows 0-3; with piggyTower local rows are the global rows directly. Coins that
 * came from Wheel/Zone therefore land in the unlocked section when Tower is added.
 */
export function seedCarriedGrid(
  carried:  CarriedCoin[],
  features: FeatureKey[]
): ComboCell[][] {
  const rows  = gridRows(features);
  const cols  = COLS;
  const g     = emptyGrid(rows, cols);
  const isTwr = hasTower(features);

  carried.forEach(({ pos, type, value, multiplier }) => {
    const col       = Math.floor(pos / ROWS_TOTAL);
    const globalRow = pos % ROWS_TOTAL;
    const row       = isTwr ? globalRow : globalRow - ROWS_LOCKED;

    if (row < 0 || row >= rows || col < 0 || col >= cols) return;

    if (type === "RED") {
      g[row][col] = { type: "RED", value, multiplier: multiplier ?? "" };
    } else if (type === "BLUE") {
      g[row][col] = { type: "BLUE", value };
    } else if (type === "PURPLE") {
      g[row][col] = { type: "PURPLE", value };
    } else {
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
  return {
    coinsToNext: (extra + 1) * COINS_PER_ROW - unlockedCoinCount,
    label: `row ${ROWS_INIT + extra + 1}`,
  };
}
 
/** Coins in rows >= fUnlocked (of ANY non-empty type: GOLD/RED/BLUE/PURPLE) — row-unlock progress. */
export function countUnlockedCoins(grid: ComboCell[][], fUnlocked: number): number {
  let n = 0;
  grid.forEach((rowArr, r) => {
    if (r >= fUnlocked) rowArr.forEach(cell => { if (cell.type !== "EMPTY") n++; });
  });
  return n;
}
 
/**
 * Resolves the unlock state for the current grid.
 *
 * "Coins in unlocked rows" and "which rows are unlocked" are circular — the
 * unlocked boundary depends on the coin count, and the coin count (for
 * unlock purposes) depends on which rows currently count as unlocked.
 * Passing a fixed ROWS_LOCKED into countUnlockedCoins() breaks this: coins
 * (GOLD, RED, or PURPLE alike) placed into a row right after it unlocks
 * (e.g. row 7) never get counted, since the count window never moves past
 * the original 4 rows — progress stalls right after the first new row
 * unlocks. This mirrors the standalone Tower feature's fix: a tiny
 * fixed-point loop (monotonic, converges in at most ROWS_LOCKED steps).
 */
export function computeUnlockState(grid: ComboCell[][]): {
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
 * 3. lockedBlueCoinsReelPosition:[[row,pos],...] — ALL blue coins currently in
 *    the LOCKED section (rows 0-7), accumulated across spins (Tower's format).
 *    Red/purple landing in locked rows are NOT accumulated here — instead the
 *    NEW-this-spin ones are reported together via:
 *      lockedPurpleRedCoinsSymbol:[purpleSeq,redSeq]        (2 slots, no blue)
 *      lockedPurpleRedCoinsReelPosition:[purplePos,redPos]  (2 slots)
 *    with an empty slot for whichever color didn't land this spin, and only
 *    ever the current spin's positions (never previous spins').
 *
 * 4. reelstripCOR_{pos}:... for every NEW coin this spin — same shape as the
 *    single features:
 *      GOLD   → [value]
 *      RED    → value                        (+ multiplierLadderPrize_{pos} if set)
 *      BLUE   → [BLUE_COIN {seq},value]
 *      PURPLE → value
 *    RED/PURPLE seq values move into unlockedColorCoinsSymbol (unlocked) or
 *    lockedPurpleRedCoinsSymbol (locked).
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
  upgradeCoin:   UpgradeCoin | null = null,
): string {
  const parts: string[] = [];
  const isTwr = hasTower(features);
 
  // 1 ── typeEReelPosition ────────────────────────────────────────────────────
  if (eReelPos) {
    parts.push(`typeEReelPosition:[${eReelPos.pos},${eReelPos.value}]`);
  }

  // 1b ── upgrade coin ────────────────────────────────────────────────────────
  // Occupies a position (marked landed = 0 in reelStops below) but has no
  // reelstripCOR / color-coin entry — only these two lines describe it.
  if (upgradeCoin) {
    parts.push(`upgradeSymbolReelPosition:${upgradeCoin.pos}`);
    parts.push(`upgradeSymbolValue:${upgradeValueFor(upgradeCoin.color)}`);
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
 
  // 3 ── lockedBlueCoinsReelPosition — ALL blue coins currently in locked rows.
  // Blue is Tower's own coin and keeps its accumulator format. Red/purple that
  // land in locked rows are reported per-spin below (lockedPurpleRedCoins*),
  // NOT accumulated here.
  const lockedBlue: string[] = [];
  grid.forEach((rowArr, r) => rowArr.forEach((cell, c) => {
    const pos = gridToPos(r, c, features);
    if (!isPosLocked(pos)) return;
    const globalRow = pos % ROWS_TOTAL;
    if (cell.type === "BLUE") lockedBlue.push(`[${globalRow},${pos}]`);
  }));
  if (lockedBlue.length > 0) parts.push(`lockedBlueCoinsReelPosition:[${lockedBlue.join(",")}]`);
 
  // 4 ── reelstripCOR for every NEW coin this spin + multiplierLadderPrize ───
  // GOLD always keeps the array form [value]. BLUE is always locked (Tower
  // rule), so it always keeps the old array form [BLUE_COIN {seq},value] too.
  // RED/PURPLE can land locked OR unlocked: locked ones keep the old array
  // form (seq embedded); NEW unlocked ones switch to plain value, with their
  // symbol moved into unlockedColorCoinsSymbol (slot order [blue,purple,red] —
  // blue is always empty there since blue never lands unlocked).
  let rIdx = redCoinIdx;
  let bIdx = blueCoinIdx;
  let pIdx = purpleCoinIdx;
  let multLine: string | undefined;
  let redSym:    string | undefined;
  let purpleSym: string | undefined;

  // NEW-this-spin coins landing in a LOCKED row (≤1 red + ≤1 purple per spin) →
  // reported together via lockedPurpleRedCoins* lines (slot order [purple, red]).
  let lockedNewRedSym:    string | undefined;
  let lockedNewRedPos:    number | undefined;
  let lockedNewPurpleSym: string | undefined;
  let lockedNewPurplePos: number | undefined;

  grid.forEach((rowArr, r) => rowArr.forEach((cell, c) => {
    if (cell.type === "EMPTY") return;
    const pos = gridToPos(r, c, features);
    if (prevSnap.has(pos)) return;                          // not new this spin
    const unlockedNew = !isPosLocked(pos);
 
    if (cell.type === "GOLD") {
      parts.push(`reelstripCOR_${pos}:[${cell.value}]`);
    } else if (cell.type === "RED") {
      const seqVal = RED_COIN_SEQUENCE[rIdx] ?? RED_COIN_SEQUENCE[RED_COIN_SEQUENCE.length - 1];
      parts.push(`reelstripCOR_${pos}:${cell.value}`);       // plain value (same as single feature)
      if (unlockedNew) {
        redSym = seqVal;                                     // → unlockedColorCoinsSymbol
      } else if (lockedNewRedSym === undefined) {
        lockedNewRedSym = seqVal; lockedNewRedPos = pos;     // → lockedPurpleRedCoinsSymbol
      }
      rIdx++;
      if (cell.multiplier) multLine = `multiplierLadderPrize_${pos}:${cell.multiplier}`;
    } else if (cell.type === "BLUE") {
      const seqVal = BLUE_COIN_SEQUENCE[bIdx] ?? BLUE_COIN_SEQUENCE[BLUE_COIN_SEQUENCE.length - 1];
      parts.push(`reelstripCOR_${pos}:[BLUE_COIN ${seqVal},${cell.value}]`);
      bIdx++;
    } else if (cell.type === "PURPLE") {
      const seqVal = PURPLE_COIN_SEQUENCE[pIdx] ?? PURPLE_COIN_SEQUENCE[PURPLE_COIN_SEQUENCE.length - 1];
      parts.push(`reelstripCOR_${pos}:${cell.value}`);       // plain value (same as single feature)
      if (unlockedNew) {
        purpleSym = seqVal;                                  // → unlockedColorCoinsSymbol
      } else if (lockedNewPurpleSym === undefined) {
        lockedNewPurpleSym = seqVal; lockedNewPurplePos = pos; // → lockedPurpleRedCoinsSymbol
      }
      pIdx++;
    }
  }));
 
  if (redSym !== undefined || purpleSym !== undefined) {
    const p = purpleSym ?? "";
    const r = redSym    ?? "";
    parts.push(`unlockedColorCoinsSymbol:[,${p},${r}]`);
  }
 
  // NEW-this-spin red/purple that landed in a LOCKED row, reported together.
  // Slot order [purple, red] (2 elements, no blue); empty slot if that color
  // didn't land this spin. Only this spin's coins — never accumulated.
  if (lockedNewRedSym !== undefined || lockedNewPurpleSym !== undefined) {
    const pSym = lockedNewPurpleSym ?? "";
    const rSym = lockedNewRedSym    ?? "";
    const pPos = lockedNewPurplePos !== undefined ? String(lockedNewPurplePos) : "";
    const rPos = lockedNewRedPos    !== undefined ? String(lockedNewRedPos)    : "";
    parts.push(`lockedPurpleRedCoinsSymbol:[${pSym},${rSym}]`);
    parts.push(`lockedPurpleRedCoinsReelPosition:[${pPos},${rPos}]`);
  }

  if (multLine) parts.push(multLine);

  // 5 ── reelStops: scan the relevant position set, skip prevSnap, 0/1 ───────
  const scanPositions = isTwr ? ALL_POSITIONS : UNLOCKED_POSITIONS;
 
  const newlyFilled = new Set<number>();
  grid.forEach((rowArr, r) => rowArr.forEach((cell, c) => {
    const pos = gridToPos(r, c, features);
    if (cell.type !== "EMPTY" && !prevSnap.has(pos)) newlyFilled.add(pos);
  }));
  // The upgrade coin occupies its cell too (grid cell stays EMPTY, so add here).
  if (upgradeCoin && !prevSnap.has(upgradeCoin.pos)) newlyFilled.add(upgradeCoin.pos);

  const stops: number[] = [];
  scanPositions.forEach(pos => {
    if (prevSnap.has(pos)) return;                          // already occupied → skip
    stops.push(newlyFilled.has(pos) ? 0 : 1);
  });
 
  parts.push(`reelStops:[${stops.join(",")}]`);
 
  return `[${parts.join(", ")}]`;
}