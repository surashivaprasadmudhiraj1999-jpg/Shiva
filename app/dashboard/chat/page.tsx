import { getCurrentWorkspace } from "@/actions/workspace";
import { requireUser } from "@/services/auth";
import { getConversationHistory } from "@/actions/chat";
import { ChatPanel } from "@/features/chat/ChatPanel";

export default async function ChatPage() {
  const user = await requireUser();
  const workspace = await getCurrentWorkspace();
  const messages = await getConversationHistory(workspace.id, user.id);

  return (
    <div className="flex flex-col gap-6">
      <h1 className="text-2xl font-semibold text-neutral-900 dark:text-neutral-100">Talk to your AI</h1>
      <ChatPanel
        workspaceId={workspace.id}
        initialMessages={messages.map((m) => ({ id: m.id, role: m.role, content: m.content }))}
      />
    </div>
  );
}
