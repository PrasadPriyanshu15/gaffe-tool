


//! wrong comnbination 
/* eslint-disable @typescript-eslint/no-explicit-any */
// "use client";

// import { useState, useMemo } from "react";
// import BaseGame          from "./base-game";
// import GaffeOutput       from "./GaffeOutput";
// import WheelFeature      from "./wheelFeature";
// import ZoneFeature       from "./zoneFeature";
// import TowerFeature      from "./towerFeature";
// import CombinationFeature from "./combinationFeature";
// import { reels }         from "./reels";
// import { generateGaffe, getBaseCoinsForFeature, BaseCoin } from "./gaffeGenerator";
// import { ScatType }      from "./ReelColumn";

// // ─── Types ────────────────────────────────────────────────────────────────────
// type FeatureKey = "wheel" | "zone" | "tower";

// const FEATURE_COLOR: Record<string, string> = {
//   wheel: "text-red-400",
//   zone:  "text-purple-400",
//   tower: "text-blue-400",
// };
// const FEATURE_LABEL: Record<string, string> = {
//   wheel: "WHEEL",
//   zone:  "ZONE",
//   tower: "TOWER",
// };

// // ─── Page ─────────────────────────────────────────────────────────────────────
// export default function Page() {

//   // ── Base game state ───────────────────────────────────────────────────────
//   const [reelStops,        setReelStops]        = useState<number[]>([0, 0, 0, 0, 0]);
//   const [scatColors,       setScatColors]       = useState<{ [key: string]: ScatType }>({});
//   const [scatValues,       setScatValues]       = useState<{ [key: string]: string }>({});
//   const [stackSymbol,      setStackSymbol]      = useState<string | null>(null);
//   const [featureEnabled,   setFeatureEnabled]   = useState<boolean>(true);
//   const [grandEnabled,     setGrandEnabled]     = useState<boolean>(false);
//   const [majorEnabled,     setMajorEnabled]     = useState<boolean>(false);
//   const [selectedFeatures, setSelectedFeatures] = useState<string[]>([]);

//   // ── Navigation ────────────────────────────────────────────────────────────
//   // "base" | "wheel" | "zone" | "tower" | "wheel-zone" | "wheel-tower" | etc.
//   const [activeSection,    setActiveSection]    = useState<string>("base");

//   // ── Feature gaffe history ─────────────────────────────────────────────────
//   // For single features: array of formatted spin lines
//   const [singleFeatureLines, setSingleFeatureLines] = useState<string[]>([]);
//   // For combination: formatted output block from CombinationFeature
//   const [comboOutput, setComboOutput]               = useState<string>("");

//   // ── Base coins for each feature (seeded on GO TO) ─────────────────────────
//   const [featureBaseCoins, setFeatureBaseCoins] = useState<Record<string, BaseCoin[]>>({});

//   // ── Live base gaffe ───────────────────────────────────────────────────────
//   const gaffe = useMemo(
//     () => generateGaffe(
//       reelStops, reels,
//       scatColors, scatValues,
//       selectedFeatures, featureEnabled,
//       grandEnabled, majorEnabled, stackSymbol
//     ),
//     [reelStops, scatColors, scatValues, selectedFeatures, featureEnabled, grandEnabled, majorEnabled, stackSymbol]
//   );

//   // ── Derived state ─────────────────────────────────────────────────────────
//   const isFeatureSection  = activeSection !== "base";
//   const isCombination     = activeSection.includes("-");
//   const activeFeatureKeys = activeSection.split("-") as FeatureKey[];

//   // ── Handlers ─────────────────────────────────────────────────────────────
//   const handleGoTo = (features: string[]) => {
//     const coins: Record<string, BaseCoin[]> = {};
//     features.forEach(f => {
//       coins[f] = getBaseCoinsForFeature(f, reelStops, reels, scatColors, scatValues);
//     });
//     setFeatureBaseCoins(coins);
//     setSingleFeatureLines([]);
//     setComboOutput("");
//     setActiveSection(features.join("-"));
//   };

//   const handleBack = () => {
//     setActiveSection("base");
//     setSingleFeatureLines([]);
//     setComboOutput("");
//     setFeatureBaseCoins({});
//   };

