// /* eslint-disable @typescript-eslint/no-explicit-any */
// "use client";

// import { useState, useEffect, useRef } from "react";
// import {
//   TowerCell, ROWS_TOTAL, COLS, ROWS_LOCKED, ROWS_INIT,
//   MAX_BLUE, COIN_VALUES,
//   emptyGrid, seedFromBase, generateTowerGaffe,
//   firstUnlockedRow, unlockHint, countCoins, countBlue, posIdx,
// } from "./towerFeatureGenerator";

// // ─── Props ────────────────────────────────────────────────────────────────────
// type Props = {
//   baseCoins: { position: number; value: string }[];
//   onSpin:    (line: string) => void;
//   onReset:   () => void;
// };

// const MAX_SPINS = 3;

// // Row labels on the left side (locked rows show X + offset, unlocked show ✓)
// // The offsets from the image: -47,-41,-35,-29,-23,-17,-11,-5 for 8 locked rows
// const LOCKED_ROW_LABELS = [-47, -41, -35, -29, -23, -17, -11, -5];

// // ─── Component ────────────────────────────────────────────────────────────────
// export default function TowerFeature({ baseCoins, onSpin, onReset }: Props) {
//   const [isOpen,    setIsOpen]    = useState(true);
//   const [grid,      setGrid]      = useState<TowerCell[][]>(() => seedFromBase(baseCoins));
//   const [spinsLeft, setSpinsLeft] = useState(MAX_SPINS);

//   const lastPositions = useRef<Set<string>>(new Set());

//   // Seed when baseCoins change
//   useEffect(() => {
//     const g = seedFromBase(baseCoins);
//     setGrid(g);
//     setSpinsLeft(MAX_SPINS);
//     const initPos = new Set<string>();
//     g.forEach((rowArr, r) =>
//       rowArr.forEach((cell, c) => { if (cell.type !== "EMPTY") initPos.add(`${r}-${c}`); })
//     );
//     lastPositions.current = initPos;
//   }, [JSON.stringify(baseCoins)]);

//   const total    = countCoins(grid);
//   const blueUsed = countBlue(grid);
//   const fUnlock  = firstUnlockedRow(total);
//   const hint     = unlockHint(total);

//   const isUnlocked = (r: number) => r >= fUnlock;

//   const applyGrid = (fn: (g: TowerCell[][]) => void) => {
//     setGrid(prev => {
//       const g = prev.map(row => [...row]);
//       fn(g);
//       return g;
//     });
//   };

//   const handleCellClick = (r: number, c: number) => {
//     if (!isUnlocked(r)) return;
//     if (grid[r][c].type !== "EMPTY") return;
//     applyGrid(g => { g[r][c] = { type: "GOLD", value: COIN_VALUES[0] }; });
//   };

//   const removeCell = (r: number, c: number) => {
//     applyGrid(g => { g[r][c] = { type: "EMPTY" }; });
//   };

//   const updateCell = (r: number, c: number, cell: TowerCell) => {
//     applyGrid(g => { g[r][c] = cell; });
//   };

//   const handleSpin = () => {
//     if (spinsLeft <= 0) return;

//     // Detect new coins since last spin
//     const currentPos = new Set<string>();
//     grid.forEach((rowArr, r) =>
//       rowArr.forEach((cell, c) => { if (cell.type !== "EMPTY") currentPos.add(`${r}-${c}`); })
//     );
//     const hasNew = [...currentPos].some(p => !lastPositions.current.has(p));
//     lastPositions.current = currentPos;

//     setSpinsLeft(hasNew ? MAX_SPINS : spinsLeft - 1);
//     onSpin(generateTowerGaffe(grid));
//   };

//   const handleReset = () => {
//     const g = seedFromBase(baseCoins);
//     setGrid(g);
//     setSpinsLeft(MAX_SPINS);
//     const initPos = new Set<string>();
//     g.forEach((rowArr, r) =>
//       rowArr.forEach((cell, c) => { if (cell.type !== "EMPTY") initPos.add(`${r}-${c}`); })
//     );
//     lastPositions.current = initPos;
//     onReset();
//   };

//   // ─── Render ─────────────────────────────────────────────────────────────────
//   return (
//     <div className="rounded-2xl overflow-hidden" style={{ background: "#1e2235" }}>

//       {/* Header */}
//       <div
//         className="flex justify-between items-center px-5 py-4 cursor-pointer select-none"
//         onClick={() => setIsOpen(!isOpen)}
//       >
//         <h2 className="text-base font-bold text-blue-300">🔵 TOWER Feature</h2>
//         <span className="text-gray-400 text-sm">{isOpen ? "▼" : "▶"}</span>
//       </div>

//       {isOpen && (
//         <div className="px-4 pb-5 flex flex-col gap-4">

//           {/* Stats bar */}
//           <div className="flex items-center gap-3 flex-wrap">
//             <span
//               className="px-3 py-1.5 rounded-full text-xs font-semibold border"
//               style={{ background: "#1e3a8a", borderColor: "#3b82f6", color: "#93c5fd" }}
//             >
//               🔵 Blue used: {blueUsed}
//             </span>
//             <button
//               onClick={handleReset}
//               className="px-3 py-1 bg-gray-700 hover:bg-gray-600 rounded text-xs text-gray-300"
//             >
//               Reset
//             </button>
//           </div>

//           {/* Info row */}
//           <div className="flex items-center gap-4 flex-wrap text-sm">
//             <span className="flex items-center gap-1 text-blue-300">
//               🔵 Blue: {blueUsed} / {MAX_BLUE}
//             </span>
//             <span className="flex items-center gap-1 text-yellow-300">
//               🟡 Unlocked coins: {total}
//             </span>
//             {hint && (
//               <span className="text-yellow-400 font-medium">
//                 {hint.coinsToNext} more coins → unlock {hint.nextRowLabel}
//               </span>
//             )}
//             {!hint && (
//               <span className="text-green-400 text-xs">All rows unlocked!</span>
//             )}
//           </div>

//           {/* Grid */}
//           <div className="flex flex-col gap-[2px]">
//             {Array.from({ length: ROWS_TOTAL }, (_, r) => {
//               const locked     = !isUnlocked(r);
//               const isInitDiv  = r === ROWS_LOCKED; // divider before initial section
//               const lockedIdx  = r; // 0-based locked row index

//               return (
//                 <div key={r}>
//                   {/* Gold divider line between locked and initial sections */}
//                   {isInitDiv && (
//                     <div className="flex items-center gap-2 my-1">
//                       <div className="flex-1 h-px" style={{ background: "#ca8a04" }} />
//                       <span className="text-xs text-yellow-600 whitespace-nowrap">initial game (4×5) ↓</span>
//                       <div className="flex-1 h-px" style={{ background: "#ca8a04" }} />
//                     </div>
//                   )}

//                   <div className="flex items-center gap-1">
//                     {/* Row label on left */}
//                     <div className="w-10 shrink-0 text-right pr-1">
//                       {locked ? (
//                         <div className="flex flex-col items-end leading-none">
//                           <span className="text-red-500 font-bold text-xs">✕</span>
//                           <span className="text-red-600 text-[9px]">
//                             {LOCKED_ROW_LABELS[lockedIdx] ?? ""}
//                           </span>
//                         </div>
//                       ) : (
//                         <span className="text-green-500 text-sm font-bold">✓</span>
//                       )}
//                     </div>

