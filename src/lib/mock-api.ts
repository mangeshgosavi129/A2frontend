// Mock API service that returns demo data
import { DEMO_USERS, DEMO_CLIENTS, DEMO_TASKS } from './mock-data';

// Simulate API delay
const delay = (ms: number = 300) => new Promise(resolve => setTimeout(resolve, ms));

export const mockApi = {
  // Users
  users: {
    getAll: async () => {
      await delay();
      return { data: DEMO_USERS };
    },
    getById: async (id: number) => {
      await delay();
      const user = DEMO_USERS.find(u => u.id === id);
      if (!user) throw new Error('User not found');
      return { data: user };
    },
    update: async (id: number, data: any) => {
      await delay();
      const user = DEMO_USERS.find(u => u.id === id);
      if (!user) throw new Error('User not found');
      return { data: { ...user, ...data } };
    },
    delete: async (id: number) => {
      await delay();
      return { data: { success: true } };
    }
  },

  // Clients
  clients: {
    create: async (data: any) => {
      await delay();
      const newClient = {
        id: DEMO_CLIENTS.length + 1,
        ...data,
        created_at: new Date().toISOString()
      };
      return { data: newClient };
    },
    getAll: async () => {
      await delay();
      return { data: DEMO_CLIENTS };
    },
    getById: async (id: number) => {
      await delay();
      const client = DEMO_CLIENTS.find(c => c.id === id);
      if (!client) throw new Error('Client not found');
      return { data: client };
    },
    update: async (id: number, data: any) => {
      await delay();
      const client = DEMO_CLIENTS.find(c => c.id === id);
      if (!client) throw new Error('Client not found');
      return { data: { ...client, ...data } };
    },
    delete: async (id: number) => {
      await delay();
      return { data: { success: true } };
    }
  },

  // Tasks
  tasks: {
    create: async (data: any) => {
      await delay();
      const newTask = {
        id: DEMO_TASKS.length + 1,
        ...data,
        status: 'assigned',
        checklist: data.checklist || [],
        notes: data.notes || '',
        proof_of_work: [],
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      };
      return { data: newTask };
    },
    getAll: async () => {
      await delay();
      return { data: DEMO_TASKS };
    },
    getById: async (id: number) => {
      await delay();
      const task = DEMO_TASKS.find(t => t.id === id);
      if (!task) throw new Error('Task not found');
      return { data: task };
    },
    update: async (id: number, data: any) => {
      await delay();
      const task = DEMO_TASKS.find(t => t.id === id);
      if (!task) throw new Error('Task not found');
      return { data: { ...task, ...data, updated_at: new Date().toISOString() } };
    },
    cancel: async (id: number, reason: string) => {
      await delay();
      const task = DEMO_TASKS.find(t => t.id === id);
      if (!task) throw new Error('Task not found');
      return { data: { ...task, status: 'cancelled', cancellation_reason: reason } };
    },
    assign: async (id: number, userId: number) => {
      await delay();
      const task = DEMO_TASKS.find(t => t.id === id);
      if (!task) throw new Error('Task not found');
      return { data: { ...task, assigned_to: [...(task.assigned_to || []), userId] } };
    },
    assignMultiple: async (id: number, userIds: number[]) => {
      await delay();
      const task = DEMO_TASKS.find(t => t.id === id);
      if (!task) throw new Error('Task not found');
      return { data: { ...task, assigned_to: userIds } };
    },
    unassign: async (id: number, userId: number) => {
      await delay();
      const task = DEMO_TASKS.find(t => t.id === id);
      if (!task) throw new Error('Task not found');
      const assigned_to = (task.assigned_to || []).filter(id => id !== userId);
      return { data: { ...task, assigned_to } };
    },
    addChecklistItem: async (taskId: number, item: any) => {
      await delay();
      const task = DEMO_TASKS.find(t => t.id === taskId);
      if (!task) throw new Error('Task not found');
      const checklist = [...(task.checklist || []), item];
      return { data: { ...task, checklist } };
    },
    updateChecklistItem: async (taskId: number, index: number, update: any) => {
      await delay();
      const task = DEMO_TASKS.find(t => t.id === taskId);
      if (!task) throw new Error('Task not found');
      const checklist = [...(task.checklist || [])];
      checklist[index] = { ...checklist[index], ...update };
      return { data: { ...task, checklist } };
    },
    removeChecklistItem: async (taskId: number, index: number) => {
      await delay();
      const task = DEMO_TASKS.find(t => t.id === taskId);
      if (!task) throw new Error('Task not found');
      const checklist = (task.checklist || []).filter((_, i) => i !== index);
      return { data: { ...task, checklist } };
    }
  },

  // Messages
  messages: {
    create: async (data: any) => {
      await delay();
      const newMessage = {
        id: Date.now(),
        ...data,
        created_at: new Date().toISOString()
      };
      return { data: newMessage };
    },
    getAll: async (params?: any) => {
      await delay();
      return { data: [] }; // Empty messages for demo
    }
  }
};
