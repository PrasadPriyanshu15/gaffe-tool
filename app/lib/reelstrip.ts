/**
 * Parse an uploaded reelstrip JSON file into the `string[][]` shape the games use.
 *
 * Expected format (one entry per reel, symbols in strip order):
 *   {
 *     "reelStripDefinitions": [
 *       { "name": "reel_1", "stops": [ { "name": "STACK" }, { "name": "A" }, ... ] },
 *       ...
 *     ]
 *   }
 *
 * The `name` on each stop must be the symbol token the game itself uses
 * (e.g. "SCAT", "STACK", "WILD", "PIC1".."PIC5", "A", "K", "Q", "J", "10", "9").
 *
 * This is a pure function: it only reads the text it is given. Nothing here
 * touches the network or any storage — parsing happens entirely in the browser.
 */
export function parseReelstripJSON(text: string): string[][] {
  let data: unknown;
  try {
    data = JSON.parse(text);
  } catch {
    throw new Error("File is not valid JSON.");
  }

  const defs = (data as { reelStripDefinitions?: unknown })?.reelStripDefinitions;
  if (!Array.isArray(defs) || defs.length === 0) {
    throw new Error('Missing a non-empty "reelStripDefinitions" array.');
  }

  const reels = defs.map((def, i) => {
    const stops = (def as { stops?: unknown })?.stops;
    if (!Array.isArray(stops) || stops.length === 0) {
      throw new Error(`Reel ${i + 1} has no "stops" array.`);
    }
    return stops.map((stop, j) => {
      const name = (stop as { name?: unknown })?.name;
      if (typeof name !== "string" || name.trim() === "") {
        throw new Error(`Reel ${i + 1}, stop ${j + 1} is missing a "name".`);
      }
      return name;
    });
  });

  return reels;
}
