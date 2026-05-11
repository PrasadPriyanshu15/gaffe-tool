


// /* eslint-disable @typescript-eslint/no-explicit-any */

// "use client";

// import { useState } from "react";

// type Props = {
//   gaffe: any;
//   featureGaffes?: string[]; // each is a pre-formatted feature output line
// };

// function formatGaffe(gaffe: any) {
//   let result = `[reelStopPositions: [${gaffe.reelStopPositions.join(",")}]`;

//   // 🎯 SCAT OUTPUT
//   if (gaffe.scatReplacement && gaffe.scatReplacement.length > 0) {
//     result += `, scatterType: [${gaffe.scatReplacement.join(", ")}]`;
//   }

//   // 🪙 LANDED COINS
//   if (gaffe.landedCoins && gaffe.landedCoins.length > 0) {
//     const coinsFormatted = gaffe.landedCoins
//       .map((coin: any) => `[${coin[0]},${coin[1]},${coin[2]}]`)
//       .join(",");
//     result += `, landedCoins: [${coinsFormatted}]`;
//   }

//   // 🎯 FEATURE OUTPUT
//   if (gaffe.featureTriggered && gaffe.featureTriggered.length > 0) {
//     result += `, featureTriggered: [${gaffe.featureTriggered.join(", ")}]`;
//   }

//   // ⭐ GRAND
//   result += `, canGrandTrigger: ${gaffe.canGrandTrigger}`;

//   // 🔵 ZONE SPLITTER
//   if (gaffe.zoneSplitter !== undefined) {
//     result += `, zoneSplitter: ${gaffe.zoneSplitter}`;
//   }

//   // 🔵 ZONE MULTIPLIERS
//   if (gaffe.zoneMultipliers !== undefined) {
//     result += `, zoneMultipliers: [${gaffe.zoneMultipliers.join(",")}]`;
//   }

//   // ⚡ BOOST VALUES
//   if (gaffe.boostValues !== undefined) {
//     result += `, boostValues: [${gaffe.boostValues.join(",")}]`;
//   }

//   result += `]`;

//   return result;
// }

// export default function GaffeOutput({ gaffe, featureGaffes }: Props) {
//   const [copied, setCopied] = useState(false);

//   const baseFormatted = formatGaffe(gaffe);
//   const lines = [baseFormatted, ...(featureGaffes ?? [])];
//   const finalOutput = lines.join("\n");

//   const handleCopy = () => {
//     navigator.clipboard.writeText(finalOutput);
//     setCopied(true);
//     setTimeout(() => setCopied(false), 1500);
//   };

//   return (
//     <div className="bg-green-900 text-green-200 p-6 rounded-xl w-full">
//       <h2 className="text-lg mb-4">Gaffe / Forcer Output</h2>

//       <div className="bg-black p-4 rounded mb-4">
//         <div className="text-green-400 p-2 min-h-[120px] whitespace-pre-wrap break-all text-sm font-mono">
//           {finalOutput}
//         </div>
//       </div>

//       <button
//         onClick={handleCopy}
//         className={`px-4 py-2 rounded transition-all duration-300 ${
//           copied
//             ? "bg-green-500 scale-110 shadow-lg"
//             : "bg-green-700 hover:bg-green-600"
//         }`}
//       >
//         {copied ? "Copied!" : "Copy"}
//       </button>
//     </div>
//   );
// }



/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { useState } from "react";

type Props = {
  gaffe: any;
  featureGaffes?: string[];
};

function formatGaffe(gaffe: any) {
  let result = `[reelStopPositions: [${gaffe.reelStopPositions.join(",")}]`;

  if (gaffe.scatReplacement?.length > 0)
    result += `, scatterType: [${gaffe.scatReplacement.join(", ")}]`;

  // landedCoins — each entry may have 3 or 4 elements (4th = split count)
  if (gaffe.landedCoins?.length > 0) {
    const fmt = gaffe.landedCoins
      .map((coin: any[]) => `[${coin.join(",")}]`)
      .join(",");
    result += `, landedCoins: [${fmt}]`;
  }

  if (gaffe.featureTriggered?.length > 0)
    result += `,featureTriggered: [${gaffe.featureTriggered.join(",")}]`;

  result += `,canGrandTrigger: ${gaffe.canGrandTrigger}`;

  if (gaffe.zoneSplitter !== undefined)    result += `, zoneSplitter: ${gaffe.zoneSplitter}`;
  if (gaffe.zoneMultipliers !== undefined) result += `, zoneMultipliers: [${gaffe.zoneMultipliers.join(",")}]`;
  if (gaffe.boostValues !== undefined)     result += `, boostValues: [${gaffe.boostValues.join(",")}]`;

  result += `]`;
  return result;
}

export default function GaffeOutput({ gaffe, featureGaffes }: Props) {
  const [copied, setCopied] = useState(false);

  const baseFormatted = formatGaffe(gaffe);
  const lines         = [baseFormatted, ...(featureGaffes ?? [])];
  const finalOutput   = lines.join("\n");

  const handleCopy = () => {
    navigator.clipboard.writeText(finalOutput);
    setCopied(true);
    setTimeout(() => setCopied(false), 1500);
  };

  return (
    <div className="bg-green-900 text-green-200 p-6 rounded-xl w-full">
      <h2 className="text-lg mb-4">Gaffe / Forcer Output</h2>

      <div className="bg-black p-4 rounded mb-4">
        <div className="text-green-400 p-2 min-h-[120px] whitespace-pre-wrap break-all text-sm font-mono">
          {finalOutput}
        </div>
      </div>

      <button
        onClick={handleCopy}
        className={`px-4 py-2 rounded transition-all duration-300 ${
          copied ? "bg-green-500 scale-110 shadow-lg" : "bg-green-700 hover:bg-green-600"
        }`}
      >
        {copied ? "Copied!" : "Copy"}
      </button>
    </div>
  );
}