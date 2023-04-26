import React, { useState, useEffect, useCallback } from "react";
import { api, handleError } from "helpers/api";
import User from "models/User";
import { useLocation, useNavigate } from "react-router-dom";
import "../../styles/appNameEffect.css";
import {
  Box,
  Button,
  Typography,
  InputAdornment,
  IconButton,
  Grid,
  CircularProgress,
  TextField,
  Alert,
} from "@mui/material";
import { AxiosError } from "axios";
import { FiEye, FiEyeOff } from "react-icons/fi";
import { useFormik } from "formik";
import * as Yup from "yup";
import { styled } from "@mui/system";
import { Snackbar } from "@mui/material";
import { useAlert } from "helpers/AlertContext";

const StyledContainer = styled(Box)(({ theme }) => ({
  display: "flex",
  flexDirection: "column",
  alignItems: "center",
  justifyContent: "center",
  minHeight: "100vh",
  padding: theme.spacing(2),
  backgroundColor: theme.palette.background.default,
}));

const AppName = styled("h1")({
  fontFamily: "'Roboto', sans-serif",
  fontSize: "3.5rem",
  fontWeight: 900,
  backgroundClip: "text",
  WebkitBackgroundClip: "text",
  color: "transparent",
  backgroundImage:
    "linear-gradient(90deg, #F4D03F 0%, #58D68D 15%, #48C9B0 30%, #5DADE2 45%, #8E44AD 60%, #C0392B 75%, #F1C40F 90%)",
  backgroundSize: "200% 200%",
  animation: "textShimmer 6s linear infinite",
});

const RegisterForm = styled(Box)(({ theme }) => ({
  padding: theme.spacing(4),
  borderRadius: theme.shape.borderRadius,
  boxShadow: (theme.shadows as any)[4],
  backgroundColor: theme.palette.background.paper,
}));

const validationSchema = Yup.object({
  username: Yup.string().required("Username is required"),
  password: Yup.string().required("Password is required"),
});

