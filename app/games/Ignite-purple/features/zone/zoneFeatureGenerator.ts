// /* eslint-disable @typescript-eslint/no-explicit-any */

// export const ZONE_COIN_COLORS = [
//   { label: "Orange (4)",  value: 4  },
//   { label: "Pink (9)",   value: 9  },
//   { label: "Green (14)", value: 14 },
//   { label: "All-Color (19)", value: 19 },
// ];

// export const ZONE_COIN_VALUES = ["1", "2", "5", "Minor", "Major" , "Mini"];

// export type ZoneFeatureCoin = {
//   position: number;    // 0–14, column-major (col*3+row)
//   colorCode: number;   // 4 | 9 | 14 | 19
//   value: string;
//   fromBase?: boolean;
// };

// // ── ZONE BACKGROUND COLORS ────────────────────────────────────────────────────
// // Positions here are ROW-MAJOR .
// // Colors:  P = purple  |  B = blue  |  R = red  |  G = green

// type ZoneColor = "purple" | "blue" | "red" | "green";

// // ZONE_COLORS_ROW_MAJOR[splitter-1][rowMajorPos 0-14]
// const ZONE_COLORS_ROW_MAJOR: ZoneColor[][] = [
//   // S1: 0-3=P, 4=G, 5-6=B, 7-8=R, 9=B, 10-11=B, 12-13=R, 14=G
//   ["purple","purple","purple","purple","green",  "blue","blue","red","red","green",  "blue","blue","red","red","red"],
//   // S2: 0-1=P, 2-4=B, 5-6=P, 7-9=B, 10-11=G, 12-14=R
//   ["purple","purple","purple","blue","blue",  "purple","purple","blue","blue","blue",  "green","green","red","red","red"],
//   // S3: 0-1=B, 2-4=P, 5=R, 6-9=P, 10=R, 11-14=G
//   ["blue","blue","purple","purple","purple",  "blue","red","purple","green","purple",  "red","red","green","green","green"],
//   // S4: 0-1=P, 2-4=B, 5=G, 6-9=B, 10-11=G, 12-14=R
//   ["purple","purple","purple","blue","blue",  "green","purple","blue","blue","blue",  "green","green","red","red","red"],
//   // S5: 0-4=P, 5-9=R, 10=R, 11-14=G
//   ["purple","purple","purple","blue","blue",  "red","red","purple","blue","blue",  "red","red","green","green","green"],
//   // S6: 0-1=B, 2-4=P, 5-6=B, 7=R, 8=G, 9=P, 10-12=R, 13-14=G
//   ["blue","blue","purple","purple","purple",  "blue","blue","red","green","purple",  "red","red","red","green","green"],
//   // S7: 0-2=P, 3-4=B, 5-6=G, 7=B, 8-9=R, 10-11=G, 12-14=R
//   ["purple","purple","purple","blue","blue",  "green","purple","blue","blue","red",  "green","green","red","red","red"],
// ];

// // Tailwind classes for each zone color (muted, not too dark not too neon)
// export const ZONE_BG_CLASS: Record<ZoneColor, string> = {
//   purple: "bg-purple-800",
//   blue:   "bg-sky-700",
//   red:    "bg-red-800",
//   green:  "bg-emerald-700",
// };

// export const ZONE_BORDER_CLASS: Record<ZoneColor, string> = {
//   purple: "border-purple-500",
//   blue:   "border-sky-400",
//   red:    "border-red-500",
//   green:  "border-emerald-400",
// };

// /**
//  * Returns the zone background color for a given column-major position and splitter.
//  * splitter: 1–7  |  pos: 0–14 column-major (col*3+row)
//  */
// export function getZoneBgColor(pos: number, splitter: number): ZoneColor {
//   // Convert column-major pos → row-major pos for lookup
//   // column-major: col = Math.floor(pos/3), row = pos%3
//   // row-major: rowMajorPos = row*5 + col
//   const col = Math.floor(pos / 3);
//   const row = pos % 3;
//   const rowMajorPos = row * 5 + col;
//   return ZONE_COLORS_ROW_MAJOR[splitter - 1]?.[rowMajorPos] ?? "purple";
// }

