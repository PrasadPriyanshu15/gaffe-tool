

//! latest working code
/* eslint-disable @typescript-eslint/no-explicit-any */
// "use client";

// import { useState, useRef } from "react";
// import {
//   ExtraFeatureCoin, EXTRA_COIN_COLORS, EXTRA_COIN_VALUES,
//   UpgradeInfo, generateExtraFeatureGaffe,
// } from "./extraFeatureGenerator";
// import { posToMetric, FEATURE_UPGRADE_MAP, ALL_UPGRADE_FEATURES } from "./config";

// type Props = {
//   baseCoins:     ExtraFeatureCoin[];
//   onCoinsChange: (coins: ExtraFeatureCoin[]) => void;
//   onSpin:        (line: string) => void;
//   onReset:       () => void;
//   onUpgrade:     (newFeatures: string[], carryCoins: ExtraFeatureCoin[], upgradeInfo: UpgradeInfo) => void;
// };

// const MAX_SPINS = 4;
// const COIN_SELECT_BG: Record<number, string> = {
//   4: "bg-orange-700", 13: "bg-blue-700", 22: "bg-pink-700", 31: "bg-indigo-700",
// };
// const CELL_BORDER: Record<number, string> = {
//   4: "border-orange-500", 13: "border-blue-500", 22: "border-pink-500", 31: "border-indigo-500",
// };

// export default function ExtraFeature({ baseCoins, onCoinsChange, onSpin, onReset, onUpgrade }: Props) {
//   const [isOpen,    setIsOpen]    = useState(true);
//   const init = baseCoins.map(c => ({ ...c, fromBase: true }));
//   const [coins,     setCoins]     = useState<ExtraFeatureCoin[]>(init);
//   const [spinsLeft, setSpinsLeft] = useState(MAX_SPINS);
//   const lastPos = useRef<Set<number>>(new Set(init.map(c => c.position)));
//   const [upgradePos,      setUpgradePos]      = useState<number | null>(null);
//   const [upgradeMultiSel, setUpgradeMultiSel] = useState<Set<string>>(new Set());

//   const coinAt    = (pos: number) => coins.find(c => c.position === pos);
//   const addCoin   = (pos: number) => { if (coinAt(pos)) return; setCoins(p=>[...p,{position:pos,colorCode:EXTRA_COIN_COLORS[0].value,value:EXTRA_COIN_VALUES[0]}]); };
//   const removeCoin= (pos: number) => { if (coinAt(pos)?.fromBase) return; if (upgradePos===pos){setUpgradePos(null);setUpgradeMultiSel(new Set());} setCoins(p=>p.filter(c=>c.position!==pos)); };
//   const updateCoin= (pos: number, field: keyof ExtraFeatureCoin, val: any) => setCoins(p=>p.map(c=>c.position===pos?{...c,[field]:val}:c));

//   const handleUpgradeRadio = (pos: number) => {
//     if (upgradePos===pos){setUpgradePos(null);setUpgradeMultiSel(new Set());return;}
//     setUpgradePos(pos); setUpgradeMultiSel(new Set());
//   };

//   const upgradeCoinn   = upgradePos !== null ? coinAt(upgradePos) : null;
//   const ALLCOLOR_CODE  = EXTRA_COIN_COLORS[EXTRA_COIN_COLORS.length - 1].value;
//   const isAllColor     = upgradeCoinn?.colorCode === ALLCOLOR_CODE;
//   const upgradeOptions = (() => {
//     if (!upgradeCoinn) return [];
//     if (isAllColor) return ALL_UPGRADE_FEATURES.filter(f => f !== "EXTRA");
//     return (FEATURE_UPGRADE_MAP["extra"][upgradeCoinn.colorCode] ?? []).filter(f => f !== "EXTRA");
//   })();

//   const toggleMulti = (f: string) => setUpgradeMultiSel(p=>{const n=new Set(p);n.has(f)?n.delete(f):n.add(f);return n;});

//   const navigateUpgrade = (feats: string[]) => {
//     if (upgradePos === null || feats.length === 0) return;
//     const upgradeInfo: UpgradeInfo = { col: Math.floor(upgradePos/3), row: upgradePos%3, features: feats };
//     onUpgrade([...new Set(["extra",...feats.map(f=>f.toLowerCase())])], coins, upgradeInfo);
//   };

//   const handleSpin = () => {
//     if (spinsLeft <= 0) return;
//     const cur = new Set(coins.map(c => c.position));
//     const hasNew = [...cur].some(p => !lastPos.current.has(p));
//     setSpinsLeft(hasNew ? MAX_SPINS : spinsLeft - 1);
//     lastPos.current = cur;
//     onCoinsChange(coins);
//     onSpin(generateExtraFeatureGaffe(coins, null));
//   };

//   const reset = () => {
//     const s = baseCoins.map(c => ({ ...c, fromBase: true }));
//     setCoins(s); setSpinsLeft(MAX_SPINS);
//     lastPos.current = new Set(s.map(c => c.position));
//     setUpgradePos(null); setUpgradeMultiSel(new Set());
//     onReset();
//   };

//   const filled14 = coins.length >= 14;

