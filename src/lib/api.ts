import axios from 'axios';
import { UserLogin, UserCreate, Token, TaskCreate, TaskUpdate, Client, Task, Message, RoleUpdate, UserRole } from './types';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000';

// Demo mode flag - set to true to use mock data
const DEMO_MODE = false;

const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

api.interceptors.request.use((config) => {
  const token = typeof window !== 'undefined' ? localStorage.getItem('token') : null;
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export const setAuthToken = (token: string) => {
  if (typeof window !== 'undefined') {
    localStorage.setItem('token', token);
  }
};

export const removeAuthToken = () => {
  if (typeof window !== 'undefined') {
    localStorage.removeItem('token');
  }
};

export const authApi = {
  login: (data: UserLogin) => api.post<Token>('/auth/login', data),
  signup: (data: UserCreate) => api.post<Token>('/auth/signup', data),
  logout: () => api.post('/auth/logout'),
};

export const userApi = {
  getAll: () => api.get<any[]>('/users'),
  getById: (id: number) => api.get<any>(`/users/${id}`),
  update: (id: number, data: any) => api.put(`/users/${id}`, data),
  delete: (id: number) => api.delete(`/users/${id}`),
};

export const clientApi = {
  create: (data: any) => api.post<Client>('/clients', data),
  getAll: () => api.get<Client[]>('/clients'),
  getById: (id: number) => api.get<Client>(`/clients/${id}`),
  update: (id: number, data: any) => api.put<Client>(`/clients/${id}`, data),
  delete: (id: number) => api.delete(`/clients/${id}`),
};

export const taskApi = {
  create: (data: TaskCreate) => api.post<Task>('/tasks', data),
  getAll: () => api.get<Task[]>('/tasks'),
  getById: (id: number) => api.get<Task>(`/tasks/${id}`),
  update: (id: number, data: TaskUpdate) => api.put<Task>(`/tasks/${id}`, data),
  cancel: (id: number, reason: string) => api.post<Task>(`/tasks/${id}/cancel`, { cancellation_reason: reason }),
  assign: (id: number, userId: number) => api.post(`/tasks/${id}/assign`, { user_id: userId }),
  assignMultiple: (id: number, userIds: number[]) => api.post(`/tasks/${id}/assign-multiple`, { user_ids: userIds }),
  unassign: (id: number, userId: number) => api.post(`/tasks/${id}/unassign`, { user_id: userId }),
  getAssignments: (id: number) => api.get<any[]>(`/tasks/${id}/assignments`),

  // Checklist
  addChecklistItem: (taskId: number, item: { text: string, completed: boolean }) => api.post<Task>(`/tasks/${taskId}/checklist/add`, item),
  updateChecklistItem: (taskId: number, index: number, update: { text?: string, completed?: boolean }) => api.put<Task>(`/tasks/${taskId}/checklist/update`, { index, ...update }),
  removeChecklistItem: (taskId: number, index: number) => api.delete<Task>(`/tasks/${taskId}/checklist/remove`, { data: { index } }),
};

export const messageApi = {
  create: (data: any) => api.post<Message>('/messages', data),
  getAll: (params?: { user_id?: number; task_id?: number; direction?: string; channel?: string }) => api.get<Message[]>('/messages', { params }),
};

export const organisationApi = {
  getRoles: (orgId: number) => api.get<UserRole[]>(`/organisations/${orgId}/roles`),
  updateRole: (orgId: number, data: RoleUpdate) => api.post(`/organisations/${orgId}/roles`, data),
};

export default api;