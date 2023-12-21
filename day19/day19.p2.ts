const txtFile = Bun.file("./day19.txt");

type Combi = {
  currWorkflowName: string;
  part: {
    x: number[];
    m: number[];
    a: number[];
    s: number[];
  };
};
type WorkflowStep =
  | string
  | {
      partCategory: "x" | "m" | "a" | "s";
      comparison: ">" | "<";
      count: number;
      nextWorkflowName: string;
    };

const parseWorkflowStep = (step: string): WorkflowStep => {
  if (step.includes(">") || step.includes("<")) {
    const isGreaterThan = step.includes(">");

    const [partCategory, rest] = step.split(isGreaterThan ? ">" : "<");
    const [count, nextWorkflowName] = rest.split(":");
    return {
      partCategory: partCategory as "x" | "m" | "a" | "s",
      comparison: isGreaterThan ? ">" : "<",
      count: parseInt(count),
      nextWorkflowName,
    };
  }

  return step;
};

const runWorkflow = (
  workflowRecord: Record<string, string[]>,
  combi: Combi // that is neither A nor R yet
): Combi[] => {
  if (combi.currWorkflowName === "A" || combi.currWorkflowName === "R")
    return [combi];

  const workflowSteps = workflowRecord[combi.currWorkflowName];
  const rest: Combi = { ...combi };
  const combis: Combi[] = [];

  for (let i = 0; i < workflowSteps.length; i++) {
    const step = parseWorkflowStep(workflowSteps[i]);

    if (typeof step === "string") {
      combis.push({
        currWorkflowName: step,
        part: { ...rest.part },
      });

      continue;
    }

    const { partCategory, comparison, count, nextWorkflowName } = step;
    const [startRange, endRange] = rest.part[partCategory];

    if (comparison === "<") {
      if (endRange < count) {
        combis.push({
          currWorkflowName: nextWorkflowName,
          part: {
            ...rest.part,
          },
        });
      } else {
        combis.push({
          currWorkflowName: nextWorkflowName,
          part: {
            ...rest.part,
            [partCategory]: [startRange, count - 1],
          },
        });

        rest.part = {
          ...rest.part,
          [partCategory]: [count, endRange],
        };

        continue;
      }
    }

    if (comparison === ">") {
      if (startRange > count) {
        combis.push({
          currWorkflowName: nextWorkflowName,
          part: {
            ...rest.part,
          },
        });
      } else {
        combis.push({
          currWorkflowName: nextWorkflowName,
          part: {
            ...rest.part,
            [partCategory]: [count + 1, endRange],
          },
        });

        rest.part = {
          ...rest.part,
          [partCategory]: [startRange, count],
        };
      }

      continue;
    }
  }

  return combis;
};

const findCombinations = (
  workflowRecord: Record<string, string[]>,
  combis: Combi[]
): Combi[] => {
  const end = combis.every(
    ({ currWorkflowName }) =>
      currWorkflowName === "A" || currWorkflowName === "R"
  );

  if (end) return combis;

  const newCombis = combis.flatMap((combi) =>
    runWorkflow(workflowRecord, combi)
  );

  return findCombinations(workflowRecord, newCombis);
};

await txtFile.text().then((input) => {
  const workflowsInput = input.split("\n\n")[0];

  const workflowRecord = workflowsInput.split("\n").reduce((acc, curr) => {
    const [key, value] = curr.split("{");
    return {
      ...acc,
      [key]: value.substring(0, value.length - 1).split(","),
    };
  }, {});

  const initCombi = {
    currWorkflowName: "in",
    part: {
      x: [1, 4000],
      m: [1, 4000],
      a: [1, 4000],
      s: [1, 4000],
    },
  };

  const p2 = findCombinations(workflowRecord, [initCombi])
    .filter(({ currWorkflowName }) => currWorkflowName === "A")
    .map(({ part }) =>
      Object.values(part).reduce(
        (acc, curr) => acc * (curr[1] - curr[0] + 1),
        1
      )
    ).reduce((acc, curr) => acc + curr, 0);

  console.log("497697833368000".length)
  console.log("Part 2: ", p2);
});