//                     {/* 5 cells */}
//                     <div
//                       className="grid flex-1 gap-[2px]"
//                       style={{ gridTemplateColumns: `repeat(${COLS}, minmax(0,1fr))` }}
//                     >
//                       {Array.from({ length: COLS }, (_, c) => {
//                         const cell    = grid[r][c];
//                         const isEmpty = cell.type === "EMPTY";
//                         const flatPos = posIdx(r, c);

//                         let bg = "";
//                         if (locked)           bg = "bg-[#0d1117] border-gray-800";
//                         else if (isEmpty)     bg = "bg-[#1a2a4a] border-gray-700 hover:border-gray-500 cursor-pointer";
//                         else if (cell.type === "GOLD") bg = "bg-yellow-800 border-yellow-500";
//                         else if (cell.type === "BLUE") bg = "bg-blue-800 border-blue-400";

//                         const cellH = (cell.type !== "EMPTY") ? "min-h-[80px]" : "min-h-[44px]";

//                         return (
//                           <div
//                             key={c}
//                             onClick={() => !locked && isEmpty && handleCellClick(r, c)}
//                             className={`relative rounded border-2 flex flex-col items-center justify-center p-1 transition-all ${bg} ${cellH}`}
//                           >
//                             {/* Position label */}
//                             <span className="absolute top-0.5 left-1 text-[8px] text-gray-600 opacity-50">
//                               {flatPos}
//                             </span>

//                             {!locked && isEmpty && (
//                               <span className="text-gray-600 text-[10px]">+</span>
//                             )}

//                             {cell.type === "GOLD" && (
//                               <div className="flex flex-col items-center gap-1 w-full mt-1">
//                                 <span className="text-base">🟡</span>
//                                 <select
//                                   className="text-[10px] text-white rounded px-0.5 py-0.5 w-full border border-yellow-700 bg-yellow-900 outline-none"
//                                   value={cell.value}
//                                   onClick={e => e.stopPropagation()}
//                                   onChange={e => updateCell(r, c, { type: "GOLD", value: e.target.value })}
//                                 >
//                                   {COIN_VALUES.map(v => <option key={v} value={v} className="bg-gray-900">{v}</option>)}
//                                 </select>
//                                 {/* Switch to BLUE */}
//                                 <select
//                                   className="text-[10px] text-white rounded px-0.5 py-0.5 w-full border border-yellow-700 bg-yellow-900 outline-none"
//                                   value="GOLD"
//                                   onClick={e => e.stopPropagation()}
//                                   onChange={e => {
//                                     if (e.target.value === "BLUE" && blueUsed < MAX_BLUE)
//                                       updateCell(r, c, { type: "BLUE", value: cell.value });
//                                   }}
//                                 >
//                                   <option value="GOLD" className="bg-gray-900">GOLD</option>
//                                   {blueUsed < MAX_BLUE && <option value="BLUE" className="bg-gray-900">BLUE</option>}
//                                 </select>
//                                 <button
//                                   onClick={e => { e.stopPropagation(); removeCell(r, c); }}
//                                   className="absolute top-0.5 right-1 text-[10px] text-red-400 hover:text-red-200 font-bold"
//                                 >✕</button>
//                               </div>
//                             )}

//                             {cell.type === "BLUE" && (
//                               <div className="flex flex-col items-center gap-1 w-full mt-1">
//                                 <span className="text-base">🔵</span>
//                                 <select
//                                   className="text-[10px] text-white rounded px-0.5 py-0.5 w-full border border-blue-600 bg-blue-900 outline-none"
//                                   value={cell.value}
//                                   onClick={e => e.stopPropagation()}
//                                   onChange={e => updateCell(r, c, { type: "BLUE", value: e.target.value })}
//                                 >
//                                   {COIN_VALUES.map(v => <option key={v} value={v} className="bg-gray-900">{v}</option>)}
//                                 </select>
//                                 {/* Switch back to GOLD */}
//                                 <select
//                                   className="text-[10px] text-white rounded px-0.5 py-0.5 w-full border border-blue-600 bg-blue-900 outline-none"
//                                   value="BLUE"
//                                   onClick={e => e.stopPropagation()}
//                                   onChange={e => {
//                                     if (e.target.value === "GOLD")
//                                       updateCell(r, c, { type: "GOLD", value: cell.value });
//                                   }}
//                                 >
//                                   <option value="BLUE" className="bg-gray-900">BLUE</option>
//                                   <option value="GOLD" className="bg-gray-900">GOLD</option>
//                                 </select>
//                                 <button
//                                   onClick={e => { e.stopPropagation(); removeCell(r, c); }}
//                                   className="absolute top-0.5 right-1 text-[10px] text-red-400 hover:text-red-200 font-bold"
//                                 >✕</button>
//                               </div>
//                             )}
//                           </div>
//                         );
//                       })}
//                     </div>
//                   </div>
//                 </div>
//               );
//             })}
//           </div>

//           {/* Spin */}
//           <div className="flex items-center gap-4 flex-wrap mt-1">
//             <button
//               onClick={handleSpin}
//               disabled={spinsLeft <= 0}
//               className={`px-6 py-2 rounded-lg font-bold text-white transition-all ${
//                 spinsLeft > 0 ? "bg-green-600 hover:bg-green-500" : "bg-gray-600 opacity-50 cursor-not-allowed"
//               }`}
//             >
//               Spin
//             </button>
//             <span className="text-sm text-gray-300">Spins Left: {spinsLeft}</span>
//           </div>

//           <div className="text-xs text-gray-500 flex gap-3 flex-wrap">
//             <span>🔵 Blue (max {MAX_BLUE}) + 🟡 Gold in unlocked rows</span>
//             <span>Every {6} coins unlocks one more row upward</span>
//           </div>
//         </div>
//       )}
//     </div>
//   );
// }


//! working
/* eslint-disable @typescript-eslint/no-explicit-any */
// "use client";

// import { useState, useEffect, useRef } from "react";
// import {
//   TowerCell, ROWS_TOTAL, COLS, ROWS_LOCKED, ROWS_INIT,
//   MAX_BLUE, MAX_SPINS, COIN_VALUES,
//   emptyGrid, seedFromBase, generateTowerGaffe,
//   firstUnlockedRow, unlockHint, countUnlockedCoins, countBlue, posIdx,
// } from "./towerFeatureGenerator";

// // ─── Props ────────────────────────────────────────────────────────────────────
// type Props = {
//   baseCoins: { position: number; value: string }[];
//   onSpin:    (line: string) => void;
//   onReset:   () => void;
// };

// // Left-side labels for the 8 locked rows (from image)
// const LOCKED_LABELS = [-47, -41, -35, -29, -23, -17, -11, -5];

// // ─── Component ───────────────────────────────────────────────────────────────
// export default function TowerFeature({ baseCoins, onSpin, onReset }: Props) {
//   const [isOpen,    setIsOpen]    = useState(true);
//   const [grid,      setGrid]      = useState<TowerCell[][]>(() => seedFromBase(baseCoins));
//   const [spinsLeft, setSpinsLeft] = useState(MAX_SPINS);

