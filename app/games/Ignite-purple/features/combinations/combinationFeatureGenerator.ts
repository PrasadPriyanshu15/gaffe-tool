// /* eslint-disable @typescript-eslint/no-explicit-any */

// // ─────────────────────────────────────────────────────────────────────────────
// // COIN COLOR CODES PER COMBINATION
// //
// // Each combination has its own set of 4 coin color codes (4, 9, 14, 19 map to
// // game colors but the ORDER / ASSIGNMENT per combination differs).
// // Fill in the correct values once confirmed from the game spec.
// //
// // Key format: sorted feature names joined with "+" e.g. "extra+zone"
// // ─────────────────────────────────────────────────────────────────────────────

// export type CoinColorOption = { label: string; value: number };

// // !! UPDATE THESE VALUES per combination when confirmed !!
// export const COMBO_COIN_COLORS: Record<string, CoinColorOption[]> = {
//   // ── 2-feature combinations ────────────────────────────────────────────────
//   "extra+zone": [
//     { label: "Green (4)",   value: 4  },
//     { label: "Blue (9)",    value: 9  },
//     { label: "Orange (14)", value: 14 },
//     { label: "Cerise (19)", value: 19 },
//   ],
//   "extra+strike": [
//     { label: "Green (4)",   value: 4  },
//     { label: "Blue (9)",    value: 9  },
//     { label: "Orange (14)", value: 14 },
//     { label: "Cerise (19)", value: 19 },
//   ],
//   "strike+zone": [
//     { label: "Green (4)",   value: 4  },
//     { label: "Blue (9)",    value: 9  },
//     { label: "Orange (14)", value: 14 },
//     { label: "Cerise (19)", value: 19 },
//   ],
//   // ── 3-feature combination ─────────────────────────────────────────────────
//   "extra+strike+zone": [
//     { label: "Green (4)",   value: 4  },
//     { label: "Blue (9)",    value: 9  },
//     { label: "Orange (14)", value: 14 },
//     { label: "Cerise (19)", value: 19 },
//   ],
// };

// // ─────────────────────────────────────────────────────────────────────────────
// // Per-combination: what colorCode does a scat type seed as in the feature grid?
// // Key = comboKey, value = map of scatKey → colorCode
// // ─────────────────────────────────────────────────────────────────────────────
// export const COMBO_SCAT_SEED_COLOR: Record<string, Record<string, number>> = {
//   "extra+zone": {
//     green: 4, blue: 9, orange: 14, cerise: 19, all: 4,
//   },
//   "extra+strike": {
//     green: 4, blue: 9, orange: 14, cerise: 19, all: 14,
//   },
//   "strike+zone": {
//     green: 4, blue: 9, orange: 14, cerise: 19, all: 14,
//   },
//   "extra+strike+zone": {
//     green: 4, blue: 9, orange: 14, cerise: 19, all: 14,
//   },
// };

// // ─────────────────────────────────────────────────────────────────────────────
// // TYPES
// // ─────────────────────────────────────────────────────────────────────────────

// export type ComboCoin = {
//   position:   number;    // 0–14, column-major (col*3+row)
//   colorCode:  number;    // one of 4 | 9 | 14 | 19
//   value:      string;
//   winged?:    boolean;   // strike: true = winged coin
//   boostValue?: string;   // strike: boost value for this winged coin
//   fromBase?:  boolean;
// };

// export type ComboFeatureConfig = {
//   features:     string[];  // sorted, e.g. ["extra","zone"]
//   hasExtra:     boolean;
//   hasZone:      boolean;
//   hasStrike:    boolean;
//   splitter?:    number;    // zone splitter (1–7)
//   multipliers?: number[];  // zone multipliers
// };

// // ─────────────────────────────────────────────────────────────────────────────
// // HELPERS
// // ─────────────────────────────────────────────────────────────────────────────

// /** Canonical key for a combination — sorted, joined with "+" */
// export function getComboKey(features: string[]): string {
//   return [...features].sort().join("+");
// }

// /** Coin color options for a given combination */
// export function getComboCoinColors(features: string[]): CoinColorOption[] {
//   const key = getComboKey(features);
//   return (
//     COMBO_COIN_COLORS[key] ?? [
//       { label: "Green (4)",   value: 4  },
//       { label: "Blue (9)",    value: 9  },
//       { label: "Orange (14)", value: 14 },
//       { label: "Cerise (19)", value: 19 },
//     ]
//   );
// }

// /** Default colorCode for a scat type in a given combination */
// export function getComboScatSeedColor(features: string[], scatKey: string): number {
//   const key = getComboKey(features);
//   const map = COMBO_SCAT_SEED_COLOR[key];
//   return map?.[scatKey] ?? 4;
// }

