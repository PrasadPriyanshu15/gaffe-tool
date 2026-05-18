



// /* eslint-disable @typescript-eslint/no-explicit-any */

// export type CoinColorOption = { label: string; value: number };

// // !! Update values per combination  !!
// export const COMBO_COIN_COLORS: Record<string, CoinColorOption[]> = {
//   "extra+zone":        [{ label:"Orange (4)", value:4 }, { label:"Cerise (9)", value:9 }, { label:"All-Color (14)", value:14 }, { label:"gold (19)", value:19 }],
//   "extra+split":       [{ label:"Green (4)", value:4 }, { label:"Blue (9)", value:9 }, { label:"Orange (14)", value:14 }, { label:"Cerise (19)", value:19 }],
//   "extra+strike":      [{ label:"Blue (4)", value:4 }, { label:"Cerise (9)", value:9 }, { label:"All-Color (14)", value:14 }, { label:"gold (19)", value:19 }],
//   "split+zone":        [{ label:"Orange (4)", value:4 }, { label:"Blue (9)", value:9 }, { label:"All-Color (14)", value:14 }, { label:"gold (19)", value:19 }],
//   "split+strike":      [{ label:"Blue (4)", value:4 }, { label:"Green (9)", value:9 }, { label:"All-Color (14)", value:14 }, { label:"gold (19)", value:19 }],
//   "split+extra":      [{ label:"Orange (4)", value:4 }, { label:"Blue (9)", value:9 }, { label:"All-Color (14)", value:14 }, { label:"gold (19)", value:19 }],
//   "strike+zone":       [{ label:"Cerise (4)", value:4 }, { label:"Green (9)", value:9 }, { label:"All-Color (14)", value:14 }, { label:"gold (19)", value:19 }],
//   "extra+split+zone":  [{ label:"Orange (4)", value:4 }, { label:"All-Color (9)", value:9 }, { label:"gold (14)", value:14 }, { label:"gold (19)", value:19 }],
//   "extra+split+strike":[{ label:"Blue (4)", value:4 }, { label:"All-Color (9)", value:9 }, { label:"gold (14)", value:14 }, { label:"gold (19)", value:19 }],
//   "extra+strike+zone": [{ label:"Cerise (4)", value:4 }, { label:"All-Color (9)", value:9 }, { label:"gold (14)", value:14 }, { label:"gold (19)", value:19 }],
//   "split+strike+zone": [{ label:"Green (4)", value:4 }, { label:"All-Color (9)", value:9 }, { label:"gold (14)", value:14 }, { label:"gold (19)", value:19 }],
//   "extra+split+strike+zone":[{ label:"Green (4)", value:4 }, { label:"Blue (9)", value:9 }, { label:"Orange (14)", value:14 }, { label:"Cerise (19)", value:19 }],
// };


// // colorCode when a scat seeds into a specific combination
// export const COMBO_SCAT_SEED_COLOR: Record<string, Record<string, number>> = {
//   "extra+zone":         { green:4, blue:9, orange:14, cerise:19, all:4  },
//   "extra+split":        { green:4, blue:9, orange:14, cerise:19, all:19 },
//   "extra+strike":       { green:4, blue:9, orange:14, cerise:19, all:14 },
//   "split+zone":         { green:4, blue:9, orange:14, cerise:19, all:19 },
//   "split+strike":       { green:4, blue:9, orange:14, cerise:19, all:19 },
//   "strike+zone":        { green:4, blue:9, orange:14, cerise:19, all:14 },
//   "extra+split+zone":   { green:4, blue:9, orange:14, cerise:19, all:19 },
//   "extra+split+strike": { green:4, blue:9, orange:14, cerise:19, all:19 },
//   "extra+strike+zone":  { green:4, blue:9, orange:14, cerise:19, all:14 },
//   "split+strike+zone":  { green:4, blue:9, orange:14, cerise:19, all:19 },
//   "extra+split+strike+zone": { green:4, blue:9, orange:14, cerise:19, all:19 },
// };

// // ── TYPES ─────────────────────────────────────────────────────────────────────

// export type ComboCoin = {
//   position:         number;    // 0–14, column-major
//   colorCode:        number;
//   value:            string;
//   winged?:          boolean;   // strike
//   boostValue?:      string;    // strike: boost for coin 1 (or the only coin)
//   splitCount?:      number;    // split: 1–4
//   splitBoostValues?: string[]; // split+strike: boosts for split coins 2/3/4 [idx0=coin2, ...]
//   fromBase?:        boolean;
// };

// export type ComboFeatureConfig = {
//   features:      string[];
//   hasExtra:      boolean;
//   hasZone:       boolean;
//   hasStrike:     boolean;
//   hasSplit:      boolean;
//   splitter?:     number;
//   multipliers?:  number[];
// };

// // ── HELPERS ───────────────────────────────────────────────────────────────────

// export function getComboKey(features: string[]): string {
//   return [...features].sort().join("+");
// }

// export function getComboCoinColors(features: string[]): CoinColorOption[] {
//   const key = getComboKey(features);
//   return COMBO_COIN_COLORS[key] ?? [
//     { label:"Green (4)", value:4 }, { label:"Blue (9)", value:9 },
//     { label:"Orange (14)", value:14 }, { label:"Cerise (19)", value:19 },
//   ];
// }

// export function getComboScatSeedColor(features: string[], scatKey: string): number {
//   const key = getComboKey(features);
//   return COMBO_SCAT_SEED_COLOR[key]?.[scatKey] ?? 4;
// }

// /** 4 spins if Extra is in combo, else 3 */
// export function getComboMaxSpins(config: ComboFeatureConfig): number {
//   return config.hasExtra ? 4 : 3;
// }

// // ── OUTPUT GENERATOR ─────────────────────────────────────────────────────────

// export function generateCombinationGaffe(coins: ComboCoin[], config: ComboFeatureConfig): string {
//   const { hasStrike, hasZone, hasSplit, splitter, multipliers } = config;

//   // reelStopPositions
//   const rsp = Array(15).fill(0);
//   coins.forEach((c) => { rsp[c.position] = c.colorCode; });

//   const sorted = [...coins].sort((a, b) => a.position - b.position);

//   // landedCoinsInBonusBoost
//   // [pos, colorCode, value, "winged"?, splitCount?]
//   const landedCoins = sorted.map((c) => {
//     const row: any[] = [c.position, c.colorCode, c.value];
//     if (hasStrike && c.winged)             row.push("winged");
//     if (hasSplit && c.splitCount && c.splitCount > 1) row.push(c.splitCount);
//     return row;
//   });

//   // boostValues — coin 1 boosts for winged coins
//   const boostValues = Array(15).fill(0);
//   let hasBoost = false;
//   if (hasStrike) {
//     coins.forEach((c) => {
//       if (c.winged && c.boostValue !== undefined && c.boostValue !== "") {
//         const n = Number(c.boostValue);
//         boostValues[c.position] = isNaN(n) ? c.boostValue : n;
//         if (n !== 0) hasBoost = true;
//       }
//     });
//   }

//   // numberOfSplitCoins
//   const numberOfSplitCoins = Array(15).fill(0);
//   let hasSplitCoins = false;
//   if (hasSplit) {
//     coins.forEach((c) => {
//       if (c.splitCount && c.splitCount > 1) {
//         numberOfSplitCoins[c.position] = c.splitCount;
//         hasSplitCoins = true;
//       }
//     });
//   }

//   // splitCoinsBoostValues — [array for coin2, array for coin3, array for coin4]
//   // Only for strike+split combos; arrays at positions of split coins
//   const splitBoostArrays: (number | string)[][] = [
//     Array(15).fill(0), Array(15).fill(0), Array(15).fill(0),
//   ];
//   let hasSplitBoost = false;
//   if (hasStrike && hasSplit) {
//     coins.forEach((c) => {
//       if (c.winged && c.splitCount && c.splitCount > 1 && c.splitBoostValues) {
//         c.splitBoostValues.forEach((bv, idx) => {
//           if (bv !== undefined && bv !== "") {
//             const n = Number(bv);
//             splitBoostArrays[idx][c.position] = isNaN(n) ? bv : n;
//             if (n !== 0) hasSplitBoost = true;
//           }
//         });
//       }
//     });
//   }

//   let out = `[reelStopPositions: [${rsp.join(",")}]`;

//   if (landedCoins.length > 0)
//     out += `,landedCoinsInBonusBoost: [${landedCoins.map((r: any[]) => `[${r.join(",")}]`).join(",")}]`;

//   if (hasBoost)
//     out += `,boostValues: [${boostValues.join(",")}]`;

//   if (hasSplitCoins)
//     out += `,numberOfSplitCoins: [${numberOfSplitCoins.join(",")}]`;

//   if (hasSplitBoost) {
//     const maxExtra = Math.max(...coins.filter((c) => c.winged && hasSplit).map((c) => (c.splitCount ?? 1) - 1), 0);
//     out += `,splitCoinsBoostValues: [${splitBoostArrays.slice(0, maxExtra).map((a) => `[${a.join(",")}]`).join(",")}]`;
//   }

//   // if (hasZone && splitter)                             out += `, zoneSplitter: ${splitter}`;
//   // if (hasZone && multipliers && multipliers.length > 0) out += `, zoneMultipliers: [${multipliers.join(",")}]`;

//   out += `]`;
//   return out;
// }



//! latest working code
/* eslint-disable @typescript-eslint/no-explicit-any */

// export type CoinColorOption = { label: string; value: number };

// // ── UPGRADE MAP ───────────────────────────────────────────────────────────────
// // Maps a coin's label keyword → which feature it can upgrade to.
// // "gold" coins cannot upgrade. "All-Color" can upgrade to any feature.
// // These are the single-color → feature mappings (case-insensitive label check).
// export const COLOR_TO_FEATURE: Record<string, string> = {
//   orange: "strike",
//   blue:   "zone",
//   green:  "extra",
//   cerise: "split",
//   pink:   "split",
// };
// // "All-Color" → can upgrade to any of the 4 features (user picks subset)
// export const ALL_COLOR_FEATURES = ["strike", "zone", "extra", "split"];

// /** Given a coin color label (e.g. "Orange (4)"), return the upgradeable feature or null */
// export function getUpgradeFeature(label: string): string | null {
//   const lower = label.toLowerCase();
//   if (lower.includes("gold"))      return null; // no upgrade
//   if (lower.includes("all-color") || lower.includes("all color")) return "all";
//   for (const [key, feat] of Object.entries(COLOR_TO_FEATURE)) {
//     if (lower.includes(key)) return feat;
//   }
//   return null;
// }

// // ─────────────────────────────────────────────────────────────────────────────
// export const COMBO_COIN_COLORS: Record<string, CoinColorOption[]> = {
//   "extra+zone":        [{ label:"Orange (4)", value:4 }, { label:"Cerise (9)", value:9 }, { label:"All-Color (14)", value:14 }, { label:"Gold (19)", value:19 }],
//   "extra+split":       [{ label:"Green (4)", value:4 }, { label:"Blue (9)", value:9 }, { label:"Orange (14)", value:14 }, { label:"Cerise (19)", value:19 }],
//   "extra+strike":      [{ label:"Blue (4)", value:4 }, { label:"Cerise (9)", value:9 }, { label:"All-Color (14)", value:14 }, { label:"Gold (19)", value:19 }],
//   "split+zone":        [{ label:"Orange (4)", value:4 }, { label:"Blue (9)", value:9 }, { label:"All-Color (14)", value:14 }, { label:"Gold (19)", value:19 }],
//   "split+strike":      [{ label:"Blue (4)", value:4 }, { label:"Green (9)", value:9 }, { label:"All-Color (14)", value:14 }, { label:"Gold (19)", value:19 }],
//   "split+extra":       [{ label:"Orange (4)", value:4 }, { label:"Blue (9)", value:9 }, { label:"All-Color (14)", value:14 }, { label:"Gold (19)", value:19 }],
//   "strike+zone":       [{ label:"Cerise (4)", value:4 }, { label:"Green (9)", value:9 }, { label:"All-Color (14)", value:14 }, { label:"Gold (19)", value:19 }],
//   "extra+split+zone":  [{ label:"Orange (4)", value:4 }, { label:"All-Color (9)", value:9 }, { label:"Gold (14)", value:14 }, { label:"Gold (19)", value:19 }],
//   "extra+split+strike":[{ label:"Blue (4)", value:4 }, { label:"All-Color (9)", value:9 }, { label:"Gold (14)", value:14 }, { label:"Gold (19)", value:19 }],
//   "extra+strike+zone": [{ label:"Cerise (4)", value:4 }, { label:"All-Color (9)", value:9 }, { label:"Gold (14)", value:14 }, { label:"Gold (19)", value:19 }],
//   "split+strike+zone": [{ label:"Green (4)", value:4 }, { label:"All-Color (9)", value:9 }, { label:"Gold (14)", value:14 }, { label:"Gold (19)", value:19 }],
//   "extra+split+strike+zone":[{ label:"Green (4)", value:4 }, { label:"Blue (9)", value:9 }, { label:"Orange (14)", value:14 }, { label:"Cerise (19)", value:19 }],
// };

// export const COMBO_SCAT_SEED_COLOR: Record<string, Record<string, number>> = {
//   "extra+zone":         { green:4, blue:9, orange:14, cerise:19, all:4  },
//   "extra+split":        { green:4, blue:9, orange:14, cerise:19, all:19 },
//   "extra+strike":       { green:4, blue:9, orange:14, cerise:19, all:14 },
//   "split+zone":         { green:4, blue:9, orange:14, cerise:19, all:19 },
//   "split+strike":       { green:4, blue:9, orange:14, cerise:19, all:19 },
//   "strike+zone":        { green:4, blue:9, orange:14, cerise:19, all:14 },
//   "extra+split+zone":   { green:4, blue:9, orange:14, cerise:19, all:19 },
//   "extra+split+strike": { green:4, blue:9, orange:14, cerise:19, all:19 },
//   "extra+strike+zone":  { green:4, blue:9, orange:14, cerise:19, all:14 },
//   "split+strike+zone":  { green:4, blue:9, orange:14, cerise:19, all:19 },
//   "extra+split+strike+zone": { green:4, blue:9, orange:14, cerise:19, all:19 },
// };

// // ── TYPES ─────────────────────────────────────────────────────────────────────
// export type ComboCoin = {
//   position:          number;
//   colorCode:         number;
//   value:             string;
//   winged?:           boolean;
//   boostValue?:       string;
//   splitCount?:       number;
//   splitCopyValues?:  string[];   // per-copy value overrides (index = copyIdx)
//   splitBoostValues?: string[];
//   upgraded?:         boolean;        // true = this coin triggered an upgrade
//   upgradeFeatures?:  string[];       // which features were upgraded (for all-color coins)
//   fromBase?:         boolean;
// };

// export type ComboFeatureConfig = {
//   features:      string[];
//   hasExtra:      boolean;
//   hasZone:       boolean;
//   hasStrike:     boolean;
//   hasSplit:      boolean;
//   splitter?:     number;
//   multipliers?:  number[];
// };

// // ── HELPERS ───────────────────────────────────────────────────────────────────
// export function getComboKey(features: string[]): string {
//   return [...features].sort().join("+");
// }

// export function getComboCoinColors(features: string[]): CoinColorOption[] {
//   const key = getComboKey(features);
//   return COMBO_COIN_COLORS[key] ?? [
//     { label:"Green (4)", value:4 }, { label:"Blue (9)", value:9 },
//     { label:"Orange (14)", value:14 }, { label:"Cerise (19)", value:19 },
//   ];
// }

// export function getComboScatSeedColor(features: string[], scatKey: string): number {
//   const key = getComboKey(features);
//   return COMBO_SCAT_SEED_COLOR[key]?.[scatKey] ?? 4;
// }

// export function getComboMaxSpins(config: ComboFeatureConfig): number {
//   return config.hasExtra ? 4 : 3;
// }

// // ── OUTPUT GENERATOR ─────────────────────────────────────────────────────────
// export function generateCombinationGaffe(
//   coins: ComboCoin[],
//   config: ComboFeatureConfig,
//   coinColorOptions: CoinColorOption[]
// ): string {
//   const { hasStrike, hasZone, hasSplit, splitter, multipliers } = config;

//   const rsp = Array(15).fill(0);
//   coins.forEach((c) => { rsp[c.position] = c.colorCode; });

//   const sorted = [...coins].sort((a, b) => a.position - b.position);

//   // landedCoinsInBonusBoost — one entry per copy (like SplitFeature)
//   const landedCoins: any[][] = [];
//   sorted.forEach((c) => {
//     const totalCopies = hasSplit ? (c.splitCount ?? 1) : 1;
//     for (let copyIdx = 0; copyIdx < totalCopies; copyIdx++) {
//       const val = c.splitCopyValues?.[copyIdx] ?? c.value;
//       const entry: any[] = [c.position, c.colorCode, val];
//       if (hasStrike && c.winged) entry.push("winged");
//       entry.push(copyIdx); // 0-based copy index always present
//       landedCoins.push(entry);
//     }
//   });

//   // boostValues
//   const boostValues = Array(15).fill(0);
//   let hasBoost = false;
//   if (hasStrike) {
//     coins.forEach((c) => {
//       if (c.winged && c.boostValue !== undefined && c.boostValue !== "") {
//         const n = Number(c.boostValue);
//         boostValues[c.position] = isNaN(n) ? c.boostValue : n;
//         if (n !== 0) hasBoost = true;
//       }
//     });
//   }

//   // numberOfSplitCoins
//   const numberOfSplitCoins = Array(15).fill(0);
//   let hasSplitCoins = false;
//   if (hasSplit) {
//     coins.forEach((c) => {
//       if ((c.splitCount ?? 1) > 1) {
//         numberOfSplitCoins[c.position] = c.splitCount!;
//         hasSplitCoins = true;
//       }
//     });
//   }

//   // splitCoinsBoostValues
//   const splitBoostArrays: (number | string)[][] = [Array(15).fill(0), Array(15).fill(0), Array(15).fill(0)];
//   let hasSplitBoost = false;
//   if (hasStrike && hasSplit) {
//     coins.forEach((c) => {
//       if (c.winged && (c.splitCount ?? 1) > 1 && c.splitBoostValues) {
//         c.splitBoostValues.forEach((bv, idx) => {
//           if (bv !== undefined && bv !== "") {
//             const n = Number(bv);
//             splitBoostArrays[idx][c.position] = isNaN(n) ? bv : n;
//             if (n !== 0) hasSplitBoost = true;
//           }
//         });
//       }
//     });
//   }

//   // additionalFeatureTriggered — collect all upgrade features across all upgraded coins
//   const additionalFeatures = new Set<string>();
//   coins.forEach((c) => {
//     if (!c.upgraded) return;
//     const label = coinColorOptions.find((o) => o.value === c.colorCode)?.label ?? "";
//     const upgradeType = getUpgradeFeature(label);
//     if (upgradeType === "all") {
//       (c.upgradeFeatures ?? []).forEach((f) => additionalFeatures.add(f));
//     } else if (upgradeType) {
//       additionalFeatures.add(upgradeType);
//     }
//   });

//   let out = `[reelStopPositions: [${rsp.join(",")}]`;

//   if (landedCoins.length > 0)
//     out += `,landedCoinsInBonusBoost: [${landedCoins.map((r) => `[${r.join(",")}]`).join(",")}]`;

//   if (hasBoost)
//     out += `,boostValues: [${boostValues.join(",")}]`;

//   if (hasSplitCoins)
//     out += `,numberOfSplitCoins: [${numberOfSplitCoins.join(",")}]`;

//   if (hasSplitBoost) {
//     const maxExtra = Math.max(...coins.filter((c) => c.winged && hasSplit).map((c) => (c.splitCount ?? 1) - 1), 0);
//     out += `,splitCoinsBoostValues: [${splitBoostArrays.slice(0, maxExtra).map((a) => `[${a.join(",")}]`).join(",")}]`;
//   }

//   if (hasZone && splitter)                              out += `,zoneSplitter: ${splitter}`;
//   if (hasZone && multipliers && multipliers.length > 0) out += `,zoneMultipliers: [${multipliers.join(",")}]`;

//   if (additionalFeatures.size > 0)
//     out += `,additionalFeatureTriggered: [${[...additionalFeatures].join(",")}]`;

//   out += `]`;
//   return out;
// }


//! working
/* eslint-disable @typescript-eslint/no-explicit-any */

// export type CoinColorOption = { label: string; value: number };

// // ── Upgrade helpers ───────────────────────────────────────────────────────────
// export const COLOR_UPGRADE_MAP: Record<string, string> = {
//   orange: "strike",
//   blue:   "zone",
//   green:  "extra",
//   cerise: "split",
//   pink:   "split",
// };
// export const ALL_COLOR_UPGRADE_FEATURES = ["strike", "zone", "extra", "split"];

// /**
//  * Returns:
//  *   "gold"    → no upgrade
//  *   "all"     → all-color; user picks subset
//  *   "strike" | "zone" | "extra" | "split" → single upgrade target
//  *   null      → unknown / no upgrade
//  */
// export function getUpgradeType(label: string): string | null {
//   const l = label.toLowerCase();
//   if (l.includes("gold"))                                      return "gold";
//   if (l.includes("all-color") || l.includes("all color"))     return "all";
//   for (const [key, feat] of Object.entries(COLOR_UPGRADE_MAP)) {
//     if (l.includes(key)) return feat;
//   }
//   return null;
// }

// // ── Coin color tables ─────────────────────────────────────────────────────────
// export const COMBO_COIN_COLORS: Record<string, CoinColorOption[]> = {
//   "extra+zone":        [{ label:"Orange (4)", value:4 }, { label:"Cerise (9)", value:9 }, { label:"All-Color (14)", value:14 }, { label:"Gold (19)", value:19 }],
//   "extra+split":       [{ label:"Green (4)", value:4 }, { label:"Blue (9)", value:9 }, { label:"Orange (14)", value:14 }, { label:"Cerise (19)", value:19 }],
//   "extra+strike":      [{ label:"Blue (4)", value:4 }, { label:"Cerise (9)", value:9 }, { label:"All-Color (14)", value:14 }, { label:"Gold (19)", value:19 }],
//   "split+zone":        [{ label:"Orange (4)", value:4 }, { label:"Blue (9)", value:9 }, { label:"All-Color (14)", value:14 }, { label:"Gold (19)", value:19 }],
//   "split+strike":      [{ label:"Blue (4)", value:4 }, { label:"Green (9)", value:9 }, { label:"All-Color (14)", value:14 }, { label:"Gold (19)", value:19 }],
//   "split+extra":       [{ label:"Orange (4)", value:4 }, { label:"Blue (9)", value:9 }, { label:"All-Color (14)", value:14 }, { label:"Gold (19)", value:19 }],
//   "strike+zone":       [{ label:"Cerise (4)", value:4 }, { label:"Green (9)", value:9 }, { label:"All-Color (14)", value:14 }, { label:"Gold (19)", value:19 }],
//   "extra+split+zone":  [{ label:"Orange (4)", value:4 }, { label:"All-Color (9)", value:9 }, { label:"Gold (14)", value:14 }, { label:"Gold (19)", value:19 }],
//   "extra+split+strike":[{ label:"Blue (4)", value:4 }, { label:"All-Color (9)", value:9 }, { label:"Gold (14)", value:14 }, { label:"Gold (19)", value:19 }],
//   "extra+strike+zone": [{ label:"Cerise (4)", value:4 }, { label:"All-Color (9)", value:9 }, { label:"Gold (14)", value:14 }, { label:"Gold (19)", value:19 }],
//   "split+strike+zone": [{ label:"Green (4)", value:4 }, { label:"All-Color (9)", value:9 }, { label:"Gold (14)", value:14 }, { label:"Gold (19)", value:19 }],
//   "extra+split+strike+zone":[{ label:"Green (4)", value:4 }, { label:"Blue (9)", value:9 }, { label:"Orange (14)", value:14 }, { label:"Cerise (19)", value:19 }],
// };

// export const COMBO_SCAT_SEED_COLOR: Record<string, Record<string, number>> = {
//   "extra+zone":         { green:4, blue:9, orange:14, cerise:19, all:4  },
//   "extra+split":        { green:4, blue:9, orange:14, cerise:19, all:19 },
//   "extra+strike":       { green:4, blue:9, orange:14, cerise:19, all:14 },
//   "split+zone":         { green:4, blue:9, orange:14, cerise:19, all:19 },
//   "split+strike":       { green:4, blue:9, orange:14, cerise:19, all:19 },
//   "strike+zone":        { green:4, blue:9, orange:14, cerise:19, all:14 },
//   "extra+split+zone":   { green:4, blue:9, orange:14, cerise:19, all:19 },
//   "extra+split+strike": { green:4, blue:9, orange:14, cerise:19, all:19 },
//   "extra+strike+zone":  { green:4, blue:9, orange:14, cerise:19, all:14 },
//   "split+strike+zone":  { green:4, blue:9, orange:14, cerise:19, all:19 },
//   "extra+split+strike+zone": { green:4, blue:9, orange:14, cerise:19, all:19 },
// };

// // ── Types ─────────────────────────────────────────────────────────────────────
// export type ComboCoin = {
//   position:          number;
//   colorCode:         number;
//   value:             string;
//   winged?:           boolean;
//   boostValue?:       string;
//   splitCount?:       number;
//   splitCopyValues?:  string[];   // per-copy value; [copyIdx]
//   splitBoostValues?: string[];   // strike+split extra copy boosts
//   upgraded?:         boolean;
//   upgradeFeatures?:  string[];
//   fromBase?:         boolean;
// };

// export type ComboFeatureConfig = {
//   features:      string[];
//   hasExtra:      boolean;
//   hasZone:       boolean;
//   hasStrike:     boolean;
//   hasSplit:      boolean;
//   splitter?:     number;
//   multipliers?:  number[];
// };

// // ── Helpers ───────────────────────────────────────────────────────────────────
// export function getComboKey(features: string[]): string {
//   return [...features].sort().join("+");
// }

// export function getComboCoinColors(features: string[]): CoinColorOption[] {
//   const key = getComboKey(features);
//   return COMBO_COIN_COLORS[key] ?? [
//     { label:"Green (4)", value:4 }, { label:"Blue (9)", value:9 },
//     { label:"Orange (14)", value:14 }, { label:"Cerise (19)", value:19 },
//   ];
// }

// export function getComboScatSeedColor(features: string[], scatKey: string): number {
//   const key = getComboKey(features);
//   return COMBO_SCAT_SEED_COLOR[key]?.[scatKey] ?? 4;
// }

