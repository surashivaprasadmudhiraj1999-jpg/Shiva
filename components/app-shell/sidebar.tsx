"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  FolderKanban,
  Search,
  MessageSquareQuote,
  Bot,
  PenSquare,
  Swords,
  FileBarChart,
  Plug,
  Settings,
  Compass,
} from "lucide-react";
import { cn } from "@/lib/utils";

const nav = [
  { href: "/dashboard", label: "Dashboard", icon: LayoutDashboard },
  { href: "/projects", label: "Projects", icon: FolderKanban },
  { href: "/seo", label: "SEO Workspace", icon: Search },
  { href: "/aeo", label: "AEO Workspace", icon: MessageSquareQuote },
  { href: "/geo", label: "GEO Workspace", icon: Bot },
  { href: "/content", label: "Content Studio", icon: PenSquare },
  { href: "/competitors", label: "Competitors", icon: Swords },
  { href: "/reports", label: "Reports", icon: FileBarChart },
  { href: "/integrations", label: "Integrations", icon: Plug },
  { href: "/settings", label: "Settings", icon: Settings },
];

export function Sidebar({ onNavigate }: { onNavigate?: () => void }) {
  const pathname = usePathname();
  return (
    <div className="flex h-full w-60 flex-col border-r border-border bg-card">
      <div className="flex h-14 items-center gap-2 border-b border-border px-5">
        <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-primary text-primary-foreground">
          <Compass className="h-4 w-4" />
        </div>
        <span className="text-base font-semibold tracking-tight">SearchOS</span>
      </div>
      <nav className="flex-1 space-y-0.5 overflow-y-auto scrollbar-thin p-3">
        {nav.map((item) => {
          const active = pathname.startsWith(item.href);
          const Icon = item.icon;
          return (
            <Link
              key={item.href}
              href={item.href}
              onClick={onNavigate}
              className={cn(
                "flex items-center gap-3 rounded-md px-3 py-2 text-sm font-medium transition-colors",
                active ? "bg-primary/10 text-primary" : "text-muted-foreground hover:bg-accent hover:text-foreground",
              )}
            >
              <Icon className="h-4 w-4 shrink-0" />
              {item.label}
            </Link>
          );
        })}
      </nav>
      <div className="border-t border-border p-3">
        <div className="rounded-lg bg-secondary/60 p-3 text-xs text-muted-foreground">
          <p className="font-medium text-foreground">Demo mode</p>
          <p className="mt-1">Sample data is shown until you connect live sources in Integrations.</p>
        </div>
      </div>
    </div>
  );
}
