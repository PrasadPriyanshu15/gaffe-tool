


// "use client";

// import { useState, useMemo } from "react";
// import BaseGame from "../Ignite-purple/base-game";
// import GaffeOutput from "../Ignite-purple/components/GaffeOutput";
// import ExtraFeature from "../Ignite-purple/ExtraFeature";
// import { reels } from "./reels";
// import { generateGaffe } from "@/games/Ignite-purple/utils/gaffeGenerator";
// import {
//   generateExtraFeatureGaffe,
//   ExtraFeatureCoin,
// } from "@/games/Ignite-purple/extraFeatureGenerator";
// import { useRouter } from "next/navigation";

// type ScatType = {
//   key: "orange" | "blue" | "cerise" | "green" | "all";
//   label: string;
//   feature: string;
// };

// const SCAT_COLOR_CODE: Record<string, number> = {
//   green: 4,
//   blue: 9,
//   orange: 14,
//   cerise: 19,
//   all: 4,
// };

// export default function Home() {
//   const router = useRouter();

//   // ── BASE GAME STATE ──────────────────────────────────────────
//   const [reelStops, setReelStops] = useState([0, 0, 0, 0, 0]);
//   const [scatColors, setScatColors] = useState<{ [key: string]: ScatType }>({});
//   const [scatValues, setScatValues] = useState<{ [key: string]: string }>({});
//   const [scatZoneSplitter, setScatZoneSplitter] = useState<{ [key: string]: string }>({});
//   const [scatZoneMultipliers, setScatZoneMultipliers] = useState<{ [key: string]: string }>({});
//   const [scatBoostValues, setScatBoostValues] = useState<{ [key: string]: string }>({});
//   const [featureEnabled, setFeatureEnabled] = useState(true);
//   const [grandEnabled, setGrandEnabled] = useState(false);
//   const [selectedFeatures, setSelectedFeatures] = useState<string[]>([]);

//   // ── ACTIVE FEATURES ───────────────────────────────────────────
//   const [activeFeatures, setActiveFeatures] = useState<string[]>([]);

//   // ── EXTRA FEATURE STATE ───────────────────────────────────────
//   const [extraCoins, setExtraCoins] = useState<ExtraFeatureCoin[]>([]);
//   // Accumulated history: one line per spin, oldest first
//   const [featureGaffeHistory, setFeatureGaffeHistory] = useState<string[]>([]);

//   // ── BASE GAFFE ────────────────────────────────────────────────
//   const gaffe = generateGaffe(
//     reelStops,
//     reels,
//     scatColors,
//     scatValues,
//     selectedFeatures,
//     grandEnabled,
//     scatZoneSplitter,
//     scatZoneMultipliers,
//     scatBoostValues
//   );

//   // ── BASE COINS SEED ───────────────────────────────────────────
//   const baseCoinsForExtra = useMemo<ExtraFeatureCoin[]>(() => {
//     const result: ExtraFeatureCoin[] = [];
//     reelStops.forEach((stop, reelIndex) => {
//       const reel = reels[reelIndex];
//       [-1, 0, 1].forEach((offset, rowIndex) => {
//         const index = (stop + offset + reel.length) % reel.length;
//         if (reel[index] === "SCAT") {
//           const key = `${reelIndex}-${index}`;
//           const scat = scatColors[key];
//           const val = scatValues[key];
//           if (scat) {
//             // Position in feature grid: top-to-bottom, left-to-right → row*5 + col
//             // row = rowIndex (0–2), col = reelIndex (0–4)
//             result.push({
//               position: reelIndex * 3 + rowIndex,  // column-major: col*3+row
//               colorCode: SCAT_COLOR_CODE[scat.key] ?? 4,
//               value: val || "1",
//               fromBase: true,
//             });
//           }
//         }
//       });
//     });
//     return result;
//   }, [reelStops, scatColors, scatValues]);


//   return (
//     <main className="p-6 bg-gray-900 min-h-screen text-white">
//       <button
//         onClick={() => router.push("/")}
//         className="mb-4 px-4 py-2 bg-gray-700 rounded hover:bg-gray-600"
//       >
//         ← Back
//       </button>

//       <h1 className="text-2xl mb-6">Ignite Purple gaffe tool</h1>

//       <div className="flex gap-6 items-start">

//         {/* LEFT */}
//         <div className="flex flex-col gap-6 flex-1 min-w-0">
//           <BaseGame
//             reelStops={reelStops}
//             setReelStops={setReelStops}
//             scatColors={scatColors}
//             setScatColors={setScatColors}
//             scatValues={scatValues}
//             setScatValues={setScatValues}
//             scatZoneSplitter={scatZoneSplitter}
//             setScatZoneSplitter={setScatZoneSplitter}
//             scatZoneMultipliers={scatZoneMultipliers}
//             setScatZoneMultipliers={setScatZoneMultipliers}
//             scatBoostValues={scatBoostValues}
//             setScatBoostValues={setScatBoostValues}
//             featureEnabled={featureEnabled}
//             setFeatureEnabled={setFeatureEnabled}
//             grandEnabled={grandEnabled}
//             setGrandEnabled={setGrandEnabled}
//             selectedFeatures={selectedFeatures}
//             setSelectedFeatures={setSelectedFeatures}
//             onGoTo={setActiveFeatures}
//           />

//           {activeFeatures.includes("extra") && (
//             <ExtraFeature
//               baseCoins={baseCoinsForExtra}
//               onCoinsChange={setExtraCoins}
//               onSpin={(coinsSnapshot) => {
//                 const line = generateExtraFeatureGaffe(coinsSnapshot);
//                 setFeatureGaffeHistory((prev) => [...prev, line]);
//               }}
//               onReset={() => setFeatureGaffeHistory([])}
//             />
//           )}
//         </div>

//         {/* RIGHT */}
//         <div className="w-[380px] shrink-0">
//           <GaffeOutput gaffe={gaffe} featureGaffes={featureGaffeHistory} />
//         </div>

//       </div>
//     </main>
//   );
// }



//! zone feature done
// "use client";

