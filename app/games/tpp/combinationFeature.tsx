/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { useState, useEffect, useRef } from "react";
import {
  FeatureKey, ComboCell, Zone,
  STD_ROWS, TWR_ROWS, TWR_COLS, TWR_LOCKED,
  COIN_VALUES, MULTI_VALUES, MAX_SPINS, MAX_RED, MAX_BLUE,
  hasTower, gridRows, gridCols,
  seedCombinedGrid, nextCellType,
  getSingleZoneCells, getUnionCells, mergeAllTouchingZones,
  addZoneForAnchor, removeAnchorFromZones,
  firstUnlockedRow, unlockHint,
  generateComboGaffe,
} from "./combinationFeatureGenerator";

// ─── Props ────────────────────────────────────────────────────────────────────
type Props = {
  selectedFeatures: FeatureKey[];
  baseCoins: Array<{ position: number; value: string; featureKey: string }>;
  onSpin:    (line: string) => void;
  onReset:   () => void;
};

// ─── Display metadata ─────────────────────────────────────────────────────────
const F_COLOR: Record<FeatureKey, string> = {
  piggyWheel: "text-red-400",
  piggyZone:  "text-purple-400",
  piggyTower: "text-blue-400",
};
const F_DOT: Record<FeatureKey, string> = {
  piggyWheel: "🔴",
  piggyZone:  "🟣",
  piggyTower: "🔵",
};
const LOCKED_LABELS = [-47, -41, -35, -29, -23, -17, -11, -5];

// ─── Pure helpers ─────────────────────────────────────────────────────────────

/** Zone that has this cell as an anchor. */
function getZoneForAnchor(r: number, c: number, zones: Zone[]): Zone | null {
  return zones.find(z => z.anchors.some(([ar, ac]) => ar === r && ac === c)) ?? null;
}

/** Whether (r,c) falls inside any active zone's coverage area. */
function cellInActiveZone(r: number, c: number, zones: Zone[]): boolean {
  return zones.some(z => z.cells.some(([zr, zc]) => zr === r && zc === c));
}

/** Coins in rows >= fUnlocked (used for row-unlock progress). */
function countUnlockedCoins(grid: ComboCell[][], fUnlocked: number): number {
  let n = 0;
  grid.forEach((row, r) => {
    if (r >= fUnlocked) row.forEach(cell => { if (cell.type !== "EMPTY") n++; });
  });
  return n;
}

/**
 * Rebuild the active zone list from scratch using only PURPLE coins
 * in currently-UNLOCKED rows.
 * Called whenever fUnlock changes (a new row is unlocked) so that
 * previously-inert purple coins in newly-unlocked rows start forming zones.
 */
function rebuildZonesFromUnlocked(
  grid:     ComboCell[][],
  fUnlock:  number,
  rows:     number,
  cols:     number,
  nextId:   () => string
): Zone[] {
  let zones: Zone[] = [];
  grid.forEach((rowArr, r) => {
    if (r < fUnlock) return; // still locked → skip
    rowArr.forEach((cell, c) => {
      if (cell.type === "PURPLE") {
        zones = addZoneForAnchor(zones, r, c, rows, cols, nextId);
      }
    });
  });
  return zones;
}

