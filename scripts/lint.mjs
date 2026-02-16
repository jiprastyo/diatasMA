import fs from "node:fs";
import { spawnSync } from "node:child_process";

const issues = [];

function runNodeCheck(file) {
  const res = spawnSync(process.execPath, ["--check", file], {
    encoding: "utf8",
  });
  if (res.status !== 0) {
    issues.push(`Syntax check failed: ${file}\n${res.stderr || res.stdout}`);
  }
}

function checkInlineScript(file) {
  const html = fs.readFileSync(file, "utf8");
  const match = html.match(/<script>([\s\S]*?)<\/script>/);
  if (!match) {
    issues.push(`Inline script block not found in ${file}`);
    return;
  }
  try {
    // Compile-only lint guard for inline JS.
    new Function(match[1]);
  } catch (err) {
    issues.push(`Inline script compile failed: ${file}\n${err.message}`);
  }
}

function checkDataJson(file) {
  try {
    const raw = fs.readFileSync(file, "utf8");
    const parsed = JSON.parse(raw);
    const tf1d = parsed?.timeframes?.["1d"];
    if (!Array.isArray(tf1d) || tf1d.length === 0) {
      issues.push(`Data sanity failed: ${file} missing timeframes.1d`);
    }
    if (typeof parsed?.count === "number" && Array.isArray(tf1d) && parsed.count !== tf1d.length) {
      issues.push(`Data sanity failed: ${file} count (${parsed.count}) != timeframes.1d length (${tf1d.length})`);
    }
  } catch (err) {
    issues.push(`Data parse failed: ${file}\n${err.message}`);
  }
}

runNodeCheck("fetch_data.js");
checkInlineScript("index.html");
checkDataJson("data/issi_data.json");

if (issues.length > 0) {
  console.error("Lint failed:");
  for (const issue of issues) {
    console.error(`- ${issue}`);
  }
  process.exit(1);
}

console.log("Lint passed.");