//   // What appears in the GaffeOutput panel depends on context:
//   //   base          → base gaffe + no extra lines
//   //   single feature → base gaffe + spin history lines
//   //   combination    → base gaffe + combo block
//   const featureGaffes: string[] = isFeatureSection
//     ? isCombination
//       ? comboOutput ? [comboOutput] : []
//       : singleFeatureLines
//     : [];

//   // ─── Render ─────────────────────────────────────────────────────────────────
//   return (
//     <div className="min-h-screen text-white p-6" style={{ background: "#0d1117" }}>

//       {/* Top nav */}
//       <div className="mb-4">
//         {isFeatureSection ? (
//           <button
//             onClick={handleBack}
//             className="px-4 py-2 rounded-lg text-sm font-medium border border-gray-600 text-gray-200 hover:bg-gray-800 transition-colors"
//           >
//             ← Back
//           </button>
//         ) : (
//           <button className="px-4 py-2 rounded-lg text-sm font-medium border border-gray-700 text-gray-600 cursor-default opacity-30">
//             ← Back
//           </button>
//         )}
//       </div>

//       {/* Title */}
//       <h1 className="text-2xl font-light text-white mb-6 tracking-wide">
//         Slot Gaffe Tool
//       </h1>

//       {/* Two-column layout */}
//       <div className="flex gap-6 items-start">

//         {/* ── Left column ─────────────────────────────────────────────────── */}
//         <div className="flex-1 min-w-0 flex flex-col gap-4">

//           {/* BASE GAME — always visible */}
//           <BaseGame
//             reelStops={reelStops}           setReelStops={setReelStops}
//             scatColors={scatColors}         setScatColors={setScatColors}
//             scatValues={scatValues}         setScatValues={setScatValues}
//             stackSymbol={stackSymbol}       setStackSymbol={setStackSymbol}
//             featureEnabled={featureEnabled} setFeatureEnabled={setFeatureEnabled}
//             grandEnabled={grandEnabled}     setGrandEnabled={setGrandEnabled}
//             majorEnabled={majorEnabled}     setMajorEnabled={setMajorEnabled}
//             selectedFeatures={selectedFeatures}
//             setSelectedFeatures={setSelectedFeatures}
//             onGoTo={handleGoTo}
//           />

//           {/* ── FEATURE SECTIONS ──────────────────────────────────────────── */}
//           {isFeatureSection && (
//             <>
//               {/* Section breadcrumb */}
//               <div className="flex items-center gap-3 px-1">
//                 <div className="flex gap-1 items-center">
//                   {activeFeatureKeys.map((f, i) => (
//                     <span key={f} className="flex items-center gap-1">
//                       {i > 0 && <span className="text-gray-600 text-xs mx-0.5">+</span>}
//                       <span className={`text-sm font-semibold ${FEATURE_COLOR[f] ?? "text-white"}`}>
//                         {FEATURE_LABEL[f] ?? f.toUpperCase()}
//                       </span>
//                     </span>
//                   ))}
//                 </div>
//                 <span className="text-gray-500 text-xs">Feature</span>
//               </div>

//               {/* ── COMBINATION (2+ features) ────────────────────────────── */}
//               {isCombination && (
//                 <CombinationFeature
//                   selectedFeatures={activeFeatureKeys}
//                   featureBaseCoins={featureBaseCoins}
//                   onOutputChange={setComboOutput}
//                 />
//               )}

//               {/* ── SINGLE: WHEEL ────────────────────────────────────────── */}
//               {!isCombination && activeSection === "piggyWheel" && (
//                 <WheelFeature
//                   baseCoins={featureBaseCoins["wheel"] ?? []}
//                   onSpin={line => setSingleFeatureLines(prev => [...prev, line])}
//                   onReset={() => setSingleFeatureLines([])}
//                 />
//               )}

//               {/* ── SINGLE: ZONE ─────────────────────────────────────────── */}
//               {!isCombination && activeSection === "piggyZone" && (
//                 <ZoneFeature
//                   baseCoins={featureBaseCoins["zone"] ?? []}
//                   onSpin={line => setSingleFeatureLines(prev => [...prev, line])}
//                   onReset={() => setSingleFeatureLines([])}
//                 />
//               )}

