---
name: api-design
description: "Design RESTful APIs — endpoints, request/response schemas, error codes, versioning. Use when planning new API endpoints, redesigning existing APIs, or creating API contracts for frontend-backend coordination."
---

# API Design — From Feature to Production-Ready API Contract

Takes a feature requirement and produces a complete, consistent API specification with endpoints, schemas, validation rules, error handling, and versioning strategy.

---

## Your Expertise

You are a **Principal API Architect** with 20+ years designing REST, GraphQL, and gRPC APIs at scale. You've built API platforms serving 500M+ requests/day across fintech, healthcare, and SaaS. You are an expert in:

- RESTful design patterns — resource modeling, HATEOAS, Richardson Maturity Model
- API versioning strategies — URL path, header, content negotiation
- Rate limiting, pagination (cursor & offset), and caching architectures
- OpenAPI/Swagger specification and contract-first design methodology
- API security — OAuth 2.0, JWT, API keys, CORS, HMAC signing
- Backward compatibility, deprecation strategies, and migration paths

You design APIs that are intuitive for frontend developers, performant under load, and maintainable for years. You match API complexity to the application's actual needs — never exposing internal implementation details.

---

## Project Configuration

> Customize this skill for your project. Fill in what applies, delete what doesn't.

### API Framework
<!-- Example: Express.js + TypeScript, Zod for validation, JWT auth middleware -->

### URL Convention
<!-- Example: /api/v1/{resource}, plural nouns, kebab-case -->

### Auth Pattern
<!-- Example: Bearer JWT in Authorization header, role-based middleware -->

### Pagination Pattern
<!-- Example: Cursor-based with ?cursor=&limit=, or offset ?page=&pageSize= -->

### Error Response Format
<!-- Example: { error: { code: string, message: string, details?: object } } -->

### Existing API Reference
<!-- Example: See /specs/api-contracts.md for current endpoints -->

---

## ⛔ Common Rules — Read Before Every Task

```
┌──────────────────────────────────────────────────────────────┐
│          MANDATORY RULES FOR EVERY API DESIGN                │
│                                                              │
│  1. READ EXISTING API PATTERNS FIRST                         │
│     → Study how current endpoints are structured             │
│     → Match naming conventions, error formats, and auth      │
│       patterns already in use                                │
│     → New endpoints must feel like they belong to the same   │
│       API — not a different product                          │
│                                                              │
│  2. ONE ENDPOINT, ONE RESPONSIBILITY                         │
│     → Each endpoint does one thing well                      │
│     → Use proper HTTP methods: GET reads, POST creates,      │
│       PUT replaces, PATCH updates, DELETE removes            │
│     → Never combine unrelated operations in one endpoint     │
│     → If an endpoint needs a verb in the URL, reconsider     │
│       the design                                             │
│                                                              │
│  3. VALIDATE EVERYTHING AT THE BOUNDARY                      │
│     → Every request body, query param, and path param gets   │
│       validated                                              │
│     → Use the project's validation library (Zod, Joi, etc.) │
│     → Return field-level error messages, not generic 400s    │
│     → Never trust client input — validate on the server      │
│                                                              │
│  4. DESIGN FOR THE CONSUMER                                  │
│     → Think from the frontend developer's perspective        │
│     → Consistent response shapes across all endpoints        │
│     → Pagination, filtering, and sorting follow one pattern  │
│     → Include only the data the consumer needs — no over-    │
│       fetching                                               │
│                                                              │
│  5. SECURITY IS NOT OPTIONAL                                 │
│     → Auth middleware on every protected route                │
│     → Rate limiting on public-facing endpoints               │
│     → Never expose internal IDs, stack traces, or DB schema  │
│     → Tenant isolation: user A must never see user B's data  │
│                                                              │
│  6. NO AI TOOL REFERENCES — ANYWHERE                         │
│     → No AI mentions in API docs, contracts, or comments     │
│     → All output reads as if written by a senior API         │
│       architect                                              │
└──────────────────────────────────────────────────────────────┘
```

---

## When to Use This Skill

- Building new API endpoints for a feature
- Coordinating frontend and backend teams on contracts
- Reviewing or refactoring an existing API surface
- Designing a public or partner API
- Migrating from one API version to another

---

## How It Works

