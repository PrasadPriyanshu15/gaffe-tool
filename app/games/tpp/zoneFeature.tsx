


// //! latest working 


// /* eslint-disable @typescript-eslint/no-explicit-any */
// "use client";

// import { useState, useEffect, useRef } from "react";
// import {
//   ZoneCell, Zone, ROWS, COLS, COIN_VALUES, MAX_SPINS,
//   emptyGrid, seedFromBase, generateZoneGaffe,
//   getSingleZoneCells, getUnionCells, mergeAllTouchingZones,
//   addZoneForAnchor, removeAnchorFromZones, processZoneOnSpin,
// } from "./zoneFeatureGenerator";

// // ─── Props ────────────────────────────────────────────────────────────────────
// type Props = {
//   baseCoins: { position: number; value: string }[];
//   onSpin:    (line: string) => void;
//   onReset:   () => void;
// };

// // ─── Helpers ─────────────────────────────────────────────────────────────────
// function getZoneForAnchor(r: number, c: number, zones: Zone[]): Zone | null {
//   return zones.find(z => z.anchors.some(([ar, ac]) => ar === r && ac === c)) ?? null;
// }
// function cellInZone(r: number, c: number, zones: Zone[]): boolean {
//   return zones.some(z => z.cells.some(([zr, zc]) => zr === r && zc === c));
// }

// // ─── Component ───────────────────────────────────────────────────────────────
// export default function ZoneFeature({ baseCoins, onSpin, onReset }: Props) {
//   const [isOpen,      setIsOpen]      = useState(true);
//   const [grid,        setGrid]        = useState<ZoneCell[][]>(() => seedFromBase(baseCoins));
//   const [zones,       setZones]       = useState<Zone[]>([]);
//   const [spinsLeft,   setSpinsLeft]   = useState(MAX_SPINS);
//   const [purpleCount, setPurpleCount] = useState(0);
//   const zoneCounter   = useRef(0);
//   /** Snapshot of occupied positions at the moment the last SPIN was pressed */
//   const lastSnapshot  = useRef<Set<string>>(new Set());

//   const nextId = () => `z${++zoneCounter.current}`;

//   // ── Re-seed when baseCoins change ────────────────────────────────────────
//   useEffect(() => {
//     const g = seedFromBase(baseCoins);
//     setGrid(g);
//     setZones([]);
//     setSpinsLeft(MAX_SPINS);
//     setPurpleCount(0);
//     zoneCounter.current = 0;
//     // snapshot = positions of seeded gold coins
//     const snap = new Set<string>();
//     g.forEach((row, r) => row.forEach((cell, c) => { if (cell.type !== "EMPTY") snap.add(`${r},${c}`); }));
//     lastSnapshot.current = snap;
//   }, [JSON.stringify(baseCoins)]);

//   // ── Grid mutators ────────────────────────────────────────────────────────
//   const applyGrid = (fn: (g: ZoneCell[][]) => ZoneCell[][]): ZoneCell[][] => {
//     let next!: ZoneCell[][];
//     setGrid(prev => { next = fn(prev.map(row => [...row])); return next; });
//     return next!;
//   };

//   // ── Click cycle: EMPTY → GOLD → PURPLE → GOLD  ─────────────────────────
//   const handleCellClick = (r: number, c: number) => {
//     setGrid(prev => {
//       const g    = prev.map(row => [...row]);
//       const cell = g[r][c];

//       if (cell.type === "EMPTY") {
//         g[r][c] = { type: "GOLD", value: COIN_VALUES[0] };
//       } else if (cell.type === "GOLD") {
//         // Promote to PURPLE anchor
//         g[r][c] = { type: "PURPLE", value: cell.value };
//         setZones(z => addZoneForAnchor(z, r, c, nextId));
//         setPurpleCount(p => p + 1);
//       } else if (cell.type === "PURPLE") {
//         // Demote back to GOLD
//         g[r][c] = { type: "GOLD", value: cell.value };
//         setZones(z => removeAnchorFromZones(z, r, c));
//         setPurpleCount(p => Math.max(0, p - 1));
//       }
//       return g;
//     });
//   };

//   const handleRemove = (r: number, c: number) => {
//     setGrid(prev => {
//       const g    = prev.map(row => [...row]);
//       const cell = g[r][c];
//       if (cell.type === "PURPLE") {
//         setZones(z => removeAnchorFromZones(z, r, c));
//         setPurpleCount(p => Math.max(0, p - 1));
//       }
//       g[r][c] = { type: "EMPTY" };
//       return g;
//     });
//   };

