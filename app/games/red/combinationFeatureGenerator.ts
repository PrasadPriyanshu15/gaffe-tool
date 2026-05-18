


//! ;atest working code
/* eslint-disable @typescript-eslint/no-explicit-any */
// import { posToCol, posToRow, UPGRADE_CODE_TO_FEATURES } from "./config";

// export type CoinColorOption = { label: string; value: number };

// // ── Coin color options per combination ───────────────────────────────────────
// export const COMBO_COIN_COLORS: Record<string, CoinColorOption[]> = {
//   // 2-feature
//   "double+extra":  [{ label:"Purple(4)",    value:4 }, { label:"Blue(13)",  value:13 }, { label:"AllColor(22)", value:22 }, { label:"Gold(31)", value:31 }],
//   "double+ultra":  [{ label:"Blue(4)",    value:4 }, { label:"Green(13)", value:13 }, { label:"AllColor(22)", value:22 }, { label:"Gold(31)", value:31 }],
//   "double+zone":   [{ label:"Purple(4)",    value:4 }, { label:"Green(13)",   value:13 }, { label:"AllColor(22)", value:22 }, { label:"Gold(31)", value:31 }],
//   "extra+ultra":   [{ label:"Red(4)",  value:4 }, { label:"Blue(13)", value:13 }, { label:"AllColor(22)", value:22 }, { label:"Gold(31)", value:31 }],
//   "extra+zone":    [{ label:"Red(4)",  value:4 }, { label:"Purple(13)",   value:13 }, { label:"AllColor(22)", value:22 }, { label:"Gold(31)", value:31 }],
//   "ultra+zone":    [{ label:"Red(4)", value:4 }, { label:"Green(13)",   value:13 }, { label:"AllColor(22)", value:22 }, { label:"Gold(31)", value:31 }],
//   // 3-feature
//   "double+extra+ultra":  [{ label:"Blue(4)",    value:4 }, { label:"AllColor(13)", value:13 }, { label:"Gold(22)", value:22 }, { label:"Gold(31)", value:31 }],
//   "double+extra+zone":   [{ label:"Purple(4)",    value:4 }, { label:"AllColor(13)", value:13 }, { label:"Gold(22)", value:22 }, { label:"Gold(31)", value:31 }],
//   "double+ultra+zone":   [{ label:"Green(4)",    value:4 }, { label:"AllColor(13)", value:13 }, { label:"Gold(22)", value:22 }, { label:"Gold(31)", value:31 }],
//   "extra+ultra+zone":    [{ label:"Red(4)",  value:4 }, { label:"AllColor(13)", value:13 }, { label:"Gold(22)", value:22 }, { label:"Gold(31)", value:31 }],
//   // 4-feature
//   "double+extra+ultra+zone": [{ label:"Gold(4)", value:4 }, { label:"Gold(13)", value:13 }, { label:"Gold(22)", value:22 }, { label:"Gold(31)", value:31 }],
// };

// // ── Types ─────────────────────────────────────────────────────────────────────

// export type ComboCoin = {
//   position:    number;
//   colorCode:   number;
//   value:       string;
//   leftValue?:  string;
//   rightValue?: string;
//   boostValue?: string;
//   boostSide?:  "LEFT" | "RIGHT" | null;
//   fromBase?:   boolean;
// };

// export type ComboFeatureConfig = {
//   features:     string[];
//   hasDouble:    boolean;
//   hasExtra:     boolean;
//   hasZone:      boolean;
//   hasUltra:     boolean;
//   splitter?:    number;
//   multipliers?: number[];
// };

// export type UpgradeInfo = { col: number; row: number; features: string[] };

// // ── Helpers ───────────────────────────────────────────────────────────────────

// export function getComboKey(features: string[]): string {
//   return [...features].sort().join("+");
// }

// export function getComboCoinColors(features: string[]): CoinColorOption[] {
//   const key = getComboKey(features);
//   return COMBO_COIN_COLORS[key] ?? [
//     { label:"Red(4)",       value:4  },
//     { label:"Blue(13)",     value:13 },
//     { label:"Green(22)",    value:22 },
//     { label:"AllColor(31)", value:31 },
//   ];
// }

// export function getComboScatSeedColor(_features: string[], _scatKey: string): number {
//   return 4;
// }

// /** 4 spins if Extra is in combo, else 3 */
// export function getComboMaxSpins(config: ComboFeatureConfig): number {
//   return config.hasExtra ? 4 : 3;
// }