// /** Max spins: 4 if Extra is in the combo, else 3 */
// export function getComboMaxSpins(config: ComboFeatureConfig): number {
//   return config.hasExtra ? 4 : 3;
// }

// // ─────────────────────────────────────────────────────────────────────────────
// // OUTPUT GENERATOR
// // ─────────────────────────────────────────────────────────────────────────────

// /**
//  * Generates the combination feature gaffe output line.
//  * Only includes fields relevant to the active features.
//  *
//  * Format:
//  *   [reelStopPositions:[...], landedCoinsInBonusBoost:[...],
//  *    boostValues:[...]?,      zoneSplitter:N?,  zoneMultipliers:[...]?]
//  */
// export function generateCombinationGaffe(
//   coins: ComboCoin[],
//   config: ComboFeatureConfig
// ): string {
//   const { hasStrike, hasZone, splitter, multipliers } = config;

//   // reelStopPositions — 15 slots, 0 = empty
//   const reelStopPositions = Array(15).fill(0);
//   coins.forEach((c) => { reelStopPositions[c.position] = c.colorCode; });

//   // landedCoinsInBonusBoost — sorted by position ascending
//   const sorted = [...coins].sort((a, b) => a.position - b.position);
//   const landedCoins = sorted.map((c) => {
//     const row: any[] = [c.position, c.colorCode, c.value];
//     if (hasStrike && c.winged) row.push("winged");
//     return row;
//   });

//   // boostValues — 15 slots, only emitted if strike is active and ≥1 non-zero boost exists
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

//   let out = `[reelStopPositions: [${reelStopPositions.join(",")}]`;

//   if (landedCoins.length > 0) {
//     out += `, landedCoinsInBonusBoost: [${landedCoins.map((r) => `[${r.join(",")}]`).join(",")}]`;
//   }

//   if (hasBoost) {
//     out += `, boostValues: [${boostValues.join(",")}]`;
//   }

//   if (hasZone && splitter) {
//     out += `, zoneSplitter: ${splitter}`;
//   }

//   if (hasZone && multipliers && multipliers.length > 0) {
//     out += `, zoneMultipliers: [${multipliers.join(",")}]`;
//   }

//   out += `]`;
//   return out;
// }




/* eslint-disable @typescript-eslint/no-explicit-any */

export type CoinColorOption = { label: string; value: number };

// !! Update values per combination  !!
export const COMBO_COIN_COLORS: Record<string, CoinColorOption[]> = {
  "extra+zone":        [{ label:"Orange (4)", value:4 }, { label:"Cerise (9)", value:9 }, { label:"All-Color (14)", value:14 }, { label:"gold (19)", value:19 }],
  "extra+split":       [{ label:"Green (4)", value:4 }, { label:"Blue (9)", value:9 }, { label:"Orange (14)", value:14 }, { label:"Cerise (19)", value:19 }],
  "extra+strike":      [{ label:"Blue (4)", value:4 }, { label:"Cerise (9)", value:9 }, { label:"All-Color (14)", value:14 }, { label:"gold (19)", value:19 }],
  "split+zone":        [{ label:"Orange (4)", value:4 }, { label:"Blue (9)", value:9 }, { label:"All-Color (14)", value:14 }, { label:"gold (19)", value:19 }],
  "split+strike":      [{ label:"Blue (4)", value:4 }, { label:"Green (9)", value:9 }, { label:"All-Color (14)", value:14 }, { label:"gold (19)", value:19 }],
  "split+extra":      [{ label:"Orange (4)", value:4 }, { label:"Blue (9)", value:9 }, { label:"All-Color (14)", value:14 }, { label:"gold (19)", value:19 }],
  "strike+zone":       [{ label:"Cerise (4)", value:4 }, { label:"Green (9)", value:9 }, { label:"All-Color (14)", value:14 }, { label:"gold (19)", value:19 }],
  "extra+split+zone":  [{ label:"Orange (4)", value:4 }, { label:"All-Color (9)", value:9 }, { label:"gold (14)", value:14 }, { label:"gold (19)", value:19 }],
  "extra+split+strike":[{ label:"Blue (4)", value:4 }, { label:"All-Color (9)", value:9 }, { label:"gold (14)", value:14 }, { label:"gold (19)", value:19 }],
  "extra+strike+zone": [{ label:"Cerise (4)", value:4 }, { label:"All-Color (9)", value:9 }, { label:"gold (14)", value:14 }, { label:"gold (19)", value:19 }],
  "split+strike+zone": [{ label:"Green (4)", value:4 }, { label:"All-Color (9)", value:9 }, { label:"gold (14)", value:14 }, { label:"gold (19)", value:19 }],
  "extra+split+strike+zone":[{ label:"Green (4)", value:4 }, { label:"Blue (9)", value:9 }, { label:"Orange (14)", value:14 }, { label:"Cerise (19)", value:19 }],
};