//   const updateValue = (r: number, c: number, value: string) => {
//     setGrid(prev => {
//       const g = prev.map(row => [...row]);
//       const cell = g[r][c];
//       if (cell.type === "GOLD")   g[r][c] = { type: "GOLD",   value };
//       if (cell.type === "PURPLE") g[r][c] = { type: "PURPLE", value };
//       return g;
//     });
//   };

//   // ── Spin ─────────────────────────────────────────────────────────────────
//   const handleSpin = () => {
//     if (spinsLeft <= 0) return;

//     // 1. Detect whether any NEW coin was placed since last spin
//     const currentSnap = new Set<string>();
//     grid.forEach((row, r) => row.forEach((cell, c) => {
//       if (cell.type !== "EMPTY") currentSnap.add(`${r},${c}`);
//     }));
//     const hasNew = [...currentSnap].some(k => !lastSnapshot.current.has(k));

//     // 2. Emit gaffe for this state
//     onSpin(generateZoneGaffe(grid));

//     // 3. Process zone absorption + charge decrement
//     const { grid: newGrid, zones: newZones } = processZoneOnSpin(grid, zones);
//     setGrid(newGrid);
//     setZones(newZones);

//     // 4. Update spin count: new coin → reset to 3, else decrement
//     setSpinsLeft(hasNew ? MAX_SPINS : spinsLeft - 1);

//     // 5. Snapshot becomes current (post-absorption) state
//     const afterSnap = new Set<string>();
//     newGrid.forEach((row, r) => row.forEach((cell, c) => {
//       if (cell.type !== "EMPTY") afterSnap.add(`${r},${c}`);
//     }));
//     lastSnapshot.current = afterSnap;
//   };

//   const handleReset = () => {
//     const g = seedFromBase(baseCoins);
//     setGrid(g);
//     setZones([]);
//     setSpinsLeft(MAX_SPINS);
//     setPurpleCount(0);
//     zoneCounter.current = 0;
//     const snap = new Set<string>();
//     g.forEach((row, r) => row.forEach((cell, c) => { if (cell.type !== "EMPTY") snap.add(`${r},${c}`); }));
//     lastSnapshot.current = snap;
//     onReset();
//   };

//   // ── Cell background ──────────────────────────────────────────────────────
//   function cellBg(r: number, c: number, cell: ZoneCell): string {
//     if (cell.type === "PURPLE") {
//       const zone = getZoneForAnchor(r, c, zones);
//       // Active zone anchor → bright purple
//       if (zone && zone.charges > 0) return "bg-[#7c3aed] border-purple-300";
//       // Expired zone → default bg, no special colour
//       return "bg-[#1a2035] border-gray-700";
//     }
//     // Zone-covered non-anchor cell → dark purple tint
//     if (cellInZone(r, c, zones)) return "bg-[#2d1b5e] border-purple-700";
//     // Default (EMPTY or GOLD)
//     return "bg-[#1a2035] border-gray-700";
//   }

//   // ─── Render ───────────────────────────────────────────────────────────────
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

//           {/* Zone charge badges */}
//           {zones.length > 0 && (
//             <div className="flex gap-2 flex-wrap">
//               {zones.map((zone, i) => (
//                 <div key={zone.id}
//                   className="flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold"
//                   style={{ background: "#5b21b6", border: "1px solid #7c3aed" }}
//                 >
//                   <span>🟣</span>
//                   <span className="text-purple-100">Zone {i + 1}</span>
//                   {Array.from({ length: zone.charges }).map((_, ci) => (
//                     <span key={ci} className="text-green-400 text-xs">🔋</span>
//                   ))}
//                 </div>
//               ))}
//             </div>
//           )}

//           {/* Purple counter */}
//           <div className="flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-semibold w-fit"
//             style={{ background: "#3b0764", border: "1px solid #6d28d9" }}>
//             <span>🟣</span>
//             <span className="text-purple-200">Purple used: {purpleCount}</span>
//           </div>

//           {/* Grid 4 rows × 5 cols */}
//           <div className="grid gap-1" style={{ gridTemplateColumns: `repeat(${COLS}, minmax(0,1fr))` }}>
//             {Array.from({ length: ROWS }, (_, r) =>
//               Array.from({ length: COLS }, (_, c) => {
//                 const cell    = grid[r][c];
//                 const isEmpty = cell.type === "EMPTY";
//                 const bg      = cellBg(r, c, cell);
//                 // Show charge count inside anchor cell
//                 const anchorZone = cell.type === "PURPLE" ? getZoneForAnchor(r, c, zones) : null;
//                 const showCharge = anchorZone && anchorZone.charges > 0;

