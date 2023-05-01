import React, { useState } from "react";
import {
  TextField,
  List,
  ListItem,
  ListItemText,
  Button,
  Container,
  Typography,
  Box,
  Slide,
  Table,
  TableHead,
  TableRow,
  TableCell,
} from "@mui/material";
import { api } from "helpers/api";
import User from "models/User";
import { useNavigate } from "react-router-dom";
import useTypewriter from "react-typewriter-hook";
import KeyboardArrowLeftIcon from "@mui/icons-material/KeyboardArrowLeft";

const Friends = () => {
  const navigate = useNavigate();
  const [searchInput, setSearchInput] = useState("");
  const [searchResults, setSearchResults] = useState<User | null>(null);
  const [searchPerformed, setSearchPerformed] = useState(false);
  const typewriterText = useTypewriter("Add a User");

  const handleSearchInputChange = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    setSearchInput(event.target.value);
  };

  const searchUserByUsername = async () => {
    try {
      const response = await api.get(`/users/search/${searchInput}`);
      const user = response.data;
      if (user) {
        setSearchResults(user);
      } else {
        setSearchResults(null);
      }
      setSearchPerformed(true);
    } catch (error) {
      console.error(error);
    }
  };

  const handleSearchSubmit = (event: React.FormEvent) => {
    event.preventDefault();
    searchUserByUsername();
  };

  return (
    <Container
      sx={{
        marginTop: "10vh",
      }}
    >
      <Typography
        variant="h1"
        sx={{
          textShadow: "2px 2px 4px rgba(0, 0, 0, 0.25)",
          minHeight: "56px",
          textAlign: "center",
          marginBottom: 4,
        }}
      >
        {typewriterText}
      </Typography>
      <Box sx={{ display: "flex", justifyContent: "center" }}>
        <Button
          sx={{ mb: 4 }}
          variant="outlined"
          size="small"
          color="error"
          startIcon={<KeyboardArrowLeftIcon />}
          onClick={() => navigate("/game/")}
        >
          Back to Dashboard
        </Button>
      </Box>
      <Box
        sx={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          width: "100%",
          marginBottom: 4,
        }}
      >
        <form onSubmit={handleSearchSubmit}>
          <TextField
            label="Search User"
            value={searchInput}
            onChange={handleSearchInputChange}
            variant="outlined"
            sx={{ marginBottom: 2 }}
          />
          <Button
            type="submit"
            variant="contained"
            color="success"
            sx={{ position: "relative", right: "-16px", top: "19px" }}
          >
            Search
          </Button>
        </form>
        <Box component="div" sx={{ width: "100%", overflowX: "auto" }}>
          {searchResults && (
            <React.Fragment>
              <Table sx={{ width: "100%" }} aria-label="simple table">
                <TableHead>
                  <TableRow>
                    <TableCell>Username</TableCell>
                    <TableCell>Status</TableCell>
                    <TableCell align="right">Add Friend</TableCell>
                  </TableRow>
                </TableHead>
                <TableRow>
                  <TableCell>{searchResults.username}</TableCell>
                  <TableCell>{searchResults.status}</TableCell>
                  <TableCell align="right">
                    <Button
                      type="submit"
                      variant="contained"
                      color="success"
                      sx={{ marginLeft: 2 }}
                    >
                      Add Friend
                    </Button>
                  </TableCell>
                </TableRow>
              </Table>
            </React.Fragment>
          )}
        </Box>

        {searchPerformed && searchResults === null && (
          <Typography variant="subtitle1" color="error">
            No user found with such username.
          </Typography>
        )}
      </Box>
    </Container>
  );
};

export default Friends;
