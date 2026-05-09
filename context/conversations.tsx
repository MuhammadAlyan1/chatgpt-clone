'use client';

import {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useState,
} from 'react';

export type Message = {
  id?: string;
  sent_by: 'user' | 'assistant';
  content: string;
  created_at?: string;
};

export type Conversation = {
  id: string;
  title: string;
};

type ConversationsContextValue = {
  conversations: Conversation[];
  messages: Record<string, Message[] | undefined>;
  addConversation: (conversation: Conversation) => void;
  setMessages: (conversationId: string, messages: Message[]) => void;
  appendMessage: (conversationId: string, message: Message) => void;
};

const ConversationsContext = createContext<ConversationsContextValue | null>(
  null
);

export function ConversationsProvider({
  initialConversations,
  children,
}: {
  initialConversations: Conversation[];
  children: React.ReactNode;
}) {
  const [conversations, setConversations] = useState<Conversation[]>(
    initialConversations
  );
  const [messages, setMessagesState] = useState<
    Record<string, Message[] | undefined>
  >({});

  const addConversation = useCallback((conversation: Conversation) => {
    setConversations((prev) => {
      if (prev.some((c) => c.id === conversation.id)) return prev;
      return [conversation, ...prev];
    });
  }, []);

  const setMessages = useCallback(
    (conversationId: string, next: Message[]) => {
      setMessagesState((prev) => ({ ...prev, [conversationId]: next }));
    },
    []
  );

  const appendMessage = useCallback(
    (conversationId: string, message: Message) => {
      setMessagesState((prev) => ({
        ...prev,
        [conversationId]: [...(prev[conversationId] ?? []), message],
      }));
    },
    []
  );

  const value = useMemo(
    () => ({
      conversations,
      messages,
      addConversation,
      setMessages,
      appendMessage,
    }),
    [conversations, messages, addConversation, setMessages, appendMessage]
  );

  return (
    <ConversationsContext.Provider value={value}>
      {children}
    </ConversationsContext.Provider>
  );
}

export function useConversations() {
  const ctx = useContext(ConversationsContext);
  if (!ctx) {
    throw new Error(
      'useConversations must be used inside a ConversationsProvider'
    );
  }
  return ctx;
}
