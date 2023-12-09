const txtFile = Bun.file("./day09.txt");

const findSeqNum = (seq: number[], direction: "left" | "right"): number => {
  const sign = direction === "right" ? 1 : -1;
  const num = direction === "right" ? seq[seq.length - 1] : seq[0];

  return new Set(seq).size === 1
    ? num
    : num +
        findSeqNum(
          seq.map((curr, i) => seq[i + 1] - curr).slice(0, -1),
          direction
        ) *
          sign;
};

await txtFile.text().then((input) => {
  const sequences: number[][] = input
    .split("\n")
    .map((line) => line.split(" ").map((n) => parseInt(n)));

  const [p1, p2] = sequences.reduce(
    (acc, curr) => [
      acc[0] + findSeqNum(curr, "right"),
      acc[1] + findSeqNum(curr, "left"),
    ],
    [0, 0]
  );

  console.log("Part 1: ", p1);
  console.log("Part 2: ", p2);
});
