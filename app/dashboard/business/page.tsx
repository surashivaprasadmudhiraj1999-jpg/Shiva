import { getCurrentWorkspace } from "@/actions/workspace";
import { db } from "@/lib/db";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";

export default async function BusinessPage() {
  const workspace = await getCurrentWorkspace();
  const profile = await db.businessProfile.findUnique({ where: { workspaceId: workspace.id } });

  if (!profile) {
    return <p className="text-sm text-neutral-500 dark:text-neutral-400">No business profile yet.</p>;
  }

  const products = (profile.products as { name: string; description: string; price: string | null }[] | null) ?? [];
  const services = (profile.services as { name: string; description: string; price: string | null }[] | null) ?? [];

  return (
    <div className="flex flex-col gap-6">
      <h1 className="text-2xl font-semibold text-neutral-900 dark:text-neutral-100">{profile.businessName}</h1>

      <div className="grid gap-6 sm:grid-cols-2">
        <Card>
          <CardHeader><CardTitle>Overview</CardTitle></CardHeader>
          <CardContent className="flex flex-col gap-2 text-sm text-neutral-700 dark:text-neutral-300">
            <p><span className="font-medium">Industry:</span> {profile.industry ?? "—"}</p>
            <p><span className="font-medium">Location:</span> {profile.location ?? "—"}</p>
            <p><span className="font-medium">Website:</span> {profile.website ?? "—"}</p>
            <p><span className="font-medium">Brand tone:</span> {profile.brandTone ?? "—"}</p>
            <p><span className="font-medium">Target audience:</span> {profile.targetAudience ?? "—"}</p>
            <p><span className="font-medium">USP:</span> {profile.usp ?? "—"}</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader><CardTitle>Goals & budget</CardTitle></CardHeader>
          <CardContent className="flex flex-col gap-2 text-sm text-neutral-700 dark:text-neutral-300">
            <p><span className="font-medium">Monthly budget:</span> {profile.monthlyBudget ? `$${profile.monthlyBudget}` : "—"}</p>
            <p><span className="font-medium">Channels:</span> {profile.preferredChannels.join(", ") || "—"}</p>
            <ul className="list-inside list-disc">
              {profile.goals.map((g) => <li key={g}>{g}</li>)}
            </ul>
          </CardContent>
        </Card>

        {products.length > 0 && (
          <Card>
            <CardHeader><CardTitle>Products</CardTitle></CardHeader>
            <CardContent className="flex flex-col gap-3 text-sm text-neutral-700 dark:text-neutral-300">
              {products.map((p) => (
                <div key={p.name}>
                  <p className="font-medium">{p.name} {p.price && <span className="text-neutral-400">· {p.price}</span>}</p>
                  <p className="text-neutral-500 dark:text-neutral-400">{p.description}</p>
                </div>
              ))}
            </CardContent>
          </Card>
        )}

        {services.length > 0 && (
          <Card>
            <CardHeader><CardTitle>Services</CardTitle></CardHeader>
            <CardContent className="flex flex-col gap-3 text-sm text-neutral-700 dark:text-neutral-300">
              {services.map((s) => (
                <div key={s.name}>
                  <p className="font-medium">{s.name} {s.price && <span className="text-neutral-400">· {s.price}</span>}</p>
                  <p className="text-neutral-500 dark:text-neutral-400">{s.description}</p>
                </div>
              ))}
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}
