



//! latest working code
/* eslint-disable @typescript-eslint/no-explicit-any */
// "use client";

// import { useState, useRef } from "react";
// import {
//   ComboCoin,
//   ComboFeatureConfig,
//   CoinColorOption,
//   getComboMaxSpins,
//   getComboCoinColors,
//   getUpgradeFeature,
//   ALL_COLOR_FEATURES,
// } from "./combinationFeatureGenerator";
// import { ZONE_BG_CLASS, ZONE_BORDER_CLASS, getZoneBgColor } from "../zone/zoneFeatureGenerator";
// import { STRIKE_BOOST_VALUES } from "../strike/strikeFeatureGenerator";
// import { SPLIT_COUNT_OPTIONS, SPLIT_BOOST_VALUES, SPLIT_COIN_VALUES } from "../split/splitFeatureGenerator";

// // ── CONSTANTS ─────────────────────────────────────────────────────────────────
// const COIN_VALUES = ["1", "2", "5", "Minor", "Major", "Mini"];

// const FEATURE_BADGE: Record<string, string> = {
//   extra:  "bg-emerald-900 text-emerald-300 border border-emerald-600",
//   zone:   "bg-sky-900 text-sky-300 border border-sky-600",
//   strike: "bg-orange-900 text-orange-300 border border-orange-600",
//   split:  "bg-pink-900 text-pink-300 border border-pink-600",
// };

// const FEATURE_COLORS: Record<string, string> = {
//   extra:  "text-emerald-300",
//   zone:   "text-sky-300",
//   strike: "text-orange-300",
//   split:  "text-pink-300",
// };

// type Props = {
//   baseCoins: ComboCoin[];
//   config:    ComboFeatureConfig;
//   onSpin:    (snapshot: ComboCoin[]) => void;
//   onReset:   () => void;
// };

// // ── Ghost cell for each extra split copy (copyIdx >= 1) ──────────────────────
// function SplitGhost({
//   copyIdx, coin, isStrikeCombo, coinValueOptions,
//   onValueChange, onBoostChange,
// }: {
//   copyIdx:          number;          // 1, 2, or 3
//   coin:             ComboCoin;
//   isStrikeCombo:    boolean;
//   coinValueOptions: string[];
//   onValueChange:    (copyIdx: number, val: string) => void;
//   onBoostChange:    (extraIdx: number, val: string) => void;
// }) {
//   const copyValue = coin.splitCopyValues?.[copyIdx] ?? coin.value;
//   return (
//     <div className="rounded border border-dashed border-pink-400/50 bg-pink-950/30 flex flex-col items-center p-1 gap-0.5 text-[9px] text-pink-200">
//       <span className="opacity-40 self-start">
//         copy {copyIdx} <span className="text-pink-500">(idx {copyIdx})</span>
//       </span>
//       <span className="text-sm leading-none">🟡</span>

//       {/* Per-copy value */}
//       <select
//         className="text-white text-[9px] w-full rounded bg-pink-900 border-0 mt-0.5"
//         value={copyValue}
//         onClick={(e) => e.stopPropagation()}
//         onChange={(e) => onValueChange(copyIdx, e.target.value)}
//       >
//         {coinValueOptions.map((v) => (
//           <option key={v} value={v} className="bg-gray-800">{v}</option>
//         ))}
//       </select>

//       {/* Boost — Strike+Split + winged only */}
//       {isStrikeCombo && coin.winged && (
//         <select
//           className="text-white text-[9px] w-full rounded bg-yellow-800 border-0 mt-0.5"
//           value={coin.splitBoostValues?.[copyIdx - 1] ?? ""}
//           onClick={(e) => e.stopPropagation()}
//           onChange={(e) => onBoostChange(copyIdx - 1, e.target.value)}
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

// // ── Upgrade control shown below each coin ─────────────────────────────────────
// function UpgradeControl({
//   coin, colorLabel, currentFeatures, onToggle, onFeaturesChange,
// }: {
//   coin:            ComboCoin;
//   colorLabel:      string;
//   currentFeatures: string[];   // features already in this combination
//   onToggle:        (upgraded: boolean) => void;
//   onFeaturesChange:(features: string[]) => void;
// }) {
//   const upgradeType = getUpgradeFeature(colorLabel);
//   if (!upgradeType) return null; // gold coin — no upgrade

//   // For a single-color coin, show one checkbox; for all-color, show multi checkboxes
//   const isAllColor = upgradeType === "all";

//   // Features available to upgrade TO (exclude features already in the combo)
//   const availableFeatures = isAllColor
//     ? ALL_COLOR_FEATURES.filter((f) => !currentFeatures.includes(f))
//     : [upgradeType].filter((f) => !currentFeatures.includes(f));

//   if (availableFeatures.length === 0) return null; // all features already active

//   return (
//     <div
//       className="mt-1 pt-1 border-t border-white/10"
//       onClick={(e) => e.stopPropagation()}
//     >
//       <div className="flex items-center gap-1 flex-wrap">
//         <span className="text-[8px] text-gray-400 font-medium">Upgrade:</span>

//         {isAllColor ? (
//           // All-color: one checkbox per available feature
//           availableFeatures.map((feat) => {
//             const checked = coin.upgraded && (coin.upgradeFeatures ?? []).includes(feat);
//             return (
//               <label
//                 key={feat}
//                 className="flex items-center gap-0.5 cursor-pointer"
//                 onClick={(e) => e.stopPropagation()}
//               >
//                 <input
//                   type="checkbox"
//                   checked={!!checked}
//                   onChange={(e) => {
//                     e.stopPropagation();
//                     const current = coin.upgradeFeatures ?? [];
//                     const next = e.target.checked
//                       ? [...current, feat]
//                       : current.filter((f) => f !== feat);
//                     onFeaturesChange(next);
//                     onToggle(next.length > 0);
//                   }}
//                   className="w-2.5 h-2.5 accent-purple-500"
//                 />
//                 <span className={`text-[8px] capitalize ${FEATURE_COLORS[feat] ?? "text-gray-300"}`}>
//                   {feat}
//                 </span>
//               </label>
//             );
//           })
//         ) : (
//           // Single feature: one toggle radio/checkbox
//           <label
//             className="flex items-center gap-1 cursor-pointer"
//             onClick={(e) => e.stopPropagation()}
//           >
//             <input
//               type="checkbox"
//               checked={!!coin.upgraded}
//               onChange={(e) => {
//                 e.stopPropagation();
//                 onToggle(e.target.checked);
//                 if (!e.target.checked) onFeaturesChange([]);
//                 else onFeaturesChange([upgradeType]);
//               }}
//               className="w-2.5 h-2.5 accent-purple-500"
//             />
//             <span className={`text-[8px] capitalize ${FEATURE_COLORS[availableFeatures[0]] ?? "text-gray-300"}`}>
//               → {availableFeatures[0]}
//             </span>
//           </label>
//         )}
//       </div>
//     </div>
//   );
// }

// // ── Main component ─────────────────────────────────────────────────────────────
// export default function CombinationFeature({ baseCoins, config, onSpin, onReset }: Props) {
//   const MAX_SPINS   = getComboMaxSpins(config);
//   const coinColors  = getComboCoinColors(config.features);
//   const defaultCode = coinColors[0].value;

//   const [isOpen,    setIsOpen]    = useState(true);
//   const initialSeeds = baseCoins.map((c) => ({ ...c, fromBase: true }));
//   const [coins,     setCoins]     = useState<ComboCoin[]>(initialSeeds);
//   const [spinsLeft, setSpinsLeft] = useState(MAX_SPINS);
//   const lastSpinPositions = useRef<Set<number>>(new Set(initialSeeds.map((c) => c.position)));

//   const coinAt = (pos: number) => coins.find((c) => c.position === pos);

//   const handleCellClick = (pos: number) => {
//     if (coinAt(pos)) return;
//     setCoins((prev) => [
//       ...prev,
//       { position: pos, colorCode: defaultCode, value: COIN_VALUES[0], winged: false, splitCount: 1 },
//     ]);
//   };

//   const removeCoin = (pos: number) => {
//     const c = coinAt(pos);
//     if (!c || c.fromBase) return;
//     setCoins((prev) => prev.filter((x) => x.position !== pos));
//   };

//   const updateCoin = (pos: number, field: keyof ComboCoin, val: any) =>
//     setCoins((prev) => prev.map((c) => c.position === pos ? { ...c, [field]: val } : c));

//   // Per-copy value override
//   const updateCopyValue = (pos: number, copyIdx: number, val: string) =>
//     setCoins((prev) => prev.map((c) => {
//       if (c.position !== pos) return c;
//       const arr = [...(c.splitCopyValues ?? [])];
//       arr[copyIdx] = val;
//       return { ...c, splitCopyValues: arr };
//     }));

//   const updateSplitBoost = (pos: number, idx: number, val: string) =>
//     setCoins((prev) => prev.map((c) => {
//       if (c.position !== pos) return c;
//       const arr = [...(c.splitBoostValues ?? [])];
//       arr[idx] = val;
//       return { ...c, splitBoostValues: arr };
//     }));

//   const toggleWinged = (pos: number, e: React.MouseEvent) => {
//     e.stopPropagation();
//     const c = coinAt(pos);
//     if (!c) return;
//     setCoins((prev) => prev.map((x) =>
//       x.position === pos
//         ? { ...x, winged: !x.winged, boostValue: x.winged ? undefined : x.boostValue }
//         : x
//     ));
//   };

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
//     onReset();
//   };

//   const activeSplitter = config.hasZone ? (config.splitter ?? 1) : 0;

//   // Compute which additional features have been selected across all coins
//   const upgradedFeatures: string[] = [];
//   coins.forEach((c) => {
//     if (!c.upgraded) return;
//     const label = coinColors.find((o) => o.value === c.colorCode)?.label ?? "";
//     const upgradeType = getUpgradeFeature(label);
//     if (upgradeType === "all") {
//       (c.upgradeFeatures ?? []).forEach((f) => {
//         if (!upgradedFeatures.includes(f)) upgradedFeatures.push(f);
//       });
//     } else if (upgradeType && !upgradedFeatures.includes(upgradeType)) {
//       upgradedFeatures.push(upgradeType);
//     }
//   });

//   // Value options: combine standard + split values for split combos
//   const coinValueOptions = config.hasSplit
//     ? [...new Set([...COIN_VALUES, ...SPLIT_COIN_VALUES])]
//     : COIN_VALUES;

//   return (
//     <div className="bg-gray-800 rounded-xl">

//       {/* ── HEADER ── */}
//       <div onClick={() => setIsOpen(!isOpen)} className="flex justify-between items-center p-4 cursor-pointer">
//         <div className="flex items-center gap-2 flex-wrap">
//           <h2 className="text-lg font-semibold text-white">⚡ Combination Feature</h2>
//           {config.features.map((name) => (
//             <span key={name} className={`text-xs px-2 py-0.5 rounded capitalize ${FEATURE_BADGE[name] ?? "bg-gray-700 text-gray-300"}`}>
//               {name}
//             </span>
//           ))}
//           {config.hasZone && config.splitter && (
//             <span className="text-xs px-2 py-0.5 rounded bg-sky-900 text-sky-300 border border-sky-700">
//               Splitter {config.splitter}
//             </span>
//           )}
//           {/* Upgrade summary badge */}
//           {upgradedFeatures.length > 0 && (
//             <span className="text-xs px-2 py-0.5 rounded bg-purple-900 text-purple-300 border border-purple-600">
//               ↑ {upgradedFeatures.join(", ")}
//             </span>
//           )}
//         </div>
//         <span className="text-white">{isOpen ? "▼" : "▶"}</span>
//       </div>

//       {isOpen && (
//         <div className="p-6 pt-0 flex flex-col gap-4">

//           {/* ── SPIN CONTROLS ── */}
//           <div className="flex items-center gap-4 flex-wrap">
//             <button
//               onClick={handleSpin}
//               disabled={spinsLeft <= 0}
//               className={`px-6 py-2 rounded font-bold text-white transition-all ${
//                 spinsLeft > 0 ? "bg-purple-600 hover:bg-purple-500" : "bg-gray-600 cursor-not-allowed opacity-50"
//               }`}
//             >
//               SPIN
//             </button>
//             <span className="text-sm text-gray-300">
//               {spinsLeft} spin{spinsLeft !== 1 ? "s" : ""} left
//             </span>
//             <button onClick={resetFeature} className="px-3 py-1 bg-gray-600 hover:bg-gray-500 rounded text-sm">
//               Reset
//             </button>
//           </div>

//           {/* ── GRID ── */}
//           <div className="grid gap-1" style={{ gridTemplateColumns: "repeat(5, minmax(0, 1fr))" }}>
//             {Array.from({ length: 3 }).map((_, row) =>
//               Array.from({ length: 5 }).map((_, col) => {
//                 const pos  = col * 3 + row;
//                 const coin = coinAt(pos);
//                 const zoneBg  = config.hasZone ? getZoneBgColor(pos, activeSplitter) : null;
//                 const cellBg  = zoneBg
//                   ? `${ZONE_BG_CLASS[zoneBg]} ${ZONE_BORDER_CLASS[zoneBg]}`
//                   : "bg-gray-700 border-gray-600";

//                 // Determine color label for this coin (for upgrade logic)
//                 const colorLabel = coin
//                   ? (coinColors.find((o) => o.value === coin.colorCode)?.label ?? "")
//                   : "";
//                 const isGold = colorLabel.toLowerCase().includes("gold");

//                 return (
//                   <div key={pos} className="flex flex-col gap-1">

//                     {/* ── PRIMARY CELL (copy 0) ── */}
//                     <div
//                       onClick={() => !coin && handleCellClick(pos)}
//                       className={`relative rounded-lg border-2 flex flex-col items-center justify-center p-1 min-h-[110px] text-xs text-white cursor-pointer transition-all hover:brightness-110 ${cellBg}
//                         ${!coin && !config.hasZone ? "hover:bg-gray-600 hover:border-gray-400" : ""}
//                         ${coin && config.hasSplit ? "border-pink-500/60" : ""}
//                       `}
//                     >
//                       {/* Position index */}
//                       <div className="text-[8px] opacity-40 absolute top-1 left-1">{pos}</div>
//                       {/* Copy-0 tag */}
//                       {coin && (
//                         <div className="text-[8px] opacity-40 absolute top-1 right-5 text-pink-300">
//                           copy 0
//                         </div>
//                       )}

//                       {coin ? (
//                         <div className="flex flex-col items-center w-full gap-1 mt-3 px-0.5">

//                           {/* Winged toggle */}
//                           {config.hasStrike ? (
//                             <button
//                               onClick={(e) => toggleWinged(pos, e)}
//                               title="Toggle winged / plain"
//                               className={`text-sm leading-none px-1 py-0.5 rounded transition-all ${
//                                 coin.winged
//                                   ? "bg-yellow-500/20 text-yellow-200 ring-1 ring-yellow-400"
//                                   : "text-yellow-300 hover:bg-yellow-500/10"
//                               }`}
//                             >
//                               {coin.winged ? "🪽🟡🪽" : "🟡"}
//                             </button>
//                           ) : (
//                             <div className="text-base leading-none">🟡</div>
//                           )}

//                           {/* Color */}
//                           <select
//                             className="text-white text-[10px] w-full rounded px-0.5 py-0.5 bg-gray-600 border-0"
//                             value={coin.colorCode}
//                             onClick={(e) => e.stopPropagation()}
//                             onChange={(e) => {
//                               updateCoin(pos, "colorCode", Number(e.target.value));
//                               // reset upgrade state when color changes
//                               updateCoin(pos, "upgraded" as any, false);
//                               updateCoin(pos, "upgradeFeatures" as any, []);
//                             }}
//                           >
//                             {coinColors.map((c) => (
//                               <option key={c.value} value={c.value} className="bg-gray-800">{c.label}</option>
//                             ))}
//                           </select>

//                           {/* Value (copy 0) */}
//                           <select
//                             className="text-white text-[10px] w-full rounded px-0.5 py-0.5 bg-gray-600 border-0"
//                             value={coin.splitCopyValues?.[0] ?? coin.value}
//                             onClick={(e) => e.stopPropagation()}
//                             onChange={(e) => {
//                               updateCopyValue(pos, 0, e.target.value);
//                               updateCoin(pos, "value", e.target.value);
//                             }}
//                           >
//                             {coinValueOptions.map((v) => (
//                               <option key={v} value={v} className="bg-gray-800">{v}</option>
//                             ))}
//                           </select>

//                           {/* Boost (copy 0) — Strike + winged */}
//                           {config.hasStrike && coin.winged && (
//                             <select
//                               className="text-white text-[10px] w-full rounded px-0.5 py-0.5 bg-yellow-700 border-0"
//                               value={coin.boostValue ?? ""}
//                               onClick={(e) => e.stopPropagation()}
//                               onChange={(e) => updateCoin(pos, "boostValue", e.target.value)}
//                             >
//                               <option value="" className="bg-gray-800">Boost (copy 0)</option>
//                               {STRIKE_BOOST_VALUES.map((v) => (
//                                 <option key={v} value={v} className="bg-gray-800">{v}</option>
//                               ))}
//                             </select>
//                           )}

