// "use client";

// import { useState, useEffect } from "react";
// import {
//   Cell,
//   CoinConfig,
//   FeatureConfig,
//   FeatureProfile,
//   PositionOrder,
//   SequenceMode,
//   SchemaField,
//   SchemaFieldType,
//   PositionFormat,
//   PrizePart,
//   collectTagDefs,
//   loadFeatureProfiles,
//   saveFeatureProfile,
//   deleteFeatureProfile,
//   gridIndex,
//   formatIndex,
// } from "./logic";

// // ─── CONSTANTS ────────────────────────────────────────────────────────────────

// export const COIN_EMOJI: Record<string, string> = {
//   GOLD: "🟡",
//   RED: "🔴",
//   BLUE: "🔵",
//   PURPLE: "🟣",
//   "COLORED SCAT": "🌈",
// };

// export const ALL_COINS: CoinConfig[] = [
//   { name: "RED",          color: "red",         hasMultiplier: true },
//   { name: "GOLD",         color: "gold",         hasValue: true },
//   { name: "BLUE",         color: "blue" },
//   { name: "PURPLE",       color: "purple",       hasValue: true },
//   { name: "COLORED SCAT", color: "coloredScat",  hasValue: true },
// ];

// const FIELD_TYPES: SchemaFieldType[] = ["reelStops", "coin", "coinPrize", "multiplier", "static", "custom"];

// const POSITION_FORMATS: { value: PositionFormat; label: string }[] = [
//   { value: "colRow",            label: "[col, row]" },
//   { value: "rowCol",            label: "[row, col]" },
//   { value: "flatIndexRowMajor", label: "Horizontal position" },
//   { value: "flatIndex",         label: "Vertical position" },
// ];

// // ─── GENERIC GRID ─────────────────────────────────────────────────────────────

// type GridProps = {
//   grid: Cell[][];
//   setGrid: React.Dispatch<React.SetStateAction<Cell[][]>>;
//   coins: CoinConfig[];
//   positionOrder: PositionOrder;
//   fields: SchemaField[];
// };

// export function GenericGrid({ grid, setGrid, coins, positionOrder, fields }: GridProps) {
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
//         label: undefined,
//         tags: current.tags, // keep any tags the user already set while cycling symbols
//       };
//       return newGrid;
//     });
//   };

//   const tagDefs = collectTagDefs(fields);
//   const needsTextLabel = fields.some(
//     f => f.type === "coinPrize" && (f.prizeTemplate ?? []).some(p => p.kind === "prizeValue" && p.valueType === "text")
//   );

//   return (
//     <div className="bg-gray-800 p-4 rounded-xl border border-gray-700">
//       <div
//         className="grid gap-3 justify-center"
//         style={{ gridTemplateColumns: `repeat(${grid[0].length}, 84px)` }}
//       >
//         {grid.map((row, i) =>
//           row.map((cell, j) => {
//             const rows = grid.length;
//             const cols = grid[0].length;
//             const idx = gridIndex(i, j, rows, cols, positionOrder);
//             const label = formatIndex(idx, rows * cols);
//             return (
//               <div
//                 key={`${i}-${j}`}
//                 onClick={() => handleClick(i, j)}
//                 className="
//                   w-[84px] min-h-[84px] bg-gray-700 hover:bg-gray-600
//                   text-white rounded-lg flex flex-col items-center
//                   justify-center cursor-pointer transition-all
//                   duration-150 shadow-md hover:scale-105 select-none
//                   pb-1
//                 "
//               >
//                 <div className="text-[9px] opacity-50 leading-none">#{label}</div>
//                 <div className="text-[9px] opacity-40 leading-none">({j},{i})</div>
//                 <div className="text-2xl mt-1 leading-none">{COIN_EMOJI[cell.type] ?? "⬜"}</div>
//                 <div className="text-[9px] opacity-60 mt-0.5">{cell.type === "EMPTY" ? "" : cell.type}</div>

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
//                     className="w-12 mt-0.5 text-[10px] text-center bg-gray-900 text-yellow-300 rounded border border-gray-600 px-1"
//                   />
//                 )}

//                 {cell.type === "RED" && (
//                   <input
//                     type="text"
//                     placeholder="x?"
//                     value={cell.multiplier ?? ""}
//                     onClick={e => e.stopPropagation()}
//                     onChange={e => {
//                       const val = e.target.value;
//                       setGrid(prev => {
//                         const g = prev.map(r => r.map(c => ({ ...c })));
//                         g[i][j].multiplier = val;
//                         return g;
//                       });
//                     }}
//                     className="w-12 mt-0.5 text-[10px] text-center bg-gray-900 text-red-300 rounded border border-gray-600 px-1"
//                   />
//                 )}

//                 {cell.type !== "EMPTY" && needsTextLabel && (
//                   <input
//                     type="text"
//                     placeholder="prize label"
//                     value={cell.label ?? ""}
//                     onClick={e => e.stopPropagation()}
//                     onChange={e => {
//                       const val = e.target.value;
//                       setGrid(prev => {
//                         const g = prev.map(r => r.map(c => ({ ...c })));
//                         g[i][j].label = val;
//                         return g;
//                       });
//                     }}
//                     className="w-16 mt-0.5 text-[9px] text-center bg-gray-900 text-cyan-300 rounded border border-gray-600 px-1"
//                   />
//                 )}

//                 {cell.type !== "EMPTY" && tagDefs.map(tagDef => (
//                   tagDef.options && tagDef.options.length > 0 ? (
//                     <select
//                       key={tagDef.name}
//                       value={cell.tags?.[tagDef.name] ?? ""}
//                       onClick={e => e.stopPropagation()}
//                       onChange={e => {
//                         const val = e.target.value;
//                         setGrid(prev => {
//                           const g = prev.map(r => r.map(c => ({ ...c, tags: { ...c.tags } })));
//                           g[i][j].tags = { ...(g[i][j].tags ?? {}), [tagDef.name]: val };
//                           return g;
//                         });
//                       }}
//                       className="w-16 mt-0.5 text-[9px] text-center bg-gray-900 text-purple-300 rounded border border-gray-600 px-0.5"
//                     >
//                       <option value="">{tagDef.name}?</option>
//                       {tagDef.options.map(opt => <option key={opt} value={opt}>{opt}</option>)}
//                     </select>
//                   ) : (
//                     <input
//                       key={tagDef.name}
//                       type="text"
//                       placeholder={tagDef.name}
//                       value={cell.tags?.[tagDef.name] ?? ""}
//                       onClick={e => e.stopPropagation()}
//                       onChange={e => {
//                         const val = e.target.value;
//                         setGrid(prev => {
//                           const g = prev.map(r => r.map(c => ({ ...c, tags: { ...c.tags } })));
//                           g[i][j].tags = { ...(g[i][j].tags ?? {}), [tagDef.name]: val };
//                           return g;
//                         });
//                       }}
//                       className="w-16 mt-0.5 text-[9px] text-center bg-gray-900 text-purple-300 rounded border border-gray-600 px-1"
//                     />
//                   )
//                 ))}
//               </div>
//             );
//           })
//         )}
//       </div>
//     </div>
//   );
// }

// // ─── CONTROL PANEL ────────────────────────────────────────────────────────────

// const FIELD_TYPE_LABELS: Record<SchemaFieldType, string> = {
//   reelStops: "Reel Stop Positions",
//   coin: "Coin Position",
//   coinPrize: "Coin Prize (custom)",
//   multiplier: "Multiplier Value",
//   static: "Static Value",
//   custom: "Custom Expression",
// };

// type ControlPanelProps = {
//   onCreate: (config: FeatureConfig) => void;
//   fields: SchemaField[];
//   setFields: React.Dispatch<React.SetStateAction<SchemaField[]>>;
// };

// export function ControlPanel({ onCreate, fields, setFields }: ControlPanelProps) {
//   const [mode, setMode] = useState<"new" | "saved">("new");
//   const [profiles, setProfiles] = useState<FeatureProfile[]>([]);

//   const [name, setName] = useState("");
//   const [rows, setRows] = useState(4);
//   const [cols, setCols] = useState(5);
//   const [positionOrder, setPositionOrder] = useState<PositionOrder>("vertical");
//   const [sequenceMode, setSequenceMode] = useState<SequenceMode>("full");
//   const [reelStopActiveValue, setReelStopActiveValue] = useState(1);
//   const [reelStopEmptyValue, setReelStopEmptyValue] = useState(0);
//   const [selectedCoins, setSelectedCoins] = useState<CoinConfig[]>([]);

