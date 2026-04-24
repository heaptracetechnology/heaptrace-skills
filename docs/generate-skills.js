#!/usr/bin/env node

/**
 * Generate individual HTML skill pages from SKILL.md files.
 * Run: node docs/generate-skills.js
 * Output: docs/skills/{skill-name}.html
 */

const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

// ── Configuration ──────────────────────────────────────────

const REPO_ROOT = path.resolve(__dirname, '..');
const OUTPUT_DIR = path.join(__dirname, 'skills');

const PACK_MAP = {
  developer:      { label: 'Developer Pack',       color: '#06b6d4', icon: '&#60;/&#62;' },
  architect:      { label: 'Architect Pack',        color: '#8b5cf6', icon: '&#9635;' },
  'lead-engineer':{ label: 'Lead Engineer Pack',    color: '#f59e0b', icon: '&#9733;' },
  qa:             { label: 'QA Pack',               color: '#10b981', icon: '&#10003;' },
  'automation-qa':{ label: 'Automation QA Pack',    color: '#6366f1', icon: '&#9881;' },
  'cloud-engineer':{ label: 'Cloud Engineer Pack', color: '#f97316', icon: '&#9729;' },
  designer:       { label: 'Designer Pack',         color: '#ec4899', icon: '&#9830;' },
  business:       { label: 'Business Pack',         color: '#14b8a6', icon: '&#9733;' },
  mobile:         { label: 'Mobile Pack',           color: '#f43f5e', icon: '&#128241;' },
  compliance:     { label: 'Compliance Pack',       color: '#dc2626', icon: '&#128737;' },
};

// Root-level skills belong to the developer pack
const ROOT_SKILLS = [
  'feature-plan', 'feature-work', 'find-fix', 'smart-commit',
  'suggest', 'code-review', 'test-gen', 'explain', 'sec-audit', 'release-notes',
  'quick-plan', 'quick-work'
];

// ── Find all SKILL.md files ────────────────────────────────

function findSkillFiles() {
  const result = execSync(
    `find "${REPO_ROOT}" -name SKILL.md -not -path '*/node_modules/*' -not -path '*/.git/*'`,
    { encoding: 'utf-8' }
  );
  return result.trim().split('\n').filter(Boolean);
}

// ── Determine pack from file path ──────────────────────────

function getPack(filePath) {
  const rel = path.relative(REPO_ROOT, filePath);
  const parts = rel.split(path.sep);

  // Root-level: e.g. feature-plan/SKILL.md
  if (parts.length === 2 && ROOT_SKILLS.includes(parts[0])) {
    return 'developer';
  }

  // Nested: e.g. architect/api-design/SKILL.md
  const packDir = parts[0];
  if (PACK_MAP[packDir]) return packDir;

  // Fallback
  return 'developer';
}

// ── Parse SKILL.md ─────────────────────────────────────────

