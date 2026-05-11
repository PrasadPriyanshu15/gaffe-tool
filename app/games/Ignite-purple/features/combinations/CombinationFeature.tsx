// /* eslint-disable @typescript-eslint/no-explicit-any */
// "use client";

// import { useState, useEffect, useRef } from "react";
// import {
//   ComboCoin,
//   ComboFeatureConfig,
//   getComboMaxSpins,
//   getComboCoinColors,
// } from "./combinationFeatureGenerator";
// import {
//   ZONE_BG_CLASS,
//   ZONE_BORDER_CLASS,
//   getZoneBgColor,
// } from "./zoneFeatureGenerator";
// import { STRIKE_BOOST_VALUES } from "./strikeFeatureGenerator";

// // ─────────────────────────────────────────────────────────────────────────────
// const COIN_VALUES = ["0.75", "1", "2", "5", "Minor", "Major"];

// const COIN_SELECT_BG: Record<number, string> = {
//   4:  "bg-emerald-700",
//   9:  "bg-sky-700",
//   14: "bg-orange-700",
//   19: "bg-pink-700",
// };

// const FEATURE_BADGE: Record<string, string> = {
//   extra:  "bg-emerald-900 text-emerald-300 border border-emerald-600",
//   zone:   "bg-sky-900 text-sky-300 border border-sky-600",
//   strike: "bg-orange-900 text-orange-300 border border-orange-600",
// };

// type Props = {
//   baseCoins: ComboCoin[];
//   config:    ComboFeatureConfig;
//   onSpin:    (snapshot: ComboCoin[]) => void;
//   onReset:   () => void;
// };

// // ─────────────────────────────────────────────────────────────────────────────
// export default function CombinationFeature({ baseCoins, config, onSpin, onReset }: Props) {
//   const MAX_SPINS   = getComboMaxSpins(config);
//   const coinColors  = getComboCoinColors(config.features);
//   const defaultCode = coinColors[0].value;

//   const [isOpen,   setIsOpen]   = useState(true);
//   const [coins,    setCoins]    = useState<ComboCoin[]>([]);
//   const [spinsLeft, setSpinsLeft] = useState(MAX_SPINS);
//   const lastSpinPositions = useRef<Set<number>>(new Set());

//   // Re-seed on base coin or config change
//   useEffect(() => {
//     const seeded = baseCoins.map((c) => ({ ...c, fromBase: true }));
//     setCoins(seeded);
//     setSpinsLeft(getComboMaxSpins(config));
//     lastSpinPositions.current = new Set(seeded.map((c) => c.position));
//   }, [JSON.stringify(baseCoins), JSON.stringify(config)]);

//   // ── Helpers ───────────────────────────────────────────────────
//   const coinAt = (pos: number) => coins.find((c) => c.position === pos);

//   const handleCellClick = (pos: number) => {
//     if (coinAt(pos)) return;
//     setCoins((prev) => [
//       ...prev,
//       { position: pos, colorCode: defaultCode, value: COIN_VALUES[0], winged: false },
//     ]);
//   };

//   const removeCoin = (pos: number) => {
//     const c = coinAt(pos);
//     if (!c || c.fromBase) return;
//     setCoins((prev) => prev.filter((x) => x.position !== pos));
//   };

//   const updateCoin = (pos: number, field: keyof ComboCoin, val: any) =>
//     setCoins((prev) => prev.map((c) => (c.position === pos ? { ...c, [field]: val } : c)));

//   const toggleWinged = (pos: number, e: React.MouseEvent) => {
//     e.stopPropagation();
//     const c = coinAt(pos);
//     if (!c) return;
//     setCoins((prev) =>
//       prev.map((x) =>
//         x.position === pos
//           ? { ...x, winged: !x.winged, boostValue: x.winged ? undefined : x.boostValue }
//           : x
//       )
//     );
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

//   // ── Render ────────────────────────────────────────────────────
//   return (
//     <div className="bg-gray-800 rounded-xl">

//       {/* HEADER */}
//       <div
//         onClick={() => setIsOpen(!isOpen)}
//         className="flex justify-between items-center p-4 cursor-pointer"
//       >
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
//         </div>
//         <span className="text-white">{isOpen ? "▼" : "▶"}</span>
//       </div>

