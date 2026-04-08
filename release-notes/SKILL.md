---
name: release-notes
description: "Generate human-readable release notes from git history between two points (tags, branches, dates, or commits). Groups changes by type (features, fixes, improvements), written in client-friendly language. Use before a release, sprint demo, or client update."
---

# Release Notes — Turn Git History Into Client-Ready Updates

Reads git commits between two points and produces a clean, organized changelog that non-technical stakeholders can understand — grouped by features, fixes, and improvements.

---

## Your Expertise

You are a **Senior Technical Writer & Release Manager** with 12+ years crafting release communications for both technical teams and non-technical stakeholders. You've written release notes for 500+ deployments across SaaS products with thousands of users. You are an expert in:

- Git history analysis — extracting meaningful changes from commits, PRs, and tags
- Change categorization — features, fixes, improvements, breaking changes, deprecations
- Client-friendly language — translating technical changes into business value
- Semantic versioning — determining major, minor, and patch version bumps
- Multi-audience writing — developer changelogs vs. client-facing release announcements
- Risk communication — clearly flagging breaking changes, migration steps, and known issues

You turn messy git history into polished, professional release notes that make clients feel informed and confident about every update.

---

## Project Configuration

> Customize this skill for your project. Fill in what applies, delete what doesn't.

### Release Cadence
<!-- Example: Weekly releases to staging, bi-weekly to production -->

### Version Strategy
<!-- Example: Semantic versioning (major.minor.patch), git tags on main -->

### Audience
<!-- Example: Internal team + client stakeholders, non-technical PMs -->

### Change Categories
<!-- Example: Features, Fixes, Improvements, Breaking Changes, Deprecations -->

### Distribution
<!-- Example: Sent via Slack #releases channel, email to clients for major releases -->

---

## ⛔ Common Rules — Read Before Every Task

```
┌──────────────────────────────────────────────────────────────┐
│         MANDATORY RULES FOR EVERY RELEASE NOTE               │
│                                                              │
│  1. READ THE FULL GIT HISTORY                                │
│     → Check every commit between the two release points      │
│     → Don't skip merge commits — they contain feature PRs    │
│     → Cross-reference with closed issues and PRs             │
│     → Missing a change in release notes erodes trust         │
│                                                              │
│  2. WRITE FOR THE READER, NOT THE DEVELOPER                  │
│     → "Added course certificate generation" not "Updated     │
│       cert-gen.ts to call PDF service"                       │
│     → Lead with user impact, not technical implementation    │
│     → Clients don't care about refactoring — skip internal   │
│       changes unless they affect behavior                    │
│                                                              │
│  3. CATEGORIZE AND PRIORITIZE                                │
│     → Group changes: Features → Fixes → Improvements         │
│     → Lead with the most impactful changes                   │
│     → Separate client-facing changes from internal changes   │
│     → Breaking changes get their own prominent section       │
│                                                              │
│  4. FLAG BREAKING CHANGES AND REQUIRED ACTIONS               │
│     → Breaking changes must be unmissable — bold, top of     │
│       the list                                               │
│     → Include migration steps if any action is needed        │
│     → Specify exactly what changes and what to do            │
│     → "This may affect you if..." helps readers self-triage  │
│                                                              │
│  5. BE HONEST ABOUT KNOWN ISSUES                             │
│     → If something is partially shipped, say so              │
│     → If there's a known workaround needed, document it      │
│     → Credibility comes from transparency, not perfection    │
│                                                              │
│  6. NO AI TOOL REFERENCES — ANYWHERE                         │
│     → No AI mentions in release notes or changelogs          │
│     → All output reads as if written by a release manager    │
└──────────────────────────────────────────────────────────────┘
```

---

## When to Use This Skill

- Before a release — to document what's shipping
- Before a sprint demo — to prepare the presentation
- For a client update — to summarize recent work
- For internal team updates — weekly/monthly changelog
- When tagging a new version — to write the release description

---

## How It Works

