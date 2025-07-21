import { Task, CreateTaskRequest } from "../types/task";
import {
  dummyTasks,
  generateId,
  getCurrentTimestamp,
} from "../data/dummyTasks";

// Simulate API delay
const delay = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

export const taskApi = {
  // Get all tasks
  async getTasks(): Promise<Task[]> {
    try {
      await delay(500); // Simulate network delay
      return [...dummyTasks];
    } catch (error) {
      console.error("Error fetching tasks:", error);
      throw new Error("Failed to fetch tasks");
    }
  },

  // Create a new task
  async createTask(taskData: CreateTaskRequest): Promise<Task> {
    try {
      await delay(300); // Simulate network delay
      const newTask: Task = {
        ...taskData,
        id: generateId(),
        completed: false,
        createdAt: getCurrentTimestamp(),
        updatedAt: getCurrentTimestamp(),
      };
      return newTask;
    } catch (error) {
      console.error("Error creating task:", error);
      throw new Error("Failed to create task");
    }
  },

  // Delete a task
  async deleteTask(taskId: string): Promise<void> {
    try {
      await delay(200); // Simulate network delay
      // In dummy mode, we don't actually delete from the dummy data
      // The store will handle the deletion
      return;
    } catch (error) {
      console.error("Error deleting task:", error);
      throw new Error("Failed to delete task");
    }
  },

  // Get a single task (helper method)
  async getTask(taskId: string): Promise<Task> {
    try {
      await delay(200); // Simulate network delay
      const task = dummyTasks.find((t) => t.id === taskId);
      if (!task) {
        throw new Error("Task not found");
      }
      return task;
    } catch (error) {
      console.error("Error fetching task:", error);
      throw new Error("Failed to fetch task");
    }
  },
};
