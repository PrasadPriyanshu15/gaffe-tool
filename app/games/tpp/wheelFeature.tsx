// /* eslint-disable @typescript-eslint/no-explicit-any */
// "use client";

// import { useState, useEffect, useRef } from "react";
// import {
//   WheelCell, ROWS, COLS, MAX_RED_COINS,
//   COIN_VALUES, MULTI_VALUES,
//   emptyGrid, seedFromBase, generateWheelGaffe,
// } from "./wheelFeatureGenerator";

// // ─── Props ────────────────────────────────────────────────────────────────────
// type Props = {
//   /** Red SCaT coins from base game */
//   baseCoins: { position: number; value: string }[];
//   /** Called after every SPIN with the formatted gaffe line */
//   onSpin:   (line: string) => void;
//   onReset:  () => void;
//   /** Multipliers already used (shared across combination features) */
//   sharedUsedMultipliers?: Set<string>;
//   onMultiplierUsed?: (m: string) => void;
// };

// const MAX_SPINS = 3;

// // ─── Color helpers ────────────────────────────────────────────────────────────
// const CELL_BG: Record<WheelCell["type"], string> = {
//   EMPTY:   "bg-[#1a2a4a] border-gray-700 hover:border-gray-500",
//   GOLD:    "bg-yellow-800 border-yellow-500",
//   RED:     "bg-red-800    border-red-400",
//   UPGRADE: "bg-indigo-800 border-indigo-400",
// };
// const CELL_SELECT: Record<string, string> = {
//   GOLD:    "bg-yellow-900",
//   RED:     "bg-red-900",
//   UPGRADE: "bg-indigo-900",
// };

// // ─── Component ────────────────────────────────────────────────────────────────
// export default function WheelFeature({
//   baseCoins, onSpin, onReset,
//   sharedUsedMultipliers,
//   onMultiplierUsed,
// }: Props) {
//   const [isOpen,     setIsOpen]     = useState(true);
//   const [grid,       setGrid]       = useState<WheelCell[][]>(() => seedFromBase(baseCoins));
//   const [spinsLeft,  setSpinsLeft]  = useState(MAX_SPINS);
//   const [redCount,   setRedCount]   = useState(0);
//   const [usedMults,  setUsedMults]  = useState<Set<string>>(new Set());

//   // Track positions present at last spin to detect new landings
//   const lastSpinPositions = useRef<Set<string>>(
//     new Set(baseCoins.map(({ position }) => {
//       const col = Math.floor(position / ROWS);
//       const row = position % ROWS;
//       return `${row}-${col}`;
//     }))
//   );

//   // Re-seed when baseCoins change
//   useEffect(() => {
//     const g = seedFromBase(baseCoins);
//     setGrid(g);
//     setSpinsLeft(MAX_SPINS);
//     setRedCount(0);
//     setUsedMults(new Set());
//     lastSpinPositions.current = new Set(
//       baseCoins.map(({ position }) => {
//         const col = Math.floor(position / ROWS);
//         const row = position % ROWS;
//         return `${row}-${col}`;
//       })
//     );
//   }, [JSON.stringify(baseCoins)]);

//   // ── Helpers ──────────────────────────────────────────────────────────────
//   const cellAt = (r: number, c: number): WheelCell => grid[r][c];

//   const updateCell = (r: number, c: number, cell: WheelCell) => {
//     setGrid(prev => {
//       const g = prev.map(row => [...row]);
//       g[r][c]  = cell;
//       return g;
//     });
//   };

//   const removeCell = (r: number, c: number) => {
//     updateCell(r, c, { type: "EMPTY" });
//   };

//   const redOnGrid = grid.flat().filter(c => c.type === "RED").length;

//   const hasUpgradeOnGrid = grid.flat().some(c => c.type === "UPGRADE");

//   const handleCellClick = (r: number, c: number) => {
//     if (cellAt(r, c).type !== "EMPTY") return;
//     // Default: add GOLD coin
//     updateCell(r, c, { type: "GOLD", value: COIN_VALUES[0] });
//   };

//   // ── Count new positions since last spin ────────────────────────────────
//   const countNewCoins = () => {
//     let count = 0;
//     grid.forEach((rowArr, r) =>
//       rowArr.forEach((cell, c) => {
//         if (cell.type !== "EMPTY" && !lastSpinPositions.current.has(`${r}-${c}`)) count++;
//       })
//     );
//     return count;
//   };

//   const handleSpin = () => {
//     if (spinsLeft <= 0) return;
//     const newCoins = countNewCoins();
//     const newSpins = newCoins > 0 ? MAX_SPINS : spinsLeft - 1;

//     // Update last spin snapshot
//     const newPositions = new Set<string>();
//     grid.forEach((rowArr, r) =>
//       rowArr.forEach((cell, c) => { if (cell.type !== "EMPTY") newPositions.add(`${r}-${c}`); })
//     );
//     lastSpinPositions.current = newPositions;

//     // Count red coins placed since we track max
//     const reds = grid.flat().filter(c => c.type === "RED").length;
//     setRedCount(reds);
//     setSpinsLeft(newSpins);
//     onSpin(generateWheelGaffe(grid));
//   };

//   const handleReset = () => {
//     const g = seedFromBase(baseCoins);
//     setGrid(g);
//     setSpinsLeft(MAX_SPINS);
//     setRedCount(0);
//     setUsedMults(new Set());
//     lastSpinPositions.current = new Set(
//       baseCoins.map(({ position }) => {
//         const col = Math.floor(position / ROWS); const row = position % ROWS;
//         return `${row}-${col}`;
//       })
//     );
//     onReset();
//   };

//   const effectiveUsedMults = sharedUsedMultipliers ?? usedMults;

//   const handleMultiplierSelect = (r: number, c: number, val: string) => {
//     // Un-use old multiplier
//     const cell = cellAt(r, c);
//     if (cell.type === "RED" && cell.multiplier) {
//       const next = new Set(usedMults);
//       next.delete(cell.multiplier);
//       setUsedMults(next);
//     }
//     // Mark new multiplier as used
//     if (val) {
//       const next = new Set(usedMults);
//       next.add(val);
//       setUsedMults(next);
//       onMultiplierUsed?.(val);
//     }
//     updateCell(r, c, { ...(cell as any), multiplier: val });
//   };

//   // ── Render ────────────────────────────────────────────────────────────────
//   return (
//     <div className="rounded-2xl overflow-hidden" style={{ background: "#1e2235" }}>
//       {/* Header */}
//       <div
//         className="flex justify-between items-center px-5 py-4 cursor-pointer select-none"
//         onClick={() => setIsOpen(!isOpen)}
//       >
//         <h2 className="text-base font-bold text-red-300">🔴 WHEEL Feature</h2>
//         <span className="text-gray-400 text-sm">{isOpen ? "▼" : "▶"}</span>
//       </div>

//       {isOpen && (
//         <div className="px-4 pb-5 flex flex-col gap-4">

//           {/* Stats row */}
//           <div className="flex gap-3 flex-wrap items-center">
//             <span className="px-3 py-1 rounded-full text-xs font-semibold bg-red-900 text-red-200 border border-red-600">
//               🔴 Red used: {redCount} / {MAX_RED_COINS}
//             </span>
//             <button
//               onClick={handleReset}
//               className="px-3 py-1 bg-gray-700 hover:bg-gray-600 rounded text-xs text-gray-300"
//             >
//               Reset
//             </button>
//           </div>

