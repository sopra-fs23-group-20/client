import React, {useState, useEffect} from "react";
import {api} from "helpers/api";
import User from "models/User";
import {useNavigate} from "react-router-dom";
import {motion, AnimatePresence} from "framer-motion";
import "./Profile.css";
import {
    Button,
    Container,
    TextField,
    Typography,
    Box,
    Avatar,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    Paper,
    Grid,
} from "@mui/material";
import IconButton from "@mui/material/IconButton";
import DeleteIcon from "@mui/icons-material/Delete";

// eslint-disable-next-line @typescript-eslint/no-unused-vars
import {AxiosError} from "axios";
import {AdapterDayjs} from "@mui/x-date-pickers/AdapterDayjs";
import {LocalizationProvider} from "@mui/x-date-pickers/LocalizationProvider";
import {DatePicker} from "@mui/x-date-pickers/DatePicker";
import dayjs from "dayjs";
import Autocomplete from "@mui/material/Autocomplete";
import {useAlert} from "helpers/AlertContext";
import GameGetDTO from "models/GameGetDTO";
import GameUser from "models/GameUser";

const Profile: React.FC = () => {
    const id = window.location.pathname.split("/").pop();
    const navigate = useNavigate();
    const [currentUser, setCurrentUser] = useState<User | null>(null);
    const [editMode, setEditMode] = useState<boolean>(false);

    const [username, setUsername] = useState<string | null>(null);
    const [password, setPassword] = useState<string | null>(null);
    const [birthDate, setBirthDate] = useState<Date | null>(null);
    const [profilePicture, setProfilePicture] = useState<string | null>(null);
    const [nationality, setNationality] = useState<string | null>(null);
    const [gamesWon, setGamesWon] = useState<number | null>(null);
    const [games, setGames] = useState<Array<GameGetDTO> | null>(null);
    const [allCountries, setAllCountries] = useState<Array<string>>([]);
    const {showAlert} = useAlert();

    // Save user changes
    const saveChanges = async () => {
        try {
            let requestBody = {
                username: username,
                password: password,
                birthDate: birthDate,
                nationality: nationality,
                profilePicture: profilePicture,
                status: "ONLINE",
            };
            const response = await api.put(`/users/${id}`, requestBody, {
                headers: {Authorization: localStorage.getItem("token")!},
            });

            setEditMode(false);
            const copyCurrentUser = {...currentUser!};
            copyCurrentUser.username = username!;
            copyCurrentUser.password = password!;
            copyCurrentUser.birthDate = birthDate!;
            copyCurrentUser.nationality = nationality!;
            copyCurrentUser.profilePicture = profilePicture!;
            copyCurrentUser.gamesWon = gamesWon!;
            setCurrentUser(copyCurrentUser);
        } catch (error: AxiosError | any) {
            showAlert(error.response.data.message, "error");
            currentUser ? setUsername(currentUser.username) : setUsername(null);
            currentUser ? setPassword(currentUser.password) : setPassword(null);
            currentUser ? setBirthDate(currentUser.birthDate) : setBirthDate(null);
            currentUser
                ? setNationality(currentUser.nationality)
                : setNationality(null);
            currentUser
                ? setProfilePicture(currentUser.profilePicture)
                : setProfilePicture(null);
            setEditMode(false);
            currentUser ? setGamesWon(currentUser.gamesWon) : setGamesWon(null);
        }
    };

    const randomColor = () => {
        const colors = [
            "#FFCDD2",
            "#F8BBD0",
            "#E1BEE7",
            "#D1C4E9",
            "#C5CAE9",
            "#BBDEFB",
            "#B3E5FC",
            "#B2EBF2",
            "#B2DFDB",
            "#C8E6C9",
            "#DCEDC8",
            "#F0F4C3",
        ];
        return colors[Math.floor(Math.random() * colors.length)];
    };
    const [avatarBgColor, setAvatarBgColor] = useState<string>();

    const handleImageUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0];
        if (!file) return;

        const reader = new FileReader();
        reader.onloadend = () => {
            const imageDataUrl = reader.result as string;
            localStorage.setItem("profilePicture", imageDataUrl);
            setProfilePicture(imageDataUrl);
        };
        reader.readAsDataURL(file);
    };

    const getRandomColor = () => {
        if (!avatarBgColor) {
            const color = randomColor();
            setAvatarBgColor(color);
        }
    };

    const removeImage = () => {
        setProfilePicture(null);
        localStorage.removeItem("profilePicture");
    };

    useEffect(() => {
        getRandomColor();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    useEffect(() => {
        getRandomColor();

        async function fetchUser(): Promise<User | undefined> {
            try {
                const response = await api.get(`/users/${id}`, {
                    headers: {Authorization: localStorage.getItem("token")!},
                });

                setCurrentUser(response.data);
                setUsername(response.data.username);
                setPassword(response.data.password);
                response.data.birthDate
                    ? setBirthDate(new Date(response.data.birthDate))
                    : setBirthDate(null);
                response.data.nationality
                    ? setNationality(response.data.nationality)
                    : setNationality(null);
                response.data.profilePicture
                    ? setProfilePicture(response.data.profilePicture)
                    : setProfilePicture(null);
                setGamesWon(response.data.gamesWon);

                // Set the initial value for nationality if it exists
                response.data.nationality
                    ? setNationality(response.data.nationality)
                    : setNationality(null);

                return response.data;
            } catch (error: AxiosError | any) {
                // Handle error
                return undefined;
            }
        }

        fetchUser();

        // Fetch countries when the component mounts
        async function fetchCountries() {
            const fetchedCountries = await getNationalities();
            setAllCountries(fetchedCountries);
        }

        fetchCountries();

        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);


    useEffect(() => {
        if (currentUser !== null) {
            async function fetchGame(): Promise<any> {
                try {
                    const response = await api.get(`/games`);
                    const gamesDTO: Array<GameGetDTO> = [...response.data];
                    let gamesFiltered: any = [];

                    gamesDTO.forEach((x: any) => {
                        const hasParticipated = x.participants.some(
                            (y: any) => y.userId === currentUser?.id
                        );
                        if (!hasParticipated) {
                            return;
                        }
                        const participants = x.participants;
                        const rankedParticipants = participants.sort(
                            (a: GameUser, b: GameUser) =>
                                a.gamePoints !== null && b.gamePoints !== null
                                    ? b.gamePoints - a.gamePoints
                                    : 0
                        );
                        let winner = participants.reduce(
                            (maxObject: any, currentObject: any) => {
                                return currentObject.gamePoints > maxObject.gamePoints
                                    ? currentObject
                                    : maxObject;
                            }
                        );
                        const gameUser = participants.find(
                            (x: GameUser) => x.userId === currentUser?.id
                        );
                        const rank =
                            rankedParticipants.findIndex(
                                (x: GameUser) => x.userId === gameUser.userId
                            ) + 1;
                        const copyGame = {...x, winner: winner, gameUser, rank};
                        gamesFiltered = [...gamesFiltered, copyGame];
                    });
                    setGames(gamesFiltered);
                } catch (error: AxiosError | any) {
                    showAlert("Lobby doesn't exist", "error");
                    navigate("/game");
                    console.error(error);
                    return undefined;
                }
            }

            fetchGame();
        }
    }, [currentUser]);

    async function getNationalities(): Promise<string[]> {
        try {
            const response = await api.get("/countries");
            const countries = response.data.map((country: { name: string }) => country.name);
            return countries;
        } catch (error) {
            console.error(error);
            return []; // Return an empty array in case of an error
        }
    }


    // Render profile edit form
    const renderEditForm = () => {
        if (!currentUser) return null;
        return (
            <div>
                <Box
                    sx={{display: "flex", justifyContent: "center", marginBottom: 2}}
                >
                    <Avatar
                        className="avatar"
                        sx={{
                            width: 100,
                            height: 100,
                            backgroundColor: profilePicture ? "transparent" : avatarBgColor,
                            border: "2px solid #3f51b5",
                            boxShadow: 3,
                        }}
                        src={profilePicture || ""}
                        alt={currentUser.username ?? ""}
                    >
                        {profilePicture
                            ? ""
                            : currentUser.username?.[0]?.toUpperCase() ?? ""}
                    </Avatar>
                </Box>
                <Box
                    sx={{
                        display: "flex",
                        justifyContent: "center",
                        flexDirection: "column",
                        alignItems: "center",
                    }}
                >
                    <input
                        accept="image/png"
                        id="contained-button-file"
                        type="file"
                        onChange={handleImageUpload}
                        style={{display: "none"}}
                    />
                    <label htmlFor="contained-button-file">
                        <Button variant="outlined" component="span">
                            Upload Profile Picture
                        </Button>
                    </label>
                    {profilePicture && (
                        <IconButton
                            color="error"
                            onClick={removeImage}
                            sx={{
                                marginLeft: 30,
                                color: "red",
                                marginRight: 2,
                                marginBottom: 1,
                            }}
                        >
                            <DeleteIcon/>
                        </IconButton>
                    )}
                </Box>
                <div style={{ display: "flex", alignItems: "center" }}>
                    <Typography
                        variant="h4"
                        sx={{
                            marginTop: 2,
                            marginBottom: 1,
                            backgroundColor: "rgba(0, 0, 0, 0.1)",
                            padding: 1,
                            borderRadius: 1,
                        }}
                    >
                        Username:
                    </Typography>
                    <TextField
                        value={username!}
                        onChange={(e) => setUsername(e.target.value)}
                        size="small"
                        sx={{ marginLeft: 2 }}
                    />
                </div>

                <div style={{ display: "flex", alignItems: "center" }}>
                    <Typography
                        variant="h4"
                        sx={{
                            marginTop: 2,
                            marginBottom: 1,
                            backgroundColor: "rgba(0, 0, 0, 0.1)",
                            padding: 1,
                            borderRadius: 1,
                        }}
                    >
                        Password:
                    </Typography>
                    <TextField
                        value={password!}
                        onChange={(e) => setPassword(e.target.value)}
                        size="small"
                        sx={{ marginLeft: 2.8 }}
                    />
                </div>

                <Typography
                    variant="h4"
                    sx={{
                        marginTop: 2,
                        marginBottom: 1,
                        backgroundColor: "rgba(0, 0, 0, 0.1)",
                        padding: 1,
                        borderRadius: 1,
                    }}
                >
                    Status: {currentUser.status}{" "}
                </Typography>

                <Typography
                    variant="h4"
                    sx={{
                        marginTop: 2,
                        marginBottom: 1,
                        backgroundColor: "rgba(0, 0, 0, 0.1)",
                        padding: 1,
                        borderRadius: 1,
                    }}
                >
                    Creation Date:{" "}
                    {currentUser.creation_date
                        ? new Date(currentUser.creation_date).toLocaleDateString("de-DE", {
                            day: "2-digit",
                            month: "2-digit",
                            year: "numeric",
                        })
                        : "No Creation Date"}
                </Typography>

                <div style={{ display: "flex", alignItems: "center" }}>
                    <Typography
                        variant="h4"
                        sx={{
                            marginTop: 2,
                            marginBottom: 1,
                            backgroundColor: "rgba(0, 0, 0, 0.1)",
                            padding: 1,
                            borderRadius: 1,
                        }}
                    >
                        Birth Date:
                    </Typography>
                    <LocalizationProvider dateAdapter={AdapterDayjs} locale="en">
                        <DatePicker
                            label="Select date"
                            sx={{ marginLeft: 2 }}
                            value={dayjs(birthDate)}
                            onAccept={(newValue) => {
                                newValue ? setBirthDate(newValue.toDate()) : setBirthDate(null);
                            }}
                            disableFuture={true}
                        />
                    </LocalizationProvider>
                </div>

                <div style={{ display: "flex", alignItems: "center", marginTop: "4px" }}>
                    <Typography
                        variant="h4"
                        sx={{
                            marginTop: 2,
                            marginBottom: 1,
                            backgroundColor: "rgba(0, 0, 0, 0.1)",
                            padding: 1,
                            borderRadius: 1,
                        }}
                    >
                        Nationality:
                    </Typography>
                    <Autocomplete
                        sx={{ marginLeft: 2, width: "100%" }}
                        value={nationality}
                        onChange={(_, newValue) => setNationality(newValue)}
                        options={allCountries}
                        renderInput={(params) => (
                            <TextField {...params} label="Select a country" />
                        )}
                    />
                </div>

                {String(localStorage.getItem("id")) === String(currentUser.id) ? (
                    <div style={{ display: "flex", justifyContent: "center" }}>
                        <div>
                            <Button
                                variant="outlined"
                                onClick={() => {
                                    setUsername(currentUser.username);
                                    setPassword(currentUser.password);
                                    setBirthDate(new Date(currentUser.birthDate!));
                                    setNationality(currentUser.nationality);
                                    setProfilePicture(currentUser.profilePicture);
                                    setEditMode(false);
                                }}
                            >
                                Discard
                            </Button>
                            <Button
                                variant="outlined"
                                sx={{ margin: 2 }}
                                disabled={!username}
                                onClick={() => saveChanges()}
                            >
                                Save
                            </Button>
                        </div>
                    </div>

                ) : (
                    <div></div>
                )}
            </div>
        );
    };

    // Render profile view
    const renderProfileView = () => {
        if (!currentUser) return null;
        return (
            <div>
                <Box
                    sx={{display: "flex", justifyContent: "center", marginBottom: 2}}
                >
                    <Avatar
                        sx={{
                            width: 100,
                            height: 100,
                            backgroundColor: profilePicture ? "transparent" : avatarBgColor,
                            border: "2px solid #3f51b5",
                            boxShadow: 3,
                        }}
                        src={profilePicture || ""}
                        alt={currentUser.username ?? ""}
                    >
                        {profilePicture
                            ? ""
                            : currentUser.username?.[0]?.toUpperCase() ?? ""}
                    </Avatar>
                </Box>
                <motion.div
                    initial={{opacity: 0, y: -20}}
                    animate={{opacity: 1, y: 0}}
                    transition={{duration: 0.5}}
                >
                    <Typography
                        variant="h4"
                        sx={{
                            marginTop: 2,
                            marginBottom: 1,
                            backgroundColor: "rgba(0, 0, 0, 0.1)",
                            padding: 1,
                            borderRadius: 1,
                        }}
                    >
                        Username:{" "}
                        <span style={{color: "MediumAquaMarine"}}>
              {currentUser.username}
            </span>
                    </Typography>
                    <Typography
                        variant="h4"
                        sx={{
                            marginTop: 2,
                            marginBottom: 1,
                            backgroundColor: "rgba(0, 0, 0, 0.1)",
                            padding: 1,
                            borderRadius: 1,
                        }}
                    >
                        Status: {currentUser.status}
                    </Typography>
                    <Typography
                        variant="h4"
                        sx={{
                            marginTop: 2,
                            marginBottom: 1,
                            backgroundColor: "rgba(0, 0, 0, 0.1)",
                            padding: 1,
                            borderRadius: 1,
                        }}
                    >
                        Creation Date:{" "}
                        {new Date(currentUser.creation_date!).toLocaleDateString("de-DE", {
                            day: "2-digit",
                            month: "2-digit",
                            year: "numeric",
                        })}
                    </Typography>
                    {currentUser.birthDate ? (
                        <Typography
                            variant="h4"
                            sx={{
                                marginTop: 2,
                                marginBottom: 1,
                                backgroundColor: "rgba(0, 0, 0, 0.1)",
                                padding: 1,
                                borderRadius: 1,
                            }}
                        >
                            Birth Date:{" "}
                            {currentUser.birthDate
                                ? new Date(currentUser.birthDate).toLocaleDateString("de-DE", {
                                    day: "2-digit",
                                    month: "2-digit",
                                    year: "numeric",
                                })
                                : "No Birth Date"}
                        </Typography>
                    ) : (
                        <div></div>
                    )}
                    {currentUser.nationality && (
                        <Typography
                            variant="h4"
                            sx={{
                                marginTop: 2,
                                marginBottom: 1,
                                backgroundColor: "rgba(0, 0, 0, 0.1)",
                                padding: 1,
                                borderRadius: 1,
                            }}
                        >
                            Nationality: {currentUser.nationality}
                        </Typography>
                    )}
                    <Typography
                        variant="h4"
                        sx={{
                            marginTop: 2,
                            marginBottom: 1,
                            backgroundColor: "rgba(0, 0, 0, 0.1)",
                            padding: 1,
                            borderRadius: 1,
                        }}
                    >
                        Games Won:{" "}
                        <span>{currentUser.gamesWon ? currentUser.gamesWon : 0}</span>
                    </Typography>
                    <Typography
                        variant="h4"
                        sx={{
                            marginTop: 2,
                            marginBottom: 1,
                            backgroundColor: "rgba(0, 0, 0, 0.1)",
                            padding: 1,
                            borderRadius: 1,
                        }}
                    >
                        Avatar:
                        <span>
              <Avatar
                  alt="Remy Sharp"
                  src={
                      "https://api.dicebear.com/6.x/pixel-art/svg?seed=" +
                      currentUser.username
                  }
              />
            </span>
                    </Typography>
                    <Grid
                        container
                        direction="row"
                        justifyContent="center"
                        alignItems="flex-start"
                    >
                        <Grid item xs={12}>
                            <Typography
                                variant="h4"
                                sx={{
                                    marginTop: 2,
                                    marginBottom: 1,
                                    backgroundColor: "rgba(0, 0, 0, 0.1)",
                                    padding: 1,
                                    borderRadius: 1,
                                }}
                            >
                                Game History:
                            </Typography>
                        </Grid>
                        <Grid item xs>
                            <TableContainer component={Paper}>
                                <Table sx={{width: "100%"}} aria-label="simple table">
                                    <TableHead>
                                        <TableRow>
                                            {[
                                                "Game Id",
                                                "Game mode",
                                                "Number of rounds",
                                                "Participants",
                                                "Total points",
                                                "Rank",
                                            ].map((x: any, index: number) => (
                                                <TableCell
                                                    key={`${index}, ${x}`}
                                                    className={"tableColumnHeader"}
                                                    align="left"
                                                >
                                                    {x}
                                                </TableCell>
                                            ))}
                                        </TableRow>
                                    </TableHead>
                                    <TableBody>
                                        {games?.map((game: any, index: number) => (
                                            <TableRow key={`${index}, ${game.gameId}`}>
                                                <TableCell className={"tableColumnHeader"} align="left">
                                                    {game.gameId}
                                                </TableCell>
                                                <TableCell className={"tableColumnHeader"} align="left">
                                                    {game.gameMode}
                                                </TableCell>
                                                <TableCell className={"tableColumnHeader"} align="left">
                                                    {game.numberOfRounds}
                                                </TableCell>
                                                <TableCell className={"tableColumnHeader"} align="left">
                                                    {game.participants !== null &&
                                                        Array.from(game.participants).length}
                                                </TableCell>
                                                <TableCell className={"tableColumnHeader"} align="left">
                                                    {game.gameUser !== null && game.gameUser.gamePoints}
                                                </TableCell>
                                                <TableCell className={"tableColumnHeader"} align="left">
                                                    {game.rank}
                                                </TableCell>
                                            </TableRow>
                                        ))}
                                    </TableBody>
                                </Table>
                            </TableContainer>
                        </Grid>
                    </Grid>
                </motion.div>

                {String(localStorage.getItem("id")) === String(currentUser.id) ? (
                    <Button
                        variant="outlined"
                        onClick={() => setEditMode(true)}
                        sx={{marginTop: 2}}
                    >
                        Edit your Profile
                    </Button>
                ) : (
                    <></>
                )}
                <Button
                    onClick={() => navigate("/game")}
                    sx={{marginTop: 2, marginLeft: 2}}
                    variant="outlined"
                >
                    Back to Main Page
                </Button>
            </div>
        );
    };

    // Main content rendering
    const content = currentUser ? (
        <AnimatePresence>
            {editMode ? (
                <motion.div
                    key="edit"
                    initial={{opacity: 0}}
                    animate={{opacity: 1}}
                    exit={{opacity: 0}}
                    transition={{duration: 0.5}}
                >
                    {renderEditForm()}
                </motion.div>
            ) : (
                <motion.div
                    key="view"
                    initial={{opacity: 0}}
                    animate={{opacity: 1}}
                    exit={{opacity: 0}}
                    transition={{duration: 0.5}}
                >
                    {renderProfileView()}
                </motion.div>
            )}
        </AnimatePresence>
    ) : (
        <div></div>
    );

    return (
        <Container
            sx={{display: "flex", marginTop: "10vh"}}
            className="profile-container"
        >
            {content}
        </Container>
    );
};

export default Profile;
