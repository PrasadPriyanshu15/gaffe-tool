


//! all 4 features with combinaitons


// "use client";

// import { useState, useMemo } from "react";
// import BaseGame from "../Ignite-purple/base-game";
// import GaffeOutput from "../Ignite-purple/components/GaffeOutput";
// import ExtraFeature from "./features/extra/ExtraFeature";
// import ZoneFeature from "./features/zone/ZoneFeature";
// import StrikeFeature from "./features/strike/StrikeFeature";
// import SplitFeature from "./features/split/SplitFeature";
// import CombinationFeature from "./features/combinations/CombinationFeature";
// import { reels } from "./reels";
// import { generateGaffe } from "@/games/Ignite-purple/utils/gaffeGenerator";
// import { generateExtraFeatureGaffe } from "@/games/Ignite-purple/features/extra/extraFeatureGenerator";
// import { generateZoneFeatureGaffe } from "@/games/Ignite-purple/features/zone/zoneFeatureGenerator";
// import { generateStrikeFeatureGaffe, StrikeFeatureCoin } from "@/games/Ignite-purple/features/strike/strikeFeatureGenerator";
// import { generateSplitFeatureGaffe, generateSplitStrikeGaffe, SplitFeatureCoin } from "@/games/Ignite-purple/features/split/splitFeatureGenerator";
// import {
//   generateCombinationGaffe, getComboScatSeedColor,
//   ComboFeatureConfig, ComboCoin,
// } from "@/games/Ignite-purple/features/combinations/combinationFeatureGenerator";
// import { useRouter } from "next/navigation";

// type ScatType = {
//   key: "orange" | "blue" | "cerise" | "green" | "all";
//   label: string; feature: string;
// };

// const SCAT_COLOR_CODE: Record<string, number> = {
//   green:4, blue:9, orange:14, cerise:19, all:4,
// };
// // Strike-origin scats → seed as winged
// const STRIKE_SCAT_KEYS = new Set(["orange", "all"]);
// // Split-origin scats → carry splitCount from base game
// const SPLIT_SCAT_KEYS  = new Set(["cerise", "all"]);

// export default function Home() {
//   const router = useRouter();

//   // ── BASE GAME STATE ──────────────────────────────────────────────────────
//   const [reelStops,           setReelStops]           = useState([0,0,0,0,0]);
//   const [scatColors,          setScatColors]          = useState<{[k:string]:ScatType}>({});
//   const [scatValues,          setScatValues]          = useState<{[k:string]:string}>({});
//   const [scatZoneSplitter,    setScatZoneSplitter]    = useState<{[k:string]:string}>({});
//   const [scatZoneMultipliers, setScatZoneMultipliers] = useState<{[k:string]:string}>({});
//   const [scatBoostValues,     setScatBoostValues]     = useState<{[k:string]:string}>({});
//   const [scatSplitCount,      setScatSplitCount]      = useState<{[k:string]:string}>({});
//   const [featureEnabled,      setFeatureEnabled]      = useState(true);
//   const [grandEnabled,        setGrandEnabled]        = useState(false);
//   const [selectedFeatures,    setSelectedFeatures]    = useState<string[]>([]);

//   // ── ACTIVE FEATURES ───────────────────────────────────────────────────────
//   const [activeFeatures, setActiveFeatures] = useState<string[]>([]);

//   // ── GAFFE HISTORIES ───────────────────────────────────────────────────────
//   const [extraGaffeHistory,  setExtraGaffeHistory]  = useState<string[]>([]);
//   const [zoneGaffeHistory,   setZoneGaffeHistory]   = useState<string[]>([]);
//   const [strikeGaffeHistory, setStrikeGaffeHistory] = useState<string[]>([]);
//   const [splitGaffeHistory,  setSplitGaffeHistory]  = useState<string[]>([]);
//   const [comboGaffeHistory,  setComboGaffeHistory]  = useState<string[]>([]);

//   // ── BASE GAFFE ────────────────────────────────────────────────────────────
//   const gaffe = generateGaffe(
//     reelStops, reels, scatColors, scatValues, selectedFeatures,
//     grandEnabled, scatZoneSplitter, scatZoneMultipliers, scatBoostValues, scatSplitCount
//   );