//                           {/* Split count */}
//                           {config.hasSplit && (
//                             <select
//                               className="text-white text-[10px] w-full rounded px-0.5 py-0.5 bg-pink-700 border-0"
//                               value={coin.splitCount ?? 1}
//                               onClick={(e) => e.stopPropagation()}
//                               onChange={(e) => {
//                                 const sc = Number(e.target.value);
//                                 updateCoin(pos, "splitCount", sc);
//                                 if (sc <= 1) {
//                                   updateCoin(pos, "splitBoostValues" as any, []);
//                                   updateCoin(pos, "splitCopyValues"  as any, []);
//                                 }
//                               }}
//                             >
//                               {SPLIT_COUNT_OPTIONS.map((n) => (
//                                 <option key={n} value={n} className="bg-gray-800">Split × {n}</option>
//                               ))}
//                             </select>
//                           )}

//                           {/* ── UPGRADE CONTROL (hidden for gold coins) ── */}
//                           {!isGold && (
//                             <UpgradeControl
//                               coin={coin}
//                               colorLabel={colorLabel}
//                               currentFeatures={config.features}
//                               onToggle={(upgraded) => updateCoin(pos, "upgraded" as any, upgraded)}
//                               onFeaturesChange={(feats) => updateCoin(pos, "upgradeFeatures" as any, feats)}
//                             />
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
//                         <span className="text-white/40 text-[10px]">+ Add</span>
//                       )}
//                     </div>

//                     {/* ── GHOST CELLS for extra split copies ── */}
//                     {coin && config.hasSplit && (coin.splitCount ?? 1) > 1 &&
//                       Array.from({ length: (coin.splitCount ?? 1) - 1 }).map((_, i) => {
//                         const copyIdx = i + 1;
//                         return (
//                           <SplitGhost
//                             key={copyIdx}
//                             copyIdx={copyIdx}
//                             coin={coin}
//                             isStrikeCombo={config.hasStrike}
//                             coinValueOptions={coinValueOptions}
//                             onValueChange={(ci, v) => updateCopyValue(pos, ci, v)}
//                             onBoostChange={(ei, v) => updateSplitBoost(pos, ei, v)}
//                           />
//                         );
//                       })
//                     }

//                   </div>
//                 );
//               })
//             )}
//           </div>

//           {/* ── UPGRADE SUMMARY ── */}
//           {upgradedFeatures.length > 0 && (
//             <div className="text-xs bg-purple-950/50 border border-purple-700 rounded px-3 py-2 text-purple-200">
//               <span className="font-semibold text-purple-300">additionalFeatureTriggered: </span>
//               [{upgradedFeatures.join(", ")}]
//             </div>
//           )}

//           {/* ── LEGEND ── */}
//           <div className="text-xs text-gray-400 flex flex-wrap gap-3">
//             {config.hasStrike && <span>🪽🟡🪽 = winged — click to toggle</span>}
//             {config.hasSplit  && <span>Split × N = N copies (copy 0…N-1), each has its own value</span>}
//             {config.hasZone   && <span>Background = zone (splitter {config.splitter})</span>}
//             <span>Upgrade checkbox appears below non-gold coins</span>
//             <span>Click empty cell to add coin</span>
//           </div>

//         </div>
//       )}
//     </div>
//   );
// }


//!working
// /* eslint-disable @typescript-eslint/no-explicit-any */
// "use client";

// import { useState, useRef, useMemo } from "react";
// import {
//   ComboCoin, ComboFeatureConfig, CoinColorOption,
//   getComboCoinColors, getUpgradeType, ALL_COLOR_UPGRADE_FEATURES,
//   getComboMaxSpins, generateCombinationGaffe,
// } from "./combinationFeatureGenerator";
// import { ZONE_BG_CLASS, ZONE_BORDER_CLASS, getZoneBgColor } from "../zone/zoneFeatureGenerator";
// import { STRIKE_BOOST_VALUES } from "../strike/strikeFeatureGenerator";
// import { SPLIT_COUNT_OPTIONS, SPLIT_BOOST_VALUES, SPLIT_COIN_VALUES } from "../split/splitFeatureGenerator";

// // ── Constants ─────────────────────────────────────────────────────────────────
// const COIN_VALUES = ["1", "2", "5", "Minor", "Major", "Mini"];
// const ZONE_SPLITTER_OPTIONS = [1, 2, 3, 4, 5];
// const ZONE_MULTIPLIER_PRESETS = ["1,2,3", "2,4,6", "1,3,5", "5,10,15", "1,2,5,10"];

// const FEATURE_BADGE: Record<string, string> = {
//   extra:  "bg-emerald-900 text-emerald-300 border border-emerald-600",
//   zone:   "bg-sky-900 text-sky-300 border border-sky-600",
//   strike: "bg-orange-900 text-orange-300 border border-orange-600",
//   split:  "bg-pink-900 text-pink-300 border border-pink-600",
// };
// const FEATURE_COLOR: Record<string, string> = {
//   strike: "text-orange-300",
//   zone:   "text-sky-300",
//   extra:  "text-emerald-300",
//   split:  "text-pink-300",
// };

// type Props = {
//   baseCoins: ComboCoin[];
//   config:    ComboFeatureConfig;
//   onSpin:    (snap: ComboCoin[], upgradedSplitter: number, upgradedMultipliers: number[]) => void;
//   onReset:   () => void;
// };

// // ── Upgrade control — below each non-gold coin ───────────────────────────────
// function UpgradeControl({
//   coin, colorLabel, currentFeatures, onToggle, onFeaturesChange,
// }: {
//   coin:            ComboCoin;
//   colorLabel:      string;
//   currentFeatures: string[];
//   onToggle:        (val: boolean) => void;
//   onFeaturesChange:(val: string[]) => void;
// }) {
//   const upgradeType = getUpgradeType(colorLabel);
//   if (!upgradeType || upgradeType === "gold") return null;

//   // Features available to upgrade to (exclude already-active base features)
//   const available = upgradeType === "all"
//     ? ALL_COLOR_UPGRADE_FEATURES.filter((f) => !currentFeatures.includes(f))
//     : [upgradeType].filter((f) => !currentFeatures.includes(f));

//   if (available.length === 0) return null;

//   return (
//     <div className="mt-1 pt-1 border-t border-white/10 w-full" onClick={(e) => e.stopPropagation()}>
//       <div className="text-[8px] text-gray-400 mb-0.5 font-semibold tracking-wide">Upgrade →</div>
//       <div className="flex flex-wrap gap-1">
//         {available.map((feat) => {
//           const checked = !!coin.upgraded && (coin.upgradeFeatures ?? []).includes(feat);
//           return (
//             <label key={feat} className="flex items-center gap-0.5 cursor-pointer" onClick={(e) => e.stopPropagation()}>
//               <input
//                 type="checkbox"
//                 checked={checked}
//                 onChange={(e) => {
//                   e.stopPropagation();
//                   const cur  = coin.upgradeFeatures ?? [];
//                   const next = e.target.checked ? [...cur, feat] : cur.filter((f) => f !== feat);
//                   onFeaturesChange(next);
//                   onToggle(next.length > 0);
//                 }}
//                 className="w-2.5 h-2.5 accent-purple-400"
//               />
//               <span className={`text-[8px] capitalize ${FEATURE_COLOR[feat] ?? "text-gray-300"}`}>{feat}</span>
//             </label>
//           );
//         })}
//       </div>
//     </div>
//   );
// }

// // ── Ghost cell for split copies ───────────────────────────────────────────────
// function SplitGhost({
//   copyIdx, coin, effStrike, coinValueOptions, onValueChange, onBoostChange,
// }: {
//   copyIdx:          number;
//   coin:             ComboCoin;
//   effStrike:        boolean;
//   coinValueOptions: string[];
//   onValueChange:    (ci: number, v: string) => void;
//   onBoostChange:    (ei: number, v: string) => void;
// }) {
//   const copyVal = coin.splitCopyValues?.[copyIdx] ?? coin.value;
//   return (
//     <div className="rounded border border-dashed border-pink-400/50 bg-pink-950/30 flex flex-col items-center p-1 gap-0.5">
//       <span className="text-[8px] text-pink-300/50 self-start">copy {copyIdx}</span>
//       <span className="text-sm leading-none">🟡</span>
//       <select
//         className="text-white text-[9px] w-full rounded bg-pink-900 border-0 mt-0.5"
//         value={copyVal}
//         onClick={(e) => e.stopPropagation()}
//         onChange={(e) => onValueChange(copyIdx, e.target.value)}
//       >
//         {coinValueOptions.map((v) => <option key={v} value={v} className="bg-gray-800">{v}</option>)}
//       </select>
//       {effStrike && coin.winged && (
//         <select
//           className="text-white text-[9px] w-full rounded bg-yellow-800 border-0 mt-0.5"
//           value={coin.splitBoostValues?.[copyIdx - 1] ?? ""}
//           onClick={(e) => e.stopPropagation()}
//           onChange={(e) => onBoostChange(copyIdx - 1, e.target.value)}
//         >
//           <option value="" className="bg-gray-800">Boost</option>
//           {SPLIT_BOOST_VALUES.map((v) => <option key={v} value={v} className="bg-gray-800">{v}</option>)}
//         </select>
//       )}
//     </div>
//   );
// }

// // ── Zone upgrade settings panel ───────────────────────────────────────────────
// function ZoneUpgradePanel({ splitter, multiplierStr, onSplitterChange, onMultiplierChange }: {
//   splitter:           number;
//   multiplierStr:      string;
//   onSplitterChange:   (v: number) => void;
//   onMultiplierChange: (v: string) => void;
// }) {
//   return (
//     <div className="bg-sky-950/60 border border-sky-700 rounded-lg p-3 flex flex-col gap-2">
//       <div className="text-xs font-semibold text-sky-300">🔵 Zone Upgrade Settings
//         <span className="ml-2 text-[9px] text-sky-500 font-normal">(does not cost spins)</span>
//       </div>
//       <div className="flex gap-4 flex-wrap items-start">
//         <div className="flex flex-col gap-1">
//           <label className="text-[10px] text-sky-400">Splitter</label>
//           <div className="flex gap-1">
//             {ZONE_SPLITTER_OPTIONS.map((n) => (
//               <button key={n} onClick={() => onSplitterChange(n)}
//                 className={`w-7 h-7 rounded text-xs font-bold transition-all ${splitter === n ? "bg-sky-500 text-white" : "bg-sky-900/60 text-sky-400 hover:bg-sky-800"}`}
//               >{n}</button>
//             ))}
//           </div>
//         </div>
//         <div className="flex flex-col gap-1 flex-1 min-w-[160px]">
//           <label className="text-[10px] text-sky-400">Multipliers (comma-separated)</label>
//           <input
//             type="text" value={multiplierStr}
//             onChange={(e) => onMultiplierChange(e.target.value)}
//             className="bg-sky-900/60 border border-sky-700 text-sky-100 text-xs rounded px-2 py-1 w-full"
//             placeholder="e.g. 1,2,5"
//           />
//           <div className="flex gap-1 flex-wrap">
//             {ZONE_MULTIPLIER_PRESETS.map((p) => (
//               <button key={p} onClick={() => onMultiplierChange(p)}
//                 className={`text-[9px] px-1.5 py-0.5 rounded transition-all ${multiplierStr === p ? "bg-sky-500 text-white" : "bg-sky-900/60 text-sky-400 hover:bg-sky-800"}`}
//               >{p}</button>
//             ))}
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// }

// // ── Main component ────────────────────────────────────────────────────────────
// export default function CombinationFeature({ baseCoins, config, onSpin, onReset }: Props) {
//   const coinColors  = getComboCoinColors(config.features);
//   const defaultCode = coinColors[0].value;

//   const [isOpen, setIsOpen] = useState(true);
//   const initialSeeds = baseCoins.map((c) => ({ ...c, fromBase: true }));
//   const [coins, setCoins]   = useState<ComboCoin[]>(initialSeeds);

//   // Zone upgrade settings (only used when zone is newly upgraded)
//   const [upgSplitter,     setUpgSplitter]     = useState<number>(config.splitter ?? 1);
//   const [upgMultiplierStr,setUpgMultiplierStr] = useState<string>(config.multipliers?.join(",") ?? "");

//   // Derive all upgraded features live from coin state
//   const allUpgraded = useMemo(
//     () => [...new Set(coins.flatMap((c) => (c.upgraded ? (c.upgradeFeatures ?? []) : [])))],
//     [coins]
//   );

//   // Effective flags — base config OR upgraded into
//   const effStrike = config.hasStrike || allUpgraded.includes("strike");
//   const effZone   = config.hasZone   || allUpgraded.includes("zone");
//   const effSplit  = config.hasSplit  || allUpgraded.includes("split");
//   const effExtra  = config.hasExtra  || allUpgraded.includes("extra");

//   // Zone params: if zone was newly upgraded (not in base config) use upgraded values
//   const zoneUpgraded = allUpgraded.includes("zone") && !config.hasZone;
//   const effSplitter = effZone
//     ? (zoneUpgraded ? upgSplitter : (config.splitter ?? upgSplitter))
//     : 1;
//   const effMultipliers = useMemo(() => {
//     if (!effZone) return [];
//     if (zoneUpgraded) return upgMultiplierStr.split(",").map((n) => n.trim()).filter(Boolean).map(Number);
//     return config.multipliers ?? [];
//   }, [effZone, zoneUpgraded, config.multipliers, upgMultiplierStr]);

//   // Spin count
//   const MAX_SPINS = getComboMaxSpins(config, allUpgraded);
//   const [spinsLeft, setSpinsLeft] = useState(MAX_SPINS);
//   const prevMaxRef = useRef(MAX_SPINS);
//   // Bump spinsLeft when extra is newly gained (without penalising)
//   if (MAX_SPINS !== prevMaxRef.current) {
//     if (MAX_SPINS > prevMaxRef.current) {
//       // schedule update outside render
//       setTimeout(() => setSpinsLeft((s) => Math.min(s + (MAX_SPINS - prevMaxRef.current), MAX_SPINS)), 0);
//     }
//     prevMaxRef.current = MAX_SPINS;
//   }

//   const lastSpinPositions = useRef<Set<number>>(new Set(initialSeeds.map((c) => c.position)));

//   // ── Coin helpers ───────────────────────────────────────────────────────────
//   const coinAt = (pos: number) => coins.find((c) => c.position === pos);

//   const addCoin = (pos: number) => {
//     if (coinAt(pos)) return;
//     setCoins((prev) => [...prev, { position:pos, colorCode:defaultCode, value:COIN_VALUES[0], winged:false, splitCount:1 }]);
//   };

//   const removeCoin = (pos: number) => {
//     if (coinAt(pos)?.fromBase) return;
//     setCoins((prev) => prev.filter((x) => x.position !== pos));
//   };

//   const updateCoin = (pos: number, field: keyof ComboCoin, val: any) =>
//     setCoins((prev) => prev.map((c) => c.position === pos ? { ...c, [field]: val } : c));

//   const updateCopyValue = (pos: number, ci: number, val: string) =>
//     setCoins((prev) => prev.map((c) => {
//       if (c.position !== pos) return c;
//       const arr = [...(c.splitCopyValues ?? [])];
//       arr[ci] = val;
//       return { ...c, splitCopyValues: arr };
//     }));

//   const updateSplitBoost = (pos: number, ei: number, val: string) =>
//     setCoins((prev) => prev.map((c) => {
//       if (c.position !== pos) return c;
//       const arr = [...(c.splitBoostValues ?? [])];
//       arr[ei] = val;
//       return { ...c, splitBoostValues: arr };
//     }));

//   const toggleWinged = (pos: number, e: React.MouseEvent) => {
//     e.stopPropagation();
//     setCoins((prev) => prev.map((x) =>
//       x.position === pos ? { ...x, winged: !x.winged, boostValue: x.winged ? undefined : x.boostValue } : x
//     ));
//   };

//   // ── Spin ──────────────────────────────────────────────────────────────────
//   const handleSpin = () => {
//     if (spinsLeft <= 0) return;
//     const cur = new Set(coins.map((c) => c.position));
//     const hasNew = [...cur].some((p) => !lastSpinPositions.current.has(p));
//     setSpinsLeft(hasNew ? MAX_SPINS : spinsLeft - 1);
//     lastSpinPositions.current = cur;
//     onSpin(coins, effSplitter, effMultipliers);
//   };

//   const resetFeature = () => {
//     const seeded = baseCoins.map((c) => ({ ...c, fromBase: true }));
//     setCoins(seeded);
//     setSpinsLeft(MAX_SPINS);
//     lastSpinPositions.current = new Set(seeded.map((c) => c.position));
//     onReset();
//   };

//   // Coin value options — include split values when split is effective
//   const coinValueOptions = effSplit
//     ? [...new Set([...COIN_VALUES, ...SPLIT_COIN_VALUES])]
//     : COIN_VALUES;

//   // Upgraded features that are new (not already in base config)
//   const newUpgraded = allUpgraded.filter((f) => !config.features.includes(f));

//   // ── Render ─────────────────────────────────────────────────────────────────
//   return (
//     <div className="bg-gray-800 rounded-xl">