//           {/* Grid 4×5 */}
//           <div
//             className="grid gap-1"
//             style={{ gridTemplateColumns: `repeat(${COLS}, minmax(0,1fr))` }}
//           >
//             {Array.from({ length: ROWS }, (_, r) =>
//               Array.from({ length: COLS }, (_, c) => {
//                 const cell = cellAt(r, c);
//                 const isEmpty = cell.type === "EMPTY";
//                 const bg = CELL_BG[cell.type] ?? CELL_BG.EMPTY;

//                 return (
//                   <div
//                     key={`${r}-${c}`}
//                     onClick={() => isEmpty && handleCellClick(r, c)}
//                     className={`relative rounded-lg border-2 flex flex-col items-center justify-center p-1 transition-all
//                       ${bg} ${isEmpty ? "cursor-pointer min-h-[64px]" : "min-h-[96px] cursor-default"}
//                     `}
//                   >
//                     {/* Position label */}
//                     <span className="absolute top-1 left-1 text-[9px] text-gray-500 opacity-50">
//                       {c * ROWS + r}
//                     </span>

//                     {cell.type === "EMPTY" && (
//                       <span className="text-gray-600 text-xs">+ Add</span>
//                     )}

//                     {cell.type === "GOLD" && (
//                       <div className="flex flex-col items-center gap-1 w-full mt-1">
//                         <span className="text-lg">🟡</span>
//                         <select
//                           className={`text-[10px] text-white rounded px-0.5 py-0.5 w-full border border-yellow-700 outline-none ${CELL_SELECT.GOLD}`}
//                           value={cell.value}
//                           onClick={e => e.stopPropagation()}
//                           onChange={e => updateCell(r, c, { type: "GOLD", value: e.target.value })}
//                         >
//                           {COIN_VALUES.map(v => <option key={v} value={v} className="bg-gray-900">{v}</option>)}
//                         </select>
//                         {/* Type switcher */}
//                         <select
//                           className={`text-[10px] text-white rounded px-0.5 py-0.5 w-full border border-yellow-700 outline-none ${CELL_SELECT.GOLD}`}
//                           value="GOLD"
//                           onClick={e => e.stopPropagation()}
//                           onChange={e => {
//                             const t = e.target.value;
//                             if (t === "RED" && redOnGrid < MAX_RED_COINS) updateCell(r, c, { type: "RED", value: cell.value, multiplier: "" });
//                             if (t === "UPGRADE" && !hasUpgradeOnGrid) updateCell(r, c, { type: "UPGRADE", featureColor: "blue" });
//                           }}
//                         >
//                           <option value="GOLD">GOLD</option>
//                           {redOnGrid < MAX_RED_COINS && <option value="RED">RED</option>}
//                           {!hasUpgradeOnGrid && <option value="UPGRADE">UPGRADE</option>}
//                         </select>
//                         <button onClick={e => { e.stopPropagation(); removeCell(r, c); }}
//                           className="absolute top-1 right-1 text-[10px] text-red-400 hover:text-red-200 font-bold">✕</button>
//                       </div>
//                     )}

//                     {cell.type === "RED" && (
//                       <div className="flex flex-col items-center gap-1 w-full mt-1">
//                         <span className="text-lg">🔴</span>
//                         {/* Value */}
//                         <select
//                           className={`text-[10px] text-white rounded px-0.5 py-0.5 w-full border border-red-700 outline-none ${CELL_SELECT.RED}`}
//                           value={cell.value}
//                           onClick={e => e.stopPropagation()}
//                           onChange={e => updateCell(r, c, { ...cell, value: e.target.value })}
//                         >
//                           {COIN_VALUES.map(v => <option key={v} value={v} className="bg-gray-900">{v}</option>)}
//                         </select>
//                         {/* Multiplier */}
//                         <select
//                           className={`text-[10px] text-white rounded px-0.5 py-0.5 w-full border border-red-700 outline-none ${CELL_SELECT.RED}`}
//                           value={cell.multiplier}
//                           onClick={e => e.stopPropagation()}
//                           onChange={e => handleMultiplierSelect(r, c, e.target.value)}
//                         >
//                           <option value="" className="bg-gray-900">─ Mult ─</option>
//                           {MULTI_VALUES.map(m => (
//                             <option
//                               key={m} value={m}
//                               disabled={effectiveUsedMults.has(m) && cell.multiplier !== m}
//                               className={effectiveUsedMults.has(m) && cell.multiplier !== m ? "text-gray-600 bg-gray-900" : "bg-gray-900"}
//                             >{effectiveUsedMults.has(m) && cell.multiplier !== m ? `${m} (used)` : m}</option>
//                           ))}
//                         </select>
//                         {/* Type back to GOLD */}
//                         <select
//                           className={`text-[10px] text-white rounded px-0.5 py-0.5 w-full border border-red-700 outline-none ${CELL_SELECT.RED}`}
//                           value="RED"
//                           onClick={e => e.stopPropagation()}
//                           onChange={e => {
//                             if (e.target.value === "GOLD") updateCell(r, c, { type: "GOLD", value: cell.value });
//                             if (e.target.value === "UPGRADE" && !hasUpgradeOnGrid) updateCell(r, c, { type: "UPGRADE", featureColor: "blue" });
//                           }}
//                         >
//                           <option value="RED">RED</option>
//                           <option value="GOLD">GOLD</option>
//                           {!hasUpgradeOnGrid && <option value="UPGRADE">UPGRADE</option>}
//                         </select>
//                         <button onClick={e => { e.stopPropagation(); removeCell(r, c); }}
//                           className="absolute top-1 right-1 text-[10px] text-red-400 hover:text-red-200 font-bold">✕</button>
//                       </div>
//                     )}

//                     {cell.type === "UPGRADE" && (
//                       <div className="flex flex-col items-center gap-1 w-full mt-1">
//                         <span className="text-lg">⬆️</span>
//                         <select
//                           className={`text-[10px] text-white rounded px-0.5 py-0.5 w-full border border-indigo-700 outline-none ${CELL_SELECT.UPGRADE}`}
//                           value={cell.featureColor}
//                           onClick={e => e.stopPropagation()}
//                           onChange={e => updateCell(r, c, { type: "UPGRADE", featureColor: e.target.value as any })}
//                         >
//                           <option value="blue" className="bg-gray-900">→ TOWER (blue)</option>
//                           <option value="purple" className="bg-gray-900">→ ZONE (purple)</option>
//                         </select>
//                         <button onClick={e => { e.stopPropagation(); removeCell(r, c); }}
//                           className="absolute top-1 right-1 text-[10px] text-red-400 hover:text-red-200 font-bold">✕</button>
//                       </div>
//                     )}
//                   </div>
//                 );
//               })
//             )}
//           </div>

//           {/* Spin controls */}
//           <div className="flex items-center gap-4 flex-wrap">
//             <button
//               onClick={handleSpin}
//               disabled={spinsLeft <= 0}
//               className={`px-6 py-2 rounded-lg font-bold text-white transition-all ${
//                 spinsLeft > 0 ? "bg-green-600 hover:bg-green-500" : "bg-gray-600 opacity-50 cursor-not-allowed"
//               }`}
//             >
//               Spin
//             </button>
//             <span className="text-sm text-gray-300">
//               Spins Left: {spinsLeft}
//             </span>
//           </div>

//           {/* Legend */}
//           <div className="text-xs text-gray-500 flex gap-3 flex-wrap">
//             <span>🟡 Gold (value only)</span>
//             <span>🔴 Red (value + multiplier, max {MAX_RED_COINS})</span>
//             <span>⬆️ Upgrade (max 1)</span>
//           </div>
//         </div>
//       )}
//     </div>
//   );
// }



