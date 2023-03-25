import { useEffect, useState } from "react";
import { api, handleError } from "helpers/api";
import { useNavigate } from "react-router-dom";
import React from "react";
import Country from "models/Country";
import CountryContainer from "components/ui/CountryContainer";
import {
  Container,
  Typography,
  Box,
  List,
  ListItem,
  Grid,
} from "@mui/material";
import Button from "@mui/material/Button";

const CountriesOverview: React.FC = () => {
  const navigate = useNavigate();

  const [countries, setCountries] = useState<Country[] | null>(null);
  const [outlines, setOutlines] = useState<String[] | null>(null);

  useEffect(() => {
    async function getCountries(): Promise<void> {
      try {
        const response = await api.get("/countries");
        console.log(response.data);
        if (response.data.length != 0) {
          setCountries(response.data);
          setOutlines(response.data.map((country: any) => country.outline));
        }
      } catch (error) {
        console.error(error);
      }
    }
    getCountries();
  }, []);

  async function createCountries(): Promise<void> {
    try {
      const response = await api.post("/countries");

      setCountries(response.data);
    } catch (error) {
      console.error(error);
    }
  }

  let content = <div></div>;
  if (countries) {
    content = (
      <Grid container spacing={5}>
        {countries.map((country, index) => (
          <Grid item xs={6} key={index}>
            <List>
              <ListItem>
                <CountryContainer {...country} />
              </ListItem>
            </List>
          </Grid>
        ))}
      </Grid>
    );
  }

  return (
    <Container
      sx={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        marginTop: 4,
      }}
    >
      <Typography variant="h1">Countries Overview</Typography>
      <Button
        sx={{ marginTop: 4 }}
        variant="outlined"
        onClick={() => navigate("/game")}
      >
        Back to Users Overview
      </Button>
      {content}
      <div>
        {countries ? (
          <></>
        ) : (
          <Button onClick={() => createCountries()} sx={{ marginTop: 4 }}>
            Generate All Countries from API
          </Button>
        )}
      </div>
    </Container>
  );
};

export default CountriesOverview;
