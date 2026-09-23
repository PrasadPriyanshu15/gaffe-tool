
//!!!! perfect ---------
/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { useState, useMemo } from "react";
import BaseGame              from "./base-game";
import GaffeOutput           from "./GaffeOutput";
import WheelFeature          from "./wheelFeature";
import ZoneFeature           from "./zoneFeature";
import TowerFeature          from "./towerFeature";
import CombinationFeature    from "./combinationFeature";
import { reels, setReels }   from "./reels";
import {
  generateGaffe,
  getBaseCoinsForFeature,
  getBaseCoinsForCombination,
  BaseCoin,
} from "./gaffeGenerator";
import { ScatType }          from "./ReelColumn";
import { FeatureKey, CarriedCoin } from "./combinationFeatureGenerator";

// ─── Feature display metadata ─────────────────────────────────────────────────
const F_COLOR: Record<string, string> = {
  wheel: "text-red-400",
  zone:  "text-purple-400",
  tower: "text-blue-400",
};
const F_LABEL: Record<string, string> = {
  wheel: "WHEEL",
  zone:  "ZONE",
  tower: "TOWER",
};

// ─── Page ─────────────────────────────────────────────────────────────────────
export default function Page() {

  // ── Base game state ───────────────────────────────────────────────────────
  // Starts empty — the grid is populated only from an uploaded reelstrip.
  const [reelStops,        setReelStops]        = useState<number[]>([]);
  const [scatColors,       setScatColors]       = useState<{ [key: string]: ScatType }>({});
  const [scatValues,       setScatValues]       = useState<{ [key: string]: string }>({});
  const [stackSymbol,      setStackSymbol]      = useState<string | null>(null);
  const [featureEnabled,   setFeatureEnabled]   = useState<boolean>(true);
  const [grandEnabled,     setGrandEnabled]     = useState<boolean>(false);
  const [majorEnabled,     setMajorEnabled]     = useState<boolean>(false);
  const [selectedFeatures, setSelectedFeatures] = useState<string[]>([]);

  // ── Dynamic grid: global row count + one global anchor-row offset ──────────
  const [rows,   setRows]   = useState<number>(4);
  const [offset, setOffset] = useState<number>(0);
  // Keep the offset within the current row range when rows shrinks.
  const handleSetRows = (r: number) => {
    setRows(r);
    setOffset((o) => Math.max(0, Math.min(o, r - 1)));
  };

  // Bumped whenever the reels are replaced by an uploaded reelstrip, so the
  // gaffe recomputes and the base grid re-renders from the new (live) reels.
  const [reelsVersion, setReelsVersion] = useState(0);
  const handleUploadReels = (next: string[][]) => {
    setReels(next);
    setReelStops(Array(next.length).fill(0));
    setReelsVersion((v) => v + 1);
  };

  // ── Navigation ────────────────────────────────────────────────────────────
  const [activeSection,    setActiveSection]    = useState<string>("base");
  const [featureGaffes,    setFeatureGaffes]    = useState<string[]>([]);

  // ── Base coins for single features ────────────────────────────────────────
  const [singleBaseCoins, setSingleBaseCoins] = useState<BaseCoin[]>([]);
  // ── Merged base coins for combination ─────────────────────────────────────
  const [comboBaseCoins,  setComboBaseCoins]  = useState<
    Array<{ position: number; value: string; featureKey: string }>
  >([]);
  // ── Coins carried forward into a combination via a feature upgrade ─────────
  const [carriedCoins,    setCarriedCoins]    = useState<CarriedCoin[] | undefined>(undefined);
  // ── Row-unlock credit carried forward with an upgrade (landed-but-vanished
  //    coins such as the upgrade coin itself) ────────────────────────────────
  const [carriedUnlockBonus, setCarriedUnlockBonus] = useState<number>(0);

  // ── Live base gaffe ───────────────────────────────────────────────────────
  const gaffe = useMemo(
    () => {
      void reelsVersion; // recompute when an uploaded reelstrip replaces `reels` (a live binding)
      return generateGaffe(
        reelStops, reels,
        scatColors, scatValues,
        selectedFeatures, featureEnabled,
        grandEnabled, majorEnabled, stackSymbol,
        rows, offset
      );
    },
    [reelStops, scatColors, scatValues, selectedFeatures, featureEnabled, grandEnabled, majorEnabled, stackSymbol, rows, offset, reelsVersion]
  );

  // ── Derived ───────────────────────────────────────────────────────────────
  const isFeature      = activeSection !== "base";
  const isCombination  = activeSection.includes("-");
  const activeKeys     = activeSection.split("-") as FeatureKey[];

  // ── Handlers ─────────────────────────────────────────────────────────────
  const handleGoTo = (features: string[]) => {
    setFeatureGaffes([]);
    setCarriedCoins(undefined);   // fresh entry — not an upgrade
    setCarriedUnlockBonus(0);

    if (features.length === 1) {
      // Single feature
      const coins = getBaseCoinsForFeature(
        features[0], reelStops, reels, scatColors, scatValues, rows, offset
      );
      setSingleBaseCoins(coins);
      setComboBaseCoins([]);
    } else {
      // Combination — collect all relevant SCaT coins in one pass
      const coins = getBaseCoinsForCombination(
        features, reelStops, reels, scatColors, scatValues, rows, offset
      );
      setComboBaseCoins(coins);
      setSingleBaseCoins([]);
    }

    setActiveSection(features.join("-"));
  };

  const handleBack = () => {
    setActiveSection("base");
    setFeatureGaffes([]);
    setSingleBaseCoins([]);
    setComboBaseCoins([]);
    setCarriedCoins(undefined);
    setCarriedUnlockBonus(0);
  };

  /**
   * Reset the base game back to its initial position and state. Keeps the
   * uploaded reelstrip loaded but returns every stop to 0 and clears all
   * assigned SCaT colours/values, the stack override, feature toggles and any
   * selected features. Also navigates back to the base view.
   */
  const handleReset = () => {
    setReelStops(reels.length ? Array(reels.length).fill(0) : []);
    setScatColors({});
    setScatValues({});
    setStackSymbol(null);
    setFeatureEnabled(true);
    setGrandEnabled(false);
    setMajorEnabled(false);
    setSelectedFeatures([]);
    setRows(4);
    setOffset(0);
    handleBack();
  };

  /**
   * Feature upgrade: an upgrade coin landed in the current feature. Grow the
   * active feature set by `newFeature`, carrying the full grid (`carried`)
   * forward into the combination view. The prior spin log is kept.
   */
  const handleUpgrade = (
    fromFeatures: string[],
    newFeature:   FeatureKey,
    carried:      CarriedCoin[],
    bonusUnlock:  number
  ) => {
    if (fromFeatures.includes(newFeature)) return;
    setCarriedCoins(carried);
    setCarriedUnlockBonus(bonusUnlock);
    setSingleBaseCoins([]);
    setComboBaseCoins([]);
    setActiveSection([...fromFeatures, newFeature].join("-"));
  };

  const addSpinLine = (line: string) => setFeatureGaffes(prev => [...prev, line]);
  const clearLines  = () => setFeatureGaffes([]);

  // ─── Render ────────────────────────────────────────────────────────────────
  return (
    <div className="min-h-screen text-white p-6" style={{ background: "#0d1117" }}>

      {/* Nav */}
      <div className="mb-4">
        {isFeature ? (
          <button onClick={handleBack}
            className="px-4 py-2 rounded-lg text-sm font-medium border border-gray-600 text-gray-200 hover:bg-gray-800 transition-colors">
            ← Back
          </button>
        ) : (
          <button className="px-4 py-2 rounded-lg text-sm font-medium border border-gray-700 text-gray-600 cursor-default opacity-30">
            ← Back
          </button>
        )}
      </div>

      {/* Feature breadcrumb */}
      {isFeature && (
        <div className="mb-4 flex items-center gap-2">
          {activeKeys.map((f, i) => (
            <span key={f} className="flex items-center gap-1">
              {i > 0 && <span className="text-gray-500 text-sm">+</span>}
              <span className={`text-sm font-semibold ${F_COLOR[f] ?? "text-white"}`}>
                {F_LABEL[f] ?? f.toUpperCase()}
              </span>
            </span>
          ))}
          <span className="text-gray-500 text-sm">Feature</span>
        </div>
      )}

      {/* Title */}
      <h1 className="text-2xl font-light text-white mb-6 tracking-wide">
        Slot Gaffe Tool
      </h1>

      {/* Two-column layout */}
      <div className="flex gap-6 items-start">

        {/* Left */}
        <div className="flex-1 min-w-0 flex flex-col gap-4">

          {/* Base Game — always visible */}
          <BaseGame
            reelStops={reelStops}           setReelStops={setReelStops}
            scatColors={scatColors}         setScatColors={setScatColors}
            scatValues={scatValues}         setScatValues={setScatValues}
            stackSymbol={stackSymbol}       setStackSymbol={setStackSymbol}
            featureEnabled={featureEnabled} setFeatureEnabled={setFeatureEnabled}
            grandEnabled={grandEnabled}     setGrandEnabled={setGrandEnabled}
            majorEnabled={majorEnabled}     setMajorEnabled={setMajorEnabled}
            selectedFeatures={selectedFeatures}
            setSelectedFeatures={setSelectedFeatures}
            onGoTo={handleGoTo}
            onReset={handleReset}
            onUploadReels={handleUploadReels}
            rows={rows}     setRows={handleSetRows}
            offset={offset} setOffset={setOffset}
          />

          {/* ── COMBINATION (2+ features) — single unified panel ─────── */}
          {isFeature && isCombination && (
            <CombinationFeature
              selectedFeatures={activeKeys}
              baseCoins={comboBaseCoins}
              carriedCoins={carriedCoins}
              carriedUnlockBonus={carriedUnlockBonus}
              onSpin={addSpinLine}
              onReset={clearLines}
              onUpgrade={(feature, carried, bonus) => handleUpgrade(activeKeys, feature, carried, bonus)}
            />
          )}

          {/* ── SINGLE: WHEEL ─────────────────────────────────────────── */}
          {isFeature && !isCombination && activeSection === "piggyWheel" && (
            <WheelFeature
              baseCoins={singleBaseCoins}
              onSpin={addSpinLine}
              onReset={clearLines}
              onUpgrade={(feature, carried, bonus) => handleUpgrade(["piggyWheel"], feature, carried, bonus)}
            />
          )}

          {/* ── SINGLE: ZONE ──────────────────────────────────────────── */}
          {isFeature && !isCombination && activeSection === "piggyZone" && (
            <ZoneFeature
              baseCoins={singleBaseCoins}
              onSpin={addSpinLine}
              onReset={clearLines}
              onUpgrade={(feature, carried, bonus) => handleUpgrade(["piggyZone"], feature, carried, bonus)}
            />
          )}

          {/* ── SINGLE: TOWER ─────────────────────────────────────────── */}
          {isFeature && !isCombination && activeSection === "piggyTower" && (
            <TowerFeature
              baseCoins={singleBaseCoins}
              onSpin={addSpinLine}
              onReset={clearLines}
              onUpgrade={(feature, carried, bonus) => handleUpgrade(["piggyTower"], feature, carried, bonus)}
            />
          )}

        </div>

        {/* Right — Gaffe Output */}
        <div className="w-[380px] shrink-0 sticky top-6">
          <GaffeOutput gaffe={gaffe} featureGaffes={featureGaffes} />
        </div>

      </div>
    </div>
  );
}






