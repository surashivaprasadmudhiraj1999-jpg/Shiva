"use client";

import * as React from "react";
import Link from "next/link";
import { ArrowDownRight, ArrowUpRight, Sparkles, ArrowRight } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { LineChart, BarChart } from "@/components/ui/charts";
import { PageHeader, StatusBadge, Disclaimer } from "@/components/shared";
import { DataSourceBadge } from "@/components/data-source-badge";
import { useStore, useProjectData, canEdit } from "@/lib/store";
import { demoKpis, demoTrends, demoInsights } from "@/lib/demo-data";
import { formatNumber, formatPercent, relativeTime, cn } from "@/lib/utils";

export default function DashboardPage() {
  const { currentProject, role, dispatch } = useStore();
  const { tasks } = useProjectData();
  const kpis = demoKpis(currentProject.id);
  const insights = demoInsights.filter((i) => i.projectId === currentProject.id);

  const kpiCards = [
    { label: "Organic clicks", value: formatNumber(kpis.organicClicks.value), delta: kpis.organicClicks.delta },
    { label: "Organic impressions", value: formatNumber(kpis.organicImpressions.value), delta: kpis.organicImpressions.delta },
    { label: "Average position", value: kpis.avgPosition.value.toFixed(1), delta: kpis.avgPosition.delta, invert: true },
    { label: "Organic CTR", value: formatPercent(kpis.organicCtr.value), delta: kpis.organicCtr.delta },
    { label: "Indexed pages", value: formatNumber(kpis.indexedPages.value), delta: kpis.indexedPages.delta },
    { label: "Technical issues", value: String(kpis.technicalIssues.value), delta: kpis.technicalIssues.delta, invert: true },
    { label: "Content opportunities", value: String(kpis.contentOpportunities.value), delta: kpis.contentOpportunities.delta },
    { label: "AEO readiness", value: String(kpis.aeoScore.value), delta: kpis.aeoScore.delta, suffix: "/100" },
    { label: "GEO visibility", value: String(kpis.geoScore.value), delta: kpis.geoScore.delta, suffix: "/100" },
    { label: "Brand mentions in AI", value: String(kpis.brandMentionsAI.value), delta: kpis.brandMentionsAI.delta },
  ];

  const queue = [...tasks].sort((a, b) => {
    const order = { High: 0, Medium: 1, Low: 2 } as const;
    return order[a.priority] - order[b.priority];
  });

  return (
    <div>
      <PageHeader
        title="Dashboard"
        description={`Executive overview for ${currentProject.name}. Identify what needs attention across SEO, AEO and GEO.`}
      >
        <DataSourceBadge source="demo" updatedAt={demoTrends.months ? new Date().toISOString() : undefined} />
      </PageHeader>

      {currentProject.isSample && (
        <div className="mb-5">
          <Disclaimer>
            <strong>Sample Data:</strong> This is a demonstration real-estate project. All figures are illustrative until you connect
            live sources in <Link href="/integrations" className="underline">Integrations</Link>.
          </Disclaimer>
        </div>
      )}

      {/* KPI cards */}
      <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-5">
        {kpiCards.map((k) => {
          const positive = k.invert ? k.delta < 0 : k.delta > 0;
          return (
            <Card key={k.label}>
              <CardContent className="p-4">
                <p className="text-xs font-medium text-muted-foreground">{k.label}</p>
                <p className="mt-1.5 text-2xl font-semibold tracking-tight">
                  {k.value}
                  {k.suffix && <span className="text-sm font-normal text-muted-foreground">{k.suffix}</span>}
                </p>
                <p className={cn("mt-1 flex items-center gap-0.5 text-xs font-medium", positive ? "text-success" : "text-danger")}>
                  {positive ? <ArrowUpRight className="h-3 w-3" /> : <ArrowDownRight className="h-3 w-3" />}
                  {Math.abs(k.delta)}
                  {k.suffix ? "" : k.label.includes("CTR") || k.label.includes("position") ? "" : "%"} vs prev.
                </p>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* Charts */}
      <div className="mt-5 grid gap-5 lg:grid-cols-3">
        <Card className="lg:col-span-2">
          <CardHeader className="flex-row items-center justify-between">
            <div>
              <CardTitle>Organic clicks & impressions trend</CardTitle>
              <CardDescription>Last 12 months</CardDescription>
            </div>
            <DataSourceBadge source="demo" />
          </CardHeader>
          <CardContent>
            <LineChart data={demoTrends.clicks} labels={demoTrends.months} />
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>Keyword movement</CardTitle>
            <CardDescription>Position changes this period</CardDescription>
          </CardHeader>
          <CardContent>
            <BarChart data={demoTrends.keywordMovement} />
          </CardContent>
        </Card>
      </div>

      <div className="mt-5 grid gap-5 lg:grid-cols-3">
        {/* Priority action queue */}
        <Card className="lg:col-span-2">
          <CardHeader className="flex-row items-center justify-between">
            <div>
              <CardTitle>Priority action queue</CardTitle>
              <CardDescription>What to work on next, ranked by priority</CardDescription>
            </div>
            <Link href="/seo">
              <Button variant="outline" size="sm">
                View all tasks
              </Button>
            </Link>
          </CardHeader>
          <CardContent className="space-y-2">
            {queue.map((t) => (
              <div key={t.id} className="flex flex-col gap-2 rounded-lg border border-border p-3 sm:flex-row sm:items-center sm:justify-between">
                <div className="min-w-0">
                  <div className="flex items-center gap-2">
                    <StatusBadge status={t.priority} />
                    <span className="truncate text-sm font-medium">{t.title}</span>
                  </div>
                  <div className="mt-1 flex flex-wrap items-center gap-x-3 gap-y-0.5 text-xs text-muted-foreground">
                    <span>Impact: {t.impact}</span>
                    <span>· {t.assignee}</span>
                    <span>· due {relativeTime(t.dueDate)}</span>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  {canEdit(role) && (
                    <select
                      value={t.status}
                      onChange={(e) => dispatch({ type: "UPDATE_TASK", id: t.id, patch: { status: e.target.value as any } })}
                      className="h-8 rounded-md border border-input bg-card px-2 text-xs"
                    >
                      {["To do", "In progress", "Blocked", "Done"].map((s) => (
                        <option key={s}>{s}</option>
                      ))}
                    </select>
                  )}
                  {!canEdit(role) && <StatusBadge status={t.status} />}
                  <Link href="/seo">
                    <Button size="sm" variant="ghost">
                      Open task <ArrowRight className="h-3.5 w-3.5" />
                    </Button>
                  </Link>
                </div>
              </div>
            ))}
            {queue.length === 0 && <p className="py-6 text-center text-sm text-muted-foreground">No tasks yet.</p>}
          </CardContent>
        </Card>

        {/* Insights */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Sparkles className="h-4 w-4 text-primary" /> Dashboard insights
            </CardTitle>
            <CardDescription>AI-style observations with sources</CardDescription>
          </CardHeader>
          <CardContent className="space-y-3">
            {insights.map((i) => (
              <div key={i.id} className="rounded-lg border border-border p-3">
                <p className="text-sm">{i.text}</p>
                <p className="mt-2 text-xs text-muted-foreground">
                  Source: {i.source} · Updated {relativeTime(i.updatedAt)}
                </p>
              </div>
            ))}
          </CardContent>
        </Card>
      </div>

      {/* Score progressions */}
      <div className="mt-5 grid gap-5 lg:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>AEO score progression</CardTitle>
            <CardDescription>Answer-engine readiness over 12 months</CardDescription>
          </CardHeader>
          <CardContent>
            <LineChart data={demoTrends.aeoProgression} labels={demoTrends.months} color="hsl(var(--success))" />
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>GEO readiness progression</CardTitle>
            <CardDescription>Generative-engine readiness over 12 months</CardDescription>
          </CardHeader>
          <CardContent>
            <LineChart data={demoTrends.geoProgression} labels={demoTrends.months} color="hsl(38 92% 50%)" />
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
