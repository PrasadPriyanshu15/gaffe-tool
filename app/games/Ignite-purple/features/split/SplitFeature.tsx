


//  /* eslint-disable @typescript-eslint/no-explicit-any */
// "use client";

// import { useState, useEffect, useRef } from "react";
// import {
//   SplitFeatureCoin,
//   SPLIT_COIN_COLORS,
//   SPLIT_COIN_VALUES,
//   SPLIT_COUNT_OPTIONS,
//   SPLIT_BOOST_VALUES,
//   SPLIT_ALL_UPGRADE_FEATURES,
//   resolveUpgradeForSplit,
//   UpgradeInfoSplit,
//   ZONE_SPLITTER_OPTIONS_SPLIT,
// } from "./splitFeatureGenerator";

// type Props = {
//   baseCoins:      SplitFeatureCoin[];
//   isStrikeCombo:  boolean;
//   activeFeatures: string[];         // currently active features, e.g. ["split"] or ["split","strike"]
//   onCoinsChange:  (coins: SplitFeatureCoin[]) => void;
//   onSpin:         (snapshot: SplitFeatureCoin[]) => void;
//   onReset:        () => void;
//   onUpgrade?:     (newFeatures: string[], carryCoins: SplitFeatureCoin[], upgradeInfo: UpgradeInfoSplit) => void;
// };

// const MAX_SPINS = 3;

// const COIN_SELECT_BG: Record<number, string> = {
//   4:  "bg-orange-700",
//   9:  "bg-sky-700",
//   14: "bg-emerald-700",
//   19: "bg-purple-700",
// };

// function SplitGhostCell({ copyIdx, coin, isStrikeCombo, onValueChange, onBoostChange, onWingedSelect }: {
//   copyIdx:        number;   // 1-based (copy 1, 2, 3)
//   coin:           SplitFeatureCoin;
//   isStrikeCombo:  boolean;
//   onValueChange:  (ci: number, val: string) => void;
//   onBoostChange:  (ci: number, val: string) => void;
//   onWingedSelect: (ci: number) => void;   // called with copyIdx to make this copy winged
// }) {
//   const copyVal  = coin.splitCopyValues?.[copyIdx] ?? coin.value;
//   const isWinged = coin.wingedCopyIdx === copyIdx;
//   return (
//     <div className={`rounded border border-dashed flex flex-col items-center justify-center p-1 min-h-[70px] text-[10px] gap-0.5
//       ${isWinged ? "border-yellow-400/80 bg-yellow-950/30 text-yellow-100" : "border-pink-400/60 bg-pink-950/40 text-pink-200"}`}>
//       <div className="opacity-40 text-[9px]">copy {copyIdx}</div>
//       <div className="text-sm">{isWinged ? "🪽🟡🪽" : "🟡"}</div>
//       <select
//         className={`text-white text-[9px] w-full rounded mt-0.5 ${COIN_SELECT_BG[coin.colorCode] ?? "bg-gray-600"} border-0`}
//         value={copyVal}
//         onClick={(e) => e.stopPropagation()}
//         onChange={(e) => onValueChange(copyIdx, e.target.value)}
//       >
//         {SPLIT_COIN_VALUES.map((v) => (
//           <option key={v} value={v} className="bg-gray-800">{v}</option>
//         ))}
//       </select>
//       {isStrikeCombo && (
//         <div className="flex items-center gap-1 w-full mt-0.5" onClick={(e) => e.stopPropagation()}>
//           <input
//             type="radio"
//             name={`winged-${coin.position}`}
//             className="accent-yellow-400 w-2.5 h-2.5 cursor-pointer"
//             checked={isWinged}
//             onChange={() => onWingedSelect(copyIdx)}
//           />
//           <span className="text-[8px] text-yellow-300">winged</span>
//         </div>
//       )}
//       {isStrikeCombo && isWinged && (
//         <select
//           className="text-white text-[9px] w-full rounded mt-0.5 bg-yellow-700 border-0"
//           value={coin.splitBoostValues?.[copyIdx] ?? ""}
//           onClick={(e) => e.stopPropagation()}
//           onChange={(e) => onBoostChange(copyIdx, e.target.value)}
//         >
//           <option value="" className="bg-gray-800">Boost</option>
//           {SPLIT_BOOST_VALUES.map((v) => (
//             <option key={v} value={v} className="bg-gray-800">{v}</option>
//           ))}
//         </select>
//       )}
//     </div>
//   );
// }

// export default function SplitFeature({
//   baseCoins, isStrikeCombo, activeFeatures, onCoinsChange, onSpin, onReset, onUpgrade,
// }: Props) {
//   const [isOpen,    setIsOpen]    = useState(true);
//   const initialSeeds = baseCoins.map((c) => ({ ...c, fromBase: true }));
//   const [coins,     setCoins]     = useState<SplitFeatureCoin[]>(initialSeeds);
//   const [spinsLeft, setSpinsLeft] = useState(MAX_SPINS);
//   const lastSpinPositions = useRef<Set<number>>(new Set(initialSeeds.map((c) => c.position)));

//   // Upgrade state
//   const [upgradePos,          setUpgradePos]          = useState<number | null>(null);
//   const [upgradeMultiSel,     setUpgradeMultiSel]     = useState<Set<string>>(new Set());
//   const [upgradeZoneSplitter, setUpgradeZoneSplitter] = useState<string>("");
//   const [upgradeZoneMultiRaw, setUpgradeZoneMultiRaw] = useState<string>("");

//   useEffect(() => { onCoinsChange(coins); }, [coins]);

//   const coinAt = (pos: number) => coins.find((c) => c.position === pos);

//   const handleCellClick = (pos: number) => {
//     if (coinAt(pos)) return;
//     setCoins((prev) => [...prev, {
//       position: pos, colorCode: SPLIT_COIN_COLORS[0].value,
//       value: SPLIT_COIN_VALUES[0], splitCount: 1,
//     }]);
//   };

//   const removeCoin = (pos: number) => {
//     const c = coinAt(pos);
//     if (!c || c.fromBase) return;
//     if (upgradePos === pos) resetUpgrade();
//     setCoins((prev) => prev.filter((x) => x.position !== pos));
//   };

