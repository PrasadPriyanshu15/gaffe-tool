// /* eslint-disable @typescript-eslint/no-explicit-any */
// "use client";

// import { useState, useEffect, useRef } from "react";
// import {
//   ZoneCell, Zone, ROWS, COLS, COIN_VALUES, MAX_SPINS,
//   emptyGrid, seedFromBase, generateZoneGaffe,
//   getSingleZoneCells, mergeAllTouchingZones, processZoneOnSpin, addZoneForAnchor,
// } from "./zoneFeatureGenerator";

// // ─── Props ────────────────────────────────────────────────────────────────────
// type Props = {
//   baseCoins: { position: number; value: string }[];
//   onSpin:    (line: string) => void;
//   onReset:   () => void;
// };

// // ─── Helper: which zone (if any) covers a cell ────────────────────────────────
// function zonesForCell(r: number, c: number, zones: Zone[]): Zone[] {
//   return zones.filter(z => z.cells.some(([zr, zc]) => zr === r && zc === c));
// }

// function isAnchor(r: number, c: number, zones: Zone[]): boolean {
//   return zones.some(z => z.anchors.some(([ar, ac]) => ar === r && ac === c));
// }

// // ─── Component ────────────────────────────────────────────────────────────────
// export default function ZoneFeature({ baseCoins, onSpin, onReset }: Props) {
//   const [isOpen,       setIsOpen]       = useState(true);
//   const [grid,         setGrid]         = useState<ZoneCell[][]>(() => seedFromBase(baseCoins));
//   const [zones,        setZones]        = useState<Zone[]>([]);
//   const [spinsLeft,    setSpinsLeft]    = useState(MAX_SPINS);
//   const [purpleCount,  setPurpleCount]  = useState(0);
//   const zoneCounter = useRef(0);

//   const nextId = () => `z${++zoneCounter.current}`;

//   // Seed on mount / baseCoins change
//   useEffect(() => {
//     const g = seedFromBase(baseCoins);
//     setGrid(g);
//     setSpinsLeft(MAX_SPINS);
//     zoneCounter.current = 0;

//     // Build initial zones from seeded purple coins
//     let initZones: Zone[] = [];
//     g.forEach((rowArr, r) =>
//       rowArr.forEach((cell, c) => {
//         if (cell.type === "PURPLE") {
//           initZones = addZoneForAnchor(initZones, r, c, () => `z${++zoneCounter.current}`);
//         }
//       })
//     );
//     setZones(initZones);
//     setPurpleCount(baseCoins.length);
//   }, [JSON.stringify(baseCoins)]);

//   // ── Cell interaction ────────────────────────────────────────────────────
//   const cellAt = (r: number, c: number): ZoneCell => grid[r][c];

//   const applyGrid = (updater: (g: ZoneCell[][]) => ZoneCell[][]) => {
//     setGrid(prev => updater(prev.map(row => [...row])));
//   };

//   const handleCellClick = (r: number, c: number) => {
//     const cell = cellAt(r, c);
//     if (cell.type !== "EMPTY") return;
//     // Default: gold coin
//     applyGrid(g => { g[r][c] = { type: "GOLD", value: COIN_VALUES[0] }; return g; });
//   };

//   const removeCell = (r: number, c: number) => {
//     const cell = cellAt(r, c);
//     applyGrid(g => { g[r][c] = { type: "EMPTY" }; return g; });
//     if (cell.type === "PURPLE") {
//       // Rebuild zones without this anchor
//       setZones(prev => {
//         const remaining = prev.map(z => ({
//           ...z,
//           anchors: z.anchors.filter(([ar, ac]) => !(ar === r && ac === c)),
//         })).filter(z => z.anchors.length > 0)
//           .map(z => ({
//             ...z,
//             cells: getSingleZoneCells(z.anchors[0][0], z.anchors[0][1]), // simplified
//           }));
//         return mergeAllTouchingZones(remaining);
//       });
//       setPurpleCount(p => Math.max(0, p - 1));
//     }
//   };

//   const updateCell = (r: number, c: number, cell: ZoneCell) => {
//     applyGrid(g => { g[r][c] = cell; return g; });
//   };

