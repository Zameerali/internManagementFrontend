import React from "react";
import { Container, TextField, Button } from "@mui/material";
import { useCreateTaskMutation } from "../features/tasks/tasksApi";
import * as yup from "yup";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import { showSnackbar, hideSnackbar } from "../features/auth/authSlice";
import { useDispatch } from "react-redux";

const schema = yup.object({
  title: yup.string().required("Title is required"),
  description: yup.string().required("Description is required"),
});
interface AddTaskProps {
  internId: number;
  projectId?: number;
}

const AddTask: React.FC<AddTaskProps> = ({ internId, projectId }) => {
  const dispatch = useDispatch();
  const [createTask] = useCreateTaskMutation();
  const [success, setSuccess] = React.useState(false);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(schema),
    defaultValues: {
      title: "",
      description: "",
    },
  });

  const onSubmit = async (data: { title: string; description: string }) => {
    const task_date = new Date().toISOString().split("T")[0];
    if (!internId || !projectId) {
      dispatch(
        showSnackbar({
          message: "Intern ID and Project ID are required.",
          severity: "error",
        })
      );
      return;
    }
    const payload: any = {
      title: data.title,
      description: data.description,
      status: "pending",
      intern_id: internId,
      project_id: projectId,
      task_date,
    };
    try {
      await createTask({ task: payload, internId });
      dispatch(
        showSnackbar({
          message: "Task added successfully!",
          severity: "success",
        })
      );
      reset();
      // setSuccess(true);
      setTimeout(() => setSuccess(false), 2000);
    } catch (error: any) {
      console.error("Failed to add task:", error);
      dispatch(
        showSnackbar({
          message: error.data?.error || "Failed to add task",
          severity: "error",
        })
      );
    }
  };
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
      <form onSubmit={handleSubmit(onSubmit)}>
        <TextField
          sx={{ marginBottom: "1rem" }}
          label="Title"
          {...register("title")}
          error={!!errors.title}
          helperText={errors.title?.message}
          fullWidth
        />
        <TextField
          sx={{ marginBottom: "1rem" }}
          label="Description"
          {...register("description")}
          error={!!errors.description}
          helperText={errors.description?.message}
          fullWidth
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
