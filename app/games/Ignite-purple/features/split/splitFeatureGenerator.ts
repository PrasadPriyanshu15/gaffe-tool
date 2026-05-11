/* eslint-disable @typescript-eslint/no-explicit-any */

export const SPLIT_COIN_COLORS = [
  { label: "All-Color (19)", value: 19 },
  { label: "Orange (4)",   value: 4  },
  { label: "Blue (9)",    value: 9  },
  { label: "Green (14)", value: 14 },
];

export const SPLIT_COIN_VALUES = ["1", "2", "5", "Minor", "Major" , "Mini"];

// How many extra split coins (beyond coin 1) can have boost values in Strike+Split combo
// Coin 1 boost → existing boostValues[pos], Coins 2/3/4 → splitCoinsBoostValues arrays
export const SPLIT_BOOST_VALUES = ["0", "0.5", "1", "2", "5"];

// Max split count per coin
export const SPLIT_COUNT_OPTIONS = [1, 2, 3, 4];

export type SplitFeatureCoin = {
  position:   number;    // 0–14, column-major (col*3+row)
  colorCode:  number;    // 4 | 9 | 14 | 19
  value:      string;
  splitCount: number;    // 1–4: how many coins this scat splits into
  // Strike+Split only: boost values for extra split coins (index 0 = coin2, 1 = coin3, 2 = coin4)
  splitBoostValues?: string[]; // length up to 3 (for coins 2,3,4)
  winged?:    boolean;   // true if from a strike-origin scat (for Strike+Split combo)
  boostValue?: string;   // boost for coin 1 (when winged, same as Strike)
  fromBase?:  boolean;
};

/**
 * Generate the Split Feature output line (single feature).
 *
 * reelStopPositions: 15-slot array, colorCode at each coin position (0 = empty)
 * landedCoinsInBonusBoost: [[pos, colorCode, value], ...]
 * numberOfSplitCoins: [0,0,N,0,...] — N = splitCount at that position
 */
export function generateSplitFeatureGaffe(coins: SplitFeatureCoin[]): string {
  const reelStopPositions = Array(15).fill(0);
  coins.forEach((c) => { reelStopPositions[c.position] = c.colorCode; });

  const sorted = [...coins].sort((a, b) => a.position - b.position);

  const landedCoins = sorted.map((c) => [c.position, c.colorCode, c.value]);

  const numberOfSplitCoins = Array(15).fill(0);
  coins.forEach((c) => { numberOfSplitCoins[c.position] = c.splitCount; });

  let result = `[reelStopPositions: [${reelStopPositions.join(",")}]`;

  if (landedCoins.length > 0) {
    result += `, landedCoinsInBonusBoost: [${landedCoins.map((c: any) => `[${c.join(",")}]`).join(", ")}]`;
  }

  // Only emit if any coin has split
  const hasSplit = coins.some((c) => c.splitCount > 1);
  if (hasSplit) {
    result += `, numberOfSplitCoins: [${numberOfSplitCoins.join(",")}]`;
  }

  result += `]`;
  return result;
}

/**
 * Generate Split+Strike combination output.
 * Adds boostValues (for coin 1 of each winged coin) and
 * splitCoinsBoostValues (for coins 2/3/4 of split winged coins).
 */
export function generateSplitStrikeGaffe(coins: SplitFeatureCoin[]): string {
  const reelStopPositions = Array(15).fill(0);
  coins.forEach((c) => { reelStopPositions[c.position] = c.colorCode; });

  const sorted = [...coins].sort((a, b) => a.position - b.position);

  // landedCoinsInBonusBoost: include "winged" tag for winged coins, plus split count as 5th ele
  const landedCoins = sorted.map((c) => {
    const row: any[] = [c.position, c.colorCode, c.value];
    if (c.winged) row.push("winged");
    if (c.splitCount > 1) row.push(c.splitCount);
    return row;
  });

  // boostValues — coin 1 of each winged coin
  const boostValues = Array(15).fill(0);
  let hasBoost = false;
  coins.forEach((c) => {
    if (c.winged && c.boostValue !== undefined && c.boostValue !== "") {
      const n = Number(c.boostValue);
      boostValues[c.position] = isNaN(n) ? c.boostValue : n;
      if (n !== 0) hasBoost = true;
    }
  });

  // numberOfSplitCoins
  const numberOfSplitCoins = Array(15).fill(0);
  coins.forEach((c) => { numberOfSplitCoins[c.position] = c.splitCount; });
  const hasSplit = coins.some((c) => c.splitCount > 1);

  // splitCoinsBoostValues — up to 3 arrays (coins 2, 3, 4 for each split winged coin)
  // Each of the 3 arrays is 15-slot, value at the position of the split coin
  // Only emitted when a winged coin has splitCount > 1 and has extra boost values
  const splitBoostArrays: (number | string)[][] = [
    Array(15).fill(0),
    Array(15).fill(0),
    Array(15).fill(0),
  ];
  let hasSplitBoost = false;
  coins.forEach((c) => {
    if (c.winged && c.splitCount > 1 && c.splitBoostValues) {
      c.splitBoostValues.forEach((bv, idx) => {
        if (bv !== undefined && bv !== "") {
          const n = Number(bv);
          splitBoostArrays[idx][c.position] = isNaN(n) ? bv : n;
          if (n !== 0) hasSplitBoost = true;
        }
      });
    }
  });

  let result = `[reelStopPositions: [${reelStopPositions.join(",")}]`;

  if (landedCoins.length > 0) {
    result += `, landedCoinsInBonusBoost: [${landedCoins.map((c: any) => `[${c.join(",")}]`).join(",")}]`;
  }

  if (hasBoost) {
    result += `, boostValues: [${boostValues.join(",")}]`;
  }

  if (hasSplit) {
    result += `, numberOfSplitCoins: [${numberOfSplitCoins.join(",")}]`;
  }

  if (hasSplitBoost) {
    // Only include arrays for the extra split coins that exist
    // Determine max extra coins needed across all split coins
    const maxExtra = Math.max(...coins.filter((c) => c.winged).map((c) => c.splitCount - 1), 0);
    const arraysToInclude = splitBoostArrays.slice(0, maxExtra);
    result += `, splitCoinsBoostValues: [${arraysToInclude.map((arr) => `[${arr.join(",")}]`).join(",")}]`;
  }

  result += `]`;
  return result;
}
