/* eslint-disable @typescript-eslint/no-explicit-any */
// /* eslint-disable @typescript-eslint/no-explicit-any */
// "use client";

// // eslint-disable-next-line @typescript-eslint/no-explicit-any
// export default function GaffeOutput({ gaffe }: any) {

//   //! for result show 
// function formatGaffe(gaffe: any) {
//   let result = `[\n  reelStopPositions: [${gaffe.reelStopPositions.join(", ")}]`;

//   if (gaffe.triggerGrandJackpot) {
//     result += `,\n  triggerGrandJackpot: true`;
//   }

//   if (gaffe.triggerMajorJackpot) {
//     result += `,\n  triggerMajorJackpot: true`;
//   }

//   // ✅ ADD THIS
//   if (gaffe.scatReplacement && gaffe.scatReplacement.length > 0) {
//     result += `,\n  scatReplacement: [${gaffe.scatReplacement.join(", ")}]`;
//   }

//   result += `\n]`;

//   return result;
// }

//   return (
//     <div className="bg-green-900 text-green-200 p-6 rounded-xl w-[350px]">
//       <h2 className="text-lg mb-4">Gaffe / Forcer Output</h2>

//       <div className="bg-black p-4 rounded mb-4">
//         <pre>{formatGaffe(gaffe)}</pre>
//       </div>

//       <button
//         onClick={() =>
//           navigator.clipboard.writeText(JSON.stringify(gaffe))
//         }
//         className="bg-green-700 px-4 py-2 rounded"
//       >
//         Copy
//       </button>
//     </div>
//   );
// }





// "use client";

// import { useState } from "react";


// type Props = {
//   gaffe: string;
//   featureOutput?: string[];
// };


// function formatGaffe(gaffe: any) {
//   let result = `[reelStopPositions: [${gaffe.reelStopPositions.join(",")}]`;

//   if (gaffe.scatReplacement) {
//     result += `, scatReplacement: [${gaffe.scatReplacement.join(",")}]`;
//   }
  
//   if (gaffe.stack) {
//   result += `, stack: ${gaffe.stack}`;
// }

//     if (gaffe.triggerGrandJackpot) {
//     result += `, triggerGrandJackpot: true`;
//   }

//   if (gaffe.triggerMajorJackpot) {
//     result += `, triggerMajorJackpot: true`;
//   }

//   if (gaffe.isFeatureTriggered === false) {
//   result += `, isFeatureTriggered: false`;
// }

// if (gaffe.featureTriggered) {
//   result += `, featureTriggered: [${gaffe.featureTriggered.join(", ")}]`;
// }

//   result += `]`;

//   return result;
// }

// export default function GaffeOutput({ gaffe }: any) {
//   const [copied, setCopied] = useState(false);

//   // ✅ Generate formatted output once
//   const formatted = formatGaffe(gaffe);

//   const handleCopy = () => {
//     navigator.clipboard.writeText(formatted);
//     setCopied(true);

//     setTimeout(() => {
//       setCopied(false);
//     }, 1500);
//   };

//   return (
//     <div className="bg-green-900 text-green-200 p-6 rounded-xl w-[650px]">
//       <h2 className="text-lg mb-4">Gaffe / Forcer Output</h2>

//       {/* OUTPUT BOX */}
//       <div className="bg-black p-4 rounded mb-4">
        
//       <div className="bg-black text-green-400 p-4 rounded min-h-[120px] whitespace-pre-wrap break-words">
//   {formatted}
// </div>
//       </div>

//       {/* COPY BUTTON WITH ANIMATION */}
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



"use client";

import { useState } from "react";

type Props = {
  gaffe: any;
  featureOutput?: string[];
};

function formatGaffe(gaffe: any) {
  let result = `[reelStopPositions: [${gaffe.reelStopPositions.join(",")}]`;

  if (gaffe.scatReplacement) {
    result += `, scatReplacement: [${gaffe.scatReplacement.join(",")}]`;
  }

  if (gaffe.stack) {
    result += `, stack: ${gaffe.stack}`;
  }

  if (gaffe.triggerGrandJackpot) {
    result += `, triggerGrandJackpot: true`;
  }

  if (gaffe.triggerMajorJackpot) {
    result += `, triggerMajorJackpot: true`;
  }

  if (gaffe.isFeatureTriggered === false) {
    result += `, isFeatureTriggered: false`;
  }

  if (gaffe.featureTriggered) {
    result += `, featureTriggered: [${gaffe.featureTriggered.join(", ")}]`;
  }

  result += `]`;

  return result;
}

export default function GaffeOutput({ gaffe, featureOutput }: Props) {
  const [copied, setCopied] = useState(false);

  // ✅ Base output
  const formatted = formatGaffe(gaffe);

  // ✅ Feature output (joined cleanly)
  const featureText =
    featureOutput && featureOutput.length > 0
      ? "\n\n" + featureOutput.join("\n")
      : "";

  // ✅ Final combined output
  const finalOutput = formatted + featureText;

  const handleCopy = () => {
    navigator.clipboard.writeText(finalOutput);
    setCopied(true);

    setTimeout(() => {
      setCopied(false);
    }, 1500);
  };

  return (
    <div className="bg-green-900 text-green-200 p-6 rounded-xl w-[650px]">
      <h2 className="text-lg mb-4">Gaffe / Forcer Output</h2>

      {/* OUTPUT BOX */}
      <div className="bg-black p-4 rounded mb-4">
        <div className="bg-black text-green-400 p-4 rounded min-h-[120px] whitespace-pre-wrap break-words">
          {finalOutput}
        </div>
      </div>

      {/* COPY BUTTON */}
      <button
        onClick={handleCopy}
        className={`px-4 py-2 rounded transition-all duration-300 ${
          copied
            ? "bg-green-500 scale-110 shadow-lg"
            : "bg-green-700 hover:bg-green-600"
        }`}
      >
        {copied ? "Copied!" : "Copy"}
      </button>
    </div>
  );
}