// export function getComboMaxSpins(config: ComboFeatureConfig, upgradedFeatures: string[] = []): number {
//   return config.hasExtra || upgradedFeatures.includes("extra") ? 4 : 3;
// }

// // ── Output generator ──────────────────────────────────────────────────────────
// export function generateCombinationGaffe(
//   coins: ComboCoin[],
//   config: ComboFeatureConfig,
//   upgradedZoneSplitter?: number,
//   upgradedZoneMultipliers?: number[]
// ): string {
//   const allUpgraded = new Set(coins.flatMap((c) => (c.upgraded ? (c.upgradeFeatures ?? []) : [])));
//   const effStrike = config.hasStrike || allUpgraded.has("strike");
//   const effZone   = config.hasZone   || allUpgraded.has("zone");
//   const effSplit  = config.hasSplit  || allUpgraded.has("split");

//   const rsp = Array(15).fill(0);
//   coins.forEach((c) => { rsp[c.position] = c.colorCode; });

//   const sorted = [...coins].sort((a, b) => a.position - b.position);

//   // landedCoinsInBonusBoost — one entry per copy (0-based copyIdx)
//   const landedCoins: any[][] = [];
//   sorted.forEach((c) => {
//     const copies = effSplit ? (c.splitCount ?? 1) : 1;
//     for (let ci = 0; ci < copies; ci++) {
//       const val = c.splitCopyValues?.[ci] ?? c.value;
//       const entry: any[] = [c.position, c.colorCode, val];
//       if (effStrike && c.winged) entry.push("winged");
//       entry.push(ci);
//       landedCoins.push(entry);
//     }
//   });

//   // boostValues
//   const boostValues = Array(15).fill(0);
//   let hasBoost = false;
//   if (effStrike) {
//     coins.forEach((c) => {
//       if (c.winged && c.boostValue) {
//         const n = Number(c.boostValue);
//         boostValues[c.position] = isNaN(n) ? c.boostValue : n;
//         if (n !== 0) hasBoost = true;
//       }
//     });
//   }

//   // numberOfSplitCoins
//   const numSplit = Array(15).fill(0);
//   let hasSplitCoins = false;
//   if (effSplit) {
//     coins.forEach((c) => {
//       if ((c.splitCount ?? 1) > 1) { numSplit[c.position] = c.splitCount!; hasSplitCoins = true; }
//     });
//   }

//   // splitCoinsBoostValues
//   const splitBoostArrays: (number | string)[][] = [Array(15).fill(0), Array(15).fill(0), Array(15).fill(0)];
//   let hasSplitBoost = false;
//   if (effStrike && effSplit) {
//     coins.forEach((c) => {
//       if (c.winged && (c.splitCount ?? 1) > 1 && c.splitBoostValues) {
//         c.splitBoostValues.forEach((bv, idx) => {
//           if (bv !== undefined && bv !== "") {
//             const n = Number(bv);
//             splitBoostArrays[idx][c.position] = isNaN(n) ? bv : n;
//             if (n !== 0) hasSplitBoost = true;
//           }
//         });
//       }
//     });
//   }

//   // Zone
//   const effSplitter    = effZone ? (upgradedZoneSplitter    ?? config.splitter)    : undefined;
//   const effMultipliers = effZone ? (upgradedZoneMultipliers ?? config.multipliers) : undefined;

//   const additional = [...allUpgraded];

//   let out = `[reelStopPositions: [${rsp.join(",")}]`;
//   if (landedCoins.length > 0)
//     out += `,landedCoinsInBonusBoost: [${landedCoins.map((r) => `[${r.join(",")}]`).join(",")}]`;
//   if (hasBoost)
//     out += `,boostValues: [${boostValues.join(",")}]`;
//   if (hasSplitCoins)
//     out += `,numberOfSplitCoins: [${numSplit.join(",")}]`;
//   if (hasSplitBoost) {
//     const maxExtra = Math.max(...coins.filter((c) => c.winged && effSplit).map((c) => (c.splitCount ?? 1) - 1), 0);
//     out += `,splitCoinsBoostValues: [${splitBoostArrays.slice(0, maxExtra).map((a) => `[${a.join(",")}]`).join(",")}]`;
//   }
//   if (effZone && effSplitter)
//     out += `,zoneSplitter: ${effSplitter}`;
//   if (effZone && effMultipliers && effMultipliers.length > 0)
//     out += `,zoneMultipliers: [${effMultipliers.join(",")}]`;
//   if (additional.length > 0)
//     out += `,additionalFeatureTriggered: [${additional.join(",")}]`;
//   out += `]`;
//   return out;
// }





//! working latest -------------------------------------------------------------------------------------
// /* eslint-disable @typescript-eslint/no-explicit-any */

// export type CoinColorOption = { label: string; value: number };

// // ── All upgradeable features in this game ─────────────────────────────────────
// export const ALL_UPGRADE_FEATURES = ["STRIKE", "ZONE", "EXTRA", "SPLIT"];

// // ── Coin color tables ─────────────────────────────────────────────────────────
// export const COMBO_COIN_COLORS: Record<string, CoinColorOption[]> = {
//   "extra+zone":        [{ label:"Orange (4)", value:4 }, { label:"Cerise (9)", value:9 }, { label:"All-Color (14)", value:14 }, { label:"gold (19)", value:19 }],
//   "extra+split":       [{ label:"Green (4)", value:4 }, { label:"Blue (9)", value:9 }, { label:"Orange (14)", value:14 }, { label:"Cerise (19)", value:19 }],
//   "extra+strike":      [{ label:"Blue (4)", value:4 }, { label:"Cerise (9)", value:9 }, { label:"All-Color (14)", value:14 }, { label:"gold (19)", value:19 }],
//   "split+zone":        [{ label:"Orange (4)", value:4 }, { label:"Blue (9)", value:9 }, { label:"All-Color (14)", value:14 }, { label:"gold (19)", value:19 }],
//   "split+strike":      [{ label:"Blue (4)", value:4 }, { label:"Green (9)", value:9 }, { label:"All-Color (14)", value:14 }, { label:"gold (19)", value:19 }],
//   "split+extra":       [{ label:"Orange (4)", value:4 }, { label:"Blue (9)", value:9 }, { label:"All-Color (14)", value:14 }, { label:"gold (19)", value:19 }],
//   "strike+zone":       [{ label:"Cerise (4)", value:4 }, { label:"Green (9)", value:9 }, { label:"All-Color (14)", value:14 }, { label:"gold (19)", value:19 }],
//   "extra+split+zone":  [{ label:"Orange (4)", value:4 }, { label:"All-Color (9)", value:9 }, { label:"gold (14)", value:14 }, { label:"gold (19)", value:19 }],
//   "extra+split+strike":[{ label:"Blue (4)", value:4 }, { label:"All-Color (9)", value:9 }, { label:"gold (14)", value:14 }, { label:"gold (19)", value:19 }],
//   "extra+strike+zone": [{ label:"Cerise (4)", value:4 }, { label:"All-Color (9)", value:9 }, { label:"gold (14)", value:14 }, { label:"gold (19)", value:19 }],
//   "split+strike+zone": [{ label:"Green (4)", value:4 }, { label:"All-Color (9)", value:9 }, { label:"gold (14)", value:14 }, { label:"gold (19)", value:19 }],
//   "extra+split+strike+zone":[{ label:"Green (4)", value:4 }, { label:"Blue (9)", value:9 }, { label:"Orange (14)", value:14 }, { label:"Cerise (19)", value:19 }],
// };

// export const COMBO_SCAT_SEED_COLOR: Record<string, Record<string, number>> = {
//   "extra+zone":         { green:4, blue:9, orange:14, cerise:19, all:4  },
//   "extra+split":        { green:4, blue:9, orange:14, cerise:19, all:19 },
//   "extra+strike":       { green:4, blue:9, orange:14, cerise:19, all:14 },
//   "split+zone":         { green:4, blue:9, orange:14, cerise:19, all:19 },
//   "split+strike":       { green:4, blue:9, orange:14, cerise:19, all:19 },
//   "strike+zone":        { green:4, blue:9, orange:14, cerise:19, all:14 },
//   "extra+split+zone":   { green:4, blue:9, orange:14, cerise:19, all:19 },
//   "extra+split+strike": { green:4, blue:9, orange:14, cerise:19, all:19 },
//   "extra+strike+zone":  { green:4, blue:9, orange:14, cerise:19, all:14 },
//   "split+strike+zone":  { green:4, blue:9, orange:14, cerise:19, all:19 },
//   "extra+split+strike+zone": { green:4, blue:9, orange:14, cerise:19, all:19 },
// };

// // ── Types ─────────────────────────────────────────────────────────────────────
// export type ComboCoin = {
//   position:          number;
//   colorCode:         number;
//   value:             string;
//   winged?:           boolean;
//   boostValue?:       string;
//   splitCount?:       number;
//   splitBoostValues?: string[];
//   fromBase?:         boolean;
// };

// export type ComboFeatureConfig = {
//   features:      string[];
//   hasExtra:      boolean;
//   hasZone:       boolean;
//   hasStrike:     boolean;
//   hasSplit:      boolean;
//   splitter?:     number;
//   multipliers?:  number[];
// };

// export type UpgradeInfo = {
//   col:              number;
//   row:              number;
//   features:         string[];   // e.g. ["ZONE"] or ["STRIKE", "EXTRA"]
//   zoneSplitter?:    number;
//   zoneMultipliers?: number[];
// };

// // ── resolveUpgradeFeatures ────────────────────────────────────────────────────
// // Given a coin color label from the Ignite Purple palette, returns the
// // UPPERCASE feature name(s) that coin can upgrade to.
// // Returns [] for gold (no upgrade).
// // Caller handles all-color coins separately (isAllColor check).
// const LABEL_KEYWORD_MAP: Record<string, string> = {
//   orange: "STRIKE",
//   blue:   "ZONE",
//   green:  "EXTRA",
//   cerise: "SPLIT",
// };

// export function resolveUpgradeFeatures(colorLabel: string): string[] {
//   const l = colorLabel.toLowerCase();
//   if (l.includes("gold"))                                      return [];
//   if (l.includes("all-color") || l.includes("all color"))     return []; // handled via isAllColor
//   for (const [key, feat] of Object.entries(LABEL_KEYWORD_MAP)) {
//     if (l.includes(key)) return [feat];
//   }
//   return [];
// }

// // ── Helpers ───────────────────────────────────────────────────────────────────
// export function getComboKey(features: string[]): string {
//   return [...features].sort().join("+");
// }

// export function getComboCoinColors(features: string[]): CoinColorOption[] {
//   const key = getComboKey(features);
//   return COMBO_COIN_COLORS[key] ?? [
//     { label:"Green (4)", value:4 }, { label:"Blue (9)", value:9 },
//     { label:"Orange (14)", value:14 }, { label:"Cerise (19)", value:19 },
//   ];
// }

// export function getComboScatSeedColor(features: string[], scatKey: string): number {
//   const key = getComboKey(features);
//   return COMBO_SCAT_SEED_COLOR[key]?.[scatKey] ?? 4;
// }

// export function getComboMaxSpins(config: ComboFeatureConfig): number {
//   return config.hasExtra ? 4 : 3;
// }

// // ── Output generator ──────────────────────────────────────────────────────────
// export function generateCombinationGaffe(
//   coins: ComboCoin[],
//   config: ComboFeatureConfig,
//   upgrade: UpgradeInfo | null = null
// ): string {
//   const { hasStrike, hasZone, hasSplit, splitter, multipliers } = config;

//   const rsp = Array(15).fill(0);
//   coins.forEach((c) => { rsp[c.position] = c.colorCode; });

//   const sorted = [...coins].sort((a, b) => a.position - b.position);

//   const landedCoins = sorted.map((c) => {
//     const row: any[] = [c.position, c.colorCode, c.value];
//     if (hasStrike && c.winged)                       row.push("winged");
//     if (hasSplit && c.splitCount && c.splitCount > 1) row.push(c.splitCount);
//     return row;
//   });

//   const boostValues = Array(15).fill(0);
//   let hasBoost = false;
//   if (hasStrike) {
//     coins.forEach((c) => {
//       if (c.winged && c.boostValue !== undefined && c.boostValue !== "") {
//         const n = Number(c.boostValue);
//         boostValues[c.position] = isNaN(n) ? c.boostValue : n;
//         if (n !== 0) hasBoost = true;
//       }
//     });
//   }

//   const numSplit = Array(15).fill(0);
//   let hasSplitCoins = false;
//   if (hasSplit) {
//     coins.forEach((c) => {
//       if (c.splitCount && c.splitCount > 1) {
//         numSplit[c.position] = c.splitCount; hasSplitCoins = true;
//       }
//     });
//   }

//   const splitBoostArrays: (number | string)[][] = [
//     Array(15).fill(0), Array(15).fill(0), Array(15).fill(0),
//   ];
//   let hasSplitBoost = false;
//   if (hasStrike && hasSplit) {
//     coins.forEach((c) => {
//       if (c.winged && c.splitCount && c.splitCount > 1 && c.splitBoostValues) {
//         c.splitBoostValues.forEach((bv, idx) => {
//           if (bv !== undefined && bv !== "") {
//             const n = Number(bv);
//             splitBoostArrays[idx][c.position] = isNaN(n) ? bv : n;
//             if (n !== 0) hasSplitBoost = true;
//           }
//         });
//       }
//     });
//   }

//   const effSplitter    = upgrade?.zoneSplitter    ?? splitter;
//   const effMultipliers = upgrade?.zoneMultipliers ?? multipliers;

//   let out = `[reelStopPositions: [${rsp.join(",")}]`;
//   if (landedCoins.length > 0)
//     out += `,landedCoinsInBonusBoost: [${landedCoins.map((r: any[]) => `[${r.join(",")}]`).join(",")}]`;
//   if (hasBoost)
//     out += `,boostValues: [${boostValues.join(",")}]`;
//   if (hasSplitCoins)
//     out += `,numberOfSplitCoins: [${numSplit.join(",")}]`;
//   if (hasSplitBoost) {
//     const maxExtra = Math.max(...coins.filter((c) => c.winged && hasSplit).map((c) => (c.splitCount ?? 1) - 1), 0);
//     out += `,splitCoinsBoostValues: [${splitBoostArrays.slice(0, maxExtra).map((a) => `[${a.join(",")}]`).join(",")}]`;
//   }
//   if (hasZone && effSplitter)
//     out += `,zoneSplitter: ${effSplitter}`;
//   if (hasZone && effMultipliers && effMultipliers.length > 0)
//     out += `,zoneMultipliers: [${effMultipliers.join(",")}]`;
//   if (upgrade) {
//     out += `,upgradeCoinPosition: [${upgrade.col},${upgrade.row}]`;
//     if (upgrade.features.length > 0)
//       out += `,additionalFeatureTriggered: [${upgrade.features.map((f) => f.toLowerCase()).join(",")}]`;
//     if (upgrade.zoneSplitter)
//       out += `,upgradeZoneSplitter: ${upgrade.zoneSplitter}`;
//     if (upgrade.zoneMultipliers && upgrade.zoneMultipliers.length > 0)
//       out += `,upgradeZoneMultipliers: [${upgrade.zoneMultipliers.join(",")}]`;
//   }
//   out += `]`;
//   return out;
// }



// /* eslint-disable @typescript-eslint/no-explicit-any */

// export type CoinColorOption = { label: string; value: number };

// // !! Update values per combination  !!
// export const COMBO_COIN_COLORS: Record<string, CoinColorOption[]> = {
//   "extra+zone":        [{ label:"Orange (4)", value:4 }, { label:"Cerise (9)", value:9 }, { label:"All-Color (14)", value:14 }, { label:"gold (19)", value:19 }],
//   "extra+split":       [{ label:"Green (4)", value:4 }, { label:"Blue (9)", value:9 }, { label:"Orange (14)", value:14 }, { label:"Cerise (19)", value:19 }],
//   "extra+strike":      [{ label:"Blue (4)", value:4 }, { label:"Cerise (9)", value:9 }, { label:"All-Color (14)", value:14 }, { label:"gold (19)", value:19 }],
//   "split+zone":        [{ label:"Orange (4)", value:4 }, { label:"Blue (9)", value:9 }, { label:"All-Color (14)", value:14 }, { label:"gold (19)", value:19 }],
//   "split+strike":      [{ label:"Blue (4)", value:4 }, { label:"Green (9)", value:9 }, { label:"All-Color (14)", value:14 }, { label:"gold (19)", value:19 }],
//   "split+extra":      [{ label:"Orange (4)", value:4 }, { label:"Blue (9)", value:9 }, { label:"All-Color (14)", value:14 }, { label:"gold (19)", value:19 }],
//   "strike+zone":       [{ label:"Cerise (4)", value:4 }, { label:"Green (9)", value:9 }, { label:"All-Color (14)", value:14 }, { label:"gold (19)", value:19 }],
//   "extra+split+zone":  [{ label:"Orange (4)", value:4 }, { label:"All-Color (9)", value:9 }, { label:"gold (14)", value:14 }, { label:"gold (19)", value:19 }],
//   "extra+split+strike":[{ label:"Blue (4)", value:4 }, { label:"All-Color (9)", value:9 }, { label:"gold (14)", value:14 }, { label:"gold (19)", value:19 }],
//   "extra+strike+zone": [{ label:"Cerise (4)", value:4 }, { label:"All-Color (9)", value:9 }, { label:"gold (14)", value:14 }, { label:"gold (19)", value:19 }],
//   "split+strike+zone": [{ label:"Green (4)", value:4 }, { label:"All-Color (9)", value:9 }, { label:"gold (14)", value:14 }, { label:"gold (19)", value:19 }],
//   "extra+split+strike+zone":[{ label:"Green (4)", value:4 }, { label:"Blue (9)", value:9 }, { label:"Orange (14)", value:14 }, { label:"Cerise (19)", value:19 }],
// };


// // colorCode when a scat seeds into a specific combination
// export const COMBO_SCAT_SEED_COLOR: Record<string, Record<string, number>> = {
//   "extra+zone":         { green:4, blue:9, orange:14, cerise:19, all:4  },
//   "extra+split":        { green:4, blue:9, orange:14, cerise:19, all:19 },
//   "extra+strike":       { green:4, blue:9, orange:14, cerise:19, all:14 },
//   "split+zone":         { green:4, blue:9, orange:14, cerise:19, all:19 },
//   "split+strike":       { green:4, blue:9, orange:14, cerise:19, all:19 },
//   "strike+zone":        { green:4, blue:9, orange:14, cerise:19, all:14 },
//   "extra+split+zone":   { green:4, blue:9, orange:14, cerise:19, all:19 },
//   "extra+split+strike": { green:4, blue:9, orange:14, cerise:19, all:19 },
//   "extra+strike+zone":  { green:4, blue:9, orange:14, cerise:19, all:14 },
//   "split+strike+zone":  { green:4, blue:9, orange:14, cerise:19, all:19 },
//   "extra+split+strike+zone": { green:4, blue:9, orange:14, cerise:19, all:19 },
// };

// // ── TYPES ─────────────────────────────────────────────────────────────────────

// export type ComboCoin = {
//   position:         number;    // 0–14, column-major
//   colorCode:        number;
//   value:            string;
//   winged?:          boolean;   // strike
//   boostValue?:      string;    // strike: boost for coin 1 (or the only coin)
//   splitCount?:      number;    // split: 1–4
//   splitBoostValues?: string[]; // split+strike: boosts for split coins 2/3/4 [idx0=coin2, ...]
//   fromBase?:        boolean;
// };

// export type ComboFeatureConfig = {
//   features:      string[];
//   hasExtra:      boolean;
//   hasZone:       boolean;
//   hasStrike:     boolean;
//   hasSplit:      boolean;
//   splitter?:     number;
//   multipliers?:  number[];
// };

// // ── HELPERS ───────────────────────────────────────────────────────────────────

// export function getComboKey(features: string[]): string {
//   return [...features].sort().join("+");
// }

// export function getComboCoinColors(features: string[]): CoinColorOption[] {
//   const key = getComboKey(features);
//   return COMBO_COIN_COLORS[key] ?? [
//     { label:"Green (4)", value:4 }, { label:"Blue (9)", value:9 },
//     { label:"Orange (14)", value:14 }, { label:"Cerise (19)", value:19 },
//   ];
// }

// export function getComboScatSeedColor(features: string[], scatKey: string): number {
//   const key = getComboKey(features);
//   return COMBO_SCAT_SEED_COLOR[key]?.[scatKey] ?? 4;
// }

// /** 4 spins if Extra is in combo, else 3 */
// export function getComboMaxSpins(config: ComboFeatureConfig): number {
//   return config.hasExtra ? 4 : 3;
// }

// // ── OUTPUT GENERATOR ─────────────────────────────────────────────────────────

// export function generateCombinationGaffe(coins: ComboCoin[], config: ComboFeatureConfig): string {
//   const { hasStrike, hasZone, hasSplit, splitter, multipliers } = config;

//   // reelStopPositions
//   const rsp = Array(15).fill(0);
//   coins.forEach((c) => { rsp[c.position] = c.colorCode; });

//   const sorted = [...coins].sort((a, b) => a.position - b.position);

//   // landedCoinsInBonusBoost
//   // [pos, colorCode, value, "winged"?, splitCount?]
//   const landedCoins = sorted.map((c) => {
//     const row: any[] = [c.position, c.colorCode, c.value];
//     if (hasStrike && c.winged)             row.push("winged");
//     if (hasSplit && c.splitCount && c.splitCount > 1) row.push(c.splitCount);
//     return row;
//   });

//   // boostValues — coin 1 boosts for winged coins
//   const boostValues = Array(15).fill(0);
//   let hasBoost = false;
//   if (hasStrike) {
//     coins.forEach((c) => {
//       if (c.winged && c.boostValue !== undefined && c.boostValue !== "") {
//         const n = Number(c.boostValue);
//         boostValues[c.position] = isNaN(n) ? c.boostValue : n;
//         if (n !== 0) hasBoost = true;
//       }
//     });
//   }

//   // numberOfSplitCoins
//   const numberOfSplitCoins = Array(15).fill(0);
//   let hasSplitCoins = false;
//   if (hasSplit) {
//     coins.forEach((c) => {
//       if (c.splitCount && c.splitCount > 1) {
//         numberOfSplitCoins[c.position] = c.splitCount;
//         hasSplitCoins = true;
//       }
//     });
//   }

//   // splitCoinsBoostValues — [array for coin2, array for coin3, array for coin4]
//   // Only for strike+split combos; arrays at positions of split coins
//   const splitBoostArrays: (number | string)[][] = [
//     Array(15).fill(0), Array(15).fill(0), Array(15).fill(0),
//   ];
//   let hasSplitBoost = false;
//   if (hasStrike && hasSplit) {
//     coins.forEach((c) => {
//       if (c.winged && c.splitCount && c.splitCount > 1 && c.splitBoostValues) {
//         c.splitBoostValues.forEach((bv, idx) => {
//           if (bv !== undefined && bv !== "") {
//             const n = Number(bv);
//             splitBoostArrays[idx][c.position] = isNaN(n) ? bv : n;
//             if (n !== 0) hasSplitBoost = true;
//           }
//         });
//       }
//     });
//   }

//   let out = `[reelStopPositions: [${rsp.join(",")}]`;

//   if (landedCoins.length > 0)
//     out += `,landedCoinsInBonusBoost: [${landedCoins.map((r: any[]) => `[${r.join(",")}]`).join(",")}]`;

//   if (hasBoost)
//     out += `,boostValues: [${boostValues.join(",")}]`;

//   if (hasSplitCoins)
//     out += `,numberOfSplitCoins: [${numberOfSplitCoins.join(",")}]`;

//   if (hasSplitBoost) {
//     const maxExtra = Math.max(...coins.filter((c) => c.winged && hasSplit).map((c) => (c.splitCount ?? 1) - 1), 0);
//     out += `,splitCoinsBoostValues: [${splitBoostArrays.slice(0, maxExtra).map((a) => `[${a.join(",")}]`).join(",")}]`;
//   }

//   // if (hasZone && splitter)                             out += `, zoneSplitter: ${splitter}`;
//   // if (hasZone && multipliers && multipliers.length > 0) out += `, zoneMultipliers: [${multipliers.join(",")}]`;

//   out += `]`;
//   return out;
// }



//! latest working code
/* eslint-disable @typescript-eslint/no-explicit-any */

// export type CoinColorOption = { label: string; value: number };

// // ── UPGRADE MAP ───────────────────────────────────────────────────────────────
// // Maps a coin's label keyword → which feature it can upgrade to.
// // "gold" coins cannot upgrade. "All-Color" can upgrade to any feature.
// // These are the single-color → feature mappings (case-insensitive label check).
// export const COLOR_TO_FEATURE: Record<string, string> = {
//   orange: "strike",
//   blue:   "zone",
//   green:  "extra",
//   cerise: "split",
//   pink:   "split",
// };
// // "All-Color" → can upgrade to any of the 4 features (user picks subset)
// export const ALL_COLOR_FEATURES = ["strike", "zone", "extra", "split"];

// /** Given a coin color label (e.g. "Orange (4)"), return the upgradeable feature or null */
// export function getUpgradeFeature(label: string): string | null {
//   const lower = label.toLowerCase();
//   if (lower.includes("gold"))      return null; // no upgrade
//   if (lower.includes("all-color") || lower.includes("all color")) return "all";
//   for (const [key, feat] of Object.entries(COLOR_TO_FEATURE)) {
//     if (lower.includes(key)) return feat;
//   }
//   return null;
// }

