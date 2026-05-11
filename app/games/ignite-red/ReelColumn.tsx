/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { SCAT_OPTIONS, ScatType, COIN_VALUES, ZONE_SPLITTER_OPTIONS, BOOST_VALUES } from "./config";
import { ScatsState } from "./gaffeGenerator";

type Props = {
  reelIndex: number;
  reel:      string[];
  stop:      number;
  setStop:   (index: number, value: number) => void;
  scats:     ScatsState;
  setScats:  (updater: (prev: ScatsState) => ScatsState) => void;
};

export default function ReelColumn({ reelIndex, reel, stop, setStop, scats, setScats }: Props) {

  const scroll = (dir: "up" | "down") => {
    let n = stop;
    if (dir === "up")  { n = stop - 1; if (n < 1) n = reel.length; }
    else               { n = stop + 1; if (n > reel.length) n = 1; }
    setStop(reelIndex, n);
  };

  const visible = [-1, 0, 1].map((offset) => {
    const index = (stop + offset + reel.length) % reel.length;
    return { symbol: reel[index], index };
  });

  // Clean stale keys for this reel when it scrolls
  const validKeys = new Set(visible.filter(v => v.symbol === "SCAT").map(v => `${reelIndex}-${v.index}`));
  const cleanField = (obj: Record<string, any>): Record<string, any> =>
    Object.fromEntries(Object.entries(obj).filter(([k]) => {
      const [col] = k.split("-");
      return Number(col) !== reelIndex || validKeys.has(k);
    }));

  (["values", "leftValues", "rightValues", "zoneSplitter", "zoneMultipliers", "boostValues"] as (keyof ScatsState)[])
    .forEach(field => {
      const cleaned = cleanField(scats[field] as Record<string, any>);
      if (Object.keys(cleaned).length !== Object.keys(scats[field] as object).length)
        setScats(prev => ({ ...prev, [field]: cleaned }));
    });
  const cleanedColors = cleanField(scats.colors as any);
  if (Object.keys(cleanedColors).length !== Object.keys(scats.colors).length)
    setScats(prev => ({ ...prev, colors: cleanedColors }));

  return (
    <div className="flex flex-col items-center" style={{ minWidth: 140 }}>
      <div className="text-gray-500 text-[10px] mb-1 font-mono">Reel {reelIndex + 1}</div>
      <button onClick={() => scroll("up")} className="text-gray-400 hover:text-white text-xl mb-0.5 leading-none">▲</button>

      <div className="rounded-xl overflow-hidden border border-gray-600">
        {visible.map((item, rowIndex) => {
          const key      = `${reelIndex}-${item.index}`;
          const isScat   = item.symbol === "SCAT";
          const scat     = scats.colors[key] as ScatType | undefined;
          const metric   = `(${reelIndex},${rowIndex})`;
          const isRed    = scat?.key === "red"    || scat?.key === "all";
          const isBlue   = scat?.key === "blue"   || scat?.key === "all";
          const isPurple = scat?.key === "purple" || scat?.key === "all";

          const cellBg = isScat && scat
            ? scat.key === "all"    ? "bg-gradient-to-br from-blue-900 via-red-900 to-purple-900"
            : scat.key === "blue"   ? "bg-blue-900"
            : scat.key === "green"  ? "bg-green-900"
            : scat.key === "red"    ? "bg-red-900"
            : scat.key === "purple" ? "bg-purple-900"
            : ""
            : rowIndex === 1 ? "bg-gray-600" : "bg-gray-700";

          return (
            <div key={rowIndex}
              className={`px-2 py-1.5 border-b border-gray-600 last:border-0 flex flex-col gap-1 ${cellBg}`}
              style={{ width: 140 }}>
              {/* Symbol + metric */}
              <div className="flex justify-between w-full text-[10px]">
                <span className="text-gray-200 font-mono font-bold">{item.symbol}</span>
                <span className="text-gray-500 font-mono">{metric}</span>
              </div>

              {isScat && (
                <div className="flex flex-col gap-0.5 w-full">
                  {/* Scat type selector */}
                  <select
                    className="bg-gray-900 text-white rounded px-1 py-0.5 w-full text-[10px] font-mono"
                    value={scat?.key || ""}
                    onChange={e => {
                      const sel = SCAT_OPTIONS.find(o => o.key === e.target.value);
                      setScats(prev => {
                        const nc = { ...prev.colors };
                        if (sel) nc[key] = sel as ScatType; else delete nc[key];
                        const clr = (obj: Record<string, any>) => { const u = { ...obj }; delete u[key]; return u; };
                        return { ...prev, colors: nc, values: clr(prev.values), leftValues: clr(prev.leftValues), rightValues: clr(prev.rightValues), zoneSplitter: clr(prev.zoneSplitter), zoneMultipliers: clr(prev.zoneMultipliers), boostValues: clr(prev.boostValues) };
                      });
                    }}>
                    <option value="">-- Random --</option>
                    {SCAT_OPTIONS.map(o => <option key={o.key} value={o.key}>{o.label}</option>)}
                  </select>

                  {/* Red/All → LEFT + RIGHT dropdowns; others → single value */}
                  {isRed ? (
                    <>
                      <select className="bg-red-950 text-red-200 rounded px-1 py-0.5 w-full text-[10px] font-mono"
                        value={scats.leftValues[key] || ""}
                        onChange={e => setScats(prev => { const u = { ...prev.leftValues }; if (e.target.value) u[key] = e.target.value; else delete u[key]; return { ...prev, leftValues: u }; })}>
                        <option value="">LEFT value</option>
                        {COIN_VALUES.map(v => <option key={v} value={v}>{v}</option>)}
                      </select>
                      <select className="bg-red-950 text-red-200 rounded px-1 py-0.5 w-full text-[10px] font-mono"
                        value={scats.rightValues[key] || ""}
                        onChange={e => setScats(prev => { const u = { ...prev.rightValues }; if (e.target.value) u[key] = e.target.value; else delete u[key]; return { ...prev, rightValues: u }; })}>
                        <option value="">RIGHT value</option>
                        {COIN_VALUES.map(v => <option key={v} value={v}>{v}</option>)}
                      </select>
                    </>
                  ) : (
                    <select className="bg-gray-900 text-white rounded px-1 py-0.5 w-full text-[10px] font-mono"
                      value={scats.values[key] || ""}
                      onChange={e => setScats(prev => { const u = { ...prev.values }; if (e.target.value) u[key] = e.target.value; else delete u[key]; return { ...prev, values: u }; })}>
                      <option value="">Value</option>
                      {COIN_VALUES.map(v => <option key={v} value={v}>{v}</option>)}
                    </select>
                  )}

                  {/* Blue/All → zone params */}
                  {isBlue && (
                    <>
                      <select className="bg-blue-950 text-blue-200 rounded px-1 py-0.5 w-full text-[10px] font-mono"
                        value={scats.zoneSplitter[key] || ""}
                        onChange={e => setScats(prev => { const u = { ...prev.zoneSplitter }; if (e.target.value) u[key] = e.target.value; else delete u[key]; return { ...prev, zoneSplitter: u }; })}>
                        <option value="">ZoneSplitter</option>
                        {ZONE_SPLITTER_OPTIONS.map(v => <option key={v} value={v}>{v}</option>)}
                      </select>
                      <input type="text" placeholder="ZoneMult e.g. 2,3"
                        className="bg-blue-950 text-blue-200 rounded px-1 py-0.5 w-full text-[10px] font-mono"
                        value={scats.zoneMultipliers[key] || ""}
                        onChange={e => setScats(prev => { const u = { ...prev.zoneMultipliers }; if (e.target.value) u[key] = e.target.value; else delete u[key]; return { ...prev, zoneMultipliers: u }; })} />
                    </>
                  )}

                  {/* Purple/All → boost */}
                  {isPurple && (
                    <select className="bg-purple-950 text-purple-200 rounded px-1 py-0.5 w-full text-[10px] font-mono"
                      value={scats.boostValues[key] || ""}
                      onChange={e => setScats(prev => { const u = { ...prev.boostValues }; if (e.target.value) u[key] = e.target.value; else delete u[key]; return { ...prev, boostValues: u }; })}>
                      <option value="">BoostValue</option>
                      {BOOST_VALUES.map(v => <option key={v} value={v}>{v}</option>)}
                    </select>
                  )}
                </div>
              )}
            </div>
          );
        })}
      </div>

      <button onClick={() => scroll("down")} className="text-gray-400 hover:text-white text-xl mt-0.5 leading-none">▼</button>
    </div>
  );
}
