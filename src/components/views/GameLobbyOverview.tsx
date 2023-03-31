import React, { useState, useEffect } from "react";
import { api, handleError } from "helpers/api";
import User from "models/User";
import { useNavigate } from "react-router-dom";
import {
    Button,
    Container,
    TextField,
    Typography,
    Box,
    Avatar,
    Input,
} from "@mui/material";
import IconButton from "@mui/material/IconButton";
import DeleteIcon from "@mui/icons-material/Delete";

import { AxiosError } from "axios";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import dayjs from "dayjs";
import Autocomplete from "@mui/material/Autocomplete";
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Paper from '@mui/material/Paper';
function createData(
    name: string,
    calories: number,
    fat: number,
    carbs: number,
    protein: number,
) {
    return { name, calories, fat, carbs, protein };
}

const rows = [
    createData('Frozen yoghurt', 159, 6.0, 24, 4.0),
    createData('Ice cream sandwich', 237, 9.0, 37, 4.3),
    createData('Eclair', 262, 16.0, 24, 6.0),
    createData('Cupcake', 305, 3.7, 67, 4.3),
    createData('Gingerbread', 356, 16.0, 49, 3.9),
];


const GameLobbyOverview: React.FC = () => {
    const id = window.location.pathname.split("/").pop();
    const navigate = useNavigate();
    const [currentUser, setCurrentUser] = useState<User | null>(null);
    const [editMode, setEditMode] = useState<boolean>(false);

    const [username, setUsername] = useState<string | null>(null);
    const [password, setPassword] = useState<string | null>(null);
    const [birthday, setBirthday] = useState<Date | null>(null);
    const [profilePicture, setProfilePicture] = useState<string | null>(null);
    const [nationality, setNationality] = useState<string | null>(null);
    const [gamesWon, setGamesWon] = useState<number | null>(null);
    const [allCountries, setAllCountries] = useState<Array<string>>([]);
    const [allLobbies, setAllLobbies] = useState<Array<string>>([]);


    // Save user changes
    const saveChanges = async () => {
        try {
            console.log("Updating User");
            let requestBody = {
                username: username,
                password: password,
                birthday: birthday,
                nationality: nationality,
                profilePicture: profilePicture,
                status: "ONLINE",
            };
            console.log(" The Request Body is: ", requestBody);
            const response = await api.put(`/users/${id}`, requestBody, {
                headers: { Authorization: localStorage.getItem("token")! },
            });

            setEditMode(false);
            const copyCurrentUser = { ...currentUser! };
            copyCurrentUser.username = username!;
            copyCurrentUser.password = password!;
            copyCurrentUser.birthday = birthday!;
            copyCurrentUser.nationality = nationality!;
            copyCurrentUser.profilePicture = profilePicture!;
            copyCurrentUser.gamesWon = gamesWon!;
            setCurrentUser(copyCurrentUser);
        } catch (error: AxiosError | any) {
            alert(error.response.data.message);
            currentUser ? setUsername(currentUser.username) : setUsername(null);
            currentUser ? setPassword(currentUser.password) : setPassword(null);
            currentUser ? setBirthday(currentUser.birthday) : setBirthday(null);
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

    const removeImage = () => {
        setProfilePicture(null);
        localStorage.removeItem("profilePicture");
    };

    // Fetch user data on component mount
    useEffect(() => {
        async function fetchUser() {
            try {
                const response = await api.get(`/users/${id}`, {
                    headers: { Authorization: localStorage.getItem("token")! },
                });

                setCurrentUser(response.data);
                setUsername(response.data.username);
                setPassword(response.data.password);
                response.data.birthday
                    ? setBirthday(new Date(response.data.birthday))
                    : setBirthday(null);
                response.data.nationality
                    ? setNationality(response.data.nationality)
                    : setNationality(null);
                response.data.profilePicture
                    ? setProfilePicture(response.data.profilePicture)
                    : setProfilePicture(null);
                setGamesWon(response.data.gamesWon);
            } catch (error: AxiosError | any) {
                if (error.response.status === 404) {
                    alert(error.response.data.message);
                    navigate("/game");
                } else {
                    alert(error.response.data.message);
                    localStorage.removeItem("token");
                    localStorage.removeItem("id");
                    navigate("/register");
                    console.error(error);
                }
            }
        }

        fetchUser();
    }, []);

    useEffect(() => {
        async function fetchCountries() {
            try {
                const response = await api.get("/countries");
                setAllCountries(response.data.map((country: any) => country.name));
            } catch (error) {
                console.error("Error fetching countries:", error);
            }
        }
        fetchCountries();
    }, []);
    useEffect(() => {
        async function fetchLobbies() {
            try {
                console.log("started fetching all games")
                const response = await api.get("/games");
                const lobbies = response;
                setAllLobbies(response.data);
                console.log("response:");
                console.log(response);
                console.log("allLobbies:");
                console.log(allLobbies);
                //console.log(allLobbies.data);
            } catch (error) {
                console.error("Error fetching countries:", error);
            }
        }
        fetchLobbies();
    }, []);

    // Render profile edit form
    const renderEditForm = () => {
        if (!currentUser) return null;
        return (<div>
            </div>
        );
    };

    // Render profile view
    const renderProfileView = () => {
        if (!currentUser) return null;
        return (
            <div>
                <Typography>Hello</Typography>
                <div><pre>{JSON.stringify(allLobbies, null, 2) }</pre></div>;
                <TableContainer component={Paper}>
                    <Table sx={{ minWidth: 650 }} aria-label="simple table">
                        <TableHead>
                            <TableRow>
                                <TableCell>Dessert (100g serving)</TableCell>
                                <TableCell align="right">Calories</TableCell>
                                <TableCell align="right">Fat&nbsp;(g)</TableCell>
                                <TableCell align="right">Carbs&nbsp;(g)</TableCell>
                                <TableCell align="right">Protein&nbsp;(g)</TableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {rows.map((row) => (
                                <TableRow
                                    key={row.name}
                                    sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
                                >
                                    <TableCell component="th" scope="row">
                                        {row.name}
                                    </TableCell>
                                    <TableCell align="right">{row.calories}</TableCell>
                                    <TableCell align="right">{row.fat}</TableCell>
                                    <TableCell align="right">{row.carbs}</TableCell>
                                    <TableCell align="right">{row.protein}</TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </TableContainer>
            </div>
        );
    };

    // Main content rendering
    const content = currentUser ? (
        editMode ? (
            renderEditForm()
        ) : (
            renderProfileView()
        )
    ) : (
        <div></div>
    );

    return <Container>{content}</Container>;
};

export default GameLobbyOverview;
