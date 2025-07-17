import React from "react";
import { Container, TextField, Button } from "@mui/material";
import { useCreateTaskMutation } from "../features/tasks/tasksApi";

interface AddTaskProps {
  internId: number;
  projectId?: number;
}

const AddTask: React.FC<AddTaskProps> = ({ internId, projectId }) => {
  const [createTask] = useCreateTaskMutation();
  const [success, setSuccess] = React.useState(false);

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
          e.preventDefault();
          const formData = new FormData(e.currentTarget as HTMLFormElement);
          const title = formData.get("title") as string;
          const description = formData.get("description") as string;
          const task_date = new Date().toISOString().split("T")[0];
          if (!internId || !projectId) {
            alert("Intern or Project ID missing!");
            return;
          }
          const payload: any = {
            title,
            description,
            status: "pending",
            intern_id: internId,
            project_id: projectId,
            task_date,
          };
          await createTask({ task: payload, internId });
          if (e.currentTarget instanceof HTMLFormElement) {
            e.currentTarget.reset();
          }
          setSuccess(true);
          setTimeout(() => setSuccess(false), 2000);
        }}
      >
        <TextField
          sx={{ marginBottom: "1rem" }}
          label="Title"
          name="title"
          fullWidth
          required
        />
        <TextField
          sx={{ marginBottom: "1rem" }}
          label="Description"
          name="description"
          fullWidth
          required
        />
        <Button type="submit" variant="contained" color="primary">
          Add Task
        </Button>
        {success && (
          <div style={{ color: "#388e3c", marginTop: "1rem", fontWeight: 500 }}>
            Task added successfully!
          </div>
        )}
      </form>
    </Container>
  );
};

export default AddTask;
