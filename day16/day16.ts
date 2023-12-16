const txtFile = Bun.file("./day16.txt");

const GRID_TYPE = {
  space: ".",
  mirror_top_right: "/",
  mirror_top_left: "\\",
  hor_splitter: "-",
  ver_splitter: "|",
  energized: "#",
} as const;

const DIRECTION = {
  right: "right",
  left: "left",
  up: "up",
  down: "down",
} as const;

const GRID_TYPE_TO_DIR: Record<GridType, Record<Direction, Direction[]>> = {
  [GRID_TYPE.space]: {
    [DIRECTION.right]: [DIRECTION.right],
    [DIRECTION.left]: [DIRECTION.left],
    [DIRECTION.up]: [DIRECTION.up],
    [DIRECTION.down]: [DIRECTION.down],
  },
  [GRID_TYPE.mirror_top_right]: {
    [DIRECTION.right]: [DIRECTION.up],
    [DIRECTION.left]: [DIRECTION.down],
    [DIRECTION.up]: [DIRECTION.right],
    [DIRECTION.down]: [DIRECTION.left],
  },
  [GRID_TYPE.mirror_top_left]: {
    [DIRECTION.right]: [DIRECTION.down],
    [DIRECTION.left]: [DIRECTION.up],
    [DIRECTION.up]: [DIRECTION.left],
    [DIRECTION.down]: [DIRECTION.right],
  },
  [GRID_TYPE.hor_splitter]: {
    [DIRECTION.right]: [DIRECTION.right],
    [DIRECTION.left]: [DIRECTION.left],
    [DIRECTION.up]: [DIRECTION.left, DIRECTION.right],
    [DIRECTION.down]: [DIRECTION.left, DIRECTION.right],
  },
  [GRID_TYPE.ver_splitter]: {
    [DIRECTION.right]: [DIRECTION.up, DIRECTION.down],
    [DIRECTION.left]: [DIRECTION.up, DIRECTION.down],
    [DIRECTION.up]: [DIRECTION.up],
    [DIRECTION.down]: [DIRECTION.down],
  },
};

const DIRECTION_TO_COOR_MAP: Record<Direction, [Y, X]> = {
  [DIRECTION.right]: [0, 1],
  [DIRECTION.left]: [0, -1],
  [DIRECTION.up]: [-1, 0],
  [DIRECTION.down]: [1, 0],
};

type GridType = (typeof GRID_TYPE)[keyof typeof GRID_TYPE];
type Grid = GridType[][];
type Direction = (typeof DIRECTION)[keyof typeof DIRECTION];
type Y = number;
type X = number;
type Vector = [Y, X, Direction];

const walk = (
  mirrorGrid: Grid,
  currEnergizedGrid: Grid,
  currCoords: Vector[] = [[0, 0, DIRECTION.right]],
  i = 0
): Grid => {
  const nextCoords = currCoords
    .flatMap(([y, x, dir]) => {
      const gridType: GridType = mirrorGrid[y][x];
      const next: Vector[] = GRID_TYPE_TO_DIR[gridType][dir].map((nextDir) => [
        y + DIRECTION_TO_COOR_MAP[nextDir][0],
        x + DIRECTION_TO_COOR_MAP[nextDir][1],
        nextDir,
      ]);

      return next;
    })
    .filter(
      ([y, x]) =>
        y >= 0 && y < mirrorGrid.length && x >= 0 && x < mirrorGrid[0].length
    );

console.log('nextCoords', nextCoords)

  const nextEnergizedGrid = currEnergizedGrid.map((row) =>
    row.map((col) => col)
  );
  nextCoords.forEach(([nextY, nextX]) => {
    nextEnergizedGrid[nextY].splice(nextX, 1, GRID_TYPE.energized);
  });

  // if (nextEnergizedGrid.join() === currEnergizedGrid.join())
  //   return nextEnergizedGrid;

  if (i === 50)
    return nextEnergizedGrid;
  return walk(mirrorGrid, nextEnergizedGrid, nextCoords, i + 1);
};

await txtFile.text().then((input) => {
  const grid = input.split("\n").map((line) => line.split("")) as Grid;
  const initEnergizedGrid = grid.map((row) => row.map((_) => ".")) as Grid;
  const initCoords: Vector[] = [[0, 0, DIRECTION.right]];
  initEnergizedGrid[0][0] = "#";

  const finalEnergizedGrid = walk(grid, initEnergizedGrid, initCoords);
  console.log(finalEnergizedGrid);

  const p1 = finalEnergizedGrid
    .join("")
    .split("")
    .reduce((acc, curr) => acc + (curr === GRID_TYPE.energized ? 1 : 0), 0);

  console.log("Part 1: ", p1);
});