//! working 
// /* eslint-disable @typescript-eslint/no-explicit-any */
// "use client";

// import { useState, useEffect, useRef } from "react";
// import {
//   WheelCell, ROWS, COLS, MAX_SPINS, MAX_RED_COINS,
//   COIN_VALUES, MULTI_VALUES,
//   emptyGrid, seedFromBase, generateWheelGaffe,
// } from "./wheelFeatureGenerator";

// // ─── Props ────────────────────────────────────────────────────────────────────
// type Props = {
//   baseCoins:              { position: number; value: string }[];
//   onSpin:                 (line: string) => void;
//   onReset:                () => void;
//   sharedUsedMultipliers?: Set<string>;
//   onMultiplierUsed?:      (m: string) => void;
// };

// // ─── Component ───────────────────────────────────────────────────────────────
// export default function WheelFeature({
//   baseCoins, onSpin, onReset,
//   sharedUsedMultipliers, onMultiplierUsed,
// }: Props) {
//   const [isOpen,    setIsOpen]    = useState(true);
//   const [grid,      setGrid]      = useState<WheelCell[][]>(() => seedFromBase(baseCoins));
//   const [spinsLeft, setSpinsLeft] = useState(MAX_SPINS);
//   const [localUsed, setLocalUsed] = useState<Set<string>>(new Set());

//   const lastSnapshot = useRef<Set<string>>(new Set());

//   // Initial snapshot from seeded coins
//   useEffect(() => {
//     const g = seedFromBase(baseCoins);
//     setGrid(g);
//     setSpinsLeft(MAX_SPINS);
//     setLocalUsed(new Set());
//     const snap = new Set<string>();
//     g.forEach((row, r) => row.forEach((cell, c) => { if (cell.type !== "EMPTY") snap.add(`${r},${c}`); }));
//     lastSnapshot.current = snap;
//   }, [JSON.stringify(baseCoins)]);

//   const usedMults   = sharedUsedMultipliers ?? localUsed;
//   const redCount    = grid.flat().filter(c => c.type === "RED").length;
//   const hasUpgrade  = grid.flat().some(c => c.type === "UPGRADE");

//   // ── Click cycle: EMPTY → GOLD → RED → GOLD → ... ───────────────────────
//   const handleCellClick = (r: number, c: number) => {
//     setGrid(prev => {
//       const g    = prev.map(row => [...row]);
//       const cell = g[r][c];

//       if (cell.type === "EMPTY") {
//         g[r][c] = { type: "GOLD", value: COIN_VALUES[0] };
//       } else if (cell.type === "GOLD") {
//         if (redCount < MAX_RED_COINS) {
//           g[r][c] = { type: "RED", value: cell.value, multiplier: "" };
//         }
//         // if at max reds, stay GOLD (user can still remove via ✕)
//       } else if (cell.type === "RED") {
//         // cycle back to GOLD
//         // free the multiplier
//         if (cell.multiplier) {
//           const next = new Set(localUsed);
//           next.delete(cell.multiplier);
//           setLocalUsed(next);
//         }
//         g[r][c] = { type: "GOLD", value: cell.value };
//       }
//       return g;
//     });
//   };

//   const handleRemove = (r: number, c: number) => {
//     setGrid(prev => {
//       const g    = prev.map(row => [...row]);
//       const cell = g[r][c];
//       if (cell.type === "RED" && cell.multiplier) {
//         const next = new Set(localUsed);
//         next.delete(cell.multiplier);
//         setLocalUsed(next);
//       }
//       g[r][c] = { type: "EMPTY" };
//       return g;
//     });
//   };

//   const updateGoldValue = (r: number, c: number, value: string) => {
//     setGrid(prev => {
//       const g = prev.map(row => [...row]);
//       const cell = g[r][c];
//       if (cell.type === "GOLD") g[r][c] = { type: "GOLD", value };
//       if (cell.type === "RED")  g[r][c] = { ...cell, value };
//       return g;
//     });
//   };

//   const handleMultiplierSelect = (r: number, c: number, val: string) => {
//     setGrid(prev => {
//       const g    = prev.map(row => [...row]);
//       const cell = g[r][c];
//       if (cell.type !== "RED") return g;
//       // Free old multiplier
//       if (cell.multiplier) {
//         const next = new Set(localUsed);
//         next.delete(cell.multiplier);
//         setLocalUsed(next);
//       }
//       // Mark new multiplier
//       if (val) {
//         setLocalUsed(prev2 => new Set([...prev2, val]));
//         onMultiplierUsed?.(val);
//       }
//       g[r][c] = { ...cell, multiplier: val };
//       return g;
//     });
//   };

//   // ── Spin ─────────────────────────────────────────────────────────────────
//   const handleSpin = () => {
//     if (spinsLeft <= 0) return;

//     const currentSnap = new Set<string>();
//     grid.forEach((row, r) => row.forEach((cell, c) => {
//       if (cell.type !== "EMPTY") currentSnap.add(`${r},${c}`);
//     }));
//     const hasNew = [...currentSnap].some(k => !lastSnapshot.current.has(k));
//     lastSnapshot.current = currentSnap;

//     setSpinsLeft(hasNew ? MAX_SPINS : spinsLeft - 1);
//     onSpin(generateWheelGaffe(grid));
//   };

//   const handleReset = () => {
//     const g = seedFromBase(baseCoins);
//     setGrid(g);
//     setSpinsLeft(MAX_SPINS);
//     setLocalUsed(new Set());
//     const snap = new Set<string>();
//     g.forEach((row, r) => row.forEach((cell, c) => { if (cell.type !== "EMPTY") snap.add(`${r},${c}`); }));
//     lastSnapshot.current = snap;
//     onReset();
//   };

//   // ─── Render ───────────────────────────────────────────────────────────────
//   return (
//     <div className="rounded-2xl overflow-hidden" style={{ background: "#1e2235" }}>
//       {/* Header */}
//       <div
//         className="flex justify-between items-center px-5 py-4 cursor-pointer select-none"
//         onClick={() => setIsOpen(!isOpen)}
//       >
//         <h2 className="text-base font-bold text-red-300">🔴 WHEEL Feature</h2>
//         <span className="text-gray-400 text-sm">{isOpen ? "▼" : "▶"}</span>
//       </div>

//       {isOpen && (
//         <div className="px-4 pb-5 flex flex-col gap-4">

//           {/* Stats */}
//           <div className="flex items-center gap-3 flex-wrap">
//             <span className="px-3 py-1 rounded-full text-xs font-semibold bg-red-950 text-red-300 border border-red-700">
//               🔴 Red used: {redCount} / {MAX_RED_COINS}
//             </span>
//             <button onClick={handleReset}
//               className="px-3 py-1 bg-gray-700 hover:bg-gray-600 rounded text-xs text-gray-300">
//               Reset
//             </button>
//           </div>

//           {/* Grid 4×5 */}
//           <div className="grid gap-1" style={{ gridTemplateColumns: `repeat(${COLS}, minmax(0,1fr))` }}>
//             {Array.from({ length: ROWS }, (_, r) =>
//               Array.from({ length: COLS }, (_, c) => {
//                 const cell    = grid[r][c];
//                 const isEmpty = cell.type === "EMPTY";
//                 // No special bg for GOLD or RED — always default dark
//                 const border  = cell.type === "RED" ? "border-red-800"
//                               : cell.type === "GOLD" ? "border-gray-600"
//                               : "border-gray-700 hover:border-gray-500";

