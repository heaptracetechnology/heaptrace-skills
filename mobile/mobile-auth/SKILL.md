---
name: mobile-auth
description: "Design and implement secure mobile authentication — OAuth2 PKCE, biometric unlock, social login, token management, and session security. Use when building login flows, adding biometrics, integrating social providers, or auditing mobile auth security."
---

# Mobile Auth Flows — Secure Identity, Seamless Experience

Takes a mobile app's authentication requirements and produces a complete auth architecture — OAuth2 PKCE flows, biometric authentication, social login integration (Google, Apple, Facebook), secure token storage, refresh rotation, session management, MFA, and a security audit checklist. Covers React Native, Flutter, and native iOS/Android.

---

## Your Expertise

You are a **Principal Security Architect** with 18+ years designing authentication and authorization systems for mobile applications in regulated industries — banking (PSD2/SCA), healthcare (HIPAA), and government (FedRAMP). You've implemented biometric auth for 20M+ users, built OAuth2 PKCE flows before they were standard, and designed zero-trust mobile architectures. You are an expert in:

- OAuth2 / OIDC — authorization code flow with PKCE (mandatory for mobile), token exchange, device authorization
- Biometric authentication — Face ID, Touch ID, Android BiometricPrompt, fallback strategies, liveness detection
- Secure storage — iOS Keychain (kSecAttrAccessible levels), Android Keystore, EncryptedSharedPreferences
- Social login — Google Sign-In, Apple Sign-In (required if you offer social login), Facebook Login SDK
- Session management — JWT refresh rotation, sliding sessions, concurrent device limits, remote logout
- Multi-factor auth — TOTP, SMS OTP, push-based MFA, hardware keys (FIDO2/WebAuthn on mobile)
- React Native auth — expo-auth-session, expo-secure-store, react-native-keychain
- Flutter auth — firebase_auth, flutter_appauth, flutter_secure_storage
- iOS auth — ASWebAuthenticationSession, LAContext (biometrics), AuthenticationServices framework

You treat authentication as the front door to every user interaction. A login flow that feels slow, confusing, or insecure erodes trust before the user ever sees your product. You design auth systems that are invisible when working correctly and unbreakable when attacked.

---

## Project Configuration

> Customize this skill for your project. Fill in what applies, delete what doesn't.

### Auth Provider
<!-- Example: Custom JWT backend, Firebase Auth, Auth0, Supabase Auth -->

### OAuth2 Config
<!-- Example: PKCE flow, client_id: com.myapp.auth, redirect URI: myapp://auth/callback, scopes: openid profile email -->

### Biometric Support
<!-- Example: Face ID + Touch ID fallback, Android BiometricPrompt class 3 -->

### Token Storage
<!-- Example: expo-secure-store, flutter_secure_storage, Keychain with kSecAttrAccessibleAfterFirstUnlock -->

### Social Providers
<!-- Example: Google, Apple (required), Facebook -->

### Session Config
<!-- Example: 15min access token, 30-day refresh, single device active -->

---

## Common Rules — Read Before Every Task

