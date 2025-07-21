import { useState } from "react";
import { useRegisterMutation } from "./authApi";
import { Link, useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import { Button, TextField, Box } from "@mui/material";

const schema = yup.object().shape({
  email: yup.string().email("Invalid email").required("Email is required"),
  password: yup
    .string()
    .min(6, "Password must be at least 6 characters")
    .required("Password is required"),
});

export default function RegisterPage() {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(schema),
  });
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);
  const [registerUser] = useRegisterMutation();
  const navigate = useNavigate();
  const onSubmit = async (data: { email: string; password: string }) => {
    setError("");
    setSuccess(false);
    try {
      await registerUser(data).unwrap();
      setSuccess(true);
      navigate("/login");
    } catch (err: any) {
      setError(err.data?.error || "Registration failed");
    }
  };

  return (
    <Box
      sx={{
        minHeight: "100vh",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        // background: "linear-gradient(135deg, #e0e7ff 0%, #f3f4f6 100%)",
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
            {...register("password")}
            type="password"
            error={!!errors.password}
            helperText={errors.password?.message}
            fullWidth
          />

          <Button type="submit" variant="contained" color="primary">
            Register
          </Button>
        </form>
        {success && (
          <div
            style={{
              color: "green",
              marginTop: 18,
              textAlign: "center",
              fontWeight: 500,
            }}
          >
            Registration successful!
          </div>
        )}
        {error && (
          <div
            style={{
              color: "red",
              marginTop: 18,
              textAlign: "center",
              fontWeight: 500,
            }}
          >
            {error}
          </div>
        )}
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
}