//   const handleAddPurple = (r: number, c: number) => {
//     applyGrid(g => { g[r][c] = { type: "PURPLE", value: COIN_VALUES[0], charges: MAX_SPINS }; return g; });
//     setZones(prev => addZoneForAnchor(prev, r, c, nextId));
//     setPurpleCount(p => p + 1);
//   };

//   // ── Spin ────────────────────────────────────────────────────────────────
//   const handleSpin = () => {
//     if (spinsLeft <= 0) return;

//     // Record gaffe BEFORE processing
//     onSpin(generateZoneGaffe(grid));

//     // Process: absorb non-anchor coins inside zones, decrement charges
//     const { grid: newGrid, zones: newZones } = processZoneOnSpin(grid, zones);

//     // Determine if any coin was absorbed (to decide spins left)
//     const prevNonEmpty = grid.flat().filter(c => c.type !== "EMPTY").length;
//     const newNonEmpty  = newGrid.flat().filter(c => c.type !== "EMPTY").length;
//     const absorbed     = newNonEmpty < prevNonEmpty;

//     setGrid(newGrid);
//     setZones(newZones);

//     // spins left: if absorbed or new coin since last → stays 3, else -1
//     // For the gaffe tool: if any absorption happened, treat as "new coin landed" → reset
//     setSpinsLeft(absorbed ? MAX_SPINS : spinsLeft - 1);

//     // Update purple count
//     const purples = newGrid.flat().filter(c => c.type === "PURPLE").length;
//     setPurpleCount(purples);
//   };

//   const handleReset = () => {
//     const g = seedFromBase(baseCoins);
//     setGrid(g);
//     setSpinsLeft(MAX_SPINS);
//     zoneCounter.current = 0;
//     let initZones: Zone[] = [];
//     g.forEach((rowArr, r) =>
//       rowArr.forEach((cell, c) => {
//         if (cell.type === "PURPLE")
//           initZones = addZoneForAnchor(initZones, r, c, () => `z${++zoneCounter.current}`);
//       })
//     );
//     setZones(initZones);
//     setPurpleCount(baseCoins.length);
//     onReset();
//   };

//   // ── Cell background ──────────────────────────────────────────────────────
//   function cellBg(r: number, c: number, cell: ZoneCell): string {
//     if (cell.type === "PURPLE") return "bg-purple-600 border-purple-300";
//     const inZone = zonesForCell(r, c, zones).length > 0;
//     if (inZone) {
//       if (cell.type === "GOLD")  return "bg-yellow-800  border-yellow-500";
//       return "bg-[#4a1d7a] border-purple-700";  // zone highlight
//     }
//     if (cell.type === "GOLD") return "bg-yellow-800 border-yellow-500";
//     return "bg-[#1a1f35] border-gray-700 hover:border-gray-500";
//   }

//   // ─── Render ──────────────────────────────────────────────────────────────
//   return (
//     <div className="rounded-2xl overflow-hidden" style={{ background: "#1e2235" }}>
//       {/* Header */}
//       <div
//         className="flex justify-between items-center px-5 py-4 cursor-pointer select-none"
//         onClick={() => setIsOpen(!isOpen)}
//       >
//         <h2 className="text-base font-bold text-purple-300">🟣 ZONE Feature</h2>
//         <span className="text-gray-400 text-sm">{isOpen ? "▼" : "▶"}</span>
//       </div>

//       {isOpen && (
//         <div className="px-4 pb-5 flex flex-col gap-4">

//           {/* Zone badges */}
//           {zones.length > 0 && (
//             <div className="flex gap-2 flex-wrap">
//               {zones.map((zone, i) => (
//                 <div
//                   key={zone.id}
//                   className="flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold"
//                   style={{ background: "#5b21b6", border: "1px solid #7c3aed" }}
//                 >
//                   <span className="text-lg leading-none">🟣</span>
//                   <span className="text-purple-100">Zone {i + 1}</span>
//                   {/* Charge battery icons */}
//                   {Array.from({ length: zone.charges }).map((_, ci) => (
//                     <span key={ci} className="text-green-400 text-xs">🔋</span>
//                   ))}
//                 </div>
//               ))}
//             </div>
//           )}

//           {/* Purple counter */}
//           <div
//             className="flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-semibold w-fit"
//             style={{ background: "#3b0764", border: "1px solid #6d28d9" }}
//           >
//             <span className="text-lg leading-none">🟣</span>
//             <span className="text-purple-200">Purple used: {purpleCount}</span>
//           </div>

