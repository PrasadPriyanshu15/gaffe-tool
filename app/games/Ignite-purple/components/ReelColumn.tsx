
// /* eslint-disable @typescript-eslint/no-explicit-any */
// "use client";

// type ScatType = {
//   key: "orange" | "blue" | "cerise" | "green" | "all";
//   label: string;
//   feature: string;
// };

// type Props = {
//   reelIndex: number;
//   reel: string[];
//   stop: number;
//   setStop: (index: number, value: number) => void;

//   scatColors: { [key: string]: ScatType };
//   setScatColors: (val: any) => void;

//   scatValues: { [key: string]: string };
//   setScatValues: (val: any) => void;

//   scatZoneSplitter: { [key: string]: string };
//   setScatZoneSplitter: (val: any) => void;

//   scatZoneMultipliers: { [key: string]: string };
//   setScatZoneMultipliers: (val: any) => void;

//   scatBoostValues: { [key: string]: string };
//   setScatBoostValues: (val: any) => void;
// };

// // 🎯 SCAT OPTIONS
// const SCAT_OPTIONS: ScatType[] = [
//   { key: "orange", label: "StrikeScat", feature: "strike" },
//   { key: "blue", label: "ZoneScat", feature: "zone" },
//   { key: "cerise", label: "CeriseScat", feature: "split" },
//   { key: "green", label: "ExtraScat", feature: "extra" },
//   { key: "all", label: "AllScat", feature: "all" },
// ];

// // 🪙 VALUE OPTIONS
// const VALUE_OPTIONS = ["0.75", "1", "2", "5", "Minor", "Major"];

// // 🎯 ZONE SPLITTER OPTIONS (1–7)
// const ZONE_SPLITTER_OPTIONS = ["1", "2", "3", "4", "5", "6", "7"];

// // ⚡ BOOST VALUE OPTIONS per position
// const BOOST_VALUE_OPTIONS = ["0", "0.5", "1", "2", "5"];

// export default function ReelColumn({
//   reelIndex,
//   reel,
//   stop,
//   setStop,
//   scatColors,
//   setScatColors,
//   scatValues,
//   setScatValues,
//   scatZoneSplitter,
//   setScatZoneSplitter,
//   scatZoneMultipliers,
//   setScatZoneMultipliers,
//   scatBoostValues,
//   setScatBoostValues,
// }: Props) {

//   const scroll = (dir: "up" | "down") => {
//     let newStop = stop;

//     if (dir === "up") {
//       newStop = stop - 1;
//       if (newStop < 1) newStop = reel.length;
//     } else {
//       newStop = stop + 1;
//       if (newStop > reel.length) newStop = 1;
//     }

//     setStop(reelIndex, newStop);
//   };

//   const getVisibleSymbols = () => {
//     return [-1, 0, 1].map((offset) => {
//       const index = (stop + offset + reel.length) % reel.length;
//       return { symbol: reel[index], index };
//     });
//   };

//   const visible = getVisibleSymbols();

//   // 🔥 CLEANUP: remove stale SCAT selections when not visible
//   const validKeys = new Set(
//     visible
//       .filter((v) => v.symbol === "SCAT")
//       .map((v) => `${reelIndex}-${v.index}`)
//   );

//   const cleanedColors = Object.fromEntries(
//     Object.entries(scatColors).filter(([key]) => {
//       const [col] = key.split("-");
//       return Number(col) !== reelIndex || validKeys.has(key);
//     })
//   );

//   const cleanedValues = Object.fromEntries(
//     Object.entries(scatValues).filter(([key]) => {
//       const [col] = key.split("-");
//       return Number(col) !== reelIndex || validKeys.has(key);
//     })
//   );

//   const cleanedZoneSplitter = Object.fromEntries(
//     Object.entries(scatZoneSplitter).filter(([key]) => {
//       const [col] = key.split("-");
//       return Number(col) !== reelIndex || validKeys.has(key);
//     })
//   );

//   const cleanedZoneMultipliers = Object.fromEntries(
//     Object.entries(scatZoneMultipliers).filter(([key]) => {
//       const [col] = key.split("-");
//       return Number(col) !== reelIndex || validKeys.has(key);
//     })
//   );

