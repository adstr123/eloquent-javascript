export interface IJournal extends Array<IJournalEntry> {
  [index: number]: IJournalEntry;
}

export interface IJournalEntry {
  events: string[];
  squirrel: boolean;
}

export interface IList {
  value: any;
  rest: IList | null;
}