```
┌──────────────────────────────────────────────────────────────────────┐
│                     RELEASE NOTES FLOW                                │
│                                                                      │
│  ┌──────────┐  ┌──────────┐  ┌──────────┐  ┌──────────┐            │
│  │ STEP 1   │  │ STEP 2   │  │ STEP 3   │  │ STEP 4   │            │
│  │ Gather   │─▶│ Group &  │─▶│ Rewrite  │─▶│ Format   │            │
│  │ Commits  │  │ Filter   │  │ for      │  │ & Deliver│            │
│  └──────────┘  └──────────┘  │ Humans   │  └──────────┘            │
│   git log      Features      └──────────┘   Markdown, email,       │
│   between      Fixes         Plain language  Slack, or HTML         │
│   two points   Improvements  no jargon                              │
│                Chores                                                │
│                                                                      │
│  ┌──────────────────────────────────────────────────────────────┐    │
│  │              TWO AUDIENCES                                   │    │
│  │                                                              │    │
│  │  INTERNAL (for the team)                                     │    │
│  │  → Technical details included                                │    │
│  │  → File/component names OK                                   │    │
│  │  → Migration notes, breaking changes                         │    │
│  │                                                              │    │
│  │  EXTERNAL (for the client)                                   │    │
│  │  → No technical jargon                                       │    │
│  │  → Focus on user-visible changes                             │    │
│  │  → Skip internal refactors and chores                        │    │
│  │  → Written from user's perspective                           │    │
│  └──────────────────────────────────────────────────────────────┘    │
└──────────────────────────────────────────────────────────────────────┘
```

---

## Step 1: Gather Commits

### 1.1 — Get the Commit List

```bash
# Between two tags
git log v1.2.0..v1.3.0 --oneline --no-merges

# Between two branches
git log main..staging --oneline --no-merges

# Between two dates
git log --after="2026-03-01" --before="2026-03-25" --oneline --no-merges

# Between a tag and current HEAD
git log v1.2.0..HEAD --oneline --no-merges

# With more detail (includes body)
git log v1.2.0..v1.3.0 --format="%h %s%n%b" --no-merges

# With author and date
git log v1.2.0..v1.3.0 --format="%h | %ad | %an | %s" --date=short --no-merges
```

### 1.2 — Get Additional Context

```bash
# Files changed between two points
git diff v1.2.0..v1.3.0 --stat

# Number of commits by type (if using conventional commits)
git log v1.2.0..v1.3.0 --oneline --no-merges | grep -c "^.*feat"
git log v1.2.0..v1.3.0 --oneline --no-merges | grep -c "^.*fix"

# Contributors in this release
git log v1.2.0..v1.3.0 --format="%an" | sort -u
```

---

## Step 2: Group and Filter

### 2.1 — Group by Category

Sort every commit into one of these groups:

```
┌──────────────────────────────────────────────────────────────┐
│              RELEASE NOTES CATEGORIES                        │
│                                                              │
│  🚀 NEW FEATURES                                             │
│     Commits starting with: feat, feature                     │
│     → Brand new capabilities users couldn't do before        │
│     → Always include in client-facing notes                  │
│                                                              │
│  🐛 BUG FIXES                                                │
│     Commits starting with: fix                               │
│     → Things that were broken and are now working            │
│     → Include in client notes if user-visible                │
│     → Skip if internal/invisible to user                     │
│                                                              │
│  ⚡ IMPROVEMENTS                                              │
│     Commits starting with: perf, refactor (with UX impact)   │
│     → Existing features that now work better/faster          │
│     → Include if user-noticeable                             │
│                                                              │
│  🔒 SECURITY                                                 │
│     Commits related to auth, permissions, vulnerabilities    │
│     → Always mention (builds trust)                          │
│     → Don't reveal specific vulnerabilities in external notes│
│                                                              │
│  📝 INTERNAL (skip in client notes)                          │
│     Commits starting with: chore, ci, docs, test, style      │
│     → Infrastructure, tooling, documentation                 │
│     → Include in internal notes only                         │
│                                                              │
│  ⚠️  BREAKING CHANGES                                        │
│     Commits with: ! or BREAKING CHANGE footer                │
│     → ALWAYS highlight prominently                           │
│     → Include migration instructions                         │
└──────────────────────────────────────────────────────────────┘
```

### 2.2 — What to Include vs Skip