//   return (
//     <div className="bg-gray-800 rounded-xl border border-green-700">
//       <div onClick={() => setIsOpen(!isOpen)} className="flex justify-between items-center p-4 cursor-pointer select-none">
//         <div className="flex items-center gap-3">
//           <h2 className="text-green-400 font-bold font-mono">🟢 Extra Feature</h2>
//           {filled14 && <span className="text-yellow-400 text-xs font-mono bg-yellow-900/40 px-2 py-0.5 rounded border border-yellow-700">⚠ 14 filled → lastPositionReel on next spin</span>}
//         </div>
//         <span className="text-gray-500">{isOpen ? "▼" : "▶"}</span>
//       </div>

//       {isOpen && (
//         <div className="p-4 pt-0 flex flex-col gap-3">
//           <div className="flex items-center gap-3 flex-wrap">
//             <button onClick={handleSpin} disabled={spinsLeft <= 0}
//               className={`px-5 py-1.5 rounded font-bold font-mono transition-all ${spinsLeft>0?"bg-green-600 hover:bg-green-500":"bg-gray-600 opacity-50 cursor-not-allowed"}`}>SPIN</button>
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
//                       → Go to extra + {Array.from(upgradeMultiSel).map(f=>f.toLowerCase()).join(" + ")}
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
//               return (
//                 <div key={pos} onClick={() => !coin && addCoin(pos)}
//                   className={`relative rounded-lg border-2 flex flex-col items-center p-1 min-h-[95px] text-xs text-white cursor-pointer transition-all hover:brightness-110
//                     ${coin?`bg-gray-700 ${CELL_BORDER[coin.colorCode]??"border-gray-500"}`:"bg-gray-700 border-gray-600 hover:bg-gray-600 hover:border-gray-400"}`}>
//                   <div className="flex justify-between w-full text-[9px] opacity-40">
//                     <span>{pos}</span><span className="font-mono">{posToMetric(pos)}</span>
//                   </div>
//                   {coin ? (
//                     <div className="flex flex-col items-center w-full gap-0.5 mt-0.5">
//                       <div className="text-sm">🟡</div>
//                       <select className={`text-white text-[9px] w-full rounded px-0.5 py-0.5 border-0 font-mono ${COIN_SELECT_BG[coin.colorCode]??"bg-gray-700"}`}
//                         value={coin.colorCode} onClick={e=>e.stopPropagation()} onChange={e=>updateCoin(pos,"colorCode",Number(e.target.value))}>
//                         {EXTRA_COIN_COLORS.map(c=><option key={c.value} value={c.value} className="bg-gray-800">{c.label}</option>)}
//                       </select>
//                       <select className={`text-white text-[9px] w-full rounded px-0.5 py-0.5 border-0 font-mono ${COIN_SELECT_BG[coin.colorCode]??"bg-gray-700"}`}
//                         value={coin.value} onClick={e=>e.stopPropagation()} onChange={e=>updateCoin(pos,"value",e.target.value)}>
//                         {EXTRA_COIN_VALUES.map(v=><option key={v} value={v} className="bg-gray-800">{v}</option>)}
//                       </select>
//                       <div className="flex items-center gap-1 mt-0.5" onClick={e=>e.stopPropagation()}>
//                         <input type="radio" name="extraUpgrade" className="accent-yellow-400 w-3 h-3 cursor-pointer"
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






// /* eslint-disable @typescript-eslint/no-explicit-any */
// "use client";

// import { useState, useRef } from "react";
// import {
//   ExtraFeatureCoin, EXTRA_COIN_COLORS, EXTRA_COIN_VALUES,
//   UpgradeInfo, generateExtraFeatureGaffe,
// } from "./extraFeatureGenerator";
// import { posToMetric, FEATURE_UPGRADE_MAP, ALL_UPGRADE_FEATURES, ZONE_SPLITTER_OPTIONS } from "./config";

// type Props = {
//   baseCoins:     ExtraFeatureCoin[];
//   onCoinsChange: (coins: ExtraFeatureCoin[]) => void;
//   onSpin:        (line: string) => void;
//   onReset:       () => void;
//   onUpgrade:     (newFeatures: string[], carryCoins: ExtraFeatureCoin[], upgradeInfo: UpgradeInfo) => void;
// };

// const MAX_SPINS = 4;
// const COIN_SELECT_BG: Record<number, string> = {
//   4: "bg-orange-700", 13: "bg-blue-700", 22: "bg-pink-700", 31: "bg-indigo-700",
// };
// const CELL_BORDER: Record<number, string> = {
//   4: "border-orange-500", 13: "border-blue-500", 22: "border-pink-500", 31: "border-indigo-500",
// };

// // ── Shared zone param inputs (module-level to avoid "component created during render" error) ──
// function ZoneParamInputs({ splitter, setSplitter, multiRaw, setMultiRaw }: {
//   splitter: string; setSplitter: (v: string) => void;
//   multiRaw: string; setMultiRaw: (v: string) => void;
// }) {
//   return (
//     <div className="flex gap-3 flex-wrap items-center bg-sky-900/30 border border-sky-800 rounded p-2">
//       <span className="text-sky-300 text-[10px] font-mono">Zone params:</span>
//       <div className="flex items-center gap-1">
//         <span className="text-[10px] text-sky-300 font-mono">Splitter</span>
//         <select className="bg-sky-950 text-sky-200 text-xs rounded px-1 py-0.5 font-mono border border-sky-700"
//           value={splitter} onChange={e => setSplitter(e.target.value)}>
//           <option value="">--</option>
//           {ZONE_SPLITTER_OPTIONS.map(v => <option key={v} value={v}>{v}</option>)}
//         </select>
//       </div>
//       <div className="flex items-center gap-1">
//         <span className="text-[10px] text-sky-300 font-mono">Multipliers</span>
//         <input type="text" placeholder="e.g. 2,3" value={multiRaw} onChange={e => setMultiRaw(e.target.value)}
//           className="bg-sky-950 text-sky-200 text-xs rounded px-1 py-0.5 font-mono border border-sky-700 w-20" />
//       </div>
//     </div>
//   );
// }

