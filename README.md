# AI Stock Image Metadata Generator

Upload images, pick a platform (Adobe Stock or Shutterstock), and let AI generate SEO-friendly titles, descriptions, keywords, and categories. Review and edit the results, then export a CSV ready for the platform's contributor portal.

Full feature spec: [`claude/spec/dashboard-logic.md`](claude/spec/dashboard-logic.md).
Login/OTP spec: [`claude/spec/login.md`](claude/spec/login.md).

## Auth

Login is two-step: email + password, then a 6-digit OTP emailed to the user, backed by Supabase edge functions and a JWT cookie. See `claude/spec/login.md` for the full flow.

The login/OTP flow is not just a gate to the dashboard page — it gates the `generate` Supabase function too. On each Generate or Regenerate click, the request's JWT cookie is checked server-side before the function will spend a call against `GEMINI_API_KEY`. An unauthenticated or expired request gets `401` and never reaches Gemini.

## Image pipeline: no storage

Images and generated metadata never touch a database:

- Uploaded files (PNG/JPEG, drag-drop or Browse Files) and thumbnails live only in browser memory (`src/components/dashboard/UploadZone.jsx`), added to the table as pending rows.
- Clicking **Generate Metadata with AI** sends the pending images one at a time to the `generate` Supabase function (`supabase/functions/generate/index.ts`), which exists only to keep `GEMINI_API_KEY` server-side.
- The function checks auth, sends the image to Gemini (`gemini-3.8-flash`) with a platform-specific prompt — title/description rules, keyword count, the platform's exact category list, and the custom `PRMOPT_IMAGE_GENERATION` instruction — and validates the JSON it gets back (one retry if the category isn't in the allowed list, then falls back to the list's first entry). It saves nothing itself.
- The metadata table lives in React state. If the AI call itself fails (not a `401`/`429`), the row falls back to placeholder metadata and a toast says so, so a real failure is never mistaken for a real result.

Because of this, a page refresh loses any unsaved metadata — "save and resume sessions" is intentionally not on the roadmap.

## Export

Once a row's status is `done`, it can be exported (rows still pending/generating are skipped, so a partial batch can still be downloaded):

- **Download CSV** (`src/lib/csvExport.js`) — Adobe Stock (`Filename, Title, Keywords, Category#, Releases`) or Shutterstock (`Filename, Description, Keywords, Categories, Illustration, Mature Content, Editorial`, UTF-8 BOM + CRLF to match Shutterstock's own sample file), matching `claude/spec/dashboard-logic.md`'s "Platform CSV Formats".
- **Export JSON** — the same finished rows as a JSON array, for non-CSV workflows.

## Limits

The 100-images/day figure is Gemini's own quota on `GEMINI_API_KEY` (shared across all users, not tracked per-user):

- Images are generated sequentially, never all in parallel.
- A `429` from Gemini stops the queue and shows "Daily limit reached, try again tomorrow." Images already generated are kept so the user can still export a partial CSV/JSON.
- The category is retried once if Gemini returns one outside the platform's allowed list, then falls back to a default category.
- A `localStorage` counter like "42 / 100 used today" can be shown for UX, but it's advisory only — Gemini's `429` is the real limit.

## Project structure

```
src/
  pages/DashboardPage.jsx            orchestrates upload -> generate -> review -> export
  components/dashboard/              UploadZone, GenerationBanner, MetadataTable/Row, ExportMenu
  lib/                               generateApi.js, csvExport.js, authApi.js, supabaseClient.js
  data/dashboardData.js              platform config, category lists, placeholder-metadata fallback

supabase/functions/
  generate/                          auth gate -> Gemini vision call -> validated JSON
  login/, verify-otp/, resend-otp/, logout/, me/, haider-admin-login/
  _shared/                           jwt.ts, cookie.ts, cors.ts, rateLimit.ts, otp.ts, categories.ts, supabaseAdmin.ts
supabase/migrations/                 `login_otps`, `auth_rate_limits` tables
```

## Rebuilding this from scratch

Full step-by-step setup (env vars, Supabase secrets, schema, deploy
commands, creating the first user, troubleshooting) lives in two guides —
start there, this README is just the overview:

- [`claude/guide/edge-functions.md`](claude/guide/edge-functions.md) — auth/login/OTP functions.
- [`claude/guide/image-generation.md`](claude/guide/image-generation.md) — the `generate` function, Gemini setup, and CSV/JSON export.

Specs these were built from: [`claude/spec/dashboard-logic.md`](claude/spec/dashboard-logic.md), [`claude/spec/login.md`](claude/spec/login.md).

Quick start once Supabase is already set up:

```bash
npm install
npm run dev
```
