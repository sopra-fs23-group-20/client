import React, { useState, useEffect, useCallback } from "react";
import { api, handleError } from "helpers/api";
import User from "models/User";
import { useNavigate } from "react-router-dom";
import {
  Box,
  Button,
  Typography,
  InputAdornment,
  IconButton,
  Grid,
  CircularProgress,
  TextField,
} from "@mui/material";
import { AxiosError } from "axios";
import { FiEye, FiEyeOff } from "react-icons/fi";
import { useFormik } from "formik";
import * as Yup from "yup";
import { styled } from "@mui/system";
import "../../styles/appNameEffect.css";
import { useAlert } from "helpers/AlertContext";

/**
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
 */

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
    "linear-gradient(90deg, #3498DB 0%, #21618C 10%, #186A3B 25%, #239B56 40%, #B3B6B7 55%, #F4F6F7 70%, #C39BD3 85%, #3498DB 100%)",
  backgroundSize: "200% 200%",
  animation: "textShimmer 6s linear infinite",
});

const LoginForm = styled(Box)(({ theme }) => ({
  padding: theme.spacing(4),
  borderRadius: theme.shape.borderRadius,
  boxShadow: (theme.shadows as any)[4],
  backgroundColor: theme.palette.background.paper,
}));

const validationSchema = Yup.object({
  username: Yup.string().required("Username is required"),
  password: Yup.string().required("Password is required"),
});

const Login: React.FC = () => {
  const navigate = useNavigate();

  const [loading, setLoading] = useState(false);
  const [username, setUsername] = useState<string | null>(null);
  const [password, setPassword] = useState<string | null>(null);
  const [showPassword, setShowPassword] = useState(false);
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
      doLogin();
    },
  });

  const doLogin = useCallback(async () => {
    setLoading(true);
    try {
      const requestBody = JSON.stringify({
        username: formik.values.username,
        password: formik.values.password,
      });
      const response = await api.post("/users/login", requestBody);

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

      navigate(`/game`);
    } catch (error: AxiosError | any) {
      setLoading(false);
      showAlert(
        `Something went wrong during the login: \n${handleError(error)}`,
        "error"
      );
    }
  }, [formik.values.username, formik.values.password, navigate]);

  useEffect(() => {
    const listener = (event: Event) => {
      if (
        (event as unknown as KeyboardEvent).code === "Enter" ||
        (event as unknown as KeyboardEvent).code === "NumpadEnter"
      ) {
        event.preventDefault();
        if (password && username) {
          doLogin();
        }
      }
    };

    document.addEventListener("keydown", listener);

    return () => {
      document.removeEventListener("keydown", listener);
    };
  }, [password, username, doLogin]);
  return (
    <StyledContainer>
      <Box className="appNameEffect">
        <AppName style={{}}>Guess The Country</AppName>
      </Box>
      <LoginForm>
        <Typography variant="h4" gutterBottom>
          Login to your account
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
              size="large"
              fullWidth
              variant="contained"
              disabled={!(formik.isValid && formik.dirty) || loading}
              type="submit"
              sx={{
                backgroundColor: "primary.main",
                color: "primary.contrastText",
                marginTop: 2,
              }}
            >
              {loading ? <CircularProgress size={24} /> : "Login"}
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
          <Typography variant="h5">New User? </Typography>
          <Button
            size="large"
            sx={{
              marginLeft: 2,
              backgroundColor: "primary.main",
              color: "primary.contrastText",
            }}
            variant="contained"
            onClick={() => navigate("/register")}
          >
            Register
          </Button>
        </Box>
      </LoginForm>
    </StyledContainer>
  );
};
export default Login;
