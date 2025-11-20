import axios from 'axios';
import { UserLogin, UserCreate, Token, TaskCreate, TaskUpdate, Client, Task, Message } from './types';
import { mockApi } from './mock-api';

const API_URL = 'http://localhost:8000';

// Demo mode flag - set to true to use mock data
const DEMO_MODE = true;

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
  login: (data: UserLogin) => DEMO_MODE ? Promise.resolve({ data: { access_token: 'demo_token' } }) : api.post<Token>('/auth/login', data),
  signup: (data: UserCreate) => DEMO_MODE ? Promise.resolve({ data: { access_token: 'demo_token' } }) : api.post<Token>('/auth/signup', data),
  logout: () => DEMO_MODE ? Promise.resolve({ data: { success: true } }) : api.post('/auth/logout'),
};

export const userApi = {
  getAll: () => DEMO_MODE ? mockApi.users.getAll() : api.get<any[]>('/users'),
  getById: (id: number) => DEMO_MODE ? mockApi.users.getById(id) : api.get<any>(`/users/${id}`),
  update: (id: number, data: any) => DEMO_MODE ? mockApi.users.update(id, data) : api.put(`/users/${id}`, data),
  delete: (id: number) => DEMO_MODE ? mockApi.users.delete(id) : api.delete(`/users/${id}`),
};

export const clientApi = {
  create: (data: any) => DEMO_MODE ? mockApi.clients.create(data) : api.post<Client>('/clients', data),
  getAll: () => DEMO_MODE ? mockApi.clients.getAll() : api.get<Client[]>('/clients'),
  getById: (id: number) => DEMO_MODE ? mockApi.clients.getById(id) : api.get<Client>(`/clients/${id}`),
  update: (id: number, data: any) => DEMO_MODE ? mockApi.clients.update(id, data) : api.put<Client>(`/clients/${id}`, data),
  delete: (id: number) => DEMO_MODE ? mockApi.clients.delete(id) : api.delete(`/clients/${id}`),
};

export const taskApi = {
  create: (data: TaskCreate) => DEMO_MODE ? mockApi.tasks.create(data) : api.post<Task>('/tasks', data),
  getAll: () => DEMO_MODE ? mockApi.tasks.getAll() : api.get<Task[]>('/tasks'),
  getById: (id: number) => DEMO_MODE ? mockApi.tasks.getById(id) : api.get<Task>(`/tasks/${id}`),
  update: (id: number, data: TaskUpdate) => DEMO_MODE ? mockApi.tasks.update(id, data) : api.put<Task>(`/tasks/${id}`, data),
  cancel: (id: number, reason: string) => DEMO_MODE ? mockApi.tasks.cancel(id, reason) : api.post<Task>(`/tasks/${id}/cancel`, { cancellation_reason: reason }),
  assign: (id: number, userId: number) => DEMO_MODE ? mockApi.tasks.assign(id, userId) : api.post(`/tasks/${id}/assign`, { user_id: userId }),
  assignMultiple: (id: number, userIds: number[]) => DEMO_MODE ? mockApi.tasks.assignMultiple(id, userIds) : api.post(`/tasks/${id}/assign-multiple`, { user_ids: userIds }),
  unassign: (id: number, userId: number) => DEMO_MODE ? mockApi.tasks.unassign(id, userId) : api.post(`/tasks/${id}/unassign`, { user_id: userId }),
  
  // Checklist
  addChecklistItem: (taskId: number, item: { text: string, completed: boolean }) => DEMO_MODE ? mockApi.tasks.addChecklistItem(taskId, item) : api.post<Task>(`/tasks/${taskId}/checklist/add`, item),
  updateChecklistItem: (taskId: number, index: number, update: { text?: string, completed?: boolean }) => DEMO_MODE ? mockApi.tasks.updateChecklistItem(taskId, index, update) : api.put<Task>(`/tasks/${taskId}/checklist/update`, { index, ...update }),
  removeChecklistItem: (taskId: number, index: number) => DEMO_MODE ? mockApi.tasks.removeChecklistItem(taskId, index) : api.delete<Task>(`/tasks/${taskId}/checklist/remove`, { data: { index } }),
};

export const messageApi = {
  create: (data: any) => DEMO_MODE ? mockApi.messages.create(data) : api.post<Message>('/messages', data),
  getAll: (params?: { user_id?: number; task_id?: number; direction?: string; channel?: string }) => DEMO_MODE ? mockApi.messages.getAll(params) : api.get<Message[]>('/messages', { params }),
};

export default api;