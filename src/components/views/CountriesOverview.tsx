import { useEffect, useState } from "react";
import { api, handleError } from "helpers/api";
import { Spinner } from "components/ui/Spinner";
import { Button } from "components/ui/Button";
import { useNavigate } from "react-router-dom";
import BaseContainer from "components/ui/BaseContainer";
import PropTypes from "prop-types";
import "styles/views/Game.scss";
import User from "models/User";
import React from "react";
import { AxiosError } from "axios";
import Country from "models/Country";
import CountryContainer from "components/ui/CountryContainer";
import CountryOutline from "components/ui/CountryOutline";
import { Container } from "@mui/material";

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
      <div className="game">
        <ul className="game user-list">
          {countries.map((country) => (
            <div>
              <CountryContainer {...country} />
            </div>
          ))}
        </ul>
      </div>
    );
  }

  return (
    <Container>
      {content}
      <div>
        <Button
          width="100%"
          onClick={() => navigate("/game")}
          style={{
            fontWeight: 800,
            color: "White",
          }}
        >
          Back to Users Overview
        </Button>
        {countries ? (
          <div></div>
        ) : (
          <Button
            width="100%"
            onClick={() => createCountries()}
            style={{
              fontWeight: 800,
              color: "White",
              marginTop: "10px",
            }}
          >
            Generate All Countries from API
          </Button>
        )}
      </div>
    </Container>
  );
};

export default CountriesOverview;