//   // Load saved profiles once on mount (localStorage isn't available during SSR).
//   // useEffect(() => {
//   //   setProfiles(loadFeatureProfiles());
//   // }, []);

//   // Any parameter linked to the grid's index order follows it automatically.
//   useEffect(() => {
//     const linkedFormat: PositionFormat = positionOrder === "horizontal" ? "flatIndexRowMajor" : "flatIndex";
//     setFields(prev =>
//       prev.some(f => f.useGridOrder)
//         ? prev.map(f => (f.useGridOrder ? { ...f, positionFormat: linkedFormat } : f))
//         : prev
//     );
//   }, [positionOrder, setFields]);

//   const toggleCoin = (coin: CoinConfig) => {
//     setSelectedCoins(prev => {
//       const exists = prev.find(c => c.name === coin.name);
//       return exists ? prev.filter(c => c.name !== coin.name) : [...prev, coin];
//     });
//   };

//   const normalizeReelStopsFields = (flds: SchemaField[], order: PositionOrder): SchemaField[] =>
//     flds.map(f =>
//       f.type === "reelStops"
//         ? { ...f, useGridOrder: true, positionFormat: order === "horizontal" ? "flatIndexRowMajor" : "flatIndex" }
//         : f
//     );

//   const applyProfile = (p: FeatureProfile) => {
//     setName(p.name);
//     setRows(p.rows);
//     setCols(p.cols);
//     setPositionOrder(p.positionOrder);
//     setSequenceMode(p.sequenceMode ?? "full");
//     setReelStopActiveValue(p.reelStopActiveValue ?? 1);
//     setReelStopEmptyValue(p.reelStopEmptyValue ?? 0);
//     setSelectedCoins(p.coins);
//     setFields(normalizeReelStopsFields(p.fields && p.fields.length > 0 ? p.fields : [], p.positionOrder));
//     setMode("new");
//   };

//   const handleDeleteProfile = (n: string, e: React.MouseEvent) => {
//     e.stopPropagation();
//     setProfiles(deleteFeatureProfile(n));
//   };

//   const startNewFeature = () => {
//     setName("");
//     setRows(4);
//     setCols(5);
//     setPositionOrder("vertical");
//     setSequenceMode("full");
//     setReelStopActiveValue(1);
//     setReelStopEmptyValue(0);
//     setSelectedCoins([]);
//     setFields([]);
//     setMode("new");
//   };

//   const handleCreate = () => {
//     if (selectedCoins.length === 0 || !name.trim()) return;

//     const normalizedFields = normalizeReelStopsFields(fields, positionOrder);
//     if (normalizedFields !== fields) setFields(normalizedFields);

//     const profile: FeatureProfile = {
//       name: name.trim(),
//       rows,
//       cols,
//       positionOrder,
//       sequenceMode,
//       reelStopActiveValue,
//       reelStopEmptyValue,
//       coins: selectedCoins,
//       fields: normalizedFields,
//       spins: 3,
//       savedAt: Date.now(),
//     };
//     setProfiles(saveFeatureProfile(profile));

//     onCreate({
//       name: profile.name,
//       rows,
//       cols,
//       spins: 3,
//       positionOrder,
//       sequenceMode,
//       reelStopActiveValue,
//       reelStopEmptyValue,
//       coins: [{ name: "EMPTY", color: "gray" }, ...selectedCoins],
//     });
//   };

//   const previewSample = (order: PositionOrder) => {
//     // Small 2x3-ish sample sequence to illustrate the order, independent of actual grid size.
//     const sampleRows = 2, sampleCols = 3;
//     const cells: string[] = [];
//     for (let i = 0; i < sampleRows; i++)
//       for (let j = 0; j < sampleCols; j++)
//         cells.push(formatIndex(gridIndex(i, j, sampleRows, sampleCols, order), sampleRows * sampleCols));
//     return order === "horizontal"
//       ? `${cells[0]},${cells[1]},${cells[2]}…`
//       : `${cells[0]},${cells[3]}…`;
//   };

//   const orderToFormat = (order: PositionOrder): PositionFormat =>
//     order === "horizontal" ? "flatIndexRowMajor" : "flatIndex";

//   // Reel Stop Positions has no independent notion of position — it's always
//   // the grid's own Horizontal/Vertical order, so lock it in as soon as this
//   // type is picked.
//   const handleTypeChange = (index: number, type: SchemaFieldType) => {
//     if (type === "reelStops") {
//       updateField(index, { type, useGridOrder: true, positionFormat: orderToFormat(positionOrder) });
//     } else if (type === "coinPrize") {
//       updateField(index, { type, prizeTemplate: fields[index]?.prizeTemplate ?? [] });
//     } else {
//       updateField(index, { type });
//     }
//   };

//   // ── Prize template (coinPrize) editing ──
//   const addPrizePart = (fieldIndex: number) => {
//     setFields(prev => prev.map((f, i) =>
//       i === fieldIndex ? { ...f, prizeTemplate: [...(f.prizeTemplate ?? []), { kind: "row" } as PrizePart] } : f
//     ));
//   };

//   const setPrizePart = (fieldIndex: number, partIndex: number, part: PrizePart) => {
//     setFields(prev => prev.map((f, i) => {
//       if (i !== fieldIndex) return f;
//       const template = [...(f.prizeTemplate ?? [])];
//       template[partIndex] = part;
//       return { ...f, prizeTemplate: template };
//     }));
//   };

//   const removePrizePart = (fieldIndex: number, partIndex: number) => {
//     setFields(prev => prev.map((f, i) =>
//       i === fieldIndex ? { ...f, prizeTemplate: (f.prizeTemplate ?? []).filter((_, pi) => pi !== partIndex) } : f
//     ));
//   };

//   const movePrizePart = (fieldIndex: number, partIndex: number, dir: -1 | 1) => {
//     setFields(prev => prev.map((f, i) => {
//       if (i !== fieldIndex) return f;
//       const template = [...(f.prizeTemplate ?? [])];
//       const swap = partIndex + dir;
//       if (swap < 0 || swap >= template.length) return f;
//       [template[partIndex], template[swap]] = [template[swap], template[partIndex]];
//       return { ...f, prizeTemplate: template };
//     }));
//   };

//   const prizePartLabel = (part: PrizePart): string => {
//     switch (part.kind) {
//       case "row": return "row";
//       case "col": return "col";
//       case "flatPosition": return "pos";
//       case "prizeValue": return part.valueType === "text" ? "prize" : "prize#";
//       case "tag": return part.tagName || "tag";
//       case "static": return String(part.value);
//       default: return "?";
//     }
//   };

//   // ── Parameter (schema field) editing ──
//   const updateField = (index: number, patch: Partial<SchemaField>) => {
//     setFields(prev => prev.map((f, i) => i === index ? { ...f, ...patch } : f));
//   };

//   const removeField = (index: number) => {
//     setFields(prev => prev.filter((_, i) => i !== index));
//   };

//   const addField = () => {
//     setFields(prev => [...prev, {
//       key: `parameter${prev.length + 1}`,
//       type: "coin",
//       coinType: selectedCoins[0]?.name ?? "",
//       positionFormat: "colRow",
//       includeValue: false,
//     }]);
//   };

//   const moveField = (index: number, dir: -1 | 1) => {
//     setFields(prev => {
//       const arr = [...prev];
//       const swap = index + dir;
//       if (swap < 0 || swap >= arr.length) return arr;
//       [arr[index], arr[swap]] = [arr[swap], arr[index]];
//       return arr;
//     });
//   };

//   return (
//     <div className="bg-gray-900 border border-gray-700 rounded-xl p-5 space-y-4">
//       <div className="flex items-center gap-3">
//         <div className="text-white font-bold text-sm tracking-widest uppercase opacity-60">Configure Game</div>
//         {profiles.length > 0 && (
//           <div className="ml-auto flex gap-1 text-xs">
//             <button
//               onClick={startNewFeature}
//               className={`px-3 py-1 rounded-md border transition-colors ${
//                 mode === "new" ? "bg-blue-500 border-blue-400 text-white" : "bg-gray-800 border-gray-600 text-gray-400 hover:border-gray-400"
//               }`}
//             >
//               New Feature
//             </button>
//             <button
//               onClick={() => setMode("saved")}
//               className={`px-3 py-1 rounded-md border transition-colors ${
//                 mode === "saved" ? "bg-blue-500 border-blue-400 text-white" : "bg-gray-800 border-gray-600 text-gray-400 hover:border-gray-400"
//               }`}
//             >
//               Saved ({profiles.length})
//             </button>
//           </div>
//         )}
//       </div>

