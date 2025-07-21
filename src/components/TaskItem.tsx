"use client";

import React from "react";
import { Task } from "../types/task";
import { useTaskActions } from "../hooks/useTaskActions";
import { useTasks } from "../hooks/useTasks";
import { ConfirmDialog } from "./ConfirmDialog";
import { SpinnerIcon, CheckmarkIcon, PendingIcon, DeleteIcon } from "./icons";

interface TaskItemProps {
  task: Task;
}

export const TaskItem: React.FC<TaskItemProps> = ({ task }) => {
  const { toggleTaskCompletion, removeTask } = useTasks();
  const {
    actionState,
    toggleTask,
    showDeleteConfirm,
    deleteTask,
    cancelDelete,
    isTaskToggling,
    isTaskDeleting,
  } = useTaskActions();

  const handleToggle = async () => {
    await toggleTask(task.id, toggleTaskCompletion);
  };

  const handleDelete = async () => {
    await deleteTask(task.id, removeTask);
  };

  const handleShowDeleteConfirm = () => {
    showDeleteConfirm(task.id);
  };

  return (
    <>
      <div
        className={`p-4 border rounded-lg shadow-sm transition-all ${
          task.completed
            ? "opacity-75 bg-gray-50 border-gray-200"
            : "bg-white border-gray-200 hover:shadow-md"
        }`}
      >
        <div className="flex items-start justify-between">
          <div className="flex-1">
            <h3
              className={`text-lg font-medium ${
                task.completed ? "line-through text-gray-500" : "text-gray-900"
              }`}
            >
              {task.title}
            </h3>

            {task.description && (
              <p
                className={`text-sm mt-1 ${
                  task.completed ? "text-gray-400" : "text-gray-600"
                }`}
              >
                {task.description}
              </p>
            )}
          </div>

          <div className="flex items-center space-x-2 ml-4">
            <button
              onClick={handleToggle}
              disabled={isTaskToggling(task.id)}
              className={`p-2 rounded-md transition-colors cursor-pointer ${
                task.completed
                  ? "bg-green-100 text-green-600 hover:bg-green-200"
                  : "bg-gray-100 text-gray-600 hover:bg-gray-200"
              } ${
                isTaskToggling(task.id) ? "opacity-50 cursor-not-allowed" : ""
              }`}
              title={task.completed ? "Mark as pending" : "Mark as completed"}
            >
              {isTaskToggling(task.id) ? (
                <SpinnerIcon className="animate-spin h-4 w-4" />
              ) : task.completed ? (
                <CheckmarkIcon className="h-4 w-4" />
              ) : (
                <PendingIcon className="h-4 w-4" />
              )}
            </button>

            <button
              onClick={handleShowDeleteConfirm}
              disabled={isTaskDeleting(task.id)}
              className={`p-2 rounded-md transition-colors cursor-pointer bg-red-100 text-red-600 hover:bg-red-200 ${
                isTaskDeleting(task.id) ? "opacity-50 cursor-not-allowed" : ""
              }`}
              title="Delete task"
            >
              {isTaskDeleting(task.id) ? (
                <SpinnerIcon className="animate-spin h-4 w-4" />
              ) : (
                <DeleteIcon className="h-4 w-4" />
              )}
            </button>
          </div>
        </div>
      </div>

      <ConfirmDialog
        isOpen={actionState.showDeleteConfirm && actionState.taskId === task.id}
        onClose={cancelDelete}
        onConfirm={handleDelete}
        title="Delete Task"
        message={`Are you sure you want to delete the task "${task.title}"? This action cannot be undone.`}
        confirmText="Delete"
        cancelText="Cancel"
        type="danger"
      />
    </>
  );
};
