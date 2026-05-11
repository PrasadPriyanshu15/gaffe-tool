// feature1/components/CellContent.tsx
// Renders the inner content of a single feature grid cell.
// Receives only the data it needs — no grid state owned here.

"use client";

import type { Cell, MultiplierType } from "../../features/featureTypes";

type Props = {
  cell:                  Cell;
  row:                   number;
  col:                   number;
  charges:               number | null;           // from getCharges(row, col)
  usedMultipliers:       MultiplierType[];
  availableTriggerColors: readonly ("RED" | "BLUE" | "PURPLE")[];
  MULTIPLIER_OPTIONS:    MultiplierType[];
  onGoldValueChange:     (row: number, col: number, val: number) => void;
  onRedValueChange:      (row: number, col: number, val: number) => void;
  onRedMultiplierChange: (row: number, col: number, val: MultiplierType) => void;
  onBlueValueChange:     (row: number, col: number, val: number) => void;
  onPurpleValueChange:   (row: number, col: number, val: number) => void;
  onTriggerColorChange:  (row: number, col: number, val: "BLUE" | "PURPLE" | "RED") => void;
};

export default function CellContent({
  cell, row, col, charges,
  usedMultipliers, availableTriggerColors, MULTIPLIER_OPTIONS,
  onGoldValueChange, onRedValueChange, onRedMultiplierChange,
  onBlueValueChange, onPurpleValueChange, onTriggerColorChange,
}: Props) {
  const stop = (e: React.MouseEvent | React.ChangeEvent<HTMLSelectElement>) =>
    e.stopPropagation();

  return (
    <div className="flex flex-col items-center gap-0.5 w-full px-0.5">

      {/* Emoji icon */}
      <div className="text-sm leading-none">
        {cell.type === "GOLD"    && "🟡"}
        {cell.type === "RED"     && "🔴"}
        {cell.type === "BLUE"    && "🔵"}
        {cell.type === "PURPLE"  && "🟣"}
        {cell.type === "TRIGGER" && "⚡"}
      </div>

      {/* Charge indicator for PURPLE anchor cells */}
      {cell.type === "PURPLE" && charges !== null && (
        <div className="text-[9px] text-yellow-300 font-bold">{charges}🔋</div>
      )}

      {/* GOLD: value picker */}
      {cell.type === "GOLD" && (
        <select onClick={stop} value={cell.value ?? 100}
          onChange={e => { stop(e); onGoldValueChange(row, col, Number(e.target.value)); }}
          className="text-[10px] bg-gray-600 rounded w-full">
          <option value={100}>100</option>
          <option value={200}>200</option>
          <option value={500}>500</option>
          <option value={1000}>1000</option>
        </select>
      )}

      {/* RED: value + multiplier pickers */}
      {cell.type === "RED" && (
        <div className="flex flex-col gap-0.5 w-full">
          <select onClick={stop} value={cell.value ?? ""}
            onChange={e => { stop(e); onRedValueChange(row, col, Number(e.target.value)); }}
            className="text-[10px] bg-gray-600 rounded w-full">
            <option value="">Val</option>
            <option value={100}>100</option>
            <option value={500}>500</option>
            <option value={1000}>1000</option>
            <option value={2000}>2000</option>
          </select>
          <select onClick={stop} value={cell.multiplier ?? ""}
            onChange={e => {
              stop(e);
              const raw = e.target.value;
              const val: MultiplierType =
                raw === "MAJOR" || raw === "GRAND" ? raw : Number(raw);
              if (!usedMultipliers.includes(val))
                onRedMultiplierChange(row, col, val);
            }}
            className="text-[10px] bg-gray-600 rounded w-full">
            <option value="">Mult</option>
            {MULTIPLIER_OPTIONS.map(m => (
              <option key={m.toString()} value={m} disabled={usedMultipliers.includes(m)}>
                {typeof m === "number" ? `${m}x` : m}
              </option>
            ))}
          </select>
        </div>
      )}

      {/* BLUE: value picker */}
      {cell.type === "BLUE" && (
        <select onClick={stop} value={cell.value ?? 100}
          onChange={e => { stop(e); onBlueValueChange(row, col, Number(e.target.value)); }}
          className="text-[10px] bg-gray-600 rounded w-full">
          <option value={100}>100</option>
          <option value={200}>200</option>
          <option value={500}>500</option>
          <option value={1000}>1000</option>
        </select>
      )}

      {/* PURPLE: value picker */}
      {cell.type === "PURPLE" && (
        <select onClick={stop} value={cell.value ?? 100}
          onChange={e => { stop(e); onPurpleValueChange(row, col, Number(e.target.value)); }}
          className="text-[10px] bg-gray-600 rounded w-full">
          <option value={100}>100</option>
          <option value={200}>200</option>
          <option value={500}>500</option>
          <option value={1000}>1000</option>
        </select>
      )}

      {/* TRIGGER: color picker (only shows un-activated feature colors) */}
      {cell.type === "TRIGGER" && (
        <select onClick={stop}
          value={cell.triggerColor ?? availableTriggerColors[0] ?? "BLUE"}
          onChange={e => {
            stop(e);
            onTriggerColorChange(row, col, e.target.value as "BLUE" | "PURPLE" | "RED");
          }}
          className="text-[10px] bg-gray-600 rounded w-full">
          {availableTriggerColors.map(color => (
            <option key={color} value={color}>{color}</option>
          ))}
        </select>
      )}

    </div>
  );
}