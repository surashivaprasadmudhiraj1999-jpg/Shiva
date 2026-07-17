import { getCurrentWorkspace } from "@/actions/workspace";
import { db } from "@/lib/db";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { formatDate } from "@/utils/date";

interface WeekPlan {
  week: number;
  theme: string;
  items: { day: string; type: string; title: string; channel: string }[];
}

export default async function CalendarPage() {
  const workspace = await getCurrentWorkspace();
  const calendar = await db.contentCalendar.findFirst({
    where: { workspaceId: workspace.id },
    orderBy: { createdAt: "desc" },
  });

  if (!calendar) {
    return <p className="text-sm text-neutral-500 dark:text-neutral-400">No content calendar yet.</p>;
  }

  const weeks = ((calendar.plan as { weeks?: WeekPlan[] }).weeks ?? []);

  return (
    <div className="flex flex-col gap-6">
      <div>
        <h1 className="text-2xl font-semibold text-neutral-900 dark:text-neutral-100">{calendar.title}</h1>
        <p className="mt-1 text-sm text-neutral-500 dark:text-neutral-400">
          {formatDate(calendar.periodStart)} – {formatDate(calendar.periodEnd)}
        </p>
      </div>

      {weeks.map((week) => (
        <Card key={week.week}>
          <CardHeader>
            <CardTitle>Week {week.week}</CardTitle>
            <CardDescription>{week.theme}</CardDescription>
          </CardHeader>
          <CardContent>
            <ul className="flex flex-col gap-2">
              {week.items.map((item, i) => (
                <li key={i} className="flex items-center justify-between rounded-lg border border-neutral-200 p-3 text-sm dark:border-neutral-800">
                  <div>
                    <p className="font-medium text-neutral-900 dark:text-neutral-100">{item.title}</p>
                    <p className="text-xs text-neutral-400">{item.type.replace(/_/g, " ")} · {item.channel}</p>
                  </div>
                  <span className="text-xs text-neutral-400">{item.day}</span>
                </li>
              ))}
            </ul>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