//   /**
//    * Snapshot of UNLOCKED-ROW occupied positions at last spin.
//    * Locked-row coins do NOT reset spin count.
//    */
//   const lastUnlockedSnap = useRef<Set<string>>(new Set());

//   useEffect(() => {
//     const g = seedFromBase(baseCoins);
//     setGrid(g);
//     setSpinsLeft(MAX_SPINS);
//     // Initial snapshot: seeded coins are in rows 8-11 (unlocked)
//     const snap = new Set<string>();
//     g.forEach((row, r) => row.forEach((cell, c) => {
//       if (r >= ROWS_INIT && cell.type !== "EMPTY") snap.add(`${r},${c}`);
//     }));
//     lastUnlockedSnap.current = snap;
//   }, [JSON.stringify(baseCoins)]);

//   // ── Derived ──────────────────────────────────────────────────────────────
//   // For unlock progress we compute firstUnlockedRow dynamically
//   const curFirstUnlocked = firstUnlockedRow(countUnlockedCoins(grid, ROWS_INIT));
//   const hint             = unlockHint(countUnlockedCoins(grid, ROWS_INIT));
//   const blueUsed         = countBlue(grid);
//   const hasUpgrade       = grid.flat().some(c => c.type === "UPGRADE");

//   const isUnlocked = (r: number) => r >= curFirstUnlocked;

//   // ── Grid mutators ────────────────────────────────────────────────────────
//   const applyGrid = (fn: (g: TowerCell[][]) => void) => {
//     setGrid(prev => { const g = prev.map(row => [...row]); fn(g); return g; });
//   };

//   /**
//    * Click cycle:
//    *   Unlocked row: EMPTY → GOLD → BLUE → UPGRADE → GOLD (cycle)
//    *   Locked row:   EMPTY → GOLD (only)
//    */
//   const handleCellClick = (r: number, c: number) => {
//     applyGrid(g => {
//       const cell = g[r][c];
//       const locked = !isUnlocked(r);

//       if (cell.type === "EMPTY") {
//         g[r][c] = { type: "GOLD", value: COIN_VALUES[0] };
//       } else if (cell.type === "GOLD") {
//         if (locked) {
//           // locked rows stay GOLD — user can only remove via ✕
//         } else if (blueUsed < MAX_BLUE) {
//           g[r][c] = { type: "BLUE", value: cell.value };
//         }
//         // if blue is maxed, stay GOLD
//       } else if (cell.type === "BLUE") {
//         if (!hasUpgrade) {
//           g[r][c] = { type: "UPGRADE", featureColor: "red" };
//         } else {
//           // already have an upgrade, cycle back to GOLD
//           g[r][c] = { type: "GOLD", value: cell.value };
//         }
//       } else if (cell.type === "UPGRADE") {
//         // cycle back to GOLD
//         g[r][c] = { type: "GOLD", value: "1" };
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
//       if (cell.type === "BLUE") g[r][c] = { type: "BLUE", value };
//     });
//   };

//   const updateUpgradeColor = (r: number, c: number, color: "red" | "purple") => {
//     applyGrid(g => {
//       if (g[r][c].type === "UPGRADE") g[r][c] = { type: "UPGRADE", featureColor: color };
//     });
//   };

//   // ── Spin ─────────────────────────────────────────────────────────────────
//   const handleSpin = () => {
//     if (spinsLeft <= 0) return;

//     // Only unlocked-row new coins reset the spin count
//     const currentSnap = new Set<string>();
//     grid.forEach((row, r) => row.forEach((cell, c) => {
//       if (isUnlocked(r) && cell.type !== "EMPTY") currentSnap.add(`${r},${c}`);
//     }));
//     const hasNew = [...currentSnap].some(k => !lastUnlockedSnap.current.has(k));
//     lastUnlockedSnap.current = currentSnap;

//     setSpinsLeft(hasNew ? MAX_SPINS : spinsLeft - 1);
//     onSpin(generateTowerGaffe(grid));
//   };

//   const handleReset = () => {
//     const g = seedFromBase(baseCoins);
//     setGrid(g);
//     setSpinsLeft(MAX_SPINS);
//     const snap = new Set<string>();
//     g.forEach((row, r) => row.forEach((cell, c) => {
//       if (r >= ROWS_INIT && cell.type !== "EMPTY") snap.add(`${r},${c}`);
//     }));
//     lastUnlockedSnap.current = snap;
//     onReset();
//   };

//   // ── Cell border ──────────────────────────────────────────────────────────
//   function cellBorder(cell: TowerCell, locked: boolean): string {
//     if (locked && cell.type === "EMPTY") return "border-gray-800";
//     if (cell.type === "BLUE")    return "border-blue-500";
//     if (cell.type === "UPGRADE") return "border-indigo-400";
//     if (cell.type === "GOLD")    return "border-gray-600";
//     return locked ? "border-gray-800" : "border-gray-700 hover:border-gray-500";
//   }

//   // ─── Render ───────────────────────────────────────────────────────────────
//   return (
//     <div className="rounded-2xl overflow-hidden" style={{ background: "#1e2235" }}>
//       {/* Header */}
//       <div
//         className="flex justify-between items-center px-5 py-4 cursor-pointer select-none"
//         onClick={() => setIsOpen(!isOpen)}
//       >
//         <h2 className="text-base font-bold text-blue-300">🔵 TOWER Feature</h2>
//         <span className="text-gray-400 text-sm">{isOpen ? "▼" : "▶"}</span>
//       </div>

//       {isOpen && (
//         <div className="px-4 pb-5 flex flex-col gap-3">

//           {/* Stats bar */}
//           <div className="flex items-center gap-3 flex-wrap">
//             <span className="px-3 py-1.5 rounded-full text-xs font-semibold border"
//               style={{ background: "#1e3a8a", borderColor: "#3b82f6", color: "#93c5fd" }}>
//               🔵 Blue used: {blueUsed} / {MAX_BLUE}
//             </span>
//             <button onClick={handleReset}
//               className="px-3 py-1 bg-gray-700 hover:bg-gray-600 rounded text-xs text-gray-300">
//               Reset
//             </button>
//           </div>

//           {/* Info row */}
//           <div className="flex items-center gap-4 flex-wrap text-xs">
//             {hint ? (
//               <span className="text-yellow-400">
//                 {hint.coinsToNext} more coins in unlocked rows → unlock {hint.label}
//               </span>
//             ) : (
//               <span className="text-green-400">All rows unlocked!</span>
//             )}
//           </div>

//           {/* Grid */}
//           <div className="flex flex-col gap-[2px]">
//             {Array.from({ length: ROWS_TOTAL }, (_, r) => {
//               const locked    = !isUnlocked(r);
//               const isInitDiv = r === ROWS_LOCKED; // gold divider line

//               return (
//                 <div key={r}>
//                   {/* Divider before the initial 4×5 section */}
//                   {isInitDiv && (
//                     <div className="flex items-center gap-2 my-1">
//                       <div className="flex-1 h-px" style={{ background: "#ca8a04" }} />
//                       <span className="text-[10px] text-yellow-600 whitespace-nowrap">initial game (4×5) ↓</span>
//                       <div className="flex-1 h-px" style={{ background: "#ca8a04" }} />
//                     </div>
//                   )}