// export function resolveUpgradeFeatures(colorCode: number): string[] {
//   return UPGRADE_CODE_TO_FEATURES[colorCode] ?? [];
// }

// // ── Output generator ─────────────────────────────────────────────────────────

// export function generateCombinationGaffe(
//   coins:    ComboCoin[],
//   config:   ComboFeatureConfig,
//   upgrade?: UpgradeInfo | null
// ): string {
//   const { hasDouble, hasUltra, hasZone, hasExtra, splitter, multipliers } = config;

//   const rsp = Array(15).fill(0);
//   coins.forEach(c => { rsp[c.position] = c.colorCode; });

//   const sorted = [...coins].sort((a, b) => a.position - b.position);

//   // landedCoins
//   const lc: any[] = [];
//   sorted.forEach(c => {
//     const cc = posToCol(c.position), rr = posToRow(c.position);
//     if (hasDouble) {
//       if (c.leftValue)  lc.push([cc, rr, `COIN_${c.leftValue}`,  "LEFT"]);
//       if (c.rightValue) lc.push([cc, rr, `COIN_${c.rightValue}`, "RIGHT"]);
//     } else {
//       if (c.value) lc.push([cc, rr, `COIN_${c.value}`]);
//     }
//   });

//   // boostValues — Ultra
//   const boostArr: (number | string)[] = Array(15).fill(0);
//   let hasBoost = false;
//   if (hasUltra) {
//     coins.forEach(c => {
//       if (c.boostValue && c.boostValue !== "") {
//         const n = Number(c.boostValue);
//         boostArr[c.position] = isNaN(n) ? c.boostValue : n;
//         if (n !== 0) hasBoost = true;
//       }
//     });
//   }

//   // boostSide — Double+Ultra only
//   const sideArr: string[] = Array(15).fill("");
//   let hasSide = false;
//   if (hasDouble && hasUltra) {
//     coins.forEach(c => {
//       if (c.boostSide) { sideArr[c.position] = c.boostSide; hasSide = true; }
//     });
//   }

//   let out = `[reelStopPositions:[${rsp.join(",")}]`;

//   if (lc.length)
//     out += `,landedCoins:[${lc.map(c => `[${c.join(",")}]`).join(",")}]`;

//   if (hasBoost)
//     out += `,boostValues:[${boostArr.join(",")}]`;

//   if (hasSide)
//     out += `,boostSide:[${sideArr.join(",")}]`;

//   // isBoosted — always present when Ultra is active
//   if (hasUltra)
//     out += `,isBoosted:true`;

//   if (hasZone && splitter)
//     out += `,zoneSplitter:${splitter}`;

//   if (hasZone && multipliers && multipliers.length > 0)
//     out += `,zoneMultipliers:[${multipliers.join(",")}]`;

//   if (coins.length >= 22 && (hasExtra || hasUltra))
//     out += `,lastPositionReel:bonus-boost`;

//   if (upgrade)
//     out += `,goodPosition:[${upgrade.col},${upgrade.row}],additionalFeatureTriggered:[${upgrade.features.join(",")}]`;


//     //! changing here 
//    if (coins.length >= 22 && (hasDouble))
//     out += `,lastPositionReel:bonus-boost`;
//    if (coins.length ===14  && (hasExtra || hasZone || hasUltra))
//     out += `,lastPositionReel:bonus-boost`;
  
//   out += `]`;
//   return out;
// }





// /* eslint-disable @typescript-eslint/no-explicit-any */
// import { posToCol, posToRow, UPGRADE_CODE_TO_FEATURES } from "./config";

// export type CoinColorOption = { label: string; value: number };