// // ─────────────────────────────────────────────────────────────────────────────
// export const COMBO_COIN_COLORS: Record<string, CoinColorOption[]> = {
//   "extra+zone":        [{ label:"Orange (4)", value:4 }, { label:"Cerise (9)", value:9 }, { label:"All-Color (14)", value:14 }, { label:"Gold (19)", value:19 }],
//   "extra+split":       [{ label:"Green (4)", value:4 }, { label:"Blue (9)", value:9 }, { label:"Orange (14)", value:14 }, { label:"Cerise (19)", value:19 }],
//   "extra+strike":      [{ label:"Blue (4)", value:4 }, { label:"Cerise (9)", value:9 }, { label:"All-Color (14)", value:14 }, { label:"Gold (19)", value:19 }],
//   "split+zone":        [{ label:"Orange (4)", value:4 }, { label:"Blue (9)", value:9 }, { label:"All-Color (14)", value:14 }, { label:"Gold (19)", value:19 }],
//   "split+strike":      [{ label:"Blue (4)", value:4 }, { label:"Green (9)", value:9 }, { label:"All-Color (14)", value:14 }, { label:"Gold (19)", value:19 }],
//   "split+extra":       [{ label:"Orange (4)", value:4 }, { label:"Blue (9)", value:9 }, { label:"All-Color (14)", value:14 }, { label:"Gold (19)", value:19 }],
//   "strike+zone":       [{ label:"Cerise (4)", value:4 }, { label:"Green (9)", value:9 }, { label:"All-Color (14)", value:14 }, { label:"Gold (19)", value:19 }],
//   "extra+split+zone":  [{ label:"Orange (4)", value:4 }, { label:"All-Color (9)", value:9 }, { label:"Gold (14)", value:14 }, { label:"Gold (19)", value:19 }],
//   "extra+split+strike":[{ label:"Blue (4)", value:4 }, { label:"All-Color (9)", value:9 }, { label:"Gold (14)", value:14 }, { label:"Gold (19)", value:19 }],
//   "extra+strike+zone": [{ label:"Cerise (4)", value:4 }, { label:"All-Color (9)", value:9 }, { label:"Gold (14)", value:14 }, { label:"Gold (19)", value:19 }],
//   "split+strike+zone": [{ label:"Green (4)", value:4 }, { label:"All-Color (9)", value:9 }, { label:"Gold (14)", value:14 }, { label:"Gold (19)", value:19 }],
//   "extra+split+strike+zone":[{ label:"Green (4)", value:4 }, { label:"Blue (9)", value:9 }, { label:"Orange (14)", value:14 }, { label:"Cerise (19)", value:19 }],
// };

// export const COMBO_SCAT_SEED_COLOR: Record<string, Record<string, number>> = {
//   "extra+zone":         { green:4, blue:9, orange:14, cerise:19, all:4  },
//   "extra+split":        { green:4, blue:9, orange:14, cerise:19, all:19 },
//   "extra+strike":       { green:4, blue:9, orange:14, cerise:19, all:14 },
//   "split+zone":         { green:4, blue:9, orange:14, cerise:19, all:19 },
//   "split+strike":       { green:4, blue:9, orange:14, cerise:19, all:19 },
//   "strike+zone":        { green:4, blue:9, orange:14, cerise:19, all:14 },
//   "extra+split+zone":   { green:4, blue:9, orange:14, cerise:19, all:19 },
//   "extra+split+strike": { green:4, blue:9, orange:14, cerise:19, all:19 },
//   "extra+strike+zone":  { green:4, blue:9, orange:14, cerise:19, all:14 },
//   "split+strike+zone":  { green:4, blue:9, orange:14, cerise:19, all:19 },
//   "extra+split+strike+zone": { green:4, blue:9, orange:14, cerise:19, all:19 },
// };

// // ── TYPES ─────────────────────────────────────────────────────────────────────
// export type ComboCoin = {
//   position:          number;
//   colorCode:         number;
//   value:             string;
//   winged?:           boolean;
//   boostValue?:       string;
//   splitCount?:       number;
//   splitCopyValues?:  string[];   // per-copy value overrides (index = copyIdx)
//   splitBoostValues?: string[];
//   upgraded?:         boolean;        // true = this coin triggered an upgrade
//   upgradeFeatures?:  string[];       // which features were upgraded (for all-color coins)
//   fromBase?:         boolean;
// };

// export type ComboFeatureConfig = {
//   features:      string[];
//   hasExtra:      boolean;
//   hasZone:       boolean;
//   hasStrike:     boolean;
//   hasSplit:      boolean;
//   splitter?:     number;
//   multipliers?:  number[];
// };

// // ── HELPERS ───────────────────────────────────────────────────────────────────
// export function getComboKey(features: string[]): string {
//   return [...features].sort().join("+");
// }

// export function getComboCoinColors(features: string[]): CoinColorOption[] {
//   const key = getComboKey(features);
//   return COMBO_COIN_COLORS[key] ?? [
//     { label:"Green (4)", value:4 }, { label:"Blue (9)", value:9 },
//     { label:"Orange (14)", value:14 }, { label:"Cerise (19)", value:19 },
//   ];
// }

// export function getComboScatSeedColor(features: string[], scatKey: string): number {
//   const key = getComboKey(features);
//   return COMBO_SCAT_SEED_COLOR[key]?.[scatKey] ?? 4;
// }

// export function getComboMaxSpins(config: ComboFeatureConfig): number {
//   return config.hasExtra ? 4 : 3;
// }

// // ── OUTPUT GENERATOR ─────────────────────────────────────────────────────────
// export function generateCombinationGaffe(
//   coins: ComboCoin[],
//   config: ComboFeatureConfig,
//   coinColorOptions: CoinColorOption[]
// ): string {
//   const { hasStrike, hasZone, hasSplit, splitter, multipliers } = config;

//   const rsp = Array(15).fill(0);
//   coins.forEach((c) => { rsp[c.position] = c.colorCode; });

//   const sorted = [...coins].sort((a, b) => a.position - b.position);

//   // landedCoinsInBonusBoost — one entry per copy (like SplitFeature)
//   const landedCoins: any[][] = [];
//   sorted.forEach((c) => {
//     const totalCopies = hasSplit ? (c.splitCount ?? 1) : 1;
//     for (let copyIdx = 0; copyIdx < totalCopies; copyIdx++) {
//       const val = c.splitCopyValues?.[copyIdx] ?? c.value;
//       const entry: any[] = [c.position, c.colorCode, val];
//       if (hasStrike && c.winged) entry.push("winged");
//       entry.push(copyIdx); // 0-based copy index always present
//       landedCoins.push(entry);
//     }
//   });

//   // boostValues
//   const boostValues = Array(15).fill(0);
//   let hasBoost = false;
//   if (hasStrike) {
//     coins.forEach((c) => {
//       if (c.winged && c.boostValue !== undefined && c.boostValue !== "") {
//         const n = Number(c.boostValue);
//         boostValues[c.position] = isNaN(n) ? c.boostValue : n;
//         if (n !== 0) hasBoost = true;
//       }
//     });
//   }

//   // numberOfSplitCoins
//   const numberOfSplitCoins = Array(15).fill(0);
//   let hasSplitCoins = false;
//   if (hasSplit) {
//     coins.forEach((c) => {
//       if ((c.splitCount ?? 1) > 1) {
//         numberOfSplitCoins[c.position] = c.splitCount!;
//         hasSplitCoins = true;
//       }
//     });
//   }

//   // splitCoinsBoostValues
//   const splitBoostArrays: (number | string)[][] = [Array(15).fill(0), Array(15).fill(0), Array(15).fill(0)];
//   let hasSplitBoost = false;
//   if (hasStrike && hasSplit) {
//     coins.forEach((c) => {
//       if (c.winged && (c.splitCount ?? 1) > 1 && c.splitBoostValues) {
//         c.splitBoostValues.forEach((bv, idx) => {
//           if (bv !== undefined && bv !== "") {
//             const n = Number(bv);
//             splitBoostArrays[idx][c.position] = isNaN(n) ? bv : n;
//             if (n !== 0) hasSplitBoost = true;
//           }
//         });
//       }
//     });
//   }

//   // additionalFeatureTriggered — collect all upgrade features across all upgraded coins
//   const additionalFeatures = new Set<string>();
//   coins.forEach((c) => {
//     if (!c.upgraded) return;
//     const label = coinColorOptions.find((o) => o.value === c.colorCode)?.label ?? "";
//     const upgradeType = getUpgradeFeature(label);
//     if (upgradeType === "all") {
//       (c.upgradeFeatures ?? []).forEach((f) => additionalFeatures.add(f));
//     } else if (upgradeType) {
//       additionalFeatures.add(upgradeType);
//     }
//   });

//   let out = `[reelStopPositions: [${rsp.join(",")}]`;

//   if (landedCoins.length > 0)
//     out += `,landedCoinsInBonusBoost: [${landedCoins.map((r) => `[${r.join(",")}]`).join(",")}]`;

//   if (hasBoost)
//     out += `,boostValues: [${boostValues.join(",")}]`;

//   if (hasSplitCoins)
//     out += `,numberOfSplitCoins: [${numberOfSplitCoins.join(",")}]`;

//   if (hasSplitBoost) {
//     const maxExtra = Math.max(...coins.filter((c) => c.winged && hasSplit).map((c) => (c.splitCount ?? 1) - 1), 0);
//     out += `,splitCoinsBoostValues: [${splitBoostArrays.slice(0, maxExtra).map((a) => `[${a.join(",")}]`).join(",")}]`;
//   }

//   if (hasZone && splitter)                              out += `,zoneSplitter: ${splitter}`;
//   if (hasZone && multipliers && multipliers.length > 0) out += `,zoneMultipliers: [${multipliers.join(",")}]`;

//   if (additionalFeatures.size > 0)
//     out += `,additionalFeatureTriggered: [${[...additionalFeatures].join(",")}]`;

//   out += `]`;
//   return out;
// }


//! working
/* eslint-disable @typescript-eslint/no-explicit-any */

// export type CoinColorOption = { label: string; value: number };

// // ── Upgrade helpers ───────────────────────────────────────────────────────────
// export const COLOR_UPGRADE_MAP: Record<string, string> = {
//   orange: "strike",
//   blue:   "zone",
//   green:  "extra",
//   cerise: "split",
//   pink:   "split",
// };
// export const ALL_COLOR_UPGRADE_FEATURES = ["strike", "zone", "extra", "split"];

// /**
//  * Returns:
//  *   "gold"    → no upgrade
//  *   "all"     → all-color; user picks subset
//  *   "strike" | "zone" | "extra" | "split" → single upgrade target
//  *   null      → unknown / no upgrade
//  */
// export function getUpgradeType(label: string): string | null {
//   const l = label.toLowerCase();
//   if (l.includes("gold"))                                      return "gold";
//   if (l.includes("all-color") || l.includes("all color"))     return "all";
//   for (const [key, feat] of Object.entries(COLOR_UPGRADE_MAP)) {
//     if (l.includes(key)) return feat;
//   }
//   return null;
// }

// // ── Coin color tables ─────────────────────────────────────────────────────────
// export const COMBO_COIN_COLORS: Record<string, CoinColorOption[]> = {
//   "extra+zone":        [{ label:"Orange (4)", value:4 }, { label:"Cerise (9)", value:9 }, { label:"All-Color (14)", value:14 }, { label:"Gold (19)", value:19 }],
//   "extra+split":       [{ label:"Green (4)", value:4 }, { label:"Blue (9)", value:9 }, { label:"Orange (14)", value:14 }, { label:"Cerise (19)", value:19 }],
//   "extra+strike":      [{ label:"Blue (4)", value:4 }, { label:"Cerise (9)", value:9 }, { label:"All-Color (14)", value:14 }, { label:"Gold (19)", value:19 }],
//   "split+zone":        [{ label:"Orange (4)", value:4 }, { label:"Blue (9)", value:9 }, { label:"All-Color (14)", value:14 }, { label:"Gold (19)", value:19 }],
//   "split+strike":      [{ label:"Blue (4)", value:4 }, { label:"Green (9)", value:9 }, { label:"All-Color (14)", value:14 }, { label:"Gold (19)", value:19 }],
//   "split+extra":       [{ label:"Orange (4)", value:4 }, { label:"Blue (9)", value:9 }, { label:"All-Color (14)", value:14 }, { label:"Gold (19)", value:19 }],
//   "strike+zone":       [{ label:"Cerise (4)", value:4 }, { label:"Green (9)", value:9 }, { label:"All-Color (14)", value:14 }, { label:"Gold (19)", value:19 }],
//   "extra+split+zone":  [{ label:"Orange (4)", value:4 }, { label:"All-Color (9)", value:9 }, { label:"Gold (14)", value:14 }, { label:"Gold (19)", value:19 }],
//   "extra+split+strike":[{ label:"Blue (4)", value:4 }, { label:"All-Color (9)", value:9 }, { label:"Gold (14)", value:14 }, { label:"Gold (19)", value:19 }],
//   "extra+strike+zone": [{ label:"Cerise (4)", value:4 }, { label:"All-Color (9)", value:9 }, { label:"Gold (14)", value:14 }, { label:"Gold (19)", value:19 }],
//   "split+strike+zone": [{ label:"Green (4)", value:4 }, { label:"All-Color (9)", value:9 }, { label:"Gold (14)", value:14 }, { label:"Gold (19)", value:19 }],
//   "extra+split+strike+zone":[{ label:"Green (4)", value:4 }, { label:"Blue (9)", value:9 }, { label:"Orange (14)", value:14 }, { label:"Cerise (19)", value:19 }],
// };

// export const COMBO_SCAT_SEED_COLOR: Record<string, Record<string, number>> = {
//   "extra+zone":         { green:4, blue:9, orange:14, cerise:19, all:4  },
//   "extra+split":        { green:4, blue:9, orange:14, cerise:19, all:19 },
//   "extra+strike":       { green:4, blue:9, orange:14, cerise:19, all:14 },
//   "split+zone":         { green:4, blue:9, orange:14, cerise:19, all:19 },
//   "split+strike":       { green:4, blue:9, orange:14, cerise:19, all:19 },
//   "strike+zone":        { green:4, blue:9, orange:14, cerise:19, all:14 },
//   "extra+split+zone":   { green:4, blue:9, orange:14, cerise:19, all:19 },
//   "extra+split+strike": { green:4, blue:9, orange:14, cerise:19, all:19 },
//   "extra+strike+zone":  { green:4, blue:9, orange:14, cerise:19, all:14 },
//   "split+strike+zone":  { green:4, blue:9, orange:14, cerise:19, all:19 },
//   "extra+split+strike+zone": { green:4, blue:9, orange:14, cerise:19, all:19 },
// };

// // ── Types ─────────────────────────────────────────────────────────────────────
// export type ComboCoin = {
//   position:          number;
//   colorCode:         number;
//   value:             string;
//   winged?:           boolean;
//   boostValue?:       string;
//   splitCount?:       number;
//   splitCopyValues?:  string[];   // per-copy value; [copyIdx]
//   splitBoostValues?: string[];   // strike+split extra copy boosts
//   upgraded?:         boolean;
//   upgradeFeatures?:  string[];
//   fromBase?:         boolean;
// };

// export type ComboFeatureConfig = {
//   features:      string[];
//   hasExtra:      boolean;
//   hasZone:       boolean;
//   hasStrike:     boolean;
//   hasSplit:      boolean;
//   splitter?:     number;
//   multipliers?:  number[];
// };

// // ── Helpers ───────────────────────────────────────────────────────────────────
// export function getComboKey(features: string[]): string {
//   return [...features].sort().join("+");
// }

// export function getComboCoinColors(features: string[]): CoinColorOption[] {
//   const key = getComboKey(features);
//   return COMBO_COIN_COLORS[key] ?? [
//     { label:"Green (4)", value:4 }, { label:"Blue (9)", value:9 },
//     { label:"Orange (14)", value:14 }, { label:"Cerise (19)", value:19 },
//   ];
// }

// export function getComboScatSeedColor(features: string[], scatKey: string): number {
//   const key = getComboKey(features);
//   return COMBO_SCAT_SEED_COLOR[key]?.[scatKey] ?? 4;
// }

// export function getComboMaxSpins(config: ComboFeatureConfig, upgradedFeatures: string[] = []): number {
//   return config.hasExtra || upgradedFeatures.includes("extra") ? 4 : 3;
// }

// // ── Output generator ──────────────────────────────────────────────────────────
// export function generateCombinationGaffe(
//   coins: ComboCoin[],
//   config: ComboFeatureConfig,
//   upgradedZoneSplitter?: number,
//   upgradedZoneMultipliers?: number[]
// ): string {
//   const allUpgraded = new Set(coins.flatMap((c) => (c.upgraded ? (c.upgradeFeatures ?? []) : [])));
//   const effStrike = config.hasStrike || allUpgraded.has("strike");
//   const effZone   = config.hasZone   || allUpgraded.has("zone");
//   const effSplit  = config.hasSplit  || allUpgraded.has("split");

//   const rsp = Array(15).fill(0);
//   coins.forEach((c) => { rsp[c.position] = c.colorCode; });

//   const sorted = [...coins].sort((a, b) => a.position - b.position);

//   // landedCoinsInBonusBoost — one entry per copy (0-based copyIdx)
//   const landedCoins: any[][] = [];
//   sorted.forEach((c) => {
//     const copies = effSplit ? (c.splitCount ?? 1) : 1;
//     for (let ci = 0; ci < copies; ci++) {
//       const val = c.splitCopyValues?.[ci] ?? c.value;
//       const entry: any[] = [c.position, c.colorCode, val];
//       if (effStrike && c.winged) entry.push("winged");
//       entry.push(ci);
//       landedCoins.push(entry);
//     }
//   });

//   // boostValues
//   const boostValues = Array(15).fill(0);
//   let hasBoost = false;
//   if (effStrike) {
//     coins.forEach((c) => {
//       if (c.winged && c.boostValue) {
//         const n = Number(c.boostValue);
//         boostValues[c.position] = isNaN(n) ? c.boostValue : n;
//         if (n !== 0) hasBoost = true;
//       }
//     });
//   }

//   // numberOfSplitCoins
//   const numSplit = Array(15).fill(0);
//   let hasSplitCoins = false;
//   if (effSplit) {
//     coins.forEach((c) => {
//       if ((c.splitCount ?? 1) > 1) { numSplit[c.position] = c.splitCount!; hasSplitCoins = true; }
//     });
//   }

//   // splitCoinsBoostValues
//   const splitBoostArrays: (number | string)[][] = [Array(15).fill(0), Array(15).fill(0), Array(15).fill(0)];
//   let hasSplitBoost = false;
//   if (effStrike && effSplit) {
//     coins.forEach((c) => {
//       if (c.winged && (c.splitCount ?? 1) > 1 && c.splitBoostValues) {
//         c.splitBoostValues.forEach((bv, idx) => {
//           if (bv !== undefined && bv !== "") {
//             const n = Number(bv);
//             splitBoostArrays[idx][c.position] = isNaN(n) ? bv : n;
//             if (n !== 0) hasSplitBoost = true;
//           }
//         });
//       }
//     });
//   }

//   // Zone
//   const effSplitter    = effZone ? (upgradedZoneSplitter    ?? config.splitter)    : undefined;
//   const effMultipliers = effZone ? (upgradedZoneMultipliers ?? config.multipliers) : undefined;

//   const additional = [...allUpgraded];

//   let out = `[reelStopPositions: [${rsp.join(",")}]`;
//   if (landedCoins.length > 0)
//     out += `,landedCoinsInBonusBoost: [${landedCoins.map((r) => `[${r.join(",")}]`).join(",")}]`;
//   if (hasBoost)
//     out += `,boostValues: [${boostValues.join(",")}]`;
//   if (hasSplitCoins)
//     out += `,numberOfSplitCoins: [${numSplit.join(",")}]`;
//   if (hasSplitBoost) {
//     const maxExtra = Math.max(...coins.filter((c) => c.winged && effSplit).map((c) => (c.splitCount ?? 1) - 1), 0);
//     out += `,splitCoinsBoostValues: [${splitBoostArrays.slice(0, maxExtra).map((a) => `[${a.join(",")}]`).join(",")}]`;
//   }
//   if (effZone && effSplitter)
//     out += `,zoneSplitter: ${effSplitter}`;
//   if (effZone && effMultipliers && effMultipliers.length > 0)
//     out += `,zoneMultipliers: [${effMultipliers.join(",")}]`;
//   if (additional.length > 0)
//     out += `,additionalFeatureTriggered: [${additional.join(",")}]`;
//   out += `]`;
//   return out;
// }





//! 1at ---------------------------------------------------------
// /* eslint-disable @typescript-eslint/no-explicit-any */

// export type CoinColorOption = { label: string; value: number };

// // ── All upgradeable features in this game ─────────────────────────────────────
// export const ALL_UPGRADE_FEATURES = ["STRIKE", "ZONE", "EXTRA", "SPLIT"];

// // ── Coin color tables ─────────────────────────────────────────────────────────
// export const COMBO_COIN_COLORS: Record<string, CoinColorOption[]> = {
//   "extra+zone":        [{ label:"Orange (4)", value:4 }, { label:"Cerise (9)", value:9 }, { label:"All-Color (14)", value:14 }, { label:"gold (19)", value:19 }],
//   "extra+split":       [{ label:"Green (4)", value:4 }, { label:"Blue (9)", value:9 }, { label:"Orange (14)", value:14 }, { label:"Cerise (19)", value:19 }],
//   "extra+strike":      [{ label:"Blue (4)", value:4 }, { label:"Cerise (9)", value:9 }, { label:"All-Color (14)", value:14 }, { label:"gold (19)", value:19 }],
//   "split+zone":        [{ label:"Orange (4)", value:4 }, { label:"Blue (9)", value:9 }, { label:"All-Color (14)", value:14 }, { label:"gold (19)", value:19 }],
//   "split+strike":      [{ label:"Blue (4)", value:4 }, { label:"Green (9)", value:9 }, { label:"All-Color (14)", value:14 }, { label:"gold (19)", value:19 }],
//   "split+extra":       [{ label:"Orange (4)", value:4 }, { label:"Blue (9)", value:9 }, { label:"All-Color (14)", value:14 }, { label:"gold (19)", value:19 }],
//   "strike+zone":       [{ label:"Cerise (4)", value:4 }, { label:"Green (9)", value:9 }, { label:"All-Color (14)", value:14 }, { label:"gold (19)", value:19 }],
//   "extra+split+zone":  [{ label:"Orange (4)", value:4 }, { label:"All-Color (9)", value:9 }, { label:"gold (14)", value:14 }, { label:"gold (19)", value:19 }],
//   "extra+split+strike":[{ label:"Blue (4)", value:4 }, { label:"All-Color (9)", value:9 }, { label:"gold (14)", value:14 }, { label:"gold (19)", value:19 }],
//   "extra+strike+zone": [{ label:"Cerise (4)", value:4 }, { label:"All-Color (9)", value:9 }, { label:"gold (14)", value:14 }, { label:"gold (19)", value:19 }],
//   "split+strike+zone": [{ label:"Green (4)", value:4 }, { label:"All-Color (9)", value:9 }, { label:"gold (14)", value:14 }, { label:"gold (19)", value:19 }],
//   "extra+split+strike+zone":[{ label:"Green (4)", value:4 }, { label:"Blue (9)", value:9 }, { label:"Orange (14)", value:14 }, { label:"Cerise (19)", value:19 }],
// };

// export const COMBO_SCAT_SEED_COLOR: Record<string, Record<string, number>> = {
//   "extra+zone":         { green:4, blue:9, orange:14, cerise:19, all:4  },
//   "extra+split":        { green:4, blue:9, orange:14, cerise:19, all:19 },
//   "extra+strike":       { green:4, blue:9, orange:14, cerise:19, all:14 },
//   "split+zone":         { green:4, blue:9, orange:14, cerise:19, all:19 },
//   "split+strike":       { green:4, blue:9, orange:14, cerise:19, all:19 },
//   "strike+zone":        { green:4, blue:9, orange:14, cerise:19, all:14 },
//   "extra+split+zone":   { green:4, blue:9, orange:14, cerise:19, all:19 },
//   "extra+split+strike": { green:4, blue:9, orange:14, cerise:19, all:19 },
//   "extra+strike+zone":  { green:4, blue:9, orange:14, cerise:19, all:14 },
//   "split+strike+zone":  { green:4, blue:9, orange:14, cerise:19, all:19 },
//   "extra+split+strike+zone": { green:4, blue:9, orange:14, cerise:19, all:19 },
// };

// // ── Types ─────────────────────────────────────────────────────────────────────
// export type ComboCoin = {
//   position:          number;
//   colorCode:         number;
//   value:             string;
//   winged?:           boolean;
//   boostValue?:       string;
//   splitCount?:       number;
//   splitCopyValues?:  string[];   // per-copy value; [copyIndex] (0-based)
//   splitBoostValues?: string[];   // strike+split: boosts for extra copies (index 0 = copy 1, etc.)
//   fromBase?:         boolean;
// };

// export type ComboFeatureConfig = {
//   features:      string[];
//   hasExtra:      boolean;
//   hasZone:       boolean;
//   hasStrike:     boolean;
//   hasSplit:      boolean;
//   splitter?:     number;
//   multipliers?:  number[];
// };

// export type UpgradeInfo = {
//   col:              number;
//   row:              number;
//   features:         string[];   // e.g. ["ZONE"] or ["STRIKE", "EXTRA"]
//   zoneSplitter?:    number;
//   zoneMultipliers?: number[];
// };

// // ── resolveUpgradeFeatures ────────────────────────────────────────────────────
// // Given a coin color label from the Ignite Purple palette, returns the
// // UPPERCASE feature name(s) that coin can upgrade to.
// // Returns [] for gold (no upgrade).
// // Caller handles all-color coins separately (isAllColor check).
// const LABEL_KEYWORD_MAP: Record<string, string> = {
//   orange: "STRIKE",
//   blue:   "ZONE",
//   green:  "EXTRA",
//   cerise: "SPLIT",
// };

// export function resolveUpgradeFeatures(colorLabel: string): string[] {
//   const l = colorLabel.toLowerCase();
//   if (l.includes("gold"))                                      return [];
//   if (l.includes("all-color") || l.includes("all color"))     return []; // handled via isAllColor
//   for (const [key, feat] of Object.entries(LABEL_KEYWORD_MAP)) {
//     if (l.includes(key)) return [feat];
//   }
//   return [];
// }

// // ── Helpers ───────────────────────────────────────────────────────────────────
// export function getComboKey(features: string[]): string {
//   return [...features].sort().join("+");
// }

// export function getComboCoinColors(features: string[]): CoinColorOption[] {
//   const key = getComboKey(features);
//   return COMBO_COIN_COLORS[key] ?? [
//     { label:"Green (4)", value:4 }, { label:"Blue (9)", value:9 },
//     { label:"Orange (14)", value:14 }, { label:"Cerise (19)", value:19 },
//   ];
// }

// export function getComboScatSeedColor(features: string[], scatKey: string): number {
//   const key = getComboKey(features);
//   return COMBO_SCAT_SEED_COLOR[key]?.[scatKey] ?? 4;
// }

// export function getComboMaxSpins(config: ComboFeatureConfig): number {
//   return config.hasExtra ? 4 : 3;
// }