//       {/* HEADER */}
//       <div onClick={() => setIsOpen(!isOpen)} className="flex justify-between items-center p-4 cursor-pointer">
//         <div className="flex items-center gap-2 flex-wrap">
//           <h2 className="text-lg font-semibold text-white">⚡ Combination Feature</h2>
//           {/* Base feature badges */}
//           {config.features.map((name) => (
//             <span key={name} className={`text-xs px-2 py-0.5 rounded capitalize ${FEATURE_BADGE[name] ?? "bg-gray-700 text-gray-300"}`}>{name}</span>
//           ))}
//           {/* Newly upgraded feature badges */}
//           {newUpgraded.map((f) => (
//             <span key={`up-${f}`} className={`text-xs px-2 py-0.5 rounded capitalize border border-dashed opacity-80 ${FEATURE_BADGE[f] ?? "bg-gray-700 text-gray-300"}`}>↑{f}</span>
//           ))}
//           {/* Zone splitter badge */}
//           {effZone && (
//             <span className="text-xs px-2 py-0.5 rounded bg-sky-900 text-sky-300 border border-sky-700">
//               Splitter {effSplitter}
//             </span>
//           )}
//           {/* Extra spins badge */}
//           {effExtra && (
//             <span className="text-xs px-2 py-0.5 rounded bg-emerald-900 text-emerald-300 border border-emerald-700">
//               {MAX_SPINS} spins
//             </span>
//           )}
//         </div>
//         <span className="text-white">{isOpen ? "▼" : "▶"}</span>
//       </div>

//       {isOpen && (
//         <div className="p-6 pt-0 flex flex-col gap-4">

//           {/* Zone upgrade settings — only shown when zone is newly upgraded */}
//           {zoneUpgraded && (
//             <ZoneUpgradePanel
//               splitter={upgSplitter}
//               multiplierStr={upgMultiplierStr}
//               onSplitterChange={setUpgSplitter}
//               onMultiplierChange={setUpgMultiplierStr}
//             />
//           )}

//           {/* SPIN CONTROLS */}
//           <div className="flex items-center gap-4 flex-wrap">
//             <button
//               onClick={handleSpin}
//               disabled={spinsLeft <= 0}
//               className={`px-6 py-2 rounded font-bold text-white transition-all ${
//                 spinsLeft > 0 ? "bg-purple-600 hover:bg-purple-500" : "bg-gray-600 cursor-not-allowed opacity-50"
//               }`}
//             >
//               SPIN
//             </button>
//             <span className="text-sm text-gray-300">
//               {spinsLeft} / {MAX_SPINS} spins left
//               {effExtra && <span className="ml-1 text-emerald-400 text-xs">(Extra)</span>}
//             </span>
//             <button onClick={resetFeature} className="px-3 py-1 bg-gray-600 hover:bg-gray-500 rounded text-sm">Reset</button>
//           </div>

//           {/* GRID — 5 cols × 3 rows, column-major */}
//           <div className="grid gap-1" style={{ gridTemplateColumns: "repeat(5, minmax(0, 1fr))" }}>
//             {Array.from({ length: 3 }).map((_, row) =>
//               Array.from({ length: 5 }).map((_, col) => {
//                 const pos  = col * 3 + row;
//                 const coin = coinAt(pos);

//                 // Zone background — apply when zone is effective (base OR upgraded)
//                 const zoneBg = effZone ? getZoneBgColor(pos, effSplitter) : null;
//                 const cellBg = zoneBg
//                   ? `${ZONE_BG_CLASS[zoneBg]} ${ZONE_BORDER_CLASS[zoneBg]}`
//                   : "bg-gray-700 border-gray-600";

//                 const colorLabel = coin ? (coinColors.find((o) => o.value === coin.colorCode)?.label ?? "") : "";
//                 const isGold = colorLabel.toLowerCase().includes("gold");

//                 return (
//                   <div key={pos} className="flex flex-col gap-1">

//                     {/* PRIMARY CELL */}
//                     <div
//                       onClick={() => !coin && addCoin(pos)}
//                       className={`relative rounded-lg border-2 flex flex-col items-center justify-center p-1 min-h-[110px] text-xs text-white cursor-pointer transition-all hover:brightness-110
//                         ${cellBg}
//                         ${!coin && !effZone ? "hover:bg-gray-600 hover:border-gray-400" : ""}
//                         ${coin && effSplit ? "border-pink-500/60" : ""}
//                       `}
//                     >
//                       <div className="text-[8px] opacity-40 absolute top-1 left-1">{pos}</div>
//                       {coin && effSplit && <div className="text-[8px] opacity-30 absolute top-1 right-5 text-pink-300">c0</div>}

//                       {coin ? (
//                         <div className="flex flex-col items-center w-full gap-1 mt-3 px-0.5">

//                           {/* Winged toggle — shown when strike is effective */}
//                           {effStrike ? (
//                             <button
//                               onClick={(e) => toggleWinged(pos, e)}
//                               title="Toggle winged / plain"
//                               className={`text-sm leading-none px-1 py-0.5 rounded transition-all ${
//                                 coin.winged
//                                   ? "bg-yellow-500/20 text-yellow-200 ring-1 ring-yellow-400"
//                                   : "text-yellow-300 hover:bg-yellow-500/10"
//                               }`}
//                             >
//                               {coin.winged ? "🪽🟡🪽" : "🟡"}
//                             </button>
//                           ) : (
//                             <div className="text-base leading-none">🟡</div>
//                           )}

//                           {/* Color */}
//                           <select
//                             className="text-white text-[10px] w-full rounded px-0.5 py-0.5 bg-gray-600 border-0"
//                             value={coin.colorCode}
//                             onClick={(e) => e.stopPropagation()}
//                             onChange={(e) => {
//                               updateCoin(pos, "colorCode", Number(e.target.value));
//                               updateCoin(pos, "upgraded"        as any, false);
//                               updateCoin(pos, "upgradeFeatures" as any, []);
//                             }}
//                           >
//                             {coinColors.map((c) => (
//                               <option key={c.value} value={c.value} className="bg-gray-800">{c.label}</option>
//                             ))}
//                           </select>

//                           {/* Value (copy 0) */}
//                           <select
//                             className="text-white text-[10px] w-full rounded px-0.5 py-0.5 bg-gray-600 border-0"
//                             value={coin.splitCopyValues?.[0] ?? coin.value}
//                             onClick={(e) => e.stopPropagation()}
//                             onChange={(e) => {
//                               updateCopyValue(pos, 0, e.target.value);
//                               updateCoin(pos, "value", e.target.value);
//                             }}
//                           >
//                             {coinValueOptions.map((v) => (
//                               <option key={v} value={v} className="bg-gray-800">{v}</option>
//                             ))}
//                           </select>

//                           {/* Boost copy 0 — strike effective + winged */}
//                           {effStrike && coin.winged && (
//                             <select
//                               className="text-white text-[10px] w-full rounded px-0.5 py-0.5 bg-yellow-700 border-0"
//                               value={coin.boostValue ?? ""}
//                               onClick={(e) => e.stopPropagation()}
//                               onChange={(e) => updateCoin(pos, "boostValue", e.target.value)}
//                             >
//                               <option value="" className="bg-gray-800">Boost (c0)</option>
//                               {STRIKE_BOOST_VALUES.map((v) => (
//                                 <option key={v} value={v} className="bg-gray-800">{v}</option>
//                               ))}
//                             </select>
//                           )}

//                           {/* Split count — split effective */}
//                           {effSplit && (
//                             <select
//                               className="text-white text-[10px] w-full rounded px-0.5 py-0.5 bg-pink-700 border-0"
//                               value={coin.splitCount ?? 1}
//                               onClick={(e) => e.stopPropagation()}
//                               onChange={(e) => {
//                                 const sc = Number(e.target.value);
//                                 updateCoin(pos, "splitCount", sc);
//                                 if (sc <= 1) {
//                                   updateCoin(pos, "splitBoostValues" as any, []);
//                                   updateCoin(pos, "splitCopyValues"  as any, []);
//                                 }
//                               }}
//                             >
//                               {SPLIT_COUNT_OPTIONS.map((n) => (
//                                 <option key={n} value={n} className="bg-gray-800">Split × {n}</option>
//                               ))}
//                             </select>
//                           )}

//                           {/* UPGRADE CONTROL — hidden for gold coins */}
//                           {!isGold && (
//                             <UpgradeControl
//                               coin={coin}
//                               colorLabel={colorLabel}
//                               currentFeatures={config.features}
//                               onToggle={(v) => updateCoin(pos, "upgraded"        as any, v)}
//                               onFeaturesChange={(v) => updateCoin(pos, "upgradeFeatures" as any, v)}
//                             />
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
//                         <span className="text-white/40 text-[10px]">+ Add</span>
//                       )}
//                     </div>

//                     {/* GHOST CELLS for extra split copies */}
//                     {coin && effSplit && (coin.splitCount ?? 1) > 1 &&
//                       Array.from({ length: (coin.splitCount ?? 1) - 1 }).map((_, i) => {
//                         const ci = i + 1;
//                         return (
//                           <SplitGhost
//                             key={ci}
//                             copyIdx={ci}
//                             coin={coin}
//                             effStrike={effStrike}
//                             coinValueOptions={coinValueOptions}
//                             onValueChange={(c, v) => updateCopyValue(pos, c, v)}
//                             onBoostChange={(e, v) => updateSplitBoost(pos, e, v)}
//                           />
//                         );
//                       })
//                     }

//                   </div>
//                 );
//               })
//             )}
//           </div>

//           {/* UPGRADE SUMMARY */}
//           {allUpgraded.length > 0 && (
//             <div className="text-xs bg-purple-950/50 border border-purple-700 rounded px-3 py-2 text-purple-200 flex flex-col gap-1">
//               <div>
//                 <span className="font-semibold text-purple-300">additionalFeatureTriggered: </span>
//                 [{allUpgraded.join(", ")}]
//               </div>
//               {effZone && zoneUpgraded && (
//                 <div className="text-sky-300">
//                   zoneSplitter: {effSplitter}
//                   {effMultipliers.length > 0 && <span className="ml-2">zoneMultipliers: [{effMultipliers.join(",")}]</span>}
//                 </div>
//               )}
//             </div>
//           )}

//           {/* LEGEND */}
//           <div className="text-xs text-gray-400 flex flex-wrap gap-3">
//             {effStrike && <span>🪽🟡🪽 = winged — click to toggle{!config.hasStrike ? " (via upgrade)" : ""}</span>}
//             {effSplit  && <span>Split × N = N copies{!config.hasSplit ? " (via upgrade)" : ""}</span>}
//             {effZone   && <span>Background = zone (splitter {effSplitter}){zoneUpgraded ? " (via upgrade)" : ""}</span>}
//             {effExtra  && !config.hasExtra && <span className="text-emerald-400">+1 spin from Extra upgrade</span>}
//             <span className="text-yellow-400/60">⚙ Upgrade settings don&apos;t cost spins — only SPIN does</span>
//           </div>

//         </div>
//       )}
//     </div>
//   );
// }








// /* eslint-disable @typescript-eslint/no-explicit-any */
// "use client";

// import { useState, useRef } from "react";
// import {
//   ComboCoin, ComboFeatureConfig,
//   getComboMaxSpins, getComboCoinColors,
//   generateCombinationGaffe, resolveUpgradeFeatures, UpgradeInfo,
//   ALL_UPGRADE_FEATURES,
// } from "./combinationFeatureGenerator";
// import { ZONE_BG_CLASS, ZONE_BORDER_CLASS, getZoneBgColor } from "../zone/zoneFeatureGenerator";
// import { STRIKE_BOOST_VALUES } from "../strike/strikeFeatureGenerator";
// import { SPLIT_COUNT_OPTIONS, SPLIT_BOOST_VALUES } from "../split/splitFeatureGenerator";

// // ── Constants ─────────────────────────────────────────────────────────────────
// const COMBO_COIN_VALUES = ["1", "2", "5", "Minor", "Major", "Mini"];
// const ZONE_SPLITTER_OPTIONS = [1, 2, 3, 4, 5];

// const FEATURE_BADGE: Record<string, string> = {
//   extra:  "bg-emerald-900 text-emerald-300 border border-emerald-600",
//   zone:   "bg-sky-900 text-sky-300 border border-sky-600",
//   strike: "bg-orange-900 text-orange-300 border border-orange-600",
//   split:  "bg-pink-900 text-pink-300 border border-pink-600",
// };

// // ── Props ─────────────────────────────────────────────────────────────────────
// type Props = {
//   baseCoins:          ComboCoin[];
//   config:             ComboFeatureConfig;
//   pendingUpgradeInfo: UpgradeInfo | null;
//   onSpin:             (snapshot: ComboCoin[], line: string) => void;
//   onReset:            () => void;
//   onUpgrade:          (newFeatures: string[], carryCoins: ComboCoin[], upgradeInfo: UpgradeInfo) => void;
// };

// // ── Component ─────────────────────────────────────────────────────────────────
// export default function CombinationFeature({
//   baseCoins, config, pendingUpgradeInfo, onSpin, onReset, onUpgrade,
// }: Props) {
//   const MAX_SPINS   = getComboMaxSpins(config);
//   const coinColors  = getComboCoinColors(config.features);
//   const defaultCode = coinColors[0].value;

//   const [isOpen,    setIsOpen]    = useState(true);
//   const initialSeeds = baseCoins.map((c) => ({
//     ...c,
//     fromBase: true,
//     wingedCopyIdx: c.wingedCopyIdx !== undefined
//       ? c.wingedCopyIdx
//       : (config.hasStrike && c.winged ? 0 : undefined),
//     splitBoostValues: c.splitBoostValues
//       ?? (config.hasStrike && c.winged && c.boostValue ? [c.boostValue] : undefined),
//   }));
//   const [coins,     setCoins]     = useState<ComboCoin[]>(initialSeeds);
//   const [spinsLeft, setSpinsLeft] = useState(MAX_SPINS);
//   const lastSpinPositions = useRef<Set<number>>(new Set(initialSeeds.map((c) => c.position)));

//   // Upgrade state
//   const [upgradePos,          setUpgradePos]          = useState<number | null>(null);
//   const [upgradeFeatSel,      setUpgradeFeatSel]      = useState<string>("");
//   const [upgradeMultiSel,     setUpgradeMultiSel]     = useState<Set<string>>(new Set());
//   const [upgradeZoneSplitter, setUpgradeZoneSplitter] = useState<string>("");
//   const [upgradeZoneMultiRaw, setUpgradeZoneMultiRaw] = useState<string>("");

//   const coinAt = (pos: number) => coins.find((c) => c.position === pos);

//   // ── Coin operations ──────────────────────────────────────────────────────
//   const handleCellClick = (pos: number) => {
//     if (coinAt(pos)) return;
//     setCoins((prev) => [...prev, {
//       position: pos, colorCode: defaultCode, value: COMBO_COIN_VALUES[0],
//       winged: false, splitCount: 1,
//     }]);
//   };

//   const removeCoin = (pos: number) => {
//     const c = coinAt(pos);
//     if (!c || c.fromBase) return;
//     if (upgradePos === pos) resetUpgrade();
//     setCoins((prev) => prev.filter((x) => x.position !== pos));
//   };

//   const updateCoin = (pos: number, field: keyof ComboCoin, val: any) =>
//     setCoins((prev) => prev.map((c) => c.position === pos ? { ...c, [field]: val } : c));

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
//       return { ...c, splitCopyValues: arr, value: copyIdx === 0 ? val : c.value };
//     }));

//   // Select which copy index is the winged one (radio — only one per coin).
//   // Clicking the same copy again deselects.
//   const selectWingedCopy = (pos: number, copyIdx: number) =>
//     setCoins((prev) => prev.map((c) => {
//       if (c.position !== pos) return c;
//       const already = c.wingedCopyIdx === copyIdx;
//       return { ...c, wingedCopyIdx: already ? undefined : copyIdx };
//     }));

//   // ── Upgrade radio ─────────────────────────────────────────────────────────
//   const resetUpgrade = () => {
//     setUpgradePos(null); setUpgradeFeatSel(""); setUpgradeMultiSel(new Set());
//     setUpgradeZoneSplitter(""); setUpgradeZoneMultiRaw("");
//   };

//   const handleUpgradeRadio = (pos: number) => {
//     if (upgradePos === pos) { resetUpgrade(); return; }
//     setUpgradePos(pos); setUpgradeFeatSel(""); setUpgradeMultiSel(new Set());
//     setUpgradeZoneSplitter(""); setUpgradeZoneMultiRaw("");
//   };

//   const upgradeCoin = upgradePos !== null ? coinAt(upgradePos) : null;

//   // Is the selected coin an All-Color coin?
//   const allColorEntry = coinColors.find((c) =>
//     c.label.toLowerCase().includes("all-color") || c.label.toLowerCase().includes("all color")
//   );
//   const isAllColor = !!(upgradeCoin && allColorEntry && upgradeCoin.colorCode === allColorEntry.value);

//   // Gold coins have no upgrade
//   const goldCodes = new Set(
//     coinColors.filter((c) => c.label.toLowerCase().includes("gold")).map((c) => c.value)
//   );

//   const activeFeaturesUpper = config.features.map((f) => f.toUpperCase());

//   const upgradeOptions: string[] = (() => {
//     if (!upgradeCoin) return [];
//     if (goldCodes.has(upgradeCoin.colorCode)) return [];
//     if (isAllColor) return ALL_UPGRADE_FEATURES.filter((f) => !activeFeaturesUpper.includes(f));
//     const label = coinColors.find((c) => c.value === upgradeCoin.colorCode)?.label ?? "";
//     return resolveUpgradeFeatures(label).filter((f) => !activeFeaturesUpper.includes(f));
//   })();

//   const toggleMulti = (f: string) =>
//     setUpgradeMultiSel((prev) => {
//       const next = new Set(prev);
//       if (next.has(f)) next.delete(f); else next.add(f);
//       return next;
//     });

//   const selectedUpgradeFeats: string[] = isAllColor
//     ? Array.from(upgradeMultiSel)
//     : upgradeFeatSel ? [upgradeFeatSel] : [];

