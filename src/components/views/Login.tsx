import React, { useState } from 'react';
import { api, handleError } from 'helpers/api';
import User from 'models/User';
import { useHistory } from 'react-router-dom';
import { Button } from 'components/ui/Button';
import 'styles/views/Login.scss';
import BaseContainer from 'components/ui/BaseContainer';
import PropTypes from 'prop-types';
import axios, { AxiosError, AxiosInstance } from 'axios';

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
        value={value ?? ''}
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

const Login: React.FC = () => {
  const history = useHistory();
  const [name, setName] = useState<string | null>(null);
  const [username, setUsername] = useState<string | null>(null);

  const doLogin = async () => {
    try {

      const requestBody = JSON.stringify({ username, name });
      const response = await api.post('/users', requestBody);
      
      // Get the returned user and update a new object.
      const user = new User(response.data);
      
      // Store the token into the local storage.
      if(user.token){
        localStorage.setItem('token', user.token);
      }else{
        localStorage.setItem('token', " ");
      }

      // Login successfully worked --> navigate to the route /game in the GameRouter
      history.push(`/game`);
    } catch (error: AxiosError | any) {
      
      alert(`Something went wrong during the login: \n${handleError(error)}`);
    }
  };

  return (
    <BaseContainer>
      <div className="login container">
        <div className="login form">
          <FormField
            label="Username"
            value={username ?? ''}
            onChange={(un) => setUsername(un)}
          />
          <FormField
            label="Name"
            value={name ?? ''}
            onChange={(n) => setName(n)}
          />
          <div className="login button-container">
            <Button
              disabled={!username || !name}
              width="100%"
              onClick={() => doLogin()}
            >
              Login
            </Button>
          </div>
        </div>
      </div>
    </BaseContainer>
  );
};

export default Login;
