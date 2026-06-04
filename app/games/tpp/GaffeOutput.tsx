// /* eslint-disable @typescript-eslint/no-explicit-any */
// "use client";

// import { useState } from "react";

// type Props = {
//   gaffe: Record<string, any>;
//   featureGaffes?: string[];
// };

// function formatGaffe(gaffe: Record<string, any>): string {
//   const parts: string[] = [];

//   parts.push(`reelStopPositions: [${gaffe.reelStopPositions.join(",")}]`);

//   if (gaffe.scatReplacement?.length > 0)
//     parts.push(`scatReplacement: [${gaffe.scatReplacement.join(",")}]`);

//   if (gaffe.stack)
//     parts.push(`stack: ${gaffe.stack}`);

//   if (gaffe.triggerGrandJackpot) parts.push(`triggerGrandJackpot: true`);
//   if (gaffe.triggerMajorJackpot) parts.push(`triggerMajorJackpot: true`);

//   if (gaffe.triggerFeaturesed === false) {
//     parts.push(`triggerFeaturesed: false`);
//   } else if (Array.isArray(gaffe.triggerFeaturesed) && gaffe.triggerFeaturesed.length > 0) {
//     parts.push(`triggerFeaturesed: [${gaffe.triggerFeaturesed.join(",")}]`);
//   }

//   if (gaffe.landedCoins?.length > 0) {
//     const fmt = (gaffe.landedCoins as any[][])
//       .map((c) => `[${c.join(",")}]`)
//       .join(",");
//     parts.push(`landedCoins: [${fmt}]`);
//   }

//   return `[${parts.join(", ")}]`;
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
//     <div
//       className="rounded-2xl p-5 flex flex-col gap-4 h-fit"
//       style={{ background: "#1a5c2e" }}
//     >
//       <h2 className="text-base font-semibold text-green-100">Gaffe / Forcer Output</h2>

//       <div className="bg-black rounded-xl p-4">
//         <pre className="text-green-400 text-sm font-mono whitespace-pre-wrap break-all min-h-[80px] leading-relaxed">
//           {finalOutput}
//         </pre>
//       </div>

//       <button
//         onClick={handleCopy}
//         className={`px-5 py-2 rounded-lg font-semibold text-sm transition-all duration-200 w-fit ${
//           copied
//             ? "bg-green-400 text-black scale-105"
//             : "bg-green-700 hover:bg-green-600 text-white"
//         }`}
//       >
//         {copied ? "✓ Copied!" : "Copy"}
//       </button>
//     </div>
//   );
// }



/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { useState } from "react";

type Props = {
  gaffe: Record<string, any>;
  featureGaffes?: string[];
};

function formatGaffe(gaffe: Record<string, any>): string {
  const parts: string[] = [];

  parts.push(`reelStopPositions: [${gaffe.reelStopPositions.join(",")}]`);

  if (gaffe.scatReplacement?.length > 0)
    parts.push(`scatReplacement: [${gaffe.scatReplacement.join(",")}]`);

  if (gaffe.stack)
    parts.push(`stack: ${gaffe.stack}`);

  if (gaffe.triggerGrandJackpot) parts.push(`triggerGrandJackpot: true`);
  if (gaffe.triggerMajorJackpot) parts.push(`triggerMajorJackpot: true`);

  if (gaffe.triggerFeatures === false) {
    parts.push(`triggerFeatures: false`);
  } else if (Array.isArray(gaffe.triggerFeatures) && gaffe.triggerFeatures.length > 0) {
    parts.push(`triggerFeatures: ${gaffe.triggerFeatures.join(",")}`);
  }

  if (gaffe.landedCoins?.length > 0) {
    parts.push(`landedCoins: [${(gaffe.landedCoins as string[]).join(",")}]`);
  }

  return `[${parts.join(", ")}]`;
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
    <div
      className="rounded-2xl p-5 flex flex-col gap-4 h-fit"
      style={{ background: "#1a5c2e" }}
    >
      <h2 className="text-base font-semibold text-green-100">Gaffe / Forcer Output</h2>

      <div className="bg-black rounded-xl p-4">
        <pre className="text-green-400 text-sm font-mono whitespace-pre-wrap break-all min-h-[80px] leading-relaxed">
          {finalOutput}
        </pre>
      </div>

      <button
        onClick={handleCopy}
        className={`px-5 py-2 rounded-lg font-semibold text-sm transition-all duration-200 w-fit ${
          copied
            ? "bg-green-400 text-black scale-105"
            : "bg-green-700 hover:bg-green-600 text-white"
        }`}
      >
        {copied ? "✓ Copied!" : "Copy"}
      </button>
    </div>
  );
}