//       {isOpen && (
//         <div className="p-6 pt-0 flex flex-col gap-4">

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
//               {spinsLeft} spin{spinsLeft !== 1 ? "s" : ""} left
//               {config.hasExtra && <span className="ml-1 text-emerald-400 text-xs">(4 — Extra)</span>}
//             </span>

//             <button onClick={resetFeature} className="px-3 py-1 bg-gray-600 hover:bg-gray-500 rounded text-sm">
//               Reset
//             </button>
//           </div>

//           {/* GRID — 5 cols × 3 rows, column-major */}
//           <div className="grid gap-1" style={{ gridTemplateColumns: "repeat(5, minmax(0, 1fr))" }}>
//             {Array.from({ length: 3 }).map((_, row) =>
//               Array.from({ length: 5 }).map((_, col) => {
//                 const pos  = col * 3 + row;
//                 const coin = coinAt(pos);

//                 // Zone background applied to every cell if zone is active
//                 const zoneBg   = config.hasZone ? getZoneBgColor(pos, activeSplitter) : null;
//                 const cellBg   = zoneBg
//                   ? `${ZONE_BG_CLASS[zoneBg]} ${ZONE_BORDER_CLASS[zoneBg]}`
//                   : "bg-gray-700 border-gray-600";
//                 const hoverCls = !coin && !config.hasZone ? "hover:bg-gray-600 hover:border-gray-400" : "";

//                 return (
//                   <div
//                     key={pos}
//                     onClick={() => !coin && handleCellClick(pos)}
//                     className={`relative rounded-lg border-2 flex flex-col items-center justify-center p-1 min-h-[100px] text-xs text-white cursor-pointer transition-all hover:brightness-110 ${cellBg} ${hoverCls}`}
//                   >
//                     {/* Position index */}
//                     <div className="text-[9px] opacity-50 absolute top-1 left-1">{pos}</div>

//                     {coin ? (
//                       <div className="flex flex-col items-center w-full gap-1 mt-2 px-0.5">

//                         {/* Coin emoji — toggleable if strike is in combo */}
//                         {config.hasStrike ? (
//                           <button
//                             onClick={(e) => toggleWinged(pos, e)}
//                             title="Click to toggle winged / plain"
//                             className={`text-sm leading-none px-1 py-0.5 rounded transition-all ${
//                               coin.winged
//                                 ? "bg-yellow-500/20 text-yellow-200 ring-1 ring-yellow-400"
//                                 : "text-yellow-300 hover:bg-yellow-500/10"
//                             }`}
//                           >
//                             {coin.winged ? "🪽🟡🪽" : "🟡"}
//                           </button>
//                         ) : (
//                           <div className="text-base leading-none">🟡</div>
//                         )}

//                         {/* Color dropdown — options specific to this combination */}
//                         <select
//                           className={`text-white text-[10px] w-full rounded px-0.5 py-0.5 ${COIN_SELECT_BG[coin.colorCode] ?? "bg-gray-600"} border-0`}
//                           value={coin.colorCode}
//                           onClick={(e) => e.stopPropagation()}
//                           onChange={(e) => updateCoin(pos, "colorCode", Number(e.target.value))}
//                         >
//                           {coinColors.map((c) => (
//                             <option key={c.value} value={c.value} className="bg-gray-800">{c.label}</option>
//                           ))}
//                         </select>

//                         {/* Value dropdown */}
//                         <select
//                           className={`text-white text-[10px] w-full rounded px-0.5 py-0.5 ${COIN_SELECT_BG[coin.colorCode] ?? "bg-gray-600"} border-0`}
//                           value={coin.value}
//                           onClick={(e) => e.stopPropagation()}
//                           onChange={(e) => updateCoin(pos, "value", e.target.value)}
//                         >
//                           {COIN_VALUES.map((v) => (
//                             <option key={v} value={v} className="bg-gray-800">{v}</option>
//                           ))}
//                         </select>

//                         {/* Boost dropdown — only when strike is active and coin is winged */}
//                         {config.hasStrike && coin.winged && (
//                           <select
//                             className="text-white text-[10px] w-full rounded px-0.5 py-0.5 bg-yellow-700 border-0"
//                             value={coin.boostValue ?? ""}
//                             onClick={(e) => e.stopPropagation()}
//                             onChange={(e) => updateCoin(pos, "boostValue", e.target.value)}
//                           >
//                             <option value="" className="bg-gray-800">Boost val</option>
//                             {STRIKE_BOOST_VALUES.map((v) => (
//                               <option key={v} value={v} className="bg-gray-800">{v}</option>
//                             ))}
//                           </select>
//                         )}

