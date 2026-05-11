/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { useState, useRef } from "react";
import {
  DoubleFeatureCoin, DOUBLE_COIN_COLORS, DOUBLE_COIN_VALUES,
  UpgradeInfo, generateDoubleFeatureGaffe,
} from "./doubleFeatureGenerator";
import { posToMetric, UPGRADE_CODE_TO_FEATURES } from "./config";

type Props = {
  baseCoins:     DoubleFeatureCoin[];
  onCoinsChange: (coins: DoubleFeatureCoin[]) => void;
  onSpin:        (line: string) => void;
  onReset:       () => void;
  onUpgrade:     (newFeatures: string[], carryCoins: DoubleFeatureCoin[]) => void;
};

const MAX_SPINS = 3;

const COIN_SELECT_BG: Record<number, string> = {
  4: "bg-red-800", 9: "bg-orange-800", 14: "bg-emerald-800", 19: "bg-indigo-800",
};

export default function DoubleFeature({ baseCoins, onCoinsChange, onSpin, onReset, onUpgrade }: Props) {
  const [isOpen,    setIsOpen]    = useState(true);
  const init = baseCoins.map(c => ({ ...c, fromBase: true }));
  const [coins,     setCoins]     = useState<DoubleFeatureCoin[]>(init);
  const [spinsLeft, setSpinsLeft] = useState(MAX_SPINS);
  const lastPos = useRef<Set<number>>(new Set(init.map(c => c.position)));

  const [upgradePos,     setUpgradePos]     = useState<number | null>(null);
  const [upgradeFeatSel, setUpgradeFeatSel] = useState<string>("");
  const [pendingUpgrade, setPendingUpgrade] = useState<UpgradeInfo | null>(null);

  const coinAt = (pos: number) => coins.find(c => c.position === pos);

  const addCoin = (pos: number) => {
    if (coinAt(pos)) return;
    setCoins(prev => [...prev, { position: pos, colorCode: DOUBLE_COIN_COLORS[0].value, leftValue: "", rightValue: "" }]);
  };
  const removeCoin = (pos: number) => {
    if (coinAt(pos)?.fromBase) return;
    if (upgradePos === pos) { setUpgradePos(null); setUpgradeFeatSel(""); setPendingUpgrade(null); }
    setCoins(prev => prev.filter(c => c.position !== pos));
  };
  const updateCoin = (pos: number, field: keyof DoubleFeatureCoin, val: any) =>
    setCoins(prev => prev.map(c => c.position === pos ? { ...c, [field]: val } : c));

  const handleUpgradeRadio = (pos: number) => {
    if (upgradePos === pos) { setUpgradePos(null); setUpgradeFeatSel(""); setPendingUpgrade(null); return; }
    setUpgradePos(pos); setUpgradeFeatSel(""); setPendingUpgrade(null);
  };

  const upgradeOptions: string[] = (() => {
    if (upgradePos === null) return [];
    const uc = coinAt(upgradePos);
    if (!uc) return [];
    return (UPGRADE_CODE_TO_FEATURES[uc.colorCode] ?? []).filter(f => f !== "DOUBLE");
  })();

  const handleSpin = () => {
    if (spinsLeft <= 0) return;
    const cur = new Set(coins.map(c => c.position));
    const hasNew = [...cur].some(p => !lastPos.current.has(p));
    setSpinsLeft(hasNew ? MAX_SPINS : spinsLeft - 1);
    lastPos.current = cur;
    onCoinsChange(coins);

    let upgrade: UpgradeInfo | null = null;
    if (upgradePos !== null && upgradeFeatSel) {
      const uc = coinAt(upgradePos);
      if (uc) { upgrade = { col: Math.floor(upgradePos / 3), row: upgradePos % 3, features: [upgradeFeatSel] }; setPendingUpgrade(upgrade); }
    }
    onSpin(generateDoubleFeatureGaffe(coins, upgrade));
  };

  const reset = () => {
    const s = baseCoins.map(c => ({ ...c, fromBase: true }));
    setCoins(s); setSpinsLeft(MAX_SPINS);
    lastPos.current = new Set(s.map(c => c.position));
    setUpgradePos(null); setUpgradeFeatSel(""); setPendingUpgrade(null);
    onReset();
  };

  const handleGoToUpgrade = () => {
    if (!pendingUpgrade) return;
    const newFeatures = [...new Set(["double", ...pendingUpgrade.features.map(f => f.toLowerCase())])];
    onUpgrade(newFeatures, coins);
  };

  return (
    <div className="bg-gray-800 rounded-xl border border-red-700">
      <div onClick={() => setIsOpen(!isOpen)} className="flex justify-between items-center p-4 cursor-pointer select-none">
        <h2 className="text-red-400 font-bold font-mono">🔴 Double Feature</h2>
        <span className="text-gray-500">{isOpen ? "▼" : "▶"}</span>
      </div>

      {isOpen && (
        <div className="p-4 pt-0 flex flex-col gap-3">
          <div className="flex items-center gap-3 flex-wrap">
            <button onClick={handleSpin} disabled={spinsLeft <= 0}
              className={`px-5 py-1.5 rounded font-bold font-mono transition-all ${spinsLeft > 0 ? "bg-red-600 hover:bg-red-500" : "bg-gray-600 opacity-50 cursor-not-allowed"}`}>
              SPIN
            </button>
            <span className="text-sm text-gray-400 font-mono">{spinsLeft} spin{spinsLeft !== 1 ? "s" : ""} left</span>
            <button onClick={reset} className="px-3 py-1 bg-gray-600 hover:bg-gray-500 rounded text-sm">Reset</button>
          </div>

          <div className="text-xs text-red-300 font-mono opacity-80">Each position = LEFT coin + RIGHT coin value</div>

          {pendingUpgrade && upgradeFeatSel && (
            <div className="flex items-center gap-3 bg-yellow-900/30 border border-yellow-700 rounded-lg p-3">
              <span className="text-yellow-300 text-sm font-mono">✦ Upgrade ready:</span>
              <button onClick={handleGoToUpgrade} className="px-4 py-1.5 bg-yellow-600 hover:bg-yellow-500 rounded font-bold text-sm font-mono">
                Go to double + {pendingUpgrade.features.map(f => f.toLowerCase()).join(" + ")}
              </button>
              <button onClick={() => { setPendingUpgrade(null); setUpgradeFeatSel(""); setUpgradePos(null); }} className="text-gray-400 hover:text-red-400 text-xs">✕</button>
            </div>
          )}

          {upgradePos !== null && !pendingUpgrade && upgradeOptions.length > 0 && (
            <div className="flex items-center gap-2 bg-yellow-900/20 border border-yellow-800 rounded-lg p-2">
              <span className="text-yellow-300 text-xs font-mono">Upgrade {posToMetric(upgradePos)} →</span>
              <select className="bg-yellow-900 text-yellow-100 text-xs rounded px-2 py-1 font-mono border border-yellow-700"
                value={upgradeFeatSel} onChange={e => setUpgradeFeatSel(e.target.value)}>
                <option value="">Select feature...</option>
                {upgradeOptions.map(f => <option key={f} value={f}>{f}</option>)}
              </select>
              {upgradeFeatSel && <span className="text-yellow-400 text-xs font-mono">→ SPIN to confirm</span>}
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
                    className={`relative rounded-lg border-2 flex flex-col items-center p-1 min-h-[115px] text-xs text-white cursor-pointer transition-all hover:brightness-110
                      ${coin ? `${COIN_SELECT_BG[coin.colorCode] ?? "bg-gray-700"} border-red-600/60` : "bg-gray-700 border-gray-600 hover:bg-gray-600 hover:border-red-600/40"}`}>
                    <div className="flex justify-between w-full text-[9px] opacity-40">
                      <span>{pos}</span><span className="font-mono">{posToMetric(pos)}</span>
                    </div>
                    {coin ? (
                      <div className="flex flex-col items-center w-full gap-0.5 mt-0.5">
                        <div className="text-sm">🟡</div>
                        <select className={`text-white text-[9px] w-full rounded px-0.5 py-0.5 border-0 font-mono ${COIN_SELECT_BG[coin.colorCode] ?? "bg-gray-700"}`}
                          value={coin.colorCode} onClick={e => e.stopPropagation()}
                          onChange={e => updateCoin(pos, "colorCode", Number(e.target.value))}>
                          {DOUBLE_COIN_COLORS.map(c => <option key={c.value} value={c.value} className="bg-gray-800">{c.label}</option>)}
                        </select>
                        {/* LEFT */}
                        <div className="flex items-center gap-0.5 w-full">
                          <span className="text-[7px] text-red-300 font-mono w-5 shrink-0">←L</span>
                          <select className="bg-red-950 text-red-200 text-[9px] flex-1 rounded px-0 py-0.5 border-0 font-mono"
                            value={coin.leftValue} onClick={e => e.stopPropagation()}
                            onChange={e => updateCoin(pos, "leftValue", e.target.value)}>
                            <option value="">--</option>
                            {DOUBLE_COIN_VALUES.map(v => <option key={v} value={v} className="bg-gray-800">{v}</option>)}
                          </select>
                        </div>
                        {/* RIGHT */}
                        <div className="flex items-center gap-0.5 w-full">
                          <span className="text-[7px] text-red-300 font-mono w-5 shrink-0">R→</span>
                          <select className="bg-red-950 text-red-200 text-[9px] flex-1 rounded px-0 py-0.5 border-0 font-mono"
                            value={coin.rightValue} onClick={e => e.stopPropagation()}
                            onChange={e => updateCoin(pos, "rightValue", e.target.value)}>
                            <option value="">--</option>
                            {DOUBLE_COIN_VALUES.map(v => <option key={v} value={v} className="bg-gray-800">{v}</option>)}
                          </select>
                        </div>
                        {/* Upgrade radio */}
                        <div className="flex items-center gap-1 mt-0.5" onClick={e => e.stopPropagation()}>
                          <input type="radio" name="doubleUpgrade" className="accent-yellow-400 w-3 h-3 cursor-pointer"
                            checked={upgradePos === pos} onChange={() => handleUpgradeRadio(pos)} />
                          <span className="text-[8px] text-yellow-300 font-mono">upgrade</span>
                        </div>
                        {!coin.fromBase && (
                          <button onClick={e => { e.stopPropagation(); removeCoin(pos); }}
                            className="absolute top-1 right-1 text-[10px] text-red-400 hover:text-red-200 font-bold">✕</button>
                        )}
                      </div>
                    ) : (
                      <span className="text-white/30 text-[10px] mt-4">+Add</span>
                    )}
                  </div>
                );
              })
            )}
          </div>
          <div className="text-[10px] text-gray-600 font-mono">🔴 click empty to add · L← LEFT value · R→ RIGHT value · ✦ radio = upgrade trigger</div>
        </div>
      )}
    </div>
  );
}
