import React from "react";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import NewTaskIndicator from "../NewTaskIndicator";
import { Task } from "../../types/task";
import { taskApi } from "../../services/api";

// Mock the store
const mockUseTaskStore = {
  toggleTask: jest.fn(),
  deleteTask: jest.fn(),
};

jest.mock("../../store/taskStore", () => ({
  useTaskStore: jest.fn(() => mockUseTaskStore),
}));

// Mock the API service
jest.mock("../../services/api");

const mockTaskApi = {
  toggleTask: jest.fn(),
  deleteTask: jest.fn(),
};

(taskApi as jest.Mocked<typeof taskApi>).toggleTask = mockTaskApi.toggleTask;
(taskApi as jest.Mocked<typeof taskApi>).deleteTask = mockTaskApi.deleteTask;

// Mock data
const createMockTask = (
  id: string,
  createdAt: string,
  completed: boolean = false
): Task => ({
  id,
  title: `Task ${id}`,
  description: `Description for task ${id}`,
  completed,
  createdAt,
  updatedAt: createdAt,
});

describe("NewTaskIndicator", () => {
  beforeEach(() => {
    jest.clearAllMocks();
    // Mock window.confirm
    window.confirm = jest.fn();
  });
  it("should not render when there are no new tasks", () => {
    const oldTasks = [
      createMockTask("1", "2024-01-10T10:00:00Z"),
      createMockTask("2", "2024-01-11T10:00:00Z"),
    ];

    const { container } = render(<NewTaskIndicator tasks={oldTasks} />);
    expect(container.firstChild).toBeNull();
  });

  it("should render new tasks with special styling", () => {
    const now = new Date();
    const oneHourAgo = new Date(now.getTime() - 60 * 60 * 1000).toISOString();

    const newTasks = [
      createMockTask("1", oneHourAgo),
      createMockTask("2", now.toISOString()),
    ];

    render(<NewTaskIndicator tasks={newTasks} />);

    expect(screen.getByText("New Tasks (2)")).toBeInTheDocument();
    expect(screen.getByText("Task 1")).toBeInTheDocument();
    expect(screen.getByText("Task 2")).toBeInTheDocument();
  });

  it("should sort new tasks by creation date (newest first)", () => {
    const now = new Date();
    const oneHourAgo = new Date(now.getTime() - 60 * 60 * 1000).toISOString();
    const twoHoursAgo = new Date(
      now.getTime() - 2 * 60 * 60 * 1000
    ).toISOString();

    const newTasks = [
      createMockTask("1", twoHoursAgo), // Oldest
      createMockTask("2", now.toISOString()), // Newest
      createMockTask("3", oneHourAgo), // Middle
    ];

    render(<NewTaskIndicator tasks={newTasks} />);

    const taskElements = screen.getAllByText(/Task \d/);
    expect(taskElements[0]).toHaveTextContent("Task 2"); // Newest first
    expect(taskElements[1]).toHaveTextContent("Task 3"); // Middle
    expect(taskElements[2]).toHaveTextContent("Task 1"); // Oldest
  });

  it("should show completed tasks with different styling", () => {
    const now = new Date();
    const oneHourAgo = new Date(now.getTime() - 60 * 60 * 1000).toISOString();

    const newTasks = [
      createMockTask("1", oneHourAgo, true), // Completed
      createMockTask("2", now.toISOString(), false), // Not completed
    ];

    render(<NewTaskIndicator tasks={newTasks} />);

    expect(screen.getByText("New Tasks (2)")).toBeInTheDocument();

    // Check that both tasks are rendered
    expect(screen.getByText("Task 1")).toBeInTheDocument();
    expect(screen.getByText("Task 2")).toBeInTheDocument();
  });

  it("should show task descriptions when available", () => {
    const now = new Date();
    const oneHourAgo = new Date(now.getTime() - 60 * 60 * 1000).toISOString();

    const newTasks = [createMockTask("1", oneHourAgo)];

    render(<NewTaskIndicator tasks={newTasks} />);

    expect(screen.getByText("Description for task 1")).toBeInTheDocument();
  });

  it("should show creation date for each task", () => {
    const now = new Date();
    const oneHourAgo = new Date(now.getTime() - 60 * 60 * 1000);

    const newTasks = [createMockTask("1", oneHourAgo.toISOString())];

    render(<NewTaskIndicator tasks={newTasks} />);

    const expectedDate = oneHourAgo.toLocaleDateString();
    expect(screen.getByText(`Created: ${expectedDate}`)).toBeInTheDocument();
  });

  it('should show "New" badge for each task', () => {
    const now = new Date();
    const oneHourAgo = new Date(now.getTime() - 60 * 60 * 1000).toISOString();

    const newTasks = [createMockTask("1", oneHourAgo)];

    render(<NewTaskIndicator tasks={newTasks} />);

    expect(screen.getByText("New")).toBeInTheDocument();
  });

  it("should filter tasks correctly (24 hours threshold)", () => {
    const now = new Date();
    const twentyThreeHoursAgo = new Date(
      now.getTime() - 23 * 60 * 60 * 1000
    ).toISOString();
    const twentyFiveHoursAgo = new Date(
      now.getTime() - 25 * 60 * 60 * 1000
    ).toISOString();

    const tasks = [
      createMockTask("1", twentyThreeHoursAgo), // Should be included (new)
      createMockTask("2", twentyFiveHoursAgo), // Should be excluded (old)
    ];

    render(<NewTaskIndicator tasks={tasks} />);

    expect(screen.getByText("New Tasks (1)")).toBeInTheDocument();
    expect(screen.getByText("Task 1")).toBeInTheDocument();
    expect(screen.queryByText("Task 2")).not.toBeInTheDocument();
  });

  it("should call toggleTask when checkbox is clicked", async () => {
    const now = new Date();
    const oneHourAgo = new Date(now.getTime() - 60 * 60 * 1000).toISOString();

    const newTasks = [createMockTask("1", oneHourAgo)];

    mockTaskApi.toggleTask.mockResolvedValueOnce({
      ...newTasks[0],
      completed: true,
    });

    render(<NewTaskIndicator tasks={newTasks} />);

    const checkbox = screen.getByTitle("Toggle task completion");
    fireEvent.click(checkbox);

    await waitFor(() => {
      expect(mockTaskApi.toggleTask).toHaveBeenCalledWith("1");
    });
  });

  it("should call deleteTask when delete button is clicked", async () => {
    const now = new Date();
    const oneHourAgo = new Date(now.getTime() - 60 * 60 * 1000).toISOString();

    const newTasks = [createMockTask("1", oneHourAgo)];

    (window.confirm as jest.Mock).mockReturnValue(true);
    mockTaskApi.deleteTask.mockResolvedValueOnce(undefined);

    render(<NewTaskIndicator tasks={newTasks} />);

    const deleteButton = screen.getByTitle("Delete task");
    fireEvent.click(deleteButton);

    expect(window.confirm).toHaveBeenCalledWith(
      "Are you sure you want to delete this task?"
    );

    await waitFor(() => {
      expect(mockTaskApi.deleteTask).toHaveBeenCalledWith("1");
    });
  });

  it("should not call deleteTask when user cancels confirmation", async () => {
    const now = new Date();
    const oneHourAgo = new Date(now.getTime() - 60 * 60 * 1000).toISOString();

    const newTasks = [createMockTask("1", oneHourAgo)];

    (window.confirm as jest.Mock).mockReturnValue(false);

    render(<NewTaskIndicator tasks={newTasks} />);

    const deleteButton = screen.getByTitle("Delete task");
    fireEvent.click(deleteButton);

    expect(window.confirm).toHaveBeenCalledWith(
      "Are you sure you want to delete this task?"
    );
    expect(mockTaskApi.deleteTask).not.toHaveBeenCalled();
  });
});
