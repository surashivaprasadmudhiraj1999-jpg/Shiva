import { getCurrentWorkspace } from "@/actions/workspace";
import { db } from "@/lib/db";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";

export default async function PersonasPage() {
  const workspace = await getCurrentWorkspace();
  const personas = await db.customerPersona.findMany({ where: { workspaceId: workspace.id }, orderBy: { createdAt: "desc" } });

  return (
    <div className="flex flex-col gap-6">
      <h1 className="text-2xl font-semibold text-neutral-900 dark:text-neutral-100">Ideal Customers</h1>
      {personas.length === 0 && (
        <p className="text-sm text-neutral-500 dark:text-neutral-400">No customer personas yet.</p>
      )}
      <div className="grid gap-6 sm:grid-cols-2">
        {personas.map((p) => (
          <Card key={p.id}>
            <CardHeader><CardTitle>{p.name}</CardTitle></CardHeader>
            <CardContent className="flex flex-col gap-3 text-sm text-neutral-700 dark:text-neutral-300">
              <div>
                <p className="mb-1 font-medium">Goals</p>
                <ul className="list-inside list-disc text-neutral-500 dark:text-neutral-400">
                  {p.goals.map((g) => <li key={g}>{g}</li>)}
                </ul>
              </div>
              <div>
                <p className="mb-1 font-medium">Pain points</p>
                <ul className="list-inside list-disc text-neutral-500 dark:text-neutral-400">
                  {p.painPoints.map((g) => <li key={g}>{g}</li>)}
                </ul>
              </div>
              <div>
                <p className="mb-1 font-medium">Dream outcomes</p>
                <ul className="list-inside list-disc text-neutral-500 dark:text-neutral-400">
                  {p.dreamOutcomes.map((g) => <li key={g}>{g}</li>)}
                </ul>
              </div>
              <div>
                <p className="mb-1 font-medium">Favorite platforms</p>
                <p className="text-neutral-500 dark:text-neutral-400">{p.favoritePlatforms.join(", ") || "—"}</p>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
