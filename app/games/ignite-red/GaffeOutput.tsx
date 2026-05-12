// "use client";

// import { useState } from "react";

// type Props = { lines: string[] };

// export default function GaffeOutput({ lines }: Props) {
//   const [copied, setCopied] = useState(false);
//   const text = lines.join("\n");

//   const copy = () => {
//     navigator.clipboard.writeText(text);
//     setCopied(true);
//     setTimeout(() => setCopied(false), 1500);
//   };

//   return (
//     <div className="bg-gray-900 border border-green-800 rounded-xl p-4 sticky top-4">
//       <div className="flex justify-between items-center mb-3">
//         <h2 className="text-green-400 font-bold text-sm font-mono">📋 Gaffe Output</h2>
//         <button onClick={copy}
//           className={`px-3 py-1 rounded text-xs font-bold transition-all ${copied ? "bg-green-500 scale-105" : "bg-green-800 hover:bg-green-700"}`}>
//           {copied ? "✓ Copied!" : "Copy"}
//         </button>
//       </div>
//       <div className="bg-black rounded-lg p-3 min-h-[120px] max-h-[75vh] overflow-y-auto">
//         {lines.length === 0
//           ? <span className="text-gray-600 text-xs font-mono">No output yet — configure base game and spin</span>
//           : lines.map((line, i) => (
//             <div key={i} className="text-green-300 text-xs font-mono break-all mb-2 pb-2 border-b border-gray-800 last:border-0 last:mb-0 last:pb-0">
//               <span className="text-gray-600 mr-1 select-none">{i + 1}.</span>{line}
//             </div>
//           ))}
//       </div>
//       {lines.length > 0 && (
//         <div className="mt-2 text-[10px] text-gray-600 font-mono text-right">{lines.length} line{lines.length !== 1 ? "s" : ""}</div>
//       )}
//     </div>
//   );
// }



"use client";

import { useState } from "react";

type Props = { lines: string[] };

export default function GaffeOutput({ lines }: Props) {
  const [copied, setCopied] = useState(false);
  const text = lines.join("\n");

  const copy = () => {
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 1500);
  };

  return (
    <div className="bg-gray-900 border border-green-800 rounded-xl p-4 sticky top-4">
      <div className="flex justify-between items-center mb-3">
        <h2 className="text-green-400 font-bold text-sm font-mono">📋 Gaffe Output</h2>
        <button onClick={copy}
          className={`px-3 py-1 rounded text-xs font-bold transition-all ${copied ? "bg-green-500 scale-105" : "bg-green-800 hover:bg-green-700"}`}>
          {copied ? "✓ Copied!" : "Copy"}
        </button>
      </div>
      <div className="bg-black rounded-lg p-3 min-h-[120px] max-h-[75vh] overflow-y-auto">
        {lines.length === 0
          ? <span className="text-gray-600 text-xs font-mono">No output yet — configure base game and spin</span>
          : lines.map((line, i) => (
            <div key={i} className="text-green-300 text-xs font-mono break-all mb-2 pb-2 border-b border-gray-800 last:border-0 last:mb-0 last:pb-0">
              <span className="text-gray-600 mr-1 select-none">{i + 1}.</span>{line}
            </div>
          ))}
      </div>
      {lines.length > 0 && (
        <div className="mt-2 text-[10px] text-gray-600 font-mono text-right">{lines.length} line{lines.length !== 1 ? "s" : ""}</div>
      )}
    </div>
  );
}