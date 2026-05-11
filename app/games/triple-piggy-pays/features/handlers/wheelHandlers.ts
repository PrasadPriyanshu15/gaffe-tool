/* eslint-disable @typescript-eslint/no-explicit-any */
// handlers/wheelHandlers.ts
// Pure functions for WHEEL feature click logic and result output.
// No React imports — all functions are stateless and fully reusable.

import type { Cell, Grid, MultiplierType } from "../featureTypes";

export const MAX_RED = 12;

export const MULTIPLIER_OPTIONS: MultiplierType[] = [
  2, 5, 10, 20, 50, 100, 200, 500, 1000, 2000, "MAJOR", "GRAND",
];

// ─── Click transitions ────────────────────────────────────────────────────────

/**
 * GOLD → RED transition for WHEEL.
 * Returns the new RED cell, or null if the grid is already full (12 REDs).
 */
export function wheelGoldNext(grid: Grid): Cell | null {
  const redCount = grid.flat().filter(c => c.type === "RED").length;
  if (redCount >= MAX_RED) return null;
  return { type: "RED" };
}

/**
 * RED → TRIGGER or GOLD transition for WHEEL.
 * Returns:
 *   - { cell }              : the new cell to set
 *   - { freedMultiplier }   : the multiplier that was freed (if any), so caller
 *                             can update usedMultipliers state
 */
export function wheelRedNext(
  current: Extract<Cell, { type: "RED" }>,
  triggerExistsOnGrid: boolean
): { cell: Cell; freedMultiplier?: MultiplierType } {
  return {
    cell: triggerExistsOnGrid ? { type: "GOLD" } : { type: "TRIGGER" },
    freedMultiplier: current.multiplier,
  };
}

// ─── Result builder ───────────────────────────────────────────────────────────

/**
 * Builds the WHEEL-specific result lines: redCoin and multiplierValue.
 * Returns an array of formatted strings ready to join into the output block.
 */
export function buildWheelResultLines(grid: Grid): string[] {
  const redCoin:        [number, number, number][]          = [];
  const multiplierValue:[number, number, MultiplierType | 0][] = [];

  grid.forEach((row, i) => {
    row.forEach((cell, j) => {
      if (cell.type === "RED") {
        redCoin.push([j, i, cell.value ?? 0]);
        multiplierValue.push([j, i, cell.multiplier ?? 0]);
      }
    });
  });

  const fmt = (arr: any[][]) => arr.map(c => `[${c.join(",")}]`).join(",");
  return [
    `redCoin:[${fmt(redCoin)}]`,
    `multiplierValue:[${fmt(multiplierValue)}]`,
  ];
}