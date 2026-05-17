

// /* eslint-disable @typescript-eslint/no-explicit-any */
// "use client";

// import { useState, useRef } from "react";
// import {
//   ZoneFeatureCoin, ZONE_COIN_COLORS, ZONE_COIN_VALUES,
//   ZONE_BG_CLASS, ZONE_BORDER_CLASS, getZoneBgColor,
//   UpgradeInfo, generateZoneFeatureGaffe,
// } from "./zoneFeatureGenerator";
// import { posToMetric, FEATURE_UPGRADE_MAP, ALL_UPGRADE_FEATURES } from "./config";

// type Props = {
//   baseCoins:     ZoneFeatureCoin[];
//   splitter:      number;
//   multipliers:   number[];
//   onCoinsChange: (coins: ZoneFeatureCoin[]) => void;
//   onSpin:        (line: string) => void;
//   onReset:       () => void;
//   onUpgrade:     (newFeatures: string[], carryCoins: ZoneFeatureCoin[]) => void;
// };

// const MAX_SPINS = 3;

// const COIN_SELECT_BG: Record<number, string> = {
//   4: "bg-orange-700", 13: "bg-pink-700", 22: "bg-emerald-700", 31: "bg-indigo-700",
// };

// // Extra per-coin state for upgrade preview fields
// type UpgradeCoinExtra = {
//   // For upgrading to DOUBLE
//   leftValue?:  string;
//   rightValue?: string;
//   // For upgrading to ULTRA
//   boostValue?: string;
//   // For upgrading to EXTRA (no extra fields needed)
// };

// export default function ZoneFeature({ baseCoins, splitter, multipliers, onCoinsChange, onSpin, onReset, onUpgrade }: Props) {
//   const [isOpen,    setIsOpen]    = useState(true);
//   const init = baseCoins.map(c => ({ ...c, fromBase: true }));
//   const [coins,     setCoins]     = useState<ZoneFeatureCoin[]>(init);
//   const [spinsLeft, setSpinsLeft] = useState(MAX_SPINS);
//   const lastPos = useRef<Set<number>>(new Set(init.map(c => c.position)));

//   // Upgrade state — no more "pending"; selecting feature adapts layout immediately
//   const [upgradePos,      setUpgradePos]      = useState<number | null>(null);
//   const [upgradeFeatSel,  setUpgradeFeatSel]  = useState<string>("");       // single-color
//   const [upgradeMultiSel, setUpgradeMultiSel] = useState<Set<string>>(new Set()); // allColor
//   // Extra fields for the upgrade coin (filled in the adapted UI)
//   const [upgradeExtra, setUpgradeExtra] = useState<UpgradeCoinExtra>({});
//   // Zone-specific upgrade params (when upgrading to zone — but zone is self, so this is for extra-zone etc.)
//   const [upgradeZoneSplitter,    setUpgradeZoneSplitter]    = useState("");
//   const [upgradeZoneMultipliers, setUpgradeZoneMultipliers] = useState("");

//   const coinAt = (pos: number) => coins.find(c => c.position === pos);

//   const addCoin = (pos: number) => {
//     if (coinAt(pos)) return;
//     setCoins(prev => [...prev, { position: pos, colorCode: ZONE_COIN_COLORS[0].value, value: ZONE_COIN_VALUES[0] }]);
//   };
//   const removeCoin = (pos: number) => {
//     if (coinAt(pos)?.fromBase) return;
//     if (upgradePos === pos) resetUpgradeState();
//     setCoins(prev => prev.filter(c => c.position !== pos));
//   };
//   const updateCoin = (pos: number, field: keyof ZoneFeatureCoin, val: any) =>
//     setCoins(prev => prev.map(c => c.position === pos ? { ...c, [field]: val } : c));

//   const resetUpgradeState = () => {
//     setUpgradePos(null);
//     setUpgradeFeatSel("");
//     setUpgradeMultiSel(new Set());
//     setUpgradeExtra({});
//     setUpgradeZoneSplitter("");
//     setUpgradeZoneMultipliers("");
//   };

//   const handleUpgradeRadio = (pos: number) => {
//     if (upgradePos === pos) { resetUpgradeState(); return; }
//     resetUpgradeState();
//     setUpgradePos(pos);
//   };

//   // When user changes the upgrade feature selection → clear extra fields
//   const handleFeatSelChange = (feat: string) => {
//     setUpgradeFeatSel(feat);
//     setUpgradeExtra({});
//     setUpgradeZoneSplitter("");
//     setUpgradeZoneMultipliers("");
//   };

//   const upgradeCoinn = upgradePos !== null ? coinAt(upgradePos) : null;
//   const ZONE_ALLCOLOR_CODE = ZONE_COIN_COLORS[ZONE_COIN_COLORS.length - 1].value;
//   const isAllColor = upgradeCoinn?.colorCode === ZONE_ALLCOLOR_CODE;

//   const upgradeOptions: string[] = (() => {
//     if (!upgradeCoinn) return [];
//     if (isAllColor) return ALL_UPGRADE_FEATURES.filter(f => f !== "ZONE");
//     return (FEATURE_UPGRADE_MAP["zone"][upgradeCoinn.colorCode] ?? []).filter(f => f !== "ZONE");
//   })();

