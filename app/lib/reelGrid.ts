/**
 * Shared visible-grid mapping for the uploaded-reelstrip base game.
 *
 * The base grid is dynamic:
 *   - columns  = number of reels in the uploaded file
 *   - rows     = one global row count the tester sets
 *   - offset   = one global "anchor row" (0 … rows-1): the row at which the
 *                strip is processed. Each reel's `stop` symbol lands on this
 *                row; rows above it show the earlier strip symbols and rows
 *                below show the later ones (the strip wraps — no empty rows).
 *
 * So for row r:  stripIndex = stop + (r - offset)   (mod strip length).
 */
export type VisibleCell = {
  row: number;
  stripIndex: number | null; // null only when the strip is empty
  symbol: string | null;
};

/** Clamp the global offset into the valid 0 … rows-1 range. */
export function clampOffset(offset: number, rows: number): number {
  if (rows <= 0) return 0;
  return Math.max(0, Math.min(offset, rows - 1));
}

/** The visible cells for one reel, top (row 0) to bottom (row rows-1). */
export function visibleCells(
  reel: string[],
  stop: number,
  offset: number,
  rows: number
): VisibleCell[] {
  const len = reel?.length ?? 0;
  const off = clampOffset(offset, rows);
  const out: VisibleCell[] = [];
  for (let row = 0; row < rows; row++) {
    if (len === 0) {
      out.push({ row, stripIndex: null, symbol: null });
      continue;
    }
    const idx = (((stop + (row - off)) % len) + len) % len;
    out.push({ row, stripIndex: idx, symbol: reel[idx] });
  }
  return out;
}
