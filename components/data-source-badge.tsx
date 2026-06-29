import { Database, Cloud, Upload, RefreshCw, FlaskConical } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { relativeTime } from "@/lib/utils";

export type DataSource = "demo" | "live" | "manual" | "crawl";

const meta: Record<DataSource, { label: string; variant: "warning" | "success" | "info" | "secondary"; icon: typeof Database }> = {
  demo: { label: "Demo data", variant: "warning", icon: FlaskConical },
  live: { label: "Connected live source", variant: "success", icon: Cloud },
  manual: { label: "Manual upload", variant: "info", icon: Upload },
  crawl: { label: "Last crawl result", variant: "secondary", icon: RefreshCw },
};

export function DataSourceBadge({ source, updatedAt }: { source: DataSource; updatedAt?: string }) {
  const m = meta[source];
  const Icon = m.icon;
  return (
    <Badge variant={m.variant} className="font-medium">
      <Icon className="h-3 w-3" />
      {m.label}
      {updatedAt && <span className="opacity-70">· {relativeTime(updatedAt)}</span>}
    </Badge>
  );
}
