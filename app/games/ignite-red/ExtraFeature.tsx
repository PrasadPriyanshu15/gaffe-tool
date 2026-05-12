// /* eslint-disable @typescript-eslint/no-explicit-any */
// "use client";

// import { useState, useRef } from "react";
// import {
//   ExtraFeatureCoin, EXTRA_COIN_COLORS, EXTRA_COIN_VALUES,
//   UpgradeInfo, generateExtraFeatureGaffe,
// } from "./extraFeatureGenerator";
// import { posToMetric, UPGRADE_CODE_TO_FEATURES } from "./config";

// type Props = {
//   baseCoins:     ExtraFeatureCoin[];
//   onCoinsChange: (coins: ExtraFeatureCoin[]) => void;
//   onSpin:        (line: string) => void;
//   onReset:       () => void;
//   onUpgrade:     (newFeatures: string[], carryCoins: ExtraFeatureCoin[]) => void;
// };

// const MAX_SPINS = 4;

// const COIN_SELECT_BG: Record<number, string> = {
//   4: "bg-orange-700", 9: "bg-blue-700", 14: "bg-pink-700", 19: "bg-indigo-700",
// };
// const CELL_BORDER: Record<number, string> = {
//   4: "border-orange-500", 9: "border-blue-500", 14: "border-pink-500", 19: "border-indigo-500",
// };

// export default function ExtraFeature({ baseCoins, onCoinsChange, onSpin, onReset, onUpgrade }: Props) {
//   const [isOpen,    setIsOpen]    = useState(true);
//   const init = baseCoins.map(c => ({ ...c, fromBase: true }));
//   const [coins,     setCoins]     = useState<ExtraFeatureCoin[]>(init);
//   const [spinsLeft, setSpinsLeft] = useState(MAX_SPINS);
//   const lastPos = useRef<Set<number>>(new Set(init.map(c => c.position)));

//   const [upgradePos,     setUpgradePos]     = useState<number | null>(null);
//   const [upgradeFeatSel, setUpgradeFeatSel] = useState<string>("");
//   const [pendingUpgrade, setPendingUpgrade] = useState<UpgradeInfo | null>(null);

//   const coinAt = (pos: number) => coins.find(c => c.position === pos);

//   const addCoin = (pos: number) => {
//     if (coinAt(pos)) return;
//     setCoins(prev => [...prev, { position: pos, colorCode: EXTRA_COIN_COLORS[0].value, value: EXTRA_COIN_VALUES[0] }]);
//   };
//   const removeCoin = (pos: number) => {
//     if (coinAt(pos)?.fromBase) return;
//     if (upgradePos === pos) { setUpgradePos(null); setUpgradeFeatSel(""); setPendingUpgrade(null); }
//     setCoins(prev => prev.filter(c => c.position !== pos));
//   };
//   const updateCoin = (pos: number, field: keyof ExtraFeatureCoin, val: any) =>
//     setCoins(prev => prev.map(c => c.position === pos ? { ...c, [field]: val } : c));

//   const handleUpgradeRadio = (pos: number) => {
//     if (upgradePos === pos) { setUpgradePos(null); setUpgradeFeatSel(""); setPendingUpgrade(null); return; }
//     setUpgradePos(pos); setUpgradeFeatSel(""); setPendingUpgrade(null);
//   };

//   const upgradeOptions: string[] = (() => {
//     if (upgradePos === null) return [];
//     const uc = coinAt(upgradePos);
//     if (!uc) return [];
//     return (UPGRADE_CODE_TO_FEATURES[uc.colorCode] ?? []).filter(f => f !== "EXTRA");
//   })();

//   const handleSpin = () => {
//     if (spinsLeft <= 0) return;
//     const cur = new Set(coins.map(c => c.position));
//     const hasNew = [...cur].some(p => !lastPos.current.has(p));
//     setSpinsLeft(hasNew ? MAX_SPINS : spinsLeft - 1);
//     lastPos.current = cur;
//     onCoinsChange(coins);

