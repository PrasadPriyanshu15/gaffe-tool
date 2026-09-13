
/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { useState } from "react";
import ReelColumn, { ScatType, ScatKey } from "./ReelColumn";
import { reels } from "./reels";
import ReelstripUploader from "@/components/ReelstripUploader";
import { visibleCells } from "@/lib/reelGrid";

// ─── Types ────────────────────────────────────────────────────────────────────

type Props = {
  reelStops:           number[];
  setReelStops:        (val: number[]) => void;
  scatColors:          { [key: string]: ScatType };
  setScatColors:       (val: any) => void;
  scatValues:          { [key: string]: string };
  setScatValues:       (val: any) => void;
  stackSymbol:         string | null;
  setStackSymbol:      (val: string | null) => void;
  featureEnabled:      boolean;
  setFeatureEnabled:   (val: boolean) => void;
  grandEnabled:        boolean;
  setGrandEnabled:     (val: boolean) => void;
  majorEnabled:        boolean;
  setMajorEnabled:     (val: boolean) => void;
  selectedFeatures:    string[];
  setSelectedFeatures: (val: string[]) => void;
  onGoTo:              (features: string[]) => void;
  onUploadReels?:      (reels: string[][]) => void;
  rows:                number;
  setRows:             (val: number) => void;
  offset:              number;
  setOffset:           (val: number) => void;
};

// ─── Constants ────────────────────────────────────────────────────────────────

/** Symbols available as STACK resolution targets */
const STACK_SYMBOLS = [
  "PIC1","PIC2","PIC3","PIC4","PIC5","ACE","KING","QUEEN","JACK","TEN","NINE",
];

const FEATURE_META: Record<ScatKey, {
  label: string;
  activeBtn: string;
  inactiveBtn: string;
  badge: string;
}> = {
  piggyZone:  {
    label:       "ZONE",
    activeBtn:   "bg-purple-600 border-purple-400 text-white",
    inactiveBtn: "bg-transparent border-gray-500 text-gray-300 hover:border-gray-300",
    badge:       "bg-purple-900 text-purple-200 border border-purple-500",
  },
  piggyTower: {
    label:       "TOWER",
    activeBtn:   "bg-blue-700 border-blue-400 text-white",
    inactiveBtn: "bg-transparent border-gray-500 text-gray-300 hover:border-gray-300",
    badge:       "bg-blue-900 text-blue-200 border border-blue-500",
  },
  piggyWheel: {
    label:       "WHEEL",
    activeBtn:   "bg-red-700 border-red-400 text-white",
    inactiveBtn: "bg-transparent border-gray-500 text-gray-300 hover:border-gray-300",
    badge:       "bg-red-900 text-red-200 border border-red-500",
  },
};

// ─── Component ────────────────────────────────────────────────────────────────