//                 return (
//                   <div
//                     key={`${r}-${c}`}
//                     onClick={() => handleCellClick(r, c)}
//                     className={`relative rounded-lg border-2 bg-[#1a2035] flex flex-col items-center justify-center p-1.5 transition-all cursor-pointer
//                       ${border}
//                       ${isEmpty ? "min-h-[60px]" : "min-h-[96px]"}
//                     `}
//                   >
//                     {/* Flat index */}
//                     <span className="absolute top-1 left-1.5 text-[9px] text-gray-600 opacity-50 select-none">
//                       {c * ROWS + r}
//                     </span>

//                     {/* EMPTY */}
//                     {isEmpty && (
//                       <div className="flex flex-col items-center gap-0.5 pointer-events-none">
//                         <span className="text-gray-600 text-[10px]">+ Gold</span>
//                         <span className="text-red-800 text-[9px]">→ Red</span>
//                       </div>
//                     )}

//                     {/* GOLD — no bg, just coin + value */}
//                     {cell.type === "GOLD" && (
//                       <div className="flex flex-col items-center gap-1 w-full mt-2">
//                         <span className="text-base leading-none">🟡</span>
//                         <select
//                           className="text-[10px] text-white rounded px-0.5 py-0.5 w-full bg-gray-800 border border-gray-600 outline-none"
//                           value={cell.value}
//                           onClick={e => e.stopPropagation()}
//                           onChange={e => updateGoldValue(r, c, e.target.value)}
//                         >
//                           {COIN_VALUES.map(v => <option key={v} value={v} className="bg-gray-900">{v}</option>)}
//                         </select>
//                         {redCount < MAX_RED_COINS &&
//                           <span className="text-[9px] text-gray-600 italic pointer-events-none">click → red</span>}
//                       </div>
//                     )}

//                     {/* RED — no bg, coin + value + multiplier */}
//                     {cell.type === "RED" && (
//                       <div className="flex flex-col items-center gap-1 w-full mt-2">
//                         <span className="text-base leading-none">🔴</span>
//                         {/* Value */}
//                         <select
//                           className="text-[10px] text-white rounded px-0.5 py-0.5 w-full bg-gray-800 border border-gray-600 outline-none"
//                           value={cell.value}
//                           onClick={e => e.stopPropagation()}
//                           onChange={e => updateGoldValue(r, c, e.target.value)}
//                         >
//                           {COIN_VALUES.map(v => <option key={v} value={v} className="bg-gray-900">{v}</option>)}
//                         </select>
//                         {/* Multiplier */}
//                         <select
//                           className="text-[10px] text-white rounded px-0.5 py-0.5 w-full bg-gray-800 border border-red-700 outline-none"
//                           value={cell.multiplier}
//                           onClick={e => e.stopPropagation()}
//                           onChange={e => handleMultiplierSelect(r, c, e.target.value)}
//                         >
//                           <option value="" className="bg-gray-900">─ Mult ─</option>
//                           {MULTI_VALUES.map(m => {
//                             const isUsedElsewhere = usedMults.has(m) && cell.multiplier !== m;
//                             return (
//                               <option key={m} value={m} disabled={isUsedElsewhere}
//                                 className={isUsedElsewhere ? "text-gray-600 bg-gray-900" : "bg-gray-900"}>
//                                 {isUsedElsewhere ? `${m} (used)` : m}
//                               </option>
//                             );
//                           })}
//                         </select>
//                         <span className="text-[9px] text-gray-600 italic pointer-events-none">click → gold</span>
//                       </div>
//                     )}

//                     {/* Cross — all occupied cells */}
//                     {!isEmpty && (
//                       <button
//                         onClick={e => { e.stopPropagation(); handleRemove(r, c); }}
//                         className="absolute top-1 right-1.5 text-[11px] text-red-400 hover:text-red-200 font-bold leading-none"
//                       >✕</button>
//                     )}
//                   </div>
//                 );
//               })
//             )}
//           </div>

//           {/* Spin */}
//           <div className="flex items-center gap-4 flex-wrap">
//             <button
//               onClick={handleSpin}
//               disabled={spinsLeft <= 0}
//               className={`px-6 py-2 rounded-lg font-bold text-white transition-all ${
//                 spinsLeft > 0 ? "bg-green-600 hover:bg-green-500" : "bg-gray-600 opacity-50 cursor-not-allowed"
//               }`}
//             >Spin</button>
//             <span className="text-sm text-gray-300">Spins Left: {spinsLeft}</span>
//           </div>

//           <div className="text-xs text-gray-500 flex gap-3 flex-wrap">
//             <span>🟡 Gold (value) → click → 🔴 Red (value + multiplier, max {MAX_RED_COINS})</span>
//           </div>
//         </div>
//       )}
//     </div>
//   );
// }



//! latest working 
// /* eslint-disable @typescript-eslint/no-explicit-any */
// "use client";

// import { useState, useEffect, useRef } from "react";
// import {
//   WheelCell, ROWS, COLS, MAX_SPINS, MAX_RED_COINS,
//   COIN_VALUES, MULTIPLIER_LADDER,
//   emptyGrid, seedFromBase, generateWheelGaffe,
// } from "./wheelFeatureGenerator";

// // ─── Props ─────────────────────────────────────────────────────────────────────
// type Props = {
//   baseCoins: { position: number; value: string }[];
//   onSpin:    (line: string) => void;
//   onReset:   () => void;
//   /** Multiplier values already used in combination (from other features) */
//   sharedSpentMultipliers?: string[];
//   onMultiplierSpent?:      (val: string) => void;
// };

// // ─── Component ─────────────────────────────────────────────────────────────────
// export default function WheelFeature({
//   baseCoins, onSpin, onReset,
//   sharedSpentMultipliers,
//   onMultiplierSpent,
// }: Props) {
//   const [isOpen,    setIsOpen]    = useState(true);
//   const [grid,      setGrid]      = useState<WheelCell[][]>(() => seedFromBase(baseCoins));
//   const [spinsLeft, setSpinsLeft] = useState(MAX_SPINS);

//   /**
//    * spentMultipliers: ladder prize VALUES that have been used in previous spins.
//    * e.g. ["GRAND", "5"] means GRAND and 5 have been used already.
//    * Used to compute the remaining ladder and correct indices.
//    */
//   const [spentMultipliers, setSpentMultipliers] = useState<string[]>([]);

//   const lastSnapshot = useRef<Set<string>>(new Set());

//   // ── Re-seed on baseCoins change ────────────────────────────────────────────
//   useEffect(() => {
//     const g = seedFromBase(baseCoins);
//     setGrid(g);
//     setSpinsLeft(MAX_SPINS);
//     setSpentMultipliers([]);
//     const snap = new Set<string>();
//     g.forEach((row, r) => row.forEach((cell, c) => {
//       if (cell.type !== "EMPTY") snap.add(`${r},${c}`);
//     }));
//     lastSnapshot.current = snap;
//   }, [JSON.stringify(baseCoins)]);

//   // ── Derived ────────────────────────────────────────────────────────────────

//   /**
//    * The currently-remaining ladder after removing spent items.
//    * Each entry keeps its VALUE so we can find the current index easily.
//    * Example: if GRAND was spent → remainingLadder = ["5","10","38","3","88","MAJOR","2","28","8","68","18"]
//    *          "5" is now at index 0, "10" at index 1, etc.
//    */
//   const effectiveSpent    = sharedSpentMultipliers ?? spentMultipliers;
//   const remainingLadder   = MULTIPLIER_LADDER.filter(m => !effectiveSpent.includes(m));

