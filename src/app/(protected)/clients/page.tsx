"use client";

import React, { useState, useEffect } from "react";
import { clientApi, taskApi } from "@/lib/api";
import { Client, Task } from "@/lib/types";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog";
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import {
    Search,
    Plus,
    Phone,
    Briefcase,
    MoreHorizontal,
    Sparkles,
    Calendar,
    Loader2,
    Trash2
} from "lucide-react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import {
    Form,
    FormControl,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from "@/components/ui/form";
import { toast } from "sonner";
import { format } from "date-fns";

// Client Creation Schema
const clientSchema = z.object({
    name: z.string().min(2, "Name is required"),
    phone: z.string().optional(),
    project_name: z.string().optional(),
});

// --- Client Detail Modal ---
function ClientDetailModal({
    client,
    open,
    onOpenChange
}: {
    client: Client | null;
    open: boolean;
    onOpenChange: (open: boolean) => void;
}) {
    const [tasks, setTasks] = useState<Task[]>([]);
    const [loading, setLoading] = useState(false);
    const [aiSummary, setAiSummary] = useState<string | null>(null);
    const [isGeneratingSummary, setIsGeneratingSummary] = useState(false);

    useEffect(() => {
        if (client && open) {
            fetchClientTasks(client.id);
            setAiSummary(null);
        }
    }, [client, open]);

    const fetchClientTasks = async (clientId: number) => {
        setLoading(true);
        try {
            const res = await taskApi.getAll();
            // Filter client-side since API doesn't support filtering by client_id yet
            const clientTasks = res.data.filter(t => t.client_id === clientId);
            setTasks(clientTasks);
        } catch (error) {
            console.error("Failed to fetch client tasks");
        } finally {
            setLoading(false);
        }
    };

    const generateAiSummary = () => {
        setIsGeneratingSummary(true);
        setTimeout(() => {
            const completed = tasks.filter(t => t.status === 'completed').length;
            const inProgress = tasks.filter(t => t.status === 'in_progress').length;
            const overdue = tasks.filter(t => t.deadline && new Date(t.deadline) < new Date() && t.status !== 'completed').length;

            const summary = `Client ${client?.name} has ${tasks.length} total tasks. Progress is steady with ${completed} completed items and ${inProgress} currently active. ${overdue > 0 ? `Attention needed: ${overdue} tasks are overdue.` : "No immediate deadlines missed."} The project "${client?.project_name}" is moving forward effectively.`;

            setAiSummary(summary);
            setIsGeneratingSummary(false);
        }, 1500);
    };

    if (!client) return null;

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="max-w-[700px] bg-zinc-950 border-zinc-800 text-zinc-100">
                <DialogHeader>
                    <div className="flex items-center gap-3">
                        <Avatar className="h-10 w-10 border border-zinc-800">
                            <AvatarFallback className="bg-zinc-900 text-zinc-300">{client.name.substring(0, 2).toUpperCase()}</AvatarFallback>
                        </Avatar>
                        <div>
                            <DialogTitle className="text-xl">{client.name}</DialogTitle>
                            <DialogDescription className="text-zinc-500">{client.project_name || "No project"}</DialogDescription>
                        </div>
                    </div>
                </DialogHeader>

                <div className="grid grid-cols-2 gap-4 py-4">
                    <div className="p-3 rounded-lg bg-zinc-900/50 border border-zinc-800">
                        <div className="text-xs text-zinc-500 mb-1">Contact</div>
                        <div className="flex items-center gap-2 text-sm">
                            <Phone className="h-3.5 w-3.5 text-zinc-400" />
                            {client.phone || "N/A"}
                        </div>
                    </div>
                    <div className="p-3 rounded-lg bg-zinc-900/50 border border-zinc-800">
                        <div className="text-xs text-zinc-500 mb-1">Project</div>
                        <div className="flex items-center gap-2 text-sm">
                            <Briefcase className="h-3.5 w-3.5 text-zinc-400" />
                            {client.project_name || "N/A"}
                        </div>
                    </div>
                </div>

                <div className="space-y-4">
                    <div className="flex items-center justify-between">
                        <h3 className="font-medium text-zinc-200">Task Timeline</h3>
                        <Button
                            variant="outline"
                            size="sm"
                            className="gap-2 border-zinc-800 hover:bg-zinc-900 text-indigo-400"
                            onClick={generateAiSummary}
                            disabled={isGeneratingSummary}
                        >
                            {isGeneratingSummary ? <Loader2 className="h-3.5 w-3.5 animate-spin" /> : <Sparkles className="h-3.5 w-3.5" />}
                            {isGeneratingSummary ? "Analyzing..." : "AI Summary"}
                        </Button>
                    </div>

                    {aiSummary && (
                        <div className="p-3 rounded-lg bg-indigo-500/10 border border-indigo-500/20 text-sm text-indigo-200 animate-in fade-in slide-in-from-top-2">
                            <Sparkles className="h-4 w-4 inline mr-2 mb-0.5" />
                            {aiSummary}
                        </div>
                    )}

                    <ScrollArea className="h-[250px] pr-4">
                        {loading ? (
                            <div className="flex justify-center py-8">
                                <Loader2 className="h-6 w-6 animate-spin text-zinc-500" />
                            </div>
                        ) : tasks.length === 0 ? (
                            <div className="text-center py-8 text-zinc-500 text-sm">No tasks found for this client.</div>
                        ) : (
                            <div className="space-y-4 pl-2 border-l border-zinc-800 ml-2">
                                {tasks.map((task) => (
                                    <div key={task.id} className="relative pl-6 pb-2">
                                        <div className={`absolute -left-[5px] top-1 h-2.5 w-2.5 rounded-full border-2 border-zinc-950 ${task.status === 'completed' ? 'bg-green-500' :
                                            task.status === 'in_progress' ? 'bg-blue-500' : 'bg-zinc-600'
                                            }`} />
                                        <div className="flex flex-col gap-1">
                                            <div className="flex items-center justify-between">
                                                <span className="text-sm font-medium text-zinc-200">{task.title}</span>
                                                <span className="text-xs text-zinc-500">{format(new Date(task.created_at), "MMM d")}</span>
                                            </div>
                                            <div className="flex items-center gap-2">
                                                <Badge variant="outline" className="text-[10px] px-1 py-0 border-zinc-800 text-zinc-400">
                                                    {task.status.replace('_', ' ')}
                                                </Badge>
                                                {task.deadline && (
                                                    <span className="text-[10px] text-zinc-500 flex items-center gap-1">
                                                        <Calendar className="h-3 w-3" />
                                                        Due {format(new Date(task.deadline), "MMM d")}
                                                    </span>
                                                )}
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}
                    </ScrollArea>
                </div>
            </DialogContent>
        </Dialog>
    );
}

export default function ClientsPage() {
    const [clients, setClients] = useState<Client[]>([]);
    const [loading, setLoading] = useState(true);
    const [searchQuery, setSearchQuery] = useState("");
    const [isCreateOpen, setIsCreateOpen] = useState(false);

    // Detail Modal State
    const [selectedClient, setSelectedClient] = useState<Client | null>(null);
    const [isDetailOpen, setIsDetailOpen] = useState(false);

    const form = useForm<z.infer<typeof clientSchema>>({
        resolver: zodResolver(clientSchema),
        defaultValues: {
            name: "",
            phone: "",
            project_name: "",
        },
    });

    useEffect(() => {
        fetchClients();
    }, []);

    const fetchClients = async () => {
        setLoading(true);
        try {
            const res = await clientApi.getAll();
            setClients(res.data);
        } catch (error) {
            toast.error("Failed to load clients");
        } finally {
            setLoading(false);
        }
    };

    const onSubmit = async (values: z.infer<typeof clientSchema>) => {
        try {
            await clientApi.create(values);
            toast.success("Client created");
            setIsCreateOpen(false);
            form.reset();
            fetchClients();
        } catch (error) {
            toast.error("Failed to create client");
        }
    };

    const filteredClients = clients.filter(c =>
        c.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        c.project_name?.toLowerCase().includes(searchQuery.toLowerCase())
    );

    const handleClientClick = (client: Client) => {
        setSelectedClient(client);
        setIsDetailOpen(true);
    };

    const handleDeleteClient = async (e: React.MouseEvent, id: number) => {
        e.stopPropagation(); // Prevent row click
        if (!confirm("Are you sure you want to delete this client?")) return;

        try {
            await clientApi.delete(id);
            setClients(clients.filter(c => c.id !== id));
            toast.success("Client deleted successfully");
        } catch (error) {
            toast.error("Failed to delete client");
        }
    };

    return (
        <div className="flex flex-col h-full gap-4">
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-2xl font-bold text-zinc-100">Clients</h1>
                    <p className="text-sm text-zinc-500">Manage your client relationships</p>
                </div>
                <Dialog open={isCreateOpen} onOpenChange={setIsCreateOpen}>
                    <DialogTrigger asChild>
                        <Button className="gap-2">
                            <Plus className="h-4 w-4" />
                            Add Client
                        </Button>
                    </DialogTrigger>
                    <DialogContent className="bg-zinc-950 border-zinc-800 text-zinc-100">
                        <DialogHeader>
                            <DialogTitle>Add New Client</DialogTitle>
                            <DialogDescription className="text-zinc-500">Enter client details below.</DialogDescription>
                        </DialogHeader>
                        <Form {...form}>
                            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                                <FormField
                                    control={form.control}
                                    name="name"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>Name</FormLabel>
                                            <FormControl>
                                                <Input placeholder="Client Name" className="bg-zinc-900 border-zinc-800" {...field} />
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />
                                <FormField
                                    control={form.control}
                                    name="phone"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>Phone</FormLabel>
                                            <FormControl>
                                                <Input placeholder="+1234567890" className="bg-zinc-900 border-zinc-800" {...field} />
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />
                                <FormField
                                    control={form.control}
                                    name="project_name"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>Project Name</FormLabel>
                                            <FormControl>
                                                <Input placeholder="Website Redesign" className="bg-zinc-900 border-zinc-800" {...field} />
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />
                                <DialogFooter>
                                    <Button type="submit">Create Client</Button>
                                </DialogFooter>
                            </form>
                        </Form>
                    </DialogContent>
                </Dialog>
            </div>

            <Card className="flex-1 bg-zinc-950/50 border-zinc-900 flex flex-col">
                <CardHeader className="border-b border-zinc-900 pb-4">
                    <div className="relative">
                        <Search className="absolute left-3 top-2.5 h-4 w-4 text-zinc-500" />
                        <Input
                            placeholder="Search clients..."
                            className="pl-9 bg-zinc-900 border-zinc-800 text-zinc-200 placeholder:text-zinc-600 w-full md:w-[300px]"
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                        />
                    </div>
                </CardHeader>
                <CardContent className="p-0 flex-1">
                    <div className="rounded-md">
                        <Table>
                            <TableHeader className="bg-zinc-900/50">
                                <TableRow className="border-zinc-900 hover:bg-transparent">
                                    <TableHead className="text-zinc-400">Name</TableHead>
                                    <TableHead className="text-zinc-400">Contact</TableHead>
                                    <TableHead className="text-zinc-400">Project</TableHead>
                                    <TableHead className="text-zinc-400 text-right">Added</TableHead>
                                    <TableHead className="w-[50px]"></TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {loading ? (
                                    <TableRow>
                                        <TableCell colSpan={5} className="h-24 text-center">
                                            <Loader2 className="mx-auto h-6 w-6 animate-spin text-zinc-500" />
                                        </TableCell>
                                    </TableRow>
                                ) : filteredClients.length === 0 ? (
                                    <TableRow>
                                        <TableCell colSpan={5} className="h-24 text-center text-zinc-500">
                                            No clients found.
                                        </TableCell>
                                    </TableRow>
                                ) : (
                                    filteredClients.map((client) => (
                                        <TableRow
                                            key={client.id}
                                            className="border-zinc-900 hover:bg-zinc-900/50 cursor-pointer transition-colors"
                                            onClick={() => handleClientClick(client)}
                                        >
                                            <TableCell className="font-medium text-zinc-200">
                                                <div className="flex items-center gap-3">
                                                    <Avatar className="h-8 w-8 border border-zinc-800">
                                                        <AvatarFallback className="bg-zinc-900 text-zinc-400 text-xs">
                                                            {client.name.substring(0, 2).toUpperCase()}
                                                        </AvatarFallback>
                                                    </Avatar>
                                                    {client.name}
                                                </div>
                                            </TableCell>
                                            <TableCell className="text-zinc-400">{client.phone || "—"}</TableCell>
                                            <TableCell>
                                                {client.project_name ? (
                                                    <Badge variant="outline" className="bg-zinc-900/50 text-zinc-400 border-zinc-800 font-normal">
                                                        {client.project_name}
                                                    </Badge>
                                                ) : (
                                                    <span className="text-zinc-600 italic">None</span>
                                                )}
                                            </TableCell>
                                            <TableCell className="text-right text-zinc-500">
                                                {format(new Date(client.created_at), "MMM d, yyyy")}
                                            </TableCell>
                                            <TableCell>
                                                <Button
                                                    variant="ghost"
                                                    size="icon"
                                                    className="h-8 w-8 text-zinc-500 hover:text-red-400 hover:bg-red-900/20"
                                                    onClick={(e) => handleDeleteClient(e, client.id)}
                                                >
                                                    <Trash2 className="h-4 w-4" />
                                                </Button>
                                            </TableCell>
                                        </TableRow>
                                    ))
                                )}
                            </TableBody>
                        </Table>
                    </div>
                </CardContent>
            </Card>

            <ClientDetailModal
                client={selectedClient}
                open={isDetailOpen}
                onOpenChange={setIsDetailOpen}
            />
        </div>
    );
}