//   // Navigate immediately when upgrade feature selected
//   const navigateComboUpgrade = (feats: string[]) => {
//     if (upgradePos === null || feats.length === 0) return;
//     const hasZone = feats.map((f) => f.toUpperCase()).includes("ZONE");
//     const upgradeInfo: UpgradeInfo = {
//       col: Math.floor(upgradePos / 3),
//       row: upgradePos % 3,
//       features: feats,
//       ...(hasZone && upgradeZoneSplitter ? { zoneSplitter: Number(upgradeZoneSplitter) } : {}),
//       ...(hasZone && upgradeZoneMultiRaw ? {
//         zoneMultipliers: upgradeZoneMultiRaw.split(",").map((n) => n.trim()).filter(Boolean).map(Number),
//       } : {}),
//     };
//     const newFeatures = [...new Set([...config.features, ...feats.map((f) => f.toLowerCase())])];
//     onUpgrade(newFeatures, coins, upgradeInfo);
//   };

//   // ── Spin ──────────────────────────────────────────────────────────────────
//   const handleSpin = () => {
//     if (spinsLeft <= 0) return;
//     const cur = new Set(coins.map((c) => c.position));
//     const hasNew = [...cur].some((p) => !lastSpinPositions.current.has(p));
//     // Upgrade spin always resets to MAX
//     const nextSpins = pendingUpgradeInfo ? MAX_SPINS : (hasNew ? MAX_SPINS : spinsLeft - 1);
//     setSpinsLeft(nextSpins);
//     lastSpinPositions.current = cur;
//     const line = generateCombinationGaffe(coins, config, pendingUpgradeInfo ?? null);
//     onSpin(coins, line);
//   };

//   const resetFeature = () => {
//     const seeded = baseCoins.map((c) => ({
//       ...c,
//       fromBase: true,
//       wingedCopyIdx: c.wingedCopyIdx !== undefined
//         ? c.wingedCopyIdx
//         : (config.hasStrike && c.winged ? 0 : undefined),
//       splitBoostValues: c.splitBoostValues
//         ?? (config.hasStrike && c.winged && c.boostValue ? [c.boostValue] : undefined),
//     }));
//     setCoins(seeded);
//     setSpinsLeft(MAX_SPINS);
//     lastSpinPositions.current = new Set(seeded.map((c) => c.position));
//     resetUpgrade();
//     onReset();
//   };

//   const activeSplitter = config.hasZone ? (config.splitter ?? 1) : 0;

//   return (
//     <div className="bg-gray-800 rounded-xl border border-indigo-800">

//       {/* HEADER */}
//       <div onClick={() => setIsOpen(!isOpen)} className="flex justify-between items-center p-4 cursor-pointer select-none">
//         <div className="flex items-center gap-2 flex-wrap">
//           <h2 className="text-lg font-semibold text-white">⚡ Combination Feature</h2>
//           {config.features.map((name) => (
//             <span key={name} className={`text-xs px-2 py-0.5 rounded capitalize ${FEATURE_BADGE[name] ?? "bg-gray-700 text-gray-300"}`}>
//               {name}
//             </span>
//           ))}
//           {config.hasZone && config.splitter && (
//             <span className="text-xs px-2 py-0.5 rounded bg-sky-900 text-sky-300 border border-sky-700">
//               Splitter {config.splitter}
//             </span>
//           )}
//           {pendingUpgradeInfo && (
//             <span className="text-xs px-2 py-0.5 rounded bg-yellow-900 text-yellow-300 border border-yellow-700 animate-pulse">
//               ✦ upgrade pending — SPIN to confirm
//             </span>
//           )}
//         </div>
//         <span className="text-gray-400">{isOpen ? "▼" : "▶"}</span>
//       </div>

//       {isOpen && (
//         <div className="p-4 pt-0 flex flex-col gap-3">

//           {/* SPIN CONTROLS */}
//           <div className="flex items-center gap-3 flex-wrap">
//             <button
//               onClick={handleSpin} disabled={spinsLeft <= 0}
//               className={`px-6 py-2 rounded font-bold text-white transition-all ${
//                 spinsLeft > 0 ? "bg-indigo-600 hover:bg-indigo-500" : "bg-gray-600 cursor-not-allowed opacity-50"
//               }`}
//             >
//               SPIN
//             </button>
//             <span className="text-sm text-gray-400">
//               {spinsLeft} spin{spinsLeft !== 1 ? "s" : ""}
//               {config.hasExtra && <span className="ml-1 text-emerald-400 text-xs">(4 — Extra)</span>}
//             </span>
//             <button onClick={resetFeature} className="px-3 py-1 bg-gray-600 hover:bg-gray-500 rounded text-sm">Reset</button>
//           </div>

//           {/* UPGRADE PANEL — shown when a coin's radio is selected */}
//           {upgradePos !== null && upgradeOptions.length > 0 && (
//             <div className="flex flex-col gap-2 bg-yellow-900/20 border border-yellow-800 rounded-lg p-3">
//               <span className="text-yellow-300 text-xs font-bold">
//                 ✦ Upgrade at position {upgradePos} — select feature to add (navigates immediately):
//               </span>

//               {isAllColor ? (
//                 // All-Color: multi-select checkboxes
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
//                   {/* Show zone params if ZONE is checked */}
//                   {upgradeMultiSel.has("ZONE") && (
//                     <div className="flex gap-3 flex-wrap items-center bg-sky-900/30 border border-sky-800 rounded p-2">
//                       <span className="text-sky-300 text-[10px]">Zone params:</span>
//                       <div className="flex items-center gap-1">
//                         <span className="text-[10px] text-sky-300">Splitter</span>
//                         <select className="bg-sky-950 text-sky-200 text-xs rounded px-1 py-0.5 border border-sky-700"
//                           value={upgradeZoneSplitter} onChange={(e) => setUpgradeZoneSplitter(e.target.value)}>
//                           <option value="">--</option>
//                           {ZONE_SPLITTER_OPTIONS.map((v) => <option key={v} value={v}>{v}</option>)}
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
//                     <button onClick={() => navigateComboUpgrade(Array.from(upgradeMultiSel))}
//                       className="self-start px-3 py-1 bg-yellow-600 hover:bg-yellow-500 rounded text-xs font-bold transition-all">
//                       → Go to {[...config.features, ...Array.from(upgradeMultiSel).map((f) => f.toLowerCase())]
//                         .filter((v, i, a) => a.indexOf(v) === i).join(" + ")}
//                     </button>
//                   )}
//                 </div>
//               ) : (
//                 // Single-color: direct navigate buttons (zone shows params first)
//                 <div className="flex flex-col gap-2">
//                   <div className="flex gap-2 flex-wrap">
//                     {upgradeOptions.filter((f) => f !== "ZONE").map((f) => (
//                       <button key={f} onClick={() => navigateComboUpgrade([f])}
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
//                             {ZONE_SPLITTER_OPTIONS.map((v) => <option key={v} value={v}>{v}</option>)}
//                           </select>
//                         </div>
//                         <div className="flex items-center gap-1">
//                           <span className="text-[10px] text-sky-300">Multipliers</span>
//                           <input type="text" placeholder="e.g. 2,3" value={upgradeZoneMultiRaw}
//                             onChange={(e) => setUpgradeZoneMultiRaw(e.target.value)}
//                             className="bg-sky-950 text-sky-200 text-xs rounded px-1 py-0.5 border border-sky-700 w-20" />
//                         </div>
//                       </div>
//                       <button onClick={() => navigateComboUpgrade(["ZONE"])}
//                         className="self-start px-3 py-1 bg-sky-700 hover:bg-sky-600 border border-sky-500 rounded text-xs font-bold transition-all">
//                         → Go to {[...config.features, "zone"].join(" + ")}
//                       </button>
//                     </div>
//                   )}
//                 </div>
//               )}
//             </div>
//           )}

//           {upgradePos !== null && upgradeOptions.length === 0 && (
//             <div className="text-xs text-gray-500 bg-gray-700 px-3 py-1.5 rounded">
//               ℹ No upgrades available (all features already active or Gold coin)
//             </div>
//           )}

//           {/* GRID — 5 cols × 3 rows, column-major */}
//           <div className="grid gap-1" style={{ gridTemplateColumns: "repeat(5, minmax(0, 1fr))" }}>
//             {Array.from({ length: 3 }).map((_, row) =>
//               Array.from({ length: 5 }).map((_, col) => {
//                 const pos  = col * 3 + row;
//                 const coin = coinAt(pos);

//                 const zoneBg  = config.hasZone ? getZoneBgColor(pos, activeSplitter) : null;
//                 const cellBg  = zoneBg
//                   ? `${ZONE_BG_CLASS[zoneBg]} ${ZONE_BORDER_CLASS[zoneBg]}`
//                   : "bg-gray-700 border-gray-600";
//                 const hoverCls = !coin && !config.hasZone ? "hover:bg-gray-600 hover:border-gray-400" : "";

//                 return (
//                   <div key={pos} className="flex flex-col gap-1">
//                     <div
//                       onClick={() => !coin && handleCellClick(pos)}
//                       className={`relative rounded-lg border-2 flex flex-col items-start p-1 text-xs text-white cursor-pointer transition-all hover:brightness-110 ${cellBg} ${hoverCls} ${upgradePos === pos ? "ring-2 ring-yellow-400" : ""}`}
//                       style={{ minHeight: 100 }}
//                     >
//                       <div className="text-[9px] opacity-40 mb-0.5">{pos}</div>

//                       {coin ? (
//                         <div className="flex flex-col items-center w-full gap-0.5">

//                           {/* Winged toggle — only in Strike combo */}
//                           {config.hasStrike ? (
//                             <div className="flex flex-col items-center w-full gap-0.5">
//                               <div className="text-sm leading-none">
//                                 {coin.wingedCopyIdx === 0 ? "🪽🟡🪽" : "🟡"}
//                               </div>
//                               {config.hasSplit ? (
//                                 /* Split present: use radio (one copy is winged) */
//                                 <div className="flex items-center gap-1 w-full" onClick={(e) => e.stopPropagation()}>
//                                   <input
//                                     type="radio"
//                                     name={`winged-${pos}`}
//                                     className="accent-yellow-400 w-2.5 h-2.5 cursor-pointer"
//                                     checked={coin.wingedCopyIdx === 0}
//                                     onChange={() => selectWingedCopy(pos, 0)}
//                                   />
//                                   <span className="text-[8px] text-yellow-300">winged</span>
//                                 </div>
//                               ) : (
//                                 /* No Split: simple checkbox toggle */
//                                 <div className="flex items-center gap-1 w-full" onClick={(e) => e.stopPropagation()}>
//                                   <input
//                                     type="checkbox"
//                                     className="accent-yellow-400 w-2.5 h-2.5 cursor-pointer"
//                                     checked={coin.wingedCopyIdx === 0}
//                                     onChange={(e) => {
//                                       setCoins((prev) => prev.map((c) =>
//                                         c.position === pos
//                                           ? { ...c, wingedCopyIdx: e.target.checked ? 0 : undefined }
//                                           : c
//                                       ));
//                                     }}
//                                   />
//                                   <span className="text-[8px] text-yellow-300">winged</span>
//                                 </div>
//                               )}
//                             </div>
//                           ) : (
//                             <div className="text-sm">🟡</div>
//                           )}

//                           {/* Color */}
//                           <select
//                             className="bg-gray-800 text-white text-[9px] w-full rounded px-0.5 py-0.5 border-0"
//                             value={coin.colorCode}
//                             onClick={(e) => e.stopPropagation()}
//                             onChange={(e) => {
//                               updateCoin(pos, "colorCode", Number(e.target.value));
//                               if (upgradePos === pos) resetUpgrade();
//                             }}
//                           >
//                             {coinColors.map((c) => (
//                               <option key={c.value} value={c.value} className="bg-gray-800">{c.label}</option>
//                             ))}
//                           </select>

//                           {/* Value (copy 0) */}
//                           <select
//                             className="bg-gray-800 text-white text-[9px] w-full rounded px-0.5 py-0.5 border-0"
//                             value={coin.splitCopyValues?.[0] ?? coin.value}
//                             onClick={(e) => e.stopPropagation()}
//                             onChange={(e) => updateSplitCopyValue(pos, 0, e.target.value)}
//                           >
//                             {COMBO_COIN_VALUES.map((v) => (
//                               <option key={v} value={v} className="bg-gray-800">{v}</option>
//                             ))}
//                           </select>

//                           {/* Boost — only shown when copy 0 is the winged copy */}
//                           {config.hasStrike && coin.wingedCopyIdx === 0 && (
//                             <select
//                               className="bg-yellow-700 text-white text-[9px] w-full rounded px-0.5 py-0.5 border-0"
//                               value={coin.splitBoostValues?.[0] ?? coin.boostValue ?? ""}
//                               onClick={(e) => e.stopPropagation()}
//                               onChange={(e) => {
//                                 const v = e.target.value;
//                                 // write to both for compatibility
//                                 setCoins((prev) => prev.map((c) =>
//                                   c.position === pos
//                                     ? { ...c, boostValue: v, splitBoostValues: Object.assign([], c.splitBoostValues, { 0: v }) }
//                                     : c
//                                 ));
//                               }}
//                             >
//                               <option value="" className="bg-gray-800">Boost</option>
//                               {STRIKE_BOOST_VALUES.map((v) => (
//                                 <option key={v} value={v} className="bg-gray-800">{v}</option>
//                               ))}
//                             </select>
//                           )}

//                           {/* Split count */}
//                           {config.hasSplit && (
//                             <select
//                               className="bg-pink-700 text-white text-[9px] w-full rounded px-0.5 py-0.5 border-0"
//                               value={coin.splitCount ?? 1}
//                               onClick={(e) => e.stopPropagation()}
//                               onChange={(e) => {
//                                 const sc = Number(e.target.value);
//                                 updateCoin(pos, "splitCount", sc);
//                                 if (sc <= 1) {
//                                   updateCoin(pos, "splitBoostValues" as any, []);
//                                   updateCoin(pos, "splitCopyValues"  as any, []);
//                                 }
//                               }}
//                             >
//                               {SPLIT_COUNT_OPTIONS.map((n) => (
//                                 <option key={n} value={n} className="bg-gray-800">Split × {n}</option>
//                               ))}
//                             </select>
//                           )}

//                           {/* ── UPGRADE RADIO — shown for all coins except gold ── */}
//                           {!goldCodes.has(coin.colorCode) && (
//                             <div className="flex items-center gap-1 mt-0.5 w-full" onClick={(e) => e.stopPropagation()}>
//                               <input
//                                 type="radio"
//                                 name="comboUpgrade"
//                                 className="accent-yellow-400 w-3 h-3 cursor-pointer"
//                                 checked={upgradePos === pos}
//                                 onChange={() => handleUpgradeRadio(pos)}
//                               />
//                               <span className="text-[8px] text-yellow-300">upgrade</span>
//                               {upgradePos === pos && !isAllColor && upgradeFeatSel && (
//                                 <span className="text-[8px] text-yellow-500">→{upgradeFeatSel}</span>
//                               )}
//                               {upgradePos === pos && isAllColor && upgradeMultiSel.size > 0 && (
//                                 <span className="text-[8px] text-yellow-500">→{Array.from(upgradeMultiSel).join("+")}</span>
//                               )}
//                             </div>
//                           )}

//                           {/* Remove — non-base coins only */}
//                           {!coin.fromBase && (
//                             <button
//                               onClick={(e) => { e.stopPropagation(); removeCoin(pos); }}
//                               className="absolute top-1 right-1 text-[10px] text-red-300 hover:text-red-100 font-bold"
//                             >✕</button>
//                           )}
//                         </div>
//                       ) : (
//                         <span className="text-white/40 text-[10px] mx-auto mt-4">+ Add</span>
//                       )}
//                     </div>

//                     {/* Ghost cells for split copies */}
//                     {coin && config.hasSplit && (coin.splitCount ?? 1) > 1 &&
//                       Array.from({ length: (coin.splitCount ?? 1) - 1 }).map((_, idx) => {
//                         const copyIdx  = idx + 1;
//                         const copyVal  = coin.splitCopyValues?.[copyIdx] ?? coin.value;
//                         const isWinged = coin.wingedCopyIdx === copyIdx;
//                         return (
//                           <div key={idx} className={`rounded border border-dashed flex flex-col items-center p-1 min-h-[60px] text-[9px] gap-0.5
//                             ${isWinged ? "border-yellow-400/80 bg-yellow-950/30 text-yellow-100" : "border-pink-400/50 bg-pink-950/30 text-pink-200"}`}>
//                             <div className="opacity-40 self-start">copy {copyIdx}</div>
//                             <div className="text-sm">{isWinged ? "🪽🟡🪽" : "🟡"}</div>
//                             <select
//                               className="text-white text-[9px] w-full rounded bg-pink-900 border-0 mt-0.5"
//                               value={copyVal}
//                               onClick={(e) => e.stopPropagation()}
//                               onChange={(e) => updateSplitCopyValue(pos, copyIdx, e.target.value)}
//                             >
//                               {COMBO_COIN_VALUES.map((v) => (
//                                 <option key={v} value={v} className="bg-gray-800">{v}</option>
//                               ))}
//                             </select>
//                             {config.hasStrike && (
//                               <div className="flex items-center gap-1 w-full mt-0.5" onClick={(e) => e.stopPropagation()}>
//                                 <input
//                                   type="radio"
//                                   name={`winged-${pos}`}
//                                   className="accent-yellow-400 w-2.5 h-2.5 cursor-pointer"
//                                   checked={isWinged}
//                                   onChange={() => selectWingedCopy(pos, copyIdx)}
//                                 />
//                                 <span className="text-[8px] text-yellow-300">winged</span>
//                               </div>
//                             )}
//                             {config.hasStrike && isWinged && (
//                               <select
//                                 className="text-white text-[9px] w-full rounded bg-yellow-800 border-0 mt-0.5"
//                                 value={coin.splitBoostValues?.[copyIdx] ?? ""}
//                                 onClick={(e) => e.stopPropagation()}
//                                 onChange={(e) => updateSplitBoost(pos, copyIdx, e.target.value)}
//                               >
//                                 <option value="" className="bg-gray-800">Boost</option>
//                                 {STRIKE_BOOST_VALUES.map((v) => (
//                                   <option key={v} value={v} className="bg-gray-800">{v}</option>
//                                 ))}
//                               </select>
//                             )}
//                           </div>
//                         );
//                       })
//                     }
//                   </div>
//                 );
//               })
//             )}
//           </div>

