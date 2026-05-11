// /* eslint-disable @typescript-eslint/no-explicit-any */
// "use client";

// import { useState, useEffect, useRef } from "react";
// import {
//   SplitFeatureCoin,
//   SPLIT_COIN_COLORS,
//   SPLIT_COIN_VALUES,
//   SPLIT_COUNT_OPTIONS,
//   SPLIT_BOOST_VALUES,
// } from "./splitFeatureGenerator";

// type Props = {
//   baseCoins:     SplitFeatureCoin[];
//   isStrikeCombo: boolean;          // true → show boost controls for split coins 2/3/4
//   onCoinsChange: (coins: SplitFeatureCoin[]) => void;
//   onSpin:        (snapshot: SplitFeatureCoin[]) => void;
//   onReset:       () => void;
// };

// const MAX_SPINS = 3;

// const COIN_SELECT_BG: Record<number, string> = {
//   4:  "bg-emerald-700",
//   9:  "bg-sky-700",
//   14: "bg-orange-700",
//   19: "bg-pink-700",
// };

// // Visual ghost cell for split copies
// function SplitGhostCell({ index, coin, isStrikeCombo, onBoostChange }: {
//   index:         number;         // 1-based extra coin index (coin 2 = index 1, etc.)
//   coin:          SplitFeatureCoin;
//   isStrikeCombo: boolean;
//   onBoostChange: (idx: number, val: string) => void;
// }) {
//   return (
//     <div className={`rounded border border-dashed border-pink-400/60 bg-pink-950/40 flex flex-col items-center justify-center p-1 min-h-[70px] text-[10px] text-pink-200`}>
//       <div className="opacity-40 text-[9px] mb-0.5">split {index + 1}</div>
//       <div className="text-sm">🟡</div>
//       <div className={`text-[9px] mt-0.5 px-1 py-0.5 rounded ${COIN_SELECT_BG[coin.colorCode]}`}>
//         {SPLIT_COIN_VALUES.find((v) => v === coin.value) ?? coin.value}
//       </div>
//       {isStrikeCombo && coin.winged && (
//         <select
//           className="text-white text-[9px] w-full rounded mt-0.5 bg-yellow-700 border-0"
//           value={coin.splitBoostValues?.[index - 1] ?? ""}
//           onClick={(e) => e.stopPropagation()}
//           onChange={(e) => onBoostChange(index - 1, e.target.value)}
//         >
//           <option value="" className="bg-gray-800">Boost</option>
//           {SPLIT_BOOST_VALUES.map((v) => (
//             <option key={v} value={v} className="bg-gray-800">{v}</option>
//           ))}
//         </select>
//       )}
//     </div>
//   );
// }

// export default function SplitFeature({ baseCoins, isStrikeCombo, onCoinsChange, onSpin, onReset }: Props) {
//   const [isOpen,    setIsOpen]    = useState(true);
//   const [coins,     setCoins]     = useState<SplitFeatureCoin[]>([]);
//   const [spinsLeft, setSpinsLeft] = useState(MAX_SPINS);
//   const lastSpinPositions = useRef<Set<number>>(new Set());

//   useEffect(() => {
//     const seeded = baseCoins.map((c) => ({ ...c, fromBase: true }));
//     setCoins(seeded);
//     setSpinsLeft(MAX_SPINS);
//     lastSpinPositions.current = new Set(seeded.map((c) => c.position));
//   }, [JSON.stringify(baseCoins)]);

//   useEffect(() => { onCoinsChange(coins); }, [coins]);

//   const coinAt = (pos: number) => coins.find((c) => c.position === pos);

//   const handleCellClick = (pos: number) => {
//     if (coinAt(pos)) return;
//     setCoins((prev) => [...prev, {
//       position: pos, colorCode: SPLIT_COIN_COLORS[0].value,
//       value: SPLIT_COIN_VALUES[0], splitCount: 1,
//     }]);
//   };

//   const removeCoin = (pos: number) => {
//     const c = coinAt(pos);
//     if (!c || c.fromBase) return;
//     setCoins((prev) => prev.filter((x) => x.position !== pos));
//   };

//   const updateCoin = (pos: number, field: keyof SplitFeatureCoin, val: any) =>
//     setCoins((prev) => prev.map((c) => (c.position === pos ? { ...c, [field]: val } : c)));

