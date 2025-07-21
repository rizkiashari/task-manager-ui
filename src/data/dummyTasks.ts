import { Task } from "../types/task";

// Dummy tasks data
export const dummyTasks: Task[] = [
  {
    id: "1",
    title: "Complete Project Documentation",
    description:
      "Write comprehensive documentation for the task management system including API endpoints, component structure, and deployment guide.",
    completed: true,
    createdAt: "2024-01-15T10:30:00.000Z",
    updatedAt: "2024-01-16T14:20:00.000Z",
  },
  {
    id: "2",
    title: "Implement User Authentication",
    description:
      "Add user login, registration, and session management features to the application.",
    completed: false,
    createdAt: "2024-01-16T09:15:00.000Z",
    updatedAt: "2024-01-16T09:15:00.000Z",
  },
  {
    id: "3",
    title: "Design Mobile Responsive UI",
    description: "Optimize the user interface for mobile devices and tablets.",
    completed: false,
    createdAt: "2024-01-17T11:45:00.000Z",
    updatedAt: "2024-01-17T11:45:00.000Z",
  },
  {
    id: "4",
    title: "Set Up Automated Testing",
    description:
      "Configure Jest and React Testing Library for unit and integration tests.",
    completed: true,
    createdAt: "2024-01-18T08:30:00.000Z",
    updatedAt: "2024-01-19T16:45:00.000Z",
  },
  {
    id: "5",
    title: "Deploy to Production",
    description:
      "Configure CI/CD pipeline and deploy the application to production environment.",
    completed: false,
    createdAt: "2024-01-19T13:20:00.000Z",
    updatedAt: "2024-01-19T13:20:00.000Z",
  },
  {
    id: "6",
    title: "Performance Optimization",
    description:
      "Implement code splitting, lazy loading, and other performance optimizations.",
    completed: false,
    createdAt: "2024-01-20T10:00:00.000Z",
    updatedAt: "2024-01-20T10:00:00.000Z",
  },
  {
    id: "7",
    title: "Security Audit",
    description:
      "Conduct security review and implement necessary security measures.",
    completed: false,
    createdAt: "2024-01-21T14:30:00.000Z",
    updatedAt: "2024-01-21T14:30:00.000Z",
  },
  {
    id: "8",
    title: "User Feedback Integration",
    description:
      "Add feedback forms and user rating system to collect user opinions.",
    completed: true,
    createdAt: "2024-01-22T09:45:00.000Z",
    updatedAt: "2024-01-23T11:15:00.000Z",
  },
];

// Helper function to generate unique ID
export const generateId = (): string => {
  return Date.now().toString() + Math.random().toString(36).substr(2, 9);
};

// Helper function to get current timestamp
export const getCurrentTimestamp = (): string => {
  return new Date().toISOString();
};