//           {/* Grid 4×5 */}
//           <div
//             className="grid gap-1"
//             style={{ gridTemplateColumns: `repeat(${COLS}, minmax(0,1fr))` }}
//           >
//             {Array.from({ length: ROWS }, (_, r) =>
//               Array.from({ length: COLS }, (_, c) => {
//                 const cell   = cellAt(r, c);
//                 const isEmpty = cell.type === "EMPTY";
//                 const anchor  = isAnchor(r, c, zones);

//                 return (
//                   <div
//                     key={`${r}-${c}`}
//                     onClick={() => isEmpty && handleCellClick(r, c)}
//                     className={`relative rounded-lg border-2 flex flex-col items-center justify-center p-1 transition-all
//                       ${cellBg(r, c, cell)}
//                       ${isEmpty ? "cursor-pointer min-h-[60px]" : "min-h-[90px] cursor-default"}
//                     `}
//                   >
//                     {/* Index */}
//                     <span className="absolute top-1 left-1 text-[9px] text-gray-500 opacity-50">
//                       {c * ROWS + r}
//                     </span>

//                     {isEmpty && (
//                       <div className="flex flex-col items-center gap-1">
//                         <span className="text-gray-600 text-[10px]">+ Gold</span>
//                         <button
//                           onClick={e => { e.stopPropagation(); handleAddPurple(r, c); }}
//                           className="text-[9px] text-purple-400 hover:text-purple-200 border border-purple-700 rounded px-1 py-0.5 leading-none"
//                         >+ Purple</button>
//                       </div>
//                     )}

//                     {cell.type === "GOLD" && (
//                       <div className="flex flex-col items-center gap-1 w-full mt-2">
//                         <span className="text-base">🟡</span>
//                         <select
//                           className="text-[10px] text-white rounded px-0.5 py-0.5 w-full border border-yellow-700 bg-yellow-900 outline-none"
//                           value={cell.value}
//                           onClick={e => e.stopPropagation()}
//                           onChange={e => updateCell(r, c, { type: "GOLD", value: e.target.value })}
//                         >
//                           {COIN_VALUES.map(v => <option key={v} value={v} className="bg-gray-900">{v}</option>)}
//                         </select>
//                         <button onClick={e => { e.stopPropagation(); removeCell(r, c); }}
//                           className="absolute top-1 right-1 text-[10px] text-red-400 hover:text-red-200 font-bold">✕</button>
//                       </div>
//                     )}

//                     {cell.type === "PURPLE" && (
//                       <div className="flex flex-col items-center gap-1 w-full mt-1">
//                         <span className="text-base">🟣</span>
//                         {/* Charge display */}
//                         <div className="flex items-center gap-0.5">
//                           <span className="text-yellow-400 text-[10px] font-bold">
//                             {zones.find(z => z.anchors.some(([ar, ac]) => ar === r && ac === c))?.charges ?? MAX_SPINS}
//                           </span>
//                           <span className="text-green-400 text-[10px]">🔋</span>
//                         </div>
//                         <select
//                           className="text-[10px] text-white rounded px-0.5 py-0.5 w-full border border-purple-400 bg-purple-900 outline-none"
//                           value={cell.value}
//                           onClick={e => e.stopPropagation()}
//                           onChange={e => updateCell(r, c, { ...cell, value: e.target.value })}
//                         >
//                           {COIN_VALUES.map(v => <option key={v} value={v} className="bg-gray-900">{v}</option>)}
//                         </select>
//                         {!anchor && (
//                           <button onClick={e => { e.stopPropagation(); removeCell(r, c); }}
//                             className="absolute top-1 right-1 text-[10px] text-red-400 hover:text-red-200 font-bold">✕</button>
//                         )}
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
//             <span className="text-sm text-gray-300">Spins Left: {spinsLeft}</span>
//             <button onClick={handleReset} className="px-3 py-1 bg-gray-700 hover:bg-gray-600 rounded text-xs text-gray-300">
//               Reset
//             </button>
//           </div>

