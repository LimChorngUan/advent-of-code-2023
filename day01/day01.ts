const input = Bun.file("./day01.txt");

// Part 1
await input.text().then((text) => {
  const sum: number = text
    .split("\n")
    .map((line) =>
      line
        .split("")
        .map((char) => parseInt(char))
        .filter((num) => !Number.isNaN(num))
    )
    .map((digits) => {
      const first = digits[0];
      const last = digits[digits.length - 1];

      return first * 10 + last;
    })
    .reduce((acc, curr) => acc + curr);

  console.log("part 1:", sum);
});

// Part 2
await input.text().then((text) => {
  const numbersMap: Record<string, number> = {
    one: 1,
    two: 2,
    three: 3,
    four: 4,
    five: 5,
    six: 6,
    seven: 7,
    eight: 8,
    nine: 9,
  } as const;

  const convertToNumber = (str: string): number => {
    const parsedInt = parseInt(str);

    return !isNaN(parsedInt) ? parsedInt : numbersMap[str];
  };

  const sum = text
    .split("\n")
    .map((line) => {
      const numbersStr = [];

      for (let i = 0; i < line.length; i++) {
        if (!isNaN(parseInt(line[i]))) {
          numbersStr.push(line[i]);
        } else if (line.startsWith("one", i)) {
          numbersStr.push("one");
        } else if (line.startsWith("two", i)) {
          numbersStr.push("two");
        } else if (line.startsWith("three", i)) {
          numbersStr.push("three");
        } else if (line.startsWith("four", i)) {
          numbersStr.push("four");
        } else if (line.startsWith("five", i)) {
          numbersStr.push("five");
        } else if (line.startsWith("six", i)) {
          numbersStr.push("six");
        } else if (line.startsWith("seven", i)) {
          numbersStr.push("seven");
        } else if (line.startsWith("eight", i)) {
          numbersStr.push("eight");
        } else if (line.startsWith("nine", i)) {
          numbersStr.push("nine");
        }
      }

      return numbersStr;
    })
    .map((numbersStr) => {
      const first = convertToNumber(numbersStr[0]);
      const last = convertToNumber(numbersStr[numbersStr.length - 1]);

      return first * 10 + last;
    })
    .reduce((acc, curr) => acc + curr);

  console.log("part 2:", sum);
});
