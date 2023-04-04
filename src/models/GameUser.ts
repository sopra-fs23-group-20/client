import GameState from "./GameState";

interface UserData {
    userId: number | null;
    username: string | null;
    gamePoints: number | null;
    currentState:  GameState | null;
}

class GameUser {
    userId: number | null;
    username: string | null;
    gamePoints: number | null;
    currentState: GameState | null;

    constructor(
        data: UserData = {
            userId: null,
            username: null,
            gamePoints: null,
            currentState: null,
        }
    ) {
        this.userId = data.userId ?? null;
        this.username = data.username ?? null;
        this.gamePoints = data.gamePoints ?? null;
        this.currentState = data.currentState ?? null;
    }
}

export default GameUser;
