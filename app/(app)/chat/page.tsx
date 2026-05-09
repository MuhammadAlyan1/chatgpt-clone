'use client';

import { useState } from 'react';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import PromptInput from '@/components/chat/PromptInput';
import { ChatMessages } from '@/components/chat/messages';
import { useConversations, type Message } from '@/context/conversations';

export default function NewChatPage() {
  const router = useRouter();
  const { addConversation, setMessages } = useConversations();
  const [pendingMessage, setPendingMessage] = useState<string | null>(null);
  const [pendingSentAt, setPendingSentAt] = useState<string | null>(null);
  const [isGenerating, setIsGenerating] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const sendMessage = async (text: string) => {
    const sentAt = new Date().toISOString();
    setPendingMessage(text);
    setPendingSentAt(sentAt);
    setIsGenerating(true);
    setError(null);

    try {
      const res = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message: text }),
      });
      const json = await res.json();
      if (!res.ok) {
        throw new Error(json.error || 'Failed to generate response');
      }

      const conversationId: string = json.data.conversationId;
      const reply: string = json.data.reply;

      const userMessage: Message = {
        sent_by: 'user',
        content: text,
        created_at: sentAt,
      };
      const assistantMessage: Message = {
        sent_by: 'assistant',
        content: reply,
        created_at: new Date().toISOString(),
      };

      addConversation({
        id: conversationId,
        title: text.slice(0, 50),
      });
      setMessages(conversationId, [userMessage, assistantMessage]);

      router.push(`/chat/${conversationId}`);
    } catch (err: unknown) {
      setError(
        err instanceof Error ? err.message : 'Failed to generate response'
      );
      setIsGenerating(false);
    }
  };

  if (pendingMessage) {
    const messages: Message[] = [
      {
        sent_by: 'user',
        content: pendingMessage,
        created_at: pendingSentAt ?? undefined,
      },
    ];

    return (
      <div className="flex h-dvh max-h-dvh flex-1 flex-col">
        <div className="flex min-h-0 flex-1 justify-center overflow-y-auto px-4 pt-6">
          <div className="w-full max-w-[55em]">
            <ChatMessages
              messages={messages}
              isGenerating={isGenerating}
              error={error}
              onRetry={error ? () => sendMessage(pendingMessage) : undefined}
            />
          </div>
        </div>
        <div className="flex shrink-0 justify-center bg-background px-4 pb-6 pt-4">
          <PromptInput
            onSubmit={sendMessage}
            isLoading={isGenerating}
            placeholder="Waiting for response..."
          />
        </div>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen flex-col items-center justify-center gap-4 px-4">
      <Image
        src={'/turing-technologies-logo-large.png'}
        width={207}
        height={178}
        alt={'Turing Technologies logo'}
        className="mb-16"
      />
      <PromptInput onSubmit={sendMessage} isLoading={isGenerating} />
    </div>
  );
}