```
┌─────────────────────────────────────────────────────────────────┐
│                      API DESIGN FLOW                            │
│                                                                 │
│  ┌────────────┐    ┌────────────┐    ┌──────────────────────┐   │
│  │ STEP 1     │    │ STEP 2     │    │ STEP 3               │   │
│  │ Identify   │───▶│ Define     │───▶│ Design Request/      │   │
│  │ Resources  │    │ Endpoints  │    │ Response Schemas      │   │
│  └────────────┘    └────────────┘    └──────────┬───────────┘   │
│                                                  │               │
│  ┌────────────┐    ┌────────────┐    ┌──────────▼───────────┐   │
│  │ STEP 6     │    │ STEP 5     │    │ STEP 4               │   │
│  │ Output     │◀───│ Versioning │◀───│ Error Handling        │   │
│  │ API Spec   │    │ Strategy   │    │ & Status Codes        │   │
│  └────────────┘    └────────────┘    └──────────────────────┘   │
└─────────────────────────────────────────────────────────────────┘
```

---

## Step 1: Identify Resources

Resources are the nouns of your API. Every endpoint operates on a resource.

### Resource Discovery Checklist

- [ ] List all entities the feature manages (users, courses, enrollments, etc.)
- [ ] Identify parent-child relationships (course → sections → content)
- [ ] Identify many-to-many relationships (users ↔ courses via enrollments)
- [ ] Determine which resources are top-level vs. nested
- [ ] Check existing API for similar resources — extend, do not duplicate

### Naming Rules

```
┌──────────────────────────────────────────────────────────────┐
│  RESOURCE NAMING RULES                                       │
│                                                              │
│  1. Use plural nouns: /users, /courses, /enrollments         │
│  2. Use kebab-case: /learning-paths, /quiz-results           │
│  3. Nest for ownership: /courses/:id/sections                │
│  4. Max 2 levels of nesting: /courses/:id/sections/:id       │
│     (deeper → use top-level with query filter)               │
│  5. Use verbs ONLY for actions that don't map to CRUD:       │
│     POST /courses/:id/publish                                │
│     POST /users/:id/impersonate                              │
│  6. Never expose database IDs in paths if they are           │
│     sequential integers — use UUIDs or slugs                 │
└──────────────────────────────────────────────────────────────┘
```

### Resource Hierarchy Template

```
/api/v1
├── /users
│   ├── GET    /              → List users (paginated)
│   ├── GET    /:id           → Get user details
│   ├── POST   /              → Create user
│   ├── PUT    /:id           → Update user
│   ├── DELETE /:id           → Soft-delete user
│   └── /users/:id/enrollments
│       ├── GET /              → List user's enrollments
│       └── POST /             → Enroll user in course
│
├── /courses
│   ├── GET    /              → List courses
│   ├── POST   /              → Create course
│   ├── GET    /:id           → Get course with sections
│   ├── PUT    /:id           → Update course
│   ├── DELETE /:id           → Soft-delete course
│   ├── POST   /:id/publish   → Publish course
│   └── /courses/:id/sections
│       ├── GET    /           → List sections
│       ├── POST   /           → Create section
│       └── ...
```

---

## Step 2: Define Endpoints

For each resource, define the full CRUD surface plus any custom actions.

### HTTP Method Mapping

| Operation | Method | Path | Idempotent | Safe |
|-----------|--------|------|------------|------|
| List | GET | /resources | Yes | Yes |
| Get one | GET | /resources/:id | Yes | Yes |
| Create | POST | /resources | No | No |
| Full update | PUT | /resources/:id | Yes | No |
| Partial update | PATCH | /resources/:id | No | No |
| Delete | DELETE | /resources/:id | Yes | No |
| Custom action | POST | /resources/:id/action | Depends | No |
| Bulk operation | POST | /resources/bulk | No | No |

### Pagination Pattern

```
GET /api/v1/courses?page=1&limit=20&sort=created_at&order=desc

Response:
{
  "items": [...],
  "pagination": {
    "page": 1,
    "limit": 20,
    "total": 156,
    "totalPages": 8,
    "hasNext": true,
    "hasPrev": false
  }
}
```

### Filtering Pattern

```
GET /api/v1/courses?status=published&category=engineering&search=react

Rules:
• Exact match: ?status=published
• Search (partial): ?search=react (searches title + description)
• Multiple values: ?status=published,draft (OR logic)
• Date range: ?created_after=2026-01-01&created_before=2026-12-31
• Boolean: ?is_featured=true
```

### Endpoint Specification Template

