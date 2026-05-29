

// /* eslint-disable @typescript-eslint/no-explicit-any */

// import { VISIBLE_OFFSETS } from "./ReelColumn";

// type ScatType = { key: string; label: string };

// function findAllScatPositions(reels: string[][]): Array<{ reelIndex: number; arrayIndex: number }> {
//   const out: Array<{ reelIndex: number; arrayIndex: number }> = [];
//   reels.forEach((reel, ri) => reel.forEach((sym, ai) => { if (sym === "SCAT") out.push({ reelIndex: ri, arrayIndex: ai }); }));
//   return out;
// }

// function anyScatVisible(reelStops: number[], reels: string[][]): boolean {
//   return reelStops.some((stop, ri) => {
//     const reel = reels[ri]; const len = reel.length;
//     return VISIBLE_OFFSETS.some((off) => reel[((stop + off) % len + len) % len] === "SCAT");
//   });
// }

// function anyStackVisible(reelStops: number[], reels: string[][]): boolean {
//   return reelStops.some((stop, ri) => {
//     const reel = reels[ri]; const len = reel.length;
//     return VISIBLE_OFFSETS.some((off) => reel[((stop + off) % len + len) % len].startsWith("STACK"));
//   });
// }

// export function generateGaffe(
//   reelStops:        number[],
//   reels:            string[][],
//   scatColors:       { [key: string]: ScatType },
//   scatValues:       { [key: string]: string },
//   selectedFeatures: string[],
//   featureEnabled:   boolean,
//   grandEnabled:     boolean,
//   majorEnabled:     boolean,
//   stackSymbol:      string | null
// ): Record<string, any> {
//   const result: Record<string, any> = { reelStopPositions: reelStops };

//   if (anyScatVisible(reelStops, reels)) {
//     const allPos = findAllScatPositions(reels);
//     const hasAssigned = allPos.some(({ reelIndex, arrayIndex }) => !!scatColors[`${reelIndex}-${arrayIndex}`]);
//     if (hasAssigned) {
//       result.scatReplacement = allPos.map(({ reelIndex, arrayIndex }) =>
//         scatColors[`${reelIndex}-${arrayIndex}`]?.label ?? "PURPLE_SCAT"
//       );
//     }
//   }

//   if (stackSymbol && anyStackVisible(reelStops, reels)) result.stack = stackSymbol;
//   if (grandEnabled) result.triggerGrandJackpot = true;
//   if (majorEnabled) result.triggerMajorJackpot = true;

//   if (!featureEnabled) {
//     result.triggerFeaturesed = false;
//   } else if (selectedFeatures.length > 0) {
//     result.triggerFeaturesed = selectedFeatures;
//   }

//   // landedCoins: visible SCaTs with a value
//   const landedCoins: any[] = [];
//   reelStops.forEach((stop, ri) => {
//     const reel = reels[ri]; const len = reel.length;
//     VISIBLE_OFFSETS.forEach((off, rowIdx) => {
//       const idx = ((stop + off) % len + len) % len;
//       if (reel[idx] === "SCAT") {
//         const value = scatValues[`${ri}-${idx}`];
//         if (value && value !== "") landedCoins.push([ri, rowIdx, value]);
//       }
//     });
//   });
//   if (landedCoins.length > 0) result.landedCoins = landedCoins;

//   return result;
// }

// // ─── Base coin type ───────────────────────────────────────────────────────────
// export type BaseCoin = { position: number; value: string; fromBase: true };

