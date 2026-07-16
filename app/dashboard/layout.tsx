import { redirect } from "next/navigation";
import { requireUser, getOrCreateDefaultWorkspace } from "@/services/auth";
import { Sidebar } from "@/components/layout/Sidebar";
import { TopNav } from "@/components/layout/TopNav";

export default async function DashboardLayout({ children }: { children: React.ReactNode }) {
  const user = await requireUser();
  const workspace = await getOrCreateDefaultWorkspace(user.id);

  if (workspace.status === "ONBOARDING") {
    redirect("/onboarding");
  }

  return (
    <div className="flex min-h-screen bg-white dark:bg-neutral-950">
      <Sidebar />
      <div className="flex flex-1 flex-col">
        <TopNav workspaceName={workspace.name} />
        <main className="flex-1 px-6 py-8">{children}</main>
      </div>
    </div>
  );
}
