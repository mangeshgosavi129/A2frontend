"use client";

import React, { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Calendar as CalendarIcon, Loader2, Sparkles, Send, Plus, X, FileText, Mic, Paperclip, Trash2, User as UserIcon, Building2, AlertCircle, StopCircle, Clock } from "lucide-react";
import { format } from "date-fns";
import { Separator } from "@/components/ui/separator";
import { Label } from "@/components/ui/label";

import { Button } from "@/components/ui/button";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
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
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Calendar } from "@/components/ui/calendar";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Checkbox } from "@/components/ui/checkbox";
import { cn } from "@/lib/utils";
import { taskApi, clientApi, userApi } from "@/lib/api";
import { toast } from "sonner";
import { TaskPriority, ChecklistItem, Client, User } from "@/lib/types";

const taskSchema = z.object({
  title: z.string().min(1, "Title is required"),
  description: z.string().optional(),
  priority: z.enum(["low", "medium", "high"]),
  deadline: z.date().optional(),
  checklist: z.array(z.object({ text: z.string(), completed: z.boolean() })).optional(),
  client_id: z.string().optional(), // Using string for Select value, will convert to number
  assigned_to: z.array(z.string()).optional(),
});

interface TaskCreationModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onTaskCreated: () => void;
}

export function TaskCreationModal({
  open,
  onOpenChange,
  onTaskCreated,
}: TaskCreationModalProps) {
  const [isLoading, setIsLoading] = useState(false);
  const [activeTab, setActiveTab] = useState<"manual" | "ai">("manual");

  // Checklist state
  const [checklistItems, setChecklistItems] = useState<ChecklistItem[]>([]);
  const [newChecklistItem, setNewChecklistItem] = useState("");

  // Attachments state
  const [attachments, setAttachments] = useState<File[]>([]);

  // Voice notes state
  const [voiceNotes, setVoiceNotes] = useState<File[]>([]);

  // AI Chat State
  const [chatInput, setChatInput] = useState("");
  const [isAiProcessing, setIsAiProcessing] = useState(false);
  const [aiMessages, setAiMessages] = useState<
    { role: "user" | "assistant"; content: string }[]
  >([
    {
      role: "assistant",
      content: "Hi! Describe the task you want to create, and I'll set it up for you.",
    },
  ]);

  // Client State
  const [clients, setClients] = useState<Client[]>([]);
  const [isCreatingClient, setIsCreatingClient] = useState(false);
  const [newClientName, setNewClientName] = useState("");
  const [newClientEmail, setNewClientEmail] = useState("");

  // User State
  const [users, setUsers] = useState<User[]>([]);

  // Recording State
  const [isRecording, setIsRecording] = useState(false);
  const [mediaRecorder, setMediaRecorder] = useState<MediaRecorder | null>(null);

  // Deadline time state
  const [deadlineTime, setDeadlineTime] = useState<string>("12:00");

  const form = useForm<z.infer<typeof taskSchema>>({
    resolver: zodResolver(taskSchema),
    defaultValues: {
      title: "",
      description: "",
      priority: "medium",
      checklist: [],
      client_id: undefined,
      assigned_to: [],
    },
  });

  useEffect(() => {
    if (open) {
      fetchClients();
      fetchUsers();
    }
  }, [open]);

  const fetchClients = async () => {
    try {
      const res = await clientApi.getAll();
      setClients(res.data);
    } catch (error) {
      console.error("Failed to fetch clients", error);
    }
  };

  const fetchUsers = async () => {
    try {
      const res = await userApi.getAll();
      setUsers(res.data);
    } catch (error) {
      console.error("Failed to fetch users", error);
    }
  };

  const handleCreateClient = async () => {
    if (!newClientName.trim()) return;
    try {
      setIsCreatingClient(true);
      const res = await clientApi.create({
        name: newClientName,
        email: newClientEmail,
        status: "active"
      });
      setClients([...clients, res.data]);
      form.setValue("client_id", res.data.id.toString());
      setNewClientName("");
      setNewClientEmail("");
      setIsCreatingClient(false);
      toast.success("Client created successfully");
    } catch (error) {
      toast.error("Failed to create client");
      setIsCreatingClient(false);
    }
  };

  const handleAddChecklistItem = () => {
    if (newChecklistItem.trim()) {
      setChecklistItems([...checklistItems, { text: newChecklistItem, completed: false }]);
      setNewChecklistItem("");
    }
  };

  const handleRemoveChecklistItem = (index: number) => {
    setChecklistItems(checklistItems.filter((_, i) => i !== index));
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const files = Array.from(e.target.files);
      setAttachments([...attachments, ...files]);
    }
  };

  const handleVoiceNoteUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const files = Array.from(e.target.files);
      setVoiceNotes([...voiceNotes, ...files]);
    }
  };

  const handleRemoveAttachment = (index: number) => {
    setAttachments(attachments.filter((_, i) => i !== index));
  };

  const handleRemoveVoiceNote = (index: number) => {
    setVoiceNotes(voiceNotes.filter((_, i) => i !== index));
  };

  const startRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const recorder = new MediaRecorder(stream);
      const chunks: BlobPart[] = [];

      recorder.ondataavailable = (e) => {
        if (e.data.size > 0) chunks.push(e.data);
      };

      recorder.onstop = () => {
        const blob = new Blob(chunks, { type: "audio/webm" });
        const file = new File([blob], `voice-note-${Date.now()}.webm`, { type: "audio/webm" });
        setVoiceNotes((prev) => [...prev, file]);
        stream.getTracks().forEach((track) => track.stop());
      };

      recorder.start();
      setMediaRecorder(recorder);
      setIsRecording(true);
    } catch (error) {
      console.error("Error accessing microphone:", error);
      toast.error("Could not access microphone. Please check permissions.");
    }
  };

  const stopRecording = () => {
    if (mediaRecorder && isRecording) {
      mediaRecorder.stop();
      setIsRecording(false);
      setMediaRecorder(null);
    }
  };

  async function onSubmit(values: z.infer<typeof taskSchema>) {
    setIsLoading(true);
    try {
      const res = await taskApi.create({
        ...values,
        deadline: values.deadline ? values.deadline.toISOString() : undefined,
        checklist: checklistItems,
        status: "assigned",
        progress_percentage: 0,
        client_id: values.client_id ? parseInt(values.client_id) : undefined,
        assigned_to: undefined, // This will be handled by addAssignees separately
      });

      if (values.assigned_to && values.assigned_to.length > 0) {
        await taskApi.addAssignees(res.data.id, values.assigned_to.map(id => parseInt(id)));
      }
      toast.success("Task created successfully");
      onTaskCreated();
      onOpenChange(false);
      form.reset();
      setChecklistItems([]);
      setAttachments([]);
      setVoiceNotes([]);
    } catch (error) {
      console.error(error);
      toast.error("Failed to create task");
    } finally {
      setIsLoading(false);
    }
  }

  const handleAiSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!chatInput.trim()) return;

    const userMsg = chatInput;
    setChatInput("");
    setAiMessages((prev) => [...prev, { role: "user", content: userMsg }]);
    setIsAiProcessing(true);

    setTimeout(() => {
      setIsAiProcessing(false);

      let detectedPriority: TaskPriority = "medium";
      if (userMsg.toLowerCase().includes("urgent") || userMsg.toLowerCase().includes("asap")) {
        detectedPriority = "high";
      } else if (userMsg.toLowerCase().includes("low priority")) {
        detectedPriority = "low";
      }

      const newValues = {
        title: userMsg.split(".")[0].substring(0, 50) + (userMsg.length > 50 ? "..." : ""),
        description: userMsg,
        priority: detectedPriority,
        deadline: undefined,
        client_id: undefined,
      };

      form.reset(newValues);

      setAiMessages((prev) => [
        ...prev,
        {
          role: "assistant",
          content: `I've drafted a task for you: "${newValues.title}" with ${newValues.priority} priority. You can review and edit it in the Manual Entry tab, or just say "Create it" to finish.`,
        },
      ]);

      if (userMsg.toLowerCase().includes("create it")) {
        form.handleSubmit(onSubmit)();
      }
    }, 1500);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[700px] max-h-[90vh] bg-zinc-950 border-zinc-800 text-zinc-100 overflow-hidden flex flex-col p-0">
        <DialogHeader className="px-6 py-4 border-b border-zinc-800">
          <DialogTitle>Create New Task</DialogTitle>
          <DialogDescription className="text-zinc-400">
            Add a new task to your board. Use AI to help you draft it quickly.
          </DialogDescription>
        </DialogHeader>

        <Tabs value={activeTab} onValueChange={(v) => setActiveTab(v as any)} className="flex-1 flex flex-col min-h-0">
          <div className="px-6 pt-4">
            <TabsList className="grid w-full grid-cols-2 bg-zinc-900">
              <TabsTrigger value="manual">Manual Entry</TabsTrigger>
              <TabsTrigger value="ai" className="flex items-center gap-2">
                <Sparkles className="h-4 w-4 text-indigo-400" />
                AI Assistant
              </TabsTrigger>
            </TabsList>
          </div>

          <TabsContent value="manual" className="flex-1 min-h-0 relative flex flex-col">
            <div className="flex-1 overflow-y-auto px-6 py-4">
              <Form {...form}>
                <form id="task-create-form" onSubmit={form.handleSubmit(onSubmit)} className="space-y-4 pb-6">
                  <Alert className="bg-yellow-500/10 border-yellow-500/20 text-yellow-200 mb-4">
                    <AlertCircle className="h-4 w-4" />
                    <AlertTitle>Note</AlertTitle>
                    <AlertDescription>
                      Documents and voice memos are not currently processed by the system.
                    </AlertDescription>
                  </Alert>
                  <FormField
                    control={form.control}
                    name="title"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Title</FormLabel>
                        <FormControl>
                          <Input placeholder="Task title" className="bg-zinc-900 border-zinc-800" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <div className="grid grid-cols-2 gap-4">
                    <FormField
                      control={form.control}
                      name="client_id"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Client</FormLabel>
                          <Select onValueChange={field.onChange} value={field.value}>
                            <FormControl>
                              <SelectTrigger className="bg-zinc-900 border-zinc-800">
                                <SelectValue placeholder="Select client" />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent className="bg-zinc-900 border-zinc-800">
                              {clients.map((client) => (
                                <SelectItem key={client.id} value={client.id.toString()}>
                                  {client.name}
                                </SelectItem>
                              ))}
                              <div className="p-2 border-t border-zinc-800">
                                <Dialog>
                                  <DialogTrigger asChild>
                                    <Button variant="ghost" size="sm" className="w-full justify-start text-indigo-400 hover:text-indigo-300 hover:bg-zinc-800">
                                      <Plus className="mr-2 h-4 w-4" />
                                      Create New Client
                                    </Button>
                                  </DialogTrigger>
                                  <DialogContent className="bg-zinc-950 border-zinc-800">
                                    <DialogHeader>
                                      <DialogTitle>Add New Client</DialogTitle>
                                    </DialogHeader>
                                    <div className="space-y-4 py-4">
                                      <div className="space-y-2">
                                        <FormLabel>Client Name</FormLabel>
                                        <Input
                                          value={newClientName}
                                          onChange={(e) => setNewClientName(e.target.value)}
                                          placeholder="Acme Corp"
                                          className="bg-zinc-900 border-zinc-800"
                                        />
                                      </div>
                                      <div className="space-y-2">
                                        <FormLabel>Email (Optional)</FormLabel>
                                        <Input
                                          value={newClientEmail}
                                          onChange={(e) => setNewClientEmail(e.target.value)}
                                          placeholder="contact@acme.com"
                                          className="bg-zinc-900 border-zinc-800"
                                        />
                                      </div>
                                      <Button onClick={handleCreateClient} disabled={isCreatingClient || !newClientName}>
                                        {isCreatingClient ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : null}
                                        Create Client
                                      </Button>
                                    </div>
                                  </DialogContent>
                                </Dialog>
                              </div>
                            </SelectContent>
                          </Select>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="priority"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Priority</FormLabel>
                          <Select onValueChange={field.onChange} defaultValue={field.value}>
                            <FormControl>
                              <SelectTrigger className="bg-zinc-900 border-zinc-800">
                                <SelectValue placeholder="Select priority" />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent className="bg-zinc-900 border-zinc-800">
                              <SelectItem value="low">Low</SelectItem>
                              <SelectItem value="medium">Medium</SelectItem>
                              <SelectItem value="high">High</SelectItem>
                            </SelectContent>
                          </Select>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>

                  <FormField
                    control={form.control}
                    name="assigned_to"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Assignees</FormLabel>
                        <FormControl>
                          <div className="grid grid-cols-2 gap-2 mt-2 bg-zinc-900 border border-zinc-800 rounded-md p-3 max-h-[150px] overflow-y-auto">
                            {users.map((user) => (
                              <div key={user.id} className="flex items-center space-x-2">
                                <Checkbox
                                  id={`user-${user.id}`}
                                  checked={field.value?.includes(user.id.toString())}
                                  onCheckedChange={(checked) => {
                                    const currentValues = field.value || [];
                                    const newValue = checked
                                      ? [...currentValues, user.id.toString()]
                                      : currentValues.filter((id) => id !== user.id.toString());
                                    field.onChange(newValue);
                                  }}
                                  className="border-zinc-700"
                                />
                                <Label
                                  htmlFor={`user-${user.id}`}
                                  className="text-sm text-zinc-300 font-normal cursor-pointer"
                                >
                                  {user.name}
                                </Label>
                              </div>
                            ))}
                          </div>
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="deadline"
                    render={({ field }) => (
                      <FormItem className="flex flex-col">
                        <FormLabel className="mb-1">Deadline</FormLabel>
                        <Popover>
                          <PopoverTrigger asChild>
                            <FormControl>
                              <Button
                                variant={"outline"}
                                className={cn(
                                  "w-full pl-3 text-left font-normal bg-zinc-900 border-zinc-800",
                                  !field.value && "text-muted-foreground"
                                )}
                              >
                                {field.value ? (
                                  format(field.value, "PPP 'at' h:mm a")
                                ) : (
                                  <span>Pick a date and time</span>
                                )}
                                <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                              </Button>
                            </FormControl>
                          </PopoverTrigger>
                          <PopoverContent className="w-auto p-0 bg-zinc-950 border-zinc-800" align="start">
                            <div className="flex flex-col">
                              <Calendar
                                mode="single"
                                selected={field.value}
                                onSelect={(date) => {
                                  if (date) {
                                    const [hours, minutes] = deadlineTime.split(":").map(Number);
                                    date.setHours(hours, minutes, 0, 0);
                                  }
                                  field.onChange(date);
                                }}
                                disabled={(date) =>
                                  date < new Date(new Date().setHours(0, 0, 0, 0))
                                }
                                initialFocus
                                className="bg-zinc-950 text-zinc-100"
                              />
                              <Separator className="bg-zinc-800" />
                              <div className="p-3 space-y-3">
                                <div className="flex items-center gap-2">
                                  <Clock className="h-4 w-4 text-zinc-500" />
                                  <span className="text-sm text-zinc-400">Time</span>
                                </div>
                                <div className="flex items-center gap-2">
                                  <Input
                                    type="time"
                                    value={deadlineTime}
                                    onChange={(e) => {
                                      setDeadlineTime(e.target.value);
                                      if (field.value) {
                                        const [hours, minutes] = e.target.value.split(":").map(Number);
                                        const newDate = new Date(field.value);
                                        newDate.setHours(hours, minutes, 0, 0);
                                        field.onChange(newDate);
                                      }
                                    }}
                                    className="h-8 bg-zinc-900 border-zinc-800 text-zinc-300 w-full [&::-webkit-calendar-picker-indicator]:filter [&::-webkit-calendar-picker-indicator]:invert"
                                  />
                                </div>
                              </div>
                            </div>
                          </PopoverContent>
                        </Popover>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="description"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Description</FormLabel>
                        <FormControl>
                          <Textarea
                            placeholder="Task details..."
                            className="resize-none bg-zinc-900 border-zinc-800 min-h-[100px]"
                            {...field}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  {/* Checklist Section */}
                  <div className="space-y-2">
                    <FormLabel>Checklist</FormLabel>
                    <div className="space-y-2">
                      {checklistItems.map((item, index) => (
                        <div key={index} className="flex items-center gap-2 p-2 rounded-md bg-zinc-900 border border-zinc-800">
                          <Checkbox disabled checked={false} className="border-zinc-700" />
                          <span className="text-sm text-zinc-300 flex-1">{item.text}</span>
                          <Button
                            type="button"
                            variant="ghost"
                            size="sm"
                            onClick={() => handleRemoveChecklistItem(index)}
                            className="h-6 w-6 p-0 text-zinc-500 hover:text-red-400"
                          >
                            <X className="h-3 w-3" />
                          </Button>
                        </div>
                      ))}
                    </div>
                    <div className="flex items-center gap-2">
                      <Input
                        placeholder="Add checklist item..."
                        value={newChecklistItem}
                        onChange={(e) => setNewChecklistItem(e.target.value)}
                        onKeyDown={(e) => {
                          if (e.key === 'Enter') {
                            e.preventDefault();
                            handleAddChecklistItem();
                          }
                        }}
                        className="bg-zinc-900 border-zinc-800"
                      />
                      <Button
                        type="button"
                        variant="outline"
                        size="sm"
                        onClick={handleAddChecklistItem}
                        className="border-zinc-800"
                      >
                        <Plus className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>

                  {/* Attachments Section */}
                  <div className="space-y-2">
                    <FormLabel>Attachments (PDF, Documents, Images)</FormLabel>
                    <div className="space-y-2">
                      {attachments.map((file, index) => (
                        <div key={index} className="flex items-center justify-between p-2 rounded-md bg-zinc-900 border border-zinc-800">
                          <div className="flex items-center gap-2">
                            <FileText className="h-4 w-4 text-zinc-400" />
                            <span className="text-sm text-zinc-300">{file.name}</span>
                            <span className="text-xs text-zinc-500">({(file.size / 1024).toFixed(1)} KB)</span>
                          </div>
                          <Button
                            type="button"
                            variant="ghost"
                            size="sm"
                            onClick={() => handleRemoveAttachment(index)}
                            className="h-6 w-6 p-0 text-zinc-500 hover:text-red-400"
                          >
                            <Trash2 className="h-3 w-3" />
                          </Button>
                        </div>
                      ))}
                    </div>
                    <label className="flex items-center justify-center gap-2 p-3 rounded-md border border-dashed border-zinc-700 hover:border-zinc-600 cursor-pointer transition-colors bg-zinc-900/50">
                      <Paperclip className="h-4 w-4 text-zinc-400" />
                      <span className="text-sm text-zinc-400">Click to upload files</span>
                      <input
                        type="file"
                        multiple
                        accept=".pdf,.doc,.docx,.xls,.xlsx,.jpg,.jpeg,.png"
                        onChange={handleFileUpload}
                        className="hidden"
                      />
                    </label>
                  </div>

                  {/* Voice Notes Section */}
                  <div className="space-y-2">
                    <FormLabel>Voice Notes</FormLabel>
                    <div className="space-y-2">
                      {voiceNotes.map((file, index) => (
                        <div key={index} className="flex items-center justify-between p-2 rounded-md bg-zinc-900 border border-zinc-800">
                          <div className="flex items-center gap-2">
                            <Mic className="h-4 w-4 text-zinc-400" />
                            <span className="text-sm text-zinc-300">{file.name}</span>
                            <span className="text-xs text-zinc-500">({(file.size / 1024).toFixed(1)} KB)</span>
                          </div>
                          <Button
                            type="button"
                            variant="ghost"
                            size="sm"
                            onClick={() => handleRemoveVoiceNote(index)}
                            className="h-6 w-6 p-0 text-zinc-500 hover:text-red-400"
                          >
                            <Trash2 className="h-3 w-3" />
                          </Button>
                        </div>
                      ))}
                    </div>
                    <div className="flex items-center justify-center gap-4 p-4 rounded-md border border-dashed border-zinc-700 bg-zinc-900/50">
                      {!isRecording ? (
                        <Button
                          type="button"
                          variant="outline"
                          onClick={startRecording}
                          className="gap-2 border-red-500/50 text-red-400 hover:bg-red-500/10 hover:text-red-300"
                        >
                          <Mic className="h-4 w-4" />
                          Start Recording
                        </Button>
                      ) : (
                        <Button
                          type="button"
                          variant="destructive"
                          onClick={stopRecording}
                          className="gap-2 animate-pulse"
                        >
                          <StopCircle className="h-4 w-4" />
                          Stop Recording
                        </Button>
                      )}
                    </div>
                  </div>

                  <DialogFooter className="pt-4">
                    <Button variant="outline" type="button" onClick={() => onOpenChange(false)} className="border-zinc-800 hover:bg-zinc-900 text-zinc-300">
                      Cancel
                    </Button>
                    <Button type="submit" disabled={isLoading}>
                      {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                      Create Task
                    </Button>
                  </DialogFooter>
                </form>
              </Form>
            </div>
          </TabsContent>

          <TabsContent value="ai" className="py-4 h-[400px] flex flex-col px-6">
            <Alert className="bg-red-500/10 border-red-500/20 text-red-200 mb-4">
              <AlertCircle className="h-4 w-4" />
              <AlertTitle>Disclaimer</AlertTitle>
              <AlertDescription>
                This feature is not currently working but will be working shortly.
              </AlertDescription>
            </Alert>
            <div className="flex-1 overflow-y-auto pr-4 mb-4">
              <div className="space-y-4">
                {aiMessages.map((msg, i) => (
                  <div
                    key={i}
                    className={cn(
                      "flex w-full",
                      msg.role === "user" ? "justify-end" : "justify-start"
                    )}
                  >
                    <div
                      className={cn(
                        "rounded-lg px-4 py-2 max-w-[80%] text-sm",
                        msg.role === "user"
                          ? "bg-primary text-primary-foreground"
                          : "bg-zinc-800 text-zinc-100"
                      )}
                    >
                      {msg.content}
                    </div>
                  </div>
                ))}
                {isAiProcessing && (
                  <div className="flex justify-start">
                    <div className="bg-zinc-800 rounded-lg px-4 py-2">
                      <Loader2 className="h-4 w-4 animate-spin text-zinc-400" />
                    </div>
                  </div>
                )}
              </div>
            </div>
            <form onSubmit={handleAiSubmit} className="flex gap-2 mt-auto">
              <Input
                value={chatInput}
                onChange={(e) => setChatInput(e.target.value)}
                placeholder="e.g., 'Create a high priority task to review the budget by Friday'"
                className="bg-zinc-900 border-zinc-800 focus-visible:ring-indigo-500"
              />
              <Button type="submit" size="icon" disabled={!chatInput.trim() || isAiProcessing}>
                <Send className="h-4 w-4" />
              </Button>
            </form>
            <div className="mt-2 text-xs text-center text-zinc-500">
              AI can draft tasks from your description. Switch to Manual Entry to review details.
            </div>
          </TabsContent>
        </Tabs>
      </DialogContent>
    </Dialog >
  );
}