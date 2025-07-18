import React from "react";
import {
  Container,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Typography,
} from "@mui/material";
import { Box } from "@mui/system";
import { useGetAllTasksWithInternsQuery } from "./tasksApi";
import {
  useGetAllProjectsQuery,
  useGetAllAssignedInternsQuery,
  useUnassignProjectFromInternsMutation,
  useUpdateProjectStatusMutation,
  useLogProjectHistoryMutation,
} from "../projects/projectsApi";
import { useGetAllInternsQuery } from "../interns/internsApi";
const TasksListPage = () => {
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
  return (
    <Container
      sx={{
        mt: 4,
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        padding: "2rem",
        margin: "0 auto",
        backgroundColor: "#f9f9f9",
        width: "100vw",
        maxWidth: "1600px",
        borderRadius: "8px",
      }}
    >
      <Box
        sx={{
          mt: 0,
          width: "100%",
          display: "flex",
          flexDirection: "column",
          gap: "2rem",
          padding: "1rem",
          backgroundColor: "#fff",
          borderRadius: "8px",
          boxShadow: "0 2px 4px rgba(0,0,0,0.1)",
          border: "1px solid #eee",
          overflowY: "auto",
        }}
      >
        {isLoading ? (
          <Box sx={{ textAlign: "center", py: 4 }}>Loading tasks...</Box>
        ) : tasks.length === 0 ? (
          <Box
            display="flex"
            flexDirection="column"
            alignItems="center"
            justifyContent="center"
            mt={8}
            sx={{
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
            <span
              style={{
                fontSize: 22,
                color: "#1976d2",
                fontWeight: 700,
                marginBottom: 8,
                letterSpacing: 0.5,
              }}
            >
              No tasks found
            </span>
            <span style={{ color: "#888", fontSize: 18, marginBottom: 2 }}>
              Get started by assigning your first task to interns!
            </span>
          </Box>
        ) : (
          sortedProjects.map((project: any) => {
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
              <Box key={project.id} sx={{ mb: 4 }}>
                {/* ...existing code for project/intern/task rendering... */}
                <Box
                  sx={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "space-between",
                    fontWeight: 700,
                    fontSize: "1.2rem",
                    mb: 2,
                    color: completed ? "#388e3c" : "#1976d2",
                  }}
                >
                  <span>
                    Project: {project.name}
                    {completed && (
                      <span
                        style={{
                          marginLeft: 12,
                          color: "#388e3c",
                          fontWeight: 600,
                        }}
                      >
                        (Completed)
                      </span>
                    )}
                  </span>
                  <Box sx={{ minWidth: 180 }}>
                    <FormControl fullWidth size="small">
                      <InputLabel id={`assigned-interns-label-${project.id}`}>
                        Assigned Interns
                      </InputLabel>
                      <Select
                        labelId={`assigned-interns-label-${project.id}`}
                        label="Assigned Interns"
                        defaultValue=""
                        onChange={async (e) => {
                          const internId = Number(e.target.value);
                          if (!internId) return;
                          alert(
                            `Unassign intern ID ${internId} from project '${project.name}'`
                          );
                        }}
                        displayEmpty
                        sx={{ background: "#fff" }}
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
                  </Box>
                </Box>
                {project.status === "completed" && (
                  <Box sx={{ color: "#388e3c", mb: 2, fontWeight: 600 }}>
                    This project is completed.
                  </Box>
                )}
                {assignedInternIds.length === 0 ? (
                  project.status !== "completed" ? (
                    <Box sx={{ color: "#888", mb: 2 }}>No tasks assigned.</Box>
                  ) : null
                ) : (
                  assignedInternIds.map((internId: number) => {
                    const intern = interns.find((i: any) => i.id === internId);
                    const internTasks = internTasksMap[internId] || [];
                    const canUnassign =
                      internTasks.length === 0 ||
                      internTasks.every((t) => t.status === "completed");
                    return (
                      <Box key={internId} sx={{ mb: 3 }}>
                        <Box
                          sx={{
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "space-between",
                            fontWeight: 600,
                            mb: 1,
                            color: "#1976d2",
                          }}
                        >
                          <span>
                            {intern ? intern.name : `Intern ID ${internId}`}
                          </span>
                          <span>
                            <button
                              style={{
                                marginLeft: 12,
                                padding: "4px 10px",
                                borderRadius: "4px",
                                border: "none",
                                background: canUnassign ? "#d32f2f" : "#ccc",
                                color: "#fff",
                                fontWeight: 500,
                                cursor: canUnassign ? "pointer" : "not-allowed",
                              }}
                              disabled={!canUnassign}
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
                                  alert(
                                    `Intern '${
                                      intern ? intern.name : internId
                                    }' unassigned from project '${
                                      project.name
                                    }'.`
                                  );
                                } catch (err) {
                                  alert(
                                    "Failed to unassign intern. Please try again."
                                  );
                                }
                              }}
                            >
                              Unassign
                            </button>
                          </span>
                        </Box>
                        {internTasks.length === 0 ? (
                          <Box sx={{ color: "#888", mb: 2 }}>
                            No tasks assigned to this intern.
                          </Box>
                        ) : (
                          internTasks.map((task) => (
                            <Box
                              key={task.id}
                              sx={{
                                mb: 2,
                                p: 2.5,
                                background:
                                  "linear-gradient(135deg, #f5faff 60%, #e3f2fd 100%)",
                                borderRadius: 3,
                                boxShadow: 2,
                                display: "flex",
                                flexDirection: "column",
                                gap: 1,
                                border: "1px solid #e3f2fd",
                                transition: "box-shadow 0.2s",
                                ":hover": { boxShadow: 6 },
                                borderBottom: "none",
                                "&:last-child": {
                                  mb: 0,
                                },
                              }}
                            >
                              <Typography
                                variant="subtitle1"
                                fontWeight={700}
                                color="primary.dark"
                                gutterBottom
                              >
                                {task.title}
                              </Typography>
                              <Typography
                                variant="body2"
                                color="text.secondary"
                                sx={{ mb: 0.5 }}
                              >
                                {task.description}
                              </Typography>
                              <Box
                                sx={{
                                  display: "flex",
                                  gap: 2,
                                  flexWrap: "wrap",
                                  mt: 0.5,
                                }}
                              >
                                <Typography
                                  variant="caption"
                                  color="primary"
                                  sx={{
                                    fontWeight: 600,
                                    bgcolor: "#e3f2fd",
                                    px: 1.2,
                                    py: 0.5,
                                    borderRadius: 1,
                                  }}
                                >
                                  Status: {task.status}
                                </Typography>
                                <Typography
                                  variant="caption"
                                  color="text.secondary"
                                  sx={{
                                    fontWeight: 500,
                                    px: 1.2,
                                    py: 0.5,
                                    borderRadius: 1,
                                    bgcolor: "#f0f0f0",
                                  }}
                                >
                                  Date: {task.task_date.split("T")[0]}
                                </Typography>
                              </Box>
                            </Box>
                          ))
                        )}
                      </Box>
                    );
                  })
                )}
              </Box>
            );
          })
        )}
      </Box>
    </Container>
  );
};

export default TasksListPage;
