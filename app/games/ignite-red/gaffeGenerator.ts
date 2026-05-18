
// /* eslint-disable @typescript-eslint/no-explicit-any */
// import { reels } from "./reels";
// import { ScatType, posToCol, posToRow } from "./config";

// export type ScatsState = {
//   colors:          { [key: string]: ScatType };
//   values:          { [key: string]: string };
//   leftValues:      { [key: string]: string };
//   rightValues:     { [key: string]: string };
//   zoneSplitter:    { [key: string]: string };
//   zoneMultipliers: { [key: string]: string };
//   boostValues:     { [key: string]: string };
// };

// /**
//  * Generate base-game gaffe object.
//  * reelStopPositions always has 5 elements (one per reel), initially 0.
//  * Only updates when a SCAT is visible and GO TO is pressed.
//  * Positions in landedCoins use metric [col, row] (column-major).
//  * Red / All scats → two entries [col,row,VALUE,LEFT] and [col,row,VALUE,RIGHT].
//  */
// export function generateGaffe(
//   reelStops:        number[],
//   scats:            ScatsState,
//   selectedFeatures: string[],
//   grandEnabled:     boolean
// ): any {
//   // reelStopPositions: always 5 elements, one per reel stop
//   const reelStopPositions = reelStops.length === 5 ? [...reelStops] : [0, 0, 0, 0, 0];

//   const result: any                         = { reelStopPositions };
//   const scatSequence: string[]              = [];
//   const landedCoins:  any[]                 = [];
//   const boostArr: (number | string)[]       = Array(15).fill(0);
//   let zoneSplitter:   string | null         = null;
//   let zoneMultipliers: number[] | null      = null;

//   reelStops.forEach((stop, ri) => {
//     const reel = reels[ri];
//     [-1, 0, 1].forEach((offset, rowIdx) => {
//       const idx = (stop + offset + reel.length) % reel.length;
//       if (reel[idx] !== "SCAT") return;

//       const key  = `${ri}-${idx}`;
//       const scat = scats.colors[key] as ScatType | undefined;
//       const pos  = ri * 3 + rowIdx;

//       if (!scat) return;
//       scatSequence.push(scat.label);

//       // Zone params: blue or all
//       if (scat.key === "blue" || scat.key === "all") {
//         const zs = scats.zoneSplitter[key];
//         if (zs) zoneSplitter = zs;
//         const zm = scats.zoneMultipliers[key];
//         if (zm) {
//           const p = zm.split(",").map(n => n.trim()).filter(Boolean).map(Number);
//           if (p.length) zoneMultipliers = p;
//         }
//       }

//       // Boost: purple or all
//       if (scat.key === "purple" || scat.key === "all") {
//         const bv = scats.boostValues[key];
//         if (bv) boostArr[pos] = isNaN(Number(bv)) ? bv : Number(bv);
//       }

//       // Landed coins: red/all → LEFT+RIGHT, others → single with COIN_VALUE format
//       const isDouble = scat.key === "red" || scat.key === "all";
//       if (isDouble) {
//         const lv = scats.leftValues[key];
//         const rv = scats.rightValues[key];
//         if (lv) landedCoins.push([posToCol(pos), posToRow(pos), `COIN_${lv}`, "LEFT"]);
//         if (rv) landedCoins.push([posToCol(pos), posToRow(pos), `COIN_${rv}`, "RIGHT"]);
//       } else {
//         const val = scats.values[key];
//         if (val) landedCoins.push([posToCol(pos), posToRow(pos), `COIN_${val}`]);
//       }
//     });
//   });

//   if (scatSequence.length)      result.scatReplacement  = scatSequence;
//   if (landedCoins.length)       result.landedCoins       = landedCoins;
//   // featureTriggered: always present, all caps
//   result.featureTriggered = selectedFeatures.length
//     ? selectedFeatures.map(f => f.toUpperCase())
//     : [];
//   // canGrandTrigger removed (fix #2)
//   if (zoneSplitter !== null)    result.zoneSplitter      = Number(zoneSplitter);
//   if (zoneMultipliers !== null) result.zoneMultipliers   = zoneMultipliers;
//   if (boostArr.some(v => v !== 0)) result.boostValues    = boostArr;

//   return result;
// }

// /** Serialize gaffe object → output string */
// export function formatGaffe(gaffe: any): string {
//   // reelStopPositions: always 5 elements
//   const rsp = gaffe.reelStopPositions as number[];
//   let out = `[reelStopPositions:[${rsp.join(",")}]`;

