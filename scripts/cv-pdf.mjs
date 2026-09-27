// Prints the /cv page to public/Yunus_Emre_Senyigit_CV.pdf with headless Chrome (no extra packages).
// Start the site first (npm run dev or npm start), then: npm run cv
// CV_URL overrides the page (default http://localhost:3000/cv), CHROME the browser path.
import { spawn } from "node:child_process";
import { mkdtempSync, rmSync, writeFileSync } from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";

const url = process.env.CV_URL ?? "http://localhost:3000/cv";
const out = join(import.meta.dirname, "..", "public", "Yunus_Emre_Senyigit_CV.pdf");
const chromePath =
  process.env.CHROME ??
  {
    win32: "C:/Program Files/Google/Chrome/Application/chrome.exe",
    darwin: "/Applications/Google Chrome.app/Contents/MacOS/Google Chrome",
  }[process.platform] ??
  "google-chrome";

const port = 9400 + Math.floor(Math.random() * 400);
const profile = mkdtempSync(join(tmpdir(), "cv-pdf-"));
const chrome = spawn(chromePath, [
  "--headless=new",
  `--remote-debugging-port=${port}`,
  `--user-data-dir=${profile}`,
  "--no-first-run",
  "about:blank",
]);
const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

try {
  let target;
  for (let i = 0; i < 50 && !target; i++) {
    await sleep(200);
    try {
      const list = await (await fetch(`http://127.0.0.1:${port}/json`)).json();
      target = list.find((t) => t.type === "page");
    } catch {
      /* Chrome is still starting */
    }
  }
  if (!target) throw new Error("Chrome did not start");

  const ws = new WebSocket(target.webSocketDebuggerUrl);
  await new Promise((r) => (ws.onopen = r));
  let id = 0;
  const pending = new Map();
  ws.onmessage = (m) => {
    const msg = JSON.parse(m.data);
    if (msg.id && pending.has(msg.id)) {
      pending.get(msg.id)(msg);
      pending.delete(msg.id);
    }
  };
  const send = (method, params = {}) =>
    new Promise((resolve) => {
      const n = ++id;
      pending.set(n, resolve);
      ws.send(JSON.stringify({ id: n, method, params }));
    });

  await send("Page.enable");
  await send("Page.navigate", { url });
  await sleep(4000); // fonts and hydration
  const pdf = await send("Page.printToPDF", { printBackground: true, preferCSSPageSize: true });
  if (!pdf.result?.data) throw new Error(`printToPDF failed: ${JSON.stringify(pdf.error ?? pdf)}`);
  writeFileSync(out, Buffer.from(pdf.result.data, "base64"));
  console.log(`Wrote ${out}`);
  ws.close();
} finally {
  chrome.kill();
  await sleep(300);
  try {
    rmSync(profile, { recursive: true, force: true });
  } catch {
    /* Chrome may still hold the folder on Windows */
  }
}
