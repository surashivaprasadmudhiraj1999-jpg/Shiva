"use client";

import * as React from "react";
import { Copy, Download, Check, Lightbulb, AlertTriangle, Plus } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input, Label, Select, Textarea } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { ScoreRing } from "@/components/ui/progress";
import { PageHeader, StatusBadge, Disclaimer } from "@/components/shared";
import { useStore, useProjectData, canEdit } from "@/lib/store";
import { scoreAeo, snippetSuitability } from "@/lib/scoring";
import { SCHEMA_TEMPLATES, buildSchema } from "@/lib/schema-generators";
import type { SchemaDraft } from "@/lib/types";
import { uid } from "@/lib/utils";
import { download } from "@/lib/csv";

export default function AeoPage() {
  return (
    <div>
      <PageHeader title="AEO Workspace" description="Optimise for answer engines: featured snippets, AI Overviews, People Also Ask, and voice queries." />
      <Tabs defaultValue="finder">
        <TabsList>
          <TabsTrigger value="finder">Answer Opportunity Finder</TabsTrigger>
          <TabsTrigger value="score">AEO Content Score</TabsTrigger>
          <TabsTrigger value="schema">Schema Studio</TabsTrigger>
        </TabsList>
        <TabsContent value="finder">
          <AnswerOpportunityFinder />
        </TabsContent>
        <TabsContent value="score">
          <AeoContentScore />
        </TabsContent>
        <TabsContent value="schema">
          <SchemaStudio />
        </TabsContent>
      </Tabs>
    </div>
  );
}