// ─── Component ───────────────────────────────────────────────────────────────
export default function CombinationFeature({
  selectedFeatures, baseCoins, onSpin, onReset,
}: Props) {
  const [isOpen,    setIsOpen]    = useState(true);
  const [grid,      setGrid]      = useState<ComboCell[][]>(() =>
    seedCombinedGrid(baseCoins, selectedFeatures)
  );
  const [zones,     setZones]     = useState<Zone[]>([]);
  const [spinsLeft, setSpinsLeft] = useState(MAX_SPINS);
  const [usedMults, setUsedMults] = useState<Set<string>>(new Set());

  // Track previously computed fUnlock to detect when a new row unlocks
  const prevFUnlock    = useRef<number>(TWR_LOCKED);
  const zoneCounter    = useRef(0);
  const lastSnapRef    = useRef<Set<string>>(new Set());

  const nextId = () => `z${++zoneCounter.current}`;

  const isTwr   = hasTower(selectedFeatures);
  const ROWS    = gridRows(selectedFeatures);
  const COLS    = gridCols(selectedFeatures);
  const hasZone = selectedFeatures.includes("piggyZone");
  const hasWhl  = selectedFeatures.includes("piggyWheel");

  // ── Re-seed when inputs change ────────────────────────────────────────────
  useEffect(() => {
    const g = seedCombinedGrid(baseCoins, selectedFeatures);
    setGrid(g);
    setZones([]);
    setSpinsLeft(MAX_SPINS);
    setUsedMults(new Set());
    zoneCounter.current = 0;
    prevFUnlock.current = TWR_LOCKED;

    const snap = new Set<string>();
    g.forEach((row, r) => row.forEach((cell, c) => {
      if (cell.type !== "EMPTY") snap.add(`${r},${c}`);
    }));
    lastSnapRef.current = snap;
  }, [JSON.stringify(baseCoins), JSON.stringify(selectedFeatures)]);

  // ── Derived: unlock state ─────────────────────────────────────────────────
  const fUnlock = isTwr
    ? firstUnlockedRow(countUnlockedCoins(grid, TWR_LOCKED))
    : 0;
  const hint = isTwr
    ? unlockHint(countUnlockedCoins(grid, TWR_LOCKED))
    : null;

  const isUnlocked = (r: number) => !isTwr || r >= fUnlock;

  // ── When fUnlock decreases (new row unlocked), rebuild zones ─────────────
  // This activates purple coins that were inert in locked rows.
  useEffect(() => {
    if (!isTwr || !hasZone) return;
    if (fUnlock < prevFUnlock.current) {
      // At least one new row just became unlocked
      zoneCounter.current = 0;
      const newZones = rebuildZonesFromUnlocked(grid, fUnlock, ROWS, COLS, nextId);
      setZones(newZones);
    }
    prevFUnlock.current = fUnlock;
  }, [fUnlock]);

  // ── Counters ──────────────────────────────────────────────────────────────
  const redCount  = grid.flat().filter(c => c.type === "RED").length;
  const blueCount = grid.flat().filter(c => c.type === "BLUE").length;

  // ── Grid helpers ─────────────────────────────────────────────────────────
  const applyGrid = (fn: (g: ComboCell[][]) => ComboCell[][]): void => {
    setGrid(prev => fn(prev.map(row => [...row])));
  };

  // ── Click cycle ───────────────────────────────────────────────────────────
  const handleCellClick = (r: number, c: number) => {
    const cell    = grid[r][c];
    const current = cell.type;
    const next    = current === "EMPTY"
      ? "GOLD"
      : nextCellType(current, selectedFeatures, { red: redCount, blue: blueCount });

    if (next === "PURPLE") {
      applyGrid(g => {
        g[r][c] = { type: "PURPLE", value: (cell as any).value ?? COIN_VALUES[0] };
        return g;
      });
      // Only create a zone if this row is already unlocked
      // (locked rows: purple is inert until that row unlocks)
      if (isUnlocked(r)) {
        setZones(prev => addZoneForAnchor(prev, r, c, ROWS, COLS, nextId));
      }
      return;
    }

    if (current === "PURPLE") {
      // Leaving PURPLE → remove zone if it existed (only unlocked rows have zones)
      if (isUnlocked(r)) {
        setZones(prev => removeAnchorFromZones(prev, r, c, ROWS, COLS));
      }
      applyGrid(g => {
        g[r][c] = { type: "GOLD", value: (cell as any).value ?? COIN_VALUES[0] };
        return g;
      });
      return;
    }

    if (next === "RED") {
      applyGrid(g => {
        g[r][c] = { type: "RED", value: (cell as any).value ?? COIN_VALUES[0], multiplier: "" };
        return g;
      });
      return;
    }

    if (next === "BLUE") {
      applyGrid(g => {
        g[r][c] = { type: "BLUE", value: (cell as any).value ?? COIN_VALUES[0] };
        return g;
      });
      return;
    }

    if (next === "GOLD") {
      if (current === "RED" && (cell as any).multiplier) {
        setUsedMults(prev => { const s = new Set(prev); s.delete((cell as any).multiplier); return s; });
      }
      applyGrid(g => {
        g[r][c] = { type: "GOLD", value: (cell as any).value ?? COIN_VALUES[0] };
        return g;
      });
      return;
    }

    applyGrid(g => { g[r][c] = { type: "EMPTY" }; return g; });
  };

  const handleRemove = (r: number, c: number) => {
    const cell = grid[r][c];
    if (cell.type === "PURPLE" && isUnlocked(r)) {
      setZones(prev => removeAnchorFromZones(prev, r, c, ROWS, COLS));
    }
    if (cell.type === "RED" && cell.multiplier) {
      setUsedMults(prev => { const s = new Set(prev); s.delete(cell.multiplier); return s; });
    }
    applyGrid(g => { g[r][c] = { type: "EMPTY" }; return g; });
  };

  const updateValue = (r: number, c: number, value: string) => {
    applyGrid(g => {
      const cell = g[r][c];
      if (cell.type !== "EMPTY") g[r][c] = { ...cell, value } as ComboCell;
      return g;
    });
  };

  const handleMultiplier = (r: number, c: number, val: string) => {
    applyGrid(g => {
      const cell = g[r][c];
      if (cell.type !== "RED") return g;
      if (cell.multiplier) setUsedMults(prev => { const s = new Set(prev); s.delete(cell.multiplier); return s; });
      if (val) setUsedMults(prev => new Set([...prev, val]));
      g[r][c] = { ...cell, multiplier: val };
      return g;
    });
  };

  // ── Spin ──────────────────────────────────────────────────────────────────
  const handleSpin = () => {
    if (spinsLeft <= 0) return;

    // Detect new coins: for tower combos only unlocked-row coins reset spins
    const snap = new Set<string>();
    grid.forEach((row, r) => row.forEach((cell, c) => {
      if (cell.type !== "EMPTY" && isUnlocked(r)) snap.add(`${r},${c}`);
    }));
    const hasNew = [...snap].some(k => !lastSnapRef.current.has(k));
    lastSnapRef.current = snap;

    onSpin(generateComboGaffe(grid, selectedFeatures));

    // Zone absorption — only absorb cells in UNLOCKED rows
    if (hasZone && zones.length > 0) {
      setGrid(prevGrid => {
        const ng = prevGrid.map(row => row.map(c => ({ ...c })));
        const updatedZones = zones
          .map(zone => {
            zone.cells.forEach(([zr, zc]) => {
              // Skip if this zone cell is in a locked row
              if (!isUnlocked(zr)) return;
              const isAnchor = zone.anchors.some(([ar, ac]) => ar === zr && ac === zc);
              if (!isAnchor && ng[zr][zc].type !== "EMPTY") {
                ng[zr][zc] = { type: "EMPTY" };
              }
            });
            return { ...zone, charges: zone.charges - 1 };
          })
          .filter(z => z.charges > 0);
        setZones(updatedZones);
        return ng;
      });
    }

    setSpinsLeft(hasNew ? MAX_SPINS : spinsLeft - 1);
  };

  const handleReset = () => {
    const g = seedCombinedGrid(baseCoins, selectedFeatures);
    setGrid(g);
    setZones([]);
    setSpinsLeft(MAX_SPINS);
    setUsedMults(new Set());
    zoneCounter.current = 0;
    prevFUnlock.current = TWR_LOCKED;
    const snap = new Set<string>();
    g.forEach((row, r) => row.forEach((cell, c) => {
      if (cell.type !== "EMPTY") snap.add(`${r},${c}`);
    }));
    lastSnapRef.current = snap;
    onReset();
  };

  // ── Cell background ───────────────────────────────────────────────────────
  function cellBg(r: number, c: number, cell: ComboCell): string {
    if (cell.type === "PURPLE") {
      if (!isUnlocked(r)) {
        // Locked row: inert purple — no zone background, plain dark purple border
        return "bg-[#1a2035] border-purple-900";
      }
      // Unlocked anchor
      const zone = getZoneForAnchor(r, c, zones);
      return zone && zone.charges > 0
        ? "bg-[#7c3aed] border-purple-300"
        : "bg-[#1a2035] border-purple-700";
    }
    // Zone coverage tint — only for unlocked cells inside an active zone
    if (hasZone && isUnlocked(r) && cellInActiveZone(r, c, zones)) {
      return "bg-[#2d1b5e] border-purple-700";
    }
    if (cell.type === "BLUE")    return "bg-[#1a2035] border-blue-500";
    if (cell.type === "RED")     return "bg-[#1a2035] border-red-700";
    if (cell.type === "GOLD")    return "bg-[#1a2035] border-gray-600";
    // Empty
    if (isTwr && !isUnlocked(r)) return "bg-[#0d1117] border-gray-800";
    return "bg-[#1a2035] border-gray-700 hover:border-gray-500";
  }

  // ── Cycle hint text ───────────────────────────────────────────────────────
  function cycleHint(cell: ComboCell): string | null {
    if (cell.type === "EMPTY") return null;
    const next = nextCellType(cell.type, selectedFeatures, { red: redCount, blue: blueCount });
    if (next === cell.type || next === "GOLD") return null;
    const map: Record<string, string> = { RED: "→ red", BLUE: "→ blue", PURPLE: "→ purple" };
    return map[next] ?? null;
  }

  // ── Title strip ───────────────────────────────────────────────────────────
  const titleStrip = selectedFeatures.map((f, i) => (
    <span key={f} className="flex items-center gap-1">
      {i > 0 && <span className="text-gray-500 mx-0.5">+</span>}
      <span className="text-sm">{F_DOT[f]}</span>
      <span className={`text-xs font-semibold ${F_COLOR[f]}`}>{f.toUpperCase()}</span>
    </span>
  ));

  // ── Cell renderer ─────────────────────────────────────────────────────────
  function renderCell(r: number, c: number) {
    const cell    = grid[r]?.[c];
    if (!cell) return null;
    const isEmpty  = cell.type === "EMPTY";
    const unlocked = isUnlocked(r);
    const bg       = cellBg(r, c, cell);
    const hint_    = !isEmpty ? cycleHint(cell) : null;

    // Zone charge badge: only for unlocked purple anchors with an active zone
    const anchorZone  = (cell.type === "PURPLE" && unlocked)
      ? getZoneForAnchor(r, c, zones) : null;
    const showCharge  = anchorZone && anchorZone.charges > 0;

    const cellH = isEmpty
      ? (isTwr ? "min-h-[34px]" : "min-h-[60px]")
      : (isTwr ? "min-h-[76px]" : "min-h-[92px]");

    return (
      <div
        key={`${r}-${c}`}
        onClick={() => handleCellClick(r, c)}
        className={`relative rounded-lg border-2 flex flex-col items-center justify-center p-1.5
          transition-all cursor-pointer ${bg} ${cellH}`}
      >
        {/* Flat index */}
        <span className="absolute top-0.5 left-1 text-[8px] text-gray-600 opacity-40 select-none">
          {c * (isTwr ? TWR_ROWS : STD_ROWS) + r}
        </span>

        {/* EMPTY */}
        {isEmpty && (
          <span className="text-gray-600 text-[10px] pointer-events-none">
            {!unlocked ? "+" : "+ Gold"}
          </span>
        )}

        {/* GOLD */}
        {cell.type === "GOLD" && (
          <div className="flex flex-col items-center gap-1 w-full mt-2">
            <span className="text-sm leading-none">🟡</span>
            <select
              className="text-[10px] text-white rounded px-0.5 py-0.5 w-full bg-gray-800 border border-gray-600 outline-none"
              value={cell.value} onClick={e => e.stopPropagation()}
              onChange={e => updateValue(r, c, e.target.value)}
            >
              {COIN_VALUES.map(v => <option key={v} value={v} className="bg-gray-900">{v}</option>)}
            </select>
            {hint_ && <span className="text-[8px] text-gray-600 italic pointer-events-none">{hint_}</span>}
          </div>
        )}

        {/* RED */}
        {cell.type === "RED" && (
          <div className="flex flex-col items-center gap-1 w-full mt-2">
            <span className="text-sm leading-none">🔴</span>
            <select
              className="text-[10px] text-white rounded px-0.5 py-0.5 w-full bg-gray-800 border border-gray-600 outline-none"
              value={cell.value} onClick={e => e.stopPropagation()}
              onChange={e => updateValue(r, c, e.target.value)}
            >
              {COIN_VALUES.map(v => <option key={v} value={v} className="bg-gray-900">{v}</option>)}
            </select>
            <select
              className="text-[10px] text-white rounded px-0.5 py-0.5 w-full bg-gray-800 border border-red-800 outline-none"
              value={cell.multiplier} onClick={e => e.stopPropagation()}
              onChange={e => handleMultiplier(r, c, e.target.value)}
            >
              <option value="" className="bg-gray-900">─ Mult ─</option>
              {MULTI_VALUES.map(m => {
                const disabled = usedMults.has(m) && cell.multiplier !== m;
                return (
                  <option key={m} value={m} disabled={disabled}
                    className={disabled ? "text-gray-600 bg-gray-900" : "bg-gray-900"}>
                    {disabled ? `${m} (used)` : m}
                  </option>
                );
              })}
            </select>
            {hint_ && <span className="text-[8px] text-gray-600 italic pointer-events-none">{hint_}</span>}
          </div>
        )}

        {/* BLUE */}
        {cell.type === "BLUE" && (
          <div className="flex flex-col items-center gap-1 w-full mt-2">
            <span className="text-sm leading-none">🔵</span>
            <select
              className="text-[10px] text-white rounded px-0.5 py-0.5 w-full bg-blue-950 border border-blue-700 outline-none"
              value={cell.value} onClick={e => e.stopPropagation()}
              onChange={e => updateValue(r, c, e.target.value)}
            >
              {COIN_VALUES.map(v => <option key={v} value={v} className="bg-gray-900">{v}</option>)}
            </select>
            {hint_ && <span className="text-[8px] text-gray-600 italic pointer-events-none">{hint_}</span>}
          </div>
        )}

        {/* PURPLE */}
        {cell.type === "PURPLE" && (
          <div className="flex flex-col items-center gap-1 w-full mt-2">
            <span className="text-sm leading-none">🟣</span>
            {/* Charge badge only shown for unlocked active anchors */}
            {showCharge && (
              <div className="flex items-center gap-0.5">
                <span className="text-yellow-300 text-[11px] font-bold">{anchorZone!.charges}</span>
                <span className="text-green-400 text-[10px]">🔋</span>
              </div>
            )}
            {/* "inactive" label for locked-row purple */}
            {!unlocked && (
              <span className="text-[8px] text-purple-800 italic pointer-events-none">inactive</span>
            )}
            <select
              className="text-[10px] text-white rounded px-0.5 py-0.5 w-full bg-purple-950 border border-purple-700 outline-none"
              value={cell.value} onClick={e => e.stopPropagation()}
              onChange={e => updateValue(r, c, e.target.value)}
            >
              {COIN_VALUES.map(v => <option key={v} value={v} className="bg-gray-900">{v}</option>)}
            </select>
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
  }

  // ─── Render ────────────────────────────────────────────────────────────────
  return (
    <div className="rounded-2xl overflow-hidden" style={{ background: "#1e2235" }}>

      {/* Header */}
      <div
        className="flex justify-between items-center px-5 py-4 cursor-pointer select-none"
        onClick={() => setIsOpen(!isOpen)}
      >
        <div className="flex items-center gap-3">
          <span className="text-white font-bold text-base">⚡ Combination Feature</span>
          <div className="flex items-center gap-1">{titleStrip}</div>
        </div>
        <div className="flex items-center gap-3">
          <button
            onClick={e => { e.stopPropagation(); handleReset(); }}
            className="px-3 py-1 bg-gray-700 hover:bg-gray-600 rounded text-xs text-gray-300"
          >Reset All</button>
          <span className="text-gray-400 text-sm">{isOpen ? "▼" : "▶"}</span>
        </div>
      </div>

      {isOpen && (
        <div className="px-4 pb-5 flex flex-col gap-4">

          {/* Stats row */}
          <div className="flex gap-3 flex-wrap items-center">
            {hasWhl && (
              <span className="px-2.5 py-1 rounded-full text-xs font-semibold bg-red-950 text-red-300 border border-red-800">
                🔴 Red: {redCount}/{MAX_RED}
              </span>
            )}
            {isTwr && (
              <span className="px-2.5 py-1 rounded-full text-xs font-semibold border"
                style={{ background: "#1e3a8a", borderColor: "#3b82f6", color: "#93c5fd" }}>
                🔵 Blue: {blueCount}/{MAX_BLUE}
              </span>
            )}
            {/* Active zones — only unlocked anchors */}
            {hasZone && zones.length > 0 && (
              <div className="flex gap-1.5 flex-wrap">
                {zones.map((z, i) => (
                  <span key={z.id}
                    className="px-2 py-0.5 rounded-full text-[10px] font-semibold flex items-center gap-1"
                    style={{ background: "#5b21b6", border: "1px solid #7c3aed" }}>
                    🟣 Zone {i + 1}
                    {Array.from({ length: z.charges }).map((_, ci) =>
                      <span key={ci} className="text-green-400">🔋</span>
                    )}
                  </span>
                ))}
              </div>
            )}
            {isTwr && hint && (
              <span className="text-yellow-400 text-xs">
                {hint.coinsToNext} more coins → unlock {hint.label}
              </span>
            )}
          </div>

          {/* TOWER layout (with row labels) */}
          {isTwr && (
            <div className="flex flex-col gap-[2px]">
              {Array.from({ length: ROWS }, (_, r) => {
                const locked    = !isUnlocked(r);
                const isInitDiv = r === TWR_LOCKED;
                return (
                  <div key={r}>
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
                      <div className="w-9 shrink-0 text-right pr-1">
                        {locked ? (
                          <div className="flex flex-col items-end leading-tight">
                            <span className="text-red-500 text-[10px] font-bold">✕</span>
                            <span className="text-red-700 text-[8px]">{LOCKED_LABELS[r] ?? ""}</span>
                          </div>
                        ) : (
                          <span className="text-green-500 text-sm font-bold">✓</span>
                        )}
                      </div>
                      {/* 5 cells */}
                      <div className="grid flex-1 gap-[2px]"
                        style={{ gridTemplateColumns: `repeat(${COLS}, minmax(0,1fr))` }}>
                        {Array.from({ length: COLS }, (_, c) => renderCell(r, c))}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}

          {/* STANDARD 4×5 layout */}
          {!isTwr && (
            <div className="grid gap-1"
              style={{ gridTemplateColumns: `repeat(${COLS}, minmax(0,1fr))` }}>
              {Array.from({ length: ROWS }, (_, r) =>
                Array.from({ length: COLS }, (_, c) => renderCell(r, c))
              )}
            </div>
          )}

          {/* Spin controls */}
          <div className="flex items-center gap-4 flex-wrap">
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

          {/* Legend */}
          <div className="text-xs text-gray-500 flex gap-3 flex-wrap">
            <span>Click to cycle: 🟡 GOLD</span>
            {hasWhl  && <span>→ 🔴 RED</span>}
            {isTwr   && <span>→ 🔵 BLUE</span>}
            {hasZone && <span>→ 🟣 PURPLE {isTwr ? "(inactive in locked rows)" : "(zone anchor)"}</span>}
            <span>| ✕ remove</span>
          </div>

        </div>
      )}
    </div>
  );
}