/* eslint-disable @typescript-eslint/no-explicit-any */
import { reels } from "./reels";
import { ScatType, posToCol, posToRow } from "./config";

export type ScatsState = {
  colors:          { [key: string]: ScatType };
  values:          { [key: string]: string };
  leftValues:      { [key: string]: string };
  rightValues:     { [key: string]: string };
  zoneSplitter:    { [key: string]: string };
  zoneMultipliers: { [key: string]: string };
  boostValues:     { [key: string]: string };
};

/**
 * Generate base-game gaffe object.
 * Positions in landedCoins use metric [col, row] (column-major).
 * Red / All scats → two entries [col,row,VALUE,LEFT] and [col,row,VALUE,RIGHT].
 */
export function generateGaffe(
  reelStops:        number[],
  scats:            ScatsState,
  selectedFeatures: string[],
  grandEnabled:     boolean
): any {
  const result: any         = { reelStopPositions: reelStops };
  const scatSequence: string[]              = [];
  const landedCoins:  any[]                 = [];
  const boostArr: (number | string)[]       = Array(15).fill(0);
  let zoneSplitter:   string | null         = null;
  let zoneMultipliers: number[] | null      = null;

  reelStops.forEach((stop, ri) => {
    const reel = reels[ri];
    [-1, 0, 1].forEach((offset, rowIdx) => {
      const idx = (stop + offset + reel.length) % reel.length;
      if (reel[idx] !== "SCAT") return;

      const key  = `${ri}-${idx}`;
      const scat = scats.colors[key] as ScatType | undefined;
      const pos  = ri * 3 + rowIdx;

      if (!scat) return;
      scatSequence.push(scat.label);

      // Zone params: blue or all
      if (scat.key === "blue" || scat.key === "all") {
        const zs = scats.zoneSplitter[key];
        if (zs) zoneSplitter = zs;
        const zm = scats.zoneMultipliers[key];
        if (zm) {
          const p = zm.split(",").map(n => n.trim()).filter(Boolean).map(Number);
          if (p.length) zoneMultipliers = p;
        }
      }

      // Boost: purple or all
      if (scat.key === "purple" || scat.key === "all") {
        const bv = scats.boostValues[key];
        if (bv) boostArr[pos] = isNaN(Number(bv)) ? bv : Number(bv);
      }

      // Landed coins: red/all → LEFT+RIGHT, others → single
      const isDouble = scat.key === "red" || scat.key === "all";
      if (isDouble) {
        const lv = scats.leftValues[key];
        const rv = scats.rightValues[key];
        if (lv) landedCoins.push([posToCol(pos), posToRow(pos), lv, "LEFT"]);
        if (rv) landedCoins.push([posToCol(pos), posToRow(pos), rv, "RIGHT"]);
      } else {
        const val = scats.values[key];
        if (val) landedCoins.push([posToCol(pos), posToRow(pos), `COIN_${val}`]);
      }
    });
  });

  if (scatSequence.length)      result.scatReplacement  = scatSequence;
  if (landedCoins.length)       result.landedCoins       = landedCoins;
  result.featureTriggered        = selectedFeatures.length ? selectedFeatures : [];
  result.canGrandTrigger         = grandEnabled;
  if (zoneSplitter !== null)    result.zoneSplitter      = Number(zoneSplitter);
  if (zoneMultipliers !== null) result.zoneMultipliers   = zoneMultipliers;
  if (boostArr.some(v => v !== 0)) result.boostValues    = boostArr;

  return result;
}

/** Serialize gaffe object → output string */
export function formatGaffe(gaffe: any): string {
  let out = `[reelStopPositions:[${gaffe.reelStopPositions.join(",")}]`;
  if (gaffe.scatReplacement?.length)
    out += `,scatterType:[${gaffe.scatReplacement.join(",")}]`;
  if (gaffe.landedCoins?.length)
    out += `,landedCoins:[${gaffe.landedCoins.map((c: any[]) => `[${c.join(",")}]`).join(",")}]`;
  if (gaffe.featureTriggered?.length)
    out += `,featureTriggered:[${gaffe.featureTriggered.join(",")}]`;
  else
    out += `,featureTriggered:[]`;
  out += `,canGrandTrigger:${gaffe.canGrandTrigger}`;
  if (gaffe.zoneSplitter  !== undefined) out += `,zoneSplitter:${gaffe.zoneSplitter}`;
  if (gaffe.zoneMultipliers !== undefined) out += `,zoneMultipliers:[${gaffe.zoneMultipliers.join(",")}]`;
  if (gaffe.boostValues   !== undefined) out += `,boostValues:[${gaffe.boostValues.join(",")}]`;
  out += `]`;
  return out;
}
