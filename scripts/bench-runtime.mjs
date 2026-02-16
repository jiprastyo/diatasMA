import fs from "node:fs";
import { performance } from "node:perf_hooks";

const parseRuns = Number(process.env.PARSE_RUNS || 60);
const opRuns = Number(process.env.OP_RUNS || 1000);

const raw = fs.readFileSync("data/issi_data.json", "utf8");

let parsed;
const t0 = performance.now();
for (let i = 0; i < parseRuns; i++) {
  parsed = JSON.parse(raw);
}
const t1 = performance.now();

const data = parsed?.timeframes?.["1d"] || parsed?.data || [];

function runOps(arr) {
  return arr
    .filter(
      (x) =>
        x &&
        x.price > 200 &&
        x.price < 5000 &&
        x.rsi != null &&
        x.rsi >= 30 &&
        x.rsi <= 80 &&
        x.adrPct != null &&
        x.adrPct >= 1.5,
    )
    .sort(
      (a, b) =>
        (b.score ?? -Infinity) - (a.score ?? -Infinity) ||
        String(a.ticker || "").localeCompare(String(b.ticker || "")),
    )
    .slice(0, 120).length;
}

let sink = 0;
const t2 = performance.now();
for (let i = 0; i < opRuns; i++) {
  sink += runOps(data);
}
const t3 = performance.now();

const out = {
  dataPoints: data.length,
  parseRuns,
  parseTotalMs: Number((t1 - t0).toFixed(2)),
  parseAvgMs: Number(((t1 - t0) / parseRuns).toFixed(3)),
  opRuns,
  opTotalMs: Number((t3 - t2).toFixed(2)),
  opAvgMs: Number(((t3 - t2) / opRuns).toFixed(3)),
  rssMB: Number((process.memoryUsage().rss / 1024 / 1024).toFixed(1)),
  sink,
};

console.log(JSON.stringify(out, null, 2));
