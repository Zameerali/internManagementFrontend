import React from "react";
import {
  getAllProjects,
  assignProjectToInterns,
  unassignProjectFromInterns,
  getAssignedInterns,
  updateProjectStatus,
  getProjectHistory,
  addProject,
  logProjectHistory,
} from "../services/projectService";
import { getAllInterns } from "../services/internService";
import {
  Box,
  Container,
  Button,
  Select,
  MenuItem,
  InputLabel,
  FormControl,
  Chip,
  Modal,
  Typography,
  Paper,
} from "@mui/material";
import type { Project } from "../types/project";
import { useSelector, useDispatch } from "react-redux";
import {
  setProjects,
  addProject as addProjectRedux,
} from "../store/projectsSlice";
import type { RootState } from "../store";
import type { Intern } from "../types/intern";

export default function ProjectsPage() {
  const [addOpen, setAddOpen] = React.useState(false);
  const [newProjectName, setNewProjectName] = React.useState("");
  const handleAddProject = async () => {
    if (!newProjectName.trim()) {
      alert("Project name is required");
      return;
    }
    try {
      await addProject(newProjectName);
      setAddOpen(false);
      setNewProjectName("");
      const updatedProjects = await getAllProjects();
      dispatch(setProjects(updatedProjects));
    } catch (e) {
      alert("Failed to add project");
    }
  };
  const dispatch = useDispatch();
  const projects = useSelector((state: RootState) => state.projects.projects);
  const [interns, setInterns] = React.useState<Intern[]>([]);
  const [selectedInterns, setSelectedInterns] = React.useState<{
    [key: number]: number[];
  }>({});
  const [assignedInterns, setAssignedInterns] = React.useState<{
    [key: number]: Intern[];
  }>({});
  const [historyOpen, setHistoryOpen] = React.useState(false);
  const [historyData, setHistoryData] = React.useState<any[]>([]);
  const [historyProjectName, setHistoryProjectName] =
    React.useState<string>("");
  const handleViewHistory = async (project: Project) => {
    const data = await getProjectHistory(project.id);
    const withNames = data.map((item: any) => {
      let internName = "";
      if (item.intern_id) {
        const intern = interns.find((i) => i.id === item.intern_id);
        internName = intern ? intern.name : `ID: ${item.intern_id}`;
      }
      return { ...item, internName };
    });
    setHistoryData(withNames);
    setHistoryProjectName(project.name);
    setHistoryOpen(true);
  };

  React.useEffect(() => {
    const fetchData = async () => {
      const [projectsRes, internsRes] = await Promise.all([
        getAllProjects(),
        getAllInterns(),
      ]);
      dispatch(setProjects(projectsRes));
      setInterns(internsRes);
      const assigned: { [key: number]: Intern[] } = {};
      await Promise.all(
        projectsRes.map(async (project: any) => {
          try {
            const internIds = await getAssignedInterns(project.id);
            const mappedInterns = internsRes.filter((intern: Intern) =>
              internIds.includes(intern.id)
            );
            assigned[project.id] = mappedInterns;
          } catch {
            assigned[project.id] = [];
          }
        })
      );
      setAssignedInterns(assigned);
    };
    fetchData();
  }, []);

  const handleInternsChange = (projectId: number, value: number[]) => {
    setSelectedInterns((prev) => ({
      ...prev,
      [projectId]: value,
    }));
  };

  const handleStatusChange = async (projectId: number, value: string) => {
    const project = projects.find((p) => p.id === projectId);
    if (!project) return;
    if (project.status === "completed" && value === "in_progress") {
      alert("Cannot change status from completed to in_progress");
      return;
    }
    await updateProjectStatus(projectId, value);
    try {
      await logProjectHistory(projectId, {
        action: "status_changed",
        status: value,
      });
    } catch {}
    const updatedProjects = await getAllProjects();
    dispatch(setProjects(updatedProjects));
    if (historyOpen && historyProjectName === project.name) {
      const data = await getProjectHistory(projectId);
      const withNames = data.map((item: any) => {
        let internName = "";
        if (item.intern_id) {
          const intern = interns.find((i) => i.id === item.intern_id);
          internName = intern ? intern.name : `ID: ${item.intern_id}`;
        }
        return { ...item, internName };
      });
      setHistoryData(withNames);
    }
  };

  const handleAssign = async (projectId: number) => {
    await assignProjectToInterns(projectId, selectedInterns[projectId] || []);
    alert("Project assigned successfully!");
  };

  const handleUnassign = async (projectId: number) => {
    const project = projects.find((p) => p.id === projectId);
    if (!project || project.status === "completed") {
      alert("Cannot unassign interns from a completed project.");
      return;
    }
    const internIds = selectedInterns[projectId] || [];
    if (!internIds.length) {
      alert("Select interns to unassign.");
      return;
    }
    await unassignProjectFromInterns(projectId, internIds);
    alert("Interns unassigned successfully!");
    const [projectsRes, internsRes] = await Promise.all([
      getAllProjects(),
      getAllInterns(),
    ]);
    dispatch(setProjects(projectsRes));
    setInterns(internsRes);
    const assigned: { [key: number]: Intern[] } = {};
    await Promise.all(
      projectsRes.map(async (project: any) => {
        try {
          const internIds = await getAssignedInterns(project.id);
          const mappedInterns = internsRes.filter((intern: Intern) =>
            internIds.includes(intern.id)
          );
          assigned[project.id] = mappedInterns;
        } catch (err) {
          assigned[project.id] = [];
        }
      })
    );
    setAssignedInterns(assigned);
    setSelectedInterns((prev) => ({ ...prev, [projectId]: [] }));
  };

  return (
    <Container
      sx={{ padding: "2rem", margin: "0 auto", maxWidth: "900px", mt: 8 }}
    >
      <h1
        className="text-2xl font-bold"
        style={{ textAlign: "center", marginBottom: "16px" }}
      >
        Projects
      </h1>
      <Box sx={{ display: "flex", justifyContent: "center", mb: 3 }}>
        <Button variant="contained" onClick={() => setAddOpen(true)}>
          Add Project
        </Button>
      </Box>
      <Modal open={addOpen} onClose={() => setAddOpen(false)}>
        <Paper
          sx={{
            position: "absolute",
            top: "50%",
            left: "50%",
            transform: "translate(-50%, -50%)",
            width: 350,
            p: 3,
          }}
        >
          <Typography variant="h6" gutterBottom>
            Add New Project
          </Typography>
          <Box sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
            <input
              type="text"
              placeholder="Project Name"
              value={newProjectName}
              onChange={(e) => setNewProjectName(e.target.value)}
              style={{ padding: "8px", fontSize: "16px" }}
            />
            <Button variant="contained" onClick={handleAddProject}>
              Add
            </Button>
            <Button variant="text" onClick={() => setAddOpen(false)}>
              Cancel
            </Button>
          </Box>
        </Paper>
      </Modal>
      {projects.map((project) => {
        const assigned = assignedInterns[project.id] || [];
        const assignedToInProgress = new Set<number>();
        projects.forEach((proj) => {
          if (proj.status !== "completed") {
            (assignedInterns[proj.id] || []).forEach((intern) => {
              assignedToInProgress.add(intern.id);
            });
          }
        });
        const availableInterns = interns.filter(
          (intern) => !assignedToInProgress.has(intern.id)
        );
        const currentStatus = project.status || "in_progress";
        return (
          <Box
            key={project.id}
            sx={{ mb: 4, p: 2, border: "1px solid #ccc", borderRadius: "8px" }}
          >
            <Box
              sx={{
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
              }}
            >
              <h2>{project.name}</h2>
              <Button
                variant="outlined"
                size="small"
                onClick={() => handleViewHistory(project)}
              >
                View History
              </Button>
            </Box>
            <Modal open={historyOpen} onClose={() => setHistoryOpen(false)}>
              <Paper
                sx={{
                  position: "absolute",
                  top: "50%",
                  left: "50%",
                  transform: "translate(-50%, -50%)",
                  width: 420,
                  p: 3,
                }}
              >
                <Typography variant="h6" gutterBottom>
                  History for {historyProjectName}
                </Typography>
                {historyData.length === 0 ? (
                  <Typography>No history found.</Typography>
                ) : (
                  <Box>
                    {historyData.map((item, idx) => {
                      const dateStr = item.timestamp
                        ? new Date(item.timestamp).toLocaleString()
                        : "";
                      let detail = "";
                      if (item.action === "assigned") {
                        detail = `Intern: ${item.internName} assigned`;
                      } else if (item.action === "unassigned") {
                        detail = `Intern: ${item.internName} unassigned`;
                      } else if (
                        item.action === "status_changed" &&
                        item.status
                      ) {
                        detail = `Project status changed to '${
                          item.status === "completed"
                            ? "Completed"
                            : "In Progress"
                        }'`;
                      } else {
                        detail = item.action;
                      }
                      return (
                        <Box key={idx} sx={{ mb: 1 }}>
                          <Typography variant="body2">
                            <strong>{dateStr}</strong>: {detail}
                          </Typography>
                        </Box>
                      );
                    })}
                  </Box>
                )}
                <Button
                  onClick={() => setHistoryOpen(false)}
                  sx={{ mt: 2 }}
                  variant="contained"
                >
                  Close
                </Button>
              </Paper>
            </Modal>
            <div>
              <strong>Already Assigned Interns:</strong>
              {assigned.length === 0 ? (
                <span> None</span>
              ) : (
                <FormControl fullWidth sx={{ mt: 1, mb: 1 }}>
                  <InputLabel id={`assigned-interns-label-${project.id}`}>
                    Select to Unassign
                  </InputLabel>
                  <Select
                    labelId={`assigned-interns-label-${project.id}`}
                    multiple
                    value={selectedInterns[project.id] || []}
                    onChange={(e) =>
                      handleInternsChange(
                        project.id,
                        e.target.value as number[]
                      )
                    }
                    label="Select to Unassign"
                    disabled={currentStatus === "completed"}
                  >
                    {assigned.map((intern) => (
                      <MenuItem key={intern.id} value={intern.id}>
                        {intern.name}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
              )}
            </div>
            <FormControl fullWidth sx={{ mb: 2, mt: 2 }}>
              <InputLabel id={`interns-label-${project.id}`}>
                Select Interns
              </InputLabel>
              <Select
                labelId={`interns-label-${project.id}`}
                multiple
                value={selectedInterns[project.id] || []}
                onChange={(e) =>
                  handleInternsChange(project.id, e.target.value as number[])
                }
                label="Select Interns"
                disabled={currentStatus === "completed"}
              >
                {availableInterns.map((intern) => (
                  <MenuItem key={intern.id} value={intern.id}>
                    {intern.name}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
            <FormControl fullWidth sx={{ mb: 2 }}>
              <InputLabel id={`status-label-${project.id}`}>Status</InputLabel>
              <Select
                labelId={`status-label-${project.id}`}
                value={currentStatus}
                onChange={(e) =>
                  handleStatusChange(project.id, e.target.value as string)
                }
                label="Status"
                disabled={currentStatus === "completed"}
              >
                <MenuItem value="in_progress">In Progress</MenuItem>
                <MenuItem value="completed">Completed</MenuItem>
              </Select>
            </FormControl>
            <Button
              variant="contained"
              sx={{ mr: 2 }}
              onClick={() => handleAssign(project.id)}
              disabled={currentStatus === "completed"}
            >
              Assign
            </Button>
            <Button
              variant="outlined"
              color="error"
              onClick={() => handleUnassign(project.id)}
              disabled={currentStatus === "completed"}
            >
              Unassign
            </Button>
          </Box>
        );
      })}
    </Container>
  );
}
