import { Link, Outlet } from "react-router-dom";
import {
  AppBar,
  Toolbar,
  Typography,
  Button,
  Box,
  Container,
} from "@mui/material";

const navItems = [
  { label: "Interns", path: "/" },
  { label: "Projects", path: "/projects" },
  { label: "Tasks", path: "/tasks" },
];

export default function DashboardLayout() {
  return (
    <Box sx={{ flexGrow: 1 }}>
      <AppBar
        position="fixed"
        color="primary"
        elevation={2}
        className="shadow-md w-full"
        sx={{ width: "100%", zIndex: 1300 }}
      >
        <Toolbar className="flex justify-between w-full" sx={{ width: "100%" }}>
          <Typography
            variant="h6"
            component="div"
            className="font-bold tracking-wide"
          >
            Intern Dashboard
          </Typography>
          <Box className="flex gap-4">
            {navItems.map((item) => (
              <Button
                key={item.path}
                component={Link}
                to={item.path}
                color="inherit"
                className="hover:bg-blue-700 px-4 py-2 rounded transition-colors duration-200"
              >
                {item.label}
              </Button>
            ))}
          </Box>
        </Toolbar>
      </AppBar>
      <Container maxWidth="xl" className="pt-24 pb-8">
        <Outlet />
      </Container>
    </Box>
  );
}
