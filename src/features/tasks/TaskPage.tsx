import { useParams } from "react-router-dom";
import TaskItem from "../../components/TaskItem";
import AddTask from "../../components/AddTask";
import { useGetTasksByInternQuery } from "./tasksApi";
import { useGetAllProjectsQuery } from "../../features/projects/projectsApi";
import { useGetAllAssignedInternsQuery } from "../../features/projects/projectsApi";
import {
  Container,
  Box,
  Typography,
  Card,
  CardContent,
  Grid,
  Divider,
  useTheme,
  CircularProgress,
} from "@mui/material";
import AssignmentTurnedInIcon from "@mui/icons-material/AssignmentTurnedIn";
export default function TasksPage() {
  const theme = useTheme();
  const { id } = useParams();
  const internId = parseInt(id || "", 10);
  if (!internId || isNaN(internId)) {
    return (
      <Container maxWidth="md" sx={{ mt: 6 }}>
        <Card sx={{ p: 3, background: theme.palette.error.light }}>
          <Typography variant="h5" color="error" fontWeight={700}>
            Invalid intern ID.
          </Typography>
        </Card>
      </Container>
    );
  }

  const {
    data: tasks = [],
    isLoading: isTasksLoading,
    refetch,
  } = useGetTasksByInternQuery({ internId }, { skip: !internId });

  const { data: assignedMap, isLoading: isAssignedLoading } =
    useGetAllAssignedInternsQuery();
  const { data: projects, isLoading: isProjectsLoading } =
    useGetAllProjectsQuery();

  // Show loader until all data is loaded
  const loading =
    isTasksLoading ||
    isAssignedLoading ||
    isProjectsLoading ||
    !assignedMap ||
    !projects;
  if (loading) {
    return (
      <Container
        maxWidth="md"
        sx={{
          mt: 10,
          mb: 10,
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          minHeight: 400,
        }}
      >
        <CircularProgress color="primary" size={60} />
      </Container>
    );
  }

  const projectId = Object.keys(assignedMap).find((pid) =>
    assignedMap[Number(pid)].includes(internId)
  );
  const numericProjectId = projectId ? Number(projectId) : null;
  const project = numericProjectId
    ? projects.find((p: any) => p.id === numericProjectId)
    : null;
  const projectName = project ? project.name : "";

  const currentTasks = tasks.filter(
    (task) => task.project_id === numericProjectId
  );
  const previousTasksByProject: { [key: number]: typeof tasks } = {};
  tasks.forEach((task) => {
    if (task.project_id !== numericProjectId) {
      if (!previousTasksByProject[task.project_id])
        previousTasksByProject[task.project_id] = [];
      previousTasksByProject[task.project_id].push(task);
    }
  });

  return (
    <Container maxWidth="md" sx={{ mt: 6, mb: 6 }}>
      <Card
        sx={{
          p: { xs: 2, sm: 4 },
          mb: 4,
          background: "#f5faff",
          borderRadius: 3,
        }}
      >
        <Typography variant="h4" fontWeight={700} mb={2} color="primary.main">
          Tasks for Intern #{internId}
        </Typography>
        {projectName ? (
          <>
            <Typography
              variant="h6"
              fontWeight={600}
              color="primary.dark"
              mb={2}
            >
              Assigned Project: <b>{projectName}</b>
            </Typography>
            <Divider sx={{ mb: 2 }} />
            <Typography variant="subtitle1" fontWeight={600} mb={1}>
              Current Project Tasks
            </Typography>
            {currentTasks.length === 0 ? (
              <Typography color="text.secondary">No tasks assigned.</Typography>
            ) : (
              <Grid container spacing={2}>
                {currentTasks.map((task) => (
                  <Grid key={task.id}>
                    <Card variant="outlined" sx={{ mb: 2, borderRadius: 2 }}>
                      <CardContent>
                        <TaskItem task={task} onStatusChange={refetch} />
                      </CardContent>
                    </Card>
                  </Grid>
                ))}
              </Grid>
            )}
            {numericProjectId && internId > 0 && !isNaN(internId) && (
              <Box mt={2}>
                <AddTask internId={internId} projectId={numericProjectId} />
              </Box>
            )}
          </>
        ) : (
          <Box sx={{ textAlign: "center", py: 6 }}>
            <AssignmentTurnedInIcon
              sx={{ fontSize: 64, color: "primary.light", mb: 2 }}
            />
            <Typography
              variant="h6"
              fontWeight={600}
              color="primary.main"
              mb={1}
            >
              No project assigned yet
            </Typography>
            <Typography color="text.secondary" mb={2}>
              Tasks will appear here once you are assigned to a project.
              <br />
              Stay tuned for your next assignment!
            </Typography>
          </Box>
        )}
      </Card>
      {Object.keys(previousTasksByProject).length > 0 && (
        <Card
          sx={{ p: { xs: 2, sm: 4 }, background: "#f9f9f9", borderRadius: 3 }}
        >
          <Typography variant="h5" fontWeight={700} mb={2} color="primary.main">
            Previous Project Tasks
          </Typography>
          <Divider sx={{ mb: 2 }} />
          {Object.entries(previousTasksByProject).map(([pid, ptasks]) => {
            const prevProject = projects.find((p: any) => p.id === Number(pid));
            return (
              <Box key={pid} mb={3}>
                <Typography fontWeight={600} color="text.secondary" mb={1}>
                  Project: <b>{prevProject ? prevProject.name : `ID ${pid}`}</b>
                </Typography>
                <Grid container spacing={2}>
                  {ptasks.map((task) => (
                    <Grid key={task.id}>
                      <Card variant="outlined" sx={{ mb: 2, borderRadius: 2 }}>
                        <CardContent>
                          <TaskItem task={task} onStatusChange={refetch} />
                        </CardContent>
                      </Card>
                    </Grid>
                  ))}
                </Grid>
              </Box>
            );
          })}
        </Card>
      )}
    </Container>
  );
}
