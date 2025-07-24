import React from "react";
import {
  Box,
  Typography,
  Paper,
  Stack,
  TextField,
  Button,
  CircularProgress,
  Snackbar,
  Alert,
  Avatar,
} from "@mui/material";
import EditIcon from "@mui/icons-material/Edit";
import SaveIcon from "@mui/icons-material/Save";
import CloseIcon from "@mui/icons-material/Close";
import { useForm } from "react-hook-form";
import { useGetMyProfileQuery, useUpdateMyProfileMutation } from "./authApi";

type ProfileForm = {
  first_name: string;
  last_name: string;
  phone: string;
  bio: string;
  image_url: string;
};

export default function Profile() {
  const { data: profile, isLoading, error, refetch } = useGetMyProfileQuery();
  const [updateProfile, { isLoading: isUpdating }] =
    useUpdateMyProfileMutation();
  const [editMode, setEditMode] = React.useState(false);
  const [snackbar, setSnackbar] = React.useState({
    open: false,
    message: "",
    severity: "success" as "success" | "error",
  });

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    reset,
    formState: { errors, isDirty },
  } = useForm<ProfileForm>();

  React.useEffect(() => {
    if (profile) {
      reset(profile);
    }
  }, [profile, reset]);

  const avatarPreview = watch("image_url");

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onloadend = () => {
      setValue("image_url", reader.result as string, { shouldDirty: true });
    };
    reader.readAsDataURL(file);
  };

  const onSubmit = async (data: ProfileForm) => {
    try {
      await updateProfile(data).unwrap();
      setSnackbar({
        open: true,
        message: "Profile updated!",
        severity: "success",
      });
      setEditMode(false);
      refetch();
    } catch (err: any) {
      setSnackbar({
        open: true,
        message: err?.data?.error || "Update failed",
        severity: "error",
      });
    }
  };

  if (isLoading || !profile)
    return (
      <Box display="flex" justifyContent="center" mt={8}>
        <CircularProgress />
      </Box>
    );

  if (error)
    return (
      <Typography color="error" align="center" mt={4}>
        Failed to load profile.
      </Typography>
    );

  return (
    <Paper
      elevation={3}
      sx={{
        p: { xs: 2, sm: 4 },
        maxWidth: 480,
        mx: "auto",
        mt: { xs: 2, sm: 6 },
        width: "100%",
      }}
    >
      <Stack spacing={3} alignItems="center" width="100%">
        <Avatar
          src={
            avatarPreview && avatarPreview.startsWith("data:image/")
              ? avatarPreview
              : profile.image_url || undefined
          }
          alt={profile?.first_name?.[0] || "U"}
          sx={{
            width: 100,
            height: 100,
            bgcolor: "#2563eb",
            fontSize: 40,
            mb: 1,
          }}
        >
          {!avatarPreview && !profile?.image_url?.startsWith("data:image/")
            ? profile?.first_name?.[0] || "U"
            : null}
        </Avatar>

        {editMode && (
          <Button
            variant="outlined"
            component="label"
            size="small"
            sx={{ mt: 1 }}
          >
            Upload Avatar
            <input
              type="file"
              accept="image/*"
              hidden
              onChange={handleImageChange}
            />
          </Button>
        )}

        <Box
          component="form"
          onSubmit={handleSubmit(onSubmit)}
          width="100%"
          maxWidth={360}
        >
          <Stack spacing={2} alignItems="center">
            <TextField
              label="Email"
              value={profile?.email || ""}
              fullWidth
              disabled
              InputProps={{
                style: { fontWeight: 600, color: "#2563eb" },
              }}
            />

            <TextField
              label="First Name"
              {...register("first_name", {
                required: "First name is required",
              })}
              fullWidth
              disabled={!editMode}
              error={!!errors.first_name}
              helperText={errors.first_name?.message}
            />
            <TextField
              label="Last Name"
              {...register("last_name", {
                required: "Last name is required",
              })}
              fullWidth
              disabled={!editMode}
              error={!!errors.last_name}
              helperText={errors.last_name?.message}
            />
            <TextField
              label="Phone"
              {...register("phone", {
                required: "Phone is required",
              })}
              fullWidth
              disabled={!editMode}
              error={!!errors.phone}
              helperText={errors.phone?.message}
            />
            <TextField
              label="Bio"
              {...register("bio", {
                required: "Bio is required",
              })}
              fullWidth
              multiline
              minRows={2}
              disabled={!editMode}
              error={!!errors.bio}
              helperText={errors.bio?.message}
            />

            <Box
              display="flex"
              gap={2}
              mt={2}
              width="100%"
              justifyContent="center"
            >
              {editMode ? (
                <>
                  <Button
                    type="submit"
                    variant="contained"
                    color="primary"
                    startIcon={<SaveIcon />}
                    disabled={isUpdating || !isDirty}
                  >
                    {isUpdating ? "Saving..." : "Save"}
                  </Button>
                  <Button
                    variant="outlined"
                    color="secondary"
                    startIcon={<CloseIcon />}
                    onClick={() => {
                      setEditMode(false);
                      reset(profile);
                    }}
                  >
                    Cancel
                  </Button>
                </>
              ) : (
                <Button
                  variant="outlined"
                  startIcon={<EditIcon />}
                  onClick={() => setEditMode(true)}
                >
                  Edit Profile
                </Button>
              )}
            </Box>
          </Stack>
        </Box>
      </Stack>

      <Snackbar
        open={snackbar.open}
        autoHideDuration={4000}
        onClose={() => setSnackbar((s) => ({ ...s, open: false }))}
        anchorOrigin={{ vertical: "bottom", horizontal: "center" }}
      >
        <Alert
          severity={snackbar.severity}
          variant="filled"
          sx={{ width: "100%" }}
        >
          {snackbar.message}
        </Alert>
      </Snackbar>
    </Paper>
  );
}
