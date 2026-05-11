// feature1/components/TowerStats.tsx
// Shows TOWER-specific progress stats: blue coin count, unlocked coins, next unlock.

"use client";

import type { Cell } from "../../features/featureTypes";
import { MAX_BLUE_COINS, getTotalBlue, getNextUnlockInfo } from "../../features/tower/towerLogic";

type Props = {
  isTower:       boolean;
  grid:          Cell[][];
  unlockedCoins: number;
};

export function TowerStats({ isTower, grid, unlockedCoins }: Props) {
  if (!isTower) return null;
  return (
    <div className="mb-3 flex flex-wrap gap-4 text-xs text-gray-300">
      <span>🔵 Blue: {getTotalBlue(grid)} / {MAX_BLUE_COINS}</span>
      <span>🟡 Unlocked coins: {unlockedCoins}</span>
      <span className="text-yellow-400">{getNextUnlockInfo(unlockedCoins)}</span>
    </div>
  );
}