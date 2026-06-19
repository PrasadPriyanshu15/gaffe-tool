


// /* eslint-disable @typescript-eslint/no-explicit-any */

// type ScatType = {
//   key: string;
//   label: string;
//   feature: string;
// };

// export function generateGaffe(
//   reelStops: number[],
//   reels: string[][],
//   scatColors: { [key: string]: ScatType },
//   scatValues: { [key: string]: string },
//   selectedFeatures: string[],
//   grandEnabled: boolean,
//   scatZoneSplitter: { [key: string]: string },
//   scatZoneMultipliers: { [key: string]: string },
//   scatBoostValues: { [key: string]: string },
//   scatSplitCount: { [key: string]: string }   // NEW
// ) {
//   const offsets = [-1, 0, 1];
//   const result: any = { reelStopPositions: reelStops };

//   const scatSequence: string[] = [];
//   const landedCoins: any[] = [];
//   const boostValuesArray: (number | string)[] = Array(15).fill(0);

//   let zoneSplitterValue: string | null = null;
//   let zoneMultipliersValue: number[] | null = null;

//   reelStops.forEach((stop, reelIndex) => {
//     const reel = reels[reelIndex];

//     offsets.forEach((offset, rowIndex) => {
//       const index = (stop + offset + reel.length) % reel.length;

//       if (reel[index] === "SCAT") {
//         const key          = `${reelIndex}-${index}`;
//         const scat         = scatColors[key];
//         const value        = scatValues[key];
//         const positionIndex = reelIndex * 3 + rowIndex;

//         if (scat) {
//           scatSequence.push(scat.label);

//           // boostValues: orange or all
//           if (scat.key === "orange" || scat.key === "all") {
//             const bv = scatBoostValues[key];
//             if (bv !== undefined && bv !== "") {
//               boostValuesArray[positionIndex] = isNaN(Number(bv)) ? bv : Number(bv);
//             }
//           }

//           // zone params: blue or all-color
//           if (scat.key === "blue" || scat.key === "all") {
//             const zs = scatZoneSplitter[key];
//             if (zs) zoneSplitterValue = zs;
//             const zm = scatZoneMultipliers[key];
//             if (zm) {
//               const parsed = zm.split(",").map((n) => n.trim()).filter(Boolean).map(Number);
//               if (parsed.length > 0) zoneMultipliersValue = parsed;
//             }
//           }
//         }

//         if (value !== undefined && value !== "") {
//           // Base coin entry: [reelIndex, rowIndex, value, ?splitCount]
//           // 5th element = split count for cerise or all scats (only when split count is set)
//           const coinEntry: any[] = [reelIndex, rowIndex, value];
//           if (scat && (scat.key === "cerise" || scat.key === "all")) {
//             const sc = scatSplitCount[key];
//             if (sc && sc !== "") coinEntry.push(Number(sc));
//           }
//           landedCoins.push(coinEntry);
//         }
//       }
//     });
//   });

//   if (scatSequence.length > 0)  result.scatReplacement  = scatSequence;
//   if (landedCoins.length > 0)   result.landedCoins       = landedCoins;
//   if (selectedFeatures.length > 0) result.featureTriggered = selectedFeatures;
//   else result.featureTriggered = [];

//   result.canGrandTrigger = grandEnabled;

//   if (zoneSplitterValue !== null)    result.zoneSplitter    = Number(zoneSplitterValue);
//   if (zoneMultipliersValue !== null) result.zoneMultipliers = zoneMultipliersValue;

//   const hasBoost = boostValuesArray.some((v) => v !== 0);
//   if (hasBoost) result.boostValues = boostValuesArray;

//   return result;
// }




/* eslint-disable @typescript-eslint/no-explicit-any */

type ScatType = {
  key: string;
  label: string;
  feature: string;
};

export function generateGaffe(
  reelStops: number[],
  reels: string[][],
  scatColors: { [key: string]: ScatType },
  scatValues: { [key: string]: string },
  selectedFeatures: string[],
  grandEnabled: boolean,
  scatZoneSplitter: { [key: string]: string },
  scatZoneMultipliers: { [key: string]: string },
  scatBoostValues: { [key: string]: string },
  scatSplitCount: { [key: string]: string }   // NEW
) {
  const offsets = [-1, 0, 1];
  const result: any = { reelStopPositions: reelStops };

  const scatSequence: string[] = [];
  const landedCoins: any[] = [];
  const boostValuesArray: (number | string)[] = Array(15).fill(0);
  const splitCountArray: (number | string)[] = Array(15).fill(0);

  let zoneSplitterValue: string | null = null;
  let zoneMultipliersValue: number[] | null = null;

  reelStops.forEach((stop, reelIndex) => {
    const reel = reels[reelIndex];

    offsets.forEach((offset, rowIndex) => {
      const index = (stop + offset + reel.length) % reel.length;

      if (reel[index] === "SCAT") {
        const key          = `${reelIndex}-${index}`;
        const scat         = scatColors[key];
        const value        = scatValues[key];
        const positionIndex = reelIndex * 3 + rowIndex;

        if (scat) {
          scatSequence.push(scat.label);

          // boostValues: orange or all
          if (scat.key === "orange" || scat.key === "all") {
            const bv = scatBoostValues[key];
            if (bv !== undefined && bv !== "") {
              boostValuesArray[positionIndex] = isNaN(Number(bv)) ? bv : Number(bv);
            }
          }

          // zone params: blue or all-color
          if (scat.key === "blue" || scat.key === "all") {
            const zs = scatZoneSplitter[key];
            if (zs) zoneSplitterValue = zs;
            const zm = scatZoneMultipliers[key];
            if (zm) {
              const parsed = zm.split(",").map((n) => n.trim()).filter(Boolean).map(Number);
              if (parsed.length > 0) zoneMultipliersValue = parsed;
            }
          }

          // numberOfSplitCoin: cerise or all-color
          if (scat.key === "cerise" || scat.key === "all") {
            const sc = scatSplitCount[key];
            if (sc !== undefined && sc !== "") {
              splitCountArray[positionIndex] = isNaN(Number(sc)) ? sc : Number(sc);
            }
          }
        }

        if (value !== undefined && value !== "") {
          landedCoins.push([reelIndex, rowIndex, value]);
        }
      }
    });
  });

  if (scatSequence.length > 0)  result.scatReplacement  = scatSequence;
  if (landedCoins.length > 0)   result.landedCoins       = landedCoins;
  if (selectedFeatures.length > 0) result.featureTriggered = selectedFeatures;
  else result.featureTriggered = [];

  result.canGrandTrigger = grandEnabled;

  if (zoneSplitterValue !== null)    result.zoneSplitter    = Number(zoneSplitterValue);
  if (zoneMultipliersValue !== null) result.zoneMultipliers = zoneMultipliersValue;

  const hasBoost = boostValuesArray.some((v) => v !== 0);
  if (hasBoost) result.boostValues = boostValuesArray;

  const hasSplitCount = splitCountArray.some((v) => v !== 0);
  if (hasSplitCount) result.numberOfSplitCoin = splitCountArray;

  return result;
}