// import { useState, useMemo } from "react";
// import BaseGame from "../Ignite-purple/base-game";
// import GaffeOutput from "../Ignite-purple/components/GaffeOutput";
// import ExtraFeature from "../Ignite-purple/ExtraFeature";
// import ZoneFeature from "../Ignite-purple/ZoneFeature";
// import { reels } from "./reels";
// import { generateGaffe } from "@/games/Ignite-purple/utils/gaffeGenerator";
// import {
//   generateExtraFeatureGaffe,
//   ExtraFeatureCoin,
// } from "@/games/Ignite-purple/extraFeatureGenerator";
// import {
//   generateZoneFeatureGaffe,
//   ZoneFeatureCoin,
// } from "@/games/Ignite-purple/zoneFeatureGenerator";
// import { useRouter } from "next/navigation";

// type ScatType = {
//   key: "orange" | "blue" | "cerise" | "green" | "all";
//   label: string;
//   feature: string;
// };

// const SCAT_COLOR_CODE: Record<string, number> = {
//   green: 4,
//   blue: 9,
//   orange: 14,
//   cerise: 19,
//   all: 4,
// };

// export default function Home() {
//   const router = useRouter();

//   // ── BASE GAME STATE ──────────────────────────────────────────
//   const [reelStops, setReelStops] = useState([0, 0, 0, 0, 0]);
//   const [scatColors, setScatColors] = useState<{ [key: string]: ScatType }>({});
//   const [scatValues, setScatValues] = useState<{ [key: string]: string }>({});
//   const [scatZoneSplitter, setScatZoneSplitter] = useState<{ [key: string]: string }>({});
//   const [scatZoneMultipliers, setScatZoneMultipliers] = useState<{ [key: string]: string }>({});
//   const [scatBoostValues, setScatBoostValues] = useState<{ [key: string]: string }>({});
//   const [featureEnabled, setFeatureEnabled] = useState(true);
//   const [grandEnabled, setGrandEnabled] = useState(false);
//   const [selectedFeatures, setSelectedFeatures] = useState<string[]>([]);

//   // ── ACTIVE FEATURES ───────────────────────────────────────────
//   const [activeFeatures, setActiveFeatures] = useState<string[]>([]);

//   // ── EXTRA FEATURE STATE ───────────────────────────────────────
//   const [extraCoins, setExtraCoins] = useState<ExtraFeatureCoin[]>([]);
//   const [extraGaffeHistory, setExtraGaffeHistory] = useState<string[]>([]);

//   // ── ZONE FEATURE STATE ────────────────────────────────────────
//   const [zoneCoins, setZoneCoins] = useState<ZoneFeatureCoin[]>([]);
//   const [zoneGaffeHistory, setZoneGaffeHistory] = useState<string[]>([]);

//   // ── BASE GAFFE ────────────────────────────────────────────────
//   const gaffe = generateGaffe(
//     reelStops,
//     reels,
//     scatColors,
//     scatValues,
//     selectedFeatures,
//     grandEnabled,
//     scatZoneSplitter,
//     scatZoneMultipliers,
//     scatBoostValues
//   );

//   // ── DERIVE ZONE SPLITTER & MULTIPLIERS FROM BASE GAME ─────────
//   // Take the first ZoneScat or AllScat that has a splitter set
//   const { activeSplitter, activeMultipliers } = useMemo(() => {
//     let splitter = 1;
//     let multipliers: number[] = [];

//     const offsets = [-1, 0, 1];
//     reelStops.forEach((stop, reelIndex) => {
//       const reel = reels[reelIndex];
//       offsets.forEach((offset) => {
//         const index = (stop + offset + reel.length) % reel.length;
//         if (reel[index] === "SCAT") {
//           const key = `${reelIndex}-${index}`;
//           const scat = scatColors[key];
//           if (scat && (scat.key === "blue" || scat.key === "all")) {
//             const zs = scatZoneSplitter[key];
//             if (zs) splitter = Number(zs);
//             const zm = scatZoneMultipliers[key];
//             if (zm) {
//               multipliers = zm.split(",").map((n) => n.trim()).filter(Boolean).map(Number);
//             }
//           }
//         }
//       });
//     });
//     return { activeSplitter: splitter, activeMultipliers: multipliers };
//   }, [reelStops, scatColors, scatZoneSplitter, scatZoneMultipliers]);

//   // ── BASE COINS SEED (shared helper) ───────────────────────────
//   const baseCoinsForFeature = useMemo(() => {
//     const result: { position: number; colorCode: number; value: string; fromBase: true }[] = [];
//     reelStops.forEach((stop, reelIndex) => {
//       const reel = reels[reelIndex];
//       [-1, 0, 1].forEach((offset, rowIndex) => {
//         const index = (stop + offset + reel.length) % reel.length;
//         if (reel[index] === "SCAT") {
//           const key = `${reelIndex}-${index}`;
//           const scat = scatColors[key];
//           const val = scatValues[key];
//           if (scat) {
//             result.push({
//               position: reelIndex * 3 + rowIndex, // column-major: col*3+row
//               colorCode: SCAT_COLOR_CODE[scat.key] ?? 4,
//               value: val || "1",
//               fromBase: true,
//             });
//           }
//         }
//       });
//     });
//     return result;
//   }, [reelStops, scatColors, scatValues]);

//   // ── COMBINED GAFFE OUTPUT ──────────────────────────────────────
//   const featureGaffes = [...extraGaffeHistory, ...zoneGaffeHistory];

//   return (
//     <main className="p-6 bg-gray-900 min-h-screen text-white">
//       <button
//         onClick={() => router.push("/")}
//         className="mb-4 px-4 py-2 bg-gray-700 rounded hover:bg-gray-600"
//       >
//         ← Back
//       </button>

//       <h1 className="text-2xl mb-6">Ignite Purple gaffe tool</h1>

//       <div className="flex gap-6 items-start">

//         {/* LEFT */}
//         <div className="flex flex-col gap-6 flex-1 min-w-0">
//           <BaseGame
//             reelStops={reelStops}
//             setReelStops={setReelStops}
//             scatColors={scatColors}
//             setScatColors={setScatColors}
//             scatValues={scatValues}
//             setScatValues={setScatValues}
//             scatZoneSplitter={scatZoneSplitter}
//             setScatZoneSplitter={setScatZoneSplitter}
//             scatZoneMultipliers={scatZoneMultipliers}
//             setScatZoneMultipliers={setScatZoneMultipliers}
//             scatBoostValues={scatBoostValues}
//             setScatBoostValues={setScatBoostValues}
//             featureEnabled={featureEnabled}
//             setFeatureEnabled={setFeatureEnabled}
//             grandEnabled={grandEnabled}
//             setGrandEnabled={setGrandEnabled}
//             selectedFeatures={selectedFeatures}
//             setSelectedFeatures={setSelectedFeatures}
//             onGoTo={setActiveFeatures}
//           />

