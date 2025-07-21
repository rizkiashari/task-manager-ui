import { useState, useCallback } from "react";
import { Task } from "../types/task";

export interface TaskActionState {
  isToggling: boolean;
  isDeleting: boolean;
  showDeleteConfirm: boolean;
  taskId: string | null;
}

export const useTaskActions = () => {
  const [actionState, setActionState] = useState<TaskActionState>({
    isToggling: false,
    isDeleting: false,
    showDeleteConfirm: false,
    taskId: null,
  });

  // Toggle task completion
  const toggleTask = useCallback(
    async (
      taskId: string,
      onToggle: (
        taskId: string
      ) => Promise<{ success: boolean; error?: string }>
    ) => {
      setActionState((prev) => ({ ...prev, isToggling: true, taskId }));

      try {
        const result = await onToggle(taskId);

        if (!result.success) {
          console.error("Failed to toggle task:", result.error);
        }

        return result;
      } catch (error) {
        console.error("Error toggling task:", error);
        return { success: false, error: "An unexpected error occurred" };
      } finally {
        setActionState((prev) => ({
          ...prev,
          isToggling: false,
          taskId: null,
        }));
      }
    },
    []
  );

  // Show delete confirmation
  const showDeleteConfirm = useCallback((taskId: string) => {
    setActionState((prev) => ({
      ...prev,
      showDeleteConfirm: true,
      taskId,
    }));
  }, []);

  // Hide delete confirmation
  const hideDeleteConfirm = useCallback(() => {
    setActionState((prev) => ({
      ...prev,
      showDeleteConfirm: false,
      taskId: null,
    }));
  }, []);

  // Delete task
  const deleteTask = useCallback(
    async (
      taskId: string,
      onDelete: (
        taskId: string
      ) => Promise<{ success: boolean; error?: string }>
    ) => {
      setActionState((prev) => ({ ...prev, isDeleting: true }));

      try {
        const result = await onDelete(taskId);

        if (result.success) {
          hideDeleteConfirm();
        } else {
          console.error("Failed to delete task:", result.error);
        }

        return result;
      } catch (error) {
        console.error("Error deleting task:", error);
        return { success: false, error: "An unexpected error occurred" };
      } finally {
        setActionState((prev) => ({ ...prev, isDeleting: false }));
      }
    },
    [hideDeleteConfirm]
  );

  // Cancel delete action
  const cancelDelete = useCallback(() => {
    hideDeleteConfirm();
  }, [hideDeleteConfirm]);

  // Check if task is being toggled
  const isTaskToggling = useCallback(
    (taskId: string) => {
      return actionState.isToggling && actionState.taskId === taskId;
    },
    [actionState.isToggling, actionState.taskId]
  );

  // Check if task is being deleted
  const isTaskDeleting = useCallback(
    (taskId: string) => {
      return actionState.isDeleting && actionState.taskId === taskId;
    },
    [actionState.isDeleting, actionState.taskId]
  );

  // Get task being processed
  const getProcessingTaskId = useCallback(() => {
    return actionState.taskId;
  }, [actionState.taskId]);

  // Check if any action is in progress
  const isAnyActionInProgress = useCallback(() => {
    return actionState.isToggling || actionState.isDeleting;
  }, [actionState.isToggling, actionState.isDeleting]);

  // Reset all actions
  const resetActions = useCallback(() => {
    setActionState({
      isToggling: false,
      isDeleting: false,
      showDeleteConfirm: false,
      taskId: null,
    });
  }, []);

  return {
    // State
    actionState,

    // Actions
    toggleTask,
    showDeleteConfirm,
    hideDeleteConfirm,
    deleteTask,
    cancelDelete,
    resetActions,

    // Utilities
    isTaskToggling,
    isTaskDeleting,
    getProcessingTaskId,
    isAnyActionInProgress,
  };
};
