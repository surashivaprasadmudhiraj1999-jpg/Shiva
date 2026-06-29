-- ─────────────────────────────────────────────────────────────
-- SearchOS database schema (Supabase / PostgreSQL)
-- Mirrors lib/types.ts. Apply with:  psql "$SUPABASE_DB_URL" -f supabase/schema.sql
-- ─────────────────────────────────────────────────────────────

create extension if not exists "pgcrypto";

-- Organizations ------------------------------------------------
create table if not exists organizations (
  id          uuid primary key default gen_random_uuid(),
  name        text not null,
  plan        text not null default 'Free' check (plan in ('Free','Pro','Agency')),
  created_at  timestamptz not null default now()
);

-- Users (profiles, linked to auth.users) -----------------------
create table if not exists profiles (
  id              uuid primary key references auth.users (id) on delete cascade,
  organization_id uuid references organizations (id) on delete cascade,
  name            text,
  email           text,
  role            text not null default 'Viewer' check (role in ('Owner','Editor','Viewer')),
  avatar_color    text default '#2563eb',
  created_at      timestamptz not null default now()
);

-- Projects -----------------------------------------------------
create table if not exists projects (
  id                uuid primary key default gen_random_uuid(),
  organization_id   uuid not null references organizations (id) on delete cascade,
  name              text not null,
  domain            text not null,
  industry          text,
  target_country    text,
  target_city       text,
  language          text,
  audience          text,
  competitors       text[] default '{}',
  brand_name        text,
  products_services text,
  goals             text[] default '{}',
  is_sample         boolean not null default false,
  created_at        timestamptz not null default now()
);

-- Domains ------------------------------------------------------
create table if not exists domains (
  id          uuid primary key default gen_random_uuid(),
  project_id  uuid not null references projects (id) on delete cascade,
  domain      text not null,
  verified    boolean default false,
  created_at  timestamptz not null default now()
);

-- Pages --------------------------------------------------------
create table if not exists pages (
  id          uuid primary key default gen_random_uuid(),
  project_id  uuid not null references projects (id) on delete cascade,
  url         text not null,
  title       text,
  depth       int,
  indexable   boolean,
  created_at  timestamptz not null default now()
);

-- Keyword clusters ---------------------------------------------
create table if not exists keyword_clusters (
  id          uuid primary key default gen_random_uuid(),
  project_id  uuid not null references projects (id) on delete cascade,
  name        text not null
);

-- Keywords -----------------------------------------------------
create table if not exists keywords (
  id                  uuid primary key default gen_random_uuid(),
  project_id          uuid not null references projects (id) on delete cascade,
  cluster_id          uuid references keyword_clusters (id) on delete set null,
  keyword             text not null,
  volume              int default 0,
  difficulty          int default 0,
  position            int,
  target_url          text,
  intent              text check (intent in ('Informational','Commercial','Transactional','Navigational')),
  priority            text check (priority in ('High','Medium','Low')),
  content_status      text default 'Planned',
  funnel_stage        text,
  location            text,
  tags                text[] default '{}',
  competitor_ranking  text,
  source              text default 'manual',
  created_at          timestamptz not null default now()
);

-- Technical audits ---------------------------------------------
create table if not exists technical_audits (
  id          uuid primary key default gen_random_uuid(),
  project_id  uuid not null references projects (id) on delete cascade,
  url         text not null,
  metric      text not null,
  value       text,
  status      text check (status in ('Passed','Warning','Critical','Not checked')),
  source      text default 'crawl',
  crawled_at  timestamptz not null default now()
);

-- Tasks --------------------------------------------------------
create table if not exists tasks (
  id          uuid primary key default gen_random_uuid(),
  project_id  uuid not null references projects (id) on delete cascade,
  title       text not null,
  category    text,
  priority    text check (priority in ('High','Medium','Low')),
  impact      text,
  assignee    text,
  status      text default 'To do' check (status in ('To do','In progress','Blocked','Done')),
  due_date    date,
  source      text default 'manual',
  created_at  timestamptz not null default now()
);

-- Content briefs -----------------------------------------------
create table if not exists content_briefs (
  id                uuid primary key default gen_random_uuid(),
  project_id        uuid not null references projects (id) on delete cascade,
  type              text,
  primary_keyword   text,
  secondary_keywords text[] default '{}',
  intent            text,
  audience          text,
  funnel_stage      text,
  suggested_title   text,
  meta_title        text,
  meta_description  text,
  slug              text,
  h1                text,
  outline           jsonb default '[]',
  direct_answer     text,
  faqs              jsonb default '[]',
  internal_links    text[] default '{}',
  external_sources  text[] default '{}',
  schema            text,
  competitor_gaps   text[] default '{}',
  cta               text,
  status            text default 'Planned',
  writer            text,
  deadline          date,
  checklist         jsonb default '{}',
  created_at        timestamptz not null default now()
);

