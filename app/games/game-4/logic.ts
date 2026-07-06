// /* eslint-disable @typescript-eslint/no-explicit-any */

// // ─── TYPES ────────────────────────────────────────────────────────────────────

// export type Cell = {
//   type: string;
//   value?: number;
//   multiplier?: number | string;
// };

// export type CoinConfig = {
//   name: string;
//   color: string;
//   hasValue?: boolean;
//   hasMultiplier?: boolean;
// };

// // How cell #index labels are numbered on the grid (0-indexed).
// // "horizontal": 00,01,02... along a row, then wraps to the next row.
// // "vertical":   00,01,02... down a column, then wraps to the next column.
// export type PositionOrder = "horizontal" | "vertical";

// export type FeatureConfig = {
//   name: string;
//   rows: number;
//   cols: number;
//   coins: CoinConfig[];
//   spins: number;
//   positionOrder: PositionOrder;
//   sequenceMode: SequenceMode;
//   // The number written into reelStops output for a landed/filled position
//   // (empty positions are always 0). Some games use 1, others 4, etc.
//   reelStopActiveValue: number;
//   // The number written into reelStops output for an empty/non-landed position.
//   reelStopEmptyValue: number;
// };

// // A saved, reusable game feature — grid shape, index order, coin set, and
// // output parameters — stored so the user can pick it up again by name
// // instead of re-entering it.
// export type FeatureProfile = {
//   name: string;
//   rows: number;
//   cols: number;
//   coins: CoinConfig[];
//   spins: number;
//   positionOrder: PositionOrder;
//   sequenceMode: SequenceMode;
//   reelStopActiveValue: number;
//   reelStopEmptyValue: number;
//   fields: SchemaField[];
//   savedAt: number;
// };

// // ─── FEATURE PROFILE MEMORY (localStorage) ────────────────────────────────────

// const PROFILES_KEY = "gaffe-tool:feature-profiles";

// export function loadFeatureProfiles(): FeatureProfile[] {
//   if (typeof window === "undefined") return [];
//   try {
//     const raw = window.localStorage.getItem(PROFILES_KEY);
//     if (!raw) return [];
//     const parsed = JSON.parse(raw);
//     return Array.isArray(parsed) ? parsed : [];
//   } catch {
//     return [];
//   }
// }

// export function saveFeatureProfile(profile: FeatureProfile): FeatureProfile[] {
//   const existing = loadFeatureProfiles().filter(p => p.name !== profile.name);
//   const updated = [profile, ...existing].sort((a, b) => b.savedAt - a.savedAt);
//   if (typeof window !== "undefined") {
//     window.localStorage.setItem(PROFILES_KEY, JSON.stringify(updated));
//   }
//   return updated;
// }

// export function deleteFeatureProfile(name: string): FeatureProfile[] {
//   const updated = loadFeatureProfiles().filter(p => p.name !== name);
//   if (typeof window !== "undefined") {
//     window.localStorage.setItem(PROFILES_KEY, JSON.stringify(updated));
//   }
//   return updated;
// }

// // ─── GRID INDEX LABELING ───────────────────────────────────────────────────────

// // 0-indexed cell number in the chosen order.
// export function gridIndex(
//   row: number,
//   col: number,
//   rows: number,
//   cols: number,
//   order: PositionOrder
// ): number {
//   return order === "horizontal" ? row * cols + col : col * rows + row;
// }

// // Zero-pads to at least 2 digits (00, 01 ... 10, 11 ...), widening automatically
// // for grids with 100+ cells.
// export function formatIndex(index: number, totalCells: number): string {
//   const width = Math.max(2, String(Math.max(totalCells - 1, 0)).length);
//   return String(index).padStart(width, "0");
// }

// // Position format for how cell coordinates are expressed in output
// export type PositionFormat =
//   | "colRow"          // [col, row]  e.g. [2, 1]
//   | "rowCol"          // [row, col]  e.g. [1, 2]
//   | "flatIndex"       // col * rows + row  (column-major)
//   | "flatIndexRowMajor"; // row * cols + col (row-major)

// // What each output field extracts from the grid
// export type SchemaFieldType =
//   | "reelStops"   // 0/1 per cell (column-major)
//   | "coin"        // positions of cells matching a coin type
//   | "multiplier"  // positions of cells that have a multiplier
//   | "static"      // a fixed value
//   | "custom";     // raw JS expression evaluated against grid (advanced)

