/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { useState } from "react";
import ReelColumn from "@/games/triple-piggy-pays/components/ReelColumn";
import ReelstripUploader from "@/components/ReelstripUploader";
import { visibleCells } from "@/lib/reelGrid";

type Props = {
  reelStops: number[];
  setReelStops: (val: number[]) => void;

  scatColors: { [key: string]: string };
  setScatColors: (val: { [key: string]: string }) => void;

  stackValue: string;
  setStackValue: (val: string) => void;

  triggers: { grand: boolean; major: boolean };
  setTriggers: (val: { grand: boolean; major: boolean }) => void;

  featureEnabled: boolean;
  setFeatureEnabled: (val: boolean) => void;

  featureTriggers: {
    WHEEL: boolean;
    TOWER: boolean;
    ZONE: boolean;
  };
  setFeatureTriggers: (val: any) => void;

  setActiveFeatures: (features: ("WHEEL" | "TOWER" | "ZONE")[]) => void;

  onUploadReels?: (reels: string[][]) => void;
  onReset: () => void;

  reels: string[][];
  rows: number;
  setRows: (val: number) => void;
  offset: number;
  setOffset: (val: number) => void;
};

export default function BaseGame({
  reelStops,
  setReelStops,
  scatColors,
  setScatColors,
  stackValue,
  setStackValue, 
  triggers,
  setTriggers,
  featureEnabled,
  setFeatureEnabled,
  featureTriggers,
  setFeatureTriggers,
  setActiveFeatures,
  onUploadReels,
  onReset,
  reels,
  rows,
  setRows,
  offset,
  setOffset,
}: Props) {

  // 🔥 COLLAPSE STATE
  const [isOpen, setIsOpen] = useState(true);

  const visibleScatColors = new Set<string>();

  reels.forEach((reel, reelIndex) => {
    const stop = reelStops[reelIndex] ?? 0;

    visibleCells(reel, stop - 1, offset, rows).forEach((cell) => {
      if (cell.symbol === "SCAT" && cell.stripIndex !== null) {
        const key = `${reelIndex}-${cell.stripIndex}`;
        const color = scatColors[key];
        if (color) visibleScatColors.add(color);
      }
    });
  });




  const selectedFeatures = (Object.entries(featureTriggers) as [
  "WHEEL" | "TOWER" | "ZONE",
  boolean
][])
  .filter(([_, val]) => val)
  .map(([key]) => key);




  const hasStack = reels.some((reel, reelIndex) => {
    const stop = reelStops[reelIndex] ?? 0;

    return visibleCells(reel, stop - 1, offset, rows).some(
      (cell) => cell.symbol === "STACK"
    );
  });




  const getFeatureLabel = (features: string[]) => {
  if (features.length === 1) return features[0];
  if (features.length === 2) return "SUPER (" + features.join(" + ") + ")";
  if (features.length === 3) return "MEGA (" + features.join(" + ") + ")";
  return "";
};



  return (
    <div className="bg-gray-800 rounded-xl">

      {/* 🔽 HEADER (CLICK TO TOGGLE) */}
      <div
        onClick={() => setIsOpen(!isOpen)}
        className="flex justify-between items-center p-4 cursor-pointer"
      >
        <h2 className="text-lg font-semibold">Base Game</h2>
        <div className="flex items-center gap-3">
          <button
            onClick={(e) => {
              e.stopPropagation();
              onReset();
            }}
            title="Reset the base game to its initial position and state"
            className="px-3 py-1 rounded bg-gray-700 hover:bg-gray-600 text-sm"
          >
            ↺ Reset
          </button>
          <span className="text-xl">
            {isOpen ? "▼" : "▶"}
          </span>
        </div>
      </div>

      {/* 🔽 COLLAPSIBLE CONTENT */}
      {isOpen && (
        <div className="p-6 pt-0">

          {/* UPLOAD REELSTRIP */}
          <div className="mb-4">
            <ReelstripUploader onLoaded={onUploadReels} />
          </div>

          {/* GRID ROWS + OFFSET (global) */}
          <div className="mb-4 flex items-center gap-3 flex-wrap">
            <label className="text-sm text-gray-300">Rows</label>
            <input
              type="number"
              min={1}
              max={12}
              value={rows}
              onChange={(e) =>
                setRows(Math.max(1, Math.min(12, Number(e.target.value) || 1)))
              }
              className="w-16 px-2 py-1 bg-gray-700 text-white rounded"
            />

            <label className="text-sm text-gray-300 ml-1">Offset</label>
            <select
              value={Math.max(0, Math.min(offset, rows - 1))}
              onChange={(e) => setOffset(Number(e.target.value))}
              className="px-2 py-1 bg-gray-700 text-white rounded"
            >
              {Array.from({ length: Math.max(rows, 1) }, (_, r) => (
                <option key={r} value={r}>row {r}</option>
              ))}
            </select>
            <span className="text-xs text-gray-500 italic">
              anchor row where each reel&apos;s stop symbol lands
            </span>
          </div>

          {/* SLOT GRID */}
          {reels.length === 0 ? (
            <div className="text-sm text-gray-400 italic py-6 text-center border border-dashed border-gray-600 rounded-lg">
              No reelstrip loaded. Upload a reelstrip JSON to populate the grid.
            </div>
          ) : (
          <div className="flex gap-4">
            {reels.map((reel, i) => (
              <ReelColumn
                key={i}
                reelIndex={i}
                reel={reel}
                stop={reelStops[i] ?? 0}
                setStop={(index, value) => {
                  const updated = [...reelStops];
                  updated[index] = value;
                  setReelStops(updated);
                }}
                rows={rows}
                offset={offset}
                scatColors={scatColors}
                setScatColors={setScatColors}
                stackValue={stackValue}
              />
            ))}
          </div>
          )}

          {/* GRAND / MAJOR + STACK */}
          <div className="mt-6 flex gap-4">
            {(["grand", "major"] as const).map((type) => (
              <button
                key={type}
                onClick={() =>
                  setTriggers({ ...triggers, [type]: !triggers[type] })
                }
                className={`px-4 py-2 rounded border ${
                  triggers[type] ? "bg-green-600" : "bg-gray-700"
                }`}
              >
                {type.toUpperCase()}
              </button>
            ))}

            {hasStack && (
              <select
                value={stackValue}
                onChange={(e) => setStackValue(e.target.value)}
                className="px-3 py-2 bg-gray-700 text-white rounded"
              >
                <option value="">STACK (Random)</option>
                <option value="PIC1">PIC1</option>
                <option value="PIC2">PIC2</option>
                <option value="PIC3">PIC3</option>
                <option value="PIC4">PIC4</option>
                <option value="PIC5">PIC5</option>
                <option value="ACE">ACE</option>
                <option value="KING">K</option>
                <option value="QUEEN">Q</option>
                <option value="JACK">J</option>
                <option value="TEN">10</option>
                <option value="NINE">9</option>
              </select>
            )}
          </div>

          {/* FEATURE MASTER */}
          <div className="mt-4">
            <button
              onClick={() => setFeatureEnabled(!featureEnabled)}
              className={`px-4 py-2 rounded ${
                featureEnabled ? "bg-green-600" : "bg-gray-600"
              }`}
            >
              Feature Enabled
            </button>

            {!featureEnabled && (
              <div className="text-red-400 text-sm mt-2">
                Features Disabled
              </div>
            )}

            {featureEnabled && visibleScatColors.size > 0 && (
              <div className="flex gap-2 mt-2">

                {visibleScatColors.has("red") && (
                  <button
                    onClick={() =>
                      setFeatureTriggers({
                        ...featureTriggers,
                        WHEEL: !featureTriggers.WHEEL
                      })
                    }
                    className={`px-3 py-1 rounded ${
                      featureTriggers.WHEEL ? "bg-red-500" : "bg-gray-600"
                    }`}
                  >
                    WHEEL
                  </button>
                )}

                {visibleScatColors.has("blue") && (
                  <button
                    onClick={() =>
                      setFeatureTriggers({
                        ...featureTriggers,
                        TOWER: !featureTriggers.TOWER
                      })
                    }
                    className={`px-3 py-1 rounded ${
                      featureTriggers.TOWER ? "bg-blue-500" : "bg-gray-600"
                    }`}
                  >
                    TOWER
                  </button>
                )}

                {visibleScatColors.has("purple") && (
                  <button
                    onClick={() =>
                      setFeatureTriggers({
                        ...featureTriggers,
                        ZONE: !featureTriggers.ZONE
                      })
                    }
                    className={`px-3 py-1 rounded ${
                      featureTriggers.ZONE ? "bg-purple-500" : "bg-gray-600"
                    }`}
                  >
                    ZONE
                  </button>
                )}


 {featureEnabled && selectedFeatures.length > 0 && (
  <div className="mt-4">

    <button
      onClick={() => setActiveFeatures(selectedFeatures)}
      className="px-5 py-2 bg-green-600 rounded font-semibold"
    >
      Go to {getFeatureLabel(selectedFeatures)}
    </button>

  </div>
)}

              </div>
            )}
          </div>

        </div>
      )}
    </div>
  );
}