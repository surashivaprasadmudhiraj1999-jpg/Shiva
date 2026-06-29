"use client";

import * as React from "react";
import { Plus, Sparkles, ScanSearch } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input, Label, Select, Textarea } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Table, THead, TBody, TR, TH, TD } from "@/components/ui/table";
import { ScoreRing } from "@/components/ui/progress";
import { Modal } from "@/components/ui/modal";
import { PageHeader, StatusBadge, Disclaimer } from "@/components/shared";
import { useStore, useProjectData, canEdit } from "@/lib/store";
import { scoreGeo } from "@/lib/scoring";
import type { AIPrompt, AIVisibilityReview, TargetEngine, Sentiment, SearchIntent } from "@/lib/types";
import { uid, formatDate } from "@/lib/utils";

const ENGINES: TargetEngine[] = ["ChatGPT", "Gemini", "Perplexity", "Google AI Overviews", "Copilot"];

export default function GeoPage() {
  return (
    <div>
      <PageHeader
        title="GEO Workspace"
        description="Generative Engine Optimization readiness — measure content and entity preparedness for AI answers."
      />
      <div className="mb-4">
        <Disclaimer>
          GEO measures <strong>content and entity preparedness</strong>, not guaranteed ranking inside ChatGPT, Gemini or Perplexity. AI
          visibility data comes from manually pasted responses, clearly labelled as such.
        </Disclaimer>
      </div>
      <Tabs defaultValue="prompts">
        <TabsList>
          <TabsTrigger value="prompts">AI Prompt Library</TabsTrigger>
          <TabsTrigger value="review">AI Visibility Review</TabsTrigger>
          <TabsTrigger value="readiness">GEO Readiness Score</TabsTrigger>
        </TabsList>
        <TabsContent value="prompts">
          <PromptLibrary />
        </TabsContent>
        <TabsContent value="review">
          <VisibilityReview />
        </TabsContent>
        <TabsContent value="readiness">
          <ReadinessScore />
        </TabsContent>
      </Tabs>
    </div>
  );
}

function PromptLibrary() {
  const { dispatch, currentProjectId, role } = useStore();
  const { prompts } = useProjectData();
  const [open, setOpen] = React.useState(false);
  const [engineFilter, setEngineFilter] = React.useState("All");
  const filtered = engineFilter === "All" ? prompts : prompts.filter((p) => p.engine === engineFilter);

  const mentioned = prompts.filter((p) => p.brandMentioned).length;
  const coverage = prompts.length ? Math.round((mentioned / prompts.length) * 100) : 0;

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
        <Stat label="Tracked prompts" value={String(prompts.length)} />
        <Stat label="Brand mentioned" value={`${mentioned}/${prompts.length}`} />
        <Stat label="Mention coverage" value={`${coverage}%`} />
        <Stat label="Engines tracked" value={String(new Set(prompts.map((p) => p.engine)).size)} />
      </div>

      <div className="flex flex-wrap items-center gap-2">
        <Select value={engineFilter} onChange={(e) => setEngineFilter(e.target.value)} className="w-auto">
          <option>All</option>
          {ENGINES.map((e) => (
            <option key={e}>{e}</option>
          ))}
        </Select>
        {canEdit(role) && (
          <Button size="sm" className="ml-auto" onClick={() => setOpen(true)}>
            <Plus className="h-3.5 w-3.5" /> Add prompt
          </Button>
        )}
      </div>

      <Card>
        <CardContent className="p-0">
          <Table>
            <THead>
              <TR>
                <TH>Prompt</TH>
                <TH>Engine</TH>
                <TH>Brand</TH>
                <TH>Position</TH>
                <TH>Competitors</TH>
                <TH>Sentiment</TH>
                <TH>Checked</TH>
              </TR>
            </THead>
            <TBody>
              {filtered.map((p) => (
                <TR key={p.id}>
                  <TD className="max-w-[260px]">
                    <p className="font-medium">{p.text}</p>
                    <p className="text-xs text-muted-foreground">
                      {p.persona} · {p.location}
                    </p>
                  </TD>
                  <TD>
                    <Badge variant="secondary">{p.engine}</Badge>
                  </TD>
                  <TD>
                    <StatusBadge status={p.brandMentioned ? "Mentioned" : "Not mentioned"} />
                  </TD>
                  <TD>{p.mentionPosition ?? "—"}</TD>
                  <TD className="text-xs text-muted-foreground">{p.competitorMentions.join(", ") || "—"}</TD>
                  <TD>
                    <StatusBadge status={p.sentiment} />
                  </TD>
                  <TD className="text-xs text-muted-foreground">{formatDate(p.dateChecked)}</TD>
                </TR>
              ))}
            </TBody>
          </Table>
        </CardContent>
      </Card>

      <AddPromptModal open={open} onClose={() => setOpen(false)} projectId={currentProjectId} onAdd={(p) => dispatch({ type: "ADD_PROMPT", prompt: p })} />
    </div>
  );
}

