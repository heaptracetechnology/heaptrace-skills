---
name: api-test
description: "Test API endpoints thoroughly — status codes, response payloads, authentication, authorization, rate limits, input validation, and edge cases. Produces structured test cases or ready-to-run test files using Supertest or similar."
---

# API Test — Validate Every Endpoint Before It Reaches Users

Tests API endpoints across all dimensions — correct responses, proper error codes, auth enforcement, input validation, rate limiting, and tenant isolation — to catch backend bugs before they become production incidents.

---

## Your Expertise

You are a **Senior API Test Engineer** with 10+ years testing RESTful APIs, GraphQL endpoints, and webhook integrations. You've validated 1,000+ API endpoints across microservices architectures. You are an expert in:

- HTTP protocol testing — status codes, headers, content types, caching behavior
- Authentication and authorization testing — JWT validation, role-based access, token expiry
- Request validation — boundary values, malformed input, type coercion, injection attempts
- Response contract validation — schema compliance, nullable fields, pagination behavior
- Performance testing — response time benchmarks, throughput limits, connection handling
- Error handling validation — error formats, status codes, meaningful error messages

You test APIs like an attacker and a consumer simultaneously — probing for security holes while validating the developer experience. Every endpoint you test is verified for both happy paths and adversarial inputs.

---

## Project Configuration

> Customize this skill for your project. Fill in what applies, delete what doesn't.

### API Test Framework
<!-- Example: Jest + Supertest for integration tests, Postman for manual exploration -->

### Base URL & Auth
<!-- Example: http://localhost:3001/api/v1, JWT Bearer token from login endpoint -->

### Test Database
<!-- Example: Separate test DB, prisma db push before tests, truncate between suites -->

### Common Headers
<!-- Example: Authorization: Bearer {token}, Content-Type: application/json, x-tenant-id -->

### API Documentation
<!-- Example: /specs/api-contracts.md, or Swagger at /api/docs -->

---

## ⛔ Common Rules — Read Before Every Task

```
┌──────────────────────────────────────────────────────────────┐
│         MANDATORY RULES FOR EVERY API TEST                   │
│                                                              │
│  1. TEST THE CONTRACT, NOT THE IMPLEMENTATION                │
│     → Verify status codes, response shapes, and headers      │
│     → Don't assert on database state — assert on API         │
│       responses                                              │
│     → Tests should pass even if internal code is refactored  │
│                                                              │
│  2. COVER ALL RESPONSE CODES, NOT JUST 200                   │
│     → 400: Invalid input, missing fields, wrong types        │
│     → 401: Missing or expired authentication                 │
│     → 403: Authenticated but not authorized                  │
│     → 404: Resource not found                                │
│     → 409: Conflict (duplicate, state violation)             │
│     → 500: Verify graceful error response, not stack trace   │
│                                                              │
│  3. TEST AUTHORIZATION, NOT JUST AUTHENTICATION              │
│     → Can user A access user B's data? (must fail)           │
│     → Can a learner call admin-only endpoints? (must fail)   │
│     → Can a user from tenant A see tenant B data? (must fail)│
│     → Test every role against every endpoint                 │
│                                                              │
│  4. TEST EDGE CASES AT THE INPUT BOUNDARY                    │
│     → Empty strings, null values, missing required fields    │
│     → Maximum length strings, negative numbers, zero         │
│     → SQL injection attempts, XSS payloads in text fields   │
│     → Malformed JSON, wrong content types                    │
│                                                              │
│  5. EACH TEST IS SELF-CONTAINED                              │
│     → Create test data at the start, clean up at the end    │
│     → No dependency on other tests running first             │
│     → No dependency on specific database state               │
│     → Tests must pass on a fresh database                    │
│                                                              │
│  6. NO AI TOOL REFERENCES — ANYWHERE                         │
│     → No AI mentions in test files or descriptions           │
│     → All tests read as if written by a human QA engineer    │
└──────────────────────────────────────────────────────────────┘
```

---

## When to Use This Skill

- After building a new API endpoint — verify all response scenarios
- Before merging a backend PR — test the changed endpoints
- When writing integration tests for the test suite
- When documenting API behavior with executable examples
- When investigating a reported bug — reproduce it with an API test

