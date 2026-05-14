
/* eslint-disable @typescript-eslint/no-explicit-any */
import { posToCol, posToRow } from "./config";

export const ZONE_COIN_COLORS = [
  { label: "Red(4)",    value: 4  },
  { label: "Purple(13)",      value: 13  },
  { label: "Green(22)",    value: 22 },
  { label: "AllColor(31)", value: 31 },
];
export const ZONE_COIN_VALUES = ["100", "250", "500", "MINOR", "MAJOR", "MINI"];

export type ZoneFeatureCoin = {
  position:  number;   // 0–14 column-major (col*3+row)
  colorCode: number;   // 4 | 13 | 22 | 31
  value:     string;
  fromBase?: boolean;
};

export type UpgradeInfo = { col: number; row: number; features: string[] };

// ── Zone background colors ────────────────────────────────────────────────────
type ZoneColor = "purple" | "blue" | "red" | "green";

// Row-major lookup [splitter-1][row*5+col]
const ZONE_COLORS_ROW_MAJOR: ZoneColor[][] = [
  ["purple","purple","purple","purple","green","blue","blue","red","red","green","blue","blue","red","red","red"],
  ["purple","purple","purple","blue","blue","purple","purple","blue","blue","blue","green","green","red","red","red"],
  ["blue","blue","purple","purple","purple","blue","red","purple","green","purple","red","red","green","green","green"],
  ["purple","purple","purple","blue","blue","green","purple","blue","blue","blue","green","green","red","red","red"],
  ["purple","purple","purple","blue","blue","red","red","purple","blue","blue","red","red","green","green","green"],
  ["blue","blue","purple","purple","purple","blue","blue","red","green","purple","red","red","red","green","green"],
  ["purple","purple","purple","blue","blue","green","purple","blue","blue","red","green","green","red","red","red"],
];

export const ZONE_BG_CLASS: Record<ZoneColor, string> = {
  purple: "bg-purple-800", blue: "bg-sky-700", red: "bg-red-800", green: "bg-emerald-700",
};
export const ZONE_BORDER_CLASS: Record<ZoneColor, string> = {
  purple: "border-purple-500", blue: "border-sky-400", red: "border-red-500", green: "border-emerald-400",
};

export function getZoneBgColor(pos: number, splitter: number): ZoneColor {
  const col = Math.floor(pos / 3), row = pos % 3;
  return ZONE_COLORS_ROW_MAJOR[splitter - 1]?.[row * 5 + col] ?? "purple";
}

export function generateZoneFeatureGaffe(
  coins:       ZoneFeatureCoin[],
  splitter:    number,
  multipliers: number[],
  upgrade?:    UpgradeInfo | null
): string {
  const rsp = Array(15).fill(0);
  coins.forEach(c => { rsp[c.position] = c.colorCode; });

  const sorted = [...coins].sort((a, b) => a.position - b.position);
  // Fix #5: wrap value in COIN_VALUE format
  const lc = sorted.map(c => [posToCol(c.position), posToRow(c.position), `COIN_${c.value}`]);

  let out = `[reelStopPositions:[${rsp.join(",")}]`;
  if (lc.length)          out += `,landedCoins:[${lc.map((c: any) => `[${c.join(",")}]`).join(",")}]`;
  if (splitter)           out += `,zoneSplitter:${splitter}`;
  if (multipliers.length) out += `,zoneMultipliers:[${multipliers.join(",")}]`;
  if (upgrade)            out += `,goodPosition:[${upgrade.col},${upgrade.row}],additionalFeatureTriggered:[${upgrade.features.join(",")}]`;
  out += `]`;
  return out;
}