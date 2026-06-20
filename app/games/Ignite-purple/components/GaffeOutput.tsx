


// /* eslint-disable @typescript-eslint/no-explicit-any */
// "use client";

// import { useState } from "react";

// type Props = {
//   gaffe: any;
//   featureGaffes?: string[];
// };

// function formatGaffe(gaffe: any) {
//   let result = `[reelStopPositions: [${gaffe.reelStopPositions.join(",")}]`;

//   if (gaffe.scatReplacement?.length > 0)
//     result += `, scatterType: [${gaffe.scatReplacement.join(", ")}]`;

//   // landedCoins — each entry may have 3 or 4 elements (4th = split count)
//   if (gaffe.landedCoins?.length > 0) {
//     const fmt = gaffe.landedCoins
//       .map((coin: any[]) => `[${coin.join(",")}]`)
//       .join(",");
//     result += `, landedCoins: [${fmt}]`;
//   }

//   if (gaffe.featureTriggered?.length > 0)
//     result += `,featureTriggered: [${gaffe.featureTriggered.join(",")}]`;

//   result += `,canGrandTrigger: ${gaffe.canGrandTrigger}`;

//   if (gaffe.zoneSplitter !== undefined)    result += `, zoneSplitter: ${gaffe.zoneSplitter}`;
//   if (gaffe.zoneMultipliers !== undefined) result += `, zoneMultipliers: [${gaffe.zoneMultipliers.join(",")}]`;
//   if (gaffe.boostValues !== undefined)     result += `, boostValues: [${gaffe.boostValues.join(",")}]`;

//   result += `]`;
//   return result;
// }

// export default function GaffeOutput({ gaffe, featureGaffes }: Props) {
//   const [copied, setCopied] = useState(false);

//   const baseFormatted = formatGaffe(gaffe);
//   const lines         = [baseFormatted, ...(featureGaffes ?? [])];
//   const finalOutput   = lines.join("\n");

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
//           copied ? "bg-green-500 scale-110 shadow-lg" : "bg-green-700 hover:bg-green-600"
//         }`}
//       >
//         {copied ? "Copied!" : "Copy"}
//       </button>
//     </div>
//   );
// }




//! latest
// /* eslint-disable @typescript-eslint/no-explicit-any */
// "use client";

// import { useState } from "react";

// type Props = {
//   gaffe: any;
//   featureGaffes?: string[];
// };

// function formatGaffe(gaffe: any) {
//   let result = `[reelStopPositions: [${gaffe.reelStopPositions.join(",")}]`;

//   if (gaffe.scatReplacement?.length > 0)
//     result += `, scatterType: [${gaffe.scatReplacement.join(", ")}]`;

//   // landedCoins — each entry may have 3 or 4 elements (4th = split count)
//   if (gaffe.landedCoins?.length > 0) {
//     const fmt = gaffe.landedCoins
//       .map((coin: any[]) => `[${coin.join(",")}]`)
//       .join(",");
//     result += `, landedCoins: [${fmt}]`;
//   }

//   if (gaffe.featureTriggered?.length > 0)
//     result += `,featureTriggered: [${gaffe.featureTriggered.join(",")}]`;

//   result += `,canGrandTrigger: ${gaffe.canGrandTrigger}`;

//   if (gaffe.zoneSplitter !== undefined)    result += `, zoneSplitter: ${gaffe.zoneSplitter}`;
//   if (gaffe.zoneMultipliers !== undefined) result += `, zoneMultipliers: [${gaffe.zoneMultipliers.join(",")}]`;
//   if (gaffe.boostValues !== undefined)     result += `, boostValues: [${gaffe.boostValues.join(",")}]`;
//   if (gaffe.numberOfSplitCoin !== undefined) result += `, numberOfSplitCoins: [${gaffe.numberOfSplitCoin.join(",")}]`;

//   result += `]`;
//   return result;
// }

// export default function GaffeOutput({ gaffe, featureGaffes }: Props) {
//   const [copied, setCopied] = useState(false);

//   const baseFormatted = formatGaffe(gaffe);
//   const lines         = [baseFormatted, ...(featureGaffes ?? [])];
//   const finalOutput   = lines.join("\n");

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
//           copied ? "bg-green-500 scale-110 shadow-lg" : "bg-green-700 hover:bg-green-600"
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
  if (gaffe.numberOfSplitCoin !== undefined) result += `, numberOfSplitCoins: [${gaffe.numberOfSplitCoin.join(",")}]`;
  if (gaffe.splitCoinsBoostValues !== undefined) {
    const fmt = gaffe.splitCoinsBoostValues
      .map((arr: any[]) => `[${arr.join(",")}]`)
      .join(",");
    result += `, splitCoinsBoostValues: [${fmt}]`;
  }

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