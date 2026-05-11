// feature1/Feature1.tsx
// Thin orchestrator: owns no logic, no state — just wires useFeature1 to the view.
// To reuse in another game, copy this file + useFeature1.ts + its dependencies.

/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import type { Cell, MultiplierType, FeatureType } from "./features/featureTypes";
import { useFeature1 } from "./feature1/useFeature1";
import { ZoneBadges }   from "./feature1/components/ZoneBadges";
import { CoinCounters } from "./feature1/components/CoinCounters";
import { TowerStats }   from "./feature1/components/TowerStats";
import { GridDisplay }  from "./feature1/components/GridDisplay";
import { SpinButton }   from "./feature1/components/SpinButton";

// ─── Props ────────────────────────────────────────────────────────────────────

type Props = {
  features:            FeatureType[];
  baseScatPositions:   { row: number; col: number; color: "red" | "blue" | "purple" }[];
  setFeatureOutput:    React.Dispatch<React.SetStateAction<string[]>>;
};

// ─── Component ────────────────────────────────────────────────────────────────

export default function FeatureFinal({ features, baseScatPositions, setFeatureOutput }: Props) {
  const h = useFeature1({ features, baseScatPositions, setFeatureOutput });

  // ── Cell value change callbacks (simple setGrid mutations) ─────────────────
  // These live here rather than in the hook because they are pure view-driven
  // mutations with no business logic. The hook already exposes setGrid.

  const patchCell = (row: number, col: number, patch: Partial<Cell>) =>
    h.setGrid(prev => {
      const ng = prev.map(r => r.map(c => ({ ...c })));
      ng[row][col] = { ...ng[row][col], ...patch } as Cell;
      return ng;
    });

  const onGoldValueChange = (row: number, col: number, val: number) => {
    h.setGrid(prev => {
      const ng = prev.map(r => r.map(c => ({ ...c })));
      const cell = ng[row][col];
      if (cell.type === "GOLD") ng[row][col] = { ...cell, value: val };
      return ng;
    });
  };

  const onRedValueChange = (row: number, col: number, val: number) => {
    h.setGrid(prev => {
      const ng = prev.map(r => r.map(c => ({ ...c })));
      const cell = ng[row][col];
      if (cell.type === "RED") ng[row][col] = { ...cell, value: val };
      return ng;
    });
  };

  const onRedMultiplierChange = (row: number, col: number, val: MultiplierType) => {
    h.setGrid(prev => {
      const ng = prev.map(r => r.map(c => ({ ...c })));
      const cell = ng[row][col];
      if (cell.type !== "RED") return ng;
      const old = cell.multiplier;
      ng[row][col] = { ...cell, multiplier: val };
      h.setUsedMultipliers(p => {
        const updated = p.filter(m => m !== old);
        updated.push(val);
        return updated;
      });
      return ng;
    });
  };

  const onBlueValueChange = (row: number, col: number, val: number) => {
    h.setGrid(prev => {
      const ng = prev.map(r => r.map(c => ({ ...c })));
      const cell = ng[row][col];
      if (cell.type === "BLUE") ng[row][col] = { ...cell, value: val };
      return ng;
    });
  };

  const onPurpleValueChange = (row: number, col: number, val: number) => {
    h.setGrid(prev => {
      const ng = prev.map(r => r.map(c => ({ ...c })));
      const cell = ng[row][col];
      if (cell.type === "PURPLE") ng[row][col] = { ...cell, value: val };
      return ng;
    });
  };

  const onTriggerColorChange = (row: number, col: number, val: "BLUE" | "PURPLE" | "RED") => {
    h.setGrid(prev => {
      const ng = prev.map(r => r.map(c => ({ ...c })));
      // ng[row][col] = { type: "TRIGGER", triggerColor: val };
      ng[row][col] = { type: "TRIGGER" };
      return ng;
    });
  };

  // ── Cell sizing ────────────────────────────────────────────────────────────
  const CELL_H = h.isTower ? "h-10" : "h-16";
  const CELL_W = h.isTower ? "w-14" : "w-16";

  // ── JSX ────────────────────────────────────────────────────────────────────
  return (
    <div className="bg-gray-800 rounded-xl">

      {/* Collapsible header */}
      <div
        onClick={() => h.setIsOpen(!h.isOpen)}
        className="flex justify-between items-center p-4 cursor-pointer select-none"
      >
        <h2 className="font-semibold">{h.getTitle()}</h2>
        <span className="text-gray-400">{h.isOpen ? "▼" : "▶"}</span>
      </div>

      {h.isOpen && (
        <div className="p-6 pt-0">

          {/* Zone charge badges */}
          {h.isZone && <ZoneBadges zones={h.zones} />}

          {/* Coin usage counters */}
          <CoinCounters
            isWheel={h.isWheel}
            isTower={h.isTower}
            isZone={h.isZone}
            coinCounts={h.coinCounts}
          />

          {/* Tower progress stats */}
          <TowerStats
            isTower={h.isTower}
            grid={h.grid}
            unlockedCoins={h.unlockedCoins}
          />

          {/* Feature grid */}
          <GridDisplay
            grid={h.grid}
            isTower={h.isTower}
            isZone={h.isZone}
            ROWS={h.ROWS}
            COLS={h.COLS}
            unlockedRows={h.unlockedRows}
            unlockedCoins={h.unlockedCoins}
            isInZone={h.isInZone}
            isZoneAnchor={h.isZoneAnchor}
            getCharges={h.getCharges}
            usedMultipliers={h.usedMultipliers}
            availableTriggerColors={h.availableTriggerColors}
            MULTIPLIER_OPTIONS={h.MULTIPLIER_OPTIONS}
            CELL_W={CELL_W}
            CELL_H={CELL_H}
            onCellClick={h.handleCellClick}
            onGoldValueChange={onGoldValueChange}
            onRedValueChange={onRedValueChange}
            onRedMultiplierChange={onRedMultiplierChange}
            onBlueValueChange={onBlueValueChange}
            onPurpleValueChange={onPurpleValueChange}
            onTriggerColorChange={onTriggerColorChange}
          />

          {/* Spin / Upgrade button */}
          <SpinButton
            spins={h.spins}
            canUpgrade={h.canUpgrade}
            upgradeLabel={h.upgradeLabel}
            currentFeatures={h.currentFeatures}
            upgradeFeature={h.upgradeFeature}
            triggerCell={h.triggerCell}
            onSpin={h.handleSpin}
          />

        </div>
      )}
    </div>
  );
}