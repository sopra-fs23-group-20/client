import React, { useState, useEffect } from "react";
import { api, handleError } from "helpers/api";
import User from "models/User";
import { useNavigate } from "react-router-dom";
import { Button } from "components/ui/Button";
import "styles/views/Login.scss";
import BaseContainer from "components/ui/BaseContainer";
import PropTypes from "prop-types";
import "styles/views/Profile.scss";
import { Spinner } from "components/ui/Spinner";
import { AxiosError } from "axios";

const Profile: React.FC = () => {
  const id = window.location.pathname.split("/").pop();
  const navigate = useNavigate();
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [editMode, setEditMode] = useState<boolean>(false);

  const [username, setUsername] = useState<string | null>(null);
  const [birthday, setBirthday] = useState<Date | null>(null);

  const saveChanges = async () => {
    try {
      console.log("Updating User");
      let requestBody = {
        username: username,
        birthday: birthday,
        status: "ONLINE",
      };
      console.log(" The Request Body is: ", requestBody);
      const response = await api.put(`/users/${id}`, requestBody, {
        headers: { Authorization: localStorage.getItem("token")! },
      });

      setEditMode(false);
      const copyCurrentUser = { ...currentUser! };
      copyCurrentUser.username = username!;
      copyCurrentUser.birthday = birthday!;
      setCurrentUser(copyCurrentUser);
    } catch (error: AxiosError | any) {
      alert(error.response.data.message);
      currentUser ? setUsername(currentUser.username) : setUsername(null);
      currentUser ? setBirthday(currentUser.birthday) : setBirthday(null);
      setEditMode(false);
    }
  };

  useEffect(() => {
    async function fetchUser() {
      try {
        //make an API get request with /users/:id
        const response = await api.get(`/users/${id}`, {
          headers: { Authorization: localStorage.getItem("token")! },
        });

        setCurrentUser(response.data);
        setUsername(response.data.username);
        response.data.birthday
          ? setBirthday(new Date(response.data.birthday))
          : setBirthday(null);
      } catch (error: AxiosError | any) {
        //look for error code 404 and go back to main page
        if (error.response.status === 404) {
          alert(error.response.data.message);
          navigate("/game");
        } else {
          alert(error.response.data.message);
          localStorage.removeItem("token");
          localStorage.removeItem("id");
          navigate("/register");
          console.error(error);
        }
      }
    }

    fetchUser();
  }, []);

  let content = <div></div>;

  if (editMode && currentUser) {
    content = (
      <div>
        <h2>
          Username:
          <input
            type="text"
            className="text-input-field"
            value={username!}
            onChange={(e) => setUsername(e.target.value)}
          />
        </h2>
        <h2>Status: {currentUser.status}</h2>
        <h2>
          Creation Date:{" "}
          {new Date(currentUser.creation_date!).toLocaleDateString("de-DE", {
            day: "2-digit",
            month: "2-digit",
            year: "numeric",
          })}
        </h2>
        <h2>
          <form>
            <label>
              Birthday:
              <input
                type="date"
                name="date"
                value={
                  birthday ? new Date(birthday).toISOString().slice(0, 10) : ""
                }
                onChange={(e) =>
                  e.target.value
                    ? setBirthday(new Date(e.target.value))
                    : setBirthday(null)
                }
              />
            </label>
          </form>
        </h2>
        {String(localStorage.getItem("id")) === String(currentUser.id) ? (
          <div>
            <Button
              onClick={() => {
                setUsername(currentUser.username);
                setBirthday(new Date(currentUser.birthday!));
                setEditMode(false);
              }}
              style={{ color: "white" }}
            >
              Discard
            </Button>
            <Button
              disabled={!username}
              onClick={() => saveChanges()}
              style={{ marginLeft: "10px", color: "white" }}
            >
              Save
            </Button>
          </div>
        ) : (
          <div></div>
        )}
      </div>
    );
  }

  if (currentUser && !editMode) {
    content = (
      <div>
        <h2>
          Username:{" "}
          <span style={{ color: "MediumAquaMarine" }}>
            {currentUser.username}
          </span>
        </h2>
        <h2>Status: {currentUser.status}</h2>
        <h2>
          Creation Date:{" "}
          {new Date(currentUser.creation_date!).toLocaleDateString("de-DE", {
            day: "2-digit",
            month: "2-digit",
            year: "numeric",
          })}
        </h2>
        {currentUser.birthday ? (
          <h2>
            Birthday:{" "}
            {new Date(currentUser.birthday).toLocaleDateString("de-DE", {
              day: "2-digit",
              month: "2-digit",
              year: "numeric",
            })}
          </h2>
        ) : (
          <div></div>
        )}
        {String(localStorage.getItem("id")) === String(currentUser.id) ? (
          <div>
            <Button
              onClick={() => setEditMode(true)}
              style={{ color: "white" }}
            >
              Edit your Profile
            </Button>
            <Button
              onClick={() => navigate("/game")}
              style={{ marginLeft: "10px", color: "white" }}
            >
              Back to Users Overview
            </Button>
          </div>
        ) : (
          <Button onClick={() => navigate("/game")} style={{ color: "white" }}>
            Back to Users Overview
          </Button>
        )}
      </div>
    );
  }
  return <BaseContainer className="game container">{content}</BaseContainer>;
};

export default Profile;