//   const updateCoin = (pos: number, field: keyof SplitFeatureCoin, val: any) =>
//     setCoins((prev) => prev.map((c) => (c.position === pos ? { ...c, [field]: val } : c)));

//   const updateSplitBoost = (pos: number, copyIdx: number, val: string) =>
//     setCoins((prev) => prev.map((c) => {
//       if (c.position !== pos) return c;
//       const arr = [...(c.splitBoostValues ?? [])];
//       arr[copyIdx] = val;
//       return { ...c, splitBoostValues: arr };
//     }));

//   const updateSplitCopyValue = (pos: number, copyIdx: number, val: string) =>
//     setCoins((prev) => prev.map((c) => {
//       if (c.position !== pos) return c;
//       const arr = [...(c.splitCopyValues ?? [])];
//       arr[copyIdx] = val;
//       // Keep coin.value in sync with copy 0 for backward compat
//       return { ...c, splitCopyValues: arr, value: copyIdx === 0 ? val : c.value };
//     }));

//   // Select which copy index is the winged one (radio — only one per coin).
//   // Clicking the same copy again deselects (no winged copy).
//   const selectWingedCopy = (pos: number, copyIdx: number) =>
//     setCoins((prev) => prev.map((c) => {
//       if (c.position !== pos) return c;
//       const already = c.wingedCopyIdx === copyIdx;
//       return { ...c, wingedCopyIdx: already ? undefined : copyIdx };
//     }));

//   // ── Upgrade ───────────────────────────────────────────────────────────────
//   const resetUpgrade = () => {
//     setUpgradePos(null); setUpgradeMultiSel(new Set());
//     setUpgradeZoneSplitter(""); setUpgradeZoneMultiRaw("");
//   };

//   const handleUpgradeRadio = (pos: number) => {
//     if (upgradePos === pos) { resetUpgrade(); return; }
//     setUpgradePos(pos); setUpgradeMultiSel(new Set());
//     setUpgradeZoneSplitter(""); setUpgradeZoneMultiRaw("");
//   };

//   const toggleMulti = (f: string) =>
//     setUpgradeMultiSel((prev) => {
//       const next = new Set(prev);
//       if (next.has(f)) next.delete(f); else next.add(f);
//       return next;
//     });

//   const upgradeCoin  = upgradePos !== null ? coinAt(upgradePos) : null;
//   const upgradeType  = upgradeCoin ? resolveUpgradeForSplit(upgradeCoin.colorCode) : null;
//   const isAllColor   = upgradeType === "ALL";

//   const activeFeatUp = activeFeatures.map((f) => f.toUpperCase());
//   const upgradeOptions: string[] = (() => {
//     if (!upgradeCoin || !upgradeType) return [];
//     if (isAllColor) return SPLIT_ALL_UPGRADE_FEATURES.filter((f) => !activeFeatUp.includes(f));
//     return [upgradeType].filter((f) => !activeFeatUp.includes(f));
//   })();

//   const navigateUpgrade = (feats: string[]) => {
//     if (!onUpgrade || upgradePos === null || feats.length === 0) return;
//     const hasZone = feats.includes("ZONE");
//     const upgradeInfo: UpgradeInfoSplit = {
//       pos: upgradePos,
//       features: feats,
//       ...(hasZone && upgradeZoneSplitter ? { zoneSplitter: Number(upgradeZoneSplitter) } : {}),
//       ...(hasZone && upgradeZoneMultiRaw ? {
//         zoneMultipliers: upgradeZoneMultiRaw.split(",").map((n) => n.trim()).filter(Boolean).map(Number),
//       } : {}),
//     };
//     const newFeatures = [...new Set([...activeFeatures, ...feats.map((f) => f.toLowerCase())])];
//     onUpgrade(newFeatures, coins, upgradeInfo);
//   };

//   // ── Spin ──────────────────────────────────────────────────────────────────
//   const handleSpin = () => {
//     if (spinsLeft <= 0) return;
//     const cur = new Set(coins.map((c) => c.position));
//     const hasNew = [...cur].some((p) => !lastSpinPositions.current.has(p));
//     setSpinsLeft(hasNew ? MAX_SPINS : spinsLeft - 1);
//     lastSpinPositions.current = cur;
//     onSpin(coins);
//   };

//   const resetFeature = () => {
//     const seeded = baseCoins.map((c) => ({ ...c, fromBase: true }));
//     setCoins(seeded);
//     setSpinsLeft(MAX_SPINS);
//     lastSpinPositions.current = new Set(seeded.map((c) => c.position));
//     resetUpgrade();
//     onReset();
//   };

//   return (
//     <div className="bg-gray-800 rounded-xl">

//       {/* HEADER */}
//       <div onClick={() => setIsOpen(!isOpen)} className="flex justify-between items-center p-4 cursor-pointer select-none">
//         <h2 className="text-lg font-semibold text-pink-400">
//           🩷 Split Feature{isStrikeCombo ? " + Strike" : ""}
//         </h2>
//         <span>{isOpen ? "▼" : "▶"}</span>
//       </div>

//       {isOpen && (
//         <div className="p-6 pt-0 flex flex-col gap-4">

//           {/* SPIN CONTROLS */}
//           <div className="flex items-center gap-4 flex-wrap">
//             <button
//               onClick={handleSpin} disabled={spinsLeft <= 0}
//               className={`px-6 py-2 rounded font-bold text-white transition-all ${
//                 spinsLeft > 0 ? "bg-pink-600 hover:bg-pink-500" : "bg-gray-600 cursor-not-allowed opacity-50"
//               }`}
//             >
//               SPIN
//             </button>
//             <span className="text-sm text-gray-300">{spinsLeft} / {MAX_SPINS} spins left</span>
//             <button onClick={resetFeature} className="px-3 py-1 bg-gray-600 hover:bg-gray-500 rounded text-sm">Reset</button>
//           </div>

//           {/* UPGRADE PANEL */}
//           {upgradePos !== null && upgradeOptions.length > 0 && (
//             <div className="flex flex-col gap-2 bg-yellow-900/20 border border-yellow-800 rounded-lg p-3">
//               <span className="text-yellow-300 text-xs font-bold">
//                 ✦ Upgrade coin at position {upgradePos} — select feature to add (navigates immediately):
//               </span>