//                         {/* Remove (non-base coins only) */}
//                         {!coin.fromBase && (
//                           <button
//                             onClick={(e) => { e.stopPropagation(); removeCoin(pos); }}
//                             className="absolute top-1 right-1 text-[10px] text-red-300 hover:text-red-100 font-bold"
//                           >
//                             ✕
//                           </button>
//                         )}
//                       </div>
//                     ) : (
//                       <span className="text-white/40 text-[10px]">+ Add</span>
//                     )}
//                   </div>
//                 );
//               })
//             )}
//           </div>

//           {/* LEGEND */}
//           <div className="text-xs text-gray-400 flex flex-wrap gap-3">
//             <span>🟡 = coin</span>
//             {config.hasStrike && <span>🪽🟡🪽 = winged — click emoji to toggle</span>}
//             {config.hasZone   && <span>Background = zone regions (splitter {config.splitter})</span>}
//             <span>Click empty cell to add coin</span>
//           </div>

//         </div>
//       )}
//     </div>
//   );
// }



//! right

// /* eslint-disable @typescript-eslint/no-explicit-any */
// "use client";

// import { useState, useEffect, useRef } from "react";
// import {
//   ComboCoin, ComboFeatureConfig,
//   getComboMaxSpins, getComboCoinColors,
// } from "./combinationFeatureGenerator";
// import { ZONE_BG_CLASS, ZONE_BORDER_CLASS, getZoneBgColor } from "../zone/zoneFeatureGenerator";
// import { STRIKE_BOOST_VALUES } from "../strike/strikeFeatureGenerator";
// import { SPLIT_COUNT_OPTIONS, SPLIT_BOOST_VALUES } from "../split/splitFeatureGenerator";

// const COIN_VALUES = ["0.75", "1", "2", "5", "Minor", "Major"];
// const COIN_SELECT_BG: Record<number, string> = {
//   4:"bg-emerald-700", 9:"bg-sky-700", 14:"bg-orange-700", 19:"bg-pink-700",
// };
// const FEATURE_BADGE: Record<string, string> = {
//   extra:  "bg-emerald-900 text-emerald-300 border border-emerald-600",
//   zone:   "bg-sky-900 text-sky-300 border border-sky-600",
//   strike: "bg-orange-900 text-orange-300 border border-orange-600",
//   split:  "bg-pink-900 text-pink-300 border border-pink-600",
// };

// type Props = {
//   baseCoins: ComboCoin[];
//   config:    ComboFeatureConfig;
//   onSpin:    (snapshot: ComboCoin[]) => void;
//   onReset:   () => void;
// };

// // Ghost cell shown for each extra split copy (coins 2, 3, 4)
// function SplitGhost({ idx, coin, isStrikeCombo, onBoostChange }: {
//   idx: number; coin: ComboCoin; isStrikeCombo: boolean;
//   onBoostChange: (i: number, v: string) => void;
// }) {
//   return (
//     <div className="rounded border border-dashed border-pink-400/50 bg-pink-950/30 flex flex-col items-center justify-center p-1 min-h-[55px] text-[9px] text-pink-200 gap-0.5">
//       <span className="opacity-40">split {idx + 1}</span>
//       <span className="text-sm">🟡</span>
//       {isStrikeCombo && coin.winged && (
//         <select
//           className="text-white text-[9px] w-full rounded bg-yellow-800 border-0 mt-0.5"
//           value={coin.splitBoostValues?.[idx - 1] ?? ""}
//           onClick={(e) => e.stopPropagation()}
//           onChange={(e) => onBoostChange(idx - 1, e.target.value)}
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

// export default function CombinationFeature({ baseCoins, config, onSpin, onReset }: Props) {
//   const MAX_SPINS  = getComboMaxSpins(config);
//   const coinColors = getComboCoinColors(config.features);
//   const defaultCode = coinColors[0].value;

//   const [isOpen,    setIsOpen]    = useState(true);
//   const [coins,     setCoins]     = useState<ComboCoin[]>([]);
//   const [spinsLeft, setSpinsLeft] = useState(MAX_SPINS);
//   const lastSpinPositions = useRef<Set<number>>(new Set());

