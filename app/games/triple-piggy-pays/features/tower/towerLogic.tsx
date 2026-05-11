
// towerLogic.ts

// ─── Constants ────────────────────────────────────────────────────────────────

export const TOWER_TOTAL_ROWS = 12;
export const TOWER_BASE_ROWS  = 4;   // rows 0–3: always unlocked (base game)
export const TOWER_COLS       = 5;
export const MAX_BLUE_COINS   = 8;
/**
 * Coins needed per locked row tier.
 * Row 4 unlocks at 4 unlocked-row coins, row 5 at 8, row 6 at 12, …
 */
export const UNLOCK_THRESHOLD = 6 ;

// ─── Types ────────────────────────────────────────────────────────────────────

export type TowerQueryCell = { type: string };

// ─── Core unlock computation ──────────────────────────────────────────────────

/**
 * A "countable" coin for tower unlock purposes is any placed coin:
 * GOLD, BLUE, RED, or PURPLE.
 * (TRIGGER and EMPTY don't count.)
 */
function isTowerCoin(cell: TowerQueryCell): boolean {
  return (
    cell.type === "GOLD"   ||
    cell.type === "BLUE"   ||
    cell.type === "RED"    ||
    cell.type === "PURPLE"
  );
}

/**
 * Computes which rows are unlocked and the running coin total — counting ONLY
 * coins that sit in already-unlocked rows (GOLD, BLUE, RED, PURPLE all count).
 *
 * Coins placed in LOCKED rows are held (visible on grid) but do NOT contribute
 * to unlock progression and do NOT reset the spin counter.
 *
 * Sequential logic:
 *   rows 0–3 always unlocked → count their coins
 *   row 4 unlocks if running total ≥ 1 * UNLOCK_THRESHOLD → then counts its coins
 *   row 5 unlocks if running total ≥ 2 * UNLOCK_THRESHOLD → then counts its coins
 *   … and so on
 */
export function computeUnlockProgress(grid: TowerQueryCell[][]): {
  unlockedCoins: number;
  unlockedRows: boolean[];
} {
  let count = 0;
  const unlockedRows: boolean[] = new Array(TOWER_TOTAL_ROWS).fill(false);

  for (let r = 0; r < TOWER_TOTAL_ROWS; r++) {
    const isBase    = r < TOWER_BASE_ROWS;
    const threshold = (r - TOWER_BASE_ROWS + 1) * UNLOCK_THRESHOLD;
    const unlocked  = isBase || count >= threshold;

    unlockedRows[r] = unlocked;

    if (unlocked) {
      count += (grid[r] ?? []).filter(isTowerCoin).length;
    }
    // Locked row coins ignored for progression
  }

  return { unlockedCoins: count, unlockedRows };
}

// ─── Convenience wrappers ─────────────────────────────────────────────────────

export function isRowUnlocked(unlockedRows: boolean[], rowIdx: number): boolean {
  return unlockedRows[rowIdx] ?? false;
}

export function coinsNeededForRow(rowIdx: number, unlockedCoins: number): number {
  if (rowIdx < TOWER_BASE_ROWS) return 0;
  return Math.max(0, (rowIdx - TOWER_BASE_ROWS + 1) * UNLOCK_THRESHOLD - unlockedCoins);
}

// ─── Per-row helpers ──────────────────────────────────────────────────────────

export function getBlueInRow(grid: TowerQueryCell[][], rowIdx: number): number {
  return (grid[rowIdx] ?? []).filter(c => c.type === "BLUE").length;
}

export function getTotalBlue(grid: TowerQueryCell[][]): number {
  return grid.flat().filter(c => c.type === "BLUE").length;
}

// ─── Next-unlock summary ──────────────────────────────────────────────────────

export function getNextUnlockInfo(unlockedCoins: number): string {
  for (let r = TOWER_BASE_ROWS; r < TOWER_TOTAL_ROWS; r++) {
    const needed = coinsNeededForRow(r, unlockedCoins);
    if (needed > 0) {
      return `${needed} more coin${needed !== 1 ? "s" : ""} → unlock row ${r + 1}`;
    }
  }
  return "All rows unlocked! ✓";
}