function AddPromptModal({ open, onClose, projectId, onAdd }: { open: boolean; onClose: () => void; projectId: string; onAdd: (p: AIPrompt) => void }) {
  const [f, setF] = React.useState({
    text: "",
    intent: "Commercial",
    persona: "",
    location: "",
    engine: "ChatGPT",
    brandMentioned: "false",
    competitorMentions: "",
    mentionPosition: "",
    sentiment: "Neutral",
    citedDomains: "",
    notes: "",
  });
  const set = (k: keyof typeof f) => (e: any) => setF((s) => ({ ...s, [k]: e.target.value }));
  function submit() {
    if (!f.text) return;
    onAdd({
      id: uid("p"),
      projectId,
      text: f.text,
      intent: f.intent as SearchIntent,
      persona: f.persona || "General",
      location: f.location || "—",
      engine: f.engine as TargetEngine,
      brandMentioned: f.brandMentioned === "true",
      competitorMentions: f.competitorMentions.split(",").map((s) => s.trim()).filter(Boolean),
      mentionPosition: f.mentionPosition ? Number(f.mentionPosition) : null,
      sentiment: f.sentiment as Sentiment,
      citedDomains: f.citedDomains.split(",").map((s) => s.trim()).filter(Boolean),
      dateChecked: new Date().toISOString(),
      notes: f.notes,
    });
    onClose();
    setF({ ...f, text: "", notes: "", competitorMentions: "", citedDomains: "" });
  }
  return (
    <Modal open={open} onClose={onClose} title="Add AI prompt" description="Track how AI engines answer a query about your brand." className="max-w-2xl">
      <div className="grid gap-3 sm:grid-cols-2">
        <div className="sm:col-span-2">
          <Label className="mb-1 block">Prompt text *</Label>
          <Input value={f.text} onChange={set("text")} placeholder="Best real estate projects in Hyderabad" />
        </div>
        <Field label="Intent">
          <Select value={f.intent} onChange={set("intent")}>
            {["Informational", "Commercial", "Transactional", "Navigational"].map((i) => (
              <option key={i}>{i}</option>
            ))}
          </Select>
        </Field>
        <Field label="Target engine">
          <Select value={f.engine} onChange={set("engine")}>
            {ENGINES.map((e) => (
              <option key={e}>{e}</option>
            ))}
          </Select>
        </Field>
        <Field label="Persona">
          <Input value={f.persona} onChange={set("persona")} placeholder="First-time buyer" />
        </Field>
        <Field label="Location">
          <Input value={f.location} onChange={set("location")} placeholder="Hyderabad" />
        </Field>
        <Field label="Brand mentioned?">
          <Select value={f.brandMentioned} onChange={set("brandMentioned")}>
            <option value="false">Not mentioned</option>
            <option value="true">Mentioned</option>
          </Select>
        </Field>
        <Field label="Mention position">
          <Input value={f.mentionPosition} onChange={set("mentionPosition")} type="number" placeholder="3" />
        </Field>
        <Field label="Sentiment">
          <Select value={f.sentiment} onChange={set("sentiment")}>
            {["Positive", "Neutral", "Negative"].map((s) => (
              <option key={s}>{s}</option>
            ))}
          </Select>
        </Field>
        <Field label="Competitor mentions (comma-sep)">
          <Input value={f.competitorMentions} onChange={set("competitorMentions")} placeholder="My Home, Prestige" />
        </Field>
        <Field label="Cited domains (comma-sep)" className="sm:col-span-2">
          <Input value={f.citedDomains} onChange={set("citedDomains")} placeholder="99acres.com, magicbricks.com" />
        </Field>
        <Field label="Notes / pasted response" className="sm:col-span-2">
          <Textarea value={f.notes} onChange={set("notes")} placeholder="Paste the AI response or notes here…" />
        </Field>
      </div>
      <div className="mt-5 flex justify-end gap-2">
        <Button variant="outline" onClick={onClose}>
          Cancel
        </Button>
        <Button onClick={submit} disabled={!f.text}>
          Add prompt
        </Button>
      </div>
    </Modal>
  );
}