```
┌──────────────────────────────────────────────────────────────┐
│  ENDPOINT: POST /api/v1/courses/:courseId/enrollments        │
│                                                              │
│  Purpose: Enroll one or more users in a course               │
│  Auth: Bearer token (admin or instructor role)               │
│  Rate Limit: 30 req/min                                      │
│                                                              │
│  Path Params:                                                │
│  • courseId (uuid, required) — target course                 │
│                                                              │
│  Request Body:                                               │
│  {                                                           │
│    "userIds": ["uuid", ...],        // required, 1-100 items │
│    "role": "learner" | "instructor", // optional, default    │
│    "dueDate": "2026-06-01T00:00Z"   // optional              │
│  }                                                           │
│                                                              │
│  Success Response (201):                                     │
│  {                                                           │
│    "enrolled": 5,                                            │
│    "skipped": 1,                                             │
│    "errors": []                                              │
│  }                                                           │
│                                                              │
│  Error Responses:                                            │
│  • 400 — Invalid body (missing userIds, bad format)          │
│  • 401 — No auth token                                      │
│  • 403 — User lacks permission to enroll                     │
│  • 404 — Course not found                                    │
│  • 409 — Course not published (cannot enroll)                │
│  • 422 — One or more userIds are invalid                     │
└──────────────────────────────────────────────────────────────┘
```

---

## Step 3: Design Request/Response Schemas

### Schema Design Rules

```
┌──────────────────────────────────────────────────────────────┐
│  SCHEMA RULES                                                │
│                                                              │
│  1. Use camelCase for all field names                        │
│  2. Use ISO 8601 for all dates: "2026-03-27T10:30:00Z"      │
│  3. Use UUIDs for all IDs — never sequential integers        │
│  4. Nullable fields must be explicit: "deletedAt": null      │
│  5. Enums as lowercase strings: "status": "published"        │
│  6. Nested objects for related data, not flat fields          │
│  7. Arrays are always present (empty, not null)              │
│  8. Pagination wrapper for all list endpoints                │
│  9. Never expose internal fields (password_hash, tenant_id   │
│     in cross-tenant responses)                               │
│  10. Include "id" and timestamps in all responses            │
└──────────────────────────────────────────────────────────────┘
```

### Response Shape Templates

**Single resource:**
```json
{
  "id": "uuid",
  "title": "Introduction to React",
  "status": "published",
  "createdAt": "2026-03-27T10:30:00Z",
  "updatedAt": "2026-03-27T10:30:00Z",
  "author": {
    "id": "uuid",
    "name": "Jane Smith"
  }
}
```

**List with pagination:**
```json
{
  "items": [ ... ],
  "pagination": {
    "page": 1,
    "limit": 20,
    "total": 42,
    "totalPages": 3
  }
}
```

**Mutation response:**
```json
{
  "id": "uuid",
  "message": "Course created successfully"
}
```

### Validation Rules Template

| Field | Type | Required | Constraints |
|-------|------|----------|-------------|
| title | string | Yes | 1-200 chars, trimmed |
| description | string | No | Max 5000 chars |
| status | enum | No | draft, published, archived |
| tags | string[] | No | Max 10 items, each max 50 chars |
| dueDate | ISO date | No | Must be in the future |
| email | string | Yes | Valid email format |
| page | integer | No | Min 1, default 1 |
| limit | integer | No | Min 1, max 100, default 20 |

---

## Step 4: Error Handling and Status Codes

### Standard Error Response Shape

```json
{
  "error": {
    "code": "COURSE_NOT_FOUND",
    "message": "Course with ID abc-123 does not exist",
    "details": [
      {
        "field": "courseId",
        "message": "No course found with this ID"
      }
    ]
  }
}
```

### HTTP Status Code Reference

```
┌──────────────────────────────────────────────────────────────┐
│  STATUS CODES — WHEN TO USE EACH                             │
│                                                              │
│  2xx SUCCESS                                                 │
│  200 OK          — GET, PUT, PATCH success                   │
│  201 Created     — POST success (resource created)           │
│  204 No Content  — DELETE success (no body returned)         │
│                                                              │
│  4xx CLIENT ERRORS                                           │
│  400 Bad Request   — Malformed JSON, missing required fields │
│  401 Unauthorized  — No token or expired token               │
│  403 Forbidden     — Valid token but insufficient role       │
│  404 Not Found     — Resource does not exist                 │
│  409 Conflict      — State conflict (publish draft twice)    │
│  422 Unprocessable — Valid JSON but business rule violation  │
│  429 Too Many      — Rate limit exceeded                     │
│                                                              │
│  5xx SERVER ERRORS                                           │
│  500 Internal      — Unexpected error (log + alert)          │
│  502 Bad Gateway   — Upstream service failure                │
│  503 Unavailable   — Service overloaded or in maintenance    │
└──────────────────────────────────────────────────────────────┘
```

