// "use client";

// import { useState } from "react";
// import { Cell, CoinConfig, FeatureConfig } from "./logic";

// // ─── CONSTANTS ────────────────────────────────────────────────────────────────

// const COIN_EMOJI: Record<string, string> = {
//   GOLD: "🟡",
//   RED: "🔴",
//   BLUE: "🔵",
//   PURPLE: "🟣",
// };

// const ALL_COINS: CoinConfig[] = [
//   { name: "RED",          color: "red",         hasMultiplier: true },
//   { name: "GOLD",         color: "gold",         hasValue: true },
//   { name: "BLUE",         color: "blue" },
//   { name: "PURPLE",       color: "purple",       hasValue: true },
//   { name: "COLORED SCAT", color: "coloredScat",  hasValue: true },
// ];

// // ─── GENERIC GRID ─────────────────────────────────────────────────────────────

// type GridProps = {
//   grid: Cell[][];
//   setGrid: React.Dispatch<React.SetStateAction<Cell[][]>>;
//   coins: CoinConfig[];
// };

// export function GenericGrid({ grid, setGrid, coins }: GridProps) {

//   const handleClick = (i: number, j: number) => {
//     setGrid(prev => {
//       const newGrid = prev.map(row => row.map(cell => ({ ...cell })));
//       const current = newGrid[i][j];
//       const index = coins.findIndex(c => c.name === current.type);
//       const next = coins[(index + 1) % coins.length];
//       newGrid[i][j] = {
//         type: next.name,
//         value: next.hasValue ? 100 : undefined,
//         multiplier: undefined,
//       };
//       return newGrid;
//     });
//   };

//   return (
//     <div className="bg-gray-800 p-6 rounded-2xl shadow-xl border border-gray-700">
//       <div
//         className="grid gap-4 justify-center"
//         style={{ gridTemplateColumns: `repeat(${grid[0].length}, 90px)` }}
//       >
//         {grid.map((row, i) =>
//           row.map((cell, j) => {
//             const index = j * grid.length + i + 1;
//             return (
//               <div
//                 key={`${i}-${j}`}
//                 onClick={() => handleClick(i, j)}
//                 className="
//                   w-22 h-22 bg-gray-700 hover:bg-gray-600
//                   text-white rounded-xl flex flex-col items-center
//                   justify-center cursor-pointer transition-all
//                   duration-150 shadow-md hover:scale-105
//                 "
//               >
//                 <div className="text-[10px] opacity-70">{index}</div>
//                 <div className="text-[10px] opacity-50">({j},{i})</div>
//                 <div className="text-xl mt-1">{COIN_EMOJI[cell.type] ?? ""}</div>

//                 {cell.value !== undefined && (
//                   <input
//                     type="number"
//                     value={cell.value}
//                     onClick={e => e.stopPropagation()}
//                     onChange={e => {
//                       const val = Number(e.target.value);
//                       setGrid(prev => {
//                         const g = prev.map(r => r.map(c => ({ ...c })));
//                         g[i][j].value = val;
//                         return g;
//                       });
//                     }}
//                     className="w-14 mt-1 text-xs text-center bg-gray-900 text-white rounded border border-gray-600"
//                   />
//                 )}

//                 {cell.type === "RED" && (
//                   <input
//                     type="text"
//                     placeholder="x"
//                     onClick={e => e.stopPropagation()}
//                     onChange={e => {
//                       const val = e.target.value;
//                       setGrid(prev => {
//                         const g = prev.map(r => r.map(c => ({ ...c })));
//                         g[i][j].multiplier = val;
//                         return g;
//                       });
//                     }}
//                     className="w-14 mt-1 text-xs text-center bg-gray-900 text-white rounded border border-gray-600"
//                   />
//                 )}
//               </div>
//             );
//           })
//         )}
//       </div>
//     </div>
//   );
// }

// // ─── CONTROL PANEL ────────────────────────────────────────────────────────────

// type ControlPanelProps = {
//   onCreate: (config: FeatureConfig) => void;
// };

// export function ControlPanel({ onCreate }: ControlPanelProps) {
//   const [rows, setRows] = useState(4);
//   const [cols, setCols] = useState(5);
//   const [selectedCoins, setSelectedCoins] = useState<CoinConfig[]>([]);

//   const toggleCoin = (coin: CoinConfig) => {
//     setSelectedCoins(prev => {
//       const exists = prev.find(c => c.name === coin.name);
//       return exists ? prev.filter(c => c.name !== coin.name) : [...prev, coin];
//     });
//   };

