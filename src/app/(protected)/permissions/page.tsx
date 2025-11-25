"use client";

import React, { useState } from "react";
import { Switch } from "@/components/ui/switch";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";
import { Shield, Lock, Users, Eye, Edit, Trash, AlertCircle } from "lucide-react";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { toast } from "sonner";

// Mock Roles
const ROLES = [
    { id: "admin", name: "Administrator", description: "Full access to all resources" },
    { id: "manager", name: "Manager", description: "Can manage users and tasks" },
    { id: "member", name: "Team Member", description: "Can view and edit assigned tasks" },
    { id: "guest", name: "Guest", description: "Read-only access" },
];

// Mock Permissions
const PERMISSIONS_DATA = [
    {
        category: "Tasks", items: [
            { id: "task_view", label: "View Tasks", roles: ["admin", "manager", "member", "guest"] },
            { id: "task_create", label: "Create Tasks", roles: ["admin", "manager", "member"] },
            { id: "task_edit", label: "Edit Tasks", roles: ["admin", "manager", "member"] },
            { id: "task_delete", label: "Delete Tasks", roles: ["admin", "manager"] },
        ]
    },
    {
        category: "Users", items: [
            { id: "user_view", label: "View Users", roles: ["admin", "manager", "member"] },
            { id: "user_invite", label: "Invite Users", roles: ["admin", "manager"] },
            { id: "user_manage", label: "Manage Roles", roles: ["admin"] },
        ]
    },
    {
        category: "Settings", items: [
            { id: "settings_view", label: "View Settings", roles: ["admin", "manager"] },
            { id: "settings_edit", label: "Edit Organization Settings", roles: ["admin"] },
        ]
    },
];

export default function PermissionsPage() {
    const [activeRole, setActiveRole] = useState("admin");
    const [permissions, setPermissions] = useState(PERMISSIONS_DATA);
    const [hasChanges, setHasChanges] = useState(false);

    const handleToggle = (permId: string) => {
        setHasChanges(true);
        setPermissions(prev => prev.map(cat => ({
            ...cat,
            items: cat.items.map(item => {
                if (item.id === permId) {
                    const hasRole = item.roles.includes(activeRole);
                    const newRoles = hasRole
                        ? item.roles.filter(r => r !== activeRole)
                        : [...item.roles, activeRole];
                    return { ...item, roles: newRoles };
                }
                return item;
            })
        })));
    };

    const handleSave = () => {
        setHasChanges(false);
        toast.success("Permissions updated successfully");
    };

    return (
        <div className="flex flex-col h-full gap-6">
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-2xl font-bold text-zinc-100">Permissions</h1>
                    <p className="text-sm text-zinc-500">Manage role-based access control</p>
                </div>
                {hasChanges && (
                    <Button onClick={handleSave} className="bg-primary text-primary-foreground">
                        Save Changes
                    </Button>
                )}
            </div>

            <Alert className="bg-yellow-500/10 border-yellow-500/20 text-yellow-200">
                <AlertCircle className="h-4 w-4" />
                <AlertTitle>Note</AlertTitle>
                <AlertDescription>
                    Currently all users have full permissions. Role-based access control will be implemented in a future update.
                </AlertDescription>
            </Alert>

            <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
                {/* Role Selection Sidebar */}
                <Card className="col-span-1 bg-zinc-950/50 border-zinc-900 h-fit">
                    <CardHeader>
                        <CardTitle className="text-zinc-200">Roles</CardTitle>
                        <CardDescription className="text-zinc-500">Select a role to configure</CardDescription>
                    </CardHeader>
                    <CardContent className="p-2">
                        <div className="flex flex-col gap-1">
                            {ROLES.map(role => (
                                <button
                                    key={role.id}
                                    onClick={() => setActiveRole(role.id)}
                                    className={`flex flex-col items-start p-3 rounded-lg text-left transition-colors ${activeRole === role.id
                                            ? "bg-zinc-800 border border-zinc-700"
                                            : "hover:bg-zinc-900 border border-transparent"
                                        }`}
                                >
                                    <span className={`font-medium ${activeRole === role.id ? "text-white" : "text-zinc-400"}`}>
                                        {role.name}
                                    </span>
                                    <span className="text-xs text-zinc-500 mt-1">{role.description}</span>
                                </button>
                            ))}
                        </div>
                        <Separator className="my-4 bg-zinc-900" />
                        <Button variant="outline" className="w-full border-zinc-800 text-zinc-400 hover:text-zinc-200 hover:bg-zinc-900">
                            Create Custom Role
                        </Button>
                    </CardContent>
                </Card>

                {/* Permission Configuration Area */}
                <Card className="col-span-1 lg:col-span-3 bg-zinc-950/50 border-zinc-900">
                    <CardHeader className="border-b border-zinc-900 pb-4">
                        <div className="flex items-center gap-3">
                            <div className="p-2 rounded-lg bg-zinc-900 border border-zinc-800">
                                <Shield className="h-5 w-5 text-indigo-400" />
                            </div>
                            <div>
                                <CardTitle className="text-zinc-100">
                                    {ROLES.find(r => r.id === activeRole)?.name} Permissions
                                </CardTitle>
                                <CardDescription className="text-zinc-500">
                                    Manage what {ROLES.find(r => r.id === activeRole)?.name}s can do
                                </CardDescription>
                            </div>
                        </div>
                    </CardHeader>
                    <CardContent className="pt-6">
                        <div className="space-y-8">
                            {permissions.map((category) => (
                                <div key={category.category} className="space-y-4">
                                    <h3 className="text-sm font-semibold text-zinc-400 uppercase tracking-wider">
                                        {category.category}
                                    </h3>
                                    <div className="grid gap-4">
                                        {category.items.map((perm) => (
                                            <div key={perm.id} className="flex items-center justify-between p-4 rounded-lg border border-zinc-900 bg-zinc-900/30">
                                                <div className="flex items-center gap-3">
                                                    {perm.id.includes("view") && <Eye className="h-4 w-4 text-zinc-500" />}
                                                    {perm.id.includes("edit") && <Edit className="h-4 w-4 text-zinc-500" />}
                                                    {perm.id.includes("create") && <Shield className="h-4 w-4 text-zinc-500" />}
                                                    {perm.id.includes("delete") && <Trash className="h-4 w-4 text-zinc-500" />}
                                                    <div className="flex flex-col">
                                                        <span className="text-sm font-medium text-zinc-200">{perm.label}</span>
                                                        <span className="text-xs text-zinc-500">Allow role to {perm.label.toLowerCase()}</span>
                                                    </div>
                                                </div>
                                                <Switch
                                                    checked={perm.roles.includes(activeRole)}
                                                    onCheckedChange={() => handleToggle(perm.id)}
                                                    className="data-[state=checked]:bg-indigo-500"
                                                />
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            ))}
                        </div>
                    </CardContent>
                </Card>
            </div>
        </div>
    );
}