// // ── Output generator ──────────────────────────────────────────────────────────
// export function generateCombinationGaffe(
//   coins: ComboCoin[],
//   config: ComboFeatureConfig,
//   upgrade: UpgradeInfo | null = null
// ): string {
//   const { hasStrike, hasZone, hasSplit, splitter, multipliers } = config;

//   const rsp = Array(15).fill(0);
//   coins.forEach((c) => { rsp[c.position] = c.colorCode; });

//   const sorted = [...coins].sort((a, b) => a.position - b.position);

//   // One entry per copy: [pos, colorCode, copyValue, "winged"(if strike+winged), copyIndex]
//   const landedCoins: any[][] = [];
//   sorted.forEach((c) => {
//     const copies = hasSplit ? (c.splitCount ?? 1) : 1;
//     for (let ci = 0; ci < copies; ci++) {
//       const val = c.splitCopyValues?.[ci] ?? c.value;
//       const entry: any[] = [c.position, c.colorCode, val];
//       if (hasStrike && c.winged) entry.push("winged");
//       entry.push(ci);
//       landedCoins.push(entry);
//     }
//   });

//   const boostValues = Array(15).fill(0);
//   let hasBoost = false;
//   if (hasStrike) {
//     coins.forEach((c) => {
//       if (c.winged && c.boostValue !== undefined && c.boostValue !== "") {
//         const n = Number(c.boostValue);
//         boostValues[c.position] = isNaN(n) ? c.boostValue : n;
//         if (n !== 0) hasBoost = true;
//       }
//     });
//   }

//   const numSplit = Array(15).fill(0);
//   let hasSplitCoins = false;
//   if (hasSplit) {
//     coins.forEach((c) => {
//       if (c.splitCount && c.splitCount > 1) {
//         numSplit[c.position] = c.splitCount; hasSplitCoins = true;
//       }
//     });
//   }

//   const splitBoostArrays: (number | string)[][] = [
//     Array(15).fill(0), Array(15).fill(0), Array(15).fill(0),
//   ];
//   let hasSplitBoost = false;
//   if (hasStrike && hasSplit) {
//     coins.forEach((c) => {
//       if (c.winged && c.splitCount && c.splitCount > 1 && c.splitBoostValues) {
//         c.splitBoostValues.forEach((bv, idx) => {
//           if (bv !== undefined && bv !== "") {
//             const n = Number(bv);
//             splitBoostArrays[idx][c.position] = isNaN(n) ? bv : n;
//             if (n !== 0) hasSplitBoost = true;
//           }
//         });
//       }
//     });
//   }

//   const effSplitter    = upgrade?.zoneSplitter    ?? splitter;
//   const effMultipliers = upgrade?.zoneMultipliers ?? multipliers;

//   let out = `[reelStopPositions: [${rsp.join(",")}]`;
//   if (landedCoins.length > 0)
//     out += `,landedCoinsInBonusBoost: [${landedCoins.map((r: any[]) => `[${r.join(",")}]`).join(",")}]`;
//   if (hasBoost)
//     out += `,boostValues: [${boostValues.join(",")}]`;
//   if (hasSplitCoins)
//     out += `,numberOfSplitCoins: [${numSplit.join(",")}]`;
//   if (hasSplitBoost) {
//     const maxExtra = Math.max(...coins.filter((c) => c.winged && hasSplit).map((c) => (c.splitCount ?? 1) - 1), 0);
//     out += `,splitCoinsBoostValues: [${splitBoostArrays.slice(0, maxExtra).map((a) => `[${a.join(",")}]`).join(",")}]`;
//   }
//   if (hasZone && effSplitter)
//     out += `,zoneSplitter: ${effSplitter}`;
//   if (hasZone && effMultipliers && effMultipliers.length > 0)
//     out += `,zoneMultipliers: [${effMultipliers.join(",")}]`;
//   if (upgrade) {
//     out += `,upgradeCoinPosition: [${upgrade.col},${upgrade.row}]`;
//     if (upgrade.features.length > 0)
//       out += `,additionalFeatureTriggered: [${upgrade.features.map((f) => f.toLowerCase()).join(",")}]`;
//     if (upgrade.zoneSplitter)
//       out += `,upgradeZoneSplitter: ${upgrade.zoneSplitter}`;
//     if (upgrade.zoneMultipliers && upgrade.zoneMultipliers.length > 0)
//       out += `,upgradeZoneMultipliers: [${upgrade.zoneMultipliers.join(",")}]`;
//   }
//   out += `]`;
//   return out;
// }


// /* eslint-disable @typescript-eslint/no-explicit-any */

// export type CoinColorOption = { label: string; value: number };

// // !! Update values per combination  !!
// export const COMBO_COIN_COLORS: Record<string, CoinColorOption[]> = {
//   "extra+zone":        [{ label:"Orange (4)", value:4 }, { label:"Cerise (9)", value:9 }, { label:"All-Color (14)", value:14 }, { label:"gold (19)", value:19 }],
//   "extra+split":       [{ label:"Green (4)", value:4 }, { label:"Blue (9)", value:9 }, { label:"Orange (14)", value:14 }, { label:"Cerise (19)", value:19 }],
//   "extra+strike":      [{ label:"Blue (4)", value:4 }, { label:"Cerise (9)", value:9 }, { label:"All-Color (14)", value:14 }, { label:"gold (19)", value:19 }],
//   "split+zone":        [{ label:"Orange (4)", value:4 }, { label:"Blue (9)", value:9 }, { label:"All-Color (14)", value:14 }, { label:"gold (19)", value:19 }],
//   "split+strike":      [{ label:"Blue (4)", value:4 }, { label:"Green (9)", value:9 }, { label:"All-Color (14)", value:14 }, { label:"gold (19)", value:19 }],
//   "split+extra":      [{ label:"Orange (4)", value:4 }, { label:"Blue (9)", value:9 }, { label:"All-Color (14)", value:14 }, { label:"gold (19)", value:19 }],
//   "strike+zone":       [{ label:"Cerise (4)", value:4 }, { label:"Green (9)", value:9 }, { label:"All-Color (14)", value:14 }, { label:"gold (19)", value:19 }],
//   "extra+split+zone":  [{ label:"Orange (4)", value:4 }, { label:"All-Color (9)", value:9 }, { label:"gold (14)", value:14 }, { label:"gold (19)", value:19 }],
//   "extra+split+strike":[{ label:"Blue (4)", value:4 }, { label:"All-Color (9)", value:9 }, { label:"gold (14)", value:14 }, { label:"gold (19)", value:19 }],
//   "extra+strike+zone": [{ label:"Cerise (4)", value:4 }, { label:"All-Color (9)", value:9 }, { label:"gold (14)", value:14 }, { label:"gold (19)", value:19 }],
//   "split+strike+zone": [{ label:"Green (4)", value:4 }, { label:"All-Color (9)", value:9 }, { label:"gold (14)", value:14 }, { label:"gold (19)", value:19 }],
//   "extra+split+strike+zone":[{ label:"Green (4)", value:4 }, { label:"Blue (9)", value:9 }, { label:"Orange (14)", value:14 }, { label:"Cerise (19)", value:19 }],
// };


// // colorCode when a scat seeds into a specific combination
// export const COMBO_SCAT_SEED_COLOR: Record<string, Record<string, number>> = {
//   "extra+zone":         { green:4, blue:9, orange:14, cerise:19, all:4  },
//   "extra+split":        { green:4, blue:9, orange:14, cerise:19, all:19 },
//   "extra+strike":       { green:4, blue:9, orange:14, cerise:19, all:14 },
//   "split+zone":         { green:4, blue:9, orange:14, cerise:19, all:19 },
//   "split+strike":       { green:4, blue:9, orange:14, cerise:19, all:19 },
//   "strike+zone":        { green:4, blue:9, orange:14, cerise:19, all:14 },
//   "extra+split+zone":   { green:4, blue:9, orange:14, cerise:19, all:19 },
//   "extra+split+strike": { green:4, blue:9, orange:14, cerise:19, all:19 },
//   "extra+strike+zone":  { green:4, blue:9, orange:14, cerise:19, all:14 },
//   "split+strike+zone":  { green:4, blue:9, orange:14, cerise:19, all:19 },
//   "extra+split+strike+zone": { green:4, blue:9, orange:14, cerise:19, all:19 },
// };

// // ── TYPES ─────────────────────────────────────────────────────────────────────

// export type ComboCoin = {
//   position:         number;    // 0–14, column-major
//   colorCode:        number;
//   value:            string;
//   winged?:          boolean;   // strike
//   boostValue?:      string;    // strike: boost for coin 1 (or the only coin)
//   splitCount?:      number;    // split: 1–4
//   splitBoostValues?: string[]; // split+strike: boosts for split coins 2/3/4 [idx0=coin2, ...]
//   fromBase?:        boolean;
// };

// export type ComboFeatureConfig = {
//   features:      string[];
//   hasExtra:      boolean;
//   hasZone:       boolean;
//   hasStrike:     boolean;
//   hasSplit:      boolean;
//   splitter?:     number;
//   multipliers?:  number[];
// };

// // ── HELPERS ───────────────────────────────────────────────────────────────────

// export function getComboKey(features: string[]): string {
//   return [...features].sort().join("+");
// }

// export function getComboCoinColors(features: string[]): CoinColorOption[] {
//   const key = getComboKey(features);
//   return COMBO_COIN_COLORS[key] ?? [
//     { label:"Green (4)", value:4 }, { label:"Blue (9)", value:9 },
//     { label:"Orange (14)", value:14 }, { label:"Cerise (19)", value:19 },
//   ];
// }

// export function getComboScatSeedColor(features: string[], scatKey: string): number {
//   const key = getComboKey(features);
//   return COMBO_SCAT_SEED_COLOR[key]?.[scatKey] ?? 4;
// }

// /** 4 spins if Extra is in combo, else 3 */
// export function getComboMaxSpins(config: ComboFeatureConfig): number {
//   return config.hasExtra ? 4 : 3;
// }

// // ── OUTPUT GENERATOR ─────────────────────────────────────────────────────────

// export function generateCombinationGaffe(coins: ComboCoin[], config: ComboFeatureConfig): string {
//   const { hasStrike, hasZone, hasSplit, splitter, multipliers } = config;

//   // reelStopPositions
//   const rsp = Array(15).fill(0);
//   coins.forEach((c) => { rsp[c.position] = c.colorCode; });

//   const sorted = [...coins].sort((a, b) => a.position - b.position);

//   // landedCoinsInBonusBoost
//   // [pos, colorCode, value, "winged"?, splitCount?]
//   const landedCoins = sorted.map((c) => {
//     const row: any[] = [c.position, c.colorCode, c.value];
//     if (hasStrike && c.winged)             row.push("winged");
//     if (hasSplit && c.splitCount && c.splitCount > 1) row.push(c.splitCount);
//     return row;
//   });

//   // boostValues — coin 1 boosts for winged coins
//   const boostValues = Array(15).fill(0);
//   let hasBoost = false;
//   if (hasStrike) {
//     coins.forEach((c) => {
//       if (c.winged && c.boostValue !== undefined && c.boostValue !== "") {
//         const n = Number(c.boostValue);
//         boostValues[c.position] = isNaN(n) ? c.boostValue : n;
//         if (n !== 0) hasBoost = true;
//       }
//     });
//   }

//   // numberOfSplitCoins
//   const numberOfSplitCoins = Array(15).fill(0);
//   let hasSplitCoins = false;
//   if (hasSplit) {
//     coins.forEach((c) => {
//       if (c.splitCount && c.splitCount > 1) {
//         numberOfSplitCoins[c.position] = c.splitCount;
//         hasSplitCoins = true;
//       }
//     });
//   }

//   // splitCoinsBoostValues — [array for coin2, array for coin3, array for coin4]
//   // Only for strike+split combos; arrays at positions of split coins
//   const splitBoostArrays: (number | string)[][] = [
//     Array(15).fill(0), Array(15).fill(0), Array(15).fill(0),
//   ];
//   let hasSplitBoost = false;
//   if (hasStrike && hasSplit) {
//     coins.forEach((c) => {
//       if (c.winged && c.splitCount && c.splitCount > 1 && c.splitBoostValues) {
//         c.splitBoostValues.forEach((bv, idx) => {
//           if (bv !== undefined && bv !== "") {
//             const n = Number(bv);
//             splitBoostArrays[idx][c.position] = isNaN(n) ? bv : n;
//             if (n !== 0) hasSplitBoost = true;
//           }
//         });
//       }
//     });
//   }

//   let out = `[reelStopPositions: [${rsp.join(",")}]`;

//   if (landedCoins.length > 0)
//     out += `,landedCoinsInBonusBoost: [${landedCoins.map((r: any[]) => `[${r.join(",")}]`).join(",")}]`;

//   if (hasBoost)
//     out += `,boostValues: [${boostValues.join(",")}]`;

//   if (hasSplitCoins)
//     out += `,numberOfSplitCoins: [${numberOfSplitCoins.join(",")}]`;

//   if (hasSplitBoost) {
//     const maxExtra = Math.max(...coins.filter((c) => c.winged && hasSplit).map((c) => (c.splitCount ?? 1) - 1), 0);
//     out += `,splitCoinsBoostValues: [${splitBoostArrays.slice(0, maxExtra).map((a) => `[${a.join(",")}]`).join(",")}]`;
//   }

//   // if (hasZone && splitter)                             out += `, zoneSplitter: ${splitter}`;
//   // if (hasZone && multipliers && multipliers.length > 0) out += `, zoneMultipliers: [${multipliers.join(",")}]`;

//   out += `]`;
//   return out;
// }



//! latest working code
/* eslint-disable @typescript-eslint/no-explicit-any */

// export type CoinColorOption = { label: string; value: number };

// // ── UPGRADE MAP ───────────────────────────────────────────────────────────────
// // Maps a coin's label keyword → which feature it can upgrade to.
// // "gold" coins cannot upgrade. "All-Color" can upgrade to any feature.
// // These are the single-color → feature mappings (case-insensitive label check).
// export const COLOR_TO_FEATURE: Record<string, string> = {
//   orange: "strike",
//   blue:   "zone",
//   green:  "extra",
//   cerise: "split",
//   pink:   "split",
// };
// // "All-Color" → can upgrade to any of the 4 features (user picks subset)
// export const ALL_COLOR_FEATURES = ["strike", "zone", "extra", "split"];

// /** Given a coin color label (e.g. "Orange (4)"), return the upgradeable feature or null */
// export function getUpgradeFeature(label: string): string | null {
//   const lower = label.toLowerCase();
//   if (lower.includes("gold"))      return null; // no upgrade
//   if (lower.includes("all-color") || lower.includes("all color")) return "all";
//   for (const [key, feat] of Object.entries(COLOR_TO_FEATURE)) {
//     if (lower.includes(key)) return feat;
//   }
//   return null;
// }

// // ─────────────────────────────────────────────────────────────────────────────
// export const COMBO_COIN_COLORS: Record<string, CoinColorOption[]> = {
//   "extra+zone":        [{ label:"Orange (4)", value:4 }, { label:"Cerise (9)", value:9 }, { label:"All-Color (14)", value:14 }, { label:"Gold (19)", value:19 }],
//   "extra+split":       [{ label:"Green (4)", value:4 }, { label:"Blue (9)", value:9 }, { label:"Orange (14)", value:14 }, { label:"Cerise (19)", value:19 }],
//   "extra+strike":      [{ label:"Blue (4)", value:4 }, { label:"Cerise (9)", value:9 }, { label:"All-Color (14)", value:14 }, { label:"Gold (19)", value:19 }],
//   "split+zone":        [{ label:"Orange (4)", value:4 }, { label:"Blue (9)", value:9 }, { label:"All-Color (14)", value:14 }, { label:"Gold (19)", value:19 }],
//   "split+strike":      [{ label:"Blue (4)", value:4 }, { label:"Green (9)", value:9 }, { label:"All-Color (14)", value:14 }, { label:"Gold (19)", value:19 }],
//   "split+extra":       [{ label:"Orange (4)", value:4 }, { label:"Blue (9)", value:9 }, { label:"All-Color (14)", value:14 }, { label:"Gold (19)", value:19 }],
//   "strike+zone":       [{ label:"Cerise (4)", value:4 }, { label:"Green (9)", value:9 }, { label:"All-Color (14)", value:14 }, { label:"Gold (19)", value:19 }],
//   "extra+split+zone":  [{ label:"Orange (4)", value:4 }, { label:"All-Color (9)", value:9 }, { label:"Gold (14)", value:14 }, { label:"Gold (19)", value:19 }],
//   "extra+split+strike":[{ label:"Blue (4)", value:4 }, { label:"All-Color (9)", value:9 }, { label:"Gold (14)", value:14 }, { label:"Gold (19)", value:19 }],
//   "extra+strike+zone": [{ label:"Cerise (4)", value:4 }, { label:"All-Color (9)", value:9 }, { label:"Gold (14)", value:14 }, { label:"Gold (19)", value:19 }],
//   "split+strike+zone": [{ label:"Green (4)", value:4 }, { label:"All-Color (9)", value:9 }, { label:"Gold (14)", value:14 }, { label:"Gold (19)", value:19 }],
//   "extra+split+strike+zone":[{ label:"Green (4)", value:4 }, { label:"Blue (9)", value:9 }, { label:"Orange (14)", value:14 }, { label:"Cerise (19)", value:19 }],
// };

// export const COMBO_SCAT_SEED_COLOR: Record<string, Record<string, number>> = {
//   "extra+zone":         { green:4, blue:9, orange:14, cerise:19, all:4  },
//   "extra+split":        { green:4, blue:9, orange:14, cerise:19, all:19 },
//   "extra+strike":       { green:4, blue:9, orange:14, cerise:19, all:14 },
//   "split+zone":         { green:4, blue:9, orange:14, cerise:19, all:19 },
//   "split+strike":       { green:4, blue:9, orange:14, cerise:19, all:19 },
//   "strike+zone":        { green:4, blue:9, orange:14, cerise:19, all:14 },
//   "extra+split+zone":   { green:4, blue:9, orange:14, cerise:19, all:19 },
//   "extra+split+strike": { green:4, blue:9, orange:14, cerise:19, all:19 },
//   "extra+strike+zone":  { green:4, blue:9, orange:14, cerise:19, all:14 },
//   "split+strike+zone":  { green:4, blue:9, orange:14, cerise:19, all:19 },
//   "extra+split+strike+zone": { green:4, blue:9, orange:14, cerise:19, all:19 },
// };

// // ── TYPES ─────────────────────────────────────────────────────────────────────
// export type ComboCoin = {
//   position:          number;
//   colorCode:         number;
//   value:             string;
//   winged?:           boolean;
//   boostValue?:       string;
//   splitCount?:       number;
//   splitCopyValues?:  string[];   // per-copy value overrides (index = copyIdx)
//   splitBoostValues?: string[];
//   upgraded?:         boolean;        // true = this coin triggered an upgrade
//   upgradeFeatures?:  string[];       // which features were upgraded (for all-color coins)
//   fromBase?:         boolean;
// };

// export type ComboFeatureConfig = {
//   features:      string[];
//   hasExtra:      boolean;
//   hasZone:       boolean;
//   hasStrike:     boolean;
//   hasSplit:      boolean;
//   splitter?:     number;
//   multipliers?:  number[];
// };

// // ── HELPERS ───────────────────────────────────────────────────────────────────
// export function getComboKey(features: string[]): string {
//   return [...features].sort().join("+");
// }

// export function getComboCoinColors(features: string[]): CoinColorOption[] {
//   const key = getComboKey(features);
//   return COMBO_COIN_COLORS[key] ?? [
//     { label:"Green (4)", value:4 }, { label:"Blue (9)", value:9 },
//     { label:"Orange (14)", value:14 }, { label:"Cerise (19)", value:19 },
//   ];
// }

// export function getComboScatSeedColor(features: string[], scatKey: string): number {
//   const key = getComboKey(features);
//   return COMBO_SCAT_SEED_COLOR[key]?.[scatKey] ?? 4;
// }

// export function getComboMaxSpins(config: ComboFeatureConfig): number {
//   return config.hasExtra ? 4 : 3;
// }

// // ── OUTPUT GENERATOR ─────────────────────────────────────────────────────────
// export function generateCombinationGaffe(
//   coins: ComboCoin[],
//   config: ComboFeatureConfig,
//   coinColorOptions: CoinColorOption[]
// ): string {
//   const { hasStrike, hasZone, hasSplit, splitter, multipliers } = config;

//   const rsp = Array(15).fill(0);
//   coins.forEach((c) => { rsp[c.position] = c.colorCode; });

//   const sorted = [...coins].sort((a, b) => a.position - b.position);

//   // landedCoinsInBonusBoost — one entry per copy (like SplitFeature)
//   const landedCoins: any[][] = [];
//   sorted.forEach((c) => {
//     const totalCopies = hasSplit ? (c.splitCount ?? 1) : 1;
//     for (let copyIdx = 0; copyIdx < totalCopies; copyIdx++) {
//       const val = c.splitCopyValues?.[copyIdx] ?? c.value;
//       const entry: any[] = [c.position, c.colorCode, val];
//       if (hasStrike && c.winged) entry.push("winged");
//       entry.push(copyIdx); // 0-based copy index always present
//       landedCoins.push(entry);
//     }
//   });

//   // boostValues
//   const boostValues = Array(15).fill(0);
//   let hasBoost = false;
//   if (hasStrike) {
//     coins.forEach((c) => {
//       if (c.winged && c.boostValue !== undefined && c.boostValue !== "") {
//         const n = Number(c.boostValue);
//         boostValues[c.position] = isNaN(n) ? c.boostValue : n;
//         if (n !== 0) hasBoost = true;
//       }
//     });
//   }

//   // numberOfSplitCoins
//   const numberOfSplitCoins = Array(15).fill(0);
//   let hasSplitCoins = false;
//   if (hasSplit) {
//     coins.forEach((c) => {
//       if ((c.splitCount ?? 1) > 1) {
//         numberOfSplitCoins[c.position] = c.splitCount!;
//         hasSplitCoins = true;
//       }
//     });
//   }

//   // splitCoinsBoostValues
//   const splitBoostArrays: (number | string)[][] = [Array(15).fill(0), Array(15).fill(0), Array(15).fill(0)];
//   let hasSplitBoost = false;
//   if (hasStrike && hasSplit) {
//     coins.forEach((c) => {
//       if (c.winged && (c.splitCount ?? 1) > 1 && c.splitBoostValues) {
//         c.splitBoostValues.forEach((bv, idx) => {
//           if (bv !== undefined && bv !== "") {
//             const n = Number(bv);
//             splitBoostArrays[idx][c.position] = isNaN(n) ? bv : n;
//             if (n !== 0) hasSplitBoost = true;
//           }
//         });
//       }
//     });
//   }

//   // additionalFeatureTriggered — collect all upgrade features across all upgraded coins
//   const additionalFeatures = new Set<string>();
//   coins.forEach((c) => {
//     if (!c.upgraded) return;
//     const label = coinColorOptions.find((o) => o.value === c.colorCode)?.label ?? "";
//     const upgradeType = getUpgradeFeature(label);
//     if (upgradeType === "all") {
//       (c.upgradeFeatures ?? []).forEach((f) => additionalFeatures.add(f));
//     } else if (upgradeType) {
//       additionalFeatures.add(upgradeType);
//     }
//   });

//   let out = `[reelStopPositions: [${rsp.join(",")}]`;

//   if (landedCoins.length > 0)
//     out += `,landedCoinsInBonusBoost: [${landedCoins.map((r) => `[${r.join(",")}]`).join(",")}]`;

//   if (hasBoost)
//     out += `,boostValues: [${boostValues.join(",")}]`;

//   if (hasSplitCoins)
//     out += `,numberOfSplitCoins: [${numberOfSplitCoins.join(",")}]`;

//   if (hasSplitBoost) {
//     const maxExtra = Math.max(...coins.filter((c) => c.winged && hasSplit).map((c) => (c.splitCount ?? 1) - 1), 0);
//     out += `,splitCoinsBoostValues: [${splitBoostArrays.slice(0, maxExtra).map((a) => `[${a.join(",")}]`).join(",")}]`;
//   }

//   if (hasZone && splitter)                              out += `,zoneSplitter: ${splitter}`;
//   if (hasZone && multipliers && multipliers.length > 0) out += `,zoneMultipliers: [${multipliers.join(",")}]`;

//   if (additionalFeatures.size > 0)
//     out += `,additionalFeatureTriggered: [${[...additionalFeatures].join(",")}]`;

//   out += `]`;
//   return out;
// }


//! working
/* eslint-disable @typescript-eslint/no-explicit-any */

// export type CoinColorOption = { label: string; value: number };

// // ── Upgrade helpers ───────────────────────────────────────────────────────────
// export const COLOR_UPGRADE_MAP: Record<string, string> = {
//   orange: "strike",
//   blue:   "zone",
//   green:  "extra",
//   cerise: "split",
//   pink:   "split",
// };
// export const ALL_COLOR_UPGRADE_FEATURES = ["strike", "zone", "extra", "split"];

// /**
//  * Returns:
//  *   "gold"    → no upgrade
//  *   "all"     → all-color; user picks subset
//  *   "strike" | "zone" | "extra" | "split" → single upgrade target
//  *   null      → unknown / no upgrade
//  */
// export function getUpgradeType(label: string): string | null {
//   const l = label.toLowerCase();
//   if (l.includes("gold"))                                      return "gold";
//   if (l.includes("all-color") || l.includes("all color"))     return "all";
//   for (const [key, feat] of Object.entries(COLOR_UPGRADE_MAP)) {
//     if (l.includes(key)) return feat;
//   }
//   return null;
// }

