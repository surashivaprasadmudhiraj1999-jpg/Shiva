"use client";

import * as React from "react";
import { Plus, Upload, Download, Trash2, RefreshCw, FileSearch } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input, Label, Select, Textarea } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Modal } from "@/components/ui/modal";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Table, THead, TBody, TR, TH, TD } from "@/components/ui/table";
import { Progress, ScoreRing } from "@/components/ui/progress";
import { PageHeader, StatusBadge, EmptyState, Disclaimer } from "@/components/shared";
import { DataSourceBadge } from "@/components/data-source-badge";
import { useStore, useProjectData, canEdit } from "@/lib/store";
import { demoAudit } from "@/lib/demo-data";
import { scoreOnPage } from "@/lib/scoring";
import type { Keyword, Task, SearchIntent, PriorityLevel } from "@/lib/types";
import { parseCSV, toCSV, download } from "@/lib/csv";
import { uid, formatNumber } from "@/lib/utils";

export default function SeoPage() {
  const { currentProject } = useStore();
  return (
    <div>
      <PageHeader title="SEO Workspace" description={`Technical health, keyword strategy and on-page optimisation for ${currentProject.domain}.`} />
      <Tabs defaultValue="audit">
        <TabsList>
          <TabsTrigger value="audit">Technical SEO Audit</TabsTrigger>
          <TabsTrigger value="keywords">Keyword Research & Clustering</TabsTrigger>
          <TabsTrigger value="onpage">On-Page Optimizer</TabsTrigger>
          <TabsTrigger value="tasks">Tasks</TabsTrigger>
        </TabsList>
        <TabsContent value="audit">
          <TechnicalAudit />
        </TabsContent>
        <TabsContent value="keywords">
          <KeywordResearch />
        </TabsContent>
        <TabsContent value="onpage">
          <OnPageOptimizer />
        </TabsContent>
        <TabsContent value="tasks">
          <TasksTab />
        </TabsContent>
      </Tabs>
    </div>
  );
}

/* ───────────────────────── Technical Audit ───────────────────────── */