//           {activeFeatures.includes("extra") && (
//             <ExtraFeature
//               baseCoins={baseCoinsForFeature}
//               onCoinsChange={setExtraCoins}
//               onSpin={(snap) => {
//                 const line = generateExtraFeatureGaffe(snap);
//                 setExtraGaffeHistory((prev) => [...prev, line]);
//               }}
//               onReset={() => setExtraGaffeHistory([])}
//             />
//           )}

//           {activeFeatures.includes("zone") && (
//             <ZoneFeature
//               baseCoins={baseCoinsForFeature}
//               splitter={activeSplitter}
//               multipliers={activeMultipliers}
//               onCoinsChange={setZoneCoins}
//               onSpin={(snap) => {
//                 const line = generateZoneFeatureGaffe(snap, activeSplitter, activeMultipliers);
//                 setZoneGaffeHistory((prev) => [...prev, line]);
//               }}
//               onReset={() => setZoneGaffeHistory([])}
//             />
//           )}
//         </div>

//         {/* RIGHT */}
//         <div className="w-[380px] shrink-0">
//           <GaffeOutput gaffe={gaffe} featureGaffes={featureGaffes} />
//         </div>

//       </div>
//     </main>
//   );
// }




// //! extra  zone Strike
// "use client";

// import { useState, useMemo } from "react";
// import BaseGame from "../Ignite-purple/base-game";
// import GaffeOutput from "../Ignite-purple/components/GaffeOutput";
// import ExtraFeature from "../Ignite-purple/ExtraFeature";
// import ZoneFeature from "../Ignite-purple/ZoneFeature";
// import StrikeFeature from "../Ignite-purple/StrikeFeature";
// import { reels } from "./reels";
// import { generateGaffe } from "@/games/Ignite-purple/utils/gaffeGenerator";
// import {
//   generateExtraFeatureGaffe,
//   ExtraFeatureCoin,
// } from "@/games/Ignite-purple/extraFeatureGenerator";
// import {
//   generateZoneFeatureGaffe,
//   ZoneFeatureCoin,
// } from "@/games/Ignite-purple/zoneFeatureGenerator";
// import {
//   generateStrikeFeatureGaffe,
//   StrikeFeatureCoin,
// } from "@/games/Ignite-purple/strikeFeatureGenerator";
// import { useRouter } from "next/navigation";

// type ScatType = {
//   key: "orange" | "blue" | "cerise" | "green" | "all";
//   label: string;
//   feature: string;
// };

// const SCAT_COLOR_CODE: Record<string, number> = {
//   green: 4,
//   blue: 9,
//   orange: 14,
//   cerise: 19,
//   all: 4,
// };

// export default function Home() {
//   const router = useRouter();

//   // ── BASE GAME STATE ──────────────────────────────────────────
//   const [reelStops, setReelStops] = useState([0, 0, 0, 0, 0]);
//   const [scatColors, setScatColors] = useState<{ [key: string]: ScatType }>({});
//   const [scatValues, setScatValues] = useState<{ [key: string]: string }>({});
//   const [scatZoneSplitter, setScatZoneSplitter] = useState<{ [key: string]: string }>({});
//   const [scatZoneMultipliers, setScatZoneMultipliers] = useState<{ [key: string]: string }>({});
//   const [scatBoostValues, setScatBoostValues] = useState<{ [key: string]: string }>({});
//   const [featureEnabled, setFeatureEnabled] = useState(true);
//   const [grandEnabled, setGrandEnabled] = useState(false);
//   const [selectedFeatures, setSelectedFeatures] = useState<string[]>([]);

//   // ── ACTIVE FEATURES ───────────────────────────────────────────
//   const [activeFeatures, setActiveFeatures] = useState<string[]>([]);

//   // ── EXTRA FEATURE STATE ───────────────────────────────────────
//   const [extraCoins, setExtraCoins] = useState<ExtraFeatureCoin[]>([]);
//   const [extraGaffeHistory, setExtraGaffeHistory] = useState<string[]>([]);

//   // ── ZONE FEATURE STATE ────────────────────────────────────────
//   const [zoneCoins, setZoneCoins] = useState<ZoneFeatureCoin[]>([]);
//   const [zoneGaffeHistory, setZoneGaffeHistory] = useState<string[]>([]);

//   // ── STRIKE FEATURE STATE ──────────────────────────────────────
//   const [strikeCoins, setStrikeCoins] = useState<StrikeFeatureCoin[]>([]);
//   const [strikeGaffeHistory, setStrikeGaffeHistory] = useState<string[]>([]);

//   // ── BASE GAFFE ────────────────────────────────────────────────
//   const gaffe = generateGaffe(
//     reelStops,
//     reels,
//     scatColors,
//     scatValues,
//     selectedFeatures,
//     grandEnabled,
//     scatZoneSplitter,
//     scatZoneMultipliers,
//     scatBoostValues
//   );

//   // ── DERIVE ZONE SPLITTER & MULTIPLIERS FROM BASE GAME ─────────
//   // Take the first ZoneScat or AllScat that has a splitter set
//   const { activeSplitter, activeMultipliers } = useMemo(() => {
//     let splitter = 1;
//     let multipliers: number[] = [];

//     const offsets = [-1, 0, 1];
//     reelStops.forEach((stop, reelIndex) => {
//       const reel = reels[reelIndex];
//       offsets.forEach((offset) => {
//         const index = (stop + offset + reel.length) % reel.length;
//         if (reel[index] === "SCAT") {
//           const key = `${reelIndex}-${index}`;
//           const scat = scatColors[key];
//           if (scat && (scat.key === "blue" || scat.key === "all")) {
//             const zs = scatZoneSplitter[key];
//             if (zs) splitter = Number(zs);
//             const zm = scatZoneMultipliers[key];
//             if (zm) {
//               multipliers = zm.split(",").map((n) => n.trim()).filter(Boolean).map(Number);
//             }
//           }
//         }
//       });
//     });
//     return { activeSplitter: splitter, activeMultipliers: multipliers };
//   }, [reelStops, scatColors, scatZoneSplitter, scatZoneMultipliers]);

