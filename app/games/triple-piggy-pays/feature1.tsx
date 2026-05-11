
/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { runFeatures } from "@/games/triple-piggy-pays/features/engine/featureEngine";
import {
  Zone, getSingleZoneCells, getUnionCells, mergeAllTouchingZones, processZoneOnSpin,
} from "@/games/triple-piggy-pays/features/zone/zoneLogic";
import {
  TOWER_TOTAL_ROWS, TOWER_BASE_ROWS, MAX_BLUE_COINS,
  computeUnlockProgress, isRowUnlocked, coinsNeededForRow,
  getTotalBlue, getNextUnlockInfo,
} from "@/games/triple-piggy-pays/features/tower/towerLogic";
import {
  MAX_RED, MULTIPLIER_OPTIONS, wheelGoldNext, wheelRedNext, buildWheelResultLines,
} from "@/games/triple-piggy-pays/features/handlers/wheelHandlers";
import {
  towerGoldNext, towerBlueNext, buildTowerResultLines,
} from "@/games/triple-piggy-pays/features/handlers/towerHandlers";
import {
  zoneGoldNext, zoneRedNext, buildZoneResultLines,
  buildStandardBaseLines, buildTriggerLine,
} from "@/games/triple-piggy-pays/features/handlers/zoneHandlers";
import type { Cell, MultiplierType, FeatureType } from
  "@/games/triple-piggy-pays/features/featureTypes";
import { useState } from "react";

// ─── Types ────────────────────────────────────────────────────────────────────

type Props = {
  features: FeatureType[];
  baseScatPositions: { row: number; col: number; color: "red" | "blue" | "purple" }[];
  setFeatureOutput: React.Dispatch<React.SetStateAction<string[]>>;
};

// ─── Constants ────────────────────────────────────────────────────────────────

const STD_ROWS = 4;
const COLS     = 5;

/** Trigger coin color → feature that will be added on upgrade */
const TRIGGER_COLOR_TO_FEATURE: Record<string, FeatureType> = {
  RED:    "WHEEL",
  BLUE:   "TOWER",
  PURPLE: "ZONE",
};

// ─── Helpers ──────────────────────────────────────────────────────────────────

const emptyGrid = (rows: number): Cell[][] =>
  Array.from({ length: rows }, () =>
    Array.from({ length: COLS }, () => ({ type: "EMPTY" as const }))
  );

// ─── Component ────────────────────────────────────────────────────────────────