function AnswerOpportunityFinder() {
  const { keywords } = useProjectData();
  const [selected, setSelected] = React.useState(keywords[0]?.keyword ?? "");
  const kw = keywords.find((k) => k.keyword === selected) ?? keywords[0];

  if (!kw) return <p className="text-sm text-muted-foreground">Add keywords in the SEO Workspace first.</p>;

  const isQuestion = /^(how|what|why|when|where|which|who|is|are|can|do|does)/i.test(kw.keyword) || kw.intent === "Informational";
  const suitability = snippetSuitability(kw.intent, isQuestion, kw.volume);
  const topic = kw.keyword;

  const paaQuestions = [
    `What is the average price for ${topic}?`,
    `How do I choose the best option for ${topic}?`,
    `Is ${topic} a good investment in ${kw.location || "this area"}?`,
    `What should I check before deciding on ${topic}?`,
  ];

  const directAnswer = `${capitalize(topic)} typically depends on location, budget and timeline. In ${kw.location || "the target area"}, expect a range of options — compare pricing, amenities and possession dates before deciding. A shortlist of 3–4 verified options is the fastest path to a confident choice.`;

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap items-center gap-2">
        <Label className="text-sm">Keyword / page:</Label>
        <Select value={selected} onChange={(e) => setSelected(e.target.value)} className="max-w-md">
          {keywords.map((k) => (
            <option key={k.id}>{k.keyword}</option>
          ))}
        </Select>
      </div>

      <div className="grid gap-4 lg:grid-cols-3">
        <Card>
          <CardHeader>
            <CardTitle>Opportunity summary</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3 text-sm">
            <Row label="Search intent" value={<Badge variant="secondary">{kw.intent}</Badge>} />
            <Row label="Featured-snippet suitability" value={<StatusBadge status={suitability} />} />
            <Row label="Direct-answer opportunity" value={<Badge variant={isQuestion ? "success" : "warning"}>{isQuestion ? "Strong" : "Moderate"}</Badge>} />
            <Row label="Recommended schema" value={<Badge variant="info">{kw.intent === "Commercial" ? "FAQPage + Product" : "FAQPage + Article"}</Badge>} />
            <Row label="Recommended H-structure" value={<span className="text-right text-muted-foreground">H1 → direct answer → H2 questions → FAQ</span>} />
          </CardContent>
        </Card>

        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle>Suggested answer block</CardTitle>
            <CardDescription>Direct answer (40–60 words) + supporting explanation + FAQ + evidence indicator</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="rounded-lg border border-primary/30 bg-primary/5 p-3">
              <p className="text-xs font-semibold uppercase tracking-wide text-primary">Direct answer</p>
              <p className="mt-1 text-sm">{directAnswer}</p>
              <p className="mt-2 inline-flex items-center gap-1 text-xs text-warning">
                <AlertTriangle className="h-3 w-3" /> Evidence needed: cite a reliable source for pricing/claims.
              </p>
            </div>
            <div>
              <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">People Also Ask-style questions</p>
              <ul className="mt-1.5 space-y-1.5">
                {paaQuestions.map((q) => (
                  <li key={q} className="flex items-start gap-2 text-sm">
                    <Lightbulb className="mt-0.5 h-3.5 w-3.5 shrink-0 text-warning" /> {q}
                  </li>
                ))}
              </ul>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

function AeoContentScore() {
  const { keywords } = useProjectData();
  const [url, setUrl] = React.useState(keywords[0]?.targetUrl ?? "/");
  const seed = url.length;
  const result = scoreAeo({
    questionHeadings: seed % 2 === 0,
    directAnswerTop: !url.includes("gachibowli"),
    conciseAnswerBlocks: seed % 3 !== 0,
    faqCoverage: url.includes("guides") || url.includes("about"),
    structuredData: url.includes("about"),
    citationQuality: seed % 2 === 1,
    entityClarity: !url.includes("villas"),
    readability: true,
    comparisonTables: url.includes("compare"),
    freshContent: !url.includes("best-areas"),
  });
  const urls = Array.from(new Set(keywords.map((k) => k.targetUrl).filter(Boolean)));

  const recs = result.factors.filter((f) => !f.met);

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap items-center gap-2">
        <Label className="text-sm">Page:</Label>
        <Select value={url} onChange={(e) => setUrl(e.target.value)} className="max-w-sm">
          {urls.map((u) => (
            <option key={u}>{u}</option>
          ))}
        </Select>
      </div>
      <div className="grid gap-4 lg:grid-cols-3">
        <Card>
          <CardHeader>
            <CardTitle>AEO content score</CardTitle>
            <CardDescription className="font-mono text-xs">{url}</CardDescription>
          </CardHeader>
          <CardContent className="flex flex-col items-center gap-3">
            <ScoreRing score={result.score} size={120} />
            <Badge variant={result.band === "Strong" ? "success" : result.band === "Needs work" ? "warning" : "danger"}>{result.band}</Badge>
          </CardContent>
        </Card>
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle>Scoring factors</CardTitle>
          </CardHeader>
          <CardContent className="grid gap-2 sm:grid-cols-2">
            {result.factors.map((f) => (
              <div key={f.label} className="flex items-center justify-between gap-2 rounded-lg border border-border p-2.5">
                <span className="text-sm">{f.label}</span>
                <Badge variant={f.met ? "success" : "warning"}>{f.met ? "✓" : "Fix"}</Badge>
              </div>
            ))}
          </CardContent>
        </Card>
      </div>
      {recs.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle>Recommendations</CardTitle>
          </CardHeader>
          <CardContent className="space-y-2">
            {recs.map((r) => (
              <div key={r.label} className="flex items-start gap-2 rounded-lg border border-warning/30 bg-warning/5 p-3 text-sm">
                <Lightbulb className="mt-0.5 h-4 w-4 shrink-0 text-warning" />
                <span>
                  <strong>{r.label}:</strong> {r.hint}
                </span>
              </div>
            ))}
          </CardContent>
        </Card>
      )}
    </div>
  );
}