//               {isAllColor ? (
//                 <div className="flex flex-col gap-2">
//                   <div className="flex gap-2 flex-wrap">
//                     {upgradeOptions.map((f) => (
//                       <label key={f} className="flex items-center gap-1 cursor-pointer bg-yellow-900/40 border border-yellow-700 rounded px-2 py-1">
//                         <input type="checkbox" className="accent-yellow-400 w-3 h-3"
//                           checked={upgradeMultiSel.has(f)} onChange={() => toggleMulti(f)} />
//                         <span className="text-yellow-100 text-xs capitalize">{f.toLowerCase()}</span>
//                       </label>
//                     ))}
//                   </div>
//                   {upgradeMultiSel.has("ZONE") && (
//                     <div className="flex gap-3 flex-wrap items-center bg-sky-900/30 border border-sky-800 rounded p-2">
//                       <span className="text-sky-300 text-[10px]">Zone params:</span>
//                       <div className="flex items-center gap-1">
//                         <span className="text-[10px] text-sky-300">Splitter</span>
//                         <select className="bg-sky-950 text-sky-200 text-xs rounded px-1 py-0.5 border border-sky-700"
//                           value={upgradeZoneSplitter} onChange={(e) => setUpgradeZoneSplitter(e.target.value)}>
//                           <option value="">--</option>
//                           {ZONE_SPLITTER_OPTIONS_SPLIT.map((v) => <option key={v} value={v}>{v}</option>)}
//                         </select>
//                       </div>
//                       <div className="flex items-center gap-1">
//                         <span className="text-[10px] text-sky-300">Multipliers</span>
//                         <input type="text" placeholder="e.g. 2,3" value={upgradeZoneMultiRaw}
//                           onChange={(e) => setUpgradeZoneMultiRaw(e.target.value)}
//                           className="bg-sky-950 text-sky-200 text-xs rounded px-1 py-0.5 border border-sky-700 w-20" />
//                       </div>
//                     </div>
//                   )}
//                   {upgradeMultiSel.size > 0 && (
//                     <button onClick={() => navigateUpgrade(Array.from(upgradeMultiSel))}
//                       className="self-start px-3 py-1 bg-yellow-600 hover:bg-yellow-500 rounded text-xs font-bold transition-all">
//                       → Go to {[...activeFeatures, ...Array.from(upgradeMultiSel).map((f) => f.toLowerCase())]
//                         .filter((v, i, a) => a.indexOf(v) === i).join(" + ")}
//                     </button>
//                   )}
//                 </div>
//               ) : (
//                 <div className="flex flex-col gap-2">
//                   <div className="flex gap-2 flex-wrap">
//                     {upgradeOptions.filter((f) => f !== "ZONE").map((f) => (
//                       <button key={f} onClick={() => navigateUpgrade([f])}
//                         className="px-3 py-1.5 bg-yellow-700 hover:bg-yellow-600 border border-yellow-600 rounded text-xs font-bold transition-all capitalize">
//                         → {f.toLowerCase()}
//                       </button>
//                     ))}
//                   </div>
//                   {upgradeOptions.includes("ZONE") && (
//                     <div className="flex flex-col gap-1.5">
//                       <div className="flex gap-3 flex-wrap items-center bg-sky-900/30 border border-sky-800 rounded p-2">
//                         <span className="text-sky-300 text-[10px]">Zone params:</span>
//                         <div className="flex items-center gap-1">
//                           <span className="text-[10px] text-sky-300">Splitter</span>
//                           <select className="bg-sky-950 text-sky-200 text-xs rounded px-1 py-0.5 border border-sky-700"
//                             value={upgradeZoneSplitter} onChange={(e) => setUpgradeZoneSplitter(e.target.value)}>
//                             <option value="">--</option>
//                             {ZONE_SPLITTER_OPTIONS_SPLIT.map((v) => <option key={v} value={v}>{v}</option>)}
//                           </select>
//                         </div>
//                         <div className="flex items-center gap-1">
//                           <span className="text-[10px] text-sky-300">Multipliers</span>
//                           <input type="text" placeholder="e.g. 2,3" value={upgradeZoneMultiRaw}
//                             onChange={(e) => setUpgradeZoneMultiRaw(e.target.value)}
//                             className="bg-sky-950 text-sky-200 text-xs rounded px-1 py-0.5 border border-sky-700 w-20" />
//                         </div>
//                       </div>
//                       <button onClick={() => navigateUpgrade(["ZONE"])}
//                         className="self-start px-3 py-1 bg-sky-700 hover:bg-sky-600 border border-sky-500 rounded text-xs font-bold transition-all">
//                         → Go to {[...activeFeatures, "zone"].join(" + ")}
//                       </button>
//                     </div>
//                   )}
//                 </div>
//               )}
//             </div>
//           )}

//           {upgradePos !== null && upgradeOptions.length === 0 && (
//             <div className="text-xs text-gray-500 bg-gray-700 px-3 py-1.5 rounded">
//               ℹ No upgrades available for this coin (all upgradeable features already active)
//             </div>
//           )}

//           {/* GRID — 5 cols × 3 rows, column-major */}
//           <div className="grid gap-1" style={{ gridTemplateColumns: "repeat(5, minmax(0, 1fr))" }}>
//             {Array.from({ length: 3 }).map((_, row) =>
//               Array.from({ length: 5 }).map((_, col) => {
//                 const pos  = col * 3 + row;
//                 const coin = coinAt(pos);

//                 return (
//                   <div key={pos} className="flex flex-col gap-1">
//                     <div
//                       onClick={() => !coin && handleCellClick(pos)}
//                       className={`relative rounded-lg border-2 flex flex-col items-center justify-center p-1 min-h-[100px] text-xs text-white cursor-pointer transition-all
//                         ${!coin
//                           ? "bg-gray-700 border-gray-600 hover:bg-gray-600 hover:border-gray-400"
//                           : "bg-pink-950/30 border-pink-500"
//                         }
//                         ${upgradePos === pos ? "ring-2 ring-yellow-400" : ""}
//                       `}
//                     >
//                       <div className="text-[9px] opacity-50 absolute top-1 left-1">{pos}</div>

