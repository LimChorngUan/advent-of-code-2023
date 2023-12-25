const txtFile = Bun.file("./day24.txt");

const MIN = 200000000000000;
const MAX = 400000000000000;

const findIntersectionX = (vy1, vx1, yo1, xo1, vy2, vx2, yo2, xo2): number => {
  const m1 = vy1 / vx1;
  const m2 = vy2 / vx2;
  return (m1 * xo1 - yo1 - m2 * xo2 + yo2) / (m1 - m2);
};

const findIntersectionY = (vy, vx, yo, xo, x): number => {
  return (vy / vx) * (x - xo) + yo;
};

const findAllIntersections = (hailstones) => {
  const intersections: { x: number; y: number }[] = [];

  for (let i = 0; i < hailstones.length - 1; i++) {
    for (let j = i + 1; j < hailstones.length; j++) {
      const [xo1, yo1, zo1, vx1, vy1, vz1] = hailstones[i];
      const [xo2, yo2, zo2, vx2, vy2, vz2] = hailstones[j];

      const x = findIntersectionX(vy1, vx1, yo1, xo1, vy2, vx2, yo2, xo2);

      if (!isFinite(x)) continue; // parallel path
      if (
        (vx1 < 0 && x > xo1) ||
        (vx2 < 0 && x > xo2) ||
        (vx1 > 0 && x < xo1) ||
        (vx2 > 0 && x < xo2)
      )
        continue; // intersect in past

      const y = findIntersectionY(vy1, vx1, yo1, xo1, x);

      if (
        (vy1 < 0 && y > yo1) ||
        (vy2 < 0 && y > yo2) ||
        (vy1 > 0 && y < yo1) ||
        (vy2 > 0 && y < yo2)
      )
        continue; // intersect in past

      if (x >= MIN && x <= MAX && y >= MIN && y <= MAX)
        intersections.push({ x, y });
    }
  }

  return intersections;
};

await txtFile.text().then((input) => {
  const hailstones = input.split("\n").map((line) =>
    line
      .split(" @ ")
      .flatMap((line) => line.split(", "))
      .map((s) => parseInt(s))
  );

  const p1 = findAllIntersections(hailstones).length;

  console.log("Part 1: ", p1);
});
