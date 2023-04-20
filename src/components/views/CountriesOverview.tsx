import {useEffect, useState} from "react";
import {api} from "helpers/api";
import {useNavigate} from "react-router-dom";
import React from "react";
import Country from "models/Country";
import CountryContainer from "components/ui/CountryContainer";
import {Container, Typography, Grid, DialogActions} from "@mui/material";
import Button from "@mui/material/Button";
import KeyboardArrowLeftIcon from "@mui/icons-material/KeyboardArrowLeft";

const CountriesOverview: React.FC = () => {
    const navigate = useNavigate();

    const [countries, setCountries] = useState<Country[] | null>(null);

    useEffect(() => {
        async function getCountries(): Promise<void> {
            try {
                const response = await api.get("/countries");
                console.log(response.data);
                if (response.data.length !== 0) {
                    setCountries(
                        response.data.map(
                            (getCountry: any) =>
                                new Country(
                                    getCountry.name,
                                    getCountry.population,
                                    getCountry.capital,
                                    getCountry.flag,
                                    getCountry.location,
                                    getCountry.outline.outline
                                )
                        )
                    );
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
            <Grid
                container spacing={3}
            >
                <Grid item xs={12}>
                    <div
                        style={{display: "flex", flexDirection: "row", flexWrap: "wrap"}}
                    >
                        {countries.map((country, index) => (
                            <div
                                style={{
                                    flex: "1 1 auto",
                                    minWidth: "600px",
                                    padding: "8px",
                                    backgroundColor: index % 2 ? "#232323" : "#161616",
                                    borderRadius: "20px",
                                    marginBottom: "15px"

                                }}
                            >
                                <CountryContainer {...country} />
                            </div>
                        ))}
                    </div>
                </Grid>
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
            <DialogActions>
                <Button
                    sx={{mb: 4}}
                    variant="outlined"
                    size="small"
                    color="error"
                    startIcon={<KeyboardArrowLeftIcon/>}
                    onClick={() => navigate("/game/")}
                >
                    Back to Dashboard
                </Button>
            </DialogActions>
            {content}
            <div>
                {countries ? (
                    <></>
                ) : (
                    <Button onClick={() => createCountries()} sx={{marginTop: 4}}>
                        Generate All Countries from API
                    </Button>
                )}
            </div>
        </Container>
    );
};

export default CountriesOverview;
