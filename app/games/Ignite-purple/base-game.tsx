


// /* eslint-disable @typescript-eslint/no-explicit-any */
// "use client";

// import { useState } from "react";
// import ReelColumn from "../Ignite-purple/components/ReelColumn";
// import { reels } from "./reels";

// type ScatType = {
//   key: "orange" | "blue" | "cerise" | "green" | "all";
//   label: string;
//   feature: string;
// };

// type Props = {
//   reelStops: number[];
//   setReelStops: (val: number[]) => void;

//   scatColors: { [key: string]: ScatType };
//   setScatColors: (val: any) => void;

//   scatValues: { [key: string]: string };
//   setScatValues: (val: any) => void;

//   scatZoneSplitter: { [key: string]: string };
//   setScatZoneSplitter: (val: any) => void;

//   scatZoneMultipliers: { [key: string]: string };
//   setScatZoneMultipliers: (val: any) => void;

//   scatBoostValues: { [key: string]: string };
//   setScatBoostValues: (val: any) => void;

//   featureEnabled: boolean;
//   setFeatureEnabled: (val: boolean) => void;

//   grandEnabled: boolean;
//   setGrandEnabled: (val: boolean) => void;

//   selectedFeatures: string[];
//   setSelectedFeatures: (val: string[]) => void;

//   onGoTo: (features: string[]) => void;
// };

// // All 4 individual features (for All-Color expansion)
// const ALL_FEATURES = ["strike", "zone", "split", "extra"];

// export default function BaseGame({
//   reelStops,
//   setReelStops,
//   scatColors,
//   setScatColors,
//   scatValues,
//   setScatValues,
//   scatZoneSplitter,
//   setScatZoneSplitter,
//   scatZoneMultipliers,
//   setScatZoneMultipliers,
//   scatBoostValues,
//   setScatBoostValues,
//   featureEnabled,
//   setFeatureEnabled,
//   grandEnabled,
//   setGrandEnabled,
//   selectedFeatures,
//   setSelectedFeatures,
//   onGoTo,
// }: Props) {

//   const [isOpen, setIsOpen] = useState(true);

//   // Compute visible features from scats on the grid
//   const visibleFeatures = new Set<string>();

//   reels.forEach((reel, reelIndex) => {
//     const stop = reelStops[reelIndex];

//     [-1, 0, 1].forEach((offset) => {
//       const index = (stop + offset + reel.length) % reel.length;

//       if (reel[index] === "SCAT") {
//         const key = `${reelIndex}-${index}`;
//         const scat = scatColors[key];

//         if (scat) {
//           if (scat.key === "all") {
//             // All-Color expands into all 4 features
//             ALL_FEATURES.forEach((f) => visibleFeatures.add(f));
//           } else {
//             visibleFeatures.add(scat.feature);
//           }
//         }
//       }
//     });
//   });

//   return (
//     <div className="bg-gray-800 rounded-xl">

//       <div
//         onClick={() => setIsOpen(!isOpen)}
//         className="flex justify-between items-center p-4 cursor-pointer"
//       >
//         <h2 className="text-lg font-semibold">Base Game</h2>
//         <span>{isOpen ? "▼" : "▶"}</span>
//       </div>

//       {isOpen && (
//         <div className="p-6 pt-0">

//           {/* REEL COLUMNS */}
//           <div className="flex gap-4">
//             {reels.map((reel, i) => (
//               <ReelColumn
//                 key={i}
//                 reelIndex={i}
//                 reel={reel}
//                 stop={reelStops[i]}
//                 setStop={(index, value) => {
//                   const updated = [...reelStops];
//                   updated[index] = value;
//                   setReelStops(updated);
//                 }}
//                 scatColors={scatColors}
//                 setScatColors={setScatColors}
//                 scatValues={scatValues}
//                 setScatValues={setScatValues}
//                 scatZoneSplitter={scatZoneSplitter}
//                 setScatZoneSplitter={setScatZoneSplitter}
//                 scatZoneMultipliers={scatZoneMultipliers}
//                 setScatZoneMultipliers={setScatZoneMultipliers}
//                 scatBoostValues={scatBoostValues}
//                 setScatBoostValues={setScatBoostValues}
//               />
//             ))}
//           </div>

