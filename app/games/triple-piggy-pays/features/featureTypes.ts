// featureTypes.ts
// Shared types for all feature handlers and feature1.tsx.

export type FeatureType = "WHEEL" | "TOWER" | "ZONE";
export type MultiplierType = number | "MAJOR" | "GRAND";

export type Cell =
  | { type: "EMPTY" }
  | { type: "GOLD";    value?: number; locked?: boolean }
  | { type: "RED";     value?: number; multiplier?: MultiplierType }
  | { type: "BLUE";    value?: number }
  | { type: "PURPLE";  value?: number }
  | { type: "TRIGGER"; triggerColor?: "BLUE" | "PURPLE" };

export type Grid = Cell[][];