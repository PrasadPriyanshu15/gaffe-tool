/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { useState } from "react";
import ReelColumn from "@/games/triple-piggy-pays/components/ReelColumn";
import { reels } from "./reels";

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
  setActiveFeatures
}: Props) {

  // 🔥 COLLAPSE STATE
  const [isOpen, setIsOpen] = useState(true);

  const visibleScatColors = new Set<string>();

  reels.forEach((reel, reelIndex) => {
    const stop = reelStops[reelIndex];

    [-1, 0, 1, 2].forEach((offset) => {
      const index = (stop - 1 + offset + reel.length) % reel.length;

      if (reel[index] === "SCAT") {
        const key = `${reelIndex}-${index}`;
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
    const stop = reelStops[reelIndex];

    return [-1, 0, 1, 2].some((offset) => {
      const index = (stop + offset + reel.length) % reel.length;
      return reel[index] === "STACK";
    });
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
        <span className="text-xl">
          {isOpen ? "▼" : "▶"}
        </span>
      </div>

      {/* 🔽 COLLAPSIBLE CONTENT */}
      {isOpen && (
        <div className="p-6 pt-0">

          {/* SLOT GRID */}
          <div className="flex gap-4">
            {reels.map((reel, i) => (
              <ReelColumn
                key={i}
                reelIndex={i}
                reel={reel}
                stop={reelStops[i]}
                setStop={(index, value) => {
                  const updated = [...reelStops];
                  updated[index] = value;
                  setReelStops(updated);
                }}
                scatColors={scatColors}
                setScatColors={setScatColors}
                stackValue={stackValue}
              />
            ))}
          </div>

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