//                   <div className="flex items-center gap-1">
//                     {/* Row label */}
//                     <div className="w-10 shrink-0 text-right pr-1.5">
//                       {locked ? (
//                         <div className="flex flex-col items-end leading-tight">
//                           <span className="text-red-500 font-bold text-[11px]">✕</span>
//                           <span className="text-red-700 text-[9px]">{LOCKED_LABELS[r] ?? ""}</span>
//                         </div>
//                       ) : (
//                         <span className="text-green-500 text-sm font-bold">✓</span>
//                       )}
//                     </div>

//                     {/* 5 cells */}
//                     <div className="grid flex-1 gap-[2px]"
//                       style={{ gridTemplateColumns: `repeat(${COLS}, minmax(0,1fr))` }}>
//                       {Array.from({ length: COLS }, (_, c) => {
//                         const cell    = grid[r][c];
//                         const isEmpty = cell.type === "EMPTY";
//                         const border  = cellBorder(cell, locked);
//                         const bg      = locked && isEmpty ? "bg-[#0d1117]" : "bg-[#1a2035]";
//                         const cellH   = cell.type !== "EMPTY" ? "min-h-[80px]" : "min-h-[38px]";
//                         const cursor  = locked && isEmpty ? "cursor-default" : "cursor-pointer";

//                         return (
//                           <div
//                             key={c}
//                             onClick={() => (!locked || !isEmpty) && handleCellClick(r, c)}
//                             className={`relative rounded border-2 flex flex-col items-center justify-center p-1 transition-all ${bg} ${border} ${cellH} ${cursor}`}
//                           >
//                             {/* Position label */}
//                             <span className="absolute top-0.5 left-1 text-[8px] text-gray-600 opacity-40 select-none">
//                               {posIdx(r, c)}
//                             </span>

//                             {/* EMPTY unlocked */}
//                             {isEmpty && !locked && (
//                               <div className="flex flex-col items-center gap-0.5 pointer-events-none">
//                                 <span className="text-gray-600 text-[9px]">+ Gold</span>
//                                 {blueUsed < MAX_BLUE && <span className="text-blue-800 text-[8px]">→ Blue</span>}
//                               </div>
//                             )}

//                             {/* EMPTY locked (clicking adds GOLD) */}
//                             {isEmpty && locked && (
//                               <span className="text-gray-700 text-[9px] cursor-pointer hover:text-gray-500"
//                                 onClick={() => handleCellClick(r, c)}>+</span>
//                             )}

//                             {/* GOLD — no special bg */}
//                             {cell.type === "GOLD" && (
//                               <div className="flex flex-col items-center gap-1 w-full mt-1">
//                                 <span className="text-sm leading-none">🟡</span>
//                                 <select
//                                   className="text-[10px] text-white rounded px-0.5 py-0.5 w-full bg-gray-800 border border-gray-600 outline-none"
//                                   value={cell.value}
//                                   onClick={e => e.stopPropagation()}
//                                   onChange={e => updateValue(r, c, e.target.value)}
//                                 >
//                                   {COIN_VALUES.map(v => <option key={v} value={v} className="bg-gray-900">{v}</option>)}
//                                 </select>
//                                 {!locked && blueUsed < MAX_BLUE &&
//                                   <span className="text-[8px] text-gray-600 italic pointer-events-none">click → blue</span>}
//                               </div>
//                             )}

//                             {/* BLUE */}
//                             {cell.type === "BLUE" && (
//                               <div className="flex flex-col items-center gap-1 w-full mt-1">
//                                 <span className="text-sm leading-none">🔵</span>
//                                 <select
//                                   className="text-[10px] text-white rounded px-0.5 py-0.5 w-full bg-blue-950 border border-blue-700 outline-none"
//                                   value={cell.value}
//                                   onClick={e => e.stopPropagation()}
//                                   onChange={e => updateValue(r, c, e.target.value)}
//                                 >
//                                   {COIN_VALUES.map(v => <option key={v} value={v} className="bg-gray-900">{v}</option>)}
//                                 </select>
//                                 {!hasUpgrade &&
//                                   <span className="text-[8px] text-gray-600 italic pointer-events-none">click → upgrade</span>}
//                               </div>
//                             )}

//                             {/* UPGRADE */}
//                             {cell.type === "UPGRADE" && (
//                               <div className="flex flex-col items-center gap-1 w-full mt-1">
//                                 <span className="text-sm leading-none">⬆️</span>
//                                 <select
//                                   className="text-[10px] text-white rounded px-0.5 py-0.5 w-full bg-indigo-950 border border-indigo-600 outline-none"
//                                   value={cell.featureColor}
//                                   onClick={e => e.stopPropagation()}
//                                   onChange={e => updateUpgradeColor(r, c, e.target.value as any)}
//                                 >
//                                   <option value="red"    className="bg-gray-900">→ WHEEL (red)</option>
//                                   <option value="purple" className="bg-gray-900">→ ZONE (purple)</option>
//                                 </select>
//                               </div>
//                             )}

//                             {/* Cross button on all occupied cells */}
//                             {!isEmpty && (
//                               <button
//                                 onClick={e => { e.stopPropagation(); handleRemove(r, c); }}
//                                 className="absolute top-0.5 right-1 text-[10px] text-red-400 hover:text-red-200 font-bold leading-none"
//                               >✕</button>
//                             )}
//                           </div>
//                         );
//                       })}
//                     </div>
//                   </div>
//                 </div>
//               );
//             })}
//           </div>

//           {/* Spin */}
//           <div className="flex items-center gap-4 flex-wrap mt-1">
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
//             <span>🟡 Gold → 🔵 Blue (max {MAX_BLUE}) → ⬆️ Upgrade (max 1)</span>
//             <span>Locked rows: Gold only, won't reset spin count</span>
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
//   TowerCell, ROWS_TOTAL, COLS, ROWS_LOCKED, ROWS_INIT,
//   MAX_BLUE, MAX_SPINS, COIN_VALUES,
//   emptyGrid, seedFromBase, generateTowerGaffe,
//   firstUnlockedRow, unlockHint, countUnlockedCoins, countBlue,
// } from "./towerFeatureGenerator";

// type Props = {
//   baseCoins: { position: number; value: string }[];
//   onSpin:    (line: string) => void;
//   onReset:   () => void;
// };

// // Left-side labels for the 8 locked rows 
// // threshold values to min coins to unlock tower
// const LOCKED_LABELS = [-47, -41, -35, -29, -23, -17, -11, -5];

// export default function TowerFeature({ baseCoins, onSpin, onReset }: Props) {
//   const [isOpen,    setIsOpen]    = useState(true);
//   const [grid,      setGrid]      = useState<TowerCell[][]>(() => seedFromBase(baseCoins));
//   const [spinsLeft, setSpinsLeft] = useState(MAX_SPINS);

//   /**
//    * Snapshot of UNLOCKED-ROW occupied positions at last spin.
//    * Locked-row coins do NOT reset the spin counter.
//    */
//   const lastUnlockedSnap = useRef<Set<string>>(new Set());