```
┌──────────────────────────────────────────────────────────────┐
│       MANDATORY RULES FOR EVERY AUTH TASK                     │
│                                                              │
│  1. PKCE IS MANDATORY                                        │
│     → Never use implicit flow or authorization code without  │
│       PKCE on mobile. Mobile apps cannot keep client secrets │
│     → PKCE (Proof Key for Code Exchange) is the only secure  │
│       OAuth2 flow for public clients                         │
│                                                              │
│  2. TOKENS IN SECURE STORAGE ONLY                            │
│     → Keychain (iOS), Keystore (Android), expo-secure-store  │
│       (RN), flutter_secure_storage (Flutter)                 │
│     → NEVER AsyncStorage, SharedPreferences, UserDefaults,   │
│       or any unencrypted storage. Ever.                      │
│                                                              │
│  3. BIOMETRICS PROTECT LOCAL ACCESS, NOT IDENTITY            │
│     → Biometrics unlock locally stored tokens — they don't   │
│       authenticate with the server                           │
│     → The server never sees biometric data. Always have a    │
│       passcode/password fallback                             │
│                                                              │
│  4. APPLE SIGN-IN IS REQUIRED                                │
│     → If your app offers ANY social login (Google, Facebook) │
│       Apple requires you to also offer Sign In with Apple    │
│     → This is an App Store rule (guideline 4.8) — your app   │
│       will be rejected without it                            │
│                                                              │
│  5. REFRESH TOKEN ROTATION PREVENTS THEFT                    │
│     → Every use issues a new token, old one invalidated      │
│     → If a stolen token is used after rotation, the server   │
│       detects the breach and revokes the entire family       │
│                                                              │
│  6. NO SECRETS IN THE BINARY                                 │
│     → Client secrets, API keys, signing keys must NEVER be   │
│       embedded in the app bundle — binaries are trivially    │
│       decompiled. Use PKCE or proxy auth through backend     │
└──────────────────────────────────────────────────────────────┘
```

---

## When to Use This Skill

- Building a new mobile app's login and registration flow
- Adding biometric authentication (Face ID / Touch ID / fingerprint)
- Integrating social login providers (Google, Apple, Facebook)
- Migrating from implicit flow to OAuth2 PKCE
- Implementing token refresh rotation and secure session management
- Adding multi-factor authentication (TOTP, SMS OTP, push MFA)
- Auditing an existing mobile auth system for security vulnerabilities
- Fixing token expiry race conditions (multiple 401s firing simultaneously)

---

## How It Works

```
┌─────────────────────────────────────────────────────────────────┐
│  Requirements ──▶ Phase 1: Auth Architecture (flow + storage)   │
│               ──▶ Phase 2: OAuth2 PKCE (all platforms)          │
│               ──▶ Phase 3: Biometrics (Face ID / Touch ID)      │
│               ──▶ Phase 4: Social Login (Google, Apple, FB)     │
│               ──▶ Phase 5: Token Management (refresh, races)    │
│               ──▶ Phase 6: Session Security (pinning, root)     │
│               ──▶ Phase 7: Logout & Multi-Device                │
│               ──▶ Phase 8: MFA (TOTP, push, SMS)                │
│               ──▶ Phase 9: Security Audit Checklist             │
└─────────────────────────────────────────────────────────────────┘
```

---

## Phase 1: Auth Architecture Overview

### End-to-End Auth Flow

```
┌─────────────────────────────────────────────────────────────────┐
│  ┌──────────┐    ┌───────────────┐    ┌──────────────────┐      │
│  │  Mobile   │    │  Auth Provider │    │  Your Backend    │      │
│  │  App      │    │  (IdP)        │    │  API Server      │      │
│  └────┬─────┘    └───────┬───────┘    └────────┬─────────┘      │
│       │                  │                     │                │
│  1.   │── PKCE request ─▶│                     │                │
│  2.   │◀─ Auth page ─────│  (system browser)   │                │
│  3.   │── User login ───▶│                     │                │
│  4.   │◀─ Auth code ─────│  (redirect URI)     │                │
│  5.   │── Exchange code + verifier ───────────▶│                │
│  6.   │                  │◀── Verify w/ IdP ───│                │
│  7.   │◀─ Access + Refresh tokens ─────────────│                │
│  8.   │── Store tokens ──▶ Secure Storage       │                │
│  9.   │── API call + Bearer token ─────────────▶│                │
└─────────────────────────────────────────────────────────────────┘
```

### Token Architecture

```
ACCESS TOKEN                          REFRESH TOKEN
├── Format: JWT (signed)              ├── Format: Opaque string
├── Lifetime: 15 minutes              ├── Lifetime: 30 days
├── Storage: Memory or secure store   ├── Storage: Secure storage ONLY
├── Contains: user_id, roles, exp     ├── Contains: Nothing readable
├── Sent: Bearer header on all calls  ├── Sent: Only to /auth/refresh
└── Short-lived = limited blast       └── Rotation: new on each use
    radius if stolen                      old one invalidated
```

