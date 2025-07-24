import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import { TextField, Box, Button, Avatar, Typography } from "@mui/material";
import {
  useRegisterMutation,
  useCheckEmailExistsQuery,
  authApi,
} from "./authApi";
import CustomSnackbar from "../../components/Snackbar";

interface RegisterFormData {
  email: string;
  password: string;
  first_name: string;
  last_name: string;
  phone: string;
  bio: string;
  image_url: string;
}

const schema = yup
  .object({
    email: yup.string().email("Invalid email").required("Email is required"),
    password: yup
      .string()
      .min(6, "Password must be at least 6 characters")
      .required("Password is required"),
    first_name: yup.string().required("First name is required"),
    last_name: yup.string().required("Last name is required"),
    phone: yup
      .string()
      .transform((value) => value.replace(/\D/g, ""))
      .required("Phone number is required"),
    bio: yup.string().required("Bio is required"),
    image_url: yup.string().required("Profile picture is required"),
  })
  .required();

const RegisterPage: React.FC = () => {
  const navigate = useNavigate();
  const [registerUser, { isLoading: registerLoading }] = useRegisterMutation();
  const [snackbar, setSnackbar] = useState({
    open: false,
    message: "",
    severity: "info" as "success" | "error" | "warning" | "info",
  });
  const [avatarPreview, setAvatarPreview] = useState<string | undefined>();
  const {
    register,
    handleSubmit,
    setValue,
    reset,
    setError,
    clearErrors,
    formState: { errors },
  } = useForm<RegisterFormData>({
    resolver: yupResolver(schema),
  });

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onloadend = () => {
      setValue("image_url", reader.result as string);
      setAvatarPreview(reader.result as string);
    };
    reader.readAsDataURL(file);
  };

  const onSubmit = async (data: RegisterFormData) => {
    setSnackbar({ open: false, message: "", severity: "info" });
    
    try {
      const res = await registerUser(data).unwrap();
      setSnackbar({
        open: true,
        message: "Registration successful! Please log in.",
        severity: "success",
      });
      setTimeout(() => {
        navigate("/login", { replace: true });
      }, 1500);
    } catch (err: any) {
      setSnackbar({
        open: true,
        message: err.data?.error || "Registration failed",
        severity: "error",
      });
      
      // reset();
      // setAvatarPreview(undefined);
    }
  };

  const handleSnackbarClose = () => {
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
        <Typography
          variant="h5"
          mb={2}
          align="center"
          fontWeight={700}
          color="primary"
        >
          Create Account
        </Typography>
        <form
          onSubmit={handleSubmit(onSubmit)}
          style={{ display: "flex", flexDirection: "column", gap: 18 }}
        >
          <TextField
            label="First Name"
            {...register("first_name")}
            error={!!errors.first_name}
            helperText={errors.first_name?.message}
            fullWidth
          />
          <TextField
            label="Last Name"
            {...register("last_name")}
            error={!!errors.last_name}
            helperText={errors.last_name?.message}
            fullWidth
          />
          <TextField
            label="Phone"
            {...register("phone")}
            error={!!errors.phone}
            helperText={errors.phone?.message}
            fullWidth
          />
          <TextField
            label="Bio"
            {...register("bio")}
            error={!!errors.bio}
            helperText={errors.bio?.message}
            fullWidth
            multiline
            minRows={2}
          />
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
          <Box display="flex" alignItems="center" gap={2} mt={1} mb={1}>
            <Avatar src={avatarPreview} sx={{ width: 56, height: 56 }} />
            <Button variant="outlined" component="label">
              Upload Image
              <input
                type="file"
                accept="image/*"
                hidden
                onChange={handleImageChange}
              />
            </Button>
          </Box>
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
