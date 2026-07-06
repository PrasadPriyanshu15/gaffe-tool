

/* eslint-disable @typescript-eslint/no-explicit-any */

// ─── TYPES ────────────────────────────────────────────────────────────────────

export type Cell = {
  type: string;
  value?: number;
  multiplier?: number | string;
};

export type CoinConfig = {
  name: string;
  color: string;
  hasValue?: boolean;
  hasMultiplier?: boolean;
};

export type FeatureConfig = {
  rows: number;
  cols: number;
  coins: CoinConfig[];
  spins: number;
};

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
  | "static"      // a fixed value
  | "custom";     // raw JS expression evaluated against grid (advanced)

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
};

export type OutputEntry = {
  spin: number;
  fields: Record<string, any>;
  raw: string;
};

// ─── POSITION HELPERS ─────────────────────────────────────────────────────────

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
  field: SchemaField
): any {
  const rows = grid.length;
  const cols = grid[0]?.length ?? 0;
  const posFormat = field.positionFormat ?? "colRow";

  switch (field.type) {
    case "reelStops": {
      const stops: number[] = [];
      for (let j = 0; j < cols; j++)
        for (let i = 0; i < rows; i++)
          stops.push(grid[i][j].type !== "EMPTY" ? 1 : 0);
      return stops;
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
  fields: SchemaField[]
): { data: Record<string, any>; text: string } {
  const data: Record<string, any> = {};
  for (const field of fields) {
    data[field.key] = extractField(grid, field);
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