
// /* eslint-disable @typescript-eslint/no-explicit-any */
// import { posToCol, posToRow } from "./config";

// export const ULTRA_COIN_COLORS = [
//   { label: "Red(4)",    value: 4  },
//   { label: "Blue(13)",      value: 13  },
//   { label: "Green(22)",    value: 22 },
//   { label: "AllColor(31)", value: 31 },
// ];
// export const ULTRA_COIN_VALUES  = ["100", "250", "500", "MINOR", "MAJOR", "MINI"];
// export const ULTRA_BOOST_VALUES = ["0", "0.5", "1", "2", "5", "10", "25", "50", "100"];

// export type UltraFeatureCoin = {
//   position:   number;
//   colorCode:  number;
//   value:      string;
//   boostValue?: string;
//   boostSide?:  "LEFT" | "RIGHT" | null;
//   fromBase?:  boolean;
// };

// export type UpgradeInfo = { col: number; row: number; features: string[] };

// export function generateUltraFeatureGaffe(
//   coins:         UltraFeatureCoin[],
//   isDoubleCombo: boolean,
//   upgrade?:      UpgradeInfo | null
// ): string {
//   const rsp = Array(15).fill(0);
//   coins.forEach(c => { rsp[c.position] = c.colorCode; });

//   const sorted = [...coins].sort((a, b) => a.position - b.position);
//   // Fix #5: wrap value in COIN_VALUE format
//   const lc = sorted.map(c => [posToCol(c.position), posToRow(c.position), `COIN_${c.value}`]);

//   const boostArr: (number | string)[] = Array(15).fill(0);
//   let hasBoost = false;
//   coins.forEach(c => {
//     if (c.boostValue && c.boostValue !== "") {
//       const n = Number(c.boostValue);
//       boostArr[c.position] = isNaN(n) ? c.boostValue : n;
//       if (n !== 0) hasBoost = true;
//     }
//   });

//   const sideArr: string[] = Array(15).fill("");
//   let hasSide = false;
//   if (isDoubleCombo) {
//     coins.forEach(c => { if (c.boostSide) { sideArr[c.position] = c.boostSide; hasSide = true; } });
//   }

//   let out = `[reelStopPositions:[${rsp.join(",")}]`;
//   if (lc.length)         out += `,landedCoins:[${lc.map((c: any) => `[${c.join(",")}]`).join(",")}]`;
//   if (hasBoost)          out += `,isBoosted:true ,boostValues:[${boostArr.join(",")}]`;
//   if (hasSide)           out += `,boostSide:[${sideArr.join(",")}]`;
//   if (coins.length >= 22) out += `,lastPositionReel:bonus-boost`;
//   if (upgrade)           out += `,goodPosition:[${upgrade.col},${upgrade.row}],additionalFeatureTriggered:[${upgrade.features.join(",")}]`;
//   out += `]`;
//   return out;
// }


/* eslint-disable @typescript-eslint/no-explicit-any */
import { posToCol, posToRow } from "./config";

export const ULTRA_COIN_COLORS = [
  { label: "Red(4)",       value: 4  },
  { label: "Blue(13)",     value: 13 },
  { label: "Green(22)",    value: 22 },
  { label: "AllColor(31)", value: 31 },
];
export const ULTRA_COIN_VALUES  = ["100", "250", "500", "MINOR", "MAJOR", "MINI"];
export const ULTRA_BOOST_VALUES = ["0", "1", "2", "5", "10", "25", "50", "100"];

export type UltraFeatureCoin = {
  position:   number;
  colorCode:  number;
  value:      string;
  boostValue?: string;
  boostSide?:  "LEFT" | "RIGHT" | null;
  fromBase?:  boolean;
};

export type UpgradeInfo = { col: number; row: number; features: string[] };

export function generateUltraFeatureGaffe(
  coins:         UltraFeatureCoin[],
  isDoubleCombo: boolean,
  upgrade?:      UpgradeInfo | null
): string {
  const rsp = Array(15).fill(0);
  coins.forEach(c => { rsp[c.position] = c.colorCode; });

  const sorted = [...coins].sort((a, b) => a.position - b.position);
  const lc = sorted.map(c => [posToCol(c.position), posToRow(c.position), `COIN_${c.value}`]);

  const boostArr: (number | string)[] = Array(15).fill(0);
  let hasBoost = false;
  coins.forEach(c => {
    if (c.boostValue && c.boostValue !== "") {
      const n = Number(c.boostValue);
      boostArr[c.position] = isNaN(n) ? c.boostValue : n;
      if (n !== 0) hasBoost = true;
    }
  });

  const sideArr: string[] = Array(15).fill("");
  let hasSide = false;
  if (isDoubleCombo) {
    coins.forEach(c => { if (c.boostSide) { sideArr[c.position] = c.boostSide; hasSide = true; } });
  }

  let out = `[reelStopPositions:[${rsp.join(",")}]`;
  if (lc.length)          out += `,landedCoins:[${lc.map((c: any) => `[${c.join(",")}]`).join(",")}]`;
  // isBoosted:true is always emitted for Ultra (fixed — not conditional on boostValues)
  out += `,isBoosted:true`;
  if (hasBoost)           out += `,boostValues:[${boostArr.join(",")}]`;
  if (hasSide)            out += `,boostSide:[${sideArr.join(",")}]`;
  if (coins.length >= 22) out += `,lastPositionReel:bonus-boost`;
  if (upgrade)            out += `,goodPosition:[${upgrade.col},${upgrade.row}],additionalFeatureTriggered:[${upgrade.features.join(",")}]`;

   //! here
    if (coins.length ===14)
    out += `,lastPositionReel:bonus-boost`;
  out += `]`;
  
  out += `]`;
  return out;
}