import React from "react";
import Country from "models/Country";
import MapContainer from "./MapContainer";
import CountryOutline from "./CountryOutline";
import {Avatar, Box, Typography, Stack} from "@mui/material";

const CountryContainer: React.FC<Country> = (country: Country) => {
    if (!country.location) {
        // Country does not have longitude and latitude
        return null;
    }

    return (
        <Box sx={{display: 'flex', flexDirection: 'row', justifyContent: 'center', my: 3, gap: "50px"}}>
            <Box sx={{display: 'flex', flexDirection: 'column', alignItems: 'center'}}>
                <Typography variant="h2" sx={{mb: 4}}>
                    {country.name}
                </Typography>
                <Stack flexDirection="row" gap="20px">
                    {country.flag &&
                        <Avatar
                            variant="square"
                            sx={{width: 220, height: 150}}
                            src={country.flag.toString()}
                            alt={`${country.name} flag`}
                        />
                    }
                    {country.outline &&
                        <CountryOutline country={country.outline.toString()} width={220} height={150}></CountryOutline>
                    }
                </Stack>

                <Typography variant="h5" sx={{mb: 1, mt: 4}}>
                    Population: {country.population?.toString()}
                </Typography>
                <Typography variant="h5" sx={{mb: 1}}>
                    Capital: {country.capital}
                </Typography>

            </Box>
            <MapContainer {...country} />
        </Box>
    );
};

export default CountryContainer;
