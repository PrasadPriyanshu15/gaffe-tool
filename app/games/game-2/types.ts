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