//   const cleanedBoostValues = Object.fromEntries(
//     Object.entries(scatBoostValues).filter(([key]) => {
//       const [col] = key.split("-");
//       return Number(col) !== reelIndex || validKeys.has(key);
//     })
//   );

//   if (Object.keys(cleanedColors).length !== Object.keys(scatColors).length) {
//     setScatColors(cleanedColors);
//   }
//   if (Object.keys(cleanedValues).length !== Object.keys(scatValues).length) {
//     setScatValues(cleanedValues);
//   }
//   if (Object.keys(cleanedZoneSplitter).length !== Object.keys(scatZoneSplitter).length) {
//     setScatZoneSplitter(cleanedZoneSplitter);
//   }
//   if (Object.keys(cleanedZoneMultipliers).length !== Object.keys(scatZoneMultipliers).length) {
//     setScatZoneMultipliers(cleanedZoneMultipliers);
//   }
//   if (Object.keys(cleanedBoostValues).length !== Object.keys(scatBoostValues).length) {
//     setScatBoostValues(cleanedBoostValues);
//   }

//   return (
//     <div className="bg-blue-900 p-3 rounded-xl flex flex-col items-center w-36">

//       <div className="text-white text-sm mb-2">
//         Reel {reelIndex + 1}
//       </div>

//       <button onClick={() => scroll("up")} className="text-white mb-1">
//         ▲
//       </button>

//       <div className="bg-blue-800 rounded-lg overflow-hidden">
//         {visible.map((item, rowIndex) => {
//           const key = `${reelIndex}-${item.index}`;
//           const isScat = item.symbol === "SCAT";

//           const selectedScat = scatColors[key];
//           const selectedValue = scatValues[key];
//           const selectedZoneSplitter = scatZoneSplitter[key];
//           const selectedZoneMultipliers = scatZoneMultipliers[key] || "";
//           const selectedBoostValue = scatBoostValues[key] || "";

//           const col = reelIndex;
//           const row = rowIndex;
//           const positionNumber = col * 3 + row + 1;

//           const colorMap: Record<string, string> = {
//             orange: "bg-orange-400",
//             blue: "bg-blue-400",
//             cerise: "bg-pink-500",
//             green: "bg-green-400",
//             all: "bg-gradient-to-br from-orange-400 via-pink-500 to-green-400",
//           };

//           const isBlue = selectedScat?.key === "blue";
//           const isAll = selectedScat?.key === "all";
//           const isBlueOrAll = isBlue || isAll;
//           const isOrangeOrAll =
//             selectedScat?.key === "orange" || isAll;

//           return (
//             <div
//               key={rowIndex}
//               className={`w-32 flex flex-col items-center justify-center text-white border-b border-blue-700 py-2 px-1
//               ${rowIndex === 1 ? "bg-blue-500 font-bold" : "bg-blue-700"}
//               ${isScat && selectedScat ? colorMap[selectedScat.key] : ""}
//               `}
//             >
//               {/* SYMBOL */}
//               <div className="text-xs">
//                 {item.symbol} #{item.index}
//               </div>

//               {/* POSITION */}
//               <div className="text-[10px] opacity-80">
//                 ({col},{row}) → {positionNumber}
//               </div>

//               {/* CONTROLS */}
//               {isScat && (
//                 <div className="flex flex-col gap-1 w-full items-center mt-1">

//                   {/* COLOR SELECT */}
//                   <select
//                     className="text-black text-xs w-full"
//                     value={selectedScat?.key || ""}
//                     onChange={(e) => {
//                       const selected = SCAT_OPTIONS.find(
//                         (opt) => opt.key === e.target.value
//                       );
//                       const updated = { ...scatColors };
//                       if (selected) updated[key] = selected;
//                       else delete updated[key];
//                       setScatColors(updated);

//                       // Clear dependant fields when type changes
//                       const updatedZS = { ...scatZoneSplitter };
//                       delete updatedZS[key];
//                       setScatZoneSplitter(updatedZS);

//                       const updatedZM = { ...scatZoneMultipliers };
//                       delete updatedZM[key];
//                       setScatZoneMultipliers(updatedZM);

//                       const updatedBV = { ...scatBoostValues };
//                       delete updatedBV[key];
//                       setScatBoostValues(updatedBV);
//                     }}
//                   >
//                     <option value="">Random</option>
//                     {SCAT_OPTIONS.map((opt) => (
//                       <option key={opt.key} value={opt.key}>
//                         {opt.label}
//                       </option>
//                     ))}
//                   </select>