//   // ── BASE COINS SEED (shared helper) ───────────────────────────
//   const baseCoinsForFeature = useMemo(() => {
//     const result: { position: number; colorCode: number; value: string; fromBase: true }[] = [];
//     reelStops.forEach((stop, reelIndex) => {
//       const reel = reels[reelIndex];
//       [-1, 0, 1].forEach((offset, rowIndex) => {
//         const index = (stop + offset + reel.length) % reel.length;
//         if (reel[index] === "SCAT") {
//           const key = `${reelIndex}-${index}`;
//           const scat = scatColors[key];
//           const val = scatValues[key];
//           if (scat) {
//             result.push({
//               position: reelIndex * 3 + rowIndex, // column-major: col*3+row
//               colorCode: SCAT_COLOR_CODE[scat.key] ?? 4,
//               value: val || "1",
//               fromBase: true,
//             });
//           }
//         }
//       });
//     });
//     return result;
//   }, [reelStops, scatColors, scatValues]);

//   // ── COMBINED GAFFE OUTPUT ──────────────────────────────────────
//   const featureGaffes = [...extraGaffeHistory, ...zoneGaffeHistory, ...strikeGaffeHistory];

//   return (
//     <main className="p-6 bg-gray-900 min-h-screen text-white">
//       <button
//         onClick={() => router.push("/")}
//         className="mb-4 px-4 py-2 bg-gray-700 rounded hover:bg-gray-600"
//       >
//         ← Back
//       </button>

//       <h1 className="text-2xl mb-6">Ignite Purple gaffe tool</h1>

//       <div className="flex gap-6 items-start">

//         {/* LEFT */}
//         <div className="flex flex-col gap-6 flex-1 min-w-0">
//           <BaseGame
//             reelStops={reelStops}
//             setReelStops={setReelStops}
//             scatColors={scatColors}
//             setScatColors={setScatColors}
//             scatValues={scatValues}
//             setScatValues={setScatValues}
//             scatZoneSplitter={scatZoneSplitter}
//             setScatZoneSplitter={setScatZoneSplitter}
//             scatZoneMultipliers={scatZoneMultipliers}
//             setScatZoneMultipliers={setScatZoneMultipliers}
//             scatBoostValues={scatBoostValues}
//             setScatBoostValues={setScatBoostValues}
//             featureEnabled={featureEnabled}
//             setFeatureEnabled={setFeatureEnabled}
//             grandEnabled={grandEnabled}
//             setGrandEnabled={setGrandEnabled}
//             selectedFeatures={selectedFeatures}
//             setSelectedFeatures={setSelectedFeatures}
//             onGoTo={setActiveFeatures}
//           />

//           {activeFeatures.includes("extra") && (
//             <ExtraFeature
//               baseCoins={baseCoinsForFeature}
//               onCoinsChange={setExtraCoins}
//               onSpin={(snap) => {
//                 const line = generateExtraFeatureGaffe(snap);
//                 setExtraGaffeHistory((prev) => [...prev, line]);
//               }}
//               onReset={() => setExtraGaffeHistory([])}
//             />
//           )}

//           {activeFeatures.includes("zone") && (
//             <ZoneFeature
//               baseCoins={baseCoinsForFeature}
//               splitter={activeSplitter}
//               multipliers={activeMultipliers}
//               onCoinsChange={setZoneCoins}
//               onSpin={(snap) => {
//                 const line = generateZoneFeatureGaffe(snap, activeSplitter, activeMultipliers);
//                 setZoneGaffeHistory((prev) => [...prev, line]);
//               }}
//               onReset={() => setZoneGaffeHistory([])}
//             />
//           )}

//           {activeFeatures.includes("strike") && (
//             <StrikeFeature
//               baseCoins={baseCoinsForFeature.map((c) => ({ ...c, winged: false }))}
//               onCoinsChange={setStrikeCoins}
//               onSpin={(snap) => {
//                 const line = generateStrikeFeatureGaffe(snap);
//                 setStrikeGaffeHistory((prev) => [...prev, line]);
//               }}
//               onReset={() => setStrikeGaffeHistory([])}
//             />
//           )}
//         </div>

//         {/* RIGHT */}
//         <div className="w-[380px] shrink-0">
//           <GaffeOutput gaffe={gaffe} featureGaffes={featureGaffes} />
//         </div>

//       </div>
//     </main>
//   );
// }



//! 3 feature + its combinations

// "use client";

// import { useState, useMemo } from "react";
// import BaseGame from "../Ignite-purple/base-game";
// import GaffeOutput from "../Ignite-purple/components/GaffeOutput";
// import ExtraFeature from "../Ignite-purple/ExtraFeature";
// import ZoneFeature from "../Ignite-purple/ZoneFeature";
// import StrikeFeature from "../Ignite-purple/StrikeFeature";
// import CombinationFeature from "../Ignite-purple/CombinationFeature";
// import { reels } from "./reels";
// import { generateGaffe } from "@/games/Ignite-purple/utils/gaffeGenerator";
// import { generateExtraFeatureGaffe, ExtraFeatureCoin } from "@/games/Ignite-purple/extraFeatureGenerator";
// import { generateZoneFeatureGaffe, ZoneFeatureCoin } from "@/games/Ignite-purple/zoneFeatureGenerator";
// import { generateStrikeFeatureGaffe, StrikeFeatureCoin } from "@/games/Ignite-purple/strikeFeatureGenerator";
// import {
//   generateCombinationGaffe,
//   getComboScatSeedColor,
//   ComboFeatureConfig,
//   ComboCoin,
// } from "@/games/Ignite-purple/combinationFeatureGenerator";
// import { useRouter } from "next/navigation";

// // ─────────────────────────────────────────────────────────────────────────────
// type ScatType = {
//   key: "orange" | "blue" | "cerise" | "green" | "all";
//   label: string;
//   feature: string;
// };

// // Default colorCode for single-feature seed (not combination)
// const SCAT_COLOR_CODE: Record<string, number> = {
//   green: 4, blue: 9, orange: 14, cerise: 19, all: 4,
// };