//           {/* LEGEND */}
//           <div className="text-[10px] text-gray-500 flex flex-wrap gap-2">
//             <span>🟡 = coin · click empty cell to add · ✕ = remove</span>
//             {config.hasStrike && <span>🪽🟡🪽 = winged — click to toggle</span>}
//             {config.hasSplit  && <span>Split × N = N copies (copy 0…N-1), each has its own value</span>}
//             {config.hasZone   && <span>Background = zone regions (splitter {config.splitter})</span>}
//             <span>✦ radio = upgrade · single-color = 1 feature · All-Color = multi-feature · Gold = no upgrade</span>
//           </div>

//         </div>
//       )}
//     </div>
//   );
// }



//! multiple winged coin in split

//! latest working code
/* eslint-disable @typescript-eslint/no-explicit-any */
// "use client";

// import { useState, useRef } from "react";
// import {
//   ComboCoin,
//   ComboFeatureConfig,
//   CoinColorOption,
//   getComboMaxSpins,
//   getComboCoinColors,
//   getUpgradeFeature,
//   ALL_COLOR_FEATURES,
// } from "./combinationFeatureGenerator";
// import { ZONE_BG_CLASS, ZONE_BORDER_CLASS, getZoneBgColor } from "../zone/zoneFeatureGenerator";
// import { STRIKE_BOOST_VALUES } from "../strike/strikeFeatureGenerator";
// import { SPLIT_COUNT_OPTIONS, SPLIT_BOOST_VALUES, SPLIT_COIN_VALUES } from "../split/splitFeatureGenerator";

// // ── CONSTANTS ─────────────────────────────────────────────────────────────────
// const COIN_VALUES = ["1", "2", "5", "Minor", "Major", "Mini"];

// const FEATURE_BADGE: Record<string, string> = {
//   extra:  "bg-emerald-900 text-emerald-300 border border-emerald-600",
//   zone:   "bg-sky-900 text-sky-300 border border-sky-600",
//   strike: "bg-orange-900 text-orange-300 border border-orange-600",
//   split:  "bg-pink-900 text-pink-300 border border-pink-600",
// };

// const FEATURE_COLORS: Record<string, string> = {
//   extra:  "text-emerald-300",
//   zone:   "text-sky-300",
//   strike: "text-orange-300",
//   split:  "text-pink-300",
// };

// type Props = {
//   baseCoins: ComboCoin[];
//   config:    ComboFeatureConfig;
//   onSpin:    (snapshot: ComboCoin[]) => void;
//   onReset:   () => void;
// };

// // ── Ghost cell for each extra split copy (copyIdx >= 1) ──────────────────────
// function SplitGhost({
//   copyIdx, coin, isStrikeCombo, coinValueOptions,
//   onValueChange, onBoostChange,
// }: {
//   copyIdx:          number;          // 1, 2, or 3
//   coin:             ComboCoin;
//   isStrikeCombo:    boolean;
//   coinValueOptions: string[];
//   onValueChange:    (copyIdx: number, val: string) => void;
//   onBoostChange:    (extraIdx: number, val: string) => void;
// }) {
//   const copyValue = coin.splitCopyValues?.[copyIdx] ?? coin.value;
//   return (
//     <div className="rounded border border-dashed border-pink-400/50 bg-pink-950/30 flex flex-col items-center p-1 gap-0.5 text-[9px] text-pink-200">
//       <span className="opacity-40 self-start">
//         copy {copyIdx} <span className="text-pink-500">(idx {copyIdx})</span>
//       </span>
//       <span className="text-sm leading-none">🟡</span>

//       {/* Per-copy value */}
//       <select
//         className="text-white text-[9px] w-full rounded bg-pink-900 border-0 mt-0.5"
//         value={copyValue}
//         onClick={(e) => e.stopPropagation()}
//         onChange={(e) => onValueChange(copyIdx, e.target.value)}
//       >
//         {coinValueOptions.map((v) => (
//           <option key={v} value={v} className="bg-gray-800">{v}</option>
//         ))}
//       </select>

//       {/* Boost — Strike+Split + winged only */}
//       {isStrikeCombo && coin.winged && (
//         <select
//           className="text-white text-[9px] w-full rounded bg-yellow-800 border-0 mt-0.5"
//           value={coin.splitBoostValues?.[copyIdx - 1] ?? ""}
//           onClick={(e) => e.stopPropagation()}
//           onChange={(e) => onBoostChange(copyIdx - 1, e.target.value)}
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

// // ── Upgrade control shown below each coin ─────────────────────────────────────
// function UpgradeControl({
//   coin, colorLabel, currentFeatures, onToggle, onFeaturesChange,
// }: {
//   coin:            ComboCoin;
//   colorLabel:      string;
//   currentFeatures: string[];   // features already in this combination
//   onToggle:        (upgraded: boolean) => void;
//   onFeaturesChange:(features: string[]) => void;
// }) {
//   const upgradeType = getUpgradeFeature(colorLabel);
//   if (!upgradeType) return null; // gold coin — no upgrade

//   // For a single-color coin, show one checkbox; for all-color, show multi checkboxes
//   const isAllColor = upgradeType === "all";

//   // Features available to upgrade TO (exclude features already in the combo)
//   const availableFeatures = isAllColor
//     ? ALL_COLOR_FEATURES.filter((f) => !currentFeatures.includes(f))
//     : [upgradeType].filter((f) => !currentFeatures.includes(f));

//   if (availableFeatures.length === 0) return null; // all features already active

//   return (
//     <div
//       className="mt-1 pt-1 border-t border-white/10"
//       onClick={(e) => e.stopPropagation()}
//     >
//       <div className="flex items-center gap-1 flex-wrap">
//         <span className="text-[8px] text-gray-400 font-medium">Upgrade:</span>

//         {isAllColor ? (
//           // All-color: one checkbox per available feature
//           availableFeatures.map((feat) => {
//             const checked = coin.upgraded && (coin.upgradeFeatures ?? []).includes(feat);
//             return (
//               <label
//                 key={feat}
//                 className="flex items-center gap-0.5 cursor-pointer"
//                 onClick={(e) => e.stopPropagation()}
//               >
//                 <input
//                   type="checkbox"
//                   checked={!!checked}
//                   onChange={(e) => {
//                     e.stopPropagation();
//                     const current = coin.upgradeFeatures ?? [];
//                     const next = e.target.checked
//                       ? [...current, feat]
//                       : current.filter((f) => f !== feat);
//                     onFeaturesChange(next);
//                     onToggle(next.length > 0);
//                   }}
//                   className="w-2.5 h-2.5 accent-purple-500"
//                 />
//                 <span className={`text-[8px] capitalize ${FEATURE_COLORS[feat] ?? "text-gray-300"}`}>
//                   {feat}
//                 </span>
//               </label>
//             );
//           })
//         ) : (
//           // Single feature: one toggle radio/checkbox
//           <label
//             className="flex items-center gap-1 cursor-pointer"
//             onClick={(e) => e.stopPropagation()}
//           >
//             <input
//               type="checkbox"
//               checked={!!coin.upgraded}
//               onChange={(e) => {
//                 e.stopPropagation();
//                 onToggle(e.target.checked);
//                 if (!e.target.checked) onFeaturesChange([]);
//                 else onFeaturesChange([upgradeType]);
//               }}
//               className="w-2.5 h-2.5 accent-purple-500"
//             />
//             <span className={`text-[8px] capitalize ${FEATURE_COLORS[availableFeatures[0]] ?? "text-gray-300"}`}>
//               → {availableFeatures[0]}
//             </span>
//           </label>
//         )}
//       </div>
//     </div>
//   );
// }

// // ── Main component ─────────────────────────────────────────────────────────────
// export default function CombinationFeature({ baseCoins, config, onSpin, onReset }: Props) {
//   const MAX_SPINS   = getComboMaxSpins(config);
//   const coinColors  = getComboCoinColors(config.features);
//   const defaultCode = coinColors[0].value;

//   const [isOpen,    setIsOpen]    = useState(true);
//   const initialSeeds = baseCoins.map((c) => ({ ...c, fromBase: true }));
//   const [coins,     setCoins]     = useState<ComboCoin[]>(initialSeeds);
//   const [spinsLeft, setSpinsLeft] = useState(MAX_SPINS);
//   const lastSpinPositions = useRef<Set<number>>(new Set(initialSeeds.map((c) => c.position)));

//   const coinAt = (pos: number) => coins.find((c) => c.position === pos);

//   const handleCellClick = (pos: number) => {
//     if (coinAt(pos)) return;
//     setCoins((prev) => [
//       ...prev,
//       { position: pos, colorCode: defaultCode, value: COIN_VALUES[0], winged: false, splitCount: 1 },
//     ]);
//   };

//   const removeCoin = (pos: number) => {
//     const c = coinAt(pos);
//     if (!c || c.fromBase) return;
//     setCoins((prev) => prev.filter((x) => x.position !== pos));
//   };

//   const updateCoin = (pos: number, field: keyof ComboCoin, val: any) =>
//     setCoins((prev) => prev.map((c) => c.position === pos ? { ...c, [field]: val } : c));

//   // Per-copy value override
//   const updateCopyValue = (pos: number, copyIdx: number, val: string) =>
//     setCoins((prev) => prev.map((c) => {
//       if (c.position !== pos) return c;
//       const arr = [...(c.splitCopyValues ?? [])];
//       arr[copyIdx] = val;
//       return { ...c, splitCopyValues: arr };
//     }));

//   const updateSplitBoost = (pos: number, idx: number, val: string) =>
//     setCoins((prev) => prev.map((c) => {
//       if (c.position !== pos) return c;
//       const arr = [...(c.splitBoostValues ?? [])];
//       arr[idx] = val;
//       return { ...c, splitBoostValues: arr };
//     }));

//   const toggleWinged = (pos: number, e: React.MouseEvent) => {
//     e.stopPropagation();
//     const c = coinAt(pos);
//     if (!c) return;
//     setCoins((prev) => prev.map((x) =>
//       x.position === pos
//         ? { ...x, winged: !x.winged, boostValue: x.winged ? undefined : x.boostValue }
//         : x
//     ));
//   };

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
//     onReset();
//   };

//   const activeSplitter = config.hasZone ? (config.splitter ?? 1) : 0;

//   // Compute which additional features have been selected across all coins
//   const upgradedFeatures: string[] = [];
//   coins.forEach((c) => {
//     if (!c.upgraded) return;
//     const label = coinColors.find((o) => o.value === c.colorCode)?.label ?? "";
//     const upgradeType = getUpgradeFeature(label);
//     if (upgradeType === "all") {
//       (c.upgradeFeatures ?? []).forEach((f) => {
//         if (!upgradedFeatures.includes(f)) upgradedFeatures.push(f);
//       });
//     } else if (upgradeType && !upgradedFeatures.includes(upgradeType)) {
//       upgradedFeatures.push(upgradeType);
//     }
//   });

//   // Value options: combine standard + split values for split combos
//   const coinValueOptions = config.hasSplit
//     ? [...new Set([...COIN_VALUES, ...SPLIT_COIN_VALUES])]
//     : COIN_VALUES;

//   return (
//     <div className="bg-gray-800 rounded-xl">

//       {/* ── HEADER ── */}
//       <div onClick={() => setIsOpen(!isOpen)} className="flex justify-between items-center p-4 cursor-pointer">
//         <div className="flex items-center gap-2 flex-wrap">
//           <h2 className="text-lg font-semibold text-white">⚡ Combination Feature</h2>
//           {config.features.map((name) => (
//             <span key={name} className={`text-xs px-2 py-0.5 rounded capitalize ${FEATURE_BADGE[name] ?? "bg-gray-700 text-gray-300"}`}>
//               {name}
//             </span>
//           ))}
//           {config.hasZone && config.splitter && (
//             <span className="text-xs px-2 py-0.5 rounded bg-sky-900 text-sky-300 border border-sky-700">
//               Splitter {config.splitter}
//             </span>
//           )}
//           {/* Upgrade summary badge */}
//           {upgradedFeatures.length > 0 && (
//             <span className="text-xs px-2 py-0.5 rounded bg-purple-900 text-purple-300 border border-purple-600">
//               ↑ {upgradedFeatures.join(", ")}
//             </span>
//           )}
//         </div>
//         <span className="text-white">{isOpen ? "▼" : "▶"}</span>
//       </div>

//       {isOpen && (
//         <div className="p-6 pt-0 flex flex-col gap-4">

//           {/* ── SPIN CONTROLS ── */}
//           <div className="flex items-center gap-4 flex-wrap">
//             <button
//               onClick={handleSpin}
//               disabled={spinsLeft <= 0}
//               className={`px-6 py-2 rounded font-bold text-white transition-all ${
//                 spinsLeft > 0 ? "bg-purple-600 hover:bg-purple-500" : "bg-gray-600 cursor-not-allowed opacity-50"
//               }`}
//             >
//               SPIN
//             </button>
//             <span className="text-sm text-gray-300">
//               {spinsLeft} spin{spinsLeft !== 1 ? "s" : ""} left
//             </span>
//             <button onClick={resetFeature} className="px-3 py-1 bg-gray-600 hover:bg-gray-500 rounded text-sm">
//               Reset
//             </button>
//           </div>

//           {/* ── GRID ── */}
//           <div className="grid gap-1" style={{ gridTemplateColumns: "repeat(5, minmax(0, 1fr))" }}>
//             {Array.from({ length: 3 }).map((_, row) =>
//               Array.from({ length: 5 }).map((_, col) => {
//                 const pos  = col * 3 + row;
//                 const coin = coinAt(pos);
//                 const zoneBg  = config.hasZone ? getZoneBgColor(pos, activeSplitter) : null;
//                 const cellBg  = zoneBg
//                   ? `${ZONE_BG_CLASS[zoneBg]} ${ZONE_BORDER_CLASS[zoneBg]}`
//                   : "bg-gray-700 border-gray-600";

//                 // Determine color label for this coin (for upgrade logic)
//                 const colorLabel = coin
//                   ? (coinColors.find((o) => o.value === coin.colorCode)?.label ?? "")
//                   : "";
//                 const isGold = colorLabel.toLowerCase().includes("gold");

//                 return (
//                   <div key={pos} className="flex flex-col gap-1">

//                     {/* ── PRIMARY CELL (copy 0) ── */}
//                     <div
//                       onClick={() => !coin && handleCellClick(pos)}
//                       className={`relative rounded-lg border-2 flex flex-col items-center justify-center p-1 min-h-[110px] text-xs text-white cursor-pointer transition-all hover:brightness-110 ${cellBg}
//                         ${!coin && !config.hasZone ? "hover:bg-gray-600 hover:border-gray-400" : ""}
//                         ${coin && config.hasSplit ? "border-pink-500/60" : ""}
//                       `}
//                     >
//                       {/* Position index */}
//                       <div className="text-[8px] opacity-40 absolute top-1 left-1">{pos}</div>
//                       {/* Copy-0 tag */}
//                       {coin && (
//                         <div className="text-[8px] opacity-40 absolute top-1 right-5 text-pink-300">
//                           copy 0
//                         </div>
//                       )}

//                       {coin ? (
//                         <div className="flex flex-col items-center w-full gap-1 mt-3 px-0.5">

//                           {/* Winged toggle */}
//                           {config.hasStrike ? (
//                             <button
//                               onClick={(e) => toggleWinged(pos, e)}
//                               title="Toggle winged / plain"
//                               className={`text-sm leading-none px-1 py-0.5 rounded transition-all ${
//                                 coin.winged
//                                   ? "bg-yellow-500/20 text-yellow-200 ring-1 ring-yellow-400"
//                                   : "text-yellow-300 hover:bg-yellow-500/10"
//                               }`}
//                             >
//                               {coin.winged ? "🪽🟡🪽" : "🟡"}
//                             </button>
//                           ) : (
//                             <div className="text-base leading-none">🟡</div>
//                           )}

//                           {/* Color */}
//                           <select
//                             className="text-white text-[10px] w-full rounded px-0.5 py-0.5 bg-gray-600 border-0"
//                             value={coin.colorCode}
//                             onClick={(e) => e.stopPropagation()}
//                             onChange={(e) => {
//                               updateCoin(pos, "colorCode", Number(e.target.value));
//                               // reset upgrade state when color changes
//                               updateCoin(pos, "upgraded" as any, false);
//                               updateCoin(pos, "upgradeFeatures" as any, []);
//                             }}
//                           >
//                             {coinColors.map((c) => (
//                               <option key={c.value} value={c.value} className="bg-gray-800">{c.label}</option>
//                             ))}
//                           </select>