//   // ── ZONE PARAMS ───────────────────────────────────────────────────────────
//   const { activeSplitter, activeMultipliers } = useMemo(() => {
//     let splitter = 1; let multipliers: number[] = [];
//     reelStops.forEach((stop, ri) => {
//       const reel = reels[ri];
//       [-1,0,1].forEach((off) => {
//         const idx = (stop+off+reel.length)%reel.length;
//         if (reel[idx]==="SCAT") {
//           const k = `${ri}-${idx}`; const s = scatColors[k];
//           if (s && (s.key==="blue"||s.key==="all")) {
//             const zs = scatZoneSplitter[k];  if (zs) splitter = Number(zs);
//             const zm = scatZoneMultipliers[k];
//             if (zm) multipliers = zm.split(",").map(n=>n.trim()).filter(Boolean).map(Number);
//           }
//         }
//       });
//     });
//     return { activeSplitter:splitter, activeMultipliers:multipliers };
//   }, [reelStops, scatColors, scatZoneSplitter, scatZoneMultipliers]);

//   // ── BOOST BY POSITION (strike seed) ──────────────────────────────────────
//   const baseBoostByPosition = useMemo(() => {
//     const map: Record<number,string> = {};
//     reelStops.forEach((stop, ri) => {
//       const reel = reels[ri];
//       [-1,0,1].forEach((off, rowIdx) => {
//         const idx = (stop+off+reel.length)%reel.length;
//         if (reel[idx]==="SCAT") {
//           const k = `${ri}-${idx}`; const s = scatColors[k];
//           if (s && STRIKE_SCAT_KEYS.has(s.key)) {
//             const pos = ri*3+rowIdx; const bv = scatBoostValues[k];
//             if (bv) map[pos]=bv;
//           }
//         }
//       });
//     });
//     return map;
//   }, [reelStops, scatColors, scatBoostValues]);

//   // ── SPLIT COUNT BY POSITION (split seed) ─────────────────────────────────
//   const baseSplitCountByPosition = useMemo(() => {
//     const map: Record<number,number> = {};
//     reelStops.forEach((stop, ri) => {
//       const reel = reels[ri];
//       [-1,0,1].forEach((off, rowIdx) => {
//         const idx = (stop+off+reel.length)%reel.length;
//         if (reel[idx]==="SCAT") {
//           const k = `${ri}-${idx}`; const s = scatColors[k];
//           if (s && SPLIT_SCAT_KEYS.has(s.key)) {
//             const pos = ri*3+rowIdx; const sc = scatSplitCount[k];
//             if (sc) map[pos]=Number(sc);
//           }
//         }
//       });
//     });
//     return map;
//   }, [reelStops, scatColors, scatSplitCount]);

//   // ── GENERIC BASE COINS (Extra / Zone) ────────────────────────────────────
//   const baseCoinsGeneric = useMemo(() => {
//     const result: {position:number;colorCode:number;value:string;fromBase:true}[] = [];
//     reelStops.forEach((stop,ri) => {
//       const reel=reels[ri];
//       [-1,0,1].forEach((off,rowIdx) => {
//         const idx=(stop+off+reel.length)%reel.length;
//         if (reel[idx]==="SCAT") {
//           const k=`${ri}-${idx}`; const s=scatColors[k]; const v=scatValues[k];
//           if (s) result.push({ position:ri*3+rowIdx, colorCode:SCAT_COLOR_CODE[s.key]??4, value:v||"1", fromBase:true });
//         }
//       });
//     });
//     return result;
//   }, [reelStops, scatColors, scatValues]);

//   // ── STRIKE BASE COINS ─────────────────────────────────────────────────────
//   const baseCoinsForStrike = useMemo((): StrikeFeatureCoin[] =>
//     baseCoinsGeneric.map((c) => {
//       const isWinged = baseBoostByPosition[c.position] !== undefined;
//       return { ...c, winged:isWinged, boostValue:isWinged?(baseBoostByPosition[c.position]??""):undefined } as StrikeFeatureCoin;
//     }),
//   [baseCoinsGeneric, baseBoostByPosition]);

//   // ── SPLIT BASE COINS ──────────────────────────────────────────────────────
//   const baseCoinsForSplit = useMemo((): SplitFeatureCoin[] =>
//     baseCoinsGeneric.map((c) => ({
//       ...c,
//       splitCount: baseSplitCountByPosition[c.position] ?? 1,
//     } as SplitFeatureCoin)),
//   [baseCoinsGeneric, baseSplitCountByPosition]);

//   // ── COMBO SETUP ───────────────────────────────────────────────────────────
//   const isSingleFeature = activeFeatures.length === 1;
//   const isComboFeature  = activeFeatures.length > 1;

