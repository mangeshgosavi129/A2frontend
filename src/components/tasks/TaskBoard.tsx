"use client";

import React from "react";
import {
  DndContext,
  DragOverlay,
  closestCorners,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  DragStartEvent,
  DragOverEvent,
  DragEndEvent,
  defaultDropAnimationSideEffects,
  DropAnimation,
} from "@dnd-kit/core";
import {
  arrayMove,
  SortableContext,
  sortableKeyboardCoordinates,
  verticalListSortingStrategy,
  useSortable,
} from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { Task, TaskStatus, TaskPriority } from "@/lib/types";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Calendar, MoreHorizontal, User as UserIcon, AlertCircle, FileText, Mic, MessageSquare, Paperclip } from "lucide-react";
import { format } from "date-fns";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { cn } from "@/lib/utils";

// ---- Types & Constants ----

const COLUMNS: { id: TaskStatus; title: string; color: string }[] = [
  { id: "assigned", title: "To Do", color: "bg-zinc-500" },
  { id: "in_progress", title: "In Progress", color: "bg-blue-500" },
  { id: "on_hold", title: "On Hold", color: "bg-orange-500" },
  { id: "completed", title: "Done", color: "bg-green-500" },
];

interface TaskBoardProps {
  tasks: Task[];
  onTaskUpdate: (task: Task) => void;
  onTaskClick?: (task: Task) => void;
}

// ---- Components ----

// 1. Sortable Task Card
function SortableTaskItem({ task, onClick }: { task: Task; onClick: () => void }) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: task.id, data: { type: "Task", task } });

  const style = {
    transform: CSS.Translate.toString(transform),
    transition,
  };

  if (isDragging) {
    return (
      <div
        ref={setNodeRef}
        style={style}
        className="opacity-50 bg-zinc-800/50 border border-dashed border-zinc-700 rounded-lg h-[120px]"
      />
    );
  }

  return (
    <div ref={setNodeRef} style={style} {...attributes} {...listeners} onClick={onClick}>
      <TaskCard task={task} />
    </div>
  );
}

// 2. Static Task Card (for overlay & board)
function TaskCard({ task }: { task: Task }) {
  const priorityColor = {
    high: "text-red-400 border-red-400/20 bg-red-400/10",
    medium: "text-yellow-400 border-yellow-400/20 bg-yellow-400/10",
    low: "text-blue-400 border-blue-400/20 bg-blue-400/10",
  }[task.priority] || "text-zinc-400";

  const hasAttachments = task.attachments && task.attachments.length > 0;
  const hasVoiceNotes = task.voice_notes && task.voice_notes.length > 0;
  const hasUpdates = task.updates && task.updates.length > 0;
  const hasChecklist = task.checklist && task.checklist.length > 0;

  return (
    <div className="group relative flex flex-col gap-2 rounded-lg border border-zinc-800 bg-zinc-900 p-3 shadow-sm hover:border-zinc-700 transition-all cursor-grab active:cursor-grabbing max-h-[180px] overflow-y-auto">
      <div className="flex items-start justify-between gap-2">
        <Badge variant="outline" className={cn("text-xs px-1.5 py-0 capitalize", priorityColor)}>
          {task.priority}
        </Badge>
        <button className="text-zinc-500 hover:text-zinc-300 opacity-0 group-hover:opacity-100 transition-opacity">
          <MoreHorizontal className="h-4 w-4" />
        </button>
      </div>
      
      <h4 className="font-medium text-sm text-zinc-200 line-clamp-2">{task.title}</h4>
      
      {/* Indicators Row */}
      <div className="flex items-center gap-2 text-xs text-zinc-500">
        {hasChecklist && (
          <div className="flex items-center gap-1">
            <span className="text-zinc-400">{task.checklist?.filter(i => i.completed).length}/{task.checklist?.length}</span>
          </div>
        )}
        {hasAttachments && (
          <div className="flex items-center gap-1">
            <Paperclip className="h-3 w-3" />
            <span>{task.attachments?.length}</span>
          </div>
        )}
        {hasVoiceNotes && (
          <div className="flex items-center gap-1">
            <Mic className="h-3 w-3" />
            <span>{task.voice_notes?.length}</span>
          </div>
        )}
        {hasUpdates && (
          <div className="flex items-center gap-1">
            <MessageSquare className="h-3 w-3" />
            <span>{task.updates?.length}</span>
          </div>
        )}
      </div>
      
      <div className="flex items-center justify-between mt-2">
        <div className="flex items-center gap-2 text-xs text-zinc-500">
          {task.deadline && (
             <span className={cn("flex items-center gap-1", new Date(task.deadline) < new Date() ? "text-red-400" : "")}>
               <Calendar className="h-3 w-3" />
               {format(new Date(task.deadline), "MMM d")}
             </span>
          )}
        </div>
        <Avatar className="h-6 w-6 rounded-full border border-zinc-800">
            <AvatarFallback className="text-[10px] bg-zinc-800 text-zinc-400">
                <UserIcon className="h-3 w-3" />
            </AvatarFallback>
        </Avatar>
      </div>
    </div>
  );
}