//   useEffect(() => {
//     const g = seedFromBase(baseCoins);
//     setGrid(g);
//     setSpinsLeft(MAX_SPINS);
//     const snap = new Set<string>();
//     // Seeded coins land in rows 8-11 (unlocked)
//     g.forEach((row, r) => row.forEach((cell, c) => {
//       if (r >= ROWS_LOCKED && cell.type !== "EMPTY") snap.add(`${r},${c}`);
//     }));
//     lastUnlockedSnap.current = snap;
//   }, [JSON.stringify(baseCoins)]);

//   // ── Derived ──────────────────────────────────────────────────────────────
//   const fUnlock  = firstUnlockedRow(countUnlockedCoins(grid, ROWS_LOCKED));
//   const hint     = unlockHint(countUnlockedCoins(grid, ROWS_LOCKED));
//   const blueUsed = countBlue(grid);
//   const hasUpgrade = grid.flat().some(c => c.type === "UPGRADE");

//   const isUnlocked = (r: number) => r >= fUnlock;

//   // ── Grid helpers ─────────────────────────────────────────────────────────
//   const applyGrid = (fn: (g: TowerCell[][]) => void) => {
//     setGrid(prev => { const g = prev.map(row => [...row]); fn(g); return g; });
//   };

//   /**
//    * Click cycle (same for ALL rows — locked and unlocked):
//    *   EMPTY → GOLD → BLUE (if < max) → UPGRADE (if none yet) → back to GOLD
//    *
//    * Locked-row coins appear in the result but do NOT reset spin count.
//    */
//   const handleCellClick = (r: number, c: number) => {
//     applyGrid(g => {
//       const cell = g[r][c];

//       if (cell.type === "EMPTY") {
//         g[r][c] = { type: "GOLD", value: COIN_VALUES[0] };

//       } else if (cell.type === "GOLD") {
//         if (blueUsed < MAX_BLUE) {
//           g[r][c] = { type: "BLUE", value: cell.value };
//         }
//         // If blue maxed, click does nothing (user can still ✕ to remove)

//       } else if (cell.type === "BLUE") {
//         if (!hasUpgrade) {
//           g[r][c] = { type: "UPGRADE", featureColor: "red" };
//         } else {
//           // Already have an upgrade — cycle back to GOLD
//           g[r][c] = { type: "GOLD", value: cell.value };
//         }

//       } else if (cell.type === "UPGRADE") {
//         g[r][c] = { type: "GOLD", value: "1" };
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
//       if (cell.type === "BLUE") g[r][c] = { type: "BLUE", value };
//     });
//   };

//   const updateUpgradeColor = (r: number, c: number, color: "red" | "purple") => {
//     applyGrid(g => {
//       if (g[r][c].type === "UPGRADE") g[r][c] = { type: "UPGRADE", featureColor: color };
//     });
//   };

//   // ── Spin ─────────────────────────────────────────────────────────────────
//   const handleSpin = () => {
//     if (spinsLeft <= 0) return;

//     // Only new coins in UNLOCKED rows reset the spin count
//     const currentSnap = new Set<string>();
//     grid.forEach((row, r) => row.forEach((cell, c) => {
//       if (isUnlocked(r) && cell.type !== "EMPTY") currentSnap.add(`${r},${c}`);
//     }));
//     const hasNew = [...currentSnap].some(k => !lastUnlockedSnap.current.has(k));
//     lastUnlockedSnap.current = currentSnap;

//     setSpinsLeft(hasNew ? MAX_SPINS : spinsLeft - 1);
//     onSpin(generateTowerGaffe(grid));
//   };

//   const handleReset = () => {
//     const g = seedFromBase(baseCoins);
//     setGrid(g);
//     setSpinsLeft(MAX_SPINS);
//     const snap = new Set<string>();
//     g.forEach((row, r) => row.forEach((cell, c) => {
//       if (r >= ROWS_LOCKED && cell.type !== "EMPTY") snap.add(`${r},${c}`);
//     }));
//     lastUnlockedSnap.current = snap;
//     onReset();
//   };

//   // ── Cell border colour ───────────────────────────────────────────────────
//   function cellBorder(cell: TowerCell): string {
//     if (cell.type === "BLUE")    return "border-blue-500";
//     if (cell.type === "UPGRADE") return "border-indigo-400";
//     if (cell.type === "GOLD")    return "border-gray-600";
//     return "border-gray-700 hover:border-gray-500";
//   }

//   // ── Hint for next click ───────────────────────────────────────────────────
//   function clickHint(cell: TowerCell): string | null {
//     if (cell.type === "GOLD"    && blueUsed < MAX_BLUE) return "click → blue";
//     if (cell.type === "BLUE"    && !hasUpgrade)          return "click → upgrade";
//     if (cell.type === "UPGRADE")                         return "click → gold";
//     return null;
//   }

//   // ─── Render ───────────────────────────────────────────────────────────────
//   return (
//     <div className="rounded-2xl overflow-hidden" style={{ background: "#1e2235" }}>

//       {/* Header */}
//       <div
//         className="flex justify-between items-center px-5 py-4 cursor-pointer select-none"
//         onClick={() => setIsOpen(!isOpen)}
//       >
//         <h2 className="text-base font-bold text-blue-300">🔵 TOWER Feature</h2>
//         <span className="text-gray-400 text-sm">{isOpen ? "▼" : "▶"}</span>
//       </div>

//       {isOpen && (
//         <div className="px-4 pb-5 flex flex-col gap-3">

//           {/* Stats */}
//           <div className="flex items-center gap-3 flex-wrap">
//             <span className="px-3 py-1.5 rounded-full text-xs font-semibold border"
//               style={{ background: "#1e3a8a", borderColor: "#3b82f6", color: "#93c5fd" }}>
//               🔵 Blue used: {blueUsed} / {MAX_BLUE}
//             </span>
//             <button onClick={handleReset}
//               className="px-3 py-1 bg-gray-700 hover:bg-gray-600 rounded text-xs text-gray-300">
//               Reset
//             </button>
//           </div>

//           {/* Unlock hint */}
//           <div className="text-xs flex gap-3">
//             {hint ? (
//               <span className="text-yellow-400">
//                 {hint.coinsToNext} more coins in unlocked rows → unlock {hint.label}
//               </span>
//             ) : (
//               <span className="text-green-400">All rows unlocked!</span>
//             )}
//           </div>

//           {/* 12-row grid with row labels */}
//           <div className="flex flex-col gap-[2px]">
//             {Array.from({ length: ROWS_TOTAL }, (_, r) => {
//               const locked    = !isUnlocked(r);
//               const isInitDiv = r === ROWS_LOCKED;

//               return (
//                 <div key={r}>
//                   {/* Gold divider before initial 4×5 section */}
//                   {isInitDiv && (
//                     <div className="flex items-center gap-2 my-1">
//                       <div className="flex-1 h-px" style={{ background: "#ca8a04" }} />
//                       <span className="text-[10px] text-yellow-600 whitespace-nowrap">
//                         initial game (4×5) ↓
//                       </span>
//                       <div className="flex-1 h-px" style={{ background: "#ca8a04" }} />
//                     </div>
//                   )}

//                   <div className="flex items-center gap-1">
//                     {/* Row label */}
//                     <div className="w-10 shrink-0 text-right pr-1.5">
//                       {locked ? (
//                         <div className="flex flex-col items-end leading-tight">
//                           <span className="text-red-500 font-bold text-[11px]">✕</span>
//                           <span className="text-red-700 text-[9px]">{LOCKED_LABELS[r] ?? ""}</span>
//                         </div>
//                       ) : (
//                         <span className="text-green-500 text-sm font-bold">✓</span>
//                       )}
//                     </div>

