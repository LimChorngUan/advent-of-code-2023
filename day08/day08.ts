const txtFile = Bun.file("./day08.txt");

const countStartToEnd = (startNode, p: "p1" | "p2", directions, network) => {
  let count = 0;
  let currNode = startNode;

  do {
    currNode = network[currNode][directions[count % directions.length]];
    count += 1;
  } while (p === "p1" ? currNode !== "ZZZ" : currNode[2] !== "Z");

  return count;
};

const gcd = (x: number, y: number): number => (y === 0 ? x : gcd(y, x % y));

const lcm = (numbers: number[]): number =>
  numbers.reduce((acc, curr) => (acc * curr) / gcd(acc, curr));

await txtFile.text().then((input) => {
  const [directionInput, networkInput] = input.split("\n\n");

  const directions: number[] = directionInput
    .split("")
    .map((direction) => (direction === "L" ? 0 : 1));
  const network: Record<string, string[]> = networkInput
    .split("\n")
    .map((line) => line.split(" = "))
    .reduce(
      (acc, curr) => ({
        ...acc,
        [curr[0]]: curr[1].match(/(\w+)/g),
      }),
      {}
    );

  const p1 = countStartToEnd("AAA", "p1", directions, network);

  const p2 = lcm(
    Object.keys(network)
      .filter((node) => node[2] === "A")
      .map((node) => countStartToEnd(node, "p2", directions, network))
  );

  console.log("p1", p1);
  console.log("p2", p2);
});