//   const comboConfig = useMemo((): ComboFeatureConfig | null => {
//     if (!isComboFeature) return null;
//     const sorted = [...activeFeatures].sort();
//     return {
//       features:sorted, hasExtra:sorted.includes("extra"), hasZone:sorted.includes("zone"),
//       hasStrike:sorted.includes("strike"), hasSplit:sorted.includes("split"),
//       splitter:activeSplitter, multipliers:activeMultipliers,
//     };
//   }, [activeFeatures, isComboFeature, activeSplitter, activeMultipliers]);

//   const comboBaseCoins = useMemo((): ComboCoin[] => {
//     if (!isComboFeature) return [];
//     const isStrike = activeFeatures.includes("strike");
//     const isSplit  = activeFeatures.includes("split");
//     const result: ComboCoin[] = [];
//     reelStops.forEach((stop,ri) => {
//       const reel=reels[ri];
//       [-1,0,1].forEach((off,rowIdx) => {
//         const idx=(stop+off+reel.length)%reel.length;
//         if (reel[idx]==="SCAT") {
//           const k=`${ri}-${idx}`; const s=scatColors[k]; const v=scatValues[k];
//           if (s) {
//             const pos        = ri*3+rowIdx;
//             const colorCode  = getComboScatSeedColor(activeFeatures, s.key);
//             const isWinged   = isStrike && STRIKE_SCAT_KEYS.has(s.key);
//             const boostVal   = isWinged ? (scatBoostValues[k]??"") : undefined;
//             const splitCount = (isSplit && SPLIT_SCAT_KEYS.has(s.key))
//               ? (Number(scatSplitCount[k])||1) : 1;
//             result.push({ position:pos, colorCode, value:v||"1", winged:isWinged, boostValue:boostVal, splitCount, fromBase:true });
//           }
//         }
//       });
//     });
//     return result;
//   }, [activeFeatures, isComboFeature, reelStops, scatColors, scatValues, scatBoostValues, scatSplitCount]);

//   // ── COMBINED OUTPUT ───────────────────────────────────────────────────────
//   const featureGaffes = [
//     ...extraGaffeHistory, ...zoneGaffeHistory,
//     ...strikeGaffeHistory, ...splitGaffeHistory, ...comboGaffeHistory,
//   ];

//   const handleGoTo = (features: string[]) => {
//     setExtraGaffeHistory([]); setZoneGaffeHistory([]);
//     setStrikeGaffeHistory([]); setSplitGaffeHistory([]); setComboGaffeHistory([]);
//     setActiveFeatures(features);
//   };

//   return (
//     <main className="p-6 bg-gray-900 min-h-screen text-white">
//       <button onClick={() => router.push("/")} className="mb-4 px-4 py-2 bg-gray-700 rounded hover:bg-gray-600">
//         ← Back
//       </button>
//       <h1 className="text-2xl mb-6">Ignite Purple gaffe tool</h1>

//       <div className="flex gap-6 items-start">
//         <div className="flex flex-col gap-6 flex-1 min-w-0">

//           <BaseGame
//             reelStops={reelStops}               setReelStops={setReelStops}
//             scatColors={scatColors}             setScatColors={setScatColors}
//             scatValues={scatValues}             setScatValues={setScatValues}
//             scatZoneSplitter={scatZoneSplitter} setScatZoneSplitter={setScatZoneSplitter}
//             scatZoneMultipliers={scatZoneMultipliers} setScatZoneMultipliers={setScatZoneMultipliers}
//             scatBoostValues={scatBoostValues}   setScatBoostValues={setScatBoostValues}
//             scatSplitCount={scatSplitCount}     setScatSplitCount={setScatSplitCount}
//             featureEnabled={featureEnabled}     setFeatureEnabled={setFeatureEnabled}
//             grandEnabled={grandEnabled}         setGrandEnabled={setGrandEnabled}
//             selectedFeatures={selectedFeatures} setSelectedFeatures={setSelectedFeatures}
//             onGoTo={handleGoTo}
//           />

//           {/* ── SINGLE FEATURES ───────────────────────── */}
//           {isSingleFeature && activeFeatures.includes("extra") && (
//             <ExtraFeature
//               baseCoins={baseCoinsGeneric} onCoinsChange={()=>{}}
//               onSpin={(snap) => setExtraGaffeHistory((p) => [...p, generateExtraFeatureGaffe(snap)])}
//               onReset={() => setExtraGaffeHistory([])}
//             />
//           )}

