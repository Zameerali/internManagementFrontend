import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import { TextField, Box, Button } from "@mui/material";
import { useRegisterMutation } from "./authApi";
import CustomSnackbar from "../../components/Snackbar";

interface RegisterFormData {
  email: string;
  password: string;
}

const schema = yup
  .object({
    email: yup.string().email("Invalid email").required("Email is required"),
    password: yup
      .string()
      .min(6, "Password must be at least 6 characters")
      .required("Password is required"),
  })
  .required();

const RegisterPage: React.FC = () => {
  const navigate = useNavigate();
  const [registerUser, { isLoading: registerLoading }] = useRegisterMutation();
  const [snackbar, setSnackbar] = useState<{
    open: boolean;
    message: string;
    severity: "success" | "error" | "warning" | "info";
  }>({
    open: false,
    message: "",
    severity: "info",
  });
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<RegisterFormData>({
    resolver: yupResolver(schema),
  });

  const onSubmit = async (data: RegisterFormData) => {
    console.log("Register onSubmit called with data:", data);
    setSnackbar({ open: false, message: "", severity: "info" });
    try {
      const res = await registerUser(data).unwrap();
      console.log("Register response:", res);
      setSnackbar({
        open: true,
        message: "Registration successful! Please log in.",
        severity: "success",
      });
      setTimeout(() => {
        console.log("Navigating to /login");
        navigate("/login", { replace: true });
      }, 1500);
    } catch (err: any) {
      console.error("Register error:", err);
      setSnackbar({
        open: true,
        message: err.data?.error || "Registration failed",
        severity: "error",
      });
      reset();
    }
  };

  const handleSnackbarClose = () => {
    console.log("Closing Snackbar");
    setSnackbar((prev) => ({ ...prev, open: false }));
  };


  return (
    <Box
      sx={{
        minHeight: "100vh",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
      }}
    >
      <Box
        sx={{
          background: "#fff",
          p: { xs: 2, sm: 4 },
          borderRadius: 2,
          boxShadow: "0 4px 32px rgba(0,0,0,0.10)",
          minWidth: 340,
          maxWidth: 400,
          width: "100%",
        }}
      >
        <h2
          style={{
            marginBottom: 28,
            textAlign: "center",
            fontWeight: 700,
            fontSize: 28,
            color: "#2563eb",
            letterSpacing: 1,
          }}
        >
          Create Account
        </h2>
        <form
          onSubmit={handleSubmit(onSubmit)}
          style={{ display: "flex", flexDirection: "column", gap: 18 }}
        >
          <TextField
            label="Email"
            {...register("email")}
            error={!!errors.email}
            helperText={errors.email?.message}
            fullWidth
          />
          <TextField
            label="Password"
            type="password"
            {...register("password")}
            error={!!errors.password}
            helperText={errors.password?.message}
            fullWidth
          />
          <Button
            type="submit"
            variant="contained"
            color="primary"
            disabled={registerLoading}
          >
            {registerLoading ? "Registering..." : "Register"}
          </Button>
        </form>
        <CustomSnackbar
          open={snackbar.open}
          onClose={handleSnackbarClose}
          message={snackbar.message}
          severity={snackbar.severity}
          autoHideDuration={6000}
        />
        <Box sx={{ mt: 2, textAlign: "center", fontSize: 15 }}>
          Already have an account?{" "}
          <Link
            to="/login"
            style={{ color: "#2563eb", textDecoration: "underline" }}
          >
            Login
          </Link>
        </Box>
      </Box>
    </Box>
  );
};

export default RegisterPage;