//   const toggleMulti = (f: string) => {
//     setUpgradeMultiSel(prev => {
//       const next = new Set(prev);
//       if (next.has(f)) next.delete(f); else next.add(f);
//       return next;
//     });
//     setUpgradeExtra({});
//   };

//   // The confirmed upgrade features for display / SPIN
//   const selectedFeats: string[] = isAllColor ? Array.from(upgradeMultiSel) : upgradeFeatSel ? [upgradeFeatSel] : [];

//   // Does the selected upgrade require DOUBLE fields?
//   const upgradeNeedsDouble = selectedFeats.includes("DOUBLE");
//   // Does the selected upgrade require ULTRA fields?
//   const upgradeNeedsUltra  = selectedFeats.includes("ULTRA");

//   // Ready to spin with upgrade: must have at least one feature selected (extra fields are optional)
//   const canUpgradeSpin = upgradePos !== null && selectedFeats.length > 0;

//   const handleSpin = () => {
//     if (spinsLeft <= 0) return;

//     const cur = new Set(coins.map(c => c.position));
//     const hasNew = [...cur].some(p => !lastPos.current.has(p));
//     setSpinsLeft(hasNew ? MAX_SPINS : spinsLeft - 1);
//     lastPos.current = cur;
//     onCoinsChange(coins);

//     if (canUpgradeSpin && upgradePos !== null) {
//       // Build upgrade info
//       const upgrade: UpgradeInfo = {
//         col: Math.floor(upgradePos / 3),
//         row: upgradePos % 3,
//         features: selectedFeats,
//       };

//       // Emit line with goodPosition + additionalFeatureTriggered
//       onSpin(generateZoneFeatureGaffe(coins, splitter, multipliers, upgrade));

//       // Navigate immediately to the new combo — single click!
//       const newFeatures = [...new Set(["zone", ...upgrade.features.map(f => f.toLowerCase())])];
//       onUpgrade(newFeatures, coins);
//     } else {
//       onSpin(generateZoneFeatureGaffe(coins, splitter, multipliers, null));
//     }
//   };

//   const reset = () => {
//     const s = baseCoins.map(c => ({ ...c, fromBase: true }));
//     setCoins(s);
//     setSpinsLeft(MAX_SPINS);
//     lastPos.current = new Set(s.map(c => c.position));
//     resetUpgradeState();
//     onReset();
//   };

//   const activeSplitter = splitter >= 1 && splitter <= 7 ? splitter : 1;

//   return (
//     <div className="bg-gray-800 rounded-xl border border-blue-700">
//       <div onClick={() => setIsOpen(!isOpen)} className="flex justify-between items-center p-4 cursor-pointer select-none">
//         <div className="flex items-center gap-3">
//           <h2 className="text-blue-400 font-bold font-mono">🔵 Zone Feature</h2>
//           {splitter > 0 && <span className="text-xs bg-blue-900 text-blue-300 px-2 py-0.5 rounded font-mono border border-blue-700">Splitter:{splitter}</span>}
//           {multipliers.length > 0 && <span className="text-xs bg-blue-900 text-blue-300 px-2 py-0.5 rounded font-mono border border-blue-700">×[{multipliers.join(",")}]</span>}
//         </div>
//         <span className="text-gray-500">{isOpen ? "▼" : "▶"}</span>
//       </div>

//       {isOpen && (
//         <div className="p-4 pt-0 flex flex-col gap-3">
//           {/* SPIN CONTROLS */}
//           <div className="flex items-center gap-3 flex-wrap">
//             <button
//               onClick={handleSpin}
//               disabled={spinsLeft <= 0}
//               className={`px-5 py-1.5 rounded font-bold font-mono transition-all ${
//                 canUpgradeSpin
//                   ? "bg-yellow-600 hover:bg-yellow-500 ring-2 ring-yellow-400"
//                   : spinsLeft > 0
//                     ? "bg-blue-600 hover:bg-blue-500"
//                     : "bg-gray-600 opacity-50 cursor-not-allowed"
//               }`}>
//               {canUpgradeSpin ? `✦ SPIN + Go to zone+${selectedFeats.map(f => f.toLowerCase()).join("+")}` : "SPIN"}
//             </button>
//             <span className="text-sm text-gray-400 font-mono">{spinsLeft} spin{spinsLeft !== 1 ? "s" : ""} left</span>
//             <button onClick={reset} className="px-3 py-1 bg-gray-600 hover:bg-gray-500 rounded text-sm">Reset</button>
//           </div>

//           {/* UPGRADE PANEL — shown when upgrade radio is selected */}
//           {upgradePos !== null && upgradeOptions.length > 0 && (
//             <div className="flex flex-col gap-2 bg-yellow-900/20 border border-yellow-700 rounded-lg p-3">
//               <span className="text-yellow-300 text-xs font-mono font-bold">
//                 ✦ Upgrade coin at {posToMetric(upgradePos)} →
//                 {isAllColor ? " select features (multi)" : " select feature"}
//               </span>

