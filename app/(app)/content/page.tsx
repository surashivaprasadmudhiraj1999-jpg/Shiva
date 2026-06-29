"use client";

import * as React from "react";
import { Plus, FileText, CheckCircle2, Circle, ArrowLeft } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input, Label, Select, Textarea } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Modal } from "@/components/ui/modal";
import { Progress } from "@/components/ui/progress";
import { PageHeader, StatusBadge } from "@/components/shared";
import { useStore, useProjectData, canEdit } from "@/lib/store";
import type { ContentBrief, SearchIntent } from "@/lib/types";
import { uid, slugify, formatDate } from "@/lib/utils";

const BRIEF_TYPES: ContentBrief["type"][] = [
  "Blog brief",
  "Service page",
  "Location page",
  "Comparison page",
  "FAQ page",
  "Landing page",
  "Case study",
  "Content refresh",
];

const CHECKLIST_ITEMS = [
  "SEO complete",
  "AEO complete",
  "GEO ready",
  "Meta data complete",
  "Internal links added",
  "Schema prepared",
  "Sources added",
  "Proofread",
  "Ready to publish",
];

export default function ContentPage() {
  const { dispatch, currentProjectId, role, users } = useStore();
  const { briefs } = useProjectData();
  const [open, setOpen] = React.useState(false);
  const [selected, setSelected] = React.useState<string | null>(null);
  const brief = briefs.find((b) => b.id === selected);

  if (brief) return <BriefDetail brief={brief} onBack={() => setSelected(null)} />;

  return (
    <div>
      <PageHeader title="Content Studio" description="Plan and optimise content briefs across SEO, AEO and GEO.">
        {canEdit(role) && (
          <Button onClick={() => setOpen(true)}>
            <Plus className="h-4 w-4" /> New brief
          </Button>
        )}
      </PageHeader>

      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
        {briefs.map((b) => {
          const done = Object.values(b.checklist).filter(Boolean).length;
          const pct = Math.round((done / CHECKLIST_ITEMS.length) * 100);
          return (
            <Card key={b.id} className="cursor-pointer transition-shadow hover:shadow-md" onClick={() => setSelected(b.id)}>
              <CardContent className="p-5">
                <div className="flex items-start justify-between gap-2">
                  <Badge variant="secondary">{b.type}</Badge>
                  <StatusBadge status={b.status} />
                </div>
                <h3 className="mt-2 font-semibold leading-tight">{b.suggestedTitle}</h3>
                <p className="mt-1 text-sm text-muted-foreground">Primary: {b.primaryKeyword}</p>
                <div className="mt-3">
                  <div className="mb-1 flex items-center justify-between text-xs text-muted-foreground">
                    <span>Checklist</span>
                    <span>
                      {done}/{CHECKLIST_ITEMS.length}
                    </span>
                  </div>
                  <Progress value={pct} tone={pct === 100 ? "success" : "primary"} />
                </div>
                <div className="mt-3 flex items-center justify-between text-xs text-muted-foreground">
                  <span>{b.writer}</span>
                  <span>Due {formatDate(b.deadline)}</span>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      <NewBriefModal open={open} onClose={() => setOpen(false)} projectId={currentProjectId} writers={users.map((u) => u.name)} onAdd={(b) => dispatch({ type: "ADD_BRIEF", brief: b })} />
    </div>
  );
}

function BriefDetail({ brief, onBack }: { brief: ContentBrief; onBack: () => void }) {
  const { dispatch, role } = useStore();
  const editable = canEdit(role);

  function toggle(item: string) {
    if (!editable) return;
    dispatch({ type: "UPDATE_BRIEF", id: brief.id, patch: { checklist: { ...brief.checklist, [item]: !brief.checklist[item] } } });
  }

  return (
    <div>
      <button onClick={onBack} className="mb-4 inline-flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground">
        <ArrowLeft className="h-4 w-4" /> Back to briefs
      </button>
      <div className="mb-4 flex flex-wrap items-center gap-2">
        <Badge variant="secondary">{brief.type}</Badge>
        {editable ? (
          <Select
            value={brief.status}
            onChange={(e) => dispatch({ type: "UPDATE_BRIEF", id: brief.id, patch: { status: e.target.value as any } })}
            className="h-8 w-auto"
          >
            {["Planned", "Draft", "Review", "Published"].map((s) => (
              <option key={s}>{s}</option>
            ))}
          </Select>
        ) : (
          <StatusBadge status={brief.status} />
        )}
      </div>
      <h1 className="text-2xl font-semibold tracking-tight">{brief.suggestedTitle}</h1>

      <div className="mt-5 grid gap-5 lg:grid-cols-3">
        <div className="space-y-5 lg:col-span-2">
          <Section title="Targeting">
            <KV k="Primary keyword" v={brief.primaryKeyword} />
            <KV k="Secondary keywords" v={brief.secondaryKeywords.join(", ")} />
            <KV k="Search intent" v={brief.intent} />
            <KV k="Audience" v={brief.audience} />
            <KV k="Funnel stage" v={brief.funnelStage} />
          </Section>

          <Section title="Metadata">
            <KV k="Meta title" v={brief.metaTitle} />
            <KV k="Meta description" v={brief.metaDescription} />
            <KV k="URL slug" v={brief.slug} mono />
            <KV k="H1" v={brief.h1} />
          </Section>

          <Section title="Outline">
            <ul className="space-y-1.5">
              {brief.outline.map((o, i) => (
                <li key={i} className={o.level === 3 ? "ml-5 text-sm text-muted-foreground" : "text-sm font-medium"}>
                  {o.level === 2 ? "H2 · " : "H3 · "}
                  {o.heading}
                </li>
              ))}
            </ul>
          </Section>

          <Section title="Direct answer section (AEO)">
            <p className="text-sm">{brief.directAnswer}</p>
          </Section>

          <Section title="Frequently asked questions">
            <div className="space-y-2">
              {brief.faqs.map((f, i) => (
                <div key={i} className="rounded-lg border border-border p-3">
                  <p className="text-sm font-medium">{f.q}</p>
                  <p className="mt-0.5 text-sm text-muted-foreground">{f.a}</p>
                </div>
              ))}
            </div>
          </Section>

          <div className="grid gap-5 sm:grid-cols-2">
            <Section title="Internal links">
              <List items={brief.internalLinks} />
            </Section>
            <Section title="External sources">
              <List items={brief.externalSources} />
            </Section>
            <Section title="Competitor content gaps">
              <List items={brief.competitorGaps} />
            </Section>
            <Section title="Suggested schema & CTA">
              <p className="text-sm">
                Schema: <Badge variant="info">{brief.schema}</Badge>
              </p>
              <p className="mt-2 text-sm">CTA: {brief.cta}</p>
            </Section>
          </div>
        </div>

        {/* Checklist */}
        <div>
          <Card className="sticky top-4">
            <CardHeader>
              <CardTitle>Optimisation checklist</CardTitle>
              <CardDescription>
                {brief.writer} · due {formatDate(brief.deadline)}
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-1">
              {CHECKLIST_ITEMS.map((item) => {
                const done = brief.checklist[item];
                return (
                  <button
                    key={item}
                    onClick={() => toggle(item)}
                    disabled={!editable}
                    className="flex w-full items-center gap-2 rounded-md px-2 py-2 text-left text-sm hover:bg-accent disabled:cursor-default"
                  >
                    {done ? <CheckCircle2 className="h-4 w-4 text-success" /> : <Circle className="h-4 w-4 text-muted-foreground" />}
                    <span className={done ? "text-muted-foreground line-through" : ""}>{item}</span>
                  </button>
                );
              })}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}

function NewBriefModal({ open, onClose, projectId, writers, onAdd }: { open: boolean; onClose: () => void; projectId: string; writers: string[]; onAdd: (b: ContentBrief) => void }) {
  const [f, setF] = React.useState({
    type: "Blog brief",
    primaryKeyword: "",
    secondaryKeywords: "",
    intent: "Informational",
    audience: "",
    funnelStage: "TOFU",
    suggestedTitle: "",
    writer: writers[0],
    deadline: "",
  });
  const set = (k: keyof typeof f) => (e: any) => setF((s) => ({ ...s, [k]: e.target.value }));

  function submit() {
    if (!f.primaryKeyword || !f.suggestedTitle) return;
    const slug = "/" + slugify(f.suggestedTitle);
    onAdd({
      id: uid("b"),
      projectId,
      type: f.type as ContentBrief["type"],
      primaryKeyword: f.primaryKeyword,
      secondaryKeywords: f.secondaryKeywords.split(",").map((s) => s.trim()).filter(Boolean),
      intent: f.intent as SearchIntent,
      audience: f.audience,
      funnelStage: f.funnelStage as ContentBrief["funnelStage"],
      suggestedTitle: f.suggestedTitle,
      metaTitle: f.suggestedTitle.slice(0, 60),
      metaDescription: `Learn about ${f.primaryKeyword}. ${f.suggestedTitle}.`.slice(0, 158),
      slug,
      h1: f.suggestedTitle,
      outline: [
        { heading: `What you need to know about ${f.primaryKeyword}`, level: 2 },
        { heading: "Key considerations", level: 2 },
        { heading: "Details", level: 3 },
        { heading: "Frequently asked questions", level: 2 },
      ],
      directAnswer: `Add a 40–60 word direct answer about "${f.primaryKeyword}" here, near the top of the page.`,
      faqs: [{ q: `What is ${f.primaryKeyword}?`, a: "Add a concise answer." }],
      internalLinks: [],
      externalSources: [],
      schema: f.type === "FAQ page" ? "FAQPage" : f.type === "Comparison page" ? "FAQPage + Review" : "Article",
      competitorGaps: [],
      cta: "Contact us",
      status: "Planned",
      writer: f.writer,
      deadline: f.deadline || new Date(Date.now() + 14 * 864e5).toISOString(),
      checklist: Object.fromEntries(CHECKLIST_ITEMS.map((i) => [i, false])),
    });
    onClose();
    setF({ ...f, primaryKeyword: "", secondaryKeywords: "", suggestedTitle: "", audience: "" });
  }

  return (
    <Modal open={open} onClose={onClose} title="New content brief" description="Generate a structured brief with SEO/AEO/GEO sections." className="max-w-2xl">
      <div className="grid gap-3 sm:grid-cols-2">
        <Field label="Content type">
          <Select value={f.type} onChange={set("type")}>
            {BRIEF_TYPES.map((t) => (
              <option key={t}>{t}</option>
            ))}
          </Select>
        </Field>
        <Field label="Funnel stage">
          <Select value={f.funnelStage} onChange={set("funnelStage")}>
            {["TOFU", "MOFU", "BOFU"].map((s) => (
              <option key={s}>{s}</option>
            ))}
          </Select>
        </Field>
        <Field label="Suggested title *" className="sm:col-span-2">
          <Input value={f.suggestedTitle} onChange={set("suggestedTitle")} placeholder="Premium Flats Near Financial District, Hyderabad" />
        </Field>
        <Field label="Primary keyword *">
          <Input value={f.primaryKeyword} onChange={set("primaryKeyword")} placeholder="flats near financial district" />
        </Field>
        <Field label="Intent">
          <Select value={f.intent} onChange={set("intent")}>
            {["Informational", "Commercial", "Transactional", "Navigational"].map((i) => (
              <option key={i}>{i}</option>
            ))}
          </Select>
        </Field>
        <Field label="Secondary keywords (comma-sep)" className="sm:col-span-2">
          <Input value={f.secondaryKeywords} onChange={set("secondaryKeywords")} placeholder="2bhk financial district, gated community" />
        </Field>
        <Field label="Target audience" className="sm:col-span-2">
          <Input value={f.audience} onChange={set("audience")} placeholder="IT professionals relocating to West Hyderabad" />
        </Field>
        <Field label="Writer">
          <Select value={f.writer} onChange={set("writer")}>
            {writers.map((w) => (
              <option key={w}>{w}</option>
            ))}
          </Select>
        </Field>
        <Field label="Deadline">
          <Input value={f.deadline} onChange={set("deadline")} type="date" />
        </Field>
      </div>
      <div className="mt-5 flex justify-end gap-2">
        <Button variant="outline" onClick={onClose}>
          Cancel
        </Button>
        <Button onClick={submit} disabled={!f.primaryKeyword || !f.suggestedTitle}>
          Generate brief
        </Button>
      </div>
    </Modal>
  );
}

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-sm uppercase tracking-wide text-muted-foreground">{title}</CardTitle>
      </CardHeader>
      <CardContent>{children}</CardContent>
    </Card>
  );
}

function KV({ k, v, mono }: { k: string; v: string; mono?: boolean }) {
  return (
    <div className="flex flex-col gap-0.5 border-b border-border py-2 last:border-0 sm:flex-row sm:justify-between sm:gap-4">
      <span className="text-sm text-muted-foreground">{k}</span>
      <span className={`text-sm ${mono ? "font-mono" : "font-medium"} sm:text-right`}>{v || "—"}</span>
    </div>
  );
}

function List({ items }: { items: string[] }) {
  if (items.length === 0) return <p className="text-sm text-muted-foreground">None added</p>;
  return (
    <ul className="space-y-1 text-sm">
      {items.map((i) => (
        <li key={i} className="flex items-start gap-2">
          <FileText className="mt-0.5 h-3.5 w-3.5 shrink-0 text-muted-foreground" /> {i}
        </li>
      ))}
    </ul>
  );
}

function Field({ label, children, className }: { label: string; children: React.ReactNode; className?: string }) {
  return (
    <div className={className}>
      <Label className="mb-1 block">{label}</Label>
      {children}
    </div>
  );
}
