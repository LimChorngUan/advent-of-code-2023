const txtFile = Bun.file("./day18.txt");

type Direction = (typeof DIRECTION)[keyof typeof DIRECTION];
type Y = number;
type X = number;
type Coordinate = [Y, X];
type Step = {
  direction: Direction;
  count: number;
};

const DIRECTION = {
  up: "U",
  down: "D",
  left: "L",
  right: "R",
} as const;

const DIRECTION_MAP = {
  0: DIRECTION.right,
  1: DIRECTION.down,
  2: DIRECTION.left,
  3: DIRECTION.up,
};

const UNIT_VECTOR: Record<Direction, Coordinate> = {
  [DIRECTION.up]: [-1, 0],
  [DIRECTION.down]: [1, 0],
  [DIRECTION.left]: [0, -1],
  [DIRECTION.right]: [0, 1],
};

const parseP1 = (input: string) =>
  input
    .split("\n")
    .map((line) => line.split(" "))
    .map((line) => ({
      direction: line[0] as Direction,
      count: parseInt(line[1]),
    }));

const parseP2 = (input: string) =>
  input
    .split("\n")
    .map((line) => line.split(" "))
    .map((line) => {
      const hex = line[2].substring(2, 8);
      const direction = DIRECTION_MAP[hex[hex.length - 1]];
      const count = parseInt(hex.substring(0, 5), 16);

      return {
        direction,
        count,
      };
    });

const findPolygonVertices = (steps: Step[]): Coordinate[] =>
  steps.reduce(
    (acc, curr, i) => {
      const newVertices = [
        [
          acc[i][0] + UNIT_VECTOR[curr.direction][0] * curr.count,
          acc[i][1] + UNIT_VECTOR[curr.direction][1] * curr.count,
        ],
      ];
      return acc.concat(newVertices);
    },

    [[0, 0]]
  );

const findEdgesArea = (steps: Step[]) =>
  steps.reduce((acc, curr) => acc + curr.count, 0);

const findPolygonArea = (vertices: Coordinate[]): number => {
  let sum = 0;
  const n = vertices.length;

  for (let i = 0; i < n; i++) {
    const [y1, y2] = [vertices[i][0], vertices[(i + 1) % n][0]];
    const [x1, x2] = [vertices[i][1], vertices[(i + 1) % n][1]];

    sum = sum + (y1 + y2) * (x1 - x2);
  }

  return Math.abs(sum / 2);
};

const findTotalArea = (steps: Step[]) =>
  findEdgesArea(steps) +
  (findPolygonArea(findPolygonVertices(steps)) - findEdgesArea(steps) / 2 + 1);

await txtFile.text().then((input) => {
  const p1 = findTotalArea(parseP1(input));
  const p2 = findTotalArea(parseP2(input))

  console.log("Part 1: ", p1);
  console.log("Part 2: ", p2);
});