//       {mode === "saved" ? (
//         <div className="space-y-2">
//           {profiles.length === 0 ? (
//             <div className="text-gray-600 text-xs text-center py-4">No saved features yet.</div>
//           ) : (
//             profiles.map(p => (
//               <button
//                 key={p.name}
//                 onClick={() => applyProfile(p)}
//                 className="w-full flex items-center gap-3 bg-gray-800 hover:bg-gray-750 border border-gray-700 hover:border-gray-500 rounded-lg px-3 py-2 text-left transition-colors"
//               >
//                 <span className="text-white text-sm font-semibold flex-1 truncate">{p.name}</span>
//                 <span className="text-gray-500 text-xs">
//                   {p.rows}×{p.cols} · {p.positionOrder} · {p.sequenceMode === "cascade" ? "active-only" : "full"} · {p.reelStopActiveValue ?? 1}/{p.reelStopEmptyValue ?? 0} · {p.coins.map(c => c.name).join(", ")} · {p.fields?.length ?? 0} params
//                 </span>
//                 <span
//                   onClick={e => handleDeleteProfile(p.name, e)}
//                   className="text-red-500 hover:text-red-400 text-xs font-bold px-1"
//                   title="Delete"
//                 >
//                   ✕
//                 </span>
//               </button>
//             ))
//           )}
//         </div>
//       ) : (
//         <>
//           <div className="flex gap-4 items-center">
//             <label className="text-gray-400 text-xs">Feature name</label>
//             <input
//               type="text"
//               value={name}
//               onChange={e => setName(e.target.value)}
//               placeholder="e.g. Golden Coin Hold & Win"
//               className="flex-1 border border-gray-600 bg-gray-800 text-white px-2 py-1 rounded text-sm"
//             />
//           </div>

//           <div className="flex gap-4 items-center">
//             <label className="text-gray-400 text-xs">Rows</label>
//             <input
//               type="number"
//               value={rows}
//               min={1} max={10}
//               onChange={e => setRows(Number(e.target.value))}
//               className="w-16 border border-gray-600 bg-gray-800 text-white px-2 py-1 rounded text-sm"
//             />
//             <label className="text-gray-400 text-xs">Cols</label>
//             <input
//               type="number"
//               value={cols}
//               min={1} max={10}
//               onChange={e => setCols(Number(e.target.value))}
//               className="w-16 border border-gray-600 bg-gray-800 text-white px-2 py-1 rounded text-sm"
//             />
//           </div>

//           <div>
//             <div className="text-gray-400 text-xs mb-2">Index order (0-indexed)</div>
//             <div className="flex gap-2">
//               {(["horizontal", "vertical"] as PositionOrder[]).map(order => (
//                 <button
//                   key={order}
//                   onClick={() => setPositionOrder(order)}
//                   className={`px-3 py-1.5 rounded-lg text-sm font-medium border transition-colors capitalize ${
//                     positionOrder === order
//                       ? "bg-blue-500 border-blue-400 text-white"
//                       : "bg-gray-800 border-gray-600 text-gray-300 hover:border-gray-400"
//                   }`}
//                 >
//                   {order}
//                   <span className="opacity-60 font-mono text-xs ml-2">{previewSample(order)}</span>
//                 </button>
//               ))}
//             </div>
//           </div>

//           <div>
//             <div className="text-gray-400 text-xs mb-2">Reel stop sequencing</div>
//             <div className="flex gap-2">
//               <button
//                 onClick={() => setSequenceMode("full")}
//                 className={`px-3 py-1.5 rounded-lg text-sm font-medium border transition-colors text-left ${
//                   sequenceMode === "full"
//                     ? "bg-blue-500 border-blue-400 text-white"
//                     : "bg-gray-800 border-gray-600 text-gray-300 hover:border-gray-400"
//                 }`}
//               >
//                 Full Grid
//                 <div className="opacity-60 text-[10px] font-normal mt-0.5">Every spin lists all positions</div>
//               </button>
//               <button
//                 onClick={() => setSequenceMode("cascade")}
//                 className={`px-3 py-1.5 rounded-lg text-sm font-medium border transition-colors text-left ${
//                   sequenceMode === "cascade"
//                     ? "bg-blue-500 border-blue-400 text-white"
//                     : "bg-gray-800 border-gray-600 text-gray-300 hover:border-gray-400"
//                 }`}
//               >
//                 Active Only
//                 <div className="opacity-60 text-[10px] font-normal mt-0.5">Landed positions drop out of later spins</div>
//               </button>
//             </div>
//           </div>

//           <div>
//             <div className="text-gray-400 text-xs mb-2">Reel stop values</div>
//             <div className="flex items-center gap-4">
//               <div className="flex items-center gap-2">
//                 <span className="text-gray-500 text-[10px]">landed</span>
//                 <input
//                   type="number"
//                   value={reelStopActiveValue}
//                   onChange={e => setReelStopActiveValue(Number(e.target.value))}
//                   className="w-16 border border-gray-600 bg-gray-800 text-white px-2 py-1 rounded text-sm"
//                 />
//               </div>
//               <div className="flex items-center gap-2">
//                 <span className="text-gray-500 text-[10px]">empty</span>
//                 <input
//                   type="number"
//                   value={reelStopEmptyValue}
//                   onChange={e => setReelStopEmptyValue(Number(e.target.value))}
//                   className="w-16 border border-gray-600 bg-gray-800 text-white px-2 py-1 rounded text-sm"
//                 />
//               </div>
//               <span className="text-gray-600 text-[10px]">used per-position in Reel Stop Positions output</span>
//             </div>
//           </div>

//           <div>
//             <div className="text-gray-400 text-xs mb-2">Symbols</div>
//             <div className="flex gap-2 flex-wrap">
//               {ALL_COINS.map(c => {
//                 const selected = !!selectedCoins.find(sc => sc.name === c.name);
//                 return (
//                   <button
//                     key={c.name}
//                     onClick={() => toggleCoin(c)}
//                     className={`px-3 py-1.5 rounded-lg text-sm font-medium border transition-colors ${
//                       selected
//                         ? "bg-blue-500 border-blue-400 text-white"
//                         : "bg-gray-800 border-gray-600 text-gray-300 hover:border-gray-400"
//                     }`}
//                   >
//                     {COIN_EMOJI[c.name] ?? "•"} {c.name}
//                   </button>
//                 );
//               })}
//             </div>
//           </div>

//           {/* ── PARAMETERS ── */}
//           <div>
//             <div className="flex items-center mb-2">
//               <div className="text-gray-400 text-xs">Parameters</div>
//               <span className="text-gray-600 text-[10px] ml-2">— what each spin will output</span>
//             </div>

//             <div className="space-y-2">
//               {fields.map((field, index) => (
//                 <div
//                   key={index}
//                   className="bg-gray-800 border border-gray-700 rounded-lg p-3 space-y-2"
//                 >
//                   {/* Row 1: parameter name + value type + move/delete */}
//                   <div className="flex gap-2 items-center">
//                     <input
//                       value={field.key}
//                       onChange={e => updateField(index, { key: e.target.value })}
//                       placeholder="parameterName"
//                       className="flex-1 bg-gray-900 border border-gray-600 text-white text-sm px-2 py-1 rounded font-mono"
//                     />

//                     <select
//                       value={field.type}
//                       onChange={e => handleTypeChange(index, e.target.value as SchemaFieldType)}
//                       className="bg-gray-900 border border-gray-600 text-blue-300 text-xs px-2 py-1 rounded"
//                     >
//                       {FIELD_TYPES.map(t => (
//                         <option key={t} value={t}>{FIELD_TYPE_LABELS[t]}</option>
//                       ))}
//                     </select>

//                     <button onClick={() => moveField(index, -1)} className="text-gray-400 hover:text-white text-xs px-1">▲</button>
//                     <button onClick={() => moveField(index, 1)} className="text-gray-400 hover:text-white text-xs px-1">▼</button>

//                     <button
//                       onClick={() => removeField(index)}
//                       className="text-red-500 hover:text-red-400 text-xs px-1 font-bold"
//                     >✕</button>
//                   </div>

//                   {/* Row 2: value-type-specific options */}
//                   <div className="flex flex-wrap gap-2 items-center">