//               {/* ── SINGLE: TOWER ────────────────────────────────────────── */}
//               {!isCombination && activeSection === "piggyTower" && (
//                 <TowerFeature
//                   baseCoins={featureBaseCoins["tower"] ?? []}
//                   onSpin={line => setSingleFeatureLines(prev => [...prev, line])}
//                   onReset={() => setSingleFeatureLines([])}
//                 />
//               )}
//             </>
//           )}
//         </div>

//         {/* ── Right column: Gaffe Output (sticky) ───────────────────────── */}
//         <div className="w-[380px] shrink-0 sticky top-6">
//           <GaffeOutput gaffe={gaffe} featureGaffes={featureGaffes} />
//         </div>

//       </div>
//     </div>
//   );
// }





//!!!! perfect ---------
/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { useState, useMemo } from "react";
import BaseGame              from "./base-game";
import GaffeOutput           from "./GaffeOutput";
import WheelFeature          from "./wheelFeature";
import ZoneFeature           from "./zoneFeature";
import TowerFeature          from "./towerFeature";
import CombinationFeature    from "./combinationFeature";
import { reels }             from "./reels";
import {
  generateGaffe,
  getBaseCoinsForFeature,
  getBaseCoinsForCombination,
  BaseCoin,
} from "./gaffeGenerator";
import { ScatType }          from "./ReelColumn";
import { FeatureKey }        from "./combinationFeatureGenerator";

// ─── Feature display metadata ─────────────────────────────────────────────────
const F_COLOR: Record<string, string> = {
  wheel: "text-red-400",
  zone:  "text-purple-400",
  tower: "text-blue-400",
};
const F_LABEL: Record<string, string> = {
  wheel: "WHEEL",
  zone:  "ZONE",
  tower: "TOWER",
};

