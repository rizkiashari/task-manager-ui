import React from "react";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import "@testing-library/jest-dom";
import { TaskItem } from "../TaskItem";
import { useTaskStore } from "../../store/taskStore";
import { taskApi } from "../../services/api";

// Mock the store and API
jest.mock("../../store/taskStore");
jest.mock("../../services/api");
jest.mock("moment", () => {
  const originalMoment = jest.requireActual("moment");
  const mockMoment = () => {
    // Default mock for current time
    return {
      toISOString: () => "2024-01-15T10:00:00Z",
      isBefore: () => false,
      format: () => "Jan 15, 2024",
      fromNow: () => "just now",
    };
  };

  // Copy static methods
  Object.setPrototypeOf(mockMoment, originalMoment);
  Object.assign(mockMoment, originalMoment);

  return mockMoment;
});

const mockUseTaskStore = useTaskStore as jest.MockedFunction<
  typeof useTaskStore
>;
const mockTaskApi = taskApi as jest.Mocked<typeof taskApi>;

describe("TaskItem", () => {
  const mockTask = {
    id: "1",
    title: "Test Task",
    description: "Test Description",
    completed: false,
    priority: "medium" as const,
    dueDate: undefined,
    createdAt: "2024-01-15T10:00:00Z",
    updatedAt: "2024-01-15T10:00:00Z",
  };

  let mockTasks: (typeof mockTask)[];
  let mockSetTasks: jest.Mock;

  beforeEach(() => {
    jest.clearAllMocks();
    mockTasks = [mockTask];
    mockSetTasks = jest.fn((newTasks) => {
      mockTasks = newTasks;
    });

    // Mock the store with a simpler approach
    mockUseTaskStore.mockReturnValue({
      tasks: mockTasks,
      setTasks: mockSetTasks,
      loading: false,
      setLoading: jest.fn(),
      error: null,
      setError: jest.fn(),
      addTask: jest.fn(),
      deleteTask: jest.fn(),
      toggleTask: jest.fn(),
      clearError: jest.fn(),
    });
  });

  it("renders task title and description", () => {
    render(<TaskItem task={mockTask} />);

    expect(screen.getByText("Test Task")).toBeInTheDocument();
    expect(screen.getByText("Test Description")).toBeInTheDocument();
  });

  it("shows completed task with different styling", () => {
    const completedTask = { ...mockTask, completed: true };
    render(<TaskItem task={completedTask} />);

    // Find the main task container div
    const taskContainer = screen
      .getByText("Test Task")
      .closest("div[class*='p-4 border rounded-lg']");
    expect(taskContainer).toHaveClass("opacity-75");
  });

  it("does not display priority badge", () => {
    render(<TaskItem task={mockTask} />);

    expect(screen.queryByText(/🔵 medium/)).not.toBeInTheDocument();
    expect(screen.queryByText(/🔴 urgent/)).not.toBeInTheDocument();
  });

  it("does not display due date", () => {
    const taskWithDueDate = {
      ...mockTask,
      dueDate: "2024-01-20T10:00:00Z",
    };
    render(<TaskItem task={taskWithDueDate} />);

    expect(screen.queryByText(/Due:/)).not.toBeInTheDocument();
  });

  it("does not show overdue indicator", () => {
    const overdueTask = {
      ...mockTask,
      dueDate: "2024-01-10T10:00:00Z", // Past date
      completed: false,
    };
    render(<TaskItem task={overdueTask} />);

    expect(screen.queryByText("⚠️ Overdue")).not.toBeInTheDocument();
  });

  it("calls toggleTask when toggle button is clicked", async () => {
    render(<TaskItem task={mockTask} />);

    const toggleButton = screen.getByTitle("Mark as completed");
    fireEvent.click(toggleButton);

    await waitFor(() => {
      expect(mockSetTasks).toHaveBeenCalledWith([
        {
          ...mockTask,
          completed: true,
          updatedAt: expect.any(String),
        },
      ]);
    });
  });

  it("shows delete confirmation dialog when delete button is clicked", () => {
    render(<TaskItem task={mockTask} />);

    const deleteButton = screen.getByTitle("Delete task");
    fireEvent.click(deleteButton);

    expect(screen.getByText("Delete Task")).toBeInTheDocument();
    expect(
      screen.getByText(
        'Are you sure you want to delete the task "Test Task"? This action cannot be undone.'
      )
    ).toBeInTheDocument();
  });

  it("calls deleteTask when confirmed", async () => {
    mockTaskApi.deleteTask.mockResolvedValue(undefined);

    render(<TaskItem task={mockTask} />);

    const deleteButton = screen.getByTitle("Delete task");
    fireEvent.click(deleteButton);

    const confirmButton = screen.getByText("Delete");
    fireEvent.click(confirmButton);

    await waitFor(() => {
      expect(mockTaskApi.deleteTask).toHaveBeenCalledWith("1");
      expect(mockSetTasks).toHaveBeenCalledWith([]);
    });
  });

  it("does not call deleteTask when cancelled", () => {
    render(<TaskItem task={mockTask} />);

    const deleteButton = screen.getByTitle("Delete task");
    fireEvent.click(deleteButton);

    const cancelButton = screen.getByText("Cancel");
    fireEvent.click(cancelButton);

    expect(mockTaskApi.deleteTask).not.toHaveBeenCalled();
  });

  it("does not display creation date", () => {
    render(<TaskItem task={mockTask} />);

    expect(screen.queryByText(/Created:/)).not.toBeInTheDocument();
  });

  it("does not display updated date", () => {
    render(<TaskItem task={mockTask} />);

    expect(screen.queryByText(/Updated:/)).not.toBeInTheDocument();
  });

  it("shows only title when description is empty", () => {
    const taskWithoutDescription = { ...mockTask, description: undefined };
    render(<TaskItem task={taskWithoutDescription} />);

    expect(screen.getByText("Test Task")).toBeInTheDocument();
    expect(screen.queryByText("Test Description")).not.toBeInTheDocument();
  });

  it("displays description when present", () => {
    render(<TaskItem task={mockTask} />);

    expect(screen.getByText("Test Description")).toBeInTheDocument();
  });
});
