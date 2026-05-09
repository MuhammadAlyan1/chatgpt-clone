import { verifySession } from '@/lib/auth/dal';
import { logout } from '@/app/(auth)/actions';

export default async function NewChatPage() {
  const user = await verifySession();

  return (
    <div className="flex min-h-screen flex-col items-center justify-center gap-4 px-4">
      <h1 className="text-2xl font-semibold">New chat</h1>
      <p className="text-sm text-zinc-500">Signed in as {user.email}</p>
      <form action={logout}>
        <button
          type="submit"
          className="rounded-md border border-zinc-300 bg-white px-3 py-2 text-sm font-medium hover:bg-zinc-50 dark:border-zinc-700 dark:bg-zinc-900 dark:hover:bg-zinc-800"
        >
          Sign out
        </button>
      </form>
    </div>
  );
}