//           {isSingleFeature && activeFeatures.includes("zone") && (
//             <ZoneFeature
//               baseCoins={baseCoinsGeneric} splitter={activeSplitter} multipliers={activeMultipliers}
//               onCoinsChange={()=>{}}
//               onSpin={(snap) => setZoneGaffeHistory((p) => [...p, generateZoneFeatureGaffe(snap, activeSplitter, activeMultipliers)])}
//               onReset={() => setZoneGaffeHistory([])}
//             />
//           )}

//           {isSingleFeature && activeFeatures.includes("strike") && (
//             <StrikeFeature
//               baseCoins={baseCoinsForStrike} onCoinsChange={()=>{}}
//               onSpin={(snap) => setStrikeGaffeHistory((p) => [...p, generateStrikeFeatureGaffe(snap)])}
//               onReset={() => setStrikeGaffeHistory([])}
//             />
//           )}

//           {isSingleFeature && activeFeatures.includes("split") && (
//             <SplitFeature
//               baseCoins={baseCoinsForSplit}
//               isStrikeCombo={false}
//               onCoinsChange={()=>{}}
//               onSpin={(snap) => setSplitGaffeHistory((p) => [...p, generateSplitFeatureGaffe(snap)])}
//               onReset={() => setSplitGaffeHistory([])}
//             />
//           )}

//           {/* ── COMBINATION ───────────────────────────── */}
//           {isComboFeature && comboConfig && (
//             <CombinationFeature
//               baseCoins={comboBaseCoins}
//               config={comboConfig}
//               onSpin={(snap, upgradedSplitter, upgradedMultipliers) => {
//                 const line = generateCombinationGaffe(snap, comboConfig, upgradedSplitter, upgradedMultipliers);
//                 setComboGaffeHistory((p) => [...p, line]);
//               }}
//               onReset={() => setComboGaffeHistory([])}
//             />
//           )}

//         </div>

//         <div className="w-[380px] shrink-0">
//           <GaffeOutput gaffe={gaffe} featureGaffes={featureGaffes} />
//         </div>
//       </div>
//     </main>
//   );
// }





//! ggreTESD
"use client";
import { useState, useMemo } from "react";
import BaseGame from "../Ignite-purple/base-game";
import GaffeOutput from "../Ignite-purple/components/GaffeOutput";
import ExtraFeature from "./features/extra/ExtraFeature";
import ZoneFeature from "./features/zone/ZoneFeature";
import StrikeFeature from "./features/strike/StrikeFeature";
import SplitFeature from "./features/split/SplitFeature";
import CombinationFeature from "./features/combinations/CombinationFeature";
import { reels } from "./reels";
import { generateGaffe } from "@/games/Ignite-purple/utils/gaffeGenerator";
import { generateExtraFeatureGaffe, UpgradeInfoSingle as UpgradeInfoExtra } from "@/games/Ignite-purple/features/extra/extraFeatureGenerator";
import { generateZoneFeatureGaffe, UpgradeInfoSingle as UpgradeInfoZone } from "@/games/Ignite-purple/features/zone/zoneFeatureGenerator";
import { generateStrikeFeatureGaffe, StrikeFeatureCoin, UpgradeInfoSingle as UpgradeInfoStrike } from "@/games/Ignite-purple/features/strike/strikeFeatureGenerator";
import { generateSplitFeatureGaffe, SplitFeatureCoin, UpgradeInfoSplit } from "@/games/Ignite-purple/features/split/splitFeatureGenerator";
import {
  generateCombinationGaffe, getComboScatSeedColor,
  ComboFeatureConfig, ComboCoin, UpgradeInfo,
} from "@/games/Ignite-purple/features/combinations/combinationFeatureGenerator";
import { useRouter } from "next/navigation";

type ScatType = {
  key: "orange" | "blue" | "cerise" | "green" | "all";
  label: string; feature: string;
};

const SCAT_COLOR_CODE: Record<string, number> = {
  green: 4, blue: 9, orange: 14, cerise: 19, all: 4,
};
const STRIKE_SCAT_KEYS = new Set(["orange", "all"]);
const SPLIT_SCAT_KEYS  = new Set(["cerise", "all"]);