//   useEffect(() => {
//     const seeded = baseCoins.map((c) => ({ ...c, fromBase: true }));
//     setCoins(seeded);
//     setSpinsLeft(getComboMaxSpins(config));
//     lastSpinPositions.current = new Set(seeded.map((c) => c.position));
//   }, [JSON.stringify(baseCoins), JSON.stringify(config)]);

//   const coinAt = (pos: number) => coins.find((c) => c.position === pos);

//   const handleCellClick = (pos: number) => {
//     if (coinAt(pos)) return;
//     setCoins((prev) => [...prev, {
//       position: pos, colorCode: defaultCode, value: COIN_VALUES[0],
//       winged: false, splitCount: 1,
//     }]);
//   };

//   const removeCoin = (pos: number) => {
//     const c = coinAt(pos);
//     if (!c || c.fromBase) return;
//     setCoins((prev) => prev.filter((x) => x.position !== pos));
//   };

//   const updateCoin = (pos: number, field: keyof ComboCoin, val: any) =>
//     setCoins((prev) => prev.map((c) => c.position === pos ? { ...c, [field]: val } : c));

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

//   return (
//     <div className="bg-gray-800 rounded-xl">

//       {/* HEADER */}
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
//         </div>
//         <span className="text-white">{isOpen ? "▼" : "▶"}</span>
//       </div>

//       {isOpen && (
//         <div className="p-6 pt-0 flex flex-col gap-4">

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
//               {spinsLeft} spin{spinsLeft !== 1 ? "s" : ""} left
//               {config.hasExtra && <span className="ml-1 text-emerald-400 text-xs">(4 — Extra)</span>}
//             </span>
//             <button onClick={resetFeature} className="px-3 py-1 bg-gray-600 hover:bg-gray-500 rounded text-sm">Reset</button>
//           </div>

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

//                 return (
//                   <div key={pos} className="flex flex-col gap-1">

//                     {/* PRIMARY CELL */}
//                     <div
//                       onClick={() => !coin && handleCellClick(pos)}
//                       className={`relative rounded-lg border-2 flex flex-col items-center justify-center p-1 min-h-[100px] text-xs text-white cursor-pointer transition-all hover:brightness-110 ${cellBg}
//                         ${!coin && !config.hasZone ? "hover:bg-gray-600 hover:border-gray-400" : ""}
//                         ${coin && config.hasSplit ? "border-pink-500/60" : ""}
//                       `}
//                     >
//                       <div className="text-[9px] opacity-50 absolute top-1 left-1">{pos}</div>

//                       {coin ? (
//                         <div className="flex flex-col items-center w-full gap-1 mt-2 px-0.5">

//                           {/* Coin toggle: winged if strike in combo */}
//                           {config.hasStrike ? (
//                             <button
//                               onClick={(e) => toggleWinged(pos, e)}
//                               title="Click to toggle winged/plain"
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

//                           {/* Color dropdown — combination-specific */}
//                           <select
//                             className={`text-white text-[10px] w-full rounded px-0.5 py-0.5 ${COIN_SELECT_BG[coin.colorCode] ?? "bg-gray-600"} border-0`}
//                             value={coin.colorCode}
//                             onClick={(e) => e.stopPropagation()}
//                             onChange={(e) => updateCoin(pos, "colorCode", Number(e.target.value))}
//                           >
//                             {coinColors.map((c) => (
//                               <option key={c.value} value={c.value} className="bg-gray-800">{c.label}</option>
//                             ))}
//                           </select>

//                           {/* Value dropdown */}
//                           <select
//                             className={`text-white text-[10px] w-full rounded px-0.5 py-0.5 ${COIN_SELECT_BG[coin.colorCode] ?? "bg-gray-600"} border-0`}
//                             value={coin.value}
//                             onClick={(e) => e.stopPropagation()}
//                             onChange={(e) => updateCoin(pos, "value", e.target.value)}
//                           >
//                             {COIN_VALUES.map((v) => (
//                               <option key={v} value={v} className="bg-gray-800">{v}</option>
//                             ))}
//                           </select>

