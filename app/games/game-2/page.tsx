/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { useState } from "react";
import { Cell, FeatureConfig } from "./types";
import GenericGrid from "./ui/GenericGrid";
import ControlPanel from "./ui/ControlPanel";
import { runSpin } from "./engine/featureEngine";
import { generateFromSchema } from "./output/outpurFormatter";

type SchemaField =
  | { type: "reelStops" }
  | { type: "coin"; coinType: string }
  | { type: "multiplier" }
  | { type: "static"; value: any };

export default function Page() {
  const [config, setConfig] = useState<FeatureConfig | null>(null);
  const [grid, setGrid] = useState<Cell[][]>([]);
  const [isRegistered, setIsRegistered] = useState(false);
  const [spins, setSpins] = useState(3);
  const [output, setOutput] = useState<string[]>([]);

  //  SAFE SCHEMA
  const [schema, setSchema] = useState<Record<string, SchemaField>>({
    reelStopPositions: { type: "reelStops" },
    goldCoin: { type: "coin", coinType: "GOLD" },
    redCoin: { type: "coin", coinType: "RED" },
    multiplierValue: { type: "multiplier" },
    additionalFeatureTriggered: { type: "static", value: false },
  });

  //  CREATE GRID
  const createGrid = (config: FeatureConfig) => {
    const emptyGrid = Array.from({ length: config.rows }, () =>
      Array.from({ length: config.cols }, () => ({ type: "EMPTY" }))
    );

    setConfig(config);
    setGrid(emptyGrid);
    setIsRegistered(false);
    setSpins(config.spins);
    setOutput([]);
  };

  //  REGISTER
  const handleRegister = () => {
    setIsRegistered(true);
  };

  //  SPIN
  const handleSpin = () => {
    const newGrid = runSpin({ grid });

    setGrid(newGrid);

    const result = generateFromSchema(newGrid, schema);

    setOutput(prev => [...prev, result]);
    setSpins(prev => prev -1);
  };

  //  RETURN (MAIN UI)
  return (
    <div className="p-6 bg-gray-200 min-h-screen text-black">

      {/* TOP */}
      <ControlPanel onCreate={createGrid} />

      {/* MAIN CONTENT */}
      {config && grid.length > 0 && (
        <div className="flex gap-6 mt-4">

          {/* 🔵 LEFT: GRID */}
          <div className="w-[820px] bg-gray-800 p-4 rounded text-white">
            <div className="mb-2 font-bold">Grid</div>

            <GenericGrid
              grid={grid}
              setGrid={setGrid}
              coins={config.coins}
            />

            {!isRegistered ? (
              <button
                onClick={handleRegister}
                className="mt-4 bg-green-500 px-3 py-2 rounded"
              >
                Register
              </button>
            ) : (
              <button
                onClick={handleSpin}
                className="mt-4 bg-blue-500 px-3 py-2 rounded"
              >
                Spin ({spins})
              </button>
            )}
          </div>

          {/* 🟡 CENTER: SCHEMA */}
          <div className=" w-[720px] bg-gray-100 p-4 rounded border border-gray-400">
            <div className="font-bold mb-3">Schema</div>

            {Object.entries(schema).map(([key, value], index) => (
              <div key={index} className="flex gap-2 mb-2 items-center">

                {/* FIELD NAME */}
                <input
                  value={key}
                  onChange={(e) => {
                    const newKey = e.target.value;

                    setSchema(prev => {
                      const updated: Record<string, SchemaField> = {};
                      Object.entries(prev).forEach(([k, v]) => {
                        if (k === key) updated[newKey] = v;
                        else updated[k] = v;
                      });
                      return updated;
                    });
                  }}
                  className="border px-2 py-1 bg-white"
                />

                {/* TYPE */}
                <span className="text-sm">{value.type}</span>

                {/* COIN TYPE */}
                {value.type === "coin" && (
                  <input
                    value={value.coinType}
                    onChange={(e) => {
                      setSchema(prev => ({
                        ...prev,
                        [key]: {
                          ...value,
                          coinType: e.target.value,
                        },
                      }));
                    }}
                    className="border px-2 py-1 bg-white"
                  />
                )}

                {/* STATIC */}
                {value.type === "static" && (
                  <input
                    value={String(value.value)}
                    onChange={(e) => {
                      const val =
                        e.target.value === "true"
                          ? true
                          : e.target.value === "false"
                          ? false
                          : e.target.value;

                      setSchema(prev => ({
                        ...prev,
                        [key]: {
                          ...value,
                          value: val,
                        },
                      }));
                    }}
                    className="border px-2 py-1 bg-white"
                  />
                )}
              </div>
            ))}
          </div>

          {/* 🟢 RIGHT: OUTPUT */}
          <div className="w-[520px] bg-black text-green-400 p-4 rounded">
            <div className="mb-2 font-bold">Output</div>

            <pre className="text-sm">
              {output.join("\n\n")}
            </pre>
          </div>

        </div>
      )}
    </div>
  );
}