function VisibilityReview() {
  const { dispatch, currentProjectId, currentProject, role } = useStore();
  const { reviews } = useProjectData();
  const [text, setText] = React.useState("");
  const [engine, setEngine] = React.useState<TargetEngine>("ChatGPT");
  const [prompt, setPrompt] = React.useState("");
  const [result, setResult] = React.useState<AIVisibilityReview | null>(null);

  function analyze() {
    if (!text.trim()) return;
    const brand = currentProject.brandName;
    const competitors = currentProject.competitors.map((c) => c.replace(/\.(com|in|io|org).*/, ""));
    const lower = text.toLowerCase();

    // naive extraction
    const brandMentions = brand && lower.includes(brand.toLowerCase().split(" ")[0]) ? [brand] : [];
    const competitorMentions = competitors.filter((c) => lower.includes(c.toLowerCase()));
    const citedWebsites = Array.from(new Set((text.match(/[a-z0-9-]+\.(com|in|io|org|net)/gi) || []).map((s) => s.toLowerCase())));

    // mention order by first index
    const all = [...brandMentions, ...competitorMentions];
    const order = all.sort((a, b) => lower.indexOf(a.toLowerCase()) - lower.indexOf(b.toLowerCase()));

    const sentiment: Sentiment =
      /(best|excellent|recommend|top|leading|trusted)/i.test(text) && brandMentions.length ? "Positive" : brandMentions.length ? "Neutral" : "Negative";

    const review: AIVisibilityReview = {
      id: uid("r"),
      projectId: currentProjectId,
      prompt: prompt || "Manual paste",
      engine,
      rawResponse: text,
      brandMentions,
      competitorMentions,
      mentionOrder: order,
      sentiment,
      citedWebsites,
      missingInfo: brandMentions.length ? ["Pricing/specs may be missing", "Possession or delivery timeline not surfaced"] : ["Brand not mentioned — entity coverage is weak"],
      contentGaps: ["Add a comparison page targeting this query", "Publish an entity-rich About/brand page", "Add FAQ content answering this prompt"],
      authoritySources: ["Pursue third-party citations on industry portals", "Get quoted in a press/editorial piece"],
      comparisonPages: competitorMentions.map((c) => `${brand} vs ${c}`),
      entityPages: [`${brand} — brand entity page`, "Service & location entity pages"],
      createdAt: new Date().toISOString(),
    };
    setResult(review);
    dispatch({ type: "ADD_REVIEW", review });
  }

  return (
    <div className="space-y-4">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <ScanSearch className="h-4 w-4 text-primary" /> Paste an AI response
          </CardTitle>
          <CardDescription>The app extracts brand & competitor mentions, sentiment, citations and content gaps. Data is labelled Manual.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-3">
          <div className="grid gap-3 sm:grid-cols-2">
            <Field label="Prompt used">
              <Input value={prompt} onChange={(e) => setPrompt(e.target.value)} placeholder="Best apartments near Financial District" />
            </Field>
            <Field label="Engine">
              <Select value={engine} onChange={(e) => setEngine(e.target.value as TargetEngine)}>
                {ENGINES.map((en) => (
                  <option key={en}>{en}</option>
                ))}
              </Select>
            </Field>
          </div>
          <Textarea value={text} onChange={(e) => setText(e.target.value)} className="min-h-[120px]" placeholder="Paste the full AI answer here…" />
          <Button onClick={analyze} disabled={!text.trim() || !canEdit(role)}>
            <Sparkles className="h-4 w-4" /> Analyze response
          </Button>
        </CardContent>
      </Card>

      {result && <ReviewResult review={result} />}

      {reviews.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle>Saved reviews</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {reviews.map((r) => (
              <ReviewResult key={r.id} review={r} compact />
            ))}
          </CardContent>
        </Card>
      )}
    </div>
  );
}

