"use client";

import * as React from "react";
import { Search, Bell, ChevronDown, Calendar, Check, Menu } from "lucide-react";
import { useStore } from "@/lib/store";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

const DATE_RANGES = ["Last 7 days", "Last 28 days", "Last 3 months", "Last 12 months", "Year to date"];

export function Topbar({ onMenu }: { onMenu: () => void }) {
  const { projects, currentProjectId, currentProject, dateRange, dispatch, currentUser, role, users } = useStore();
  const [openProject, setOpenProject] = React.useState(false);
  const [openDate, setOpenDate] = React.useState(false);
  const [openUser, setOpenUser] = React.useState(false);
  const [openNotif, setOpenNotif] = React.useState(false);

  return (
    <header className="sticky top-0 z-30 flex h-14 items-center gap-3 border-b border-border bg-card/95 px-4 backdrop-blur">
      <button onClick={onMenu} className="rounded-md p-2 text-muted-foreground hover:bg-accent lg:hidden" aria-label="Menu">
        <Menu className="h-4 w-4" />
      </button>

      {/* Project switcher */}
      <div className="relative">
        <button
          onClick={() => setOpenProject((v) => !v)}
          className="flex items-center gap-2 rounded-md border border-input bg-card px-3 py-1.5 text-sm font-medium hover:bg-accent"
        >
          <span className="max-w-[180px] truncate">{currentProject.name}</span>
          {currentProject.isSample && <Badge variant="warning">Sample</Badge>}
          <ChevronDown className="h-3.5 w-3.5 text-muted-foreground" />
        </button>
        {openProject && (
          <Dropdown onClose={() => setOpenProject(false)}>
            {projects.map((p) => (
              <button
                key={p.id}
                onClick={() => {
                  dispatch({ type: "SET_PROJECT", id: p.id });
                  setOpenProject(false);
                }}
                className="flex w-full items-center justify-between gap-2 rounded-md px-2 py-1.5 text-left text-sm hover:bg-accent"
              >
                <span className="flex items-center gap-2 truncate">
                  {p.name}
                  {p.isSample && <Badge variant="warning">Sample</Badge>}
                </span>
                {p.id === currentProjectId && <Check className="h-3.5 w-3.5 text-primary" />}
              </button>
            ))}
          </Dropdown>
        )}
      </div>

      {/* Date range */}
      <div className="relative hidden sm:block">
        <button
          onClick={() => setOpenDate((v) => !v)}
          className="flex items-center gap-2 rounded-md border border-input bg-card px-3 py-1.5 text-sm text-muted-foreground hover:bg-accent"
        >
          <Calendar className="h-3.5 w-3.5" />
          {dateRange}
          <ChevronDown className="h-3.5 w-3.5" />
        </button>
        {openDate && (
          <Dropdown onClose={() => setOpenDate(false)}>
            {DATE_RANGES.map((r) => (
              <button
                key={r}
                onClick={() => {
                  dispatch({ type: "SET_DATE_RANGE", value: r });
                  setOpenDate(false);
                }}
                className="flex w-full items-center justify-between rounded-md px-2 py-1.5 text-left text-sm hover:bg-accent"
              >
                {r}
                {r === dateRange && <Check className="h-3.5 w-3.5 text-primary" />}
              </button>
            ))}
          </Dropdown>
        )}
      </div>

      {/* Search */}
      <div className="relative ml-auto hidden max-w-xs flex-1 md:block">
        <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
        <input
          placeholder="Search keywords, pages, tasks…"
          className="h-9 w-full rounded-md border border-input bg-card pl-9 pr-3 text-sm placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
        />
      </div>

      {/* Notifications */}
      <div className="relative ml-auto md:ml-0">
        <button
          onClick={() => setOpenNotif((v) => !v)}
          className="relative rounded-md p-2 text-muted-foreground hover:bg-accent"
          aria-label="Notifications"
        >
          <Bell className="h-4 w-4" />
          <span className="absolute right-1.5 top-1.5 h-2 w-2 rounded-full bg-danger" />
        </button>
        {openNotif && (
          <Dropdown onClose={() => setOpenNotif(false)} className="w-72">
            <p className="px-2 py-1 text-xs font-semibold uppercase tracking-wide text-muted-foreground">Notifications</p>
            {[
              "2 project pages have missing canonical tags",
              "AEO score improved to 64 (+3)",
              "Competitor Prestige gained 4 new AI mentions",
            ].map((n, i) => (
              <div key={i} className="rounded-md px-2 py-2 text-sm hover:bg-accent">
                {n}
              </div>
            ))}
          </Dropdown>
        )}
      </div>

      {/* User menu */}
      <div className="relative">
        <button onClick={() => setOpenUser((v) => !v)} className="flex items-center gap-2 rounded-md p-1 hover:bg-accent">
          <span
            className="flex h-7 w-7 items-center justify-center rounded-full text-xs font-semibold text-white"
            style={{ background: currentUser.avatarColor }}
          >
            {currentUser.name.slice(0, 1)}
          </span>
          <ChevronDown className="hidden h-3.5 w-3.5 text-muted-foreground sm:block" />
        </button>
        {openUser && (
          <Dropdown onClose={() => setOpenUser(false)} className="right-0 w-64">
            <div className="px-2 py-1.5">
              <p className="text-sm font-medium">{currentUser.name}</p>
              <p className="text-xs text-muted-foreground">{currentUser.email}</p>
              <Badge variant="info" className="mt-1.5">
                {role}
              </Badge>
            </div>
            <div className="my-1 border-t border-border" />
            <p className="px-2 py-1 text-xs font-semibold uppercase tracking-wide text-muted-foreground">Switch role (demo)</p>
            {users.map((u) => (
              <button
                key={u.id}
                onClick={() => {
                  dispatch({ type: "SET_USER", id: u.id });
                  setOpenUser(false);
                }}
                className="flex w-full items-center justify-between rounded-md px-2 py-1.5 text-left text-sm hover:bg-accent"
              >
                <span>
                  {u.name} <span className="text-muted-foreground">· {u.role}</span>
                </span>
                {u.id === currentUser.id && <Check className="h-3.5 w-3.5 text-primary" />}
              </button>
            ))}
          </Dropdown>
        )}
      </div>
    </header>
  );
}

function Dropdown({ children, onClose, className }: { children: React.ReactNode; onClose: () => void; className?: string }) {
  const ref = React.useRef<HTMLDivElement>(null);
  React.useEffect(() => {
    function onClick(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) onClose();
    }
    document.addEventListener("mousedown", onClick);
    return () => document.removeEventListener("mousedown", onClick);
  }, [onClose]);
  return (
    <div ref={ref} className={cn("absolute left-0 top-full z-40 mt-1 w-56 rounded-lg border border-border bg-card p-1 shadow-lg", className)}>
      {children}
    </div>
  );
}
