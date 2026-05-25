import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

export const projectRoot = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
export const dataDir = path.join(projectRoot, "data");
export const postsDir = path.join(projectRoot, "public", "posts");
export const indexPath = path.join(projectRoot, "public", "blog-index.json");
export const configPath = path.join(dataDir, "blog-config.json");
export const inboxPath = path.join(dataDir, "blog-inbox.txt");
export const statePath = path.join(dataDir, "blog-state.json");

const defaultConfig = {
  author: "Icaro Glauco",
  style:
    "Blog pessoal, tecnico e editorial. Tom direto, introspectivo, com foco em software, IA, produto e autoria.",
  language: "pt-BR"
};

export function ensureBlogFiles() {
  fs.mkdirSync(dataDir, { recursive: true });
  fs.mkdirSync(postsDir, { recursive: true });

  if (!fs.existsSync(configPath)) {
    fs.writeFileSync(configPath, JSON.stringify(defaultConfig, null, 2), "utf8");
  }

  if (!fs.existsSync(inboxPath)) {
    fs.writeFileSync(
      inboxPath,
      [
        "# Escreva uma ideia por linha.",
        "# Ao salvar uma linha nova, o watcher gera um post markdown em public/posts.",
        ""
      ].join("\r\n"),
      "utf8"
    );
  }

  if (!fs.existsSync(statePath)) {
    fs.writeFileSync(statePath, JSON.stringify({ processedLines: 0 }, null, 2), "utf8");
  }

  if (!fs.existsSync(indexPath)) {
    fs.writeFileSync(indexPath, JSON.stringify({ posts: [] }, null, 2), "utf8");
  }
}

export function readBlogConfig() {
  ensureBlogFiles();
  try {
    return { ...defaultConfig, ...JSON.parse(fs.readFileSync(configPath, "utf8")) };
  } catch {
    return defaultConfig;
  }
}

export function saveBlogConfig(nextConfig) {
  ensureBlogFiles();
  const config = {
    author: String(nextConfig.author || defaultConfig.author).trim(),
    style: String(nextConfig.style || defaultConfig.style).trim(),
    language: String(nextConfig.language || defaultConfig.language).trim()
  };

  fs.writeFileSync(configPath, JSON.stringify(config, null, 2), "utf8");
  return config;
}

export function readBlogIndex() {
  ensureBlogFiles();
  try {
    const payload = JSON.parse(fs.readFileSync(indexPath, "utf8"));
    return Array.isArray(payload.posts) ? payload.posts : [];
  } catch {
    return [];
  }
}

function writeBlogIndex(posts) {
  fs.writeFileSync(indexPath, JSON.stringify({ posts }, null, 2), "utf8");
}

function slugify(text) {
  return String(text)
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 64);
}

function titleFromLine(line) {
  const clean = line.replace(/\s+/g, " ").trim();
  if (clean.length <= 78) return clean;
  return `${clean.slice(0, 75).trim()}...`;
}

function excerptFromLine(line, config) {
  const clean = line.replace(/\s+/g, " ").trim();
  return `Uma nota transformada em post a partir do bloco local, filtrada pelo estilo: ${config.style.slice(0, 120)}${config.style.length > 120 ? "..." : ""} Ideia original: ${clean}`;
}

export function createPostFromLine(line, now = new Date()) {
  ensureBlogFiles();
  const cleanLine = String(line || "").trim();
  if (!cleanLine || cleanLine.startsWith("#")) return null;

  const config = readBlogConfig();
  const title = titleFromLine(cleanLine);
  const date = now.toISOString();
  const baseSlug = slugify(title) || "nota";
  const stamp = now
    .toISOString()
    .replace(/[-:]/g, "")
    .replace(/\.\d{3}Z$/, "");
  const slug = `${stamp}-${baseSlug}`;
  const filename = `${slug}.md`;
  const url = `/posts/${filename}`;
  const excerpt = excerptFromLine(cleanLine, config);
  const markdown = [
    "---",
    `title: "${title.replaceAll('"', '\\"')}"`,
    `date: "${date}"`,
    `author: "${config.author.replaceAll('"', '\\"')}"`,
    `source: "blog-inbox.txt"`,
    "---",
    "",
    `# ${title}`,
    "",
    `> ${cleanLine}`,
    "",
    "## Leitura",
    "",
    excerpt,
    "",
    "## Estilo aplicado",
    "",
    config.style,
    "",
    "## Continuidade",
    "",
    "Esta entrada nasceu de uma linha commitada no bloco de notas local. Ela fica salva como Markdown, aparece no indice do blog e pode ser lapidada depois como texto longo.",
    ""
  ].join("\n");

  fs.writeFileSync(path.join(postsDir, filename), markdown, "utf8");

  const posts = readBlogIndex();
  const post = { title, date, author: config.author, style: config.style, sourceLine: cleanLine, excerpt, slug, url };
  writeBlogIndex([post, ...posts].slice(0, 120));
  return post;
}

export function getInboxLines() {
  ensureBlogFiles();
  return fs.readFileSync(inboxPath, "utf8").split(/\r?\n/);
}

export function readState() {
  ensureBlogFiles();
  try {
    return JSON.parse(fs.readFileSync(statePath, "utf8"));
  } catch {
    return { processedLines: 0 };
  }
}

export function writeState(state) {
  fs.writeFileSync(statePath, JSON.stringify(state, null, 2), "utf8");
}
