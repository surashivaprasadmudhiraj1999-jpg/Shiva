import * as React from "react";
import { cn } from "@/lib/utils";
import { Badge } from "@/components/ui/badge";

export function PageHeader({
  title,
  description,
  children,
}: {
  title: string;
  description?: string;
  children?: React.ReactNode;
}) {
  return (
    <div className="mb-6 flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
      <div>
        <h1 className="text-2xl font-semibold tracking-tight">{title}</h1>
        {description && <p className="mt-1 max-w-2xl text-sm text-muted-foreground">{description}</p>}
      </div>
      {children && <div className="flex flex-wrap items-center gap-2">{children}</div>}
    </div>
  );
}

export function EmptyState({
  icon: Icon,
  title,
  description,
  children,
}: {
  icon?: React.ComponentType<{ className?: string }>;
  title: string;
  description?: string;
  children?: React.ReactNode;
}) {
  return (
    <div className="flex flex-col items-center justify-center rounded-xl border border-dashed border-border bg-card/50 px-6 py-12 text-center">
      {Icon && <Icon className="mb-3 h-8 w-8 text-muted-foreground" />}
      <h3 className="text-sm font-semibold">{title}</h3>
      {description && <p className="mt-1 max-w-sm text-sm text-muted-foreground">{description}</p>}
      {children && <div className="mt-4">{children}</div>}
    </div>
  );
}

const statusTones: Record<string, "success" | "warning" | "danger" | "secondary" | "info"> = {
  Passed: "success",
  Warning: "warning",
  Critical: "danger",
  "Not checked": "secondary",
  Done: "success",
  "In progress": "info",
  "To do": "secondary",
  Blocked: "danger",
  High: "danger",
  Medium: "warning",
  Low: "secondary",
  Connected: "success",
  "Not connected": "secondary",
  Error: "danger",
  Published: "success",
  Draft: "secondary",
  Review: "warning",
  Planned: "info",
  Positive: "success",
  Neutral: "secondary",
  Negative: "danger",
  Mentioned: "success",
  "Not mentioned": "danger",
};

export function StatusBadge({ status }: { status: string }) {
  return <Badge variant={statusTones[status] ?? "secondary"}>{status}</Badge>;
}

export function StatLabel({ children, className }: { children: React.ReactNode; className?: string }) {
  return <p className={cn("text-xs font-medium uppercase tracking-wide text-muted-foreground", className)}>{children}</p>;
}

export function Disclaimer({ children }: { children: React.ReactNode }) {
  return (
    <div className="rounded-lg border border-warning/30 bg-warning/5 px-4 py-2.5 text-xs text-[hsl(32_60%_32%)]">
      {children}
    </div>
  );
}
