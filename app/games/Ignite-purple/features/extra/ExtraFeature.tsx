
/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { useState, useEffect, useRef } from "react";
import {
  ExtraFeatureCoin,
  EXTRA_COIN_COLORS,
  EXTRA_COIN_VALUES,
  UpgradeInfoSingle,
} from "./extraFeatureGenerator";

type Props = {
  baseCoins: ExtraFeatureCoin[];
  onCoinsChange: (coins: ExtraFeatureCoin[]) => void;
  onSpin: (coinsSnapshot: ExtraFeatureCoin[]) => void;
  onReset: () => void;
  onUpgrade?: (newFeatures: string[], carryCoins: ExtraFeatureCoin[], upgradeInfo: UpgradeInfoSingle) => void;
};

const TOTAL_POSITIONS = 15; // 5 cols × 3 rows
const MAX_SPINS = 4;

// Grid renders 3 rows × 5 cols.
// Visual position index = row * 5 + col  →  top-to-bottom, left-to-right
// We store coins with this same index (0–14).

const COLOR_BORDER: Record<number, string> = {
  19:  "bg-black-700",
  9:  "bg-blue-700",
  4: "bg-orange-700",
  14: "bg-pink-700",
};

const COLOR_BG: Record<number, string> = {
  19:  "bg-black-700",
  9:  "bg-blue-700",
  4: "bg-orange-700",
  14: "bg-pink-700",
};

const COLOR_SELECT_BG: Record<number, string> = {
  19:  "bg-black-700",
  9:  "bg-blue-700",
  4: "bg-orange-700",
  14: "bg-pink-700",
};