//                     {/* 5 cells */}
//                     <div className="grid flex-1 gap-[2px]"
//                       style={{ gridTemplateColumns: `repeat(${COLS}, minmax(0,1fr))` }}>
//                       {Array.from({ length: COLS }, (_, c) => {
//                         const cell    = grid[r][c];
//                         const isEmpty = cell.type === "EMPTY";
//                         // Locked empty cells have darker bg; unlocked empty slightly lighter
//                         const bgBase  = locked && isEmpty ? "bg-[#0d1117]" : "bg-[#1a2035]";
//                         const border  = cellBorder(cell);
//                         const cellH   = isEmpty
//                           ? (locked ? "min-h-[32px]" : "min-h-[38px]")
//                           : "min-h-[80px]";
//                         const hint_   = !isEmpty ? clickHint(cell) : null;

//                         return (
//                           <div
//                             key={c}
//                             onClick={() => handleCellClick(r, c)}
//                             className={`relative rounded border-2 flex flex-col items-center justify-center p-1 transition-all cursor-pointer
//                               ${bgBase} ${border} ${cellH}`}
//                           >
//                             {/* Flat position label */}
//                             <span className="absolute top-0.5 left-1 text-[8px] text-gray-600 opacity-40 select-none">
//                               {c * ROWS_TOTAL + r}
//                             </span>

//                             {/* EMPTY */}
//                             {isEmpty && (
//                               <span className="text-gray-600 text-[9px] pointer-events-none">+</span>
//                             )}

//                             {/* GOLD — no special bg */}
//                             {cell.type === "GOLD" && (
//                               <div className="flex flex-col items-center gap-1 w-full mt-1">
//                                 <span className="text-sm leading-none">🟡</span>
//                                 <select
//                                   className="text-[10px] text-white rounded px-0.5 py-0.5 w-full bg-gray-800 border border-gray-600 outline-none"
//                                   value={cell.value}
//                                   onClick={e => e.stopPropagation()}
//                                   onChange={e => updateValue(r, c, e.target.value)}
//                                 >
//                                   {COIN_VALUES.map(v =>
//                                     <option key={v} value={v} className="bg-gray-900">{v}</option>
//                                   )}
//                                 </select>
//                                 {hint_ && <span className="text-[8px] text-gray-600 italic pointer-events-none">{hint_}</span>}
//                                 {locked && <span className="text-[8px] text-red-800 italic pointer-events-none">locked row</span>}
//                               </div>
//                             )}

//                             {/* BLUE */}
//                             {cell.type === "BLUE" && (
//                               <div className="flex flex-col items-center gap-1 w-full mt-1">
//                                 <span className="text-sm leading-none">🔵</span>
//                                 <select
//                                   className="text-[10px] text-white rounded px-0.5 py-0.5 w-full bg-blue-950 border border-blue-700 outline-none"
//                                   value={cell.value}
//                                   onClick={e => e.stopPropagation()}
//                                   onChange={e => updateValue(r, c, e.target.value)}
//                                 >
//                                   {COIN_VALUES.map(v =>
//                                     <option key={v} value={v} className="bg-gray-900">{v}</option>
//                                   )}
//                                 </select>
//                                 {hint_ && <span className="text-[8px] text-gray-600 italic pointer-events-none">{hint_}</span>}
//                                 {locked && <span className="text-[8px] text-red-800 italic pointer-events-none">locked row</span>}
//                               </div>
//                             )}

//                             {/* UPGRADE */}
//                             {cell.type === "UPGRADE" && (
//                               <div className="flex flex-col items-center gap-1 w-full mt-1">
//                                 <span className="text-sm leading-none">⬆️</span>
//                                 <select
//                                   className="text-[10px] text-white rounded px-0.5 py-0.5 w-full bg-indigo-950 border border-indigo-600 outline-none"
//                                   value={cell.featureColor}
//                                   onClick={e => e.stopPropagation()}
//                                   onChange={e => updateUpgradeColor(r, c, e.target.value as any)}
//                                 >
//                                   <option value="red"    className="bg-gray-900">→ WHEEL (red)</option>
//                                   <option value="purple" className="bg-gray-900">→ ZONE (purple)</option>
//                                 </select>
//                                 {hint_ && <span className="text-[8px] text-gray-600 italic pointer-events-none">{hint_}</span>}
//                               </div>
//                             )}

//                             {/* ✕ remove — all occupied cells */}
//                             {!isEmpty && (
//                               <button
//                                 onClick={e => { e.stopPropagation(); handleRemove(r, c); }}
//                                 className="absolute top-0.5 right-1 text-[10px] text-red-400 hover:text-red-200 font-bold leading-none"
//                               >✕</button>
//                             )}
//                           </div>
//                         );
//                       })}
//                     </div>
//                   </div>
//                 </div>
//               );
//             })}
//           </div>

//           {/* Spin */}
//           <div className="flex items-center gap-4 flex-wrap mt-1">
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
//             <span>🟡 Gold → 🔵 Blue (max {MAX_BLUE}) → ⬆️ Upgrade (max 1)</span>
//             <span className="text-red-800">Locked rows: all coin types allowed, won't reset spin count</span>
//           </div>
//         </div>
//       )}
//     </div>
//   );
// }



/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { useState, useEffect, useRef } from "react";
import {
  TowerCell, ROWS_TOTAL, COLS, ROWS_LOCKED,
  MAX_BLUE, MAX_SPINS, COIN_VALUES, BLUE_COIN_SEQUENCE,
  emptyGrid, seedFromBase, generateTowerGaffe,
  firstUnlockedRow, unlockHint, countUnlockedCoins, countBlue,
  posIdx, eReelOptions, ALL_POSITIONS, UNLOCKED_POSITIONS, EReelSetting,
} from "./towerFeatureGenerator";

type Props = {
  baseCoins: { position: number; value: string }[];
  onSpin:    (line: string) => void;
  onReset:   () => void;
};

// Left-side labels for the 8 locked rows
const LOCKED_LABELS = [-47, -41, -35, -29, -23, -17, -11, -5];