function ReviewResult({ review, compact }: { review: AIVisibilityReview; compact?: boolean }) {
  return (
    <Card className={compact ? "border-dashed" : ""}>
      <CardHeader className="flex-row items-center justify-between">
        <div>
          <CardTitle className="text-sm">{review.prompt}</CardTitle>
          <CardDescription>
            {review.engine} · {formatDate(review.createdAt)}
          </CardDescription>
        </div>
        <StatusBadge status={review.sentiment} />
      </CardHeader>
      <CardContent className="grid gap-4 md:grid-cols-2">
        <Extract title="Brand mentions" items={review.brandMentions} empty="Brand not mentioned" tone="success" />
        <Extract title="Competitor mentions" items={review.competitorMentions} empty="None" tone="danger" />
        <Extract title="Mention order" items={review.mentionOrder} empty="—" tone="secondary" ordered />
        <Extract title="Cited websites" items={review.citedWebsites} empty="None detected" tone="info" />
        <Extract title="Missing brand information" items={review.missingInfo} empty="—" tone="warning" />
        <Extract title="Suggested content gaps" items={review.contentGaps} empty="—" tone="warning" />
        <Extract title="Authority sources needed" items={review.authoritySources} empty="—" tone="info" />
        <Extract title="Comparison pages needed" items={review.comparisonPages} empty="—" tone="info" />
        <Extract title="FAQ / entity pages needed" items={review.entityPages} empty="—" tone="info" className="md:col-span-2" />
      </CardContent>
    </Card>
  );
}

function Extract({ title, items, empty, tone, ordered, className }: { title: string; items: string[]; empty: string; tone: any; ordered?: boolean; className?: string }) {
  return (
    <div className={className}>
      <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">{title}</p>
      {items.length === 0 ? (
        <p className="mt-1 text-sm text-muted-foreground">{empty}</p>
      ) : (
        <div className="mt-1.5 flex flex-wrap gap-1.5">
          {items.map((it, i) => (
            <Badge key={it + i} variant={tone}>
              {ordered ? `${i + 1}. ` : ""}
              {it}
            </Badge>
          ))}
        </div>
      )}
    </div>
  );
}

function ReadinessScore() {
  const { reviews, prompts, competitors, schemas, briefs } = useProjectData();
  const hasComparison = briefs.some((b) => b.type === "Comparison page");
  const result = scoreGeo({
    brandEntity: schemas.some((s) => s.type === "Organization"),
    consistentNAP: true,
    strongAboutPage: true,
    serviceLocationPages: briefs.some((b) => b.type === "Location page" || b.type === "Service page"),
    externalMentions: reviews.some((r) => r.citedWebsites.length > 1),
    structuredData: schemas.length > 1,
    comparisonContent: hasComparison,
    faqs: schemas.some((s) => s.type === "FAQPage"),
    expertContent: false,
    freshContent: true,
    citationWorthy: false,
    thirdPartyValidation: prompts.some((p) => p.citedDomains.length > 0),
  });

  return (
    <div className="space-y-4">
      <div className="grid gap-4 lg:grid-cols-3">
        <Card>
          <CardHeader>
            <CardTitle>GEO Readiness Score</CardTitle>
            <CardDescription>Content &amp; entity preparedness — not guaranteed AI ranking</CardDescription>
          </CardHeader>
          <CardContent className="flex flex-col items-center gap-3">
            <ScoreRing score={result.score} size={130} />
            <Badge variant={result.band === "Strong" ? "success" : result.band === "Needs work" ? "warning" : "danger"}>{result.band}</Badge>
          </CardContent>
        </Card>
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle>Readiness factors</CardTitle>
            <CardDescription>Each factor improves how confidently AI engines can describe and cite your brand</CardDescription>
          </CardHeader>
          <CardContent className="grid gap-2 sm:grid-cols-2">
            {result.factors.map((f) => (
              <div key={f.label} className="flex items-start justify-between gap-2 rounded-lg border border-border p-2.5">
                <div>
                  <p className="text-sm font-medium">{f.label}</p>
                  {!f.met && <p className="text-xs text-muted-foreground">{f.hint}</p>}
                </div>
                <Badge variant={f.met ? "success" : "warning"}>{f.met ? "✓" : "Gap"}</Badge>
              </div>
            ))}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

function Stat({ label, value }: { label: string; value: string }) {
  return (
    <Card>
      <CardContent className="p-4">
        <p className="text-xs text-muted-foreground">{label}</p>
        <p className="mt-1 text-2xl font-semibold">{value}</p>
      </CardContent>
    </Card>
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
