const txtFile = Bun.file("./day02.txt");

type CubeColour = "red" | "green" | "blue";
type GameSet = Record<CubeColour, number>;

const TOTAL_CUBES: Record<CubeColour, number> = {
  red: 12,
  green: 13,
  blue: 14,
};

const parseGameRecords = (input: string): GameSet[][] =>
  input.split("\n").map((line) =>
    line
      .split(": ")[1] // filter out "game n"
      .split("; ") // split into different sets
      .map((set) => set.split(", "))
      .map((arr) =>
        arr.reduce(
          (acc, curr) => {
            const amount: number = parseInt(curr.split(" ")[0]);
            const colour = curr.split(" ")[1] as CubeColour;

            return {
              ...acc,
              [colour]: acc[colour] + amount,
            };
          },
          {
            red: 0,
            green: 0,
            blue: 0,
          }
        )
      )
  );

await txtFile.text().then((input) => {
  const gameRecords = parseGameRecords(input);

  const [sumGameId, sumPower]: [number, number] = gameRecords.reduce(
    (acc, curr, i) => {
      const maxRed = Math.max(...curr.map((set) => set.red));
      const maxGreen = Math.max(...curr.map((set) => set.green));
      const maxBlue = Math.max(...curr.map((set) => set.blue));

      return [
        maxRed <= TOTAL_CUBES.red &&
        maxGreen <= TOTAL_CUBES.green &&
        maxBlue <= TOTAL_CUBES.blue
          ? acc[0] + i + 1
          : acc[0],
        maxRed * maxGreen * maxBlue + acc[1],
      ];
    },
    [0, 0]
  );

  console.log("Part 1: ", sumGameId);
  console.log("Part 2: ", sumPower);
});