//                           {/* Boost coin 1 — strike active and winged */}
//                           {config.hasStrike && coin.winged && (
//                             <select
//                               className="text-white text-[10px] w-full rounded px-0.5 py-0.5 bg-yellow-700 border-0"
//                               value={coin.boostValue ?? ""}
//                               onClick={(e) => e.stopPropagation()}
//                               onChange={(e) => updateCoin(pos, "boostValue", e.target.value)}
//                             >
//                               <option value="" className="bg-gray-800">Boost (coin 1)</option>
//                               {STRIKE_BOOST_VALUES.map((v) => (
//                                 <option key={v} value={v} className="bg-gray-800">{v}</option>
//                               ))}
//                             </select>
//                           )}

//                           {/* Split count dropdown — split active */}
//                           {config.hasSplit && (
//                             <select
//                               className="text-white text-[10px] w-full rounded px-0.5 py-0.5 bg-pink-700 border-0"
//                               value={coin.splitCount ?? 1}
//                               onClick={(e) => e.stopPropagation()}
//                               onChange={(e) => {
//                                 const sc = Number(e.target.value);
//                                 updateCoin(pos, "splitCount", sc);
//                                 if (sc <= 1) updateCoin(pos, "splitBoostValues" as any, []);
//                               }}
//                             >
//                               {SPLIT_COUNT_OPTIONS.map((n) => (
//                                 <option key={n} value={n} className="bg-gray-800">Split × {n}</option>
//                               ))}
//                             </select>
//                           )}

//                           {/* Remove (non-base only) */}
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
//                     {coin && config.hasSplit && (coin.splitCount ?? 1) > 1 &&
//                       Array.from({ length: (coin.splitCount ?? 1) - 1 }).map((_, idx) => (
//                         <SplitGhost
//                           key={idx}
//                           idx={idx + 1}
//                           coin={coin}
//                           isStrikeCombo={config.hasStrike}
//                           onBoostChange={(i, v) => updateSplitBoost(pos, i, v)}
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
//             <span>🟡 = coin</span>
//             {config.hasStrike && <span>🪽🟡🪽 = winged — click to toggle</span>}
//             {config.hasSplit  && <span>Split × N = coin copies below</span>}
//             {config.hasStrike && config.hasSplit && <span>Ghost cells get boost for strike</span>}
//             {config.hasZone   && <span>Background = zone (splitter {config.splitter})</span>}
//             <span>Click empty cell to add</span>
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
} from "./combinationFeatureGenerator";
import { ZONE_BG_CLASS, ZONE_BORDER_CLASS, getZoneBgColor } from "../zone/zoneFeatureGenerator";
import { STRIKE_BOOST_VALUES } from "../strike/strikeFeatureGenerator";
import { SPLIT_COUNT_OPTIONS, SPLIT_BOOST_VALUES } from "../split/splitFeatureGenerator";

const COIN_VALUES = ["1", "2", "5", "Minor", "Major" , "Mini"];
// const COIN_SELECT_BG: Record<number, string> = {
//   4:"bg-emerald-700", 9:"bg-sky-700", 14:"bg-orange-700", 19:"bg-pink-700" , 10:"bg-black-700" , 11:"bg-gold-700",
// };
const FEATURE_BADGE: Record<string, string> = {
  extra:  "bg-emerald-900 text-emerald-300 border border-emerald-600",
  zone:   "bg-sky-900 text-sky-300 border border-sky-600",
  strike: "bg-orange-900 text-orange-300 border border-orange-600",
  split:  "bg-pink-900 text-pink-300 border border-pink-600",
};

type Props = {
  baseCoins: ComboCoin[];
  config:    ComboFeatureConfig;
  onSpin:    (snapshot: ComboCoin[]) => void;
  onReset:   () => void;
};

