import React from "react";
import { useTaskForm } from "../hooks/useTaskForm";
import { useTasks } from "../hooks/useTasks";
import { ConfirmDialog } from "./ConfirmDialog";
import { SuccessIcon, ErrorIcon, SpinnerIcon, PlusIcon } from "./icons";

export const AddTaskForm: React.FC = () => {
  const { createTask } = useTasks();
  const {
    formData,
    errors,
    isSubmitting,
    showConfirm,
    titleCharacterCount,
    descriptionCharacterCount,
    isTitleAtLimit,
    isDescriptionAtLimit,
    updateField,
    handleSubmit,
    handleConfirm,
    handleCancel,
  } = useTaskForm();

  const handleConfirmAdd = async () => {
    await handleConfirm(createTask);
  };

  return (
    <div className="bg-white p-6 rounded-lg shadow-md">
      <h2 className="text-xl font-semibold text-gray-900 mb-4">
        ➕ Add New Task
      </h2>

      {/* Error Messages */}
      {errors.length > 0 && (
        <div className="mb-4 p-3 bg-red-100 border border-red-400 text-red-700 rounded-md">
          <div className="flex items-center">
            <ErrorIcon className="w-5 h-5 mr-2" />
            <ul className="list-disc list-inside">
              {errors.map((error, index) => (
                <li key={index}>{error}</li>
              ))}
            </ul>
          </div>
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Title Input */}
        <div>
          <label
            htmlFor="title"
            className="block text-sm font-medium text-gray-700 mb-1"
          >
            Title *
          </label>
          <input
            type="text"
            id="title"
            value={formData.title}
            onChange={(e) => updateField("title", e.target.value)}
            className={`w-full text-gray-500 px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${
              errors.length > 0 ? "border-red-300" : "border-gray-300"
            }`}
            placeholder="Enter task title..."
            maxLength={100}
          />
          <div className="flex justify-between items-center mt-1">
            <span className="text-xs text-gray-500">
              {titleCharacterCount}/100 characters
            </span>
            {isTitleAtLimit && (
              <span className="text-xs text-red-500">
                Character limit reached
              </span>
            )}
          </div>
        </div>

        {/* Description Input */}
        <div>
          <label
            htmlFor="description"
            className="block text-sm font-medium text-gray-700 mb-1"
          >
            Description (Optional)
          </label>
          <textarea
            id="description"
            value={formData.description}
            onChange={(e) => updateField("description", e.target.value)}
            rows={3}
            className={`w-full text-gray-500 px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${
              errors.length > 0 ? "border-red-300" : "border-gray-300"
            }`}
            placeholder="Enter task description..."
            maxLength={500}
          />
          <div className="flex justify-between items-center mt-1">
            <span className="text-xs text-gray-500">
              {descriptionCharacterCount}/500 characters
            </span>
            {isDescriptionAtLimit && (
              <span className="text-xs text-red-500">
                Character limit reached
              </span>
            )}
          </div>
        </div>

        {/* Submit Button */}
        <button
          type="submit"
          disabled={isSubmitting}
          className={`w-full flex items-center justify-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white cursor-pointer ${
            isSubmitting
              ? "bg-gray-400 cursor-not-allowed"
              : "bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
          }`}
        >
          {isSubmitting ? (
            <>
              <SpinnerIcon className="animate-spin -ml-1 mr-2 h-4 w-4" />
              Creating...
            </>
          ) : (
            <>
              <PlusIcon className="-ml-1 mr-2 h-4 w-4" />
              Create Task
            </>
          )}
        </button>
      </form>

      {/* Confirmation Dialog */}
      <ConfirmDialog
        isOpen={showConfirm}
        onClose={handleCancel}
        onConfirm={handleConfirmAdd}
        title="Create Task"
        message={`Are you sure you want to create the task "${formData.title}"?`}
        confirmText="Create Task"
        cancelText="Cancel"
        type="success"
      />
    </div>
  );
};
