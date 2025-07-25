import { create } from "zustand";
import { Task } from "../types/task";
import {
  dummyTasks,
  generateId,
  getCurrentTimestamp,
} from "../data/dummyTasks";

interface TaskStore {
  tasks: Task[];
  loading: boolean;
  error: string | null;
  setTasks: (tasks: Task[]) => void;
  setLoading: (loading: boolean) => void;
  setError: (error: string | null) => void;
  addTask: (task: Omit<Task, "id" | "createdAt" | "updatedAt">) => void;
  deleteTask: (id: string) => void;
  toggleTask: (id: string) => void;
  clearError: () => void;
  loadTasks: () => void;
}

export const useTaskStore = create<TaskStore>((set, get) => ({
  tasks: [],
  loading: false,
  error: null,

  setTasks: (tasks) => set({ tasks }),
  setLoading: (loading) => set({ loading }),
  setError: (error) => set({ error }),

  loadTasks: () => {
    set({ loading: true, error: null });
    try {
      // Simulate API delay
      setTimeout(() => {
        set({ tasks: [...dummyTasks], loading: false });
      }, 500);
    } catch {
      set({ error: "Failed to load tasks", loading: false });
    }
  },

  addTask: (taskData) => {
    const { tasks } = get();
    const newTask: Task = {
      ...taskData,
      id: generateId(),
      createdAt: getCurrentTimestamp(),
      updatedAt: getCurrentTimestamp(),
    };
    set({ tasks: [newTask, ...tasks] });
  },

  deleteTask: (id) => {
    const { tasks } = get();
    set({ tasks: tasks.filter((task) => task.id !== id) });
  },

  toggleTask: (id) => {
    const { tasks } = get();
    set({
      tasks: tasks.map((task) =>
        task.id === id
          ? {
              ...task,
              completed: !task.completed,
              updatedAt: getCurrentTimestamp(),
            }
          : task
      ),
    });
  },

  clearError: () => set({ error: null }),
}));
