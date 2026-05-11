// feature1/useFeature1.ts
// Custom hook containing ALL state and event-handler logic for Feature1.
// The component (Feature1.tsx) just renders whatever this hook exposes.

import { useState } from "react";

import { runFeatures } from "../features/engine/featureEngine";
import { processZoneOnSpin } from "../features/zone/zoneLogic";
import {
  TOWER_TOTAL_ROWS, TOWER_BASE_ROWS, MAX_BLUE_COINS,
  computeUnlockProgress, isRowUnlocked, coinsNeededForRow,
  getTotalBlue, getNextUnlockInfo,
} from "../features/tower/towerLogic";
import {
  MAX_RED, MULTIPLIER_OPTIONS, wheelGoldNext, wheelRedNext, buildWheelResultLines,
} from "../features/handlers/wheelHandlers";
import { towerGoldNext, towerBlueNext, buildTowerResultLines } from "../features/handlers/towerHandlers";
import {
  zoneGoldNext, zoneRedNext, buildZoneResultLines,
  buildStandardBaseLines, buildTriggerLine,
} from "../features/handlers/zoneHandlers";
import type { Cell, MultiplierType, FeatureType } from "../features/featureTypes";

import { STD_ROWS, COLS, TRIGGER_COLOR_TO_FEATURE, emptyGrid } from "./feature1Constants";
import { useZoneManager } from "./useZoneManager";

// ─── Hook input types ─────────────────────────────────────────────────────────

type UseFeature1Props = {
  features: FeatureType[];
  baseScatPositions: { row: number; col: number; color: "red" | "blue" | "purple" }[];
  setFeatureOutput: React.Dispatch<React.SetStateAction<string[]>>;
};

// ─── Hook ─────────────────────────────────────────────────────────────────────