### Error Code Registry

Define a flat list of error codes per domain:

| Code | HTTP | Description |
|------|------|-------------|
| AUTH_TOKEN_EXPIRED | 401 | JWT has expired |
| AUTH_INSUFFICIENT_ROLE | 403 | User role cannot perform this action |
| RESOURCE_NOT_FOUND | 404 | Requested resource does not exist |
| VALIDATION_FAILED | 400 | Request body failed validation |
| DUPLICATE_ENTRY | 409 | Resource with this identifier already exists |
| RATE_LIMIT_EXCEEDED | 429 | Too many requests from this client |
| INTERNAL_ERROR | 500 | Unexpected server error |

---

## Step 5: Versioning Strategy

### Decision Tree

```
Do you have external API consumers?
├── YES → Use URL versioning: /api/v1/, /api/v2/
│         → Maintain v1 for 12 months after v2 launch
│         → Use deprecation headers on v1 responses
└── NO  → Is this an internal API?
          ├── YES → No versioning needed initially
          │         → Add versioning when breaking changes arise
          └── Consider header versioning: Accept: application/vnd.api.v1+json
```

### Breaking vs. Non-Breaking Changes

| Change Type | Breaking? | Action |
|-------------|-----------|--------|
| Add optional field to response | No | Just add it |
| Add optional query parameter | No | Just add it |
| Remove a field from response | YES | New version |
| Rename a field | YES | New version |
| Change field type | YES | New version |
| Add required field to request | YES | New version |
| Change endpoint path | YES | New version |
| Change error response shape | YES | New version |
| Add new endpoint | No | Just add it |
| Deprecate an endpoint | No | Add deprecation header |

### Deprecation Header

```
Deprecation: true
Sunset: Sat, 01 Jan 2027 00:00:00 GMT
Link: </api/v2/courses>; rel="successor-version"
```

---

## Step 6: Output the API Specification

### Required Deliverables

1. **Resource list** with hierarchy
2. **Endpoint table** for each resource (method, path, auth, description)
3. **Request/response schemas** for each endpoint (JSON examples)
4. **Validation rules** per field
5. **Error code registry** with HTTP status mapping
6. **Pagination and filtering** conventions
7. **Authentication requirements** per endpoint
8. **Rate limiting** rules

---

## Anti-Patterns — Never Do These

| Anti-Pattern | Why It Fails | Do Instead |
|-------------|-------------|-----------|
| Verbs in URLs: GET /getUsers | Not RESTful, inconsistent | GET /users |
| Returning 200 for errors | Client cannot detect failure | Use proper status codes |
| Inconsistent naming (camelCase + snake_case) | Frontend/backend confusion | Pick one, use everywhere |
| Deeply nested URLs (/a/:id/b/:id/c/:id/d) | Hard to maintain, unclear ownership | Max 2 levels, then top-level |
| No pagination on list endpoints | DB overload, slow responses | Always paginate |
| Exposing DB schema directly | Leaks internals, hard to evolve | Design DTOs separately |
| No error codes (just messages) | Clients can't programmatically handle errors | Use structured error codes |
| Different response shapes per endpoint | Frontend must handle each case | Standardize response envelope |

---

## Quality Checklist — Before Finalizing API Contract

```
┌──────────────────────────────────────────────────────────────┐
│  API DESIGN REVIEW CHECKLIST                                 │
│                                                              │
│  □ All resources use plural nouns and kebab-case             │
│  □ Every endpoint has defined auth requirements              │
│  □ Request/response schemas are documented with examples     │
│  □ All list endpoints have pagination                        │
│  □ Error responses use consistent shape and error codes      │
│  □ Validation rules are explicit for every field             │
│  □ No internal fields leak in responses (password, etc.)     │
│  □ Rate limits are defined per endpoint category             │
│  □ Breaking changes are versioned, not silently deployed     │
│  □ Idempotency is considered for POST/PUT operations         │
│  □ Filtering and sorting follow a consistent pattern         │
│  □ CORS and security headers are specified                   │
│  □ API contract matches what frontend expects                │
└──────────────────────────────────────────────────────────────┘
```

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
