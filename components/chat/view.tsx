'use client';

import { useCallback, useEffect, useRef, useState } from 'react';
import { Skeleton } from '@/components/ui/skeleton';
import PromptInput from './PromptInput';
import { ChatMessages } from './messages';
import { useConversations, type Message } from '@/context/conversations';

type ApiMessage = {
  id?: string;
  sent_by: 'user' | 'assistant';
  content: string;
  created_at?: string;
};

export function ChatView({ id }: { id: string }) {
  const { messages, setMessages, appendMessage } = useConversations();
  const conversationMessages = messages[id];

  const [historyError, setHistoryError] = useState<string | null>(null);
  const [isGenerating, setIsGenerating] = useState(false);
  const [generationError, setGenerationError] = useState<string | null>(null);
  const lastSentRef = useRef<string | null>(null);

  const scrollAnchorRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    if (conversationMessages !== undefined) return;

    let cancelled = false;

    fetch(`/api/conversations/${id}/messages`)
      .then(async (res) => {
        const json = await res.json();
        if (!res.ok) throw new Error(json.error || 'Failed to load messages');
        return json.data?.messages as ApiMessage[];
      })
      .then((loaded) => {
        if (cancelled) return;
        setMessages(id, loaded ?? []);
      })
      .catch((err: unknown) => {
        if (cancelled) return;
        setHistoryError(
          err instanceof Error ? err.message : 'Failed to load messages'
        );
      });

    return () => {
      cancelled = true;
    };
  }, [id, conversationMessages, setMessages]);

  const isLoadingHistory = conversationMessages === undefined && !historyError;

  useEffect(() => {
    scrollAnchorRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [conversationMessages?.length, isGenerating]);

  const sendMessage = useCallback(
    async (text: string) => {
      lastSentRef.current = text;
      appendMessage(id, {
        sent_by: 'user',
        content: text,
        created_at: new Date().toISOString(),
      });
      setIsGenerating(true);
      setGenerationError(null);

      try {
        const res = await fetch('/api/chat', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ conversationId: id, message: text }),
        });
        const json = await res.json();
        if (!res.ok) {
          throw new Error(json.error || 'Failed to generate response');
        }
        appendMessage(id, {
          sent_by: 'assistant',
          content: json.data.reply,
          created_at: new Date().toISOString(),
        });
        lastSentRef.current = null;
      } catch (err: unknown) {
        setGenerationError(
          err instanceof Error ? err.message : 'Failed to generate response'
        );
      } finally {
        setIsGenerating(false);
      }
    },
    [appendMessage, id]
  );

  const retry = useCallback(async () => {
    const last = lastSentRef.current;
    if (!last || isGenerating) return;
    setGenerationError(null);
    setIsGenerating(true);
    try {
      const res = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ conversationId: id, message: last }),
      });
      const json = await res.json();
      if (!res.ok) {
        throw new Error(json.error || 'Failed to generate response');
      }
      appendMessage(id, {
        sent_by: 'assistant',
        content: json.data.reply,
        created_at: new Date().toISOString(),
      });
      lastSentRef.current = null;
    } catch (err: unknown) {
      setGenerationError(
        err instanceof Error ? err.message : 'Failed to generate response'
      );
    } finally {
      setIsGenerating(false);
    }
  }, [appendMessage, id, isGenerating]);

  if (isLoadingHistory) {
    return (
      <div className="flex h-full flex-1 flex-col items-center px-4 py-6">
        <div className="flex w-full max-w-[55em] flex-col gap-4">
          <Skeleton className="ml-auto h-10 w-2/3" />
          <Skeleton className="h-20 w-3/4" />
          <Skeleton className="ml-auto h-10 w-1/2" />
          <Skeleton className="h-24 w-3/4" />
        </div>
      </div>
    );
  }

  if (historyError) {
    return (
      <div className="flex h-full flex-1 flex-col items-center justify-center px-4 py-6">
        <p className="text-sm text-red-300">{historyError}</p>
      </div>
    );
  }

  const list: Message[] = conversationMessages ?? [];

  return (
    <div className="flex h-dvh max-h-dvh flex-1 flex-col">
      <div className="flex min-h-0 flex-1 justify-center overflow-y-auto px-4 pt-6">
        <div className="w-full max-w-[55em]">
          <ChatMessages
            messages={list}
            isGenerating={isGenerating}
            error={generationError}
            onRetry={generationError ? retry : undefined}
          />
          <div ref={scrollAnchorRef} className="h-4" />
        </div>
      </div>
      <div className="flex shrink-0 justify-center bg-background px-4 pb-6 pt-4">
        <PromptInput onSubmit={sendMessage} isLoading={isGenerating} />
      </div>
    </div>
  );
}