// export default function ExtraFeature({ baseCoins, onCoinsChange, onSpin, onReset, onUpgrade }: Props) {
//   const [isOpen,    setIsOpen]    = useState(true);
//   const init = baseCoins.map(c => ({ ...c, fromBase: true }));
//   const [coins,     setCoins]     = useState<ExtraFeatureCoin[]>(init);
//   const [spinsLeft, setSpinsLeft] = useState(MAX_SPINS);
//   const lastPos = useRef<Set<number>>(new Set(init.map(c => c.position)));
//   const [upgradePos,      setUpgradePos]      = useState<number | null>(null);
//   const [upgradeMultiSel, setUpgradeMultiSel] = useState<Set<string>>(new Set());
//   const [upgradeZoneSplitter, setUpgradeZoneSplitter] = useState<string>("");
//   const [upgradeZoneMultiRaw, setUpgradeZoneMultiRaw] = useState<string>("");

//   const coinAt    = (pos: number) => coins.find(c => c.position === pos);
//   const addCoin   = (pos: number) => { if (coinAt(pos)) return; setCoins(p=>[...p,{position:pos,colorCode:EXTRA_COIN_COLORS[0].value,value:EXTRA_COIN_VALUES[0]}]); };
//   const removeCoin= (pos: number) => { if (coinAt(pos)?.fromBase) return; if (upgradePos===pos){setUpgradePos(null);setUpgradeMultiSel(new Set());} setCoins(p=>p.filter(c=>c.position!==pos)); };
//   const updateCoin= (pos: number, field: keyof ExtraFeatureCoin, val: any) => setCoins(p=>p.map(c=>c.position===pos?{...c,[field]:val}:c));

//   const handleUpgradeRadio = (pos: number) => {
//     if (upgradePos===pos){setUpgradePos(null);setUpgradeMultiSel(new Set());setUpgradeZoneSplitter("");setUpgradeZoneMultiRaw("");return;}
//     setUpgradePos(pos); setUpgradeMultiSel(new Set()); setUpgradeZoneSplitter(""); setUpgradeZoneMultiRaw("");
//   };

//   const upgradeCoinn   = upgradePos !== null ? coinAt(upgradePos) : null;
//   const ALLCOLOR_CODE  = EXTRA_COIN_COLORS[EXTRA_COIN_COLORS.length - 1].value;
//   const isAllColor     = upgradeCoinn?.colorCode === ALLCOLOR_CODE;
//   const upgradeOptions = (() => {
//     if (!upgradeCoinn) return [];
//     if (isAllColor) return ALL_UPGRADE_FEATURES.filter(f => f !== "EXTRA");
//     return (FEATURE_UPGRADE_MAP["extra"][upgradeCoinn.colorCode] ?? []).filter(f => f !== "EXTRA");
//   })();

//   const toggleMulti = (f: string) => setUpgradeMultiSel(p=>{const n=new Set(p);n.has(f)?n.delete(f):n.add(f);return n;});

//   const navigateUpgrade = (feats: string[]) => {
//     if (upgradePos === null || feats.length === 0) return;
//     const hasZone = feats.map(f => f.toUpperCase()).includes("ZONE");
//     const upgradeInfo: UpgradeInfo = {
//       col: Math.floor(upgradePos/3), row: upgradePos%3, features: feats,
//       ...(hasZone && upgradeZoneSplitter ? { zoneSplitter: Number(upgradeZoneSplitter) } : {}),
//       ...(hasZone && upgradeZoneMultiRaw ? { zoneMultipliers: upgradeZoneMultiRaw.split(",").map(n=>n.trim()).filter(Boolean).map(Number) } : {}),
//     };
//     onUpgrade([...new Set(["extra",...feats.map(f=>f.toLowerCase())])], coins, upgradeInfo);
//   };

//   const handleSpin = () => {
//     if (spinsLeft <= 0) return;
//     const cur = new Set(coins.map(c => c.position));
//     const hasNew = [...cur].some(p => !lastPos.current.has(p));
//     setSpinsLeft(hasNew ? MAX_SPINS : spinsLeft - 1);
//     lastPos.current = cur;
//     onCoinsChange(coins);
//     onSpin(generateExtraFeatureGaffe(coins, null));
//   };

//   const reset = () => {
//     const s = baseCoins.map(c => ({ ...c, fromBase: true }));
//     setCoins(s); setSpinsLeft(MAX_SPINS);
//     lastPos.current = new Set(s.map(c => c.position));
//     setUpgradePos(null); setUpgradeMultiSel(new Set()); setUpgradeZoneSplitter(""); setUpgradeZoneMultiRaw("");
//     onReset();
//   };

//   const filled14 = coins.length >= 14;

//   // Inline helper for zone param inputs

//   return (
//     <div className="bg-gray-800 rounded-xl border border-green-700">
//       <div onClick={() => setIsOpen(!isOpen)} className="flex justify-between items-center p-4 cursor-pointer select-none">
//         <div className="flex items-center gap-3">
//           <h2 className="text-green-400 font-bold font-mono">🟢 Extra Feature</h2>
//           {filled14 && <span className="text-yellow-400 text-xs font-mono bg-yellow-900/40 px-2 py-0.5 rounded border border-yellow-700">⚠ 14 filled → lastPositionReel on next spin</span>}
//         </div>
//         <span className="text-gray-500">{isOpen ? "▼" : "▶"}</span>
//       </div>

