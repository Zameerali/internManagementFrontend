import React, { useState } from "react";
import {
  Container,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Typography,
  Card,
  CardContent,
  CardHeader,
  Chip,
  Box,
  Button,
  Stack,
  Avatar,
  useTheme,
  useMediaQuery,
  CircularProgress,
} from "@mui/material";
import { useGetAllTasksWithInternsQuery } from "./tasksApi";
import {
  useGetAllProjectsQuery,
  useGetAllAssignedInternsQuery,
  useUnassignProjectFromInternsMutation,
  useUpdateProjectStatusMutation,
  useLogProjectHistoryMutation,
} from "../projects/projectsApi";
import { useGetAllInternsQuery } from "../interns/internsApi";
import { showSnackbar } from "../auth/authSlice";
import { useDispatch } from "react-redux";
import type { Task } from "./type";

interface Project {
  id: number;
  name: string;
  status: string;
}

interface Intern {
  id: number;
  name: string;
}

const TasksListPage = () => {
  const dispatch = useDispatch();
  const [updateProjectStatus] = useUpdateProjectStatusMutation();
  const [unassignProjectFromInterns] = useUnassignProjectFromInternsMutation();
  const [logProjectHistory] = useLogProjectHistoryMutation();

  const { data: assignedIdsByProject = {} } = useGetAllAssignedInternsQuery();
  const { data: tasks = [], isLoading } = useGetAllTasksWithInternsQuery();
  const { data: projects = [] } = useGetAllProjectsQuery();
  const { data: interns = [] } = useGetAllInternsQuery();

  const [internDeadlineFilters, setInternDeadlineFilters] = useState<{
    [key: number]: string;
  }>({});

  const tasksByProject: { [key: number]: Task[] } = {};
  tasks.forEach((task: Task) => {
    if (!tasksByProject[task.project_id]) tasksByProject[task.project_id] = [];
    tasksByProject[task.project_id].push(task);
  });

  const isProjectCompleted = (projectTasks: Task[]) =>
    projectTasks.length > 0 &&
    projectTasks.every((t) => t.status === "completed");

  const sortedProjects = [...projects].sort((a: Project, b: Project) => {
    const aCount = (tasksByProject[a.id] || []).length;
    const bCount = (tasksByProject[b.id] || []).length;
    return bCount - aCount;
  });

  React.useEffect(() => {
    sortedProjects.forEach(async (project: Project) => {
      const projectTasks = tasksByProject[project.id] || [];
      const completed = isProjectCompleted(projectTasks);
      if (completed && project.status !== "completed") {
        await updateProjectStatus({
          projectId: project.id,
          status: "completed",
        });
        await logProjectHistory({
          projectId: project.id,
          payload: {
            action: `Project marked as completed`,
            status: "completed",
          },
        });
        const assignedInternIds = assignedIdsByProject[project.id] || [];
        if (assignedInternIds.length > 0) {
          await unassignProjectFromInterns({
            projectId: project.id,
            internIds: assignedInternIds,
          }).unwrap();
          dispatch(
            showSnackbar({
              message: `All interns unassigned from project '${project.name}' due to completion`,
              severity: "info",
            })
          );
          await logProjectHistory({
            projectId: project.id,
            payload: {
              action: `All interns unassigned from project '${project.name}' due to completion`,
            },
          });
        }
      }
    });
  }, [
    sortedProjects,
    tasksByProject,
    updateProjectStatus,
    logProjectHistory,
    unassignProjectFromInterns,
    assignedIdsByProject,
  ]);

  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));

  const filterTasksByDeadline = (tasks: Task[], status: string) => {
    const now = new Date();
    if (status === "passed") {
      return tasks.filter(
        (task) => task.deadline && new Date(task.deadline) < now
      );
    } else if (status === "upcoming") {
      return tasks.filter(
        (task) => task.deadline && new Date(task.deadline) >= now
      );
    }
    return tasks;
  };

  return (
    <Container
      // maxWidth="xl"
      sx={{
        maxWidth: { xs: "100%", sm: "95%", md: "90%", lg: "1200px" },
        mt: { xs: 2, md: 4 },
        mb: { xs: 2, md: 4 },
        px: { xs: 0.5, sm: 2 },
        mx: { xs: "auto"}
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
        Tasks & Assignments
      </Typography>
      <Box sx={{ width: "100%", mt: { xs: 1, md: 3 } }}>
        {isLoading ? (
          <Card sx={{ p: { xs: 2, sm: 4 }, textAlign: "center", boxShadow: 2 }}>
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
              p: { xs: 3, sm: 6 },
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
              Get started by assigning your first task to interns!
            </Typography>
          </Card>
        ) : (
          <Stack spacing={isMobile ? 2 : 4}>
            {sortedProjects.map((project: Project) => {
              const projectTasks = tasksByProject[project.id] || [];
              const completed = isProjectCompleted(projectTasks);
              const assignedInternIds = assignedIdsByProject[project.id] || [];
              const internTasksMap: { [key: number]: Task[] } = {};
              assignedInternIds.forEach((internId: number) => {
                internTasksMap[internId] = projectTasks.filter(
                  (t) => t.intern_id === internId
                );
              });
              return (
                <Card
                  key={project.id}
                  sx={{
                    boxShadow: 3,
                    borderRadius: 3,
                    border: "1px solid #e3f2fd",
                    background:
                      "linear-gradient(135deg, #f5faff 60%, #e3f2fd 100%)",
                    width: "110%",
                    
                  }}
                >
                  <CardHeader
                    title={
                      <Box
                        sx={{
                          display: "flex",
                          alignItems: "center",
                          gap: 2,
                          flexWrap: "wrap",
                          width: "100%",
                        }}
                      >
                        <Typography
                          variant={isMobile ? "subtitle1" : "h6"}
                          fontWeight={700}
                          color={completed ? "success.main" : "primary.main"}
                        >
                          Project: {project.name}
                        </Typography>
                        {completed && (
                          <Chip
                            label="Completed"
                            color="success"
                            size="small"
                          />
                        )}
                      </Box>
                    }
                    action={
                      <FormControl
                        size="small"
                        sx={{
                          minWidth: isMobile ? 100 : 180,
                          background: "#fff",
                          borderRadius: 1,
                        }}
                      >
                        <InputLabel id={`assigned-interns-label-${project.id}`}>
                          Assigned Interns
                        </InputLabel>
                        <Select
                          labelId={`assigned-interns-label-${project.id}`}
                          label="Assigned Interns"
                          defaultValue=""
                        >
                          <MenuItem value="" disabled>
                            Assigned Interns
                          </MenuItem>
                          {interns
                            .filter((intern: Intern) =>
                              assignedInternIds.includes(intern.id)
                            )
                            .map((intern: Intern) => (
                              <MenuItem key={intern.id} value={intern.id}>
                                {intern.name}
                              </MenuItem>
                            ))}
                        </Select>
                      </FormControl>
                    }
                    sx={{ pb: 0, pt: 2, px: { xs: 1, sm: 3 } }}
                  />
                  <CardContent sx={{ pt: 1, pb: 2, px: { xs: 1, sm: 3 } }}>
                    {project.status === "completed" && (
                      <Typography
                        color="success.main"
                        fontWeight={600}
                        sx={{ mb: 2 }}
                      >
                        This project is completed.
                      </Typography>
                    )}
                    {assignedInternIds.length === 0 ? (
                      project.status !== "completed" ? (
                        <Typography color="text.secondary" sx={{ mb: 2 }}>
                          No tasks assigned.
                        </Typography>
                      ) : null
                    ) : (
                      <Stack spacing={isMobile ? 1.5 : 3}>
                        {assignedInternIds.map((internId: number) => {
                          const intern = interns.find(
                            (i: Intern) => i.id === internId
                          );
                          const internTasks = internTasksMap[internId] || [];
                          const canUnassign =
                            internTasks.length === 0 ||
                            internTasks.every((t) => t.status === "completed");
                          const filteredTasks = filterTasksByDeadline(
                            internTasks,
                            internDeadlineFilters[internId] || "all"
                          );
                          return (
                            <Card
                              key={internId}
                              sx={{
                                boxShadow: 1,
                                borderRadius: 2,
                                border: "1px solid #e3f2fd",
                                background: "#fff",
                                // p: { xs: 1, sm: 2 },
                                width: "100%",
                                
                              }}
                            >
                              <Box
                                sx={{
                                  display: "flex",
                                  alignItems: "center",
                                  justifyContent: "space-between",
                                  flexWrap: "wrap",
                                  mb: 1,
                                  mt: 2,
                                  mx: 2,
                                }}
                              >
                                <Box
                                  sx={{
                                    display: "flex",
                                    alignItems: "center",
                                    gap: 1,
                                    flexWrap: "wrap",
                                  }}
                                >
                                  <Avatar
                                    sx={{
                                      width: 32,
                                      height: 32,
                                      bgcolor: "primary.light",
                                      fontWeight: 700,
                                    }}
                                  >
                                    {intern && intern.name
                                      ? intern.name[0]
                                      : "?"}
                                  </Avatar>
                                  <Typography
                                    fontWeight={600}
                                    color="primary.main"
                                    sx={{ fontSize: { xs: 15, sm: 17 } }}
                                  >
                                    {intern
                                      ? intern.name
                                      : `Intern ID ${internId}`}
                                  </Typography>
                                </Box>
                                <Box
                                  sx={{
                                    display: "flex",
                                    alignItems: "center",
                                    gap: 2,
                                    flexWrap: "wrap",
                                  }}
                                >
                                  <FormControl
                                    size="small"
                                    sx={{
                                      minWidth: isMobile ? 90 : 150,
                                      background: "#fff",
                                      borderRadius: 1,
                                    }}
                                  >
                                    <InputLabel
                                      id={`deadline-filter-label-${internId}`}
                                    >
                                      Deadline Filter
                                    </InputLabel>
                                    <Select
                                      labelId={`deadline-filter-label-${internId}`}
                                      label="Deadline Filter"
                                      value={
                                        internDeadlineFilters[internId] || "all"
                                      }
                                      onChange={(e) =>
                                        setInternDeadlineFilters({
                                          ...internDeadlineFilters,
                                          [internId]: e.target.value,
                                        })
                                      }
                                    >
                                      <MenuItem value="all">All</MenuItem>
                                      <MenuItem value="passed">Passed</MenuItem>
                                      <MenuItem value="upcoming">
                                        Upcoming
                                      </MenuItem>
                                    </Select>
                                  </FormControl>
                                  <Button
                                    variant="contained"
                                    color="error"
                                    size="small"
                                    disabled={!canUnassign}
                                    sx={{
                                      fontWeight: 500,
                                      borderRadius: 2,
                                      textTransform: "none",
                                      minWidth: 80,
                                    }}
                                    onClick={async () => {
                                      if (!canUnassign) {
                                        alert(
                                          "Cannot unassign: This intern has in-progress tasks in this project."
                                        );
                                        return;
                                      }
                                      try {
                                        await unassignProjectFromInterns({
                                          projectId: project.id,
                                          internIds: [internId],
                                        }).unwrap();
                                        dispatch(
                                          showSnackbar({
                                            message: `Intern '${
                                              intern ? intern.name : internId
                                            }' unassigned from project '${
                                              project.name
                                            }'`,
                                            severity: "success",
                                          })
                                        );
                                        await logProjectHistory({
                                          projectId: project.id,
                                          payload: {
                                            action: `Intern '${
                                              intern ? intern.name : internId
                                            }' unassigned from project '${
                                              project.name
                                            }'`,
                                          },
                                        });
                                      } catch (err) {
                                        dispatch(
                                          showSnackbar({
                                            message:
                                              "Failed to unassign intern. Please try again.",
                                            severity: "error",
                                          })
                                        );
                                      }
                                    }}
                                  >
                                    Unassign
                                  </Button>
                                </Box>
                              </Box>
                              {filteredTasks.length === 0 ? (
                                <Typography
                                  color="text.secondary"
                                  sx={{ mb: 2, fontSize: { xs: 14, sm: 16 } }}
                                >
                                  No tasks match the selected deadline filter.
                                </Typography>
                              ) : (
                                <Stack spacing={isMobile ? 1 : 2}>
                                  {filteredTasks.map((task: Task) => (
                                    <Card
                                      key={task.id}
                                      sx={{
                                        boxShadow: 0,
                                        borderRadius: 2,
                                        border: "1px solid #e3f2fd",
                                        background:
                                          "linear-gradient(135deg, #f5faff 60%, #e3f2fd 100%)",
                                        p: { xs: 1, sm: 2 },
                                        mx: -2,
                                        width: "100%",
                                      }}
                                    >
                                      <Typography
                                        variant="subtitle1"
                                        fontWeight={700}
                                        color="primary.dark"
                                        gutterBottom
                                        sx={{ fontSize: { xs: 15, sm: 17 } }}
                                      >
                                        {task.title}
                                      </Typography>
                                      <Typography
                                        variant="body2"
                                        color="text.secondary"
                                        sx={{
                                          mb: 0.5,
                                          fontSize: { xs: 13, sm: 15 },
                                        }}
                                      >
                                        {task.description}
                                      </Typography>
                                      <Box
                                        sx={{
                                          display: "flex",
                                          gap: 2,
                                          flexWrap: "wrap",
                                          mt: 0.5,
                                          alignItems: "center",
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
                                          sx={{
                                            fontWeight: 600,
                                            mr: 1,
                                            mb: 0.5,
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
                                          Date: {task.task_date?.split("T")[0]}
                                        </Typography>
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
                                          Deadline:{" "}
                                          {task.deadline
                                            ? task.deadline.split("T")[0]
                                            : "N/A"}
                                        </Typography>
                                      </Box>
                                    </Card>
                                  ))}
                                </Stack>
                              )}
                            </Card>
                          );
                        })}
                      </Stack>
                    )}
                  </CardContent>
                </Card>
              );
            })}
          </Stack>
        )}
      </Box>
    </Container>
  );
};

export default TasksListPage;
