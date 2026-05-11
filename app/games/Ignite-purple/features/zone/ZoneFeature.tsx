// /* eslint-disable @typescript-eslint/no-explicit-any */
// "use client";

// import { useState, useEffect, useRef } from "react";
// import {
//   ZoneFeatureCoin,
//   ZONE_COIN_COLORS,
//   ZONE_COIN_VALUES,
//   ZONE_BG_CLASS,
//   ZONE_BORDER_CLASS,
//   getZoneBgColor,
// } from "./zoneFeatureGenerator";

// type Props = {
//   baseCoins: ZoneFeatureCoin[];
//   splitter: number;        // 1–7, from base game ZoneScat / AllScat
//   multipliers: number[];   // from base game ZoneMultipliers input
//   onCoinsChange: (coins: ZoneFeatureCoin[]) => void;
//   onSpin: (coinsSnapshot: ZoneFeatureCoin[]) => void;
//   onReset: () => void;
// };

// const MAX_SPINS = 3;

// const COIN_SELECT_BG: Record<number, string> = {
//   4:  "bg-emerald-700",
//   9:  "bg-sky-700",
//   14: "bg-orange-700",
//   19: "bg-pink-700",
// };

// export default function ZoneFeature({
//   baseCoins,
//   splitter,
//   multipliers,
//   onCoinsChange,
//   onSpin,
//   onReset,
// }: Props) {
//   const [isOpen, setIsOpen] = useState(true);
//   const [coins, setCoins] = useState<ZoneFeatureCoin[]>([]);
//   const [spinsLeft, setSpinsLeft] = useState(MAX_SPINS);
//   const lastSpinPositions = useRef<Set<number>>(new Set());

//   // Seed base coins on mount / when base changes
//   useEffect(() => {
//     const seeded = baseCoins.map((c) => ({ ...c, fromBase: true }));
//     setCoins(seeded);
//     setSpinsLeft(MAX_SPINS);
//     lastSpinPositions.current = new Set(seeded.map((c) => c.position));
//   }, [JSON.stringify(baseCoins)]);

//   useEffect(() => {
//     onCoinsChange(coins);
//   }, [coins]);

//   const coinAt = (pos: number) => coins.find((c) => c.position === pos);

//   const handleCellClick = (pos: number) => {
//     if (coinAt(pos)) return;
//     setCoins((prev) => [
//       ...prev,
//       { position: pos, colorCode: ZONE_COIN_COLORS[0].value, value: ZONE_COIN_VALUES[0] },
//     ]);
//   };

//   const removeCoin = (pos: number) => {
//     const coin = coinAt(pos);
//     if (!coin || coin.fromBase) return;
//     setCoins((prev) => prev.filter((c) => c.position !== pos));
//   };

//   const updateCoin = (pos: number, field: keyof ZoneFeatureCoin, value: any) => {
//     setCoins((prev) =>
//       prev.map((c) => (c.position === pos ? { ...c, [field]: value } : c))
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

//   const activeSplitter = splitter >= 1 && splitter <= 7 ? splitter : 1;

//   return (
//     <div className="bg-gray-800 rounded-xl">
//       {/* HEADER */}
//       <div
//         onClick={() => setIsOpen(!isOpen)}
//         className="flex justify-between items-center p-4 cursor-pointer"
//       >
//         <h2 className="text-lg font-semibold text-sky-400">🔵 Zone Feature</h2>
//         <div className="flex items-center gap-3 text-sm">
//           {splitter > 0 && (
//             <span className="text-sky-300 bg-sky-900 px-2 py-0.5 rounded text-xs">
//               Splitter: {splitter}
//             </span>
//           )}
//           {multipliers.length > 0 && (
//             <span className="text-sky-300 bg-sky-900 px-2 py-0.5 rounded text-xs">
//               ×[{multipliers.join(",")}]
//             </span>
//           )}
//           <span>{isOpen ? "▼" : "▶"}</span>
//         </div>
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
//                   ? "bg-sky-600 hover:bg-sky-500"
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
//                 const zoneBg = getZoneBgColor(pos, activeSplitter);

//                 return (
//                   <div
//                     key={pos}
//                     onClick={() => !coin && handleCellClick(pos)}
//                     className={`relative rounded-lg border-2 flex flex-col items-center justify-center p-1 min-h-[90px] text-xs text-white cursor-pointer transition-all
//                       ${ZONE_BG_CLASS[zoneBg]} ${ZONE_BORDER_CLASS[zoneBg]}
//                       hover:brightness-110
//                     `}
//                   >
//                     {/* Position index */}
//                     <div className="text-[9px] opacity-50 absolute top-1 left-1">{pos}</div>

//                     {coin ? (
//                       <div className="flex flex-col items-center w-full gap-1 mt-2">
//                         {/* Coin emoji */}
//                         <div className="text-base leading-none">🟡</div>

//                         {/* Color selector */}
//                         <select
//                           className={`text-white text-[10px] w-full rounded px-0.5 py-0.5 ${COIN_SELECT_BG[coin.colorCode]} border-0`}
//                           value={coin.colorCode}
//                           onClick={(e) => e.stopPropagation()}
//                           onChange={(e) =>
//                             updateCoin(pos, "colorCode", Number(e.target.value))
//                           }
//                         >
//                           {ZONE_COIN_COLORS.map((c:any) => (
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
//                           {ZONE_COIN_VALUES.map((v:any) => (
//                             <option key={v} value={v} className="bg-gray-800">
//                               {v}
//                             </option>
//                           ))}
//                         </select>

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
//                       <span className="text-white/40 text-[10px]">+ Add</span>
//                     )}
//                   </div>
//                 );
//               })
//             )}
//           </div>

