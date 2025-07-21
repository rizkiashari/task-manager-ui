import { renderHook, act } from "@testing-library/react";
import { useTaskStore } from "../taskStore";
import { Task } from "../../types/task";

// Mock the dummy data
jest.mock("../../data/dummyTasks", () => ({
  dummyTasks: [
    {
      id: "1",
      title: "Test Task 1",
      description: "Test Description 1",
      completed: false,
      createdAt: "2024-01-15T10:00:00Z",
      updatedAt: "2024-01-15T10:00:00Z",
    },
    {
      id: "2",
      title: "Test Task 2",
      description: "Test Description 2",
      completed: true,
      createdAt: "2024-01-16T10:00:00Z",
      updatedAt: "2024-01-16T10:00:00Z",
    },
  ],
  generateId: jest.fn(() => "new-id"),
  getCurrentTimestamp: jest.fn(() => "2024-01-17T10:00:00Z"),
}));

describe("Task Store", () => {
  beforeEach(() => {
    // Reset store to initial state
    const { result } = renderHook(() => useTaskStore());
    act(() => {
      result.current.setTasks([]);
      result.current.setLoading(false);
      result.current.setError(null);
    });
  });

  describe("Initial State", () => {
    it("should have initial state", () => {
      const { result } = renderHook(() => useTaskStore());

      expect(result.current.tasks).toEqual([]);
      expect(result.current.loading).toBe(false);
      expect(result.current.error).toBe(null);
    });
  });

  describe("setTasks", () => {
    it("should set tasks", () => {
      const { result } = renderHook(() => useTaskStore());
      const tasks: Task[] = [
        {
          id: "1",
          title: "Test Task",
          description: "Test Description",
          completed: false,
          createdAt: "2024-01-15T10:00:00Z",
          updatedAt: "2024-01-15T10:00:00Z",
        },
      ];

      act(() => {
        result.current.setTasks(tasks);
      });

      expect(result.current.tasks).toEqual(tasks);
    });
  });

  describe("setLoading", () => {
    it("should set loading state", () => {
      const { result } = renderHook(() => useTaskStore());

      act(() => {
        result.current.setLoading(true);
      });

      expect(result.current.loading).toBe(true);
    });
  });

  describe("setError", () => {
    it("should set error state", () => {
      const { result } = renderHook(() => useTaskStore());

      act(() => {
        result.current.setError("Test error");
      });

      expect(result.current.error).toBe("Test error");
    });
  });

  describe("clearError", () => {
    it("should clear error state", () => {
      const { result } = renderHook(() => useTaskStore());

      act(() => {
        result.current.setError("Test error");
        result.current.clearError();
      });

      expect(result.current.error).toBe(null);
    });
  });

  describe("loadTasks", () => {
    it("should load tasks from dummy data", async () => {
      const { result } = renderHook(() => useTaskStore());

      act(() => {
        result.current.loadTasks();
      });

      // Wait for the async operation
      await new Promise((resolve) => setTimeout(resolve, 600));

      expect(result.current.tasks).toHaveLength(2);
      expect(result.current.tasks[0].title).toBe("Test Task 1");
      expect(result.current.tasks[1].title).toBe("Test Task 2");
    });

    it("should set loading state during load", () => {
      const { result } = renderHook(() => useTaskStore());

      act(() => {
        result.current.loadTasks();
      });

      expect(result.current.loading).toBe(true);
    });
  });

  describe("addTask", () => {
    it("should add a new task to the beginning of the list", () => {
      const { result } = renderHook(() => useTaskStore());
      const existingTask: Task = {
        id: "1",
        title: "Existing Task",
        description: "Existing Description",
        completed: false,
        createdAt: "2024-01-15T10:00:00Z",
        updatedAt: "2024-01-15T10:00:00Z",
      };

      act(() => {
        result.current.setTasks([existingTask]);
        result.current.addTask({
          title: "New Task",
          description: "New Description",
          completed: false,
        });
      });

      expect(result.current.tasks).toHaveLength(2);
      expect(result.current.tasks[0].title).toBe("New Task");
      expect(result.current.tasks[1].title).toBe("Existing Task");
    });

    it("should add task to empty list", () => {
      const { result } = renderHook(() => useTaskStore());

      act(() => {
        result.current.addTask({
          title: "New Task",
          description: "New Description",
          completed: false,
        });
      });

      expect(result.current.tasks).toHaveLength(1);
      expect(result.current.tasks[0].title).toBe("New Task");
    });
  });

  describe("deleteTask", () => {
    it("should delete task by id", () => {
      const { result } = renderHook(() => useTaskStore());
      const tasks: Task[] = [
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
          completed: false,
          createdAt: "2024-01-16T10:00:00Z",
          updatedAt: "2024-01-16T10:00:00Z",
        },
      ];

      act(() => {
        result.current.setTasks(tasks);
        result.current.deleteTask("1");
      });

      expect(result.current.tasks).toHaveLength(1);
      expect(result.current.tasks[0].id).toBe("2");
    });

    it("should do nothing if task id doesn't exist", () => {
      const { result } = renderHook(() => useTaskStore());
      const tasks: Task[] = [
        {
          id: "1",
          title: "Task 1",
          description: "Description 1",
          completed: false,
          createdAt: "2024-01-15T10:00:00Z",
          updatedAt: "2024-01-15T10:00:00Z",
        },
      ];

      act(() => {
        result.current.setTasks(tasks);
        result.current.deleteTask("999");
      });

      expect(result.current.tasks).toHaveLength(1);
      expect(result.current.tasks[0].id).toBe("1");
    });
  });

  describe("toggleTask", () => {
    it("should toggle task completion status", () => {
      const { result } = renderHook(() => useTaskStore());
      const task: Task = {
        id: "1",
        title: "Test Task",
        description: "Test Description",
        completed: false,
        createdAt: "2024-01-15T10:00:00Z",
        updatedAt: "2024-01-15T10:00:00Z",
      };

      act(() => {
        result.current.setTasks([task]);
        result.current.toggleTask("1");
      });

      expect(result.current.tasks[0].completed).toBe(true);
    });

    it("should update updatedAt timestamp when toggling", () => {
      const { result } = renderHook(() => useTaskStore());
      const task: Task = {
        id: "1",
        title: "Test Task",
        description: "Test Description",
        completed: false,
        createdAt: "2024-01-15T10:00:00Z",
        updatedAt: "2024-01-15T10:00:00Z",
      };

      act(() => {
        result.current.setTasks([task]);
        result.current.toggleTask("1");
      });

      expect(result.current.tasks[0].updatedAt).toBe("2024-01-17T10:00:00Z");
    });

    it("should do nothing if task id doesn't exist", () => {
      const { result } = renderHook(() => useTaskStore());
      const task: Task = {
        id: "1",
        title: "Test Task",
        description: "Test Description",
        completed: false,
        createdAt: "2024-01-15T10:00:00Z",
        updatedAt: "2024-01-15T10:00:00Z",
      };

      act(() => {
        result.current.setTasks([task]);
        result.current.toggleTask("999");
      });

      expect(result.current.tasks[0].completed).toBe(false);
    });
  });

  describe("Complex Operations", () => {
    it("should maintain data integrity during operations", () => {
      const { result } = renderHook(() => useTaskStore());
      const initialTask: Task = {
        id: "1",
        title: "Initial Task",
        description: "Initial Description",
        completed: false,
        createdAt: "2024-01-15T10:00:00Z",
        updatedAt: "2024-01-15T10:00:00Z",
      };

      act(() => {
        result.current.setTasks([initialTask]);

        // Add new task
        result.current.addTask({
          title: "New Task",
          description: "New Description",
          completed: false,
        });

        // Toggle original task
        result.current.toggleTask("1");
      });

      expect(result.current.tasks).toHaveLength(2);
      expect(result.current.tasks[0].title).toBe("New Task");
      expect(result.current.tasks[1].title).toBe("Initial Task");
      expect(result.current.tasks[1].completed).toBe(true);
    });
  });
});