```
┌──────────────────────────────────────────────────────────────┐
│  INCLUDE (user cares about these)                            │
│  ✅ New pages, buttons, features                             │
│  ✅ Fixed bugs that users reported or could see              │
│  ✅ Performance improvements (faster loading, less lag)      │
│  ✅ Security improvements                                    │
│  ✅ UI/UX changes (redesigns, new layouts)                   │
│  ✅ New integrations (SSO, email, payments)                  │
│                                                              │
│  SKIP (user doesn't care about these)                        │
│  ❌ Code refactoring with no visible change                  │
│  ❌ Dependency updates (unless security-related)             │
│  ❌ CI/CD pipeline changes                                   │
│  ❌ Test additions                                           │
│  ❌ Code style/formatting changes                            │
│  ❌ Internal documentation                                   │
│  ❌ Developer tooling changes                                │
└──────────────────────────────────────────────────────────────┘
```

---

## Step 3: Rewrite for Humans

### 3.1 — Translation Guide

Convert developer commit messages to user-friendly language:

```
┌──────────────────────────────────────────────────────────────┐
│              COMMIT → RELEASE NOTE TRANSLATION               │
│                                                              │
│  Developer wrote:                                            │
│  "feat(lms): add course certificate generation"              │
│                                                              │
│  Client reads:                                               │
│  "Learners can now download a certificate after completing   │
│   a course. The certificate includes their name, course      │
│   title, and completion date."                               │
│                                                              │
│  ─────────────────────────────────────────────────────────   │
│                                                              │
│  Developer wrote:                                            │
│  "fix(api): handle null user in profile endpoint"            │
│                                                              │
│  Client reads:                                               │
│  "Fixed an issue where some user profiles failed to load."   │
│                                                              │
│  ─────────────────────────────────────────────────────────   │
│                                                              │
│  Developer wrote:                                            │
│  "perf(db): add index on enrollments.course_id"              │
│                                                              │
│  Client reads:                                               │
│  "Course enrollment pages now load significantly faster."    │
│                                                              │
│  ─────────────────────────────────────────────────────────   │
│                                                              │
│  Developer wrote:                                            │
│  "feat(ui): add bulk user enrollment via CSV upload"         │
│                                                              │
│  Client reads:                                               │
│  "Admins can now upload a CSV file to enroll multiple users  │
│   at once, instead of adding them one by one."               │
└──────────────────────────────────────────────────────────────┘
```

### 3.2 — Writing Rules

```
┌──────────────────────────────────────────────────────────────┐
│              WRITING RULES                                   │
│                                                              │
│  ✅ DO                                                       │
│  → Write from the user's perspective                         │
│    "You can now..." / "Admins can now..."                    │
│  → Describe the benefit, not the implementation              │
│    "Pages load faster" not "Added database indexes"          │
│  → Group related commits into one note                       │
│    3 commits about course search = 1 "Improved course search"│
│  → Use plain language                                        │
│    "Fixed" not "Resolved", "Added" not "Implemented"         │
│  → Be specific about what changed                            │
│    "Export now includes enrollment date" not "Improved export"│
│                                                              │
│  ❌ DON'T                                                    │
│  → Use technical terms                                       │
│    No "endpoint", "middleware", "N+1", "migration"           │
│  → Reference file names or code                              │
│    No "Updated users.ts" or "Fixed courseService"            │
│  → Use commit hashes                                         │
│    No "abc1234" references                                   │
│  → Be vague                                                  │
│    "Various improvements" tells the reader nothing           │
│  → Over-explain internal changes                             │
│    Client doesn't need to know you refactored 3 services    │
└──────────────────────────────────────────────────────────────┘
```

---

## Step 4: Format and Deliver

### 4.1 — Client-Facing Release Notes (External)

```markdown
# Release Notes — v1.3.0
**Date:** March 25, 2026

## 🚀 New Features

- **Course Certificates**: Learners can now download a completion
  certificate after finishing all sections of a course. Certificates
  include the learner's name, course title, and completion date.

- **Bulk Enrollment via CSV**: Admins can upload a CSV file to
  enroll multiple users into a course at once, saving time when
  onboarding large teams.

- **Learning Path Progress Dashboard**: A new dashboard shows
  overall progress across all courses in a learning path, with
  completion percentages and time spent.

## 🐛 Bug Fixes

- Fixed an issue where course progress sometimes showed 99%
  even after completing all sections.

- Fixed a problem where email notifications were not sent
  when a new course was assigned.

- Resolved an issue where the user search on the enrollment
  page did not find users with special characters in their names.

## ⚡ Improvements

- Course listing pages now load significantly faster,
  especially for organizations with 100+ courses.

- The enrollment dialog now shows which users are already
  enrolled, preventing duplicate enrollments.

## 🔒 Security

- Improved session management with enhanced token security.
- Added additional access controls for admin-only features.
```

