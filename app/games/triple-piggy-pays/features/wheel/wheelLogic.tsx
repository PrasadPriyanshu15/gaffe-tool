// app/games/triple-piggy-pays/features/wheel/wheelLogic.ts

type MultiplierType = number | "MAJOR" | "GRAND";

type Cell =
  | { type: "EMPTY" }
  | { type: "GOLD"; value?: number; locked?: boolean }
  | { type: "RED"; value?: number; multiplier?: MultiplierType }
  | { type: "TRIGGER"; triggerColor?: "BLUE" | "PURPLE" };

export function runWheelFeature(grid: Cell[][]) {
  const output: string[] = [];

  const redCount = grid.flat().filter(c => c.type === "RED").length;
  const triggerExists = grid.flat().some(c => c.type === "TRIGGER");

  if (redCount >= 12 && !triggerExists) {
    output.push("WHEEL: RED FULL → TRIGGER AVAILABLE");
  }

  return { output };
}