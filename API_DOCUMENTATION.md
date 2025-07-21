# API Documentation

## JSON Server Mock API

The application uses JSON Server to provide a realistic API experience. The server runs on `http://localhost:3001`.

### Base URL

```bash
http://localhost:3001
```

### Endpoints

#### 1. Get All Tasks

```http
GET /tasks
```

**Response:**

```json
[
  {
    "id": "1",
    "title": "Complete project documentation",
    "description": "Write comprehensive documentation for the task management system",
    "completed": false,
    "createdAt": "2024-01-15T10:00:00Z",
    "updatedAt": "2024-01-15T10:00:00Z"
  }
]
```

#### 2. Get Single Task

```http
GET /tasks/{id}
```

**Response:**

```json
{
  "id": "1",
  "title": "Complete project documentation",
  "description": "Write comprehensive documentation for the task management system",
  "completed": false,
  "createdAt": "2024-01-15T10:00:00Z",
  "updatedAt": "2024-01-15T10:00:00Z"
}
```

#### 3. Create New Task

```http
POST /tasks
Content-Type: application/json
```

**Request Body:**

```json
{
  "title": "New Task Title",
  "description": "Task description (optional)",
  "completed": false
}
```

**Response:**

```json
{
  "id": "auto-generated",
  "title": "New Task Title",
  "description": "Task description (optional)",
  "completed": false,
  "createdAt": "2024-01-15T10:00:00Z",
  "updatedAt": "2024-01-15T10:00:00Z"
}
```

#### 4. Update Task

```http
PUT /tasks/{id}
Content-Type: application/json
```

**Request Body:**

```json
{
  "title": "Updated Task Title",
  "description": "Updated description",
  "completed": true
}
```

**Response:**

```json
{
  "id": "1",
  "title": "Updated Task Title",
  "description": "Updated description",
  "completed": true,
  "createdAt": "2024-01-15T10:00:00Z",
  "updatedAt": "2024-01-15T10:00:00Z"
}
```

#### 5. Delete Task

```http
DELETE /tasks/{id}
```

**Response:** `204 No Content`

### Testing with cURL

#### Get all tasks

```bash
curl http://localhost:3001/tasks
```

#### Get single task

```bash
curl http://localhost:3001/tasks/1
```

#### Create new task

```bash
curl -X POST http://localhost:3001/tasks \
  -H "Content-Type: application/json" \
  -d '{
    "title": "Test Task",
    "description": "This is a test task",
    "completed": false
  }'
```

#### Update task

```bash
curl -X PUT http://localhost:3001/tasks/1 \
  -H "Content-Type: application/json" \
  -d '{
    "title": "Updated Task",
    "description": "Updated description",
    "completed": true
  }'
```

#### Delete task

```bash
curl -X DELETE http://localhost:3001/tasks/1
```

### Testing with Axios (JavaScript)

```javascript
import axios from "axios";

const API_BASE_URL = "http://localhost:3001";

// Get all tasks
const getTasks = async () => {
  const response = await axios.get(`${API_BASE_URL}/tasks`);
  return response.data;
};

// Create new task
const createTask = async (taskData) => {
  const response = await axios.post(`${API_BASE_URL}/tasks`, taskData);
  return response.data;
};

// Update task
const updateTask = async (id, taskData) => {
  const response = await axios.put(`${API_BASE_URL}/tasks/${id}`, taskData);
  return response.data;
};

// Delete task
const deleteTask = async (id) => {
  await axios.delete(`${API_BASE_URL}/tasks/${id}`);
};

// Toggle task completion
const toggleTask = async (id) => {
  // First get current task
  const getResponse = await axios.get(`${API_BASE_URL}/tasks/${id}`);
  const currentTask = getResponse.data;

  // Toggle completion status
  const response = await axios.put(`${API_BASE_URL}/tasks/${id}`, {
    ...currentTask,
    completed: !currentTask.completed,
    updatedAt: new Date().toISOString(),
  });

  return response.data;
};
```

### Testing with Postman

1. **Collection Import**: You can import these endpoints into Postman
2. **Environment Variables**: Set `baseUrl` to `http://localhost:3001`
3. **Request Examples**: Use the cURL commands above as reference

### Features

- **Auto-generated IDs**: JSON Server automatically generates unique IDs
- **Real-time Updates**: Changes are immediately reflected in the database
- **CORS Enabled**: Cross-origin requests are supported
- **Error Handling**: Proper HTTP status codes and error messages
- **Data Persistence**: Data is saved to `db.json` file

### Starting the Server

```bash
# Start JSON Server only
npm run server

# Start both Next.js and JSON Server
npm run dev:full
```

The server will be available at `http://localhost:3001` and the Next.js app at `http://localhost:3000`.
