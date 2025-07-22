import React from "react";
import {
  Box,
  Button,
  Select,
  MenuItem,
  InputLabel,
  FormControl,
  Typography,
  Modal,
  Paper,
  Chip,
} from "@mui/material";
import type { Project, ProjectHistoryItem } from "./type";
import type { Intern } from "../interns/type";
import { skipToken } from "@reduxjs/toolkit/query";
import { useGetAssignedInternsQuery } from "./projectsApi";
export function ProjectCard({
  project,
  interns,
  allInterns,
  selectedInterns,
  handleInternsChange,
  handleAssign,
  // handleUnAssign, // Unassign logic removed
  currentStatus,
  historyOpen,
  selectedProjectId,
  handleViewHistory,
  handleCloseHistory,
  historyProjectName,
  historyData,
  handleStatusChange,
}: {
  project: Project;
  interns: Intern[];
  allInterns: Intern[];
  selectedInterns: { [key: number]: number[] };
  handleInternsChange: (projectId: number, value: number[]) => void;
  handleAssign: (projectId: number) => void;
  // handleUnAssign: (projectId: number) => void; // Unassign logic removed
  currentStatus: string;
  historyOpen: boolean;
  selectedProjectId: number | typeof skipToken;
  handleViewHistory: (project: Project) => void;
  handleCloseHistory: () => void;
  historyProjectName: string;
  historyData: ProjectHistoryItem[];
  handleStatusChange: (projectId: number, value: string) => void;
}) {
  const { data: assigned = [] } = useGetAssignedInternsQuery(project.id);
  const assignedInternIds = Array.isArray(assigned) ? assigned : [];
  return (
    <Box
      key={project.id}
      sx={{
        mb: 4,
        p: { xs: 2, sm: 3 },
        borderRadius: 3,
        boxShadow: 3,
        background: "linear-gradient(135deg, #f5faff 60%, #e3f2fd 100%)",
        border: "1px solid #e3f2fd",
        transition: "box-shadow 0.2s",
        ":hover": { boxShadow: 8 },
        minWidth: 280,
        maxWidth: 700,
        mx: "auto",
      }}
    >
      <Box
        sx={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          mb: 2,
        }}
      >
        <Typography
          variant="h5"
          fontWeight={700}
          color="primary.dark"
          sx={{ letterSpacing: 0.5 }}
        >
          {project.name}
        </Typography>
        <Button
          variant="outlined"
          size="small"
          onClick={() => handleViewHistory(project)}
          sx={{ borderRadius: 2, fontWeight: 600, textTransform: "none" }}
        >
          View History
        </Button>
      </Box>

      <Modal
        open={historyOpen && selectedProjectId === project.id}
        onClose={handleCloseHistory}
      >
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
                if (
                  item.action === "assigned" ||
                  item.action === "unassigned"
                ) {
                  let internName = "Unknown";
                  if (item.intern_id) {
                    const internObj = allInterns.find(
                      (i) => i.id === item.intern_id
                    );
                    internName = internObj
                      ? internObj.name
                      : `ID ${item.intern_id}`;
                  }
                  detail = `Intern: ${internName} ${item.action}`;
                } else if (item.action === "status_changed" && item.status) {
                  detail = `Project status changed to '${
                    item.status === "completed" ? "Completed" : "In Progress"
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
            onClick={handleCloseHistory}
            sx={{ mt: 2 }}
            variant="contained"
          >
            Close
          </Button>
        </Paper>
      </Modal>


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
          renderValue={(selected) => (
            <Box sx={{ display: "flex", flexWrap: "wrap", gap: 0.5 }}>
              {Array.isArray(selected) && selected.length > 0 ? (
                selected.map((id) => {
                  const intern = interns.find((i) => i.id === id);
                  return (
                    <Chip
                      key={id}
                      label={intern ? intern.name : `ID ${id}`}
                      size="small"
                      sx={{
                        fontWeight: 500,
                        bgcolor: "#e3f2fd",
                        color: "#1976d2",
                      }}
                    />
                  );
                })
              ) : (
                <span style={{ color: "#888" }}>Select Interns</span>
              )}
            </Box>
          )}
          sx={{ borderRadius: 2, bgcolor: "#fff" }}
          MenuProps={{
            PaperProps: {
              sx: { borderRadius: 2, boxShadow: 3, mt: 1 },
            },
          }}
        >
          {interns.map((intern) => (
            <MenuItem
              key={intern.id}
              value={intern.id}
              sx={{ borderRadius: 1 }}
            >
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
          sx={{ borderRadius: 2, bgcolor: "#fff" }}
          MenuProps={{
            PaperProps: {
              sx: { borderRadius: 2, boxShadow: 3, mt: 1 },
            },
          }}
        >
          <MenuItem value="in_progress">In Progress</MenuItem>
          <MenuItem value="completed">Completed</MenuItem>
        </Select>
      </FormControl>

      <Button
        variant="contained"
        sx={{
          mr: 2,
          borderRadius: 2,
          fontWeight: 600,
          textTransform: "none",
          px: 4,
          py: 1.2,
          boxShadow: "0 2px 8px rgba(25, 118, 210, 0.08)",
          background: "linear-gradient(90deg, #1976d2 60%, #64b5f6 100%)",
        }}
        onClick={() => handleAssign(project.id)}
        disabled={currentStatus === "completed"}
      >
        Assign
      </Button>
    </Box>
  );
}
