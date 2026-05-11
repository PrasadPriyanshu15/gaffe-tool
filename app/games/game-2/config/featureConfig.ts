export type CoinTypeConfig = {
  name: string;          // "GOLD", "PURPLE"
  color: string;         // UI color
  hasValue?: boolean;
  hasMultiplier?: boolean;
};

export type FeatureConfig = {
  grid: {
    rows: number;
    cols: number;
  };

  coins: CoinTypeConfig[];

  mechanics: {
    maxCoins?: number;
    allowMultipliers?: boolean;
    allowZones?: boolean;
    allowUpgrade?: boolean;
  };

  spins: number;

  output: {
    fields: string[]; // ["goldCoin", "purpleCoin", "reelStopPositions"]
  };
};