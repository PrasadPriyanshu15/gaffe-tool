/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

// ─── Types ────────────────────────────────────────────────────────────────────

export type ScatKey = "zone" | "tower" | "wheel";

export type ScatType = {
  key: ScatKey;
  /** output label: "PURPLE_SCAT" | "BLUE_SCAT" | "RED_SCAT" */
  label: string;
};

type Props = {
  reelIndex: number;
  reel: string[];
  /**
   * reelStopPositions OUTPUT value.
   * Visible rows use offsets [-2,-1,0,+1] from this value.
   * Highlighted row = offset -1  (row index 1, 0-based).
   */
  stop: number;
  setStop: (reelIndex: number, value: number) => void;
  scatColors: { [key: string]: ScatType };
  setScatColors: (val: any) => void;
  scatValues: { [key: string]: string };
  setScatValues: (val: any) => void;
  /** When set, STACK* symbols in the grid display as "STACK-{stackSymbol}" */
  stackSymbol?: string | null;
};

// ─── Exported constants ───────────────────────────────────────────────────────

/**
 * Offsets from the output stop value → row array indices.
 *   Row 0 : stop-2  (top)
 *   Row 1 : stop-1  ← HIGHLIGHTED STOP ROW
 *   Row 2 : stop+0
 *   Row 3 : stop+1  (bottom)
 */
export const VISIBLE_OFFSETS = [-2, -1, 0, 1] as const;
export const HIGHLIGHT_ROW   = 1;

/**
 * SCAT colour options.
 * Internal key maps to feature (zone=ZONE feature, tower=TOWER feature, wheel=WHEEL feature).
 * Display name and output label use colour names.
 */
export const SCAT_OPTIONS: { key: ScatKey; label: string; name: string }[] = [
  { key: "zone",  label: "PURPLE_SCAT", name: "Purple" },
  { key: "tower", label: "BLUE_SCAT",   name: "Blue"   },
  { key: "wheel", label: "RED_SCAT",    name: "Red"    },
];

export const COIN_VALUES = ["1", "2", "5", "10", "Minor", "Major"];

// ─── Style helpers ────────────────────────────────────────────────────────────

function cellStyle(
  symbol: string,
  rowIndex: number,
  scatKey?: ScatKey
): { background: string; border?: string } {
  const hl = rowIndex === HIGHLIGHT_ROW;

  if (symbol === "SCAT" && scatKey) {
    const map: Record<ScatKey, [string, string]> = {
      //                          highlight       normal
      zone:  ["#9333ea", "#6b21a8"],  // purple-600 / purple-800
      tower: ["#2563eb", "#1e3a8a"],  // blue-600   / blue-900 (distinct from cell)
      wheel: ["#ef4444", "#991b1b"],  // red-500    / red-800
    };
    const [hlColor, nmColor] = map[scatKey];
    return { background: hl ? hlColor : nmColor };
  }

  if (symbol === "SCAT")
    return { background: hl ? "#ca8a04" : "#78350f", border: "1px dashed #fbbf24" };

  // Normal cell
  return { background: hl ? "#3b82f6" : "#1e40af" };
}

function selectBg(scatKey?: ScatKey): string {
  if (scatKey === "zone")  return "#7e22ce"; // purple-800
  if (scatKey === "tower") return "#1e3a8a"; // blue-900
  if (scatKey === "wheel") return "#7f1d1d"; // red-900
  return "#1f2937"; // gray-800
}

/** Resolve displayed symbol text — STACK* → STACK-{selectedSymbol} */
function resolveDisplay(symbol: string, stackSym?: string | null): string {
  if (symbol.startsWith("STACK") && stackSym) return `STACK-${stackSym}`;
  return symbol;
}

// ─── Component ────────────────────────────────────────────────────────────────