//       {isOpen && (
//         <div className="p-4 pt-0 flex flex-col gap-3">
//           <div className="flex items-center gap-3 flex-wrap">
//             <button onClick={handleSpin} disabled={spinsLeft <= 0}
//               className={`px-5 py-1.5 rounded font-bold font-mono transition-all ${spinsLeft>0?"bg-green-600 hover:bg-green-500":"bg-gray-600 opacity-50 cursor-not-allowed"}`}>SPIN</button>
//             <span className="text-sm text-gray-400 font-mono">{spinsLeft} spin{spinsLeft!==1?"s":""} left</span>
//             <button onClick={reset} className="px-3 py-1 bg-gray-600 hover:bg-gray-500 rounded text-sm">Reset</button>
//           </div>

//           {upgradePos !== null && upgradeOptions.length > 0 && (
//             <div className="flex flex-col gap-2 bg-yellow-900/20 border border-yellow-800 rounded-lg p-3">
//               <span className="text-yellow-300 text-xs font-mono font-bold">✦ Upgrade at {posToMetric(upgradePos)}</span>
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
//                   {upgradeMultiSel.has("ZONE") && (
//                     <ZoneParamInputs splitter={upgradeZoneSplitter} setSplitter={setUpgradeZoneSplitter} multiRaw={upgradeZoneMultiRaw} setMultiRaw={setUpgradeZoneMultiRaw} />
//                   )}
//                   {upgradeMultiSel.size > 0 && (
//                     <button onClick={() => navigateUpgrade(Array.from(upgradeMultiSel))}
//                       className="self-start px-3 py-1 bg-yellow-600 hover:bg-yellow-500 rounded text-xs font-mono font-bold">
//                       → Go to extra + {Array.from(upgradeMultiSel).map(f=>f.toLowerCase()).join(" + ")}
//                     </button>
//                   )}
//                 </div>
//               ) : (
//                 <div className="flex flex-col gap-2">
//                   <div className="flex gap-2 flex-wrap">
//                     {upgradeOptions.map(f => (
//                       <button key={f} onClick={() => f === "ZONE" ? undefined : navigateUpgrade([f])}
//                         className={`px-3 py-1.5 border rounded text-xs font-mono font-bold transition-all ${f === "ZONE" ? "bg-sky-800 hover:bg-sky-700 border-sky-600" : "bg-yellow-700 hover:bg-yellow-600 border-yellow-600"}`}>
//                         → {f}
//                       </button>
//                     ))}
//                   </div>
//                   {upgradeOptions.includes("ZONE") && (
//                     <div className="flex flex-col gap-1.5">
//                       <ZoneParamInputs splitter={upgradeZoneSplitter} setSplitter={setUpgradeZoneSplitter} multiRaw={upgradeZoneMultiRaw} setMultiRaw={setUpgradeZoneMultiRaw} />
//                       <button onClick={() => navigateUpgrade(["ZONE"])}
//                         className="self-start px-3 py-1 bg-sky-700 hover:bg-sky-600 border border-sky-500 rounded text-xs font-mono font-bold transition-all">
//                         → Go to extra + zone
//                       </button>
//                     </div>
//                   )}
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
//               return (
//                 <div key={pos} onClick={() => !coin && addCoin(pos)}
//                   className={`relative rounded-lg border-2 flex flex-col items-center p-1 min-h-[95px] text-xs text-white cursor-pointer transition-all hover:brightness-110
//                     ${coin?`bg-gray-700 ${CELL_BORDER[coin.colorCode]??"border-gray-500"}`:"bg-gray-700 border-gray-600 hover:bg-gray-600 hover:border-gray-400"}`}>
//                   <div className="flex justify-between w-full text-[9px] opacity-40">
//                     <span>{pos}</span><span className="font-mono">{posToMetric(pos)}</span>
//                   </div>
//                   {coin ? (
//                     <div className="flex flex-col items-center w-full gap-0.5 mt-0.5">
//                       <div className="text-sm">🟡</div>
//                       <select className={`text-white text-[9px] w-full rounded px-0.5 py-0.5 border-0 font-mono ${COIN_SELECT_BG[coin.colorCode]??"bg-gray-700"}`}
//                         value={coin.colorCode} onClick={e=>e.stopPropagation()} onChange={e=>updateCoin(pos,"colorCode",Number(e.target.value))}>
//                         {EXTRA_COIN_COLORS.map(c=><option key={c.value} value={c.value} className="bg-gray-800">{c.label}</option>)}
//                       </select>
//                       <select className={`text-white text-[9px] w-full rounded px-0.5 py-0.5 border-0 font-mono ${COIN_SELECT_BG[coin.colorCode]??"bg-gray-700"}`}
//                         value={coin.value} onClick={e=>e.stopPropagation()} onChange={e=>updateCoin(pos,"value",e.target.value)}>
//                         {EXTRA_COIN_VALUES.map(v=><option key={v} value={v} className="bg-gray-800">{v}</option>)}
//                       </select>
//                       <div className="flex items-center gap-1 mt-0.5" onClick={e=>e.stopPropagation()}>
//                         <input type="radio" name="extraUpgrade" className="accent-yellow-400 w-3 h-3 cursor-pointer"
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
//           {/* <div className="text-[10px] text-gray-600 font-mono">🟡 click empty to add · ✕ remove · ✦ upgrade radio → pick feature → navigates to combo · SPIN in new layout confirms</div> */}
//         </div>
//       )}
//     </div>
//   );
// }




