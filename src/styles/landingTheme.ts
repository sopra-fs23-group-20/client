import { createTheme } from "@mui/material/styles";
import styled from 'styled-components';
import { makeStyles } from '@material-ui/core/styles';



let landingTheme = createTheme({
    palette: {
        primary: {
            main: "#5EB23F",
            contrastText: "#000",
        },
        secondary: {
            main: "#5EB23F",
            contrastText: "#000",
        },
        background: {
            default: `url(${require("../components/views/images/pattern-landingpage.png")})`,
        },
        text: {
            primary: "#5EB23F",
            secondary: "#b3b3b3",
            disabled: "#757575",
        },

    },
    typography: {
        fontFamily: "Roboto, Arial, sans-serif",
        h1: {
            fontSize: "3rem",
            fontWeight: 500,
        },
        h2: {
            fontSize: "2.5rem",
            fontWeight: 500,
        },
        h3: {
            fontSize: "2rem",
            fontWeight: 500,
            color:"#5EB23F"
        },
        h4: {
            fontSize: "1.5rem",
            fontWeight: 500,
        },
        h5: {
            fontSize: "1.25rem",
            fontWeight: 500,
            color: "black",
        },
        h6: {
            fontSize: "1rem",
            fontWeight: 500,
        },
        body1: {
            fontSize: "1rem",
        },
        body2: {
            fontSize: "0.875rem",
        },
    },

});

export default landingTheme;