"use client";

import React, { useEffect } from "react";
import { useTaskStore } from "../store/taskStore";
import { taskApi } from "../services/api";
import TaskItem from "./TaskItem";
import NewTaskIndicator from "./NewTaskIndicator";

const TaskList: React.FC = () => {
  const { tasks, loading, error, setTasks, setLoading, setError, clearError } =
    useTaskStore();

  useEffect(() => {
    const fetchTasks = async () => {
      try {
        setLoading(true);
        clearError();
        const fetchedTasks = await taskApi.getTasks();
        setTasks(fetchedTasks);
      } catch (err) {
        setError(err instanceof Error ? err.message : "Failed to fetch tasks");
      } finally {
        setLoading(false);
      }
    };

    fetchTasks();
  }, [setTasks, setLoading, setError, clearError]);

  if (loading) {
    return (
      <div className="flex justify-center items-center py-8">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-6">
        <div className="flex">
          <div className="flex-shrink-0">
            <svg
              className="h-5 w-5 text-red-400"
              viewBox="0 0 20 20"
              fill="currentColor"
            >
              <path
                fillRule="evenodd"
                d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z"
                clipRule="evenodd"
              />
            </svg>
          </div>
          <div className="ml-3">
            <h3 className="text-sm font-medium text-red-800">
              Error loading tasks
            </h3>
            <div className="mt-2 text-sm text-red-700">{error}</div>
          </div>
        </div>
      </div>
    );
  }

  if (tasks.length === 0) {
    return (
      <div className="text-center py-12">
        <svg
          className="mx-auto h-12 w-12 text-gray-400"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M9 5H7a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"
          />
        </svg>
        <h3 className="mt-2 text-sm font-medium text-gray-900">No tasks</h3>
        <p className="mt-1 text-sm text-gray-500">
          Get started by creating a new task.
        </p>
      </div>
    );
  }

  // Separate new tasks (last 24 hours) from older tasks
  const now = new Date();
  const twentyFourHoursAgo = new Date(now.getTime() - 24 * 60 * 60 * 1000);

  const newTasks = tasks.filter(
    (task) => new Date(task.createdAt) > twentyFourHoursAgo
  );

  const olderTasks = tasks.filter(
    (task) => new Date(task.createdAt) <= twentyFourHoursAgo
  );

  return (
    <div className="space-y-4">
      <h2 className="text-lg font-semibold text-gray-900 mb-4">Your Tasks</h2>

      {/* Show new tasks with special styling */}
      <NewTaskIndicator tasks={newTasks} />

      {/* Show older tasks */}
      {olderTasks.length > 0 && (
        <div className="space-y-3">
          <div className="flex items-center mb-3">
            <span className="text-sm font-medium text-gray-600">
              All Tasks ({olderTasks.length})
            </span>
            <div className="flex-1 border-t border-gray-200 ml-3"></div>
          </div>

          {olderTasks
            .sort(
              (a, b) =>
                new Date(b.createdAt).getTime() -
                new Date(a.createdAt).getTime()
            )
            .map((task) => (
              <TaskItem key={task.id} task={task} />
            ))}
        </div>
      )}
    </div>
  );
};

export default TaskList;
