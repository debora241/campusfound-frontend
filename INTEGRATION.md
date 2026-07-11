# CampusFound — Frontend ↔ Backend Integration

This frontend's **authentication flow is now wired to the real backend**
(`campusfound-backend`). Everything else (the 10 dashboards, all domain
data — students, fees, exams, diplomas, etc.) still runs on the in-memory
mock data built in earlier phases; only auth talks to a real API so far.

## Running both together

1. Start the backend first (see its own README): migrate, seed, `npm run dev`
   → listening on `http://localhost:4000`.
2. In this frontend project:
   ```bash
   cp .env.example .env
   ```
   (Default `VITE_API_URL=http://localhost:4000/api` — change if your
   backend runs elsewhere.)
3. `npm install && npm run dev` → frontend on `http://localhost:5173`.

The backend's CORS is already configured to allow `http://localhost:5173`
by default (see backend `.env` → `CLIENT_ORIGIN`).

## What's real now

- **Registration** (`/onboarding/role` → "Create Account") calls
  `POST /api/auth/register` with role-specific fields mapped to the
  backend's shape (see `src/lib/authFieldMapping.ts`).
- **Login** calls `POST /api/auth/login`. For School Admin, University
  Admin, Police, and Government, the backend always responds
  `requiresOtp: true` — the frontend then sends the person to the OTP
  screen automatically.
- **OTP verification** calls the real `POST /api/auth/otp/verify` endpoint.
  The code is **not** validated client-side anymore — it's checked against
  what the backend generated (printed to the backend's console, since no
  real SMS gateway is wired up).
- **Forgot password** now has two real steps: request a code
  (`POST /api/auth/forgot-password`), then submit the code + new password
  (`POST /api/auth/reset-password`).
- **Logout** (Account & Security page) calls `POST /api/auth/logout`,
  which revokes the refresh token server-side, then clears local tokens.
- Access and refresh tokens are stored in `localStorage`
  (`src/lib/tokenStorage.ts`) so they survive a page reload — though there
  isn't yet an auto-redirect-to-dashboard-on-reload flow; that's a natural
  next step.

## What's still simulated

- **Biometric enrollment** — no backend endpoint yet; still a local-only
  flag (`enableBiometric` in the Redux slice).
- **First-login profile completion** (emergency contact, department, etc.)
  — captured in Redux for the session but not yet persisted back to the
  backend; there's no `PATCH /api/profile` endpoint yet.
- **Every dashboard's data** (Students, Fees, Exams, Diplomas, SOS alerts,
  Government stats, and so on) — still the original in-memory mock arrays.
  Wiring these to real backend CRUD endpoints is the next integration
  phase, once those endpoints exist on the backend.

## Known rough edge

Real institution lookups (school/university "code") require the code to
already exist in the backend (seeded ones: `LBD-001` for the school,
`UDO-001` for the university). There's no institution search/autocomplete
yet — that's a good candidate for the next backend phase (a
`GET /api/schools?query=` endpoint) paired with a frontend combobox.