//               {/* Feature selector */}
//               {isAllColor ? (
//                 <div className="flex gap-2 flex-wrap">
//                   {upgradeOptions.map(f => (
//                     <label key={f} className="flex items-center gap-1 cursor-pointer bg-yellow-900/40 border border-yellow-700 rounded px-2 py-1">
//                       <input type="checkbox" className="accent-yellow-400 w-3 h-3"
//                         checked={upgradeMultiSel.has(f)} onChange={() => toggleMulti(f)} />
//                       <span className="text-yellow-100 text-xs font-mono">{f}</span>
//                     </label>
//                   ))}
//                 </div>
//               ) : (
//                 <select
//                   className="bg-yellow-900 text-yellow-100 text-xs rounded px-2 py-1 font-mono border border-yellow-700 self-start"
//                   value={upgradeFeatSel}
//                   onChange={e => handleFeatSelChange(e.target.value)}>
//                   <option value="">Select feature to add…</option>
//                   {upgradeOptions.map(f => <option key={f} value={f}>{f}</option>)}
//                 </select>
//               )}

//               {/* Adapted extra fields — appear immediately after feature is chosen */}
//               {selectedFeats.length > 0 && (
//                 <div className="flex flex-col gap-1.5 bg-yellow-950/40 border border-yellow-800/50 rounded p-2 mt-1">
//                   <span className="text-yellow-400 text-[10px] font-mono">
//                     Extra fields for the upgrade coin (optional — fill before SPIN):
//                   </span>

//                   {upgradeNeedsDouble && (
//                     <div className="flex flex-col gap-1">
//                       <div className="flex items-center gap-1">
//                         <span className="text-[9px] text-red-300 font-mono w-14 shrink-0">←L value</span>
//                         <select
//                           className="bg-red-950 text-red-200 text-[9px] rounded px-1 py-0.5 font-mono border-0"
//                           value={upgradeExtra.leftValue || ""}
//                           onChange={e => setUpgradeExtra(prev => ({ ...prev, leftValue: e.target.value }))}>
//                           <option value="">--</option>
//                           {ZONE_COIN_VALUES.map(v => <option key={v} value={v}>{v}</option>)}
//                         </select>
//                       </div>
//                       <div className="flex items-center gap-1">
//                         <span className="text-[9px] text-red-300 font-mono w-14 shrink-0">R→ value</span>
//                         <select
//                           className="bg-red-950 text-red-200 text-[9px] rounded px-1 py-0.5 font-mono border-0"
//                           value={upgradeExtra.rightValue || ""}
//                           onChange={e => setUpgradeExtra(prev => ({ ...prev, rightValue: e.target.value }))}>
//                           <option value="">--</option>
//                           {ZONE_COIN_VALUES.map(v => <option key={v} value={v}>{v}</option>)}
//                         </select>
//                       </div>
//                     </div>
//                   )}

//                   {upgradeNeedsUltra && (
//                     <div className="flex items-center gap-1">
//                       <span className="text-[9px] text-purple-300 font-mono w-14 shrink-0">Boost</span>
//                       <select
//                         className="bg-purple-950 text-purple-200 text-[9px] rounded px-1 py-0.5 font-mono border-0"
//                         value={upgradeExtra.boostValue || ""}
//                         onChange={e => setUpgradeExtra(prev => ({ ...prev, boostValue: e.target.value }))}>
//                         <option value="">--</option>
//                         {["0","0.5","1","2","5","10","25","50","100"].map(v => <option key={v} value={v}>{v}</option>)}
//                       </select>
//                     </div>
//                   )}

//                   <span className="text-yellow-400 text-[9px] font-mono mt-0.5">
//                     → Hit SPIN to generate output and switch to the new feature layout
//                   </span>
//                 </div>
//               )}
//             </div>
//           )}
//           {upgradePos !== null && upgradeOptions.length === 0 && (
//             <div className="text-xs text-gray-500 font-mono bg-gray-700 px-3 py-1.5 rounded">
//               ℹ No upgrades available from this coin color
//             </div>
//           )}

//           {/* GRID */}
//           <div className="grid gap-1" style={{ gridTemplateColumns: "repeat(5, minmax(0,1fr))" }}>
//             {Array.from({ length: 3 }).map((_, row) =>
//               Array.from({ length: 5 }).map((_, col) => {
//                 const pos     = col * 3 + row;
//                 const coin    = coinAt(pos);
//                 const zoneBg  = getZoneBgColor(pos, activeSplitter);
//                 const isUpgradeCoin = upgradePos === pos;

