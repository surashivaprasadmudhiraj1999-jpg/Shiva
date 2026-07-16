import { getCurrentWorkspace, getDashboardData } from "@/actions/workspace";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { TaskList } from "@/features/dashboard/TaskList";
import { greetingForHour } from "@/utils/date";

export default async function DashboardPage() {
  const workspace = await getCurrentWorkspace();
  const { tasks, businessProfile, strategy, recentContent } = await getDashboardData(workspace.id);

  const greeting = greetingForHour(new Date().getHours());
  const firstName = businessProfile?.businessName ?? "there";

  return (
    <div className="flex flex-col gap-6">
      <div>
        <h1 className="text-2xl font-semibold text-neutral-900 dark:text-neutral-100">
          {greeting}, {firstName}.
        </h1>
        <p className="mt-1 text-sm text-neutral-500 dark:text-neutral-400">
          {strategy
            ? `Executing on "${strategy.title}". Here's what matters today.`
            : "I'm still building your strategy — check back shortly, or ask me anything in chat."}
        </p>
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle>Today&apos;s priorities</CardTitle>
            <CardDescription>Ranked by impact, ready to act on.</CardDescription>
          </CardHeader>
          <CardContent>
            <TaskList tasks={tasks} />
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Recent content</CardTitle>
            <CardDescription>Freshly drafted by your AI.</CardDescription>
          </CardHeader>
          <CardContent>
            <ul className="flex flex-col gap-2">
              {recentContent.map((c) => (
                <li key={c.id} className="rounded-lg border border-neutral-200 p-3 text-sm dark:border-neutral-800">
                  <p className="font-medium text-neutral-900 dark:text-neutral-100">{c.title}</p>
                  <p className="mt-0.5 text-xs uppercase tracking-wide text-neutral-400">{c.type.replace(/_/g, " ")}</p>
                </li>
              ))}
              {recentContent.length === 0 && (
                <p className="text-sm text-neutral-500 dark:text-neutral-400">Nothing generated yet.</p>
              )}
            </ul>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