//                   {/* VALUE SELECT */}
//                   <select
//                     className="text-black text-xs w-full"
//                     value={selectedValue || ""}
//                     onChange={(e) => {
//                       const updated = { ...scatValues };
//                       if (e.target.value) updated[key] = e.target.value;
//                       else delete updated[key];
//                       setScatValues(updated);
//                     }}
//                   >
//                     <option value="">Value</option>
//                     {VALUE_OPTIONS.map((val) => (
//                       <option key={val} value={val}>
//                         {val}
//                       </option>
//                     ))}
//                   </select>

//                   {/* ZONE EXTRAS — for blue or all-color */}
//                   {isBlueOrAll && (
//                     <>
//                       <select
//                         className="text-black text-xs w-full"
//                         value={selectedZoneSplitter || ""}
//                         onChange={(e) => {
//                           const updated = { ...scatZoneSplitter };
//                           if (e.target.value) updated[key] = e.target.value;
//                           else delete updated[key];
//                           setScatZoneSplitter(updated);
//                         }}
//                       >
//                         <option value="">Zone Splitter</option>
//                         {ZONE_SPLITTER_OPTIONS.map((v) => (
//                           <option key={v} value={v}>{v}</option>
//                         ))}
//                       </select>

//                       <input
//                         type="text"
//                         placeholder="ZoneMultipliers (e.g. 2,3,3,4)"
//                         className="text-black text-xs w-full px-1 py-0.5 rounded"
//                         value={selectedZoneMultipliers}
//                         onChange={(e) => {
//                           const updated = { ...scatZoneMultipliers };
//                           if (e.target.value) updated[key] = e.target.value;
//                           else delete updated[key];
//                           setScatZoneMultipliers(updated);
//                         }}
//                       />
//                     </>
//                   )}

//                   {/* BOOST VALUE — only for orange or all-color */}
//                   {isOrangeOrAll && (
//                     <select
//                       className="text-black text-xs w-full"
//                       value={selectedBoostValue}
//                       onChange={(e) => {
//                         const updated = { ...scatBoostValues };
//                         if (e.target.value) updated[key] = e.target.value;
//                         else delete updated[key];
//                         setScatBoostValues(updated);
//                       }}
//                     >
//                       <option value="">Boost Value</option>
//                       {BOOST_VALUE_OPTIONS.map((v) => (
//                         <option key={v} value={v}>{v}</option>
//                       ))}
//                     </select>
//                   )}

//                 </div>
//               )}
//             </div>
//           );
//         })}
//       </div>

//       <button onClick={() => scroll("down")} className="text-white mt-1">
//         ▼
//       </button>
//     </div>
//   );
// }


/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

type ScatType = {
  key: "orange" | "blue" | "cerise" | "green" | "all";
  label: string;
  feature: string;
};

type Props = {
  reelIndex: number;
  reel: string[];
  stop: number;
  setStop: (index: number, value: number) => void;

  scatColors:          { [key: string]: ScatType };
  setScatColors:       (val: any) => void;
  scatValues:          { [key: string]: string };
  setScatValues:       (val: any) => void;
  scatZoneSplitter:    { [key: string]: string };
  setScatZoneSplitter: (val: any) => void;
  scatZoneMultipliers: { [key: string]: string };
  setScatZoneMultipliers: (val: any) => void;
  scatBoostValues:     { [key: string]: string };
  setScatBoostValues:  (val: any) => void;
  scatSplitCount:      { [key: string]: string };   // NEW
  setScatSplitCount:   (val: any) => void;           // NEW
};

const SCAT_OPTIONS: ScatType[] = [
  { key: "orange", label: "StrikeScat",    feature: "strike" },
  { key: "blue",   label: "ZoneScat",      feature: "zone"   },
  { key: "cerise", label: "CeriseScat",    feature: "split"  },
  { key: "green",  label: "ExtraScat",     feature: "extra"  },
  { key: "all",    label: "AllScat",  feature: "all"    },
];

