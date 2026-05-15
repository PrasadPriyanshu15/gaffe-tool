// /* eslint-disable @typescript-eslint/no-explicit-any */
// "use client";

// import { useState } from "react";
// import ReelColumn from "./ReelColumn";
// import { reels } from "./reels";
// import { ALL_FEATURES, ScatType } from "./config";
// import { ScatsState } from "./gaffeGenerator";

// type Props = {
//   reelStops:           number[];
//   setReelStops:        (val: number[]) => void;
//   scats:               ScatsState;
//   setScats:            (updater: (prev: ScatsState) => ScatsState) => void;
//   featureEnabled:      boolean;
//   setFeatureEnabled:   (val: boolean) => void;
//   grandEnabled:        boolean;
//   setGrandEnabled:     (val: boolean) => void;
//   selectedFeatures:    string[];
//   setSelectedFeatures: (val: string[]) => void;
//   onGoTo:              (features: string[]) => void;
// };

// const FEATURE_INACTIVE: Record<string, string> = {
//   double: "bg-gray-700 hover:bg-red-900 border border-red-900/50",
//   zone:   "bg-gray-700 hover:bg-blue-900 border border-blue-900/50",
//   extra:  "bg-gray-700 hover:bg-green-900 border border-green-900/50",
//   ultra:  "bg-gray-700 hover:bg-purple-900 border border-purple-900/50",
// };
// const FEATURE_ACTIVE: Record<string, string> = {
//   double: "bg-red-700 border border-red-400 ring-1 ring-red-300",
//   zone:   "bg-blue-700 border border-blue-400 ring-1 ring-blue-300",
//   extra:  "bg-green-700 border border-green-400 ring-1 ring-green-300",
//   ultra:  "bg-purple-700 border border-purple-400 ring-1 ring-purple-300",
// };

// export default function BaseGame({
//   reelStops, setReelStops, scats, setScats,
//   featureEnabled, setFeatureEnabled,
//   grandEnabled, setGrandEnabled,
//   selectedFeatures, setSelectedFeatures,
//   onGoTo,
// }: Props) {
//   const [isOpen, setIsOpen] = useState(true);

//   // Collect visible features from scats in the current reel window
//   const visibleFeatures = new Set<string>();
//   reels.forEach((reel, ri) => {
//     const stop = reelStops[ri];
//     [-1, 0, 1].forEach(off => {
//       const idx = (stop + off + reel.length) % reel.length;
//       if (reel[idx] === "SCAT") {
//         const scat = scats.colors[`${ri}-${idx}`] as ScatType | undefined;
//         if (scat) {
//           if (scat.key === "all") ALL_FEATURES.forEach(f => visibleFeatures.add(f));
//           else if (scat.feature !== "all") visibleFeatures.add(scat.feature);
//         }
//       }
//     });
//   });

//   return (
//     <div className="bg-gray-800 rounded-xl border border-gray-700">
//       <div onClick={() => setIsOpen(!isOpen)} className="flex justify-between items-center p-4 cursor-pointer select-none">
//         <h2 className="text-lg font-bold text-gray-200 font-mono"> Base Game</h2>
//         <span className="text-gray-500">{isOpen ? "▼" : "▶"}</span>
//       </div>

//       {isOpen && (
//         <div className="p-4 pt-0 flex flex-col gap-4">
//           {/* Reels */}
//           <div className="flex gap-2 overflow-x-auto pb-1">
//             {reels.map((reel, i) => (
//               <ReelColumn key={i} reelIndex={i} reel={reel} stop={reelStops[i]}
//                 setStop={(idx, val) => { const u = [...reelStops]; u[idx] = val; setReelStops(u); }}
//                 scats={scats} setScats={setScats} />
//             ))}
//           </div>

//           {/* Toggles */}
//           <div className="flex gap-3 items-center flex-wrap">
//             <button onClick={() => setFeatureEnabled(!featureEnabled)}
//               className={`px-4 py-2 rounded text-sm font-bold transition-all ${featureEnabled ? "bg-green-700 hover:bg-green-600" : "bg-gray-600 hover:bg-gray-500"}`}>
//               {featureEnabled ? "✓ Feature ON" : "Feature OFF"}
//             </button>
//             <button onClick={() => setGrandEnabled(!grandEnabled)}
//               className={`px-4 py-2 rounded text-sm font-bold transition-all ${grandEnabled ? "bg-yellow-500 text-black" : "bg-gray-600 text-white hover:bg-gray-500"}`}>
//               {grandEnabled ? "⭐ Grand ON" : "Grand"}
//             </button>
//             {!featureEnabled && <span className="text-red-400 text-xs font-mono">Feature Disabled</span>}
//           </div>

//           {/* Feature selector */}
//           {featureEnabled && visibleFeatures.size > 0 && (
//             <div className="flex flex-col gap-3">
//               <div className="flex gap-2 flex-wrap">
//                 {Array.from(visibleFeatures).map(f => {
//                   const active = selectedFeatures.includes(f);
//                   return (
//                     <button key={f}
//                       onClick={() => active
//                         ? setSelectedFeatures(selectedFeatures.filter(x => x !== f))
//                         : setSelectedFeatures([...selectedFeatures, f])}
//                       className={`px-4 py-2 rounded capitalize text-sm font-bold transition-all ${active ? FEATURE_ACTIVE[f] ?? "bg-gray-500" : FEATURE_INACTIVE[f] ?? "bg-gray-700"}`}>
//                       {f}
//                     </button>
//                   );
//                 })}
//               </div>
//               {selectedFeatures.length > 0 && (
//                 <button onClick={() => onGoTo(selectedFeatures)}
//                   className="px-5 py-2 bg-indigo-600 hover:bg-indigo-500 rounded font-bold text-sm self-start transition-all font-mono">
//                   Go to → {selectedFeatures.join(" + ")}
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
import ReelColumn from "./ReelColumn";
import { reels } from "./reels";
import { ALL_FEATURES, ScatType } from "./config";
import { ScatsState } from "./gaffeGenerator";

