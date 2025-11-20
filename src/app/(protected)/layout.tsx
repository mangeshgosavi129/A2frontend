import React from "react";
import { SidebarProvider, SidebarInset, SidebarTrigger } from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/AppSidebar";
import ProtectedRoute from "@/components/ProtectedRoute";
import { Separator } from "@/components/ui/separator";
import { Bell } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

export default function ProtectedLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <ProtectedRoute>
      <SidebarProvider>
        <AppSidebar />
        <SidebarInset className="bg-black">
          <header className="flex h-16 shrink-0 items-center gap-2 border-b border-white/10 px-4 bg-zinc-950/50 backdrop-blur-sm sticky top-0 z-10">
            <SidebarTrigger className="-ml-1 text-zinc-400 hover:text-white" />
            <Separator orientation="vertical" className="mr-2 h-4 bg-zinc-800" />
            <div className="flex-1" />
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="icon" className="text-zinc-400 hover:text-white">
                  <Bell className="h-5 w-5" />
                  <span className="sr-only">Notifications</span>
                  <div className="absolute top-3 right-3 h-2 w-2 rounded-full bg-red-500 border border-zinc-950" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-80 bg-zinc-950 border-zinc-800 text-zinc-200">
                <DropdownMenuLabel>Notifications</DropdownMenuLabel>
                <DropdownMenuSeparator className="bg-zinc-800" />
                <DropdownMenuItem className="focus:bg-zinc-900 focus:text-zinc-100 cursor-pointer flex flex-col items-start gap-1 py-3">
                    <span className="font-medium text-sm">New Task Assigned</span>
                    <span className="text-xs text-zinc-500">You have been assigned to "Homepage Redesign"</span>
                </DropdownMenuItem>
                <DropdownMenuItem className="focus:bg-zinc-900 focus:text-zinc-100 cursor-pointer flex flex-col items-start gap-1 py-3">
                    <span className="font-medium text-sm">Project Deadline</span>
                    <span className="text-xs text-zinc-500">"Q3 Budget Review" is due tomorrow</span>
                </DropdownMenuItem>
                <DropdownMenuSeparator className="bg-zinc-800" />
                <DropdownMenuItem className="w-full text-center text-xs text-zinc-500 justify-center py-2">
                    View all notifications
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </header>
          <div className="flex flex-1 flex-col gap-4 p-4 pt-0">
            {children}
          </div>
        </SidebarInset>
      </SidebarProvider>
    </ProtectedRoute>
  );
}