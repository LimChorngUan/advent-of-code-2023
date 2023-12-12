const txtFile = Bun.file("./day12.txt");

const replaceUnknowns = (ss: string[], i = 0): string[] => {
  if (i === ss[0].length) return ss;

  const newSS = ss.flatMap((s) =>
    s[i] === "." || s[i] === "#"
      ? s
      : [s.replace("?", "."), s.replace("?", "#")]
  );

  return replaceUnknowns(newSS, i + 1);
};

const getDamageSprings = (s: string): number[] =>
  s
    .split(".")
    .filter(Boolean)
    .map((damageSpring) => damageSpring.length);

await txtFile.text().then((input) => {
  const records: [string, number[]][] = input
    .split("\n")
    .map((line) => line.split(" "))
    .map((line) => [line[0], line[1].split(",").map((s) => parseInt(s))]);

  const p1 = records
    .map(([unknown, damageSprings]) => {
      const combinations = replaceUnknowns([unknown]).map((s) =>
        getDamageSprings(s)
      );

      return combinations.filter((comb) => comb.join() === damageSprings.join())
        .length;
    })
    .reduce((acc, curr) => acc + curr);

  console.log(p1);
});
