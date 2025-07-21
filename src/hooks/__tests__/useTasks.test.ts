import { renderHook, act } from "@testing-library/react";
import { useTasks } from "../useTasks";
import { useTaskStore } from "../../store/taskStore";

// Mock the store
jest.mock("../../store/taskStore");

const mockUseTaskStore = useTaskStore as jest.MockedFunction<
  typeof useTaskStore
>;

describe("useTasks", () => {
  const mockTasks = [
    {
      id: "1",
      title: "Task 1",
      description: "Description 1",
      completed: false,
      createdAt: "2024-01-15T10:00:00Z",
      updatedAt: "2024-01-15T10:00:00Z",
    },
    {
      id: "2",
      title: "Task 2",
      description: "Description 2",
      completed: true,
      createdAt: "2024-01-16T10:00:00Z",
      updatedAt: "2024-01-16T10:00:00Z",
    },
  ];

  beforeEach(() => {
    jest.clearAllMocks();

    mockUseTaskStore.mockReturnValue({
      tasks: mockTasks,
      loading: false,
      error: null,
      addTask: jest.fn(),
      deleteTask: jest.fn(),
      toggleTask: jest.fn(),
      loadTasks: jest.fn(),
      setTasks: jest.fn(),
      setLoading: jest.fn(),
      setError: jest.fn(),
      clearError: jest.fn(),
    });
  });

  it("should initialize with default filters", () => {
    const { result } = renderHook(() => useTasks());

    expect(result.current.filters).toEqual({
      searchTerm: "",
      filter: "all",
      sortBy: "created",
      showCompleted: true,
    });
  });

  it("should return tasks from store", () => {
    const { result } = renderHook(() => useTasks());

    expect(result.current.tasks).toEqual(mockTasks);
  });

  it("should calculate statistics correctly", () => {
    const { result } = renderHook(() => useTasks());

    expect(result.current.statistics).toEqual({
      total: 2,
      completed: 1,
      pending: 1,
      new: 0, // No tasks created in last 24 hours
    });
  });

  it("should filter tasks by search term", () => {
    const { result } = renderHook(() => useTasks());

    act(() => {
      result.current.updateFilters({ searchTerm: "Task 1" });
    });

    expect(result.current.tasks).toHaveLength(1);
    expect(result.current.tasks[0].title).toBe("Task 1");
  });

  it("should filter tasks by status", () => {
    const { result } = renderHook(() => useTasks());

    act(() => {
      result.current.updateFilters({ filter: "completed" });
    });

    expect(result.current.tasks).toHaveLength(1);
    expect(result.current.tasks[0].completed).toBe(true);
  });

  it("should sort tasks by title", () => {
    const { result } = renderHook(() => useTasks());

    act(() => {
      result.current.updateFilters({ sortBy: "title" });
    });

    expect(result.current.tasks[0].title).toBe("Task 1");
    expect(result.current.tasks[1].title).toBe("Task 2");
  });

  it("should hide completed tasks when showCompleted is false", () => {
    const { result } = renderHook(() => useTasks());

    act(() => {
      result.current.updateFilters({ showCompleted: false });
    });

    expect(result.current.tasks).toHaveLength(1);
    expect(result.current.tasks[0].completed).toBe(false);
  });

  it("should reset filters to default", () => {
    const { result } = renderHook(() => useTasks());

    act(() => {
      result.current.updateFilters({ searchTerm: "test", filter: "completed" });
    });

    expect(result.current.filters.searchTerm).toBe("test");
    expect(result.current.filters.filter).toBe("completed");

    act(() => {
      result.current.resetFilters();
    });

    expect(result.current.filters).toEqual({
      searchTerm: "",
      filter: "all",
      sortBy: "created",
      showCompleted: true,
    });
  });

  it("should call store methods correctly", async () => {
    const mockAddTask = jest.fn();
    const mockDeleteTask = jest.fn();
    const mockToggleTask = jest.fn();
    const mockLoadTasks = jest.fn();

    mockUseTaskStore.mockReturnValue({
      tasks: mockTasks,
      loading: false,
      error: null,
      addTask: mockAddTask,
      deleteTask: mockDeleteTask,
      toggleTask: mockToggleTask,
      loadTasks: mockLoadTasks,
      setTasks: jest.fn(),
      setLoading: jest.fn(),
      setError: jest.fn(),
      clearError: jest.fn(),
    });

    const { result } = renderHook(() => useTasks());

    // Test createTask
    await act(async () => {
      const response = await result.current.createTask({
        title: "New Task",
        description: "New Description",
      });
      expect(response.success).toBe(true);
    });

    expect(mockAddTask).toHaveBeenCalledWith({
      title: "New Task",
      description: "New Description",
      completed: false,
    });

    // Test removeTask
    await act(async () => {
      const response = await result.current.removeTask("1");
      expect(response.success).toBe(true);
    });

    expect(mockDeleteTask).toHaveBeenCalledWith("1");

    // Test toggleTaskCompletion
    await act(async () => {
      const response = await result.current.toggleTaskCompletion("1");
      expect(response.success).toBe(true);
    });

    expect(mockToggleTask).toHaveBeenCalledWith("1");

    // Test initializeTasks
    act(() => {
      result.current.initializeTasks();
    });

    expect(mockLoadTasks).toHaveBeenCalled();
  });

  it("should handle errors from store methods", async () => {
    const mockAddTask = jest.fn().mockImplementation(() => {
      throw new Error("Store error");
    });

    mockUseTaskStore.mockReturnValue({
      tasks: mockTasks,
      loading: false,
      error: null,
      addTask: mockAddTask,
      deleteTask: jest.fn(),
      toggleTask: jest.fn(),
      loadTasks: jest.fn(),
      setTasks: jest.fn(),
      setLoading: jest.fn(),
      setError: jest.fn(),
      clearError: jest.fn(),
    });

    const { result } = renderHook(() => useTasks());

    await act(async () => {
      const response = await result.current.createTask({
        title: "New Task",
        description: "New Description",
      });
      expect(response.success).toBe(false);
      expect(response.error).toBe("Failed to create task");
    });
  });
});
