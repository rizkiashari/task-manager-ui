import { taskApi } from "../api";
import { CreateTaskRequest, UpdateTaskRequest } from "../../types/task";

// Mock axios
jest.mock("axios", () => ({
  create: jest.fn(() => ({
    get: jest.fn(),
    post: jest.fn(),
    put: jest.fn(),
    delete: jest.fn(),
  })),
}));

// Get the mocked instance
const mockAxiosInstance = {
  get: jest.fn(),
  post: jest.fn(),
  put: jest.fn(),
  delete: jest.fn(),
};

describe("Task API Service", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe("getTasks", () => {
    it("should fetch tasks successfully", async () => {
      const mockTasks = [
        {
          id: "1",
          title: "Test Task",
          description: "Test Description",
          completed: false,
          createdAt: "2024-01-15T10:00:00Z",
          updatedAt: "2024-01-15T10:00:00Z",
        },
      ];

      mockAxiosInstance.get.mockResolvedValueOnce({ data: mockTasks });

      const result = await taskApi.getTasks();

      expect(mockAxiosInstance.get).toHaveBeenCalledWith("/tasks");
      expect(result).toEqual(mockTasks);
    });

    it("should handle error when fetching tasks fails", async () => {
      mockAxiosInstance.get.mockRejectedValueOnce(new Error("Network error"));

      await expect(taskApi.getTasks()).rejects.toThrow("Failed to fetch tasks");
      expect(mockAxiosInstance.get).toHaveBeenCalledWith("/tasks");
    });
  });

  describe("createTask", () => {
    it("should create task successfully", async () => {
      const taskData: CreateTaskRequest = {
        title: "New Task",
        description: "New Description",
      };

      const mockCreatedTask = {
        id: "2",
        title: "New Task",
        description: "New Description",
        completed: false,
        createdAt: "2024-01-16T10:00:00Z",
        updatedAt: "2024-01-16T10:00:00Z",
      };

      mockAxiosInstance.post.mockResolvedValueOnce({ data: mockCreatedTask });

      const result = await taskApi.createTask(taskData);

      expect(mockAxiosInstance.post).toHaveBeenCalledWith("/tasks", {
        title: "New Task",
        description: "New Description",
        completed: false,
        createdAt: expect.any(String),
        updatedAt: expect.any(String),
      });
      expect(result).toEqual(mockCreatedTask);
    });

    it("should handle error when creating task fails", async () => {
      const taskData: CreateTaskRequest = {
        title: "New Task",
      };

      mockAxiosInstance.post.mockRejectedValueOnce(
        new Error("Creation failed")
      );

      await expect(taskApi.createTask(taskData)).rejects.toThrow(
        "Failed to create task"
      );
      expect(mockAxiosInstance.post).toHaveBeenCalledWith(
        "/tasks",
        expect.any(Object)
      );
    });
  });

  describe("updateTask", () => {
    it("should update task successfully", async () => {
      const taskId = "1";
      const updates: UpdateTaskRequest = {
        title: "Updated Title",
        completed: true,
      };

      const mockUpdatedTask = {
        id: "1",
        title: "Updated Title",
        description: "Original Description",
        completed: true,
        createdAt: "2024-01-15T10:00:00Z",
        updatedAt: "2024-01-16T10:00:00Z",
      };

      mockAxiosInstance.put.mockResolvedValueOnce({ data: mockUpdatedTask });

      const result = await taskApi.updateTask(taskId, updates);

      expect(mockAxiosInstance.put).toHaveBeenCalledWith(`/tasks/${taskId}`, {
        title: "Updated Title",
        completed: true,
        updatedAt: expect.any(String),
      });
      expect(result).toEqual(mockUpdatedTask);
    });

    it("should handle error when updating task fails", async () => {
      const taskId = "1";
      const updates: UpdateTaskRequest = {
        title: "Updated Title",
      };

      mockAxiosInstance.put.mockRejectedValueOnce(new Error("Update failed"));

      await expect(taskApi.updateTask(taskId, updates)).rejects.toThrow(
        "Failed to update task"
      );
      expect(mockAxiosInstance.put).toHaveBeenCalledWith(
        `/tasks/${taskId}`,
        expect.any(Object)
      );
    });
  });

  describe("deleteTask", () => {
    it("should delete task successfully", async () => {
      const taskId = "1";

      mockAxiosInstance.delete.mockResolvedValueOnce({ status: 204 });

      await taskApi.deleteTask(taskId);

      expect(mockAxiosInstance.delete).toHaveBeenCalledWith(`/tasks/${taskId}`);
    });

    it("should handle error when deleting task fails", async () => {
      const taskId = "1";

      mockAxiosInstance.delete.mockRejectedValueOnce(
        new Error("Delete failed")
      );

      await expect(taskApi.deleteTask(taskId)).rejects.toThrow(
        "Failed to delete task"
      );
      expect(mockAxiosInstance.delete).toHaveBeenCalledWith(`/tasks/${taskId}`);
    });
  });

  describe("toggleTask", () => {
    it("should toggle task completion successfully", async () => {
      const taskId = "1";

      const mockCurrentTask = {
        id: "1",
        title: "Test Task",
        description: "Test Description",
        completed: false,
        createdAt: "2024-01-15T10:00:00Z",
        updatedAt: "2024-01-15T10:00:00Z",
      };

      const mockToggledTask = {
        ...mockCurrentTask,
        completed: true,
        updatedAt: "2024-01-16T10:00:00Z",
      };

      mockAxiosInstance.get.mockResolvedValueOnce({ data: mockCurrentTask });
      mockAxiosInstance.put.mockResolvedValueOnce({ data: mockToggledTask });

      const result = await taskApi.toggleTask(taskId);

      expect(mockAxiosInstance.get).toHaveBeenCalledWith(`/tasks/${taskId}`);
      expect(mockAxiosInstance.put).toHaveBeenCalledWith(`/tasks/${taskId}`, {
        completed: true,
        updatedAt: expect.any(String),
      });
      expect(result).toEqual(mockToggledTask);
    });

    it("should handle error when getting task fails", async () => {
      const taskId = "1";

      mockAxiosInstance.get.mockRejectedValueOnce(new Error("Get failed"));

      await expect(taskApi.toggleTask(taskId)).rejects.toThrow(
        "Failed to toggle task"
      );
      expect(mockAxiosInstance.get).toHaveBeenCalledWith(`/tasks/${taskId}`);
    });
  });
});
