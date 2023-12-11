import exp from "constants";

const txtFile = Bun.file("./day11.txt");

const SPACE = ".";
const GALAXY = "#";

type Universe = (typeof SPACE | typeof GALAXY)[][];
type Coordinate = [number, number];

const findGalaxyCoordinates = (universe: Universe): Coordinate[] => {
  const coords: Coordinate[] = [];
  for (let i = 0; i < universe.length; i++) {
    for (let j = 0; j < universe[i].length; j++) {
      if (universe[i][j] === GALAXY) {
        coords.push([i, j]);
      }
    }
  }

  return coords;
};

const getExpansionMap = (points: number[], factor) => {
  const ps = Array.from(new Set(points)).sort((a, b) => a - b);

  const mapP: Map<number, number> = new Map();
  for (let i = 0; i < ps.length; i++) {
    mapP.set(ps[i], ps[i]);
  }

  let pI = 0;

  while (pI < ps.length - 1) {
    const diff = ps[pI + 1] - ps[pI] - 1;
    if (diff > 0) {
      for (let i = pI + 1; i < ps.length; i++) {
        mapP.set(ps[i], mapP.get(ps[i]) + (diff * factor - 1));
      }
    }

    pI += 1;
  }

  return mapP;
};

const getExpandedGalaxyCoordinates = (
  initialCoords: Coordinate[],
  factor = 1
) => {
  const ys = initialCoords.map((coord) => coord[0]);
  const xs = initialCoords.map((coord) => coord[1]);

  const [expandedMapY, expandedMapX] = [
    getExpansionMap(ys, factor),
    getExpansionMap(xs, factor),
  ];
  return initialCoords.map((coord) => [
    expandedMapY.get(coord[0]),
    expandedMapX.get(coord[1]),
  ]);
};

const findShortestSteps = (coord1: Coordinate, coord2: Coordinate): number =>
  Math.abs(coord1[0] - coord2[0]) + Math.abs(coord1[1] - coord2[1]);

const findShortestSum = (coords: Coordinate[], acc = 0): number => {
  if (coords.length === 0) {
    return acc;
  }

  let sum = 0;
  for (let i = 1; i < coords.length; i++) {
    const [y1, y2] = [coords[0][0], coords[i][0]];
    const [x1, x2] = [coords[0][1], coords[i][1]];

    sum += findShortestSteps([y1, x1], [y2, x2]);
  }
  coords.shift();

  return findShortestSum(coords, acc + sum);
};

await txtFile.text().then((input) => {
  const galaxyCoordinates = findGalaxyCoordinates(
    input.split("\n").map((line) => line.split("")) as Universe
  );

  console.log(
    "Part 1: ",
    findShortestSum(getExpandedGalaxyCoordinates(galaxyCoordinates, 2))
  );
  console.log(
    "Part 2: ",
    findShortestSum(getExpandedGalaxyCoordinates(galaxyCoordinates, 100000))
  );
});
