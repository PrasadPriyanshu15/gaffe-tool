// /* eslint-disable @typescript-eslint/no-explicit-any */
// "use client";

// import { useState, useMemo } from "react";
// import BaseGame from "./base-game";
// import GaffeOutput from "./GaffeOutput";
// import ZoneFeature from "./ZoneFeature";
// import ExtraFeature from "./ExtraFeature";
// import DoubleFeature from "./DoubleFeature";
// import UltraFeature from "./UltraFeature";
// import CombinationFeature from "./CombinationFeature";
// import { reels } from "./reels";
// import { ScatsState, generateGaffe, formatGaffe } from "./gaffeGenerator";
// import { SCAT_COLOR_CODE, ScatType } from "./config";
// import {
//   ComboCoin, ComboFeatureConfig,
//   getComboScatSeedColor,
// } from "./combinationFeatureGenerator";
// import { ZoneFeatureCoin } from "./zoneFeatureGenerator";
// import { ExtraFeatureCoin } from "./extraFeatureGenerator";
// import { DoubleFeatureCoin } from "./doubleFeatureGenerator";
// import { UltraFeatureCoin } from "./ultraFeatureGenerator";

// // ── Types ─────────────────────────────────────────────────────────────────────
// const EMPTY_SCATS: ScatsState = {
//   colors:{}, values:{}, leftValues:{}, rightValues:{},
//   zoneSplitter:{}, zoneMultipliers:{}, boostValues:{},
// };

// const ZONE_SCAT_KEYS   = new Set(["blue", "all"]);
// const ULTRA_SCAT_KEYS  = new Set(["purple", "all"]);
// const DOUBLE_SCAT_KEYS = new Set(["red", "all"]);

// // ── Helpers ───────────────────────────────────────────────────────────────────

// function deriveZoneParams(reelStops: number[], scats: ScatsState) {
//   let splitter = 1;
//   let multipliers: number[] = [];
//   reelStops.forEach((stop, ri) => {
//     const reel = reels[ri];
//     [-1, 0, 1].forEach(off => {
//       const idx = (stop + off + reel.length) % reel.length;
//       if (reel[idx] !== "SCAT") return;
//       const k = `${ri}-${idx}`;
//       const s = scats.colors[k] as ScatType | undefined;
//       if (s && ZONE_SCAT_KEYS.has(s.key)) {
//         const zs = scats.zoneSplitter[k];    if (zs) splitter = Number(zs);
//         const zm = scats.zoneMultipliers[k];
//         if (zm) multipliers = zm.split(",").map(n => n.trim()).filter(Boolean).map(Number);
//       }
//     });
//   });
//   return { splitter, multipliers };
// }

// function buildGenericBaseCoins(reelStops: number[], scats: ScatsState): ZoneFeatureCoin[] {
//   const result: ZoneFeatureCoin[] = [];
//   reelStops.forEach((stop, ri) => {
//     const reel = reels[ri];
//     [-1, 0, 1].forEach((off, rowIdx) => {
//       const idx = (stop + off + reel.length) % reel.length;
//       if (reel[idx] !== "SCAT") return;
//       const k = `${ri}-${idx}`;
//       const s = scats.colors[k] as ScatType | undefined;
//       const v = scats.values[k];
//       if (s) result.push({ position: ri * 3 + rowIdx, colorCode: SCAT_COLOR_CODE[s.key] ?? 4, value: v || "1", fromBase: true });
//     });
//   });
//   return result;
// }

// function buildDoubleBaseCoins(reelStops: number[], scats: ScatsState): DoubleFeatureCoin[] {
//   const result: DoubleFeatureCoin[] = [];
//   reelStops.forEach((stop, ri) => {
//     const reel = reels[ri];
//     [-1, 0, 1].forEach((off, rowIdx) => {
//       const idx = (stop + off + reel.length) % reel.length;
//       if (reel[idx] !== "SCAT") return;
//       const k = `${ri}-${idx}`;
//       const s = scats.colors[k] as ScatType | undefined;
//       if (s) result.push({
//         position:   ri * 3 + rowIdx,
//         colorCode:  SCAT_COLOR_CODE[s.key] ?? 4,
//         leftValue:  scats.leftValues[k]  || "",
//         rightValue: scats.rightValues[k] || "",
//         fromBase:   true,
//       });
//     });
//   });
//   return result;
// }

