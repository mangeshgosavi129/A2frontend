"use client";

import React, { useState, useEffect } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";
import { Task, TaskStatus, TaskPriority, ChecklistItem, Client } from "@/lib/types";
import { taskApi, userApi, clientApi } from "@/lib/api";
import { format } from "date-fns";
import {
  Calendar,
  CheckSquare,
  Clock,
  MoreHorizontal,
  Trash2,
  User as UserIcon,
  X,
  Plus,
  MessageSquare,
  Send,
  FileText,
  Download,
  Mic,
  Play,
  Pause,
  Paperclip,
  Pencil,
  Check,
  Building2
} from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";
import { toast } from "sonner";
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
import { Calendar as CalendarComponent } from "@/components/ui/calendar";
import { cn } from "@/lib/utils";

interface TaskDetailSheetProps {
  taskId: number | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onUpdate: () => void;
}

export function TaskDetailSheet({ taskId, open, onOpenChange, onUpdate }: TaskDetailSheetProps) {
  const [task, setTask] = useState<Task | null>(null);
  const [loading, setLoading] = useState(false);
  const [newChecklistItem, setNewChecklistItem] = useState("");
  const [newUpdate, setNewUpdate] = useState("");
  const [users, setUsers] = useState<any[]>([]);
  const [clients, setClients] = useState<Client[]>([]);
  const [isEditingDeadline, setIsEditingDeadline] = useState(false);
  const [isEditingAssignee, setIsEditingAssignee] = useState(false);
  const [selectedAssignee, setSelectedAssignee] = useState<number | null>(null);
  const [selectedDeadlineDate, setSelectedDeadlineDate] = useState<Date | undefined>(undefined);
  const [selectedDeadlineTime, setSelectedDeadlineTime] = useState<string>("12:00");

  // Editable state
  const [editedTitle, setEditedTitle] = useState("");
  const [editedDescription, setEditedDescription] = useState("");

  useEffect(() => {
    if (open && taskId) {
      fetchTaskDetails(taskId);
      fetchUsers();
      fetchClients();
    } else {
      setTask(null);
    }
  }, [open, taskId]);

  const fetchTaskDetails = async (id: number) => {
    setLoading(true);
    try {
      const res = await taskApi.getById(id);
      setTask(res.data);
      setEditedTitle(res.data.title);
      setEditedDescription(res.data.description || "");
      // Derive selected assignee from assignees list (take the first one for now)
      const activeAssignee = res.data.assignees && res.data.assignees.length > 0
        ? res.data.assignees[0].user_id
        : null;
      setSelectedAssignee(activeAssignee);
      // Initialize deadline date and time state
      if (res.data.deadline) {
        const deadlineDate = new Date(res.data.deadline);
        setSelectedDeadlineDate(deadlineDate);
        setSelectedDeadlineTime(format(deadlineDate, "HH:mm"));
      } else {
        setSelectedDeadlineDate(undefined);
        setSelectedDeadlineTime("12:00");
      }
    } catch (error) {
      toast.error("Failed to load task details");
      onOpenChange(false);
    } finally {
      setLoading(false);
    }
  };

  const fetchUsers = async () => {
    try {
      const res = await userApi.getAll();
      setUsers(res.data);
    } catch (error) {
      console.error("Failed to load users");
    }
  };

  const fetchClients = async () => {
    try {
      const res = await clientApi.getAll();
      setClients(res.data);
    } catch (error) {
      console.error("Failed to load clients");
    }
  };

  const handleStatusChange = async (status: TaskStatus) => {
    if (!task) return;
    try {
      const updated = { ...task, status };
      setTask(updated);
      await taskApi.update(task.id, { status });
      onUpdate();
      toast.success("Status updated");
    } catch (error) {
      toast.error("Failed to update status");
      fetchTaskDetails(task.id);
    }
  };

  const handlePriorityChange = async (priority: TaskPriority) => {
    if (!task) return;
    try {
      const updated = { ...task, priority };
      setTask(updated);
      await taskApi.update(task.id, { priority });
      onUpdate();
    } catch (error) {
      toast.error("Failed to update priority");
    }
  };

  const handleDeadlineConfirm = async () => {
    if (!task) return;
    try {
      let deadline: string | null = null;
      if (selectedDeadlineDate) {
        const [hours, minutes] = selectedDeadlineTime.split(":").map(Number);
        const combinedDateTime = new Date(selectedDeadlineDate);
        combinedDateTime.setHours(hours, minutes, 0, 0);
        deadline = combinedDateTime.toISOString();
      }
      const updated = { ...task, deadline };
      setTask(updated);
      await taskApi.update(task.id, { deadline });
      setIsEditingDeadline(false);
      onUpdate();
      toast.success("Deadline updated");
    } catch (error) {
      toast.error("Failed to update deadline");
      fetchTaskDetails(task.id);
    }
  };

  const handleClearDeadline = async () => {
    if (!task) return;
    try {
      setSelectedDeadlineDate(undefined);
      setSelectedDeadlineTime("12:00");
      const updated = { ...task, deadline: null };
      setTask(updated);
      await taskApi.update(task.id, { deadline: null });
      setIsEditingDeadline(false);
      onUpdate();
      toast.success("Deadline cleared");
    } catch (error) {
      toast.error("Failed to clear deadline");
      fetchTaskDetails(task.id);
    }
  };

  const handleAssigneeChange = async (userId: number) => {
    if (!task) return;
    try {
      const oldAssignee = selectedAssignee;
      setSelectedAssignee(userId);

      if (userId === 0) {
        // Unassign current assignee
        if (oldAssignee) {
          await taskApi.removeAssignees(task.id, [oldAssignee]);
        }
      } else {
        // If there was an old assignee, unassign them first (to maintain single-assignee behavior for this UI)
        if (oldAssignee && oldAssignee !== userId) {
          await taskApi.removeAssignees(task.id, [oldAssignee]);
        }
        // Assign new user
        if (oldAssignee !== userId) {
          await taskApi.addAssignees(task.id, [userId]);
        }
      }

      setIsEditingAssignee(false);
      onUpdate();
      toast.success("Assignee updated");
      // Refresh task details to get updated assignees list
      fetchTaskDetails(task.id);
    } catch (error) {
      toast.error("Failed to update assignee");
      fetchTaskDetails(task.id);
    }
  };

  const handleAddChecklistItem = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!task || !newChecklistItem.trim()) return;

    try {
      const item = { text: newChecklistItem, completed: false };
      const updatedChecklist = [...(task.checklist || []), item];
      setTask({ ...task, checklist: updatedChecklist });
      setNewChecklistItem("");

      await taskApi.addChecklistItem(task.id, item);
      onUpdate();
    } catch (error) {
      toast.error("Failed to add item");
    }
  };

  const handleToggleChecklist = async (index: number, checked: boolean) => {
    if (!task || !task.checklist) return;

    try {
      const updatedChecklist = [...task.checklist];
      updatedChecklist[index].completed = checked;
      setTask({ ...task, checklist: updatedChecklist });

      await taskApi.updateChecklistItem(task.id, index, { completed: checked });
      onUpdate();
    } catch (error) {
      toast.error("Failed to update item");
    }
  };

  const handleAddUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!task || !newUpdate.trim()) return;

    try {
      const update = {
        user_name: "Current User",
        content: newUpdate,
        created_at: new Date().toISOString()
      };
      const updatedUpdates = [...(task.updates || []), update];
      setTask({ ...task, updates: updatedUpdates });
      setNewUpdate("");
      toast.success("Update posted");
      onUpdate();
    } catch (error) {
      toast.error("Failed to post update");
    }
  };

  const handleTitleSave = async () => {
    if (!task || editedTitle === task.title) return;
    try {
      await taskApi.update(task.id, { title: editedTitle });
      setTask({ ...task, title: editedTitle });
      onUpdate();
      toast.success("Title updated");
    } catch (error) {
      toast.error("Failed to update title");
    }
  };

  const handleDescriptionSave = async () => {
    if (!task || editedDescription === task.description) return;
    try {
      await taskApi.update(task.id, { description: editedDescription });
      setTask({ ...task, description: editedDescription });
      onUpdate();
      toast.success("Description updated");
    } catch (error) {
      toast.error("Failed to update description");
    }
  };

  const handleCancelTask = async () => {
    if (!task) return;
    try {
      await taskApi.cancel(task.id, "Cancelled by user");
      setTask({ ...task, status: "cancelled" });
      onUpdate();
      toast.success("Task cancelled");
    } catch (error) {
      toast.error("Failed to cancel task");
    }
  };

  const getAssigneeName = () => {
    if (!selectedAssignee) return "Unassigned";
    const user = users.find(u => u.id === selectedAssignee);
    return user?.name || "Unknown User";
  };

  const getClientName = () => {
    if (!task?.client_id) return "No client";
    const client = clients.find(c => c.id === task.client_id);
    return client?.name || "Unknown Client";
  };

  if (!task && loading) {
    return (
      <Dialog open={open} onOpenChange={onOpenChange}>
        <DialogContent className="max-w-3xl bg-zinc-950 border-zinc-800">
          <div className="flex h-[400px] items-center justify-center">
            <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent" />
          </div>
        </DialogContent>
      </Dialog>
    );
  }

  if (!task) return null;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-3xl max-h-[90vh] bg-zinc-950 border-zinc-800 p-0 flex flex-col gap-0 overflow-hidden">
        <DialogHeader className="px-6 py-4 border-b border-zinc-800 bg-zinc-900/50">
          <div className="flex items-center justify-between mb-2">
            <Badge variant="outline" className="border-zinc-700 text-zinc-400 uppercase text-[10px] tracking-wider">
              TASK-{task.id}
            </Badge>
          </div>
          <div className="flex items-start justify-between gap-4">
            <Input
              value={editedTitle}
              onChange={(e) => setEditedTitle(e.target.value)}
              onBlur={handleTitleSave}
              className="text-xl font-semibold text-zinc-100 bg-transparent border-transparent hover:border-zinc-800 focus:border-zinc-700 px-0 h-auto"
            />
            <Button
              variant="outline"
              size="sm"
              onClick={handleCancelTask}
              className="text-red-400 border-red-900/20 hover:bg-red-900/10 hover:text-red-300 shrink-0"
            >
              Cancel Task
            </Button>
          </div>
        </DialogHeader>

        <div className="flex-1 h-full overflow-y-auto">
          <div className="px-6 py-6 space-y-6">
            {/* Properties Grid */}
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-1">
                <span className="text-xs font-medium text-zinc-500">Status</span>
                <Select value={task.status} onValueChange={handleStatusChange}>
                  <SelectTrigger className="h-8 bg-zinc-900 border-zinc-800 text-zinc-300">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent className="bg-zinc-900 border-zinc-800">
                    <SelectItem value="assigned">To Do</SelectItem>
                    <SelectItem value="in_progress">In Progress</SelectItem>
                    <SelectItem value="on_hold">On Hold</SelectItem>
                    <SelectItem value="completed">Done</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-1">
                <span className="text-xs font-medium text-zinc-500">Priority</span>
                <Select value={task.priority} onValueChange={handlePriorityChange}>
                  <SelectTrigger className="h-8 bg-zinc-900 border-zinc-800 text-zinc-300">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent className="bg-zinc-900 border-zinc-800">
                    <SelectItem value="low">Low</SelectItem>
                    <SelectItem value="medium">Medium</SelectItem>
                    <SelectItem value="high">High</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-1">
                <span className="text-xs font-medium text-zinc-500">Deadline</span>
                {isEditingDeadline ? (
                  <Popover open={isEditingDeadline} onOpenChange={setIsEditingDeadline}>
                    <PopoverTrigger asChild>
                      <Button
                        variant="outline"
                        className="w-full h-8 px-3 justify-start text-left font-normal bg-zinc-900 border-zinc-800 text-zinc-300"
                      >
                        <Calendar className="h-3.5 w-3.5 text-zinc-500 mr-2" />
                        {task.deadline ? format(new Date(task.deadline), "MMM d, yyyy 'at' h:mm a") : "No deadline"}
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0 bg-zinc-950 border-zinc-800" align="start">
                      <div className="flex flex-col">
                        <CalendarComponent
                          mode="single"
                          selected={selectedDeadlineDate}
                          onSelect={setSelectedDeadlineDate}
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
                              value={selectedDeadlineTime}
                              onChange={(e) => setSelectedDeadlineTime(e.target.value)}
                              className="h-8 bg-zinc-900 border-zinc-800 text-zinc-300 w-full [&::-webkit-calendar-picker-indicator]:filter [&::-webkit-calendar-picker-indicator]:invert"
                            />
                          </div>
                          <div className="flex items-center gap-2 pt-1">
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={handleClearDeadline}
                              className="flex-1 h-8 text-zinc-400 hover:text-zinc-200"
                            >
                              Clear
                            </Button>
                            <Button
                              size="sm"
                              onClick={handleDeadlineConfirm}
                              className="flex-1 h-8"
                              disabled={!selectedDeadlineDate}
                            >
                              Set Deadline
                            </Button>
                          </div>
                        </div>
                      </div>
                    </PopoverContent>
                  </Popover>
                ) : (
                  <div
                    className="flex items-center justify-between gap-2 h-8 px-3 rounded-md border border-zinc-800 bg-zinc-900 text-sm text-zinc-300 group cursor-pointer hover:border-zinc-700"
                    onClick={() => setIsEditingDeadline(true)}
                  >
                    <div className="flex items-center gap-2">
                      <Calendar className="h-3.5 w-3.5 text-zinc-500" />
                      {task.deadline ? format(new Date(task.deadline), "MMM d, yyyy 'at' h:mm a") : "No deadline"}
                    </div>
                    <Pencil className="h-3 w-3 text-zinc-600 group-hover:text-zinc-400" />
                  </div>
                )}
              </div>
              <div className="space-y-1">
                <span className="text-xs font-medium text-zinc-500">Assignee</span>
                {isEditingAssignee ? (
                  <Select value={selectedAssignee?.toString()} onValueChange={(v) => handleAssigneeChange(Number(v))}>
                    <SelectTrigger className="h-8 bg-zinc-900 border-zinc-800 text-zinc-300">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent className="bg-zinc-900 border-zinc-800">
                      <SelectItem value="0">Unassigned</SelectItem>
                      {users.map((user) => (
                        <SelectItem key={user.id} value={user.id.toString()}>
                          {user.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                ) : (
                  <div
                    className="flex items-center justify-between gap-2 h-8 px-3 rounded-md border border-zinc-800 bg-zinc-900 text-sm text-zinc-300 group cursor-pointer hover:border-zinc-700"
                    onClick={() => setIsEditingAssignee(true)}
                  >
                    <div className="flex items-center gap-2">
                      <UserIcon className="h-3.5 w-3.5 text-zinc-500" />
                      {getAssigneeName()}
                    </div>
                    <Pencil className="h-3 w-3 text-zinc-600 group-hover:text-zinc-400" />
                  </div>
                )}
              </div>
              <div className="space-y-1">
                <span className="text-xs font-medium text-zinc-500">Client</span>
                <div className="flex items-center gap-2 h-8 px-3 rounded-md border border-zinc-800 bg-zinc-900 text-sm text-zinc-300">
                  <Building2 className="h-3.5 w-3.5 text-zinc-500" />
                  {getClientName()}
                </div>
              </div>
            </div>

            <Separator className="bg-zinc-800" />

            {/* Description */}
            <div className="space-y-2">
              <h3 className="text-sm font-medium text-zinc-300">Description</h3>
              <Textarea
                value={editedDescription}
                onChange={(e) => setEditedDescription(e.target.value)}
                onBlur={handleDescriptionSave}
                className="min-h-[80px] bg-zinc-900/50 border-zinc-800 text-zinc-300 resize-none focus:bg-zinc-900"
                placeholder="Add a description..."
              />
            </div>

            {/* Checklist */}
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <h3 className="text-sm font-medium text-zinc-300">Checklist</h3>
                <span className="text-xs text-zinc-500">
                  {task.checklist?.filter(i => i.completed).length || 0}/{task.checklist?.length || 0} completed
                </span>
              </div>

              <div className="space-y-2 max-h-[200px] overflow-y-auto pr-2">
                {task.checklist?.map((item, index) => (
                  <div key={index} className="flex items-start gap-2 group">
                    <Checkbox
                      checked={item.completed}
                      onCheckedChange={(c) => handleToggleChecklist(index, c as boolean)}
                      className="mt-0.5 border-zinc-700 data-[state=checked]:bg-primary data-[state=checked]:border-primary"
                    />
                    <span className={`text-sm ${item.completed ? "text-zinc-600 line-through" : "text-zinc-300"}`}>
                      {item.text}
                    </span>
                  </div>
                ))}
              </div>

              <form onSubmit={handleAddChecklistItem} className="flex items-center gap-2 mt-2">
                <Plus className="h-4 w-4 text-zinc-500" />
                <Input
                  placeholder="Add an item..."
                  value={newChecklistItem}
                  onChange={(e) => setNewChecklistItem(e.target.value)}
                  className="h-8 bg-transparent border-none shadow-none focus-visible:ring-0 px-0 placeholder:text-zinc-600 text-zinc-300"
                />
              </form>
            </div>

            <Separator className="bg-zinc-800" />

            {/* Attachments */}
            <div className="space-y-3">
              <h3 className="text-sm font-medium text-zinc-300">Attachments</h3>
              {task.attachments && task.attachments.length > 0 ? (
                <div className="space-y-2 max-h-[200px] overflow-y-auto pr-2">
                  {task.attachments.map((attachment, index) => (
                    <div key={index} className="flex items-center justify-between p-3 rounded-md border border-zinc-800 bg-zinc-900/50 hover:bg-zinc-900 transition-colors">
                      <div className="flex items-center gap-3">
                        <div className="h-8 w-8 rounded bg-zinc-800 flex items-center justify-center">
                          <FileText className="h-4 w-4 text-zinc-400" />
                        </div>
                        <div>
                          <p className="text-sm text-zinc-300">{attachment.name}</p>
                          <p className="text-xs text-zinc-500">{format(new Date(attachment.uploaded_at), "MMM d, yyyy")}</p>
                        </div>
                      </div>
                      <Button variant="ghost" size="sm" className="h-8 text-zinc-400 hover:text-white">
                        <Download className="h-4 w-4" />
                      </Button>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-sm text-zinc-500">No attachments</p>
              )}
            </div>

            <Separator className="bg-zinc-800" />

            {/* Voice Notes */}
            <div className="space-y-3">
              <h3 className="text-sm font-medium text-zinc-300">Voice Notes</h3>
              {task.voice_notes && task.voice_notes.length > 0 ? (
                <div className="space-y-2 max-h-[200px] overflow-y-auto pr-2">
                  {task.voice_notes.map((note, index) => (
                    <div key={index} className="flex items-center justify-between p-3 rounded-md border border-zinc-800 bg-zinc-900/50">
                      <div className="flex items-center gap-3">
                        <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                          <Play className="h-4 w-4 text-primary" />
                        </Button>
                        <div>
                          <p className="text-sm text-zinc-300">Voice Note {index + 1}</p>
                          <p className="text-xs text-zinc-500">
                            {note.duration ? `${note.duration}s` : "Unknown duration"} · {format(new Date(note.uploaded_at), "MMM d, yyyy")}
                          </p>
                        </div>
                      </div>
                      <Button variant="ghost" size="sm" className="h-8 text-zinc-400 hover:text-white">
                        <Download className="h-4 w-4" />
                      </Button>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-sm text-zinc-500">No voice notes</p>
              )}
            </div>

            <Separator className="bg-zinc-800" />

            {/* Updates Section */}
            <div className="space-y-4">
              <h3 className="text-sm font-medium text-zinc-300">Updates</h3>

              {/* Existing Updates */}
              {task.updates && task.updates.length > 0 && (
                <div className="space-y-3 max-h-[300px] overflow-y-auto pr-2">
                  {task.updates.map((update, index) => (
                    <div key={index} className="flex gap-3">
                      <Avatar className="h-8 w-8">
                        <AvatarFallback className="bg-zinc-800 text-zinc-400 text-xs">
                          {update.user_name?.charAt(0) || "U"}
                        </AvatarFallback>
                      </Avatar>
                      <div className="flex-1 space-y-1">
                        <div className="flex items-center gap-2">
                          <span className="text-sm font-medium text-zinc-300">{update.user_name}</span>
                          <span className="text-xs text-zinc-500">
                            {format(new Date(update.created_at), "MMM d, h:mm a")}
                          </span>
                        </div>
                        <p className="text-sm text-zinc-400">{update.content}</p>
                      </div>
                    </div>
                  ))}
                </div>
              )}

              {/* Add New Update */}
              <form onSubmit={handleAddUpdate} className="flex gap-3">
                <Avatar className="h-8 w-8">
                  <AvatarFallback className="bg-zinc-800 text-zinc-400">U</AvatarFallback>
                </Avatar>
                <div className="flex-1 space-y-2">
                  <Textarea
                    placeholder="Post an update about this task..."
                    value={newUpdate}
                    onChange={(e) => setNewUpdate(e.target.value)}
                    className="bg-zinc-900 border-zinc-800 min-h-[80px] text-zinc-300 resize-none"
                  />
                  <div className="flex justify-end">
                    <Button type="submit" size="sm" className="h-7 text-xs" disabled={!newUpdate.trim()}>
                      <Send className="h-3 w-3 mr-1" />
                      Post Update
                    </Button>
                  </div>
                </div>
              </form>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}