import { getCurrentWorkspace } from "@/actions/workspace";
import { db } from "@/lib/db";
import { ContentGenerator } from "@/features/content/ContentGenerator";
import { ContentList } from "@/features/content/ContentList";

export default async function ContentPage() {
  const workspace = await getCurrentWorkspace();
  const contents = await db.content.findMany({ where: { workspaceId: workspace.id }, orderBy: { createdAt: "desc" } });

  return (
    <div className="flex flex-col gap-6">
      <h1 className="text-2xl font-semibold text-neutral-900 dark:text-neutral-100">Content</h1>
      <ContentGenerator workspaceId={workspace.id} />
      <ContentList
        items={contents.map((c) => ({
          id: c.id,
          type: c.type,
          status: c.status,
          title: c.title,
          body: c.body,
          createdAt: c.createdAt.toISOString(),
        }))}
      />
    </div>
  );
}
