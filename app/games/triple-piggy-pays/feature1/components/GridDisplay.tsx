// feature1/components/GridDisplay.tsx
// Renders all rows of the feature grid.
// Handles TOWER-specific locked-row display, separator, and zone highlighting.
// All cell interactions are delegated back to Feature1 via onCellClick / onXxxChange.

"use client";

import { TOWER_TOTAL_ROWS, TOWER_BASE_ROWS, isRowUnlocked, coinsNeededForRow } from "../../features/tower/towerLogic";
import type { Cell, MultiplierType, FeatureType } from "../../features/featureTypes";
import CellContent from "./CellContent";

type GridDisplayProps = {
  grid:                   Cell[][];
  isTower:                boolean;
  isZone:                 boolean;
  ROWS:                   number;
  COLS:                   number;
  unlockedRows:           boolean[];
  unlockedCoins:          number;
  isInZone:               (r: number, c: number) => boolean;
  isZoneAnchor:           (r: number, c: number) => boolean;
  getCharges:             (r: number, c: number) => number | null;
  usedMultipliers:        MultiplierType[];
  availableTriggerColors: readonly ("RED" | "BLUE" | "PURPLE")[];
  MULTIPLIER_OPTIONS:     MultiplierType[];
  CELL_W:                 string;
  CELL_H:                 string;
  onCellClick:            (row: number, col: number) => void;
  onGoldValueChange:      (row: number, col: number, val: number) => void;
  onRedValueChange:       (row: number, col: number, val: number) => void;
  onRedMultiplierChange:  (row: number, col: number, val: MultiplierType) => void;
  onBlueValueChange:      (row: number, col: number, val: number) => void;
  onPurpleValueChange:    (row: number, col: number, val: number) => void;
  onTriggerColorChange:   (row: number, col: number, val: "BLUE" | "PURPLE" | "RED") => void;
};

export function GridDisplay({
  grid, isTower, isZone, ROWS, COLS,
  unlockedRows, unlockedCoins,
  isInZone, isZoneAnchor, getCharges,
  usedMultipliers, availableTriggerColors, MULTIPLIER_OPTIONS,
  CELL_W, CELL_H,
  onCellClick,
  onGoldValueChange, onRedValueChange, onRedMultiplierChange,
  onBlueValueChange, onPurpleValueChange, onTriggerColorChange,
}: GridDisplayProps) {
  const towerLockedCount = TOWER_TOTAL_ROWS - TOWER_BASE_ROWS; // 8

  return (
    <div className="flex flex-col gap-1">
      {Array.from({ length: ROWS }, (_, displayIdx) => {
        // Map display index → actual grid row index
        // Tower: locked rows first (reversed), then base rows
        const rowIdx = !isTower
          ? displayIdx
          : displayIdx < towerLockedCount
            ? (ROWS - 1 - displayIdx)           // locked rows: top of screen
            : (displayIdx - towerLockedCount);  // base rows: bottom of screen

        const rowLocked = isTower && !isRowUnlocked(unlockedRows, rowIdx);
        const needed    = coinsNeededForRow(rowIdx, unlockedCoins);
        const isSep     = isTower && displayIdx === towerLockedCount;

        return (
          <div key={rowIdx}>

            {/* Separator between locked and base rows */}
            {isSep && (
              <div className="flex items-center gap-2 my-1">
                <div className="w-9 shrink-0" />
                <div className="flex-1 border-t-2 border-yellow-500/50" />
                <span className="text-yellow-500/80 text-[10px] whitespace-nowrap">
                  initial game (4×5) ↓
                </span>
                <div className="flex-1 border-t-2 border-yellow-500/50" />
              </div>
            )}

            <div className="flex items-center gap-1">

              {/* Lock / unlock indicator */}
              {isTower && (
                <div className="w-9 shrink-0 flex flex-col items-center justify-center">
                  {!rowLocked
                    ? <span className="text-green-400 text-sm font-bold">✓</span>
                    : <>
                        <span className="text-red-500 text-xs font-bold leading-none">✗</span>
                        <span className="text-red-400 text-[9px] leading-tight">-{needed}</span>
                      </>
                  }
                </div>
              )}

              {/* Cells */}
              {grid[rowIdx].map((cell, j) => {
                const inZone   = isZone && isInZone(rowIdx, j);
                const isAnchor = isZone && isZoneAnchor(rowIdx, j);
                let bg = "bg-gray-700";
                if (rowLocked)   bg = "bg-gray-900/60 border border-gray-600/50";
                if (isAnchor)    bg = "bg-purple-800/70 border-2 border-purple-400";
                else if (inZone) bg = "bg-purple-950/60 border border-purple-500/40";

                return (
                  <div
                    key={`${rowIdx}-${j}`}
                    onClick={() => onCellClick(rowIdx, j)}
                    className={`${CELL_W} ${CELL_H} flex items-center justify-center cursor-pointer rounded transition-colors ${bg}`}
                  >
                    <CellContent
                      cell={cell}
                      row={rowIdx}
                      col={j}
                      charges={getCharges(rowIdx, j)}
                      usedMultipliers={usedMultipliers}
                      availableTriggerColors={availableTriggerColors}
                      MULTIPLIER_OPTIONS={MULTIPLIER_OPTIONS}
                      onGoldValueChange={onGoldValueChange}
                      onRedValueChange={onRedValueChange}
                      onRedMultiplierChange={onRedMultiplierChange}
                      onBlueValueChange={onBlueValueChange}
                      onPurpleValueChange={onPurpleValueChange}
                      onTriggerColorChange={onTriggerColorChange}
                    />
                  </div>
                );
              })}
            </div>
          </div>
        );
      })}
    </div>
  );
}