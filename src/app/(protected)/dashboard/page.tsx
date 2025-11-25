"use client";

import React, { useEffect, useState } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { taskApi, messageApi } from "@/lib/api";
import { Task, Message } from "@/lib/types";
import {
  Activity,
  AlertCircle,
  CheckCircle2,
  Clock,
  ListTodo,
  Bell,
  Calendar,
} from "lucide-react";
import {
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  Legend,
  Pie,
  PieChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart";
import { format } from "date-fns";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";

export default function DashboardPage() {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [messages, setMessages] = useState<Message[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [tasksRes, messagesRes] = await Promise.all([
          taskApi.getAll(),
          messageApi.getAll({ direction: "in" }), // Get incoming messages/notifications
        ]);
        setTasks(tasksRes.data);
        setMessages(messagesRes.data);
      } catch (error) {
        console.error("Failed to fetch dashboard data:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  // KPI Calculations
  const totalTasks = tasks.length;
  const completedTasks = tasks.filter((t) => t.status === "completed").length;
  const inProgressTasks = tasks.filter((t) => t.status === "in_progress").length;
  const overdueTasks = tasks.filter(
    (t) =>
      t.status !== "completed" &&
      t.deadline &&
      new Date(t.deadline) < new Date()
  ).length;

  // Chart Data
  const statusData = [
    { name: "To Do", value: tasks.filter((t) => t.status === "assigned").length, color: "#3b82f6" }, // Blue
    { name: "In Progress", value: inProgressTasks, color: "#eab308" }, // Yellow
    { name: "Done", value: completedTasks, color: "#22c55e" }, // Green
    { name: "On Hold", value: tasks.filter((t) => t.status === "on_hold").length, color: "#a855f7" }, // Purple
  ];

  const priorityData = [
    { name: "High", value: tasks.filter((t) => t.priority === "high").length, fill: "#ef4444" }, // Red
    { name: "Medium", value: tasks.filter((t) => t.priority === "medium").length, fill: "#f97316" }, // Orange
    { name: "Low", value: tasks.filter((t) => t.priority === "low").length, fill: "#3b82f6" }, // Blue
  ];

  const topPriorityTasks = tasks
    .filter((t) => t.priority === "high" && t.status !== "completed")
    .sort((a, b) => {
      if (!a.deadline) return 1;
      if (!b.deadline) return -1;
      return new Date(a.deadline).getTime() - new Date(b.deadline).getTime();
    })
    .slice(0, 5);

  if (loading) {
    return (
      <div className="flex h-full w-full items-center justify-center">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent" />
      </div>
    );
  }

  return (
    <div className="flex flex-1 flex-col gap-4 p-4">
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card className="border-white/10 bg-zinc-900/50">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-zinc-200">
              Total Tasks
            </CardTitle>
            <ListTodo className="h-4 w-4 text-zinc-400" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-white">{totalTasks}</div>
            <p className="text-xs text-zinc-500">
              Active projects
            </p>
          </CardContent>
        </Card>
        <Card className="border-white/10 bg-zinc-900/50">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-zinc-200">
              In Progress
            </CardTitle>
            <Activity className="h-4 w-4 text-blue-400" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-white">{inProgressTasks}</div>
            <p className="text-xs text-zinc-500">
              Currently being worked on
            </p>
          </CardContent>
        </Card>
        <Card className="border-white/10 bg-zinc-900/50">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-zinc-200">
              Completed
            </CardTitle>
            <CheckCircle2 className="h-4 w-4 text-green-400" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-white">{completedTasks}</div>
            <p className="text-xs text-zinc-500">
              Tasks finished
            </p>
          </CardContent>
        </Card>
        <Card className="border-white/10 bg-zinc-900/50">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-zinc-200">
              Overdue
            </CardTitle>
            <AlertCircle className="h-4 w-4 text-red-400" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-white">{overdueTasks}</div>
            <p className="text-xs text-zinc-500">
              Missed deadlines
            </p>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
        <Card className="col-span-4 border-white/10 bg-zinc-900/50">
          <CardHeader>
            <CardTitle className="text-zinc-200">Task Distribution</CardTitle>
            <CardDescription className="text-zinc-500">
              Overview of task statuses and priorities
            </CardDescription>
          </CardHeader>
          <CardContent className="pl-2">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 h-[300px]">
              <div className="h-full w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={statusData}
                      cx="50%"
                      cy="50%"
                      innerRadius={60}
                      outerRadius={80}
                      paddingAngle={5}
                      dataKey="value"
                    >
                      {statusData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Pie>
                    <Tooltip
                      contentStyle={{ backgroundColor: '#18181b', borderColor: '#27272a', color: '#fff' }}
                      itemStyle={{ color: '#fff' }}
                    />
                    <Legend />
                  </PieChart>
                </ResponsiveContainer>
              </div>
              <div className="h-full w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={priorityData}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#333" />
                    <XAxis dataKey="name" stroke="#888" />
                    <YAxis stroke="#888" />
                    <Tooltip
                      cursor={{ fill: 'transparent' }}
                      contentStyle={{ backgroundColor: '#18181b', borderColor: '#27272a', color: '#fff' }}
                    />
                    <Bar dataKey="value" radius={[4, 4, 0, 0]}>
                      {priorityData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.fill} />
                      ))}
                    </Bar>
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card className="col-span-3 border-white/10 bg-zinc-900/50">
          <CardHeader>
            <CardTitle className="text-zinc-200">Notifications</CardTitle>
            <CardDescription className="text-zinc-500">
              Recent updates and alerts
            </CardDescription>
          </CardHeader>
          <CardContent>
            <ScrollArea className="h-[300px] pr-4">
              <div className="space-y-4">
                {messages.length === 0 ? (
                  <p className="text-sm text-zinc-500 text-center py-8">No new notifications</p>
                ) : (
                  messages.map((msg) => (
                    <div key={msg.id} className="flex items-start gap-3 border-b border-white/5 pb-3 last:border-0">
                      <div className="mt-1 rounded-full bg-blue-500/10 p-1.5 text-blue-500">
                        <Bell className="h-3 w-3" />
                      </div>
                      <div className="flex-1 space-y-1">
                        <p className="text-sm font-medium leading-none text-zinc-200">
                          {msg.message_text}
                        </p>
                        <p className="text-xs text-zinc-500">
                          {format(new Date(msg.created_at), "MMM d, h:mm a")}
                        </p>
                      </div>
                      {!msg.is_read && (
                        <div className="h-2 w-2 rounded-full bg-blue-500" />
                      )}
                    </div>
                  ))
                )}
              </div>
            </ScrollArea>
          </CardContent>
        </Card>
      </div>

      <Card className="border-white/10 bg-zinc-900/50">
        <CardHeader>
          <CardTitle className="text-zinc-200">Top Priority Tasks</CardTitle>
          <CardDescription className="text-zinc-500">
            High priority items needing attention
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {topPriorityTasks.length === 0 ? (
              <p className="text-sm text-zinc-500">No high priority tasks pending.</p>
            ) : (
              topPriorityTasks.map((task) => (
                <div key={task.id} className="flex items-center justify-between rounded-lg border border-white/5 bg-white/5 p-4 transition-colors hover:bg-white/10">
                  <div className="flex items-center gap-4">
                    <div className="rounded-full bg-red-500/10 p-2 text-red-500">
                      <AlertCircle className="h-4 w-4" />
                    </div>
                    <div className="space-y-1">
                      <p className="font-medium text-zinc-200">{task.title}</p>
                      <div className="flex items-center gap-2 text-xs text-zinc-500">
                        <span className="flex items-center gap-1">
                          <Calendar className="h-3 w-3" />
                          {task.deadline ? format(new Date(task.deadline), "MMM d, yyyy") : "No deadline"}
                        </span>
                        <span>•</span>
                        <span className="capitalize">{task.status.replace('_', ' ')}</span>
                      </div>
                    </div>
                  </div>
                  <Badge variant="outline" className="border-red-500/20 text-red-400">
                    High Priority
                  </Badge>
                </div>
              ))
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
