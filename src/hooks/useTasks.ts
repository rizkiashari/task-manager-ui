import { useState, useCallback, useMemo } from "react";
import { useTaskStore } from "../store/taskStore";
import moment from "moment";

export interface TaskFilters {
  searchTerm: string;
  filter: "all" | "completed" | "pending" | "new";
  sortBy: "created" | "updated" | "title" | "pic_name";
  showCompleted: boolean;
}

export const useTasks = () => {
  const { tasks, loading, error, addTask, deleteTask, toggleTask, loadTasks } =
    useTaskStore();
  const [filters, setFilters] = useState<TaskFilters>({
    searchTerm: "",
    filter: "all",
    sortBy: "created",
    showCompleted: true,
  });

  // Load tasks on mount
  const initializeTasks = useCallback(() => {
    loadTasks();
  }, [loadTasks]);

  // Create new task
  const createTask = useCallback(
    async (taskData: {
      title: string;
      description?: string;
      end_date: string;
      start_date: string;
      pic_name: string;
    }) => {
      try {
        addTask({
          ...taskData,
          completed: false,
        });
        return { success: true };
      } catch {
        return { success: false, error: "Failed to create task" };
      }
    },
    [addTask]
  );

  // Delete task
  const removeTask = useCallback(
    async (taskId: string) => {
      try {
        deleteTask(taskId);
        return { success: true };
      } catch {
        return { success: false, error: "Failed to delete task" };
      }
    },
    [deleteTask]
  );

  // Toggle task completion
  const toggleTaskCompletion = useCallback(
    async (taskId: string) => {
      try {
        toggleTask(taskId);
        return { success: true };
      } catch {
        return { success: false, error: "Failed to toggle task" };
      }
    },
    [toggleTask]
  );

  // Filter and sort tasks
  const filteredAndSortedTasks = useMemo(() => {
    return tasks
      .filter((task) => {
        // Search filter
        if (filters.searchTerm) {
          const searchLower = filters.searchTerm.toLowerCase();
          if (
            !task.title.toLowerCase().includes(searchLower) &&
            !(task.description?.toLowerCase().includes(searchLower) || false) &&
            !(task.pic_name?.toLowerCase().includes(searchLower) || false)
          ) {
            return false;
          }
        }

        // Status filter
        if (filters.filter === "completed" && !task.completed) return false;
        if (filters.filter === "pending" && task.completed) return false;
        if (filters.filter === "new") {
          const oneDayAgo = moment().subtract(1, "day");
          if (moment(task.createdAt).isSameOrBefore(oneDayAgo)) return false;
        }

        // Show/hide completed
        if (!filters.showCompleted && task.completed) return false;

        return true;
      })
      .sort((a, b) => {
        switch (filters.sortBy) {
          case "created":
            if (a.completed !== b.completed) {
              return a.completed ? 1 : -1;
            }
            return (
              moment(b.createdAt).valueOf() - moment(a.createdAt).valueOf()
            );
          case "updated":
            if (a.completed !== b.completed) {
              return a.completed ? 1 : -1;
            }
            return (
              moment(b.updatedAt).valueOf() - moment(a.updatedAt).valueOf()
            );
          case "title":
            if (a.completed !== b.completed) {
              return a.completed ? 1 : -1;
            }
            return a.title.localeCompare(b.title);

          case "pic_name":
            if (a.completed !== b.completed) {
              return a.completed ? 1 : -1;
            }
            return a.pic_name.localeCompare(b.pic_name);
          default:
            return 0;
        }
      });
  }, [tasks, filters]);

  // Separate new and old tasks
  const { newTasks, oldTasks } = useMemo(() => {
    const oneDayAgo = moment().subtract(1, "day");

    const newTasks = filteredAndSortedTasks.filter((task) =>
      moment(task.createdAt).isAfter(oneDayAgo)
    );
    const oldTasks = filteredAndSortedTasks.filter((task) =>
      moment(task.createdAt).isSameOrBefore(oneDayAgo)
    );

    return { newTasks, oldTasks };
  }, [filteredAndSortedTasks]);

  // Calculate statistics
  const statistics = useMemo(() => {
    const totalTasks = tasks.length;
    const completedTasks = tasks.filter((t) => t.completed).length;
    const pendingTasks = totalTasks - completedTasks;

    return {
      total: totalTasks,
      completed: completedTasks,
      pending: pendingTasks,
      new: newTasks.length,
    };
  }, [tasks, newTasks]);

  // Update filters
  const updateFilters = useCallback((newFilters: Partial<TaskFilters>) => {
    setFilters((prev) => ({ ...prev, ...newFilters }));
  }, []);

  // Reset filters
  const resetFilters = useCallback(() => {
    setFilters({
      searchTerm: "",
      filter: "all",
      sortBy: "created",
      showCompleted: true,
    });
  }, []);

  return {
    // State
    tasks: filteredAndSortedTasks,
    newTasks,
    oldTasks,
    statistics,
    loading,
    error,
    filters,

    // Actions
    initializeTasks,
    createTask,
    removeTask,
    toggleTaskCompletion,
    updateFilters,
    resetFilters,
  };
};
