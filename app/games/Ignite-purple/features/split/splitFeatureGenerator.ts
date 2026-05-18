



// /* eslint-disable @typescript-eslint/no-explicit-any */

// export const SPLIT_COIN_COLORS = [
//   { label: "All-Color (19)", value: 19 },
//   { label: "Orange (4)",     value: 4  },
//   { label: "Blue (9)",       value: 9  },
//   { label: "Green (14)",     value: 14 },
// ];

// export const SPLIT_COIN_VALUES   = ["1", "2", "5", "Minor", "Major", "Mini"];
// export const SPLIT_BOOST_VALUES  = ["0", "0.5", "1", "2", "5"];
// export const SPLIT_COUNT_OPTIONS = [1, 2, 3, 4];

// // Features this game supports (used in upgrade panel)
// export const SPLIT_ALL_UPGRADE_FEATURES = ["STRIKE", "ZONE", "EXTRA"];
// const ZONE_SPLITTER_OPTIONS_SPLIT = [1, 2, 3, 4, 5];

// // ── resolveUpgradeForSplit ────────────────────────────────────────────────────
// // Given a coin colorCode in the Split palette, return uppercase feature or null.
// //   19 (All-Color) → "ALL"   — handled separately in UI
// //    4 (Orange)    → "STRIKE"
// //    9 (Blue)      → "ZONE"
// //   14 (Green)     → "EXTRA"
// export function resolveUpgradeForSplit(colorCode: number): string | null {
//   switch (colorCode) {
//     case 19: return "ALL";
//     case  4: return "STRIKE";
//     case  9: return "ZONE";
//     case 14: return "EXTRA";
//     default: return null;
//   }
// }

// export type UpgradeInfoSplit = {
//   pos:              number;
//   features:         string[];   // UPPERCASE, e.g. ["ZONE"]
//   zoneSplitter?:    number;
//   zoneMultipliers?: number[];
// };

// export type SplitFeatureCoin = {
//   position:          number;
//   colorCode:         number;
//   value:             string;       // fallback value (copy 0 default)
//   splitCount:        number;
//   splitCopyValues?:  string[];     // per-copy value overrides; index = copyIndex (0-based)
//   // Strike+Split: which copy (0-based) is the winged one. undefined = none winged.
//   wingedCopyIdx?:    number;
//   // boost values indexed by copyIdx (same index as the copy that is winged)
//   splitBoostValues?: string[];
//   // legacy: kept for type compat when seeding from base-game strike data
//   winged?:           boolean;
//   boostValue?:       string;
//   fromBase?:         boolean;
// };

// // ── Generators ────────────────────────────────────────────────────────────────

// export function generateSplitFeatureGaffe(
//   coins: SplitFeatureCoin[],
//   upgrade?: UpgradeInfoSplit | null
// ): string {
//   const rsp = Array(15).fill(0);
//   coins.forEach((c) => { rsp[c.position] = c.colorCode; });

//   const sorted = [...coins].sort((a, b) => a.position - b.position);

//   // One entry per copy: [pos, colorCode, copyValue, copyIndex]
//   const landedCoins: any[][] = [];
//   sorted.forEach((c) => {
//     for (let ci = 0; ci < c.splitCount; ci++) {
//       const val = c.splitCopyValues?.[ci] ?? c.value;
//       landedCoins.push([c.position, c.colorCode, val, ci]);
//     }
//   });

//   const numSplit = Array(15).fill(0);
//   coins.forEach((c) => { numSplit[c.position] = c.splitCount; });
//   const hasSplit = coins.some((c) => c.splitCount > 1);

//   let result = `[reelStopPositions: [${rsp.join(",")}]`;
//   if (landedCoins.length > 0)
//     result += `, landedCoinsInBonusBoost: [${landedCoins.map((c: any) => `[${c.join(",")}]`).join(", ")}]`;
//   if (hasSplit)
//     result += `, numberOfSplitCoins: [${numSplit.join(",")}]`;
//   if (upgrade && upgrade.features.length > 0) {
//     result += `, upgradeCoinPosition: ${upgrade.pos}`;
//     result += `, additionalFeatureTriggered: [${upgrade.features.map((f) => f.toLowerCase()).join(",")}]`;
//     if (upgrade.zoneSplitter)
//       result += `, upgradeZoneSplitter: ${upgrade.zoneSplitter}`;
//     if (upgrade.zoneMultipliers && upgrade.zoneMultipliers.length > 0)
//       result += `, upgradeZoneMultipliers: [${upgrade.zoneMultipliers.join(",")}]`;
//   }
//   result += `]`;
//   return result;
// }

