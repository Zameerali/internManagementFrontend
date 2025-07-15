import React from "react";
import {
  getAllProjects,
  assignProjectToInterns,
} from "../services/projectService";
import { getAllInterns } from "../services/internService";
import {
  Box,
  Container,
  Button,
  Checkbox,
  FormControlLabel,
  FormGroup,
} from "@mui/material";
import type { Project } from "../types/project";
import type { Intern } from "../types/intern";

export default function ProjectsPage() {
  const [projects, setProjects] = React.useState<Project[]>([]);
  const [interns, setInterns] = React.useState<Intern[]>([]);
  const [selectedInterns, setSelectedInterns] = React.useState<{
    [key: number]: number[];
  }>({});

  React.useEffect(() => {
    const fetchProjectsAndInterns = async () => {
      try {
        const [projectsRes, internsRes] = await Promise.all([
          getAllProjects(),
          getAllInterns(),
        ]);
        setProjects(projectsRes);
        setInterns(internsRes);
      } catch (error) {
        console.error("Failed to fetch projects or interns:", error);
      }
    };
    fetchProjectsAndInterns();
  }, []);

  const handleInternSelect = (projectId: number, internId: number) => {
    setSelectedInterns((prev) => {
      const current = prev[projectId] || [];
      return {
        ...prev,
        [projectId]: current.includes(internId)
          ? current.filter((id) => id !== internId)
          : [...current, internId],
      };
    });
  };

  const handleAssign = async (projectId: number) => {
    try {
      await assignProjectToInterns(projectId, selectedInterns[projectId] || []);
      alert("Project assigned successfully!");
    } catch (error) {
      console.error("Failed to assign project:", error);
      alert("Failed to assign project.");
    }
  };

  return (
    <Container
      sx={{
        padding: "2rem",
        margin: "0 auto",
        width: "auto",
        textAlign: "center",
        alignItems: "center",
        border: "1px solid #eee",
        borderRadius: "8px",
        boxShadow: "0 2px 4px rgba(0,0,0,0.1)",
        backgroundColor: "#fff",
      }}
    >
       {projects.map((project) => (
        <Box
          sx={{
            margin: "1rem 0",
            padding: "1rem",
            border: "1px solid #ccc",
            borderRadius: "8px",
            backgroundColor: "#f9f9f9",
            textAlign: "left",
          }}
          key={project.id}
        >
          <h2>Project Name: {project.name}</h2>
          <h3>Select Interns to Assign:</h3>
          <FormGroup row>
            {interns.map((intern) => (
              <FormControlLabel
                key={intern.id}
                control={
                  <Checkbox
                    checked={
                      selectedInterns[project.id]?.includes(intern.id) || false
                    }
                    onChange={() => handleInternSelect(project.id, intern.id)}
                  />
                }
                label={intern.name}
              />
            ))}
          </FormGroup>
          <Button
            variant="contained"
            sx={{ mt: 2 }}
            onClick={() => handleAssign(project.id)}
          >
            Assign
          </Button>
        </Box>
      ))}
    </Container>
  );
}
