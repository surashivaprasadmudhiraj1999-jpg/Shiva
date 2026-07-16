# AI Marketing Employee

Hire your first AI Marketing Employee. Not a chatbot, not a content
generator — a senior marketing employee that understands your business,
researches your market, studies your competitors, builds a strategy, plans
content, writes every asset, and remembers everything. The user only ever
talks to one AI; internally it delegates to specialized capabilities that are
never exposed in the UI.

This repository contains the **MVP scaffold**: the full data model, the
internal capability/prompt architecture, auth, onboarding, dashboard, and
content generation flows described in `docs/ai-marketing-employee-spec.md`
(the original product brief). The course curriculum that previously lived at
the repo root has moved to `docs/course-curriculum-README.md` and `modules/`.

## Stack

- **Frontend:** Next.js 15 (App Router), React 19, TypeScript, Tailwind CSS 4
- **Auth:** Clerk
- **Database:** PostgreSQL + Prisma ORM (pgvector extension for memory/embeddings)
- **AI:** Anthropic Claude API
- **Payments:** Stripe
- **Background jobs:** Inngest
- **Deployment target:** Vercel

## Project structure

```
app/            Next.js routes (marketing site, auth, onboarding, dashboard)
features/       Feature-scoped client components (onboarding, chat, content, dashboard)
components/ui/  Small hand-rolled UI primitives (button, card, input, ...)
components/layout/ Sidebar / top nav
agents/         One module per internal AI capability (business, research,
                competitors, customer, strategy, planner, content, analytics,
                learning, manager) — the "brain" of the product
prompts/        The system prompt for each capability, as markdown. Never
                hardcoded in TypeScript, never shown to the user.
services/       External integrations: Anthropic client, Prisma client re-export,
                Stripe, Clerk helpers, Inngest client + functions
actions/        Next.js Server Actions that call agents/ and mutate the DB
lib/            Shared server-side utilities (db client, workspace context)
utils/          Pure helper functions (className merging, dates, JSON casts)
types/          Shared TypeScript types for capability inputs/outputs
prisma/schema.prisma  Full data model (see below)
```

## The internal capabilities

The user always talks to one "AI Marketing Employee." Under the hood,
`agents/manager.ts` is the brain: it holds the conversation, decides which
capability a request needs, and delegates to it as an Anthropic tool call.
The other `agents/*.ts` files never generate conversational replies — each
does one job (research, competitor teardown, personas, strategy, planning,
content, analytics, memory) and writes its result straight into the
workspace's permanent memory (Prisma models). This mirrors the product's
non-negotiable rule: **never expose internal agents in the UI.**

## Data model

`prisma/schema.prisma` covers every entity from the product spec: Users,
Organizations, Billing/Usage, Workspace, BusinessProfile, Research,
Competitor, CustomerPersona, MarketingStrategy, ContentCalendar, Content,
Campaign, Task, Knowledge (pgvector-backed memory), Conversation/Message, and
Analytics.

## Getting started

1. Copy `.env.example` to `.env` and fill in real keys (Clerk, Anthropic,
   Postgres, Stripe, Inngest — all optional except `DATABASE_URL`,
   `ANTHROPIC_API_KEY`, and the Clerk keys, which are required for the app to
   run end-to-end).
2. Provision a Postgres database with the `vector` extension available (e.g.
   [Supabase](https://supabase.com) or `CREATE EXTENSION vector;` on your own
   instance).
3. Install dependencies and push the schema:

   ```bash
   npm install
   npm run db:push
   ```

4. Run the dev server:

   ```bash
   npm run dev
   ```

5. Visit `/sign-up`, complete onboarding, and the AI will run its research →
   competitor analysis → customer personas → strategy → content plan
   pipeline automatically.

## What's implemented (v1 / MVP scope)

- Authentication + workspace creation
- Business onboarding that becomes permanent memory
- Market research, competitor intelligence, customer personas, marketing
  strategy, and a 30-day content calendar — all generated automatically
  right after onboarding
- A unified content engine covering every content type in the spec (blog,
  landing page, social posts, ads, email, scripts, etc.)
- A single chat interface where the AI can delegate to any capability
  on request
- A morning dashboard with prioritized tasks
- Markdown export for generated content
- Stripe checkout scaffolding and webhook handling for subscription billing

## What's intentionally deferred (v2+, per the product roadmap)

- Live web research via Exa/Firecrawl/Tavily (research currently relies on
  the model's own knowledge — wire in real search before relying on it for
  time-sensitive facts)
- Publishing integrations, Google Search Console / Analytics, Meta Ads
- Scheduled/automated publishing and email sending
- Full autonomous monitoring loop (v3 in the spec)
- OpenAI-embeddings-backed semantic recall over the `Knowledge` table (the
  `embedding` column exists; nothing writes to it yet)