// export function generateSplitStrikeGaffe(
//   coins: SplitFeatureCoin[],
//   upgrade?: UpgradeInfoSplit | null
// ): string {
//   const rsp = Array(15).fill(0);
//   coins.forEach((c) => { rsp[c.position] = c.colorCode; });

//   const sorted = [...coins].sort((a, b) => a.position - b.position);

//   // One entry per copy: [pos, colorCode, copyValue, "winged"(only on the winged copy), copyIndex]
//   const landedCoins: any[][] = [];
//   sorted.forEach((c) => {
//     const wci = c.wingedCopyIdx;   // which copy is winged (undefined = none)
//     for (let ci = 0; ci < c.splitCount; ci++) {
//       const val = c.splitCopyValues?.[ci] ?? c.value;
//       const entry: any[] = [c.position, c.colorCode, val];
//       if (wci !== undefined && ci === wci) entry.push("winged");
//       entry.push(ci);
//       landedCoins.push(entry);
//     }
//   });

//   // boostValues — only when the WINGED copy is copy 0
//   const boostValues = Array(15).fill(0);
//   let hasBoost = false;
//   coins.forEach((c) => {
//     if (c.wingedCopyIdx === 0) {
//       const bv = c.splitBoostValues?.[0] ?? "";
//       if (bv !== "") {
//         const n = Number(bv);
//         boostValues[c.position] = isNaN(n) ? bv : n;
//         if (n !== 0) hasBoost = true;
//       }
//     }
//   });

//   const numSplit = Array(15).fill(0);
//   coins.forEach((c) => { numSplit[c.position] = c.splitCount; });
//   const hasSplit = coins.some((c) => c.splitCount > 1);

//   // splitCoinsBoostValues — 3 arrays, one per extra copy slot (copyIdx 1, 2, 3)
//   // Each array is 15-slot. Entry = boost value of the winged copy IF it is that extra copy.
//   // e.g. if wingedCopyIdx=1, boost goes into splitBoostArrays[0][pos]
//   //      if wingedCopyIdx=2, boost goes into splitBoostArrays[1][pos]
//   //      if wingedCopyIdx=3, boost goes into splitBoostArrays[2][pos]
//   const splitBoostArrays: (number | string)[][] = [
//     Array(15).fill(0), Array(15).fill(0), Array(15).fill(0),
//   ];
//   let hasSplitBoost = false;
//   coins.forEach((c) => {
//     const wci = c.wingedCopyIdx;
//     if (wci !== undefined && wci >= 1 && c.splitCount > wci) {
//       const bv = c.splitBoostValues?.[wci] ?? "";
//       if (bv !== "") {
//         const n = Number(bv);
//         splitBoostArrays[wci - 1][c.position] = isNaN(n) ? bv : n;
//         if (n !== 0) hasSplitBoost = true;
//       }
//     }
//   });

//   let result = `[reelStopPositions: [${rsp.join(",")}]`;
//   if (landedCoins.length > 0)
//     result += `, landedCoinsInBonusBoost: [${landedCoins.map((c: any) => `[${c.join(",")}]`).join(",")}]`;
//   if (hasBoost)
//     result += `, boostValues: [${boostValues.join(",")}]`;
//   if (hasSplit)
//     result += `, numberOfSplitCoins: [${numSplit.join(",")}]`;
//   if (hasSplitBoost) {
//     const maxExtra = Math.max(...coins.filter((c) => c.wingedCopyIdx !== undefined && (c.wingedCopyIdx ?? 0) >= 1)
//       .map((c) => c.wingedCopyIdx!), 0);
//     result += `, splitCoinsBoostValues: [${splitBoostArrays.slice(0, maxExtra).map((a) => `[${a.join(",")}]`).join(",")}]`;
//   }
//   if (upgrade && upgrade.features.length > 0) {
//     result += `, upgradeCoinPosition: ${upgrade.pos}`;
//     result += `, additionalFeatureTriggered: [${upgrade.features.map((f) => f.toLowerCase()).join(",")}]`;
//     if (upgrade.zoneSplitter)
//       result += `, upgradeZoneSplitter: ${upgrade.zoneSplitter}`;
//     if (upgrade.zoneMultipliers && upgrade.zoneMultipliers.length > 0)
//       result += `, upgradeZoneMultipliers: [${upgrade.zoneMultipliers.join(",")}]`;
//   }
//   result += `]`;
//   return result;
// }

