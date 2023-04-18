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

  let gameGetDTO2 = { ...gameGetDTO };

  switch (websocketPackage?.type) {
    case WebsocketType.GAMESTATEUPDATE:
      console.log("Updating game state to: " + websocketPackage.payload);
      gameGetDTO2.currentState = websocketPackage.payload;
      break;
    case WebsocketType.CATEGORYUPDATE:
      console.log("Updating category stack to: " + websocketPackage.payload);
      gameGetDTO2.categoryStack = websocketPackage.payload;
      break;
    case WebsocketType.TIMEUPDATE:
      console.log("Updating remaining time to: " + websocketPackage.payload);
      gameGetDTO2.remainingTime = websocketPackage.payload;
      break;
    case WebsocketType.POINTSUPDATE:
      console.log(
        "Updating remaining round points to: " + websocketPackage.payload
      );
      gameGetDTO2.remainingRoundPoints = websocketPackage.payload;
      break;
    case WebsocketType.PLAYERUPDATE:
      console.log("Updating players to: " + websocketPackage.payload);
      gameGetDTO2.participants = websocketPackage.payload;
      break;
    case WebsocketType.ROUNDUPDATE:
      console.log("Updating round to: " + websocketPackage.payload);
      gameGetDTO2.remainingRounds = websocketPackage.payload;
      break;
    case WebsocketType.GAMEUPDATE:
      console.log("Updating game to: " + websocketPackage.payload);
      gameGetDTO2 = { ...websocketPackage.payload };
  }
  return gameGetDTO2;
}