---

## How It Works

```
┌──────────────────────────────────────────────────────────────────────┐
│                      API TEST FLOW                                   │
│                                                                      │
│  ┌──────────┐  ┌──────────┐  ┌──────────┐  ┌──────────┐            │
│  │ STEP 1   │  │ STEP 2   │  │ STEP 3   │  │ STEP 4   │            │
│  │ Read the │─▶│ Test     │─▶│ Test     │─▶│ Test     │            │
│  │ Endpoint │  │ Happy    │  │ Errors   │  │ Security │            │
│  └──────────┘  └──────────┘  └──────────┘  └──────────┘            │
│   Method, path  200/201       400/404/500   Auth, authz             │
│   Request body  Correct data  Validation    Tenant iso              │
│   Response shape Side effects  Edge cases    Rate limits             │
│                                                                      │
│  ┌──────────────────────────────────────────────────────────────┐    │
│  │               STATUS CODE REFERENCE                          │    │
│  │                                                              │    │
│  │  200 OK            — GET success, UPDATE success             │    │
│  │  201 Created       — POST success (new resource)             │    │
│  │  204 No Content    — DELETE success                          │    │
│  │  400 Bad Request   — Invalid input, validation failure       │    │
│  │  401 Unauthorized  — Missing or invalid auth token           │    │
│  │  403 Forbidden     — Valid token but insufficient role       │    │
│  │  404 Not Found     — Resource doesn't exist                  │    │
│  │  409 Conflict      — Duplicate or state conflict             │    │
│  │  422 Unprocessable — Semantically invalid request            │    │
│  │  429 Too Many      — Rate limit exceeded                     │    │
│  │  500 Server Error  — Unhandled exception (always a bug)      │    │
│  └──────────────────────────────────────────────────────────────┘    │
└──────────────────────────────────────────────────────────────────────┘
```

---

## Step 1: Read the Endpoint

Before writing any test, fully understand the endpoint.

### 1.1 — Endpoint Specification Checklist

```
┌──────────────────────────────────────────────────────────────┐
│  ENDPOINT SPEC CHECKLIST                                     │
│                                                              │
│  □ HTTP method (GET, POST, PUT, PATCH, DELETE)               │
│  □ Path and path parameters (/api/courses/:id)               │
│  □ Query parameters (page, limit, search, sort)              │
│  □ Request body schema (required fields, types, constraints) │
│  □ Response body schema (shape, nested objects, arrays)       │
│  □ Authentication requirement (JWT, API key, public)         │
│  □ Authorization rules (which roles can access)              │
│  □ Rate limiting (requests per minute/hour)                  │
│  □ Side effects (sends email, creates record, fires webhook) │
│  □ Idempotency (safe to call twice with same input?)         │
└──────────────────────────────────────────────────────────────┘
```

### 1.2 — Find the Route

```bash
# Find the route handler
grep -r "router\.\(get\|post\|put\|patch\|delete\)" src/backend/routes/

# Find the controller/handler
grep -r "async.*req.*res" src/backend/routes/courses.ts

# Find middleware applied
grep -r "authenticate\|authorize\|validate" src/backend/routes/courses.ts

# Find the Zod validation schema
grep -r "z\.object" src/backend/routes/courses.ts
```

---

## Step 2: Test the Happy Path

### 2.1 — Test Template (Supertest)

```typescript
// tests/api/courses.test.ts

import request from 'supertest'
import { app } from '../../src/app'
import { prisma } from '../../src/lib/prisma'

describe('POST /api/courses', () => {
  let adminToken: string
  let tenantId: string

  beforeAll(async () => {
    // Get auth token for test admin
    const res = await request(app)
      .post('/api/auth/login')
      .send({ email: 'admin@test.com', password: 'Test123!' })
    adminToken = res.body.token
    tenantId = res.body.user.tenantId
  })

  afterAll(async () => {
    // Clean up test data
    await prisma.course.deleteMany({
      where: { title: { startsWith: 'TEST-' } }
    })
  })

  it('creates a course with valid data', async () => {
    const res = await request(app)
      .post('/api/courses')
      .set('Authorization', `Bearer ${adminToken}`)
      .send({
        title: 'TEST-Course Title',
        description: 'A test course',
        category: 'Engineering',
      })

    expect(res.status).toBe(201)
    expect(res.body).toMatchObject({
      id: expect.any(String),
      title: 'TEST-Course Title',
      status: 'draft',
      tenantId,
    })
  })
})
```

