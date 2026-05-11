// feature1/components/SpinButton.tsx
// The single Spin / Upgrade button — label, style, and disabled state vary by game state.

"use client";

import type { FeatureType } from "../../features/featureTypes";

type Props = {
  spins:           number;
  canUpgrade:      boolean;
  upgradeLabel:    string;
  currentFeatures: FeatureType[];
  upgradeFeature:  FeatureType | null;
  triggerCell:     { type: "TRIGGER" } | undefined;
  onSpin:          () => void;
};

export function SpinButton({
  spins, canUpgrade, upgradeLabel,
  currentFeatures, upgradeFeature,
  triggerCell, onSpin,
}: Props) {
  const disabled = spins === 0 && !canUpgrade;

  const btnClass = disabled
    ? "bg-gray-500 cursor-not-allowed opacity-60"
    : canUpgrade
      ? "bg-yellow-500 hover:bg-yellow-400 text-black"
      : "bg-green-600 hover:bg-green-500";

  const label = canUpgrade
    ? `↑ Go to ${upgradeLabel} (${currentFeatures.join("+")}+${upgradeFeature})`
    : "Spin";

  return (
    <div className="mt-4 flex items-center gap-4">
      <button
        onClick={onSpin}
        disabled={disabled}
        className={`px-4 py-2 rounded font-medium transition-colors ${btnClass}`}
      >
        {label}
      </button>

      {!canUpgrade && (
        <div className="text-sm text-gray-300">Spins Left: {spins}</div>
      )}

      {triggerCell && !canUpgrade && (
        <div className="text-xs text-orange-400">⚡</div>
      )}
    </div>
  );
}