//           {/* FEATURE ENABLED + GRAND BUTTONS */}
//           <div className="mt-4 flex gap-3 items-center flex-wrap">
//             <button
//               onClick={() => setFeatureEnabled(!featureEnabled)}
//               className={`px-4 py-2 rounded ${
//                 featureEnabled ? "bg-green-600" : "bg-gray-600"
//               }`}
//             >
//               Feature Enabled
//             </button>

//             <button
//               onClick={() => setGrandEnabled(!grandEnabled)}
//               className={`px-4 py-2 rounded font-semibold ${
//                 grandEnabled
//                   ? "bg-yellow-500 text-black"
//                   : "bg-gray-600 text-white"
//               }`}
//             >
//               {grandEnabled ? "Grand True" : "Grand"}
//             </button>

//             {!featureEnabled && (
//               <div className="text-red-400 text-sm">Feature Disabled</div>
//             )}
//           </div>

//           {/* FEATURE SELECTORS */}
//           {featureEnabled && visibleFeatures.size > 0 && (
//             <div className="mt-4 flex flex-col gap-3">

//               {/* MULTI SELECT */}
//               <div className="flex gap-2 flex-wrap">
//                 {Array.from(visibleFeatures).map((feature) => {
//                   const isActive = selectedFeatures.includes(feature);

//                   return (
//                     <button
//                       key={feature}
//                       onClick={() => {
//                         if (isActive) {
//                           setSelectedFeatures(
//                             selectedFeatures.filter((f) => f !== feature)
//                           );
//                         } else {
//                           setSelectedFeatures([...selectedFeatures, feature]);
//                         }
//                       }}
//                       className={`px-4 py-2 rounded capitalize ${
//                         isActive ? "bg-green-600" : "bg-gray-600"
//                       }`}
//                     >
//                       {feature}
//                     </button>
//                   );
//                 })}
//               </div>

//               {/* GO BUTTON */}
//               {selectedFeatures.length > 0 && (
//                 <button
//                   onClick={() => onGoTo(selectedFeatures)}
//                   className="px-5 py-2 bg-purple-600 rounded font-semibold hover:bg-purple-500"
//                 >
//                   Go to {selectedFeatures.join(" + ")}
//                 </button>
//               )}

//             </div>
//           )}

//         </div>
//       )}
//     </div>
//   );
// }




/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { useState } from "react";
import ReelColumn from "../Ignite-purple/components/ReelColumn";
import { reels } from "./reels";

type ScatType = {
  key: "orange" | "blue" | "cerise" | "green" | "all";
  label: string;
  feature: string;
};

type Props = {
  reelStops: number[];
  setReelStops: (val: number[]) => void;

  scatColors:            { [key: string]: ScatType };
  setScatColors:         (val: any) => void;
  scatValues:            { [key: string]: string };
  setScatValues:         (val: any) => void;
  scatZoneSplitter:      { [key: string]: string };
  setScatZoneSplitter:   (val: any) => void;
  scatZoneMultipliers:   { [key: string]: string };
  setScatZoneMultipliers:(val: any) => void;
  scatBoostValues:       { [key: string]: string };
  setScatBoostValues:    (val: any) => void;
  scatSplitCount:        { [key: string]: string };  // NEW
  setScatSplitCount:     (val: any) => void;          // NEW

  featureEnabled: boolean;
  setFeatureEnabled: (val: boolean) => void;
  grandEnabled: boolean;
  setGrandEnabled: (val: boolean) => void;
  selectedFeatures: string[];
  setSelectedFeatures: (val: string[]) => void;
  onGoTo: (features: string[]) => void;
};

const ALL_FEATURES = ["strike", "zone", "split", "extra"];

