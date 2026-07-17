import { getCurrentWorkspace } from "@/actions/workspace";
import { db } from "@/lib/db";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { formatDate } from "@/utils/date";

export default async function ResearchPage() {
  const workspace = await getCurrentWorkspace();
  const reports = await db.research.findMany({ where: { workspaceId: workspace.id }, orderBy: { createdAt: "desc" } });

  return (
    <div className="flex flex-col gap-6">
      <h1 className="text-2xl font-semibold text-neutral-900 dark:text-neutral-100">Market Research</h1>
      {reports.length === 0 && (
        <p className="text-sm text-neutral-500 dark:text-neutral-400">No research reports yet.</p>
      )}
      {reports.map((r) => {
        const content = r.content as {
          painPoints?: string[]; buyingTriggers?: string[]; faqs?: string[]; trends?: string[]; searchDemand?: string[];
        };
        return (
          <Card key={r.id}>
            <CardHeader>
              <CardTitle>{r.title}</CardTitle>
              <CardDescription>{formatDate(r.createdAt)}</CardDescription>
            </CardHeader>
            <CardContent className="flex flex-col gap-4 text-sm text-neutral-700 dark:text-neutral-300">
              <p>{r.summary}</p>
              <div className="grid gap-4 sm:grid-cols-2">
                {content.painPoints && (
                  <div>
                    <p className="mb-1 font-medium">Pain points</p>
                    <ul className="list-inside list-disc text-neutral-500 dark:text-neutral-400">
                      {content.painPoints.map((p) => <li key={p}>{p}</li>)}
                    </ul>
                  </div>
                )}
                {content.trends && (
                  <div>
                    <p className="mb-1 font-medium">Trends</p>
                    <ul className="list-inside list-disc text-neutral-500 dark:text-neutral-400">
                      {content.trends.map((p) => <li key={p}>{p}</li>)}
                    </ul>
                  </div>
                )}
                {content.searchDemand && (
                  <div>
                    <p className="mb-1 font-medium">Search demand</p>
                    <ul className="list-inside list-disc text-neutral-500 dark:text-neutral-400">
                      {content.searchDemand.map((p) => <li key={p}>{p}</li>)}
                    </ul>
                  </div>
                )}
                {content.buyingTriggers && (
                  <div>
                    <p className="mb-1 font-medium">Buying triggers</p>
                    <ul className="list-inside list-disc text-neutral-500 dark:text-neutral-400">
                      {content.buyingTriggers.map((p) => <li key={p}>{p}</li>)}
                    </ul>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        );
      })}
    </div>
  );
}
