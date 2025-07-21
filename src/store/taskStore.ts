import { create } from "zustand";
import moment from "moment";
import { Task } from "../types/task";
import { taskApi } from "../services/api";

interface TaskStore {
  tasks: Task[];
  loading: boolean;
  error: string | null;
  setTasks: (tasks: Task[]) => void;
  setLoading: (loading: boolean) => void;
  setError: (error: string | null) => void;
  addTask: (task: Task) => void;
  deleteTask: (id: string) => void;
  toggleTask: (id: string) => void;
  clearError: () => void;
}

export const useTaskStore = create<TaskStore>((set, get) => ({
  tasks: [],
  loading: false,
  error: null,

  setTasks: (tasks) => set({ tasks }),
  setLoading: (loading) => set({ loading }),
  setError: (error) => set({ error }),

  addTask: (task) => {
    const { tasks } = get();
    set({ tasks: [task, ...tasks] });
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
              updatedAt: moment().toISOString(),
            }
          : task
      ),
    });
  },

  clearError: () => set({ error: null }),
}));