type Props = {
  reelStops:           number[];
  setReelStops:        (val: number[]) => void;
  scats:               ScatsState;
  setScats:            (updater: (prev: ScatsState) => ScatsState) => void;
  featureEnabled:      boolean;
  setFeatureEnabled:   (val: boolean) => void;
  selectedFeatures:    string[];
  setSelectedFeatures: (val: string[]) => void;
  onGoTo:              (features: string[]) => void;
};

const FEATURE_INACTIVE: Record<string, string> = {
  double: "bg-gray-700 hover:bg-red-900 border border-red-900/50",
  zone:   "bg-gray-700 hover:bg-blue-900 border border-blue-900/50",
  extra:  "bg-gray-700 hover:bg-green-900 border border-green-900/50",
  ultra:  "bg-gray-700 hover:bg-purple-900 border border-purple-900/50",
};
const FEATURE_ACTIVE: Record<string, string> = {
  double: "bg-red-700 border border-red-400 ring-1 ring-red-300",
  zone:   "bg-blue-700 border border-blue-400 ring-1 ring-blue-300",
  extra:  "bg-green-700 border border-green-400 ring-1 ring-green-300",
  ultra:  "bg-purple-700 border border-purple-400 ring-1 ring-purple-300",
};

export default function BaseGame({
  reelStops, setReelStops, scats, setScats,
  featureEnabled, setFeatureEnabled,
  selectedFeatures, setSelectedFeatures,
  onGoTo,
}: Props) {
  const [isOpen, setIsOpen] = useState(true);

  // Collect visible features from scats in the current reel window
  const visibleFeatures = new Set<string>();
  reels.forEach((reel, ri) => {
    const stop = reelStops[ri];
    [-1, 0, 1].forEach(off => {
      const idx = (stop + off + reel.length) % reel.length;
      if (reel[idx] === "SCAT") {
        const scat = scats.colors[`${ri}-${idx}`] as ScatType | undefined;
        if (scat) {
          if (scat.key === "all") ALL_FEATURES.forEach(f => visibleFeatures.add(f.toLowerCase()));
          else if (scat.feature !== "all") visibleFeatures.add(scat.feature);
        }
      }
    });
  });

  // Only show GO TO when at least one SCAT is visible and a feature is selected
  const hasScat = visibleFeatures.size > 0;

  return (
    <div className="bg-gray-800 rounded-xl border border-gray-700">
      <div onClick={() => setIsOpen(!isOpen)} className="flex justify-between items-center p-4 cursor-pointer select-none">
        <h2 className="text-lg font-bold text-gray-200 font-mono"> Base Game</h2>
        <span className="text-gray-500">{isOpen ? "▼" : "▶"}</span>
      </div>

      {isOpen && (
        <div className="p-4 pt-0 flex flex-col gap-4">
          {/* Reels */}
          <div className="flex gap-2 overflow-x-auto pb-1">
            {reels.map((reel, i) => (
              <ReelColumn key={i} reelIndex={i} reel={reel} stop={reelStops[i]}
                setStop={(idx, val) => { const u = [...reelStops]; u[idx] = val; setReelStops(u); }}
                scats={scats} setScats={setScats} />
            ))}
          </div>

          {/* Feature toggle */}
          <div className="flex gap-3 items-center flex-wrap">
            <button onClick={() => setFeatureEnabled(!featureEnabled)}
              className={`px-4 py-2 rounded text-sm font-bold transition-all ${featureEnabled ? "bg-green-700 hover:bg-green-600" : "bg-gray-600 hover:bg-gray-500"}`}>
              {featureEnabled ? "✓ Feature ON" : "Feature OFF"}
            </button>
            {!featureEnabled && <span className="text-red-400 text-xs font-mono">Feature Disabled</span>}
          </div>

          {/* Feature selector — only shown when a SCAT is visible */}
          {featureEnabled && hasScat && (
            <div className="flex flex-col gap-3">
              <div className="flex gap-2 flex-wrap">
                {Array.from(visibleFeatures).map(f => {
                  const active = selectedFeatures.includes(f);
                  return (
                    <button key={f}
                      onClick={() => active
                        ? setSelectedFeatures(selectedFeatures.filter(x => x !== f))
                        : setSelectedFeatures([...selectedFeatures, f])}
                      className={`px-4 py-2 rounded capitalize text-sm font-bold transition-all ${active ? FEATURE_ACTIVE[f] ?? "bg-gray-500" : FEATURE_INACTIVE[f] ?? "bg-gray-700"}`}>
                      {f}
                    </button>
                  );
                })}
              </div>
              {selectedFeatures.length > 0 && (
                <button onClick={() => onGoTo(selectedFeatures)}
                  className="px-5 py-2 bg-indigo-600 hover:bg-indigo-500 rounded font-bold text-sm self-start transition-all font-mono">
                  Go to → {selectedFeatures.join(" + ")}
                </button>
              )}
            </div>
          )}
        </div>
      )}
    </div>
  );
}