const txtFile = Bun.file("./day14.txt");

const ROUND_ROCK = "O";
const CUBE_ROCK = "#";
const GROUND = ".";

type Row = (typeof ROUND_ROCK | typeof CUBE_ROCK | typeof GROUND)[];

const sumSeq = (a: number, n: number): number => (n * (2 * a + n - 1)) / 2;

const rotateGridClockwise = (grid: string[]): string[] => {
  const rotatedGrid: string[] = [];
  const split = grid.map((row) => row.split(""));

  for (let j = 0; j < grid[0].length; j++) {
    const row: Row = [];
    for (let i = 0; i < grid.length; i++) {
      row.unshift(split[i][j]);
    }

    rotatedGrid.push(row.join(""));
  }

  return rotatedGrid;
};

const tiltGrid = (grid: string[]): string[] =>
  grid.map((row) =>
    row
      .split("#")
      .map((group) =>
        group
          .split("")
          .toSorted((a, b) => {
            if (a === ROUND_ROCK && b === GROUND) return 1;
            if (a === GROUND && b === ROUND_ROCK) return -1;
            return 0;
          })
          .join("")
      )
      .join("#")
  );

const calcGridLoad = (grid: string[]): number =>
  grid
    .map((row) =>
      row
        .split("")
        .reduce((acc, curr, i) => (curr === ROUND_ROCK ? acc + i + 1 : acc), 0)
    )
    .reduce((acc, curr) => acc + curr);

await txtFile.text().then((input) => {
  let currGrid = rotateGridClockwise(input.split("\n"));
  let cycle = 0;
  const trackedGrids: string[] = [];
  let loopStart: number = -1;

  while (loopStart === -1) {
    for (let i = 0; i < 4; i++) {
      currGrid = rotateGridClockwise(tiltGrid(currGrid));
    }

    loopStart = trackedGrids.indexOf(currGrid.join());
    trackedGrids.push(currGrid.join());
    cycle += 1;
  }

  const millionI = (1000000000 - loopStart) % (trackedGrids.length - loopStart);
  console.log(
    "Part 2: ",
    calcGridLoad(trackedGrids[millionI + loopStart].split(","))
  );
});

// 1. transpose
// 2. tilt N
// 3.