export default function BaseGame({
  reelStops, setReelStops,
  scatColors, setScatColors,
  scatValues, setScatValues,
  scatZoneSplitter, setScatZoneSplitter,
  scatZoneMultipliers, setScatZoneMultipliers,
  scatBoostValues, setScatBoostValues,
  scatSplitCount, setScatSplitCount,
  featureEnabled, setFeatureEnabled,
  grandEnabled, setGrandEnabled,
  selectedFeatures, setSelectedFeatures,
  onGoTo,
}: Props) {
  const [isOpen, setIsOpen] = useState(true);

  // Collect features visible from current scats
  const visibleFeatures = new Set<string>();
  reels.forEach((reel, reelIndex) => {
    const stop = reelStops[reelIndex];
    [-1, 0, 1].forEach((offset) => {
      const index = (stop + offset + reel.length) % reel.length;
      if (reel[index] === "SCAT") {
        const key  = `${reelIndex}-${index}`;
        const scat = scatColors[key];
        if (scat) {
          if (scat.key === "all") ALL_FEATURES.forEach((f) => visibleFeatures.add(f));
          else visibleFeatures.add(scat.feature);
        }
      }
    });
  });

  return (
    <div className="bg-gray-800 rounded-xl">
      <div onClick={() => setIsOpen(!isOpen)} className="flex justify-between items-center p-4 cursor-pointer">
        <h2 className="text-lg font-semibold">Base Game</h2>
        <span>{isOpen ? "▼" : "▶"}</span>
      </div>

      {isOpen && (
        <div className="p-6 pt-0">

          {/* REELS */}
          <div className="flex gap-4">
            {reels.map((reel, i) => (
              <ReelColumn
                key={i}
                reelIndex={i}
                reel={reel}
                stop={reelStops[i]}
                setStop={(idx, val) => {
                  const u = [...reelStops]; u[idx] = val; setReelStops(u);
                }}
                scatColors={scatColors}         setScatColors={setScatColors}
                scatValues={scatValues}         setScatValues={setScatValues}
                scatZoneSplitter={scatZoneSplitter}     setScatZoneSplitter={setScatZoneSplitter}
                scatZoneMultipliers={scatZoneMultipliers} setScatZoneMultipliers={setScatZoneMultipliers}
                scatBoostValues={scatBoostValues}       setScatBoostValues={setScatBoostValues}
                scatSplitCount={scatSplitCount}         setScatSplitCount={setScatSplitCount}
              />
            ))}
          </div>

          {/* FEATURE ENABLED + GRAND */}
          <div className="mt-4 flex gap-3 items-center flex-wrap">
            <button
              onClick={() => setFeatureEnabled(!featureEnabled)}
              className={`px-4 py-2 rounded ${featureEnabled ? "bg-green-600" : "bg-gray-600"}`}
            >
              Feature Enabled
            </button>
            <button
              onClick={() => setGrandEnabled(!grandEnabled)}
              className={`px-4 py-2 rounded font-semibold ${grandEnabled ? "bg-yellow-500 text-black" : "bg-gray-600 text-white"}`}
            >
              {grandEnabled ? "⭐ Grand ON" : "Grand"}
            </button>
            {!featureEnabled && <div className="text-red-400 text-sm">Feature Disabled</div>}
          </div>

          {/* FEATURE BUTTONS + GO TO */}
          {featureEnabled && visibleFeatures.size > 0 && (
            <div className="mt-4 flex flex-col gap-3">
              <div className="flex gap-2 flex-wrap">
                {Array.from(visibleFeatures).map((feature) => {
                  const isActive = selectedFeatures.includes(feature);
                  return (
                    <button
                      key={feature}
                      onClick={() => {
                        if (isActive) setSelectedFeatures(selectedFeatures.filter((f) => f !== feature));
                        else setSelectedFeatures([...selectedFeatures, feature]);
                      }}
                      className={`px-4 py-2 rounded capitalize ${isActive ? "bg-green-600" : "bg-gray-600"}`}
                    >
                      {feature}
                    </button>
                  );
                })}
              </div>
              {selectedFeatures.length > 0 && (
                <button
                  onClick={() => onGoTo(selectedFeatures)}
                  className="px-5 py-2 bg-purple-600 rounded font-semibold hover:bg-purple-500"
                >
                  Go to {selectedFeatures.join(" + ")}
                </button>
              )}
            </div>
          )}

        </div>
      )}
    </div>
  );
}