// function buildUltraBaseCoins(reelStops: number[], scats: ScatsState): UltraFeatureCoin[] {
//   const result: UltraFeatureCoin[] = [];
//   reelStops.forEach((stop, ri) => {
//     const reel = reels[ri];
//     [-1, 0, 1].forEach((off, rowIdx) => {
//       const idx = (stop + off + reel.length) % reel.length;
//       if (reel[idx] !== "SCAT") return;
//       const k = `${ri}-${idx}`;
//       const s = scats.colors[k] as ScatType | undefined;
//       const v = scats.values[k];
//       if (s) result.push({
//         position:   ri * 3 + rowIdx,
//         colorCode:  SCAT_COLOR_CODE[s.key] ?? 4,
//         value:      v || "1",
//         boostValue: ULTRA_SCAT_KEYS.has(s.key) ? (scats.boostValues[k] || "") : "",
//         boostSide:  null,
//         fromBase:   true,
//       });
//     });
//   });
//   return result;
// }

// function buildComboBaseCoins(activeFeatures: string[], reelStops: number[], scats: ScatsState): ComboCoin[] {
//   const result: ComboCoin[] = [];
//   const hasDouble = activeFeatures.includes("double");
//   const hasUltra  = activeFeatures.includes("ultra");
//   reelStops.forEach((stop, ri) => {
//     const reel = reels[ri];
//     [-1, 0, 1].forEach((off, rowIdx) => {
//       const idx = (stop + off + reel.length) % reel.length;
//       if (reel[idx] !== "SCAT") return;
//       const k = `${ri}-${idx}`;
//       const s = scats.colors[k] as ScatType | undefined;
//       const v = scats.values[k];
//       if (s) {
//         const pos       = ri * 3 + rowIdx;
//         const colorCode = getComboScatSeedColor(activeFeatures, s.key);
//         result.push({
//           position:   pos,
//           colorCode,
//           value:      v || "1",
//           leftValue:  hasDouble && DOUBLE_SCAT_KEYS.has(s.key) ? (scats.leftValues[k]  || "") : "",
//           rightValue: hasDouble && DOUBLE_SCAT_KEYS.has(s.key) ? (scats.rightValues[k] || "") : "",
//           boostValue: hasUltra  && ULTRA_SCAT_KEYS.has(s.key)  ? (scats.boostValues[k] || "") : "",
//           boostSide:  null,
//           fromBase:   true,
//         });
//       }
//     });
//   });
//   return result;
// }

// // ── Main page ─────────────────────────────────────────────────────────────────
// export default function Home() {

//   // ── Base game state ─────────────────────────────────────────────────────────
//   const [reelStops,        setReelStops]        = useState([0, 0, 0, 0, 0]);
//   const [scats,            setScats]            = useState<ScatsState>(EMPTY_SCATS);
//   const [featureEnabled,   setFeatureEnabled]   = useState(true);
//   const [selectedFeatures, setSelectedFeatures] = useState<string[]>([]);

//   // ── Active features (locked when "Go to" clicked) ──────────────────────────
//   const [activeFeatures, setActiveFeatures] = useState<string[]>([]);

//   // ── Gaffe output histories ──────────────────────────────────────────────────
//   const [baseGaffeLine, setBaseGaffeLine] = useState("");
//   const [zoneHistory,   setZoneHistory]   = useState<string[]>([]);
//   const [extraHistory,  setExtraHistory]  = useState<string[]>([]);
//   const [doubleHistory, setDoubleHistory] = useState<string[]>([]);
//   const [ultraHistory,  setUltraHistory]  = useState<string[]>([]);
//   const [comboHistory,  setComboHistory]  = useState<string[]>([]);

//   // ── Carry coins from upgrade (re-seeds the feature) ────────────────────────
//   const [carryCoins, setCarryCoins] = useState<any[] | null>(null);
//   const [featureKey, setFeatureKey] = useState(0);

