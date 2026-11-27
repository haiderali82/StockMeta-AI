# AI Stock Image Metadata Generator

Upload images, pick a platform (Adobe Stock or Shutterstock), and let AI generate SEO-friendly titles, descriptions, keywords, and categories. Review and edit the results, then export a CSV ready for the platform's contributor portal.

Full feature spec: [`claude/spec/dashboard-logic.md`](claude/spec/dashboard-logic.md).
Login/OTP spec: [`claude/spec/login.md`](claude/spec/login.md).

## Auth

Login is two-step: email + password, then a 6-digit OTP emailed to the user, backed by Supabase edge functions and a JWT cookie. See `claude/spec/login.md` for the full flow.

The login/OTP flow is not just a gate to the dashboard page — it gates every `/api/generate` call. On each Generate or Regenerate click, the request's JWT cookie is checked server-side before the server will spend a call against `AI_API_KEY`. An unauthenticated or expired request gets `401` and never reaches the AI provider.

## Image pipeline: no storage

Images and generated metadata never touch a database:

- Uploaded files and thumbnails live only in browser memory.
- Each image is sent one at a time (or a small concurrency of 2-3) to `/api/generate`, which exists only to keep `AI_API_KEY` server-side.
- The route checks auth, forwards the image to the AI, validates the JSON response, and returns it — it saves nothing.
- The metadata table lives in React state; the CSV is built and downloaded in the browser.

Because of this, a page refresh loses any unsaved metadata — there's a "download before leaving" warning on `beforeunload`, and "save and resume sessions" is intentionally not on the roadmap.

## Limits

The 100-images/day figure is the AI provider's own quota on `AI_API_KEY` (shared across all users, not tracked per-user):

- Images are generated sequentially (or in small batches of 2-3), never all in parallel.
- A `429` from the provider stops the queue and shows "Daily limit reached, try again tomorrow." Images already generated are kept so the user can still download a partial CSV.
- Retries (including category re-requests) are capped at 1 per image; after that it falls back to a default category.
- A `localStorage` counter like "42 / 100 used today" can be shown for UX, but it's advisory only — the provider's `429` is the real limit.

## Dev setup

This is a React + Vite app.

```bash
npm install
npm run dev
```

Environment variables (server-side only):

| Variable      | Description                                |
| ------------- | ------------------------------------------- |
| `AI_API_KEY`  | API key for the AI provider                 |
| `JWT_SECRET`  | Signs the auth JWT                          |

Supabase (auth edge functions):

```bash
supabase login
supabase link --project-ref <project-ref>
supabase secrets set JWT_SECRET=...
supabase secrets set ALLOWED_ORIGINS=http://localhost:5173
supabase functions deploy login verify-otp resend-otp logout me
```
