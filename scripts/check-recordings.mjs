import { readFile, writeFile } from "node:fs/promises";

const source = await readFile("src/routes/quran.archive.tsx", "utf8");
const start = source.indexOf("const RECORDINGS:");
const end = source.indexOf("\n];", start);
if (start < 0 || end < 0) {
  throw new Error("Could not locate the RECORDINGS list in src/routes/quran.archive.tsx");
}

const listSource = source.slice(start, end);
const recordings = [];
const objectPattern = /\{([\s\S]*?)\n  \},/g;
for (const match of listSource.matchAll(objectPattern)) {
  const block = match[1];
  const id = block.match(/\bid:\s*"([^"]+)"/)?.[1];
  const url = block.match(/\burl:\s*"([^"]+)"/)?.[1];
  const title = block.match(/\btitle:\s*"([^"]+)"/)?.[1] ?? id;
  if (id && url) recordings.push({ id, title, url });
}
if (!recordings.length) throw new Error("No recordings were found to check.");

async function check(recording) {
  let lastError = "";
  for (let attempt = 1; attempt <= 2; attempt++) {
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 15000);
    try {
      const response = await fetch(recording.url, {
        method: "GET",
        headers: { Range: "bytes=0-0", "User-Agent": "RahmaWaNoor-LinkHealth/1.0" },
        redirect: "follow",
        signal: controller.signal,
      });
      const result = {
        ...recording,
        status: response.status,
        ok: response.ok,
        finalUrl: response.url,
        contentType: response.headers.get("content-type") ?? "",
        checkedAt: new Date().toISOString(),
      };
      await response.body?.cancel();
      return result;
    } catch (error) {
      lastError = error instanceof Error ? error.message : String(error);
    } finally {
      clearTimeout(timeout);
    }
  }
  return { ...recording, ok: false, status: null, error: lastError, checkedAt: new Date().toISOString() };
}

const results = [];
let cursor = 0;
const workers = Array.from({ length: 5 }, async () => {
  while (cursor < recordings.length) {
    const index = cursor++;
    results[index] = await check(recordings[index]);
  }
});
await Promise.all(workers);

const report = {
  checkedAt: new Date().toISOString(),
  total: results.length,
  reachable: results.filter((item) => item.ok).length,
  failed: results.filter((item) => !item.ok).length,
  note: "HTTP reachability only. A reachable page or media URL does not prove the audio plays correctly or to completion.",
  results,
};
await writeFile("recordings-health.json", JSON.stringify(report, null, 2) + "\n");
console.log(`Checked ${report.total} recordings: ${report.reachable} reachable, ${report.failed} failed.`);
for (const item of results.filter((entry) => !entry.ok)) {
  console.log(`FAILED ${item.id}: ${item.status ?? item.error} — ${item.url}`);
}
if (report.failed) process.exitCode = 1;