function TechnicalAudit() {
  const [filter, setFilter] = React.useState<string>("All");
  const counts = {
    Passed: demoAudit.filter((a) => a.status === "Passed").length,
    Warning: demoAudit.filter((a) => a.status === "Warning").length,
    Critical: demoAudit.filter((a) => a.status === "Critical").length,
    "Not checked": demoAudit.filter((a) => a.status === "Not checked").length,
  };
  const rows = filter === "All" ? demoAudit : demoAudit.filter((a) => a.status === filter);

  return (
    <div className="space-y-4">
      <Disclaimer>
        Audit results are labelled <strong>Last crawl result</strong>. Connect Search Console &amp; PageSpeed in Integrations to replace
        crawl estimates with live data. Mock figures are never presented as live data.
      </Disclaimer>

      <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
        {(["Passed", "Warning", "Critical", "Not checked"] as const).map((s) => (
          <Card key={s} className="cursor-pointer" onClick={() => setFilter(filter === s ? "All" : s)}>
            <CardContent className="p-4">
              <StatusBadge status={s} />
              <p className="mt-2 text-2xl font-semibold">{counts[s]}</p>
            </CardContent>
          </Card>
        ))}
      </div>

      <Card>
        <CardHeader className="flex-row items-center justify-between">
          <div>
            <CardTitle>Crawl results</CardTitle>
            <CardDescription>{rows.length} checks{filter !== "All" ? ` · filtered by ${filter}` : ""}</CardDescription>
          </div>
          <div className="flex items-center gap-2">
            {filter !== "All" && (
              <Button variant="ghost" size="sm" onClick={() => setFilter("All")}>
                Clear filter
              </Button>
            )}
            <Button variant="outline" size="sm">
              <RefreshCw className="h-3.5 w-3.5" /> Re-crawl (demo)
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <Table>
            <THead>
              <TR>
                <TH>URL</TH>
                <TH>Metric</TH>
                <TH>Result</TH>
                <TH>Status</TH>
                <TH>Source</TH>
              </TR>
            </THead>
            <TBody>
              {rows.map((a) => (
                <TR key={a.id}>
                  <TD className="font-mono text-xs">{a.url}</TD>
                  <TD className="text-sm font-medium">{a.metric}</TD>
                  <TD className="text-sm text-muted-foreground">{a.value}</TD>
                  <TD>
                    <StatusBadge status={a.status} />
                  </TD>
                  <TD>
                    <DataSourceBadge source={a.source} />
                  </TD>
                </TR>
              ))}
            </TBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}

/* ───────────────────────── Keyword Research ───────────────────────── */

const INTENTS: SearchIntent[] = ["Informational", "Commercial", "Transactional", "Navigational"];

function KeywordResearch() {
  const { dispatch, currentProjectId, role } = useStore();
  const { keywords } = useProjectData();
  const [addOpen, setAddOpen] = React.useState(false);
  const [csvOpen, setCsvOpen] = React.useState(false);
  const [intentFilter, setIntentFilter] = React.useState("All");
  const [clusterFilter, setClusterFilter] = React.useState("All");
  const [search, setSearch] = React.useState("");

  const clusters = Array.from(new Set(keywords.map((k) => k.cluster)));
  const filtered = keywords.filter(
    (k) =>
      (intentFilter === "All" || k.intent === intentFilter) &&
      (clusterFilter === "All" || k.cluster === clusterFilter) &&
      k.keyword.toLowerCase().includes(search.toLowerCase()),
  );

  // cannibalisation: same targetUrl used by 2+ keywords
  const urlCounts = keywords.reduce<Record<string, number>>((acc, k) => {
    acc[k.targetUrl] = (acc[k.targetUrl] || 0) + 1;
    return acc;
  }, {});

  function exportCSV() {
    const csv = toCSV(
      filtered.map((k) => ({
        keyword: k.keyword,
        volume: k.volume,
        difficulty: k.difficulty,
        position: k.position ?? "",
        intent: k.intent,
        cluster: k.cluster,
        priority: k.priority,
        targetUrl: k.targetUrl,
        contentStatus: k.contentStatus,
      })),
    );
    download("keywords.csv", csv, "text/csv");
  }

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap items-center gap-2">
        <Input placeholder="Search keywords…" value={search} onChange={(e) => setSearch(e.target.value)} className="max-w-xs" />
        <Select value={intentFilter} onChange={(e) => setIntentFilter(e.target.value)} className="w-auto">
          <option>All</option>
          {INTENTS.map((i) => (
            <option key={i}>{i}</option>
          ))}
        </Select>
        <Select value={clusterFilter} onChange={(e) => setClusterFilter(e.target.value)} className="w-auto">
          <option>All</option>
          {clusters.map((c) => (
            <option key={c}>{c}</option>
          ))}
        </Select>
        <div className="ml-auto flex gap-2">
          <Button variant="outline" size="sm" onClick={exportCSV}>
            <Download className="h-3.5 w-3.5" /> Export CSV
          </Button>
          {canEdit(role) && (
            <>
              <Button variant="outline" size="sm" onClick={() => setCsvOpen(true)}>
                <Upload className="h-3.5 w-3.5" /> Import CSV
              </Button>
              <Button size="sm" onClick={() => setAddOpen(true)}>
                <Plus className="h-3.5 w-3.5" /> Add keyword
              </Button>
            </>
          )}
        </div>
      </div>

      <Card>
        <CardContent className="p-0">
          <Table>
            <THead>
              <TR>
                <TH>Keyword</TH>
                <TH>Vol.</TH>
                <TH>Diff.</TH>
                <TH>Pos.</TH>
                <TH>Intent</TH>
                <TH>Cluster</TH>
                <TH>Priority</TH>
                <TH>Target URL</TH>
                <TH>Status</TH>
                <TH></TH>
              </TR>
            </THead>
            <TBody>
              {filtered.map((k) => {
                const cannibal = urlCounts[k.targetUrl] > 1 && k.targetUrl !== "";
                return (
                  <TR key={k.id}>
                    <TD className="font-medium">
                      {k.keyword}
                      {cannibal && (
                        <Badge variant="danger" className="ml-2">
                          Cannibalisation
                        </Badge>
                      )}
                    </TD>
                    <TD>{formatNumber(k.volume)}</TD>
                    <TD>
                      <span className="inline-flex items-center gap-1.5">
                        <span className="h-1.5 w-10 overflow-hidden rounded-full bg-secondary">
                          <span
                            className="block h-full rounded-full"
                            style={{ width: `${k.difficulty}%`, background: k.difficulty > 60 ? "hsl(var(--danger))" : k.difficulty > 40 ? "hsl(var(--warning))" : "hsl(var(--success))" }}
                          />
                        </span>
                        {k.difficulty}
                      </span>
                    </TD>
                    <TD>{k.position ?? "—"}</TD>
                    <TD>
                      <Badge variant="secondary">{k.intent}</Badge>
                    </TD>
                    <TD className="text-sm text-muted-foreground">{k.cluster}</TD>
                    <TD>
                      <StatusBadge status={k.priority} />
                    </TD>
                    <TD className="max-w-[160px] truncate font-mono text-xs">{k.targetUrl || "—"}</TD>
                    <TD>
                      {canEdit(role) ? (
                        <select
                          value={k.contentStatus}
                          onChange={(e) => dispatch({ type: "UPDATE_KEYWORD", id: k.id, patch: { contentStatus: e.target.value as any } })}
                          className="h-7 rounded border border-input bg-card px-1.5 text-xs"
                        >
                          {["Planned", "Draft", "Review", "Published"].map((s) => (
                            <option key={s}>{s}</option>
                          ))}
                        </select>
                      ) : (
                        <StatusBadge status={k.contentStatus} />
                      )}
                    </TD>
                    <TD>
                      {canEdit(role) && (
                        <button onClick={() => dispatch({ type: "DELETE_KEYWORD", id: k.id })} className="text-muted-foreground hover:text-danger">
                          <Trash2 className="h-3.5 w-3.5" />
                        </button>
                      )}
                    </TD>
                  </TR>
                );
              })}
            </TBody>
          </Table>
          {filtered.length === 0 && (
            <div className="p-6">
              <EmptyState icon={FileSearch} title="No keywords match" description="Adjust filters or add keywords to get started." />
            </div>
          )}
        </CardContent>
      </Card>

      <AddKeywordModal open={addOpen} onClose={() => setAddOpen(false)} projectId={currentProjectId} onAdd={(k) => dispatch({ type: "ADD_KEYWORDS", keywords: [k] })} />
      <ImportCsvModal open={csvOpen} onClose={() => setCsvOpen(false)} projectId={currentProjectId} onImport={(ks) => dispatch({ type: "ADD_KEYWORDS", keywords: ks })} />
    </div>
  );
}

