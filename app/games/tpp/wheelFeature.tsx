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



/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { useState, useEffect, useRef } from "react";
import {
  WheelCell, ROWS, COLS, MAX_SPINS, MAX_RED_COINS,
  COIN_VALUES, MULTI_VALUES,
  emptyGrid, seedFromBase, generateWheelGaffe,
} from "./wheelFeatureGenerator";

// ─── Props ────────────────────────────────────────────────────────────────────
type Props = {
  baseCoins:              { position: number; value: string }[];
  onSpin:                 (line: string) => void;
  onReset:                () => void;
  sharedUsedMultipliers?: Set<string>;
  onMultiplierUsed?:      (m: string) => void;
};

// ─── Component ───────────────────────────────────────────────────────────────
export default function WheelFeature({
  baseCoins, onSpin, onReset,
  sharedUsedMultipliers, onMultiplierUsed,
}: Props) {
  const [isOpen,    setIsOpen]    = useState(true);
  const [grid,      setGrid]      = useState<WheelCell[][]>(() => seedFromBase(baseCoins));
  const [spinsLeft, setSpinsLeft] = useState(MAX_SPINS);
  const [localUsed, setLocalUsed] = useState<Set<string>>(new Set());

  const lastSnapshot = useRef<Set<string>>(new Set());

  // Initial snapshot from seeded coins
  useEffect(() => {
    const g = seedFromBase(baseCoins);
    setGrid(g);
    setSpinsLeft(MAX_SPINS);
    setLocalUsed(new Set());
    const snap = new Set<string>();
    g.forEach((row, r) => row.forEach((cell, c) => { if (cell.type !== "EMPTY") snap.add(`${r},${c}`); }));
    lastSnapshot.current = snap;
  }, [JSON.stringify(baseCoins)]);

  const usedMults   = sharedUsedMultipliers ?? localUsed;
  const redCount    = grid.flat().filter(c => c.type === "RED").length;
  const hasUpgrade  = grid.flat().some(c => c.type === "UPGRADE");

  // ── Click cycle: EMPTY → GOLD → RED → GOLD → ... ───────────────────────
  const handleCellClick = (r: number, c: number) => {
    setGrid(prev => {
      const g    = prev.map(row => [...row]);
      const cell = g[r][c];

      if (cell.type === "EMPTY") {
        g[r][c] = { type: "GOLD", value: COIN_VALUES[0] };
      } else if (cell.type === "GOLD") {
        if (redCount < MAX_RED_COINS) {
          g[r][c] = { type: "RED", value: cell.value, multiplier: "" };
        }
        // if at max reds, stay GOLD (user can still remove via ✕)
      } else if (cell.type === "RED") {
        // cycle back to GOLD
        // free the multiplier
        if (cell.multiplier) {
          const next = new Set(localUsed);
          next.delete(cell.multiplier);
          setLocalUsed(next);
        }
        g[r][c] = { type: "GOLD", value: cell.value };
      }
      return g;
    });
  };

  const handleRemove = (r: number, c: number) => {
    setGrid(prev => {
      const g    = prev.map(row => [...row]);
      const cell = g[r][c];
      if (cell.type === "RED" && cell.multiplier) {
        const next = new Set(localUsed);
        next.delete(cell.multiplier);
        setLocalUsed(next);
      }
      g[r][c] = { type: "EMPTY" };
      return g;
    });
  };

  const updateGoldValue = (r: number, c: number, value: string) => {
    setGrid(prev => {
      const g = prev.map(row => [...row]);
      const cell = g[r][c];
      if (cell.type === "GOLD") g[r][c] = { type: "GOLD", value };
      if (cell.type === "RED")  g[r][c] = { ...cell, value };
      return g;
    });
  };

  const handleMultiplierSelect = (r: number, c: number, val: string) => {
    setGrid(prev => {
      const g    = prev.map(row => [...row]);
      const cell = g[r][c];
      if (cell.type !== "RED") return g;
      // Free old multiplier
      if (cell.multiplier) {
        const next = new Set(localUsed);
        next.delete(cell.multiplier);
        setLocalUsed(next);
      }
      // Mark new multiplier
      if (val) {
        setLocalUsed(prev2 => new Set([...prev2, val]));
        onMultiplierUsed?.(val);
      }
      g[r][c] = { ...cell, multiplier: val };
      return g;
    });
  };

  // ── Spin ─────────────────────────────────────────────────────────────────
  const handleSpin = () => {
    if (spinsLeft <= 0) return;

    const currentSnap = new Set<string>();
    grid.forEach((row, r) => row.forEach((cell, c) => {
      if (cell.type !== "EMPTY") currentSnap.add(`${r},${c}`);
    }));
    const hasNew = [...currentSnap].some(k => !lastSnapshot.current.has(k));
    lastSnapshot.current = currentSnap;

    setSpinsLeft(hasNew ? MAX_SPINS : spinsLeft - 1);
    onSpin(generateWheelGaffe(grid));
  };

  const handleReset = () => {
    const g = seedFromBase(baseCoins);
    setGrid(g);
    setSpinsLeft(MAX_SPINS);
    setLocalUsed(new Set());
    const snap = new Set<string>();
    g.forEach((row, r) => row.forEach((cell, c) => { if (cell.type !== "EMPTY") snap.add(`${r},${c}`); }));
    lastSnapshot.current = snap;
    onReset();
  };

  // ─── Render ───────────────────────────────────────────────────────────────
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

          {/* Stats */}
          <div className="flex items-center gap-3 flex-wrap">
            <span className="px-3 py-1 rounded-full text-xs font-semibold bg-red-950 text-red-300 border border-red-700">
              🔴 Red used: {redCount} / {MAX_RED_COINS}
            </span>
            <button onClick={handleReset}
              className="px-3 py-1 bg-gray-700 hover:bg-gray-600 rounded text-xs text-gray-300">
              Reset
            </button>
          </div>

          {/* Grid 4×5 */}
          <div className="grid gap-1" style={{ gridTemplateColumns: `repeat(${COLS}, minmax(0,1fr))` }}>
            {Array.from({ length: ROWS }, (_, r) =>
              Array.from({ length: COLS }, (_, c) => {
                const cell    = grid[r][c];
                const isEmpty = cell.type === "EMPTY";
                // No special bg for GOLD or RED — always default dark
                const border  = cell.type === "RED" ? "border-red-800"
                              : cell.type === "GOLD" ? "border-gray-600"
                              : "border-gray-700 hover:border-gray-500";

                return (
                  <div
                    key={`${r}-${c}`}
                    onClick={() => handleCellClick(r, c)}
                    className={`relative rounded-lg border-2 bg-[#1a2035] flex flex-col items-center justify-center p-1.5 transition-all cursor-pointer
                      ${border}
                      ${isEmpty ? "min-h-[60px]" : "min-h-[96px]"}
                    `}
                  >
                    {/* Flat index */}
                    <span className="absolute top-1 left-1.5 text-[9px] text-gray-600 opacity-50 select-none">
                      {c * ROWS + r}
                    </span>

                    {/* EMPTY */}
                    {isEmpty && (
                      <div className="flex flex-col items-center gap-0.5 pointer-events-none">
                        <span className="text-gray-600 text-[10px]">+ Gold</span>
                        <span className="text-red-800 text-[9px]">→ Red</span>
                      </div>
                    )}

                    {/* GOLD — no bg, just coin + value */}
                    {cell.type === "GOLD" && (
                      <div className="flex flex-col items-center gap-1 w-full mt-2">
                        <span className="text-base leading-none">🟡</span>
                        <select
                          className="text-[10px] text-white rounded px-0.5 py-0.5 w-full bg-gray-800 border border-gray-600 outline-none"
                          value={cell.value}
                          onClick={e => e.stopPropagation()}
                          onChange={e => updateGoldValue(r, c, e.target.value)}
                        >
                          {COIN_VALUES.map(v => <option key={v} value={v} className="bg-gray-900">{v}</option>)}
                        </select>
                        {redCount < MAX_RED_COINS &&
                          <span className="text-[9px] text-gray-600 italic pointer-events-none">click → red</span>}
                      </div>
                    )}

                    {/* RED — no bg, coin + value + multiplier */}
                    {cell.type === "RED" && (
                      <div className="flex flex-col items-center gap-1 w-full mt-2">
                        <span className="text-base leading-none">🔴</span>
                        {/* Value */}
                        <select
                          className="text-[10px] text-white rounded px-0.5 py-0.5 w-full bg-gray-800 border border-gray-600 outline-none"
                          value={cell.value}
                          onClick={e => e.stopPropagation()}
                          onChange={e => updateGoldValue(r, c, e.target.value)}
                        >
                          {COIN_VALUES.map(v => <option key={v} value={v} className="bg-gray-900">{v}</option>)}
                        </select>
                        {/* Multiplier */}
                        <select
                          className="text-[10px] text-white rounded px-0.5 py-0.5 w-full bg-gray-800 border border-red-700 outline-none"
                          value={cell.multiplier}
                          onClick={e => e.stopPropagation()}
                          onChange={e => handleMultiplierSelect(r, c, e.target.value)}
                        >
                          <option value="" className="bg-gray-900">─ Mult ─</option>
                          {MULTI_VALUES.map(m => {
                            const isUsedElsewhere = usedMults.has(m) && cell.multiplier !== m;
                            return (
                              <option key={m} value={m} disabled={isUsedElsewhere}
                                className={isUsedElsewhere ? "text-gray-600 bg-gray-900" : "bg-gray-900"}>
                                {isUsedElsewhere ? `${m} (used)` : m}
                              </option>
                            );
                          })}
                        </select>
                        <span className="text-[9px] text-gray-600 italic pointer-events-none">click → gold</span>
                      </div>
                    )}

                    {/* Cross — all occupied cells */}
                    {!isEmpty && (
                      <button
                        onClick={e => { e.stopPropagation(); handleRemove(r, c); }}
                        className="absolute top-1 right-1.5 text-[11px] text-red-400 hover:text-red-200 font-bold leading-none"
                      >✕</button>
                    )}
                  </div>
                );
              })
            )}
          </div>

          {/* Spin */}
          <div className="flex items-center gap-4 flex-wrap">
            <button
              onClick={handleSpin}
              disabled={spinsLeft <= 0}
              className={`px-6 py-2 rounded-lg font-bold text-white transition-all ${
                spinsLeft > 0 ? "bg-green-600 hover:bg-green-500" : "bg-gray-600 opacity-50 cursor-not-allowed"
              }`}
            >Spin</button>
            <span className="text-sm text-gray-300">Spins Left: {spinsLeft}</span>
          </div>

          <div className="text-xs text-gray-500 flex gap-3 flex-wrap">
            <span>🟡 Gold (value) → click → 🔴 Red (value + multiplier, max {MAX_RED_COINS})</span>
          </div>
        </div>
      )}
    </div>
  );
}