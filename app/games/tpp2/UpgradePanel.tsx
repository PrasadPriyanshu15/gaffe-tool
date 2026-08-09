"use client";

import {
  FeatureKey, UpgradeCoin, UpgradeColor,
  FEATURE_TO_UPGRADE_COLOR,
} from "./combinationFeatureGenerator";

// Upgrade-coin color metadata (dot + label per color). Shared by every feature.
export const UP_COLOR_META: Record<UpgradeColor, { dot: string; label: string }> = {
  RED:    { dot: "🔴", label: "+WHEEL" },
  BLUE:   { dot: "🔵", label: "+TOWER" },
  PURPLE: { dot: "🟣", label: "+ZONE"  },
};

type Props = {
  targets:      FeatureKey[];               // features that can still be added
  upgradeCoin:  UpgradeCoin | null;         // currently-placed upgrade coin
  armedColor:   UpgradeColor | null;        // color armed for placement
  onArm:        (color: UpgradeColor) => void;
  onCancelArm:  () => void;
  onClearCoin:  () => void;
};

/**
 * "Upgrade coin" control shared by Wheel / Zone / Tower / Combination.
 * Pick a target color, then click an empty cell to place the coin; the next
 * Spin applies the upgrade. Hidden entirely when no targets remain.
 */
export default function UpgradePanel({
  targets, upgradeCoin, armedColor, onArm, onCancelArm, onClearCoin,
}: Props) {
  if (targets.length === 0) return null;

  return (
    <div className="flex items-center gap-2 flex-wrap rounded-lg px-3 py-2"
      style={{ background: "#0f2a17", border: "1px solid #2f7a4a" }}>
      <span className="text-[11px] text-green-300 font-semibold">⬆ Upgrade coin:</span>

      {upgradeCoin ? (
        <>
          <span className="text-[11px] text-green-200 font-mono">
            {UP_COLOR_META[upgradeCoin.color].dot} {UP_COLOR_META[upgradeCoin.color].label} @ pos {upgradeCoin.pos}
          </span>
          <span className="text-[10px] text-green-500 italic">→ Spin to apply</span>
          <button onClick={onClearCoin}
            className="ml-1 text-[10px] text-red-400 hover:text-red-200">✕ clear</button>
        </>
      ) : armedColor ? (
        <>
          <span className="text-[11px] text-green-200">
            {UP_COLOR_META[armedColor].dot} {UP_COLOR_META[armedColor].label} — click an empty cell to place
          </span>
          <button onClick={onCancelArm}
            className="ml-1 text-[10px] text-red-400 hover:text-red-200">✕ cancel</button>
        </>
      ) : (
        <>
          <span className="text-[10px] text-gray-400">place to add:</span>
          {targets.map(f => {
            const color = FEATURE_TO_UPGRADE_COLOR[f];
            return (
              <button key={f} onClick={() => onArm(color)}
                className="px-2 py-0.5 rounded text-[11px] font-semibold border border-green-700 text-green-200 hover:bg-green-900">
                {UP_COLOR_META[color].dot} {UP_COLOR_META[color].label}
              </button>
            );
          })}
        </>
      )}
    </div>
  );
}
