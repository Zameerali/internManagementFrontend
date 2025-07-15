import API from "./api";
import type { Project } from "../types/project";

export const getAllProjects = async (): Promise<Project[]> => {
  const res = await API.get("/interns/project");
  return res.data;
};

export const assignProjectToInterns = async (
  projectId: number,
  internIds: number[]
) => {
  const promises = internIds.map((internId) =>
    API.post(`/interns/${internId}/projects`, { project_ids: [projectId] })
  );
  return Promise.all(promises);
};
