<p align="center">
  <img src="https://img.shields.io/badge/Skills-105-06b6d4?style=for-the-badge&labelColor=0f172a" alt="105 Skills">
  <img src="https://img.shields.io/badge/Plugins-10-a855f7?style=for-the-badge&labelColor=0f172a" alt="10 Plugins">
  <img src="https://img.shields.io/badge/Claude_Code-Plugin-10b981?style=for-the-badge&labelColor=0f172a" alt="Claude Code Plugin">
  <img src="https://img.shields.io/badge/License-MIT-f59e0b?style=for-the-badge&labelColor=0f172a" alt="MIT License">
</p>

<h1 align="center">Heaptrace Developer Skills</h1>

<p align="center">
  <strong>105 structured skills for development teams — from planning to release.</strong><br>
  Every skill comes with step-by-step guides, flow diagrams, checklists, templates, and anti-patterns.
</p>

<p align="center">
  <a href="https://lmsht.com/skills">📖 Browse Skills</a>
</p>

---

## Quick Setup

### Claude Code Plugin (Recommended)

This repo is a native **Claude Code plugin**. Install individual packs directly from within Claude Code:

1. Open Claude Code in your project
2. Run `/install-plugin` and point it to this repo, or add to your `settings.json`:

```json
{
  "plugins": [
    { "source": "https://github.com/heaptracetechnology/heaptrace-skills", "plugin": "heaptrace-dev" },
    { "source": "https://github.com/heaptracetechnology/heaptrace-skills", "plugin": "heaptrace-architect" }
  ]
}
```

Install only the packs your team needs. Each plugin is listed in `.claude-plugin/marketplace.json`.

---

### Manual Setup (Claude Code & Cursor)

Clone and copy individual plugin skills to your tool's skills directory.

```bash
git clone https://github.com/heaptracetechnology/heaptrace-skills.git
```

#### Claude Code

```bash
# Copy a specific plugin's skills (e.g. developer pack)
cp -r heaptrace-skills/plugins/heaptrace-dev/skills/* your-project/.claude/skills/

# Copy all plugins at once
for plugin in heaptrace-skills/plugins/*/; do
  cp -r "$plugin/skills/"* your-project/.claude/skills/
done
```

**Path:** `.claude/skills/<skill-name>/SKILL.md`

#### Cursor

```bash
# Copy a specific plugin's skills
cp -r heaptrace-skills/plugins/heaptrace-dev/skills/* your-project/.cursor/skills/
```

**Path:** `.cursor/skills/<skill-name>/skill.md`

### Add to .gitignore

Skills are **personal tools** — don't commit them to your project repo:

```bash
echo ".claude/skills/" >> .gitignore
echo ".cursor/skills/" >> .gitignore
```

---

## What Are Skills?

Skills are structured instruction files that guide AI coding assistants through specific development tasks. Instead of writing prompts from scratch, skills give consistent, battle-tested processes your entire team can follow.

```
Client gives a task
    → /suggest       (what's missing? what can we add?)
    → /feature-plan  (break it down, plan it)
    → /feature-work  (build it end-to-end)
    → /code-review   (catch issues before PR)
    → /smart-commit  (clean commit message)
    → /release-notes (client-ready changelog)
```

---

## Skill Packs

### 🔷 Developer (13 skills)

The daily toolkit for every developer.

| Skill | What It Does |
|-------|-------------|
| `feature-plan` | Break requirements into tasks, mockups, and flow diagrams |
| `feature-work` | Build end-to-end: DB → API → UI → Test |
| `find-fix` | Trace bugs: reproduce → isolate → root cause → fix → verify |
| `smart-commit` | Generate semantic commit messages (WHY, not WHAT) |
| `suggest` | Spot gaps and suggest improvements clients didn't ask for |
| `code-review` | 8-pass review: logic, security, perf, naming, tests |
| `test-gen` | Generate tests that catch real bugs, not just pass |
| `explain` | Understand any code before you touch it |
| `sec-audit` | OWASP Top 10, secrets scan, dependency check |
| `release-notes` | Turn git history into client-ready changelogs |
| `quick-plan` | Rapid planning for small, well-scoped tasks |
| `quick-work` | Fast execution mode for clearly defined tasks |
| `code-standards` | Enforce and document team coding standards |

### 🟡 Lead Engineer (9 skills)

For tech leads managing teams and making architectural decisions.

| Skill | What It Does |
|-------|-------------|
| `sprint-plan` | Break epics into sprints with estimates and assignments |
| `arch-review` | Audit architecture for scalability, coupling, SPOFs |
| `tech-debt-audit` | Find and prioritize tech debt across the codebase |
| `incident-response` | Structured triage, root cause analysis, postmortem |
| `pr-strategy` | Split large features into reviewable PRs |
| `onboard-dev` | Generate onboarding guide for new team members |
| `perf-audit` | Profile slow endpoints, N+1 queries, memory leaks |
| `decision-doc` | Write Architecture Decision Records (ADRs) |
| `message-craft` | Craft clear technical messages and stakeholder updates |

