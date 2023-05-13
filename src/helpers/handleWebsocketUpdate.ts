import GameState from "models/constant/GameState";
import WebsocketType from "models/constant/WebsocketType";
import GameGetDTO from "models/GameGetDTO";
import WebsocketPackage from "models/WebsocketPacket";

export function convertToWebsocketTypeEnum(
  typeString: string
): WebsocketType | undefined {
  switch (typeString) {
    case "GAMESTATEUPDATE":
      return WebsocketType.GAMESTATEUPDATE;
    case "CATEGORYUPDATE":
      return WebsocketType.CATEGORYUPDATE;
    case "TIMEUPDATE":
      return WebsocketType.TIMEUPDATE;
    case "PLAYERUPDATE":
      return WebsocketType.PLAYERUPDATE;
    case "POINTSUPDATE":
      return WebsocketType.POINTSUPDATE;
    default:
      console.error(`Invalid WebsocketType string received: ${typeString}`);
      return undefined;
  }
}

export function convertToGameStateEnum(type: string | null): GameState | null {
  if (type === null) return null;
  switch (type) {
    case "SETUP":
      return GameState.SETUP;
    case "GUESSING":
      return GameState.GUESSING;
    case "SCOREBOARD":
      return GameState.SCOREBOARD;
    case "ENDED":
      return GameState.ENDED;
    default:
      console.error(`Invalid GameState string received: ${type}`);
      return null;
  }
}

export function updateGameGetDTO(
  gameGetDTO: GameGetDTO | null | undefined,
  websocketPackage: WebsocketPackage
): GameGetDTO | null {
  if (gameGetDTO === null || gameGetDTO === undefined) return null;

  let gameGetDTO2: any = { ...gameGetDTO };
  const participants = gameGetDTO2.participants;

  switch (websocketPackage?.type) {
    case WebsocketType.GAMESTATEUPDATE:
      gameGetDTO2.currentState = websocketPackage.payload;
      break;
    case WebsocketType.CATEGORYUPDATE:
      gameGetDTO2.categoryStack = websocketPackage.payload;
      break;
    case WebsocketType.TIMEUPDATE:
      gameGetDTO2.remainingTime = websocketPackage.payload;
      break;
    case WebsocketType.POINTSUPDATE:
      gameGetDTO2.remainingRoundPoints = websocketPackage.payload;
      break;
    case WebsocketType.PLAYERUPDATE:
      gameGetDTO2.participants = websocketPackage.payload;
      break;
    case WebsocketType.ROUNDUPDATE:
      gameGetDTO2.remainingRounds = websocketPackage.payload;
      break;
    case WebsocketType.GAMEUPDATE:
      gameGetDTO2 = { ...websocketPackage.payload };
  }

  const roundNumber =
    gameGetDTO2.remainingRounds === null
      ? 1
      : gameGetDTO2.numberOfRounds - gameGetDTO2.remainingRounds;

  if (
    !("gamePointsHistory" in gameGetDTO2.participants[0]) &&
    roundNumber === 1
  ) {
    gameGetDTO2.participants = gameGetDTO2.participants.map(
      (participant: any) => {
        participant["gamePointsHistory"] = {
          [roundNumber]: participant.gamePoints,
        };
        return participant;
      }
    );
  } else {
    gameGetDTO2.participants = gameGetDTO2.participants.map(
      (participant: any, index: any) => {
        participant["gamePointsHistory"] = {
          ...participants[index]["gamePointsHistory"],
          [roundNumber]: participant.gamePoints,
        };
        return participant;
      }
    );
  }
  return gameGetDTO2;
}