//                       {coin ? (
//                         <div className="flex flex-col items-center w-full gap-1 mt-2 px-0.5">

//                           {/* Winged toggle */}
//                           {isStrikeCombo ? (
//                             <div className="flex flex-col items-center w-full gap-0.5">
//                               <div className="text-sm leading-none">
//                                 {coin.wingedCopyIdx === 0 ? "🪽🟡🪽" : "🟡"}
//                               </div>
//                               <div className="flex items-center gap-1 w-full" onClick={(e) => e.stopPropagation()}>
//                                 <input
//                                   type="radio"
//                                   name={`winged-${pos}`}
//                                   className="accent-yellow-400 w-2.5 h-2.5 cursor-pointer"
//                                   checked={coin.wingedCopyIdx === 0}
//                                   onChange={() => selectWingedCopy(pos, 0)}
//                                 />
//                                 <span className="text-[8px] text-yellow-300">winged</span>
//                               </div>
//                             </div>
//                           ) : (
//                             <div className="text-base leading-none">🟡</div>
//                           )}

//                           {/* Color */}
//                           <select
//                             className={`text-white text-[10px] w-full rounded px-0.5 py-0.5 ${COIN_SELECT_BG[coin.colorCode] ?? "bg-gray-600"} border-0`}
//                             value={coin.colorCode}
//                             onClick={(e) => e.stopPropagation()}
//                             onChange={(e) => {
//                               updateCoin(pos, "colorCode", Number(e.target.value));
//                               if (upgradePos === pos) resetUpgrade();
//                             }}
//                           >
//                             {SPLIT_COIN_COLORS.map((c) => (
//                               <option key={c.value} value={c.value} className="bg-gray-800">{c.label}</option>
//                             ))}
//                           </select>

//                           {/* Value (copy 0) */}
//                           <select
//                             className={`text-white text-[10px] w-full rounded px-0.5 py-0.5 ${COIN_SELECT_BG[coin.colorCode] ?? "bg-gray-600"} border-0`}
//                             value={coin.splitCopyValues?.[0] ?? coin.value}
//                             onClick={(e) => e.stopPropagation()}
//                             onChange={(e) => updateSplitCopyValue(pos, 0, e.target.value)}
//                           >
//                             {SPLIT_COIN_VALUES.map((v) => (
//                               <option key={v} value={v} className="bg-gray-800">{v}</option>
//                             ))}
//                           </select>

//                           {/* Boost — only shown when copy 0 is the winged copy */}
//                           {isStrikeCombo && coin.wingedCopyIdx === 0 && (
//                             <select
//                               className="text-white text-[10px] w-full rounded px-0.5 py-0.5 bg-yellow-700 border-0"
//                               value={coin.splitBoostValues?.[0] ?? ""}
//                               onClick={(e) => e.stopPropagation()}
//                               onChange={(e) => updateSplitBoost(pos, 0, e.target.value)}
//                             >
//                               <option value="" className="bg-gray-800">Boost (copy 0)</option>
//                               {SPLIT_BOOST_VALUES.map((v) => (
//                                 <option key={v} value={v} className="bg-gray-800">{v}</option>
//                               ))}
//                             </select>
//                           )}

//                           {/* Split count */}
//                           <select
//                             className="text-white text-[10px] w-full rounded px-0.5 py-0.5 bg-pink-700 border-0"
//                             value={coin.splitCount}
//                             onClick={(e) => e.stopPropagation()}
//                             onChange={(e) => {
//                               const sc = Number(e.target.value);
//                               updateCoin(pos, "splitCount", sc);
//                               if (sc <= 1) updateCoin(pos, "splitBoostValues" as any, []);
//                             }}
//                           >
//                             {SPLIT_COUNT_OPTIONS.map((n) => (
//                               <option key={n} value={n} className="bg-gray-800">Split × {n}</option>
//                             ))}
//                           </select>

//                           {/* ── UPGRADE RADIO — shown when onUpgrade is provided ── */}
//                           {onUpgrade && (
//                             <div className="flex items-center gap-1 mt-0.5 w-full" onClick={(e) => e.stopPropagation()}>
//                               <input
//                                 type="radio"
//                                 name="splitUpgrade"
//                                 className="accent-yellow-400 w-3 h-3 cursor-pointer"
//                                 checked={upgradePos === pos}
//                                 onChange={() => handleUpgradeRadio(pos)}
//                               />
//                               <span className="text-[8px] text-yellow-300">upgrade</span>
//                               {upgradePos === pos && upgradeMultiSel.size > 0 && (
//                                 <span className="text-[8px] text-yellow-500">
//                                   →{Array.from(upgradeMultiSel).map((f) => f.toLowerCase()).join("+")}
//                                 </span>
//                               )}
//                             </div>
//                           )}

//                           {/* Remove */}
//                           {!coin.fromBase && (
//                             <button
//                               onClick={(e) => { e.stopPropagation(); removeCoin(pos); }}
//                               className="absolute top-1 right-1 text-[10px] text-red-300 hover:text-red-100 font-bold"
//                             >✕</button>
//                           )}
//                         </div>
//                       ) : (
//                         <span className="text-gray-500 text-[10px]">+ Add</span>
//                       )}
//                     </div>

//                     {/* Ghost cells */}
//                     {coin && coin.splitCount > 1 &&
//                       Array.from({ length: coin.splitCount - 1 }).map((_, idx) => (
//                         <SplitGhostCell
//                           key={idx}
//                           copyIdx={idx + 1}
//                           coin={coin}
//                           isStrikeCombo={isStrikeCombo}
//                           onValueChange={(ci, val) => updateSplitCopyValue(pos, ci, val)}
//                           onBoostChange={(ci, val) => updateSplitBoost(pos, ci, val)}
//                           onWingedSelect={(ci) => selectWingedCopy(pos, ci)}
//                         />
//                       ))
//                     }
//                   </div>
//                 );
//               })
//             )}
//           </div>

