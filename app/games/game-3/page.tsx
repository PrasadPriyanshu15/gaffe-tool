// /* eslint-disable @typescript-eslint/no-explicit-any */
// "use client";

// import { useState } from "react";
// import { Cell, FeatureConfig, SchemaField, runSpin, generateFromSchema } from "./logic";
// import { GenericGrid, ControlPanel } from "./components";

// export default function Page() {
//   const [config, setConfig] = useState<FeatureConfig | null>(null);
//   const [grid, setGrid] = useState<Cell[][]>([]);
//   const [isRegistered, setIsRegistered] = useState(false);
//   const [spins, setSpins] = useState(3);
//   const [output, setOutput] = useState<string[]>([]);

//   const [schema, setSchema] = useState<Record<string, SchemaField>>({
//     reelStopPositions:          { type: "reelStops" },
//     goldCoin:                   { type: "coin", coinType: "GOLD" },
//     redCoin:                    { type: "coin", coinType: "RED" },
//     multiplierValue:            { type: "multiplier" },
//     additionalFeatureTriggered: { type: "static", value: false },
//   });

//   const createGrid = (config: FeatureConfig) => {
//     const emptyGrid = Array.from({ length: config.rows }, () =>
//       Array.from({ length: config.cols }, () => ({ type: "EMPTY" }))
//     );
//     setConfig(config);
//     setGrid(emptyGrid);
//     setIsRegistered(false);
//     setSpins(config.spins);
//     setOutput([]);
//   };

//   const handleSpin = () => {
//     const newGrid = runSpin({ grid });
//     setGrid(newGrid);
//     setOutput(prev => [...prev, generateFromSchema(newGrid, schema)]);
//     setSpins(prev => prev - 1);
//   };

//   const updateSchemaKey = (oldKey: string, newKey: string) => {
//     setSchema(prev => {
//       const updated: Record<string, SchemaField> = {};
//       Object.entries(prev).forEach(([k, v]) => {
//         updated[k === oldKey ? newKey : k] = v;
//       });
//       return updated;
//     });
//   };

//   const updateSchemaValue = (key: string, patch: Partial<SchemaField>) => {
//     setSchema(prev => ({ ...prev, [key]: { ...prev[key], ...patch } as SchemaField }));
//   };

//   return (
//     <div className="p-6 bg-gray-200 min-h-screen text-black">

//       <ControlPanel onCreate={createGrid} />

//       {config && grid.length > 0 && (
//         <div className="flex gap-6 mt-4">

//           {/* GRID */}
//           <div className="w-[820px] bg-gray-800 p-4 rounded text-white">
//             <div className="mb-2 font-bold">Grid</div>
//             <GenericGrid grid={grid} setGrid={setGrid} coins={config.coins} />

//             {!isRegistered ? (
//               <button
//                 onClick={() => setIsRegistered(true)}
//                 className="mt-4 bg-green-500 px-3 py-2 rounded"
//               >
//                 Register
//               </button>
//             ) : (
//               <button
//                 onClick={handleSpin}
//                 className="mt-4 bg-blue-500 px-3 py-2 rounded"
//               >
//                 Spin ({spins})
//               </button>
//             )}
//           </div>

//           {/* SCHEMA */}
//           <div className="w-[720px] bg-gray-100 p-4 rounded border border-gray-400">
//             <div className="font-bold mb-3">Schema</div>

//             {Object.entries(schema).map(([key, value], index) => (
//               <div key={index} className="flex gap-2 mb-2 items-center">
//                 <input
//                   value={key}
//                   onChange={e => updateSchemaKey(key, e.target.value)}
//                   className="border px-2 py-1 bg-white"
//                 />
//                 <span className="text-sm">{value.type}</span>

//                 {value.type === "coin" && (
//                   <input
//                     value={value.coinType}
//                     onChange={e => updateSchemaValue(key, { coinType: e.target.value } as any)}
//                     className="border px-2 py-1 bg-white"
//                   />
//                 )}

//                 {value.type === "static" && (
//                   <input
//                     value={String(value.value)}
//                     onChange={e => {
//                       const raw = e.target.value;
//                       const val = raw === "true" ? true : raw === "false" ? false : raw;
//                       updateSchemaValue(key, { value: val } as any);
//                     }}
//                     className="border px-2 py-1 bg-white"
//                   />
//                 )}
//               </div>
//             ))}
//           </div>

//           {/* OUTPUT */}
//           <div className="w-[520px] bg-black text-green-400 p-4 rounded">
//             <div className="mb-2 font-bold">Output</div>
//             <pre className="text-sm">{output.join("\n\n")}</pre>
//           </div>

//         </div>
//       )}
//     </div>
//   );
// }




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