// /**
//  * Generate the Zone Feature output line.
//  */
// export function generateZoneFeatureGaffe(
//   coins: ZoneFeatureCoin[],
//   splitter: number,
//   multipliers: number[]
// ): string {
//   const reelStopPositions = Array(15).fill(0);
//   coins.forEach((coin) => {
//     reelStopPositions[coin.position] = coin.colorCode;
//   });

//   const landedCoins = coins.map((c) => [c.position, c.colorCode, c.value]);

//   let result = `[reelStopPositions: [${reelStopPositions.join(",")}]`;

//   if (landedCoins.length > 0) {
//     const fmt = landedCoins.map((c: any) => `[${c[0]},${c[1]},${c[2]}]`).join(",");
//     result += `, landedCoinsInBonusBoost: [${fmt}]`;
//   }

//   if (splitter) result += `, zoneSplitter: ${splitter}`;
//   if (multipliers.length > 0) result += `, zoneMultipliers: [${multipliers.join(",")}]`;

//   result += `]`;
//   return result;
// }




//! latest
// /* eslint-disable @typescript-eslint/no-explicit-any */

// export const ZONE_COIN_COLORS = [
//   { label: "Orange (4)",  value: 4  },
//   { label: "Pink (9)",   value: 9  },
//   { label: "Green (14)", value: 14 },
//   { label: "All-Color (19)", value: 19 },
// ];

// export const ZONE_COIN_VALUES = ["1", "2", "5", "Minor", "Major" , "Mini"];

// export type ZoneFeatureCoin = {
//   position: number;    // 0–14, column-major (col*3+row)
//   colorCode: number;   // 4 | 9 | 14 | 19
//   value: string;
//   fromBase?: boolean;
// };

// export type UpgradeInfoSingle = {
//   pos:              number;
//   features:         string[];
//   zoneSplitter?:    number;
//   zoneMultipliers?: number[];
// };

// // ── ZONE BACKGROUND COLORS ────────────────────────────────────────────────────
// // Positions here are ROW-MAJOR .
// // Colors:  P = purple  |  B = blue  |  R = red  |  G = green

// type ZoneColor = "purple" | "blue" | "red" | "green";

// // ZONE_COLORS_ROW_MAJOR[splitter-1][rowMajorPos 0-14]
// const ZONE_COLORS_ROW_MAJOR: ZoneColor[][] = [
//   // S1: 0-3=P, 4=G, 5-6=B, 7-8=R, 9=B, 10-11=B, 12-13=R, 14=G
//   ["purple","purple","purple","purple","green",  "blue","blue","red","red","green",  "blue","blue","red","red","red"],
//   // S2: 0-1=P, 2-4=B, 5-6=P, 7-9=B, 10-11=G, 12-14=R
//   ["purple","purple","purple","blue","blue",  "purple","purple","blue","blue","blue",  "green","green","red","red","red"],
//   // S3: 0-1=B, 2-4=P, 5=R, 6-9=P, 10=R, 11-14=G
//   ["blue","blue","purple","purple","purple",  "blue","red","purple","green","purple",  "red","red","green","green","green"],
//   // S4: 0-1=P, 2-4=B, 5=G, 6-9=B, 10-11=G, 12-14=R
//   ["purple","purple","purple","blue","blue",  "green","purple","blue","blue","blue",  "green","green","red","red","red"],
//   // S5: 0-4=P, 5-9=R, 10=R, 11-14=G
//   ["purple","purple","purple","blue","blue",  "red","red","purple","blue","blue",  "red","red","green","green","green"],
//   // S6: 0-1=B, 2-4=P, 5-6=B, 7=R, 8=G, 9=P, 10-12=R, 13-14=G
//   ["blue","blue","purple","purple","purple",  "blue","blue","red","green","purple",  "red","red","red","green","green"],
//   // S7: 0-2=P, 3-4=B, 5-6=G, 7=B, 8-9=R, 10-11=G, 12-14=R
//   ["purple","purple","purple","blue","blue",  "green","purple","blue","blue","red",  "green","green","red","red","red"],
// ];