// // Which scat types count as "strike-origin" → seed as winged in Strike feature
// const STRIKE_SCAT_KEYS = new Set(["orange", "all"]);

// // ─────────────────────────────────────────────────────────────────────────────
// export default function Home() {
//   const router = useRouter();

//   // ── BASE GAME STATE ──────────────────────────────────────────────────────
//   const [reelStops,          setReelStops]          = useState([0, 0, 0, 0, 0]);
//   const [scatColors,         setScatColors]         = useState<{ [key: string]: ScatType }>({});
//   const [scatValues,         setScatValues]         = useState<{ [key: string]: string }>({});
//   const [scatZoneSplitter,   setScatZoneSplitter]   = useState<{ [key: string]: string }>({});
//   const [scatZoneMultipliers,setScatZoneMultipliers]= useState<{ [key: string]: string }>({});
//   const [scatBoostValues,    setScatBoostValues]    = useState<{ [key: string]: string }>({});
//   const [featureEnabled,     setFeatureEnabled]     = useState(true);
//   const [grandEnabled,       setGrandEnabled]       = useState(false);
//   const [selectedFeatures,   setSelectedFeatures]   = useState<string[]>([]);

//   // ── ACTIVE FEATURES (locked in when "Go to" is clicked) ─────────────────
//   const [activeFeatures, setActiveFeatures] = useState<string[]>([]);

//   // ── SINGLE-FEATURE HISTORY ───────────────────────────────────────────────
//   const [extraGaffeHistory,  setExtraGaffeHistory]  = useState<string[]>([]);
//   const [zoneGaffeHistory,   setZoneGaffeHistory]   = useState<string[]>([]);
//   const [strikeGaffeHistory, setStrikeGaffeHistory] = useState<string[]>([]);

//   // ── COMBINATION HISTORY ──────────────────────────────────────────────────
//   const [comboGaffeHistory,  setComboGaffeHistory]  = useState<string[]>([]);

//   // ── BASE GAFFE ───────────────────────────────────────────────────────────
//   const gaffe = generateGaffe(
//     reelStops, reels, scatColors, scatValues, selectedFeatures,
//     grandEnabled, scatZoneSplitter, scatZoneMultipliers, scatBoostValues
//   );

//   // ── DERIVE ZONE SPLITTER + MULTIPLIERS FROM BASE SCATS ──────────────────
//   const { activeSplitter, activeMultipliers } = useMemo(() => {
//     let splitter = 1;
//     let multipliers: number[] = [];
//     reelStops.forEach((stop, reelIndex) => {
//       const reel = reels[reelIndex];
//       [-1, 0, 1].forEach((offset) => {
//         const index = (stop + offset + reel.length) % reel.length;
//         if (reel[index] === "SCAT") {
//           const key  = `${reelIndex}-${index}`;
//           const scat = scatColors[key];
//           if (scat && (scat.key === "blue" || scat.key === "all")) {
//             const zs = scatZoneSplitter[key];
//             if (zs) splitter = Number(zs);
//             const zm = scatZoneMultipliers[key];
//             if (zm) multipliers = zm.split(",").map((n) => n.trim()).filter(Boolean).map(Number);
//           }
//         }
//       });
//     });
//     return { activeSplitter: splitter, activeMultipliers: multipliers };
//   }, [reelStops, scatColors, scatZoneSplitter, scatZoneMultipliers]);

//   // ── DERIVE BOOST VALUES FROM BASE SCATS (for Strike seed) ───────────────
//   // Map position → boost value string for StrikeScat / AllColorScat positions
//   const baseBoostByPosition = useMemo(() => {
//     const map: Record<number, string> = {};
//     reelStops.forEach((stop, reelIndex) => {
//       const reel = reels[reelIndex];
//       [-1, 0, 1].forEach((offset, rowIndex) => {
//         const index = (stop + offset + reel.length) % reel.length;
//         if (reel[index] === "SCAT") {
//           const key  = `${reelIndex}-${index}`;
//           const scat = scatColors[key];
//           if (scat && STRIKE_SCAT_KEYS.has(scat.key)) {
//             const pos   = reelIndex * 3 + rowIndex;
//             const boost = scatBoostValues[key];
//             if (boost) map[pos] = boost;
//           }
//         }
//       });
//     });
//     return map;
//   }, [reelStops, scatColors, scatBoostValues]);

//   // ── BASE COINS — generic seed (used by Extra / Zone) ────────────────────
//   const baseCoinsGeneric = useMemo(() => {
//     const result: { position: number; colorCode: number; value: string; fromBase: true }[] = [];
//     reelStops.forEach((stop, reelIndex) => {
//       const reel = reels[reelIndex];
//       [-1, 0, 1].forEach((offset, rowIndex) => {
//         const index = (stop + offset + reel.length) % reel.length;
//         if (reel[index] === "SCAT") {
//           const key  = `${reelIndex}-${index}`;
//           const scat = scatColors[key];
//           const val  = scatValues[key];
//           if (scat) {
//             result.push({
//               position:  reelIndex * 3 + rowIndex,
//               colorCode: SCAT_COLOR_CODE[scat.key] ?? 4,
//               value:     val || "1",
//               fromBase:  true,
//             });
//           }
//         }
//       });
//     });
//     return result;
//   }, [reelStops, scatColors, scatValues]);

//   // ── BASE COINS — Strike-specific seed (winged for orange/all scats) ──────
//   const baseCoinsForStrike = useMemo((): StrikeFeatureCoin[] => {
//     return baseCoinsGeneric.map((c) => {
//       const isWinged = baseBoostByPosition[c.position] !== undefined;
//       return {
//         ...c,
//         winged:     isWinged,
//         boostValue: isWinged ? (baseBoostByPosition[c.position] ?? "") : undefined,
//       } as StrikeFeatureCoin;
//     });
//   }, [baseCoinsGeneric, baseBoostByPosition]);

//   // ── BASE COINS — Combination seed ───────────────────────────────────────
//   // colorCode remapped per combination; strike scats → winged
//   const buildBaseCoinsForCombo = (features: string[]): ComboCoin[] => {
//     const result: ComboCoin[] = [];
//     const isStrikeCombo = features.includes("strike");

