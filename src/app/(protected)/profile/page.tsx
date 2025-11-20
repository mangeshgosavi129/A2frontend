"use client";

import React from "react";
import { useAuth } from "@/context/AuthContext";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { LogOut, User, Mail, Phone, Building, Shield } from "lucide-react";
import { toast } from "sonner";

export default function ProfilePage() {
  const { user, logout } = useAuth();
  const [isEditing, setIsEditing] = React.useState(false);

  const handleSave = () => {
    // Placeholder for update logic
    setIsEditing(false);
    toast.success("Profile updated successfully");
  };

  if (!user) return null;

  return (
    <div className="flex flex-col items-center justify-center min-h-[80vh] w-full max-w-3xl mx-auto p-4">
        <Card className="w-full bg-zinc-950/50 border-zinc-900 shadow-lg">
            <CardHeader className="relative pb-0 mb-6">
                <div className="absolute -top-16 left-6">
                    <Avatar className="h-32 w-32 border-4 border-zinc-950 shadow-xl">
                        <AvatarImage src={`https://avatar.vercel.sh/${user.name}.png`} />
                        <AvatarFallback className="bg-zinc-900 text-zinc-300 text-3xl">
                            {user.name.substring(0, 2).toUpperCase()}
                        </AvatarFallback>
                    </Avatar>
                </div>
                <div className="flex justify-end pt-2">
                    <Button variant="destructive" onClick={logout} className="gap-2">
                        <LogOut className="h-4 w-4" />
                        Sign Out
                    </Button>
                </div>
                <div className="mt-12">
                    <CardTitle className="text-3xl font-bold text-zinc-100">{user.name}</CardTitle>
                    <CardDescription className="text-lg text-zinc-500 flex items-center gap-2 mt-1">
                        <Building className="h-4 w-4" />
                        {user.department || "Team Member"}
                    </CardDescription>
                </div>
            </CardHeader>
            <CardContent className="space-y-6 mt-6">
                <Separator className="bg-zinc-900" />
                
                <div className="grid gap-6 py-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="space-y-2">
                            <Label className="text-zinc-400 flex items-center gap-2">
                                <User className="h-3.5 w-3.5" />
                                Full Name
                            </Label>
                            <Input 
                                defaultValue={user.name} 
                                readOnly={!isEditing}
                                className="bg-zinc-900/50 border-zinc-800 text-zinc-200 focus-visible:ring-indigo-500"
                            />
                        </div>
                        <div className="space-y-2">
                            <Label className="text-zinc-400 flex items-center gap-2">
                                <Phone className="h-3.5 w-3.5" />
                                Phone Number
                            </Label>
                            <Input 
                                defaultValue={user.phone} 
                                readOnly={!isEditing}
                                className="bg-zinc-900/50 border-zinc-800 text-zinc-200 focus-visible:ring-indigo-500"
                            />
                        </div>
                        <div className="space-y-2">
                            <Label className="text-zinc-400 flex items-center gap-2">
                                <Building className="h-3.5 w-3.5" />
                                Department / Organization
                            </Label>
                            <Input 
                                defaultValue={user.department || ""} 
                                readOnly={!isEditing}
                                className="bg-zinc-900/50 border-zinc-800 text-zinc-200 focus-visible:ring-indigo-500"
                            />
                        </div>
                        <div className="space-y-2">
                            <Label className="text-zinc-400 flex items-center gap-2">
                                <Shield className="h-3.5 w-3.5" />
                                Role ID
                            </Label>
                            <Input 
                                defaultValue={`USR-${user.id}`} 
                                readOnly
                                className="bg-zinc-900/20 border-zinc-900 text-zinc-500 cursor-not-allowed"
                            />
                        </div>
                    </div>
                </div>

                <div className="rounded-lg bg-blue-500/5 border border-blue-500/10 p-4">
                    <h4 className="text-blue-400 font-medium mb-1 flex items-center gap-2">
                        <Shield className="h-4 w-4" />
                        Account Status: Active
                    </h4>
                    <p className="text-sm text-blue-500/70">
                        Your account is fully verified and has access to all member features. Member since {new Date(user.created_at).getFullYear()}.
                    </p>
                </div>
            </CardContent>
            <CardFooter className="flex justify-end border-t border-zinc-900 pt-6">
                {isEditing ? (
                    <div className="flex gap-2">
                        <Button variant="outline" onClick={() => setIsEditing(false)} className="border-zinc-800 text-zinc-300">
                            Cancel
                        </Button>
                        <Button onClick={handleSave}>
                            Save Changes
                        </Button>
                    </div>
                ) : (
                    <Button onClick={() => setIsEditing(true)} variant="outline" className="border-zinc-800 text-zinc-300 hover:bg-zinc-900 hover:text-white">
                        Edit Profile
                    </Button>
                )}
            </CardFooter>
        </Card>
    </div>
  );
}
