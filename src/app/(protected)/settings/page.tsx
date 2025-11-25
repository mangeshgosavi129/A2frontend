"use client";

import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { toast } from "sonner";
import {
    Settings as SettingsIcon,
    Bell,
    Lock,
    Activity,
    Globe,
    CreditCard,
    History,
    Shield,
    Key,
    Smartphone,
    CreditCard as CreditCardIcon,
    Receipt,
    AlertCircle
} from "lucide-react";
import { format } from "date-fns";
import { messageApi } from "@/lib/api";
import { Message } from "@/lib/types";

export default function SettingsPage() {
    const [loading, setLoading] = useState(false);
    const [activityLogs, setActivityLogs] = useState<Message[]>([]);
    const [loadingLogs, setLoadingLogs] = useState(false);

    useEffect(() => {
        fetchActivityLogs();
    }, []);

    const fetchActivityLogs = async () => {
        try {
            setLoadingLogs(true);
            const res = await messageApi.getAll({ channel: 'system' });
            setActivityLogs(res.data);
        } catch (error) {
            console.error("Failed to fetch activity logs", error);
        } finally {
            setLoadingLogs(false);
        }
    };

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

            <Alert className="bg-yellow-500/10 border-yellow-500/20 text-yellow-200">
                <AlertCircle className="h-4 w-4" />
                <AlertTitle>Work in Progress</AlertTitle>
                <AlertDescription>
                    This settings page is currently under development. Some features may not be fully functional and will be available in future updates.
                </AlertDescription>
            </Alert>

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

                    <TabsContent value="security" className="mt-0 space-y-6">
                        <Card className="bg-zinc-950/50 border-zinc-900">
                            <CardHeader>
                                <CardTitle className="text-zinc-200">Password & Authentication</CardTitle>
                                <CardDescription className="text-zinc-500">Manage your account security</CardDescription>
                            </CardHeader>
                            <CardContent className="space-y-6">
                                <div className="space-y-4">
                                    <div className="flex items-center justify-between">
                                        <div className="flex items-center gap-3">
                                            <div className="p-2 rounded-full bg-zinc-900 border border-zinc-800">
                                                <Key className="h-4 w-4 text-zinc-400" />
                                            </div>
                                            <div>
                                                <p className="text-sm font-medium text-zinc-200">Change Password</p>
                                                <p className="text-xs text-zinc-500">Last changed 3 months ago</p>
                                            </div>
                                        </div>
                                        <Button variant="outline" size="sm" className="border-zinc-800 text-zinc-300 hover:text-white hover:bg-zinc-900">
                                            Update
                                        </Button>
                                    </div>
                                    <Separator className="bg-zinc-900" />
                                    <div className="flex items-center justify-between">
                                        <div className="flex items-center gap-3">
                                            <div className="p-2 rounded-full bg-zinc-900 border border-zinc-800">
                                                <Smartphone className="h-4 w-4 text-zinc-400" />
                                            </div>
                                            <div>
                                                <p className="text-sm font-medium text-zinc-200">Two-Factor Authentication</p>
                                                <p className="text-xs text-zinc-500">Add an extra layer of security</p>
                                            </div>
                                        </div>
                                        <Switch />
                                    </div>
                                </div>
                            </CardContent>
                        </Card>

                        <Card className="bg-zinc-950/50 border-zinc-900">
                            <CardHeader>
                                <CardTitle className="text-zinc-200">Active Sessions</CardTitle>
                                <CardDescription className="text-zinc-500">Manage devices logged into your account</CardDescription>
                            </CardHeader>
                            <CardContent>
                                <div className="flex items-center justify-between p-3 rounded-md bg-zinc-900/50 border border-zinc-800">
                                    <div className="flex items-center gap-3">
                                        <div className="h-8 w-8 rounded bg-green-500/10 flex items-center justify-center">
                                            <Shield className="h-4 w-4 text-green-500" />
                                        </div>
                                        <div>
                                            <p className="text-sm font-medium text-zinc-200">MacBook Pro (Current)</p>
                                            <p className="text-xs text-zinc-500">San Francisco, US · Chrome</p>
                                        </div>
                                    </div>
                                    <Button variant="ghost" size="sm" className="text-red-400 hover:text-red-300 hover:bg-red-950/30">
                                        Log out
                                    </Button>
                                </div>
                            </CardContent>
                        </Card>
                    </TabsContent>

                    <TabsContent value="billing" className="mt-0 space-y-6">
                        <Card className="bg-zinc-950/50 border-zinc-900">
                            <CardHeader>
                                <CardTitle className="text-zinc-200">Current Plan</CardTitle>
                                <CardDescription className="text-zinc-500">You are on the Pro Plan</CardDescription>
                            </CardHeader>
                            <CardContent className="space-y-6">
                                <div className="flex items-center justify-between p-4 rounded-lg bg-gradient-to-r from-indigo-900/20 to-purple-900/20 border border-indigo-500/20">
                                    <div>
                                        <p className="text-lg font-semibold text-indigo-300">Pro Plan</p>
                                        <p className="text-sm text-zinc-400">$29/month per user</p>
                                    </div>
                                    <Button className="bg-indigo-600 hover:bg-indigo-700 text-white">
                                        Manage Plan
                                    </Button>
                                </div>
                                <div className="space-y-2">
                                    <div className="flex justify-between text-sm">
                                        <span className="text-zinc-400">Seats Used</span>
                                        <span className="text-zinc-200">4 / 10</span>
                                    </div>
                                    <div className="h-2 w-full bg-zinc-900 rounded-full overflow-hidden">
                                        <div className="h-full bg-indigo-500 w-[40%]" />
                                    </div>
                                </div>
                            </CardContent>
                        </Card>

                        <Card className="bg-zinc-950/50 border-zinc-900">
                            <CardHeader>
                                <CardTitle className="text-zinc-200">Payment Method</CardTitle>
                                <CardDescription className="text-zinc-500">Manage your payment details</CardDescription>
                            </CardHeader>
                            <CardContent>
                                <div className="flex items-center justify-between">
                                    <div className="flex items-center gap-3">
                                        <div className="p-2 rounded bg-zinc-900 border border-zinc-800">
                                            <CreditCardIcon className="h-4 w-4 text-zinc-400" />
                                        </div>
                                        <div>
                                            <p className="text-sm font-medium text-zinc-200">Visa ending in 4242</p>
                                            <p className="text-xs text-zinc-500">Expires 12/24</p>
                                        </div>
                                    </div>
                                    <Button variant="outline" size="sm" className="border-zinc-800 text-zinc-300 hover:text-white hover:bg-zinc-900">
                                        Edit
                                    </Button>
                                </div>
                            </CardContent>
                        </Card>

                        <Card className="bg-zinc-950/50 border-zinc-900">
                            <CardHeader>
                                <CardTitle className="text-zinc-200">Billing History</CardTitle>
                                <CardDescription className="text-zinc-500">View past invoices</CardDescription>
                            </CardHeader>
                            <CardContent>
                                <div className="space-y-1">
                                    {[1, 2, 3].map((i) => (
                                        <div key={i} className="flex items-center justify-between p-3 hover:bg-zinc-900/50 rounded-md transition-colors">
                                            <div className="flex items-center gap-3">
                                                <Receipt className="h-4 w-4 text-zinc-500" />
                                                <div>
                                                    <p className="text-sm font-medium text-zinc-300">Invoice #{1000 + i}</p>
                                                    <p className="text-xs text-zinc-500">Oct {i}, 2023</p>
                                                </div>
                                            </div>
                                            <div className="flex items-center gap-4">
                                                <span className="text-sm text-zinc-300">$29.00</span>
                                                <Button variant="ghost" size="sm" className="h-8 w-8 p-0 text-zinc-500 hover:text-zinc-300">
                                                    <Download className="h-4 w-4" />
                                                </Button>
                                            </div>
                                        </div>
                                    ))}
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
                                    {loadingLogs ? (
                                        <div className="flex items-center justify-center h-full">
                                            <div className="h-6 w-6 animate-spin rounded-full border-2 border-primary border-t-transparent" />
                                        </div>
                                    ) : activityLogs.length > 0 ? (
                                        <div className="divide-y divide-zinc-900">
                                            {activityLogs.map((log) => (
                                                <div key={log.id} className="flex items-center gap-4 p-4 hover:bg-zinc-900/30 transition-colors">
                                                    <div className="p-2 rounded-full bg-zinc-900 border border-zinc-800">
                                                        <History className="h-4 w-4 text-zinc-400" />
                                                    </div>
                                                    <div className="flex-1">
                                                        <p className="text-sm text-zinc-300">
                                                            {log.message_text || "System Activity"}
                                                        </p>
                                                        <p className="text-xs text-zinc-500">
                                                            {format(new Date(log.created_at), "MMM d, yyyy 'at' h:mm a")}
                                                        </p>
                                                    </div>
                                                </div>
                                            ))}
                                        </div>
                                    ) : (
                                        <div className="flex flex-col items-center justify-center h-full text-zinc-500">
                                            <Activity className="h-8 w-8 mb-2 opacity-50" />
                                            <p>No activity logs found</p>
                                        </div>
                                    )}
                                </ScrollArea>
                            </CardContent>
                        </Card>
                    </TabsContent>
                </div>
            </Tabs>
        </div>
    );
}

function Download(props: any) {
    return (
        <svg
            {...props}
            xmlns="http://www.w3.org/2000/svg"
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
        >
            <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
            <polyline points="7 10 12 15 17 10" />
            <line x1="12" x2="12" y1="15" y2="3" />
        </svg>
    )
}