//     reelStops.forEach((stop, reelIndex) => {
//       const reel = reels[reelIndex];
//       [-1, 0, 1].forEach((offset, rowIndex) => {
//         const index = (stop + offset + reel.length) % reel.length;
//         if (reel[index] === "SCAT") {
//           const key  = `${reelIndex}-${index}`;
//           const scat = scatColors[key];
//           const val  = scatValues[key];
//           if (scat) {
//             const pos         = reelIndex * 3 + rowIndex;
//             const colorCode   = getComboScatSeedColor(features, scat.key);
//             const isWinged    = isStrikeCombo && STRIKE_SCAT_KEYS.has(scat.key);
//             const boostVal    = isWinged ? (scatBoostValues[key] ?? "") : undefined;
//             result.push({
//               position:   pos,
//               colorCode,
//               value:      val || "1",
//               winged:     isWinged,
//               boostValue: boostVal,
//               fromBase:   true,
//             });
//           }
//         }
//       });
//     });
//     return result;
//   };

//   // ── CLASSIFY: single vs combination ──────────────────────────────────────
//   const isSingleFeature = activeFeatures.length === 1;
//   const isComboFeature  = activeFeatures.length > 1;

//   // Combo config (only built when in combo mode)
//   const comboConfig = useMemo((): ComboFeatureConfig | null => {
//     if (!isComboFeature) return null;
//     const sorted = [...activeFeatures].sort();
//     return {
//       features:    sorted,
//       hasExtra:    sorted.includes("extra"),
//       hasZone:     sorted.includes("zone"),
//       hasStrike:   sorted.includes("strike"),
//       splitter:    activeSplitter,
//       multipliers: activeMultipliers,
//     };
//   }, [activeFeatures, isComboFeature, activeSplitter, activeMultipliers]);

//   const comboBaseCoins = useMemo(
//     () => (isComboFeature ? buildBaseCoinsForCombo(activeFeatures) : []),
//     [activeFeatures, isComboFeature, reelStops, scatColors, scatValues, scatBoostValues]
//   );

//   // ── ALL GAFFE OUTPUT LINES ───────────────────────────────────────────────
//   const featureGaffes = [
//     ...extraGaffeHistory,
//     ...zoneGaffeHistory,
//     ...strikeGaffeHistory,
//     ...comboGaffeHistory,
//   ];

//   // ── HANDLE GO TO ─────────────────────────────────────────────────────────
//   const handleGoTo = (features: string[]) => {
//     // Clear all history when switching modes
//     setExtraGaffeHistory([]);
//     setZoneGaffeHistory([]);
//     setStrikeGaffeHistory([]);
//     setComboGaffeHistory([]);
//     setActiveFeatures(features);
//   };

//   // ─────────────────────────────────────────────────────────────────────────
//   return (
//     <main className="p-6 bg-gray-900 min-h-screen text-white">
//       <button
//         onClick={() => router.push("/")}
//         className="mb-4 px-4 py-2 bg-gray-700 rounded hover:bg-gray-600"
//       >
//         ← Back
//       </button>

//       <h1 className="text-2xl mb-6">Ignite Purple gaffe tool</h1>

//       <div className="flex gap-6 items-start">

//         {/* LEFT — base game + active feature section */}
//         <div className="flex flex-col gap-6 flex-1 min-w-0">

//           <BaseGame
//             reelStops={reelStops}           setReelStops={setReelStops}
//             scatColors={scatColors}         setScatColors={setScatColors}
//             scatValues={scatValues}         setScatValues={setScatValues}
//             scatZoneSplitter={scatZoneSplitter}     setScatZoneSplitter={setScatZoneSplitter}
//             scatZoneMultipliers={scatZoneMultipliers} setScatZoneMultipliers={setScatZoneMultipliers}
//             scatBoostValues={scatBoostValues}       setScatBoostValues={setScatBoostValues}
//             featureEnabled={featureEnabled} setFeatureEnabled={setFeatureEnabled}
//             grandEnabled={grandEnabled}     setGrandEnabled={setGrandEnabled}
//             selectedFeatures={selectedFeatures}     setSelectedFeatures={setSelectedFeatures}
//             onGoTo={handleGoTo}
//           />

//           {/* ── SINGLE FEATURE SECTIONS ─────────────────────────── */}
//           {isSingleFeature && activeFeatures.includes("extra") && (
//             <ExtraFeature
//               baseCoins={baseCoinsGeneric}
//               onCoinsChange={() => {}}
//               onSpin={(snap) => {
//                 setExtraGaffeHistory((prev) => [...prev, generateExtraFeatureGaffe(snap)]);
//               }}
//               onReset={() => setExtraGaffeHistory([])}
//             />
//           )}

//           {isSingleFeature && activeFeatures.includes("zone") && (
//             <ZoneFeature
//               baseCoins={baseCoinsGeneric}
//               splitter={activeSplitter}
//               multipliers={activeMultipliers}
//               onCoinsChange={() => {}}
//               onSpin={(snap) => {
//                 setZoneGaffeHistory((prev) => [
//                   ...prev,
//                   generateZoneFeatureGaffe(snap, activeSplitter, activeMultipliers),
//                 ]);
//               }}
//               onReset={() => setZoneGaffeHistory([])}
//             />
//           )}

//           {isSingleFeature && activeFeatures.includes("strike") && (
//             <StrikeFeature
//               baseCoins={baseCoinsForStrike}
//               onCoinsChange={() => {}}
//               onSpin={(snap) => {
//                 setStrikeGaffeHistory((prev) => [...prev, generateStrikeFeatureGaffe(snap)]);
//               }}
//               onReset={() => setStrikeGaffeHistory([])}
//             />
//           )}

//           {/* ── COMBINATION FEATURE SECTION ─────────────────────── */}
//           {isComboFeature && comboConfig && (
//             <CombinationFeature
//               baseCoins={comboBaseCoins}
//               config={comboConfig}
//               onSpin={(snap) => {
//                 setComboGaffeHistory((prev) => [
//                   ...prev,
//                   generateCombinationGaffe(snap, comboConfig),
//                 ]);
//               }}
//               onReset={() => setComboGaffeHistory([])}
//             />
//           )}

//         </div>

