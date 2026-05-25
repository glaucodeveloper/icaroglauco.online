import fs from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { compileDslSource } from "@icaroglauco/dsljs";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const projectRoot = path.resolve(__dirname, "..");
const sourceRoot = path.join(projectRoot, "src");

async function walk(dir) {
  const entries = await fs.readdir(dir, { withFileTypes: true });
  const files = await Promise.all(
    entries.map(async (entry) => {
      const fullPath = path.join(dir, entry.name);
      if (entry.isDirectory()) return walk(fullPath);
      return entry.isFile() && entry.name.endsWith(".idsl") ? [fullPath] : [];
    })
  );

  return files.flat();
}

function getOutputPath(sourcePath) {
  return sourcePath.slice(0, -".idsl".length) + ".ts";
}

async function generateFile(sourcePath) {
  const source = await fs.readFile(sourcePath, "utf8");
  const originalConsoleLog = console.log;
  let output;

  try {
    console.log = () => {};
    output = compileDslSource(source, { sourcePath });
  } finally {
    console.log = originalConsoleLog;
  }

  const outputPath = getOutputPath(sourcePath);
  const header = [
    `// Generated from: ${path.relative(projectRoot, sourcePath).replaceAll("\\", "/")}`,
    "// Edit the .idsl source, not this file."
  ];
  const body = output
    .replace(/\r\n/g, "\n")
    .split("\n")
    .map((line) => line.trimEnd())
    .join("\n")
    .trimEnd();
  const generatedSource = body ? [...header, "", body, ""].join("\n") : `${header.join("\n")}\n`;

  await fs.writeFile(
    outputPath,
    generatedSource,
    "utf8"
  );

  return outputPath;
}

const files = (await walk(sourceRoot)).sort();
const generated = [];

for (const file of files) {
  generated.push(await generateFile(file));
}

console.log(`[macro-frontend] generated ${generated.length} file(s)`);
for (const file of generated) {
  console.log(`- ${path.relative(projectRoot, file)}`);
}
