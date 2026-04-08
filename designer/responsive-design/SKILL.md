---
name: responsive-design
description: "Plan responsive layouts with mobile-first approach, breakpoint strategy, touch targets, navigation patterns (hamburger vs tabs vs sidebar), content reflow, image handling, and typography scaling. Use when designing for multiple device sizes or auditing mobile usability."
---

# Responsive Design — Every Screen Size, One Experience

Plans responsive layouts using a mobile-first approach with defined breakpoint strategies, navigation pattern selection, touch target sizing, content reflow rules, image handling, and typography scaling. Ensures the UI works seamlessly from 320px phones to 2560px ultrawide monitors.

---

## Common Rules — Read Before Every Task

```
┌──────────────────────────────────────────────────────────────┐
│              MANDATORY RULES FOR EVERY TASK                  │
│                                                              │
│  You are a senior UI/UX designer working with developers.    │
│  You think visually, communicate through diagrams, and       │
│  bridge design intent with implementation reality.           │
│                                                              │
│  ────────────────────────────────────────────────────────    │
│                                                              │
│  1. UNDERSTAND BEFORE YOU DESIGN                             │
│     → Check the existing breakpoint configuration first      │
│     → Read how existing pages handle responsiveness          │
│     → Identify which CSS framework handles responsive layout │
│     → Never assume — test at actual device widths           │
│                                                              │
│  2. REUSE — NEVER REINVENT                                   │
│     → Use existing responsive utilities (Tailwind classes)   │
│     → If a responsive pattern exists elsewhere, copy it      │
│     → Shared responsive behaviors go in shared components    │
│     → Ask: "How does this pattern work on the Users page?"   │
│                                                              │
│  3. USE EXISTING DESIGN LANGUAGE                             │
│     → Use the existing breakpoints, don't add custom ones    │
│     → Follow the same mobile navigation pattern everywhere   │
│     → Responsive typography should use existing scale         │
│                                                              │
│  4. ASK BEFORE ADDING ANYTHING NEW                           │
│     → New breakpoint? → ASK first                            │
│     → New mobile navigation pattern? → ASK first             │
│     → Hiding content on mobile? → ASK first                  │
│     → Adding a mobile-only feature? → ASK first              │
│     → Never change responsive behavior without confirmation  │
│                                                              │
│  5. MOBILE FIRST — ALWAYS                                    │
│     → Design the mobile layout first                         │
│     → Then enhance for tablet, then desktop                  │
│     → Content must work at 320px before adding extras        │
│     → If it doesn't fit on mobile, question if it's needed  │
│                                                              │
│  6. COMMUNICATE VISUALLY                                     │
│     → Show layouts at all breakpoints side by side           │
│     → Annotate what changes and what stays the same          │
│     → Mark touch targets with minimum size indicators        │
│     → Show content reflow direction with arrows              │
│                                                              │
└──────────────────────────────────────────────────────────────┘
```

---

## Step-by-Step Process

### Step 1: Define Breakpoint Strategy

```
STANDARD BREAKPOINT SCALE (Tailwind CSS):

  ┌──────────────────────────────────────────────────────────────┐
  │                                                              │
  │  Prefix │ Min-width │ Devices           │ Columns │ Gutter  │
  │  ───────┼───────────┼───────────────────┼─────────┼─────────│
  │  (none) │ 0px       │ Small phones      │ 1       │ 16px    │
  │  sm:    │ 640px     │ Large phones      │ 1       │ 16px    │
  │  md:    │ 768px     │ Tablets portrait  │ 2       │ 24px    │
  │  lg:    │ 1024px    │ Tablets landscape  │ 3       │ 24px    │
  │  xl:    │ 1280px    │ Desktops          │ 4       │ 32px    │
  │  2xl:   │ 1536px    │ Large desktops    │ 4       │ 32px    │
  │                                                              │
  └──────────────────────────────────────────────────────────────┘

  KEY BREAKPOINTS (design at these widths):

  320px        375px       768px       1024px       1280px      1440px
  ─┼────────────┼───────────┼───────────┼────────────┼───────────┼──
   │  Small     │  iPhone   │  iPad     │  iPad      │  Laptop   │  Desktop
   │  Android   │  SE/15    │  portrait │  landscape │  13"      │  24"+
   │            │           │           │            │           │

  MOBILE-FIRST CSS ORDER:

  /* Base styles = mobile (320px+) */
  .card { width: 100%; }

  /* sm: 640px+ — wider phones */
  @media (min-width: 640px) { }

  /* md: 768px+ — tablets */
  @media (min-width: 768px) { .card { width: 50%; } }

  /* lg: 1024px+ — laptop */
  @media (min-width: 1024px) { .card { width: 33.3%; } }

  /* xl: 1280px+ — desktop */
  @media (min-width: 1280px) { .card { width: 25%; } }
```