//   // ── Derived values ──────────────────────────────────────────────────────────
//   const { splitter: activeSplitter, multipliers: activeMultipliers } = useMemo(
//     () => deriveZoneParams(reelStops, scats),
//     [reelStops, scats]
//   );

//   const genericBaseCoins = useMemo(() => buildGenericBaseCoins(reelStops, scats), [reelStops, scats]);
//   const doubleBaseCoins  = useMemo(() => buildDoubleBaseCoins(reelStops, scats),  [reelStops, scats]);
//   const ultraBaseCoins   = useMemo(() => buildUltraBaseCoins(reelStops, scats),   [reelStops, scats]);
//   const comboBaseCoins   = useMemo(
//     () => activeFeatures.length > 1 ? buildComboBaseCoins(activeFeatures, reelStops, scats) : [],
//     [activeFeatures, reelStops, scats]
//   );

//   const isSingleFeature = activeFeatures.length === 1;
//   const isComboFeature  = activeFeatures.length > 1;

//   const comboConfig = useMemo((): ComboFeatureConfig | null => {
//     if (!isComboFeature) return null;
//     return {
//       features:    [...activeFeatures].sort(),
//       hasDouble:   activeFeatures.includes("double"),
//       hasExtra:    activeFeatures.includes("extra"),
//       hasZone:     activeFeatures.includes("zone"),
//       hasUltra:    activeFeatures.includes("ultra"),
//       splitter:    activeSplitter,
//       multipliers: activeMultipliers,
//     };
//   }, [activeFeatures, isComboFeature, activeSplitter, activeMultipliers]);

//   const seedCoins = carryCoins ?? (
//     isSingleFeature && activeFeatures[0] === "double" ? doubleBaseCoins :
//     isSingleFeature && activeFeatures[0] === "ultra"  ? ultraBaseCoins  :
//     isSingleFeature                                    ? genericBaseCoins :
//     comboBaseCoins
//   );

//   // ── Handlers ────────────────────────────────────────────────────────────────

//   const clearAllHistory = () => {
//     setZoneHistory([]); setExtraHistory([]); setDoubleHistory([]);
//     setUltraHistory([]); setComboHistory([]);
//   };

//   const handleGoTo = (features: string[]) => {
//     const g = generateGaffe(reelStops, scats, features, false);
//     setBaseGaffeLine(formatGaffe(g));
//     clearAllHistory();
//     setCarryCoins(null);
//     setActiveFeatures(features);
//     setFeatureKey(k => k + 1);
//   };

//   const handleUpgrade = (newFeatures: string[], carry: any[]) => {
//     const g = generateGaffe(reelStops, scats, newFeatures, false);
//     setBaseGaffeLine(formatGaffe(g));
//     setCarryCoins(carry);
//     setActiveFeatures(newFeatures);
//     setFeatureKey(k => k + 1);
//   };

//   const allLines: string[] = [
//     ...(baseGaffeLine ? [baseGaffeLine] : []),
//     ...zoneHistory, ...extraHistory, ...doubleHistory,
//     ...ultraHistory, ...comboHistory,
//   ];

//   return (
//     <main className="p-4 bg-gray-950 min-h-screen text-white" style={{ fontFamily: "monospace" }}>
//       <h1 className="text-xl font-bold mb-4 text-gray-300">
//         🎰 Gaffe Tool
//         <span className="text-xs text-gray-600 ml-3 font-normal">Double · Ultra · Zone · Extra</span>
//       </h1>

//       <div className="flex gap-4 items-start max-w-screen-2xl mx-auto">

//         {/* LEFT — base game + active feature sections */}
//         <div className="flex flex-col gap-4 flex-1 min-w-0">

//           <BaseGame
//             reelStops={reelStops}           setReelStops={setReelStops}
//             scats={scats}                   setScats={setScats}
//             featureEnabled={featureEnabled} setFeatureEnabled={setFeatureEnabled}
//             selectedFeatures={selectedFeatures} setSelectedFeatures={setSelectedFeatures}
//             onGoTo={handleGoTo}
//           />

