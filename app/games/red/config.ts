
// // ── Scat types ────────────────────────────────────────────────────────────────
// export type ScatKey = "blue" | "green" | "red" | "purple" | "all";

// export type ScatType = {
//   key:        ScatKey;
//   label:      string;
//   feature:    string;
//   colorClass: string;
// };

// export const SCAT_OPTIONS: ScatType[] = [
//   { key: "blue",   label: "BLUE_SCATTER",        feature: "zone",   colorClass: "bg-blue-600"   },
//   { key: "green",  label: "GREEN_SCATTER",        feature: "extra",  colorClass: "bg-green-600"  },
//   { key: "red",    label: "RED_SCATTER",          feature: "double", colorClass: "bg-red-600"    },
//   { key: "purple", label: "PURPLE_SCATTER",       feature: "ultra",  colorClass: "bg-purple-600" },
//   { key: "all",    label: "FOUR_COLOR_SCATTER",   feature: "all",    colorClass: "bg-gradient-to-br from-blue-500 via-red-500 to-purple-500" },
// ];

// // All 4 individual features (for All-Scat expansion)
// export const ALL_FEATURES = ["DOUBLE", "ZONE", "EXTRA", "ULTRA"];

// // Scat key → colorCode in base-game reelStopPositions output
// export const SCAT_COLOR_CODE: Record<ScatKey, number> = {
//   blue:   4,
//   green:  13,
//   red:    22,
//   purple: 31,
//   all:    4,
// };

// // ── Coin / boost values ───────────────────────────────────────────────────────
// export const COIN_VALUES           = ["100", "250", "500", "MINOR", "MAJOR", "MINI"];
// export const BOOST_VALUES          = ["0", "0.5", "1", "2", "5", "10", "25", "50", "100"];
// export const ZONE_SPLITTER_OPTIONS = ["1", "2", "3", "4", "5", "6", "7"];

// // ── Feature-upgrade coin colorCode → feature list ─────────────────────────────
// // Global fallback (used by combo feature generator)
// export const UPGRADE_CODE_TO_FEATURES: Record<number, string[]> = {
//   4:  ["DOUBLE"],
//   13: ["ZONE"],
//   22: ["EXTRA"],
//   31: ["ULTRA"],
//   19: ["DOUBLE", "EXTRA", "ULTRA"],
// };

// // All possible upgrade targets (excluding self, handled per-component)
// export const ALL_UPGRADE_FEATURES = ["DOUBLE", "ZONE", "EXTRA", "ULTRA"];

// /**
//  * Per-feature upgrade map: given the active single feature, maps each coin
//  * colorCode used in that feature's palette to the features it can upgrade to.
//  *
//  * FIX: Zone colorCode 13 (Purple) was previously mapped to ["ZONE"] (self),
//  * which was filtered out — leaving no upgrade option. Corrected to ["ULTRA"].
//  *
//  * Coin palettes:
//  *   Zone:   Red(4)→DOUBLE,  Purple(13)→ULTRA,  Green(22)→EXTRA,  AllColor(31)→all-others
//  *   Extra:  Red(4)→DOUBLE,  Blue(13)→ZONE,     Purple(22)→ULTRA, AllColor(31)→all-others
//  *   Double: Purple(4)→ULTRA, Blue(13)→ZONE,    Green(22)→EXTRA,  AllColor(31)→all-others
//  *   Ultra:  Red(4)→DOUBLE,  Blue(13)→ZONE,     Purple(22)→EXTRA, AllColor(31)→all-others
//  */
// export const FEATURE_UPGRADE_MAP: Record<string, Record<number, string[]>> = {
//   zone:   { 4: ["DOUBLE"], 13: ["ULTRA"],  22: ["EXTRA"],  31: [] }, // 31 = AllColor → handled specially
//   extra:  { 4: ["DOUBLE"], 13: ["ZONE"],   22: ["ULTRA"],  31: [] },
//   double: { 4: ["ULTRA"],  13: ["ZONE"],   22: ["EXTRA"],  31: [] },
//   ultra:  { 4: ["DOUBLE"], 13: ["ZONE"],   22: ["EXTRA"],  31: [] },
// };

// // ── Position helpers (column-major: pos = col*3 + row) ────────────────────────
// export const posToCol    = (pos: number): number => Math.floor(pos / 3);
// export const posToRow    = (pos: number): number => pos % 3;
// export const posToMetric = (pos: number): string => `(${posToCol(pos)},${posToRow(pos)})`;





//! workig
// ── Scat types ────────────────────────────────────────────────────────────────
// export type ScatKey = "blue" | "green" | "red" | "purple" | "all";

// export type ScatType = {
//   key:        ScatKey;
//   label:      string;
//   feature:    string;
//   colorClass: string;
// };

