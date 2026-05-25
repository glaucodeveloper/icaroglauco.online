import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { ensureBlogFiles } from "./blog-engine.js";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const projectRoot = path.resolve(__dirname, "..");
const startupDir = path.join(
  process.env.APPDATA || "",
  "Microsoft",
  "Windows",
  "Start Menu",
  "Programs",
  "Startup"
);
const commandPath = path.join(startupDir, "icaroglauco-blog-watcher.cmd");

ensureBlogFiles();
fs.mkdirSync(startupDir, { recursive: true });
fs.writeFileSync(
  commandPath,
  [
    "@echo off",
    `cd /d "${projectRoot}"`,
    "start \"icaroglauco blog watcher\" /min cmd /c npm run blog",
    ""
  ].join("\r\n"),
  "utf8"
);

console.log(`Startup instalado em: ${commandPath}`);
