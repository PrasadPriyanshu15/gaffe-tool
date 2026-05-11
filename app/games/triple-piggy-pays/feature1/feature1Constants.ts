// feature1/feature1Constants.ts
// All constants and pure (non-React) helpers shared across feature1 files.

import type { Cell, FeatureType } from "../features/featureTypes";

export const STD_ROWS = 4;
export const COLS     = 5;

/**
 * Maps a TRIGGER cell's triggerColor to the feature it would unlock on upgrade.
 *   RED    → WHEEL
 *   BLUE   → TOWER
 *   PURPLE → ZONE
 */
export const TRIGGER_COLOR_TO_FEATURE: Record<string, FeatureType> = {
  RED:    "WHEEL",
  BLUE:   "TOWER",
  PURPLE: "ZONE",
};

/** Returns a fresh empty grid of the given dimensions. */
export const emptyGrid = (rows: number): Cell[][] =>
  Array.from({ length: rows }, () =>
    Array.from({ length: COLS }, () => ({ type: "EMPTY" as const }))
  );