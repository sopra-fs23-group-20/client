import React, { useState } from "react";
import GameState from "models/constant/GameState";
import GameUser from "../../../models/GameUser";
import Grid from "@mui/material/Unstable_Grid2";
import EmojiEventsIcon from "@mui/icons-material/EmojiEvents";
import "./WinnerOverviewComponent.css";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import Paper from "@mui/material/Paper";

interface Props {
  renderTitle: Function;
  renderAdditionalInformation: Function | undefined;
  currentUserId: number | any;
  attributeToConsider: string;
  additionalText: string;
  sortedParticipantsByScore: Array<any>;
  renderPlayerValue: Function;
  renderPlayerUsernameTableCell: Function;
  renderInformationOnBottom: Function | undefined;
  idAttributeName: string;
  columnHeaderText: string;
  isScoreboard: boolean;
  children?: React.ReactNode;
}

const WinnerOverviewComponent: React.FC<Props> = (props) => {
  const {
    renderTitle,
    renderAdditionalInformation,
    additionalText,
    currentUserId,
    sortedParticipantsByScore,
    attributeToConsider,
    renderPlayerValue,
    renderPlayerUsernameTableCell,
    renderInformationOnBottom,
    idAttributeName,
    columnHeaderText,
    isScoreboard
  } = props;

  const getPlacementString: any = (player: any, ranked: Array<Array<any>>) => {
    let placement: any;
    ranked.forEach((rankedGroup, index) => {
      const isFound = rankedGroup.find(
        (x) => x[idAttributeName] === player[idAttributeName]
      );
      if (isFound) {
        placement = index + 1;
        return;
      }
    });

    const addSuperScript = (superScript: string) => (
      <>
        {placement}
        <sup>{superScript}</sup>
      </>
    );

    if (placement === 1) {
      return addSuperScript("st");
    } else if (placement === 2) {
      return addSuperScript("nd");
    } else if (placement === 3) {
      return addSuperScript("rd");
    }
    return addSuperScript("th");
  };

  const getCurrentUserStyling = (userId: any) => {
    if (
      userId === null ||
      currentUserId === undefined ||
      currentUserId === null
    ) {
      return "";
    }
    return currentUserId.toString() === userId.toString() ? "currentUser" : "";
  };

  const getGroupedArrayForRank = (sortedParticipantsByScore: any) => {
    return sortedParticipantsByScore.reduce(
      (grouped: Array<Array<GameUser>>, player: any) => {
        // @ts-ignore
        const el: Array<GameUser> | undefined = grouped.find(
          (values: Array<GameUser>) =>
            values[0][attributeToConsider] === player[attributeToConsider]
        );
        if (el) {
          el.push(player);
        } else grouped.push([player]);
        return grouped;
      },
      []
    );
  };

  const ranked = getGroupedArrayForRank(sortedParticipantsByScore);
  const trophies = ["gold", "silver", "bronze"];
  const topThree = ranked
    .slice(0, 3)
    .map((set: any, index: number) =>
      set.map((player: any) => ({
        ...player,
        id: player[idAttributeName],
        trophy: trophies[index],
        additionalText: additionalText.toLowerCase(),
        value: player.value,
      }))
    )
    .reduce((a: any, b: any) => a.concat(b));
  const topThreeSliced = topThree.slice(0, 3);

  const getCurrentPointsGained: any = (player: any) => {
    return (Object.values(player.gamePointsHistory).slice(-2).reduce((x: any, y: any) => y - x, 0))
  }

  return (
    <Grid
      container
      direction="row"
      justifyContent="center"
      alignItems="flex-start"
    >
      <Grid xs={12} className={"scoreBoardContainer"}>
        <Grid
          container
          direction="row"
          justifyContent="center"
          alignItems="center"
        >
          <Grid xs={12}>{renderTitle()}</Grid>
        </Grid>
        <Grid
          container
          direction="row"
          justifyContent="center"
          alignItems="flex-start"
        >
          <Grid xs={12}>
            {renderAdditionalInformation === undefined
              ? undefined
              : renderAdditionalInformation()}
          </Grid>
        </Grid>


        <Grid
          container
          direction="row"
          justifyContent="center"
          alignItems="flex-start"
        >

          <Grid xs className="PrizeCabinet">
            <ul style={{ display: 'flex', justifyContent: 'center', alignItems: 'center',
            minWidth:'20%'}}>
              {topThreeSliced.map((trophy: any, index: number) => {
                return (
                  <li
                    key={`${index}_li`}
                    className={`Trophy ${trophy.trophy} ${getCurrentUserStyling(
                      trophy.id
                    )}`}
                    style={{ textAlign: 'center', maxWidth:'20%' }}
                  >
                    <EmojiEventsIcon className="icon" name="trophy" />
                    <p className={`name`}> {trophy.username}</p>
                    <p className={`points`}>
                      {trophy[attributeToConsider]} {trophy.additionalText}
                    </p>
                  </li>
                );
              })}
            </ul>
          </Grid>
        </Grid>
        <Grid
          container
          direction="row"
          justifyContent="center"
          alignItems="flex-start"
        >
          <Grid xs>
            <Grid
              container
              direction="row"
              justifyContent="center"
              alignItems="flex-start"
              className="Board"
            >
              <Grid xs={12}>
                <TableContainer component={Paper}>
                  <Table sx={{ width: "100%" }} aria-label="simple table">
                    <TableHead>
                      <TableRow>
                        <TableCell className={"tableColumnHeader"}></TableCell>
                        <TableCell
                          className={"tableColumnHeader"}
                          align="right"
                        >
                          Username
                        </TableCell>
                        {
                          isScoreboard && (
                            <TableCell
                              className={"tableColumnHeader"}
                              align="right"
                            >
                              Points +
                            </TableCell>
                          )
                        }
                        <TableCell
                          className={"tableColumnHeader"}
                          align="right"
                        >
                          {columnHeaderText}
                        </TableCell>
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      {sortedParticipantsByScore.map((player: any, index: number): React.ReactNode => (
                        <TableRow
                          key={index}
                          sx={{
                            "&:last-child td, &:last-child th": { border: 0 },
                          }}
                          className={`Player ${getCurrentUserStyling(
                            player[idAttributeName]
                          )}`}
                        >
                          <TableCell
                            component="th"
                            scope="row"
                            className={"tableColumnEntries"}
                          >
                            {getPlacementString(player, ranked)}
                          </TableCell>
                          <TableCell
                            align="right"
                            className={"tableColumnEntries"}
                          >
                            {renderPlayerUsernameTableCell !== undefined ? (
                              renderPlayerUsernameTableCell(player)
                            ) : (
                              <>{player.username}</>
                            )}
                          </TableCell>
                          {
                            isScoreboard && (<TableCell
                              align="right"
                              className={"tableColumnEntries"}
                            >
                              {getCurrentPointsGained(player)}
                            </TableCell>)
                          }
                          <TableCell
                            align="right"
                            className={"tableColumnEntries"}
                          >
                            {renderPlayerValue(player)}
                          </TableCell>

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
          justifyContent="center"
          alignItems="flex-start"
        >
          <Grid xs>
            {renderInformationOnBottom === undefined
              ? undefined
              : renderInformationOnBottom()}
          </Grid>
        </Grid>
      </Grid>
      {props.children}
    </Grid>
  );
};
export default WinnerOverviewComponent;
