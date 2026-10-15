



// /* eslint-disable @typescript-eslint/no-explicit-any */
// "use client";

// import { useState } from "react";
// import ReelColumn from "../Ignite-purple/components/ReelColumn";

// type ScatType = {
//   key: "orange" | "blue" | "cerise" | "green" | "all";
//   label: string;
//   feature: string;
// };

// type Props = {
//   reelStops: number[];
//   setReelStops: (val: number[]) => void;

//   scatColors:            { [key: string]: ScatType };
//   setScatColors:         (val: any) => void;
//   scatValues:            { [key: string]: string };
//   setScatValues:         (val: any) => void;
//   scatZoneSplitter:      { [key: string]: string };
//   setScatZoneSplitter:   (val: any) => void;
//   scatZoneMultipliers:   { [key: string]: string };
//   setScatZoneMultipliers:(val: any) => void;
//   scatBoostValues:       { [key: string]: string };
//   setScatBoostValues:    (val: any) => void;
//   scatSplitCount:        { [key: string]: string };  // NEW
//   setScatSplitCount:     (val: any) => void;          // NEW

//   featureEnabled: boolean;
//   setFeatureEnabled: (val: boolean) => void;
//   grandEnabled: boolean;
//   setGrandEnabled: (val: boolean) => void;
//   selectedFeatures: string[];
//   setSelectedFeatures: (val: string[]) => void;
//   onGoTo: (features: string[]) => void;
// };

// const ALL_FEATURES = ["strike", "zone", "split", "extra"];

// export default function BaseGame({
//   reelStops, setReelStops,
//   scatColors, setScatColors,
//   scatValues, setScatValues,
//   scatZoneSplitter, setScatZoneSplitter,
//   scatZoneMultipliers, setScatZoneMultipliers,
//   scatBoostValues, setScatBoostValues,
//   scatSplitCount, setScatSplitCount,
//   featureEnabled, setFeatureEnabled,
//   grandEnabled, setGrandEnabled,
//   selectedFeatures, setSelectedFeatures,
//   onGoTo,
// }: Props) {
//   const [isOpen, setIsOpen] = useState(true);

//   // Collect features visible from current scats
//   const visibleFeatures = new Set<string>();
//   reels.forEach((reel, reelIndex) => {
//     const stop = reelStops[reelIndex];
//     [-1, 0, 1].forEach((offset) => {
//       const index = (stop + offset + reel.length) % reel.length;
//       if (reel[index] === "SCAT") {
//         const key  = `${reelIndex}-${index}`;
//         const scat = scatColors[key];
//         if (scat) {
//           if (scat.key === "all") ALL_FEATURES.forEach((f) => visibleFeatures.add(f));
//           else visibleFeatures.add(scat.feature);
//         }
//       }
//     });
//   });

//   return (
//     <div className="bg-gray-800 rounded-xl">
//       <div onClick={() => setIsOpen(!isOpen)} className="flex justify-between items-center p-4 cursor-pointer">
//         <h2 className="text-lg font-semibold">Base Game</h2>
//         <span>{isOpen ? "▼" : "▶"}</span>
//       </div>

//       {isOpen && (
//         <div className="p-6 pt-0">

//           {/* REELS */}
//           <div className="flex gap-4">
//             {reels.map((reel, i) => (
//               <ReelColumn
//                 key={i}
//                 reelIndex={i}
//                 reel={reel}
//                 stop={reelStops[i]}
//                 setStop={(idx, val) => {
//                   const u = [...reelStops]; u[idx] = val; setReelStops(u);
//                 }}
//                 scatColors={scatColors}         setScatColors={setScatColors}
//                 scatValues={scatValues}         setScatValues={setScatValues}
//                 scatZoneSplitter={scatZoneSplitter}     setScatZoneSplitter={setScatZoneSplitter}
//                 scatZoneMultipliers={scatZoneMultipliers} setScatZoneMultipliers={setScatZoneMultipliers}
//                 scatBoostValues={scatBoostValues}       setScatBoostValues={setScatBoostValues}
//                 scatSplitCount={scatSplitCount}         setScatSplitCount={setScatSplitCount}
//               />
//             ))}
//           </div>

//           {/* FEATURE ENABLED + GRAND */}
//           <div className="mt-4 flex gap-3 items-center flex-wrap">
//             <button
//               onClick={() => setFeatureEnabled(!featureEnabled)}
//               className={`px-4 py-2 rounded ${featureEnabled ? "bg-green-600" : "bg-gray-600"}`}
//             >
//               Feature Enabled
//             </button>
//             <button
//               onClick={() => setGrandEnabled(!grandEnabled)}
//               className={`px-4 py-2 rounded font-semibold ${grandEnabled ? "bg-yellow-500 text-black" : "bg-gray-600 text-white"}`}
//             >
//               {grandEnabled ? "⭐ Grand ON" : "Grand"}
//             </button>
//             {!featureEnabled && <div className="text-red-400 text-sm">Feature Disabled</div>}
//           </div>