//     let upgrade: UpgradeInfo | null = null;
//     if (upgradePos !== null && upgradeFeatSel) {
//       const uc = coinAt(upgradePos);
//       if (uc) { upgrade = { col: Math.floor(upgradePos / 3), row: upgradePos % 3, features: [upgradeFeatSel] }; setPendingUpgrade(upgrade); }
//     }
//     onSpin(generateExtraFeatureGaffe(coins, upgrade));
//   };

//   const reset = () => {
//     const s = baseCoins.map(c => ({ ...c, fromBase: true }));
//     setCoins(s); setSpinsLeft(MAX_SPINS);
//     lastPos.current = new Set(s.map(c => c.position));
//     setUpgradePos(null); setUpgradeFeatSel(""); setPendingUpgrade(null);
//     onReset();
//   };

//   const handleGoToUpgrade = () => {
//     if (!pendingUpgrade) return;
//     const newFeatures = [...new Set(["extra", ...pendingUpgrade.features.map(f => f.toLowerCase())])];
//     onUpgrade(newFeatures, coins);
//   };

//   const filled14 = coins.length >= 14;

//   return (
//     <div className="bg-gray-800 rounded-xl border border-green-700">
//       <div onClick={() => setIsOpen(!isOpen)} className="flex justify-between items-center p-4 cursor-pointer select-none">
//         <div className="flex items-center gap-3">
//           <h2 className="text-green-400 font-bold font-mono">🟢 Extra Feature</h2>
//           {filled14 && <span className="text-yellow-400 text-xs font-mono bg-yellow-900/40 px-2 py-0.5 rounded border border-yellow-700">⚠ 14 filled → lastPositionReel on next spin</span>}
//         </div>
//         <span className="text-gray-500">{isOpen ? "▼" : "▶"}</span>
//       </div>

//       {isOpen && (
//         <div className="p-4 pt-0 flex flex-col gap-3">
//           <div className="flex items-center gap-3 flex-wrap">
//             <button onClick={handleSpin} disabled={spinsLeft <= 0}
//               className={`px-5 py-1.5 rounded font-bold font-mono transition-all ${spinsLeft > 0 ? "bg-green-600 hover:bg-green-500" : "bg-gray-600 opacity-50 cursor-not-allowed"}`}>
//               SPIN
//             </button>
//             <span className="text-sm text-gray-400 font-mono">{spinsLeft} spin{spinsLeft !== 1 ? "s" : ""} left</span>
//             <button onClick={reset} className="px-3 py-1 bg-gray-600 hover:bg-gray-500 rounded text-sm">Reset</button>
//           </div>

//           {pendingUpgrade && upgradeFeatSel && (
//             <div className="flex items-center gap-3 bg-yellow-900/30 border border-yellow-700 rounded-lg p-3">
//               <span className="text-yellow-300 text-sm font-mono">✦ Upgrade ready:</span>
//               <button onClick={handleGoToUpgrade} className="px-4 py-1.5 bg-yellow-600 hover:bg-yellow-500 rounded font-bold text-sm font-mono">
//                 Go to extra + {pendingUpgrade.features.map(f => f.toLowerCase()).join(" + ")}
//               </button>
//               <button onClick={() => { setPendingUpgrade(null); setUpgradeFeatSel(""); setUpgradePos(null); }} className="text-gray-400 hover:text-red-400 text-xs">✕</button>
//             </div>
//           )}

//           {upgradePos !== null && !pendingUpgrade && upgradeOptions.length > 0 && (
//             <div className="flex items-center gap-2 bg-yellow-900/20 border border-yellow-800 rounded-lg p-2">
//               <span className="text-yellow-300 text-xs font-mono">Upgrade {posToMetric(upgradePos)} →</span>
//               <select className="bg-yellow-900 text-yellow-100 text-xs rounded px-2 py-1 font-mono border border-yellow-700"
//                 value={upgradeFeatSel} onChange={e => setUpgradeFeatSel(e.target.value)}>
//                 <option value="">Select feature...</option>
//                 {upgradeOptions.map(f => <option key={f} value={f}>{f}</option>)}
//               </select>
//               {upgradeFeatSel && <span className="text-yellow-400 text-xs font-mono">→ SPIN to confirm</span>}
//             </div>
//           )}
//           {upgradePos !== null && upgradeOptions.length === 0 && (
//             <div className="text-xs text-gray-500 font-mono bg-gray-700 px-3 py-1.5 rounded">ℹ No upgrades available from this coin color</div>
//           )}