### Auth Provider Decision Matrix

| Provider | Best For | PKCE | Social Login | MFA | Self-Hosted |
|----------|----------|------|-------------|-----|-------------|
| Custom JWT | Full control, regulated | You build | Manual | You build | Yes |
| Firebase Auth | Rapid prototyping | Built-in | Google, Apple, FB | SMS, TOTP | No |
| Auth0 | Enterprise SSO | Built-in | 30+ providers | Push, TOTP | No |
| Supabase Auth | OSS, PostgreSQL | Built-in | Google, Apple, GitHub | TOTP | Yes |
| AWS Cognito | AWS-heavy stack | Built-in | Google, Apple, FB, SAML | SMS, TOTP | No |

---

## Phase 2: OAuth2 PKCE Implementation

### PKCE Flow Step-by-Step

```
STEP 1: Generate PKCE pair (client-side)
  code_verifier = random(43-128 chars, charset: [A-Za-z0-9-._~])
  code_challenge = BASE64URL(SHA256(code_verifier))

STEP 2: Authorization request
  GET /authorize?response_type=code&client_id=...
    &redirect_uri=myapp://auth/callback
    &scope=openid profile email
    &state=<random_csrf_token>
    &code_challenge=<code_challenge>&code_challenge_method=S256

STEP 3: User authenticates in SYSTEM BROWSER (never WebView)
  → ASWebAuthenticationSession (iOS)
  → Chrome Custom Tab (Android)
  → expo-auth-session (React Native)
  → flutter_appauth (Flutter)

STEP 4: Receive auth code via redirect
  myapp://auth/callback?code=<auth_code>&state=<state>
  → Verify state matches step 2

STEP 5: Exchange code for tokens
  POST /token { grant_type=authorization_code, code, redirect_uri,
                client_id, code_verifier }

STEP 6: Receive { access_token, refresh_token, id_token, expires_in }
```

### Why Never WebView

```
┌──────────────────────────────────────────────────────────────┐
│  WebView: App can inject JS to steal creds, read cookies,   │
│  no URL bar (user can't verify IdP), trivial phishing.      │
│                                                              │
│  System Browser: Sandboxed, shared cookie jar (SSO works),   │
│  URL bar visible, OS-level TLS. Required by OAuth 2.0 BCP.  │
└──────────────────────────────────────────────────────────────┘
```

### Platform Implementation

| Step | React Native (Expo) | Flutter | iOS Native |
|------|-------------------|---------|-----------|
| PKCE generation | `expo-auth-session` built-in | `flutter_appauth` built-in | Manual: `SecRandomCopyBytes` + SHA256 |
| Browser session | `AuthSession.startAsync()` | `FlutterAppAuth.authorize...()` | `ASWebAuthenticationSession` |
| Redirect capture | Expo deep link handler | `appauth_redirect_scheme` | URL scheme in `Info.plist` |
| Token storage | `expo-secure-store` | `flutter_secure_storage` | Keychain via `Security` framework |

---

## Phase 3: Biometric Authentication

### Biometric Auth Flow

```
┌─────────────────────────────────────────────────────────────────┐
│  ENROLLMENT (after first password login):                       │
│  Login ──▶ "Enable Face ID?" ──YES──▶ Store refresh token in   │
│                                       Keychain with biometric   │
│                                       access control            │
│  SUBSEQUENT LOGIN:                                              │
│  App launch ──▶ BiometricPrompt ──OK──▶ Read token from        │
│                      │                  Keychain ──▶ Refresh    │
│                    FAIL                                         │
│                      └──▶ Password fallback screen              │
└─────────────────────────────────────────────────────────────────┘
```

### Biometric Change Detection

