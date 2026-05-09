import { verifySession } from "@/lib/auth/dal";

export default async function ChatPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  await verifySession();
  const { id } = await params;

  return (
    <div className="flex min-h-screen flex-col items-center justify-center gap-2 px-4">
      <h1 className="text-2xl font-semibold">Chat</h1>
      <p className="text-sm text-zinc-500">id: {id}</p>
    </div>
  );
}
