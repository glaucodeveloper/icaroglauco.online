import { spawn } from "node:child_process";
import fs from "node:fs";
import {
  createPostFromLine,
  ensureBlogFiles,
  getInboxLines,
  inboxPath,
  readState,
  writeState
} from "./blog-engine.js";

function processNewLines() {
  const lines = getInboxLines();
  const state = readState();
  const start = Math.max(0, Number(state.processedLines || 0));
  const freshLines = lines.slice(start);
  let created = 0;

  freshLines.forEach((line) => {
    const post = createPostFromLine(line);
    if (post) {
      created += 1;
      console.log(`[blog] post criado: ${post.title}`);
    }
  });

  writeState({ processedLines: lines.length, lastRun: new Date().toISOString() });
  if (!created && freshLines.length) {
    console.log("[blog] linhas novas ignoradas por estarem vazias ou comentadas.");
  }
}

ensureBlogFiles();
processNewLines();

console.log(`[blog] observando ${inboxPath}`);
console.log("[blog] escreva uma ideia por linha e salve o arquivo para gerar posts.");

try {
  spawn("notepad.exe", [inboxPath], {
    detached: true,
    stdio: "ignore"
  }).unref();
} catch (error) {
  console.log(`[blog] nao consegui abrir o bloco de notas: ${error.message}`);
}

fs.watchFile(inboxPath, { interval: 800 }, processNewLines);