//           {/* Legend */}
//           <div className="text-xs text-gray-500 flex gap-3 flex-wrap">
//             <span>🟣 Purple = zone anchor (3×3 area)</span>
//             <span>🟡 Gold = absorbed by zone on spin</span>
//             <span className="text-purple-600">■ Purple tint = zone coverage</span>
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
  ZoneCell, Zone, ROWS, COLS, COIN_VALUES, MAX_SPINS,
  emptyGrid, seedFromBase, generateZoneGaffe,
  getSingleZoneCells, getUnionCells, mergeAllTouchingZones,
  addZoneForAnchor, removeAnchorFromZones, processZoneOnSpin,
} from "./zoneFeatureGenerator";

// ─── Props ────────────────────────────────────────────────────────────────────
type Props = {
  baseCoins: { position: number; value: string }[];
  onSpin:    (line: string) => void;
  onReset:   () => void;
};

// ─── Helpers ─────────────────────────────────────────────────────────────────
function getZoneForAnchor(r: number, c: number, zones: Zone[]): Zone | null {
  return zones.find(z => z.anchors.some(([ar, ac]) => ar === r && ac === c)) ?? null;
}
function cellInZone(r: number, c: number, zones: Zone[]): boolean {
  return zones.some(z => z.cells.some(([zr, zc]) => zr === r && zc === c));
}

