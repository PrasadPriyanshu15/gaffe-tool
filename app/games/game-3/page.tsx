



"use client";

import { useState } from "react";
import {
  Cell,
  FeatureConfig,
  SchemaField,
  runSpin,
  generateFromSchema,
  DEFAULT_FIELDS,
} from "./logic";
import { GenericGrid, ControlPanel, SchemaBuilder, OutputPanel } from "./components";

export default function Page() {
  const [config, setConfig] = useState<FeatureConfig | null>(null);
  const [grid, setGrid] = useState<Cell[][]>([]);
  const [isRegistered, setIsRegistered] = useState(false);
  const [spins, setSpins] = useState(3);
  const [outputs, setOutputs] = useState<string[]>([]);
  const [referenceOutput, setReferenceOutput] = useState<string | null>(null);
  const [fields, setFields] = useState<SchemaField[]>(DEFAULT_FIELDS);

  // Live preview computed from current grid + schema
  const livePreview = config && grid.length > 0
    ? generateFromSchema(grid, fields).text
    : "";

  const createGrid = (cfg: FeatureConfig) => {
    const emptyGrid = Array.from({ length: cfg.rows }, () =>
      Array.from({ length: cfg.cols }, () => ({ type: "EMPTY" }))
    );
    setConfig(cfg);
    setGrid(emptyGrid);
    setIsRegistered(false);
    setSpins(cfg.spins);
    setOutputs([]);
    setReferenceOutput(null);
  };

  const handleSpin = () => {
    const newGrid = runSpin({ grid });
    setGrid(newGrid);
    const { text } = generateFromSchema(newGrid, fields);
    setOutputs(prev => [...prev, text]);
    setSpins(prev => prev - 1);
  };

  const handleSetReference = () => {
    if (!grid.length) return;
    const { text } = generateFromSchema(grid, fields);
    setReferenceOutput(text);
  };

  return (
    <div className="min-h-screen bg-gray-950 text-white">
      {/* Header */}
      <div className="border-b border-gray-800 px-6 py-4 flex items-center gap-3">
        <div className="w-2 h-2 rounded-full bg-blue-500"></div>
        <h1 className="text-sm font-bold tracking-widest uppercase text-gray-300">
          Game Output Builder
        </h1>
        <span className="text-gray-600 text-xs ml-auto">
          Dynamic schema · Multi-game tool
        </span>
      </div>

      <div className="p-6 space-y-6">
        {/* Control Panel */}
        <ControlPanel onCreate={createGrid} />

        {config && grid.length > 0 && (
          <div className="flex gap-5 items-start">

            {/* ── GRID PANEL ── */}
            <div className="flex-shrink-0">
              <SectionLabel>Grid</SectionLabel>
              <div className="bg-gray-900 border border-gray-700 rounded-xl p-4">
                <GenericGrid grid={grid} setGrid={setGrid} coins={config.coins} />

                <div className="mt-4 flex gap-3 items-center">
                  {!isRegistered ? (
                    <button
                      onClick={() => setIsRegistered(true)}
                      className="bg-green-700 hover:bg-green-600 text-white px-4 py-2 rounded-lg text-sm font-semibold transition-colors"
                    >
                      Register Grid
                    </button>
                  ) : (
                    <>
                      <button
                        onClick={handleSpin}
                        disabled={spins <= 0}
                        className="bg-blue-600 hover:bg-blue-500 disabled:opacity-40 disabled:cursor-not-allowed text-white px-4 py-2 rounded-lg text-sm font-semibold transition-colors"
                      >
                        Spin ({spins})
                      </button>
                      <button
                        onClick={() => { setIsRegistered(false); setSpins(config.spins); }}
                        className="bg-gray-700 hover:bg-gray-600 text-gray-300 px-3 py-2 rounded-lg text-sm transition-colors"
                      >
                        Reset
                      </button>
                    </>
                  )}
                  <span className="text-gray-600 text-xs ml-auto">
                    {config.rows}×{config.cols} · {config.coins.filter(c=>c.name!=="EMPTY").map(c=>c.name).join(", ")}
                  </span>
                </div>
              </div>
            </div>

            {/* ── SCHEMA BUILDER ── */}
            <div className="w-[380px] flex-shrink-0">
              <SectionLabel>
                Output Schema
                <span className="text-gray-600 text-xs font-normal ml-2 normal-case tracking-normal">
                  — define what each spin outputs
                </span>
              </SectionLabel>
              <div className="bg-gray-900 border border-gray-700 rounded-xl p-4">
                <SchemaBuilder
                  fields={fields}
                  setFields={setFields}
                  availableCoins={config.coins}
                />
              </div>
            </div>

            {/* ── OUTPUT PANEL ── */}
            <div className="flex-1 min-w-[280px]" style={{ height: "600px" }}>
              <SectionLabel>Output</SectionLabel>
              <div className="h-full">
                <OutputPanel
                  outputs={outputs}
                  referenceOutput={referenceOutput}
                  onSetReference={handleSetReference}
                  currentPreview={livePreview}
                />
              </div>
            </div>

          </div>
        )}
      </div>
    </div>
  );
}

function SectionLabel({ children }: { children: React.ReactNode }) {
  return (
    <div className="text-[10px] font-bold uppercase tracking-widest text-gray-500 mb-2">
      {children}
    </div>
  );
}