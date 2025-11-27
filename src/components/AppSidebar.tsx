"use client";

import {
  LayoutDashboard,
  CheckSquare,
  Users,
  Settings,
  Shield,
  UserCircle,
  Briefcase,
  LogOut,
  Bell,
} from "lucide-react";
import { usePathname } from "next/navigation";
import Link from "next/link";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarRail,
} from "@/components/ui/sidebar";
import { useAuth } from "@/context/AuthContext";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

export function AppSidebar({ borderWidth = "1px" }: { borderWidth?: string }) {
  const pathname = usePathname();
  const { user, logout } = useAuth();

  const items = [
    {
      title: "Dashboard",
      url: "/dashboard",
      icon: LayoutDashboard,
    },
    {
      title: "Tasks",
      url: "/tasks",
      icon: CheckSquare,
    },
    {
      title: "Clients",
      url: "/clients",
      icon: Briefcase,
    },
    {
      title: "Users",
      url: "/users",
      icon: Users,
    },
    // {
    //   title: "Permissions",
    //   url: "/permissions",
    //   icon: Shield,
    // },
    {
      title: "Settings",
      url: "/settings",
      icon: Settings,
    },
  ];

  return (
    <Sidebar collapsible="icon">
      <SidebarHeader className="border-b border-white/5 bg-zinc-950 py-4" style={{ borderBottomWidth: borderWidth }}>
        <div className="flex items-center gap-2 px-2">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary text-primary-foreground">
            <CheckSquare className="size-5" />
          </div>
          <span className="truncate font-bold text-white group-data-[collapsible=icon]:hidden">
            TaskMaster
          </span>
        </div>
      </SidebarHeader>
      <SidebarContent className="bg-zinc-950">
        <SidebarGroup>
          <SidebarGroupLabel className="text-zinc-500">Menu</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {items.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton
                    asChild
                    isActive={pathname === item.url}
                    tooltip={item.title}
                    className="text-zinc-400 hover:bg-white/10 hover:text-white data-[active=true]:bg-primary/20 data-[active=true]:text-primary"
                  >
                    <Link href={item.url}>
                      <item.icon />
                      <span>{item.title}</span>
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
      <SidebarFooter className="border-t border-white/5 bg-zinc-950 p-4" style={{ borderTopWidth: borderWidth }}>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton
              size="lg"
              className="data-[state=open]:bg-sidebar-accent data-[state=open]:text-sidebar-accent-foreground hover:bg-white/10"
            >
              <Avatar className="h-8 w-8 rounded-lg">
                <AvatarImage src={`https://avatar.vercel.sh/${user?.name || 'user'}.png`} alt={user?.name} />
                <AvatarFallback className="rounded-lg">
                  {user?.name?.slice(0, 2).toUpperCase() || "US"}
                </AvatarFallback>
              </Avatar>
              <div className="grid flex-1 text-left text-sm leading-tight group-data-[collapsible=icon]:hidden">
                <span className="truncate font-semibold text-white">
                  {user?.name || "User"}
                </span>
                <span className="truncate text-xs text-zinc-500">
                  {user?.department || "Department"}
                </span>
              </div>
              <LogOut
                onClick={logout}
                className="ml-auto size-4 text-zinc-500 hover:text-white group-data-[collapsible=icon]:hidden"
              />
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarFooter>
      <SidebarRail />
    </Sidebar>
  );
}