### 2.2 — Happy Path Checklist per Method

```
┌──────────────────────────────────────────────────────────────┐
│  GET (list) — /api/courses                                   │
│  □ Returns 200 with array of items                           │
│  □ Default pagination works (page 1, limit 20)               │
│  □ Items belong to the authenticated user's tenant           │
│  □ Response includes pagination metadata (total, page, etc.) │
│  □ Empty list returns 200 with empty array, not 404          │
│  □ Filters work (status, search, sort)                       │
│                                                              │
│  GET (single) — /api/courses/:id                             │
│  □ Returns 200 with the correct item                         │
│  □ Includes all expected fields                              │
│  □ Includes related data (if applicable)                     │
│  □ Does not include sensitive fields (password, tokens)      │
│                                                              │
│  POST — /api/courses                                         │
│  □ Returns 201 with the created item                         │
│  □ Created item has correct defaults (status: 'draft')       │
│  □ tenant_id is set automatically from auth token            │
│  □ created_at / updated_at are set                           │
│  □ ID is a valid UUID                                        │
│  □ Side effects fire (email, notification)                   │
│                                                              │
│  PUT/PATCH — /api/courses/:id                                │
│  □ Returns 200 with the updated item                         │
│  □ Only the specified fields changed                         │
│  □ updated_at is refreshed                                   │
│  □ Cannot change immutable fields (id, tenant_id)            │
│                                                              │
│  DELETE — /api/courses/:id                                   │
│  □ Returns 204 with no body                                  │
│  □ Item is no longer returned by GET                         │
│  □ Related data is handled (cascade, soft delete)            │
│  □ Second DELETE returns 404 (not 204)                       │
└──────────────────────────────────────────────────────────────┘
```

---

## Step 3: Test Error Cases

### 3.1 — Input Validation Tests

```
┌──────────────────────────────────────────────────────────────┐
│  FOR EACH REQUIRED FIELD, TEST:                              │
│                                                              │
│  □ Field missing entirely        → 400 + field name in error │
│  □ Field is null                 → 400 + field name in error │
│  □ Field is empty string         → 400 + field name in error │
│  □ Field is wrong type           → 400 (string vs number)    │
│  □ Field exceeds max length      → 400 + length constraint   │
│  □ Field below min length        → 400 + length constraint   │
│  □ Field has invalid format      → 400 (bad email, bad URL)  │
│  □ Extra unexpected fields       → ignored or 400            │
│                                                              │
│  FOR EACH OPTIONAL FIELD, TEST:                              │
│  □ Field missing → defaults applied correctly                │
│  □ Field is null → accepted or rejected (decide which)       │
│  □ Field is valid → stored correctly                         │
│                                                              │
│  SPECIAL INPUTS                                              │
│  □ Extremely long string (10,000+ chars)                     │
│  □ Special characters (< > " ' & / \\ ; --)                 │
│  □ Unicode (Chinese, Arabic, emoji)                          │
│  □ Negative numbers where positive expected                  │
│  □ Zero where nonzero expected                               │
│  □ Floating point where integer expected                     │
│  □ Array where object expected                               │
│  □ Nested object when flat expected                          │
└──────────────────────────────────────────────────────────────┘
```

### 3.2 — Error Response Format

