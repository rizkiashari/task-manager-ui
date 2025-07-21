import React from "react";
import { render, screen, fireEvent } from "@testing-library/react";
import "@testing-library/jest-dom";
import TaskItem from "../TaskItem";
import { useTaskStore } from "../../store/taskStore";

// Mock the store
jest.mock("../../store/taskStore");
jest.mock("../../services/api", () => ({
  taskApi: {
    toggleTask: jest.fn(),
    deleteTask: jest.fn(),
  },
}));

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

  const mockStoreActions = {
    toggleTask: jest.fn(),
    deleteTask: jest.fn(),
    setError: jest.fn(),
    clearError: jest.fn(),
  };

  beforeEach(() => {
    mockUseTaskStore.mockReturnValue(mockStoreActions);
    // Mock window.confirm
    window.confirm = jest.fn();
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it("renders task title and description", () => {
    render(<TaskItem task={mockTask} />);

    expect(screen.getByText("Test Task")).toBeInTheDocument();
    expect(screen.getByText("Test Description")).toBeInTheDocument();
  });

  it("shows completed task with different styling", () => {
    const completedTask = { ...mockTask, completed: true };
    render(<TaskItem task={completedTask} />);

    const taskContainer = screen
      .getByText("Test Task")
      .closest('div[class*="bg-green-50"]');
    expect(taskContainer).toBeInTheDocument();
  });

  it("calls toggleTask when checkbox is clicked", () => {
    render(<TaskItem task={mockTask} />);

    const checkbox = screen.getByTitle("Toggle task completion");
    fireEvent.click(checkbox);

    expect(mockStoreActions.toggleTask).toHaveBeenCalledWith("1");
  });

  it("calls deleteTask when delete button is clicked", () => {
    // Mock window.confirm
    window.confirm = jest.fn(() => true);

    render(<TaskItem task={mockTask} />);

    const deleteButton = screen.getByTitle("Delete task");
    fireEvent.click(deleteButton);

    expect(window.confirm).toHaveBeenCalledWith(
      "Are you sure you want to delete this task?"
    );
    expect(mockStoreActions.deleteTask).toHaveBeenCalledWith("1");
  });

  it("does not call deleteTask when user cancels confirmation", () => {
    // Mock window.confirm to return false
    window.confirm = jest.fn(() => false);

    render(<TaskItem task={mockTask} />);

    const deleteButton = screen.getByTitle("Delete task");
    fireEvent.click(deleteButton);

    expect(window.confirm).toHaveBeenCalled();
    expect(mockStoreActions.deleteTask).not.toHaveBeenCalled();
  });

  it("displays creation date", () => {
    render(<TaskItem task={mockTask} />);

    expect(screen.getByText(/Created:/)).toBeInTheDocument();
  });

  it("displays updated date when different from creation date", () => {
    const updatedTask = {
      ...mockTask,
      updatedAt: "2024-01-16T10:00:00Z",
    };

    render(<TaskItem task={updatedTask} />);

    expect(screen.getByText(/Updated:/)).toBeInTheDocument();
  });
});
