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
  handleUnAssign,
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
  handleUnAssign: (projectId: number) => void;
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

      {/* History Modal */}
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

      {/* Assigned Interns */}
      <div>
        <strong>Already Assigned Interns:</strong>
        {assignedInternIds.length === 0 ? (
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
                handleInternsChange(project.id, e.target.value as number[])
              }
              label="Select to Unassign"
              disabled={currentStatus === "completed"}
            >
              {assignedInternIds.map((internId) => {
                const intern = allInterns.find((i) => i.id === internId);
                return intern ? (
                  <MenuItem key={intern.id} value={intern.id}>
                    {intern.name}
                  </MenuItem>
                ) : (
                  <MenuItem key={internId} value={internId}>
                    {`ID ${internId}`}
                  </MenuItem>
                );
              })}
            </Select>
          </FormControl>
        )}
      </div>

      {/* Available Interns */}
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
          {interns.map((intern) => (
            <MenuItem key={intern.id} value={intern.id}>
              {intern.name}
            </MenuItem>
          ))}
        </Select>
      </FormControl>

      {/* Project Status */}
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
        onClick={() => handleUnAssign(project.id)}
        disabled={currentStatus === "completed"}
      >
        Unassign
      </Button>
    </Box>
  );
}