//                 return (
//                   <div key={pos} onClick={() => !coin && addCoin(pos)}
//                     className={`relative rounded-lg border-2 flex flex-col items-center p-1 min-h-[95px] text-xs text-white cursor-pointer transition-all hover:brightness-110 ${ZONE_BG_CLASS[zoneBg]} ${isUpgradeCoin ? "ring-2 ring-yellow-400" : ZONE_BORDER_CLASS[zoneBg]}`}>
//                     <div className="flex justify-between w-full text-[9px] opacity-40">
//                       <span>{pos}</span><span className="font-mono">{posToMetric(pos)}</span>
//                     </div>
//                     {coin ? (
//                       <div className="flex flex-col items-center w-full gap-0.5 mt-0.5">
//                         <div className="text-sm">🟡</div>
//                         <select
//                           className={`text-white text-[9px] w-full rounded px-0.5 py-0.5 border-0 font-mono ${COIN_SELECT_BG[coin.colorCode] ?? "bg-gray-700"}`}
//                           value={coin.colorCode} onClick={e => e.stopPropagation()}
//                           onChange={e => updateCoin(pos, "colorCode", Number(e.target.value))}>
//                           {ZONE_COIN_COLORS.map(c => <option key={c.value} value={c.value} className="bg-gray-800">{c.label}</option>)}
//                         </select>
//                         <select
//                           className={`text-white text-[9px] w-full rounded px-0.5 py-0.5 border-0 font-mono ${COIN_SELECT_BG[coin.colorCode] ?? "bg-gray-700"}`}
//                           value={coin.value} onClick={e => e.stopPropagation()}
//                           onChange={e => updateCoin(pos, "value", e.target.value)}>
//                           {ZONE_COIN_VALUES.map(v => <option key={v} value={v} className="bg-gray-800">{v}</option>)}
//                         </select>
//                         <div className="flex items-center gap-1 mt-0.5" onClick={e => e.stopPropagation()}>
//                           <input type="radio" name="zoneUpgrade" className="accent-yellow-400 w-3 h-3 cursor-pointer"
//                             checked={isUpgradeCoin} onChange={() => handleUpgradeRadio(pos)} />
//                           <span className="text-[8px] text-yellow-300 font-mono">upgrade</span>
//                           {isUpgradeCoin && selectedFeats.length > 0 && (
//                             <span className="text-[7px] text-yellow-500 font-mono">→{selectedFeats.join("+")}</span>
//                           )}
//                         </div>
//                         {!coin.fromBase && (
//                           <button onClick={e => { e.stopPropagation(); removeCoin(pos); }}
//                             className="absolute top-1 right-1 text-[10px] text-red-400 hover:text-red-200 font-bold">✕</button>
//                         )}
//                       </div>
//                     ) : (
//                       <span className="text-white/30 text-[10px] mt-3">+Add</span>
//                     )}
//                   </div>
//                 );
//               })
//             )}
//           </div>

//           <div className="text-[10px] text-gray-600 font-mono">
//             🟡 click empty cell to add · ✕ remove · radio = upgrade trigger
//             · select feature → fill extra fields → SPIN generates + switches in one click
//           </div>
//         </div>
//       )}
//     </div>
//   );
// }


//! latest working code
/* eslint-disable @typescript-eslint/no-explicit-any */
// "use client";

// import { useState, useRef } from "react";
// import {
//   ZoneFeatureCoin, ZONE_COIN_COLORS, ZONE_COIN_VALUES,
//   ZONE_BG_CLASS, ZONE_BORDER_CLASS, getZoneBgColor,
//   UpgradeInfo, generateZoneFeatureGaffe,
// } from "./zoneFeatureGenerator";
// import { posToMetric, FEATURE_UPGRADE_MAP, ALL_UPGRADE_FEATURES } from "./config";

// type Props = {
//   baseCoins:     ZoneFeatureCoin[];
//   splitter:      number;
//   multipliers:   number[];
//   onCoinsChange: (coins: ZoneFeatureCoin[]) => void;
//   onSpin:        (line: string) => void;
//   onReset:       () => void;
//   onUpgrade:     (newFeatures: string[], carryCoins: ZoneFeatureCoin[], upgradeInfo: UpgradeInfo) => void;
// };

// const MAX_SPINS = 3;
// const COIN_SELECT_BG: Record<number, string> = {
//   4: "bg-orange-700", 13: "bg-pink-700", 22: "bg-emerald-700", 31: "bg-indigo-700",
// };

// export default function ZoneFeature({ baseCoins, splitter, multipliers, onCoinsChange, onSpin, onReset, onUpgrade }: Props) {
//   const [isOpen,    setIsOpen]    = useState(true);
//   const init = baseCoins.map(c => ({ ...c, fromBase: true }));
//   const [coins,     setCoins]     = useState<ZoneFeatureCoin[]>(init);
//   const [spinsLeft, setSpinsLeft] = useState(MAX_SPINS);
//   const lastPos = useRef<Set<number>>(new Set(init.map(c => c.position)));
//   const [upgradePos,      setUpgradePos]      = useState<number | null>(null);
//   const [upgradeMultiSel, setUpgradeMultiSel] = useState<Set<string>>(new Set());

//   const coinAt    = (pos: number) => coins.find(c => c.position === pos);
//   const addCoin   = (pos: number) => { if (coinAt(pos)) return; setCoins(p => [...p, { position: pos, colorCode: ZONE_COIN_COLORS[0].value, value: ZONE_COIN_VALUES[0] }]); };
//   const removeCoin= (pos: number) => { if (coinAt(pos)?.fromBase) return; if (upgradePos===pos){setUpgradePos(null);setUpgradeMultiSel(new Set());} setCoins(p=>p.filter(c=>c.position!==pos)); };
//   const updateCoin= (pos: number, field: keyof ZoneFeatureCoin, val: any) => setCoins(p=>p.map(c=>c.position===pos?{...c,[field]:val}:c));

//   const handleUpgradeRadio = (pos: number) => {
//     if (upgradePos === pos) { setUpgradePos(null); setUpgradeMultiSel(new Set()); return; }
//     setUpgradePos(pos); setUpgradeMultiSel(new Set());
//   };