// // Re-export for convenience
// export { ZONE_SPLITTER_OPTIONS_SPLIT };



//!multiple winged coin in split
/* eslint-disable @typescript-eslint/no-explicit-any */

export const SPLIT_COIN_COLORS = [
  { label: "All-Color (19)", value: 19 },
  { label: "Orange (4)",     value: 4  },
  { label: "Blue (9)",       value: 9  },
  { label: "Green (14)",     value: 14 },
];

export const SPLIT_COIN_VALUES   = ["1", "2", "5", "Minor", "Major", "Mini"];
export const SPLIT_BOOST_VALUES  = ["0", "0.5", "1", "2", "5"];
export const SPLIT_COUNT_OPTIONS = [1, 2, 3, 4];

// Features this game supports (used in upgrade panel)
export const SPLIT_ALL_UPGRADE_FEATURES = ["STRIKE", "ZONE", "EXTRA"];
const ZONE_SPLITTER_OPTIONS_SPLIT = [1, 2, 3, 4, 5];

// ── resolveUpgradeForSplit ────────────────────────────────────────────────────
export function resolveUpgradeForSplit(colorCode: number): string | null {
  switch (colorCode) {
    case 19: return "ALL";
    case  4: return "STRIKE";
    case  9: return "ZONE";
    case 14: return "EXTRA";
    default: return null;
  }
}

export type UpgradeInfoSplit = {
  pos:              number;
  features:         string[];   // UPPERCASE, e.g. ["ZONE"]
  zoneSplitter?:    number;
  zoneMultipliers?: number[];
};

export type SplitFeatureCoin = {
  position:          number;
  colorCode:         number;
  value:             string;       // fallback value (copy 0 default)
  splitCount:        number;
  splitCopyValues?:  string[];     // per-copy value overrides; index = copyIndex (0-based)
  // Strike+Split: which copies (0-based) are winged. Supports multiple winged copies.
  wingedCopyIdxs?:   number[];
  // boost values indexed by copyIdx
  splitBoostValues?: string[];
  // legacy: kept for type compat when seeding from base-game strike data
  winged?:           boolean;
  boostValue?:       string;
  fromBase?:         boolean;
};

// ── Generators ────────────────────────────────────────────────────────────────

export function generateSplitFeatureGaffe(
  coins: SplitFeatureCoin[],
  upgrade?: UpgradeInfoSplit | null
): string {
  const rsp = Array(15).fill(0);
  coins.forEach((c) => { rsp[c.position] = c.colorCode; });

  const sorted = [...coins].sort((a, b) => a.position - b.position);

  // One entry per copy: [pos, colorCode, copyValue, copyIndex]
  const landedCoins: any[][] = [];
  sorted.forEach((c) => {
    for (let ci = 0; ci < c.splitCount; ci++) {
      const val = c.splitCopyValues?.[ci] ?? c.value;
      landedCoins.push([c.position, c.colorCode, val, ci]);
    }
  });

  const numSplit = Array(15).fill(0);
  coins.forEach((c) => { numSplit[c.position] = c.splitCount; });
  const hasSplit = coins.some((c) => c.splitCount > 1);

  let result = `[reelStopPositions: [${rsp.join(",")}]`;
  if (landedCoins.length > 0)
    result += `, landedCoinsInBonusBoost: [${landedCoins.map((c: any) => `[${c.join(",")}]`).join(", ")}]`;
  if (hasSplit)
    result += `, numberOfSplitCoins: [${numSplit.join(",")}]`;
  if (upgrade && upgrade.features.length > 0) {
    result += `, upgradeCoinPosition: ${upgrade.pos}`;
    result += `, additionalFeatureTriggered: [${upgrade.features.map((f) => f.toLowerCase()).join(",")}]`;
    if (upgrade.zoneSplitter)
      result += `, upgradeZoneSplitter: ${upgrade.zoneSplitter}`;
    if (upgrade.zoneMultipliers && upgrade.zoneMultipliers.length > 0)
      result += `, upgradeZoneMultipliers: [${upgrade.zoneMultipliers.join(",")}]`;
  }
  result += `]`;
  return result;
}