//           {/* LEGEND */}
//           <div className="text-xs text-gray-400 flex flex-wrap gap-3">
//             <span>🟡 = coin | Split × N = N copies (copy 0…N-1), each has its own value</span>
//             {isStrikeCombo && <span>🪽🟡🪽 = winged — click to toggle</span>}
//             {onUpgrade && <span>✦ radio = select coin to upgrade · Orange→Strike · Blue→Zone · Green→Extra · All-Color→pick any</span>}
//             <span>Click empty cell to add</span>
//           </div>

//         </div>
//       )}
//     </div>
//   );
// }



//! multiple winged coin in split

/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { useState, useEffect, useRef } from "react";
import {
  SplitFeatureCoin,
  SPLIT_COIN_COLORS,
  SPLIT_COIN_VALUES,
  SPLIT_COUNT_OPTIONS,
  SPLIT_BOOST_VALUES,
  SPLIT_ALL_UPGRADE_FEATURES,
  resolveUpgradeForSplit,
  UpgradeInfoSplit,
  ZONE_SPLITTER_OPTIONS_SPLIT,
} from "./splitFeatureGenerator";

type Props = {
  baseCoins:      SplitFeatureCoin[];
  isStrikeCombo:  boolean;
  activeFeatures: string[];         // currently active features, e.g. ["split"] or ["split","strike"]
  onCoinsChange:  (coins: SplitFeatureCoin[]) => void;
  onSpin:         (snapshot: SplitFeatureCoin[]) => void;
  onReset:        () => void;
  onUpgrade?:     (newFeatures: string[], carryCoins: SplitFeatureCoin[], upgradeInfo: UpgradeInfoSplit) => void;
};

const MAX_SPINS = 3;

const COIN_SELECT_BG: Record<number, string> = {
  4:  "bg-orange-700",
  9:  "bg-sky-700",
  14: "bg-emerald-700",
  19: "bg-purple-700",
};

// ── Ghost cell for each extra split copy (copyIdx >= 1) ──────────────────────
function SplitGhostCell({ copyIdx, coin, isStrikeCombo, onValueChange, onBoostChange, onWingedToggle }: {
  copyIdx:         number;   // 1-based (copy 1, 2, 3)
  coin:            SplitFeatureCoin;
  isStrikeCombo:   boolean;
  onValueChange:   (ci: number, val: string) => void;
  onBoostChange:   (ci: number, val: string) => void;
  onWingedToggle:  (ci: number) => void;   // toggle this copy's winged state
}) {
  const copyVal  = coin.splitCopyValues?.[copyIdx] ?? coin.value;
  const isWinged = coin.wingedCopyIdxs?.includes(copyIdx) ?? false;
  return (
    <div className={`rounded border border-dashed flex flex-col items-center justify-center p-1 min-h-[70px] text-[10px] gap-0.5
      ${isWinged ? "border-yellow-400/80 bg-yellow-950/30 text-yellow-100" : "border-pink-400/60 bg-pink-950/40 text-pink-200"}`}>
      <div className="opacity-40 text-[9px]">copy {copyIdx}</div>
      <div className="text-sm">{isWinged ? "🪽🟡🪽" : "🟡"}</div>
      <select
        className={`text-white text-[9px] w-full rounded mt-0.5 ${COIN_SELECT_BG[coin.colorCode] ?? "bg-gray-600"} border-0`}
        value={copyVal}
        onClick={(e) => e.stopPropagation()}
        onChange={(e) => onValueChange(copyIdx, e.target.value)}
      >
        {SPLIT_COIN_VALUES.map((v) => (
          <option key={v} value={v} className="bg-gray-800">{v}</option>
        ))}
      </select>
      {isStrikeCombo && (
        <div className="flex items-center gap-1 w-full mt-0.5" onClick={(e) => e.stopPropagation()}>
          <input
            type="checkbox"
            className="accent-yellow-400 w-2.5 h-2.5 cursor-pointer"
            checked={isWinged}
            onChange={() => onWingedToggle(copyIdx)}
          />
          <span className="text-[8px] text-yellow-300">winged</span>
        </div>
      )}
      {isStrikeCombo && isWinged && (
        <select
          className="text-white text-[9px] w-full rounded mt-0.5 bg-yellow-700 border-0"
          value={coin.splitBoostValues?.[copyIdx] ?? ""}
          onClick={(e) => e.stopPropagation()}
          onChange={(e) => onBoostChange(copyIdx, e.target.value)}
        >
          <option value="" className="bg-gray-800">Boost</option>
          {SPLIT_BOOST_VALUES.map((v) => (
            <option key={v} value={v} className="bg-gray-800">{v}</option>
          ))}
        </select>
      )}
    </div>
  );
}

