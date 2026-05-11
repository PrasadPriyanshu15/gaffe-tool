
/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

type Props = {
  reelIndex: number;
  reel: string[];
  stop: number;
  setStop: (index: number, value: number) => void;

  
  scatColors: { [key: string]: string };
  setScatColors: (val: any) => void;
  stackValue: string;
  
};

export default function ReelColumn({
  reelIndex,
  reel,
  stop,
  setStop,
  scatColors,
  setScatColors,
  stackValue
}: Props) {
  const scroll = (dir: "up" | "down") => {
    let newStop = stop;

    if (dir === "up") {
  newStop = stop - 1;
  if (newStop < 1) newStop = reel.length;
} else {
  newStop = stop + 1;
  if (newStop > reel.length) newStop = 1;
}

    setStop(reelIndex, newStop);
  };


  const getVisibleSymbols = () => {
  return [-1, 0, 1, 2].map((offset) => {
    const index =
      (stop - 1 + offset + reel.length) % reel.length;

    return {
      symbol: reel[index],
      index
    };
  });
};
console.log("STOP:", stop);

  const visible = getVisibleSymbols();

  return (
    <div className="bg-blue-900 p-3 rounded-xl flex flex-col items-center w-24">
      {/* Title */}
      <div className="text-white text-sm mb-2">
        Reel {reelIndex + 1}
      </div>

      {/* UP */}
      <button onClick={() => scroll("up")} className="text-white mb-1">
        ▲
      </button>

      {/* SYMBOL WINDOW */}
      <div className="bg-blue-800 rounded-lg overflow-hidden">
       {visible.map((item, i) => {
  const key = `${reelIndex}-${item.index}`;
  const isScat = item.symbol === "SCAT";

  const colorMap: any = {
    blue: "bg-blue-400",
    red: "bg-red-400",
    purple: "bg-purple-400"
  };

  const selectedColor = scatColors[key];

  return (
    <div
      key={i}
      className={`w-20 h-14 flex flex-col items-center justify-center text-white border-b border-blue-700
      ${i === 1 ? "bg-blue-500 font-bold" : "bg-blue-700"}
      ${isScat && selectedColor ? colorMap[selectedColor] : ""}
      `}
    >
      {/* SYMBOL TEXT */}
      {/* <div>
        {item.symbol} #{item.index}
      </div> */}
      <div>
  {item.symbol === "STACK"
    ? `STACK-${stackValue || "RANDOM"}`
    : `${item.symbol} #${item.index}`}
</div>

      {/* ✅ SCAT DROPDOWN */}
      {isScat && (
        <select
          className="text-black text-xs mt-1"
          value={selectedColor || ""}
          onChange={(e) => {
            setScatColors({
              ...scatColors,
              [key]: e.target.value
            });
          }}
        >
          <option value="">Random</option>
          <option value="blue">Blue</option>
          <option value="red">Red</option>
          <option value="purple">Purple</option>
        </select>
      )}
    </div>
  );
})}
      </div>

      {/* DOWN */}
      <button onClick={() => scroll("down")} className="text-white mt-1">
        ▼
      </button>
    </div>
  );
}