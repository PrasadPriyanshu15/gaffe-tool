// feature1/useZoneManager.ts
// Custom hook encapsulating all zone state and spatial helpers.
// Drop this into any game that needs a ZONE feature.

import { useState } from "react";
import type { Zone } from "../features/zone/zoneLogic";
import {
  getSingleZoneCells,
  getUnionCells,
  mergeAllTouchingZones,
} from "../features/zone/zoneLogic";

export function useZoneManager(ROWS: number, COLS: number) {
  const [zones, setZones] = useState<Zone[]>([]);

  // ── Mutation helpers ────────────────────────────────────────────────────────

  /** Creates a new zone anchored at (row, col) and merges with any touching zones. */
  const addZone = (row: number, col: number) => {
    const newZone: Zone = {
      id: `zone-${Date.now()}`,
      anchors: [[row, col]],
      cells: getSingleZoneCells(row, col, ROWS, COLS),
      charges: 3,
    };
    setZones(prev => mergeAllTouchingZones([...prev, newZone], ROWS, COLS));
  };

  /**
   * Removes a single anchor from whichever zone owns it.
   * If the zone had only one anchor it is deleted entirely.
   * Call this when a PURPLE cell is cycled away (e.g. → TRIGGER).
   */
  const removeAnchor = (row: number, col: number) => {
    setZones(prev =>
      prev
        .map(zone => {
          if (!zone.anchors.some(([ar, ac]) => ar === row && ac === col))
            return zone;
          const remaining = zone.anchors.filter(
            ([ar, ac]) => !(ar === row && ac === col)
          );
          if (remaining.length === 0) return null as unknown as Zone;
          return {
            ...zone,
            anchors: remaining,
            cells: getUnionCells(remaining, ROWS, COLS),
          };
        })
        .filter(Boolean) as Zone[]
    );
  };

  // ── Spatial queries ─────────────────────────────────────────────────────────

  /** True if (r, c) falls inside any zone's cell coverage area. */
  const isInZone = (r: number, c: number): boolean =>
    zones.some(z => z.cells.some(([zr, zc]) => zr === r && zc === c));

  /** True if (r, c) is a purple anchor of any zone. */
  const isZoneAnchor = (r: number, c: number): boolean =>
    zones.some(z => z.anchors.some(([ar, ac]) => ar === r && ac === c));

  /**
   * Returns the charge count for the zone anchored at (r, c),
   * or null if (r, c) is not an anchor.
   */
  const getCharges = (r: number, c: number): number | null =>
    zones.find(z => z.anchors.some(([ar, ac]) => ar === r && ac === c))
      ?.charges ?? null;

  return {
    zones,
    setZones,
    addZone,
    removeAnchor,
    isInZone,
    isZoneAnchor,
    getCharges,
  };
}