// 3. Column Component
function BoardColumn({
  column,
  tasks,
  onTaskClick,
}: {
  column: typeof COLUMNS[number];
  tasks: Task[];
  onTaskClick: (task: Task) => void;
}) {
  const { setNodeRef } = useSortable({
    id: column.id,
    data: { type: "Column", column },
  });

  return (
    <div className="flex flex-col gap-4 h-full min-w-[280px] w-[280px] bg-zinc-950/50 rounded-xl border border-white/5 p-3">
      <div className="flex items-center justify-between px-1">
        <div className="flex items-center gap-2">
          <div className={cn("h-2 w-2 rounded-full", column.color)} />
          <h3 className="font-semibold text-sm text-zinc-200">{column.title}</h3>
          <span className="text-xs text-zinc-500 bg-zinc-900 px-2 py-0.5 rounded-full border border-zinc-800">
            {tasks.length}
          </span>
        </div>
      </div>

      <div ref={setNodeRef} className="flex flex-col gap-3 flex-1 overflow-y-auto min-h-[100px]">
        <SortableContext items={tasks.map((t) => t.id)} strategy={verticalListSortingStrategy}>
          {tasks.map((task) => (
            <SortableTaskItem key={task.id} task={task} onClick={() => onTaskClick(task)} />
          ))}
        </SortableContext>
      </div>
    </div>
  );
}

// ---- Main Board Component ----

export function TaskBoard({ tasks, onTaskUpdate, onTaskClick }: TaskBoardProps) {
  const [activeTask, setActiveTask] = React.useState<Task | null>(null);

  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 5 } }),
    useSensor(KeyboardSensor, { coordinateGetter: sortableKeyboardCoordinates })
  );

  const handleDragStart = (event: DragStartEvent) => {
    const { active } = event;
    if (active.data.current?.type === "Task") {
      setActiveTask(active.data.current.task);
    }
  };

  const handleDragOver = (event: DragOverEvent) => {
    // Optional: Implement drag over logic for reordering within columns if needed immediately
    // For now, we handle everything in dragEnd for simplicity with backend updates
  };

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;
    setActiveTask(null);

    if (!over) return;

    const activeId = active.id;
    const overId = over.id;

    const activeTask = active.data.current?.task as Task;
    
    // Check if dropped over a column
    const overColumnId = COLUMNS.find(c => c.id === overId)?.id;
    
    // Check if dropped over another task
    const overTask = over.data.current?.task as Task;
    const overTaskColumnId = overTask?.status;

    const newStatus = overColumnId || overTaskColumnId;

    if (newStatus && newStatus !== activeTask.status) {
      // Update task status
      onTaskUpdate({ ...activeTask, status: newStatus as TaskStatus });
    }
  };

  const dropAnimation: DropAnimation = {
    sideEffects: defaultDropAnimationSideEffects({
      styles: {
        active: { opacity: "0.5" },
      },
    }),
  };

  return (
    <DndContext
      sensors={sensors}
      collisionDetection={closestCorners}
      onDragStart={handleDragStart}
      onDragOver={handleDragOver}
      onDragEnd={handleDragEnd}
    >
      <div className="flex h-full gap-4 overflow-x-auto pb-4 items-start">
        {COLUMNS.map((col) => (
          <BoardColumn
            key={col.id}
            column={col}
            tasks={tasks.filter((t) => t.status === col.id)}
            onTaskClick={(t) => onTaskClick?.(t)}
          />
        ))}
      </div>

      <DragOverlay dropAnimation={dropAnimation}>
        {activeTask ? <TaskCard task={activeTask} /> : null}
      </DragOverlay>
    </DndContext>
  );
}