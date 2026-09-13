"use client";

import { useRef, useState } from "react";
import { parseReelstripJSON } from "@/lib/reelstrip";

/**
 * Client-only reelstrip loader.
 *
 * Reads a JSON reelstrip the tester picks from their own machine, parses it in
 * the browser, and hands the resulting reels to the parent via `onLoaded`.
 *
 * The file is read with the browser File API (`file.text()`) — it is never
 * uploaded, fetched, POSTed, or written to storage. This app is a static
 * export with no server, so the data stays in memory in this tab only and is
 * gone on refresh.
 */
export default function ReelstripUploader({
  onLoaded,
}: {
  onLoaded?: (reels: string[][]) => void;
}) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [fileName, setFileName] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [summary, setSummary] = useState<string | null>(null);

  const handleFile = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    try {
      const text = await file.text();            // in-browser read, no network
      const reels = parseReelstripJSON(text);
      onLoaded?.(reels);
      setFileName(file.name);
      setError(null);
      setSummary(`${reels.length} reels · lengths ${reels.map((r) => r.length).join(", ")}`);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Could not read file.");
      setSummary(null);
      setFileName(null);
    } finally {
      // allow re-selecting the same file
      if (inputRef.current) inputRef.current.value = "";
    }
  };

  return (
    <div className="flex flex-col gap-1">
      <div className="flex items-center gap-2 flex-wrap">
        <button
          type="button"
          onClick={() => inputRef.current?.click()}
          className="px-3 py-2 rounded-lg text-sm font-semibold border border-indigo-400 bg-indigo-600 hover:bg-indigo-500 text-white transition-colors"
        >
          ⬆ Upload reelstrip (JSON)
        </button>
        <input
          ref={inputRef}
          type="file"
          accept=".json,application/json"
          onChange={handleFile}
          className="hidden"
        />
        {fileName && (
          <span className="text-xs text-green-400 font-medium">
            {fileName} — {summary}
          </span>
        )}
        {error && <span className="text-xs text-red-400">⚠ {error}</span>}
      </div>
      <span className="text-[11px] text-gray-500 italic">
        Read in your browser only — never uploaded or stored. Symbol names must match this game’s tokens.
      </span>
    </div>
  );
}