// // ── Coin color options per combination ───────────────────────────────────────
// export const COMBO_COIN_COLORS: Record<string, CoinColorOption[]> = {
//   // 2-feature
//   "double+extra":  [{ label:"Purple(4)",    value:4 }, { label:"Blue(13)",  value:13 }, { label:"AllColor(22)", value:22 }, { label:"Gold(31)", value:31 }],
//   "double+ultra":  [{ label:"Blue(4)",    value:4 }, { label:"Green(13)", value:13 }, { label:"AllColor(22)", value:22 }, { label:"Gold(31)", value:31 }],
//   "double+zone":   [{ label:"Purple(4)",    value:4 }, { label:"Green(13)",   value:13 }, { label:"AllColor(22)", value:22 }, { label:"Gold(31)", value:31 }],
//   "extra+ultra":   [{ label:"Red(4)",  value:4 }, { label:"Blue(13)", value:13 }, { label:"AllColor(22)", value:22 }, { label:"Gold(31)", value:31 }],
//   "extra+zone":    [{ label:"Red(4)",  value:4 }, { label:"Purple(13)",   value:13 }, { label:"AllColor(22)", value:22 }, { label:"Gold(31)", value:31 }],
//   "ultra+zone":    [{ label:"Red(4)", value:4 }, { label:"Green(13)",   value:13 }, { label:"AllColor(22)", value:22 }, { label:"Gold(31)", value:31 }],
//   // 3-feature
//   "double+extra+ultra":  [{ label:"Blue(4)",    value:4 }, { label:"AllColor(13)", value:13 }, { label:"Gold(22)", value:22 }, { label:"Gold(31)", value:31 }],
//   "double+extra+zone":   [{ label:"Purple(4)",    value:4 }, { label:"AllColor(13)", value:13 }, { label:"Gold(22)", value:22 }, { label:"Gold(31)", value:31 }],
//   "double+ultra+zone":   [{ label:"Green(4)",    value:4 }, { label:"AllColor(13)", value:13 }, { label:"Gold(22)", value:22 }, { label:"Gold(31)", value:31 }],
//   "extra+ultra+zone":    [{ label:"Red(4)",  value:4 }, { label:"AllColor(13)", value:13 }, { label:"Gold(22)", value:22 }, { label:"Gold(31)", value:31 }],
//   // 4-feature
//   "double+extra+ultra+zone": [{ label:"Gold(4)", value:4 }, { label:"Gold(13)", value:13 }, { label:"Gold(22)", value:22 }, { label:"Gold(31)", value:31 }],
// };

// // ── Types ─────────────────────────────────────────────────────────────────────

// export type ComboCoin = {
//   position:    number;
//   colorCode:   number;
//   value:       string;
//   leftValue?:  string;
//   rightValue?: string;
//   boostValue?: string;
//   boostSide?:  "LEFT" | "RIGHT" | null;
//   fromBase?:   boolean;
// };

// export type ComboFeatureConfig = {
//   features:     string[];
//   hasDouble:    boolean;
//   hasExtra:     boolean;
//   hasZone:      boolean;
//   hasUltra:     boolean;
//   splitter?:    number;
//   multipliers?: number[];
// };

// export type UpgradeInfo = { col: number; row: number; features: string[]; zoneSplitter?: number; zoneMultipliers?: number[] };

// // ── Helpers ───────────────────────────────────────────────────────────────────

// export function getComboKey(features: string[]): string {
//   return [...features].sort().join("+");
// }

// export function getComboCoinColors(features: string[]): CoinColorOption[] {
//   const key = getComboKey(features);
//   return COMBO_COIN_COLORS[key] ?? [
//     { label:"Red(4)",       value:4  },
//     { label:"Blue(13)",     value:13 },
//     { label:"Green(22)",    value:22 },
//     { label:"AllColor(31)", value:31 },
//   ];
// }

// export function getComboScatSeedColor(_features: string[], _scatKey: string): number {
//   return 4;
// }

// /** 4 spins if Extra is in combo, else 3 */
// export function getComboMaxSpins(config: ComboFeatureConfig): number {
//   return config.hasExtra ? 4 : 3;
// }

// export function resolveUpgradeFeatures(colorCode: number): string[] {
//   return UPGRADE_CODE_TO_FEATURES[colorCode] ?? [];
// }

// // ── Output generator ─────────────────────────────────────────────────────────

// export function generateCombinationGaffe(
//   coins:    ComboCoin[],
//   config:   ComboFeatureConfig,
//   upgrade?: UpgradeInfo | null
// ): string {
//   const { hasDouble, hasUltra, hasZone, hasExtra, splitter, multipliers } = config;

//   const rsp = Array(15).fill(0);
//   coins.forEach(c => { rsp[c.position] = c.colorCode; });

//   const sorted = [...coins].sort((a, b) => a.position - b.position);