//   const handleCreate = () => {
//     if (selectedCoins.length === 0) return;
//     onCreate({
//       rows,
//       cols,
//       spins: 3,
//       coins: [{ name: "EMPTY", color: "gray" }, ...selectedCoins],
//     });
//   };

//   return (
//     <div className="mb-4 space-y-3">
//       <div className="flex gap-2">
//         <input
//           type="number"
//           value={rows}
//           onChange={e => setRows(Number(e.target.value))}
//           className="border px-2"
//         />
//         <input
//           type="number"
//           value={cols}
//           onChange={e => setCols(Number(e.target.value))}
//           className="border px-2"
//         />
//       </div>

//       <div className="flex gap-2 flex-wrap">
//         {ALL_COINS.map(c => {
//           const selected = selectedCoins.find(sc => sc.name === c.name);
//           return (
//             <button
//               key={c.name}
//               onClick={() => toggleCoin(c)}
//               className={`px-3 py-1 rounded border ${selected ? "bg-green-500 text-white" : "bg-gray-300"}`}
//             >
//               {c.name}
//             </button>
//           );
//         })}
//       </div>

//       <button
//         onClick={handleCreate}
//         className="bg-blue-500 text-white px-4 py-2 rounded"
//       >
//         Create Grid
//       </button>
//     </div>
//   );
// }



"use client";

import { useState } from "react";
import { Cell, CoinConfig, FeatureConfig, SchemaField, SchemaFieldType, PositionFormat } from "./logic";

// ─── CONSTANTS ────────────────────────────────────────────────────────────────

export const COIN_EMOJI: Record<string, string> = {
  GOLD: "🟡",
  RED: "🔴",
  BLUE: "🔵",
  PURPLE: "🟣",
  "COLORED SCAT": "🌈",
};

export const ALL_COINS: CoinConfig[] = [
  { name: "RED",          color: "red",         hasMultiplier: true },
  { name: "GOLD",         color: "gold",         hasValue: true },
  { name: "BLUE",         color: "blue" },
  { name: "PURPLE",       color: "purple",       hasValue: true },
  { name: "COLORED SCAT", color: "coloredScat",  hasValue: true },
];

const FIELD_TYPES: SchemaFieldType[] = ["reelStops", "coin", "multiplier", "static", "custom"];

const POSITION_FORMATS: { value: PositionFormat; label: string }[] = [
  { value: "colRow",            label: "[col, row]" },
  { value: "rowCol",            label: "[row, col]" },
  { value: "flatIndex",         label: "flat (col-major)" },
  { value: "flatIndexRowMajor", label: "flat (row-major)" },
];

// ─── GENERIC GRID ─────────────────────────────────────────────────────────────

type GridProps = {
  grid: Cell[][];
  setGrid: React.Dispatch<React.SetStateAction<Cell[][]>>;
  coins: CoinConfig[];
};

export function GenericGrid({ grid, setGrid, coins }: GridProps) {
  const handleClick = (i: number, j: number) => {
    setGrid(prev => {
      const newGrid = prev.map(row => row.map(cell => ({ ...cell })));
      const current = newGrid[i][j];
      const index = coins.findIndex(c => c.name === current.type);
      const next = coins[(index + 1) % coins.length];
      newGrid[i][j] = {
        type: next.name,
        value: next.hasValue ? 100 : undefined,
        multiplier: undefined,
      };
      return newGrid;
    });
  };

  return (
    <div className="bg-gray-800 p-4 rounded-xl border border-gray-700">
      <div
        className="grid gap-3 justify-center"
        style={{ gridTemplateColumns: `repeat(${grid[0].length}, 84px)` }}
      >
        {grid.map((row, i) =>
          row.map((cell, j) => {
            const index = j * grid.length + i + 1;
            return (
              <div
                key={`${i}-${j}`}
                onClick={() => handleClick(i, j)}
                className="
                  w-[84px] h-[84px] bg-gray-700 hover:bg-gray-600
                  text-white rounded-lg flex flex-col items-center
                  justify-center cursor-pointer transition-all
                  duration-150 shadow-md hover:scale-105 select-none
                "
              >
                <div className="text-[9px] opacity-50 leading-none">#{index}</div>
                <div className="text-[9px] opacity-40 leading-none">({j},{i})</div>
                <div className="text-2xl mt-1 leading-none">{COIN_EMOJI[cell.type] ?? "⬜"}</div>
                <div className="text-[9px] opacity-60 mt-0.5">{cell.type === "EMPTY" ? "" : cell.type}</div>

                {cell.value !== undefined && (
                  <input
                    type="number"
                    value={cell.value}
                    onClick={e => e.stopPropagation()}
                    onChange={e => {
                      const val = Number(e.target.value);
                      setGrid(prev => {
                        const g = prev.map(r => r.map(c => ({ ...c })));
                        g[i][j].value = val;
                        return g;
                      });
                    }}
                    className="w-12 mt-0.5 text-[10px] text-center bg-gray-900 text-yellow-300 rounded border border-gray-600 px-1"
                  />
                )}

                {cell.type === "RED" && (
                  <input
                    type="text"
                    placeholder="x?"
                    value={cell.multiplier ?? ""}
                    onClick={e => e.stopPropagation()}
                    onChange={e => {
                      const val = e.target.value;
                      setGrid(prev => {
                        const g = prev.map(r => r.map(c => ({ ...c })));
                        g[i][j].multiplier = val;
                        return g;
                      });
                    }}
                    className="w-12 mt-0.5 text-[10px] text-center bg-gray-900 text-red-300 rounded border border-gray-600 px-1"
                  />
                )}
              </div>
            );
          })
        )}
      </div>
    </div>
  );
}

