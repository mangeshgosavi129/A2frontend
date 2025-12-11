export type TaskStatus = 'assigned' | 'in_progress' | 'on_hold' | 'completed' | 'cancelled' | 'overdue';
export type TaskPriority = 'high' | 'medium' | 'low';
export type MessageDirection = 'in' | 'out' | 'system';
export type MessageChannel = 'whatsapp' | 'web' | 'system';

export interface User {
  id: number;
  name: string;
  phone: string;
  department?: string | null;
  created_at: string;
}

export interface Token {
  access_token: string;
  token_type: string;
}

export interface Client {
  id: number;
  name: string;
  phone?: string | null;
  project_name?: string | null;
  created_at: string;
}

export interface ChecklistItem {
  text: string;
  completed: boolean;
}

export interface TaskActivity {
  id?: number;
  user_id?: number;
  user_name?: string;
  content: string;
  created_at: string;
}

export interface TaskAttachment {
  id?: number;
  name: string;
  url: string;
  type: 'pdf' | 'image' | 'document';
  size?: number;
  uploaded_at: string;
}

export interface VoiceNote {
  id?: number;
  url: string;
  duration?: number;
  uploaded_at: string;
}

export interface TaskAssignee {
  user_id: number;
  user_name: string;
  assigned_at: string;
}

export interface Task {
  id: number;
  client_id?: number | null;
  title: string;
  description?: string | null;
  status: TaskStatus;
  priority: TaskPriority;
  deadline?: string | null;
  end_datetime?: string | null;
  checklist?: ChecklistItem[] | null;
  progress_description?: string | null;
  progress_percentage?: number | null;
  created_by?: number | null;
  assigned_to?: number | null;
  cancellation_reason?: string | null;
  created_at: string;
  updated_at: string;
  updates?: TaskActivity[];
  attachments?: TaskAttachment[];
  voice_notes?: VoiceNote[];
  assignees?: TaskAssignee[];
}

export interface Message {
  id: number;
  user_id?: number | null;
  task_id?: number | null;
  direction: MessageDirection;
  channel: MessageChannel;
  message_text?: string | null;
  payload?: any | null;
  is_read: boolean;
  created_at: string;
}

export interface UserCreate {
  name: string;
  phone: string;
  password: string;
  department?: string;
  org_name?: string;
  org_id?: number;
}

export interface UserLogin {
  phone: string;
  password: string;
}

export interface TaskCreate {
  client_id?: number;
  title: string;
  description?: string;
  status?: TaskStatus;
  priority?: TaskPriority;
  deadline?: string;
  checklist?: ChecklistItem[];
  progress_percentage?: number;
  assigned_to?: number;
}

export interface TaskUpdate {
  title?: string;
  description?: string;
  status?: TaskStatus;
  priority?: TaskPriority;
  deadline?: string | null;
  end_datetime?: string | null;
  progress_description?: string;
  progress_percentage?: number;
  assigned_to?: number;
}