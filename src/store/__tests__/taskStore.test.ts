import { renderHook, act } from "@testing-library/react";
import { useTaskStore } from "../taskStore";
import { Task } from "../../types/task";

describe("Task Store", () => {
  beforeEach(() => {
    // Reset store to initial state before each test
    const { result } = renderHook(() => useTaskStore());
    act(() => {
      result.current.setTasks([]);
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
          priority: "medium",
          dueDate: undefined,
          createdAt: "2024-01-15T10:00:00Z",
          updatedAt: "2024-01-15T10:00:00Z",
        },
      ];

      act(() => {
        result.current.setTasks(tasks);
      });

      expect(result.current.tasks).toEqual(tasks);
    });

    it("should replace existing tasks", () => {
      const { result } = renderHook(() => useTaskStore());
      const initialTasks: Task[] = [
        {
          id: "1",
          title: "Initial Task",
          description: "Initial Description",
          completed: false,
          priority: "low",
          dueDate: undefined,
          createdAt: "2024-01-15T10:00:00Z",
          updatedAt: "2024-01-15T10:00:00Z",
        },
      ];

      const newTasks: Task[] = [
        {
          id: "2",
          title: "New Task",
          description: "New Description",
          completed: true,
          priority: "high",
          dueDate: "2024-01-20T10:00:00Z",
          createdAt: "2024-01-16T10:00:00Z",
          updatedAt: "2024-01-16T10:00:00Z",
        },
      ];

      act(() => {
        result.current.setTasks(initialTasks);
      });

      act(() => {
        result.current.setTasks(newTasks);
      });

      expect(result.current.tasks).toEqual(newTasks);
      expect(result.current.tasks).not.toEqual(initialTasks);
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
        priority: "medium",
        dueDate: undefined,
        createdAt: "2024-01-15T10:00:00Z",
        updatedAt: "2024-01-15T10:00:00Z",
      };

      const newTask: Task = {
        id: "2",
        title: "New Task",
        description: "New Description",
        completed: true,
        priority: "high",
        dueDate: "2024-01-20T10:00:00Z",
        createdAt: "2024-01-16T10:00:00Z",
        updatedAt: "2024-01-16T10:00:00Z",
      };

      act(() => {
        result.current.setTasks([existingTask]);
      });

      act(() => {
        result.current.addTask(newTask);
      });

      expect(result.current.tasks).toHaveLength(2);
      expect(result.current.tasks[0]).toEqual(newTask);
      expect(result.current.tasks[1]).toEqual(existingTask);
    });

    it("should add task to empty list", () => {
      const { result } = renderHook(() => useTaskStore());
      const newTask: Task = {
        id: "1",
        title: "New Task",
        description: "New Description",
        completed: false,
        priority: "medium",
        dueDate: undefined,
        createdAt: "2024-01-15T10:00:00Z",
        updatedAt: "2024-01-15T10:00:00Z",
      };

      act(() => {
        result.current.addTask(newTask);
      });

      expect(result.current.tasks).toHaveLength(1);
      expect(result.current.tasks[0]).toEqual(newTask);
    });
  });

  describe("deleteTask", () => {
    it("should delete an existing task", () => {
      const { result } = renderHook(() => useTaskStore());
      const tasks: Task[] = [
        {
          id: "1",
          title: "Task 1",
          description: "Description 1",
          completed: false,
          priority: "low",
          dueDate: undefined,
          createdAt: "2024-01-15T10:00:00Z",
          updatedAt: "2024-01-15T10:00:00Z",
        },
        {
          id: "2",
          title: "Task 2",
          description: "Description 2",
          completed: true,
          priority: "high",
          dueDate: "2024-01-20T10:00:00Z",
          createdAt: "2024-01-16T10:00:00Z",
          updatedAt: "2024-01-16T10:00:00Z",
        },
      ];

      act(() => {
        result.current.setTasks(tasks);
      });

      act(() => {
        result.current.deleteTask("1");
      });

      expect(result.current.tasks).toHaveLength(1);
      expect(result.current.tasks[0].id).toBe("2");
    });

    it("should not delete non-existent task", () => {
      const { result } = renderHook(() => useTaskStore());
      const tasks: Task[] = [
        {
          id: "1",
          title: "Task 1",
          description: "Description 1",
          completed: false,
          priority: "medium",
          dueDate: undefined,
          createdAt: "2024-01-15T10:00:00Z",
          updatedAt: "2024-01-15T10:00:00Z",
        },
      ];

      act(() => {
        result.current.setTasks(tasks);
      });

      act(() => {
        result.current.deleteTask("999");
      });

      expect(result.current.tasks).toEqual(tasks);
    });

    it("should handle deleting from empty list", () => {
      const { result } = renderHook(() => useTaskStore());

      act(() => {
        result.current.deleteTask("1");
      });

      expect(result.current.tasks).toEqual([]);
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
        priority: "medium",
        dueDate: undefined,
        createdAt: "2024-01-15T10:00:00Z",
        updatedAt: "2024-01-15T10:00:00Z",
      };

      act(() => {
        result.current.setTasks([task]);
      });

      act(() => {
        result.current.toggleTask("1");
      });

      expect(result.current.tasks[0].completed).toBe(true);

      act(() => {
        result.current.toggleTask("1");
      });

      expect(result.current.tasks[0].completed).toBe(false);
    });

    it("should not affect other tasks when toggling", () => {
      const { result } = renderHook(() => useTaskStore());
      const tasks: Task[] = [
        {
          id: "1",
          title: "Task 1",
          description: "Description 1",
          completed: false,
          priority: "low",
          dueDate: undefined,
          createdAt: "2024-01-15T10:00:00Z",
          updatedAt: "2024-01-15T10:00:00Z",
        },
        {
          id: "2",
          title: "Task 2",
          description: "Description 2",
          completed: true,
          priority: "high",
          dueDate: "2024-01-20T10:00:00Z",
          createdAt: "2024-01-16T10:00:00Z",
          updatedAt: "2024-01-16T10:00:00Z",
        },
      ];

      act(() => {
        result.current.setTasks(tasks);
      });

      act(() => {
        result.current.toggleTask("1");
      });

      expect(result.current.tasks[0].completed).toBe(true);
      expect(result.current.tasks[1].completed).toBe(true); // Unchanged
    });

    it("should not affect any tasks when toggling non-existent task", () => {
      const { result } = renderHook(() => useTaskStore());
      const originalTasks: Task[] = [
        {
          id: "1",
          title: "Task 1",
          description: "Description 1",
          completed: false,
          priority: "medium",
          dueDate: undefined,
          createdAt: "2024-01-15T10:00:00Z",
          updatedAt: "2024-01-15T10:00:00Z",
        },
      ];

      act(() => {
        result.current.setTasks(originalTasks);
      });

      act(() => {
        result.current.toggleTask("999");
      });

      expect(result.current.tasks).toEqual(originalTasks);
    });
  });

  describe("setLoading", () => {
    it("should set loading state", () => {
      const { result } = renderHook(() => useTaskStore());

      act(() => {
        result.current.setLoading(true);
      });

      expect(result.current.loading).toBe(true);

      act(() => {
        result.current.setLoading(false);
      });

      expect(result.current.loading).toBe(false);
    });
  });

  describe("setError", () => {
    it("should set error state", () => {
      const { result } = renderHook(() => useTaskStore());

      act(() => {
        result.current.setError("Test error message");
      });

      expect(result.current.error).toBe("Test error message");

      act(() => {
        result.current.setError(null);
      });

      expect(result.current.error).toBe(null);
    });
  });

  describe("clearError", () => {
    it("should clear error state", () => {
      const { result } = renderHook(() => useTaskStore());

      act(() => {
        result.current.setError("Test error message");
      });

      act(() => {
        result.current.clearError();
      });

      expect(result.current.error).toBe(null);
    });
  });

  describe("Complex Operations", () => {
    it("should handle multiple operations correctly", () => {
      const { result } = renderHook(() => useTaskStore());
      const initialTasks: Task[] = [
        {
          id: "1",
          title: "Task 1",
          description: "Description 1",
          completed: false,
          priority: "low",
          dueDate: undefined,
          createdAt: "2024-01-15T10:00:00Z",
          updatedAt: "2024-01-15T10:00:00Z",
        },
        {
          id: "2",
          title: "Task 2",
          description: "Description 2",
          completed: false,
          priority: "high",
          dueDate: "2024-01-20T10:00:00Z",
          createdAt: "2024-01-16T10:00:00Z",
          updatedAt: "2024-01-16T10:00:00Z",
        },
      ];

      act(() => {
        result.current.setTasks(initialTasks);
      });

      // Toggle second task
      act(() => {
        result.current.toggleTask("2");
      });

      // Add new task
      const newTask: Task = {
        id: "3",
        title: "Task 3",
        description: "Description 3",
        completed: true,
        priority: "medium",
        dueDate: undefined,
        createdAt: "2024-01-17T10:00:00Z",
        updatedAt: "2024-01-17T10:00:00Z",
      };

      act(() => {
        result.current.addTask(newTask);
      });

      // Delete first task
      act(() => {
        result.current.deleteTask("1");
      });

      expect(result.current.tasks).toHaveLength(2);
      expect(result.current.tasks[0].id).toBe("3"); // New task should be first
      expect(result.current.tasks[1].id).toBe("2"); // Second task should be second
      expect(result.current.tasks[1].completed).toBe(true); // Should be toggled
    });

    it("should maintain data integrity during operations", () => {
      const { result } = renderHook(() => useTaskStore());
      const initialTask: Task = {
        id: "1",
        title: "Original Title",
        description: "Original Description",
        completed: false,
        priority: "low",
        dueDate: undefined,
        createdAt: "2024-01-15T10:00:00Z",
        updatedAt: "2024-01-15T10:00:00Z",
      };

      act(() => {
        result.current.setTasks([initialTask]);
      });

      // Perform multiple operations
      act(() => {
        result.current.toggleTask("1");
        result.current.addTask({
          id: "2",
          title: "New Task",
          description: "New Description",
          completed: true,
          priority: "high",
          dueDate: "2024-01-20T10:00:00Z",
          createdAt: "2024-01-16T10:00:00Z",
          updatedAt: "2024-01-16T10:00:00Z",
        });
      });

      expect(result.current.tasks).toHaveLength(2);
      expect(result.current.tasks[0].id).toBe("2"); // New task first
      expect(result.current.tasks[1].id).toBe("1"); // Original task second
      expect(result.current.tasks[1].completed).toBe(true); // Should be toggled
    });
  });
});