const Register: React.FC = () => {
  const navigate = useNavigate();
  const currentLocation = useLocation();
  const searchParams = new URLSearchParams(currentLocation.search);
  const redirectUrl = searchParams.get("redirect") || "/";

  const [username, setUsername] = useState<string | null>(null);
  const [password, setPassword] = useState<string | null>(null);
  const [showPassword, setShowPassword] = useState(false);
  const [loadingRegular, setLoadingRegular] = useState(false);
  const [loadingGuest, setLoadingGuest] = useState(false);

  const { showAlert } = useAlert();

  const handlePasswordToggle = () => {
    setShowPassword(!showPassword);
  };

  const formik = useFormik({
    initialValues: {
      username: "",
      password: "",
    },
    validationSchema: validationSchema,
    onSubmit: (values) => {
      setUsername(values.username);
      setPassword(values.password);
      doRegister();
    },
  });

  const doRegister = useCallback(async () => {
    setLoadingRegular(true);
    try {
      const requestBody = JSON.stringify({
        username: formik.values.username,
        password: formik.values.password,
      });
      const response = await api.post("/users", requestBody);

      const user = new User(response.data);

      if (user.id) {
        localStorage.setItem("userId", user.id.toString());
      }

      if (response.headers.authorization) {
        localStorage.setItem("token", response.headers.authorization);
      } else {
        throw new Error("No token received");
      }
      if (user.id) {
        localStorage.setItem("id", user.id.toString());
      } else {
        throw new Error("No id received");
      }

      navigate(decodeURIComponent(redirectUrl));
    } catch (error: AxiosError | any) {
      setLoadingRegular(false);
      showAlert(
        `Something went wrong during the registration phase: \n${handleError(
          error
        )}`,
        "error"
      );
    }
  }, [formik.values.username, formik.values.password, navigate]);

  const doGuestRegister = async () => {
    setLoadingGuest(true);
    const usernameGuest = "Guest_" + Math.floor(Math.random() * 1000000);
    const passwordGuest = "Guest_" + Math.floor(Math.random() * 1000000);
    try {
      const requestBody = JSON.stringify({
        username: usernameGuest,
        password: passwordGuest,
      });
      const response = await api.post("/users", requestBody);

      const user = new User(response.data);

      if (user.id) {
        localStorage.setItem("userId", user.id.toString());
      }

      if (response.headers.authorization) {
        localStorage.setItem("token", response.headers.authorization);
      } else {
        throw new Error("No token received");
      }
      if (user.id) {
        localStorage.setItem("id", user.id.toString());
      } else {
        throw new Error("No id received");
      }

      navigate(decodeURIComponent(redirectUrl));
    } catch (error: AxiosError | any) {
      setLoadingGuest(false);
      showAlert(
        `Something went wrong during the registration phase: \n${handleError(
          error
        )}`,
        "error"
      );
    }
  };

  useEffect(() => {
    const listener = (event: Event) => {
      if (
        (event as unknown as KeyboardEvent).code === "Enter" ||
        (event as unknown as KeyboardEvent).code === "NumpadEnter"
      ) {
        event.preventDefault();
        if (password && username) {
          doRegister();
        }
      }
    };

    document.addEventListener("keydown", listener);

    return () => {
      document.removeEventListener("keydown", listener);
    };
  }, [formik.values.password, formik.values.username, doRegister]);

  return (
    <StyledContainer>
      <Box className="appNameEffect">
        <AppName style={{}}>Guess The Country</AppName>
      </Box>
      <RegisterForm>
        <Typography variant="h4" gutterBottom>
          Register a new account
        </Typography>
        <form onSubmit={formik.handleSubmit}>
          <Grid container spacing={2}>
            <Grid item xs={12}>
              <TextField
                fullWidth
                id="username"
                name="username"
                label="Username"
                variant="outlined"
                value={formik.values.username}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                error={formik.touched.username && !!formik.errors.username}
                helperText={formik.touched.username && formik.errors.username}
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                fullWidth
                id="password"
                name="password"
                label="Password"
                type={showPassword ? "text" : "password"}
                variant="outlined"
                value={formik.values.password}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                error={formik.touched.password && !!formik.errors.password}
                helperText={formik.touched.password && formik.errors.password}
                InputProps={{
                  endAdornment: (
                    <InputAdornment position="end">
                      <IconButton
                        edge="end"
                        aria-label="toggle password visibility"
                        onClick={handlePasswordToggle}
                      >
                        {showPassword ? <FiEyeOff /> : <FiEye />}
                      </IconButton>
                    </InputAdornment>
                  ),
                }}
              />
            </Grid>
          </Grid>
          <Box sx={{ display: "flex", justifyContent: "center", marginTop: 2 }}>
            <Button
              fullWidth
              id="regular-register"
              variant="contained"
              disabled={!(formik.isValid && formik.dirty) || loadingRegular}
              type="submit"
              sx={{
                backgroundColor: "primary.main",
                color: "primary.contrastText",
                marginTop: 2,
              }}
            >
              {loadingRegular ? <CircularProgress size={24} /> : "Register"}
            </Button>
          </Box>
          <Box sx={{ display: "flex", justifyContent: "center" }}>
            <Button
              fullWidth
              variant="contained"
              type="button"
              id="guest-register"
              onClick={() => {
                formik.setErrors({});
                doGuestRegister();
              }}
              sx={{
                backgroundColor: "primary.light",
                color: "primary.contrastText",
                marginTop: 2,
              }}
            >
              {loadingGuest ? (
                <CircularProgress size={24} />
              ) : (
                "Register as Guest"
              )}
            </Button>
          </Box>
        </form>
        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            marginTop: 3,
          }}
        >
          <Typography variant="h5">Already Registered? </Typography>
          <Button
            sx={{
              marginLeft: 2,
              backgroundColor: "primary.main",
              color: "primary.contrastText",
            }}
            variant="contained"
            onClick={() => navigate("/login")}
          >
            Login
          </Button>
        </Box>
      </RegisterForm>
    </StyledContainer>
  );
};

export default Register;
