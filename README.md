# Task Management System

A modern, responsive task management application built with Next.js, TypeScript, and Tailwind CSS. This application allows users to create, manage, and track their tasks with a clean and intuitive interface.

## 🚀 Features

- **Task Management**: Create, edit, delete, and toggle task completion status
- **Search & Filter**: Search tasks by title/description and filter by status
- **Sorting**: Sort tasks by creation date, update date, or title
- **PDF Reports**: Generate comprehensive PDF reports of all tasks
- **Responsive Design**: Works seamlessly on desktop, tablet, and mobile devices
- **Real-time Updates**: Instant UI updates with optimistic rendering
- **Data Persistence**: Uses local state management with dummy data (no database required)
- **Custom Hooks**: Separated business logic into reusable custom hooks

## 🛠️ Tech Stack

- **Frontend**: Next.js 14, React 18, TypeScript
- **Styling**: Tailwind CSS
- **State Management**: Zustand
- **Testing**: Jest, React Testing Library
- **PDF Generation**: jsPDF, jsPDF-AutoTable
- **Icons**: Custom SVG components
- **Data**: Local dummy data (no external dependencies)
- **Architecture**: Custom hooks for business logic separation

## 📦 Installation

1. Clone the repository:

```bash
git clone <repository-url>
cd test-interview
```

2. Install dependencies:

```bash
npm install
```

3. Run the development server:

```bash
npm run dev
```

4. Open [http://localhost:3000](http://localhost:3000) in your browser.

## 🧪 Testing

Run the test suite:

```bash
npm test
```

Run tests in watch mode:

```bash
npm run test:watch
```

## 🏗️ Project Structure

```
src/
├── app/                    # Next.js app directory
│   ├── layout.tsx         # Root layout
│   ├── page.tsx           # Home page
│   └── globals.css        # Global styles
├── components/            # React components
│   ├── icons/            # Icon components
│   │   ├── index.tsx     # Icon exports
│   │   └── README.md     # Icon documentation
│   ├── AddTaskForm.tsx   # Task creation form
│   ├── TaskItem.tsx      # Individual task component
│   ├── PDFReport.tsx     # PDF generation component
│   ├── ConfirmDialog.tsx # Confirmation dialog
│   └── NewTaskIndicator.tsx # New task indicator
├── hooks/                # Custom hooks (Business Logic)
│   ├── useTasks.ts       # Main task management hook
│   ├── useTaskForm.ts    # Form handling hook
│   ├── usePDFReport.ts   # PDF generation hook
│   ├── useTaskActions.ts # Task actions hook
│   ├── index.ts          # Hook exports
│   └── README.md         # Hook documentation
├── data/                 # Data layer
│   └── dummyTasks.ts     # Dummy task data
├── services/             # Service layer
│   └── api.ts           # API service (dummy implementation)
├── store/               # State management
│   └── taskStore.ts     # Zustand store
├── types/               # TypeScript types
│   └── task.ts          # Task interface definitions
└── assets/              # Static assets
    └── index.ts         # Asset exports
```

## 🎨 Icon System

The application uses a custom icon system with reusable SVG components:

- **SpinnerIcon**: Loading/spinning indicator
- **SuccessIcon**: Success messages and completed status
- **ErrorIcon**: Error messages and warnings
- **PlusIcon**: Add/create actions
- **DownloadIcon**: Download actions (PDF reports)
- **DeleteIcon**: Delete/remove actions
- **CheckmarkIcon**: Completed task status
- **PendingIcon**: Pending task status

All icons are customizable via className prop and use `currentColor` for styling.

## 🪝 Custom Hooks Architecture

The application uses custom hooks to separate business logic from UI components:

### `useTasks` - Main Task Management

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

### `useTaskForm` - Form Handling

```typescript
const {
  formData,
  errors,
  isSubmitting,
  showConfirm,
  titleCharacterCount,
  descriptionCharacterCount,
  updateField,
  handleSubmit,
  handleConfirm,
  handleCancel,
  resetForm,
  validateForm,
} = useTaskForm();
```

### `usePDFReport` - PDF Generation

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
} = usePDFReport();
```

### `useTaskActions` - Task Actions

```typescript
const {
  actionState,
  toggleTask,
  showDeleteConfirm,
  hideDeleteConfirm,
  deleteTask,
  cancelDelete,
  isTaskToggling,
  isTaskDeleting,
} = useTaskActions();
```

## 📊 Data Management

The application uses dummy data stored locally in `src/data/dummyTasks.ts`. This approach:

- ✅ Eliminates database dependencies
- ✅ Works seamlessly in production (Vercel)
- ✅ Provides consistent test data
- ✅ Enables offline functionality
- ✅ Simplifies deployment

### Data Structure

```typescript
interface Task {
  id: string;
  title: string;
  description?: string;
  completed: boolean;
  createdAt: string;
  updatedAt: string;
}
```

## 🔧 Configuration

### Environment Variables

No environment variables required - the application works out of the box with dummy data.

### Build Configuration

- **Next.js**: Optimized for production builds
- **TypeScript**: Strict type checking enabled
- **Tailwind**: PurgeCSS for production builds
- **Jest**: Configured for React Testing Library

## 🚀 Deployment

### Vercel (Recommended)

1. Push your code to GitHub
2. Connect your repository to Vercel
3. Deploy automatically

### Other Platforms

The application can be deployed to any platform that supports Next.js:

```bash
npm run build
npm start
```

## 🧪 Testing Strategy

- **Unit Tests**: Component behavior and store logic
- **Integration Tests**: User interactions and workflows
- **Hook Tests**: Business logic in custom hooks
- **Mock Strategy**: Dummy data and mocked dependencies
- **Coverage**: Aim for >80% test coverage

## 📝 API Reference

### Store Methods

```typescript
// Load tasks from dummy data
loadTasks(): void

// Add new task
addTask(task: Omit<Task, 'id' | 'createdAt' | 'updatedAt'>): void

// Delete task by ID
deleteTask(id: string): void

// Toggle task completion
toggleTask(id: string): void

// State management
setTasks(tasks: Task[]): void
setLoading(loading: boolean): void
setError(error: string | null): void
clearError(): void
```

### Hook Methods

```typescript
// useTasks
createTask(taskData): Promise<{ success: boolean; error?: string }>
removeTask(taskId): Promise<{ success: boolean; error?: string }>
toggleTaskCompletion(taskId): Promise<{ success: boolean; error?: string }>

// useTaskForm
updateField(field, value): void
handleSubmit(event): void
handleConfirm(callback): Promise<void>

// usePDFReport
generatePDF(tasks, callback): Promise<{ success: boolean; error?: string }>
updateOptions(options): void

// useTaskActions
toggleTask(taskId, callback): Promise<{ success: boolean; error?: string }>
deleteTask(taskId, callback): Promise<{ success: boolean; error?: string }>
```

## 🏗️ Architecture Benefits

### Separation of Concerns

- **UI Components**: Focus on rendering and user interaction
- **Custom Hooks**: Handle business logic and state management
- **Store**: Manage global state and data persistence
- **Services**: Handle external API calls and data transformation

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

## 🔄 State Management Flow

```
UI Component → Custom Hook → Zustand Store → Dummy Data
     ↑              ↑              ↑            ↑
   Events    Business Logic   Global State   Data Layer
```

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests for new functionality
5. Submit a pull request

## 📄 License

This project is licensed under the MIT License.

## 🆘 Support

For support or questions, please open an issue in the repository.

---

**Note**: This application uses dummy data instead of a database to ensure reliable deployment and testing. All data is stored in memory and will reset on page refresh.