### 🟣 Technical Architect (8 skills)

System design, API contracts, and infrastructure planning.

| Skill | What It Does |
|-------|-------------|
| `system-design` | Design systems from scratch with component diagrams |
| `api-design` | Design RESTful APIs with contracts and versioning |
| `db-design` | Design schemas, relations, indexes, migrations |
| `integration-plan` | Plan third-party integrations (OAuth, webhooks) |
| `migration-plan` | Plan zero-downtime data and system migrations |
| `scalability-review` | Audit for caching, queues, replicas, CDN, load balancing |
| `event-design` | Design event-driven architecture with idempotency |
| `cost-estimate` | Estimate infrastructure costs for features |

### 🟢 QA / Testing (8 skills)

Comprehensive testing from planning to execution.

| Skill | What It Does |
|-------|-------------|
| `test-plan` | Create test plans with cases, edge cases, priorities |
| `e2e-test` | Write end-to-end user flow tests |
| `api-test` | Test API endpoints: status codes, auth, edge cases |
| `regression-check` | Identify what could break from code changes |
| `bug-report` | Write structured bug reports with reproduction steps |
| `load-test` | Design load test scenarios and breaking points |
| `accessibility-audit` | Audit UI for WCAG compliance |
| `test-data-gen` | Generate realistic test data and seed scripts |

### 🔵 Automation QA (6 skills)

CI/CD test automation, visual regression, and contract testing.

| Skill | What It Does |
|-------|-------------|
| `cypress-test` | Write Cypress/Playwright tests with page objects |
| `ci-test-pipeline` | Set up parallel test runs in CI with reporting |
| `mock-service` | Create mock APIs with MSW/Nock for testing |
| `visual-regression` | Screenshot comparison with threshold config |
| `test-coverage` | Analyze gaps and improve meaningful coverage |
| `contract-test` | Write contract tests between services |

### 🟠 AWS Cloud Engineer (14 skills)

Infrastructure, deployment, and operations on AWS.

| Skill | What It Does |
|-------|-------------|
| `vpc-design` | Design VPC: subnets, NAT, security groups, peering |
| `ecs-deploy` | Deploy containers to ECS with ALB and auto-scaling |
| `rds-setup` | Set up RDS: sizing, Multi-AZ, backups, monitoring |
| `iam-policy` | Write least-privilege IAM policies and roles |
| `terraform-module` | Write Terraform modules with state management |
| `ci-cd-pipeline` | Build CI/CD with GitHub Actions, ECR, ECS |
| `monitoring-setup` | Set up CloudWatch alarms, dashboards, alerts |
| `cost-optimize` | Audit and reduce AWS costs |
| `disaster-recovery` | Plan DR: RTO/RPO, backups, cross-region failover |
| `secrets-manage` | Manage secrets with SSM/Secrets Manager |
| `cloud-plan` | Plan multi-cloud architectures and migrations |
| `credential-lifecycle` | Manage credential rotation and lifecycle |
| `identity-hardening` | Harden identity and access management |
| `network-security` | Design network security controls and segmentation |

### 📱 Mobile (16 skills)

Mobile development for React Native, Flutter, and native platforms.

| Skill | What It Does |
|-------|-------------|
| `app-release` | Prepare and submit app store releases (iOS & Android) |
| `mobile-api` | Design mobile-optimised API integrations |
| `mobile-auth` | Implement mobile authentication flows |
| `mobile-ci` | Set up mobile CI/CD pipelines |
| `mobile-debug` | Debug mobile crashes and performance issues |
| `mobile-feature` | Build mobile features with platform best practices |
| `mobile-navigation` | Design mobile navigation architectures |
| `mobile-offline` | Implement offline-first data sync patterns |
| `mobile-perf` | Optimise mobile app performance |
| `mobile-quick-plan` | Rapid planning for mobile tasks |
| `mobile-quick-work` | Fast execution for mobile development |
| `mobile-state` | Manage application state in mobile apps |
| `mobile-test` | Write tests for mobile applications |
| `mobile-ui` | Build mobile UI components and screens |
| `platform-adapt` | Adapt features for iOS and Android differences |
| `push-notify` | Implement push notification systems |

### 🩷 UI/UX Designer (8 skills)

Wireframes, flows, design systems, and handoffs.

| Skill | What It Does |
|-------|-------------|
| `wireframe` | Create wireframes with responsive breakpoints |
| `user-flow` | Map user journeys with decision trees |
| `design-system` | Define tokens, components, typography, colors |
| `ux-audit` | Audit UI against Nielsen's 10 heuristics |
| `responsive-design` | Plan mobile-first layouts and touch targets |
| `micro-interaction` | Design loading, empty, error states, transitions |
| `a11y-design` | Design for accessibility: contrast, focus, ARIA |
| `design-handoff` | Create dev handoff specs with measurements |