function AddKeywordModal({ open, onClose, projectId, onAdd }: { open: boolean; onClose: () => void; projectId: string; onAdd: (k: Keyword) => void }) {
  const [f, setF] = React.useState({ keyword: "", volume: "", difficulty: "", position: "", targetUrl: "", intent: "Informational", priority: "Medium", cluster: "", location: "" });
  const set = (k: keyof typeof f) => (e: any) => setF((s) => ({ ...s, [k]: e.target.value }));
  function submit() {
    if (!f.keyword) return;
    onAdd({
      id: uid("k"),
      projectId,
      keyword: f.keyword,
      volume: Number(f.volume) || 0,
      difficulty: Number(f.difficulty) || 0,
      position: f.position ? Number(f.position) : null,
      targetUrl: f.targetUrl,
      intent: f.intent as SearchIntent,
      priority: f.priority as PriorityLevel,
      contentStatus: "Planned",
      cluster: f.cluster || "Uncategorised",
      funnelStage: "MOFU",
      location: f.location,
      tags: [],
      competitorRanking: "—",
      source: "manual",
    });
    onClose();
    setF({ ...f, keyword: "", volume: "", difficulty: "", position: "", targetUrl: "" });
  }
  return (
    <Modal open={open} onClose={onClose} title="Add keyword" description="Manually add a target keyword.">
      <div className="grid gap-3 sm:grid-cols-2">
        <div className="sm:col-span-2">
          <Label className="mb-1 block">Keyword *</Label>
          <Input value={f.keyword} onChange={set("keyword")} placeholder="luxury apartments in hyderabad" />
        </div>
        <div>
          <Label className="mb-1 block">Search volume</Label>
          <Input value={f.volume} onChange={set("volume")} type="number" placeholder="2900" />
        </div>
        <div>
          <Label className="mb-1 block">Difficulty (0-100)</Label>
          <Input value={f.difficulty} onChange={set("difficulty")} type="number" placeholder="48" />
        </div>
        <div>
          <Label className="mb-1 block">Current position</Label>
          <Input value={f.position} onChange={set("position")} type="number" placeholder="6" />
        </div>
        <div>
          <Label className="mb-1 block">Intent</Label>
          <Select value={f.intent} onChange={set("intent")}>
            {INTENTS.map((i) => (
              <option key={i}>{i}</option>
            ))}
          </Select>
        </div>
        <div>
          <Label className="mb-1 block">Priority</Label>
          <Select value={f.priority} onChange={set("priority")}>
            {["High", "Medium", "Low"].map((p) => (
              <option key={p}>{p}</option>
            ))}
          </Select>
        </div>
        <div>
          <Label className="mb-1 block">Cluster</Label>
          <Input value={f.cluster} onChange={set("cluster")} placeholder="Apartments" />
        </div>
        <div className="sm:col-span-2">
          <Label className="mb-1 block">Target URL</Label>
          <Input value={f.targetUrl} onChange={set("targetUrl")} placeholder="/projects/gachibowli" />
        </div>
      </div>
      <div className="mt-5 flex justify-end gap-2">
        <Button variant="outline" onClick={onClose}>
          Cancel
        </Button>
        <Button onClick={submit} disabled={!f.keyword}>
          Add keyword
        </Button>
      </div>
    </Modal>
  );
}