//   // Update one slot in splitBoostValues array
//   const updateSplitBoost = (pos: number, idx: number, val: string) => {
//     setCoins((prev) =>
//       prev.map((c) => {
//         if (c.position !== pos) return c;
//         const arr = [...(c.splitBoostValues ?? [])];
//         arr[idx] = val;
//         return { ...c, splitBoostValues: arr };
//       })
//     );
//   };

//   const toggleWinged = (pos: number, e: React.MouseEvent) => {
//     e.stopPropagation();
//     const c = coinAt(pos);
//     if (!c) return;
//     setCoins((prev) =>
//       prev.map((x) =>
//         x.position === pos
//           ? { ...x, winged: !x.winged, boostValue: x.winged ? undefined : x.boostValue }
//           : x
//       )
//     );
//   };

//   const handleSpin = () => {
//     if (spinsLeft <= 0) return;
//     const cur = new Set(coins.map((c) => c.position));
//     const hasNew = [...cur].some((p) => !lastSpinPositions.current.has(p));
//     setSpinsLeft(hasNew ? MAX_SPINS : spinsLeft - 1);
//     lastSpinPositions.current = cur;
//     onSpin(coins);
//   };

//   const resetFeature = () => {
//     const seeded = baseCoins.map((c) => ({ ...c, fromBase: true }));
//     setCoins(seeded);
//     setSpinsLeft(MAX_SPINS);
//     lastSpinPositions.current = new Set(seeded.map((c) => c.position));
//     onReset();
//   };

//   return (
//     <div className="bg-gray-800 rounded-xl">

//       {/* HEADER */}
//       <div
//         onClick={() => setIsOpen(!isOpen)}
//         className="flex justify-between items-center p-4 cursor-pointer"
//       >
//         <h2 className="text-lg font-semibold text-pink-400">
//           🩷 Split Feature{isStrikeCombo ? " + Strike" : ""}
//         </h2>
//         <span>{isOpen ? "▼" : "▶"}</span>
//       </div>

//       {isOpen && (
//         <div className="p-6 pt-0 flex flex-col gap-4">

//           {/* SPIN CONTROLS */}
//           <div className="flex items-center gap-4 flex-wrap">
//             <button
//               onClick={handleSpin}
//               disabled={spinsLeft <= 0}
//               className={`px-6 py-2 rounded font-bold text-white transition-all ${
//                 spinsLeft > 0 ? "bg-pink-600 hover:bg-pink-500" : "bg-gray-600 cursor-not-allowed opacity-50"
//               }`}
//             >
//               SPIN
//             </button>
//             <span className="text-sm text-gray-300">
//               {spinsLeft} spin{spinsLeft !== 1 ? "s" : ""} left
//             </span>
//             <button onClick={resetFeature} className="px-3 py-1 bg-gray-600 hover:bg-gray-500 rounded text-sm">
//               Reset
//             </button>
//           </div>

//           {/* GRID — 5 cols × 3 rows, column-major */}
//           <div className="grid gap-1" style={{ gridTemplateColumns: "repeat(5, minmax(0, 1fr))" }}>
//             {Array.from({ length: 3 }).map((_, row) =>
//               Array.from({ length: 5 }).map((_, col) => {
//                 const pos  = col * 3 + row;
//                 const coin = coinAt(pos);

//                 return (
//                   <div key={pos} className="flex flex-col gap-1">

//                     {/* PRIMARY CELL */}
//                     <div
//                       onClick={() => !coin && handleCellClick(pos)}
//                       className={`relative rounded-lg border-2 flex flex-col items-center justify-center p-1 min-h-[100px] text-xs text-white cursor-pointer transition-all
//                         bg-gray-700 border-gray-600
//                         ${!coin ? "hover:bg-gray-600 hover:border-gray-400" : "border-pink-500 bg-pink-950/30"}
//                       `}
//                     >
//                       <div className="text-[9px] opacity-50 absolute top-1 left-1">{pos}</div>

//                       {coin ? (
//                         <div className="flex flex-col items-center w-full gap-1 mt-2 px-0.5">

