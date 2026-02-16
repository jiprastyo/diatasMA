import test from "node:test";
import assert from "node:assert/strict";
import fs from "node:fs";
import { spawnSync } from "node:child_process";

test("data file has valid 1d timeframe payload", () => {
  const raw = fs.readFileSync("data/issi_data.json", "utf8");
  const data = JSON.parse(raw);

  assert.ok(data && typeof data === "object");
  assert.ok(Array.isArray(data?.timeframes?.["1d"]));
  assert.ok(data.timeframes["1d"].length > 0);
  assert.equal(Number(data.count), data.timeframes["1d"].length);

  if (Array.isArray(data.data)) {
    assert.equal(data.data.length, data.timeframes["1d"].length);
  }
});

test("inline script in index.html compiles", () => {
  const html = fs.readFileSync("index.html", "utf8");
  const match = html.match(/<script>([\s\S]*?)<\/script>/);
  assert.ok(match, "inline script block not found");
  assert.doesNotThrow(() => new Function(match[1]));
});

test("fetch_data.js passes syntax check", () => {
  const res = spawnSync(process.execPath, ["--check", "fetch_data.js"], {
    encoding: "utf8",
  });
  assert.equal(res.status, 0, res.stderr || res.stdout);
});
