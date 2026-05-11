// /* eslint-disable @typescript-eslint/no-explicit-any */
// "use client";

// import { useState, useEffect, useRef } from "react";
// import {
//   StrikeFeatureCoin,
//   STRIKE_COIN_COLORS,
//   STRIKE_COIN_VALUES,
//   STRIKE_BOOST_VALUES,
// } from "./strikeFeatureGenerator";

// type Props = {
//   baseCoins: StrikeFeatureCoin[];
//   onCoinsChange: (coins: StrikeFeatureCoin[]) => void;
//   onSpin: (coinsSnapshot: StrikeFeatureCoin[]) => void;
//   onReset: () => void;
// };

// const MAX_SPINS = 3;

// // Coin color → select background
// const COIN_SELECT_BG: Record<number, string> = {
//   4:  "bg-emerald-700",
//   9:  "bg-sky-700",
//   14: "bg-orange-700",
//   19: "bg-pink-700",
// };

// export default function StrikeFeature({ baseCoins, onCoinsChange, onSpin, onReset }: Props) {
//   const [isOpen, setIsOpen] = useState(true);
//   const [coins, setCoins] = useState<StrikeFeatureCoin[]>([]);
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

//   // Click empty cell → add plain gold coin
//   const handleCellClick = (pos: number) => {
//     if (coinAt(pos)) return;
//     setCoins((prev) => [
//       ...prev,
//       {
//         position: pos,
//         colorCode: STRIKE_COIN_COLORS[0].value,
//         value: STRIKE_COIN_VALUES[0],
//         winged: false,
//       },
//     ]);
//   };

//   const removeCoin = (pos: number) => {
//     const coin = coinAt(pos);
//     if (!coin || coin.fromBase) return;
//     setCoins((prev) => prev.filter((c) => c.position !== pos));
//   };

//   const updateCoin = (pos: number, field: keyof StrikeFeatureCoin, value: any) => {
//     setCoins((prev) =>
//       prev.map((c) => (c.position === pos ? { ...c, [field]: value } : c))
//     );
//   };

//   // Toggle between plain gold and winged
//   const toggleWinged = (pos: number, e: React.MouseEvent) => {
//     e.stopPropagation();
//     const coin = coinAt(pos);
//     if (!coin) return;
//     setCoins((prev) =>
//       prev.map((c) =>
//         c.position === pos
//           ? { ...c, winged: !c.winged, boostValue: !c.winged ? c.boostValue : undefined }
//           : c
//       )
//     );
//   };

//   const handleSpin = () => {
//     if (spinsLeft <= 0) return;
//     const currentPositions = new Set(coins.map((c) => c.position));
//     const hasNewCoin = [...currentPositions].some(
//       (p) => !lastSpinPositions.current.has(p)
//     );
//     const newSpins = hasNewCoin ? MAX_SPINS : spinsLeft - 1;
//     setSpinsLeft(newSpins);
//     lastSpinPositions.current = new Set(currentPositions);
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
//         <h2 className="text-lg font-semibold text-orange-400">🟠 Strike Feature</h2>
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
//                 spinsLeft > 0
//                   ? "bg-orange-600 hover:bg-orange-500"
//                   : "bg-gray-600 cursor-not-allowed opacity-50"
//               }`}
//             >
//               SPIN
//             </button>

//             <span className="text-sm text-gray-300">
//               {spinsLeft} spin{spinsLeft !== 1 ? "s" : ""} left
//             </span>

//             <button
//               onClick={resetFeature}
//               className="px-3 py-1 bg-gray-600 hover:bg-gray-500 rounded text-sm"
//             >
//               Reset
//             </button>
//           </div>

//           {/* GRID — 5 cols × 3 rows, column-major positions */}
//           <div
//             className="grid gap-1"
//             style={{ gridTemplateColumns: "repeat(5, minmax(0, 1fr))" }}
//           >
//             {Array.from({ length: 3 }).map((_, row) =>
//               Array.from({ length: 5 }).map((_, col) => {
//                 const pos = col * 3 + row;
//                 const coin = coinAt(pos);

