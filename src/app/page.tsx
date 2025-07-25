"use client";

import { useEffect } from "react";
import { useTasks } from "../hooks";
import { AddTaskForm } from "../components/AddTaskForm";
import { TaskItem } from "../components/TaskItem";
import { NewTaskIndicator } from "../components/NewTaskIndicator";
import { PDFReport } from "../components/PDFReport";

export default function Home() {
  const {
    tasks,
    newTasks,
    oldTasks,
    statistics,
    loading,
    error,
    filters,
    initializeTasks,
    updateFilters,
  } = useTasks();

  useEffect(() => {
    initializeTasks();
  }, [initializeTasks]);

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto" />
          <p className="mt-4 text-gray-600">Loading tasks...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="text-red-600 text-xl mb-4">⚠️</div>
          <p className="text-gray-600">{error}</p>
          <button
            onClick={() => window.location.reload()}
            className="mt-4 px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 cursor-pointer"
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-6xl mx-auto">
          {/* Header */}
          <div className="text-center mb-8">
            <h1 className="text-4xl font-bold text-gray-900 mb-2">
              📋 Task Management
            </h1>
            <p className="text-gray-600">
              Organize your tasks with simple and clean interface
            </p>
          </div>

          {/* Statistics Cards */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
            <div className="bg-white p-3 rounded-lg shadow-sm text-center">
              <div className="text-2xl font-bold text-blue-600">
                {statistics.total}
              </div>
              <div className="text-xs text-gray-500">Total</div>
            </div>
            <div className="bg-white p-3 rounded-lg shadow-sm text-center">
              <div className="text-2xl font-bold text-yellow-600">
                {statistics.pending}
              </div>
              <div className="text-xs text-gray-500">Pending</div>
            </div>
            <div className="bg-white p-3 rounded-lg shadow-sm text-center">
              <div className="text-2xl font-bold text-green-600">
                {statistics.completed}
              </div>
              <div className="text-xs text-gray-500">Completed</div>
            </div>
            <div className="bg-white p-3 rounded-lg shadow-sm text-center">
              <div className="text-2xl font-bold text-green-500">
                {statistics.new}
              </div>
              <div className="text-xs text-gray-500">New</div>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
            {/* Left Column - Add Task Form */}
            <div className="lg:col-span-1">
              <AddTaskForm />
            </div>

            {/* Right Column - Task List and Controls */}
            <div className="lg:col-span-3 space-y-6">
              {/* Controls */}
              <div className="bg-white p-4 rounded-lg shadow-sm">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                  {/* Search */}
                  <div className="lg:col-span-2">
                    <label
                      htmlFor="search"
                      className="block text-sm font-medium text-gray-700 mb-1"
                    >
                      Search Tasks
                    </label>
                    <input
                      type="text"
                      id="search"
                      placeholder="Search by title or or pic name or description..."
                      value={filters.searchTerm}
                      onChange={(e) =>
                        updateFilters({ searchTerm: e.target.value })
                      }
                      className="w-full px-3 py-2 border text-gray-500 border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    />
                  </div>

                  {/* Filter */}
                  <div>
                    <label
                      htmlFor="filter"
                      className="block text-sm font-medium text-gray-700 mb-1"
                    >
                      Filter
                    </label>
                    <select
                      id="filter"
                      value={filters.filter}
                      onChange={(e) =>
                        updateFilters({
                          filter: e.target.value as
                            | "all"
                            | "completed"
                            | "pending"
                            | "new",
                        })
                      }
                      className="w-full px-3 py-2 border text-gray-500 border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    >
                      <option value="all">All Tasks</option>
                      <option value="pending">Pending</option>
                      <option value="completed">Completed</option>
                      <option value="new">New (Today)</option>
                    </select>
                  </div>

                  {/* Sort */}
                  <div>
                    <label
                      htmlFor="sort"
                      className="block text-sm font-medium text-gray-700 mb-1"
                    >
                      Sort By
                    </label>
                    <select
                      id="sort"
                      value={filters.sortBy}
                      onChange={(e) =>
                        updateFilters({
                          sortBy: e.target.value as
                            | "created"
                            | "updated"
                            | "title",
                        })
                      }
                      className="w-full px-3 py-2 border text-gray-500 border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    >
                      <option value="created">Created Date</option>
                      <option value="updated">Updated Date</option>
                      <option value="title">Title</option>
                      <option value="pic_name">Pic Name</option>
                    </select>
                  </div>
                </div>

                {/* Show Completed Toggle */}
                <div className="mt-4 flex items-center">
                  <label className="flex items-center">
                    <input
                      type="checkbox"
                      checked={filters.showCompleted}
                      onChange={(e) =>
                        updateFilters({ showCompleted: e.target.checked })
                      }
                      className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                    />
                    <span className="ml-2 text-sm text-gray-700">
                      Show Completed
                    </span>
                  </label>
                </div>
              </div>

              {/* PDF Report */}
              <PDFReport tasks={tasks} />

              {/* Task List */}
              <div className="space-y-4">
                {tasks.length === 0 ? (
                  <div className="text-center py-12 bg-white rounded-lg shadow-sm">
                    <div className="text-6xl mb-4">📝</div>
                    <h3 className="text-lg font-medium text-gray-900 mb-2">
                      {filters.searchTerm ? "No tasks found" : "No tasks yet"}
                    </h3>
                    <p className="text-gray-600">
                      {filters.searchTerm
                        ? `No tasks match "${filters.searchTerm}"`
                        : "Create your first task to get started!"}
                    </p>
                  </div>
                ) : (
                  <>
                    {/* New Tasks Section */}
                    {newTasks.length > 0 && (
                      <div>
                        <NewTaskIndicator count={newTasks.length} />
                        <div className="space-y-4 mt-4">
                          {newTasks.map((task) => (
                            <TaskItem key={task.id} task={task} />
                          ))}
                        </div>
                      </div>
                    )}

                    {/* Old Tasks Section */}
                    {oldTasks.length > 0 && (
                      <div className={newTasks.length > 0 ? "mt-8" : ""}>
                        {newTasks.length > 0 && (
                          <h3 className="text-lg font-medium text-gray-900 mb-4">
                            Previous Tasks
                          </h3>
                        )}
                        <div className="space-y-4">
                          {oldTasks.map((task) => (
                            <TaskItem key={task.id} task={task} />
                          ))}
                        </div>
                      </div>
                    )}
                  </>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