export default function Home() {
  const router = useRouter();

  // ── Base game state ────────────────────────────────────────────────────────
  const [reelStops,           setReelStops]           = useState([0, 0, 0, 0, 0]);
  const [scatColors,          setScatColors]          = useState<{ [k: string]: ScatType }>({});
  const [scatValues,          setScatValues]          = useState<{ [k: string]: string }>({});
  const [scatZoneSplitter,    setScatZoneSplitter]    = useState<{ [k: string]: string }>({});
  const [scatZoneMultipliers, setScatZoneMultipliers] = useState<{ [k: string]: string }>({});
  const [scatBoostValues,     setScatBoostValues]     = useState<{ [k: string]: string }>({});
  const [scatSplitCount,      setScatSplitCount]      = useState<{ [k: string]: string }>({});
  const [featureEnabled,      setFeatureEnabled]      = useState(true);
  const [grandEnabled,        setGrandEnabled]        = useState(false);
  const [selectedFeatures,    setSelectedFeatures]    = useState<string[]>([]);
  const [activeFeatures,      setActiveFeatures]      = useState<string[]>([]);

  // ── Feature gaffe histories ────────────────────────────────────────────────
  const [extraGaffeHistory,  setExtraGaffeHistory]  = useState<string[]>([]);
  const [zoneGaffeHistory,   setZoneGaffeHistory]   = useState<string[]>([]);
  const [strikeGaffeHistory, setStrikeGaffeHistory] = useState<string[]>([]);
  const [splitGaffeHistory,  setSplitGaffeHistory]  = useState<string[]>([]);
  const [comboGaffeHistory,  setComboGaffeHistory]  = useState<string[]>([]);

  // ── Upgrade state ──────────────────────────────────────────────────────────
  const [pendingUpgradeInfo, setPendingUpgradeInfo] = useState<UpgradeInfo | null>(null);
  const [carryCoins,         setCarryCoins]         = useState<ComboCoin[] | null>(null);

  // ── Base game gaffe ────────────────────────────────────────────────────────
  const gaffe = generateGaffe(
    reelStops, reels, scatColors, scatValues, selectedFeatures,
    grandEnabled, scatZoneSplitter, scatZoneMultipliers, scatBoostValues, scatSplitCount
  );

  // ── Zone params from scats ─────────────────────────────────────────────────
  const { activeSplitter, activeMultipliers } = useMemo(() => {
    let splitter = 1; let multipliers: number[] = [];
    reelStops.forEach((stop, ri) => {
      const reel = reels[ri];
      [-1, 0, 1].forEach((off) => {
        const idx = (stop + off + reel.length) % reel.length;
        if (reel[idx] === "SCAT") {
          const k = `${ri}-${idx}`; const s = scatColors[k];
          if (s && (s.key === "blue" || s.key === "all")) {
            const zs = scatZoneSplitter[k];  if (zs) splitter = Number(zs);
            const zm = scatZoneMultipliers[k];
            if (zm) multipliers = zm.split(",").map((n) => n.trim()).filter(Boolean).map(Number);
          }
        }
      });
    });
    return { activeSplitter: splitter, activeMultipliers: multipliers };
  }, [reelStops, scatColors, scatZoneSplitter, scatZoneMultipliers]);

  // ── Boost by position (Strike) ─────────────────────────────────────────────
  const baseBoostByPosition = useMemo(() => {
    const map: Record<number, string> = {};
    reelStops.forEach((stop, ri) => {
      const reel = reels[ri];
      [-1, 0, 1].forEach((off, rowIdx) => {
        const idx = (stop + off + reel.length) % reel.length;
        if (reel[idx] === "SCAT") {
          const k = `${ri}-${idx}`; const s = scatColors[k];
          if (s && STRIKE_SCAT_KEYS.has(s.key)) {
            const pos = ri * 3 + rowIdx; const bv = scatBoostValues[k];
            if (bv) map[pos] = bv;
          }
        }
      });
    });
    return map;
  }, [reelStops, scatColors, scatBoostValues]);

  // ── Split count by position ────────────────────────────────────────────────
  const baseSplitCountByPosition = useMemo(() => {
    const map: Record<number, number> = {};
    reelStops.forEach((stop, ri) => {
      const reel = reels[ri];
      [-1, 0, 1].forEach((off, rowIdx) => {
        const idx = (stop + off + reel.length) % reel.length;
        if (reel[idx] === "SCAT") {
          const k = `${ri}-${idx}`; const s = scatColors[k];
          if (s && SPLIT_SCAT_KEYS.has(s.key)) {
            const pos = ri * 3 + rowIdx; const sc = scatSplitCount[k];
            if (sc) map[pos] = Number(sc);
          }
        }
      });
    });
    return map;
  }, [reelStops, scatColors, scatSplitCount]);

  // ── Base coins ─────────────────────────────────────────────────────────────
  const baseCoinsGeneric = useMemo(() => {
    const result: { position: number; colorCode: number; value: string; fromBase: true }[] = [];
    reelStops.forEach((stop, ri) => {
      const reel = reels[ri];
      [-1, 0, 1].forEach((off, rowIdx) => {
        const idx = (stop + off + reel.length) % reel.length;
        if (reel[idx] === "SCAT") {
          const k = `${ri}-${idx}`; const s = scatColors[k]; const v = scatValues[k];
          if (s) result.push({ position: ri * 3 + rowIdx, colorCode: SCAT_COLOR_CODE[s.key] ?? 4, value: v || "1", fromBase: true });
        }
      });
    });
    return result;
  }, [reelStops, scatColors, scatValues]);

  const baseCoinsForStrike = useMemo((): StrikeFeatureCoin[] =>
    baseCoinsGeneric.map((c) => {
      const isWinged = baseBoostByPosition[c.position] !== undefined;
      return { ...c, winged: isWinged, boostValue: isWinged ? (baseBoostByPosition[c.position] ?? "") : undefined } as StrikeFeatureCoin;
    }),
  [baseCoinsGeneric, baseBoostByPosition]);

  const baseCoinsForSplit = useMemo((): SplitFeatureCoin[] =>
    baseCoinsGeneric.map((c) => ({
      ...c,
      splitCount: baseSplitCountByPosition[c.position] ?? 1,
    } as SplitFeatureCoin)),
  [baseCoinsGeneric, baseSplitCountByPosition]);

  // ── Feature routing ────────────────────────────────────────────────────────
  const isSingleFeature = activeFeatures.length === 1;
  const isComboFeature  = activeFeatures.length > 1;

  const comboConfig = useMemo((): ComboFeatureConfig | null => {
    if (!isComboFeature) return null;
    const sorted = [...activeFeatures].sort();
    // When arriving from an upgrade that specifies zone params, use those instead of
    // the base-game-computed activeSplitter/activeMultipliers (which default to 1/[]).
    const splitter    = pendingUpgradeInfo?.zoneSplitter    ?? activeSplitter;
    const multipliers = pendingUpgradeInfo?.zoneMultipliers ?? activeMultipliers;
    return {
      features: sorted,
      hasExtra:  sorted.includes("extra"),
      hasZone:   sorted.includes("zone"),
      hasStrike: sorted.includes("strike"),
      hasSplit:  sorted.includes("split"),
      splitter,
      multipliers,
    };
  }, [activeFeatures, isComboFeature, activeSplitter, activeMultipliers, pendingUpgradeInfo]);

  const comboBaseCoins = useMemo((): ComboCoin[] => {
    if (!isComboFeature) return [];
    const isStrike = activeFeatures.includes("strike");
    const isSplit  = activeFeatures.includes("split");
    const result: ComboCoin[] = [];
    reelStops.forEach((stop, ri) => {
      const reel = reels[ri];
      [-1, 0, 1].forEach((off, rowIdx) => {
        const idx = (stop + off + reel.length) % reel.length;
        if (reel[idx] === "SCAT") {
          const k = `${ri}-${idx}`; const s = scatColors[k]; const v = scatValues[k];
          if (s) {
            const pos        = ri * 3 + rowIdx;
            const colorCode  = getComboScatSeedColor(activeFeatures, s.key);
            const isWinged   = isStrike && STRIKE_SCAT_KEYS.has(s.key);
            const boostVal   = isWinged ? (scatBoostValues[k] ?? "") : undefined;
            const splitCount = (isSplit && SPLIT_SCAT_KEYS.has(s.key))
              ? (Number(scatSplitCount[k]) || 1) : 1;
            result.push({ position: pos, colorCode, value: v || "1", winged: isWinged, boostValue: boostVal, splitCount, fromBase: true });
          }
        }
      });
    });
    return result;
  }, [activeFeatures, isComboFeature, reelStops, scatColors, scatValues, scatBoostValues, scatSplitCount]);

  // ── All feature gaffe lines (for output panel) ────────────────────────────
  const featureGaffes = [
    ...extraGaffeHistory, ...zoneGaffeHistory,
    ...strikeGaffeHistory, ...splitGaffeHistory, ...comboGaffeHistory,
  ];

  // ── Navigation ────────────────────────────────────────────────────────────
  // Full reset — called from BaseGame's "Go To" button. Clears everything.
  const handleGoTo = (features: string[]) => {
    setExtraGaffeHistory([]);  setZoneGaffeHistory([]);
    setStrikeGaffeHistory([]); setSplitGaffeHistory([]); setComboGaffeHistory([]);
    setPendingUpgradeInfo(null); setCarryCoins(null);
    setActiveFeatures(features);
  };

  // Upgrade navigation — preserves all gaffe history and carries coins over.
  const handleUpgradeGoTo = (features: string[], coins: ComboCoin[], upgradeInfo: UpgradeInfo) => {
    setCarryCoins(coins);
    setPendingUpgradeInfo(upgradeInfo);
    setActiveFeatures(features);
  };

  return (
    <main className="p-6 bg-gray-900 min-h-screen text-white">
      <button onClick={() => router.push("/")} className="mb-4 px-4 py-2 bg-gray-700 rounded hover:bg-gray-600">
        ← Back
      </button>
      <h1 className="text-2xl mb-6">Ignite Purple gaffe tool</h1>

      <div className="flex gap-6 items-start">
        <div className="flex flex-col gap-6 flex-1 min-w-0">

          <BaseGame
            reelStops={reelStops}               setReelStops={setReelStops}
            scatColors={scatColors}             setScatColors={setScatColors}
            scatValues={scatValues}             setScatValues={setScatValues}
            scatZoneSplitter={scatZoneSplitter} setScatZoneSplitter={setScatZoneSplitter}
            scatZoneMultipliers={scatZoneMultipliers} setScatZoneMultipliers={setScatZoneMultipliers}
            scatBoostValues={scatBoostValues}   setScatBoostValues={setScatBoostValues}
            scatSplitCount={scatSplitCount}     setScatSplitCount={setScatSplitCount}
            featureEnabled={featureEnabled}     setFeatureEnabled={setFeatureEnabled}
            grandEnabled={grandEnabled}         setGrandEnabled={setGrandEnabled}
            selectedFeatures={selectedFeatures} setSelectedFeatures={setSelectedFeatures}
            onGoTo={handleGoTo}
          />

          {/* ── SINGLE FEATURES ───────────────────────── */}

          {isSingleFeature && activeFeatures.includes("extra") && (
            <ExtraFeature
              baseCoins={baseCoinsGeneric} onCoinsChange={() => {}}
              onSpin={(snap) => setExtraGaffeHistory((p) => [...p, generateExtraFeatureGaffe(snap)])}
              onReset={() => setExtraGaffeHistory([])}
              onUpgrade={(newFeatures, carryCoins, upgradeInfo) => {
                const comboUpgradeInfo: UpgradeInfo = {
                  col:      Math.floor(upgradeInfo.pos / 3),
                  row:      upgradeInfo.pos % 3,
                  features: upgradeInfo.features,
                  ...(upgradeInfo.zoneSplitter    ? { zoneSplitter:    upgradeInfo.zoneSplitter    } : {}),
                  ...(upgradeInfo.zoneMultipliers ? { zoneMultipliers: upgradeInfo.zoneMultipliers } : {}),
                };
                const hasStrike = newFeatures.includes("strike");
                const comboCoinsSeed: ComboCoin[] = carryCoins.map((c) => ({
                  position: c.position, colorCode: c.colorCode, value: c.value,
                  ...(hasStrike ? { winged: false } : {}),
                  fromBase: true,
                }));
                handleUpgradeGoTo(newFeatures, comboCoinsSeed, comboUpgradeInfo);
              }}
            />
          )}

          {isSingleFeature && activeFeatures.includes("zone") && (
            <ZoneFeature
              baseCoins={baseCoinsGeneric} splitter={activeSplitter} multipliers={activeMultipliers}
              onCoinsChange={() => {}}
              onSpin={(snap) => setZoneGaffeHistory((p) => [...p, generateZoneFeatureGaffe(snap, activeSplitter, activeMultipliers)])}
              onReset={() => setZoneGaffeHistory([])}
              onUpgrade={(newFeatures, carryCoins, upgradeInfo) => {
                const comboUpgradeInfo: UpgradeInfo = {
                  col:      Math.floor(upgradeInfo.pos / 3),
                  row:      upgradeInfo.pos % 3,
                  features: upgradeInfo.features,
                  ...(upgradeInfo.zoneSplitter    ? { zoneSplitter:    upgradeInfo.zoneSplitter    } : {}),
                  ...(upgradeInfo.zoneMultipliers ? { zoneMultipliers: upgradeInfo.zoneMultipliers } : {}),
                };
                const hasStrike = newFeatures.includes("strike");
                const comboCoinsSeed: ComboCoin[] = carryCoins.map((c) => ({
                  position: c.position, colorCode: c.colorCode, value: c.value,
                  ...(hasStrike ? { winged: false } : {}),
                  fromBase: true,
                }));
                handleUpgradeGoTo(newFeatures, comboCoinsSeed, comboUpgradeInfo);
              }}
            />
          )}

          {isSingleFeature && activeFeatures.includes("strike") && (
            <StrikeFeature
              baseCoins={baseCoinsForStrike} onCoinsChange={() => {}}
              onSpin={(snap) => setStrikeGaffeHistory((p) => [...p, generateStrikeFeatureGaffe(snap)])}
              onReset={() => setStrikeGaffeHistory([])}
              onUpgrade={(newFeatures, carryCoins, upgradeInfo) => {
                const comboUpgradeInfo: UpgradeInfo = {
                  col:      Math.floor(upgradeInfo.pos / 3),
                  row:      upgradeInfo.pos % 3,
                  features: upgradeInfo.features,
                  ...(upgradeInfo.zoneSplitter    ? { zoneSplitter:    upgradeInfo.zoneSplitter    } : {}),
                  ...(upgradeInfo.zoneMultipliers ? { zoneMultipliers: upgradeInfo.zoneMultipliers } : {}),
                };
                const comboCoinsSeed: ComboCoin[] = carryCoins.map((c) => ({
                  position: c.position, colorCode: c.colorCode, value: c.value,
                  winged: (c as StrikeFeatureCoin).winged,
                  boostValue: (c as StrikeFeatureCoin).boostValue,
                  fromBase: true,
                }));
                handleUpgradeGoTo(newFeatures, comboCoinsSeed, comboUpgradeInfo);
              }}
            />
          )}

          {isSingleFeature && activeFeatures.includes("split") && (
            <SplitFeature
              baseCoins={baseCoinsForSplit}
              isStrikeCombo={false}
              activeFeatures={activeFeatures}
              onCoinsChange={() => {}}
              onSpin={(snap) => setSplitGaffeHistory((p) => [...p, generateSplitFeatureGaffe(snap)])}
              onReset={() => setSplitGaffeHistory([])}
              onUpgrade={(newFeatures, splitCarryCoins, upgradeInfo) => {
                const comboUpgradeInfo: UpgradeInfo = {
                  col:      Math.floor(upgradeInfo.pos / 3),
                  row:      upgradeInfo.pos % 3,
                  features: upgradeInfo.features,
                  ...(upgradeInfo.zoneSplitter    ? { zoneSplitter:    upgradeInfo.zoneSplitter    } : {}),
                  ...(upgradeInfo.zoneMultipliers ? { zoneMultipliers: upgradeInfo.zoneMultipliers } : {}),
                };
                const comboCoinsSeed: ComboCoin[] = splitCarryCoins.map((c) => ({
                  position: c.position, colorCode: c.colorCode, value: c.value,
                  wingedCopyIdx: c.wingedCopyIdxs, splitCount: c.splitCount,
                  splitCopyValues: c.splitCopyValues, splitBoostValues: c.splitBoostValues,
                  fromBase: true,
                }));
                handleUpgradeGoTo(newFeatures, comboCoinsSeed, comboUpgradeInfo);
              }}
            />
          )}

          {/* ── COMBINATION ───────────────────────────── */}

          {isComboFeature && comboConfig && (
            <CombinationFeature
              key={comboConfig.features.join("+")}
              baseCoins={carryCoins ?? comboBaseCoins}
              config={comboConfig}
              pendingUpgradeInfo={pendingUpgradeInfo}
              onSpin={(snap, line) => {
                if (pendingUpgradeInfo) setPendingUpgradeInfo(null);
                setComboGaffeHistory((p) => [...p, line]);
              }}
              onReset={() => {
                setPendingUpgradeInfo(null);
                setCarryCoins(null);
                setComboGaffeHistory([]);
              }}
              onUpgrade={(newFeatures, coins, upgradeInfo) => {
                const line = generateCombinationGaffe(coins, comboConfig, upgradeInfo);
                setComboGaffeHistory((p) => [...p, line]);
                handleUpgradeGoTo(newFeatures, coins, upgradeInfo);
              }}
            />
          )}

        </div>

        <div className="w-[380px] shrink-0">
          <GaffeOutput gaffe={gaffe} featureGaffes={featureGaffes} />
        </div>
      </div>
    </main>
  );
}