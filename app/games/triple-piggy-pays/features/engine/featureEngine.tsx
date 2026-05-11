// /* eslint-disable @typescript-eslint/no-explicit-any */
// // app/games/triple-piggy-pays/features/engine/featureEngine.ts

// import { runWheelFeature } from "../wheel/wheelLogic";
// import { runZoneFeature } from "../zone/zoneLogic";


// type FeatureType = "WHEEL" | "TOWER" | "ZONE";

// export function runFeatures({
//   features,
//   grid,
// }: {
//   features: FeatureType[];
//   grid: any[][];
// }) {
//   let output: string[] = [];

//   if (features.includes("WHEEL")) {
//     const res = runWheelFeature(grid);
//     output = [...output, ...res.output];
//   }


//   if (features.includes("ZONE")) {
//   const res = runZoneFeature(grid);
//   output = [...output, ...res.output];
// }

 
//   // if (features.includes("TOWER")) { ... }

//   return { output };
// }

// app/games/triple-piggy-pays/features/engine/featureEngine.ts

/* eslint-disable @typescript-eslint/no-explicit-any */

import { runWheelFeature } from "../wheel/wheelLogic";

type FeatureType = "WHEEL" | "TOWER" | "ZONE";

export function runFeatures({
  features,
  grid,
}: {
  features: FeatureType[];
  grid: any[][];
}) {
  let output: string[] = [];

  // ✅ WHEEL stays here (stateless)
  if (features.includes("WHEEL")) {
    const res = runWheelFeature(grid);
    output = [...output, ...res.output];
  }

  // ❌ DO NOT handle ZONE here (stateful feature)

  return { output };
}