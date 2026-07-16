"use client";

import { useState, useTransition, useRef, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { sendMessage } from "@/actions/chat";

interface ChatMessage {
  id: string;
  role: "USER" | "ASSISTANT" | "SYSTEM";
  content: string;
}

export function ChatPanel({ workspaceId, initialMessages }: { workspaceId: string; initialMessages: ChatMessage[] }) {
  const [messages, setMessages] = useState(initialMessages);
  const [input, setInput] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();
  const bottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  function handleSend() {
    if (!input.trim()) return;
    const userMessage: ChatMessage = { id: `local-${Date.now()}`, role: "USER", content: input };
    setMessages((m) => [...m, userMessage]);
    setInput("");
    setError(null);

    startTransition(async () => {
      try {
        const reply = await sendMessage(workspaceId, userMessage.content);
        setMessages((m) => [...m, { id: reply.id, role: "ASSISTANT", content: reply.content }]);
      } catch (err) {
        setError((err as Error).message);
      }
    });
  }

  return (
    <div className="flex h-[70vh] flex-col rounded-xl border border-neutral-200 dark:border-neutral-800">
      <div className="flex-1 overflow-y-auto p-5">
        {messages.length === 0 && (
          <p className="text-sm text-neutral-500 dark:text-neutral-400">
            Ask me anything — &quot;What should I focus on this week?&quot;, &quot;Write a LinkedIn post about our launch&quot;,
            &quot;Re-run my competitor research&quot;.
          </p>
        )}
        <div className="flex flex-col gap-4">
          {messages.map((m) => (
            <div key={m.id} className={m.role === "USER" ? "text-right" : "text-left"}>
              <div
                className={
                  m.role === "USER"
                    ? "inline-block max-w-[80%] rounded-2xl bg-neutral-900 px-4 py-2 text-sm text-white dark:bg-white dark:text-neutral-900"
                    : "inline-block max-w-[80%] whitespace-pre-wrap rounded-2xl bg-neutral-100 px-4 py-2 text-left text-sm text-neutral-900 dark:bg-neutral-900 dark:text-neutral-100"
                }
              >
                {m.content}
              </div>
            </div>
          ))}
          {isPending && <p className="text-sm text-neutral-400">Thinking…</p>}
        </div>
        <div ref={bottomRef} />
      </div>

      {error && <p className="px-5 text-sm text-red-600 dark:text-red-400">{error}</p>}

      <div className="flex items-end gap-2 border-t border-neutral-200 p-3 dark:border-neutral-800">
        <Textarea
          rows={1}
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Enter" && !e.shiftKey) {
              e.preventDefault();
              handleSend();
            }
          }}
          placeholder="Message your AI Marketing Employee…"
          className="flex-1 resize-none"
        />
        <Button onClick={handleSend} disabled={isPending || !input.trim()}>Send</Button>
      </div>
    </div>
  );
}
