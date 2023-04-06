import GameState from "models/constant/GameState";
import WebsocketType from "models/constant/WebsocketType";

export function convertToGameStateEnum(type: string): GameState | null {
    switch (type) {
        case "SETUP":
            return GameState.SETUP;
        case "GUESSING":
            return GameState.GUESSING;
        case "SCOREBOARD":
            return GameState.SCOREBOARD;
        case "Ended":
            return GameState.ENDED;
        default:
            console.error(`Invalid GameState string received: ${type}`);
            return null;
    }
}

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
        case "SCOREBOARDUPDATE":
            return WebsocketType.SCOREBOARDUPDATE;
        default:
            console.error(`Invalid WebsocketType string received: ${typeString}`);
            return undefined;
    }
}