### Step 2: Choose Navigation Pattern

```
NAVIGATION PATTERN DECISION TREE:

  How many top-level nav items?
  │
  ├── 2-5 items
  │   ├── Mobile: Bottom tab bar (always visible)
  │   └── Desktop: Sidebar or top nav
  │
  ├── 6-10 items
  │   ├── Mobile: Hamburger menu (slide-out drawer)
  │   └── Desktop: Sidebar with sections
  │
  └── 10+ items
      ├── Mobile: Hamburger + search + categorized sections
      └── Desktop: Collapsible sidebar with sections


PATTERN A: Bottom Tab Bar (2-5 items)
┌─────────────────────────────┐
│                             │
│       Content Area          │
│                             │
│                             │
├─────────────────────────────┤
│  🏠     📚     👤     ⚙️    │
│  Home  Courses Profile Set  │
└─────────────────────────────┘
  ✅ Always visible
  ✅ One-tap access
  ✅ Thumb-friendly
  ✕  Max 5 items
  ✕  Takes vertical space

PATTERN B: Hamburger Menu (6+ items)
┌─────────────────────────────┐
│  [≡]  App Name     [🔔][👤] │
├─────────────────────────────┤
│                             │
│       Content Area          │
│                             │
└─────────────────────────────┘
         │
    Tap [≡]
         │
         ▼
┌────────────────┬────────────┐
│  ┌───────────┐ │            │
│  │ Dashboard │ │  (dimmed   │
│  │ Courses   │ │   content) │
│  │ Users     │ │            │
│  │ Paths     │ │            │
│  │ Reports   │ │            │
│  │ ────────  │ │            │
│  │ Settings  │ │            │
│  │ Help      │ │            │
│  └───────────┘ │            │
└────────────────┴────────────┘
  ✅ Unlimited items
  ✅ Full-screen content
  ✕  Hidden (discoverability)
  ✕  Two taps to reach items


RESPONSIVE NAVIGATION TRANSFORM:

  Mobile (< 768px):           Tablet (768-1023px):      Desktop (1024px+):
  ┌──────────────────┐       ┌──────────────────────┐  ┌──────┬──────────────┐
  │ [≡] Logo  [🔔][👤]│       │ [≡] Logo  🔍  [🔔][👤]│  │ Logo │              │
  ├──────────────────┤       ├──────────────────────┤  │ ──── │              │
  │                  │       │                      │  │ Home │              │
  │  Content         │       │  Content             │  │ Crs  │  Content     │
  │  (full width)    │       │  (full width)        │  │ Usr  │  Area        │
  │                  │       │                      │  │ Rpt  │              │
  ├──────────────────┤       │                      │  │ ──── │              │
  │ 🏠 📚 👤 ⚙️      │       │                      │  │ Set  │              │
  └──────────────────┘       └──────────────────────┘  └──────┴──────────────┘
  Bottom tabs                 Hamburger + top bar       Persistent sidebar
```

### Step 3: Plan Content Reflow

