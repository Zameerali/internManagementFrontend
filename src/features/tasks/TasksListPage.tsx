import React from "react";
import { Container } from "@mui/material";
import { Box } from "@mui/system";
import { useGetAllTasksWithInternsQuery } from "./tasksApi";
const TasksListPage = () => {
  const { data: tasks = [], isLoading } = useGetAllTasksWithInternsQuery();

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
          gap: "1rem",
          padding: "1rem",
          backgroundColor: "#fff",
          borderRadius: "8px",
          boxShadow: "0 2px 4px rgba(0,0,0,0.1)",
          border: "1px solid #eee",
          overflowY: "auto",
          "& > div": {
            padding: "1rem",
            borderBottom: "1px solid #eee",
          },
        }}
      >
        {isLoading ? (
          <Box sx={{ textAlign: "center", py: 4 }}>Loading tasks...</Box>
        ) : (
          tasks.map((task) => (
            <Box
              key={task.id}
              sx={{
                padding: "1rem",
                backgroundColor: "#f0f0f0",
                borderRadius: "8px",
                display: "flex",
                flexDirection: "column",
                gap: "0.5rem",
                borderBottom: "1px solid #eee",
                paddingBottom: "1rem",
                "&:last-child": {
                  borderBottom: "none",
                  paddingBottom: "0",
                },
              }}
            >
              <span>
                <strong>Intern Id:</strong> {task.intern_id}
              </span>
              <span>
                <strong>Title:</strong> {task.title}
              </span>
              <span>
                <strong>Description:</strong> {task.description}
              </span>
              <span>
                <strong>Status:</strong> {task.status}
              </span>
              <span>
                <strong>Task Date:</strong> {task.task_date.split("T")[0]}
              </span>
            </Box>
          ))
        )}
      </Box>
    </Container>
  );
};

export default TasksListPage;