// // ── Coin color tables ─────────────────────────────────────────────────────────
// export const COMBO_COIN_COLORS: Record<string, CoinColorOption[]> = {
//   "extra+zone":        [{ label:"Orange (4)", value:4 }, { label:"Cerise (9)", value:9 }, { label:"All-Color (14)", value:14 }, { label:"Gold (19)", value:19 }],
//   "extra+split":       [{ label:"Green (4)", value:4 }, { label:"Blue (9)", value:9 }, { label:"Orange (14)", value:14 }, { label:"Cerise (19)", value:19 }],
//   "extra+strike":      [{ label:"Blue (4)", value:4 }, { label:"Cerise (9)", value:9 }, { label:"All-Color (14)", value:14 }, { label:"Gold (19)", value:19 }],
//   "split+zone":        [{ label:"Orange (4)", value:4 }, { label:"Blue (9)", value:9 }, { label:"All-Color (14)", value:14 }, { label:"Gold (19)", value:19 }],
//   "split+strike":      [{ label:"Blue (4)", value:4 }, { label:"Green (9)", value:9 }, { label:"All-Color (14)", value:14 }, { label:"Gold (19)", value:19 }],
//   "split+extra":       [{ label:"Orange (4)", value:4 }, { label:"Blue (9)", value:9 }, { label:"All-Color (14)", value:14 }, { label:"Gold (19)", value:19 }],
//   "strike+zone":       [{ label:"Cerise (4)", value:4 }, { label:"Green (9)", value:9 }, { label:"All-Color (14)", value:14 }, { label:"Gold (19)", value:19 }],
//   "extra+split+zone":  [{ label:"Orange (4)", value:4 }, { label:"All-Color (9)", value:9 }, { label:"Gold (14)", value:14 }, { label:"Gold (19)", value:19 }],
//   "extra+split+strike":[{ label:"Blue (4)", value:4 }, { label:"All-Color (9)", value:9 }, { label:"Gold (14)", value:14 }, { label:"Gold (19)", value:19 }],
//   "extra+strike+zone": [{ label:"Cerise (4)", value:4 }, { label:"All-Color (9)", value:9 }, { label:"Gold (14)", value:14 }, { label:"Gold (19)", value:19 }],
//   "split+strike+zone": [{ label:"Green (4)", value:4 }, { label:"All-Color (9)", value:9 }, { label:"Gold (14)", value:14 }, { label:"Gold (19)", value:19 }],
//   "extra+split+strike+zone":[{ label:"Green (4)", value:4 }, { label:"Blue (9)", value:9 }, { label:"Orange (14)", value:14 }, { label:"Cerise (19)", value:19 }],
// };

// export const COMBO_SCAT_SEED_COLOR: Record<string, Record<string, number>> = {
//   "extra+zone":         { green:4, blue:9, orange:14, cerise:19, all:4  },
//   "extra+split":        { green:4, blue:9, orange:14, cerise:19, all:19 },
//   "extra+strike":       { green:4, blue:9, orange:14, cerise:19, all:14 },
//   "split+zone":         { green:4, blue:9, orange:14, cerise:19, all:19 },
//   "split+strike":       { green:4, blue:9, orange:14, cerise:19, all:19 },
//   "strike+zone":        { green:4, blue:9, orange:14, cerise:19, all:14 },
//   "extra+split+zone":   { green:4, blue:9, orange:14, cerise:19, all:19 },
//   "extra+split+strike": { green:4, blue:9, orange:14, cerise:19, all:19 },
//   "extra+strike+zone":  { green:4, blue:9, orange:14, cerise:19, all:14 },
//   "split+strike+zone":  { green:4, blue:9, orange:14, cerise:19, all:19 },
//   "extra+split+strike+zone": { green:4, blue:9, orange:14, cerise:19, all:19 },
// };

// // ── Types ─────────────────────────────────────────────────────────────────────
// export type ComboCoin = {
//   position:          number;
//   colorCode:         number;
//   value:             string;
//   winged?:           boolean;
//   boostValue?:       string;
//   splitCount?:       number;
//   splitCopyValues?:  string[];   // per-copy value; [copyIdx]
//   splitBoostValues?: string[];   // strike+split extra copy boosts
//   upgraded?:         boolean;
//   upgradeFeatures?:  string[];
//   fromBase?:         boolean;
// };

// export type ComboFeatureConfig = {
//   features:      string[];
//   hasExtra:      boolean;
//   hasZone:       boolean;
//   hasStrike:     boolean;
//   hasSplit:      boolean;
//   splitter?:     number;
//   multipliers?:  number[];
// };

// // ── Helpers ───────────────────────────────────────────────────────────────────
// export function getComboKey(features: string[]): string {
//   return [...features].sort().join("+");
// }

// export function getComboCoinColors(features: string[]): CoinColorOption[] {
//   const key = getComboKey(features);
//   return COMBO_COIN_COLORS[key] ?? [
//     { label:"Green (4)", value:4 }, { label:"Blue (9)", value:9 },
//     { label:"Orange (14)", value:14 }, { label:"Cerise (19)", value:19 },
//   ];
// }

// export function getComboScatSeedColor(features: string[], scatKey: string): number {
//   const key = getComboKey(features);
//   return COMBO_SCAT_SEED_COLOR[key]?.[scatKey] ?? 4;
// }

// export function getComboMaxSpins(config: ComboFeatureConfig, upgradedFeatures: string[] = []): number {
//   return config.hasExtra || upgradedFeatures.includes("extra") ? 4 : 3;
// }

// // ── Output generator ──────────────────────────────────────────────────────────
// export function generateCombinationGaffe(
//   coins: ComboCoin[],
//   config: ComboFeatureConfig,
//   upgradedZoneSplitter?: number,
//   upgradedZoneMultipliers?: number[]
// ): string {
//   const allUpgraded = new Set(coins.flatMap((c) => (c.upgraded ? (c.upgradeFeatures ?? []) : [])));
//   const effStrike = config.hasStrike || allUpgraded.has("strike");
//   const effZone   = config.hasZone   || allUpgraded.has("zone");
//   const effSplit  = config.hasSplit  || allUpgraded.has("split");

//   const rsp = Array(15).fill(0);
//   coins.forEach((c) => { rsp[c.position] = c.colorCode; });

//   const sorted = [...coins].sort((a, b) => a.position - b.position);

//   // landedCoinsInBonusBoost — one entry per copy (0-based copyIdx)
//   const landedCoins: any[][] = [];
//   sorted.forEach((c) => {
//     const copies = effSplit ? (c.splitCount ?? 1) : 1;
//     for (let ci = 0; ci < copies; ci++) {
//       const val = c.splitCopyValues?.[ci] ?? c.value;
//       const entry: any[] = [c.position, c.colorCode, val];
//       if (effStrike && c.winged) entry.push("winged");
//       entry.push(ci);
//       landedCoins.push(entry);
//     }
//   });

//   // boostValues
//   const boostValues = Array(15).fill(0);
//   let hasBoost = false;
//   if (effStrike) {
//     coins.forEach((c) => {
//       if (c.winged && c.boostValue) {
//         const n = Number(c.boostValue);
//         boostValues[c.position] = isNaN(n) ? c.boostValue : n;
//         if (n !== 0) hasBoost = true;
//       }
//     });
//   }

//   // numberOfSplitCoins
//   const numSplit = Array(15).fill(0);
//   let hasSplitCoins = false;
//   if (effSplit) {
//     coins.forEach((c) => {
//       if ((c.splitCount ?? 1) > 1) { numSplit[c.position] = c.splitCount!; hasSplitCoins = true; }
//     });
//   }

//   // splitCoinsBoostValues
//   const splitBoostArrays: (number | string)[][] = [Array(15).fill(0), Array(15).fill(0), Array(15).fill(0)];
//   let hasSplitBoost = false;
//   if (effStrike && effSplit) {
//     coins.forEach((c) => {
//       if (c.winged && (c.splitCount ?? 1) > 1 && c.splitBoostValues) {
//         c.splitBoostValues.forEach((bv, idx) => {
//           if (bv !== undefined && bv !== "") {
//             const n = Number(bv);
//             splitBoostArrays[idx][c.position] = isNaN(n) ? bv : n;
//             if (n !== 0) hasSplitBoost = true;
//           }
//         });
//       }
//     });
//   }

//   // Zone
//   const effSplitter    = effZone ? (upgradedZoneSplitter    ?? config.splitter)    : undefined;
//   const effMultipliers = effZone ? (upgradedZoneMultipliers ?? config.multipliers) : undefined;

//   const additional = [...allUpgraded];

//   let out = `[reelStopPositions: [${rsp.join(",")}]`;
//   if (landedCoins.length > 0)
//     out += `,landedCoinsInBonusBoost: [${landedCoins.map((r) => `[${r.join(",")}]`).join(",")}]`;
//   if (hasBoost)
//     out += `,boostValues: [${boostValues.join(",")}]`;
//   if (hasSplitCoins)
//     out += `,numberOfSplitCoins: [${numSplit.join(",")}]`;
//   if (hasSplitBoost) {
//     const maxExtra = Math.max(...coins.filter((c) => c.winged && effSplit).map((c) => (c.splitCount ?? 1) - 1), 0);
//     out += `,splitCoinsBoostValues: [${splitBoostArrays.slice(0, maxExtra).map((a) => `[${a.join(",")}]`).join(",")}]`;
//   }
//   if (effZone && effSplitter)
//     out += `,zoneSplitter: ${effSplitter}`;
//   if (effZone && effMultipliers && effMultipliers.length > 0)
//     out += `,zoneMultipliers: [${effMultipliers.join(",")}]`;
//   if (additional.length > 0)
//     out += `,additionalFeatureTriggered: [${additional.join(",")}]`;
//   out += `]`;
//   return out;
// }





//! greatest
// /* eslint-disable @typescript-eslint/no-explicit-any */

// export type CoinColorOption = { label: string; value: number };

// // ── All upgradeable features in this game ─────────────────────────────────────
// export const ALL_UPGRADE_FEATURES = ["STRIKE", "ZONE", "EXTRA", "SPLIT"];

// // ── Coin color tables ─────────────────────────────────────────────────────────
// export const COMBO_COIN_COLORS: Record<string, CoinColorOption[]> = {
//   "extra+zone":        [{ label:"Orange (4)", value:4 }, { label:"Cerise (9)", value:9 }, { label:"All-Color (14)", value:14 }, { label:"gold (19)", value:19 }],
//   "extra+split":       [{ label:"Green (4)", value:4 }, { label:"Blue (9)", value:9 }, { label:"Orange (14)", value:14 }, { label:"Cerise (19)", value:19 }],
//   "extra+strike":      [{ label:"Blue (4)", value:4 }, { label:"Cerise (9)", value:9 }, { label:"All-Color (14)", value:14 }, { label:"gold (19)", value:19 }],
//   "split+zone":        [{ label:"Orange (4)", value:4 }, { label:"Blue (9)", value:9 }, { label:"All-Color (14)", value:14 }, { label:"gold (19)", value:19 }],
//   "split+strike":      [{ label:"Blue (4)", value:4 }, { label:"Green (9)", value:9 }, { label:"All-Color (14)", value:14 }, { label:"gold (19)", value:19 }],
//   "split+extra":       [{ label:"Orange (4)", value:4 }, { label:"Blue (9)", value:9 }, { label:"All-Color (14)", value:14 }, { label:"gold (19)", value:19 }],
//   "strike+zone":       [{ label:"Cerise (4)", value:4 }, { label:"Green (9)", value:9 }, { label:"All-Color (14)", value:14 }, { label:"gold (19)", value:19 }],
//   "extra+split+zone":  [{ label:"Orange (4)", value:4 }, { label:"All-Color (9)", value:9 }, { label:"gold (14)", value:14 }, { label:"gold (19)", value:19 }],
//   "extra+split+strike":[{ label:"Blue (4)", value:4 }, { label:"All-Color (9)", value:9 }, { label:"gold (14)", value:14 }, { label:"gold (19)", value:19 }],
//   "extra+strike+zone": [{ label:"Cerise (4)", value:4 }, { label:"All-Color (9)", value:9 }, { label:"gold (14)", value:14 }, { label:"gold (19)", value:19 }],
//   "split+strike+zone": [{ label:"Green (4)", value:4 }, { label:"All-Color (9)", value:9 }, { label:"gold (14)", value:14 }, { label:"gold (19)", value:19 }],
//   "extra+split+strike+zone":[{ label:"Green (4)", value:4 }, { label:"Blue (9)", value:9 }, { label:"Orange (14)", value:14 }, { label:"Cerise (19)", value:19 }],
// };

// export const COMBO_SCAT_SEED_COLOR: Record<string, Record<string, number>> = {
//   "extra+zone":         { green:4, blue:9, orange:14, cerise:19, all:4  },
//   "extra+split":        { green:4, blue:9, orange:14, cerise:19, all:19 },
//   "extra+strike":       { green:4, blue:9, orange:14, cerise:19, all:14 },
//   "split+zone":         { green:4, blue:9, orange:14, cerise:19, all:19 },
//   "split+strike":       { green:4, blue:9, orange:14, cerise:19, all:19 },
//   "strike+zone":        { green:4, blue:9, orange:14, cerise:19, all:14 },
//   "extra+split+zone":   { green:4, blue:9, orange:14, cerise:19, all:19 },
//   "extra+split+strike": { green:4, blue:9, orange:14, cerise:19, all:19 },
//   "extra+strike+zone":  { green:4, blue:9, orange:14, cerise:19, all:14 },
//   "split+strike+zone":  { green:4, blue:9, orange:14, cerise:19, all:19 },
//   "extra+split+strike+zone": { green:4, blue:9, orange:14, cerise:19, all:19 },
// };

// // ── Types ─────────────────────────────────────────────────────────────────────
// export type ComboCoin = {
//   position:          number;
//   colorCode:         number;
//   value:             string;
//   winged?:           boolean;      // legacy: seeded from base strike data
//   boostValue?:       string;       // legacy: kept for compat
//   splitCount?:       number;
//   splitCopyValues?:  string[];     // per-copy value; [copyIndex] (0-based)
//   // Which copy (0-based) is the winged one in Strike+Split combo. undefined = none.
//   wingedCopyIdx?:    number;
//   // boost values indexed by copyIdx (0=copy0, 1=copy1, etc.)
//   splitBoostValues?: string[];
//   fromBase?:         boolean;
// };

// export type ComboFeatureConfig = {
//   features:      string[];
//   hasExtra:      boolean;
//   hasZone:       boolean;
//   hasStrike:     boolean;
//   hasSplit:      boolean;
//   splitter?:     number;
//   multipliers?:  number[];
// };

// export type UpgradeInfo = {
//   col:              number;
//   row:              number;
//   features:         string[];   // e.g. ["ZONE"] or ["STRIKE", "EXTRA"]
//   zoneSplitter?:    number;
//   zoneMultipliers?: number[];
// };

// // ── resolveUpgradeFeatures ────────────────────────────────────────────────────
// // Given a coin color label from the Ignite Purple palette, returns the
// // UPPERCASE feature name(s) that coin can upgrade to.
// // Returns [] for gold (no upgrade).
// // Caller handles all-color coins separately (isAllColor check).
// const LABEL_KEYWORD_MAP: Record<string, string> = {
//   orange: "STRIKE",
//   blue:   "ZONE",
//   green:  "EXTRA",
//   cerise: "SPLIT",
// };

// export function resolveUpgradeFeatures(colorLabel: string): string[] {
//   const l = colorLabel.toLowerCase();
//   if (l.includes("gold"))                                      return [];
//   if (l.includes("all-color") || l.includes("all color"))     return []; // handled via isAllColor
//   for (const [key, feat] of Object.entries(LABEL_KEYWORD_MAP)) {
//     if (l.includes(key)) return [feat];
//   }
//   return [];
// }

// // ── Helpers ───────────────────────────────────────────────────────────────────
// export function getComboKey(features: string[]): string {
//   return [...features].sort().join("+");
// }

// export function getComboCoinColors(features: string[]): CoinColorOption[] {
//   const key = getComboKey(features);
//   return COMBO_COIN_COLORS[key] ?? [
//     { label:"Green (4)", value:4 }, { label:"Blue (9)", value:9 },
//     { label:"Orange (14)", value:14 }, { label:"Cerise (19)", value:19 },
//   ];
// }

// export function getComboScatSeedColor(features: string[], scatKey: string): number {
//   const key = getComboKey(features);
//   return COMBO_SCAT_SEED_COLOR[key]?.[scatKey] ?? 4;
// }

// export function getComboMaxSpins(config: ComboFeatureConfig): number {
//   return config.hasExtra ? 4 : 3;
// }

// // ── Output generator ──────────────────────────────────────────────────────────
// export function generateCombinationGaffe(
//   coins: ComboCoin[],
//   config: ComboFeatureConfig,
//   upgrade: UpgradeInfo | null = null
// ): string {
//   const { hasStrike, hasZone, hasSplit, splitter, multipliers } = config;

//   const rsp = Array(15).fill(0);
//   coins.forEach((c) => { rsp[c.position] = c.colorCode; });

//   const sorted = [...coins].sort((a, b) => a.position - b.position);

//   // One entry per copy: [pos, colorCode, copyValue, "winged"(only on the specific winged copy), copyIndex]
//   const landedCoins: any[][] = [];
//   sorted.forEach((c) => {
//     const copies = hasSplit ? (c.splitCount ?? 1) : 1;
//     const wci = c.wingedCopyIdx;
//     for (let ci = 0; ci < copies; ci++) {
//       const val = c.splitCopyValues?.[ci] ?? c.value;
//       const entry: any[] = [c.position, c.colorCode, val];
//       if (hasStrike && wci !== undefined && ci === wci) entry.push("winged");
//       entry.push(ci);
//       landedCoins.push(entry);
//     }
//   });

//   // boostValues — only when the winged copy is copy 0
//   const boostValues = Array(15).fill(0);
//   let hasBoost = false;
//   if (hasStrike) {
//     coins.forEach((c) => {
//       if (c.wingedCopyIdx === 0) {
//         const bv = c.splitBoostValues?.[0] ?? c.boostValue ?? "";
//         if (bv !== "") {
//           const n = Number(bv);
//           boostValues[c.position] = isNaN(n) ? bv : n;
//           if (n !== 0) hasBoost = true;
//         }
//       }
//     });
//   }

//   const numSplit = Array(15).fill(0);
//   let hasSplitCoins = false;
//   if (hasSplit) {
//     coins.forEach((c) => {
//       if (c.splitCount && c.splitCount > 1) {
//         numSplit[c.position] = c.splitCount; hasSplitCoins = true;
//       }
//     });
//   }

//   // splitCoinsBoostValues — 3 arrays for extra copy slots (copyIdx 1, 2, 3)
//   // boost goes into array[wingedCopyIdx-1][pos] when the winged copy is an extra copy
//   const splitBoostArrays: (number | string)[][] = [
//     Array(15).fill(0), Array(15).fill(0), Array(15).fill(0),
//   ];
//   let hasSplitBoost = false;
//   if (hasStrike && hasSplit) {
//     coins.forEach((c) => {
//       const wci = c.wingedCopyIdx;
//       if (wci !== undefined && wci >= 1 && c.splitCount && c.splitCount > wci) {
//         const bv = c.splitBoostValues?.[wci] ?? "";
//         if (bv !== "") {
//           const n = Number(bv);
//           splitBoostArrays[wci - 1][c.position] = isNaN(n) ? bv : n;
//           if (n !== 0) hasSplitBoost = true;
//         }
//       }
//     });
//   }

//   const effSplitter    = upgrade?.zoneSplitter    ?? splitter;
//   const effMultipliers = upgrade?.zoneMultipliers ?? multipliers;

//   let out = `[reelStopPositions: [${rsp.join(",")}]`;
//   if (landedCoins.length > 0)
//     out += `,landedCoinsInBonusBoost: [${landedCoins.map((r: any[]) => `[${r.join(",")}]`).join(",")}]`;
//   if (hasBoost)
//     out += `,boostValues: [${boostValues.join(",")}]`;
//   if (hasSplitCoins)
//     out += `,numberOfSplitCoins: [${numSplit.join(",")}]`;
//   if (hasSplitBoost) {
//     const maxWci = Math.max(...coins
//       .filter((c) => c.wingedCopyIdx !== undefined && (c.wingedCopyIdx ?? 0) >= 1)
//       .map((c) => c.wingedCopyIdx!), 0);
//     out += `,splitCoinsBoostValues: [${splitBoostArrays.slice(0, maxWci).map((a) => `[${a.join(",")}]`).join(",")}]`;
//   }
//   if (hasZone && effSplitter)
//     out += `,zoneSplitter: ${effSplitter}`;
//   if (hasZone && effMultipliers && effMultipliers.length > 0)
//     out += `,zoneMultipliers: [${effMultipliers.join(",")}]`;
//   if (upgrade) {
//     out += `,upgradeCoinPosition: [${upgrade.col},${upgrade.row}]`;
//     if (upgrade.features.length > 0)
//       out += `,additionalFeatureTriggered: [${upgrade.features.map((f) => f.toLowerCase()).join(",")}]`;
//     if (upgrade.zoneSplitter)
//       out += `,upgradeZoneSplitter: ${upgrade.zoneSplitter}`;
//     if (upgrade.zoneMultipliers && upgrade.zoneMultipliers.length > 0)
//       out += `,upgradeZoneMultipliers: [${upgrade.zoneMultipliers.join(",")}]`;
//   }
//   out += `]`;
//   return out;
// }






// /* eslint-disable @typescript-eslint/no-explicit-any */

// export type CoinColorOption = { label: string; value: number };

// // !! Update values per combination  !!
// export const COMBO_COIN_COLORS: Record<string, CoinColorOption[]> = {
//   "extra+zone":        [{ label:"Orange (4)", value:4 }, { label:"Cerise (9)", value:9 }, { label:"All-Color (14)", value:14 }, { label:"gold (19)", value:19 }],
//   "extra+split":       [{ label:"Green (4)", value:4 }, { label:"Blue (9)", value:9 }, { label:"Orange (14)", value:14 }, { label:"Cerise (19)", value:19 }],
//   "extra+strike":      [{ label:"Blue (4)", value:4 }, { label:"Cerise (9)", value:9 }, { label:"All-Color (14)", value:14 }, { label:"gold (19)", value:19 }],
//   "split+zone":        [{ label:"Orange (4)", value:4 }, { label:"Blue (9)", value:9 }, { label:"All-Color (14)", value:14 }, { label:"gold (19)", value:19 }],
//   "split+strike":      [{ label:"Blue (4)", value:4 }, { label:"Green (9)", value:9 }, { label:"All-Color (14)", value:14 }, { label:"gold (19)", value:19 }],
//   "split+extra":      [{ label:"Orange (4)", value:4 }, { label:"Blue (9)", value:9 }, { label:"All-Color (14)", value:14 }, { label:"gold (19)", value:19 }],
//   "strike+zone":       [{ label:"Cerise (4)", value:4 }, { label:"Green (9)", value:9 }, { label:"All-Color (14)", value:14 }, { label:"gold (19)", value:19 }],
//   "extra+split+zone":  [{ label:"Orange (4)", value:4 }, { label:"All-Color (9)", value:9 }, { label:"gold (14)", value:14 }, { label:"gold (19)", value:19 }],
//   "extra+split+strike":[{ label:"Blue (4)", value:4 }, { label:"All-Color (9)", value:9 }, { label:"gold (14)", value:14 }, { label:"gold (19)", value:19 }],
//   "extra+strike+zone": [{ label:"Cerise (4)", value:4 }, { label:"All-Color (9)", value:9 }, { label:"gold (14)", value:14 }, { label:"gold (19)", value:19 }],
//   "split+strike+zone": [{ label:"Green (4)", value:4 }, { label:"All-Color (9)", value:9 }, { label:"gold (14)", value:14 }, { label:"gold (19)", value:19 }],
//   "extra+split+strike+zone":[{ label:"Green (4)", value:4 }, { label:"Blue (9)", value:9 }, { label:"Orange (14)", value:14 }, { label:"Cerise (19)", value:19 }],
// };


// // colorCode when a scat seeds into a specific combination
// export const COMBO_SCAT_SEED_COLOR: Record<string, Record<string, number>> = {
//   "extra+zone":         { green:4, blue:9, orange:14, cerise:19, all:4  },
//   "extra+split":        { green:4, blue:9, orange:14, cerise:19, all:19 },
//   "extra+strike":       { green:4, blue:9, orange:14, cerise:19, all:14 },
//   "split+zone":         { green:4, blue:9, orange:14, cerise:19, all:19 },
//   "split+strike":       { green:4, blue:9, orange:14, cerise:19, all:19 },
//   "strike+zone":        { green:4, blue:9, orange:14, cerise:19, all:14 },
//   "extra+split+zone":   { green:4, blue:9, orange:14, cerise:19, all:19 },
//   "extra+split+strike": { green:4, blue:9, orange:14, cerise:19, all:19 },
//   "extra+strike+zone":  { green:4, blue:9, orange:14, cerise:19, all:14 },
//   "split+strike+zone":  { green:4, blue:9, orange:14, cerise:19, all:19 },
//   "extra+split+strike+zone": { green:4, blue:9, orange:14, cerise:19, all:19 },
// };

// // ── TYPES ─────────────────────────────────────────────────────────────────────

// export type ComboCoin = {
//   position:         number;    // 0–14, column-major
//   colorCode:        number;
//   value:            string;
//   winged?:          boolean;   // strike
//   boostValue?:      string;    // strike: boost for coin 1 (or the only coin)
//   splitCount?:      number;    // split: 1–4
//   splitBoostValues?: string[]; // split+strike: boosts for split coins 2/3/4 [idx0=coin2, ...]
//   fromBase?:        boolean;
// };

// export type ComboFeatureConfig = {
//   features:      string[];
//   hasExtra:      boolean;
//   hasZone:       boolean;
//   hasStrike:     boolean;
//   hasSplit:      boolean;
//   splitter?:     number;
//   multipliers?:  number[];
// };

// // ── HELPERS ───────────────────────────────────────────────────────────────────

// export function getComboKey(features: string[]): string {
//   return [...features].sort().join("+");
// }

// export function getComboCoinColors(features: string[]): CoinColorOption[] {
//   const key = getComboKey(features);
//   return COMBO_COIN_COLORS[key] ?? [
//     { label:"Green (4)", value:4 }, { label:"Blue (9)", value:9 },
//     { label:"Orange (14)", value:14 }, { label:"Cerise (19)", value:19 },
//   ];
// }

// export function getComboScatSeedColor(features: string[], scatKey: string): number {
//   const key = getComboKey(features);
//   return COMBO_SCAT_SEED_COLOR[key]?.[scatKey] ?? 4;
// }

// /** 4 spins if Extra is in combo, else 3 */
// export function getComboMaxSpins(config: ComboFeatureConfig): number {
//   return config.hasExtra ? 4 : 3;
// }

// // ── OUTPUT GENERATOR ─────────────────────────────────────────────────────────

// export function generateCombinationGaffe(coins: ComboCoin[], config: ComboFeatureConfig): string {
//   const { hasStrike, hasZone, hasSplit, splitter, multipliers } = config;

