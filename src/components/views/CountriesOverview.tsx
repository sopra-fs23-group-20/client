import {useEffect, useState} from "react";
import {api} from "helpers/api";
import {useNavigate} from "react-router-dom";
import React from "react";
import Country from "models/Country";
import CountryContainer from "components/ui/CountryContainer";
import {Container, Typography, DialogActions} from "@mui/material";
import Button from "@mui/material/Button";
import KeyboardArrowLeftIcon from "@mui/icons-material/KeyboardArrowLeft";
import KeyboardArrowRightIcon from "@mui/icons-material/KeyboardArrowRight";
import CustomSpinner from "../ui/GameComponents/CustomSpinner";

const CountriesOverview: React.FC = () => {
    const navigate = useNavigate();

    const [countries, setCountries] = useState<Country[] | null>(null);
    const [currentCountryIndex, setCurrentCountryIndex] = useState<number>(0);


    const shuffleArray = (array: any[]) => {
        for (let i = array.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [array[i], array[j]] = [array[j], array[i]];
        }
    };

    useEffect(() => {
        async function getCountries(): Promise<void> {
            try {
                const response = await api.get("/countries");
                console.log(response.data);
                if (response.data.length !== 0) {
                    const randomizedCountries = response.data.map(
                        (getCountry: any) =>
                            new Country(
                                getCountry.name,
                                getCountry.population,
                                getCountry.capital,
                                getCountry.flag,
                                getCountry.location,
                                getCountry.outline.outline
                            )
                    );
                    shuffleArray(randomizedCountries);
                    setCountries(randomizedCountries);
                }
            } catch (error) {
                console.error(error);
            }
        }

        getCountries();
    }, []);

    const goToNextCountry = () => {
        if (countries !== null) {
            setCurrentCountryIndex((prevIndex) =>
                prevIndex === countries.length - 1 ? 0 : prevIndex + 1
            );
        }
    };

    const playAgain = () => {
        setCurrentCountryIndex(0);
    };

    let content = <CustomSpinner/>

    if (countries) {
        content = (
            <div>
                <Typography
                    variant="h5"
                    sx={{display: 'flex', justifyContent: 'center', alignItems: 'center', mb: 2}}>
                    Country {currentCountryIndex + 1}/{countries.length}
                </Typography>
                <CountryContainer
                    key={currentCountryIndex}
                    {...countries[currentCountryIndex]}
                />
                {currentCountryIndex === countries.length - 1 ? (
                    <Button sx={{marginTop: 4}} onClick={playAgain}>
                        Shuffle Deck
                    </Button>
                ) : (
                    <Container
                        sx={{
                            display: "flex",
                            justifyContent: "center",
                            marginTop: 4,
                        }}
                    >
                        <Button
                            onClick={goToNextCountry}
                            endIcon={<KeyboardArrowRightIcon/>}
                            color="success"
                            variant="contained"
                        >
                            Next Country
                        </Button>
                    </Container>
                )}
            </div>
        );
    }

    return (
        <Container
            sx={{
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                justifyContent: "center",
                marginTop: "10vh",
            }}
        >
            <Typography variant="h1">Learn Countries</Typography>
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
            <div className="country-container-wrapper">{content}</div>
        </Container>
    );
};

export default CountriesOverview;
