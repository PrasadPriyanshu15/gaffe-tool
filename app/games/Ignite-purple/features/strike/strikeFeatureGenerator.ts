// /* eslint-disable @typescript-eslint/no-explicit-any */

// export const STRIKE_COIN_COLORS = [
//   { label: "Blue (4)",    value: 4  },
//   { label: "Cerise (9)",   value: 9  },
//   { label: "Green (14)", value: 14 },
//   { label: "All-Scat (19)", value: 19 },
// ];

// export const STRIKE_COIN_VALUES = ["1", "2", "5", "Minor", "Major" , "Mini"];

// // Boost values selectable per winged coin position
// export const STRIKE_BOOST_VALUES = ["0", "0.5", "1", "2", "5"];

// export type StrikeFeatureCoin = {
//   position: number;       // 0–14, column-major (col*3+row)
//   colorCode: number;      // 4 | 9 | 14 | 19
//   value: string;
//   winged: boolean;        // true → 🪽🟡🪽, false → 🟡
//   boostValue?: string;    // only used when winged=true
//   fromBase?: boolean;
// };

// /**
//  * Generate the Strike Feature output line.
//  *
//  * reelStopPositions: 15-element array — 0 = empty, colorCode = coin present
//  * landedCoinsInBonusBoost: [[pos, colorCode, value] or [pos, colorCode, value, "winged"]]
//  * boostValues: [15 numbers] — only output if at least one winged coin has a boost set
//  */
// export function generateStrikeFeatureGaffe(coins: StrikeFeatureCoin[]): string {
//   // reelStopPositions
//   const reelStopPositions = Array(15).fill(0);
//   coins.forEach((c) => { reelStopPositions[c.position] = c.colorCode; });

//   // landedCoinsInBonusBoost
//   // Sort by position ascending for clean output
//   const sorted = [...coins].sort((a, b) => a.position - b.position);
//   const landedCoins = sorted.map((c) =>
//     c.winged
//       ? [c.position, c.colorCode, c.value, "winged"]
//       : [c.position, c.colorCode, c.value]
//   );

//   // boostValues array (15 slots)
//   const boostValues = Array(15).fill(0);
//   let hasBoost = false;
//   coins.forEach((c) => {
//     if (c.winged && c.boostValue !== undefined && c.boostValue !== "") {
//       const num = Number(c.boostValue);
//       boostValues[c.position] = isNaN(num) ? c.boostValue : num;
//       if (num !== 0) hasBoost = true;
//     }
//   });

//   let result = `[reelStopPositions: [${reelStopPositions.join(",")}]`;

//   if (landedCoins.length > 0) {
//     const fmt = landedCoins
//       .map((c: any) => `[${c.join(",")}]`)
//       .join(",");
//     result += `,landedCoinsInBonusBoost:[${fmt}]`;
//   }

//   if (hasBoost) {
//     result += `,boostValues:[${boostValues.join(",")}]`;
//   }

//   result += `]`;
//   return result;
// }



//! latest 
// /* eslint-disable @typescript-eslint/no-explicit-any */

// export const STRIKE_COIN_COLORS = [
//   { label: "Blue (4)",    value: 4  },
//   { label: "Cerise (9)",   value: 9  },
//   { label: "Green (14)", value: 14 },
//   { label: "All-Scat (19)", value: 19 },
// ];

// export const STRIKE_COIN_VALUES = ["1", "2", "5", "Minor", "Major" , "Mini"];

// // Boost values selectable per winged coin position
// export const STRIKE_BOOST_VALUES = ["0", "0.5", "1", "2", "5"];

// export type StrikeFeatureCoin = {
//   position: number;       // 0–14, column-major (col*3+row)
//   colorCode: number;      // 4 | 9 | 14 | 19
//   value: string;
//   winged: boolean;        // true → 🪽🟡🪽, false → 🟡
//   boostValue?: string;    // only used when winged=true
//   fromBase?: boolean;
// };

// export type UpgradeInfoSingle = {
//   pos:              number;
//   features:         string[];
//   zoneSplitter?:    number;
//   zoneMultipliers?: number[];
// };

// /**
//  * Generate the Strike Feature output line.
//  *
//  * reelStopPositions: 15-element array — 0 = empty, colorCode = coin present
//  * landedCoinsInBonusBoost: [[pos, colorCode, value] or [pos, colorCode, value, "winged"]]
//  * boostValues: [15 numbers] — only output if at least one winged coin has a boost set
//  */
// export function generateStrikeFeatureGaffe(coins: StrikeFeatureCoin[], upgrade?: UpgradeInfoSingle | null): string {
//   // reelStopPositions
//   const reelStopPositions = Array(15).fill(0);
//   coins.forEach((c) => { reelStopPositions[c.position] = c.colorCode; });

//   // landedCoinsInBonusBoost
//   // Sort by position ascending for clean output
//   const sorted = [...coins].sort((a, b) => a.position - b.position);
//   const landedCoins = sorted.map((c) =>
//     c.winged
//       ? [c.position, c.colorCode, c.value, "winged"]
//       : [c.position, c.colorCode, c.value]
//   );

