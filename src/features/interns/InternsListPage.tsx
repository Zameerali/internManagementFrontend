import { useEffect, useState } from "react";
// import {
//   getInternWithProfile,
//   addIntern,
// } from "../../services/internService.ts";
// import {
//   setInterns,
//   addIntern as addInternRedux,
// } from "../../store/internsSlice.ts";
import {
  useGetAllInternsQuery,
  useAddInternMutation,
  useGetInternWithProfileQuery,
} from "./internsApi.ts";
// import { useDispatch, useSelector } from "react-redux";
// import type { RootState } from "../../store/index.ts";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import { Button, Modal, Paper, Typography } from "@mui/material";
// import { getAllInterns } from "../../services/internService.ts";
// import type { Intern } from "../../types/intern.ts";
import InternCard from "../../components/InternCard.tsx";
import { Container } from "@mui/material";

const schema = yup.object().shape({
  name: yup.string().required("Name is required"),
  email: yup.string().email("Invalid email").required("Email is required"),
  joined_date: yup.string().required("Joined date is required"),
  bio: yup.string().required(),
  linkedin: yup
    .string()
    .url("must be a valid URL")
    .required("LinkedIn URL is required"),
});
export default function InternListPage() {
  const [addOpen, setAddOpen] = useState(false);
  // const dispatch = useDispatch();
  // const interns = useSelector((state: RootState) => state.interns.interns);

  const { data: interns = [], isLoading } = useGetAllInternsQuery();
  const [addIntern] = useAddInternMutation();

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

  // const handleAddIntern = async (data: {
  //   name: string;
  //   email: string;
  //   joined_date: string;
  //   bio?: string;
  //   linkedin?: string;
  // }) => {
  //   try {
  //     const created = await addIntern(data);
  //     const fullIntern = await getInternWithProfile(created.id);
  //     setAddOpen(false);
  //     reset();
  //     dispatch(addInternRedux(fullIntern));
  //   } catch (e) {
  //     alert("Failed to add intern");
  //   }
  // };

  // useEffect(() => {
  //   (async () => {
  //     const data = await getAllInterns();
  //     const withProfiles = await Promise.all(
  //       data.map(async (intern) => {
  //         try {
  //           const res = await fetch(`/api/interns/${intern.id}/profile`);
  //           const profile = await res.json();
  //           return { ...intern, profile: profile.profile };
  //         } catch {
  //           return intern;
  //         }
  //       })
  //     );
  //     dispatch(setInterns(withProfiles));
  //   })();
  // }, []);

  return (
    <Container
      sx={{
        alignItems: "center",
        padding: "2rem",
        maxWidth: "800px",
        margin: "0 auto",
      }}
    >
      <h1 className="text-2xl font-bold mb-4" style={{ textAlign: "center" }}>
        Interns
      </h1>
      <div
        style={{
          display: "flex",
          justifyContent: "center",
          marginBottom: "16px",
        }}
      >
        <Button variant="contained" onClick={() => setAddOpen(true)}>
          Add Intern
        </Button>
      </div>
      <Modal open={addOpen} onClose={() => setAddOpen(false)}>
        <Paper
          sx={{
            position: "absolute",
            top: "50%",
            left: "50%",
            transform: "translate(-50%, -50%)",
            width: 350,
            p: 3,
          }}
        >
          <Typography variant="h6" gutterBottom>
            Add New Intern
          </Typography>
          <form
            onSubmit={handleSubmit(handleAddIntern)}
            style={{ display: "flex", flexDirection: "column", gap: 12 }}
          >
            <input
              type="text"
              placeholder="Name"
              {...register("name")}
              style={{ padding: "8px", fontSize: "16px" }}
            />
            {errors.name && (
              <span style={{ color: "red" }}>{errors.name.message}</span>
            )}
            <input
              type="email"
              placeholder="Email"
              {...register("email")}
              style={{ padding: "8px", fontSize: "16px" }}
            />
            {errors.email && (
              <span style={{ color: "red" }}>{errors.email.message}</span>
            )}
            <input
              type="date"
              placeholder="Joined Date"
              {...register("joined_date")}
              style={{ padding: "8px", fontSize: "16px" }}
            />
            {errors.joined_date && (
              <span style={{ color: "red" }}>{errors.joined_date.message}</span>
            )}
            <input
              type="text"
              placeholder="Bio"
              {...register("bio")}
              style={{ padding: "8px", fontSize: "16px" }}
            />
            <input
              type="text"
              placeholder="LinkedIn URL"
              {...register("linkedin")}
              style={{ padding: "8px", fontSize: "16px" }}
            />
            {errors.linkedin && (
              <span style={{ color: "red" }}>{errors.linkedin.message}</span>
            )}
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
          </form>
        </Paper>
      </Modal>
      {interns.map((intern) => (
        <InternCard key={intern.id} intern={intern} />
      ))}
    </Container>
  );
}
