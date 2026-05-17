// /* eslint-disable @typescript-eslint/no-explicit-any */
// import { posToCol, posToRow } from "./config";

// export const DOUBLE_COIN_COLORS = [
//   { label: "Purple(4)",       value: 4  },
//   { label: "Blue(13)",    value: 13  },
//   { label: "Green(22)",    value: 22 },
//   { label: "AllColor(31)", value: 31 },
// ];
// export const DOUBLE_COIN_VALUES = ["100", "250", "500", "MINOR", "MAJOR", "MINI"];

// /**
//  * Every position always has TWO coins: LEFT and RIGHT.
//  * Output: [col,row,COIN_VALUE,LEFT] and [col,row,COIN_VALUE,RIGHT]
//  */
// export type DoubleFeatureCoin = {
//   position:   number;
//   colorCode:  number;
//   leftValue:  string;
//   rightValue: string;
//   fromBase?:  boolean;
// };

// export type UpgradeInfo = { col: number; row: number; features: string[] };

// export function generateDoubleFeatureGaffe(
//   coins:   DoubleFeatureCoin[],
//   upgrade?: UpgradeInfo | null
// ): string {
//   const rsp = Array(15).fill(0);
//   coins.forEach(c => { rsp[c.position] = c.colorCode; });

//   const lc: any[] = [];
//   [...coins].sort((a, b) => a.position - b.position).forEach(c => {
//     const cc = posToCol(c.position), rr = posToRow(c.position);
//     // Fix #5: wrap values in COIN_VALUE format
//     if (c.leftValue)  lc.push([cc, rr, `COIN_${c.leftValue}`,  "LEFT"]);
//     if (c.rightValue) lc.push([cc, rr, `COIN_${c.rightValue}`, "RIGHT"]);
//   });

//   let out = `[reelStopPositions:[${rsp.join(",")}]`;
//   if (lc.length) out += `,landedCoins:[${lc.map(c => `[${c.join(",")}]`).join(",")}]`;
//   if (upgrade)   out += `,goodPosition:[${upgrade.col},${upgrade.row}],additionalFeatureTriggered:[${upgrade.features.join(",")}]`;

//    //! here
//     if (coins.length ===14)
//     out += `,lastPositionReel:bonus-boost`;
//   out += `]`;
//   out += `]`;
//   return out;
// }



/* eslint-disable @typescript-eslint/no-explicit-any */
import { posToCol, posToRow } from "./config";

export const DOUBLE_COIN_COLORS = [
  { label: "Purple(4)",       value: 4  },
  { label: "Blue(13)",    value: 13  },
  { label: "Green(22)",    value: 22 },
  { label: "AllColor(31)", value: 31 },
];
export const DOUBLE_COIN_VALUES = ["100", "250", "500", "MINOR", "MAJOR", "MINI"];

/**
 * Every position always has TWO coins: LEFT and RIGHT.
 * Output: [col,row,COIN_VALUE,LEFT] and [col,row,COIN_VALUE,RIGHT]
 */
export type DoubleFeatureCoin = {
  position:   number;
  colorCode:  number;
  leftValue:  string;
  rightValue: string;
  fromBase?:  boolean;
};

export type UpgradeInfo = { col: number; row: number; features: string[]; zoneSplitter?: number; zoneMultipliers?: number[] };

export function generateDoubleFeatureGaffe(
  coins:   DoubleFeatureCoin[],
  upgrade?: UpgradeInfo | null
): string {
  const rsp = Array(15).fill(0);
  coins.forEach(c => { rsp[c.position] = c.colorCode; });

  const lc: any[] = [];
  [...coins].sort((a, b) => a.position - b.position).forEach(c => {
    const cc = posToCol(c.position), rr = posToRow(c.position);
    // Fix #5: wrap values in COIN_VALUE format
    if (c.leftValue)  lc.push([cc, rr, `COIN_${c.leftValue}`,  "LEFT"]);
    if (c.rightValue) lc.push([cc, rr, `COIN_${c.rightValue}`, "RIGHT"]);
  });

  let out = `[reelStopPositions:[${rsp.join(",")}]`;
  if (lc.length) out += `,landedCoins:[${lc.map(c => `[${c.join(",")}]`).join(",")}]`;
  if (upgrade)   out += `,goodPosition:[${upgrade.col},${upgrade.row}],additionalFeatureTriggered:[${upgrade.features.join(",")}]`;

  //    //! here
    if (coins.length ===14)
    out += `,lastPositionReel:bonus-boost`;


  out += `]`;
  return out;
}