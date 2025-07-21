import React from "react";
import { Task } from "../types/task";
import { useTaskStore } from "../store/taskStore";
import { taskApi } from "../services/api";

interface NewTaskIndicatorProps {
  tasks: Task[];
}

const NewTaskIndicator: React.FC<NewTaskIndicatorProps> = ({ tasks }) => {
  const { toggleTask, deleteTask } = useTaskStore();

  // Get tasks created in the last 24 hours
  const now = new Date();
  const twentyFourHoursAgo = new Date(now.getTime() - 24 * 60 * 60 * 1000);

  const newTasks = tasks.filter(
    (task) => new Date(task.createdAt) > twentyFourHoursAgo
  );

  const handleToggle = async (taskId: string) => {
    try {
      await taskApi.toggleTask(taskId);
      toggleTask(taskId);
    } catch (error) {
      console.error("Error toggling task:", error);
    }
  };

  const handleDelete = async (taskId: string) => {
    if (window.confirm("Are you sure you want to delete this task?")) {
      try {
        await taskApi.deleteTask(taskId);
        deleteTask(taskId);
      } catch (error) {
        console.error("Error deleting task:", error);
      }
    }
  };

  if (newTasks.length === 0) {
    return null;
  }

  return (
    <div className="mb-6">
      <div className="flex items-center mb-3">
        <div className="flex items-center">
          <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse mr-2"></div>
          <span className="text-sm font-medium text-green-700">
            New Tasks ({newTasks.length})
          </span>
        </div>
        <div className="flex-1 border-t border-green-200 ml-3"></div>
      </div>

      <div className="space-y-3">
        {newTasks
          .sort(
            (a, b) =>
              new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
          )
          .map((task) => (
            <div
              key={task.id}
              className="bg-gradient-to-r from-green-50 to-emerald-50 border-2 border-green-200 rounded-lg p-4 shadow-sm transition-all duration-200 hover:border-green-300 hover:shadow-md relative overflow-hidden"
            >
              {/* New task indicator */}
              <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-green-400 to-emerald-400"></div>

              <div className="flex items-start justify-between">
                <div className="flex items-start space-x-3 flex-1">
                  <button
                    onClick={() => handleToggle(task.id)}
                    title="Toggle task completion"
                    className={`mt-1 flex-shrink-0 w-5 h-5 rounded-full border-2 transition-colors duration-200 ${
                      task.completed
                        ? "bg-green-500 border-green-500 hover:bg-green-600"
                        : "border-green-400 hover:border-green-500"
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
                        task.completed
                          ? "text-green-600 line-through"
                          : "text-green-900"
                      }`}
                    >
                      {task.title}
                    </h3>
                    {task.description && (
                      <p
                        className={`mt-1 text-sm ${
                          task.completed ? "text-green-500" : "text-green-700"
                        }`}
                      >
                        {task.description}
                      </p>
                    )}
                    <div className="mt-2 flex items-center space-x-4 text-xs text-green-600">
                      <span>
                        Created: {new Date(task.createdAt).toLocaleDateString()}
                      </span>
                      <span className="flex items-center">
                        <svg
                          className="w-3 h-3 mr-1"
                          fill="currentColor"
                          viewBox="0 0 20 20"
                        >
                          <path
                            fillRule="evenodd"
                            d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                            clipRule="evenodd"
                          />
                        </svg>
                        New
                      </span>
                    </div>
                  </div>
                </div>

                <div className="flex items-center space-x-2 ml-4">
                  <button
                    onClick={() => handleDelete(task.id)}
                    title="Delete task"
                    className="text-green-400 hover:text-red-500 transition-colors duration-200 p-1 rounded"
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
          ))}
      </div>
    </div>
  );
};

export default NewTaskIndicator;
