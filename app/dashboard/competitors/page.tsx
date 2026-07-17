import { getCurrentWorkspace } from "@/actions/workspace";
import { db } from "@/lib/db";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";

export default async function CompetitorsPage() {
  const workspace = await getCurrentWorkspace();
  const competitors = await db.competitor.findMany({ where: { workspaceId: workspace.id }, orderBy: { createdAt: "desc" } });

  return (
    <div className="flex flex-col gap-6">
      <h1 className="text-2xl font-semibold text-neutral-900 dark:text-neutral-100">Competitors</h1>
      {competitors.length === 0 && (
        <p className="text-sm text-neutral-500 dark:text-neutral-400">No competitors analyzed yet.</p>
      )}
      <div className="grid gap-6 sm:grid-cols-2">
        {competitors.map((c) => (
          <Card key={c.id}>
            <CardHeader>
              <CardTitle>{c.name}</CardTitle>
              {c.website && <CardDescription>{c.website}</CardDescription>}
            </CardHeader>
            <CardContent className="flex flex-col gap-3 text-sm text-neutral-700 dark:text-neutral-300">
              <p><span className="font-medium">Positioning:</span> {c.positioning}</p>
              <p><span className="font-medium">Messaging:</span> {c.messaging}</p>
              <div>
                <p className="mb-1 font-medium">Strengths</p>
                <ul className="list-inside list-disc text-neutral-500 dark:text-neutral-400">
                  {c.strengths.map((s) => <li key={s}>{s}</li>)}
                </ul>
              </div>
              <div>
                <p className="mb-1 font-medium">Weaknesses</p>
                <ul className="list-inside list-disc text-neutral-500 dark:text-neutral-400">
                  {c.weaknesses.map((s) => <li key={s}>{s}</li>)}
                </ul>
              </div>
              <div>
                <p className="mb-1 font-medium">Opportunities for you</p>
                <ul className="list-inside list-disc text-emerald-600 dark:text-emerald-400">
                  {c.opportunities.map((s) => <li key={s}>{s}</li>)}
                </ul>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