export function useFeature1({ features: initialFeatures, baseScatPositions, setFeatureOutput }: UseFeature1Props) {

  // ── Active feature set (can grow on upgrade) ────────────────────────────────
  const [currentFeatures, setCurrentFeatures] = useState<FeatureType[]>(initialFeatures);

  const isTower = currentFeatures.includes("TOWER");
  const isWheel = currentFeatures.includes("WHEEL");
  const isZone  = currentFeatures.includes("ZONE");
  const ROWS    = isTower ? TOWER_TOTAL_ROWS : STD_ROWS;

  // ── Core UI state ────────────────────────────────────────────────────────────
  const [isOpen,          setIsOpen]          = useState(true);
  const [hasUserModified, setHasUserModified] = useState(false);
  const [spins,           setSpins]           = useState(3);
  const [usedMultipliers, setUsedMultipliers] = useState<MultiplierType[]>([]);

  // ── Coin usage counters ──────────────────────────────────────────────────────
  // Only count a coin at the moment Spin is pressed (not while it is cycled to
  // TRIGGER). Coins persisting from the previous spin are NOT double-counted.
  const [coinCounts,    setCoinCounts]    = useState({ RED: 0, BLUE: 0, PURPLE: 0 });
  const [lastSpinCounts, setLastSpinCounts] = useState({ RED: 0, BLUE: 0, PURPLE: 0 });

  // ── Grid initialisation ──────────────────────────────────────────────────────
  const isColorAllowed = (f: FeatureType[], color: string) =>
    (f.includes("WHEEL") && color === "red")   ||
    (f.includes("TOWER") && color === "blue")  ||
    (f.includes("ZONE")  && color === "purple");

  const [grid, setGrid] = useState<Cell[][]>(() => {
    const initial = emptyGrid(isTower ? TOWER_TOTAL_ROWS : STD_ROWS);
    baseScatPositions.forEach(({ row, col, color }) => {
      if (row < initial.length && isColorAllowed(initialFeatures, color))
        initial[row][col] = { type: "GOLD" };
    });
    return initial;
  });

  // ── Zone manager ─────────────────────────────────────────────────────────────
  const zoneManager = useZoneManager(ROWS, COLS);

  // ── Tower unlock progress ────────────────────────────────────────────────────
  const { unlockedCoins, unlockedRows } = isTower
    ? computeUnlockProgress(grid)
    : { unlockedCoins: 0, unlockedRows: new Array(ROWS).fill(true) };

  // ── Derived grid helpers ─────────────────────────────────────────────────────
  const countRed    = (g: Cell[][]) => g.flat().filter(c => c.type === "RED").length;
  const hasTriggerF = (g: Cell[][]) => g.flat().some(c => c.type === "TRIGGER");

  // ── Upgrade metadata ─────────────────────────────────────────────────────────
  const triggerCell = grid.flat().find(c => c.type === "TRIGGER") as
    Extract<Cell, { type: "TRIGGER" }> | undefined;

  const triggerColor   = triggerCell?.triggerColor ?? null;
  const upgradeFeature = triggerColor ? TRIGGER_COLOR_TO_FEATURE[triggerColor] : null;
  const canUpgrade     = !!upgradeFeature
    && !currentFeatures.includes(upgradeFeature)
    && currentFeatures.length < 3;
  const upgradeLabel   = currentFeatures.length === 1 ? "SUPER" : "MEGA";

  /** Trigger color options: only those whose feature isn't already active. */
  const availableTriggerColors = (["RED", "BLUE", "PURPLE"] as const).filter(
    color => !currentFeatures.includes(TRIGGER_COLOR_TO_FEATURE[color])
  );

  // ── Title ────────────────────────────────────────────────────────────────────
  const getTitle = (): string => {
    if (currentFeatures.length === 1) return `${currentFeatures[0]} Feature`;
    if (currentFeatures.length === 2) return `SUPER (${currentFeatures.join(" + ")})`;
    return `MEGA (${currentFeatures.join(" + ")})`;
  };

  // ── Upgrade handler ──────────────────────────────────────────────────────────
  const handleUpgrade = () => {
    if (!upgradeFeature) return;

    const newFeatures = [...currentFeatures, upgradeFeature] as FeatureType[];
    const addingTower = upgradeFeature === "TOWER";

    // Remove the trigger coin from the grid
    let newGrid: Cell[][] = grid.map(r =>
      r.map(c => (c.type === "TRIGGER" ? ({ type: "EMPTY" } as Cell) : { ...c }))
    );

    // Expanding to TOWER: copy the existing 4-row grid into rows 0–3 of a 12-row grid
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

  // ── Cell click handler ───────────────────────────────────────────────────────
  const handleCellClick = (row: number, col: number) => {
    const current = grid[row][col];

    // While a trigger exists: only allow clicking the trigger itself (to cycle → EMPTY).
    if (triggerCell && current.type !== "TRIGGER") return;
    if (current.type === "GOLD" && current.locked) return;

    // Only mark modified for unlocked rows (locked-row placements don't reset spin counter)
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
        const { cell, addZone: doAdd } = towerGoldNext({
          row, grid: ng, unlockedRows, isWheel, isZone,
          redCount, triggerExists, maxRed: MAX_RED,
        });
        ng[row][col] = cell;
        setGrid(ng);
        if (doAdd) zoneManager.addZone(row, col);
      } else if (isWheel) {
        const cell = wheelGoldNext(ng);
        if (cell) { ng[row][col] = cell; setGrid(ng); }
      } else if (isZone) {
        ng[row][col] = zoneGoldNext();
        setGrid(ng);
        zoneManager.addZone(row, col);
      }
      return;
    }

    if (current.type === "BLUE") {
      const { cell, addZone: doAdd } = towerBlueNext({
        row, unlockedRows, isWheel, isZone, redCount, triggerExists, maxRed: MAX_RED,
      });
      ng[row][col] = cell;
      setGrid(ng);
      if (doAdd) zoneManager.addZone(row, col);
      return;
    }

    if (current.type === "RED") {
      if (isZone) {
        if (current.multiplier !== undefined)
          setUsedMultipliers(prev => prev.filter(m => m !== current.multiplier));
        ng[row][col] = zoneRedNext();
        setGrid(ng);
        zoneManager.addZone(row, col);
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
      zoneManager.removeAnchor(row, col);
      ng[row][col] = {
        type: "TRIGGER",
        // triggerColor: availableTriggerColors[0] ?? "BLUE",
      };
      setGrid(ng);
      return;
    }
  };

  // ── Result generation ────────────────────────────────────────────────────────
  const generateResult = (g: Cell[][]) => {
    const lines: string[] = [];
    const { hasTrigger, triggerLine } = buildTriggerLine(g);
    const flat = g.flat();

    if (isTower) {
      const { reelStopLine, goldCoinLine, blueCoinsLine } =
        buildTowerResultLines(g, ROWS, COLS);
      lines.push(reelStopLine, goldCoinLine);
      if (flat.some(c => c.type === "BLUE"))   lines.push(blueCoinsLine);
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

  // ── Spin / Upgrade handler ───────────────────────────────────────────────────
  const handleSpin = () => {
    const countColors = (g: Cell[][]) => ({
      RED:    g.flat().filter(c => c.type === "RED").length,
      BLUE:   g.flat().filter(c => c.type === "BLUE").length,
      PURPLE: g.flat().filter(c => c.type === "PURPLE").length,
    });

    if (canUpgrade) {
      generateResult(grid);  // capture result including the trigger coin
      handleUpgrade();
      return;
    }

    // Count NEW colored coins (delta vs last spin so persistent coins aren't double-counted)
    const current = countColors(grid);
    setCoinCounts(prev => ({
      RED:    prev.RED    + Math.max(0, current.RED    - lastSpinCounts.RED),
      BLUE:   prev.BLUE   + Math.max(0, current.BLUE   - lastSpinCounts.BLUE),
      PURPLE: prev.PURPLE + Math.max(0, current.PURPLE - lastSpinCounts.PURPLE),
    }));

    generateResult(grid);

    const { output } = runFeatures({ features: currentFeatures, grid });
    setFeatureOutput(prev => [...prev, ...output]);

    // Zone absorption
    let postGrid = grid;
    if (isZone && zoneManager.zones.length > 0) {
      const res = processZoneOnSpin(grid, zoneManager.zones);
      postGrid = res.grid;
      setGrid(postGrid);
      zoneManager.setZones(res.zones);
    }

    setLastSpinCounts(countColors(postGrid));

    const hasUnlockedCoins = isTower
      ? grid.some((row, i) => isRowUnlocked(unlockedRows, i) && row.some(c => c.type !== "EMPTY"))
      : grid.flat().some(c => c.type !== "EMPTY");

    setSpins(prev => (hasUserModified && hasUnlockedCoins) ? 3 : Math.max(prev - 1, 0));
    setHasUserModified(false);
  };

  // ── Re-exported constants and derived values for the view layer ───────────────
  return {
    // Features
    currentFeatures, isTower, isWheel, isZone, ROWS,
    // UI state
    isOpen, setIsOpen,
    spins,
    // Grid
    grid, setGrid,
    // Multipliers
    usedMultipliers, setUsedMultipliers,
    // Coin counters
    coinCounts,
    // Tower
    unlockedCoins, unlockedRows,
    // Upgrade
    triggerCell, triggerColor, upgradeFeature, canUpgrade, upgradeLabel,
    availableTriggerColors,
    // Zone manager (all zone helpers)
    ...zoneManager,
    // Handlers
    handleCellClick,
    handleSpin,
    getTitle,
    // Re-exported for use in sub-components
    MAX_BLUE_COINS,
    MAX_RED,
    MULTIPLIER_OPTIONS,
    COLS,
    // Tower logic helpers (for display)
    getTotalBlue,
    getNextUnlockInfo,
    isRowUnlocked,
    coinsNeededForRow,
  };
}