export default function SplitFeature({
  baseCoins, isStrikeCombo, activeFeatures, onCoinsChange, onSpin, onReset, onUpgrade,
}: Props) {
  const [isOpen,    setIsOpen]    = useState(true);
  const initialSeeds = baseCoins.map((c) => ({ ...c, fromBase: true }));
  const [coins,     setCoins]     = useState<SplitFeatureCoin[]>(initialSeeds);
  const [spinsLeft, setSpinsLeft] = useState(MAX_SPINS);
  const lastSpinPositions = useRef<Set<number>>(new Set(initialSeeds.map((c) => c.position)));

  // Upgrade state
  const [upgradePos,          setUpgradePos]          = useState<number | null>(null);
  const [upgradeMultiSel,     setUpgradeMultiSel]     = useState<Set<string>>(new Set());
  const [upgradeZoneSplitter, setUpgradeZoneSplitter] = useState<string>("");
  const [upgradeZoneMultiRaw, setUpgradeZoneMultiRaw] = useState<string>("");

  useEffect(() => { onCoinsChange(coins); }, [coins]);

  const coinAt = (pos: number) => coins.find((c) => c.position === pos);

  const handleCellClick = (pos: number) => {
    if (coinAt(pos)) return;
    setCoins((prev) => [...prev, {
      position: pos, colorCode: SPLIT_COIN_COLORS[0].value,
      value: SPLIT_COIN_VALUES[0], splitCount: 1,
    }]);
  };

  const removeCoin = (pos: number) => {
    const c = coinAt(pos);
    if (!c || c.fromBase) return;
    if (upgradePos === pos) resetUpgrade();
    setCoins((prev) => prev.filter((x) => x.position !== pos));
  };

  const updateCoin = (pos: number, field: keyof SplitFeatureCoin, val: any) =>
    setCoins((prev) => prev.map((c) => (c.position === pos ? { ...c, [field]: val } : c)));

  const updateSplitBoost = (pos: number, copyIdx: number, val: string) =>
    setCoins((prev) => prev.map((c) => {
      if (c.position !== pos) return c;
      const arr = [...(c.splitBoostValues ?? [])];
      arr[copyIdx] = val;
      return { ...c, splitBoostValues: arr };
    }));

  const updateSplitCopyValue = (pos: number, copyIdx: number, val: string) =>
    setCoins((prev) => prev.map((c) => {
      if (c.position !== pos) return c;
      const arr = [...(c.splitCopyValues ?? [])];
      arr[copyIdx] = val;
      // Keep coin.value in sync with copy 0 for backward compat
      return { ...c, splitCopyValues: arr, value: copyIdx === 0 ? val : c.value };
    }));

  // Toggle a copy's winged state — adds or removes from wingedCopyIdxs array.
  // Multiple copies can be winged simultaneously.
  const toggleWingedCopy = (pos: number, copyIdx: number) =>
    setCoins((prev) => prev.map((c) => {
      if (c.position !== pos) return c;
      const current = c.wingedCopyIdxs ?? [];
      const alreadyWinged = current.includes(copyIdx);
      return {
        ...c,
        wingedCopyIdxs: alreadyWinged
          ? current.filter((i) => i !== copyIdx)
          : [...current, copyIdx],
      };
    }));

  // ── Upgrade ───────────────────────────────────────────────────────────────
  const resetUpgrade = () => {
    setUpgradePos(null); setUpgradeMultiSel(new Set());
    setUpgradeZoneSplitter(""); setUpgradeZoneMultiRaw("");
  };

  const handleUpgradeRadio = (pos: number) => {
    if (upgradePos === pos) { resetUpgrade(); return; }
    setUpgradePos(pos); setUpgradeMultiSel(new Set());
    setUpgradeZoneSplitter(""); setUpgradeZoneMultiRaw("");
  };

  const toggleMulti = (f: string) =>
    setUpgradeMultiSel((prev) => {
      const next = new Set(prev);
      if (next.has(f)) next.delete(f); else next.add(f);
      return next;
    });

  const upgradeCoin  = upgradePos !== null ? coinAt(upgradePos) : null;
  const upgradeType  = upgradeCoin ? resolveUpgradeForSplit(upgradeCoin.colorCode) : null;
  const isAllColor   = upgradeType === "ALL";

  const activeFeatUp = activeFeatures.map((f) => f.toUpperCase());
  const upgradeOptions: string[] = (() => {
    if (!upgradeCoin || !upgradeType) return [];
    if (isAllColor) return SPLIT_ALL_UPGRADE_FEATURES.filter((f) => !activeFeatUp.includes(f));
    return [upgradeType].filter((f) => !activeFeatUp.includes(f));
  })();

  const navigateUpgrade = (feats: string[]) => {
    if (!onUpgrade || upgradePos === null || feats.length === 0) return;
    const hasZone = feats.includes("ZONE");
    const upgradeInfo: UpgradeInfoSplit = {
      pos: upgradePos,
      features: feats,
      ...(hasZone && upgradeZoneSplitter ? { zoneSplitter: Number(upgradeZoneSplitter) } : {}),
      ...(hasZone && upgradeZoneMultiRaw ? {
        zoneMultipliers: upgradeZoneMultiRaw.split(",").map((n) => n.trim()).filter(Boolean).map(Number),
      } : {}),
    };
    const newFeatures = [...new Set([...activeFeatures, ...feats.map((f) => f.toLowerCase())])];
    onUpgrade(newFeatures, coins, upgradeInfo);
  };

  // ── Spin ──────────────────────────────────────────────────────────────────
  const handleSpin = () => {
    if (spinsLeft <= 0) return;
    const cur = new Set(coins.map((c) => c.position));
    const hasNew = [...cur].some((p) => !lastSpinPositions.current.has(p));
    setSpinsLeft(hasNew ? MAX_SPINS : spinsLeft - 1);
    lastSpinPositions.current = cur;
    onSpin(coins);
  };

  const resetFeature = () => {
    const seeded = baseCoins.map((c) => ({ ...c, fromBase: true }));
    setCoins(seeded);
    setSpinsLeft(MAX_SPINS);
    lastSpinPositions.current = new Set(seeded.map((c) => c.position));
    resetUpgrade();
    onReset();
  };

  return (
    <div className="bg-gray-800 rounded-xl">

      {/* HEADER */}
      <div onClick={() => setIsOpen(!isOpen)} className="flex justify-between items-center p-4 cursor-pointer select-none">
        <h2 className="text-lg font-semibold text-pink-400">
          🩷 Split Feature{isStrikeCombo ? " + Strike" : ""}
        </h2>
        <span>{isOpen ? "▼" : "▶"}</span>
      </div>

      {isOpen && (
        <div className="p-6 pt-0 flex flex-col gap-4">

          {/* SPIN CONTROLS */}
          <div className="flex items-center gap-4 flex-wrap">
            <button
              onClick={handleSpin} disabled={spinsLeft <= 0}
              className={`px-6 py-2 rounded font-bold text-white transition-all ${
                spinsLeft > 0 ? "bg-pink-600 hover:bg-pink-500" : "bg-gray-600 cursor-not-allowed opacity-50"
              }`}
            >
              SPIN
            </button>
            <span className="text-sm text-gray-300">{spinsLeft} / {MAX_SPINS} spins left</span>
            <button onClick={resetFeature} className="px-3 py-1 bg-gray-600 hover:bg-gray-500 rounded text-sm">Reset</button>
          </div>

          {/* UPGRADE PANEL */}
          {upgradePos !== null && upgradeOptions.length > 0 && (
            <div className="flex flex-col gap-2 bg-yellow-900/20 border border-yellow-800 rounded-lg p-3">
              <span className="text-yellow-300 text-xs font-bold">
                ✦ Upgrade coin at position {upgradePos} — select feature to add (navigates immediately):
              </span>

              {isAllColor ? (
                <div className="flex flex-col gap-2">
                  <div className="flex gap-2 flex-wrap">
                    {upgradeOptions.map((f) => (
                      <label key={f} className="flex items-center gap-1 cursor-pointer bg-yellow-900/40 border border-yellow-700 rounded px-2 py-1">
                        <input type="checkbox" className="accent-yellow-400 w-3 h-3"
                          checked={upgradeMultiSel.has(f)} onChange={() => toggleMulti(f)} />
                        <span className="text-yellow-100 text-xs capitalize">{f.toLowerCase()}</span>
                      </label>
                    ))}
                  </div>
                  {upgradeMultiSel.has("ZONE") && (
                    <div className="flex gap-3 flex-wrap items-center bg-sky-900/30 border border-sky-800 rounded p-2">
                      <span className="text-sky-300 text-[10px]">Zone params:</span>
                      <div className="flex items-center gap-1">
                        <span className="text-[10px] text-sky-300">Splitter</span>
                        <select className="bg-sky-950 text-sky-200 text-xs rounded px-1 py-0.5 border border-sky-700"
                          value={upgradeZoneSplitter} onChange={(e) => setUpgradeZoneSplitter(e.target.value)}>
                          <option value="">--</option>
                          {ZONE_SPLITTER_OPTIONS_SPLIT.map((v) => <option key={v} value={v}>{v}</option>)}
                        </select>
                      </div>
                      <div className="flex items-center gap-1">
                        <span className="text-[10px] text-sky-300">Multipliers</span>
                        <input type="text" placeholder="e.g. 2,3" value={upgradeZoneMultiRaw}
                          onChange={(e) => setUpgradeZoneMultiRaw(e.target.value)}
                          className="bg-sky-950 text-sky-200 text-xs rounded px-1 py-0.5 border border-sky-700 w-20" />
                      </div>
                    </div>
                  )}
                  {upgradeMultiSel.size > 0 && (
                    <button onClick={() => navigateUpgrade(Array.from(upgradeMultiSel))}
                      className="self-start px-3 py-1 bg-yellow-600 hover:bg-yellow-500 rounded text-xs font-bold transition-all">
                      → Go to {[...activeFeatures, ...Array.from(upgradeMultiSel).map((f) => f.toLowerCase())]
                        .filter((v, i, a) => a.indexOf(v) === i).join(" + ")}
                    </button>
                  )}
                </div>
              ) : (
                <div className="flex flex-col gap-2">
                  <div className="flex gap-2 flex-wrap">
                    {upgradeOptions.filter((f) => f !== "ZONE").map((f) => (
                      <button key={f} onClick={() => navigateUpgrade([f])}
                        className="px-3 py-1.5 bg-yellow-700 hover:bg-yellow-600 border border-yellow-600 rounded text-xs font-bold transition-all capitalize">
                        → {f.toLowerCase()}
                      </button>
                    ))}
                  </div>
                  {upgradeOptions.includes("ZONE") && (
                    <div className="flex flex-col gap-1.5">
                      <div className="flex gap-3 flex-wrap items-center bg-sky-900/30 border border-sky-800 rounded p-2">
                        <span className="text-sky-300 text-[10px]">Zone params:</span>
                        <div className="flex items-center gap-1">
                          <span className="text-[10px] text-sky-300">Splitter</span>
                          <select className="bg-sky-950 text-sky-200 text-xs rounded px-1 py-0.5 border border-sky-700"
                            value={upgradeZoneSplitter} onChange={(e) => setUpgradeZoneSplitter(e.target.value)}>
                            <option value="">--</option>
                            {ZONE_SPLITTER_OPTIONS_SPLIT.map((v) => <option key={v} value={v}>{v}</option>)}
                          </select>
                        </div>
                        <div className="flex items-center gap-1">
                          <span className="text-[10px] text-sky-300">Multipliers</span>
                          <input type="text" placeholder="e.g. 2,3" value={upgradeZoneMultiRaw}
                            onChange={(e) => setUpgradeZoneMultiRaw(e.target.value)}
                            className="bg-sky-950 text-sky-200 text-xs rounded px-1 py-0.5 border border-sky-700 w-20" />
                        </div>
                      </div>
                      <button onClick={() => navigateUpgrade(["ZONE"])}
                        className="self-start px-3 py-1 bg-sky-700 hover:bg-sky-600 border border-sky-500 rounded text-xs font-bold transition-all">
                        → Go to {[...activeFeatures, "zone"].join(" + ")}
                      </button>
                    </div>
                  )}
                </div>
              )}
            </div>
          )}

          {upgradePos !== null && upgradeOptions.length === 0 && (
            <div className="text-xs text-gray-500 bg-gray-700 px-3 py-1.5 rounded">
              ℹ No upgrades available for this coin (all upgradeable features already active)
            </div>
          )}

          {/* GRID — 5 cols × 3 rows, column-major */}
          <div className="grid gap-1" style={{ gridTemplateColumns: "repeat(5, minmax(0, 1fr))" }}>
            {Array.from({ length: 3 }).map((_, row) =>
              Array.from({ length: 5 }).map((_, col) => {
                const pos  = col * 3 + row;
                const coin = coinAt(pos);

                return (
                  <div key={pos} className="flex flex-col gap-1">
                    <div
                      onClick={() => !coin && handleCellClick(pos)}
                      className={`relative rounded-lg border-2 flex flex-col items-center justify-center p-1 min-h-[100px] text-xs text-white cursor-pointer transition-all
                        ${!coin
                          ? "bg-gray-700 border-gray-600 hover:bg-gray-600 hover:border-gray-400"
                          : "bg-pink-950/30 border-pink-500"
                        }
                        ${upgradePos === pos ? "ring-2 ring-yellow-400" : ""}
                      `}
                    >
                      <div className="text-[9px] opacity-50 absolute top-1 left-1">{pos}</div>

                      {coin ? (
                        <div className="flex flex-col items-center w-full gap-1 mt-2 px-0.5">

                          {/* Winged toggle for copy 0 — checkbox so multiple copies can be winged */}
                          {isStrikeCombo ? (
                            <div className="flex flex-col items-center w-full gap-0.5">
                              <div className="text-sm leading-none">
                                {(coin.wingedCopyIdxs?.includes(0)) ? "🪽🟡🪽" : "🟡"}
                              </div>
                              <div className="flex items-center gap-1 w-full" onClick={(e) => e.stopPropagation()}>
                                <input
                                  type="checkbox"
                                  className="accent-yellow-400 w-2.5 h-2.5 cursor-pointer"
                                  checked={coin.wingedCopyIdxs?.includes(0) ?? false}
                                  onChange={() => toggleWingedCopy(pos, 0)}
                                />
                                <span className="text-[8px] text-yellow-300">winged</span>
                              </div>
                            </div>
                          ) : (
                            <div className="text-base leading-none">🟡</div>
                          )}

                          {/* Color */}
                          <select
                            className={`text-white text-[10px] w-full rounded px-0.5 py-0.5 ${COIN_SELECT_BG[coin.colorCode] ?? "bg-gray-600"} border-0`}
                            value={coin.colorCode}
                            onClick={(e) => e.stopPropagation()}
                            onChange={(e) => {
                              updateCoin(pos, "colorCode", Number(e.target.value));
                              if (upgradePos === pos) resetUpgrade();
                            }}
                          >
                            {SPLIT_COIN_COLORS.map((c) => (
                              <option key={c.value} value={c.value} className="bg-gray-800">{c.label}</option>
                            ))}
                          </select>

                          {/* Value (copy 0) */}
                          <select
                            className={`text-white text-[10px] w-full rounded px-0.5 py-0.5 ${COIN_SELECT_BG[coin.colorCode] ?? "bg-gray-600"} border-0`}
                            value={coin.splitCopyValues?.[0] ?? coin.value}
                            onClick={(e) => e.stopPropagation()}
                            onChange={(e) => updateSplitCopyValue(pos, 0, e.target.value)}
                          >
                            {SPLIT_COIN_VALUES.map((v) => (
                              <option key={v} value={v} className="bg-gray-800">{v}</option>
                            ))}
                          </select>

                          {/* Boost — only shown when copy 0 is winged */}
                          {isStrikeCombo && (coin.wingedCopyIdxs?.includes(0)) && (
                            <select
                              className="text-white text-[10px] w-full rounded px-0.5 py-0.5 bg-yellow-700 border-0"
                              value={coin.splitBoostValues?.[0] ?? ""}
                              onClick={(e) => e.stopPropagation()}
                              onChange={(e) => updateSplitBoost(pos, 0, e.target.value)}
                            >
                              <option value="" className="bg-gray-800">Boost (copy 0)</option>
                              {SPLIT_BOOST_VALUES.map((v) => (
                                <option key={v} value={v} className="bg-gray-800">{v}</option>
                              ))}
                            </select>
                          )}

                          {/* Split count */}
                          <select
                            className="text-white text-[10px] w-full rounded px-0.5 py-0.5 bg-pink-700 border-0"
                            value={coin.splitCount}
                            onClick={(e) => e.stopPropagation()}
                            onChange={(e) => {
                              const sc = Number(e.target.value);
                              updateCoin(pos, "splitCount", sc);
                              if (sc <= 1) updateCoin(pos, "splitBoostValues" as any, []);
                            }}
                          >
                            {SPLIT_COUNT_OPTIONS.map((n) => (
                              <option key={n} value={n} className="bg-gray-800">Split × {n}</option>
                            ))}
                          </select>

                          {/* ── UPGRADE RADIO — shown when onUpgrade is provided ── */}
                          {onUpgrade && (
                            <div className="flex items-center gap-1 mt-0.5 w-full" onClick={(e) => e.stopPropagation()}>
                              <input
                                type="radio"
                                name="splitUpgrade"
                                className="accent-yellow-400 w-3 h-3 cursor-pointer"
                                checked={upgradePos === pos}
                                onChange={() => handleUpgradeRadio(pos)}
                              />
                              <span className="text-[8px] text-yellow-300">upgrade</span>
                              {upgradePos === pos && upgradeMultiSel.size > 0 && (
                                <span className="text-[8px] text-yellow-500">
                                  →{Array.from(upgradeMultiSel).map((f) => f.toLowerCase()).join("+")}
                                </span>
                              )}
                            </div>
                          )}

                          {/* Remove */}
                          {!coin.fromBase && (
                            <button
                              onClick={(e) => { e.stopPropagation(); removeCoin(pos); }}
                              className="absolute top-1 right-1 text-[10px] text-red-300 hover:text-red-100 font-bold"
                            >✕</button>
                          )}
                        </div>
                      ) : (
                        <span className="text-gray-500 text-[10px]">+ Add</span>
                      )}
                    </div>

                    {/* Ghost cells for extra split copies */}
                    {coin && coin.splitCount > 1 &&
                      Array.from({ length: coin.splitCount - 1 }).map((_, idx) => (
                        <SplitGhostCell
                          key={idx}
                          copyIdx={idx + 1}
                          coin={coin}
                          isStrikeCombo={isStrikeCombo}
                          onValueChange={(ci, val) => updateSplitCopyValue(pos, ci, val)}
                          onBoostChange={(ci, val) => updateSplitBoost(pos, ci, val)}
                          onWingedToggle={(ci) => toggleWingedCopy(pos, ci)}
                        />
                      ))
                    }
                  </div>
                );
              })
            )}
          </div>

          {/* LEGEND */}
          <div className="text-xs text-gray-400 flex flex-wrap gap-3">
            <span>🟡 = coin | Split × N = N copies (copy 0…N-1), each has its own value</span>
            {isStrikeCombo && <span>🪽🟡🪽 = winged — ☑ checkbox per copy, multiple allowed</span>}
            {onUpgrade && <span>✦ radio = select coin to upgrade · Orange→Strike · Blue→Zone · Green→Extra · All-Color→pick any</span>}
            <span>Click empty cell to add</span>
          </div>

        </div>
      )}
    </div>
  );
}