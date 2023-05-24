import React from 'react';
import {useNavigate} from 'react-router-dom';
import {Button, Typography, Container, Box} from '@material-ui/core';
import {makeStyles, Theme} from '@material-ui/core/styles';
import {Grid} from '@material-ui/core';
import image from "../views/images/iPhoneImage.png"

const useStyles = makeStyles((theme: Theme) => ({
    root: {
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        height: '100vh',
        padding: theme.spacing(3),
        textAlign: 'center',
    },
    container: {
        minHeight: "950px", // Set the maximum height as per your requirement
        overflow: "auto", // Add overflow property to handle content that exceeds the maximum height
    },
    button: {
        marginTop: theme.spacing(2),
        width: "100%",
    },
    buttonContainer: {
        display: 'grid', // This will create a grid layout
        gap: '1em', // This will add a gap between your buttons
    },
    image: {
        maxWidth: '100%',
        height: 'auto',
        marginBottom: theme.spacing(2),
    },
    appName: {
        fontFamily: "'Roboto', sans-serif",
        fontSize: "3.5rem",
        fontWeight: 900,
        backgroundClip: "text",
        WebkitBackgroundClip: "text",
        color: "transparent",
        backgroundImage: "linear-gradient(90deg, #3498DB 0%, #21618C 10%, #186A3B 25%, #239B56 40%, #B3B6B7 55%, #F4F6F7 70%, #C39BD3 85%, #3498DB 100%)",
        backgroundSize: "200% 200%",
        animation: "$textShimmer 6s linear infinite",
    },
    '@keyframes textShimmer': {
        '0%': {
            backgroundPosition: "200% 0%",
        },
        '100%': {
            backgroundPosition: "-200% 0%",
        },
    },
}));

export default function Landing() {
    const navigate = useNavigate();
    const classes = useStyles();

    const handleButtonClick = (path: string) => {
        navigate(path);
    }

    return (
        <Container maxWidth="sm" className={`${classes.root} ${classes.container}`}>            <div style={{marginTop: '100px'}}></div>

            <Typography variant="h1" component="h1" className={classes.appName} gutterBottom>
                Guess The Country
            </Typography>
            <Typography variant="h5" component="h2" gutterBottom>
                Explore. Learn. Conquer. A Journey Through Geography.
            </Typography>
            <div style={{marginBottom: '25px'}}></div>

            <Grid container spacing={2}>
                <Grid item xs={12} sm={6}>
                    <Box>
                        <img src={image} alt="Your alt text" className={classes.image}/>
                    </Box>
                </Grid>
                <Grid item xs={12} sm={6}>
                    <Typography variant="body1" gutterBottom style={{textAlign: 'justify'}}>
                        "Guess The Country" is the new webapp: Learn more about Countries by competing in fun quiz
                        rounds. You can also learn more about countries by using the all new learning cards. You can
                        challenge your friends by playing against them and you can see your progress by looking at the
                        leaderboard of all players. Join Now!
                    </Typography>
                </Grid>


            </Grid>

            <Box className={classes.buttonContainer} style={{display: 'flex'}}>
                <Button
                    variant="contained"
                    color="secondary"
                    className={classes.button}
                    onClick={() => handleButtonClick("/register")}
                >
                    Register
                </Button>
                <Button
                    variant="contained"
                    color="default"
                    className={classes.button}
                    onClick={() => handleButtonClick("/login")}
                >
                    Login
                </Button>
            </Box>
            <div style={{marginBottom: '100px'}}></div>

        </Container>
    );
}
