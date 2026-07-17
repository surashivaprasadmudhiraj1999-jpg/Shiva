import { getCurrentWorkspace } from "@/actions/workspace";
import { db } from "@/lib/db";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

export default async function StrategyPage() {
  const workspace = await getCurrentWorkspace();
  const strategy = await db.marketingStrategy.findFirst({
    where: { workspaceId: workspace.id, status: "ACTIVE" },
    orderBy: { createdAt: "desc" },
  });

  if (!strategy) {
    return <p className="text-sm text-neutral-500 dark:text-neutral-400">No active strategy yet.</p>;
  }

  const ninetyDayPlan = strategy.ninetyDayPlan as Record<string, string[]> | null;

  return (
    <div className="flex flex-col gap-6">
      <div>
        <h1 className="text-2xl font-semibold text-neutral-900 dark:text-neutral-100">{strategy.title}</h1>
        <p className="mt-2 text-sm text-neutral-500 dark:text-neutral-400">{strategy.overview}</p>
      </div>

      <div className="flex flex-wrap gap-2">
        {strategy.priorityChannels.map((c, i) => (
          <Badge key={c} tone={i === 0 ? "success" : "neutral"}>{c}</Badge>
        ))}
      </div>

      {ninetyDayPlan && (
        <Card>
          <CardHeader><CardTitle>90-day plan</CardTitle></CardHeader>
          <CardContent className="grid gap-4 sm:grid-cols-3">
            {Object.entries(ninetyDayPlan).map(([month, items]) => (
              <div key={month}>
                <p className="mb-1 text-sm font-medium capitalize text-neutral-900 dark:text-neutral-100">{month}</p>
                <ul className="list-inside list-disc text-sm text-neutral-500 dark:text-neutral-400">
                  {(items ?? []).map((item) => <li key={item}>{item}</li>)}
                </ul>
              </div>
            ))}
          </CardContent>
        </Card>
      )}
    </div>
  );
}
