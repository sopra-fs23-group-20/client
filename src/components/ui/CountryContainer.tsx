import React, {useState} from "react";
import Country from "models/Country";
import MapContainer from "./MapContainer";
import OutlineContainer from "./OutlineContainer";
import {
    Avatar,
    Box,
    Typography,
    Stack,
    Card,
    CardHeader,
    CardContent,
} from "@mui/material";
import ReactCardFlip from "react-card-flip";

const CountryContainer: React.FC<Country> = (country: Country) => {
    const [isFlipped, setIsFlipped] = useState<boolean>(false);

    const handleClick = () => {
        setIsFlipped(!isFlipped);
    };

    if (!country.location) {
        return null;
    }

    return (
        <ReactCardFlip isFlipped={isFlipped} flipDirection="horizontal">
            <Card onClick={handleClick} sx={{width: 500, height: 350, mt: 2}}>
                <CardHeader
                    title={country.name}
                    titleTypographyProps={{variant: "h2", align: "center"}}
                    sx={{display: "flex", justifyContent: "center", alignItems: "center", height: "100%"}}
                />
            </Card>

            <Card onClick={handleClick} sx={{width: 1200, height: 500}}>
                <CardContent>
                    <Box
                        sx={{
                            display: "flex",
                            flexDirection: "row",
                            justifyContent: "center",
                            my: 3,
                            gap: "50px",
                        }}
                    ></Box>
                    <Box
                        sx={{
                            display: "flex",
                            flexDirection: "row",
                            justifyContent: "center",
                            my: 3,
                            gap: "50px",
                        }}
                    >
                        <Box
                            sx={{
                                display: "flex",
                                flexDirection: "column",
                                alignItems: "center",
                            }}
                        >
                            <Stack flexDirection="row" gap="20px">
                                {country.flag && (
                                    <Avatar
                                        variant="square"
                                        sx={{width: 220, height: 150}}
                                        src={country.flag.toString()}
                                        alt={`${country.name} flag`}
                                    />
                                )}
                                {country.outline && (
                                    <OutlineContainer
                                        country={country.outline.toString()}
                                        width={220}
                                        height={150}
                                    ></OutlineContainer>
                                )}
                            </Stack>

                            <Typography variant="h5" sx={{mb: 1, mt: 4}}>
                                Population: {country.population?.toString()}
                            </Typography>
                            <Typography variant="h5" sx={{mb: 1}}>
                                Capital: {country.capital}
                            </Typography>
                        </Box>
                        <MapContainer country={country} height={350} width={500}/>
                    </Box>
                </CardContent>
            </Card>
        </ReactCardFlip>
    );
};

export default CountryContainer;
