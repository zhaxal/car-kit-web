import {
  Alert,
  AlertColor,
  Snackbar,
  SnackbarCloseReason,
} from "@mui/material";

import {
  createContext,
  useState,
  useContext,
  ReactNode,
  SyntheticEvent,
} from "react";

type SnackbarProviderProps = {
  children: ReactNode;
};

const SnackbarContext = createContext({
  updateSnackbar: async (
    state: boolean,
    severity: AlertColor,
    message: string
  ) => {},
});

export const useSnackbar = () => {
  return useContext(SnackbarContext);
};

export const SnackbarProvider = ({ children }: SnackbarProviderProps) => {
  const [open, setOpen] = useState(false);
  const [severity, setSeverity] = useState<AlertColor>("info");
  const [message, setMessage] = useState("");

  const updateOpen = (state: boolean) => {
    setOpen(state);
  };
  const handleClose = (
    event: Event | SyntheticEvent<any, Event>,
    reason: SnackbarCloseReason
  ) => {
    if (reason === "clickaway") {
      return;
    }

    updateOpen(false);
  };

  const updateSnackbar = async (
    state: boolean,
    severity: AlertColor,
    message: string
  ) => {
    setSeverity(severity);
    setMessage(message);
    setOpen(state);
  };

  const value = {
    updateSnackbar,
  };

  return (
    <SnackbarContext.Provider value={value}>
      {children}
      <Snackbar open={open} autoHideDuration={6000} onClose={handleClose}>
        <Alert severity={severity}>{message}</Alert>
      </Snackbar>
    </SnackbarContext.Provider>
  );
};