// ─── Page ─────────────────────────────────────────────────────────────────────
export default function Page() {

  // ── Base game state ───────────────────────────────────────────────────────
  const [reelStops,        setReelStops]        = useState<number[]>([0, 0, 0, 0, 0]);
  const [scatColors,       setScatColors]       = useState<{ [key: string]: ScatType }>({});
  const [scatValues,       setScatValues]       = useState<{ [key: string]: string }>({});
  const [stackSymbol,      setStackSymbol]      = useState<string | null>(null);
  const [featureEnabled,   setFeatureEnabled]   = useState<boolean>(true);
  const [grandEnabled,     setGrandEnabled]     = useState<boolean>(false);
  const [majorEnabled,     setMajorEnabled]     = useState<boolean>(false);
  const [selectedFeatures, setSelectedFeatures] = useState<string[]>([]);

  // ── Navigation ────────────────────────────────────────────────────────────
  const [activeSection,    setActiveSection]    = useState<string>("base");
  const [featureGaffes,    setFeatureGaffes]    = useState<string[]>([]);

  // ── Base coins for single features ────────────────────────────────────────
  const [singleBaseCoins, setSingleBaseCoins] = useState<BaseCoin[]>([]);
  // ── Merged base coins for combination ─────────────────────────────────────
  const [comboBaseCoins,  setComboBaseCoins]  = useState<
    Array<{ position: number; value: string; featureKey: string }>
  >([]);

  // ── Live base gaffe ───────────────────────────────────────────────────────
  const gaffe = useMemo(
    () => generateGaffe(
      reelStops, reels,
      scatColors, scatValues,
      selectedFeatures, featureEnabled,
      grandEnabled, majorEnabled, stackSymbol
    ),
    [reelStops, scatColors, scatValues, selectedFeatures, featureEnabled, grandEnabled, majorEnabled, stackSymbol]
  );

  // ── Derived ───────────────────────────────────────────────────────────────
  const isFeature      = activeSection !== "base";
  const isCombination  = activeSection.includes("-");
  const activeKeys     = activeSection.split("-") as FeatureKey[];

  // ── Handlers ─────────────────────────────────────────────────────────────
  const handleGoTo = (features: string[]) => {
    setFeatureGaffes([]);

    if (features.length === 1) {
      // Single feature
      const coins = getBaseCoinsForFeature(
        features[0], reelStops, reels, scatColors, scatValues
      );
      setSingleBaseCoins(coins);
      setComboBaseCoins([]);
    } else {
      // Combination — collect all relevant SCaT coins in one pass
      const coins = getBaseCoinsForCombination(
        features, reelStops, reels, scatColors, scatValues
      );
      setComboBaseCoins(coins);
      setSingleBaseCoins([]);
    }

    setActiveSection(features.join("-"));
  };

  const handleBack = () => {
    setActiveSection("base");
    setFeatureGaffes([]);
    setSingleBaseCoins([]);
    setComboBaseCoins([]);
  };

  const addSpinLine = (line: string) => setFeatureGaffes(prev => [...prev, line]);
  const clearLines  = () => setFeatureGaffes([]);

  // ─── Render ────────────────────────────────────────────────────────────────
  return (
    <div className="min-h-screen text-white p-6" style={{ background: "#0d1117" }}>

      {/* Nav */}
      <div className="mb-4">
        {isFeature ? (
          <button onClick={handleBack}
            className="px-4 py-2 rounded-lg text-sm font-medium border border-gray-600 text-gray-200 hover:bg-gray-800 transition-colors">
            ← Back
          </button>
        ) : (
          <button className="px-4 py-2 rounded-lg text-sm font-medium border border-gray-700 text-gray-600 cursor-default opacity-30">
            ← Back
          </button>
        )}
      </div>

      {/* Feature breadcrumb */}
      {isFeature && (
        <div className="mb-4 flex items-center gap-2">
          {activeKeys.map((f, i) => (
            <span key={f} className="flex items-center gap-1">
              {i > 0 && <span className="text-gray-500 text-sm">+</span>}
              <span className={`text-sm font-semibold ${F_COLOR[f] ?? "text-white"}`}>
                {F_LABEL[f] ?? f.toUpperCase()}
              </span>
            </span>
          ))}
          <span className="text-gray-500 text-sm">Feature</span>
        </div>
      )}

      {/* Title */}
      <h1 className="text-2xl font-light text-white mb-6 tracking-wide">
        Slot Gaffe Tool
      </h1>

      {/* Two-column layout */}
      <div className="flex gap-6 items-start">

        {/* Left */}
        <div className="flex-1 min-w-0 flex flex-col gap-4">

          {/* Base Game — always visible */}
          <BaseGame
            reelStops={reelStops}           setReelStops={setReelStops}
            scatColors={scatColors}         setScatColors={setScatColors}
            scatValues={scatValues}         setScatValues={setScatValues}
            stackSymbol={stackSymbol}       setStackSymbol={setStackSymbol}
            featureEnabled={featureEnabled} setFeatureEnabled={setFeatureEnabled}
            grandEnabled={grandEnabled}     setGrandEnabled={setGrandEnabled}
            majorEnabled={majorEnabled}     setMajorEnabled={setMajorEnabled}
            selectedFeatures={selectedFeatures}
            setSelectedFeatures={setSelectedFeatures}
            onGoTo={handleGoTo}
          />

          {/* ── COMBINATION (2+ features) — single unified panel ─────── */}
          {isFeature && isCombination && (
            <CombinationFeature
              selectedFeatures={activeKeys}
              baseCoins={comboBaseCoins}
              onSpin={addSpinLine}
              onReset={clearLines}
            />
          )}

          {/* ── SINGLE: WHEEL ─────────────────────────────────────────── */}
          {isFeature && !isCombination && activeSection === "piggyWheel" && (
            <WheelFeature
              baseCoins={singleBaseCoins}
              onSpin={addSpinLine}
              onReset={clearLines}
            />
          )}

          {/* ── SINGLE: ZONE ──────────────────────────────────────────── */}
          {isFeature && !isCombination && activeSection === "piggyZone" && (
            <ZoneFeature
              baseCoins={singleBaseCoins}
              onSpin={addSpinLine}
              onReset={clearLines}
            />
          )}

          {/* ── SINGLE: TOWER ─────────────────────────────────────────── */}
          {isFeature && !isCombination && activeSection === "piggyTower" && (
            <TowerFeature
              baseCoins={singleBaseCoins}
              onSpin={addSpinLine}
              onReset={clearLines}
            />
          )}

        </div>

        {/* Right — Gaffe Output */}
        <div className="w-[380px] shrink-0 sticky top-6">
          <GaffeOutput gaffe={gaffe} featureGaffes={featureGaffes} />
        </div>

      </div>
    </div>
  );
}






