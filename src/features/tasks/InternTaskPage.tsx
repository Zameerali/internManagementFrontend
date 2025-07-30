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
  useTheme,
  useMediaQuery,
} from "@mui/material";
import { useGetMyTasksQuery, useUpdateTaskStatusMutation } from "./tasksApi";
import { useGetMyProjectsQuery } from "../projects/projectsApi";
import type { Task } from "./type";
import AssignmentIcon from "@mui/icons-material/Assignment";
import FolderIcon from "@mui/icons-material/Folder";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import ScheduleIcon from "@mui/icons-material/Schedule";
import CalendarTodayIcon from "@mui/icons-material/CalendarToday";

const statusOptions = [
  { value: "pending", label: "Pending" },
  { value: "in-progress", label: "In Progress" },
  { value: "completed", label: "Completed" },
];

const InternTaskPage: React.FC = () => {
  const { data: projects = [], isLoading: projectsLoading } =
    useGetMyProjectsQuery();
  const { data: tasks = [], isLoading: tasksLoading } = useGetMyTasksQuery();
  const [updateTaskStatus] = useUpdateTaskStatusMutation();
  const [updatingId, setUpdatingId] = useState<number | null>(null);

  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));

  const project = projects[0]; 
  const projectTasks = project
    ? tasks.filter((task) => task.project_id === project.id)
    : [];

  const handleStatusChange = async (taskId: number, status: string) => {
    setUpdatingId(taskId);
    try {
      await updateTaskStatus({ id: taskId, status }).unwrap();
    } catch {}
    setUpdatingId(null);
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "completed":
        return "success";
      case "in-progress":
        return "primary";
      case "pending":
        return "warning";
      default:
        return "default";
    }
  };

  const formatDate = (dateString: string | undefined) => {
    if (!dateString) return "N/A";
    return new Date(dateString).toLocaleDateString();
  };

  const isDeadlinePassed = (deadline: string | undefined) => {
    if (!deadline) return false;
    return new Date(deadline) < new Date();
  };

  return (
    <Container
      sx={{
        maxWidth: { xs: "100%", sm: "95%", md: "90%", lg: "900px" },
        mt: { xs: 2, md: 4 },
        mb: { xs: 2, md: 4 },
        px: { xs: 0.5, sm: 2 },
        mx: "auto",
      }}
    >
      <Typography
        variant={isMobile ? "h5" : "h4"}
        fontWeight={700}
        color="primary"
        align="center"
        gutterBottom
        sx={{ mb: { xs: 2, md: 4 } }}
      >
        My Project & Tasks
      </Typography>

      <Box sx={{ width: "100%", mt: { xs: 1, md: 3 } }}>
        {/* Project Info */}
        {projectsLoading ? (
          <Card sx={{ p: { xs: 2, sm: 4 }, textAlign: "center", boxShadow: 2 }}>
            <CircularProgress />
          </Card>
        ) : !project ? (
          <Card
            sx={{
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              justifyContent: "center",
              background: "linear-gradient(135deg, #f5faff 60%, #e3f2fd 100%)",
              borderRadius: 4,
              boxShadow: 3,
              p: { xs: 3, sm: 6 },
              maxWidth: 400,
              mx: "auto",
              border: "1px solid #e3f2fd",
              mb: 4,
            }}
          >
            <FolderIcon
              sx={{ fontSize: 60, color: "primary.light", mb: 2, opacity: 0.7 }}
            />
            <Typography
              variant="h6"
              color="primary"
              fontWeight={700}
              sx={{ mb: 1 }}
            >
              No project assigned
            </Typography>
            <Typography color="text.secondary" sx={{ fontSize: 16 }}>
              You are not assigned to any project yet.
            </Typography>
          </Card>
        ) : (
          <>
            <Card
              sx={{
                boxShadow: 3,
                borderRadius: 3,
                border: "1px solid #e3f2fd",
                background:
                  "linear-gradient(135deg, #f5faff 60%, #e3f2fd 100%)",
                mb: 4,
              }}
            >
              <CardContent sx={{ p: { xs: 2, sm: 3 } }}>
                <Box
                  sx={{
                    display: "flex",
                    alignItems: "center",
                    gap: 2,
                    flexWrap: "wrap",
                    width: "100%",
                  }}
                >
                  <FolderIcon sx={{ color: "primary.main", fontSize: 28 }} />
                  <Typography
                    variant={isMobile ? "h6" : "h5"}
                    fontWeight={700}
                    color="primary.dark"
                    sx={{ flex: 1 }}
                  >
                    {project.name}
                  </Typography>
                  <Chip
                    label={
                      project.status === "completed" ? "Completed" : "Active"
                    }
                    color={
                      project.status === "completed" ? "success" : "primary"
                    }
                    size="small"
                    sx={{ fontWeight: 600 }}
                  />
                </Box>
              </CardContent>
            </Card>

            <Box sx={{ display: "flex", alignItems: "center", mb: 3 }}>
              <AssignmentIcon sx={{ mr: 1, color: "primary.main" }} />
              <Typography
                variant={isMobile ? "h6" : "h5"}
                fontWeight={600}
                color="primary.main"
              >
                My Tasks
              </Typography>
              <Chip
                label={`${projectTasks.length} tasks`}
                size="small"
                sx={{ ml: 2 }}
                variant="outlined"
              />
            </Box>

            {tasksLoading ? (
              <Card
                sx={{ p: { xs: 2, sm: 4 }, textAlign: "center", boxShadow: 2 }}
              >
                <CircularProgress />
              </Card>
            ) : projectTasks.length === 0 ? (
              <Card
                sx={{
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                  justifyContent: "center",
                  background:
                    "linear-gradient(135deg, #f5faff 60%, #e3f2fd 100%)",
                  borderRadius: 4,
                  boxShadow: 3,
                  p: { xs: 3, sm: 6 },
                  maxWidth: 400,
                  mx: "auto",
                  border: "1px solid #e3f2fd",
                }}
              >
                <AssignmentIcon
                  sx={{
                    fontSize: 60,
                    color: "primary.light",
                    mb: 2,
                    opacity: 0.7,
                  }}
                />
                <Typography
                  variant="h6"
                  color="primary"
                  fontWeight={700}
                  sx={{ mb: 1 }}
                >
                  No tasks assigned
                </Typography>
                <Typography color="text.secondary" sx={{ fontSize: 16 }}>
                  No tasks have been assigned for this project yet.
                </Typography>
              </Card>
            ) : (
              <Stack spacing={isMobile ? 2 : 3}>
                {projectTasks.map((task: Task) => (
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
                    <CardContent sx={{ p: { xs: 2, sm: 3 } }}>
                      <Box
                        sx={{
                          display: "flex",
                          justifyContent: "space-between",
                          alignItems: "flex-start",
                          mb: 2,
                          flexWrap: "wrap",
                          gap: 2,
                        }}
                      >
                        <Box sx={{ flex: 1 }}>
                          <Typography
                            variant={isMobile ? "subtitle1" : "h6"}
                            fontWeight={700}
                            color="primary.dark"
                            gutterBottom
                          >
                            {task.title}
                          </Typography>
                          <Typography
                            variant="body2"
                            color="text.secondary"
                            sx={{ mb: 1, lineHeight: 1.6 }}
                          >
                            {task.description}
                          </Typography>
                        </Box>
                        <Chip
                          label={task.status.replace("-", " ").toUpperCase()}
                          color={getStatusColor(task.status)}
                          size="small"
                          sx={{ fontWeight: 600 }}
                        />
                      </Box>

                      <Box
                        sx={{
                          display: "flex",
                          gap: 3,
                          flexWrap: "wrap",
                          alignItems: "center",
                          mb: 2,
                        }}
                      >
                        <Box sx={{ display: "flex", alignItems: "center" }}>
                          <CalendarTodayIcon
                            sx={{
                              fontSize: 16,
                              mr: 1,
                              color: "text.secondary",
                            }}
                          />
                          <Typography
                            variant="caption"
                            color="text.secondary"
                            sx={{
                              fontWeight: 500,
                              px: 1,
                              py: 0.5,
                              borderRadius: 1,
                              bgcolor: "#f0f0f0",
                              fontSize: { xs: 12, sm: 13 },
                            }}
                          >
                            Created: {formatDate(task.task_date)}
                          </Typography>
                        </Box>
                        <Box sx={{ display: "flex", alignItems: "center" }}>
                          <ScheduleIcon
                            sx={{
                              fontSize: 16,
                              mr: 1,
                              color: isDeadlinePassed(task.deadline)
                                ? "error.main"
                                : "text.secondary",
                            }}
                          />
                          <Typography
                            variant="caption"
                            color={
                              isDeadlinePassed(task.deadline)
                                ? "error.main"
                                : "text.secondary"
                            }
                            sx={{
                              fontWeight: 500,
                              px: 1,
                              py: 0.5,
                              borderRadius: 1,
                              bgcolor: isDeadlinePassed(task.deadline)
                                ? "#ffebee"
                                : "#f0f0f0",
                              fontSize: { xs: 12, sm: 13 },
                            }}
                          >
                            Deadline: {formatDate(task.deadline)}
                            {isDeadlinePassed(task.deadline) &&
                              task.status !== "completed" &&
                              " (Overdue)"}
                          </Typography>
                        </Box>
                      </Box>

                      <Box
                        sx={{
                          display: "flex",
                          gap: 2,
                          alignItems: "center",
                          flexWrap: "wrap",
                        }}
                      >
                        <FormControl size="small" sx={{ minWidth: 160 }}>
                          <InputLabel>Update Status</InputLabel>
                          <Select
                            value={task.status}
                            label="Update Status"
                            onChange={(e) =>
                              handleStatusChange(task.id, e.target.value)
                            }
                            disabled={
                              updatingId === task.id ||
                              task.status === "completed"
                            }
                            sx={{ background: "#fff", borderRadius: 1 }}
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
                          color="success"
                          size="small"
                          startIcon={
                            updatingId === task.id ? (
                              <CircularProgress size={16} color="inherit" />
                            ) : (
                              <CheckCircleIcon />
                            )
                          }
                          onClick={() =>
                            handleStatusChange(task.id, "completed")
                          }
                          disabled={
                            task.status === "completed" ||
                            updatingId === task.id
                          }
                          sx={{
                            textTransform: "none",
                            fontWeight: 600,
                            borderRadius: 2,
                            minWidth: 140,
                          }}
                        >
                          {task.status === "completed"
                            ? "Completed"
                            : "Mark Complete"}
                        </Button>
                      </Box>
                    </CardContent>
                  </Card>
                ))}
              </Stack>
            )}
          </>
        )}
      </Box>
    </Container>
  );
};

export default InternTaskPage;
