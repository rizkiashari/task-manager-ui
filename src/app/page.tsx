"use client";

import { useEffect, useState } from "react";
import moment from "moment";
import { useTaskStore } from "../store/taskStore";
import { taskApi } from "../services/api";
import { AddTaskForm } from "../components/AddTaskForm";
import { TaskItem } from "../components/TaskItem";
import { NewTaskIndicator } from "../components/NewTaskIndicator";
import { PDFReport } from "../components/PDFReport";
import { Task } from "../types/task";

export default function Home() {
  const { tasks, setTasks, loading, setLoading, error, setError } =
    useTaskStore();
  const [filter, setFilter] = useState<string>("all");
  const [sortBy, setSortBy] = useState<string>("created");
  const [searchTerm, setSearchTerm] = useState("");
  const [showCompleted, setShowCompleted] = useState(true);
  const [isGeneratingPDF, setIsGeneratingPDF] = useState(false);

  useEffect(() => {
    const fetchTasks = async () => {
      try {
        setLoading(true);
        const fetchedTasks = await taskApi.getTasks();
        setTasks(fetchedTasks);
      } catch (error) {
        setError("Failed to fetch tasks");
        console.error("Error fetching tasks:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchTasks();
  }, [setTasks, setLoading, setError]);

  // Filter and sort tasks
  const filteredAndSortedTasks = tasks
    .filter((task) => {
      // Search filter
      if (searchTerm) {
        const searchLower = searchTerm.toLowerCase();
        if (
          !task.title.toLowerCase().includes(searchLower) &&
          !(task.description?.toLowerCase().includes(searchLower) || false)
        ) {
          return false;
        }
      }

      // Status filter
      if (filter === "completed" && !task.completed) return false;
      if (filter === "pending" && task.completed) return false;
      if (filter === "new") {
        const oneDayAgo = moment().subtract(1, "day");
        if (moment(task.createdAt).isSameOrBefore(oneDayAgo)) return false;
      }

      // Show/hide completed
      if (!showCompleted && task.completed) return false;

      return true;
    })
    .sort((a, b) => {
      switch (sortBy) {
        case "created":
          if (a.completed !== b.completed) {
            return a.completed ? 1 : -1;
          }
          return moment(b.createdAt).valueOf() - moment(a.createdAt).valueOf();
        case "updated":
          if (a.completed !== b.completed) {
            return a.completed ? 1 : -1;
          }
          return moment(b.updatedAt).valueOf() - moment(a.updatedAt).valueOf();
        case "title":
          if (a.completed !== b.completed) {
            return a.completed ? 1 : -1;
          }
          return a.title.localeCompare(b.title);
        default:
          return 0;
      }
    });

  // Separate new and old tasks
  const oneDayAgo = moment().subtract(1, "day");

  const newTasks = filteredAndSortedTasks.filter((task) =>
    moment(task.createdAt).isAfter(oneDayAgo)
  );
  const oldTasks = filteredAndSortedTasks.filter((task) =>
    moment(task.createdAt).isSameOrBefore(oneDayAgo)
  );

  // Calculate statistics
  const totalTasks = tasks.length;
  const completedTasks = tasks.filter((t) => t.completed).length;
  const pendingTasks = totalTasks - completedTasks;

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
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
            className="mt-4 px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
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
                {totalTasks}
              </div>
              <div className="text-xs text-gray-500">Total</div>
            </div>
            <div className="bg-white p-3 rounded-lg shadow-sm text-center">
              <div className="text-2xl font-bold text-yellow-600">
                {pendingTasks}
              </div>
              <div className="text-xs text-gray-500">Pending</div>
            </div>
            <div className="bg-white p-3 rounded-lg shadow-sm text-center">
              <div className="text-2xl font-bold text-green-600">
                {completedTasks}
              </div>
              <div className="text-xs text-gray-500">Completed</div>
            </div>
            <div className="bg-white p-3 rounded-lg shadow-sm text-center">
              <div className="text-2xl font-bold text-green-500">
                {newTasks.length}
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
                      placeholder="Search by title or description..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
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
                      value={filter}
                      onChange={(e) => setFilter(e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
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
                      value={sortBy}
                      onChange={(e) => setSortBy(e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    >
                      <option value="created">Created Date</option>
                      <option value="updated">Updated Date</option>
                      <option value="title">Title</option>
                    </select>
                  </div>
                </div>

                {/* Show Completed Toggle */}
                <div className="mt-4 flex items-center">
                  <label className="flex items-center">
                    <input
                      type="checkbox"
                      checked={showCompleted}
                      onChange={(e) => setShowCompleted(e.target.checked)}
                      className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                    />
                    <span className="ml-2 text-sm text-gray-700">
                      Show Completed
                    </span>
                  </label>
                </div>
              </div>

              {/* PDF Report */}
              <PDFReport
                tasks={tasks}
                onGenerate={() => {
                  setIsGeneratingPDF(true);
                  // Reset loading state after a short delay
                  setTimeout(() => setIsGeneratingPDF(false), 2000);
                }}
                isGenerating={isGeneratingPDF}
              />

              {/* Task List */}
              <div className="space-y-4">
                {filteredAndSortedTasks.length === 0 ? (
                  <div className="text-center py-12 bg-white rounded-lg shadow-sm">
                    <div className="text-6xl mb-4">📝</div>
                    <h3 className="text-lg font-medium text-gray-900 mb-2">
                      {searchTerm ? "No tasks found" : "No tasks yet"}
                    </h3>
                    <p className="text-gray-600">
                      {searchTerm
                        ? `No tasks match "${searchTerm}"`
                        : "Create your first task to get started!"}
                    </p>
                  </div>
                ) : (
                  <>
                    {/* New Tasks Section */}
                    {newTasks.length > 0 && (
                      <div>
                        <NewTaskIndicator count={newTasks.length} />
                        <div className="space-y-3 mt-3">
                          {newTasks.map((task) => (
                            <TaskItem key={task.id} task={task} />
                          ))}
                        </div>
                      </div>
                    )}

                    {/* Old Tasks Section */}
                    {oldTasks.length > 0 && (
                      <div>
                        {newTasks.length > 0 && (
                          <div className="border-t border-gray-200 my-6"></div>
                        )}
                        <div className="space-y-3">
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
