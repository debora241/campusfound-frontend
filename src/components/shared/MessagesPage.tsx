import { useEffect, useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useForm } from "react-hook-form";
import { Send, AlertTriangle, RefreshCw, MessageSquare } from "lucide-react";
import { PageHeader } from "@/components/shared/PageHeader";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { useAppSelector } from "@/store/hooks";
import { messagesApi } from "@/lib/messagesApi";
import { ApiError } from "@/lib/apiClient";

export function MessagesPage({ description }: { description: string }) {
  const accessToken = useAppSelector((s) => s.auth.accessToken);
  const queryClient = useQueryClient();
  const [activeId, setActiveId] = useState<string | null>(null);
  const { register, handleSubmit, reset } = useForm<{ reply: string }>();

  const { data: conversations, isLoading, isError, error, refetch } = useQuery({
    queryKey: ["conversations"],
    queryFn: () => messagesApi.listConversations(accessToken!),
    enabled: !!accessToken,
  });

  useEffect(() => {
    if (!activeId && conversations && conversations.length > 0) setActiveId(conversations[0].userId);
  }, [conversations, activeId]);

  const { data: thread } = useQuery({
    queryKey: ["thread", activeId],
    queryFn: () => messagesApi.getThread(accessToken!, activeId!),
    enabled: !!accessToken && !!activeId,
  });

  const sendMutation = useMutation({
    mutationFn: (body: string) => messagesApi.send(accessToken!, activeId!, body),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["thread", activeId] });
      queryClient.invalidateQueries({ queryKey: ["conversations"] });
      reset();
    },
  });

  const active = conversations?.find((c) => c.userId === activeId);

  if (isError) {
    return (
      <div className="flex flex-col items-center justify-center rounded-lg border border-line py-20 text-center dark:border-line-dark">
        <AlertTriangle className="mb-3 h-8 w-8 text-alert" />
        <p className="font-medium">Couldn't load messages</p>
        <p className="mt-1 max-w-sm text-sm text-ink-300">
          {error instanceof ApiError ? error.message : "Check that the backend is running."}
        </p>
        <Button className="mt-4" size="sm" onClick={() => refetch()}>
          <RefreshCw className="h-3.5 w-3.5" /> Retry
        </Button>
      </div>
    );
  }

  return (
    <div>
      <PageHeader title="Messages" description={description} />

      {!isLoading && (conversations ?? []).length === 0 ? (
        <div className="flex flex-col items-center justify-center rounded-lg border border-line py-16 text-center dark:border-line-dark">
          <MessageSquare className="mb-3 h-8 w-8 text-ink-300" />
          <p className="font-medium">No conversations yet</p>
          <p className="mt-1 max-w-sm text-sm text-ink-300">Messages you send or receive will show up here.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 overflow-hidden rounded-lg border border-line dark:border-line-dark lg:grid-cols-[280px_1fr]">
          <div className="divide-y divide-line border-b border-line dark:divide-line-dark dark:border-line-dark lg:border-b-0 lg:border-r">
            {isLoading && <p className="p-4 text-sm text-ink-300">Loading…</p>}
            {(conversations ?? []).map((c) => (
              <button
                key={c.userId}
                onClick={() => setActiveId(c.userId)}
                className={cn(
                  "block w-full px-4 py-3 text-left text-sm transition-colors",
                  c.userId === activeId ? "bg-ink-50 dark:bg-white/5" : "hover:bg-ink-50/50 dark:hover:bg-white/5"
                )}
              >
                <div className="flex items-center justify-between">
                  <p className="font-medium">{c.fullName}</p>
                  {c.unread && <Badge variant="gold">new</Badge>}
                </div>
                <p className="mt-0.5 truncate text-xs text-ink-300">{c.preview}</p>
                <p className="mt-1 text-[11px] text-ink-300">{new Date(c.time).toLocaleString()}</p>
              </button>
            ))}
          </div>

          <div className="flex flex-col p-5">
            {active ? (
              <>
                <div className="border-b border-line pb-3 dark:border-line-dark">
                  <p className="font-medium">{active.fullName}</p>
                  <p className="text-xs capitalize text-ink-300">{active.role.replace("_", " ")}</p>
                </div>
                <div className="flex-1 space-y-3 overflow-y-auto py-4">
                  {(thread ?? []).map((m) => (
                    <div key={m.id} className={cn("max-w-[80%] rounded-lg px-3 py-2 text-sm", m.fromMe ? "ml-auto bg-ink text-white dark:bg-white dark:text-ink" : "bg-ink-50 dark:bg-white/5")}>
                      {m.body}
                    </div>
                  ))}
                </div>
                <form
                  className="flex gap-2 border-t border-line pt-3 dark:border-line-dark"
                  onSubmit={handleSubmit((v) => v.reply.trim() && sendMutation.mutate(v.reply.trim()))}
                >
                  <input
                    {...register("reply")}
                    placeholder="Type a reply…"
                    className="h-10 flex-1 rounded-md border border-line bg-transparent px-3 text-sm outline-none focus:border-ink dark:border-line-dark dark:focus:border-white"
                  />
                  <Button type="submit" size="icon" aria-label="Send" disabled={sendMutation.isPending}>
                    <Send className="h-4 w-4" />
                  </Button>
                </form>
              </>
            ) : (
              <p className="text-sm text-ink-300">Select a conversation.</p>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
