/* eslint-disable @typescript-eslint/no-explicit-any */
import { visibleCells } from "@/lib/reelGrid";

function getRandomColor() {
  const colors = ["red", "blue", "purple"];
  return colors[Math.floor(Math.random() * colors.length)];
}

function formatColor(color: string) {
  return `${color.toUpperCase()}_SCAT`;
}

function getRandomStackSymbol() {
  const symbols = [
    "PIC1","PIC2","PIC3","PIC4","PIC5",
    "ACE","K","Q","J","10","9"
  ];
  return symbols[Math.floor(Math.random() * symbols.length)];
}

export function generateGaffe(
  reelStops: number[],
  reels: string[][],
  triggers: { grand: boolean; major: boolean },
  scatColors: { [key: string]: string },
  stackValue: string,

  featureEnabled: boolean,  //! feature
featureTriggers: {
  WHEEL: boolean;
  TOWER: boolean;
  ZONE: boolean;
},
  rows: number,
  offset: number
) {
  // Reel stops are 1-based, so the landed strip index is stop - 1; the visible
  // window is derived from the global rows / anchor-row offset.
  const visible = (reel: string[], stop: number) =>
    visibleCells(reel, stop - 1, offset, rows);

  //Check SCAT
  let hasAnyScat = false;

  reelStops.forEach((stop, reelIndex) => {
    const reel = reels[reelIndex];

    visible(reel, stop).forEach((cell) => {
      if (cell.symbol === "SCAT") {
        hasAnyScat = true;
      }
    });
  });

  // Check STACK
  let hasStack = false;

  reelStops.forEach((stop, reelIndex) => {
    const reel = reels[reelIndex];

    visible(reel, stop).forEach((cell) => {
      if (cell.symbol === "STACK") {
        hasStack = true;
      }
    });
  });

  //Build base result
  const result: any = {
    reelStopPositions: reelStops,
    ...(triggers.grand && { triggerGrandJackpot: true }),
    ...(triggers.major && { triggerMajorJackpot: true })
  };

  
  if (hasStack) {
    const finalStack = stackValue
      ? stackValue
      : getRandomStackSymbol();

    result.stack = finalStack;
  }

  
  if (hasAnyScat) {
    const scatReplacement: string[] = new Array(6).fill(null);

    reelStops.forEach((stop, reelIndex) => {
      const reel = reels[reelIndex];

      const scatPositions: number[] = [];

      visible(reel, stop).forEach((cell) => {
        if (cell.symbol === "SCAT" && cell.stripIndex !== null) {
          scatPositions.push(cell.stripIndex);
        }
      });

      //  REEL 3 SPECIAL LOGIC
      if (reelIndex === 2) {
        const allScatPositions: number[] = [];

        reel.forEach((sym, idx) => {
          if (sym === "SCAT") {
            allScatPositions.push(idx);
          }
        });

        const firstScat = allScatPositions[0];
        const secondScat = allScatPositions[1];

        // Default random
        scatReplacement[2] = formatColor(getRandomColor());
        scatReplacement[3] = formatColor(getRandomColor());

        // Override if visible
        scatPositions.forEach((visibleIndex) => {
          const key = `${reelIndex}-${visibleIndex}`;
          const color = scatColors[key] || getRandomColor();

          if (visibleIndex === firstScat) {
            scatReplacement[2] = formatColor(color);
          } else if (visibleIndex === secondScat) {
            scatReplacement[3] = formatColor(color);
          }
        });
      }

      // 🎯 OTHER REELS
      else {
        const targetIndex =
          reelIndex < 2 ? reelIndex : reelIndex + 1;

        if (scatPositions.length > 0) {
          const visibleIndex = scatPositions[0];
          const key = `${reelIndex}-${visibleIndex}`;
          const color = scatColors[key] || getRandomColor();

          scatReplacement[targetIndex] = formatColor(color);
        } else {
          scatReplacement[targetIndex] = formatColor(getRandomColor());
        }
      }
    });
    console.log("GEN STOP:", reelStops);

    result.scatReplacement = scatReplacement;
  }


  // ✅ FEATURE LOGIC

if (!featureEnabled) {
  result.isFeatureTriggered = false;
} else {
  const features: string[] = [];

  if (featureTriggers.WHEEL) features.push("WHEEL");
  if (featureTriggers.TOWER) features.push("TOWER");
  if (featureTriggers.ZONE) features.push("ZONE");

  if (features.length > 0) {
    result.featureTriggered = features;
  }
}


  return result;
}