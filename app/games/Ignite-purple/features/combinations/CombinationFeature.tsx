





// //! latest----------
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
// const COMBO_COIN_VALUES = ["1", "2", "5", "100" , "Minor", "Major", "Mini"];
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

//   // Seed initializer — migrate legacy wingedCopyIdx → wingedCopyIdxs array
//   const seedCoins = (src: ComboCoin[]) => src.map((c) => ({
//     ...c,
//     fromBase: true,
//     wingedCopyIdxs: c.wingedCopyIdxs !== undefined
//       ? c.wingedCopyIdxs
//       : (config.hasStrike && c.winged ? [0] : undefined),
//     splitBoostValues: c.splitBoostValues
//       ?? (config.hasStrike && c.winged && c.boostValue ? [c.boostValue] : undefined),
//   }));

//   const [coins,     setCoins]     = useState<ComboCoin[]>(() => seedCoins(baseCoins));
//   const [spinsLeft, setSpinsLeft] = useState(MAX_SPINS);
//   const lastSpinPositions = useRef<Set<number>>(new Set(baseCoins.map((c) => c.position)));

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

//   // Toggle a copy's winged state — adds or removes from wingedCopyIdxs array.
//   // Multiple copies can be winged simultaneously.
//   const toggleWingedCopy = (pos: number, copyIdx: number) =>
//     setCoins((prev) => prev.map((c) => {
//       if (c.position !== pos) return c;
//       const current = c.wingedCopyIdxs ?? [];
//       const alreadyWinged = current.includes(copyIdx);
//       return {
//         ...c,
//         wingedCopyIdxs: alreadyWinged
//           ? current.filter((i) => i !== copyIdx)
//           : [...current, copyIdx],
//       };
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
//     const seeded = seedCoins(baseCoins);
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

//                           {/* Winged toggle — checkbox per copy, multiple allowed */}
//                           {config.hasStrike ? (
//                             <div className="flex flex-col items-center w-full gap-0.5">
//                               <div className="text-sm leading-none">
//                                 {(coin.wingedCopyIdxs?.includes(0)) ? "🪽🟡🪽" : "🟡"}
//                               </div>
//                               <div className="flex items-center gap-1 w-full" onClick={(e) => e.stopPropagation()}>
//                                 <input
//                                   type="checkbox"
//                                   className="accent-yellow-400 w-2.5 h-2.5 cursor-pointer"
//                                   checked={coin.wingedCopyIdxs?.includes(0) ?? false}
//                                   onChange={() => toggleWingedCopy(pos, 0)}
//                                 />
//                                 <span className="text-[8px] text-yellow-300">winged</span>
//                               </div>
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

//                           {/* Boost — only shown when copy 0 is winged */}
//                           {config.hasStrike && (coin.wingedCopyIdxs?.includes(0)) && (
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
//                         const isWinged = coin.wingedCopyIdxs?.includes(copyIdx) ?? false;
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
//                                   type="checkbox"
//                                   className="accent-yellow-400 w-2.5 h-2.5 cursor-pointer"
//                                   checked={isWinged}
//                                   onChange={() => toggleWingedCopy(pos, copyIdx)}
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
//             {config.hasStrike && <span>🪽🟡🪽 = winged — ☑ checkbox per copy, multiple copies can be winged</span>}
//             {config.hasSplit  && <span>Split × N = N copies (copy 0…N-1), each has its own value</span>}
//             {config.hasZone   && <span>Background = zone regions (splitter {config.splitter})</span>}
//             <span>✦ radio = upgrade · single-color = 1 feature · All-Color = multi-feature · Gold = no upgrade</span>
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
 
  // Seed initializer — migrate legacy wingedCopyIdx → wingedCopyIdxs array.
  // For base coins with a split count > 1, the base game applies the same
  // boost value to every split copy, so we expand the single legacy
  // boostValue into a full splitBoostValues array (one entry per copy).
  const seedCoins = (src: ComboCoin[]) => src.map((c) => {
    const wingedCopyIdxs = c.wingedCopyIdxs !== undefined
      ? c.wingedCopyIdxs
      : (config.hasStrike && c.winged ? [0] : undefined);
    const splitCount = c.splitCount ?? 1;
    const splitBoostValues = c.splitBoostValues
      ?? (config.hasStrike && c.winged && c.boostValue
            ? Array.from({ length: splitCount }, () => c.boostValue as string)
            : undefined);
    return { ...c, fromBase: true, wingedCopyIdxs, splitBoostValues };
  });
 
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
 
  // Toggle the coin's winged state. Winged is now a single, position-level
  // flag (carried on copy 0) — if a coin is winged, every split copy at that
  // position is implicitly winged too, so there's no per-copy toggle anymore.
  const toggleWinged = (pos: number) =>
    setCoins((prev) => prev.map((c) => {
      if (c.position !== pos) return c;
      const isWinged = c.wingedCopyIdxs?.includes(0) ?? false;
      return { ...c, wingedCopyIdxs: isWinged ? [] : [0] };
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
                                  onChange={() => toggleWinged(pos)}
                                  title={config.hasSplit ? "Winged applies to this coin and all of its split copies" : "Toggle winged"}
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
                        // Winged is a single, position-level flag carried on copy 0 — every
                        // split copy automatically inherits it, there's no per-copy toggle.
                        const isWinged = coin.wingedCopyIdxs?.includes(0) ?? false;
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
                              <span className="text-[8px] text-yellow-300/70 mt-0.5">
                                {isWinged ? "🪽 winged (follows main coin)" : "not winged"}
                              </span>
                            )}
                            {/* Boost — available on every split coin, even when not winged,
                                so values can be set ahead of time. Only used in the output
                                when the main coin (copy 0) is toggled winged. */}
                            {config.hasStrike && (
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
            {config.hasStrike && <span>🪽🟡🪽 = winged — toggle on the main coin only; all of its split copies inherit it automatically</span>}
            {config.hasSplit  && <span>Split × N = N copies (copy 0…N-1), each has its own value</span>}
            {config.hasZone   && <span>Background = zone regions (splitter {config.splitter})</span>}
            <span>✦ radio = upgrade · single-color = 1 feature · All-Color = multi-feature · Gold = no upgrade</span>
          </div>
 
        </div>
      )}
    </div>
  );
}