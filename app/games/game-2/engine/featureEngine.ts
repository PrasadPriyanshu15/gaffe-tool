import { Cell } from "../types";

export function runSpin({
  grid,
}: {
  grid: Cell[][];
}) {
  // for now just return same grid (no mechanics yet)
  return grid.map(row => row.map(cell => ({ ...cell })));
}