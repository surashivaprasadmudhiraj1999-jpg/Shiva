# Supabase integration

SearchOS is **integration-ready**: the demo store (`lib/store.tsx`) mirrors the
Supabase schema in [`supabase/schema.sql`](../../supabase/schema.sql), so swapping
the in-memory demo data for live Supabase data is a drop-in change.

## 1. Install the client

```bash
npm install @supabase/supabase-js @supabase/ssr
```

## 2. Set environment variables

Copy `.env.example` → `.env.local` and fill in:

```
NEXT_PUBLIC_SUPABASE_URL=...
NEXT_PUBLIC_SUPABASE_ANON_KEY=...
SUPABASE_SERVICE_ROLE_KEY=...   # server-only, never exposed to the browser
```

## 3. Wire the clients

`client.ts` and `server.ts` in this folder contain ready-to-uncomment factory
functions. They are intentionally dependency-free until you run the install above
so the demo builds without external packages.

## 4. Apply the schema

```bash
psql "$SUPABASE_DB_URL" -f supabase/schema.sql
```

The schema includes Row Level Security policies scoped by `organization_id` so
each agency only sees its own projects.

## Security rules enforced in this codebase

- The **service role key** is only ever read in server code (API routes / server
  components). It is never imported into a `"use client"` module.
- No API key is rendered in the UI. The Integrations page toggles status only.
- All third-party API calls (Search Console, GA4, DataForSEO, PageSpeed) happen
  in server-side API routes under `app/api/**`.