//           {isSingleFeature && activeFeatures.includes("zone") && (
//             <ZoneFeature
//               key={featureKey}
//               baseCoins={seedCoins as ZoneFeatureCoin[]}
//               splitter={activeSplitter}
//               multipliers={activeMultipliers}
//               onCoinsChange={() => {}}
//               onSpin={line => setZoneHistory(prev => [...prev, line])}
//               onReset={() => { setZoneHistory([]); setCarryCoins(null); }}
//               onUpgrade={handleUpgrade}
//             />
//           )}

//           {isSingleFeature && activeFeatures.includes("extra") && (
//             <ExtraFeature
//               key={featureKey}
//               baseCoins={seedCoins as ExtraFeatureCoin[]}
//               onCoinsChange={() => {}}
//               onSpin={line => setExtraHistory(prev => [...prev, line])}
//               onReset={() => { setExtraHistory([]); setCarryCoins(null); }}
//               onUpgrade={handleUpgrade}
//             />
//           )}

//           {isSingleFeature && activeFeatures.includes("double") && (
//             <DoubleFeature
//               key={featureKey}
//               baseCoins={seedCoins as DoubleFeatureCoin[]}
//               onCoinsChange={() => {}}
//               onSpin={line => setDoubleHistory(prev => [...prev, line])}
//               onReset={() => { setDoubleHistory([]); setCarryCoins(null); }}
//               onUpgrade={handleUpgrade}
//             />
//           )}

//           {isSingleFeature && activeFeatures.includes("ultra") && (
//             <UltraFeature
//               key={featureKey}
//               baseCoins={seedCoins as UltraFeatureCoin[]}
//               isDoubleCombo={false}
//               onCoinsChange={() => {}}
//               onSpin={line => setUltraHistory(prev => [...prev, line])}
//               onReset={() => { setUltraHistory([]); setCarryCoins(null); }}
//               onUpgrade={handleUpgrade}
//             />
//           )}

//           {isComboFeature && comboConfig && (
//             <CombinationFeature
//               key={featureKey}
//               baseCoins={seedCoins as ComboCoin[]}
//               config={comboConfig}
//               onSpin={(_snap, line) => setComboHistory(prev => [...prev, line])}
//               onReset={() => { setComboHistory([]); setCarryCoins(null); }}
//               onUpgrade={handleUpgrade}
//             />
//           )}

//         </div>

//         {/* RIGHT — output panel */}
//         <div className="w-96 shrink-0">
//           <GaffeOutput lines={allLines} />
//         </div>

//       </div>
//     </main>
//   );
// }




/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { useState, useMemo } from "react";
import BaseGame from "./base-game";
import GaffeOutput from "./GaffeOutput";
import ZoneFeature from "./ZoneFeature";
import ExtraFeature from "./ExtraFeature";
import DoubleFeature from "./DoubleFeature";
import UltraFeature from "./UltraFeature";
import CombinationFeature from "./CombinationFeature";
import { reels } from "./reels";
import { ScatsState, generateGaffe, formatGaffe } from "./gaffeGenerator";
import { SCAT_COLOR_CODE, ScatType } from "./config";
import {
  ComboCoin, ComboFeatureConfig,
  getComboScatSeedColor,
} from "./combinationFeatureGenerator";
import { ZoneFeatureCoin } from "./zoneFeatureGenerator";
import { ExtraFeatureCoin } from "./extraFeatureGenerator";
import { DoubleFeatureCoin } from "./doubleFeatureGenerator";
import { UltraFeatureCoin } from "./ultraFeatureGenerator";

// ── Types ─────────────────────────────────────────────────────────────────────
const EMPTY_SCATS: ScatsState = {
  colors:{}, values:{}, leftValues:{}, rightValues:{},
  zoneSplitter:{}, zoneMultipliers:{}, boostValues:{},
};

const ZONE_SCAT_KEYS   = new Set(["blue", "all"]);
const ULTRA_SCAT_KEYS  = new Set(["purple", "all"]);
const DOUBLE_SCAT_KEYS = new Set(["red", "all"]);

// ── Helpers ───────────────────────────────────────────────────────────────────