### 🩵 Business / Product (8 skills)

Requirements, proposals, prioritization, and stakeholder updates.

| Skill | What It Does |
|-------|-------------|
| `prd-write` | Write Product Requirements Documents |
| `user-story` | Write user stories with acceptance criteria |
| `competitor-analysis` | Analyze competitor features and gaps |
| `feature-prioritize` | Prioritize with RICE/MoSCoW scoring |
| `client-proposal` | Write feature proposals with ROI projection |
| `metrics-define` | Define KPIs and success metrics |
| `scope-negotiate` | Negotiate scope and MVP definition |
| `stakeholder-update` | Write status updates for stakeholders |

### 🔴 Compliance & Security (15 skills)

HIPAA, GDPR, SOC 2, PCI-DSS audits, secrets scanning, and infrastructure hardening.

| Skill | What It Does |
|-------|-------------|
| `access-audit` | Audit access controls and least-privilege enforcement |
| `audit-log` | Review audit logging completeness and retention |
| `cloud-security` | Assess cloud infrastructure security posture |
| `compliance-report` | Generate compliance status reports |
| `dep-vuln` | Scan dependencies for known vulnerabilities |
| `gdpr-audit` | GDPR compliance audit — consent, data rights, DPIAs |
| `hipaa-audit` | Deep HIPAA regulatory audit — 7 phases, §164 mapped |
| `incident-plan` | Build incident response and breach notification plans |
| `infra-harden` | Harden infrastructure — CIS benchmarks, attack surface |
| `network-audit` | Audit network segmentation, firewalls, and encryption |
| `pci-audit` | PCI-DSS compliance audit for payment systems |
| `privacy-review` | Review data privacy practices and consent flows |
| `secrets-scan` | Detect hardcoded secrets, keys, and credentials |
| `secure-hipaa` | Full-stack security (26 gates) + HIPAA regulatory audit (7 phases) in one pass |
| `soc2-audit` | SOC 2 Type II compliance audit — trust service criteria |

---

## Every Skill Includes

- Step-by-step workflow with ASCII flow diagrams
- Decision trees for ambiguous situations
- Checklists and templates you can copy-paste
- Common mistakes and anti-patterns
- Real-world examples (not lorem ipsum)
- 6 mandatory rules enforced on every task

### Mandatory Rules (Built Into Every Skill)

1. **Understand before you build** — Study existing architecture first
2. **Reuse, never duplicate** — Search for existing code before writing new
3. **Use existing technology** — Don't introduce new libraries unnecessarily
4. **Ask before adding anything new** — Confirm before installing dependencies
5. **Follow best practices** — Clean code, error handling, validation
6. **No AI tool references** — All output must look 100% human-written

---

## Customizing Skills

You can tune any skill for your project:

1. Open the `SKILL.md` file in any text editor
2. Modify steps, add project-specific patterns, adjust checklists
3. Add your team's conventions, naming rules, or tech stack details
4. Save — the updated skill is used immediately on next invocation

Skills are yours to customize. Make them fit your workflow.

---

## Repo Structure

This repo is structured as a **Claude Code Plugin** with one plugin per skill pack.

```
heaptrace-skills/
├── .claude-plugin/
│   └── marketplace.json            ← Plugin registry (lists all 10 plugins)
├── plugins/
│   ├── heaptrace-dev/              ← Core developer skills (13)
│   │   ├── .claude-plugin/
│   │   │   └── plugin.json
│   │   ├── README.md
│   │   └── skills/
│   │       ├── feature-plan/SKILL.md
│   │       ├── code-review/SKILL.md
│   │       └── ...
│   ├── heaptrace-architect/        ← Technical Architect (8)
│   │   └── skills/
│   │       ├── system-design/SKILL.md
│   │       └── ...
│   ├── heaptrace-automation-qa/    ← Automation QA (6)
│   ├── heaptrace-business/         ← Business / Product (8)
│   ├── heaptrace-cloud-engineer/   ← AWS Cloud Engineer (14)
│   ├── heaptrace-compliance/       ← Compliance & Security (15)
│   ├── heaptrace-designer/         ← UI/UX Designer (8)
│   ├── heaptrace-lead-engineer/    ← Lead Engineer (9)
│   ├── heaptrace-mobile/           ← Mobile (16)
│   └── heaptrace-qa/               ← QA / Testing (8)
└── docs/
    ├── index.html                  ← Skills documentation site
    └── announcement-email.html     ← Team announcement template
```

Each plugin folder contains:
- **`.claude-plugin/plugin.json`** — name, version, description, skills path
- **`README.md`** — skill inventory with descriptions
- **`skills/`** — one subfolder per skill, each with a `SKILL.md`

---

## License

**MIT License** — Free and open source.

You are free to use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of these skills. No restrictions. No attribution required.

See [LICENSE](LICENSE) for the full license text.

Created by **[Heaptrace Technology Private Limited](https://heaptrace.com)** | Contact: **support@heaptrace.com**