//         {/* RIGHT — output panel */}
//         <div className="w-[380px] shrink-0">
//           <GaffeOutput gaffe={gaffe} featureGaffes={featureGaffes} />
//         </div>

//       </div>
//     </main>
//   );
// }


//! all 4 features with combinaitons


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
import { generateExtraFeatureGaffe } from "@/games/Ignite-purple/features/extra/extraFeatureGenerator";
import { generateZoneFeatureGaffe } from "@/games/Ignite-purple/features/zone/zoneFeatureGenerator";
import { generateStrikeFeatureGaffe, StrikeFeatureCoin } from "@/games/Ignite-purple/features/strike/strikeFeatureGenerator";
import { generateSplitFeatureGaffe, generateSplitStrikeGaffe, SplitFeatureCoin } from "@/games/Ignite-purple/features/split/splitFeatureGenerator";
import {
  generateCombinationGaffe, getComboScatSeedColor,
  ComboFeatureConfig, ComboCoin,
} from "@/games/Ignite-purple/features/combinations/combinationFeatureGenerator";
import { useRouter } from "next/navigation";

type ScatType = {
  key: "orange" | "blue" | "cerise" | "green" | "all";
  label: string; feature: string;
};

const SCAT_COLOR_CODE: Record<string, number> = {
  green:4, blue:9, orange:14, cerise:19, all:4,
};
// Strike-origin scats → seed as winged
const STRIKE_SCAT_KEYS = new Set(["orange", "all"]);
// Split-origin scats → carry splitCount from base game
const SPLIT_SCAT_KEYS  = new Set(["cerise", "all"]);