//   // landedCoins
//   const lc: any[] = [];
//   sorted.forEach(c => {
//     const cc = posToCol(c.position), rr = posToRow(c.position);
//     if (hasDouble) {
//       if (c.leftValue)  lc.push([cc, rr, `COIN_${c.leftValue}`,  "LEFT"]);
//       if (c.rightValue) lc.push([cc, rr, `COIN_${c.rightValue}`, "RIGHT"]);
//     } else {
//       if (c.value) lc.push([cc, rr, `COIN_${c.value}`]);
//     }
//   });

//   // boostValues — Ultra
//   const boostArr: (number | string)[] = Array(15).fill(0);
//   let hasBoost = false;
//   if (hasUltra) {
//     coins.forEach(c => {
//       if (c.boostValue && c.boostValue !== "") {
//         const n = Number(c.boostValue);
//         boostArr[c.position] = isNaN(n) ? c.boostValue : n;
//         if (n !== 0) hasBoost = true;
//       }
//     });
//   }

//   // boostSide — Double+Ultra only
//   const sideArr: string[] = Array(15).fill("");
//   let hasSide = false;
//   if (hasDouble && hasUltra) {
//     coins.forEach(c => {
//       if (c.boostSide) { sideArr[c.position] = c.boostSide; hasSide = true; }
//     });
//   }

//   let out = `[reelStopPositions:[${rsp.join(",")}]`;

//   if (lc.length)
//     out += `,landedCoins:[${lc.map(c => `[${c.join(",")}]`).join(",")}]`;

//   if (hasBoost)
//     out += `,boostValues:[${boostArr.join(",")}]`;

//   if (hasSide)
//     out += `,boostSide:[${sideArr.join(",")}]`;

//   // isBoosted — always present when Ultra is active
//   if (hasUltra)
//     out += `,isBoosted:true`;

//   if (hasZone && splitter)
//     out += `,zoneSplitter:${splitter}`;

//   if (hasZone && multipliers && multipliers.length > 0)
//     out += `,zoneMultipliers:[${multipliers.join(",")}]`;

//   if (coins.length >= 22 && (hasExtra || hasUltra))
//     out += `,lastPositionReel:bonus-boost`;

//   if (upgrade)
//     out += `,goodPosition:[${upgrade.col},${upgrade.row}],additionalFeatureTriggered:[${upgrade.features.join(",")}]`;

//   //     //! changing here 
//    if (coins.length >= 22 && (hasDouble))
//     out += `,lastPositionReel:bonus-boost`;
//    if (coins.length ===14  && (hasExtra || hasZone || hasUltra))
//     out += `,lastPositionReel:bonus-boost`;

//   out += `]`;
//   return out;
// }



//! blue and purple swappe for extra

//! ;atest working code
/* eslint-disable @typescript-eslint/no-explicit-any */
// import { posToCol, posToRow, UPGRADE_CODE_TO_FEATURES } from "./config";

// export type CoinColorOption = { label: string; value: number };

// // ── Coin color options per combination ───────────────────────────────────────
// export const COMBO_COIN_COLORS: Record<string, CoinColorOption[]> = {
//   // 2-feature
//   "double+extra":  [{ label:"Purple(4)",    value:4 }, { label:"Blue(13)",  value:13 }, { label:"AllColor(22)", value:22 }, { label:"Gold(31)", value:31 }],
//   "double+ultra":  [{ label:"Blue(4)",    value:4 }, { label:"Green(13)", value:13 }, { label:"AllColor(22)", value:22 }, { label:"Gold(31)", value:31 }],
//   "double+zone":   [{ label:"Purple(4)",    value:4 }, { label:"Green(13)",   value:13 }, { label:"AllColor(22)", value:22 }, { label:"Gold(31)", value:31 }],
//   "extra+ultra":   [{ label:"Red(4)",  value:4 }, { label:"Blue(13)", value:13 }, { label:"AllColor(22)", value:22 }, { label:"Gold(31)", value:31 }],
//   "extra+zone":    [{ label:"Red(4)",  value:4 }, { label:"Purple(13)",   value:13 }, { label:"AllColor(22)", value:22 }, { label:"Gold(31)", value:31 }],
//   "ultra+zone":    [{ label:"Red(4)", value:4 }, { label:"Green(13)",   value:13 }, { label:"AllColor(22)", value:22 }, { label:"Gold(31)", value:31 }],
//   // 3-feature
//   "double+extra+ultra":  [{ label:"Blue(4)",    value:4 }, { label:"AllColor(13)", value:13 }, { label:"Gold(22)", value:22 }, { label:"Gold(31)", value:31 }],
//   "double+extra+zone":   [{ label:"Purple(4)",    value:4 }, { label:"AllColor(13)", value:13 }, { label:"Gold(22)", value:22 }, { label:"Gold(31)", value:31 }],
//   "double+ultra+zone":   [{ label:"Green(4)",    value:4 }, { label:"AllColor(13)", value:13 }, { label:"Gold(22)", value:22 }, { label:"Gold(31)", value:31 }],
//   "extra+ultra+zone":    [{ label:"Red(4)",  value:4 }, { label:"AllColor(13)", value:13 }, { label:"Gold(22)", value:22 }, { label:"Gold(31)", value:31 }],
//   // 4-feature
//   "double+extra+ultra+zone": [{ label:"Gold(4)", value:4 }, { label:"Gold(13)", value:13 }, { label:"Gold(22)", value:22 }, { label:"Gold(31)", value:31 }],
// };

