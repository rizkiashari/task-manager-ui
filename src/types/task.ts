export interface Task {
  id: string;
  title: string;
  description?: string;
  completed: boolean;
  start_date: string;
  end_date: string;
  pic_name: string;
  createdAt: string;
  updatedAt: string;
}

export interface CreateTaskRequest {
  title: string;
  description?: string;
  start_date: string;
  end_date: string;
  pic_name: string;
}
