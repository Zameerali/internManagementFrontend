import { useState, useCallback } from "react";
import { useDispatch } from "react-redux";
import { useNavigate, Link } from "react-router-dom";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import { TextField, Box, Button, Typography } from "@mui/material";
import type { AlertColor } from "@mui/material/Alert";
import { useLoginMutation } from "./authApi";
import { setAuthenticated } from "./authSlice";
import CustomSnackbar from "../../components/Snackbar";

interface LoginFormData {
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

const LoginPage: React.FC = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [login, { isLoading: loginLoading }] = useLoginMutation();
  const [snackbar, setSnackbar] = useState<{
    open: boolean;
    message: string;
    severity: AlertColor;
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
  } = useForm<LoginFormData>({
    resolver: yupResolver(schema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  const navigateToHome = useCallback(() => {
    navigate("/", { replace: true });
  }, [navigate]);

  const handleLogin = useCallback(
    async (data: LoginFormData) => {
      setSnackbar({ open: false, message: "", severity: "info" });
      try {
        const res = await login(data).unwrap();
        dispatch(setAuthenticated());
        setSnackbar({
          open: true,
          message: "Login successful!",
          severity: "success",
        });
        setTimeout(navigateToHome, 1000);
      } catch (err: any) {
        setSnackbar({
          open: true,
          message: err.data?.error || "Login failed",
          severity: "error",
        });
        reset();
      }
    },
    [login, dispatch, reset, navigateToHome]
  );

  const handleSnackbarClose = useCallback(() => {
    setSnackbar((prev) => ({ ...prev, open: false }));
  }, []);

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
        <Typography
          variant="h4"
          component="h2"
          style={{
            marginBottom: 28,
            textAlign: "center",
            fontWeight: 700,
            fontSize: 28,
            color: "#2563eb",
            letterSpacing: 1,
          }}
        >
          Sign In
        </Typography>
        <Box
          component="form"
          onSubmit={handleSubmit(handleLogin)}
          style={{ display: "flex", flexDirection: "column", gap: 18 }}
        >
          <TextField
            label="Email"
            {...register("email")}
            placeholder="Email"
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
            disabled={loginLoading}
          >
            {loginLoading ? "Logging in..." : "Login"}
          </Button>
        </Box>
        <CustomSnackbar
          open={snackbar.open}
          onClose={handleSnackbarClose}
          message={snackbar.message}
          severity={snackbar.severity}
          autoHideDuration={6000}
        />
        <Box sx={{ mt: 2, textAlign: "center", fontSize: 15 }}>
          Don't have an account?{" "}
          <Link
            to="/register"
            style={{ color: "#2563eb", textDecoration: "underline" }}
          >
            Register
          </Link>
        </Box>
      </Box>
    </Box>
  );
};

export default LoginPage;
