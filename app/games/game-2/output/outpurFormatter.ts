/* eslint-disable @typescript-eslint/no-explicit-any */
// /* eslint-disable @typescript-eslint/no-explicit-any */

// import { Cell } from "../types";

// export function generateCustomOutput(
//   grid: Cell[][],
//   mapping: Record<string, string>
// ) {
//   const result: Record<string, any[]> = {};
//   const reelStopPositions: number[] = [];

//   const rows = grid.length;
//   const cols = grid[0].length;

//   for (let j = 0; j < cols; j++) {
//     for (let i = 0; i < rows; i++) {
//       const cell = grid[i][j];

//       // reel stops
//       reelStopPositions.push(cell.type !== "EMPTY" ? 1 : 0);

//       if (cell.type !== "EMPTY") {
//         const key = mapping[cell.type];

//         if (key) {
//           if (!result[key]) result[key] = [];
//           result[key].push([j, i, cell.value ?? 0]);
//         }

//         if (cell.multiplier) {
//           if (!result["multiplierValue"]) result["multiplierValue"] = [];
//           result["multiplierValue"].push([j, i, cell.multiplier]);
//         }
//       }
//     }
//   }

//   return `[reelStopPositions:[${reelStopPositions.join(",")}],
// ${Object.entries(result)
//   .map(([k, v]) => `${k}:${JSON.stringify(v)}`)
//   .join(",\n")},
// additionalFeatureTriggered:false]`;
// }



import { Cell } from "../types";

type SchemaField =
  | { type: "reelStops" }
  | { type: "coin"; coinType: string }
  | { type: "multiplier" }
  | { type: "static"; value: any };

export function generateFromSchema(
  grid: Cell[][],
  schema: Record<string, SchemaField>
) {
  const rows = grid.length;
  const cols = grid[0].length;

  const result: Record<string, any> = {};

  Object.entries(schema).forEach(([key, config]) => {
    // 🎯 REEL STOPS
    if (config.type === "reelStops") {
      const stops: number[] = [];

      for (let j = 0; j < cols; j++) {
        for (let i = 0; i < rows; i++) {
          stops.push(grid[i][j].type !== "EMPTY" ? 1 : 0);
        }
      }

      result[key] = stops;
    }

    // 🎯 COINS
    if (config.type === "coin") {
      const arr: number[][] = [];

      for (let j = 0; j < cols; j++) {
        for (let i = 0; i < rows; i++) {
          const cell = grid[i][j];

          if (cell.type === config.coinType) {
            arr.push([j, i, cell.value ?? 0]);
          }
        }
      }

      result[key] = arr;
    }



    // // 🎯 COINS
    // if (config.type === "coin") {
    //   const arr: number[][] = [];

    //   for (let j = 0; j < cols; j++) {
    //     for (let i = 0; i < rows; i++) {
    //       const cell = grid[i][j];

    //       if (cell.type === config.coinType) {
    //         arr.push([j, i, cell.value ?? 0]);
    //       }
    //     }
    //   }

    //   result[key] = arr;
    // }
    
    
    
    // // 🎯 LANDED COIN BONUS BOOST
    // if (config.type === "coin") {
    //   const arr: number[] = [];
      
    //   for (let j = 0; j < cols; j++) {
        
    //     for (let i = 0; i < rows; i++) {
    //       const index = j * grid.length + i + 1;
    //       arr.push(index)
    //     }
    //   }

    //   result[key] = arr;
    // }

    // 🎯 MULTIPLIER
    if (config.type === "multiplier") {
      const arr: any[][] = [];

      for (let j = 0; j < cols; j++) {
        for (let i = 0; i < rows; i++) {
          const cell = grid[i][j];

          if (cell.multiplier) {
            arr.push([j, i, cell.multiplier]);
          }
        }
      }

      result[key] = arr;
    }

    // 🎯 STATIC
    if (config.type === "static") {
      result[key] = config.value;
    }
  });

  // convert to gaffe string
  return `[${Object.entries(result)
    .map(([k, v]) => `${k}:${JSON.stringify(v)}`)
    .join(",\n")}]`;
}