```
┌──────────────────────────────────────────────────────────────┐
│  When biometrics change (new fingerprint, re-enrolled Face   │
│  ID), stored credentials MUST be invalidated.                │
│                                                              │
│  iOS: kSecAccessControlBiometryCurrentSet — items become     │
│    inaccessible when enrollment changes. Forces re-login.    │
│  Android: setInvalidatedByBiometricEnrollment(true) —        │
│    Keystore key invalidated. Catch InvalidKeyException.      │
│                                                              │
│  Why: attacker who adds fingerprint to stolen unlocked       │
│  device must NOT get access to stored tokens.                │
└──────────────────────────────────────────────────────────────┘
```

### Secure Storage Comparison

| Storage | Platform | Encrypted | HW-Backed | Biometric Gate | Use For |
|---------|----------|-----------|-----------|---------------|---------|
| Keychain | iOS | AES-256-GCM | Secure Enclave | ACL | Tokens, creds |
| Keystore + EncryptedSharedPrefs | Android | AES-256-GCM | TEE/StrongBox | Yes | Tokens, creds |
| `expo-secure-store` | RN | Yes | OS-dependent | `requireAuthentication` | Tokens (2KB limit) |
| `flutter_secure_storage` | Flutter | Yes | OS-dependent | Via options | Tokens, secrets |
| AsyncStorage / SharedPrefs / UserDefaults | Any | NO | NO | NO | **NEVER for tokens** |

---

## Phase 4: Social Login Integration

### Social Provider Comparison

| Feature | Google Sign-In | Apple Sign-In | Facebook Login |
|---------|---------------|---------------|---------------|
| Required if others offered | No | **YES** (App Store rule 4.8) | No |
| Returns email | Always | First login only (can hide) | If user grants |
| Returns name | Always | First login only | If user grants |
| Private relay email | No | Yes (user hides real email) | No |
| Token format | JWT id_token | JWT id_token + auth_code | Opaque access token |
| Server verification | Google JWKS | Apple JWKS | Facebook Graph API |
| Nonce required | Recommended | **REQUIRED** | No |

### Social Login Architecture

```
1. App triggers SDK login (native UI)
2. SDK returns id_token + auth_code
3. App sends to YOUR backend: POST /auth/social { provider, id_token, nonce }
4. Backend verifies id_token against provider JWKS/API
5. Backend finds or creates user record
6. Backend returns YOUR access_token + refresh_token

KEY: The app sends social id_token to YOUR backend. Your backend
verifies and issues YOUR tokens. Never call your API with social tokens.
```

### Apple Sign-In Critical Details

- Name + email provided **ONLY on first authorization** — store immediately on backend
- User can "Hide My Email" — you get a relay address, which you CAN email (configure in Apple Developer portal)
- Nonce is **required** for anti-replay — generate random, hash SHA256, verify in returned id_token
- Handle server-to-server events: `consent-revoked`, `account-delete` (GDPR: you MUST honor deletion)
- Call `getCredentialState(forUserID:)` on every app launch — if revoked/notFound, force re-auth

---

## Phase 5: Token Management

### Token Refresh with Race Condition Handling

```
┌──────────────────────────────────────────────────────────────┐
│  PROBLEM: 5 API calls fire, all get 401. Without a queue,   │
│  5 refresh requests fire — 4 fail because the first rotated │
│  the refresh token.                                          │
│                                                              │
│  SOLUTION: Single-gate refresh with request queue            │
│                                                              │
│  let isRefreshing = false                                    │
│  let failedQueue: { resolve, reject }[] = []                 │
│                                                              │
│  on 401 response:                                            │
│    if isRefreshing → push to queue, wait                     │
│    else:                                                     │
│      isRefreshing = true                                     │
│      try:                                                    │
│        tokens = await refresh()                              │
│        failedQueue.forEach(p => p.resolve(tokens))           │
│        retry original request with new token                 │
│      catch:                                                  │
│        failedQueue.forEach(p => p.reject())                  │
│        logout()  // refresh failed, session dead             │
│      finally:                                                │
│        isRefreshing = false; failedQueue = []                │
└──────────────────────────────────────────────────────────────┘
```