// // Tailwind classes for each zone color (muted, not too dark not too neon)
// export const ZONE_BG_CLASS: Record<ZoneColor, string> = {
//   purple: "bg-purple-800",
//   blue:   "bg-sky-700",
//   red:    "bg-red-800",
//   green:  "bg-emerald-700",
// };

// export const ZONE_BORDER_CLASS: Record<ZoneColor, string> = {
//   purple: "border-purple-500",
//   blue:   "border-sky-400",
//   red:    "border-red-500",
//   green:  "border-emerald-400",
// };

// /**
//  * Returns the zone background color for a given column-major position and splitter.
//  * splitter: 1–7  |  pos: 0–14 column-major (col*3+row)
//  */
// export function getZoneBgColor(pos: number, splitter: number): ZoneColor {
//   // Convert column-major pos → row-major pos for lookup
//   // column-major: col = Math.floor(pos/3), row = pos%3
//   // row-major: rowMajorPos = row*5 + col
//   const col = Math.floor(pos / 3);
//   const row = pos % 3;
//   const rowMajorPos = row * 5 + col;
//   return ZONE_COLORS_ROW_MAJOR[splitter - 1]?.[rowMajorPos] ?? "purple";
// }

// /**
//  * Generate the Zone Feature output line.
//  */
// export function generateZoneFeatureGaffe(
//   coins: ZoneFeatureCoin[],
//   splitter: number,
//   multipliers: number[],
//   upgrade?: UpgradeInfoSingle | null
// ): string {
//   const reelStopPositions = Array(15).fill(0);
//   coins.forEach((coin) => {
//     reelStopPositions[coin.position] = coin.colorCode;
//   });

//   const landedCoins = coins.map((c) => [c.position, c.colorCode, c.value]);

//   let result = `[reelStopPositions: [${reelStopPositions.join(",")}]`;

//   if (landedCoins.length > 0) {
//     const fmt = landedCoins.map((c: any) => `[${c[0]},${c[1]},${c[2]}]`).join(",");
//     result += `, landedCoinsInBonusBoost: [${fmt}]`;
//   }

//   if (splitter) result += `, zoneSplitter: ${splitter}`;
//   if (multipliers.length > 0) result += `, zoneMultipliers: [${multipliers.join(",")}]`;

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

export const ZONE_COIN_COLORS = [
  { label: "Orange (4)",  value: 4  },
  { label: "Pink (9)",   value: 9  },
  { label: "Green (14)", value: 14 },
  { label: "All-Color (19)", value: 19 },
];

export const ZONE_COIN_VALUES = ["1", "2", "5", "100" , "Minor", "Major" , "Mini"];

export type ZoneFeatureCoin = {
  position: number;    // 0–14, column-major (col*3+row)
  colorCode: number;   // 4 | 9 | 14 | 19
  value: string;
  fromBase?: boolean;
};

export type UpgradeInfoSingle = {
  pos:              number;
  features:         string[];
  zoneSplitter?:    number;
  zoneMultipliers?: number[];
};

// ── ZONE BACKGROUND COLORS ────────────────────────────────────────────────────
// Positions here are ROW-MAJOR .
// Colors:  P = purple  |  B = blue  |  R = red  |  G = green

type ZoneColor = "purple" | "blue" | "red" | "green";