```
REFLOW PATTERNS:

PATTERN 1: Side-by-side → Stacked
Desktop:                          Mobile:
┌────────────┬────────────┐      ┌──────────────────────┐
│  Left Col  │  Right Col │      │  Left Col            │
│  (content) │  (sidebar) │  ──▶ │  (now full width)    │
└────────────┴────────────┘      ├──────────────────────┤
                                 │  Right Col           │
                                 │  (stacked below)     │
                                 └──────────────────────┘

PATTERN 2: Grid → Single Column
Desktop:                          Mobile:
┌──────┬──────┬──────┐           ┌──────────────────────┐
│Card 1│Card 2│Card 3│           │  Card 1              │
└──────┴──────┴──────┘           ├──────────────────────┤
┌──────┬──────┬──────┐    ──▶   │  Card 2              │
│Card 4│Card 5│Card 6│           ├──────────────────────┤
└──────┴──────┴──────┘           │  Card 3              │
                                 ├──────────────────────┤
                                 │  Card 4              │
                                 └──────────────────────┘

PATTERN 3: Table → Card List
Desktop:                          Mobile:
┌──────────────────────────┐     ┌──────────────────────┐
│ Name  │ Status │ Date    │     │ ┌──────────────────┐ │
├───────┼────────┼─────────┤     │ │ John Smith       │ │
│ John  │ Active │ Mar 20  │     │ │ Active  Mar 20   │ │
│ Jane  │ Pending│ Mar 19  │ ──▶ │ └──────────────────┘ │
│ Bob   │ Active │ Mar 18  │     │ ┌──────────────────┐ │
└──────────────────────────┘     │ │ Jane Doe         │ │
                                 │ │ Pending  Mar 19  │ │
                                 │ └──────────────────┘ │
                                 └──────────────────────┘

PATTERN 4: Tabs → Scrollable Tabs / Accordion
Desktop:                          Mobile:
┌──────────────────────────┐     ┌──────────────────────┐
│ [Tab 1] [Tab 2] [Tab 3] │     │ [Tab 1] [Tab 2] [▶  │
├──────────────────────────┤     │      ← scrollable →  │
│ Tab content              │ ──▶ ├──────────────────────┤
└──────────────────────────┘     │ Tab content          │
                                 └──────────────────────┘

PATTERN 5: Horizontal filters → Sheet / Dropdown
Desktop:                          Mobile:
┌──────────────────────────┐     ┌──────────────────────┐
│[Status▾][Cat▾][Sort▾] 🔍│     │ 🔍 Search   [Filter] │
└──────────────────────────┘     └──────────────────────┘
                                         │ tap Filter
                                         ▼
                                 ┌──────────────────────┐
                                 │ ┌──── Filter ──────┐ │
                                 │ │ Status: [All ▾]  │ │
                                 │ │ Category: [▾]    │ │
                                 │ │ Sort: [Date ▾]   │ │
                                 │ │                   │ │
                                 │ │ [Clear] [Apply]  │ │
                                 │ └──────────────────┘ │
                                 └──────────────────────┘
```

### Step 4: Touch Target Sizing

```
TOUCH TARGET REQUIREMENTS:

  Minimum touch target: 44 x 44 px (Apple HIG)
  Recommended:          48 x 48 px (Material Design)
  Minimum spacing:      8px between targets

  VISUAL GUIDE:

  Too small (32px):        Correct (48px):
  ┌──┐                     ┌──────┐
  │✕│  ← Hard to tap      │  ✕   │  ← Easy to tap
  └──┘                     └──────┘

  Icon buttons (always add padding):
  WRONG:                   RIGHT:
  [✕]  ← 16px icon only   [ ✕ ]  ← 16px icon + 16px padding = 48px target

  Link text in lists:
  WRONG:                        RIGHT:
  ┌─────────────────────┐      ┌─────────────────────┐
  │ Item 1              │      │                     │
  │ Item 2 ← too close  │      │ Item 1              │  48px row height
  │ Item 3              │      │                     │
  └─────────────────────┘      │ Item 2              │  48px row height
  Rows < 32px tall             │                     │
                               │ Item 3              │  48px row height
                               │                     │
                               └─────────────────────┘

  FORM FIELDS ON MOBILE:

  Input height:    44px minimum (48px recommended)
  Checkbox target: 44x44px (not just the 16px box)
  Radio target:    44x44px (not just the 12px circle)
  Select dropdown: 44px height, full width on mobile
```

### Step 5: Image and Media Handling

