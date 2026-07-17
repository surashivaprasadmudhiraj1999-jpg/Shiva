"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/utils/cn";

const nav = [
  { href: "/dashboard", label: "Dashboard" },
  { href: "/dashboard/chat", label: "Talk to your AI" },
  { href: "/dashboard/business", label: "Business" },
  { href: "/dashboard/research", label: "Research" },
  { href: "/dashboard/competitors", label: "Competitors" },
  { href: "/dashboard/personas", label: "Customers" },
  { href: "/dashboard/strategy", label: "Strategy" },
  { href: "/dashboard/calendar", label: "Content Calendar" },
  { href: "/dashboard/content", label: "Content" },
];

export function Sidebar() {
  const pathname = usePathname();

  return (
    <aside className="hidden w-56 shrink-0 border-r border-neutral-200 px-3 py-6 dark:border-neutral-800 sm:block">
      <div className="mb-6 px-3 text-sm font-semibold tracking-tight text-neutral-900 dark:text-neutral-100">
        AI Marketing Employee
      </div>
      <nav className="flex flex-col gap-0.5">
        {nav.map((item) => {
          const active = pathname === item.href;
          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "rounded-lg px-3 py-2 text-sm transition-colors",
                active
                  ? "bg-neutral-100 font-medium text-neutral-900 dark:bg-neutral-800 dark:text-neutral-100"
                  : "text-neutral-600 hover:bg-neutral-50 dark:text-neutral-400 dark:hover:bg-neutral-900",
              )}
            >
              {item.label}
            </Link>
          );
        })}
      </nav>
    </aside>
  );
}
