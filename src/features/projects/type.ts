export interface Project {
  id: number;
  name: string;
  status: string;
  assignedInternIds?: number[];
}

export interface ProjectHistoryItem {
  id?: number;
  project_id: number;
  intern_id?: number;
  action: string;
  status?: string;
  timestamp?: string;
}
