export interface Task {
  id: number;
  intern_id: number;
  project_id: number;
  title: string;
  description: string;
  task_date: string;
  status: string;
}

export interface NewTask {
  intern_id: number;
  project_id: number;
  title: string;
  description: string;
  task_date: string;
  status: string;
}
