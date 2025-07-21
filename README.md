# Task Management Dashboard

A modern task management application built with React.js, TypeScript, and Next.js. This application provides a comprehensive interface for managing tasks with features like creating, viewing, toggling completion status, deleting tasks, and generating PDF reports.

## Features

### ✅ Core Functionality

- **View and Manage Tasks**: Display all tasks with their titles, descriptions, and completion status
- **Create Tasks**: Add new tasks with title (required) and description (optional)
- **Toggle Completion**: Mark tasks as complete/incomplete with visual indicators
- **Delete Tasks**: Remove tasks with confirmation dialog
- **PDF Report Generation**: Download comprehensive PDF reports of all tasks

### 🎨 User Experience

- **Modern UI**: Clean, responsive design using Tailwind CSS
- **Visual Feedback**: Completed tasks are visually distinguished with green styling and strikethrough
- **Loading States**: Smooth loading indicators for all async operations
- **Error Handling**: Comprehensive error messages and user feedback
- **Responsive Design**: Works seamlessly on desktop and mobile devices

### 🛠 Technical Features

- **TypeScript**: Full type safety throughout the application
- **State Management**: Zustand for efficient state management
- **API Integration**: Mock API service ready for FastAPI backend integration
- **Testing**: React Testing Library for component testing
- **PDF Generation**: jsPDF for creating downloadable task reports

## Tech Stack

- **Frontend**: React.js + TypeScript + Next.js 15
- **Styling**: Tailwind CSS
- **State Management**: Zustand
- **API Client**: Axios (with mock implementation)
- **PDF Generation**: jsPDF
- **Testing**: React Testing Library + Jest
- **Build Tool**: Next.js with Turbopack

## Getting Started

### Prerequisites

- Node.js 18+
- npm or yarn

### Installation

Clone the repository:

```bash
git clone <repository-url>
cd test-interview
```

1. Install dependencies:

```bash
npm install
```

2. Run the development server:

```bash
npm run dev
```

3. Open [http://localhost:3000](http://localhost:3000) in your browser.

### Available Scripts

- `npm run dev` - Start development server with Turbopack
- `npm run build` - Build for production
- `npm run start` - Start production server
- `npm run lint` - Run ESLint
- `npm run test` - Run tests
- `npm run test:watch` - Run tests in watch mode
- `npm run server` - Start JSON Server (mock API) on port 3001
- `npm run dev:full` - Start both Next.js dev server and JSON Server

## Project Structure

```bash
src/
├── app/                    # Next.js app directory
│   ├── layout.tsx         # Root layout
│   ├── page.tsx           # Main dashboard page
│   └── globals.css        # Global styles
├── components/            # React components
│   ├── TaskList.tsx       # Task list component
│   ├── TaskItem.tsx       # Individual task component
│   ├── CreateTaskForm.tsx # Task creation form
│   ├── PDFReport.tsx      # PDF report generation
│   └── __tests__/         # Test files
├── store/                 # State management
│   └── taskStore.ts       # Zustand store
├── services/              # API services
│   └── api.ts            # Task API service
└── types/                 # TypeScript types
    └── task.ts           # Task-related types
```

## API Integration

### JSON Server (Mock API)

The application uses JSON Server to provide a realistic API experience with Axios:

1. **Start JSON Server**: `npm run server` (runs on <http://localhost:3001>)
2. **Start both servers**: `npm run dev:full` (Next.js + JSON Server)
3. **API Endpoints**:
   - `GET http://localhost:3001/tasks` - Get all tasks
   - `POST http://localhost:3001/tasks` - Create a new task
   - `PUT http://localhost:3001/tasks/{id}` - Update a task
   - `DELETE http://localhost:3001/tasks/{id}` - Delete a task
   - `GET http://localhost:3001/tasks/{id}` - Get specific task

### FastAPI Integration

To integrate with a real FastAPI backend:

1. Update the `API_BASE_URL` in `src/services/api.ts`
2. Ensure your FastAPI backend provides the following endpoints:
   - `GET /tasks` - Get all tasks
   - `POST /tasks` - Create a new task
   - `PUT /tasks/{id}` - Update a task
   - `DELETE /tasks/{id}` - Delete a task
   - `GET /tasks/{id}` - Get specific task

## Testing

The project includes comprehensive tests using React Testing Library and Jest:

```bash
# Run all tests
npm test

# Run tests in watch mode
npm run test:watch
```

Test files are located in `src/components/__tests__/` and follow the naming convention `*.test.tsx`.

## Deployment

### Vercel (Recommended)

1. Push your code to GitHub
2. Connect your repository to Vercel
3. Deploy automatically on every push

### Manual Deployment

1. Build the application:

```bash
npm run build
```

2. Start the production server:

```bash
npm start
```

## Features in Detail

### Task Management

- **Create**: Add new tasks with validation
- **View**: See all tasks with completion status
- **Toggle**: Mark tasks complete/incomplete
- **Delete**: Remove tasks with confirmation

### PDF Report Generation

- **Comprehensive Reports**: Include all task details
- **Summary Statistics**: Total tasks, completion rate
- **Professional Formatting**: Clean, readable PDF layout
- **Timestamp**: Include generation date and time

### User Interface

- **Responsive Design**: Works on all screen sizes
- **Visual Feedback**: Clear status indicators
- **Loading States**: Smooth user experience
- **Error Handling**: User-friendly error messages

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests for new functionality
5. Submit a pull request

## License

This project is licensed under the MIT License.

## Support

For support or questions, please open an issue in the repository.