function deriveZoneParams(reelStops: number[], scats: ScatsState) {
  let splitter = 1;
  let multipliers: number[] = [];
  reelStops.forEach((stop, ri) => {
    const reel = reels[ri];
    [-1, 0, 1].forEach(off => {
      const idx = (stop + off + reel.length) % reel.length;
      if (reel[idx] !== "SCAT") return;
      const k = `${ri}-${idx}`;
      const s = scats.colors[k] as ScatType | undefined;
      if (s && ZONE_SCAT_KEYS.has(s.key)) {
        const zs = scats.zoneSplitter[k];    if (zs) splitter = Number(zs);
        const zm = scats.zoneMultipliers[k];
        if (zm) multipliers = zm.split(",").map(n => n.trim()).filter(Boolean).map(Number);
      }
    });
  });
  return { splitter, multipliers };
}

function buildGenericBaseCoins(reelStops: number[], scats: ScatsState): ZoneFeatureCoin[] {
  const result: ZoneFeatureCoin[] = [];
  reelStops.forEach((stop, ri) => {
    const reel = reels[ri];
    [-1, 0, 1].forEach((off, rowIdx) => {
      const idx = (stop + off + reel.length) % reel.length;
      if (reel[idx] !== "SCAT") return;
      const k = `${ri}-${idx}`;
      const s = scats.colors[k] as ScatType | undefined;
      const v = scats.values[k];
      if (s) result.push({ position: ri * 3 + rowIdx, colorCode: SCAT_COLOR_CODE[s.key] ?? 4, value: v || "1", fromBase: true });
    });
  });
  return result;
}

function buildDoubleBaseCoins(reelStops: number[], scats: ScatsState): DoubleFeatureCoin[] {
  const result: DoubleFeatureCoin[] = [];
  reelStops.forEach((stop, ri) => {
    const reel = reels[ri];
    [-1, 0, 1].forEach((off, rowIdx) => {
      const idx = (stop + off + reel.length) % reel.length;
      if (reel[idx] !== "SCAT") return;
      const k = `${ri}-${idx}`;
      const s = scats.colors[k] as ScatType | undefined;
      if (s) result.push({
        position:   ri * 3 + rowIdx,
        colorCode:  SCAT_COLOR_CODE[s.key] ?? 4,
        leftValue:  scats.leftValues[k]  || "",
        rightValue: scats.rightValues[k] || "",
        fromBase:   true,
      });
    });
  });
  return result;
}

function buildUltraBaseCoins(reelStops: number[], scats: ScatsState): UltraFeatureCoin[] {
  const result: UltraFeatureCoin[] = [];
  reelStops.forEach((stop, ri) => {
    const reel = reels[ri];
    [-1, 0, 1].forEach((off, rowIdx) => {
      const idx = (stop + off + reel.length) % reel.length;
      if (reel[idx] !== "SCAT") return;
      const k = `${ri}-${idx}`;
      const s = scats.colors[k] as ScatType | undefined;
      const v = scats.values[k];
      if (s) result.push({
        position:   ri * 3 + rowIdx,
        colorCode:  SCAT_COLOR_CODE[s.key] ?? 4,
        value:      v || "1",
        boostValue: ULTRA_SCAT_KEYS.has(s.key) ? (scats.boostValues[k] || "") : "",
        boostSide:  null,
        fromBase:   true,
      });
    });
  });
  return result;
}

function buildComboBaseCoins(activeFeatures: string[], reelStops: number[], scats: ScatsState): ComboCoin[] {
  const result: ComboCoin[] = [];
  const hasDouble = activeFeatures.includes("double");
  const hasUltra  = activeFeatures.includes("ultra");
  reelStops.forEach((stop, ri) => {
    const reel = reels[ri];
    [-1, 0, 1].forEach((off, rowIdx) => {
      const idx = (stop + off + reel.length) % reel.length;
      if (reel[idx] !== "SCAT") return;
      const k = `${ri}-${idx}`;
      const s = scats.colors[k] as ScatType | undefined;
      const v = scats.values[k];
      if (s) {
        const pos       = ri * 3 + rowIdx;
        const colorCode = getComboScatSeedColor(activeFeatures, s.key);
        result.push({
          position:   pos,
          colorCode,
          value:      v || "100",
          leftValue:  hasDouble && DOUBLE_SCAT_KEYS.has(s.key) ? (scats.leftValues[k]  || "") : "",
          rightValue: hasDouble && DOUBLE_SCAT_KEYS.has(s.key) ? (scats.rightValues[k] || "") : "",
          boostValue: hasUltra  && ULTRA_SCAT_KEYS.has(s.key)  ? (scats.boostValues[k] || "") : "",
          boostSide:  null,
          fromBase:   true,
        });
      }
    });
  });
  return result;
}