//   const redCount  = grid.flat().filter(c => c.type === "RED").length;

//   // ── Grid mutators ──────────────────────────────────────────────────────────
//   const applyGrid = (fn: (g: WheelCell[][]) => void) => {
//     setGrid(prev => { const g = prev.map(row => [...row]); fn(g); return g; });
//   };

//   /**
//    * Click cycle:  EMPTY → GOLD → RED (if < max) → GOLD → ...
//    * Cross (✕) always removes.
//    */
//   const handleCellClick = (r: number, c: number) => {
//     applyGrid(g => {
//       const cell = g[r][c];
//       if (cell.type === "EMPTY") {
//         g[r][c] = { type: "GOLD", value: COIN_VALUES[0] };
//       } else if (cell.type === "GOLD") {
//         if (redCount < MAX_RED_COINS) {
//           g[r][c] = { type: "RED", value: cell.value, multiplier: "" };
//         }
//       } else if (cell.type === "RED") {
//         // Cycle back to GOLD; if multiplier was reserved just clear it
//         g[r][c] = { type: "GOLD", value: cell.value };
//       }
//     });
//   };

//   const handleRemove = (r: number, c: number) => {
//     applyGrid(g => { g[r][c] = { type: "EMPTY" }; });
//   };

//   const updateValue = (r: number, c: number, value: string) => {
//     applyGrid(g => {
//       const cell = g[r][c];
//       if (cell.type === "GOLD") g[r][c] = { type: "GOLD", value };
//       if (cell.type === "RED")  g[r][c] = { ...cell, value };
//     });
//   };

//   /**
//    * Set the multiplier for a RED coin.
//    * The multiplier dropdown shows the REMAINING ladder items
//    * so the user can only pick un-used prizes.
//    */
//   const handleMultiplierSelect = (r: number, c: number, val: string) => {
//     applyGrid(g => {
//       const cell = g[r][c];
//       if (cell.type === "RED") g[r][c] = { ...cell, multiplier: val };
//     });
//   };

//   // ── Spin ───────────────────────────────────────────────────────────────────
//   const handleSpin = () => {
//     if (spinsLeft <= 0) return;

//     // Detect new positions since last spin
//     const currentSnap = new Set<string>();
//     grid.forEach((row, r) => row.forEach((cell, c) => {
//       if (cell.type !== "EMPTY") currentSnap.add(`${r},${c}`);
//     }));
//     const hasNew = [...currentSnap].some(k => !lastSnapshot.current.has(k));
//     lastSnapshot.current = currentSnap;

//     // Find the NEW red coin (if any) and its multiplier ladder index
//     let ladderIndex: number | undefined;
//     let usedMultiplierValue: string | undefined;

//     grid.forEach((row, r) => row.forEach((cell, c) => {
//       if (cell.type !== "RED") return;
//       const key = `${r},${c}`;
//       // "New" means this position wasn't occupied after the last spin
//       const isNew = !Array.from(lastSnapshot.current).includes(key)
//         || cell.multiplier; // also capture multiplier on any red coin this spin

//       if (cell.type === "RED" && cell.multiplier) {
//         // Find index of this multiplier in the remaining ladder
//         const idx = remainingLadder.indexOf(cell.multiplier);
//         if (idx !== -1 && ladderIndex === undefined) {
//           ladderIndex           = idx;
//           usedMultiplierValue   = cell.multiplier;
//         }
//       }
//     }));

//     // Generate gaffe with new format
//     onSpin(generateWheelGaffe(grid, ladderIndex));

//     // Mark multiplier as spent so it's removed from future dropdowns
//     if (usedMultiplierValue) {
//       const newSpent = [...spentMultipliers, usedMultiplierValue];
//       setSpentMultipliers(newSpent);
//       onMultiplierSpent?.(usedMultiplierValue);
//       // Clear the multiplier on the RED cell (it's been "used" for this spin)
//       setGrid(prev => {
//         const g = prev.map(row => [...row]);
//         g.forEach((row, r) => row.forEach((cell, c) => {
//           if (cell.type === "RED" && cell.multiplier === usedMultiplierValue) {
//             g[r][c] = { ...cell, multiplier: "" };
//           }
//         }));
//         return g;
//       });
//     }

//     setSpinsLeft(hasNew ? MAX_SPINS : spinsLeft - 1);
//   };

//   const handleReset = () => {
//     const g = seedFromBase(baseCoins);
//     setGrid(g);
//     setSpinsLeft(MAX_SPINS);
//     setSpentMultipliers([]);
//     const snap = new Set<string>();
//     g.forEach((row, r) => row.forEach((cell, c) => {
//       if (cell.type !== "EMPTY") snap.add(`${r},${c}`);
//     }));
//     lastSnapshot.current = snap;
//     onReset();
//   };

//   // ─── Render ────────────────────────────────────────────────────────────────
//   return (
//     <div className="rounded-2xl overflow-hidden" style={{ background: "#1e2235" }}>

//       {/* Header */}
//       <div
//         className="flex justify-between items-center px-5 py-4 cursor-pointer select-none"
//         onClick={() => setIsOpen(!isOpen)}
//       >
//         <h2 className="text-base font-bold text-red-300">🔴 WHEEL Feature</h2>
//         <span className="text-gray-400 text-sm">{isOpen ? "▼" : "▶"}</span>
//       </div>

//       {isOpen && (
//         <div className="px-4 pb-5 flex flex-col gap-4">

//           {/* Stats */}
//           <div className="flex items-center gap-3 flex-wrap">
//             <span className="px-3 py-1 rounded-full text-xs font-semibold bg-red-950 text-red-300 border border-red-800">
//               🔴 Red used: {redCount} / {MAX_RED_COINS}
//             </span>

//             {/* Remaining ladder preview */}
//             <div className="flex items-center gap-1.5 flex-wrap">
//               <span className="text-xs text-gray-500">Ladder remaining:</span>
//               {remainingLadder.slice(0, 6).map((val, i) => (
//                 <span key={val}
//                   className="text-[10px] px-1.5 py-0.5 rounded border border-gray-700 text-gray-300">
//                   <span className="text-gray-600 mr-0.5">{i}:</span>{val}
//                 </span>
//               ))}
//               {remainingLadder.length > 6 && (
//                 <span className="text-[10px] text-gray-600">+{remainingLadder.length - 6} more</span>
//               )}
//             </div>

//             <button onClick={handleReset}
//               className="px-3 py-1 bg-gray-700 hover:bg-gray-600 rounded text-xs text-gray-300">
//               Reset
//             </button>
//           </div>

//           {/* Grid 4×5 */}
//           <div className="grid gap-1"
//             style={{ gridTemplateColumns: `repeat(${COLS}, minmax(0,1fr))` }}>
//             {Array.from({ length: ROWS }, (_, r) =>
//               Array.from({ length: COLS }, (_, c) => {
//                 const cell    = grid[r][c];
//                 const isEmpty = cell.type === "EMPTY";
//                 // No special bg for GOLD or RED — just a border hint
//                 const border  = cell.type === "RED"
//                   ? "border-red-800"
//                   : cell.type === "GOLD"
//                   ? "border-gray-600"
//                   : "border-gray-700 hover:border-gray-500";

//                 return (
//                   <div
//                     key={`${r}-${c}`}
//                     onClick={() => handleCellClick(r, c)}
//                     className={`relative rounded-lg border-2 bg-[#1a2035] flex flex-col items-center
//                       justify-center p-1.5 transition-all cursor-pointer ${border}
//                       ${isEmpty ? "min-h-[58px]" : cell.type === "RED" ? "min-h-[110px]" : "min-h-[80px]"}`}
//                   >
//                     {/* Flat index */}
//                     <span className="absolute top-1 left-1.5 text-[9px] text-gray-600 opacity-50 select-none">
//                       {c * ROWS + r}
//                     </span>