//                           {/* Value (copy 0) */}
//                           <select
//                             className="text-white text-[10px] w-full rounded px-0.5 py-0.5 bg-gray-600 border-0"
//                             value={coin.splitCopyValues?.[0] ?? coin.value}
//                             onClick={(e) => e.stopPropagation()}
//                             onChange={(e) => {
//                               updateCopyValue(pos, 0, e.target.value);
//                               updateCoin(pos, "value", e.target.value);
//                             }}
//                           >
//                             {coinValueOptions.map((v) => (
//                               <option key={v} value={v} className="bg-gray-800">{v}</option>
//                             ))}
//                           </select>

//                           {/* Boost (copy 0) — Strike + winged */}
//                           {config.hasStrike && coin.winged && (
//                             <select
//                               className="text-white text-[10px] w-full rounded px-0.5 py-0.5 bg-yellow-700 border-0"
//                               value={coin.boostValue ?? ""}
//                               onClick={(e) => e.stopPropagation()}
//                               onChange={(e) => updateCoin(pos, "boostValue", e.target.value)}
//                             >
//                               <option value="" className="bg-gray-800">Boost (copy 0)</option>
//                               {STRIKE_BOOST_VALUES.map((v) => (
//                                 <option key={v} value={v} className="bg-gray-800">{v}</option>
//                               ))}
//                             </select>
//                           )}

//                           {/* Split count */}
//                           {config.hasSplit && (
//                             <select
//                               className="text-white text-[10px] w-full rounded px-0.5 py-0.5 bg-pink-700 border-0"
//                               value={coin.splitCount ?? 1}
//                               onClick={(e) => e.stopPropagation()}
//                               onChange={(e) => {
//                                 const sc = Number(e.target.value);
//                                 updateCoin(pos, "splitCount", sc);
//                                 if (sc <= 1) {
//                                   updateCoin(pos, "splitBoostValues" as any, []);
//                                   updateCoin(pos, "splitCopyValues"  as any, []);
//                                 }
//                               }}
//                             >
//                               {SPLIT_COUNT_OPTIONS.map((n) => (
//                                 <option key={n} value={n} className="bg-gray-800">Split × {n}</option>
//                               ))}
//                             </select>
//                           )}

//                           {/* ── UPGRADE CONTROL (hidden for gold coins) ── */}
//                           {!isGold && (
//                             <UpgradeControl
//                               coin={coin}
//                               colorLabel={colorLabel}
//                               currentFeatures={config.features}
//                               onToggle={(upgraded) => updateCoin(pos, "upgraded" as any, upgraded)}
//                               onFeaturesChange={(feats) => updateCoin(pos, "upgradeFeatures" as any, feats)}
//                             />
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
//                         <span className="text-white/40 text-[10px]">+ Add</span>
//                       )}
//                     </div>

//                     {/* ── GHOST CELLS for extra split copies ── */}
//                     {coin && config.hasSplit && (coin.splitCount ?? 1) > 1 &&
//                       Array.from({ length: (coin.splitCount ?? 1) - 1 }).map((_, i) => {
//                         const copyIdx = i + 1;
//                         return (
//                           <SplitGhost
//                             key={copyIdx}
//                             copyIdx={copyIdx}
//                             coin={coin}
//                             isStrikeCombo={config.hasStrike}
//                             coinValueOptions={coinValueOptions}
//                             onValueChange={(ci, v) => updateCopyValue(pos, ci, v)}
//                             onBoostChange={(ei, v) => updateSplitBoost(pos, ei, v)}
//                           />
//                         );
//                       })
//                     }

//                   </div>
//                 );
//               })
//             )}
//           </div>

//           {/* ── UPGRADE SUMMARY ── */}
//           {upgradedFeatures.length > 0 && (
//             <div className="text-xs bg-purple-950/50 border border-purple-700 rounded px-3 py-2 text-purple-200">
//               <span className="font-semibold text-purple-300">additionalFeatureTriggered: </span>
//               [{upgradedFeatures.join(", ")}]
//             </div>
//           )}

//           {/* ── LEGEND ── */}
//           <div className="text-xs text-gray-400 flex flex-wrap gap-3">
//             {config.hasStrike && <span>🪽🟡🪽 = winged — click to toggle</span>}
//             {config.hasSplit  && <span>Split × N = N copies (copy 0…N-1), each has its own value</span>}
//             {config.hasZone   && <span>Background = zone (splitter {config.splitter})</span>}
//             <span>Upgrade checkbox appears below non-gold coins</span>
//             <span>Click empty cell to add coin</span>
//           </div>

//         </div>
//       )}
//     </div>
//   );
// }


//!working
// /* eslint-disable @typescript-eslint/no-explicit-any */
// "use client";

// import { useState, useRef, useMemo } from "react";
// import {
//   ComboCoin, ComboFeatureConfig, CoinColorOption,
//   getComboCoinColors, getUpgradeType, ALL_COLOR_UPGRADE_FEATURES,
//   getComboMaxSpins, generateCombinationGaffe,
// } from "./combinationFeatureGenerator";
// import { ZONE_BG_CLASS, ZONE_BORDER_CLASS, getZoneBgColor } from "../zone/zoneFeatureGenerator";
// import { STRIKE_BOOST_VALUES } from "../strike/strikeFeatureGenerator";
// import { SPLIT_COUNT_OPTIONS, SPLIT_BOOST_VALUES, SPLIT_COIN_VALUES } from "../split/splitFeatureGenerator";

// // ── Constants ─────────────────────────────────────────────────────────────────
// const COIN_VALUES = ["1", "2", "5", "Minor", "Major", "Mini"];
// const ZONE_SPLITTER_OPTIONS = [1, 2, 3, 4, 5];
// const ZONE_MULTIPLIER_PRESETS = ["1,2,3", "2,4,6", "1,3,5", "5,10,15", "1,2,5,10"];

// const FEATURE_BADGE: Record<string, string> = {
//   extra:  "bg-emerald-900 text-emerald-300 border border-emerald-600",
//   zone:   "bg-sky-900 text-sky-300 border border-sky-600",
//   strike: "bg-orange-900 text-orange-300 border border-orange-600",
//   split:  "bg-pink-900 text-pink-300 border border-pink-600",
// };
// const FEATURE_COLOR: Record<string, string> = {
//   strike: "text-orange-300",
//   zone:   "text-sky-300",
//   extra:  "text-emerald-300",
//   split:  "text-pink-300",
// };

// type Props = {
//   baseCoins: ComboCoin[];
//   config:    ComboFeatureConfig;
//   onSpin:    (snap: ComboCoin[], upgradedSplitter: number, upgradedMultipliers: number[]) => void;
//   onReset:   () => void;
// };

// // ── Upgrade control — below each non-gold coin ───────────────────────────────
// function UpgradeControl({
//   coin, colorLabel, currentFeatures, onToggle, onFeaturesChange,
// }: {
//   coin:            ComboCoin;
//   colorLabel:      string;
//   currentFeatures: string[];
//   onToggle:        (val: boolean) => void;
//   onFeaturesChange:(val: string[]) => void;
// }) {
//   const upgradeType = getUpgradeType(colorLabel);
//   if (!upgradeType || upgradeType === "gold") return null;

//   // Features available to upgrade to (exclude already-active base features)
//   const available = upgradeType === "all"
//     ? ALL_COLOR_UPGRADE_FEATURES.filter((f) => !currentFeatures.includes(f))
//     : [upgradeType].filter((f) => !currentFeatures.includes(f));

//   if (available.length === 0) return null;

//   return (
//     <div className="mt-1 pt-1 border-t border-white/10 w-full" onClick={(e) => e.stopPropagation()}>
//       <div className="text-[8px] text-gray-400 mb-0.5 font-semibold tracking-wide">Upgrade →</div>
//       <div className="flex flex-wrap gap-1">
//         {available.map((feat) => {
//           const checked = !!coin.upgraded && (coin.upgradeFeatures ?? []).includes(feat);
//           return (
//             <label key={feat} className="flex items-center gap-0.5 cursor-pointer" onClick={(e) => e.stopPropagation()}>
//               <input
//                 type="checkbox"
//                 checked={checked}
//                 onChange={(e) => {
//                   e.stopPropagation();
//                   const cur  = coin.upgradeFeatures ?? [];
//                   const next = e.target.checked ? [...cur, feat] : cur.filter((f) => f !== feat);
//                   onFeaturesChange(next);
//                   onToggle(next.length > 0);
//                 }}
//                 className="w-2.5 h-2.5 accent-purple-400"
//               />
//               <span className={`text-[8px] capitalize ${FEATURE_COLOR[feat] ?? "text-gray-300"}`}>{feat}</span>
//             </label>
//           );
//         })}
//       </div>
//     </div>
//   );
// }

// // ── Ghost cell for split copies ───────────────────────────────────────────────
// function SplitGhost({
//   copyIdx, coin, effStrike, coinValueOptions, onValueChange, onBoostChange,
// }: {
//   copyIdx:          number;
//   coin:             ComboCoin;
//   effStrike:        boolean;
//   coinValueOptions: string[];
//   onValueChange:    (ci: number, v: string) => void;
//   onBoostChange:    (ei: number, v: string) => void;
// }) {
//   const copyVal = coin.splitCopyValues?.[copyIdx] ?? coin.value;
//   return (
//     <div className="rounded border border-dashed border-pink-400/50 bg-pink-950/30 flex flex-col items-center p-1 gap-0.5">
//       <span className="text-[8px] text-pink-300/50 self-start">copy {copyIdx}</span>
//       <span className="text-sm leading-none">🟡</span>
//       <select
//         className="text-white text-[9px] w-full rounded bg-pink-900 border-0 mt-0.5"
//         value={copyVal}
//         onClick={(e) => e.stopPropagation()}
//         onChange={(e) => onValueChange(copyIdx, e.target.value)}
//       >
//         {coinValueOptions.map((v) => <option key={v} value={v} className="bg-gray-800">{v}</option>)}
//       </select>
//       {effStrike && coin.winged && (
//         <select
//           className="text-white text-[9px] w-full rounded bg-yellow-800 border-0 mt-0.5"
//           value={coin.splitBoostValues?.[copyIdx - 1] ?? ""}
//           onClick={(e) => e.stopPropagation()}
//           onChange={(e) => onBoostChange(copyIdx - 1, e.target.value)}
//         >
//           <option value="" className="bg-gray-800">Boost</option>
//           {SPLIT_BOOST_VALUES.map((v) => <option key={v} value={v} className="bg-gray-800">{v}</option>)}
//         </select>
//       )}
//     </div>
//   );
// }

// // ── Zone upgrade settings panel ───────────────────────────────────────────────
// function ZoneUpgradePanel({ splitter, multiplierStr, onSplitterChange, onMultiplierChange }: {
//   splitter:           number;
//   multiplierStr:      string;
//   onSplitterChange:   (v: number) => void;
//   onMultiplierChange: (v: string) => void;
// }) {
//   return (
//     <div className="bg-sky-950/60 border border-sky-700 rounded-lg p-3 flex flex-col gap-2">
//       <div className="text-xs font-semibold text-sky-300">🔵 Zone Upgrade Settings
//         <span className="ml-2 text-[9px] text-sky-500 font-normal">(does not cost spins)</span>
//       </div>
//       <div className="flex gap-4 flex-wrap items-start">
//         <div className="flex flex-col gap-1">
//           <label className="text-[10px] text-sky-400">Splitter</label>
//           <div className="flex gap-1">
//             {ZONE_SPLITTER_OPTIONS.map((n) => (
//               <button key={n} onClick={() => onSplitterChange(n)}
//                 className={`w-7 h-7 rounded text-xs font-bold transition-all ${splitter === n ? "bg-sky-500 text-white" : "bg-sky-900/60 text-sky-400 hover:bg-sky-800"}`}
//               >{n}</button>
//             ))}
//           </div>
//         </div>
//         <div className="flex flex-col gap-1 flex-1 min-w-[160px]">
//           <label className="text-[10px] text-sky-400">Multipliers (comma-separated)</label>
//           <input
//             type="text" value={multiplierStr}
//             onChange={(e) => onMultiplierChange(e.target.value)}
//             className="bg-sky-900/60 border border-sky-700 text-sky-100 text-xs rounded px-2 py-1 w-full"
//             placeholder="e.g. 1,2,5"
//           />
//           <div className="flex gap-1 flex-wrap">
//             {ZONE_MULTIPLIER_PRESETS.map((p) => (
//               <button key={p} onClick={() => onMultiplierChange(p)}
//                 className={`text-[9px] px-1.5 py-0.5 rounded transition-all ${multiplierStr === p ? "bg-sky-500 text-white" : "bg-sky-900/60 text-sky-400 hover:bg-sky-800"}`}
//               >{p}</button>
//             ))}
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// }

// // ── Main component ────────────────────────────────────────────────────────────
// export default function CombinationFeature({ baseCoins, config, onSpin, onReset }: Props) {
//   const coinColors  = getComboCoinColors(config.features);
//   const defaultCode = coinColors[0].value;

//   const [isOpen, setIsOpen] = useState(true);
//   const initialSeeds = baseCoins.map((c) => ({ ...c, fromBase: true }));
//   const [coins, setCoins]   = useState<ComboCoin[]>(initialSeeds);

//   // Zone upgrade settings (only used when zone is newly upgraded)
//   const [upgSplitter,     setUpgSplitter]     = useState<number>(config.splitter ?? 1);
//   const [upgMultiplierStr,setUpgMultiplierStr] = useState<string>(config.multipliers?.join(",") ?? "");

//   // Derive all upgraded features live from coin state
//   const allUpgraded = useMemo(
//     () => [...new Set(coins.flatMap((c) => (c.upgraded ? (c.upgradeFeatures ?? []) : [])))],
//     [coins]
//   );

//   // Effective flags — base config OR upgraded into
//   const effStrike = config.hasStrike || allUpgraded.includes("strike");
//   const effZone   = config.hasZone   || allUpgraded.includes("zone");
//   const effSplit  = config.hasSplit  || allUpgraded.includes("split");
//   const effExtra  = config.hasExtra  || allUpgraded.includes("extra");

//   // Zone params: if zone was newly upgraded (not in base config) use upgraded values
//   const zoneUpgraded = allUpgraded.includes("zone") && !config.hasZone;
//   const effSplitter = effZone
//     ? (zoneUpgraded ? upgSplitter : (config.splitter ?? upgSplitter))
//     : 1;
//   const effMultipliers = useMemo(() => {
//     if (!effZone) return [];
//     if (zoneUpgraded) return upgMultiplierStr.split(",").map((n) => n.trim()).filter(Boolean).map(Number);
//     return config.multipliers ?? [];
//   }, [effZone, zoneUpgraded, config.multipliers, upgMultiplierStr]);

//   // Spin count
//   const MAX_SPINS = getComboMaxSpins(config, allUpgraded);
//   const [spinsLeft, setSpinsLeft] = useState(MAX_SPINS);
//   const prevMaxRef = useRef(MAX_SPINS);
//   // Bump spinsLeft when extra is newly gained (without penalising)
//   if (MAX_SPINS !== prevMaxRef.current) {
//     if (MAX_SPINS > prevMaxRef.current) {
//       // schedule update outside render
//       setTimeout(() => setSpinsLeft((s) => Math.min(s + (MAX_SPINS - prevMaxRef.current), MAX_SPINS)), 0);
//     }
//     prevMaxRef.current = MAX_SPINS;
//   }

//   const lastSpinPositions = useRef<Set<number>>(new Set(initialSeeds.map((c) => c.position)));

//   // ── Coin helpers ───────────────────────────────────────────────────────────
//   const coinAt = (pos: number) => coins.find((c) => c.position === pos);

//   const addCoin = (pos: number) => {
//     if (coinAt(pos)) return;
//     setCoins((prev) => [...prev, { position:pos, colorCode:defaultCode, value:COIN_VALUES[0], winged:false, splitCount:1 }]);
//   };

//   const removeCoin = (pos: number) => {
//     if (coinAt(pos)?.fromBase) return;
//     setCoins((prev) => prev.filter((x) => x.position !== pos));
//   };

//   const updateCoin = (pos: number, field: keyof ComboCoin, val: any) =>
//     setCoins((prev) => prev.map((c) => c.position === pos ? { ...c, [field]: val } : c));

//   const updateCopyValue = (pos: number, ci: number, val: string) =>
//     setCoins((prev) => prev.map((c) => {
//       if (c.position !== pos) return c;
//       const arr = [...(c.splitCopyValues ?? [])];
//       arr[ci] = val;
//       return { ...c, splitCopyValues: arr };
//     }));

//   const updateSplitBoost = (pos: number, ei: number, val: string) =>
//     setCoins((prev) => prev.map((c) => {
//       if (c.position !== pos) return c;
//       const arr = [...(c.splitBoostValues ?? [])];
//       arr[ei] = val;
//       return { ...c, splitBoostValues: arr };
//     }));

//   const toggleWinged = (pos: number, e: React.MouseEvent) => {
//     e.stopPropagation();
//     setCoins((prev) => prev.map((x) =>
//       x.position === pos ? { ...x, winged: !x.winged, boostValue: x.winged ? undefined : x.boostValue } : x
//     ));
//   };