// ── Main page ─────────────────────────────────────────────────────────────────
export default function Home() {

  // ── Base game state ─────────────────────────────────────────────────────────
  const [reelStops,        setReelStops]        = useState([0, 0, 0, 0, 0]);
  const [scats,            setScats]            = useState<ScatsState>(EMPTY_SCATS);
  const [featureEnabled,   setFeatureEnabled]   = useState(true);
  const [selectedFeatures, setSelectedFeatures] = useState<string[]>([]);

  // ── Active features (locked when "Go to" clicked) ──────────────────────────
  const [activeFeatures, setActiveFeatures] = useState<string[]>([]);

  // ── Gaffe output histories ──────────────────────────────────────────────────
  // Always reflect current reel stops — updates live as user scrolls reels
  const baseGaffeLine = useMemo(
    () => formatGaffe(generateGaffe(reelStops, scats, selectedFeatures, false)),
    [reelStops, scats, selectedFeatures]
  );
  const [zoneHistory,   setZoneHistory]   = useState<string[]>([]);
  const [extraHistory,  setExtraHistory]  = useState<string[]>([]);
  const [doubleHistory, setDoubleHistory] = useState<string[]>([]);
  const [ultraHistory,  setUltraHistory]  = useState<string[]>([]);
  const [comboHistory,  setComboHistory]  = useState<string[]>([]);

  // ── Carry coins from upgrade (re-seeds the feature) ────────────────────────
  const [carryCoins, setCarryCoins] = useState<any[] | null>(null);
  const [featureKey, setFeatureKey] = useState(0);

  // ── Derived values ──────────────────────────────────────────────────────────
  const { splitter: activeSplitter, multipliers: activeMultipliers } = useMemo(
    () => deriveZoneParams(reelStops, scats),
    [reelStops, scats]
  );

  const genericBaseCoins = useMemo(() => buildGenericBaseCoins(reelStops, scats), [reelStops, scats]);
  const doubleBaseCoins  = useMemo(() => buildDoubleBaseCoins(reelStops, scats),  [reelStops, scats]);
  const ultraBaseCoins   = useMemo(() => buildUltraBaseCoins(reelStops, scats),   [reelStops, scats]);
  const comboBaseCoins   = useMemo(
    () => activeFeatures.length > 1 ? buildComboBaseCoins(activeFeatures, reelStops, scats) : [],
    [activeFeatures, reelStops, scats]
  );

  const isSingleFeature = activeFeatures.length === 1;
  const isComboFeature  = activeFeatures.length > 1;

  const comboConfig = useMemo((): ComboFeatureConfig | null => {
    if (!isComboFeature) return null;
    return {
      features:    [...activeFeatures].sort(),
      hasDouble:   activeFeatures.includes("double"),
      hasExtra:    activeFeatures.includes("extra"),
      hasZone:     activeFeatures.includes("zone"),
      hasUltra:    activeFeatures.includes("ultra"),
      splitter:    activeSplitter,
      multipliers: activeMultipliers,
    };
  }, [activeFeatures, isComboFeature, activeSplitter, activeMultipliers]);

  const seedCoins = carryCoins ?? (
    isSingleFeature && activeFeatures[0] === "double" ? doubleBaseCoins :
    isSingleFeature && activeFeatures[0] === "ultra"  ? ultraBaseCoins  :
    isSingleFeature                                    ? genericBaseCoins :
    comboBaseCoins
  );

  // ── Handlers ────────────────────────────────────────────────────────────────

  const clearAllHistory = () => {
    setZoneHistory([]); setExtraHistory([]); setDoubleHistory([]);
    setUltraHistory([]); setComboHistory([]);
  };

  const handleGoTo = (features: string[]) => {
    clearAllHistory();
    setCarryCoins(null);
    setActiveFeatures(features);
    setFeatureKey(k => k + 1);
  };

  const handleUpgrade = (newFeatures: string[], carry: any[]) => {
    setCarryCoins(carry);
    setActiveFeatures(newFeatures);
    setFeatureKey(k => k + 1);
  };

  const allLines: string[] = [
    baseGaffeLine,
    ...zoneHistory, ...extraHistory, ...doubleHistory,
    ...ultraHistory, ...comboHistory,
  ];

  return (
    <main className="p-4 bg-gray-950 min-h-screen text-white" style={{ fontFamily: "monospace" }}>
      <h1 className="text-xl font-bold mb-4 text-gray-300">
        🎰 Gaffe Tool
        <span className="text-xs text-gray-600 ml-3 font-normal">Double · Ultra · Zone · Extra</span>
      </h1>

      <div className="flex gap-4 items-start max-w-screen-2xl mx-auto">

        {/* LEFT — base game + active feature sections */}
        <div className="flex flex-col gap-4 flex-1 min-w-0">

          <BaseGame
            reelStops={reelStops}           setReelStops={setReelStops}
            scats={scats}                   setScats={setScats}
            featureEnabled={featureEnabled} setFeatureEnabled={setFeatureEnabled}
            selectedFeatures={selectedFeatures} setSelectedFeatures={setSelectedFeatures}
            onGoTo={handleGoTo}
          />

          {isSingleFeature && activeFeatures.includes("zone") && (
            <ZoneFeature
              key={featureKey}
              baseCoins={seedCoins as ZoneFeatureCoin[]}
              splitter={activeSplitter}
              multipliers={activeMultipliers}
              onCoinsChange={() => {}}
              onSpin={line => setZoneHistory(prev => [...prev, line])}
              onReset={() => { setZoneHistory([]); setCarryCoins(null); }}
              onUpgrade={handleUpgrade}
            />
          )}

          {isSingleFeature && activeFeatures.includes("extra") && (
            <ExtraFeature
              key={featureKey}
              baseCoins={seedCoins as ExtraFeatureCoin[]}
              onCoinsChange={() => {}}
              onSpin={line => setExtraHistory(prev => [...prev, line])}
              onReset={() => { setExtraHistory([]); setCarryCoins(null); }}
              onUpgrade={handleUpgrade}
            />
          )}

          {isSingleFeature && activeFeatures.includes("double") && (
            <DoubleFeature
              key={featureKey}
              baseCoins={seedCoins as DoubleFeatureCoin[]}
              onCoinsChange={() => {}}
              onSpin={line => setDoubleHistory(prev => [...prev, line])}
              onReset={() => { setDoubleHistory([]); setCarryCoins(null); }}
              onUpgrade={handleUpgrade}
            />
          )}

          {isSingleFeature && activeFeatures.includes("ultra") && (
            <UltraFeature
              key={featureKey}
              baseCoins={seedCoins as UltraFeatureCoin[]}
              isDoubleCombo={false}
              onCoinsChange={() => {}}
              onSpin={line => setUltraHistory(prev => [...prev, line])}
              onReset={() => { setUltraHistory([]); setCarryCoins(null); }}
              onUpgrade={handleUpgrade}
            />
          )}

          {isComboFeature && comboConfig && (
            <CombinationFeature
              key={featureKey}
              baseCoins={seedCoins as ComboCoin[]}
              config={comboConfig}
              onSpin={(_snap, line) => setComboHistory(prev => [...prev, line])}
              onReset={() => { setComboHistory([]); setCarryCoins(null); }}
              onUpgrade={handleUpgrade}
            />
          )}

        </div>

        {/* RIGHT — output panel */}
        <div className="w-96 shrink-0">
          <GaffeOutput lines={allLines} />
        </div>

      </div>
    </main>
  );
}