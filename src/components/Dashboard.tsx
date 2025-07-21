import React from "react";
import { Link, Outlet, useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { useLogoutMutation } from "../features/auth/authApi";
import { logout } from "../features/auth/authSlice";
import {
  AppBar,
  Toolbar,
  Typography,
  Button,
  Box,
  Container,
  Stack,
  IconButton,
  Collapse,
  useMediaQuery,
  useTheme,
} from "@mui/material";
import MenuIcon from "@mui/icons-material/Menu";

export default function DashboardLayout() {
  const [drawerOpen, setDrawerOpen] = React.useState(false);
  const navItems = [
    { label: "Interns", path: "/" },
    { label: "Projects", path: "/projects" },
    { label: "Tasks", path: "/tasks" },
  ];
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("md"));
  const toggleDrawer = () => setDrawerOpen((prev) => !prev);

  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [logoutApi] = useLogoutMutation();

  const handleLogout = async () => {
    try {
      await logoutApi().unwrap();
    } catch {}
    dispatch(logout());
    navigate("/login");
  };

  return (
    <Box
      sx={{ flexGrow: 1, minHeight: "100vh", bgcolor: "background.default" }}
    >
      <AppBar
        position="fixed"
        color="primary"
        elevation={3}
        sx={{
          width: "100%",
          zIndex: 1300,
          boxShadow: 6,
        }}
      >
        <Toolbar
          sx={{
            width: "100%",
            maxWidth: { xs: "100%", sm: "95%", md: "90%", lg: "1200px" },
            mx: "0 auto",
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            px: { xs: 2, sm: 4 },
            py: { xs: 1, sm: 1.5 },
          }}
        >
          <Typography
            variant="h5"
            sx={{
              fontWeight: 700,
              letterSpacing: 2,
              color: "#fff",
              textShadow: "0 2px 8px rgba(0,0,0,0.12)",
            }}
          >
            Intern Dashboard
          </Typography>

          <Box
            sx={{ display: { xs: "none", md: "flex" }, alignItems: "center" }}
          >
            <Stack direction="row" spacing={3}>
              {navItems.map((item) => (
                <Button
                  key={item.path}
                  component={Link}
                  to={item.path}
                  color="inherit"
                  sx={{
                    px: 2.5,
                    py: 1,
                    borderRadius: 2,
                    fontWeight: 500,
                    bgcolor: "rgba(255,255,255,0.08)",
                    fontSize: "1rem",
                    boxShadow: 2,
                    "&:hover": {
                      bgcolor: "rgba(255,255,255,0.18)",
                    },
                  }}
                >
                  {item.label}
                </Button>
              ))}
              <Button
                onClick={handleLogout}
                color="secondary"
                variant="contained"
                sx={{
                  ml: 2,
                  px: 2.5,
                  py: 1,
                  borderRadius: 2,
                  fontWeight: 600,
                  bgcolor: "#ef4444",
                  color: "#fff",
                  boxShadow: 2,
                  fontSize: "1rem",
                  "&:hover": { bgcolor: "#dc2626" },
                }}
              >
                Logout
              </Button>
            </Stack>
          </Box>

          <Box sx={{ display: { xs: "flex", md: "none" } }}>
            <IconButton
              color="inherit"
              onClick={toggleDrawer}
              sx={{ p: 1, mx: 3 }}
              aria-label="open drawer"
            >
              <MenuIcon sx={{ fontSize: 30 }} />
            </IconButton>
          </Box>
        </Toolbar>

        <Collapse in={drawerOpen} timeout="auto" unmountOnExit>
          <Box
            sx={{
              px: 2,
              pt: 1,
              pb: 2,
              bgcolor: "background.paper",
              borderTop: "1px solid rgba(255,255,255,0.2)",
            }}
          >
            <Stack spacing={1.5}>
              {navItems.map((item) => (
                <Button
                  key={item.path}
                  component={Link}
                  to={item.path}
                  onClick={() => setDrawerOpen(false)}
                  color="primary"
                  variant="outlined"
                  fullWidth
                  sx={{
                    textAlign: "left",
                    fontWeight: 500,
                    borderRadius: 2,
                    fontSize: "1rem",
                    py: 1.2,
                    px: 2,
                  }}
                >
                  {item.label}
                </Button>
              ))}
              <Button
                onClick={() => {
                  setDrawerOpen(false);
                  handleLogout();
                }}
                color="secondary"
                variant="contained"
                fullWidth
                sx={{
                  mt: 1,
                  textAlign: "left",
                  fontWeight: 600,
                  borderRadius: 2,
                  fontSize: "1rem",
                  py: 1.2,
                  px: 2,
                  bgcolor: "#ef4444",
                  color: "#fff",
                  boxShadow: 2,
                  "&:hover": { bgcolor: "#dc2626" },
                }}
              >
                Logout
              </Button>
            </Stack>
          </Box>
        </Collapse>
      </AppBar>

      <Container
        maxWidth="xl"
        sx={{
          pt: { xs: 12, sm: 14 },
          pb: { xs: 4, sm: 6 },
          minHeight: "calc(100vh - 64px)",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
        }}
      >
        <Box
          sx={{
            width: "100%",
            maxWidth: {
              xs: "98vw",
              sm: "95vw",
              md: "90vw",
              lg: "1200px",
              xl: "1400px",
            },
            mx: "auto",
            px: { xs: 1, sm: 2, md: 4 },
          }}
        >
          <Outlet />
        </Box>
      </Container>
    </Box>
  );
}