//           {/* FEATURE BUTTONS + GO TO */}
//           {featureEnabled && visibleFeatures.size > 0 && (
//             <div className="mt-4 flex flex-col gap-3">
//               <div className="flex gap-2 flex-wrap">
//                 {Array.from(visibleFeatures).map((feature) => {
//                   const isActive = selectedFeatures.includes(feature);
//                   return (
//                     <button
//                       key={feature}
//                       onClick={() => {
//                         if (isActive) setSelectedFeatures(selectedFeatures.filter((f) => f !== feature));
//                         else setSelectedFeatures([...selectedFeatures, feature]);
//                       }}
//                       className={`px-4 py-2 rounded capitalize ${isActive ? "bg-green-600" : "bg-gray-600"}`}
//                     >
//                       {feature}
//                     </button>
//                   );
//                 })}
//               </div>
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
import ReelstripUploader from "@/components/ReelstripUploader";
import { visibleCells } from "@/lib/reelGrid";

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
  scatSplitValues:       { [key: string]: string[] }; // NEW
  setScatSplitValues:    (val: any) => void;           // NEW

  featureEnabled: boolean;
  setFeatureEnabled: (val: boolean) => void;
  grandEnabled: boolean;
  setGrandEnabled: (val: boolean) => void;
  selectedFeatures: string[];
  setSelectedFeatures: (val: string[]) => void;
  onGoTo: (features: string[]) => void;
  onUploadReels?: (reels: string[][]) => void;

  reels: string[][];
  rows: number;
  setRows: (val: number) => void;
  offset: number;
  setOffset: (val: number) => void;
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
  scatSplitValues, setScatSplitValues,
  featureEnabled, setFeatureEnabled,
  grandEnabled, setGrandEnabled,
  selectedFeatures, setSelectedFeatures,
  onGoTo,
  onUploadReels,
  reels,
  rows, setRows,
  offset, setOffset,
}: Props) {
  const [isOpen, setIsOpen] = useState(true);

  // Collect features visible from current scats
  const visibleFeatures = new Set<string>();
  reels.forEach((reel, reelIndex) => {
    const stop = reelStops[reelIndex] ?? 0;
    visibleCells(reel, stop, offset, rows).forEach((cell) => {
      if (cell.symbol === "SCAT" && cell.stripIndex !== null) {
        const key  = `${reelIndex}-${cell.stripIndex}`;
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

          {/* UPLOAD REELSTRIP */}
          <div className="mb-4">
            <ReelstripUploader onLoaded={onUploadReels} />
          </div>

          {/* GRID ROWS + OFFSET (global) */}
          <div className="mb-4 flex items-center gap-3 flex-wrap">
            <label className="text-sm text-gray-300">Rows</label>
            <input
              type="number"
              min={1}
              max={12}
              value={rows}
              onChange={(e) =>
                setRows(Math.max(1, Math.min(12, Number(e.target.value) || 1)))
              }
              className="w-16 px-2 py-1 bg-gray-700 text-white rounded"
            />

            <label className="text-sm text-gray-300 ml-1">Offset</label>
            <select
              value={Math.max(0, Math.min(offset, rows - 1))}
              onChange={(e) => setOffset(Number(e.target.value))}
              className="px-2 py-1 bg-gray-700 text-white rounded"
            >
              {Array.from({ length: Math.max(rows, 1) }, (_, r) => (
                <option key={r} value={r}>row {r}</option>
              ))}
            </select>
            <span className="text-xs text-gray-500 italic">
              anchor row where each reel&apos;s stop symbol lands
            </span>
          </div>

          {/* REELS */}
          {reels.length === 0 ? (
            <div className="text-sm text-gray-400 italic py-6 text-center border border-dashed border-gray-600 rounded-lg">
              No reelstrip loaded. Upload a reelstrip JSON to populate the grid.
            </div>
          ) : (
          <div className="flex gap-4 overflow-x-auto pb-1">
            {reels.map((reel, i) => (
              <ReelColumn
                key={i}
                reelIndex={i}
                reel={reel}
                stop={reelStops[i] ?? 0}
                rows={rows}
                offset={offset}
                setStop={(idx, val) => {
                  const u = [...reelStops]; u[idx] = val; setReelStops(u);
                }}
                scatColors={scatColors}         setScatColors={setScatColors}
                scatValues={scatValues}         setScatValues={setScatValues}
                scatZoneSplitter={scatZoneSplitter}     setScatZoneSplitter={setScatZoneSplitter}
                scatZoneMultipliers={scatZoneMultipliers} setScatZoneMultipliers={setScatZoneMultipliers}
                scatBoostValues={scatBoostValues}       setScatBoostValues={setScatBoostValues}
                scatSplitCount={scatSplitCount}         setScatSplitCount={setScatSplitCount}
                scatSplitValues={scatSplitValues}       setScatSplitValues={setScatSplitValues}
              />
            ))}
          </div>
          )}

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