export default function Home() {
  const router = useRouter();

  // ── BASE GAME STATE ──────────────────────────────────────────────────────
  const [reelStops,           setReelStops]           = useState([0,0,0,0,0]);
  const [scatColors,          setScatColors]          = useState<{[k:string]:ScatType}>({});
  const [scatValues,          setScatValues]          = useState<{[k:string]:string}>({});
  const [scatZoneSplitter,    setScatZoneSplitter]    = useState<{[k:string]:string}>({});
  const [scatZoneMultipliers, setScatZoneMultipliers] = useState<{[k:string]:string}>({});
  const [scatBoostValues,     setScatBoostValues]     = useState<{[k:string]:string}>({});
  const [scatSplitCount,      setScatSplitCount]      = useState<{[k:string]:string}>({});
  const [featureEnabled,      setFeatureEnabled]      = useState(true);
  const [grandEnabled,        setGrandEnabled]        = useState(false);
  const [selectedFeatures,    setSelectedFeatures]    = useState<string[]>([]);

  // ── ACTIVE FEATURES ───────────────────────────────────────────────────────
  const [activeFeatures, setActiveFeatures] = useState<string[]>([]);

  // ── GAFFE HISTORIES ───────────────────────────────────────────────────────
  const [extraGaffeHistory,  setExtraGaffeHistory]  = useState<string[]>([]);
  const [zoneGaffeHistory,   setZoneGaffeHistory]   = useState<string[]>([]);
  const [strikeGaffeHistory, setStrikeGaffeHistory] = useState<string[]>([]);
  const [splitGaffeHistory,  setSplitGaffeHistory]  = useState<string[]>([]);
  const [comboGaffeHistory,  setComboGaffeHistory]  = useState<string[]>([]);

  // ── BASE GAFFE ────────────────────────────────────────────────────────────
  const gaffe = generateGaffe(
    reelStops, reels, scatColors, scatValues, selectedFeatures,
    grandEnabled, scatZoneSplitter, scatZoneMultipliers, scatBoostValues, scatSplitCount
  );

  // ── ZONE PARAMS ───────────────────────────────────────────────────────────
  const { activeSplitter, activeMultipliers } = useMemo(() => {
    let splitter = 1; let multipliers: number[] = [];
    reelStops.forEach((stop, ri) => {
      const reel = reels[ri];
      [-1,0,1].forEach((off) => {
        const idx = (stop+off+reel.length)%reel.length;
        if (reel[idx]==="SCAT") {
          const k = `${ri}-${idx}`; const s = scatColors[k];
          if (s && (s.key==="blue"||s.key==="all")) {
            const zs = scatZoneSplitter[k];  if (zs) splitter = Number(zs);
            const zm = scatZoneMultipliers[k];
            if (zm) multipliers = zm.split(",").map(n=>n.trim()).filter(Boolean).map(Number);
          }
        }
      });
    });
    return { activeSplitter:splitter, activeMultipliers:multipliers };
  }, [reelStops, scatColors, scatZoneSplitter, scatZoneMultipliers]);

  // ── BOOST BY POSITION (strike seed) ──────────────────────────────────────
  const baseBoostByPosition = useMemo(() => {
    const map: Record<number,string> = {};
    reelStops.forEach((stop, ri) => {
      const reel = reels[ri];
      [-1,0,1].forEach((off, rowIdx) => {
        const idx = (stop+off+reel.length)%reel.length;
        if (reel[idx]==="SCAT") {
          const k = `${ri}-${idx}`; const s = scatColors[k];
          if (s && STRIKE_SCAT_KEYS.has(s.key)) {
            const pos = ri*3+rowIdx; const bv = scatBoostValues[k];
            if (bv) map[pos]=bv;
          }
        }
      });
    });
    return map;
  }, [reelStops, scatColors, scatBoostValues]);

  // ── SPLIT COUNT BY POSITION (split seed) ─────────────────────────────────
  const baseSplitCountByPosition = useMemo(() => {
    const map: Record<number,number> = {};
    reelStops.forEach((stop, ri) => {
      const reel = reels[ri];
      [-1,0,1].forEach((off, rowIdx) => {
        const idx = (stop+off+reel.length)%reel.length;
        if (reel[idx]==="SCAT") {
          const k = `${ri}-${idx}`; const s = scatColors[k];
          if (s && SPLIT_SCAT_KEYS.has(s.key)) {
            const pos = ri*3+rowIdx; const sc = scatSplitCount[k];
            if (sc) map[pos]=Number(sc);
          }
        }
      });
    });
    return map;
  }, [reelStops, scatColors, scatSplitCount]);

  // ── GENERIC BASE COINS (Extra / Zone) ────────────────────────────────────
  const baseCoinsGeneric = useMemo(() => {
    const result: {position:number;colorCode:number;value:string;fromBase:true}[] = [];
    reelStops.forEach((stop,ri) => {
      const reel=reels[ri];
      [-1,0,1].forEach((off,rowIdx) => {
        const idx=(stop+off+reel.length)%reel.length;
        if (reel[idx]==="SCAT") {
          const k=`${ri}-${idx}`; const s=scatColors[k]; const v=scatValues[k];
          if (s) result.push({ position:ri*3+rowIdx, colorCode:SCAT_COLOR_CODE[s.key]??4, value:v||"1", fromBase:true });
        }
      });
    });
    return result;
  }, [reelStops, scatColors, scatValues]);

  // ── STRIKE BASE COINS ─────────────────────────────────────────────────────
  const baseCoinsForStrike = useMemo((): StrikeFeatureCoin[] =>
    baseCoinsGeneric.map((c) => {
      const isWinged = baseBoostByPosition[c.position] !== undefined;
      return { ...c, winged:isWinged, boostValue:isWinged?(baseBoostByPosition[c.position]??""):undefined } as StrikeFeatureCoin;
    }),
  [baseCoinsGeneric, baseBoostByPosition]);

  // ── SPLIT BASE COINS ──────────────────────────────────────────────────────
  const baseCoinsForSplit = useMemo((): SplitFeatureCoin[] =>
    baseCoinsGeneric.map((c) => ({
      ...c,
      splitCount: baseSplitCountByPosition[c.position] ?? 1,
    } as SplitFeatureCoin)),
  [baseCoinsGeneric, baseSplitCountByPosition]);

  // ── COMBO SETUP ───────────────────────────────────────────────────────────
  const isSingleFeature = activeFeatures.length === 1;
  const isComboFeature  = activeFeatures.length > 1;

  const comboConfig = useMemo((): ComboFeatureConfig | null => {
    if (!isComboFeature) return null;
    const sorted = [...activeFeatures].sort();
    return {
      features:sorted, hasExtra:sorted.includes("extra"), hasZone:sorted.includes("zone"),
      hasStrike:sorted.includes("strike"), hasSplit:sorted.includes("split"),
      splitter:activeSplitter, multipliers:activeMultipliers,
    };
  }, [activeFeatures, isComboFeature, activeSplitter, activeMultipliers]);

  const comboBaseCoins = useMemo((): ComboCoin[] => {
    if (!isComboFeature) return [];
    const isStrike = activeFeatures.includes("strike");
    const isSplit  = activeFeatures.includes("split");
    const result: ComboCoin[] = [];
    reelStops.forEach((stop,ri) => {
      const reel=reels[ri];
      [-1,0,1].forEach((off,rowIdx) => {
        const idx=(stop+off+reel.length)%reel.length;
        if (reel[idx]==="SCAT") {
          const k=`${ri}-${idx}`; const s=scatColors[k]; const v=scatValues[k];
          if (s) {
            const pos        = ri*3+rowIdx;
            const colorCode  = getComboScatSeedColor(activeFeatures, s.key);
            const isWinged   = isStrike && STRIKE_SCAT_KEYS.has(s.key);
            const boostVal   = isWinged ? (scatBoostValues[k]??"") : undefined;
            const splitCount = (isSplit && SPLIT_SCAT_KEYS.has(s.key))
              ? (Number(scatSplitCount[k])||1) : 1;
            result.push({ position:pos, colorCode, value:v||"1", winged:isWinged, boostValue:boostVal, splitCount, fromBase:true });
          }
        }
      });
    });
    return result;
  }, [activeFeatures, isComboFeature, reelStops, scatColors, scatValues, scatBoostValues, scatSplitCount]);

  // ── COMBINED OUTPUT ───────────────────────────────────────────────────────
  const featureGaffes = [
    ...extraGaffeHistory, ...zoneGaffeHistory,
    ...strikeGaffeHistory, ...splitGaffeHistory, ...comboGaffeHistory,
  ];

  const handleGoTo = (features: string[]) => {
    setExtraGaffeHistory([]); setZoneGaffeHistory([]);
    setStrikeGaffeHistory([]); setSplitGaffeHistory([]); setComboGaffeHistory([]);
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
              baseCoins={baseCoinsGeneric} onCoinsChange={()=>{}}
              onSpin={(snap) => setExtraGaffeHistory((p) => [...p, generateExtraFeatureGaffe(snap)])}
              onReset={() => setExtraGaffeHistory([])}
            />
          )}

          {isSingleFeature && activeFeatures.includes("zone") && (
            <ZoneFeature
              baseCoins={baseCoinsGeneric} splitter={activeSplitter} multipliers={activeMultipliers}
              onCoinsChange={()=>{}}
              onSpin={(snap) => setZoneGaffeHistory((p) => [...p, generateZoneFeatureGaffe(snap, activeSplitter, activeMultipliers)])}
              onReset={() => setZoneGaffeHistory([])}
            />
          )}

          {isSingleFeature && activeFeatures.includes("strike") && (
            <StrikeFeature
              baseCoins={baseCoinsForStrike} onCoinsChange={()=>{}}
              onSpin={(snap) => setStrikeGaffeHistory((p) => [...p, generateStrikeFeatureGaffe(snap)])}
              onReset={() => setStrikeGaffeHistory([])}
            />
          )}

          {isSingleFeature && activeFeatures.includes("split") && (
            <SplitFeature
              baseCoins={baseCoinsForSplit}
              isStrikeCombo={false}
              onCoinsChange={()=>{}}
              onSpin={(snap) => setSplitGaffeHistory((p) => [...p, generateSplitFeatureGaffe(snap)])}
              onReset={() => setSplitGaffeHistory([])}
            />
          )}

          {/* ── COMBINATION ───────────────────────────── */}
          {isComboFeature && comboConfig && (
            <CombinationFeature
              baseCoins={comboBaseCoins}
              config={comboConfig}
              onSpin={(snap) => {
                // Use splitStrike generator if both are in combo, else standard combo generator
                const line = (comboConfig.hasSplit && comboConfig.hasStrike)
                  ? generateSplitStrikeGaffe(snap as any)
                  : generateCombinationGaffe(snap, comboConfig);
                setComboGaffeHistory((p) => [...p, line]);
              }}
              onReset={() => setComboGaffeHistory([])}
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