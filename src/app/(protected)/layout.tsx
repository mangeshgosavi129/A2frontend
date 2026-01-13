"use client";

import React, { useEffect, useState } from "react";
import { SidebarProvider, SidebarInset, SidebarTrigger } from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/AppSidebar";
import ProtectedRoute from "@/components/ProtectedRoute";
import { Separator } from "@/components/ui/separator";
import { Bell, MessageCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { messageApi } from "@/lib/api";
import { Message } from "@/lib/types";
import { format } from "date-fns";
import { ScrollArea } from "@/components/ui/scroll-area";

export default function ProtectedLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [notifications, setNotifications] = useState<Message[]>([]);
  const [unreadCount, setUnreadCount] = useState(0);

  useEffect(() => {
    fetchNotifications();
  }, []);

  const fetchNotifications = async () => {
    try {
      const res = await messageApi.getAll({ direction: 'in', is_read: false });
      setNotifications(res.data);
      setUnreadCount(res.data.length);
    } catch (error) {
      console.error("Failed to fetch notifications", error);
    }
  };

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
                <Button variant="ghost" size="icon" className="text-zinc-400 hover:text-white relative">
                  <Bell className="h-5 w-5" />
                  <span className="sr-only">Notifications</span>
                  {unreadCount > 0 && (
                    <div className="absolute top-3 right-3 h-2 w-2 rounded-full bg-red-500 border border-zinc-950" />
                  )}
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-80 bg-zinc-950 border-zinc-800 text-zinc-200">
                <DropdownMenuLabel>Notifications</DropdownMenuLabel>
                <DropdownMenuSeparator className="bg-zinc-800" />
                <ScrollArea className="h-[300px]">
                  {notifications.length === 0 ? (
                    <div className="py-4 text-center text-sm text-zinc-500">
                      No new notifications
                    </div>
                  ) : (
                    notifications.map((notification) => (
                      <DropdownMenuItem key={notification.id} className="focus:bg-zinc-900 focus:text-zinc-100 cursor-pointer flex flex-col items-start gap-1 py-3 border-b border-zinc-900 last:border-0">
                        <span className="font-medium text-sm">{notification.message_text}</span>
                        <span className="text-xs text-zinc-500">{format(new Date(notification.created_at), "MMM d, h:mm a")}</span>
                      </DropdownMenuItem>
                    ))
                  )}
                </ScrollArea>
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
          <a
            href="https://wa.me/918208513150?text=hi"
            target="_blank"
            rel="noopener noreferrer"
            className="fixed bottom-6 right-6 z-50 flex h-12 w-12 items-center justify-center rounded-full bg-[#25D366] text-white shadow-xl hover:bg-[#22c35e] transition-all hover:scale-110 group"
            title="Chat on WhatsApp"
          >
            <MessageCircle className="h-6 w-6" />
            <span className="absolute right-full mr-3 px-2 py-1 rounded bg-zinc-900 border border-zinc-800 text-xs text-white whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none">
              Chat on WhatsApp
            </span>
          </a>
        </SidebarInset>
      </SidebarProvider>
    </ProtectedRoute>
  );
}