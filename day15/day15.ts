const txtFile = Bun.file("./day15.txt");

const hash = (s: string): number =>
  s.split("").reduce((acc, curr) => ((acc + curr.charCodeAt(0)) * 17) % 256, 0);

await txtFile.text().then((input) => {
  const p1 = input
    .split(",")
    .map((s) => hash(s))
    .reduce((acc, curr) => acc + curr);

  const p2 = Array.from(
    input.split(",").reduce((acc, curr) => {
      const op = curr.includes("=") ? "insert" : "remove";
      const seperator = op === "insert" ? "=" : "-";
      const label = curr.split(seperator)[0];
      const focal = parseInt(curr.split(seperator)[1]);
      const boxN = hash(label);
      const existingLenses = acc.get(boxN);
      const lensLabels = existingLenses?.map(
        ([existingLabel, _]) => existingLabel
      );

      if (op === "insert") {
        if (!existingLenses) acc.set(boxN, [[label, focal]]);
        else if (lensLabels && lensLabels.indexOf(label) !== -1)
          acc.set(
            boxN,
            existingLenses.toSpliced(lensLabels.indexOf(label), 1, [
              label,
              focal,
            ])
          );
        else acc.set(boxN, [...existingLenses, [label, focal]]);
      }

      if (op === "remove") {
        if (lensLabels && lensLabels.indexOf(label) !== -1) {
          const removedLenses = existingLenses.toSpliced(
            lensLabels.indexOf(label),
            1
          );

          acc.set(boxN, removedLenses);
        }
      }

      return acc;
    }, new Map())
  )
    .filter(([_, lenses]) => lenses.length !== 0)
    .reduce((acc, curr) => {
      const boxN = curr[0];
      const lenses = curr[1];
      return (
        acc +
        lenses.reduce((lenAcc, lenCurr, i) => {
          return lenAcc + (boxN + 1) * (i + 1) * lenCurr[1];
        }, 0)
      );
    }, 0);

  console.log("Part 1", p1);
  console.log("Part 2", p2);
});
