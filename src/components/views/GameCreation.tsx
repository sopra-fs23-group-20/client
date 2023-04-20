import {useState, useEffect} from "react";
import {api, handleError} from "helpers/api";
import {
    Button,
    Container,
    Typography,
    Box,
    FormControlLabel,
    FormGroup,
    Checkbox,
    Grid,
    IconButton,
    Tooltip,
} from "@mui/material";
import {SelectChangeEvent} from "@mui/material/Select";
import * as React from "react";
import {Switch} from "@mui/material";
import KeyboardArrowLeftIcon from "@mui/icons-material/KeyboardArrowLeft";

import {
    TextField,
    DialogContent,
    DialogActions,
    FormControl,
} from "@mui/material";
import {useNavigate} from "react-router-dom";
import CategoryEnum from "models/constant/CategoryEnum";
import RegionEnum from "models/constant/RegionEnum";
import GamePostDTO from "models/GamePostDTO";
import InfoIcon from "@mui/icons-material/Info";
import useTypewriter from "react-typewriter-hook/build/useTypewriter";
// eslint-disable-next-line @typescript-eslint/no-unused-vars
import {AxiosError} from "axios";
import {CategoryStack} from "models/CategoryStack";
import Category from "models/Category";

interface Props {
    gameId: string | undefined;
}