export function generateSplitStrikeGaffe(
  coins: SplitFeatureCoin[],
  upgrade?: UpgradeInfoSplit | null
): string {
  const rsp = Array(15).fill(0);
  coins.forEach((c) => { rsp[c.position] = c.colorCode; });

  const sorted = [...coins].sort((a, b) => a.position - b.position);

  // One entry per copy: [pos, colorCode, copyValue, "winged"(on all winged copies), copyIndex]
  const landedCoins: any[][] = [];
  sorted.forEach((c) => {
    const wcis = c.wingedCopyIdxs ?? [];
    for (let ci = 0; ci < c.splitCount; ci++) {
      const val = c.splitCopyValues?.[ci] ?? c.value;
      const entry: any[] = [c.position, c.colorCode, val];
      if (wcis.includes(ci)) entry.push("winged");
      entry.push(ci);
      landedCoins.push(entry);
    }
  });

  // boostValues — for coins where copy 0 is winged
  const boostValues = Array(15).fill(0);
  let hasBoost = false;
  coins.forEach((c) => {
    if (c.wingedCopyIdxs?.includes(0)) {
      const bv = c.splitBoostValues?.[0] ?? "";
      if (bv !== "") {
        const n = Number(bv);
        boostValues[c.position] = isNaN(n) ? bv : n;
        if (n !== 0) hasBoost = true;
      }
    }
  });

  const numSplit = Array(15).fill(0);
  coins.forEach((c) => { numSplit[c.position] = c.splitCount; });
  const hasSplit = coins.some((c) => c.splitCount > 1);

  // splitCoinsBoostValues — 3 arrays, one per extra copy slot (copyIdx 1, 2, 3)
  // Each array is 15-slot. Entry = boost value of winged extra copies.
  // Supports multiple winged extra copies per coin.
  const splitBoostArrays: (number | string)[][] = [
    Array(15).fill(0), Array(15).fill(0), Array(15).fill(0),
  ];
  let hasSplitBoost = false;
  coins.forEach((c) => {
    const wcis = c.wingedCopyIdxs ?? [];
    wcis.forEach((wci) => {
      if (wci >= 1 && c.splitCount > wci) {
        const bv = c.splitBoostValues?.[wci] ?? "";
        if (bv !== "") {
          const n = Number(bv);
          splitBoostArrays[wci - 1][c.position] = isNaN(n) ? bv : n;
          if (n !== 0) hasSplitBoost = true;
        }
      }
    });
  });

  let result = `[reelStopPositions: [${rsp.join(",")}]`;
  if (landedCoins.length > 0)
    result += `, landedCoinsInBonusBoost: [${landedCoins.map((c: any) => `[${c.join(",")}]`).join(",")}]`;
  if (hasBoost)
    result += `, boostValues: [${boostValues.join(",")}]`;
  if (hasSplit)
    result += `, numberOfSplitCoins: [${numSplit.join(",")}]`;
  if (hasSplitBoost) {
    // Find the highest winged extra copy index across all coins
    const maxExtra = Math.max(
      0,
      ...coins.flatMap((c) => (c.wingedCopyIdxs ?? []).filter((i) => i >= 1))
    );
    result += `, splitCoinsBoostValues: [${splitBoostArrays.slice(0, maxExtra).map((a) => `[${a.join(",")}]`).join(",")}]`;
  }
  if (upgrade && upgrade.features.length > 0) {
    result += `, upgradeCoinPosition: ${upgrade.pos}`;
    result += `, additionalFeatureTriggered: [${upgrade.features.map((f) => f.toLowerCase()).join(",")}]`;
    if (upgrade.zoneSplitter)
      result += `, upgradeZoneSplitter: ${upgrade.zoneSplitter}`;
    if (upgrade.zoneMultipliers && upgrade.zoneMultipliers.length > 0)
      result += `, upgradeZoneMultipliers: [${upgrade.zoneMultipliers.join(",")}]`;
  }
  result += `]`;
  return result;
}

// Re-export for convenience
export { ZONE_SPLITTER_OPTIONS_SPLIT };