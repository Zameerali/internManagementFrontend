import { useState } from "react";
import { useDispatch } from "react-redux";
import { setAuthenticated } from "./authSlice";
import { useLoginMutation } from "./authApi";
import * as yup from "yup";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";

import { Link, useNavigate } from "react-router-dom";
import { TextField, Box } from "@mui/material";
import { Button } from "@mui/material";
const schema = yup.object({
  email: yup.string().email("Invalid email").required("Email is required"),
  password: yup
    .string()
    .min(6, "Password must be at least 6 characters")
    .required("Password is required"),
});
function LoginPage() {
  const navigate = useNavigate();
  // const [email, setEmail] = useState("");
  // const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const dispatch = useDispatch();
  const [login] = useLoginMutation();

  // const handleSubmit = async (e: React.FormEvent) => {
  //   e.preventDefault();
  //   setError("");
  //   try {
  //     const res = await login({ email, password }).unwrap();
  //     dispatch(setToken(res.token));
  //     navigate("/");
  //   } catch (err: any) {
  //     setError(err.data?.error || "Login failed");
  //   }
  // };

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(schema),
    defaultValues: {
      email: "",
      password: "",
    },
  });
  const handleLogin = async (data: { email: string; password: string }) => {
    setError("");
    try {
      const res = await login(data).unwrap();
      dispatch(setAuthenticated());
      navigate("/");
    } catch (err: any) {
      setError(err.data?.error || "Login failed");
    }
    reset();
  };
  return (
    <Box
      sx={{
        minHeight: "100vh",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        // mx: 2,
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
          Sign In
        </h2>
        <form
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
            // sx={{
            //   padding: 12,
            //   borderRadius: 8,
            //   border: "1px solid #d1d5db",
            //   fontSize: 16,
            //   outline: "none",
            //   transition: "border 0.2s",
            // }}
          />
          <TextField
            {...register("password")}
            label="Password"
            type="password"
            error={!!errors.password}
            helperText={errors.password?.message}
            fullWidth
            // sx={{
            //   padding: 12,
            //   borderRadius: 8,
            //   border: "1px solid #d1d5db",
            //   fontSize: 16,
            //   outline: "none",
            //   transition: "border 0.2s",
            // }}
            // required
          />

          <Button
            type="submit"
            variant="contained"
            color="primary"
            // sx={{
            //   padding: 12,
            //   borderRadius: 8,
            //   background: "linear-gradient(90deg, #2563eb 60%, #60a5fa 100%)",
            //   color: "#fff",
            //   fontWeight: 700,
            //   fontSize: 16,
            //   border: "none",
            //   cursor: "pointer",
            //   boxShadow: "0 2px 8px rgba(37,99,235,0.10)",
            // }}
          >
            Login
          </Button>
        </form>
        {error && (
          <Box
            sx={{
              color: "red",
              mt: 2,
              textAlign: "center",
              fontWeight: 500,
            }}
          >
            {error}
          </Box>
        )}
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
}

export default LoginPage;