//! blue nad purple swapped

//! latest working code
/* eslint-disable @typescript-eslint/no-explicit-any */
// "use client";

// import { useState, useRef } from "react";
// import {
//   ExtraFeatureCoin, EXTRA_COIN_COLORS, EXTRA_COIN_VALUES,
//   UpgradeInfo, generateExtraFeatureGaffe,
// } from "./extraFeatureGenerator";
// import { posToMetric, FEATURE_UPGRADE_MAP, ALL_UPGRADE_FEATURES } from "./config";

// type Props = {
//   baseCoins:     ExtraFeatureCoin[];
//   onCoinsChange: (coins: ExtraFeatureCoin[]) => void;
//   onSpin:        (line: string) => void;
//   onReset:       () => void;
//   onUpgrade:     (newFeatures: string[], carryCoins: ExtraFeatureCoin[], upgradeInfo: UpgradeInfo) => void;
// };

// const MAX_SPINS = 4;
// const COIN_SELECT_BG: Record<number, string> = {
//   4: "bg-orange-700", 13: "bg-blue-700", 22: "bg-pink-700", 31: "bg-indigo-700",
// };
// const CELL_BORDER: Record<number, string> = {
//   4: "border-orange-500", 13: "border-blue-500", 22: "border-pink-500", 31: "border-indigo-500",
// };

// export default function ExtraFeature({ baseCoins, onCoinsChange, onSpin, onReset, onUpgrade }: Props) {
//   const [isOpen,    setIsOpen]    = useState(true);
//   const init = baseCoins.map(c => ({ ...c, fromBase: true }));
//   const [coins,     setCoins]     = useState<ExtraFeatureCoin[]>(init);
//   const [spinsLeft, setSpinsLeft] = useState(MAX_SPINS);
//   const lastPos = useRef<Set<number>>(new Set(init.map(c => c.position)));
//   const [upgradePos,      setUpgradePos]      = useState<number | null>(null);
//   const [upgradeMultiSel, setUpgradeMultiSel] = useState<Set<string>>(new Set());

//   const coinAt    = (pos: number) => coins.find(c => c.position === pos);
//   const addCoin   = (pos: number) => { if (coinAt(pos)) return; setCoins(p=>[...p,{position:pos,colorCode:EXTRA_COIN_COLORS[0].value,value:EXTRA_COIN_VALUES[0]}]); };
//   const removeCoin= (pos: number) => { if (coinAt(pos)?.fromBase) return; if (upgradePos===pos){setUpgradePos(null);setUpgradeMultiSel(new Set());} setCoins(p=>p.filter(c=>c.position!==pos)); };
//   const updateCoin= (pos: number, field: keyof ExtraFeatureCoin, val: any) => setCoins(p=>p.map(c=>c.position===pos?{...c,[field]:val}:c));

//   const handleUpgradeRadio = (pos: number) => {
//     if (upgradePos===pos){setUpgradePos(null);setUpgradeMultiSel(new Set());return;}
//     setUpgradePos(pos); setUpgradeMultiSel(new Set());
//   };

//   const upgradeCoinn   = upgradePos !== null ? coinAt(upgradePos) : null;
//   const ALLCOLOR_CODE  = EXTRA_COIN_COLORS[EXTRA_COIN_COLORS.length - 1].value;
//   const isAllColor     = upgradeCoinn?.colorCode === ALLCOLOR_CODE;
//   const upgradeOptions = (() => {
//     if (!upgradeCoinn) return [];
//     if (isAllColor) return ALL_UPGRADE_FEATURES.filter(f => f !== "EXTRA");
//     return (FEATURE_UPGRADE_MAP["extra"][upgradeCoinn.colorCode] ?? []).filter(f => f !== "EXTRA");
//   })();

//   const toggleMulti = (f: string) => setUpgradeMultiSel(p=>{const n=new Set(p);n.has(f)?n.delete(f):n.add(f);return n;});

//   const navigateUpgrade = (feats: string[]) => {
//     if (upgradePos === null || feats.length === 0) return;
//     const upgradeInfo: UpgradeInfo = { col: Math.floor(upgradePos/3), row: upgradePos%3, features: feats };
//     onUpgrade([...new Set(["extra",...feats.map(f=>f.toLowerCase())])], coins, upgradeInfo);
//   };

//   const handleSpin = () => {
//     if (spinsLeft <= 0) return;
//     const cur = new Set(coins.map(c => c.position));
//     const hasNew = [...cur].some(p => !lastPos.current.has(p));
//     setSpinsLeft(hasNew ? MAX_SPINS : spinsLeft - 1);
//     lastPos.current = cur;
//     onCoinsChange(coins);
//     onSpin(generateExtraFeatureGaffe(coins, null));
//   };

//   const reset = () => {
//     const s = baseCoins.map(c => ({ ...c, fromBase: true }));
//     setCoins(s); setSpinsLeft(MAX_SPINS);
//     lastPos.current = new Set(s.map(c => c.position));
//     setUpgradePos(null); setUpgradeMultiSel(new Set());
//     onReset();
//   };

//   const filled14 = coins.length >= 14;

