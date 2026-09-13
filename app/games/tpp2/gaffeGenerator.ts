

/* eslint-disable @typescript-eslint/no-explicit-any */

import { visibleCells } from "@/lib/reelGrid";

type ScatType = { key: string; label: string };

function findAllScatPositions(reels: string[][]): Array<{ reelIndex: number; arrayIndex: number }> {
  const out: Array<{ reelIndex: number; arrayIndex: number }> = [];
  reels.forEach((reel, ri) => reel.forEach((sym, ai) => { if (sym === "SCAT") out.push({ reelIndex: ri, arrayIndex: ai }); }));
  return out;
}

function anyScatVisible(reelStops: number[], reels: string[][], rows: number, offset: number): boolean {
  return reels.some((reel, ri) =>
    visibleCells(reel, reelStops[ri] ?? 0, offset, rows)
      .some((cell) => cell.symbol === "SCAT")
  );
}

function anyStackVisible(reelStops: number[], reels: string[][], rows: number, offset: number): boolean {
  return reels.some((reel, ri) =>
    visibleCells(reel, reelStops[ri] ?? 0, offset, rows)
      .some((cell) => (cell.symbol ?? "").startsWith("STACK"))
  );
}

export function generateGaffe(
  reelStops:        number[],
  reels:            string[][],
  scatColors:       { [key: string]: ScatType },
  scatValues:       { [key: string]: string },
  selectedFeatures: string[],
  featureEnabled:   boolean,
  grandEnabled:     boolean,
  majorEnabled:     boolean,
  stackSymbol:      string | null,
  rows:             number,
  offset:           number,
): Record<string, any> {
  const result: Record<string, any> = { reelStopPositions: reelStops };

  if (anyScatVisible(reelStops, reels, rows, offset)) {
    const allPos = findAllScatPositions(reels);
    const hasAssigned = allPos.some(({ reelIndex, arrayIndex }) => !!scatColors[`${reelIndex}-${arrayIndex}`]);
    if (hasAssigned) {
      result.scatReplacement = allPos.map(({ reelIndex, arrayIndex }) =>
        scatColors[`${reelIndex}-${arrayIndex}`]?.label ?? "PURPLE_SCAT"
      );
    }
  }

  if (stackSymbol && anyStackVisible(reelStops, reels, rows, offset)) result.stack = stackSymbol;
  if (grandEnabled) result.triggerGrandJackpot = true;
  if (majorEnabled) result.triggerMajorJackpot = true;

  if (!featureEnabled) {
    result.triggerFeatures = false;
  } else if (selectedFeatures.length > 0) {
    result.triggerFeatures = selectedFeatures;
  }

  // landedCoins: flat array of values for each visible SCAT, in left-to-right /
  // top-to-bottom order across the dynamic grid.
  const landedCoins: string[] = [];
  reels.forEach((reel, ri) => {
    visibleCells(reel, reelStops[ri] ?? 0, offset, rows).forEach((cell) => {
      if (cell.symbol === "SCAT" && cell.stripIndex !== null) {
        const value = scatValues[`${ri}-${cell.stripIndex}`];
        if (value && value !== "") landedCoins.push(value);
      }
    });
  });
  if (landedCoins.length > 0) result.landedCoins = landedCoins;

  return result;
}

// ─── Base coin type ───────────────────────────────────────────────────────────
export type BaseCoin = { position: number; value: string; fromBase: true };

/**
 * Extract base coins for a feature. Seeds a coin for every visible SCAT of the
 * matching colour (defaulting the value to "1"). Feature grids use the 4-row
 * base scheme (position = col*4 + row), so only the first 4 visible rows seed.
 */
export function getBaseCoinsForFeature(
  featureKey: string,
  reelStops:  number[],
  reels:      string[][],
  scatColors: { [key: string]: { key: string; label: string } },
  scatValues: { [key: string]: string },
  rows:       number,
  offset:           number,
): BaseCoin[] {
  const coins: BaseCoin[] = [];
  reels.forEach((reel, ri) => {
    visibleCells(reel, reelStops[ri] ?? 0, offset, rows).forEach((cell) => {
      if (cell.symbol !== "SCAT" || cell.stripIndex === null || cell.row >= 4) return;
      const key  = `${ri}-${cell.stripIndex}`;
      const scat = scatColors[key];
      if (scat && scat.key === featureKey) {
        const value = scatValues[key] || "1";
        coins.push({ position: ri * 4 + cell.row, value, fromBase: true });
      }
    });
  });
  return coins;
}

/**
 * Collect base coins for ALL active features (used by combination).
 */
export function getBaseCoinsForCombination(
  featureKeys: string[],
  reelStops:   number[],
  reels:       string[][],
  scatColors:  { [key: string]: { key: string; label: string } },
  scatValues:  { [key: string]: string },
  rows:        number,
  offset:           number,
): Array<BaseCoin & { featureKey: string }> {
  const coins: Array<BaseCoin & { featureKey: string }> = [];
  reels.forEach((reel, ri) => {
    visibleCells(reel, reelStops[ri] ?? 0, offset, rows).forEach((cell) => {
      if (cell.symbol !== "SCAT" || cell.stripIndex === null || cell.row >= 4) return;
      const key  = `${ri}-${cell.stripIndex}`;
      const scat = scatColors[key];
      if (scat && featureKeys.includes(scat.key)) {
        const value = scatValues[key] || "1";
        coins.push({ position: ri * 4 + cell.row, value, fromBase: true, featureKey: scat.key });
      }
    });
  });
  return coins;
}