//   // boostValues array (15 slots)
//   const boostValues = Array(15).fill(0);
//   let hasBoost = false;
//   coins.forEach((c) => {
//     if (c.winged && c.boostValue !== undefined && c.boostValue !== "") {
//       const num = Number(c.boostValue);
//       boostValues[c.position] = isNaN(num) ? c.boostValue : num;
//       if (num !== 0) hasBoost = true;
//     }
//   });

//   let result = `[reelStopPositions: [${reelStopPositions.join(",")}]`;

//   if (landedCoins.length > 0) {
//     const fmt = landedCoins
//       .map((c: any) => `[${c.join(",")}]`)
//       .join(",");
//     result += `,landedCoinsInBonusBoost:[${fmt}]`;
//   }

//   if (hasBoost) {
//     result += `,boostValues:[${boostValues.join(",")}]`;
//   }

//   result += `]`;

//   if (upgrade && upgrade.features.length > 0) {
//     result = result.slice(0, -1);
//     result += `, upgradeCoinPosition: ${upgrade.pos}`;
//     result += `, additionalFeatureTriggered: [${upgrade.features.map((f) => f.toLowerCase()).join(",")}]`;
//     if (upgrade.zoneSplitter)
//       result += `, upgradeZoneSplitter: ${upgrade.zoneSplitter}`;
//     if (upgrade.zoneMultipliers && upgrade.zoneMultipliers.length > 0)
//       result += `, upgradeZoneMultipliers: [${upgrade.zoneMultipliers.join(",")}]`;
//     result += `]`;
//   }

//   return result;
// }





/* eslint-disable @typescript-eslint/no-explicit-any */

export const STRIKE_COIN_COLORS = [
  { label: "Blue (4)",    value: 4  },
  { label: "Cerise (9)",   value: 9  },
  { label: "Green (14)", value: 14 },
  { label: "All-Scat (19)", value: 19 },
];

export const STRIKE_COIN_VALUES = ["1", "2", "5", "Minor", "Major" , "Mini"];

// Boost values selectable per winged coin position
export const STRIKE_BOOST_VALUES = ["0", "0.5", "1", "2", "5"];

export type StrikeFeatureCoin = {
  position: number;       // 0–14, column-major (col*3+row)
  colorCode: number;      // 4 | 9 | 14 | 19
  value: string;
  winged: boolean;        // true → 🪽🟡🪽, false → 🟡
  boostValue?: string;    // only used when winged=true
  fromBase?: boolean;
};

export type UpgradeInfoSingle = {
  pos:              number;
  features:         string[];
  zoneSplitter?:    number;
  zoneMultipliers?: number[];
};

/**
 * Generate the Strike Feature output line.
 *
 * reelStopPositions: 15-element array — 0 = empty, colorCode = coin present
 * landedCoinsInBonusBoost: [[pos, colorCode, value] or [pos, colorCode, value, "winged"]]
 * boostValues: [15 numbers] — only output if at least one winged coin has a boost set
 */
export function generateStrikeFeatureGaffe(coins: StrikeFeatureCoin[], upgrade?: UpgradeInfoSingle | null): string {
  // reelStopPositions
  const reelStopPositions = Array(15).fill(0);
  coins.forEach((c) => { reelStopPositions[c.position] = c.colorCode; });

  // landedCoinsInBonusBoost
  // Sort by position ascending for clean output
  const sorted = [...coins].sort((a, b) => a.position - b.position);
  const landedCoins = sorted.map((c) =>
    c.winged
      ? [c.position, c.colorCode, c.value, "winged"]
      : [c.position, c.colorCode, c.value]
  );

  // boostValues array (15 slots)
  const boostValues = Array(15).fill(0);
  let hasBoost = false;
  coins.forEach((c) => {
    if (c.winged && c.boostValue !== undefined && c.boostValue !== "") {
      const num = Number(c.boostValue);
      boostValues[c.position] = isNaN(num) ? c.boostValue : num;
      if (num !== 0) hasBoost = true;
    }
  });

  let result = `[reelStopPositions: [${reelStopPositions.join(",")}]`;

  if (landedCoins.length > 0) {
    const fmt = landedCoins
      .map((c: any) => `[${c.join(",")}]`)
      .join(",");
    result += `,landedCoinsInBonusBoost:[${fmt}]`;
  }

  if (hasBoost) {
    result += `,boostValues:[${boostValues.join(",")}]`;
  }

  result += `]`;

  if (upgrade && upgrade.features.length > 0) {
    result = result.slice(0, -1);
    result += `, additionalFeatureTriggered: [${upgrade.features.map((f) => f.toLowerCase()).join(",")}]`;
    if (upgrade.zoneSplitter)
      result += `, upgradeZoneSplitter: ${upgrade.zoneSplitter}`;
    if (upgrade.zoneMultipliers && upgrade.zoneMultipliers.length > 0)
      result += `, upgradeZoneMultipliers: [${upgrade.zoneMultipliers.join(",")}]`;
    result += `]`;
  }

  return result;
}