//                     {field.type === "coin" && (
//                       <>
//                         <div className="flex items-center gap-1">
//                           <span className="text-gray-500 text-[10px]">symbol</span>
//                           <select
//                             value={field.coinType ?? ""}
//                             onChange={e => updateField(index, { coinType: e.target.value })}
//                             className="bg-gray-900 border border-gray-600 text-yellow-300 text-xs px-2 py-1 rounded"
//                           >
//                             <option value="">any</option>
//                             {selectedCoins.map(c => (
//                               <option key={c.name} value={c.name}>{c.name}</option>
//                             ))}
//                           </select>
//                         </div>
//                         <PositionField field={field} positionOrder={positionOrder} onChange={patch => updateField(index, patch)} />
//                         <Toggle label="+ value" value={!!field.includeValue} onChange={v => updateField(index, { includeValue: v })} />
//                       </>
//                     )}

//                     {field.type === "reelStops" && (
//                       <span
//                         title="Reel Stop Positions always follows the grid's Index order — change it above to affect this"
//                         className="flex items-center gap-1 text-xs px-2 py-1 rounded border bg-cyan-900 border-cyan-600 text-cyan-300 capitalize"
//                       >
//                         🔗 {positionOrder} <span className="text-cyan-500">(grid index order)</span>
//                       </span>
//                     )}

//                     {field.type === "multiplier" && (
//                       <>
//                         <PositionField field={field} positionOrder={positionOrder} onChange={patch => updateField(index, patch)} />
//                         <Toggle label="+ multiplier val" value={!!field.includeMultiplier} onChange={v => updateField(index, { includeMultiplier: v })} />
//                       </>
//                     )}

//                     {field.type === "static" && (
//                       <div className="flex items-center gap-1 flex-1">
//                         <span className="text-gray-500 text-[10px]">value</span>
//                         <input
//                           value={String(field.staticValue ?? "")}
//                           onChange={e => {
//                             const raw = e.target.value;
//                             const val = raw === "true" ? true : raw === "false" ? false : isNaN(Number(raw)) ? raw : raw === "" ? "" : Number(raw);
//                             updateField(index, { staticValue: val });
//                           }}
//                           className="flex-1 bg-gray-900 border border-gray-600 text-green-300 text-xs px-2 py-1 rounded font-mono"
//                           placeholder="true / false / 42 / text"
//                         />
//                       </div>
//                     )}

//                     {field.type === "custom" && (
//                       <div className="flex items-center gap-1 flex-1">
//                         <span className="text-gray-500 text-[10px]">expr</span>
//                         <input
//                           value={field.customExpr ?? ""}
//                           onChange={e => updateField(index, { customExpr: e.target.value })}
//                           className="flex-1 bg-gray-900 border border-gray-600 text-purple-300 text-xs px-2 py-1 rounded font-mono"
//                           placeholder="grid.flat().filter(c=>c.type!=='EMPTY').length"
//                         />
//                       </div>
//                     )}
//                   </div>

//                   {field.type === "coinPrize" && (
//                     <div className="space-y-1.5 pt-1">
//                       <div className="flex items-center gap-1">
//                         <span className="text-gray-500 text-[10px]">symbol</span>
//                         <select
//                           value={field.coinType ?? ""}
//                           onChange={e => updateField(index, { coinType: e.target.value })}
//                           className="bg-gray-900 border border-gray-600 text-yellow-300 text-xs px-2 py-1 rounded"
//                         >
//                           <option value="">any</option>
//                           {selectedCoins.map(c => (
//                             <option key={c.name} value={c.name}>{c.name}</option>
//                           ))}
//                         </select>
//                       </div>

//                       {(field.prizeTemplate ?? []).map((part, pIndex) => (
//                         <PrizePartRow
//                           key={pIndex}
//                           part={part}
//                           onChange={p => setPrizePart(index, pIndex, p)}
//                           onRemove={() => removePrizePart(index, pIndex)}
//                           onMove={dir => movePrizePart(index, pIndex, dir)}
//                         />
//                       ))}

//                       <button
//                         onClick={() => addPrizePart(index)}
//                         className="w-full border border-dashed border-gray-600 text-gray-400 hover:text-white hover:border-gray-400 text-[10px] py-1 rounded transition-colors"
//                       >
//                         + Add Part
//                       </button>

//                       <div className="text-gray-600 text-[10px] font-mono">
//                         preview: [{(field.prizeTemplate ?? []).map(prizePartLabel).join(", ")}]
//                       </div>
//                     </div>
//                   )}
//                 </div>
//               ))}

//               <button
//                 onClick={addField}
//                 className="w-full border border-dashed border-gray-600 text-gray-400 hover:text-white hover:border-gray-400 text-xs py-2 rounded-lg transition-colors"
//               >
//                 + Add Parameter
//               </button>
//             </div>
//           </div>

//           <button
//             onClick={handleCreate}
//             disabled={selectedCoins.length === 0 || !name.trim()}
//             className="bg-blue-600 hover:bg-blue-500 disabled:opacity-40 disabled:cursor-not-allowed text-white px-5 py-2 rounded-lg text-sm font-semibold transition-colors"
//           >
//             Save &amp; Create Grid
//           </button>
//         </>
//       )}
//     </div>
//   );
// }

// // ─── SUB-COMPONENTS ───────────────────────────────────────────────────────────

// // Position control for a parameter: either linked to the grid's own
// // Horizontal/Vertical selection (shown as a tag, follows it automatically),
// // or set manually via the full position-format dropdown.
// function PositionField({
//   field,
//   positionOrder,
//   onChange,
// }: {
//   field: SchemaField;
//   positionOrder: PositionOrder;
//   onChange: (patch: Partial<SchemaField>) => void;
// }) {
//   const linkedFormat: PositionFormat = positionOrder === "horizontal" ? "flatIndexRowMajor" : "flatIndex";

//   if (field.useGridOrder) {
//     return (
//       <button
//         onClick={() => onChange({ useGridOrder: false })}
//         title="Linked to the grid's Horizontal/Vertical selection — click to set manually"
//         className="flex items-center gap-1 text-xs px-2 py-1 rounded border bg-cyan-900 border-cyan-600 text-cyan-300 capitalize"
//       >
//         🔗 {positionOrder}
//       </button>
//     );
//   }

//   return (
//     <div className="flex items-center gap-1">
//       <PositionFormatSelect value={field.positionFormat ?? "colRow"} onChange={v => onChange({ positionFormat: v })} />
//       <button
//         onClick={() => onChange({ useGridOrder: true, positionFormat: linkedFormat })}
//         title="Link to the grid's Horizontal/Vertical selection"
//         className="text-gray-500 hover:text-cyan-300 text-xs px-1"
//       >
//         🔗
//       </button>
//     </div>
//   );
// }

// function PositionFormatSelect({ value, onChange }: { value: PositionFormat; onChange: (v: PositionFormat) => void }) {
//   return (
//     <div className="flex items-center gap-1">
//       <span className="text-gray-500 text-[10px]">pos</span>
//       <select
//         value={value}
//         onChange={e => onChange(e.target.value as PositionFormat)}
//         className="bg-gray-900 border border-gray-600 text-cyan-300 text-xs px-2 py-1 rounded"
//       >
//         {POSITION_FORMATS.map(f => (
//           <option key={f.value} value={f.value}>{f.label}</option>
//         ))}
//       </select>
//     </div>
//   );
// }

// const PRIZE_PART_KINDS: { value: PrizePart["kind"]; label: string }[] = [
//   { value: "row", label: "Row" },
//   { value: "col", label: "Col" },
//   { value: "flatPosition", label: "Flat Position (grid order)" },
//   { value: "prizeValue", label: "Prize Value" },
//   { value: "tag", label: "Tag" },
//   { value: "static", label: "Static" },
// ];

// function PrizePartRow({
//   part,
//   onChange,
//   onRemove,
//   onMove,
// }: {
//   part: PrizePart;
//   onChange: (part: PrizePart) => void;
//   onRemove: () => void;
//   onMove: (dir: -1 | 1) => void;
// }) {
//   const handleKindChange = (kind: PrizePart["kind"]) => {
//     switch (kind) {
//       case "row": onChange({ kind: "row" }); break;
//       case "col": onChange({ kind: "col" }); break;
//       case "flatPosition": onChange({ kind: "flatPosition" }); break;
//       case "prizeValue": onChange({ kind: "prizeValue", valueType: "number" }); break;
//       case "tag": onChange({ kind: "tag", tagName: "", options: [] }); break;
//       case "static": onChange({ kind: "static", value: "" }); break;
//     }
//   };

//   return (
//     <div className="flex items-center gap-1 flex-wrap bg-gray-900 border border-gray-700 rounded px-2 py-1">
//       <select
//         value={part.kind}
//         onChange={e => handleKindChange(e.target.value as PrizePart["kind"])}
//         className="bg-gray-950 border border-gray-600 text-blue-300 text-[10px] px-1.5 py-0.5 rounded"
//       >
//         {PRIZE_PART_KINDS.map(o => <option key={o.value} value={o.value}>{o.label}</option>)}
//       </select>