//                           {/* Coin emoji — winged toggle if strike combo */}
//                           {isStrikeCombo ? (
//                             <button
//                               onClick={(e) => toggleWinged(pos, e)}
//                               title="Click to toggle winged/plain"
//                               className={`text-sm leading-none px-1 py-0.5 rounded transition-all ${
//                                 coin.winged
//                                   ? "bg-yellow-500/20 text-yellow-200 ring-1 ring-yellow-400"
//                                   : "text-yellow-300"
//                               }`}
//                             >
//                               {coin.winged ? "🪽🟡🪽" : "🟡"}
//                             </button>
//                           ) : (
//                             <div className="text-base leading-none">🟡</div>
//                           )}

//                           {/* Color selector */}
//                           <select
//                             className={`text-white text-[10px] w-full rounded px-0.5 py-0.5 ${COIN_SELECT_BG[coin.colorCode] ?? "bg-gray-600"} border-0`}
//                             value={coin.colorCode}
//                             onClick={(e) => e.stopPropagation()}
//                             onChange={(e) => updateCoin(pos, "colorCode", Number(e.target.value))}
//                           >
//                             {SPLIT_COIN_COLORS.map((c) => (
//                               <option key={c.value} value={c.value} className="bg-gray-800">{c.label}</option>
//                             ))}
//                           </select>

//                           {/* Value selector */}
//                           <select
//                             className={`text-white text-[10px] w-full rounded px-0.5 py-0.5 ${COIN_SELECT_BG[coin.colorCode] ?? "bg-gray-600"} border-0`}
//                             value={coin.value}
//                             onClick={(e) => e.stopPropagation()}
//                             onChange={(e) => updateCoin(pos, "value", e.target.value)}
//                           >
//                             {SPLIT_COIN_VALUES.map((v) => (
//                               <option key={v} value={v} className="bg-gray-800">{v}</option>
//                             ))}
//                           </select>

//                           {/* Boost for coin 1 — only in strike combo and winged */}
//                           {isStrikeCombo && coin.winged && (
//                             <select
//                               className="text-white text-[10px] w-full rounded px-0.5 py-0.5 bg-yellow-700 border-0"
//                               value={coin.boostValue ?? ""}
//                               onClick={(e) => e.stopPropagation()}
//                               onChange={(e) => updateCoin(pos, "boostValue", e.target.value)}
//                             >
//                               <option value="" className="bg-gray-800">Boost (coin 1)</option>
//                               {SPLIT_BOOST_VALUES.map((v) => (
//                                 <option key={v} value={v} className="bg-gray-800">{v}</option>
//                               ))}
//                             </select>
//                           )}

//                           {/* Split count selector */}
//                           <select
//                             className="text-white text-[10px] w-full rounded px-0.5 py-0.5 bg-pink-700 border-0"
//                             value={coin.splitCount}
//                             onClick={(e) => e.stopPropagation()}
//                             onChange={(e) => {
//                               const sc = Number(e.target.value);
//                               updateCoin(pos, "splitCount", sc);
//                               // Trim splitBoostValues to sc-1 entries
//                               if (sc <= 1) {
//                                 updateCoin(pos, "splitBoostValues" as any, []);
//                               }
//                             }}
//                           >
//                             {SPLIT_COUNT_OPTIONS.map((n) => (
//                               <option key={n} value={n} className="bg-gray-800">
//                                 Split × {n}
//                               </option>
//                             ))}
//                           </select>

//                           {/* Remove (non-base only) */}
//                           {!coin.fromBase && (
//                             <button
//                               onClick={(e) => { e.stopPropagation(); removeCoin(pos); }}
//                               className="absolute top-1 right-1 text-[10px] text-red-300 hover:text-red-100 font-bold"
//                             >✕</button>
//                           )}
//                         </div>
//                       ) : (
//                         <span className="text-gray-500 text-[10px]">+ Add</span>
//                       )}
//                     </div>

//                     {/* GHOST CELLS — one per extra split coin (splitCount - 1) */}
//                     {coin && coin.splitCount > 1 &&
//                       Array.from({ length: coin.splitCount - 1 }).map((_, idx) => (
//                         <SplitGhostCell
//                           key={idx}
//                           index={idx + 1}
//                           coin={coin}
//                           isStrikeCombo={isStrikeCombo}
//                           onBoostChange={(i, val) => updateSplitBoost(pos, i, val)}
//                         />
//                       ))
//                     }

//                   </div>
//                 );
//               })
//             )}
//           </div>

