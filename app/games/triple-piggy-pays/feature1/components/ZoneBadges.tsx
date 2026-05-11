// feature1/components/ZoneBadges.tsx
// Shows active zone badges with charge indicators.

"use client";

import type { Zone } from "../../features/zone/zoneLogic";

type Props = { zones: Zone[] };

export function ZoneBadges({ zones }: Props) {
  if (zones.length === 0) return null;
  return (
    <div className="mb-3 flex flex-wrap gap-2">
      {zones.map((zone, idx) => (
        <div key={zone.id}
          className="flex items-center gap-1 bg-purple-900/60 border border-purple-500/40 text-purple-200 text-xs px-2 py-1 rounded">
          <span>🟣 Zone {idx + 1}</span>
          <span className="text-yellow-300 font-bold">{"🔋".repeat(zone.charges)}</span>
          {zone.anchors.length > 1 && (
            <span className="text-purple-400">({zone.anchors.length} anchors)</span>
          )}
        </div>
      ))}
    </div>
  );
}