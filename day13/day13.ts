const txtFile = Bun.file("./day13.txt");

const checkIsHorizontalReflection = (
  grid: string[],
  mirrorI = 1,
  tolerance = 0
): Boolean => {
  const insertMirrorGrid = grid.toSpliced(mirrorI, 0, "|");

  let diffCount = 0;

  for (let i = 1; i <= mirrorI; i++) {
    if (!insertMirrorGrid[mirrorI - i] || !insertMirrorGrid[mirrorI + i]) {
      return diffCount === tolerance ? true : false;
    }

    if (insertMirrorGrid[mirrorI - i] !== insertMirrorGrid[mirrorI + i]) {
      const row1 = insertMirrorGrid[mirrorI - i].split("");
      const row2 = insertMirrorGrid[mirrorI + i].split("");

      for (let j = 0; j < row1.length; j++) {
        if (row1[j] !== row2[j]) diffCount += 1;
      }
    }
  }

  return diffCount === tolerance ? true : false;
};

const transposeGrid = (grids: string[]): string[] => {
  const transposedGrid: string[] = [];

  for (let j = 0; j < grids[0].length; j++) {
    const s: string[] = [];
    for (let i = 0; i < grids.length; i++) {
      s.push(grids[i][j]);
    }
    transposedGrid.push(s.join(""));
  }

  return transposedGrid;
};

const findMirrorI = (
  grid: string[],
  tolerance: number
): [number | null, number | null] => {
  let horizontalMirrorI: number | null = null;
  let verticalMirrorI: number | null = null;

  for (let i = 1; i < grid.length; i++) {
    if (checkIsHorizontalReflection(grid, i, tolerance)) {
      horizontalMirrorI = i;
      break;
    }
  }

  const transposedGrid = transposeGrid(grid);
  for (let i = 1; i < transposedGrid.length; i++) {
    if (checkIsHorizontalReflection(transposedGrid, i, tolerance)) {
      verticalMirrorI = i;
      break;
    }
  }

  return [horizontalMirrorI, verticalMirrorI];
};

const findSum = (mirrorIs: [number | null, number | null][]): number =>
  mirrorIs.reduce(
    (acc, curr) =>
      acc +
      (curr[0] !== null ? 100 * (curr[0] as number) : (curr[1] as number)),
    0
  );

await txtFile.text().then((input) => {
  const grids = input.split("\n\n").map((grid) => grid.split("\n"));

  const p1 = findSum(grids.map((grid) => findMirrorI(grid, 0)));
  const p2 = findSum(grids.map((grid) => findMirrorI(grid, 1)));

  console.log("Part 1:", p1);
  console.log("Part 2:", p2);
});