//           {/* LEGEND */}
//           <div className="flex gap-3 text-xs flex-wrap text-gray-400">
//             <span>🟡 = coin &nbsp;|&nbsp; Click empty cell to add coin</span>
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
  ZoneFeatureCoin,
  ZONE_COIN_COLORS,
  ZONE_COIN_VALUES,
  ZONE_BG_CLASS,
  ZONE_BORDER_CLASS,
  getZoneBgColor,
} from "./zoneFeatureGenerator";

type Props = {
  baseCoins: ZoneFeatureCoin[];
  splitter: number;        // 1–7, from base game ZoneScat / AllScat
  multipliers: number[];   // from base game ZoneMultipliers input
  onCoinsChange: (coins: ZoneFeatureCoin[]) => void;
  onSpin: (coinsSnapshot: ZoneFeatureCoin[]) => void;
  onReset: () => void;
};

const MAX_SPINS = 3;

const COIN_SELECT_BG: Record<number, string> = {
  14:  "bg-emerald-700",
  19:  "bg-black-700",
  4: "bg-orange-700",
  9: "bg-pink-700",
};

export default function ZoneFeature({
  baseCoins,
  splitter,
  multipliers,
  onCoinsChange,
  onSpin,
  onReset,
}: Props) {
  const [isOpen, setIsOpen] = useState(true);
  const initialSeeds = baseCoins.map((c) => ({ ...c, fromBase: true }));
  const [coins, setCoins] = useState<ZoneFeatureCoin[]>(initialSeeds);
  const [spinsLeft, setSpinsLeft] = useState(MAX_SPINS);
  const lastSpinPositions = useRef<Set<number>>(new Set(initialSeeds.map((c) => c.position)));

  useEffect(() => {
    onCoinsChange(coins);
  }, [coins]);

  const coinAt = (pos: number) => coins.find((c) => c.position === pos);

  const handleCellClick = (pos: number) => {
    if (coinAt(pos)) return;
    setCoins((prev) => [
      ...prev,
      { position: pos, colorCode: ZONE_COIN_COLORS[0].value, value: ZONE_COIN_VALUES[0] },
    ]);
  };

  const removeCoin = (pos: number) => {
    const coin = coinAt(pos);
    if (!coin || coin.fromBase) return;
    setCoins((prev) => prev.filter((c) => c.position !== pos));
  };

  const updateCoin = (pos: number, field: keyof ZoneFeatureCoin, value: any) => {
    setCoins((prev) =>
      prev.map((c) => (c.position === pos ? { ...c, [field]: value } : c))
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

  const activeSplitter = splitter >= 1 && splitter <= 7 ? splitter : 1;

  return (
    <div className="bg-gray-800 rounded-xl">
      {/* HEADER */}
      <div
        onClick={() => setIsOpen(!isOpen)}
        className="flex justify-between items-center p-4 cursor-pointer"
      >
        <h2 className="text-lg font-semibold text-sky-400">🔵 Zone Feature</h2>
        <div className="flex items-center gap-3 text-sm">
          {splitter > 0 && (
            <span className="text-sky-300 bg-sky-900 px-2 py-0.5 rounded text-xs">
              Splitter: {splitter}
            </span>
          )}
          {multipliers.length > 0 && (
            <span className="text-sky-300 bg-sky-900 px-2 py-0.5 rounded text-xs">
              ×[{multipliers.join(",")}]
            </span>
          )}
          <span>{isOpen ? "▼" : "▶"}</span>
        </div>
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
                  ? "bg-sky-600 hover:bg-sky-500"
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
                const zoneBg = getZoneBgColor(pos, activeSplitter);

                return (
                  <div
                    key={pos}
                    onClick={() => !coin && handleCellClick(pos)}
                    className={`relative rounded-lg border-2 flex flex-col items-center justify-center p-1 min-h-[90px] text-xs text-white cursor-pointer transition-all
                      ${ZONE_BG_CLASS[zoneBg]} ${ZONE_BORDER_CLASS[zoneBg]}
                      hover:brightness-110
                    `}
                  >
                    {/* Position index */}
                    <div className="text-[9px] opacity-50 absolute top-1 left-1">{pos}</div>

                    {coin ? (
                      <div className="flex flex-col items-center w-full gap-1 mt-2">
                        {/* Coin emoji */}
                        <div className="text-base leading-none">🟡</div>

                        {/* Color selector */}
                        <select
                          className={`text-white text-[10px] w-full rounded px-0.5 py-0.5 ${COIN_SELECT_BG[coin.colorCode]} border-0`}
                          value={coin.colorCode}
                          onClick={(e) => e.stopPropagation()}
                          onChange={(e) =>
                            updateCoin(pos, "colorCode", Number(e.target.value))
                          }
                        >
                          {ZONE_COIN_COLORS.map((c) => (
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
                          {ZONE_COIN_VALUES.map((v) => (
                            <option key={v} value={v} className="bg-gray-800">
                              {v}
                            </option>
                          ))}
                        </select>

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
                      <span className="text-white/40 text-[10px]">+ Add</span>
                    )}
                  </div>
                );
              })
            )}
          </div>

          {/* LEGEND */}
          <div className="flex gap-3 text-xs flex-wrap text-gray-400">
            <span>🟡 = coin &nbsp;|&nbsp; Click empty cell to add coin</span>
          </div>

        </div>
      )}
    </div>
  );
}