-- Schema drafts ------------------------------------------------
create table if not exists schema_drafts (
  id          uuid primary key default gen_random_uuid(),
  project_id  uuid not null references projects (id) on delete cascade,
  name        text,
  type        text,
  json        text,
  valid       boolean default false,
  warnings    text[] default '{}',
  updated_at  timestamptz not null default now()
);

-- Competitors --------------------------------------------------
create table if not exists competitors (
  id                  uuid primary key default gen_random_uuid(),
  project_id          uuid not null references projects (id) on delete cascade,
  name                text not null,
  domain              text,
  organic_visibility  int default 0,
  ranking_keywords    int default 0,
  top_pages           int default 0,
  schema_usage        text[] default '{}',
  faq_coverage        int default 0,
  ai_mentions         int default 0,
  cited_domains       text[] default '{}',
  notes               text
);

-- AI prompts ---------------------------------------------------
create table if not exists ai_prompts (
  id                  uuid primary key default gen_random_uuid(),
  project_id          uuid not null references projects (id) on delete cascade,
  text                text not null,
  intent              text,
  persona             text,
  location            text,
  engine              text,
  brand_mentioned     boolean default false,
  competitor_mentions text[] default '{}',
  mention_position    int,
  sentiment           text,
  cited_domains       text[] default '{}',
  date_checked        timestamptz default now(),
  notes               text,
  screenshot_url      text
);

-- AI visibility reviews ----------------------------------------
create table if not exists ai_visibility_reviews (
  id                  uuid primary key default gen_random_uuid(),
  project_id          uuid not null references projects (id) on delete cascade,
  prompt              text,
  engine              text,
  raw_response        text,
  brand_mentions      text[] default '{}',
  competitor_mentions text[] default '{}',
  mention_order       text[] default '{}',
  sentiment           text,
  cited_websites      text[] default '{}',
  missing_info        text[] default '{}',
  content_gaps        text[] default '{}',
  authority_sources   text[] default '{}',
  comparison_pages    text[] default '{}',
  entity_pages        text[] default '{}',
  created_at          timestamptz not null default now()
);

-- Reports ------------------------------------------------------
create table if not exists reports (
  id                uuid primary key default gen_random_uuid(),
  project_id        uuid not null references projects (id) on delete cascade,
  title             text,
  date_range        text,
  executive_summary text,
  key_wins          text[] default '{}',
  issues_found      text[] default '{}',
  action_plan       text[] default '{}',
  share_token       text unique,
  created_at        timestamptz not null default now()
);

-- Integrations -------------------------------------------------
-- NOTE: store only status + metadata here. Secrets live in env vars / a
-- secured secrets manager, never in this table or the client.
create table if not exists integrations (
  id          uuid primary key default gen_random_uuid(),
  project_id  uuid not null references projects (id) on delete cascade,
  name        text not null,
  category    text,
  status      text default 'Not connected' check (status in ('Connected','Not connected','Error')),
  last_sync   timestamptz,
  created_at  timestamptz not null default now()
);

-- ─────────────────────────────────────────────────────────────
-- Row Level Security: scope everything to the user's organization.
-- ─────────────────────────────────────────────────────────────
alter table organizations          enable row level security;
alter table profiles               enable row level security;
alter table projects               enable row level security;
alter table domains                enable row level security;
alter table pages                  enable row level security;
alter table keyword_clusters       enable row level security;
alter table keywords               enable row level security;
alter table technical_audits       enable row level security;
alter table tasks                  enable row level security;
alter table content_briefs         enable row level security;
alter table schema_drafts          enable row level security;
alter table competitors            enable row level security;
alter table ai_prompts             enable row level security;
alter table ai_visibility_reviews  enable row level security;
alter table reports                enable row level security;
alter table integrations           enable row level security;

-- Helper: the caller's organization id.
create or replace function current_org_id() returns uuid
language sql stable as $$
  select organization_id from profiles where id = auth.uid()
$$;

-- Project-scoped tables: allow access when the project belongs to the org.
do $$
declare t text;
begin
  foreach t in array array[
    'projects','domains','pages','keyword_clusters','keywords','technical_audits',
    'tasks','content_briefs','schema_drafts','competitors','ai_prompts',
    'ai_visibility_reviews','reports','integrations'
  ]
  loop
    execute format('drop policy if exists org_access on %I;', t);
    if t = 'projects' then
      execute format($f$
        create policy org_access on %I using (organization_id = current_org_id())
        with check (organization_id = current_org_id());
      $f$, t);
    else
      execute format($f$
        create policy org_access on %I using (
          project_id in (select id from projects where organization_id = current_org_id())
        ) with check (
          project_id in (select id from projects where organization_id = current_org_id())
        );
      $f$, t);
    end if;
  end loop;
end $$;

-- Profiles / organizations: users see their own org.
drop policy if exists self_profile on profiles;
create policy self_profile on profiles using (organization_id = current_org_id() or id = auth.uid());

drop policy if exists own_org on organizations;
create policy own_org on organizations using (id = current_org_id());
