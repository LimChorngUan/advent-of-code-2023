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
  grid: Grid,
  beams: Map<number, Vector[]>,
  maxBeamI: number,
  energizedCoords: [Y, X][]
) => {
  const newEnergizedCoords: [Y, X][] = [];
  const beamsIterator = beams.entries();
  const newBeams = new Map(beamsIterator);
  let newMaxBeamI = maxBeamI;

  for (const beam of beams) {
    const [beamN, beamVectors] = beam;
    const [currY, currX, currDir] = beamVectors[beamVectors.length - 1];
    const currGridType = grid[currY][currX];

    const nextVectors: Vector[] = GRID_TYPE_TO_DIR[currGridType][currDir]
      .map(
        (nextDir) =>
          [
            currY + DIRECTION_TO_COOR_MAP[nextDir][0],
            currX + DIRECTION_TO_COOR_MAP[nextDir][1],
            nextDir,
          ] as Vector
      )
      .filter(([nextY, nextX, nextDir]) => {
        const outOfGrid =
          nextY < 0 ||
          nextY >= grid.length ||
          nextX < 0 ||
          nextX >= grid[0].length;
        const isLoop = beamVectors.some(
          (vector) =>
            vector[0] === nextY && vector[1] === nextX && vector[2] === nextDir
        );

        return !outOfGrid && !isLoop;
      });

    if (nextVectors.length === 0) {
      newBeams.delete(beamN);
      break;
    } else {
      newBeams.set(beamN, [...beamVectors, nextVectors[0]]);
      newEnergizedCoords.push([nextVectors[0][0], nextVectors[0][1]]);
    }

    if (nextVectors.length === 2) {
      newBeams.set(newMaxBeamI + 1, [...beamVectors, nextVectors[1]]);
      newEnergizedCoords.push([nextVectors[1][0], nextVectors[1][1]]);
      newMaxBeamI += 1
    }
  }

  if (newBeams.size === 0) return energizedCoords;

  return walk(grid, newBeams,newMaxBeamI, [...energizedCoords, ...newEnergizedCoords]);
};

await txtFile.text().then((input) => {
  const grid = input.split("\n").map((line) => line.split("")) as Grid;
  const initVector = [0, 0, DIRECTION.right];
  const initBeams = new Map();
  initBeams.set(0, [initVector]);

  const energizedCoords = walk(grid, initBeams, 0, [[0, 0]]);
  const energizedGridSize = grid
    .map((row, rowI) =>
      row.map((col, colI) =>
        energizedCoords.some(([y, x]) => y === rowI && x === colI) ? "#" : "."
      )
    )
    .reduce(
      (acc, curr) =>
        acc + curr.reduce((sum, tile) => sum + (tile === "#" ? 1 : 0), 0),
      0
    );

  console.log("Part 1: ", energizedGridSize);
});
