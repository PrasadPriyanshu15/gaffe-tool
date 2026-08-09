




//! perfectt--------------------------------------
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
import {
  FeatureKey, CarriedCoin, UpgradeCoin, UpgradeColor,
  availableUpgradeTargets, UPGRADE_COLOR_TO_FEATURE,
} from "./combinationFeatureGenerator";
import UpgradePanel, { UP_COLOR_META } from "./UpgradePanel";

// ─── Props ─────────────────────────────────────────────────────────────────────
type Props = {
  baseCoins:               { position: number; value: string }[];
  onSpin:                  (line: string) => void;
  onReset:                 () => void;
  onUpgrade?:              (feature: FeatureKey, carried: CarriedCoin[]) => void;
  sharedSpentMultipliers?: string[];
  onMultiplierSpent?:      (val: string) => void;
};

// ─── Component ─────────────────────────────────────────────────────────────────
export default function WheelFeature({
  baseCoins, onSpin, onReset, onUpgrade,
  sharedSpentMultipliers, onMultiplierSpent,
}: Props) {
  const [isOpen,           setIsOpen]           = useState(true);
  const [grid,             setGrid]             = useState<WheelCell[][]>(() => seedFromBase(baseCoins));
  const [spinsLeft,        setSpinsLeft]        = useState(MAX_SPINS);
  const [redCoinIdx,       setRedCoinIdx]       = useState(0);     // next RED_COIN_SEQUENCE index
  const [spentMultipliers, setSpentMultipliers] = useState<string[]>([]);
  const [eReelPos,         setEReelPos]         = useState<EReelSetting | null>(null);
  const [upgradeCoin,      setUpgradeCoin]      = useState<UpgradeCoin | null>(null);
  const [armedColor,       setArmedColor]       = useState<UpgradeColor | null>(null);

  // Features that can still be added via an upgrade coin.
  const upgradeTargets = onUpgrade ? availableUpgradeTargets(["piggyWheel"]) : [];

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
    setUpgradeCoin(null);
    setArmedColor(null);
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
    // Placing an upgrade coin: only onto an EMPTY cell, only one at a time.
    if (armedColor) {
      if (grid[r][c].type === "EMPTY") {
        setUpgradeCoin({ pos: gridToPos(r, c), color: armedColor });
        setArmedColor(null);
      }
      return;
    }
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

  /** Snapshot every coin in global flat positions, to carry into an upgrade. */
  const buildCarried = (g: WheelCell[][]): CarriedCoin[] => {
    const out: CarriedCoin[] = [];
    g.forEach((row, r) => row.forEach((cell, c) => {
      if (cell.type === "EMPTY") return;
      const pos = gridToPos(r, c);
      if (cell.type === "RED") out.push({ pos, type: "RED", value: cell.value, multiplier: cell.multiplier });
      else                     out.push({ pos, type: cell.type, value: (cell as any).value });
    }));
    return out;
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
    onSpin(generateWheelGaffe(grid, prevSnap, eReelPos, redCoinIdx, ["piggyWheel"], upgradeCoin));

    // An upgrade coin landed this spin → carry the full grid forward and switch
    // to the upgraded combination view (the upgrade coin itself vanishes).
    if (upgradeCoin && onUpgrade) {
      onUpgrade(UPGRADE_COLOR_TO_FEATURE[upgradeCoin.color], buildCarried(grid));
      return;
    }

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
    setUpgradeCoin(null);
    setArmedColor(null);
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

          {/* ── Upgrade coin panel ── */}
          <UpgradePanel
            targets={upgradeTargets}
            upgradeCoin={upgradeCoin}
            armedColor={armedColor}
            onArm={setArmedColor}
            onCancelArm={() => setArmedColor(null)}
            onClearCoin={() => setUpgradeCoin(null)}
          />

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
                const isUpgrade = upgradeCoin?.pos === pos;
                const armable   = armedColor !== null && isEmpty && !isUpgrade;

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
                      items-center justify-center p-1.5 transition-all cursor-pointer ${borderCls}
                      ${isUpgrade ? "ring-2 ring-green-400" : ""}
                      ${armable ? "ring-2 ring-green-500/60 ring-dashed" : ""}`}
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

                    {/* Upgrade coin overlay */}
                    {isUpgrade && upgradeCoin && (
                      <div className="flex flex-col items-center gap-0.5 pointer-events-none">
                        <span className="text-lg leading-none">{UP_COLOR_META[upgradeCoin.color].dot}</span>
                        <span className="text-[8px] font-bold text-green-300 leading-none">UPGRADE</span>
                        <span className="text-[7px] text-green-500 leading-none">{UP_COLOR_META[upgradeCoin.color].label}</span>
                        <button
                          onClick={e => { e.stopPropagation(); setUpgradeCoin(null); }}
                          className="pointer-events-auto absolute top-1 right-1.5 text-[10px] text-red-400 hover:text-red-200 font-bold leading-none"
                        >✕</button>
                      </div>
                    )}

                    {/* ⚡ E-Reel button — shown on all cells until one is chosen */}
                    {eReelPos === null && !isUpgrade && (
                      <button
                        onClick={e => { e.stopPropagation(); handleSetEReelPos(r, c); }}
                        className="absolute bottom-0.5 left-1 text-[8px] text-yellow-700 hover:text-yellow-400 leading-none select-none"
                        title={`Set pos ${pos} as typeEReelPosition`}
                      >⚡E</button>
                    )}

                    {/* ── EMPTY ── */}
                    {isEmpty && !isUpgrade && (
                      <div className="flex flex-col items-center gap-0.5 pointer-events-none">
                        <span className="text-gray-600 text-[10px]">{armable ? "place here" : "+ Gold"}</span>
                        {!armable && redCount < MAX_RED_COINS && (
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




