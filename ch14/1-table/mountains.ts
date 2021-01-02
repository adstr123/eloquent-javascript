interface mountain {
  [key: string]: any;
  name: string;
  height: number;
  place: string;
}

const MOUNTAINS: mountain[] = [
  { name: "Kilimanjaro", height: 5895, place: "Tanzania" },
  { name: "Everest", height: 8848, place: "Nepal" },
  { name: "Mount Fuji", height: 3776, place: "Japan" },
  { name: "Vaalserberg", height: 323, place: "Netherlands" },
  { name: "Denali", height: 6168, place: "United States" },
  { name: "Popocatepetl", height: 5465, place: "Mexico" },
  { name: "Mont Blanc", height: 4808, place: "Italy/France" },
];

// example
/*
<table>
  <tr>
     <th>name</th>
     <th>height</th>
     <th>place</th>
  </tr>
  <tr>
     <td>Kilimanjaro</td>
     <td>5895</td>
     <td>Tanzania</td>
   </tr>
</table>
*/

// generate table
const table = document.createElement("table");

for (const [i, mountain] of MOUNTAINS.entries()) {
  // one row per object
  const row = document.createElement("tr");

  for (const key in mountain) {
    // one column per key
    if (i === 0) {
      // one header row listing the column names, column derived from property names of the first object in the data
      const header = document.createElement("th");
      header.textContent = key;
      row.append(header);
    } else {
      const data = document.createElement("td");
      data.textContent = mountain[key];
      if (typeof mountain[key] === "number") data.style.textAlign = "right";

      // right-align cells that contain number values
      row.append(data);
    }
  }

  table.append(row);
}

// append to the element with an id attribute of "mountains"
document.getElementById("mountains")?.append(table);
