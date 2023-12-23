const txtFile = Bun.file("./day21.txt");

type Y = number;
type X = number;
type Coordinate = [Y, X];

const STONE = "#";
const EMPTY = ".";
const START = "S";

type Grid = (typeof STONE | typeof EMPTY | typeof START)[][];

const walk = (
  grid: Grid,
  maxSteps: number,
  coords: Coordinate[],
  stepCount = 0
): Coordinate[] => {
  if (stepCount === maxSteps) return coords;

  let possibleCords: Coordinate[] = [];
  for (let i = 0; i < coords.length; i++) {
    const [y, x] = coords[i];
    const nextPossibleCoords = [
      [y - 1, x],
      [y + 1, x],
      [y, x - 1],
      [y, x + 1],
    ].filter(
      ([nextY, nextX]) =>
        nextY >= 0 &&
        nextX >= 0 &&
        nextY < grid.length &&
        nextX < grid[0].length &&
        grid[nextY][nextX] !== STONE
    ) as Coordinate[];

    possibleCords.push(...nextPossibleCoords);
  }

  const newCoords = Array.from(
    new Set(possibleCords.map((coord) => coord.join(",")))
  ).map((s) => s.split(",").map((el) => parseInt(el))) as Coordinate[];

  return walk(grid, maxSteps, newCoords, stepCount + 1);
};

await txtFile.text().then((input) => {
  const grid = input.split("\n").map((line) => line.split("")) as Grid;
  const startingCoord: Coordinate = grid.reduce(
    (acc, row, rowI) =>
      row.includes(START) ? [rowI, row.findIndex((el) => el === START)] : acc,
    [0, 0]
  );

  const p1 = walk(grid, 64, [[...startingCoord]]).length;

  console.log("Part 1: ", p1);
});
