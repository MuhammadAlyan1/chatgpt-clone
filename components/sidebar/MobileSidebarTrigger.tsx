'use client';

import Image from 'next/image';
import { useSidebar } from '@/components/ui/sidebar';

export function MobileSidebarTrigger() {
  const { toggleSidebar, isMobile } = useSidebar();

  if (!isMobile) return null;

  return (
    <button
      type="button"
      onClick={toggleSidebar}
      aria-label="Open sidebar"
      className="md:hidden fixed top-4 left-4 z-30 size-9 flex items-center justify-center rounded-md bg-sidebar border border-sidebar-border hover:bg-sidebar-accent"
    >
      <Image src="/sidebar-icon.svg" alt="" width={20} height={20} />
    </button>
  );
}
