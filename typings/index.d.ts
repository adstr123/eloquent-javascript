/// <reference types="jest" />

declare namespace jest {
  interface Matchers<R> {
    toHaveUnique(): R;
  }
}

declare namespace Journal {
  export interface IJournal extends Array<IJournalEntry> {
    [index: number]: IJournalEntry;
  }

  export interface IJournalEntry {
    /** That day's events */
    events: string[];
    /** Indicates whether transformation into squirrel took place on that day */
    squirrel: boolean;
  }
}

declare namespace List {
  /**
   * A list data structure - nested set of objects, each referencing the following one
   */
  export interface IList {
    /** The list element value to store */
    value: any;
    /** Reference to the rest of the list. If this is the last item in the list, rest is null */
    rest: IList | null;
  }
}