//   // reelStopPositions
//   const rsp = Array(15).fill(0);
//   coins.forEach((c) => { rsp[c.position] = c.colorCode; });

//   const sorted = [...coins].sort((a, b) => a.position - b.position);

//   // landedCoinsInBonusBoost
//   // [pos, colorCode, value, "winged"?, splitCount?]
//   const landedCoins = sorted.map((c) => {
//     const row: any[] = [c.position, c.colorCode, c.value];
//     if (hasStrike && c.winged)             row.push("winged");
//     if (hasSplit && c.splitCount && c.splitCount > 1) row.push(c.splitCount);
//     return row;
//   });

//   // boostValues — coin 1 boosts for winged coins
//   const boostValues = Array(15).fill(0);
//   let hasBoost = false;
//   if (hasStrike) {
//     coins.forEach((c) => {
//       if (c.winged && c.boostValue !== undefined && c.boostValue !== "") {
//         const n = Number(c.boostValue);
//         boostValues[c.position] = isNaN(n) ? c.boostValue : n;
//         if (n !== 0) hasBoost = true;
//       }
//     });
//   }

//   // numberOfSplitCoins
//   const numberOfSplitCoins = Array(15).fill(0);
//   let hasSplitCoins = false;
//   if (hasSplit) {
//     coins.forEach((c) => {
//       if (c.splitCount && c.splitCount > 1) {
//         numberOfSplitCoins[c.position] = c.splitCount;
//         hasSplitCoins = true;
//       }
//     });
//   }

//   // splitCoinsBoostValues — [array for coin2, array for coin3, array for coin4]
//   // Only for strike+split combos; arrays at positions of split coins
//   const splitBoostArrays: (number | string)[][] = [
//     Array(15).fill(0), Array(15).fill(0), Array(15).fill(0),
//   ];
//   let hasSplitBoost = false;
//   if (hasStrike && hasSplit) {
//     coins.forEach((c) => {
//       if (c.winged && c.splitCount && c.splitCount > 1 && c.splitBoostValues) {
//         c.splitBoostValues.forEach((bv, idx) => {
//           if (bv !== undefined && bv !== "") {
//             const n = Number(bv);
//             splitBoostArrays[idx][c.position] = isNaN(n) ? bv : n;
//             if (n !== 0) hasSplitBoost = true;
//           }
//         });
//       }
//     });
//   }

//   let out = `[reelStopPositions: [${rsp.join(",")}]`;

//   if (landedCoins.length > 0)
//     out += `,landedCoinsInBonusBoost: [${landedCoins.map((r: any[]) => `[${r.join(",")}]`).join(",")}]`;

//   if (hasBoost)
//     out += `,boostValues: [${boostValues.join(",")}]`;

//   if (hasSplitCoins)
//     out += `,numberOfSplitCoins: [${numberOfSplitCoins.join(",")}]`;

//   if (hasSplitBoost) {
//     const maxExtra = Math.max(...coins.filter((c) => c.winged && hasSplit).map((c) => (c.splitCount ?? 1) - 1), 0);
//     out += `,splitCoinsBoostValues: [${splitBoostArrays.slice(0, maxExtra).map((a) => `[${a.join(",")}]`).join(",")}]`;
//   }

//   // if (hasZone && splitter)                             out += `, zoneSplitter: ${splitter}`;
//   // if (hasZone && multipliers && multipliers.length > 0) out += `, zoneMultipliers: [${multipliers.join(",")}]`;

//   out += `]`;
//   return out;
// }



//! latest working code
/* eslint-disable @typescript-eslint/no-explicit-any */

// export type CoinColorOption = { label: string; value: number };

// // ── UPGRADE MAP ───────────────────────────────────────────────────────────────
// // Maps a coin's label keyword → which feature it can upgrade to.
// // "gold" coins cannot upgrade. "All-Color" can upgrade to any feature.
// // These are the single-color → feature mappings (case-insensitive label check).
// export const COLOR_TO_FEATURE: Record<string, string> = {
//   orange: "strike",
//   blue:   "zone",
//   green:  "extra",
//   cerise: "split",
//   pink:   "split",
// };
// // "All-Color" → can upgrade to any of the 4 features (user picks subset)
// export const ALL_COLOR_FEATURES = ["strike", "zone", "extra", "split"];

// /** Given a coin color label (e.g. "Orange (4)"), return the upgradeable feature or null */
// export function getUpgradeFeature(label: string): string | null {
//   const lower = label.toLowerCase();
//   if (lower.includes("gold"))      return null; // no upgrade
//   if (lower.includes("all-color") || lower.includes("all color")) return "all";
//   for (const [key, feat] of Object.entries(COLOR_TO_FEATURE)) {
//     if (lower.includes(key)) return feat;
//   }
//   return null;
// }

// // ─────────────────────────────────────────────────────────────────────────────
// export const COMBO_COIN_COLORS: Record<string, CoinColorOption[]> = {
//   "extra+zone":        [{ label:"Orange (4)", value:4 }, { label:"Cerise (9)", value:9 }, { label:"All-Color (14)", value:14 }, { label:"Gold (19)", value:19 }],
//   "extra+split":       [{ label:"Green (4)", value:4 }, { label:"Blue (9)", value:9 }, { label:"Orange (14)", value:14 }, { label:"Cerise (19)", value:19 }],
//   "extra+strike":      [{ label:"Blue (4)", value:4 }, { label:"Cerise (9)", value:9 }, { label:"All-Color (14)", value:14 }, { label:"Gold (19)", value:19 }],
//   "split+zone":        [{ label:"Orange (4)", value:4 }, { label:"Blue (9)", value:9 }, { label:"All-Color (14)", value:14 }, { label:"Gold (19)", value:19 }],
//   "split+strike":      [{ label:"Blue (4)", value:4 }, { label:"Green (9)", value:9 }, { label:"All-Color (14)", value:14 }, { label:"Gold (19)", value:19 }],
//   "split+extra":       [{ label:"Orange (4)", value:4 }, { label:"Blue (9)", value:9 }, { label:"All-Color (14)", value:14 }, { label:"Gold (19)", value:19 }],
//   "strike+zone":       [{ label:"Cerise (4)", value:4 }, { label:"Green (9)", value:9 }, { label:"All-Color (14)", value:14 }, { label:"Gold (19)", value:19 }],
//   "extra+split+zone":  [{ label:"Orange (4)", value:4 }, { label:"All-Color (9)", value:9 }, { label:"Gold (14)", value:14 }, { label:"Gold (19)", value:19 }],
//   "extra+split+strike":[{ label:"Blue (4)", value:4 }, { label:"All-Color (9)", value:9 }, { label:"Gold (14)", value:14 }, { label:"Gold (19)", value:19 }],
//   "extra+strike+zone": [{ label:"Cerise (4)", value:4 }, { label:"All-Color (9)", value:9 }, { label:"Gold (14)", value:14 }, { label:"Gold (19)", value:19 }],
//   "split+strike+zone": [{ label:"Green (4)", value:4 }, { label:"All-Color (9)", value:9 }, { label:"Gold (14)", value:14 }, { label:"Gold (19)", value:19 }],
//   "extra+split+strike+zone":[{ label:"Green (4)", value:4 }, { label:"Blue (9)", value:9 }, { label:"Orange (14)", value:14 }, { label:"Cerise (19)", value:19 }],
// };

// export const COMBO_SCAT_SEED_COLOR: Record<string, Record<string, number>> = {
//   "extra+zone":         { green:4, blue:9, orange:14, cerise:19, all:4  },
//   "extra+split":        { green:4, blue:9, orange:14, cerise:19, all:19 },
//   "extra+strike":       { green:4, blue:9, orange:14, cerise:19, all:14 },
//   "split+zone":         { green:4, blue:9, orange:14, cerise:19, all:19 },
//   "split+strike":       { green:4, blue:9, orange:14, cerise:19, all:19 },
//   "strike+zone":        { green:4, blue:9, orange:14, cerise:19, all:14 },
//   "extra+split+zone":   { green:4, blue:9, orange:14, cerise:19, all:19 },
//   "extra+split+strike": { green:4, blue:9, orange:14, cerise:19, all:19 },
//   "extra+strike+zone":  { green:4, blue:9, orange:14, cerise:19, all:14 },
//   "split+strike+zone":  { green:4, blue:9, orange:14, cerise:19, all:19 },
//   "extra+split+strike+zone": { green:4, blue:9, orange:14, cerise:19, all:19 },
// };

// // ── TYPES ─────────────────────────────────────────────────────────────────────
// export type ComboCoin = {
//   position:          number;
//   colorCode:         number;
//   value:             string;
//   winged?:           boolean;
//   boostValue?:       string;
//   splitCount?:       number;
//   splitCopyValues?:  string[];   // per-copy value overrides (index = copyIdx)
//   splitBoostValues?: string[];
//   upgraded?:         boolean;        // true = this coin triggered an upgrade
//   upgradeFeatures?:  string[];       // which features were upgraded (for all-color coins)
//   fromBase?:         boolean;
// };

// export type ComboFeatureConfig = {
//   features:      string[];
//   hasExtra:      boolean;
//   hasZone:       boolean;
//   hasStrike:     boolean;
//   hasSplit:      boolean;
//   splitter?:     number;
//   multipliers?:  number[];
// };

// // ── HELPERS ───────────────────────────────────────────────────────────────────
// export function getComboKey(features: string[]): string {
//   return [...features].sort().join("+");
// }

// export function getComboCoinColors(features: string[]): CoinColorOption[] {
//   const key = getComboKey(features);
//   return COMBO_COIN_COLORS[key] ?? [
//     { label:"Green (4)", value:4 }, { label:"Blue (9)", value:9 },
//     { label:"Orange (14)", value:14 }, { label:"Cerise (19)", value:19 },
//   ];
// }

// export function getComboScatSeedColor(features: string[], scatKey: string): number {
//   const key = getComboKey(features);
//   return COMBO_SCAT_SEED_COLOR[key]?.[scatKey] ?? 4;
// }

// export function getComboMaxSpins(config: ComboFeatureConfig): number {
//   return config.hasExtra ? 4 : 3;
// }

// // ── OUTPUT GENERATOR ─────────────────────────────────────────────────────────
// export function generateCombinationGaffe(
//   coins: ComboCoin[],
//   config: ComboFeatureConfig,
//   coinColorOptions: CoinColorOption[]
// ): string {
//   const { hasStrike, hasZone, hasSplit, splitter, multipliers } = config;

//   const rsp = Array(15).fill(0);
//   coins.forEach((c) => { rsp[c.position] = c.colorCode; });

//   const sorted = [...coins].sort((a, b) => a.position - b.position);

//   // landedCoinsInBonusBoost — one entry per copy (like SplitFeature)
//   const landedCoins: any[][] = [];
//   sorted.forEach((c) => {
//     const totalCopies = hasSplit ? (c.splitCount ?? 1) : 1;
//     for (let copyIdx = 0; copyIdx < totalCopies; copyIdx++) {
//       const val = c.splitCopyValues?.[copyIdx] ?? c.value;
//       const entry: any[] = [c.position, c.colorCode, val];
//       if (hasStrike && c.winged) entry.push("winged");
//       entry.push(copyIdx); // 0-based copy index always present
//       landedCoins.push(entry);
//     }
//   });

//   // boostValues
//   const boostValues = Array(15).fill(0);
//   let hasBoost = false;
//   if (hasStrike) {
//     coins.forEach((c) => {
//       if (c.winged && c.boostValue !== undefined && c.boostValue !== "") {
//         const n = Number(c.boostValue);
//         boostValues[c.position] = isNaN(n) ? c.boostValue : n;
//         if (n !== 0) hasBoost = true;
//       }
//     });
//   }

//   // numberOfSplitCoins
//   const numberOfSplitCoins = Array(15).fill(0);
//   let hasSplitCoins = false;
//   if (hasSplit) {
//     coins.forEach((c) => {
//       if ((c.splitCount ?? 1) > 1) {
//         numberOfSplitCoins[c.position] = c.splitCount!;
//         hasSplitCoins = true;
//       }
//     });
//   }

//   // splitCoinsBoostValues
//   const splitBoostArrays: (number | string)[][] = [Array(15).fill(0), Array(15).fill(0), Array(15).fill(0)];
//   let hasSplitBoost = false;
//   if (hasStrike && hasSplit) {
//     coins.forEach((c) => {
//       if (c.winged && (c.splitCount ?? 1) > 1 && c.splitBoostValues) {
//         c.splitBoostValues.forEach((bv, idx) => {
//           if (bv !== undefined && bv !== "") {
//             const n = Number(bv);
//             splitBoostArrays[idx][c.position] = isNaN(n) ? bv : n;
//             if (n !== 0) hasSplitBoost = true;
//           }
//         });
//       }
//     });
//   }

//   // additionalFeatureTriggered — collect all upgrade features across all upgraded coins
//   const additionalFeatures = new Set<string>();
//   coins.forEach((c) => {
//     if (!c.upgraded) return;
//     const label = coinColorOptions.find((o) => o.value === c.colorCode)?.label ?? "";
//     const upgradeType = getUpgradeFeature(label);
//     if (upgradeType === "all") {
//       (c.upgradeFeatures ?? []).forEach((f) => additionalFeatures.add(f));
//     } else if (upgradeType) {
//       additionalFeatures.add(upgradeType);
//     }
//   });

//   let out = `[reelStopPositions: [${rsp.join(",")}]`;

//   if (landedCoins.length > 0)
//     out += `,landedCoinsInBonusBoost: [${landedCoins.map((r) => `[${r.join(",")}]`).join(",")}]`;

//   if (hasBoost)
//     out += `,boostValues: [${boostValues.join(",")}]`;

//   if (hasSplitCoins)
//     out += `,numberOfSplitCoins: [${numberOfSplitCoins.join(",")}]`;

//   if (hasSplitBoost) {
//     const maxExtra = Math.max(...coins.filter((c) => c.winged && hasSplit).map((c) => (c.splitCount ?? 1) - 1), 0);
//     out += `,splitCoinsBoostValues: [${splitBoostArrays.slice(0, maxExtra).map((a) => `[${a.join(",")}]`).join(",")}]`;
//   }

//   if (hasZone && splitter)                              out += `,zoneSplitter: ${splitter}`;
//   if (hasZone && multipliers && multipliers.length > 0) out += `,zoneMultipliers: [${multipliers.join(",")}]`;

//   if (additionalFeatures.size > 0)
//     out += `,additionalFeatureTriggered: [${[...additionalFeatures].join(",")}]`;

//   out += `]`;
//   return out;
// }


//! working
/* eslint-disable @typescript-eslint/no-explicit-any */

// export type CoinColorOption = { label: string; value: number };

// // ── Upgrade helpers ───────────────────────────────────────────────────────────
// export const COLOR_UPGRADE_MAP: Record<string, string> = {
//   orange: "strike",
//   blue:   "zone",
//   green:  "extra",
//   cerise: "split",
//   pink:   "split",
// };
// export const ALL_COLOR_UPGRADE_FEATURES = ["strike", "zone", "extra", "split"];

// /**
//  * Returns:
//  *   "gold"    → no upgrade
//  *   "all"     → all-color; user picks subset
//  *   "strike" | "zone" | "extra" | "split" → single upgrade target
//  *   null      → unknown / no upgrade
//  */
// export function getUpgradeType(label: string): string | null {
//   const l = label.toLowerCase();
//   if (l.includes("gold"))                                      return "gold";
//   if (l.includes("all-color") || l.includes("all color"))     return "all";
//   for (const [key, feat] of Object.entries(COLOR_UPGRADE_MAP)) {
//     if (l.includes(key)) return feat;
//   }
//   return null;
// }

// // ── Coin color tables ─────────────────────────────────────────────────────────
// export const COMBO_COIN_COLORS: Record<string, CoinColorOption[]> = {
//   "extra+zone":        [{ label:"Orange (4)", value:4 }, { label:"Cerise (9)", value:9 }, { label:"All-Color (14)", value:14 }, { label:"Gold (19)", value:19 }],
//   "extra+split":       [{ label:"Green (4)", value:4 }, { label:"Blue (9)", value:9 }, { label:"Orange (14)", value:14 }, { label:"Cerise (19)", value:19 }],
//   "extra+strike":      [{ label:"Blue (4)", value:4 }, { label:"Cerise (9)", value:9 }, { label:"All-Color (14)", value:14 }, { label:"Gold (19)", value:19 }],
//   "split+zone":        [{ label:"Orange (4)", value:4 }, { label:"Blue (9)", value:9 }, { label:"All-Color (14)", value:14 }, { label:"Gold (19)", value:19 }],
//   "split+strike":      [{ label:"Blue (4)", value:4 }, { label:"Green (9)", value:9 }, { label:"All-Color (14)", value:14 }, { label:"Gold (19)", value:19 }],
//   "split+extra":       [{ label:"Orange (4)", value:4 }, { label:"Blue (9)", value:9 }, { label:"All-Color (14)", value:14 }, { label:"Gold (19)", value:19 }],
//   "strike+zone":       [{ label:"Cerise (4)", value:4 }, { label:"Green (9)", value:9 }, { label:"All-Color (14)", value:14 }, { label:"Gold (19)", value:19 }],
//   "extra+split+zone":  [{ label:"Orange (4)", value:4 }, { label:"All-Color (9)", value:9 }, { label:"Gold (14)", value:14 }, { label:"Gold (19)", value:19 }],
//   "extra+split+strike":[{ label:"Blue (4)", value:4 }, { label:"All-Color (9)", value:9 }, { label:"Gold (14)", value:14 }, { label:"Gold (19)", value:19 }],
//   "extra+strike+zone": [{ label:"Cerise (4)", value:4 }, { label:"All-Color (9)", value:9 }, { label:"Gold (14)", value:14 }, { label:"Gold (19)", value:19 }],
//   "split+strike+zone": [{ label:"Green (4)", value:4 }, { label:"All-Color (9)", value:9 }, { label:"Gold (14)", value:14 }, { label:"Gold (19)", value:19 }],
//   "extra+split+strike+zone":[{ label:"Green (4)", value:4 }, { label:"Blue (9)", value:9 }, { label:"Orange (14)", value:14 }, { label:"Cerise (19)", value:19 }],
// };

// export const COMBO_SCAT_SEED_COLOR: Record<string, Record<string, number>> = {
//   "extra+zone":         { green:4, blue:9, orange:14, cerise:19, all:4  },
//   "extra+split":        { green:4, blue:9, orange:14, cerise:19, all:19 },
//   "extra+strike":       { green:4, blue:9, orange:14, cerise:19, all:14 },
//   "split+zone":         { green:4, blue:9, orange:14, cerise:19, all:19 },
//   "split+strike":       { green:4, blue:9, orange:14, cerise:19, all:19 },
//   "strike+zone":        { green:4, blue:9, orange:14, cerise:19, all:14 },
//   "extra+split+zone":   { green:4, blue:9, orange:14, cerise:19, all:19 },
//   "extra+split+strike": { green:4, blue:9, orange:14, cerise:19, all:19 },
//   "extra+strike+zone":  { green:4, blue:9, orange:14, cerise:19, all:14 },
//   "split+strike+zone":  { green:4, blue:9, orange:14, cerise:19, all:19 },
//   "extra+split+strike+zone": { green:4, blue:9, orange:14, cerise:19, all:19 },
// };

// // ── Types ─────────────────────────────────────────────────────────────────────
// export type ComboCoin = {
//   position:          number;
//   colorCode:         number;
//   value:             string;
//   winged?:           boolean;
//   boostValue?:       string;
//   splitCount?:       number;
//   splitCopyValues?:  string[];   // per-copy value; [copyIdx]
//   splitBoostValues?: string[];   // strike+split extra copy boosts
//   upgraded?:         boolean;
//   upgradeFeatures?:  string[];
//   fromBase?:         boolean;
// };

// export type ComboFeatureConfig = {
//   features:      string[];
//   hasExtra:      boolean;
//   hasZone:       boolean;
//   hasStrike:     boolean;
//   hasSplit:      boolean;
//   splitter?:     number;
//   multipliers?:  number[];
// };

// // ── Helpers ───────────────────────────────────────────────────────────────────
// export function getComboKey(features: string[]): string {
//   return [...features].sort().join("+");
// }

// export function getComboCoinColors(features: string[]): CoinColorOption[] {
//   const key = getComboKey(features);
//   return COMBO_COIN_COLORS[key] ?? [
//     { label:"Green (4)", value:4 }, { label:"Blue (9)", value:9 },
//     { label:"Orange (14)", value:14 }, { label:"Cerise (19)", value:19 },
//   ];
// }

// export function getComboScatSeedColor(features: string[], scatKey: string): number {
//   const key = getComboKey(features);
//   return COMBO_SCAT_SEED_COLOR[key]?.[scatKey] ?? 4;
// }

// export function getComboMaxSpins(config: ComboFeatureConfig, upgradedFeatures: string[] = []): number {
//   return config.hasExtra || upgradedFeatures.includes("extra") ? 4 : 3;
// }

// // ── Output generator ──────────────────────────────────────────────────────────
// export function generateCombinationGaffe(
//   coins: ComboCoin[],
//   config: ComboFeatureConfig,
//   upgradedZoneSplitter?: number,
//   upgradedZoneMultipliers?: number[]
// ): string {
//   const allUpgraded = new Set(coins.flatMap((c) => (c.upgraded ? (c.upgradeFeatures ?? []) : [])));
//   const effStrike = config.hasStrike || allUpgraded.has("strike");
//   const effZone   = config.hasZone   || allUpgraded.has("zone");
//   const effSplit  = config.hasSplit  || allUpgraded.has("split");

//   const rsp = Array(15).fill(0);
//   coins.forEach((c) => { rsp[c.position] = c.colorCode; });

//   const sorted = [...coins].sort((a, b) => a.position - b.position);

//   // landedCoinsInBonusBoost — one entry per copy (0-based copyIdx)
//   const landedCoins: any[][] = [];
//   sorted.forEach((c) => {
//     const copies = effSplit ? (c.splitCount ?? 1) : 1;
//     for (let ci = 0; ci < copies; ci++) {
//       const val = c.splitCopyValues?.[ci] ?? c.value;
//       const entry: any[] = [c.position, c.colorCode, val];
//       if (effStrike && c.winged) entry.push("winged");
//       entry.push(ci);
//       landedCoins.push(entry);
//     }
//   });

//   // boostValues
//   const boostValues = Array(15).fill(0);
//   let hasBoost = false;
//   if (effStrike) {
//     coins.forEach((c) => {
//       if (c.winged && c.boostValue) {
//         const n = Number(c.boostValue);
//         boostValues[c.position] = isNaN(n) ? c.boostValue : n;
//         if (n !== 0) hasBoost = true;
//       }
//     });
//   }

//   // numberOfSplitCoins
//   const numSplit = Array(15).fill(0);
//   let hasSplitCoins = false;
//   if (effSplit) {
//     coins.forEach((c) => {
//       if ((c.splitCount ?? 1) > 1) { numSplit[c.position] = c.splitCount!; hasSplitCoins = true; }
//     });
//   }

//   // splitCoinsBoostValues
//   const splitBoostArrays: (number | string)[][] = [Array(15).fill(0), Array(15).fill(0), Array(15).fill(0)];
//   let hasSplitBoost = false;
//   if (effStrike && effSplit) {
//     coins.forEach((c) => {
//       if (c.winged && (c.splitCount ?? 1) > 1 && c.splitBoostValues) {
//         c.splitBoostValues.forEach((bv, idx) => {
//           if (bv !== undefined && bv !== "") {
//             const n = Number(bv);
//             splitBoostArrays[idx][c.position] = isNaN(n) ? bv : n;
//             if (n !== 0) hasSplitBoost = true;
//           }
//         });
//       }
//     });
//   }

//   // Zone
//   const effSplitter    = effZone ? (upgradedZoneSplitter    ?? config.splitter)    : undefined;
//   const effMultipliers = effZone ? (upgradedZoneMultipliers ?? config.multipliers) : undefined;

//   const additional = [...allUpgraded];

//   let out = `[reelStopPositions: [${rsp.join(",")}]`;
//   if (landedCoins.length > 0)
//     out += `,landedCoinsInBonusBoost: [${landedCoins.map((r) => `[${r.join(",")}]`).join(",")}]`;
//   if (hasBoost)
//     out += `,boostValues: [${boostValues.join(",")}]`;
//   if (hasSplitCoins)
//     out += `,numberOfSplitCoins: [${numSplit.join(",")}]`;
//   if (hasSplitBoost) {
//     const maxExtra = Math.max(...coins.filter((c) => c.winged && effSplit).map((c) => (c.splitCount ?? 1) - 1), 0);
//     out += `,splitCoinsBoostValues: [${splitBoostArrays.slice(0, maxExtra).map((a) => `[${a.join(",")}]`).join(",")}]`;
//   }
//   if (effZone && effSplitter)
//     out += `,zoneSplitter: ${effSplitter}`;
//   if (effZone && effMultipliers && effMultipliers.length > 0)
//     out += `,zoneMultipliers: [${effMultipliers.join(",")}]`;
//   if (additional.length > 0)
//     out += `,additionalFeatureTriggered: [${additional.join(",")}]`;
//   out += `]`;
//   return out;
// }





//!tried
// /* eslint-disable @typescript-eslint/no-explicit-any */

// export type CoinColorOption = { label: string; value: number };

// // ── All upgradeable features in this game ─────────────────────────────────────
// export const ALL_UPGRADE_FEATURES = ["STRIKE", "ZONE", "EXTRA", "SPLIT"];

