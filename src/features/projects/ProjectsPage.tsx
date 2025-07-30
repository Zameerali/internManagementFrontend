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
  Pagination,
} from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import type { Project, ProjectHistoryItem } from "./type";
import { showSnackbar } from "../auth/authSlice";

import { useSelector, useDispatch } from "react-redux";
// import {
//   setProjects,
//   addProject as addProjectRedux,
// } from "../../store/projectsSlice";
// import type { RootState } from "../../store";
import type { Intern } from "../../types/intern";

export default function ProjectsPage() {
  const dispatch = useDispatch();
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
    dispatch(
      showSnackbar({
        message: "Interns selection updated",
        severity: "info",
      })
    );
  };

  const handleStatusChange = async (projectId: number, value: string) => {
    const project = projects.find((p) => p.id === projectId);
    if (!project) return;
    if (project.status === "completed" && value === "in_progress") {
      alert("Cannot change status from completed to in_progress");
      return;
    }
    await updateProjectStatus({ projectId, status: value }).unwrap();
    dispatch(
      showSnackbar({
        message: "Project status updated successfully!",
        severity: "success",
      })
    );
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
    // Reset selection after assignment
    setSelectedInterns((prev) => ({ ...prev, [projectId]: [] }));
    dispatch(
      showSnackbar({
        message: "Project assigned successfully!",
        severity: "success",
      })
    );
  };

  // const handleUnAssign = async (projectId: number) => {
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
  //   await unassignProjectFromInterns({ projectId, internIds }).unwrap();
  //   alert("Project unassigned successfully!");
  // };

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
  // Pagination logic
  const [page, setPage] = React.useState(1);
  const projectsPerPage = 9;
  const totalPages = Math.ceil(projects.length / projectsPerPage);
  const paginatedProjects = projects.slice(
    (page - 1) * projectsPerPage,
    page * projectsPerPage
  );

  return (
    <Container sx={{ py: 5, maxWidth: "1200px" }}>
      <Typography variant="h4" align="center" fontWeight="bold" gutterBottom>
        Projects
      </Typography>
      <Box sx={{ display: "flex", justifyContent: "center", mb: 3 }}>
        <Button
          variant="contained"
          onClick={() => setAddOpen(true)}
          startIcon={<AddIcon />}
        >
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
      {projects.length === 0 ? (
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
          <Typography
            variant="h5"
            color="primary.dark"
            fontWeight={700}
            gutterBottom
            sx={{ letterSpacing: 0.5 }}
          >
            No projects found
          </Typography>
          <Typography color="text.secondary" sx={{ fontSize: 18, mb: 1 }}>
            Get started by adding your first project!
          </Typography>
        </Box>
      ) : (
        <>
          <Box
            sx={{
              display: "flex",
              flexWrap: "wrap",
              gap: 3,
              justifyContent: "center",
            }}
          >
            {paginatedProjects.map((project) => {
              const currentStatus = project.status || "in_progress";
              const currentAssigned = assignedIdsByProject[project.id] || [];

              // Build a set of all intern IDs assigned to any in-progress project
              const assignedToInProgress = new Set<number>();
              projects.forEach((proj) => {
                if (
                  proj.status !== "completed" &&
                  assignedIdsByProject[proj.id]
                ) {
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
                <Box
                  key={project.id}
                  sx={{
                    flex: { xs: "0 0 100%", md: "0 0 48%" },
                    maxWidth: { xs: "100%", md: "340px" },
                    minWidth: { xs: "100%", md: "320px" },
                    minHeight: 320,
                    display: "flex",
                    alignItems: "stretch",
                  }}
                >
                  <ProjectCard
                    project={project}
                    interns={availableInterns}
                    allInterns={interns}
                    selectedInterns={selectedInterns}
                    handleInternsChange={handleInternsChange}
                    handleAssign={handleAssign}
                    currentStatus={currentStatus}
                    historyOpen={historyOpen}
                    selectedProjectId={selectedProjectId}
                    handleViewHistory={handleViewHistory}
                    handleCloseHistory={handleCloseHistory}
                    historyProjectName={historyProjectName}
                    historyData={historyData}
                    handleStatusChange={handleStatusChange}
                  />
                </Box>
              );
            })}
          </Box>
          {totalPages > 1 && (
            <Box display="flex" justifyContent="center" mt={4}>
              <Pagination
                count={totalPages}
                page={page}
                onChange={(_, value) => setPage(value)}
                color="primary"
              />
            </Box>
          )}
        </>
      )}
    </Container>
  );
}