//   const upgradeCoinn      = upgradePos !== null ? coinAt(upgradePos) : null;
//   const ALLCOLOR_CODE     = ZONE_COIN_COLORS[ZONE_COIN_COLORS.length - 1].value;
//   const isAllColor        = upgradeCoinn?.colorCode === ALLCOLOR_CODE;
//   const upgradeOptions    = (() => {
//     if (!upgradeCoinn) return [];
//     if (isAllColor) return ALL_UPGRADE_FEATURES.filter(f => f !== "ZONE");
//     return (FEATURE_UPGRADE_MAP["zone"][upgradeCoinn.colorCode] ?? []).filter(f => f !== "ZONE");
//   })();

//   const toggleMulti = (f: string) => setUpgradeMultiSel(p => { const n=new Set(p); n.has(f)?n.delete(f):n.add(f); return n; });

//   const navigateUpgrade = (feats: string[]) => {
//     if (upgradePos === null || feats.length === 0) return;
//     const upgradeInfo: UpgradeInfo = { col: Math.floor(upgradePos/3), row: upgradePos%3, features: feats };
//     onUpgrade([...new Set(["zone",...feats.map(f=>f.toLowerCase())])], coins, upgradeInfo);
//   };

//   const handleSpin = () => {
//     if (spinsLeft <= 0) return;
//     const cur = new Set(coins.map(c => c.position));
//     const hasNew = [...cur].some(p => !lastPos.current.has(p));
//     setSpinsLeft(hasNew ? MAX_SPINS : spinsLeft - 1);
//     lastPos.current = cur;
//     onCoinsChange(coins);
//     onSpin(generateZoneFeatureGaffe(coins, splitter, multipliers, null));
//   };

//   const reset = () => {
//     const s = baseCoins.map(c => ({ ...c, fromBase: true }));
//     setCoins(s); setSpinsLeft(MAX_SPINS);
//     lastPos.current = new Set(s.map(c => c.position));
//     setUpgradePos(null); setUpgradeMultiSel(new Set());
//     onReset();
//   };

//   return (
//     <div className="bg-gray-800 rounded-xl border border-blue-700">
//       <div onClick={() => setIsOpen(!isOpen)} className="flex justify-between items-center p-4 cursor-pointer select-none">
//         <div className="flex items-center gap-3">
//           <h2 className="text-blue-400 font-bold font-mono">🔵 Zone Feature</h2>
//           {splitter > 0 && <span className="text-xs bg-blue-900 text-blue-300 px-2 py-0.5 rounded font-mono border border-blue-700">Splitter:{splitter}</span>}
//           {multipliers.length > 0 && <span className="text-xs bg-blue-900 text-blue-300 px-2 py-0.5 rounded font-mono border border-blue-700">×[{multipliers.join(",")}]</span>}
//         </div>
//         <span className="text-gray-500">{isOpen ? "▼" : "▶"}</span>
//       </div>

//       {isOpen && (
//         <div className="p-4 pt-0 flex flex-col gap-3">
//           <div className="flex items-center gap-3 flex-wrap">
//             <button onClick={handleSpin} disabled={spinsLeft <= 0}
//               className={`px-5 py-1.5 rounded font-bold font-mono transition-all ${spinsLeft>0?"bg-blue-600 hover:bg-blue-500":"bg-gray-600 opacity-50 cursor-not-allowed"}`}>SPIN</button>
//             <span className="text-sm text-gray-400 font-mono">{spinsLeft} spin{spinsLeft!==1?"s":""} left</span>
//             <button onClick={reset} className="px-3 py-1 bg-gray-600 hover:bg-gray-500 rounded text-sm">Reset</button>
//           </div>

//           {upgradePos !== null && upgradeOptions.length > 0 && (
//             <div className="flex flex-col gap-2 bg-yellow-900/20 border border-yellow-800 rounded-lg p-2">
//               <span className="text-yellow-300 text-xs font-mono font-bold">✦ Upgrade at {posToMetric(upgradePos)} — select feature to add (navigates immediately):</span>
//               {isAllColor ? (
//                 <div className="flex flex-col gap-2">
//                   <div className="flex gap-2 flex-wrap">
//                     {upgradeOptions.map(f => (
//                       <label key={f} className="flex items-center gap-1 cursor-pointer bg-yellow-900/40 border border-yellow-700 rounded px-2 py-1">
//                         <input type="checkbox" className="accent-yellow-400 w-3 h-3" checked={upgradeMultiSel.has(f)} onChange={() => toggleMulti(f)} />
//                         <span className="text-yellow-100 text-xs font-mono">{f}</span>
//                       </label>
//                     ))}
//                   </div>
//                   {upgradeMultiSel.size > 0 && (
//                     <button onClick={() => navigateUpgrade(Array.from(upgradeMultiSel))}
//                       className="self-start px-3 py-1 bg-yellow-600 hover:bg-yellow-500 rounded text-xs font-mono font-bold">
//                       → Go to zone + {Array.from(upgradeMultiSel).map(f=>f.toLowerCase()).join(" + ")}
//                     </button>
//                   )}
//                 </div>
//               ) : (
//                 <div className="flex gap-2 flex-wrap">
//                   {upgradeOptions.map(f => (
//                     <button key={f} onClick={() => navigateUpgrade([f])}
//                       className="px-3 py-1.5 bg-yellow-700 hover:bg-yellow-600 border border-yellow-600 rounded text-xs font-mono font-bold transition-all">
//                       → {f}
//                     </button>
//                   ))}
//                 </div>
//               )}
//             </div>
//           )}
//           {upgradePos !== null && upgradeOptions.length === 0 && (
//             <div className="text-xs text-gray-500 font-mono bg-gray-700 px-3 py-1.5 rounded">ℹ No upgrades available</div>
//           )}