// // ── Coin color tables ─────────────────────────────────────────────────────────
// export const COMBO_COIN_COLORS: Record<string, CoinColorOption[]> = {
//   "extra+zone":        [{ label:"Orange (4)", value:4 }, { label:"Cerise (9)", value:9 }, { label:"All-Color (14)", value:14 }, { label:"gold (19)", value:19 }],
//   "extra+split":       [{ label:"Green (4)", value:4 }, { label:"Blue (9)", value:9 }, { label:"Orange (14)", value:14 }, { label:"Cerise (19)", value:19 }],
//   "extra+strike":      [{ label:"Blue (4)", value:4 }, { label:"Cerise (9)", value:9 }, { label:"All-Color (14)", value:14 }, { label:"gold (19)", value:19 }],
//   "split+zone":        [{ label:"Orange (4)", value:4 }, { label:"Blue (9)", value:9 }, { label:"All-Color (14)", value:14 }, { label:"gold (19)", value:19 }],
//   "split+strike":      [{ label:"Blue (4)", value:4 }, { label:"Green (9)", value:9 }, { label:"All-Color (14)", value:14 }, { label:"gold (19)", value:19 }],
//   "split+extra":       [{ label:"Orange (4)", value:4 }, { label:"Blue (9)", value:9 }, { label:"All-Color (14)", value:14 }, { label:"gold (19)", value:19 }],
//   "strike+zone":       [{ label:"Cerise (4)", value:4 }, { label:"Green (9)", value:9 }, { label:"All-Color (14)", value:14 }, { label:"gold (19)", value:19 }],
//   "extra+split+zone":  [{ label:"Orange (4)", value:4 }, { label:"All-Color (9)", value:9 }, { label:"gold (14)", value:14 }, { label:"gold (19)", value:19 }],
//   "extra+split+strike":[{ label:"Blue (4)", value:4 }, { label:"All-Color (9)", value:9 }, { label:"gold (14)", value:14 }, { label:"gold (19)", value:19 }],
//   "extra+strike+zone": [{ label:"Cerise (4)", value:4 }, { label:"All-Color (9)", value:9 }, { label:"gold (14)", value:14 }, { label:"gold (19)", value:19 }],
//   "split+strike+zone": [{ label:"Green (4)", value:4 }, { label:"All-Color (9)", value:9 }, { label:"gold (14)", value:14 }, { label:"gold (19)", value:19 }],
//   "extra+split+strike+zone":[{ label:"Green (4)", value:4 }, { label:"Blue (9)", value:9 }, { label:"Orange (14)", value:14 }, { label:"Cerise (19)", value:19 }],
// };

// export const COMBO_SCAT_SEED_COLOR: Record<string, Record<string, number>> = {
//   "extra+zone":         { green:4, blue:9, orange:14, cerise:19, all:4  },
//   "extra+split":        { green:4, blue:9, orange:14, cerise:19, all:19 },
//   "extra+strike":       { green:4, blue:9, orange:14, cerise:19, all:14 },
//   "split+zone":         { green:4, blue:9, orange:14, cerise:19, all:19 },
//   "split+strike":       { green:4, blue:9, orange:14, cerise:19, all:19 },
//   "strike+zone":        { green:4, blue:9, orange:14, cerise:19, all:14 },
//   "extra+split+zone":   { green:4, blue:9, orange:14, cerise:19, all:19 },
//   "extra+split+strike": { green:4, blue:9, orange:14, cerise:19, all:19 },
//   "extra+strike+zone":  { green:4, blue:9, orange:14, cerise:19, all:14 },
//   "split+strike+zone":  { green:4, blue:9, orange:14, cerise:19, all:19 },
//   "extra+split+strike+zone": { green:4, blue:9, orange:14, cerise:19, all:19 },
// };

// // ── Types ─────────────────────────────────────────────────────────────────────
// export type ComboCoin = {
//   position:          number;
//   colorCode:         number;
//   value:             string;
//   winged?:           boolean;      // legacy: seeded from base strike data
//   boostValue?:       string;       // legacy: kept for compat
//   splitCount?:       number;
//   splitCopyValues?:  string[];     // per-copy value; [copyIndex] (0-based)
//   // Which copy (0-based) is the winged one in Strike+Split combo. undefined = none.
//   wingedCopyIdx?:    number;
//   // boost values indexed by copyIdx (0=copy0, 1=copy1, etc.)
//   splitBoostValues?: string[];
//   fromBase?:         boolean;
// };

// export type ComboFeatureConfig = {
//   features:      string[];
//   hasExtra:      boolean;
//   hasZone:       boolean;
//   hasStrike:     boolean;
//   hasSplit:      boolean;
//   splitter?:     number;
//   multipliers?:  number[];
// };

// export type UpgradeInfo = {
//   col:              number;
//   row:              number;
//   features:         string[];   // e.g. ["ZONE"] or ["STRIKE", "EXTRA"]
//   zoneSplitter?:    number;
//   zoneMultipliers?: number[];
// };

// // ── resolveUpgradeFeatures ────────────────────────────────────────────────────
// // Given a coin color label from the Ignite Purple palette, returns the
// // UPPERCASE feature name(s) that coin can upgrade to.
// // Returns [] for gold (no upgrade).
// // Caller handles all-color coins separately (isAllColor check).
// const LABEL_KEYWORD_MAP: Record<string, string> = {
//   orange: "STRIKE",
//   blue:   "ZONE",
//   green:  "EXTRA",
//   cerise: "SPLIT",
// };

// export function resolveUpgradeFeatures(colorLabel: string): string[] {
//   const l = colorLabel.toLowerCase();
//   if (l.includes("gold"))                                      return [];
//   if (l.includes("all-color") || l.includes("all color"))     return []; // handled via isAllColor
//   for (const [key, feat] of Object.entries(LABEL_KEYWORD_MAP)) {
//     if (l.includes(key)) return [feat];
//   }
//   return [];
// }

// // ── Helpers ───────────────────────────────────────────────────────────────────
// export function getComboKey(features: string[]): string {
//   return [...features].sort().join("+");
// }

// export function getComboCoinColors(features: string[]): CoinColorOption[] {
//   const key = getComboKey(features);
//   return COMBO_COIN_COLORS[key] ?? [
//     { label:"Green (4)", value:4 }, { label:"Blue (9)", value:9 },
//     { label:"Orange (14)", value:14 }, { label:"Cerise (19)", value:19 },
//   ];
// }

// export function getComboScatSeedColor(features: string[], scatKey: string): number {
//   const key = getComboKey(features);
//   return COMBO_SCAT_SEED_COLOR[key]?.[scatKey] ?? 4;
// }

// export function getComboMaxSpins(config: ComboFeatureConfig): number {
//   return config.hasExtra ? 4 : 3;
// }

// // ── Output generator ──────────────────────────────────────────────────────────
// export function generateCombinationGaffe(
//   coins: ComboCoin[],
//   config: ComboFeatureConfig,
//   upgrade: UpgradeInfo | null = null
// ): string {
//   const { hasStrike, hasZone, hasSplit, splitter, multipliers } = config;

//   const rsp = Array(15).fill(0);
//   coins.forEach((c) => { rsp[c.position] = c.colorCode; });

//   const sorted = [...coins].sort((a, b) => a.position - b.position);

//   // One entry per copy: [pos, colorCode, copyValue, "winged"(only on the specific winged copy), copyIndex(only when Split)]
//   const landedCoins: any[][] = [];
//   sorted.forEach((c) => {
//     const copies = hasSplit ? (c.splitCount ?? 1) : 1;
//     const wci = c.wingedCopyIdx;
//     for (let ci = 0; ci < copies; ci++) {
//       const val = c.splitCopyValues?.[ci] ?? c.value;
//       const entry: any[] = [c.position, c.colorCode, val];
//       if (hasStrike && wci !== undefined && ci === wci) entry.push("winged");
//       if (hasSplit) entry.push(ci);   // copyIndex only needed when there are multiple copies
//       landedCoins.push(entry);
//     }
//   });

//   // boostValues — only when the winged copy is copy 0
//   const boostValues = Array(15).fill(0);
//   let hasBoost = false;
//   if (hasStrike) {
//     coins.forEach((c) => {
//       if (c.wingedCopyIdx === 0) {
//         const bv = c.splitBoostValues?.[0] ?? c.boostValue ?? "";
//         if (bv !== "") {
//           const n = Number(bv);
//           boostValues[c.position] = isNaN(n) ? bv : n;
//           if (n !== 0) hasBoost = true;
//         }
//       }
//     });
//   }

//   const numSplit = Array(15).fill(0);
//   let hasSplitCoins = false;
//   if (hasSplit) {
//     coins.forEach((c) => {
//       if (c.splitCount && c.splitCount > 1) {
//         numSplit[c.position] = c.splitCount; hasSplitCoins = true;
//       }
//     });
//   }

//   // splitCoinsBoostValues — 3 arrays for extra copy slots (copyIdx 1, 2, 3)
//   // boost goes into array[wingedCopyIdx-1][pos] when the winged copy is an extra copy
//   const splitBoostArrays: (number | string)[][] = [
//     Array(15).fill(0), Array(15).fill(0), Array(15).fill(0),
//   ];
//   let hasSplitBoost = false;
//   if (hasStrike && hasSplit) {
//     coins.forEach((c) => {
//       const wci = c.wingedCopyIdx;
//       if (wci !== undefined && wci >= 1 && c.splitCount && c.splitCount > wci) {
//         const bv = c.splitBoostValues?.[wci] ?? "";
//         if (bv !== "") {
//           const n = Number(bv);
//           splitBoostArrays[wci - 1][c.position] = isNaN(n) ? bv : n;
//           if (n !== 0) hasSplitBoost = true;
//         }
//       }
//     });
//   }

//   const effSplitter    = upgrade?.zoneSplitter    ?? splitter;
//   const effMultipliers = upgrade?.zoneMultipliers ?? multipliers;

//   let out = `[reelStopPositions: [${rsp.join(",")}]`;
//   if (landedCoins.length > 0)
//     out += `,landedCoinsInBonusBoost: [${landedCoins.map((r: any[]) => `[${r.join(",")}]`).join(",")}]`;
//   if (hasBoost)
//     out += `,boostValues: [${boostValues.join(",")}]`;
//   if (hasSplitCoins)
//     out += `,numberOfSplitCoins: [${numSplit.join(",")}]`;
//   if (hasSplitBoost) {
//     const maxWci = Math.max(...coins
//       .filter((c) => c.wingedCopyIdx !== undefined && (c.wingedCopyIdx ?? 0) >= 1)
//       .map((c) => c.wingedCopyIdx!), 0);
//     out += `,splitCoinsBoostValues: [${splitBoostArrays.slice(0, maxWci).map((a) => `[${a.join(",")}]`).join(",")}]`;
//   }
//   if (hasZone && effSplitter)
//     out += `,zoneSplitter: ${effSplitter}`;
//   if (hasZone && effMultipliers && effMultipliers.length > 0)
//     out += `,zoneMultipliers: [${effMultipliers.join(",")}]`;
//   if (upgrade) {
//     out += `,upgradeCoinPosition: [${upgrade.col},${upgrade.row}]`;
//     if (upgrade.features.length > 0)
//       out += `,additionalFeatureTriggered: [${upgrade.features.map((f) => f.toLowerCase()).join(",")}]`;
//     if (upgrade.zoneSplitter)
//       out += `,upgradeZoneSplitter: ${upgrade.zoneSplitter}`;
//     if (upgrade.zoneMultipliers && upgrade.zoneMultipliers.length > 0)
//       out += `,upgradeZoneMultipliers: [${upgrade.zoneMultipliers.join(",")}]`;
//   }
//   out += `]`;
//   return out;
// }






//! new try
// /* eslint-disable @typescript-eslint/no-explicit-any */

// export type CoinColorOption = { label: string; value: number };

// // !! Update values per combination  !!
// export const COMBO_COIN_COLORS: Record<string, CoinColorOption[]> = {
//   "extra+zone":        [{ label:"Orange (4)", value:4 }, { label:"Cerise (9)", value:9 }, { label:"All-Color (14)", value:14 }, { label:"gold (19)", value:19 }],
//   "extra+split":       [{ label:"Green (4)", value:4 }, { label:"Blue (9)", value:9 }, { label:"Orange (14)", value:14 }, { label:"Cerise (19)", value:19 }],
//   "extra+strike":      [{ label:"Blue (4)", value:4 }, { label:"Cerise (9)", value:9 }, { label:"All-Color (14)", value:14 }, { label:"gold (19)", value:19 }],
//   "split+zone":        [{ label:"Orange (4)", value:4 }, { label:"Blue (9)", value:9 }, { label:"All-Color (14)", value:14 }, { label:"gold (19)", value:19 }],
//   "split+strike":      [{ label:"Blue (4)", value:4 }, { label:"Green (9)", value:9 }, { label:"All-Color (14)", value:14 }, { label:"gold (19)", value:19 }],
//   "split+extra":      [{ label:"Orange (4)", value:4 }, { label:"Blue (9)", value:9 }, { label:"All-Color (14)", value:14 }, { label:"gold (19)", value:19 }],
//   "strike+zone":       [{ label:"Cerise (4)", value:4 }, { label:"Green (9)", value:9 }, { label:"All-Color (14)", value:14 }, { label:"gold (19)", value:19 }],
//   "extra+split+zone":  [{ label:"Orange (4)", value:4 }, { label:"All-Color (9)", value:9 }, { label:"gold (14)", value:14 }, { label:"gold (19)", value:19 }],
//   "extra+split+strike":[{ label:"Blue (4)", value:4 }, { label:"All-Color (9)", value:9 }, { label:"gold (14)", value:14 }, { label:"gold (19)", value:19 }],
//   "extra+strike+zone": [{ label:"Cerise (4)", value:4 }, { label:"All-Color (9)", value:9 }, { label:"gold (14)", value:14 }, { label:"gold (19)", value:19 }],
//   "split+strike+zone": [{ label:"Green (4)", value:4 }, { label:"All-Color (9)", value:9 }, { label:"gold (14)", value:14 }, { label:"gold (19)", value:19 }],
//   "extra+split+strike+zone":[{ label:"Green (4)", value:4 }, { label:"Blue (9)", value:9 }, { label:"Orange (14)", value:14 }, { label:"Cerise (19)", value:19 }],
// };


// // colorCode when a scat seeds into a specific combination
// export const COMBO_SCAT_SEED_COLOR: Record<string, Record<string, number>> = {
//   "extra+zone":         { green:4, blue:9, orange:14, cerise:19, all:4  },
//   "extra+split":        { green:4, blue:9, orange:14, cerise:19, all:19 },
//   "extra+strike":       { green:4, blue:9, orange:14, cerise:19, all:14 },
//   "split+zone":         { green:4, blue:9, orange:14, cerise:19, all:19 },
//   "split+strike":       { green:4, blue:9, orange:14, cerise:19, all:19 },
//   "strike+zone":        { green:4, blue:9, orange:14, cerise:19, all:14 },
//   "extra+split+zone":   { green:4, blue:9, orange:14, cerise:19, all:19 },
//   "extra+split+strike": { green:4, blue:9, orange:14, cerise:19, all:19 },
//   "extra+strike+zone":  { green:4, blue:9, orange:14, cerise:19, all:14 },
//   "split+strike+zone":  { green:4, blue:9, orange:14, cerise:19, all:19 },
//   "extra+split+strike+zone": { green:4, blue:9, orange:14, cerise:19, all:19 },
// };

// // ── TYPES ─────────────────────────────────────────────────────────────────────

// export type ComboCoin = {
//   position:         number;    // 0–14, column-major
//   colorCode:        number;
//   value:            string;
//   winged?:          boolean;   // strike
//   boostValue?:      string;    // strike: boost for coin 1 (or the only coin)
//   splitCount?:      number;    // split: 1–4
//   splitBoostValues?: string[]; // split+strike: boosts for split coins 2/3/4 [idx0=coin2, ...]
//   fromBase?:        boolean;
// };

// export type ComboFeatureConfig = {
//   features:      string[];
//   hasExtra:      boolean;
//   hasZone:       boolean;
//   hasStrike:     boolean;
//   hasSplit:      boolean;
//   splitter?:     number;
//   multipliers?:  number[];
// };

// // ── HELPERS ───────────────────────────────────────────────────────────────────

// export function getComboKey(features: string[]): string {
//   return [...features].sort().join("+");
// }

// export function getComboCoinColors(features: string[]): CoinColorOption[] {
//   const key = getComboKey(features);
//   return COMBO_COIN_COLORS[key] ?? [
//     { label:"Green (4)", value:4 }, { label:"Blue (9)", value:9 },
//     { label:"Orange (14)", value:14 }, { label:"Cerise (19)", value:19 },
//   ];
// }

// export function getComboScatSeedColor(features: string[], scatKey: string): number {
//   const key = getComboKey(features);
//   return COMBO_SCAT_SEED_COLOR[key]?.[scatKey] ?? 4;
// }

// /** 4 spins if Extra is in combo, else 3 */
// export function getComboMaxSpins(config: ComboFeatureConfig): number {
//   return config.hasExtra ? 4 : 3;
// }

// // ── OUTPUT GENERATOR ─────────────────────────────────────────────────────────

// export function generateCombinationGaffe(coins: ComboCoin[], config: ComboFeatureConfig): string {
//   const { hasStrike, hasZone, hasSplit, splitter, multipliers } = config;

//   // reelStopPositions
//   const rsp = Array(15).fill(0);
//   coins.forEach((c) => { rsp[c.position] = c.colorCode; });

//   const sorted = [...coins].sort((a, b) => a.position - b.position);

//   // landedCoinsInBonusBoost
//   // [pos, colorCode, value, "winged"?, splitCount?]
//   const landedCoins = sorted.map((c) => {
//     const row: any[] = [c.position, c.colorCode, c.value];
//     if (hasStrike && c.winged)             row.push("winged");
//     if (hasSplit && c.splitCount && c.splitCount > 1) row.push(c.splitCount);
//     return row;
//   });

//   // boostValues — coin 1 boosts for winged coins
//   const boostValues = Array(15).fill(0);
//   let hasBoost = false;
//   if (hasStrike) {
//     coins.forEach((c) => {
//       if (c.winged && c.boostValue !== undefined && c.boostValue !== "") {
//         const n = Number(c.boostValue);
//         boostValues[c.position] = isNaN(n) ? c.boostValue : n;
//         if (n !== 0) hasBoost = true;
//       }
//     });
//   }

//   // numberOfSplitCoins
//   const numberOfSplitCoins = Array(15).fill(0);
//   let hasSplitCoins = false;
//   if (hasSplit) {
//     coins.forEach((c) => {
//       if (c.splitCount && c.splitCount > 1) {
//         numberOfSplitCoins[c.position] = c.splitCount;
//         hasSplitCoins = true;
//       }
//     });
//   }

//   // splitCoinsBoostValues — [array for coin2, array for coin3, array for coin4]
//   // Only for strike+split combos; arrays at positions of split coins
//   const splitBoostArrays: (number | string)[][] = [
//     Array(15).fill(0), Array(15).fill(0), Array(15).fill(0),
//   ];
//   let hasSplitBoost = false;
//   if (hasStrike && hasSplit) {
//     coins.forEach((c) => {
//       if (c.winged && c.splitCount && c.splitCount > 1 && c.splitBoostValues) {
//         c.splitBoostValues.forEach((bv, idx) => {
//           if (bv !== undefined && bv !== "") {
//             const n = Number(bv);
//             splitBoostArrays[idx][c.position] = isNaN(n) ? bv : n;
//             if (n !== 0) hasSplitBoost = true;
//           }
//         });
//       }
//     });
//   }

//   let out = `[reelStopPositions: [${rsp.join(",")}]`;

//   if (landedCoins.length > 0)
//     out += `,landedCoinsInBonusBoost: [${landedCoins.map((r: any[]) => `[${r.join(",")}]`).join(",")}]`;

//   if (hasBoost)
//     out += `,boostValues: [${boostValues.join(",")}]`;

//   if (hasSplitCoins)
//     out += `,numberOfSplitCoins: [${numberOfSplitCoins.join(",")}]`;

//   if (hasSplitBoost) {
//     const maxExtra = Math.max(...coins.filter((c) => c.winged && hasSplit).map((c) => (c.splitCount ?? 1) - 1), 0);
//     out += `,splitCoinsBoostValues: [${splitBoostArrays.slice(0, maxExtra).map((a) => `[${a.join(",")}]`).join(",")}]`;
//   }

//   // if (hasZone && splitter)                             out += `, zoneSplitter: ${splitter}`;
//   // if (hasZone && multipliers && multipliers.length > 0) out += `, zoneMultipliers: [${multipliers.join(",")}]`;

//   out += `]`;
//   return out;
// }



//! latest working code
/* eslint-disable @typescript-eslint/no-explicit-any */

// export type CoinColorOption = { label: string; value: number };

// // ── UPGRADE MAP ───────────────────────────────────────────────────────────────
// // Maps a coin's label keyword → which feature it can upgrade to.
// // "gold" coins cannot upgrade. "All-Color" can upgrade to any feature.
// // These are the single-color → feature mappings (case-insensitive label check).
// export const COLOR_TO_FEATURE: Record<string, string> = {
//   orange: "strike",
//   blue:   "zone",
//   green:  "extra",
//   cerise: "split",
//   pink:   "split",
// };
// // "All-Color" → can upgrade to any of the 4 features (user picks subset)
// export const ALL_COLOR_FEATURES = ["strike", "zone", "extra", "split"];

// /** Given a coin color label (e.g. "Orange (4)"), return the upgradeable feature or null */
// export function getUpgradeFeature(label: string): string | null {
//   const lower = label.toLowerCase();
//   if (lower.includes("gold"))      return null; // no upgrade
//   if (lower.includes("all-color") || lower.includes("all color")) return "all";
//   for (const [key, feat] of Object.entries(COLOR_TO_FEATURE)) {
//     if (lower.includes(key)) return feat;
//   }
//   return null;
// }

// // ─────────────────────────────────────────────────────────────────────────────
// export const COMBO_COIN_COLORS: Record<string, CoinColorOption[]> = {
//   "extra+zone":        [{ label:"Orange (4)", value:4 }, { label:"Cerise (9)", value:9 }, { label:"All-Color (14)", value:14 }, { label:"Gold (19)", value:19 }],
//   "extra+split":       [{ label:"Green (4)", value:4 }, { label:"Blue (9)", value:9 }, { label:"Orange (14)", value:14 }, { label:"Cerise (19)", value:19 }],
//   "extra+strike":      [{ label:"Blue (4)", value:4 }, { label:"Cerise (9)", value:9 }, { label:"All-Color (14)", value:14 }, { label:"Gold (19)", value:19 }],
//   "split+zone":        [{ label:"Orange (4)", value:4 }, { label:"Blue (9)", value:9 }, { label:"All-Color (14)", value:14 }, { label:"Gold (19)", value:19 }],
//   "split+strike":      [{ label:"Blue (4)", value:4 }, { label:"Green (9)", value:9 }, { label:"All-Color (14)", value:14 }, { label:"Gold (19)", value:19 }],
//   "split+extra":       [{ label:"Orange (4)", value:4 }, { label:"Blue (9)", value:9 }, { label:"All-Color (14)", value:14 }, { label:"Gold (19)", value:19 }],
//   "strike+zone":       [{ label:"Cerise (4)", value:4 }, { label:"Green (9)", value:9 }, { label:"All-Color (14)", value:14 }, { label:"Gold (19)", value:19 }],
//   "extra+split+zone":  [{ label:"Orange (4)", value:4 }, { label:"All-Color (9)", value:9 }, { label:"Gold (14)", value:14 }, { label:"Gold (19)", value:19 }],
//   "extra+split+strike":[{ label:"Blue (4)", value:4 }, { label:"All-Color (9)", value:9 }, { label:"Gold (14)", value:14 }, { label:"Gold (19)", value:19 }],
//   "extra+strike+zone": [{ label:"Cerise (4)", value:4 }, { label:"All-Color (9)", value:9 }, { label:"Gold (14)", value:14 }, { label:"Gold (19)", value:19 }],
//   "split+strike+zone": [{ label:"Green (4)", value:4 }, { label:"All-Color (9)", value:9 }, { label:"Gold (14)", value:14 }, { label:"Gold (19)", value:19 }],
//   "extra+split+strike+zone":[{ label:"Green (4)", value:4 }, { label:"Blue (9)", value:9 }, { label:"Orange (14)", value:14 }, { label:"Cerise (19)", value:19 }],
// };

// export const COMBO_SCAT_SEED_COLOR: Record<string, Record<string, number>> = {
//   "extra+zone":         { green:4, blue:9, orange:14, cerise:19, all:4  },
//   "extra+split":        { green:4, blue:9, orange:14, cerise:19, all:19 },
//   "extra+strike":       { green:4, blue:9, orange:14, cerise:19, all:14 },
//   "split+zone":         { green:4, blue:9, orange:14, cerise:19, all:19 },
//   "split+strike":       { green:4, blue:9, orange:14, cerise:19, all:19 },
//   "strike+zone":        { green:4, blue:9, orange:14, cerise:19, all:14 },
//   "extra+split+zone":   { green:4, blue:9, orange:14, cerise:19, all:19 },
//   "extra+split+strike": { green:4, blue:9, orange:14, cerise:19, all:19 },
//   "extra+strike+zone":  { green:4, blue:9, orange:14, cerise:19, all:14 },
//   "split+strike+zone":  { green:4, blue:9, orange:14, cerise:19, all:19 },
//   "extra+split+strike+zone": { green:4, blue:9, orange:14, cerise:19, all:19 },
// };

// // ── TYPES ─────────────────────────────────────────────────────────────────────
// export type ComboCoin = {
//   position:          number;
//   colorCode:         number;
//   value:             string;
//   winged?:           boolean;
//   boostValue?:       string;
//   splitCount?:       number;
//   splitCopyValues?:  string[];   // per-copy value overrides (index = copyIdx)
//   splitBoostValues?: string[];
//   upgraded?:         boolean;        // true = this coin triggered an upgrade
//   upgradeFeatures?:  string[];       // which features were upgraded (for all-color coins)
//   fromBase?:         boolean;
// };

// export type ComboFeatureConfig = {
//   features:      string[];
//   hasExtra:      boolean;
//   hasZone:       boolean;
//   hasStrike:     boolean;
//   hasSplit:      boolean;
//   splitter?:     number;
//   multipliers?:  number[];
// };

// // ── HELPERS ───────────────────────────────────────────────────────────────────
// export function getComboKey(features: string[]): string {
//   return [...features].sort().join("+");
// }

// export function getComboCoinColors(features: string[]): CoinColorOption[] {
//   const key = getComboKey(features);
//   return COMBO_COIN_COLORS[key] ?? [
//     { label:"Green (4)", value:4 }, { label:"Blue (9)", value:9 },
//     { label:"Orange (14)", value:14 }, { label:"Cerise (19)", value:19 },
//   ];
// }

// export function getComboScatSeedColor(features: string[], scatKey: string): number {
//   const key = getComboKey(features);
//   return COMBO_SCAT_SEED_COLOR[key]?.[scatKey] ?? 4;
// }

// export function getComboMaxSpins(config: ComboFeatureConfig): number {
//   return config.hasExtra ? 4 : 3;
// }

