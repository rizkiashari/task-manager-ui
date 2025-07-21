"use client";

import React from "react";
import { Task } from "../types/task";
import { useTaskStore } from "../store/taskStore";
import { taskApi } from "../services/api";

interface TaskItemProps {
  task: Task;
}

const TaskItem: React.FC<TaskItemProps> = ({ task }) => {
  const { toggleTask, deleteTask, setError, clearError } = useTaskStore();

  const handleToggle = async () => {
    try {
      clearError();
      await taskApi.toggleTask(task.id);
      toggleTask(task.id);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to toggle task");
    }
  };

  const handleDelete = async () => {
    if (!confirm("Are you sure you want to delete this task?")) {
      return;
    }

    try {
      clearError();
      await taskApi.deleteTask(task.id);
      deleteTask(task.id);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to delete task");
    }
  };

  return (
    <div
      className={`bg-white border rounded-lg p-4 shadow-sm transition-all duration-200 ${
        task.completed
          ? "border-green-200 bg-green-50"
          : "border-gray-200 hover:border-gray-300 hover:shadow-md"
      }`}
    >
      <div className="flex items-start justify-between">
        <div className="flex items-start space-x-3 flex-1">
          <button
            onClick={handleToggle}
            title="Toggle task completion"
            className={`mt-1 flex-shrink-0 w-5 h-5 rounded-full border-2 transition-colors duration-200 ${
              task.completed
                ? "bg-green-500 border-green-500 hover:bg-green-600"
                : "border-gray-300 hover:border-gray-400"
            }`}
          >
            {task.completed && (
              <svg
                className="w-full h-full text-white"
                fill="currentColor"
                viewBox="0 0 20 20"
              >
                <path
                  fillRule="evenodd"
                  d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                  clipRule="evenodd"
                />
              </svg>
            )}
          </button>

          <div className="flex-1 min-w-0">
            <h3
              className={`text-sm font-medium ${
                task.completed ? "text-green-800 line-through" : "text-gray-900"
              }`}
            >
              {task.title}
            </h3>
            {task.description && (
              <p
                className={`mt-1 text-sm ${
                  task.completed
                    ? "text-green-600 line-through"
                    : "text-gray-600"
                }`}
              >
                {task.description}
              </p>
            )}
            <div className="mt-2 flex items-center space-x-4 text-xs text-gray-500">
              <span>
                Created: {new Date(task.createdAt).toLocaleDateString()}
              </span>
              {task.updatedAt !== task.createdAt && (
                <span>
                  Updated: {new Date(task.updatedAt).toLocaleDateString()}
                </span>
              )}
            </div>
          </div>
        </div>

        <div className="flex items-center space-x-2 ml-4">
          <button
            onClick={handleDelete}
            className="text-gray-400 hover:text-red-500 transition-colors duration-200 p-1 rounded"
            title="Delete task"
          >
            <svg
              className="w-4 h-4"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
              />
            </svg>
          </button>
        </div>
      </div>
    </div>
  );
};

export default TaskItem;
