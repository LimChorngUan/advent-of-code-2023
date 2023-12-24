const txtFile = Bun.file("./day05.txt");

const DES = 0;
const SRC = 1;
const RNG = 2;

const parseInput = (input: string): [number[], number[][][]] => [
  input
    .split("\n\n")[0]
    .split(": ")[1]
    .split(" ")
    .map((s) => parseInt(s)),
  input
    .split("\n\n")
    .slice(1)
    .map((s) =>
      s
        .split(":\n")[1]
        .split("\n")
        .map((ss) => ss.split(" ").map((sss) => parseInt(sss)))
    ),
];

const mapP1 = (src: number, map: number[][]): number => {
  let des = src;

  for (let i = 0; i < map.length; i++) {
    if (src >= map[i][SRC] && src <= map[i][SRC] + map[i][RNG] - 1) {
      des = src + (map[i][DES] - map[i][SRC]);
      break;
    }
  }

  return des;
};

const mapP2 = (
  seedStart: number,
  seedRange: number,
  map: number[][]
): number[] => {
  const desPairs: number[] = [];

  for (let i = 0; i < map.length; i++) {
    const seedEnd = seedStart + seedRange - 1;
    const srcStart = map[i][SRC];
    const srcEnd = map[i][SRC] + map[i][RNG] - 1;
    const desStart = map[i][DES];
    if (seedStart < srcStart && seedEnd > srcEnd) {
      desPairs[0] = seedStart;
      desPairs[1] = srcStart - seedStart;
      desPairs[2] = desStart;
      desPairs[3] = map[i][RNG];
      desPairs[4] = srcEnd + 1;
      desPairs[5] = seedEnd - srcEnd;
      break;
    }
    if (seedStart >= srcStart && seedStart <= srcEnd && seedEnd > srcEnd) {
      desPairs[0] = seedStart + (desStart - srcStart);
      desPairs[1] = srcEnd - seedStart + 1;
      desPairs[2] = srcEnd + 1;
      desPairs[3] = seedEnd - srcEnd;
      break;
    }
    if (seedStart < srcStart && seedEnd <= srcEnd && seedEnd >= srcStart) {
      desPairs[0] = seedStart;
      desPairs[1] = srcStart - seedStart;
      desPairs[2] = desStart;
      desPairs[3] = seedEnd - srcStart + 1;
      break;
    }
    if (seedStart >= srcStart && seedEnd <= srcEnd) {
      desPairs[0] = seedStart + (desStart - srcStart);
      desPairs[1] = seedRange;
      break;
    }

    desPairs[0] = seedStart;
    desPairs[1] = seedRange;
  }

  return desPairs;
};

await txtFile.text().then((input) => {
  const [srcs, maps] = parseInput(input);
  let p1s = [...srcs];
  let p2s = [...srcs];
  console.log(mapP2(1, 5, [[3, 2, 3]]));

  for (let i = 0; i < maps.length; i++) {
    for (let j = 0; j < p1s.length; j++) {
      p1s[j] = mapP1(p1s[j], maps[i]);
    }

    const currPairs = p2s;
    const newPairs = [];
    for (let j = 0; j < currPairs.length; j += 2) {
      newPairs.push(...mapP2(p2s[j], p2s[j + 1], maps[i]));
    }
    p2s = newPairs;
    console.log("!! p2s", p2s);
  }

  console.log("11 p2s", p2s);

  const p1 = Math.min(...p1s);
  const p2 = Math.min(...p2s.filter((_, i) => i % 2 === 0));

  console.log("Part 1: ", p1);
  console.log("Part 2: ", p2);
});