// ZONE_COLORS_ROW_MAJOR[splitter-1][rowMajorPos 0-14]
const ZONE_COLORS_ROW_MAJOR: ZoneColor[][] = [
  // S1: 0-3=P, 4=G, 5-6=B, 7-8=R, 9=B, 10-11=B, 12-13=R, 14=G
  ["purple","purple","purple","purple","green",  "blue","blue","red","red","green",  "blue","blue","red","red","red"],
  // S2: 0-1=P, 2-4=B, 5-6=P, 7-9=B, 10-11=G, 12-14=R
  ["purple","purple","purple","blue","blue",  "purple","purple","blue","blue","blue",  "green","green","red","red","red"],
  // S3: 0-1=B, 2-4=P, 5=R, 6-9=P, 10=R, 11-14=G
  ["blue","blue","purple","purple","purple",  "blue","red","purple","green","purple",  "red","red","green","green","green"],
  // S4: 0-1=P, 2-4=B, 5=G, 6-9=B, 10-11=G, 12-14=R
  ["purple","purple","purple","blue","blue",  "green","purple","blue","blue","blue",  "green","green","red","red","red"],
  // S5: 0-4=P, 5-9=R, 10=R, 11-14=G
  ["purple","purple","purple","blue","blue",  "red","red","purple","blue","blue",  "red","red","green","green","green"],
  // S6: 0-1=B, 2-4=P, 5-6=B, 7=R, 8=G, 9=P, 10-12=R, 13-14=G
  ["blue","blue","purple","purple","purple",  "blue","blue","red","green","purple",  "red","red","red","green","green"],
  // S7: 0-2=P, 3-4=B, 5-6=G, 7=B, 8-9=R, 10-11=G, 12-14=R
  ["purple","purple","purple","blue","blue",  "green","purple","blue","blue","red",  "green","green","red","red","red"],
];

// Tailwind classes for each zone color (muted, not too dark not too neon)
export const ZONE_BG_CLASS: Record<ZoneColor, string> = {
  purple: "bg-purple-800",
  blue:   "bg-sky-700",
  red:    "bg-red-800",
  green:  "bg-emerald-700",
};

export const ZONE_BORDER_CLASS: Record<ZoneColor, string> = {
  purple: "border-purple-500",
  blue:   "border-sky-400",
  red:    "border-red-500",
  green:  "border-emerald-400",
};

/**
 * Returns the zone background color for a given column-major position and splitter.
 * splitter: 1–7  |  pos: 0–14 column-major (col*3+row)
 */
export function getZoneBgColor(pos: number, splitter: number): ZoneColor {
  // Convert column-major pos → row-major pos for lookup
  // column-major: col = Math.floor(pos/3), row = pos%3
  // row-major: rowMajorPos = row*5 + col
  const col = Math.floor(pos / 3);
  const row = pos % 3;
  const rowMajorPos = row * 5 + col;
  return ZONE_COLORS_ROW_MAJOR[splitter - 1]?.[rowMajorPos] ?? "purple";
}

/**
 * Generate the Zone Feature output line.
 */
export function generateZoneFeatureGaffe(
  coins: ZoneFeatureCoin[],
  splitter: number,
  multipliers: number[],
  upgrade?: UpgradeInfoSingle | null
): string {
  const reelStopPositions = Array(15).fill(0);
  coins.forEach((coin) => {
    reelStopPositions[coin.position] = coin.colorCode;
  });

  const landedCoins = coins.map((c) => [c.position, c.colorCode, c.value]);

  let result = `[reelStopPositions: [${reelStopPositions.join(",")}]`;

  if (landedCoins.length > 0) {
    const fmt = landedCoins.map((c: any) => `[${c[0]},${c[1]},${c[2]}]`).join(",");
    result += `, landedCoinsInBonusBoost: [${fmt}]`;
  }

  if (splitter) result += `, zoneSplitter: ${splitter}`;
  if (multipliers.length > 0) result += `, zoneMultipliers: [${multipliers.join(",")}]`;

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