"use client";

import { Compass } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { StatusBadge } from "@/components/shared";
import { useStore, useProjectData } from "@/lib/store";
import { demoKpis } from "@/lib/demo-data";
import { formatNumber, formatDate } from "@/lib/utils";

export default function SharePage() {
  const { currentProject } = useStore();
  const { reports, tasks } = useProjectData();
  const report = reports[0];
  const kpis = demoKpis(currentProject.id);

  return (
    <div className="min-h-screen bg-background">
      <header className="border-b border-border bg-card">
        <div className="mx-auto flex max-w-4xl items-center justify-between px-4 py-3">
          <div className="flex items-center gap-2">
            <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-primary text-primary-foreground">
              <Compass className="h-4 w-4" />
            </div>
            <span className="font-semibold">SearchOS</span>
          </div>
          <Badge variant="info">Shared report · read-only</Badge>
        </div>
      </header>

      <div className="mx-auto max-w-4xl space-y-5 p-4 sm:p-8">
        {!report ? (
          <p className="text-sm text-muted-foreground">No report available.</p>
        ) : (
          <>
            <Card>
              <CardContent className="p-6">
                <p className="text-xs font-semibold uppercase tracking-wide text-primary">{currentProject.brandName}</p>
                <h1 className="mt-1 text-2xl font-semibold">{report.title}</h1>
                <p className="text-sm text-muted-foreground">
                  {currentProject.domain} · {report.dateRange} · Generated {formatDate(report.createdAt)}
                </p>
                {currentProject.isSample && <Badge variant="warning" className="mt-2">Sample Data</Badge>}
                <p className="mt-4 text-sm">{report.executiveSummary}</p>
                <div className="mt-5 grid grid-cols-2 gap-3 sm:grid-cols-4">
                  {[
                    { l: "Clicks", v: formatNumber(kpis.organicClicks.value) },
                    { l: "Impressions", v: formatNumber(kpis.organicImpressions.value) },
                    { l: "AEO", v: `${kpis.aeoScore.value}/100` },
                    { l: "GEO", v: `${kpis.geoScore.value}/100` },
                  ].map((m) => (
                    <div key={m.l} className="rounded-lg border border-border p-3">
                      <p className="text-xs text-muted-foreground">{m.l}</p>
                      <p className="mt-1 text-lg font-semibold">{m.v}</p>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            <div className="grid gap-4 sm:grid-cols-2">
              <Panel title="Key wins" items={report.keyWins} />
              <Panel title="Issues found" items={report.issuesFound} />
            </div>
            <Panel title="Next 30-day action plan" items={report.actionPlan} />

            <Card>
              <CardHeader>
                <CardTitle>Tasks</CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                {tasks.map((t) => (
                  <div key={t.id} className="flex items-center justify-between border-b border-border py-2 last:border-0">
                    <span className="text-sm">{t.title}</span>
                    <StatusBadge status={t.status} />
                  </div>
                ))}
              </CardContent>
            </Card>
          </>
        )}
        <p className="pb-8 text-center text-xs text-muted-foreground">Powered by SearchOS — SEO · AEO · GEO workspace</p>
      </div>
    </div>
  );
}

function Panel({ title, items }: { title: string; items: string[] }) {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-sm">{title}</CardTitle>
      </CardHeader>
      <CardContent>
        <ul className="space-y-2 text-sm">
          {items.map((i) => (
            <li key={i} className="flex items-start gap-2">
              <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-primary" /> {i}
            </li>
          ))}
        </ul>
      </CardContent>
    </Card>
  );
}
