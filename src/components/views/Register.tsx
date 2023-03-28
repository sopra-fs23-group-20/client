import React, { useState, useEffect, useCallback } from "react";
import { api, handleError } from "helpers/api";
import User from "models/User";
import { useNavigate } from "react-router-dom";
import {
  Button,
  TextField,
  Typography,
  InputAdornment,
  IconButton, Tooltip,
} from "@mui/material";
import { AxiosError } from "axios";
import { Container } from "@mui/system";
import Box from "@mui/material/Box";
import { FiEye, FiEyeOff } from "react-icons/fi";
import Logo from "./images/GTCText.png";
import InfoIcon from '@mui/icons-material/Info';


interface FormFieldProps {
  label: string;
  value: string | null;
  onChange: (value: string) => void;
}

const Register: React.FC = () => {
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
      const response = await api.post("/users", requestBody);

      const user = new User(response.data);

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
      <img src={Logo} alt="Logo"/>
      <Box component="span" sx={{ p: 2, border: 1 }}>

      <Typography variant="h1">Register a new account</Typography>

      <Typography variant="h3" sx={{ marginTop: 5 }}>
        Username
        <Tooltip title="The username must be unique" placement="top">
          <IconButton>
            <InfoIcon />
          </IconButton>
        </Tooltip>
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
        <Tooltip title="always use a secure password" placement="top">
          <IconButton>
            <InfoIcon />
          </IconButton>
        </Tooltip>
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
        Register
      </Button>
      </Box>
      <Box sx={{ display: "flex", alignItems: "center" }}>
        <Typography variant="h5">Already a User? </Typography>

        <Button
          sx={{ marginLeft: 2 }}
          variant="outlined"
          onClick={() => navigate(`/login`)}
        >
          Login
        </Button>
      </Box>
    </Container>
  );
};

export default Register;