//           {/* LEGEND */}
//           <div className="text-xs text-gray-400 flex flex-wrap gap-3">
//             <span>🟡 = coin &nbsp;|&nbsp; Split × N = coin splits into N copies</span>
//             {isStrikeCombo && <span>🪽🟡🪽 = winged — click to toggle &nbsp;|&nbsp; Extra split coins get their own boost</span>}
//             <span>Click empty cell to add</span>
//           </div>

//         </div>
//       )}
//     </div>
//   );
// }




/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { useState, useEffect, useRef } from "react";
import {
  SplitFeatureCoin,
  SPLIT_COIN_COLORS,
  SPLIT_COIN_VALUES,
  SPLIT_COUNT_OPTIONS,
  SPLIT_BOOST_VALUES,
} from "./splitFeatureGenerator";

type Props = {
  baseCoins:     SplitFeatureCoin[];
  isStrikeCombo: boolean;          // true → show boost controls for split coins 2/3/4
  onCoinsChange: (coins: SplitFeatureCoin[]) => void;
  onSpin:        (snapshot: SplitFeatureCoin[]) => void;
  onReset:       () => void;
};

const MAX_SPINS = 3;

const COIN_SELECT_BG: Record<number, string> = {
  14:  "bg-emerald-700",
  9:  "bg-sky-700",
  4: "bg-orange-700",
  19: "bg-black-700",
};

// Visual ghost cell for split copies
function SplitGhostCell({ index, coin, isStrikeCombo, onBoostChange }: {
  index:         number;         // 1-based extra coin index (coin 2 = index 1, etc.)
  coin:          SplitFeatureCoin;
  isStrikeCombo: boolean;
  onBoostChange: (idx: number, val: string) => void;
}) {
  return (
    <div className={`rounded border border-dashed border-pink-400/60 bg-pink-950/40 flex flex-col items-center justify-center p-1 min-h-[70px] text-[10px] text-pink-200`}>
      <div className="opacity-40 text-[9px] mb-0.5">split {index + 1}</div>
      <div className="text-sm">🟡</div>
      <div className={`text-[9px] mt-0.5 px-1 py-0.5 rounded ${COIN_SELECT_BG[coin.colorCode]}`}>
        {SPLIT_COIN_VALUES.find((v) => v === coin.value) ?? coin.value}
      </div>
      {isStrikeCombo && coin.winged && (
        <select
          className="text-white text-[9px] w-full rounded mt-0.5 bg-yellow-700 border-0"
          value={coin.splitBoostValues?.[index - 1] ?? ""}
          onClick={(e) => e.stopPropagation()}
          onChange={(e) => onBoostChange(index - 1, e.target.value)}
        >
          <option value="" className="bg-gray-800">Boost</option>
          {SPLIT_BOOST_VALUES.map((v) => (
            <option key={v} value={v} className="bg-gray-800">{v}</option>
          ))}
        </select>
      )}
    </div>
  );
}

