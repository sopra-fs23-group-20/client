import {api} from "../../../helpers/api";
import WinnerOverviewComponent from "./WinnerOverviewComponent";
import React, {useEffect, useState} from "react";
import User from "../../../models/User";
import {Link} from "react-router-dom";
import {useNavigate} from "react-router-dom";
import {Button, Container, DialogActions, Typography} from "@mui/material";
import KeyboardArrowLeftIcon from "@mui/icons-material/KeyboardArrowLeft";
import useTypewriter from "react-typewriter-hook/build/useTypewriter";

interface Props {
}

const LeaderboardComponent: React.FC<Props> = (props) => {
    const navigate = useNavigate();
    const [users, setUsers] = useState<Array<User> | null>(null);
    const [currentUser, setCurrentUser] = useState<User | null>(null);
    const typewriterText = useTypewriter("Leaderboard");


    useEffect(() => {
        const getUsers = async () => {
            try {
                const response = await api.get(`/users`);
                setUsers(response.data)
            } catch (error) {
                console.error(error);
            }
        };

        async function fetchUser(): Promise<void> {
            try {
                let id = localStorage.getItem("id");

                const response = await api.get(`/users/${id}`, {
                    headers: {
                        Authorization: localStorage.getItem("token")!,
                    },
                });
                setCurrentUser(response.data);
            } catch (error) {
                localStorage.removeItem("token");
                localStorage.removeItem("id");
                navigate("/register");
                console.error(error);
            }
        }

        getUsers().then((r) => r);
        fetchUser().then((r) => r);
    }, []);

    if (users === null || currentUser === null) {
        return null
    }

    const participantsArray = Array.from(users);

    const sortParticipantsByScore = (participantsArray: User[]) => {
        return participantsArray.sort((a, b) => {
            if (
                a.gamesWon === null ||
                b.gamesWon === null ||
                a.username === null ||
                b.username === null
            ) {
                return 0;
            }
            if (Math.abs(b.gamesWon - a.gamesWon) < Math.pow(10, -6)) {
                return a.username > b.username ? 1 : -1;
            }
            return b.gamesWon - a.gamesWon;
        });
    };

    const sortedParticipantsByScore = sortParticipantsByScore(participantsArray);

    //needs to be here because of WinnerOverviewComponent weird requirements
    const renderTitle = () => (<></>)

    const getPlayerWins: any = (user: User) => {
        if (
            user === undefined ||
            user.id === null ||
            user.gamesWon === null
        ) {
            return null;
        }

        return user.gamesWon
    };

    const renderPlayerUsernameTableCell = (player: any) => {
        return <Link to={`/game/profile/${player.id}`}>{player.username}</Link>
    }

    return (
        <Container
            sx={{
                marginTop: "10vh",
            }}>
            <Typography
                variant="h1"
                sx={{
                    textAlign: "center",
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
            <WinnerOverviewComponent
                renderTitle={renderTitle}
                currentUserId={currentUser.id}
                renderAdditionalInformation={undefined}
                sortedParticipantsByScore={sortedParticipantsByScore}
                attributeToConsider={'gamesWon'}
                additionalText={'Wins'}
                columnHeaderText={'Total Games won'}
                renderPlayerValue={getPlayerWins}
                renderPlayerUsernameTableCell={renderPlayerUsernameTableCell}
                renderInformationOnBottom={undefined}
                idAttributeName={'id'}/>
        </Container>)
}

export default LeaderboardComponent