"use client";

import { useState } from "react";
import BaseGame from "./base-game";
import GaffeOutput from "@/games/triple-piggy-pays/components/GaffeOutput";
import { visibleCells } from "@/lib/reelGrid";
import { generateGaffe } from "@/games/triple-piggy-pays/utils/gaffeGenerator";
import { useRouter } from "next/navigation";
import FeatureFinal from "./FeatureFinal"

export default function Home() {
  const router = useRouter();

  // 🔥 ALL STATE LIVES HERE NOW
  // Starts empty - the grid is populated only from an uploaded reelstrip.
  const [reelStops, setReelStops] = useState<number[]>([]);
  const [scatColors, setScatColors] = useState<{ [key: string]: string }>({});
  const [stackValue, setStackValue] = useState("");
  const [triggers, setTriggers] = useState({
    grand: false,
    major: false
  });
  const [featureEnabled, setFeatureEnabled] = useState(true);
  const [featureTriggers, setFeatureTriggers] = useState({
    WHEEL: false,
    TOWER: false,
    ZONE: false
  });

  const [activeFeatures, setActiveFeatures] = useState<
  ("WHEEL" | "TOWER" | "ZONE")[]
>([]);

  // ── Dynamic grid: global row count + one global anchor-row offset ──────────
  // Defaults match the original fixed layout (4 rows, landed symbol on row 1).
  const [rows,   setRows]   = useState<number>(4);
  const [offset, setOffset] = useState<number>(1);
  // Keep the offset within the current row range when rows shrinks.
  const handleSetRows = (r: number) => {
    setRows(r);
    setOffset((o) => Math.max(0, Math.min(o, r - 1)));
  };

  // Reels come only from an uploaded reelstrip (none are hardcoded).
  const [reels, setReels] = useState<string[][]>([]);
  const handleUploadReels = (next: string[][]) => {
    setReels(next);
    setReelStops(Array(next.length).fill(0));
  };

  // Reset the base game: keeps the uploaded reelstrip, returns stops, rows,
  // offset, scat colours, stack and triggers to their initial state.
  const handleReset = () => {
    setReelStops(reels.length ? Array(reels.length).fill(0) : []);
    setScatColors({});
    setStackValue("");
    setTriggers({ grand: false, major: false });
    setFeatureEnabled(true);
    setFeatureTriggers({ WHEEL: false, TOWER: false, ZONE: false });
    setActiveFeatures([]);
    setRows(4);
    setOffset(1);
  };

  const gaffe = generateGaffe(
    reelStops,
    reels,
    triggers,
    scatColors,
    stackValue,
    featureEnabled,
    featureTriggers,
    rows,
    offset
  );


const getBaseScatPositions = () => {
  const positions: {
    row: number;
    col: number;
    color: "red" | "blue" | "purple";
  }[] = [];

  reels.forEach((reel, reelIndex) => {
    const stop = reelStops[reelIndex] ?? 0;

    visibleCells(reel, stop - 1, offset, rows).forEach((cell) => {
      if (cell.symbol === "SCAT" && cell.stripIndex !== null) {
        const key = `${reelIndex}-${cell.stripIndex}`;
        const color = scatColors[key];

        if (color === "red" || color === "blue" || color === "purple") {
          positions.push({
            row: cell.row,
            col: reelIndex,
            color
          });
        }
      }
    });
  });

  return positions;
};

// to show result of feature game in the main gaffe output 
const [featureOutput, setFeatureOutput] = useState<string[]>([]);

  return (
    <main className="p-6 bg-gray-900 min-h-screen text-white">
      <button
        onClick={() => router.push("/")}
        className="mb-4 px-4 py-2 bg-gray-700 rounded hover:bg-gray-600"
      >
        ← Back
      </button>

      <h1 className="text-2xl mb-6">Slot Gaffe Tool</h1>

      <div className="flex gap-10">

        {/* LEFT SIDE (STACKED SECTIONS) */}
        <div className="flex flex-col gap-6 w-[50%]">

          <BaseGame
            reelStops={reelStops}
            setReelStops={setReelStops}
            scatColors={scatColors}
            setScatColors={setScatColors}
            stackValue={stackValue}
            setStackValue={setStackValue}
            triggers={triggers}
            setTriggers={setTriggers}
            featureEnabled={featureEnabled}
            setFeatureEnabled={setFeatureEnabled}
            featureTriggers={featureTriggers}
            setFeatureTriggers={setFeatureTriggers}
           setActiveFeatures={setActiveFeatures}
            onUploadReels={handleUploadReels}
            onReset={handleReset}
            reels={reels}
            rows={rows}     setRows={handleSetRows}
            offset={offset} setOffset={setOffset}
          />

          {/* FUTURE */}
        {activeFeatures.length > 0 && (
  <FeatureFinal
  features={activeFeatures}
  baseScatPositions={getBaseScatPositions()}
  setFeatureOutput={setFeatureOutput}
  
/>
)}

          {/* <Feature1 /> */}
        </div>

     
        {/* RIGHT SIDE (ALWAYS OUTPUT) */}
        <div className="w-[30%]">
          {/* <GaffeOutput gaffe={gaffe} /> */}
          <GaffeOutput gaffe={gaffe} featureOutput={featureOutput} />
          <div className="mt-4 bg-black p-3 rounded text-green-400 text-sm">
            {/* //!  for showing result below the gaffe output box */}
  {/* {featureOutput.map((res, i) => (            
    <div key={i}>{res}</div>
  ))} */}
</div>
        </div>

      </div>
    </main>
  );
}