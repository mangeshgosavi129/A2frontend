"use client";

import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { toast } from "sonner";
import {
    Settings as SettingsIcon,
    Bell,
    Lock,
    Activity,
    Globe,
    CreditCard,
    History
} from "lucide-react";
import { format } from "date-fns";

// Mock Activity Log
const ACTIVITY_LOGS = [
    { id: 1, user: "John Doe", action: "created task", target: "Q3 Budget Review", time: new Date(Date.now() - 1000 * 60 * 5) },
    { id: 2, user: "Jane Smith", action: "updated status", target: "Homepage Redesign", time: new Date(Date.now() - 1000 * 60 * 30) },
    { id: 3, user: "Admin", action: "changed permissions", target: "Guest Role", time: new Date(Date.now() - 1000 * 60 * 60 * 2) },
    { id: 4, user: "System", action: "backup created", target: "Database", time: new Date(Date.now() - 1000 * 60 * 60 * 24) },
    { id: 5, user: "John Doe", action: "deleted client", target: "Old Client Co", time: new Date(Date.now() - 1000 * 60 * 60 * 26) },
];

export default function SettingsPage() {
    const [loading, setLoading] = useState(false);

    const handleSave = (section: string) => {
        setLoading(true);
        setTimeout(() => {
            setLoading(false);
            toast.success(`${section} settings saved`);
        }, 1000);
    };

    return (
        <div className="flex flex-col h-full gap-6">
            <div>
                <h1 className="text-2xl font-bold text-zinc-100">Settings</h1>
                <p className="text-sm text-zinc-500">Manage your organization and preferences</p>
            </div>

            <Tabs defaultValue="general" className="flex-1 flex flex-col lg:flex-row gap-6 items-start">
                <TabsList className="flex flex-col w-full lg:w-64 h-auto bg-zinc-950/50 border border-zinc-900 p-2 gap-1 items-stretch">
                    <TabsTrigger value="general" className="justify-start gap-2 data-[state=active]:bg-zinc-900 data-[state=active]:text-white">
                        <SettingsIcon className="h-4 w-4" /> General
                    </TabsTrigger>
                    <TabsTrigger value="notifications" className="justify-start gap-2 data-[state=active]:bg-zinc-900 data-[state=active]:text-white">
                        <Bell className="h-4 w-4" /> Notifications
                    </TabsTrigger>
                    <TabsTrigger value="security" className="justify-start gap-2 data-[state=active]:bg-zinc-900 data-[state=active]:text-white">
                        <Lock className="h-4 w-4" /> Security
                    </TabsTrigger>
                    <TabsTrigger value="billing" className="justify-start gap-2 data-[state=active]:bg-zinc-900 data-[state=active]:text-white">
                        <CreditCard className="h-4 w-4" /> Billing
                    </TabsTrigger>
                    <TabsTrigger value="activity" className="justify-start gap-2 data-[state=active]:bg-zinc-900 data-[state=active]:text-white">
                        <Activity className="h-4 w-4" /> Activity Log
                    </TabsTrigger>
                </TabsList>

                <div className="flex-1 w-full min-w-0">
                    <TabsContent value="general" className="mt-0 space-y-6">
                        <Card className="bg-zinc-950/50 border-zinc-900">
                            <CardHeader>
                                <CardTitle className="text-zinc-200">Organization Profile</CardTitle>
                                <CardDescription className="text-zinc-500">Basic details about your workspace</CardDescription>
                            </CardHeader>
                            <CardContent className="space-y-4">
                                <div className="space-y-2">
                                    <Label className="text-zinc-300">Organization Name</Label>
                                    <Input defaultValue="Acme Corp" className="bg-zinc-900 border-zinc-800 text-zinc-200" />
                                </div>
                                <div className="space-y-2">
                                    <Label className="text-zinc-300">Workspace URL</Label>
                                    <div className="flex">
                                        <span className="flex items-center px-3 border border-r-0 border-zinc-800 bg-zinc-900 text-zinc-500 rounded-l-md text-sm">
                                            taskmaster.app/
                                        </span>
                                        <Input defaultValue="acme-corp" className="rounded-l-none bg-zinc-900 border-zinc-800 text-zinc-200" />
                                    </div>
                                </div>
                                <div className="pt-4 flex justify-end">
                                    <Button onClick={() => handleSave("Organization")} disabled={loading}>
                                        Save Changes
                                    </Button>
                                </div>
                            </CardContent>
                        </Card>

                         <Card className="bg-zinc-950/50 border-zinc-900">
                            <CardHeader>
                                <CardTitle className="text-zinc-200">Regional Settings</CardTitle>
                                <CardDescription className="text-zinc-500">Date, time, and language preferences</CardDescription>
                            </CardHeader>
                            <CardContent className="space-y-4">
                                <div className="grid grid-cols-2 gap-4">
                                    <div className="space-y-2">
                                        <Label className="text-zinc-300">Language</Label>
                                        <Input defaultValue="English (US)" className="bg-zinc-900 border-zinc-800 text-zinc-200" />
                                    </div>
                                    <div className="space-y-2">
                                        <Label className="text-zinc-300">Timezone</Label>
                                        <Input defaultValue="UTC-05:00 (Eastern Time)" className="bg-zinc-900 border-zinc-800 text-zinc-200" />
                                    </div>
                                </div>
                            </CardContent>
                        </Card>
                    </TabsContent>

                    <TabsContent value="notifications" className="mt-0">
                         <Card className="bg-zinc-950/50 border-zinc-900">
                            <CardHeader>
                                <CardTitle className="text-zinc-200">Email Notifications</CardTitle>
                                <CardDescription className="text-zinc-500">Configure when you receive emails</CardDescription>
                            </CardHeader>
                            <CardContent className="space-y-6">
                                <div className="flex items-center justify-between">
                                    <div className="space-y-0.5">
                                        <Label className="text-zinc-200">Task Assignments</Label>
                                        <p className="text-sm text-zinc-500">Receive an email when you are assigned a task</p>
                                    </div>
                                    <Switch defaultChecked />
                                </div>
                                <Separator className="bg-zinc-900" />
                                <div className="flex items-center justify-between">
                                    <div className="space-y-0.5">
                                        <Label className="text-zinc-200">Task Updates</Label>
                                        <p className="text-sm text-zinc-500">Receive an email when a task you follow changes status</p>
                                    </div>
                                    <Switch defaultChecked />
                                </div>
                                <Separator className="bg-zinc-900" />
                                <div className="flex items-center justify-between">
                                    <div className="space-y-0.5">
                                        <Label className="text-zinc-200">Daily Digest</Label>
                                        <p className="text-sm text-zinc-500">A daily summary of your tasks and deadlines</p>
                                    </div>
                                    <Switch />
                                </div>
                            </CardContent>
                        </Card>
                    </TabsContent>

                    <TabsContent value="activity" className="mt-0">
                        <Card className="bg-zinc-950/50 border-zinc-900 h-[600px] flex flex-col">
                            <CardHeader>
                                <CardTitle className="text-zinc-200">Activity Log</CardTitle>
                                <CardDescription className="text-zinc-500">Recent actions across your organization</CardDescription>
                            </CardHeader>
                            <CardContent className="flex-1 p-0">
                                <ScrollArea className="h-full">
                                    <div className="divide-y divide-zinc-900">
                                        {ACTIVITY_LOGS.map((log) => (
                                            <div key={log.id} className="flex items-center gap-4 p-4 hover:bg-zinc-900/30 transition-colors">
                                                <div className="p-2 rounded-full bg-zinc-900 border border-zinc-800">
                                                    <History className="h-4 w-4 text-zinc-400" />
                                                </div>
                                                <div className="flex-1">
                                                    <p className="text-sm text-zinc-300">
                                                        <span className="font-semibold text-zinc-100">{log.user}</span>{" "}
                                                        {log.action}{" "}
                                                        <span className="font-medium text-indigo-300">{log.target}</span>
                                                    </p>
                                                    <p className="text-xs text-zinc-500">
                                                        {format(log.time, "MMM d, yyyy 'at' h:mm a")}
                                                    </p>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </ScrollArea>
                            </CardContent>
                        </Card>
                    </TabsContent>
                </div>
            </Tabs>
        </div>
    );
}