// // ── Types ─────────────────────────────────────────────────────────────────────

// export type ComboCoin = {
//   position:    number;
//   colorCode:   number;
//   value:       string;
//   leftValue?:  string;
//   rightValue?: string;
//   boostValue?: string;
//   boostSide?:  "LEFT" | "RIGHT" | null;
//   fromBase?:   boolean;
// };

// export type ComboFeatureConfig = {
//   features:     string[];
//   hasDouble:    boolean;
//   hasExtra:     boolean;
//   hasZone:      boolean;
//   hasUltra:     boolean;
//   splitter?:    number;
//   multipliers?: number[];
// };

// export type UpgradeInfo = { col: number; row: number; features: string[] };

// // ── Helpers ───────────────────────────────────────────────────────────────────

// export function getComboKey(features: string[]): string {
//   return [...features].sort().join("+");
// }

// export function getComboCoinColors(features: string[]): CoinColorOption[] {
//   const key = getComboKey(features);
//   return COMBO_COIN_COLORS[key] ?? [
//     { label:"Red(4)",       value:4  },
//     { label:"Blue(13)",     value:13 },
//     { label:"Green(22)",    value:22 },
//     { label:"AllColor(31)", value:31 },
//   ];
// }

// export function getComboScatSeedColor(_features: string[], _scatKey: string): number {
//   return 4;
// }

// /** 4 spins if Extra is in combo, else 3 */
// export function getComboMaxSpins(config: ComboFeatureConfig): number {
//   return config.hasExtra ? 4 : 3;
// }

// export function resolveUpgradeFeatures(colorCode: number): string[] {
//   return UPGRADE_CODE_TO_FEATURES[colorCode] ?? [];
// }

// // ── Output generator ─────────────────────────────────────────────────────────

// export function generateCombinationGaffe(
//   coins:    ComboCoin[],
//   config:   ComboFeatureConfig,
//   upgrade?: UpgradeInfo | null
// ): string {
//   const { hasDouble, hasUltra, hasZone, hasExtra, splitter, multipliers } = config;

//   const rsp = Array(15).fill(0);
//   coins.forEach(c => { rsp[c.position] = c.colorCode; });

//   const sorted = [...coins].sort((a, b) => a.position - b.position);

//   // landedCoins
//   const lc: any[] = [];
//   sorted.forEach(c => {
//     const cc = posToCol(c.position), rr = posToRow(c.position);
//     if (hasDouble) {
//       if (c.leftValue)  lc.push([cc, rr, `COIN_${c.leftValue}`,  "LEFT"]);
//       if (c.rightValue) lc.push([cc, rr, `COIN_${c.rightValue}`, "RIGHT"]);
//     } else {
//       if (c.value) lc.push([cc, rr, `COIN_${c.value}`]);
//     }
//   });

//   // boostValues — Ultra
//   const boostArr: (number | string)[] = Array(15).fill(0);
//   let hasBoost = false;
//   if (hasUltra) {
//     coins.forEach(c => {
//       if (c.boostValue && c.boostValue !== "") {
//         const n = Number(c.boostValue);
//         boostArr[c.position] = isNaN(n) ? c.boostValue : n;
//         if (n !== 0) hasBoost = true;
//       }
//     });
//   }

//   // boostSide — Double+Ultra only
//   const sideArr: string[] = Array(15).fill("");
//   let hasSide = false;
//   if (hasDouble && hasUltra) {
//     coins.forEach(c => {
//       if (c.boostSide) { sideArr[c.position] = c.boostSide; hasSide = true; }
//     });
//   }