function ImportCsvModal({ open, onClose, projectId, onImport }: { open: boolean; onClose: () => void; projectId: string; onImport: (k: Keyword[]) => void }) {
  const [text, setText] = React.useState("");
  const [preview, setPreview] = React.useState<Record<string, string>[]>([]);

  React.useEffect(() => {
    if (!text.trim()) return setPreview([]);
    try {
      setPreview(parseCSV(text).slice(0, 5));
    } catch {
      setPreview([]);
    }
  }, [text]);

  function importNow() {
    const rows = parseCSV(text);
    const keywords: Keyword[] = rows.map((r): Keyword => ({
      id: uid("k"),
      projectId,
      keyword: r.keyword || r.Keyword || "",
      volume: Number(r.volume || r.Volume || 0),
      difficulty: Number(r.difficulty || r.Difficulty || 0),
      position: r.position ? Number(r.position) : null,
      targetUrl: r.targetUrl || r.url || "",
      intent: (r.intent as SearchIntent) || "Informational",
      priority: (r.priority as PriorityLevel) || "Medium",
      contentStatus: "Planned",
      cluster: r.cluster || "Imported",
      funnelStage: "MOFU",
      location: r.location || "",
      tags: [],
      competitorRanking: r.competitorRanking || "—",
      source: "manual",
    })).filter((k) => k.keyword);
    onImport(keywords);
    onClose();
    setText("");
  }

  return (
    <Modal open={open} onClose={onClose} title="Import keywords from CSV" description="Paste CSV with a header row including 'keyword'." className="max-w-2xl">
      <p className="mb-2 text-xs text-muted-foreground">
        Supported columns: <code className="rounded bg-secondary px-1">keyword, volume, difficulty, position, intent, cluster, priority, targetUrl, location</code>
      </p>
      <Textarea
        value={text}
        onChange={(e) => setText(e.target.value)}
        className="min-h-[140px] font-mono text-xs"
        placeholder={"keyword,volume,difficulty,intent,cluster\n2bhk flats hyderabad,1900,42,Commercial,Apartments"}
      />
      {preview.length > 0 && (
        <div className="mt-3 rounded-lg border border-border p-2">
          <p className="mb-1 text-xs font-medium text-muted-foreground">Preview ({preview.length} of {parseCSV(text).length} rows)</p>
          <Table>
            <THead>
              <TR>
                {Object.keys(preview[0]).map((h) => (
                  <TH key={h}>{h}</TH>
                ))}
              </TR>
            </THead>
            <TBody>
              {preview.map((r, i) => (
                <TR key={i}>
                  {Object.values(r).map((v, j) => (
                    <TD key={j} className="text-xs">
                      {v}
                    </TD>
                  ))}
                </TR>
              ))}
            </TBody>
          </Table>
        </div>
      )}
      <div className="mt-5 flex justify-end gap-2">
        <Button variant="outline" onClick={onClose}>
          Cancel
        </Button>
        <Button onClick={importNow} disabled={parseCSV(text).length === 0}>
          Import {parseCSV(text).length || ""} keywords
        </Button>
      </div>
    </Modal>
  );
}

