const fs = require("fs");
const path = require("path");
const { execFileSync } = require("child_process");

const ROOT = path.join(__dirname, "..");

function walk(dir, files = []) {
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    if (entry.name === ".git" || entry.name === "node_modules") continue;
    const fullPath = path.join(dir, entry.name);
    if (entry.isDirectory()) walk(fullPath, files);
    if (entry.isFile() && entry.name === "index.html") files.push(fullPath);
  }
  return files;
}

function canonicalFromHtml(html) {
  if (/<meta[^>]+name=["']robots["'][^>]+noindex/i.test(html)) return null;
  const match = html.match(
    /<link\s+rel=["']canonical["']\s+href=["']([^"']+)["']/i,
  );
  return match ? match[1] : null;
}

function lastmodFromGit(file) {
  const relativePath = path.relative(ROOT, file);
  try {
    const date = execFileSync(
      "git",
      ["log", "-1", "--format=%cs", "--", relativePath],
      { cwd: ROOT, encoding: "utf8" },
    ).trim();
    if (date) return date;
  } catch (_) {
    // Fall back to the filesystem for source archives without git history.
  }
  return fs.statSync(file).mtime.toISOString().slice(0, 10);
}

const entriesByUrl = new Map(
  walk(ROOT)
    .map((file) => ({
      file,
      url: canonicalFromHtml(fs.readFileSync(file, "utf8")),
    }))
    .filter(({ url }) => url && url.startsWith("https://creditreports.dk/"))
    .map(({ file, url }) => [url, { url, lastmod: lastmodFromGit(file) }]),
);

const entries = [...entriesByUrl.values()].sort((a, b) => {
  const aLocale = a.url.includes("/da/") ? 1 : 0;
  const bLocale = b.url.includes("/da/") ? 1 : 0;
  return aLocale - bLocale || a.url.localeCompare(b.url);
});

function priority(url) {
  if (url.endsWith("/en/") || url.endsWith("/da/")) return "1.0";
  if (url.includes("/product") || url.includes("/ai-credit-report/"))
    return "0.8";
  if (url.includes("/pricing/")) return "0.8";
  if (url.includes("/privacy-policy/")) return "0.3";
  return "0.7";
}

function changefreq(url) {
  if (url.endsWith("/en/") || url.endsWith("/da/")) return "weekly";
  if (url.includes("/privacy-policy/")) return "yearly";
  return "monthly";
}

const xml = [
  '<?xml version="1.0" encoding="UTF-8"?>',
  '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">',
  ...entries.map(
    ({ url, lastmod }) => `  <url>
    <loc>${url}</loc>
    <lastmod>${lastmod}</lastmod>
    <changefreq>${changefreq(url)}</changefreq>
    <priority>${priority(url)}</priority>
  </url>`,
  ),
  "</urlset>",
  "",
].join("\n");

fs.writeFileSync(path.join(ROOT, "sitemap.xml"), xml, "utf8");
console.log(`${entries.length} sitemap urls`);