// // ── OUTPUT GENERATOR ─────────────────────────────────────────────────────────
// export function generateCombinationGaffe(
//   coins: ComboCoin[],
//   config: ComboFeatureConfig,
//   coinColorOptions: CoinColorOption[]
// ): string {
//   const { hasStrike, hasZone, hasSplit, splitter, multipliers } = config;

//   const rsp = Array(15).fill(0);
//   coins.forEach((c) => { rsp[c.position] = c.colorCode; });

//   const sorted = [...coins].sort((a, b) => a.position - b.position);

//   // landedCoinsInBonusBoost — one entry per copy (like SplitFeature)
//   const landedCoins: any[][] = [];
//   sorted.forEach((c) => {
//     const totalCopies = hasSplit ? (c.splitCount ?? 1) : 1;
//     for (let copyIdx = 0; copyIdx < totalCopies; copyIdx++) {
//       const val = c.splitCopyValues?.[copyIdx] ?? c.value;
//       const entry: any[] = [c.position, c.colorCode, val];
//       if (hasStrike && c.winged) entry.push("winged");
//       entry.push(copyIdx); // 0-based copy index always present
//       landedCoins.push(entry);
//     }
//   });

//   // boostValues
//   const boostValues = Array(15).fill(0);
//   let hasBoost = false;
//   if (hasStrike) {
//     coins.forEach((c) => {
//       if (c.winged && c.boostValue !== undefined && c.boostValue !== "") {
//         const n = Number(c.boostValue);
//         boostValues[c.position] = isNaN(n) ? c.boostValue : n;
//         if (n !== 0) hasBoost = true;
//       }
//     });
//   }

//   // numberOfSplitCoins
//   const numberOfSplitCoins = Array(15).fill(0);
//   let hasSplitCoins = false;
//   if (hasSplit) {
//     coins.forEach((c) => {
//       if ((c.splitCount ?? 1) > 1) {
//         numberOfSplitCoins[c.position] = c.splitCount!;
//         hasSplitCoins = true;
//       }
//     });
//   }

//   // splitCoinsBoostValues
//   const splitBoostArrays: (number | string)[][] = [Array(15).fill(0), Array(15).fill(0), Array(15).fill(0)];
//   let hasSplitBoost = false;
//   if (hasStrike && hasSplit) {
//     coins.forEach((c) => {
//       if (c.winged && (c.splitCount ?? 1) > 1 && c.splitBoostValues) {
//         c.splitBoostValues.forEach((bv, idx) => {
//           if (bv !== undefined && bv !== "") {
//             const n = Number(bv);
//             splitBoostArrays[idx][c.position] = isNaN(n) ? bv : n;
//             if (n !== 0) hasSplitBoost = true;
//           }
//         });
//       }
//     });
//   }

//   // additionalFeatureTriggered — collect all upgrade features across all upgraded coins
//   const additionalFeatures = new Set<string>();
//   coins.forEach((c) => {
//     if (!c.upgraded) return;
//     const label = coinColorOptions.find((o) => o.value === c.colorCode)?.label ?? "";
//     const upgradeType = getUpgradeFeature(label);
//     if (upgradeType === "all") {
//       (c.upgradeFeatures ?? []).forEach((f) => additionalFeatures.add(f));
//     } else if (upgradeType) {
//       additionalFeatures.add(upgradeType);
//     }
//   });

//   let out = `[reelStopPositions: [${rsp.join(",")}]`;

//   if (landedCoins.length > 0)
//     out += `,landedCoinsInBonusBoost: [${landedCoins.map((r) => `[${r.join(",")}]`).join(",")}]`;

//   if (hasBoost)
//     out += `,boostValues: [${boostValues.join(",")}]`;

//   if (hasSplitCoins)
//     out += `,numberOfSplitCoins: [${numberOfSplitCoins.join(",")}]`;

//   if (hasSplitBoost) {
//     const maxExtra = Math.max(...coins.filter((c) => c.winged && hasSplit).map((c) => (c.splitCount ?? 1) - 1), 0);
//     out += `,splitCoinsBoostValues: [${splitBoostArrays.slice(0, maxExtra).map((a) => `[${a.join(",")}]`).join(",")}]`;
//   }

//   if (hasZone && splitter)                              out += `,zoneSplitter: ${splitter}`;
//   if (hasZone && multipliers && multipliers.length > 0) out += `,zoneMultipliers: [${multipliers.join(",")}]`;

//   if (additionalFeatures.size > 0)
//     out += `,additionalFeatureTriggered: [${[...additionalFeatures].join(",")}]`;

//   out += `]`;
//   return out;
// }


//! working
/* eslint-disable @typescript-eslint/no-explicit-any */

// export type CoinColorOption = { label: string; value: number };

// // ── Upgrade helpers ───────────────────────────────────────────────────────────
// export const COLOR_UPGRADE_MAP: Record<string, string> = {
//   orange: "strike",
//   blue:   "zone",
//   green:  "extra",
//   cerise: "split",
//   pink:   "split",
// };
// export const ALL_COLOR_UPGRADE_FEATURES = ["strike", "zone", "extra", "split"];

// /**
//  * Returns:
//  *   "gold"    → no upgrade
//  *   "all"     → all-color; user picks subset
//  *   "strike" | "zone" | "extra" | "split" → single upgrade target
//  *   null      → unknown / no upgrade
//  */
// export function getUpgradeType(label: string): string | null {
//   const l = label.toLowerCase();
//   if (l.includes("gold"))                                      return "gold";
//   if (l.includes("all-color") || l.includes("all color"))     return "all";
//   for (const [key, feat] of Object.entries(COLOR_UPGRADE_MAP)) {
//     if (l.includes(key)) return feat;
//   }
//   return null;
// }

// // ── Coin color tables ─────────────────────────────────────────────────────────
// export const COMBO_COIN_COLORS: Record<string, CoinColorOption[]> = {
//   "extra+zone":        [{ label:"Orange (4)", value:4 }, { label:"Cerise (9)", value:9 }, { label:"All-Color (14)", value:14 }, { label:"Gold (19)", value:19 }],
//   "extra+split":       [{ label:"Green (4)", value:4 }, { label:"Blue (9)", value:9 }, { label:"Orange (14)", value:14 }, { label:"Cerise (19)", value:19 }],
//   "extra+strike":      [{ label:"Blue (4)", value:4 }, { label:"Cerise (9)", value:9 }, { label:"All-Color (14)", value:14 }, { label:"Gold (19)", value:19 }],
//   "split+zone":        [{ label:"Orange (4)", value:4 }, { label:"Blue (9)", value:9 }, { label:"All-Color (14)", value:14 }, { label:"Gold (19)", value:19 }],
//   "split+strike":      [{ label:"Blue (4)", value:4 }, { label:"Green (9)", value:9 }, { label:"All-Color (14)", value:14 }, { label:"Gold (19)", value:19 }],
//   "split+extra":       [{ label:"Orange (4)", value:4 }, { label:"Blue (9)", value:9 }, { label:"All-Color (14)", value:14 }, { label:"Gold (19)", value:19 }],
//   "strike+zone":       [{ label:"Cerise (4)", value:4 }, { label:"Green (9)", value:9 }, { label:"All-Color (14)", value:14 }, { label:"Gold (19)", value:19 }],
//   "extra+split+zone":  [{ label:"Orange (4)", value:4 }, { label:"All-Color (9)", value:9 }, { label:"Gold (14)", value:14 }, { label:"Gold (19)", value:19 }],
//   "extra+split+strike":[{ label:"Blue (4)", value:4 }, { label:"All-Color (9)", value:9 }, { label:"Gold (14)", value:14 }, { label:"Gold (19)", value:19 }],
//   "extra+strike+zone": [{ label:"Cerise (4)", value:4 }, { label:"All-Color (9)", value:9 }, { label:"Gold (14)", value:14 }, { label:"Gold (19)", value:19 }],
//   "split+strike+zone": [{ label:"Green (4)", value:4 }, { label:"All-Color (9)", value:9 }, { label:"Gold (14)", value:14 }, { label:"Gold (19)", value:19 }],
//   "extra+split+strike+zone":[{ label:"Green (4)", value:4 }, { label:"Blue (9)", value:9 }, { label:"Orange (14)", value:14 }, { label:"Cerise (19)", value:19 }],
// };

// export const COMBO_SCAT_SEED_COLOR: Record<string, Record<string, number>> = {
//   "extra+zone":         { green:4, blue:9, orange:14, cerise:19, all:4  },
//   "extra+split":        { green:4, blue:9, orange:14, cerise:19, all:19 },
//   "extra+strike":       { green:4, blue:9, orange:14, cerise:19, all:14 },
//   "split+zone":         { green:4, blue:9, orange:14, cerise:19, all:19 },
//   "split+strike":       { green:4, blue:9, orange:14, cerise:19, all:19 },
//   "strike+zone":        { green:4, blue:9, orange:14, cerise:19, all:14 },
//   "extra+split+zone":   { green:4, blue:9, orange:14, cerise:19, all:19 },
//   "extra+split+strike": { green:4, blue:9, orange:14, cerise:19, all:19 },
//   "extra+strike+zone":  { green:4, blue:9, orange:14, cerise:19, all:14 },
//   "split+strike+zone":  { green:4, blue:9, orange:14, cerise:19, all:19 },
//   "extra+split+strike+zone": { green:4, blue:9, orange:14, cerise:19, all:19 },
// };

// // ── Types ─────────────────────────────────────────────────────────────────────
// export type ComboCoin = {
//   position:          number;
//   colorCode:         number;
//   value:             string;
//   winged?:           boolean;
//   boostValue?:       string;
//   splitCount?:       number;
//   splitCopyValues?:  string[];   // per-copy value; [copyIdx]
//   splitBoostValues?: string[];   // strike+split extra copy boosts
//   upgraded?:         boolean;
//   upgradeFeatures?:  string[];
//   fromBase?:         boolean;
// };

// export type ComboFeatureConfig = {
//   features:      string[];
//   hasExtra:      boolean;
//   hasZone:       boolean;
//   hasStrike:     boolean;
//   hasSplit:      boolean;
//   splitter?:     number;
//   multipliers?:  number[];
// };

// // ── Helpers ───────────────────────────────────────────────────────────────────
// export function getComboKey(features: string[]): string {
//   return [...features].sort().join("+");
// }

// export function getComboCoinColors(features: string[]): CoinColorOption[] {
//   const key = getComboKey(features);
//   return COMBO_COIN_COLORS[key] ?? [
//     { label:"Green (4)", value:4 }, { label:"Blue (9)", value:9 },
//     { label:"Orange (14)", value:14 }, { label:"Cerise (19)", value:19 },
//   ];
// }

// export function getComboScatSeedColor(features: string[], scatKey: string): number {
//   const key = getComboKey(features);
//   return COMBO_SCAT_SEED_COLOR[key]?.[scatKey] ?? 4;
// }

// export function getComboMaxSpins(config: ComboFeatureConfig, upgradedFeatures: string[] = []): number {
//   return config.hasExtra || upgradedFeatures.includes("extra") ? 4 : 3;
// }

// // ── Output generator ──────────────────────────────────────────────────────────
// export function generateCombinationGaffe(
//   coins: ComboCoin[],
//   config: ComboFeatureConfig,
//   upgradedZoneSplitter?: number,
//   upgradedZoneMultipliers?: number[]
// ): string {
//   const allUpgraded = new Set(coins.flatMap((c) => (c.upgraded ? (c.upgradeFeatures ?? []) : [])));
//   const effStrike = config.hasStrike || allUpgraded.has("strike");
//   const effZone   = config.hasZone   || allUpgraded.has("zone");
//   const effSplit  = config.hasSplit  || allUpgraded.has("split");

//   const rsp = Array(15).fill(0);
//   coins.forEach((c) => { rsp[c.position] = c.colorCode; });

//   const sorted = [...coins].sort((a, b) => a.position - b.position);

//   // landedCoinsInBonusBoost — one entry per copy (0-based copyIdx)
//   const landedCoins: any[][] = [];
//   sorted.forEach((c) => {
//     const copies = effSplit ? (c.splitCount ?? 1) : 1;
//     for (let ci = 0; ci < copies; ci++) {
//       const val = c.splitCopyValues?.[ci] ?? c.value;
//       const entry: any[] = [c.position, c.colorCode, val];
//       if (effStrike && c.winged) entry.push("winged");
//       entry.push(ci);
//       landedCoins.push(entry);
//     }
//   });

//   // boostValues
//   const boostValues = Array(15).fill(0);
//   let hasBoost = false;
//   if (effStrike) {
//     coins.forEach((c) => {
//       if (c.winged && c.boostValue) {
//         const n = Number(c.boostValue);
//         boostValues[c.position] = isNaN(n) ? c.boostValue : n;
//         if (n !== 0) hasBoost = true;
//       }
//     });
//   }

//   // numberOfSplitCoins
//   const numSplit = Array(15).fill(0);
//   let hasSplitCoins = false;
//   if (effSplit) {
//     coins.forEach((c) => {
//       if ((c.splitCount ?? 1) > 1) { numSplit[c.position] = c.splitCount!; hasSplitCoins = true; }
//     });
//   }

//   // splitCoinsBoostValues
//   const splitBoostArrays: (number | string)[][] = [Array(15).fill(0), Array(15).fill(0), Array(15).fill(0)];
//   let hasSplitBoost = false;
//   if (effStrike && effSplit) {
//     coins.forEach((c) => {
//       if (c.winged && (c.splitCount ?? 1) > 1 && c.splitBoostValues) {
//         c.splitBoostValues.forEach((bv, idx) => {
//           if (bv !== undefined && bv !== "") {
//             const n = Number(bv);
//             splitBoostArrays[idx][c.position] = isNaN(n) ? bv : n;
//             if (n !== 0) hasSplitBoost = true;
//           }
//         });
//       }
//     });
//   }

//   // Zone
//   const effSplitter    = effZone ? (upgradedZoneSplitter    ?? config.splitter)    : undefined;
//   const effMultipliers = effZone ? (upgradedZoneMultipliers ?? config.multipliers) : undefined;

//   const additional = [...allUpgraded];

//   let out = `[reelStopPositions: [${rsp.join(",")}]`;
//   if (landedCoins.length > 0)
//     out += `,landedCoinsInBonusBoost: [${landedCoins.map((r) => `[${r.join(",")}]`).join(",")}]`;
//   if (hasBoost)
//     out += `,boostValues: [${boostValues.join(",")}]`;
//   if (hasSplitCoins)
//     out += `,numberOfSplitCoins: [${numSplit.join(",")}]`;
//   if (hasSplitBoost) {
//     const maxExtra = Math.max(...coins.filter((c) => c.winged && effSplit).map((c) => (c.splitCount ?? 1) - 1), 0);
//     out += `,splitCoinsBoostValues: [${splitBoostArrays.slice(0, maxExtra).map((a) => `[${a.join(",")}]`).join(",")}]`;
//   }
//   if (effZone && effSplitter)
//     out += `,zoneSplitter: ${effSplitter}`;
//   if (effZone && effMultipliers && effMultipliers.length > 0)
//     out += `,zoneMultipliers: [${effMultipliers.join(",")}]`;
//   if (additional.length > 0)
//     out += `,additionalFeatureTriggered: [${additional.join(",")}]`;
//   out += `]`;
//   return out;
// }






/* eslint-disable @typescript-eslint/no-explicit-any */

export type CoinColorOption = { label: string; value: number };

// ── All upgradeable features in this game ─────────────────────────────────────
export const ALL_UPGRADE_FEATURES = ["STRIKE", "ZONE", "EXTRA", "SPLIT"];

// ── Coin color tables ─────────────────────────────────────────────────────────
export const COMBO_COIN_COLORS: Record<string, CoinColorOption[]> = {
  "extra+zone":        [{ label:"Orange (4)", value:4 }, { label:"Cerise (9)", value:9 }, { label:"All-Color (14)", value:14 }, { label:"gold (19)", value:19 }],
  "extra+split":       [{ label:"Green (4)", value:4 }, { label:"Blue (9)", value:9 }, { label:"Orange (14)", value:14 }, { label:"Cerise (19)", value:19 }],
  "extra+strike":      [{ label:"Blue (4)", value:4 }, { label:"Cerise (9)", value:9 }, { label:"All-Color (14)", value:14 }, { label:"gold (19)", value:19 }],
  "split+zone":        [{ label:"Orange (4)", value:4 }, { label:"Blue (9)", value:9 }, { label:"All-Color (14)", value:14 }, { label:"gold (19)", value:19 }],
  "split+strike":      [{ label:"Blue (4)", value:4 }, { label:"Green (9)", value:9 }, { label:"All-Color (14)", value:14 }, { label:"gold (19)", value:19 }],
  "split+extra":       [{ label:"Orange (4)", value:4 }, { label:"Blue (9)", value:9 }, { label:"All-Color (14)", value:14 }, { label:"gold (19)", value:19 }],
  "strike+zone":       [{ label:"Cerise (4)", value:4 }, { label:"Green (9)", value:9 }, { label:"All-Color (14)", value:14 }, { label:"gold (19)", value:19 }],
  "extra+split+zone":  [{ label:"Orange (4)", value:4 }, { label:"All-Color (9)", value:9 }, { label:"gold (14)", value:14 }, { label:"gold (19)", value:19 }],
  "extra+split+strike":[{ label:"Blue (4)", value:4 }, { label:"All-Color (9)", value:9 }, { label:"gold (14)", value:14 }, { label:"gold (19)", value:19 }],
  "extra+strike+zone": [{ label:"Cerise (4)", value:4 }, { label:"All-Color (9)", value:9 }, { label:"gold (14)", value:14 }, { label:"gold (19)", value:19 }],
  "split+strike+zone": [{ label:"Green (4)", value:4 }, { label:"All-Color (9)", value:9 }, { label:"gold (14)", value:14 }, { label:"gold (19)", value:19 }],
  "extra+split+strike+zone":[{ label:"Green (4)", value:4 }, { label:"Blue (9)", value:9 }, { label:"Orange (14)", value:14 }, { label:"Cerise (19)", value:19 }],
};

export const COMBO_SCAT_SEED_COLOR: Record<string, Record<string, number>> = {
  "extra+zone":         { green:4, blue:9, orange:14, cerise:19, all:4  },
  "extra+split":        { green:4, blue:9, orange:14, cerise:19, all:19 },
  "extra+strike":       { green:4, blue:9, orange:14, cerise:19, all:14 },
  "split+zone":         { green:4, blue:9, orange:14, cerise:19, all:19 },
  "split+strike":       { green:4, blue:9, orange:14, cerise:19, all:19 },
  "strike+zone":        { green:4, blue:9, orange:14, cerise:19, all:14 },
  "extra+split+zone":   { green:4, blue:9, orange:14, cerise:19, all:19 },
  "extra+split+strike": { green:4, blue:9, orange:14, cerise:19, all:19 },
  "extra+strike+zone":  { green:4, blue:9, orange:14, cerise:19, all:14 },
  "split+strike+zone":  { green:4, blue:9, orange:14, cerise:19, all:19 },
  "extra+split+strike+zone": { green:4, blue:9, orange:14, cerise:19, all:19 },
};

// ── Types ─────────────────────────────────────────────────────────────────────
export type ComboCoin = {
  position:          number;
  colorCode:         number;
  value:             string;
  winged?:           boolean;      // legacy: seeded from base strike data
  boostValue?:       string;       // legacy: kept for compat
  splitCount?:       number;
  splitCopyValues?:  string[];     // per-copy value; [copyIndex] (0-based)
  // Which copy (0-based) is the winged one in Strike+Split combo. undefined = none.
  wingedCopyIdx?:    number;
  // boost values indexed by copyIdx (0=copy0, 1=copy1, etc.)
  splitBoostValues?: string[];
  fromBase?:         boolean;
};

export type ComboFeatureConfig = {
  features:      string[];
  hasExtra:      boolean;
  hasZone:       boolean;
  hasStrike:     boolean;
  hasSplit:      boolean;
  splitter?:     number;
  multipliers?:  number[];
};

export type UpgradeInfo = {
  col:              number;
  row:              number;
  features:         string[];   // e.g. ["ZONE"] or ["STRIKE", "EXTRA"]
  zoneSplitter?:    number;
  zoneMultipliers?: number[];
};

// ── resolveUpgradeFeatures ────────────────────────────────────────────────────
// Given a coin color label from the Ignite Purple palette, returns the
// UPPERCASE feature name(s) that coin can upgrade to.
// Returns [] for gold (no upgrade).
// Caller handles all-color coins separately (isAllColor check).
const LABEL_KEYWORD_MAP: Record<string, string> = {
  orange: "STRIKE",
  blue:   "ZONE",
  green:  "EXTRA",
  cerise: "SPLIT",
};

export function resolveUpgradeFeatures(colorLabel: string): string[] {
  const l = colorLabel.toLowerCase();
  if (l.includes("gold"))                                      return [];
  if (l.includes("all-color") || l.includes("all color"))     return []; // handled via isAllColor
  for (const [key, feat] of Object.entries(LABEL_KEYWORD_MAP)) {
    if (l.includes(key)) return [feat];
  }
  return [];
}

// ── Helpers ───────────────────────────────────────────────────────────────────
export function getComboKey(features: string[]): string {
  return [...features].sort().join("+");
}

export function getComboCoinColors(features: string[]): CoinColorOption[] {
  const key = getComboKey(features);
  return COMBO_COIN_COLORS[key] ?? [
    { label:"Green (4)", value:4 }, { label:"Blue (9)", value:9 },
    { label:"Orange (14)", value:14 }, { label:"Cerise (19)", value:19 },
  ];
}

export function getComboScatSeedColor(features: string[], scatKey: string): number {
  const key = getComboKey(features);
  return COMBO_SCAT_SEED_COLOR[key]?.[scatKey] ?? 4;
}

export function getComboMaxSpins(config: ComboFeatureConfig): number {
  return config.hasExtra ? 4 : 3;
}

// ── Output generator ──────────────────────────────────────────────────────────
export function generateCombinationGaffe(
  coins: ComboCoin[],
  config: ComboFeatureConfig,
  upgrade: UpgradeInfo | null = null
): string {
  const { hasStrike, hasZone, hasSplit, splitter, multipliers } = config;

  const rsp = Array(15).fill(0);
  coins.forEach((c) => { rsp[c.position] = c.colorCode; });

  const sorted = [...coins].sort((a, b) => a.position - b.position);

  // One entry per copy: [pos, colorCode, copyValue, "winged"(only on the specific winged copy), copyIndex(only when Split)]
  const landedCoins: any[][] = [];
  sorted.forEach((c) => {
    const copies = hasSplit ? (c.splitCount ?? 1) : 1;
    const wci = c.wingedCopyIdx;
    for (let ci = 0; ci < copies; ci++) {
      const val = c.splitCopyValues?.[ci] ?? c.value;
      const entry: any[] = [c.position, c.colorCode, val];
      if (hasStrike && wci !== undefined && ci === wci) entry.push("winged");
      if (hasSplit) entry.push(ci);   // copyIndex only needed when there are multiple copies
      landedCoins.push(entry);
    }
  });

  // boostValues — only when the winged copy is copy 0
  const boostValues = Array(15).fill(0);
  let hasBoost = false;
  if (hasStrike) {
    coins.forEach((c) => {
      if (c.wingedCopyIdx === 0) {
        const bv = c.splitBoostValues?.[0] ?? c.boostValue ?? "";
        if (bv !== "") {
          const n = Number(bv);
          boostValues[c.position] = isNaN(n) ? bv : n;
          if (n !== 0) hasBoost = true;
        }
      }
    });
  }

  const numSplit = Array(15).fill(0);
  let hasSplitCoins = false;
  if (hasSplit) {
    coins.forEach((c) => {
      if (c.splitCount && c.splitCount > 1) {
        numSplit[c.position] = c.splitCount; hasSplitCoins = true;
      }
    });
  }

  // splitCoinsBoostValues — 3 arrays for extra copy slots (copyIdx 1, 2, 3)
  // boost goes into array[wingedCopyIdx-1][pos] when the winged copy is an extra copy
  const splitBoostArrays: (number | string)[][] = [
    Array(15).fill(0), Array(15).fill(0), Array(15).fill(0),
  ];
  let hasSplitBoost = false;
  if (hasStrike && hasSplit) {
    coins.forEach((c) => {
      const wci = c.wingedCopyIdx;
      if (wci !== undefined && wci >= 1 && c.splitCount && c.splitCount > wci) {
        const bv = c.splitBoostValues?.[wci] ?? "";
        if (bv !== "") {
          const n = Number(bv);
          splitBoostArrays[wci - 1][c.position] = isNaN(n) ? bv : n;
          if (n !== 0) hasSplitBoost = true;
        }
      }
    });
  }

  const effSplitter    = upgrade?.zoneSplitter    ?? splitter;
  const effMultipliers = upgrade?.zoneMultipliers ?? multipliers;

  let out = `[reelStopPositions: [${rsp.join(",")}]`;
  if (landedCoins.length > 0)
    out += `,landedCoinsInBonusBoost: [${landedCoins.map((r: any[]) => `[${r.join(",")}]`).join(",")}]`;
  if (hasBoost)
    out += `,boostValues: [${boostValues.join(",")}]`;
  if (hasSplitCoins)
    out += `,numberOfSplitCoins: [${numSplit.join(",")}]`;
  if (hasSplitBoost) {
    const maxWci = Math.max(...coins
      .filter((c) => c.wingedCopyIdx !== undefined && (c.wingedCopyIdx ?? 0) >= 1)
      .map((c) => c.wingedCopyIdx!), 0);
    out += `,splitCoinsBoostValues: [${splitBoostArrays.slice(0, maxWci).map((a) => `[${a.join(",")}]`).join(",")}]`;
  }
  if (hasZone && effSplitter)
    out += `,zoneSplitter: ${effSplitter}`;
  if (hasZone && effMultipliers && effMultipliers.length > 0)
    out += `,zoneMultipliers: [${effMultipliers.join(",")}]`;
  if (upgrade) {
    out += `,upgradeCoinPosition: [${upgrade.col},${upgrade.row}]`;
    if (upgrade.features.length > 0)
      out += `,additionalFeatureTriggered: [${upgrade.features.map((f) => f.toLowerCase()).join(",")}]`;
    if (upgrade.zoneSplitter)
      out += `,upgradeZoneSplitter: ${upgrade.zoneSplitter}`;
    if (upgrade.zoneMultipliers && upgrade.zoneMultipliers.length > 0)
      out += `,upgradeZoneMultipliers: [${upgrade.zoneMultipliers.join(",")}]`;
  }
  out += `]`;
  return out;
}