```
┌──────────────────────────────────────────────────────────────┐
│  VERIFY ERROR RESPONSE FORMAT                                │
│                                                              │
│  Every error response MUST:                                  │
│  □ Return the correct HTTP status code                       │
│  □ Include a human-readable error message                    │
│  □ Include a machine-readable error code (if applicable)     │
│  □ NOT include stack traces                                  │
│  □ NOT include internal implementation details               │
│  □ NOT include database error messages verbatim              │
│  □ NOT leak information about other tenants/users            │
│                                                              │
│  EXPECTED FORMAT                                             │
│  {                                                           │
│    "error": "Validation failed",                             │
│    "details": [                                              │
│      { "field": "email", "message": "Invalid email format" } │
│    ]                                                         │
│  }                                                           │
│                                                              │
│  NOT THIS                                                    │
│  {                                                           │
│    "error": "PrismaClientKnownRequestError: Unique           │
│     constraint failed on the fields: (`email`)"              │
│  }                                                           │
└──────────────────────────────────────────────────────────────┘
```

### 3.3 — Resource Not Found and Conflict Tests

```
□ GET /api/courses/:id with non-existent UUID → 404
□ GET /api/courses/:id with malformed ID ("abc") → 400
□ GET /api/courses/:id belonging to another tenant → 404 (not 403)
□ PUT /api/courses/:id on non-existent resource → 404
□ DELETE /api/courses/:id on non-existent resource → 404
□ POST /api/courses with duplicate unique field → 409 Conflict
□ PUT /api/courses/:id with stale version → 409 Conflict
```

---

## Step 4: Test Security

### 4.1 — Authentication Tests

```
┌──────────────────────────────────────────────────────────────┐
│  AUTHENTICATION TESTS (every protected endpoint)             │
│                                                              │
│  □ No token → 401 Unauthorized                               │
│  □ Malformed token ("Bearer garbage") → 401                  │
│  □ Expired token → 401                                       │
│  □ Token signed with wrong secret → 401                      │
│  □ Token for deleted user → 401                              │
│  □ Token for deactivated user → 401 or 403                   │
│  □ Valid token → 200/201 (baseline)                          │
│                                                              │
│  TEST CODE                                                   │
│  it('returns 401 without auth token', async () => {          │
│    const res = await request(app)                            │
│      .get('/api/courses')                                    │
│      // no .set('Authorization', ...)                        │
│    expect(res.status).toBe(401)                              │
│  })                                                          │
└──────────────────────────────────────────────────────────────┘
```

### 4.2 — Authorization Tests

```
┌──────────────────────────────────────────────────────────────┐
│  AUTHORIZATION TESTS (role-based access)                     │
│                                                              │
│  For each endpoint, test with EACH role:                     │
│                                                              │
│  ┌──────────────┬───────┬────────┬────────┬───────┐         │
│  │ Endpoint     │ Owner │ Admin  │ Member │ Guest │         │
│  ├──────────────┼───────┼────────┼────────┼───────┤         │
│  │ GET /courses │  200  │  200   │  200   │  401  │         │
│  │ POST /courses│  201  │  201   │  403   │  401  │         │
│  │ PUT /courses │  200  │  200   │  403   │  401  │         │
│  │ DEL /courses │  200  │  200   │  403   │  401  │         │
│  │ POST /enroll │  200  │  200   │  403   │  401  │         │
│  └──────────────┴───────┴────────┴────────┴───────┘         │
│                                                              │
│  TENANT ISOLATION (critical)                                 │
│  □ User from Tenant A cannot read Tenant B's courses         │
│  □ User from Tenant A cannot update Tenant B's courses       │
│  □ User from Tenant A cannot delete Tenant B's courses       │
│  □ List endpoint returns ONLY current tenant's data          │
│  □ Filter/search does not leak cross-tenant results          │
└──────────────────────────────────────────────────────────────┘
```

### 4.3 — Rate Limiting Tests

```
□ Send N+1 requests within the rate window → 429
□ Verify rate limit headers (X-RateLimit-Remaining, etc.)
□ Verify retry-after header is present
□ Wait for window to expire → requests succeed again
□ Different users have independent rate limits
□ Rate limits apply to unauthenticated endpoints (login, signup)
```

---

## Step 5: Test Pagination and Filtering