//                 return (
//                   <div
//                     key={pos}
//                     onClick={() => !coin && handleCellClick(pos)}
//                     className={`relative rounded-lg border-2 flex flex-col items-center justify-center p-1 min-h-[100px] text-xs text-white cursor-pointer transition-all
//                       bg-gray-700 border-gray-600
//                       ${!coin ? "hover:bg-gray-600 hover:border-gray-400" : ""}
//                     `}
//                   >
//                     {/* Position index */}
//                     <div className="text-[9px] opacity-50 absolute top-1 left-1">{pos}</div>

//                     {coin ? (
//                       <div className="flex flex-col items-center w-full gap-1 mt-2 px-0.5">

//                         {/* Coin type toggle button */}
//                         <button
//                           onClick={(e) => toggleWinged(pos, e)}
//                           title="Click to toggle winged/plain"
//                           className={`text-sm leading-none px-1 py-0.5 rounded transition-all
//                             ${coin.winged
//                               ? "bg-yellow-500/20 text-yellow-200 ring-1 ring-yellow-400"
//                               : "text-yellow-300"
//                             }`}
//                         >
//                           {coin.winged ? "🪽🟡🪽" : "🟡"}
//                         </button>

//                         {/* Color selector */}
//                         <select
//                           className={`text-white text-[10px] w-full rounded px-0.5 py-0.5 ${COIN_SELECT_BG[coin.colorCode]} border-0`}
//                           value={coin.colorCode}
//                           onClick={(e) => e.stopPropagation()}
//                           onChange={(e) =>
//                             updateCoin(pos, "colorCode", Number(e.target.value))
//                           }
//                         >
//                           {STRIKE_COIN_COLORS.map((c) => (
//                             <option key={c.value} value={c.value} className="bg-gray-800">
//                               {c.label}
//                             </option>
//                           ))}
//                         </select>

//                         {/* Value selector */}
//                         <select
//                           className={`text-white text-[10px] w-full rounded px-0.5 py-0.5 ${COIN_SELECT_BG[coin.colorCode]} border-0`}
//                           value={coin.value}
//                           onClick={(e) => e.stopPropagation()}
//                           onChange={(e) => updateCoin(pos, "value", e.target.value)}
//                         >
//                           {STRIKE_COIN_VALUES.map((v) => (
//                             <option key={v} value={v} className="bg-gray-800">
//                               {v}
//                             </option>
//                           ))}
//                         </select>

//                         {/* Boost value — only for winged coins */}
//                         {coin.winged && (
//                           <select
//                             className="text-white text-[10px] w-full rounded px-0.5 py-0.5 bg-yellow-700 border-0"
//                             value={coin.boostValue ?? ""}
//                             onClick={(e) => e.stopPropagation()}
//                             onChange={(e) =>
//                               updateCoin(pos, "boostValue", e.target.value)
//                             }
//                           >
//                             <option value="" className="bg-gray-800">Boost</option>
//                             {STRIKE_BOOST_VALUES.map((v) => (
//                               <option key={v} value={v} className="bg-gray-800">
//                                 {v}
//                               </option>
//                             ))}
//                           </select>
//                         )}

//                         {/* Remove (non-base only) */}
//                         {!coin.fromBase && (
//                           <button
//                             onClick={(e) => {
//                               e.stopPropagation();
//                               removeCoin(pos);
//                             }}
//                             className="absolute top-1 right-1 text-[10px] text-red-300 hover:text-red-100 font-bold"
//                           >
//                             ✕
//                           </button>
//                         )}
//                       </div>
//                     ) : (
//                       <span className="text-gray-500 text-[10px]">+ Add</span>
//                     )}
//                   </div>
//                 );
//               })
//             )}
//           </div>

