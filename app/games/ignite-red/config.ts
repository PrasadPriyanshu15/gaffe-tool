// // ── Scat types ────────────────────────────────────────────────────────────────
// export type ScatKey = "blue" | "green" | "red" | "purple" | "all";

// export type ScatType = {
//   key:        ScatKey;
//   label:      string;
//   feature:    string;
//   colorClass: string;
// };

// export const SCAT_OPTIONS: ScatType[] = [
//   { key: "blue",   label: "BlueScat",   feature: "zone",   colorClass: "bg-blue-600"   },
//   { key: "green",  label: "GREEN_SCATTER",  feature: "extra",  colorClass: "bg-green-600"  },     //! here 
//   { key: "red",    label: "RedScat",    feature: "double", colorClass: "bg-red-600"    },
//   { key: "purple", label: "PurpleScat", feature: "ultra",  colorClass: "bg-purple-600" },
//   { key: "all",    label: "AllScat",    feature: "all",    colorClass: "bg-gradient-to-br from-blue-500 via-red-500 to-purple-500" },
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
// export const COIN_VALUES          = ["1", "2", "5", "MINOR", "MAJOR", "MINI"];
// export const BOOST_VALUES         = ["0", "0.5", "1", "2", "5", "10", "25", "50", "100"];
// export const ZONE_SPLITTER_OPTIONS = ["1", "2", "3", "4", "5", "6", "7"];

// // ── Feature-upgrade coin colorCode → feature list ─────────────────────────────
// // red coin(4)→DOUBLE, blue(13)→ZONE, green(22)→EXTRA, purple(31)→ULTRA, allColor(19)→any trio
// export const UPGRADE_CODE_TO_FEATURES: Record<number, string[]> = {
//   4:  ["DOUBLE"],
//   13: ["ZONE"],
//   22: ["EXTRA"],
//   31: ["ULTRA"],
//   19: ["DOUBLE", "EXTRA", "ULTRA"],
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
export const COIN_VALUES          = ["1", "2", "5", "MINOR", "MAJOR", "MINI"];
export const BOOST_VALUES         = ["0", "0.5", "1", "2", "5", "10", "25", "50", "100"];
export const ZONE_SPLITTER_OPTIONS = ["1", "2", "3", "4", "5", "6", "7"];

// ── Feature-upgrade coin colorCode → feature list ─────────────────────────────
// red coin(4)→DOUBLE, blue(13)→ZONE, green(22)→EXTRA, purple(31)→ULTRA, allColor(19)→any trio
export const UPGRADE_CODE_TO_FEATURES: Record<number, string[]> = {
  4:  ["DOUBLE"],
  13: ["ZONE"],
  22: ["EXTRA"],
  31: ["ULTRA"],
  19: ["DOUBLE", "EXTRA", "ULTRA"],
};

// ── Position helpers (column-major: pos = col*3 + row) ────────────────────────
export const posToCol    = (pos: number): number => Math.floor(pos / 3);
export const posToRow    = (pos: number): number => pos % 3;
export const posToMetric = (pos: number): string => `(${posToCol(pos)},${posToRow(pos)})`;