//                 return (
//                   <div
//                     key={`${r}-${c}`}
//                     onClick={() => handleCellClick(r, c)}
//                     className={`relative rounded-lg border-2 flex flex-col items-center justify-center p-1.5 transition-all cursor-pointer
//                       ${bg}
//                       ${isEmpty ? "min-h-[64px]" : "min-h-[88px]"}
//                     `}
//                   >
//                     {/* Flat index label */}
//                     <span className="absolute top-1 left-1.5 text-[9px] text-gray-500 opacity-60 select-none">
//                       {c * ROWS + r}
//                     </span>

//                     {/* ── EMPTY ── */}
//                     {isEmpty && (
//                       <div className="flex flex-col items-center gap-0.5 pointer-events-none">
//                         <span className="text-gray-600 text-[10px]">+ Gold</span>
//                         <span className="text-purple-700 text-[9px]">→ Purple</span>
//                       </div>
//                     )}

//                     {/* ── GOLD ── no special bg, just coin + value */}
//                     {cell.type === "GOLD" && (
//                       <div className="flex flex-col items-center gap-1 w-full mt-2">
//                         <span className="text-base leading-none">🟡</span>
//                         <select
//                           className="text-[10px] text-white rounded px-0.5 py-0.5 w-full bg-gray-800 border border-gray-600 outline-none"
//                           value={cell.value}
//                           onClick={e => e.stopPropagation()}
//                           onChange={e => updateValue(r, c, e.target.value)}
//                         >
//                           {COIN_VALUES.map(v => <option key={v} value={v} className="bg-gray-900">{v}</option>)}
//                         </select>
//                         <span className="text-[9px] text-gray-500 italic pointer-events-none">click → purple</span>
//                       </div>
//                     )}

//                     {/* ── PURPLE ── */}
//                     {cell.type === "PURPLE" && (
//                       <div className="flex flex-col items-center gap-1 w-full mt-2">
//                         <span className="text-base leading-none">🟣</span>
//                         {/* Charge display only when zone is active */}
//                         {showCharge && (
//                           <div className="flex items-center gap-0.5">
//                             <span className="text-yellow-300 text-[11px] font-bold">{anchorZone!.charges}</span>
//                             <span className="text-green-400 text-[10px]">🔋</span>
//                           </div>
//                         )}
//                         <select
//                           className="text-[10px] text-white rounded px-0.5 py-0.5 w-full bg-purple-950 border border-purple-600 outline-none"
//                           value={cell.value}
//                           onClick={e => e.stopPropagation()}
//                           onChange={e => updateValue(r, c, e.target.value)}
//                         >
//                           {COIN_VALUES.map(v => <option key={v} value={v} className="bg-gray-900">{v}</option>)}
//                         </select>
//                       </div>
//                     )}

//                     {/* Cross button — visible on all occupied cells */}
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

//           {/* Spin controls */}
//           <div className="flex items-center gap-4 flex-wrap">
//             <button
//               onClick={handleSpin}
//               disabled={spinsLeft <= 0}
//               className={`px-6 py-2 rounded-lg font-bold text-white transition-all ${
//                 spinsLeft > 0 ? "bg-green-600 hover:bg-green-500" : "bg-gray-600 opacity-50 cursor-not-allowed"
//               }`}
//             >Spin</button>
//             <span className="text-sm text-gray-300">Spins Left: {spinsLeft}</span>
//             <button onClick={handleReset}
//               className="px-3 py-1 bg-gray-700 hover:bg-gray-600 rounded text-xs text-gray-300">
//               Reset
//             </button>
//           </div>