// export type SchemaField = {
//   key: string;
//   type: SchemaFieldType;

//   // coin type filter (used when type === "coin")
//   coinType?: string;

//   // how positions are serialized (for coin, multiplier, reelStops)
//   positionFormat?: PositionFormat;

//   // whether to include value/multiplier after position
//   includeValue?: boolean;
//   includeMultiplier?: boolean;

//   // static value
//   staticValue?: any;

//   // custom JS expression string — receives `grid`, `rows`, `cols`
//   customExpr?: string;

//   // if true, this field's positionFormat is kept in sync with the grid's
//   // Horizontal/Vertical index-order selection, instead of being set manually.
//   useGridOrder?: boolean;
// };

// export type OutputEntry = {
//   spin: number;
//   fields: Record<string, any>;
//   raw: string;
// };

// // How the reel-stop sequence behaves across successive spins:
// // "full":    every spin lists ALL grid positions (locked or not) — the classic
// //            behavior, positions can repeat/carry forward each spin.
// // "cascade": once a position lands a symbol, it's permanently removed from
// //            the sequence in every following spin — the array shrinks over time.
// export type SequenceMode = "full" | "cascade";

// // ─── POSITION HELPERS ─────────────────────────────────────────────────────────

// export function cellKey(row: number, col: number): string {
//   return `${row},${col}`;
// }

// // Returns a new locked-set: the previous locked set plus every currently
// // non-EMPTY cell in the grid. Call this once per committed spin (not on
// // live preview) to advance the "cascade" sequencing mode.
// export function lockedPositionsAfterSpin(grid: Cell[][], prevLocked: Set<string>): Set<string> {
//   const next = new Set(prevLocked);
//   for (let i = 0; i < grid.length; i++)
//     for (let j = 0; j < (grid[i]?.length ?? 0); j++)
//       if (grid[i][j].type !== "EMPTY") next.add(cellKey(i, j));
//   return next;
// }

// export type ExtractContext = {
//   sequenceMode?: SequenceMode;
//   lockedPositions?: Set<string>;
//   // Value written into the reelStops array for a landed/filled position.
//   // Defaults to 1 if not provided.
//   activeValue?: number;
//   // Value written into the reelStops array for an empty/non-landed position.
//   // Defaults to 0 if not provided.
//   emptyValue?: number;
// };

// export function formatPosition(
//   col: number,
//   row: number,
//   rows: number,
//   cols: number,
//   format: PositionFormat
// ): number | number[] {
//   switch (format) {
//     case "colRow":         return [col, row];
//     case "rowCol":         return [row, col];
//     case "flatIndex":      return col * rows + row;
//     case "flatIndexRowMajor": return row * cols + col;
//     default:               return [col, row];
//   }
// }

// // ─── FIELD EXTRACTION ─────────────────────────────────────────────────────────

// export function extractField(
//   grid: Cell[][],
//   field: SchemaField,
//   context: ExtractContext = {}
// ): any {
//   const rows = grid.length;
//   const cols = grid[0]?.length ?? 0;
//   const posFormat = field.positionFormat ?? "colRow";

//   switch (field.type) {
//     case "reelStops": {
//       // Only the flat formats carry an explicit orientation; colRow/rowCol
//       // (pair-based formats) fall back to the original vertical/column-major walk.
//       const horizontal = posFormat === "flatIndexRowMajor";
//       const cellsInOrder: [number, number][] = [];
//       if (horizontal) {
//         for (let i = 0; i < rows; i++)
//           for (let j = 0; j < cols; j++)
//             cellsInOrder.push([i, j]);
//       } else {
//         for (let j = 0; j < cols; j++)
//           for (let i = 0; i < rows; i++)
//             cellsInOrder.push([i, j]);
//       }

//       const activeValue = context.activeValue ?? 1;
//       const emptyValue = context.emptyValue ?? 0;

//       if (context.sequenceMode === "cascade") {
//         const locked = context.lockedPositions ?? new Set<string>();
//         const stops: number[] = [];
//         for (const [i, j] of cellsInOrder) {
//           if (locked.has(cellKey(i, j))) continue; // already landed in a prior spin — drop entirely
//           stops.push(grid[i][j].type !== "EMPTY" ? activeValue : emptyValue);
//         }
//         return stops;
//       }

//       return cellsInOrder.map(([i, j]) => (grid[i][j].type !== "EMPTY" ? activeValue : emptyValue));
//     }