export default function ExtraFeature({ baseCoins, onCoinsChange, onSpin, onReset, onUpgrade }: Props) {
  const [isOpen, setIsOpen] = useState(true);
  const initialSeeds = baseCoins.map((c) => ({ ...c, fromBase: true }));
  const [coins, setCoins] = useState<ExtraFeatureCoin[]>(initialSeeds);
  const [spinsLeft, setSpinsLeft] = useState(MAX_SPINS);

  // Snapshot of coin positions at the time of last spin — used to detect NEW landings
  const lastSpinPositions = useRef<Set<number>>(new Set(initialSeeds.map((c) => c.position)));

  // ── Upgrade state ────────────────────────────────────────────────────────
  const [upgradePos,          setUpgradePos]          = useState<number | null>(null);
  const [upgradeMultiSel,     setUpgradeMultiSel]     = useState<Set<string>>(new Set());
  const [upgradeZoneSplitter, setUpgradeZoneSplitter] = useState<string>("");
  const [upgradeZoneMultiRaw, setUpgradeZoneMultiRaw] = useState<string>("");

  const resetUpgrade = () => {
    setUpgradePos(null); setUpgradeMultiSel(new Set());
    setUpgradeZoneSplitter(""); setUpgradeZoneMultiRaw("");
  };

  // All features Extra can upgrade into (everything except itself)
  const UPGRADE_TARGETS = ["STRIKE", "ZONE", "SPLIT"];

  // Map coin color → suggested feature (auto-checked on radio select)
  const COLOR_TO_FEATURE: Record<number, string> = { 14: "STRIKE", 9: "ZONE", 4: "SPLIT" };

  const handleUpgradeRadio = (pos: number) => {
    if (upgradePos === pos) { resetUpgrade(); return; }
    resetUpgrade();
    setUpgradePos(pos);
    const coin = coins.find((c) => c.position === pos);
    if (!coin) return;
    const auto = COLOR_TO_FEATURE[coin.colorCode];
    if (auto) setUpgradeMultiSel(new Set([auto]));
    // all-color (19) → pre-check nothing, let user pick
  };

  const toggleUpgradeFeature = (f: string, checked: boolean) => {
    const s = new Set(upgradeMultiSel);
    checked ? s.add(f) : s.delete(f);
    setUpgradeMultiSel(s);
  };

  const handleFireUpgrade = () => {
    if (!onUpgrade || upgradePos === null || upgradeMultiSel.size === 0) return;
    const feats = Array.from(upgradeMultiSel);
    const newFeatures = ["extra", ...feats.map((f) => f.toLowerCase())].filter(
      (v, i, a) => a.indexOf(v) === i
    );
    const upgradeInfo: UpgradeInfoSingle = {
      pos: upgradePos,
      features: feats,
      ...(feats.includes("ZONE") && upgradeZoneSplitter ? { zoneSplitter: Number(upgradeZoneSplitter) } : {}),
      ...(feats.includes("ZONE") && upgradeZoneMultiRaw
        ? { zoneMultipliers: upgradeZoneMultiRaw.split(",").map(Number).filter(Boolean) }
        : {}),
    };
    onUpgrade(newFeatures, coins, upgradeInfo);
  };

  // Notify parent whenever coins change
  useEffect(() => {
    onCoinsChange(coins);
  }, [coins]);

  const coinAt = (pos: number) => coins.find((c) => c.position === pos);

  const handleCellClick = (pos: number) => {
    if (coinAt(pos)) return;
    const newCoin: ExtraFeatureCoin = {
      position: pos,
      colorCode: EXTRA_COIN_COLORS[0].value,
      value: EXTRA_COIN_VALUES[0],
    };
    setCoins((prev) => [...prev, newCoin]);
  };

  const removeCoin = (pos: number) => {
    const coin = coinAt(pos);
    if (!coin || coin.fromBase) return;
    setCoins((prev) => prev.filter((c) => c.position !== pos));
  };

  const updateCoin = (pos: number, field: keyof ExtraFeatureCoin, value: any) => {
    setCoins((prev) =>
      prev.map((c) => (c.position === pos ? { ...c, [field]: value } : c))
    );
  };

  const handleSpin = () => {
    if (spinsLeft <= 0) return;

    // Compare current coin positions to positions at last spin
    const currentPositions = new Set(coins.map((c) => c.position));
    const hasNewCoin = [...currentPositions].some(
      (p) => !lastSpinPositions.current.has(p)
    );

    const newSpins = hasNewCoin ? MAX_SPINS : spinsLeft - 1;
    setSpinsLeft(newSpins);

    // Update snapshot to current state
    lastSpinPositions.current = new Set(currentPositions);

    // Tell parent to append this spin's result to history
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
        <h2 className="text-lg font-semibold text-green-400">🟢 Extra Feature</h2>
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
                  ? "bg-green-600 hover:bg-green-500"
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

          {/* GRID — 5 cols × 3 rows, column-major positions (0-1-2 down col0, 3-4-5 down col1 ...) */}
          <div
            className="grid gap-1"
            style={{ gridTemplateColumns: "repeat(5, minmax(0, 1fr))" }}
          >
            {Array.from({ length: 3 }).map((_, row) =>
              Array.from({ length: 5 }).map((_, col) => {
                // column-major: position counts down each column first
                const pos = col * 3 + row;
                const coin = coinAt(pos);

                return (
                  <div
                    key={pos}
                    onClick={() => !coin && handleCellClick(pos)}
                    className={`relative rounded-lg border-2 flex flex-col items-center justify-center p-1 min-h-[90px] text-xs text-white cursor-pointer transition-all
                      ${coin
                        ? `${COLOR_BG[coin.colorCode]} ${COLOR_BORDER[coin.colorCode]}`
                        : "bg-gray-700 border-gray-600 hover:bg-gray-600 hover:border-gray-400"
                      }
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
                          className={`text-white text-[10px] w-full rounded px-0.5 py-0.5 ${COLOR_SELECT_BG[coin.colorCode]} border-0`}
                          value={coin.colorCode}
                          onClick={(e) => e.stopPropagation()}
                          onChange={(e) =>
                            updateCoin(pos, "colorCode", Number(e.target.value))
                          }
                        >
                          {EXTRA_COIN_COLORS.map((c) => (
                            <option key={c.value} value={c.value} className="bg-gray-800">
                              {c.label}
                            </option>
                          ))}
                        </select>

                        {/* Value selector */}
                        <select
                          className={`text-white text-[10px] w-full rounded px-0.5 py-0.5 ${COLOR_SELECT_BG[coin.colorCode]} border-0`}
                          value={coin.value}
                          onClick={(e) => e.stopPropagation()}
                          onChange={(e) => updateCoin(pos, "value", e.target.value)}
                        >
                          {EXTRA_COIN_VALUES.map((v) => (
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

                        {/* Upgrade radio */}
                        {onUpgrade && (
                          <div className="flex items-center gap-1 mt-0.5 w-full" onClick={(e) => e.stopPropagation()}>
                            <input
                              type="radio"
                              name="extraUpgrade"
                              className="accent-yellow-400 w-3 h-3 cursor-pointer"
                              checked={upgradePos === pos}
                              onChange={() => handleUpgradeRadio(pos)}
                            />
                            <span className="text-[8px] text-yellow-300">upgrade</span>
                            {upgradePos === pos && upgradeMultiSel.size > 0 && (
                              <span className="text-[8px] text-yellow-500">→{Array.from(upgradeMultiSel).join("+")}</span>
                            )}
                          </div>
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

          {/* UPGRADE PANEL */}
          {onUpgrade && upgradePos !== null && (
            <div className="bg-yellow-900/30 border border-yellow-600/40 rounded-lg p-3 flex flex-col gap-2">
              <div className="text-xs text-yellow-300 font-semibold">
                Upgrade coin @ position {upgradePos} → pick feature(s):
              </div>
              <div className="flex flex-wrap gap-3">
                {UPGRADE_TARGETS.map((f) => (
                  <label key={f} className="flex items-center gap-1.5 text-xs text-yellow-200 cursor-pointer select-none">
                    <input
                      type="checkbox"
                      className="accent-yellow-400 w-3.5 h-3.5"
                      checked={upgradeMultiSel.has(f)}
                      onChange={(e) => toggleUpgradeFeature(f, e.target.checked)}
                    />
                    {f}
                  </label>
                ))}
              </div>
              {upgradeMultiSel.has("ZONE") && (
                <div className="flex gap-2 flex-wrap">
                  <input
                    type="number" min={1} max={7} placeholder="Zone splitter (1-7)"
                    className="bg-gray-700 text-white text-xs rounded px-2 py-1 w-36"
                    value={upgradeZoneSplitter}
                    onChange={(e) => setUpgradeZoneSplitter(e.target.value)}
                  />
                  <input
                    type="text" placeholder="Multipliers e.g. 2,5,10"
                    className="bg-gray-700 text-white text-xs rounded px-2 py-1 w-44"
                    value={upgradeZoneMultiRaw}
                    onChange={(e) => setUpgradeZoneMultiRaw(e.target.value)}
                  />
                </div>
              )}
              <button
                onClick={handleFireUpgrade}
                disabled={upgradeMultiSel.size === 0}
                className="self-start px-4 py-1 bg-yellow-600 hover:bg-yellow-500 disabled:opacity-40 disabled:cursor-not-allowed rounded text-xs font-bold text-white"
              >
                🔀 Upgrade &amp; Navigate
              </button>
            </div>
          )}

          {/* LEGEND */}
          <div className="flex gap-3 text-xs flex-wrap text-gray-400">
            <span>🟡 = coin &nbsp;|&nbsp; Click empty cell to add coin</span>
            {onUpgrade && <span>✦ radio = select coin to upgrade</span>}
          </div>

        </div>
      )}
    </div>
  );
}