export default function TowerFeature({ baseCoins, onSpin, onReset }: Props) {
  const [isOpen,      setIsOpen]      = useState(true);
  const [grid,        setGrid]        = useState<TowerCell[][]>(() => seedFromBase(baseCoins));
  const [spinsLeft,   setSpinsLeft]   = useState(MAX_SPINS);
  const [eReelPos,    setEReelPos]    = useState<EReelSetting | null>(null);
  const [blueCoinIdx, setBlueCoinIdx] = useState(0);   // next index into BLUE_COIN_SEQUENCE

  /**
   * Snapshot of all occupied flat positions at the last spin.
   * Only NEW unlocked-row coins reset the spin counter.
   */
  const lastSnapshot = useRef<Set<number>>(new Set());

  useEffect(() => {
    const g = seedFromBase(baseCoins);
    setGrid(g);
    setSpinsLeft(MAX_SPINS);
    setEReelPos(null);
    setBlueCoinIdx(0);
    const snap = new Set<number>();
    g.forEach((row, r) => row.forEach((cell, c) => {
      if (cell.type !== "EMPTY") snap.add(posIdx(r, c));
    }));
    lastSnapshot.current = snap;
  }, [JSON.stringify(baseCoins)]);

  // ── Derived ──────────────────────────────────────────────────────────────
  const fUnlock  = firstUnlockedRow(countUnlockedCoins(grid, ROWS_LOCKED));
  const hint     = unlockHint(countUnlockedCoins(grid, ROWS_LOCKED));
  const blueUsed = countBlue(grid);

  const isUnlocked = (r: number) => r >= fUnlock;

  // Blue coins can only land in locked rows; if all rows unlocked, blue is disabled
  const allUnlocked = fUnlock === 0;
  const canAddBlue  = blueUsed < MAX_BLUE && !allUnlocked;

  // ── Grid helpers ─────────────────────────────────────────────────────────
  const applyGrid = (fn: (g: TowerCell[][]) => void) => {
    setGrid(prev => { const g = prev.map(row => [...row]); fn(g); return g; });
  };

  /**
   * Click cycle:
   *   Unlocked row  → EMPTY → GOLD (gold only; no blue in unlocked rows)
   *   Locked row    → EMPTY → GOLD → BLUE (if slots remain) → GOLD …
   */
  const handleCellClick = (r: number, c: number) => {
    applyGrid(g => {
      const cell   = g[r][c];
      const locked = !isUnlocked(r);

      if (cell.type === "EMPTY") {
        g[r][c] = { type: "GOLD", value: COIN_VALUES[0] };
      } else if (cell.type === "GOLD") {
        if (locked && canAddBlue) {
          g[r][c] = { type: "BLUE", value: COIN_VALUES[0] };
        }
        // Unlocked row: click does nothing extra; use ✕ to remove
      } else if (cell.type === "BLUE") {
        // Cycle back to GOLD
        g[r][c] = { type: "GOLD", value: COIN_VALUES[0] };
      }
    });
  };

  const handleRemove = (r: number, c: number) => {
    applyGrid(g => { g[r][c] = { type: "EMPTY" }; });
    if (eReelPos?.pos === posIdx(r, c)) setEReelPos(null);
  };

  const updateValue = (r: number, c: number, value: string) => {
    applyGrid(g => {
      const cell = g[r][c];
      if (cell.type === "GOLD" || cell.type === "BLUE") g[r][c] = { ...cell, value };
    });
  };

  // ── typeEReelPosition (unlocked rows only) ───────────────────────────────
  const handleSetEReelPos = (r: number, c: number) => {
    const pos  = posIdx(r, c);
    const opts = eReelOptions(pos);
    setEReelPos({ pos, value: opts[0] });
  };

  // ── Spin ─────────────────────────────────────────────────────────────────
  const handleSpin = () => {
    if (spinsLeft <= 0) return;

    const prevSnap = new Set(lastSnapshot.current);

    // Full snapshot of all occupied positions
    const currentSnap = new Set<number>();
    grid.forEach((row, r) => row.forEach((cell, c) => {
      if (cell.type !== "EMPTY") currentSnap.add(posIdx(r, c));
    }));

    // Only new coins in UNLOCKED rows reset the counter
    const hasNewUnlocked = UNLOCKED_POSITIONS.some(pos =>
      currentSnap.has(pos) && !prevSnap.has(pos)
    );

    // Count new blue coins this spin to advance the sequence index
    let newBlueCount = 0;
    grid.forEach((row, r) => row.forEach((cell, c) => {
      const pos = posIdx(r, c);
      if (cell.type === "BLUE" && !prevSnap.has(pos)) newBlueCount++;
    }));

    lastSnapshot.current = currentSnap;
    setSpinsLeft(hasNewUnlocked ? MAX_SPINS : spinsLeft - 1);
    if (newBlueCount > 0) setBlueCoinIdx(prev => prev + newBlueCount);

    onSpin(generateTowerGaffe(grid, prevSnap, eReelPos, blueCoinIdx));
  };

  const handleReset = () => {
    const g = seedFromBase(baseCoins);
    setGrid(g);
    setSpinsLeft(MAX_SPINS);
    setEReelPos(null);
    setBlueCoinIdx(0);
    const snap = new Set<number>();
    g.forEach((row, r) => row.forEach((cell, c) => {
      if (cell.type !== "EMPTY") snap.add(posIdx(r, c));
    }));
    lastSnapshot.current = snap;
    onReset();
  };

  // ── Cell border colour ───────────────────────────────────────────────────
  function cellBorder(cell: TowerCell, locked: boolean): string {
    if (cell.type === "BLUE") return "border-blue-500";
    if (cell.type === "GOLD") return "border-yellow-700";
    return locked ? "border-gray-800" : "border-gray-700 hover:border-gray-500";
  }

  // ── Click hint text ───────────────────────────────────────────────────────
  function clickHint(cell: TowerCell, locked: boolean): string | null {
    if (cell.type === "GOLD" && locked && canAddBlue) return "click → blue";
    if (cell.type === "BLUE")                          return "click → gold";
    return null;
  }

  // ─── Render ───────────────────────────────────────────────────────────────
  return (
    <div className="rounded-2xl overflow-hidden" style={{ background: "#1e2235" }}>

      {/* Header */}
      <div
        className="flex justify-between items-center px-5 py-4 cursor-pointer select-none"
        onClick={() => setIsOpen(!isOpen)}
      >
        <h2 className="text-base font-bold text-blue-300">🔵 TOWER Feature</h2>
        <span className="text-gray-400 text-sm">{isOpen ? "▼" : "▶"}</span>
      </div>

      {isOpen && (
        <div className="px-4 pb-5 flex flex-col gap-3">

          {/* Stats */}
          <div className="flex items-center gap-3 flex-wrap">
            <span
              className="px-3 py-1.5 rounded-full text-xs font-semibold border"
              style={{ background: "#1e3a8a", borderColor: "#3b82f6", color: "#93c5fd" }}
            >
              🔵 Blue used: {blueUsed} / {MAX_BLUE}
            </span>
            {/* Next blue coin sequence value preview */}
            {blueUsed < MAX_BLUE && !allUnlocked && (
              <span className="text-xs text-blue-400 font-mono">
                next blue seq: {BLUE_COIN_SEQUENCE[blueCoinIdx] ?? BLUE_COIN_SEQUENCE[BLUE_COIN_SEQUENCE.length - 1]}
              </span>
            )}
            {allUnlocked && (
              <span className="text-xs text-gray-500 italic">
                (blue unavailable — all rows unlocked)
              </span>
            )}
            <button
              onClick={handleReset}
              className="px-3 py-1 bg-gray-700 hover:bg-gray-600 rounded text-xs text-gray-300"
            >
              Reset
            </button>
          </div>

          {/* Unlock hint */}
          <div className="text-xs flex gap-3">
            {hint ? (
              <span className="text-yellow-400">
                {hint.coinsToNext} more coins in unlocked rows → unlock {hint.label}
              </span>
            ) : (
              <span className="text-green-400">All rows unlocked!</span>
            )}
          </div>

          {/* typeEReelPosition panel */}
          {eReelPos && (
            <div
              className="flex items-center gap-2 px-3 py-2 rounded-lg text-xs"
              style={{ background: "#1a2a1a", border: "1px solid #4a7a4a" }}
            >
              <span className="text-yellow-400 font-semibold">⚡ typeEReelPosition:</span>
              <span className="text-gray-300 font-mono">[{eReelPos.pos},</span>
              <select
                className="bg-gray-800 border border-gray-600 text-gray-200 rounded px-1 py-0.5 text-xs outline-none"
                value={eReelPos.value}
                onChange={e => setEReelPos({ ...eReelPos, value: e.target.value })}
              >
                {eReelOptions(eReelPos.pos).map(v => (
                  <option key={v} value={v} className="bg-gray-900">{v}</option>
                ))}
              </select>
              <span className="text-gray-300 font-mono">]</span>
              <button
                onClick={() => setEReelPos(null)}
                className="ml-auto text-red-400 hover:text-red-200 font-bold"
              >✕</button>
            </div>
          )}

          {/* 12-row grid */}
          <div className="flex flex-col gap-[2px]">
            {Array.from({ length: ROWS_TOTAL }, (_, r) => {
              const locked    = !isUnlocked(r);
              const isInitDiv = r === ROWS_LOCKED;

              return (
                <div key={r}>
                  {/* Gold divider before initial 4×5 section */}
                  {isInitDiv && (
                    <div className="flex items-center gap-2 my-1">
                      <div className="flex-1 h-px" style={{ background: "#ca8a04" }} />
                      <span className="text-[10px] text-yellow-600 whitespace-nowrap">
                        initial game (4×5) ↓
                      </span>
                      <div className="flex-1 h-px" style={{ background: "#ca8a04" }} />
                    </div>
                  )}

                  <div className="flex items-center gap-1">
                    {/* Row label */}
                    <div className="w-10 shrink-0 text-right pr-1.5">
                      {locked ? (
                        <div className="flex flex-col items-end leading-tight">
                          <span className="text-red-500 font-bold text-[11px]">✕</span>
                          <span className="text-red-700 text-[9px]">{LOCKED_LABELS[r] ?? ""}</span>
                        </div>
                      ) : (
                        <span className="text-green-500 text-sm font-bold">✓</span>
                      )}
                    </div>

                    {/* 5 cells */}
                    <div
                      className="grid flex-1 gap-[2px]"
                      style={{ gridTemplateColumns: `repeat(${COLS}, minmax(0,1fr))` }}
                    >
                      {Array.from({ length: COLS }, (_, c) => {
                        const cell    = grid[r][c];
                        const isEmpty = cell.type === "EMPTY";
                        const pos     = posIdx(r, c);
                        const isEPos  = eReelPos?.pos === pos;
                        const border  = cellBorder(cell, locked);
                        const bgBase  = locked && isEmpty ? "bg-[#0d1117]" : "bg-[#1a2035]";
                        const cellH   = isEmpty
                          ? (locked ? "min-h-[32px]" : "min-h-[38px]")
                          : "min-h-[86px]";
                        const hint_   = !isEmpty ? clickHint(cell, locked) : null;

                        return (
                          <div
                            key={c}
                            onClick={() => handleCellClick(r, c)}
                            className={`relative rounded flex flex-col items-center justify-center p-1 transition-all cursor-pointer
                              border-2 ${bgBase} ${border} ${cellH}
                              ${isEPos ? "ring-2 ring-yellow-400" : ""}`}
                          >
                            {/* Flat position label */}
                            <span className="absolute top-0.5 left-1 text-[8px] text-gray-600 opacity-40 select-none">
                              {pos}
                            </span>

                            {/* EMPTY */}
                            {isEmpty && (
                              <span className="text-gray-600 text-[9px] pointer-events-none">+</span>
                            )}

                            {/* GOLD */}
                            {cell.type === "GOLD" && (
                              <div className="flex flex-col items-center gap-1 w-full mt-1">
                                <span className="text-sm leading-none">🟡</span>
                                <select
                                  className="text-[10px] text-white rounded px-0.5 py-0.5 w-full bg-gray-800 border border-gray-600 outline-none"
                                  value={cell.value}
                                  onClick={e => e.stopPropagation()}
                                  onChange={e => updateValue(r, c, e.target.value)}
                                >
                                  {COIN_VALUES.map(v =>
                                    <option key={v} value={v} className="bg-gray-900">{v}</option>
                                  )}
                                </select>
                                {hint_ && (
                                  <span className="text-[8px] text-gray-500 italic pointer-events-none">
                                    {hint_}
                                  </span>
                                )}
                                {/* ⚡E button for unlocked rows */}
                                {!locked && !isEPos && (
                                  <button
                                    onClick={e => { e.stopPropagation(); handleSetEReelPos(r, c); }}
                                    className="text-[9px] text-yellow-700 hover:text-yellow-400 font-bold pointer-events-auto"
                                    title={`Set pos ${pos} as typeEReelPosition`}
                                  >⚡E</button>
                                )}
                                {locked && (
                                  <span className="text-[8px] text-red-800 italic pointer-events-none">locked</span>
                                )}
                              </div>
                            )}

                            {/* BLUE */}
                            {cell.type === "BLUE" && (
                              <div className="flex flex-col items-center gap-1 w-full mt-1">
                                <span className="text-sm leading-none">🔵</span>
                                {/* Prize value selector */}
                                <select
                                  className="text-[10px] text-white rounded px-0.5 py-0.5 w-full bg-blue-950 border border-blue-700 outline-none"
                                  value={cell.value}
                                  onClick={e => e.stopPropagation()}
                                  onChange={e => updateValue(r, c, e.target.value)}
                                >
                                  {COIN_VALUES.map(v =>
                                    <option key={v} value={v} className="bg-gray-900">{v}</option>
                                  )}
                                </select>
                                {hint_ && (
                                  <span className="text-[8px] text-gray-500 italic pointer-events-none">
                                    {hint_}
                                  </span>
                                )}
                                <span className="text-[8px] text-red-800 italic pointer-events-none">locked</span>
                              </div>
                            )}

                            {/* ✕ remove */}
                            {!isEmpty && (
                              <button
                                onClick={e => { e.stopPropagation(); handleRemove(r, c); }}
                                className="absolute top-0.5 right-1 text-[10px] text-red-400 hover:text-red-200 font-bold leading-none"
                              >✕</button>
                            )}
                          </div>
                        );
                      })}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Spin */}
          <div className="flex items-center gap-4 flex-wrap mt-1">
            <button
              onClick={handleSpin}
              disabled={spinsLeft <= 0}
              className={`px-6 py-2 rounded-lg font-bold text-white transition-all ${
                spinsLeft > 0
                  ? "bg-green-600 hover:bg-green-500"
                  : "bg-gray-600 opacity-50 cursor-not-allowed"
              }`}
            >Spin</button>
            <span className="text-sm text-gray-300">Spins Left: {spinsLeft}</span>
          </div>

          <div className="text-xs text-gray-500 flex gap-3 flex-wrap">
            <span>🟡 Gold (all rows) → 🔵 Blue (locked rows only, max {MAX_BLUE})</span>
            <span>⚡E = set typeEReelPosition (unlocked gold cells)</span>
            <span className="text-red-900">New coins in UNLOCKED rows reset spin counter</span>
          </div>
        </div>
      )}
    </div>
  );
}