//       {part.kind === "prizeValue" && (
//         <select
//           value={part.valueType}
//           onChange={e => onChange({ ...part, valueType: e.target.value as "number" | "text" })}
//           className="bg-gray-950 border border-gray-600 text-green-300 text-[10px] px-1.5 py-0.5 rounded"
//         >
//           <option value="number">number (cell value)</option>
//           <option value="text">text label</option>
//         </select>
//       )}

//       {part.kind === "tag" && (
//         <>
//           <input
//             value={part.tagName}
//             onChange={e => onChange({ ...part, tagName: e.target.value })}
//             placeholder="tag name e.g. direction"
//             className="bg-gray-950 border border-gray-600 text-cyan-300 text-[10px] px-1.5 py-0.5 rounded font-mono w-28"
//           />
//           <input
//             value={(part.options ?? []).join(",")}
//             onChange={e => onChange({ ...part, options: e.target.value.split(",") })}
//             placeholder="options e.g. LEFT, RIGHT"
//             className="bg-gray-950 border border-gray-600 text-cyan-200 text-[10px] px-1.5 py-0.5 rounded font-mono w-32"
//           />
//         </>
//       )}

//       {part.kind === "static" && (
//         <input
//           value={String(part.value)}
//           onChange={e => {
//             const raw = e.target.value;
//             const val = raw !== "" && !isNaN(Number(raw)) ? Number(raw) : raw;
//             onChange({ ...part, value: val });
//           }}
//           placeholder="value"
//           className="bg-gray-950 border border-gray-600 text-purple-300 text-[10px] px-1.5 py-0.5 rounded font-mono w-20"
//         />
//       )}

//       <div className="ml-auto flex items-center gap-1">
//         <button onClick={() => onMove(-1)} className="text-gray-500 hover:text-white text-[10px] px-1">▲</button>
//         <button onClick={() => onMove(1)} className="text-gray-500 hover:text-white text-[10px] px-1">▼</button>
//         <button onClick={onRemove} className="text-red-500 hover:text-red-400 text-[10px] px-1 font-bold">✕</button>
//       </div>
//     </div>
//   );
// }

// function Toggle({ label, value, onChange }: { label: string; value: boolean; onChange: (v: boolean) => void }) {
//   return (
//     <button
//       onClick={() => onChange(!value)}
//       className={`text-xs px-2 py-1 rounded border transition-colors ${
//         value
//           ? "bg-green-800 border-green-600 text-green-300"
//           : "bg-gray-900 border-gray-600 text-gray-500 hover:border-gray-400"
//       }`}
//     >
//       {label}
//     </button>
//   );
// }

// // ─── OUTPUT PANEL ─────────────────────────────────────────────────────────────

// type OutputPanelProps = {
//   outputs: string[];
//   referenceOutput: string | null;
//   onSetReference: () => void;
//   currentPreview: string;
// };

// export function OutputPanel({ outputs, referenceOutput, onSetReference, currentPreview }: OutputPanelProps) {
//   const [tab, setTab] = useState<"history" | "reference">("history");

//   return (
//     <div className="flex flex-col h-full bg-gray-950 border border-gray-700 rounded-xl overflow-hidden">
//       {/* Tabs */}
//       <div className="flex border-b border-gray-700">
//         <TabBtn label="History" active={tab === "history"} onClick={() => setTab("history")} />
//         <TabBtn label="Reference" active={tab === "reference"} onClick={() => setTab("reference")} badge={referenceOutput ? "✓" : undefined} />
//       </div>

//       {/* Live preview */}
//       <div className="border-b border-gray-700 px-3 py-2 bg-gray-900">
//         <div className="text-[9px] text-gray-500 uppercase tracking-widest mb-1">Live preview</div>
//         <pre className="text-[11px] text-green-400 font-mono overflow-x-auto whitespace-pre-wrap">{currentPreview || "—"}</pre>
//       </div>

//       <div className="flex-1 overflow-y-auto p-3">
//         {tab === "history" && (
//           outputs.length === 0
//             ? <div className="text-gray-600 text-xs text-center mt-8">No spins yet</div>
//             : outputs.map((o, i) => (
//                 <div key={i} className="mb-4">
//                   <div className="text-[9px] text-gray-600 mb-1">Spin #{i + 1}</div>
//                   <pre className="text-[11px] text-green-300 font-mono whitespace-pre-wrap">{o}</pre>
//                 </div>
//               ))
//         )}

//         {tab === "reference" && (
//           referenceOutput
//             ? <pre className="text-[11px] text-yellow-300 font-mono whitespace-pre-wrap">{referenceOutput}</pre>
//             : <div className="text-gray-600 text-xs text-center mt-8">No reference set yet.<br />Configure the grid and click Set as Reference.</div>
//         )}
//       </div>

//       <div className="border-t border-gray-700 p-3">
//         <button
//           onClick={onSetReference}
//           className="w-full bg-yellow-700 hover:bg-yellow-600 text-yellow-100 text-xs py-2 rounded-lg font-semibold transition-colors"
//         >
//           📌 Set Current as Reference
//         </button>
//       </div>
//     </div>
//   );
// }

// function TabBtn({ label, active, onClick, badge }: { label: string; active: boolean; onClick: () => void; badge?: string }) {
//   return (
//     <button
//       onClick={onClick}
//       className={`flex-1 text-xs py-2 px-3 font-medium transition-colors ${
//         active ? "bg-gray-800 text-white border-b-2 border-blue-500" : "text-gray-500 hover:text-gray-300"
//       }`}
//     >
//       {label} {badge && <span className="text-green-400 ml-1">{badge}</span>}
//     </button>
//   );
// }



"use client";

import { useState, useEffect } from "react";
import {
  Cell,
  CoinConfig,
  FeatureConfig,
  FeatureProfile,
  PositionOrder,
  SequenceMode,
  SchemaField,
  SchemaFieldType,
  PositionFormat,
  PrizePart,
  collectTagDefs,
  loadFeatureProfiles,
  saveFeatureProfile,
  deleteFeatureProfile,
  gridIndex,
  formatIndex,
} from "./logic";

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

const FIELD_TYPES: SchemaFieldType[] = ["reelStops", "coin", "coinPrize", "multiplier", "static", "custom"];

const POSITION_FORMATS: { value: PositionFormat; label: string }[] = [
  { value: "colRow",            label: "[col, row]" },
  { value: "rowCol",            label: "[row, col]" },
  { value: "flatIndexRowMajor", label: "Horizontal position" },
  { value: "flatIndex",         label: "Vertical position" },
];

// ─── GENERIC GRID ─────────────────────────────────────────────────────────────

type GridProps = {
  grid: Cell[][];
  setGrid: React.Dispatch<React.SetStateAction<Cell[][]>>;
  coins: CoinConfig[];
  positionOrder: PositionOrder;
  fields: SchemaField[];
};

