const txtFile = Bun.file("./day07.txt");

const HAND_TYPE = {
  highCard: 0,
  onePair: 1,
  twoPair: 2,
  threeOfAKind: 3,
  fullHouse: 4,
  fourOfAKind: 5,
  fiveOfAKind: 6,
} as const;
type HandType = (typeof HAND_TYPE)[keyof typeof HAND_TYPE];

const CARD_TO_NUMBER_MAP = {
  J: 1,
  "2": 2,
  "3": 3,
  "4": 4,
  "5": 5,
  "6": 6,
  "7": 7,
  "8": 8,
  "9": 9,
  T: 10,
  Q: 12,
  K: 13,
  A: 14,
};

const areArrEqual = <T>(arr1: Array<T>, arr2: Array<T>): Boolean =>
  arr1.every((element, index) => element === arr2[index]);

const getHandType = (input: string): HandType => {
  const obj = input.split("").reduce(
    (acc, curr) => ({
      ...acc,
      [curr]: acc[curr] ? acc[curr] + 1 : 1,
    }),
    {}
  );
  
  const JVal = obj["J"] || 0;
  if (JVal) {
    delete obj["J"];
  }

  const pattern: number[] = Object.values(obj).sort();
  pattern[pattern.length - 1] = pattern[pattern.length - 1] + JVal;

  if (areArrEqual(pattern, [5])) return HAND_TYPE.fiveOfAKind;
  if (areArrEqual(pattern, [1, 4])) return HAND_TYPE.fourOfAKind;
  if (areArrEqual(pattern, [2, 3])) return HAND_TYPE.fullHouse;
  if (areArrEqual(pattern, [1, 1, 3])) return HAND_TYPE.threeOfAKind;
  if (areArrEqual(pattern, [1, 2, 2])) return HAND_TYPE.twoPair;
  if (areArrEqual(pattern, [1, 1, 1, 2])) return HAND_TYPE.onePair;
  return HAND_TYPE.highCard;
};

const isfirstHandGreater = (hand1: string, hand2: string): Boolean => {
  const [hand1s, hand2s] = [hand1.split(""), hand2.split("")];

  for (let i = 0; i < hand1s.length; i++) {
    if (CARD_TO_NUMBER_MAP[hand1s[i]] > CARD_TO_NUMBER_MAP[hand2s[i]])
      return true;
    else if (CARD_TO_NUMBER_MAP[hand1s[i]] < CARD_TO_NUMBER_MAP[hand2s[i]])
      return false;
  }

  return false;
};

await txtFile.text().then((input) => {
  const sum = input
    .split("\n")
    .map((line) => line.split(" "))
    .sort((a, b) => {
      const [handTypeA, handTypeB] = [getHandType(a[0]), getHandType(b[0])];

      if (handTypeA > handTypeB) {
        return 1;
      } else if (handTypeA < handTypeB) {
        return -1;
      }
      return isfirstHandGreater(a[0], b[0]) ? 1 : -1;
    })
    .reduce((acc, curr, i) => acc + parseInt(curr[1]) * (i + 1), 0);

  console.log(sum);
  console.log(getHandType("JJJJJ"));
});
