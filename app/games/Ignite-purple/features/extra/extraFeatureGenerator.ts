




/* eslint-disable @typescript-eslint/no-explicit-any */

// Extra feature coin colors (numeric codes used in output)
// green=4, blue=9, orange=14, cerise=19  (to be confirmed per feature)
// For Extra feature: these are the landing coin color codes
export const EXTRA_COIN_COLORS = [
  { label: "Orange (4)", value: 4 },
  { label: "Blue (9)", value: 9 },
  { label: "Pink (14)", value: 14 },
  { label: "AllColor (19)", value: 19 },
];

export const EXTRA_COIN_VALUES = ["1", "2", "5" , "100", "Minor", "Major" , "Mini"];

export type ExtraFeatureCoin = {
  position: number;       // 0–14
  colorCode: number;      // 4 | 9 | 14 | 19
  value: string;          // "0.75" | "1" | "2" | "5" | "Minor" | "Major"
  fromBase?: boolean;     // pre-seeded from base game scats
};

export type UpgradeInfoSingle = {
  pos:              number;     // coin position (0-14)
  features:         string[];   // e.g. ["STRIKE"] or ["ZONE","SPLIT"]
  zoneSplitter?:    number;
  zoneMultipliers?: number[];
};

/**
 * Generate the Extra Feature output line.
 *
 * reelStopPositions: 15-element array — 0 = empty, colorCode = coin present
 * landedCoinsInBonusBoost: [[position, colorCode, value], ...]
 */
export function generateExtraFeatureGaffe(coins: ExtraFeatureCoin[], upgrade?: UpgradeInfoSingle | null): string {
  // Build 15-slot reelStopPositions array
  const reelStopPositions = Array(15).fill(0);

  coins.forEach((coin) => {
    reelStopPositions[coin.position] = coin.colorCode;
  });

  // Build landedCoinsInBonusBoost
  const landedCoins = coins.map((coin) => [coin.position, coin.colorCode, coin.value]);

  let result = `[reelStopPositions: [${reelStopPositions.join(",")}]`;

  if (landedCoins.length > 0) {
    const coinsFormatted = landedCoins
      .map((c: any) =>`[${c[0]},${c[1]},${c[2]}]`)
      .join(",");
    result += `,landedCoinsInBonusBoost:[${coinsFormatted}]`;
  }

  result +=`]`;

  if (upgrade && upgrade.features.length > 0) {
    result = result.slice(0, -1); // remove trailing ]
    result += `, additionalFeatureTriggered: [${upgrade.features.map((f) => f.toLowerCase()).join(",")}]`;
    if (upgrade.zoneSplitter)
      result += `, upgradeZoneSplitter: ${upgrade.zoneSplitter}`;
    if (upgrade.zoneMultipliers && upgrade.zoneMultipliers.length > 0)
      result += `, upgradeZoneMultipliers: [${upgrade.zoneMultipliers.join(",")}]`;
    result += `]`;
  }

  return result;
}