```
IMAGE RESPONSIVE STRATEGY:

  Desktop (1280px):              Mobile (375px):
  ┌──────────────────────┐      ┌────────────────┐
  │                      │      │                │
  │    Hero Image        │      │  Hero Image    │
  │    1200 x 630        │      │  750 x 400     │
  │                      │      │  (smaller src) │
  └──────────────────────┘      └────────────────┘

  RULES:
  □ Use srcset for different resolutions
  □ Use aspect-ratio to prevent layout shift
  □ Lazy-load images below the fold
  □ Use WebP with JPEG fallback
  □ Set explicit width/height attributes
  □ Thumbnails: 300px max on mobile, 400px on desktop

  IMAGE ASPECT RATIOS:

  ┌──────────────────────┐
  │ 16:9 — Hero banners, │    ← Widest
  │        video thumbs   │
  └──────────────────────┘
  ┌──────────────────┐
  │ 3:2 — Card thumbs│           ← Standard
  └──────────────────┘
  ┌──────────────┐
  │ 4:3 — Photos │               ← Classic
  └──────────────┘
  ┌──────────┐
  │ 1:1      │                   ← Avatars, icons
  │ Square   │
  └──────────┘
```

### Step 6: Typography Scaling

```
TYPOGRAPHY ACROSS BREAKPOINTS:

  Token     │ Mobile (< 768) │ Tablet (768+) │ Desktop (1024+)
  ──────────┼────────────────┼───────────────┼────────────────
  H1        │ 24px / 32px    │ 28px / 36px   │ 32px / 40px
  H2        │ 20px / 28px    │ 22px / 30px   │ 24px / 32px
  H3        │ 16px / 24px    │ 18px / 26px   │ 18px / 28px
  Body      │ 14px / 22px    │ 14px / 22px   │ 14px / 22px
  Caption   │ 12px / 16px    │ 12px / 16px   │ 12px / 16px

  VISUAL:
  Mobile H1:  ████████████████████████    24px
  Desktop H1: ████████████████████████████████  32px

  Rules:
  □ Body text stays 14px across ALL breakpoints (readable)
  □ Only headings scale up on larger screens
  □ Line height increases proportionally
  □ Max line length: 65-75 characters (use max-w-prose)
```

---

## Responsive Layout Patterns for Common Pages

```
DASHBOARD (Stats + Table):

  Mobile:                    Tablet:                    Desktop:
  ┌──────────────┐          ┌──────────────────────┐  ┌──────┬───────────────────┐
  │ Stat 1       │          │ Stat 1 │ Stat 2      │  │ Side │ St1 │ St2 │ St3   │
  ├──────────────┤          ├────────┼─────────────┤  │ bar  ├─────┴─────┴───────┤
  │ Stat 2       │          │ Stat 3 │ Stat 4      │  │      │ Table             │
  ├──────────────┤          ├────────┴─────────────┤  │      │ ─────────────────│
  │ Stat 3       │          │ Table (full width)   │  │      │ Row 1            │
  ├──────────────┤          │ ────────────────────│  │      │ Row 2            │
  │ Stat 4       │          │ Row 1               │  │      │ Row 3            │
  ├──────────────┤          │ Row 2               │  └──────┴───────────────────┘
  │ ┌──────────┐ │          └──────────────────────┘
  │ │ Card 1   │ │
  │ │ Card 2   │ │
  │ └──────────┘ │
  ├──────────────┤
  │ 🏠 📚 👤 ⚙️  │
  └──────────────┘


FORM PAGE:

  Mobile:                    Desktop:
  ┌──────────────┐          ┌──────┬───────────────────────────┐
  │ ← Back       │          │ Side │                           │
  │              │          │ bar  │  ┌─────────────────────┐  │
  │ Title *      │          │      │  │  Title *             │  │
  │ [__________] │          │      │  │  [________________]  │  │
  │              │          │      │  │                      │  │
  │ Desc         │          │      │  │  Desc    Category    │  │
  │ [__________] │          │      │  │  [_____] [________]  │  │
  │              │          │      │  │                      │  │
  │ Category *   │          │      │  │  [Cancel] [Submit]   │  │
  │ [__________] │          │      │  └─────────────────────┘  │
  │              │          │      │                           │
  │ [Submit]     │          └──────┴───────────────────────────┘
  │              │
  └──────────────┘          Form max-width: 640px on desktop
  Full-width fields         Side-by-side fields where logical
```

