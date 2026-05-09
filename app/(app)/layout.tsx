import { verifySession } from '@/lib/auth/dal';
import { AppSidebar } from '@/components/sidebar/AppSidebar';
import { MobileSidebarTrigger } from '@/components/sidebar/MobileSidebarTrigger';
import { SidebarInset, SidebarProvider } from '@/components/ui/sidebar';

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
    metadata.full_name ||
    metadata.name ||
    user.email?.split('@')[0] ||
    'User';

  return (
    <SidebarProvider>
      <AppSidebar
        user={{
          name,
          email: user.email ?? '',
          image: metadata.avatar_url,
        }}
      />
      <SidebarInset>
        <MobileSidebarTrigger />
        {children}
      </SidebarInset>
    </SidebarProvider>
  );
}