//                     {/* EMPTY */}
//                     {isEmpty && (
//                       <div className="flex flex-col items-center gap-0.5 pointer-events-none">
//                         <span className="text-gray-600 text-[10px]">+ Gold</span>
//                         <span className="text-red-900 text-[9px]">→ Red</span>
//                       </div>
//                     )}

//                     {/* GOLD — no bg, just coin + value */}
//                     {cell.type === "GOLD" && (
//                       <div className="flex flex-col items-center gap-1 w-full mt-2">
//                         <span className="text-base leading-none">🟡</span>
//                         <select
//                           className="text-[10px] text-white rounded px-0.5 py-0.5 w-full
//                             bg-gray-800 border border-gray-600 outline-none"
//                           value={cell.value}
//                           onClick={e => e.stopPropagation()}
//                           onChange={e => updateValue(r, c, e.target.value)}
//                         >
//                           {COIN_VALUES.map(v =>
//                             <option key={v} value={v} className="bg-gray-900">{v}</option>
//                           )}
//                         </select>
//                         {redCount < MAX_RED_COINS && (
//                           <span className="text-[8px] text-gray-600 italic pointer-events-none">
//                             click → red
//                           </span>
//                         )}
//                       </div>
//                     )}

//                     {/* RED — coin value + multiplier ladder dropdown */}
//                     {cell.type === "RED" && (
//                       <div className="flex flex-col items-center gap-1 w-full mt-2">
//                         <span className="text-base leading-none">🔴</span>

//                         {/* Coin value */}
//                         <select
//                           className="text-[10px] text-white rounded px-0.5 py-0.5 w-full
//                             bg-gray-800 border border-gray-600 outline-none"
//                           value={cell.value}
//                           onClick={e => e.stopPropagation()}
//                           onChange={e => updateValue(r, c, e.target.value)}
//                         >
//                           {COIN_VALUES.map(v =>
//                             <option key={v} value={v} className="bg-gray-900">{v}</option>
//                           )}
//                         </select>

//                         {/* Multiplier ladder dropdown — shows remaining items with current indices */}
//                         <select
//                           className="text-[10px] text-white rounded px-0.5 py-0.5 w-full
//                             bg-gray-800 border border-red-800 outline-none"
//                           value={cell.multiplier}
//                           onClick={e => e.stopPropagation()}
//                           onChange={e => handleMultiplierSelect(r, c, e.target.value)}
//                         >
//                           <option value="" className="bg-gray-900">─ Ladder Prize ─</option>
//                           {remainingLadder.map((val, idx) => (
//                             <option key={val} value={val} className="bg-gray-900">
//                               [{idx}] {val}
//                             </option>
//                           ))}
//                         </select>

//                         {/* Show which index will be in output */}
//                         {cell.multiplier && (
//                           <span className="text-[9px] text-red-300 font-semibold">
//                             → multiplierLadderPrize: [{remainingLadder.indexOf(cell.multiplier)}]
//                           </span>
//                         )}

//                         <span className="text-[8px] text-gray-600 italic pointer-events-none">
//                           click → gold
//                         </span>
//                       </div>
//                     )}

//                     {/* ✕ remove */}
//                     {!isEmpty && (
//                       <button
//                         onClick={e => { e.stopPropagation(); handleRemove(r, c); }}
//                         className="absolute top-1 right-1.5 text-[10px] text-red-400
//                           hover:text-red-200 font-bold leading-none"
//                       >✕</button>
//                     )}
//                   </div>
//                 );
//               })
//             )}
//           </div>

//           {/* Spent multipliers */}
//           {effectiveSpent.length > 0 && (
//             <div className="flex items-center gap-2 flex-wrap">
//               <span className="text-xs text-gray-500">Used prizes:</span>
//               {effectiveSpent.map(val => (
//                 <span key={val}
//                   className="text-[10px] px-1.5 py-0.5 rounded bg-gray-800 text-gray-500 line-through">
//                   {val}
//                 </span>
//               ))}
//             </div>
//           )}

//           {/* Spin */}
//           <div className="flex items-center gap-4 flex-wrap">
//             <button
//               onClick={handleSpin}
//               disabled={spinsLeft <= 0}
//               className={`px-6 py-2 rounded-lg font-bold text-white transition-all ${
//                 spinsLeft > 0
//                   ? "bg-green-600 hover:bg-green-500"
//                   : "bg-gray-600 opacity-50 cursor-not-allowed"
//               }`}
//             >Spin</button>
//             <span className="text-sm text-gray-300">Spins Left: {spinsLeft}</span>
//           </div>

//           {/* Legend */}
//           <div className="text-xs text-gray-500 flex gap-3 flex-wrap">
//             <span>🟡 Gold (value) → click → 🔴 Red (value + ladder prize)</span>
//             <span>Max {MAX_RED_COINS} red coins</span>
//           </div>

//         </div>
//       )}
//     </div>
//   );
// }





/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { useState, useEffect, useRef, useMemo } from "react";
import {
  WheelCell, EReelSetting,
  GRID_ROWS, GRID_COLS, MAX_RED_COINS, MAX_SPINS,
  COIN_VALUES, MULTIPLIER_VALUES, RED_COIN_SEQUENCE,
  emptyGrid, seedFromBase, generateWheelGaffe,
  gridToPos, posToCol, eReelOptions, UNLOCKED_POSITIONS,
} from "./wheelFeatureGenerator";

// ─── Props ─────────────────────────────────────────────────────────────────────
type Props = {
  baseCoins:               { position: number; value: string }[];
  onSpin:                  (line: string) => void;
  onReset:                 () => void;
  sharedSpentMultipliers?: string[];
  onMultiplierSpent?:      (val: string) => void;
};