// ─── CONTROL PANEL ────────────────────────────────────────────────────────────

type ControlPanelProps = {
  onCreate: (config: FeatureConfig) => void;
};

export function ControlPanel({ onCreate }: ControlPanelProps) {
  const [rows, setRows] = useState(4);
  const [cols, setCols] = useState(5);
  const [selectedCoins, setSelectedCoins] = useState<CoinConfig[]>([]);

  const toggleCoin = (coin: CoinConfig) => {
    setSelectedCoins(prev => {
      const exists = prev.find(c => c.name === coin.name);
      return exists ? prev.filter(c => c.name !== coin.name) : [...prev, coin];
    });
  };

  const handleCreate = () => {
    if (selectedCoins.length === 0) return;
    onCreate({
      rows,
      cols,
      spins: 3,
      coins: [{ name: "EMPTY", color: "gray" }, ...selectedCoins],
    });
  };

  return (
    <div className="bg-gray-900 border border-gray-700 rounded-xl p-5 space-y-4">
      <div className="text-white font-bold text-sm tracking-widest uppercase opacity-60">Configure Game</div>

      <div className="flex gap-4 items-center">
        <label className="text-gray-400 text-xs">Rows</label>
        <input
          type="number"
          value={rows}
          min={1} max={10}
          onChange={e => setRows(Number(e.target.value))}
          className="w-16 border border-gray-600 bg-gray-800 text-white px-2 py-1 rounded text-sm"
        />
        <label className="text-gray-400 text-xs">Cols</label>
        <input
          type="number"
          value={cols}
          min={1} max={10}
          onChange={e => setCols(Number(e.target.value))}
          className="w-16 border border-gray-600 bg-gray-800 text-white px-2 py-1 rounded text-sm"
        />
      </div>

      <div>
        <div className="text-gray-400 text-xs mb-2">Symbols</div>
        <div className="flex gap-2 flex-wrap">
          {ALL_COINS.map(c => {
            const selected = !!selectedCoins.find(sc => sc.name === c.name);
            return (
              <button
                key={c.name}
                onClick={() => toggleCoin(c)}
                className={`px-3 py-1.5 rounded-lg text-sm font-medium border transition-colors ${
                  selected
                    ? "bg-blue-500 border-blue-400 text-white"
                    : "bg-gray-800 border-gray-600 text-gray-300 hover:border-gray-400"
                }`}
              >
                {COIN_EMOJI[c.name] ?? "•"} {c.name}
              </button>
            );
          })}
        </div>
      </div>

      <button
        onClick={handleCreate}
        disabled={selectedCoins.length === 0}
        className="bg-blue-600 hover:bg-blue-500 disabled:opacity-40 disabled:cursor-not-allowed text-white px-5 py-2 rounded-lg text-sm font-semibold transition-colors"
      >
        Create Grid
      </button>
    </div>
  );
}

// ─── SCHEMA BUILDER ───────────────────────────────────────────────────────────

type SchemaBuilderProps = {
  fields: SchemaField[];
  setFields: React.Dispatch<React.SetStateAction<SchemaField[]>>;
  availableCoins: CoinConfig[];
};

