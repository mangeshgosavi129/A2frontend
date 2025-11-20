"use client";

import React, { useState, useEffect } from "react";
import { TaskBoard } from "@/components/tasks/TaskBoard";
import { TaskCreationModal } from "@/components/tasks/TaskCreationModal";
import { TaskDetailSheet } from "@/components/tasks/TaskDetailSheet";
import { taskApi } from "@/lib/api";
import { Task } from "@/lib/types";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Plus, LayoutGrid, Calendar as CalendarIcon, ChevronLeft, ChevronRight } from "lucide-react";
import { format, startOfMonth, endOfMonth, eachDayOfInterval, isSameDay, isToday, addMonths, subMonths } from "date-fns";
import { cn } from "@/lib/utils";

export default function TasksPage() {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [loading, setLoading] = useState(true);
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [selectedTaskId, setSelectedTaskId] = useState<number | null>(null);
  const [isDetailSheetOpen, setIsDetailSheetOpen] = useState(false);
  const [viewFilter, setViewFilter] = useState<"all" | "my">("all");

  // For Calendar View
  const [currentDate, setCurrentDate] = useState(new Date());

  const fetchTasks = async () => {
    setLoading(true);
    try {
      const res = await taskApi.getAll();
      setTasks(res.data);
    } catch (error) {
      console.error("Failed to fetch tasks", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTasks();
  }, []);

  const filteredTasks = viewFilter === "all" 
    ? tasks 
    : tasks.filter(t => t.id % 2 !== 0);

  const handleTaskUpdate = async (updatedTask: Task) => {
    setTasks((prev) => prev.map((t) => (t.id === updatedTask.id ? updatedTask : t)));
    try {
      await taskApi.update(updatedTask.id, { 
        status: updatedTask.status,
        priority: updatedTask.priority 
      });
    } catch (error) {
      console.error("Failed to sync task update", error);
      fetchTasks();
    }
  };

  const handleTaskClick = (task: Task) => {
    setSelectedTaskId(task.id);
    setIsDetailSheetOpen(true);
  };

  // --- Calendar View Components ---
  const CalendarView = () => {
    const monthStart = startOfMonth(currentDate);
    const monthEnd = endOfMonth(currentDate);
    const days = eachDayOfInterval({ start: monthStart, end: monthEnd });

    const handlePrevMonth = () => {
      setCurrentDate(subMonths(currentDate, 1));
    };

    const handleNextMonth = () => {
      setCurrentDate(addMonths(currentDate, 1));
    };

    const handleToday = () => {
      setCurrentDate(new Date());
    };

    return (
      <div className="h-full flex flex-col bg-zinc-950/50 border border-white/5 rounded-xl overflow-hidden">
        <div className="flex items-center justify-between p-4 border-b border-white/5">
          <h2 className="font-semibold text-lg text-zinc-200">{format(currentDate, "MMMM yyyy")}</h2>
          <div className="flex gap-2">
             <Button variant="outline" size="sm" onClick={handlePrevMonth} className="h-8">
               <ChevronLeft className="h-4 w-4" />
             </Button>
             <Button variant="outline" size="sm" onClick={handleToday} className="h-8">Today</Button>
             <Button variant="outline" size="sm" onClick={handleNextMonth} className="h-8">
               <ChevronRight className="h-4 w-4" />
             </Button>
          </div>
        </div>
        <div className="flex-1 flex flex-col overflow-hidden">
          <div className="grid grid-cols-7 border-b border-white/5">
            {["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].map((day) => (
              <div key={day} className="py-2 text-center text-sm font-medium text-zinc-500">
                {day}
              </div>
            ))}
          </div>
          <div className="flex-1 grid grid-cols-7 overflow-auto">
            {days.map((day) => {
               const dayTasks = filteredTasks.filter(t => t.deadline && isSameDay(new Date(t.deadline), day));
               return (
                  <div key={day.toString()} className={cn("border-r border-b border-white/5 p-2 min-h-[100px] flex flex-col gap-1", isToday(day) && "bg-zinc-900/80")}>
                    <span className={cn("text-xs font-medium w-6 h-6 flex items-center justify-center rounded-full", isToday(day) ? "bg-primary text-primary-foreground" : "text-zinc-400")}>
                      {format(day, "d")}
                    </span>
                    <div className="flex-1 flex flex-col gap-1 overflow-y-auto">
                        {dayTasks.map(task => (
                            <button 
                                key={task.id} 
                                onClick={() => handleTaskClick(task)}
                                className={cn(
                                    "text-[10px] text-left px-1.5 py-1 rounded truncate transition-colors",
                                    task.priority === 'high' ? "bg-red-500/20 text-red-300 hover:bg-red-500/30" : "bg-zinc-800 text-zinc-300 hover:bg-zinc-700"
                                )}
                            >
                                {task.title}
                            </button>
                        ))}
                    </div>
                  </div>
               );
            })}
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="flex flex-col h-[calc(100vh-5rem)] gap-4">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-zinc-100">Tasks</h1>
          <p className="text-sm text-zinc-500">Manage and track your team's work</p>
        </div>
        <div className="flex items-center gap-2">
            <div className="flex bg-zinc-900 p-1 rounded-lg border border-zinc-800">
                <button 
                    onClick={() => setViewFilter("all")}
                    className={cn("px-3 py-1.5 text-sm font-medium rounded-md transition-colors", viewFilter === "all" ? "bg-zinc-800 text-white shadow-sm" : "text-zinc-400 hover:text-zinc-200")}
                >
                    All Tasks
                </button>
                <button 
                    onClick={() => setViewFilter("my")}
                    className={cn("px-3 py-1.5 text-sm font-medium rounded-md transition-colors", viewFilter === "my" ? "bg-zinc-800 text-white shadow-sm" : "text-zinc-400 hover:text-zinc-200")}
                >
                    My Tasks
                </button>
            </div>
            <Button onClick={() => setIsCreateModalOpen(true)} className="gap-2">
            <Plus className="h-4 w-4" />
            New Task
            </Button>
        </div>
      </div>

      <Tabs defaultValue="board" className="flex-1 flex flex-col min-h-0">
        <TabsList className="w-fit bg-zinc-900">
          <TabsTrigger value="board" className="gap-2">
            <LayoutGrid className="h-4 w-4" />
            Board
          </TabsTrigger>
          <TabsTrigger value="calendar" className="gap-2">
            <CalendarIcon className="h-4 w-4" />
            Calendar
          </TabsTrigger>
        </TabsList>

        <TabsContent value="board" className="flex-1 min-h-0 mt-4">
          {loading ? (
            <div className="flex h-full items-center justify-center">
              <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent" />
            </div>
          ) : (
            <TaskBoard 
              tasks={filteredTasks} 
              onTaskUpdate={handleTaskUpdate} 
              onTaskClick={handleTaskClick} 
            />
          )}
        </TabsContent>

        <TabsContent value="calendar" className="flex-1 min-h-0 mt-4">
           <CalendarView />
        </TabsContent>
      </Tabs>

      <TaskCreationModal 
        open={isCreateModalOpen} 
        onOpenChange={setIsCreateModalOpen} 
        onTaskCreated={fetchTasks}
      />

      <TaskDetailSheet 
        open={isDetailSheetOpen} 
        onOpenChange={setIsDetailSheetOpen} 
        taskId={selectedTaskId}
        onUpdate={fetchTasks}
      />
    </div>
  );
}