// /**
//  * Extract base coins for a feature.
//  * FIXED: seeds coin even when no value is set (defaults to "1").
//  * Only requires the SCAT colour to match the feature key.
//  */
// export function getBaseCoinsForFeature(
//   featureKey: string,
//   reelStops:  number[],
//   reels:      string[][],
//   scatColors: { [key: string]: { key: string; label: string } },
//   scatValues: { [key: string]: string }
// ): BaseCoin[] {
//   const coins: BaseCoin[] = [];
//   reelStops.forEach((stop, ri) => {
//     const reel = reels[ri]; const len = reel.length;
//     VISIBLE_OFFSETS.forEach((off, rowIdx) => {
//       const idx  = ((stop + off) % len + len) % len;
//       if (reel[idx] === "SCAT") {
//         const key  = `${ri}-${idx}`;
//         const scat = scatColors[key];
//         if (scat && scat.key === featureKey) {
//           // Use set value, or default "1" so the coin always seeds
//           const value = scatValues[key] || "1";
//           coins.push({ position: ri * 4 + rowIdx, value, fromBase: true });
//         }
//       }
//     });
//   });
//   return coins;
// }

// /**
//  * Collect base coins for ALL active features (used by combination).
//  * Returns merged array — each coin tagged with which feature it came from.
//  */
// export function getBaseCoinsForCombination(
//   featureKeys: string[],
//   reelStops:   number[],
//   reels:       string[][],
//   scatColors:  { [key: string]: { key: string; label: string } },
//   scatValues:  { [key: string]: string }
// ): Array<BaseCoin & { featureKey: string }> {
//   const coins: Array<BaseCoin & { featureKey: string }> = [];
//   reelStops.forEach((stop, ri) => {
//     const reel = reels[ri]; const len = reel.length;
//     VISIBLE_OFFSETS.forEach((off, rowIdx) => {
//       const idx  = ((stop + off) % len + len) % len;
//       if (reel[idx] === "SCAT") {
//         const key  = `${ri}-${idx}`;
//         const scat = scatColors[key];
//         if (scat && featureKeys.includes(scat.key)) {
//           const value = scatValues[key] || "1";
//           coins.push({ position: ri * 4 + rowIdx, value, fromBase: true, featureKey: scat.key });
//         }
//       }
//     });
//   });
//   return coins;
// }



// /* eslint-disable @typescript-eslint/no-explicit-any */

// import { VISIBLE_OFFSETS } from "./ReelColumn";

// type ScatType = {
//   key: string;
//   label: string;
// };

// /**
//  * Pre-scan all reel strips and return every SCAT position in sequence order.
//  * Iterates reels left-to-right; within each reel, top-to-bottom.
//  * This produces the 6 canonical slots:
//  *   [reel1_scat, reel2_scat, reel3_scat1, reel3_scat2, reel4_scat, reel5_scat]
//  */
// function findAllScatPositions(
//   reels: string[][]
// ): Array<{ reelIndex: number; arrayIndex: number }> {
//   const positions: Array<{ reelIndex: number; arrayIndex: number }> = [];
//   reels.forEach((reel, reelIndex) => {
//     reel.forEach((symbol, arrayIndex) => {
//       if (symbol === "SCAT") positions.push({ reelIndex, arrayIndex });
//     });
//   });
//   return positions;
// }

// // ─── Main generator ───────────────────────────────────────────────────────────

// /**
//  * Build the gaffe result object.
//  *
//  * scatReplacement always contains exactly 6 elements (one per SCAT symbol in
//  * all reel strips combined, in left-to-right / top-to-bottom order).
//  * Each element is the assigned label (PURPLE_SCAT / BLUE_SCAT / RED_SCAT) or
//  * "PURPLE_SCAT" as the default for any unassigned position.
//  * The field is omitted entirely if no SCAT has been assigned a colour yet.
//  *
//  * All other fields are only emitted when they carry an actual value.
//  */
// export function generateGaffe(
//   reelStops:        number[],
//   reels:            string[][],
//   scatColors:       { [key: string]: ScatType },
//   scatValues:       { [key: string]: string },
//   selectedFeatures: string[],
//   featureEnabled:   boolean,
//   grandEnabled:     boolean,
//   majorEnabled:     boolean,
//   stackSymbol:      string | null
// ): Record<string, any> {
//   const result: Record<string, any> = {
//     reelStopPositions: reelStops,
//   };

//   // ── scatReplacement: always 6 elements ────────────────────────────────────
//   const allScatPos = findAllScatPositions(reels);

