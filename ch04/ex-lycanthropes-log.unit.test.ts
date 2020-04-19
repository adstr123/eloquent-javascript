import { phi, tableFor, journalEvents } from "./ex-lycanthropes-log";

const testJournal = [
  {
    events: ["one", "two", "three"],
    squirrel: false,
  },
  {
    events: ["four", "five"],
    squirrel: false,
  },
  {
    events: ["one", "five", "six"],
    squirrel: true,
  },
];

expect.extend({
  /**
   * Array contains no duplicate elements
   * @param received
   */
  toHaveUnique(received: any[]) {
    const pass =
      Array.isArray(received) && new Set(received).size === received.length;
    if (pass) {
      return {
        message: () => `expected [${received}] array elements are unique`,
        pass: true,
      };
    } else {
      return {
        message: () => `expected [${received}] array elements are not unique`,
        pass: false,
      };
    }
  },
});

describe("when generating a list of events in a data source", () => {
  test("total number of unique events in testJournal is 6", () => {
    expect(journalEvents(testJournal)).toHaveLength(6);
  });
  test("no duplicate events in events list for testJournal", () => {
    expect(journalEvents(testJournal)).toHaveUnique();
  });
});

describe("when generating a frequency table for a type of event", () => {
  test("frequency table of 1, 1, 0, 1 for input event one", () => {
    expect(tableFor("one", testJournal)).toStrictEqual([1, 1, 0, 1]);
  });
  test("always has length 4 regardless of input existence or value", () => {
    expect(tableFor("zero", testJournal)).toHaveLength(4);

    expect(tableFor("one", testJournal)).toHaveLength(4);
    expect(tableFor("two", testJournal)).toHaveLength(4);
    expect(tableFor("three", testJournal)).toHaveLength(4);
    expect(tableFor("four", testJournal)).toHaveLength(4);
    expect(tableFor("five", testJournal)).toHaveLength(4);
    expect(tableFor("six", testJournal)).toHaveLength(4);
  });
});

describe("when generating a correlation coefficient over a type of event's frequency table", () => {
  test("is always less than 1", () => {
    expect(phi([1, 1, 0, 1])).toBeLessThanOrEqual(1);
  });
});
