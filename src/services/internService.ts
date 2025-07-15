import API from "./api";
import type { Intern } from "../types/intern.ts";

export const getAllInterns = async (): Promise<Intern[]> => {
  const res = await API.get("/interns");
  return res.data;
};

export const getInternWithProfile = async (id: number): Promise<Intern> => {
  const res = await API.get(`/interns/${id}/profile`);
  return res.data;
};
export const addIntern = async (intern: {
  name: string;
  email: string;
  joined_date: string;
  bio?: string;
  linkedin?: string;
}) => {
  const res = await API.post("/interns", intern);
  return res.data;
};
