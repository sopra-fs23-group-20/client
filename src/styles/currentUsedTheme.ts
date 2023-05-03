import { createTheme } from "@mui/material/styles";

const randomPosition = () => {
  const x = Math.floor(Math.random() * 100);
  const y = Math.floor(Math.random() * 100);
  return `${x}% ${y}%`;
};

const currentUsedTheme = createTheme({
  palette: {
    mode: "dark",
    primary: {
      main: "#90caf9",
      contrastText: "#000",
    },
    secondary: {
      main: "#f48fb1",
      contrastText: "#000",
    },
    background: {
      default: `linear-gradient(rgba(0, 0, 0, 0.8), rgba(0, 0, 0, 0.8)), url(${require("../components/views/images/wallpaper1.png")}) fixed ${randomPosition()}`,
      paper: "#1f1f1f",
    },

    text: {
      primary: "#e0e0e0",
      secondary: "#b3b3b3",
      disabled: "#757575",
    },
    divider: "rgba(255, 255, 255, 0.12)",
    action: {
      active: "#ffffff",
      hover: "rgba(255, 255, 255, 0.08)",
      selected: "rgba(255, 255, 255, 0.16)",
      disabled: "rgba(255, 255, 255, 0.3)",
      disabledBackground: "rgba(255, 255, 255, 0.12)",
    },
  },
  typography: {
    fontFamily: "Roboto, Arial, sans-serif",
    h1: {
      fontSize: "3rem",
      fontWeight: 500,
    },
    h2: {
      fontSize: "2.5rem",
      fontWeight: 500,
    },
    h3: {
      fontSize: "2rem",
      fontWeight: 500,
    },
    h4: {
      fontSize: "1.5rem",
      fontWeight: 500,
    },
    h5: {
      fontSize: "1.25rem",
      fontWeight: 500,
    },
    h6: {
      fontSize: "1rem",
      fontWeight: 500,
    },
    body1: {
      fontSize: "1rem",
    },
    body2: {
      fontSize: "0.875rem",
    },
  },
  shape: {
    borderRadius: 8, // Slightly rounded corners for a modern look
  },
  components: {
    MuiButton: {
      styleOverrides: {
        root: {
          textTransform: "none",
        },
      },
    },
    MuiPaper: {
      styleOverrides: {
        root: {
          padding: "20px",
          borderRadius: "10px",
        },
      },
    },
    MuiAppBar: {
      styleOverrides: {
        root: {
          boxShadow: "none",
        },
      },
    },
    MuiTooltip: {
      styleOverrides: {
        tooltip: {
          backgroundColor: "#1f1f1f",
          color: "#e0e0e0",
          fontSize: "0.875rem",
          fontWeight: "400",
        },
      },
    },
  },
});

export default currentUsedTheme;
