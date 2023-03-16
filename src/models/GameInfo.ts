import GameState from "models/GameState";

interface GameInfoData{
    id: number | null;
    time: number | null;
    currentCountry: string | null;
    currentPopulation: number | null;
    gameState: string | null;
    creatorUsername: string | null;
    currentFlag: string | null;
    currentLongitude: number | null;
    currentLatitude: number | null;
}

class GameInfo{
    id: number | null;
    time: number    | null;
    currentCountry: string | null;
    currentPopulation: number | null;
    gameState: string | null;
    creatorUsername: string | null;
    currentFlag: string | null;
    currentLongitude: number | null;
    currentLatitude: number | null;

    constructor(data: GameInfoData = { id: null, time: null, currentCountry: null, currentPopulation: null, gameState: null, creatorUsername: null, currentFlag: null, currentLongitude: null, currentLatitude: null }) {
        this.id = data.id ?? null;
        this.time = data.time ?? null;
        this.currentCountry = data.currentCountry ?? null;
        this.currentPopulation = data.currentPopulation ?? null;
        this.gameState = data.gameState ?? null;
        this.creatorUsername = data.creatorUsername ?? null;
        this.currentFlag = data.currentFlag ?? null;
        this.currentLongitude = data.currentLongitude ?? null;
        this.currentLatitude = data.currentLatitude ?? null;
    }
}
export default GameInfo;