const txtFile = Bun.file("./day06.txt");

const parseInput = (input: string): [number[][], number[]] => {
  const [ts, ss] = input.split("\n").map((line) =>
    line
      .split(":")[1]
      .split(/\s+/)
      .filter(Boolean)
      .map((str) => parseInt(str))
  );
  const totalT = parseInt(ts.join(""));
  const totalS = parseInt(ss.join(""));

  return [
    [ts, ss],
    [totalT, totalS],
  ];
};

const checkIsVTGreaterThanS = (v: number, t: number, s: number) =>
  v * (t - v) > s;

const getAmtOfOptions = (totalT: number, minT: number) => totalT + 1 - 2 * minT;

await txtFile.text().then((input) => {
  const [p1Input, p2Input] = parseInput(input);

  const p1 = p1Input[0].reduce((mul, t, i) => {
    let minP1 = 1;

    for (let n = 0; n <= t; n++) {
      if (checkIsVTGreaterThanS(n, t, p1Input[1][i])) {
        minP1 = n;
        break;
      }
    }

    return mul * getAmtOfOptions(t, minP1);
  }, 1);

  let minP2 = 1;

  for (let n = 0; n <= p2Input[0]; n++) {
    if (checkIsVTGreaterThanS(n, p2Input[0], p2Input[1])) {
      minP2 = n;
      break;
    }
  }

  const p2 = getAmtOfOptions(p2Input[0], minP2);

  console.log("Part 1", p1);
  console.log("Part 2", p2);
});