//   // ── Spin ──────────────────────────────────────────────────────────────────
//   const handleSpin = () => {
//     if (spinsLeft <= 0) return;
//     const cur = new Set(coins.map((c) => c.position));
//     const hasNew = [...cur].some((p) => !lastSpinPositions.current.has(p));
//     setSpinsLeft(hasNew ? MAX_SPINS : spinsLeft - 1);
//     lastSpinPositions.current = cur;
//     onSpin(coins, effSplitter, effMultipliers);
//   };

//   const resetFeature = () => {
//     const seeded = baseCoins.map((c) => ({ ...c, fromBase: true }));
//     setCoins(seeded);
//     setSpinsLeft(MAX_SPINS);
//     lastSpinPositions.current = new Set(seeded.map((c) => c.position));
//     onReset();
//   };

//   // Coin value options — include split values when split is effective
//   const coinValueOptions = effSplit
//     ? [...new Set([...COIN_VALUES, ...SPLIT_COIN_VALUES])]
//     : COIN_VALUES;

//   // Upgraded features that are new (not already in base config)
//   const newUpgraded = allUpgraded.filter((f) => !config.features.includes(f));

//   // ── Render ─────────────────────────────────────────────────────────────────
//   return (
//     <div className="bg-gray-800 rounded-xl">

//       {/* HEADER */}
//       <div onClick={() => setIsOpen(!isOpen)} className="flex justify-between items-center p-4 cursor-pointer">
//         <div className="flex items-center gap-2 flex-wrap">
//           <h2 className="text-lg font-semibold text-white">⚡ Combination Feature</h2>
//           {/* Base feature badges */}
//           {config.features.map((name) => (
//             <span key={name} className={`text-xs px-2 py-0.5 rounded capitalize ${FEATURE_BADGE[name] ?? "bg-gray-700 text-gray-300"}`}>{name}</span>
//           ))}
//           {/* Newly upgraded feature badges */}
//           {newUpgraded.map((f) => (
//             <span key={`up-${f}`} className={`text-xs px-2 py-0.5 rounded capitalize border border-dashed opacity-80 ${FEATURE_BADGE[f] ?? "bg-gray-700 text-gray-300"}`}>↑{f}</span>
//           ))}
//           {/* Zone splitter badge */}
//           {effZone && (
//             <span className="text-xs px-2 py-0.5 rounded bg-sky-900 text-sky-300 border border-sky-700">
//               Splitter {effSplitter}
//             </span>
//           )}
//           {/* Extra spins badge */}
//           {effExtra && (
//             <span className="text-xs px-2 py-0.5 rounded bg-emerald-900 text-emerald-300 border border-emerald-700">
//               {MAX_SPINS} spins
//             </span>
//           )}
//         </div>
//         <span className="text-white">{isOpen ? "▼" : "▶"}</span>
//       </div>

//       {isOpen && (
//         <div className="p-6 pt-0 flex flex-col gap-4">

//           {/* Zone upgrade settings — only shown when zone is newly upgraded */}
//           {zoneUpgraded && (
//             <ZoneUpgradePanel
//               splitter={upgSplitter}
//               multiplierStr={upgMultiplierStr}
//               onSplitterChange={setUpgSplitter}
//               onMultiplierChange={setUpgMultiplierStr}
//             />
//           )}

//           {/* SPIN CONTROLS */}
//           <div className="flex items-center gap-4 flex-wrap">
//             <button
//               onClick={handleSpin}
//               disabled={spinsLeft <= 0}
//               className={`px-6 py-2 rounded font-bold text-white transition-all ${
//                 spinsLeft > 0 ? "bg-purple-600 hover:bg-purple-500" : "bg-gray-600 cursor-not-allowed opacity-50"
//               }`}
//             >
//               SPIN
//             </button>
//             <span className="text-sm text-gray-300">
//               {spinsLeft} / {MAX_SPINS} spins left
//               {effExtra && <span className="ml-1 text-emerald-400 text-xs">(Extra)</span>}
//             </span>
//             <button onClick={resetFeature} className="px-3 py-1 bg-gray-600 hover:bg-gray-500 rounded text-sm">Reset</button>
//           </div>

//           {/* GRID — 5 cols × 3 rows, column-major */}
//           <div className="grid gap-1" style={{ gridTemplateColumns: "repeat(5, minmax(0, 1fr))" }}>
//             {Array.from({ length: 3 }).map((_, row) =>
//               Array.from({ length: 5 }).map((_, col) => {
//                 const pos  = col * 3 + row;
//                 const coin = coinAt(pos);

//                 // Zone background — apply when zone is effective (base OR upgraded)
//                 const zoneBg = effZone ? getZoneBgColor(pos, effSplitter) : null;
//                 const cellBg = zoneBg
//                   ? `${ZONE_BG_CLASS[zoneBg]} ${ZONE_BORDER_CLASS[zoneBg]}`
//                   : "bg-gray-700 border-gray-600";

//                 const colorLabel = coin ? (coinColors.find((o) => o.value === coin.colorCode)?.label ?? "") : "";
//                 const isGold = colorLabel.toLowerCase().includes("gold");

//                 return (
//                   <div key={pos} className="flex flex-col gap-1">

//                     {/* PRIMARY CELL */}
//                     <div
//                       onClick={() => !coin && addCoin(pos)}
//                       className={`relative rounded-lg border-2 flex flex-col items-center justify-center p-1 min-h-[110px] text-xs text-white cursor-pointer transition-all hover:brightness-110
//                         ${cellBg}
//                         ${!coin && !effZone ? "hover:bg-gray-600 hover:border-gray-400" : ""}
//                         ${coin && effSplit ? "border-pink-500/60" : ""}
//                       `}
//                     >
//                       <div className="text-[8px] opacity-40 absolute top-1 left-1">{pos}</div>
//                       {coin && effSplit && <div className="text-[8px] opacity-30 absolute top-1 right-5 text-pink-300">c0</div>}

//                       {coin ? (
//                         <div className="flex flex-col items-center w-full gap-1 mt-3 px-0.5">

//                           {/* Winged toggle — shown when strike is effective */}
//                           {effStrike ? (
//                             <button
//                               onClick={(e) => toggleWinged(pos, e)}
//                               title="Toggle winged / plain"
//                               className={`text-sm leading-none px-1 py-0.5 rounded transition-all ${
//                                 coin.winged
//                                   ? "bg-yellow-500/20 text-yellow-200 ring-1 ring-yellow-400"
//                                   : "text-yellow-300 hover:bg-yellow-500/10"
//                               }`}
//                             >
//                               {coin.winged ? "🪽🟡🪽" : "🟡"}
//                             </button>
//                           ) : (
//                             <div className="text-base leading-none">🟡</div>
//                           )}

//                           {/* Color */}
//                           <select
//                             className="text-white text-[10px] w-full rounded px-0.5 py-0.5 bg-gray-600 border-0"
//                             value={coin.colorCode}
//                             onClick={(e) => e.stopPropagation()}
//                             onChange={(e) => {
//                               updateCoin(pos, "colorCode", Number(e.target.value));
//                               updateCoin(pos, "upgraded"        as any, false);
//                               updateCoin(pos, "upgradeFeatures" as any, []);
//                             }}
//                           >
//                             {coinColors.map((c) => (
//                               <option key={c.value} value={c.value} className="bg-gray-800">{c.label}</option>
//                             ))}
//                           </select>

//                           {/* Value (copy 0) */}
//                           <select
//                             className="text-white text-[10px] w-full rounded px-0.5 py-0.5 bg-gray-600 border-0"
//                             value={coin.splitCopyValues?.[0] ?? coin.value}
//                             onClick={(e) => e.stopPropagation()}
//                             onChange={(e) => {
//                               updateCopyValue(pos, 0, e.target.value);
//                               updateCoin(pos, "value", e.target.value);
//                             }}
//                           >
//                             {coinValueOptions.map((v) => (
//                               <option key={v} value={v} className="bg-gray-800">{v}</option>
//                             ))}
//                           </select>

//                           {/* Boost copy 0 — strike effective + winged */}
//                           {effStrike && coin.winged && (
//                             <select
//                               className="text-white text-[10px] w-full rounded px-0.5 py-0.5 bg-yellow-700 border-0"
//                               value={coin.boostValue ?? ""}
//                               onClick={(e) => e.stopPropagation()}
//                               onChange={(e) => updateCoin(pos, "boostValue", e.target.value)}
//                             >
//                               <option value="" className="bg-gray-800">Boost (c0)</option>
//                               {STRIKE_BOOST_VALUES.map((v) => (
//                                 <option key={v} value={v} className="bg-gray-800">{v}</option>
//                               ))}
//                             </select>
//                           )}

//                           {/* Split count — split effective */}
//                           {effSplit && (
//                             <select
//                               className="text-white text-[10px] w-full rounded px-0.5 py-0.5 bg-pink-700 border-0"
//                               value={coin.splitCount ?? 1}
//                               onClick={(e) => e.stopPropagation()}
//                               onChange={(e) => {
//                                 const sc = Number(e.target.value);
//                                 updateCoin(pos, "splitCount", sc);
//                                 if (sc <= 1) {
//                                   updateCoin(pos, "splitBoostValues" as any, []);
//                                   updateCoin(pos, "splitCopyValues"  as any, []);
//                                 }
//                               }}
//                             >
//                               {SPLIT_COUNT_OPTIONS.map((n) => (
//                                 <option key={n} value={n} className="bg-gray-800">Split × {n}</option>
//                               ))}
//                             </select>
//                           )}

//                           {/* UPGRADE CONTROL — hidden for gold coins */}
//                           {!isGold && (
//                             <UpgradeControl
//                               coin={coin}
//                               colorLabel={colorLabel}
//                               currentFeatures={config.features}
//                               onToggle={(v) => updateCoin(pos, "upgraded"        as any, v)}
//                               onFeaturesChange={(v) => updateCoin(pos, "upgradeFeatures" as any, v)}
//                             />
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
//                         <span className="text-white/40 text-[10px]">+ Add</span>
//                       )}
//                     </div>

//                     {/* GHOST CELLS for extra split copies */}
//                     {coin && effSplit && (coin.splitCount ?? 1) > 1 &&
//                       Array.from({ length: (coin.splitCount ?? 1) - 1 }).map((_, i) => {
//                         const ci = i + 1;
//                         return (
//                           <SplitGhost
//                             key={ci}
//                             copyIdx={ci}
//                             coin={coin}
//                             effStrike={effStrike}
//                             coinValueOptions={coinValueOptions}
//                             onValueChange={(c, v) => updateCopyValue(pos, c, v)}
//                             onBoostChange={(e, v) => updateSplitBoost(pos, e, v)}
//                           />
//                         );
//                       })
//                     }

//                   </div>
//                 );
//               })
//             )}
//           </div>

//           {/* UPGRADE SUMMARY */}
//           {allUpgraded.length > 0 && (
//             <div className="text-xs bg-purple-950/50 border border-purple-700 rounded px-3 py-2 text-purple-200 flex flex-col gap-1">
//               <div>
//                 <span className="font-semibold text-purple-300">additionalFeatureTriggered: </span>
//                 [{allUpgraded.join(", ")}]
//               </div>
//               {effZone && zoneUpgraded && (
//                 <div className="text-sky-300">
//                   zoneSplitter: {effSplitter}
//                   {effMultipliers.length > 0 && <span className="ml-2">zoneMultipliers: [{effMultipliers.join(",")}]</span>}
//                 </div>
//               )}
//             </div>
//           )}

//           {/* LEGEND */}
//           <div className="text-xs text-gray-400 flex flex-wrap gap-3">
//             {effStrike && <span>🪽🟡🪽 = winged — click to toggle{!config.hasStrike ? " (via upgrade)" : ""}</span>}
//             {effSplit  && <span>Split × N = N copies{!config.hasSplit ? " (via upgrade)" : ""}</span>}
//             {effZone   && <span>Background = zone (splitter {effSplitter}){zoneUpgraded ? " (via upgrade)" : ""}</span>}
//             {effExtra  && !config.hasExtra && <span className="text-emerald-400">+1 spin from Extra upgrade</span>}
//             <span className="text-yellow-400/60">⚙ Upgrade settings don&apos;t cost spins — only SPIN does</span>
//           </div>

//         </div>
//       )}
//     </div>
//   );
// }








/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { useState, useRef } from "react";
import {
  ComboCoin, ComboFeatureConfig,
  getComboMaxSpins, getComboCoinColors,
  generateCombinationGaffe, resolveUpgradeFeatures, UpgradeInfo,
  ALL_UPGRADE_FEATURES,
} from "./combinationFeatureGenerator";
import { ZONE_BG_CLASS, ZONE_BORDER_CLASS, getZoneBgColor } from "../zone/zoneFeatureGenerator";
import { STRIKE_BOOST_VALUES } from "../strike/strikeFeatureGenerator";
import { SPLIT_COUNT_OPTIONS, SPLIT_BOOST_VALUES } from "../split/splitFeatureGenerator";

// ── Constants ─────────────────────────────────────────────────────────────────
const COMBO_COIN_VALUES = ["1", "2", "5", "100" , "Minor", "Major", "Mini"];
const ZONE_SPLITTER_OPTIONS = [1, 2, 3, 4, 5];

const FEATURE_BADGE: Record<string, string> = {
  extra:  "bg-emerald-900 text-emerald-300 border border-emerald-600",
  zone:   "bg-sky-900 text-sky-300 border border-sky-600",
  strike: "bg-orange-900 text-orange-300 border border-orange-600",
  split:  "bg-pink-900 text-pink-300 border border-pink-600",
};

// ── Props ─────────────────────────────────────────────────────────────────────
type Props = {
  baseCoins:          ComboCoin[];
  config:             ComboFeatureConfig;
  pendingUpgradeInfo: UpgradeInfo | null;
  onSpin:             (snapshot: ComboCoin[], line: string) => void;
  onReset:            () => void;
  onUpgrade:          (newFeatures: string[], carryCoins: ComboCoin[], upgradeInfo: UpgradeInfo) => void;
};