//     case "coin": {
//       const arr: any[] = [];
//       for (let j = 0; j < cols; j++) {
//         for (let i = 0; i < rows; i++) {
//           const cell = grid[i][j];
//           if (!field.coinType || cell.type === field.coinType) {
//             const pos = formatPosition(j, i, rows, cols, posFormat);
//             const entry: any[] = Array.isArray(pos) ? [...pos] : [pos];
//             if (field.includeValue && cell.value !== undefined) entry.push(cell.value);
//             arr.push(entry.length === 1 ? entry[0] : entry);
//           }
//         }
//       }
//       return arr;
//     }

//     case "multiplier": {
//       const arr: any[] = [];
//       for (let j = 0; j < cols; j++) {
//         for (let i = 0; i < rows; i++) {
//           const cell = grid[i][j];
//           if (cell.multiplier !== undefined && cell.multiplier !== "") {
//             const pos = formatPosition(j, i, rows, cols, posFormat);
//             const entry: any[] = Array.isArray(pos) ? [...pos] : [pos];
//             if (field.includeMultiplier) entry.push(cell.multiplier);
//             arr.push(entry.length === 1 ? entry[0] : entry);
//           }
//         }
//       }
//       return arr;
//     }

//     case "static":
//       return field.staticValue ?? null;

//     case "custom": {
//       try {
//         // eslint-disable-next-line no-new-func
//         return new Function("grid", "rows", "cols", `return (${field.customExpr})`)(grid, rows, cols);
//       } catch {
//         return "ERROR";
//       }
//     }

//     default:
//       return null;
//   }
// }

// // ─── SCHEMA → OUTPUT STRING ───────────────────────────────────────────────────

// export function generateFromSchema(
//   grid: Cell[][],
//   fields: SchemaField[],
//   context: ExtractContext = {}
// ): { data: Record<string, any>; text: string } {
//   const data: Record<string, any> = {};
//   for (const field of fields) {
//     data[field.key] = extractField(grid, field, context);
//   }

//   const text = `[${Object.entries(data)
//     .map(([k, v]) => `${k}:${JSON.stringify(v)}`)
//     .join(",\n")}]`;

//   return { data, text };
// }

// // ─── SPIN ENGINE ──────────────────────────────────────────────────────────────

// export function runSpin({ grid }: { grid: Cell[][] }): Cell[][] {
//   return grid.map(row => row.map(cell => ({ ...cell })));
// }

// // ─── DEFAULT SCHEMA ───────────────────────────────────────────────────────────

// export const DEFAULT_FIELDS: SchemaField[] = [
//   {
//     key: "reelStopPositions",
//     type: "reelStops",
//     positionFormat: "colRow",
//   },
//   {
//     key: "goldCoin",
//     type: "coin",
//     coinType: "GOLD",
//     positionFormat: "colRow",
//     includeValue: true,
//   },
//   {
//     key: "redCoin",
//     type: "coin",
//     coinType: "RED",
//     positionFormat: "colRow",
//     includeValue: false,
//   },
//   {
//     key: "multiplierValue",
//     type: "multiplier",
//     positionFormat: "colRow",
//     includeMultiplier: true,
//   },
//   {
//     key: "additionalFeatureTriggered",
//     type: "static",
//     staticValue: false,
//   },
// ];





/* eslint-disable @typescript-eslint/no-explicit-any */

// ─── TYPES ────────────────────────────────────────────────────────────────────

export type Cell = {
  type: string;
  value?: number;
  multiplier?: number | string;
  // Text-based prize label, e.g. "COIN_MINI" — distinct from the numeric `value`.
  label?: string;
  // Free-form per-cell attributes referenced by "coinPrize" parameters,
  // e.g. { direction: "LEFT" } or { variant: "winged" }.
  tags?: Record<string, string>;
};

export type CoinConfig = {
  name: string;
  color: string;
  hasValue?: boolean;
  hasMultiplier?: boolean;
};

// How cell #index labels are numbered on the grid (0-indexed).
// "horizontal": 00,01,02... along a row, then wraps to the next row.
// "vertical":   00,01,02... down a column, then wraps to the next column.
export type PositionOrder = "horizontal" | "vertical";

