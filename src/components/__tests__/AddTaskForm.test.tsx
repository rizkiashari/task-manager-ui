import React from "react";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import "@testing-library/jest-dom";
import { AddTaskForm } from "../AddTaskForm";
import { useTaskStore } from "../../store/taskStore";
import { taskApi } from "../../services/api";

// Mock the store and API
jest.mock("../../store/taskStore");
jest.mock("../../services/api");

const mockUseTaskStore = useTaskStore as jest.MockedFunction<
  typeof useTaskStore
>;
const mockTaskApi = taskApi as jest.Mocked<typeof taskApi>;

describe("AddTaskForm", () => {
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
    mockTasks = [];
    mockSetTasks = jest.fn((newTasks) => {
      mockTasks = newTasks;
    });

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

  it("renders form with title and description fields", () => {
    render(<AddTaskForm />);

    expect(screen.getByText("➕ Add New Task")).toBeInTheDocument();
    expect(screen.getByLabelText(/Title \*/)).toBeInTheDocument();
    expect(
      screen.getByLabelText(/Description \(optional\)/)
    ).toBeInTheDocument();
    expect(screen.getByText("Create Task")).toBeInTheDocument();
  });

  it("shows character count for title and description", () => {
    render(<AddTaskForm />);

    expect(screen.getByText("0/100 characters")).toBeInTheDocument();
    expect(screen.getByText("0/500 characters")).toBeInTheDocument();
  });

  it("updates character count when typing", () => {
    render(<AddTaskForm />);

    const titleInput = screen.getByLabelText(/Title \*/);
    const descriptionInput = screen.getByLabelText(/Description \(optional\)/);

    fireEvent.change(titleInput, { target: { value: "Test" } });
    fireEvent.change(descriptionInput, {
      target: { value: "Test description" },
    });

    expect(screen.getByText("4/100 characters")).toBeInTheDocument();
    expect(screen.getByText("16/500 characters")).toBeInTheDocument();
  });

  it("shows error when title is empty", async () => {
    render(<AddTaskForm />);

    const submitButton = screen.getByText("Create Task");
    fireEvent.click(submitButton);

    await waitFor(() => {
      expect(screen.getByText("Title is required")).toBeInTheDocument();
    });
  });

  it("shows error when title is too short", async () => {
    render(<AddTaskForm />);

    const titleInput = screen.getByLabelText(/Title \*/);
    fireEvent.change(titleInput, { target: { value: "ab" } });

    const submitButton = screen.getByText("Create Task");
    fireEvent.click(submitButton);

    await waitFor(() => {
      expect(
        screen.getByText("Title must be at least 3 characters long")
      ).toBeInTheDocument();
    });
  });

  it("shows error when title is too long", async () => {
    render(<AddTaskForm />);

    const titleInput = screen.getByLabelText(/Title \*/);
    const longTitle = "a".repeat(101);
    fireEvent.change(titleInput, { target: { value: longTitle } });

    const submitButton = screen.getByText("Create Task");
    fireEvent.click(submitButton);

    await waitFor(() => {
      expect(
        screen.getByText("Title must be less than 100 characters")
      ).toBeInTheDocument();
    });
  });

  it("shows error when description is too long", async () => {
    render(<AddTaskForm />);

    const titleInput = screen.getByLabelText(/Title \*/);
    const descriptionInput = screen.getByLabelText(/Description \(optional\)/);

    fireEvent.change(titleInput, { target: { value: "Valid Title" } });

    const longDescription = "a".repeat(501);
    fireEvent.change(descriptionInput, { target: { value: longDescription } });

    const submitButton = screen.getByText("Create Task");
    fireEvent.click(submitButton);

    await waitFor(() => {
      expect(
        screen.getByText("Description must be less than 500 characters")
      ).toBeInTheDocument();
    });
  });

  it("shows confirmation dialog when form is valid", async () => {
    render(<AddTaskForm />);

    const titleInput = screen.getByLabelText(/Title \*/);
    fireEvent.change(titleInput, { target: { value: "Valid Title" } });

    const submitButton = screen.getByText("Create Task");
    fireEvent.click(submitButton);

    await waitFor(() => {
      expect(screen.getByText("Create New Task")).toBeInTheDocument();
      expect(
        screen.getByText(
          'Are you sure you want to create the task "Valid Title"?'
        )
      ).toBeInTheDocument();
    });
  });

  it("calls API and updates store when confirmed", async () => {
    mockTaskApi.createTask.mockResolvedValue(mockTask);

    render(<AddTaskForm />);

    const titleInput = screen.getByLabelText(/Title \*/);
    const descriptionInput = screen.getByLabelText(/Description \(optional\)/);

    fireEvent.change(titleInput, { target: { value: "Test Task" } });
    fireEvent.change(descriptionInput, {
      target: { value: "Test Description" },
    });

    const submitButton = screen.getByText("Create Task");
    fireEvent.click(submitButton);

    await waitFor(() => {
      expect(screen.getByText("Create New Task")).toBeInTheDocument();
    });

    // Get the confirm button from the dialog (second button with "Create Task" text)
    const confirmButtons = screen.getAllByText("Create Task");
    const confirmButton = confirmButtons[1]; // Second button is the confirm button
    fireEvent.click(confirmButton);

    await waitFor(() => {
      expect(mockTaskApi.createTask).toHaveBeenCalledWith({
        title: "Test Task",
        description: "Test Description",
      });
      expect(mockSetTasks).toHaveBeenCalledWith(
        expect.arrayContaining([mockTask])
      );
    });
  });

  it("shows success message after creating task", async () => {
    mockTaskApi.createTask.mockResolvedValue(mockTask);

    render(<AddTaskForm />);

    const titleInput = screen.getByLabelText(/Title \*/);
    fireEvent.change(titleInput, { target: { value: "Test Task" } });

    const submitButton = screen.getByText("Create Task");
    fireEvent.click(submitButton);

    await waitFor(() => {
      expect(screen.getByText("Create New Task")).toBeInTheDocument();
    });

    const confirmButtons = screen.getAllByText("Create Task");
    const confirmButton = confirmButtons[1];
    fireEvent.click(confirmButton);

    await waitFor(() => {
      expect(
        screen.getByText("Task created successfully!")
      ).toBeInTheDocument();
    });
  });

  it("shows error message when API fails", async () => {
    mockTaskApi.createTask.mockRejectedValue(new Error("API Error"));

    render(<AddTaskForm />);

    const titleInput = screen.getByLabelText(/Title \*/);
    fireEvent.change(titleInput, { target: { value: "Test Task" } });

    const submitButton = screen.getByText("Create Task");
    fireEvent.click(submitButton);

    await waitFor(() => {
      expect(screen.getByText("Create New Task")).toBeInTheDocument();
    });

    const confirmButtons = screen.getAllByText("Create Task");
    const confirmButton = confirmButtons[1];
    fireEvent.click(confirmButton);

    await waitFor(() => {
      expect(
        screen.getByText("Failed to create task. Please try again.")
      ).toBeInTheDocument();
    });
  });

  it("resets form after successful creation", async () => {
    mockTaskApi.createTask.mockResolvedValue(mockTask);

    render(<AddTaskForm />);

    const titleInput = screen.getByLabelText(/Title \*/);
    const descriptionInput = screen.getByLabelText(/Description \(optional\)/);

    fireEvent.change(titleInput, { target: { value: "Test Task" } });
    fireEvent.change(descriptionInput, {
      target: { value: "Test Description" },
    });

    const submitButton = screen.getByText("Create Task");
    fireEvent.click(submitButton);

    await waitFor(() => {
      expect(screen.getByText("Create New Task")).toBeInTheDocument();
    });

    const confirmButtons = screen.getAllByText("Create Task");
    const confirmButton = confirmButtons[1];
    fireEvent.click(confirmButton);

    await waitFor(() => {
      expect(titleInput).toHaveValue("");
      expect(descriptionInput).toHaveValue("");
    });
  });

  it("clears error when user starts typing", async () => {
    render(<AddTaskForm />);

    // Submit with empty title to trigger error
    const submitButton = screen.getByText("Create Task");
    fireEvent.click(submitButton);

    await waitFor(() => {
      expect(screen.getByText("Title is required")).toBeInTheDocument();
    });

    // Now type to clear the error
    const titleInput = screen.getByLabelText(/Title \*/);
    fireEvent.change(titleInput, { target: { value: "Test" } });

    await waitFor(() => {
      expect(screen.queryByText("Title is required")).not.toBeInTheDocument();
    });
  });

  it("enables submit button by default", () => {
    render(<AddTaskForm />);

    const submitButton = screen.getByText("Create Task");
    expect(submitButton).not.toBeDisabled();
  });

  it("disables submit button during submission", async () => {
    mockTaskApi.createTask.mockImplementation(
      () => new Promise((resolve) => setTimeout(() => resolve(mockTask), 100))
    );

    render(<AddTaskForm />);

    const titleInput = screen.getByLabelText(/Title \*/);
    fireEvent.change(titleInput, { target: { value: "Test Task" } });

    const submitButton = screen.getByText("Create Task");
    fireEvent.click(submitButton);

    await waitFor(() => {
      expect(screen.getByText("Create New Task")).toBeInTheDocument();
    });

    const confirmButtons = screen.getAllByText("Create Task");
    const confirmButton = confirmButtons[1];
    fireEvent.click(confirmButton);

    await waitFor(() => {
      expect(screen.getByText("Creating Task...")).toBeInTheDocument();
      expect(screen.getByText("Creating Task...")).toBeDisabled();
    });
  });
});
