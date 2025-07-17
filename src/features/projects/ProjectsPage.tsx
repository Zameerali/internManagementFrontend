import React from "react";
// import {
//   getAllProjects,
//   assignProjectToInterns,
//   unassignProjectFromInterns,
//   getAssignedInterns,
//   updateProjectStatus,
//   getProjectHistory,
//   addProject,
//   logProjectHistory,
// } from "../../services/projectService";
import { skipToken } from "@reduxjs/toolkit/query";
import { ProjectCard } from "./ProjectCard";

import {
  useGetAllProjectsQuery,
  useAddProjectMutation,
  useAssignProjectToInternsMutation,
  useUnassignProjectFromInternsMutation,
  useGetAssignedInternsQuery,
  useUpdateProjectStatusMutation,
  useLogProjectHistoryMutation,
  useGetProjectHistoryQuery,
  useGetAllAssignedInternsQuery,
} from "./projectsApi";
import { useGetAllInternsQuery } from "../../features/interns/internsApi";
// import { getAllInterns } from "../../services/internService";
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
import type { Project, ProjectHistoryItem } from "./type";

import { useSelector, useDispatch } from "react-redux";
// import {
//   setProjects,
//   addProject as addProjectRedux,
// } from "../../store/projectsSlice";
// import type { RootState } from "../../store";
import type { Intern } from "../../types/intern";