// colorCode when a scat seeds into a specific combination
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

// ── TYPES ─────────────────────────────────────────────────────────────────────

export type ComboCoin = {
  position:         number;    // 0–14, column-major
  colorCode:        number;
  value:            string;
  winged?:          boolean;   // strike
  boostValue?:      string;    // strike: boost for coin 1 (or the only coin)
  splitCount?:      number;    // split: 1–4
  splitBoostValues?: string[]; // split+strike: boosts for split coins 2/3/4 [idx0=coin2, ...]
  fromBase?:        boolean;
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

// ── HELPERS ───────────────────────────────────────────────────────────────────

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

/** 4 spins if Extra is in combo, else 3 */
export function getComboMaxSpins(config: ComboFeatureConfig): number {
  return config.hasExtra ? 4 : 3;
}

// ── OUTPUT GENERATOR ─────────────────────────────────────────────────────────

export function generateCombinationGaffe(coins: ComboCoin[], config: ComboFeatureConfig): string {
  const { hasStrike, hasZone, hasSplit, splitter, multipliers } = config;

  // reelStopPositions
  const rsp = Array(15).fill(0);
  coins.forEach((c) => { rsp[c.position] = c.colorCode; });

  const sorted = [...coins].sort((a, b) => a.position - b.position);

  // landedCoinsInBonusBoost
  // [pos, colorCode, value, "winged"?, splitCount?]
  const landedCoins = sorted.map((c) => {
    const row: any[] = [c.position, c.colorCode, c.value];
    if (hasStrike && c.winged)             row.push("winged");
    if (hasSplit && c.splitCount && c.splitCount > 1) row.push(c.splitCount);
    return row;
  });

  // boostValues — coin 1 boosts for winged coins
  const boostValues = Array(15).fill(0);
  let hasBoost = false;
  if (hasStrike) {
    coins.forEach((c) => {
      if (c.winged && c.boostValue !== undefined && c.boostValue !== "") {
        const n = Number(c.boostValue);
        boostValues[c.position] = isNaN(n) ? c.boostValue : n;
        if (n !== 0) hasBoost = true;
      }
    });
  }

  // numberOfSplitCoins
  const numberOfSplitCoins = Array(15).fill(0);
  let hasSplitCoins = false;
  if (hasSplit) {
    coins.forEach((c) => {
      if (c.splitCount && c.splitCount > 1) {
        numberOfSplitCoins[c.position] = c.splitCount;
        hasSplitCoins = true;
      }
    });
  }

  // splitCoinsBoostValues — [array for coin2, array for coin3, array for coin4]
  // Only for strike+split combos; arrays at positions of split coins
  const splitBoostArrays: (number | string)[][] = [
    Array(15).fill(0), Array(15).fill(0), Array(15).fill(0),
  ];
  let hasSplitBoost = false;
  if (hasStrike && hasSplit) {
    coins.forEach((c) => {
      if (c.winged && c.splitCount && c.splitCount > 1 && c.splitBoostValues) {
        c.splitBoostValues.forEach((bv, idx) => {
          if (bv !== undefined && bv !== "") {
            const n = Number(bv);
            splitBoostArrays[idx][c.position] = isNaN(n) ? bv : n;
            if (n !== 0) hasSplitBoost = true;
          }
        });
      }
    });
  }

  let out = `[reelStopPositions: [${rsp.join(",")}]`;

  if (landedCoins.length > 0)
    out += `,landedCoinsInBonusBoost: [${landedCoins.map((r: any[]) => `[${r.join(",")}]`).join(",")}]`;

  if (hasBoost)
    out += `,boostValues: [${boostValues.join(",")}]`;

  if (hasSplitCoins)
    out += `,numberOfSplitCoins: [${numberOfSplitCoins.join(",")}]`;

  if (hasSplitBoost) {
    const maxExtra = Math.max(...coins.filter((c) => c.winged && hasSplit).map((c) => (c.splitCount ?? 1) - 1), 0);
    out += `,splitCoinsBoostValues: [${splitBoostArrays.slice(0, maxExtra).map((a) => `[${a.join(",")}]`).join(",")}]`;
  }

  // if (hasZone && splitter)                             out += `, zoneSplitter: ${splitter}`;
  // if (hasZone && multipliers && multipliers.length > 0) out += `, zoneMultipliers: [${multipliers.join(",")}]`;

  out += `]`;
  return out;
}