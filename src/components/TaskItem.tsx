import type { Task } from "../features/tasks/type";
import {
  MenuItem,
  Select,
  Typography,
  Card,
  CardContent,
  Box,
  Chip,
} from "@mui/material";
import { useState } from "react";
import { useUpdateTaskStatusMutation } from "../features/tasks/tasksApi";
import { useGetAllProjectsQuery } from "../features/projects/projectsApi";
import { showSnackbar } from "../features/auth/authSlice";
import { useDispatch } from "react-redux";
type Props = {
  task: Task;
  onStatusChange: () => void;
};

export default function TaskItem({ task, onStatusChange }: Props) {
  const dispatch = useDispatch();

  const [updateTaskStatus] = useUpdateTaskStatusMutation();
  const { data: projects = [] } = useGetAllProjectsQuery();
  const [status, setStatus] = useState(task.status);
  const handleChange = async (newStatus: string) => {
    setStatus(newStatus);
    try {
      const res = await updateTaskStatus({
        id: task.id,
        status: newStatus,
      }).unwrap();
      console.log("Update task status response:", res);
      dispatch(
        showSnackbar({
          message: "Task status updated successfully!",
          severity: "success",
        })
      );
      onStatusChange();
    } catch (error: any) {
      console.error("Failed to update task status:", error);
      dispatch(
        showSnackbar({
          message: error.data?.error || "Failed to update task status",
          severity: "error",
        })
      );
      setStatus(task.status);
    }
  };

  // Find project name by project_id
  const project = projects.find((p: any) => p.id === task.project_id);
  const projectName = project ? project.name : "-";

  return (
    <Card
      elevation={4}
      sx={{
        mb: 3,
        borderRadius: 3,
        minWidth: 340,
        maxWidth: 700,
        width: "100%",
        mx: "auto",
        bgcolor: "#f8fafc",
        boxShadow: "0 4px 24px rgba(0,0,0,0.08)",
      }}
    >
      <CardContent>
        <Box
          display="flex"
          alignItems="center"
          justifyContent="space-between"
          mb={1}
        >
          <Typography variant="h6" fontWeight={700} color="#2563eb">
            {task.title}
          </Typography>
          <Chip
            label={status.replace("_", " ").toUpperCase()}
            color={
              status === "completed"
                ? "success"
                : status === "in_progress"
                ? "warning"
                : "default"
            }
            sx={{ fontWeight: 600 }}
          />
        </Box>
        <Typography variant="body2" color="text.secondary" mb={1}>
          <b>Description:</b> {task.description}
        </Typography>
        <Typography variant="body2" color="text.secondary" mb={1}>
          <b>Date:</b> {new Date(task.task_date).toLocaleDateString()}
        </Typography>
        <Typography variant="body2" color="text.secondary" mb={2}>
          <b>Project:</b> {projectName}
        </Typography>
        <Typography variant="body2" color="text.secondary" mb={2}>
          <b>Deadline:</b>{" "}
          {task.deadline ? new Date(task.deadline).toLocaleDateString() : "-"}
        </Typography>
        <Box display="flex" alignItems="center" gap={2}>
          <Select
            value={status}
            size="small"
            onChange={(e) => handleChange(e.target.value)}
            sx={{ minWidth: 150, bgcolor: "#fff" }}
          >
            <MenuItem value="pending">Pending</MenuItem>
            <MenuItem value="in_progress">In Progress</MenuItem>
            <MenuItem value="completed">Completed</MenuItem>
          </Select>
        </Box>
      </CardContent>
    </Card>
  );
}