// export const SCAT_OPTIONS: ScatType[] = [
//   { key: "blue",   label: "BLUE_SCATTER",   feature: "zone",   colorClass: "bg-blue-600"   },
//   { key: "green",  label: "GREEN_SCATTER",  feature: "extra",  colorClass: "bg-green-600"  },
//   { key: "red",    label: "RED_SCATTER",    feature: "double", colorClass: "bg-red-600"    },
//   { key: "purple", label: "PURPLE_SCATTER", feature: "ultra",  colorClass: "bg-purple-600" },
//   { key: "all",    label: "FOUR_COLOR_SCATTER",    feature: "all",    colorClass: "bg-gradient-to-br from-blue-500 via-red-500 to-purple-500" },
// ];

// // All 4 individual features (for All-Scat expansion)
// export const ALL_FEATURES = ["DOUBLE", "ZONE", "EXTRA", "ULTRA"];

// // Scat key → colorCode in base-game reelStopPositions output
// export const SCAT_COLOR_CODE: Record<ScatKey, number> = {
//   blue:   4,
//   green:  13,
//   red:    22,
//   purple: 31,
//   all:    4,
// };

// // ── Coin / boost values ───────────────────────────────────────────────────────
// export const COIN_VALUES          = ["100", "250", "500", "MINOR", "MAJOR", "MINI"];
// export const BOOST_VALUES         = ["0", "1", "2", "5", "10", "25", "50", "100"];
// export const ZONE_SPLITTER_OPTIONS = ["1", "2", "3", "4", "5", "6", "7"];

// // ── Feature-upgrade coin colorCode → feature list ─────────────────────────────
// // Global fallback (used by combo feature generator)
// export const UPGRADE_CODE_TO_FEATURES: Record<number, string[]> = {
//   4:  ["DOUBLE"],
//   13: ["ZONE"],
//   22: ["EXTRA"],
//   31: ["ULTRA"],
//   19: ["DOUBLE", "EXTRA", "ULTRA"],
// };

// // All possible upgrade targets (excluding self, handled per-component)
// export const ALL_UPGRADE_FEATURES = ["DOUBLE", "ZONE", "EXTRA", "ULTRA"];

// /**
//  * Per-feature upgrade map: given the active single feature, maps each coin
//  * colorCode used in that feature's palette to the features it can upgrade to.
//  * The "AllColor" coin (highest colorCode in each palette) always maps to ALL_OTHER.
//  *
//  * Coin palettes (from each *FeatureGenerator):
//  *   Zone:   Red(4)→DOUBLE,  Purple(13)→?,    Green(22)→EXTRA,  AllColor(31)→all-others
//  *   Extra:  Red(4)→DOUBLE,  Blue(13)→ZONE,   Purple(22)→ULTRA, AllColor(31)→all-others
//  *   Double: Purple(4)→ZONE, Blue(13)→ZONE,   Green(22)→EXTRA,  AllColor(31)→all-others
//  *   Ultra:  Red(4)→DOUBLE,  Blue(13)→ZONE,   Purple(22)→EXTRA, AllColor(31)→all-others
//  *
//  * Mapping rules:
//  *   - Red(4)   in Zone/Extra/Ultra  → DOUBLE
//  *   - Blue(13) in Extra/Ultra       → ZONE
//  *   - Purple(13) in Zone            → ZONE (same code, used as zone-internal label)
//  *   - Purple(4) in Double           → ULTRA (per Double palette label)
//  *   - Blue(13) in Double            → ZONE
//  *   - Green(22) in Zone/Double      → EXTRA
//  *   - Purple(22) in Extra/Ultra     → ULTRA
//  *   - AllColor (31 in all)          → all features except self (handled by component)
//  */
// export const FEATURE_UPGRADE_MAP: Record<string, Record<number, string[]>> = {
//   zone:   { 4: ["DOUBLE"], 13: ["ULTRA"],  22: ["EXTRA"],  31: [] }, // 31 = AllColor → handled specially
//   extra:  { 4: ["DOUBLE"], 13: ["ZONE"],   22: ["ULTRA"],  31: [] },
//   double: { 4: ["ULTRA"],  13: ["ZONE"],   22: ["EXTRA"],  31: [] },
//   ultra:  { 4: ["DOUBLE"], 13: ["ZONE"],   22: ["EXTRA"],  31: [] },
// };

// // ── Position helpers (column-major: pos = col*3 + row) ────────────────────────
// export const posToCol    = (pos: number): number => Math.floor(pos / 3);
// export const posToRow    = (pos: number): number => pos % 3;
// export const posToMetric = (pos: number): string => `(${posToCol(pos)},${posToRow(pos)})`;





