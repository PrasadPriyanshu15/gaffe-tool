



// // // //?new latest 
// // /* eslint-disable @typescript-eslint/no-explicit-any */
// // "use client";

// // import { useState, useRef } from "react";
// // import {
// //   ComboCoin, ComboFeatureConfig,
// //   getComboMaxSpins, getComboCoinColors,
// //   generateCombinationGaffe, resolveUpgradeFeatures, UpgradeInfo,
// // } from "./combinationFeatureGenerator";
// // import { ZONE_BG_CLASS, ZONE_BORDER_CLASS, getZoneBgColor } from "./zoneFeatureGenerator";
// // import { ULTRA_BOOST_VALUES } from "./ultraFeatureGenerator";
// // import { posToMetric, ALL_UPGRADE_FEATURES } from "./config";

// // // ── Constants ─────────────────────────────────────────────────────────────────
// // // Fix #5: uppercase coin values
// // const COMBO_COIN_VALUES = ["100", "250", "500", "MINOR", "MAJOR", "MINI"];

// // const FEATURE_BADGE: Record<string, string> = {
// //   double: "bg-red-900 text-red-300 border border-red-600",
// //   extra:  "bg-emerald-900 text-emerald-300 border border-emerald-600",
// //   zone:   "bg-sky-900 text-sky-300 border border-sky-600",
// //   ultra:  "bg-purple-900 text-purple-300 border border-purple-600",
// // };

// // // ── Props ─────────────────────────────────────────────────────────────────────
// // type Props = {
// //   baseCoins: ComboCoin[];
// //   config:    ComboFeatureConfig;
// //   onSpin:    (snapshot: ComboCoin[], line: string) => void;
// //   onReset:   () => void;
// //   onUpgrade: (newFeatures: string[], carryCoins: ComboCoin[]) => void;
// // };

// // // ── Component ─────────────────────────────────────────────────────────────────
// // export default function CombinationFeature({ baseCoins, config, onSpin, onReset, onUpgrade }: Props) {
// //   const MAX_SPINS  = getComboMaxSpins(config);
// //   const coinColors = getComboCoinColors(config.features);
// //   const defaultCode = coinColors[0].value;

// //   const [isOpen,    setIsOpen]    = useState(true);
// //   const initialSeeds = baseCoins.map(c => ({ ...c, fromBase: true }));
// //   const [coins,     setCoins]     = useState<ComboCoin[]>(initialSeeds);
// //   const [spinsLeft, setSpinsLeft] = useState(MAX_SPINS);
// //   const lastSpinPositions = useRef<Set<number>>(new Set(initialSeeds.map(c => c.position)));

// //   // Upgrade state
// //   const [upgradePos,      setUpgradePos]      = useState<number | null>(null);
// //   const [upgradeFeatSel,  setUpgradeFeatSel]  = useState<string>("");
// //   const [upgradeMultiSel, setUpgradeMultiSel] = useState<Set<string>>(new Set());

// //   const coinAt = (pos: number) => coins.find(c => c.position === pos);

// //   // ── Coin operations ──────────────────────────────────────────────────────
// //   const handleCellClick = (pos: number) => {
// //     if (coinAt(pos)) return;
// //     setCoins(prev => [...prev, {
// //       position: pos, colorCode: defaultCode, value: COMBO_COIN_VALUES[0],
// //       leftValue: "", rightValue: "", boostValue: "", boostSide: null,
// //     }]);
// //   };

// //   const removeCoin = (pos: number) => {
// //     const c = coinAt(pos);
// //     if (!c || c.fromBase) return;
// //     if (upgradePos === pos) {
// //       setUpgradePos(null); setUpgradeFeatSel(""); setUpgradeMultiSel(new Set());
// //     }
// //     setCoins(prev => prev.filter(x => x.position !== pos));
// //   };

// //   const updateCoin = (pos: number, field: keyof ComboCoin, val: any) =>
// //     setCoins(prev => prev.map(c => c.position === pos ? { ...c, [field]: val } : c));

// //   const setBoostSide = (pos: number, side: "LEFT" | "RIGHT", boostVal: string) => {
// //     setCoins(prev => prev.map(c => {
// //       if (c.position !== pos) return c;
// //       if (!boostVal) return { ...c, boostValue: "", boostSide: null };
// //       return { ...c, boostValue: boostVal, boostSide: side };
// //     }));
// //   };

// //   // ── Upgrade radio ────────────────────────────────────────────────────────
// //   const handleUpgradeRadio = (pos: number) => {
// //     if (upgradePos === pos) {
// //       setUpgradePos(null); setUpgradeFeatSel(""); setUpgradeMultiSel(new Set()); return;
// //     }
// //     setUpgradePos(pos); setUpgradeFeatSel(""); setUpgradeMultiSel(new Set());
// //   };

// //   const upgradeCoinn = upgradePos !== null ? coinAt(upgradePos) : null;

// //   // AllColor = the coin whose label starts with "AllColor" in this combo's palette
// //   const allColorEntry = coinColors.find(c => c.label.startsWith("AllColor"));
// //   const isAllColor = !!(upgradeCoinn && allColorEntry && upgradeCoinn.colorCode === allColorEntry.value);

// //   // Gold coins (label starts with "Gold") have no upgrade
// //   const goldCodes = new Set(coinColors.filter(c => c.label.startsWith("Gold")).map(c => c.value));

// //   const upgradeOptions: string[] = (() => {
// //     if (!upgradeCoinn) return [];
// //     // Gold coins never upgrade
// //     if (goldCodes.has(upgradeCoinn.colorCode)) return [];
// //     const activeFeaturesUpper = config.features.map(f => f.toUpperCase());
// //     if (isAllColor) {
// //       return ALL_UPGRADE_FEATURES.filter(f => !activeFeaturesUpper.includes(f));
// //     }
// //     return resolveUpgradeFeatures(upgradeCoinn.colorCode).filter(f => !activeFeaturesUpper.includes(f));
// //   })();

// //   const toggleMulti = (f: string) => {
// //     setUpgradeMultiSel(prev => {
// //       const next = new Set(prev);
// //       if (next.has(f)) next.delete(f); else next.add(f);
// //       return next;
// //     });
// //   };

// //   // The currently selected upgrade features (for the inline-confirm flow)
// //   const selectedUpgradeFeats: string[] = isAllColor
// //     ? Array.from(upgradeMultiSel)
// //     : upgradeFeatSel ? [upgradeFeatSel] : [];

// //   const canConfirmUpgrade = upgradePos !== null && selectedUpgradeFeats.length > 0;

// //   // ── Confirm upgrade inline — generates gaffe + navigates in one click ────
// //   const handleConfirmUpgrade = () => {
// //     if (!canConfirmUpgrade || upgradePos === null) return;

// //     // Build upgrade info
// //     const upgrade: UpgradeInfo = {
// //       col: Math.floor(upgradePos / 3),
// //       row: upgradePos % 3,
// //       features: selectedUpgradeFeats,
// //     };

// //     // Emit spin line with upgrade baked in
// //     const line = generateCombinationGaffe(coins, config, upgrade);
// //     onSpin(coins, line);

// //     // Navigate immediately to the new combo
// //     const newFeatures = [...new Set([...config.features, ...upgrade.features.map(f => f.toLowerCase())])];
// //     onUpgrade(newFeatures, coins);
// //   };

// //   // ── Spin ─────────────────────────────────────────────────────────────────
// //   const handleSpin = () => {
// //     if (spinsLeft <= 0) return;
// //     const cur = new Set(coins.map(c => c.position));
// //     const hasNew = [...cur].some(p => !lastSpinPositions.current.has(p));
// //     setSpinsLeft(hasNew ? MAX_SPINS : spinsLeft - 1);
// //     lastSpinPositions.current = cur;

// //     const line = generateCombinationGaffe(coins, config, null);
// //     onSpin(coins, line);
// //   };

// //   const resetFeature = () => {
// //     const seeded = baseCoins.map(c => ({ ...c, fromBase: true }));
// //     setCoins(seeded);
// //     setSpinsLeft(MAX_SPINS);
// //     lastSpinPositions.current = new Set(seeded.map(c => c.position));
// //     setUpgradePos(null); setUpgradeFeatSel(""); setUpgradeMultiSel(new Set());
// //     onReset();
// //   };

// //   const activeSplitter = config.hasZone ? (config.splitter ?? 1) : 0;
// //   const filled14 = coins.length >= 14 && (config.hasExtra || config.hasUltra);
// //   const cellMinH = config.hasDouble && config.hasUltra ? 150
// //                  : config.hasDouble                    ? 120
// //                  : config.hasUltra                     ? 110
// //                  : 100;

// //   return (
// //     <div className="bg-gray-800 rounded-xl border border-indigo-800">

// //       {/* HEADER */}
// //       <div onClick={() => setIsOpen(!isOpen)} className="flex justify-between items-center p-4 cursor-pointer select-none">
// //         <div className="flex items-center gap-2 flex-wrap">
// //           <h2 className="text-lg font-semibold text-white font-mono">⚡ Combination Feature</h2>
// //           {config.features.map(name => (
// //             <span key={name} className={`text-xs px-2 py-0.5 rounded capitalize font-mono ${FEATURE_BADGE[name] ?? "bg-gray-700 text-gray-300"}`}>
// //               {name}
// //             </span>
// //           ))}
// //           {config.hasZone && config.splitter && (
// //             <span className="text-xs px-2 py-0.5 rounded bg-sky-900 text-sky-300 border border-sky-700 font-mono">
// //               Splitter {config.splitter}
// //             </span>
// //           )}
// //         </div>
// //         <span className="text-gray-400">{isOpen ? "▼" : "▶"}</span>
// //       </div>

// //       {isOpen && (
// //         <div className="p-4 pt-0 flex flex-col gap-3">

// //           {/* SPIN CONTROLS */}
// //           <div className="flex items-center gap-3 flex-wrap">
// //             <button onClick={handleSpin} disabled={spinsLeft <= 0}
// //               className={`px-6 py-2 rounded font-bold text-white font-mono transition-all ${spinsLeft > 0 ? "bg-indigo-600 hover:bg-indigo-500" : "bg-gray-600 cursor-not-allowed opacity-50"}`}>
// //               SPIN
// //             </button>
// //             <span className="text-sm text-gray-400 font-mono">
// //               {spinsLeft} spin{spinsLeft !== 1 ? "s" : ""}
// //               {config.hasExtra && <span className="ml-1 text-emerald-400 text-xs">(4 — Extra)</span>}
// //             </span>
// //             <button onClick={resetFeature} className="px-3 py-1 bg-gray-600 hover:bg-gray-500 rounded text-sm">Reset</button>
// //             {filled14 && <span className="text-yellow-400 text-xs font-mono bg-yellow-900/40 px-2 py-0.5 rounded border border-yellow-700">⚠ 14 filled → lastPositionReel</span>}
// //           </div>

// //           {/* Double+Ultra info */}
// //           {config.hasDouble && config.hasUltra && (
// //             <div className="text-xs text-purple-300 font-mono bg-purple-900/30 px-3 py-1.5 rounded border border-purple-800">
// //               Double+Ultra: select boost on LEFT or RIGHT side per coin — choosing one locks the other. ✕ to clear.
// //             </div>
// //           )}

// //           {/* UPGRADE COIN SELECTED — feature picker + single Confirm button */}
// //           {upgradePos !== null && upgradeOptions.length > 0 && (
// //             <div className="flex flex-col gap-2 bg-yellow-900/20 border border-yellow-800 rounded-lg p-2">
// //               <span className="text-yellow-300 text-xs font-mono">
// //                 Upgrade {posToMetric(upgradePos)} →
// //                 {isAllColor ? " AllColor coin: select one or more features" : " select feature to add"}
// //               </span>
// //               {isAllColor ? (
// //                 <div className="flex gap-2 flex-wrap">
// //                   {upgradeOptions.map(f => (
// //                     <label key={f} className="flex items-center gap-1 cursor-pointer bg-yellow-900/40 border border-yellow-700 rounded px-2 py-1">
// //                       <input type="checkbox" className="accent-yellow-400 w-3 h-3"
// //                         checked={upgradeMultiSel.has(f)} onChange={() => toggleMulti(f)} />
// //                       <span className="text-yellow-100 text-xs font-mono">{f}</span>
// //                     </label>
// //                   ))}
// //                 </div>
// //               ) : (
// //                 <select className="bg-yellow-900 text-yellow-100 text-xs rounded px-2 py-1 font-mono border border-yellow-700 self-start"
// //                   value={upgradeFeatSel} onChange={e => setUpgradeFeatSel(e.target.value)}>
// //                   <option value="">Select feature...</option>
// //                   {upgradeOptions.map(f => <option key={f} value={f}>{f}</option>)}
// //                 </select>
// //               )}
// //               {canConfirmUpgrade && (
// //                 <button
// //                   onClick={handleConfirmUpgrade}
// //                   className="self-start px-4 py-1.5 bg-yellow-600 hover:bg-yellow-500 rounded font-bold text-sm font-mono transition-all">
// //                   ✦ Confirm → Go to {[...config.features, ...selectedUpgradeFeats.map(f => f.toLowerCase())]
// //                     .filter((v, i, a) => a.indexOf(v) === i).join(" + ")}
// //                 </button>
// //               )}
// //             </div>
// //           )}
// //           {upgradePos !== null && upgradeOptions.length === 0 && (
// //             <div className="text-xs text-gray-500 font-mono bg-gray-700 px-3 py-1.5 rounded">
// //               ℹ No upgrades available (all features already active or coin color doesn&apos;t support)
// //             </div>
// //           )}

// //           {/* GRID — 5 cols × 3 rows, column-major */}
// //           <div className="grid gap-1" style={{ gridTemplateColumns: "repeat(5, minmax(0, 1fr))" }}>
// //             {Array.from({ length: 3 }).map((_, row) =>
// //               Array.from({ length: 5 }).map((_, col) => {
// //                 const pos  = col * 3 + row;
// //                 const coin = coinAt(pos);

// //                 const zoneBg  = config.hasZone ? getZoneBgColor(pos, activeSplitter) : null;
// //                 const cellBg  = zoneBg
// //                   ? `${ZONE_BG_CLASS[zoneBg]} ${ZONE_BORDER_CLASS[zoneBg]}`
// //                   : "bg-gray-700 border-gray-600";
// //                 const hoverCls = !coin && !config.hasZone ? "hover:bg-gray-600 hover:border-gray-400" : "";

// //                 return (
// //                   <div key={pos} className="flex flex-col gap-1">
// //                     <div
// //                       onClick={() => !coin && handleCellClick(pos)}
// //                       className={`relative rounded-lg border-2 flex flex-col items-start p-1 text-xs text-white cursor-pointer transition-all hover:brightness-110 ${cellBg} ${hoverCls}`}
// //                       style={{ minHeight: cellMinH }}
// //                     >
// //                       <div className="flex justify-between w-full text-[9px] opacity-40 mb-0.5">
// //                         <span>{pos}</span>
// //                         <span className="font-mono">{posToMetric(pos)}</span>
// //                       </div>

// //                       {coin ? (
// //                         <div className="flex flex-col items-center w-full gap-0.5">

// //                           <div className="text-sm">🟡</div>

// //                           {/* Color dropdown */}
// //                           <select
// //                             className="bg-gray-800 text-white text-[9px] w-full rounded px-0.5 py-0.5 border-0 font-mono"
// //                             value={coin.colorCode}
// //                             onClick={e => e.stopPropagation()}
// //                             onChange={e => updateCoin(pos, "colorCode", Number(e.target.value))}
// //                           >
// //                             {coinColors.map(c => (
// //                               <option key={c.value} value={c.value} className="bg-gray-800">{c.label}</option>
// //                             ))}
// //                           </select>

// //                           {/* Value — Double: LEFT+RIGHT; others: single */}
// //                           {config.hasDouble ? (
// //                             <>
// //                               <div className="flex items-center gap-0.5 w-full">
// //                                 <span className="text-[7px] text-red-300 font-mono w-4 shrink-0">←L</span>
// //                                 <select className="bg-red-950 text-red-200 text-[9px] flex-1 rounded px-0 py-0.5 border-0 font-mono"
// //                                   value={coin.leftValue || ""}
// //                                   onClick={e => e.stopPropagation()}
// //                                   onChange={e => updateCoin(pos, "leftValue", e.target.value)}>
// //                                   <option value="">--</option>
// //                                   {COMBO_COIN_VALUES.map(v => <option key={v} value={v} className="bg-gray-800">{v}</option>)}
// //                                 </select>
// //                               </div>
// //                               <div className="flex items-center gap-0.5 w-full">
// //                                 <span className="text-[7px] text-red-300 font-mono w-4 shrink-0">R→</span>
// //                                 <select className="bg-red-950 text-red-200 text-[9px] flex-1 rounded px-0 py-0.5 border-0 font-mono"
// //                                   value={coin.rightValue || ""}
// //                                   onClick={e => e.stopPropagation()}
// //                                   onChange={e => updateCoin(pos, "rightValue", e.target.value)}>
// //                                   <option value="">--</option>
// //                                   {COMBO_COIN_VALUES.map(v => <option key={v} value={v} className="bg-gray-800">{v}</option>)}
// //                                 </select>
// //                               </div>
// //                             </>
// //                           ) : (
// //                             <select
// //                               className="bg-gray-800 text-white text-[9px] w-full rounded px-0.5 py-0.5 border-0 font-mono"
// //                               value={coin.value}
// //                               onClick={e => e.stopPropagation()}
// //                               onChange={e => updateCoin(pos, "value", e.target.value)}>
// //                               {COMBO_COIN_VALUES.map(v => (
// //                                 <option key={v} value={v} className="bg-gray-800">{v}</option>
// //                               ))}
// //                             </select>
// //                           )}

// //                           {/* Ultra boost — single dropdown when no double */}
// //                           {config.hasUltra && !config.hasDouble && (
// //                             <select
// //                               className="bg-purple-950 text-purple-200 text-[9px] w-full rounded px-0.5 py-0.5 border-0 font-mono"
// //                               value={coin.boostValue || ""}
// //                               onClick={e => e.stopPropagation()}
// //                               onChange={e => updateCoin(pos, "boostValue", e.target.value)}>
// //                               <option value="">Boost</option>
// //                               {ULTRA_BOOST_VALUES.map(v => <option key={v} value={v} className="bg-gray-800">{v}</option>)}
// //                             </select>
// //                           )}

// //                           {/* Ultra boost — LEFT/RIGHT side picker in Double+Ultra combo */}
// //                           {config.hasDouble && config.hasUltra && (
// //                             <div className="w-full mt-0.5" onClick={e => e.stopPropagation()}>
// //                               <div className="flex gap-0.5 w-full items-end">
// //                                 {(["LEFT", "RIGHT"] as const).map(side => {
// //                                   const isThis  = coin.boostSide === side;
// //                                   const locked  = !!(coin.boostSide && coin.boostSide !== side);
// //                                   return (
// //                                     <div key={side} className="flex flex-col items-center flex-1 gap-0">
// //                                       <span className={`text-[7px] font-mono ${isThis ? "text-yellow-300" : "text-gray-500"}`}>{side}</span>
// //                                       <select
// //                                         disabled={locked}
// //                                         className={`text-[8px] w-full rounded px-0 py-0.5 border-0 font-mono
// //                                           ${isThis ? "bg-yellow-700 text-yellow-100" : "bg-purple-950 text-purple-200"}
// //                                           ${locked ? "opacity-30 cursor-not-allowed" : ""}`}
// //                                         value={isThis ? (coin.boostValue || "") : ""}
// //                                         onChange={e => setBoostSide(pos, side, e.target.value)}>
// //                                         <option value="">--</option>
// //                                         {ULTRA_BOOST_VALUES.map(v => <option key={v} value={v} className="bg-gray-800">{v}</option>)}
// //                                       </select>
// //                                     </div>
// //                                   );
// //                                 })}
// //                                 {coin.boostSide && (
// //                                   <button
// //                                     className="text-red-400 hover:text-red-200 text-[8px] pb-0.5 ml-0.5"
// //                                     onClick={e => { e.stopPropagation(); updateCoin(pos, "boostValue", ""); updateCoin(pos, "boostSide", null); }}>✕</button>
// //                                 )}
// //                               </div>
// //                             </div>
// //                           )}

// //                           {/* Feature upgrade radio */}
// //                           <div className="flex items-center gap-1 mt-0.5 w-full" onClick={e => e.stopPropagation()}>
// //                             <input
// //                               type="radio" name="comboUpgrade"
// //                               className="accent-yellow-400 w-3 h-3 cursor-pointer"
// //                               checked={upgradePos === pos}
// //                               onChange={() => handleUpgradeRadio(pos)}
// //                             />
// //                             <span className="text-[8px] text-yellow-300 font-mono">upgrade</span>
// //                             {upgradePos === pos && !isAllColor && upgradeFeatSel && (
// //                               <span className="text-[8px] text-yellow-500 font-mono">→{upgradeFeatSel}</span>
// //                             )}
// //                             {upgradePos === pos && isAllColor && upgradeMultiSel.size > 0 && (
// //                               <span className="text-[8px] text-yellow-500 font-mono">→{Array.from(upgradeMultiSel).join("+")}</span>
// //                             )}
// //                           </div>

// //                           {/* Remove — non-base coins only */}
// //                           {!coin.fromBase && (
// //                             <button
// //                               onClick={e => { e.stopPropagation(); removeCoin(pos); }}
// //                               className="absolute top-1 right-1 text-[10px] text-red-300 hover:text-red-100 font-bold">✕</button>
// //                           )}

// //                         </div>
// //                       ) : (
// //                         <span className="text-white/40 text-[10px] mx-auto mt-4">+ Add</span>
// //                       )}
// //                     </div>
// //                   </div>
// //                 );
// //               })
// //             )}
// //           </div>

// //           {/* LEGEND */}
// //           <div className="text-[10px] text-gray-500 font-mono flex flex-wrap gap-2">
// //             <span>🟡 = coin · click empty cell to add · ✕ = remove</span>
// //             {config.hasDouble && <span>L← / R→ = LEFT / RIGHT coin values</span>}
// //             {config.hasUltra && !config.hasDouble && <span>Boost = ultra boost value</span>}
// //             {config.hasDouble && config.hasUltra && <span>L/R boost = side the boost applies to · ✕ to clear side</span>}
// //             {config.hasZone && <span>Background = zone regions (splitter {config.splitter})</span>}
// //             <span>✦ radio = upgrade · single-color = 1 feature · AllColor = multi-feature</span>
// //           </div>

// //         </div>
// //       )}
// //     </div>
// //   );
// // }



// /* eslint-disable @typescript-eslint/no-explicit-any */
// "use client";

// import { useState, useRef } from "react";
// import {
//   ComboCoin, ComboFeatureConfig,
//   getComboMaxSpins, getComboCoinColors,
//   generateCombinationGaffe, resolveUpgradeFeatures, UpgradeInfo,
// } from "./combinationFeatureGenerator";
// import { ZONE_BG_CLASS, ZONE_BORDER_CLASS, getZoneBgColor } from "./zoneFeatureGenerator";
// import { ULTRA_BOOST_VALUES } from "./ultraFeatureGenerator";
// import { posToMetric, ALL_UPGRADE_FEATURES } from "./config";

// // ── Constants ─────────────────────────────────────────────────────────────────
// // Fix #5: uppercase coin values
// const COMBO_COIN_VALUES = ["1", "2", "5", "MINOR", "MAJOR", "MINI"];

// const FEATURE_BADGE: Record<string, string> = {
//   double: "bg-red-900 text-red-300 border border-red-600",
//   extra:  "bg-emerald-900 text-emerald-300 border border-emerald-600",
//   zone:   "bg-sky-900 text-sky-300 border border-sky-600",
//   ultra:  "bg-purple-900 text-purple-300 border border-purple-600",
// };

// // ── Props ─────────────────────────────────────────────────────────────────────
// type Props = {
//   baseCoins:          ComboCoin[];
//   config:             ComboFeatureConfig;
//   pendingUpgradeInfo: UpgradeInfo | null;   // carried from single-feature upgrade
//   onSpin:             (snapshot: ComboCoin[], line: string) => void;
//   onReset:            () => void;
//   onUpgrade:          (newFeatures: string[], carryCoins: ComboCoin[], upgradeInfo: UpgradeInfo) => void;
// };

// // ── Component ─────────────────────────────────────────────────────────────────
// export default function CombinationFeature({ baseCoins, config, pendingUpgradeInfo, onSpin, onReset, onUpgrade }: Props) {
//   const MAX_SPINS  = getComboMaxSpins(config);
//   const coinColors = getComboCoinColors(config.features);
//   const defaultCode = coinColors[0].value;

//   const [isOpen,    setIsOpen]    = useState(true);
//   const initialSeeds = baseCoins.map(c => ({ ...c, fromBase: true }));
//   const [coins,     setCoins]     = useState<ComboCoin[]>(initialSeeds);
//   const [spinsLeft, setSpinsLeft] = useState(MAX_SPINS);
//   const lastSpinPositions = useRef<Set<number>>(new Set(initialSeeds.map(c => c.position)));

//   // Upgrade state
//   const [upgradePos,      setUpgradePos]      = useState<number | null>(null);
//   const [upgradeFeatSel,  setUpgradeFeatSel]  = useState<string>("");
//   const [upgradeMultiSel, setUpgradeMultiSel] = useState<Set<string>>(new Set());

//   const coinAt = (pos: number) => coins.find(c => c.position === pos);

//   // ── Coin operations ──────────────────────────────────────────────────────
//   const handleCellClick = (pos: number) => {
//     if (coinAt(pos)) return;
//     setCoins(prev => [...prev, {
//       position: pos, colorCode: defaultCode, value: COMBO_COIN_VALUES[0],
//       leftValue: "", rightValue: "", boostValue: "", boostSide: null,
//     }]);
//   };

//   const removeCoin = (pos: number) => {
//     const c = coinAt(pos);
//     if (!c || c.fromBase) return;
//     if (upgradePos === pos) {
//       setUpgradePos(null); setUpgradeFeatSel(""); setUpgradeMultiSel(new Set());
//     }
//     setCoins(prev => prev.filter(x => x.position !== pos));
//   };

//   const updateCoin = (pos: number, field: keyof ComboCoin, val: any) =>
//     setCoins(prev => prev.map(c => c.position === pos ? { ...c, [field]: val } : c));

//   const setBoostSide = (pos: number, side: "LEFT" | "RIGHT", boostVal: string) => {
//     setCoins(prev => prev.map(c => {
//       if (c.position !== pos) return c;
//       if (!boostVal) return { ...c, boostValue: "", boostSide: null };
//       return { ...c, boostValue: boostVal, boostSide: side };
//     }));
//   };

//   // ── Upgrade radio ────────────────────────────────────────────────────────
//   const handleUpgradeRadio = (pos: number) => {
//     if (upgradePos === pos) {
//       setUpgradePos(null); setUpgradeFeatSel(""); setUpgradeMultiSel(new Set()); return;
//     }
//     setUpgradePos(pos); setUpgradeFeatSel(""); setUpgradeMultiSel(new Set());
//   };

//   const upgradeCoinn = upgradePos !== null ? coinAt(upgradePos) : null;

//   // AllColor = the coin whose label starts with "AllColor" in this combo's palette
//   const allColorEntry = coinColors.find(c => c.label.startsWith("AllColor"));
//   const isAllColor = !!(upgradeCoinn && allColorEntry && upgradeCoinn.colorCode === allColorEntry.value);

//   // Gold coins (label starts with "Gold") have no upgrade
//   const goldCodes = new Set(coinColors.filter(c => c.label.startsWith("Gold")).map(c => c.value));

//   const upgradeOptions: string[] = (() => {
//     if (!upgradeCoinn) return [];
//     // Gold coins never upgrade
//     if (goldCodes.has(upgradeCoinn.colorCode)) return [];
//     const activeFeaturesUpper = config.features.map(f => f.toUpperCase());
//     if (isAllColor) {
//       return ALL_UPGRADE_FEATURES.filter(f => !activeFeaturesUpper.includes(f));
//     }
//     return resolveUpgradeFeatures(upgradeCoinn.colorCode).filter(f => !activeFeaturesUpper.includes(f));
//   })();

//   const toggleMulti = (f: string) => {
//     setUpgradeMultiSel(prev => {
//       const next = new Set(prev);
//       if (next.has(f)) next.delete(f); else next.add(f);
//       return next;
//     });
//   };

//   // The currently selected upgrade features (for combo-internal upgrade)
//   const selectedUpgradeFeats: string[] = isAllColor
//     ? Array.from(upgradeMultiSel)
//     : upgradeFeatSel ? [upgradeFeatSel] : [];

//   // Navigate immediately when upgrade feature selected in combo
//   const navigateComboUpgrade = (feats: string[]) => {
//     if (!upgradePos || feats.length === 0) return;
//     const upgradeInfo: UpgradeInfo = { col: Math.floor(upgradePos/3), row: upgradePos%3, features: feats };
//     const newFeatures = [...new Set([...config.features, ...feats.map(f => f.toLowerCase())])];
//     onUpgrade(newFeatures, coins, upgradeInfo);
//   };

//   // ── Spin ─────────────────────────────────────────────────────────────────
//   // Uses pendingUpgradeInfo (from single-feature upgrade) on first spin, then it's cleared by parent
//   const handleSpin = () => {
//     if (spinsLeft <= 0) return;
//     const cur = new Set(coins.map(c => c.position));
//     const hasNew = [...cur].some(p => !lastSpinPositions.current.has(p));
//     setSpinsLeft(hasNew ? MAX_SPINS : spinsLeft - 1);
//     lastSpinPositions.current = cur;

//     const line = generateCombinationGaffe(coins, config, pendingUpgradeInfo ?? null);
//     onSpin(coins, line);   // parent clears pendingUpgradeInfo after this
//   };

//   const resetFeature = () => {
//     const seeded = baseCoins.map(c => ({ ...c, fromBase: true }));
//     setCoins(seeded);
//     setSpinsLeft(MAX_SPINS);
//     lastSpinPositions.current = new Set(seeded.map(c => c.position));
//     setUpgradePos(null); setUpgradeFeatSel(""); setUpgradeMultiSel(new Set());
//     onReset();
//   };

//   const activeSplitter = config.hasZone ? (config.splitter ?? 1) : 0;
//   const filled14 = coins.length >= 14 && (config.hasExtra || config.hasUltra);
//   const cellMinH = config.hasDouble && config.hasUltra ? 150
//                  : config.hasDouble                    ? 120
//                  : config.hasUltra                     ? 110
//                  : 100;

//   return (
//     <div className="bg-gray-800 rounded-xl border border-indigo-800">

//       {/* HEADER */}
//       <div onClick={() => setIsOpen(!isOpen)} className="flex justify-between items-center p-4 cursor-pointer select-none">
//         <div className="flex items-center gap-2 flex-wrap">
//           <h2 className="text-lg font-semibold text-white font-mono">⚡ Combination Feature</h2>
//           {config.features.map(name => (
//             <span key={name} className={`text-xs px-2 py-0.5 rounded capitalize font-mono ${FEATURE_BADGE[name] ?? "bg-gray-700 text-gray-300"}`}>
//               {name}
//             </span>
//           ))}
//           {config.hasZone && config.splitter && (
//             <span className="text-xs px-2 py-0.5 rounded bg-sky-900 text-sky-300 border border-sky-700 font-mono">
//               Splitter {config.splitter}
//             </span>
//           )}
//           {pendingUpgradeInfo && (
//             <span className="text-xs px-2 py-0.5 rounded bg-yellow-900 text-yellow-300 border border-yellow-700 font-mono animate-pulse">
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
//             <button onClick={handleSpin} disabled={spinsLeft <= 0}
//               className={`px-6 py-2 rounded font-bold text-white font-mono transition-all ${spinsLeft > 0 ? "bg-indigo-600 hover:bg-indigo-500" : "bg-gray-600 cursor-not-allowed opacity-50"}`}>
//               SPIN
//             </button>
//             <span className="text-sm text-gray-400 font-mono">
//               {spinsLeft} spin{spinsLeft !== 1 ? "s" : ""}
//               {config.hasExtra && <span className="ml-1 text-emerald-400 text-xs">(4 — Extra)</span>}
//             </span>
//             <button onClick={resetFeature} className="px-3 py-1 bg-gray-600 hover:bg-gray-500 rounded text-sm">Reset</button>
//             {filled14 && <span className="text-yellow-400 text-xs font-mono bg-yellow-900/40 px-2 py-0.5 rounded border border-yellow-700">⚠ 14 filled → lastPositionReel</span>}
//           </div>

//           {/* Double+Ultra info */}
//           {config.hasDouble && config.hasUltra && (
//             <div className="text-xs text-purple-300 font-mono bg-purple-900/30 px-3 py-1.5 rounded border border-purple-800">
//               Double+Ultra: select boost on LEFT or RIGHT side per coin — choosing one locks the other. ✕ to clear.
//             </div>
//           )}

//           {/* UPGRADE COIN SELECTED — select feature → navigate immediately */}
//           {upgradePos !== null && upgradeOptions.length > 0 && (
//             <div className="flex flex-col gap-2 bg-yellow-900/20 border border-yellow-800 rounded-lg p-2">
//               <span className="text-yellow-300 text-xs font-mono font-bold">
//                 ✦ Upgrade at {posToMetric(upgradePos)} — select feature to add (navigates immediately):
//               </span>
//               {isAllColor ? (
//                 <div className="flex flex-col gap-2">
//                   <div className="flex gap-2 flex-wrap">
//                     {upgradeOptions.map(f => (
//                       <label key={f} className="flex items-center gap-1 cursor-pointer bg-yellow-900/40 border border-yellow-700 rounded px-2 py-1">
//                         <input type="checkbox" className="accent-yellow-400 w-3 h-3"
//                           checked={upgradeMultiSel.has(f)} onChange={() => toggleMulti(f)} />
//                         <span className="text-yellow-100 text-xs font-mono">{f}</span>
//                       </label>
//                     ))}
//                   </div>
//                   {upgradeMultiSel.size > 0 && (
//                     <button onClick={() => navigateComboUpgrade(Array.from(upgradeMultiSel))}
//                       className="self-start px-3 py-1 bg-yellow-600 hover:bg-yellow-500 rounded text-xs font-mono font-bold transition-all">
//                       → Go to {[...config.features, ...Array.from(upgradeMultiSel).map(f=>f.toLowerCase())].filter((v,i,a)=>a.indexOf(v)===i).join(" + ")}
//                     </button>
//                   )}
//                 </div>
//               ) : (
//                 <div className="flex gap-2 flex-wrap">
//                   {upgradeOptions.map(f => (
//                     <button key={f} onClick={() => navigateComboUpgrade([f])}
//                       className="px-3 py-1.5 bg-yellow-700 hover:bg-yellow-600 border border-yellow-600 rounded text-xs font-mono font-bold transition-all">
//                       → {f}
//                     </button>
//                   ))}
//                 </div>
//               )}
//             </div>
//           )}
//           {upgradePos !== null && upgradeOptions.length === 0 && (
//             <div className="text-xs text-gray-500 font-mono bg-gray-700 px-3 py-1.5 rounded">
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
//                       className={`relative rounded-lg border-2 flex flex-col items-start p-1 text-xs text-white cursor-pointer transition-all hover:brightness-110 ${cellBg} ${hoverCls}`}
//                       style={{ minHeight: cellMinH }}
//                     >
//                       <div className="flex justify-between w-full text-[9px] opacity-40 mb-0.5">
//                         <span>{pos}</span>
//                         <span className="font-mono">{posToMetric(pos)}</span>
//                       </div>

//                       {coin ? (
//                         <div className="flex flex-col items-center w-full gap-0.5">

//                           <div className="text-sm">🟡</div>

//                           {/* Color dropdown */}
//                           <select
//                             className="bg-gray-800 text-white text-[9px] w-full rounded px-0.5 py-0.5 border-0 font-mono"
//                             value={coin.colorCode}
//                             onClick={e => e.stopPropagation()}
//                             onChange={e => updateCoin(pos, "colorCode", Number(e.target.value))}
//                           >
//                             {coinColors.map(c => (
//                               <option key={c.value} value={c.value} className="bg-gray-800">{c.label}</option>
//                             ))}
//                           </select>

//                           {/* Value — Double: LEFT+RIGHT; others: single */}
//                           {config.hasDouble ? (
//                             <>
//                               <div className="flex items-center gap-0.5 w-full">
//                                 <span className="text-[7px] text-red-300 font-mono w-4 shrink-0">←L</span>
//                                 <select className="bg-red-950 text-red-200 text-[9px] flex-1 rounded px-0 py-0.5 border-0 font-mono"
//                                   value={coin.leftValue || ""}
//                                   onClick={e => e.stopPropagation()}
//                                   onChange={e => updateCoin(pos, "leftValue", e.target.value)}>
//                                   <option value="">--</option>
//                                   {COMBO_COIN_VALUES.map(v => <option key={v} value={v} className="bg-gray-800">{v}</option>)}
//                                 </select>
//                               </div>
//                               <div className="flex items-center gap-0.5 w-full">
//                                 <span className="text-[7px] text-red-300 font-mono w-4 shrink-0">R→</span>
//                                 <select className="bg-red-950 text-red-200 text-[9px] flex-1 rounded px-0 py-0.5 border-0 font-mono"
//                                   value={coin.rightValue || ""}
//                                   onClick={e => e.stopPropagation()}
//                                   onChange={e => updateCoin(pos, "rightValue", e.target.value)}>
//                                   <option value="">--</option>
//                                   {COMBO_COIN_VALUES.map(v => <option key={v} value={v} className="bg-gray-800">{v}</option>)}
//                                 </select>
//                               </div>
//                             </>
//                           ) : (
//                             <select
//                               className="bg-gray-800 text-white text-[9px] w-full rounded px-0.5 py-0.5 border-0 font-mono"
//                               value={coin.value}
//                               onClick={e => e.stopPropagation()}
//                               onChange={e => updateCoin(pos, "value", e.target.value)}>
//                               {COMBO_COIN_VALUES.map(v => (
//                                 <option key={v} value={v} className="bg-gray-800">{v}</option>
//                               ))}
//                             </select>
//                           )}

//                           {/* Ultra boost — single dropdown when no double */}
//                           {config.hasUltra && !config.hasDouble && (
//                             <select
//                               className="bg-purple-950 text-purple-200 text-[9px] w-full rounded px-0.5 py-0.5 border-0 font-mono"
//                               value={coin.boostValue || ""}
//                               onClick={e => e.stopPropagation()}
//                               onChange={e => updateCoin(pos, "boostValue", e.target.value)}>
//                               <option value="">Boost</option>
//                               {ULTRA_BOOST_VALUES.map(v => <option key={v} value={v} className="bg-gray-800">{v}</option>)}
//                             </select>
//                           )}

//                           {/* Ultra boost — LEFT/RIGHT side picker in Double+Ultra combo */}
//                           {config.hasDouble && config.hasUltra && (
//                             <div className="w-full mt-0.5" onClick={e => e.stopPropagation()}>
//                               <div className="flex gap-0.5 w-full items-end">
//                                 {(["LEFT", "RIGHT"] as const).map(side => {
//                                   const isThis  = coin.boostSide === side;
//                                   const locked  = !!(coin.boostSide && coin.boostSide !== side);
//                                   return (
//                                     <div key={side} className="flex flex-col items-center flex-1 gap-0">
//                                       <span className={`text-[7px] font-mono ${isThis ? "text-yellow-300" : "text-gray-500"}`}>{side}</span>
//                                       <select
//                                         disabled={locked}
//                                         className={`text-[8px] w-full rounded px-0 py-0.5 border-0 font-mono
//                                           ${isThis ? "bg-yellow-700 text-yellow-100" : "bg-purple-950 text-purple-200"}
//                                           ${locked ? "opacity-30 cursor-not-allowed" : ""}`}
//                                         value={isThis ? (coin.boostValue || "") : ""}
//                                         onChange={e => setBoostSide(pos, side, e.target.value)}>
//                                         <option value="">--</option>
//                                         {ULTRA_BOOST_VALUES.map(v => <option key={v} value={v} className="bg-gray-800">{v}</option>)}
//                                       </select>
//                                     </div>
//                                   );
//                                 })}
//                                 {coin.boostSide && (
//                                   <button
//                                     className="text-red-400 hover:text-red-200 text-[8px] pb-0.5 ml-0.5"
//                                     onClick={e => { e.stopPropagation(); updateCoin(pos, "boostValue", ""); updateCoin(pos, "boostSide", null); }}>✕</button>
//                                 )}
//                               </div>
//                             </div>
//                           )}

//                           {/* Feature upgrade radio */}
//                           <div className="flex items-center gap-1 mt-0.5 w-full" onClick={e => e.stopPropagation()}>
//                             <input
//                               type="radio" name="comboUpgrade"
//                               className="accent-yellow-400 w-3 h-3 cursor-pointer"
//                               checked={upgradePos === pos}
//                               onChange={() => handleUpgradeRadio(pos)}
//                             />
//                             <span className="text-[8px] text-yellow-300 font-mono">upgrade</span>
//                             {upgradePos === pos && !isAllColor && upgradeFeatSel && (
//                               <span className="text-[8px] text-yellow-500 font-mono">→{upgradeFeatSel}</span>
//                             )}
//                             {upgradePos === pos && isAllColor && upgradeMultiSel.size > 0 && (
//                               <span className="text-[8px] text-yellow-500 font-mono">→{Array.from(upgradeMultiSel).join("+")}</span>
//                             )}
//                           </div>

//                           {/* Remove — non-base coins only */}
//                           {!coin.fromBase && (
//                             <button
//                               onClick={e => { e.stopPropagation(); removeCoin(pos); }}
//                               className="absolute top-1 right-1 text-[10px] text-red-300 hover:text-red-100 font-bold">✕</button>
//                           )}

//                         </div>
//                       ) : (
//                         <span className="text-white/40 text-[10px] mx-auto mt-4">+ Add</span>
//                       )}
//                     </div>
//                   </div>
//                 );
//               })
//             )}
//           </div>

//           {/* LEGEND */}
//           <div className="text-[10px] text-gray-500 font-mono flex flex-wrap gap-2">
//             <span>🟡 = coin · click empty cell to add · ✕ = remove</span>
//             {config.hasDouble && <span>L← / R→ = LEFT / RIGHT coin values</span>}
//             {config.hasUltra && !config.hasDouble && <span>Boost = ultra boost value</span>}
//             {config.hasDouble && config.hasUltra && <span>L/R boost = side the boost applies to · ✕ to clear side</span>}
//             {config.hasZone && <span>Background = zone regions (splitter {config.splitter})</span>}
//             <span>✦ radio = upgrade · single-color = 1 feature · AllColor = multi-feature</span>
//           </div>

//         </div>
//       )}
//     </div>
//   );
// }


//! latest wokring code
/* eslint-disable @typescript-eslint/no-explicit-any */
// "use client";

// import { useState, useRef } from "react";
// import {
//   ComboCoin, ComboFeatureConfig,
//   getComboMaxSpins, getComboCoinColors,
//   generateCombinationGaffe, resolveUpgradeFeatures, UpgradeInfo,
// } from "./combinationFeatureGenerator";
// import { ZONE_BG_CLASS, ZONE_BORDER_CLASS, getZoneBgColor } from "./zoneFeatureGenerator";
// import { ULTRA_BOOST_VALUES } from "./ultraFeatureGenerator";
// import { posToMetric, ALL_UPGRADE_FEATURES } from "./config";

// // ── Constants ─────────────────────────────────────────────────────────────────
// // Fix #5: uppercase coin values
// const COMBO_COIN_VALUES = ["100", "250", "500", "MINOR", "MAJOR", "MINI"];

// const FEATURE_BADGE: Record<string, string> = {
//   double: "bg-red-900 text-red-300 border border-red-600",
//   extra:  "bg-emerald-900 text-emerald-300 border border-emerald-600",
//   zone:   "bg-sky-900 text-sky-300 border border-sky-600",
//   ultra:  "bg-purple-900 text-purple-300 border border-purple-600",
// };

// // ── Props ─────────────────────────────────────────────────────────────────────
// type Props = {
//   baseCoins:          ComboCoin[];
//   config:             ComboFeatureConfig;
//   pendingUpgradeInfo: UpgradeInfo | null;   // carried from single-feature upgrade
//   onSpin:             (snapshot: ComboCoin[], line: string) => void;
//   onReset:            () => void;
//   onUpgrade:          (newFeatures: string[], carryCoins: ComboCoin[], upgradeInfo: UpgradeInfo) => void;
// };

// // ── Component ─────────────────────────────────────────────────────────────────
// export default function CombinationFeature({ baseCoins, config, pendingUpgradeInfo, onSpin, onReset, onUpgrade }: Props) {
//   const MAX_SPINS  = getComboMaxSpins(config);
//   const coinColors = getComboCoinColors(config.features);
//   const defaultCode = coinColors[0].value;

//   const [isOpen,    setIsOpen]    = useState(true);
//   const initialSeeds = baseCoins.map(c => ({ ...c, fromBase: true }));
//   const [coins,     setCoins]     = useState<ComboCoin[]>(initialSeeds);
//   const [spinsLeft, setSpinsLeft] = useState(MAX_SPINS);
//   const lastSpinPositions = useRef<Set<number>>(new Set(initialSeeds.map(c => c.position)));

//   // Upgrade state
//   const [upgradePos,      setUpgradePos]      = useState<number | null>(null);
//   const [upgradeFeatSel,  setUpgradeFeatSel]  = useState<string>("");
//   const [upgradeMultiSel, setUpgradeMultiSel] = useState<Set<string>>(new Set());

//   const coinAt = (pos: number) => coins.find(c => c.position === pos);

//   // ── Coin operations ──────────────────────────────────────────────────────
//   const handleCellClick = (pos: number) => {
//     if (coinAt(pos)) return;
//     setCoins(prev => [...prev, {
//       position: pos, colorCode: defaultCode, value: COMBO_COIN_VALUES[0],
//       leftValue: "", rightValue: "", boostValue: "", boostSide: null,
//     }]);
//   };

//   const removeCoin = (pos: number) => {
//     const c = coinAt(pos);
//     if (!c || c.fromBase) return;
//     if (upgradePos === pos) {
//       setUpgradePos(null); setUpgradeFeatSel(""); setUpgradeMultiSel(new Set());
//     }
//     setCoins(prev => prev.filter(x => x.position !== pos));
//   };

//   const updateCoin = (pos: number, field: keyof ComboCoin, val: any) =>
//     setCoins(prev => prev.map(c => c.position === pos ? { ...c, [field]: val } : c));

//   const setBoostSide = (pos: number, side: "LEFT" | "RIGHT", boostVal: string) => {
//     setCoins(prev => prev.map(c => {
//       if (c.position !== pos) return c;
//       if (!boostVal) return { ...c, boostValue: "", boostSide: null };
//       return { ...c, boostValue: boostVal, boostSide: side };
//     }));
//   };

//   // ── Upgrade radio ────────────────────────────────────────────────────────
//   const handleUpgradeRadio = (pos: number) => {
//     if (upgradePos === pos) {
//       setUpgradePos(null); setUpgradeFeatSel(""); setUpgradeMultiSel(new Set()); return;
//     }
//     setUpgradePos(pos); setUpgradeFeatSel(""); setUpgradeMultiSel(new Set());
//   };

//   const upgradeCoinn = upgradePos !== null ? coinAt(upgradePos) : null;

//   // AllColor = the coin whose label starts with "AllColor" in this combo's palette
//   const allColorEntry = coinColors.find(c => c.label.startsWith("AllColor"));
//   const isAllColor = !!(upgradeCoinn && allColorEntry && upgradeCoinn.colorCode === allColorEntry.value);

//   // Gold coins (label starts with "Gold") have no upgrade
//   const goldCodes = new Set(coinColors.filter(c => c.label.startsWith("Gold")).map(c => c.value));

//   const upgradeOptions: string[] = (() => {
//     if (!upgradeCoinn) return [];
//     // Gold coins never upgrade
//     if (goldCodes.has(upgradeCoinn.colorCode)) return [];
//     const activeFeaturesUpper = config.features.map(f => f.toUpperCase());
//     if (isAllColor) {
//       return ALL_UPGRADE_FEATURES.filter(f => !activeFeaturesUpper.includes(f));
//     }
//     return resolveUpgradeFeatures(upgradeCoinn.colorCode).filter(f => !activeFeaturesUpper.includes(f));
//   })();

//   const toggleMulti = (f: string) => {
//     setUpgradeMultiSel(prev => {
//       const next = new Set(prev);
//       if (next.has(f)) next.delete(f); else next.add(f);
//       return next;
//     });
//   };

//   // The currently selected upgrade features (for combo-internal upgrade)
//   const selectedUpgradeFeats: string[] = isAllColor
//     ? Array.from(upgradeMultiSel)
//     : upgradeFeatSel ? [upgradeFeatSel] : [];

//   // Navigate immediately when upgrade feature selected in combo
//   const navigateComboUpgrade = (feats: string[]) => {
//     if (upgradePos === null || feats.length === 0) return;
//     const upgradeInfo: UpgradeInfo = { col: Math.floor(upgradePos/3), row: upgradePos%3, features: feats };
//     const newFeatures = [...new Set([...config.features, ...feats.map(f => f.toLowerCase())])];
//     onUpgrade(newFeatures, coins, upgradeInfo);
//   };

//   // ── Spin ─────────────────────────────────────────────────────────────────
//   // Uses pendingUpgradeInfo (from single-feature upgrade) on first spin, then it's cleared by parent
//   const handleSpin = () => {
//     if (spinsLeft <= 0) return;
//     const cur = new Set(coins.map(c => c.position));
//     const hasNew = [...cur].some(p => !lastSpinPositions.current.has(p));
//     setSpinsLeft(hasNew ? MAX_SPINS : spinsLeft - 1);
//     lastSpinPositions.current = cur;

//     const line = generateCombinationGaffe(coins, config, pendingUpgradeInfo ?? null);
//     onSpin(coins, line);   // parent clears pendingUpgradeInfo after this
//   };

//   const resetFeature = () => {
//     const seeded = baseCoins.map(c => ({ ...c, fromBase: true }));
//     setCoins(seeded);
//     setSpinsLeft(MAX_SPINS);
//     lastSpinPositions.current = new Set(seeded.map(c => c.position));
//     setUpgradePos(null); setUpgradeFeatSel(""); setUpgradeMultiSel(new Set());
//     onReset();
//   };

//   const activeSplitter = config.hasZone ? (config.splitter ?? 1) : 0;
//   const filled14 = coins.length >= 14 && (config.hasExtra || config.hasUltra);
//   const cellMinH = config.hasDouble && config.hasUltra ? 150
//                  : config.hasDouble                    ? 120
//                  : config.hasUltra                     ? 110
//                  : 100;

//   return (
//     <div className="bg-gray-800 rounded-xl border border-indigo-800">

//       {/* HEADER */}
//       <div onClick={() => setIsOpen(!isOpen)} className="flex justify-between items-center p-4 cursor-pointer select-none">
//         <div className="flex items-center gap-2 flex-wrap">
//           <h2 className="text-lg font-semibold text-white font-mono">⚡ Combination Feature</h2>
//           {config.features.map(name => (
//             <span key={name} className={`text-xs px-2 py-0.5 rounded capitalize font-mono ${FEATURE_BADGE[name] ?? "bg-gray-700 text-gray-300"}`}>
//               {name}
//             </span>
//           ))}
//           {config.hasZone && config.splitter && (
//             <span className="text-xs px-2 py-0.5 rounded bg-sky-900 text-sky-300 border border-sky-700 font-mono">
//               Splitter {config.splitter}
//             </span>
//           )}
//           {pendingUpgradeInfo && (
//             <span className="text-xs px-2 py-0.5 rounded bg-yellow-900 text-yellow-300 border border-yellow-700 font-mono animate-pulse">
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
//             <button onClick={handleSpin} disabled={spinsLeft <= 0}
//               className={`px-6 py-2 rounded font-bold text-white font-mono transition-all ${spinsLeft > 0 ? "bg-indigo-600 hover:bg-indigo-500" : "bg-gray-600 cursor-not-allowed opacity-50"}`}>
//               SPIN
//             </button>
//             <span className="text-sm text-gray-400 font-mono">
//               {spinsLeft} spin{spinsLeft !== 1 ? "s" : ""}
//               {config.hasExtra && <span className="ml-1 text-emerald-400 text-xs">(4 — Extra)</span>}
//             </span>
//             <button onClick={resetFeature} className="px-3 py-1 bg-gray-600 hover:bg-gray-500 rounded text-sm">Reset</button>
//             {filled14 && <span className="text-yellow-400 text-xs font-mono bg-yellow-900/40 px-2 py-0.5 rounded border border-yellow-700">⚠ 14 filled → lastPositionReel</span>}
//           </div>

//           {/* Double+Ultra info */}
//           {config.hasDouble && config.hasUltra && (
//             <div className="text-xs text-purple-300 font-mono bg-purple-900/30 px-3 py-1.5 rounded border border-purple-800">
//               Double+Ultra: select boost on LEFT or RIGHT side per coin — choosing one locks the other. ✕ to clear.
//             </div>
//           )}

//           {/* UPGRADE COIN SELECTED — select feature → navigate immediately */}
//           {upgradePos !== null && upgradeOptions.length > 0 && (
//             <div className="flex flex-col gap-2 bg-yellow-900/20 border border-yellow-800 rounded-lg p-2">
//               <span className="text-yellow-300 text-xs font-mono font-bold">
//                 ✦ Upgrade at {posToMetric(upgradePos)} — select feature to add (navigates immediately):
//               </span>
//               {isAllColor ? (
//                 <div className="flex flex-col gap-2">
//                   <div className="flex gap-2 flex-wrap">
//                     {upgradeOptions.map(f => (
//                       <label key={f} className="flex items-center gap-1 cursor-pointer bg-yellow-900/40 border border-yellow-700 rounded px-2 py-1">
//                         <input type="checkbox" className="accent-yellow-400 w-3 h-3"
//                           checked={upgradeMultiSel.has(f)} onChange={() => toggleMulti(f)} />
//                         <span className="text-yellow-100 text-xs font-mono">{f}</span>
//                       </label>
//                     ))}
//                   </div>
//                   {upgradeMultiSel.size > 0 && (
//                     <button onClick={() => navigateComboUpgrade(Array.from(upgradeMultiSel))}
//                       className="self-start px-3 py-1 bg-yellow-600 hover:bg-yellow-500 rounded text-xs font-mono font-bold transition-all">
//                       → Go to {[...config.features, ...Array.from(upgradeMultiSel).map(f=>f.toLowerCase())].filter((v,i,a)=>a.indexOf(v)===i).join(" + ")}
//                     </button>
//                   )}
//                 </div>
//               ) : (
//                 <div className="flex gap-2 flex-wrap">
//                   {upgradeOptions.map(f => (
//                     <button key={f} onClick={() => navigateComboUpgrade([f])}
//                       className="px-3 py-1.5 bg-yellow-700 hover:bg-yellow-600 border border-yellow-600 rounded text-xs font-mono font-bold transition-all">
//                       → {f}
//                     </button>
//                   ))}
//                 </div>
//               )}
//             </div>
//           )}
//           {upgradePos !== null && upgradeOptions.length === 0 && (
//             <div className="text-xs text-gray-500 font-mono bg-gray-700 px-3 py-1.5 rounded">
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
//                       className={`relative rounded-lg border-2 flex flex-col items-start p-1 text-xs text-white cursor-pointer transition-all hover:brightness-110 ${cellBg} ${hoverCls}`}
//                       style={{ minHeight: cellMinH }}
//                     >
//                       <div className="flex justify-between w-full text-[9px] opacity-40 mb-0.5">
//                         <span>{pos}</span>
//                         <span className="font-mono">{posToMetric(pos)}</span>
//                       </div>

//                       {coin ? (
//                         <div className="flex flex-col items-center w-full gap-0.5">

//                           <div className="text-sm">🟡</div>

//                           {/* Color dropdown */}
//                           <select
//                             className="bg-gray-800 text-white text-[9px] w-full rounded px-0.5 py-0.5 border-0 font-mono"
//                             value={coin.colorCode}
//                             onClick={e => e.stopPropagation()}
//                             onChange={e => updateCoin(pos, "colorCode", Number(e.target.value))}
//                           >
//                             {coinColors.map(c => (
//                               <option key={c.value} value={c.value} className="bg-gray-800">{c.label}</option>
//                             ))}
//                           </select>

//                           {/* Value — Double: LEFT+RIGHT; others: single */}
//                           {config.hasDouble ? (
//                             <>
//                               <div className="flex items-center gap-0.5 w-full">
//                                 <span className="text-[7px] text-red-300 font-mono w-4 shrink-0">←L</span>
//                                 <select className="bg-red-950 text-red-200 text-[9px] flex-1 rounded px-0 py-0.5 border-0 font-mono"
//                                   value={coin.leftValue || ""}
//                                   onClick={e => e.stopPropagation()}
//                                   onChange={e => updateCoin(pos, "leftValue", e.target.value)}>
//                                   <option value="">--</option>
//                                   {COMBO_COIN_VALUES.map(v => <option key={v} value={v} className="bg-gray-800">{v}</option>)}
//                                 </select>
//                               </div>
//                               <div className="flex items-center gap-0.5 w-full">
//                                 <span className="text-[7px] text-red-300 font-mono w-4 shrink-0">R→</span>
//                                 <select className="bg-red-950 text-red-200 text-[9px] flex-1 rounded px-0 py-0.5 border-0 font-mono"
//                                   value={coin.rightValue || ""}
//                                   onClick={e => e.stopPropagation()}
//                                   onChange={e => updateCoin(pos, "rightValue", e.target.value)}>
//                                   <option value="">--</option>
//                                   {COMBO_COIN_VALUES.map(v => <option key={v} value={v} className="bg-gray-800">{v}</option>)}
//                                 </select>
//                               </div>
//                             </>
//                           ) : (
//                             <select
//                               className="bg-gray-800 text-white text-[9px] w-full rounded px-0.5 py-0.5 border-0 font-mono"
//                               value={coin.value}
//                               onClick={e => e.stopPropagation()}
//                               onChange={e => updateCoin(pos, "value", e.target.value)}>
//                               {COMBO_COIN_VALUES.map(v => (
//                                 <option key={v} value={v} className="bg-gray-800">{v}</option>
//                               ))}
//                             </select>
//                           )}

//                           {/* Ultra boost — single dropdown when no double */}
//                           {config.hasUltra && !config.hasDouble && (
//                             <select
//                               className="bg-purple-950 text-purple-200 text-[9px] w-full rounded px-0.5 py-0.5 border-0 font-mono"
//                               value={coin.boostValue || ""}
//                               onClick={e => e.stopPropagation()}
//                               onChange={e => updateCoin(pos, "boostValue", e.target.value)}>
//                               <option value="">Boost</option>
//                               {ULTRA_BOOST_VALUES.map(v => <option key={v} value={v} className="bg-gray-800">{v}</option>)}
//                             </select>
//                           )}

//                           {/* Ultra boost — LEFT/RIGHT side picker in Double+Ultra combo */}
//                           {config.hasDouble && config.hasUltra && (
//                             <div className="w-full mt-0.5" onClick={e => e.stopPropagation()}>
//                               <div className="flex gap-0.5 w-full items-end">
//                                 {(["LEFT", "RIGHT"] as const).map(side => {
//                                   const isThis  = coin.boostSide === side;
//                                   const locked  = !!(coin.boostSide && coin.boostSide !== side);
//                                   return (
//                                     <div key={side} className="flex flex-col items-center flex-1 gap-0">
//                                       <span className={`text-[7px] font-mono ${isThis ? "text-yellow-300" : "text-gray-500"}`}>{side}</span>
//                                       <select
//                                         disabled={locked}
//                                         className={`text-[8px] w-full rounded px-0 py-0.5 border-0 font-mono
//                                           ${isThis ? "bg-yellow-700 text-yellow-100" : "bg-purple-950 text-purple-200"}
//                                           ${locked ? "opacity-30 cursor-not-allowed" : ""}`}
//                                         value={isThis ? (coin.boostValue || "") : ""}
//                                         onChange={e => setBoostSide(pos, side, e.target.value)}>
//                                         <option value="">--</option>
//                                         {ULTRA_BOOST_VALUES.map(v => <option key={v} value={v} className="bg-gray-800">{v}</option>)}
//                                       </select>
//                                     </div>
//                                   );
//                                 })}
//                                 {coin.boostSide && (
//                                   <button
//                                     className="text-red-400 hover:text-red-200 text-[8px] pb-0.5 ml-0.5"
//                                     onClick={e => { e.stopPropagation(); updateCoin(pos, "boostValue", ""); updateCoin(pos, "boostSide", null); }}>✕</button>
//                                 )}
//                               </div>
//                             </div>
//                           )}

//                           {/* Feature upgrade radio */}
//                           <div className="flex items-center gap-1 mt-0.5 w-full" onClick={e => e.stopPropagation()}>
//                             <input
//                               type="radio" name="comboUpgrade"
//                               className="accent-yellow-400 w-3 h-3 cursor-pointer"
//                               checked={upgradePos === pos}
//                               onChange={() => handleUpgradeRadio(pos)}
//                             />
//                             <span className="text-[8px] text-yellow-300 font-mono">upgrade</span>
//                             {upgradePos === pos && !isAllColor && upgradeFeatSel && (
//                               <span className="text-[8px] text-yellow-500 font-mono">→{upgradeFeatSel}</span>
//                             )}
//                             {upgradePos === pos && isAllColor && upgradeMultiSel.size > 0 && (
//                               <span className="text-[8px] text-yellow-500 font-mono">→{Array.from(upgradeMultiSel).join("+")}</span>
//                             )}
//                           </div>

//                           {/* Remove — non-base coins only */}
//                           {!coin.fromBase && (
//                             <button
//                               onClick={e => { e.stopPropagation(); removeCoin(pos); }}
//                               className="absolute top-1 right-1 text-[10px] text-red-300 hover:text-red-100 font-bold">✕</button>
//                           )}

//                         </div>
//                       ) : (
//                         <span className="text-white/40 text-[10px] mx-auto mt-4">+ Add</span>
//                       )}
//                     </div>
//                   </div>
//                 );
//               })
//             )}
//           </div>

//           {/* LEGEND */}
//           <div className="text-[10px] text-gray-500 font-mono flex flex-wrap gap-2">
//             <span>🟡 = coin · click empty cell to add · ✕ = remove</span>
//             {config.hasDouble && <span>L← / R→ = LEFT / RIGHT coin values</span>}
//             {config.hasUltra && !config.hasDouble && <span>Boost = ultra boost value</span>}
//             {config.hasDouble && config.hasUltra && <span>L/R boost = side the boost applies to · ✕ to clear side</span>}
//             {config.hasZone && <span>Background = zone regions (splitter {config.splitter})</span>}
//             <span>✦ radio = upgrade · single-color = 1 feature · AllColor = multi-feature</span>
//           </div>

//         </div>
//       )}
//     </div>
//   );
// }


//! working best-----------------------------
// /* eslint-disable @typescript-eslint/no-explicit-any */
// "use client";

// import { useState, useRef } from "react";
// import {
//   ComboCoin, ComboFeatureConfig,
//   getComboMaxSpins, getComboCoinColors,
//   generateCombinationGaffe, resolveUpgradeFeatures, UpgradeInfo,
// } from "./combinationFeatureGenerator";
// import { ZONE_BG_CLASS, ZONE_BORDER_CLASS, getZoneBgColor } from "./zoneFeatureGenerator";
// import { ULTRA_BOOST_VALUES } from "./ultraFeatureGenerator";
// import { posToMetric, ALL_UPGRADE_FEATURES, ZONE_SPLITTER_OPTIONS } from "./config";

// // ── Constants ─────────────────────────────────────────────────────────────────
// // Fix #5: uppercase coin values
// const COMBO_COIN_VALUES = ["100", "250", "500", "MINOR", "MAJOR", "MINI"];

// const FEATURE_BADGE: Record<string, string> = {
//   double: "bg-red-900 text-red-300 border border-red-600",
//   extra:  "bg-emerald-900 text-emerald-300 border border-emerald-600",
//   zone:   "bg-sky-900 text-sky-300 border border-sky-600",
//   ultra:  "bg-purple-900 text-purple-300 border border-purple-600",
// };

// // ── Props ─────────────────────────────────────────────────────────────────────
// type Props = {
//   baseCoins:          ComboCoin[];
//   config:             ComboFeatureConfig;
//   pendingUpgradeInfo: UpgradeInfo | null;   // carried from single-feature upgrade
//   onSpin:             (snapshot: ComboCoin[], line: string) => void;
//   onReset:            () => void;
//   onUpgrade:          (newFeatures: string[], carryCoins: ComboCoin[], upgradeInfo: UpgradeInfo) => void;
// };

// // ── Component ─────────────────────────────────────────────────────────────────
// export default function CombinationFeature({ baseCoins, config, pendingUpgradeInfo, onSpin, onReset, onUpgrade }: Props) {
//   const MAX_SPINS  = getComboMaxSpins(config);
//   const coinColors = getComboCoinColors(config.features);
//   const defaultCode = coinColors[0].value;

//   const [isOpen,    setIsOpen]    = useState(true);
//   const initialSeeds = baseCoins.map(c => ({ ...c, fromBase: true }));
//   const [coins,     setCoins]     = useState<ComboCoin[]>(initialSeeds);
//   const [spinsLeft, setSpinsLeft] = useState(MAX_SPINS);
//   const lastSpinPositions = useRef<Set<number>>(new Set(initialSeeds.map(c => c.position)));

//   // Upgrade state
//   const [upgradePos,          setUpgradePos]          = useState<number | null>(null);
//   const [upgradeFeatSel,      setUpgradeFeatSel]      = useState<string>("");
//   const [upgradeMultiSel,     setUpgradeMultiSel]     = useState<Set<string>>(new Set());
//   const [upgradeZoneSplitter, setUpgradeZoneSplitter] = useState<string>("");
//   const [upgradeZoneMultiRaw, setUpgradeZoneMultiRaw] = useState<string>("");

//   const coinAt = (pos: number) => coins.find(c => c.position === pos);

//   // ── Coin operations ──────────────────────────────────────────────────────
//   const handleCellClick = (pos: number) => {
//     if (coinAt(pos)) return;
//     setCoins(prev => [...prev, {
//       position: pos, colorCode: defaultCode, value: COMBO_COIN_VALUES[0],
//       leftValue: "", rightValue: "", boostValue: "", boostSide: null,
//     }]);
//   };

//   const removeCoin = (pos: number) => {
//     const c = coinAt(pos);
//     if (!c || c.fromBase) return;
//     if (upgradePos === pos) {
//       setUpgradePos(null); setUpgradeFeatSel(""); setUpgradeMultiSel(new Set());
//     }
//     setCoins(prev => prev.filter(x => x.position !== pos));
//   };

//   const updateCoin = (pos: number, field: keyof ComboCoin, val: any) =>
//     setCoins(prev => prev.map(c => c.position === pos ? { ...c, [field]: val } : c));

//   const setBoostSide = (pos: number, side: "LEFT" | "RIGHT", boostVal: string) => {
//     setCoins(prev => prev.map(c => {
//       if (c.position !== pos) return c;
//       if (!boostVal) return { ...c, boostValue: "", boostSide: null };
//       return { ...c, boostValue: boostVal, boostSide: side };
//     }));
//   };

//   // ── Upgrade radio ────────────────────────────────────────────────────────
//   const handleUpgradeRadio = (pos: number) => {
//     if (upgradePos === pos) {
//       setUpgradePos(null); setUpgradeFeatSel(""); setUpgradeMultiSel(new Set()); setUpgradeZoneSplitter(""); setUpgradeZoneMultiRaw(""); return;
//     }
//     setUpgradePos(pos); setUpgradeFeatSel(""); setUpgradeMultiSel(new Set()); setUpgradeZoneSplitter(""); setUpgradeZoneMultiRaw("");
//   };

//   const upgradeCoinn = upgradePos !== null ? coinAt(upgradePos) : null;

//   // AllColor = the coin whose label starts with "AllColor" in this combo's palette
//   const allColorEntry = coinColors.find(c => c.label.startsWith("AllColor"));
//   const isAllColor = !!(upgradeCoinn && allColorEntry && upgradeCoinn.colorCode === allColorEntry.value);

//   // Gold coins (label starts with "Gold") have no upgrade
//   const goldCodes = new Set(coinColors.filter(c => c.label.startsWith("Gold")).map(c => c.value));

//   // Build a colorCode→feature map using color-name semantics from palette labels:
//   // Red→DOUBLE, Blue→ZONE, Green→EXTRA, Purple→ULTRA
//   const COLOR_LABEL_TO_FEATURE: Record<string, string> = {
//     Red: "DOUBLE", Blue: "ZONE", Green: "EXTRA", Purple: "ULTRA",
//   };
//   const activeFeaturesUpper = config.features.map(f => f.toUpperCase());
//   const inactiveFeatures    = ALL_UPGRADE_FEATURES.filter(f => !activeFeaturesUpper.includes(f));
//   const paletteUpgradeMap: Record<number, string> = {};
//   coinColors.forEach(c => {
//     const colorName = c.label.split("(")[0]; // e.g. "Purple" from "Purple(4)"
//     const feat = COLOR_LABEL_TO_FEATURE[colorName];
//     if (feat) paletteUpgradeMap[c.value] = feat;
//   });

//   const upgradeOptions: string[] = (() => {
//     if (!upgradeCoinn) return [];
//     if (goldCodes.has(upgradeCoinn.colorCode)) return [];
//     if (isAllColor) return inactiveFeatures;
//     const feat = paletteUpgradeMap[upgradeCoinn.colorCode];
//     // Only offer if that feature is actually inactive in this combo
//     return feat && !activeFeaturesUpper.includes(feat) ? [feat] : [];
//   })();

//   const toggleMulti = (f: string) => {
//     setUpgradeMultiSel(prev => {
//       const next = new Set(prev);
//       if (next.has(f)) next.delete(f); else next.add(f);
//       return next;
//     });
//   };

//   // The currently selected upgrade features (for combo-internal upgrade)
//   const selectedUpgradeFeats: string[] = isAllColor
//     ? Array.from(upgradeMultiSel)
//     : upgradeFeatSel ? [upgradeFeatSel] : [];

//   // Navigate immediately when upgrade feature selected in combo
//   const navigateComboUpgrade = (feats: string[]) => {
//     if (upgradePos === null || feats.length === 0) return;
//     const hasZone = feats.map(f => f.toUpperCase()).includes("ZONE");
//     const upgradeInfo: UpgradeInfo = {
//       col: Math.floor(upgradePos/3), row: upgradePos%3, features: feats,
//       ...(hasZone && upgradeZoneSplitter ? { zoneSplitter: Number(upgradeZoneSplitter) } : {}),
//       ...(hasZone && upgradeZoneMultiRaw ? { zoneMultipliers: upgradeZoneMultiRaw.split(",").map(n=>n.trim()).filter(Boolean).map(Number) } : {}),
//     };
//     const newFeatures = [...new Set([...config.features, ...feats.map(f => f.toLowerCase())])];
//     onUpgrade(newFeatures, coins, upgradeInfo);
//   };

//   // ── Spin ─────────────────────────────────────────────────────────────────
//   // Uses pendingUpgradeInfo (from single-feature upgrade) on first spin, then it's cleared by parent
//   const handleSpin = () => {
//     if (spinsLeft <= 0) return;
//     const cur = new Set(coins.map(c => c.position));
//     const hasNew = [...cur].some(p => !lastSpinPositions.current.has(p));
//     // If this is an upgrade spin (pendingUpgradeInfo set), always reset to MAX
//     const nextSpins = pendingUpgradeInfo ? MAX_SPINS : (hasNew ? MAX_SPINS : spinsLeft - 1);
//     setSpinsLeft(nextSpins);
//     lastSpinPositions.current = cur;

//     const line = generateCombinationGaffe(coins, config, pendingUpgradeInfo ?? null);
//     onSpin(coins, line);   // parent clears pendingUpgradeInfo after this
//   };

//   const resetFeature = () => {
//     const seeded = baseCoins.map(c => ({ ...c, fromBase: true }));
//     setCoins(seeded);
//     setSpinsLeft(MAX_SPINS);
//     lastSpinPositions.current = new Set(seeded.map(c => c.position));
//     setUpgradePos(null); setUpgradeFeatSel(""); setUpgradeMultiSel(new Set()); setUpgradeZoneSplitter(""); setUpgradeZoneMultiRaw("");
//     onReset();
//   };

//   const activeSplitter = config.hasZone ? (config.splitter ?? 1) : 0;
//   const filled14 = coins.length >= 14 && (config.hasExtra || config.hasUltra);
//   const cellMinH = config.hasDouble && config.hasUltra ? 150
//                  : config.hasDouble                    ? 120
//                  : config.hasUltra                     ? 110
//                  : 100;

//   return (
//     <div className="bg-gray-800 rounded-xl border border-indigo-800">

//       {/* HEADER */}
//       <div onClick={() => setIsOpen(!isOpen)} className="flex justify-between items-center p-4 cursor-pointer select-none">
//         <div className="flex items-center gap-2 flex-wrap">
//           <h2 className="text-lg font-semibold text-white font-mono">⚡ Combination Feature</h2>
//           {config.features.map(name => (
//             <span key={name} className={`text-xs px-2 py-0.5 rounded capitalize font-mono ${FEATURE_BADGE[name] ?? "bg-gray-700 text-gray-300"}`}>
//               {name}
//             </span>
//           ))}
//           {config.hasZone && config.splitter && (
//             <span className="text-xs px-2 py-0.5 rounded bg-sky-900 text-sky-300 border border-sky-700 font-mono">
//               Splitter {config.splitter}
//             </span>
//           )}
//           {pendingUpgradeInfo && (
//             <span className="text-xs px-2 py-0.5 rounded bg-yellow-900 text-yellow-300 border border-yellow-700 font-mono animate-pulse">
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
//             <button onClick={handleSpin} disabled={spinsLeft <= 0}
//               className={`px-6 py-2 rounded font-bold text-white font-mono transition-all ${spinsLeft > 0 ? "bg-indigo-600 hover:bg-indigo-500" : "bg-gray-600 cursor-not-allowed opacity-50"}`}>
//               SPIN
//             </button>
//             <span className="text-sm text-gray-400 font-mono">
//               {spinsLeft} spin{spinsLeft !== 1 ? "s" : ""}
//               {config.hasExtra && <span className="ml-1 text-emerald-400 text-xs">(4 — Extra)</span>}
//             </span>
//             <button onClick={resetFeature} className="px-3 py-1 bg-gray-600 hover:bg-gray-500 rounded text-sm">Reset</button>
//             {filled14 && <span className="text-yellow-400 text-xs font-mono bg-yellow-900/40 px-2 py-0.5 rounded border border-yellow-700">⚠ 14 filled → lastPositionReel</span>}
//           </div>

//           {/* Double+Ultra info */}
//           {config.hasDouble && config.hasUltra && (
//             <div className="text-xs text-purple-300 font-mono bg-purple-900/30 px-3 py-1.5 rounded border border-purple-800">
//               Double+Ultra: select boost on LEFT or RIGHT side per coin — choosing one locks the other. ✕ to clear.
//             </div>
//           )}

//           {/* UPGRADE COIN SELECTED — select feature → navigate immediately */}
//           {upgradePos !== null && upgradeOptions.length > 0 && (
//             <div className="flex flex-col gap-2 bg-yellow-900/20 border border-yellow-800 rounded-lg p-3">
//               <span className="text-yellow-300 text-xs font-mono font-bold">
//                 ✦ Upgrade at {posToMetric(upgradePos)} — select feature to add:
//               </span>
//               {isAllColor ? (
//                 <div className="flex flex-col gap-2">
//                   <div className="flex gap-2 flex-wrap">
//                     {upgradeOptions.map(f => (
//                       <label key={f} className="flex items-center gap-1 cursor-pointer bg-yellow-900/40 border border-yellow-700 rounded px-2 py-1">
//                         <input type="checkbox" className="accent-yellow-400 w-3 h-3"
//                           checked={upgradeMultiSel.has(f)} onChange={() => toggleMulti(f)} />
//                         <span className="text-yellow-100 text-xs font-mono">{f}</span>
//                       </label>
//                     ))}
//                   </div>
//                   {upgradeMultiSel.has("ZONE") && (
//                     <div className="flex gap-3 flex-wrap items-center bg-sky-900/30 border border-sky-800 rounded p-2">
//                       <span className="text-sky-300 text-[10px] font-mono">Zone params:</span>
//                       <div className="flex items-center gap-1">
//                         <span className="text-[10px] text-sky-300 font-mono">Splitter</span>
//                         <select className="bg-sky-950 text-sky-200 text-xs rounded px-1 py-0.5 font-mono border border-sky-700"
//                           value={upgradeZoneSplitter} onChange={e => setUpgradeZoneSplitter(e.target.value)}>
//                           <option value="">--</option>
//                           {ZONE_SPLITTER_OPTIONS.map(v => <option key={v} value={v}>{v}</option>)}
//                         </select>
//                       </div>
//                       <div className="flex items-center gap-1">
//                         <span className="text-[10px] text-sky-300 font-mono">Multipliers</span>
//                         <input type="text" placeholder="e.g. 2,3" value={upgradeZoneMultiRaw} onChange={e => setUpgradeZoneMultiRaw(e.target.value)}
//                           className="bg-sky-950 text-sky-200 text-xs rounded px-1 py-0.5 font-mono border border-sky-700 w-20" />
//                       </div>
//                     </div>
//                   )}
//                   {upgradeMultiSel.size > 0 && (
//                     <button onClick={() => navigateComboUpgrade(Array.from(upgradeMultiSel))}
//                       className="self-start px-3 py-1 bg-yellow-600 hover:bg-yellow-500 rounded text-xs font-mono font-bold transition-all">
//                       → Go to {[...config.features, ...Array.from(upgradeMultiSel).map(f=>f.toLowerCase())].filter((v,i,a)=>a.indexOf(v)===i).join(" + ")}
//                     </button>
//                   )}
//                 </div>
//               ) : (
//                 <div className="flex flex-col gap-2">
//                   <div className="flex gap-2 flex-wrap">
//                     {upgradeOptions.filter(f => f !== "ZONE").map(f => (
//                       <button key={f} onClick={() => navigateComboUpgrade([f])}
//                         className="px-3 py-1.5 bg-yellow-700 hover:bg-yellow-600 border border-yellow-600 rounded text-xs font-mono font-bold transition-all">
//                         → {f}
//                       </button>
//                     ))}
//                   </div>
//                   {upgradeOptions.includes("ZONE") && (
//                     <div className="flex flex-col gap-1.5">
//                       <div className="flex gap-3 flex-wrap items-center bg-sky-900/30 border border-sky-800 rounded p-2">
//                         <span className="text-sky-300 text-[10px] font-mono">Zone params:</span>
//                         <div className="flex items-center gap-1">
//                           <span className="text-[10px] text-sky-300 font-mono">Splitter</span>
//                           <select className="bg-sky-950 text-sky-200 text-xs rounded px-1 py-0.5 font-mono border border-sky-700"
//                             value={upgradeZoneSplitter} onChange={e => setUpgradeZoneSplitter(e.target.value)}>
//                             <option value="">--</option>
//                             {ZONE_SPLITTER_OPTIONS.map(v => <option key={v} value={v}>{v}</option>)}
//                           </select>
//                         </div>
//                         <div className="flex items-center gap-1">
//                           <span className="text-[10px] text-sky-300 font-mono">Multipliers</span>
//                           <input type="text" placeholder="e.g. 2,3" value={upgradeZoneMultiRaw} onChange={e => setUpgradeZoneMultiRaw(e.target.value)}
//                             className="bg-sky-950 text-sky-200 text-xs rounded px-1 py-0.5 font-mono border border-sky-700 w-20" />
//                         </div>
//                       </div>
//                       <button onClick={() => navigateComboUpgrade(["ZONE"])}
//                         className="self-start px-3 py-1 bg-sky-700 hover:bg-sky-600 border border-sky-500 rounded text-xs font-mono font-bold transition-all">
//                         → Go to {[...config.features, "zone"].join(" + ")}
//                       </button>
//                     </div>
//                   )}
//                 </div>
//               )}
//             </div>
//           )}
//           {upgradePos !== null && upgradeOptions.length === 0 && (
//             <div className="text-xs text-gray-500 font-mono bg-gray-700 px-3 py-1.5 rounded">
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
//                       className={`relative rounded-lg border-2 flex flex-col items-start p-1 text-xs text-white cursor-pointer transition-all hover:brightness-110 ${cellBg} ${hoverCls}`}
//                       style={{ minHeight: cellMinH }}
//                     >
//                       <div className="flex justify-between w-full text-[9px] opacity-40 mb-0.5">
//                         <span>{pos}</span>
//                         <span className="font-mono">{posToMetric(pos)}</span>
//                       </div>

//                       {coin ? (
//                         <div className="flex flex-col items-center w-full gap-0.5">

//                           <div className="text-sm">🟡</div>

//                           {/* Color dropdown */}
//                           <select
//                             className="bg-gray-800 text-white text-[9px] w-full rounded px-0.5 py-0.5 border-0 font-mono"
//                             value={coin.colorCode}
//                             onClick={e => e.stopPropagation()}
//                             onChange={e => updateCoin(pos, "colorCode", Number(e.target.value))}
//                           >
//                             {coinColors.map(c => (
//                               <option key={c.value} value={c.value} className="bg-gray-800">{c.label}</option>
//                             ))}
//                           </select>

//                           {/* Value — Double: LEFT+RIGHT; others: single */}
//                           {config.hasDouble ? (
//                             <>
//                               <div className="flex items-center gap-0.5 w-full">
//                                 <span className="text-[7px] text-red-300 font-mono w-4 shrink-0">←L</span>
//                                 <select className="bg-red-950 text-red-200 text-[9px] flex-1 rounded px-0 py-0.5 border-0 font-mono"
//                                   value={coin.leftValue || ""}
//                                   onClick={e => e.stopPropagation()}
//                                   onChange={e => updateCoin(pos, "leftValue", e.target.value)}>
//                                   <option value="">--</option>
//                                   {COMBO_COIN_VALUES.map(v => <option key={v} value={v} className="bg-gray-800">{v}</option>)}
//                                 </select>
//                               </div>
//                               <div className="flex items-center gap-0.5 w-full">
//                                 <span className="text-[7px] text-red-300 font-mono w-4 shrink-0">R→</span>
//                                 <select className="bg-red-950 text-red-200 text-[9px] flex-1 rounded px-0 py-0.5 border-0 font-mono"
//                                   value={coin.rightValue || ""}
//                                   onClick={e => e.stopPropagation()}
//                                   onChange={e => updateCoin(pos, "rightValue", e.target.value)}>
//                                   <option value="">--</option>
//                                   {COMBO_COIN_VALUES.map(v => <option key={v} value={v} className="bg-gray-800">{v}</option>)}
//                                 </select>
//                               </div>
//                             </>
//                           ) : (
//                             <select
//                               className="bg-gray-800 text-white text-[9px] w-full rounded px-0.5 py-0.5 border-0 font-mono"
//                               value={coin.value}
//                               onClick={e => e.stopPropagation()}
//                               onChange={e => updateCoin(pos, "value", e.target.value)}>
//                               {COMBO_COIN_VALUES.map(v => (
//                                 <option key={v} value={v} className="bg-gray-800">{v}</option>
//                               ))}
//                             </select>
//                           )}

//                           {/* Ultra boost — single dropdown when no double */}
//                           {config.hasUltra && !config.hasDouble && (
//                             <select
//                               className="bg-purple-950 text-purple-200 text-[9px] w-full rounded px-0.5 py-0.5 border-0 font-mono"
//                               value={coin.boostValue || ""}
//                               onClick={e => e.stopPropagation()}
//                               onChange={e => updateCoin(pos, "boostValue", e.target.value)}>
//                               <option value="">Boost</option>
//                               {ULTRA_BOOST_VALUES.map(v => <option key={v} value={v} className="bg-gray-800">{v}</option>)}
//                             </select>
//                           )}

//                           {/* Ultra boost — LEFT/RIGHT side picker in Double+Ultra combo */}
//                           {config.hasDouble && config.hasUltra && (
//                             <div className="w-full mt-0.5" onClick={e => e.stopPropagation()}>
//                               <div className="flex gap-0.5 w-full items-end">
//                                 {(["LEFT", "RIGHT"] as const).map(side => {
//                                   const isThis  = coin.boostSide === side;
//                                   const locked  = !!(coin.boostSide && coin.boostSide !== side);
//                                   return (
//                                     <div key={side} className="flex flex-col items-center flex-1 gap-0">
//                                       <span className={`text-[7px] font-mono ${isThis ? "text-yellow-300" : "text-gray-500"}`}>{side}</span>
//                                       <select
//                                         disabled={locked}
//                                         className={`text-[8px] w-full rounded px-0 py-0.5 border-0 font-mono
//                                           ${isThis ? "bg-yellow-700 text-yellow-100" : "bg-purple-950 text-purple-200"}
//                                           ${locked ? "opacity-30 cursor-not-allowed" : ""}`}
//                                         value={isThis ? (coin.boostValue || "") : ""}
//                                         onChange={e => setBoostSide(pos, side, e.target.value)}>
//                                         <option value="">--</option>
//                                         {ULTRA_BOOST_VALUES.map(v => <option key={v} value={v} className="bg-gray-800">{v}</option>)}
//                                       </select>
//                                     </div>
//                                   );
//                                 })}
//                                 {coin.boostSide && (
//                                   <button
//                                     className="text-red-400 hover:text-red-200 text-[8px] pb-0.5 ml-0.5"
//                                     onClick={e => { e.stopPropagation(); updateCoin(pos, "boostValue", ""); updateCoin(pos, "boostSide", null); }}>✕</button>
//                                 )}
//                               </div>
//                             </div>
//                           )}

//                           {/* Feature upgrade radio */}
//                           <div className="flex items-center gap-1 mt-0.5 w-full" onClick={e => e.stopPropagation()}>
//                             <input
//                               type="radio" name="comboUpgrade"
//                               className="accent-yellow-400 w-3 h-3 cursor-pointer"
//                               checked={upgradePos === pos}
//                               onChange={() => handleUpgradeRadio(pos)}
//                             />
//                             <span className="text-[8px] text-yellow-300 font-mono">upgrade</span>
//                             {upgradePos === pos && !isAllColor && upgradeFeatSel && (
//                               <span className="text-[8px] text-yellow-500 font-mono">→{upgradeFeatSel}</span>
//                             )}
//                             {upgradePos === pos && isAllColor && upgradeMultiSel.size > 0 && (
//                               <span className="text-[8px] text-yellow-500 font-mono">→{Array.from(upgradeMultiSel).join("+")}</span>
//                             )}
//                           </div>

//                           {/* Remove — non-base coins only */}
//                           {!coin.fromBase && (
//                             <button
//                               onClick={e => { e.stopPropagation(); removeCoin(pos); }}
//                               className="absolute top-1 right-1 text-[10px] text-red-300 hover:text-red-100 font-bold">✕</button>
//                           )}

//                         </div>
//                       ) : (
//                         <span className="text-white/40 text-[10px] mx-auto mt-4">+ Add</span>
//                       )}
//                     </div>
//                   </div>
//                 );
//               })
//             )}
//           </div>

//           {/* LEGEND */}
//           <div className="text-[10px] text-gray-500 font-mono flex flex-wrap gap-2">
//             <span>🟡 = coin · click empty cell to add · ✕ = remove</span>
//             {config.hasDouble && <span>L← / R→ = LEFT / RIGHT coin values</span>}
//             {config.hasUltra && !config.hasDouble && <span>Boost = ultra boost value</span>}
//             {config.hasDouble && config.hasUltra && <span>L/R boost = side the boost applies to · ✕ to clear side</span>}
//             {config.hasZone && <span>Background = zone regions (splitter {config.splitter})</span>}
//             <span>✦ radio = upgrade · single-color = 1 feature · AllColor = multi-feature</span>
//           </div>

//         </div>
//       )}
//     </div>
//   );
// }




// // // //?new latest 
// // /* eslint-disable @typescript-eslint/no-explicit-any */
// // "use client";

// // import { useState, useRef } from "react";
// // import {
// //   ComboCoin, ComboFeatureConfig,
// //   getComboMaxSpins, getComboCoinColors,
// //   generateCombinationGaffe, resolveUpgradeFeatures, UpgradeInfo,
// // } from "./combinationFeatureGenerator";
// // import { ZONE_BG_CLASS, ZONE_BORDER_CLASS, getZoneBgColor } from "./zoneFeatureGenerator";
// // import { ULTRA_BOOST_VALUES } from "./ultraFeatureGenerator";
// // import { posToMetric, ALL_UPGRADE_FEATURES } from "./config";

// // // ── Constants ─────────────────────────────────────────────────────────────────
// // // Fix #5: uppercase coin values
// // const COMBO_COIN_VALUES = ["100", "250", "500", "MINOR", "MAJOR", "MINI"];

// // const FEATURE_BADGE: Record<string, string> = {
// //   double: "bg-red-900 text-red-300 border border-red-600",
// //   extra:  "bg-emerald-900 text-emerald-300 border border-emerald-600",
// //   zone:   "bg-sky-900 text-sky-300 border border-sky-600",
// //   ultra:  "bg-purple-900 text-purple-300 border border-purple-600",
// // };

// // // ── Props ─────────────────────────────────────────────────────────────────────
// // type Props = {
// //   baseCoins: ComboCoin[];
// //   config:    ComboFeatureConfig;
// //   onSpin:    (snapshot: ComboCoin[], line: string) => void;
// //   onReset:   () => void;
// //   onUpgrade: (newFeatures: string[], carryCoins: ComboCoin[]) => void;
// // };

// // // ── Component ─────────────────────────────────────────────────────────────────
// // export default function CombinationFeature({ baseCoins, config, onSpin, onReset, onUpgrade }: Props) {
// //   const MAX_SPINS  = getComboMaxSpins(config);
// //   const coinColors = getComboCoinColors(config.features);
// //   const defaultCode = coinColors[0].value;

// //   const [isOpen,    setIsOpen]    = useState(true);
// //   const initialSeeds = baseCoins.map(c => ({ ...c, fromBase: true }));
// //   const [coins,     setCoins]     = useState<ComboCoin[]>(initialSeeds);
// //   const [spinsLeft, setSpinsLeft] = useState(MAX_SPINS);
// //   const lastSpinPositions = useRef<Set<number>>(new Set(initialSeeds.map(c => c.position)));

// //   // Upgrade state
// //   const [upgradePos,      setUpgradePos]      = useState<number | null>(null);
// //   const [upgradeFeatSel,  setUpgradeFeatSel]  = useState<string>("");
// //   const [upgradeMultiSel, setUpgradeMultiSel] = useState<Set<string>>(new Set());

// //   const coinAt = (pos: number) => coins.find(c => c.position === pos);

// //   // ── Coin operations ──────────────────────────────────────────────────────
// //   const handleCellClick = (pos: number) => {
// //     if (coinAt(pos)) return;
// //     setCoins(prev => [...prev, {
// //       position: pos, colorCode: defaultCode, value: COMBO_COIN_VALUES[0],
// //       leftValue: "", rightValue: "", boostValue: "", boostSide: null,
// //     }]);
// //   };

// //   const removeCoin = (pos: number) => {
// //     const c = coinAt(pos);
// //     if (!c || c.fromBase) return;
// //     if (upgradePos === pos) {
// //       setUpgradePos(null); setUpgradeFeatSel(""); setUpgradeMultiSel(new Set());
// //     }
// //     setCoins(prev => prev.filter(x => x.position !== pos));
// //   };

// //   const updateCoin = (pos: number, field: keyof ComboCoin, val: any) =>
// //     setCoins(prev => prev.map(c => c.position === pos ? { ...c, [field]: val } : c));

// //   const setBoostSide = (pos: number, side: "LEFT" | "RIGHT", boostVal: string) => {
// //     setCoins(prev => prev.map(c => {
// //       if (c.position !== pos) return c;
// //       if (!boostVal) return { ...c, boostValue: "", boostSide: null };
// //       return { ...c, boostValue: boostVal, boostSide: side };
// //     }));
// //   };

// //   // ── Upgrade radio ────────────────────────────────────────────────────────
// //   const handleUpgradeRadio = (pos: number) => {
// //     if (upgradePos === pos) {
// //       setUpgradePos(null); setUpgradeFeatSel(""); setUpgradeMultiSel(new Set()); return;
// //     }
// //     setUpgradePos(pos); setUpgradeFeatSel(""); setUpgradeMultiSel(new Set());
// //   };

// //   const upgradeCoinn = upgradePos !== null ? coinAt(upgradePos) : null;

// //   // AllColor = the coin whose label starts with "AllColor" in this combo's palette
// //   const allColorEntry = coinColors.find(c => c.label.startsWith("AllColor"));
// //   const isAllColor = !!(upgradeCoinn && allColorEntry && upgradeCoinn.colorCode === allColorEntry.value);

// //   // Gold coins (label starts with "Gold") have no upgrade
// //   const goldCodes = new Set(coinColors.filter(c => c.label.startsWith("Gold")).map(c => c.value));

// //   const upgradeOptions: string[] = (() => {
// //     if (!upgradeCoinn) return [];
// //     // Gold coins never upgrade
// //     if (goldCodes.has(upgradeCoinn.colorCode)) return [];
// //     const activeFeaturesUpper = config.features.map(f => f.toUpperCase());
// //     if (isAllColor) {
// //       return ALL_UPGRADE_FEATURES.filter(f => !activeFeaturesUpper.includes(f));
// //     }
// //     return resolveUpgradeFeatures(upgradeCoinn.colorCode).filter(f => !activeFeaturesUpper.includes(f));
// //   })();

// //   const toggleMulti = (f: string) => {
// //     setUpgradeMultiSel(prev => {
// //       const next = new Set(prev);
// //       if (next.has(f)) next.delete(f); else next.add(f);
// //       return next;
// //     });
// //   };

// //   // The currently selected upgrade features (for the inline-confirm flow)
// //   const selectedUpgradeFeats: string[] = isAllColor
// //     ? Array.from(upgradeMultiSel)
// //     : upgradeFeatSel ? [upgradeFeatSel] : [];

// //   const canConfirmUpgrade = upgradePos !== null && selectedUpgradeFeats.length > 0;

// //   // ── Confirm upgrade inline — generates gaffe + navigates in one click ────
// //   const handleConfirmUpgrade = () => {
// //     if (!canConfirmUpgrade || upgradePos === null) return;

// //     // Build upgrade info
// //     const upgrade: UpgradeInfo = {
// //       col: Math.floor(upgradePos / 3),
// //       row: upgradePos % 3,
// //       features: selectedUpgradeFeats,
// //     };

// //     // Emit spin line with upgrade baked in
// //     const line = generateCombinationGaffe(coins, config, upgrade);
// //     onSpin(coins, line);

// //     // Navigate immediately to the new combo
// //     const newFeatures = [...new Set([...config.features, ...upgrade.features.map(f => f.toLowerCase())])];
// //     onUpgrade(newFeatures, coins);
// //   };

// //   // ── Spin ─────────────────────────────────────────────────────────────────
// //   const handleSpin = () => {
// //     if (spinsLeft <= 0) return;
// //     const cur = new Set(coins.map(c => c.position));
// //     const hasNew = [...cur].some(p => !lastSpinPositions.current.has(p));
// //     setSpinsLeft(hasNew ? MAX_SPINS : spinsLeft - 1);
// //     lastSpinPositions.current = cur;

// //     const line = generateCombinationGaffe(coins, config, null);
// //     onSpin(coins, line);
// //   };

// //   const resetFeature = () => {
// //     const seeded = baseCoins.map(c => ({ ...c, fromBase: true }));
// //     setCoins(seeded);
// //     setSpinsLeft(MAX_SPINS);
// //     lastSpinPositions.current = new Set(seeded.map(c => c.position));
// //     setUpgradePos(null); setUpgradeFeatSel(""); setUpgradeMultiSel(new Set());
// //     onReset();
// //   };

// //   const activeSplitter = config.hasZone ? (config.splitter ?? 1) : 0;
// //   const filled14 = coins.length >= 14 && (config.hasExtra || config.hasUltra);
// //   const cellMinH = config.hasDouble && config.hasUltra ? 150
// //                  : config.hasDouble                    ? 120
// //                  : config.hasUltra                     ? 110
// //                  : 100;

// //   return (
// //     <div className="bg-gray-800 rounded-xl border border-indigo-800">

// //       {/* HEADER */}
// //       <div onClick={() => setIsOpen(!isOpen)} className="flex justify-between items-center p-4 cursor-pointer select-none">
// //         <div className="flex items-center gap-2 flex-wrap">
// //           <h2 className="text-lg font-semibold text-white font-mono">⚡ Combination Feature</h2>
// //           {config.features.map(name => (
// //             <span key={name} className={`text-xs px-2 py-0.5 rounded capitalize font-mono ${FEATURE_BADGE[name] ?? "bg-gray-700 text-gray-300"}`}>
// //               {name}
// //             </span>
// //           ))}
// //           {config.hasZone && config.splitter && (
// //             <span className="text-xs px-2 py-0.5 rounded bg-sky-900 text-sky-300 border border-sky-700 font-mono">
// //               Splitter {config.splitter}
// //             </span>
// //           )}
// //         </div>
// //         <span className="text-gray-400">{isOpen ? "▼" : "▶"}</span>
// //       </div>

// //       {isOpen && (
// //         <div className="p-4 pt-0 flex flex-col gap-3">

// //           {/* SPIN CONTROLS */}
// //           <div className="flex items-center gap-3 flex-wrap">
// //             <button onClick={handleSpin} disabled={spinsLeft <= 0}
// //               className={`px-6 py-2 rounded font-bold text-white font-mono transition-all ${spinsLeft > 0 ? "bg-indigo-600 hover:bg-indigo-500" : "bg-gray-600 cursor-not-allowed opacity-50"}`}>
// //               SPIN
// //             </button>
// //             <span className="text-sm text-gray-400 font-mono">
// //               {spinsLeft} spin{spinsLeft !== 1 ? "s" : ""}
// //               {config.hasExtra && <span className="ml-1 text-emerald-400 text-xs">(4 — Extra)</span>}
// //             </span>
// //             <button onClick={resetFeature} className="px-3 py-1 bg-gray-600 hover:bg-gray-500 rounded text-sm">Reset</button>
// //             {filled14 && <span className="text-yellow-400 text-xs font-mono bg-yellow-900/40 px-2 py-0.5 rounded border border-yellow-700">⚠ 14 filled → lastPositionReel</span>}
// //           </div>

// //           {/* Double+Ultra info */}
// //           {config.hasDouble && config.hasUltra && (
// //             <div className="text-xs text-purple-300 font-mono bg-purple-900/30 px-3 py-1.5 rounded border border-purple-800">
// //               Double+Ultra: select boost on LEFT or RIGHT side per coin — choosing one locks the other. ✕ to clear.
// //             </div>
// //           )}

// //           {/* UPGRADE COIN SELECTED — feature picker + single Confirm button */}
// //           {upgradePos !== null && upgradeOptions.length > 0 && (
// //             <div className="flex flex-col gap-2 bg-yellow-900/20 border border-yellow-800 rounded-lg p-2">
// //               <span className="text-yellow-300 text-xs font-mono">
// //                 Upgrade {posToMetric(upgradePos)} →
// //                 {isAllColor ? " AllColor coin: select one or more features" : " select feature to add"}
// //               </span>
// //               {isAllColor ? (
// //                 <div className="flex gap-2 flex-wrap">
// //                   {upgradeOptions.map(f => (
// //                     <label key={f} className="flex items-center gap-1 cursor-pointer bg-yellow-900/40 border border-yellow-700 rounded px-2 py-1">
// //                       <input type="checkbox" className="accent-yellow-400 w-3 h-3"
// //                         checked={upgradeMultiSel.has(f)} onChange={() => toggleMulti(f)} />
// //                       <span className="text-yellow-100 text-xs font-mono">{f}</span>
// //                     </label>
// //                   ))}
// //                 </div>
// //               ) : (
// //                 <select className="bg-yellow-900 text-yellow-100 text-xs rounded px-2 py-1 font-mono border border-yellow-700 self-start"
// //                   value={upgradeFeatSel} onChange={e => setUpgradeFeatSel(e.target.value)}>
// //                   <option value="">Select feature...</option>
// //                   {upgradeOptions.map(f => <option key={f} value={f}>{f}</option>)}
// //                 </select>
// //               )}
// //               {canConfirmUpgrade && (
// //                 <button
// //                   onClick={handleConfirmUpgrade}
// //                   className="self-start px-4 py-1.5 bg-yellow-600 hover:bg-yellow-500 rounded font-bold text-sm font-mono transition-all">
// //                   ✦ Confirm → Go to {[...config.features, ...selectedUpgradeFeats.map(f => f.toLowerCase())]
// //                     .filter((v, i, a) => a.indexOf(v) === i).join(" + ")}
// //                 </button>
// //               )}
// //             </div>
// //           )}
// //           {upgradePos !== null && upgradeOptions.length === 0 && (
// //             <div className="text-xs text-gray-500 font-mono bg-gray-700 px-3 py-1.5 rounded">
// //               ℹ No upgrades available (all features already active or coin color doesn&apos;t support)
// //             </div>
// //           )}

// //           {/* GRID — 5 cols × 3 rows, column-major */}
// //           <div className="grid gap-1" style={{ gridTemplateColumns: "repeat(5, minmax(0, 1fr))" }}>
// //             {Array.from({ length: 3 }).map((_, row) =>
// //               Array.from({ length: 5 }).map((_, col) => {
// //                 const pos  = col * 3 + row;
// //                 const coin = coinAt(pos);

// //                 const zoneBg  = config.hasZone ? getZoneBgColor(pos, activeSplitter) : null;
// //                 const cellBg  = zoneBg
// //                   ? `${ZONE_BG_CLASS[zoneBg]} ${ZONE_BORDER_CLASS[zoneBg]}`
// //                   : "bg-gray-700 border-gray-600";
// //                 const hoverCls = !coin && !config.hasZone ? "hover:bg-gray-600 hover:border-gray-400" : "";

// //                 return (
// //                   <div key={pos} className="flex flex-col gap-1">
// //                     <div
// //                       onClick={() => !coin && handleCellClick(pos)}
// //                       className={`relative rounded-lg border-2 flex flex-col items-start p-1 text-xs text-white cursor-pointer transition-all hover:brightness-110 ${cellBg} ${hoverCls}`}
// //                       style={{ minHeight: cellMinH }}
// //                     >
// //                       <div className="flex justify-between w-full text-[9px] opacity-40 mb-0.5">
// //                         <span>{pos}</span>
// //                         <span className="font-mono">{posToMetric(pos)}</span>
// //                       </div>

// //                       {coin ? (
// //                         <div className="flex flex-col items-center w-full gap-0.5">

// //                           <div className="text-sm">🟡</div>

// //                           {/* Color dropdown */}
// //                           <select
// //                             className="bg-gray-800 text-white text-[9px] w-full rounded px-0.5 py-0.5 border-0 font-mono"
// //                             value={coin.colorCode}
// //                             onClick={e => e.stopPropagation()}
// //                             onChange={e => updateCoin(pos, "colorCode", Number(e.target.value))}
// //                           >
// //                             {coinColors.map(c => (
// //                               <option key={c.value} value={c.value} className="bg-gray-800">{c.label}</option>
// //                             ))}
// //                           </select>

// //                           {/* Value — Double: LEFT+RIGHT; others: single */}
// //                           {config.hasDouble ? (
// //                             <>
// //                               <div className="flex items-center gap-0.5 w-full">
// //                                 <span className="text-[7px] text-red-300 font-mono w-4 shrink-0">←L</span>
// //                                 <select className="bg-red-950 text-red-200 text-[9px] flex-1 rounded px-0 py-0.5 border-0 font-mono"
// //                                   value={coin.leftValue || ""}
// //                                   onClick={e => e.stopPropagation()}
// //                                   onChange={e => updateCoin(pos, "leftValue", e.target.value)}>
// //                                   <option value="">--</option>
// //                                   {COMBO_COIN_VALUES.map(v => <option key={v} value={v} className="bg-gray-800">{v}</option>)}
// //                                 </select>
// //                               </div>
// //                               <div className="flex items-center gap-0.5 w-full">
// //                                 <span className="text-[7px] text-red-300 font-mono w-4 shrink-0">R→</span>
// //                                 <select className="bg-red-950 text-red-200 text-[9px] flex-1 rounded px-0 py-0.5 border-0 font-mono"
// //                                   value={coin.rightValue || ""}
// //                                   onClick={e => e.stopPropagation()}
// //                                   onChange={e => updateCoin(pos, "rightValue", e.target.value)}>
// //                                   <option value="">--</option>
// //                                   {COMBO_COIN_VALUES.map(v => <option key={v} value={v} className="bg-gray-800">{v}</option>)}
// //                                 </select>
// //                               </div>
// //                             </>
// //                           ) : (
// //                             <select
// //                               className="bg-gray-800 text-white text-[9px] w-full rounded px-0.5 py-0.5 border-0 font-mono"
// //                               value={coin.value}
// //                               onClick={e => e.stopPropagation()}
// //                               onChange={e => updateCoin(pos, "value", e.target.value)}>
// //                               {COMBO_COIN_VALUES.map(v => (
// //                                 <option key={v} value={v} className="bg-gray-800">{v}</option>
// //                               ))}
// //                             </select>
// //                           )}

// //                           {/* Ultra boost — single dropdown when no double */}
// //                           {config.hasUltra && !config.hasDouble && (
// //                             <select
// //                               className="bg-purple-950 text-purple-200 text-[9px] w-full rounded px-0.5 py-0.5 border-0 font-mono"
// //                               value={coin.boostValue || ""}
// //                               onClick={e => e.stopPropagation()}
// //                               onChange={e => updateCoin(pos, "boostValue", e.target.value)}>
// //                               <option value="">Boost</option>
// //                               {ULTRA_BOOST_VALUES.map(v => <option key={v} value={v} className="bg-gray-800">{v}</option>)}
// //                             </select>
// //                           )}

// //                           {/* Ultra boost — LEFT/RIGHT side picker in Double+Ultra combo */}
// //                           {config.hasDouble && config.hasUltra && (
// //                             <div className="w-full mt-0.5" onClick={e => e.stopPropagation()}>
// //                               <div className="flex gap-0.5 w-full items-end">
// //                                 {(["LEFT", "RIGHT"] as const).map(side => {
// //                                   const isThis  = coin.boostSide === side;
// //                                   const locked  = !!(coin.boostSide && coin.boostSide !== side);
// //                                   return (
// //                                     <div key={side} className="flex flex-col items-center flex-1 gap-0">
// //                                       <span className={`text-[7px] font-mono ${isThis ? "text-yellow-300" : "text-gray-500"}`}>{side}</span>
// //                                       <select
// //                                         disabled={locked}
// //                                         className={`text-[8px] w-full rounded px-0 py-0.5 border-0 font-mono
// //                                           ${isThis ? "bg-yellow-700 text-yellow-100" : "bg-purple-950 text-purple-200"}
// //                                           ${locked ? "opacity-30 cursor-not-allowed" : ""}`}
// //                                         value={isThis ? (coin.boostValue || "") : ""}
// //                                         onChange={e => setBoostSide(pos, side, e.target.value)}>
// //                                         <option value="">--</option>
// //                                         {ULTRA_BOOST_VALUES.map(v => <option key={v} value={v} className="bg-gray-800">{v}</option>)}
// //                                       </select>
// //                                     </div>
// //                                   );
// //                                 })}
// //                                 {coin.boostSide && (
// //                                   <button
// //                                     className="text-red-400 hover:text-red-200 text-[8px] pb-0.5 ml-0.5"
// //                                     onClick={e => { e.stopPropagation(); updateCoin(pos, "boostValue", ""); updateCoin(pos, "boostSide", null); }}>✕</button>
// //                                 )}
// //                               </div>
// //                             </div>
// //                           )}

// //                           {/* Feature upgrade radio */}
// //                           <div className="flex items-center gap-1 mt-0.5 w-full" onClick={e => e.stopPropagation()}>
// //                             <input
// //                               type="radio" name="comboUpgrade"
// //                               className="accent-yellow-400 w-3 h-3 cursor-pointer"
// //                               checked={upgradePos === pos}
// //                               onChange={() => handleUpgradeRadio(pos)}
// //                             />
// //                             <span className="text-[8px] text-yellow-300 font-mono">upgrade</span>
// //                             {upgradePos === pos && !isAllColor && upgradeFeatSel && (
// //                               <span className="text-[8px] text-yellow-500 font-mono">→{upgradeFeatSel}</span>
// //                             )}
// //                             {upgradePos === pos && isAllColor && upgradeMultiSel.size > 0 && (
// //                               <span className="text-[8px] text-yellow-500 font-mono">→{Array.from(upgradeMultiSel).join("+")}</span>
// //                             )}
// //                           </div>

// //                           {/* Remove — non-base coins only */}
// //                           {!coin.fromBase && (
// //                             <button
// //                               onClick={e => { e.stopPropagation(); removeCoin(pos); }}
// //                               className="absolute top-1 right-1 text-[10px] text-red-300 hover:text-red-100 font-bold">✕</button>
// //                           )}

// //                         </div>
// //                       ) : (
// //                         <span className="text-white/40 text-[10px] mx-auto mt-4">+ Add</span>
// //                       )}
// //                     </div>
// //                   </div>
// //                 );
// //               })
// //             )}
// //           </div>

// //           {/* LEGEND */}
// //           <div className="text-[10px] text-gray-500 font-mono flex flex-wrap gap-2">
// //             <span>🟡 = coin · click empty cell to add · ✕ = remove</span>
// //             {config.hasDouble && <span>L← / R→ = LEFT / RIGHT coin values</span>}
// //             {config.hasUltra && !config.hasDouble && <span>Boost = ultra boost value</span>}
// //             {config.hasDouble && config.hasUltra && <span>L/R boost = side the boost applies to · ✕ to clear side</span>}
// //             {config.hasZone && <span>Background = zone regions (splitter {config.splitter})</span>}
// //             <span>✦ radio = upgrade · single-color = 1 feature · AllColor = multi-feature</span>
// //           </div>

// //         </div>
// //       )}
// //     </div>
// //   );
// // }



// /* eslint-disable @typescript-eslint/no-explicit-any */
// "use client";

// import { useState, useRef } from "react";
// import {
//   ComboCoin, ComboFeatureConfig,
//   getComboMaxSpins, getComboCoinColors,
//   generateCombinationGaffe, resolveUpgradeFeatures, UpgradeInfo,
// } from "./combinationFeatureGenerator";
// import { ZONE_BG_CLASS, ZONE_BORDER_CLASS, getZoneBgColor } from "./zoneFeatureGenerator";
// import { ULTRA_BOOST_VALUES } from "./ultraFeatureGenerator";
// import { posToMetric, ALL_UPGRADE_FEATURES } from "./config";

// // ── Constants ─────────────────────────────────────────────────────────────────
// // Fix #5: uppercase coin values
// const COMBO_COIN_VALUES = ["1", "2", "5", "MINOR", "MAJOR", "MINI"];

// const FEATURE_BADGE: Record<string, string> = {
//   double: "bg-red-900 text-red-300 border border-red-600",
//   extra:  "bg-emerald-900 text-emerald-300 border border-emerald-600",
//   zone:   "bg-sky-900 text-sky-300 border border-sky-600",
//   ultra:  "bg-purple-900 text-purple-300 border border-purple-600",
// };

// // ── Props ─────────────────────────────────────────────────────────────────────
// type Props = {
//   baseCoins:          ComboCoin[];
//   config:             ComboFeatureConfig;
//   pendingUpgradeInfo: UpgradeInfo | null;   // carried from single-feature upgrade
//   onSpin:             (snapshot: ComboCoin[], line: string) => void;
//   onReset:            () => void;
//   onUpgrade:          (newFeatures: string[], carryCoins: ComboCoin[], upgradeInfo: UpgradeInfo) => void;
// };

// // ── Component ─────────────────────────────────────────────────────────────────
// export default function CombinationFeature({ baseCoins, config, pendingUpgradeInfo, onSpin, onReset, onUpgrade }: Props) {
//   const MAX_SPINS  = getComboMaxSpins(config);
//   const coinColors = getComboCoinColors(config.features);
//   const defaultCode = coinColors[0].value;

//   const [isOpen,    setIsOpen]    = useState(true);
//   const initialSeeds = baseCoins.map(c => ({ ...c, fromBase: true }));
//   const [coins,     setCoins]     = useState<ComboCoin[]>(initialSeeds);
//   const [spinsLeft, setSpinsLeft] = useState(MAX_SPINS);
//   const lastSpinPositions = useRef<Set<number>>(new Set(initialSeeds.map(c => c.position)));

//   // Upgrade state
//   const [upgradePos,      setUpgradePos]      = useState<number | null>(null);
//   const [upgradeFeatSel,  setUpgradeFeatSel]  = useState<string>("");
//   const [upgradeMultiSel, setUpgradeMultiSel] = useState<Set<string>>(new Set());

//   const coinAt = (pos: number) => coins.find(c => c.position === pos);

//   // ── Coin operations ──────────────────────────────────────────────────────
//   const handleCellClick = (pos: number) => {
//     if (coinAt(pos)) return;
//     setCoins(prev => [...prev, {
//       position: pos, colorCode: defaultCode, value: COMBO_COIN_VALUES[0],
//       leftValue: "", rightValue: "", boostValue: "", boostSide: null,
//     }]);
//   };

//   const removeCoin = (pos: number) => {
//     const c = coinAt(pos);
//     if (!c || c.fromBase) return;
//     if (upgradePos === pos) {
//       setUpgradePos(null); setUpgradeFeatSel(""); setUpgradeMultiSel(new Set());
//     }
//     setCoins(prev => prev.filter(x => x.position !== pos));
//   };

//   const updateCoin = (pos: number, field: keyof ComboCoin, val: any) =>
//     setCoins(prev => prev.map(c => c.position === pos ? { ...c, [field]: val } : c));

//   const setBoostSide = (pos: number, side: "LEFT" | "RIGHT", boostVal: string) => {
//     setCoins(prev => prev.map(c => {
//       if (c.position !== pos) return c;
//       if (!boostVal) return { ...c, boostValue: "", boostSide: null };
//       return { ...c, boostValue: boostVal, boostSide: side };
//     }));
//   };

//   // ── Upgrade radio ────────────────────────────────────────────────────────
//   const handleUpgradeRadio = (pos: number) => {
//     if (upgradePos === pos) {
//       setUpgradePos(null); setUpgradeFeatSel(""); setUpgradeMultiSel(new Set()); return;
//     }
//     setUpgradePos(pos); setUpgradeFeatSel(""); setUpgradeMultiSel(new Set());
//   };

//   const upgradeCoinn = upgradePos !== null ? coinAt(upgradePos) : null;

//   // AllColor = the coin whose label starts with "AllColor" in this combo's palette
//   const allColorEntry = coinColors.find(c => c.label.startsWith("AllColor"));
//   const isAllColor = !!(upgradeCoinn && allColorEntry && upgradeCoinn.colorCode === allColorEntry.value);

//   // Gold coins (label starts with "Gold") have no upgrade
//   const goldCodes = new Set(coinColors.filter(c => c.label.startsWith("Gold")).map(c => c.value));

//   const upgradeOptions: string[] = (() => {
//     if (!upgradeCoinn) return [];
//     // Gold coins never upgrade
//     if (goldCodes.has(upgradeCoinn.colorCode)) return [];
//     const activeFeaturesUpper = config.features.map(f => f.toUpperCase());
//     if (isAllColor) {
//       return ALL_UPGRADE_FEATURES.filter(f => !activeFeaturesUpper.includes(f));
//     }
//     return resolveUpgradeFeatures(upgradeCoinn.colorCode).filter(f => !activeFeaturesUpper.includes(f));
//   })();

//   const toggleMulti = (f: string) => {
//     setUpgradeMultiSel(prev => {
//       const next = new Set(prev);
//       if (next.has(f)) next.delete(f); else next.add(f);
//       return next;
//     });
//   };

//   // The currently selected upgrade features (for combo-internal upgrade)
//   const selectedUpgradeFeats: string[] = isAllColor
//     ? Array.from(upgradeMultiSel)
//     : upgradeFeatSel ? [upgradeFeatSel] : [];

//   // Navigate immediately when upgrade feature selected in combo
//   const navigateComboUpgrade = (feats: string[]) => {
//     if (!upgradePos || feats.length === 0) return;
//     const upgradeInfo: UpgradeInfo = { col: Math.floor(upgradePos/3), row: upgradePos%3, features: feats };
//     const newFeatures = [...new Set([...config.features, ...feats.map(f => f.toLowerCase())])];
//     onUpgrade(newFeatures, coins, upgradeInfo);
//   };

//   // ── Spin ─────────────────────────────────────────────────────────────────
//   // Uses pendingUpgradeInfo (from single-feature upgrade) on first spin, then it's cleared by parent
//   const handleSpin = () => {
//     if (spinsLeft <= 0) return;
//     const cur = new Set(coins.map(c => c.position));
//     const hasNew = [...cur].some(p => !lastSpinPositions.current.has(p));
//     setSpinsLeft(hasNew ? MAX_SPINS : spinsLeft - 1);
//     lastSpinPositions.current = cur;

//     const line = generateCombinationGaffe(coins, config, pendingUpgradeInfo ?? null);
//     onSpin(coins, line);   // parent clears pendingUpgradeInfo after this
//   };

//   const resetFeature = () => {
//     const seeded = baseCoins.map(c => ({ ...c, fromBase: true }));
//     setCoins(seeded);
//     setSpinsLeft(MAX_SPINS);
//     lastSpinPositions.current = new Set(seeded.map(c => c.position));
//     setUpgradePos(null); setUpgradeFeatSel(""); setUpgradeMultiSel(new Set());
//     onReset();
//   };

//   const activeSplitter = config.hasZone ? (config.splitter ?? 1) : 0;
//   const filled14 = coins.length >= 14 && (config.hasExtra || config.hasUltra);
//   const cellMinH = config.hasDouble && config.hasUltra ? 150
//                  : config.hasDouble                    ? 120
//                  : config.hasUltra                     ? 110
//                  : 100;

//   return (
//     <div className="bg-gray-800 rounded-xl border border-indigo-800">

//       {/* HEADER */}
//       <div onClick={() => setIsOpen(!isOpen)} className="flex justify-between items-center p-4 cursor-pointer select-none">
//         <div className="flex items-center gap-2 flex-wrap">
//           <h2 className="text-lg font-semibold text-white font-mono">⚡ Combination Feature</h2>
//           {config.features.map(name => (
//             <span key={name} className={`text-xs px-2 py-0.5 rounded capitalize font-mono ${FEATURE_BADGE[name] ?? "bg-gray-700 text-gray-300"}`}>
//               {name}
//             </span>
//           ))}
//           {config.hasZone && config.splitter && (
//             <span className="text-xs px-2 py-0.5 rounded bg-sky-900 text-sky-300 border border-sky-700 font-mono">
//               Splitter {config.splitter}
//             </span>
//           )}
//           {pendingUpgradeInfo && (
//             <span className="text-xs px-2 py-0.5 rounded bg-yellow-900 text-yellow-300 border border-yellow-700 font-mono animate-pulse">
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
//             <button onClick={handleSpin} disabled={spinsLeft <= 0}
//               className={`px-6 py-2 rounded font-bold text-white font-mono transition-all ${spinsLeft > 0 ? "bg-indigo-600 hover:bg-indigo-500" : "bg-gray-600 cursor-not-allowed opacity-50"}`}>
//               SPIN
//             </button>
//             <span className="text-sm text-gray-400 font-mono">
//               {spinsLeft} spin{spinsLeft !== 1 ? "s" : ""}
//               {config.hasExtra && <span className="ml-1 text-emerald-400 text-xs">(4 — Extra)</span>}
//             </span>
//             <button onClick={resetFeature} className="px-3 py-1 bg-gray-600 hover:bg-gray-500 rounded text-sm">Reset</button>
//             {filled14 && <span className="text-yellow-400 text-xs font-mono bg-yellow-900/40 px-2 py-0.5 rounded border border-yellow-700">⚠ 14 filled → lastPositionReel</span>}
//           </div>

//           {/* Double+Ultra info */}
//           {config.hasDouble && config.hasUltra && (
//             <div className="text-xs text-purple-300 font-mono bg-purple-900/30 px-3 py-1.5 rounded border border-purple-800">
//               Double+Ultra: select boost on LEFT or RIGHT side per coin — choosing one locks the other. ✕ to clear.
//             </div>
//           )}

//           {/* UPGRADE COIN SELECTED — select feature → navigate immediately */}
//           {upgradePos !== null && upgradeOptions.length > 0 && (
//             <div className="flex flex-col gap-2 bg-yellow-900/20 border border-yellow-800 rounded-lg p-2">
//               <span className="text-yellow-300 text-xs font-mono font-bold">
//                 ✦ Upgrade at {posToMetric(upgradePos)} — select feature to add (navigates immediately):
//               </span>
//               {isAllColor ? (
//                 <div className="flex flex-col gap-2">
//                   <div className="flex gap-2 flex-wrap">
//                     {upgradeOptions.map(f => (
//                       <label key={f} className="flex items-center gap-1 cursor-pointer bg-yellow-900/40 border border-yellow-700 rounded px-2 py-1">
//                         <input type="checkbox" className="accent-yellow-400 w-3 h-3"
//                           checked={upgradeMultiSel.has(f)} onChange={() => toggleMulti(f)} />
//                         <span className="text-yellow-100 text-xs font-mono">{f}</span>
//                       </label>
//                     ))}
//                   </div>
//                   {upgradeMultiSel.size > 0 && (
//                     <button onClick={() => navigateComboUpgrade(Array.from(upgradeMultiSel))}
//                       className="self-start px-3 py-1 bg-yellow-600 hover:bg-yellow-500 rounded text-xs font-mono font-bold transition-all">
//                       → Go to {[...config.features, ...Array.from(upgradeMultiSel).map(f=>f.toLowerCase())].filter((v,i,a)=>a.indexOf(v)===i).join(" + ")}
//                     </button>
//                   )}
//                 </div>
//               ) : (
//                 <div className="flex gap-2 flex-wrap">
//                   {upgradeOptions.map(f => (
//                     <button key={f} onClick={() => navigateComboUpgrade([f])}
//                       className="px-3 py-1.5 bg-yellow-700 hover:bg-yellow-600 border border-yellow-600 rounded text-xs font-mono font-bold transition-all">
//                       → {f}
//                     </button>
//                   ))}
//                 </div>
//               )}
//             </div>
//           )}
//           {upgradePos !== null && upgradeOptions.length === 0 && (
//             <div className="text-xs text-gray-500 font-mono bg-gray-700 px-3 py-1.5 rounded">
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
//                       className={`relative rounded-lg border-2 flex flex-col items-start p-1 text-xs text-white cursor-pointer transition-all hover:brightness-110 ${cellBg} ${hoverCls}`}
//                       style={{ minHeight: cellMinH }}
//                     >
//                       <div className="flex justify-between w-full text-[9px] opacity-40 mb-0.5">
//                         <span>{pos}</span>
//                         <span className="font-mono">{posToMetric(pos)}</span>
//                       </div>

//                       {coin ? (
//                         <div className="flex flex-col items-center w-full gap-0.5">

//                           <div className="text-sm">🟡</div>

//                           {/* Color dropdown */}
//                           <select
//                             className="bg-gray-800 text-white text-[9px] w-full rounded px-0.5 py-0.5 border-0 font-mono"
//                             value={coin.colorCode}
//                             onClick={e => e.stopPropagation()}
//                             onChange={e => updateCoin(pos, "colorCode", Number(e.target.value))}
//                           >
//                             {coinColors.map(c => (
//                               <option key={c.value} value={c.value} className="bg-gray-800">{c.label}</option>
//                             ))}
//                           </select>

//                           {/* Value — Double: LEFT+RIGHT; others: single */}
//                           {config.hasDouble ? (
//                             <>
//                               <div className="flex items-center gap-0.5 w-full">
//                                 <span className="text-[7px] text-red-300 font-mono w-4 shrink-0">←L</span>
//                                 <select className="bg-red-950 text-red-200 text-[9px] flex-1 rounded px-0 py-0.5 border-0 font-mono"
//                                   value={coin.leftValue || ""}
//                                   onClick={e => e.stopPropagation()}
//                                   onChange={e => updateCoin(pos, "leftValue", e.target.value)}>
//                                   <option value="">--</option>
//                                   {COMBO_COIN_VALUES.map(v => <option key={v} value={v} className="bg-gray-800">{v}</option>)}
//                                 </select>
//                               </div>
//                               <div className="flex items-center gap-0.5 w-full">
//                                 <span className="text-[7px] text-red-300 font-mono w-4 shrink-0">R→</span>
//                                 <select className="bg-red-950 text-red-200 text-[9px] flex-1 rounded px-0 py-0.5 border-0 font-mono"
//                                   value={coin.rightValue || ""}
//                                   onClick={e => e.stopPropagation()}
//                                   onChange={e => updateCoin(pos, "rightValue", e.target.value)}>
//                                   <option value="">--</option>
//                                   {COMBO_COIN_VALUES.map(v => <option key={v} value={v} className="bg-gray-800">{v}</option>)}
//                                 </select>
//                               </div>
//                             </>
//                           ) : (
//                             <select
//                               className="bg-gray-800 text-white text-[9px] w-full rounded px-0.5 py-0.5 border-0 font-mono"
//                               value={coin.value}
//                               onClick={e => e.stopPropagation()}
//                               onChange={e => updateCoin(pos, "value", e.target.value)}>
//                               {COMBO_COIN_VALUES.map(v => (
//                                 <option key={v} value={v} className="bg-gray-800">{v}</option>
//                               ))}
//                             </select>
//                           )}

//                           {/* Ultra boost — single dropdown when no double */}
//                           {config.hasUltra && !config.hasDouble && (
//                             <select
//                               className="bg-purple-950 text-purple-200 text-[9px] w-full rounded px-0.5 py-0.5 border-0 font-mono"
//                               value={coin.boostValue || ""}
//                               onClick={e => e.stopPropagation()}
//                               onChange={e => updateCoin(pos, "boostValue", e.target.value)}>
//                               <option value="">Boost</option>
//                               {ULTRA_BOOST_VALUES.map(v => <option key={v} value={v} className="bg-gray-800">{v}</option>)}
//                             </select>
//                           )}

//                           {/* Ultra boost — LEFT/RIGHT side picker in Double+Ultra combo */}
//                           {config.hasDouble && config.hasUltra && (
//                             <div className="w-full mt-0.5" onClick={e => e.stopPropagation()}>
//                               <div className="flex gap-0.5 w-full items-end">
//                                 {(["LEFT", "RIGHT"] as const).map(side => {
//                                   const isThis  = coin.boostSide === side;
//                                   const locked  = !!(coin.boostSide && coin.boostSide !== side);
//                                   return (
//                                     <div key={side} className="flex flex-col items-center flex-1 gap-0">
//                                       <span className={`text-[7px] font-mono ${isThis ? "text-yellow-300" : "text-gray-500"}`}>{side}</span>
//                                       <select
//                                         disabled={locked}
//                                         className={`text-[8px] w-full rounded px-0 py-0.5 border-0 font-mono
//                                           ${isThis ? "bg-yellow-700 text-yellow-100" : "bg-purple-950 text-purple-200"}
//                                           ${locked ? "opacity-30 cursor-not-allowed" : ""}`}
//                                         value={isThis ? (coin.boostValue || "") : ""}
//                                         onChange={e => setBoostSide(pos, side, e.target.value)}>
//                                         <option value="">--</option>
//                                         {ULTRA_BOOST_VALUES.map(v => <option key={v} value={v} className="bg-gray-800">{v}</option>)}
//                                       </select>
//                                     </div>
//                                   );
//                                 })}
//                                 {coin.boostSide && (
//                                   <button
//                                     className="text-red-400 hover:text-red-200 text-[8px] pb-0.5 ml-0.5"
//                                     onClick={e => { e.stopPropagation(); updateCoin(pos, "boostValue", ""); updateCoin(pos, "boostSide", null); }}>✕</button>
//                                 )}
//                               </div>
//                             </div>
//                           )}

//                           {/* Feature upgrade radio */}
//                           <div className="flex items-center gap-1 mt-0.5 w-full" onClick={e => e.stopPropagation()}>
//                             <input
//                               type="radio" name="comboUpgrade"
//                               className="accent-yellow-400 w-3 h-3 cursor-pointer"
//                               checked={upgradePos === pos}
//                               onChange={() => handleUpgradeRadio(pos)}
//                             />
//                             <span className="text-[8px] text-yellow-300 font-mono">upgrade</span>
//                             {upgradePos === pos && !isAllColor && upgradeFeatSel && (
//                               <span className="text-[8px] text-yellow-500 font-mono">→{upgradeFeatSel}</span>
//                             )}
//                             {upgradePos === pos && isAllColor && upgradeMultiSel.size > 0 && (
//                               <span className="text-[8px] text-yellow-500 font-mono">→{Array.from(upgradeMultiSel).join("+")}</span>
//                             )}
//                           </div>

//                           {/* Remove — non-base coins only */}
//                           {!coin.fromBase && (
//                             <button
//                               onClick={e => { e.stopPropagation(); removeCoin(pos); }}
//                               className="absolute top-1 right-1 text-[10px] text-red-300 hover:text-red-100 font-bold">✕</button>
//                           )}

//                         </div>
//                       ) : (
//                         <span className="text-white/40 text-[10px] mx-auto mt-4">+ Add</span>
//                       )}
//                     </div>
//                   </div>
//                 );
//               })
//             )}
//           </div>

//           {/* LEGEND */}
//           <div className="text-[10px] text-gray-500 font-mono flex flex-wrap gap-2">
//             <span>🟡 = coin · click empty cell to add · ✕ = remove</span>
//             {config.hasDouble && <span>L← / R→ = LEFT / RIGHT coin values</span>}
//             {config.hasUltra && !config.hasDouble && <span>Boost = ultra boost value</span>}
//             {config.hasDouble && config.hasUltra && <span>L/R boost = side the boost applies to · ✕ to clear side</span>}
//             {config.hasZone && <span>Background = zone regions (splitter {config.splitter})</span>}
//             <span>✦ radio = upgrade · single-color = 1 feature · AllColor = multi-feature</span>
//           </div>

//         </div>
//       )}
//     </div>
//   );
// }


//! latest wokring code
/* eslint-disable @typescript-eslint/no-explicit-any */
// "use client";

// import { useState, useRef } from "react";
// import {
//   ComboCoin, ComboFeatureConfig,
//   getComboMaxSpins, getComboCoinColors,
//   generateCombinationGaffe, resolveUpgradeFeatures, UpgradeInfo,
// } from "./combinationFeatureGenerator";
// import { ZONE_BG_CLASS, ZONE_BORDER_CLASS, getZoneBgColor } from "./zoneFeatureGenerator";
// import { ULTRA_BOOST_VALUES } from "./ultraFeatureGenerator";
// import { posToMetric, ALL_UPGRADE_FEATURES } from "./config";

// // ── Constants ─────────────────────────────────────────────────────────────────
// // Fix #5: uppercase coin values
// const COMBO_COIN_VALUES = ["100", "250", "500", "MINOR", "MAJOR", "MINI"];

// const FEATURE_BADGE: Record<string, string> = {
//   double: "bg-red-900 text-red-300 border border-red-600",
//   extra:  "bg-emerald-900 text-emerald-300 border border-emerald-600",
//   zone:   "bg-sky-900 text-sky-300 border border-sky-600",
//   ultra:  "bg-purple-900 text-purple-300 border border-purple-600",
// };

// // ── Props ─────────────────────────────────────────────────────────────────────
// type Props = {
//   baseCoins:          ComboCoin[];
//   config:             ComboFeatureConfig;
//   pendingUpgradeInfo: UpgradeInfo | null;   // carried from single-feature upgrade
//   onSpin:             (snapshot: ComboCoin[], line: string) => void;
//   onReset:            () => void;
//   onUpgrade:          (newFeatures: string[], carryCoins: ComboCoin[], upgradeInfo: UpgradeInfo) => void;
// };

// // ── Component ─────────────────────────────────────────────────────────────────
// export default function CombinationFeature({ baseCoins, config, pendingUpgradeInfo, onSpin, onReset, onUpgrade }: Props) {
//   const MAX_SPINS  = getComboMaxSpins(config);
//   const coinColors = getComboCoinColors(config.features);
//   const defaultCode = coinColors[0].value;

//   const [isOpen,    setIsOpen]    = useState(true);
//   const initialSeeds = baseCoins.map(c => ({ ...c, fromBase: true }));
//   const [coins,     setCoins]     = useState<ComboCoin[]>(initialSeeds);
//   const [spinsLeft, setSpinsLeft] = useState(MAX_SPINS);
//   const lastSpinPositions = useRef<Set<number>>(new Set(initialSeeds.map(c => c.position)));

//   // Upgrade state
//   const [upgradePos,      setUpgradePos]      = useState<number | null>(null);
//   const [upgradeFeatSel,  setUpgradeFeatSel]  = useState<string>("");
//   const [upgradeMultiSel, setUpgradeMultiSel] = useState<Set<string>>(new Set());

//   const coinAt = (pos: number) => coins.find(c => c.position === pos);

//   // ── Coin operations ──────────────────────────────────────────────────────
//   const handleCellClick = (pos: number) => {
//     if (coinAt(pos)) return;
//     setCoins(prev => [...prev, {
//       position: pos, colorCode: defaultCode, value: COMBO_COIN_VALUES[0],
//       leftValue: "", rightValue: "", boostValue: "", boostSide: null,
//     }]);
//   };

//   const removeCoin = (pos: number) => {
//     const c = coinAt(pos);
//     if (!c || c.fromBase) return;
//     if (upgradePos === pos) {
//       setUpgradePos(null); setUpgradeFeatSel(""); setUpgradeMultiSel(new Set());
//     }
//     setCoins(prev => prev.filter(x => x.position !== pos));
//   };

//   const updateCoin = (pos: number, field: keyof ComboCoin, val: any) =>
//     setCoins(prev => prev.map(c => c.position === pos ? { ...c, [field]: val } : c));

//   const setBoostSide = (pos: number, side: "LEFT" | "RIGHT", boostVal: string) => {
//     setCoins(prev => prev.map(c => {
//       if (c.position !== pos) return c;
//       if (!boostVal) return { ...c, boostValue: "", boostSide: null };
//       return { ...c, boostValue: boostVal, boostSide: side };
//     }));
//   };

//   // ── Upgrade radio ────────────────────────────────────────────────────────
//   const handleUpgradeRadio = (pos: number) => {
//     if (upgradePos === pos) {
//       setUpgradePos(null); setUpgradeFeatSel(""); setUpgradeMultiSel(new Set()); return;
//     }
//     setUpgradePos(pos); setUpgradeFeatSel(""); setUpgradeMultiSel(new Set());
//   };

//   const upgradeCoinn = upgradePos !== null ? coinAt(upgradePos) : null;

//   // AllColor = the coin whose label starts with "AllColor" in this combo's palette
//   const allColorEntry = coinColors.find(c => c.label.startsWith("AllColor"));
//   const isAllColor = !!(upgradeCoinn && allColorEntry && upgradeCoinn.colorCode === allColorEntry.value);

//   // Gold coins (label starts with "Gold") have no upgrade
//   const goldCodes = new Set(coinColors.filter(c => c.label.startsWith("Gold")).map(c => c.value));

//   const upgradeOptions: string[] = (() => {
//     if (!upgradeCoinn) return [];
//     // Gold coins never upgrade
//     if (goldCodes.has(upgradeCoinn.colorCode)) return [];
//     const activeFeaturesUpper = config.features.map(f => f.toUpperCase());
//     if (isAllColor) {
//       return ALL_UPGRADE_FEATURES.filter(f => !activeFeaturesUpper.includes(f));
//     }
//     return resolveUpgradeFeatures(upgradeCoinn.colorCode).filter(f => !activeFeaturesUpper.includes(f));
//   })();

//   const toggleMulti = (f: string) => {
//     setUpgradeMultiSel(prev => {
//       const next = new Set(prev);
//       if (next.has(f)) next.delete(f); else next.add(f);
//       return next;
//     });
//   };

//   // The currently selected upgrade features (for combo-internal upgrade)
//   const selectedUpgradeFeats: string[] = isAllColor
//     ? Array.from(upgradeMultiSel)
//     : upgradeFeatSel ? [upgradeFeatSel] : [];

//   // Navigate immediately when upgrade feature selected in combo
//   const navigateComboUpgrade = (feats: string[]) => {
//     if (upgradePos === null || feats.length === 0) return;
//     const upgradeInfo: UpgradeInfo = { col: Math.floor(upgradePos/3), row: upgradePos%3, features: feats };
//     const newFeatures = [...new Set([...config.features, ...feats.map(f => f.toLowerCase())])];
//     onUpgrade(newFeatures, coins, upgradeInfo);
//   };

//   // ── Spin ─────────────────────────────────────────────────────────────────
//   // Uses pendingUpgradeInfo (from single-feature upgrade) on first spin, then it's cleared by parent
//   const handleSpin = () => {
//     if (spinsLeft <= 0) return;
//     const cur = new Set(coins.map(c => c.position));
//     const hasNew = [...cur].some(p => !lastSpinPositions.current.has(p));
//     setSpinsLeft(hasNew ? MAX_SPINS : spinsLeft - 1);
//     lastSpinPositions.current = cur;

//     const line = generateCombinationGaffe(coins, config, pendingUpgradeInfo ?? null);
//     onSpin(coins, line);   // parent clears pendingUpgradeInfo after this
//   };

//   const resetFeature = () => {
//     const seeded = baseCoins.map(c => ({ ...c, fromBase: true }));
//     setCoins(seeded);
//     setSpinsLeft(MAX_SPINS);
//     lastSpinPositions.current = new Set(seeded.map(c => c.position));
//     setUpgradePos(null); setUpgradeFeatSel(""); setUpgradeMultiSel(new Set());
//     onReset();
//   };

//   const activeSplitter = config.hasZone ? (config.splitter ?? 1) : 0;
//   const filled14 = coins.length >= 14 && (config.hasExtra || config.hasUltra);
//   const cellMinH = config.hasDouble && config.hasUltra ? 150
//                  : config.hasDouble                    ? 120
//                  : config.hasUltra                     ? 110
//                  : 100;

//   return (
//     <div className="bg-gray-800 rounded-xl border border-indigo-800">

//       {/* HEADER */}
//       <div onClick={() => setIsOpen(!isOpen)} className="flex justify-between items-center p-4 cursor-pointer select-none">
//         <div className="flex items-center gap-2 flex-wrap">
//           <h2 className="text-lg font-semibold text-white font-mono">⚡ Combination Feature</h2>
//           {config.features.map(name => (
//             <span key={name} className={`text-xs px-2 py-0.5 rounded capitalize font-mono ${FEATURE_BADGE[name] ?? "bg-gray-700 text-gray-300"}`}>
//               {name}
//             </span>
//           ))}
//           {config.hasZone && config.splitter && (
//             <span className="text-xs px-2 py-0.5 rounded bg-sky-900 text-sky-300 border border-sky-700 font-mono">
//               Splitter {config.splitter}
//             </span>
//           )}
//           {pendingUpgradeInfo && (
//             <span className="text-xs px-2 py-0.5 rounded bg-yellow-900 text-yellow-300 border border-yellow-700 font-mono animate-pulse">
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
//             <button onClick={handleSpin} disabled={spinsLeft <= 0}
//               className={`px-6 py-2 rounded font-bold text-white font-mono transition-all ${spinsLeft > 0 ? "bg-indigo-600 hover:bg-indigo-500" : "bg-gray-600 cursor-not-allowed opacity-50"}`}>
//               SPIN
//             </button>
//             <span className="text-sm text-gray-400 font-mono">
//               {spinsLeft} spin{spinsLeft !== 1 ? "s" : ""}
//               {config.hasExtra && <span className="ml-1 text-emerald-400 text-xs">(4 — Extra)</span>}
//             </span>
//             <button onClick={resetFeature} className="px-3 py-1 bg-gray-600 hover:bg-gray-500 rounded text-sm">Reset</button>
//             {filled14 && <span className="text-yellow-400 text-xs font-mono bg-yellow-900/40 px-2 py-0.5 rounded border border-yellow-700">⚠ 14 filled → lastPositionReel</span>}
//           </div>

//           {/* Double+Ultra info */}
//           {config.hasDouble && config.hasUltra && (
//             <div className="text-xs text-purple-300 font-mono bg-purple-900/30 px-3 py-1.5 rounded border border-purple-800">
//               Double+Ultra: select boost on LEFT or RIGHT side per coin — choosing one locks the other. ✕ to clear.
//             </div>
//           )}

//           {/* UPGRADE COIN SELECTED — select feature → navigate immediately */}
//           {upgradePos !== null && upgradeOptions.length > 0 && (
//             <div className="flex flex-col gap-2 bg-yellow-900/20 border border-yellow-800 rounded-lg p-2">
//               <span className="text-yellow-300 text-xs font-mono font-bold">
//                 ✦ Upgrade at {posToMetric(upgradePos)} — select feature to add (navigates immediately):
//               </span>
//               {isAllColor ? (
//                 <div className="flex flex-col gap-2">
//                   <div className="flex gap-2 flex-wrap">
//                     {upgradeOptions.map(f => (
//                       <label key={f} className="flex items-center gap-1 cursor-pointer bg-yellow-900/40 border border-yellow-700 rounded px-2 py-1">
//                         <input type="checkbox" className="accent-yellow-400 w-3 h-3"
//                           checked={upgradeMultiSel.has(f)} onChange={() => toggleMulti(f)} />
//                         <span className="text-yellow-100 text-xs font-mono">{f}</span>
//                       </label>
//                     ))}
//                   </div>
//                   {upgradeMultiSel.size > 0 && (
//                     <button onClick={() => navigateComboUpgrade(Array.from(upgradeMultiSel))}
//                       className="self-start px-3 py-1 bg-yellow-600 hover:bg-yellow-500 rounded text-xs font-mono font-bold transition-all">
//                       → Go to {[...config.features, ...Array.from(upgradeMultiSel).map(f=>f.toLowerCase())].filter((v,i,a)=>a.indexOf(v)===i).join(" + ")}
//                     </button>
//                   )}
//                 </div>
//               ) : (
//                 <div className="flex gap-2 flex-wrap">
//                   {upgradeOptions.map(f => (
//                     <button key={f} onClick={() => navigateComboUpgrade([f])}
//                       className="px-3 py-1.5 bg-yellow-700 hover:bg-yellow-600 border border-yellow-600 rounded text-xs font-mono font-bold transition-all">
//                       → {f}
//                     </button>
//                   ))}
//                 </div>
//               )}
//             </div>
//           )}
//           {upgradePos !== null && upgradeOptions.length === 0 && (
//             <div className="text-xs text-gray-500 font-mono bg-gray-700 px-3 py-1.5 rounded">
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
//                       className={`relative rounded-lg border-2 flex flex-col items-start p-1 text-xs text-white cursor-pointer transition-all hover:brightness-110 ${cellBg} ${hoverCls}`}
//                       style={{ minHeight: cellMinH }}
//                     >
//                       <div className="flex justify-between w-full text-[9px] opacity-40 mb-0.5">
//                         <span>{pos}</span>
//                         <span className="font-mono">{posToMetric(pos)}</span>
//                       </div>

//                       {coin ? (
//                         <div className="flex flex-col items-center w-full gap-0.5">

//                           <div className="text-sm">🟡</div>

//                           {/* Color dropdown */}
//                           <select
//                             className="bg-gray-800 text-white text-[9px] w-full rounded px-0.5 py-0.5 border-0 font-mono"
//                             value={coin.colorCode}
//                             onClick={e => e.stopPropagation()}
//                             onChange={e => updateCoin(pos, "colorCode", Number(e.target.value))}
//                           >
//                             {coinColors.map(c => (
//                               <option key={c.value} value={c.value} className="bg-gray-800">{c.label}</option>
//                             ))}
//                           </select>

//                           {/* Value — Double: LEFT+RIGHT; others: single */}
//                           {config.hasDouble ? (
//                             <>
//                               <div className="flex items-center gap-0.5 w-full">
//                                 <span className="text-[7px] text-red-300 font-mono w-4 shrink-0">←L</span>
//                                 <select className="bg-red-950 text-red-200 text-[9px] flex-1 rounded px-0 py-0.5 border-0 font-mono"
//                                   value={coin.leftValue || ""}
//                                   onClick={e => e.stopPropagation()}
//                                   onChange={e => updateCoin(pos, "leftValue", e.target.value)}>
//                                   <option value="">--</option>
//                                   {COMBO_COIN_VALUES.map(v => <option key={v} value={v} className="bg-gray-800">{v}</option>)}
//                                 </select>
//                               </div>
//                               <div className="flex items-center gap-0.5 w-full">
//                                 <span className="text-[7px] text-red-300 font-mono w-4 shrink-0">R→</span>
//                                 <select className="bg-red-950 text-red-200 text-[9px] flex-1 rounded px-0 py-0.5 border-0 font-mono"
//                                   value={coin.rightValue || ""}
//                                   onClick={e => e.stopPropagation()}
//                                   onChange={e => updateCoin(pos, "rightValue", e.target.value)}>
//                                   <option value="">--</option>
//                                   {COMBO_COIN_VALUES.map(v => <option key={v} value={v} className="bg-gray-800">{v}</option>)}
//                                 </select>
//                               </div>
//                             </>
//                           ) : (
//                             <select
//                               className="bg-gray-800 text-white text-[9px] w-full rounded px-0.5 py-0.5 border-0 font-mono"
//                               value={coin.value}
//                               onClick={e => e.stopPropagation()}
//                               onChange={e => updateCoin(pos, "value", e.target.value)}>
//                               {COMBO_COIN_VALUES.map(v => (
//                                 <option key={v} value={v} className="bg-gray-800">{v}</option>
//                               ))}
//                             </select>
//                           )}

//                           {/* Ultra boost — single dropdown when no double */}
//                           {config.hasUltra && !config.hasDouble && (
//                             <select
//                               className="bg-purple-950 text-purple-200 text-[9px] w-full rounded px-0.5 py-0.5 border-0 font-mono"
//                               value={coin.boostValue || ""}
//                               onClick={e => e.stopPropagation()}
//                               onChange={e => updateCoin(pos, "boostValue", e.target.value)}>
//                               <option value="">Boost</option>
//                               {ULTRA_BOOST_VALUES.map(v => <option key={v} value={v} className="bg-gray-800">{v}</option>)}
//                             </select>
//                           )}

//                           {/* Ultra boost — LEFT/RIGHT side picker in Double+Ultra combo */}
//                           {config.hasDouble && config.hasUltra && (
//                             <div className="w-full mt-0.5" onClick={e => e.stopPropagation()}>
//                               <div className="flex gap-0.5 w-full items-end">
//                                 {(["LEFT", "RIGHT"] as const).map(side => {
//                                   const isThis  = coin.boostSide === side;
//                                   const locked  = !!(coin.boostSide && coin.boostSide !== side);
//                                   return (
//                                     <div key={side} className="flex flex-col items-center flex-1 gap-0">
//                                       <span className={`text-[7px] font-mono ${isThis ? "text-yellow-300" : "text-gray-500"}`}>{side}</span>
//                                       <select
//                                         disabled={locked}
//                                         className={`text-[8px] w-full rounded px-0 py-0.5 border-0 font-mono
//                                           ${isThis ? "bg-yellow-700 text-yellow-100" : "bg-purple-950 text-purple-200"}
//                                           ${locked ? "opacity-30 cursor-not-allowed" : ""}`}
//                                         value={isThis ? (coin.boostValue || "") : ""}
//                                         onChange={e => setBoostSide(pos, side, e.target.value)}>
//                                         <option value="">--</option>
//                                         {ULTRA_BOOST_VALUES.map(v => <option key={v} value={v} className="bg-gray-800">{v}</option>)}
//                                       </select>
//                                     </div>
//                                   );
//                                 })}
//                                 {coin.boostSide && (
//                                   <button
//                                     className="text-red-400 hover:text-red-200 text-[8px] pb-0.5 ml-0.5"
//                                     onClick={e => { e.stopPropagation(); updateCoin(pos, "boostValue", ""); updateCoin(pos, "boostSide", null); }}>✕</button>
//                                 )}
//                               </div>
//                             </div>
//                           )}

//                           {/* Feature upgrade radio */}
//                           <div className="flex items-center gap-1 mt-0.5 w-full" onClick={e => e.stopPropagation()}>
//                             <input
//                               type="radio" name="comboUpgrade"
//                               className="accent-yellow-400 w-3 h-3 cursor-pointer"
//                               checked={upgradePos === pos}
//                               onChange={() => handleUpgradeRadio(pos)}
//                             />
//                             <span className="text-[8px] text-yellow-300 font-mono">upgrade</span>
//                             {upgradePos === pos && !isAllColor && upgradeFeatSel && (
//                               <span className="text-[8px] text-yellow-500 font-mono">→{upgradeFeatSel}</span>
//                             )}
//                             {upgradePos === pos && isAllColor && upgradeMultiSel.size > 0 && (
//                               <span className="text-[8px] text-yellow-500 font-mono">→{Array.from(upgradeMultiSel).join("+")}</span>
//                             )}
//                           </div>

//                           {/* Remove — non-base coins only */}
//                           {!coin.fromBase && (
//                             <button
//                               onClick={e => { e.stopPropagation(); removeCoin(pos); }}
//                               className="absolute top-1 right-1 text-[10px] text-red-300 hover:text-red-100 font-bold">✕</button>
//                           )}

//                         </div>
//                       ) : (
//                         <span className="text-white/40 text-[10px] mx-auto mt-4">+ Add</span>
//                       )}
//                     </div>
//                   </div>
//                 );
//               })
//             )}
//           </div>

//           {/* LEGEND */}
//           <div className="text-[10px] text-gray-500 font-mono flex flex-wrap gap-2">
//             <span>🟡 = coin · click empty cell to add · ✕ = remove</span>
//             {config.hasDouble && <span>L← / R→ = LEFT / RIGHT coin values</span>}
//             {config.hasUltra && !config.hasDouble && <span>Boost = ultra boost value</span>}
//             {config.hasDouble && config.hasUltra && <span>L/R boost = side the boost applies to · ✕ to clear side</span>}
//             {config.hasZone && <span>Background = zone regions (splitter {config.splitter})</span>}
//             <span>✦ radio = upgrade · single-color = 1 feature · AllColor = multi-feature</span>
//           </div>

//         </div>
//       )}
//     </div>
//   );
// }

// // // //?new latest 
// // /* eslint-disable @typescript-eslint/no-explicit-any */
// // "use client";

// // import { useState, useRef } from "react";
// // import {
// //   ComboCoin, ComboFeatureConfig,
// //   getComboMaxSpins, getComboCoinColors,
// //   generateCombinationGaffe, resolveUpgradeFeatures, UpgradeInfo,
// // } from "./combinationFeatureGenerator";
// // import { ZONE_BG_CLASS, ZONE_BORDER_CLASS, getZoneBgColor } from "./zoneFeatureGenerator";
// // import { ULTRA_BOOST_VALUES } from "./ultraFeatureGenerator";
// // import { posToMetric, ALL_UPGRADE_FEATURES } from "./config";

// // // ── Constants ─────────────────────────────────────────────────────────────────
// // // Fix #5: uppercase coin values
// // const COMBO_COIN_VALUES = ["100", "250", "500", "MINOR", "MAJOR", "MINI"];

// // const FEATURE_BADGE: Record<string, string> = {
// //   double: "bg-red-900 text-red-300 border border-red-600",
// //   extra:  "bg-emerald-900 text-emerald-300 border border-emerald-600",
// //   zone:   "bg-sky-900 text-sky-300 border border-sky-600",
// //   ultra:  "bg-purple-900 text-purple-300 border border-purple-600",
// // };

// // // ── Props ─────────────────────────────────────────────────────────────────────
// // type Props = {
// //   baseCoins: ComboCoin[];
// //   config:    ComboFeatureConfig;
// //   onSpin:    (snapshot: ComboCoin[], line: string) => void;
// //   onReset:   () => void;
// //   onUpgrade: (newFeatures: string[], carryCoins: ComboCoin[]) => void;
// // };

// // // ── Component ─────────────────────────────────────────────────────────────────
// // export default function CombinationFeature({ baseCoins, config, onSpin, onReset, onUpgrade }: Props) {
// //   const MAX_SPINS  = getComboMaxSpins(config);
// //   const coinColors = getComboCoinColors(config.features);
// //   const defaultCode = coinColors[0].value;

// //   const [isOpen,    setIsOpen]    = useState(true);
// //   const initialSeeds = baseCoins.map(c => ({ ...c, fromBase: true }));
// //   const [coins,     setCoins]     = useState<ComboCoin[]>(initialSeeds);
// //   const [spinsLeft, setSpinsLeft] = useState(MAX_SPINS);
// //   const lastSpinPositions = useRef<Set<number>>(new Set(initialSeeds.map(c => c.position)));

// //   // Upgrade state
// //   const [upgradePos,      setUpgradePos]      = useState<number | null>(null);
// //   const [upgradeFeatSel,  setUpgradeFeatSel]  = useState<string>("");
// //   const [upgradeMultiSel, setUpgradeMultiSel] = useState<Set<string>>(new Set());

// //   const coinAt = (pos: number) => coins.find(c => c.position === pos);

// //   // ── Coin operations ──────────────────────────────────────────────────────
// //   const handleCellClick = (pos: number) => {
// //     if (coinAt(pos)) return;
// //     setCoins(prev => [...prev, {
// //       position: pos, colorCode: defaultCode, value: COMBO_COIN_VALUES[0],
// //       leftValue: "", rightValue: "", boostValue: "", boostSide: null,
// //     }]);
// //   };

// //   const removeCoin = (pos: number) => {
// //     const c = coinAt(pos);
// //     if (!c || c.fromBase) return;
// //     if (upgradePos === pos) {
// //       setUpgradePos(null); setUpgradeFeatSel(""); setUpgradeMultiSel(new Set());
// //     }
// //     setCoins(prev => prev.filter(x => x.position !== pos));
// //   };

// //   const updateCoin = (pos: number, field: keyof ComboCoin, val: any) =>
// //     setCoins(prev => prev.map(c => c.position === pos ? { ...c, [field]: val } : c));

// //   const setBoostSide = (pos: number, side: "LEFT" | "RIGHT", boostVal: string) => {
// //     setCoins(prev => prev.map(c => {
// //       if (c.position !== pos) return c;
// //       if (!boostVal) return { ...c, boostValue: "", boostSide: null };
// //       return { ...c, boostValue: boostVal, boostSide: side };
// //     }));
// //   };

// //   // ── Upgrade radio ────────────────────────────────────────────────────────
// //   const handleUpgradeRadio = (pos: number) => {
// //     if (upgradePos === pos) {
// //       setUpgradePos(null); setUpgradeFeatSel(""); setUpgradeMultiSel(new Set()); return;
// //     }
// //     setUpgradePos(pos); setUpgradeFeatSel(""); setUpgradeMultiSel(new Set());
// //   };

// //   const upgradeCoinn = upgradePos !== null ? coinAt(upgradePos) : null;

// //   // AllColor = the coin whose label starts with "AllColor" in this combo's palette
// //   const allColorEntry = coinColors.find(c => c.label.startsWith("AllColor"));
// //   const isAllColor = !!(upgradeCoinn && allColorEntry && upgradeCoinn.colorCode === allColorEntry.value);

// //   // Gold coins (label starts with "Gold") have no upgrade
// //   const goldCodes = new Set(coinColors.filter(c => c.label.startsWith("Gold")).map(c => c.value));

// //   const upgradeOptions: string[] = (() => {
// //     if (!upgradeCoinn) return [];
// //     // Gold coins never upgrade
// //     if (goldCodes.has(upgradeCoinn.colorCode)) return [];
// //     const activeFeaturesUpper = config.features.map(f => f.toUpperCase());
// //     if (isAllColor) {
// //       return ALL_UPGRADE_FEATURES.filter(f => !activeFeaturesUpper.includes(f));
// //     }
// //     return resolveUpgradeFeatures(upgradeCoinn.colorCode).filter(f => !activeFeaturesUpper.includes(f));
// //   })();

// //   const toggleMulti = (f: string) => {
// //     setUpgradeMultiSel(prev => {
// //       const next = new Set(prev);
// //       if (next.has(f)) next.delete(f); else next.add(f);
// //       return next;
// //     });
// //   };

// //   // The currently selected upgrade features (for the inline-confirm flow)
// //   const selectedUpgradeFeats: string[] = isAllColor
// //     ? Array.from(upgradeMultiSel)
// //     : upgradeFeatSel ? [upgradeFeatSel] : [];

// //   const canConfirmUpgrade = upgradePos !== null && selectedUpgradeFeats.length > 0;

// //   // ── Confirm upgrade inline — generates gaffe + navigates in one click ────
// //   const handleConfirmUpgrade = () => {
// //     if (!canConfirmUpgrade || upgradePos === null) return;

// //     // Build upgrade info
// //     const upgrade: UpgradeInfo = {
// //       col: Math.floor(upgradePos / 3),
// //       row: upgradePos % 3,
// //       features: selectedUpgradeFeats,
// //     };

// //     // Emit spin line with upgrade baked in
// //     const line = generateCombinationGaffe(coins, config, upgrade);
// //     onSpin(coins, line);

// //     // Navigate immediately to the new combo
// //     const newFeatures = [...new Set([...config.features, ...upgrade.features.map(f => f.toLowerCase())])];
// //     onUpgrade(newFeatures, coins);
// //   };

// //   // ── Spin ─────────────────────────────────────────────────────────────────
// //   const handleSpin = () => {
// //     if (spinsLeft <= 0) return;
// //     const cur = new Set(coins.map(c => c.position));
// //     const hasNew = [...cur].some(p => !lastSpinPositions.current.has(p));
// //     setSpinsLeft(hasNew ? MAX_SPINS : spinsLeft - 1);
// //     lastSpinPositions.current = cur;

// //     const line = generateCombinationGaffe(coins, config, null);
// //     onSpin(coins, line);
// //   };

// //   const resetFeature = () => {
// //     const seeded = baseCoins.map(c => ({ ...c, fromBase: true }));
// //     setCoins(seeded);
// //     setSpinsLeft(MAX_SPINS);
// //     lastSpinPositions.current = new Set(seeded.map(c => c.position));
// //     setUpgradePos(null); setUpgradeFeatSel(""); setUpgradeMultiSel(new Set());
// //     onReset();
// //   };

// //   const activeSplitter = config.hasZone ? (config.splitter ?? 1) : 0;
// //   const filled14 = coins.length >= 14 && (config.hasExtra || config.hasUltra);
// //   const cellMinH = config.hasDouble && config.hasUltra ? 150
// //                  : config.hasDouble                    ? 120
// //                  : config.hasUltra                     ? 110
// //                  : 100;

// //   return (
// //     <div className="bg-gray-800 rounded-xl border border-indigo-800">

// //       {/* HEADER */}
// //       <div onClick={() => setIsOpen(!isOpen)} className="flex justify-between items-center p-4 cursor-pointer select-none">
// //         <div className="flex items-center gap-2 flex-wrap">
// //           <h2 className="text-lg font-semibold text-white font-mono">⚡ Combination Feature</h2>
// //           {config.features.map(name => (
// //             <span key={name} className={`text-xs px-2 py-0.5 rounded capitalize font-mono ${FEATURE_BADGE[name] ?? "bg-gray-700 text-gray-300"}`}>
// //               {name}
// //             </span>
// //           ))}
// //           {config.hasZone && config.splitter && (
// //             <span className="text-xs px-2 py-0.5 rounded bg-sky-900 text-sky-300 border border-sky-700 font-mono">
// //               Splitter {config.splitter}
// //             </span>
// //           )}
// //         </div>
// //         <span className="text-gray-400">{isOpen ? "▼" : "▶"}</span>
// //       </div>

// //       {isOpen && (
// //         <div className="p-4 pt-0 flex flex-col gap-3">

// //           {/* SPIN CONTROLS */}
// //           <div className="flex items-center gap-3 flex-wrap">
// //             <button onClick={handleSpin} disabled={spinsLeft <= 0}
// //               className={`px-6 py-2 rounded font-bold text-white font-mono transition-all ${spinsLeft > 0 ? "bg-indigo-600 hover:bg-indigo-500" : "bg-gray-600 cursor-not-allowed opacity-50"}`}>
// //               SPIN
// //             </button>
// //             <span className="text-sm text-gray-400 font-mono">
// //               {spinsLeft} spin{spinsLeft !== 1 ? "s" : ""}
// //               {config.hasExtra && <span className="ml-1 text-emerald-400 text-xs">(4 — Extra)</span>}
// //             </span>
// //             <button onClick={resetFeature} className="px-3 py-1 bg-gray-600 hover:bg-gray-500 rounded text-sm">Reset</button>
// //             {filled14 && <span className="text-yellow-400 text-xs font-mono bg-yellow-900/40 px-2 py-0.5 rounded border border-yellow-700">⚠ 14 filled → lastPositionReel</span>}
// //           </div>

// //           {/* Double+Ultra info */}
// //           {config.hasDouble && config.hasUltra && (
// //             <div className="text-xs text-purple-300 font-mono bg-purple-900/30 px-3 py-1.5 rounded border border-purple-800">
// //               Double+Ultra: select boost on LEFT or RIGHT side per coin — choosing one locks the other. ✕ to clear.
// //             </div>
// //           )}

// //           {/* UPGRADE COIN SELECTED — feature picker + single Confirm button */}
// //           {upgradePos !== null && upgradeOptions.length > 0 && (
// //             <div className="flex flex-col gap-2 bg-yellow-900/20 border border-yellow-800 rounded-lg p-2">
// //               <span className="text-yellow-300 text-xs font-mono">
// //                 Upgrade {posToMetric(upgradePos)} →
// //                 {isAllColor ? " AllColor coin: select one or more features" : " select feature to add"}
// //               </span>
// //               {isAllColor ? (
// //                 <div className="flex gap-2 flex-wrap">
// //                   {upgradeOptions.map(f => (
// //                     <label key={f} className="flex items-center gap-1 cursor-pointer bg-yellow-900/40 border border-yellow-700 rounded px-2 py-1">
// //                       <input type="checkbox" className="accent-yellow-400 w-3 h-3"
// //                         checked={upgradeMultiSel.has(f)} onChange={() => toggleMulti(f)} />
// //                       <span className="text-yellow-100 text-xs font-mono">{f}</span>
// //                     </label>
// //                   ))}
// //                 </div>
// //               ) : (
// //                 <select className="bg-yellow-900 text-yellow-100 text-xs rounded px-2 py-1 font-mono border border-yellow-700 self-start"
// //                   value={upgradeFeatSel} onChange={e => setUpgradeFeatSel(e.target.value)}>
// //                   <option value="">Select feature...</option>
// //                   {upgradeOptions.map(f => <option key={f} value={f}>{f}</option>)}
// //                 </select>
// //               )}
// //               {canConfirmUpgrade && (
// //                 <button
// //                   onClick={handleConfirmUpgrade}
// //                   className="self-start px-4 py-1.5 bg-yellow-600 hover:bg-yellow-500 rounded font-bold text-sm font-mono transition-all">
// //                   ✦ Confirm → Go to {[...config.features, ...selectedUpgradeFeats.map(f => f.toLowerCase())]
// //                     .filter((v, i, a) => a.indexOf(v) === i).join(" + ")}
// //                 </button>
// //               )}
// //             </div>
// //           )}
// //           {upgradePos !== null && upgradeOptions.length === 0 && (
// //             <div className="text-xs text-gray-500 font-mono bg-gray-700 px-3 py-1.5 rounded">
// //               ℹ No upgrades available (all features already active or coin color doesn&apos;t support)
// //             </div>
// //           )}

// //           {/* GRID — 5 cols × 3 rows, column-major */}
// //           <div className="grid gap-1" style={{ gridTemplateColumns: "repeat(5, minmax(0, 1fr))" }}>
// //             {Array.from({ length: 3 }).map((_, row) =>
// //               Array.from({ length: 5 }).map((_, col) => {
// //                 const pos  = col * 3 + row;
// //                 const coin = coinAt(pos);

// //                 const zoneBg  = config.hasZone ? getZoneBgColor(pos, activeSplitter) : null;
// //                 const cellBg  = zoneBg
// //                   ? `${ZONE_BG_CLASS[zoneBg]} ${ZONE_BORDER_CLASS[zoneBg]}`
// //                   : "bg-gray-700 border-gray-600";
// //                 const hoverCls = !coin && !config.hasZone ? "hover:bg-gray-600 hover:border-gray-400" : "";

// //                 return (
// //                   <div key={pos} className="flex flex-col gap-1">
// //                     <div
// //                       onClick={() => !coin && handleCellClick(pos)}
// //                       className={`relative rounded-lg border-2 flex flex-col items-start p-1 text-xs text-white cursor-pointer transition-all hover:brightness-110 ${cellBg} ${hoverCls}`}
// //                       style={{ minHeight: cellMinH }}
// //                     >
// //                       <div className="flex justify-between w-full text-[9px] opacity-40 mb-0.5">
// //                         <span>{pos}</span>
// //                         <span className="font-mono">{posToMetric(pos)}</span>
// //                       </div>

// //                       {coin ? (
// //                         <div className="flex flex-col items-center w-full gap-0.5">

// //                           <div className="text-sm">🟡</div>

// //                           {/* Color dropdown */}
// //                           <select
// //                             className="bg-gray-800 text-white text-[9px] w-full rounded px-0.5 py-0.5 border-0 font-mono"
// //                             value={coin.colorCode}
// //                             onClick={e => e.stopPropagation()}
// //                             onChange={e => updateCoin(pos, "colorCode", Number(e.target.value))}
// //                           >
// //                             {coinColors.map(c => (
// //                               <option key={c.value} value={c.value} className="bg-gray-800">{c.label}</option>
// //                             ))}
// //                           </select>

// //                           {/* Value — Double: LEFT+RIGHT; others: single */}
// //                           {config.hasDouble ? (
// //                             <>
// //                               <div className="flex items-center gap-0.5 w-full">
// //                                 <span className="text-[7px] text-red-300 font-mono w-4 shrink-0">←L</span>
// //                                 <select className="bg-red-950 text-red-200 text-[9px] flex-1 rounded px-0 py-0.5 border-0 font-mono"
// //                                   value={coin.leftValue || ""}
// //                                   onClick={e => e.stopPropagation()}
// //                                   onChange={e => updateCoin(pos, "leftValue", e.target.value)}>
// //                                   <option value="">--</option>
// //                                   {COMBO_COIN_VALUES.map(v => <option key={v} value={v} className="bg-gray-800">{v}</option>)}
// //                                 </select>
// //                               </div>
// //                               <div className="flex items-center gap-0.5 w-full">
// //                                 <span className="text-[7px] text-red-300 font-mono w-4 shrink-0">R→</span>
// //                                 <select className="bg-red-950 text-red-200 text-[9px] flex-1 rounded px-0 py-0.5 border-0 font-mono"
// //                                   value={coin.rightValue || ""}
// //                                   onClick={e => e.stopPropagation()}
// //                                   onChange={e => updateCoin(pos, "rightValue", e.target.value)}>
// //                                   <option value="">--</option>
// //                                   {COMBO_COIN_VALUES.map(v => <option key={v} value={v} className="bg-gray-800">{v}</option>)}
// //                                 </select>
// //                               </div>
// //                             </>
// //                           ) : (
// //                             <select
// //                               className="bg-gray-800 text-white text-[9px] w-full rounded px-0.5 py-0.5 border-0 font-mono"
// //                               value={coin.value}
// //                               onClick={e => e.stopPropagation()}
// //                               onChange={e => updateCoin(pos, "value", e.target.value)}>
// //                               {COMBO_COIN_VALUES.map(v => (
// //                                 <option key={v} value={v} className="bg-gray-800">{v}</option>
// //                               ))}
// //                             </select>
// //                           )}

// //                           {/* Ultra boost — single dropdown when no double */}
// //                           {config.hasUltra && !config.hasDouble && (
// //                             <select
// //                               className="bg-purple-950 text-purple-200 text-[9px] w-full rounded px-0.5 py-0.5 border-0 font-mono"
// //                               value={coin.boostValue || ""}
// //                               onClick={e => e.stopPropagation()}
// //                               onChange={e => updateCoin(pos, "boostValue", e.target.value)}>
// //                               <option value="">Boost</option>
// //                               {ULTRA_BOOST_VALUES.map(v => <option key={v} value={v} className="bg-gray-800">{v}</option>)}
// //                             </select>
// //                           )}

// //                           {/* Ultra boost — LEFT/RIGHT side picker in Double+Ultra combo */}
// //                           {config.hasDouble && config.hasUltra && (
// //                             <div className="w-full mt-0.5" onClick={e => e.stopPropagation()}>
// //                               <div className="flex gap-0.5 w-full items-end">
// //                                 {(["LEFT", "RIGHT"] as const).map(side => {
// //                                   const isThis  = coin.boostSide === side;
// //                                   const locked  = !!(coin.boostSide && coin.boostSide !== side);
// //                                   return (
// //                                     <div key={side} className="flex flex-col items-center flex-1 gap-0">
// //                                       <span className={`text-[7px] font-mono ${isThis ? "text-yellow-300" : "text-gray-500"}`}>{side}</span>
// //                                       <select
// //                                         disabled={locked}
// //                                         className={`text-[8px] w-full rounded px-0 py-0.5 border-0 font-mono
// //                                           ${isThis ? "bg-yellow-700 text-yellow-100" : "bg-purple-950 text-purple-200"}
// //                                           ${locked ? "opacity-30 cursor-not-allowed" : ""}`}
// //                                         value={isThis ? (coin.boostValue || "") : ""}
// //                                         onChange={e => setBoostSide(pos, side, e.target.value)}>
// //                                         <option value="">--</option>
// //                                         {ULTRA_BOOST_VALUES.map(v => <option key={v} value={v} className="bg-gray-800">{v}</option>)}
// //                                       </select>
// //                                     </div>
// //                                   );
// //                                 })}
// //                                 {coin.boostSide && (
// //                                   <button
// //                                     className="text-red-400 hover:text-red-200 text-[8px] pb-0.5 ml-0.5"
// //                                     onClick={e => { e.stopPropagation(); updateCoin(pos, "boostValue", ""); updateCoin(pos, "boostSide", null); }}>✕</button>
// //                                 )}
// //                               </div>
// //                             </div>
// //                           )}

// //                           {/* Feature upgrade radio */}
// //                           <div className="flex items-center gap-1 mt-0.5 w-full" onClick={e => e.stopPropagation()}>
// //                             <input
// //                               type="radio" name="comboUpgrade"
// //                               className="accent-yellow-400 w-3 h-3 cursor-pointer"
// //                               checked={upgradePos === pos}
// //                               onChange={() => handleUpgradeRadio(pos)}
// //                             />
// //                             <span className="text-[8px] text-yellow-300 font-mono">upgrade</span>
// //                             {upgradePos === pos && !isAllColor && upgradeFeatSel && (
// //                               <span className="text-[8px] text-yellow-500 font-mono">→{upgradeFeatSel}</span>
// //                             )}
// //                             {upgradePos === pos && isAllColor && upgradeMultiSel.size > 0 && (
// //                               <span className="text-[8px] text-yellow-500 font-mono">→{Array.from(upgradeMultiSel).join("+")}</span>
// //                             )}
// //                           </div>

// //                           {/* Remove — non-base coins only */}
// //                           {!coin.fromBase && (
// //                             <button
// //                               onClick={e => { e.stopPropagation(); removeCoin(pos); }}
// //                               className="absolute top-1 right-1 text-[10px] text-red-300 hover:text-red-100 font-bold">✕</button>
// //                           )}

// //                         </div>
// //                       ) : (
// //                         <span className="text-white/40 text-[10px] mx-auto mt-4">+ Add</span>
// //                       )}
// //                     </div>
// //                   </div>
// //                 );
// //               })
// //             )}
// //           </div>

// //           {/* LEGEND */}
// //           <div className="text-[10px] text-gray-500 font-mono flex flex-wrap gap-2">
// //             <span>🟡 = coin · click empty cell to add · ✕ = remove</span>
// //             {config.hasDouble && <span>L← / R→ = LEFT / RIGHT coin values</span>}
// //             {config.hasUltra && !config.hasDouble && <span>Boost = ultra boost value</span>}
// //             {config.hasDouble && config.hasUltra && <span>L/R boost = side the boost applies to · ✕ to clear side</span>}
// //             {config.hasZone && <span>Background = zone regions (splitter {config.splitter})</span>}
// //             <span>✦ radio = upgrade · single-color = 1 feature · AllColor = multi-feature</span>
// //           </div>

// //         </div>
// //       )}
// //     </div>
// //   );
// // }



// /* eslint-disable @typescript-eslint/no-explicit-any */
// "use client";

// import { useState, useRef } from "react";
// import {
//   ComboCoin, ComboFeatureConfig,
//   getComboMaxSpins, getComboCoinColors,
//   generateCombinationGaffe, resolveUpgradeFeatures, UpgradeInfo,
// } from "./combinationFeatureGenerator";
// import { ZONE_BG_CLASS, ZONE_BORDER_CLASS, getZoneBgColor } from "./zoneFeatureGenerator";
// import { ULTRA_BOOST_VALUES } from "./ultraFeatureGenerator";
// import { posToMetric, ALL_UPGRADE_FEATURES } from "./config";

// // ── Constants ─────────────────────────────────────────────────────────────────
// // Fix #5: uppercase coin values
// const COMBO_COIN_VALUES = ["1", "2", "5", "MINOR", "MAJOR", "MINI"];

// const FEATURE_BADGE: Record<string, string> = {
//   double: "bg-red-900 text-red-300 border border-red-600",
//   extra:  "bg-emerald-900 text-emerald-300 border border-emerald-600",
//   zone:   "bg-sky-900 text-sky-300 border border-sky-600",
//   ultra:  "bg-purple-900 text-purple-300 border border-purple-600",
// };

// // ── Props ─────────────────────────────────────────────────────────────────────
// type Props = {
//   baseCoins:          ComboCoin[];
//   config:             ComboFeatureConfig;
//   pendingUpgradeInfo: UpgradeInfo | null;   // carried from single-feature upgrade
//   onSpin:             (snapshot: ComboCoin[], line: string) => void;
//   onReset:            () => void;
//   onUpgrade:          (newFeatures: string[], carryCoins: ComboCoin[], upgradeInfo: UpgradeInfo) => void;
// };

// // ── Component ─────────────────────────────────────────────────────────────────
// export default function CombinationFeature({ baseCoins, config, pendingUpgradeInfo, onSpin, onReset, onUpgrade }: Props) {
//   const MAX_SPINS  = getComboMaxSpins(config);
//   const coinColors = getComboCoinColors(config.features);
//   const defaultCode = coinColors[0].value;

//   const [isOpen,    setIsOpen]    = useState(true);
//   const initialSeeds = baseCoins.map(c => ({ ...c, fromBase: true }));
//   const [coins,     setCoins]     = useState<ComboCoin[]>(initialSeeds);
//   const [spinsLeft, setSpinsLeft] = useState(MAX_SPINS);
//   const lastSpinPositions = useRef<Set<number>>(new Set(initialSeeds.map(c => c.position)));

//   // Upgrade state
//   const [upgradePos,      setUpgradePos]      = useState<number | null>(null);
//   const [upgradeFeatSel,  setUpgradeFeatSel]  = useState<string>("");
//   const [upgradeMultiSel, setUpgradeMultiSel] = useState<Set<string>>(new Set());

//   const coinAt = (pos: number) => coins.find(c => c.position === pos);

//   // ── Coin operations ──────────────────────────────────────────────────────
//   const handleCellClick = (pos: number) => {
//     if (coinAt(pos)) return;
//     setCoins(prev => [...prev, {
//       position: pos, colorCode: defaultCode, value: COMBO_COIN_VALUES[0],
//       leftValue: "", rightValue: "", boostValue: "", boostSide: null,
//     }]);
//   };

//   const removeCoin = (pos: number) => {
//     const c = coinAt(pos);
//     if (!c || c.fromBase) return;
//     if (upgradePos === pos) {
//       setUpgradePos(null); setUpgradeFeatSel(""); setUpgradeMultiSel(new Set());
//     }
//     setCoins(prev => prev.filter(x => x.position !== pos));
//   };

//   const updateCoin = (pos: number, field: keyof ComboCoin, val: any) =>
//     setCoins(prev => prev.map(c => c.position === pos ? { ...c, [field]: val } : c));

//   const setBoostSide = (pos: number, side: "LEFT" | "RIGHT", boostVal: string) => {
//     setCoins(prev => prev.map(c => {
//       if (c.position !== pos) return c;
//       if (!boostVal) return { ...c, boostValue: "", boostSide: null };
//       return { ...c, boostValue: boostVal, boostSide: side };
//     }));
//   };

//   // ── Upgrade radio ────────────────────────────────────────────────────────
//   const handleUpgradeRadio = (pos: number) => {
//     if (upgradePos === pos) {
//       setUpgradePos(null); setUpgradeFeatSel(""); setUpgradeMultiSel(new Set()); return;
//     }
//     setUpgradePos(pos); setUpgradeFeatSel(""); setUpgradeMultiSel(new Set());
//   };

//   const upgradeCoinn = upgradePos !== null ? coinAt(upgradePos) : null;

//   // AllColor = the coin whose label starts with "AllColor" in this combo's palette
//   const allColorEntry = coinColors.find(c => c.label.startsWith("AllColor"));
//   const isAllColor = !!(upgradeCoinn && allColorEntry && upgradeCoinn.colorCode === allColorEntry.value);

//   // Gold coins (label starts with "Gold") have no upgrade
//   const goldCodes = new Set(coinColors.filter(c => c.label.startsWith("Gold")).map(c => c.value));

//   const upgradeOptions: string[] = (() => {
//     if (!upgradeCoinn) return [];
//     // Gold coins never upgrade
//     if (goldCodes.has(upgradeCoinn.colorCode)) return [];
//     const activeFeaturesUpper = config.features.map(f => f.toUpperCase());
//     if (isAllColor) {
//       return ALL_UPGRADE_FEATURES.filter(f => !activeFeaturesUpper.includes(f));
//     }
//     return resolveUpgradeFeatures(upgradeCoinn.colorCode).filter(f => !activeFeaturesUpper.includes(f));
//   })();

//   const toggleMulti = (f: string) => {
//     setUpgradeMultiSel(prev => {
//       const next = new Set(prev);
//       if (next.has(f)) next.delete(f); else next.add(f);
//       return next;
//     });
//   };

//   // The currently selected upgrade features (for combo-internal upgrade)
//   const selectedUpgradeFeats: string[] = isAllColor
//     ? Array.from(upgradeMultiSel)
//     : upgradeFeatSel ? [upgradeFeatSel] : [];

//   // Navigate immediately when upgrade feature selected in combo
//   const navigateComboUpgrade = (feats: string[]) => {
//     if (!upgradePos || feats.length === 0) return;
//     const upgradeInfo: UpgradeInfo = { col: Math.floor(upgradePos/3), row: upgradePos%3, features: feats };
//     const newFeatures = [...new Set([...config.features, ...feats.map(f => f.toLowerCase())])];
//     onUpgrade(newFeatures, coins, upgradeInfo);
//   };

//   // ── Spin ─────────────────────────────────────────────────────────────────
//   // Uses pendingUpgradeInfo (from single-feature upgrade) on first spin, then it's cleared by parent
//   const handleSpin = () => {
//     if (spinsLeft <= 0) return;
//     const cur = new Set(coins.map(c => c.position));
//     const hasNew = [...cur].some(p => !lastSpinPositions.current.has(p));
//     setSpinsLeft(hasNew ? MAX_SPINS : spinsLeft - 1);
//     lastSpinPositions.current = cur;

//     const line = generateCombinationGaffe(coins, config, pendingUpgradeInfo ?? null);
//     onSpin(coins, line);   // parent clears pendingUpgradeInfo after this
//   };

//   const resetFeature = () => {
//     const seeded = baseCoins.map(c => ({ ...c, fromBase: true }));
//     setCoins(seeded);
//     setSpinsLeft(MAX_SPINS);
//     lastSpinPositions.current = new Set(seeded.map(c => c.position));
//     setUpgradePos(null); setUpgradeFeatSel(""); setUpgradeMultiSel(new Set());
//     onReset();
//   };

//   const activeSplitter = config.hasZone ? (config.splitter ?? 1) : 0;
//   const filled14 = coins.length >= 14 && (config.hasExtra || config.hasUltra);
//   const cellMinH = config.hasDouble && config.hasUltra ? 150
//                  : config.hasDouble                    ? 120
//                  : config.hasUltra                     ? 110
//                  : 100;

//   return (
//     <div className="bg-gray-800 rounded-xl border border-indigo-800">

//       {/* HEADER */}
//       <div onClick={() => setIsOpen(!isOpen)} className="flex justify-between items-center p-4 cursor-pointer select-none">
//         <div className="flex items-center gap-2 flex-wrap">
//           <h2 className="text-lg font-semibold text-white font-mono">⚡ Combination Feature</h2>
//           {config.features.map(name => (
//             <span key={name} className={`text-xs px-2 py-0.5 rounded capitalize font-mono ${FEATURE_BADGE[name] ?? "bg-gray-700 text-gray-300"}`}>
//               {name}
//             </span>
//           ))}
//           {config.hasZone && config.splitter && (
//             <span className="text-xs px-2 py-0.5 rounded bg-sky-900 text-sky-300 border border-sky-700 font-mono">
//               Splitter {config.splitter}
//             </span>
//           )}
//           {pendingUpgradeInfo && (
//             <span className="text-xs px-2 py-0.5 rounded bg-yellow-900 text-yellow-300 border border-yellow-700 font-mono animate-pulse">
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
//             <button onClick={handleSpin} disabled={spinsLeft <= 0}
//               className={`px-6 py-2 rounded font-bold text-white font-mono transition-all ${spinsLeft > 0 ? "bg-indigo-600 hover:bg-indigo-500" : "bg-gray-600 cursor-not-allowed opacity-50"}`}>
//               SPIN
//             </button>
//             <span className="text-sm text-gray-400 font-mono">
//               {spinsLeft} spin{spinsLeft !== 1 ? "s" : ""}
//               {config.hasExtra && <span className="ml-1 text-emerald-400 text-xs">(4 — Extra)</span>}
//             </span>
//             <button onClick={resetFeature} className="px-3 py-1 bg-gray-600 hover:bg-gray-500 rounded text-sm">Reset</button>
//             {filled14 && <span className="text-yellow-400 text-xs font-mono bg-yellow-900/40 px-2 py-0.5 rounded border border-yellow-700">⚠ 14 filled → lastPositionReel</span>}
//           </div>

//           {/* Double+Ultra info */}
//           {config.hasDouble && config.hasUltra && (
//             <div className="text-xs text-purple-300 font-mono bg-purple-900/30 px-3 py-1.5 rounded border border-purple-800">
//               Double+Ultra: select boost on LEFT or RIGHT side per coin — choosing one locks the other. ✕ to clear.
//             </div>
//           )}

//           {/* UPGRADE COIN SELECTED — select feature → navigate immediately */}
//           {upgradePos !== null && upgradeOptions.length > 0 && (
//             <div className="flex flex-col gap-2 bg-yellow-900/20 border border-yellow-800 rounded-lg p-2">
//               <span className="text-yellow-300 text-xs font-mono font-bold">
//                 ✦ Upgrade at {posToMetric(upgradePos)} — select feature to add (navigates immediately):
//               </span>
//               {isAllColor ? (
//                 <div className="flex flex-col gap-2">
//                   <div className="flex gap-2 flex-wrap">
//                     {upgradeOptions.map(f => (
//                       <label key={f} className="flex items-center gap-1 cursor-pointer bg-yellow-900/40 border border-yellow-700 rounded px-2 py-1">
//                         <input type="checkbox" className="accent-yellow-400 w-3 h-3"
//                           checked={upgradeMultiSel.has(f)} onChange={() => toggleMulti(f)} />
//                         <span className="text-yellow-100 text-xs font-mono">{f}</span>
//                       </label>
//                     ))}
//                   </div>
//                   {upgradeMultiSel.size > 0 && (
//                     <button onClick={() => navigateComboUpgrade(Array.from(upgradeMultiSel))}
//                       className="self-start px-3 py-1 bg-yellow-600 hover:bg-yellow-500 rounded text-xs font-mono font-bold transition-all">
//                       → Go to {[...config.features, ...Array.from(upgradeMultiSel).map(f=>f.toLowerCase())].filter((v,i,a)=>a.indexOf(v)===i).join(" + ")}
//                     </button>
//                   )}
//                 </div>
//               ) : (
//                 <div className="flex gap-2 flex-wrap">
//                   {upgradeOptions.map(f => (
//                     <button key={f} onClick={() => navigateComboUpgrade([f])}
//                       className="px-3 py-1.5 bg-yellow-700 hover:bg-yellow-600 border border-yellow-600 rounded text-xs font-mono font-bold transition-all">
//                       → {f}
//                     </button>
//                   ))}
//                 </div>
//               )}
//             </div>
//           )}
//           {upgradePos !== null && upgradeOptions.length === 0 && (
//             <div className="text-xs text-gray-500 font-mono bg-gray-700 px-3 py-1.5 rounded">
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
//                       className={`relative rounded-lg border-2 flex flex-col items-start p-1 text-xs text-white cursor-pointer transition-all hover:brightness-110 ${cellBg} ${hoverCls}`}
//                       style={{ minHeight: cellMinH }}
//                     >
//                       <div className="flex justify-between w-full text-[9px] opacity-40 mb-0.5">
//                         <span>{pos}</span>
//                         <span className="font-mono">{posToMetric(pos)}</span>
//                       </div>

//                       {coin ? (
//                         <div className="flex flex-col items-center w-full gap-0.5">

//                           <div className="text-sm">🟡</div>

//                           {/* Color dropdown */}
//                           <select
//                             className="bg-gray-800 text-white text-[9px] w-full rounded px-0.5 py-0.5 border-0 font-mono"
//                             value={coin.colorCode}
//                             onClick={e => e.stopPropagation()}
//                             onChange={e => updateCoin(pos, "colorCode", Number(e.target.value))}
//                           >
//                             {coinColors.map(c => (
//                               <option key={c.value} value={c.value} className="bg-gray-800">{c.label}</option>
//                             ))}
//                           </select>

//                           {/* Value — Double: LEFT+RIGHT; others: single */}
//                           {config.hasDouble ? (
//                             <>
//                               <div className="flex items-center gap-0.5 w-full">
//                                 <span className="text-[7px] text-red-300 font-mono w-4 shrink-0">←L</span>
//                                 <select className="bg-red-950 text-red-200 text-[9px] flex-1 rounded px-0 py-0.5 border-0 font-mono"
//                                   value={coin.leftValue || ""}
//                                   onClick={e => e.stopPropagation()}
//                                   onChange={e => updateCoin(pos, "leftValue", e.target.value)}>
//                                   <option value="">--</option>
//                                   {COMBO_COIN_VALUES.map(v => <option key={v} value={v} className="bg-gray-800">{v}</option>)}
//                                 </select>
//                               </div>
//                               <div className="flex items-center gap-0.5 w-full">
//                                 <span className="text-[7px] text-red-300 font-mono w-4 shrink-0">R→</span>
//                                 <select className="bg-red-950 text-red-200 text-[9px] flex-1 rounded px-0 py-0.5 border-0 font-mono"
//                                   value={coin.rightValue || ""}
//                                   onClick={e => e.stopPropagation()}
//                                   onChange={e => updateCoin(pos, "rightValue", e.target.value)}>
//                                   <option value="">--</option>
//                                   {COMBO_COIN_VALUES.map(v => <option key={v} value={v} className="bg-gray-800">{v}</option>)}
//                                 </select>
//                               </div>
//                             </>
//                           ) : (
//                             <select
//                               className="bg-gray-800 text-white text-[9px] w-full rounded px-0.5 py-0.5 border-0 font-mono"
//                               value={coin.value}
//                               onClick={e => e.stopPropagation()}
//                               onChange={e => updateCoin(pos, "value", e.target.value)}>
//                               {COMBO_COIN_VALUES.map(v => (
//                                 <option key={v} value={v} className="bg-gray-800">{v}</option>
//                               ))}
//                             </select>
//                           )}

//                           {/* Ultra boost — single dropdown when no double */}
//                           {config.hasUltra && !config.hasDouble && (
//                             <select
//                               className="bg-purple-950 text-purple-200 text-[9px] w-full rounded px-0.5 py-0.5 border-0 font-mono"
//                               value={coin.boostValue || ""}
//                               onClick={e => e.stopPropagation()}
//                               onChange={e => updateCoin(pos, "boostValue", e.target.value)}>
//                               <option value="">Boost</option>
//                               {ULTRA_BOOST_VALUES.map(v => <option key={v} value={v} className="bg-gray-800">{v}</option>)}
//                             </select>
//                           )}

//                           {/* Ultra boost — LEFT/RIGHT side picker in Double+Ultra combo */}
//                           {config.hasDouble && config.hasUltra && (
//                             <div className="w-full mt-0.5" onClick={e => e.stopPropagation()}>
//                               <div className="flex gap-0.5 w-full items-end">
//                                 {(["LEFT", "RIGHT"] as const).map(side => {
//                                   const isThis  = coin.boostSide === side;
//                                   const locked  = !!(coin.boostSide && coin.boostSide !== side);
//                                   return (
//                                     <div key={side} className="flex flex-col items-center flex-1 gap-0">
//                                       <span className={`text-[7px] font-mono ${isThis ? "text-yellow-300" : "text-gray-500"}`}>{side}</span>
//                                       <select
//                                         disabled={locked}
//                                         className={`text-[8px] w-full rounded px-0 py-0.5 border-0 font-mono
//                                           ${isThis ? "bg-yellow-700 text-yellow-100" : "bg-purple-950 text-purple-200"}
//                                           ${locked ? "opacity-30 cursor-not-allowed" : ""}`}
//                                         value={isThis ? (coin.boostValue || "") : ""}
//                                         onChange={e => setBoostSide(pos, side, e.target.value)}>
//                                         <option value="">--</option>
//                                         {ULTRA_BOOST_VALUES.map(v => <option key={v} value={v} className="bg-gray-800">{v}</option>)}
//                                       </select>
//                                     </div>
//                                   );
//                                 })}
//                                 {coin.boostSide && (
//                                   <button
//                                     className="text-red-400 hover:text-red-200 text-[8px] pb-0.5 ml-0.5"
//                                     onClick={e => { e.stopPropagation(); updateCoin(pos, "boostValue", ""); updateCoin(pos, "boostSide", null); }}>✕</button>
//                                 )}
//                               </div>
//                             </div>
//                           )}

//                           {/* Feature upgrade radio */}
//                           <div className="flex items-center gap-1 mt-0.5 w-full" onClick={e => e.stopPropagation()}>
//                             <input
//                               type="radio" name="comboUpgrade"
//                               className="accent-yellow-400 w-3 h-3 cursor-pointer"
//                               checked={upgradePos === pos}
//                               onChange={() => handleUpgradeRadio(pos)}
//                             />
//                             <span className="text-[8px] text-yellow-300 font-mono">upgrade</span>
//                             {upgradePos === pos && !isAllColor && upgradeFeatSel && (
//                               <span className="text-[8px] text-yellow-500 font-mono">→{upgradeFeatSel}</span>
//                             )}
//                             {upgradePos === pos && isAllColor && upgradeMultiSel.size > 0 && (
//                               <span className="text-[8px] text-yellow-500 font-mono">→{Array.from(upgradeMultiSel).join("+")}</span>
//                             )}
//                           </div>

//                           {/* Remove — non-base coins only */}
//                           {!coin.fromBase && (
//                             <button
//                               onClick={e => { e.stopPropagation(); removeCoin(pos); }}
//                               className="absolute top-1 right-1 text-[10px] text-red-300 hover:text-red-100 font-bold">✕</button>
//                           )}

//                         </div>
//                       ) : (
//                         <span className="text-white/40 text-[10px] mx-auto mt-4">+ Add</span>
//                       )}
//                     </div>
//                   </div>
//                 );
//               })
//             )}
//           </div>

//           {/* LEGEND */}
//           <div className="text-[10px] text-gray-500 font-mono flex flex-wrap gap-2">
//             <span>🟡 = coin · click empty cell to add · ✕ = remove</span>
//             {config.hasDouble && <span>L← / R→ = LEFT / RIGHT coin values</span>}
//             {config.hasUltra && !config.hasDouble && <span>Boost = ultra boost value</span>}
//             {config.hasDouble && config.hasUltra && <span>L/R boost = side the boost applies to · ✕ to clear side</span>}
//             {config.hasZone && <span>Background = zone regions (splitter {config.splitter})</span>}
//             <span>✦ radio = upgrade · single-color = 1 feature · AllColor = multi-feature</span>
//           </div>

//         </div>
//       )}
//     </div>
//   );
// }


//! latest wokring code
/* eslint-disable @typescript-eslint/no-explicit-any */
// "use client";

// import { useState, useRef } from "react";
// import {
//   ComboCoin, ComboFeatureConfig,
//   getComboMaxSpins, getComboCoinColors,
//   generateCombinationGaffe, resolveUpgradeFeatures, UpgradeInfo,
// } from "./combinationFeatureGenerator";
// import { ZONE_BG_CLASS, ZONE_BORDER_CLASS, getZoneBgColor } from "./zoneFeatureGenerator";
// import { ULTRA_BOOST_VALUES } from "./ultraFeatureGenerator";
// import { posToMetric, ALL_UPGRADE_FEATURES } from "./config";

// // ── Constants ─────────────────────────────────────────────────────────────────
// // Fix #5: uppercase coin values
// const COMBO_COIN_VALUES = ["100", "250", "500", "MINOR", "MAJOR", "MINI"];

// const FEATURE_BADGE: Record<string, string> = {
//   double: "bg-red-900 text-red-300 border border-red-600",
//   extra:  "bg-emerald-900 text-emerald-300 border border-emerald-600",
//   zone:   "bg-sky-900 text-sky-300 border border-sky-600",
//   ultra:  "bg-purple-900 text-purple-300 border border-purple-600",
// };

// // ── Props ─────────────────────────────────────────────────────────────────────
// type Props = {
//   baseCoins:          ComboCoin[];
//   config:             ComboFeatureConfig;
//   pendingUpgradeInfo: UpgradeInfo | null;   // carried from single-feature upgrade
//   onSpin:             (snapshot: ComboCoin[], line: string) => void;
//   onReset:            () => void;
//   onUpgrade:          (newFeatures: string[], carryCoins: ComboCoin[], upgradeInfo: UpgradeInfo) => void;
// };

// // ── Component ─────────────────────────────────────────────────────────────────
// export default function CombinationFeature({ baseCoins, config, pendingUpgradeInfo, onSpin, onReset, onUpgrade }: Props) {
//   const MAX_SPINS  = getComboMaxSpins(config);
//   const coinColors = getComboCoinColors(config.features);
//   const defaultCode = coinColors[0].value;

//   const [isOpen,    setIsOpen]    = useState(true);
//   const initialSeeds = baseCoins.map(c => ({ ...c, fromBase: true }));
//   const [coins,     setCoins]     = useState<ComboCoin[]>(initialSeeds);
//   const [spinsLeft, setSpinsLeft] = useState(MAX_SPINS);
//   const lastSpinPositions = useRef<Set<number>>(new Set(initialSeeds.map(c => c.position)));

//   // Upgrade state
//   const [upgradePos,      setUpgradePos]      = useState<number | null>(null);
//   const [upgradeFeatSel,  setUpgradeFeatSel]  = useState<string>("");
//   const [upgradeMultiSel, setUpgradeMultiSel] = useState<Set<string>>(new Set());

//   const coinAt = (pos: number) => coins.find(c => c.position === pos);

//   // ── Coin operations ──────────────────────────────────────────────────────
//   const handleCellClick = (pos: number) => {
//     if (coinAt(pos)) return;
//     setCoins(prev => [...prev, {
//       position: pos, colorCode: defaultCode, value: COMBO_COIN_VALUES[0],
//       leftValue: "", rightValue: "", boostValue: "", boostSide: null,
//     }]);
//   };

//   const removeCoin = (pos: number) => {
//     const c = coinAt(pos);
//     if (!c || c.fromBase) return;
//     if (upgradePos === pos) {
//       setUpgradePos(null); setUpgradeFeatSel(""); setUpgradeMultiSel(new Set());
//     }
//     setCoins(prev => prev.filter(x => x.position !== pos));
//   };

//   const updateCoin = (pos: number, field: keyof ComboCoin, val: any) =>
//     setCoins(prev => prev.map(c => c.position === pos ? { ...c, [field]: val } : c));

//   const setBoostSide = (pos: number, side: "LEFT" | "RIGHT", boostVal: string) => {
//     setCoins(prev => prev.map(c => {
//       if (c.position !== pos) return c;
//       if (!boostVal) return { ...c, boostValue: "", boostSide: null };
//       return { ...c, boostValue: boostVal, boostSide: side };
//     }));
//   };

//   // ── Upgrade radio ────────────────────────────────────────────────────────
//   const handleUpgradeRadio = (pos: number) => {
//     if (upgradePos === pos) {
//       setUpgradePos(null); setUpgradeFeatSel(""); setUpgradeMultiSel(new Set()); return;
//     }
//     setUpgradePos(pos); setUpgradeFeatSel(""); setUpgradeMultiSel(new Set());
//   };

//   const upgradeCoinn = upgradePos !== null ? coinAt(upgradePos) : null;

//   // AllColor = the coin whose label starts with "AllColor" in this combo's palette
//   const allColorEntry = coinColors.find(c => c.label.startsWith("AllColor"));
//   const isAllColor = !!(upgradeCoinn && allColorEntry && upgradeCoinn.colorCode === allColorEntry.value);

//   // Gold coins (label starts with "Gold") have no upgrade
//   const goldCodes = new Set(coinColors.filter(c => c.label.startsWith("Gold")).map(c => c.value));

//   const upgradeOptions: string[] = (() => {
//     if (!upgradeCoinn) return [];
//     // Gold coins never upgrade
//     if (goldCodes.has(upgradeCoinn.colorCode)) return [];
//     const activeFeaturesUpper = config.features.map(f => f.toUpperCase());
//     if (isAllColor) {
//       return ALL_UPGRADE_FEATURES.filter(f => !activeFeaturesUpper.includes(f));
//     }
//     return resolveUpgradeFeatures(upgradeCoinn.colorCode).filter(f => !activeFeaturesUpper.includes(f));
//   })();

//   const toggleMulti = (f: string) => {
//     setUpgradeMultiSel(prev => {
//       const next = new Set(prev);
//       if (next.has(f)) next.delete(f); else next.add(f);
//       return next;
//     });
//   };

//   // The currently selected upgrade features (for combo-internal upgrade)
//   const selectedUpgradeFeats: string[] = isAllColor
//     ? Array.from(upgradeMultiSel)
//     : upgradeFeatSel ? [upgradeFeatSel] : [];

//   // Navigate immediately when upgrade feature selected in combo
//   const navigateComboUpgrade = (feats: string[]) => {
//     if (upgradePos === null || feats.length === 0) return;
//     const upgradeInfo: UpgradeInfo = { col: Math.floor(upgradePos/3), row: upgradePos%3, features: feats };
//     const newFeatures = [...new Set([...config.features, ...feats.map(f => f.toLowerCase())])];
//     onUpgrade(newFeatures, coins, upgradeInfo);
//   };

//   // ── Spin ─────────────────────────────────────────────────────────────────
//   // Uses pendingUpgradeInfo (from single-feature upgrade) on first spin, then it's cleared by parent
//   const handleSpin = () => {
//     if (spinsLeft <= 0) return;
//     const cur = new Set(coins.map(c => c.position));
//     const hasNew = [...cur].some(p => !lastSpinPositions.current.has(p));
//     setSpinsLeft(hasNew ? MAX_SPINS : spinsLeft - 1);
//     lastSpinPositions.current = cur;

//     const line = generateCombinationGaffe(coins, config, pendingUpgradeInfo ?? null);
//     onSpin(coins, line);   // parent clears pendingUpgradeInfo after this
//   };

//   const resetFeature = () => {
//     const seeded = baseCoins.map(c => ({ ...c, fromBase: true }));
//     setCoins(seeded);
//     setSpinsLeft(MAX_SPINS);
//     lastSpinPositions.current = new Set(seeded.map(c => c.position));
//     setUpgradePos(null); setUpgradeFeatSel(""); setUpgradeMultiSel(new Set());
//     onReset();
//   };

//   const activeSplitter = config.hasZone ? (config.splitter ?? 1) : 0;
//   const filled14 = coins.length >= 14 && (config.hasExtra || config.hasUltra);
//   const cellMinH = config.hasDouble && config.hasUltra ? 150
//                  : config.hasDouble                    ? 120
//                  : config.hasUltra                     ? 110
//                  : 100;

//   return (
//     <div className="bg-gray-800 rounded-xl border border-indigo-800">

//       {/* HEADER */}
//       <div onClick={() => setIsOpen(!isOpen)} className="flex justify-between items-center p-4 cursor-pointer select-none">
//         <div className="flex items-center gap-2 flex-wrap">
//           <h2 className="text-lg font-semibold text-white font-mono">⚡ Combination Feature</h2>
//           {config.features.map(name => (
//             <span key={name} className={`text-xs px-2 py-0.5 rounded capitalize font-mono ${FEATURE_BADGE[name] ?? "bg-gray-700 text-gray-300"}`}>
//               {name}
//             </span>
//           ))}
//           {config.hasZone && config.splitter && (
//             <span className="text-xs px-2 py-0.5 rounded bg-sky-900 text-sky-300 border border-sky-700 font-mono">
//               Splitter {config.splitter}
//             </span>
//           )}
//           {pendingUpgradeInfo && (
//             <span className="text-xs px-2 py-0.5 rounded bg-yellow-900 text-yellow-300 border border-yellow-700 font-mono animate-pulse">
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
//             <button onClick={handleSpin} disabled={spinsLeft <= 0}
//               className={`px-6 py-2 rounded font-bold text-white font-mono transition-all ${spinsLeft > 0 ? "bg-indigo-600 hover:bg-indigo-500" : "bg-gray-600 cursor-not-allowed opacity-50"}`}>
//               SPIN
//             </button>
//             <span className="text-sm text-gray-400 font-mono">
//               {spinsLeft} spin{spinsLeft !== 1 ? "s" : ""}
//               {config.hasExtra && <span className="ml-1 text-emerald-400 text-xs">(4 — Extra)</span>}
//             </span>
//             <button onClick={resetFeature} className="px-3 py-1 bg-gray-600 hover:bg-gray-500 rounded text-sm">Reset</button>
//             {filled14 && <span className="text-yellow-400 text-xs font-mono bg-yellow-900/40 px-2 py-0.5 rounded border border-yellow-700">⚠ 14 filled → lastPositionReel</span>}
//           </div>

//           {/* Double+Ultra info */}
//           {config.hasDouble && config.hasUltra && (
//             <div className="text-xs text-purple-300 font-mono bg-purple-900/30 px-3 py-1.5 rounded border border-purple-800">
//               Double+Ultra: select boost on LEFT or RIGHT side per coin — choosing one locks the other. ✕ to clear.
//             </div>
//           )}

//           {/* UPGRADE COIN SELECTED — select feature → navigate immediately */}
//           {upgradePos !== null && upgradeOptions.length > 0 && (
//             <div className="flex flex-col gap-2 bg-yellow-900/20 border border-yellow-800 rounded-lg p-2">
//               <span className="text-yellow-300 text-xs font-mono font-bold">
//                 ✦ Upgrade at {posToMetric(upgradePos)} — select feature to add (navigates immediately):
//               </span>
//               {isAllColor ? (
//                 <div className="flex flex-col gap-2">
//                   <div className="flex gap-2 flex-wrap">
//                     {upgradeOptions.map(f => (
//                       <label key={f} className="flex items-center gap-1 cursor-pointer bg-yellow-900/40 border border-yellow-700 rounded px-2 py-1">
//                         <input type="checkbox" className="accent-yellow-400 w-3 h-3"
//                           checked={upgradeMultiSel.has(f)} onChange={() => toggleMulti(f)} />
//                         <span className="text-yellow-100 text-xs font-mono">{f}</span>
//                       </label>
//                     ))}
//                   </div>
//                   {upgradeMultiSel.size > 0 && (
//                     <button onClick={() => navigateComboUpgrade(Array.from(upgradeMultiSel))}
//                       className="self-start px-3 py-1 bg-yellow-600 hover:bg-yellow-500 rounded text-xs font-mono font-bold transition-all">
//                       → Go to {[...config.features, ...Array.from(upgradeMultiSel).map(f=>f.toLowerCase())].filter((v,i,a)=>a.indexOf(v)===i).join(" + ")}
//                     </button>
//                   )}
//                 </div>
//               ) : (
//                 <div className="flex gap-2 flex-wrap">
//                   {upgradeOptions.map(f => (
//                     <button key={f} onClick={() => navigateComboUpgrade([f])}
//                       className="px-3 py-1.5 bg-yellow-700 hover:bg-yellow-600 border border-yellow-600 rounded text-xs font-mono font-bold transition-all">
//                       → {f}
//                     </button>
//                   ))}
//                 </div>
//               )}
//             </div>
//           )}
//           {upgradePos !== null && upgradeOptions.length === 0 && (
//             <div className="text-xs text-gray-500 font-mono bg-gray-700 px-3 py-1.5 rounded">
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
//                       className={`relative rounded-lg border-2 flex flex-col items-start p-1 text-xs text-white cursor-pointer transition-all hover:brightness-110 ${cellBg} ${hoverCls}`}
//                       style={{ minHeight: cellMinH }}
//                     >
//                       <div className="flex justify-between w-full text-[9px] opacity-40 mb-0.5">
//                         <span>{pos}</span>
//                         <span className="font-mono">{posToMetric(pos)}</span>
//                       </div>

//                       {coin ? (
//                         <div className="flex flex-col items-center w-full gap-0.5">

//                           <div className="text-sm">🟡</div>

//                           {/* Color dropdown */}
//                           <select
//                             className="bg-gray-800 text-white text-[9px] w-full rounded px-0.5 py-0.5 border-0 font-mono"
//                             value={coin.colorCode}
//                             onClick={e => e.stopPropagation()}
//                             onChange={e => updateCoin(pos, "colorCode", Number(e.target.value))}
//                           >
//                             {coinColors.map(c => (
//                               <option key={c.value} value={c.value} className="bg-gray-800">{c.label}</option>
//                             ))}
//                           </select>

//                           {/* Value — Double: LEFT+RIGHT; others: single */}
//                           {config.hasDouble ? (
//                             <>
//                               <div className="flex items-center gap-0.5 w-full">
//                                 <span className="text-[7px] text-red-300 font-mono w-4 shrink-0">←L</span>
//                                 <select className="bg-red-950 text-red-200 text-[9px] flex-1 rounded px-0 py-0.5 border-0 font-mono"
//                                   value={coin.leftValue || ""}
//                                   onClick={e => e.stopPropagation()}
//                                   onChange={e => updateCoin(pos, "leftValue", e.target.value)}>
//                                   <option value="">--</option>
//                                   {COMBO_COIN_VALUES.map(v => <option key={v} value={v} className="bg-gray-800">{v}</option>)}
//                                 </select>
//                               </div>
//                               <div className="flex items-center gap-0.5 w-full">
//                                 <span className="text-[7px] text-red-300 font-mono w-4 shrink-0">R→</span>
//                                 <select className="bg-red-950 text-red-200 text-[9px] flex-1 rounded px-0 py-0.5 border-0 font-mono"
//                                   value={coin.rightValue || ""}
//                                   onClick={e => e.stopPropagation()}
//                                   onChange={e => updateCoin(pos, "rightValue", e.target.value)}>
//                                   <option value="">--</option>
//                                   {COMBO_COIN_VALUES.map(v => <option key={v} value={v} className="bg-gray-800">{v}</option>)}
//                                 </select>
//                               </div>
//                             </>
//                           ) : (
//                             <select
//                               className="bg-gray-800 text-white text-[9px] w-full rounded px-0.5 py-0.5 border-0 font-mono"
//                               value={coin.value}
//                               onClick={e => e.stopPropagation()}
//                               onChange={e => updateCoin(pos, "value", e.target.value)}>
//                               {COMBO_COIN_VALUES.map(v => (
//                                 <option key={v} value={v} className="bg-gray-800">{v}</option>
//                               ))}
//                             </select>
//                           )}

//                           {/* Ultra boost — single dropdown when no double */}
//                           {config.hasUltra && !config.hasDouble && (
//                             <select
//                               className="bg-purple-950 text-purple-200 text-[9px] w-full rounded px-0.5 py-0.5 border-0 font-mono"
//                               value={coin.boostValue || ""}
//                               onClick={e => e.stopPropagation()}
//                               onChange={e => updateCoin(pos, "boostValue", e.target.value)}>
//                               <option value="">Boost</option>
//                               {ULTRA_BOOST_VALUES.map(v => <option key={v} value={v} className="bg-gray-800">{v}</option>)}
//                             </select>
//                           )}

//                           {/* Ultra boost — LEFT/RIGHT side picker in Double+Ultra combo */}
//                           {config.hasDouble && config.hasUltra && (
//                             <div className="w-full mt-0.5" onClick={e => e.stopPropagation()}>
//                               <div className="flex gap-0.5 w-full items-end">
//                                 {(["LEFT", "RIGHT"] as const).map(side => {
//                                   const isThis  = coin.boostSide === side;
//                                   const locked  = !!(coin.boostSide && coin.boostSide !== side);
//                                   return (
//                                     <div key={side} className="flex flex-col items-center flex-1 gap-0">
//                                       <span className={`text-[7px] font-mono ${isThis ? "text-yellow-300" : "text-gray-500"}`}>{side}</span>
//                                       <select
//                                         disabled={locked}
//                                         className={`text-[8px] w-full rounded px-0 py-0.5 border-0 font-mono
//                                           ${isThis ? "bg-yellow-700 text-yellow-100" : "bg-purple-950 text-purple-200"}
//                                           ${locked ? "opacity-30 cursor-not-allowed" : ""}`}
//                                         value={isThis ? (coin.boostValue || "") : ""}
//                                         onChange={e => setBoostSide(pos, side, e.target.value)}>
//                                         <option value="">--</option>
//                                         {ULTRA_BOOST_VALUES.map(v => <option key={v} value={v} className="bg-gray-800">{v}</option>)}
//                                       </select>
//                                     </div>
//                                   );
//                                 })}
//                                 {coin.boostSide && (
//                                   <button
//                                     className="text-red-400 hover:text-red-200 text-[8px] pb-0.5 ml-0.5"
//                                     onClick={e => { e.stopPropagation(); updateCoin(pos, "boostValue", ""); updateCoin(pos, "boostSide", null); }}>✕</button>
//                                 )}
//                               </div>
//                             </div>
//                           )}

//                           {/* Feature upgrade radio */}
//                           <div className="flex items-center gap-1 mt-0.5 w-full" onClick={e => e.stopPropagation()}>
//                             <input
//                               type="radio" name="comboUpgrade"
//                               className="accent-yellow-400 w-3 h-3 cursor-pointer"
//                               checked={upgradePos === pos}
//                               onChange={() => handleUpgradeRadio(pos)}
//                             />
//                             <span className="text-[8px] text-yellow-300 font-mono">upgrade</span>
//                             {upgradePos === pos && !isAllColor && upgradeFeatSel && (
//                               <span className="text-[8px] text-yellow-500 font-mono">→{upgradeFeatSel}</span>
//                             )}
//                             {upgradePos === pos && isAllColor && upgradeMultiSel.size > 0 && (
//                               <span className="text-[8px] text-yellow-500 font-mono">→{Array.from(upgradeMultiSel).join("+")}</span>
//                             )}
//                           </div>

//                           {/* Remove — non-base coins only */}
//                           {!coin.fromBase && (
//                             <button
//                               onClick={e => { e.stopPropagation(); removeCoin(pos); }}
//                               className="absolute top-1 right-1 text-[10px] text-red-300 hover:text-red-100 font-bold">✕</button>
//                           )}

//                         </div>
//                       ) : (
//                         <span className="text-white/40 text-[10px] mx-auto mt-4">+ Add</span>
//                       )}
//                     </div>
//                   </div>
//                 );
//               })
//             )}
//           </div>

//           {/* LEGEND */}
//           <div className="text-[10px] text-gray-500 font-mono flex flex-wrap gap-2">
//             <span>🟡 = coin · click empty cell to add · ✕ = remove</span>
//             {config.hasDouble && <span>L← / R→ = LEFT / RIGHT coin values</span>}
//             {config.hasUltra && !config.hasDouble && <span>Boost = ultra boost value</span>}
//             {config.hasDouble && config.hasUltra && <span>L/R boost = side the boost applies to · ✕ to clear side</span>}
//             {config.hasZone && <span>Background = zone regions (splitter {config.splitter})</span>}
//             <span>✦ radio = upgrade · single-color = 1 feature · AllColor = multi-feature</span>
//           </div>

//         </div>
//       )}
//     </div>
//   );
// }


//! working best-----------------------------
// /* eslint-disable @typescript-eslint/no-explicit-any */
// "use client";

// import { useState, useRef } from "react";
// import {
//   ComboCoin, ComboFeatureConfig,
//   getComboMaxSpins, getComboCoinColors,
//   generateCombinationGaffe, resolveUpgradeFeatures, UpgradeInfo,
// } from "./combinationFeatureGenerator";
// import { ZONE_BG_CLASS, ZONE_BORDER_CLASS, getZoneBgColor } from "./zoneFeatureGenerator";
// import { ULTRA_BOOST_VALUES } from "./ultraFeatureGenerator";
// import { posToMetric, ALL_UPGRADE_FEATURES, ZONE_SPLITTER_OPTIONS } from "./config";

// // ── Constants ─────────────────────────────────────────────────────────────────
// // Fix #5: uppercase coin values
// const COMBO_COIN_VALUES = ["100", "250", "500", "MINOR", "MAJOR", "MINI"];

// const FEATURE_BADGE: Record<string, string> = {
//   double: "bg-red-900 text-red-300 border border-red-600",
//   extra:  "bg-emerald-900 text-emerald-300 border border-emerald-600",
//   zone:   "bg-sky-900 text-sky-300 border border-sky-600",
//   ultra:  "bg-purple-900 text-purple-300 border border-purple-600",
// };

// // ── Props ─────────────────────────────────────────────────────────────────────
// type Props = {
//   baseCoins:          ComboCoin[];
//   config:             ComboFeatureConfig;
//   pendingUpgradeInfo: UpgradeInfo | null;   // carried from single-feature upgrade
//   onSpin:             (snapshot: ComboCoin[], line: string) => void;
//   onReset:            () => void;
//   onUpgrade:          (newFeatures: string[], carryCoins: ComboCoin[], upgradeInfo: UpgradeInfo) => void;
// };

// // ── Component ─────────────────────────────────────────────────────────────────
// export default function CombinationFeature({ baseCoins, config, pendingUpgradeInfo, onSpin, onReset, onUpgrade }: Props) {
//   const MAX_SPINS  = getComboMaxSpins(config);
//   const coinColors = getComboCoinColors(config.features);
//   const defaultCode = coinColors[0].value;

//   const [isOpen,    setIsOpen]    = useState(true);
//   const initialSeeds = baseCoins.map(c => ({ ...c, fromBase: true }));
//   const [coins,     setCoins]     = useState<ComboCoin[]>(initialSeeds);
//   const [spinsLeft, setSpinsLeft] = useState(MAX_SPINS);
//   const lastSpinPositions = useRef<Set<number>>(new Set(initialSeeds.map(c => c.position)));

//   // Upgrade state
//   const [upgradePos,          setUpgradePos]          = useState<number | null>(null);
//   const [upgradeFeatSel,      setUpgradeFeatSel]      = useState<string>("");
//   const [upgradeMultiSel,     setUpgradeMultiSel]     = useState<Set<string>>(new Set());
//   const [upgradeZoneSplitter, setUpgradeZoneSplitter] = useState<string>("");
//   const [upgradeZoneMultiRaw, setUpgradeZoneMultiRaw] = useState<string>("");

//   const coinAt = (pos: number) => coins.find(c => c.position === pos);

//   // ── Coin operations ──────────────────────────────────────────────────────
//   const handleCellClick = (pos: number) => {
//     if (coinAt(pos)) return;
//     setCoins(prev => [...prev, {
//       position: pos, colorCode: defaultCode, value: COMBO_COIN_VALUES[0],
//       leftValue: "", rightValue: "", boostValue: "", boostSide: null,
//     }]);
//   };

//   const removeCoin = (pos: number) => {
//     const c = coinAt(pos);
//     if (!c || c.fromBase) return;
//     if (upgradePos === pos) {
//       setUpgradePos(null); setUpgradeFeatSel(""); setUpgradeMultiSel(new Set());
//     }
//     setCoins(prev => prev.filter(x => x.position !== pos));
//   };

//   const updateCoin = (pos: number, field: keyof ComboCoin, val: any) =>
//     setCoins(prev => prev.map(c => c.position === pos ? { ...c, [field]: val } : c));

//   const setBoostSide = (pos: number, side: "LEFT" | "RIGHT", boostVal: string) => {
//     setCoins(prev => prev.map(c => {
//       if (c.position !== pos) return c;
//       if (!boostVal) return { ...c, boostValue: "", boostSide: null };
//       return { ...c, boostValue: boostVal, boostSide: side };
//     }));
//   };

//   // ── Upgrade radio ────────────────────────────────────────────────────────
//   const handleUpgradeRadio = (pos: number) => {
//     if (upgradePos === pos) {
//       setUpgradePos(null); setUpgradeFeatSel(""); setUpgradeMultiSel(new Set()); setUpgradeZoneSplitter(""); setUpgradeZoneMultiRaw(""); return;
//     }
//     setUpgradePos(pos); setUpgradeFeatSel(""); setUpgradeMultiSel(new Set()); setUpgradeZoneSplitter(""); setUpgradeZoneMultiRaw("");
//   };

//   const upgradeCoinn = upgradePos !== null ? coinAt(upgradePos) : null;

//   // AllColor = the coin whose label starts with "AllColor" in this combo's palette
//   const allColorEntry = coinColors.find(c => c.label.startsWith("AllColor"));
//   const isAllColor = !!(upgradeCoinn && allColorEntry && upgradeCoinn.colorCode === allColorEntry.value);

//   // Gold coins (label starts with "Gold") have no upgrade
//   const goldCodes = new Set(coinColors.filter(c => c.label.startsWith("Gold")).map(c => c.value));

//   // Build a colorCode→feature map using color-name semantics from palette labels:
//   // Red→DOUBLE, Blue→ZONE, Green→EXTRA, Purple→ULTRA
//   const COLOR_LABEL_TO_FEATURE: Record<string, string> = {
//     Red: "DOUBLE", Blue: "ZONE", Green: "EXTRA", Purple: "ULTRA",
//   };
//   const activeFeaturesUpper = config.features.map(f => f.toUpperCase());
//   const inactiveFeatures    = ALL_UPGRADE_FEATURES.filter(f => !activeFeaturesUpper.includes(f));
//   const paletteUpgradeMap: Record<number, string> = {};
//   coinColors.forEach(c => {
//     const colorName = c.label.split("(")[0]; // e.g. "Purple" from "Purple(4)"
//     const feat = COLOR_LABEL_TO_FEATURE[colorName];
//     if (feat) paletteUpgradeMap[c.value] = feat;
//   });

//   const upgradeOptions: string[] = (() => {
//     if (!upgradeCoinn) return [];
//     if (goldCodes.has(upgradeCoinn.colorCode)) return [];
//     if (isAllColor) return inactiveFeatures;
//     const feat = paletteUpgradeMap[upgradeCoinn.colorCode];
//     // Only offer if that feature is actually inactive in this combo
//     return feat && !activeFeaturesUpper.includes(feat) ? [feat] : [];
//   })();

//   const toggleMulti = (f: string) => {
//     setUpgradeMultiSel(prev => {
//       const next = new Set(prev);
//       if (next.has(f)) next.delete(f); else next.add(f);
//       return next;
//     });
//   };

//   // The currently selected upgrade features (for combo-internal upgrade)
//   const selectedUpgradeFeats: string[] = isAllColor
//     ? Array.from(upgradeMultiSel)
//     : upgradeFeatSel ? [upgradeFeatSel] : [];

//   // Navigate immediately when upgrade feature selected in combo
//   const navigateComboUpgrade = (feats: string[]) => {
//     if (upgradePos === null || feats.length === 0) return;
//     const hasZone = feats.map(f => f.toUpperCase()).includes("ZONE");
//     const upgradeInfo: UpgradeInfo = {
//       col: Math.floor(upgradePos/3), row: upgradePos%3, features: feats,
//       ...(hasZone && upgradeZoneSplitter ? { zoneSplitter: Number(upgradeZoneSplitter) } : {}),
//       ...(hasZone && upgradeZoneMultiRaw ? { zoneMultipliers: upgradeZoneMultiRaw.split(",").map(n=>n.trim()).filter(Boolean).map(Number) } : {}),
//     };
//     const newFeatures = [...new Set([...config.features, ...feats.map(f => f.toLowerCase())])];
//     onUpgrade(newFeatures, coins, upgradeInfo);
//   };

//   // ── Spin ─────────────────────────────────────────────────────────────────
//   // Uses pendingUpgradeInfo (from single-feature upgrade) on first spin, then it's cleared by parent
//   const handleSpin = () => {
//     if (spinsLeft <= 0) return;
//     const cur = new Set(coins.map(c => c.position));
//     const hasNew = [...cur].some(p => !lastSpinPositions.current.has(p));
//     // If this is an upgrade spin (pendingUpgradeInfo set), always reset to MAX
//     const nextSpins = pendingUpgradeInfo ? MAX_SPINS : (hasNew ? MAX_SPINS : spinsLeft - 1);
//     setSpinsLeft(nextSpins);
//     lastSpinPositions.current = cur;

//     const line = generateCombinationGaffe(coins, config, pendingUpgradeInfo ?? null);
//     onSpin(coins, line);   // parent clears pendingUpgradeInfo after this
//   };

//   const resetFeature = () => {
//     const seeded = baseCoins.map(c => ({ ...c, fromBase: true }));
//     setCoins(seeded);
//     setSpinsLeft(MAX_SPINS);
//     lastSpinPositions.current = new Set(seeded.map(c => c.position));
//     setUpgradePos(null); setUpgradeFeatSel(""); setUpgradeMultiSel(new Set()); setUpgradeZoneSplitter(""); setUpgradeZoneMultiRaw("");
//     onReset();
//   };

//   const activeSplitter = config.hasZone ? (config.splitter ?? 1) : 0;
//   const filled14 = coins.length >= 14 && (config.hasExtra || config.hasUltra);
//   const cellMinH = config.hasDouble && config.hasUltra ? 150
//                  : config.hasDouble                    ? 120
//                  : config.hasUltra                     ? 110
//                  : 100;

//   return (
//     <div className="bg-gray-800 rounded-xl border border-indigo-800">

//       {/* HEADER */}
//       <div onClick={() => setIsOpen(!isOpen)} className="flex justify-between items-center p-4 cursor-pointer select-none">
//         <div className="flex items-center gap-2 flex-wrap">
//           <h2 className="text-lg font-semibold text-white font-mono">⚡ Combination Feature</h2>
//           {config.features.map(name => (
//             <span key={name} className={`text-xs px-2 py-0.5 rounded capitalize font-mono ${FEATURE_BADGE[name] ?? "bg-gray-700 text-gray-300"}`}>
//               {name}
//             </span>
//           ))}
//           {config.hasZone && config.splitter && (
//             <span className="text-xs px-2 py-0.5 rounded bg-sky-900 text-sky-300 border border-sky-700 font-mono">
//               Splitter {config.splitter}
//             </span>
//           )}
//           {pendingUpgradeInfo && (
//             <span className="text-xs px-2 py-0.5 rounded bg-yellow-900 text-yellow-300 border border-yellow-700 font-mono animate-pulse">
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
//             <button onClick={handleSpin} disabled={spinsLeft <= 0}
//               className={`px-6 py-2 rounded font-bold text-white font-mono transition-all ${spinsLeft > 0 ? "bg-indigo-600 hover:bg-indigo-500" : "bg-gray-600 cursor-not-allowed opacity-50"}`}>
//               SPIN
//             </button>
//             <span className="text-sm text-gray-400 font-mono">
//               {spinsLeft} spin{spinsLeft !== 1 ? "s" : ""}
//               {config.hasExtra && <span className="ml-1 text-emerald-400 text-xs">(4 — Extra)</span>}
//             </span>
//             <button onClick={resetFeature} className="px-3 py-1 bg-gray-600 hover:bg-gray-500 rounded text-sm">Reset</button>
//             {filled14 && <span className="text-yellow-400 text-xs font-mono bg-yellow-900/40 px-2 py-0.5 rounded border border-yellow-700">⚠ 14 filled → lastPositionReel</span>}
//           </div>

//           {/* Double+Ultra info */}
//           {config.hasDouble && config.hasUltra && (
//             <div className="text-xs text-purple-300 font-mono bg-purple-900/30 px-3 py-1.5 rounded border border-purple-800">
//               Double+Ultra: select boost on LEFT or RIGHT side per coin — choosing one locks the other. ✕ to clear.
//             </div>
//           )}

//           {/* UPGRADE COIN SELECTED — select feature → navigate immediately */}
//           {upgradePos !== null && upgradeOptions.length > 0 && (
//             <div className="flex flex-col gap-2 bg-yellow-900/20 border border-yellow-800 rounded-lg p-3">
//               <span className="text-yellow-300 text-xs font-mono font-bold">
//                 ✦ Upgrade at {posToMetric(upgradePos)} — select feature to add:
//               </span>
//               {isAllColor ? (
//                 <div className="flex flex-col gap-2">
//                   <div className="flex gap-2 flex-wrap">
//                     {upgradeOptions.map(f => (
//                       <label key={f} className="flex items-center gap-1 cursor-pointer bg-yellow-900/40 border border-yellow-700 rounded px-2 py-1">
//                         <input type="checkbox" className="accent-yellow-400 w-3 h-3"
//                           checked={upgradeMultiSel.has(f)} onChange={() => toggleMulti(f)} />
//                         <span className="text-yellow-100 text-xs font-mono">{f}</span>
//                       </label>
//                     ))}
//                   </div>
//                   {upgradeMultiSel.has("ZONE") && (
//                     <div className="flex gap-3 flex-wrap items-center bg-sky-900/30 border border-sky-800 rounded p-2">
//                       <span className="text-sky-300 text-[10px] font-mono">Zone params:</span>
//                       <div className="flex items-center gap-1">
//                         <span className="text-[10px] text-sky-300 font-mono">Splitter</span>
//                         <select className="bg-sky-950 text-sky-200 text-xs rounded px-1 py-0.5 font-mono border border-sky-700"
//                           value={upgradeZoneSplitter} onChange={e => setUpgradeZoneSplitter(e.target.value)}>
//                           <option value="">--</option>
//                           {ZONE_SPLITTER_OPTIONS.map(v => <option key={v} value={v}>{v}</option>)}
//                         </select>
//                       </div>
//                       <div className="flex items-center gap-1">
//                         <span className="text-[10px] text-sky-300 font-mono">Multipliers</span>
//                         <input type="text" placeholder="e.g. 2,3" value={upgradeZoneMultiRaw} onChange={e => setUpgradeZoneMultiRaw(e.target.value)}
//                           className="bg-sky-950 text-sky-200 text-xs rounded px-1 py-0.5 font-mono border border-sky-700 w-20" />
//                       </div>
//                     </div>
//                   )}
//                   {upgradeMultiSel.size > 0 && (
//                     <button onClick={() => navigateComboUpgrade(Array.from(upgradeMultiSel))}
//                       className="self-start px-3 py-1 bg-yellow-600 hover:bg-yellow-500 rounded text-xs font-mono font-bold transition-all">
//                       → Go to {[...config.features, ...Array.from(upgradeMultiSel).map(f=>f.toLowerCase())].filter((v,i,a)=>a.indexOf(v)===i).join(" + ")}
//                     </button>
//                   )}
//                 </div>
//               ) : (
//                 <div className="flex flex-col gap-2">
//                   <div className="flex gap-2 flex-wrap">
//                     {upgradeOptions.filter(f => f !== "ZONE").map(f => (
//                       <button key={f} onClick={() => navigateComboUpgrade([f])}
//                         className="px-3 py-1.5 bg-yellow-700 hover:bg-yellow-600 border border-yellow-600 rounded text-xs font-mono font-bold transition-all">
//                         → {f}
//                       </button>
//                     ))}
//                   </div>
//                   {upgradeOptions.includes("ZONE") && (
//                     <div className="flex flex-col gap-1.5">
//                       <div className="flex gap-3 flex-wrap items-center bg-sky-900/30 border border-sky-800 rounded p-2">
//                         <span className="text-sky-300 text-[10px] font-mono">Zone params:</span>
//                         <div className="flex items-center gap-1">
//                           <span className="text-[10px] text-sky-300 font-mono">Splitter</span>
//                           <select className="bg-sky-950 text-sky-200 text-xs rounded px-1 py-0.5 font-mono border border-sky-700"
//                             value={upgradeZoneSplitter} onChange={e => setUpgradeZoneSplitter(e.target.value)}>
//                             <option value="">--</option>
//                             {ZONE_SPLITTER_OPTIONS.map(v => <option key={v} value={v}>{v}</option>)}
//                           </select>
//                         </div>
//                         <div className="flex items-center gap-1">
//                           <span className="text-[10px] text-sky-300 font-mono">Multipliers</span>
//                           <input type="text" placeholder="e.g. 2,3" value={upgradeZoneMultiRaw} onChange={e => setUpgradeZoneMultiRaw(e.target.value)}
//                             className="bg-sky-950 text-sky-200 text-xs rounded px-1 py-0.5 font-mono border border-sky-700 w-20" />
//                         </div>
//                       </div>
//                       <button onClick={() => navigateComboUpgrade(["ZONE"])}
//                         className="self-start px-3 py-1 bg-sky-700 hover:bg-sky-600 border border-sky-500 rounded text-xs font-mono font-bold transition-all">
//                         → Go to {[...config.features, "zone"].join(" + ")}
//                       </button>
//                     </div>
//                   )}
//                 </div>
//               )}
//             </div>
//           )}
//           {upgradePos !== null && upgradeOptions.length === 0 && (
//             <div className="text-xs text-gray-500 font-mono bg-gray-700 px-3 py-1.5 rounded">
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
//                       className={`relative rounded-lg border-2 flex flex-col items-start p-1 text-xs text-white cursor-pointer transition-all hover:brightness-110 ${cellBg} ${hoverCls}`}
//                       style={{ minHeight: cellMinH }}
//                     >
//                       <div className="flex justify-between w-full text-[9px] opacity-40 mb-0.5">
//                         <span>{pos}</span>
//                         <span className="font-mono">{posToMetric(pos)}</span>
//                       </div>

//                       {coin ? (
//                         <div className="flex flex-col items-center w-full gap-0.5">

//                           <div className="text-sm">🟡</div>

//                           {/* Color dropdown */}
//                           <select
//                             className="bg-gray-800 text-white text-[9px] w-full rounded px-0.5 py-0.5 border-0 font-mono"
//                             value={coin.colorCode}
//                             onClick={e => e.stopPropagation()}
//                             onChange={e => updateCoin(pos, "colorCode", Number(e.target.value))}
//                           >
//                             {coinColors.map(c => (
//                               <option key={c.value} value={c.value} className="bg-gray-800">{c.label}</option>
//                             ))}
//                           </select>

//                           {/* Value — Double: LEFT+RIGHT; others: single */}
//                           {config.hasDouble ? (
//                             <>
//                               <div className="flex items-center gap-0.5 w-full">
//                                 <span className="text-[7px] text-red-300 font-mono w-4 shrink-0">←L</span>
//                                 <select className="bg-red-950 text-red-200 text-[9px] flex-1 rounded px-0 py-0.5 border-0 font-mono"
//                                   value={coin.leftValue || ""}
//                                   onClick={e => e.stopPropagation()}
//                                   onChange={e => updateCoin(pos, "leftValue", e.target.value)}>
//                                   <option value="">--</option>
//                                   {COMBO_COIN_VALUES.map(v => <option key={v} value={v} className="bg-gray-800">{v}</option>)}
//                                 </select>
//                               </div>
//                               <div className="flex items-center gap-0.5 w-full">
//                                 <span className="text-[7px] text-red-300 font-mono w-4 shrink-0">R→</span>
//                                 <select className="bg-red-950 text-red-200 text-[9px] flex-1 rounded px-0 py-0.5 border-0 font-mono"
//                                   value={coin.rightValue || ""}
//                                   onClick={e => e.stopPropagation()}
//                                   onChange={e => updateCoin(pos, "rightValue", e.target.value)}>
//                                   <option value="">--</option>
//                                   {COMBO_COIN_VALUES.map(v => <option key={v} value={v} className="bg-gray-800">{v}</option>)}
//                                 </select>
//                               </div>
//                             </>
//                           ) : (
//                             <select
//                               className="bg-gray-800 text-white text-[9px] w-full rounded px-0.5 py-0.5 border-0 font-mono"
//                               value={coin.value}
//                               onClick={e => e.stopPropagation()}
//                               onChange={e => updateCoin(pos, "value", e.target.value)}>
//                               {COMBO_COIN_VALUES.map(v => (
//                                 <option key={v} value={v} className="bg-gray-800">{v}</option>
//                               ))}
//                             </select>
//                           )}

//                           {/* Ultra boost — single dropdown when no double */}
//                           {config.hasUltra && !config.hasDouble && (
//                             <select
//                               className="bg-purple-950 text-purple-200 text-[9px] w-full rounded px-0.5 py-0.5 border-0 font-mono"
//                               value={coin.boostValue || ""}
//                               onClick={e => e.stopPropagation()}
//                               onChange={e => updateCoin(pos, "boostValue", e.target.value)}>
//                               <option value="">Boost</option>
//                               {ULTRA_BOOST_VALUES.map(v => <option key={v} value={v} className="bg-gray-800">{v}</option>)}
//                             </select>
//                           )}

//                           {/* Ultra boost — LEFT/RIGHT side picker in Double+Ultra combo */}
//                           {config.hasDouble && config.hasUltra && (
//                             <div className="w-full mt-0.5" onClick={e => e.stopPropagation()}>
//                               <div className="flex gap-0.5 w-full items-end">
//                                 {(["LEFT", "RIGHT"] as const).map(side => {
//                                   const isThis  = coin.boostSide === side;
//                                   const locked  = !!(coin.boostSide && coin.boostSide !== side);
//                                   return (
//                                     <div key={side} className="flex flex-col items-center flex-1 gap-0">
//                                       <span className={`text-[7px] font-mono ${isThis ? "text-yellow-300" : "text-gray-500"}`}>{side}</span>
//                                       <select
//                                         disabled={locked}
//                                         className={`text-[8px] w-full rounded px-0 py-0.5 border-0 font-mono
//                                           ${isThis ? "bg-yellow-700 text-yellow-100" : "bg-purple-950 text-purple-200"}
//                                           ${locked ? "opacity-30 cursor-not-allowed" : ""}`}
//                                         value={isThis ? (coin.boostValue || "") : ""}
//                                         onChange={e => setBoostSide(pos, side, e.target.value)}>
//                                         <option value="">--</option>
//                                         {ULTRA_BOOST_VALUES.map(v => <option key={v} value={v} className="bg-gray-800">{v}</option>)}
//                                       </select>
//                                     </div>
//                                   );
//                                 })}
//                                 {coin.boostSide && (
//                                   <button
//                                     className="text-red-400 hover:text-red-200 text-[8px] pb-0.5 ml-0.5"
//                                     onClick={e => { e.stopPropagation(); updateCoin(pos, "boostValue", ""); updateCoin(pos, "boostSide", null); }}>✕</button>
//                                 )}
//                               </div>
//                             </div>
//                           )}

//                           {/* Feature upgrade radio */}
//                           <div className="flex items-center gap-1 mt-0.5 w-full" onClick={e => e.stopPropagation()}>
//                             <input
//                               type="radio" name="comboUpgrade"
//                               className="accent-yellow-400 w-3 h-3 cursor-pointer"
//                               checked={upgradePos === pos}
//                               onChange={() => handleUpgradeRadio(pos)}
//                             />
//                             <span className="text-[8px] text-yellow-300 font-mono">upgrade</span>
//                             {upgradePos === pos && !isAllColor && upgradeFeatSel && (
//                               <span className="text-[8px] text-yellow-500 font-mono">→{upgradeFeatSel}</span>
//                             )}
//                             {upgradePos === pos && isAllColor && upgradeMultiSel.size > 0 && (
//                               <span className="text-[8px] text-yellow-500 font-mono">→{Array.from(upgradeMultiSel).join("+")}</span>
//                             )}
//                           </div>

//                           {/* Remove — non-base coins only */}
//                           {!coin.fromBase && (
//                             <button
//                               onClick={e => { e.stopPropagation(); removeCoin(pos); }}
//                               className="absolute top-1 right-1 text-[10px] text-red-300 hover:text-red-100 font-bold">✕</button>
//                           )}

//                         </div>
//                       ) : (
//                         <span className="text-white/40 text-[10px] mx-auto mt-4">+ Add</span>
//                       )}
//                     </div>
//                   </div>
//                 );
//               })
//             )}
//           </div>

//           {/* LEGEND */}
//           <div className="text-[10px] text-gray-500 font-mono flex flex-wrap gap-2">
//             <span>🟡 = coin · click empty cell to add · ✕ = remove</span>
//             {config.hasDouble && <span>L← / R→ = LEFT / RIGHT coin values</span>}
//             {config.hasUltra && !config.hasDouble && <span>Boost = ultra boost value</span>}
//             {config.hasDouble && config.hasUltra && <span>L/R boost = side the boost applies to · ✕ to clear side</span>}
//             {config.hasZone && <span>Background = zone regions (splitter {config.splitter})</span>}
//             <span>✦ radio = upgrade · single-color = 1 feature · AllColor = multi-feature</span>
//           </div>

//         </div>
//       )}
//     </div>
//   );
// }




// // // //?new latest 
// // /* eslint-disable @typescript-eslint/no-explicit-any */
// // "use client";

// // import { useState, useRef } from "react";
// // import {
// //   ComboCoin, ComboFeatureConfig,
// //   getComboMaxSpins, getComboCoinColors,
// //   generateCombinationGaffe, resolveUpgradeFeatures, UpgradeInfo,
// // } from "./combinationFeatureGenerator";
// // import { ZONE_BG_CLASS, ZONE_BORDER_CLASS, getZoneBgColor } from "./zoneFeatureGenerator";
// // import { ULTRA_BOOST_VALUES } from "./ultraFeatureGenerator";
// // import { posToMetric, ALL_UPGRADE_FEATURES } from "./config";

// // // ── Constants ─────────────────────────────────────────────────────────────────
// // // Fix #5: uppercase coin values
// // const COMBO_COIN_VALUES = ["100", "250", "500", "MINOR", "MAJOR", "MINI"];

// // const FEATURE_BADGE: Record<string, string> = {
// //   double: "bg-red-900 text-red-300 border border-red-600",
// //   extra:  "bg-emerald-900 text-emerald-300 border border-emerald-600",
// //   zone:   "bg-sky-900 text-sky-300 border border-sky-600",
// //   ultra:  "bg-purple-900 text-purple-300 border border-purple-600",
// // };

// // // ── Props ─────────────────────────────────────────────────────────────────────
// // type Props = {
// //   baseCoins: ComboCoin[];
// //   config:    ComboFeatureConfig;
// //   onSpin:    (snapshot: ComboCoin[], line: string) => void;
// //   onReset:   () => void;
// //   onUpgrade: (newFeatures: string[], carryCoins: ComboCoin[]) => void;
// // };

// // // ── Component ─────────────────────────────────────────────────────────────────
// // export default function CombinationFeature({ baseCoins, config, onSpin, onReset, onUpgrade }: Props) {
// //   const MAX_SPINS  = getComboMaxSpins(config);
// //   const coinColors = getComboCoinColors(config.features);
// //   const defaultCode = coinColors[0].value;

// //   const [isOpen,    setIsOpen]    = useState(true);
// //   const initialSeeds = baseCoins.map(c => ({ ...c, fromBase: true }));
// //   const [coins,     setCoins]     = useState<ComboCoin[]>(initialSeeds);
// //   const [spinsLeft, setSpinsLeft] = useState(MAX_SPINS);
// //   const lastSpinPositions = useRef<Set<number>>(new Set(initialSeeds.map(c => c.position)));

// //   // Upgrade state
// //   const [upgradePos,      setUpgradePos]      = useState<number | null>(null);
// //   const [upgradeFeatSel,  setUpgradeFeatSel]  = useState<string>("");
// //   const [upgradeMultiSel, setUpgradeMultiSel] = useState<Set<string>>(new Set());

// //   const coinAt = (pos: number) => coins.find(c => c.position === pos);

// //   // ── Coin operations ──────────────────────────────────────────────────────
// //   const handleCellClick = (pos: number) => {
// //     if (coinAt(pos)) return;
// //     setCoins(prev => [...prev, {
// //       position: pos, colorCode: defaultCode, value: COMBO_COIN_VALUES[0],
// //       leftValue: "", rightValue: "", boostValue: "", boostSide: null,
// //     }]);
// //   };

// //   const removeCoin = (pos: number) => {
// //     const c = coinAt(pos);
// //     if (!c || c.fromBase) return;
// //     if (upgradePos === pos) {
// //       setUpgradePos(null); setUpgradeFeatSel(""); setUpgradeMultiSel(new Set());
// //     }
// //     setCoins(prev => prev.filter(x => x.position !== pos));
// //   };

// //   const updateCoin = (pos: number, field: keyof ComboCoin, val: any) =>
// //     setCoins(prev => prev.map(c => c.position === pos ? { ...c, [field]: val } : c));

// //   const setBoostSide = (pos: number, side: "LEFT" | "RIGHT", boostVal: string) => {
// //     setCoins(prev => prev.map(c => {
// //       if (c.position !== pos) return c;
// //       if (!boostVal) return { ...c, boostValue: "", boostSide: null };
// //       return { ...c, boostValue: boostVal, boostSide: side };
// //     }));
// //   };

// //   // ── Upgrade radio ────────────────────────────────────────────────────────
// //   const handleUpgradeRadio = (pos: number) => {
// //     if (upgradePos === pos) {
// //       setUpgradePos(null); setUpgradeFeatSel(""); setUpgradeMultiSel(new Set()); return;
// //     }
// //     setUpgradePos(pos); setUpgradeFeatSel(""); setUpgradeMultiSel(new Set());
// //   };

// //   const upgradeCoinn = upgradePos !== null ? coinAt(upgradePos) : null;

// //   // AllColor = the coin whose label starts with "AllColor" in this combo's palette
// //   const allColorEntry = coinColors.find(c => c.label.startsWith("AllColor"));
// //   const isAllColor = !!(upgradeCoinn && allColorEntry && upgradeCoinn.colorCode === allColorEntry.value);

// //   // Gold coins (label starts with "Gold") have no upgrade
// //   const goldCodes = new Set(coinColors.filter(c => c.label.startsWith("Gold")).map(c => c.value));

// //   const upgradeOptions: string[] = (() => {
// //     if (!upgradeCoinn) return [];
// //     // Gold coins never upgrade
// //     if (goldCodes.has(upgradeCoinn.colorCode)) return [];
// //     const activeFeaturesUpper = config.features.map(f => f.toUpperCase());
// //     if (isAllColor) {
// //       return ALL_UPGRADE_FEATURES.filter(f => !activeFeaturesUpper.includes(f));
// //     }
// //     return resolveUpgradeFeatures(upgradeCoinn.colorCode).filter(f => !activeFeaturesUpper.includes(f));
// //   })();

// //   const toggleMulti = (f: string) => {
// //     setUpgradeMultiSel(prev => {
// //       const next = new Set(prev);
// //       if (next.has(f)) next.delete(f); else next.add(f);
// //       return next;
// //     });
// //   };

// //   // The currently selected upgrade features (for the inline-confirm flow)
// //   const selectedUpgradeFeats: string[] = isAllColor
// //     ? Array.from(upgradeMultiSel)
// //     : upgradeFeatSel ? [upgradeFeatSel] : [];

// //   const canConfirmUpgrade = upgradePos !== null && selectedUpgradeFeats.length > 0;

// //   // ── Confirm upgrade inline — generates gaffe + navigates in one click ────
// //   const handleConfirmUpgrade = () => {
// //     if (!canConfirmUpgrade || upgradePos === null) return;

// //     // Build upgrade info
// //     const upgrade: UpgradeInfo = {
// //       col: Math.floor(upgradePos / 3),
// //       row: upgradePos % 3,
// //       features: selectedUpgradeFeats,
// //     };

// //     // Emit spin line with upgrade baked in
// //     const line = generateCombinationGaffe(coins, config, upgrade);
// //     onSpin(coins, line);

// //     // Navigate immediately to the new combo
// //     const newFeatures = [...new Set([...config.features, ...upgrade.features.map(f => f.toLowerCase())])];
// //     onUpgrade(newFeatures, coins);
// //   };

// //   // ── Spin ─────────────────────────────────────────────────────────────────
// //   const handleSpin = () => {
// //     if (spinsLeft <= 0) return;
// //     const cur = new Set(coins.map(c => c.position));
// //     const hasNew = [...cur].some(p => !lastSpinPositions.current.has(p));
// //     setSpinsLeft(hasNew ? MAX_SPINS : spinsLeft - 1);
// //     lastSpinPositions.current = cur;

// //     const line = generateCombinationGaffe(coins, config, null);
// //     onSpin(coins, line);
// //   };

// //   const resetFeature = () => {
// //     const seeded = baseCoins.map(c => ({ ...c, fromBase: true }));
// //     setCoins(seeded);
// //     setSpinsLeft(MAX_SPINS);
// //     lastSpinPositions.current = new Set(seeded.map(c => c.position));
// //     setUpgradePos(null); setUpgradeFeatSel(""); setUpgradeMultiSel(new Set());
// //     onReset();
// //   };

// //   const activeSplitter = config.hasZone ? (config.splitter ?? 1) : 0;
// //   const filled14 = coins.length >= 14 && (config.hasExtra || config.hasUltra);
// //   const cellMinH = config.hasDouble && config.hasUltra ? 150
// //                  : config.hasDouble                    ? 120
// //                  : config.hasUltra                     ? 110
// //                  : 100;

// //   return (
// //     <div className="bg-gray-800 rounded-xl border border-indigo-800">

// //       {/* HEADER */}
// //       <div onClick={() => setIsOpen(!isOpen)} className="flex justify-between items-center p-4 cursor-pointer select-none">
// //         <div className="flex items-center gap-2 flex-wrap">
// //           <h2 className="text-lg font-semibold text-white font-mono">⚡ Combination Feature</h2>
// //           {config.features.map(name => (
// //             <span key={name} className={`text-xs px-2 py-0.5 rounded capitalize font-mono ${FEATURE_BADGE[name] ?? "bg-gray-700 text-gray-300"}`}>
// //               {name}
// //             </span>
// //           ))}
// //           {config.hasZone && config.splitter && (
// //             <span className="text-xs px-2 py-0.5 rounded bg-sky-900 text-sky-300 border border-sky-700 font-mono">
// //               Splitter {config.splitter}
// //             </span>
// //           )}
// //         </div>
// //         <span className="text-gray-400">{isOpen ? "▼" : "▶"}</span>
// //       </div>

// //       {isOpen && (
// //         <div className="p-4 pt-0 flex flex-col gap-3">

// //           {/* SPIN CONTROLS */}
// //           <div className="flex items-center gap-3 flex-wrap">
// //             <button onClick={handleSpin} disabled={spinsLeft <= 0}
// //               className={`px-6 py-2 rounded font-bold text-white font-mono transition-all ${spinsLeft > 0 ? "bg-indigo-600 hover:bg-indigo-500" : "bg-gray-600 cursor-not-allowed opacity-50"}`}>
// //               SPIN
// //             </button>
// //             <span className="text-sm text-gray-400 font-mono">
// //               {spinsLeft} spin{spinsLeft !== 1 ? "s" : ""}
// //               {config.hasExtra && <span className="ml-1 text-emerald-400 text-xs">(4 — Extra)</span>}
// //             </span>
// //             <button onClick={resetFeature} className="px-3 py-1 bg-gray-600 hover:bg-gray-500 rounded text-sm">Reset</button>
// //             {filled14 && <span className="text-yellow-400 text-xs font-mono bg-yellow-900/40 px-2 py-0.5 rounded border border-yellow-700">⚠ 14 filled → lastPositionReel</span>}
// //           </div>

// //           {/* Double+Ultra info */}
// //           {config.hasDouble && config.hasUltra && (
// //             <div className="text-xs text-purple-300 font-mono bg-purple-900/30 px-3 py-1.5 rounded border border-purple-800">
// //               Double+Ultra: select boost on LEFT or RIGHT side per coin — choosing one locks the other. ✕ to clear.
// //             </div>
// //           )}

// //           {/* UPGRADE COIN SELECTED — feature picker + single Confirm button */}
// //           {upgradePos !== null && upgradeOptions.length > 0 && (
// //             <div className="flex flex-col gap-2 bg-yellow-900/20 border border-yellow-800 rounded-lg p-2">
// //               <span className="text-yellow-300 text-xs font-mono">
// //                 Upgrade {posToMetric(upgradePos)} →
// //                 {isAllColor ? " AllColor coin: select one or more features" : " select feature to add"}
// //               </span>
// //               {isAllColor ? (
// //                 <div className="flex gap-2 flex-wrap">
// //                   {upgradeOptions.map(f => (
// //                     <label key={f} className="flex items-center gap-1 cursor-pointer bg-yellow-900/40 border border-yellow-700 rounded px-2 py-1">
// //                       <input type="checkbox" className="accent-yellow-400 w-3 h-3"
// //                         checked={upgradeMultiSel.has(f)} onChange={() => toggleMulti(f)} />
// //                       <span className="text-yellow-100 text-xs font-mono">{f}</span>
// //                     </label>
// //                   ))}
// //                 </div>
// //               ) : (
// //                 <select className="bg-yellow-900 text-yellow-100 text-xs rounded px-2 py-1 font-mono border border-yellow-700 self-start"
// //                   value={upgradeFeatSel} onChange={e => setUpgradeFeatSel(e.target.value)}>
// //                   <option value="">Select feature...</option>
// //                   {upgradeOptions.map(f => <option key={f} value={f}>{f}</option>)}
// //                 </select>
// //               )}
// //               {canConfirmUpgrade && (
// //                 <button
// //                   onClick={handleConfirmUpgrade}
// //                   className="self-start px-4 py-1.5 bg-yellow-600 hover:bg-yellow-500 rounded font-bold text-sm font-mono transition-all">
// //                   ✦ Confirm → Go to {[...config.features, ...selectedUpgradeFeats.map(f => f.toLowerCase())]
// //                     .filter((v, i, a) => a.indexOf(v) === i).join(" + ")}
// //                 </button>
// //               )}
// //             </div>
// //           )}
// //           {upgradePos !== null && upgradeOptions.length === 0 && (
// //             <div className="text-xs text-gray-500 font-mono bg-gray-700 px-3 py-1.5 rounded">
// //               ℹ No upgrades available (all features already active or coin color doesn&apos;t support)
// //             </div>
// //           )}

// //           {/* GRID — 5 cols × 3 rows, column-major */}
// //           <div className="grid gap-1" style={{ gridTemplateColumns: "repeat(5, minmax(0, 1fr))" }}>
// //             {Array.from({ length: 3 }).map((_, row) =>
// //               Array.from({ length: 5 }).map((_, col) => {
// //                 const pos  = col * 3 + row;
// //                 const coin = coinAt(pos);

// //                 const zoneBg  = config.hasZone ? getZoneBgColor(pos, activeSplitter) : null;
// //                 const cellBg  = zoneBg
// //                   ? `${ZONE_BG_CLASS[zoneBg]} ${ZONE_BORDER_CLASS[zoneBg]}`
// //                   : "bg-gray-700 border-gray-600";
// //                 const hoverCls = !coin && !config.hasZone ? "hover:bg-gray-600 hover:border-gray-400" : "";

// //                 return (
// //                   <div key={pos} className="flex flex-col gap-1">
// //                     <div
// //                       onClick={() => !coin && handleCellClick(pos)}
// //                       className={`relative rounded-lg border-2 flex flex-col items-start p-1 text-xs text-white cursor-pointer transition-all hover:brightness-110 ${cellBg} ${hoverCls}`}
// //                       style={{ minHeight: cellMinH }}
// //                     >
// //                       <div className="flex justify-between w-full text-[9px] opacity-40 mb-0.5">
// //                         <span>{pos}</span>
// //                         <span className="font-mono">{posToMetric(pos)}</span>
// //                       </div>

// //                       {coin ? (
// //                         <div className="flex flex-col items-center w-full gap-0.5">

// //                           <div className="text-sm">🟡</div>

// //                           {/* Color dropdown */}
// //                           <select
// //                             className="bg-gray-800 text-white text-[9px] w-full rounded px-0.5 py-0.5 border-0 font-mono"
// //                             value={coin.colorCode}
// //                             onClick={e => e.stopPropagation()}
// //                             onChange={e => updateCoin(pos, "colorCode", Number(e.target.value))}
// //                           >
// //                             {coinColors.map(c => (
// //                               <option key={c.value} value={c.value} className="bg-gray-800">{c.label}</option>
// //                             ))}
// //                           </select>

// //                           {/* Value — Double: LEFT+RIGHT; others: single */}
// //                           {config.hasDouble ? (
// //                             <>
// //                               <div className="flex items-center gap-0.5 w-full">
// //                                 <span className="text-[7px] text-red-300 font-mono w-4 shrink-0">←L</span>
// //                                 <select className="bg-red-950 text-red-200 text-[9px] flex-1 rounded px-0 py-0.5 border-0 font-mono"
// //                                   value={coin.leftValue || ""}
// //                                   onClick={e => e.stopPropagation()}
// //                                   onChange={e => updateCoin(pos, "leftValue", e.target.value)}>
// //                                   <option value="">--</option>
// //                                   {COMBO_COIN_VALUES.map(v => <option key={v} value={v} className="bg-gray-800">{v}</option>)}
// //                                 </select>
// //                               </div>
// //                               <div className="flex items-center gap-0.5 w-full">
// //                                 <span className="text-[7px] text-red-300 font-mono w-4 shrink-0">R→</span>
// //                                 <select className="bg-red-950 text-red-200 text-[9px] flex-1 rounded px-0 py-0.5 border-0 font-mono"
// //                                   value={coin.rightValue || ""}
// //                                   onClick={e => e.stopPropagation()}
// //                                   onChange={e => updateCoin(pos, "rightValue", e.target.value)}>
// //                                   <option value="">--</option>
// //                                   {COMBO_COIN_VALUES.map(v => <option key={v} value={v} className="bg-gray-800">{v}</option>)}
// //                                 </select>
// //                               </div>
// //                             </>
// //                           ) : (
// //                             <select
// //                               className="bg-gray-800 text-white text-[9px] w-full rounded px-0.5 py-0.5 border-0 font-mono"
// //                               value={coin.value}
// //                               onClick={e => e.stopPropagation()}
// //                               onChange={e => updateCoin(pos, "value", e.target.value)}>
// //                               {COMBO_COIN_VALUES.map(v => (
// //                                 <option key={v} value={v} className="bg-gray-800">{v}</option>
// //                               ))}
// //                             </select>
// //                           )}

// //                           {/* Ultra boost — single dropdown when no double */}
// //                           {config.hasUltra && !config.hasDouble && (
// //                             <select
// //                               className="bg-purple-950 text-purple-200 text-[9px] w-full rounded px-0.5 py-0.5 border-0 font-mono"
// //                               value={coin.boostValue || ""}
// //                               onClick={e => e.stopPropagation()}
// //                               onChange={e => updateCoin(pos, "boostValue", e.target.value)}>
// //                               <option value="">Boost</option>
// //                               {ULTRA_BOOST_VALUES.map(v => <option key={v} value={v} className="bg-gray-800">{v}</option>)}
// //                             </select>
// //                           )}

// //                           {/* Ultra boost — LEFT/RIGHT side picker in Double+Ultra combo */}
// //                           {config.hasDouble && config.hasUltra && (
// //                             <div className="w-full mt-0.5" onClick={e => e.stopPropagation()}>
// //                               <div className="flex gap-0.5 w-full items-end">
// //                                 {(["LEFT", "RIGHT"] as const).map(side => {
// //                                   const isThis  = coin.boostSide === side;
// //                                   const locked  = !!(coin.boostSide && coin.boostSide !== side);
// //                                   return (
// //                                     <div key={side} className="flex flex-col items-center flex-1 gap-0">
// //                                       <span className={`text-[7px] font-mono ${isThis ? "text-yellow-300" : "text-gray-500"}`}>{side}</span>
// //                                       <select
// //                                         disabled={locked}
// //                                         className={`text-[8px] w-full rounded px-0 py-0.5 border-0 font-mono
// //                                           ${isThis ? "bg-yellow-700 text-yellow-100" : "bg-purple-950 text-purple-200"}
// //                                           ${locked ? "opacity-30 cursor-not-allowed" : ""}`}
// //                                         value={isThis ? (coin.boostValue || "") : ""}
// //                                         onChange={e => setBoostSide(pos, side, e.target.value)}>
// //                                         <option value="">--</option>
// //                                         {ULTRA_BOOST_VALUES.map(v => <option key={v} value={v} className="bg-gray-800">{v}</option>)}
// //                                       </select>
// //                                     </div>
// //                                   );
// //                                 })}
// //                                 {coin.boostSide && (
// //                                   <button
// //                                     className="text-red-400 hover:text-red-200 text-[8px] pb-0.5 ml-0.5"
// //                                     onClick={e => { e.stopPropagation(); updateCoin(pos, "boostValue", ""); updateCoin(pos, "boostSide", null); }}>✕</button>
// //                                 )}
// //                               </div>
// //                             </div>
// //                           )}

// //                           {/* Feature upgrade radio */}
// //                           <div className="flex items-center gap-1 mt-0.5 w-full" onClick={e => e.stopPropagation()}>
// //                             <input
// //                               type="radio" name="comboUpgrade"
// //                               className="accent-yellow-400 w-3 h-3 cursor-pointer"
// //                               checked={upgradePos === pos}
// //                               onChange={() => handleUpgradeRadio(pos)}
// //                             />
// //                             <span className="text-[8px] text-yellow-300 font-mono">upgrade</span>
// //                             {upgradePos === pos && !isAllColor && upgradeFeatSel && (
// //                               <span className="text-[8px] text-yellow-500 font-mono">→{upgradeFeatSel}</span>
// //                             )}
// //                             {upgradePos === pos && isAllColor && upgradeMultiSel.size > 0 && (
// //                               <span className="text-[8px] text-yellow-500 font-mono">→{Array.from(upgradeMultiSel).join("+")}</span>
// //                             )}
// //                           </div>

// //                           {/* Remove — non-base coins only */}
// //                           {!coin.fromBase && (
// //                             <button
// //                               onClick={e => { e.stopPropagation(); removeCoin(pos); }}
// //                               className="absolute top-1 right-1 text-[10px] text-red-300 hover:text-red-100 font-bold">✕</button>
// //                           )}

// //                         </div>
// //                       ) : (
// //                         <span className="text-white/40 text-[10px] mx-auto mt-4">+ Add</span>
// //                       )}
// //                     </div>
// //                   </div>
// //                 );
// //               })
// //             )}
// //           </div>

// //           {/* LEGEND */}
// //           <div className="text-[10px] text-gray-500 font-mono flex flex-wrap gap-2">
// //             <span>🟡 = coin · click empty cell to add · ✕ = remove</span>
// //             {config.hasDouble && <span>L← / R→ = LEFT / RIGHT coin values</span>}
// //             {config.hasUltra && !config.hasDouble && <span>Boost = ultra boost value</span>}
// //             {config.hasDouble && config.hasUltra && <span>L/R boost = side the boost applies to · ✕ to clear side</span>}
// //             {config.hasZone && <span>Background = zone regions (splitter {config.splitter})</span>}
// //             <span>✦ radio = upgrade · single-color = 1 feature · AllColor = multi-feature</span>
// //           </div>

// //         </div>
// //       )}
// //     </div>
// //   );
// // }



// /* eslint-disable @typescript-eslint/no-explicit-any */
// "use client";

// import { useState, useRef } from "react";
// import {
//   ComboCoin, ComboFeatureConfig,
//   getComboMaxSpins, getComboCoinColors,
//   generateCombinationGaffe, resolveUpgradeFeatures, UpgradeInfo,
// } from "./combinationFeatureGenerator";
// import { ZONE_BG_CLASS, ZONE_BORDER_CLASS, getZoneBgColor } from "./zoneFeatureGenerator";
// import { ULTRA_BOOST_VALUES } from "./ultraFeatureGenerator";
// import { posToMetric, ALL_UPGRADE_FEATURES } from "./config";

// // ── Constants ─────────────────────────────────────────────────────────────────
// // Fix #5: uppercase coin values
// const COMBO_COIN_VALUES = ["1", "2", "5", "MINOR", "MAJOR", "MINI"];

// const FEATURE_BADGE: Record<string, string> = {
//   double: "bg-red-900 text-red-300 border border-red-600",
//   extra:  "bg-emerald-900 text-emerald-300 border border-emerald-600",
//   zone:   "bg-sky-900 text-sky-300 border border-sky-600",
//   ultra:  "bg-purple-900 text-purple-300 border border-purple-600",
// };

// // ── Props ─────────────────────────────────────────────────────────────────────
// type Props = {
//   baseCoins:          ComboCoin[];
//   config:             ComboFeatureConfig;
//   pendingUpgradeInfo: UpgradeInfo | null;   // carried from single-feature upgrade
//   onSpin:             (snapshot: ComboCoin[], line: string) => void;
//   onReset:            () => void;
//   onUpgrade:          (newFeatures: string[], carryCoins: ComboCoin[], upgradeInfo: UpgradeInfo) => void;
// };

// // ── Component ─────────────────────────────────────────────────────────────────
// export default function CombinationFeature({ baseCoins, config, pendingUpgradeInfo, onSpin, onReset, onUpgrade }: Props) {
//   const MAX_SPINS  = getComboMaxSpins(config);
//   const coinColors = getComboCoinColors(config.features);
//   const defaultCode = coinColors[0].value;

//   const [isOpen,    setIsOpen]    = useState(true);
//   const initialSeeds = baseCoins.map(c => ({ ...c, fromBase: true }));
//   const [coins,     setCoins]     = useState<ComboCoin[]>(initialSeeds);
//   const [spinsLeft, setSpinsLeft] = useState(MAX_SPINS);
//   const lastSpinPositions = useRef<Set<number>>(new Set(initialSeeds.map(c => c.position)));

//   // Upgrade state
//   const [upgradePos,      setUpgradePos]      = useState<number | null>(null);
//   const [upgradeFeatSel,  setUpgradeFeatSel]  = useState<string>("");
//   const [upgradeMultiSel, setUpgradeMultiSel] = useState<Set<string>>(new Set());

//   const coinAt = (pos: number) => coins.find(c => c.position === pos);

//   // ── Coin operations ──────────────────────────────────────────────────────
//   const handleCellClick = (pos: number) => {
//     if (coinAt(pos)) return;
//     setCoins(prev => [...prev, {
//       position: pos, colorCode: defaultCode, value: COMBO_COIN_VALUES[0],
//       leftValue: "", rightValue: "", boostValue: "", boostSide: null,
//     }]);
//   };

//   const removeCoin = (pos: number) => {
//     const c = coinAt(pos);
//     if (!c || c.fromBase) return;
//     if (upgradePos === pos) {
//       setUpgradePos(null); setUpgradeFeatSel(""); setUpgradeMultiSel(new Set());
//     }
//     setCoins(prev => prev.filter(x => x.position !== pos));
//   };

//   const updateCoin = (pos: number, field: keyof ComboCoin, val: any) =>
//     setCoins(prev => prev.map(c => c.position === pos ? { ...c, [field]: val } : c));

//   const setBoostSide = (pos: number, side: "LEFT" | "RIGHT", boostVal: string) => {
//     setCoins(prev => prev.map(c => {
//       if (c.position !== pos) return c;
//       if (!boostVal) return { ...c, boostValue: "", boostSide: null };
//       return { ...c, boostValue: boostVal, boostSide: side };
//     }));
//   };

//   // ── Upgrade radio ────────────────────────────────────────────────────────
//   const handleUpgradeRadio = (pos: number) => {
//     if (upgradePos === pos) {
//       setUpgradePos(null); setUpgradeFeatSel(""); setUpgradeMultiSel(new Set()); return;
//     }
//     setUpgradePos(pos); setUpgradeFeatSel(""); setUpgradeMultiSel(new Set());
//   };

//   const upgradeCoinn = upgradePos !== null ? coinAt(upgradePos) : null;

//   // AllColor = the coin whose label starts with "AllColor" in this combo's palette
//   const allColorEntry = coinColors.find(c => c.label.startsWith("AllColor"));
//   const isAllColor = !!(upgradeCoinn && allColorEntry && upgradeCoinn.colorCode === allColorEntry.value);

//   // Gold coins (label starts with "Gold") have no upgrade
//   const goldCodes = new Set(coinColors.filter(c => c.label.startsWith("Gold")).map(c => c.value));

//   const upgradeOptions: string[] = (() => {
//     if (!upgradeCoinn) return [];
//     // Gold coins never upgrade
//     if (goldCodes.has(upgradeCoinn.colorCode)) return [];
//     const activeFeaturesUpper = config.features.map(f => f.toUpperCase());
//     if (isAllColor) {
//       return ALL_UPGRADE_FEATURES.filter(f => !activeFeaturesUpper.includes(f));
//     }
//     return resolveUpgradeFeatures(upgradeCoinn.colorCode).filter(f => !activeFeaturesUpper.includes(f));
//   })();

//   const toggleMulti = (f: string) => {
//     setUpgradeMultiSel(prev => {
//       const next = new Set(prev);
//       if (next.has(f)) next.delete(f); else next.add(f);
//       return next;
//     });
//   };

//   // The currently selected upgrade features (for combo-internal upgrade)
//   const selectedUpgradeFeats: string[] = isAllColor
//     ? Array.from(upgradeMultiSel)
//     : upgradeFeatSel ? [upgradeFeatSel] : [];

//   // Navigate immediately when upgrade feature selected in combo
//   const navigateComboUpgrade = (feats: string[]) => {
//     if (!upgradePos || feats.length === 0) return;
//     const upgradeInfo: UpgradeInfo = { col: Math.floor(upgradePos/3), row: upgradePos%3, features: feats };
//     const newFeatures = [...new Set([...config.features, ...feats.map(f => f.toLowerCase())])];
//     onUpgrade(newFeatures, coins, upgradeInfo);
//   };

//   // ── Spin ─────────────────────────────────────────────────────────────────
//   // Uses pendingUpgradeInfo (from single-feature upgrade) on first spin, then it's cleared by parent
//   const handleSpin = () => {
//     if (spinsLeft <= 0) return;
//     const cur = new Set(coins.map(c => c.position));
//     const hasNew = [...cur].some(p => !lastSpinPositions.current.has(p));
//     setSpinsLeft(hasNew ? MAX_SPINS : spinsLeft - 1);
//     lastSpinPositions.current = cur;

//     const line = generateCombinationGaffe(coins, config, pendingUpgradeInfo ?? null);
//     onSpin(coins, line);   // parent clears pendingUpgradeInfo after this
//   };

//   const resetFeature = () => {
//     const seeded = baseCoins.map(c => ({ ...c, fromBase: true }));
//     setCoins(seeded);
//     setSpinsLeft(MAX_SPINS);
//     lastSpinPositions.current = new Set(seeded.map(c => c.position));
//     setUpgradePos(null); setUpgradeFeatSel(""); setUpgradeMultiSel(new Set());
//     onReset();
//   };

//   const activeSplitter = config.hasZone ? (config.splitter ?? 1) : 0;
//   const filled14 = coins.length >= 14 && (config.hasExtra || config.hasUltra);
//   const cellMinH = config.hasDouble && config.hasUltra ? 150
//                  : config.hasDouble                    ? 120
//                  : config.hasUltra                     ? 110
//                  : 100;

//   return (
//     <div className="bg-gray-800 rounded-xl border border-indigo-800">

//       {/* HEADER */}
//       <div onClick={() => setIsOpen(!isOpen)} className="flex justify-between items-center p-4 cursor-pointer select-none">
//         <div className="flex items-center gap-2 flex-wrap">
//           <h2 className="text-lg font-semibold text-white font-mono">⚡ Combination Feature</h2>
//           {config.features.map(name => (
//             <span key={name} className={`text-xs px-2 py-0.5 rounded capitalize font-mono ${FEATURE_BADGE[name] ?? "bg-gray-700 text-gray-300"}`}>
//               {name}
//             </span>
//           ))}
//           {config.hasZone && config.splitter && (
//             <span className="text-xs px-2 py-0.5 rounded bg-sky-900 text-sky-300 border border-sky-700 font-mono">
//               Splitter {config.splitter}
//             </span>
//           )}
//           {pendingUpgradeInfo && (
//             <span className="text-xs px-2 py-0.5 rounded bg-yellow-900 text-yellow-300 border border-yellow-700 font-mono animate-pulse">
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
//             <button onClick={handleSpin} disabled={spinsLeft <= 0}
//               className={`px-6 py-2 rounded font-bold text-white font-mono transition-all ${spinsLeft > 0 ? "bg-indigo-600 hover:bg-indigo-500" : "bg-gray-600 cursor-not-allowed opacity-50"}`}>
//               SPIN
//             </button>
//             <span className="text-sm text-gray-400 font-mono">
//               {spinsLeft} spin{spinsLeft !== 1 ? "s" : ""}
//               {config.hasExtra && <span className="ml-1 text-emerald-400 text-xs">(4 — Extra)</span>}
//             </span>
//             <button onClick={resetFeature} className="px-3 py-1 bg-gray-600 hover:bg-gray-500 rounded text-sm">Reset</button>
//             {filled14 && <span className="text-yellow-400 text-xs font-mono bg-yellow-900/40 px-2 py-0.5 rounded border border-yellow-700">⚠ 14 filled → lastPositionReel</span>}
//           </div>

//           {/* Double+Ultra info */}
//           {config.hasDouble && config.hasUltra && (
//             <div className="text-xs text-purple-300 font-mono bg-purple-900/30 px-3 py-1.5 rounded border border-purple-800">
//               Double+Ultra: select boost on LEFT or RIGHT side per coin — choosing one locks the other. ✕ to clear.
//             </div>
//           )}

//           {/* UPGRADE COIN SELECTED — select feature → navigate immediately */}
//           {upgradePos !== null && upgradeOptions.length > 0 && (
//             <div className="flex flex-col gap-2 bg-yellow-900/20 border border-yellow-800 rounded-lg p-2">
//               <span className="text-yellow-300 text-xs font-mono font-bold">
//                 ✦ Upgrade at {posToMetric(upgradePos)} — select feature to add (navigates immediately):
//               </span>
//               {isAllColor ? (
//                 <div className="flex flex-col gap-2">
//                   <div className="flex gap-2 flex-wrap">
//                     {upgradeOptions.map(f => (
//                       <label key={f} className="flex items-center gap-1 cursor-pointer bg-yellow-900/40 border border-yellow-700 rounded px-2 py-1">
//                         <input type="checkbox" className="accent-yellow-400 w-3 h-3"
//                           checked={upgradeMultiSel.has(f)} onChange={() => toggleMulti(f)} />
//                         <span className="text-yellow-100 text-xs font-mono">{f}</span>
//                       </label>
//                     ))}
//                   </div>
//                   {upgradeMultiSel.size > 0 && (
//                     <button onClick={() => navigateComboUpgrade(Array.from(upgradeMultiSel))}
//                       className="self-start px-3 py-1 bg-yellow-600 hover:bg-yellow-500 rounded text-xs font-mono font-bold transition-all">
//                       → Go to {[...config.features, ...Array.from(upgradeMultiSel).map(f=>f.toLowerCase())].filter((v,i,a)=>a.indexOf(v)===i).join(" + ")}
//                     </button>
//                   )}
//                 </div>
//               ) : (
//                 <div className="flex gap-2 flex-wrap">
//                   {upgradeOptions.map(f => (
//                     <button key={f} onClick={() => navigateComboUpgrade([f])}
//                       className="px-3 py-1.5 bg-yellow-700 hover:bg-yellow-600 border border-yellow-600 rounded text-xs font-mono font-bold transition-all">
//                       → {f}
//                     </button>
//                   ))}
//                 </div>
//               )}
//             </div>
//           )}
//           {upgradePos !== null && upgradeOptions.length === 0 && (
//             <div className="text-xs text-gray-500 font-mono bg-gray-700 px-3 py-1.5 rounded">
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
//                       className={`relative rounded-lg border-2 flex flex-col items-start p-1 text-xs text-white cursor-pointer transition-all hover:brightness-110 ${cellBg} ${hoverCls}`}
//                       style={{ minHeight: cellMinH }}
//                     >
//                       <div className="flex justify-between w-full text-[9px] opacity-40 mb-0.5">
//                         <span>{pos}</span>
//                         <span className="font-mono">{posToMetric(pos)}</span>
//                       </div>

//                       {coin ? (
//                         <div className="flex flex-col items-center w-full gap-0.5">

//                           <div className="text-sm">🟡</div>

//                           {/* Color dropdown */}
//                           <select
//                             className="bg-gray-800 text-white text-[9px] w-full rounded px-0.5 py-0.5 border-0 font-mono"
//                             value={coin.colorCode}
//                             onClick={e => e.stopPropagation()}
//                             onChange={e => updateCoin(pos, "colorCode", Number(e.target.value))}
//                           >
//                             {coinColors.map(c => (
//                               <option key={c.value} value={c.value} className="bg-gray-800">{c.label}</option>
//                             ))}
//                           </select>

//                           {/* Value — Double: LEFT+RIGHT; others: single */}
//                           {config.hasDouble ? (
//                             <>
//                               <div className="flex items-center gap-0.5 w-full">
//                                 <span className="text-[7px] text-red-300 font-mono w-4 shrink-0">←L</span>
//                                 <select className="bg-red-950 text-red-200 text-[9px] flex-1 rounded px-0 py-0.5 border-0 font-mono"
//                                   value={coin.leftValue || ""}
//                                   onClick={e => e.stopPropagation()}
//                                   onChange={e => updateCoin(pos, "leftValue", e.target.value)}>
//                                   <option value="">--</option>
//                                   {COMBO_COIN_VALUES.map(v => <option key={v} value={v} className="bg-gray-800">{v}</option>)}
//                                 </select>
//                               </div>
//                               <div className="flex items-center gap-0.5 w-full">
//                                 <span className="text-[7px] text-red-300 font-mono w-4 shrink-0">R→</span>
//                                 <select className="bg-red-950 text-red-200 text-[9px] flex-1 rounded px-0 py-0.5 border-0 font-mono"
//                                   value={coin.rightValue || ""}
//                                   onClick={e => e.stopPropagation()}
//                                   onChange={e => updateCoin(pos, "rightValue", e.target.value)}>
//                                   <option value="">--</option>
//                                   {COMBO_COIN_VALUES.map(v => <option key={v} value={v} className="bg-gray-800">{v}</option>)}
//                                 </select>
//                               </div>
//                             </>
//                           ) : (
//                             <select
//                               className="bg-gray-800 text-white text-[9px] w-full rounded px-0.5 py-0.5 border-0 font-mono"
//                               value={coin.value}
//                               onClick={e => e.stopPropagation()}
//                               onChange={e => updateCoin(pos, "value", e.target.value)}>
//                               {COMBO_COIN_VALUES.map(v => (
//                                 <option key={v} value={v} className="bg-gray-800">{v}</option>
//                               ))}
//                             </select>
//                           )}

//                           {/* Ultra boost — single dropdown when no double */}
//                           {config.hasUltra && !config.hasDouble && (
//                             <select
//                               className="bg-purple-950 text-purple-200 text-[9px] w-full rounded px-0.5 py-0.5 border-0 font-mono"
//                               value={coin.boostValue || ""}
//                               onClick={e => e.stopPropagation()}
//                               onChange={e => updateCoin(pos, "boostValue", e.target.value)}>
//                               <option value="">Boost</option>
//                               {ULTRA_BOOST_VALUES.map(v => <option key={v} value={v} className="bg-gray-800">{v}</option>)}
//                             </select>
//                           )}

//                           {/* Ultra boost — LEFT/RIGHT side picker in Double+Ultra combo */}
//                           {config.hasDouble && config.hasUltra && (
//                             <div className="w-full mt-0.5" onClick={e => e.stopPropagation()}>
//                               <div className="flex gap-0.5 w-full items-end">
//                                 {(["LEFT", "RIGHT"] as const).map(side => {
//                                   const isThis  = coin.boostSide === side;
//                                   const locked  = !!(coin.boostSide && coin.boostSide !== side);
//                                   return (
//                                     <div key={side} className="flex flex-col items-center flex-1 gap-0">
//                                       <span className={`text-[7px] font-mono ${isThis ? "text-yellow-300" : "text-gray-500"}`}>{side}</span>
//                                       <select
//                                         disabled={locked}
//                                         className={`text-[8px] w-full rounded px-0 py-0.5 border-0 font-mono
//                                           ${isThis ? "bg-yellow-700 text-yellow-100" : "bg-purple-950 text-purple-200"}
//                                           ${locked ? "opacity-30 cursor-not-allowed" : ""}`}
//                                         value={isThis ? (coin.boostValue || "") : ""}
//                                         onChange={e => setBoostSide(pos, side, e.target.value)}>
//                                         <option value="">--</option>
//                                         {ULTRA_BOOST_VALUES.map(v => <option key={v} value={v} className="bg-gray-800">{v}</option>)}
//                                       </select>
//                                     </div>
//                                   );
//                                 })}
//                                 {coin.boostSide && (
//                                   <button
//                                     className="text-red-400 hover:text-red-200 text-[8px] pb-0.5 ml-0.5"
//                                     onClick={e => { e.stopPropagation(); updateCoin(pos, "boostValue", ""); updateCoin(pos, "boostSide", null); }}>✕</button>
//                                 )}
//                               </div>
//                             </div>
//                           )}

//                           {/* Feature upgrade radio */}
//                           <div className="flex items-center gap-1 mt-0.5 w-full" onClick={e => e.stopPropagation()}>
//                             <input
//                               type="radio" name="comboUpgrade"
//                               className="accent-yellow-400 w-3 h-3 cursor-pointer"
//                               checked={upgradePos === pos}
//                               onChange={() => handleUpgradeRadio(pos)}
//                             />
//                             <span className="text-[8px] text-yellow-300 font-mono">upgrade</span>
//                             {upgradePos === pos && !isAllColor && upgradeFeatSel && (
//                               <span className="text-[8px] text-yellow-500 font-mono">→{upgradeFeatSel}</span>
//                             )}
//                             {upgradePos === pos && isAllColor && upgradeMultiSel.size > 0 && (
//                               <span className="text-[8px] text-yellow-500 font-mono">→{Array.from(upgradeMultiSel).join("+")}</span>
//                             )}
//                           </div>

//                           {/* Remove — non-base coins only */}
//                           {!coin.fromBase && (
//                             <button
//                               onClick={e => { e.stopPropagation(); removeCoin(pos); }}
//                               className="absolute top-1 right-1 text-[10px] text-red-300 hover:text-red-100 font-bold">✕</button>
//                           )}

//                         </div>
//                       ) : (
//                         <span className="text-white/40 text-[10px] mx-auto mt-4">+ Add</span>
//                       )}
//                     </div>
//                   </div>
//                 );
//               })
//             )}
//           </div>

//           {/* LEGEND */}
//           <div className="text-[10px] text-gray-500 font-mono flex flex-wrap gap-2">
//             <span>🟡 = coin · click empty cell to add · ✕ = remove</span>
//             {config.hasDouble && <span>L← / R→ = LEFT / RIGHT coin values</span>}
//             {config.hasUltra && !config.hasDouble && <span>Boost = ultra boost value</span>}
//             {config.hasDouble && config.hasUltra && <span>L/R boost = side the boost applies to · ✕ to clear side</span>}
//             {config.hasZone && <span>Background = zone regions (splitter {config.splitter})</span>}
//             <span>✦ radio = upgrade · single-color = 1 feature · AllColor = multi-feature</span>
//           </div>

//         </div>
//       )}
//     </div>
//   );
// }


//! latest wokring code
/* eslint-disable @typescript-eslint/no-explicit-any */
// "use client";

// import { useState, useRef } from "react";
// import {
//   ComboCoin, ComboFeatureConfig,
//   getComboMaxSpins, getComboCoinColors,
//   generateCombinationGaffe, resolveUpgradeFeatures, UpgradeInfo,
// } from "./combinationFeatureGenerator";
// import { ZONE_BG_CLASS, ZONE_BORDER_CLASS, getZoneBgColor } from "./zoneFeatureGenerator";
// import { ULTRA_BOOST_VALUES } from "./ultraFeatureGenerator";
// import { posToMetric, ALL_UPGRADE_FEATURES } from "./config";

// // ── Constants ─────────────────────────────────────────────────────────────────
// // Fix #5: uppercase coin values
// const COMBO_COIN_VALUES = ["100", "250", "500", "MINOR", "MAJOR", "MINI"];

// const FEATURE_BADGE: Record<string, string> = {
//   double: "bg-red-900 text-red-300 border border-red-600",
//   extra:  "bg-emerald-900 text-emerald-300 border border-emerald-600",
//   zone:   "bg-sky-900 text-sky-300 border border-sky-600",
//   ultra:  "bg-purple-900 text-purple-300 border border-purple-600",
// };

// // ── Props ─────────────────────────────────────────────────────────────────────
// type Props = {
//   baseCoins:          ComboCoin[];
//   config:             ComboFeatureConfig;
//   pendingUpgradeInfo: UpgradeInfo | null;   // carried from single-feature upgrade
//   onSpin:             (snapshot: ComboCoin[], line: string) => void;
//   onReset:            () => void;
//   onUpgrade:          (newFeatures: string[], carryCoins: ComboCoin[], upgradeInfo: UpgradeInfo) => void;
// };

// // ── Component ─────────────────────────────────────────────────────────────────
// export default function CombinationFeature({ baseCoins, config, pendingUpgradeInfo, onSpin, onReset, onUpgrade }: Props) {
//   const MAX_SPINS  = getComboMaxSpins(config);
//   const coinColors = getComboCoinColors(config.features);
//   const defaultCode = coinColors[0].value;

//   const [isOpen,    setIsOpen]    = useState(true);
//   const initialSeeds = baseCoins.map(c => ({ ...c, fromBase: true }));
//   const [coins,     setCoins]     = useState<ComboCoin[]>(initialSeeds);
//   const [spinsLeft, setSpinsLeft] = useState(MAX_SPINS);
//   const lastSpinPositions = useRef<Set<number>>(new Set(initialSeeds.map(c => c.position)));

//   // Upgrade state
//   const [upgradePos,      setUpgradePos]      = useState<number | null>(null);
//   const [upgradeFeatSel,  setUpgradeFeatSel]  = useState<string>("");
//   const [upgradeMultiSel, setUpgradeMultiSel] = useState<Set<string>>(new Set());

//   const coinAt = (pos: number) => coins.find(c => c.position === pos);

//   // ── Coin operations ──────────────────────────────────────────────────────
//   const handleCellClick = (pos: number) => {
//     if (coinAt(pos)) return;
//     setCoins(prev => [...prev, {
//       position: pos, colorCode: defaultCode, value: COMBO_COIN_VALUES[0],
//       leftValue: "", rightValue: "", boostValue: "", boostSide: null,
//     }]);
//   };

//   const removeCoin = (pos: number) => {
//     const c = coinAt(pos);
//     if (!c || c.fromBase) return;
//     if (upgradePos === pos) {
//       setUpgradePos(null); setUpgradeFeatSel(""); setUpgradeMultiSel(new Set());
//     }
//     setCoins(prev => prev.filter(x => x.position !== pos));
//   };

//   const updateCoin = (pos: number, field: keyof ComboCoin, val: any) =>
//     setCoins(prev => prev.map(c => c.position === pos ? { ...c, [field]: val } : c));

//   const setBoostSide = (pos: number, side: "LEFT" | "RIGHT", boostVal: string) => {
//     setCoins(prev => prev.map(c => {
//       if (c.position !== pos) return c;
//       if (!boostVal) return { ...c, boostValue: "", boostSide: null };
//       return { ...c, boostValue: boostVal, boostSide: side };
//     }));
//   };

//   // ── Upgrade radio ────────────────────────────────────────────────────────
//   const handleUpgradeRadio = (pos: number) => {
//     if (upgradePos === pos) {
//       setUpgradePos(null); setUpgradeFeatSel(""); setUpgradeMultiSel(new Set()); return;
//     }
//     setUpgradePos(pos); setUpgradeFeatSel(""); setUpgradeMultiSel(new Set());
//   };

//   const upgradeCoinn = upgradePos !== null ? coinAt(upgradePos) : null;

//   // AllColor = the coin whose label starts with "AllColor" in this combo's palette
//   const allColorEntry = coinColors.find(c => c.label.startsWith("AllColor"));
//   const isAllColor = !!(upgradeCoinn && allColorEntry && upgradeCoinn.colorCode === allColorEntry.value);

//   // Gold coins (label starts with "Gold") have no upgrade
//   const goldCodes = new Set(coinColors.filter(c => c.label.startsWith("Gold")).map(c => c.value));

//   const upgradeOptions: string[] = (() => {
//     if (!upgradeCoinn) return [];
//     // Gold coins never upgrade
//     if (goldCodes.has(upgradeCoinn.colorCode)) return [];
//     const activeFeaturesUpper = config.features.map(f => f.toUpperCase());
//     if (isAllColor) {
//       return ALL_UPGRADE_FEATURES.filter(f => !activeFeaturesUpper.includes(f));
//     }
//     return resolveUpgradeFeatures(upgradeCoinn.colorCode).filter(f => !activeFeaturesUpper.includes(f));
//   })();

//   const toggleMulti = (f: string) => {
//     setUpgradeMultiSel(prev => {
//       const next = new Set(prev);
//       if (next.has(f)) next.delete(f); else next.add(f);
//       return next;
//     });
//   };

//   // The currently selected upgrade features (for combo-internal upgrade)
//   const selectedUpgradeFeats: string[] = isAllColor
//     ? Array.from(upgradeMultiSel)
//     : upgradeFeatSel ? [upgradeFeatSel] : [];

//   // Navigate immediately when upgrade feature selected in combo
//   const navigateComboUpgrade = (feats: string[]) => {
//     if (upgradePos === null || feats.length === 0) return;
//     const upgradeInfo: UpgradeInfo = { col: Math.floor(upgradePos/3), row: upgradePos%3, features: feats };
//     const newFeatures = [...new Set([...config.features, ...feats.map(f => f.toLowerCase())])];
//     onUpgrade(newFeatures, coins, upgradeInfo);
//   };

//   // ── Spin ─────────────────────────────────────────────────────────────────
//   // Uses pendingUpgradeInfo (from single-feature upgrade) on first spin, then it's cleared by parent
//   const handleSpin = () => {
//     if (spinsLeft <= 0) return;
//     const cur = new Set(coins.map(c => c.position));
//     const hasNew = [...cur].some(p => !lastSpinPositions.current.has(p));
//     setSpinsLeft(hasNew ? MAX_SPINS : spinsLeft - 1);
//     lastSpinPositions.current = cur;

//     const line = generateCombinationGaffe(coins, config, pendingUpgradeInfo ?? null);
//     onSpin(coins, line);   // parent clears pendingUpgradeInfo after this
//   };

//   const resetFeature = () => {
//     const seeded = baseCoins.map(c => ({ ...c, fromBase: true }));
//     setCoins(seeded);
//     setSpinsLeft(MAX_SPINS);
//     lastSpinPositions.current = new Set(seeded.map(c => c.position));
//     setUpgradePos(null); setUpgradeFeatSel(""); setUpgradeMultiSel(new Set());
//     onReset();
//   };

//   const activeSplitter = config.hasZone ? (config.splitter ?? 1) : 0;
//   const filled14 = coins.length >= 14 && (config.hasExtra || config.hasUltra);
//   const cellMinH = config.hasDouble && config.hasUltra ? 150
//                  : config.hasDouble                    ? 120
//                  : config.hasUltra                     ? 110
//                  : 100;

//   return (
//     <div className="bg-gray-800 rounded-xl border border-indigo-800">

//       {/* HEADER */}
//       <div onClick={() => setIsOpen(!isOpen)} className="flex justify-between items-center p-4 cursor-pointer select-none">
//         <div className="flex items-center gap-2 flex-wrap">
//           <h2 className="text-lg font-semibold text-white font-mono">⚡ Combination Feature</h2>
//           {config.features.map(name => (
//             <span key={name} className={`text-xs px-2 py-0.5 rounded capitalize font-mono ${FEATURE_BADGE[name] ?? "bg-gray-700 text-gray-300"}`}>
//               {name}
//             </span>
//           ))}
//           {config.hasZone && config.splitter && (
//             <span className="text-xs px-2 py-0.5 rounded bg-sky-900 text-sky-300 border border-sky-700 font-mono">
//               Splitter {config.splitter}
//             </span>
//           )}
//           {pendingUpgradeInfo && (
//             <span className="text-xs px-2 py-0.5 rounded bg-yellow-900 text-yellow-300 border border-yellow-700 font-mono animate-pulse">
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
//             <button onClick={handleSpin} disabled={spinsLeft <= 0}
//               className={`px-6 py-2 rounded font-bold text-white font-mono transition-all ${spinsLeft > 0 ? "bg-indigo-600 hover:bg-indigo-500" : "bg-gray-600 cursor-not-allowed opacity-50"}`}>
//               SPIN
//             </button>
//             <span className="text-sm text-gray-400 font-mono">
//               {spinsLeft} spin{spinsLeft !== 1 ? "s" : ""}
//               {config.hasExtra && <span className="ml-1 text-emerald-400 text-xs">(4 — Extra)</span>}
//             </span>
//             <button onClick={resetFeature} className="px-3 py-1 bg-gray-600 hover:bg-gray-500 rounded text-sm">Reset</button>
//             {filled14 && <span className="text-yellow-400 text-xs font-mono bg-yellow-900/40 px-2 py-0.5 rounded border border-yellow-700">⚠ 14 filled → lastPositionReel</span>}
//           </div>

//           {/* Double+Ultra info */}
//           {config.hasDouble && config.hasUltra && (
//             <div className="text-xs text-purple-300 font-mono bg-purple-900/30 px-3 py-1.5 rounded border border-purple-800">
//               Double+Ultra: select boost on LEFT or RIGHT side per coin — choosing one locks the other. ✕ to clear.
//             </div>
//           )}

//           {/* UPGRADE COIN SELECTED — select feature → navigate immediately */}
//           {upgradePos !== null && upgradeOptions.length > 0 && (
//             <div className="flex flex-col gap-2 bg-yellow-900/20 border border-yellow-800 rounded-lg p-2">
//               <span className="text-yellow-300 text-xs font-mono font-bold">
//                 ✦ Upgrade at {posToMetric(upgradePos)} — select feature to add (navigates immediately):
//               </span>
//               {isAllColor ? (
//                 <div className="flex flex-col gap-2">
//                   <div className="flex gap-2 flex-wrap">
//                     {upgradeOptions.map(f => (
//                       <label key={f} className="flex items-center gap-1 cursor-pointer bg-yellow-900/40 border border-yellow-700 rounded px-2 py-1">
//                         <input type="checkbox" className="accent-yellow-400 w-3 h-3"
//                           checked={upgradeMultiSel.has(f)} onChange={() => toggleMulti(f)} />
//                         <span className="text-yellow-100 text-xs font-mono">{f}</span>
//                       </label>
//                     ))}
//                   </div>
//                   {upgradeMultiSel.size > 0 && (
//                     <button onClick={() => navigateComboUpgrade(Array.from(upgradeMultiSel))}
//                       className="self-start px-3 py-1 bg-yellow-600 hover:bg-yellow-500 rounded text-xs font-mono font-bold transition-all">
//                       → Go to {[...config.features, ...Array.from(upgradeMultiSel).map(f=>f.toLowerCase())].filter((v,i,a)=>a.indexOf(v)===i).join(" + ")}
//                     </button>
//                   )}
//                 </div>
//               ) : (
//                 <div className="flex gap-2 flex-wrap">
//                   {upgradeOptions.map(f => (
//                     <button key={f} onClick={() => navigateComboUpgrade([f])}
//                       className="px-3 py-1.5 bg-yellow-700 hover:bg-yellow-600 border border-yellow-600 rounded text-xs font-mono font-bold transition-all">
//                       → {f}
//                     </button>
//                   ))}
//                 </div>
//               )}
//             </div>
//           )}
//           {upgradePos !== null && upgradeOptions.length === 0 && (
//             <div className="text-xs text-gray-500 font-mono bg-gray-700 px-3 py-1.5 rounded">
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
//                       className={`relative rounded-lg border-2 flex flex-col items-start p-1 text-xs text-white cursor-pointer transition-all hover:brightness-110 ${cellBg} ${hoverCls}`}
//                       style={{ minHeight: cellMinH }}
//                     >
//                       <div className="flex justify-between w-full text-[9px] opacity-40 mb-0.5">
//                         <span>{pos}</span>
//                         <span className="font-mono">{posToMetric(pos)}</span>
//                       </div>

//                       {coin ? (
//                         <div className="flex flex-col items-center w-full gap-0.5">

//                           <div className="text-sm">🟡</div>

//                           {/* Color dropdown */}
//                           <select
//                             className="bg-gray-800 text-white text-[9px] w-full rounded px-0.5 py-0.5 border-0 font-mono"
//                             value={coin.colorCode}
//                             onClick={e => e.stopPropagation()}
//                             onChange={e => updateCoin(pos, "colorCode", Number(e.target.value))}
//                           >
//                             {coinColors.map(c => (
//                               <option key={c.value} value={c.value} className="bg-gray-800">{c.label}</option>
//                             ))}
//                           </select>

//                           {/* Value — Double: LEFT+RIGHT; others: single */}
//                           {config.hasDouble ? (
//                             <>
//                               <div className="flex items-center gap-0.5 w-full">
//                                 <span className="text-[7px] text-red-300 font-mono w-4 shrink-0">←L</span>
//                                 <select className="bg-red-950 text-red-200 text-[9px] flex-1 rounded px-0 py-0.5 border-0 font-mono"
//                                   value={coin.leftValue || ""}
//                                   onClick={e => e.stopPropagation()}
//                                   onChange={e => updateCoin(pos, "leftValue", e.target.value)}>
//                                   <option value="">--</option>
//                                   {COMBO_COIN_VALUES.map(v => <option key={v} value={v} className="bg-gray-800">{v}</option>)}
//                                 </select>
//                               </div>
//                               <div className="flex items-center gap-0.5 w-full">
//                                 <span className="text-[7px] text-red-300 font-mono w-4 shrink-0">R→</span>
//                                 <select className="bg-red-950 text-red-200 text-[9px] flex-1 rounded px-0 py-0.5 border-0 font-mono"
//                                   value={coin.rightValue || ""}
//                                   onClick={e => e.stopPropagation()}
//                                   onChange={e => updateCoin(pos, "rightValue", e.target.value)}>
//                                   <option value="">--</option>
//                                   {COMBO_COIN_VALUES.map(v => <option key={v} value={v} className="bg-gray-800">{v}</option>)}
//                                 </select>
//                               </div>
//                             </>
//                           ) : (
//                             <select
//                               className="bg-gray-800 text-white text-[9px] w-full rounded px-0.5 py-0.5 border-0 font-mono"
//                               value={coin.value}
//                               onClick={e => e.stopPropagation()}
//                               onChange={e => updateCoin(pos, "value", e.target.value)}>
//                               {COMBO_COIN_VALUES.map(v => (
//                                 <option key={v} value={v} className="bg-gray-800">{v}</option>
//                               ))}
//                             </select>
//                           )}

//                           {/* Ultra boost — single dropdown when no double */}
//                           {config.hasUltra && !config.hasDouble && (
//                             <select
//                               className="bg-purple-950 text-purple-200 text-[9px] w-full rounded px-0.5 py-0.5 border-0 font-mono"
//                               value={coin.boostValue || ""}
//                               onClick={e => e.stopPropagation()}
//                               onChange={e => updateCoin(pos, "boostValue", e.target.value)}>
//                               <option value="">Boost</option>
//                               {ULTRA_BOOST_VALUES.map(v => <option key={v} value={v} className="bg-gray-800">{v}</option>)}
//                             </select>
//                           )}

//                           {/* Ultra boost — LEFT/RIGHT side picker in Double+Ultra combo */}
//                           {config.hasDouble && config.hasUltra && (
//                             <div className="w-full mt-0.5" onClick={e => e.stopPropagation()}>
//                               <div className="flex gap-0.5 w-full items-end">
//                                 {(["LEFT", "RIGHT"] as const).map(side => {
//                                   const isThis  = coin.boostSide === side;
//                                   const locked  = !!(coin.boostSide && coin.boostSide !== side);
//                                   return (
//                                     <div key={side} className="flex flex-col items-center flex-1 gap-0">
//                                       <span className={`text-[7px] font-mono ${isThis ? "text-yellow-300" : "text-gray-500"}`}>{side}</span>
//                                       <select
//                                         disabled={locked}
//                                         className={`text-[8px] w-full rounded px-0 py-0.5 border-0 font-mono
//                                           ${isThis ? "bg-yellow-700 text-yellow-100" : "bg-purple-950 text-purple-200"}
//                                           ${locked ? "opacity-30 cursor-not-allowed" : ""}`}
//                                         value={isThis ? (coin.boostValue || "") : ""}
//                                         onChange={e => setBoostSide(pos, side, e.target.value)}>
//                                         <option value="">--</option>
//                                         {ULTRA_BOOST_VALUES.map(v => <option key={v} value={v} className="bg-gray-800">{v}</option>)}
//                                       </select>
//                                     </div>
//                                   );
//                                 })}
//                                 {coin.boostSide && (
//                                   <button
//                                     className="text-red-400 hover:text-red-200 text-[8px] pb-0.5 ml-0.5"
//                                     onClick={e => { e.stopPropagation(); updateCoin(pos, "boostValue", ""); updateCoin(pos, "boostSide", null); }}>✕</button>
//                                 )}
//                               </div>
//                             </div>
//                           )}

//                           {/* Feature upgrade radio */}
//                           <div className="flex items-center gap-1 mt-0.5 w-full" onClick={e => e.stopPropagation()}>
//                             <input
//                               type="radio" name="comboUpgrade"
//                               className="accent-yellow-400 w-3 h-3 cursor-pointer"
//                               checked={upgradePos === pos}
//                               onChange={() => handleUpgradeRadio(pos)}
//                             />
//                             <span className="text-[8px] text-yellow-300 font-mono">upgrade</span>
//                             {upgradePos === pos && !isAllColor && upgradeFeatSel && (
//                               <span className="text-[8px] text-yellow-500 font-mono">→{upgradeFeatSel}</span>
//                             )}
//                             {upgradePos === pos && isAllColor && upgradeMultiSel.size > 0 && (
//                               <span className="text-[8px] text-yellow-500 font-mono">→{Array.from(upgradeMultiSel).join("+")}</span>
//                             )}
//                           </div>

//                           {/* Remove — non-base coins only */}
//                           {!coin.fromBase && (
//                             <button
//                               onClick={e => { e.stopPropagation(); removeCoin(pos); }}
//                               className="absolute top-1 right-1 text-[10px] text-red-300 hover:text-red-100 font-bold">✕</button>
//                           )}

//                         </div>
//                       ) : (
//                         <span className="text-white/40 text-[10px] mx-auto mt-4">+ Add</span>
//                       )}
//                     </div>
//                   </div>
//                 );
//               })
//             )}
//           </div>

//           {/* LEGEND */}
//           <div className="text-[10px] text-gray-500 font-mono flex flex-wrap gap-2">
//             <span>🟡 = coin · click empty cell to add · ✕ = remove</span>
//             {config.hasDouble && <span>L← / R→ = LEFT / RIGHT coin values</span>}
//             {config.hasUltra && !config.hasDouble && <span>Boost = ultra boost value</span>}
//             {config.hasDouble && config.hasUltra && <span>L/R boost = side the boost applies to · ✕ to clear side</span>}
//             {config.hasZone && <span>Background = zone regions (splitter {config.splitter})</span>}
//             <span>✦ radio = upgrade · single-color = 1 feature · AllColor = multi-feature</span>
//           </div>

//         </div>
//       )}
//     </div>
//   );
// }

// // // //?new latest 
// // /* eslint-disable @typescript-eslint/no-explicit-any */
// // "use client";

// // import { useState, useRef } from "react";
// // import {
// //   ComboCoin, ComboFeatureConfig,
// //   getComboMaxSpins, getComboCoinColors,
// //   generateCombinationGaffe, resolveUpgradeFeatures, UpgradeInfo,
// // } from "./combinationFeatureGenerator";
// // import { ZONE_BG_CLASS, ZONE_BORDER_CLASS, getZoneBgColor } from "./zoneFeatureGenerator";
// // import { ULTRA_BOOST_VALUES } from "./ultraFeatureGenerator";
// // import { posToMetric, ALL_UPGRADE_FEATURES } from "./config";

// // // ── Constants ─────────────────────────────────────────────────────────────────
// // // Fix #5: uppercase coin values
// // const COMBO_COIN_VALUES = ["100", "250", "500", "MINOR", "MAJOR", "MINI"];

// // const FEATURE_BADGE: Record<string, string> = {
// //   double: "bg-red-900 text-red-300 border border-red-600",
// //   extra:  "bg-emerald-900 text-emerald-300 border border-emerald-600",
// //   zone:   "bg-sky-900 text-sky-300 border border-sky-600",
// //   ultra:  "bg-purple-900 text-purple-300 border border-purple-600",
// // };

// // // ── Props ─────────────────────────────────────────────────────────────────────
// // type Props = {
// //   baseCoins: ComboCoin[];
// //   config:    ComboFeatureConfig;
// //   onSpin:    (snapshot: ComboCoin[], line: string) => void;
// //   onReset:   () => void;
// //   onUpgrade: (newFeatures: string[], carryCoins: ComboCoin[]) => void;
// // };

// // // ── Component ─────────────────────────────────────────────────────────────────
// // export default function CombinationFeature({ baseCoins, config, onSpin, onReset, onUpgrade }: Props) {
// //   const MAX_SPINS  = getComboMaxSpins(config);
// //   const coinColors = getComboCoinColors(config.features);
// //   const defaultCode = coinColors[0].value;

// //   const [isOpen,    setIsOpen]    = useState(true);
// //   const initialSeeds = baseCoins.map(c => ({ ...c, fromBase: true }));
// //   const [coins,     setCoins]     = useState<ComboCoin[]>(initialSeeds);
// //   const [spinsLeft, setSpinsLeft] = useState(MAX_SPINS);
// //   const lastSpinPositions = useRef<Set<number>>(new Set(initialSeeds.map(c => c.position)));

// //   // Upgrade state
// //   const [upgradePos,      setUpgradePos]      = useState<number | null>(null);
// //   const [upgradeFeatSel,  setUpgradeFeatSel]  = useState<string>("");
// //   const [upgradeMultiSel, setUpgradeMultiSel] = useState<Set<string>>(new Set());

// //   const coinAt = (pos: number) => coins.find(c => c.position === pos);

// //   // ── Coin operations ──────────────────────────────────────────────────────
// //   const handleCellClick = (pos: number) => {
// //     if (coinAt(pos)) return;
// //     setCoins(prev => [...prev, {
// //       position: pos, colorCode: defaultCode, value: COMBO_COIN_VALUES[0],
// //       leftValue: "", rightValue: "", boostValue: "", boostSide: null,
// //     }]);
// //   };

// //   const removeCoin = (pos: number) => {
// //     const c = coinAt(pos);
// //     if (!c || c.fromBase) return;
// //     if (upgradePos === pos) {
// //       setUpgradePos(null); setUpgradeFeatSel(""); setUpgradeMultiSel(new Set());
// //     }
// //     setCoins(prev => prev.filter(x => x.position !== pos));
// //   };

// //   const updateCoin = (pos: number, field: keyof ComboCoin, val: any) =>
// //     setCoins(prev => prev.map(c => c.position === pos ? { ...c, [field]: val } : c));

// //   const setBoostSide = (pos: number, side: "LEFT" | "RIGHT", boostVal: string) => {
// //     setCoins(prev => prev.map(c => {
// //       if (c.position !== pos) return c;
// //       if (!boostVal) return { ...c, boostValue: "", boostSide: null };
// //       return { ...c, boostValue: boostVal, boostSide: side };
// //     }));
// //   };

// //   // ── Upgrade radio ────────────────────────────────────────────────────────
// //   const handleUpgradeRadio = (pos: number) => {
// //     if (upgradePos === pos) {
// //       setUpgradePos(null); setUpgradeFeatSel(""); setUpgradeMultiSel(new Set()); return;
// //     }
// //     setUpgradePos(pos); setUpgradeFeatSel(""); setUpgradeMultiSel(new Set());
// //   };

// //   const upgradeCoinn = upgradePos !== null ? coinAt(upgradePos) : null;

// //   // AllColor = the coin whose label starts with "AllColor" in this combo's palette
// //   const allColorEntry = coinColors.find(c => c.label.startsWith("AllColor"));
// //   const isAllColor = !!(upgradeCoinn && allColorEntry && upgradeCoinn.colorCode === allColorEntry.value);

// //   // Gold coins (label starts with "Gold") have no upgrade
// //   const goldCodes = new Set(coinColors.filter(c => c.label.startsWith("Gold")).map(c => c.value));

// //   const upgradeOptions: string[] = (() => {
// //     if (!upgradeCoinn) return [];
// //     // Gold coins never upgrade
// //     if (goldCodes.has(upgradeCoinn.colorCode)) return [];
// //     const activeFeaturesUpper = config.features.map(f => f.toUpperCase());
// //     if (isAllColor) {
// //       return ALL_UPGRADE_FEATURES.filter(f => !activeFeaturesUpper.includes(f));
// //     }
// //     return resolveUpgradeFeatures(upgradeCoinn.colorCode).filter(f => !activeFeaturesUpper.includes(f));
// //   })();

// //   const toggleMulti = (f: string) => {
// //     setUpgradeMultiSel(prev => {
// //       const next = new Set(prev);
// //       if (next.has(f)) next.delete(f); else next.add(f);
// //       return next;
// //     });
// //   };

// //   // The currently selected upgrade features (for the inline-confirm flow)
// //   const selectedUpgradeFeats: string[] = isAllColor
// //     ? Array.from(upgradeMultiSel)
// //     : upgradeFeatSel ? [upgradeFeatSel] : [];

// //   const canConfirmUpgrade = upgradePos !== null && selectedUpgradeFeats.length > 0;

// //   // ── Confirm upgrade inline — generates gaffe + navigates in one click ────
// //   const handleConfirmUpgrade = () => {
// //     if (!canConfirmUpgrade || upgradePos === null) return;

// //     // Build upgrade info
// //     const upgrade: UpgradeInfo = {
// //       col: Math.floor(upgradePos / 3),
// //       row: upgradePos % 3,
// //       features: selectedUpgradeFeats,
// //     };

// //     // Emit spin line with upgrade baked in
// //     const line = generateCombinationGaffe(coins, config, upgrade);
// //     onSpin(coins, line);

// //     // Navigate immediately to the new combo
// //     const newFeatures = [...new Set([...config.features, ...upgrade.features.map(f => f.toLowerCase())])];
// //     onUpgrade(newFeatures, coins);
// //   };

// //   // ── Spin ─────────────────────────────────────────────────────────────────
// //   const handleSpin = () => {
// //     if (spinsLeft <= 0) return;
// //     const cur = new Set(coins.map(c => c.position));
// //     const hasNew = [...cur].some(p => !lastSpinPositions.current.has(p));
// //     setSpinsLeft(hasNew ? MAX_SPINS : spinsLeft - 1);
// //     lastSpinPositions.current = cur;

// //     const line = generateCombinationGaffe(coins, config, null);
// //     onSpin(coins, line);
// //   };

// //   const resetFeature = () => {
// //     const seeded = baseCoins.map(c => ({ ...c, fromBase: true }));
// //     setCoins(seeded);
// //     setSpinsLeft(MAX_SPINS);
// //     lastSpinPositions.current = new Set(seeded.map(c => c.position));
// //     setUpgradePos(null); setUpgradeFeatSel(""); setUpgradeMultiSel(new Set());
// //     onReset();
// //   };

// //   const activeSplitter = config.hasZone ? (config.splitter ?? 1) : 0;
// //   const filled14 = coins.length >= 14 && (config.hasExtra || config.hasUltra);
// //   const cellMinH = config.hasDouble && config.hasUltra ? 150
// //                  : config.hasDouble                    ? 120
// //                  : config.hasUltra                     ? 110
// //                  : 100;

// //   return (
// //     <div className="bg-gray-800 rounded-xl border border-indigo-800">

// //       {/* HEADER */}
// //       <div onClick={() => setIsOpen(!isOpen)} className="flex justify-between items-center p-4 cursor-pointer select-none">
// //         <div className="flex items-center gap-2 flex-wrap">
// //           <h2 className="text-lg font-semibold text-white font-mono">⚡ Combination Feature</h2>
// //           {config.features.map(name => (
// //             <span key={name} className={`text-xs px-2 py-0.5 rounded capitalize font-mono ${FEATURE_BADGE[name] ?? "bg-gray-700 text-gray-300"}`}>
// //               {name}
// //             </span>
// //           ))}
// //           {config.hasZone && config.splitter && (
// //             <span className="text-xs px-2 py-0.5 rounded bg-sky-900 text-sky-300 border border-sky-700 font-mono">
// //               Splitter {config.splitter}
// //             </span>
// //           )}
// //         </div>
// //         <span className="text-gray-400">{isOpen ? "▼" : "▶"}</span>
// //       </div>

// //       {isOpen && (
// //         <div className="p-4 pt-0 flex flex-col gap-3">

// //           {/* SPIN CONTROLS */}
// //           <div className="flex items-center gap-3 flex-wrap">
// //             <button onClick={handleSpin} disabled={spinsLeft <= 0}
// //               className={`px-6 py-2 rounded font-bold text-white font-mono transition-all ${spinsLeft > 0 ? "bg-indigo-600 hover:bg-indigo-500" : "bg-gray-600 cursor-not-allowed opacity-50"}`}>
// //               SPIN
// //             </button>
// //             <span className="text-sm text-gray-400 font-mono">
// //               {spinsLeft} spin{spinsLeft !== 1 ? "s" : ""}
// //               {config.hasExtra && <span className="ml-1 text-emerald-400 text-xs">(4 — Extra)</span>}
// //             </span>
// //             <button onClick={resetFeature} className="px-3 py-1 bg-gray-600 hover:bg-gray-500 rounded text-sm">Reset</button>
// //             {filled14 && <span className="text-yellow-400 text-xs font-mono bg-yellow-900/40 px-2 py-0.5 rounded border border-yellow-700">⚠ 14 filled → lastPositionReel</span>}
// //           </div>

// //           {/* Double+Ultra info */}
// //           {config.hasDouble && config.hasUltra && (
// //             <div className="text-xs text-purple-300 font-mono bg-purple-900/30 px-3 py-1.5 rounded border border-purple-800">
// //               Double+Ultra: select boost on LEFT or RIGHT side per coin — choosing one locks the other. ✕ to clear.
// //             </div>
// //           )}

// //           {/* UPGRADE COIN SELECTED — feature picker + single Confirm button */}
// //           {upgradePos !== null && upgradeOptions.length > 0 && (
// //             <div className="flex flex-col gap-2 bg-yellow-900/20 border border-yellow-800 rounded-lg p-2">
// //               <span className="text-yellow-300 text-xs font-mono">
// //                 Upgrade {posToMetric(upgradePos)} →
// //                 {isAllColor ? " AllColor coin: select one or more features" : " select feature to add"}
// //               </span>
// //               {isAllColor ? (
// //                 <div className="flex gap-2 flex-wrap">
// //                   {upgradeOptions.map(f => (
// //                     <label key={f} className="flex items-center gap-1 cursor-pointer bg-yellow-900/40 border border-yellow-700 rounded px-2 py-1">
// //                       <input type="checkbox" className="accent-yellow-400 w-3 h-3"
// //                         checked={upgradeMultiSel.has(f)} onChange={() => toggleMulti(f)} />
// //                       <span className="text-yellow-100 text-xs font-mono">{f}</span>
// //                     </label>
// //                   ))}
// //                 </div>
// //               ) : (
// //                 <select className="bg-yellow-900 text-yellow-100 text-xs rounded px-2 py-1 font-mono border border-yellow-700 self-start"
// //                   value={upgradeFeatSel} onChange={e => setUpgradeFeatSel(e.target.value)}>
// //                   <option value="">Select feature...</option>
// //                   {upgradeOptions.map(f => <option key={f} value={f}>{f}</option>)}
// //                 </select>
// //               )}
// //               {canConfirmUpgrade && (
// //                 <button
// //                   onClick={handleConfirmUpgrade}
// //                   className="self-start px-4 py-1.5 bg-yellow-600 hover:bg-yellow-500 rounded font-bold text-sm font-mono transition-all">
// //                   ✦ Confirm → Go to {[...config.features, ...selectedUpgradeFeats.map(f => f.toLowerCase())]
// //                     .filter((v, i, a) => a.indexOf(v) === i).join(" + ")}
// //                 </button>
// //               )}
// //             </div>
// //           )}
// //           {upgradePos !== null && upgradeOptions.length === 0 && (
// //             <div className="text-xs text-gray-500 font-mono bg-gray-700 px-3 py-1.5 rounded">
// //               ℹ No upgrades available (all features already active or coin color doesn&apos;t support)
// //             </div>
// //           )}

// //           {/* GRID — 5 cols × 3 rows, column-major */}
// //           <div className="grid gap-1" style={{ gridTemplateColumns: "repeat(5, minmax(0, 1fr))" }}>
// //             {Array.from({ length: 3 }).map((_, row) =>
// //               Array.from({ length: 5 }).map((_, col) => {
// //                 const pos  = col * 3 + row;
// //                 const coin = coinAt(pos);

// //                 const zoneBg  = config.hasZone ? getZoneBgColor(pos, activeSplitter) : null;
// //                 const cellBg  = zoneBg
// //                   ? `${ZONE_BG_CLASS[zoneBg]} ${ZONE_BORDER_CLASS[zoneBg]}`
// //                   : "bg-gray-700 border-gray-600";
// //                 const hoverCls = !coin && !config.hasZone ? "hover:bg-gray-600 hover:border-gray-400" : "";

// //                 return (
// //                   <div key={pos} className="flex flex-col gap-1">
// //                     <div
// //                       onClick={() => !coin && handleCellClick(pos)}
// //                       className={`relative rounded-lg border-2 flex flex-col items-start p-1 text-xs text-white cursor-pointer transition-all hover:brightness-110 ${cellBg} ${hoverCls}`}
// //                       style={{ minHeight: cellMinH }}
// //                     >
// //                       <div className="flex justify-between w-full text-[9px] opacity-40 mb-0.5">
// //                         <span>{pos}</span>
// //                         <span className="font-mono">{posToMetric(pos)}</span>
// //                       </div>

// //                       {coin ? (
// //                         <div className="flex flex-col items-center w-full gap-0.5">

// //                           <div className="text-sm">🟡</div>

// //                           {/* Color dropdown */}
// //                           <select
// //                             className="bg-gray-800 text-white text-[9px] w-full rounded px-0.5 py-0.5 border-0 font-mono"
// //                             value={coin.colorCode}
// //                             onClick={e => e.stopPropagation()}
// //                             onChange={e => updateCoin(pos, "colorCode", Number(e.target.value))}
// //                           >
// //                             {coinColors.map(c => (
// //                               <option key={c.value} value={c.value} className="bg-gray-800">{c.label}</option>
// //                             ))}
// //                           </select>

// //                           {/* Value — Double: LEFT+RIGHT; others: single */}
// //                           {config.hasDouble ? (
// //                             <>
// //                               <div className="flex items-center gap-0.5 w-full">
// //                                 <span className="text-[7px] text-red-300 font-mono w-4 shrink-0">←L</span>
// //                                 <select className="bg-red-950 text-red-200 text-[9px] flex-1 rounded px-0 py-0.5 border-0 font-mono"
// //                                   value={coin.leftValue || ""}
// //                                   onClick={e => e.stopPropagation()}
// //                                   onChange={e => updateCoin(pos, "leftValue", e.target.value)}>
// //                                   <option value="">--</option>
// //                                   {COMBO_COIN_VALUES.map(v => <option key={v} value={v} className="bg-gray-800">{v}</option>)}
// //                                 </select>
// //                               </div>
// //                               <div className="flex items-center gap-0.5 w-full">
// //                                 <span className="text-[7px] text-red-300 font-mono w-4 shrink-0">R→</span>
// //                                 <select className="bg-red-950 text-red-200 text-[9px] flex-1 rounded px-0 py-0.5 border-0 font-mono"
// //                                   value={coin.rightValue || ""}
// //                                   onClick={e => e.stopPropagation()}
// //                                   onChange={e => updateCoin(pos, "rightValue", e.target.value)}>
// //                                   <option value="">--</option>
// //                                   {COMBO_COIN_VALUES.map(v => <option key={v} value={v} className="bg-gray-800">{v}</option>)}
// //                                 </select>
// //                               </div>
// //                             </>
// //                           ) : (
// //                             <select
// //                               className="bg-gray-800 text-white text-[9px] w-full rounded px-0.5 py-0.5 border-0 font-mono"
// //                               value={coin.value}
// //                               onClick={e => e.stopPropagation()}
// //                               onChange={e => updateCoin(pos, "value", e.target.value)}>
// //                               {COMBO_COIN_VALUES.map(v => (
// //                                 <option key={v} value={v} className="bg-gray-800">{v}</option>
// //                               ))}
// //                             </select>
// //                           )}

// //                           {/* Ultra boost — single dropdown when no double */}
// //                           {config.hasUltra && !config.hasDouble && (
// //                             <select
// //                               className="bg-purple-950 text-purple-200 text-[9px] w-full rounded px-0.5 py-0.5 border-0 font-mono"
// //                               value={coin.boostValue || ""}
// //                               onClick={e => e.stopPropagation()}
// //                               onChange={e => updateCoin(pos, "boostValue", e.target.value)}>
// //                               <option value="">Boost</option>
// //                               {ULTRA_BOOST_VALUES.map(v => <option key={v} value={v} className="bg-gray-800">{v}</option>)}
// //                             </select>
// //                           )}

// //                           {/* Ultra boost — LEFT/RIGHT side picker in Double+Ultra combo */}
// //                           {config.hasDouble && config.hasUltra && (
// //                             <div className="w-full mt-0.5" onClick={e => e.stopPropagation()}>
// //                               <div className="flex gap-0.5 w-full items-end">
// //                                 {(["LEFT", "RIGHT"] as const).map(side => {
// //                                   const isThis  = coin.boostSide === side;
// //                                   const locked  = !!(coin.boostSide && coin.boostSide !== side);
// //                                   return (
// //                                     <div key={side} className="flex flex-col items-center flex-1 gap-0">
// //                                       <span className={`text-[7px] font-mono ${isThis ? "text-yellow-300" : "text-gray-500"}`}>{side}</span>
// //                                       <select
// //                                         disabled={locked}
// //                                         className={`text-[8px] w-full rounded px-0 py-0.5 border-0 font-mono
// //                                           ${isThis ? "bg-yellow-700 text-yellow-100" : "bg-purple-950 text-purple-200"}
// //                                           ${locked ? "opacity-30 cursor-not-allowed" : ""}`}
// //                                         value={isThis ? (coin.boostValue || "") : ""}
// //                                         onChange={e => setBoostSide(pos, side, e.target.value)}>
// //                                         <option value="">--</option>
// //                                         {ULTRA_BOOST_VALUES.map(v => <option key={v} value={v} className="bg-gray-800">{v}</option>)}
// //                                       </select>
// //                                     </div>
// //                                   );
// //                                 })}
// //                                 {coin.boostSide && (
// //                                   <button
// //                                     className="text-red-400 hover:text-red-200 text-[8px] pb-0.5 ml-0.5"
// //                                     onClick={e => { e.stopPropagation(); updateCoin(pos, "boostValue", ""); updateCoin(pos, "boostSide", null); }}>✕</button>
// //                                 )}
// //                               </div>
// //                             </div>
// //                           )}

// //                           {/* Feature upgrade radio */}
// //                           <div className="flex items-center gap-1 mt-0.5 w-full" onClick={e => e.stopPropagation()}>
// //                             <input
// //                               type="radio" name="comboUpgrade"
// //                               className="accent-yellow-400 w-3 h-3 cursor-pointer"
// //                               checked={upgradePos === pos}
// //                               onChange={() => handleUpgradeRadio(pos)}
// //                             />
// //                             <span className="text-[8px] text-yellow-300 font-mono">upgrade</span>
// //                             {upgradePos === pos && !isAllColor && upgradeFeatSel && (
// //                               <span className="text-[8px] text-yellow-500 font-mono">→{upgradeFeatSel}</span>
// //                             )}
// //                             {upgradePos === pos && isAllColor && upgradeMultiSel.size > 0 && (
// //                               <span className="text-[8px] text-yellow-500 font-mono">→{Array.from(upgradeMultiSel).join("+")}</span>
// //                             )}
// //                           </div>

// //                           {/* Remove — non-base coins only */}
// //                           {!coin.fromBase && (
// //                             <button
// //                               onClick={e => { e.stopPropagation(); removeCoin(pos); }}
// //                               className="absolute top-1 right-1 text-[10px] text-red-300 hover:text-red-100 font-bold">✕</button>
// //                           )}

// //                         </div>
// //                       ) : (
// //                         <span className="text-white/40 text-[10px] mx-auto mt-4">+ Add</span>
// //                       )}
// //                     </div>
// //                   </div>
// //                 );
// //               })
// //             )}
// //           </div>

// //           {/* LEGEND */}
// //           <div className="text-[10px] text-gray-500 font-mono flex flex-wrap gap-2">
// //             <span>🟡 = coin · click empty cell to add · ✕ = remove</span>
// //             {config.hasDouble && <span>L← / R→ = LEFT / RIGHT coin values</span>}
// //             {config.hasUltra && !config.hasDouble && <span>Boost = ultra boost value</span>}
// //             {config.hasDouble && config.hasUltra && <span>L/R boost = side the boost applies to · ✕ to clear side</span>}
// //             {config.hasZone && <span>Background = zone regions (splitter {config.splitter})</span>}
// //             <span>✦ radio = upgrade · single-color = 1 feature · AllColor = multi-feature</span>
// //           </div>

// //         </div>
// //       )}
// //     </div>
// //   );
// // }



// /* eslint-disable @typescript-eslint/no-explicit-any */
// "use client";

// import { useState, useRef } from "react";
// import {
//   ComboCoin, ComboFeatureConfig,
//   getComboMaxSpins, getComboCoinColors,
//   generateCombinationGaffe, resolveUpgradeFeatures, UpgradeInfo,
// } from "./combinationFeatureGenerator";
// import { ZONE_BG_CLASS, ZONE_BORDER_CLASS, getZoneBgColor } from "./zoneFeatureGenerator";
// import { ULTRA_BOOST_VALUES } from "./ultraFeatureGenerator";
// import { posToMetric, ALL_UPGRADE_FEATURES } from "./config";

// // ── Constants ─────────────────────────────────────────────────────────────────
// // Fix #5: uppercase coin values
// const COMBO_COIN_VALUES = ["1", "2", "5", "MINOR", "MAJOR", "MINI"];

// const FEATURE_BADGE: Record<string, string> = {
//   double: "bg-red-900 text-red-300 border border-red-600",
//   extra:  "bg-emerald-900 text-emerald-300 border border-emerald-600",
//   zone:   "bg-sky-900 text-sky-300 border border-sky-600",
//   ultra:  "bg-purple-900 text-purple-300 border border-purple-600",
// };

// // ── Props ─────────────────────────────────────────────────────────────────────
// type Props = {
//   baseCoins:          ComboCoin[];
//   config:             ComboFeatureConfig;
//   pendingUpgradeInfo: UpgradeInfo | null;   // carried from single-feature upgrade
//   onSpin:             (snapshot: ComboCoin[], line: string) => void;
//   onReset:            () => void;
//   onUpgrade:          (newFeatures: string[], carryCoins: ComboCoin[], upgradeInfo: UpgradeInfo) => void;
// };

// // ── Component ─────────────────────────────────────────────────────────────────
// export default function CombinationFeature({ baseCoins, config, pendingUpgradeInfo, onSpin, onReset, onUpgrade }: Props) {
//   const MAX_SPINS  = getComboMaxSpins(config);
//   const coinColors = getComboCoinColors(config.features);
//   const defaultCode = coinColors[0].value;

//   const [isOpen,    setIsOpen]    = useState(true);
//   const initialSeeds = baseCoins.map(c => ({ ...c, fromBase: true }));
//   const [coins,     setCoins]     = useState<ComboCoin[]>(initialSeeds);
//   const [spinsLeft, setSpinsLeft] = useState(MAX_SPINS);
//   const lastSpinPositions = useRef<Set<number>>(new Set(initialSeeds.map(c => c.position)));

//   // Upgrade state
//   const [upgradePos,      setUpgradePos]      = useState<number | null>(null);
//   const [upgradeFeatSel,  setUpgradeFeatSel]  = useState<string>("");
//   const [upgradeMultiSel, setUpgradeMultiSel] = useState<Set<string>>(new Set());

//   const coinAt = (pos: number) => coins.find(c => c.position === pos);

//   // ── Coin operations ──────────────────────────────────────────────────────
//   const handleCellClick = (pos: number) => {
//     if (coinAt(pos)) return;
//     setCoins(prev => [...prev, {
//       position: pos, colorCode: defaultCode, value: COMBO_COIN_VALUES[0],
//       leftValue: "", rightValue: "", boostValue: "", boostSide: null,
//     }]);
//   };

//   const removeCoin = (pos: number) => {
//     const c = coinAt(pos);
//     if (!c || c.fromBase) return;
//     if (upgradePos === pos) {
//       setUpgradePos(null); setUpgradeFeatSel(""); setUpgradeMultiSel(new Set());
//     }
//     setCoins(prev => prev.filter(x => x.position !== pos));
//   };

//   const updateCoin = (pos: number, field: keyof ComboCoin, val: any) =>
//     setCoins(prev => prev.map(c => c.position === pos ? { ...c, [field]: val } : c));

//   const setBoostSide = (pos: number, side: "LEFT" | "RIGHT", boostVal: string) => {
//     setCoins(prev => prev.map(c => {
//       if (c.position !== pos) return c;
//       if (!boostVal) return { ...c, boostValue: "", boostSide: null };
//       return { ...c, boostValue: boostVal, boostSide: side };
//     }));
//   };

//   // ── Upgrade radio ────────────────────────────────────────────────────────
//   const handleUpgradeRadio = (pos: number) => {
//     if (upgradePos === pos) {
//       setUpgradePos(null); setUpgradeFeatSel(""); setUpgradeMultiSel(new Set()); return;
//     }
//     setUpgradePos(pos); setUpgradeFeatSel(""); setUpgradeMultiSel(new Set());
//   };

//   const upgradeCoinn = upgradePos !== null ? coinAt(upgradePos) : null;

//   // AllColor = the coin whose label starts with "AllColor" in this combo's palette
//   const allColorEntry = coinColors.find(c => c.label.startsWith("AllColor"));
//   const isAllColor = !!(upgradeCoinn && allColorEntry && upgradeCoinn.colorCode === allColorEntry.value);

//   // Gold coins (label starts with "Gold") have no upgrade
//   const goldCodes = new Set(coinColors.filter(c => c.label.startsWith("Gold")).map(c => c.value));

//   const upgradeOptions: string[] = (() => {
//     if (!upgradeCoinn) return [];
//     // Gold coins never upgrade
//     if (goldCodes.has(upgradeCoinn.colorCode)) return [];
//     const activeFeaturesUpper = config.features.map(f => f.toUpperCase());
//     if (isAllColor) {
//       return ALL_UPGRADE_FEATURES.filter(f => !activeFeaturesUpper.includes(f));
//     }
//     return resolveUpgradeFeatures(upgradeCoinn.colorCode).filter(f => !activeFeaturesUpper.includes(f));
//   })();

//   const toggleMulti = (f: string) => {
//     setUpgradeMultiSel(prev => {
//       const next = new Set(prev);
//       if (next.has(f)) next.delete(f); else next.add(f);
//       return next;
//     });
//   };

//   // The currently selected upgrade features (for combo-internal upgrade)
//   const selectedUpgradeFeats: string[] = isAllColor
//     ? Array.from(upgradeMultiSel)
//     : upgradeFeatSel ? [upgradeFeatSel] : [];

//   // Navigate immediately when upgrade feature selected in combo
//   const navigateComboUpgrade = (feats: string[]) => {
//     if (!upgradePos || feats.length === 0) return;
//     const upgradeInfo: UpgradeInfo = { col: Math.floor(upgradePos/3), row: upgradePos%3, features: feats };
//     const newFeatures = [...new Set([...config.features, ...feats.map(f => f.toLowerCase())])];
//     onUpgrade(newFeatures, coins, upgradeInfo);
//   };

//   // ── Spin ─────────────────────────────────────────────────────────────────
//   // Uses pendingUpgradeInfo (from single-feature upgrade) on first spin, then it's cleared by parent
//   const handleSpin = () => {
//     if (spinsLeft <= 0) return;
//     const cur = new Set(coins.map(c => c.position));
//     const hasNew = [...cur].some(p => !lastSpinPositions.current.has(p));
//     setSpinsLeft(hasNew ? MAX_SPINS : spinsLeft - 1);
//     lastSpinPositions.current = cur;

//     const line = generateCombinationGaffe(coins, config, pendingUpgradeInfo ?? null);
//     onSpin(coins, line);   // parent clears pendingUpgradeInfo after this
//   };

//   const resetFeature = () => {
//     const seeded = baseCoins.map(c => ({ ...c, fromBase: true }));
//     setCoins(seeded);
//     setSpinsLeft(MAX_SPINS);
//     lastSpinPositions.current = new Set(seeded.map(c => c.position));
//     setUpgradePos(null); setUpgradeFeatSel(""); setUpgradeMultiSel(new Set());
//     onReset();
//   };

//   const activeSplitter = config.hasZone ? (config.splitter ?? 1) : 0;
//   const filled14 = coins.length >= 14 && (config.hasExtra || config.hasUltra);
//   const cellMinH = config.hasDouble && config.hasUltra ? 150
//                  : config.hasDouble                    ? 120
//                  : config.hasUltra                     ? 110
//                  : 100;

//   return (
//     <div className="bg-gray-800 rounded-xl border border-indigo-800">

//       {/* HEADER */}
//       <div onClick={() => setIsOpen(!isOpen)} className="flex justify-between items-center p-4 cursor-pointer select-none">
//         <div className="flex items-center gap-2 flex-wrap">
//           <h2 className="text-lg font-semibold text-white font-mono">⚡ Combination Feature</h2>
//           {config.features.map(name => (
//             <span key={name} className={`text-xs px-2 py-0.5 rounded capitalize font-mono ${FEATURE_BADGE[name] ?? "bg-gray-700 text-gray-300"}`}>
//               {name}
//             </span>
//           ))}
//           {config.hasZone && config.splitter && (
//             <span className="text-xs px-2 py-0.5 rounded bg-sky-900 text-sky-300 border border-sky-700 font-mono">
//               Splitter {config.splitter}
//             </span>
//           )}
//           {pendingUpgradeInfo && (
//             <span className="text-xs px-2 py-0.5 rounded bg-yellow-900 text-yellow-300 border border-yellow-700 font-mono animate-pulse">
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
//             <button onClick={handleSpin} disabled={spinsLeft <= 0}
//               className={`px-6 py-2 rounded font-bold text-white font-mono transition-all ${spinsLeft > 0 ? "bg-indigo-600 hover:bg-indigo-500" : "bg-gray-600 cursor-not-allowed opacity-50"}`}>
//               SPIN
//             </button>
//             <span className="text-sm text-gray-400 font-mono">
//               {spinsLeft} spin{spinsLeft !== 1 ? "s" : ""}
//               {config.hasExtra && <span className="ml-1 text-emerald-400 text-xs">(4 — Extra)</span>}
//             </span>
//             <button onClick={resetFeature} className="px-3 py-1 bg-gray-600 hover:bg-gray-500 rounded text-sm">Reset</button>
//             {filled14 && <span className="text-yellow-400 text-xs font-mono bg-yellow-900/40 px-2 py-0.5 rounded border border-yellow-700">⚠ 14 filled → lastPositionReel</span>}
//           </div>

//           {/* Double+Ultra info */}
//           {config.hasDouble && config.hasUltra && (
//             <div className="text-xs text-purple-300 font-mono bg-purple-900/30 px-3 py-1.5 rounded border border-purple-800">
//               Double+Ultra: select boost on LEFT or RIGHT side per coin — choosing one locks the other. ✕ to clear.
//             </div>
//           )}

//           {/* UPGRADE COIN SELECTED — select feature → navigate immediately */}
//           {upgradePos !== null && upgradeOptions.length > 0 && (
//             <div className="flex flex-col gap-2 bg-yellow-900/20 border border-yellow-800 rounded-lg p-2">
//               <span className="text-yellow-300 text-xs font-mono font-bold">
//                 ✦ Upgrade at {posToMetric(upgradePos)} — select feature to add (navigates immediately):
//               </span>
//               {isAllColor ? (
//                 <div className="flex flex-col gap-2">
//                   <div className="flex gap-2 flex-wrap">
//                     {upgradeOptions.map(f => (
//                       <label key={f} className="flex items-center gap-1 cursor-pointer bg-yellow-900/40 border border-yellow-700 rounded px-2 py-1">
//                         <input type="checkbox" className="accent-yellow-400 w-3 h-3"
//                           checked={upgradeMultiSel.has(f)} onChange={() => toggleMulti(f)} />
//                         <span className="text-yellow-100 text-xs font-mono">{f}</span>
//                       </label>
//                     ))}
//                   </div>
//                   {upgradeMultiSel.size > 0 && (
//                     <button onClick={() => navigateComboUpgrade(Array.from(upgradeMultiSel))}
//                       className="self-start px-3 py-1 bg-yellow-600 hover:bg-yellow-500 rounded text-xs font-mono font-bold transition-all">
//                       → Go to {[...config.features, ...Array.from(upgradeMultiSel).map(f=>f.toLowerCase())].filter((v,i,a)=>a.indexOf(v)===i).join(" + ")}
//                     </button>
//                   )}
//                 </div>
//               ) : (
//                 <div className="flex gap-2 flex-wrap">
//                   {upgradeOptions.map(f => (
//                     <button key={f} onClick={() => navigateComboUpgrade([f])}
//                       className="px-3 py-1.5 bg-yellow-700 hover:bg-yellow-600 border border-yellow-600 rounded text-xs font-mono font-bold transition-all">
//                       → {f}
//                     </button>
//                   ))}
//                 </div>
//               )}
//             </div>
//           )}
//           {upgradePos !== null && upgradeOptions.length === 0 && (
//             <div className="text-xs text-gray-500 font-mono bg-gray-700 px-3 py-1.5 rounded">
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
//                       className={`relative rounded-lg border-2 flex flex-col items-start p-1 text-xs text-white cursor-pointer transition-all hover:brightness-110 ${cellBg} ${hoverCls}`}
//                       style={{ minHeight: cellMinH }}
//                     >
//                       <div className="flex justify-between w-full text-[9px] opacity-40 mb-0.5">
//                         <span>{pos}</span>
//                         <span className="font-mono">{posToMetric(pos)}</span>
//                       </div>

//                       {coin ? (
//                         <div className="flex flex-col items-center w-full gap-0.5">

//                           <div className="text-sm">🟡</div>

//                           {/* Color dropdown */}
//                           <select
//                             className="bg-gray-800 text-white text-[9px] w-full rounded px-0.5 py-0.5 border-0 font-mono"
//                             value={coin.colorCode}
//                             onClick={e => e.stopPropagation()}
//                             onChange={e => updateCoin(pos, "colorCode", Number(e.target.value))}
//                           >
//                             {coinColors.map(c => (
//                               <option key={c.value} value={c.value} className="bg-gray-800">{c.label}</option>
//                             ))}
//                           </select>

//                           {/* Value — Double: LEFT+RIGHT; others: single */}
//                           {config.hasDouble ? (
//                             <>
//                               <div className="flex items-center gap-0.5 w-full">
//                                 <span className="text-[7px] text-red-300 font-mono w-4 shrink-0">←L</span>
//                                 <select className="bg-red-950 text-red-200 text-[9px] flex-1 rounded px-0 py-0.5 border-0 font-mono"
//                                   value={coin.leftValue || ""}
//                                   onClick={e => e.stopPropagation()}
//                                   onChange={e => updateCoin(pos, "leftValue", e.target.value)}>
//                                   <option value="">--</option>
//                                   {COMBO_COIN_VALUES.map(v => <option key={v} value={v} className="bg-gray-800">{v}</option>)}
//                                 </select>
//                               </div>
//                               <div className="flex items-center gap-0.5 w-full">
//                                 <span className="text-[7px] text-red-300 font-mono w-4 shrink-0">R→</span>
//                                 <select className="bg-red-950 text-red-200 text-[9px] flex-1 rounded px-0 py-0.5 border-0 font-mono"
//                                   value={coin.rightValue || ""}
//                                   onClick={e => e.stopPropagation()}
//                                   onChange={e => updateCoin(pos, "rightValue", e.target.value)}>
//                                   <option value="">--</option>
//                                   {COMBO_COIN_VALUES.map(v => <option key={v} value={v} className="bg-gray-800">{v}</option>)}
//                                 </select>
//                               </div>
//                             </>
//                           ) : (
//                             <select
//                               className="bg-gray-800 text-white text-[9px] w-full rounded px-0.5 py-0.5 border-0 font-mono"
//                               value={coin.value}
//                               onClick={e => e.stopPropagation()}
//                               onChange={e => updateCoin(pos, "value", e.target.value)}>
//                               {COMBO_COIN_VALUES.map(v => (
//                                 <option key={v} value={v} className="bg-gray-800">{v}</option>
//                               ))}
//                             </select>
//                           )}

//                           {/* Ultra boost — single dropdown when no double */}
//                           {config.hasUltra && !config.hasDouble && (
//                             <select
//                               className="bg-purple-950 text-purple-200 text-[9px] w-full rounded px-0.5 py-0.5 border-0 font-mono"
//                               value={coin.boostValue || ""}
//                               onClick={e => e.stopPropagation()}
//                               onChange={e => updateCoin(pos, "boostValue", e.target.value)}>
//                               <option value="">Boost</option>
//                               {ULTRA_BOOST_VALUES.map(v => <option key={v} value={v} className="bg-gray-800">{v}</option>)}
//                             </select>
//                           )}

//                           {/* Ultra boost — LEFT/RIGHT side picker in Double+Ultra combo */}
//                           {config.hasDouble && config.hasUltra && (
//                             <div className="w-full mt-0.5" onClick={e => e.stopPropagation()}>
//                               <div className="flex gap-0.5 w-full items-end">
//                                 {(["LEFT", "RIGHT"] as const).map(side => {
//                                   const isThis  = coin.boostSide === side;
//                                   const locked  = !!(coin.boostSide && coin.boostSide !== side);
//                                   return (
//                                     <div key={side} className="flex flex-col items-center flex-1 gap-0">
//                                       <span className={`text-[7px] font-mono ${isThis ? "text-yellow-300" : "text-gray-500"}`}>{side}</span>
//                                       <select
//                                         disabled={locked}
//                                         className={`text-[8px] w-full rounded px-0 py-0.5 border-0 font-mono
//                                           ${isThis ? "bg-yellow-700 text-yellow-100" : "bg-purple-950 text-purple-200"}
//                                           ${locked ? "opacity-30 cursor-not-allowed" : ""}`}
//                                         value={isThis ? (coin.boostValue || "") : ""}
//                                         onChange={e => setBoostSide(pos, side, e.target.value)}>
//                                         <option value="">--</option>
//                                         {ULTRA_BOOST_VALUES.map(v => <option key={v} value={v} className="bg-gray-800">{v}</option>)}
//                                       </select>
//                                     </div>
//                                   );
//                                 })}
//                                 {coin.boostSide && (
//                                   <button
//                                     className="text-red-400 hover:text-red-200 text-[8px] pb-0.5 ml-0.5"
//                                     onClick={e => { e.stopPropagation(); updateCoin(pos, "boostValue", ""); updateCoin(pos, "boostSide", null); }}>✕</button>
//                                 )}
//                               </div>
//                             </div>
//                           )}

//                           {/* Feature upgrade radio */}
//                           <div className="flex items-center gap-1 mt-0.5 w-full" onClick={e => e.stopPropagation()}>
//                             <input
//                               type="radio" name="comboUpgrade"
//                               className="accent-yellow-400 w-3 h-3 cursor-pointer"
//                               checked={upgradePos === pos}
//                               onChange={() => handleUpgradeRadio(pos)}
//                             />
//                             <span className="text-[8px] text-yellow-300 font-mono">upgrade</span>
//                             {upgradePos === pos && !isAllColor && upgradeFeatSel && (
//                               <span className="text-[8px] text-yellow-500 font-mono">→{upgradeFeatSel}</span>
//                             )}
//                             {upgradePos === pos && isAllColor && upgradeMultiSel.size > 0 && (
//                               <span className="text-[8px] text-yellow-500 font-mono">→{Array.from(upgradeMultiSel).join("+")}</span>
//                             )}
//                           </div>

//                           {/* Remove — non-base coins only */}
//                           {!coin.fromBase && (
//                             <button
//                               onClick={e => { e.stopPropagation(); removeCoin(pos); }}
//                               className="absolute top-1 right-1 text-[10px] text-red-300 hover:text-red-100 font-bold">✕</button>
//                           )}

//                         </div>
//                       ) : (
//                         <span className="text-white/40 text-[10px] mx-auto mt-4">+ Add</span>
//                       )}
//                     </div>
//                   </div>
//                 );
//               })
//             )}
//           </div>

//           {/* LEGEND */}
//           <div className="text-[10px] text-gray-500 font-mono flex flex-wrap gap-2">
//             <span>🟡 = coin · click empty cell to add · ✕ = remove</span>
//             {config.hasDouble && <span>L← / R→ = LEFT / RIGHT coin values</span>}
//             {config.hasUltra && !config.hasDouble && <span>Boost = ultra boost value</span>}
//             {config.hasDouble && config.hasUltra && <span>L/R boost = side the boost applies to · ✕ to clear side</span>}
//             {config.hasZone && <span>Background = zone regions (splitter {config.splitter})</span>}
//             <span>✦ radio = upgrade · single-color = 1 feature · AllColor = multi-feature</span>
//           </div>

//         </div>
//       )}
//     </div>
//   );
// }


//! latest wokring code
/* eslint-disable @typescript-eslint/no-explicit-any */
// "use client";

// import { useState, useRef } from "react";
// import {
//   ComboCoin, ComboFeatureConfig,
//   getComboMaxSpins, getComboCoinColors,
//   generateCombinationGaffe, resolveUpgradeFeatures, UpgradeInfo,
// } from "./combinationFeatureGenerator";
// import { ZONE_BG_CLASS, ZONE_BORDER_CLASS, getZoneBgColor } from "./zoneFeatureGenerator";
// import { ULTRA_BOOST_VALUES } from "./ultraFeatureGenerator";
// import { posToMetric, ALL_UPGRADE_FEATURES } from "./config";

// // ── Constants ─────────────────────────────────────────────────────────────────
// // Fix #5: uppercase coin values
// const COMBO_COIN_VALUES = ["100", "250", "500", "MINOR", "MAJOR", "MINI"];

// const FEATURE_BADGE: Record<string, string> = {
//   double: "bg-red-900 text-red-300 border border-red-600",
//   extra:  "bg-emerald-900 text-emerald-300 border border-emerald-600",
//   zone:   "bg-sky-900 text-sky-300 border border-sky-600",
//   ultra:  "bg-purple-900 text-purple-300 border border-purple-600",
// };

// // ── Props ─────────────────────────────────────────────────────────────────────
// type Props = {
//   baseCoins:          ComboCoin[];
//   config:             ComboFeatureConfig;
//   pendingUpgradeInfo: UpgradeInfo | null;   // carried from single-feature upgrade
//   onSpin:             (snapshot: ComboCoin[], line: string) => void;
//   onReset:            () => void;
//   onUpgrade:          (newFeatures: string[], carryCoins: ComboCoin[], upgradeInfo: UpgradeInfo) => void;
// };

// // ── Component ─────────────────────────────────────────────────────────────────
// export default function CombinationFeature({ baseCoins, config, pendingUpgradeInfo, onSpin, onReset, onUpgrade }: Props) {
//   const MAX_SPINS  = getComboMaxSpins(config);
//   const coinColors = getComboCoinColors(config.features);
//   const defaultCode = coinColors[0].value;

//   const [isOpen,    setIsOpen]    = useState(true);
//   const initialSeeds = baseCoins.map(c => ({ ...c, fromBase: true }));
//   const [coins,     setCoins]     = useState<ComboCoin[]>(initialSeeds);
//   const [spinsLeft, setSpinsLeft] = useState(MAX_SPINS);
//   const lastSpinPositions = useRef<Set<number>>(new Set(initialSeeds.map(c => c.position)));

//   // Upgrade state
//   const [upgradePos,      setUpgradePos]      = useState<number | null>(null);
//   const [upgradeFeatSel,  setUpgradeFeatSel]  = useState<string>("");
//   const [upgradeMultiSel, setUpgradeMultiSel] = useState<Set<string>>(new Set());

//   const coinAt = (pos: number) => coins.find(c => c.position === pos);

//   // ── Coin operations ──────────────────────────────────────────────────────
//   const handleCellClick = (pos: number) => {
//     if (coinAt(pos)) return;
//     setCoins(prev => [...prev, {
//       position: pos, colorCode: defaultCode, value: COMBO_COIN_VALUES[0],
//       leftValue: "", rightValue: "", boostValue: "", boostSide: null,
//     }]);
//   };

//   const removeCoin = (pos: number) => {
//     const c = coinAt(pos);
//     if (!c || c.fromBase) return;
//     if (upgradePos === pos) {
//       setUpgradePos(null); setUpgradeFeatSel(""); setUpgradeMultiSel(new Set());
//     }
//     setCoins(prev => prev.filter(x => x.position !== pos));
//   };

//   const updateCoin = (pos: number, field: keyof ComboCoin, val: any) =>
//     setCoins(prev => prev.map(c => c.position === pos ? { ...c, [field]: val } : c));

//   const setBoostSide = (pos: number, side: "LEFT" | "RIGHT", boostVal: string) => {
//     setCoins(prev => prev.map(c => {
//       if (c.position !== pos) return c;
//       if (!boostVal) return { ...c, boostValue: "", boostSide: null };
//       return { ...c, boostValue: boostVal, boostSide: side };
//     }));
//   };

//   // ── Upgrade radio ────────────────────────────────────────────────────────
//   const handleUpgradeRadio = (pos: number) => {
//     if (upgradePos === pos) {
//       setUpgradePos(null); setUpgradeFeatSel(""); setUpgradeMultiSel(new Set()); return;
//     }
//     setUpgradePos(pos); setUpgradeFeatSel(""); setUpgradeMultiSel(new Set());
//   };

//   const upgradeCoinn = upgradePos !== null ? coinAt(upgradePos) : null;

//   // AllColor = the coin whose label starts with "AllColor" in this combo's palette
//   const allColorEntry = coinColors.find(c => c.label.startsWith("AllColor"));
//   const isAllColor = !!(upgradeCoinn && allColorEntry && upgradeCoinn.colorCode === allColorEntry.value);

//   // Gold coins (label starts with "Gold") have no upgrade
//   const goldCodes = new Set(coinColors.filter(c => c.label.startsWith("Gold")).map(c => c.value));

//   const upgradeOptions: string[] = (() => {
//     if (!upgradeCoinn) return [];
//     // Gold coins never upgrade
//     if (goldCodes.has(upgradeCoinn.colorCode)) return [];
//     const activeFeaturesUpper = config.features.map(f => f.toUpperCase());
//     if (isAllColor) {
//       return ALL_UPGRADE_FEATURES.filter(f => !activeFeaturesUpper.includes(f));
//     }
//     return resolveUpgradeFeatures(upgradeCoinn.colorCode).filter(f => !activeFeaturesUpper.includes(f));
//   })();

//   const toggleMulti = (f: string) => {
//     setUpgradeMultiSel(prev => {
//       const next = new Set(prev);
//       if (next.has(f)) next.delete(f); else next.add(f);
//       return next;
//     });
//   };

//   // The currently selected upgrade features (for combo-internal upgrade)
//   const selectedUpgradeFeats: string[] = isAllColor
//     ? Array.from(upgradeMultiSel)
//     : upgradeFeatSel ? [upgradeFeatSel] : [];

//   // Navigate immediately when upgrade feature selected in combo
//   const navigateComboUpgrade = (feats: string[]) => {
//     if (upgradePos === null || feats.length === 0) return;
//     const upgradeInfo: UpgradeInfo = { col: Math.floor(upgradePos/3), row: upgradePos%3, features: feats };
//     const newFeatures = [...new Set([...config.features, ...feats.map(f => f.toLowerCase())])];
//     onUpgrade(newFeatures, coins, upgradeInfo);
//   };

//   // ── Spin ─────────────────────────────────────────────────────────────────
//   // Uses pendingUpgradeInfo (from single-feature upgrade) on first spin, then it's cleared by parent
//   const handleSpin = () => {
//     if (spinsLeft <= 0) return;
//     const cur = new Set(coins.map(c => c.position));
//     const hasNew = [...cur].some(p => !lastSpinPositions.current.has(p));
//     setSpinsLeft(hasNew ? MAX_SPINS : spinsLeft - 1);
//     lastSpinPositions.current = cur;

//     const line = generateCombinationGaffe(coins, config, pendingUpgradeInfo ?? null);
//     onSpin(coins, line);   // parent clears pendingUpgradeInfo after this
//   };

//   const resetFeature = () => {
//     const seeded = baseCoins.map(c => ({ ...c, fromBase: true }));
//     setCoins(seeded);
//     setSpinsLeft(MAX_SPINS);
//     lastSpinPositions.current = new Set(seeded.map(c => c.position));
//     setUpgradePos(null); setUpgradeFeatSel(""); setUpgradeMultiSel(new Set());
//     onReset();
//   };

//   const activeSplitter = config.hasZone ? (config.splitter ?? 1) : 0;
//   const filled14 = coins.length >= 14 && (config.hasExtra || config.hasUltra);
//   const cellMinH = config.hasDouble && config.hasUltra ? 150
//                  : config.hasDouble                    ? 120
//                  : config.hasUltra                     ? 110
//                  : 100;

//   return (
//     <div className="bg-gray-800 rounded-xl border border-indigo-800">

//       {/* HEADER */}
//       <div onClick={() => setIsOpen(!isOpen)} className="flex justify-between items-center p-4 cursor-pointer select-none">
//         <div className="flex items-center gap-2 flex-wrap">
//           <h2 className="text-lg font-semibold text-white font-mono">⚡ Combination Feature</h2>
//           {config.features.map(name => (
//             <span key={name} className={`text-xs px-2 py-0.5 rounded capitalize font-mono ${FEATURE_BADGE[name] ?? "bg-gray-700 text-gray-300"}`}>
//               {name}
//             </span>
//           ))}
//           {config.hasZone && config.splitter && (
//             <span className="text-xs px-2 py-0.5 rounded bg-sky-900 text-sky-300 border border-sky-700 font-mono">
//               Splitter {config.splitter}
//             </span>
//           )}
//           {pendingUpgradeInfo && (
//             <span className="text-xs px-2 py-0.5 rounded bg-yellow-900 text-yellow-300 border border-yellow-700 font-mono animate-pulse">
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
//             <button onClick={handleSpin} disabled={spinsLeft <= 0}
//               className={`px-6 py-2 rounded font-bold text-white font-mono transition-all ${spinsLeft > 0 ? "bg-indigo-600 hover:bg-indigo-500" : "bg-gray-600 cursor-not-allowed opacity-50"}`}>
//               SPIN
//             </button>
//             <span className="text-sm text-gray-400 font-mono">
//               {spinsLeft} spin{spinsLeft !== 1 ? "s" : ""}
//               {config.hasExtra && <span className="ml-1 text-emerald-400 text-xs">(4 — Extra)</span>}
//             </span>
//             <button onClick={resetFeature} className="px-3 py-1 bg-gray-600 hover:bg-gray-500 rounded text-sm">Reset</button>
//             {filled14 && <span className="text-yellow-400 text-xs font-mono bg-yellow-900/40 px-2 py-0.5 rounded border border-yellow-700">⚠ 14 filled → lastPositionReel</span>}
//           </div>

//           {/* Double+Ultra info */}
//           {config.hasDouble && config.hasUltra && (
//             <div className="text-xs text-purple-300 font-mono bg-purple-900/30 px-3 py-1.5 rounded border border-purple-800">
//               Double+Ultra: select boost on LEFT or RIGHT side per coin — choosing one locks the other. ✕ to clear.
//             </div>
//           )}

//           {/* UPGRADE COIN SELECTED — select feature → navigate immediately */}
//           {upgradePos !== null && upgradeOptions.length > 0 && (
//             <div className="flex flex-col gap-2 bg-yellow-900/20 border border-yellow-800 rounded-lg p-2">
//               <span className="text-yellow-300 text-xs font-mono font-bold">
//                 ✦ Upgrade at {posToMetric(upgradePos)} — select feature to add (navigates immediately):
//               </span>
//               {isAllColor ? (
//                 <div className="flex flex-col gap-2">
//                   <div className="flex gap-2 flex-wrap">
//                     {upgradeOptions.map(f => (
//                       <label key={f} className="flex items-center gap-1 cursor-pointer bg-yellow-900/40 border border-yellow-700 rounded px-2 py-1">
//                         <input type="checkbox" className="accent-yellow-400 w-3 h-3"
//                           checked={upgradeMultiSel.has(f)} onChange={() => toggleMulti(f)} />
//                         <span className="text-yellow-100 text-xs font-mono">{f}</span>
//                       </label>
//                     ))}
//                   </div>
//                   {upgradeMultiSel.size > 0 && (
//                     <button onClick={() => navigateComboUpgrade(Array.from(upgradeMultiSel))}
//                       className="self-start px-3 py-1 bg-yellow-600 hover:bg-yellow-500 rounded text-xs font-mono font-bold transition-all">
//                       → Go to {[...config.features, ...Array.from(upgradeMultiSel).map(f=>f.toLowerCase())].filter((v,i,a)=>a.indexOf(v)===i).join(" + ")}
//                     </button>
//                   )}
//                 </div>
//               ) : (
//                 <div className="flex gap-2 flex-wrap">
//                   {upgradeOptions.map(f => (
//                     <button key={f} onClick={() => navigateComboUpgrade([f])}
//                       className="px-3 py-1.5 bg-yellow-700 hover:bg-yellow-600 border border-yellow-600 rounded text-xs font-mono font-bold transition-all">
//                       → {f}
//                     </button>
//                   ))}
//                 </div>
//               )}
//             </div>
//           )}
//           {upgradePos !== null && upgradeOptions.length === 0 && (
//             <div className="text-xs text-gray-500 font-mono bg-gray-700 px-3 py-1.5 rounded">
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
//                       className={`relative rounded-lg border-2 flex flex-col items-start p-1 text-xs text-white cursor-pointer transition-all hover:brightness-110 ${cellBg} ${hoverCls}`}
//                       style={{ minHeight: cellMinH }}
//                     >
//                       <div className="flex justify-between w-full text-[9px] opacity-40 mb-0.5">
//                         <span>{pos}</span>
//                         <span className="font-mono">{posToMetric(pos)}</span>
//                       </div>

//                       {coin ? (
//                         <div className="flex flex-col items-center w-full gap-0.5">

//                           <div className="text-sm">🟡</div>

//                           {/* Color dropdown */}
//                           <select
//                             className="bg-gray-800 text-white text-[9px] w-full rounded px-0.5 py-0.5 border-0 font-mono"
//                             value={coin.colorCode}
//                             onClick={e => e.stopPropagation()}
//                             onChange={e => updateCoin(pos, "colorCode", Number(e.target.value))}
//                           >
//                             {coinColors.map(c => (
//                               <option key={c.value} value={c.value} className="bg-gray-800">{c.label}</option>
//                             ))}
//                           </select>

//                           {/* Value — Double: LEFT+RIGHT; others: single */}
//                           {config.hasDouble ? (
//                             <>
//                               <div className="flex items-center gap-0.5 w-full">
//                                 <span className="text-[7px] text-red-300 font-mono w-4 shrink-0">←L</span>
//                                 <select className="bg-red-950 text-red-200 text-[9px] flex-1 rounded px-0 py-0.5 border-0 font-mono"
//                                   value={coin.leftValue || ""}
//                                   onClick={e => e.stopPropagation()}
//                                   onChange={e => updateCoin(pos, "leftValue", e.target.value)}>
//                                   <option value="">--</option>
//                                   {COMBO_COIN_VALUES.map(v => <option key={v} value={v} className="bg-gray-800">{v}</option>)}
//                                 </select>
//                               </div>
//                               <div className="flex items-center gap-0.5 w-full">
//                                 <span className="text-[7px] text-red-300 font-mono w-4 shrink-0">R→</span>
//                                 <select className="bg-red-950 text-red-200 text-[9px] flex-1 rounded px-0 py-0.5 border-0 font-mono"
//                                   value={coin.rightValue || ""}
//                                   onClick={e => e.stopPropagation()}
//                                   onChange={e => updateCoin(pos, "rightValue", e.target.value)}>
//                                   <option value="">--</option>
//                                   {COMBO_COIN_VALUES.map(v => <option key={v} value={v} className="bg-gray-800">{v}</option>)}
//                                 </select>
//                               </div>
//                             </>
//                           ) : (
//                             <select
//                               className="bg-gray-800 text-white text-[9px] w-full rounded px-0.5 py-0.5 border-0 font-mono"
//                               value={coin.value}
//                               onClick={e => e.stopPropagation()}
//                               onChange={e => updateCoin(pos, "value", e.target.value)}>
//                               {COMBO_COIN_VALUES.map(v => (
//                                 <option key={v} value={v} className="bg-gray-800">{v}</option>
//                               ))}
//                             </select>
//                           )}

//                           {/* Ultra boost — single dropdown when no double */}
//                           {config.hasUltra && !config.hasDouble && (
//                             <select
//                               className="bg-purple-950 text-purple-200 text-[9px] w-full rounded px-0.5 py-0.5 border-0 font-mono"
//                               value={coin.boostValue || ""}
//                               onClick={e => e.stopPropagation()}
//                               onChange={e => updateCoin(pos, "boostValue", e.target.value)}>
//                               <option value="">Boost</option>
//                               {ULTRA_BOOST_VALUES.map(v => <option key={v} value={v} className="bg-gray-800">{v}</option>)}
//                             </select>
//                           )}

//                           {/* Ultra boost — LEFT/RIGHT side picker in Double+Ultra combo */}
//                           {config.hasDouble && config.hasUltra && (
//                             <div className="w-full mt-0.5" onClick={e => e.stopPropagation()}>
//                               <div className="flex gap-0.5 w-full items-end">
//                                 {(["LEFT", "RIGHT"] as const).map(side => {
//                                   const isThis  = coin.boostSide === side;
//                                   const locked  = !!(coin.boostSide && coin.boostSide !== side);
//                                   return (
//                                     <div key={side} className="flex flex-col items-center flex-1 gap-0">
//                                       <span className={`text-[7px] font-mono ${isThis ? "text-yellow-300" : "text-gray-500"}`}>{side}</span>
//                                       <select
//                                         disabled={locked}
//                                         className={`text-[8px] w-full rounded px-0 py-0.5 border-0 font-mono
//                                           ${isThis ? "bg-yellow-700 text-yellow-100" : "bg-purple-950 text-purple-200"}
//                                           ${locked ? "opacity-30 cursor-not-allowed" : ""}`}
//                                         value={isThis ? (coin.boostValue || "") : ""}
//                                         onChange={e => setBoostSide(pos, side, e.target.value)}>
//                                         <option value="">--</option>
//                                         {ULTRA_BOOST_VALUES.map(v => <option key={v} value={v} className="bg-gray-800">{v}</option>)}
//                                       </select>
//                                     </div>
//                                   );
//                                 })}
//                                 {coin.boostSide && (
//                                   <button
//                                     className="text-red-400 hover:text-red-200 text-[8px] pb-0.5 ml-0.5"
//                                     onClick={e => { e.stopPropagation(); updateCoin(pos, "boostValue", ""); updateCoin(pos, "boostSide", null); }}>✕</button>
//                                 )}
//                               </div>
//                             </div>
//                           )}

//                           {/* Feature upgrade radio */}
//                           <div className="flex items-center gap-1 mt-0.5 w-full" onClick={e => e.stopPropagation()}>
//                             <input
//                               type="radio" name="comboUpgrade"
//                               className="accent-yellow-400 w-3 h-3 cursor-pointer"
//                               checked={upgradePos === pos}
//                               onChange={() => handleUpgradeRadio(pos)}
//                             />
//                             <span className="text-[8px] text-yellow-300 font-mono">upgrade</span>
//                             {upgradePos === pos && !isAllColor && upgradeFeatSel && (
//                               <span className="text-[8px] text-yellow-500 font-mono">→{upgradeFeatSel}</span>
//                             )}
//                             {upgradePos === pos && isAllColor && upgradeMultiSel.size > 0 && (
//                               <span className="text-[8px] text-yellow-500 font-mono">→{Array.from(upgradeMultiSel).join("+")}</span>
//                             )}
//                           </div>

//                           {/* Remove — non-base coins only */}
//                           {!coin.fromBase && (
//                             <button
//                               onClick={e => { e.stopPropagation(); removeCoin(pos); }}
//                               className="absolute top-1 right-1 text-[10px] text-red-300 hover:text-red-100 font-bold">✕</button>
//                           )}

//                         </div>
//                       ) : (
//                         <span className="text-white/40 text-[10px] mx-auto mt-4">+ Add</span>
//                       )}
//                     </div>
//                   </div>
//                 );
//               })
//             )}
//           </div>

//           {/* LEGEND */}
//           <div className="text-[10px] text-gray-500 font-mono flex flex-wrap gap-2">
//             <span>🟡 = coin · click empty cell to add · ✕ = remove</span>
//             {config.hasDouble && <span>L← / R→ = LEFT / RIGHT coin values</span>}
//             {config.hasUltra && !config.hasDouble && <span>Boost = ultra boost value</span>}
//             {config.hasDouble && config.hasUltra && <span>L/R boost = side the boost applies to · ✕ to clear side</span>}
//             {config.hasZone && <span>Background = zone regions (splitter {config.splitter})</span>}
//             <span>✦ radio = upgrade · single-color = 1 feature · AllColor = multi-feature</span>
//           </div>

//         </div>
//       )}
//     </div>
//   );
// }


//! working best-----------------------------
// /* eslint-disable @typescript-eslint/no-explicit-any */
// "use client";

// import { useState, useRef } from "react";
// import {
//   ComboCoin, ComboFeatureConfig,
//   getComboMaxSpins, getComboCoinColors,
//   generateCombinationGaffe, resolveUpgradeFeatures, UpgradeInfo,
// } from "./combinationFeatureGenerator";
// import { ZONE_BG_CLASS, ZONE_BORDER_CLASS, getZoneBgColor } from "./zoneFeatureGenerator";
// import { ULTRA_BOOST_VALUES } from "./ultraFeatureGenerator";
// import { posToMetric, ALL_UPGRADE_FEATURES, ZONE_SPLITTER_OPTIONS } from "./config";

// // ── Constants ─────────────────────────────────────────────────────────────────
// // Fix #5: uppercase coin values
// const COMBO_COIN_VALUES = ["100", "250", "500", "MINOR", "MAJOR", "MINI"];

// const FEATURE_BADGE: Record<string, string> = {
//   double: "bg-red-900 text-red-300 border border-red-600",
//   extra:  "bg-emerald-900 text-emerald-300 border border-emerald-600",
//   zone:   "bg-sky-900 text-sky-300 border border-sky-600",
//   ultra:  "bg-purple-900 text-purple-300 border border-purple-600",
// };

// // ── Props ─────────────────────────────────────────────────────────────────────
// type Props = {
//   baseCoins:          ComboCoin[];
//   config:             ComboFeatureConfig;
//   pendingUpgradeInfo: UpgradeInfo | null;   // carried from single-feature upgrade
//   onSpin:             (snapshot: ComboCoin[], line: string) => void;
//   onReset:            () => void;
//   onUpgrade:          (newFeatures: string[], carryCoins: ComboCoin[], upgradeInfo: UpgradeInfo) => void;
// };

// // ── Component ─────────────────────────────────────────────────────────────────
// export default function CombinationFeature({ baseCoins, config, pendingUpgradeInfo, onSpin, onReset, onUpgrade }: Props) {
//   const MAX_SPINS  = getComboMaxSpins(config);
//   const coinColors = getComboCoinColors(config.features);
//   const defaultCode = coinColors[0].value;

//   const [isOpen,    setIsOpen]    = useState(true);
//   const initialSeeds = baseCoins.map(c => ({ ...c, fromBase: true }));
//   const [coins,     setCoins]     = useState<ComboCoin[]>(initialSeeds);
//   const [spinsLeft, setSpinsLeft] = useState(MAX_SPINS);
//   const lastSpinPositions = useRef<Set<number>>(new Set(initialSeeds.map(c => c.position)));

//   // Upgrade state
//   const [upgradePos,          setUpgradePos]          = useState<number | null>(null);
//   const [upgradeFeatSel,      setUpgradeFeatSel]      = useState<string>("");
//   const [upgradeMultiSel,     setUpgradeMultiSel]     = useState<Set<string>>(new Set());
//   const [upgradeZoneSplitter, setUpgradeZoneSplitter] = useState<string>("");
//   const [upgradeZoneMultiRaw, setUpgradeZoneMultiRaw] = useState<string>("");

//   const coinAt = (pos: number) => coins.find(c => c.position === pos);

//   // ── Coin operations ──────────────────────────────────────────────────────
//   const handleCellClick = (pos: number) => {
//     if (coinAt(pos)) return;
//     setCoins(prev => [...prev, {
//       position: pos, colorCode: defaultCode, value: COMBO_COIN_VALUES[0],
//       leftValue: "", rightValue: "", boostValue: "", boostSide: null,
//     }]);
//   };

//   const removeCoin = (pos: number) => {
//     const c = coinAt(pos);
//     if (!c || c.fromBase) return;
//     if (upgradePos === pos) {
//       setUpgradePos(null); setUpgradeFeatSel(""); setUpgradeMultiSel(new Set());
//     }
//     setCoins(prev => prev.filter(x => x.position !== pos));
//   };

//   const updateCoin = (pos: number, field: keyof ComboCoin, val: any) =>
//     setCoins(prev => prev.map(c => c.position === pos ? { ...c, [field]: val } : c));

//   const setBoostSide = (pos: number, side: "LEFT" | "RIGHT", boostVal: string) => {
//     setCoins(prev => prev.map(c => {
//       if (c.position !== pos) return c;
//       if (!boostVal) return { ...c, boostValue: "", boostSide: null };
//       return { ...c, boostValue: boostVal, boostSide: side };
//     }));
//   };

//   // ── Upgrade radio ────────────────────────────────────────────────────────
//   const handleUpgradeRadio = (pos: number) => {
//     if (upgradePos === pos) {
//       setUpgradePos(null); setUpgradeFeatSel(""); setUpgradeMultiSel(new Set()); setUpgradeZoneSplitter(""); setUpgradeZoneMultiRaw(""); return;
//     }
//     setUpgradePos(pos); setUpgradeFeatSel(""); setUpgradeMultiSel(new Set()); setUpgradeZoneSplitter(""); setUpgradeZoneMultiRaw("");
//   };

//   const upgradeCoinn = upgradePos !== null ? coinAt(upgradePos) : null;

//   // AllColor = the coin whose label starts with "AllColor" in this combo's palette
//   const allColorEntry = coinColors.find(c => c.label.startsWith("AllColor"));
//   const isAllColor = !!(upgradeCoinn && allColorEntry && upgradeCoinn.colorCode === allColorEntry.value);

//   // Gold coins (label starts with "Gold") have no upgrade
//   const goldCodes = new Set(coinColors.filter(c => c.label.startsWith("Gold")).map(c => c.value));

//   // Build a colorCode→feature map using color-name semantics from palette labels:
//   // Red→DOUBLE, Blue→ZONE, Green→EXTRA, Purple→ULTRA
//   const COLOR_LABEL_TO_FEATURE: Record<string, string> = {
//     Red: "DOUBLE", Blue: "ZONE", Green: "EXTRA", Purple: "ULTRA",
//   };
//   const activeFeaturesUpper = config.features.map(f => f.toUpperCase());
//   const inactiveFeatures    = ALL_UPGRADE_FEATURES.filter(f => !activeFeaturesUpper.includes(f));
//   const paletteUpgradeMap: Record<number, string> = {};
//   coinColors.forEach(c => {
//     const colorName = c.label.split("(")[0]; // e.g. "Purple" from "Purple(4)"
//     const feat = COLOR_LABEL_TO_FEATURE[colorName];
//     if (feat) paletteUpgradeMap[c.value] = feat;
//   });

//   const upgradeOptions: string[] = (() => {
//     if (!upgradeCoinn) return [];
//     if (goldCodes.has(upgradeCoinn.colorCode)) return [];
//     if (isAllColor) return inactiveFeatures;
//     const feat = paletteUpgradeMap[upgradeCoinn.colorCode];
//     // Only offer if that feature is actually inactive in this combo
//     return feat && !activeFeaturesUpper.includes(feat) ? [feat] : [];
//   })();

//   const toggleMulti = (f: string) => {
//     setUpgradeMultiSel(prev => {
//       const next = new Set(prev);
//       if (next.has(f)) next.delete(f); else next.add(f);
//       return next;
//     });
//   };

//   // The currently selected upgrade features (for combo-internal upgrade)
//   const selectedUpgradeFeats: string[] = isAllColor
//     ? Array.from(upgradeMultiSel)
//     : upgradeFeatSel ? [upgradeFeatSel] : [];

//   // Navigate immediately when upgrade feature selected in combo
//   const navigateComboUpgrade = (feats: string[]) => {
//     if (upgradePos === null || feats.length === 0) return;
//     const hasZone = feats.map(f => f.toUpperCase()).includes("ZONE");
//     const upgradeInfo: UpgradeInfo = {
//       col: Math.floor(upgradePos/3), row: upgradePos%3, features: feats,
//       ...(hasZone && upgradeZoneSplitter ? { zoneSplitter: Number(upgradeZoneSplitter) } : {}),
//       ...(hasZone && upgradeZoneMultiRaw ? { zoneMultipliers: upgradeZoneMultiRaw.split(",").map(n=>n.trim()).filter(Boolean).map(Number) } : {}),
//     };
//     const newFeatures = [...new Set([...config.features, ...feats.map(f => f.toLowerCase())])];
//     onUpgrade(newFeatures, coins, upgradeInfo);
//   };

//   // ── Spin ─────────────────────────────────────────────────────────────────
//   // Uses pendingUpgradeInfo (from single-feature upgrade) on first spin, then it's cleared by parent
//   const handleSpin = () => {
//     if (spinsLeft <= 0) return;
//     const cur = new Set(coins.map(c => c.position));
//     const hasNew = [...cur].some(p => !lastSpinPositions.current.has(p));
//     // If this is an upgrade spin (pendingUpgradeInfo set), always reset to MAX
//     const nextSpins = pendingUpgradeInfo ? MAX_SPINS : (hasNew ? MAX_SPINS : spinsLeft - 1);
//     setSpinsLeft(nextSpins);
//     lastSpinPositions.current = cur;

//     const line = generateCombinationGaffe(coins, config, pendingUpgradeInfo ?? null);
//     onSpin(coins, line);   // parent clears pendingUpgradeInfo after this
//   };

//   const resetFeature = () => {
//     const seeded = baseCoins.map(c => ({ ...c, fromBase: true }));
//     setCoins(seeded);
//     setSpinsLeft(MAX_SPINS);
//     lastSpinPositions.current = new Set(seeded.map(c => c.position));
//     setUpgradePos(null); setUpgradeFeatSel(""); setUpgradeMultiSel(new Set()); setUpgradeZoneSplitter(""); setUpgradeZoneMultiRaw("");
//     onReset();
//   };

//   const activeSplitter = config.hasZone ? (config.splitter ?? 1) : 0;
//   const filled14 = coins.length >= 14 && (config.hasExtra || config.hasUltra);
//   const cellMinH = config.hasDouble && config.hasUltra ? 150
//                  : config.hasDouble                    ? 120
//                  : config.hasUltra                     ? 110
//                  : 100;

//   return (
//     <div className="bg-gray-800 rounded-xl border border-indigo-800">

//       {/* HEADER */}
//       <div onClick={() => setIsOpen(!isOpen)} className="flex justify-between items-center p-4 cursor-pointer select-none">
//         <div className="flex items-center gap-2 flex-wrap">
//           <h2 className="text-lg font-semibold text-white font-mono">⚡ Combination Feature</h2>
//           {config.features.map(name => (
//             <span key={name} className={`text-xs px-2 py-0.5 rounded capitalize font-mono ${FEATURE_BADGE[name] ?? "bg-gray-700 text-gray-300"}`}>
//               {name}
//             </span>
//           ))}
//           {config.hasZone && config.splitter && (
//             <span className="text-xs px-2 py-0.5 rounded bg-sky-900 text-sky-300 border border-sky-700 font-mono">
//               Splitter {config.splitter}
//             </span>
//           )}
//           {pendingUpgradeInfo && (
//             <span className="text-xs px-2 py-0.5 rounded bg-yellow-900 text-yellow-300 border border-yellow-700 font-mono animate-pulse">
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
//             <button onClick={handleSpin} disabled={spinsLeft <= 0}
//               className={`px-6 py-2 rounded font-bold text-white font-mono transition-all ${spinsLeft > 0 ? "bg-indigo-600 hover:bg-indigo-500" : "bg-gray-600 cursor-not-allowed opacity-50"}`}>
//               SPIN
//             </button>
//             <span className="text-sm text-gray-400 font-mono">
//               {spinsLeft} spin{spinsLeft !== 1 ? "s" : ""}
//               {config.hasExtra && <span className="ml-1 text-emerald-400 text-xs">(4 — Extra)</span>}
//             </span>
//             <button onClick={resetFeature} className="px-3 py-1 bg-gray-600 hover:bg-gray-500 rounded text-sm">Reset</button>
//             {filled14 && <span className="text-yellow-400 text-xs font-mono bg-yellow-900/40 px-2 py-0.5 rounded border border-yellow-700">⚠ 14 filled → lastPositionReel</span>}
//           </div>

//           {/* Double+Ultra info */}
//           {config.hasDouble && config.hasUltra && (
//             <div className="text-xs text-purple-300 font-mono bg-purple-900/30 px-3 py-1.5 rounded border border-purple-800">
//               Double+Ultra: select boost on LEFT or RIGHT side per coin — choosing one locks the other. ✕ to clear.
//             </div>
//           )}

//           {/* UPGRADE COIN SELECTED — select feature → navigate immediately */}
//           {upgradePos !== null && upgradeOptions.length > 0 && (
//             <div className="flex flex-col gap-2 bg-yellow-900/20 border border-yellow-800 rounded-lg p-3">
//               <span className="text-yellow-300 text-xs font-mono font-bold">
//                 ✦ Upgrade at {posToMetric(upgradePos)} — select feature to add:
//               </span>
//               {isAllColor ? (
//                 <div className="flex flex-col gap-2">
//                   <div className="flex gap-2 flex-wrap">
//                     {upgradeOptions.map(f => (
//                       <label key={f} className="flex items-center gap-1 cursor-pointer bg-yellow-900/40 border border-yellow-700 rounded px-2 py-1">
//                         <input type="checkbox" className="accent-yellow-400 w-3 h-3"
//                           checked={upgradeMultiSel.has(f)} onChange={() => toggleMulti(f)} />
//                         <span className="text-yellow-100 text-xs font-mono">{f}</span>
//                       </label>
//                     ))}
//                   </div>
//                   {upgradeMultiSel.has("ZONE") && (
//                     <div className="flex gap-3 flex-wrap items-center bg-sky-900/30 border border-sky-800 rounded p-2">
//                       <span className="text-sky-300 text-[10px] font-mono">Zone params:</span>
//                       <div className="flex items-center gap-1">
//                         <span className="text-[10px] text-sky-300 font-mono">Splitter</span>
//                         <select className="bg-sky-950 text-sky-200 text-xs rounded px-1 py-0.5 font-mono border border-sky-700"
//                           value={upgradeZoneSplitter} onChange={e => setUpgradeZoneSplitter(e.target.value)}>
//                           <option value="">--</option>
//                           {ZONE_SPLITTER_OPTIONS.map(v => <option key={v} value={v}>{v}</option>)}
//                         </select>
//                       </div>
//                       <div className="flex items-center gap-1">
//                         <span className="text-[10px] text-sky-300 font-mono">Multipliers</span>
//                         <input type="text" placeholder="e.g. 2,3" value={upgradeZoneMultiRaw} onChange={e => setUpgradeZoneMultiRaw(e.target.value)}
//                           className="bg-sky-950 text-sky-200 text-xs rounded px-1 py-0.5 font-mono border border-sky-700 w-20" />
//                       </div>
//                     </div>
//                   )}
//                   {upgradeMultiSel.size > 0 && (
//                     <button onClick={() => navigateComboUpgrade(Array.from(upgradeMultiSel))}
//                       className="self-start px-3 py-1 bg-yellow-600 hover:bg-yellow-500 rounded text-xs font-mono font-bold transition-all">
//                       → Go to {[...config.features, ...Array.from(upgradeMultiSel).map(f=>f.toLowerCase())].filter((v,i,a)=>a.indexOf(v)===i).join(" + ")}
//                     </button>
//                   )}
//                 </div>
//               ) : (
//                 <div className="flex flex-col gap-2">
//                   <div className="flex gap-2 flex-wrap">
//                     {upgradeOptions.filter(f => f !== "ZONE").map(f => (
//                       <button key={f} onClick={() => navigateComboUpgrade([f])}
//                         className="px-3 py-1.5 bg-yellow-700 hover:bg-yellow-600 border border-yellow-600 rounded text-xs font-mono font-bold transition-all">
//                         → {f}
//                       </button>
//                     ))}
//                   </div>
//                   {upgradeOptions.includes("ZONE") && (
//                     <div className="flex flex-col gap-1.5">
//                       <div className="flex gap-3 flex-wrap items-center bg-sky-900/30 border border-sky-800 rounded p-2">
//                         <span className="text-sky-300 text-[10px] font-mono">Zone params:</span>
//                         <div className="flex items-center gap-1">
//                           <span className="text-[10px] text-sky-300 font-mono">Splitter</span>
//                           <select className="bg-sky-950 text-sky-200 text-xs rounded px-1 py-0.5 font-mono border border-sky-700"
//                             value={upgradeZoneSplitter} onChange={e => setUpgradeZoneSplitter(e.target.value)}>
//                             <option value="">--</option>
//                             {ZONE_SPLITTER_OPTIONS.map(v => <option key={v} value={v}>{v}</option>)}
//                           </select>
//                         </div>
//                         <div className="flex items-center gap-1">
//                           <span className="text-[10px] text-sky-300 font-mono">Multipliers</span>
//                           <input type="text" placeholder="e.g. 2,3" value={upgradeZoneMultiRaw} onChange={e => setUpgradeZoneMultiRaw(e.target.value)}
//                             className="bg-sky-950 text-sky-200 text-xs rounded px-1 py-0.5 font-mono border border-sky-700 w-20" />
//                         </div>
//                       </div>
//                       <button onClick={() => navigateComboUpgrade(["ZONE"])}
//                         className="self-start px-3 py-1 bg-sky-700 hover:bg-sky-600 border border-sky-500 rounded text-xs font-mono font-bold transition-all">
//                         → Go to {[...config.features, "zone"].join(" + ")}
//                       </button>
//                     </div>
//                   )}
//                 </div>
//               )}
//             </div>
//           )}
//           {upgradePos !== null && upgradeOptions.length === 0 && (
//             <div className="text-xs text-gray-500 font-mono bg-gray-700 px-3 py-1.5 rounded">
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
//                       className={`relative rounded-lg border-2 flex flex-col items-start p-1 text-xs text-white cursor-pointer transition-all hover:brightness-110 ${cellBg} ${hoverCls}`}
//                       style={{ minHeight: cellMinH }}
//                     >
//                       <div className="flex justify-between w-full text-[9px] opacity-40 mb-0.5">
//                         <span>{pos}</span>
//                         <span className="font-mono">{posToMetric(pos)}</span>
//                       </div>

//                       {coin ? (
//                         <div className="flex flex-col items-center w-full gap-0.5">

//                           <div className="text-sm">🟡</div>

//                           {/* Color dropdown */}
//                           <select
//                             className="bg-gray-800 text-white text-[9px] w-full rounded px-0.5 py-0.5 border-0 font-mono"
//                             value={coin.colorCode}
//                             onClick={e => e.stopPropagation()}
//                             onChange={e => updateCoin(pos, "colorCode", Number(e.target.value))}
//                           >
//                             {coinColors.map(c => (
//                               <option key={c.value} value={c.value} className="bg-gray-800">{c.label}</option>
//                             ))}
//                           </select>

//                           {/* Value — Double: LEFT+RIGHT; others: single */}
//                           {config.hasDouble ? (
//                             <>
//                               <div className="flex items-center gap-0.5 w-full">
//                                 <span className="text-[7px] text-red-300 font-mono w-4 shrink-0">←L</span>
//                                 <select className="bg-red-950 text-red-200 text-[9px] flex-1 rounded px-0 py-0.5 border-0 font-mono"
//                                   value={coin.leftValue || ""}
//                                   onClick={e => e.stopPropagation()}
//                                   onChange={e => updateCoin(pos, "leftValue", e.target.value)}>
//                                   <option value="">--</option>
//                                   {COMBO_COIN_VALUES.map(v => <option key={v} value={v} className="bg-gray-800">{v}</option>)}
//                                 </select>
//                               </div>
//                               <div className="flex items-center gap-0.5 w-full">
//                                 <span className="text-[7px] text-red-300 font-mono w-4 shrink-0">R→</span>
//                                 <select className="bg-red-950 text-red-200 text-[9px] flex-1 rounded px-0 py-0.5 border-0 font-mono"
//                                   value={coin.rightValue || ""}
//                                   onClick={e => e.stopPropagation()}
//                                   onChange={e => updateCoin(pos, "rightValue", e.target.value)}>
//                                   <option value="">--</option>
//                                   {COMBO_COIN_VALUES.map(v => <option key={v} value={v} className="bg-gray-800">{v}</option>)}
//                                 </select>
//                               </div>
//                             </>
//                           ) : (
//                             <select
//                               className="bg-gray-800 text-white text-[9px] w-full rounded px-0.5 py-0.5 border-0 font-mono"
//                               value={coin.value}
//                               onClick={e => e.stopPropagation()}
//                               onChange={e => updateCoin(pos, "value", e.target.value)}>
//                               {COMBO_COIN_VALUES.map(v => (
//                                 <option key={v} value={v} className="bg-gray-800">{v}</option>
//                               ))}
//                             </select>
//                           )}

//                           {/* Ultra boost — single dropdown when no double */}
//                           {config.hasUltra && !config.hasDouble && (
//                             <select
//                               className="bg-purple-950 text-purple-200 text-[9px] w-full rounded px-0.5 py-0.5 border-0 font-mono"
//                               value={coin.boostValue || ""}
//                               onClick={e => e.stopPropagation()}
//                               onChange={e => updateCoin(pos, "boostValue", e.target.value)}>
//                               <option value="">Boost</option>
//                               {ULTRA_BOOST_VALUES.map(v => <option key={v} value={v} className="bg-gray-800">{v}</option>)}
//                             </select>
//                           )}

//                           {/* Ultra boost — LEFT/RIGHT side picker in Double+Ultra combo */}
//                           {config.hasDouble && config.hasUltra && (
//                             <div className="w-full mt-0.5" onClick={e => e.stopPropagation()}>
//                               <div className="flex gap-0.5 w-full items-end">
//                                 {(["LEFT", "RIGHT"] as const).map(side => {
//                                   const isThis  = coin.boostSide === side;
//                                   const locked  = !!(coin.boostSide && coin.boostSide !== side);
//                                   return (
//                                     <div key={side} className="flex flex-col items-center flex-1 gap-0">
//                                       <span className={`text-[7px] font-mono ${isThis ? "text-yellow-300" : "text-gray-500"}`}>{side}</span>
//                                       <select
//                                         disabled={locked}
//                                         className={`text-[8px] w-full rounded px-0 py-0.5 border-0 font-mono
//                                           ${isThis ? "bg-yellow-700 text-yellow-100" : "bg-purple-950 text-purple-200"}
//                                           ${locked ? "opacity-30 cursor-not-allowed" : ""}`}
//                                         value={isThis ? (coin.boostValue || "") : ""}
//                                         onChange={e => setBoostSide(pos, side, e.target.value)}>
//                                         <option value="">--</option>
//                                         {ULTRA_BOOST_VALUES.map(v => <option key={v} value={v} className="bg-gray-800">{v}</option>)}
//                                       </select>
//                                     </div>
//                                   );
//                                 })}
//                                 {coin.boostSide && (
//                                   <button
//                                     className="text-red-400 hover:text-red-200 text-[8px] pb-0.5 ml-0.5"
//                                     onClick={e => { e.stopPropagation(); updateCoin(pos, "boostValue", ""); updateCoin(pos, "boostSide", null); }}>✕</button>
//                                 )}
//                               </div>
//                             </div>
//                           )}

//                           {/* Feature upgrade radio */}
//                           <div className="flex items-center gap-1 mt-0.5 w-full" onClick={e => e.stopPropagation()}>
//                             <input
//                               type="radio" name="comboUpgrade"
//                               className="accent-yellow-400 w-3 h-3 cursor-pointer"
//                               checked={upgradePos === pos}
//                               onChange={() => handleUpgradeRadio(pos)}
//                             />
//                             <span className="text-[8px] text-yellow-300 font-mono">upgrade</span>
//                             {upgradePos === pos && !isAllColor && upgradeFeatSel && (
//                               <span className="text-[8px] text-yellow-500 font-mono">→{upgradeFeatSel}</span>
//                             )}
//                             {upgradePos === pos && isAllColor && upgradeMultiSel.size > 0 && (
//                               <span className="text-[8px] text-yellow-500 font-mono">→{Array.from(upgradeMultiSel).join("+")}</span>
//                             )}
//                           </div>

//                           {/* Remove — non-base coins only */}
//                           {!coin.fromBase && (
//                             <button
//                               onClick={e => { e.stopPropagation(); removeCoin(pos); }}
//                               className="absolute top-1 right-1 text-[10px] text-red-300 hover:text-red-100 font-bold">✕</button>
//                           )}

//                         </div>
//                       ) : (
//                         <span className="text-white/40 text-[10px] mx-auto mt-4">+ Add</span>
//                       )}
//                     </div>
//                   </div>
//                 );
//               })
//             )}
//           </div>

//           {/* LEGEND */}
//           <div className="text-[10px] text-gray-500 font-mono flex flex-wrap gap-2">
//             <span>🟡 = coin · click empty cell to add · ✕ = remove</span>
//             {config.hasDouble && <span>L← / R→ = LEFT / RIGHT coin values</span>}
//             {config.hasUltra && !config.hasDouble && <span>Boost = ultra boost value</span>}
//             {config.hasDouble && config.hasUltra && <span>L/R boost = side the boost applies to · ✕ to clear side</span>}
//             {config.hasZone && <span>Background = zone regions (splitter {config.splitter})</span>}
//             <span>✦ radio = upgrade · single-color = 1 feature · AllColor = multi-feature</span>
//           </div>

//         </div>
//       )}
//     </div>
//   );
// }




// // // //?new latest 
// // /* eslint-disable @typescript-eslint/no-explicit-any */
// // "use client";

// // import { useState, useRef } from "react";
// // import {
// //   ComboCoin, ComboFeatureConfig,
// //   getComboMaxSpins, getComboCoinColors,
// //   generateCombinationGaffe, resolveUpgradeFeatures, UpgradeInfo,
// // } from "./combinationFeatureGenerator";
// // import { ZONE_BG_CLASS, ZONE_BORDER_CLASS, getZoneBgColor } from "./zoneFeatureGenerator";
// // import { ULTRA_BOOST_VALUES } from "./ultraFeatureGenerator";
// // import { posToMetric, ALL_UPGRADE_FEATURES } from "./config";

// // // ── Constants ─────────────────────────────────────────────────────────────────
// // // Fix #5: uppercase coin values
// // const COMBO_COIN_VALUES = ["100", "250", "500", "MINOR", "MAJOR", "MINI"];

// // const FEATURE_BADGE: Record<string, string> = {
// //   double: "bg-red-900 text-red-300 border border-red-600",
// //   extra:  "bg-emerald-900 text-emerald-300 border border-emerald-600",
// //   zone:   "bg-sky-900 text-sky-300 border border-sky-600",
// //   ultra:  "bg-purple-900 text-purple-300 border border-purple-600",
// // };

// // // ── Props ─────────────────────────────────────────────────────────────────────
// // type Props = {
// //   baseCoins: ComboCoin[];
// //   config:    ComboFeatureConfig;
// //   onSpin:    (snapshot: ComboCoin[], line: string) => void;
// //   onReset:   () => void;
// //   onUpgrade: (newFeatures: string[], carryCoins: ComboCoin[]) => void;
// // };

// // // ── Component ─────────────────────────────────────────────────────────────────
// // export default function CombinationFeature({ baseCoins, config, onSpin, onReset, onUpgrade }: Props) {
// //   const MAX_SPINS  = getComboMaxSpins(config);
// //   const coinColors = getComboCoinColors(config.features);
// //   const defaultCode = coinColors[0].value;

// //   const [isOpen,    setIsOpen]    = useState(true);
// //   const initialSeeds = baseCoins.map(c => ({ ...c, fromBase: true }));
// //   const [coins,     setCoins]     = useState<ComboCoin[]>(initialSeeds);
// //   const [spinsLeft, setSpinsLeft] = useState(MAX_SPINS);
// //   const lastSpinPositions = useRef<Set<number>>(new Set(initialSeeds.map(c => c.position)));

// //   // Upgrade state
// //   const [upgradePos,      setUpgradePos]      = useState<number | null>(null);
// //   const [upgradeFeatSel,  setUpgradeFeatSel]  = useState<string>("");
// //   const [upgradeMultiSel, setUpgradeMultiSel] = useState<Set<string>>(new Set());

// //   const coinAt = (pos: number) => coins.find(c => c.position === pos);

// //   // ── Coin operations ──────────────────────────────────────────────────────
// //   const handleCellClick = (pos: number) => {
// //     if (coinAt(pos)) return;
// //     setCoins(prev => [...prev, {
// //       position: pos, colorCode: defaultCode, value: COMBO_COIN_VALUES[0],
// //       leftValue: "", rightValue: "", boostValue: "", boostSide: null,
// //     }]);
// //   };

// //   const removeCoin = (pos: number) => {
// //     const c = coinAt(pos);
// //     if (!c || c.fromBase) return;
// //     if (upgradePos === pos) {
// //       setUpgradePos(null); setUpgradeFeatSel(""); setUpgradeMultiSel(new Set());
// //     }
// //     setCoins(prev => prev.filter(x => x.position !== pos));
// //   };

// //   const updateCoin = (pos: number, field: keyof ComboCoin, val: any) =>
// //     setCoins(prev => prev.map(c => c.position === pos ? { ...c, [field]: val } : c));

// //   const setBoostSide = (pos: number, side: "LEFT" | "RIGHT", boostVal: string) => {
// //     setCoins(prev => prev.map(c => {
// //       if (c.position !== pos) return c;
// //       if (!boostVal) return { ...c, boostValue: "", boostSide: null };
// //       return { ...c, boostValue: boostVal, boostSide: side };
// //     }));
// //   };

// //   // ── Upgrade radio ────────────────────────────────────────────────────────
// //   const handleUpgradeRadio = (pos: number) => {
// //     if (upgradePos === pos) {
// //       setUpgradePos(null); setUpgradeFeatSel(""); setUpgradeMultiSel(new Set()); return;
// //     }
// //     setUpgradePos(pos); setUpgradeFeatSel(""); setUpgradeMultiSel(new Set());
// //   };

// //   const upgradeCoinn = upgradePos !== null ? coinAt(upgradePos) : null;

// //   // AllColor = the coin whose label starts with "AllColor" in this combo's palette
// //   const allColorEntry = coinColors.find(c => c.label.startsWith("AllColor"));
// //   const isAllColor = !!(upgradeCoinn && allColorEntry && upgradeCoinn.colorCode === allColorEntry.value);

// //   // Gold coins (label starts with "Gold") have no upgrade
// //   const goldCodes = new Set(coinColors.filter(c => c.label.startsWith("Gold")).map(c => c.value));

// //   const upgradeOptions: string[] = (() => {
// //     if (!upgradeCoinn) return [];
// //     // Gold coins never upgrade
// //     if (goldCodes.has(upgradeCoinn.colorCode)) return [];
// //     const activeFeaturesUpper = config.features.map(f => f.toUpperCase());
// //     if (isAllColor) {
// //       return ALL_UPGRADE_FEATURES.filter(f => !activeFeaturesUpper.includes(f));
// //     }
// //     return resolveUpgradeFeatures(upgradeCoinn.colorCode).filter(f => !activeFeaturesUpper.includes(f));
// //   })();

// //   const toggleMulti = (f: string) => {
// //     setUpgradeMultiSel(prev => {
// //       const next = new Set(prev);
// //       if (next.has(f)) next.delete(f); else next.add(f);
// //       return next;
// //     });
// //   };

// //   // The currently selected upgrade features (for the inline-confirm flow)
// //   const selectedUpgradeFeats: string[] = isAllColor
// //     ? Array.from(upgradeMultiSel)
// //     : upgradeFeatSel ? [upgradeFeatSel] : [];

// //   const canConfirmUpgrade = upgradePos !== null && selectedUpgradeFeats.length > 0;

// //   // ── Confirm upgrade inline — generates gaffe + navigates in one click ────
// //   const handleConfirmUpgrade = () => {
// //     if (!canConfirmUpgrade || upgradePos === null) return;

// //     // Build upgrade info
// //     const upgrade: UpgradeInfo = {
// //       col: Math.floor(upgradePos / 3),
// //       row: upgradePos % 3,
// //       features: selectedUpgradeFeats,
// //     };

// //     // Emit spin line with upgrade baked in
// //     const line = generateCombinationGaffe(coins, config, upgrade);
// //     onSpin(coins, line);

// //     // Navigate immediately to the new combo
// //     const newFeatures = [...new Set([...config.features, ...upgrade.features.map(f => f.toLowerCase())])];
// //     onUpgrade(newFeatures, coins);
// //   };

// //   // ── Spin ─────────────────────────────────────────────────────────────────
// //   const handleSpin = () => {
// //     if (spinsLeft <= 0) return;
// //     const cur = new Set(coins.map(c => c.position));
// //     const hasNew = [...cur].some(p => !lastSpinPositions.current.has(p));
// //     setSpinsLeft(hasNew ? MAX_SPINS : spinsLeft - 1);
// //     lastSpinPositions.current = cur;

// //     const line = generateCombinationGaffe(coins, config, null);
// //     onSpin(coins, line);
// //   };

// //   const resetFeature = () => {
// //     const seeded = baseCoins.map(c => ({ ...c, fromBase: true }));
// //     setCoins(seeded);
// //     setSpinsLeft(MAX_SPINS);
// //     lastSpinPositions.current = new Set(seeded.map(c => c.position));
// //     setUpgradePos(null); setUpgradeFeatSel(""); setUpgradeMultiSel(new Set());
// //     onReset();
// //   };

// //   const activeSplitter = config.hasZone ? (config.splitter ?? 1) : 0;
// //   const filled14 = coins.length >= 14 && (config.hasExtra || config.hasUltra);
// //   const cellMinH = config.hasDouble && config.hasUltra ? 150
// //                  : config.hasDouble                    ? 120
// //                  : config.hasUltra                     ? 110
// //                  : 100;

// //   return (
// //     <div className="bg-gray-800 rounded-xl border border-indigo-800">

// //       {/* HEADER */}
// //       <div onClick={() => setIsOpen(!isOpen)} className="flex justify-between items-center p-4 cursor-pointer select-none">
// //         <div className="flex items-center gap-2 flex-wrap">
// //           <h2 className="text-lg font-semibold text-white font-mono">⚡ Combination Feature</h2>
// //           {config.features.map(name => (
// //             <span key={name} className={`text-xs px-2 py-0.5 rounded capitalize font-mono ${FEATURE_BADGE[name] ?? "bg-gray-700 text-gray-300"}`}>
// //               {name}
// //             </span>
// //           ))}
// //           {config.hasZone && config.splitter && (
// //             <span className="text-xs px-2 py-0.5 rounded bg-sky-900 text-sky-300 border border-sky-700 font-mono">
// //               Splitter {config.splitter}
// //             </span>
// //           )}
// //         </div>
// //         <span className="text-gray-400">{isOpen ? "▼" : "▶"}</span>
// //       </div>

// //       {isOpen && (
// //         <div className="p-4 pt-0 flex flex-col gap-3">

// //           {/* SPIN CONTROLS */}
// //           <div className="flex items-center gap-3 flex-wrap">
// //             <button onClick={handleSpin} disabled={spinsLeft <= 0}
// //               className={`px-6 py-2 rounded font-bold text-white font-mono transition-all ${spinsLeft > 0 ? "bg-indigo-600 hover:bg-indigo-500" : "bg-gray-600 cursor-not-allowed opacity-50"}`}>
// //               SPIN
// //             </button>
// //             <span className="text-sm text-gray-400 font-mono">
// //               {spinsLeft} spin{spinsLeft !== 1 ? "s" : ""}
// //               {config.hasExtra && <span className="ml-1 text-emerald-400 text-xs">(4 — Extra)</span>}
// //             </span>
// //             <button onClick={resetFeature} className="px-3 py-1 bg-gray-600 hover:bg-gray-500 rounded text-sm">Reset</button>
// //             {filled14 && <span className="text-yellow-400 text-xs font-mono bg-yellow-900/40 px-2 py-0.5 rounded border border-yellow-700">⚠ 14 filled → lastPositionReel</span>}
// //           </div>

// //           {/* Double+Ultra info */}
// //           {config.hasDouble && config.hasUltra && (
// //             <div className="text-xs text-purple-300 font-mono bg-purple-900/30 px-3 py-1.5 rounded border border-purple-800">
// //               Double+Ultra: select boost on LEFT or RIGHT side per coin — choosing one locks the other. ✕ to clear.
// //             </div>
// //           )}

// //           {/* UPGRADE COIN SELECTED — feature picker + single Confirm button */}
// //           {upgradePos !== null && upgradeOptions.length > 0 && (
// //             <div className="flex flex-col gap-2 bg-yellow-900/20 border border-yellow-800 rounded-lg p-2">
// //               <span className="text-yellow-300 text-xs font-mono">
// //                 Upgrade {posToMetric(upgradePos)} →
// //                 {isAllColor ? " AllColor coin: select one or more features" : " select feature to add"}
// //               </span>
// //               {isAllColor ? (
// //                 <div className="flex gap-2 flex-wrap">
// //                   {upgradeOptions.map(f => (
// //                     <label key={f} className="flex items-center gap-1 cursor-pointer bg-yellow-900/40 border border-yellow-700 rounded px-2 py-1">
// //                       <input type="checkbox" className="accent-yellow-400 w-3 h-3"
// //                         checked={upgradeMultiSel.has(f)} onChange={() => toggleMulti(f)} />
// //                       <span className="text-yellow-100 text-xs font-mono">{f}</span>
// //                     </label>
// //                   ))}
// //                 </div>
// //               ) : (
// //                 <select className="bg-yellow-900 text-yellow-100 text-xs rounded px-2 py-1 font-mono border border-yellow-700 self-start"
// //                   value={upgradeFeatSel} onChange={e => setUpgradeFeatSel(e.target.value)}>
// //                   <option value="">Select feature...</option>
// //                   {upgradeOptions.map(f => <option key={f} value={f}>{f}</option>)}
// //                 </select>
// //               )}
// //               {canConfirmUpgrade && (
// //                 <button
// //                   onClick={handleConfirmUpgrade}
// //                   className="self-start px-4 py-1.5 bg-yellow-600 hover:bg-yellow-500 rounded font-bold text-sm font-mono transition-all">
// //                   ✦ Confirm → Go to {[...config.features, ...selectedUpgradeFeats.map(f => f.toLowerCase())]
// //                     .filter((v, i, a) => a.indexOf(v) === i).join(" + ")}
// //                 </button>
// //               )}
// //             </div>
// //           )}
// //           {upgradePos !== null && upgradeOptions.length === 0 && (
// //             <div className="text-xs text-gray-500 font-mono bg-gray-700 px-3 py-1.5 rounded">
// //               ℹ No upgrades available (all features already active or coin color doesn&apos;t support)
// //             </div>
// //           )}

// //           {/* GRID — 5 cols × 3 rows, column-major */}
// //           <div className="grid gap-1" style={{ gridTemplateColumns: "repeat(5, minmax(0, 1fr))" }}>
// //             {Array.from({ length: 3 }).map((_, row) =>
// //               Array.from({ length: 5 }).map((_, col) => {
// //                 const pos  = col * 3 + row;
// //                 const coin = coinAt(pos);

// //                 const zoneBg  = config.hasZone ? getZoneBgColor(pos, activeSplitter) : null;
// //                 const cellBg  = zoneBg
// //                   ? `${ZONE_BG_CLASS[zoneBg]} ${ZONE_BORDER_CLASS[zoneBg]}`
// //                   : "bg-gray-700 border-gray-600";
// //                 const hoverCls = !coin && !config.hasZone ? "hover:bg-gray-600 hover:border-gray-400" : "";

// //                 return (
// //                   <div key={pos} className="flex flex-col gap-1">
// //                     <div
// //                       onClick={() => !coin && handleCellClick(pos)}
// //                       className={`relative rounded-lg border-2 flex flex-col items-start p-1 text-xs text-white cursor-pointer transition-all hover:brightness-110 ${cellBg} ${hoverCls}`}
// //                       style={{ minHeight: cellMinH }}
// //                     >
// //                       <div className="flex justify-between w-full text-[9px] opacity-40 mb-0.5">
// //                         <span>{pos}</span>
// //                         <span className="font-mono">{posToMetric(pos)}</span>
// //                       </div>

// //                       {coin ? (
// //                         <div className="flex flex-col items-center w-full gap-0.5">

// //                           <div className="text-sm">🟡</div>

// //                           {/* Color dropdown */}
// //                           <select
// //                             className="bg-gray-800 text-white text-[9px] w-full rounded px-0.5 py-0.5 border-0 font-mono"
// //                             value={coin.colorCode}
// //                             onClick={e => e.stopPropagation()}
// //                             onChange={e => updateCoin(pos, "colorCode", Number(e.target.value))}
// //                           >
// //                             {coinColors.map(c => (
// //                               <option key={c.value} value={c.value} className="bg-gray-800">{c.label}</option>
// //                             ))}
// //                           </select>

// //                           {/* Value — Double: LEFT+RIGHT; others: single */}
// //                           {config.hasDouble ? (
// //                             <>
// //                               <div className="flex items-center gap-0.5 w-full">
// //                                 <span className="text-[7px] text-red-300 font-mono w-4 shrink-0">←L</span>
// //                                 <select className="bg-red-950 text-red-200 text-[9px] flex-1 rounded px-0 py-0.5 border-0 font-mono"
// //                                   value={coin.leftValue || ""}
// //                                   onClick={e => e.stopPropagation()}
// //                                   onChange={e => updateCoin(pos, "leftValue", e.target.value)}>
// //                                   <option value="">--</option>
// //                                   {COMBO_COIN_VALUES.map(v => <option key={v} value={v} className="bg-gray-800">{v}</option>)}
// //                                 </select>
// //                               </div>
// //                               <div className="flex items-center gap-0.5 w-full">
// //                                 <span className="text-[7px] text-red-300 font-mono w-4 shrink-0">R→</span>
// //                                 <select className="bg-red-950 text-red-200 text-[9px] flex-1 rounded px-0 py-0.5 border-0 font-mono"
// //                                   value={coin.rightValue || ""}
// //                                   onClick={e => e.stopPropagation()}
// //                                   onChange={e => updateCoin(pos, "rightValue", e.target.value)}>
// //                                   <option value="">--</option>
// //                                   {COMBO_COIN_VALUES.map(v => <option key={v} value={v} className="bg-gray-800">{v}</option>)}
// //                                 </select>
// //                               </div>
// //                             </>
// //                           ) : (
// //                             <select
// //                               className="bg-gray-800 text-white text-[9px] w-full rounded px-0.5 py-0.5 border-0 font-mono"
// //                               value={coin.value}
// //                               onClick={e => e.stopPropagation()}
// //                               onChange={e => updateCoin(pos, "value", e.target.value)}>
// //                               {COMBO_COIN_VALUES.map(v => (
// //                                 <option key={v} value={v} className="bg-gray-800">{v}</option>
// //                               ))}
// //                             </select>
// //                           )}

// //                           {/* Ultra boost — single dropdown when no double */}
// //                           {config.hasUltra && !config.hasDouble && (
// //                             <select
// //                               className="bg-purple-950 text-purple-200 text-[9px] w-full rounded px-0.5 py-0.5 border-0 font-mono"
// //                               value={coin.boostValue || ""}
// //                               onClick={e => e.stopPropagation()}
// //                               onChange={e => updateCoin(pos, "boostValue", e.target.value)}>
// //                               <option value="">Boost</option>
// //                               {ULTRA_BOOST_VALUES.map(v => <option key={v} value={v} className="bg-gray-800">{v}</option>)}
// //                             </select>
// //                           )}

// //                           {/* Ultra boost — LEFT/RIGHT side picker in Double+Ultra combo */}
// //                           {config.hasDouble && config.hasUltra && (
// //                             <div className="w-full mt-0.5" onClick={e => e.stopPropagation()}>
// //                               <div className="flex gap-0.5 w-full items-end">
// //                                 {(["LEFT", "RIGHT"] as const).map(side => {
// //                                   const isThis  = coin.boostSide === side;
// //                                   const locked  = !!(coin.boostSide && coin.boostSide !== side);
// //                                   return (
// //                                     <div key={side} className="flex flex-col items-center flex-1 gap-0">
// //                                       <span className={`text-[7px] font-mono ${isThis ? "text-yellow-300" : "text-gray-500"}`}>{side}</span>
// //                                       <select
// //                                         disabled={locked}
// //                                         className={`text-[8px] w-full rounded px-0 py-0.5 border-0 font-mono
// //                                           ${isThis ? "bg-yellow-700 text-yellow-100" : "bg-purple-950 text-purple-200"}
// //                                           ${locked ? "opacity-30 cursor-not-allowed" : ""}`}
// //                                         value={isThis ? (coin.boostValue || "") : ""}
// //                                         onChange={e => setBoostSide(pos, side, e.target.value)}>
// //                                         <option value="">--</option>
// //                                         {ULTRA_BOOST_VALUES.map(v => <option key={v} value={v} className="bg-gray-800">{v}</option>)}
// //                                       </select>
// //                                     </div>
// //                                   );
// //                                 })}
// //                                 {coin.boostSide && (
// //                                   <button
// //                                     className="text-red-400 hover:text-red-200 text-[8px] pb-0.5 ml-0.5"
// //                                     onClick={e => { e.stopPropagation(); updateCoin(pos, "boostValue", ""); updateCoin(pos, "boostSide", null); }}>✕</button>
// //                                 )}
// //                               </div>
// //                             </div>
// //                           )}

// //                           {/* Feature upgrade radio */}
// //                           <div className="flex items-center gap-1 mt-0.5 w-full" onClick={e => e.stopPropagation()}>
// //                             <input
// //                               type="radio" name="comboUpgrade"
// //                               className="accent-yellow-400 w-3 h-3 cursor-pointer"
// //                               checked={upgradePos === pos}
// //                               onChange={() => handleUpgradeRadio(pos)}
// //                             />
// //                             <span className="text-[8px] text-yellow-300 font-mono">upgrade</span>
// //                             {upgradePos === pos && !isAllColor && upgradeFeatSel && (
// //                               <span className="text-[8px] text-yellow-500 font-mono">→{upgradeFeatSel}</span>
// //                             )}
// //                             {upgradePos === pos && isAllColor && upgradeMultiSel.size > 0 && (
// //                               <span className="text-[8px] text-yellow-500 font-mono">→{Array.from(upgradeMultiSel).join("+")}</span>
// //                             )}
// //                           </div>

// //                           {/* Remove — non-base coins only */}
// //                           {!coin.fromBase && (
// //                             <button
// //                               onClick={e => { e.stopPropagation(); removeCoin(pos); }}
// //                               className="absolute top-1 right-1 text-[10px] text-red-300 hover:text-red-100 font-bold">✕</button>
// //                           )}

// //                         </div>
// //                       ) : (
// //                         <span className="text-white/40 text-[10px] mx-auto mt-4">+ Add</span>
// //                       )}
// //                     </div>
// //                   </div>
// //                 );
// //               })
// //             )}
// //           </div>

// //           {/* LEGEND */}
// //           <div className="text-[10px] text-gray-500 font-mono flex flex-wrap gap-2">
// //             <span>🟡 = coin · click empty cell to add · ✕ = remove</span>
// //             {config.hasDouble && <span>L← / R→ = LEFT / RIGHT coin values</span>}
// //             {config.hasUltra && !config.hasDouble && <span>Boost = ultra boost value</span>}
// //             {config.hasDouble && config.hasUltra && <span>L/R boost = side the boost applies to · ✕ to clear side</span>}
// //             {config.hasZone && <span>Background = zone regions (splitter {config.splitter})</span>}
// //             <span>✦ radio = upgrade · single-color = 1 feature · AllColor = multi-feature</span>
// //           </div>

// //         </div>
// //       )}
// //     </div>
// //   );
// // }



// /* eslint-disable @typescript-eslint/no-explicit-any */
// "use client";

// import { useState, useRef } from "react";
// import {
//   ComboCoin, ComboFeatureConfig,
//   getComboMaxSpins, getComboCoinColors,
//   generateCombinationGaffe, resolveUpgradeFeatures, UpgradeInfo,
// } from "./combinationFeatureGenerator";
// import { ZONE_BG_CLASS, ZONE_BORDER_CLASS, getZoneBgColor } from "./zoneFeatureGenerator";
// import { ULTRA_BOOST_VALUES } from "./ultraFeatureGenerator";
// import { posToMetric, ALL_UPGRADE_FEATURES } from "./config";

// // ── Constants ─────────────────────────────────────────────────────────────────
// // Fix #5: uppercase coin values
// const COMBO_COIN_VALUES = ["1", "2", "5", "MINOR", "MAJOR", "MINI"];

// const FEATURE_BADGE: Record<string, string> = {
//   double: "bg-red-900 text-red-300 border border-red-600",
//   extra:  "bg-emerald-900 text-emerald-300 border border-emerald-600",
//   zone:   "bg-sky-900 text-sky-300 border border-sky-600",
//   ultra:  "bg-purple-900 text-purple-300 border border-purple-600",
// };

// // ── Props ─────────────────────────────────────────────────────────────────────
// type Props = {
//   baseCoins:          ComboCoin[];
//   config:             ComboFeatureConfig;
//   pendingUpgradeInfo: UpgradeInfo | null;   // carried from single-feature upgrade
//   onSpin:             (snapshot: ComboCoin[], line: string) => void;
//   onReset:            () => void;
//   onUpgrade:          (newFeatures: string[], carryCoins: ComboCoin[], upgradeInfo: UpgradeInfo) => void;
// };

// // ── Component ─────────────────────────────────────────────────────────────────
// export default function CombinationFeature({ baseCoins, config, pendingUpgradeInfo, onSpin, onReset, onUpgrade }: Props) {
//   const MAX_SPINS  = getComboMaxSpins(config);
//   const coinColors = getComboCoinColors(config.features);
//   const defaultCode = coinColors[0].value;

//   const [isOpen,    setIsOpen]    = useState(true);
//   const initialSeeds = baseCoins.map(c => ({ ...c, fromBase: true }));
//   const [coins,     setCoins]     = useState<ComboCoin[]>(initialSeeds);
//   const [spinsLeft, setSpinsLeft] = useState(MAX_SPINS);
//   const lastSpinPositions = useRef<Set<number>>(new Set(initialSeeds.map(c => c.position)));

//   // Upgrade state
//   const [upgradePos,      setUpgradePos]      = useState<number | null>(null);
//   const [upgradeFeatSel,  setUpgradeFeatSel]  = useState<string>("");
//   const [upgradeMultiSel, setUpgradeMultiSel] = useState<Set<string>>(new Set());

//   const coinAt = (pos: number) => coins.find(c => c.position === pos);

//   // ── Coin operations ──────────────────────────────────────────────────────
//   const handleCellClick = (pos: number) => {
//     if (coinAt(pos)) return;
//     setCoins(prev => [...prev, {
//       position: pos, colorCode: defaultCode, value: COMBO_COIN_VALUES[0],
//       leftValue: "", rightValue: "", boostValue: "", boostSide: null,
//     }]);
//   };

//   const removeCoin = (pos: number) => {
//     const c = coinAt(pos);
//     if (!c || c.fromBase) return;
//     if (upgradePos === pos) {
//       setUpgradePos(null); setUpgradeFeatSel(""); setUpgradeMultiSel(new Set());
//     }
//     setCoins(prev => prev.filter(x => x.position !== pos));
//   };

//   const updateCoin = (pos: number, field: keyof ComboCoin, val: any) =>
//     setCoins(prev => prev.map(c => c.position === pos ? { ...c, [field]: val } : c));

//   const setBoostSide = (pos: number, side: "LEFT" | "RIGHT", boostVal: string) => {
//     setCoins(prev => prev.map(c => {
//       if (c.position !== pos) return c;
//       if (!boostVal) return { ...c, boostValue: "", boostSide: null };
//       return { ...c, boostValue: boostVal, boostSide: side };
//     }));
//   };

//   // ── Upgrade radio ────────────────────────────────────────────────────────
//   const handleUpgradeRadio = (pos: number) => {
//     if (upgradePos === pos) {
//       setUpgradePos(null); setUpgradeFeatSel(""); setUpgradeMultiSel(new Set()); return;
//     }
//     setUpgradePos(pos); setUpgradeFeatSel(""); setUpgradeMultiSel(new Set());
//   };

//   const upgradeCoinn = upgradePos !== null ? coinAt(upgradePos) : null;

//   // AllColor = the coin whose label starts with "AllColor" in this combo's palette
//   const allColorEntry = coinColors.find(c => c.label.startsWith("AllColor"));
//   const isAllColor = !!(upgradeCoinn && allColorEntry && upgradeCoinn.colorCode === allColorEntry.value);

//   // Gold coins (label starts with "Gold") have no upgrade
//   const goldCodes = new Set(coinColors.filter(c => c.label.startsWith("Gold")).map(c => c.value));

//   const upgradeOptions: string[] = (() => {
//     if (!upgradeCoinn) return [];
//     // Gold coins never upgrade
//     if (goldCodes.has(upgradeCoinn.colorCode)) return [];
//     const activeFeaturesUpper = config.features.map(f => f.toUpperCase());
//     if (isAllColor) {
//       return ALL_UPGRADE_FEATURES.filter(f => !activeFeaturesUpper.includes(f));
//     }
//     return resolveUpgradeFeatures(upgradeCoinn.colorCode).filter(f => !activeFeaturesUpper.includes(f));
//   })();

//   const toggleMulti = (f: string) => {
//     setUpgradeMultiSel(prev => {
//       const next = new Set(prev);
//       if (next.has(f)) next.delete(f); else next.add(f);
//       return next;
//     });
//   };

//   // The currently selected upgrade features (for combo-internal upgrade)
//   const selectedUpgradeFeats: string[] = isAllColor
//     ? Array.from(upgradeMultiSel)
//     : upgradeFeatSel ? [upgradeFeatSel] : [];

//   // Navigate immediately when upgrade feature selected in combo
//   const navigateComboUpgrade = (feats: string[]) => {
//     if (!upgradePos || feats.length === 0) return;
//     const upgradeInfo: UpgradeInfo = { col: Math.floor(upgradePos/3), row: upgradePos%3, features: feats };
//     const newFeatures = [...new Set([...config.features, ...feats.map(f => f.toLowerCase())])];
//     onUpgrade(newFeatures, coins, upgradeInfo);
//   };

//   // ── Spin ─────────────────────────────────────────────────────────────────
//   // Uses pendingUpgradeInfo (from single-feature upgrade) on first spin, then it's cleared by parent
//   const handleSpin = () => {
//     if (spinsLeft <= 0) return;
//     const cur = new Set(coins.map(c => c.position));
//     const hasNew = [...cur].some(p => !lastSpinPositions.current.has(p));
//     setSpinsLeft(hasNew ? MAX_SPINS : spinsLeft - 1);
//     lastSpinPositions.current = cur;

//     const line = generateCombinationGaffe(coins, config, pendingUpgradeInfo ?? null);
//     onSpin(coins, line);   // parent clears pendingUpgradeInfo after this
//   };

//   const resetFeature = () => {
//     const seeded = baseCoins.map(c => ({ ...c, fromBase: true }));
//     setCoins(seeded);
//     setSpinsLeft(MAX_SPINS);
//     lastSpinPositions.current = new Set(seeded.map(c => c.position));
//     setUpgradePos(null); setUpgradeFeatSel(""); setUpgradeMultiSel(new Set());
//     onReset();
//   };

//   const activeSplitter = config.hasZone ? (config.splitter ?? 1) : 0;
//   const filled14 = coins.length >= 14 && (config.hasExtra || config.hasUltra);
//   const cellMinH = config.hasDouble && config.hasUltra ? 150
//                  : config.hasDouble                    ? 120
//                  : config.hasUltra                     ? 110
//                  : 100;

//   return (
//     <div className="bg-gray-800 rounded-xl border border-indigo-800">

//       {/* HEADER */}
//       <div onClick={() => setIsOpen(!isOpen)} className="flex justify-between items-center p-4 cursor-pointer select-none">
//         <div className="flex items-center gap-2 flex-wrap">
//           <h2 className="text-lg font-semibold text-white font-mono">⚡ Combination Feature</h2>
//           {config.features.map(name => (
//             <span key={name} className={`text-xs px-2 py-0.5 rounded capitalize font-mono ${FEATURE_BADGE[name] ?? "bg-gray-700 text-gray-300"}`}>
//               {name}
//             </span>
//           ))}
//           {config.hasZone && config.splitter && (
//             <span className="text-xs px-2 py-0.5 rounded bg-sky-900 text-sky-300 border border-sky-700 font-mono">
//               Splitter {config.splitter}
//             </span>
//           )}
//           {pendingUpgradeInfo && (
//             <span className="text-xs px-2 py-0.5 rounded bg-yellow-900 text-yellow-300 border border-yellow-700 font-mono animate-pulse">
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
//             <button onClick={handleSpin} disabled={spinsLeft <= 0}
//               className={`px-6 py-2 rounded font-bold text-white font-mono transition-all ${spinsLeft > 0 ? "bg-indigo-600 hover:bg-indigo-500" : "bg-gray-600 cursor-not-allowed opacity-50"}`}>
//               SPIN
//             </button>
//             <span className="text-sm text-gray-400 font-mono">
//               {spinsLeft} spin{spinsLeft !== 1 ? "s" : ""}
//               {config.hasExtra && <span className="ml-1 text-emerald-400 text-xs">(4 — Extra)</span>}
//             </span>
//             <button onClick={resetFeature} className="px-3 py-1 bg-gray-600 hover:bg-gray-500 rounded text-sm">Reset</button>
//             {filled14 && <span className="text-yellow-400 text-xs font-mono bg-yellow-900/40 px-2 py-0.5 rounded border border-yellow-700">⚠ 14 filled → lastPositionReel</span>}
//           </div>

//           {/* Double+Ultra info */}
//           {config.hasDouble && config.hasUltra && (
//             <div className="text-xs text-purple-300 font-mono bg-purple-900/30 px-3 py-1.5 rounded border border-purple-800">
//               Double+Ultra: select boost on LEFT or RIGHT side per coin — choosing one locks the other. ✕ to clear.
//             </div>
//           )}

//           {/* UPGRADE COIN SELECTED — select feature → navigate immediately */}
//           {upgradePos !== null && upgradeOptions.length > 0 && (
//             <div className="flex flex-col gap-2 bg-yellow-900/20 border border-yellow-800 rounded-lg p-2">
//               <span className="text-yellow-300 text-xs font-mono font-bold">
//                 ✦ Upgrade at {posToMetric(upgradePos)} — select feature to add (navigates immediately):
//               </span>
//               {isAllColor ? (
//                 <div className="flex flex-col gap-2">
//                   <div className="flex gap-2 flex-wrap">
//                     {upgradeOptions.map(f => (
//                       <label key={f} className="flex items-center gap-1 cursor-pointer bg-yellow-900/40 border border-yellow-700 rounded px-2 py-1">
//                         <input type="checkbox" className="accent-yellow-400 w-3 h-3"
//                           checked={upgradeMultiSel.has(f)} onChange={() => toggleMulti(f)} />
//                         <span className="text-yellow-100 text-xs font-mono">{f}</span>
//                       </label>
//                     ))}
//                   </div>
//                   {upgradeMultiSel.size > 0 && (
//                     <button onClick={() => navigateComboUpgrade(Array.from(upgradeMultiSel))}
//                       className="self-start px-3 py-1 bg-yellow-600 hover:bg-yellow-500 rounded text-xs font-mono font-bold transition-all">
//                       → Go to {[...config.features, ...Array.from(upgradeMultiSel).map(f=>f.toLowerCase())].filter((v,i,a)=>a.indexOf(v)===i).join(" + ")}
//                     </button>
//                   )}
//                 </div>
//               ) : (
//                 <div className="flex gap-2 flex-wrap">
//                   {upgradeOptions.map(f => (
//                     <button key={f} onClick={() => navigateComboUpgrade([f])}
//                       className="px-3 py-1.5 bg-yellow-700 hover:bg-yellow-600 border border-yellow-600 rounded text-xs font-mono font-bold transition-all">
//                       → {f}
//                     </button>
//                   ))}
//                 </div>
//               )}
//             </div>
//           )}
//           {upgradePos !== null && upgradeOptions.length === 0 && (
//             <div className="text-xs text-gray-500 font-mono bg-gray-700 px-3 py-1.5 rounded">
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
//                       className={`relative rounded-lg border-2 flex flex-col items-start p-1 text-xs text-white cursor-pointer transition-all hover:brightness-110 ${cellBg} ${hoverCls}`}
//                       style={{ minHeight: cellMinH }}
//                     >
//                       <div className="flex justify-between w-full text-[9px] opacity-40 mb-0.5">
//                         <span>{pos}</span>
//                         <span className="font-mono">{posToMetric(pos)}</span>
//                       </div>

//                       {coin ? (
//                         <div className="flex flex-col items-center w-full gap-0.5">

//                           <div className="text-sm">🟡</div>

//                           {/* Color dropdown */}
//                           <select
//                             className="bg-gray-800 text-white text-[9px] w-full rounded px-0.5 py-0.5 border-0 font-mono"
//                             value={coin.colorCode}
//                             onClick={e => e.stopPropagation()}
//                             onChange={e => updateCoin(pos, "colorCode", Number(e.target.value))}
//                           >
//                             {coinColors.map(c => (
//                               <option key={c.value} value={c.value} className="bg-gray-800">{c.label}</option>
//                             ))}
//                           </select>

//                           {/* Value — Double: LEFT+RIGHT; others: single */}
//                           {config.hasDouble ? (
//                             <>
//                               <div className="flex items-center gap-0.5 w-full">
//                                 <span className="text-[7px] text-red-300 font-mono w-4 shrink-0">←L</span>
//                                 <select className="bg-red-950 text-red-200 text-[9px] flex-1 rounded px-0 py-0.5 border-0 font-mono"
//                                   value={coin.leftValue || ""}
//                                   onClick={e => e.stopPropagation()}
//                                   onChange={e => updateCoin(pos, "leftValue", e.target.value)}>
//                                   <option value="">--</option>
//                                   {COMBO_COIN_VALUES.map(v => <option key={v} value={v} className="bg-gray-800">{v}</option>)}
//                                 </select>
//                               </div>
//                               <div className="flex items-center gap-0.5 w-full">
//                                 <span className="text-[7px] text-red-300 font-mono w-4 shrink-0">R→</span>
//                                 <select className="bg-red-950 text-red-200 text-[9px] flex-1 rounded px-0 py-0.5 border-0 font-mono"
//                                   value={coin.rightValue || ""}
//                                   onClick={e => e.stopPropagation()}
//                                   onChange={e => updateCoin(pos, "rightValue", e.target.value)}>
//                                   <option value="">--</option>
//                                   {COMBO_COIN_VALUES.map(v => <option key={v} value={v} className="bg-gray-800">{v}</option>)}
//                                 </select>
//                               </div>
//                             </>
//                           ) : (
//                             <select
//                               className="bg-gray-800 text-white text-[9px] w-full rounded px-0.5 py-0.5 border-0 font-mono"
//                               value={coin.value}
//                               onClick={e => e.stopPropagation()}
//                               onChange={e => updateCoin(pos, "value", e.target.value)}>
//                               {COMBO_COIN_VALUES.map(v => (
//                                 <option key={v} value={v} className="bg-gray-800">{v}</option>
//                               ))}
//                             </select>
//                           )}

//                           {/* Ultra boost — single dropdown when no double */}
//                           {config.hasUltra && !config.hasDouble && (
//                             <select
//                               className="bg-purple-950 text-purple-200 text-[9px] w-full rounded px-0.5 py-0.5 border-0 font-mono"
//                               value={coin.boostValue || ""}
//                               onClick={e => e.stopPropagation()}
//                               onChange={e => updateCoin(pos, "boostValue", e.target.value)}>
//                               <option value="">Boost</option>
//                               {ULTRA_BOOST_VALUES.map(v => <option key={v} value={v} className="bg-gray-800">{v}</option>)}
//                             </select>
//                           )}

//                           {/* Ultra boost — LEFT/RIGHT side picker in Double+Ultra combo */}
//                           {config.hasDouble && config.hasUltra && (
//                             <div className="w-full mt-0.5" onClick={e => e.stopPropagation()}>
//                               <div className="flex gap-0.5 w-full items-end">
//                                 {(["LEFT", "RIGHT"] as const).map(side => {
//                                   const isThis  = coin.boostSide === side;
//                                   const locked  = !!(coin.boostSide && coin.boostSide !== side);
//                                   return (
//                                     <div key={side} className="flex flex-col items-center flex-1 gap-0">
//                                       <span className={`text-[7px] font-mono ${isThis ? "text-yellow-300" : "text-gray-500"}`}>{side}</span>
//                                       <select
//                                         disabled={locked}
//                                         className={`text-[8px] w-full rounded px-0 py-0.5 border-0 font-mono
//                                           ${isThis ? "bg-yellow-700 text-yellow-100" : "bg-purple-950 text-purple-200"}
//                                           ${locked ? "opacity-30 cursor-not-allowed" : ""}`}
//                                         value={isThis ? (coin.boostValue || "") : ""}
//                                         onChange={e => setBoostSide(pos, side, e.target.value)}>
//                                         <option value="">--</option>
//                                         {ULTRA_BOOST_VALUES.map(v => <option key={v} value={v} className="bg-gray-800">{v}</option>)}
//                                       </select>
//                                     </div>
//                                   );
//                                 })}
//                                 {coin.boostSide && (
//                                   <button
//                                     className="text-red-400 hover:text-red-200 text-[8px] pb-0.5 ml-0.5"
//                                     onClick={e => { e.stopPropagation(); updateCoin(pos, "boostValue", ""); updateCoin(pos, "boostSide", null); }}>✕</button>
//                                 )}
//                               </div>
//                             </div>
//                           )}

//                           {/* Feature upgrade radio */}
//                           <div className="flex items-center gap-1 mt-0.5 w-full" onClick={e => e.stopPropagation()}>
//                             <input
//                               type="radio" name="comboUpgrade"
//                               className="accent-yellow-400 w-3 h-3 cursor-pointer"
//                               checked={upgradePos === pos}
//                               onChange={() => handleUpgradeRadio(pos)}
//                             />
//                             <span className="text-[8px] text-yellow-300 font-mono">upgrade</span>
//                             {upgradePos === pos && !isAllColor && upgradeFeatSel && (
//                               <span className="text-[8px] text-yellow-500 font-mono">→{upgradeFeatSel}</span>
//                             )}
//                             {upgradePos === pos && isAllColor && upgradeMultiSel.size > 0 && (
//                               <span className="text-[8px] text-yellow-500 font-mono">→{Array.from(upgradeMultiSel).join("+")}</span>
//                             )}
//                           </div>

//                           {/* Remove — non-base coins only */}
//                           {!coin.fromBase && (
//                             <button
//                               onClick={e => { e.stopPropagation(); removeCoin(pos); }}
//                               className="absolute top-1 right-1 text-[10px] text-red-300 hover:text-red-100 font-bold">✕</button>
//                           )}

//                         </div>
//                       ) : (
//                         <span className="text-white/40 text-[10px] mx-auto mt-4">+ Add</span>
//                       )}
//                     </div>
//                   </div>
//                 );
//               })
//             )}
//           </div>

//           {/* LEGEND */}
//           <div className="text-[10px] text-gray-500 font-mono flex flex-wrap gap-2">
//             <span>🟡 = coin · click empty cell to add · ✕ = remove</span>
//             {config.hasDouble && <span>L← / R→ = LEFT / RIGHT coin values</span>}
//             {config.hasUltra && !config.hasDouble && <span>Boost = ultra boost value</span>}
//             {config.hasDouble && config.hasUltra && <span>L/R boost = side the boost applies to · ✕ to clear side</span>}
//             {config.hasZone && <span>Background = zone regions (splitter {config.splitter})</span>}
//             <span>✦ radio = upgrade · single-color = 1 feature · AllColor = multi-feature</span>
//           </div>

//         </div>
//       )}
//     </div>
//   );
// }


//! latest wokring code
/* eslint-disable @typescript-eslint/no-explicit-any */
// "use client";

// import { useState, useRef } from "react";
// import {
//   ComboCoin, ComboFeatureConfig,
//   getComboMaxSpins, getComboCoinColors,
//   generateCombinationGaffe, resolveUpgradeFeatures, UpgradeInfo,
// } from "./combinationFeatureGenerator";
// import { ZONE_BG_CLASS, ZONE_BORDER_CLASS, getZoneBgColor } from "./zoneFeatureGenerator";
// import { ULTRA_BOOST_VALUES } from "./ultraFeatureGenerator";
// import { posToMetric, ALL_UPGRADE_FEATURES } from "./config";

// // ── Constants ─────────────────────────────────────────────────────────────────
// // Fix #5: uppercase coin values
// const COMBO_COIN_VALUES = ["100", "250", "500", "MINOR", "MAJOR", "MINI"];

// const FEATURE_BADGE: Record<string, string> = {
//   double: "bg-red-900 text-red-300 border border-red-600",
//   extra:  "bg-emerald-900 text-emerald-300 border border-emerald-600",
//   zone:   "bg-sky-900 text-sky-300 border border-sky-600",
//   ultra:  "bg-purple-900 text-purple-300 border border-purple-600",
// };

// // ── Props ─────────────────────────────────────────────────────────────────────
// type Props = {
//   baseCoins:          ComboCoin[];
//   config:             ComboFeatureConfig;
//   pendingUpgradeInfo: UpgradeInfo | null;   // carried from single-feature upgrade
//   onSpin:             (snapshot: ComboCoin[], line: string) => void;
//   onReset:            () => void;
//   onUpgrade:          (newFeatures: string[], carryCoins: ComboCoin[], upgradeInfo: UpgradeInfo) => void;
// };

// // ── Component ─────────────────────────────────────────────────────────────────
// export default function CombinationFeature({ baseCoins, config, pendingUpgradeInfo, onSpin, onReset, onUpgrade }: Props) {
//   const MAX_SPINS  = getComboMaxSpins(config);
//   const coinColors = getComboCoinColors(config.features);
//   const defaultCode = coinColors[0].value;

//   const [isOpen,    setIsOpen]    = useState(true);
//   const initialSeeds = baseCoins.map(c => ({ ...c, fromBase: true }));
//   const [coins,     setCoins]     = useState<ComboCoin[]>(initialSeeds);
//   const [spinsLeft, setSpinsLeft] = useState(MAX_SPINS);
//   const lastSpinPositions = useRef<Set<number>>(new Set(initialSeeds.map(c => c.position)));

//   // Upgrade state
//   const [upgradePos,      setUpgradePos]      = useState<number | null>(null);
//   const [upgradeFeatSel,  setUpgradeFeatSel]  = useState<string>("");
//   const [upgradeMultiSel, setUpgradeMultiSel] = useState<Set<string>>(new Set());

//   const coinAt = (pos: number) => coins.find(c => c.position === pos);

//   // ── Coin operations ──────────────────────────────────────────────────────
//   const handleCellClick = (pos: number) => {
//     if (coinAt(pos)) return;
//     setCoins(prev => [...prev, {
//       position: pos, colorCode: defaultCode, value: COMBO_COIN_VALUES[0],
//       leftValue: "", rightValue: "", boostValue: "", boostSide: null,
//     }]);
//   };

//   const removeCoin = (pos: number) => {
//     const c = coinAt(pos);
//     if (!c || c.fromBase) return;
//     if (upgradePos === pos) {
//       setUpgradePos(null); setUpgradeFeatSel(""); setUpgradeMultiSel(new Set());
//     }
//     setCoins(prev => prev.filter(x => x.position !== pos));
//   };

//   const updateCoin = (pos: number, field: keyof ComboCoin, val: any) =>
//     setCoins(prev => prev.map(c => c.position === pos ? { ...c, [field]: val } : c));

//   const setBoostSide = (pos: number, side: "LEFT" | "RIGHT", boostVal: string) => {
//     setCoins(prev => prev.map(c => {
//       if (c.position !== pos) return c;
//       if (!boostVal) return { ...c, boostValue: "", boostSide: null };
//       return { ...c, boostValue: boostVal, boostSide: side };
//     }));
//   };

//   // ── Upgrade radio ────────────────────────────────────────────────────────
//   const handleUpgradeRadio = (pos: number) => {
//     if (upgradePos === pos) {
//       setUpgradePos(null); setUpgradeFeatSel(""); setUpgradeMultiSel(new Set()); return;
//     }
//     setUpgradePos(pos); setUpgradeFeatSel(""); setUpgradeMultiSel(new Set());
//   };

//   const upgradeCoinn = upgradePos !== null ? coinAt(upgradePos) : null;

//   // AllColor = the coin whose label starts with "AllColor" in this combo's palette
//   const allColorEntry = coinColors.find(c => c.label.startsWith("AllColor"));
//   const isAllColor = !!(upgradeCoinn && allColorEntry && upgradeCoinn.colorCode === allColorEntry.value);

//   // Gold coins (label starts with "Gold") have no upgrade
//   const goldCodes = new Set(coinColors.filter(c => c.label.startsWith("Gold")).map(c => c.value));

//   const upgradeOptions: string[] = (() => {
//     if (!upgradeCoinn) return [];
//     // Gold coins never upgrade
//     if (goldCodes.has(upgradeCoinn.colorCode)) return [];
//     const activeFeaturesUpper = config.features.map(f => f.toUpperCase());
//     if (isAllColor) {
//       return ALL_UPGRADE_FEATURES.filter(f => !activeFeaturesUpper.includes(f));
//     }
//     return resolveUpgradeFeatures(upgradeCoinn.colorCode).filter(f => !activeFeaturesUpper.includes(f));
//   })();

//   const toggleMulti = (f: string) => {
//     setUpgradeMultiSel(prev => {
//       const next = new Set(prev);
//       if (next.has(f)) next.delete(f); else next.add(f);
//       return next;
//     });
//   };

//   // The currently selected upgrade features (for combo-internal upgrade)
//   const selectedUpgradeFeats: string[] = isAllColor
//     ? Array.from(upgradeMultiSel)
//     : upgradeFeatSel ? [upgradeFeatSel] : [];

//   // Navigate immediately when upgrade feature selected in combo
//   const navigateComboUpgrade = (feats: string[]) => {
//     if (upgradePos === null || feats.length === 0) return;
//     const upgradeInfo: UpgradeInfo = { col: Math.floor(upgradePos/3), row: upgradePos%3, features: feats };
//     const newFeatures = [...new Set([...config.features, ...feats.map(f => f.toLowerCase())])];
//     onUpgrade(newFeatures, coins, upgradeInfo);
//   };

//   // ── Spin ─────────────────────────────────────────────────────────────────
//   // Uses pendingUpgradeInfo (from single-feature upgrade) on first spin, then it's cleared by parent
//   const handleSpin = () => {
//     if (spinsLeft <= 0) return;
//     const cur = new Set(coins.map(c => c.position));
//     const hasNew = [...cur].some(p => !lastSpinPositions.current.has(p));
//     setSpinsLeft(hasNew ? MAX_SPINS : spinsLeft - 1);
//     lastSpinPositions.current = cur;

//     const line = generateCombinationGaffe(coins, config, pendingUpgradeInfo ?? null);
//     onSpin(coins, line);   // parent clears pendingUpgradeInfo after this
//   };

//   const resetFeature = () => {
//     const seeded = baseCoins.map(c => ({ ...c, fromBase: true }));
//     setCoins(seeded);
//     setSpinsLeft(MAX_SPINS);
//     lastSpinPositions.current = new Set(seeded.map(c => c.position));
//     setUpgradePos(null); setUpgradeFeatSel(""); setUpgradeMultiSel(new Set());
//     onReset();
//   };

//   const activeSplitter = config.hasZone ? (config.splitter ?? 1) : 0;
//   const filled14 = coins.length >= 14 && (config.hasExtra || config.hasUltra);
//   const cellMinH = config.hasDouble && config.hasUltra ? 150
//                  : config.hasDouble                    ? 120
//                  : config.hasUltra                     ? 110
//                  : 100;

//   return (
//     <div className="bg-gray-800 rounded-xl border border-indigo-800">

//       {/* HEADER */}
//       <div onClick={() => setIsOpen(!isOpen)} className="flex justify-between items-center p-4 cursor-pointer select-none">
//         <div className="flex items-center gap-2 flex-wrap">
//           <h2 className="text-lg font-semibold text-white font-mono">⚡ Combination Feature</h2>
//           {config.features.map(name => (
//             <span key={name} className={`text-xs px-2 py-0.5 rounded capitalize font-mono ${FEATURE_BADGE[name] ?? "bg-gray-700 text-gray-300"}`}>
//               {name}
//             </span>
//           ))}
//           {config.hasZone && config.splitter && (
//             <span className="text-xs px-2 py-0.5 rounded bg-sky-900 text-sky-300 border border-sky-700 font-mono">
//               Splitter {config.splitter}
//             </span>
//           )}
//           {pendingUpgradeInfo && (
//             <span className="text-xs px-2 py-0.5 rounded bg-yellow-900 text-yellow-300 border border-yellow-700 font-mono animate-pulse">
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
//             <button onClick={handleSpin} disabled={spinsLeft <= 0}
//               className={`px-6 py-2 rounded font-bold text-white font-mono transition-all ${spinsLeft > 0 ? "bg-indigo-600 hover:bg-indigo-500" : "bg-gray-600 cursor-not-allowed opacity-50"}`}>
//               SPIN
//             </button>
//             <span className="text-sm text-gray-400 font-mono">
//               {spinsLeft} spin{spinsLeft !== 1 ? "s" : ""}
//               {config.hasExtra && <span className="ml-1 text-emerald-400 text-xs">(4 — Extra)</span>}
//             </span>
//             <button onClick={resetFeature} className="px-3 py-1 bg-gray-600 hover:bg-gray-500 rounded text-sm">Reset</button>
//             {filled14 && <span className="text-yellow-400 text-xs font-mono bg-yellow-900/40 px-2 py-0.5 rounded border border-yellow-700">⚠ 14 filled → lastPositionReel</span>}
//           </div>

//           {/* Double+Ultra info */}
//           {config.hasDouble && config.hasUltra && (
//             <div className="text-xs text-purple-300 font-mono bg-purple-900/30 px-3 py-1.5 rounded border border-purple-800">
//               Double+Ultra: select boost on LEFT or RIGHT side per coin — choosing one locks the other. ✕ to clear.
//             </div>
//           )}

//           {/* UPGRADE COIN SELECTED — select feature → navigate immediately */}
//           {upgradePos !== null && upgradeOptions.length > 0 && (
//             <div className="flex flex-col gap-2 bg-yellow-900/20 border border-yellow-800 rounded-lg p-2">
//               <span className="text-yellow-300 text-xs font-mono font-bold">
//                 ✦ Upgrade at {posToMetric(upgradePos)} — select feature to add (navigates immediately):
//               </span>
//               {isAllColor ? (
//                 <div className="flex flex-col gap-2">
//                   <div className="flex gap-2 flex-wrap">
//                     {upgradeOptions.map(f => (
//                       <label key={f} className="flex items-center gap-1 cursor-pointer bg-yellow-900/40 border border-yellow-700 rounded px-2 py-1">
//                         <input type="checkbox" className="accent-yellow-400 w-3 h-3"
//                           checked={upgradeMultiSel.has(f)} onChange={() => toggleMulti(f)} />
//                         <span className="text-yellow-100 text-xs font-mono">{f}</span>
//                       </label>
//                     ))}
//                   </div>
//                   {upgradeMultiSel.size > 0 && (
//                     <button onClick={() => navigateComboUpgrade(Array.from(upgradeMultiSel))}
//                       className="self-start px-3 py-1 bg-yellow-600 hover:bg-yellow-500 rounded text-xs font-mono font-bold transition-all">
//                       → Go to {[...config.features, ...Array.from(upgradeMultiSel).map(f=>f.toLowerCase())].filter((v,i,a)=>a.indexOf(v)===i).join(" + ")}
//                     </button>
//                   )}
//                 </div>
//               ) : (
//                 <div className="flex gap-2 flex-wrap">
//                   {upgradeOptions.map(f => (
//                     <button key={f} onClick={() => navigateComboUpgrade([f])}
//                       className="px-3 py-1.5 bg-yellow-700 hover:bg-yellow-600 border border-yellow-600 rounded text-xs font-mono font-bold transition-all">
//                       → {f}
//                     </button>
//                   ))}
//                 </div>
//               )}
//             </div>
//           )}
//           {upgradePos !== null && upgradeOptions.length === 0 && (
//             <div className="text-xs text-gray-500 font-mono bg-gray-700 px-3 py-1.5 rounded">
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
//                       className={`relative rounded-lg border-2 flex flex-col items-start p-1 text-xs text-white cursor-pointer transition-all hover:brightness-110 ${cellBg} ${hoverCls}`}
//                       style={{ minHeight: cellMinH }}
//                     >
//                       <div className="flex justify-between w-full text-[9px] opacity-40 mb-0.5">
//                         <span>{pos}</span>
//                         <span className="font-mono">{posToMetric(pos)}</span>
//                       </div>

//                       {coin ? (
//                         <div className="flex flex-col items-center w-full gap-0.5">

//                           <div className="text-sm">🟡</div>

//                           {/* Color dropdown */}
//                           <select
//                             className="bg-gray-800 text-white text-[9px] w-full rounded px-0.5 py-0.5 border-0 font-mono"
//                             value={coin.colorCode}
//                             onClick={e => e.stopPropagation()}
//                             onChange={e => updateCoin(pos, "colorCode", Number(e.target.value))}
//                           >
//                             {coinColors.map(c => (
//                               <option key={c.value} value={c.value} className="bg-gray-800">{c.label}</option>
//                             ))}
//                           </select>

//                           {/* Value — Double: LEFT+RIGHT; others: single */}
//                           {config.hasDouble ? (
//                             <>
//                               <div className="flex items-center gap-0.5 w-full">
//                                 <span className="text-[7px] text-red-300 font-mono w-4 shrink-0">←L</span>
//                                 <select className="bg-red-950 text-red-200 text-[9px] flex-1 rounded px-0 py-0.5 border-0 font-mono"
//                                   value={coin.leftValue || ""}
//                                   onClick={e => e.stopPropagation()}
//                                   onChange={e => updateCoin(pos, "leftValue", e.target.value)}>
//                                   <option value="">--</option>
//                                   {COMBO_COIN_VALUES.map(v => <option key={v} value={v} className="bg-gray-800">{v}</option>)}
//                                 </select>
//                               </div>
//                               <div className="flex items-center gap-0.5 w-full">
//                                 <span className="text-[7px] text-red-300 font-mono w-4 shrink-0">R→</span>
//                                 <select className="bg-red-950 text-red-200 text-[9px] flex-1 rounded px-0 py-0.5 border-0 font-mono"
//                                   value={coin.rightValue || ""}
//                                   onClick={e => e.stopPropagation()}
//                                   onChange={e => updateCoin(pos, "rightValue", e.target.value)}>
//                                   <option value="">--</option>
//                                   {COMBO_COIN_VALUES.map(v => <option key={v} value={v} className="bg-gray-800">{v}</option>)}
//                                 </select>
//                               </div>
//                             </>
//                           ) : (
//                             <select
//                               className="bg-gray-800 text-white text-[9px] w-full rounded px-0.5 py-0.5 border-0 font-mono"
//                               value={coin.value}
//                               onClick={e => e.stopPropagation()}
//                               onChange={e => updateCoin(pos, "value", e.target.value)}>
//                               {COMBO_COIN_VALUES.map(v => (
//                                 <option key={v} value={v} className="bg-gray-800">{v}</option>
//                               ))}
//                             </select>
//                           )}

//                           {/* Ultra boost — single dropdown when no double */}
//                           {config.hasUltra && !config.hasDouble && (
//                             <select
//                               className="bg-purple-950 text-purple-200 text-[9px] w-full rounded px-0.5 py-0.5 border-0 font-mono"
//                               value={coin.boostValue || ""}
//                               onClick={e => e.stopPropagation()}
//                               onChange={e => updateCoin(pos, "boostValue", e.target.value)}>
//                               <option value="">Boost</option>
//                               {ULTRA_BOOST_VALUES.map(v => <option key={v} value={v} className="bg-gray-800">{v}</option>)}
//                             </select>
//                           )}

//                           {/* Ultra boost — LEFT/RIGHT side picker in Double+Ultra combo */}
//                           {config.hasDouble && config.hasUltra && (
//                             <div className="w-full mt-0.5" onClick={e => e.stopPropagation()}>
//                               <div className="flex gap-0.5 w-full items-end">
//                                 {(["LEFT", "RIGHT"] as const).map(side => {
//                                   const isThis  = coin.boostSide === side;
//                                   const locked  = !!(coin.boostSide && coin.boostSide !== side);
//                                   return (
//                                     <div key={side} className="flex flex-col items-center flex-1 gap-0">
//                                       <span className={`text-[7px] font-mono ${isThis ? "text-yellow-300" : "text-gray-500"}`}>{side}</span>
//                                       <select
//                                         disabled={locked}
//                                         className={`text-[8px] w-full rounded px-0 py-0.5 border-0 font-mono
//                                           ${isThis ? "bg-yellow-700 text-yellow-100" : "bg-purple-950 text-purple-200"}
//                                           ${locked ? "opacity-30 cursor-not-allowed" : ""}`}
//                                         value={isThis ? (coin.boostValue || "") : ""}
//                                         onChange={e => setBoostSide(pos, side, e.target.value)}>
//                                         <option value="">--</option>
//                                         {ULTRA_BOOST_VALUES.map(v => <option key={v} value={v} className="bg-gray-800">{v}</option>)}
//                                       </select>
//                                     </div>
//                                   );
//                                 })}
//                                 {coin.boostSide && (
//                                   <button
//                                     className="text-red-400 hover:text-red-200 text-[8px] pb-0.5 ml-0.5"
//                                     onClick={e => { e.stopPropagation(); updateCoin(pos, "boostValue", ""); updateCoin(pos, "boostSide", null); }}>✕</button>
//                                 )}
//                               </div>
//                             </div>
//                           )}

//                           {/* Feature upgrade radio */}
//                           <div className="flex items-center gap-1 mt-0.5 w-full" onClick={e => e.stopPropagation()}>
//                             <input
//                               type="radio" name="comboUpgrade"
//                               className="accent-yellow-400 w-3 h-3 cursor-pointer"
//                               checked={upgradePos === pos}
//                               onChange={() => handleUpgradeRadio(pos)}
//                             />
//                             <span className="text-[8px] text-yellow-300 font-mono">upgrade</span>
//                             {upgradePos === pos && !isAllColor && upgradeFeatSel && (
//                               <span className="text-[8px] text-yellow-500 font-mono">→{upgradeFeatSel}</span>
//                             )}
//                             {upgradePos === pos && isAllColor && upgradeMultiSel.size > 0 && (
//                               <span className="text-[8px] text-yellow-500 font-mono">→{Array.from(upgradeMultiSel).join("+")}</span>
//                             )}
//                           </div>

//                           {/* Remove — non-base coins only */}
//                           {!coin.fromBase && (
//                             <button
//                               onClick={e => { e.stopPropagation(); removeCoin(pos); }}
//                               className="absolute top-1 right-1 text-[10px] text-red-300 hover:text-red-100 font-bold">✕</button>
//                           )}

//                         </div>
//                       ) : (
//                         <span className="text-white/40 text-[10px] mx-auto mt-4">+ Add</span>
//                       )}
//                     </div>
//                   </div>
//                 );
//               })
//             )}
//           </div>

//           {/* LEGEND */}
//           <div className="text-[10px] text-gray-500 font-mono flex flex-wrap gap-2">
//             <span>🟡 = coin · click empty cell to add · ✕ = remove</span>
//             {config.hasDouble && <span>L← / R→ = LEFT / RIGHT coin values</span>}
//             {config.hasUltra && !config.hasDouble && <span>Boost = ultra boost value</span>}
//             {config.hasDouble && config.hasUltra && <span>L/R boost = side the boost applies to · ✕ to clear side</span>}
//             {config.hasZone && <span>Background = zone regions (splitter {config.splitter})</span>}
//             <span>✦ radio = upgrade · single-color = 1 feature · AllColor = multi-feature</span>
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
} from "./combinationFeatureGenerator";
import { ZONE_BG_CLASS, ZONE_BORDER_CLASS, getZoneBgColor } from "./zoneFeatureGenerator";
import { ULTRA_BOOST_VALUES } from "./ultraFeatureGenerator";
import { posToMetric, ALL_UPGRADE_FEATURES, ZONE_SPLITTER_OPTIONS } from "./config";

// ── Constants ─────────────────────────────────────────────────────────────────
// Fix #5: uppercase coin values
const COMBO_COIN_VALUES = ["100", "250", "500", "MINOR", "MAJOR", "MINI"];

const FEATURE_BADGE: Record<string, string> = {
  double: "bg-red-900 text-red-300 border border-red-600",
  extra:  "bg-emerald-900 text-emerald-300 border border-emerald-600",
  zone:   "bg-sky-900 text-sky-300 border border-sky-600",
  ultra:  "bg-purple-900 text-purple-300 border border-purple-600",
};

// ── Props ─────────────────────────────────────────────────────────────────────
type Props = {
  baseCoins:          ComboCoin[];
  config:             ComboFeatureConfig;
  pendingUpgradeInfo: UpgradeInfo | null;   // carried from single-feature upgrade
  onSpin:             (snapshot: ComboCoin[], line: string) => void;
  onReset:            () => void;
  onUpgrade:          (newFeatures: string[], carryCoins: ComboCoin[], upgradeInfo: UpgradeInfo) => void;
};

// ── Component ─────────────────────────────────────────────────────────────────
export default function CombinationFeature({ baseCoins, config, pendingUpgradeInfo, onSpin, onReset, onUpgrade }: Props) {
  const MAX_SPINS  = getComboMaxSpins(config);
  const coinColors = getComboCoinColors(config.features);
  const defaultCode = coinColors[0].value;

  const [isOpen,    setIsOpen]    = useState(true);
  const initialSeeds = baseCoins.map(c => ({ ...c, fromBase: true }));
  const [coins,     setCoins]     = useState<ComboCoin[]>(initialSeeds);
  const [spinsLeft, setSpinsLeft] = useState(MAX_SPINS);
  const lastSpinPositions = useRef<Set<number>>(new Set(initialSeeds.map(c => c.position)));

  // Upgrade state
  const [upgradePos,          setUpgradePos]          = useState<number | null>(null);
  const [upgradeFeatSel,      setUpgradeFeatSel]      = useState<string>("");
  const [upgradeMultiSel,     setUpgradeMultiSel]     = useState<Set<string>>(new Set());
  const [upgradeZoneSplitter, setUpgradeZoneSplitter] = useState<string>("");
  const [upgradeZoneMultiRaw, setUpgradeZoneMultiRaw] = useState<string>("");

  const coinAt = (pos: number) => coins.find(c => c.position === pos);

  // ── Coin operations ──────────────────────────────────────────────────────
  const handleCellClick = (pos: number) => {
    if (coinAt(pos)) return;
    setCoins(prev => [...prev, {
      position: pos, colorCode: defaultCode, value: COMBO_COIN_VALUES[0],
      leftValue: "", rightValue: "", boostValue: "", boostSide: null,
    }]);
  };

  const removeCoin = (pos: number) => {
    const c = coinAt(pos);
    if (!c || c.fromBase) return;
    if (upgradePos === pos) {
      setUpgradePos(null); setUpgradeFeatSel(""); setUpgradeMultiSel(new Set());
    }
    setCoins(prev => prev.filter(x => x.position !== pos));
  };

  const updateCoin = (pos: number, field: keyof ComboCoin, val: any) =>
    setCoins(prev => prev.map(c => c.position === pos ? { ...c, [field]: val } : c));

  const setBoostSide = (pos: number, side: "LEFT" | "RIGHT", boostVal: string) => {
    setCoins(prev => prev.map(c => {
      if (c.position !== pos) return c;
      if (!boostVal) return { ...c, boostValue: "", boostSide: null };
      return { ...c, boostValue: boostVal, boostSide: side };
    }));
  };

  // ── Upgrade radio ────────────────────────────────────────────────────────
  const handleUpgradeRadio = (pos: number) => {
    if (upgradePos === pos) {
      setUpgradePos(null); setUpgradeFeatSel(""); setUpgradeMultiSel(new Set()); setUpgradeZoneSplitter(""); setUpgradeZoneMultiRaw(""); return;
    }
    setUpgradePos(pos); setUpgradeFeatSel(""); setUpgradeMultiSel(new Set()); setUpgradeZoneSplitter(""); setUpgradeZoneMultiRaw("");
  };

  const upgradeCoinn = upgradePos !== null ? coinAt(upgradePos) : null;

  // AllColor = the coin whose label starts with "AllColor" in this combo's palette
  const allColorEntry = coinColors.find(c => c.label.startsWith("AllColor"));
  const isAllColor = !!(upgradeCoinn && allColorEntry && upgradeCoinn.colorCode === allColorEntry.value);

  // Gold coins (label starts with "Gold") have no upgrade
  const goldCodes = new Set(coinColors.filter(c => c.label.startsWith("Gold")).map(c => c.value));

  // Build a colorCode→feature map using color-name semantics from palette labels:
  // Red→DOUBLE, Blue→ZONE, Green→EXTRA, Purple→ULTRA
  const COLOR_LABEL_TO_FEATURE: Record<string, string> = {
    Red: "DOUBLE", Blue: "ZONE", Green: "EXTRA", Purple: "ULTRA",
  };
  const activeFeaturesUpper = config.features.map(f => f.toUpperCase());
  const inactiveFeatures    = ALL_UPGRADE_FEATURES.filter(f => !activeFeaturesUpper.includes(f));
  const paletteUpgradeMap: Record<number, string> = {};
  coinColors.forEach(c => {
    const colorName = c.label.split("(")[0]; // e.g. "Purple" from "Purple(4)"
    const feat = COLOR_LABEL_TO_FEATURE[colorName];
    if (feat) paletteUpgradeMap[c.value] = feat;
  });

  const upgradeOptions: string[] = (() => {
    if (!upgradeCoinn) return [];
    if (goldCodes.has(upgradeCoinn.colorCode)) return [];
    if (isAllColor) return inactiveFeatures;
    const feat = paletteUpgradeMap[upgradeCoinn.colorCode];
    // Only offer if that feature is actually inactive in this combo
    return feat && !activeFeaturesUpper.includes(feat) ? [feat] : [];
  })();

  const toggleMulti = (f: string) => {
    setUpgradeMultiSel(prev => {
      const next = new Set(prev);
      if (next.has(f)) next.delete(f); else next.add(f);
      return next;
    });
  };

  // The currently selected upgrade features (for combo-internal upgrade)
  const selectedUpgradeFeats: string[] = isAllColor
    ? Array.from(upgradeMultiSel)
    : upgradeFeatSel ? [upgradeFeatSel] : [];

  // Navigate immediately when upgrade feature selected in combo
  const navigateComboUpgrade = (feats: string[]) => {
    if (upgradePos === null || feats.length === 0) return;
    const hasZone = feats.map(f => f.toUpperCase()).includes("ZONE");
    const upgradeInfo: UpgradeInfo = {
      col: Math.floor(upgradePos/3), row: upgradePos%3, features: feats,
      ...(hasZone && upgradeZoneSplitter ? { zoneSplitter: Number(upgradeZoneSplitter) } : {}),
      ...(hasZone && upgradeZoneMultiRaw ? { zoneMultipliers: upgradeZoneMultiRaw.split(",").map(n=>n.trim()).filter(Boolean).map(Number) } : {}),
    };
    const newFeatures = [...new Set([...config.features, ...feats.map(f => f.toLowerCase())])];
    onUpgrade(newFeatures, coins, upgradeInfo);
  };

  // ── Spin ─────────────────────────────────────────────────────────────────
  // Uses pendingUpgradeInfo (from single-feature upgrade) on first spin, then it's cleared by parent
  const handleSpin = () => {
    if (spinsLeft <= 0) return;
    const cur = new Set(coins.map(c => c.position));
    const hasNew = [...cur].some(p => !lastSpinPositions.current.has(p));
    // If this is an upgrade spin (pendingUpgradeInfo set), always reset to MAX
    const nextSpins = pendingUpgradeInfo ? MAX_SPINS : (hasNew ? MAX_SPINS : spinsLeft - 1);
    setSpinsLeft(nextSpins);
    lastSpinPositions.current = cur;

    // Merge zone params from pendingUpgradeInfo into config for this spin's output.
    // The parent rebuilds config without knowing the user's selected zoneSplitter,
    // so we carry it over from pendingUpgradeInfo here.
    const effectiveConfig: ComboFeatureConfig = {
      ...config,
      ...(pendingUpgradeInfo?.zoneSplitter
        ? { splitter: pendingUpgradeInfo.zoneSplitter }
        : {}),
      ...(pendingUpgradeInfo?.zoneMultipliers?.length
        ? { multipliers: pendingUpgradeInfo.zoneMultipliers }
        : {}),
    };

    const line = generateCombinationGaffe(coins, effectiveConfig, pendingUpgradeInfo ?? null);
    onSpin(coins, line);   // parent clears pendingUpgradeInfo after this
  };

  const resetFeature = () => {
    const seeded = baseCoins.map(c => ({ ...c, fromBase: true }));
    setCoins(seeded);
    setSpinsLeft(MAX_SPINS);
    lastSpinPositions.current = new Set(seeded.map(c => c.position));
    setUpgradePos(null); setUpgradeFeatSel(""); setUpgradeMultiSel(new Set()); setUpgradeZoneSplitter(""); setUpgradeZoneMultiRaw("");
    onReset();
  };

  const activeSplitter = config.hasZone ? (config.splitter ?? 1) : 0;
  const filled14 = coins.length >= 14 && (config.hasExtra || config.hasUltra);
  const cellMinH = config.hasDouble && config.hasUltra ? 150
                 : config.hasDouble                    ? 120
                 : config.hasUltra                     ? 110
                 : 100;

  return (
    <div className="bg-gray-800 rounded-xl border border-indigo-800">

      {/* HEADER */}
      <div onClick={() => setIsOpen(!isOpen)} className="flex justify-between items-center p-4 cursor-pointer select-none">
        <div className="flex items-center gap-2 flex-wrap">
          <h2 className="text-lg font-semibold text-white font-mono">⚡ Combination Feature</h2>
          {config.features.map(name => (
            <span key={name} className={`text-xs px-2 py-0.5 rounded capitalize font-mono ${FEATURE_BADGE[name] ?? "bg-gray-700 text-gray-300"}`}>
              {name}
            </span>
          ))}
          {config.hasZone && config.splitter && (
            <span className="text-xs px-2 py-0.5 rounded bg-sky-900 text-sky-300 border border-sky-700 font-mono">
              Splitter {config.splitter}
            </span>
          )}
          {pendingUpgradeInfo && (
            <span className="text-xs px-2 py-0.5 rounded bg-yellow-900 text-yellow-300 border border-yellow-700 font-mono animate-pulse">
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
            <button onClick={handleSpin} disabled={spinsLeft <= 0}
              className={`px-6 py-2 rounded font-bold text-white font-mono transition-all ${spinsLeft > 0 ? "bg-indigo-600 hover:bg-indigo-500" : "bg-gray-600 cursor-not-allowed opacity-50"}`}>
              SPIN
            </button>
            <span className="text-sm text-gray-400 font-mono">
              {spinsLeft} spin{spinsLeft !== 1 ? "s" : ""}
              {config.hasExtra && <span className="ml-1 text-emerald-400 text-xs">(4 — Extra)</span>}
            </span>
            <button onClick={resetFeature} className="px-3 py-1 bg-gray-600 hover:bg-gray-500 rounded text-sm">Reset</button>
            {filled14 && <span className="text-yellow-400 text-xs font-mono bg-yellow-900/40 px-2 py-0.5 rounded border border-yellow-700">⚠ 14 filled → lastPositionReel</span>}
          </div>

          {/* Double+Ultra info */}
          {config.hasDouble && config.hasUltra && (
            <div className="text-xs text-purple-300 font-mono bg-purple-900/30 px-3 py-1.5 rounded border border-purple-800">
              Double+Ultra: select boost on LEFT or RIGHT side per coin — choosing one locks the other. ✕ to clear.
            </div>
          )}

          {/* UPGRADE COIN SELECTED — select feature → navigate immediately */}
          {upgradePos !== null && upgradeOptions.length > 0 && (
            <div className="flex flex-col gap-2 bg-yellow-900/20 border border-yellow-800 rounded-lg p-3">
              <span className="text-yellow-300 text-xs font-mono font-bold">
                ✦ Upgrade at {posToMetric(upgradePos)} — select feature to add:
              </span>
              {isAllColor ? (
                <div className="flex flex-col gap-2">
                  <div className="flex gap-2 flex-wrap">
                    {upgradeOptions.map(f => (
                      <label key={f} className="flex items-center gap-1 cursor-pointer bg-yellow-900/40 border border-yellow-700 rounded px-2 py-1">
                        <input type="checkbox" className="accent-yellow-400 w-3 h-3"
                          checked={upgradeMultiSel.has(f)} onChange={() => toggleMulti(f)} />
                        <span className="text-yellow-100 text-xs font-mono">{f}</span>
                      </label>
                    ))}
                  </div>
                  {upgradeMultiSel.has("ZONE") && (
                    <div className="flex gap-3 flex-wrap items-center bg-sky-900/30 border border-sky-800 rounded p-2">
                      <span className="text-sky-300 text-[10px] font-mono">Zone params:</span>
                      <div className="flex items-center gap-1">
                        <span className="text-[10px] text-sky-300 font-mono">Splitter</span>
                        <select className="bg-sky-950 text-sky-200 text-xs rounded px-1 py-0.5 font-mono border border-sky-700"
                          value={upgradeZoneSplitter} onChange={e => setUpgradeZoneSplitter(e.target.value)}>
                          <option value="">--</option>
                          {ZONE_SPLITTER_OPTIONS.map(v => <option key={v} value={v}>{v}</option>)}
                        </select>
                      </div>
                      <div className="flex items-center gap-1">
                        <span className="text-[10px] text-sky-300 font-mono">Multipliers</span>
                        <input type="text" placeholder="e.g. 2,3" value={upgradeZoneMultiRaw} onChange={e => setUpgradeZoneMultiRaw(e.target.value)}
                          className="bg-sky-950 text-sky-200 text-xs rounded px-1 py-0.5 font-mono border border-sky-700 w-20" />
                      </div>
                    </div>
                  )}
                  {upgradeMultiSel.size > 0 && (
                    <button onClick={() => navigateComboUpgrade(Array.from(upgradeMultiSel))}
                      className="self-start px-3 py-1 bg-yellow-600 hover:bg-yellow-500 rounded text-xs font-mono font-bold transition-all">
                      → Go to {[...config.features, ...Array.from(upgradeMultiSel).map(f=>f.toLowerCase())].filter((v,i,a)=>a.indexOf(v)===i).join(" + ")}
                    </button>
                  )}
                </div>
              ) : (
                <div className="flex flex-col gap-2">
                  <div className="flex gap-2 flex-wrap">
                    {upgradeOptions.filter(f => f !== "ZONE").map(f => (
                      <button key={f} onClick={() => navigateComboUpgrade([f])}
                        className="px-3 py-1.5 bg-yellow-700 hover:bg-yellow-600 border border-yellow-600 rounded text-xs font-mono font-bold transition-all">
                        → {f}
                      </button>
                    ))}
                  </div>
                  {upgradeOptions.includes("ZONE") && (
                    <div className="flex flex-col gap-1.5">
                      <div className="flex gap-3 flex-wrap items-center bg-sky-900/30 border border-sky-800 rounded p-2">
                        <span className="text-sky-300 text-[10px] font-mono">Zone params:</span>
                        <div className="flex items-center gap-1">
                          <span className="text-[10px] text-sky-300 font-mono">Splitter</span>
                          <select className="bg-sky-950 text-sky-200 text-xs rounded px-1 py-0.5 font-mono border border-sky-700"
                            value={upgradeZoneSplitter} onChange={e => setUpgradeZoneSplitter(e.target.value)}>
                            <option value="">--</option>
                            {ZONE_SPLITTER_OPTIONS.map(v => <option key={v} value={v}>{v}</option>)}
                          </select>
                        </div>
                        <div className="flex items-center gap-1">
                          <span className="text-[10px] text-sky-300 font-mono">Multipliers</span>
                          <input type="text" placeholder="e.g. 2,3" value={upgradeZoneMultiRaw} onChange={e => setUpgradeZoneMultiRaw(e.target.value)}
                            className="bg-sky-950 text-sky-200 text-xs rounded px-1 py-0.5 font-mono border border-sky-700 w-20" />
                        </div>
                      </div>
                      <button onClick={() => navigateComboUpgrade(["ZONE"])}
                        className="self-start px-3 py-1 bg-sky-700 hover:bg-sky-600 border border-sky-500 rounded text-xs font-mono font-bold transition-all">
                        → Go to {[...config.features, "zone"].join(" + ")}
                      </button>
                    </div>
                  )}
                </div>
              )}
            </div>
          )}
          {upgradePos !== null && upgradeOptions.length === 0 && (
            <div className="text-xs text-gray-500 font-mono bg-gray-700 px-3 py-1.5 rounded">
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
                      className={`relative rounded-lg border-2 flex flex-col items-start p-1 text-xs text-white cursor-pointer transition-all hover:brightness-110 ${cellBg} ${hoverCls}`}
                      style={{ minHeight: cellMinH }}
                    >
                      <div className="flex justify-between w-full text-[9px] opacity-40 mb-0.5">
                        <span>{pos}</span>
                        <span className="font-mono">{posToMetric(pos)}</span>
                      </div>

                      {coin ? (
                        <div className="flex flex-col items-center w-full gap-0.5">

                          <div className="text-sm">🟡</div>

                          {/* Color dropdown */}
                          <select
                            className="bg-gray-800 text-white text-[9px] w-full rounded px-0.5 py-0.5 border-0 font-mono"
                            value={coin.colorCode}
                            onClick={e => e.stopPropagation()}
                            onChange={e => updateCoin(pos, "colorCode", Number(e.target.value))}
                          >
                            {coinColors.map(c => (
                              <option key={c.value} value={c.value} className="bg-gray-800">{c.label}</option>
                            ))}
                          </select>

                          {/* Value — Double: LEFT+RIGHT; others: single */}
                          {config.hasDouble ? (
                            <>
                              <div className="flex items-center gap-0.5 w-full">
                                <span className="text-[7px] text-red-300 font-mono w-4 shrink-0">←L</span>
                                <select className="bg-red-950 text-red-200 text-[9px] flex-1 rounded px-0 py-0.5 border-0 font-mono"
                                  value={coin.leftValue || ""}
                                  onClick={e => e.stopPropagation()}
                                  onChange={e => updateCoin(pos, "leftValue", e.target.value)}>
                                  <option value="">--</option>
                                  {COMBO_COIN_VALUES.map(v => <option key={v} value={v} className="bg-gray-800">{v}</option>)}
                                </select>
                              </div>
                              <div className="flex items-center gap-0.5 w-full">
                                <span className="text-[7px] text-red-300 font-mono w-4 shrink-0">R→</span>
                                <select className="bg-red-950 text-red-200 text-[9px] flex-1 rounded px-0 py-0.5 border-0 font-mono"
                                  value={coin.rightValue || ""}
                                  onClick={e => e.stopPropagation()}
                                  onChange={e => updateCoin(pos, "rightValue", e.target.value)}>
                                  <option value="">--</option>
                                  {COMBO_COIN_VALUES.map(v => <option key={v} value={v} className="bg-gray-800">{v}</option>)}
                                </select>
                              </div>
                            </>
                          ) : (
                            <select
                              className="bg-gray-800 text-white text-[9px] w-full rounded px-0.5 py-0.5 border-0 font-mono"
                              value={coin.value}
                              onClick={e => e.stopPropagation()}
                              onChange={e => updateCoin(pos, "value", e.target.value)}>
                              {COMBO_COIN_VALUES.map(v => (
                                <option key={v} value={v} className="bg-gray-800">{v}</option>
                              ))}
                            </select>
                          )}

                          {/* Ultra boost — single dropdown when no double */}
                          {config.hasUltra && !config.hasDouble && (
                            <select
                              className="bg-purple-950 text-purple-200 text-[9px] w-full rounded px-0.5 py-0.5 border-0 font-mono"
                              value={coin.boostValue || ""}
                              onClick={e => e.stopPropagation()}
                              onChange={e => updateCoin(pos, "boostValue", e.target.value)}>
                              <option value="">Boost</option>
                              {ULTRA_BOOST_VALUES.map(v => <option key={v} value={v} className="bg-gray-800">{v}</option>)}
                            </select>
                          )}

                          {/* Ultra boost — LEFT/RIGHT side picker in Double+Ultra combo */}
                          {config.hasDouble && config.hasUltra && (
                            <div className="w-full mt-0.5" onClick={e => e.stopPropagation()}>
                              <div className="flex gap-0.5 w-full items-end">
                                {(["LEFT", "RIGHT"] as const).map(side => {
                                  const isThis  = coin.boostSide === side;
                                  const locked  = !!(coin.boostSide && coin.boostSide !== side);
                                  return (
                                    <div key={side} className="flex flex-col items-center flex-1 gap-0">
                                      <span className={`text-[7px] font-mono ${isThis ? "text-yellow-300" : "text-gray-500"}`}>{side}</span>
                                      <select
                                        disabled={locked}
                                        className={`text-[8px] w-full rounded px-0 py-0.5 border-0 font-mono
                                          ${isThis ? "bg-yellow-700 text-yellow-100" : "bg-purple-950 text-purple-200"}
                                          ${locked ? "opacity-30 cursor-not-allowed" : ""}`}
                                        value={isThis ? (coin.boostValue || "") : ""}
                                        onChange={e => setBoostSide(pos, side, e.target.value)}>
                                        <option value="">--</option>
                                        {ULTRA_BOOST_VALUES.map(v => <option key={v} value={v} className="bg-gray-800">{v}</option>)}
                                      </select>
                                    </div>
                                  );
                                })}
                                {coin.boostSide && (
                                  <button
                                    className="text-red-400 hover:text-red-200 text-[8px] pb-0.5 ml-0.5"
                                    onClick={e => { e.stopPropagation(); updateCoin(pos, "boostValue", ""); updateCoin(pos, "boostSide", null); }}>✕</button>
                                )}
                              </div>
                            </div>
                          )}

                          {/* Feature upgrade radio */}
                          <div className="flex items-center gap-1 mt-0.5 w-full" onClick={e => e.stopPropagation()}>
                            <input
                              type="radio" name="comboUpgrade"
                              className="accent-yellow-400 w-3 h-3 cursor-pointer"
                              checked={upgradePos === pos}
                              onChange={() => handleUpgradeRadio(pos)}
                            />
                            <span className="text-[8px] text-yellow-300 font-mono">upgrade</span>
                            {upgradePos === pos && !isAllColor && upgradeFeatSel && (
                              <span className="text-[8px] text-yellow-500 font-mono">→{upgradeFeatSel}</span>
                            )}
                            {upgradePos === pos && isAllColor && upgradeMultiSel.size > 0 && (
                              <span className="text-[8px] text-yellow-500 font-mono">→{Array.from(upgradeMultiSel).join("+")}</span>
                            )}
                          </div>

                          {/* Remove — non-base coins only */}
                          {!coin.fromBase && (
                            <button
                              onClick={e => { e.stopPropagation(); removeCoin(pos); }}
                              className="absolute top-1 right-1 text-[10px] text-red-300 hover:text-red-100 font-bold">✕</button>
                          )}

                        </div>
                      ) : (
                        <span className="text-white/40 text-[10px] mx-auto mt-4">+ Add</span>
                      )}
                    </div>
                  </div>
                );
              })
            )}
          </div>

          {/* LEGEND */}
          <div className="text-[10px] text-gray-500 font-mono flex flex-wrap gap-2">
            <span>🟡 = coin · click empty cell to add · ✕ = remove</span>
            {config.hasDouble && <span>L← / R→ = LEFT / RIGHT coin values</span>}
            {config.hasUltra && !config.hasDouble && <span>Boost = ultra boost value</span>}
            {config.hasDouble && config.hasUltra && <span>L/R boost = side the boost applies to · ✕ to clear side</span>}
            {config.hasZone && <span>Background = zone regions (splitter {config.splitter})</span>}
            <span>✦ radio = upgrade · single-color = 1 feature · AllColor = multi-feature</span>
          </div>

        </div>
      )}
    </div>
  );
}