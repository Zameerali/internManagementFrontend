import { Snackbar, Alert } from "@mui/material";
import type { AlertColor } from "@mui/material/Alert";

interface SnackbarProps {
  open: boolean;
  onClose: () => void;
  message: string;
  severity: AlertColor;
  autoHideDuration?: number;
}

const CustomSnackbar: React.FC<SnackbarProps> = ({
  open,
  onClose,
  message,
  severity,
  autoHideDuration = 6000,
}) => {
  return (

    <Snackbar
      open={open}
      autoHideDuration={autoHideDuration}
      onClose={onClose}
      anchorOrigin={{ vertical: "bottom", horizontal: "center" }}
    >
      <Alert onClose={onClose} severity={severity} sx={{ width: "100%" }}>
        {message}
      </Alert>
      
    </Snackbar>
  );
};

export default CustomSnackbar;
