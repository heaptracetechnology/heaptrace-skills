#!/usr/bin/env node
/**
 * Generate sitemap.xml for the main Heaptrace Skills site.
 * Excludes the capabilities/ subsite (which has its own sitemap)
 * and the password-gated methodology.html.
 */

const fs = require('fs');
const path = require('path');

const ROOT = path.resolve(__dirname, '..');
const DOCS_DIR = path.join(ROOT, 'docs');
const BASE_URL = 'https://heaptracetechnology.github.io/heaptrace-skills';

// Walk HTML files, excluding capabilities subsite
function walkHtmlFiles(dir, exclude = []) {
  const out = [];
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    const full = path.join(dir, entry.name);
    const rel = path.relative(DOCS_DIR, full);
    if (exclude.some((e) => rel.startsWith(e))) continue;
    if (entry.isDirectory()) {
      out.push(...walkHtmlFiles(full, exclude));
    } else if (entry.name.endsWith('.html')) {
      // Skip methodology.html (password gated), 404.html, announcement-email.html, index-v1.html
      if (
        rel === 'methodology.html' ||
        rel === '404.html' ||
        rel === 'announcement-email.html' ||
        rel === 'index-v1.html'
      )
        continue;
      out.push(full);
    }
  }
  return out;
}

function canonicalUrl(filePath) {
  const rel = path.relative(DOCS_DIR, filePath).replace(/\\/g, '/');
  if (rel === 'index.html') return `${BASE_URL}/`;
  if (rel.endsWith('/index.html')) return `${BASE_URL}/${rel.slice(0, -'index.html'.length)}`;
  return `${BASE_URL}/${rel}`;
}

function priorityFor(rel) {
  if (rel === 'index.html') return { p: '1.0', f: 'weekly' };
  if (rel.startsWith('packs/')) return { p: '0.9', f: 'monthly' };
  if (rel === 'compliance-overview.html' || rel === 'ci-cd-security.html')
    return { p: '0.9', f: 'monthly' };
  if (rel === 'cicd-security-setup.html') return { p: '0.8', f: 'monthly' };
  if (rel.startsWith('skills/')) return { p: '0.7', f: 'monthly' };
  if (rel.startsWith('setup/') || rel.startsWith('customize/') || rel.startsWith('rules/') || rel.startsWith('mcp/'))
    return { p: '0.8', f: 'monthly' };
  return { p: '0.6', f: 'monthly' };
}

function main() {
  const files = walkHtmlFiles(DOCS_DIR, ['capabilities']);
  const today = new Date().toISOString().split('T')[0];

  const urls = files
    .map((f) => {
      const rel = path.relative(DOCS_DIR, f).replace(/\\/g, '/');
      const url = canonicalUrl(f);
      const { p, f: freq } = priorityFor(rel);
      return `  <url>
    <loc>${url}</loc>
    <lastmod>${today}</lastmod>
    <changefreq>${freq}</changefreq>
    <priority>${p}</priority>
  </url>`;
    })
    .join('\n');

  const sitemap = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${urls}
</urlset>
`;

  fs.writeFileSync(path.join(DOCS_DIR, 'sitemap.xml'), sitemap, 'utf-8');
  console.log(`Sitemap written: docs/sitemap.xml (${files.length} URLs)`);
}

main();