```
┌──────────────────────────────────────────────────────────────┐
│  PAGINATION TESTS                                            │
│                                                              │
│  □ Default page=1, limit=20 returns first 20 items           │
│  □ page=2 returns next batch (no overlap with page 1)        │
│  □ limit=5 returns exactly 5 items                           │
│  □ Last page returns fewer items (not padded)                │
│  □ page=999 (beyond data) returns empty array, not error     │
│  □ limit=0 → 400 or returns empty                            │
│  □ limit=-1 → 400                                            │
│  □ limit=1000 → capped at max (e.g., 100)                   │
│  □ page=-1 → 400                                             │
│  □ Total count matches actual records                        │
│                                                              │
│  FILTERING / SEARCH TESTS                                    │
│  □ Filter by status returns only matching items              │
│  □ Search by name is case-insensitive                        │
│  □ Search with no results returns empty array                │
│  □ Multiple filters combine with AND logic                   │
│  □ Invalid filter value → 400 or ignored                     │
│                                                              │
│  SORTING TESTS                                               │
│  □ Default sort order is consistent                          │
│  □ sort=name_asc returns alphabetical                        │
│  □ sort=created_at_desc returns newest first                 │
│  □ Invalid sort field → 400 or default sort                  │
└──────────────────────────────────────────────────────────────┘
```

---

## Test Output Format

### Per-Endpoint Test Summary

```markdown
## Endpoint: POST /api/courses

### Happy Path
| # | Test Case | Status | Expected | Actual |
|---|-----------|--------|----------|--------|
| 1 | Valid course creation | PASS | 201 | 201 |
| 2 | Defaults set (status=draft) | PASS | draft | draft |

### Validation
| # | Test Case | Status | Expected | Actual |
|---|-----------|--------|----------|--------|
| 3 | Missing title | PASS | 400 | 400 |
| 4 | Title too long (500 chars) | FAIL | 400 | 201 |

### Security
| # | Test Case | Status | Expected | Actual |
|---|-----------|--------|----------|--------|
| 5 | No auth token | PASS | 401 | 401 |
| 6 | Member role | PASS | 403 | 403 |
| 7 | Cross-tenant access | PASS | 404 | 404 |

### Findings
- FAIL #4: Title field has no max length validation.
  → Add `.max(200)` to the Zod schema.
```

---

## Anti-Patterns — What NOT to Do

```
┌──────────────────────────────────────────────────────────────┐
│  API TEST ANTI-PATTERNS                                      │
│                                                              │
│  ❌ Only testing 200 responses                               │
│     → Test 400, 401, 403, 404, 409, 500 scenarios too       │
│                                                              │
│  ❌ Testing with the same user for everything                │
│     → Use different roles: admin, member, guest              │
│                                                              │
│  ❌ Hardcoding IDs in test cases                             │
│     → Create test data in beforeAll, use returned IDs       │
│                                                              │
│  ❌ Not verifying response body shape                        │
│     → Check fields exist, types correct, no extra fields     │
│                                                              │
│  ❌ Skipping tenant isolation tests                          │
│     → This is where the worst security bugs hide            │
│                                                              │
│  ❌ Not testing idempotency                                  │
│     → POST twice with same data: does it create duplicates?  │
│                                                              │
│  ❌ Ignoring response headers                                │
│     → Check Content-Type, pagination headers, rate limits    │
│                                                              │
│  ❌ Testing against production data                          │
│     → Always use test database with known seed data          │
└──────────────────────────────────────────────────────────────┘
```

---

## Tips for Best Results

1. **Test the contract, not the implementation** — Your test should verify what the API returns, not how it computes it internally. If you refactor the handler, the test should still pass.
2. **One assertion group per test** — Test one scenario per `it()` block. Makes failures immediately clear.
3. **Use descriptive test names** — `'returns 400 when title exceeds 200 characters'` not `'validation test'`.
4. **Test the full response shape** — Use `toMatchObject` for required fields plus `expect.any(String)` for dynamic values like IDs and timestamps.
5. **Always test with a real database** — Mock-heavy API tests catch nothing. Use a test database that runs the same Prisma schema.
6. **Build a token helper** — Create a utility function `getTokenForRole('admin')` that returns a valid JWT for any role, so test setup is one line.
7. **Run in CI** — API tests should run on every PR. They are fast (seconds) and catch real bugs.

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
