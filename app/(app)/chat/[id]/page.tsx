import { verifySession } from '@/lib/auth/dal';
import { ChatView } from '@/components/chat/view';

export default async function ChatPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  await verifySession();
  const { id } = await params;

  return <ChatView key={id} id={id} />;
}
