import React, { useState, useEffect, useCallback } from "react";
import { api, handleError } from "helpers/api";
import User from "models/User";
import { useLocation, useNavigate } from "react-router-dom";
import InfoIcon from "@mui/icons-material/Info";
import {
  Button,
  Typography,
  InputAdornment,
  IconButton,
  Grid,
  CircularProgress,
  TextField,
  Tooltip,
} from "@mui/material";
import { AxiosError } from "axios";
import { Container } from "@mui/system";
import Box from "@mui/material/Box";
import { FiEye, FiEyeOff } from "react-icons/fi";
import Logo from "./images/GTCText.png";
import { useFormik } from "formik";
import * as Yup from "yup";
import { styled } from "@mui/system";

const StyledContainer = styled(Container)(() => ({
  display: "flex",
  flexDirection: "column",
  alignItems: "center",
  justifyContent: "center",
  height: "100vh",
  width: "100vw",
  backgroundPosition: "center",
  backgroundRepeat: "no-repeat",
  backgroundSize: "cover",
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

  const [loading, setLoading] = useState(false);
  const [username, setUsername] = useState<string | null>(null);
  const [password, setPassword] = useState<string | null>(null);
  const [showPassword, setShowPassword] = useState(false);

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
    setLoading(true);
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
      setLoading(false);
      alert(
        `Something went wrong during the registration phase: \n${handleError(
          error
        )}`
      );
    }
  }, [formik.values.username, formik.values.password, navigate]);

  const doGuestRegister = async () => {
    setLoading(true);
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
      setLoading(false);
      alert(
        `Something went wrong during the registration phase: \n${handleError(
          error
        )}`
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
      <img src={Logo} alt="Logo" style={{ marginBottom: "2rem" }} />
      <Box
        component="span"
        sx={{
          p: 2,
          border: 1,
          borderColor: "divider",
          borderRadius: 2,
          backgroundColor: "background.paper",
        }}
      >
        <Typography
          variant="h1"
          style={{ fontFamily: "'Roboto Slab', serif", marginBottom: "25px" }}
        >
          Register a new account
        </Typography>

        <form onSubmit={formik.handleSubmit}>
          <Grid container spacing={2}>
            <Grid item xs={12}>
              <Typography
                variant="h3"
                style={{ fontFamily: "'Roboto Slab', serif" }}
              >
                Username
              </Typography>
              <TextField
                fullWidth
                id="username"
                name="username"
                variant="outlined"
                value={formik.values.username}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                error={formik.touched.username && !!formik.errors.username}
                helperText={formik.touched.username && formik.errors.username}
              />
            </Grid>
            <Grid item xs={12}>
              <Typography
                variant="h3"
                style={{ fontFamily: "'Roboto Slab', serif" }}
              >
                Password
              </Typography>

              <TextField
                fullWidth
                id="password"
                name="password"
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
          <Box
            sx={{
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              marginTop: 2,
            }}
          >
            <Button
              fullWidth
              id="regular-register"
              variant="contained"
              disabled={!(formik.isValid && formik.dirty) || loading}
              type="submit"
              sx={{ backgroundColor: "#D5E5F5", color: "#333" }}
            >
              {loading ? <CircularProgress size={24} /> : "Register"}
            </Button>
          </Box>
          <Box
            sx={{
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              marginTop: 2,
            }}
          >
            <Button
              fullWidth
              variant="contained"
              type="submit"
              id="guest-register"
              onClick={doGuestRegister}
              sx={{ backgroundColor: "#D5E5F5", color: "#333" }}
            >
              {loading ? <CircularProgress size={24} /> : "Guest Register"}
            </Button>
          </Box>
        </form>
        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            marginTop: 2,
          }}
        >
          <Typography
            variant="h5"
            style={{ fontFamily: "'Roboto Slab', serif" }}
          >
            Already Registered?{" "}
          </Typography>
          <Button
            sx={{ marginLeft: 2, backgroundColor: "#D5E5F5", color: "#333" }}
            variant="contained"
            onClick={() => navigate("/login")}
          >
            Login
          </Button>
        </Box>
      </Box>
    </StyledContainer>
  );
};

export default Register;
