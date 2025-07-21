import React from "react";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import "@testing-library/jest-dom";
import { TaskItem } from "../TaskItem";
import { useTaskStore } from "../../store/taskStore";

// Mock the store
jest.mock("../../store/taskStore");

const mockUseTaskStore = useTaskStore as jest.MockedFunction<
  typeof useTaskStore
>;

describe("TaskItem", () => {
  const mockTask = {
    id: "1",
    title: "Test Task",
    description: "Test Description",
    completed: false,
    createdAt: "2024-01-15T10:00:00Z",
    updatedAt: "2024-01-15T10:00:00Z",
  };

  let mockToggleTask: jest.Mock;
  let mockDeleteTask: jest.Mock;

  beforeEach(() => {
    jest.clearAllMocks();
    mockToggleTask = jest.fn();
    mockDeleteTask = jest.fn();

    mockUseTaskStore.mockReturnValue({
      tasks: [mockTask],
      loading: false,
      error: null,
      setTasks: jest.fn(),
      setLoading: jest.fn(),
      setError: jest.fn(),
      addTask: jest.fn(),
      deleteTask: mockDeleteTask,
      toggleTask: mockToggleTask,
      clearError: jest.fn(),
      loadTasks: jest.fn(),
    });
  });

  it("renders task title and description", () => {
    render(<TaskItem task={mockTask} />);

    expect(screen.getByText("Test Task")).toBeInTheDocument();
    expect(screen.getByText("Test Description")).toBeInTheDocument();
  });

  it("shows completed task with strikethrough", () => {
    const completedTask = { ...mockTask, completed: true };
    render(<TaskItem task={completedTask} />);

    const title = screen.getByText("Test Task");
    expect(title).toHaveClass("line-through");
  });

  it("shows pending icon for incomplete task", () => {
    render(<TaskItem task={mockTask} />);

    const toggleButton = screen.getByTitle("Mark as completed");
    expect(toggleButton).toBeInTheDocument();
  });

  it("shows checkmark icon for completed task", () => {
    const completedTask = { ...mockTask, completed: true };
    render(<TaskItem task={completedTask} />);

    const toggleButton = screen.getByTitle("Mark as pending");
    expect(toggleButton).toBeInTheDocument();
  });

  it("calls toggleTask when toggle button is clicked", async () => {
    render(<TaskItem task={mockTask} />);

    const toggleButton = screen.getByTitle("Mark as completed");
    fireEvent.click(toggleButton);

    await waitFor(() => {
      expect(mockToggleTask).toHaveBeenCalledWith("1");
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
    render(<TaskItem task={mockTask} />);

    const deleteButton = screen.getByTitle("Delete task");
    fireEvent.click(deleteButton);

    const confirmButton = screen.getByText("Delete");
    fireEvent.click(confirmButton);

    await waitFor(() => {
      expect(mockDeleteTask).toHaveBeenCalledWith("1");
    });
  });

  it("handles task without description", () => {
    const taskWithoutDescription = { ...mockTask, description: undefined };
    render(<TaskItem task={taskWithoutDescription} />);

    expect(screen.getByText("Test Task")).toBeInTheDocument();
    expect(screen.queryByText("Test Description")).not.toBeInTheDocument();
  });

  it("applies correct styling for completed task", () => {
    const completedTask = { ...mockTask, completed: true };
    render(<TaskItem task={completedTask} />);

    const taskContainer = screen
      .getByText("Test Task")
      .closest("div[class*='p-4']");
    expect(taskContainer).toHaveClass("opacity-75", "bg-gray-50");
  });

  it("applies correct styling for pending task", () => {
    render(<TaskItem task={mockTask} />);

    const taskContainer = screen
      .getByText("Test Task")
      .closest("div[class*='p-4']");
    expect(taskContainer).toHaveClass("bg-white", "hover:shadow-md");
  });
});