export default function SplitFeature({ baseCoins, isStrikeCombo, onCoinsChange, onSpin, onReset }: Props) {
  const [isOpen,    setIsOpen]    = useState(true);
  const initialSeeds = baseCoins.map((c) => ({ ...c, fromBase: true }));
  const [coins,     setCoins]     = useState<SplitFeatureCoin[]>(initialSeeds);
  const [spinsLeft, setSpinsLeft] = useState(MAX_SPINS);
  const lastSpinPositions = useRef<Set<number>>(new Set(initialSeeds.map((c) => c.position)));



  useEffect(() => { onCoinsChange(coins); }, [coins]);

  const coinAt = (pos: number) => coins.find((c) => c.position === pos);

  const handleCellClick = (pos: number) => {
    if (coinAt(pos)) return;
    setCoins((prev) => [...prev, {
      position: pos, colorCode: SPLIT_COIN_COLORS[0].value,
      value: SPLIT_COIN_VALUES[0], splitCount: 1,
    }]);
  };

  const removeCoin = (pos: number) => {
    const c = coinAt(pos);
    if (!c || c.fromBase) return;
    setCoins((prev) => prev.filter((x) => x.position !== pos));
  };

  const updateCoin = (pos: number, field: keyof SplitFeatureCoin, val: any) =>
    setCoins((prev) => prev.map((c) => (c.position === pos ? { ...c, [field]: val } : c)));

  // Update one slot in splitBoostValues array
  const updateSplitBoost = (pos: number, idx: number, val: string) => {
    setCoins((prev) =>
      prev.map((c) => {
        if (c.position !== pos) return c;
        const arr = [...(c.splitBoostValues ?? [])];
        arr[idx] = val;
        return { ...c, splitBoostValues: arr };
      })
    );
  };

  const toggleWinged = (pos: number, e: React.MouseEvent) => {
    e.stopPropagation();
    const c = coinAt(pos);
    if (!c) return;
    setCoins((prev) =>
      prev.map((x) =>
        x.position === pos
          ? { ...x, winged: !x.winged, boostValue: x.winged ? undefined : x.boostValue }
          : x
      )
    );
  };

  const handleSpin = () => {
    if (spinsLeft <= 0) return;
    const cur = new Set(coins.map((c) => c.position));
    const hasNew = [...cur].some((p) => !lastSpinPositions.current.has(p));
    setSpinsLeft(hasNew ? MAX_SPINS : spinsLeft - 1);
    lastSpinPositions.current = cur;
    onSpin(coins);
  };

  const resetFeature = () => {
    const seeded = baseCoins.map((c) => ({ ...c, fromBase: true }));
    setCoins(seeded);
    setSpinsLeft(MAX_SPINS);
    lastSpinPositions.current = new Set(seeded.map((c) => c.position));
    onReset();
  };

  return (
    <div className="bg-gray-800 rounded-xl">

      {/* HEADER */}
      <div
        onClick={() => setIsOpen(!isOpen)}
        className="flex justify-between items-center p-4 cursor-pointer"
      >
        <h2 className="text-lg font-semibold text-pink-400">
          🩷 Split Feature{isStrikeCombo ? " + Strike" : ""}
        </h2>
        <span>{isOpen ? "▼" : "▶"}</span>
      </div>

      {isOpen && (
        <div className="p-6 pt-0 flex flex-col gap-4">

          {/* SPIN CONTROLS */}
          <div className="flex items-center gap-4 flex-wrap">
            <button
              onClick={handleSpin}
              disabled={spinsLeft <= 0}
              className={`px-6 py-2 rounded font-bold text-white transition-all ${
                spinsLeft > 0 ? "bg-pink-600 hover:bg-pink-500" : "bg-gray-600 cursor-not-allowed opacity-50"
              }`}
            >
              SPIN
            </button>
            <span className="text-sm text-gray-300">
              {spinsLeft} spin{spinsLeft !== 1 ? "s" : ""} left
            </span>
            <button onClick={resetFeature} className="px-3 py-1 bg-gray-600 hover:bg-gray-500 rounded text-sm">
              Reset
            </button>
          </div>

          {/* GRID — 5 cols × 3 rows, column-major */}
          <div className="grid gap-1" style={{ gridTemplateColumns: "repeat(5, minmax(0, 1fr))" }}>
            {Array.from({ length: 3 }).map((_, row) =>
              Array.from({ length: 5 }).map((_, col) => {
                const pos  = col * 3 + row;
                const coin = coinAt(pos);

                return (
                  <div key={pos} className="flex flex-col gap-1">

                    {/* PRIMARY CELL */}
                    <div
                      onClick={() => !coin && handleCellClick(pos)}
                      className={`relative rounded-lg border-2 flex flex-col items-center justify-center p-1 min-h-[100px] text-xs text-white cursor-pointer transition-all
                        bg-gray-700 border-gray-600
                        ${!coin ? "hover:bg-gray-600 hover:border-gray-400" : "border-pink-500 bg-pink-950/30"}
                      `}
                    >
                      <div className="text-[9px] opacity-50 absolute top-1 left-1">{pos}</div>

                      {coin ? (
                        <div className="flex flex-col items-center w-full gap-1 mt-2 px-0.5">

                          {/* Coin emoji — winged toggle if strike combo */}
                          {isStrikeCombo ? (
                            <button
                              onClick={(e) => toggleWinged(pos, e)}
                              title="Click to toggle winged/plain"
                              className={`text-sm leading-none px-1 py-0.5 rounded transition-all ${
                                coin.winged
                                  ? "bg-yellow-500/20 text-yellow-200 ring-1 ring-yellow-400"
                                  : "text-yellow-300"
                              }`}
                            >
                              {coin.winged ? "🪽🟡🪽" : "🟡"}
                            </button>
                          ) : (
                            <div className="text-base leading-none">🟡</div>
                          )}

                          {/* Color selector */}
                          <select
                            className={`text-white text-[10px] w-full rounded px-0.5 py-0.5 ${COIN_SELECT_BG[coin.colorCode] ?? "bg-gray-600"} border-0`}
                            value={coin.colorCode}
                            onClick={(e) => e.stopPropagation()}
                            onChange={(e) => updateCoin(pos, "colorCode", Number(e.target.value))}
                          >
                            {SPLIT_COIN_COLORS.map((c) => (
                              <option key={c.value} value={c.value} className="bg-gray-800">{c.label}</option>
                            ))}
                          </select>

                          {/* Value selector */}
                          <select
                            className={`text-white text-[10px] w-full rounded px-0.5 py-0.5 ${COIN_SELECT_BG[coin.colorCode] ?? "bg-gray-600"} border-0`}
                            value={coin.value}
                            onClick={(e) => e.stopPropagation()}
                            onChange={(e) => updateCoin(pos, "value", e.target.value)}
                          >
                            {SPLIT_COIN_VALUES.map((v) => (
                              <option key={v} value={v} className="bg-gray-800">{v}</option>
                            ))}
                          </select>

                          {/* Boost for coin 1 — only in strike combo and winged */}
                          {isStrikeCombo && coin.winged && (
                            <select
                              className="text-white text-[10px] w-full rounded px-0.5 py-0.5 bg-yellow-700 border-0"
                              value={coin.boostValue ?? ""}
                              onClick={(e) => e.stopPropagation()}
                              onChange={(e) => updateCoin(pos, "boostValue", e.target.value)}
                            >
                              <option value="" className="bg-gray-800">Boost (coin 1)</option>
                              {SPLIT_BOOST_VALUES.map((v) => (
                                <option key={v} value={v} className="bg-gray-800">{v}</option>
                              ))}
                            </select>
                          )}

                          {/* Split count selector */}
                          <select
                            className="text-white text-[10px] w-full rounded px-0.5 py-0.5 bg-pink-700 border-0"
                            value={coin.splitCount}
                            onClick={(e) => e.stopPropagation()}
                            onChange={(e) => {
                              const sc = Number(e.target.value);
                              updateCoin(pos, "splitCount", sc);
                              // Trim splitBoostValues to sc-1 entries
                              if (sc <= 1) {
                                updateCoin(pos, "splitBoostValues" as any, []);
                              }
                            }}
                          >
                            {SPLIT_COUNT_OPTIONS.map((n) => (
                              <option key={n} value={n} className="bg-gray-800">
                                Split × {n}
                              </option>
                            ))}
                          </select>

                          {/* Remove (non-base only) */}
                          {!coin.fromBase && (
                            <button
                              onClick={(e) => { e.stopPropagation(); removeCoin(pos); }}
                              className="absolute top-1 right-1 text-[10px] text-red-300 hover:text-red-100 font-bold"
                            >✕</button>
                          )}
                        </div>
                      ) : (
                        <span className="text-gray-500 text-[10px]">+ Add</span>
                      )}
                    </div>

                    {/* GHOST CELLS — one per extra split coin (splitCount - 1) */}
                    {coin && coin.splitCount > 1 &&
                      Array.from({ length: coin.splitCount - 1 }).map((_, idx) => (
                        <SplitGhostCell
                          key={idx}
                          index={idx + 1}
                          coin={coin}
                          isStrikeCombo={isStrikeCombo}
                          onBoostChange={(i, val) => updateSplitBoost(pos, i, val)}
                        />
                      ))
                    }

                  </div>
                );
              })
            )}
          </div>

          {/* LEGEND */}
          <div className="text-xs text-gray-400 flex flex-wrap gap-3">
            <span>🟡 = coin &nbsp;|&nbsp; Split × N = coin splits into N copies</span>
            {isStrikeCombo && <span>🪽🟡🪽 = winged — click to toggle &nbsp;|&nbsp; Extra split coins get their own boost</span>}
            <span>Click empty cell to add</span>
          </div>

        </div>
      )}
    </div>
  );
}