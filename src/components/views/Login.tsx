import React, { useState, useEffect, useCallback } from "react";
import { api, handleError } from "helpers/api";
import User from "models/User";
import { useNavigate } from "react-router-dom";
import {
  Button,
  TextField,
  Typography,
  InputAdornment,
  IconButton,
} from "@mui/material";
import { AxiosError } from "axios";
import { Container } from "@mui/system";
import Box from "@mui/material/Box";
import { FiEye, FiEyeOff } from "react-icons/fi";

interface FormFieldProps {
  label: string;
  value: string | null;
  onChange: (value: string) => void;
}

const Login: React.FC = () => {
  const navigate = useNavigate();

  const [username, setUsername] = useState<string | null>(null);
  const [password, setPassword] = useState<string | null>(null);
  const [showPassword, setShowPassword] = useState(false);

  const handlePasswordToggle = () => {
    setShowPassword(!showPassword);
  };

  const doLogin = useCallback(async () => {
    try {
      const requestBody = JSON.stringify({ username, password });
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
      alert(`Something went wrong during the login: \n${handleError(error)}`);
    }
  }, [username, password, navigate]);

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
    <Container
      sx={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
      }}
    >
      <Typography variant="h1">Login to your account</Typography>
      <Typography variant="h3" sx={{ marginTop: 5 }}>
        Username
      </Typography>
      <TextField
        value={username}
        size="small"
        placeholder="username"
        sx={{ marginTop: 1 }}
        onChange={(e) => setUsername(e.target.value)}
      />
      <Typography sx={{ marginTop: 3 }} variant="h3">
        Password
      </Typography>
      <TextField
        size="small"
        placeholder="password"
        type={showPassword ? "text" : "password"}
        value={password}
        sx={{ marginTop: 1 }}
        onChange={(e) => setPassword(e.target.value)}
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
      <Button
        sx={{ margin: 3 }}
        variant="outlined"
        disabled={!username || !password}
        onClick={() => doLogin()}
      >
        Login
      </Button>
      <Box sx={{ display: "flex", alignItems: "center" }}>
        <Typography variant="h5">Not yet a User? </Typography>

        <Button
          sx={{ marginLeft: 2 }}
          variant="outlined"
          onClick={() => navigate(`/register`)}
        >
          Register
        </Button>
      </Box>
    </Container>
  );
};

export default Login;
