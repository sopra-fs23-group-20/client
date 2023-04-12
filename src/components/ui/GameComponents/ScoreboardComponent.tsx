import React, {useEffect, useState} from "react";
import {api} from "helpers/api";
import {Typography} from "@mui/material";
import User from "models/User";
import GameState from "models/constant/GameState";
import GameGetDTO from "models/GameGetDTO";
import GameUser from "../../../models/GameUser";
import Grid from "@mui/material/Unstable_Grid2";
import EmojiEventsIcon from '@mui/icons-material/EmojiEvents';
import './ScoreboardComponent.css';
import {convertToGameStateEnum} from "../../../helpers/convertTypes"; // Tell webpack that Button.js uses these styles
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Paper from '@mui/material/Paper';

interface Props {
  currentUser: User | null;
  gameId: string | undefined;
  gameGetDTO: GameGetDTO | null;
  isGameEnded: boolean
}

const ScoreboardComponent: React.FC<Props> = (props) => {
  const isGameEnded = props.isGameEnded
  const currentUser = props.currentUser;
  const gameId = props.gameId;
  const gameGetDTO = props.gameGetDTO;
  const [currentCountry, setCurrentCountry] = useState<string | null>(null);

  useEffect(() => {
    const getCurrentCountry = async () => {
      try {
        const response = await api.get(`/games/${gameId}/country`);
        const country = response.data;
        setCurrentCountry(country);
      } catch (error) {
        console.error(error);
      }
    };
    getCurrentCountry().then(r => r);
  }, [gameId]);

  if(currentUser === null || gameGetDTO === null){
    return null
  }

  const participants: Set<GameUser> | null = gameGetDTO.participants;

  if(participants === null){
    return null
  }

  const participantsArray = Array.from(participants)

  const getGameUser = (user:User) => participantsArray.find((x: GameUser) => {
    return x.userId !== null && user?.id !== null && x["userId"].toString() === user?.id.toString()
  })

  const currentGameUser = getGameUser(currentUser)

  const getPlacementString : any = (placementTemp:number) => {
    const placement = placementTemp+1
    const addSuperScript = (superScript: string) => (<>{placement}<sup>{superScript}</sup></>)

    if(placement === 1){
      return addSuperScript('st')
    }else if(placement === 2){
      return addSuperScript('nd')
    }else if(placement === 3){
      return addSuperScript('rd')
    }
    return addSuperScript('th')
  }

  const sortedParticipantsByScore = participantsArray.sort((a,b) => {
    if(a.gamePoints === null || b.gamePoints === null || a.username === null || b.username === null){
      return 0
    }
    if(Math.abs(b.gamePoints - a.gamePoints) < Math.pow(10,-6)){
      return a.username > b.username ? 1 : -1
    }
    return b.gamePoints - a.gamePoints
  });

  const getCurrentUserStyling = (userId: any) => {
    if(userId === null || currentGameUser === undefined || currentGameUser.userId === null){
      return ''
    }
    return  currentGameUser.userId.toString() === userId.toString() ? 'currentUser' : ''
  }

  const getTrophies = () => {
    const trophies = ['gold', 'silver', 'bronze']
    return sortedParticipantsByScore
        .reduce((grouped: Array<Array<GameUser>>, player) => {
          const el: Array<GameUser> | undefined = grouped.find((values:Array<GameUser>) => values[0].gamePoints === player.gamePoints)
          if (el) {
            el.push(player)
          }
          else grouped.push([player])
          return grouped
        }, [])
        .slice(0, 3)
        .map((set, index) => set.map(player => ({
          ...player,
          trophy: trophies[index]
        })))
        .reduce((a, b) => a.concat(b))
  }

  const getPlayerGamePoints: any =  (gameUser: GameUser) => {
    if(gameUser.userId === null || currentGameUser === undefined || currentGameUser.userId === null || gameGetDTO.remainingRoundPoints === null
    || gameUser.gamePoints === null || gameUser.currentState === null){
      return null
    }

    const gameUserState = convertToGameStateEnum(gameUser.currentState.toString())
    if(gameUser.userId.toString() !== currentGameUser.userId.toString() && gameUserState === GameState.GUESSING){
      return gameGetDTO.remainingRoundPoints + gameUser.gamePoints
    }
    return gameUser.gamePoints
  }

  return (
      <Grid
          container
          direction="row"
          justifyContent="flex-start"
          alignItems="flex-start"
      >
        <Grid xs={12} className={"scoreBoardContainer"}>
          <Grid
              container
              direction="row"
              justifyContent="flex-start"
              alignItems="flex-start"
          >
            <Grid xs={12}>
              <h1 className="Title">
                Scoreboard
              </h1>
            </Grid>
          </Grid>

          <Grid
              container
              direction="row"
              justifyContent="flex-start"
              alignItems="flex-start"
          >
            <Grid xs={12}>
              {
                !isGameEnded && (
                    <>
                      <Typography variant="h4" sx={{ marginTop: 2 }}>
                        The correct country was: {currentCountry}
                      </Typography>
                      <Typography variant="h4" sx={{ marginTop: 2 }}>
                        Next round starts in:{" "}
                        {gameGetDTO ? gameGetDTO.remainingTime : "undefined"}
                      </Typography>
                    </>
                  )
              }
            </Grid>
          </Grid>

          <Grid
              container
              direction="row"
              justifyContent="flex-start"
              alignItems="flex-start"
          >
            <Grid xs className="PrizeCabinet">
              <ul>
                {
                  getTrophies().map((trophy: { gamePoints: number | null; currentState: GameState | null; trophy: string; userId: number | null; username: string | null }, index: number) =>
                      <li key={`${index}_li`} className={`Trophy ${trophy.trophy} ${getCurrentUserStyling(trophy.userId)}`}>
                        <EmojiEventsIcon  className="icon" name="trophy"/>
                        <p className={`name`}> {trophy.username}</p>
                      </li>
                  )
                }
              </ul>
            </Grid>
          </Grid>
          <Grid
              container
              direction="row"
              justifyContent="flex-start"
              alignItems="flex-start"
          >
            <Grid xs>
              <Grid
                  container
                  direction="row"
                  justifyContent="flex-start"
                  alignItems="flex-start"
                  className="Board"
              >
                <Grid xs={12}>
                  <TableContainer component={Paper}>
                    <Table sx={{ minWidth: 650 }} aria-label="simple table">
                      <TableHead>
                        <TableRow>
                          <TableCell className={"tableColumnHeader"}>Rank</TableCell>
                          <TableCell className={"tableColumnHeader"} align="right">Username</TableCell>
                          <TableCell className={"tableColumnHeader"} align="right">Points</TableCell>
                        </TableRow>
                      </TableHead>
                      <TableBody>
                        {sortedParticipantsByScore.map((player, index) => (
                            <TableRow
                                key={index}
                                sx={{ '&:last-child td, &:last-child th': { border: 0 }}}
                                className={`Player ${getCurrentUserStyling(player.userId)}`}
                            >
                              <TableCell component="th" scope="row" className={"tableColumnEntries"}>
                                {getPlacementString(index)}
                              </TableCell>
                              <TableCell align="right" className={"tableColumnEntries"}>{player.username}</TableCell>
                              <TableCell align="right" className={"tableColumnEntries"}>{getPlayerGamePoints(player)}</TableCell>
                            </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </TableContainer>
                </Grid>



            </Grid>
            </Grid>
          </Grid>

          <Grid
              container
              direction="row"
              justifyContent="flex-start"
              alignItems="flex-start"
          >
            <Grid xs>
              {!isGameEnded && (
                  <Typography variant="h4" sx={{ marginTop: 5 }}>
                    Currently on Round:{" "}
                    {gameGetDTO?.numberOfRounds != null &&
                    gameGetDTO?.remainingRounds != null
                        ? gameGetDTO.numberOfRounds -
                        gameGetDTO.remainingRounds +
                        "/" +
                        gameGetDTO.numberOfRounds
                        : "undefined"}
                  </Typography>
              )}
            </Grid>
          </Grid>
        </Grid>
      </Grid>
  );
};
export default ScoreboardComponent;
