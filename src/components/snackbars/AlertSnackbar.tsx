import { Alert, AlertColor, Snackbar, SnackbarOrigin } from "@mui/material";

interface Props {
  SnackbarConfig: {
    show: boolean;
    color: AlertColor;
    text: string;
    anchorOrigin: SnackbarOrigin;
    autoHideDuration: number;
    onClose: () => void;
  };
}

const AlertSnackbar = (prop: Props) => {
  return (
    <Snackbar
      open={prop.SnackbarConfig.show}
      autoHideDuration={prop.SnackbarConfig.autoHideDuration}
      anchorOrigin={prop.SnackbarConfig.anchorOrigin}
      onClose={prop.SnackbarConfig.onClose}
    >
      <Alert
        severity={prop.SnackbarConfig.color}
        variant="filled"
        sx={{ width: "100%" }}
      >
        {prop.SnackbarConfig.text}
      </Alert>
    </Snackbar>
  );
};

export default AlertSnackbar;