/* ───────────────────────── On-Page Optimizer ───────────────────────── */

function OnPageOptimizer() {
  const { keywords } = useProjectData();
  const urls = Array.from(new Set(keywords.map((k) => k.targetUrl).filter(Boolean)));
  const [url, setUrl] = React.useState(urls[0] ?? "/");

  // demo signals derived deterministically from URL string
  const seed = url.length;
  const signals = {
    titleTag: seed % 2 === 0,
    metaDescription: !url.includes("gachibowli"),
    h1Relevance: true,
    keywordPlacement: seed % 3 !== 0,
    semanticEntities: seed % 2 === 1,
    contentDepth: !url.includes("villas"),
    internalLinks: !url.includes("villas"),
    schema: url.includes("about") || url.includes("guides"),
    readability: true,
    freshness: !url.includes("best-areas"),
  };
  const result = scoreOnPage(signals);

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap items-center gap-2">
        <Label className="text-sm">Select a URL:</Label>
        <Select value={url} onChange={(e) => setUrl(e.target.value)} className="max-w-sm">
          {urls.map((u) => (
            <option key={u}>{u}</option>
          ))}
          <option value="/">/</option>
        </Select>
        <DataSourceBadge source="crawl" />
      </div>

      <div className="grid gap-4 lg:grid-cols-3">
        <Card>
          <CardHeader>
            <CardTitle>On-page score</CardTitle>
            <CardDescription className="font-mono text-xs">{url}</CardDescription>
          </CardHeader>
          <CardContent className="flex flex-col items-center gap-3">
            <ScoreRing score={result.score} size={120} />
            <Badge variant={result.band === "Strong" ? "success" : result.band === "Needs work" ? "warning" : "danger"}>{result.band}</Badge>
          </CardContent>
        </Card>

        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle>Factors & recommendations</CardTitle>
            <CardDescription>Editable suggestions — nothing is overwritten automatically</CardDescription>
          </CardHeader>
          <CardContent className="space-y-2.5">
            {result.factors.map((fac) => (
              <div key={fac.label} className="flex items-start justify-between gap-3 rounded-lg border border-border p-3">
                <div>
                  <p className="text-sm font-medium">{fac.label}</p>
                  {!fac.met && <p className="mt-0.5 text-xs text-muted-foreground">Recommendation: {fac.hint}</p>}
                </div>
                <Badge variant={fac.met ? "success" : "warning"}>{fac.met ? "Good" : "Improve"}</Badge>
              </div>
            ))}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

/* ───────────────────────── Tasks ───────────────────────── */

function TasksTab() {
  const { dispatch, currentProjectId, role, users } = useStore();
  const { tasks } = useProjectData();
  const [open, setOpen] = React.useState(false);
  const byStatus = (s: Task["status"]) => tasks.filter((t) => t.status === s);

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <p className="text-sm text-muted-foreground">Create and track technical SEO, content and AEO/GEO tasks.</p>
        {canEdit(role) && (
          <Button size="sm" onClick={() => setOpen(true)}>
            <Plus className="h-3.5 w-3.5" /> New task
          </Button>
        )}
      </div>
      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        {(["To do", "In progress", "Blocked", "Done"] as const).map((status) => (
          <div key={status} className="rounded-xl border border-border bg-secondary/30 p-3">
            <div className="mb-2 flex items-center justify-between">
              <StatusBadge status={status} />
              <span className="text-xs text-muted-foreground">{byStatus(status).length}</span>
            </div>
            <div className="space-y-2">
              {byStatus(status).map((t) => (
                <div key={t.id} className="rounded-lg border border-border bg-card p-3">
                  <div className="flex items-center justify-between gap-2">
                    <StatusBadge status={t.priority} />
                    <Badge variant="secondary">{t.category}</Badge>
                  </div>
                  <p className="mt-1.5 text-sm font-medium">{t.title}</p>
                  <p className="mt-1 text-xs text-muted-foreground">{t.impact}</p>
                  <p className="mt-1 text-xs text-muted-foreground">{t.assignee}</p>
                  {canEdit(role) && (
                    <select
                      value={t.status}
                      onChange={(e) => dispatch({ type: "UPDATE_TASK", id: t.id, patch: { status: e.target.value as any } })}
                      className="mt-2 h-7 w-full rounded border border-input bg-card px-1.5 text-xs"
                    >
                      {["To do", "In progress", "Blocked", "Done"].map((s) => (
                        <option key={s}>{s}</option>
                      ))}
                    </select>
                  )}
                </div>
              ))}
              {byStatus(status).length === 0 && <p className="px-1 py-4 text-center text-xs text-muted-foreground">Empty</p>}
            </div>
          </div>
        ))}
      </div>

      <NewTaskModal open={open} onClose={() => setOpen(false)} projectId={currentProjectId} users={users.map((u) => u.name)} onAdd={(t) => dispatch({ type: "ADD_TASK", task: t })} />
    </div>
  );
}