function SchemaStudio() {
  const { dispatch, currentProjectId, role } = useStore();
  const { schemas } = useProjectData();
  const [type, setType] = React.useState(SCHEMA_TEMPLATES[0].type);
  const [values, setValues] = React.useState<Record<string, string>>({});
  const [copied, setCopied] = React.useState(false);
  const tpl = SCHEMA_TEMPLATES.find((t) => t.type === type)!;
  const { json, warnings, valid } = buildSchema(type, values);

  function save() {
    const draft: SchemaDraft = {
      id: uid("s"),
      projectId: currentProjectId,
      name: `${type} draft`,
      type,
      json,
      valid,
      warnings,
      updatedAt: new Date().toISOString(),
    };
    dispatch({ type: "ADD_SCHEMA", schema: draft });
  }

  return (
    <div className="space-y-4">
      <Disclaimer>Generated JSON-LD is a draft. Validate with Google&apos;s Rich Results Test before publishing. Required fields are flagged below.</Disclaimer>
      <div className="grid gap-4 lg:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Build schema</CardTitle>
            <CardDescription>Generate and edit JSON-LD structured data</CardDescription>
          </CardHeader>
          <CardContent className="space-y-3">
            <div>
              <Label className="mb-1 block">Schema type</Label>
              <Select
                value={type}
                onChange={(e) => {
                  setType(e.target.value);
                  setValues({});
                }}
              >
                {SCHEMA_TEMPLATES.map((t) => (
                  <option key={t.type} value={t.type}>
                    {t.label}
                  </option>
                ))}
              </Select>
            </div>
            {tpl.fields.map((field) => (
              <div key={field.key}>
                <Label className="mb-1 block">
                  {field.label} {field.required && <span className="text-danger">*</span>}
                </Label>
                <Input
                  value={values[field.key] ?? ""}
                  onChange={(e) => setValues((v) => ({ ...v, [field.key]: e.target.value }))}
                  placeholder={field.placeholder}
                />
              </div>
            ))}
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex-row items-center justify-between">
            <div>
              <CardTitle>JSON-LD output</CardTitle>
              <CardDescription>
                {valid ? (
                  <span className="inline-flex items-center gap-1 text-success">
                    <Check className="h-3.5 w-3.5" /> Valid — required fields present
                  </span>
                ) : (
                  <span className="inline-flex items-center gap-1 text-warning">
                    <AlertTriangle className="h-3.5 w-3.5" /> Incomplete
                  </span>
                )}
              </CardDescription>
            </div>
          </CardHeader>
          <CardContent className="space-y-3">
            {warnings.length > 0 && (
              <div className="space-y-1">
                {warnings.map((w) => (
                  <p key={w} className="flex items-center gap-1 text-xs text-warning">
                    <AlertTriangle className="h-3 w-3" /> {w}
                  </p>
                ))}
              </div>
            )}
            <pre className="max-h-[320px] overflow-auto scrollbar-thin rounded-lg bg-foreground p-3 text-xs text-background">{`<script type="application/ld+json">\n${json}\n</script>`}</pre>
            <div className="flex flex-wrap gap-2">
              <Button
                size="sm"
                variant="outline"
                onClick={() => {
                  navigator.clipboard?.writeText(json);
                  setCopied(true);
                  setTimeout(() => setCopied(false), 1500);
                }}
              >
                {copied ? <Check className="h-3.5 w-3.5" /> : <Copy className="h-3.5 w-3.5" />} {copied ? "Copied" : "Copy JSON-LD"}
              </Button>
              <Button size="sm" variant="outline" onClick={() => download(`${type}.json`, json, "application/json")}>
                <Download className="h-3.5 w-3.5" /> Download
              </Button>
              {canEdit(role) && (
                <Button size="sm" onClick={save}>
                  <Plus className="h-3.5 w-3.5" /> Save draft
                </Button>
              )}
            </div>
            <p className="text-xs text-muted-foreground">
              <strong>Implementation notes:</strong> Paste inside the page &lt;head&gt; or before &lt;/body&gt;. One block per schema type. Keep values in sync with on-page content.
            </p>
          </CardContent>
        </Card>
      </div>

      {schemas.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle>Saved schema drafts</CardTitle>
          </CardHeader>
          <CardContent className="space-y-2">
            {schemas.map((s) => (
              <div key={s.id} className="flex items-center justify-between gap-2 rounded-lg border border-border p-3">
                <div>
                  <p className="text-sm font-medium">{s.name}</p>
                  <p className="text-xs text-muted-foreground">{s.type}</p>
                </div>
                <div className="flex items-center gap-2">
                  <Badge variant={s.valid ? "success" : "warning"}>{s.valid ? "Valid" : `${s.warnings.length} warning(s)`}</Badge>
                  <Button size="sm" variant="outline" onClick={() => download(`${s.name}.json`, s.json, "application/json")}>
                    <Download className="h-3.5 w-3.5" />
                  </Button>
                </div>
              </div>
            ))}
          </CardContent>
        </Card>
      )}
    </div>
  );
}

function Row({ label, value }: { label: string; value: React.ReactNode }) {
  return (
    <div className="flex items-center justify-between gap-2">
      <span className="text-muted-foreground">{label}</span>
      <span className="font-medium">{value}</span>
    </div>
  );
}

function capitalize(s: string) {
  return s.charAt(0).toUpperCase() + s.slice(1);
}
