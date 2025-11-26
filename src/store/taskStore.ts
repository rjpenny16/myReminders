import { create } from 'zustand';
import { invoke } from '@tauri-apps/api/core';
import { Task, TaskInput, AppSettings } from '../types';

interface TaskStore {
  tasks: Task[];
  settings: AppSettings | null;
  loading: boolean;
  error: string | null;

  // Task operations
  loadTasks: () => Promise<void>;
  createTask: (task: TaskInput) => Promise<void>;
  updateTask: (task: Task) => Promise<void>;
  deleteTask: (id: string) => Promise<void>;
  completeTask: (id: string) => Promise<void>;
  snoozeTask: (id: string, minutes: number) => Promise<void>;

  // Export/Import operations
  exportTasks: (section?: string, completedOnly?: boolean) => Promise<void>;
  exportTasksAuto: () => Promise<void>;
  importTasks: (filePath?: string) => Promise<void>;

  // Settings operations
  loadSettings: () => Promise<void>;
  updateSettings: (patch: Partial<AppSettings>) => Promise<void>;

  // UI state
  commandPaletteOpen: boolean;
  aiPanelOpen: boolean;
  themeEditorOpen: boolean;
  settingsPanelOpen: boolean;
  pomodoroTimerOpen: boolean;
  exportMenuOpen: boolean;
  selectedTaskId: string | null;
  searchQuery: string;
  notification: { message: string; type: 'success' | 'error' | 'info' } | null;

  setCommandPaletteOpen: (open: boolean) => void;
  setAIPanelOpen: (open: boolean, taskId?: string) => void;
  setThemeEditorOpen: (open: boolean) => void;
  setSettingsPanelOpen: (open: boolean) => void;
  setPomodoroTimerOpen: (open: boolean) => void;
  setExportMenuOpen: (open: boolean) => void;
  setSearchQuery: (query: string) => void;
  showNotification: (message: string, type: 'success' | 'error' | 'info') => void;
  clearNotification: () => void;
}

export const useTaskStore = create<TaskStore>((set, get) => ({
  tasks: [],
  settings: null,
  loading: false,
  error: null,

  commandPaletteOpen: false,
  aiPanelOpen: false,
  themeEditorOpen: false,
  settingsPanelOpen: false,
  pomodoroTimerOpen: false,
  exportMenuOpen: false,
  selectedTaskId: null,
  searchQuery: '',
  notification: null,

  loadTasks: async () => {
    set({ loading: true, error: null });
    try {
      const tasks = await invoke<Task[]>('get_tasks');
      set({ tasks, loading: false });
    } catch (error) {
      set({ error: String(error), loading: false });
    }
  },

  createTask: async (taskInput: TaskInput) => {
    try {
      const task = await invoke<Task>('create_task', { taskInput });
      set((state) => ({ tasks: [...state.tasks, task] }));
    } catch (error) {
      set({ error: String(error) });
    }
  },

  updateTask: async (task: Task) => {
    try {
      const updated = await invoke<Task>('update_task', { task });
      set((state) => ({
        tasks: state.tasks.map((t) => (t.id === updated.id ? updated : t)),
      }));
    } catch (error) {
      set({ error: String(error) });
    }
  },

  deleteTask: async (id: string) => {
    try {
      // Auto-backup before deleting
      await get().exportTasksAuto();

      await invoke('delete_task', { id });
      set((state) => ({
        tasks: state.tasks.filter((t) => t.id !== id),
      }));
    } catch (error) {
      set({ error: String(error) });
    }
  },

  completeTask: async (id: string) => {
    try {
      await invoke('complete_task', { id });
      set((state) => ({
        tasks: state.tasks.filter((t) => t.id !== id),
      }));
    } catch (error) {
      set({ error: String(error) });
    }
  },

  snoozeTask: async (id: string, minutes: number) => {
    try {
      await invoke('snooze_task', { id, minutes });
      await get().loadTasks();
    } catch (error) {
      set({ error: String(error) });
    }
  },

  loadSettings: async () => {
    try {
      const settings = await invoke<AppSettings>('get_settings');
      set({ settings });
    } catch (error) {
      set({ error: String(error) });
    }
  },

  updateSettings: async (patch: Partial<AppSettings>) => {
    try {
      await invoke('set_settings', { patch });
      await get().loadSettings();
    } catch (error) {
      set({ error: String(error) });
    }
  },

  exportTasks: async (section?: string, completedOnly = false) => {
    try {
      const filePath = await invoke<string>('export_tasks', {
        section: section || null,
        completedOnly
      });
      get().showNotification(`Tasks exported successfully to ${filePath.split('/').pop()}`, 'success');
    } catch (error) {
      if (String(error) !== 'Export cancelled') {
        get().showNotification(`Export failed: ${error}`, 'error');
      }
    }
  },

  exportTasksAuto: async () => {
    try {
      await invoke<string>('export_tasks_auto');
    } catch (error) {
      console.error('Auto-backup failed:', error);
    }
  },

  importTasks: async (filePath?: string) => {
    try {
      const count = await invoke<number>('import_tasks', {
        filePath: filePath || null
      });
      await get().loadTasks();
      get().showNotification(`Successfully imported ${count} task${count !== 1 ? 's' : ''}`, 'success');
    } catch (error) {
      if (String(error) !== 'Import cancelled') {
        get().showNotification(`Import failed: ${error}`, 'error');
      }
    }
  },

  setCommandPaletteOpen: (open: boolean) => set({ commandPaletteOpen: open }),
  setAIPanelOpen: (open: boolean, taskId?: string) =>
    set({ aiPanelOpen: open, selectedTaskId: taskId || null }),
  setThemeEditorOpen: (open: boolean) => set({ themeEditorOpen: open }),
  setSettingsPanelOpen: (open: boolean) => set({ settingsPanelOpen: open }),
  setPomodoroTimerOpen: (open: boolean) => set({ pomodoroTimerOpen: open }),
  setExportMenuOpen: (open: boolean) => set({ exportMenuOpen: open }),
  setSearchQuery: (query: string) => set({ searchQuery: query }),

  showNotification: (message: string, type: 'success' | 'error' | 'info') => {
    set({ notification: { message, type } });
    setTimeout(() => get().clearNotification(), 4000);
  },

  clearNotification: () => set({ notification: null }),
}));
