"use client";

import React, { useState, useEffect } from "react";
import { userApi } from "@/lib/api";
import { User } from "@/lib/types";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Search, Mail, Phone, Building, MoreHorizontal, Loader2 } from "lucide-react";
import { toast } from "sonner";
import { format } from "date-fns";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

export default function UsersPage() {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [isDetailOpen, setIsDetailOpen] = useState(false);

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    setLoading(true);
    try {
      const res = await userApi.getAll();
      setUsers(res.data);
    } catch (error) {
      toast.error("Failed to load users");
    } finally {
      setLoading(false);
    }
  };

  const filteredUsers = users.filter(u => 
    u.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
    u.department?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleUserClick = (user: User) => {
    setSelectedUser(user);
    setIsDetailOpen(true);
  };

  return (
    <div className="flex flex-col h-full gap-4">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-zinc-100">Team Members</h1>
          <p className="text-sm text-zinc-500">Manage your organization's users</p>
        </div>
        <Button variant="outline" className="border-zinc-800 text-zinc-300 hover:bg-zinc-900">
          Invite User
        </Button>
      </div>

      <div className="relative">
        <Search className="absolute left-3 top-2.5 h-4 w-4 text-zinc-500" />
        <Input 
          placeholder="Search users..." 
          className="pl-9 bg-zinc-900 border-zinc-800 text-zinc-200 placeholder:text-zinc-600 w-full md:w-[300px]"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />
      </div>

      {loading ? (
        <div className="flex-1 flex items-center justify-center">
            <Loader2 className="h-8 w-8 animate-spin text-zinc-500" />
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
            {filteredUsers.map((user) => (
                <Card 
                    key={user.id} 
                    className="bg-zinc-900/50 border-zinc-800 hover:border-zinc-700 transition-colors cursor-pointer group"
                    onClick={() => handleUserClick(user)}
                >
                    <CardHeader className="flex flex-row items-center gap-4 pb-2">
                        <Avatar className="h-12 w-12 border border-zinc-800">
                            <AvatarImage src={`https://avatar.vercel.sh/${user.name}.png`} />
                            <AvatarFallback className="bg-zinc-950 text-zinc-400">
                                {user.name.substring(0, 2).toUpperCase()}
                            </AvatarFallback>
                        </Avatar>
                        <div className="flex-1 overflow-hidden">
                            <CardTitle className="text-base font-medium text-zinc-100 truncate">{user.name}</CardTitle>
                            <CardDescription className="text-xs text-zinc-500 truncate">
                                {user.department || "No Department"}
                            </CardDescription>
                        </div>
                        <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                                <Button variant="ghost" size="icon" className="h-8 w-8 text-zinc-500 hover:text-zinc-300 opacity-0 group-hover:opacity-100 transition-opacity">
                                    <MoreHorizontal className="h-4 w-4" />
                                </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end" className="bg-zinc-950 border-zinc-800">
                                <DropdownMenuItem className="text-zinc-300 focus:bg-zinc-900 focus:text-zinc-100">View Profile</DropdownMenuItem>
                                <DropdownMenuItem className="text-zinc-300 focus:bg-zinc-900 focus:text-zinc-100">Edit Details</DropdownMenuItem>
                                <DropdownMenuSeparator className="bg-zinc-800" />
                                <DropdownMenuItem className="text-red-400 focus:bg-red-500/10 focus:text-red-300">Remove User</DropdownMenuItem>
                            </DropdownMenuContent>
                        </DropdownMenu>
                    </CardHeader>
                    <CardContent className="pt-2">
                        <div className="space-y-2 text-sm">
                            <div className="flex items-center gap-2 text-zinc-400">
                                <Phone className="h-3.5 w-3.5" />
                                <span className="truncate">{user.phone}</span>
                            </div>
                            <div className="flex items-center gap-2 text-zinc-400">
                                <Building className="h-3.5 w-3.5" />
                                <span className="truncate">{user.department || "General"}</span>
                            </div>
                            <div className="pt-2 flex gap-2">
                                <Badge variant="secondary" className="bg-zinc-800 text-zinc-400 hover:bg-zinc-800">Member</Badge>
                                <Badge variant="outline" className="border-zinc-800 text-zinc-500">
                                    Joined {format(new Date(user.created_at), "MMM yyyy")}
                                </Badge>
                            </div>
                        </div>
                    </CardContent>
                </Card>
            ))}
        </div>
      )}

      <Dialog open={isDetailOpen} onOpenChange={setIsDetailOpen}>
        <DialogContent className="bg-zinc-950 border-zinc-800 text-zinc-100 sm:max-w-[425px]">
            <DialogHeader>
                <DialogTitle>User Profile</DialogTitle>
                <DialogDescription className="text-zinc-500">Detailed view of team member</DialogDescription>
            </DialogHeader>
            {selectedUser && (
                <div className="flex flex-col items-center gap-4 py-4">
                    <Avatar className="h-24 w-24 border-2 border-zinc-800">
                        <AvatarImage src={`https://avatar.vercel.sh/${selectedUser.name}.png`} />
                        <AvatarFallback className="bg-zinc-900 text-zinc-400 text-xl">
                            {selectedUser.name.substring(0, 2).toUpperCase()}
                        </AvatarFallback>
                    </Avatar>
                    <div className="text-center space-y-1">
                        <h3 className="text-xl font-bold text-zinc-100">{selectedUser.name}</h3>
                        <p className="text-zinc-400">{selectedUser.department || "Team Member"}</p>
                    </div>
                    
                    <div className="w-full grid grid-cols-2 gap-4 mt-4">
                        <div className="p-3 rounded-lg bg-zinc-900/50 border border-zinc-800 text-center">
                            <div className="text-xs text-zinc-500 uppercase tracking-wider mb-1">Tasks</div>
                            <div className="text-2xl font-bold text-zinc-200">12</div>
                        </div>
                         <div className="p-3 rounded-lg bg-zinc-900/50 border border-zinc-800 text-center">
                            <div className="text-xs text-zinc-500 uppercase tracking-wider mb-1">Role</div>
                            <div className="text-sm font-bold text-zinc-200 pt-1.5">Admin</div>
                        </div>
                    </div>

                    <div className="w-full space-y-3 mt-2">
                        <div className="flex items-center justify-between p-3 rounded-lg border border-zinc-800 bg-zinc-900/30">
                            <div className="flex items-center gap-3">
                                <Phone className="h-4 w-4 text-zinc-400" />
                                <span className="text-sm text-zinc-300">{selectedUser.phone}</span>
                            </div>
                        </div>
                         <div className="flex items-center justify-between p-3 rounded-lg border border-zinc-800 bg-zinc-900/30">
                            <div className="flex items-center gap-3">
                                <Building className="h-4 w-4 text-zinc-400" />
                                <span className="text-sm text-zinc-300">{selectedUser.department || "No Department"}</span>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
