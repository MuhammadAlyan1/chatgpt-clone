'use client';

import { useEffect, useState } from 'react';
import Image from 'next/image';
import { RefreshCcw } from 'lucide-react';
import { cn } from '@/lib/utils';
import type { Message } from '@/context/conversations';
import { useCurrentUser } from '@/context/user';

const LOADING_PHRASES = [
  'Analyzing your request..',
  'Interpreting context..',
  'Formulating response..',
  'Processing relevant information..',
  'Synthesizing answer..',
  'Running internal reasoning..',
  'Structuring output..',
  'Refining response..',
  'Finalizing answer..',
];

function pickPhrase(exclude?: string) {
  if (LOADING_PHRASES.length === 1) return LOADING_PHRASES[0];
  let next =
    LOADING_PHRASES[Math.floor(Math.random() * LOADING_PHRASES.length)];
  while (next === exclude) {
    next = LOADING_PHRASES[Math.floor(Math.random() * LOADING_PHRASES.length)];
  }
  return next;
}

function formatTimestamp(iso?: string) {
  if (!iso) return '';
  const date = new Date(iso);
  if (Number.isNaN(date.getTime())) return '';
  return date.toLocaleTimeString([], {
    hour: 'numeric',
    minute: '2-digit',
  });
}

function AssistantAvatar() {
  return (
    <div className="flex size-8 shrink-0 items-center justify-center rounded-full bg-zinc-800">
      <Image
        src="/chat-app-logo.svg"
        alt="Assistant"
        width={20}
        height={20}
        className="size-5"
      />
    </div>
  );
}

function UserAvatar() {
  const user = useCurrentUser();
  if (user.image) {
    return (
      <Image
        src={user.image}
        alt={user.name}
        width={32}
        height={32}
        className="size-8 shrink-0 rounded-full object-cover"
      />
    );
  }
  return (
    <div className="flex size-8 shrink-0 items-center justify-center rounded-full bg-zinc-700 text-xs font-medium uppercase text-zinc-100">
      {(user.name || user.email)[0]}
    </div>
  );
}

export function GeneratingBubble() {
  const [phrase, setPhrase] = useState(() => LOADING_PHRASES[0]);

  useEffect(() => {
    const interval = setInterval(() => {
      setPhrase((current) => pickPhrase(current));
    }, 1800);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="flex w-full items-start gap-3">
      <AssistantAvatar />
      <div className="flex items-center gap-2 rounded-2xl px-4 py-3 pt-1.5 text-sm text-zinc-400">
        <span className="italic">{phrase}</span>
      </div>
    </div>
  );
}

export function MessageBubble({ message }: { message: Message }) {
  const isUser = message.sent_by === 'user';
  const time = formatTimestamp(message.created_at);

  return (
    <div
      className={cn(
        'flex w-full items-start gap-3',
        isUser && 'flex-row-reverse'
      )}
    >
      <div className="mt-1">
        {isUser ? <UserAvatar /> : <AssistantAvatar />}
      </div>
      <div
        className={cn(
          'flex min-w-0 max-w-[80%] flex-col gap-1',
          isUser && 'items-end'
        )}
      >
        <div
          className={cn(
            'whitespace-pre-wrap text-sm leading-relaxed',
            isUser
              ? 'rounded-2xl bg-zinc-800 px-4 py-3 text-zinc-100'
              : 'pt-1 text-zinc-100'
          )}
        >
          {message.content}
        </div>
        {time && <span className={cn('text-xs text-zinc-500')}>{time}</span>}
      </div>
    </div>
  );
}

export function ErrorBubble({
  message,
  onRetry,
}: {
  message: string;
  onRetry?: () => void;
}) {
  return (
    <div className="flex w-full items-start gap-3">
      <AssistantAvatar />
      <div className="flex max-w-[80%] flex-col gap-2 rounded-2xl border border-red-900/50 bg-red-950/30 px-4 py-3 text-sm text-red-200">
        <span>{message}</span>
        {onRetry && (
          <button
            type="button"
            onClick={onRetry}
            className="inline-flex w-fit items-center gap-1.5 rounded-md border border-red-900/50 px-2 py-1 text-xs hover:bg-red-900/40 cursor-pointer"
          >
            <RefreshCcw className="size-3" />
            Retry
          </button>
        )}
      </div>
    </div>
  );
}

type ChatMessagesProps = {
  messages: Message[];
  isGenerating?: boolean;
  error?: string | null;
  onRetry?: () => void;
};

export function ChatMessages({
  messages,
  isGenerating,
  error,
  onRetry,
}: ChatMessagesProps) {
  return (
    <div className="flex w-full max-w-[55em] flex-col gap-6">
      {messages.map((m, i) => (
        <MessageBubble key={m.id ?? i} message={m} />
      ))}
      {isGenerating && <GeneratingBubble />}
      {error && <ErrorBubble message={error} onRetry={onRetry} />}
    </div>
  );
}
