import { verifySession } from '@/lib/auth/dal';
import { createClient } from '@/lib/supabase/server';
import { AppSidebar } from '@/components/sidebar/AppSidebar';
import { MobileSidebarTrigger } from '@/components/sidebar/MobileSidebarTrigger';
import { SidebarInset, SidebarProvider } from '@/components/ui/sidebar';
import {
  ConversationsProvider,
  type Conversation,
} from '@/context/conversations';
import { UserProvider } from '@/context/user';

export default async function AppLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const user = await verifySession();
  const metadata = (user.user_metadata ?? {}) as {
    full_name?: string;
    name?: string;
    avatar_url?: string;
  };

  const name =
    metadata.full_name || metadata.name || user.email?.split('@')[0] || 'User';

  const supabase = await createClient();
  const { data: rows } = await supabase
    .from('conversations')
    .select('id, title')
    .eq('user_id', user.id)
    .order('updated_at', { ascending: false });

  const initialConversations: Conversation[] = (rows ?? []).map((r) => ({
    id: r.id as string,
    title: (r.title as string) ?? 'Untitled',
  }));

  const currentUser = {
    name,
    email: user.email ?? '',
    image: metadata.avatar_url,
  };

  return (
    <UserProvider user={currentUser}>
      <ConversationsProvider initialConversations={initialConversations}>
        <SidebarProvider>
          <AppSidebar user={currentUser} />
          <SidebarInset>
            <MobileSidebarTrigger />
            {children}
          </SidebarInset>
        </SidebarProvider>
      </ConversationsProvider>
    </UserProvider>
  );
}