const VALUE_OPTIONS        = ["1", "2", "5", "Minor", "Major" , "Mini"];
const ZONE_SPLITTER_OPTIONS = ["1","2","3","4","5","6","7"];
const BOOST_VALUE_OPTIONS  = ["0", "0.5", "1", "2", "5"];
const SPLIT_COUNT_OPTIONS  = ["1", "2", "3", "4"];

export default function ReelColumn({
  reelIndex, reel, stop, setStop,
  scatColors,   setScatColors,
  scatValues,   setScatValues,
  scatZoneSplitter,   setScatZoneSplitter,
  scatZoneMultipliers, setScatZoneMultipliers,
  scatBoostValues,  setScatBoostValues,
  scatSplitCount,   setScatSplitCount,
}: Props) {

  const scroll = (dir: "up" | "down") => {
    let n = stop;
    if (dir === "up")  { n = stop - 1; if (n < 1) n = reel.length; }
    else               { n = stop + 1; if (n > reel.length) n = 1;  }
    setStop(reelIndex, n);
  };

  const visible = [-1, 0, 1].map((offset) => {
    const index = (stop + offset + reel.length) % reel.length;
    return { symbol: reel[index], index };
  });

  // Cleanup stale keys for this reel when scroll moves scats off screen
  const validKeys = new Set(
    visible.filter((v) => v.symbol === "SCAT").map((v) => `${reelIndex}-${v.index}`)
  );
  const cleanFor = (obj: Record<string,string>) =>
    Object.fromEntries(Object.entries(obj).filter(([k]) => {
      const [col] = k.split("-");
      return Number(col) !== reelIndex || validKeys.has(k);
    }));
  const cleanColors = Object.fromEntries(
    Object.entries(scatColors).filter(([k]) => {
      const [col] = k.split("-");
      return Number(col) !== reelIndex || validKeys.has(k);
    })
  );

  if (Object.keys(cleanColors).length !== Object.keys(scatColors).length) setScatColors(cleanColors);
  const cv = cleanFor(scatValues);       if (Object.keys(cv).length !== Object.keys(scatValues).length) setScatValues(cv);
  const czs = cleanFor(scatZoneSplitter); if (Object.keys(czs).length !== Object.keys(scatZoneSplitter).length) setScatZoneSplitter(czs);
  const czm = cleanFor(scatZoneMultipliers); if (Object.keys(czm).length !== Object.keys(scatZoneMultipliers).length) setScatZoneMultipliers(czm);
  const cbv = cleanFor(scatBoostValues); if (Object.keys(cbv).length !== Object.keys(scatBoostValues).length) setScatBoostValues(cbv);
  const csc = cleanFor(scatSplitCount);  if (Object.keys(csc).length !== Object.keys(scatSplitCount).length) setScatSplitCount(csc);

  const colorMap: Record<string, string> = {
    orange: "bg-orange-400",
    blue:   "bg-blue-400",
    cerise: "bg-pink-500",
    green:  "bg-green-400",
    all:    "bg-gradient-to-br from-orange-400 via-pink-500 to-green-400",
  };

  return (
    <div className="bg-blue-900 p-3 rounded-xl flex flex-col items-center w-36">
      <div className="text-white text-sm mb-2">Reel {reelIndex + 1}</div>

      <button onClick={() => scroll("up")} className="text-white mb-1">▲</button>

      <div className="bg-blue-800 rounded-lg overflow-hidden">
        {visible.map((item, rowIndex) => {
          const key            = `${reelIndex}-${item.index}`;
          const isScat         = item.symbol === "SCAT";
          const selectedScat   = scatColors[key];
          const selectedValue  = scatValues[key];
          const selZoneSplit   = scatZoneSplitter[key];
          const selZoneMult    = scatZoneMultipliers[key] || "";
          const selBoost       = scatBoostValues[key] || "";
          const selSplitCount  = scatSplitCount[key] || "";

          const col = reelIndex;
          const row = rowIndex;
          const positionNumber = col * 3 + row + 1;

          const isBlueOrAll   = selectedScat?.key === "blue" || selectedScat?.key === "all";
          const isOrangeOrAll = selectedScat?.key === "orange" || selectedScat?.key === "all";
          const isCeriseOrAll = selectedScat?.key === "cerise" || selectedScat?.key === "all";

          return (
            <div
              key={rowIndex}
              className={`w-32 flex flex-col items-center justify-center text-white border-b border-blue-700 py-2 px-1
                ${rowIndex === 1 ? "bg-blue-500 font-bold" : "bg-blue-700"}
                ${isScat && selectedScat ? colorMap[selectedScat.key] : ""}
              `}
            >
              <div className="text-xs">{item.symbol} #{item.index}</div>
              <div className="text-[10px] opacity-80">({col},{row}) → {positionNumber}</div>

              {isScat && (
                <div className="flex flex-col gap-1 w-full items-center mt-1">

                  {/* SCAT TYPE */}
                  <select
                    className="text-black text-xs w-full"
                    value={selectedScat?.key || ""}
                    onChange={(e) => {
                      const sel = SCAT_OPTIONS.find((o) => o.key === e.target.value);
                      const uc = { ...scatColors };
                      if (sel) uc[key] = sel; else delete uc[key];
                      setScatColors(uc);
                      // clear dependent fields
                      const uzs = { ...scatZoneSplitter };   delete uzs[key]; setScatZoneSplitter(uzs);
                      const uzm = { ...scatZoneMultipliers }; delete uzm[key]; setScatZoneMultipliers(uzm);
                      const ubv = { ...scatBoostValues };     delete ubv[key]; setScatBoostValues(ubv);
                      const usc = { ...scatSplitCount };      delete usc[key]; setScatSplitCount(usc);
                    }}
                  >
                    <option value="">Random</option>
                    {SCAT_OPTIONS.map((o) => (
                      <option key={o.key} value={o.key}>{o.label}</option>
                    ))}
                  </select>

                  {/* VALUE */}
                  <select
                    className="text-black text-xs w-full"
                    value={selectedValue || ""}
                    onChange={(e) => {
                      const u = { ...scatValues };
                      if (e.target.value) u[key] = e.target.value; else delete u[key];
                      setScatValues(u);
                    }}
                  >
                    <option value="">Value</option>
                    {VALUE_OPTIONS.map((v) => <option key={v} value={v}>{v}</option>)}
                  </select>

                  {/* ZONE SPLITTER + MULTIPLIERS — blue or all */}
                  {isBlueOrAll && (<>
                    <select
                      className="text-black text-xs w-full"
                      value={selZoneSplit || ""}
                      onChange={(e) => {
                        const u = { ...scatZoneSplitter };
                        if (e.target.value) u[key] = e.target.value; else delete u[key];
                        setScatZoneSplitter(u);
                      }}
                    >
                      <option value="">Zone Splitter</option>
                      {ZONE_SPLITTER_OPTIONS.map((v) => <option key={v} value={v}>{v}</option>)}
                    </select>
                    <input
                      type="text"
                      placeholder="ZoneMultipliers e.g. 2,3,3,4"
                      className="text-black text-xs w-full px-1 py-0.5 rounded"
                      value={selZoneMult}
                      onChange={(e) => {
                        const u = { ...scatZoneMultipliers };
                        if (e.target.value) u[key] = e.target.value; else delete u[key];
                        setScatZoneMultipliers(u);
                      }}
                    />
                  </>)}

                  {/* BOOST VALUE — orange or all */}
                  {isOrangeOrAll && (
                    <select
                      className="text-black text-xs w-full"
                      value={selBoost}
                      onChange={(e) => {
                        const u = { ...scatBoostValues };
                        if (e.target.value) u[key] = e.target.value; else delete u[key];
                        setScatBoostValues(u);
                      }}
                    >
                      <option value="">Boost Value</option>
                      {BOOST_VALUE_OPTIONS.map((v) => <option key={v} value={v}>{v}</option>)}
                    </select>
                  )}

                  {/* SPLIT COUNT — cerise or all */}
                  {isCeriseOrAll && (
                    <select
                      className="text-black text-xs w-full"
                      value={selSplitCount}
                      onChange={(e) => {
                        const u = { ...scatSplitCount };
                        if (e.target.value) u[key] = e.target.value; else delete u[key];
                        setScatSplitCount(u);
                      }}
                    >
                      <option value="">Split Count</option>
                      {SPLIT_COUNT_OPTIONS.map((v) => <option key={v} value={v}>Split × {v}</option>)}
                    </select>
                  )}

                </div>
              )}
            </div>
          );
        })}
      </div>

      <button onClick={() => scroll("down")} className="text-white mt-1">▼</button>
    </div>
  );
}