const txtFile = Bun.file("./day19.txt");

type PartCategory = "x" | "m" | "a" | "s";
type Part = Record<PartCategory, number>;
type Comparison = "<" | ">";
type Result = "A" | "R";
type WorkflowStep =
  | string
  | {
      partCategory: PartCategory;
      comparison: Comparison;
      count: number;
      nextWorkflowName: string;
    };
type Bla = {
  currWorkflowName: string;
  part: {
    x: number[];
    m: number[];
    a: number[];
    s: number[];
  };
};

const parseWorkflowStep = (step: string): WorkflowStep => {
  if (step.includes(">") || step.includes("<")) {
    const isGreaterThan = step.includes(">");

    const [partCategory, rest] = step.split(isGreaterThan ? ">" : "<");
    const [count, nextWorkflowName] = rest.split(":");
    return {
      partCategory,
      comparison: isGreaterThan ? ">" : "<",
      count: parseInt(count),
      nextWorkflowName,
    };
  }

  return step;
};

const sortPart = (
  workflowRecord: Record<string, string[]>,
  part: Part,
  currWorkflowName = "in"
): Result => {
  const currWorkflow = workflowRecord[currWorkflowName];

  for (let i = 0; i < currWorkflow.length; i++) {
    const step = parseWorkflowStep(currWorkflow[i]);

    if (step === "A" || step === "R") {
      console.log("end reach");
      return step;
    }

    if (typeof step === "string") {
      console.log("step string", step);
      return sortPart(workflowRecord, part, step);
    }

    const { partCategory, comparison, count, nextWorkflowName } = step;

    if (
      comparison === ">"
        ? part[partCategory] > count
        : part[partCategory] < count
    ) {
      if (nextWorkflowName === "A" || nextWorkflowName === "R")
        return nextWorkflowName;

      return sortPart(workflowRecord, part, nextWorkflowName);
    }
  }
};

await txtFile.text().then((input) => {
  const [workflowsInput, partsInput] = input.split("\n\n");

  const workflowRecord = workflowsInput.split("\n").reduce((acc, curr) => {
    const [key, value] = curr.split("{");
    return {
      ...acc,
      [key]: value.substring(0, value.length - 1).split(","),
    };
  }, {});
  const parts: Part[] = partsInput.split("\n").map((line) => {
    const matches = line.match(/\d+/g).map(Number);
    return {
      x: matches[0],
      m: matches[1],
      a: matches[2],
      s: matches[3],
    };
  });

  const p1 = parts
    .map((part) => {
      const result = sortPart(workflowRecord, part, "in");

      return result === "A"
        ? Object.values(part).reduce((acc, curr) => acc + curr, 0)
        : 0;
    })
    .reduce((acc, curr) => acc + curr, 0);

  console.log(p1);
});
