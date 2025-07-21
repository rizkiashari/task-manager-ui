# Custom Hooks

This directory contains custom React hooks that encapsulate business logic and state management for the task management application.

## 🎯 Overview

The hooks are designed to separate business logic from UI components, making the code more maintainable, testable, and reusable.

## 📚 Available Hooks

### `useTasks`

Main hook for task management operations including filtering, sorting, and CRUD operations.

```typescript
const {
  tasks,
  newTasks,
  oldTasks,
  statistics,
  loading,
  error,
  filters,
  initializeTasks,
  createTask,
  removeTask,
  toggleTaskCompletion,
  updateFilters,
  resetFilters,
} = useTasks();
```

**Features:**

- Task filtering and sorting
- Statistics calculation
- New/old task separation
- Error handling
- Loading states

### `useTaskForm`

Handles form state and validation for task creation.

```typescript
const {
  formData,
  errors,
  isSubmitting,
  showConfirm,
  titleCharacterCount,
  descriptionCharacterCount,
  isTitleAtLimit,
  isDescriptionAtLimit,
  updateField,
  handleSubmit,
  handleConfirm,
  handleCancel,
  resetForm,
  validateForm,
} = useTaskForm();
```

**Features:**

- Form validation
- Character counting
- Submission handling
- Error management
- Confirmation dialog

### `usePDFReport`

Manages PDF report generation and configuration.

```typescript
const {
  isGenerating,
  options,
  generatePDF,
  updateOptions,
  resetOptions,
  calculateStatistics,
  sortTasksForReport,
  formatTaskForReport,
  canGenerateReport,
  getReportFilename,
} = usePDFReport();
```

**Features:**

- PDF generation state
- Report options management
- Task formatting for reports
- Statistics calculation
- File naming

### `useTaskActions`

Handles individual task actions like toggle and delete.

```typescript
const {
  actionState,
  toggleTask,
  showDeleteConfirm,
  hideDeleteConfirm,
  deleteTask,
  cancelDelete,
  resetActions,
  isTaskToggling,
  isTaskDeleting,
  getProcessingTaskId,
  isAnyActionInProgress,
} = useTaskActions();
```

**Features:**

- Action state management
- Loading states per task
- Confirmation dialogs
- Error handling
- Action progress tracking

## 🏗️ Architecture Benefits

### Separation of Concerns

- **UI Components**: Focus on rendering and user interaction
- **Hooks**: Handle business logic and state management
- **Store**: Manage global state and data persistence

### Reusability

- Hooks can be used across multiple components
- Business logic is centralized and consistent
- Easy to test in isolation

### Maintainability

- Clear separation of responsibilities
- Easy to modify business logic without touching UI
- Consistent error handling and loading states

### Testability

- Hooks can be tested independently
- Mock dependencies easily
- Clear input/output contracts

## 📝 Usage Examples

### Basic Task Management

```typescript
import { useTasks } from "../hooks";

function TaskList() {
  const { tasks, loading, createTask } = useTasks();

  const handleCreateTask = async (taskData) => {
    const result = await createTask(taskData);
    if (result.success) {
      // Handle success
    }
  };

  // Component logic...
}
```

### Form Handling

```typescript
import { useTaskForm } from "../hooks";

function AddTaskForm() {
  const { formData, errors, updateField, handleSubmit, handleConfirm } =
    useTaskForm();

  const onSubmit = (e) => {
    handleSubmit(e);
  };

  // Component logic...
}
```

### Task Actions

```typescript
import { useTaskActions } from "../hooks";

function TaskItem({ task }) {
  const { toggleTask, showDeleteConfirm, isTaskToggling, isTaskDeleting } =
    useTaskActions();

  const handleToggle = () => {
    toggleTask(task.id, onToggleCallback);
  };

  // Component logic...
}
```

## 🔧 Best Practices

### 1. Hook Composition

Combine hooks when needed:

```typescript
function TaskManager() {
  const tasks = useTasks();
  const form = useTaskForm();
  const actions = useTaskActions();

  // Combine logic as needed
}
```

### 2. Error Handling

Always handle errors from hooks:

```typescript
const result = await createTask(taskData);
if (!result.success) {
  // Handle error appropriately
}
```

### 3. Loading States

Use loading states for better UX:

```typescript
if (loading) {
  return <LoadingSpinner />;
}
```

### 4. Memoization

Hooks use `useCallback` and `useMemo` for performance:

```typescript
// Hooks are already optimized, just use them
const { tasks } = useTasks();
```

## 🧪 Testing

Hooks can be tested using `@testing-library/react-hooks`:

```typescript
import { renderHook, act } from "@testing-library/react-hooks";
import { useTasks } from "../hooks/useTasks";

test("should create task", async () => {
  const { result } = renderHook(() => useTasks());

  await act(async () => {
    const response = await result.current.createTask({
      title: "Test Task",
      description: "Test Description",
    });

    expect(response.success).toBe(true);
  });
});
```

## 📈 Performance Considerations

- Hooks use `useCallback` and `useMemo` for optimization
- State updates are batched appropriately
- Dependencies are carefully managed to prevent unnecessary re-renders
- Loading states prevent multiple simultaneous operations

## 🔄 State Management Flow

```
UI Component → Custom Hook → Zustand Store → Dummy Data
     ↑              ↑              ↑            ↑
   Events    Business Logic   Global State   Data Layer
```

This architecture ensures clean separation of concerns and maintainable code.
