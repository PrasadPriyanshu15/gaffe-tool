


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



//! latest 
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
//   const splitCountArray: (number | string)[] = Array(15).fill(0);

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

//           // numberOfSplitCoin: cerise or all-color
//           if (scat.key === "cerise" || scat.key === "all") {
//             const sc = scatSplitCount[key];
//             if (sc !== undefined && sc !== "") {
//               splitCountArray[positionIndex] = isNaN(Number(sc)) ? sc : Number(sc);
//             }
//           }
//         }

//         if (value !== undefined && value !== "") {
//           landedCoins.push([reelIndex, rowIndex, value]);
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

//   const hasSplitCount = splitCountArray.some((v) => v !== 0);
//   if (hasSplitCount) result.numberOfSplitCoin = splitCountArray;

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
  scatSplitCount: { [key: string]: string },   // NEW
  scatSplitValues: { [key: string]: string[] } = {}   // NEW — per-split-coin values. index j = split coin (j+2), i.e. array[0] is the 2nd coin's value, array[1] is the 3rd coin's value, etc.
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

        // landedCoins — when this position has a split count >= 2 (cerise/all),
        // emit one entry per split coin: [reelIndex, rowIndex, value, splitIndex]
        // splitIndex 0 = the 1st (original) coin, 1 = 2nd coin, 2 = 3rd coin, etc.
        const splitCountNum = (scat && (scat.key === "cerise" || scat.key === "all"))
          ? Number(scatSplitCount[key]) || 0
          : 0;

        if (splitCountNum >= 2) {
          const extraValues = scatSplitValues[key] || [];
          if (value !== undefined && value !== "") {
            landedCoins.push([reelIndex, rowIndex, value, 0]);
          }
          for (let splitIdx = 1; splitIdx < splitCountNum; splitIdx++) {
            const extraValue = extraValues[splitIdx - 1];
            if (extraValue !== undefined && extraValue !== "") {
              landedCoins.push([reelIndex, rowIndex, extraValue, splitIdx]);
            }
          }
        } else if (value !== undefined && value !== "") {
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

  // splitCoinsBoostValues — for positions that have BOTH a boost value and a
  // split count set (i.e. an "all" scat with both fields filled in), provide
  // one extra copy of boostValues for every extra split coin beyond the first.
  // e.g. split count = 4 -> boostValues (1st coin) + 3 extra copies here.
  let maxQualifyingSplit = 0;
  for (let pos = 0; pos < boostValuesArray.length; pos++) {
    if (boostValuesArray[pos] !== 0 && splitCountArray[pos] !== 0) {
      const sc = Number(splitCountArray[pos]);
      if (sc > maxQualifyingSplit) maxQualifyingSplit = sc;
    }
  }
  if (maxQualifyingSplit > 1) {
    result.splitCoinsBoostValues = Array.from(
      { length: maxQualifyingSplit - 1 },
      () => [...boostValuesArray]
    );
  }

  return result;
}