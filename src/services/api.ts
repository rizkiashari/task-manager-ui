import axios from "axios";
import { Task, CreateTaskRequest } from "../types/task";

// Create axios instance for Next.js API routes
const api = axios.create({
  baseURL: "/api",
});

export const taskApi = {
  // Get all tasks
  async getTasks(): Promise<Task[]> {
    try {
      const response = await api.get("/tasks");
      return response.data;
    } catch (error) {
      console.error("Error fetching tasks:", error);
      throw new Error("Failed to fetch tasks");
    }
  },

  // Create a new task
  async createTask(taskData: CreateTaskRequest): Promise<Task> {
    try {
      const newTask = {
        ...taskData,
        completed: false,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };

      const response = await api.post("/tasks", newTask);
      return response.data;
    } catch (error) {
      console.error("Error creating task:", error);
      throw new Error("Failed to create task");
    }
  },

  // Delete a task
  async deleteTask(taskId: string): Promise<void> {
    try {
      await api.delete(`/tasks/${taskId}`);
    } catch (error) {
      console.error("Error deleting task:", error);
      throw new Error("Failed to delete task");
    }
  },

  // Get a single task (helper method)
  async getTask(taskId: string): Promise<Task> {
    try {
      const response = await api.get(`/tasks/${taskId}`);
      return response.data;
    } catch (error) {
      console.error("Error fetching task:", error);
      throw new Error("Failed to fetch task");
    }
  },
};
