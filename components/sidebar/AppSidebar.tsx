'use client';

import { useState } from 'react';
import Image from 'next/image';
import { usePathname, useRouter } from 'next/navigation';
import toast from 'react-hot-toast';
import { ChevronDown, LogOut } from 'lucide-react';

import { logout } from '@/app/(auth)/actions';
import { cn } from '@/lib/utils';
import { useConversations } from '@/context/conversations';
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  useSidebar,
} from '@/components/ui/sidebar';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';

type AppSidebarProps = {
  user: {
    name: string;
    email: string;
    image?: string;
  };
};

export function AppSidebar({ user }: AppSidebarProps) {
  const router = useRouter();
  const pathname = usePathname();
  const { conversations } = useConversations();
  const [isHistoryOpen, setIsHistoryOpen] = useState(true);

  return (
    <Sidebar collapsible="icon">
      <SidebarHeader>
        <SidebarHeaderContent />
      </SidebarHeader>
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupContent>
            <SidebarMenu className="space-y-1.5">
              <SidebarMenuItem>
                <SidebarMenuButton
                  tooltip="New Chat"
                  onClick={() => router.push('/chat')}
                >
                  <Image
                    src="/create-chat.svg"
                    alt="Create Chat"
                    width={26}
                    height={26}
                  />
                  <span>New Chat</span>
                </SidebarMenuButton>
              </SidebarMenuItem>
              <SidebarMenuItem>
                <SidebarMenuButton
                  tooltip="Quick Actions"
                  onClick={() => toast('Quick Actions coming soon')}
                >
                  <Image
                    src="/quick-actions.svg"
                    alt="Quick Actions"
                    width={26}
                    height={26}
                  />
                  <span>Quick Actions</span>
                </SidebarMenuButton>
              </SidebarMenuItem>
              <SidebarMenuItem>
                <SidebarMenuButton
                  tooltip="Spaces"
                  onClick={() => toast('Spaces is coming soon')}
                >
                  <Image
                    src="/spaces.svg"
                    alt="Spaces"
                    width={26}
                    height={26}
                  />
                  <span>Spaces</span>
                </SidebarMenuButton>
              </SidebarMenuItem>
              <SidebarMenuItem>
                <SidebarMenuButton
                  tooltip="Chat History"
                  onClick={() => setIsHistoryOpen((prev) => !prev)}
                  aria-expanded={isHistoryOpen}
                >
                  <Image src="/chat.svg" alt="Chat" width={26} height={26} />
                  <span>Chat History</span>
                  <ChevronDown
                    className={cn(
                      'ml-auto transition-transform duration-200',
                      !isHistoryOpen && '-rotate-90'
                    )}
                  />
                </SidebarMenuButton>
              </SidebarMenuItem>
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>

        {isHistoryOpen && (
          <SidebarGroup className="group-data-[collapsible=icon]:hidden">
            <SidebarGroupContent>
              <SidebarMenu>
                {conversations.length === 0 ? (
                  <p className="px-2 py-1 text-xs text-muted-foreground">
                    No chats yet
                  </p>
                ) : (
                  conversations.map((item) => {
                    const isActive = pathname === `/chat/${item.id}`;
                    return (
                      <SidebarMenuItem key={item.id}>
                        <SidebarMenuButton
                          size="sm"
                          isActive={isActive}
                          onClick={() => router.push(`/chat/${item.id}`)}
                        >
                          <span className="truncate">{item.title}</span>
                        </SidebarMenuButton>
                      </SidebarMenuItem>
                    );
                  })
                )}
              </SidebarMenu>
            </SidebarGroupContent>
          </SidebarGroup>
        )}
      </SidebarContent>
      <SidebarFooter>
        <DropdownMenu>
          <DropdownMenuTrigger
            className="w-full flex items-center gap-4 p-1 rounded-md hover:bg-sidebar-accent"
          >
            {user.image ? (
              <Image
                src={user.image}
                alt={user.name}
                width={32}
                height={32}
                className="size-8 rounded-full shrink-0 object-cover"
              />
            ) : (
              <div className="size-8 rounded-full shrink-0 flex items-center justify-center bg-muted text-xs font-medium uppercase">
                {(user.name || user.email)[0]}
              </div>
            )}
            <div className="flex flex-col items-baseline gap-0.5 min-w-0 text-left group-data-[collapsible=icon]:hidden">
              <span className="text-sm font-medium truncate w-full">
                {user.name}
              </span>
              <span className="text-xs text-muted-foreground truncate w-full">
                {user.email}
              </span>
            </div>
          </DropdownMenuTrigger>
          <DropdownMenuContent side="top" align="start">
            <DropdownMenuItem onClick={() => logout()}>
              <LogOut />
              Log out
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </SidebarFooter>
    </Sidebar>
  );
}

function SidebarHeaderContent() {
  const { state, toggleSidebar, isMobile } = useSidebar();
  const isCollapsed = !isMobile && state === 'collapsed';

  if (isCollapsed) {
    return (
      <button
        type="button"
        onClick={toggleSidebar}
        aria-label="Expand sidebar"
        className="group/logo relative size-8 mx-auto cursor-pointer"
      >
        <Image
          src="/chat-app-logo.svg"
          alt="ChatGPT Clone"
          width={32}
          height={32}
          className="size-8 transition-opacity group-hover/logo:opacity-0"
        />
        <Image
          src="/sidebar-icon.svg"
          alt="Sidebar Icon"
          width={24}
          height={24}
          className="size-6 absolute inset-0 m-auto opacity-0 transition-opacity group-hover/logo:opacity-100"
        />
      </button>
    );
  }

  return (
    <div className="flex items-center justify-between">
      <Image
        src="/chat-app-logo.svg"
        alt="ChatGPT Clone"
        width={32}
        height={32}
        className="size-8"
      />
      <button
        type="button"
        onClick={toggleSidebar}
        aria-label="Collapse sidebar"
        className="size-8 flex items-center justify-center rounded-md hover:bg-sidebar-accent"
      >
        <Image
          src="/sidebar-icon.svg"
          alt="Sidebar Icon"
          width={26}
          height={26}
        />
      </button>
    </div>
  );
}