const GameCreation: React.FC<Props> = (props) => {
    const navigate = useNavigate();

    const [roundSeconds, setRoundSeconds] = useState(30);
    const [randomizedHints, setRandomizedHints] = useState(false);

    const [numberOfRounds, setNumberOfRounds] = useState(3);
    const [openLobby, setOpenLobby] = useState(true);

    const [selectedRegions, setSelectedRegions] = useState<RegionEnum[]>([
        RegionEnum.EUROPE,
        RegionEnum.AFRICA,
        RegionEnum.AMERICA,
        RegionEnum.ANTARCTICA,
        RegionEnum.ASIA,
        RegionEnum.OCEANIA,
    ]);
    const [selectedHints, setSelectedHints] = useState<CategoryEnum[]>([
        CategoryEnum.CAPITAL,
        CategoryEnum.FLAG,
        CategoryEnum.LOCATION,
        CategoryEnum.OUTLINE,
        CategoryEnum.POPULATION,
    ]);

    const allCategories = [
        CategoryEnum.CAPITAL,
        CategoryEnum.FLAG,
        CategoryEnum.LOCATION,
        CategoryEnum.OUTLINE,
        CategoryEnum.POPULATION,
    ];

    const remainingCategories = allCategories.filter(
        (category) => !selectedHints.includes(category)
    );

    const typewriterText = useTypewriter("Game Settings");

    const [infoMessage, setInfoMessage] = useState("");

    useEffect(() => {
        if (
            selectedRegions.length === 1 &&
            selectedRegions.includes(RegionEnum.ANTARCTICA)
        ) {
            setNumberOfRounds(2);
            setInfoMessage(
                "Maximum number of rounds set to 2 since Antarctica only has 2 countries."
            );
        } else {
            setInfoMessage("");
        }
    }, [selectedRegions]);

    function shuffleArray(array: CategoryEnum[]): void {
        for (let i = array.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [array[i], array[j]] = [array[j], array[i]];
        }
    }

    function isFormValid() {
        return selectedRegions.length > 0 && selectedHints.length > 0;
    }

    function stringToCategoryEnum(
        categoryString: string
    ): CategoryEnum | undefined {
        switch (categoryString) {
            case "Population":
                return CategoryEnum.POPULATION;
            case "Outline":
                return CategoryEnum.OUTLINE;
            case "Flag":
                return CategoryEnum.FLAG;
            case "Location":
                return CategoryEnum.LOCATION;
            case "Capital":
                return CategoryEnum.CAPITAL;
            default:
                return undefined;
        }
    }

    function stringToRegionEnum(regionString: string): RegionEnum | undefined {
        switch (regionString) {
            case "Africa":
                return RegionEnum.AFRICA;
            case "Asia":
                return RegionEnum.ASIA;
            case "Europe":
                return RegionEnum.EUROPE;
            case "Americas":
                return RegionEnum.AMERICA;
            case "Oceania":
                return RegionEnum.OCEANIA;
            case "Antarctica":
                return RegionEnum.ANTARCTICA;
            default:
                return undefined;
        }
    }

    async function startGame(): Promise<void> {
        const userIdString = localStorage.getItem("userId");

        console.log(selectedRegions);

        try {
            if (userIdString) {
                if (selectedHints && selectedHints.length > 0) {
                    const currentCategoryEnum = selectedHints[0];
                    const currentCategory = new Category(currentCategoryEnum);

                    const gamePostDTO = new GamePostDTO(
                        userIdString,
                        roundSeconds,
                        numberOfRounds,
                        new CategoryStack(
                            currentCategory,
                            selectedHints,
                            remainingCategories,
                            null,
                            randomizedHints
                        ),
                        selectedRegions,
                        openLobby
                    );
                    console.log("Game Post DTO: ", gamePostDTO);
                    const response = await api.post("/games", gamePostDTO);
                    console.log("Game Post Response: ", response.data);
                    navigate(`/game/lobby/${response.data.gameId}`);
                } else {
                    alert("Please select at least one category.");
                }
                <TextField
                    id="number-of-rounds"
                    label="Number of Rounds"
                    type="number"
                    InputLabelProps={{
                        shrink: true,
                    }}
                    value={numberOfRounds}
                    onChange={handleNumberOfRoundsChange}
                    inputProps={{
                        min: 1,
                        max:
                            selectedRegions.length === 1 &&
                            selectedRegions.includes(RegionEnum.ANTARCTICA)
                                ? 2
                                : 10,
                    }}
                    sx={{marginTop: "1rem"}}
                />;
            }
        } catch (error: AxiosError | any) {
            console.log(error);
            alert(
                `Something went wrong while updating game settings: \n${handleError(
                    error
                )}`
            );
        }
    }

    const handleRoundSecondsChange = (event: SelectChangeEvent<number>) => {
        setRoundSeconds(parseInt(event.target.value as string, 10));
    };

    const handleRandomizedHintsChange = (
        event: React.ChangeEvent<HTMLInputElement>
    ) => {
        setRandomizedHints(event.target.checked);
        if (event.target.checked) {
            shuffleArray(selectedHints);
            setSelectedHints([...selectedHints]);
        }
    };

    const handleCountryChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const {name, checked} = event.target;
        const region = stringToRegionEnum(name);

        if (!region) {
            return;
        }

        setSelectedRegions((prevRegions) => {
            let newRegions = [...prevRegions];
            if (checked) {
                newRegions.push(region);
            } else {
                newRegions = newRegions.filter((r) => r !== region);
            }
            return newRegions;
        });
    };

    const handleNumberOfRoundsChange = (event: { target: { value: any } }) => {
        let newValue = event.target.value;

        const maxRounds =
            selectedRegions.length === 1 &&
            selectedRegions.includes(RegionEnum.ANTARCTICA)
                ? 2
                : 10;

        if (newValue > maxRounds) {
            newValue = maxRounds;
        }

        setNumberOfRounds(newValue);
    };

    const handleOpenLobbyChange = (
        event: React.ChangeEvent<HTMLInputElement>
    ) => {
        setOpenLobby(event.target.checked);
    };

    const handleHintChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const {name, checked} = event.target;
        const category = stringToCategoryEnum(name);

        if (!category) {
            return;
        }

        setSelectedHints((prevHints) => {
            let newHints = [...prevHints];
            if (checked) {
                newHints.push(category);
            } else {
                newHints = newHints.filter((h) => h !== category);
            }

            newHints.sort((a, b) => {
                return allCategories.indexOf(a) - allCategories.indexOf(b);
            });

            return newHints;
        });
    };

    return (
        <div>
            <Container
                sx={{
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "center",
                    justifyContent: "center",
                }}
            >
                <Typography
                    variant="h1"
                    sx={{
                        minHeight: "56px",
                        textShadow: "2px 2px 4px rgba(0, 0, 0, 0.25)",
                    }}
                >
                    {typewriterText}
                </Typography>
                <DialogActions
                    sx={{
                        display: "flex",
                        justifyContent: "center",
                        alignItems: "center",
                    }}
                >
                    <Button
                        sx = {{mb: 4}}
                        variant="outlined"
                        size="small"
                        color="error"
                        startIcon={<KeyboardArrowLeftIcon/>}
                        onClick={() => navigate("/game/")}
                    >
                        Back to Dashboard
                    </Button>
                </DialogActions>

                <FormControl>
                    <DialogContent>
                        <Grid item container xs={12} spacing={2}>
                            <Grid item xs={6}>
                                <FormControl sx={{minWidth: "200px"}}>
                                    <TextField
                                        id="round-seconds"
                                        label="Round Seconds"
                                        type="number"
                                        InputLabelProps={{
                                            shrink: true,
                                        }}
                                        value={roundSeconds}
                                        onChange={(e) =>
                                            handleRoundSecondsChange({
                                                target: {value: e.target.value},
                                            } as SelectChangeEvent<number>)
                                        }
                                        inputProps={{
                                            min: 10,
                                            max: 60,
                                            step: 10,
                                        }}
                                    />
                                </FormControl>
                            </Grid>
                            <Grid item xs={6}>
                                <FormControl sx={{minWidth: "200px",}}>
                                    <TextField
                                        id="number-of-rounds"
                                        label="Number of Rounds"
                                        type="number"
                                        InputLabelProps={{
                                            shrink: true,
                                        }}
                                        value={numberOfRounds}
                                        onChange={handleNumberOfRoundsChange}
                                        inputProps={{
                                            min: 1,
                                            max:
                                                selectedRegions.length === 1 &&
                                                selectedRegions.includes(RegionEnum.ANTARCTICA)
                                                    ? 2
                                                    : 10,
                                        }}

                                    />
                                </FormControl>
                            </Grid>
                        </Grid>


                        <Grid container spacing={3}>
                            <Grid item xs={6}>
                                <Grid container spacing={0}>
                                    <Grid item xs={12}>
                                        <FormControl component="fieldset" sx={{mt: 2}}>
                                            <Typography variant="subtitle1">
                                                Select Region
                                                <Tooltip title="Select a minimum of 1 region" placement="right">
                                                    <IconButton>
                                                        <InfoIcon/>
                                                    </IconButton>
                                                </Tooltip>
                                            </Typography>
                                            <FormGroup>
                                                <FormControlLabel
                                                    control={
                                                        <Checkbox
                                                            checked={selectedRegions.includes(RegionEnum.AFRICA)}
                                                            onChange={handleCountryChange}
                                                            name="Africa"
                                                        />
                                                    }
                                                    label="Africa"
                                                />
                                                <FormControlLabel
                                                    control={
                                                        <Checkbox
                                                            checked={selectedRegions.includes(RegionEnum.ASIA)}
                                                            onChange={handleCountryChange}
                                                            name="Asia"
                                                        />
                                                    }
                                                    label="Asia"
                                                />
                                                <FormControlLabel
                                                    control={
                                                        <Checkbox
                                                            checked={selectedRegions.includes(RegionEnum.EUROPE)}
                                                            onChange={handleCountryChange}
                                                            name="Europe"
                                                        />
                                                    }
                                                    label="Europe"
                                                />
                                                <FormControlLabel
                                                    control={
                                                        <Checkbox
                                                            checked={selectedRegions.includes(RegionEnum.AMERICA)}
                                                            onChange={handleCountryChange}
                                                            name="Americas"
                                                        />
                                                    }
                                                    label="America"
                                                />
                                                <FormControlLabel
                                                    control={
                                                        <Checkbox
                                                            checked={selectedRegions.includes(RegionEnum.OCEANIA)}
                                                            onChange={handleCountryChange}
                                                            name="Oceania"
                                                        />
                                                    }
                                                    label="Oceania"
                                                />
                                                <FormControlLabel
                                                    control={
                                                        <Checkbox
                                                            checked={selectedRegions.includes(
                                                                RegionEnum.ANTARCTICA
                                                            )}
                                                            onChange={handleCountryChange}
                                                            name="Antarctica"
                                                        />
                                                    }
                                                    label="Antarctica"
                                                />
                                            </FormGroup>
                                        </FormControl>
                                    </Grid>
                                    <Grid item xs={12}>
                                        <Typography variant="subtitle2" color="error">
                                            {infoMessage}
                                        </Typography>
                                    </Grid>
                                </Grid>
                            </Grid>
                            <Grid item xs={6}>
                                <FormControl component="fieldset" sx={{mt: 2}}>
                                    <Typography variant="subtitle1">
                                        Select Hints
                                        <Tooltip title="Select a minimum of 1 hint" placement="right">
                                            <IconButton>
                                                <InfoIcon/>
                                            </IconButton>
                                        </Tooltip>
                                    </Typography>
                                    <FormGroup>
                                        <FormControlLabel
                                            control={
                                                <Checkbox
                                                    checked={selectedHints.includes(CategoryEnum.POPULATION)}
                                                    onChange={handleHintChange}
                                                    name="Population"
                                                />
                                            }
                                            label="Population"
                                        />
                                        <FormControlLabel
                                            control={
                                                <Checkbox
                                                    checked={selectedHints.includes(CategoryEnum.OUTLINE)}
                                                    onChange={handleHintChange}
                                                    name="Outline"
                                                />
                                            }
                                            label="Outline"
                                        />
                                        <FormControlLabel
                                            control={
                                                <Checkbox
                                                    checked={selectedHints.includes(CategoryEnum.LOCATION)}
                                                    onChange={handleHintChange}
                                                    name="Location"
                                                />
                                            }
                                            label="Location"
                                        />
                                        <FormControlLabel
                                            control={
                                                <Checkbox
                                                    checked={selectedHints.includes(CategoryEnum.FLAG)}
                                                    onChange={handleHintChange}
                                                    name="Flag"
                                                />
                                            }
                                            label="Flag"
                                        />
                                        <FormControlLabel
                                            control={
                                                <Checkbox
                                                    checked={selectedHints.includes(CategoryEnum.CAPITAL)}
                                                    onChange={handleHintChange}
                                                    name="Capital"
                                                />
                                            }
                                            label="Capital"
                                        />


                                    </FormGroup>
                                </FormControl>
                                <FormControlLabel
                                    control={
                                        <Checkbox
                                            checked={randomizedHints === null ? undefined : randomizedHints}
                                            onChange={handleRandomizedHintsChange}
                                            disabled={selectedHints.length === 1}
                                        />
                                    }
                                    label="Randomized Hints"
                                />
                            </Grid>
                        </Grid>


                        <div>
                            <FormControlLabel
                                sx={{mt: 2}}
                                control={
                                    <Switch
                                        checked={openLobby}
                                        onChange={(event) => handleOpenLobbyChange(event)}
                                        color="primary"
                                    />
                                }
                                label="Open Lobby"
                            />
                            <Tooltip
                                sx={{mt: 2}}
                                title="Open lobbies can be found by everyone in the lobby browser"
                                placement="right"
                            >
                                <IconButton>
                                    <InfoIcon/>
                                </IconButton>
                            </Tooltip>
                        </div>
                        <DialogActions
                            sx={{
                                display: "flex",
                                justifyContent: "center",
                                alignItems: "center",
                            }}
                        >
                            <Button
                                sx={{mt: 2}}
                                variant="outlined"
                                onClick={() => startGame()}
                                disabled={!isFormValid()}
                            >
                                Save Settings
                            </Button>
                        </DialogActions>
                    </DialogContent>
                </FormControl>
            </Container>
        </div>
    );
};
export default GameCreation;