//           <div className="grid gap-1" style={{ gridTemplateColumns: "repeat(5, minmax(0,1fr))" }}>
//             {Array.from({ length: 3 }).map((_, row) =>
//               Array.from({ length: 5 }).map((_, col) => {
//                 const pos  = col * 3 + row;
//                 const coin = coinAt(pos);
//                 return (
//                   <div key={pos} onClick={() => !coin && addCoin(pos)}
//                     className={`relative rounded-lg border-2 flex flex-col items-center p-1 min-h-[95px] text-xs text-white cursor-pointer transition-all hover:brightness-110
//                       ${coin ? `bg-gray-700 ${CELL_BORDER[coin.colorCode] ?? "border-gray-500"}` : "bg-gray-700 border-gray-600 hover:bg-gray-600 hover:border-gray-400"}`}>
//                     <div className="flex justify-between w-full text-[9px] opacity-40">
//                       <span>{pos}</span><span className="font-mono">{posToMetric(pos)}</span>
//                     </div>
//                     {coin ? (
//                       <div className="flex flex-col items-center w-full gap-0.5 mt-0.5">
//                         <div className="text-sm">🟡</div>
//                         <select className={`text-white text-[9px] w-full rounded px-0.5 py-0.5 border-0 font-mono ${COIN_SELECT_BG[coin.colorCode] ?? "bg-gray-700"}`}
//                           value={coin.colorCode} onClick={e => e.stopPropagation()}
//                           onChange={e => updateCoin(pos, "colorCode", Number(e.target.value))}>
//                           {EXTRA_COIN_COLORS.map(c => <option key={c.value} value={c.value} className="bg-gray-800">{c.label}</option>)}
//                         </select>
//                         <select className={`text-white text-[9px] w-full rounded px-0.5 py-0.5 border-0 font-mono ${COIN_SELECT_BG[coin.colorCode] ?? "bg-gray-700"}`}
//                           value={coin.value} onClick={e => e.stopPropagation()}
//                           onChange={e => updateCoin(pos, "value", e.target.value)}>
//                           {EXTRA_COIN_VALUES.map(v => <option key={v} value={v} className="bg-gray-800">{v}</option>)}
//                         </select>
//                         <div className="flex items-center gap-1 mt-0.5" onClick={e => e.stopPropagation()}>
//                           <input type="radio" name="extraUpgrade" className="accent-yellow-400 w-3 h-3 cursor-pointer"
//                             checked={upgradePos === pos} onChange={() => handleUpgradeRadio(pos)} />
//                           <span className="text-[8px] text-yellow-300 font-mono">upgrade</span>
//                         </div>
//                         {!coin.fromBase && (
//                           <button onClick={e => { e.stopPropagation(); removeCoin(pos); }}
//                             className="absolute top-1 right-1 text-[10px] text-red-400 hover:text-red-200 font-bold">✕</button>
//                         )}
//                       </div>
//                     ) : (
//                       <span className="text-white/30 text-[10px] mt-3">+Add</span>
//                     )}
//                   </div>
//                 );
//               })
//             )}
//           </div>
//           <div className="text-[10px] text-gray-600 font-mono">🟡 click empty cell to add · ✕ remove · ✦ radio = upgrade trigger · 14 coins triggers lastPositionReel</div>
//         </div>
//       )}
//     </div>
//   );
// }




/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { useState, useRef } from "react";
import {
  ExtraFeatureCoin, EXTRA_COIN_COLORS, EXTRA_COIN_VALUES,
  UpgradeInfo, generateExtraFeatureGaffe,
} from "./extraFeatureGenerator";
import { posToMetric, UPGRADE_CODE_TO_FEATURES } from "./config";

type Props = {
  baseCoins:     ExtraFeatureCoin[];
  onCoinsChange: (coins: ExtraFeatureCoin[]) => void;
  onSpin:        (line: string) => void;
  onReset:       () => void;
  onUpgrade:     (newFeatures: string[], carryCoins: ExtraFeatureCoin[]) => void;
};

const MAX_SPINS = 4;