export function SchemaBuilder({ fields, setFields, availableCoins }: SchemaBuilderProps) {

  const updateField = (index: number, patch: Partial<SchemaField>) => {
    setFields(prev => prev.map((f, i) => i === index ? { ...f, ...patch } : f));
  };

  const removeField = (index: number) => {
    setFields(prev => prev.filter((_, i) => i !== index));
  };

  const addField = () => {
    setFields(prev => [...prev, {
      key: `field${prev.length + 1}`,
      type: "coin",
      coinType: availableCoins[0]?.name ?? "",
      positionFormat: "colRow",
      includeValue: false,
    }]);
  };

  const moveField = (index: number, dir: -1 | 1) => {
    setFields(prev => {
      const arr = [...prev];
      const swap = index + dir;
      if (swap < 0 || swap >= arr.length) return arr;
      [arr[index], arr[swap]] = [arr[swap], arr[index]];
      return arr;
    });
  };

  const coinOptions = availableCoins.filter(c => c.name !== "EMPTY");

  return (
    <div className="space-y-2">
      {fields.map((field, index) => (
        <div
          key={index}
          className="bg-gray-800 border border-gray-700 rounded-lg p-3 space-y-2"
        >
          {/* Row 1: key name + type + move/delete */}
          <div className="flex gap-2 items-center">
            {/* Key name */}
            <input
              value={field.key}
              onChange={e => updateField(index, { key: e.target.value })}
              placeholder="fieldName"
              className="flex-1 bg-gray-900 border border-gray-600 text-white text-sm px-2 py-1 rounded font-mono"
            />

            {/* Type selector */}
            <select
              value={field.type}
              onChange={e => updateField(index, { type: e.target.value as SchemaFieldType })}
              className="bg-gray-900 border border-gray-600 text-blue-300 text-xs px-2 py-1 rounded"
            >
              {FIELD_TYPES.map(t => (
                <option key={t} value={t}>{t}</option>
              ))}
            </select>

            {/* Move up/down */}
            <button onClick={() => moveField(index, -1)} className="text-gray-400 hover:text-white text-xs px-1">▲</button>
            <button onClick={() => moveField(index, 1)} className="text-gray-400 hover:text-white text-xs px-1">▼</button>

            {/* Remove */}
            <button
              onClick={() => removeField(index)}
              className="text-red-500 hover:text-red-400 text-xs px-1 font-bold"
            >✕</button>
          </div>

          {/* Row 2: type-specific options */}
          <div className="flex flex-wrap gap-2 items-center">

            {/* COIN: coin type filter + position format + include value */}
            {field.type === "coin" && (
              <>
                <div className="flex items-center gap-1">
                  <span className="text-gray-500 text-[10px]">symbol</span>
                  <select
                    value={field.coinType ?? ""}
                    onChange={e => updateField(index, { coinType: e.target.value })}
                    className="bg-gray-900 border border-gray-600 text-yellow-300 text-xs px-2 py-1 rounded"
                  >
                    <option value="">any</option>
                    {coinOptions.map(c => (
                      <option key={c.name} value={c.name}>{c.name}</option>
                    ))}
                  </select>
                </div>
                <PositionFormatSelect value={field.positionFormat ?? "colRow"} onChange={v => updateField(index, { positionFormat: v })} />
                <Toggle label="+ value" value={!!field.includeValue} onChange={v => updateField(index, { includeValue: v })} />
              </>
            )}

            {/* REEL STOPS: position format */}
            {field.type === "reelStops" && (
              <PositionFormatSelect value={field.positionFormat ?? "colRow"} onChange={v => updateField(index, { positionFormat: v })} />
            )}

            {/* MULTIPLIER: position format + include multiplier value */}
            {field.type === "multiplier" && (
              <>
                <PositionFormatSelect value={field.positionFormat ?? "colRow"} onChange={v => updateField(index, { positionFormat: v })} />
                <Toggle label="+ multiplier val" value={!!field.includeMultiplier} onChange={v => updateField(index, { includeMultiplier: v })} />
              </>
            )}

            {/* STATIC: value input */}
            {field.type === "static" && (
              <div className="flex items-center gap-1 flex-1">
                <span className="text-gray-500 text-[10px]">value</span>
                <input
                  value={String(field.staticValue ?? "")}
                  onChange={e => {
                    const raw = e.target.value;
                    const val = raw === "true" ? true : raw === "false" ? false : isNaN(Number(raw)) ? raw : raw === "" ? "" : Number(raw);
                    updateField(index, { staticValue: val });
                  }}
                  className="flex-1 bg-gray-900 border border-gray-600 text-green-300 text-xs px-2 py-1 rounded font-mono"
                  placeholder="true / false / 42 / text"
                />
              </div>
            )}

            {/* CUSTOM: JS expression */}
            {field.type === "custom" && (
              <div className="flex items-center gap-1 flex-1">
                <span className="text-gray-500 text-[10px]">expr</span>
                <input
                  value={field.customExpr ?? ""}
                  onChange={e => updateField(index, { customExpr: e.target.value })}
                  className="flex-1 bg-gray-900 border border-gray-600 text-purple-300 text-xs px-2 py-1 rounded font-mono"
                  placeholder="grid.flat().filter(c=>c.type!=='EMPTY').length"
                />
              </div>
            )}
          </div>
        </div>
      ))}

      <button
        onClick={addField}
        className="w-full border border-dashed border-gray-600 text-gray-400 hover:text-white hover:border-gray-400 text-xs py-2 rounded-lg transition-colors"
      >
        + Add Field
      </button>
    </div>
  );
}

