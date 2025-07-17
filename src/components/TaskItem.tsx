import type { Task } from "../features/tasks/type";
import { MenuItem, Select, Typography } from "@mui/material";
import { useState } from "react";
import { useUpdateTaskStatusMutation } from "../features/tasks/tasksApi";
import { useGetAllProjectsQuery } from "../features/projects/projectsApi";

type Props = {
  task: Task;
  onStatusChange: () => void;
};

export default function TaskItem({ task, onStatusChange }: Props) {
  const [updateTaskStatus] = useUpdateTaskStatusMutation();
  const { data: projects = [] } = useGetAllProjectsQuery();
  const [status, setStatus] = useState(task.status);
  const handleChange = async (newStatus: string) => {
    setStatus(newStatus);
    await updateTaskStatus({ id: task.id, status: newStatus });
    onStatusChange();
  };

  // Find project name by project_id
  const project = projects.find((p: any) => p.id === task.project_id);
  const projectName = project ? project.name : "-";

  return (
    <div className="border p-4 mb-3 rounded-md shadow">
      <Typography variant="h6">
        Task Title: <b>{task.title}</b>
      </Typography>
      <Typography className="text-sm text-gray-600">
        Task Description: <b>{task.description}</b>
      </Typography>
      <Typography className="text-xs mt-1">
        Date: <b>{new Date(task.task_date).toLocaleDateString()}</b>
      </Typography>
      {/* <Typography className="text-xs mt-1">Assigned Project: <b>{projectName}</b></Typography> */}

      <div className="mt-2">
        <Select
          value={status}
          size="small"
          onChange={(e) => handleChange(e.target.value)}
        >
          <MenuItem value="pending">Pending</MenuItem>
          <MenuItem value="in_progress">In Progress</MenuItem>
          <MenuItem value="completed">Completed</MenuItem>
        </Select>
      </div>
    </div>
  );
}