export function GenericGrid({ grid, setGrid, coins, positionOrder, fields }: GridProps) {
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
        label: undefined,
        tags: current.tags, // keep any tags the user already set while cycling symbols
      };
      return newGrid;
    });
  };

  const tagDefs = collectTagDefs(fields);
  const needsTextLabel = fields.some(
    f => f.type === "coinPrize" && (f.prizeTemplate ?? []).some(p => p.kind === "prizeValue" && p.valueType === "text")
  );

  return (
    <div className="bg-gray-800 p-4 rounded-xl border border-gray-700">
      <div
        className="grid gap-3 justify-center"
        style={{ gridTemplateColumns: `repeat(${grid[0].length}, 84px)` }}
      >
        {grid.map((row, i) =>
          row.map((cell, j) => {
            const rows = grid.length;
            const cols = grid[0].length;
            const idx = gridIndex(i, j, rows, cols, positionOrder);
            const label = formatIndex(idx, rows * cols);
            return (
              <div
                key={`${i}-${j}`}
                onClick={() => handleClick(i, j)}
                className="
                  w-[84px] min-h-[84px] bg-gray-700 hover:bg-gray-600
                  text-white rounded-lg flex flex-col items-center
                  justify-center cursor-pointer transition-all
                  duration-150 shadow-md hover:scale-105 select-none
                  pb-1
                "
              >
                <div className="text-[9px] opacity-50 leading-none">#{label}</div>
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

                {cell.type !== "EMPTY" && needsTextLabel && (
                  <input
                    type="text"
                    placeholder="prize label"
                    value={cell.label ?? ""}
                    onClick={e => e.stopPropagation()}
                    onChange={e => {
                      const val = e.target.value;
                      setGrid(prev => {
                        const g = prev.map(r => r.map(c => ({ ...c })));
                        g[i][j].label = val;
                        return g;
                      });
                    }}
                    className="w-16 mt-0.5 text-[9px] text-center bg-gray-900 text-cyan-300 rounded border border-gray-600 px-1"
                  />
                )}

                {cell.type !== "EMPTY" && tagDefs.map(tagDef => (
                  tagDef.options && tagDef.options.length > 0 ? (
                    <select
                      key={tagDef.name}
                      value={cell.tags?.[tagDef.name] ?? ""}
                      onClick={e => e.stopPropagation()}
                      onChange={e => {
                        const val = e.target.value;
                        setGrid(prev => {
                          const g = prev.map(r => r.map(c => ({ ...c, tags: { ...c.tags } })));
                          g[i][j].tags = { ...(g[i][j].tags ?? {}), [tagDef.name]: val };
                          return g;
                        });
                      }}
                      className="w-16 mt-0.5 text-[9px] text-center bg-gray-900 text-purple-300 rounded border border-gray-600 px-0.5"
                    >
                      <option value="">{tagDef.name}?</option>
                      {tagDef.options.map(opt => <option key={opt} value={opt}>{opt}</option>)}
                    </select>
                  ) : (
                    <input
                      key={tagDef.name}
                      type="text"
                      placeholder={tagDef.name}
                      value={cell.tags?.[tagDef.name] ?? ""}
                      onClick={e => e.stopPropagation()}
                      onChange={e => {
                        const val = e.target.value;
                        setGrid(prev => {
                          const g = prev.map(r => r.map(c => ({ ...c, tags: { ...c.tags } })));
                          g[i][j].tags = { ...(g[i][j].tags ?? {}), [tagDef.name]: val };
                          return g;
                        });
                      }}
                      className="w-16 mt-0.5 text-[9px] text-center bg-gray-900 text-purple-300 rounded border border-gray-600 px-1"
                    />
                  )
                ))}
              </div>
            );
          })
        )}
      </div>
    </div>
  );
}

// ─── CONTROL PANEL ────────────────────────────────────────────────────────────

const FIELD_TYPE_LABELS: Record<SchemaFieldType, string> = {
  reelStops: "Reel Stop Positions",
  coin: "Coin Position",
  coinPrize: "Coin Prize (custom)",
  multiplier: "Multiplier Value",
  static: "Static Value",
  custom: "Custom Expression",
};

type ControlPanelProps = {
  onCreate: (config: FeatureConfig) => void;
  fields: SchemaField[];
  setFields: React.Dispatch<React.SetStateAction<SchemaField[]>>;
};

