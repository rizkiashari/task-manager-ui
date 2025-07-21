import axios from "axios";
import { Task, CreateTaskRequest, UpdateTaskRequest } from "../types/task";

// JSON Server API URL
const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3001";

// Create Axios instance
const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

export const taskApi = {
  // Get all tasks
  getTasks: async (): Promise<Task[]> => {
    try {
      const response = await api.get("/tasks");
      return response.data;
    } catch (error) {
      console.error("Error fetching tasks:", error);
      throw new Error("Failed to fetch tasks");
    }
  },

  // Create a new task
  createTask: async (taskData: CreateTaskRequest): Promise<Task> => {
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

  // Update a task
  updateTask: async (id: string, updates: UpdateTaskRequest): Promise<Task> => {
    try {
      const updateData = {
        ...updates,
        updatedAt: new Date().toISOString(),
      };

      const response = await api.put(`/tasks/${id}`, updateData);
      return response.data;
    } catch (error) {
      console.error("Error updating task:", error);
      throw new Error("Failed to update task");
    }
  },

  // Delete a task
  deleteTask: async (id: string): Promise<void> => {
    try {
      await api.delete(`/tasks/${id}`);
    } catch (error) {
      console.error("Error deleting task:", error);
      throw new Error("Failed to delete task");
    }
  },

  // Toggle task completion
  toggleTask: async (id: string): Promise<Task> => {
    try {
      // First get the current task
      const getResponse = await api.get(`/tasks/${id}`);
      const currentTask = getResponse.data;

      // Toggle the completed status
      const updateData = {
        completed: !currentTask.completed,
        updatedAt: new Date().toISOString(),
      };

      const response = await api.put(`/tasks/${id}`, updateData);
      return response.data;
    } catch (error) {
      console.error("Error toggling task:", error);
      throw new Error("Failed to toggle task");
    }
  },
};
