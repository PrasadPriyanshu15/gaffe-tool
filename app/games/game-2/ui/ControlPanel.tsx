"use client";

import { useState } from "react";
import { FeatureConfig, CoinConfig } from "../types";

type Props = {
  onCreate: (config: FeatureConfig) => void;
};

const ALL_COINS: CoinConfig[] = [
  { name: "RED", color: "red", hasMultiplier: true },
  { name: "GOLD", color: "gold", hasValue: true },
  { name: "BLUE", color: "blue" },
  { name: "PURPLE", color: "purple", hasValue: true },
  { name: "COLORED SCAT", color: "coloredScat", hasValue: true },
];

export default function ControlPanel({ onCreate }: Props) {
  const [rows, setRows] = useState(4);
  const [cols, setCols] = useState(5);
  const [selectedCoins, setSelectedCoins] = useState<CoinConfig[]>([]);

  const toggleCoin = (coin: CoinConfig) => {
    setSelectedCoins(prev => {
      const exists = prev.find(c => c.name === coin.name);
      if (exists) return prev.filter(c => c.name !== coin.name);
      return [...prev, coin];
    });
  };

  const handleCreate = () => {
    if (selectedCoins.length === 0) return;

    onCreate({
      rows,
      cols,
      spins: 3,
      coins: [{ name: "EMPTY", color: "gray" }, ...selectedCoins],
    });
  };

  return (
    <div className="mb-4 space-y-3">

      {/* GRID SIZE */}
      <div className="flex gap-2">
        <input
          type="number"
          value={rows}
          onChange={e => setRows(Number(e.target.value))}
          className="border px-2"
        />
        <input
          type="number"
          value={cols}
          onChange={e => setCols(Number(e.target.value))}
          className="border px-2"
        />
      </div>

      {/* COIN SELECT */}
      <div className="flex gap-2 flex-wrap">
        {ALL_COINS.map(c => {
          const selected = selectedCoins.find(sc => sc.name === c.name);

          return (
            <button
              key={c.name}
              onClick={() => toggleCoin(c)}
              className={`px-3 py-1 rounded border ${
                selected ? "bg-green-500 text-white" : "bg-gray-300"
              }`}
            >
              {c.name}
            </button>
          );
        })}
      </div>

      <button
        onClick={handleCreate}
        className="bg-blue-500 text-white px-4 py-2 rounded"
      >
        Create Grid
      </button>
    </div>
  );
}