// ─── Component ─────────────────────────────────────────────────────────────────
export default function WheelFeature({
  baseCoins, onSpin, onReset,
  sharedSpentMultipliers, onMultiplierSpent,
}: Props) {
  const [isOpen,           setIsOpen]           = useState(true);
  const [grid,             setGrid]             = useState<WheelCell[][]>(() => seedFromBase(baseCoins));
  const [spinsLeft,        setSpinsLeft]        = useState(MAX_SPINS);
  const [redCoinIdx,       setRedCoinIdx]       = useState(0);     // next RED_COIN_SEQUENCE index
  const [spentMultipliers, setSpentMultipliers] = useState<string[]>([]);
  const [eReelPos,         setEReelPos]         = useState<EReelSetting | null>(null);

  /** Flat global positions occupied at the START of each spin (used for snapshot diffing) */
  const lastSnapshot = useRef<Set<number>>(new Set());

  // ── Re-seed whenever baseCoins change ─────────────────────────────────────
  useEffect(() => {
    const g = seedFromBase(baseCoins);
    setGrid(g);
    setSpinsLeft(MAX_SPINS);
    setRedCoinIdx(0);
    setSpentMultipliers([]);
    setEReelPos(null);
    const snap = new Set<number>();
    g.forEach((row, r) => row.forEach((cell, c) => {
      if (cell.type !== "EMPTY") snap.add(gridToPos(r, c));
    }));
    lastSnapshot.current = snap;
  }, [JSON.stringify(baseCoins)]);

  // ── Derived ────────────────────────────────────────────────────────────────
  const effectiveSpent     = sharedSpentMultipliers ?? spentMultipliers;
  const availableMults     = MULTIPLIER_VALUES.filter(m => !effectiveSpent.includes(m));
  const redCount           = grid.flat().filter(c => c.type === "RED").length;
  const nextRedCoinDisplay = RED_COIN_SEQUENCE[redCoinIdx] ?? "—";

  /**
   * Positions seeded from base-game coins — derived from props so it can be
   * safely read during render (refs must not be accessed during render).
   */
  const basePositions = useMemo(() => {
    const s = new Set<number>();
    baseCoins.forEach(({ position }) => {
      const col = Math.floor(position / 4);
      const row = position % 4;
      s.add(gridToPos(row, col));
    });
    return s;
  }, [JSON.stringify(baseCoins)]);

  // ── Grid helpers ───────────────────────────────────────────────────────────
  const applyGrid = (fn: (g: WheelCell[][]) => void) => {
    setGrid(prev => {
      const g = prev.map(row => [...row]);
      fn(g);
      return g;
    });
  };

  /**
   * Click cycle on a cell:
   *   EMPTY → GOLD
   *   GOLD  → RED  (if under max)
   *   RED   → GOLD
   */
  const handleCellClick = (r: number, c: number) => {
    applyGrid(g => {
      const cell = g[r][c];
      if (cell.type === "EMPTY") {
        g[r][c] = { type: "GOLD", value: COIN_VALUES[0] };
      } else if (cell.type === "GOLD") {
        if (redCount < MAX_RED_COINS)
          g[r][c] = { type: "RED", value: cell.value, multiplier: "" };
      } else if (cell.type === "RED") {
        g[r][c] = { type: "GOLD", value: cell.value };
      }
    });
  };

  const handleRemove = (r: number, c: number) => {
    const pos = gridToPos(r, c);
    if (eReelPos?.pos === pos) setEReelPos(null);
    applyGrid(g => { g[r][c] = { type: "EMPTY" }; });
  };

  const updateValue = (r: number, c: number, value: string) => {
    applyGrid(g => {
      const cell = g[r][c];
      if (cell.type === "GOLD") g[r][c] = { ...cell, value };
      if (cell.type === "RED")  g[r][c] = { ...cell, value };
    });
  };

  const handleMultiplierSelect = (r: number, c: number, val: string) => {
    applyGrid(g => {
      const cell = g[r][c];
      if (cell.type === "RED") g[r][c] = { ...cell, multiplier: val };
    });
  };

  // ── typeEReelPosition ─────────────────────────────────────────────────────
  const handleSetEReelPos = (r: number, c: number) => {
    const pos  = gridToPos(r, c);
    const opts = eReelOptions(pos);
    setEReelPos({ pos, value: opts[0] });
  };

  // ── Spin ───────────────────────────────────────────────────────────────────
  const handleSpin = () => {
    if (spinsLeft <= 0) return;

    const prevSnap = new Set(lastSnapshot.current);

    // Snapshot after this spin
    const currentSnap = new Set<number>();
    grid.forEach((row, r) => row.forEach((cell, c) => {
      if (cell.type !== "EMPTY") currentSnap.add(gridToPos(r, c));
    }));
    const hasNew = [...currentSnap].some(k => !prevSnap.has(k));

    // Count new RED coins and collect used multiplier
    let newRedCount   = 0;
    let usedMultValue = "";
    grid.forEach((row, r) => row.forEach((cell, c) => {
      const pos = gridToPos(r, c);
      if (cell.type === "RED" && !prevSnap.has(pos)) {
        newRedCount++;
        if (cell.multiplier) usedMultValue = cell.multiplier;
      }
    }));

    // Generate gaffe with current snapshot as "prev" (positions before this spin)
    onSpin(generateWheelGaffe(grid, prevSnap, eReelPos, redCoinIdx, ["piggyWheel"]));

    // Commit snapshot
    lastSnapshot.current = currentSnap;

    // Advance RED sequence index
    if (newRedCount > 0) setRedCoinIdx(prev => prev + newRedCount);

    // Mark multiplier spent and clear it from the cell
    if (usedMultValue) {
      const newSpent = [...spentMultipliers, usedMultValue];
      setSpentMultipliers(newSpent);
      onMultiplierSpent?.(usedMultValue);
      applyGrid(g => {
        g.forEach((row, r) => row.forEach((cell, c) => {
          if (cell.type === "RED" && cell.multiplier === usedMultValue)
            g[r][c] = { ...cell, multiplier: "" };
        }));
      });
    }

    setSpinsLeft(hasNew ? MAX_SPINS : spinsLeft - 1);
  };

  // ── Reset ─────────────────────────────────────────────────────────────────
  const handleReset = () => {
    const g = seedFromBase(baseCoins);
    setGrid(g);
    setSpinsLeft(MAX_SPINS);
    setRedCoinIdx(0);
    setSpentMultipliers([]);
    setEReelPos(null);
    const snap = new Set<number>();
    g.forEach((row, r) => row.forEach((cell, c) => {
      if (cell.type !== "EMPTY") snap.add(gridToPos(r, c));
    }));
    lastSnapshot.current = snap;
    onReset();
  };

  // ─── Render ────────────────────────────────────────────────────────────────
  return (
    <div className="rounded-2xl overflow-hidden" style={{ background: "#1e2235" }}>

      {/* Header */}
      <div
        className="flex justify-between items-center px-5 py-4 cursor-pointer select-none"
        onClick={() => setIsOpen(!isOpen)}
      >
        <h2 className="text-base font-bold text-red-300">🔴 WHEEL Feature</h2>
        <span className="text-gray-400 text-sm">{isOpen ? "▼" : "▶"}</span>
      </div>

      {isOpen && (
        <div className="px-4 pb-5 flex flex-col gap-4">

          {/* ── Stats bar ── */}
          <div className="flex items-center gap-2 flex-wrap">
            <span className="px-3 py-1 rounded-full text-xs font-semibold bg-red-950 text-red-300 border border-red-800">
              🔴 Red used: {redCount} / {MAX_RED_COINS}
            </span>
            <span className="px-2 py-1 rounded text-[11px] bg-gray-800 text-gray-300 border border-gray-700">
              Next RED: <span className="text-red-400 font-semibold">{nextRedCoinDisplay}</span>
              <span className="text-gray-600 ml-1">#{redCoinIdx + 1}</span>
            </span>
            <button
              onClick={handleReset}
              className="px-3 py-1 bg-gray-700 hover:bg-gray-600 rounded text-xs text-gray-300"
            >
              Reset
            </button>
          </div>

          {/* ── typeEReelPosition panel (shown once set) ── */}
          {eReelPos && (
            <div className="flex items-center gap-2 flex-wrap rounded-lg px-3 py-2"
              style={{ background: "#2a2010", border: "1px solid #6b5300" }}>
              <span className="text-[11px] text-yellow-400 font-semibold">⚡ typeEReelPosition:</span>
              <span className="text-[11px] text-yellow-300 font-mono">
                [{eReelPos.pos},
              </span>
              <select
                className="text-[11px] text-yellow-200 rounded px-1 py-0.5 outline-none border border-yellow-700"
                style={{ background: "#3a2e00" }}
                value={eReelPos.value}
                onChange={e => setEReelPos({ ...eReelPos, value: e.target.value })}
              >
                {eReelOptions(eReelPos.pos).map(v => (
                  <option key={v} value={v} className="bg-gray-900">{v}</option>
                ))}
              </select>
              <span className="text-[11px] text-yellow-300 font-mono">]</span>
              <button
                onClick={() => setEReelPos(null)}
                className="ml-1 text-[10px] text-red-400 hover:text-red-200"
              >✕ clear</button>
            </div>
          )}

          {/* ── Grid 4 × 5 ── */}
          <div
            className="grid gap-1"
            style={{ gridTemplateColumns: `repeat(${GRID_COLS}, minmax(0, 1fr))` }}
          >
            {/* .flat() turns JSX.Element[][] → JSX.Element[] which React accepts */}
            {Array.from({ length: GRID_ROWS }, (_, r) =>
              Array.from({ length: GRID_COLS }, (_, c) => {
                const cell     = grid[r][c];
                const pos      = gridToPos(r, c);
                const isEmpty  = cell.type === "EMPTY";
                const isInBase = basePositions.has(pos);

                // ── Pre-extract typed values to avoid TS narrowing errors in JSX ──
                // WheelCell is a discriminated union; accessing .value / .multiplier
                // inside && expressions causes TS to lose the narrowing. We extract
                // the values here where narrowing works reliably.
                const cellValue      = cell.type !== "EMPTY" ? cell.value      : "";
                const cellMultiplier = cell.type === "RED"   ? cell.multiplier : "";

                const borderCls =
                  cell.type === "RED"  ? "border-red-700"  :
                  cell.type === "GOLD" ? "border-yellow-800" :
                  "border-gray-700 hover:border-gray-500";

                const minH =
                  cell.type === "RED"  ? "130px" :
                  cell.type === "GOLD" ? "88px"  :
                  "52px";

                return (
                  <div
                    key={`${r}-${c}`}
                    onClick={() => handleCellClick(r, c)}
                    className={`relative rounded-lg border-2 bg-[#1a2035] flex flex-col
                      items-center justify-center p-1.5 transition-all cursor-pointer ${borderCls}`}
                    style={{ minHeight: minH }}
                  >
                    {/* Global position badge */}
                    <span className="absolute top-1 left-1.5 text-[9px] text-gray-600 select-none leading-none">
                      {pos}
                    </span>

                    {/* Base-coin badge */}
                    {isInBase && !isEmpty && (
                      <span className="absolute top-1 right-5 text-[8px] text-blue-500 opacity-70 leading-none">
                        base
                      </span>
                    )}

                    {/* ⚡ E-Reel button — shown on all cells until one is chosen */}
                    {eReelPos === null && (
                      <button
                        onClick={e => { e.stopPropagation(); handleSetEReelPos(r, c); }}
                        className="absolute bottom-0.5 left-1 text-[8px] text-yellow-700 hover:text-yellow-400 leading-none select-none"
                        title={`Set pos ${pos} as typeEReelPosition`}
                      >⚡E</button>
                    )}

                    {/* ── EMPTY ── */}
                    {isEmpty && (
                      <div className="flex flex-col items-center gap-0.5 pointer-events-none">
                        <span className="text-gray-600 text-[10px]">+ Gold</span>
                        {redCount < MAX_RED_COINS && (
                          <span className="text-red-900 text-[9px]">→ Red</span>
                        )}
                      </div>
                    )}

                    {/* ── GOLD ── */}
                    {cell.type === "GOLD" && (
                      <div className="flex flex-col items-center gap-1 w-full mt-3">
                        <span className="text-sm leading-none">🟡</span>
                        <select
                          className="text-[10px] text-white rounded px-0.5 py-0.5 w-full
                            bg-gray-800 border border-gray-600 outline-none"
                          value={cellValue}
                          onClick={e => e.stopPropagation()}
                          onChange={e => updateValue(r, c, e.target.value)}
                        >
                          {COIN_VALUES.map(v => (
                            <option key={v} value={v} className="bg-gray-900">{v}</option>
                          ))}
                        </select>
                        {redCount < MAX_RED_COINS && (
                          <span className="text-[8px] text-gray-600 italic pointer-events-none">
                            click → red
                          </span>
                        )}
                      </div>
                    )}

                    {/* ── RED ── */}
                    {cell.type === "RED" && (
                      <div className="flex flex-col items-center gap-1 w-full mt-3">
                        <span className="text-sm leading-none">🔴</span>

                        {/* Which RED_COIN sequence value will be used this spin */}
                        <span className="text-[8px] text-red-400 font-semibold text-center leading-tight">
                          {nextRedCoinDisplay}
                        </span>

                        {/* Coin value */}
                        <select
                          className="text-[10px] text-white rounded px-0.5 py-0.5 w-full
                            bg-gray-800 border border-gray-600 outline-none"
                          value={cellValue}
                          onClick={e => e.stopPropagation()}
                          onChange={e => updateValue(r, c, e.target.value)}
                        >
                          {COIN_VALUES.map(v => (
                            <option key={v} value={v} className="bg-gray-900">{v}</option>
                          ))}
                        </select>

                        {/* Multiplier dropdown */}
                        {availableMults.length > 0 ? (
                          <select
                            className="text-[10px] text-white rounded px-0.5 py-0.5 w-full
                              bg-gray-800 border border-red-800 outline-none"
                            value={cellMultiplier}
                            onClick={e => e.stopPropagation()}
                            onChange={e => handleMultiplierSelect(r, c, e.target.value)}
                          >
                            <option value="" className="bg-gray-900">─ Multiplier ─</option>
                            {availableMults.map(m => (
                              <option key={m} value={m} className="bg-gray-900">{m}</option>
                            ))}
                          </select>
                        ) : (
                          <span className="text-[8px] text-gray-600 italic">no mult left</span>
                        )}

                        {cellMultiplier && (
                          <span className="text-[8px] text-red-300 font-semibold">
                            → {cellMultiplier}
                          </span>
                        )}

                        <span className="text-[8px] text-gray-600 italic pointer-events-none">
                          click → gold
                        </span>
                      </div>
                    )}

                    {/* ✕ remove */}
                    {!isEmpty && (
                      <button
                        onClick={e => { e.stopPropagation(); handleRemove(r, c); }}
                        className="absolute top-1 right-1.5 text-[10px] text-red-400
                          hover:text-red-200 font-bold leading-none"
                      >✕</button>
                    )}
                  </div>
                );
              })
            ).flat()}
          </div>

          {/* ── Used multipliers ── */}
          {effectiveSpent.length > 0 && (
            <div className="flex items-center gap-2 flex-wrap">
              <span className="text-xs text-gray-500">Used multipliers:</span>
              {effectiveSpent.map(val => (
                <span key={val}
                  className="text-[10px] px-1.5 py-0.5 rounded bg-gray-800 text-gray-500 line-through">
                  {val}
                </span>
              ))}
            </div>
          )}

          {/* ── Spin controls ── */}
          <div className="flex items-center gap-4 flex-wrap">
            <button
              onClick={handleSpin}
              disabled={spinsLeft <= 0}
              className={`px-6 py-2 rounded-lg font-bold text-white transition-all ${
                spinsLeft > 0
                  ? "bg-green-600 hover:bg-green-500"
                  : "bg-gray-600 opacity-50 cursor-not-allowed"
              }`}
            >
              Spin
            </button>
            <span className="text-sm text-gray-300">Spins Left: {spinsLeft}</span>
          </div>

          {/* ── Legend ── */}
          <div className="text-[10px] text-gray-600 flex gap-3 flex-wrap">
            <span>🟡 Gold → click → 🔴 Red → click → 🟡</span>
            <span>⚡E = set typeEReelPosition</span>
            <span>Max {MAX_RED_COINS} red coins total</span>
          </div>

        </div>
      )}
    </div>
  );
}