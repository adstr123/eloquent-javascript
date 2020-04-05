import { IJournal } from "../types";
const JOURNAL: IJournal = require("./ex-lycanthropes-log-data.json");

/**
 * Records an event in the journal JSON object
 * @param {string[]} events a list of the day's events to record
 * @param {boolean} squirrel whether squirrel form was assumed during the day or not
 */
function addEntry(events: string[], squirrel: boolean): void {
  JOURNAL.push({ events, squirrel });
}

/**
 * Calculates correlation coefficient between a table of event frequencies
 * Transcription of the formula \frac{ n_{11} n_{00} - n_{10} n_{01} }{\sqrt{ n_1\bullet n_0\bullet n_1\bullet n_0\bullet }}
 * ... where n is one of the event frequencies, n\bullet is the sum of all measurements where n event is true
 * @param {number[]} table flat array denoting a 2x2 frequency table
 */
function phi(table: number[]): number {
  return (
    (table[3] * table[0] - table[2] * table[1]) /
    Math.sqrt(
      (table[2] + table[3]) *
        (table[0] + table[1]) *
        (table[1] + table[3]) *
        (table[0] + table[2])
    )
  );
}

/**
 * Extracts a 2x2 frequency table for a specific event from the journal JSON object
 * @param {string} event - event to search for occurrences of
 * @param {Object} journal - data source
 * @param {string[]} journal.events - array of that day's events
 * @param {boolean} journal.squirrel - indicates whether transformation into squirrel took place on that day
 * @returns {number[]}
 */
function tableFor(event: string, journal: IJournal): number[] {
  let table = [0, 0, 0, 0];
  for (let i = 0; i < journal.length; i++) {
    let entry = journal[i];
    let index = 0;
    if (entry.events.includes(event)) index += 1;
    if (entry.squirrel) index += 2;
    table[index] += 1;
  }
  return table;
}

/**
 * Returns a list of all event types present in the data
 * Enables us to compute a correlation for every type of event that occurs in the data set
 * @param {Object} journal data source
 * @param {string[]} journal.events array of that day's events
 * @param {boolean} journal.squirrel indicates whether transformation into squirrel took place on that day
 * @returns {string[]}
 */
function journalEvents(journal: IJournal): string[] {
  let events: string[] = [];
  for (let entry of journal) {
    for (let event of entry.events) {
      if (!events.includes(event)) {
        events.push(event);
      }
    }
  }
  return events;
}

// MAIN
// print all correlations
for (let event of journalEvents(JOURNAL)) {
  console.log(event + ":", phi(tableFor(event, JOURNAL)));
}

// most lie close to 0. Filter for correlations greater than 0.1 or less than -0.1
console.log("\n");
for (let event of journalEvents(JOURNAL)) {
  let correlation = phi(tableFor(event, JOURNAL));
  if (correlation > 0.1 || correlation < -0.1) {
    console.log(event + ":", correlation);
  }
}

// eating peanuts & brushing teeth have strong effects. Let's do a cross-correlation for those events
console.log("\n");
for (let entry of JOURNAL) {
  if (
    entry.events.includes("peanuts") &&
    !entry.events.includes("brushed teeth")
  ) {
    entry.events.push("peanut teeth");
  }
}
console.log("peanut teeth: " + phi(tableFor("peanut teeth", JOURNAL)));