export default function ProjectsPage() {
  const [addOpen, setAddOpen] = React.useState(false);

  const { data: projects = [], isLoading: projectsLoading } =
    useGetAllProjectsQuery();
  const { data: interns = [], isLoading: internsLoading } =
    useGetAllInternsQuery();
  const [addProject] = useAddProjectMutation();
  const [assignProjectToInterns] = useAssignProjectToInternsMutation();
  const [unassignProjectFromInterns] = useUnassignProjectFromInternsMutation();
  const [updateProjectStatus] = useUpdateProjectStatusMutation();
  const [logProjectHistory] = useLogProjectHistoryMutation();
  // const [getProjectHistory] = useGetProjectHistoryQuery();

  const [newProjectName, setNewProjectName] = React.useState("");

  const handleAddProject = async () => {
    if (!newProjectName.trim()) {
      alert("Project name is required");
      return;
    }
    try {
      await addProject({ name: newProjectName }).unwrap();
      setAddOpen(false);
      setNewProjectName("");
    } catch (e) {
      alert("Failed to add project");
    }
  };
  // const handleAddProject = async () => {
  //   if (!newProjectName.trim()) {
  //     alert("Project name is required");
  //     return;
  //   }
  //   try {
  //     await addProject(newProjectName);
  //     setAddOpen(false);
  //     setNewProjectName("");
  //     const updatedProjects = await getAllProjects();
  //     dispatch(setProjects(updatedProjects));
  //   } catch (e) {
  //     alert("Failed to add project");
  //   }
  // };
  // const dispatch = useDispatch();
  // const projects = useSelector((state: RootState) => state.projects.projects);
  // const [interns, setInterns] = React.useState<Intern[]>([]);
  const [selectedInterns, setSelectedInterns] = React.useState<{
    [key: number]: number[];
  }>({});

  // const [assignedInterns, setAssignedInterns] = React.useState<{
  //   [key: number]: Intern[];
  // }>({});
  const [historyOpen, setHistoryOpen] = React.useState(false);
  const [selectedProjectId, setSelectedProjectId] = React.useState<
    number | typeof skipToken
  >(skipToken);

  // const [historyData, setHistoryData] = React.useState<any[]>([]);
  const { data: historyData = [], isLoading: historyLoading } =
    useGetProjectHistoryQuery(selectedProjectId);

  const [historyProjectName, setHistoryProjectName] =
    React.useState<string>("");
  const handleViewHistory = (project: Project) => {
    setSelectedProjectId(project.id);
    setHistoryProjectName(project.name);
    setHistoryOpen(true);
  };
  const handleCloseHistory = () => {
    setHistoryOpen(false);
    setSelectedProjectId(skipToken);
  };

  // const handleViewHistory = async (project: Project) => {
  //   const data = await getProjectHistory(project.id);
  //   const withNames = data.map((item: any) => {
  //     let internName = "";
  //     if (item.intern_id) {
  //       const intern = interns.find((i) => i.id === item.intern_id);
  //       internName = intern ? intern.name : `ID: ${item.intern_id}`;
  //     }
  //     return { ...item, internName };
  //   });
  //   setHistoryData(withNames);
  //   setHistoryProjectName(project.name);
  //   setHistoryOpen(true);
  // };

  // React.useEffect(() => {
  //   const fetchData = async () => {
  //     const [projectsRes, internsRes] = await Promise.all([
  //       getAllProjects(),
  //       getAllInterns(),
  //     ]);
  //     dispatch(setProjects(projectsRes));
  //     setInterns(internsRes);
  //     const assigned: { [key: number]: Intern[] } = {};
  //     await Promise.all(
  //       projectsRes.map(async (project: any) => {
  //         try {
  //           const internIds = await getAssignedInterns(project.id);
  //           const mappedInterns = internsRes.filter((intern: Intern) =>
  //             internIds.includes(intern.id)
  //           );
  //           assigned[project.id] = mappedInterns;
  //         } catch {
  //           assigned[project.id] = [];
  //         }
  //       })
  //     );
  //     setAssignedInterns(assigned);
  //   };
  //   fetchData();
  // }, []);

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
    await updateProjectStatus({ projectId, status: value }).unwrap();
    await logProjectHistory({
      projectId,
      payload: { action: "status_changed", status: value },
    }).unwrap();
  };
  // const handleStatusChange = async (projectId: number, value: string) => {
  //   const project = projects.find((p) => p.id === projectId);
  //   if (!project) return;
  //   if (project.status === "completed" && value === "in_progress") {
  //     alert("Cannot change status from completed to in_progress");
  //     return;
  //   }
  //   await updateProjectStatus(projectId, value);
  //   try {
  //     await logProjectHistory(projectId, {
  //       action: "status_changed",
  //       status: value,
  //     });
  //   } catch {}
  //   const updatedProjects = await getAllProjects();
  //   dispatch(setProjects(updatedProjects));
  //   if (historyOpen && historyProjectName === project.name) {
  //     const data = await getProjectHistory(projectId);
  //     const withNames = data.map((item: any) => {
  //       let internName = "";
  //       if (item.intern_id) {
  //         const intern = interns.find((i) => i.id === item.intern_id);
  //         internName = intern ? intern.name : `ID: ${item.intern_id}`;
  //       }
  //       return { ...item, internName };
  //     });
  //     setHistoryData(withNames);
  //   }
  // };

  const handleAssign = async (projectId: number) => {
    if (
      !selectedInterns[projectId] ||
      selectedInterns[projectId].length === 0
    ) {
      alert("Select interns to assign.");
      return;
    }
    await assignProjectToInterns({
      projectId,
      internIds: selectedInterns[projectId],
    }).unwrap();
    alert("Project assigned successfully!");
  };

  const handleUnAssign = async (projectId: number) => {
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
    await unassignProjectFromInterns({ projectId, internIds }).unwrap();
    alert("Project unassigned successfully!");
  };

  // const handleUnassign = async (projectId: number) => {
  //   const project = projects.find((p) => p.id === projectId);
  //   if (!project || project.status === "completed") {
  //     alert("Cannot unassign interns from a completed project.");
  //     return;
  //   }
  //   const internIds = selectedInterns[projectId] || [];
  //   if (!internIds.length) {
  //     alert("Select interns to unassign.");
  //     return;
  //   }
  //   await unassignProjectFromInterns(projectId, internIds);
  //   alert("Interns unassigned successfully!");
  //   const [projectsRes, internsRes] = await Promise.all([
  //     getAllProjects(),
  //     getAllInterns(),
  //   ]);
  //   dispatch(setProjects(projectsRes));
  //   setInterns(internsRes);
  //   const assigned: { [key: number]: Intern[] } = {};
  //   await Promise.all(
  //     projectsRes.map(async (project: any) => {
  //       try {
  //         const internIds = await getAssignedInterns(project.id);
  //         const mappedInterns = internsRes.filter((intern: Intern) =>
  //           internIds.includes(intern.id)
  //         );
  //         assigned[project.id] = mappedInterns;
  //       } catch (err) {
  //         assigned[project.id] = [];
  //       }
  //     })
  //   );
  //   setAssignedInterns(assigned);
  //   setSelectedInterns((prev) => ({ ...prev, [projectId]: [] }));
  // };

  const { data: assignedIdsByProject = {} } = useGetAllAssignedInternsQuery();
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
        const currentStatus = project.status || "in_progress";
        const currentAssigned = assignedIdsByProject[project.id] || [];

        // Build a set of all intern IDs assigned to any in-progress project
        const assignedToInProgress = new Set<number>();
        projects.forEach((proj) => {
          if (proj.status !== "completed" && assignedIdsByProject[proj.id]) {
            assignedIdsByProject[proj.id].forEach((internId) => {
              assignedToInProgress.add(internId);
            });
          }
        });

        // Only show interns who are NOT assigned to any in-progress project,
        // OR are already assigned to this project
        const availableInterns = interns.filter(
          (intern) => !assignedToInProgress.has(intern.id)
        );
        return (
          <ProjectCard
            key={project.id}
            project={project}
            interns={availableInterns}
            allInterns={interns}
            selectedInterns={selectedInterns}
            handleInternsChange={handleInternsChange}
            handleAssign={handleAssign}
            handleUnAssign={handleUnAssign}
            currentStatus={currentStatus}
            historyOpen={historyOpen}
            selectedProjectId={selectedProjectId}
            handleViewHistory={handleViewHistory}
            handleCloseHistory={handleCloseHistory}
            historyProjectName={historyProjectName}
            historyData={historyData}
            handleStatusChange={handleStatusChange}
          />
        );
      })}
    </Container>
  );
}
