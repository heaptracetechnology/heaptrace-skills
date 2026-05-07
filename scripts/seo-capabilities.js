#!/usr/bin/env node
/**
 * SEO enhancement script for the Heaptrace AI Capabilities site.
 *
 * Idempotent — re-runnable. For each HTML file in docs/capabilities/:
 *   1. Reads existing <title> and <meta name="description">
 *   2. Injects (only if missing):
 *      - <meta property="og:type">
 *      - <meta property="og:title">
 *      - <meta property="og:description">
 *      - <meta property="og:url">
 *      - <meta property="og:site_name">
 *      - <meta property="og:image">
 *      - <meta name="twitter:card">
 *      - <meta name="twitter:title">
 *      - <meta name="twitter:description">
 *      - <link rel="canonical">
 *      - <meta name="theme-color">
 *      - <meta name="robots" content="index, follow">
 *
 * Also generates a sitemap.xml covering all capability pages.
 */

const fs = require('fs');
const path = require('path');

const ROOT = path.resolve(__dirname, '..');
const CAP_DIR = path.join(ROOT, 'docs', 'capabilities');
const BASE_URL = 'https://heaptracetechnology.github.io/heaptrace-skills/capabilities';
const SITE_NAME = 'Heaptrace AI Capabilities';
const OG_IMAGE = `${BASE_URL}/og-image.png`; // Placeholder — image can be added later

// ── Walk HTML files ────────────────────────────────────────
function walkHtmlFiles(dir) {
  const out = [];
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) {
      out.push(...walkHtmlFiles(full));
    } else if (entry.name.endsWith('.html')) {
      out.push(full);
    }
  }
  return out;
}

// ── Extract title ──────────────────────────────────────────
function getTitle(html) {
  const m = html.match(/<title>([^<]+)<\/title>/);
  return m ? m[1].trim() : null;
}

// ── Extract description ────────────────────────────────────
function getDescription(html) {
  const m = html.match(/<meta\s+name="description"\s+content="([^"]+)"/);
  return m ? m[1].trim() : null;
}

// ── Compute canonical URL from file path ───────────────────
function canonicalUrl(filePath) {
  const rel = path.relative(CAP_DIR, filePath).replace(/\\/g, '/');
  // Special-case index.html → directory URL
  let url;
  if (rel === 'index.html') {
    url = `${BASE_URL}/`;
  } else if (rel.endsWith('/index.html')) {
    url = `${BASE_URL}/${rel.slice(0, -'index.html'.length)}`;
  } else {
    url = `${BASE_URL}/${rel}`;
  }
  return url;
}

// ── Build SEO meta block ───────────────────────────────────
function buildMetaBlock(title, description, canonical) {
  const escape = (s) =>
    s.replace(/&/g, '&amp;').replace(/"/g, '&quot;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
  const t = escape(title);
  const d = escape(description || '');
  const u = canonical;

  return `  <!-- SEO -->
  <link rel="canonical" href="${u}">
  <meta name="robots" content="index, follow">
  <meta name="theme-color" content="#10b981">

  <!-- Open Graph -->
  <meta property="og:type" content="website">
  <meta property="og:title" content="${t}">
  <meta property="og:description" content="${d}">
  <meta property="og:url" content="${u}">
  <meta property="og:site_name" content="${SITE_NAME}">
  <meta property="og:image" content="${OG_IMAGE}">

  <!-- Twitter -->
  <meta name="twitter:card" content="summary_large_image">
  <meta name="twitter:title" content="${t}">
  <meta name="twitter:description" content="${d}">
  <meta name="twitter:image" content="${OG_IMAGE}">
`;
}

// ── Inject meta block after the description tag ────────────
function injectMeta(html, metaBlock) {
  // If canonical link already exists, skip — idempotent
  if (/<link\s+rel="canonical"/i.test(html)) return null;

  // Insert before the first <link rel="stylesheet"> or </head>
  const insertPoint =
    html.indexOf('<link rel="stylesheet"') >= 0
      ? html.indexOf('<link rel="stylesheet"')
      : html.indexOf('</head>');

  if (insertPoint < 0) return null;

  return html.slice(0, insertPoint) + metaBlock + '\n  ' + html.slice(insertPoint);
}

// ── Process a single file ──────────────────────────────────
function processFile(filePath) {
  const html = fs.readFileSync(filePath, 'utf-8');
  const title = getTitle(html);
  const description = getDescription(html);
  const canonical = canonicalUrl(filePath);

  if (!title) {
    return { file: filePath, action: 'skipped', reason: 'no <title>' };
  }
  if (!description) {
    return { file: filePath, action: 'warning', reason: 'no description' };
  }

  const metaBlock = buildMetaBlock(title, description, canonical);
  const updated = injectMeta(html, metaBlock);

  if (updated === null) {
    return { file: filePath, action: 'already-has-canonical' };
  }

  fs.writeFileSync(filePath, updated, 'utf-8');
  return { file: filePath, action: 'updated', canonical };
}

// ── Generate sitemap.xml ───────────────────────────────────
function generateSitemap(files) {
  const today = new Date().toISOString().split('T')[0];
  const urls = files
    .map((f) => {
      const url = canonicalUrl(f);
      // Priority heuristic: index.html top, capability/industry/service hubs next, detail pages last
      const rel = path.relative(CAP_DIR, f);
      let priority = '0.6';
      let changefreq = 'monthly';
      if (rel === 'index.html') {
        priority = '1.0';
        changefreq = 'weekly';
      } else if (rel.endsWith('/index.html')) {
        priority = '0.9';
        changefreq = 'weekly';
      } else if (rel === 'team.html' || rel === 'contact.html') {
        priority = '0.8';
      } else if (rel.startsWith('case-study/')) {
        priority = '0.7';
      }
      return `  <url>
    <loc>${url}</loc>
    <lastmod>${today}</lastmod>
    <changefreq>${changefreq}</changefreq>
    <priority>${priority}</priority>
  </url>`;
    })
    .join('\n');

  const sitemap = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${urls}
</urlset>
`;

  fs.writeFileSync(path.join(CAP_DIR, 'sitemap.xml'), sitemap, 'utf-8');
  return path.join(CAP_DIR, 'sitemap.xml');
}

// ── Main ───────────────────────────────────────────────────
function main() {
  const files = walkHtmlFiles(CAP_DIR).filter((f) => !f.endsWith('404.html'));

  console.log(`Processing ${files.length} HTML files in docs/capabilities/...`);
  const results = { updated: 0, skipped: 0, warned: 0, alreadyDone: 0 };

  for (const file of files) {
    const r = processFile(file);
    const rel = path.relative(CAP_DIR, file);
    if (r.action === 'updated') {
      results.updated++;
      console.log(`  ✓ ${rel}`);
    } else if (r.action === 'already-has-canonical') {
      results.alreadyDone++;
    } else if (r.action === 'warning') {
      results.warned++;
      console.warn(`  ⚠ ${rel} — ${r.reason}`);
    } else {
      results.skipped++;
      console.warn(`  ⊘ ${rel} — ${r.reason}`);
    }
  }

  console.log(`\nSEO injection: ${results.updated} updated, ${results.alreadyDone} already done, ${results.warned} warned, ${results.skipped} skipped.\n`);

  const sitemapPath = generateSitemap(files);
  console.log(`Sitemap written: ${path.relative(ROOT, sitemapPath)}`);
  console.log(`  ${files.length} URLs included.`);
}

main();