const COIN_SELECT_BG: Record<number, string> = {
  4: "bg-orange-700", 9: "bg-blue-700", 14: "bg-pink-700", 19: "bg-indigo-700",
};
const CELL_BORDER: Record<number, string> = {
  4: "border-orange-500", 9: "border-blue-500", 14: "border-pink-500", 19: "border-indigo-500",
};

export default function ExtraFeature({ baseCoins, onCoinsChange, onSpin, onReset, onUpgrade }: Props) {
  const [isOpen,    setIsOpen]    = useState(true);
  const init = baseCoins.map(c => ({ ...c, fromBase: true }));
  const [coins,     setCoins]     = useState<ExtraFeatureCoin[]>(init);
  const [spinsLeft, setSpinsLeft] = useState(MAX_SPINS);
  const lastPos = useRef<Set<number>>(new Set(init.map(c => c.position)));

  const [upgradePos,      setUpgradePos]      = useState<number | null>(null);
  // For single-color: one selected feature string; for allColor: multiple via Set
  const [upgradeFeatSel,  setUpgradeFeatSel]  = useState<string>("");
  const [upgradeMultiSel, setUpgradeMultiSel] = useState<Set<string>>(new Set());
  const [pendingUpgrade,  setPendingUpgrade]  = useState<UpgradeInfo | null>(null);

  const coinAt = (pos: number) => coins.find(c => c.position === pos);

  const addCoin = (pos: number) => {
    if (coinAt(pos)) return;
    setCoins(prev => [...prev, { position: pos, colorCode: EXTRA_COIN_COLORS[0].value, value: EXTRA_COIN_VALUES[0] }]);
  };
  const removeCoin = (pos: number) => {
    if (coinAt(pos)?.fromBase) return;
    if (upgradePos === pos) { setUpgradePos(null); setUpgradeFeatSel(""); setUpgradeMultiSel(new Set()); setPendingUpgrade(null); }
    setCoins(prev => prev.filter(c => c.position !== pos));
  };
  const updateCoin = (pos: number, field: keyof ExtraFeatureCoin, val: any) =>
    setCoins(prev => prev.map(c => c.position === pos ? { ...c, [field]: val } : c));

  const handleUpgradeRadio = (pos: number) => {
    if (upgradePos === pos) {
      setUpgradePos(null); setUpgradeFeatSel(""); setUpgradeMultiSel(new Set()); setPendingUpgrade(null); return;
    }
    setUpgradePos(pos); setUpgradeFeatSel(""); setUpgradeMultiSel(new Set()); setPendingUpgrade(null);
  };

  // Determine if selected upgrade coin is allColor (19)
  const upgradeCoinn = upgradePos !== null ? coinAt(upgradePos) : null;
  const isAllColor   = upgradeCoinn?.colorCode === 19;

  // Options: features this coin can upgrade to, excluding EXTRA (already active)
  const upgradeOptions: string[] = (() => {
    if (!upgradeCoinn) return [];
    return (UPGRADE_CODE_TO_FEATURES[upgradeCoinn.colorCode] ?? []).filter(f => f !== "EXTRA");
  })();

  // For allColor multi-select toggle
  const toggleMulti = (f: string) => {
    setUpgradeMultiSel(prev => {
      const next = new Set(prev);
      if (next.has(f)) next.delete(f); else next.add(f);
      return next;
    });
  };

  const handleSpin = () => {
    if (spinsLeft <= 0) return;
    const cur = new Set(coins.map(c => c.position));
    const hasNew = [...cur].some(p => !lastPos.current.has(p));
    setSpinsLeft(hasNew ? MAX_SPINS : spinsLeft - 1);
    lastPos.current = cur;
    onCoinsChange(coins);

    let upgrade: UpgradeInfo | null = null;
    if (upgradePos !== null && upgradeCoinn) {
      const selectedFeats = isAllColor
        ? Array.from(upgradeMultiSel)
        : upgradeFeatSel ? [upgradeFeatSel] : [];
      if (selectedFeats.length > 0) {
        upgrade = {
          col: Math.floor(upgradePos / 3),
          row: upgradePos % 3,
          features: selectedFeats,
        };
        setPendingUpgrade(upgrade);
      }
    }
    onSpin(generateExtraFeatureGaffe(coins, upgrade));
  };

  const reset = () => {
    const s = baseCoins.map(c => ({ ...c, fromBase: true }));
    setCoins(s); setSpinsLeft(MAX_SPINS);
    lastPos.current = new Set(s.map(c => c.position));
    setUpgradePos(null); setUpgradeFeatSel(""); setUpgradeMultiSel(new Set()); setPendingUpgrade(null);
    onReset();
  };

  const handleGoToUpgrade = () => {
    if (!pendingUpgrade) return;
    const newFeatures = [...new Set(["extra", ...pendingUpgrade.features.map(f => f.toLowerCase())])];
    onUpgrade(newFeatures, coins);
  };

  const filled14 = coins.length >= 14;

  return (
    <div className="bg-gray-800 rounded-xl border border-green-700">
      <div onClick={() => setIsOpen(!isOpen)} className="flex justify-between items-center p-4 cursor-pointer select-none">
        <div className="flex items-center gap-3">
          <h2 className="text-green-400 font-bold font-mono">🟢 Extra Feature</h2>
          {filled14 && <span className="text-yellow-400 text-xs font-mono bg-yellow-900/40 px-2 py-0.5 rounded border border-yellow-700">⚠ 14 filled → lastPositionReel on next spin</span>}
        </div>
        <span className="text-gray-500">{isOpen ? "▼" : "▶"}</span>
      </div>

      {isOpen && (
        <div className="p-4 pt-0 flex flex-col gap-3">
          <div className="flex items-center gap-3 flex-wrap">
            <button onClick={handleSpin} disabled={spinsLeft <= 0}
              className={`px-5 py-1.5 rounded font-bold font-mono transition-all ${spinsLeft > 0 ? "bg-green-600 hover:bg-green-500" : "bg-gray-600 opacity-50 cursor-not-allowed"}`}>
              SPIN
            </button>
            <span className="text-sm text-gray-400 font-mono">{spinsLeft} spin{spinsLeft !== 1 ? "s" : ""} left</span>
            <button onClick={reset} className="px-3 py-1 bg-gray-600 hover:bg-gray-500 rounded text-sm">Reset</button>
          </div>

          {/* Upgrade confirmed → show Go To button */}
          {pendingUpgrade && pendingUpgrade.features.length > 0 && (
            <div className="flex items-center gap-3 bg-yellow-900/30 border border-yellow-700 rounded-lg p-3">
              <span className="text-yellow-300 text-sm font-mono">✦ Upgrade ready:</span>
              <button onClick={handleGoToUpgrade} className="px-4 py-1.5 bg-yellow-600 hover:bg-yellow-500 rounded font-bold text-sm font-mono">
                Go to extra + {pendingUpgrade.features.map(f => f.toLowerCase()).join(" + ")}
              </button>
              <button onClick={() => { setPendingUpgrade(null); setUpgradeFeatSel(""); setUpgradeMultiSel(new Set()); setUpgradePos(null); }} className="text-gray-400 hover:text-red-400 text-xs">✕</button>
            </div>
          )}

          {/* Upgrade coin selected → show feature selector */}
          {upgradePos !== null && !pendingUpgrade && upgradeOptions.length > 0 && (
            <div className="flex flex-col gap-2 bg-yellow-900/20 border border-yellow-800 rounded-lg p-2">
              <span className="text-yellow-300 text-xs font-mono">
                Upgrade {posToMetric(upgradePos)} →
                {isAllColor
                  ? " AllColor coin: select multiple features"
                  : " Single-color coin: select 1 feature"}
              </span>
              {isAllColor ? (
                // Multi-select checkboxes for allColor coin
                <div className="flex gap-2 flex-wrap">
                  {upgradeOptions.map(f => {
                    const checked = upgradeMultiSel.has(f);
                    return (
                      <label key={f} className="flex items-center gap-1 cursor-pointer bg-yellow-900/40 border border-yellow-700 rounded px-2 py-1">
                        <input type="checkbox" className="accent-yellow-400 w-3 h-3"
                          checked={checked} onChange={() => toggleMulti(f)} />
                        <span className="text-yellow-100 text-xs font-mono">{f}</span>
                      </label>
                    );
                  })}
                </div>
              ) : (
                // Single-select dropdown for single-color coin
                <select className="bg-yellow-900 text-yellow-100 text-xs rounded px-2 py-1 font-mono border border-yellow-700 self-start"
                  value={upgradeFeatSel} onChange={e => setUpgradeFeatSel(e.target.value)}>
                  <option value="">Select feature...</option>
                  {upgradeOptions.map(f => <option key={f} value={f}>{f}</option>)}
                </select>
              )}
              {((isAllColor && upgradeMultiSel.size > 0) || (!isAllColor && upgradeFeatSel)) && (
                <span className="text-yellow-400 text-xs font-mono">→ SPIN to confirm</span>
              )}
            </div>
          )}
          {upgradePos !== null && upgradeOptions.length === 0 && (
            <div className="text-xs text-gray-500 font-mono bg-gray-700 px-3 py-1.5 rounded">ℹ No upgrades available from this coin color</div>
          )}

          <div className="grid gap-1" style={{ gridTemplateColumns: "repeat(5, minmax(0,1fr))" }}>
            {Array.from({ length: 3 }).map((_, row) =>
              Array.from({ length: 5 }).map((_, col) => {
                const pos  = col * 3 + row;
                const coin = coinAt(pos);
                return (
                  <div key={pos} onClick={() => !coin && addCoin(pos)}
                    className={`relative rounded-lg border-2 flex flex-col items-center p-1 min-h-[95px] text-xs text-white cursor-pointer transition-all hover:brightness-110
                      ${coin ? `bg-gray-700 ${CELL_BORDER[coin.colorCode] ?? "border-gray-500"}` : "bg-gray-700 border-gray-600 hover:bg-gray-600 hover:border-gray-400"}`}>
                    <div className="flex justify-between w-full text-[9px] opacity-40">
                      <span>{pos}</span><span className="font-mono">{posToMetric(pos)}</span>
                    </div>
                    {coin ? (
                      <div className="flex flex-col items-center w-full gap-0.5 mt-0.5">
                        <div className="text-sm">🟡</div>
                        <select className={`text-white text-[9px] w-full rounded px-0.5 py-0.5 border-0 font-mono ${COIN_SELECT_BG[coin.colorCode] ?? "bg-gray-700"}`}
                          value={coin.colorCode} onClick={e => e.stopPropagation()}
                          onChange={e => updateCoin(pos, "colorCode", Number(e.target.value))}>
                          {EXTRA_COIN_COLORS.map(c => <option key={c.value} value={c.value} className="bg-gray-800">{c.label}</option>)}
                        </select>
                        <select className={`text-white text-[9px] w-full rounded px-0.5 py-0.5 border-0 font-mono ${COIN_SELECT_BG[coin.colorCode] ?? "bg-gray-700"}`}
                          value={coin.value} onClick={e => e.stopPropagation()}
                          onChange={e => updateCoin(pos, "value", e.target.value)}>
                          {EXTRA_COIN_VALUES.map(v => <option key={v} value={v} className="bg-gray-800">{v}</option>)}
                        </select>
                        <div className="flex items-center gap-1 mt-0.5" onClick={e => e.stopPropagation()}>
                          <input type="radio" name="extraUpgrade" className="accent-yellow-400 w-3 h-3 cursor-pointer"
                            checked={upgradePos === pos} onChange={() => handleUpgradeRadio(pos)} />
                          <span className="text-[8px] text-yellow-300 font-mono">upgrade</span>
                        </div>
                        {!coin.fromBase && (
                          <button onClick={e => { e.stopPropagation(); removeCoin(pos); }}
                            className="absolute top-1 right-1 text-[10px] text-red-400 hover:text-red-200 font-bold">✕</button>
                        )}
                      </div>
                    ) : (
                      <span className="text-white/30 text-[10px] mt-3">+Add</span>
                    )}
                  </div>
                );
              })
            )}
          </div>
          <div className="text-[10px] text-gray-600 font-mono">
            🟡 click empty cell to add · ✕ remove · ✦ radio = upgrade trigger
            · single-color = 1 upgrade · AllColor = multi-upgrade
          </div>
        </div>
      )}
    </div>
  );
}