//   return (
//     <div className="bg-gray-800 rounded-xl border border-green-700">
//       <div onClick={() => setIsOpen(!isOpen)} className="flex justify-between items-center p-4 cursor-pointer select-none">
//         <div className="flex items-center gap-3">
//           <h2 className="text-green-400 font-bold font-mono">🟢 Extra Feature</h2>
//           {filled14 && <span className="text-yellow-400 text-xs font-mono bg-yellow-900/40 px-2 py-0.5 rounded border border-yellow-700">⚠ 14 filled → lastPositionReel on next spin</span>}
//         </div>
//         <span className="text-gray-500">{isOpen ? "▼" : "▶"}</span>
//       </div>

//       {isOpen && (
//         <div className="p-4 pt-0 flex flex-col gap-3">
//           <div className="flex items-center gap-3 flex-wrap">
//             <button onClick={handleSpin} disabled={spinsLeft <= 0}
//               className={`px-5 py-1.5 rounded font-bold font-mono transition-all ${spinsLeft>0?"bg-green-600 hover:bg-green-500":"bg-gray-600 opacity-50 cursor-not-allowed"}`}>SPIN</button>
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
//                       → Go to extra + {Array.from(upgradeMultiSel).map(f=>f.toLowerCase()).join(" + ")}
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
//               return (
//                 <div key={pos} onClick={() => !coin && addCoin(pos)}
//                   className={`relative rounded-lg border-2 flex flex-col items-center p-1 min-h-[95px] text-xs text-white cursor-pointer transition-all hover:brightness-110
//                     ${coin?`bg-gray-700 ${CELL_BORDER[coin.colorCode]??"border-gray-500"}`:"bg-gray-700 border-gray-600 hover:bg-gray-600 hover:border-gray-400"}`}>
//                   <div className="flex justify-between w-full text-[9px] opacity-40">
//                     <span>{pos}</span><span className="font-mono">{posToMetric(pos)}</span>
//                   </div>
//                   {coin ? (
//                     <div className="flex flex-col items-center w-full gap-0.5 mt-0.5">
//                       <div className="text-sm">🟡</div>
//                       <select className={`text-white text-[9px] w-full rounded px-0.5 py-0.5 border-0 font-mono ${COIN_SELECT_BG[coin.colorCode]??"bg-gray-700"}`}
//                         value={coin.colorCode} onClick={e=>e.stopPropagation()} onChange={e=>updateCoin(pos,"colorCode",Number(e.target.value))}>
//                         {EXTRA_COIN_COLORS.map(c=><option key={c.value} value={c.value} className="bg-gray-800">{c.label}</option>)}
//                       </select>
//                       <select className={`text-white text-[9px] w-full rounded px-0.5 py-0.5 border-0 font-mono ${COIN_SELECT_BG[coin.colorCode]??"bg-gray-700"}`}
//                         value={coin.value} onClick={e=>e.stopPropagation()} onChange={e=>updateCoin(pos,"value",e.target.value)}>
//                         {EXTRA_COIN_VALUES.map(v=><option key={v} value={v} className="bg-gray-800">{v}</option>)}
//                       </select>
//                       <div className="flex items-center gap-1 mt-0.5" onClick={e=>e.stopPropagation()}>
//                         <input type="radio" name="extraUpgrade" className="accent-yellow-400 w-3 h-3 cursor-pointer"
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
  ExtraFeatureCoin, EXTRA_COIN_COLORS, EXTRA_COIN_VALUES,
  UpgradeInfo, generateExtraFeatureGaffe,
} from "./extraFeatureGenerator";
import { posToMetric, FEATURE_UPGRADE_MAP, ALL_UPGRADE_FEATURES, ZONE_SPLITTER_OPTIONS } from "./config";

type Props = {
  baseCoins:     ExtraFeatureCoin[];
  onCoinsChange: (coins: ExtraFeatureCoin[]) => void;
  onSpin:        (line: string) => void;
  onReset:       () => void;
  onUpgrade:     (newFeatures: string[], carryCoins: ExtraFeatureCoin[], upgradeInfo: UpgradeInfo) => void;
};

const MAX_SPINS = 4;
const COIN_SELECT_BG: Record<number, string> = {
  4: "bg-orange-700", 13: "bg-purple-700", 22: "bg-blue-700", 31: "bg-indigo-700",
};
const CELL_BORDER: Record<number, string> = {
  4: "border-orange-500", 13: "border-purple-500", 22: "border-blue-500", 31: "border-indigo-500",
};

// ── Shared zone param inputs (module-level to avoid "component created during render" error) ──
function ZoneParamInputs({ splitter, setSplitter, multiRaw, setMultiRaw }: {
  splitter: string; setSplitter: (v: string) => void;
  multiRaw: string; setMultiRaw: (v: string) => void;
}) {
  return (
    <div className="flex gap-3 flex-wrap items-center bg-sky-900/30 border border-sky-800 rounded p-2">
      <span className="text-sky-300 text-[10px] font-mono">Zone params:</span>
      <div className="flex items-center gap-1">
        <span className="text-[10px] text-sky-300 font-mono">Splitter</span>
        <select className="bg-sky-950 text-sky-200 text-xs rounded px-1 py-0.5 font-mono border border-sky-700"
          value={splitter} onChange={e => setSplitter(e.target.value)}>
          <option value="">--</option>
          {ZONE_SPLITTER_OPTIONS.map(v => <option key={v} value={v}>{v}</option>)}
        </select>
      </div>
      <div className="flex items-center gap-1">
        <span className="text-[10px] text-sky-300 font-mono">Multipliers</span>
        <input type="text" placeholder="e.g. 2,3" value={multiRaw} onChange={e => setMultiRaw(e.target.value)}
          className="bg-sky-950 text-sky-200 text-xs rounded px-1 py-0.5 font-mono border border-sky-700 w-20" />
      </div>
    </div>
  );
}

