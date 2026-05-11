/* eslint-disable @typescript-eslint/no-explicit-any */
// handlers/zoneHandlers.ts
// Pure functions for ZONE feature click logic and result output.
// No React imports — all functions are stateless and fully reusable.
// Heavy zone logic (merge, absorption) stays in zoneLogic.ts.

import type { Cell, Grid } from "../featureTypes";

// ─── Click transitions ────────────────────────────────────────────────────────

/**
 * GOLD → PURPLE transition for ZONE.
 * Always returns a PURPLE cell; caller is responsible for also calling _addZone.
 */
export function zoneGoldNext(): Extract<Cell, { type: "PURPLE" }> {
  return { type: "PURPLE", value: 100 };
}

/**
 * RED → PURPLE transition for WHEEL+ZONE combination.
 * Caller should also free any multiplier held by the RED cell.
 */
export function zoneRedNext(): Extract<Cell, { type: "PURPLE" }> {
  return { type: "PURPLE", value: 100 };
}

/**
 * BLUE → PURPLE transition for TOWER+ZONE combination.
 */
export function zoneBlueNext(): Extract<Cell, { type: "PURPLE" }> {
  return { type: "PURPLE", value: 100 };
}

// ─── Result builder ───────────────────────────────────────────────────────────

/**
 * Builds the ZONE-specific result line: purpleCoin.
 * Uses standard grid coordinates [col, gridRow, value] — no position remapping
 * needed since ZONE is only used in the 4×5 standard grid (not TOWER).
 */
export function buildZoneResultLines(grid: Grid): string[] {
  const purpleCoin: [number, number, number][] = [];

  grid.forEach((row, i) => {
    row.forEach((cell, j) => {
      if (cell.type === "PURPLE") {
        purpleCoin.push([j, i, cell.value ?? 0]);
      }
    });
  });

  const fmt = (arr: any[][]) => arr.map(c => `[${c.join(",")}]`).join(",");
  return [`purpleCoin:[${fmt(purpleCoin)}]`];
}

// ─── Standard result helpers (shared by non-TOWER features) ──────────────────

/**
 * Builds the shared goldCoin and reelStopPositions lines for standard (4×5) features.
 * For TOWER these are handled in buildTowerResultLines instead.
 */
export function buildStandardBaseLines(
  grid: Grid,
  ROWS: number,
  COLS: number
): { reelStopLine: string; goldCoinLine: string } {
  const reelStop = Array(ROWS * COLS).fill(0);
  const goldCoin: any[] = [];

  grid.forEach((row, i) => {
    row.forEach((cell, j) => {
      const idx = j * ROWS + i;
      if (cell.type !== "EMPTY") reelStop[idx] = 1;
      if (cell.type === "GOLD")  goldCoin.push([j, i, cell.value ?? 0]);
    });
  });

  const fmt = (arr: any[][]) => arr.map(c => `[${c.join(",")}]`).join(",");
  return {
    reelStopLine: `reelStopPositions:[${reelStop.join(",")}]`,
    goldCoinLine: `goldCoin:[${fmt(goldCoin)}]`,
  };
}

/**
 * Builds the triggerScat line (shared across all features).
 */
export function buildTriggerLine(grid: Grid): { hasTrigger: boolean; triggerLine: string } {
  const triggerScat: any[] = [];

  grid.forEach((row, i) => {
    row.forEach((cell, j) => {
      if (cell.type === "TRIGGER") {
        triggerScat.push([j, i, `${cell.triggerColor ?? "BLUE"}_SCAT`]);
      }
    });
  });

  const fmt = (arr: any[][]) => arr.map(c => `[${c.join(",")}]`).join(",");
  const hasTrigger = triggerScat.length > 0;
  return {
    hasTrigger,
    triggerLine: `triggerScat:[${fmt(triggerScat)}]`,
  };
}