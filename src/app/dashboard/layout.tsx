import type { ReactNode } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import {
  Sidebar,
  SidebarProvider,
  SidebarTrigger,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
  SidebarInset,
  SidebarHeader,
} from '@/components/ui/sidebar';
import {
  Search,
  Tag,
  Users,
  TrendingUp,
  Store,
  LogOut,
  User,
  ClipboardList,
} from 'lucide-react';
import { cn } from '@/lib/utils';

export default function DashboardLayout({ children }: { children: ReactNode }) {
  return (
    <SidebarProvider>
      <Sidebar
        className="border-r border-border/20"
        variant="inset"
        collapsible="icon"
      >
        <div className="flex h-full flex-col justify-between p-2">
        <SidebarHeader>
           <div className="flex items-center gap-2 p-2">
             <Image
              src="https://seeklogo.com/images/E/etsy-logo-68ADD687A5-seeklogo.com.png"
              width={32}
              height={32}
              alt="Etsy Logo"
              data-ai-hint="logo"
              className="invert"
            />
            <h1 className="text-lg font-semibold group-data-[collapsible=icon]:hidden">Etsy Analyzer</h1>
            <SidebarTrigger className="ml-auto" />
          </div>
        </SidebarHeader>
        <div className="flex flex-col justify-between h-full">
          <SidebarMenu>
            <SidebarMenuItem>
              <Link href="/dashboard">
                <SidebarMenuButton tooltip="Shop Analyzer">
                    <Store />
                    <span className="group-data-[collapsible=icon]:hidden">Shop Analyzer</span>
                </SidebarMenuButton>
              </Link>
            </SidebarMenuItem>
            <SidebarMenuItem>
              <Link href="/dashboard/keyword-research">
                <SidebarMenuButton tooltip="Keyword Research">
                    <Search />
                    <span className="group-data-[collapsible=icon]:hidden">Keyword Research</span>
                </SidebarMenuButton>
              </Link>
            </SidebarMenuItem>
            <SidebarMenuItem>
              <Link href="/dashboard/tag-generator">
                <SidebarMenuButton tooltip="Tag Generator">
                    <Tag />
                    <span className="group-data-[collapsible=icon]:hidden">Tag Generator</span>
                </SidebarMenuButton>
              </Link>
            </SidebarMenuItem>
            <SidebarMenuItem>
              <Link href="/dashboard/competitor-tracker">
                <SidebarMenuButton tooltip="Bulk Shop Analyzer">
                    <ClipboardList />
                    <span className="group-data-[collapsible=icon]:hidden">Bulk Shop Analyzer</span>
                </SidebarMenuButton>
              </Link>
            </SidebarMenuItem>
            <SidebarMenuItem>
              <Link href="/dashboard/niche-finder">
                <SidebarMenuButton tooltip="Niche Finder">
                    <TrendingUp />
                    <span className="group-data-[collapsible=icon]:hidden">Niche Finder</span>
                </SidebarMenuButton>
              </Link>
            </SidebarMenuItem>
          </SidebarMenu>
          <SidebarMenu>
             <SidebarMenuItem>
                <Link href="#">
                    <SidebarMenuButton tooltip="Profile">
                    <User />
                    <span className="group-data-[collapsible=icon]:hidden">Your Profile</span>
                    </SidebarMenuButton>
                </Link>
            </SidebarMenuItem>
            <SidebarMenuItem>
                <Link href="/">
                    <SidebarMenuButton tooltip="Logout">
                    <LogOut />
                    <span className="group-data-[collapsible=icon]:hidden">Logout</span>
                    </SidebarMenuButton>
                </Link>
            </SidebarMenuItem>
          </SidebarMenu>
        </div>
        </div>
      </Sidebar>
      <SidebarInset>
        <main className="p-4 sm:p-6 lg:p-8">
          <div className="animate-in fade-in-50 slide-in-from-bottom-4 duration-500 ease-in-out">
            {children}
          </div>
        </main>
      </SidebarInset>
    </SidebarProvider>
  );
}