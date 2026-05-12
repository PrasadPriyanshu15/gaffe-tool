// /* eslint-disable @typescript-eslint/no-explicit-any */
// import { posToCol, posToRow } from "./config";

// export const EXTRA_COIN_COLORS = [
//   { label: "Orange(4)",    value: 4  },
//   { label: "Blue(9)",      value: 9  },
//   { label: "Pink(14)",     value: 14 },
//   { label: "AllColor(19)", value: 19 },
// ];
// export const EXTRA_COIN_VALUES = ["1", "2", "5", "Minor", "Major", "Mini"];

// export type ExtraFeatureCoin = {
//   position:  number;
//   colorCode: number;
//   value:     string;
//   fromBase?: boolean;
// };

// export type UpgradeInfo = { col: number; row: number; features: string[] };

// /**
//  * Generate Extra Feature gaffe line.
//  * Adds lastPositionReel:bonus-boost automatically when 14+ coins are placed.
//  */
// export function generateExtraFeatureGaffe(
//   coins:   ExtraFeatureCoin[],
//   upgrade?: UpgradeInfo | null
// ): string {
//   const rsp = Array(15).fill(0);
//   coins.forEach(c => { rsp[c.position] = c.colorCode; });

//   const sorted = [...coins].sort((a, b) => a.position - b.position);
//   const lc = sorted.map(c => [posToCol(c.position), posToRow(c.position), c.value]);

//   let out = `[reelStopPositions:[${rsp.join(",")}]`;
//   if (lc.length)        out += `,landedCoins:[${lc.map((c: any) => `[${c.join(",")}]`).join(",")}]`;
//   if (coins.length >= 14) out += `,lastPositionReel:bonus-boost`;
//   if (upgrade)          out += `,goodPosition:[${upgrade.col},${upgrade.row}],additionalFeatureTriggered:[${upgrade.features.join(",")}]`;
//   out += `]`;
//   return out;
// }


/* eslint-disable @typescript-eslint/no-explicit-any */
import { posToCol, posToRow } from "./config";

export const EXTRA_COIN_COLORS = [
  { label: "Orange(4)",    value: 4  },
  { label: "Blue(9)",      value: 9  },
  { label: "Purple(14)",     value: 14 },
  { label: "AllColor(19)", value: 19 },
];
export const EXTRA_COIN_VALUES = ["1", "2", "5", "MINOR", "MAJOR", "MINI"];

export type ExtraFeatureCoin = {
  position:  number;
  colorCode: number;
  value:     string;
  fromBase?: boolean;
};

export type UpgradeInfo = { col: number; row: number; features: string[] };

/**
 * Generate Extra Feature gaffe line.
 * Adds lastPositionReel:bonus-boost automatically when 14+ coins are placed.
 */
export function generateExtraFeatureGaffe(
  coins:   ExtraFeatureCoin[],
  upgrade?: UpgradeInfo | null
): string {
  const rsp = Array(15).fill(0);
  coins.forEach(c => { rsp[c.position] = c.colorCode; });

  const sorted = [...coins].sort((a, b) => a.position - b.position);
  // Fix #5: wrap value in COIN_VALUE format
  const lc = sorted.map(c => [posToCol(c.position), posToRow(c.position), `COIN_${c.value}`]);

  let out = `[reelStopPositions:[${rsp.join(",")}]`;
  if (lc.length)        out += `,landedCoins:[${lc.map((c: any) => `[${c.join(",")}]`).join(",")}]`;
  if (coins.length >= 14) out += `,lastPositionReel:bonus-boost`;
  if (upgrade)          out += `,goodPosition:[${upgrade.col},${upgrade.row}],additionalFeatureTriggered:[${upgrade.features.join(",")}]`;
  out += `]`;
  return out;
}