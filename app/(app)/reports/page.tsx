"use client";

import * as React from "react";
import { FileDown, Link2, Printer, Plus, Trophy, AlertCircle, ListChecks, Check } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { PageHeader, StatusBadge } from "@/components/shared";
import { useStore, useProjectData, canEdit } from "@/lib/store";
import { demoKpis, demoTrends } from "@/lib/demo-data";
import { toCSV, download } from "@/lib/csv";
import { formatNumber, formatDate, uid } from "@/lib/utils";
import type { Report } from "@/lib/types";

export default function ReportsPage() {
  const { currentProject, dateRange, dispatch, role } = useStore();
  const { reports, tasks, keywords } = useProjectData();
  const [selected, setSelected] = React.useState(reports[0]?.id ?? "");
  const [linkCopied, setLinkCopied] = React.useState(false);
  const report = reports.find((r) => r.id === selected) ?? reports[0];
  const kpis = demoKpis(currentProject.id);

  function exportCSV() {
    const rows = [
      { metric: "Organic clicks", value: kpis.organicClicks.value, change: `${kpis.organicClicks.delta}%` },
      { metric: "Organic impressions", value: kpis.organicImpressions.value, change: `${kpis.organicImpressions.delta}%` },
      { metric: "Average position", value: kpis.avgPosition.value, change: `${kpis.avgPosition.delta}` },
      { metric: "Organic CTR", value: `${kpis.organicCtr.value}%`, change: `${kpis.organicCtr.delta}%` },
      { metric: "AEO readiness", value: kpis.aeoScore.value, change: `${kpis.aeoScore.delta}` },
      { metric: "GEO readiness", value: kpis.geoScore.value, change: `${kpis.geoScore.delta}` },
      { metric: "Technical issues", value: kpis.technicalIssues.value, change: `${kpis.technicalIssues.delta}` },
    ];
    download(`${currentProject.domain}-report.csv`, toCSV(rows), "text/csv");
  }

  function shareLink() {
    const token = btoa(`${currentProject.id}:${report?.id}`).replace(/=/g, "");
    const url = `${window.location.origin}/share/${token}`;
    navigator.clipboard?.writeText(url);
    setLinkCopied(true);
    setTimeout(() => setLinkCopied(false), 2000);
  }

  function generateReport() {
    const completed = tasks.filter((t) => t.status === "Done").length;
    const r: Report = {
      id: uid("rep"),
      projectId: currentProject.id,
      title: `${currentProject.name} — ${dateRange} Report`,
      dateRange,
      executiveSummary: `Across ${dateRange.toLowerCase()}, ${currentProject.name} tracked ${keywords.length} keywords with ${completed} tasks completed. Organic impressions and AEO readiness are trending up; GEO readiness remains the primary growth lever.`,
      keyWins: [`AEO score at ${kpis.aeoScore.value}/100 (+${kpis.aeoScore.delta})`, `${formatNumber(kpis.organicClicks.value)} organic clicks`, `${completed} tasks completed`],
      issuesFound: [`${kpis.technicalIssues.value} open technical issues`, "Brand under-cited in comparison AI answers"],
      actionPlan: ["Ship FAQ schema to high-intent pages", "Publish comparison content", "Fix canonical & orphan-page issues", "Pursue third-party authority mentions"],
      createdAt: new Date().toISOString(),
    };
    dispatch({ type: "ADD_REPORT", report: r });
    setSelected(r.id);
  }

  if (!report) return <p>No reports yet.</p>;

  return (
    <div>
      <PageHeader title="Reports" description="Client-ready performance summaries across SEO, AEO and GEO.">
        {canEdit(role) && (
          <Button variant="outline" onClick={generateReport}>
            <Plus className="h-4 w-4" /> Generate report
          </Button>
        )}
      </PageHeader>

      <div className="mb-4 flex flex-wrap items-center gap-2">
        <select value={selected} onChange={(e) => setSelected(e.target.value)} className="h-9 rounded-md border border-input bg-card px-3 text-sm">
          {reports.map((r) => (
            <option key={r.id} value={r.id}>
              {r.title}
            </option>
          ))}
        </select>
        <div className="ml-auto flex flex-wrap gap-2">
          <Button variant="outline" size="sm" onClick={() => window.print()}>
            <Printer className="h-3.5 w-3.5" /> PDF / Print
          </Button>
          <Button variant="outline" size="sm" onClick={exportCSV}>
            <FileDown className="h-3.5 w-3.5" /> Export CSV
          </Button>
          <Button variant="outline" size="sm" onClick={shareLink}>
            {linkCopied ? <Check className="h-3.5 w-3.5" /> : <Link2 className="h-3.5 w-3.5" />} {linkCopied ? "Link copied" : "Shareable link"}
          </Button>
        </div>
      </div>

      {/* Printable report */}
      <div id="report" className="space-y-5">
        <Card>
          <CardContent className="p-6">
            <div className="flex flex-wrap items-start justify-between gap-4 border-b border-border pb-4">
              <div>
                <p className="text-xs font-semibold uppercase tracking-wide text-primary">{currentProject.brandName}</p>
                <h2 className="mt-1 text-xl font-semibold">{report.title}</h2>
                <p className="text-sm text-muted-foreground">
                  {currentProject.domain} · {report.dateRange}
                </p>
              </div>
              <div className="text-right text-xs text-muted-foreground">
                <p>Prepared by Northstar Digital Agency</p>
                <p>Generated {formatDate(report.createdAt)}</p>
                {currentProject.isSample && <Badge variant="warning" className="mt-1">Sample Data</Badge>}
              </div>
            </div>

            <div className="mt-4">
              <h3 className="text-sm font-semibold uppercase tracking-wide text-muted-foreground">Executive summary</h3>
              <p className="mt-1.5 text-sm">{report.executiveSummary}</p>
            </div>

            <div className="mt-5 grid grid-cols-2 gap-3 sm:grid-cols-4">
              {[
                { l: "Organic clicks", v: formatNumber(kpis.organicClicks.value) },
                { l: "Impressions", v: formatNumber(kpis.organicImpressions.value) },
                { l: "Avg position", v: kpis.avgPosition.value.toFixed(1) },
                { l: "CTR", v: `${kpis.organicCtr.value}%` },
                { l: "AEO readiness", v: `${kpis.aeoScore.value}/100` },
                { l: "GEO readiness", v: `${kpis.geoScore.value}/100` },
                { l: "Technical issues", v: String(kpis.technicalIssues.value) },
                { l: "AI brand mentions", v: String(kpis.brandMentionsAI.value) },
              ].map((m) => (
                <div key={m.l} className="rounded-lg border border-border p-3">
                  <p className="text-xs text-muted-foreground">{m.l}</p>
                  <p className="mt-1 text-lg font-semibold">{m.v}</p>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        <div className="grid gap-5 md:grid-cols-3">
          <ReportList icon={Trophy} tone="text-success" title="Key wins" items={report.keyWins} />
          <ReportList icon={AlertCircle} tone="text-danger" title="Issues found" items={report.issuesFound} />
          <ReportList icon={ListChecks} tone="text-primary" title="Next 30-day action plan" items={report.actionPlan} />
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Keyword growth & content performance</CardTitle>
            <CardDescription>Position movement and content pipeline</CardDescription>
          </CardHeader>
          <CardContent className="grid gap-4 sm:grid-cols-3">
            {demoTrends.keywordMovement.map((m) => (
              <div key={m.label} className="rounded-lg border border-border p-4 text-center">
                <p className="text-2xl font-semibold" style={{ color: m.color }}>
                  {m.value}
                </p>
                <p className="text-sm text-muted-foreground">Keywords {m.label.toLowerCase()}</p>
              </div>
            ))}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Completed tasks & upcoming priorities</CardTitle>
          </CardHeader>
          <CardContent className="space-y-2">
            {tasks.map((t) => (
              <div key={t.id} className="flex items-center justify-between gap-2 border-b border-border py-2 last:border-0">
                <span className="text-sm">{t.title}</span>
                <div className="flex items-center gap-2">
                  <StatusBadge status={t.priority} />
                  <StatusBadge status={t.status} />
                </div>
              </div>
            ))}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

function ReportList({ icon: Icon, tone, title, items }: { icon: any; tone: string; title: string; items: string[] }) {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-sm">
          <Icon className={`h-4 w-4 ${tone}`} /> {title}
        </CardTitle>
      </CardHeader>
      <CardContent>
        <ul className="space-y-2 text-sm">
          {items.map((i) => (
            <li key={i} className="flex items-start gap-2">
              <span className={`mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full ${tone.replace("text-", "bg-")}`} /> {i}
            </li>
          ))}
        </ul>
      </CardContent>
    </Card>
  );
}