//           <div className="grid gap-1" style={{ gridTemplateColumns: "repeat(5, minmax(0,1fr))" }}>
//             {Array.from({length:3}).map((_,row) => Array.from({length:5}).map((_,col) => {
//               const pos  = col*3+row;
//               const coin = coinAt(pos);
//               const zoneBg = getZoneBgColor(pos, splitter>=1&&splitter<=7?splitter:1);
//               return (
//                 <div key={pos} onClick={() => !coin && addCoin(pos)}
//                   className={`relative rounded-lg border-2 flex flex-col items-center p-1 min-h-[95px] text-xs text-white cursor-pointer transition-all hover:brightness-110 ${ZONE_BG_CLASS[zoneBg]} ${ZONE_BORDER_CLASS[zoneBg]}`}>
//                   <div className="flex justify-between w-full text-[9px] opacity-40">
//                     <span>{pos}</span><span className="font-mono">{posToMetric(pos)}</span>
//                   </div>
//                   {coin ? (
//                     <div className="flex flex-col items-center w-full gap-0.5 mt-0.5">
//                       <div className="text-sm">🟡</div>
//                       <select className={`text-white text-[9px] w-full rounded px-0.5 py-0.5 border-0 font-mono ${COIN_SELECT_BG[coin.colorCode]??"bg-gray-700"}`}
//                         value={coin.colorCode} onClick={e=>e.stopPropagation()} onChange={e=>updateCoin(pos,"colorCode",Number(e.target.value))}>
//                         {ZONE_COIN_COLORS.map(c=><option key={c.value} value={c.value} className="bg-gray-800">{c.label}</option>)}
//                       </select>
//                       <select className={`text-white text-[9px] w-full rounded px-0.5 py-0.5 border-0 font-mono ${COIN_SELECT_BG[coin.colorCode]??"bg-gray-700"}`}
//                         value={coin.value} onClick={e=>e.stopPropagation()} onChange={e=>updateCoin(pos,"value",e.target.value)}>
//                         {ZONE_COIN_VALUES.map(v=><option key={v} value={v} className="bg-gray-800">{v}</option>)}
//                       </select>
//                       <div className="flex items-center gap-1 mt-0.5" onClick={e=>e.stopPropagation()}>
//                         <input type="radio" name="zoneUpgrade" className="accent-yellow-400 w-3 h-3 cursor-pointer"
//                           checked={upgradePos===pos} onChange={()=>handleUpgradeRadio(pos)} />
//                         <span className="text-[8px] text-yellow-300 font-mono">upgrade</span>
//                       </div>
//                       {!coin.fromBase && <button onClick={e=>{e.stopPropagation();removeCoin(pos);}} className="absolute top-1 right-1 text-[10px] text-red-400 hover:text-red-200 font-bold">✕</button>}
//                     </div>
//                   ) : <span className="text-white/30 text-[10px] mt-3">+Add</span>}
//                 </div>
//               );
//             }))}
//           </div>
//           <div className="text-[10px] text-gray-600 font-mono">🟡 click empty to add · ✕ remove · ✦ upgrade radio → pick feature → navigates to combo · SPIN in new layout confirms</div>
//         </div>
//       )}
//     </div>
//   );
// }



/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { useState, useRef } from "react";
import {
  ZoneFeatureCoin, ZONE_COIN_COLORS, ZONE_COIN_VALUES,
  ZONE_BG_CLASS, ZONE_BORDER_CLASS, getZoneBgColor,
  UpgradeInfo, generateZoneFeatureGaffe,
} from "./zoneFeatureGenerator";
import { posToMetric, FEATURE_UPGRADE_MAP, ALL_UPGRADE_FEATURES } from "./config";

type Props = {
  baseCoins:     ZoneFeatureCoin[];
  splitter:      number;
  multipliers:   number[];
  onCoinsChange: (coins: ZoneFeatureCoin[]) => void;
  onSpin:        (line: string) => void;
  onReset:       () => void;
  onUpgrade:     (newFeatures: string[], carryCoins: ZoneFeatureCoin[], upgradeInfo: UpgradeInfo) => void;
};

const MAX_SPINS = 3;
const COIN_SELECT_BG: Record<number, string> = {
  4: "bg-orange-700", 13: "bg-pink-700", 22: "bg-emerald-700", 31: "bg-indigo-700",
};

