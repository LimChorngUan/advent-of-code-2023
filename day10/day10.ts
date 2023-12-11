const txtFile = Bun.file("./day10.txt");

const DIR = {
  up: 0,
  down: 1,
  left: 2,
  right: 3,
} as const;
type Direction = (typeof DIR)[keyof typeof DIR];

const TILE = {
  "|": 0,
  "-": 1,
  L: 2,
  J: 3,
  "7": 4,
  F: 5,
  S: 6,
  ".": 7,
} as const;
type Tile = (typeof TILE)[keyof typeof TILE];

type Tiles = Tile[][];

const STEP_TABLE = [
  [[-1, 0, DIR.up], [1, 0, DIR.down], null, null],
  [null, null, [0, -1, DIR.left], [0, 1, DIR.right]],
  [null, [0, 1, DIR.right], [-1, 0, DIR.up], null],
  [null, [0, -1, DIR.left], null, [-1, 0, DIR.up]],
  [[0, -1, DIR.left], null, null, [1, 0, DIR.down]],
  [[0, 1, DIR.right], null, [1, 0, DIR.down], null],
  [
    [-1, 0, DIR.up],
    [1, 0, DIR.down],
    [0, -1, DIR.left],
    [0, 1, DIR.right],
  ],
  [null, null, null, null],
];

const findStartingTile = (tiles: Tiles, y = 0): [number, number] => {
  const startX = tiles[y].findIndex((el) => el === TILE.S);

  return startX !== -1 ? [y, startX] : findStartingTile(tiles, y + 1);
};

const findNextTile = (
  tiles: Tiles,
  currY: number,
  currX: number,
  currDir: Direction
): [number, number, Direction] | undefined => {
  const next = STEP_TABLE[tiles[currY][currX]][currDir];

  if (!next) return;

  const nextY = currY + next[0];
  const nextX = currX + next[1];

  if (nextY < 0 || nextY >= tiles.length) return;
  if (nextX < 0 || nextX >= tiles[0].length) return;

  return [currY + next[0], currX + next[1], next[2] as Direction];
};

const walk = (
  tiles: Tiles,
  [yStart, xStart]: [number, number],
  [currY, currX, currDir]: [number, number, Direction],
  stepCount: number = 0,
  vertices: number[][] = []
): [number, number[][]] | undefined => {
  const next = findNextTile(tiles, currY, currX, currDir);

  if (!next) return;

  if (next[0] === yStart && next[1] === xStart) {
    vertices.push([next[0], next[1]]);
    return [stepCount + 1, vertices];
  }

  const nextTile: Tile = tiles[next[0]][next[1]];
  if (nextTile !== TILE["-"] && nextTile !== TILE["|"]) {
    vertices.push([next[0], next[1]]);
  }

  return walk(tiles, [yStart, xStart], [...next], stepCount + 1, vertices);
};

const findPolygonArea = (vertices: number[][]) => {
  let sum = 0;
  const n = vertices.length;

  for (let i = 0; i < n; i++) {
    const [y1, y2] = [vertices[i][0], vertices[(i + 1) % n][0]];
    const [x1, x2] = [vertices[i][1], vertices[(i + 1) % n][1]];

    sum = sum + (y1 + y2) * (x1 - x2);
  }

  return Math.abs(sum / 2);
};

await txtFile.text().then((input) => {
  const tiles = input
    .split("\n")
    .map((line) => line.split("").map((tile) => TILE[tile]));

  const [yStart, xStart] = findStartingTile(tiles, 0);
  const [totalSteps, vertices] = Object.values(DIR)
    .map((startDir) =>
      walk(tiles, [yStart, xStart], [yStart, xStart, startDir], 0)
    )
    .filter(Boolean)[0];

  const p1 = totalSteps / 2;
  const p2 = Math.abs(findPolygonArea(vertices) - totalSteps / 2) + 1;

  console.log("!! p1", p1);
  console.log("!! p2", p2);
});
