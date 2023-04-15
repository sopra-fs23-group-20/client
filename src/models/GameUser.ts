import GameState from "./constant/GameState";

interface UserData {
  userId: number | null;
  username: string | null;
  gamePoints: number | null;
  currentState: GameState | null;
  hasAlreadyGuessed: boolean | null;
}

class GameUser {
  userId: number | null;
  username: string | null;
  gamePoints: number | null;
  currentState: GameState | null;
  hasAlreadyGuessed: boolean | null;

  constructor(
    data: UserData = {
      userId: null,
      username: null,
      gamePoints: null,
      currentState: null,
      hasAlreadyGuessed: null,
    }
  ) {
    this.userId = data.userId ?? null;
    this.username = data.username ?? null;
    this.gamePoints = data.gamePoints ?? null;
    this.currentState = data.currentState ?? null;
    this.hasAlreadyGuessed = data.hasAlreadyGuessed ?? null;
  }
}

export default GameUser;