//   let out = `[reelStopPositions:[${rsp.join(",")}]`;

//   if (lc.length)
//     out += `,landedCoins:[${lc.map(c => `[${c.join(",")}]`).join(",")}]`;

//   if (hasBoost)
//     out += `,boostValues:[${boostArr.join(",")}]`;

//   if (hasSide)
//     out += `,boostSide:[${sideArr.join(",")}]`;

//   // isBoosted — always present when Ultra is active
//   if (hasUltra)
//     out += `,isBoosted:true`;

//   if (hasZone && splitter)
//     out += `,zoneSplitter:${splitter}`;

//   if (hasZone && multipliers && multipliers.length > 0)
//     out += `,zoneMultipliers:[${multipliers.join(",")}]`;

//   if (coins.length >= 22 && (hasExtra || hasUltra))
//     out += `,lastPositionReel:bonus-boost`;

//   if (upgrade)
//     out += `,goodPosition:[${upgrade.col},${upgrade.row}],additionalFeatureTriggered:[${upgrade.features.join(",")}]`;


//     //! changing here 
//    if (coins.length >= 22 && (hasDouble))
//     out += `,lastPositionReel:bonus-boost`;
//    if (coins.length ===14  && (hasExtra || hasZone || hasUltra))
//     out += `,lastPositionReel:bonus-boost`;
  
//   out += `]`;
//   return out;
// }





/* eslint-disable @typescript-eslint/no-explicit-any */
import { posToCol, posToRow, UPGRADE_CODE_TO_FEATURES } from "./config";

export type CoinColorOption = { label: string; value: number };

// ── Coin color options per combination ───────────────────────────────────────
export const COMBO_COIN_COLORS: Record<string, CoinColorOption[]> = {
  // 2-feature
  "double+extra":  [{ label:"Purple(4)",    value:4 }, { label:"Purple(13)",  value:13 }, { label:"AllColor(22)", value:22 }, { label:"Gold(31)", value:31 }],
  "double+ultra":  [{ label:"Blue(4)",    value:4 }, { label:"Green(13)", value:13 }, { label:"AllColor(22)", value:22 }, { label:"Gold(31)", value:31 }],
  "double+zone":   [{ label:"Purple(4)",    value:4 }, { label:"Green(13)",   value:13 }, { label:"AllColor(22)", value:22 }, { label:"Gold(31)", value:31 }],
  "extra+ultra":   [{ label:"Red(4)",  value:4 }, { label:"Purple(13)", value:13 }, { label:"AllColor(22)", value:22 }, { label:"Gold(31)", value:31 }],
  "extra+zone":    [{ label:"Red(4)",  value:4 }, { label:"Purple(13)",   value:13 }, { label:"AllColor(22)", value:22 }, { label:"Gold(31)", value:31 }],
  "ultra+zone":    [{ label:"Red(4)", value:4 }, { label:"Green(13)",   value:13 }, { label:"AllColor(22)", value:22 }, { label:"Gold(31)", value:31 }],
  // 3-feature
  "double+extra+ultra":  [{ label:"Blue(4)",    value:4 }, { label:"AllColor(13)", value:13 }, { label:"Gold(22)", value:22 }, { label:"Gold(31)", value:31 }],
  "double+extra+zone":   [{ label:"Purple(4)",    value:4 }, { label:"AllColor(13)", value:13 }, { label:"Gold(22)", value:22 }, { label:"Gold(31)", value:31 }],
  "double+ultra+zone":   [{ label:"Green(4)",    value:4 }, { label:"AllColor(13)", value:13 }, { label:"Gold(22)", value:22 }, { label:"Gold(31)", value:31 }],
  "extra+ultra+zone":    [{ label:"Red(4)",  value:4 }, { label:"AllColor(13)", value:13 }, { label:"Gold(22)", value:22 }, { label:"Gold(31)", value:31 }],
  // 4-feature
  "double+extra+ultra+zone": [{ label:"Gold(4)", value:4 }, { label:"Gold(13)", value:13 }, { label:"Gold(22)", value:22 }, { label:"Gold(31)", value:31 }],
};

// ── Types ─────────────────────────────────────────────────────────────────────

export type ComboCoin = {
  position:    number;
  colorCode:   number;
  value:       string;
  leftValue?:  string;
  rightValue?: string;
  boostValue?: string;
  boostSide?:  "LEFT" | "RIGHT" | null;
  fromBase?:   boolean;
};

