import type { ReactNode } from 'react';
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
} from 'lucide-react';
import Link from 'next/link';
import Image from 'next/image';

export default function DashboardLayout({ children }: { children: ReactNode }) {
  return (
    <SidebarProvider>
      <Sidebar>
        <SidebarHeader>
           <div className="flex items-center gap-2 p-2">
             <Image
              src="https://seeklogo.com/images/E/etsy-logo-68ADD687A5-seeklogo.com.png"
              width={32}
              height={32}
              alt="Etsy Logo"
              data-ai-hint="logo"
            />
            <h1 className="text-lg font-semibold">Etsy Analyzer</h1>
            <SidebarTrigger className="ml-auto" />
          </div>
        </SidebarHeader>
        <div className="flex flex-col justify-between h-full">
          <SidebarMenu>
            <SidebarMenuItem>
              <SidebarMenuButton asChild tooltip="Shop Analyzer">
                <Link href="/dashboard">
                  <Store />
                  <span>Shop Analyzer</span>
                </Link>
              </SidebarMenuButton>
            </SidebarMenuItem>
            <SidebarMenuItem>
              <SidebarMenuButton asChild tooltip="Keyword Research">
                <Link href="#">
                  <Search />
                  <span>Keyword Research</span>
                </Link>
              </SidebarMenuButton>
            </SidebarMenuItem>
            <SidebarMenuItem>
              <SidebarMenuButton asChild tooltip="Tag Generator">
                <Link href="#">
                  <Tag />
                  <span>Tag Generator</span>
                </Link>
              </SidebarMenuButton>
            </SidebarMenuItem>
            <SidebarMenuItem>
              <SidebarMenuButton asChild tooltip="Competitor Tracker">
                <Link href="#">
                  <Users />
                  <span>Competitor Tracker</span>
                </Link>
              </SidebarMenuButton>
            </SidebarMenuItem>
            <SidebarMenuItem>
              <SidebarMenuButton asChild tooltip="Niche Finder">
                <Link href="#">
                  <TrendingUp />
                  <span>Niche Finder</span>
                </Link>
              </SidebarMenuButton>
            </SidebarMenuItem>
          </SidebarMenu>
          <SidebarMenu>
             <SidebarMenuItem>
              <SidebarMenuButton asChild tooltip="Profile">
                <Link href="#">
                  <User />
                  <span>Your Profile</span>
                </Link>
              </SidebarMenuButton>
            </SidebarMenuItem>
            <SidebarMenuItem>
              <SidebarMenuButton asChild tooltip="Logout">
                <Link href="/">
                  <LogOut />
                  <span>Logout</span>
                </Link>
              </SidebarMenuButton>
            </SidebarMenuItem>
          </SidebarMenu>
        </div>
      </Sidebar>
      <SidebarInset>
        <main className="p-4 sm:p-6 lg:p-8">
          {children}
        </main>
      </SidebarInset>
    </SidebarProvider>
  );
}