function parseSkillFile(filePath) {
  const raw = fs.readFileSync(filePath, 'utf-8');
  const skill = {};

  // Frontmatter
  const fmMatch = raw.match(/^---\s*\n([\s\S]*?)\n---/);
  if (fmMatch) {
    const fm = fmMatch[1];
    const nameMatch = fm.match(/^name:\s*(.+)$/m);
    const descMatch = fm.match(/^description:\s*"?(.+?)"?\s*$/m);
    skill.name = nameMatch ? nameMatch[1].trim() : path.basename(path.dirname(filePath));
    skill.description = descMatch ? descMatch[1].trim() : '';
  }

  // Strip frontmatter
  const content = raw.replace(/^---\s*\n[\s\S]*?\n---\s*\n/, '');

  // Title (first # heading)
  const titleMatch = content.match(/^#\s+(.+)$/m);
  skill.title = titleMatch ? titleMatch[1].trim() : skill.name;

  // Description paragraph (between title and first ---)
  const afterTitle = content.replace(/^#\s+.+$/m, '').trim();
  const descParagraphMatch = afterTitle.match(/^([^#\-].+?)(?:\n\n|\n---)/s);
  skill.descriptionParagraph = descParagraphMatch ? descParagraphMatch[1].trim() : skill.description;

  // Extract sections by ## headings
  skill.expertise = extractSection(content, 'Your Expertise');
  skill.projectConfig = extractSection(content, 'Project Configuration');
  skill.commonRules = extractCommonRules(content);
  skill.workflow = extractWorkflowContent(content);

  // Pack info
  skill.pack = getPack(filePath);
  skill.packInfo = PACK_MAP[skill.pack];
  // Use directory name as ID (safe for filenames), not frontmatter name
  skill.id = path.basename(path.dirname(filePath));
  skill.filePath = filePath;

  return skill;
}

function extractSection(content, heading) {
  // Split content by ## headings, find the one containing our heading text
  const sections = content.split(/\n(?=## )/);
  for (const section of sections) {
    const headingLine = section.match(/^## (.+)/);
    if (headingLine && headingLine[1].includes(heading)) {
      // Return everything after the heading line
      const body = section.replace(/^## .+\n/, '');
      return body.replace(/\n---\s*$/, '').trim();
    }
  }
  return '';
}

function extractCommonRules(content) {
  const section = extractSection(content, 'Common Rules');
  if (!section) return '';
  // Extract the code block content (the ASCII art box)
  const codeMatch = section.match(/```[\s\S]*?\n([\s\S]*?)```/);
  return codeMatch ? codeMatch[1] : section;
}

function extractWorkflowContent(content) {
  // Split by ## headings, find everything after Common Rules section
  const sections = content.split(/\n(?=## )/);
  let foundRules = false;
  const afterSections = [];

  for (const section of sections) {
    if (foundRules) {
      afterSections.push(section);
    }
    const headingLine = section.match(/^## (.+)/);
    if (headingLine && headingLine[1].includes('Common Rules')) {
      foundRules = true;
    }
  }

  const result = afterSections.join('\n')
    .replace(/<!--[\s\S]*?-->[\s\n]*/g, '')  // Remove HTML comments (MIT license, etc.)
    .trim();
  return result;
}

function escapeRegex(str) {
  return str.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}

// ── Markdown to HTML converter ─────────────────────────────

function markdownToHtml(md) {
  if (!md) return '';

  let html = md;

  // Code blocks (``` ... ```)
  html = html.replace(/```([a-zA-Z]*)\n([\s\S]*?)```/g, (_, lang, code) => {
    const escaped = escapeHtml(code.trimEnd());
    return `<pre class="code-block"><code>${escaped}</code></pre>`;
  });

  // Inline code
  html = html.replace(/`([^`\n]+)`/g, '<code class="inline-code">$1</code>');

  // Bold
  html = html.replace(/\*\*(.+?)\*\*/g, '<strong>$1</strong>');

  // Italic
  html = html.replace(/\*(.+?)\*/g, '<em>$1</em>');

  // Horizontal rules
  html = html.replace(/^\n?---\s*$/gm, '<hr class="section-divider">');

  // Tables
  html = html.replace(/(?:^|\n)((?:\|.*\|[ \t]*\n)+)/g, (_, tableBlock) => {
    const rows = tableBlock.trim().split('\n').filter(r => r.trim());
    if (rows.length < 2) return tableBlock;

    const parseRow = (row) => row.split('|').filter((_, i, arr) => i > 0 && i < arr.length).map(c => c.trim());

    // Check if row 2 is a separator
    const isSep = (row) => /^[\s|:-]+$/.test(row);
    let headerRow = parseRow(rows[0]);
    let startIdx = isSep(rows[1]) ? 2 : 1;

    let tableHtml = '<div class="table-wrap"><table><thead><tr>';
    headerRow.forEach(h => { tableHtml += `<th>${h}</th>`; });
    tableHtml += '</tr></thead><tbody>';
    for (let i = startIdx; i < rows.length; i++) {
      if (isSep(rows[i])) continue;
      const cells = parseRow(rows[i]);
      tableHtml += '<tr>';
      cells.forEach(c => { tableHtml += `<td>${c}</td>`; });
      tableHtml += '</tr>';
    }
    tableHtml += '</tbody></table></div>';
    return tableHtml;
  });

  // Headings (must be after code blocks to avoid transforming inside code)
  html = html.replace(/^####\s+(.+)$/gm, '<h4>$1</h4>');
  html = html.replace(/^###\s+(.+)$/gm, '<h3>$1</h3>');
  html = html.replace(/^##\s+(.+)$/gm, '<h2>$1</h2>');

  // Checkbox list items
  html = html.replace(/^- \[x\]\s+(.+)$/gm, '<li class="checkbox checked"><input type="checkbox" checked disabled> $1</li>');
  html = html.replace(/^- \[ \]\s+(.+)$/gm, '<li class="checkbox"><input type="checkbox" disabled> $1</li>');

  // List items
  html = html.replace(/^- (.+)$/gm, '<li>$1</li>');
  html = html.replace(/^(\d+)\.\s+(.+)$/gm, '<li class="ordered">$2</li>');

  // Wrap consecutive <li> in <ul>
  html = html.replace(/((?:<li[^>]*>.*<\/li>\s*)+)/g, '<ul class="skill-list">$1</ul>');

  // Paragraphs: lines that aren't HTML tags and have content
  const lines = html.split('\n');
  const result = [];
  let inBlock = false;

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i];
    const trimmed = line.trim();

    if (trimmed.startsWith('<pre') || trimmed.startsWith('<div class="table')) inBlock = true;
    if (trimmed.startsWith('</pre>') || trimmed.startsWith('</div>')) {
      result.push(line);
      inBlock = false;
      continue;
    }

    if (inBlock) {
      result.push(line);
      continue;
    }

    if (
      trimmed &&
      !trimmed.startsWith('<') &&
      !trimmed.startsWith('>') &&
      !/^#{1,4}\s/.test(trimmed)
    ) {
      result.push(`<p>${trimmed}</p>`);
    } else {
      result.push(line);
    }
  }

  // Clean up blockquotes
  let final = result.join('\n');
  final = final.replace(/^>\s*(.+)$/gm, '<blockquote>$1</blockquote>');

  // Clean up empty paragraphs and double-wrapped
  final = final.replace(/<p>\s*<\/p>/g, '');
  final = final.replace(/<p><(h[234]|ul|li|pre|div|blockquote|hr)/g, '<$1');

  return final;
}

function escapeHtml(str) {
  return str
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');
}

// ── Config subsections parser ──────────────────────────────

function parseConfigSubsections(configContent) {
  if (!configContent) return [];
  const subs = [];
  const parts = configContent.split(/^###\s+/m);
  for (let i = 1; i < parts.length; i++) {
    const lines = parts[i].split('\n');
    const title = lines[0].trim();
    const body = lines.slice(1).join('\n').trim();
    // Extract the <!-- Example: ... --> comment
    const exMatch = body.match(/<!--\s*Example:\s*([\s\S]*?)-->/);
    const example = exMatch ? exMatch[1].trim() : '';
    subs.push({ title, example });
  }
  return subs;
}

// ── HTML page generator ────────────────────────────────────

function generateSkillPage(skill, prevSkill, nextSkill) {
  const packColor = skill.packInfo.color;
  const packLabel = skill.packInfo.label;
  const packIcon = skill.packInfo.icon;

  const configSubs = parseConfigSubsections(skill.projectConfig);
  const workflowHtml = markdownToHtml(skill.workflow);
  const expertiseHtml = markdownToHtml(skill.expertise);

  const configSubsHtml = configSubs.map(sub => `
    <div class="config-subsection">
      <h4>${escapeHtml(sub.title)}</h4>
      ${sub.example ? `<p class="config-example">${escapeHtml(sub.example)}</p>` : '<p class="config-placeholder">Not configured</p>'}
    </div>
  `).join('');

  const prevLink = prevSkill
    ? `<a href="${prevSkill.id}.html" class="skill-nav-link prev"><span class="nav-arrow">&larr;</span><span><span class="nav-label">Previous</span><span class="nav-title">${escapeHtml(prevSkill.title)}</span></span></a>`
    : '<div></div>';
  const nextLink = nextSkill
    ? `<a href="${nextSkill.id}.html" class="skill-nav-link next"><span><span class="nav-label">Next</span><span class="nav-title">${escapeHtml(nextSkill.title)}</span></span><span class="nav-arrow">&rarr;</span></a>`
    : '<div></div>';

  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>${escapeHtml(skill.title)} — Heaptrace Skills</title>
  <meta name="description" content="${escapeHtml(skill.description)}">
  <link rel="preconnect" href="https://fonts.googleapis.com">
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
  <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800&family=JetBrains+Mono:wght@400;500;600&display=swap" rel="stylesheet">
  <link rel="stylesheet" href="../css/styles.css">
  <style>
    /* ── Skill page styles ── */
    .breadcrumb {
      display: flex; align-items: center; gap: 8px;
      padding: 16px 0; font-size: 0.85rem;
      color: var(--text-muted);
    }
    .breadcrumb a {
      color: var(--text-secondary);
      transition: color 0.2s;
    }
    .breadcrumb a:hover { color: var(--cyan); }
    .breadcrumb .sep { color: var(--text-muted); opacity: 0.5; }

    .skill-hero {
      padding: calc(var(--nav-height) + 40px) 0 40px;
      position: relative;
    }
    .skill-hero::before {
      content: ''; position: absolute; inset: 0;
      background: radial-gradient(ellipse 60% 50% at 50% 0%, ${packColor}12, transparent 70%);
      pointer-events: none;
    }
    .skill-hero-inner { position: relative; z-index: 1; max-width: var(--max-width); margin: 0 auto; padding: 0 24px; }

    .skill-pack-badge {
      display: inline-flex; align-items: center; gap: 8px;
      background: ${packColor}15;
      border: 1px solid ${packColor}30;
      color: ${packColor};
      padding: 6px 16px; border-radius: 999px;
      font-size: 0.8rem; font-weight: 600;
      margin-bottom: 20px;
      letter-spacing: 0.04em;
    }
    .skill-pack-badge .icon { font-size: 1rem; }

    .skill-hero h1 {
      font-size: clamp(2rem, 4vw, 3rem);
      font-weight: 800; line-height: 1.15;
      margin-bottom: 16px;
      color: var(--text-primary);
    }
    .skill-hero .description {
      font-size: 1.1rem; color: var(--text-secondary);
      max-width: 700px; line-height: 1.8;
    }

    .skill-content {
      max-width: var(--max-width); margin: 0 auto;
      padding: 0 24px 80px;
    }

    .skill-section {
      margin-bottom: 48px;
    }
    .skill-section-title {
      display: flex; align-items: center; gap: 12px;
      font-size: 1.3rem; font-weight: 700;
      margin-bottom: 20px; color: var(--text-primary);
      padding-bottom: 12px;
      border-bottom: 1px solid var(--border);
    }
    .skill-section-title .icon {
      width: 32px; height: 32px; border-radius: 8px;
      display: flex; align-items: center; justify-content: center;
      font-size: 1.1rem; flex-shrink: 0;
    }

    /* Persona card */
    .persona-card {
      background: linear-gradient(135deg, rgba(6, 182, 212, 0.06), rgba(6, 182, 212, 0.02));
      border: 1px solid rgba(6, 182, 212, 0.15);
      border-radius: var(--radius);
      padding: 28px 32px;
    }
    .persona-card p { color: var(--text-secondary); line-height: 1.8; margin-bottom: 12px; }
    .persona-card strong { color: var(--cyan-light); }
    .persona-card ul { margin: 12px 0; padding-left: 20px; }
    .persona-card li {
      color: var(--text-secondary); line-height: 1.8;
      margin-bottom: 4px; list-style: disc;
    }

    /* Config card */
    .config-card {
      background: linear-gradient(135deg, rgba(139, 92, 246, 0.06), rgba(139, 92, 246, 0.02));
      border: 1px solid rgba(139, 92, 246, 0.15);
      border-radius: var(--radius);
      padding: 28px 32px;
    }
    .config-card > blockquote {
      color: var(--text-muted); font-size: 0.9rem;
      font-style: italic; margin-bottom: 20px;
      padding-left: 16px;
      border-left: 3px solid rgba(139, 92, 246, 0.3);
    }
    .config-subsection {
      padding: 16px 0;
      border-bottom: 1px solid rgba(139, 92, 246, 0.1);
    }
    .config-subsection:last-child { border-bottom: none; }
    .config-subsection h4 {
      font-size: 0.95rem; font-weight: 600;
      color: var(--purple-light); margin-bottom: 6px;
    }
    .config-example {
      font-family: 'JetBrains Mono', monospace;
      font-size: 0.82rem; color: var(--text-secondary);
      background: rgba(139, 92, 246, 0.06);
      padding: 8px 12px; border-radius: 6px;
    }
    .config-placeholder {
      color: var(--text-muted); font-size: 0.85rem; font-style: italic;
    }

    /* Rules block */
    .rules-block {
      background: var(--bg-code);
      border: 1px solid var(--border);
      border-radius: var(--radius);
      padding: 24px 28px;
      overflow-x: auto;
    }
    .rules-block pre {
      font-family: 'JetBrains Mono', monospace;
      font-size: 0.78rem;
      line-height: 1.6;
      color: var(--text-secondary);
      white-space: pre;
      margin: 0;
    }

    /* Workflow content */
    .workflow-content {
      color: var(--text-secondary);
      line-height: 1.8;
    }
    .workflow-content h2 {
      font-size: 1.25rem; font-weight: 700;
      color: var(--text-primary);
      margin: 36px 0 16px;
      padding-bottom: 8px;
      border-bottom: 1px solid var(--border);
    }
    .workflow-content h2:first-child { margin-top: 0; }
    .workflow-content h3 {
      font-size: 1.05rem; font-weight: 600;
      color: var(--text-primary);
      margin: 24px 0 12px;
    }
    .workflow-content h4 {
      font-size: 0.95rem; font-weight: 600;
      color: var(--text-primary);
      margin: 20px 0 10px;
    }
    .workflow-content p {
      margin-bottom: 12px;
    }
    .workflow-content .code-block {
      background: var(--bg-code);
      border: 1px solid var(--border);
      border-radius: var(--radius-sm);
      padding: 20px 24px;
      overflow-x: auto;
      margin: 16px 0;
      font-family: 'JetBrains Mono', monospace;
      font-size: 0.8rem;
      line-height: 1.6;
      color: var(--text-secondary);
      white-space: pre;
    }
    .workflow-content .code-block code {
      font-family: inherit;
      background: none;
      padding: 0;
      border: none;
      font-size: inherit;
    }
    .workflow-content .inline-code {
      background: rgba(6, 182, 212, 0.1);
      border: 1px solid rgba(6, 182, 212, 0.15);
      padding: 2px 7px;
      border-radius: 4px;
      font-family: 'JetBrains Mono', monospace;
      font-size: 0.82em;
      color: var(--cyan-light);
    }
    .workflow-content .skill-list {
      margin: 12px 0;
      padding-left: 20px;
      list-style: none;
    }
    .workflow-content .skill-list li {
      margin-bottom: 6px;
      position: relative;
      padding-left: 16px;
    }
    .workflow-content .skill-list li::before {
      content: '\\2022';
      color: ${packColor};
      position: absolute;
      left: 0;
      font-weight: bold;
    }
    .workflow-content .skill-list li.checkbox,
    .workflow-content .skill-list li.ordered {
      padding-left: 0;
    }
    .workflow-content .skill-list li.checkbox::before,
    .workflow-content .skill-list li.ordered::before {
      display: none;
    }
    .workflow-content .skill-list li.checkbox input {
      margin-right: 8px;
      accent-color: ${packColor};
    }
    .workflow-content blockquote {
      border-left: 3px solid ${packColor};
      padding: 12px 16px;
      margin: 16px 0;
      color: var(--text-muted);
      background: ${packColor}08;
      border-radius: 0 8px 8px 0;
    }
    .workflow-content hr {
      border: none;
      border-top: 1px solid var(--border);
      margin: 32px 0;
    }
    .workflow-content .table-wrap {
      overflow-x: auto;
      margin: 16px 0;
      border-radius: var(--radius-sm);
      border: 1px solid var(--border);
    }
    .workflow-content table {
      width: 100%;
      border-collapse: collapse;
      font-size: 0.875rem;
    }
    .workflow-content th {
      background: var(--bg-elevated);
      color: var(--text-primary);
      font-weight: 600;
      text-align: left;
      padding: 10px 14px;
      border-bottom: 1px solid var(--border);
    }
    .workflow-content td {
      padding: 10px 14px;
      border-bottom: 1px solid var(--border);
      color: var(--text-secondary);
    }
    .workflow-content tr:last-child td { border-bottom: none; }
    .workflow-content tr:hover td { background: rgba(255,255,255,0.02); }

    /* Skill navigation */
    .skill-nav {
      display: flex; justify-content: space-between; gap: 24px;
      padding-top: 40px;
      border-top: 1px solid var(--border);
      margin-top: 60px;
    }
    .skill-nav-link {
      display: flex; align-items: center; gap: 16px;
      background: var(--bg-card);
      border: 1px solid var(--border);
      border-radius: var(--radius-md);
      padding: 16px 24px;
      transition: var(--transition);
      flex: 1;
      max-width: 48%;
      text-decoration: none;
    }
    .skill-nav-link:hover {
      border-color: ${packColor}50;
      background: var(--bg-card-hover);
      box-shadow: 0 0 20px ${packColor}10;
    }
    .skill-nav-link.next { text-align: right; justify-content: flex-end; }
    .skill-nav-link .nav-arrow {
      font-size: 1.2rem; color: ${packColor};
      flex-shrink: 0;
    }
    .skill-nav-link .nav-label {
      display: block;
      font-size: 0.75rem; color: var(--text-muted);
      text-transform: uppercase; letter-spacing: 0.08em;
      margin-bottom: 4px;
    }
    .skill-nav-link .nav-title {
      display: block;
      font-size: 0.9rem; font-weight: 600;
      color: var(--text-primary);
    }

    .skill-footer {
      text-align: center;
      padding: 40px 24px;
      border-top: 1px solid var(--border);
      color: var(--text-muted);
      font-size: 0.85rem;
    }
    .skill-footer a {
      color: var(--cyan);
      text-decoration: none;
    }
    .skill-footer a:hover { text-decoration: underline; }

    @media (max-width: 640px) {
      .skill-nav { flex-direction: column; }
      .skill-nav-link { max-width: 100%; }
      .skill-hero h1 { font-size: 1.8rem; }
      .persona-card, .config-card, .rules-block { padding: 20px; }
    }
  </style>
</head>
<body>

<!-- Navigation -->
<nav class="nav">
  <div class="nav-inner">
    <a href="../index.html" class="nav-logo">
      <div class="nav-logo-icon">H</div>
      <span>Heaptrace Skills</span>
    </a>
    <div class="nav-links" id="navLinks">
      <a href="../index.html" class="nav-link">Home</a>
      <a href="../index.html#packs" class="nav-link">Packs</a>
      <a href="../setup/index.html" class="nav-link">Setup</a>
      <a href="../customize/index.html" class="nav-link">Customize</a>
      <a href="../rules/index.html" class="nav-link">Rules</a>
      <a href="../mcp/index.html" class="nav-link">MCP Servers</a>
    </div>
    <a href="https://github.com/heaptracetechnology/heaptrace-skills" target="_blank" rel="noopener" class="nav-cta">
      <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor"><path d="M12 0C5.37 0 0 5.37 0 12c0 5.31 3.435 9.795 8.205 11.385.6.105.825-.255.825-.57 0-.285-.015-1.23-.015-2.235-3.015.555-3.795-.735-4.035-1.41-.135-.345-.72-1.41-1.23-1.695-.42-.225-1.02-.78-.015-.795.945-.015 1.62.87 1.845 1.23 1.08 1.815 2.805 1.305 3.495.99.105-.78.42-1.305.765-1.605-2.67-.3-5.46-1.335-5.46-5.925 0-1.305.465-2.385 1.23-3.225-.12-.3-.54-1.53.12-3.18 0 0 1.005-.315 3.3 1.23.96-.27 1.98-.405 3-.405s2.04.135 3 .405c2.295-1.56 3.3-1.23 3.3-1.23.66 1.65.24 2.88.12 3.18.765.84 1.23 1.905 1.23 3.225 0 4.605-2.805 5.625-5.475 5.925.435.375.81 1.095.81 2.22 0 1.605-.015 2.895-.015 3.3 0 .315.225.69.825.57A12.02 12.02 0 0024 12c0-6.63-5.37-12-12-12z"/></svg>
      GitHub
    </a>
    <button class="nav-toggle" id="navToggle" onclick="document.getElementById('navLinks').classList.toggle('open')" aria-label="Toggle navigation">
      <svg width="24" height="24" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><path d="M4 6h16M4 12h16M4 18h16"/></svg>
    </button>
  </div>
</nav>

<!-- Hero -->
<section class="skill-hero">
  <div class="skill-hero-inner">
    <div class="breadcrumb">
      <a href="../index.html">Home</a>
      <span class="sep">/</span>
      <a href="../index.html#packs">${escapeHtml(packLabel)}</a>
      <span class="sep">/</span>
      <span>${escapeHtml(skill.title)}</span>
    </div>

    <div class="skill-pack-badge">
      <span class="icon">${packIcon}</span>
      ${escapeHtml(packLabel)}
    </div>

    <h1>${escapeHtml(skill.title)}</h1>
    <p class="description">${escapeHtml(skill.descriptionParagraph)}</p>
  </div>
</section>

<!-- Content -->
<div class="skill-content">

  <!-- Expert Persona -->
  ${skill.expertise ? `
  <div class="skill-section">
    <div class="skill-section-title">
      <span class="icon" style="background: rgba(6, 182, 212, 0.12); color: var(--cyan);">&#129504;</span>
      Expert Persona
    </div>
    <div class="persona-card">
      ${expertiseHtml}
    </div>
  </div>
  ` : ''}

  <!-- Project Configuration -->
  ${configSubs.length > 0 ? `
  <div class="skill-section">
    <div class="skill-section-title">
      <span class="icon" style="background: rgba(139, 92, 246, 0.12); color: var(--purple);">&#9881;</span>
      Project Configuration
    </div>
    <div class="config-card">
      <blockquote>Customize this skill for your project. Fill in what applies, delete what doesn't.</blockquote>
      ${configSubsHtml}
    </div>
  </div>
  ` : ''}

  <!-- Common Rules -->
  ${skill.commonRules ? `
  <div class="skill-section">
    <div class="skill-section-title">
      <span class="icon" style="background: rgba(239, 68, 68, 0.12); color: var(--red);">&#9888;</span>
      Common Rules
    </div>
    <div class="rules-block">
      <pre>${escapeHtml(skill.commonRules)}</pre>
    </div>
  </div>
  ` : ''}

  <!-- Workflow & Process -->
  ${skill.workflow ? `
  <div class="skill-section">
    <div class="skill-section-title">
      <span class="icon" style="background: ${packColor}18; color: ${packColor};">&#9654;</span>
      Workflow &amp; Process
    </div>
    <div class="workflow-content">
      ${workflowHtml}
    </div>
  </div>
  ` : ''}

  <!-- Prev / Next Navigation -->
  <div class="skill-nav">
    ${prevLink}
    ${nextLink}
  </div>

</div>

<!-- Footer -->
<footer class="skill-footer">
  <p>
    <a href="../index.html">Heaptrace Skills</a> &mdash;
    99 production-grade skills for development teams.
    <a href="https://github.com/heaptracetechnology/heaptrace-skills" target="_blank" rel="noopener">GitHub</a>
  </p>
</footer>

</body>
</html>`;
}

// ── Main ───────────────────────────────────────────────────

function main() {
  console.log('Finding SKILL.md files...');
  const files = findSkillFiles();
  console.log(`Found ${files.length} SKILL.md files`);

  // Parse all skills
  const skills = files.map(f => parseSkillFile(f));

  // Group by pack for prev/next navigation
  const byPack = {};
  for (const s of skills) {
    if (!byPack[s.pack]) byPack[s.pack] = [];
    byPack[s.pack].push(s);
  }

  // Sort within each pack alphabetically
  for (const pack of Object.keys(byPack)) {
    byPack[pack].sort((a, b) => a.name.localeCompare(b.name));
  }

  // Ensure output directory
  if (!fs.existsSync(OUTPUT_DIR)) {
    fs.mkdirSync(OUTPUT_DIR, { recursive: true });
  }

  let generated = 0;

  for (const pack of Object.keys(byPack)) {
    const packSkills = byPack[pack];
    for (let i = 0; i < packSkills.length; i++) {
      const skill = packSkills[i];
      const prev = i > 0 ? packSkills[i - 1] : null;
      const next = i < packSkills.length - 1 ? packSkills[i + 1] : null;

      const html = generateSkillPage(skill, prev, next);
      const outFile = path.join(OUTPUT_DIR, `${skill.id}.html`);
      fs.writeFileSync(outFile, html, 'utf-8');
      generated++;
    }
  }

  console.log(`Generated ${generated} HTML files in docs/skills/`);

  // List by pack
  for (const [pack, packSkills] of Object.entries(byPack)) {
    console.log(`  ${PACK_MAP[pack].label}: ${packSkills.length} skills`);
  }
}

main();
