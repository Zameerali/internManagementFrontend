import API from "./api";
import type { Task } from "../types/task.tsx";

export const getTasksByIntern = async (internId: number): Promise<Task[]> => {
  const res = await API.get(`/interns/${internId}/tasks`);
  return res.data;
};
export const createTask = async (task: Task, internId: number) => {
  return API.post(`/interns/${internId}/tasks`, task);
};

export const updateTaskStatus = async (id: number, status: string) => {
  return API.put("/tasks/status", { id, status });
};
 export const getAllTasksWithInterns = async (): Promise<Task[]> => {
  const res = await API.get("/tasks/full");
  return res.data;
};