import { renderHook, act } from "@testing-library/react";
import { useTaskStore } from "../taskStore";
import { Task } from "../../types/task";

// Mock data for testing
const mockTask: Task = {
  id: "1",
  title: "Test Task",
  description: "Test Description",
  completed: false,
  createdAt: "2024-01-15T10:00:00Z",
  updatedAt: "2024-01-15T10:00:00Z",
};

const mockTask2: Task = {
  id: "2",
  title: "Test Task 2",
  description: "Test Description 2",
  completed: true,
  createdAt: "2024-01-16T10:00:00Z",
  updatedAt: "2024-01-16T10:00:00Z",
};

describe("Task Store", () => {
  beforeEach(() => {
    // Reset store before each test
    const { result } = renderHook(() => useTaskStore());
    act(() => {
      result.current.setTasks([]);
      result.current.setError(null);
      result.current.setLoading(false);
    });
  });

  describe("Initial State", () => {
    it("should have initial state", () => {
      const { result } = renderHook(() => useTaskStore());

      expect(result.current.tasks).toEqual([]);
      expect(result.current.loading).toBe(false);
      expect(result.current.error).toBeNull();
    });
  });

  describe("setTasks", () => {
    it("should set tasks correctly", () => {
      const { result } = renderHook(() => useTaskStore());
      const tasks = [mockTask, mockTask2];

      act(() => {
        result.current.setTasks(tasks);
      });

      expect(result.current.tasks).toEqual(tasks);
      expect(result.current.tasks).toHaveLength(2);
    });

    it("should replace existing tasks", () => {
      const { result } = renderHook(() => useTaskStore());

      // Set initial tasks
      act(() => {
        result.current.setTasks([mockTask]);
      });

      expect(result.current.tasks).toHaveLength(1);

      // Replace with new tasks
      act(() => {
        result.current.setTasks([mockTask2]);
      });

      expect(result.current.tasks).toEqual([mockTask2]);
      expect(result.current.tasks).toHaveLength(1);
    });
  });

  describe("addTask", () => {
    it("should add a new task to the beginning of the list", () => {
      const { result } = renderHook(() => useTaskStore());

      act(() => {
        result.current.addTask(mockTask);
      });

      expect(result.current.tasks[0]).toBe(mockTask);
      expect(result.current.tasks).toHaveLength(1);
    });

    it("should add multiple tasks with newest first", () => {
      const { result } = renderHook(() => useTaskStore());

      act(() => {
        result.current.addTask(mockTask);
        result.current.addTask(mockTask2);
      });

      expect(result.current.tasks).toHaveLength(2);
      expect(result.current.tasks[0]).toBe(mockTask2); // Newest first
      expect(result.current.tasks[1]).toBe(mockTask); // Older second
    });
  });

  describe("updateTask", () => {
    it("should update an existing task", () => {
      const { result } = renderHook(() => useTaskStore());

      // Add initial task
      act(() => {
        result.current.addTask(mockTask);
      });

      // Update the task
      act(() => {
        result.current.updateTask("1", {
          title: "Updated Title",
          completed: true,
        });
      });

      const updatedTask = result.current.tasks.find((task) => task.id === "1");
      expect(updatedTask?.title).toBe("Updated Title");
      expect(updatedTask?.completed).toBe(true);
      expect(updatedTask?.updatedAt).not.toBe(mockTask.updatedAt);
    });

    it("should not update non-existent task", () => {
      const { result } = renderHook(() => useTaskStore());

      act(() => {
        result.current.addTask(mockTask);
      });

      const originalTasks = [...result.current.tasks];

      act(() => {
        result.current.updateTask("999", { title: "Updated Title" });
      });

      expect(result.current.tasks).toEqual(originalTasks);
    });

    it("should update only specified fields", () => {
      const { result } = renderHook(() => useTaskStore());

      act(() => {
        result.current.addTask(mockTask);
      });

      act(() => {
        result.current.updateTask("1", { completed: true });
      });

      const updatedTask = result.current.tasks.find((task) => task.id === "1");
      expect(updatedTask?.title).toBe(mockTask.title); // Should remain unchanged
      expect(updatedTask?.description).toBe(mockTask.description); // Should remain unchanged
      expect(updatedTask?.completed).toBe(true); // Should be updated
    });
  });

  describe("deleteTask", () => {
    it("should delete an existing task", () => {
      const { result } = renderHook(() => useTaskStore());

      act(() => {
        result.current.addTask(mockTask);
        result.current.addTask(mockTask2);
      });

      expect(result.current.tasks).toHaveLength(2);

      act(() => {
        result.current.deleteTask("1");
      });

      expect(result.current.tasks).toHaveLength(1);
      expect(result.current.tasks).not.toContain(mockTask);
      expect(result.current.tasks).toContain(mockTask2);
    });

    it("should not affect other tasks when deleting non-existent task", () => {
      const { result } = renderHook(() => useTaskStore());

      act(() => {
        result.current.addTask(mockTask);
      });

      const originalTasks = [...result.current.tasks];

      act(() => {
        result.current.deleteTask("999");
      });

      expect(result.current.tasks).toEqual(originalTasks);
    });
  });

  describe("toggleTask", () => {
    it("should toggle task completion status", () => {
      const { result } = renderHook(() => useTaskStore());

      act(() => {
        result.current.addTask(mockTask);
      });

      expect(result.current.tasks[0].completed).toBe(false);

      act(() => {
        result.current.toggleTask("1");
      });

      expect(result.current.tasks[0].completed).toBe(true);

      act(() => {
        result.current.toggleTask("1");
      });

      expect(result.current.tasks[0].completed).toBe(false);
    });

    it("should update the updatedAt timestamp when toggling", () => {
      const { result } = renderHook(() => useTaskStore());

      act(() => {
        result.current.addTask(mockTask);
      });

      const originalUpdatedAt = result.current.tasks[0].updatedAt;

      act(() => {
        result.current.toggleTask("1");
      });

      expect(result.current.tasks[0].updatedAt).not.toBe(originalUpdatedAt);
    });

    it("should not affect other tasks when toggling non-existent task", () => {
      const { result } = renderHook(() => useTaskStore());

      act(() => {
        result.current.addTask(mockTask);
      });

      const originalTasks = [...result.current.tasks];

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
    it("should set error message", () => {
      const { result } = renderHook(() => useTaskStore());
      const errorMessage = "Test error message";

      act(() => {
        result.current.setError(errorMessage);
      });

      expect(result.current.error).toBe(errorMessage);
    });

    it("should set error to null", () => {
      const { result } = renderHook(() => useTaskStore());

      act(() => {
        result.current.setError("Some error");
        result.current.setError(null);
      });

      expect(result.current.error).toBeNull();
    });
  });

  describe("clearError", () => {
    it("should clear error message", () => {
      const { result } = renderHook(() => useTaskStore());

      act(() => {
        result.current.setError("Test error");
        result.current.clearError();
      });

      expect(result.current.error).toBeNull();
    });
  });

  describe("Complex Operations", () => {
    it("should handle multiple operations correctly", () => {
      const { result } = renderHook(() => useTaskStore());

      // Add tasks
      act(() => {
        result.current.addTask(mockTask);
        result.current.addTask(mockTask2);
      });

      expect(result.current.tasks).toHaveLength(2);

      // Update first task
      act(() => {
        result.current.updateTask("1", { title: "Updated Title" });
      });

      // Toggle second task
      act(() => {
        result.current.toggleTask("2");
      });

      // Delete first task
      act(() => {
        result.current.deleteTask("1");
      });

      expect(result.current.tasks).toHaveLength(1);
      expect(result.current.tasks[0].id).toBe("2");
      expect(result.current.tasks[0].completed).toBe(false); // Toggled from true to false
    });

    it("should maintain data integrity during operations", () => {
      const { result } = renderHook(() => useTaskStore());

      // Add task
      act(() => {
        result.current.addTask(mockTask);
      });

      const originalTask = { ...mockTask };

      // Perform multiple operations
      act(() => {
        result.current.updateTask("1", { title: "New Title" });
        result.current.toggleTask("1");
        result.current.updateTask("1", { description: "New Description" });
      });

      const finalTask = result.current.tasks[0];

      expect(finalTask.id).toBe(originalTask.id);
      expect(finalTask.createdAt).toBe(originalTask.createdAt);
      expect(finalTask.title).toBe("New Title");
      expect(finalTask.description).toBe("New Description");
      expect(finalTask.completed).toBe(true);
      expect(finalTask.updatedAt).not.toBe(originalTask.updatedAt);
    });
  });
});