//   const hasAnyScat = allScatPos.some(
//     ({ reelIndex, arrayIndex }) => !!scatColors[`${reelIndex}-${arrayIndex}`]
//   );

//   if (hasAnyScat) {
//     result.scatReplacement = allScatPos.map(({ reelIndex, arrayIndex }) => {
//       const key = `${reelIndex}-${arrayIndex}`;
//       // Use assigned label; fall back to PURPLE_SCAT for unassigned positions
//       return scatColors[key]?.label ?? "PURPLE_SCAT";
//     });
//   }

//   // ── stack ─────────────────────────────────────────────────────────────────
//   if (stackSymbol) result.stack = stackSymbol;

//   // ── jackpots ──────────────────────────────────────────────────────────────
//   if (grandEnabled) result.triggerGrandJackpot = true;
//   if (majorEnabled) result.triggerMajorJackpot = true;

//   // ── triggerFeaturesed ──────────────────────────────────────────────────────
//   // Only add:  false when feature is disabled,  array when features selected
//   if (!featureEnabled) {
//     result.triggerFeaturesed = false;
//   } else if (selectedFeatures.length > 0) {
//     result.triggerFeaturesed = selectedFeatures;
//   }
//   // When enabled but nothing selected → omit entirely

//   // ── landedCoins: only currently visible SCaTs with a value set ────────────
//   const landedCoins: any[] = [];

//   reelStops.forEach((stop, reelIndex) => {
//     const reel = reels[reelIndex];
//     const len  = reel.length;

//     VISIBLE_OFFSETS.forEach((offset, rowIndex) => {
//       const index = ((stop + offset) % len + len) % len;

//       if (reel[index] === "SCAT") {
//         const key   = `${reelIndex}-${index}`;
//         const value = scatValues[key];
//         if (value && value !== "") {
//           landedCoins.push([reelIndex, rowIndex, value]);
//         }
//       }
//     });
//   });

//   if (landedCoins.length > 0) result.landedCoins = landedCoins;

//   return result;
// }

// // ─── Feature base-coin extractor ─────────────────────────────────────────────

// export type BaseCoin = {
//   /** Column-major position in 5×4 grid: col*4 + row  (0–19) */
//   position: number;
//   value:    string;
//   fromBase: true;
// };

// export function getBaseCoinsForFeature(
//   featureKey:  string,
//   reelStops:   number[],
//   reels:       string[][],
//   scatColors:  { [key: string]: { key: string; label: string } },
//   scatValues:  { [key: string]: string }
// ): BaseCoin[] {
//   const coins: BaseCoin[] = [];

//   reelStops.forEach((stop, reelIndex) => {
//     const reel = reels[reelIndex];
//     const len  = reel.length;

//     VISIBLE_OFFSETS.forEach((offset, rowIndex) => {
//       const index = ((stop + offset) % len + len) % len;

//       if (reel[index] === "SCAT") {
//         const key   = `${reelIndex}-${index}`;
//         const scat  = scatColors[key];
//         const value = scatValues[key];

//         if (scat && scat.key === featureKey && value && value !== "") {
//           coins.push({ position: reelIndex * 4 + rowIndex, value, fromBase: true });
//         }
//       }
//     });
//   });

//   return coins;
// }

/* eslint-disable @typescript-eslint/no-explicit-any */

import { VISIBLE_OFFSETS } from "./ReelColumn";

type ScatType = { key: string; label: string };

function findAllScatPositions(reels: string[][]): Array<{ reelIndex: number; arrayIndex: number }> {
  const out: Array<{ reelIndex: number; arrayIndex: number }> = [];
  reels.forEach((reel, ri) => reel.forEach((sym, ai) => { if (sym === "SCAT") out.push({ reelIndex: ri, arrayIndex: ai }); }));
  return out;
}

function anyScatVisible(reelStops: number[], reels: string[][]): boolean {
  return reelStops.some((stop, ri) => {
    const reel = reels[ri]; const len = reel.length;
    return VISIBLE_OFFSETS.some((off) => reel[((stop + off) % len + len) % len] === "SCAT");
  });
}

