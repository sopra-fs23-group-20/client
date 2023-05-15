import React, { createContext, useContext, useState } from "react";
import { Snackbar, Alert as MUIAlert } from "@mui/material";
import { styled } from "@mui/system";

interface AlertContextProps {
  showAlert: (
    message: string,
    severity?: "error" | "success" | "info" | "warning"
  ) => void;
}

const AlertContext = createContext<AlertContextProps>({
  showAlert: () => {},
});

export const useAlert = () => {
  return useContext(AlertContext);
};

export const AlertProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [alertOpen, setAlertOpen] = useState(false);
  const [alertMessage, setAlertMessage] = useState("");
  const [alertSeverity, setAlertSeverity] = useState<
    "error" | "success" | "info" | "warning"
  >("error");

  const StyledSnackbar = styled(Snackbar)({
    zIndex: 10000,
    "& .MuiSnackbar-root": {
      top: "1rem",
    },
  });

  const showAlert = (
    message: string,
    severity: "error" | "success" | "info" | "warning" = "error"
  ) => {
    setAlertMessage(message);
    setAlertSeverity(severity);
    setAlertOpen(true);
  };

  return (
    <AlertContext.Provider value={{ showAlert }}>
      {children}
      <StyledSnackbar
        open={alertOpen}
        autoHideDuration={2500}
        onClose={() => setAlertOpen(false)}
        anchorOrigin={{ vertical: "top", horizontal: "center" }}
      >
        <MUIAlert
          severity={alertSeverity}
          onClose={() => setAlertOpen(false)}
          sx={{ width: "100%" }}
        >
          {alertMessage}
        </MUIAlert>
      </StyledSnackbar>
    </AlertContext.Provider>
  );
};