// ── Scat types ────────────────────────────────────────────────────────────────
export type ScatKey = "blue" | "green" | "red" | "purple" | "all";

export type ScatType = {
  key:        ScatKey;
  label:      string;
  feature:    string;
  colorClass: string;
};

export const SCAT_OPTIONS: ScatType[] = [
  { key: "blue",   label: "BLUE_SCATTER",   feature: "zone",   colorClass: "bg-blue-600"   },
  { key: "green",  label: "GREEN_SCATTER",  feature: "extra",  colorClass: "bg-green-600"  },
  { key: "red",    label: "RED_SCATTER",    feature: "double", colorClass: "bg-red-600"    },
  { key: "purple", label: "PURPLE_SCATTER", feature: "ultra",  colorClass: "bg-purple-600" },
  { key: "all",    label: "FOUR_COLOR_SCATTER",    feature: "all",    colorClass: "bg-gradient-to-br from-blue-500 via-red-500 to-purple-500" },
];

// All 4 individual features (for All-Scat expansion)
export const ALL_FEATURES = ["DOUBLE", "ZONE", "EXTRA", "ULTRA"];

// Scat key → colorCode in base-game reelStopPositions output
export const SCAT_COLOR_CODE: Record<ScatKey, number> = {
  blue:   4,
  green:  13,
  red:    22,
  purple: 31,
  all:    4,
};

// ── Coin / boost values ───────────────────────────────────────────────────────
export const COIN_VALUES          = ["100", "250", "500", "MINOR", "MAJOR", "MINI"];
export const BOOST_VALUES         = ["0","1", "2", "5", "10", "25", "50", "100"];
export const ZONE_SPLITTER_OPTIONS = ["1", "2", "3", "4", "5", "6", "7"];

// ── Feature-upgrade coin colorCode → feature list ─────────────────────────────
// Global fallback (used by combo feature generator)
export const UPGRADE_CODE_TO_FEATURES: Record<number, string[]> = {
  4:  ["DOUBLE"],
  13: ["ZONE"],
  22: ["EXTRA"],
  31: ["ULTRA"],
  19: ["DOUBLE", "EXTRA", "ULTRA"],
};

// All possible upgrade targets (excluding self, handled per-component)
export const ALL_UPGRADE_FEATURES = ["DOUBLE", "ZONE", "EXTRA", "ULTRA"];

/**
 * Per-feature upgrade map: given the active single feature, maps each coin
 * colorCode used in that feature's palette to the features it can upgrade to.
 * The "AllColor" coin (highest colorCode in each palette) always maps to ALL_OTHER.
 *
 * Coin palettes (from each *FeatureGenerator):
 *   Zone:   Red(4)→DOUBLE,  Purple(13)→?,    Green(22)→EXTRA,  AllColor(31)→all-others
 *   Extra:  Red(4)→DOUBLE,  Blue(13)→ZONE,   Purple(22)→ULTRA, AllColor(31)→all-others
 *   Double: Purple(4)→ZONE, Blue(13)→ZONE,   Green(22)→EXTRA,  AllColor(31)→all-others
 *   Ultra:  Red(4)→DOUBLE,  Blue(13)→ZONE,   Purple(22)→EXTRA, AllColor(31)→all-others
 *
 * Mapping rules:
 *   - Red(4)   in Zone/Extra/Ultra  → DOUBLE
 *   - Blue(13) in Extra/Ultra       → ZONE
 *   - Purple(13) in Zone            → ZONE (same code, used as zone-internal label)
 *   - Purple(4) in Double           → ULTRA (per Double palette label)
 *   - Blue(13) in Double            → ZONE
 *   - Green(22) in Zone/Double      → EXTRA
 *   - Purple(22) in Extra/Ultra     → ULTRA
 *   - AllColor (31 in all)          → all features except self (handled by component)
 */
export const FEATURE_UPGRADE_MAP: Record<string, Record<number, string[]>> = {
  zone:   { 4: ["DOUBLE"], 13: ["ULTRA"],  22: ["EXTRA"],  31: [] }, // 31 = AllColor → handled specially
  extra:  { 4: ["DOUBLE"], 13: ["ZONE"],   22: ["ULTRA"],  31: [] },
  double: { 4: ["ULTRA"],  13: ["ZONE"],   22: ["EXTRA"],  31: [] },
  ultra:  { 4: ["DOUBLE"], 13: ["ZONE"],   22: ["EXTRA"],  31: [] },
};

// ── Position helpers (column-major: pos = col*3 + row) ────────────────────────
export const posToCol    = (pos: number): number => Math.floor(pos / 3);
export const posToRow    = (pos: number): number => pos % 3;
export const posToMetric = (pos: number): string => `(${posToCol(pos)},${posToRow(pos)})`;