//           {/* Legend */}
//           <div className="text-xs text-gray-500 flex gap-4 flex-wrap">
//             <span>🟣 Purple = zone anchor (3×3 area)</span>
//             <span>🟡 Gold = absorbed by zone on spin</span>
//             <span style={{ color: "#6d28d9" }}>■ Purple tint = zone coverage</span>
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
  ZoneCell, Zone, EReelSetting,
  GRID_ROWS, GRID_COLS, MAX_PURPLE_COINS, MAX_SPINS,
  COIN_VALUES, PURPLE_COIN_SEQUENCE,
  emptyGrid, seedFromBase, generateZoneGaffe,
  getSingleZoneCells, getUnionCells, mergeAllTouchingZones,
  addZoneForAnchor, removeAnchorFromZones, processZoneOnSpin,
  gridToPos, posToCol, eReelOptions, UNLOCKED_POSITIONS,
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
  const [isOpen,        setIsOpen]        = useState(true);
  const [grid,          setGrid]          = useState<ZoneCell[][]>(() => seedFromBase(baseCoins));
  const [zones,         setZones]         = useState<Zone[]>([]);
  const [spinsLeft,     setSpinsLeft]     = useState(MAX_SPINS);
  const [purpleCoinIdx, setPurpleCoinIdx] = useState(0);     // next PURPLE_COIN_SEQUENCE index
  const [eReelPos,      setEReelPos]      = useState<EReelSetting | null>(null);
  const zoneCounter = useRef(0);
 
  /** Flat global positions occupied at the START of each spin (used for snapshot diffing) */
  const lastSnapshot = useRef<Set<number>>(new Set());
 
  const nextId = () => `z${++zoneCounter.current}`;
 
  // ── Re-seed when baseCoins change ────────────────────────────────────────
  useEffect(() => {
    const g = seedFromBase(baseCoins);
    setGrid(g);
    setZones([]);
    setSpinsLeft(MAX_SPINS);
    setPurpleCoinIdx(0);
    setEReelPos(null);
    zoneCounter.current = 0;
    const snap = new Set<number>();
    g.forEach((row, r) => row.forEach((cell, c) => {
      if (cell.type !== "EMPTY") snap.add(gridToPos(r, c));
    }));
    lastSnapshot.current = snap;
  }, [JSON.stringify(baseCoins)]);
 
  // ── Derived ────────────────────────────────────────────────────────────────
  const purpleCount           = grid.flat().filter(c => c.type === "PURPLE").length;
  const nextPurpleCoinDisplay = PURPLE_COIN_SEQUENCE[purpleCoinIdx] ?? "—";
 
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
 
  // ── Click cycle: EMPTY → GOLD → PURPLE → GOLD  ─────────────────────────
  const handleCellClick = (r: number, c: number) => {
    setGrid(prev => {
      const g    = prev.map(row => [...row]);
      const cell = g[r][c];
 
      if (cell.type === "EMPTY") {
        g[r][c] = { type: "GOLD", value: COIN_VALUES[0] };
      } else if (cell.type === "GOLD") {
        if (purpleCount < MAX_PURPLE_COINS) {
          // Promote to PURPLE anchor
          g[r][c] = { type: "PURPLE", value: cell.value };
          setZones(z => addZoneForAnchor(z, r, c, nextId));
        }
      } else if (cell.type === "PURPLE") {
        // Demote back to GOLD
        g[r][c] = { type: "GOLD", value: cell.value };
        setZones(z => removeAnchorFromZones(z, r, c));
      }
      return g;
    });
  };
 
  const handleRemove = (r: number, c: number) => {
    const pos = gridToPos(r, c);
    if (eReelPos?.pos === pos) setEReelPos(null);
    setGrid(prev => {
      const g    = prev.map(row => [...row]);
      const cell = g[r][c];
      if (cell.type === "PURPLE") {
        setZones(z => removeAnchorFromZones(z, r, c));
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
 
  // ── typeEReelPosition ─────────────────────────────────────────────────────
  const handleSetEReelPos = (r: number, c: number) => {
    const pos  = gridToPos(r, c);
    const opts = eReelOptions(pos);
    setEReelPos({ pos, value: opts[0] });
  };
 
  // ── Spin ─────────────────────────────────────────────────────────────────
  const handleSpin = () => {
    if (spinsLeft <= 0) return;
 
    const prevSnap = new Set(lastSnapshot.current);
 
    // Snapshot after this spin, before absorption
    const currentSnap = new Set<number>();
    grid.forEach((row, r) => row.forEach((cell, c) => {
      if (cell.type !== "EMPTY") currentSnap.add(gridToPos(r, c));
    }));
    const hasNew = [...currentSnap].some(k => !prevSnap.has(k));
 
    // Count new PURPLE coins placed this spin
    let newPurpleCount = 0;
    grid.forEach((row, r) => row.forEach((cell, c) => {
      const pos = gridToPos(r, c);
      if (cell.type === "PURPLE" && !prevSnap.has(pos)) newPurpleCount++;
    }));
 
    // Generate gaffe with the pre-spin snapshot as "prev"
    onSpin(generateZoneGaffe(grid, prevSnap, eReelPos, purpleCoinIdx, ["piggyZone"]));
 
    // Advance PURPLE sequence index
    if (newPurpleCount > 0) setPurpleCoinIdx(prev => prev + newPurpleCount);
 
    // Process zone absorption + charge decrement
    const { grid: newGrid, zones: newZones } = processZoneOnSpin(grid, zones);
    setGrid(newGrid);
    setZones(newZones);
 
    // Snapshot becomes current (post-absorption) state, in global positions
    const afterSnap = new Set<number>();
    newGrid.forEach((row, r) => row.forEach((cell, c) => {
      if (cell.type !== "EMPTY") afterSnap.add(gridToPos(r, c));
    }));
    lastSnapshot.current = afterSnap;
 
    setSpinsLeft(hasNew ? MAX_SPINS : spinsLeft - 1);
  };
 
  const handleReset = () => {
    const g = seedFromBase(baseCoins);
    setGrid(g);
    setZones([]);
    setSpinsLeft(MAX_SPINS);
    setPurpleCoinIdx(0);
    setEReelPos(null);
    zoneCounter.current = 0;
    const snap = new Set<number>();
    g.forEach((row, r) => row.forEach((cell, c) => {
      if (cell.type !== "EMPTY") snap.add(gridToPos(r, c));
    }));
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
 
          {/* ── Stats bar ── */}
          <div className="flex items-center gap-2 flex-wrap">
            <span className="px-3 py-1 rounded-full text-xs font-semibold bg-purple-950 text-purple-300 border border-purple-800">
              🟣 Purple used: {purpleCount} / {MAX_PURPLE_COINS}
            </span>
            <span className="px-2 py-1 rounded text-[11px] bg-gray-800 text-gray-300 border border-gray-700">
              Next PURPLE: <span className="text-purple-400 font-semibold">{nextPurpleCoinDisplay}</span>
              <span className="text-gray-600 ml-1">#{purpleCoinIdx + 1}</span>
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
 
          {/* ── Grid 4 × 5 ── */}
          <div
            className="grid gap-1"
            style={{ gridTemplateColumns: `repeat(${GRID_COLS}, minmax(0, 1fr))` }}
          >
            {Array.from({ length: GRID_ROWS }, (_, r) =>
              Array.from({ length: GRID_COLS }, (_, c) => {
                const cell       = grid[r][c];
                const pos        = gridToPos(r, c);
                const isEmpty    = cell.type === "EMPTY";
                const isInBase   = basePositions.has(pos);
                const bg         = cellBg(r, c, cell);
                const anchorZone = cell.type === "PURPLE" ? getZoneForAnchor(r, c, zones) : null;
                const showCharge = anchorZone && anchorZone.charges > 0;
 
                // Pre-extract to avoid TS narrowing errors in JSX
                const cellValue = cell.type !== "EMPTY" ? cell.value : "";
 
                return (
                  <div
                    key={`${r}-${c}`}
                    onClick={() => handleCellClick(r, c)}
                    className={`relative rounded-lg border-2 flex flex-col
                      items-center justify-center p-1.5 transition-all cursor-pointer ${bg}`}
                    style={{ minHeight: cell.type === "PURPLE" ? "110px" : cell.type === "GOLD" ? "88px" : "58px" }}
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
                        {purpleCount < MAX_PURPLE_COINS && (
                          <span className="text-purple-700 text-[9px]">→ Purple</span>
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
                        {purpleCount < MAX_PURPLE_COINS && (
                          <span className="text-[8px] text-gray-600 italic pointer-events-none">
                            click → purple
                          </span>
                        )}
                      </div>
                    )}
 
                    {/* ── PURPLE ── */}
                    {cell.type === "PURPLE" && (
                      <div className="flex flex-col items-center gap-1 w-full mt-3">
                        <span className="text-sm leading-none">🟣</span>
 
                        {/* Which PURPLE_COIN sequence value will be used this spin */}
                        <span className="text-[8px] text-purple-400 font-semibold text-center leading-tight">
                          {nextPurpleCoinDisplay}
                        </span>
 
                        {/* Charge display only when zone is active */}
                        {showCharge && (
                          <div className="flex items-center gap-0.5">
                            <span className="text-yellow-300 text-[10px] font-bold">{anchorZone!.charges}</span>
                            <span className="text-green-400 text-[9px]">🔋</span>
                          </div>
                        )}
 
                        {/* Coin value */}
                        <select
                          className="text-[10px] text-white rounded px-0.5 py-0.5 w-full
                            bg-purple-950 border border-purple-600 outline-none"
                          value={cellValue}
                          onClick={e => e.stopPropagation()}
                          onChange={e => updateValue(r, c, e.target.value)}
                        >
                          {COIN_VALUES.map(v => (
                            <option key={v} value={v} className="bg-gray-900">{v}</option>
                          ))}
                        </select>
 
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
            <span>🟡 Gold → click → 🟣 Purple → click → 🟡</span>
            <span>⚡E = set typeEReelPosition</span>
            <span>Max {MAX_PURPLE_COINS} purple coins total</span>
            <span>🟣 Purple = zone anchor (3×3 area) · 🔋 = charges left</span>
          </div>
 
        </div>
      )}
    </div>
  );
}