---

## Common Mistakes and Anti-Patterns

```
MISTAKE 1: Desktop-first thinking

  BAD: Design full desktop layout, then "squeeze" to mobile
  GOOD: Design mobile first, then expand for larger screens

  Desktop-first leads to:
  ✕ Hidden content on mobile
  ✕ Broken layouts at intermediate widths
  ✕ Features that only work with a mouse

MISTAKE 2: Hiding essential content on mobile

  BAD: display: none on mobile for important data
  GOOD: Reflow into a different layout (cards, accordion)

  Rule: If content is important enough for desktop, it's
  important enough for mobile — just present it differently.

MISTAKE 3: Fixed widths instead of fluid

  BAD:  width: 800px  (breaks at 768px)
  GOOD: max-width: 800px; width: 100%;  (fluid + capped)

MISTAKE 4: Tiny touch targets

  BAD:  24px icon button
  GOOD: 24px icon + 12px padding each side = 48px touch target

MISTAKE 5: Not testing between breakpoints

  BAD: Test at 375px and 1280px only
  GOOD: Test at 375, 414, 640, 768, 834, 1024, 1280, 1440, 1920

  The ugliest layouts appear BETWEEN breakpoints.
```

---

## Responsive Design Checklist

```
┌──────────────────────────────────────────────────────────────┐
│  RESPONSIVE DESIGN CHECKLIST                                 │
│                                                              │
│  Layout                                                      │
│  □ Mobile layout designed first (320px)                      │
│  □ Content reflows logically at each breakpoint              │
│  □ No horizontal scroll at any width                         │
│  □ Max-width container on wide screens (1280-1440px)         │
│  □ Sidebar collapses or becomes hamburger on mobile          │
│  □ Forms go single-column on mobile                          │
│  □ Tables convert to cards on mobile (or horizontal scroll)  │
│                                                              │
│  Touch                                                       │
│  □ All interactive elements >= 44px touch target             │
│  □ At least 8px spacing between touch targets                │
│  □ No hover-only interactions on mobile                      │
│  □ Swipe gestures have button alternatives                   │
│                                                              │
│  Navigation                                                  │
│  □ Mobile nav pattern chosen (tabs, hamburger, or both)      │
│  □ Current page indicator visible at all sizes               │
│  □ Back navigation always available                          │
│  □ Search accessible from all screen sizes                   │
│                                                              │
│  Typography                                                  │
│  □ Body text is 14-16px on all devices                       │
│  □ Headings scale down gracefully on mobile                  │
│  □ Line length capped at ~75 characters                      │
│  □ No text truncation that hides meaning                     │
│                                                              │
│  Images                                                      │
│  □ Responsive images with srcset or CSS                      │
│  □ Aspect ratio maintained (no stretching)                   │
│  □ Lazy loading for below-fold images                        │
│  □ Placeholder/skeleton while loading                        │
│                                                              │
│  Testing                                                     │
│  □ Tested at: 320, 375, 768, 1024, 1280, 1440               │
│  □ Tested in portrait AND landscape on tablet                │
│  □ No content overflow or clipping                           │
│  □ Forms are usable with on-screen keyboard visible          │
│  □ Modals don't exceed viewport height on mobile             │
│                                                              │
└──────────────────────────────────────────────────────────────┘
```

---

## Output Format

When planning responsive layouts, always deliver:

1. **Breakpoint strategy** — which breakpoints, what changes at each
2. **Navigation pattern** — which pattern for mobile/tablet/desktop
3. **Mobile wireframe** — 375px layout with all elements
4. **Tablet wireframe** — 768px layout showing reflow
5. **Desktop wireframe** — 1280px layout showing full experience
6. **Content reflow map** — how each section transforms across sizes
7. **Touch target audit** — minimum sizes for all interactive elements
8. **Typography scale** — how text sizes change per breakpoint
9. **Image strategy** — aspect ratios, srcset, lazy loading rules
10. **Testing plan** — specific widths and orientations to verify

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