export default function ExtraFeature({ baseCoins, onCoinsChange, onSpin, onReset, onUpgrade }: Props) {
  const [isOpen,    setIsOpen]    = useState(true);
  const init = baseCoins.map(c => ({ ...c, fromBase: true }));
  const [coins,     setCoins]     = useState<ExtraFeatureCoin[]>(init);
  const [spinsLeft, setSpinsLeft] = useState(MAX_SPINS);
  const lastPos = useRef<Set<number>>(new Set(init.map(c => c.position)));
  const [upgradePos,      setUpgradePos]      = useState<number | null>(null);
  const [upgradeMultiSel, setUpgradeMultiSel] = useState<Set<string>>(new Set());
  const [upgradeZoneSplitter, setUpgradeZoneSplitter] = useState<string>("");
  const [upgradeZoneMultiRaw, setUpgradeZoneMultiRaw] = useState<string>("");

  const coinAt    = (pos: number) => coins.find(c => c.position === pos);
  const addCoin   = (pos: number) => { if (coinAt(pos)) return; setCoins(p=>[...p,{position:pos,colorCode:EXTRA_COIN_COLORS[0].value,value:EXTRA_COIN_VALUES[0]}]); };
  const removeCoin= (pos: number) => { if (coinAt(pos)?.fromBase) return; if (upgradePos===pos){setUpgradePos(null);setUpgradeMultiSel(new Set());} setCoins(p=>p.filter(c=>c.position!==pos)); };
  const updateCoin= (pos: number, field: keyof ExtraFeatureCoin, val: any) => setCoins(p=>p.map(c=>c.position===pos?{...c,[field]:val}:c));

  const handleUpgradeRadio = (pos: number) => {
    if (upgradePos===pos){setUpgradePos(null);setUpgradeMultiSel(new Set());setUpgradeZoneSplitter("");setUpgradeZoneMultiRaw("");return;}
    setUpgradePos(pos); setUpgradeMultiSel(new Set()); setUpgradeZoneSplitter(""); setUpgradeZoneMultiRaw("");
  };

  const upgradeCoinn   = upgradePos !== null ? coinAt(upgradePos) : null;
  const ALLCOLOR_CODE  = EXTRA_COIN_COLORS[EXTRA_COIN_COLORS.length - 1].value;
  const isAllColor     = upgradeCoinn?.colorCode === ALLCOLOR_CODE;
  const upgradeOptions = (() => {
    if (!upgradeCoinn) return [];
    if (isAllColor) return ALL_UPGRADE_FEATURES.filter(f => f !== "EXTRA");
    return (FEATURE_UPGRADE_MAP["extra"][upgradeCoinn.colorCode] ?? []).filter(f => f !== "EXTRA");
  })();

  const toggleMulti = (f: string) => setUpgradeMultiSel(p=>{const n=new Set(p);n.has(f)?n.delete(f):n.add(f);return n;});

  const navigateUpgrade = (feats: string[]) => {
    if (upgradePos === null || feats.length === 0) return;
    const hasZone = feats.map(f => f.toUpperCase()).includes("ZONE");
    const upgradeInfo: UpgradeInfo = {
      col: Math.floor(upgradePos/3), row: upgradePos%3, features: feats,
      ...(hasZone && upgradeZoneSplitter ? { zoneSplitter: Number(upgradeZoneSplitter) } : {}),
      ...(hasZone && upgradeZoneMultiRaw ? { zoneMultipliers: upgradeZoneMultiRaw.split(",").map(n=>n.trim()).filter(Boolean).map(Number) } : {}),
    };
    onUpgrade([...new Set(["extra",...feats.map(f=>f.toLowerCase())])], coins, upgradeInfo);
  };

  const handleSpin = () => {
    if (spinsLeft <= 0) return;
    const cur = new Set(coins.map(c => c.position));
    const hasNew = [...cur].some(p => !lastPos.current.has(p));
    setSpinsLeft(hasNew ? MAX_SPINS : spinsLeft - 1);
    lastPos.current = cur;
    onCoinsChange(coins);
    onSpin(generateExtraFeatureGaffe(coins, null));
  };

  const reset = () => {
    const s = baseCoins.map(c => ({ ...c, fromBase: true }));
    setCoins(s); setSpinsLeft(MAX_SPINS);
    lastPos.current = new Set(s.map(c => c.position));
    setUpgradePos(null); setUpgradeMultiSel(new Set()); setUpgradeZoneSplitter(""); setUpgradeZoneMultiRaw("");
    onReset();
  };

  const filled14 = coins.length >= 14;

  // Inline helper for zone param inputs

  return (
    <div className="bg-gray-800 rounded-xl border border-green-700">
      <div onClick={() => setIsOpen(!isOpen)} className="flex justify-between items-center p-4 cursor-pointer select-none">
        <div className="flex items-center gap-3">
          <h2 className="text-green-400 font-bold font-mono">🟢 Extra Feature</h2>
          {filled14 && <span className="text-yellow-400 text-xs font-mono bg-yellow-900/40 px-2 py-0.5 rounded border border-yellow-700">⚠ 14 filled → lastPositionReel on next spin</span>}
        </div>
        <span className="text-gray-500">{isOpen ? "▼" : "▶"}</span>
      </div>

      {isOpen && (
        <div className="p-4 pt-0 flex flex-col gap-3">
          <div className="flex items-center gap-3 flex-wrap">
            <button onClick={handleSpin} disabled={spinsLeft <= 0}
              className={`px-5 py-1.5 rounded font-bold font-mono transition-all ${spinsLeft>0?"bg-green-600 hover:bg-green-500":"bg-gray-600 opacity-50 cursor-not-allowed"}`}>SPIN</button>
            <span className="text-sm text-gray-400 font-mono">{spinsLeft} spin{spinsLeft!==1?"s":""} left</span>
            <button onClick={reset} className="px-3 py-1 bg-gray-600 hover:bg-gray-500 rounded text-sm">Reset</button>
          </div>

          {upgradePos !== null && upgradeOptions.length > 0 && (
            <div className="flex flex-col gap-2 bg-yellow-900/20 border border-yellow-800 rounded-lg p-3">
              <span className="text-yellow-300 text-xs font-mono font-bold">✦ Upgrade at {posToMetric(upgradePos)}</span>
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
                  {upgradeMultiSel.has("ZONE") && (
                    <ZoneParamInputs splitter={upgradeZoneSplitter} setSplitter={setUpgradeZoneSplitter} multiRaw={upgradeZoneMultiRaw} setMultiRaw={setUpgradeZoneMultiRaw} />
                  )}
                  {upgradeMultiSel.size > 0 && (
                    <button onClick={() => navigateUpgrade(Array.from(upgradeMultiSel))}
                      className="self-start px-3 py-1 bg-yellow-600 hover:bg-yellow-500 rounded text-xs font-mono font-bold">
                      → Go to extra + {Array.from(upgradeMultiSel).map(f=>f.toLowerCase()).join(" + ")}
                    </button>
                  )}
                </div>
              ) : (
                <div className="flex flex-col gap-2">
                  <div className="flex gap-2 flex-wrap">
                    {upgradeOptions.map(f => (
                      <button key={f} onClick={() => f === "ZONE" ? undefined : navigateUpgrade([f])}
                        className={`px-3 py-1.5 border rounded text-xs font-mono font-bold transition-all ${f === "ZONE" ? "bg-sky-800 hover:bg-sky-700 border-sky-600" : "bg-yellow-700 hover:bg-yellow-600 border-yellow-600"}`}>
                        → {f}
                      </button>
                    ))}
                  </div>
                  {upgradeOptions.includes("ZONE") && (
                    <div className="flex flex-col gap-1.5">
                      <ZoneParamInputs splitter={upgradeZoneSplitter} setSplitter={setUpgradeZoneSplitter} multiRaw={upgradeZoneMultiRaw} setMultiRaw={setUpgradeZoneMultiRaw} />
                      <button onClick={() => navigateUpgrade(["ZONE"])}
                        className="self-start px-3 py-1 bg-sky-700 hover:bg-sky-600 border border-sky-500 rounded text-xs font-mono font-bold transition-all">
                        → Go to extra + zone
                      </button>
                    </div>
                  )}
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
              return (
                <div key={pos} onClick={() => !coin && addCoin(pos)}
                  className={`relative rounded-lg border-2 flex flex-col items-center p-1 min-h-[95px] text-xs text-white cursor-pointer transition-all hover:brightness-110
                    ${coin?`bg-gray-700 ${CELL_BORDER[coin.colorCode]??"border-gray-500"}`:"bg-gray-700 border-gray-600 hover:bg-gray-600 hover:border-gray-400"}`}>
                  <div className="flex justify-between w-full text-[9px] opacity-40">
                    <span>{pos}</span><span className="font-mono">{posToMetric(pos)}</span>
                  </div>
                  {coin ? (
                    <div className="flex flex-col items-center w-full gap-0.5 mt-0.5">
                      <div className="text-sm">🟡</div>
                      <select className={`text-white text-[9px] w-full rounded px-0.5 py-0.5 border-0 font-mono ${COIN_SELECT_BG[coin.colorCode]??"bg-gray-700"}`}
                        value={coin.colorCode} onClick={e=>e.stopPropagation()} onChange={e=>updateCoin(pos,"colorCode",Number(e.target.value))}>
                        {EXTRA_COIN_COLORS.map(c=><option key={c.value} value={c.value} className="bg-gray-800">{c.label}</option>)}
                      </select>
                      <select className={`text-white text-[9px] w-full rounded px-0.5 py-0.5 border-0 font-mono ${COIN_SELECT_BG[coin.colorCode]??"bg-gray-700"}`}
                        value={coin.value} onClick={e=>e.stopPropagation()} onChange={e=>updateCoin(pos,"value",e.target.value)}>
                        {EXTRA_COIN_VALUES.map(v=><option key={v} value={v} className="bg-gray-800">{v}</option>)}
                      </select>
                      <div className="flex items-center gap-1 mt-0.5" onClick={e=>e.stopPropagation()}>
                        <input type="radio" name="extraUpgrade" className="accent-yellow-400 w-3 h-3 cursor-pointer"
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
          {/* <div className="text-[10px] text-gray-600 font-mono">🟡 click empty to add · ✕ remove · ✦ upgrade radio → pick feature → navigates to combo · SPIN in new layout confirms</div> */}
        </div>
      )}
    </div>
  );
}