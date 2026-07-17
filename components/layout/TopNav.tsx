import { UserButton } from "@clerk/nextjs";

export function TopNav({ workspaceName }: { workspaceName: string }) {
  return (
    <header className="flex items-center justify-between border-b border-neutral-200 px-6 py-4 dark:border-neutral-800">
      <span className="text-sm font-medium text-neutral-700 dark:text-neutral-300">{workspaceName}</span>
      <UserButton />
    </header>
  );
}