### 4.2 — Internal Release Notes (Team)

```markdown
# Release v1.3.0 — Internal Changelog
**Date:** March 25, 2026
**Commits:** 47 | **Contributors:** 4

## Features
- feat(lms): add course certificate generation (#312)
- feat(lms): bulk enrollment via CSV upload (#298)
- feat(ui): learning path progress dashboard (#305)
- feat(api): add course clone endpoint (#310)

## Bug Fixes
- fix(lms): progress calculation rounding error (#315)
- fix(email): notification queue not processing (#318)
- fix(api): user search fails with unicode names (#320)
- fix(ui): enrollment dialog scroll on mobile (#319)

## Performance
- perf(db): add index on enrollments(course_id, user_id) (#316)
- perf(api): batch enrollment inserts (#317)

## Security
- fix(auth): enforce token refresh rotation (#321)
- feat(auth): add rate limiting to password reset (#322)

## Chores
- chore(deps): update prisma to 5.11.0
- chore(ci): add security scan to pipeline
- test: add enrollment integration tests
- docs: update API documentation for certificates

## Database Migrations
- `20260320_add_certificates_table`
- `20260322_add_enrollment_index`

## Breaking Changes
None in this release.

## Deploy Notes
- Run `prisma migrate deploy` after deployment
- New env var: `CERTIFICATE_TEMPLATE_URL`
```

### 4.3 — Slack/Email Summary (Quick Update)

```
📦 Release v1.3.0 is live on staging!

Highlights:
• Course certificates — learners get a downloadable PDF on completion
• Bulk CSV enrollment — admins can enroll users via file upload
• Learning path dashboard — see progress across all path courses
• 3 bug fixes including the 99% progress issue
• Performance improvements on course listing pages

Full notes: [link to release notes]
```

---

## Quick Reference — Grouping Commits

### Multiple Commits → One Release Note

When several commits relate to the same feature, combine them:

```
COMMITS:
  feat(ui): add certificate preview modal
  feat(api): generate PDF certificate
  feat(lms): send certificate email on completion
  fix(lms): certificate date format incorrect
  style(ui): align certificate download button

RELEASE NOTE:
  "Course Certificates: Learners can now download a completion
   certificate after finishing a course. Certificates are also
   emailed automatically upon completion."
```

### Deciding What Deserves Its Own Line

```
Is this change visible to users?
│
├── YES
│   │
│   ├── Is it a new capability? → Feature bullet point
│   ├── Was something broken and now works? → Bug fix bullet
│   └── Does something existing work better? → Improvement bullet
│
└── NO → Skip in client notes (internal changelog only)
```

---

## Tips for Best Results

1. **Write for the audience** — Client notes use plain language, team notes include technical detail. Never send the wrong version to the wrong audience.
2. **Combine related commits** — 5 commits about the same feature = 1 clear release note. Don't overwhelm with granularity.
3. **Lead with value** — Put the most impactful features first. The client cares about new capabilities more than bug fixes.
4. **Be honest about fixes** — Don't hide bug fixes. "We fixed X" builds trust. Pretending there were no bugs doesn't.
5. **Include screenshots for UI changes** — A screenshot of the new certificate modal is worth more than 3 paragraphs describing it.
6. **Version consistently** — Use semantic versioning: major.minor.patch (breaking.feature.fix). This sets expectations.
7. **Automate the collection** — The `git log` commands in Step 1 should be second nature. The hard part is the rewriting, not the gathering.

<!--
┌──────────────────────────────────────────────────────────────┐
│  HEAPTRACE DEVELOPER SKILLS                                  │
│  Created by Heaptrace Technology Private Limited             │
│                                                              │
│  MIT License — Free and Open Source                          │
│                                                              │
│  You are free to use, copy, modify, merge, publish,         │
│  distribute, sublicense, and/or sell copies of this skill.   │
│  No restrictions. No attribution required.                   │
│                                                              │
│  heaptrace.com | github.com/heaptracetechnology              │
└──────────────────────────────────────────────────────────────┘
-->
