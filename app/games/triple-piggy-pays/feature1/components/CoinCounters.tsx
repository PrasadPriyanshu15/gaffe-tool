// feature1/components/CoinCounters.tsx
// Displays RED / BLUE / PURPLE coin usage counts for active features.

"use client";

type Props = {
  isWheel:    boolean;
  isTower:    boolean;
  isZone:     boolean;
  coinCounts: { RED: number; BLUE: number; PURPLE: number };
};

export function CoinCounters({ isWheel, isTower, isZone, coinCounts }: Props) {
  if (!isWheel && !isTower && !isZone) return null;
  return (
    <div className="mb-3 flex gap-3 text-xs">
      {isWheel && (
        <span className="bg-red-900/40 border border-red-500/40 text-red-300 px-2 py-1 rounded">
          🔴 Red used: {coinCounts.RED}
        </span>
      )}
      {isTower && (
        <span className="bg-blue-900/40 border border-blue-500/40 text-blue-300 px-2 py-1 rounded">
          🔵 Blue used: {coinCounts.BLUE}
        </span>
      )}
      {isZone && (
        <span className="bg-purple-900/40 border border-purple-500/40 text-purple-300 px-2 py-1 rounded">
          🟣 Purple used: {coinCounts.PURPLE}
        </span>
      )}
    </div>
  );
}