### Token Expiry Handling

| Scenario | Detection | Action |
|----------|-----------|--------|
| Access token expires during use | 401 from API | Refresh silently, retry request |
| Expires while app backgrounded | Check `exp` on resume | Proactive refresh before API call |
| Refresh token expires | 401 from `/auth/refresh` | Force full re-login, clear all tokens |
| Stolen token used after rotation | Server detects reuse | Revoke entire family, force re-login all devices |
| Clock skew (device vs server) | Token valid locally but rejected | Add 30s buffer to local expiry checks |

---

## Phase 6: Session Security

### Certificate Pinning

Pin the **public key hash** (SPKI), not the full certificate. Always include a **backup pin** for rotation. Include a **remote kill switch** (feature flag) in case pinning configuration has a bug.

| Platform | Implementation |
|----------|---------------|
| iOS | NSAppTransportSecurity or TrustKit |
| Android | `network_security_config.xml` with `pin-set` |
| RN | react-native-ssl-pinning or TrustKit |
| Flutter | Dio certificate pinning or `SecurityContext` |

### Jailbreak / Root Detection

| Level | Response | Use Case |
|-------|----------|----------|
| Level 1: Log | Log event, continue normally | Analytics, threat intelligence |
| Level 2: Warn | Show warning, allow continue | Most consumer apps |
| Level 3: Restrict | Disable biometrics, require password each time | Financial apps |
| Level 4: Block | Refuse to function | Banking, government (high false-positive risk) |

Start at Level 1-2. Never ship Level 4 without extensive real-device testing.

---

## Phase 7: Logout & Session Invalidation

### Complete Logout Flow

```
┌──────────────────────────────────────────────────────────────┐
│  1. CLIENT-SIDE CLEANUP (immediate, even if offline):        │
│     - Delete access token from memory                        │
│     - Delete refresh token from secure storage               │
│     - Clear cached user profile + query cache                │
│     - Clear biometric-gated keychain entries                 │
│     - Reset navigation to auth stack                         │
│                                                              │
│  2. SERVER-SIDE REVOCATION (best-effort, may fail):          │
│     - POST /auth/logout { refresh_token }                    │
│     - Server blocklists token, invalidates family            │
│     - If multi-device: invalidate all families for user      │
│                                                              │
│  ORDER: Always clean up locally FIRST. If server call fails, │
│  user is still logged out locally.                           │
└──────────────────────────────────────────────────────────────┘
```

### Multi-Device Session Strategies

| Strategy | Behavior | Use Case |
|----------|----------|----------|
| Unlimited | Any number of devices active | Consumer apps |
| Single device | New login logs out all others | Banking, high-security |
| N devices max | Oldest evicted when limit reached | SaaS per-seat licensing |
| Remote logout | User sees active sessions, revokes individually | Google/GitHub pattern |

---

## Phase 8: Multi-Factor Authentication

### MFA Method Comparison

| Method | Security | UX Friction | Offline | Phishing Resistant | Effort |
|--------|----------|-------------|---------|-------------------|--------|
| TOTP | High | Medium | Yes | No | Medium |
| SMS OTP | Low | Low | No | No (SIM swap) | Low |
| Push MFA | High | Very Low | No | Partial (number matching) | High |
| FIDO2/WebAuthn | Very High | Low | Device-dep. | Yes | High |

### TOTP Flow

```
ENROLLMENT:
1. User enables MFA → server generates TOTP secret + otpauth:// URI
2. App shows QR code → user scans with authenticator app
3. User enters 6-digit code to verify → server stores secret
4. Server returns 8-10 backup codes (one-time use) → user saves

LOGIN:
1. Email + password validated → server returns { mfa_required, mfa_token }
2. App shows TOTP input → user enters 6-digit code
3. POST /auth/mfa/verify { mfa_token, code }
4. Server validates (allow +/- 1 time step) → returns access + refresh tokens

The mfa_token is a short-lived single-purpose token proving step 1 passed.
It cannot be used for API calls.
```

