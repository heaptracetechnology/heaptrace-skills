# Heaptrace AI Capabilities — Information Pack

> Source-of-truth document for the `docs/capabilities/` site. All content decisions, industry/capability scope, engagement models, and team positioning live here. Update this file first, then the site.

---

## Site Identity

| Attribute | Value |
|-----------|-------|
| **Name** | Heaptrace AI Capabilities |
| **URL** | `https://heaptracetechnology.github.io/heaptrace-skills/capabilities/` |
| **Tagline** | "Production Agentic AI for the Enterprise. Built. Deployed. Retained." |
| **Audience** | Enterprise CTO, CIO, VP Engineering, Head of Digital Transformation |
| **Tone** | Confident-corporate. Direct. Technical. No hype. |
| **Accent color** | Emerald `#10b981` (distinct from Skills' cyan, Methodology's purple, Compliance's red) |

---

## Three Narrative Pillars

Every page on the site reinforces these three messages:

1. **Production-Grade Engineering.** We engineer agentic AI like production software. Methodology, review, testing, traceability — all of it.
2. **Domain Fluency.** We've shipped agentic AI in healthcare, fintech, enterprise SaaS, edtech, and more. We understand your industry — not just the technology.
3. **Flexible Engagement.** Hire a team. Buy a system. Or both. Four engagement models built around how enterprises actually buy AI work.

---

## Capability Inventory (10)

Each capability has its own page in `docs/capabilities/capability/{slug}.html`.

| # | Capability | Slug | One-liner |
|---|------------|------|-----------|
| 1 | Agentic Workflow Automation | `agentic-automation` | Multi-step AI agents that complete real business workflows end-to-end |
| 2 | Document Intelligence | `document-intelligence` | Summarization, extraction, classification, and Q&A across long-form documents |
| 3 | Vision AI | `vision-ai` | Image recognition, OCR, document parsing, and medical-grade imaging analysis |
| 4 | Knowledge Graphs | `knowledge-graphs` | Text-to-graph extraction, entity linking, semantic search across structured knowledge |
| 5 | Content Generation | `content-generation` | High-volume, brand-consistent email, ad, and marketing copy generation |
| 6 | Localization & Globalization | `localization` | Multi-language content, locale-aware UI, regulated-region compliance |
| 7 | AI-Driven QA Automation | `ai-qa-automation` | Self-healing test suites, generated test cases, AI-led regression coverage |
| 8 | AI-First Software Engineering | `ai-software-engineering` | Skills-driven development (links to Heaptrace Skills product) |
| 9 | Data Engineering & ETL | `data-engineering` | Enterprise data warehousing, ETL pipelines, data archival, AI-assisted transformation |
| 10 | B2B Business Workflow Automation | `b2b-workflow-automation` | End-to-end agentic automation of cross-system business processes |

---

## Industry Verticals (8)

Each industry has its own page in `docs/capabilities/industry/{slug}.html`. Top-priority industries are starred ★.

| # | Industry | Slug | Status |
|---|----------|------|--------|
| 1 | Healthcare ★ | `healthcare` | Top priority — proven (medical imaging, HIPAA workflows) |
| 2 | Financial Services & Fintech ★ | `financial-services` | Top priority |
| 3 | Enterprise SaaS ★ | `enterprise-saas` | Top priority — your platform clients |
| 4 | EdTech ★ | `edtech` | Top priority — proven (course generation, grading) |
| 5 | Logistics & Supply Chain | `logistics` | Active |
| 6 | Manufacturing | `manufacturing` | Active |
| 7 | Government & Public Sector | `government` | Active |
| 8 | Retail & Media | `retail-media` | Active |

---

## Engagement Models (4)

Each engagement model has its own page in `docs/capabilities/service/{slug}.html`.

| # | Model | Slug | Best For |
|---|-------|------|----------|
| 1 | **Team Retention** ★ (flagship) | `team-retention` | Long-term embedded agentic AI team. Highest LTV. The signature offering. |
| 2 | Automate Existing Business | `automate-existing` | Drop-in agentic AI on running operations |
| 3 | Greenfield AI Build | `greenfield-build` | Net-new AI applications and platforms |
| 4 | Hybrid API + Automation | `hybrid-api` | Embed APIs into client systems alongside agent automation |

---

## Team Positioning

- **Size**: 200+ engineers
- **Geography**: Multiple countries (global delivery)
- **Composition**:
  - AI-First Engineering Team
  - AI-Driven QA Automation Team
  - Cloud & DevOps Automation Team
  - AI Sales / RevOps Automation Team
  - Agentic AI Delivery Team (the team clients retain)
  - Data Engineering Team
  - Compliance & Security Team
- **Leadership**: CTO, VP Engineering, Lead AI Architects, Domain Specialists, Project Managers, Solution Architects
- **No photos / no individual names** in this iteration. Show capabilities, leadership roles, team composition. Refine later if needed.

---

## Case Study Pattern

Each case study page in `docs/capabilities/case-study/{slug}.html` follows this structure:

- Industry × Capability × Engagement Model
- Anonymized client (industry + size descriptor — e.g., "Mid-market healthcare SaaS, ~500 employees")
- The Problem (1 paragraph)
- The Heaptrace Approach (2-3 paragraphs)
- Outcomes (2-4 measurable results)
- Optional anonymized quote
- "Capabilities used" + "Engagement model" sidebar links

All case studies marked as **illustrative / representative** in the footer until real data replaces them.

---

## Lead Capture

- Primary CTA: `mailto:hello@heaptrace.com?subject=Capability Demo Request`
- Secondary CTAs (per page): `mailto:capability@heaptrace.com`, `mailto:retention@heaptrace.com`, `mailto:industry@heaptrace.com`
- Forms / CRM integration: deferred to post-Phase 5

---

## Visual Identity

### Theme Variants

| Variant | Used On | Tone |
|---------|---------|------|
| **Tech Dark** | Capabilities, Methodology bridge, Service pages | Same as existing site, emerald accent |
| **Soft Dark** | Case studies, Team, Home | Lighter feel — more whitespace, larger imagery, fewer cards |

### Color Tokens (extending existing styles.css)

- `--cap-emerald: #10b981`
- `--cap-emerald-light: #34d399`
- `--cap-emerald-glow: rgba(16, 185, 129, 0.15)`
- `--cap-soft-bg: #0d1320` (slightly different from main `--bg-primary`)

### Typography
- Same Inter + JetBrains Mono as the rest of the site

---

## Phase Plan

| Phase | Scope | Status |
|-------|-------|--------|
| **0** | This document + folder structure | Done |
| **1A** | Shared CSS + home page + capabilities hub overview | In progress |
| **1B** | 10 capability detail pages | Pending |
| **2** | 8 industry vertical pages | Pending |
| **3** | 4 service pages + 6+ case study pages | Pending |
| **4** | Team page + contact page + methodology bridge | Pending |
| **5** | SEO, sitemap, performance, analytics | Pending |

---

## File Structure

```
docs/capabilities/
├─ INFORMATION-PACK.md        ← this file (internal reference)
├─ index.html                 ← home page
├─ css/
│   └─ main.css               ← shared styles (extends ../css/styles.css)
├─ capability/                ← 10 capability pages
│   ├─ index.html             ← capabilities hub overview
│   ├─ agentic-automation.html
│   ├─ document-intelligence.html
│   ├─ vision-ai.html
│   ├─ knowledge-graphs.html
│   ├─ content-generation.html
│   ├─ localization.html
│   ├─ ai-qa-automation.html
│   ├─ ai-software-engineering.html
│   ├─ data-engineering.html
│   └─ b2b-workflow-automation.html
├─ industry/                  ← 8 industry pages (Phase 2)
├─ service/                   ← 4 engagement-model pages (Phase 3)
├─ case-study/                ← 6+ case study pages (Phase 3)
├─ team.html                  ← Phase 4
├─ contact.html               ← Phase 4
└─ methodology.html           ← Phase 4 (bridge to existing /methodology.html)
```