export type ComboFeatureConfig = {
  features:     string[];
  hasDouble:    boolean;
  hasExtra:     boolean;
  hasZone:      boolean;
  hasUltra:     boolean;
  splitter?:    number;
  multipliers?: number[];
};

export type UpgradeInfo = { col: number; row: number; features: string[]; zoneSplitter?: number; zoneMultipliers?: number[] };

// ── Helpers ───────────────────────────────────────────────────────────────────

export function getComboKey(features: string[]): string {
  return [...features].sort().join("+");
}

export function getComboCoinColors(features: string[]): CoinColorOption[] {
  const key = getComboKey(features);
  return COMBO_COIN_COLORS[key] ?? [
    { label:"Red(4)",        value:4  },
    { label:"Purple(13)",   value:13 },
    { label:"Blue(22)",     value:22 },
    { label:"AllColor(31)", value:31 },
  ];
}

export function getComboScatSeedColor(_features: string[], _scatKey: string): number {
  return 4;
}

/** 4 spins if Extra is in combo, else 3 */
export function getComboMaxSpins(config: ComboFeatureConfig): number {
  return config.hasExtra ? 4 : 3;
}

export function resolveUpgradeFeatures(colorCode: number): string[] {
  return UPGRADE_CODE_TO_FEATURES[colorCode] ?? [];
}

// ── Output generator ─────────────────────────────────────────────────────────

export function generateCombinationGaffe(
  coins:    ComboCoin[],
  config:   ComboFeatureConfig,
  upgrade?: UpgradeInfo | null
): string {
  const { hasDouble, hasUltra, hasZone, hasExtra, splitter, multipliers } = config;

  const rsp = Array(15).fill(0);
  coins.forEach(c => { rsp[c.position] = c.colorCode; });

  const sorted = [...coins].sort((a, b) => a.position - b.position);

  // landedCoins
  const lc: any[] = [];
  sorted.forEach(c => {
    const cc = posToCol(c.position), rr = posToRow(c.position);
    if (hasDouble) {
      if (c.leftValue)  lc.push([cc, rr, `COIN_${c.leftValue}`,  "LEFT"]);
      if (c.rightValue) lc.push([cc, rr, `COIN_${c.rightValue}`, "RIGHT"]);
    } else {
      if (c.value) lc.push([cc, rr, `COIN_${c.value}`]);
    }
  });

  // boostValues — Ultra
  const boostArr: (number | string)[] = Array(15).fill(0);
  let hasBoost = false;
  if (hasUltra) {
    coins.forEach(c => {
      if (c.boostValue && c.boostValue !== "") {
        const n = Number(c.boostValue);
        boostArr[c.position] = isNaN(n) ? c.boostValue : n;
        if (n !== 0) hasBoost = true;
      }
    });
  }

  // boostSide — Double+Ultra only
  const sideArr: string[] = Array(15).fill("");
  let hasSide = false;
  if (hasDouble && hasUltra) {
    coins.forEach(c => {
      if (c.boostSide) { sideArr[c.position] = c.boostSide; hasSide = true; }
    });
  }

  let out = `[reelStopPositions:[${rsp.join(",")}]`;

  if (lc.length)
    out += `,landedCoins:[${lc.map(c => `[${c.join(",")}]`).join(",")}]`;

  if (hasBoost)
    out += `,boostValues:[${boostArr.join(",")}]`;

  if (hasSide)
    out += `,boostSide:[${sideArr.join(",")}]`;

  // isBoosted — always present when Ultra is active
  if (hasUltra)
    out += `,isBoosted:true`;

  if (hasZone && splitter)
    out += `,zoneSplitter:${splitter}`;

  if (hasZone && multipliers && multipliers.length > 0)
    out += `,zoneMultipliers:[${multipliers.join(",")}]`;

  if (coins.length >= 22 && (hasExtra || hasUltra))
    out += `,lastPositionReel:bonus-boost`;

  if (upgrade)
    out += `,goodPosition:[${upgrade.col},${upgrade.row}],additionalFeatureTriggered:[${upgrade.features.join(",")}]`;

  //     //! changing here 
   if (coins.length >= 22 && (hasDouble))
    out += `,lastPositionReel:bonus-boost`;
   if (coins.length ===14  && (hasExtra || hasZone || hasUltra))
    out += `,lastPositionReel:bonus-boost`;

  out += `]`;
  return out;
}