export default function BaseGame({
  reelStops,          setReelStops,
  scatColors,         setScatColors,
  scatValues,         setScatValues,
  stackSymbol,        setStackSymbol,
  featureEnabled,     setFeatureEnabled,
  grandEnabled,       setGrandEnabled,
  majorEnabled,       setMajorEnabled,
  selectedFeatures,   setSelectedFeatures,
  onGoTo,
  onUploadReels,
  rows,               setRows,
  offset,             setOffset,
}: Props) {
  const [isOpen, setIsOpen] = useState(true);

  // Collect features visible via assigned SCAT colours (over the dynamic grid)
  const visibleFeatures = new Set<ScatKey>();
  reels.forEach((reel, reelIndex) => {
    visibleCells(reel, reelStops[reelIndex] ?? 0, offset, rows).forEach((cell) => {
      if (cell.symbol === "SCAT" && cell.stripIndex !== null) {
        const scat = scatColors[`${reelIndex}-${cell.stripIndex}`];
        if (scat) visibleFeatures.add(scat.key);
      }
    });
  });

  const toggleFeature = (f: ScatKey) => {
    if (selectedFeatures.includes(f))
      setSelectedFeatures(selectedFeatures.filter((x) => x !== f));
    else
      setSelectedFeatures([...selectedFeatures, f]);
  };

  return (
    <div className="rounded-2xl overflow-hidden" style={{ background: "#1e2235" }}>

      {/* ── Header ── */}
      <div
        className="flex justify-between items-center px-5 py-4 cursor-pointer select-none"
        onClick={() => setIsOpen(!isOpen)}
      >
        <h2 className="text-base font-bold text-white">Base Game</h2>
        <span className="text-gray-400 text-sm">{isOpen ? "▼" : "▶"}</span>
      </div>

      {isOpen && (
        <div className="px-4 pb-5 flex flex-col gap-5">

          {/* ── Upload reelstrip ── */}
          <ReelstripUploader onLoaded={onUploadReels} />

          {/* ── Grid rows + offset controls (global) ── */}
          <div className="flex items-center gap-3 flex-wrap">
            <label className="text-sm text-gray-300 font-medium">Rows</label>
            <input
              type="number"
              min={1}
              max={12}
              value={rows}
              onChange={(e) => {
                const v = Math.max(1, Math.min(12, Number(e.target.value) || 1));
                setRows(v);
              }}
              className="w-16 px-2 py-1 rounded-lg text-sm text-white border border-gray-600 outline-none"
              style={{ background: "#374151" }}
            />

            <label className="text-sm text-gray-300 font-medium ml-1">Offset</label>
            <select
              value={Math.max(0, Math.min(offset, rows - 1))}
              onChange={(e) => setOffset(Number(e.target.value))}
              className="px-2 py-1 rounded-lg text-sm text-white border border-gray-600 outline-none"
              style={{ background: "#374151" }}
            >
              {Array.from({ length: Math.max(rows, 1) }, (_, r) => (
                <option key={r} value={r} className="bg-gray-800">row {r}</option>
              ))}
            </select>
            <span className="text-xs text-gray-500 italic">
              anchor row where each reel’s stop symbol is processed · applies to the whole grid
            </span>
          </div>

          {/* ── Reel columns ── */}
          {reels.length === 0 ? (
            <div className="text-sm text-gray-400 italic py-6 text-center border border-dashed border-gray-600 rounded-lg">
              No reelstrip loaded. Upload a reelstrip JSON to populate the grid.
            </div>
          ) : (
          <div className="flex gap-2 overflow-x-auto pb-1">
            {reels.map((reel, i) => (
              <ReelColumn
                key={i}
                reelIndex={i}
                reel={reel}
                stop={reelStops[i] ?? 0}
                setStop={(idx, val) => {
                  const u = [...reelStops];
                  u[idx] = val;
                  setReelStops(u);
                }}
                rows={rows}
                offset={offset}
                scatColors={scatColors}   setScatColors={setScatColors}
                scatValues={scatValues}   setScatValues={setScatValues}
                stackSymbol={stackSymbol}
              />
            ))}
          </div>
          )}

          {/* ── Row 1: GRAND | MAJOR | STACK dropdown ── */}
          <div className="flex gap-2 items-center flex-wrap">

            {/* GRAND */}
            <button
              onClick={() => setGrandEnabled(!grandEnabled)}
              className={`px-4 py-2 rounded-lg font-bold text-sm border transition-all ${
                grandEnabled
                  ? "bg-yellow-500 border-yellow-400 text-black"
                  : "bg-transparent border-gray-500 text-white hover:border-gray-300"
              }`}
            >
              {grandEnabled ? "⭐ GRAND" : "GRAND"}
            </button>

            {/* MAJOR */}
            <button
              onClick={() => setMajorEnabled(!majorEnabled)}
              className={`px-4 py-2 rounded-lg font-bold text-sm border transition-all ${
                majorEnabled
                  ? "bg-orange-500 border-orange-400 text-black"
                  : "bg-transparent border-gray-500 text-white hover:border-gray-300"
              }`}
            >
              {majorEnabled ? "🔶 MAJOR" : "MAJOR"}
            </button>

            {/* STACK dropdown — always visible.
                When nothing selected → shows "STACK (Random)" placeholder text.
                When selected         → shows just the symbol name, e.g. "ACE".  */}
            <div className="relative">
              <select
                className="appearance-none pl-3 pr-7 py-2 rounded-lg text-sm font-medium text-white border border-gray-600 cursor-pointer outline-none hover:border-gray-400 transition-colors"
                style={{ background: "#374151" }}
                value={stackSymbol ?? ""}
                onChange={(e) => setStackSymbol(e.target.value || null)}
              >
                <option value="" className="bg-gray-800">STACK (Random)</option>
                {STACK_SYMBOLS.map((s) => (
                  <option key={s} value={s} className="bg-gray-800">{s}</option>
                ))}
              </select>
              <span className="pointer-events-none absolute right-2 top-1/2 -translate-y-1/2 text-gray-400 text-xs">
                ▾
              </span>
            </div>
          </div>

          {/* ── Row 2: Feature Enabled toggle ── */}
          <div className="flex gap-3 items-center flex-wrap">
            <button
              onClick={() => {
                setFeatureEnabled(!featureEnabled);
                if (featureEnabled) setSelectedFeatures([]);
              }}
              className={`px-4 py-2 rounded-lg font-semibold text-sm transition-all ${
                featureEnabled
                  ? "bg-green-600 text-white hover:bg-green-500"
                  : "bg-gray-700 text-gray-400 hover:bg-gray-600"
              }`}
            >
              {featureEnabled ? "Feature Enabled" : "Feature Disabled"}
            </button>

            {!featureEnabled && (
              <span className="text-red-400 text-xs italic">triggerFeatures: false</span>
            )}
          </div>

          {/* ── Feature selection ── */}
          {featureEnabled && visibleFeatures.size > 0 && (
            <div className="flex flex-col gap-3">
              <div className="flex gap-2 flex-wrap">
                {(Array.from(visibleFeatures) as ScatKey[]).map((f) => {
                  const isActive = selectedFeatures.includes(f);
                  const meta     = FEATURE_META[f];
                  return (
                    <button
                      key={f}
                      onClick={() => toggleFeature(f)}
                      className={`px-4 py-2 rounded-lg font-semibold text-sm border transition-all ${
                        isActive ? meta.activeBtn : meta.inactiveBtn
                      }`}
                    >
                      {meta.label}
                    </button>
                  );
                })}
              </div>

              {selectedFeatures.length > 0 && (
                <div className="flex items-center gap-3 flex-wrap">
                  <button
                    onClick={() => onGoTo(selectedFeatures)}
                    className="px-5 py-2 bg-indigo-600 hover:bg-indigo-500 rounded-lg font-bold text-sm text-white transition-all"
                  >
                    GO TO →{" "}
                    {selectedFeatures
                      .map((f) => FEATURE_META[f as ScatKey]?.label ?? f.toUpperCase())
                      .join(" + ")}
                  </button>
                  <div className="flex gap-1 flex-wrap">
                    {selectedFeatures.map((f) => (
                      <span key={f} className={`text-xs px-2 py-0.5 rounded ${FEATURE_META[f as ScatKey]?.badge}`}>
                        {FEATURE_META[f as ScatKey]?.label}
                      </span>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}

          {/* {featureEnabled && visibleFeatures.size === 0 && (
            <p className="text-gray-500 text-xs italic">
              Assign a colour to a visible SCAT to unlock feature selection.
            </p>
          )} */}

        </div>
      )}
    </div>
  );
}