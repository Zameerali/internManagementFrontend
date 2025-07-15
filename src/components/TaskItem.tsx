import type { Task } from "../types/task";
import { MenuItem, Select, Typography } from "@mui/material";
import { useState } from "react";
import { updateTaskStatus } from "../services/taskService";

type Props = {
  task: Task;
  onStatusChange: () => void;
};

export default function TaskItem({ task, onStatusChange }: Props) {
  const [status, setStatus] = useState(task.status);

  const handleChange = async (newStatus: string) => {
    setStatus(newStatus);
    await updateTaskStatus(task.id, newStatus);
    onStatusChange();
  };

  return (
    <div className="border p-4 mb-3 rounded-md shadow">
      <Typography variant="h6">{task.title}</Typography>
      <Typography className="text-sm text-gray-600">
        {task.description}
      </Typography>
      <Typography className="text-xs mt-1">
        Date: {new Date(task.task_date).toLocaleDateString()}
      </Typography>

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