export type FeatureConfig = {
  name: string;
  rows: number;
  cols: number;
  coins: CoinConfig[];
  spins: number;
  positionOrder: PositionOrder;
  sequenceMode: SequenceMode;
  // The number written into reelStops output for a landed/filled position
  // (empty positions are always 0). Some games use 1, others 4, etc.
  reelStopActiveValue: number;
  // The number written into reelStops output for an empty/non-landed position.
  reelStopEmptyValue: number;
};

// A saved, reusable game feature — grid shape, index order, coin set, and
// output parameters — stored so the user can pick it up again by name
// instead of re-entering it.
export type FeatureProfile = {
  name: string;
  rows: number;
  cols: number;
  coins: CoinConfig[];
  spins: number;
  positionOrder: PositionOrder;
  sequenceMode: SequenceMode;
  reelStopActiveValue: number;
  reelStopEmptyValue: number;
  fields: SchemaField[];
  savedAt: number;
};

// ─── FEATURE PROFILE MEMORY (localStorage) ────────────────────────────────────

const PROFILES_KEY = "gaffe-tool:feature-profiles";

export function loadFeatureProfiles(): FeatureProfile[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = window.localStorage.getItem(PROFILES_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

export function saveFeatureProfile(profile: FeatureProfile): FeatureProfile[] {
  const existing = loadFeatureProfiles().filter(p => p.name !== profile.name);
  const updated = [profile, ...existing].sort((a, b) => b.savedAt - a.savedAt);
  if (typeof window !== "undefined") {
    window.localStorage.setItem(PROFILES_KEY, JSON.stringify(updated));
  }
  return updated;
}

export function deleteFeatureProfile(name: string): FeatureProfile[] {
  const updated = loadFeatureProfiles().filter(p => p.name !== name);
  if (typeof window !== "undefined") {
    window.localStorage.setItem(PROFILES_KEY, JSON.stringify(updated));
  }
  return updated;
}

// ─── GRID INDEX LABELING ───────────────────────────────────────────────────────

// 0-indexed cell number in the chosen order.
export function gridIndex(
  row: number,
  col: number,
  rows: number,
  cols: number,
  order: PositionOrder
): number {
  return order === "horizontal" ? row * cols + col : col * rows + row;
}

// Zero-pads to at least 2 digits (00, 01 ... 10, 11 ...), widening automatically
// for grids with 100+ cells.
export function formatIndex(index: number, totalCells: number): string {
  const width = Math.max(2, String(Math.max(totalCells - 1, 0)).length);
  return String(index).padStart(width, "0");
}

// Position format for how cell coordinates are expressed in output
export type PositionFormat =
  | "colRow"          // [col, row]  e.g. [2, 1]
  | "rowCol"          // [row, col]  e.g. [1, 2]
  | "flatIndex"       // col * rows + row  (column-major)
  | "flatIndexRowMajor"; // row * cols + col (row-major)

// What each output field extracts from the grid
export type SchemaFieldType =
  | "reelStops"   // 0/1 per cell (column-major)
  | "coin"        // positions of cells matching a coin type
  | "multiplier"  // positions of cells that have a multiplier
  | "coinPrize"   // custom tuple per landed coin — position(s) + prize + tags, in any order
  | "static"      // a fixed value
  | "custom";     // raw JS expression evaluated against grid (advanced)

// One element of a "coinPrize" output tuple. A parameter is built as an
// ordered list of these — e.g. [row, col, prizeValue, tag:"direction"]
// produces entries like [0,1,COIN_MINI,LEFT].
export type PrizePart =
  | { kind: "row" }
  | { kind: "col" }
  | { kind: "flatPosition" } // uses the grid's own Horizontal/Vertical order
  | { kind: "prizeValue"; valueType: "number" | "text" } // cell.value or cell.label
  | { kind: "tag"; tagName: string; options?: string[] } // cell.tags[tagName]
  | { kind: "static"; value: string | number };

export type SchemaField = {
  key: string;
  type: SchemaFieldType;

  // coin type filter (used when type === "coin")
  coinType?: string;

  // how positions are serialized (for coin, multiplier, reelStops)
  positionFormat?: PositionFormat;

  // whether to include value/multiplier after position
  includeValue?: boolean;
  includeMultiplier?: boolean;

  // static value
  staticValue?: any;

  // custom JS expression string — receives `grid`, `rows`, `cols`
  customExpr?: string;

  // if true, this field's positionFormat is kept in sync with the grid's
  // Horizontal/Vertical index-order selection, instead of being set manually.
  useGridOrder?: boolean;

  // ordered tuple recipe for type === "coinPrize"
  prizeTemplate?: PrizePart[];
};

export type OutputEntry = {
  spin: number;
  fields: Record<string, any>;
  raw: string;
};

// How the reel-stop sequence behaves across successive spins:
// "full":    every spin lists ALL grid positions (locked or not) — the classic
//            behavior, positions can repeat/carry forward each spin.
// "cascade": once a position lands a symbol, it's permanently removed from
//            the sequence in every following spin — the array shrinks over time.
export type SequenceMode = "full" | "cascade";

// ─── POSITION HELPERS ─────────────────────────────────────────────────────────

export function cellKey(row: number, col: number): string {
  return `${row},${col}`;
}

// Returns a new locked-set: the previous locked set plus every currently
// non-EMPTY cell in the grid. Call this once per committed spin (not on
// live preview) to advance the "cascade" sequencing mode.
export function lockedPositionsAfterSpin(grid: Cell[][], prevLocked: Set<string>): Set<string> {
  const next = new Set(prevLocked);
  for (let i = 0; i < grid.length; i++)
    for (let j = 0; j < (grid[i]?.length ?? 0); j++)
      if (grid[i][j].type !== "EMPTY") next.add(cellKey(i, j));
  return next;
}

export type ExtractContext = {
  sequenceMode?: SequenceMode;
  lockedPositions?: Set<string>;
  // Value written into the reelStops array for a landed/filled position.
  // Defaults to 1 if not provided.
  activeValue?: number;
  // Value written into the reelStops array for an empty/non-landed position.
  // Defaults to 0 if not provided.
  emptyValue?: number;
  // The grid's own Horizontal/Vertical order — used by "coinPrize" fields for
  // iteration order and any "flatPosition" part.
  positionOrder?: PositionOrder;
};

// Collects every distinct tag (name + suggested options) referenced by any
// coinPrize parameter, so the grid can render one input per tag.
export function collectTagDefs(fields: SchemaField[]): { name: string; options?: string[] }[] {
  const byName = new Map<string, string[] | undefined>();
  for (const f of fields) {
    if (f.type !== "coinPrize") continue;
    for (const part of f.prizeTemplate ?? []) {
      if (part.kind === "tag" && part.tagName.trim()) {
        const existing = byName.get(part.tagName) ?? [];
        const cleaned = (part.options ?? []).map(o => o.trim()).filter(Boolean);
        byName.set(part.tagName, [...new Set([...existing, ...cleaned])]);
      }
    }
  }
  return [...byName.entries()].map(([name, options]) => ({ name, options }));
}

export function formatPosition(
  col: number,
  row: number,
  rows: number,
  cols: number,
  format: PositionFormat
): number | number[] {
  switch (format) {
    case "colRow":         return [col, row];
    case "rowCol":         return [row, col];
    case "flatIndex":      return col * rows + row;
    case "flatIndexRowMajor": return row * cols + col;
    default:               return [col, row];
  }
}

// ─── FIELD EXTRACTION ─────────────────────────────────────────────────────────

export function extractField(
  grid: Cell[][],
  field: SchemaField,
  context: ExtractContext = {}
): any {
  const rows = grid.length;
  const cols = grid[0]?.length ?? 0;
  const posFormat = field.positionFormat ?? "colRow";

  switch (field.type) {
    case "reelStops": {
      // Only the flat formats carry an explicit orientation; colRow/rowCol
      // (pair-based formats) fall back to the original vertical/column-major walk.
      const horizontal = posFormat === "flatIndexRowMajor";
      const cellsInOrder: [number, number][] = [];
      if (horizontal) {
        for (let i = 0; i < rows; i++)
          for (let j = 0; j < cols; j++)
            cellsInOrder.push([i, j]);
      } else {
        for (let j = 0; j < cols; j++)
          for (let i = 0; i < rows; i++)
            cellsInOrder.push([i, j]);
      }

      const activeValue = context.activeValue ?? 1;
      const emptyValue = context.emptyValue ?? 0;

      if (context.sequenceMode === "cascade") {
        const locked = context.lockedPositions ?? new Set<string>();
        const stops: number[] = [];
        for (const [i, j] of cellsInOrder) {
          if (locked.has(cellKey(i, j))) continue; // already landed in a prior spin — drop entirely
          stops.push(grid[i][j].type !== "EMPTY" ? activeValue : emptyValue);
        }
        return stops;
      }

      return cellsInOrder.map(([i, j]) => (grid[i][j].type !== "EMPTY" ? activeValue : emptyValue));
    }

    case "coin": {
      const arr: any[] = [];
      for (let j = 0; j < cols; j++) {
        for (let i = 0; i < rows; i++) {
          const cell = grid[i][j];
          if (!field.coinType || cell.type === field.coinType) {
            const pos = formatPosition(j, i, rows, cols, posFormat);
            const entry: any[] = Array.isArray(pos) ? [...pos] : [pos];
            if (field.includeValue && cell.value !== undefined) entry.push(cell.value);
            arr.push(entry.length === 1 ? entry[0] : entry);
          }
        }
      }
      return arr;
    }

    case "multiplier": {
      const arr: any[] = [];
      for (let j = 0; j < cols; j++) {
        for (let i = 0; i < rows; i++) {
          const cell = grid[i][j];
          if (cell.multiplier !== undefined && cell.multiplier !== "") {
            const pos = formatPosition(j, i, rows, cols, posFormat);
            const entry: any[] = Array.isArray(pos) ? [...pos] : [pos];
            if (field.includeMultiplier) entry.push(cell.multiplier);
            arr.push(entry.length === 1 ? entry[0] : entry);
          }
        }
      }
      return arr;
    }

    case "coinPrize": {
      const template = field.prizeTemplate ?? [];
      const horizontal = context.positionOrder === "horizontal";
      const arr: any[] = [];

      const walk: [number, number][] = [];
      if (horizontal) {
        for (let i = 0; i < rows; i++) for (let j = 0; j < cols; j++) walk.push([i, j]);
      } else {
        for (let j = 0; j < cols; j++) for (let i = 0; i < rows; i++) walk.push([i, j]);
      }

      for (const [i, j] of walk) {
        const cell = grid[i][j];
        if (cell.type === "EMPTY") continue;
        if (field.coinType && cell.type !== field.coinType) continue;

        const entry = template.map(part => {
          switch (part.kind) {
            case "row": return i;
            case "col": return j;
            case "flatPosition": return horizontal ? i * cols + j : j * rows + i;
            case "prizeValue": return part.valueType === "text" ? (cell.label ?? "") : (cell.value ?? 0);
            case "tag": return cell.tags?.[part.tagName] ?? "";
            case "static": return part.value;
            default: return null;
          }
        });
        arr.push(entry);
      }
      return arr;
    }

    case "static":
      return field.staticValue ?? null;

    case "custom": {
      try {
        // eslint-disable-next-line no-new-func
        return new Function("grid", "rows", "cols", `return (${field.customExpr})`)(grid, rows, cols);
      } catch {
        return "ERROR";
      }
    }

    default:
      return null;
  }
}

// ─── SCHEMA → OUTPUT STRING ───────────────────────────────────────────────────

export function generateFromSchema(
  grid: Cell[][],
  fields: SchemaField[],
  context: ExtractContext = {}
): { data: Record<string, any>; text: string } {
  const data: Record<string, any> = {};
  for (const field of fields) {
    data[field.key] = extractField(grid, field, context);
  }

  const text = `[${Object.entries(data)
    .map(([k, v]) => `${k}:${JSON.stringify(v)}`)
    .join(",\n")}]`;

  return { data, text };
}

// ─── SPIN ENGINE ──────────────────────────────────────────────────────────────

export function runSpin({ grid }: { grid: Cell[][] }): Cell[][] {
  return grid.map(row => row.map(cell => ({ ...cell })));
}

// ─── DEFAULT SCHEMA ───────────────────────────────────────────────────────────

export const DEFAULT_FIELDS: SchemaField[] = [
  {
    key: "reelStopPositions",
    type: "reelStops",
    positionFormat: "colRow",
  },
  {
    key: "goldCoin",
    type: "coin",
    coinType: "GOLD",
    positionFormat: "colRow",
    includeValue: true,
  },
  {
    key: "redCoin",
    type: "coin",
    coinType: "RED",
    positionFormat: "colRow",
    includeValue: false,
  },
  {
    key: "multiplierValue",
    type: "multiplier",
    positionFormat: "colRow",
    includeMultiplier: true,
  },
  {
    key: "additionalFeatureTriggered",
    type: "static",
    staticValue: false,
  },
];