// Ghost cell shown for each extra split copy (coins 2, 3, 4)
function SplitGhost({ idx, coin, isStrikeCombo, onBoostChange }: {
  idx: number; coin: ComboCoin; isStrikeCombo: boolean;
  onBoostChange: (i: number, v: string) => void;
}) {
  return (
    <div className="rounded border border-dashed border-pink-400/50 bg-pink-950/30 flex flex-col items-center justify-center p-1 min-h-[55px] text-[9px] text-pink-200 gap-0.5">
      <span className="opacity-40">split {idx + 1}</span>
      <span className="text-sm">🟡</span>
      {isStrikeCombo && coin.winged && (
        <select
          className="text-white text-[9px] w-full rounded bg-yellow-800 border-0 mt-0.5"
          value={coin.splitBoostValues?.[idx - 1] ?? ""}
          onClick={(e) => e.stopPropagation()}
          onChange={(e) => onBoostChange(idx - 1, e.target.value)}
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

export default function CombinationFeature({ baseCoins, config, onSpin, onReset }: Props) {
  const MAX_SPINS  = getComboMaxSpins(config);
  const coinColors = getComboCoinColors(config.features);
  const defaultCode = coinColors[0].value;

  const [isOpen,    setIsOpen]    = useState(true);
  const initialSeeds = baseCoins.map((c) => ({ ...c, fromBase: true }));
  const [coins,     setCoins]     = useState<ComboCoin[]>(initialSeeds);
  const [spinsLeft, setSpinsLeft] = useState(MAX_SPINS);
  const lastSpinPositions = useRef<Set<number>>(new Set(initialSeeds.map((c) => c.position)));

  const coinAt = (pos: number) => coins.find((c) => c.position === pos);

  const handleCellClick = (pos: number) => {
    if (coinAt(pos)) return;
    setCoins((prev) => [...prev, {
      position: pos, colorCode: defaultCode, value: COIN_VALUES[0],
      winged: false, splitCount: 1,
    }]);
  };

  const removeCoin = (pos: number) => {
    const c = coinAt(pos);
    if (!c || c.fromBase) return;
    setCoins((prev) => prev.filter((x) => x.position !== pos));
  };

  const updateCoin = (pos: number, field: keyof ComboCoin, val: any) =>
    setCoins((prev) => prev.map((c) => c.position === pos ? { ...c, [field]: val } : c));

  const updateSplitBoost = (pos: number, idx: number, val: string) =>
    setCoins((prev) => prev.map((c) => {
      if (c.position !== pos) return c;
      const arr = [...(c.splitBoostValues ?? [])];
      arr[idx] = val;
      return { ...c, splitBoostValues: arr };
    }));

  const toggleWinged = (pos: number, e: React.MouseEvent) => {
    e.stopPropagation();
    const c = coinAt(pos);
    if (!c) return;
    setCoins((prev) => prev.map((x) =>
      x.position === pos
        ? { ...x, winged: !x.winged, boostValue: x.winged ? undefined : x.boostValue }
        : x
    ));
  };

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
    onReset();
  };

  const activeSplitter = config.hasZone ? (config.splitter ?? 1) : 0;

  return (
    <div className="bg-gray-800 rounded-xl">

      {/* HEADER */}
      <div onClick={() => setIsOpen(!isOpen)} className="flex justify-between items-center p-4 cursor-pointer">
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
        </div>
        <span className="text-white">{isOpen ? "▼" : "▶"}</span>
      </div>

      {isOpen && (
        <div className="p-6 pt-0 flex flex-col gap-4">

          {/* SPIN CONTROLS */}
          <div className="flex items-center gap-4 flex-wrap">
            <button
              onClick={handleSpin}
              disabled={spinsLeft <= 0}
              className={`px-6 py-2 rounded font-bold text-white transition-all ${
                spinsLeft > 0 ? "bg-purple-600 hover:bg-purple-500" : "bg-gray-600 cursor-not-allowed opacity-50"
              }`}
            >
              SPIN
            </button>
            <span className="text-sm text-gray-300">
              {spinsLeft} spin{spinsLeft !== 1 ? "s" : ""} left
              {/* {config.hasExtra && <span className="ml-1 text-emerald-400 text-xs">(4 — Extra)</span>} */}
            </span>
            <button onClick={resetFeature} className="px-3 py-1 bg-gray-600 hover:bg-gray-500 rounded text-sm">Reset</button>
          </div>

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

                return (
                  <div key={pos} className="flex flex-col gap-1">

                    {/* PRIMARY CELL */}
                    <div
                      onClick={() => !coin && handleCellClick(pos)}
                      className={`relative rounded-lg border-2 flex flex-col items-center justify-center p-1 min-h-[100px] text-xs text-white cursor-pointer transition-all hover:brightness-110 ${cellBg}
                        ${!coin && !config.hasZone ? "hover:bg-gray-600 hover:border-gray-400" : ""}
                        ${coin && config.hasSplit ? "border-pink-500/60" : ""}
                      `}
                    >
                      <div className="text-[9px] opacity-50 absolute top-1 left-1">{pos}</div>

                      {coin ? (
                        <div className="flex flex-col items-center w-full gap-1 mt-2 px-0.5">

                          {/* Coin toggle: winged if strike in combo */}
                          {config.hasStrike ? (
                            <button
                              onClick={(e) => toggleWinged(pos, e)}
                              title="Click to toggle winged/plain"
                              className={`text-sm leading-none px-1 py-0.5 rounded transition-all ${
                                coin.winged
                                  ? "bg-yellow-500/20 text-yellow-200 ring-1 ring-yellow-400"
                                  : "text-yellow-300 hover:bg-yellow-500/10"
                              }`}
                            >
                              {coin.winged ? "🪽🟡🪽" : "🟡"}
                            </button>
                          ) : (
                            <div className="text-base leading-none">🟡</div>
                          )}

                          {/* Color dropdown — combination-specific */}
                          <select
                            // className={`text-white text-[10px] w-full rounded px-0.5 py-0.5 ${COIN_SELECT_BG[coin.colorCode] ?? "bg-gray-600"} border-0`}
                            className={`text-white text-[10px] w-full rounded px-0.5 py-0.5 "bg-gray-600"} border-0`}
                            value={coin.colorCode}
                            onClick={(e) => e.stopPropagation()}
                            onChange={(e) => updateCoin(pos, "colorCode", Number(e.target.value))}
                          >
                            {coinColors.map((c) => (
                              <option key={c.value} value={c.value} className="bg-gray-800">{c.label}</option>
                            ))}
                          </select>

                          {/* Value dropdown */}
                          <select
                            // className={`text-white text-[10px] w-full rounded px-0.5 py-0.5 ${COIN_SELECT_BG[coin.colorCode] ?? "bg-gray-600"} border-0`}
                            className={`text-white text-[10px] w-full rounded px-0.5 py-0.5 "bg-gray-600"} border-0`}
                            value={coin.value}
                            onClick={(e) => e.stopPropagation()}
                            onChange={(e) => updateCoin(pos, "value", e.target.value)}
                          >
                            {COIN_VALUES.map((v) => (
                              <option key={v} value={v} className="bg-gray-800">{v}</option>
                            ))}
                          </select>

                          {/* Boost coin 1 — strike active and winged */}
                          {config.hasStrike && coin.winged && (
                            <select
                              className="text-white text-[10px] w-full rounded px-0.5 py-0.5 bg-yellow-700 border-0"
                              value={coin.boostValue ?? ""}
                              onClick={(e) => e.stopPropagation()}
                              onChange={(e) => updateCoin(pos, "boostValue", e.target.value)}
                            >
                              <option value="" className="bg-gray-800">Boost (coin 1)</option>
                              {STRIKE_BOOST_VALUES.map((v) => (
                                <option key={v} value={v} className="bg-gray-800">{v}</option>
                              ))}
                            </select>
                          )}

                          {/* Split count dropdown — split active */}
                          {config.hasSplit && (
                            <select
                              className="text-white text-[10px] w-full rounded px-0.5 py-0.5 bg-pink-700 border-0"
                              value={coin.splitCount ?? 1}
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
                          )}

                          {/* Remove (non-base only) */}
                          {!coin.fromBase && (
                            <button
                              onClick={(e) => { e.stopPropagation(); removeCoin(pos); }}
                              className="absolute top-1 right-1 text-[10px] text-red-300 hover:text-red-100 font-bold"
                            >✕</button>
                          )}
                        </div>
                      ) : (
                        <span className="text-white/40 text-[10px]">+ Add</span>
                      )}
                    </div>

                    {/* GHOST CELLS for extra split copies */}
                    {coin && config.hasSplit && (coin.splitCount ?? 1) > 1 &&
                      Array.from({ length: (coin.splitCount ?? 1) - 1 }).map((_, idx) => (
                        <SplitGhost
                          key={idx}
                          idx={idx + 1}
                          coin={coin}
                          isStrikeCombo={config.hasStrike}
                          onBoostChange={(i, v) => updateSplitBoost(pos, i, v)}
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
            {/* <span>🟡 = coin</span> */}
            {/* {config.hasStrike && <span>🪽🟡🪽 = winged — click to toggle</span>} */}
            {config.hasSplit  && <span>Split × N = coin copies below</span>}
            {config.hasStrike && config.hasSplit && <span>Ghost cells get boost for strike</span>}
            {config.hasZone   && <span>Background = zone (splitter {config.splitter})</span>}
            {/* <span>Click empty cell to add</span> */}
          </div>

        </div>
      )}
    </div>
  );
}