//   if (gaffe.scatReplacement?.length)
//     out += `,scatterType:[${gaffe.scatReplacement.join(",")}]`;
//   if (gaffe.landedCoins?.length)
//     out += `,landedCoins:[${gaffe.landedCoins.map((c: any[]) => `[${c.join(",")}]`).join(",")}]`;
//   // featureTriggered: always emitted (all caps values already set in generateGaffe)
//   if (gaffe.featureTriggered?.length)
//     out += `,featureTriggered:[${gaffe.featureTriggered.join(",")}]`;
//   else
//     out += `,featureTriggered:[]`;
//   // canGrandTrigger removed (fix #2)
//   if (gaffe.zoneSplitter  !== undefined) out += `,zoneSplitter:${gaffe.zoneSplitter}`;
//   if (gaffe.zoneMultipliers !== undefined) out += `,zoneMultipliers:[${gaffe.zoneMultipliers.join(",")}]`;
//   if (gaffe.boostValues   !== undefined) out += `,boostValues:[${gaffe.boostValues.join(",")}]`;
//   out += `]`;
//   return out;
// }


//! latest working vorrect
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
 * reelStopPositions always has 5 elements (one per reel), initially 0.
 * Only updates when a SCAT is visible and GO TO is pressed.
 * Positions in landedCoins use metric [col, row] (column-major).
 * Red / All scats → two entries [col,row,VALUE,LEFT] and [col,row,VALUE,RIGHT].
 */
export function generateGaffe(
  reelStops:        number[],
  scats:            ScatsState,
  selectedFeatures: string[],
  grandEnabled:     boolean
): any {
  // reelStopPositions: always 5 elements, one per reel stop
  const reelStopPositions = reelStops.length === 5 ? [...reelStops] : [0, 0, 0, 0, 0];

  const result: any                         = { reelStopPositions };
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

      // Landed coins: red/all → LEFT+RIGHT, others → single with COIN_VALUE format
      const isDouble = scat.key === "red" || scat.key === "all";
      if (isDouble) {
        const lv = scats.leftValues[key];
        const rv = scats.rightValues[key];
        if (lv) landedCoins.push([posToCol(pos), posToRow(pos), `COIN_${lv}`, "LEFT"]);
        if (rv) landedCoins.push([posToCol(pos), posToRow(pos), `COIN_${rv}`, "RIGHT"]);
      } else {
        const val = scats.values[key];
        if (val) landedCoins.push([posToCol(pos), posToRow(pos), `COIN_${val}`]);
      }
    });
  });

  if (scatSequence.length)      result.scatReplacement  = scatSequence;
  if (landedCoins.length)       result.landedCoins       = landedCoins;
  // featureTriggered: only when features are selected
  if (selectedFeatures.length)
    result.featureTriggered = selectedFeatures.map(f => f.toUpperCase());
  // canGrandTrigger removed (fix #2)
  if (zoneSplitter !== null)    result.zoneSplitter      = Number(zoneSplitter);
  if (zoneMultipliers !== null) result.zoneMultipliers   = zoneMultipliers;
  if (boostArr.some(v => v !== 0)) result.boostValues    = boostArr;

  return result;
}

/** Serialize gaffe object → output string */
export function formatGaffe(gaffe: any): string {
  // reelStopPositions: always 5 elements
  const rsp = gaffe.reelStopPositions as number[];
  let out = `[reelStopPositions:[${rsp.join(",")}]`;

  if (gaffe.scatReplacement?.length)
    out += `,scatterType:[${gaffe.scatReplacement.join(",")}]`;
  if (gaffe.landedCoins?.length)
    out += `,landedCoins:[${gaffe.landedCoins.map((c: any[]) => `[${c.join(",")}]`).join(",")}]`;
  // featureTriggered: always emitted (all caps values already set in generateGaffe)
  if (gaffe.featureTriggered?.length)
    out += `,featureTriggered:[${gaffe.featureTriggered.join(",")}]`;
  // canGrandTrigger removed (fix #2)
  if (gaffe.zoneSplitter  !== undefined) out += `,zoneSplitter:${gaffe.zoneSplitter}`;
  if (gaffe.zoneMultipliers !== undefined) out += `,zoneMultipliers:[${gaffe.zoneMultipliers.join(",")}]`;
  if (gaffe.boostValues   !== undefined) out += `,boostValues:[${gaffe.boostValues.join(",")}]`;
  out += `]`;
  return out;
}