"use client";

import { Cell, CoinConfig } from "../types";

type Props = {
  grid: Cell[][];
  setGrid: React.Dispatch<React.SetStateAction<Cell[][]>>;
  coins: CoinConfig[];
};

const coinEmoji: Record<string, string> = {
  EMPTY: "",
  GOLD: "🟡",
  RED: "🔴",
  BLUE: "🔵",
  PURPLE: "🟣",
};

export default function GenericGrid({ grid, setGrid, coins }: Props) {

  const handleClick = (i: number, j: number) => {
    setGrid(prev => {
      const newGrid = prev.map(row => row.map(cell => ({ ...cell })));

      const current = newGrid[i][j];
      const index = coins.findIndex(c => c.name === current.type);
      const next = coins[(index + 1) % coins.length];

      newGrid[i][j] = {
        type: next.name,
        value: next.hasValue ? 100 : undefined,
        multiplier: undefined,
      };

      return newGrid;
    });
  };

  return (
    <div className="bg-gray-800 p-6 rounded-2xl shadow-xl border border-gray-700">

      <div
        className="grid gap-4 justify-center"
        style={{
          gridTemplateColumns: `repeat(${grid[0].length}, 90px)`
        }}
      >
        {grid.map((row, i) =>
          row.map((cell, j) => {
            const index = j * grid.length + i + 1;

            return (
              <div
                key={`${i}-${j}`}
                onClick={() => handleClick(i, j)}
                className="
                  w-22 h-22
                  bg-gray-700
                  hover:bg-gray-600
                  text-white
                  rounded-xl
                  flex flex-col items-center justify-center
                  cursor-pointer
                  transition-all duration-150
                  shadow-md
                  hover:scale-105
                "
              >
                {/* INDEX */}
                <div className="text-[10px] opacity-70">
                  {index}
                </div>

                {/* COORDS */}
                <div className="text-[10px] opacity-50">
                  ({j},{i})
                </div>

                {/* EMOJI */}
                <div className="text-xl mt-1">
                  {coinEmoji[cell.type] || ""}
                </div>

                {/* VALUE */}
                {cell.value !== undefined && (
                  <input
                    type="number"
                    value={cell.value}
                    onClick={e => e.stopPropagation()}
                    onChange={e => {
                      const val = Number(e.target.value);
                      setGrid(prev => {
                        const newGrid = prev.map(r => r.map(c => ({ ...c })));
                        newGrid[i][j].value = val;
                        return newGrid;
                      });
                    }}
                    className="
                      w-14 mt-1 text-xs text-center
                      bg-gray-900 text-white
                      rounded border border-gray-600
                    "
                  />
                )}

                {/* MULTIPLIER */}
                {cell.type === "RED" && (
                  <input
                    type="text"
                    placeholder="x"
                    onClick={e => e.stopPropagation()}
                    onChange={e => {
                      const val = e.target.value;
                      setGrid(prev => {
                        const newGrid = prev.map(r => r.map(c => ({ ...c })));
                        newGrid[i][j].multiplier = val;
                        return newGrid;
                      });
                    }}
                    className="
                      w-14 mt-1 text-xs text-center
                      bg-gray-900 text-white
                      rounded border border-gray-600
                    "
                  />
                )}
              </div>
            );
          })
        )}
      </div>
    </div>
  );
}