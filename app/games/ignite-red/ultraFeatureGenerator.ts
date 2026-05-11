/* eslint-disable @typescript-eslint/no-explicit-any */
import { posToCol, posToRow } from "./config";

export const ULTRA_COIN_COLORS = [
  { label: "Purple(4)",    value: 4  },
  { label: "Blue(9)",      value: 9  },
  { label: "Green(14)",    value: 14 },
  { label: "AllColor(19)", value: 19 },
];
export const ULTRA_COIN_VALUES  = ["1", "2", "5", "Minor", "Major", "Mini"];
export const ULTRA_BOOST_VALUES = ["0", "0.5", "1", "2", "5", "10", "25", "50", "100"];

/**
 * Ultra feature: gold coins with boost values.
 * No "winged" concept.
 * In Double+Ultra combo: boostSide (LEFT|RIGHT) indicates which side gets the boost.
 */
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
  const lc = sorted.map(c => [posToCol(c.position), posToRow(c.position), c.value]);

  const boostArr: (number | string)[] = Array(15).fill(0);
  let hasBoost = false;
  coins.forEach(c => {
    if (c.boostValue && c.boostValue !== "") {
      const n = Number(c.boostValue);
      boostArr[c.position] = isNaN(n) ? c.boostValue : n;
      if (n !== 0) hasBoost = true;
    }
  });

  const sideArr: string[] = Array(15).fill("NULL");
  let hasSide = false;
  if (isDoubleCombo) {
    coins.forEach(c => { if (c.boostSide) { sideArr[c.position] = c.boostSide; hasSide = true; } });
  }

  let out = `[reelStopPositions:[${rsp.join(",")}]`;
  if (lc.length)         out += `,landedCoins:[${lc.map((c: any) => `[${c.join(",")}]`).join(",")}]`;
  if (hasBoost)          out += `,boostValues:[${boostArr.join(",")}]`;
  if (hasSide)           out += `,boostSide:[${sideArr.join(",")}]`;
  if (coins.length >= 14) out += `,lastPositionReel:bonus-boost`;
  if (upgrade)           out += `,goodPosition:[${upgrade.col},${upgrade.row}],additionalFeatureTriggered:[${upgrade.features.join(",")}]`;
  out += `]`;
  return out;
}