function anyStackVisible(reelStops: number[], reels: string[][]): boolean {
  return reelStops.some((stop, ri) => {
    const reel = reels[ri]; const len = reel.length;
    return VISIBLE_OFFSETS.some((off) => reel[((stop + off) % len + len) % len].startsWith("STACK"));
  });
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
  stackSymbol:      string | null
): Record<string, any> {
  const result: Record<string, any> = { reelStopPositions: reelStops };

  if (anyScatVisible(reelStops, reels)) {
    const allPos = findAllScatPositions(reels);
    const hasAssigned = allPos.some(({ reelIndex, arrayIndex }) => !!scatColors[`${reelIndex}-${arrayIndex}`]);
    if (hasAssigned) {
      result.scatReplacement = allPos.map(({ reelIndex, arrayIndex }) =>
        scatColors[`${reelIndex}-${arrayIndex}`]?.label ?? "PURPLE_SCAT"
      );
    }
  }

  if (stackSymbol && anyStackVisible(reelStops, reels)) result.stack = stackSymbol;
  if (grandEnabled) result.triggerGrandJackpot = true;
  if (majorEnabled) result.triggerMajorJackpot = true;

  if (!featureEnabled) {
    result.triggerFeatures = false;
  } else if (selectedFeatures.length > 0) {
    result.triggerFeatures = selectedFeatures;
  }

  // landedCoins: flat array of values for each visible SCAT, in left-to-right / top-to-bottom order
  const landedCoins: string[] = [];
  reelStops.forEach((stop, ri) => {
    const reel = reels[ri]; const len = reel.length;
    VISIBLE_OFFSETS.forEach((off) => {
      const idx = ((stop + off) % len + len) % len;
      if (reel[idx] === "SCAT") {
        const value = scatValues[`${ri}-${idx}`];
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
 * Extract base coins for a feature.
 * FIXED: seeds coin even when no value is set (defaults to "1").
 * Only requires the SCAT colour to match the feature key.
 */
export function getBaseCoinsForFeature(
  featureKey: string,
  reelStops:  number[],
  reels:      string[][],
  scatColors: { [key: string]: { key: string; label: string } },
  scatValues: { [key: string]: string }
): BaseCoin[] {
  const coins: BaseCoin[] = [];
  reelStops.forEach((stop, ri) => {
    const reel = reels[ri]; const len = reel.length;
    VISIBLE_OFFSETS.forEach((off, rowIdx) => {
      const idx  = ((stop + off) % len + len) % len;
      if (reel[idx] === "SCAT") {
        const key  = `${ri}-${idx}`;
        const scat = scatColors[key];
        if (scat && scat.key === featureKey) {
          // Use set value, or default "1" so the coin always seeds
          const value = scatValues[key] || "1";
          coins.push({ position: ri * 4 + rowIdx, value, fromBase: true });
        }
      }
    });
  });
  return coins;
}

/**
 * Collect base coins for ALL active features (used by combination).
 * Returns merged array — each coin tagged with which feature it came from.
 */
export function getBaseCoinsForCombination(
  featureKeys: string[],
  reelStops:   number[],
  reels:       string[][],
  scatColors:  { [key: string]: { key: string; label: string } },
  scatValues:  { [key: string]: string }
): Array<BaseCoin & { featureKey: string }> {
  const coins: Array<BaseCoin & { featureKey: string }> = [];
  reelStops.forEach((stop, ri) => {
    const reel = reels[ri]; const len = reel.length;
    VISIBLE_OFFSETS.forEach((off, rowIdx) => {
      const idx  = ((stop + off) % len + len) % len;
      if (reel[idx] === "SCAT") {
        const key  = `${ri}-${idx}`;
        const scat = scatColors[key];
        if (scat && featureKeys.includes(scat.key)) {
          const value = scatValues[key] || "1";
          coins.push({ position: ri * 4 + rowIdx, value, fromBase: true, featureKey: scat.key });
        }
      }
    });
  });
  return coins;
}