//           {/* LEGEND */}
//           <div className="flex gap-3 text-xs flex-wrap text-gray-400">
//             <span>🟡 = plain coin &nbsp;|&nbsp; 🪽🟡🪽 = winged coin (has boost) &nbsp;|&nbsp; Click coin emoji to toggle &nbsp;|&nbsp; Click empty cell to add</span>
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
  StrikeFeatureCoin,
  STRIKE_COIN_COLORS,
  STRIKE_COIN_VALUES,
  STRIKE_BOOST_VALUES,
} from "./strikeFeatureGenerator";

type Props = {
  baseCoins: StrikeFeatureCoin[];
  onCoinsChange: (coins: StrikeFeatureCoin[]) => void;
  onSpin: (coinsSnapshot: StrikeFeatureCoin[]) => void;
  onReset: () => void;
};

const MAX_SPINS = 3;

// Coin color → select background
const COIN_SELECT_BG: Record<number, string> = {
  14:  "bg-emerald-700",
  4:  "bg-sky-700",
  19: "bg-black-700",
  9: "bg-pink-700",
};

export default function StrikeFeature({ baseCoins, onCoinsChange, onSpin, onReset }: Props) {
  const [isOpen, setIsOpen] = useState(true);
  const initialSeeds = baseCoins.map((c) => ({ ...c, fromBase: true }));
  const [coins, setCoins] = useState<StrikeFeatureCoin[]>(initialSeeds);
  const [spinsLeft, setSpinsLeft] = useState(MAX_SPINS);
  const lastSpinPositions = useRef<Set<number>>(new Set(initialSeeds.map((c) => c.position)));



  useEffect(() => { onCoinsChange(coins); }, [coins]);

  const coinAt = (pos: number) => coins.find((c) => c.position === pos);

  // Click empty cell → add plain gold coin
  const handleCellClick = (pos: number) => {
    if (coinAt(pos)) return;
    setCoins((prev) => [
      ...prev,
      {
        position: pos,
        colorCode: STRIKE_COIN_COLORS[0].value,
        value: STRIKE_COIN_VALUES[0],
        winged: false,
      },
    ]);
  };

  const removeCoin = (pos: number) => {
    const coin = coinAt(pos);
    if (!coin || coin.fromBase) return;
    setCoins((prev) => prev.filter((c) => c.position !== pos));
  };

  const updateCoin = (pos: number, field: keyof StrikeFeatureCoin, value: any) => {
    setCoins((prev) =>
      prev.map((c) => (c.position === pos ? { ...c, [field]: value } : c))
    );
  };

  // Toggle between plain gold and winged
  const toggleWinged = (pos: number, e: React.MouseEvent) => {
    e.stopPropagation();
    const coin = coinAt(pos);
    if (!coin) return;
    setCoins((prev) =>
      prev.map((c) =>
        c.position === pos
          ? { ...c, winged: !c.winged, boostValue: !c.winged ? c.boostValue : undefined }
          : c
      )
    );
  };

  const handleSpin = () => {
    if (spinsLeft <= 0) return;
    const currentPositions = new Set(coins.map((c) => c.position));
    const hasNewCoin = [...currentPositions].some(
      (p) => !lastSpinPositions.current.has(p)
    );
    const newSpins = hasNewCoin ? MAX_SPINS : spinsLeft - 1;
    setSpinsLeft(newSpins);
    lastSpinPositions.current = new Set(currentPositions);
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
        <h2 className="text-lg font-semibold text-orange-400">🟠 Strike Feature</h2>
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
                spinsLeft > 0
                  ? "bg-orange-600 hover:bg-orange-500"
                  : "bg-gray-600 cursor-not-allowed opacity-50"
              }`}
            >
              SPIN
            </button>

            <span className="text-sm text-gray-300">
              {spinsLeft} spin{spinsLeft !== 1 ? "s" : ""} left
            </span>

            <button
              onClick={resetFeature}
              className="px-3 py-1 bg-gray-600 hover:bg-gray-500 rounded text-sm"
            >
              Reset
            </button>
          </div>

          {/* GRID — 5 cols × 3 rows, column-major positions */}
          <div
            className="grid gap-1"
            style={{ gridTemplateColumns: "repeat(5, minmax(0, 1fr))" }}
          >
            {Array.from({ length: 3 }).map((_, row) =>
              Array.from({ length: 5 }).map((_, col) => {
                const pos = col * 3 + row;
                const coin = coinAt(pos);

                return (
                  <div
                    key={pos}
                    onClick={() => !coin && handleCellClick(pos)}
                    className={`relative rounded-lg border-2 flex flex-col items-center justify-center p-1 min-h-[100px] text-xs text-white cursor-pointer transition-all
                      bg-gray-700 border-gray-600
                      ${!coin ? "hover:bg-gray-600 hover:border-gray-400" : ""}
                    `}
                  >
                    {/* Position index */}
                    <div className="text-[9px] opacity-50 absolute top-1 left-1">{pos}</div>

                    {coin ? (
                      <div className="flex flex-col items-center w-full gap-1 mt-2 px-0.5">

                        {/* Coin type toggle button */}
                        <button
                          onClick={(e) => toggleWinged(pos, e)}
                          title="Click to toggle winged/plain"
                          className={`text-sm leading-none px-1 py-0.5 rounded transition-all
                            ${coin.winged
                              ? "bg-yellow-500/20 text-yellow-200 ring-1 ring-yellow-400"
                              : "text-yellow-300"
                            }`}
                        >
                          {coin.winged ? "🪽🟡🪽" : "🟡"}
                        </button>

                        {/* Color selector */}
                        <select
                          className={`text-white text-[10px] w-full rounded px-0.5 py-0.5 ${COIN_SELECT_BG[coin.colorCode]} border-0`}
                          value={coin.colorCode}
                          onClick={(e) => e.stopPropagation()}
                          onChange={(e) =>
                            updateCoin(pos, "colorCode", Number(e.target.value))
                          }
                        >
                          {STRIKE_COIN_COLORS.map((c) => (
                            <option key={c.value} value={c.value} className="bg-gray-800">
                              {c.label}
                            </option>
                          ))}
                        </select>

                        {/* Value selector */}
                        <select
                          className={`text-white text-[10px] w-full rounded px-0.5 py-0.5 ${COIN_SELECT_BG[coin.colorCode]} border-0`}
                          value={coin.value}
                          onClick={(e) => e.stopPropagation()}
                          onChange={(e) => updateCoin(pos, "value", e.target.value)}
                        >
                          {STRIKE_COIN_VALUES.map((v) => (
                            <option key={v} value={v} className="bg-gray-800">
                              {v}
                            </option>
                          ))}
                        </select>

                        {/* Boost value — only for winged coins */}
                        {coin.winged && (
                          <select
                            className="text-white text-[10px] w-full rounded px-0.5 py-0.5 bg-yellow-700 border-0"
                            value={coin.boostValue ?? ""}
                            onClick={(e) => e.stopPropagation()}
                            onChange={(e) =>
                              updateCoin(pos, "boostValue", e.target.value)
                            }
                          >
                            <option value="" className="bg-gray-800">Boost</option>
                            {STRIKE_BOOST_VALUES.map((v) => (
                              <option key={v} value={v} className="bg-gray-800">
                                {v}
                              </option>
                            ))}
                          </select>
                        )}

                        {/* Remove (non-base only) */}
                        {!coin.fromBase && (
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              removeCoin(pos);
                            }}
                            className="absolute top-1 right-1 text-[10px] text-red-300 hover:text-red-100 font-bold"
                          >
                            ✕
                          </button>
                        )}
                      </div>
                    ) : (
                      <span className="text-gray-500 text-[10px]">+ Add</span>
                    )}
                  </div>
                );
              })
            )}
          </div>

          {/* LEGEND */}
          <div className="flex gap-3 text-xs flex-wrap text-gray-400">
            <span>🟡 = plain coin &nbsp;|&nbsp; 🪽🟡🪽 = winged coin (has boost) &nbsp;|&nbsp; Click coin emoji to toggle &nbsp;|&nbsp; Click empty cell to add</span>
          </div>

        </div>
      )}
    </div>
  );
}