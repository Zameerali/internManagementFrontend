import API from "./api";
import type { Project } from "../types/project";
export const logProjectHistory = async (
  projectId: number,
  payload: { action: string; status?: string }
) => {
  return API.post(`/projects/${projectId}/history`, payload);
};
export const getAllProjects = async (): Promise<Project[]> => {
  const res = await API.get("/interns/project");
  return res.data;
};

export const assignProjectToInterns = async (
  projectId: number,
  internIds: number[]
) => {
  return API.post(`/interns/projects`, {
    project_id: projectId,
    intern_ids: internIds,
  });
};

export const getAssignedInterns = async (
  projectId: number
): Promise<number[]> => {
  const res = await API.get(`/projects/${projectId}/interns`);
  return res.data.map((intern: { id: number }) => intern.id);
};

export const updateProjectStatus = async (
  projectId: number,
  status: string
) => {
  return API.put("/projects/status", { id: projectId, status });
};
export const unassignProjectFromInterns = async (
  projectId: number,
  internIds: number[]
) => {
  return API.post(`/interns/projects/unassign`, {
    project_id: projectId,
    intern_ids: internIds,
  });
};
export const getProjectHistory = async (projectId: number) => {
  const res = await API.get(`/projects/${projectId}/history`);
  return res.data;
};

export const addProject = async (name: string) => {
  return API.post("/interns/project", { name, status: "in_progress" });
};