// ─── SUB-COMPONENTS ───────────────────────────────────────────────────────────

function PositionFormatSelect({ value, onChange }: { value: PositionFormat; onChange: (v: PositionFormat) => void }) {
  return (
    <div className="flex items-center gap-1">
      <span className="text-gray-500 text-[10px]">pos</span>
      <select
        value={value}
        onChange={e => onChange(e.target.value as PositionFormat)}
        className="bg-gray-900 border border-gray-600 text-cyan-300 text-xs px-2 py-1 rounded"
      >
        {POSITION_FORMATS.map(f => (
          <option key={f.value} value={f.value}>{f.label}</option>
        ))}
      </select>
    </div>
  );
}

function Toggle({ label, value, onChange }: { label: string; value: boolean; onChange: (v: boolean) => void }) {
  return (
    <button
      onClick={() => onChange(!value)}
      className={`text-xs px-2 py-1 rounded border transition-colors ${
        value
          ? "bg-green-800 border-green-600 text-green-300"
          : "bg-gray-900 border-gray-600 text-gray-500 hover:border-gray-400"
      }`}
    >
      {label}
    </button>
  );
}

// ─── OUTPUT PANEL ─────────────────────────────────────────────────────────────

type OutputPanelProps = {
  outputs: string[];
  referenceOutput: string | null;
  onSetReference: () => void;
  currentPreview: string;
};

export function OutputPanel({ outputs, referenceOutput, onSetReference, currentPreview }: OutputPanelProps) {
  const [tab, setTab] = useState<"history" | "reference">("history");

  return (
    <div className="flex flex-col h-full bg-gray-950 border border-gray-700 rounded-xl overflow-hidden">
      {/* Tabs */}
      <div className="flex border-b border-gray-700">
        <TabBtn label="History" active={tab === "history"} onClick={() => setTab("history")} />
        <TabBtn label="Reference" active={tab === "reference"} onClick={() => setTab("reference")} badge={referenceOutput ? "✓" : undefined} />
      </div>

      {/* Live preview */}
      <div className="border-b border-gray-700 px-3 py-2 bg-gray-900">
        <div className="text-[9px] text-gray-500 uppercase tracking-widest mb-1">Live preview</div>
        <pre className="text-[11px] text-green-400 font-mono overflow-x-auto whitespace-pre-wrap">{currentPreview || "—"}</pre>
      </div>

      <div className="flex-1 overflow-y-auto p-3">
        {tab === "history" && (
          outputs.length === 0
            ? <div className="text-gray-600 text-xs text-center mt-8">No spins yet</div>
            : outputs.map((o, i) => (
                <div key={i} className="mb-4">
                  <div className="text-[9px] text-gray-600 mb-1">Spin #{i + 1}</div>
                  <pre className="text-[11px] text-green-300 font-mono whitespace-pre-wrap">{o}</pre>
                </div>
              ))
        )}

        {tab === "reference" && (
          referenceOutput
            ? <pre className="text-[11px] text-yellow-300 font-mono whitespace-pre-wrap">{referenceOutput}</pre>
            : <div className="text-gray-600 text-xs text-center mt-8">No reference set yet.<br />Configure the grid and click Set as Reference.</div>
        )}
      </div>

      <div className="border-t border-gray-700 p-3">
        <button
          onClick={onSetReference}
          className="w-full bg-yellow-700 hover:bg-yellow-600 text-yellow-100 text-xs py-2 rounded-lg font-semibold transition-colors"
        >
          📌 Set Current as Reference
        </button>
      </div>
    </div>
  );
}

function TabBtn({ label, active, onClick, badge }: { label: string; active: boolean; onClick: () => void; badge?: string }) {
  return (
    <button
      onClick={onClick}
      className={`flex-1 text-xs py-2 px-3 font-medium transition-colors ${
        active ? "bg-gray-800 text-white border-b-2 border-blue-500" : "text-gray-500 hover:text-gray-300"
      }`}
    >
      {label} {badge && <span className="text-green-400 ml-1">{badge}</span>}
    </button>
  );
}