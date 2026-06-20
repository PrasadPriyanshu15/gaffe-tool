




// //! multiple winged coin in split

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
//   // Which copies (0-based) are winged in Strike+Split combo. Supports multiple winged copies.
//   wingedCopyIdxs?:   number[];
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

//   // One entry per copy: [pos, colorCode, copyValue, "winged"(on all winged copies), copyIndex(only when Split)]
//   const landedCoins: any[][] = [];
//   sorted.forEach((c) => {
//     const copies = hasSplit ? (c.splitCount ?? 1) : 1;
//     const wcis = c.wingedCopyIdxs ?? [];
//     for (let ci = 0; ci < copies; ci++) {
//       const val = c.splitCopyValues?.[ci] ?? c.value;
//       const entry: any[] = [c.position, c.colorCode, val];
//       if (hasStrike && wcis.includes(ci)) entry.push("winged");
//       if (hasSplit) entry.push(ci);   // copyIndex only needed when there are multiple copies
//       landedCoins.push(entry);
//     }
//   });

//   // boostValues — for coins where copy 0 is among the winged copies
//   const boostValues = Array(15).fill(0);
//   let hasBoost = false;
//   if (hasStrike) {
//     coins.forEach((c) => {
//       if (c.wingedCopyIdxs?.includes(0)) {
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
//   // Supports multiple winged extra copies per coin.
//   const splitBoostArrays: (number | string)[][] = [
//     Array(15).fill(0), Array(15).fill(0), Array(15).fill(0),
//   ];
//   let hasSplitBoost = false;
//   if (hasStrike && hasSplit) {
//     coins.forEach((c) => {
//       const wcis = c.wingedCopyIdxs ?? [];
//       wcis.forEach((wci) => {
//         if (wci >= 1 && c.splitCount && c.splitCount > wci) {
//           const bv = c.splitBoostValues?.[wci] ?? "";
//           if (bv !== "") {
//             const n = Number(bv);
//             splitBoostArrays[wci - 1][c.position] = isNaN(n) ? bv : n;
//             if (n !== 0) hasSplitBoost = true;
//           }
//         }
//       });
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
//     // Find the highest winged extra copy index across all coins
//     const maxWci = Math.max(
//       0,
//       ...coins.flatMap((c) => (c.wingedCopyIdxs ?? []).filter((i) => i >= 1))
//     );
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






//! multiple winged coin in split
 
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
  // Which copies (0-based) are winged in Strike+Split combo. Supports multiple winged copies.
  wingedCopyIdxs?:   number[];
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
 
  // One entry per copy: [pos, colorCode, copyValue, "winged"(only on copy 0, implies all copies winged), copyIndex(only when Split)]
  const landedCoins: any[][] = [];
  sorted.forEach((c) => {
    const copies = hasSplit ? (c.splitCount ?? 1) : 1;
    // Winged is now a single, position-level flag carried on copy 0 — if copy 0
    // is winged, every copy at this position is implicitly winged too, so we
    // only ever tag copy 0 with "winged" in the output.
    const isWinged = hasStrike && (c.wingedCopyIdxs?.includes(0) ?? false);
    for (let ci = 0; ci < copies; ci++) {
      const val = c.splitCopyValues?.[ci] ?? c.value;
      const entry: any[] = [c.position, c.colorCode, val];
      if (ci === 0 && isWinged) entry.push("winged");
      if (hasSplit) entry.push(ci);   // copyIndex only needed when there are multiple copies
      landedCoins.push(entry);
    }
  });
 
  // boostValues — for coins where copy 0 is among the winged copies
  const boostValues = Array(15).fill(0);
  let hasBoost = false;
  if (hasStrike) {
    coins.forEach((c) => {
      if (c.wingedCopyIdxs?.includes(0)) {
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
 
  // splitCoinsBoostValues — one array per extra copy slot (copyIdx 1, 2, 3).
  // Winged is now position-level (copy 0 only): if a coin is winged, ALL of its
  // split copies are implicitly winged, so every extra copy's boost value is
  // included here as long as the coin (copy 0) is winged — regardless of
  // whether the coin came from the base game or was added in this feature.
  const splitBoostArrays: (number | string)[][] = [
    Array(15).fill(0), Array(15).fill(0), Array(15).fill(0),
  ];
  let hasSplitBoost = false;
  let maxExtraCopies = 0;
  if (hasStrike && hasSplit) {
    coins.forEach((c) => {
      const isWinged = c.wingedCopyIdxs?.includes(0) ?? false;
      if (!isWinged) return;
      const copies = c.splitCount ?? 1;
      for (let ci = 1; ci < copies; ci++) {
        const bv = c.splitBoostValues?.[ci] ?? "";
        if (bv !== "") {
          const n = Number(bv);
          splitBoostArrays[ci - 1][c.position] = isNaN(n) ? bv : n;
          if (n !== 0) hasSplitBoost = true;
        }
      }
      if (copies - 1 > maxExtraCopies) maxExtraCopies = copies - 1;
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
    out += `,splitCoinsBoostValues: [${splitBoostArrays.slice(0, maxExtraCopies).map((a) => `[${a.join(",")}]`).join(",")}]`;
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