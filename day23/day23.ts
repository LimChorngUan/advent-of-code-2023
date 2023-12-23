const txtFile = Bun.file("./day23.txt");

type Coordinate = { y: number; x: number };

type Path = {
  prevCoord: Coordinate;
  currCoord: Coordinate;
  steps: number;
};

const walk = (
  grid: string[][],
  endCoord: Coordinate,
  paths: Path[]
): Path[] => {
  const endPaths = paths.filter(
    (path) => path.currCoord.y === endCoord.y && path.currCoord.x === endCoord.x
  );

  if (endPaths.length === paths.length) return paths;

  const newPaths: Path[] = [];

  for (let i = 0; i < paths.length; i++) {
    const currPath = paths[i];
    const { y, x } = currPath.currCoord;

    const up = { y: y - 1, x: x };
    const down = { y: y + 1, x: x };
    const left = { y: y, x: x - 1 };
    const right = { y: y, x: x + 1 };

    const nextPossibleCoords = [
      up.y >= 0 && (grid[up.y][up.x] === "." || grid[up.y][up.x] === "^") && up,
      down.y < grid.length &&
        (grid[down.y][down.x] === "." || grid[down.y][down.x] === "v") &&
        down,
      left.x >= 0 &&
        (grid[left.y][left.x] === "." || grid[left.y][left.x] === "<") &&
        left,
      right.x < grid[0].length &&
        (grid[right.y][right.x] === "." || grid[right.y][right.x] === ">") &&
        right,
    ]
      .filter(Boolean)
      .filter(
        (next) =>
          !(
            (next.y === currPath.prevCoord.y &&
              next.x === currPath.prevCoord.x) ||
            grid[next.y][next.x] === "#"
          )
      );

    nextPossibleCoords.forEach((nextCoord) => {
      newPaths.push({
        prevCoord: { y, x },
        currCoord: { y: nextCoord.y, x: nextCoord.x },
        steps: currPath.steps + 1,
      });
    });
  }

  return walk(grid, endCoord, [...endPaths, ...newPaths]);
};

await txtFile.text().then((input) => {
  const grid = input.split("\n").map((line) => line.split(""));

  const endCoord: Coordinate = {
    y: grid.length - 1,
    x: grid[grid.length - 1].length - 2,
  };

  const steps = walk(grid, endCoord, [
    {
      prevCoord: { y: 0, x: 0 },
      currCoord: { y: 0, x: 1 },
      steps: 0,
    },
  ]).map(({ steps }) => steps);
  const p1 = steps[steps.length - 1]
  
  console.log("Part 1: ", p1);
});
