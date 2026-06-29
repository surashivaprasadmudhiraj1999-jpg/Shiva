# SearchOS

**An all-in-one productivity workspace for SEO, AEO (Answer Engine Optimization), and GEO (Generative Engine Optimization).**

SearchOS helps digital marketers, SEO teams, agencies, and content strategists manage multiple client websites from one dashboard: identify what needs attention, create optimized content faster, improve technical SEO, prepare pages for AI-driven search, track brand visibility in AI answers, and generate client-ready reports.

> This is a working **MVP**, not a static mockup. Navigation, forms, filters, saved projects, task statuses, scoring logic, CSV import/export, JSON-LD generation, and report exports all function on realistic sample data. Live data sources are modular and integration-ready.

---

## Tech stack

- **Next.js 14** (App Router) + **TypeScript**
- **Tailwind CSS** with shadcn/ui-style components (hand-built, dependency-light)
- **Supabase** for auth, database, and storage (integration-ready; schema included)
- Server-side API routes for all third-party calls — **secrets never reach the browser**
- Dependency-free SVG charts, responsive desktop-first layout, accessible components

## Getting started

```bash
npm install
npm run dev      # http://localhost:3000  → redirects to /dashboard
npm run build    # production build
npm run typecheck
```

The app boots straight into a fully populated **sample real-estate project**
("Skyline Realty — Hyderabad", clearly labelled **Sample Data**). No backend is
required to explore it — state persists to `localStorage`.

## Product sections (left sidebar)

| Section | What it does |
|---|---|
| **Dashboard** | Executive KPIs, priority action queue, AI-style insights (each with data source + timestamp), trend charts |
| **Projects** | Multi-client project management with full setup form (domain, industry, geo, audience, competitors, goals) |
| **SEO Workspace** | Technical audit, keyword research & clustering (CSV import/export, intent, cannibalisation), on-page optimizer, task board |
| **AEO Workspace** | Answer Opportunity Finder, AEO Content Score, Schema Studio (10 JSON-LD types, validation, copy/download) |
| **GEO Workspace** | AI Prompt Library, AI Visibility Review (paste a response → extract mentions/sentiment/gaps), GEO Readiness Score |
| **Content Studio** | Briefs for blogs, service/location/comparison/FAQ pages with a 9-point optimisation checklist |
| **Competitors** | Comparison table + Content Gap Matrix |
| **Reports** | Client-ready report with PDF/print, CSV export, shareable link |
| **Integrations** | GSC, GA4, GBP, DataForSEO, PageSpeed, Slack, Email — server-side, status-only |
| **Settings** | Organization, team & role matrix (Owner / Editor / Viewer), project config, account |

## Roles

Role-based access (switchable from the top-bar user menu in the demo):

- **Owner** — full access
- **Editor** — edit projects, content, and tasks
- **Viewer** — view dashboards and reports only

## Data honesty

Every metric is labelled by origin — **Demo data**, **Connected live source**,
**Manual upload**, or **Last crawl result** — so mock data is never presented as
real. GEO is explicitly framed as *content & entity readiness*, not guaranteed AI
answer ranking.

## Integrations & security

- Copy `.env.example` → `.env.local`. The app runs on labelled demo data until set.
- API keys/secrets are read **only in server code** (`app/api/**`, `lib/supabase/server.ts`).
- `GET /api/integrations/status` reports which integrations are configured by
  returning **booleans only** — never the secret values.
- See [`lib/supabase/README.md`](lib/supabase/README.md) and
  [`supabase/schema.sql`](supabase/schema.sql) for wiring live data + RLS policies.

## Database entities

`organizations · profiles · projects · domains · pages · keywords · keyword_clusters · technical_audits · tasks · content_briefs · schema_drafts · competitors · ai_prompts · ai_visibility_reviews · reports · integrations` — all defined in `supabase/schema.sql` with organization-scoped Row Level Security, mirroring `lib/types.ts`.

## MVP success criteria — all covered

1. Create an account / workspace → `/login`
2. Create a project & add a domain → **Projects**
3. Add keywords manually or via CSV → **SEO › Keyword Research**
4. View a sample SEO dashboard → **Dashboard**
5. Create technical SEO tasks → **SEO › Tasks**
6. Generate a content brief → **Content Studio**
7. Generate & edit JSON-LD schema → **AEO › Schema Studio**
8. Create & review AI prompts manually → **GEO Workspace**
9. Compare competitors → **Competitors**
10. Export a basic report → **Reports**
11. Demo data clearly distinguished from live data → everywhere, via origin badges

---

## Project structure

```
app/
  (app)/            # authenticated shell: sidebar + topbar + all 10 sections
  api/integrations/ # server-side status endpoint (booleans only)
  login/  share/    # auth entry + read-only shared report
components/
  ui/               # button, card, badge, table, tabs, modal, charts, …
  app-shell/        # sidebar, topbar
lib/
  types.ts          # domain model (mirrors the DB schema)
  demo-data.ts      # rich sample data incl. the sample real-estate project
  store.tsx         # React context + localStorage persistence
  scoring.ts        # transparent SEO / AEO / GEO scoring
  schema-generators.ts  # JSON-LD builders + validation
  csv.ts            # CSV parse / export
  supabase/         # integration-ready client/server stubs
supabase/schema.sql # full Postgres schema with RLS
```

_Documentation for the legacy AI-marketing course content lives under [`modules/`](modules/)._
