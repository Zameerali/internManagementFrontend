import React from "react";
import { Container, TextField, Button } from "@mui/material";
import { useEffect, useState } from "react";
import type { Task } from "../types/task";
import { createTask } from "../services/taskService";
interface AddTaskProps {
  internId: number;
}

const AddTask: React.FC<AddTaskProps> = ({ internId }) => {
  const [task, setTask] = useState<Task>({
    id: 0,
    title: "",
    description: "",
    status: "pending",
    intern_id: internId,
    task_date: new Date().toISOString().split("T")[0],
  });
  return (
    <Container
      sx={{
        marginTop: "2rem",
        padding: "1rem",
        backgroundColor: "#f9f9f9",
        borderRadius: "8px",
        boxShadow: "0 2px 4px rgba(0,0,0,0.1)",
      }}
    >
      <form
        onSubmit={async (e) => {
        //   e.preventDefault();
          await createTask(task, internId);
          setTask({
            id: 0,
            title: "",
            description: "",
            status: "pending",
            intern_id: internId,
            task_date: new Date().toISOString().split("T")[0],
          });
        }}
      >
        <TextField
          sx={{ marginBottom: "1rem" }}
          label="Title"
          value={task.title}
          onChange={(e) => setTask({ ...task, title: e.target.value })}
          fullWidth
          required
        />
        <TextField
          sx={{ marginBottom: "1rem" }}
          label="Description"
          value={task.description}
          onChange={(e) => setTask({ ...task, description: e.target.value })}
          fullWidth
          required
        />
        <Button type="submit" variant="contained" color="primary">
          Add Task
        </Button>
      </form>
    </Container>
  );
};

export default AddTask;