function NewTaskModal({ open, onClose, projectId, users, onAdd }: { open: boolean; onClose: () => void; projectId: string; users: string[]; onAdd: (t: Task) => void }) {
  const [f, setF] = React.useState({ title: "", category: "Technical", priority: "Medium", impact: "", assignee: users[0], dueDate: "" });
  const set = (k: keyof typeof f) => (e: any) => setF((s) => ({ ...s, [k]: e.target.value }));
  function submit() {
    if (!f.title) return;
    onAdd({
      id: uid("t"),
      projectId,
      title: f.title,
      category: f.category as Task["category"],
      priority: f.priority as PriorityLevel,
      impact: f.impact || "—",
      assignee: f.assignee,
      status: "To do",
      dueDate: f.dueDate || new Date(Date.now() + 7 * 864e5).toISOString(),
      source: "manual",
      createdAt: new Date().toISOString(),
    });
    onClose();
    setF({ ...f, title: "", impact: "", dueDate: "" });
  }
  return (
    <Modal open={open} onClose={onClose} title="New task" description="Create a technical SEO, content or optimisation task.">
      <div className="grid gap-3 sm:grid-cols-2">
        <div className="sm:col-span-2">
          <Label className="mb-1 block">Title *</Label>
          <Input value={f.title} onChange={set("title")} placeholder="Add canonical tags to project pages" />
        </div>
        <div>
          <Label className="mb-1 block">Category</Label>
          <Select value={f.category} onChange={set("category")}>
            {["Technical", "SEO", "AEO", "GEO", "Content"].map((c) => (
              <option key={c}>{c}</option>
            ))}
          </Select>
        </div>
        <div>
          <Label className="mb-1 block">Priority</Label>
          <Select value={f.priority} onChange={set("priority")}>
            {["High", "Medium", "Low"].map((p) => (
              <option key={p}>{p}</option>
            ))}
          </Select>
        </div>
        <div>
          <Label className="mb-1 block">Assignee</Label>
          <Select value={f.assignee} onChange={set("assignee")}>
            {users.map((u) => (
              <option key={u}>{u}</option>
            ))}
          </Select>
        </div>
        <div>
          <Label className="mb-1 block">Due date</Label>
          <Input value={f.dueDate} onChange={set("dueDate")} type="date" />
        </div>
        <div className="sm:col-span-2">
          <Label className="mb-1 block">Estimated impact</Label>
          <Input value={f.impact} onChange={set("impact")} placeholder="+12% impressions est." />
        </div>
      </div>
      <div className="mt-5 flex justify-end gap-2">
        <Button variant="outline" onClick={onClose}>
          Cancel
        </Button>
        <Button onClick={submit} disabled={!f.title}>
          Create task
        </Button>
      </div>
    </Modal>
  );
}
