import React from "react";
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
  Divider,
  Avatar,
  useTheme,
  useMediaQuery,
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
import { CircularProgress } from "@mui/material";
const TasksListPage = () => {
  const dispatch = useDispatch();
  const [updateProjectStatus] = useUpdateProjectStatusMutation();
  const [unassignProjectFromInterns] = useUnassignProjectFromInternsMutation();
  const [logProjectHistory] = useLogProjectHistoryMutation();

  const { data: assignedIdsByProject = {} } = useGetAllAssignedInternsQuery();
  const { data: tasks = [], isLoading } = useGetAllTasksWithInternsQuery();
  const { data: projects = [] } = useGetAllProjectsQuery();
  const { data: interns = [] } = useGetAllInternsQuery();

  const tasksByProject: { [key: number]: typeof tasks } = {};
  tasks.forEach((task) => {
    if (!tasksByProject[task.project_id]) tasksByProject[task.project_id] = [];
    tasksByProject[task.project_id].push(task);
  });
  const isProjectCompleted = (projectTasks: typeof tasks) =>
    projectTasks.length > 0 &&
    projectTasks.every((t) => t.status === "completed");
  const sortedProjects = [...projects].sort((a: any, b: any) => {
    const aCount = (tasksByProject[a.id] || []).length;
    const bCount = (tasksByProject[b.id] || []).length;
    return bCount - aCount;
  });

  React.useEffect(() => {
    sortedProjects.forEach(async (project: any) => {
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
        // Unassign all interns from this project
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
  return (
    <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
      <Typography
        variant="h4"
        fontWeight={700}
        color="primary"
        align="center"
        gutterBottom
      >
        Tasks & Assignments
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
              p: { xs: 4, sm: 6 },
              maxWidth: 400,
              mx: "auto",
              border: "1px solid #e3f2fd",
            }}
          >
            <Box
              sx={{
                width: 120,
                height: 120,
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
            <Typography color="text.secondary" sx={{ fontSize: 18 }}>
              Get started by assigning your first task to interns!
            </Typography>
          </Card>
        ) : (
          <Stack spacing={4}>
            {sortedProjects.map((project: any) => {
              const projectTasks = tasksByProject[project.id] || [];
              const completed = isProjectCompleted(projectTasks);
              const assignedInternIds = assignedIdsByProject[project.id] || [];
              const internTasksMap: { [key: number]: typeof projectTasks } = {};
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
                  }}
                >
                  <CardHeader
                    title={
                      <Box
                        sx={{ display: "flex", alignItems: "center", gap: 2 }}
                      >
                        <Typography
                          variant="h6"
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
                          minWidth: isMobile ? 120 : 180,
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
                            .filter((intern) =>
                              assignedInternIds.includes(intern.id)
                            )
                            .map((intern) => (
                              <MenuItem key={intern.id} value={intern.id}>
                                {intern.name}
                              </MenuItem>
                            ))}
                        </Select>
                      </FormControl>
                    }
                    sx={{ pb: 0, pt: 2, px: { xs: 2, sm: 3 } }}
                  />
                  <CardContent sx={{ pt: 1, pb: 2, px: { xs: 2, sm: 3 } }}>
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
                      <Stack spacing={3}>
                        {assignedInternIds.map((internId: number) => {
                          const intern = interns.find(
                            (i: any) => i.id === internId
                          );
                          const internTasks = internTasksMap[internId] || [];
                          const canUnassign =
                            internTasks.length === 0 ||
                            internTasks.every((t) => t.status === "completed");
                          return (
                            <Card
                              key={internId}
                              sx={{
                                boxShadow: 1,
                                borderRadius: 2,
                                border: "1px solid #e3f2fd",
                                background: "#fff",
                                p: { xs: 1.5, sm: 2 },
                                mb: 1,
                              }}
                            >
                              <Box
                                sx={{
                                  display: "flex",
                                  alignItems: "center",
                                  justifyContent: "space-between",
                                  mb: 1,
                                }}
                              >
                                <Box
                                  sx={{
                                    display: "flex",
                                    alignItems: "center",
                                    gap: 1,
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
                                  >
                                    {intern
                                      ? intern.name
                                      : `Intern ID ${internId}`}
                                  </Typography>
                                </Box>
                                <Button
                                  variant="contained"
                                  color="error"
                                  size="small"
                                  disabled={!canUnassign}
                                  sx={{
                                    ml: 2,
                                    fontWeight: 500,
                                    borderRadius: 2,
                                    textTransform: "none",
                                    minWidth: 90,
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
                              {internTasks.length === 0 ? (
                                <Typography
                                  color="text.secondary"
                                  sx={{ mb: 2 }}
                                >
                                  No tasks assigned to this intern.
                                </Typography>
                              ) : (
                                <Stack spacing={2}>
                                  {internTasks.map((task) => (
                                    <Card
                                      key={task.id}
                                      sx={{
                                        boxShadow: 0,
                                        borderRadius: 2,
                                        border: "1px solid #e3f2fd",
                                        background:
                                          "linear-gradient(135deg, #f5faff 60%, #e3f2fd 100%)",
                                        p: { xs: 1.5, sm: 2 },
                                      }}
                                    >
                                      <Typography
                                        variant="subtitle1"
                                        fontWeight={700}
                                        color="primary.dark"
                                        gutterBottom
                                        sx={{ fontSize: { xs: 17, sm: 19 } }}
                                      >
                                        {task.title}
                                      </Typography>
                                      <Typography
                                        variant="body2"
                                        color="text.secondary"
                                        sx={{
                                          mb: 0.5,
                                          fontSize: { xs: 14, sm: 15 },
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
                                            px: 1.2,
                                            py: 0.5,
                                            borderRadius: 1,
                                            bgcolor: "#f0f0f0",
                                            fontSize: 13,
                                          }}
                                        >
                                          Date: {task.task_date.split("T")[0]}
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
