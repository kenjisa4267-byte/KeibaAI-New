

/* KEIBA AI NAR CSV IMPORTER Ver.1.0 */

(function () {

  "use strict";

  function parseCSV(text) {

    text = String(text || "").replace(/^\uFEFF/, "");

    const rows = [];

    let row = [], cell = "", quoted = false;

    for (let i = 0; i < text.length; i++) {

      const c = text[i], next = text[i + 1];

      if (quoted) {

        if (c === '"' && next === '"') {

          cell += '"';

          i++;

        } else if (c === '"') {

          quoted = false;

        } else {

          cell += c;

        }

      } else if (c === '"') {

        quoted = true;

      } else if (c === ",") {

        row.push(cell.trim());

        cell = "";

      } else if (c === "\n") {

        row.push(cell.trim());

        rows.push(row);

        row = [];

        cell = "";

      } else if (c !== "\r") {

        cell += c;

      }

    }

    if (cell || row.length) {

      row.push(cell.trim());

      rows.push(row);

    }

    return rows.filter(r => r.some(v => v !== ""));

  }

  function toRecords(text) {

    const rows = parseCSV(text);

    if (rows.length < 2) return [];

    const headers = rows[0];

    return rows.slice(1).map(row => {

      const item = {};

      headers.forEach((header, i) => {

        item[header] = row[i] || "";

      });

      return item;

    });

  }

  async function readFile(file) {

    const buffer = await file.arrayBuffer();

    let text;

    try {

      text = new TextDecoder("utf-8", {

        fatal: true

      }).decode(buffer);

    } catch (e) {

      text = new TextDecoder("shift_jis").decode(buffer);

    }

    return {

      name: file.name,

      records: toRecords(text)

    };

  }

  function classify(filename) {

    const name = filename.toLowerCase();

    if (name.includes("horselist")) return "horselist";

    if (name.includes("racelist")) return "racelist";

    if (name.includes("payback")) return "payback";

    return "unknown";

  }

  async function importFiles(fileList) {

    const result = {

      horses: [],

      races: [],

      paybacks: [],

      counts: {}

    };

    for (const file of fileList) {

      const data = await readFile(file);

      const type = classify(data.name);

      if (type === "horselist") {

        result.horses = data.records;

      } else if (type === "racelist") {

        result.races = data.records;

      } else if (type === "payback") {

        result.paybacks = data.records;

      }

      if (type !== "unknown") {

        result.counts[type] = data.records.length;

      }

    }

    return result;

  }

  window.KeibaCSV = {

    version: "1.0",

    parseCSV,

    toRecords,

    readFile,

    classify,

    importFiles

  };

})();