// ── Component ─────────────────────────────────────────────────────────────────
export default function CombinationFeature({
  baseCoins, config, pendingUpgradeInfo, onSpin, onReset, onUpgrade,
}: Props) {
  const MAX_SPINS   = getComboMaxSpins(config);
  const coinColors  = getComboCoinColors(config.features);
  const defaultCode = coinColors[0].value;

  const [isOpen,    setIsOpen]    = useState(true);

  // Seed initializer — migrate legacy wingedCopyIdx → wingedCopyIdxs array
  const seedCoins = (src: ComboCoin[]) => src.map((c) => ({
    ...c,
    fromBase: true,
    wingedCopyIdxs: c.wingedCopyIdxs !== undefined
      ? c.wingedCopyIdxs
      : (config.hasStrike && c.winged ? [0] : undefined),
    splitBoostValues: c.splitBoostValues
      ?? (config.hasStrike && c.winged && c.boostValue ? [c.boostValue] : undefined),
  }));

  const [coins,     setCoins]     = useState<ComboCoin[]>(() => seedCoins(baseCoins));
  const [spinsLeft, setSpinsLeft] = useState(MAX_SPINS);
  const lastSpinPositions = useRef<Set<number>>(new Set(baseCoins.map((c) => c.position)));

  // Upgrade state
  const [upgradePos,          setUpgradePos]          = useState<number | null>(null);
  const [upgradeFeatSel,      setUpgradeFeatSel]      = useState<string>("");
  const [upgradeMultiSel,     setUpgradeMultiSel]     = useState<Set<string>>(new Set());
  const [upgradeZoneSplitter, setUpgradeZoneSplitter] = useState<string>("");
  const [upgradeZoneMultiRaw, setUpgradeZoneMultiRaw] = useState<string>("");

  const coinAt = (pos: number) => coins.find((c) => c.position === pos);

  // ── Coin operations ──────────────────────────────────────────────────────
  const handleCellClick = (pos: number) => {
    if (coinAt(pos)) return;
    setCoins((prev) => [...prev, {
      position: pos, colorCode: defaultCode, value: COMBO_COIN_VALUES[0],
      winged: false, splitCount: 1,
    }]);
  };

  const removeCoin = (pos: number) => {
    const c = coinAt(pos);
    if (!c || c.fromBase) return;
    if (upgradePos === pos) resetUpgrade();
    setCoins((prev) => prev.filter((x) => x.position !== pos));
  };

  const updateCoin = (pos: number, field: keyof ComboCoin, val: any) =>
    setCoins((prev) => prev.map((c) => c.position === pos ? { ...c, [field]: val } : c));

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

  // ── Upgrade radio ─────────────────────────────────────────────────────────
  const resetUpgrade = () => {
    setUpgradePos(null); setUpgradeFeatSel(""); setUpgradeMultiSel(new Set());
    setUpgradeZoneSplitter(""); setUpgradeZoneMultiRaw("");
  };

  const handleUpgradeRadio = (pos: number) => {
    if (upgradePos === pos) { resetUpgrade(); return; }
    setUpgradePos(pos); setUpgradeFeatSel(""); setUpgradeMultiSel(new Set());
    setUpgradeZoneSplitter(""); setUpgradeZoneMultiRaw("");
  };

  const upgradeCoin = upgradePos !== null ? coinAt(upgradePos) : null;

  // Is the selected coin an All-Color coin?
  const allColorEntry = coinColors.find((c) =>
    c.label.toLowerCase().includes("all-color") || c.label.toLowerCase().includes("all color")
  );
  const isAllColor = !!(upgradeCoin && allColorEntry && upgradeCoin.colorCode === allColorEntry.value);

  // Gold coins have no upgrade
  const goldCodes = new Set(
    coinColors.filter((c) => c.label.toLowerCase().includes("gold")).map((c) => c.value)
  );

  const activeFeaturesUpper = config.features.map((f) => f.toUpperCase());

  const upgradeOptions: string[] = (() => {
    if (!upgradeCoin) return [];
    if (goldCodes.has(upgradeCoin.colorCode)) return [];
    if (isAllColor) return ALL_UPGRADE_FEATURES.filter((f) => !activeFeaturesUpper.includes(f));
    const label = coinColors.find((c) => c.value === upgradeCoin.colorCode)?.label ?? "";
    return resolveUpgradeFeatures(label).filter((f) => !activeFeaturesUpper.includes(f));
  })();

  const toggleMulti = (f: string) =>
    setUpgradeMultiSel((prev) => {
      const next = new Set(prev);
      if (next.has(f)) next.delete(f); else next.add(f);
      return next;
    });

  const selectedUpgradeFeats: string[] = isAllColor
    ? Array.from(upgradeMultiSel)
    : upgradeFeatSel ? [upgradeFeatSel] : [];

  // Navigate immediately when upgrade feature selected
  const navigateComboUpgrade = (feats: string[]) => {
    if (upgradePos === null || feats.length === 0) return;
    const hasZone = feats.map((f) => f.toUpperCase()).includes("ZONE");
    const upgradeInfo: UpgradeInfo = {
      col: Math.floor(upgradePos / 3),
      row: upgradePos % 3,
      features: feats,
      ...(hasZone && upgradeZoneSplitter ? { zoneSplitter: Number(upgradeZoneSplitter) } : {}),
      ...(hasZone && upgradeZoneMultiRaw ? {
        zoneMultipliers: upgradeZoneMultiRaw.split(",").map((n) => n.trim()).filter(Boolean).map(Number),
      } : {}),
    };
    const newFeatures = [...new Set([...config.features, ...feats.map((f) => f.toLowerCase())])];
    onUpgrade(newFeatures, coins, upgradeInfo);
  };

  // ── Spin ──────────────────────────────────────────────────────────────────
  const handleSpin = () => {
    if (spinsLeft <= 0) return;
    const cur = new Set(coins.map((c) => c.position));
    const hasNew = [...cur].some((p) => !lastSpinPositions.current.has(p));
    // Upgrade spin always resets to MAX
    const nextSpins = pendingUpgradeInfo ? MAX_SPINS : (hasNew ? MAX_SPINS : spinsLeft - 1);
    setSpinsLeft(nextSpins);
    lastSpinPositions.current = cur;
    const line = generateCombinationGaffe(coins, config, pendingUpgradeInfo ?? null);
    onSpin(coins, line);
  };

  const resetFeature = () => {
    const seeded = seedCoins(baseCoins);
    setCoins(seeded);
    setSpinsLeft(MAX_SPINS);
    lastSpinPositions.current = new Set(seeded.map((c) => c.position));
    resetUpgrade();
    onReset();
  };

  const activeSplitter = config.hasZone ? (config.splitter ?? 1) : 0;

  return (
    <div className="bg-gray-800 rounded-xl border border-indigo-800">

      {/* HEADER */}
      <div onClick={() => setIsOpen(!isOpen)} className="flex justify-between items-center p-4 cursor-pointer select-none">
        <div className="flex items-center gap-2 flex-wrap">
          <h2 className="text-lg font-semibold text-white">⚡ Combination Feature</h2>
          {config.features.map((name) => (
            <span key={name} className={`text-xs px-2 py-0.5 rounded capitalize ${FEATURE_BADGE[name] ?? "bg-gray-700 text-gray-300"}`}>
              {name}
            </span>
          ))}
          {config.hasZone && config.splitter && (
            <span className="text-xs px-2 py-0.5 rounded bg-sky-900 text-sky-300 border border-sky-700">
              Splitter {config.splitter}
            </span>
          )}
          {pendingUpgradeInfo && (
            <span className="text-xs px-2 py-0.5 rounded bg-yellow-900 text-yellow-300 border border-yellow-700 animate-pulse">
              ✦ upgrade pending — SPIN to confirm
            </span>
          )}
        </div>
        <span className="text-gray-400">{isOpen ? "▼" : "▶"}</span>
      </div>

      {isOpen && (
        <div className="p-4 pt-0 flex flex-col gap-3">

          {/* SPIN CONTROLS */}
          <div className="flex items-center gap-3 flex-wrap">
            <button
              onClick={handleSpin} disabled={spinsLeft <= 0}
              className={`px-6 py-2 rounded font-bold text-white transition-all ${
                spinsLeft > 0 ? "bg-indigo-600 hover:bg-indigo-500" : "bg-gray-600 cursor-not-allowed opacity-50"
              }`}
            >
              SPIN
            </button>
            <span className="text-sm text-gray-400">
              {spinsLeft} spin{spinsLeft !== 1 ? "s" : ""}
              {config.hasExtra && <span className="ml-1 text-emerald-400 text-xs">(4 — Extra)</span>}
            </span>
            <button onClick={resetFeature} className="px-3 py-1 bg-gray-600 hover:bg-gray-500 rounded text-sm">Reset</button>
          </div>

          {/* UPGRADE PANEL — shown when a coin's radio is selected */}
          {upgradePos !== null && upgradeOptions.length > 0 && (
            <div className="flex flex-col gap-2 bg-yellow-900/20 border border-yellow-800 rounded-lg p-3">
              <span className="text-yellow-300 text-xs font-bold">
                ✦ Upgrade at position {upgradePos} — select feature to add (navigates immediately):
              </span>

              {isAllColor ? (
                // All-Color: multi-select checkboxes
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
                  {/* Show zone params if ZONE is checked */}
                  {upgradeMultiSel.has("ZONE") && (
                    <div className="flex gap-3 flex-wrap items-center bg-sky-900/30 border border-sky-800 rounded p-2">
                      <span className="text-sky-300 text-[10px]">Zone params:</span>
                      <div className="flex items-center gap-1">
                        <span className="text-[10px] text-sky-300">Splitter</span>
                        <select className="bg-sky-950 text-sky-200 text-xs rounded px-1 py-0.5 border border-sky-700"
                          value={upgradeZoneSplitter} onChange={(e) => setUpgradeZoneSplitter(e.target.value)}>
                          <option value="">--</option>
                          {ZONE_SPLITTER_OPTIONS.map((v) => <option key={v} value={v}>{v}</option>)}
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
                    <button onClick={() => navigateComboUpgrade(Array.from(upgradeMultiSel))}
                      className="self-start px-3 py-1 bg-yellow-600 hover:bg-yellow-500 rounded text-xs font-bold transition-all">
                      → Go to {[...config.features, ...Array.from(upgradeMultiSel).map((f) => f.toLowerCase())]
                        .filter((v, i, a) => a.indexOf(v) === i).join(" + ")}
                    </button>
                  )}
                </div>
              ) : (
                // Single-color: direct navigate buttons (zone shows params first)
                <div className="flex flex-col gap-2">
                  <div className="flex gap-2 flex-wrap">
                    {upgradeOptions.filter((f) => f !== "ZONE").map((f) => (
                      <button key={f} onClick={() => navigateComboUpgrade([f])}
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
                            {ZONE_SPLITTER_OPTIONS.map((v) => <option key={v} value={v}>{v}</option>)}
                          </select>
                        </div>
                        <div className="flex items-center gap-1">
                          <span className="text-[10px] text-sky-300">Multipliers</span>
                          <input type="text" placeholder="e.g. 2,3" value={upgradeZoneMultiRaw}
                            onChange={(e) => setUpgradeZoneMultiRaw(e.target.value)}
                            className="bg-sky-950 text-sky-200 text-xs rounded px-1 py-0.5 border border-sky-700 w-20" />
                        </div>
                      </div>
                      <button onClick={() => navigateComboUpgrade(["ZONE"])}
                        className="self-start px-3 py-1 bg-sky-700 hover:bg-sky-600 border border-sky-500 rounded text-xs font-bold transition-all">
                        → Go to {[...config.features, "zone"].join(" + ")}
                      </button>
                    </div>
                  )}
                </div>
              )}
            </div>
          )}

          {upgradePos !== null && upgradeOptions.length === 0 && (
            <div className="text-xs text-gray-500 bg-gray-700 px-3 py-1.5 rounded">
              ℹ No upgrades available (all features already active or Gold coin)
            </div>
          )}

          {/* GRID — 5 cols × 3 rows, column-major */}
          <div className="grid gap-1" style={{ gridTemplateColumns: "repeat(5, minmax(0, 1fr))" }}>
            {Array.from({ length: 3 }).map((_, row) =>
              Array.from({ length: 5 }).map((_, col) => {
                const pos  = col * 3 + row;
                const coin = coinAt(pos);

                const zoneBg  = config.hasZone ? getZoneBgColor(pos, activeSplitter) : null;
                const cellBg  = zoneBg
                  ? `${ZONE_BG_CLASS[zoneBg]} ${ZONE_BORDER_CLASS[zoneBg]}`
                  : "bg-gray-700 border-gray-600";
                const hoverCls = !coin && !config.hasZone ? "hover:bg-gray-600 hover:border-gray-400" : "";

                return (
                  <div key={pos} className="flex flex-col gap-1">
                    <div
                      onClick={() => !coin && handleCellClick(pos)}
                      className={`relative rounded-lg border-2 flex flex-col items-start p-1 text-xs text-white cursor-pointer transition-all hover:brightness-110 ${cellBg} ${hoverCls} ${upgradePos === pos ? "ring-2 ring-yellow-400" : ""}`}
                      style={{ minHeight: 100 }}
                    >
                      <div className="text-[9px] opacity-40 mb-0.5">{pos}</div>

                      {coin ? (
                        <div className="flex flex-col items-center w-full gap-0.5">

                          {/* Winged toggle — checkbox per copy, multiple allowed */}
                          {config.hasStrike ? (
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
                            <div className="text-sm">🟡</div>
                          )}

                          {/* Color */}
                          <select
                            className="bg-gray-800 text-white text-[9px] w-full rounded px-0.5 py-0.5 border-0"
                            value={coin.colorCode}
                            onClick={(e) => e.stopPropagation()}
                            onChange={(e) => {
                              updateCoin(pos, "colorCode", Number(e.target.value));
                              if (upgradePos === pos) resetUpgrade();
                            }}
                          >
                            {coinColors.map((c) => (
                              <option key={c.value} value={c.value} className="bg-gray-800">{c.label}</option>
                            ))}
                          </select>

                          {/* Value (copy 0) */}
                          <select
                            className="bg-gray-800 text-white text-[9px] w-full rounded px-0.5 py-0.5 border-0"
                            value={coin.splitCopyValues?.[0] ?? coin.value}
                            onClick={(e) => e.stopPropagation()}
                            onChange={(e) => updateSplitCopyValue(pos, 0, e.target.value)}
                          >
                            {COMBO_COIN_VALUES.map((v) => (
                              <option key={v} value={v} className="bg-gray-800">{v}</option>
                            ))}
                          </select>

                          {/* Boost — only shown when copy 0 is winged */}
                          {config.hasStrike && (coin.wingedCopyIdxs?.includes(0)) && (
                            <select
                              className="bg-yellow-700 text-white text-[9px] w-full rounded px-0.5 py-0.5 border-0"
                              value={coin.splitBoostValues?.[0] ?? coin.boostValue ?? ""}
                              onClick={(e) => e.stopPropagation()}
                              onChange={(e) => {
                                const v = e.target.value;
                                // write to both for compatibility
                                setCoins((prev) => prev.map((c) =>
                                  c.position === pos
                                    ? { ...c, boostValue: v, splitBoostValues: Object.assign([], c.splitBoostValues, { 0: v }) }
                                    : c
                                ));
                              }}
                            >
                              <option value="" className="bg-gray-800">Boost</option>
                              {STRIKE_BOOST_VALUES.map((v) => (
                                <option key={v} value={v} className="bg-gray-800">{v}</option>
                              ))}
                            </select>
                          )}

                          {/* Split count */}
                          {config.hasSplit && (
                            <select
                              className="bg-pink-700 text-white text-[9px] w-full rounded px-0.5 py-0.5 border-0"
                              value={coin.splitCount ?? 1}
                              onClick={(e) => e.stopPropagation()}
                              onChange={(e) => {
                                const sc = Number(e.target.value);
                                updateCoin(pos, "splitCount", sc);
                                if (sc <= 1) {
                                  updateCoin(pos, "splitBoostValues" as any, []);
                                  updateCoin(pos, "splitCopyValues"  as any, []);
                                }
                              }}
                            >
                              {SPLIT_COUNT_OPTIONS.map((n) => (
                                <option key={n} value={n} className="bg-gray-800">Split × {n}</option>
                              ))}
                            </select>
                          )}

                          {/* ── UPGRADE RADIO — shown for all coins except gold ── */}
                          {!goldCodes.has(coin.colorCode) && (
                            <div className="flex items-center gap-1 mt-0.5 w-full" onClick={(e) => e.stopPropagation()}>
                              <input
                                type="radio"
                                name="comboUpgrade"
                                className="accent-yellow-400 w-3 h-3 cursor-pointer"
                                checked={upgradePos === pos}
                                onChange={() => handleUpgradeRadio(pos)}
                              />
                              <span className="text-[8px] text-yellow-300">upgrade</span>
                              {upgradePos === pos && !isAllColor && upgradeFeatSel && (
                                <span className="text-[8px] text-yellow-500">→{upgradeFeatSel}</span>
                              )}
                              {upgradePos === pos && isAllColor && upgradeMultiSel.size > 0 && (
                                <span className="text-[8px] text-yellow-500">→{Array.from(upgradeMultiSel).join("+")}</span>
                              )}
                            </div>
                          )}

                          {/* Remove — non-base coins only */}
                          {!coin.fromBase && (
                            <button
                              onClick={(e) => { e.stopPropagation(); removeCoin(pos); }}
                              className="absolute top-1 right-1 text-[10px] text-red-300 hover:text-red-100 font-bold"
                            >✕</button>
                          )}
                        </div>
                      ) : (
                        <span className="text-white/40 text-[10px] mx-auto mt-4">+ Add</span>
                      )}
                    </div>

                    {/* Ghost cells for split copies */}
                    {coin && config.hasSplit && (coin.splitCount ?? 1) > 1 &&
                      Array.from({ length: (coin.splitCount ?? 1) - 1 }).map((_, idx) => {
                        const copyIdx  = idx + 1;
                        const copyVal  = coin.splitCopyValues?.[copyIdx] ?? coin.value;
                        const isWinged = coin.wingedCopyIdxs?.includes(copyIdx) ?? false;
                        return (
                          <div key={idx} className={`rounded border border-dashed flex flex-col items-center p-1 min-h-[60px] text-[9px] gap-0.5
                            ${isWinged ? "border-yellow-400/80 bg-yellow-950/30 text-yellow-100" : "border-pink-400/50 bg-pink-950/30 text-pink-200"}`}>
                            <div className="opacity-40 self-start">copy {copyIdx}</div>
                            <div className="text-sm">{isWinged ? "🪽🟡🪽" : "🟡"}</div>
                            <select
                              className="text-white text-[9px] w-full rounded bg-pink-900 border-0 mt-0.5"
                              value={copyVal}
                              onClick={(e) => e.stopPropagation()}
                              onChange={(e) => updateSplitCopyValue(pos, copyIdx, e.target.value)}
                            >
                              {COMBO_COIN_VALUES.map((v) => (
                                <option key={v} value={v} className="bg-gray-800">{v}</option>
                              ))}
                            </select>
                            {config.hasStrike && (
                              <div className="flex items-center gap-1 w-full mt-0.5" onClick={(e) => e.stopPropagation()}>
                                <input
                                  type="checkbox"
                                  className="accent-yellow-400 w-2.5 h-2.5 cursor-pointer"
                                  checked={isWinged}
                                  onChange={() => toggleWingedCopy(pos, copyIdx)}
                                />
                                <span className="text-[8px] text-yellow-300">winged</span>
                              </div>
                            )}
                            {config.hasStrike && isWinged && (
                              <select
                                className="text-white text-[9px] w-full rounded bg-yellow-800 border-0 mt-0.5"
                                value={coin.splitBoostValues?.[copyIdx] ?? ""}
                                onClick={(e) => e.stopPropagation()}
                                onChange={(e) => updateSplitBoost(pos, copyIdx, e.target.value)}
                              >
                                <option value="" className="bg-gray-800">Boost</option>
                                {STRIKE_BOOST_VALUES.map((v) => (
                                  <option key={v} value={v} className="bg-gray-800">{v}</option>
                                ))}
                              </select>
                            )}
                          </div>
                        );
                      })
                    }
                  </div>
                );
              })
            )}
          </div>

          {/* LEGEND */}
          <div className="text-[10px] text-gray-500 flex flex-wrap gap-2">
            <span>🟡 = coin · click empty cell to add · ✕ = remove</span>
            {config.hasStrike && <span>🪽🟡🪽 = winged — ☑ checkbox per copy, multiple copies can be winged</span>}
            {config.hasSplit  && <span>Split × N = N copies (copy 0…N-1), each has its own value</span>}
            {config.hasZone   && <span>Background = zone regions (splitter {config.splitter})</span>}
            <span>✦ radio = upgrade · single-color = 1 feature · All-Color = multi-feature · Gold = no upgrade</span>
          </div>

        </div>
      )}
    </div>
  );
}