export default function ReelColumn({
  reelIndex, reel, stop, setStop,
  scatColors, setScatColors,
  scatValues, setScatValues,
  stackSymbol,
}: Props) {
  const len = reel.length;

  const visibleRows = VISIBLE_OFFSETS.map((offset, rowIndex) => {
    const index = ((stop + offset) % len + len) % len;
    return { index, symbol: reel[index], rowIndex };
  });

  const handleColor = (key: string, k: ScatKey) => {
    const opt = SCAT_OPTIONS.find((o) => o.key === k)!;
    setScatColors({ ...scatColors, [key]: { key: k, label: opt.label } });
  };
  const handleValue = (key: string, v: string) =>
    setScatValues({ ...scatValues, [key]: v });

  return (
    <div
      className="flex flex-col rounded-2xl overflow-hidden select-none"
      style={{ minWidth: 108, background: "#1a3a8f" }}
    >
      {/* Label */}
      <div className="text-center text-xs text-blue-200 font-medium pt-2 pb-0.5">
        Reel {reelIndex + 1}
      </div>

      {/* ▲ */}
      <button
        onClick={() => setStop(reelIndex, (stop - 1 + len) % len)}
        className="text-white py-1 text-sm hover:bg-white/10 transition-colors"
      >▲</button>

      {/* Cells */}
      <div className="flex flex-col gap-[3px] px-[4px]">
        {visibleRows.map(({ index, symbol, rowIndex }) => {
          const key      = `${reelIndex}-${index}`;
          const isScat   = symbol === "SCAT";
          const scatData = isScat ? scatColors[key] : undefined;
          const st       = cellStyle(symbol, rowIndex, scatData?.key);
          const isHL     = rowIndex === HIGHLIGHT_ROW;
          const display  = resolveDisplay(symbol, stackSymbol);

          return (
            <div
              key={rowIndex}
              className={`rounded-lg flex flex-col items-center justify-center px-1.5 gap-1 transition-colors ${isHL ? "font-bold" : "font-normal"}`}
              style={{ minHeight: isScat ? 84 : 50, ...st }}
            >
              {/* Symbol + index */}
              <div className="text-center leading-snug w-full break-words">
                <span className={`text-white ${isHL ? "text-[13px]" : "text-xs"}`}>
                  {display}
                </span>
                <span className="text-blue-100 text-[10px] opacity-60"> #{index}</span>
              </div>

              {/* SCAT: colour + value dropdowns */}
              {isScat && (
                <div className="flex flex-col gap-[3px] w-full">
                  {/* Colour */}
                  <select
                    className="text-[10px] text-white rounded px-1 py-0.5 w-full border border-white/20 outline-none"
                    style={{ background: selectBg(scatData?.key) }}
                    value={scatData?.key ?? ""}
                    onChange={(e) => handleColor(key, e.target.value as ScatKey)}
                  >
                    <option value="" className="bg-gray-900">─ Color ─</option>
                    {SCAT_OPTIONS.map((o) => (
                      <option key={o.key} value={o.key} className="bg-gray-900">
                        {o.name}
                      </option>
                    ))}
                  </select>

                  {/* Value (for landedCoins) — only visible once colour set */}
                  {scatData && (
                    <select
                      className="text-[10px] text-white rounded px-1 py-0.5 w-full border border-white/20 outline-none"
                      style={{ background: selectBg(scatData?.key) }}
                      value={scatValues[key] ?? ""}
                      onChange={(e) => handleValue(key, e.target.value)}
                    >
                      <option value="" className="bg-gray-900">─ Value ─</option>
                      {COIN_VALUES.map((v) => (
                        <option key={v} value={v} className="bg-gray-900">{v}</option>
                      ))}
                    </select>
                  )}
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* ▼ */}
      <button
        onClick={() => setStop(reelIndex, (stop + 1) % len)}
        className="text-white py-1 text-sm hover:bg-white/10 transition-colors mt-[3px] mb-1"
      >▼</button>
    </div>
  );
}