export default function Feature1({ features: initialFeatures, baseScatPositions, setFeatureOutput }: Props) {

  // ── Mutable feature set (grows on upgrade) ────────────────────────────────
  const [currentFeatures, setCurrentFeatures] = useState<FeatureType[]>(initialFeatures);

  const isTower = currentFeatures.includes("TOWER");
  const isWheel = currentFeatures.includes("WHEEL");
  const isZone  = currentFeatures.includes("ZONE");
  const ROWS    = isTower ? TOWER_TOTAL_ROWS : STD_ROWS;

  // ── State ──────────────────────────────────────────────────────────────────
  const [isOpen,          setIsOpen]          = useState(true);
  const [hasUserModified, setHasUserModified] = useState(false);
  const [spins,           setSpins]           = useState(3);
  const [zones,           setZones]           = useState<Zone[]>([]);
  const [usedMultipliers, setUsedMultipliers] = useState<MultiplierType[]>([]);

  // ── Colored coin usage counter ────────────────────────────────────────────
  // Counted at SPIN time: a coin only "counts" if it is still a colored coin
  // when Spin is pressed. Cycling gold→red→trigger never increments the count
  // because the position holds a TRIGGER (not a colored coin) at spin time.
  // Zone absorption after spin doesn't decrement because we snapshot pre-absorption.
  // Coins persisting across multiple spins count only once (delta logic).
  const [coinCounts,        setCoinCounts]        = useState({ RED: 0, BLUE: 0, PURPLE: 0 });
  // Snapshot of colored counts from the end of the last spin (post-absorption).
  // Used to compute the delta so persistent coins aren't double-counted.
  const [lastSpinCounts, setLastSpinCounts] = useState({ RED: 0, BLUE: 0, PURPLE: 0 });

  // ── Grid init ────────────────────────────────────────────────────────────
  const isColorAllowed = (f: FeatureType[], color: string) =>
    (f.includes("WHEEL") && color === "red") ||
    (f.includes("TOWER") && color === "blue") ||
    (f.includes("ZONE")  && color === "purple");

  const [grid, setGrid] = useState<Cell[][]>(() => {
    const initial = emptyGrid(isTower ? TOWER_TOTAL_ROWS : STD_ROWS);
    baseScatPositions.forEach(({ row, col, color }) => {
      if (row < initial.length && isColorAllowed(initialFeatures, color))
        initial[row][col] = { type: "GOLD" };
    });
    return initial;
  });

  // ── Tower unlock progress ─────────────────────────────────────────────────
  const { unlockedCoins, unlockedRows } = isTower
    ? computeUnlockProgress(grid)
    : { unlockedCoins: 0, unlockedRows: new Array(ROWS).fill(true) };

  // ── Derived helpers ───────────────────────────────────────────────────────
  const countRed    = (g: Cell[][]) => g.flat().filter(c => c.type === "RED").length;
  const hasTriggerF = (g: Cell[][]) => g.flat().some(c => c.type === "TRIGGER");

  // Zone display
  const isInZone     = (r: number, c: number) =>
    zones.some(z => z.cells.some(([zr, zc]) => zr === r && zc === c));
  const isZoneAnchor = (r: number, c: number) =>
    zones.some(z => z.anchors.some(([ar, ac]) => ar === r && ac === c));
  const getCharges   = (r: number, c: number): number | null =>
    zones.find(z => z.anchors.some(([ar, ac]) => ar === r && ac === c))?.charges ?? null;

  // ── Upgrade detection ─────────────────────────────────────────────────────
  // Find the trigger cell (at most one can exist on the grid at a time)
  const triggerCell = grid.flat().find(c => c.type === "TRIGGER") as
    Extract<Cell, { type: "TRIGGER" }> | undefined;
  const triggerColor   = triggerCell?.triggerColor ?? null;
  const upgradeFeature = triggerColor ? TRIGGER_COLOR_TO_FEATURE[triggerColor] : null;
  const canUpgrade     = !!upgradeFeature && !currentFeatures.includes(upgradeFeature)
                          && currentFeatures.length < 3;
  const upgradeLabel   = currentFeatures.length === 1 ? "SUPER" : "MEGA";

  // Available trigger color options for the TRIGGER cell dropdown:
  // only show colors whose feature is NOT yet in currentFeatures.
  const availableTriggerColors = (["RED", "BLUE", "PURPLE"] as const).filter(
    color => !currentFeatures.includes(TRIGGER_COLOR_TO_FEATURE[color])
  );

  // ── Title ─────────────────────────────────────────────────────────────────
  const getTitle = () => {
    if (currentFeatures.length === 1) return `${currentFeatures[0]} Feature`;
    if (currentFeatures.length === 2) return `SUPER (${currentFeatures.join(" + ")})`;
    return `MEGA (${currentFeatures.join(" + ")})`;
  };

  // ── Zone creation helper ──────────────────────────────────────────────────
  const addZone = (row: number, col: number) => {
    const newZone: Zone = {
      id: `zone-1`,
      anchors: [[row, col]],
      cells: getSingleZoneCells(row, col, ROWS, COLS),
      charges: 3,
    };
    setZones(prev => mergeAllTouchingZones([...prev, newZone], ROWS, COLS));
  };

  // ── Upgrade handler ───────────────────────────────────────────────────────
  const handleUpgrade = () => {
    if (!upgradeFeature) return;

    const newFeatures = [...currentFeatures, upgradeFeature] as FeatureType[];
    const addingTower = upgradeFeature === "TOWER";

    // Remove trigger coin from grid
    let newGrid: Cell[][] = grid.map(r =>
      r.map(c => (c.type === "TRIGGER" ? ({ type: "EMPTY" } as Cell) : { ...c }))
    );

    // Expanding to TOWER: copy existing 4-row grid into rows 0–3 of a 12-row grid
    if (addingTower) {
      const expanded = emptyGrid(TOWER_TOTAL_ROWS);
      for (let r = 0; r < STD_ROWS; r++) expanded[r] = newGrid[r];
      newGrid = expanded;
    }

    setCurrentFeatures(newFeatures);
    setGrid(newGrid);
    setSpins(3);
    setHasUserModified(false);
  };

  // ── Cell click ────────────────────────────────────────────────────────────
  const handleCellClick = (row: number, col: number) => {
    const current = grid[row][col];

    // While a trigger exists: ONLY allow clicking the trigger cell itself to cycle it → EMPTY.
    // All other cells are locked until the trigger is resolved (upgrade or removed).
    if (triggerCell && current.type !== "TRIGGER") return;

    if (current.type === "GOLD" && current.locked) return;

    // FIX: only mark modified for UNLOCKED rows (locked row coins don't reset spin counter)
    const rowUnlocked = !isTower || isRowUnlocked(unlockedRows, row);
    if (rowUnlocked) setHasUserModified(true);

    const ng            = grid.map(r => r.map(c => ({ ...c })));
    const triggerExists = hasTriggerF(ng);
    const redCount      = countRed(ng);

    if (current.type === "EMPTY") {
      ng[row][col] = { type: "GOLD" };
      setGrid(ng);
      return;
    }

    if (current.type === "TRIGGER") {
      ng[row][col] = { type: "EMPTY" };
      setGrid(ng);
      return;
    }

    if (current.type === "GOLD") {
      if (isTower) {
        const { cell, addZone: doAddZone } = towerGoldNext({
          row, grid: ng, unlockedRows, isWheel, isZone,
          redCount, triggerExists, maxRed: MAX_RED,
        });
        ng[row][col] = cell;
        setGrid(ng);
        if (doAddZone) addZone(row, col);
      } else if (isWheel) {
        const cell = wheelGoldNext(ng);
        if (cell) { ng[row][col] = cell; setGrid(ng); }
      } else if (isZone) {
        ng[row][col] = zoneGoldNext();
        setGrid(ng);
        addZone(row, col);
      }
      return;
    }

    if (current.type === "BLUE") {
      const { cell, addZone: doAddZone } = towerBlueNext({
        row, unlockedRows, isWheel, isZone, redCount, triggerExists, maxRed: MAX_RED,
      });
      ng[row][col] = cell;
      setGrid(ng);
      if (doAddZone) addZone(row, col);
      return;
    }

    if (current.type === "RED") {
      if (isZone) {
        if (current.multiplier !== undefined)
          setUsedMultipliers(prev => prev.filter(m => m !== current.multiplier));
        ng[row][col] = zoneRedNext();
        setGrid(ng);
        addZone(row, col);
      } else {
        const { cell, freedMultiplier } = wheelRedNext(current, triggerExists);
        ng[row][col] = cell;
        setGrid(ng);
        if (freedMultiplier !== undefined)
          setUsedMultipliers(prev => prev.filter(m => m !== freedMultiplier));
      }
      return;
    }

    if (current.type === "PURPLE") {
      setZones(prev =>
        prev.map(zone => {
          if (!zone.anchors.some(([ar, ac]) => ar === row && ac === col)) return zone;
          const rem = zone.anchors.filter(([ar, ac]) => !(ar === row && ac === col));
          if (rem.length === 0) return null as any;
          return { ...zone, anchors: rem, cells: getUnionCells(rem, ROWS, COLS) };
        }).filter(Boolean) as Zone[]
      );
      // ng[row][col] = { type: "TRIGGER", triggerColor: availableTriggerColors[0] ?? "BLUE" };
      ng[row][col] = { type: "TRIGGER"};
      setGrid(ng);
      return;
    }
  };

  // ── Result generation ─────────────────────────────────────────────────────
  const generateResult = (g: Cell[][]) => {
    const lines: string[] = [];
    const { hasTrigger, triggerLine } = buildTriggerLine(g);
    const flat = g.flat();

    if (isTower) {
      // TOWER always uses position-remapped indexing for reelStop and coordinates
      const { reelStopLine, goldCoinLine, blueCoinsLine } =
        buildTowerResultLines(g, ROWS, COLS);
      lines.push(reelStopLine, goldCoinLine);
      if (flat.some(c => c.type === "BLUE"))   lines.push(blueCoinsLine);
      // TOWER combos: also include RED and PURPLE if those features are active
      if (isWheel && flat.some(c => c.type === "RED"))
        lines.push(...buildWheelResultLines(g));
      if (isZone && flat.some(c => c.type === "PURPLE"))
        lines.push(...buildZoneResultLines(g));
    } else {
      const { reelStopLine, goldCoinLine } = buildStandardBaseLines(g, ROWS, COLS);
      lines.push(reelStopLine, goldCoinLine);
      if (isWheel && flat.some(c => c.type === "RED"))
        lines.push(...buildWheelResultLines(g));
      if (isZone && flat.some(c => c.type === "PURPLE"))
        lines.push(...buildZoneResultLines(g));
    }

    lines.push(`additionalFeatureTriggered:${hasTrigger}`);
    if (hasTrigger) lines.push(triggerLine);

    setFeatureOutput(prev => [...prev, `\n[${lines.join(",\n")}\n]`]);
  };

  // ── Spin / Upgrade (same button) ─────────────────────────────────────────
  const handleSpin = () => {
    // Helper: count colored coins in a grid snapshot
    const countColors = (g: Cell[][]) => ({
      RED:    g.flat().filter(c => c.type === "RED").length,
      BLUE:   g.flat().filter(c => c.type === "BLUE").length,
      PURPLE: g.flat().filter(c => c.type === "PURPLE").length,
      TRIGGERCOIN : g.flat().filter(c => c.type === "TRIGGER").length,     //! added for triggerin coin (1)
    });

    if (canUpgrade) {
      generateResult(grid);   // result includes trigger coin
      handleUpgrade();        // removes trigger, expands grid, resets spins
      return;
    }

    // ── Coin counter: tally NEW colored coins visible at this spin ────────
    // Delta = current count − last-spin count (clamped to 0).
    // Coins that survived from a previous spin don't count again.
    // Coins cycled to TRIGGER before spin are not colored → delta stays 0.
    const current = countColors(grid);
    setCoinCounts(prev => ({
      RED:    prev.RED    + Math.max(0, current.RED    - lastSpinCounts.RED),
      BLUE:   prev.BLUE   + Math.max(0, current.BLUE   - lastSpinCounts.BLUE),
      PURPLE: prev.PURPLE + Math.max(0, current.PURPLE - lastSpinCounts.PURPLE),
    }));

    generateResult(grid);

    const { output } = runFeatures({ features: currentFeatures, grid });
    setFeatureOutput(prev => [...prev, ...output]);

    let postGrid = grid;
    if (isZone && zones.length > 0) {
      const res = processZoneOnSpin(grid, zones);
      postGrid = res.grid;
      setGrid(postGrid);
      setZones(res.zones);
    }

    // ── Update last-spin snapshot to post-absorption grid ─────────────────
    // This ensures zone-absorbed coins are "forgotten" so if a fresh coin lands
    // at the same position next spin it gets counted again correctly.
    setLastSpinCounts(countColors(postGrid));

    // Only count UNLOCKED row coins for spin reset eligibility
    const hasUnlockedCoins = isTower
      ? grid.some((row, i) => isRowUnlocked(unlockedRows, i) && row.some(c => c.type !== "EMPTY"))
      : grid.flat().some(c => c.type !== "EMPTY");

    setSpins(prev => (hasUserModified && hasUnlockedCoins) ? 3 : Math.max(prev - 1, 0));
    setHasUserModified(false);
  };

  // ── Render helpers ────────────────────────────────────────────────────────
  const CELL_H = isTower ? "h-10" : "h-16";
  const CELL_W = isTower ? "w-14" : "w-16";

  const renderCellContent = (cell: Cell, i: number, j: number) => {
    const charges = getCharges(i, j);
    return (
      <div className="flex flex-col items-center gap-0.5 w-full px-0.5">

        <div className="text-sm leading-none">
          {cell.type === "GOLD"    && "🟡"}
          {cell.type === "RED"     && "🔴"}
          {cell.type === "BLUE"    && "🔵"}
          {cell.type === "PURPLE"  && "🟣"}
          {cell.type === "TRIGGER" && "⚡"}
        </div>

        {cell.type === "PURPLE" && charges !== null && (
          <div className="text-[9px] text-yellow-300 font-bold">{charges}🔋</div>
        )}

        {cell.type === "GOLD" && (
          <select onClick={e => e.stopPropagation()} value={cell.value ?? 100}
            onChange={e => {
              e.stopPropagation();
              const val = Number(e.target.value);
              setGrid(prev => { const ng = prev.map(r => r.map(c => ({...c}))); ng[i][j] = { type: "GOLD", value: val, locked: cell.locked }; return ng; });
            }} className="text-[10px] bg-gray-600 rounded w-full">
            <option value={100}>100</option><option value={200}>200</option>
            <option value={500}>500</option><option value={1000}>1000</option>
          </select>
        )}

        {cell.type === "RED" && (
          <div className="flex flex-col gap-0.5 w-full">
            <select onClick={e => e.stopPropagation()} value={cell.value ?? ""}
              onChange={e => {
                e.stopPropagation();
                const val = Number(e.target.value);
                setGrid(prev => { const ng = prev.map(r => r.map(c => ({...c}))); ng[i][j] = { type: "RED", value: val, multiplier: cell.multiplier }; return ng; });
              }} className="text-[10px] bg-gray-600 rounded w-full">
              <option value="">Val</option><option value={100}>100</option>
              <option value={500}>500</option><option value={1000}>1000</option>
              <option value={2000}>2000</option>
            </select>
            <select onClick={e => e.stopPropagation()} value={cell.multiplier ?? ""}
              onChange={e => {
                e.stopPropagation();
                const raw = e.target.value;
                const val: MultiplierType = raw === "MAJOR" || raw === "GRAND" ? raw : Number(raw);
                if (usedMultipliers.includes(val)) return;
                setGrid(prev => {
                  const ng = prev.map(r => r.map(c => ({...c})));
                  let old: MultiplierType | undefined;
                  if (ng[i][j].type === "RED") old = ng[i][j].multiplier;
                  ng[i][j] = { type: "RED", multiplier: val, value: cell.value };
                  setUsedMultipliers(p => { const u = [...p].filter(m => m !== old); u.push(val); return u; });
                  return ng;
                });
              }} className="text-[10px] bg-gray-600 rounded w-full">
              <option value="">Mult</option>
              {MULTIPLIER_OPTIONS.map(m => (
                <option key={m.toString()} value={m} disabled={usedMultipliers.includes(m)}>
                  {typeof m === "number" ? `${m}x` : m}
                </option>
              ))}
            </select>
          </div>
        )}

        {cell.type === "BLUE" && (
          <select onClick={e => e.stopPropagation()} value={cell.value ?? 100}
            onChange={e => {
              e.stopPropagation();
              const val = Number(e.target.value);
              setGrid(prev => { const ng = prev.map(r => r.map(c => ({...c}))); ng[i][j] = { type: "BLUE", value: val }; return ng; });
            }} className="text-[10px] bg-gray-600 rounded w-full">
            <option value={100}>100</option><option value={200}>200</option>
            <option value={500}>500</option><option value={1000}>1000</option>
          </select>
        )}

        {cell.type === "PURPLE" && (
          <select onClick={e => e.stopPropagation()} value={cell.value ?? 100}
            onChange={e => {
              e.stopPropagation();
              const val = Number(e.target.value);
              setGrid(prev => { const ng = prev.map(r => r.map(c => ({...c}))); ng[i][j] = { type: "PURPLE", value: val }; return ng; });
            }} className="text-[10px] bg-gray-600 rounded w-full">
            <option value={100}>100</option><option value={200}>200</option>
            <option value={500}>500</option><option value={1000}>1000</option>
          </select>
        )}

        {/* TRIGGER: only show colors whose feature is not yet active */}
        {cell.type === "TRIGGER" && (
          <select onClick={e => e.stopPropagation()} value={cell.triggerColor ?? availableTriggerColors[0] ?? "BLUE"}
            onChange={e => {
              const val = e.target.value as "BLUE" | "PURPLE" | "RED";
              // setGrid(prev => { const ng = prev.map(r => r.map(c => ({...c}))); ng[i][j] = { type: "TRIGGER", triggerColor: val }; return ng; });
              setGrid(prev => { const ng = prev.map(r => r.map(c => ({...c}))); ng[i][j] = { type: "TRIGGER"}; return ng; });
            }} className="text-[10px] bg-gray-600 rounded w-full">
            {availableTriggerColors.map(color => (
              <option key={color} value={color}>{color}</option>
            ))}
          </select>
        )}

      </div>
    );
  };

  // ── JSX ───────────────────────────────────────────────────────────────────
  return (
    <div className="bg-gray-800 rounded-xl">

      {/* Header */}
      <div onClick={() => setIsOpen(!isOpen)}
        className="flex justify-between items-center p-4 cursor-pointer select-none">
        <h2 className="font-semibold">{getTitle()}</h2>
        <span className="text-gray-400">{isOpen ? "▼" : "▶"}</span>
      </div>

      {isOpen && (
        <div className="p-6 pt-0">

          {/* Zone badges */}
          {isZone && zones.length > 0 && (
            <div className="mb-3 flex flex-wrap gap-2">
              {zones.map((zone, idx) => (
                <div key={zone.id}
                  className="flex items-center gap-1 bg-purple-900/60 border border-purple-500/40 text-purple-200 text-xs px-2 py-1 rounded">
                  <span>🟣 Zone {idx + 1}</span>
                  <span className="text-yellow-300 font-bold">{"🔋".repeat(zone.charges)}</span>
                  {zone.anchors.length > 1 && <span className="text-purple-400">({zone.anchors.length} anchors)</span>}
                </div>
              ))}
            </div>
          )}

          {/* Colored coin usage counter (only show relevant colors) */}
          {(isWheel || isTower || isZone) && (
            <div className="mb-3 flex gap-3 text-xs">
              {isWheel && (
                <span className="bg-red-900/40 border border-red-500/40 text-red-300 px-2 py-1 rounded">
                  🔴 Red used: {coinCounts.RED}
                </span>
              )}
              {isTower && (
                <span className="bg-blue-900/40 border border-blue-500/40 text-blue-300 px-2 py-1 rounded">
                  🔵 Blue used: {coinCounts.BLUE}
                </span>
              )}
              {isZone && (
                <span className="bg-purple-900/40 border border-purple-500/40 text-purple-300 px-2 py-1 rounded">
                  🟣 Purple used: {coinCounts.PURPLE}
                </span>
              )}
            </div>
          )}

          {/* Tower stats */}
          {isTower && (
            <div className="mb-3 flex flex-wrap gap-4 text-xs text-gray-300">
              <span>🔵 Blue: {getTotalBlue(grid)} / {MAX_BLUE_COINS}</span>
              <span>🟡 Unlocked coins: {unlockedCoins}</span>
              <span className="text-yellow-400">{getNextUnlockInfo(unlockedCoins)}</span>
            </div>
          )}

          {/* Spin / Upgrade button — label and behaviour change based on state */}
          <div className="flex flex-col gap-1">
            {Array.from({ length: ROWS }, (_, displayIdx) => {
              const towerLockedCount = TOWER_TOTAL_ROWS - TOWER_BASE_ROWS; // 8
              const rowIdx = !isTower
                ? displayIdx
                : displayIdx < towerLockedCount
                  ? (ROWS - 1 - displayIdx)       // locked section: bottom-to-top
                  : (displayIdx - towerLockedCount); // base section: top-to-bottom
              const rowLocked = isTower && !isRowUnlocked(unlockedRows, rowIdx);
              const needed    = coinsNeededForRow(rowIdx, unlockedCoins);
              const isSep     = isTower && displayIdx === towerLockedCount;

              return (
                <div key={rowIdx}>
                  {isSep && (
                    <div className="flex items-center gap-2 my-1">
                      <div className="w-9 shrink-0" />
                      <div className="flex-1 border-t-2 border-yellow-500/50" />
                      <span className="text-yellow-500/80 text-[10px] whitespace-nowrap">initial game (4×5) ↓</span>
                      <div className="flex-1 border-t-2 border-yellow-500/50" />
                    </div>
                  )}
                  <div className="flex items-center gap-1">
                    {isTower && (
                      <div className="w-9 shrink-0 flex flex-col items-center justify-center">
                        {!rowLocked
                          ? <span className="text-green-400 text-sm font-bold">✓</span>
                          : <><span className="text-red-500 text-xs font-bold leading-none">✗</span>
                             <span className="text-red-400 text-[9px] leading-tight">-{needed}</span></>
                        }
                      </div>
                    )}
                    {grid[rowIdx].map((cell, j) => {
                      const inZone   = isZone && isInZone(rowIdx, j);
                      const isAnchor = isZone && isZoneAnchor(rowIdx, j);
                      let bg = "bg-gray-700";
                      if (rowLocked)   bg = "bg-gray-900/60 border border-gray-600/50";
                      if (isAnchor)    bg = "bg-purple-800/70 border-2 border-purple-400";
                      else if (inZone) bg = "bg-purple-950/60 border border-purple-500/40";
                      return (
                        <div key={`${rowIdx}-${j}`} onClick={() => handleCellClick(rowIdx, j)}
                          className={`${CELL_W} ${CELL_H} flex items-center justify-center cursor-pointer rounded transition-colors ${bg}`}>
                          {renderCellContent(cell, rowIdx, j)}
                        </div>
                      );
                    })}
                  </div>
                </div>
              );
            })}
          </div>

          {/* Spin / Upgrade button */}
          <div className="mt-4 flex items-center gap-4">
            <button
              onClick={handleSpin}
              disabled={spins === 0 && !canUpgrade}
              className={`px-4 py-2 rounded font-medium transition-colors ${
                spins === 0 && !canUpgrade
                  ? "bg-gray-500 cursor-not-allowed opacity-60"
                  : canUpgrade
                    ? "bg-yellow-500 hover:bg-yellow-400 text-black"
                    : "bg-green-600 hover:bg-green-500"
              }`}
            >
              {canUpgrade
                ? `↑ Go to ${upgradeLabel} (${currentFeatures.join("+")}+${upgradeFeature})`
                : "Spin"}
            </button>
            {!canUpgrade && <div className="text-sm text-gray-300">Spins Left: {spins}</div>}
            {triggerCell && !canUpgrade && (
              <div className="text-xs text-orange-400">
                ⚡ 
              </div>
            )}
          </div>

        </div>
      )}
    </div>
  );
}