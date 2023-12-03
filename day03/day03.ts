const txtFile = Bun.file("./day03.txt");

const parseInput = (input: string) =>
  input
    .split("\n")
    .map((line) =>
      line
        .match(/\d+|\D/g)
        ?.flatMap((el) =>
          parseInt(el)
            ? Array.from({ length: el.length }).fill(parseInt(el))
            : el
        )
    );

const getAdjNums = (grid, i, j) =>
  new Set(
    [
      grid[i - 1][j - 1],
      grid[i - 1][j],
      grid[i - 1][j + 1],
      grid[i][j + 1],
      grid[i + 1][j + 1],
      grid[i + 1][j],
      grid[i + 1][j - 1],
      grid[i][j - 1],
    ].filter((el) => typeof el === "number")
  );

await txtFile.text().then((input) => {
  const grid = parseInput(input);

  let p1 = 0;
  let p2 = 0;

  for (let i = 0; i < grid.length; i++) {
    for (let j = 0; j < (grid[i] as []).length; j++) {
      const curr = grid[i][j];

      if (isNaN(parseInt(curr)) && curr !== ".") {
        const adjNums = getAdjNums(grid, i, j);

        p1 += Array.from(adjNums).reduce((acc, curr) => acc + curr);
      }

      if (curr === "*") {
        const adjNums = getAdjNums(grid, i, j);
        
        if (adjNums.size === 2) {
          p2 += Array.from(adjNums)[0] * Array.from(adjNums)[1];
        }
      }
    }
  }

  console.log("part 1", p1);
  console.log("part 2", p2);
});
