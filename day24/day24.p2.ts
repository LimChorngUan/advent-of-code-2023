const txtFile = Bun.file("./day24.txt");

// Function to perform partial pivoting on the matrix A
const partialPivot = (A, n) => {
  for (let i = 0; i < n; i++) {
    let pivot_row = i;
    // Find the row with the largest absolute value in the ith column
    for (let j = i + 1; j < n; j++) {
      if (Math.abs(A[j][i]) > Math.abs(A[pivot_row][i])) {
        pivot_row = j;
      }
    }
    // Swap rows if necessary
    if (pivot_row != i) {
      for (let j = i; j <= n; j++) {
        [A[i][j], A[pivot_row][j]] = [A[pivot_row][j], A[i][j]];
      }
    }
    // Perform Gaussian Elimination on the matrix
    for (let j = i + 1; j < n; j++) {
      let factor = A[j][i] / A[i][i];
      for (let k = i; k <= n; k++) {
        A[j][k] -= factor * A[i][k];
      }
    }
  }
};

// Function to perform back substitution on the matrix A to find the solution vector x
const backSubsitute = (A, n, x) => {
  for (let i = n - 1; i >= 0; i--) {
    let sum = 0;
    for (let j = i + 1; j < n; j++) {
      sum += A[i][j] * x[j];
    }
    x[i] = (A[i][n] - sum) / A[i][i];
  }
};

await txtFile.text().then((input) => {
  const hailstones = input.split("\n").map((line) =>
    line
      .split(" @ ")
      .flatMap((line) => line.split(", "))
      .map((s) => parseInt(s))
  );

  let n = 4;
  let A: number[][] = [];
  let B: number[][] = [];
  let xy = Array(n);
  let xz = Array(n);

  for (let i = 0; i < 4; i++) {
    const [x1, y1, z1, vx1, vy1, vz1] = hailstones[i];
    const [x2, y2, z2, vx2, vy2, vz2] = hailstones[i + 1];

    A.push([
      vy1 - vy2,
      vx2 - vx1,
      y2 - y1,
      x1 - x2,
      x1 * vy1 - y1 * vx1 - x2 * vy2 + y2 * vx2,
    ]);
  }

  partialPivot(A, n);
  backSubsitute(A, n, xy);

  for (let i = 0; i < 4; i++) {
    const [x1, y1, z1, vx1, vy1, vz1] = hailstones[i];
    const [x2, y2, z2, vx2, vy2, vz2] = hailstones[i + 1];

    B.push([
      vz1 - vz2,
      vx2 - vx1,
      z2 - z1,
      x1 - x2,
      x1 * vz1 - z1 * vx1 - x2 * vz2 + z2 * vx2,
    ]);
  }

  partialPivot(B, n);
  backSubsitute(B, n, xz);

  const [Xr, Yr] = xy;
  const [_, Zr] = xz;

  const p2 = Math.round(Xr) + Math.round(Yr) + Math.round(Zr);

  console.log("Part 2: ", p2);
});