// ─── Component ───────────────────────────────────────────────────────────────
export default function ZoneFeature({ baseCoins, onSpin, onReset }: Props) {
  const [isOpen,      setIsOpen]      = useState(true);
  const [grid,        setGrid]        = useState<ZoneCell[][]>(() => seedFromBase(baseCoins));
  const [zones,       setZones]       = useState<Zone[]>([]);
  const [spinsLeft,   setSpinsLeft]   = useState(MAX_SPINS);
  const [purpleCount, setPurpleCount] = useState(0);
  const zoneCounter   = useRef(0);
  /** Snapshot of occupied positions at the moment the last SPIN was pressed */
  const lastSnapshot  = useRef<Set<string>>(new Set());

  const nextId = () => `z${++zoneCounter.current}`;

  // ── Re-seed when baseCoins change ────────────────────────────────────────
  useEffect(() => {
    const g = seedFromBase(baseCoins);
    setGrid(g);
    setZones([]);
    setSpinsLeft(MAX_SPINS);
    setPurpleCount(0);
    zoneCounter.current = 0;
    // snapshot = positions of seeded gold coins
    const snap = new Set<string>();
    g.forEach((row, r) => row.forEach((cell, c) => { if (cell.type !== "EMPTY") snap.add(`${r},${c}`); }));
    lastSnapshot.current = snap;
  }, [JSON.stringify(baseCoins)]);

  // ── Grid mutators ────────────────────────────────────────────────────────
  const applyGrid = (fn: (g: ZoneCell[][]) => ZoneCell[][]): ZoneCell[][] => {
    let next!: ZoneCell[][];
    setGrid(prev => { next = fn(prev.map(row => [...row])); return next; });
    return next!;
  };

  // ── Click cycle: EMPTY → GOLD → PURPLE → GOLD  ─────────────────────────
  const handleCellClick = (r: number, c: number) => {
    setGrid(prev => {
      const g    = prev.map(row => [...row]);
      const cell = g[r][c];

      if (cell.type === "EMPTY") {
        g[r][c] = { type: "GOLD", value: COIN_VALUES[0] };
      } else if (cell.type === "GOLD") {
        // Promote to PURPLE anchor
        g[r][c] = { type: "PURPLE", value: cell.value };
        setZones(z => addZoneForAnchor(z, r, c, nextId));
        setPurpleCount(p => p + 1);
      } else if (cell.type === "PURPLE") {
        // Demote back to GOLD
        g[r][c] = { type: "GOLD", value: cell.value };
        setZones(z => removeAnchorFromZones(z, r, c));
        setPurpleCount(p => Math.max(0, p - 1));
      }
      return g;
    });
  };

  const handleRemove = (r: number, c: number) => {
    setGrid(prev => {
      const g    = prev.map(row => [...row]);
      const cell = g[r][c];
      if (cell.type === "PURPLE") {
        setZones(z => removeAnchorFromZones(z, r, c));
        setPurpleCount(p => Math.max(0, p - 1));
      }
      g[r][c] = { type: "EMPTY" };
      return g;
    });
  };

  const updateValue = (r: number, c: number, value: string) => {
    setGrid(prev => {
      const g = prev.map(row => [...row]);
      const cell = g[r][c];
      if (cell.type === "GOLD")   g[r][c] = { type: "GOLD",   value };
      if (cell.type === "PURPLE") g[r][c] = { type: "PURPLE", value };
      return g;
    });
  };

  // ── Spin ─────────────────────────────────────────────────────────────────
  const handleSpin = () => {
    if (spinsLeft <= 0) return;

    // 1. Detect whether any NEW coin was placed since last spin
    const currentSnap = new Set<string>();
    grid.forEach((row, r) => row.forEach((cell, c) => {
      if (cell.type !== "EMPTY") currentSnap.add(`${r},${c}`);
    }));
    const hasNew = [...currentSnap].some(k => !lastSnapshot.current.has(k));

    // 2. Emit gaffe for this state
    onSpin(generateZoneGaffe(grid));

    // 3. Process zone absorption + charge decrement
    const { grid: newGrid, zones: newZones } = processZoneOnSpin(grid, zones);
    setGrid(newGrid);
    setZones(newZones);

    // 4. Update spin count: new coin → reset to 3, else decrement
    setSpinsLeft(hasNew ? MAX_SPINS : spinsLeft - 1);

    // 5. Snapshot becomes current (post-absorption) state
    const afterSnap = new Set<string>();
    newGrid.forEach((row, r) => row.forEach((cell, c) => {
      if (cell.type !== "EMPTY") afterSnap.add(`${r},${c}`);
    }));
    lastSnapshot.current = afterSnap;
  };

  const handleReset = () => {
    const g = seedFromBase(baseCoins);
    setGrid(g);
    setZones([]);
    setSpinsLeft(MAX_SPINS);
    setPurpleCount(0);
    zoneCounter.current = 0;
    const snap = new Set<string>();
    g.forEach((row, r) => row.forEach((cell, c) => { if (cell.type !== "EMPTY") snap.add(`${r},${c}`); }));
    lastSnapshot.current = snap;
    onReset();
  };

  // ── Cell background ──────────────────────────────────────────────────────
  function cellBg(r: number, c: number, cell: ZoneCell): string {
    if (cell.type === "PURPLE") {
      const zone = getZoneForAnchor(r, c, zones);
      // Active zone anchor → bright purple
      if (zone && zone.charges > 0) return "bg-[#7c3aed] border-purple-300";
      // Expired zone → default bg, no special colour
      return "bg-[#1a2035] border-gray-700";
    }
    // Zone-covered non-anchor cell → dark purple tint
    if (cellInZone(r, c, zones)) return "bg-[#2d1b5e] border-purple-700";
    // Default (EMPTY or GOLD)
    return "bg-[#1a2035] border-gray-700";
  }

  // ─── Render ───────────────────────────────────────────────────────────────
  return (
    <div className="rounded-2xl overflow-hidden" style={{ background: "#1e2235" }}>
      {/* Header */}
      <div
        className="flex justify-between items-center px-5 py-4 cursor-pointer select-none"
        onClick={() => setIsOpen(!isOpen)}
      >
        <h2 className="text-base font-bold text-purple-300">🟣 ZONE Feature</h2>
        <span className="text-gray-400 text-sm">{isOpen ? "▼" : "▶"}</span>
      </div>

      {isOpen && (
        <div className="px-4 pb-5 flex flex-col gap-4">

          {/* Zone charge badges */}
          {zones.length > 0 && (
            <div className="flex gap-2 flex-wrap">
              {zones.map((zone, i) => (
                <div key={zone.id}
                  className="flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold"
                  style={{ background: "#5b21b6", border: "1px solid #7c3aed" }}
                >
                  <span>🟣</span>
                  <span className="text-purple-100">Zone {i + 1}</span>
                  {Array.from({ length: zone.charges }).map((_, ci) => (
                    <span key={ci} className="text-green-400 text-xs">🔋</span>
                  ))}
                </div>
              ))}
            </div>
          )}

          {/* Purple counter */}
          <div className="flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-semibold w-fit"
            style={{ background: "#3b0764", border: "1px solid #6d28d9" }}>
            <span>🟣</span>
            <span className="text-purple-200">Purple used: {purpleCount}</span>
          </div>

          {/* Grid 4 rows × 5 cols */}
          <div className="grid gap-1" style={{ gridTemplateColumns: `repeat(${COLS}, minmax(0,1fr))` }}>
            {Array.from({ length: ROWS }, (_, r) =>
              Array.from({ length: COLS }, (_, c) => {
                const cell    = grid[r][c];
                const isEmpty = cell.type === "EMPTY";
                const bg      = cellBg(r, c, cell);
                // Show charge count inside anchor cell
                const anchorZone = cell.type === "PURPLE" ? getZoneForAnchor(r, c, zones) : null;
                const showCharge = anchorZone && anchorZone.charges > 0;

                return (
                  <div
                    key={`${r}-${c}`}
                    onClick={() => handleCellClick(r, c)}
                    className={`relative rounded-lg border-2 flex flex-col items-center justify-center p-1.5 transition-all cursor-pointer
                      ${bg}
                      ${isEmpty ? "min-h-[64px]" : "min-h-[88px]"}
                    `}
                  >
                    {/* Flat index label */}
                    <span className="absolute top-1 left-1.5 text-[9px] text-gray-500 opacity-60 select-none">
                      {c * ROWS + r}
                    </span>

                    {/* ── EMPTY ── */}
                    {isEmpty && (
                      <div className="flex flex-col items-center gap-0.5 pointer-events-none">
                        <span className="text-gray-600 text-[10px]">+ Gold</span>
                        <span className="text-purple-700 text-[9px]">→ Purple</span>
                      </div>
                    )}

                    {/* ── GOLD ── no special bg, just coin + value */}
                    {cell.type === "GOLD" && (
                      <div className="flex flex-col items-center gap-1 w-full mt-2">
                        <span className="text-base leading-none">🟡</span>
                        <select
                          className="text-[10px] text-white rounded px-0.5 py-0.5 w-full bg-gray-800 border border-gray-600 outline-none"
                          value={cell.value}
                          onClick={e => e.stopPropagation()}
                          onChange={e => updateValue(r, c, e.target.value)}
                        >
                          {COIN_VALUES.map(v => <option key={v} value={v} className="bg-gray-900">{v}</option>)}
                        </select>
                        <span className="text-[9px] text-gray-500 italic pointer-events-none">click → purple</span>
                      </div>
                    )}

                    {/* ── PURPLE ── */}
                    {cell.type === "PURPLE" && (
                      <div className="flex flex-col items-center gap-1 w-full mt-2">
                        <span className="text-base leading-none">🟣</span>
                        {/* Charge display only when zone is active */}
                        {showCharge && (
                          <div className="flex items-center gap-0.5">
                            <span className="text-yellow-300 text-[11px] font-bold">{anchorZone!.charges}</span>
                            <span className="text-green-400 text-[10px]">🔋</span>
                          </div>
                        )}
                        <select
                          className="text-[10px] text-white rounded px-0.5 py-0.5 w-full bg-purple-950 border border-purple-600 outline-none"
                          value={cell.value}
                          onClick={e => e.stopPropagation()}
                          onChange={e => updateValue(r, c, e.target.value)}
                        >
                          {COIN_VALUES.map(v => <option key={v} value={v} className="bg-gray-900">{v}</option>)}
                        </select>
                      </div>
                    )}

                    {/* Cross button — visible on all occupied cells */}
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

          {/* Spin controls */}
          <div className="flex items-center gap-4 flex-wrap">
            <button
              onClick={handleSpin}
              disabled={spinsLeft <= 0}
              className={`px-6 py-2 rounded-lg font-bold text-white transition-all ${
                spinsLeft > 0 ? "bg-green-600 hover:bg-green-500" : "bg-gray-600 opacity-50 cursor-not-allowed"
              }`}
            >Spin</button>
            <span className="text-sm text-gray-300">Spins Left: {spinsLeft}</span>
            <button onClick={handleReset}
              className="px-3 py-1 bg-gray-700 hover:bg-gray-600 rounded text-xs text-gray-300">
              Reset
            </button>
          </div>

          {/* Legend */}
          <div className="text-xs text-gray-500 flex gap-4 flex-wrap">
            <span>🟣 Purple = zone anchor (3×3 area)</span>
            <span>🟡 Gold = absorbed by zone on spin</span>
            <span style={{ color: "#6d28d9" }}>■ Purple tint = zone coverage</span>
          </div>

        </div>
      )}
    </div>
  );
}