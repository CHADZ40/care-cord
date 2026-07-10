# Care Coordination — Backend

Express + Prisma + PostgreSQL API, structured to match the frontend 1:1:

| Frontend mock (`src/api/mockApi.js`) | Real endpoint |
|---|---|
| `createReminder` | `POST /api/reminders` |
| `fetchActivityLog` | `GET /api/activity` |
| `fetchPendingReminder` | `GET /api/elder/pending-reminder` |
| `processVoiceResponse` | `POST /api/elder/voice-response` |

## Structure

```
src/
  server.js              Entry point — loads .env, starts Express
  app.js                 Express app: CORS, JSON body parsing, routes, error handling
  routes/                One file per resource, just wiring paths to controllers
  controllers/            Request/response handling + validation
  services/
    intent.service.js     Classifies a voice transcript — see below
  middleware/
    asyncHandler.js        Lets controllers `throw` instead of try/catch everywhere
    errorHandler.js         Central error formatting (+ ApiError class)
  lib/
    prisma.js               Shared Prisma client
    demoHousehold.js         Resolves the one demo household (see note below)
prisma/
  schema.prisma            Household → Reminder / ActivityEvent / ElderProfile
  seed.js                   Creates one demo household with starter data
```

This is a **single-household prototype** on purpose — no auth, no multi-tenant
routing. Every table has a `householdId` column so multi-household support is
a matter of adding auth later, not restructuring the schema.

## Setup

**1. Get a Postgres database.** Pick one:
- [Neon](https://neon.tech) — free tier, gives you a ready-to-use connection string on signup
- [Supabase](https://supabase.com) — free tier, under Project Settings → Database → Connection string
- Or run Postgres locally and use `postgres://postgres:postgres@localhost:5432/care_coordination`

**2. Copy the env file and fill it in:**
```bash
cp .env.example .env
```
Open `.env` and set `DATABASE_URL` to whatever you got in step 1.

**3. Install, migrate, seed:**
```bash
npm install
npx prisma migrate dev --name init
npm run db:seed
```

**4. Run it:**
```bash
npm run dev       # http://localhost:4000, auto-restarts on save
```

Check it worked: `curl http://localhost:4000/api/health` → `{"ok":true}`

## What you can change

**`ANTHROPIC_API_KEY`** (optional, in `.env`)
This is the one thing worth calling out. `src/services/intent.service.js` decides
whether the elder's spoken reply means "yes I did it," "not yet," or "I need
help." Without a key, it falls back to simple keyword matching (the same
heuristic the frontend mock used) — good enough to demo, but easy to fool
("no I already took it" would misfire). With a key, it asks Claude to
classify the reply properly.

Get one at **[console.anthropic.com](https://console.anthropic.com) → Settings → API Keys**.
It's a paid API (there's usually a small free credit on a new account) —
for a class project the volume you'll use in testing is pennies. Paste it in
as `ANTHROPIC_API_KEY=sk-ant-...` in `.env`. Nothing else in the code needs
to change; the fallback path disappears automatically once the key is present.

**`DATABASE_URL`** — swap this for any Postgres instance; nothing else changes.

**`CORS_ORIGIN`** — update if you deploy the frontend somewhere other than
`localhost:5173` (e.g. a Vercel URL once you deploy).

**`DEMO_HOUSEHOLD_ID`** — leave blank normally. The API finds-or-creates a
household automatically. Only set this if you seed multiple households and
want to pin the API to a specific one.

## Connecting the frontend

In the frontend project, replace the contents of `src/api/mockApi.js` with real
`fetch` calls to `http://localhost:4000/api/...` — the function names and
return shapes already match, so nothing else in the store or components needs
to change. Example for one function:

```js
export async function fetchActivityLog() {
  const res = await fetch('http://localhost:4000/api/activity')
  if (!res.ok) throw new Error('Could not load activity log.')
  return res.json()
}
```