export function ControlPanel({ onCreate, fields, setFields }: ControlPanelProps) {
  const [mode, setMode] = useState<"new" | "saved">("new");
  const [profiles, setProfiles] = useState<FeatureProfile[]>([]);

  const [name, setName] = useState("");
  const [rows, setRows] = useState(4);
  const [cols, setCols] = useState(5);
  const [positionOrder, setPositionOrder] = useState<PositionOrder>("vertical");
  const [sequenceMode, setSequenceMode] = useState<SequenceMode>("full");
  const [reelStopActiveValue, setReelStopActiveValue] = useState(1);
  const [reelStopEmptyValue, setReelStopEmptyValue] = useState(0);
  const [selectedCoins, setSelectedCoins] = useState<CoinConfig[]>([]);

  // Load saved profiles once on mount (localStorage isn't available during SSR).
  // useEffect(() => {
  //   setProfiles(loadFeatureProfiles());
  // }, []);

  // Any parameter linked to the grid's index order follows it automatically.
  useEffect(() => {
    const linkedFormat: PositionFormat = positionOrder === "horizontal" ? "flatIndexRowMajor" : "flatIndex";
    setFields(prev =>
      prev.some(f => f.useGridOrder)
        ? prev.map(f => (f.useGridOrder ? { ...f, positionFormat: linkedFormat } : f))
        : prev
    );
  }, [positionOrder, setFields]);

  const toggleCoin = (coin: CoinConfig) => {
    setSelectedCoins(prev => {
      const exists = prev.find(c => c.name === coin.name);
      return exists ? prev.filter(c => c.name !== coin.name) : [...prev, coin];
    });
  };

  const normalizeReelStopsFields = (flds: SchemaField[], order: PositionOrder): SchemaField[] =>
    flds.map(f =>
      f.type === "reelStops"
        ? { ...f, useGridOrder: true, positionFormat: order === "horizontal" ? "flatIndexRowMajor" : "flatIndex" }
        : f
    );

  const applyProfile = (p: FeatureProfile) => {
    setName(p.name);
    setRows(p.rows);
    setCols(p.cols);
    setPositionOrder(p.positionOrder);
    setSequenceMode(p.sequenceMode ?? "full");
    setReelStopActiveValue(p.reelStopActiveValue ?? 1);
    setReelStopEmptyValue(p.reelStopEmptyValue ?? 0);
    setSelectedCoins(p.coins);
    setFields(normalizeReelStopsFields(p.fields && p.fields.length > 0 ? p.fields : [], p.positionOrder));
    setMode("new");
  };

  const handleDeleteProfile = (n: string, e: React.MouseEvent) => {
    e.stopPropagation();
    setProfiles(deleteFeatureProfile(n));
  };

  const startNewFeature = () => {
    setName("");
    setRows(4);
    setCols(5);
    setPositionOrder("vertical");
    setSequenceMode("full");
    setReelStopActiveValue(1);
    setReelStopEmptyValue(0);
    setSelectedCoins([]);
    setFields([]);
    setMode("new");
  };

  const handleCreate = () => {
    if (selectedCoins.length === 0 || !name.trim()) return;

    const normalizedFields = normalizeReelStopsFields(fields, positionOrder);
    if (normalizedFields !== fields) setFields(normalizedFields);

    const profile: FeatureProfile = {
      name: name.trim(),
      rows,
      cols,
      positionOrder,
      sequenceMode,
      reelStopActiveValue,
      reelStopEmptyValue,
      coins: selectedCoins,
      fields: normalizedFields,
      savedAt: Date.now(),
    };
    setProfiles(saveFeatureProfile(profile));

    onCreate({
      name: profile.name,
      rows,
      cols,
      positionOrder,
      sequenceMode,
      reelStopActiveValue,
      reelStopEmptyValue,
      coins: [{ name: "EMPTY", color: "gray" }, ...selectedCoins],
    });
  };

  const previewSample = (order: PositionOrder) => {
    // Small 2x3-ish sample sequence to illustrate the order, independent of actual grid size.
    const sampleRows = 2, sampleCols = 3;
    const cells: string[] = [];
    for (let i = 0; i < sampleRows; i++)
      for (let j = 0; j < sampleCols; j++)
        cells.push(formatIndex(gridIndex(i, j, sampleRows, sampleCols, order), sampleRows * sampleCols));
    return order === "horizontal"
      ? `${cells[0]},${cells[1]},${cells[2]}…`
      : `${cells[0]},${cells[3]}…`;
  };

  const orderToFormat = (order: PositionOrder): PositionFormat =>
    order === "horizontal" ? "flatIndexRowMajor" : "flatIndex";

  // Reel Stop Positions has no independent notion of position — it's always
  // the grid's own Horizontal/Vertical order, so lock it in as soon as this
  // type is picked.
  const handleTypeChange = (index: number, type: SchemaFieldType) => {
    if (type === "reelStops") {
      updateField(index, { type, useGridOrder: true, positionFormat: orderToFormat(positionOrder) });
    } else if (type === "coinPrize") {
      updateField(index, { type, prizeTemplate: fields[index]?.prizeTemplate ?? [] });
    } else {
      updateField(index, { type });
    }
  };

  // ── Prize template (coinPrize) editing ──
  const addPrizePart = (fieldIndex: number) => {
    setFields(prev => prev.map((f, i) =>
      i === fieldIndex ? { ...f, prizeTemplate: [...(f.prizeTemplate ?? []), { kind: "row" } as PrizePart] } : f
    ));
  };

  const setPrizePart = (fieldIndex: number, partIndex: number, part: PrizePart) => {
    setFields(prev => prev.map((f, i) => {
      if (i !== fieldIndex) return f;
      const template = [...(f.prizeTemplate ?? [])];
      template[partIndex] = part;
      return { ...f, prizeTemplate: template };
    }));
  };

  const removePrizePart = (fieldIndex: number, partIndex: number) => {
    setFields(prev => prev.map((f, i) =>
      i === fieldIndex ? { ...f, prizeTemplate: (f.prizeTemplate ?? []).filter((_, pi) => pi !== partIndex) } : f
    ));
  };

  const movePrizePart = (fieldIndex: number, partIndex: number, dir: -1 | 1) => {
    setFields(prev => prev.map((f, i) => {
      if (i !== fieldIndex) return f;
      const template = [...(f.prizeTemplate ?? [])];
      const swap = partIndex + dir;
      if (swap < 0 || swap >= template.length) return f;
      [template[partIndex], template[swap]] = [template[swap], template[partIndex]];
      return { ...f, prizeTemplate: template };
    }));
  };

  const prizePartLabel = (part: PrizePart): string => {
    switch (part.kind) {
      case "row": return "row";
      case "col": return "col";
      case "flatPosition": return "pos";
      case "prizeValue": return part.valueType === "text" ? "prize" : "prize#";
      case "tag": return part.tagName || "tag";
      case "static": return String(part.value);
      default: return "?";
    }
  };

  // ── Parameter (schema field) editing ──
  const updateField = (index: number, patch: Partial<SchemaField>) => {
    setFields(prev => prev.map((f, i) => i === index ? { ...f, ...patch } : f));
  };

  const removeField = (index: number) => {
    setFields(prev => prev.filter((_, i) => i !== index));
  };

  const addField = () => {
    setFields(prev => [...prev, {
      key: `parameter${prev.length + 1}`,
      type: "coin",
      coinType: selectedCoins[0]?.name ?? "",
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

  return (
    <div className="bg-gray-900 border border-gray-700 rounded-xl p-5 space-y-4">
      <div className="flex items-center gap-3">
        <div className="text-white font-bold text-sm tracking-widest uppercase opacity-60">Configure Game</div>
        {profiles.length > 0 && (
          <div className="ml-auto flex gap-1 text-xs">
            <button
              onClick={startNewFeature}
              className={`px-3 py-1 rounded-md border transition-colors ${
                mode === "new" ? "bg-blue-500 border-blue-400 text-white" : "bg-gray-800 border-gray-600 text-gray-400 hover:border-gray-400"
              }`}
            >
              New Feature
            </button>
            <button
              onClick={() => setMode("saved")}
              className={`px-3 py-1 rounded-md border transition-colors ${
                mode === "saved" ? "bg-blue-500 border-blue-400 text-white" : "bg-gray-800 border-gray-600 text-gray-400 hover:border-gray-400"
              }`}
            >
              Saved ({profiles.length})
            </button>
          </div>
        )}
      </div>

      {mode === "saved" ? (
        <div className="space-y-2">
          {profiles.length === 0 ? (
            <div className="text-gray-600 text-xs text-center py-4">No saved features yet.</div>
          ) : (
            profiles.map(p => (
              <button
                key={p.name}
                onClick={() => applyProfile(p)}
                className="w-full flex items-center gap-3 bg-gray-800 hover:bg-gray-750 border border-gray-700 hover:border-gray-500 rounded-lg px-3 py-2 text-left transition-colors"
              >
                <span className="text-white text-sm font-semibold flex-1 truncate">{p.name}</span>
                <span className="text-gray-500 text-xs">
                  {p.rows}×{p.cols} · {p.positionOrder} · {p.sequenceMode === "cascade" ? "active-only" : "full"} · {p.reelStopActiveValue ?? 1}/{p.reelStopEmptyValue ?? 0} · {p.coins.map(c => c.name).join(", ")} · {p.fields?.length ?? 0} params
                </span>
                <span
                  onClick={e => handleDeleteProfile(p.name, e)}
                  className="text-red-500 hover:text-red-400 text-xs font-bold px-1"
                  title="Delete"
                >
                  ✕
                </span>
              </button>
            ))
          )}
        </div>
      ) : (
        <>
          <div className="flex gap-4 items-center">
            <label className="text-gray-400 text-xs">Feature name</label>
            <input
              type="text"
              value={name}
              onChange={e => setName(e.target.value)}
              placeholder="e.g. Golden Coin Hold & Win"
              className="flex-1 border border-gray-600 bg-gray-800 text-white px-2 py-1 rounded text-sm"
            />
          </div>

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
            <div className="text-gray-400 text-xs mb-2">Index order (0-indexed)</div>
            <div className="flex gap-2">
              {(["horizontal", "vertical"] as PositionOrder[]).map(order => (
                <button
                  key={order}
                  onClick={() => setPositionOrder(order)}
                  className={`px-3 py-1.5 rounded-lg text-sm font-medium border transition-colors capitalize ${
                    positionOrder === order
                      ? "bg-blue-500 border-blue-400 text-white"
                      : "bg-gray-800 border-gray-600 text-gray-300 hover:border-gray-400"
                  }`}
                >
                  {order}
                  <span className="opacity-60 font-mono text-xs ml-2">{previewSample(order)}</span>
                </button>
              ))}
            </div>
          </div>

          <div>
            <div className="text-gray-400 text-xs mb-2">Reel stop sequencing</div>
            <div className="flex gap-2">
              <button
                onClick={() => setSequenceMode("full")}
                className={`px-3 py-1.5 rounded-lg text-sm font-medium border transition-colors text-left ${
                  sequenceMode === "full"
                    ? "bg-blue-500 border-blue-400 text-white"
                    : "bg-gray-800 border-gray-600 text-gray-300 hover:border-gray-400"
                }`}
              >
                Full Grid
                <div className="opacity-60 text-[10px] font-normal mt-0.5">Every spin lists all positions</div>
              </button>
              <button
                onClick={() => setSequenceMode("cascade")}
                className={`px-3 py-1.5 rounded-lg text-sm font-medium border transition-colors text-left ${
                  sequenceMode === "cascade"
                    ? "bg-blue-500 border-blue-400 text-white"
                    : "bg-gray-800 border-gray-600 text-gray-300 hover:border-gray-400"
                }`}
              >
                Active Only
                <div className="opacity-60 text-[10px] font-normal mt-0.5">Landed positions drop out of later spins</div>
              </button>
            </div>
          </div>

          <div>
            <div className="text-gray-400 text-xs mb-2">Reel stop values</div>
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-2">
                <span className="text-gray-500 text-[10px]">landed</span>
                <input
                  type="number"
                  value={reelStopActiveValue}
                  onChange={e => setReelStopActiveValue(Number(e.target.value))}
                  className="w-16 border border-gray-600 bg-gray-800 text-white px-2 py-1 rounded text-sm"
                />
              </div>
              <div className="flex items-center gap-2">
                <span className="text-gray-500 text-[10px]">empty</span>
                <input
                  type="number"
                  value={reelStopEmptyValue}
                  onChange={e => setReelStopEmptyValue(Number(e.target.value))}
                  className="w-16 border border-gray-600 bg-gray-800 text-white px-2 py-1 rounded text-sm"
                />
              </div>
              <span className="text-gray-600 text-[10px]">used per-position in Reel Stop Positions output</span>
            </div>
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

          {/* ── PARAMETERS ── */}
          <div>
            <div className="flex items-center mb-2">
              <div className="text-gray-400 text-xs">Parameters</div>
              <span className="text-gray-600 text-[10px] ml-2">— what each spin will output</span>
            </div>

            <div className="space-y-2">
              {fields.map((field, index) => (
                <div
                  key={index}
                  className="bg-gray-800 border border-gray-700 rounded-lg p-3 space-y-2"
                >
                  {/* Row 1: parameter name + value type + move/delete */}
                  <div className="flex gap-2 items-center">
                    <input
                      value={field.key}
                      onChange={e => updateField(index, { key: e.target.value })}
                      placeholder="parameterName"
                      className="flex-1 bg-gray-900 border border-gray-600 text-white text-sm px-2 py-1 rounded font-mono"
                    />

                    <select
                      value={field.type}
                      onChange={e => handleTypeChange(index, e.target.value as SchemaFieldType)}
                      className="bg-gray-900 border border-gray-600 text-blue-300 text-xs px-2 py-1 rounded"
                    >
                      {FIELD_TYPES.map(t => (
                        <option key={t} value={t}>{FIELD_TYPE_LABELS[t]}</option>
                      ))}
                    </select>

                    <button onClick={() => moveField(index, -1)} className="text-gray-400 hover:text-white text-xs px-1">▲</button>
                    <button onClick={() => moveField(index, 1)} className="text-gray-400 hover:text-white text-xs px-1">▼</button>

                    <button
                      onClick={() => removeField(index)}
                      className="text-red-500 hover:text-red-400 text-xs px-1 font-bold"
                    >✕</button>
                  </div>

                  {/* Row 2: value-type-specific options */}
                  <div className="flex flex-wrap gap-2 items-center">

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
                            {selectedCoins.map(c => (
                              <option key={c.name} value={c.name}>{c.name}</option>
                            ))}
                          </select>
                        </div>
                        <PositionField field={field} positionOrder={positionOrder} onChange={patch => updateField(index, patch)} />
                        <Toggle label="+ value" value={!!field.includeValue} onChange={v => updateField(index, { includeValue: v })} />
                      </>
                    )}

                    {field.type === "reelStops" && (
                      <span
                        title="Reel Stop Positions always follows the grid's Index order — change it above to affect this"
                        className="flex items-center gap-1 text-xs px-2 py-1 rounded border bg-cyan-900 border-cyan-600 text-cyan-300 capitalize"
                      >
                        🔗 {positionOrder} <span className="text-cyan-500">(grid index order)</span>
                      </span>
                    )}

                    {field.type === "multiplier" && (
                      <>
                        <PositionField field={field} positionOrder={positionOrder} onChange={patch => updateField(index, patch)} />
                        <Toggle label="+ multiplier val" value={!!field.includeMultiplier} onChange={v => updateField(index, { includeMultiplier: v })} />
                      </>
                    )}

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

                  {field.type === "coinPrize" && (
                    <div className="space-y-1.5 pt-1">
                      <div className="flex items-center gap-1">
                        <span className="text-gray-500 text-[10px]">symbol</span>
                        <select
                          value={field.coinType ?? ""}
                          onChange={e => updateField(index, { coinType: e.target.value })}
                          className="bg-gray-900 border border-gray-600 text-yellow-300 text-xs px-2 py-1 rounded"
                        >
                          <option value="">any</option>
                          {selectedCoins.map(c => (
                            <option key={c.name} value={c.name}>{c.name}</option>
                          ))}
                        </select>
                      </div>

                      {(field.prizeTemplate ?? []).map((part, pIndex) => (
                        <PrizePartRow
                          key={pIndex}
                          part={part}
                          onChange={p => setPrizePart(index, pIndex, p)}
                          onRemove={() => removePrizePart(index, pIndex)}
                          onMove={dir => movePrizePart(index, pIndex, dir)}
                        />
                      ))}

                      <button
                        onClick={() => addPrizePart(index)}
                        className="w-full border border-dashed border-gray-600 text-gray-400 hover:text-white hover:border-gray-400 text-[10px] py-1 rounded transition-colors"
                      >
                        + Add Part
                      </button>

                      <div className="text-gray-600 text-[10px] font-mono">
                        preview: [{(field.prizeTemplate ?? []).map(prizePartLabel).join(", ")}]
                      </div>
                    </div>
                  )}
                </div>
              ))}

              <button
                onClick={addField}
                className="w-full border border-dashed border-gray-600 text-gray-400 hover:text-white hover:border-gray-400 text-xs py-2 rounded-lg transition-colors"
              >
                + Add Parameter
              </button>
            </div>
          </div>

          <button
            onClick={handleCreate}
            disabled={selectedCoins.length === 0 || !name.trim()}
            className="bg-blue-600 hover:bg-blue-500 disabled:opacity-40 disabled:cursor-not-allowed text-white px-5 py-2 rounded-lg text-sm font-semibold transition-colors"
          >
            Save &amp; Create Grid
          </button>
        </>
      )}
    </div>
  );
}

// ─── SUB-COMPONENTS ───────────────────────────────────────────────────────────

// Position control for a parameter: either linked to the grid's own
// Horizontal/Vertical selection (shown as a tag, follows it automatically),
// or set manually via the full position-format dropdown.
function PositionField({
  field,
  positionOrder,
  onChange,
}: {
  field: SchemaField;
  positionOrder: PositionOrder;
  onChange: (patch: Partial<SchemaField>) => void;
}) {
  const linkedFormat: PositionFormat = positionOrder === "horizontal" ? "flatIndexRowMajor" : "flatIndex";

  if (field.useGridOrder) {
    return (
      <button
        onClick={() => onChange({ useGridOrder: false })}
        title="Linked to the grid's Horizontal/Vertical selection — click to set manually"
        className="flex items-center gap-1 text-xs px-2 py-1 rounded border bg-cyan-900 border-cyan-600 text-cyan-300 capitalize"
      >
        🔗 {positionOrder}
      </button>
    );
  }

  return (
    <div className="flex items-center gap-1">
      <PositionFormatSelect value={field.positionFormat ?? "colRow"} onChange={v => onChange({ positionFormat: v })} />
      <button
        onClick={() => onChange({ useGridOrder: true, positionFormat: linkedFormat })}
        title="Link to the grid's Horizontal/Vertical selection"
        className="text-gray-500 hover:text-cyan-300 text-xs px-1"
      >
        🔗
      </button>
    </div>
  );
}

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

const PRIZE_PART_KINDS: { value: PrizePart["kind"]; label: string }[] = [
  { value: "row", label: "Row" },
  { value: "col", label: "Col" },
  { value: "flatPosition", label: "Flat Position (grid order)" },
  { value: "prizeValue", label: "Prize Value" },
  { value: "tag", label: "Tag" },
  { value: "static", label: "Static" },
];

function PrizePartRow({
  part,
  onChange,
  onRemove,
  onMove,
}: {
  part: PrizePart;
  onChange: (part: PrizePart) => void;
  onRemove: () => void;
  onMove: (dir: -1 | 1) => void;
}) {
  const handleKindChange = (kind: PrizePart["kind"]) => {
    switch (kind) {
      case "row": onChange({ kind: "row" }); break;
      case "col": onChange({ kind: "col" }); break;
      case "flatPosition": onChange({ kind: "flatPosition" }); break;
      case "prizeValue": onChange({ kind: "prizeValue", valueType: "number" }); break;
      case "tag": onChange({ kind: "tag", tagName: "", options: [] }); break;
      case "static": onChange({ kind: "static", value: "" }); break;
    }
  };

  return (
    <div className="flex items-center gap-1 flex-wrap bg-gray-900 border border-gray-700 rounded px-2 py-1">
      <select
        value={part.kind}
        onChange={e => handleKindChange(e.target.value as PrizePart["kind"])}
        className="bg-gray-950 border border-gray-600 text-blue-300 text-[10px] px-1.5 py-0.5 rounded"
      >
        {PRIZE_PART_KINDS.map(o => <option key={o.value} value={o.value}>{o.label}</option>)}
      </select>

      {part.kind === "prizeValue" && (
        <select
          value={part.valueType}
          onChange={e => onChange({ ...part, valueType: e.target.value as "number" | "text" })}
          className="bg-gray-950 border border-gray-600 text-green-300 text-[10px] px-1.5 py-0.5 rounded"
        >
          <option value="number">number (cell value)</option>
          <option value="text">text label</option>
        </select>
      )}

      {part.kind === "tag" && (
        <>
          <input
            value={part.tagName}
            onChange={e => onChange({ ...part, tagName: e.target.value })}
            placeholder="tag name e.g. direction"
            className="bg-gray-950 border border-gray-600 text-cyan-300 text-[10px] px-1.5 py-0.5 rounded font-mono w-28"
          />
          <input
            value={(part.options ?? []).join(",")}
            onChange={e => onChange({ ...part, options: e.target.value.split(",") })}
            placeholder="options e.g. LEFT, RIGHT"
            className="bg-gray-950 border border-gray-600 text-cyan-200 text-[10px] px-1.5 py-0.5 rounded font-mono w-32"
          />
        </>
      )}

      {part.kind === "static" && (
        <input
          value={String(part.value)}
          onChange={e => {
            const raw = e.target.value;
            const val = raw !== "" && !isNaN(Number(raw)) ? Number(raw) : raw;
            onChange({ ...part, value: val });
          }}
          placeholder="value"
          className="bg-gray-950 border border-gray-600 text-purple-300 text-[10px] px-1.5 py-0.5 rounded font-mono w-20"
        />
      )}

      <div className="ml-auto flex items-center gap-1">
        <button onClick={() => onMove(-1)} className="text-gray-500 hover:text-white text-[10px] px-1">▲</button>
        <button onClick={() => onMove(1)} className="text-gray-500 hover:text-white text-[10px] px-1">▼</button>
        <button onClick={onRemove} className="text-red-500 hover:text-red-400 text-[10px] px-1 font-bold">✕</button>
      </div>
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