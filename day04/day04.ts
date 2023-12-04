const txtFile = Bun.file("./day04.txt");

const parseInput = (input: string) =>
  input.split("\n").map((line) =>
    line
      .split(": ")[1]
      .split(" | ")
      .map((strs) =>
        strs
          .split(/\s+/)
          .map((str) => parseInt(str))
          .filter(Boolean)
      )
      .map((nums) => new Set(nums))
  );

await txtFile.text().then((input) => {
  const winningNums = parseInput(input).map(
    (sets) => sets[0].intersection(sets[1]).size
  );

  const p1 = winningNums.reduce(
    (acc, curr) => (curr ? acc + Math.pow(2, curr - 1) : acc),
    0
  );

  let p2 = 0;

  const originalCards = Array.from({ length: winningNums.length }, (_, i) => i);
  let trackCards: number[][] = [[...originalCards]];

  do {
    const firstRow = trackCards[0];
    let copies: number[][] = [];

    for (let i = 0; i < firstRow.length; i++) {
      const copy: number[] = originalCards.slice(
        firstRow[i] + 1,
        firstRow[i] + 1 + winningNums[firstRow[i]]
      );

      if (copy.length) copies.push(copy);
    }

    trackCards.push(...copies);
    trackCards.shift();

    p2 += firstRow.length;
  } while (trackCards.length > 0);

  console.log("Part 1:", p1);
  console.log("Part 2:", p2);
});
