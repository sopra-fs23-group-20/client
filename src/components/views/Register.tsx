import React, { useState, useEffect, useCallback } from "react";
import { api, handleError } from "helpers/api";
import User from "models/User";
import { useNavigate } from "react-router-dom";
import { Button } from "components/ui/Button";
import "styles/views/Login.scss";
import BaseContainer from "components/ui/BaseContainer";
import PropTypes from "prop-types";
import { AxiosError } from "axios";

interface FormFieldProps {
  label: string;
  value: string | null;
  onChange: (value: string) => void;
}

const FormField: React.FC<FormFieldProps> = ({ label, value, onChange }) => {
  return (
    <div className="login field">
      <label className="login label">{label}</label>
      <input
        className="login input"
        placeholder="enter here.."
        value={value ?? ""}
        onChange={(e) => onChange(e.target.value)}
      />
    </div>
  );
};

const PasswordFormField: React.FC<FormFieldProps> = ({
  label,
  value,
  onChange,
}) => {
  return (
    <div className="login field">
      <label className="login label">{label}</label>
      <input
        type="password"
        className="login input"
        placeholder="enter password..."
        value={value ?? ""}
        onChange={(e) => onChange(e.target.value)}
      />
    </div>
  );
};

FormField.propTypes = {
  label: PropTypes.string.isRequired,
  value: PropTypes.string,
  onChange: PropTypes.func.isRequired,
};

const Register: React.FC = () => {
  const navigate = useNavigate();

  const [username, setUsername] = useState<string | null>(null);
  const [password, setPassword] = useState<string | null>(null);

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
    <BaseContainer>
      <div className="login container">
        <h1>Register a new account</h1>
        <div className="login form">
          <FormField
            label="Username"
            value={username}
            onChange={(un) => setUsername(un)}
          />
          <PasswordFormField
            label="Password"
            value={password}
            onChange={(n) => setPassword(n)}
          />
          <div className="login button-container">
            <Button
              disabled={!username || !password}
              width="100%"
              style={{ fontWeight: 800, color: "white" }}
              onClick={() => doLogin()}
            >
              Register
            </Button>
          </div>
        </div>
      </div>
      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <p>Already a User? </p>
        <br />
        <Button
          onClick={() => navigate(`/login`)}
          style={{
            marginLeft: "10px",
            fontWeight: 800,
            color: "White",
          }}
        >
          Login
        </Button>
      </div>
    </BaseContainer>
  );
};

export default Register;
