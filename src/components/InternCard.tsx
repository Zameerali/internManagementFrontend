import {
  Card,
  CardContent,
  Typography,
  Link,
  Avatar,
  Box,
  Stack,
} from "@mui/material";
import EmailIcon from "@mui/icons-material/Email";
import CalendarMonthIcon from "@mui/icons-material/CalendarMonth";
import LinkedInIcon from "@mui/icons-material/LinkedIn";

import type { Intern } from "../types/intern";

type Props = {
  intern: Intern;
};

export default function InternCard({ intern }: Props) {
  const nameParts = intern.name.trim().split(" ").filter(Boolean);
  let initials = "";
  if (nameParts.length === 1) {
    initials = nameParts[0].slice(0, 2).toUpperCase();
  } else {
    initials = (nameParts[0][0] + nameParts[1][0]).toUpperCase();
  }

  return (
    <Card
      sx={{
        width: "100%",
        maxWidth: 480,
        mx: "auto",
        my: 2,
        boxShadow: 3,
        borderRadius: 3,
        background: "linear-gradient(135deg, #f5faff 60%, #e3f2fd 100%)",
        transition: "box-shadow 0.2s",
        ":hover": { boxShadow: 8 },
        p: 0,
        position: "relative",
        minHeight: 320,
        display: "flex",
        flexDirection: "column",
      }}
    >
      <CardContent
        sx={{ flex: 1, display: "flex", flexDirection: "column", pb: "56px" }}
      >
        <Stack
          direction={{ xs: "column", sm: "row" }}
          spacing={2}
          alignItems="center"
          justifyContent="flex-start"
          mb={2}
        >
          <Avatar
            sx={{
              width: 64,
              height: 64,
              bgcolor: "primary.main",
              fontSize: 32,
            }}
          >
            {initials}
          </Avatar>
          <Box flex={1} minWidth={0}>
            <Typography
              variant="h5"
              fontWeight={700}
              color="primary.dark"
              noWrap
            >
              {intern.name}
            </Typography>
            <Stack direction="row" spacing={1} alignItems="center" mt={0.5}>
              <EmailIcon fontSize="small" color="action" />
              <Typography variant="body2" color="text.secondary" noWrap>
                {intern.email}
              </Typography>
            </Stack>
            <Stack direction="row" spacing={1} alignItems="center" mt={0.5}>
              <CalendarMonthIcon fontSize="small" color="action" />
              <Typography variant="body2" color="text.secondary">
                Joined: {new Date(intern.joined_date).toLocaleDateString()}
              </Typography>
            </Stack>
          </Box>
        </Stack>
        {intern.profile && (
          <Stack spacing={1} mt={2}>
            <Typography
              variant="subtitle2"
              fontWeight={600}
              color="primary.main"
            >
              Bio
            </Typography>
            <Typography variant="body2" color="text.secondary">
              {intern.profile.bio}
            </Typography>
            <Stack direction="row" spacing={1} alignItems="center">
              <LinkedInIcon fontSize="small" color="primary" />
              <Link
                href={intern.profile.linkedin}
                target="_blank"
                rel="noopener"
                underline="hover"
                color="primary"
                sx={{
                  px: 1,
                  py: 0.5,
                  borderRadius: 1,
                  transition: "background 0.2s",
                  "&:hover": { background: "#e3f2fd" },
                  maxWidth: { xs: "140px", sm: "200px" },
                  overflow: "hidden",
                  textOverflow: "ellipsis",
                  whiteSpace: "nowrap",
                  display: "inline-block",
                  verticalAlign: "bottom",
                }}
                title={intern.profile.linkedin}
              >
                {intern.profile.linkedin.replace(/^https?:\/\//, "")}
              </Link>
            </Stack>
          </Stack>
        )}
      </CardContent>
      <Box
        sx={{
          position: "absolute",
          right: 24,
          bottom: 24,
          zIndex: 2,
        }}
        display="flex"
        justifyContent="flex-end"
        alignItems="center"
      >
        <a
          href={`/interns/${intern.id}/tasks`}
          style={{ textDecoration: "none" }}
        >
          <button
            style={{
              background: "#1976d2",
              color: "#fff",
              border: "none",
              borderRadius: 6,
              padding: "8px 20px",
              fontWeight: 600,
              fontSize: 16,
              cursor: "pointer",
              boxShadow: "0 2px 8px rgba(25, 118, 210, 0.08)",
              transition: "background 0.2s",
            }}
            onMouseOver={(e) => (e.currentTarget.style.background = "#1565c0")}
            onMouseOut={(e) => (e.currentTarget.style.background = "#1976d2")}
          >
            View Tasks
          </button>
        </a>
      </Box>
    </Card>
  );
}