export default function ZoneFeature({ baseCoins, splitter, multipliers, onCoinsChange, onSpin, onReset, onUpgrade }: Props) {
  const [isOpen,    setIsOpen]    = useState(true);
  const init = baseCoins.map(c => ({ ...c, fromBase: true }));
  const [coins,     setCoins]     = useState<ZoneFeatureCoin[]>(init);
  const [spinsLeft, setSpinsLeft] = useState(MAX_SPINS);
  const lastPos = useRef<Set<number>>(new Set(init.map(c => c.position)));
  const [upgradePos,      setUpgradePos]      = useState<number | null>(null);
  const [upgradeMultiSel, setUpgradeMultiSel] = useState<Set<string>>(new Set());
  const [upgradeZoneSplitter,   setUpgradeZoneSplitter]   = useState<string>("");
  const [upgradeZoneMultiRaw,   setUpgradeZoneMultiRaw]   = useState<string>("");

  const coinAt    = (pos: number) => coins.find(c => c.position === pos);
  const addCoin   = (pos: number) => { if (coinAt(pos)) return; setCoins(p => [...p, { position: pos, colorCode: ZONE_COIN_COLORS[0].value, value: ZONE_COIN_VALUES[0] }]); };
  const removeCoin= (pos: number) => { if (coinAt(pos)?.fromBase) return; if (upgradePos===pos){setUpgradePos(null);setUpgradeMultiSel(new Set());} setCoins(p=>p.filter(c=>c.position!==pos)); };
  const updateCoin= (pos: number, field: keyof ZoneFeatureCoin, val: any) => setCoins(p=>p.map(c=>c.position===pos?{...c,[field]:val}:c));

  const handleUpgradeRadio = (pos: number) => {
    if (upgradePos === pos) { setUpgradePos(null); setUpgradeMultiSel(new Set()); setUpgradeZoneSplitter(""); setUpgradeZoneMultiRaw(""); return; }
    setUpgradePos(pos); setUpgradeMultiSel(new Set()); setUpgradeZoneSplitter(""); setUpgradeZoneMultiRaw("");
  };

  const upgradeCoinn      = upgradePos !== null ? coinAt(upgradePos) : null;
  const ALLCOLOR_CODE     = ZONE_COIN_COLORS[ZONE_COIN_COLORS.length - 1].value;
  const isAllColor        = upgradeCoinn?.colorCode === ALLCOLOR_CODE;
  const upgradeOptions    = (() => {
    if (!upgradeCoinn) return [];
    if (isAllColor) return ALL_UPGRADE_FEATURES.filter(f => f !== "ZONE");
    return (FEATURE_UPGRADE_MAP["zone"][upgradeCoinn.colorCode] ?? []).filter(f => f !== "ZONE");
  })();

  const toggleMulti = (f: string) => setUpgradeMultiSel(p => { const n=new Set(p); n.has(f)?n.delete(f):n.add(f); return n; });

  const navigateUpgrade = (feats: string[]) => {
    if (upgradePos === null || feats.length === 0) return;
    const hasZone = feats.map(f => f.toUpperCase()).includes("ZONE");
    const upgradeInfo: UpgradeInfo = {
      col: Math.floor(upgradePos/3), row: upgradePos%3, features: feats,
      ...(hasZone && upgradeZoneSplitter ? { zoneSplitter: Number(upgradeZoneSplitter) } : {}),
      ...(hasZone && upgradeZoneMultiRaw ? { zoneMultipliers: upgradeZoneMultiRaw.split(",").map(n=>n.trim()).filter(Boolean).map(Number) } : {}),
    };
    onUpgrade([...new Set(["zone",...feats.map(f=>f.toLowerCase())])], coins, upgradeInfo);
  };

  const handleSpin = () => {
    if (spinsLeft <= 0) return;
    const cur = new Set(coins.map(c => c.position));
    const hasNew = [...cur].some(p => !lastPos.current.has(p));
    setSpinsLeft(hasNew ? MAX_SPINS : spinsLeft - 1);
    lastPos.current = cur;
    onCoinsChange(coins);
    onSpin(generateZoneFeatureGaffe(coins, splitter, multipliers, null));
  };

  const reset = () => {
    const s = baseCoins.map(c => ({ ...c, fromBase: true }));
    setCoins(s); setSpinsLeft(MAX_SPINS);
    lastPos.current = new Set(s.map(c => c.position));
    setUpgradePos(null); setUpgradeMultiSel(new Set());
    onReset();
  };

  return (
    <div className="bg-gray-800 rounded-xl border border-blue-700">
      <div onClick={() => setIsOpen(!isOpen)} className="flex justify-between items-center p-4 cursor-pointer select-none">
        <div className="flex items-center gap-3">
          <h2 className="text-blue-400 font-bold font-mono">🔵 Zone Feature</h2>
          {splitter > 0 && <span className="text-xs bg-blue-900 text-blue-300 px-2 py-0.5 rounded font-mono border border-blue-700">Splitter:{splitter}</span>}
          {multipliers.length > 0 && <span className="text-xs bg-blue-900 text-blue-300 px-2 py-0.5 rounded font-mono border border-blue-700">×[{multipliers.join(",")}]</span>}
        </div>
        <span className="text-gray-500">{isOpen ? "▼" : "▶"}</span>
      </div>

      {isOpen && (
        <div className="p-4 pt-0 flex flex-col gap-3">
          <div className="flex items-center gap-3 flex-wrap">
            <button onClick={handleSpin} disabled={spinsLeft <= 0}
              className={`px-5 py-1.5 rounded font-bold font-mono transition-all ${spinsLeft>0?"bg-blue-600 hover:bg-blue-500":"bg-gray-600 opacity-50 cursor-not-allowed"}`}>SPIN</button>
            <span className="text-sm text-gray-400 font-mono">{spinsLeft} spin{spinsLeft!==1?"s":""} left</span>
            <button onClick={reset} className="px-3 py-1 bg-gray-600 hover:bg-gray-500 rounded text-sm">Reset</button>
          </div>

          {upgradePos !== null && upgradeOptions.length > 0 && (
            <div className="flex flex-col gap-2 bg-yellow-900/20 border border-yellow-800 rounded-lg p-2">
              <span className="text-yellow-300 text-xs font-mono font-bold">✦ Upgrade at {posToMetric(upgradePos)} — select feature to add (navigates immediately):</span>
              {isAllColor ? (
                <div className="flex flex-col gap-2">
                  <div className="flex gap-2 flex-wrap">
                    {upgradeOptions.map(f => (
                      <label key={f} className="flex items-center gap-1 cursor-pointer bg-yellow-900/40 border border-yellow-700 rounded px-2 py-1">
                        <input type="checkbox" className="accent-yellow-400 w-3 h-3" checked={upgradeMultiSel.has(f)} onChange={() => toggleMulti(f)} />
                        <span className="text-yellow-100 text-xs font-mono">{f}</span>
                      </label>
                    ))}
                  </div>
                  {upgradeMultiSel.size > 0 && (
                    <button onClick={() => navigateUpgrade(Array.from(upgradeMultiSel))}
                      className="self-start px-3 py-1 bg-yellow-600 hover:bg-yellow-500 rounded text-xs font-mono font-bold">
                      → Go to zone + {Array.from(upgradeMultiSel).map(f=>f.toLowerCase()).join(" + ")}
                    </button>
                  )}
                </div>
              ) : (
                <div className="flex gap-2 flex-wrap">
                  {upgradeOptions.map(f => (
                    <button key={f} onClick={() => navigateUpgrade([f])}
                      className="px-3 py-1.5 bg-yellow-700 hover:bg-yellow-600 border border-yellow-600 rounded text-xs font-mono font-bold transition-all">
                      → {f}
                    </button>
                  ))}
                </div>
              )}
            </div>
          )}
          {upgradePos !== null && upgradeOptions.length === 0 && (
            <div className="text-xs text-gray-500 font-mono bg-gray-700 px-3 py-1.5 rounded">ℹ No upgrades available</div>
          )}

          <div className="grid gap-1" style={{ gridTemplateColumns: "repeat(5, minmax(0,1fr))" }}>
            {Array.from({length:3}).map((_,row) => Array.from({length:5}).map((_,col) => {
              const pos  = col*3+row;
              const coin = coinAt(pos);
              const zoneBg = getZoneBgColor(pos, splitter>=1&&splitter<=7?splitter:1);
              return (
                <div key={pos} onClick={() => !coin && addCoin(pos)}
                  className={`relative rounded-lg border-2 flex flex-col items-center p-1 min-h-[95px] text-xs text-white cursor-pointer transition-all hover:brightness-110 ${ZONE_BG_CLASS[zoneBg]} ${ZONE_BORDER_CLASS[zoneBg]}`}>
                  <div className="flex justify-between w-full text-[9px] opacity-40">
                    <span>{pos}</span><span className="font-mono">{posToMetric(pos)}</span>
                  </div>
                  {coin ? (
                    <div className="flex flex-col items-center w-full gap-0.5 mt-0.5">
                      <div className="text-sm">🟡</div>
                      <select className={`text-white text-[9px] w-full rounded px-0.5 py-0.5 border-0 font-mono ${COIN_SELECT_BG[coin.colorCode]??"bg-gray-700"}`}
                        value={coin.colorCode} onClick={e=>e.stopPropagation()} onChange={e=>updateCoin(pos,"colorCode",Number(e.target.value))}>
                        {ZONE_COIN_COLORS.map(c=><option key={c.value} value={c.value} className="bg-gray-800">{c.label}</option>)}
                      </select>
                      <select className={`text-white text-[9px] w-full rounded px-0.5 py-0.5 border-0 font-mono ${COIN_SELECT_BG[coin.colorCode]??"bg-gray-700"}`}
                        value={coin.value} onClick={e=>e.stopPropagation()} onChange={e=>updateCoin(pos,"value",e.target.value)}>
                        {ZONE_COIN_VALUES.map(v=><option key={v} value={v} className="bg-gray-800">{v}</option>)}
                      </select>
                      <div className="flex items-center gap-1 mt-0.5" onClick={e=>e.stopPropagation()}>
                        <input type="radio" name="zoneUpgrade" className="accent-yellow-400 w-3 h-3 cursor-pointer"
                          checked={upgradePos===pos} onChange={()=>handleUpgradeRadio(pos)} />
                        <span className="text-[8px] text-yellow-300 font-mono">upgrade</span>
                      </div>
                      {!coin.fromBase && <button onClick={e=>{e.stopPropagation();removeCoin(pos);}} className="absolute top-1 right-1 text-[10px] text-red-400 hover:text-red-200 font-bold">✕</button>}
                    </div>
                  ) : <span className="text-white/30 text-[10px] mt-3">+Add</span>}
                </div>
              );
            }))}
          </div>
          <div className="text-[10px] text-gray-600 font-mono">🟡 click empty to add · ✕ remove · ✦ upgrade radio → pick feature → navigates to combo · SPIN in new layout confirms</div>
        </div>
      )}
    </div>
  );
}