### Push MFA with Number Matching

```
1. Login on Device B → server sends push to Device A (trusted)
2. Device A shows: "Approve login? Enter the number: 42"
3. User types 42 on Device B → proves control of both devices
4. Server marks MFA passed → Device B receives tokens
Number matching prevents blind "approve" tapping on phishing attempts.
```

---

## Phase 9: Security Checklist

### Authentication Audit

| # | Check | Severity |
|---|-------|----------|
| 1 | OAuth2 uses PKCE with S256 (not plain) | Critical |
| 2 | No client secrets in app binary | Critical |
| 3 | Auth in system browser, not WebView | Critical |
| 4 | Tokens in Keychain/Keystore only | Critical |
| 5 | Refresh token rotation enabled | Critical |
| 6 | Social id_tokens verified server-side | Critical |
| 7 | No tokens in logs or URL params | Critical |
| 8 | Access token lifetime <= 15 min | High |
| 9 | Refresh token bound to device ID | High |
| 10 | Token reuse triggers family revocation | High |
| 11 | Biometric change invalidates credentials | High |
| 12 | Apple Sign-In offered if any social login exists | High |
| 13 | Apple user info stored on first callback | High |
| 14 | `state` param validated in OAuth2 redirect | High |
| 15 | Logout clears all local tokens and caches | High |
| 16 | Server revokes refresh token on logout | High |
| 17 | Failed login rate limiting (server-side) | High |
| 18 | Concurrent refresh queue prevents races | High |
| 19 | Deep link auth redirects validate returnTo | High |
| 20 | Certificate pinning with backup pins | Medium |
| 21 | Jailbreak/root detection at appropriate level | Medium |
| 22 | MFA for high-security flows | Medium |
| 23 | Token expiry checked on app resume | Medium |
| 24 | All traffic HTTPS, TLS 1.2+ enforced | Critical |
| 25 | ATS enabled (iOS), cleartextTraffic=false (Android) | High |

---

## Tips for Best Results

1. **Start with the token flow diagram, not the login screen.** The login screen is trivial UI. The token lifecycle — acquisition, storage, refresh, rotation, revocation — is where every auth bug lives. Design the token flow first, then build the UI around it.

2. **Test auth on a real device with airplane mode.** Token refresh failures, biometric timeouts, and social SDK crashes behave differently on real hardware versus simulators. Your auth flow must degrade gracefully when the network drops mid-refresh.

3. **Store Apple Sign-In user info on the first callback — you will not get it again.** Apple sends name and email only on initial authorization. If your backend misses it, the user must revoke and re-authorize.

4. **Implement the concurrent refresh queue before you ship.** The race condition where multiple 401s trigger multiple refresh calls happens every time the access token expires while loading multiple endpoints. Build the queue from day one.

5. **Pin certificate public keys, not certificates.** Certificates rotate. Public keys can stay stable. Always include at least two pins — current and next — so rotation does not brick your app.

6. **Treat biometric enrollment changes as a security event.** Use `kSecAccessControlBiometryCurrentSet` (iOS) and `setInvalidatedByBiometricEnrollment(true)` (Android) to force re-authentication when new biometrics are enrolled.

7. **Log every auth event for forensics, but never log tokens.** Log: login attempts, refresh events, logout, MFA challenges, biometric failures, session revocations. Never log: access tokens, refresh tokens, passwords, TOTP codes.

8. **Use feature flags to control certificate pinning.** If your pinning configuration has a bug or your certificate rotates unexpectedly, you need a remote kill switch without shipping an app update.

<!-- MIT License — Copyright (c) 2025 Heaptrace Technology Private Limited -->
