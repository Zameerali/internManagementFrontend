import { useState } from "react";
import { useGetAllInternsQuery, useAddInternMutation } from "./internsApi.ts";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import {
  Container,
  CircularProgress,
  Box,
  TextField,
  Typography,
  Modal,
  Paper,
  Button,
  Stack,
  Pagination,
  Grid,
} from "@mui/material";
import InternCard from "../../components/InternCard.tsx";
import GroupAddIcon from "@mui/icons-material/GroupAdd";

const schema = yup.object().shape({
  name: yup.string().required("Name is required"),
  email: yup.string().email("Invalid email").required("Email is required"),
  joined_date: yup.string().required("Joined date is required"),
  bio: yup.string().required("Bio is required"),
  linkedin: yup
    .string()
    .url("Invalid URL")
    .required("LinkedIn URL is required"),
});

export default function InternListPage() {
  const [addOpen, setAddOpen] = useState(false);
  const { data: interns = [], isLoading } = useGetAllInternsQuery();
  const [addIntern] = useAddInternMutation();
  const [page, setPage] = useState(1);
  const internsPerPage = 9;

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(schema),
    defaultValues: {
      name: "",
      email: "",
      joined_date: "",
      bio: "",
      linkedin: "",
    },
  });

  const handleAddIntern = async (data: {
    name: string;
    email: string;
    joined_date: string;
    bio?: string;
    linkedin?: string;
  }) => {
    try {
      await addIntern(data).unwrap();
      setAddOpen(false);
      reset();
    } catch (e) {
      alert("Failed to add intern");
    }
  };

  const totalPages = Math.ceil(interns.length / internsPerPage);
  const paginatedInterns = interns.slice(
    (page - 1) * internsPerPage,
    page * internsPerPage
  );

  return (
    <Container sx={{ py: 5, maxWidth: "600px" }}>
      <Typography variant="h4" align="center" fontWeight="bold" gutterBottom>
        Interns
      </Typography>

      <Box textAlign="center" mb={4}>
        <Button
          variant="contained"
          startIcon={<GroupAddIcon />}
          onClick={() => setAddOpen(true)}
        >
          Add Intern
        </Button>
      </Box>

      <Modal open={addOpen} onClose={() => setAddOpen(false)}>
        <Paper
          sx={{
            position: "absolute",
            top: "50%",
            left: "50%",
            transform: "translate(-50%, -50%)",
            width: { xs: 300, sm: 400 },
            p: 4,
            borderRadius: 2,
          }}
        >
          <Typography variant="h6" gutterBottom>
            Add New Intern
          </Typography>
          <form onSubmit={handleSubmit(handleAddIntern)}>
            <Stack spacing={2}>
              <TextField
                label="Name"
                {...register("name")}
                error={!!errors.name}
                helperText={errors.name?.message}
                fullWidth
              />
              <TextField
                label="Email"
                {...register("email")}
                error={!!errors.email}
                helperText={errors.email?.message}
                fullWidth
              />
              <TextField
                type="date"
                label="Joined Date"
                {...register("joined_date")}
                error={!!errors.joined_date}
                helperText={errors.joined_date?.message}
                InputLabelProps={{ shrink: true }}
                fullWidth
              />
              <TextField
                label="Bio"
                {...register("bio")}
                error={!!errors.bio}
                helperText={errors.bio?.message}
                fullWidth
              />
              <TextField
                label="LinkedIn URL"
                {...register("linkedin")}
                error={!!errors.linkedin}
                helperText={errors.linkedin?.message}
                fullWidth
              />
              <Stack direction="row" justifyContent="space-between">
                <Button variant="contained" type="submit">
                  Add
                </Button>
                <Button
                  variant="text"
                  onClick={() => {
                    setAddOpen(false);
                    reset();
                  }}
                >
                  Cancel
                </Button>
              </Stack>
            </Stack>
          </form>
        </Paper>
      </Modal>

      {isLoading ? (
        <Box display="flex" justifyContent="center" mt={4}>
          <CircularProgress />
        </Box>
      ) : interns.length === 0 ? (
        <Box display="flex" flexDirection="column" alignItems="center" mt={8}>
          <Box
            sx={{
              width: 120,
              height: 120,
              mb: 2,
              opacity: 0.7,
              background:
                "url(https://cdn-icons-png.flaticon.com/512/4076/4076549.png) center/contain no-repeat",
            }}
          />
          <Typography variant="h6" color="text.secondary" gutterBottom>
            No interns found
          </Typography>
          <Typography color="text.secondary">
            Get started by adding your first intern!
          </Typography>
        </Box>
      ) : (
        <>
          <Box
            sx={{
              display: "flex",
              flexWrap: "wrap",
              gap: 3,
              justifyContent: "center",
            }}
          >
            {paginatedInterns.map((intern) => (
              <Box
                key={intern.id}
                sx={{
                  flex: { xs: "0 0 100%", md: "0 0 48%" },
                  maxWidth: { xs: "100%", md: "340px" },
                  minWidth: { xs: "100%", md: "320px" },
                  minHeight: 320,
                  display: "flex",
                  alignItems: "stretch",
                }}
              >
                <InternCard intern={intern} />
              </Box>
            ))}
          </Box>

          {totalPages > 1 && (
            <Box display="flex" justifyContent="center" mt={4}>
              <Pagination
                count={totalPages}
                page={page}
                onChange={(_, value) => setPage(value)}
                color="primary"
              />
            </Box>
          )}
        </>
      )}
    </Container>
  );
}
