import React from "react";
import { Link, Outlet, useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import {
  useLogoutMutation,
  useGetMyProfileQuery,
} from "../features/auth/authApi";
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
  Avatar,
  useMediaQuery,
  useTheme,
  Menu,
  MenuItem,
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
  const { data: profile } = useGetMyProfileQuery();

  const handleLogout = async () => {
    try {
      await logoutApi().unwrap();
    } catch {}
    dispatch(logout());
    navigate("/login");
  };
  const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);
  const open = Boolean(anchorEl);
  const handleAvatarClick = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };
  const handleClose = () => {
    setAnchorEl(null);
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
            px: { xs: 1, sm: 1.5, md: 2 },
            py: { xs: 1, sm: 1.25 },
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between", 
            gap: { xs: 1, sm: 1.5 },
          }}
        >
          <Box sx={{ flexShrink: 0, mr: "auto" }}>
            <Typography
              variant="h5"
              sx={{
                fontWeight: 700,
                letterSpacing: 1,
                color: "#fff",
                textShadow: "0 2px 8px rgba(0,0,0,0.12)",
                fontSize: { xs: "1.5rem", sm: "1.75rem" },
              }}
            >
              Intern Dashboard
            </Typography>
          </Box>

          <Box
            sx={{
              display: "flex",
              alignItems: "center",
              justifyContent: "flex-end",
              gap: { xs: 0.75, sm: 1 },
              ml: "auto",
              px: { xs: 1, sm: 2, md: 4, lg: 5 },
            }}
          >
            <Stack
              direction="row"
              spacing={1}
              sx={{ display: { xs: "none", md: "flex" }, alignItems: "center" }}
            >
              {navItems.map((item) => (
                <Button
                  key={item.path}
                  component={Link}
                  to={item.path}
                  color="inherit"
                  sx={{
                    px: { xs: 2, sm: 2.5 },
                    py: 0.75,
                    minHeight: 40,
                    borderRadius: 2,
                    fontWeight: 500,
                    bgcolor: "rgba(255,255,255,0.08)",
                    fontSize: { xs: "0.9rem", sm: "1rem" },
                    boxShadow: 1,
                    color: "#fff",
                    "&:hover": {
                      bgcolor: "rgba(255,255,255,0.18)",
                      color: "#fff",
                    },
                  }}
                >
                  {item.label}
                </Button>
              ))}
            </Stack>
            <IconButton
              onClick={handleAvatarClick}
              sx={{
                p: 0.75,
                minHeight: 40,
                minWidth: { xs: 48, sm: 120 },
                borderRadius: 2,
                display: "flex",
                alignItems: "center",
                gap: 0.75,
              }}
            >
              <Typography
                variant="subtitle2"
                sx={{
                  textDecoration: "underline",
                  color: "#fff",
                  fontWeight: 500,
                  display: { xs: "none", sm: "block" },
                  maxWidth: 80,
                  textOverflow: "ellipsis",
                  overflow: "hidden",
                  whiteSpace: "nowrap",
                  fontSize: { xs: "0.9rem", sm: "1rem" },
                }}
              >
                {profile?.first_name}
              </Typography>
              <Avatar
                src={profile?.image_url}
                alt={profile?.first_name || "U"}
                sx={{
                  width: 32,
                  height: 32,
                  bgcolor: "#2563eb",
                }}
              />
            </IconButton>
            <Menu
              anchorEl={anchorEl}
              open={open}
              onClose={handleClose}
              anchorOrigin={{
                vertical: "bottom",
                horizontal: "right",
              }}
              transformOrigin={{
                vertical: "top",
                horizontal: "right",
              }}
            >
              <MenuItem
                onClick={() => {
                  handleClose();
                  navigate("/profile");
                }}
                sx={{ fontSize: "0.9rem" }}
              >
                Profile
              </MenuItem>
              <MenuItem
                onClick={() => {
                  handleClose();
                  handleLogout();
                }}
                sx={{ fontSize: "0.9rem" }}
              >
                Logout
              </MenuItem>
            </Menu>
            <IconButton
              color="inherit"
              onClick={toggleDrawer}
              sx={{
                display: { xs: "flex", md: "none" },
                p: 0.75,
                minHeight: 40,
                minWidth: 40,
                ml: 0.5,
              }}
              aria-label="open drawer"
            >
              <MenuIcon sx={{ fontSize: 24 }} />
            </IconButton>
          </Box>
        </Toolbar>

        <Collapse in={drawerOpen} timeout="auto" unmountOnExit>
          <Box
            sx={{
              px: 1.5,
              pt: 1,
              pb: 1.5,
              bgcolor: "background.paper",
              borderTop: "1px solid rgba(255,255,255,0.2)",
            }}
          >
            <Stack spacing={1}>
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
                    fontSize: { xs: "0.9rem", sm: "1rem" },
                    py: 0.75,
                    px: 2,
                    minHeight: 40,
                  }}
                >
                  {item.label}
                </Button>
              ))}
            </Stack>
          </Box>
        </Collapse>
      </AppBar>

      <Container
        maxWidth="xl"
        sx={{
          pt: { xs: 9, sm: 10, md: 11 },
          pb: { xs: 2, sm: 3 },
          minHeight: "calc(100vh - 64px)",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          px: { xs: 0, sm: 1 },
        }}
      >
        <Box
          sx={{
            width: "100%",
            maxWidth: "100%",
            mx: 0,
            px: { xs: 0, sm: 1, md: 1.5 },
          }}
        >
          <Outlet />
        </Box>
      </Container>
    </Box>
  );
}
