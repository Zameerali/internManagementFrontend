import React, { useState } from "react";
import {
  Container,
  Typography,
  Card,
  CardContent,
  Chip,
  Box,
  Button,
  Stack,
  CircularProgress,
  MenuItem,
  Select,
  FormControl,
  InputLabel,
} from "@mui/material";
import { useGetMyTasksQuery, useUpdateTaskStatusMutation } from "./tasksApi"; // <-- Use intern's own tasks API
import type { Task } from "./type";

const statusOptions = [
  { value: "pending", label: "Pending" },
  { value: "in-progress", label: "In Progress" },
  { value: "completed", label: "Completed" },
];

const InternTasks: React.FC = () => {
  const { data: tasks = [], isLoading } = useGetMyTasksQuery(); // Only fetch intern's own tasks
  const [updateTaskStatus] = useUpdateTaskStatusMutation();
  const [updatingId, setUpdatingId] = useState<number | null>(null);

  const handleStatusChange = async (taskId: number, status: string) => {
    setUpdatingId(taskId);
    try {
      await updateTaskStatus({ id: taskId, status }).unwrap();
    } catch {}
    setUpdatingId(null);
  };

  return (
    <Container sx={{ mt: 4, mb: 4 }}>
      <Typography
        variant="h4"
        fontWeight={700}
        color="primary"
        align="center"
        gutterBottom
      >
        My Tasks
      </Typography>
      <Box sx={{ width: "100%", mt: 3 }}>
        {isLoading ? (
          <Card sx={{ p: 4, textAlign: "center", boxShadow: 2 }}>
            <CircularProgress />
          </Card>
        ) : tasks.length === 0 ? (
          <Card
            sx={{
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              justifyContent: "center",
              background: "linear-gradient(135deg, #f5faff 60%, #e3f2fd 100%)",
              borderRadius: 4,
              boxShadow: 3,
              p: 4,
              maxWidth: 400,
              mx: "auto",
              border: "1px solid #e3f2fd",
            }}
          >
            <Box
              sx={{
                width: 100,
                height: 100,
                mb: 2,
                opacity: 0.7,
                background:
                  "url(https://cdn-icons-png.flaticon.com/512/4076/4076549.png) center/contain no-repeat",
              }}
            />
            <Typography
              variant="h6"
              color="primary"
              fontWeight={700}
              sx={{ mb: 1 }}
            >
              No tasks found
            </Typography>
            <Typography color="text.secondary" sx={{ fontSize: 16 }}>
              You have no assigned tasks yet.
            </Typography>
          </Card>
        ) : (
          <Stack spacing={3}>
            {tasks.map((task: Task) => (
              <Card
                key={task.id}
                sx={{
                  boxShadow: 2,
                  borderRadius: 3,
                  border: "1px solid #e3f2fd",
                  background:
                    "linear-gradient(135deg, #f5faff 60%, #e3f2fd 100%)",
                  width: "100%",
                }}
              >
                <CardContent>
                  <Typography
                    variant="h6"
                    fontWeight={700}
                    color="primary.dark"
                    gutterBottom
                  >
                    {task.title}
                  </Typography>
                  <Typography
                    variant="body2"
                    color="text.secondary"
                    sx={{ mb: 1 }}
                  >
                    {task.description}
                  </Typography>
                  <Box
                    sx={{
                      display: "flex",
                      gap: 2,
                      flexWrap: "wrap",
                      alignItems: "center",
                      mb: 1,
                    }}
                  >
                    <Chip
                      label={`Status: ${task.status}`}
                      color={
                        task.status === "completed"
                          ? "success"
                          : task.status === "in-progress"
                          ? "primary"
                          : "warning"
                      }
                      size="small"
                      sx={{ fontWeight: 600, mr: 1, mb: 0.5 }}
                    />
                    <Typography
                      variant="caption"
                      color="text.secondary"
                      sx={{ fontWeight: 500 }}
                    >
                      Date: {task.task_date?.split("T")[0]}
                    </Typography>
                    <Typography
                      variant="caption"
                      color="text.secondary"
                      sx={{ fontWeight: 500 }}
                    >
                      Deadline:{" "}
                      {task.deadline ? task.deadline.split("T")[0] : "N/A"}
                    </Typography>
                  </Box>
                  <FormControl size="small" sx={{ minWidth: 140, mr: 2 }}>
                    <InputLabel>Status</InputLabel>
                    <Select
                      value={task.status}
                      label="Status"
                      onChange={(e) =>
                        handleStatusChange(task.id, e.target.value)
                      }
                      disabled={
                        updatingId === task.id || task.status === "completed"
                      }
                    >
                      {statusOptions.map((opt) => (
                        <MenuItem key={opt.value} value={opt.value}>
                          {opt.label}
                        </MenuItem>
                      ))}
                    </Select>
                  </FormControl>
                  <Button
                    variant="contained"
                    color="primary"
                    size="small"
                    sx={{ ml: 2 }}
                    onClick={() => handleStatusChange(task.id, "completed")}
                    disabled={
                      task.status === "completed" || updatingId === task.id
                    }
                  >
                    Mark as Completed
                  </Button>
                </CardContent>
              </Card>
            ))}
          </Stack>
        )}
      </Box>
    </Container>
  );
};

export default InternTasks;
