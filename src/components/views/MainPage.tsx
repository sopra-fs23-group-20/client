import { useEffect, useState } from "react";
import { api, handleError } from "helpers/api";
import { Spinner } from "components/ui/Spinner";
import { Button } from "components/ui/Button";
import { useHistory } from "react-router-dom";
import BaseContainer from "components/ui/BaseContainer";
import PropTypes from "prop-types";
import "styles/views/Game.scss";
import User from "models/User";
import React from "react";
import { AxiosError } from "axios";

const MainPage: React.FC = () => {
  const history = useHistory();

  const [users, setUsers] = useState<User[] | null>(null);
  const [currentUser, setCurrentUser] = useState<User | null>(null);

  const makeOffline = async (): Promise<void> => {
    try {
      const userId = localStorage.getItem("id");
      const response = await api.put(
        `/users/${userId}`,
        {
          username: currentUser?.username,
          birthday: currentUser?.birthday,
          status: "OFFLINE",
        },
        { headers: { Authorization: localStorage.getItem("token") ?? "" } }
      );

      localStorage.removeItem("token");
      localStorage.removeItem("id");
      history.push("/login");
    } catch (error) {
      console.error(error);
      localStorage.removeItem("token");
      localStorage.removeItem("id");
      history.push("/login");
    }
  };

  const createGame = async (): Promise<void> => {
    try {
      const response = await api.post("/games", {
        username: currentUser?.username,
      });

      const gameId = response.data.id;

      // Redirect the user to the game page
      history.push(`/game/lobby/${gameId}`);
    } catch (error) {
      console.error(error);
      localStorage.removeItem("token");
      localStorage.removeItem("id");
      history.push("/login");
    }
  };

  const logout = (): void => {
    makeOffline();
  };

  interface PlayerProps {
    user: User;
  }

  const Player = ({ user }: PlayerProps): JSX.Element => (
    <div className="player container">
      <div className="player username">
        <Button onClick={() => history.push(`/game/profile/${user.id}`)}>
          <span style={{ color: "MediumAquaMarine", fontWeight: 800 }}>
            {user.username}{" "}
          </span>
        </Button>
      </div>
    </div>
  );

  Player.propTypes = {
    user: PropTypes.object,
  };

  useEffect(() => {
    async function fetchData(): Promise<void> {
      try {
        const response = await api.get("/users", {
          headers: {
            Authorization: localStorage.getItem("token")!,
          },
        });

        setUsers(response.data);
      } catch (error: AxiosError | any) {
        alert(error.response.data.message);
        localStorage.removeItem("token");
        localStorage.removeItem("id");
        history.push("/register");
        console.error(error);
      }
    }
    fetchData();
  }, []);

  useEffect(() => {
    async function fetchUser(): Promise<void> {
      try {
        let id = localStorage.getItem("id");

        const response = await api.get(`/users/${id}`, {
          headers: {
            Authorization: localStorage.getItem("token")!,
          },
        });

        setCurrentUser(response.data);
      } catch (error) {
        localStorage.removeItem("token");
        localStorage.removeItem("id");
        history.push("/register");
        console.error(error);
      }
    }
    fetchUser();
  }, []);

  const goToSettings = async (): Promise<void> => {
    history.push(`/game/profile/${currentUser?.id}`);
  };

  let content = <div></div>;

  if (users) {
    content = (
      <div className="game">
        <ul className="game user-list">
          {users.map((user) => (
            <Player user={user} key={user.id} />
          ))}
        </ul>
        <div>
          <Button
            width="40%"
            onClick={() => logout()}
            style={{
              fontWeight: 800,
              color: "White",
            }}
          >
            Logout
          </Button>
          <Button
            width="40%"
            onClick={() => goToSettings()}
            style={{
              marginLeft: "10px",
              fontWeight: 800,
              color: "White",
            }}
          >
            Settings
          </Button>
          <Button
            width="100%"
            onClick={() => history.push("/game/countries")}
            style={{
              marginTop: "10px",
              fontWeight: 800,
              color: "White",
            }}
          >
            Checkout all Countries
          </Button>
          <Button
            width="100%"
            onClick={() => createGame()}
            style={{
              marginTop: "10px",
              fontWeight: 800,
              color: "White",
            }}
          >
            Start a new Game
          </Button>
        </div>
      </div>
    );
  }

  let usercontent = <p>You aren't logged in</p>;

  if (currentUser) {
    usercontent = (
      <p>
        You are currently logged in as:{" "}
        <span style={{ color: "MediumAquaMarine", fontWeight: 800 }}>
          {currentUser.username}
        </span>
      </p>
    );
  }

  return (
    <BaseContainer className="game container">
      <h1>Users Overview</h1>
      {usercontent}
      <p>Click on users to see their details</p>
      {content}
    </BaseContainer>
  );
};

export default MainPage;
